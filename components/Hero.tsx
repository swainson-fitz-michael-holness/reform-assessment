"use client";
import React, { useRef, useCallback } from "react";
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
    { id: 1, src: "/images/img-0.png", alt: "Sarah Foxx, CEO" },
    { id: 2, src: "/images/img-1.png", alt: "Jeffrey R. Bott, Leading Partner" },
    { id: 3, src: "/images/img-2.png", alt: "Julianna Alvarez, Founder" },
    { id: 4, src: "/images/img-3.png", alt: "Oscar Wilder, CEO Engineer" },
];

// ===========================================
// RESPONSIVE SCALING UTILITIES
// ===========================================

// Design tokens at 1440px base
const DESIGN_TOKENS = {
    // Marquee dimensions
    marqueeWidth: 662,
    marqueeExpandedWidth: 670,
    marqueeHeight: 79,

    // Card slider dimensions
    cardWidth: 493,
    cardHeight: 244,
    cardGap: 0,

    // Breakpoints
    desktop: 1440,
    tablet: 1024,
    mobile: 768,

    // Tablet/mobile overrides
    tablet_cardWidth: 350,
    tablet_cardHeight: 190,
    mobile_cardWidth: 280,
    mobile_cardHeight: 156,
    tablet_marqueeWidth: 400,
    mobile_marqueeWidth: 280,
} as const;

/**
 * Calculates a responsive value based on viewport width
 * - >= 1440px: returns the exact design value
 * - 1024-1439px: scales proportionally (value / 1440 * viewportWidth)
 * - < 1024px: returns tablet/mobile specific value if provided
 */
function getResponsiveValue(
    designValue: number,
    viewportWidth: number,
    tabletValue?: number,
    mobileValue?: number
): number {
    if (viewportWidth >= DESIGN_TOKENS.desktop) {
        return designValue;
    }

    if (viewportWidth >= DESIGN_TOKENS.tablet) {
        // Proportional scaling between 1024-1439px
        return (designValue / DESIGN_TOKENS.desktop) * viewportWidth;
    }

    if (viewportWidth >= DESIGN_TOKENS.mobile && tabletValue !== undefined) {
        return tabletValue;
    }

    if (mobileValue !== undefined) {
        return mobileValue;
    }

    // Fallback: continue proportional scaling
    return (designValue / DESIGN_TOKENS.desktop) * viewportWidth;
}

/**
 * Returns all responsive dimensions needed for animations
 */
