"use client";

import { useRef } from "react";
import Image from "next/image";
import { EVENT_DATA } from "@/data/event";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function VisualStory() {
  const containerRef = useRef(null);
  const imagesRef = useRef([]);

  useGSAP(() => {
    // Reveal images staggered as you scroll
    imagesRef.current.forEach((img, i) => {
      if (!img) return;
      
      gsap.fromTo(img,
        { clipPath: "inset(0% 100% 0% 0%)", scale: 1.2 },
        { 
          clipPath: "inset(0% 0% 0% 0%)", 
          scale: 1, 
          duration: 1.5,
          ease: "power3.inOut",
          scrollTrigger: {
            trigger: img,
            start: "top 80%",
            end: "center 50%",
            scrub: 1,
          }
        }
      );

      // Parallax inner image
      const innerImg = img.querySelector("img");
      if (innerImg) {
        gsap.to(innerImg, {
          yPercent: 20,
          ease: "none",
          scrollTrigger: {
            trigger: img,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        });
      }
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="py-24 bg-bone text-ink overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col gap-24 md:gap-32">
          
          {/* First large image */}
          <div className="relative w-full aspect-[4/3] md:aspect-[21/9] bg-ink/5 overflow-hidden">
            <div 
              ref={(el) => (imagesRef.current[0] = el)} 
              className="absolute inset-0 origin-left"
              style={{ transform: 'translateZ(0)' }}
            >
              <Image
                src={EVENT_DATA.gallery[1]}
                alt="Athlima Moments"
                fill
                className="object-cover scale-110"
                sizes="100vw"
              />
            </div>
            
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <h3 className="font-display text-fluid-h2 text-bone mix-blend-difference tracking-widest uppercase">
                Push Limits
              </h3>
            </div>
          </div>
          
          {/* Two column asymmetrical images */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24 items-center">
            <div className="md:col-span-5 md:col-start-2">
              <div 
                ref={(el) => (imagesRef.current[1] = el)} 
                className="relative aspect-[3/4] w-full bg-ink/5 overflow-hidden"
                style={{ transform: 'translateZ(0)' }}
              >
                <Image
                  src={EVENT_DATA.gallery[2]}
                  alt="Athlima Competition"
                  fill
                  className="object-cover scale-110"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
              </div>
            </div>
            
            <div className="md:col-span-4 md:col-start-8 flex flex-col justify-center">
              <h4 className="font-display text-5xl md:text-6xl uppercase tracking-wide leading-none mb-6">
                Legacy <br />
                Of Excellence
              </h4>
              <p className="text-lg font-medium text-ink/70">
                Every year, campuses converge to battle for supremacy. The rivalries are intense, the victories are earned, and the memories last a lifetime.
              </p>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
