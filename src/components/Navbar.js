"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { EVENT_DATA } from "@/data/event";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const menuInnerRef = useRef(null);

  const tl = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Keyboard accessibility
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileMenuOpen]);

  useGSAP(() => {
    gsap.set(mobileMenuRef.current, {
      yPercent: -100,
      autoAlpha: 0,
      pointerEvents: "none",
    });

    tl.current = gsap.timeline({ paused: true })
      .to(mobileMenuRef.current, {
        yPercent: 0,
        autoAlpha: 1,
        pointerEvents: "auto",
        duration: 0.7,
        ease: "power4.inOut",
      })
      .fromTo(
        ".mobile-nav-link",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.05, ease: "power3.out" },
        "-=0.3"
      );

    // Initial state check in case React state is true on mount (e.g. back navigation)
    if (isMobileMenuOpen) {
      tl.current.progress(1);
    }
  }, { scope: navRef }); // Scoped to navRef

  useEffect(() => {
    if (tl.current) {
      if (isMobileMenuOpen) {
        tl.current.play();
      } else {
        tl.current.reverse();
      }
    }
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: "ABOUT", href: "/about" },
    { name: "RULES", href: "/rules" },
    { name: "SCHEDULE", href: "/schedule" },
    { name: "FOR QUERY", href: "/for-query" },
  ];

  return (
    <>
      {/* DESKTOP NAVBAR */}
      <header
        ref={navRef}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-fluid",
          isScrolled
            ? "py-2 bg-bone/75 backdrop-blur-md border-b border-ink/10 shadow-sm"
            : "py-3 bg-bone/30 backdrop-blur-sm border-b border-ink/5"
        )}
      >
        <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Link href="/" className="group flex items-center">
              <Image
                src="/LOGO/wordmark_transparent_v2.png"
                alt="Athlima 2026 Wordmark"
                width={240}
                height={60}
                className="h-16 w-auto object-contain -ml-4 md:-ml-8 transition-transform duration-300 group-hover:scale-105"
                priority
              />
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link, i) => (
              <Link
                key={i}
                href={link.href}
                className="text-sm font-medium tracking-widest text-ink hover:text-cobalt transition-colors duration-300 relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[1px] after:bg-cobalt after:scale-x-0 after:origin-right hover:after:scale-x-100 hover:after:origin-left after:transition-transform after:duration-300"
              >
                {link.name}
              </Link>
            ))}
            <Link
              href={EVENT_DATA.registrationUrl}
              className="px-6 py-2.5 bg-ink text-bone text-sm font-semibold tracking-widest uppercase hover:bg-cobalt transition-colors duration-300 group"
            >
              REGISTER <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </nav>

          <button
            className="md:hidden relative flex items-center justify-center min-w-[48px] min-h-[48px] text-ink z-[9999] pointer-events-auto cursor-pointer"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <div className="relative w-6 h-5 pointer-events-none">
              <span className={cn("absolute left-0 w-full h-0.5 bg-current transition-all duration-300 ease-out", isMobileMenuOpen ? "top-2 rotate-45" : "top-0")} />
              <span className={cn("absolute left-0 top-2 w-full h-0.5 bg-current transition-all duration-300 ease-out", isMobileMenuOpen ? "opacity-0 scale-x-0" : "opacity-100")} />
              <span className={cn("absolute left-0 w-full h-0.5 bg-current transition-all duration-300 ease-out", isMobileMenuOpen ? "top-2 -rotate-45" : "top-4")} />
            </div>
          </button>
        </div>
      </header>

      {/* MOBILE FULLSCREEN MENU */}
      <div
        id="mobile-menu"
        ref={mobileMenuRef}
        className="fixed inset-0 z-40 bg-bone flex flex-col justify-center px-8 overscroll-none invisible opacity-0 pointer-events-none"
      >
        <div ref={menuInnerRef} className="flex flex-col gap-6 w-full">
          {navLinks.map((link, i) => (
            <Link
              key={i}
              href={link.href}
              className="mobile-nav-link font-display text-4xl sm:text-5xl md:text-6xl tracking-wide uppercase text-ink hover:text-cobalt transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <div className="mobile-nav-link h-px w-full bg-ink/10 my-4" />
          <Link
            href={EVENT_DATA.registrationUrl}
            className="mobile-nav-link flex items-center gap-4 font-display text-3xl sm:text-4xl md:text-5xl tracking-wide uppercase text-accent hover:text-cobalt transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            REGISTER NOW <span>→</span>
          </Link>
        </div>

        <div className="absolute bottom-8 left-8 right-8 flex justify-between text-xs font-medium tracking-widest text-ink/50 uppercase">
          <span>{EVENT_DATA.shortOrg}</span>
          <span>EST. {EVENT_DATA.year}</span>
        </div>
      </div>
    </>
  );
}
