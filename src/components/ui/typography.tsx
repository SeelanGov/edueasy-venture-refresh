
import React from "react";
import { cn } from "@/lib/utils";

// Define types for our component
export type TypographyVariant = 
  | "h1" 
  | "h2" 
  | "h3" 
  | "h4" 
  | "h5" 
  | "display" 
  | "body-lg" 
  | "body" 
  | "body-sm" 
  | "small" 
  | "caption";

export type TypographyColor = 
  | "default" 
  | "muted" 
  | "primary" 
  | "secondary" 
  | "success" 
  | "warning" 
  | "error" 
  | "info"
  | "white";

export type TypographyWeight = 
  | "normal"
  | "medium"
  | "semibold"
  | "bold";

type ElementType = 
  | "h1" 
  | "h2" 
  | "h3" 
  | "h4" 
  | "h5" 
  | "p" 
  | "span" 
  | "div";

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: TypographyVariant;
  color?: TypographyColor;
  weight?: TypographyWeight;
  as?: ElementType;
  className?: string;
  children: React.ReactNode;
  animate?: boolean;
}

/**
 * Typography component for consistent text styling
 * 
 * @param variant - The typography variant (h1, h2, h3, h4, h5, display, body-lg, body, body-sm, small, caption)
 * @param color - Text color
 * @param weight - Font weight
 * @param as - HTML element to render
 * @param animate - Whether to animate the text
 * @param className - Additional CSS classes
 */
export const Typography = ({
  variant = "body",
  color = "default",
  weight,
  as,
  animate = false,
  className,
  children,
  ...props
}: TypographyProps) => {
  // Map variants to semantic HTML elements if 'as' prop is not provided
  const getDefaultElement = (): ElementType => {
    if (as) return as;
    
    switch (variant) {
      case "h1":
        return "h1";
      case "h2":
        return "h2";
      case "h3":
        return "h3";
      case "h4":
        return "h4";
      case "h5":
        return "h5";
      case "display":
        return "h1";
      case "body-lg":
      case "body":
      case "body-sm":
        return "p";
      case "small":
      case "caption":
        return "span";
      default:
        return "p";
    }
  };
  
  // Map variants to Tailwind classes for consistent styling
  const variantStyles = {
    display: "text-5xl md:text-6xl lg:text-7xl font-bold font-heading tracking-tighter",
    h1: "text-4xl md:text-5xl lg:text-6xl font-bold font-heading tracking-tight",
    h2: "text-3xl md:text-4xl font-bold font-heading tracking-tight",
    h3: "text-2xl md:text-3xl font-semibold font-heading",
    h4: "text-xl md:text-2xl font-semibold font-heading",
    h5: "text-lg md:text-xl font-semibold font-heading",
    "body-lg": "text-lg leading-relaxed",
    "body": "text-base leading-relaxed",
    "body-sm": "text-sm leading-relaxed",
    "small": "text-sm",
    "caption": "text-xs",
  };
  
  // Map color options to Tailwind classes
  const colorStyles = {
    default: "text-foreground",
    muted: "text-muted-foreground",
    primary: "text-primary",
    secondary: "text-secondary",
    success: "text-success",
    warning: "text-warning",
    error: "text-error",
    info: "text-info",
    white: "text-white",
  };

  // Map weight options to Tailwind classes
  const weightStyles = {
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
  };

  const animationStyle = animate ? "animate-fade-in" : "";
  
  const Element = getDefaultElement();
  
  return React.createElement(
    Element,
    {
      className: cn(
        variantStyles[variant],
        colorStyles[color],
        weight && weightStyles[weight],
        animationStyle,
        className
      ),
      ...props
    },
    children
  );
};
