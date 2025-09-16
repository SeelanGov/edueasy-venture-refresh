import { siteConfig } from "./config";

export const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "EduEasy",
  "url": siteConfig.url,
  "logo": `${siteConfig.url}/logo.png`,
  "sameAs": [
    siteConfig.social.facebook,
    siteConfig.social.linkedin,
    siteConfig.social.twitter,
    siteConfig.social.instagram
  ],
  "description": siteConfig.description,
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": siteConfig.whatsappPhone,
    "contactType": "Customer Service",
    "availableLanguage": ["English", "Zulu", "Xhosa"]
  }
};

export const productJsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "EduEasy Platform with Thandi AI Assistant",
  "description": "Apply to Universities, TVET colleges and funding via web, WhatsApp, or USSD. Get personalized guidance from Thandi AI.",
  "url": siteConfig.url,
  "brand": {
    "@type": "Brand",
    "name": "EduEasy"
  },
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "ZAR",
    "availability": "https://schema.org/InStock",
    "description": "Free tier with sponsored accounts available"
  },
  "applicationCategory": "Education",
  "operatingSystem": "Web, WhatsApp, USSD"
};

export const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Is EduEasy POPIA-compliant?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. We collect the minimum data needed, record your consent, and you can revoke it anytime."
      }
    },
    {
      "@type": "Question", 
      "name": "What if I have low data or basic phone?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Use our WhatsApp or USSD pathways to apply with minimal data usage."
      }
    },
    {
      "@type": "Question",
      "name": "How does document verification work?",
      "acceptedAnswer": {
        "@type": "Answer", 
        "text": "Upload documents via web or WhatsApp. Our system verifies authenticity and extracts key information automatically."
      }
    }
  ]
};