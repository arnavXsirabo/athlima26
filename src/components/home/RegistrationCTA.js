"use client";

import { useRef } from "react";
import Link from "next/link";
import { EVENT_DATA } from "@/data/event";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function RegistrationCTA() {
  const containerRef = useRef(null);
  
  useGSAP(() => {
    gsap.fromTo(
      ".cta-text",
      { y: 100, opacity: 0, rotate: 2 },
      { 
        y: 0, 
        opacity: 1, 
        rotate: 0, 
        duration: 1.2, 
        ease: "power4.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
        }
      }
    );
    
    gsap.fromTo(
      ".cta-btn",
      { scale: 0.9, opacity: 0 },
      { 
        scale: 1, 
        opacity: 1, 
        duration: 0.8, 
        delay: 0.2,
        ease: "back.out(1.5)",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
        }
      }
    );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="py-32 md:py-48 bg-accent text-bone relative overflow-hidden flex items-center justify-center">
      {/* Decorative grain/texture */}
      <div className="absolute inset-0 bg-noise opacity-30 mix-blend-multiply"></div>
      
      <div className="container mx-auto px-6 flex flex-col items-center text-center relative z-10">
        <div className="overflow-hidden mb-12">
          <h2 className="cta-text text-fluid-hero font-display uppercase leading-none tracking-tighter m-0 p-0 text-bone drop-shadow-sm">
            READY TO <br /> PLAY?
          </h2>
        </div>
        
        <Link 
          href={EVENT_DATA.registrationUrl}
          className="cta-btn group relative inline-flex items-center justify-center px-12 py-5 bg-ink text-bone font-display tracking-widest uppercase text-2xl md:text-3xl overflow-hidden hover:text-accent transition-colors duration-500"
        >
          {/* Button Hover effect background */}
          <span className="absolute inset-0 w-full h-full bg-bone scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out"></span>
          
          <span className="relative z-10 flex items-center gap-4">
            REGISTER NOW
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-2">→</span>
          </span>
        </Link>
      </div>
    </section>
  );
}
