import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function proxy(request) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const { data: { user } } = await supabase.auth.getUser()

  const url = request.nextUrl.clone()
  
  // Protect /admin routes
  if (url.pathname.startsWith('/admin') && url.pathname !== '/admin/login') {
    if (!user) {
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }

    // Role verification
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const allowedRoles = ['super_admin', 'admin', 'sports_coordinator']
    
    if (!profile || !allowedRoles.includes(profile.role)) {
      url.pathname = '/admin/login'
      url.searchParams.set('error', 'unauthorized')
      return NextResponse.redirect(url)
    }
  }

  // Prevent logged-in users with a valid admin role from seeing the login page
  // IMPORTANT: if user is logged in but has NO valid role, let them stay on /admin/login
  // so they can see the "unauthorized" error — avoids an infinite redirect loop.
  if (url.pathname === '/admin/login' && user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const allowedRoles = ['super_admin', 'admin', 'sports_coordinator']

    if (profile && allowedRoles.includes(profile.role)) {
      // Valid admin — redirect away from login to dashboard
      url.pathname = '/admin'
      url.searchParams.forEach((_, key) => url.searchParams.delete(key))
      return NextResponse.redirect(url)
    }
    // No valid role — fall through and let them see the login page with the error message
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
