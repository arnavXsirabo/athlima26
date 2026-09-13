'use client';
import { useRegistration } from '@/context/RegistrationContext';

export default function TeamForm() {
  const { participantData, updateParticipantData } = useRegistration();

  return (
    <div className="registration-section">
      <h3 className="registration-subtitle">2. TEAM INFORMATION</h3>
      
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="collegeName">College Name</label>
          <input 
            type="text" 
            id="collegeName" 
            placeholder="Enter your college name"
            value={participantData.collegeName}
            onChange={(e) => updateParticipantData('collegeName', e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="teamName">Team / Contingent Name</label>
          <input 
            type="text" 
            id="teamName" 
            placeholder="E.g. SMIT Titans"
            value={participantData.teamName}
            onChange={(e) => updateParticipantData('teamName', e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="contactEmail">Contact Email</label>
          <input 
            type="email" 
            id="contactEmail" 
            placeholder="captain@example.com"
            value={participantData.contactEmail}
            onChange={(e) => updateParticipantData('contactEmail', e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="contactPhone">Contact Phone</label>
          <input 
            type="tel" 
            id="contactPhone" 
            placeholder="+91 xxxxx xxxxx"
            value={participantData.contactPhone}
            onChange={(e) => updateParticipantData('contactPhone', e.target.value)}
            required
          />
        </div>
      </div>
    </div>
  );
}
