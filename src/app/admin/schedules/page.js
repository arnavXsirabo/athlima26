import { createClient } from '@/utils/supabase/server';
import SchedulesClient from './SchedulesClient';

export default async function SchedulesPage() {
  const supabase = createClient();
  
  // Fetch all sports for the dropdown
  const { data: sports, error: sportsError } = await supabase
    .from('sports')
    .select('id, name')
    .order('name');
    
  // Fetch all matches
  const { data: matches, error: matchesError } = await supabase
    .from('matches')
    .select(`
      *,
      sports (
        name
      )
    `)
    .order('start_time', { ascending: true });

  if (sportsError) {
    console.error('Error fetching sports for schedules:', sportsError);
  }

  if (matchesError) {
    console.error('Error fetching matches:', matchesError);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-display text-orange-400">Manage Schedules</h1>
          <p className="text-bone/50 text-sm mt-1">Create and manage tournament matches and scores.</p>
        </div>
      </div>
      <SchedulesClient initialMatches={matches || []} sports={sports || []} />
    </div>
  );
}
