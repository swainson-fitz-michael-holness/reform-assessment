"use client";
import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { CustomEase } from "gsap/CustomEase";
import ArrowButton from "./ui/ArrowButton";
import { AlertCircle, FileQuestion, Ban, Timer } from "lucide-react";
import Image from "next/image";
import "./hero.css";

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
];

export default function Hero() {
    const containerRef = useRef<HTMLElement>(null);
    const marqueeWrapperRef = useRef<HTMLDivElement>(null);
    const marqueeTrackRef = useRef<HTMLDivElement>(null);

    // Slider Refs
    const sliderContainerRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

    // Refs for the text parts
    const textRef1 = useRef<HTMLSpanElement>(null);
    const textRef2 = useRef<HTMLSpanElement>(null);
    const textRef3 = useRef<HTMLSpanElement>(null);

    useGSAP(() => {
        // 1. Marquee Infinite Scroll
        if (marqueeTrackRef.current) {
            const w = marqueeTrackRef.current.scrollWidth / 2;
            gsap.to(marqueeTrackRef.current, {
                x: -w,
                duration: 5,
                ease: "none",
                repeat: -1,
            });
        }

        // 2. MAIN ANIMATION SEQUENCE (Marquee collapse)
        const tl = gsap.timeline({ delay: 3 });

        tl.to(marqueeWrapperRef.current, {
            width: "670px",
            duration: 0.7,
            ease: "sine.in",
        });

        tl.add("collapseStart");

        tl.to(marqueeWrapperRef.current, {
            width: 0,
            marginLeft: 0,
            marginRight: 18,
            padding: 0,
            duration: 1.0,
            ease: CustomEase.create("custom", "M0,0 C0.482,0 0.798,0.419 0.844,0.588 0.911,0.836 0.915,0.935 1,1 "),
        }, "collapseStart");

        tl.to(marqueeWrapperRef.current, {
            height: 0,
            duration: 0.5,
            ease: CustomEase.create("custom", "M0,0 C0.482,0 0.798,0.419 0.844,0.588 0.911,0.836 0.915,0.935 1,1 "),
        }, "collapseStart+=0.5");

        tl.to([textRef1.current, textRef2.current, textRef3.current], {
            transform: "skew(1deg)",
            duration: 0.5,
            ease: "power1.inOut"
        }, "collapseStart+=0.5");

        tl.to([textRef1.current, textRef2.current, textRef3.current], {
            color: "var(--c-green-200)",
            transform: "skew(-12deg)",
            duration: 0.3,
            ease: "back.out(1.7)"
        }, ">-0.07");

        // 3. ADVANCED CARD SLIDER - Stepped Infinite Loop
        const sliderContainer = sliderContainerRef.current;
        const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];

        if (sliderContainer && cards.length > 0) {
            const cardWidth = 493;
            const gap = 0;
            const step = cardWidth + gap;
            const totalCards = cards.length;
            const totalWidth = totalCards * step;

            // The "focus point" - CENTER of the slider
            const containerWidth = sliderContainer.offsetWidth;
            const focusPointX = containerWidth / 2;

            // Initial positioning: center the first card, others follow to the right
            // We offset by half a card width so the card CENTER aligns with focusPointX
            // Also shift one card left so there's a visible card on the left side initially
            const initialOffset = focusPointX - cardWidth / 2;

            cards.forEach((card, i) => {
                // Start with card[1] at center, so card[0] peeks from left
                // This means we subtract one step from the base position
                const xPos = initialOffset + (i - 1) * step;
                gsap.set(card, { x: xPos });
            });

            // Scale & opacity calculation based on distance from center
            const updateScales = () => {
                const containerRect = sliderContainer.getBoundingClientRect();
                const focusPoint = containerRect.left + focusPointX;

                cards.forEach((card) => {
                    if (!card) return;
                    const rect = card.getBoundingClientRect();
                    const cardCenter = rect.left + rect.width / 2;

                    const dist = Math.abs(focusPoint - cardCenter);
                    const maxDist = 500;

                    // Normalize: 1 at center, 0 at maxDist
                    const normDist = Math.max(0, 1 - dist / maxDist);

                    // Scale: 0.8 base + up to 0.2 bonus at center = 1.0 max
                    const scale = 0.8 + (0.2 * normDist);
                    // Opacity: subtle fade for distant cards
                    const opacity = 1; // could do 0.6 + (0.4 * normDist)

                    gsap.set(card, {
                        scale: scale,
                        opacity: opacity,
                        zIndex: Math.round(normDist * 100)
                    });
                });
            };

            // Initial scale setup
            updateScales();

            // Wrap utility: instantly reposition cards that go off-screen
            const wrapCards = () => {
                cards.forEach((card) => {
                    const currentX = gsap.getProperty(card, "x") as number;

                    // If card moved too far right (off right edge), wrap to left end
                    if (currentX > containerWidth) {
                        gsap.set(card, { x: currentX - totalWidth });
                    }
                    // If card moved too far left (off left edge), wrap to right end
                    else if (currentX < -cardWidth - gap) {
                        gsap.set(card, { x: currentX + totalWidth });
                    }
                });
            };

            // Recursive step animation for true infinite loop
            let isAnimating = true;

            const animateNextStep = () => {
                if (!isAnimating) return;

                // Animate all cards RIGHT by one step (reversed direction)
                gsap.to(cards, {
                    x: `+=${step}`,
                    duration: 1.4,
                    ease: "power4.inOut",
                    stagger: 0,
                    onComplete: () => {
                        // Wrap cards that went off-screen
                        wrapCards();

                        // Pause at this position (800ms focus time)
                        gsap.delayedCall(5.0, animateNextStep);
                    }
                });
            };

            // Start the animation loop after initial delay
            gsap.delayedCall(1.2, animateNextStep);

            // Ticker for smooth scale updates during animation
            const tickerFunc = () => updateScales();
            gsap.ticker.add(tickerFunc);

            // Cleanup
            return () => {
                isAnimating = false;
                gsap.ticker.remove(tickerFunc);
                gsap.killTweensOf(cards);
            };
        }

    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="hero-section">

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

            {/* SPLIT LAYOUT: CONTENT & SLIDER */}
            <div className="hero-content-wrapper">

                {/* Left Side: Text */}
                <div className="hero-text-side">
                    <p className="hero-description">
                        Join hundreds of businesses who trust Arlo to offer health insurance
                        that works the way it should: affordable coverage that puts
                        employees and their doctors in the driving seat.
                    </p>
                    <ArrowButton text="Get a Custom Quote Today" />
                </div>

                {/* Right Side: Infinite Slider */}
                <div ref={sliderContainerRef} className="hero-slider-side">
                    <div className="slider-track-relative w-full h-full relative">
                        {CARDS.map((card, index) => (
                            <div
                                key={`${card.id}-${index}`}
                                ref={(el) => { cardsRef.current[index] = el; }}
                                className="slider-card"
                            >
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

            </div>
        </section>
    );
}