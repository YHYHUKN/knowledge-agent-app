import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // 中性底色 —— 冷灰而非常见的暖米色，克制、企业感
        canvas: "#F6F7F9",
        surface: "#FFFFFF",
        border: {
          DEFAULT: "#E3E6EB",
          strong: "#C7CCD6",
        },
        ink: {
          900: "#111827",
          700: "#374151",
          500: "#6B7280",
          300: "#9CA3AF",
        },
        // 单一主强调色：深墨蓝，用于交互与品牌
        brand: {
          DEFAULT: "#2A3F73",
          hover: "#1F2F58",
          soft: "#EEF1F8",
        },
        // 唯一次强调色：琥珀，专用于相似度分数 / 检索命中高亮 —— 语义化用色，不做装饰
        signal: {
          DEFAULT: "#B8862C",
          soft: "#FBF3E3",
        },
        danger: "#B3423A",
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "ui-sans-serif", "system-ui"],
        body: ["var(--font-inter)", "ui-sans-serif", "system-ui"],
        mono: ["var(--font-plex-mono)", "ui-monospace", "SFMono-Regular"],
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "6px",
        md: "8px",
        lg: "10px",
      },
      boxShadow: {
        card: "0 1px 2px 0 rgba(17, 24, 39, 0.04), 0 1px 1px 0 rgba(17, 24, 39, 0.03)",
        pop: "0 8px 24px -6px rgba(17, 24, 39, 0.16)",
      },
    },
  },
  plugins: [],
};
export default config;
