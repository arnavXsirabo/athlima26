"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { EVENT_DATA } from "@/data/event";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const menuInnerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    
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
    if (isMobileMenuOpen) {
      gsap.to(mobileMenuRef.current, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        duration: 0.8,
        ease: "power4.inOut",
      });
      gsap.fromTo(
        ".mobile-nav-link",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.05, ease: "power3.out", delay: 0.3 }
      );
    } else {
      gsap.to(mobileMenuRef.current, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
        duration: 0.6,
        ease: "power3.inOut",
      });
    }
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: "ABOUT", href: "/about" },
    { name: "RULES", href: "/rules" },
    { name: "SCHEDULE", href: "/schedule" },
    { name: "CONTACT", href: "/contact" },
  ];

  return (
    <>
      {/* DESKTOP NAVBAR */}
      <header
        ref={navRef}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-fluid",
          isScrolled
            ? "py-4 bg-bone/95 backdrop-blur-md border-b border-ink/10 shadow-sm"
            : "py-6 bg-bone/50 backdrop-blur-sm border-b border-ink/5"
        )}
      >
        <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Link href="/" className="group flex items-center">
              <span className="font-display text-3xl md:text-4xl tracking-wide uppercase leading-none group-hover:text-cobalt transition-colors duration-300">
                {EVENT_DATA.name} <span className="text-accent">26</span>
              </span>
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
            className="md:hidden flex items-center text-ink z-50 relative"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </header>

      {/* MOBILE FULLSCREEN MENU */}
      <div
        ref={mobileMenuRef}
        className="fixed inset-0 z-40 bg-bone flex flex-col justify-center px-8"
        style={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)" }}
      >
        <div ref={menuInnerRef} className="flex flex-col gap-6 w-full">
          {navLinks.map((link, i) => (
            <Link
              key={i}
              href={link.href}
              className="mobile-nav-link font-display text-6xl tracking-wide uppercase text-ink hover:text-cobalt transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <div className="mobile-nav-link h-px w-full bg-ink/10 my-4" />
          <Link
            href={EVENT_DATA.registrationUrl}
            className="mobile-nav-link flex items-center gap-4 font-display text-5xl tracking-wide uppercase text-accent hover:text-cobalt transition-colors"
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
