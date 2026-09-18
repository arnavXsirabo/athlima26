import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Fetch Aggregate Metrics
  const { count: totalRegistrations } = await supabase
    .from('registrations')
    .select('*', { count: 'exact', head: true });
    
  const { count: pendingPayments } = await supabase
    .from('registrations')
    .select('*', { count: 'exact', head: true })
    .eq('payment_status', 'submitted');
    
  const { count: approvedRegs } = await supabase
    .from('registrations')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'approved');

  const { count: rejectedRegs } = await supabase
    .from('registrations')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'rejected');

  // Fetch Sports Capacity Overview
  const { data: sports } = await supabase
    .from('sports')
    .select(`
      id, name, capacity, status,
      registration_sports (count)
    `)
    .order('name');

  // Fetch Recent Registrations
  const { data: recentRegistrations } = await supabase
    .from('registrations')
    .select('id, registration_number, college_name, payment_status, status, created_at')
    .order('created_at', { ascending: false })
    .limit(5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display text-bone">Dashboard Overview</h1>
        <p className="text-bone/60 mt-1">Monitor registrations and event capacity.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="admin-card">
          <div className="text-sm font-bold text-bone/50 uppercase tracking-wider">Total Registrations</div>
          <div className="admin-metric">{totalRegistrations || 0}</div>
        </div>
        <div className="admin-card border-yellow-500/30 bg-yellow-500/5">
          <div className="text-sm font-bold text-yellow-500/70 uppercase tracking-wider">Pending Verification</div>
          <div className="admin-metric text-yellow-500">{pendingPayments || 0}</div>
        </div>
        <div className="admin-card border-green-500/30 bg-green-500/5">
          <div className="text-sm font-bold text-green-500/70 uppercase tracking-wider">Approved</div>
          <div className="admin-metric text-green-500">{approvedRegs || 0}</div>
        </div>
        <div className="admin-card border-red-500/30 bg-red-500/5">
          <div className="text-sm font-bold text-red-500/70 uppercase tracking-wider">Rejected</div>
          <div className="admin-metric text-red-500">{rejectedRegs || 0}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Registrations */}
        <div className="lg:col-span-2 admin-card p-0 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-bone/10 flex justify-between items-center">
            <h2 className="text-lg font-bold text-bone">Recent Registrations</h2>
            <Link href="/admin/registrations" className="text-xs font-bold text-orange-400 hover:text-orange-300 uppercase tracking-wider">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Reg Number</th>
                  <th>College</th>
                  <th>Payment</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentRegistrations?.length > 0 ? (
                  recentRegistrations.map((reg) => (
                    <tr key={reg.id} className="hover:bg-bone/5 transition-colors">
                      <td className="font-mono text-orange-400">{reg.registration_number}</td>
                      <td className="font-bold">{reg.college_name}</td>
                      <td>
                        <span className={`admin-badge ${reg.payment_status === 'submitted' ? 'badge-pending' : reg.payment_status === 'verified' ? 'badge-verified' : 'badge-rejected'}`}>
                          {reg.payment_status}
                        </span>
                      </td>
                      <td>
                        <span className={`admin-badge ${reg.status === 'payment_submitted' ? 'badge-pending' : reg.status === 'approved' ? 'badge-approved' : 'badge-rejected'}`}>
                          {reg.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-8 text-bone/40">No registrations found (or access denied by RLS)</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Capacity Overview */}
        <div className="admin-card">
          <h2 className="text-lg font-bold text-bone mb-6">Sport Capacity</h2>
          <div className="space-y-4">
            {sports?.length > 0 ? (
              sports.map(sport => {
                // Handle Supabase nested count which comes as an array of objects
                const countObj = sport.registration_sports?.[0];
                const registeredCount = countObj ? countObj.count : 0;
                const percentage = Math.min(100, Math.round((registeredCount / sport.capacity) * 100));
                
                return (
                  <div key={sport.id} className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-bold text-bone/80">{sport.name}</span>
                      <span className="text-orange-400 font-mono text-xs">{registeredCount} / {sport.capacity}</span>
                    </div>
                    <div className="h-2 bg-black/50 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${percentage >= 100 ? 'bg-red-500' : percentage >= 75 ? 'bg-yellow-500' : 'bg-green-500'}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="text-center py-4 text-bone/40 text-sm">No sports data available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
