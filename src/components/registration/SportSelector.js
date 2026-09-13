'use client';
import { useRegistration } from '@/context/RegistrationContext';
import { ATHLIMA_SPORTS, getSportRegistrationStatus } from '@/data/sports';
import './Registration.css';

export default function SportSelector() {
  const { selectedSports, toggleSportSelection } = useRegistration();

  // Mock function to simulate backend data
  // Since we don't have the backend, we assign some fake registration counts for testing the UI
  const getMockRegCount = (sportId) => {
    if (sportId === 'basketball-men') return 8; // FULL
    if (sportId === 'football') return 6; // LIMITED
    return 2; // OPEN
  };

  return (
    <div className="registration-section">
      <h3 className="registration-subtitle">1. SELECT YOUR SPORTS</h3>
      <p className="registration-hint">You can select multiple sports. Each sport has a strict limit of 8 teams/participants.</p>
      
      <div className="sport-selector-grid">
        {ATHLIMA_SPORTS.map(sport => {
          const currentCount = getMockRegCount(sport.id);
          const status = getSportRegistrationStatus(currentCount, sport.capacity);
          const isSelected = selectedSports.includes(sport.id);
          const isFull = status === 'FULL';

          return (
            <button
              key={sport.id}
              className={`sport-select-card ${isSelected ? 'selected' : ''} ${isFull ? 'full' : ''}`}
              onClick={() => !isFull && toggleSportSelection(sport.id)}
              disabled={isFull}
              type="button"
            >
              <div className="sport-select-header">
                <span className="sport-select-name">{sport.name}</span>
                <span className={`status-badge ${status.toLowerCase()}`}>{status}</span>
              </div>
              <div className="sport-select-meta">
                <span>{sport.category}</span>
                <span>{currentCount} / {sport.capacity} SLOTS FILLED</span>
              </div>
              {isSelected && <div className="selected-indicator">✓</div>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
