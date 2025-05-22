import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

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
        border: {
          DEFAULT: "hsl(220, 16%, 22%)", // subtle border
          focus: "hsl(210, 90%, 60%)", // blue border for focus
        },
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: {
          DEFAULT: "hsl(220, 18%, 12%)", // very dark blue-gray for main bg
          subtle: "hsl(220, 16%, 18%)", // slightly lighter for cards
          emphasis: "hsl(220, 20%, 22%)", // for navs/footers
        },
        foreground: {
          DEFAULT: "hsl(220, 20%, 98%)", // near white for text
          muted: "hsl(220, 14%, 70%)", // muted text
        },
        primary: {
          DEFAULT: "hsl(173, 58%, 39%)", // Updated to match Relive's teal 
          foreground: "hsl(220, 20%, 98%)",
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
          soft: "hsl(var(--accent-soft))",
          muted: "hsl(var(--accent-muted))",
          subtle: "hsl(var(--accent-subtle))",
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
          dark: "hsl(220, 18%, 16%)", // deep blue-gray for trust
          teal: "hsl(173, 58%, 39%)", // Updated to match Relive's teal
          coral: "hsl(var(--cap-coral-hue), var(--cap-coral-saturation), var(--cap-coral-lightness))",
          light: "hsl(var(--cap-light-hue), var(--cap-light-saturation), var(--cap-light-lightness))",
        },
        success: {
          DEFAULT: "var(--color-success)",
          foreground: "hsl(var(--success-hue), var(--success-saturation), 98%)",
          light: "hsl(var(--success-hue), calc(var(--success-saturation) - 30%), calc(var(--success-lightness) + 25%))",
          muted: "hsl(var(--success-hue), calc(var(--success-saturation) - 20%), calc(var(--success-lightness) + 10%))",
        },
        warning: {
          DEFAULT: "var(--color-warning)",
          foreground: "hsl(var(--warning-hue), var(--warning-saturation), 98%)",
          light: "hsl(var(--warning-hue), calc(var(--warning-saturation) - 30%), calc(var(--warning-lightness) + 25%))",
          muted: "hsl(var(--warning-hue), calc(var(--warning-saturation) - 20%), calc(var(--warning-lightness) + 10%))",
        },
        error: {
          DEFAULT: "var(--color-error)",
          foreground: "hsl(var(--error-hue), var(--error-saturation), 98%)",
          light: "hsl(var(--error-hue), calc(var(--error-saturation) - 30%), calc(var(--error-lightness) + 25%))",
          muted: "hsl(var(--error-hue), calc(var(--error-saturation) - 20%), calc(var(--error-lightness) + 10%))",
        },
        info: {
          DEFAULT: "var(--color-info)",
          foreground: "hsl(var(--info-hue), var(--info-saturation), 98%)",
          light: "hsl(var(--info-hue), calc(var(--info-saturation) - 30%), calc(var(--info-lightness) + 25%))",
          muted: "hsl(var(--info-hue), calc(var(--info-saturation) - 20%), calc(var(--info-lightness) + 10%))",
        },
        // Add admin button color for modern trust theme
        admin: {
          DEFAULT: "hsl(220, 90%, 56%)", // strong blue for admin actions
          hover: "hsl(220, 90%, 46%)", // darker on hover
          active: "hsl(220, 90%, 36%)", // even darker on active
          foreground: "hsl(220, 20%, 98%)", // white text
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
      },
      fontFamily: {
        sans: ["'Inter'", "Roboto", "sans-serif"],
        heading: ["'Poppins'", "sans-serif"],
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        DEFAULT: "var(--shadow-md)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        "hover": "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        "soft": "0 2px 10px rgba(0, 0, 0, 0.08)",
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
        "pulse-gentle": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "scale-out": {
          "0%": { transform: "scale(1)", opacity: "1" },
          "100%": { transform: "scale(0.95)", opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-gentle": "pulse-gentle 2s ease-in-out infinite",
        "scale-in": "scale-in 0.15s ease-out",
        "scale-out": "scale-out 0.15s ease-out",
      },
      borderRadius: {
        DEFAULT: "var(--radius)",
        "lg": "0.75rem",
        "xl": "1rem",
        "2xl": "1.5rem",
      },
      spacing: {
        'tablet': '2rem', // Tablet-specific spacing
        'tablet-lg': '2.5rem',
        '18': '4.5rem',
        '68': '17rem',
        '84': '21rem',
        '96': '24rem',
      },
      maxWidth: {
        'tablet': '640px',
        'tablet-lg': '768px',
        '8xl': '88rem',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      }
    },
  },
  plugins: [
    tailwindcssAnimate,
    function({ addUtilities, theme }) {
      // Add custom utilities for color opacity variants
      const colorOpacityUtilities: Record<string, Record<string, string>> = {};
      const colors = theme('colors');
      // Process info color specifically for borders
      if (colors.info) {
        const opacities = [10, 20, 30, 40, 50, 60, 70, 80, 90];
        opacities.forEach(opacity => {
          colorOpacityUtilities[`.border-info\\/${opacity}`] = {
            'border-color': `rgba(var(--color-info-rgb), ${opacity/100})`,
          };
        });
      }
      // Add border-success opacity utilities
      const successOpacities = [10, 20, 30, 40, 50, 60, 70, 80, 90];
      successOpacities.forEach(opacity => {
        colorOpacityUtilities[`.border-success\\/${opacity}`] = {
          'border-color': `hsl(var(--success-hue), var(--success-saturation), var(--success-lightness), ${opacity/100})`,
        };
      });
      // Add border-warning opacity utilities
      const warningOpacities = [10, 20, 30, 40, 50, 60, 70, 80, 90];
      warningOpacities.forEach(opacity => {
        colorOpacityUtilities[`.border-warning\\/${opacity}`] = {
          'border-color': `hsl(var(--warning-hue), var(--warning-saturation), var(--warning-lightness), ${opacity/100})`,
        };
      });
      addUtilities(colorOpacityUtilities, ['responsive']);
    }
  ],
} satisfies Config;
