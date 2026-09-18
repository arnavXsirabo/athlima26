"use client";

import { useRef } from "react";
import Image from "next/image";
import { EVENT_DATA } from "@/data/event";
import Countdown from "./Countdown";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HeroLayer() {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const imageRef = useRef(null);

  useGSAP(() => {
    let mm = gsap.matchMedia();
    
    mm.add("(min-width: 768px)", () => {
      const tl = gsap.timeline();

      tl.fromTo(
        imageRef.current,
        { scale: 1.1, opacity: 0, filter: "blur(10px)" },
        { scale: 1, opacity: 1, filter: "blur(0px)", duration: 1.5, ease: "power3.out" }
      ).fromTo(
        ".hero-text",
        { y: 100, opacity: 0, rotate: 2 },
        { y: 0, opacity: 1, rotate: 0, duration: 1.2, stagger: 0.1, ease: "power4.out" },
        "-=1"
      ).fromTo(
        ".hero-metadata",
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.8, stagger: 0.1, ease: "power2.out" },
        "-=0.8"
      );

      // Parallax effect on scroll
      gsap.to(imageRef.current, {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(titleRef.current, {
        yPercent: -50,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    });

    mm.add("(max-width: 767px)", () => {
      const tl = gsap.timeline();

      tl.fromTo(
        imageRef.current,
        { scale: 1.05, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.2, ease: "power2.out" }
      ).fromTo(
        ".hero-text",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" },
        "-=0.6"
      ).fromTo(
        ".hero-metadata",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
        "-=0.5"
      );
      
      // Removed expensive layout/filter scrubs on mobile
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="grid grid-cols-1 grid-rows-1 w-full h-[100dvh] min-h-[600px] overflow-hidden bg-ink">
      {/* Background Image Layer */}
      <div className="col-start-1 row-start-1 z-0 w-full h-full relative pointer-events-none">
        <div ref={imageRef} className="w-full h-full relative">
          <Image
            src="https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=2090&auto=format&fit=crop"
            alt="Athlima Basketball Action"
            fill
            className="object-cover object-[50%_30%] opacity-80 mix-blend-luminosity"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
          <div className="absolute inset-0 bg-noise opacity-30" />
        </div>
      </div>

      {/* Content Layer */}
      <div className="col-start-1 row-start-1 z-10 flex flex-col justify-end pb-10 pt-32 px-6 md:px-12 md:pb-12 safe-pb pointer-events-none">
        <div className="container mx-auto h-full flex flex-col justify-end relative">
          
          <div ref={titleRef} className="flex flex-col w-full z-10 flex-grow justify-end">
            {/* The logo is masked to allow animation from bottom */}
            <div className="overflow-hidden flex justify-end w-full mb-8 md:mb-8 lg:mb-10">
              <Image 
                src="/LOGO/athlima 26 logo.png" 
                alt="Athlima 2026 Logo" 
                width={1200} 
                height={900} 
                className="hero-text w-full max-w-5xl max-h-[45vh] md:max-h-[60vh] lg:max-h-[70vh] object-contain object-right-bottom mix-blend-screen opacity-90 drop-shadow-2xl origin-bottom-right"
                priority 
              />
            </div>
          </div>
          
          {/* Timer: stacked naturally on mobile, absolute on desktop */}
          <div className="hero-metadata w-full relative z-20 md:absolute md:bottom-24 lg:bottom-32 md:left-0 flex justify-start pointer-events-auto">
            <Countdown />
          </div>
          
        </div>
      </div>

      {/* Vertical Decorative Line */}
      <div className="hidden md:block absolute right-12 top-0 bottom-0 w-px bg-bone/10 z-20 mix-blend-overlay pointer-events-none" />
    </section>
  );
}
