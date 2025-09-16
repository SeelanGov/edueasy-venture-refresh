"use client";

import Link from "next/link";
import { useState } from "react";
import { siteConfig } from "@/lib/config";
import { Menu, X, Globe } from "lucide-react";

interface HeaderProps {
  locale?: string;
}

const navigation = {
  en: [
    { name: "Features", href: "#features" },
    { name: "How it Works", href: "#steps" },
    { name: "Pricing", href: "#pricing" },
    { name: "FAQ", href: "#faq" }
  ],
  zu: [
    { name: "Izici", href: "#features" },
    { name: "Kusebenza Kanjani", href: "#steps" },
    { name: "Amanani", href: "#pricing" },
    { name: "Imibuzo", href: "#faq" }
  ],
  xh: [
    { name: "Iimpawu", href: "#features" },
    { name: "Indlela Esebenza Ngayo", href: "#steps" },
    { name: "Amaxabiso", href: "#pricing" },
    { name: "Imibuzo", href: "#faq" }
  ]
};

const locales = [
  { code: 'en', name: 'English', href: '/' },
  { code: 'zu', name: 'isiZulu', href: '/zu' },
  { code: 'xh', name: 'isiXhosa', href: '/xh' }
];

export default function Header({ locale = 'en' }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLocaleMenuOpen, setIsLocaleMenuOpen] = useState(false);
  
  const currentNavigation = navigation[locale as keyof typeof navigation] || navigation.en;

  const scrollToSection = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setIsMobileMenuOpen(false);
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8" aria-label="Global navigation">
        <div className="flex lg:flex-1">
          <Link href={locale === 'en' ? '/' : `/${locale}`} className="-m-1.5 p-1.5 focus-visible">
            <span className="sr-only">EduEasy</span>
            <div className="text-2xl font-bold text-brand-600">EduEasy</div>
          </Link>
        </div>
        
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-neutral-600 focus-visible"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
          >
            <span className="sr-only">{isMobileMenuOpen ? 'Close menu' : 'Open menu'}</span>
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
        
        <div className="hidden lg:flex lg:gap-x-12">
          {currentNavigation.map((item) => (
            <button
              key={item.name}
              onClick={() => scrollToSection(item.href)}
              className="text-sm font-semibold leading-6 text-neutral-900 hover:text-brand-600 transition-colors focus-visible"
            >
              {item.name}
            </button>
          ))}
        </div>
        
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:gap-x-6">
          <div className="relative">
            <button
              onClick={() => setIsLocaleMenuOpen(!isLocaleMenuOpen)}
              className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-neutral-900 hover:text-brand-600 transition-colors focus-visible"
              aria-expanded={isLocaleMenuOpen}
            >
              <Globe className="h-4 w-4" aria-hidden="true" />
              {locales.find(l => l.code === locale)?.name || 'English'}
            </button>
            
            {isLocaleMenuOpen && (
              <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                {locales.map((localeItem) => (
                  <Link
                    key={localeItem.code}
                    href={localeItem.href}
                    className="block px-4 py-2 text-sm text-neutral-900 hover:bg-neutral-100 transition-colors"
                    onClick={() => setIsLocaleMenuOpen(false)}
                  >
                    {localeItem.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
          
          <Link
            href={`${siteConfig.appUrl}/login`}
            className="text-sm font-semibold leading-6 text-neutral-900 hover:text-brand-600 transition-colors focus-visible"
          >
            {locale === 'zu' ? 'Ngena' : locale === 'xh' ? 'Ngena' : 'Log in'}
          </Link>
          
          <Link
            href={`${siteConfig.appUrl}/register`}
            className="rounded-md bg-brand-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 transition-colors focus-visible focus:ring-brand-600"
          >
            {locale === 'zu' ? 'Bhalisa' : locale === 'xh' ? 'Bhalisa' : 'Sign up'}
          </Link>
        </div>
      </nav>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden">
          <div className="fixed inset-0 z-10" />
          <div className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-background px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-border">
            <div className="flex items-center justify-between">
              <Link href={locale === 'en' ? '/' : `/${locale}`} className="-m-1.5 p-1.5 focus-visible">
                <span className="sr-only">EduEasy</span>
                <div className="text-xl font-bold text-brand-600">EduEasy</div>
              </Link>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-neutral-600 focus-visible"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-border">
                <div className="space-y-2 py-6">
                  {currentNavigation.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => scrollToSection(item.href)}
                      className="block w-full text-left rounded-lg px-3 py-2 text-base font-semibold leading-7 text-neutral-900 hover:bg-neutral-100 transition-colors focus-visible"
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
                
                <div className="py-6 space-y-2">
                  <div className="text-sm font-semibold text-neutral-600 px-3 mb-2">
                    {locale === 'zu' ? 'Ulimi' : locale === 'xh' ? 'Ulwimi' : 'Language'}
                  </div>
                  {locales.map((localeItem) => (
                    <Link
                      key={localeItem.code}
                      href={localeItem.href}
                      className="block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-neutral-900 hover:bg-neutral-100 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {localeItem.name}
                    </Link>
                  ))}
                </div>
                
                <div className="py-6 space-y-2">
                  <Link
                    href={`${siteConfig.appUrl}/login`}
                    className="block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-neutral-900 hover:bg-neutral-100 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {locale === 'zu' ? 'Ngena' : locale === 'xh' ? 'Ngena' : 'Log in'}
                  </Link>
                  <Link
                    href={`${siteConfig.appUrl}/register`}
                    className="block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-white bg-brand-600 hover:bg-brand-700 transition-colors text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {locale === 'zu' ? 'Bhalisa' : locale === 'xh' ? 'Bhalisa' : 'Sign up'}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}