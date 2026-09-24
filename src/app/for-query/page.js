export const metadata = {
  title: 'For Query | ATHLIMA 2026',
};

export default function ForQueryPage() {
  const coordinators = [
    { sport: 'Badminton', contacts: [{ name: 'Nayrita Choudhury', phone: '8134943720' }] },
    { sport: 'Football', contacts: [{ name: 'Vedhant rai', phone: '6297637445' }] },
    { sport: 'Swimming', contacts: [{ name: 'Jyotika Deviah', phone: '9353788141' }] },
    { sport: 'Volleyball', contacts: [{ name: 'Yoesal Dolma Bhutia', phone: '9749611376' }] },
    { sport: 'Basketball', contacts: [{ name: 'Prabal Gurung', phone: '8637371301' }] },
    { sport: 'Shot Put', contacts: [{ name: 'Dristanta Deb', phone: '6003506933' }] },
    { sport: 'Chess', contacts: [{ name: 'Kunal Goswami', phone: '9931286589' }] },
    { sport: 'Table Tennis', contacts: [{ name: 'Kushal Chettri', phone: '8597669030' }] },
    {
      sport: 'Cricket', contacts: [
        { name: 'Archishman Hazra', phone: '9883359443' },
        { name: 'Subodh Kafley', phone: '8101205142' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-ink text-bone pt-32 pb-24">
      <div className="container mx-auto px-6 md:px-12">
        <h1 className="text-5xl md:text-7xl font-display uppercase tracking-wider mb-6">FOR <span className="text-accent">QUERY</span></h1>
        <p className="text-lg md:text-xl text-bone/70 max-w-3xl mb-16">
          If anyone has queries regarding any sport please contact through this list of official Sports coordinators:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {coordinators.map((c, i) => (
            <div key={i} className="bg-bone/5 border border-bone/10 p-6 md:p-8 flex flex-col hover:bg-bone/10 hover:border-accent/50 transition-all duration-300">
              <h3 className="text-2xl md:text-3xl font-display text-accent uppercase tracking-wide mb-4">{c.sport}</h3>
              <div className="flex flex-col gap-4">
                {c.contacts.map((contact, idx) => (
                  <div key={idx} className="flex flex-col">
                    <p className="text-lg md:text-xl font-medium text-bone mb-1">{contact.name}</p>
                    <a href={`tel:${contact.phone.replace(/\s+/g, '')}`} className="text-bone/70 hover:text-bone font-mono text-lg transition-colors">
                      {contact.phone}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
