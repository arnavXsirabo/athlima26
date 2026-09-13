import Link from "next/link";
import { Download, FileText } from "lucide-react";
import { EVENT_DATA } from "@/data/event";

export const metadata = {
  title: "Rules & Guidelines | ATHLIMA 2026",
};

export default function RulesPage() {
  return (
    <main className="min-h-screen bg-bone text-ink pt-32 pb-24 relative overflow-hidden flex flex-col">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-ink/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none mix-blend-multiply" />

      <div className="container mx-auto px-6 md:px-12 relative z-10 flex-1 flex flex-col justify-center max-w-5xl">
        <div className="flex flex-col md:flex-row gap-16 md:gap-24 items-start">
          
          {/* Left Column - Typography */}
          <div className="md:w-3/5">
            <div className="inline-block mb-6">
              <span className="text-xs font-bold tracking-widest text-accent uppercase flex items-center gap-4">
                <div className="w-8 h-px bg-accent" />
                Official Guidelines
              </span>
            </div>
            
            <h1 className="font-display text-fluid-h1 uppercase leading-none tracking-tight mb-8">
              THE <br /> RULEBOOK
            </h1>
            
            <p className="text-xl md:text-2xl text-ink/70 font-medium leading-relaxed mb-12">
              Every great competition is built on the foundation of fair play, respect, and standard rules. Download the official {EVENT_DATA.year} rulebook to ensure your campus is ready for the arena.
            </p>

            <div className="flex flex-col sm:flex-row gap-6">
              <a 
                href="/rulebook.pdf" 
                download
                className="group relative inline-flex items-center justify-center gap-4 px-10 py-5 bg-ink text-bone font-display tracking-widest uppercase text-xl overflow-hidden hover:text-ink transition-colors duration-500 w-full sm:w-auto"
              >
                <span className="absolute inset-0 w-full h-full bg-bone scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out" />
                <span className="relative z-10 flex items-center gap-4">
                  <Download className="w-6 h-6" />
                  DOWNLOAD PDF
                </span>
              </a>
            </div>
          </div>

          {/* Right Column - Premium Graphic/Info */}
          <div className="md:w-2/5 w-full">
            <div className="relative aspect-[3/4] bg-ink text-bone p-8 flex flex-col justify-between overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-noise opacity-30 mix-blend-overlay pointer-events-none" />
              
              <div className="relative z-10">
                <FileText className="w-12 h-12 text-accent mb-8" />
                <h3 className="font-display text-4xl uppercase leading-none tracking-wide mb-4">
                  ATHLIMA {EVENT_DATA.year.slice(2)} <br />
                  EDITION
                </h3>
                <p className="text-sm font-medium text-bone/60 leading-relaxed">
                  Version 1.0 <br />
                  Includes all updated regulations, scoring matrices, and disciplinary guidelines for {EVENT_DATA.sports.length} official sports.
                </p>
              </div>

              <div className="relative z-10 border-t border-bone/20 pt-6 mt-12 flex justify-between items-end">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold tracking-widest text-bone/40 uppercase mb-1">FILE SIZE</span>
                  <span className="text-sm font-semibold tracking-widest text-bone uppercase">2.4 MB</span>
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-[10px] font-bold tracking-widest text-bone/40 uppercase mb-1">FORMAT</span>
                  <span className="text-sm font-semibold tracking-widest text-bone uppercase">PDF</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
