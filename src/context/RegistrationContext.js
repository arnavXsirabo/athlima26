'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

const RegistrationContext = createContext();

export function RegistrationProvider({ children }) {
  // Supabase dynamic data
  const [sports, setSports] = useState([]);
  const [isLoadingSports, setIsLoadingSports] = useState(true);
  const [sportsError, setSportsError] = useState(null);

  // Array of sport IDs the user has selected
  const [selectedSports, setSelectedSports] = useState([]);
  const [participantData, setParticipantData] = useState({
    collegeName: '',
    teamName: '',
    contactEmail: '',
    contactPhone: '',
  });

  const [sportPlayers, setSportPlayers] = useState({});

  useEffect(() => {
    const fetchSports = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('sports')
          .select('*')
          .eq('status', 'OPEN')
          .order('name');
        
        if (error) throw error;
        
        const mappedSports = data.map(s => ({
          ...s,
          minPlayers: s.min_players,
          maxPlayers: s.max_players
        }));
        
        setSports(mappedSports);
      } catch (err) {
        console.error("Failed to fetch sports:", err);
        setSportsError("Failed to load sports data. Please try again later.");
      } finally {
        setIsLoadingSports(false);
      }
    };
    
    fetchSports();
  }, []);

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
      sports,
      isLoadingSports,
      sportsError,
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
