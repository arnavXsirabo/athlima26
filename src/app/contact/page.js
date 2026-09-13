export const metadata = {
  title: 'Contact | ATHLIMA 2026',
};

export default function ContactPage() {
  return (
    <div className="page-wrapper bg-cream">
      <div className="container" style={{ padding: '4rem 0', minHeight: '60vh' }}>
        <h1 style={{ fontSize: '4rem', marginBottom: '2rem' }}>GET IN <span className="text-orange">TOUCH</span></h1>
        <p style={{ fontSize: '1.2rem', maxWidth: '600px', lineHeight: '1.6' }}>
          Have questions about registration, rules, or the event in general? Reach out to our organizing committee.
        </p>
        <div style={{ marginTop: '2rem' }}>
          <p><strong>Email:</strong> contact@athlima2026.example.com</p>
          <p><strong>Phone:</strong> +91 98765 43210</p>
        </div>
      </div>
    </div>
  );
}
