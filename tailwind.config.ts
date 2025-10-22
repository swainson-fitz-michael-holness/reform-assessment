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
        // Neutrals
        "black-200": "#081E13",
        "black-100": "#112C2E",
        "off-white": "#FBFAF6",
        
        // Greens
        "green-500": "#153E2A",
        "green-400": "#30715D",
        "green-300": "#6E9E8F",
        "green-200": "#00B684", // The bright active green
        "green-100": "#CCDDC7",
      },
      fontFamily: {
        // We will define this name in layout.tsx next
        sans: ["var(--font-sohne)", "sans-serif"],
      },
      // Mapping Figma Text Sizes
      fontSize: {
        // "Heading 01" - 112pt (approx 150px)
        "display": ["7rem", { lineHeight: "1.2", letterSpacing: "-0.03em" }], 
        // "Body XL"
        "xl": ["1.75rem", { lineHeight: "1.4", letterSpacing: "-0.03em" }], // 28px
        // "Body L"
        "lg": ["1.5rem", { lineHeight: "1.4", letterSpacing: "-0.03em" }],  // 24px
        // "Body Reg"
        "base": ["1.25rem", { lineHeight: "1.4", letterSpacing: "-0.03em" }], // 20px
        // "Body S"
        "sm": ["1rem", { lineHeight: "1.4", letterSpacing: "-0.03em" }],     // 16px
        "xs": ["0.875rem", { lineHeight: "1.4", letterSpacing: "-0.03em" }], // 14px
      },
      screens: {
        'xs': '375px',
        'tablet': '1024px',
        'desktop': '1440px',
      },
    },
  },
  plugins: [],
};
export default config;