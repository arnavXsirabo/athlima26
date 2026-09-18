import Link from 'next/link';
import { Home, Users, Trophy, Calendar, Settings } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import LogoutButton from '@/components/admin/LogoutButton';
import './Admin.css';

export const metadata = {
  title: 'Admin Dashboard | ATHLIMA 2026',
  description: 'Athlima 2026 Admin Dashboard',
};

export default async function AdminLayout({ children }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let profile = null;
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('name, role')
      .eq('id', user.id)
      .single();
    profile = data;
  }
  
  const initials = profile?.name ? profile.name.substring(0, 2).toUpperCase() : 'AU';
  const roleDisplay = profile?.role ? profile.role.replace('_', ' ') : 'Admin';
  return (
    <div className="flex h-screen bg-[#111] text-bone font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1c1a17] border-r border-bone/10 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-bone/10">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center font-display text-white text-xl">A</div>
            <div>
              <h2 className="font-display text-xl leading-none text-orange-400">ATHLIMA</h2>
              <p className="text-[10px] uppercase font-bold text-bone/50 tracking-widest">Admin Panel</p>
            </div>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-orange-500/10 text-bone/80 hover:text-orange-400 transition-colors">
            <Home size={18} />
            <span className="font-bold text-sm">Dashboard</span>
          </Link>
          <Link href="/admin/registrations" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-orange-500/10 text-bone/80 hover:text-orange-400 transition-colors">
            <Users size={18} />
            <span className="font-bold text-sm">Registrations</span>
          </Link>
          <Link href="/admin/sports" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-orange-500/10 text-bone/80 hover:text-orange-400 transition-colors">
            <Trophy size={18} />
            <span className="font-bold text-sm">Sports</span>
          </Link>
          <Link href="/admin/schedules" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-orange-500/10 text-bone/80 hover:text-orange-400 transition-colors">
            <Calendar size={18} />
            <span className="font-bold text-sm">Schedules</span>
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-orange-500/10 text-bone/80 hover:text-orange-400 transition-colors">
            <Settings size={18} />
            <span className="font-bold text-sm">Settings</span>
          </Link>
        </nav>
        
        <div className="p-4 border-t border-bone/10">
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Topbar for mobile + user info */}
        <header className="h-16 bg-[#1c1a17]/50 backdrop-blur border-b border-bone/10 flex items-center justify-between px-6 shrink-0">
          <div className="md:hidden font-display text-xl text-orange-400">ATHLIMA ADMIN</div>
          <div className="flex-1 md:flex hidden justify-center">
            {/* Removed Development Mode Badge */}
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-bold text-bone">{profile?.name || 'Admin User'}</div>
              <div className="text-xs text-bone/50 capitalize">{roleDisplay}</div>
            </div>
            <div className="w-10 h-10 rounded bg-orange-900/50 border border-orange-500/30 flex items-center justify-center text-orange-400 font-bold uppercase">
              {initials}
            </div>
          </div>
        </header>
        
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#111]">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
