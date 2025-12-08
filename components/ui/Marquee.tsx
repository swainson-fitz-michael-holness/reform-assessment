"use client";
import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { AlertCircle, FileQuestion, Ban, Timer } from "lucide-react";

const ITEMS = [
  { text: "UNPREDICTABLE RATE INCREASES", icon: <AlertCircle size={16} /> },
  { text: "LACK OF TRANSPARENCY", icon: <Ban size={16} /> },
  { text: "IMPLEMENTATION HEADACHES", icon: <Timer size={16} /> },
  { text: "FRUSTRATED USERS", icon: <FileQuestion size={16} /> },
];

export default function Marquee() {
  // 1. Explicitly type the refs as HTMLDivElement
  const container = useRef<HTMLDivElement>(null);
  const slider = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // 2. Add a safety guard. If the ref isn't attached, stop.
    if (!slider.current) return;

    const totalWidth = slider.current.scrollWidth / 2; 
    
    gsap.to(slider.current, {
      x: -totalWidth,
      duration: 20, 
      ease: "none",
      repeat: -1,
    });
  }, { scope: container });

  return (
    <div 
        ref={container} 
        className="inline-flex h-[1em] w-[45vw] md:w-[35vw] align-middle overflow-hidden rounded-full border border-gray-200 bg-white mx-2 relative top-[-0.1em]"
    >
      <div ref={slider} className="flex items-center whitespace-nowrap h-full">
        {[...ITEMS, ...ITEMS].map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-2 px-4 text-[0.35em] font-bold tracking-widest text-orange-400 uppercase"
          >
            {/* 3. Render icons slightly smaller to fit the em-based layout if needed */}
            <span className="scale-75">{item.icon}</span>
            <span>{item.text}</span>
            <span className="ml-4 text-gray-300">|</span>
          </div>
        ))}
      </div>
    </div>
  );
}