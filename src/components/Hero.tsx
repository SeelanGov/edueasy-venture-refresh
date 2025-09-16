"use client";

import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { waDeepLink, getDefaultWAMessage, getDefaultUTMParams } from "@/lib/whatsapp";
import { trackWhatsAppClick } from "@/lib/analytics";
import { MessageCircle, ArrowRight } from "lucide-react";

interface HeroProps {
  locale?: string;
}

const content = {
  en: {
    title: "Apply once. Get guidance and funding with Thandi.",
    subtitle: "WhatsApp-first, low-data support for Uni, TVET, bursaries & learnerships.",
    primaryCTA: "Chat on WhatsApp", 
    secondaryCTA: "Check eligibility",
    stats: [
      { value: "50K+", label: "Students helped" },
      { value: "200+", label: "Universities & TVET" },
      { value: "R2B+", label: "Funding matched" }
    ]
  },
  zu: {
    title: "Faka isicelo kanye. Thola isiqondiso noxhaso lwezimali noThandi.",
    subtitle: "Usekelo lwe-WhatsApp kuqala, idatha encane yenyuvesi, i-TVET, amabursary namaLearnerships.",
    primaryCTA: "Xoxa ku-WhatsApp",
    secondaryCTA: "Hlola ukufaneleka", 
    stats: [
      { value: "50K+", label: "Abafundi abasizakele" },
      { value: "200+", label: "Amanyuvesi ne-TVET" },
      { value: "R2B+", label: "Uxhaso lwezimali olufanisiwe" }
    ]
  },
  xh: {
    title: "Faka isicelo kanye. Fumana isikhokelo nenkxaso-mali kunye noThandi.",
    subtitle: "I-WhatsApp kuqala, inkxaso yedatha encinci yeyunivesithi, i-TVET, iibursary kunye neelearnerships.",
    primaryCTA: "Thetha kwi-WhatsApp",
    secondaryCTA: "Jonga ukufaneleka",
    stats: [
      { value: "50K+", label: "Abafundi abancediweyo" },
      { value: "200+", label: "Iiyunivesithi ne-TVET" }, 
      { value: "R2B+", label: "Inkxaso-mali edibanisiweyo" }
    ]
  }
};

export default function Hero({ locale = 'en' }: HeroProps) {
  const { title, subtitle, primaryCTA, secondaryCTA, stats } = content[locale as keyof typeof content] || content.en;
  
  const handleWhatsAppClick = () => {
    const message = getDefaultWAMessage(locale);
    const utm = getDefaultUTMParams('landing', 'hero');
    const url = waDeepLink(message, utm);
    
    trackWhatsAppClick(utm);
    window.open(url, '_blank');
  };

  return (
    <section className="relative isolate px-6 pt-14 lg:px-8 min-h-screen flex items-center">
      {/* Background decoration */}
      <div
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-brand-600 to-accent-600 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>

      <div className="mx-auto max-w-4xl text-center py-32 sm:py-48 lg:py-56">
        <h1 className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-6xl lg:text-7xl">
          {title}
        </h1>
        
        <p className="mt-6 text-lg leading-8 text-neutral-600 sm:text-xl max-w-2xl mx-auto">
          {subtitle}
        </p>
        
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6">
          <button
            onClick={handleWhatsAppClick}
            className="flex items-center gap-2 rounded-md bg-brand-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-brand-700 transition-colors focus-visible focus:ring-brand-600 w-full sm:w-auto"
          >
            <MessageCircle className="h-5 w-5" aria-hidden="true" />
            {primaryCTA}
          </button>
          
          <Link
            href={`${siteConfig.appUrl}/register`}
            className="flex items-center gap-2 rounded-md border border-brand-600 px-6 py-3 text-base font-semibold text-brand-600 hover:bg-brand-50 transition-colors focus-visible focus:ring-brand-600 w-full sm:w-auto"
          >
            {secondaryCTA}
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </Link>
        </div>
        
        {/* Stats */}
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-neutral-200">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <dt className="text-3xl font-bold text-brand-600 sm:text-4xl">{stat.value}</dt>
              <dd className="mt-1 text-base leading-6 text-neutral-600">{stat.label}</dd>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom gradient */}
      <div
        className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-accent-600 to-brand-600 opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="flex flex-col items-center gap-2 animate-bounce">
          <div className="text-sm text-neutral-600">{locale === 'zu' ? 'Skrola phansi' : locale === 'xh' ? 'Skrolela phantsi' : 'Scroll down'}</div>
          <div className="w-6 h-10 border-2 border-neutral-300 rounded-full flex justify-center">
            <div className="w-1 h-2 bg-neutral-300 rounded-full mt-2"></div>
          </div>
        </div>
      </div>
    </section>
  );
}