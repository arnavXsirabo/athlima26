export default function AdminSettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-display text-bone">Settings</h1>
        <p className="text-bone/60 mt-1">Configure global event settings and payment details.</p>
      </div>

      <div className="admin-card">
        <h2 className="text-xl font-bold text-bone mb-6">Payment Instructions</h2>
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-bone/60 uppercase">Official UPI ID</label>
            <input 
              type="text" 
              defaultValue="athlima2026@sbi" 
              disabled
              className="px-4 py-3 bg-black/40 border border-bone/10 rounded text-bone/50 outline-none cursor-not-allowed"
            />
            <p className="text-[10px] text-bone/40">Displayed on the public checkout page. (Database integration coming soon).</p>
          </div>
          
          <div className="flex flex-col gap-2 mt-4">
            <label className="text-xs font-bold text-bone/60 uppercase">Payment QR Code</label>
            <div className="w-32 h-32 bg-black/40 border border-bone/10 rounded flex items-center justify-center text-bone/30 text-xs text-center p-4">
              [QR Image Placeholder]
            </div>
          </div>
        </div>
      </div>

      <div className="admin-card opacity-50">
        <h2 className="text-xl font-bold text-bone mb-6 flex items-center gap-2">
          Admin Authorization Roles
          <span className="text-[10px] uppercase font-bold bg-orange-500/20 text-orange-400 px-2 py-1 rounded">Coming Soon</span>
        </h2>
        <p className="text-sm text-bone/60">
          Once authentication is enabled, you will be able to manage admin roles (Super Admin, Admin, Sports Coordinator) here.
        </p>
      </div>
    </div>
  );
}
