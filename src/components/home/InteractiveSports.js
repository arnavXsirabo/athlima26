"use client";

import { useState, useRef } from "react";
import { EVENT_DATA } from "@/data/event";
import Image from "next/image";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function InteractiveSports() {
  const [activeSport, setActiveSport] = useState(EVENT_DATA.sports[0]);
  const containerRef = useRef(null);
  const imageContainerRef = useRef(null);

  const { contextSafe } = useGSAP(() => {
    // Reveal section on scroll
    gsap.fromTo(
      ".sports-header",
      { opacity: 0, y: 50 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.8,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
        }
      }
    );
  }, { scope: containerRef });

  // Handle sport change with animation
  const handleSportChange = contextSafe((sport) => {
    if (sport.id === activeSport.id) return;
    
    // Animate out
    gsap.to(".active-image", {
      opacity: 0,
      scale: 1.05,
      duration: 0.25,
      ease: "power2.inOut",
      onComplete: () => {
        setActiveSport(sport);
        // Animate in (using setTimeout to ensure React has rendered the new image src)
        setTimeout(() => {
          gsap.fromTo(
            ".active-image",
            { opacity: 0, scale: 0.95 },
            { opacity: 1, scale: 1, duration: 0.4, ease: "power3.out" }
          );
        }, 10);
      }
    });
  });

  return (
    <section ref={containerRef} className="relative w-full py-24 md:py-32 bg-ink text-bone" id="sports">
      <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none mix-blend-overlay"></div>
      
      <div className="container mx-auto px-6 md:px-12">
        <div className="sports-header mb-16 md:mb-24 flex justify-between items-end border-b border-bone/10 pb-8">
          <h2 className="text-fluid-h2 font-display m-0 leading-none">THE ARENA</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Sports List */}
          <div className="lg:col-span-5 flex flex-col justify-center relative z-20">
            <div className="flex flex-col border-t border-bone/10">
              {EVENT_DATA.sports.map((sport, index) => {
                const isActive = activeSport.id === sport.id;
                return (
                  <button
                    key={sport.id}
                    onClick={() => handleSportChange(sport)}
                    className="group relative flex items-center justify-between py-5 md:py-8 border-b border-bone/10 text-left transition-colors duration-300 overflow-hidden min-h-[64px] touch-manipulation w-full"
                  >
                    {/* Hover Background Fill */}
                    <div className={cn(
                      "absolute inset-0 bg-bone/5 origin-left transition-transform duration-500 ease-out pointer-events-none",
                      isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    )} />
                    
                    {/* Content */}
                    <div className="relative z-10 flex items-center gap-6 pointer-events-none">
                      <span className={cn(
                        "text-sm font-display tracking-widest transition-colors duration-300",
                        isActive ? "text-accent" : "text-bone/60 group-hover:text-bone"
                      )}>
                        {(index + 1).toString().padStart(2, '0')}
                      </span>
                      <h3 className={cn(
                        "text-3xl md:text-5xl font-display uppercase tracking-wide m-0 transition-all duration-300",
                        isActive ? "text-bone translate-x-4" : "text-bone/80 group-hover:text-bone group-hover:translate-x-2"
                      )}>
                        {sport.name}
                      </h3>
                    </div>
                    
                    <span className={cn(
                      "relative z-10 transition-all duration-300",
                      isActive ? "text-accent translate-x-0 opacity-100" : "text-bone/0 -translate-x-4 opacity-0 group-hover:text-bone/60 group-hover:translate-x-0 group-hover:opacity-100"
                    )}>
                      →
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dynamic Image Display */}
          <div className="lg:col-span-7 h-[40vh] min-h-[280px] sm:min-h-[350px] lg:h-[70vh] lg:min-h-[400px] relative">
            <div 
              ref={imageContainerRef}
              className="w-full h-full relative overflow-hidden bg-ink-light"
            >
              <Image
                src={activeSport.image}
                alt={activeSport.name}
                fill
                className="active-image object-cover object-center transition-transform duration-700 hover:scale-110"
                sizes="(max-width: 1024px) 100vw, 60vw"
                priority
              />
              <div className="absolute inset-0 bg-ink/20 mix-blend-multiply transition-opacity duration-300 hover:opacity-0" />
              
              {/* Sport Meta Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-ink/80 to-transparent">
                <p className="text-bone/90 text-lg md:text-xl font-medium max-w-md">
                  {activeSport.description}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
