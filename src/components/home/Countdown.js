"use client";

import { useState, useEffect, useRef } from "react";
import { EVENT_DATA } from "@/data/event";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";

export default function Countdown({ className }) {
  const [timeLeft, setTimeLeft] = useState(null);
  const [isLive, setIsLive] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const containerRef = useRef(null);

  // Use Asia/Kolkata timezone specifically
  const targetDate = new Date(EVENT_DATA.startDate).getTime();

  useEffect(() => {
    setIsHydrated(true);
    
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setIsLive(true);
        return null;
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000)
      };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      if (!remaining) {
        clearInterval(timer);
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  useGSAP(() => {
    if (isLive && containerRef.current) {
      gsap.fromTo(
        ".live-text",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );
    }
  }, [isLive]);

  if (!isHydrated) return null; // Prevent hydration errors

  if (isLive) {
    return (
      <div ref={containerRef} className={cn("flex flex-col", className)}>
        <p className="live-text font-display text-4xl md:text-5xl lg:text-7xl uppercase text-accent tracking-wide leading-none">
          {EVENT_DATA.name} {EVENT_DATA.year.slice(2)} <br />
          IS LIVE.
        </p>
      </div>
    );
  }

  if (!timeLeft) return null;

  const timeBlocks = [
    { label: "DAYS", value: String(timeLeft.days).padStart(2, "0") },
    { label: "HOURS", value: String(timeLeft.hours).padStart(2, "0") },
    { label: "MINS", value: String(timeLeft.minutes).padStart(2, "0") },
    { label: "SECS", value: String(timeLeft.seconds).padStart(2, "0") }
  ];

  return (
    <div className={cn("flex gap-6 md:gap-12", className)}>
      {timeBlocks.map((block, idx) => (
        <div key={idx} className="flex flex-col overflow-hidden">
          <span className="font-display text-5xl md:text-7xl lg:text-8xl tracking-wider leading-none tabular-nums text-bone drop-shadow-sm">
            {block.value}
          </span>
          <span className="text-[10px] md:text-xs font-semibold tracking-widest text-bone/70 mt-1">
            {block.label}
          </span>
        </div>
      ))}
    </div>
  );
}
