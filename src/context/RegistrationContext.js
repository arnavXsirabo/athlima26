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

  const [sportPlayers, setSportPlayers] = useState({});

  const toggleSportSelection = (sportId) => {
    setSelectedSports((prev) => {
      if (prev.includes(sportId)) {
        // Remove sport and its player data
        setSportPlayers(players => {
          const newPlayers = { ...players };
          delete newPlayers[sportId];
          return newPlayers;
        });
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

  const updateSportPlayer = (sportId, index, name) => {
    setSportPlayers(prev => {
      const currentSportPlayers = prev[sportId] || [];
      const newSportPlayers = [...currentSportPlayers];
      newSportPlayers[index] = name;
      return {
        ...prev,
        [sportId]: newSportPlayers
      };
    });
  };

  return (
    <RegistrationContext.Provider value={{
      selectedSports,
      toggleSportSelection,
      participantData,
      updateParticipantData,
      sportPlayers,
      updateSportPlayer
    }}>
      {children}
    </RegistrationContext.Provider>
  );
}

export function useRegistration() {
  return useContext(RegistrationContext);
}
