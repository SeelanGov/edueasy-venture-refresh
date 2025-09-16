import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { Facebook, Linkedin, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";

interface FooterProps {
  locale?: string;
}

const content = {
  en: {
    company: {
      title: "Company",
      links: [
        { name: "About Us", href: "/about" },
        { name: "How it Works", href: "#steps" },
        { name: "Contact", href: "/contact" },
        { name: "Careers", href: "/careers" }
      ]
    },
    students: {
      title: "For Students", 
      links: [
        { name: "Universities", href: `${siteConfig.appUrl}/universities` },
        { name: "TVET Colleges", href: `${siteConfig.appUrl}/tvet` },
        { name: "Bursaries", href: `${siteConfig.appUrl}/funding` },
        { name: "Learnerships", href: `${siteConfig.appUrl}/learnerships` }
      ]
    },
    resources: {
      title: "Resources",
      links: [
        { name: "Help Center", href: "/help" },
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Service", href: "/terms" },
        { name: "POPIA Compliance", href: "/popia" }
      ]
    },
    contact: {
      title: "Get in touch",
      email: "hello@edueasy.co.za",
      phone: siteConfig.whatsappPhone,
      address: "Cape Town, South Africa"
    },
    copyright: "© 2024 EduEasy. All rights reserved.",
    tagline: "Empowering South African students to achieve their educational dreams."
  },
  zu: {
    company: {
      title: "Inkampani",
      links: [
        { name: "Mayelana Nathi", href: "/about" },
        { name: "Kusebenza Kanjani", href: "#steps" },
        { name: "Xhumana Nathi", href: "/contact" },
        { name: "Amathuba Omsebenzi", href: "/careers" }
      ]
    },
    students: {
      title: "Kubafundi",
      links: [
        { name: "Amanyuvesi", href: `${siteConfig.appUrl}/universities` },
        { name: "Amakholeji e-TVET", href: `${siteConfig.appUrl}/tvet` },
        { name: "Ama-Bursary", href: `${siteConfig.appUrl}/funding` },
        { name: "Ama-Learnerships", href: `${siteConfig.appUrl}/learnerships` }
      ]
    },
    resources: {
      title: "Izinsiza",
      links: [
        { name: "Isikhungo Sosizo", href: "/help" },
        { name: "Inqubomgomo Yobumfihlo", href: "/privacy" },
        { name: "Imigomo Yenkonzo", href: "/terms" },
        { name: "Ukuthobela kwe-POPIA", href: "/popia" }
      ]
    },
    contact: {
      title: "Xhumana nathi",
      email: "hello@edueasy.co.za", 
      phone: siteConfig.whatsappPhone,
      address: "iKapa, iNingizimu Afrika"
    },
    copyright: "© 2024 EduEasy. Wonke amalungelo agodliwe.",
    tagline: "Sinika amandla abafundi baseNingizimu Afrika ukuthi bafeze amaphupho abo emfundweni."
  },
  xh: {
    company: {
      title: "Inkampani",
      links: [
        { name: "Malunga Nathi", href: "/about" },
        { name: "Indlela Esebenza Ngayo", href: "#steps" },
        { name: "Qhagamshelana Nathi", href: "/contact" },
        { name: "Amathuba Omsebenzi", href: "/careers" }
      ]
    },
    students: {
      title: "Kubafundi",
      links: [
        { name: "Iiyunivesithi", href: `${siteConfig.appUrl}/universities` },
        { name: "Amakholeji e-TVET", href: `${siteConfig.appUrl}/tvet` },
        { name: "Amabursary", href: `${siteConfig.appUrl}/funding` },
        { name: "Iilearnerships", href: `${siteConfig.appUrl}/learnerships` }
      ]
    },
    resources: {
      title: "Izixhobo",
      links: [
        { name: "Iziko Loncedo", href: "/help" },
        { name: "Umgaqo-nkqubo Wabucala", href: "/privacy" },
        { name: "Imigaqo Yenkonzo", href: "/terms" },
        { name: "Ukuthobela i-POPIA", href: "/popia" }
      ]
    },
    contact: {
      title: "Qhagamshelana nathi",
      email: "hello@edueasy.co.za",
      phone: siteConfig.whatsappPhone,
      address: "iKapa, uMzantsi Afrika"
    },
    copyright: "© 2024 EduEasy. Onke amalungelo agcinwe.",
    tagline: "Sinika amandla abafundi baseMzantsi Afrika ukuba bafezekise amaphupha abo emfundweni."
  }
};

const scrollToSection = (href: string) => {
  if (href.startsWith('#')) {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
};

export default function Footer({ locale = 'en' }: FooterProps) {
  const { company, students, resources, contact, copyright, tagline } = content[locale as keyof typeof content] || content.en;

  return (
    <footer className="bg-neutral-900 text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href={locale === 'en' ? '/' : `/${locale}`} className="text-2xl font-bold text-white">
              EduEasy
            </Link>
            <p className="mt-4 text-neutral-300 leading-relaxed">
              {tagline}
            </p>
            
            {/* Social Links */}
            <div className="mt-6 flex gap-4">
              <a
                href={siteConfig.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-white transition-colors focus-visible focus:ring-2 focus:ring-brand-600 rounded p-1"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" aria-hidden="true" />
              </a>
              <a
                href={siteConfig.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-white transition-colors focus-visible focus:ring-2 focus:ring-brand-600 rounded p-1"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" aria-hidden="true" />
              </a>
              <a
                href={siteConfig.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-white transition-colors focus-visible focus:ring-2 focus:ring-brand-600 rounded p-1"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" aria-hidden="true" />
              </a>
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-white transition-colors focus-visible focus:ring-2 focus:ring-brand-600 rounded p-1"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" aria-hidden="true" />
              </a>
            </div>
          </div>
          
          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">
              {company.title}
            </h3>
            <ul className="space-y-3">
              {company.links.map((link) => (
                <li key={link.name}>
                  {link.href.startsWith('#') ? (
                    <button
                      onClick={() => scrollToSection(link.href)}
                      className="text-neutral-300 hover:text-white transition-colors text-left focus-visible focus:ring-2 focus:ring-brand-600 rounded"
                    >
                      {link.name}
                    </button>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-neutral-300 hover:text-white transition-colors focus-visible focus:ring-2 focus:ring-brand-600 rounded"
                    >
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
          
          {/* Student Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">
              {students.title}
            </h3>
            <ul className="space-y-3">
              {students.links.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-neutral-300 hover:text-white transition-colors focus-visible focus:ring-2 focus:ring-brand-600 rounded"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Resources & Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">
              {resources.title}
            </h3>
            <ul className="space-y-3 mb-8">
              {resources.links.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-neutral-300 hover:text-white transition-colors focus-visible focus:ring-2 focus:ring-brand-600 rounded"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            
            <h3 className="text-sm font-semibold text-white mb-4">
              {contact.title}
            </h3>
            <div className="space-y-3">
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-2 text-neutral-300 hover:text-white transition-colors focus-visible focus:ring-2 focus:ring-brand-600 rounded"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                {contact.email}
              </a>
              <a
                href={`https://wa.me/${contact.phone}`}
                target="_blank"
                rel="noopener noreferrer" 
                className="flex items-center gap-2 text-neutral-300 hover:text-white transition-colors focus-visible focus:ring-2 focus:ring-brand-600 rounded"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                {contact.phone}
              </a>
              <div className="flex items-center gap-2 text-neutral-300">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                {contact.address}
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-neutral-800 text-center text-sm text-neutral-400">
          <p>{copyright}</p>
        </div>
      </div>
    </footer>
  );
}