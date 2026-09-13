"use client";

import { useRef } from "react";
import { EVENT_DATA } from "@/data/event";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function BigNumbers() {
  const containerRef = useRef(null);
  
  useGSAP(() => {
    // Number counting animation
    const numbers = gsap.utils.toArray(".stat-value");
    
    numbers.forEach((num) => {
      const finalVal = parseInt(num.getAttribute("data-value"), 10) || 0;
      const suffix = num.getAttribute("data-suffix") || "";
      
      gsap.fromTo(num, 
        { innerHTML: 0 },
        { 
          innerHTML: finalVal,
          duration: 2,
          ease: "power2.out",
          snap: { innerHTML: 1 },
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
          },
          onUpdate: function() {
            num.innerHTML = Math.round(this.targets()[0].innerHTML) + suffix;
          }
        }
      );
    });

    // Fade up text elements
    gsap.fromTo(".stat-block", 
      { opacity: 0, y: 30 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.8, 
        stagger: 0.15, 
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
        }
      }
    );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="py-24 md:py-48 bg-bone text-ink relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8 border-t border-ink/10 pt-12 md:pt-24">
          
          {EVENT_DATA.stats.map((stat, i) => {
            // Extract numeric part and suffix (e.g. "30+" -> 30 and "+")
            const match = stat.value.match(/^(\d+)(.*)$/);
            const num = match ? match[1] : stat.value;
            const suffix = match ? match[2] : "";

            return (
              <div key={i} className="stat-block flex flex-col">
                <span 
                  className="stat-value text-6xl md:text-8xl lg:text-[10rem] font-display text-ink leading-none tracking-tight -ml-2"
                  data-value={num}
                  data-suffix={suffix}
                >
                  0{suffix}
                </span>
                <span className="text-sm md:text-base font-bold tracking-widest uppercase mt-4 text-accent">
                  {stat.label}
                </span>
              </div>
            );
          })}
          
        </div>
      </div>
    </section>
  );
}
