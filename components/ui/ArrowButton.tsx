"use client";
import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowRight } from "lucide-react";
import "./arrowButton.css";

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
        <>
            <button
                ref={containerRef}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onClick={onClick}
                className="button-core"
            >
                <span>{text}</span>
            </button>
        </>

    );
}