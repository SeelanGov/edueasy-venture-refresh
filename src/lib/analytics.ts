declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    plausible?: (...args: any[]) => void;
  }
}

export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  // Google Analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters);
  }
  
  // Plausible
  if (typeof window !== 'undefined' && window.plausible) {
    window.plausible(eventName, { props: parameters });
  }
};

export const trackPageView = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_ID!, {
      page_path: url,
    });
  }
};

export const trackLeadSubmission = (data: {
  source: string;
  utm_campaign?: string;
  utm_source?: string;
  utm_medium?: string;
}) => {
  trackEvent('lead_submitted', {
    event_category: 'engagement',
    event_label: data.source,
    ...data
  });
};

export const trackWhatsAppClick = (utm: Record<string, any>) => {
  trackEvent('whatsapp_click', {
    event_category: 'engagement',
    event_label: 'whatsapp_cta',
    ...utm
  });
};