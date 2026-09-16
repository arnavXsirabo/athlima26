export const dynamic = 'force-dynamic';
import { createClient } from '@/utils/supabase/server';
import { Calendar, MapPin, Clock, Trophy } from 'lucide-react';

export const metadata = {
  title: 'Schedule | ATHLIMA 2026',
};

export default async function SchedulePage() {
  const supabase = createClient();
  
  // Fetch matches ordered by start_time
  const { data: matches, error } = await supabase
    .from('matches')
    .select(`
      *,
      sports (
        name
      )
    `)
    .order('start_time', { ascending: true });

  if (error) {
    console.error("Failed to fetch matches:", error);
  }

  // Group matches by date
  const groupedMatches = {};
  if (matches) {
    matches.forEach(match => {
      const date = new Date(match.start_time).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
      });
      if (!groupedMatches[date]) groupedMatches[date] = [];
      groupedMatches[date].push(match);
    });
  }

  return (
    <div className="page-wrapper bg-bone text-ink min-h-screen pb-20">
      <div className="pt-32 pb-12 bg-ink text-bone relative overflow-hidden">
        <div className="absolute inset-0 bg-noise opacity-5"></div>
        <div className="container relative z-10 text-center">
          <h1 className="text-fluid-h1 font-display text-orange-500 tracking-tight leading-none mb-4">
            EVENT <span className="text-bone">SCHEDULE</span>
          </h1>
          <p className="max-w-2xl mx-auto text-bone/70 text-lg sm:text-xl">
            Stay up to date with all the matches and events happening across ATHLIMA 2026.
          </p>
        </div>
      </div>

      <div className="container mt-12">
        {(!matches || matches.length === 0) ? (
          <div className="text-center py-20 bg-bone-dark/30 rounded-3xl border border-ink/5">
            <Calendar className="w-16 h-16 mx-auto text-ink/20 mb-4" />
            <h3 className="text-2xl font-bold mb-2">No Matches Scheduled Yet</h3>
            <p className="text-ink-light/70">The official schedule will be updated soon. Stay tuned!</p>
          </div>
        ) : (
          <div className="space-y-16">
            {Object.keys(groupedMatches).map(date => (
              <div key={date}>
                <h2 className="text-3xl font-display uppercase border-b-2 border-ink/10 pb-2 mb-8 sticky top-20 bg-bone/90 backdrop-blur-md z-10 pt-4">
                  {date}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groupedMatches[date].map(match => (
                    <div key={match.id} className="bg-bone-light rounded-2xl p-6 border border-ink/10 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                      {match.status === 'Ongoing' && (
                        <div className="absolute top-0 right-0 bg-orange-500 text-white text-[10px] font-bold uppercase px-3 py-1 tracking-wider flex items-center gap-1 rounded-bl-lg">
                          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                          Live
                        </div>
                      )}
                      {match.status === 'Completed' && (
                        <div className="absolute top-0 right-0 bg-ink text-bone text-[10px] font-bold uppercase px-3 py-1 tracking-wider rounded-bl-lg">
                          Final
                        </div>
                      )}
                      {match.status === 'Cancelled' && (
                        <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold uppercase px-3 py-1 tracking-wider rounded-bl-lg">
                          Cancelled
                        </div>
                      )}

                      <div className="mb-4">
                        <div className="text-orange-500 font-bold uppercase tracking-wider text-xs mb-1">
                          {match.sports?.name || 'Unknown Sport'} • {match.round}
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 mb-6">
                        <div className={`flex justify-between items-center p-3 rounded-lg ${match.winner_name === match.team1_name ? 'bg-orange-500/10 border border-orange-500/20' : 'bg-ink/5'}`}>
                          <span className={`font-bold ${match.winner_name === match.team1_name ? 'text-orange-600' : 'text-ink'}`}>{match.team1_name}</span>
                          <span className="font-display text-2xl leading-none">{match.team1_score ?? '-'}</span>
                        </div>
                        <div className={`flex justify-between items-center p-3 rounded-lg ${match.winner_name === match.team2_name ? 'bg-orange-500/10 border border-orange-500/20' : 'bg-ink/5'}`}>
                          <span className={`font-bold ${match.winner_name === match.team2_name ? 'text-orange-600' : 'text-ink'}`}>{match.team2_name}</span>
                          <span className="font-display text-2xl leading-none">{match.team2_score ?? '-'}</span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-ink/10 flex flex-col gap-2 text-sm text-ink-light">
                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-orange-500" />
                          <span>
                            {new Date(match.start_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} 
                            {' - '}
                            {new Date(match.end_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={16} className="text-orange-500" />
                          <span>{match.location}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
