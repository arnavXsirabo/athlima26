'use client';
import { RegistrationProvider, useRegistration } from '@/context/RegistrationContext';
import SportSelector from '@/components/registration/SportSelector';
import TeamForm from '@/components/registration/TeamForm';
import { ATHLIMA_SPORTS } from '@/data/sports';
import { useState } from 'react';
import './page.css';

function RegistrationContent() {
  const { selectedSports, participantData } = useRegistration();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(1);

  const totalAmount = selectedSports.reduce((total, sportId) => {
    const sport = ATHLIMA_SPORTS.find(s => s.id === sportId);
    return total + (sport ? sport.price : 0);
  }, 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedSports.length === 0) {
      alert("Please select at least one sport to register.");
      return;
    }
    
    if (step === 1) {
      setStep(2);
      window.scrollTo(0, 0);
      return;
    }
    if (step === 2) {
      setStep(3);
      window.scrollTo(0, 0);
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
        <button onClick={() => window.location.href = '/'} className="px-6 py-3 bg-orange-500 text-white rounded font-bold uppercase mt-4">Back to Home</button>
      </div>
    );
  }

  return (
    <div className="registration-container">
      <div className="registration-header">
        <h1>REGISTER NOW</h1>
        <p>
          {step === 1 && "Secure your spot in the arena. Choose your sport and represent your college."}
          {step === 2 && "Enter your player details and rosters."}
          {step === 3 && "Review your registration and complete the payment."}
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="flex justify-center gap-4 mb-12">
        <div className={`h-2 flex-1 rounded ${step >= 1 ? 'bg-orange-500' : 'bg-bone/20'}`}></div>
        <div className={`h-2 flex-1 rounded ${step >= 2 ? 'bg-orange-500' : 'bg-bone/20'}`}></div>
        <div className={`h-2 flex-1 rounded ${step >= 3 ? 'bg-orange-500' : 'bg-bone/20'}`}></div>
      </div>

      <form onSubmit={handleSubmit} className="registration-form-wrapper">
        {step === 1 && <SportSelector />}
        <TeamForm step={step} />
        
        {step === 3 && (
          <div className="p-8 bg-[#1c1a17]/80 rounded-lg border border-orange-900/40 shadow-xl mb-12 text-center">
            <h3 className="text-3xl font-display text-bone mb-4">Payment Summary</h3>
            <p className="text-bone/70 mb-8 max-w-2xl mx-auto">Please review your selected sports and total fee. Upon clicking Complete Registration, you will be redirected to our secure payment gateway to finalize your registration.</p>
            
            <div className="inline-block text-left bg-black/40 p-6 rounded border border-bone/10 mb-8 min-w-[300px]">
              {selectedSports.map(id => {
                const s = ATHLIMA_SPORTS.find(x => x.id === id);
                return (
                  <div key={id} className="flex justify-between items-center mb-2 pb-2 border-b border-bone/5 last:border-0 last:pb-0 last:mb-0">
                    <span className="text-bone/80">{s.name}</span>
                    <span className="text-orange-400 font-bold">₹ {s.price}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
        
        <div className="flex flex-col md:flex-row justify-between items-center bg-[#1c1a17]/80 p-8 rounded-lg border border-bone/10 mt-12 shadow-2xl">
          <div className="mb-6 md:mb-0 flex items-center gap-8">
            {step > 1 && (
              <button 
                type="button" 
                onClick={() => setStep(step - 1)} 
                className="px-6 py-3 bg-transparent border border-bone/20 hover:border-bone/50 text-bone rounded font-bold uppercase tracking-wider transition-colors"
              >
                Back
              </button>
            )}
            <div className="text-center md:text-left">
              <div className="text-bone/70 text-sm font-bold uppercase mb-1 tracking-widest">Total Registration Fee</div>
              <div className="text-4xl font-display text-orange-400">₹ {totalAmount}</div>
            </div>
          </div>
          <button 
            type="submit" 
            className="px-10 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded font-bold uppercase tracking-wider transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto mt-6 md:mt-0" 
            disabled={isSubmitting || selectedSports.length === 0}
          >
            {isSubmitting ? 'Processing...' : (step === 1 ? 'Next: Player Details' : (step === 2 ? 'Next: Payment' : 'Complete Registration'))}
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
