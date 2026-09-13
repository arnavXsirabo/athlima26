export const metadata = {
  title: 'Schedule | ATHLIMA 2026',
};

export default function SchedulePage() {
  return (
    <div className="page-wrapper bg-cream">
      <div className="container" style={{ padding: '4rem 0', minHeight: '60vh' }}>
        <h1 style={{ fontSize: '4rem', marginBottom: '2rem' }}>EVENT <span className="text-orange">SCHEDULE</span></h1>
        <p style={{ fontSize: '1.2rem', maxWidth: '600px', lineHeight: '1.6' }}>
          The official schedule for ATHLIMA 2026 will be released closer to the event dates. Stay tuned for updates on matches, venues, and timings.
        </p>
      </div>
    </div>
  );
}
