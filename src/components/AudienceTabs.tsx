"use client";

import { useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { waDeepLink, getDefaultUTMParams } from "@/lib/whatsapp";
import { trackWhatsAppClick } from "@/lib/analytics";
import { MessageCircle, Users, GraduationCap, Heart } from "lucide-react";

interface AudienceTabsProps {
  locale?: string;
}

const content = {
  en: {
    title: "Built for everyone in South African education",
    tabs: [
      {
        id: "students",
        name: "Students", 
        icon: GraduationCap,
        title: "For Grade 11-12 & Gap Year Students",
        description: "Guided applications. Funding matches. Track on WhatsApp.",
        features: [
          "Apply to multiple universities and TVET colleges at once",
          "Get matched with relevant bursaries and learnerships", 
          "Receive step-by-step guidance from Thandi AI",
          "Track your application status in real-time"
        ],
        cta: "Start your journey",
        waMessage: "Hi Thandi, I'm a student looking for help with university applications and funding."
      },
      {
        id: "tvet",
        name: "TVET/SETAs",
        icon: Users, 
        title: "For TVET Colleges & SETA Programs",
        description: "Find learnerships. Apply with low data. USSD option.",
        features: [
          "Access skills development programs and learnerships",
          "Low-data application process via WhatsApp or USSD",
          "Connect directly with employers and training providers",
          "Get support throughout your learning journey"
        ],
        cta: "Explore programs",
        waMessage: "Hi Thandi, I'm interested in TVET programs and learnerships."
      },
      {
        id: "parents", 
        name: "Parents",
        icon: Heart,
        title: "For Parents & Guardians", 
        description: "Trusted guidance. See progress. Data-smart.",
        features: [
          "Monitor your child's application progress securely",
          "Get updates via SMS and WhatsApp",
          "Access funding information and requirements",
          "Receive guidance on supporting your child's journey"
        ],
        cta: "Support your child",
        waMessage: "Hi Thandi, I'm a parent looking for information about my child's education options."
      }
    ]
  },
  zu: {
    title: "Yakhelwe wonke umuntu emfundweni yaseNingizimu Afrika",
    tabs: [
      {
        id: "students",
        name: "Abafundi",
        icon: GraduationCap,
        title: "Kubafundi beGrade 11-12 neBanga Gap", 
        description: "Izicelo eziqondiswayo. Ukufaniswa koxhaso lwezimali. Landelela ku-WhatsApp.",
        features: [
          "Faka izicelo emanyuvesi amaningi nama-TVET colleges ngesikhathi esisodwa",
          "Thola ukufaniswa nama-bursary nama-learnerships afanele",
          "Thola isiqondiso esinyathelo ngesinyathelo kulo Thandi AI", 
          "Landelela isimo secelo lakho ngesikhathi sangempela"
        ],
        cta: "Qala uhambo lwakho",
        waMessage: "Sawubona Thandi, ngingumfundi ofuna usizo ngezicelo zenyuvesi noxhaso lwezimali."
      },
      {
        id: "tvet", 
        name: "TVET/SETAs",
        icon: Users,
        title: "Kuma-TVET Colleges nama-SETA Programs",
        description: "Thola ama-learnerships. Faka isicelo nge-data encane. Inketho ye-USSD.",
        features: [
          "Finyelela ezinhlelweni zokuthuthukisa amakhono nama-learnerships", 
          "Inqubo yesicelo se-data encane nge-WhatsApp noma i-USSD",
          "Xhuma ngqo nabaqashi nabahlinzeki boqeqesho",
          "Thola ukusekela kuyo yonke imigwaqo yokufunda kwakho"
        ],
        cta: "Hlola izinhlelo",
        waMessage: "Sawubona Thandi, nginosizi ezinhlelweni ze-TVET nama-learnerships."
      },
      {
        id: "parents",
        name: "Abazali", 
        icon: Heart,
        title: "Kubazali Nabagadi",
        description: "Isiqondiso esithenjiswayo. Bona inqubekelaphambili. I-data-smart.",
        features: [
          "Gada inqubekelaphambili yesicelo sengane yakho ngokuvikelekile",
          "Thola izibuyekezo nge-SMS ne-WhatsApp", 
          "Finyelela ulwazi loxhaso lwezimali nezidingo",
          "Thola isiqondiso sokusekela uhambo lwengane yakho"
        ],
        cta: "Sekela ingane yakho", 
        waMessage: "Sawubona Thandi, ngingumzali ofuna ulwazi mayelana nezinketho zemfundo yengane yami."
      }
    ]
  },
  xh: {
    title: "Yakhiwe wonke umntu kwimfundo yaseMzantsi Afrika",
    tabs: [
      {
        id: "students",
        name: "Abafundi",
        icon: GraduationCap, 
        title: "Kubafundi beGrade 11-12 nabeBanga Gap",
        description: "Izicelo ezikhokelelwayo. Ukudibanisa kwenkxaso-mali. Landelelela kwi-WhatsApp.",
        features: [
          "Faka izicelo kwiiyunivesithi ezininzi namakholeji e-TVET ngaxeshanye",
          "Fumana ukudibaniswa namabursary neelearnerships ezifanelekileyo",
          "Fumana isikhokelo esinyathelo ngesinyathelo ukusuka ku-Thandi AI",
          "Landelelela imeko yesicelo sakho ngexesha lokwenyani"
        ],
        cta: "Qala uhambo lwakho",
        waMessage: "Molo Thandi, ndingumfundi ofuna uncedo ngezicelo zeyunivesithi nenkxaso-mali."
      },
      {
        id: "tvet",
        name: "TVET/SETAs", 
        icon: Users,
        title: "Kumakholeji e-TVET neenkqubo ze-SETA",
        description: "Fumana iilearnerships. Faka isicelo ngedatha encinci. Ukhetho lwe-USSD.",
        features: [
          "Fikelela kwiinkqubo zophuhliso lwezakhono neelearnerships",
          "Inkqubo yesicelo sedatha encinci nge-WhatsApp okanye i-USSD", 
          "Dibanisa ngokuthe ngqo nabaqeshi nabanikezeli boqeqesho",
          "Fumana inkxaso kuyo yonke indlela yakho yokufunda"
        ],
        cta: "Phonononga iinkqubo",
        waMessage: "Molo Thandi, ndinomdla kwiinkqubo ze-TVET neelearnerships."
      },
      {
        id: "parents",
        name: "Abazali",
        icon: Heart,
        title: "Kubazali Nabagcini",
        description: "Isikhokelo esithembekileyo. Bona inkqubela phambili. I-data-smart.",
        features: [
          "Beka esweni inkqubela phambili yesicelo somntwana wakho ngokukhuselekileyo",
          "Fumana uhlaziyo nge-SMS ne-WhatsApp",
          "Fikelela kulwazi lwenkxaso-mali neemfuno",
          "Fumana isikhokelo sokuxhasa uhambo lomntwana wakho"
        ],
        cta: "Xhasa umntwana wakho",
        waMessage: "Molo Thandi, ndingumzali ofuna ulwazi malunga nezinto zokhetho zemfundo yomntwana wam."
      }
    ]
  }
};

export default function AudienceTabs({ locale = 'en' }: AudienceTabsProps) {
  const [activeTab, setActiveTab] = useState("students");
  const { title, tabs } = content[locale as keyof typeof content] || content.en;
  
  const activeTabContent = tabs.find(tab => tab.id === activeTab) || tabs[0];

  const handleWhatsAppClick = (message: string) => {
    const utm = getDefaultUTMParams('landing', 'audience_tabs');
    const url = waDeepLink(message, utm);
    
    trackWhatsAppClick({ ...utm, audience: activeTab });
    window.open(url, '_blank');
  };

  return (
    <section id="audiences" className="py-24 sm:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
            {title}
          </h2>
        </div>
        
        <div className="mx-auto mt-16 max-w-6xl">
          {/* Tab Navigation */}
          <div className="border-b border-neutral-200">
            <nav className="-mb-px flex justify-center space-x-8" aria-label="Tabs">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium transition-colors focus-visible ${
                      activeTab === tab.id
                        ? 'border-brand-600 text-brand-600'
                        : 'border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-700'
                    }`}
                    aria-current={activeTab === tab.id ? 'page' : undefined}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>
          
          {/* Tab Content */}
          <div className="mt-12">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
              <div>
                <h3 className="text-2xl font-bold text-neutral-900 sm:text-3xl">
                  {activeTabContent.title}
                </h3>
                <p className="mt-4 text-lg text-neutral-600">
                  {activeTabContent.description}
                </p>
                
                <ul className="mt-8 space-y-4">
                  {activeTabContent.features.map((feature, index) => (
                    <li key={index} className="flex gap-3">
                      <div className="flex-shrink-0">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-600">
                          <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 12 12">
                            <path d="m3.707 5.293 2.646 2.647a.5.5 0 0 0 .708 0l5.646-5.647a.5.5 0 0 0-.708-.708L6.5 6.793 4.354 4.646a.5.5 0 1 0-.708.708" />
                          </svg>
                        </div>
                      </div>
                      <span className="text-neutral-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => handleWhatsAppClick(activeTabContent.waMessage)}
                    className="flex items-center justify-center gap-2 rounded-md bg-brand-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-brand-700 transition-colors focus-visible focus:ring-brand-600"
                  >
                    <MessageCircle className="h-5 w-5" aria-hidden="true" />
                    {locale === 'zu' ? 'Xoxa ku-WhatsApp' : locale === 'xh' ? 'Thetha kwi-WhatsApp' : 'Chat on WhatsApp'}
                  </button>
                  
                  <Link
                    href={`${siteConfig.appUrl}/register`}
                    className="flex items-center justify-center rounded-md border border-brand-600 px-6 py-3 text-base font-semibold text-brand-600 hover:bg-brand-50 transition-colors focus-visible focus:ring-brand-600"
                  >
                    {activeTabContent.cta}
                  </Link>
                </div>
              </div>
              
              <div className="relative">
                <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-neutral-100 shadow-soft">
                  <div className="flex h-full items-center justify-center">
                    <activeTabContent.icon className="h-32 w-32 text-brand-600/20" aria-hidden="true" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}