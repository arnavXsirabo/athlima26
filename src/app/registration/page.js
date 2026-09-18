'use client';
import { RegistrationProvider, useRegistration } from '@/context/RegistrationContext';
import SportSelector from '@/components/registration/SportSelector';
import TeamForm from '@/components/registration/TeamForm';
import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { QRCodeSVG } from 'qrcode.react';
import './page.css';

function RegistrationContent() {
  const { selectedSports, participantData, sports, sportPlayers } = useRegistration();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(1);
  const [submitError, setSubmitError] = useState(null);
  const [registrationNumber, setRegistrationNumber] = useState(null);
  const [paymentUtr, setPaymentUtr] = useState('');
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);

  const totalAmount = selectedSports.reduce((total, sportId) => {
    const sport = sports.find(s => s.id === sportId);
    return total + (sport ? sport.price : 0);
  }, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
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

    try {
      const trimmedUtr = paymentUtr.trim();
      if (!trimmedUtr) throw new Error("Please enter your payment UTR / Transaction ID.");
      if (!paymentScreenshot) throw new Error("Please upload a payment screenshot.");

      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(paymentScreenshot.type)) {
        throw new Error("Invalid screenshot format. Only JPG, PNG, and WebP are allowed.");
      }

      if (paymentScreenshot.size > 5 * 1024 * 1024) {
        throw new Error("Screenshot is too large. Maximum size is 5MB.");
      }

      const payloadPlayers = {};

      for (const sportId of selectedSports) {
        const sport = sports.find(s => s.id === sportId);
        if (!sport) throw new Error(`Selected sport not found in active sports list.`);

        const rawPlayers = sportPlayers[sportId] || [];
        let validPlayerCount = 0;
        const processedPlayers = [];

        for (let i = 0; i < sport.maxPlayers; i++) {
          const playerName = (rawPlayers[i] || '').trim();
          if (playerName) {
            validPlayerCount++;
            processedPlayers.push({
              name: playerName,
              is_captain: i === 0 && sport.maxPlayers > 1,
              player_index: i + 1
            });
          } else if (i < sport.minPlayers) {
            throw new Error(`Please provide all required player names for ${sport.name}.`);
          }
        }

        if (validPlayerCount < sport.minPlayers) {
          throw new Error(`You must provide at least ${sport.minPlayers} player(s) for ${sport.name}.`);
        }
        if (validPlayerCount > sport.maxPlayers) {
          throw new Error(`You cannot exceed ${sport.maxPlayers} player(s) for ${sport.name}.`);
        }

        payloadPlayers[sportId] = processedPlayers;
      }

      const supabase = createClient();

      const fileExt = paymentScreenshot.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('payment-screenshots')
        .upload(fileName, paymentScreenshot);

      if (uploadError) {
        console.error("Storage Error:", uploadError);
        throw new Error("Failed to upload screenshot. Please try again.");
      }

      const payload = {
        college_name: participantData.collegeName,
        team_name: participantData.teamName,
        contact_email: participantData.contactEmail,
        contact_phone: participantData.contactPhone,
        payment_utr: trimmedUtr,
        payment_screenshot_path: uploadData.path,
        sports: selectedSports,
        players: payloadPlayers
      };

      const { data, error } = await supabase.rpc('submit_registration', { payload });

      if (error) {
        if (error.message.includes("not found")) {
          throw new Error("One or more selected sports are invalid or no longer exist.");
        } else if (error.message.includes("full capacity")) {
          throw new Error("One or more selected sports have reached full capacity.");
        } else if (error.message.includes("Registration is closed")) {
          throw new Error("Registration is closed for one or more selected sports.");
        } else {
          console.error("Backend Error:", error);
          throw new Error("An error occurred while submitting your registration. Please try again.");
        }
      }

      if (data && data.success) {
        setRegistrationNumber(data.registration_number);
        setSuccess(true);
      } else {
        throw new Error("Registration failed. Please try again.");
      }

    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="registration-success">
        <h2>REGISTRATION SUCCESSFUL</h2>
        <p>Thank you for registering for ATHLIMA 2026. We will contact you soon with further details.</p>
        <div className="my-8 p-6 bg-ink border border-orange-500/30 rounded-lg inline-block">
          <p className="text-sm text-bone/60 uppercase tracking-widest mb-2">Your Registration Number</p>
          <p className="text-3xl font-display text-orange-400">{registrationNumber}</p>
        </div>
        <br />
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
            <p className="text-bone/70 mb-8 max-w-2xl mx-auto">Please review your selected sports and total fee. Pay using the QR code or details below, then enter your transaction ID (UTR) and upload a screenshot of the successful payment.</p>

            <div className="inline-block text-left bg-black/40 p-6 rounded border border-bone/10 mb-8 w-full max-w-sm mx-auto">
              {selectedSports.map(id => {
                const s = sports.find(x => x.id === id);
                if (!s) return null;
                return (
                  <div key={id} className="flex justify-between items-center mb-2 pb-2 border-b border-bone/5 last:border-0 last:pb-0 last:mb-0">
                    <span className="text-bone/80">{s.name}</span>
                    <span className="text-orange-400 font-bold">₹ {s.price}</span>
                  </div>
                )
              })}
            </div>

            <div className="max-w-md mx-auto text-center bg-black/40 p-8 rounded-lg border border-orange-500/30 mb-8 shadow-lg">
              <h4 className="text-xl font-bold text-bone mb-6 uppercase tracking-widest text-orange-400">Scan to Pay</h4>
              <div className="bg-white p-4 rounded-xl inline-block mb-6">
                <QRCodeSVG 
                  value={`upi://pay?pa=7321933610@ybl&pn=ATHLIMA%202026&am=${totalAmount}&cu=INR`} 
                  size={192} 
                  level="H" 
                  includeMargin={true}
                />
              </div>
              <div className="text-bone/80 text-sm mb-2">UPI ID</div>
              <div className="text-2xl font-mono font-bold text-bone bg-black/60 py-3 px-6 rounded border border-bone/10 tracking-wider">
                7321933610@ybl
              </div>
            </div>

            <div className="max-w-md mx-auto text-left bg-black/20 p-6 rounded-lg border border-bone/10">
              <h4 className="text-xl font-bold text-bone mb-4">Payment Verification</h4>

              <div className="flex flex-col gap-2 mb-4">
                <label htmlFor="utr" className="text-xs font-bold text-bone/70 uppercase">Transaction ID (UTR) *</label>
                <input
                  type="text" id="utr" required
                  className="px-4 py-3 bg-black/40 border border-bone/20 rounded focus:border-orange-500 text-bone outline-none"
                  placeholder="Enter UTR / Ref Number"
                  value={paymentUtr}
                  onChange={(e) => setPaymentUtr(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="screenshot" className="text-xs font-bold text-bone/70 uppercase">Payment Screenshot *</label>
                <div className="relative">
                  <input
                    type="file" id="screenshot" required
                    accept=".jpg,.jpeg,.png,.webp"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    onChange={(e) => setPaymentScreenshot(e.target.files[0] || null)}
                    disabled={isSubmitting}
                  />
                  <div className={`px-4 py-3 border rounded text-sm transition-colors ${paymentScreenshot ? 'bg-orange-900/20 border-orange-500 text-orange-200' : 'bg-black/40 border-bone/20 text-bone/50 hover:border-orange-500/50'}`}>
                    {paymentScreenshot ? (
                      <span className="font-bold flex items-center gap-2">
                        <span>✓</span> {paymentScreenshot.name}
                      </span>
                    ) : (
                      "Choose File (JPG, PNG, WebP)"
                    )}
                  </div>
                </div>
              </div>
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
          <div className="flex flex-col items-center md:items-end w-full md:w-auto">
            {submitError && (
              <div className="text-red-400 text-sm font-bold bg-red-900/20 px-4 py-2 rounded border border-red-900/40 mb-4 w-full text-center">
                {submitError}
              </div>
            )}
            <button
              type="submit"
              className="px-10 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded font-bold uppercase tracking-wider transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
              disabled={isSubmitting || selectedSports.length === 0}
            >
              {isSubmitting ? 'Processing...' : (step === 1 ? 'Next: Player Details' : (step === 2 ? 'Next: Payment' : 'Complete Registration'))}
            </button>
          </div>
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
