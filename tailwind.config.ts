import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // 品牌色系 —— #165DFF
        primary: {
          DEFAULT: "#165DFF",
          hover: "#4080FF",
          bg: "#E8F3FF",
          50: "#E8F3FF",
          100: "#D6E8FF",
          200: "#ADC8FF",
          300: "#85A8FF",
          400: "#5C89FF",
          500: "#165DFF",
          600: "#0E42D2",
          700: "#072CA6",
          800: "#031A79",
          900: "#010D4D",
        },

        // 页面底色
        canvas: {
          DEFAULT: "#F7F8FA",
          muted: "#F0F2F5",
        },

        // 卡片 / 内容表面
        surface: "#FFFFFF",

        // 分割线
        border: {
          DEFAULT: "#E5E6EB",
          light: "#F0F1F5",
          strong: "#C9CDD4",
        },

        // 文字色阶
        ink: {
          900: "#1D2129",
          800: "#2C303A",
          700: "#4E5969",
          600: "#6B7685",
          500: "#86909C",
          400: "#9BA0AD",
          300: "#BCC1CC",
        },

        // 语义色
        success: { DEFAULT: "#00B42A", soft: "#E8FFEA" },
        warning: { DEFAULT: "#FF7D00", soft: "#FFF7E8" },
        danger: { DEFAULT: "#F53F3F", soft: "#FFECEC" },

        // 模块标签色
        module: {
          observe: "#D6E8FF",
          permission: "#E9E5FF",
          trace: "#D9F7E9",
        },
      },

      fontFamily: {
        body: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Microsoft YaHei"',
          "sans-serif",
        ],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },

      borderRadius: {
        sm: "6px",
        DEFAULT: "12px",
        lg: "16px",
      },

      boxShadow: {
        card: "0 1px 4px rgba(0,0,0,0.06)",
        "card-hover": "0 3px 12px rgba(22, 93, 255, 0.12)",
        pop: "0 8px 24px rgba(0,0,0,0.12)",
      },

      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
      },

      fontSize: {
        "2xs": ["11px", { lineHeight: "16px" }],
        xs: ["12px", { lineHeight: "18px" }],
      },
    },
  },
  plugins: [],
};
export default config;
