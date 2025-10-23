"use client";
import React, { useRef, useCallback } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { CustomEase } from "gsap/CustomEase";
import ArrowButton from "./ui/ArrowButton";
import Image from "next/image";
import "./hero.css";
import { IlloSvg } from "../public/component-svg/IlloSvg";

if (typeof window !== 'undefined') {
    gsap.registerPlugin(CustomEase);
}

const MARQUEE_ITEMS = [
    { text: "UNPREDICTABLE RATE INCREASES", icon: <IlloSvg /> },
    { text: "LACK OF TRANSPARENCY", icon: <IlloSvg /> },
    { text: "IMPLEMENTATION HEADACHES", icon: <IlloSvg /> },
    { text: "FRUSTRATED USERS", icon: <IlloSvg /> },
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

const DESIGN_TOKENS = {
    desktop: 1440,
    tabletMax: 1024,
    tabletMin: 501,
    mobile: 500,

    desktop_marqueeWidth: 662,
    desktop_marqueeExpandedWidth: 670,
    desktop_marqueeHeight: 79,
    desktop_cardWidth: 493,
    desktop_cardHeight: 244,
    desktop_cardGap: 0,
    desktop_maxScaleDist: 500,

    tablet_marqueeWidth: 307,
    tablet_marqueeExpandedWidth: 315,
    tablet_marqueeHeight: 79,
    tablet_cardWidth: 493,
    tablet_cardHeight: 244,
    tablet_cardGap: 32,
    tablet_maxScaleDist: 300,
    tablet_descriptionFontSize: 24,

    mobile_marqueeWidth: 280,
    mobile_marqueeHeight: 50,
    mobile_cardWidth: 280,
    mobile_cardHeight: 156,
    mobile_cardGap: 8,
    mobile_maxScaleDist: 200,
} as const;

type LayoutMode = 'desktop' | 'tablet' | 'mobile';

function getLayoutMode(viewportWidth: number): LayoutMode {
    if (viewportWidth > DESIGN_TOKENS.tabletMax) return 'desktop';
    if (viewportWidth >= DESIGN_TOKENS.tabletMin) return 'tablet';
    return 'mobile';
}

function scaleValue(designValue: number, baseWidth: number, viewportWidth: number): number {
    return (designValue / baseWidth) * viewportWidth;
}

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

    const sliderContainerRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

    const textRef1 = useRef<HTMLSpanElement>(null);
    const textRef2 = useRef<HTMLSpanElement>(null);
    const textRef3 = useRef<HTMLSpanElement>(null);

    // Consolidated animation state
    const animationStateRef = useRef<{
        isAnimating: boolean;
        isTransitioning: boolean; // True during card movement animation
        currentMode: LayoutMode | null;
        cleanup: (() => void) | null;
        animParams: {
            step: number;
            totalSpan: number;
            cardSize: number;
            gap: number;
        } | null;
        // Cache container rect to avoid layout thrashing
        cachedContainerRect: DOMRect | null;
        lastRectUpdate: number;
    }>({
        isAnimating: true,
        isTransitioning: false,
        currentMode: null,
        cleanup: null,
        animParams: null,
        cachedContainerRect: null,
        lastRectUpdate: 0,
    });

    const getDimensions = useCallback(() => {
        const viewportWidth = typeof window !== "undefined" ? window.innerWidth : DESIGN_TOKENS.desktop;
        return getResponsiveDimensions(viewportWidth);
    }, []);

    // Optimized: Get cached container rect (update max every 100ms during animation)
    const getContainerRect = useCallback((sliderContainer: HTMLDivElement, forceUpdate = false) => {
        const now = performance.now();
        const state = animationStateRef.current;

        if (forceUpdate || !state.cachedContainerRect || now - state.lastRectUpdate > 100) {
            state.cachedContainerRect = sliderContainer.getBoundingClientRect();
            state.lastRectUpdate = now;
        }
        return state.cachedContainerRect;
    }, []);

    // ===========================================
    // HORIZONTAL SLIDER (Desktop & Mobile)
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

        animationStateRef.current.animParams = {
            step,
            totalSpan: totalWidth,
            cardSize: cardWidth,
            gap
        };

        const containerWidth = sliderContainer.offsetWidth;
        const focusPointX = containerWidth / 2;
        const initialOffset = focusPointX - cardWidth / 2;

        // Position cards
        cards.forEach((card, i) => {
            let relativePos = i - 1;
            const halfCards = Math.floor(totalCards / 2);
            if (relativePos >= halfCards) {
                relativePos -= totalCards;
            }
            const xPos = initialOffset + relativePos * step;

            gsap.set(card, { clearProps: "all" });
            gsap.set(card, {
                x: xPos,
                top: '50%',
                yPercent: -50,
                left: 0,
                opacity: 0,
                visibility: 'visible'
            });
        });

        // Optimized scale update - uses cached rect
        const updateScales = (revealCards = false, forceRectUpdate = false) => {
            const containerRect = getContainerRect(sliderContainer, forceRectUpdate);
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

        // Initial reveal
        updateScales(true, true);

        const wrapCards = () => {
            const params = animationStateRef.current.animParams;
            if (!params) return;

            const currentContainerWidth = sliderContainer.offsetWidth;

            cards.forEach((card) => {
                const currentX = gsap.getProperty(card, "x") as number;

                if (currentX > currentContainerWidth + params.gap) {
                    gsap.set(card, { x: currentX - params.totalSpan });
                } else if (currentX < -(params.cardSize + params.gap)) {
                    gsap.set(card, { x: currentX + params.totalSpan });
                }
            });
        };

        // Ticker - ONLY runs during transitions
        let tickerFunc: (() => void) | null = null;

        const startTicker = () => {
            if (tickerFunc) return; // Already running
            tickerFunc = () => updateScales(false, false);
            gsap.ticker.add(tickerFunc);
        };

        const stopTicker = () => {
            if (tickerFunc) {
                gsap.ticker.remove(tickerFunc);
                tickerFunc = null;
            }
        };

        const animateNextStep = () => {
            if (!animationStateRef.current.isAnimating) return;

            const mode = animationStateRef.current.currentMode;
            if (mode !== 'desktop' && mode !== 'mobile') return;

            const currentDims = getDimensions();
            const currentStep = currentDims.cardWidth + currentDims.cardGap;

            animationStateRef.current.animParams = {
                step: currentStep,
                totalSpan: currentStep * totalCards,
                cardSize: currentDims.cardWidth,
                gap: currentDims.cardGap
            };

            // Start ticker only during animation
            animationStateRef.current.isTransitioning = true;
            startTicker();

            gsap.to(cards, {
                x: `+=${currentStep}`,
                duration: 1.4,
                ease: "power4.inOut",
                onComplete: () => {
                    // Stop ticker after animation completes
                    stopTicker();
                    animationStateRef.current.isTransitioning = false;

                    // Final scale update with fresh rect
                    updateScales(false, true);
                    wrapCards();

                    gsap.delayedCall(5.0, animateNextStep);
                }
            });
        };

        // Start animation loop
        gsap.delayedCall(1.2, animateNextStep);

        // Cleanup
        return () => {
            stopTicker();
            gsap.killTweensOf(cards);
        };
    }, [getDimensions, getContainerRect]);

    // ===========================================
    // VERTICAL SLIDER (Tablet)
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

        animationStateRef.current.animParams = {
            step,
            totalSpan: totalHeight,
            cardSize: cardHeight,
            gap
        };

        const containerHeight = sliderContainer.offsetHeight;
        const containerWidth = sliderContainer.offsetWidth;
        const focusPointY = containerHeight / 2;
        const centerX = (containerWidth - cardWidth) / 2;

        const normalizeY = (y: number, contHeight: number, cardH: number, g: number, totalH: number): number => {
            let normalized = ((y % totalH) + totalH) % totalH;
            if (normalized > contHeight + cardH + g) {
                normalized -= totalH;
            }
            return normalized;
        };

        cards.forEach((card, i) => {
            const offsetFromCenter = (i - 1) * step;
            const baseY = focusPointY - cardHeight / 2 + offsetFromCenter;
            const yPos = normalizeY(baseY, containerHeight, cardHeight, gap, totalHeight);

            gsap.set(card, { clearProps: "all" });
            gsap.set(card, {
                x: centerX,
                y: yPos,
                top: 0,
                yPercent: 0,
                left: 0,
                opacity: 0,
                visibility: 'visible'
            });
        });

        const updateScales = (revealCards = false, forceRectUpdate = false) => {
            const containerRect = getContainerRect(sliderContainer, forceRectUpdate);
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

        updateScales(true, true);

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

        // Ticker - ONLY runs during transitions
        let tickerFunc: (() => void) | null = null;

        const startTicker = () => {
            if (tickerFunc) return;
            tickerFunc = () => updateScales(false, false);
            gsap.ticker.add(tickerFunc);
        };

        const stopTicker = () => {
            if (tickerFunc) {
                gsap.ticker.remove(tickerFunc);
                tickerFunc = null;
            }
        };

        const animateNextStep = () => {
            if (!animationStateRef.current.isAnimating) return;
            if (animationStateRef.current.currentMode !== 'tablet') return;

            const currentDims = getDimensions();
            const currentStep = currentDims.cardHeight + currentDims.cardGap;

            animationStateRef.current.animParams = {
                step: currentStep,
                totalSpan: currentStep * totalCards,
                cardSize: currentDims.cardHeight,
                gap: currentDims.cardGap
            };

            animationStateRef.current.isTransitioning = true;
            startTicker();

            gsap.to(cards, {
                y: `-=${currentStep}`,
                duration: 1.4,
                ease: "power4.inOut",
                onComplete: () => {
                    stopTicker();
                    animationStateRef.current.isTransitioning = false;

                    updateScales(false, true);
                    wrapCards();

                    gsap.delayedCall(5.0, animateNextStep);
                }
            });
        };

        gsap.delayedCall(1.2, animateNextStep);

        return () => {
            stopTicker();
            gsap.killTweensOf(cards);
        };
    }, [getDimensions, getContainerRect]);

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

        // Create collapse ease once
        const collapseEase = CustomEase.create(
            "collapseEase",
            "M0,0 C0.482,0 0.798,0.419 0.844,0.588 0.911,0.836 0.915,0.935 1,1"
        );

        if (!isMobile) {
            tl.to(marqueeWrapperRef.current, {
                width: dims.marqueeExpandedWidth,
                duration: 0.7,
                ease: "sine.in",
            });
        }

        tl.add("collapseStart");

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
            // Single set of collapse animations (removed duplicates)
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

            tl.to(
                marqueeWrapperRef.current,
                {
                    height: 0,
                    duration: 0.5,
                    ease: collapseEase,
                },
                "collapseStart+=0.5"
            );
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

        // OPTIMIZATION: Remove marquee from DOM after collapse
        tl.call(() => {
            if (marqueeWrapperRef.current) {
                // Kill any running animations on the marquee
                gsap.killTweensOf(marqueeTrackRef.current);
                // Remove from DOM
                marqueeWrapperRef.current.remove();
            }
        });

        // 3. INITIALIZE SLIDER
        const sliderContainer = sliderContainerRef.current;
        const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];

        if (sliderContainer && cards.length > 0) {
            animationStateRef.current.isAnimating = true;

            if (currentMode === 'desktop' || currentMode === 'mobile') {
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

            // SINGLE consolidated resize handler with debounce
            let resizeTimeout: NodeJS.Timeout | null = null;
            let lastWidth = window.innerWidth;

            const handleResize = () => {
                const newWidth = window.innerWidth;

                // Skip if width hasn't changed (e.g., mobile URL bar)
                if (Math.abs(newWidth - lastWidth) < 5) return;
                lastWidth = newWidth;

                // Invalidate cached rect
                animationStateRef.current.cachedContainerRect = null;

                const newMode = getLayoutMode(newWidth);
                const modeChanged = newMode !== animationStateRef.current.currentMode;

                if (resizeTimeout) clearTimeout(resizeTimeout);

                resizeTimeout = setTimeout(() => {
                    if (modeChanged) {
                        // Mode switch - full reinitialization
                        if (animationStateRef.current.cleanup) {
                            animationStateRef.current.cleanup();
                        }
                        gsap.killTweensOf(cards);

                        gsap.to(cards, {
                            opacity: 0,
                            duration: 0.15,
                            ease: "power2.out",
                            onComplete: () => {
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
                    } else {
                        // Same mode - just reposition cards
                        const newDims = getDimensions();
                        const currentModeNow = animationStateRef.current.currentMode;

                        if (currentModeNow === 'desktop' || currentModeNow === 'mobile') {
                            // Horizontal repositioning
                            const newCardWidth = newDims.cardWidth;
                            const newGap = newDims.cardGap;
                            const newStep = newCardWidth + newGap;
                            const newContainerWidth = sliderContainer.offsetWidth;
                            const newFocusPointX = newContainerWidth / 2;
                            const newInitialOffset = newFocusPointX - newCardWidth / 2;

                            animationStateRef.current.animParams = {
                                step: newStep,
                                totalSpan: newStep * cards.length,
                                cardSize: newCardWidth,
                                gap: newGap
                            };

                            // Find closest card to center
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

                            // Reposition
                            const totalCards = cards.length;
                            cards.forEach((card, i) => {
                                let relativePos = i - closestCardIndex;
                                const halfCards = Math.floor(totalCards / 2);
                                if (relativePos > halfCards) relativePos -= totalCards;
                                else if (relativePos < -halfCards) relativePos += totalCards;

                                const xPos = newInitialOffset + relativePos * newStep;
                                gsap.set(card, { x: xPos });
                            });
                        } else if (currentModeNow === 'tablet') {
                            // Vertical repositioning
                            const newCardHeight = newDims.cardHeight;
                            const newCardWidth = newDims.cardWidth;
                            const newGap = newDims.cardGap;
                            const newStep = newCardHeight + newGap;
                            const totalCards = cards.length;
                            const newTotalHeight = totalCards * newStep;
                            const newContainerHeight = sliderContainer.offsetHeight;
                            const newContainerWidth = sliderContainer.offsetWidth;
                            const newFocusPointY = newContainerHeight / 2;
                            const newCenterX = (newContainerWidth - newCardWidth) / 2;

                            animationStateRef.current.animParams = {
                                step: newStep,
                                totalSpan: newTotalHeight,
                                cardSize: newCardHeight,
                                gap: newGap
                            };

                            // Find closest card
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

                            // Reposition
                            const normalizeY = (y: number): number => {
                                let normalized = ((y % newTotalHeight) + newTotalHeight) % newTotalHeight;
                                if (normalized > newContainerHeight + newCardHeight + newGap) {
                                    normalized -= newTotalHeight;
                                }
                                return normalized;
                            };

                            cards.forEach((card, i) => {
                                const offsetFromClosest = (i - closestCardIndex) * newStep;
                                const baseY = newFocusPointY - newCardHeight / 2 + offsetFromClosest;
                                const yPos = normalizeY(baseY);
                                gsap.set(card, { x: newCenterX, y: yPos });
                            });
                        }

                        // Update cached rect
                        animationStateRef.current.cachedContainerRect = sliderContainer.getBoundingClientRect();
                    }
                }, modeChanged ? 50 : 150);
            };

            // Use passive listener for better scroll performance
            window.addEventListener("resize", handleResize, { passive: true });

            return () => {
                animationStateRef.current.isAnimating = false;
                if (resizeTimeout) clearTimeout(resizeTimeout);
                if (animationStateRef.current.cleanup) {
                    animationStateRef.current.cleanup();
                }
                window.removeEventListener("resize", handleResize);
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

                        {/* COLLAPSIBLE MARQUEE - Will be removed from DOM after animation */}
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