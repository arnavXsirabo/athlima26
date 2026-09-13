import { ATHLIMA_SPORTS } from '@/data/sports';
import Link from 'next/link';

export const metadata = {
  title: 'Sports | ATHLIMA 2026',
};

export default function SportsPage() {
  return (
    <div className="page-wrapper bg-cream">
      <div className="container" style={{ padding: '4rem 0' }}>
        <h1 style={{ fontSize: '4rem', marginBottom: '3rem' }}>THE <span className="text-orange">SPORTS</span></h1>
        
        <div className="sports-grid">
          {ATHLIMA_SPORTS.map((sport, index) => (
            <Link href={`/sports/${sport.id}`} key={sport.id} className="sport-card" style={{ animationDelay: `${index * 0.05}s` }}>
              <div className="sport-image-container">
                <div className={`sport-placeholder bg-pattern-${index % 5}`}>
                  <div className="sport-overlay"></div>
                </div>
              </div>
              <div className="sport-content">
                <h3 className="sport-name">{sport.name}</h3>
                <div className="sport-meta">
                  <span className="sport-category">{sport.category}</span>
                  <div className="sport-arrow">→</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
