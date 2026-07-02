import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // 页面底色 —— 偏冷的浅灰，比纯白更有层次
        canvas: {
          DEFAULT: "#f2f4f7",
          muted: "#eaecf2",
        },

        // 卡片 / 内容区 —— 纯白
        surface: "#FFFFFF",

        // 分割线
        border: {
          DEFAULT: "#e4e7ed",
          light: "#eff1f5",
          strong: "#d1d5dd",
        },

        // 文字色阶
        ink: {
          900: "#1a1d28",
          800: "#2c303a",
          700: "#454a56",
          600: "#5f6572",
          500: "#7b8190",
          400: "#9ba0ad",
          300: "#bcc1cc",
          200: "#d8dce5",
        },

        // 主强调色：深墨蓝 —— 品牌 / 交互 / 链接
        brand: {
          DEFAULT: "#2a3f73",
          hover: "#1f3058",
          active: "#182544",
          soft: "#eef1f8",
        },

        // 语义色：琥珀 —— 仅用于相似度分数、命中高亮
        signal: {
          DEFAULT: "#b87e2c",
          soft: "#fdf6ed",
        },

        // 语义色：红 —— 错误 / 危险操作
        danger: {
          DEFAULT: "#c2403a",
          soft: "#fdf3f2",
        },

        // 语义色：绿 —— 成功 / grounded 确认
        success: {
          DEFAULT: "#3a7d5a",
          soft: "#f1f8f4",
        },
      },

      fontFamily: {
        display: [
          "var(--font-space-grotesk)",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
        body: [
          "var(--font-inter)",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
        mono: [
          "var(--font-plex-mono)",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "monospace",
        ],
      },

      fontSize: {
        // 精密字号：避免浏览器默认 16px 的整数倍缩放问题
        "2xs": ["11px", { lineHeight: "16px" }],
        xs:   ["12px", { lineHeight: "18px" }],
        sm:   ["13.5px", { lineHeight: "20px" }],
        base: ["15px", { lineHeight: "24px" }],
        lg:   ["17px", { lineHeight: "26px" },
        ],
      },

      borderRadius: {
        sm: "4px",
        DEFAULT: "6px",
        md: "8px",
        lg: "10px",
        xl: "14px",
      },

      boxShadow: {
        // 卡片阴影 —— 极克制，仅提供微弱的抬升感
        card: "0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.03)",
        "card-hover":
          "0 4px 12px -2px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.04)",
        // 弹窗阴影
        pop: "0 12px 32px -8px rgba(0, 0, 0, 0.16), 0 0 0 1px rgba(0, 0, 0, 0.04)",
        // 无阴影
        none: "none",
      },

      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        "in-out-expo": "cubic-bezier(0.87, 0, 0.13, 1)",
      },
    },
  },
  plugins: [],
};
export default config;
