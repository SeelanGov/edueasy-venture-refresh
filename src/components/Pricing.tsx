import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { Check, Star } from "lucide-react";

interface PricingProps {
  locale?: string;
}

const content = {
  en: {
    title: "Simple, transparent pricing",
    subtitle: "Choose the plan that's right for your education journey",
    plans: [
      {
        name: "Free",
        price: "R0",
        period: "/month",
        description: "Perfect for getting started",
        badge: "Sponsored accounts available",
        features: [
          "Basic profile creation",
          "Access to Thandi AI guidance", 
          "Apply to 3 institutions",
          "WhatsApp support",
          "Basic document verification",
          "Application tracking"
        ],
        cta: "Get started free",
        popular: false
      },
      {
        name: "Basic", 
        price: "R49",
        period: "/month",
        description: "For serious applicants",
        features: [
          "Everything in Free",
          "Apply to unlimited institutions",
          "Priority Thandi AI support",
          "Advanced document verification", 
          "USSD access",
          "SMS notifications",
          "Funding match algorithms",
          "Application deadline reminders"
        ],
        cta: "Choose Basic",
        popular: true
      },
      {
        name: "Premium",
        price: "R99", 
        period: "/month",
        description: "Complete guidance package",
        features: [
          "Everything in Basic",
          "1-on-1 consultant calls",
          "Premium funding opportunities",
          "Career guidance assessment",
          "Priority application processing",
          "Custom application letters",
          "Interview preparation",
          "Scholarship application support"
        ],
        cta: "Choose Premium",
        popular: false
      }
    ]
  },
  zu: {
    title: "Amanani alula, acacile",
    subtitle: "Khetha uhlelo olufanele uhambo lwakho lwezemfundo",
    plans: [
      {
        name: "Mahhala",
        price: "R0", 
        period: "/inyanga",
        description: "Okuhle kakhulu ukuqalisa",
        badge: "Ama-akhawunti axhasiwe ayatholakala",
        features: [
          "Ukudala iphrofayela eyisisekelo",
          "Ukufinyelela isiqondiso se-Thandi AI",
          "Faka isicelo ezikhungweni ezi-3",
          "Ukusekela kwe-WhatsApp", 
          "Ukuqinisekiswa kwamadokhumenti okuyisisekelo",
          "Ukulandelela izicelo"
        ],
        cta: "Qala mahhala",
        popular: false
      },
      {
        name: "Isisekelo",
        price: "R49",
        period: "/inyanga", 
        description: "Kubafaki zicelo abanengqondo",
        features: [
          "Konke okuseMahhala",
          "Faka isicelo ezikhungweni ezingapheli",
          "Ukusekela kwe-Thandi AI okubalulekile",
          "Ukuqinisekiswa kwamadokhumenti okuthuthukisiwe",
          "Ukufinyelela i-USSD",
          "Izaziso ze-SMS", 
          "Ama-algorithms okufanisa uxhaso lwezimali",
          "Izikhumbuzi zemikhawulo yezicelo"
        ],
        cta: "Khetha Isisekelo",
        popular: true
      },
      {
        name: "I-Premium",
        price: "R99",
        period: "/inyanga",
        description: "Iphakheji yesiqondiso esiphelele", 
        features: [
          "Konke okuseSisekelweni",
          "Izingcingo zomcebisi zi-1-ku-1",
          "Amathuba oxhaso lwezimali a-premium",
          "Ukuhlolwa kwesiqondiso somsebenzi",
          "Ukucutshungulwa kwezicelo okubalulekile",
          "Izincwadi zezicelo eziqondene nawe",
          "Ukulungiselela inhlolokhono",
          "Ukusekela isicelo se-scholarship"
        ],
        cta: "Khetha i-Premium",
        popular: false
      }
    ]
  },
  xh: {
    title: "Amaxabiso alula, acacileyo",
    subtitle: "Khetha isicwangciso esifanele uhambo lwakho lwezemfundo",
    plans: [
      {
        name: "Simahla",
        price: "R0",
        period: "/inyanga", 
        description: "Igqibelele ukuqalisa",
        badge: "Iiakhawunti ezixhasiweyo ziyafumaneka",
        features: [
          "Ukwenza iprofayile esisiseko",
          "Ukufikelela kusikhokelo se-Thandi AI",
          "Faka isicelo kumaziko ama-3",
          "Inkxaso ye-WhatsApp",
          "Ukuqinisekiswa kwamaxwebhu okusisiseko", 
          "Ukulandelela izicelo"
        ],
        cta: "Qalisa simahla",
        popular: false
      },
      {
        name: "Isiseko",
        price: "R49",
        period: "/inyanga",
        description: "Kubafaki-zicelo abazimiseleyo",
        features: [
          "Yonke into eSimahla",
          "Faka isicelo kumaziko angapheliyo",
          "Inkxaso ye-Thandi AI eyongameleyo", 
          "Ukuqinisekiswa kwamaxwebhu okuphucukileyo",
          "Ukufikelela i-USSD",
          "Izaziso ze-SMS",
          "Ii-algorithms zokudibanisa inkxaso-mali",
          "Izikhumbuzi zomhla wokugqibela wesicelo"
        ],
        cta: "Khetha iSiseko",
        popular: true
      },
      {
        name: "I-Premium", 
        price: "R99",
        period: "/inyanga",
        description: "Iphakheji yesikhokelo esipheleleyo",
        features: [
          "Yonke into eSisekweni",
          "Iifowuni zomcebisi ze-1-ku-1",
          "Amathuba enkxaso-mali e-premium",
          "Uvavanyo lwesikhokelo somsebenzi",
          "Ukucutshungulwa kwezicelo okubalulekileyo",
          "Iileta zezicelo eziqhelekileyo",
          "Ukulungiselela udliwano-ndlebe",
          "Inkxaso yesicelo se-scholarship"
        ],
        cta: "Khetha i-Premium", 
        popular: false
      }
    ]
  }
};

