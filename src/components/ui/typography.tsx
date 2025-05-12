
import React from "react";
import { cn } from "@/lib/utils";

// Define types for our component
export type TypographyVariant = 
  | "h1" 
  | "h2" 
  | "h3" 
  | "h4" 
  | "h5" 
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
  as?: ElementType;
  className?: string;
  children: React.ReactNode;
}

/**
 * Typography component for consistent text styling
 * 
 * @param variant - The typography variant (h1, h2, h3, h4, h5, body-lg, body, body-sm, small, caption)
 * @param color - Text color
 * @param as - HTML element to render
 * @param className - Additional CSS classes
 */
export const Typography = ({
  variant = "body",
  color = "default",
  as,
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
  
  const Element = getDefaultElement();
  
  return React.createElement(
    Element,
    {
      className: cn(
        variantStyles[variant],
        colorStyles[color],
        className
      ),
      ...props
    },
    children
  );
};
