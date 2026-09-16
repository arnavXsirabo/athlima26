'use client';
import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Play, Square, EyeOff, Settings, Plus, X, Check, Trash2 } from 'lucide-react';

export default function SportsClient({ initialData }) {
  const [sports, setSports] = useState(initialData);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSport, setEditingSport] = useState(null);
  const router = useRouter();
  const supabase = createClient();

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    category: '',
    capacity: 8,
    price: 0,
    min_players: 1,
    max_players: 1,
    status: 'OPEN'
  });

  const handleUpdateStatus = async (id, newStatus) => {
    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from('sports')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      router.refresh();
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Failed to update status. You must be an authorized admin.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOpenModal = (sport = null) => {
    if (sport) {
      setEditingSport(sport);
      setFormData({
        id: sport.id,
        name: sport.name,
        category: sport.category,
        capacity: sport.capacity,
        price: sport.price,
        min_players: sport.min_players,
        max_players: sport.max_players,
        status: sport.status
      });
    } else {
      setEditingSport(null);
      setFormData({
        id: '',
        name: '',
        category: 'Team Sports',
        capacity: 8,
        price: 0,
        min_players: 1,
        max_players: 1,
        status: 'OPEN'
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSport(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    const parsedValue = type === 'number' ? parseInt(value) || 0 : value;
    setFormData(prev => ({ ...prev, [name]: parsedValue }));
    
    if (name === 'name' && !editingSport) {
      // Auto-generate ID from name
      setFormData(prev => ({ ...prev, id: value.toLowerCase().replace(/[^a-z0-9]+/g, '-') }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      if (editingSport) {
        const { error } = await supabase
          .from('sports')
          .update(formData)
          .eq('id', editingSport.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('sports')
          .insert([formData]);
        if (error) throw error;
      }
      
      handleCloseModal();
      router.refresh();
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Failed to save sport.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure? This will delete the sport and ALL associated registrations and matches!")) return;
    setIsProcessing(true);
    try {
      const { error } = await supabase.from('sports').delete().eq('id', id);
      if (error) throw error;
      router.refresh();
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Failed to delete sport.");
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
          <Plus size={18} /> Add Sport
        </button>
      </div>

      <div className="admin-card !p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Sport Name</th>
                <th>Category</th>
                <th>Capacity & Usage</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sports.length > 0 ? (
                sports.map(sport => {
                  const registeredCount = sport.registration_sports?.[0]?.count || 0;
                  const remaining = sport.capacity - registeredCount;
                  const percentage = Math.min(100, Math.round((registeredCount / sport.capacity) * 100));

                  return (
                    <tr key={sport.id} className="hover:bg-bone/5 transition-colors">
                      <td>
                        <div className="font-bold text-bone text-base">{sport.name}</div>
                        <div className="text-xs text-bone/50">Price: ₹{sport.price}</div>
                      </td>
                      <td>
                        <span className="admin-badge bg-orange-900/40 text-orange-400 border-orange-800/30">
                          {sport.category}
                        </span>
                      </td>
                      <td className="w-64">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-bone/80">{registeredCount} Registered</span>
                          <span className="text-orange-400 font-bold">{remaining} Left</span>
                        </div>
                        <div className="h-1.5 bg-black/50 rounded-full overflow-hidden w-full">
                          <div 
                            className={`h-full rounded-full ${percentage >= 100 ? 'bg-red-500' : percentage >= 75 ? 'bg-yellow-500' : 'bg-green-500'}`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <div className="text-[10px] text-bone/40 mt-1 uppercase tracking-wider">
                          Limit: {sport.capacity} Teams/Players
                        </div>
                      </td>
                      <td>
                        <span className={`admin-badge ${sport.status === 'OPEN' ? 'bg-green-500/20 text-green-500 border-green-500/30' : sport.status === 'CLOSED' ? 'bg-red-500/20 text-red-500 border-red-500/30' : sport.status === 'FULL' ? 'bg-purple-500/20 text-purple-500 border-purple-500/30' : 'bg-bone/20 text-bone/60 border-bone/30'}`}>
                          {sport.status}
                        </span>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          {sport.status !== 'OPEN' && (
                            <button onClick={() => handleUpdateStatus(sport.id, 'OPEN')} disabled={isProcessing} className="p-2 bg-green-500/10 text-green-500 hover:bg-green-500/20 border border-green-500/30 rounded transition-colors disabled:opacity-50" title="Open Registration">
                              <Play size={16} />
                            </button>
                          )}
                          {sport.status !== 'CLOSED' && (
                            <button onClick={() => handleUpdateStatus(sport.id, 'CLOSED')} disabled={isProcessing} className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/30 rounded transition-colors disabled:opacity-50" title="Close Registration">
                              <Square size={16} />
                            </button>
                          )}
                          {sport.status !== 'HIDDEN' && (
                            <button onClick={() => handleUpdateStatus(sport.id, 'HIDDEN')} disabled={isProcessing} className="p-2 bg-bone/10 text-bone/60 hover:bg-bone/20 border border-bone/30 rounded transition-colors disabled:opacity-50" title="Hide Sport from Public">
                              <EyeOff size={16} />
                            </button>
                          )}
                          <button onClick={() => handleOpenModal(sport)} disabled={isProcessing} className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/30 rounded transition-colors disabled:opacity-50" title="Edit Settings">
                            <Settings size={16} />
                          </button>
                          <button onClick={() => handleDelete(sport.id)} disabled={isProcessing} className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/30 rounded transition-colors disabled:opacity-50" title="Delete Sport">
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
                    No sports found or access denied due to missing authentication.
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
          <div className="bg-[#1c1a17] border border-bone/10 rounded-xl p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-display text-orange-400">{editingSport ? 'Edit Sport' : 'Add New Sport'}</h2>
              <button onClick={handleCloseModal} className="text-bone/50 hover:text-bone transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-bone/60 mb-1">Sport Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full bg-[#111] border border-bone/20 rounded p-2 text-bone outline-none focus:border-orange-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-bone/60 mb-1">ID (URL safe)</label>
                  <input type="text" name="id" value={formData.id} onChange={handleInputChange} required disabled={!!editingSport} className="w-full bg-[#111] border border-bone/20 rounded p-2 text-bone outline-none focus:border-orange-500 transition-colors disabled:opacity-50" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-bone/60 mb-1">Category</label>
                  <select name="category" value={formData.category} onChange={handleInputChange} required className="w-full bg-[#111] border border-bone/20 rounded p-2 text-bone outline-none focus:border-orange-500 transition-colors">
                    <option value="Team Sports">Team Sports</option>
                    <option value="Individual Sports">Individual Sports</option>
                    <option value="E-Sports">E-Sports</option>
                    <option value="Athletics">Athletics</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-bone/60 mb-1">Status</label>
                  <select name="status" value={formData.status} onChange={handleInputChange} required className="w-full bg-[#111] border border-bone/20 rounded p-2 text-bone outline-none focus:border-orange-500 transition-colors">
                    <option value="OPEN">OPEN</option>
                    <option value="CLOSED">CLOSED</option>
                    <option value="HIDDEN">HIDDEN</option>
                    <option value="FULL">FULL</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-bone/60 mb-1">Price (₹)</label>
                  <input type="number" name="price" value={formData.price} onChange={handleInputChange} required min="0" className="w-full bg-[#111] border border-bone/20 rounded p-2 text-bone outline-none focus:border-orange-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-bone/60 mb-1">Capacity (Teams)</label>
                  <input type="number" name="capacity" value={formData.capacity} onChange={handleInputChange} required min="1" className="w-full bg-[#111] border border-bone/20 rounded p-2 text-bone outline-none focus:border-orange-500 transition-colors" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-bone/60 mb-1">Min Players / Team</label>
                  <input type="number" name="min_players" value={formData.min_players} onChange={handleInputChange} required min="1" className="w-full bg-[#111] border border-bone/20 rounded p-2 text-bone outline-none focus:border-orange-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-bone/60 mb-1">Max Players / Team</label>
                  <input type="number" name="max_players" value={formData.max_players} onChange={handleInputChange} required min="1" className="w-full bg-[#111] border border-bone/20 rounded p-2 text-bone outline-none focus:border-orange-500 transition-colors" />
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-bone/10 flex justify-end gap-3">
                <button type="button" onClick={handleCloseModal} className="px-4 py-2 border border-bone/20 text-bone hover:bg-bone/10 rounded transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isProcessing} className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-black font-bold rounded flex items-center gap-2 transition-colors disabled:opacity-50">
                  {isProcessing ? 'Saving...' : <><Check size={18} /> Save Sport</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
