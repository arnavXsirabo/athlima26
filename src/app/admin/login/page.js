"use client";

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';

function LoginContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  // If redirected from proxy with unauthorized error
  const unauthorizedError = searchParams.get('error') === 'unauthorized';

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    // On success, redirect to admin dashboard. The proxy will handle role verification.
    router.push('/admin');
    router.refresh(); // Ensure layout refetches user data
  };

  return (
    <div className="min-h-screen bg-[#111] flex flex-col items-center justify-center p-6 text-bone font-sans">
      <div className="w-full max-w-md bg-[#1c1a17]/80 p-8 rounded-xl border border-bone/10 shadow-2xl backdrop-blur-sm">
        
        <div className="flex justify-center mb-8">
          <Image
            src="/LOGO/wordmark_transparent_v2.png"
            alt="Athlima 2026 Logo"
            width={240}
            height={60}
            className="h-12 w-auto object-contain drop-shadow-xl"
            priority
          />
        </div>

        <h1 className="text-2xl font-display text-orange-400 mb-2 text-center uppercase tracking-widest">Admin Access</h1>
        <p className="text-bone/60 text-sm text-center mb-8">Authenticate to manage ATHLIMA 2026</p>

        {unauthorizedError && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-sm text-center font-bold">
            Access Denied: You do not have the required administrative permissions.
            {searchParams.get('details') && (
              <div className="mt-2 text-xs opacity-80 font-mono">
                Reason: {searchParams.get('details')}
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-sm text-center font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-bone/70 uppercase tracking-wider">Email</label>
            <input 
              type="email" 
              required
              className="px-4 py-3 bg-black/40 border border-bone/20 rounded focus:border-orange-500 text-bone outline-none transition-colors"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-bone/70 uppercase tracking-wider">Password</label>
            <input 
              type="password" 
              required
              className="px-4 py-3 bg-black/40 border border-bone/20 rounded focus:border-orange-500 text-bone outline-none transition-colors"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-4 px-6 py-4 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Authenticating...
              </>
            ) : (
              'Secure Login'
            )}
          </button>
        </form>

      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#111] flex items-center justify-center text-orange-400">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
