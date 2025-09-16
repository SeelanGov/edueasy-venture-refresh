"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X, Cookie } from "lucide-react";

interface ConsentNoticeProps {
  locale?: string;
}

const content = {
  en: {
    title: "We respect your privacy",
    message: "We use analytics to improve your experience. Your data is processed according to POPIA regulations.",
    accept: "Accept",
    decline: "Decline", 
    learnMore: "Learn more",
    privacyPolicyUrl: "/privacy"
  },
  zu: {
    title: "Sihlonipha ubumfihlo bakho",
    message: "Sisebenzisa izinhlolokhono ukuze sithuthukise ukuzizwisa kwakho. Idatha yakho icutshungulwa ngokwemigomo ye-POPIA.",
    accept: "Yamukela",
    decline: "Yenqaba",
    learnMore: "Funda okuningi", 
    privacyPolicyUrl: "/privacy"
  },
  xh: {
    title: "Siyabuhlonipha ubumfihlo bakho",
    message: "Sisebenzisa uhlalutyo ukuphucula amava akho. Idatha yakho icutshungulwa ngokwemigaqo ye-POPIA.",
    accept: "Yamkela",
    decline: "Yala",
    learnMore: "Funda ngakumbi",
    privacyPolicyUrl: "/privacy"
  }
};

export default function ConsentNotice({ locale = 'en' }: ConsentNoticeProps) {
  const [showBanner, setShowBanner] = useState(false);
  const { title, message, accept, decline, learnMore, privacyPolicyUrl } = content[locale as keyof typeof content] || content.en;

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('analytics-consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('analytics-consent', 'accepted');
    setShowBanner(false);
    
    // Enable analytics
    if (typeof window !== 'undefined') {
      // GA4
      if (process.env.NEXT_PUBLIC_GA_ID && window.gtag) {
        window.gtag('consent', 'update', {
          analytics_storage: 'granted'
        });
      }
      
      // Plausible
      if (process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN && window.plausible) {
        // Plausible doesn't require consent management as it's privacy-first
      }
    }
  };

  const handleDecline = () => {
    localStorage.setItem('analytics-consent', 'declined');
    setShowBanner(false);
    
    // Disable analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'denied'
      });
    }
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-neutral-200 shadow-lg">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-start gap-4">
          <Cookie className="h-6 w-6 text-brand-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
          
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-neutral-900">
              {title}
            </h3>
            <p className="mt-1 text-sm text-neutral-600">
              {message}{" "}
              <Link 
                href={privacyPolicyUrl}
                className="text-brand-600 hover:text-brand-700 underline transition-colors focus-visible"
              >
                {learnMore}
              </Link>
            </p>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleDecline}
              className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors px-3 py-1 rounded focus-visible focus:ring-2 focus:ring-brand-600"
            >
              {decline}
            </button>
            
            <button
              onClick={handleAccept}
              className="bg-brand-600 text-white text-sm font-medium px-4 py-2 rounded hover:bg-brand-700 transition-colors focus-visible focus:ring-2 focus:ring-brand-600 focus:ring-offset-2"
            >
              {accept}
            </button>
            
            <button
              onClick={handleDecline}
              className="text-neutral-400 hover:text-neutral-600 transition-colors p-1 focus-visible focus:ring-2 focus:ring-brand-600 rounded"
              aria-label="Close consent banner"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}