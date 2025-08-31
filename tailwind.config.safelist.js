// Safelist for dynamic classes to prevent Tailwind purging
module.exports = {
  safelist: [
    // Badge variants - ensure they're not purged
    {
      pattern: /(bg|text|border)-(success|warning|destructive|info|muted)(\/(10|20))?/,
    },
    // Common status colors
    {
      pattern: /(bg|text|border)-(primary|secondary|accent)(\/(10|20|30|40|50|60|70|80|90))?/,
    },
    // Focus ring classes  
    {
      pattern: /ring-(primary|success|warning|destructive|info)/,
    },
    // Animation classes for accessibility
    {
      pattern: /animate-(fade-in|scale-in|shake)/,
    },
    // Hover effects
    {
      pattern: /hover:(scale-105|shadow-lg|-translate-y-1)/,
    }
  ],
};