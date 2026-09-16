'use client';
import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Plus, Edit2, Trash2, X, Check, Calendar as CalendarIcon, MapPin, Clock } from 'lucide-react';

export default function SchedulesClient({ initialMatches, sports }) {
  const [matches, setMatches] = useState(initialMatches);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const [formData, setFormData] = useState({
    sport_id: '',
    round: '',
    team1_name: '',
    team2_name: '',
    start_time: '',
    end_time: '',
    location: '',
    status: 'Scheduled',
    team1_score: '',
    team2_score: '',
    winner_name: ''
  });

  const handleOpenModal = (match = null) => {
    if (match) {
      setEditingMatch(match);
      setFormData({
        sport_id: match.sport_id,
        round: match.round,
        team1_name: match.team1_name,
        team2_name: match.team2_name,
        start_time: new Date(match.start_time).toISOString().slice(0, 16),
        end_time: new Date(match.end_time).toISOString().slice(0, 16),
        location: match.location,
        status: match.status,
        team1_score: match.team1_score ?? '',
        team2_score: match.team2_score ?? '',
        winner_name: match.winner_name || ''
      });
    } else {
      setEditingMatch(null);
      setFormData({
        sport_id: sports.length > 0 ? sports[0].id : '',
        round: 'Quarter Final',
        team1_name: '',
        team2_name: '',
        start_time: '',
        end_time: '',
        location: 'Main Ground',
        status: 'Scheduled',
        team1_score: '',
        team2_score: '',
        winner_name: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMatch(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const payload = {
        ...formData,
        start_time: new Date(formData.start_time).toISOString(),
        end_time: new Date(formData.end_time).toISOString(),
        team1_score: formData.team1_score === '' ? null : parseInt(formData.team1_score),
        team2_score: formData.team2_score === '' ? null : parseInt(formData.team2_score),
        winner_name: formData.winner_name || null,
      };

      if (editingMatch) {
        const { error } = await supabase
          .from('matches')
          .update(payload)
          .eq('id', editingMatch.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('matches')
          .insert([payload]);
          
        if (error) throw error;
      }
      
      alert(`Match ${editingMatch ? 'updated' : 'created'} successfully!`);
      handleCloseModal();
      router.refresh();
      // Optimistic update
      window.location.reload(); 
    } catch (error) {
      console.error(error);
      alert("Failed to save match. Ensure you are logged in as admin.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this match?")) return;
    
    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from('matches')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      router.refresh();
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Failed to delete match.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex justify-end">
        <button 
          onClick={() => handleOpenModal()}
          className="bg-orange-500 hover:bg-orange-600 text-black font-bold py-2 px-4 rounded flex items-center gap-2 transition-colors"
        >
          <Plus size={18} /> Add Match
        </button>
      </div>

      <div className="admin-card !p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="admin-table min-w-[800px]">
            <thead>
              <tr>
                <th>Sport & Round</th>
                <th>Teams & Score</th>
                <th>Time & Location</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {matches.length > 0 ? (
                matches.map(match => {
                  const start = new Date(match.start_time);
                  return (
                    <tr key={match.id} className="hover:bg-bone/5 transition-colors">
                      <td>
                        <div className="font-bold text-bone text-base">{match.sports?.name || 'Unknown'}</div>
                        <div className="text-xs text-orange-400 font-bold uppercase tracking-wide">{match.round}</div>
                      </td>
                      <td>
                        <div className="flex flex-col gap-1 text-sm">
                          <div className="flex justify-between items-center bg-black/30 px-2 py-1 rounded">
                            <span className={match.winner_name === match.team1_name ? 'text-orange-400 font-bold' : 'text-bone/80'}>{match.team1_name}</span>
                            <span className="font-display text-lg leading-none">{match.team1_score ?? '-'}</span>
                          </div>
                          <div className="flex justify-between items-center bg-black/30 px-2 py-1 rounded">
                            <span className={match.winner_name === match.team2_name ? 'text-orange-400 font-bold' : 'text-bone/80'}>{match.team2_name}</span>
                            <span className="font-display text-lg leading-none">{match.team2_score ?? '-'}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2 text-xs text-bone/70 mb-1">
                          <CalendarIcon size={12} className="text-orange-400" />
                          {start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-bone/70 mb-1">
                          <Clock size={12} className="text-orange-400" />
                          {start.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-bone/70">
                          <MapPin size={12} className="text-orange-400" />
                          {match.location}
                        </div>
                      </td>
                      <td>
                        <span className={`admin-badge ${match.status === 'Completed' ? 'bg-green-500/20 text-green-500 border-green-500/30' : match.status === 'Ongoing' ? 'bg-orange-500/20 text-orange-500 border-orange-500/30' : match.status === 'Cancelled' ? 'bg-red-500/20 text-red-500 border-red-500/30' : 'bg-bone/20 text-bone/60 border-bone/30'}`}>
                          {match.status}
                        </span>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <button onClick={() => handleOpenModal(match)} disabled={isProcessing} className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/30 rounded transition-colors" title="Edit Match">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => handleDelete(match.id)} disabled={isProcessing} className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/30 rounded transition-colors" title="Delete Match">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-bone/40">
                    No scheduled matches found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Create/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-[#1c1a17] border border-bone/10 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-display text-orange-400">{editingMatch ? 'Edit Match' : 'Schedule New Match'}</h2>
              <button onClick={handleCloseModal} className="text-bone/50 hover:text-bone transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-bone/60 mb-1">Sport</label>
                  <select name="sport_id" value={formData.sport_id} onChange={handleInputChange} required className="w-full bg-[#111] border border-bone/20 rounded p-2 text-bone outline-none focus:border-orange-500 transition-colors">
                    <option value="" disabled>Select Sport</option>
                    {sports.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-bone/60 mb-1">Round</label>
                  <input type="text" name="round" value={formData.round} onChange={handleInputChange} required placeholder="e.g. Quarter Final" className="w-full bg-[#111] border border-bone/20 rounded p-2 text-bone outline-none focus:border-orange-500 transition-colors" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-black/20 p-4 rounded-lg border border-bone/5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-bone/60 mb-1">Team 1 Name</label>
                  <input type="text" name="team1_name" value={formData.team1_name} onChange={handleInputChange} required className="w-full bg-[#111] border border-bone/20 rounded p-2 text-bone outline-none focus:border-orange-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-bone/60 mb-1">Team 2 Name</label>
                  <input type="text" name="team2_name" value={formData.team2_name} onChange={handleInputChange} required className="w-full bg-[#111] border border-bone/20 rounded p-2 text-bone outline-none focus:border-orange-500 transition-colors" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-bone/60 mb-1">Start Time</label>
                  <input type="datetime-local" name="start_time" value={formData.start_time} onChange={handleInputChange} required className="w-full bg-[#111] border border-bone/20 rounded p-2 text-bone outline-none focus:border-orange-500 transition-colors" style={{ colorScheme: 'dark' }} />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-bone/60 mb-1">End Time</label>
                  <input type="datetime-local" name="end_time" value={formData.end_time} onChange={handleInputChange} required className="w-full bg-[#111] border border-bone/20 rounded p-2 text-bone outline-none focus:border-orange-500 transition-colors" style={{ colorScheme: 'dark' }} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-bone/60 mb-1">Location / Venue</label>
                  <input type="text" name="location" value={formData.location} onChange={handleInputChange} required className="w-full bg-[#111] border border-bone/20 rounded p-2 text-bone outline-none focus:border-orange-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-bone/60 mb-1">Status</label>
                  <select name="status" value={formData.status} onChange={handleInputChange} required className="w-full bg-[#111] border border-bone/20 rounded p-2 text-bone outline-none focus:border-orange-500 transition-colors">
                    <option value="Scheduled">Scheduled</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-bone/10">
                <h3 className="text-orange-400 font-bold mb-3 text-sm">Match Results (Optional)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-bone/60 mb-1">Team 1 Score</label>
                    <input type="number" name="team1_score" value={formData.team1_score} onChange={handleInputChange} placeholder="0" className="w-full bg-[#111] border border-bone/20 rounded p-2 text-bone outline-none focus:border-orange-500 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-bone/60 mb-1">Team 2 Score</label>
                    <input type="number" name="team2_score" value={formData.team2_score} onChange={handleInputChange} placeholder="0" className="w-full bg-[#111] border border-bone/20 rounded p-2 text-bone outline-none focus:border-orange-500 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-bone/60 mb-1">Winner</label>
                    <select name="winner_name" value={formData.winner_name} onChange={handleInputChange} className="w-full bg-[#111] border border-bone/20 rounded p-2 text-bone outline-none focus:border-orange-500 transition-colors">
                      <option value="">None yet</option>
                      {formData.team1_name && <option value={formData.team1_name}>{formData.team1_name}</option>}
                      {formData.team2_name && <option value={formData.team2_name}>{formData.team2_name}</option>}
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={handleCloseModal} className="px-4 py-2 border border-bone/20 text-bone hover:bg-bone/10 rounded transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isProcessing} className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-black font-bold rounded flex items-center gap-2 transition-colors disabled:opacity-50">
                  {isProcessing ? 'Saving...' : <><Check size={18} /> Save Match</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
