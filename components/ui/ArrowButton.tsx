"use client";
import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import "./arrowButton.css";
import { ArrowSvg } from "../../public/component-svg/ArrowSvg";

interface ArrowButtonProps {
    text: string;
    onClick?: () => void;
}

export default function ArrowButton({ text, onClick }: ArrowButtonProps) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const arrowRef = useRef<HTMLDivElement>(null);

    const { contextSafe } = useGSAP({ scope: wrapperRef });

    const onMouseEnter = contextSafe(() => {
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

    const onMouseLeave = contextSafe(() => {
        // Reset both to original positions
        gsap.to([buttonRef.current, arrowRef.current], {
            x: 0,
            duration: 0.4,
            ease: "power2.out"
        });
    });

    return (
        <div
            ref={wrapperRef}
            className="button-wrapper"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onTouchEnd={onMouseLeave}
        >
            <button
                ref={buttonRef}
                onClick={onClick}
                className="button-core"
            >
                <span>{text}</span>
            </button>

            <div ref={arrowRef} >
                <ArrowSvg />
            </div>
        </div>
    );
}