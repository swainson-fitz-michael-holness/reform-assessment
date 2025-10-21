"use client";
import React, { useRef, useCallback } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { CustomEase } from "gsap/CustomEase";
import ArrowButton from "./ui/ArrowButton";
import { AlertCircle, FileQuestion, Ban, Timer } from "lucide-react";
import Image from "next/image";
import "./hero.css";
import { IlloSvg } from "../public/component-svg/IlloSvg";

if (typeof window !== 'undefined') {
  gsap.registerPlugin(CustomEase);
  console.log("Pugins Initialized");
}

const MARQUEE_ITEMS = [
    { text: "UNPREDICTABLE RATE INCREASES", icon: <IlloSvg /> },
    { text: "LACK OF TRANSPARENCY", icon: <IlloSvg />  },
    { text: "IMPLEMENTATION HEADACHES", icon: <IlloSvg />  },
    { text: "FRUSTRATED USERS", icon: <IlloSvg />  },
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

// Design tokens at base breakpoints
const DESIGN_TOKENS = {
    // Breakpoints
    desktop: 1440,
    tabletMax: 1024,
    tabletMin: 501,
    mobile: 500,

    // Desktop base (1440px) - Horizontal slider
    desktop_marqueeWidth: 662,
    desktop_marqueeExpandedWidth: 670,
    desktop_marqueeHeight: 79,
    desktop_cardWidth: 493,
    desktop_cardHeight: 244,
    desktop_cardGap: 0,  // 16px gap at 1440
    desktop_maxScaleDist: 500,

    // Tablet base (1024px) - Vertical slider
    tablet_marqueeWidth: 307,
    tablet_marqueeExpandedWidth: 315,
    tablet_marqueeHeight: 79,
    tablet_cardWidth: 493,
    tablet_cardHeight: 244,
    tablet_cardGap: 32,  // 16px gap at 1024
    tablet_maxScaleDist: 300,
    tablet_descriptionFontSize: 24,

    // Mobile base (500px) - Horizontal slider (proportional scaling)
    mobile_marqueeWidth: 280,
    mobile_marqueeHeight: 50,
    mobile_cardWidth: 280,
    mobile_cardHeight: 156,
    mobile_cardGap: 8,
    mobile_maxScaleDist: 200,
} as const;

type LayoutMode = 'desktop' | 'tablet' | 'mobile';

/**
 * Determines the current layout mode based on viewport width
 */
function getLayoutMode(viewportWidth: number): LayoutMode {
    if (viewportWidth > DESIGN_TOKENS.tabletMax) return 'desktop';
    if (viewportWidth >= DESIGN_TOKENS.tabletMin) return 'tablet';
    return 'mobile';
}

/**
 * Calculates a responsive value with proportional scaling
 */
function scaleValue(designValue: number, baseWidth: number, viewportWidth: number): number {
    return (designValue / baseWidth) * viewportWidth;
}

/**
 * Returns all responsive dimensions needed for animations based on current viewport
 */
function getResponsiveDimensions(viewportWidth: number) {
    const mode = getLayoutMode(viewportWidth);

    if (mode === 'desktop') {
        const isFixed = viewportWidth >= DESIGN_TOKENS.desktop;
        const baseWidth = DESIGN_TOKENS.desktop;

        return {
            mode: 'desktop' as const,
            marqueeWidth: isFixed
                ? DESIGN_TOKENS.desktop_marqueeWidth
                : scaleValue(DESIGN_TOKENS.desktop_marqueeWidth, baseWidth, viewportWidth),
            marqueeExpandedWidth: isFixed
                ? DESIGN_TOKENS.desktop_marqueeExpandedWidth
                : scaleValue(DESIGN_TOKENS.desktop_marqueeExpandedWidth, baseWidth, viewportWidth),
            marqueeHeight: isFixed
                ? DESIGN_TOKENS.desktop_marqueeHeight
                : scaleValue(DESIGN_TOKENS.desktop_marqueeHeight, baseWidth, viewportWidth),
            cardWidth: isFixed
                ? DESIGN_TOKENS.desktop_cardWidth
                : scaleValue(DESIGN_TOKENS.desktop_cardWidth, baseWidth, viewportWidth),
            cardHeight: isFixed
                ? DESIGN_TOKENS.desktop_cardHeight
                : scaleValue(DESIGN_TOKENS.desktop_cardHeight, baseWidth, viewportWidth),
            cardGap: isFixed
                ? DESIGN_TOKENS.desktop_cardGap
                : scaleValue(DESIGN_TOKENS.desktop_cardGap, baseWidth, viewportWidth),
            maxScaleDist: isFixed
                ? DESIGN_TOKENS.desktop_maxScaleDist
                : scaleValue(DESIGN_TOKENS.desktop_maxScaleDist, baseWidth, viewportWidth),
            get step() { return this.cardWidth + this.cardGap; },
            get totalWidth() { return CARDS.length * this.step; },
        };
    }

    if (mode === 'tablet') {
        const baseWidth = DESIGN_TOKENS.tabletMax;

        return {
            mode: 'tablet' as const,
            marqueeWidth: scaleValue(DESIGN_TOKENS.tablet_marqueeWidth, baseWidth, viewportWidth),
            marqueeExpandedWidth: scaleValue(DESIGN_TOKENS.tablet_marqueeExpandedWidth, baseWidth, viewportWidth),
            marqueeHeight: scaleValue(DESIGN_TOKENS.tablet_marqueeHeight, baseWidth, viewportWidth),
            cardWidth: scaleValue(DESIGN_TOKENS.tablet_cardWidth, baseWidth, viewportWidth),
            cardHeight: scaleValue(DESIGN_TOKENS.tablet_cardHeight, baseWidth, viewportWidth),
            cardGap: scaleValue(DESIGN_TOKENS.tablet_cardGap, baseWidth, viewportWidth),
            maxScaleDist: scaleValue(DESIGN_TOKENS.tablet_maxScaleDist, baseWidth, viewportWidth),
            descriptionFontSize: scaleValue(DESIGN_TOKENS.tablet_descriptionFontSize, baseWidth, viewportWidth),
            get step() { return this.cardHeight + this.cardGap; },
            get totalHeight() { return CARDS.length * this.step; },
        };
    }

    // Mobile: Proportional scaling based on 500px reference (like desktop)
    const baseWidth = DESIGN_TOKENS.mobile;

    return {
        mode: 'mobile' as const,
        marqueeWidth: scaleValue(DESIGN_TOKENS.mobile_marqueeWidth, baseWidth, viewportWidth),
        marqueeExpandedWidth: scaleValue(DESIGN_TOKENS.mobile_marqueeWidth + 10, baseWidth, viewportWidth),
        marqueeHeight: scaleValue(DESIGN_TOKENS.mobile_marqueeHeight, baseWidth, viewportWidth),
        cardWidth: scaleValue(DESIGN_TOKENS.mobile_cardWidth, baseWidth, viewportWidth),
        cardHeight: scaleValue(DESIGN_TOKENS.mobile_cardHeight, baseWidth, viewportWidth),
        cardGap: scaleValue(DESIGN_TOKENS.mobile_cardGap, baseWidth, viewportWidth),
        maxScaleDist: scaleValue(DESIGN_TOKENS.mobile_maxScaleDist, baseWidth, viewportWidth),
        get step() { return this.cardWidth + this.cardGap; },
        get totalWidth() { return CARDS.length * this.step; },
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
        currentMode: LayoutMode | null;
        cleanup: (() => void) | null;
        // Store current animation parameters for consistent wrapping
        animParams: {
            step: number;
            totalSpan: number;
            cardSize: number;
            gap: number;
        } | null;
    }>({
        isAnimating: true,
        tickerFunc: null,
        currentMode: null,
        cleanup: null,
        animParams: null,
    });

    // Get current dimensions
    const getDimensions = useCallback(() => {
        const viewportWidth = typeof window !== "undefined" ? window.innerWidth : DESIGN_TOKENS.desktop;
        return getResponsiveDimensions(viewportWidth);
    }, []);

    // ===========================================
    // HORIZONTAL SLIDER (Desktop: > 1024px & Mobile: <= 500px)
    // ===========================================
    const initHorizontalSlider = useCallback((
        sliderContainer: HTMLDivElement,
        cards: HTMLDivElement[],
        dims: ReturnType<typeof getResponsiveDimensions>
    ) => {
        const cardWidth = dims.cardWidth;
        const gap = dims.cardGap;
        const step = cardWidth + gap;
        const totalCards = cards.length;
        const totalWidth = totalCards * step;

        // Store animation parameters for consistent wrapping
        animationStateRef.current.animParams = {
            step,
            totalSpan: totalWidth,
            cardSize: cardWidth,
            gap
        };

        // The "focus point" - CENTER of the slider
        const containerWidth = sliderContainer.offsetWidth;
        const focusPointX = containerWidth / 2;
        const initialOffset = focusPointX - cardWidth / 2;

        // Position all cards in circular layout with EXPLICIT vertical centering
        cards.forEach((card, i) => {
            let relativePos = i - 1;
            const halfCards = Math.floor(totalCards / 2);
            if (relativePos >= halfCards) {
                relativePos -= totalCards;
            }
            const xPos = initialOffset + relativePos * step;

            // Clear any previous GSAP transforms first
            gsap.set(card, { clearProps: "x,y,xPercent,yPercent,top,left,scale,transform,opacity,visibility" });

            // Set position with explicit vertical centering
            // Using transform for both x position and vertical centering
            gsap.set(card, {
                x: xPos,
                top: '50%',
                yPercent: -50,  // Centers vertically: translateY(-50%)
                left: 0,
                opacity: 0,  // Start hidden, reveal after positioning
                visibility: 'visible'
            });
        });

        // Scale & opacity calculation based on horizontal distance from center
        const updateScales = (revealCards = false) => {
            const containerRect = sliderContainer.getBoundingClientRect();
            const currentContainerWidth = sliderContainer.offsetWidth;
            const currentFocusPoint = containerRect.left + currentContainerWidth / 2;
            const currentDims = getDimensions();
            const maxDist = currentDims.maxScaleDist;

            cards.forEach((card) => {
                if (!card) return;
                const rect = card.getBoundingClientRect();
                const cardCenter = rect.left + rect.width / 2;
                const dist = Math.abs(currentFocusPoint - cardCenter);
                const normDist = Math.max(0, 1 - dist / maxDist);
                const scale = 0.8 + (0.2 * normDist);

                if (revealCards) {
                    gsap.set(card, { scale, opacity: 1, zIndex: Math.round(normDist * 100) });
                } else {
                    gsap.set(card, { scale, zIndex: Math.round(normDist * 100) });
                }
            });
        };

        // Reveal cards after positioning
        updateScales(true);

        // Wrap utility for horizontal - uses stored animation params for consistency
        const wrapCards = () => {
            const params = animationStateRef.current.animParams;
            if (!params) return;

            const currentContainerWidth = sliderContainer.offsetWidth;

            cards.forEach((card) => {
                const currentX = gsap.getProperty(card, "x") as number;

                // Wrap right: if card's left edge is past right edge of container + buffer
                if (currentX > currentContainerWidth + params.gap) {
                    gsap.set(card, { x: currentX - params.totalSpan });
                }
                // Wrap left: if card's right edge is past left edge of container
                else if (currentX < -(params.cardSize + params.gap)) {
                    gsap.set(card, { x: currentX + params.totalSpan });
                }
            });
        };

        // Animation loop - moves RIGHT
        const animateNextStep = () => {
            if (!animationStateRef.current.isAnimating) return;

            const mode = animationStateRef.current.currentMode;
            if (mode !== 'desktop' && mode !== 'mobile') return;

            // Get fresh dimensions for the animation step
            const currentDims = getDimensions();
            const currentStep = currentDims.cardWidth + currentDims.cardGap;

            // Update stored params before animation
            animationStateRef.current.animParams = {
                step: currentStep,
                totalSpan: currentStep * totalCards,
                cardSize: currentDims.cardWidth,
                gap: currentDims.cardGap
            };

            gsap.to(cards, {
                x: `+=${currentStep}`,
                duration: 1.4,
                ease: "power4.inOut",
                onComplete: () => {
                    wrapCards();
                    gsap.delayedCall(5.0, animateNextStep);
                }
            });
        };

        // Ticker for smooth scale updates
        const tickerFunc = () => updateScales(false);
        gsap.ticker.add(tickerFunc);
        animationStateRef.current.tickerFunc = tickerFunc;

        // Start animation
        gsap.delayedCall(1.2, animateNextStep);

        // Resize handler for horizontal - PAUSE animation, reposition, then resume
        let resizeTimeout: NodeJS.Timeout | null = null;
        
        const handleResize = () => {
            const newMode = getLayoutMode(window.innerWidth);
            if (newMode !== 'desktop' && newMode !== 'mobile') return;

            // Debounce resize handling
            if (resizeTimeout) clearTimeout(resizeTimeout);
            
            // Pause animation during resize
            animationStateRef.current.isAnimating = false;
            gsap.killTweensOf(cards);

            resizeTimeout = setTimeout(() => {
                const newDims = getDimensions();
                const newCardWidth = newDims.cardWidth;
                const newGap = newDims.cardGap;
                const newStep = newCardWidth + newGap;
                const newContainerWidth = sliderContainer.offsetWidth;
                const newFocusPointX = newContainerWidth / 2;
                const newInitialOffset = newFocusPointX - newCardWidth / 2;

                // Update stored params
                animationStateRef.current.animParams = {
                    step: newStep,
                    totalSpan: newStep * totalCards,
                    cardSize: newCardWidth,
                    gap: newGap
                };

                // Find closest card to center (maintains visual continuity)
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

                // Reposition relative to closest
                cards.forEach((card, i) => {
                    let relativePos = i - closestCardIndex;
                    const halfCards = Math.floor(totalCards / 2);
                    if (relativePos > halfCards) relativePos -= totalCards;
                    else if (relativePos < -halfCards) relativePos += totalCards;

                    const xPos = newInitialOffset + relativePos * newStep;
                    gsap.set(card, { x: xPos });
                });

                updateScales(false);

                // Resume animation
                animationStateRef.current.isAnimating = true;
                gsap.delayedCall(0.5, animateNextStep);
            }, 150); // Debounce delay
        };

        window.addEventListener("resize", handleResize);

        // Return cleanup function
        return () => {
            if (animationStateRef.current.tickerFunc) {
                gsap.ticker.remove(animationStateRef.current.tickerFunc);
            }
            if (resizeTimeout) clearTimeout(resizeTimeout);
            window.removeEventListener("resize", handleResize);
            gsap.killTweensOf(cards);
        };
    }, [getDimensions]);

    // ===========================================
    // VERTICAL SLIDER (Tablet: 501-1024px)
    // ===========================================
    const initVerticalSlider = useCallback((
        sliderContainer: HTMLDivElement,
        cards: HTMLDivElement[],
        dims: ReturnType<typeof getResponsiveDimensions>
    ) => {
        const cardHeight = dims.cardHeight;
        const cardWidth = dims.cardWidth;
        const gap = dims.cardGap;
        const step = cardHeight + gap;
        const totalCards = cards.length;
        const totalHeight = totalCards * step;

        // Store animation parameters for consistent wrapping
        animationStateRef.current.animParams = {
            step,
            totalSpan: totalHeight,
            cardSize: cardHeight,
            gap
        };

        // The "focus point" - CENTER of the slider vertically
        const containerHeight = sliderContainer.offsetHeight;
        const containerWidth = sliderContainer.offsetWidth;
        const focusPointY = containerHeight / 2;

        // Center cards horizontally
        const centerX = (containerWidth - cardWidth) / 2;

        // Helper: Normalize Y position using modular arithmetic (no infinite loops)
        const normalizeY = (y: number, contHeight: number, cardH: number, g: number, totalH: number): number => {
            // First, bring into [0, totalH) range using modulo
            let normalized = ((y % totalH) + totalH) % totalH;
            
            // Shift so cards are positioned around the visible area
            // We want cards to be in range roughly [-cardH, contHeight + cardH]
            // If normalized puts card too far down, shift it up by totalH
            if (normalized > contHeight + cardH + g) {
                normalized -= totalH;
            }
            
            return normalized;
        };

        // Position cards: distribute them evenly, starting with card 1 at center
        // Use simple sequential positioning, then normalize
        cards.forEach((card, i) => {
            // Card 1 at center, others distributed around it
            const offsetFromCenter = (i - 1) * step;
            const baseY = focusPointY - cardHeight / 2 + offsetFromCenter;
            
            // Normalize to valid range
            const yPos = normalizeY(baseY, containerHeight, cardHeight, gap, totalHeight);

            // Clear previous transforms and set fresh positions
            gsap.set(card, { clearProps: "x,y,xPercent,yPercent,top,left,scale,transform,opacity,visibility" });
            gsap.set(card, {
                x: centerX,
                y: yPos,
                top: 0,
                yPercent: 0,
                left: 0,
                opacity: 0,  // Start hidden, reveal after positioning
                visibility: 'visible'
            });
        });

        // Scale based on vertical distance from center
        const updateScales = (revealCards = false) => {
            const containerRect = sliderContainer.getBoundingClientRect();
            const currentContainerHeight = sliderContainer.offsetHeight;
            const currentFocusPoint = containerRect.top + currentContainerHeight / 2;
            const currentDims = getDimensions();
            const maxDist = currentDims.maxScaleDist;

            cards.forEach((card) => {
                if (!card) return;
                const rect = card.getBoundingClientRect();
                const cardCenter = rect.top + rect.height / 2;
                const dist = Math.abs(currentFocusPoint - cardCenter);
                const normDist = Math.max(0, 1 - dist / maxDist);
                const scale = 0.8 + (0.2 * normDist);

                if (revealCards) {
                    gsap.set(card, { scale, opacity: 1, zIndex: Math.round(normDist * 100) });
                } else {
                    gsap.set(card, { scale, zIndex: Math.round(normDist * 100) });
                }
            });
        };

        // Reveal cards after positioning
        updateScales(true);

        // Wrap utility for vertical - uses modular arithmetic
        const wrapCards = () => {
            const params = animationStateRef.current.animParams;
            if (!params) return;

            const currentContainerHeight = sliderContainer.offsetHeight;

            cards.forEach((card) => {
                const currentY = gsap.getProperty(card, "y") as number;
                const normalized = normalizeY(currentY, currentContainerHeight, params.cardSize, params.gap, params.totalSpan);
                
                if (Math.abs(normalized - currentY) > 1) {
                    gsap.set(card, { y: normalized });
                }
            });
        };

        // Animation loop - moves UP (negative Y direction)
        const animateNextStep = () => {
            if (!animationStateRef.current.isAnimating) return;
            if (animationStateRef.current.currentMode !== 'tablet') return;

            // Get fresh dimensions for the animation step
            const currentDims = getDimensions();
            const currentStep = currentDims.cardHeight + currentDims.cardGap;

            // Update stored params before animation
            animationStateRef.current.animParams = {
                step: currentStep,
                totalSpan: currentStep * totalCards,
                cardSize: currentDims.cardHeight,
                gap: currentDims.cardGap
            };

            gsap.to(cards, {
                y: `-=${currentStep}`,
                duration: 1.4,
                ease: "power4.inOut",
                onComplete: () => {
                    wrapCards();
                    gsap.delayedCall(5.0, animateNextStep);
                }
            });
        };

        // Ticker for smooth scale updates
        const tickerFunc = () => updateScales(false);
        gsap.ticker.add(tickerFunc);
        animationStateRef.current.tickerFunc = tickerFunc;

        // Start animation
        gsap.delayedCall(1.2, animateNextStep);

        // Resize handler - PAUSE animation, reposition, then resume
        let resizeTimeout: NodeJS.Timeout | null = null;
        
        const handleResize = () => {
            const newMode = getLayoutMode(window.innerWidth);
            if (newMode !== 'tablet') return;

            // Debounce resize handling
            if (resizeTimeout) clearTimeout(resizeTimeout);
            
            // Pause animation during resize
            animationStateRef.current.isAnimating = false;
            gsap.killTweensOf(cards);

            resizeTimeout = setTimeout(() => {
                const newDims = getDimensions();
                const newCardHeight = newDims.cardHeight;
                const newCardWidth = newDims.cardWidth;
                const newGap = newDims.cardGap;
                const newStep = newCardHeight + newGap;
                const newTotalHeight = totalCards * newStep;
                const newContainerHeight = sliderContainer.offsetHeight;
                const newContainerWidth = sliderContainer.offsetWidth;
                const newFocusPointY = newContainerHeight / 2;
                const newCenterX = (newContainerWidth - newCardWidth) / 2;

                // Update stored params
                animationStateRef.current.animParams = {
                    step: newStep,
                    totalSpan: newTotalHeight,
                    cardSize: newCardHeight,
                    gap: newGap
                };

                // Find closest card to center (maintains visual continuity)
                const containerRect = sliderContainer.getBoundingClientRect();
                const centerY = containerRect.top + newFocusPointY;
                let closestCardIndex = 0;
                let closestDistance = Infinity;

                cards.forEach((card, i) => {
                    const rect = card.getBoundingClientRect();
                    const cardCenter = rect.top + rect.height / 2;
                    const dist = Math.abs(centerY - cardCenter);
                    if (dist < closestDistance) {
                        closestDistance = dist;
                        closestCardIndex = i;
                    }
                });

                // Reposition all cards relative to closest
                cards.forEach((card, i) => {
                    const offsetFromClosest = (i - closestCardIndex) * newStep;
                    const baseY = newFocusPointY - newCardHeight / 2 + offsetFromClosest;
                    const yPos = normalizeY(baseY, newContainerHeight, newCardHeight, newGap, newTotalHeight);
                    
                    gsap.set(card, { x: newCenterX, y: yPos });
                });

                updateScales(false);

                // Resume animation
                animationStateRef.current.isAnimating = true;
                gsap.delayedCall(0.5, animateNextStep);
            }, 150); // Debounce delay
        };

        window.addEventListener("resize", handleResize);

        // Return cleanup function
        return () => {
            if (animationStateRef.current.tickerFunc) {
                gsap.ticker.remove(animationStateRef.current.tickerFunc);
            }
            if (resizeTimeout) clearTimeout(resizeTimeout);
            window.removeEventListener("resize", handleResize);
            gsap.killTweensOf(cards);
        };
    }, [getDimensions]);

    useGSAP(() => {
        const dims = getDimensions();
        const currentMode = dims.mode;
        const isMobile = currentMode === "mobile";
        animationStateRef.current.currentMode = currentMode;

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

        if (!isMobile) {
            // Use responsive marquee width
            tl.to(marqueeWrapperRef.current, {
                width: dims.marqueeExpandedWidth,
                duration: 0.7,
                ease: "sine.in",
            });
        }

        tl.add("collapseStart");

        const collapseEase = CustomEase.create(
            "custom",
            "M0,0 C0.482,0 0.798,0.419 0.844,0.588 0.911,0.836 0.915,0.935 1,1 "
        );

        // MOBILE: pinch from center using scaleX
        if (isMobile) {
            tl.to(
                marqueeWrapperRef.current,
                {
                    width: 0,
                    height: 0,
                    duration: 1.0,
                    ease: collapseEase,
                },
                "collapseStart"
            );
        } else {
            // TABLET + DESKTOP: keep existing right-to-left width collapse

            tl.to(
                marqueeWrapperRef.current,
                {
                    width: 0,
                    marginLeft: 0,
                    marginRight: 18,
                    padding: 0,
                    duration: 1.0,
                    ease: collapseEase,
                },
                "collapseStart"
            );

            // Vertical collapse (same for all modes)
            tl.to(
                marqueeWrapperRef.current,
                {
                    height: 0,
                    duration: 0.5,
                    ease: collapseEase,
                },
                "collapseStart+=0.5"
            );

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
        }

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

        // 3. INITIALIZE APPROPRIATE SLIDER BASED ON MODE
        const sliderContainer = sliderContainerRef.current;
        const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];

        if (sliderContainer && cards.length > 0) {
            animationStateRef.current.isAnimating = true;

            if (currentMode === 'desktop' || currentMode === 'mobile') {
                // Use desktop-style horizontal slider for both desktop + mobile
                animationStateRef.current.cleanup = initHorizontalSlider(
                    sliderContainer,
                    cards,
                    dims
                );
            } else if (currentMode === 'tablet') {
                animationStateRef.current.cleanup = initVerticalSlider(
                    sliderContainer,
                    cards,
                    dims
                );
            }

            // Mode switch handler - smooth transition with minimal flicker
            let resizeTimeout: NodeJS.Timeout | null = null;

            const handleModeSwitch = () => {
                const newMode = getLayoutMode(window.innerWidth);
                if (newMode !== animationStateRef.current.currentMode) {
                    // Debounce to prevent rapid switches during resize
                    if (resizeTimeout) clearTimeout(resizeTimeout);

                    resizeTimeout = setTimeout(() => {
                        // Cleanup current slider
                        if (animationStateRef.current.cleanup) {
                            animationStateRef.current.cleanup();
                        }
                        gsap.killTweensOf(cards);

                        // Quick fade out, reposition, fade in (minimal flicker)
                        gsap.to(cards, {
                            opacity: 0,
                            duration: 0.15,
                            ease: "power2.out",
                            onComplete: () => {
                                // Initialize new slider (which will reveal cards)
                                animationStateRef.current.currentMode = newMode;
                                animationStateRef.current.isAnimating = true;
                                const newDims = getDimensions();

                                if (newMode === 'desktop' || newMode === 'mobile') {
                                    animationStateRef.current.cleanup =
                                        initHorizontalSlider(sliderContainer, cards, newDims);
                                } else if (newMode === 'tablet') {
                                    animationStateRef.current.cleanup =
                                        initVerticalSlider(sliderContainer, cards, newDims);
                                }
                            }
                        });
                    }, 50);
                }
            };

            window.addEventListener("resize", handleModeSwitch);

            // Cleanup
            return () => {
                animationStateRef.current.isAnimating = false;
                if (resizeTimeout) clearTimeout(resizeTimeout);
                if (animationStateRef.current.cleanup) {
                    animationStateRef.current.cleanup();
                }
                window.removeEventListener("resize", handleModeSwitch);
                gsap.killTweensOf(cards);
            };
        }

    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="hero-section">

            {/* HEADLINE */}
            <div className="headline-wrapper">
                <h1 className="hero-title">
                    Health insurance that <span ref={textRef1} className="anim-text">doesn&apos;t</span>{" "}
                    <br className="hero-line-break" />

                    <span className="whitespace-nowrap">
                        <span ref={textRef2} className="anim-text">get</span>

                        {/* COLLAPSIBLE MARQUEE */}
                        <div ref={marqueeWrapperRef} className="marquee-wrapper">
                            <div ref={marqueeTrackRef} className="marquee-track">
                                {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
                                    <div key={i} className="marquee-item">
                                        <span>{item.icon}</span>
                                        <span>{item.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <span
                            ref={textRef3}
                            className="anim-text hero-text-tail"
                        >
                            in the way.
                        </span>
                    </span>
                </h1>
            </div>

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