export default function Pricing({ locale = 'en' }: PricingProps) {
  const { title, subtitle, plans } = content[locale as keyof typeof content] || content.en;

  return (
    <section id="pricing" className="py-24 sm:py-32 bg-neutral-100">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 text-lg leading-8 text-neutral-600">
            {subtitle}
          </p>
        </div>
        
        <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl bg-white shadow-soft p-8 ${
                plan.popular 
                  ? 'ring-2 ring-brand-600 scale-105' 
                  : 'hover:shadow-lg transition-shadow'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-1 rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white">
                    <Star className="h-4 w-4" aria-hidden="true" />
                    {locale === 'zu' ? 'Okuthandwa kakhulu' : locale === 'xh' ? 'Okuthandwa kakhulu' : 'Most Popular'}
                  </div>
                </div>
              )}
              
              {plan.badge && (
                <div className="mb-4">
                  <span className="inline-flex items-center rounded-full bg-accent-600/10 px-3 py-1 text-xs font-medium text-accent-600">
                    {plan.badge}
                  </span>
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-neutral-900">{plan.name}</h3>
                <p className="mt-2 text-sm text-neutral-600">{plan.description}</p>
                
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-bold text-neutral-900">{plan.price}</span>
                  <span className="ml-1 text-sm text-neutral-600">{plan.period}</span>
                </div>
              </div>
              
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex gap-3">
                    <Check className="h-5 w-5 text-brand-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <span className="text-sm text-neutral-700">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Link
                href={`${siteConfig.appUrl}/register`}
                className={`block w-full rounded-md py-3 px-6 text-center text-sm font-semibold transition-colors focus-visible focus:ring-2 focus:ring-offset-2 ${
                  plan.popular
                    ? 'bg-brand-600 text-white hover:bg-brand-700 focus:ring-brand-600'
                    : 'bg-white border border-brand-600 text-brand-600 hover:bg-brand-50 focus:ring-brand-600'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-sm text-neutral-500">
            {locale === 'zu' 
              ? 'Zonke izinhlelo zihlanganisa ukufinyelela i-WhatsApp ne-USSD. Ayikho imali yokufihla.'
              : locale === 'xh'
              ? 'Zonke izicwangciso zibandakanya ukufikelela i-WhatsApp ne-USSD. Akukho mali ezifihliweyo.'
              : 'All plans include WhatsApp and USSD access. No hidden fees.'
            }
          </p>
        </div>
      </div>
    </section>
  );
}