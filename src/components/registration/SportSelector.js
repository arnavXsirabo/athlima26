'use client';
import { useRegistration } from '@/context/RegistrationContext';
import { cn } from '@/lib/utils';
import './Registration.css';

export default function SportSelector() {
  const { selectedSports, toggleSportSelection, sports, isLoadingSports, sportsError } = useRegistration();

  if (isLoadingSports) {
    return (
      <div className="registration-section !bg-transparent !border-0 !p-0 !shadow-none mb-12">
        <div className="mb-8">
          <h3 className="text-2xl font-display text-bone mb-2">1. SELECT YOUR SPORTS</h3>
          <p className="text-bone/60 text-sm">You can select multiple sports. We will collect player details for each selected sport.</p>
        </div>
        <div className="text-center py-20 text-orange-400 font-bold tracking-widest uppercase">
          <span className="animate-pulse">Loading sports...</span>
        </div>
      </div>
    );
  }

  if (sportsError) {
    return (
      <div className="registration-section !bg-transparent !border-0 !p-0 !shadow-none mb-12">
        <div className="mb-8">
          <h3 className="text-2xl font-display text-bone mb-2">1. SELECT YOUR SPORTS</h3>
        </div>
        <div className="text-center py-20 text-red-500 font-bold tracking-widest uppercase bg-[#1c1a17]/80 rounded-lg border border-red-900/30 p-8">
          {sportsError}
        </div>
      </div>
    );
  }

  return (
    <div className="registration-section !bg-transparent !border-0 !p-0 !shadow-none mb-12">
      <div className="mb-8">
        <h3 className="text-2xl font-display text-bone mb-2">1. SELECT YOUR SPORTS</h3>
        <p className="text-bone/60 text-sm">You can select multiple sports. We will collect player details for each selected sport.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sports.map(sport => {
          const isSelected = selectedSports.includes(sport.id);

          return (
            <button
              key={sport.id}
              onClick={() => toggleSportSelection(sport.id)}
              type="button"
              className={cn(
                "relative flex flex-col text-left p-5 rounded-lg border transition-all duration-300",
                "bg-[#1c1a17]/80 backdrop-blur-sm",
                isSelected 
                  ? "border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.2)]" 
                  : "border-orange-900/30 hover:border-orange-500/50"
              )}
            >
              {/* Selected Checkmark */}
              {isSelected && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                  ✓
                </div>
              )}

              {/* Title & Price */}
              <div className="flex justify-between items-start w-full mb-4">
                <span className="font-bold text-bone text-lg">{sport.name}</span>
              </div>

              {/* Badges & Price Row */}
              <div className="flex justify-between items-center w-full mb-4">
                <span className="px-2 py-1 rounded bg-orange-900/40 text-orange-400 text-xs font-medium border border-orange-800/30">
                  {sport.category}
                </span>
                <span className="text-orange-400 font-bold tracking-wide">
                  ₹ {sport.price}
                </span>
              </div>

              {/* Participants */}
              <div className="flex items-center gap-2 text-bone/50 text-sm mt-auto">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                <span>
                  {sport.minPlayers === sport.maxPlayers 
                    ? (sport.minPlayers === 1 ? 'Individual' : `${sport.minPlayers} participants`)
                    : `${sport.minPlayers}-${sport.maxPlayers} participants`}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
