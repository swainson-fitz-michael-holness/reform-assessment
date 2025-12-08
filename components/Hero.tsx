"use client";
import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ArrowButton from "./ui/ArrowButton";
import Marquee from "./ui/Marquee";
import Image from "next/image";

// FIX 1: Paths must be absolute from the public root (exclude '/public')
const CARDS = [
  { id: 1, src: "/images/img-0.png", alt: "Spaw Retreat" }, 
  { id: 2, src: "/images/img-1.png", alt: "Sunnyside Up" },
  { id: 3, src: "/images/img-2.png", alt: "Bott and Sons" },
  { id: 4, src: "/images/img-3.png", alt: "Another Client" },
  // Duplicates for the loop
  { id: 5, src: "/images/img-0.png", alt: "Spaw Retreat Copy" }, 
  { id: 6, src: "/images/img-1.png", alt: "Sunnyside Up Copy" },
  { id: 7, src: "/images/img-2.png", alt: "Bott and Sons Copy" },
];

export default function Hero() {
  const cardSliderRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const slider = cardSliderRef.current;
    if (slider) {
       // We assume the content is doubled, so we move half the total width
       const totalWidth = slider.scrollWidth / 2;
       
       gsap.to(slider, {
         x: -totalWidth, 
         duration: 40, // Slower for elegance
         ease: "none",
         repeat: -1,
       });
    }
  });

  return (
    <section className="relative w-full overflow-hidden pt-20 pb-10">
      <div className="container mx-auto px-4 md:px-8">
        
        <h1 className="text-display font-medium leading-[0.95] tracking-tight text-black-200">
          Health insurance <br />
          that doesn&apos;t get in{" "}
          <Marquee />{" "}
          the way.
        </h1>

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

      <div className="mt-20 w-full overflow-hidden border-y border-gray-200 bg-off-white py-10">
        <div 
            ref={cardSliderRef} 
            className="flex w-max gap-8 px-4"
        >
          {CARDS.map((card, index) => (
            <div 
              key={`${card.id}-${index}`} 
              className="relative h-[300px] w-[500px] flex-shrink-0 overflow-hidden rounded-xl shadow-sm bg-white"
            >
                {/* FIX 2 & 3: Added 'relative' to parent and 'sizes' to Image */}
                <div className="relative h-full w-full bg-green-100/20">
                    <Image 
                        src={card.src} 
                        alt={card.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, 500px"
                        className="object-contain" 
                        priority={index < 3} // Load first 3 immediately
                    />
                </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}