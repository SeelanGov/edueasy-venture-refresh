"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQProps {
  locale?: string;
}

const content = {
  en: {
    title: "Frequently asked questions",
    subtitle: "Get answers to common questions about EduEasy",
    faqs: [
      {
        question: "Is EduEasy POPIA-compliant?",
        answer: "Yes. We collect the minimum data needed, record your consent, and you can revoke it anytime. Your personal information is encrypted and stored securely."
      },
      {
        question: "What if I have low data or a basic phone?",
        answer: "Use our WhatsApp or USSD pathways to apply with minimal data usage. Our platform is designed to work on any device, even basic phones."
      },
      {
        question: "How does document verification work?",
        answer: "Upload documents via web or WhatsApp. Our AI system verifies authenticity and extracts key information automatically, usually within minutes."
      },
      {
        question: "Can I use EduEasy for USSD applications?",
        answer: "Yes! Dial our USSD code to access core features without internet. Perfect for areas with poor connectivity or when you need to save data."
      },
      {
        question: "How do WhatsApp uploads work?",
        answer: "Simply send your documents to our WhatsApp number. Thandi will guide you through the process and confirm when your documents are verified."
      },
      {
        question: "How can I revoke my consent?",
        answer: "You can withdraw consent anytime by messaging us on WhatsApp, emailing support, or using the privacy controls in your profile settings."
      }
    ]
  },
  zu: {
    title: "Imibuzo evame ukubuzwa",
    subtitle: "Thola izimpendulo emibuzo evamile nge-EduEasy",
    faqs: [
      {
        question: "Ingabe i-EduEasy ihambisana ne-POPIA?",
        answer: "Yebo. Siqoqa iminininingwane encane esiyidingayo, sirekhoda imvume yakho, futhi ungayisusa noma nini. Ulwazi lwakho lomuntu siqu lufihlelwe futhi lugcinwe ngokuphephile."
      },
      {
        question: "Kwenzenjani uma nginedatha encane noma ifoni eyisisekelo?", 
        answer: "Sebenzisa izindlela zethu ze-WhatsApp noma i-USSD ukufaka isicelo nge-data encane. Inkundla yethu yakhelwe ukusebenza kunoma imuphi umshini, ngisho namafoni ayisisekelo."
      },
      {
        question: "Kusebenza kanjani ukuqinisekiswa kwamadokhumenti?",
        answer: "Layisha amadokhumenti ngewebhu noma i-WhatsApp. Isistimu yethu ye-AI iqinisekisa ubuqotho futhi ikhuphule ulwazi olubalulekile ngokuzenzakalelayo, ngokuvamile emaminithini."
      },
      {
        question: "Ngingasebenzisa i-EduEasy ezicelong ze-USSD?",
        answer: "Yebo! Dayela ikhodi yethu ye-USSD ukuze ufinyelele izici ezibalulekile ngaphandle kwe-intanethi. Kuhle ezindaweni ezinoxhumo olubi noma lapho udinga ukonga idatha."
      },
      {
        question: "Kusebenza kanjani ukulayishwa kwe-WhatsApp?",
        answer: "Vele uthumele amadokhumenti akho enanini lethu le-WhatsApp. U-Thandi uzokuhola ohambweni futhi aqinisekise lapho amadokhumenti akho eqinisekisiwe."
      },
      {
        question: "Ngingayisusa kanjani imvume yami?",
        answer: "Ungazisusa imvume noma nini ngokusithumelela umlayezo ku-WhatsApp, nge-imeyili yesekelo, noma usebenzise izilawuli zobumfihlo ezisetthingini zephrofayela yakho."
      }
    ]
  },
  xh: {
    title: "Imibuzo ebuzwa rhoqo",
    subtitle: "Fumana iimpendulo kwimibuzo eqhelekileyo nge-EduEasy", 
    faqs: [
      {
        question: "Ingaba i-EduEasy iyahambelana ne-POPIA?",
        answer: "Ewe. Siqokelela idatha encinci esiyifunayo, sirekhodisha imvume yakho, kwaye ungayibuyisela nanini na. Ulwazi lwakho lobuqu luchotywe kwaye lugcinwe ngokukhuselekileyo."
      },
      {
        question: "Kuthekani ukuba ndinedatha encinci okanye ifowuni esisiseko?",
        answer: "Sebenzisa iindlela zethu ze-WhatsApp okanye i-USSD ukufaka isicelo ngedatha encinci. Iqonga lethu lenzelwe ukusebenza nakulo naliphi na isixhobo, kwakunye neefowuni ezisisiseko."
      },
      {
        question: "Kusebenza njani ukuqinisekiswa kwamaxwebhu?",
        answer: "Layisha amaxwebhu ngewebhu okanye i-WhatsApp. Inkqubo yethu ye-AI iqinisekisa ubunyaniso ize ikhuphele ulwazi olubalulekileyo ngokuzenzekelayo, ngokuqhelekileyo kwiimizuzu."
      },
      {
        question: "Ndingayisebenzisa i-EduEasy kwizicelo ze-USSD?",
        answer: "Ewe! Fayila ikhowudi yethu ye-USSD ukuze ufikelele kwiimpawu eziphambili ngaphandle kwe-intanethi. Igqibelele kwiindawo ezinonxibelelwano olubi okanye xa kufuneka ugcine idatha."
      },
      {
        question: "Kusebenza njani ukulayishwa kwe-WhatsApp?",
        answer: "Nje uthumele amaxwebhu akho kwinombolo yethu ye-WhatsApp. U-Thandi uza ukukhokelela kwinkqubo aze aqinisekise xa amaxwebhu akho eqinisekisiwe."
      },
      {
        question: "Ndingayibuyisela njani imvume yam?",
        answer: "Ungayibuyisela imvume nanini na ngokusithumelela umyalezo ku-WhatsApp, nge-imeyili yenkxaso, okanye usebenzise ulawulo lwabucala kwizicwangciso zeprofayile yakho."
      }
    ]
  }
};

