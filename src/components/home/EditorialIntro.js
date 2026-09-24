"use client";

import { useRef } from "react";
import { EVENT_DATA } from "@/data/event";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export default function EditorialIntro() {
  const containerRef = useRef(null);

  useGSAP(() => {
    let mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
          end: "center center",
          scrub: 1,
        }
      });

      tl.fromTo(
        ".intro-word",
        { y: 100, opacity: 0, rotate: 5 },
        { y: 0, opacity: 1, rotate: 0, stagger: 0.1, ease: "power3.out", duration: 1 }
      ).fromTo(
        ".intro-image-container",
        { clipPath: "inset(100% 0% 0% 0%)", scale: 1.1 },
        { clipPath: "inset(0% 0% 0% 0%)", scale: 1, duration: 1.5, ease: "power4.inOut" },
        "-=0.8"
      ).fromTo(
        ".intro-desc",
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 1 },
        "-=1"
      );

      // Slight parallax on the image
      gsap.to(".intro-parallax-img", {
        yPercent: 15,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    });

    mm.add("(max-width: 767px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
        }
      });

      tl.fromTo(
        ".intro-word",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, ease: "power2.out", duration: 0.8 }
      ).fromTo(
        ".intro-image-container",
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 1, ease: "power3.out" },
        "-=0.4"
      ).fromTo(
        ".intro-desc",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 },
        "-=0.6"
      );
    });
  }, { scope: containerRef });

  // Split theme into words for animation
  const themeWords = EVENT_DATA.theme.split(" ");

  return (
    <section ref={containerRef} className="relative w-full py-16 md:py-32 lg:py-48 px-6 md:px-12 bg-bone text-ink overflow-hidden">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* Left Column: Typography */}
          <div className="lg:col-span-6 flex flex-col z-10">
            <h2 className="font-display text-fluid-h1 leading-none uppercase m-0 p-0 flex flex-wrap gap-x-4 md:gap-x-8">
              {themeWords.map((word, i) => (
                <div key={i} className="overflow-hidden inline-block pb-4">
                  <span className="intro-word inline-block origin-bottom-left">{word}</span>
                </div>
              ))}
            </h2>

            <div className="intro-desc mt-12 max-w-xl">
              <p className="text-xl md:text-2xl font-medium leading-relaxed text-ink/80 mb-6">
                Athlima is the annual sports fest of Sikkim Manipal Institute of Technology and one of the most energetic and unifying events of the academic year.
              </p>
              <p className="text-lg font-medium leading-relaxed text-ink/60">
                It celebrates team spirit, endurance, discipline, and passion for sports, bringing together athletes from various colleges to compete and excel in a wide range of sporting events.
              </p>
              <div className="mt-8 flex items-center gap-4">
                <div className="w-12 h-px bg-accent"></div>
                <span className="text-xs font-bold tracking-widest text-accent uppercase">
                  Est. {EVENT_DATA.year}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Image */}
          <div className="lg:col-span-6 relative mt-12 lg:mt-0">
            <div className="intro-image-container relative aspect-[4/3] md:aspect-video lg:aspect-[16/10] overflow-hidden bg-ink/5">
              <video
                src="/sports/video.mp4"
                className="intro-parallax-img object-cover w-full h-full scale-110 absolute inset-0"
                autoPlay
                loop
                muted
                playsInline
              />
              <div className="absolute inset-0 bg-noise opacity-40 mix-blend-overlay"></div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
