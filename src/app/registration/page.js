'use client';
import { RegistrationProvider, useRegistration } from '@/context/RegistrationContext';
import SportSelector from '@/components/registration/SportSelector';
import TeamForm from '@/components/registration/TeamForm';
import { useState } from 'react';
import './page.css';

function RegistrationContent() {
  const { selectedSports, participantData } = useRegistration();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedSports.length === 0) {
      alert("Please select at least one sport to register.");
      return;
    }
    
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
    }, 1500);
  };

  if (success) {
    return (
      <div className="registration-success">
        <h2>REGISTRATION SUCCESSFUL</h2>
        <p>Thank you for registering for ATHLIMA 2026. We will contact you soon with further details.</p>
        <Button href="/">Back to Home</Button>
      </div>
    );
  }

  return (
    <div className="registration-container">
      <div className="registration-header">
        <h1>REGISTER NOW</h1>
        <p>Secure your spot in the arena. Choose your sport and represent your college.</p>
      </div>

      <form onSubmit={handleSubmit} className="registration-form-wrapper">
        <SportSelector />
        <TeamForm />
        
        <div className="registration-submit-area">
          <div className="summary">
            Selected Sports: <strong>{selectedSports.length}</strong>
          </div>
          <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded font-medium disabled:opacity-50" disabled={isSubmitting || selectedSports.length === 0}>
            {isSubmitting ? 'Processing...' : 'Complete Registration'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function RegistrationPage() {
  return (
    <div className="page-wrapper bg-ink text-bone">
      <div className="container">
        <RegistrationProvider>
          <RegistrationContent />
        </RegistrationProvider>
      </div>
    </div>
  );
}
