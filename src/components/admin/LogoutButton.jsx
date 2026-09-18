'use client';

import { LogOut } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh(); // Refresh to update layout state
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-3 px-4 py-3 w-full rounded-lg hover:bg-red-500/10 text-bone/60 hover:text-red-400 transition-colors text-left"
    >
      <LogOut size={18} />
      <span className="font-bold text-sm">Sign Out</span>
    </button>
  );
}
