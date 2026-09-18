import { createClient } from '@/utils/supabase/server';
import RegistrationsClient from './RegistrationsClient';

export default async function AdminRegistrationsPage() {
  const supabase = await createClient();

  // Fetch all registrations with their selected sports and players
  const { data: registrations, error } = await supabase
    .from('registrations')
    .select(`
      *,
      registration_sports (
        sports (id, name)
      ),
      registration_players (
        id, sport_id, player_name, is_captain
      )
    `)
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display text-bone">Registrations</h1>
        <p className="text-bone/60 mt-1">Manage and verify all ATHLIMA 2026 registrations.</p>
      </div>

      <RegistrationsClient initialData={registrations || []} />
    </div>
  );
}
