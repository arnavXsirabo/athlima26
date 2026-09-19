import Link from "next/link";
import { EVENT_DATA } from "@/data/event";

export default function Footer() {
  const FooterContent = () => (
    <div className="bg-ink text-bone relative pt-24 pb-12 overflow-hidden border-t border-bone/5 w-full h-full">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 pb-24">
          <div className="md:col-span-5 flex flex-col">
            <h2 className="font-display text-6xl md:text-8xl uppercase leading-none tracking-tight text-bone mb-6">
              {EVENT_DATA.name} {EVENT_DATA.year.slice(2)}
            </h2>
            <p className="text-bone/50 max-w-sm text-sm uppercase tracking-widest leading-loose">
              {EVENT_DATA.organization} <br />
              {EVENT_DATA.theme}
            </p>
          </div>
          
          <div className="md:col-span-3 md:col-start-7 flex flex-col gap-4">
            <h4 className="text-xs font-bold tracking-widest text-bone/60 uppercase mb-4">Navigation</h4>
            <Link href="/about" className="text-sm font-medium hover:text-accent transition-colors">ABOUT</Link>
            <Link href="/rules" className="text-sm font-medium hover:text-accent transition-colors">RULES</Link>
            <Link href="/schedule" className="text-sm font-medium hover:text-accent transition-colors">SCHEDULE</Link>
            <Link href={EVENT_DATA.registrationUrl} className="text-sm font-medium hover:text-accent transition-colors text-accent">REGISTER</Link>
          </div>
          
          <div className="md:col-span-3 flex flex-col gap-4">
            <h4 className="text-xs font-bold tracking-widest text-bone/60 uppercase mb-4">Contact</h4>
            <a href={`mailto:${EVENT_DATA.contact.email}`} className="text-sm font-medium hover:text-accent transition-colors">{EVENT_DATA.contact.email}</a>
            
            <div className="flex flex-col gap-2 mt-2">
              <a href="tel:+919395227035" className="text-sm font-medium hover:text-accent transition-colors">
                Anmol Gohain Baruah: <br className="md:hidden" />+91 93952 27035
              </a>
              <a href="tel:+917002382495" className="text-sm font-medium hover:text-accent transition-colors">
                Kasturi Indrani Konwar: <br className="md:hidden" />+91 70023 82495
              </a>
            </div>
            <div className="mt-4 flex gap-6">
              {Object.entries(EVENT_DATA.socialLinks).map(([platform, url]) => {
                let Icon = null;
                if (platform.toLowerCase() === "instagram") {
                  Icon = () => (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform duration-300"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                  );
                } else if (platform.toLowerCase() === "twitter") {
                  Icon = () => (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform duration-300"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                  );
                }
                
                return (
                  <a key={platform} href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-medium uppercase hover:text-accent transition-colors group">
                    {Icon && <Icon />}
                    <span>{platform}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-bone/10 gap-4">
          <p className="text-xs font-semibold tracking-widest text-bone/50 uppercase text-center md:text-left">
            &copy; {EVENT_DATA.year} {EVENT_DATA.organization}. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-4">
            <span className="text-xs font-semibold tracking-widest text-bone/40 uppercase">DESIGNED FOR IMPACT</span>
          </div>
        </div>
        
      </div>
      
      {/* Huge background text */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center translate-y-1/3 pointer-events-none select-none opacity-5">
        <span className="font-display text-[25vw] leading-none whitespace-nowrap text-bone">
          {EVENT_DATA.name}
        </span>
      </div>
    </div>
  );

  return (
    <footer className="relative w-full bg-ink">
      {/* MOBILE FOOTER - Standard inline flow */}
      <div className="block md:hidden">
        <FooterContent />
      </div>

      {/* DESKTOP FOOTER - Cinematic reveal effect */}
      <div className="hidden md:block">
        {/* Invisible spacer to reserve height in normal document flow */}
        <div className="invisible">
          <FooterContent />
        </div>
        
        {/* Absolute wrapper with clip-path for reveal effect */}
        <div 
          className="absolute inset-0 z-0" 
          style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)", transform: "translateZ(0)" }}
        >
          <div className="fixed bottom-0 left-0 w-full h-[auto]">
            <FooterContent />
          </div>
        </div>
      </div>
    </footer>
  );
}
