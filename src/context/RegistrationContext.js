'use client';
import { createContext, useContext, useState } from 'react';
import { ATHLIMA_SPORTS, getSportRegistrationStatus } from '@/data/sports';

const RegistrationContext = createContext();

export function RegistrationProvider({ children }) {
  // Array of sport IDs the user has selected
  const [selectedSports, setSelectedSports] = useState([]);
  const [participantData, setParticipantData] = useState({
    collegeName: '',
    teamName: '',
    contactEmail: '',
    contactPhone: '',
  });

  const toggleSportSelection = (sportId) => {
    const sportInfo = ATHLIMA_SPORTS.find(s => s.id === sportId);
    
    // Simulate fetching current registration count - using a mock static 0 for now
    // In reality, this would check against the backend
    const currentRegCount = 0; 
    
    if (getSportRegistrationStatus(currentRegCount, sportInfo.capacity) === 'FULL') {
      return; // Cannot select full sport
    }

    setSelectedSports((prev) => {
      if (prev.includes(sportId)) {
        return prev.filter(id => id !== sportId);
      } else {
        return [...prev, sportId];
      }
    });
  };

  const updateParticipantData = (field, value) => {
    setParticipantData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <RegistrationContext.Provider value={{
      selectedSports,
      toggleSportSelection,
      participantData,
      updateParticipantData
    }}>
      {children}
    </RegistrationContext.Provider>
  );
}

export function useRegistration() {
  return useContext(RegistrationContext);
}
