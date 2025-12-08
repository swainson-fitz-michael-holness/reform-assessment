"use client";
import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ArrowButton from "./ui/ArrowButton";
import { AlertCircle, FileQuestion, Ban, Timer } from "lucide-react";
import Image from "next/image";
import "./hero.css"; // Import the CSS file

const MARQUEE_ITEMS = [
    { text: "UNPREDICTABLE RATE INCREASES", icon: <AlertCircle size="1em" /> },
    { text: "LACK OF TRANSPARENCY", icon: <Ban size="1em" /> },
    { text: "IMPLEMENTATION HEADACHES", icon: <Timer size="1em" /> },
    { text: "FRUSTRATED USERS", icon: <FileQuestion size="1em" /> },
];

const CARDS = [
    { id: 1, src: "/images/img-0.png", alt: "Spaw Retreat" },
    { id: 2, src: "/images/img-1.png", alt: "Sunnyside Up" },
    { id: 3, src: "/images/img-2.png", alt: "Bott and Sons" },
    { id: 4, src: "/images/img-3.png", alt: "Another Client" },
    { id: 5, src: "/images/img-0.png", alt: "Spaw Retreat Copy" },
    { id: 6, src: "/images/img-1.png", alt: "Sunnyside Up Copy" },
];

export default function Hero() {
    const containerRef = useRef<HTMLElement>(null);
    const marqueeWrapperRef = useRef<HTMLDivElement>(null);
    const marqueeTrackRef = useRef<HTMLDivElement>(null);
    const cardTrackRef = useRef<HTMLDivElement>(null);

    // Refs for the text parts we need to colorize
    const textRef1 = useRef<HTMLSpanElement>(null); // "doesn't"
    const textRef2 = useRef<HTMLSpanElement>(null); // "get in"
    const textRef3 = useRef<HTMLSpanElement>(null); // "the way"

    useGSAP(() => {
        // 1. Infinite Scrolling Marquee (Inner Track)
        if (marqueeTrackRef.current) {
            const w = marqueeTrackRef.current.scrollWidth / 2;
            gsap.to(marqueeTrackRef.current, {
                x: -w,
                duration: 20,
                ease: "none",
                repeat: -1,
            });
        }

        // 2. Bottom Card Slider (Infinite Loop)
        if (cardTrackRef.current) {
            const w = cardTrackRef.current.scrollWidth / 2;
            gsap.to(cardTrackRef.current, {
                x: -w,
                duration: 40,
                ease: "none",
                repeat: -1,
            });
        }

        // 3. MAIN SEQUENCE: Collapse & Color Change
        const tl = gsap.timeline({ delay: 3 }); // Wait 3 seconds

        // Step A: Shrink the Marquee wrapper to 0 width
        tl.to(marqueeWrapperRef.current, {
            width: 0,
            marginLeft: 0,
            marginRight: 0,
            opacity: 0,
            padding: 0,
            duration: 1.2,
            ease: "power3.inOut"
        })
            // Step B: Turn text Green and Italic simultaneously
            .to([textRef1.current, textRef2.current, textRef3.current], {
                color: "var(--c-green-200)", // Using the CSS variable
                fontStyle: "italic",
                duration: 0.6,
                ease: "power2.out"
            }, "-=0.4"); // Start slightly before the collapse finishes

    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="hero-section">
            <div className="hero-container">

                {/* HEADLINE */}
                <h1 className="hero-title">
                    Health insurance that <span ref={textRef1} className="anim-text">doesn&apos;t</span> <br />

                    <span className="whitespace-nowrap">
                        <span ref={textRef2} className="anim-text">get in</span>

                        {/* COLLAPSIBLE MARQUEE */}
                        <div ref={marqueeWrapperRef} className="marquee-wrapper">
                            <div ref={marqueeTrackRef} className="marquee-track">
                                {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
                                    <div key={i} className="marquee-item">
                                        <span>{item.icon}</span>
                                        <span>{item.text}</span>
                                        <span className="opacity-30">|</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <span ref={textRef3} className="anim-text">the way.</span>
                    </span>
                </h1>

                {/* SUBTEXT & CTA */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="max-w-lg">
                        <p className="text-xl leading-relaxed text-[var(--c-black-200)] mb-8">
                            Join hundreds of businesses who trust Arlo to offer health insurance
                            that works the way it should: affordable coverage that puts
                            employees and their doctors in the driving seat.
                        </p>
                        <ArrowButton text="Get a Custom Quote Today" />
                    </div>
                </div>
            </div>

            {/* BOTTOM SLIDER */}
            <div className="card-slider-section">
                <div ref={cardTrackRef} className="card-track">
                    {CARDS.map((card, index) => (
                        <div key={`${card.id}-${index}`} className="card-item">
                            <div className="relative w-full h-full">
                                <Image
                                    src={card.src}
                                    alt={card.alt}
                                    fill
                                    className="object-contain"
                                    sizes="(max-width: 768px) 300px, 450px"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}