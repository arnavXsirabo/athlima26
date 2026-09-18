"use client";

import { LogOut } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh(); // Clear server cache
  };

  return (
    <button 
      onClick={handleLogout}
      disabled={loading}
      className="flex items-center gap-3 px-4 py-3 w-full rounded-lg hover:bg-red-500/10 text-bone/60 hover:text-red-400 transition-colors text-left disabled:opacity-50"
    >
      <LogOut size={18} />
      <span className="font-bold text-sm">{loading ? 'Signing out...' : 'Sign Out'}</span>
    </button>
  );
}
