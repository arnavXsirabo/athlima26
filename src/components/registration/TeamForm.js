'use client';
import { useRegistration } from '@/context/RegistrationContext';
import { ATHLIMA_SPORTS } from '@/data/sports';

export default function TeamForm({ step }) {
  const { participantData, updateParticipantData, selectedSports, sportPlayers, updateSportPlayer } = useRegistration();

  if (selectedSports.length === 0) return null;
  if (step > 2) return null;

  return (
    <div className="registration-section !bg-transparent !border-0 !p-0 !shadow-none mb-12">
      {step === 1 && (
        <h3 className="text-2xl font-display text-bone mb-6">2. GENERAL CONTACT</h3>
      )}
      
      {/* General Information (Step 1) */}
      {step === 1 && (
        <div className="mb-10 p-6 bg-[#1c1a17]/80 rounded-lg border border-bone/10 shadow-lg">
        <h4 className="text-lg font-bold text-bone mb-4">General Contact</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="collegeName" className="text-xs font-bold text-bone/70 uppercase">College Name *</label>
            <input 
              type="text" id="collegeName" required
              className="px-4 py-3 bg-black/40 border border-bone/20 rounded focus:border-orange-500 text-bone outline-none"
              placeholder="Enter your college name"
              value={participantData.collegeName}
              onChange={(e) => updateParticipantData('collegeName', e.target.value)}
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label htmlFor="teamName" className="text-xs font-bold text-bone/70 uppercase">Contingent Name *</label>
            <input 
              type="text" id="teamName" required
              className="px-4 py-3 bg-black/40 border border-bone/20 rounded focus:border-orange-500 text-bone outline-none"
              placeholder="E.g. SMIT Titans"
              value={participantData.teamName}
              onChange={(e) => updateParticipantData('teamName', e.target.value)}
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label htmlFor="contactEmail" className="text-xs font-bold text-bone/70 uppercase">Contact Email *</label>
            <input 
              type="email" id="contactEmail" required
              className="px-4 py-3 bg-black/40 border border-bone/20 rounded focus:border-orange-500 text-bone outline-none"
              placeholder="captain@example.com"
              value={participantData.contactEmail}
              onChange={(e) => updateParticipantData('contactEmail', e.target.value)}
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label htmlFor="contactPhone" className="text-xs font-bold text-bone/70 uppercase">Contact Phone *</label>
            <input 
              type="tel" id="contactPhone" required
              className="px-4 py-3 bg-black/40 border border-bone/20 rounded focus:border-orange-500 text-bone outline-none"
              placeholder="+91 xxxxx xxxxx"
              value={participantData.contactPhone}
              onChange={(e) => updateParticipantData('contactPhone', e.target.value)}
            />
          </div>
        </div>
      </div>
      )}

      {/* Dynamic Rosters (Step 2) */}
      {step === 2 && (
        <div className="space-y-6">
          <h3 className="text-2xl font-display text-bone mb-6">3. PLAYER DETAILS</h3>
        {selectedSports.map(sportId => {
          const sport = ATHLIMA_SPORTS.find(s => s.id === sportId);
          if (!sport) return null;

          return (
            <div key={sportId} className="p-6 bg-[#1c1a17]/80 rounded-lg border border-orange-900/40 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-bone/10">
                <h4 className="text-xl font-display text-orange-400 m-0">{sport.name} Roster</h4>
                <span className="text-bone/60 text-sm">
                  {sport.minPlayers === sport.maxPlayers 
                    ? `${sport.minPlayers} required` 
                    : `Min ${sport.minPlayers}, Max ${sport.maxPlayers}`}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(sport.maxPlayers)].map((_, index) => {
                  const isRequired = index < sport.minPlayers;
                  const isCaptain = index === 0 && sport.maxPlayers > 1;
                  
                  return (
                    <div key={index} className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-bone/60 uppercase">
                        {sport.maxPlayers === 1 ? 'Participant Name' : (isCaptain ? 'Captain Name' : `Player ${index + 1}`)} {isRequired ? '*' : '(Optional)'}
                      </label>
                      <input
                        type="text"
                        required={isRequired}
                        value={sportPlayers[sportId]?.[index] || ''}
                        onChange={(e) => updateSportPlayer(sportId, index, e.target.value)}
                        className="px-4 py-2 bg-black/40 border border-bone/10 rounded focus:border-orange-500 text-bone text-sm outline-none transition-colors"
                        placeholder="Full Name"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        </div>
      )}
    </div>
  );
}
