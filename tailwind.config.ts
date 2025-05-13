
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    screens: {
      'sm': '640px',
      'md': '768px',
      'tablet': '768px', // Explicit tablet breakpoint
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          50: "hsl(var(--cap-teal-hue), var(--cap-teal-saturation), 90%)",
          100: "hsl(var(--cap-teal-hue), var(--cap-teal-saturation), 85%)",
          200: "hsl(var(--cap-teal-hue), var(--cap-teal-saturation), 75%)",
          300: "hsl(var(--cap-teal-hue), var(--cap-teal-saturation), 65%)",
          400: "hsl(var(--cap-teal-hue), var(--cap-teal-saturation), 55%)",
          500: "hsl(var(--cap-teal-hue), var(--cap-teal-saturation), 45%)",
          600: "hsl(var(--cap-teal-hue), var(--cap-teal-saturation), 35%)",
          700: "hsl(var(--cap-teal-hue), var(--cap-teal-saturation), 25%)",
          800: "hsl(var(--cap-teal-hue), var(--cap-teal-saturation), 15%)",
          900: "hsl(var(--cap-teal-hue), var(--cap-teal-saturation), 10%)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          50: "hsl(var(--cap-coral-hue), var(--cap-coral-saturation), 90%)",
          100: "hsl(var(--cap-coral-hue), var(--cap-coral-saturation), 85%)",
          200: "hsl(var(--cap-coral-hue), var(--cap-coral-saturation), 75%)",
          300: "hsl(var(--cap-coral-hue), var(--cap-coral-saturation), 65%)",
          400: "hsl(var(--cap-coral-hue), var(--cap-coral-saturation), 55%)",
          500: "hsl(var(--cap-coral-hue), var(--cap-coral-saturation), 45%)",
          600: "hsl(var(--cap-coral-hue), var(--cap-coral-saturation), 35%)",
          700: "hsl(var(--cap-coral-hue), var(--cap-coral-saturation), 25%)",
          800: "hsl(var(--cap-coral-hue), var(--cap-coral-saturation), 15%)",
          900: "hsl(var(--cap-coral-hue), var(--cap-coral-saturation), 10%)",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        cap: {
          dark: "hsl(var(--cap-dark-hue), var(--cap-dark-saturation), var(--cap-dark-lightness))",
          teal: "hsl(var(--cap-teal-hue), var(--cap-teal-saturation), var(--cap-teal-lightness))",
          coral: "hsl(var(--cap-coral-hue), var(--cap-coral-saturation), var(--cap-coral-lightness))",
          light: "hsl(var(--cap-light-hue), var(--cap-light-saturation), var(--cap-light-lightness))",
        },
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        error: "var(--color-error)",
        info: "var(--color-info)",
        // Add opacity variants for status colors
        info: {
          DEFAULT: "var(--color-info)",
          foreground: "hsl(var(--info-hue), var(--info-saturation), 98%)"
        },
        // Text color variants
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
          "on-primary": "var(--text-on-primary)",
          "on-secondary": "var(--text-on-secondary)",
        },
        // Background color variants
        bg: {
          subtle: "var(--bg-subtle)",
          muted: "var(--bg-muted)",
          emphasis: "var(--bg-emphasis)",
        },
        // Border color variants
        border: {
          DEFAULT: "hsl(var(--border))",
          subtle: "var(--border-subtle)",
          focus: "var(--border-focus)",
        },
      },
      fontFamily: {
        sans: ["Roboto", "Open Sans", "sans-serif"],
        heading: ["Roboto", "sans-serif"],
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        DEFAULT: "var(--shadow-md)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      borderRadius: {
        DEFAULT: "var(--radius)",
      },
      spacing: {
        'tablet': '2rem', // Tablet-specific spacing
        'tablet-lg': '2.5rem',
      },
      maxWidth: {
        'tablet': '640px',
        'tablet-lg': '768px',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
