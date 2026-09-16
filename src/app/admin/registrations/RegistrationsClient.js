'use client';
import { useState } from 'react';
import { Search, Eye, CheckCircle, XCircle } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function RegistrationsClient({ initialData }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedScreenshot, setSelectedScreenshot] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const filteredData = initialData.filter(reg => {
    const matchesSearch = 
      reg.registration_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.college_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.team_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.payment_utr.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesFilter = filterStatus === 'all' 
      ? true 
      : (filterStatus === 'pending_payment' ? reg.payment_status === 'submitted' : reg.status === filterStatus);

    return matchesSearch && matchesFilter;
  });

  const handleUpdateStatus = async (id, type, newStatus) => {
    setIsProcessing(true);
    try {
      const updateData = type === 'payment' ? { payment_status: newStatus } : { status: newStatus };
      
      const { error } = await supabase
        .from('registrations')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
      
      // Refresh the page data
      router.refresh();
      alert(`Status updated to ${newStatus} successfully.`);
    } catch (error) {
      console.error(error);
      alert("Failed to update status. Remember: you must be logged in as an Admin for this to work.");
    } finally {
      setIsProcessing(false);
    }
  };

  const viewScreenshot = async (path) => {
    // Generate signed URL securely
    const { data, error } = await supabase.storage
      .from('payment-screenshots')
      .createSignedUrl(path, 60); // 60 seconds expiry
      
    if (error) {
      alert("Failed to access screenshot. You must be an authorized admin.");
      return;
    }
    
    setSelectedScreenshot(data.signedUrl);
  };

  return (
    <div className="admin-card !p-0 overflow-hidden">
      <div className="p-4 border-b border-bone/10 flex flex-col sm:flex-row gap-4 justify-between items-center bg-black/20">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-bone/40" size={18} />
          <input 
            type="text" 
            placeholder="Search registrations, UTR, college..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-black/40 border border-bone/20 rounded-lg focus:border-orange-500 outline-none text-sm text-bone placeholder:text-bone/30"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 bg-black/40 border border-bone/20 rounded-lg focus:border-orange-500 outline-none text-sm text-bone appearance-none"
          >
            <option value="all">All Registrations</option>
            <option value="pending_payment">Pending Payment</option>
            <option value="payment_submitted">Pending Approval</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Registration</th>
              <th>Contact Details</th>
              <th>Sports</th>
              <th>Payment & UTR</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map(reg => (
                <tr key={reg.id} className="hover:bg-bone/5 transition-colors">
                  <td className="align-top">
                    <div className="font-mono text-orange-400 font-bold mb-1">{reg.registration_number}</div>
                    <div className="text-xs text-bone/50">{new Date(reg.created_at).toLocaleDateString()}</div>
                  </td>
                  <td className="align-top">
                    <div className="font-bold text-bone/90">{reg.college_name}</div>
                    <div className="text-bone/70">{reg.team_name}</div>
                    <div className="text-xs text-bone/50 mt-1">{reg.contact_email}</div>
                    <div className="text-xs text-bone/50">{reg.contact_phone}</div>
                  </td>
                  <td className="align-top">
                    <div className="flex flex-wrap gap-1">
                      {reg.registration_sports?.map(rs => (
                        <span key={rs.sports.id} className="admin-badge bg-orange-900/40 text-orange-400 border-orange-800/30">
                          {rs.sports.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="align-top">
                    <div className="font-mono text-xs mb-1 text-bone/80">UTR: {reg.payment_utr}</div>
                    <div className="font-bold text-orange-400 mb-2">₹ {reg.total_amount}</div>
                    <button 
                      onClick={() => viewScreenshot(reg.payment_screenshot_path)}
                      className="flex items-center gap-1 text-xs font-bold text-bone/60 hover:text-orange-400 transition-colors"
                    >
                      <Eye size={14} /> View Screenshot
                    </button>
                  </td>
                  <td className="align-top space-y-2">
                    <div>
                      <div className="text-[10px] text-bone/40 uppercase mb-0.5">Payment</div>
                      <span className={`admin-badge ${reg.payment_status === 'submitted' ? 'badge-pending' : reg.payment_status === 'verified' ? 'badge-verified' : 'badge-rejected'}`}>
                        {reg.payment_status}
                      </span>
                    </div>
                    <div>
                      <div className="text-[10px] text-bone/40 uppercase mb-0.5">Registration</div>
                      <span className={`admin-badge ${reg.status === 'payment_submitted' ? 'badge-pending' : reg.status === 'approved' ? 'badge-approved' : 'badge-rejected'}`}>
                        {reg.status}
                      </span>
                    </div>
                  </td>
                  <td className="align-top">
                    <div className="flex flex-col gap-2">
                      {reg.payment_status === 'submitted' && (
                        <>
                          <button onClick={() => handleUpdateStatus(reg.id, 'payment', 'verified')} disabled={isProcessing} className="flex items-center gap-1 text-xs font-bold px-2 py-1 bg-green-500/10 text-green-500 hover:bg-green-500/20 border border-green-500/30 rounded transition-colors disabled:opacity-50">
                            <CheckCircle size={14} /> Verify Payment
                          </button>
                          <button onClick={() => handleUpdateStatus(reg.id, 'payment', 'rejected')} disabled={isProcessing} className="flex items-center gap-1 text-xs font-bold px-2 py-1 bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/30 rounded transition-colors disabled:opacity-50">
                            <XCircle size={14} /> Reject Payment
                          </button>
                        </>
                      )}
                      {reg.payment_status === 'verified' && reg.status === 'payment_submitted' && (
                        <>
                          <button onClick={() => handleUpdateStatus(reg.id, 'registration', 'approved')} disabled={isProcessing} className="flex items-center gap-1 text-xs font-bold px-2 py-1 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/30 rounded transition-colors disabled:opacity-50">
                            <CheckCircle size={14} /> Approve Registration
                          </button>
                          <button onClick={() => handleUpdateStatus(reg.id, 'registration', 'rejected')} disabled={isProcessing} className="flex items-center gap-1 text-xs font-bold px-2 py-1 bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/30 rounded transition-colors disabled:opacity-50">
                            <XCircle size={14} /> Reject Registration
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-12 text-bone/40">
                  No registrations found or access denied due to missing authentication.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Screenshot Modal */}
      {selectedScreenshot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedScreenshot(null)}>
          <div className="relative max-w-4xl max-h-[90vh] w-full bg-[#111] p-2 rounded-xl border border-bone/20 shadow-2xl" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setSelectedScreenshot(null)}
              className="absolute -top-4 -right-4 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-bold shadow-lg hover:scale-110 transition-transform"
            >
              ×
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={selectedScreenshot} 
              alt="Payment Screenshot" 
              className="w-full h-full object-contain max-h-[85vh] rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}
