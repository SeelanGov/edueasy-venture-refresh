export const siteConfig = {
  name: "EduEasy — Apply to Uni/TVET & Funding with Thandi",
  description: "Mobile-first guidance for applications, funding matches, and verified profiles. WhatsApp-first, low-data support for Uni, TVET, bursaries & learnerships.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://edueasy.co.za",
  appUrl: "https://app.edueasy.co.za",
  whatsappPhone: process.env.NEXT_PUBLIC_WA_PHONE || "27821234567",
  social: {
    facebook: "https://www.facebook.com/edueasy",
    linkedin: "https://www.linkedin.com/company/edueasy",
    twitter: "https://twitter.com/edueasy",
    instagram: "https://www.instagram.com/edueasy"
  }
} as const;