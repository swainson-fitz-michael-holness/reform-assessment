import React, { forwardRef } from "react";

export const ArrowSvg = forwardRef<SVGGElement, React.SVGProps<SVGSVGElement>>((props, ref) => (
    <svg
        width="51"
        height="51"
        viewBox="0 0 51 51"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        {/* Background */}
        <rect x="0.375" y="0.375" width="50" height="50" rx="25" fill="#FBFAF6" />

        {/* Circle Border */}
        <path
            d="M10.7977 5.0625C14.9013 2.11237 19.9353 0.375 25.375 0.375C39.1821 0.375 50.375 11.5679 50.375 25.375C50.375 39.1821 39.1821 50.375 25.375 50.375C11.5679 50.375 0.375 39.1821 0.375 25.375C0.375 23.2169 0.648456 21.1226 1.16261 19.125"
            stroke="#30715D" strokeWidth="0.75" strokeLinecap="round"
        />

        {/* Animated Arrow Group */}
        {/* Ref attached here for independent clipping */}
        <g ref={ref}>
            <path
                d="M25.6236 31.625L31.8736 25.375M31.8736 25.375L25.6236 19.125M31.8736 25.375H19.375"
                stroke="#30715D"
                strokeWidth="0.75"
                strokeLinecap="round"
            />
        </g>
    </svg>
));

ArrowSvg.displayName = "ArrowSvg";