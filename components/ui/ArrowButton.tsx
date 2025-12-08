"use client";
import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowRight } from "lucide-react";

interface ArrowButtonProps {
  text: string;
  onClick?: () => void;
}

export default function ArrowButton({ text, onClick }: ArrowButtonProps) {
  const containerRef = useRef<HTMLButtonElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);

  const { contextSafe } = useGSAP({ scope: containerRef });

  const onMouseEnter = contextSafe(() => {
    // Move circle right
    gsap.to(circleRef.current, {
      x: 4, 
      duration: 0.3,
      ease: "power2.out"
    });
    // Move arrow slightly more right inside the circle
    gsap.to(arrowRef.current, {
        x: 2,
        duration: 0.3,
        ease: "power2.out"
    });
  });

  const onMouseLeave = contextSafe(() => {
    gsap.to([circleRef.current, arrowRef.current], {
      x: 0,
      duration: 0.3,
      ease: "power2.out"
    });
  });

  return (
    <button
      ref={containerRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      className="group flex items-center justify-between gap-4 rounded-full border border-black-200 px-6 py-3 text-base font-medium transition-colors hover:bg-off-white"
    >
      <span>{text}</span>
      <div
        ref={circleRef}
        className="flex h-8 w-8 items-center justify-center rounded-full border border-black-200 bg-transparent transition-colors group-hover:border-black-200"
      >
        <div ref={arrowRef}>
            <ArrowRight className="h-4 w-4 text-black-200" />
        </div>
      </div>
    </button>
  );
}