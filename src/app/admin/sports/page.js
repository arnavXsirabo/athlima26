import { createClient } from '@/utils/supabase/server';
import SportsClient from './SportsClient';

export default async function AdminSportsPage() {
  const supabase = createClient();

  const { data: sports, error } = await supabase
    .from('sports')
    .select(`
      *,
      registration_sports (count)
    `)
    .order('name');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display text-bone">Sports Management</h1>
        <p className="text-bone/60 mt-1">Manage capacities and registration status for all sports.</p>
      </div>

      <SportsClient initialData={sports || []} />
    </div>
  );
}
