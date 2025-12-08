import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                "black-200": "#081E13",
                "black-100": "#112C2E",
                "off-white": "#FBFAF6",
                "green-500": "#153E2A",
                "green-200": "#00B684", // Active green
                "orange-brand": "#D68F55", // Inferred from Marquee text color in video
            },
            fontFamily: {
                sans: ["var(--font-sohne)", "sans-serif"],
            },
            fontSize: {
                // Heading 01: 112pt ~ 9.3rem if 1rem=16px (matches 149px). 
                // Visual check suggests ~7-8rem is closer to the video relative to screen.
                // Let's go with 7.5rem (120px) which scales with our fluid root.
                "display": ["7.5rem", { lineHeight: "0.9", letterSpacing: "-0.04em" }],
                "xl": ["1.75rem", { lineHeight: "1.4", letterSpacing: "-0.02em" }],
                "lg": ["1.5rem", { lineHeight: "1.4", letterSpacing: "-0.02em" }],
            },
            letterSpacing: {
                tightest: '-0.04em',
            }
        },
    },
    plugins: [],
};
export default config;