function getResponsiveDimensions(viewportWidth: number) {
    return {
        // Marquee
        marqueeWidth: getResponsiveValue(
            DESIGN_TOKENS.marqueeWidth,
            viewportWidth,
            DESIGN_TOKENS.tablet_marqueeWidth,
            DESIGN_TOKENS.mobile_marqueeWidth
        ),
        marqueeExpandedWidth: getResponsiveValue(
            DESIGN_TOKENS.marqueeExpandedWidth,
            viewportWidth,
            DESIGN_TOKENS.tablet_marqueeWidth + 10,
            DESIGN_TOKENS.mobile_marqueeWidth + 10
        ),
        marqueeHeight: getResponsiveValue(
            DESIGN_TOKENS.marqueeHeight,
            viewportWidth,
            60,
            50
        ),

        // Cards
        cardWidth: getResponsiveValue(
            DESIGN_TOKENS.cardWidth,
            viewportWidth,
            DESIGN_TOKENS.tablet_cardWidth,
            DESIGN_TOKENS.mobile_cardWidth
        ),
        cardHeight: getResponsiveValue(
            DESIGN_TOKENS.cardHeight,
            viewportWidth,
            DESIGN_TOKENS.tablet_cardHeight,
            DESIGN_TOKENS.mobile_cardHeight
        ),
        cardGap: DESIGN_TOKENS.cardGap,

        // Computed
        get step() {
            return this.cardWidth + this.cardGap;
        },
        get totalWidth() {
            return CARDS.length * this.step;
        },
    };
}

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

    // Store animation state for cleanup
    const animationStateRef = useRef<{
        isAnimating: boolean;
        tickerFunc: (() => void) | null;
    }>({
        isAnimating: true,
        tickerFunc: null,
    });

    // Get current dimensions (memoized callback)
    const getDimensions = useCallback(() => {
        const viewportWidth = typeof window !== "undefined" ? window.innerWidth : DESIGN_TOKENS.desktop;
        return getResponsiveDimensions(viewportWidth);
    }, []);

    useGSAP(() => {
        const dims = getDimensions();

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

        // Use responsive marquee width
        tl.to(marqueeWrapperRef.current, {
            width: dims.marqueeExpandedWidth,
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
            // Use responsive dimensions
            const cardWidth = dims.cardWidth;
            const gap = dims.cardGap;
            const step = dims.step;
            const totalCards = cards.length;
            const totalWidth = dims.totalWidth;

            // The "focus point" - CENTER of the slider
            const containerWidth = sliderContainer.offsetWidth;
            const focusPointX = containerWidth / 2;

            // Initial positioning: arrange cards in a CIRCULAR layout around center
            const initialOffset = focusPointX - cardWidth / 2;

            // Position all cards FIRST (while still hidden via CSS)
            cards.forEach((card, i) => {
                // Calculate position relative to center (card[1] at center means i-1)
                let relativePos = i - 1;

                // Wrap cards that would be too far right to the left side
                const halfCards = Math.floor(totalCards / 2);
                if (relativePos >= halfCards) {
                    relativePos -= totalCards;
                }

                const xPos = initialOffset + relativePos * step;
                gsap.set(card, { x: xPos });
            });

            // Scale & opacity calculation based on distance from center
            const updateScales = (revealCards = false) => {
                const containerRect = sliderContainer.getBoundingClientRect();
                const focusPoint = containerRect.left + focusPointX;

                // Scale maxDist proportionally too
                const currentDims = getDimensions();
                const maxDist = getResponsiveValue(500, window.innerWidth, 400, 300);

                cards.forEach((card) => {
                    if (!card) return;
                    const rect = card.getBoundingClientRect();
                    const cardCenter = rect.left + rect.width / 2;

                    const dist = Math.abs(focusPoint - cardCenter);

                    // Normalize: 1 at center, 0 at maxDist
                    const normDist = Math.max(0, 1 - dist / maxDist);

                    // Scale: 0.8 base + up to 0.2 bonus at center = 1.0 max
                    const scale = 0.8 + (0.2 * normDist);

                    if (revealCards) {
                        gsap.set(card, {
                            scale: scale,
                            autoAlpha: 1,
                            zIndex: Math.round(normDist * 100)
                        });
                    } else {
                        gsap.set(card, {
                            scale: scale,
                            zIndex: Math.round(normDist * 100)
                        });
                    }
                });
            };

            // Initial scale setup AND reveal cards
            updateScales(true);

            // Wrap utility: instantly reposition cards that go off-screen
            const wrapCards = () => {
                // Get current dimensions (in case of resize)
                const currentDims = getDimensions();
                const currentStep = currentDims.step;
                const currentTotalWidth = currentDims.totalWidth;
                const currentCardWidth = currentDims.cardWidth;
                const currentGap = currentDims.cardGap;

                cards.forEach((card) => {
                    const currentX = gsap.getProperty(card, "x") as number;

                    // If card moved too far right (off right edge), wrap to left end
                    if (currentX > containerWidth) {
                        gsap.set(card, { x: currentX - currentTotalWidth });
                    }
                    // If card moved too far left (off left edge), wrap to right end
                    else if (currentX < -currentCardWidth - currentGap) {
                        gsap.set(card, { x: currentX + currentTotalWidth });
                    }
                });
            };

            // Recursive step animation for true infinite loop
            animationStateRef.current.isAnimating = true;

            const animateNextStep = () => {
                if (!animationStateRef.current.isAnimating) return;

                // Get current step size (responsive)
                const currentDims = getDimensions();
                const currentStep = currentDims.step;

                // Animate all cards RIGHT by one step
                gsap.to(cards, {
                    x: `+=${currentStep}`,
                    duration: 1.4,
                    ease: "power4.inOut",
                    stagger: 0,
                    onComplete: () => {
                        // Wrap cards that went off-screen
                        wrapCards();

                        // Pause at this position
                        gsap.delayedCall(5.0, animateNextStep);
                    }
                });
            };

            // Start the animation loop after initial delay
            gsap.delayedCall(1.2, animateNextStep);

            // Ticker for smooth scale updates during animation
            const tickerFunc = () => updateScales(false);
            gsap.ticker.add(tickerFunc);
            animationStateRef.current.tickerFunc = tickerFunc;

            // Handle resize: reposition cards to maintain layout
            const handleResize = () => {
                const newDims = getDimensions();
                const newCardWidth = newDims.cardWidth;
                const newStep = newDims.step;
                const newTotalWidth = newDims.totalWidth;

                const newContainerWidth = sliderContainer.offsetWidth;
                const newFocusPointX = newContainerWidth / 2;
                const newInitialOffset = newFocusPointX - newCardWidth / 2;

                // Recalculate positions based on current card order
                // Find which card is closest to center
                const containerRect = sliderContainer.getBoundingClientRect();
                const centerX = containerRect.left + newFocusPointX;

                let closestCardIndex = 0;
                let closestDistance = Infinity;

                cards.forEach((card, i) => {
                    const rect = card.getBoundingClientRect();
                    const cardCenter = rect.left + rect.width / 2;
                    const dist = Math.abs(centerX - cardCenter);
                    if (dist < closestDistance) {
                        closestDistance = dist;
                        closestCardIndex = i;
                    }
                });

                // Reposition all cards relative to the closest one
                cards.forEach((card, i) => {
                    let relativePos = i - closestCardIndex;

                    // Wrap to maintain circular layout
                    const halfCards = Math.floor(totalCards / 2);
                    if (relativePos > halfCards) {
                        relativePos -= totalCards;
                    } else if (relativePos < -halfCards) {
                        relativePos += totalCards;
                    }

                    const xPos = newInitialOffset + relativePos * newStep;
                    gsap.set(card, { x: xPos });
                });

                // Update scales after repositioning
                updateScales(false);
            };

            window.addEventListener("resize", handleResize);

            // Cleanup
            return () => {
                animationStateRef.current.isAnimating = false;
                if (animationStateRef.current.tickerFunc) {
                    gsap.ticker.remove(animationStateRef.current.tickerFunc);
                }
                window.removeEventListener("resize", handleResize);
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
                                        priority={index < 3}
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