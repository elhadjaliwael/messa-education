import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  plugins: [],
  theme:{
    extend:{
      colors : {
        bgPrimary : "var(--color-bg-primary)",
        bgSecondary : "var(--color-bg-secondary)",
        textPrimary : "var(--color-copy-primary)",
        textSecondary : "var(--color-copy-secondary)",
        textHeadLine : "var(--color-copy-headline)",
        btnTextPrimary : "var(--color-btn-text-primary)",
        btnBg : "var(--color-btn-bg-primary)"
      }
    }
  }
};
export default config;