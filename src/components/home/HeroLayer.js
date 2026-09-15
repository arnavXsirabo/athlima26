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
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative w-full h-screen min-h-[700px] overflow-hidden bg-ink">
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0">
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
      <div className="absolute inset-0 z-10 flex flex-col justify-end pb-12 pt-32 px-6 md:px-12">
        <div className="container mx-auto h-full flex flex-col justify-between">
          
          {/* Top Metadata removed per user request */}

          {/* Main Typography & Countdown */}
          <div ref={titleRef} className="flex flex-col w-full mb-16 md:mb-24 lg:mb-32">
            {/* The logo is masked to allow animation from bottom */}
            <div className="overflow-hidden flex justify-end w-full">
              <Image 
                src="/LOGO/athlima 26 logo.png" 
                alt="Athlima 2026 Logo" 
                width={1200} 
                height={900} 
                className="hero-text w-full max-w-5xl max-h-[55vh] md:max-h-[65vh] lg:max-h-[75vh] object-contain object-right-bottom mix-blend-screen opacity-90 drop-shadow-2xl origin-bottom-right"
                priority 
              />
            </div>
          </div>
          
        </div>
        
        {/* Absolutely positioned Timer, decoupled from flex layout */}
        <div className="absolute bottom-16 left-6 md:bottom-24 md:left-12 lg:bottom-32 z-20">
          <div className="hero-metadata">
            <Countdown />
          </div>
        </div>
      </div>

      {/* Vertical Decorative Line */}
      <div className="hidden md:block absolute right-12 top-0 bottom-0 w-px bg-bone/10 z-20 mix-blend-overlay" />
    </section>
  );
}