export default function FAQ({ locale = 'en' }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { title, subtitle, faqs } = content[locale as keyof typeof content] || content.en;

  return (
    <section id="faq" className="py-24 sm:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 text-lg leading-8 text-neutral-600">
            {subtitle}
          </p>
        </div>
        
        <div className="mx-auto mt-16 max-w-4xl">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-soft overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-neutral-50 transition-colors focus-visible focus:ring-2 focus:ring-brand-600 focus:ring-inset"
                  aria-expanded={openIndex === index}
                >
                  <h3 className="text-lg font-semibold text-neutral-900 pr-6">
                    {faq.question}
                  </h3>
                  <ChevronDown 
                    className={`h-5 w-5 text-neutral-500 transition-transform ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>
                
                {openIndex === index && (
                  <div className="px-6 pb-6">
                    <p className="text-neutral-700 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="mx-auto mt-12 max-w-2xl text-center">
          <p className="text-neutral-600">
            {locale === 'zu' 
              ? 'Awuzitholi impendulo oyifunayo? '
              : locale === 'xh'
              ? 'Awufumani impendulo oyifunayo? '
              : "Can't find what you're looking for? "
            }
            <a 
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WA_PHONE}?text=${encodeURIComponent(
                locale === 'zu' 
                  ? 'Sawubona, nginemibuzo mayelana ne-EduEasy'
                  : locale === 'xh'
                  ? 'Molo, ndinemibuzo malunga ne-EduEasy'
                  : 'Hi, I have questions about EduEasy'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-600 hover:text-brand-700 font-semibold transition-colors focus-visible"
            >
              {locale === 'zu' ? 'Sixhumane ne-WhatsApp' : locale === 'xh' ? 'Qhagamshelana nge-WhatsApp' : 'Contact us on WhatsApp'}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}