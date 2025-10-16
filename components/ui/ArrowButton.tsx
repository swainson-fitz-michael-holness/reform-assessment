"use client";
import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import "./arrowButton.css";
// Adjust this import path based on your file structure
import { ArrowSvg } from "../../public/component-svg/ArrowSvg";

interface ArrowButtonProps {
    text: string;
    onClick?: () => void;
}

export default function ArrowButton({ text, onClick }: ArrowButtonProps) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const arrowRef = useRef<HTMLDivElement>(null);

    // This ref targets the <g> inside the SVG
    const arrowInnerRef = useRef<SVGGElement>(null);

    // Track if wipe animation is currently playing
    const isWipingRef = useRef(false);

    const { contextSafe } = useGSAP({ scope: wrapperRef });

    // --- SWAP ANIMATION (Button <-> Arrow) ---
    const onWrapperEnter = contextSafe(() => {
        if (!buttonRef.current || !arrowRef.current) return;

        const buttonWidth = buttonRef.current.offsetWidth;
        const arrowWidth = arrowRef.current.offsetWidth;
        const gap = 4; // matches CSS gap

        // Arrow moves left (behind the button)
        gsap.to(arrowRef.current, {
            x: -(buttonWidth + gap),
            duration: 0.4,
            ease: "power2.out"
        });

        // Button moves right (to where arrow was)
        gsap.to(buttonRef.current, {
            x: arrowWidth + gap,
            duration: 0.4,
            ease: "power2.out"
        });
    });

    const onWrapperLeave = contextSafe(() => {
        // Reset positions
        gsap.to([buttonRef.current, arrowRef.current], {
            x: 0,
            duration: 0.4,
            ease: "power2.out"
        });
    });

    // --- WIPE ANIMATION (Arrow disappear/reappear) ---
    const onArrowEnter = contextSafe((e: React.MouseEvent) => {
        if (!arrowInnerRef.current || isWipingRef.current || !arrowRef.current) return;

        // 1. Direction Detection
        const rect = arrowRef.current.getBoundingClientRect();
        const centerPoint = rect.left + (rect.width / 2);

        // If mouse entered from the right side, do nothing
        if (e.clientX > centerPoint) {
            return;
        }

        isWipingRef.current = true;

        // 2. Timeline with Delay
        const tl = gsap.timeline({
            delay: 0.6, // 600ms delay before start
            onComplete: () => {
                isWipingRef.current = false;
            }
        });

        // Wipe out: clip from right to left (arrow disappears)
        tl.to(arrowInnerRef.current, {
            clipPath: "inset(0 0 0 100%)",
            duration: 0.2,
            ease: "power2.in"
        });

        // Wipe in: clip from left to right (arrow reappears)
        tl.to(arrowInnerRef.current, {
            clipPath: "inset(0 0 0 0)",
            duration: 0.2,
            ease: "power2.out"
        });
    });

    return (
        <div
            ref={wrapperRef}
            className="button-wrapper"
            onMouseEnter={onWrapperEnter}
            onMouseLeave={onWrapperLeave}
            onTouchEnd={onWrapperLeave}
        >
            <button
                ref={buttonRef}
                onClick={onClick}
                className="button-core"
            >
                <span>{text}</span>
            </button>

            <div
                ref={arrowRef}
                className="arrow-container"
                onMouseEnter={onArrowEnter}
            >
                {/* We pass the ref to target the inner <g> */}
                <ArrowSvg ref={arrowInnerRef} />
            </div>
        </div>
    );
}