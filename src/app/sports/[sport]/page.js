import { ATHLIMA_SPORTS } from '@/data/sports';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  return ATHLIMA_SPORTS.map((sport) => ({
    sport: sport.id,
  }));
}

export function generateMetadata({ params }) {
  const sport = ATHLIMA_SPORTS.find(s => s.id === params.sport);
  if (!sport) return { title: 'Sport Not Found' };
  return { title: `${sport.name} | ATHLIMA 2026` };
}

export default function SportDetailPage({ params }) {
  const sport = ATHLIMA_SPORTS.find(s => s.id === params.sport);
  
  if (!sport) {
    notFound();
  }

  return (
    <div className="page-wrapper bg-cream">
      <div className="container" style={{ padding: '4rem 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '4rem', alignItems: 'center' }}>
          
          <div style={{ order: 2 }}>
            <div style={{ 
              width: '100%', 
              height: '500px', 
              backgroundColor: 'var(--color-muted-blue)', 
              borderRadius: '8px',
              position: 'relative',
              overflow: 'hidden'
            }}>
               <div style={{ position: 'absolute', inset: 0, backgroundImage: "url('https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=2070&auto=format&fit=crop')", backgroundSize: 'cover', backgroundPosition: 'center', filter: 'grayscale(20%)' }}></div>
            </div>
          </div>

          <div style={{ order: 1 }}>
            <h4 style={{ color: 'var(--color-orange)', letterSpacing: '0.1em', marginBottom: '1rem', fontWeight: 600 }}>{sport.category}</h4>
            <h1 style={{ fontSize: '5rem', lineHeight: 1, marginBottom: '2rem', color: 'var(--color-charcoal)' }}>{sport.name}</h1>
            <p style={{ fontSize: '1.2rem', marginBottom: '2rem', maxWidth: '500px' }}>
              Compete in {sport.name} at ATHLIMA 2026. Bring your best team and fight for glory on the biggest collegiate stage.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Link href="/registration" className="px-6 py-2 bg-blue-600 text-white rounded font-medium">Register Now</Link>
              <Link href="/sports" className="px-6 py-2 border border-gray-300 rounded font-medium">Back to Sports</Link>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
