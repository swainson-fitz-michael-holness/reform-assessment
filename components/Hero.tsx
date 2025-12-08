"use client";
import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ArrowButton from "./ui/ArrowButton";
import Marquee from "./ui/Marquee";
import Image from "next/image";

// Placeholder data for the bottom slider
const CARDS = [
  { id: 1, src: "/images/card-1.png", alt: "Spaw Retreat" }, // REPLACE WITH REAL FILENAMES
  { id: 2, src: "/images/card-2.png", alt: "Sunnyside Up" },
  { id: 3, src: "/images/card-3.png", alt: "Bott and Sons" },
  { id: 4, src: "/images/card-1.png", alt: "Spaw Retreat Copy" }, // Repeat for loop
  { id: 5, src: "/images/card-2.png", alt: "Sunnyside Up Copy" },
];

export default function Hero() {
  const cardSliderRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Bottom Card Slider Animation
    // We animate the 'x' percent of the inner container
    const slider = cardSliderRef.current;
    if (slider) {
       const totalWidth = slider.scrollWidth / 2;
       
       gsap.to(slider, {
         x: -totalWidth, // Move left by 50% of total width (since we doubled content theoretically)
         // Note: For a true infinite loop with varying widths, we usually need Draggable or more complex logic.
         // For this assessment, a slow linear pan is often acceptable. 
         // If "pixel perfect" loop is required, we ensure the content width matches perfectly.
         duration: 30,
         ease: "none",
         repeat: -1,
       });
    }
  });

  return (
    <section className="relative w-full overflow-hidden pt-20 pb-10">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Main Headline */}
        <h1 className="text-display font-medium leading-[0.95] tracking-tight text-black-200">
          Health insurance <br />
          that doesn&apos;t get in{" "}
          <Marquee />{" "}
          the way.
        </h1>

        {/* Subtext and CTA */}
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="max-w-md">
            <p className="text-base md:text-xl leading-relaxed text-black-200">
              Join hundreds of businesses who trust Arlo to offer health insurance
              that works the way it should: affordable coverage that puts
              employees and their doctors in the driving seat.
            </p>
            <div className="mt-8">
              <ArrowButton text="Get a Custom Quote Today" />
            </div>
          </div>
        </div>
      </div>

      {/* Infinite Card Slider */}
      <div className="mt-20 w-full overflow-hidden border-y border-gray-200 bg-off-white py-10">
        <div 
            ref={cardSliderRef} 
            className="flex w-max gap-8 px-4"
        >
          {/* Render Cards - Ensure you have these images in public/images/ */}
          {CARDS.map((card, index) => (
            <div 
              key={`${card.id}-${index}`} 
              className="relative h-[300px] w-[500px] flex-shrink-0 overflow-hidden rounded-xl shadow-sm"
            >
                {/* Using a placeholder div if image fails, or Next Image */}
                <div className="h-full w-full bg-green-100/20">
                    <Image 
                        src={card.src} 
                        alt={card.alt}
                        fill
                        className="object-contain" 
                    />
                </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}