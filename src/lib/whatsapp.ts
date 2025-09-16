import { siteConfig } from "./config";

export interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

export function waDeepLink(
  message: string, 
  utmParams: UTMParams = {},
  phoneE164?: string
): string {
  const phone = phoneE164 || siteConfig.whatsappPhone;
  const base = `https://wa.me/${phone}`;
  
  const params = new URLSearchParams({
    text: message,
    ...utmParams
  });
  
  return `${base}?${params.toString()}`;
}

export function getDefaultWAMessage(locale: string = 'en'): string {
  const messages = {
    en: "Hi Thandi, I need help with university applications and funding options.",
    zu: "Sawubona Thandi, ngidinga usizo ngezicelo zenyuvesi nezinketho zoxhaso lwezimali.",
    xh: "Molo Thandi, ndifuna uncedo ngezicelo zeyunivesithi kunye nezinketho zenkxaso-mali."
  };
  
  return messages[locale as keyof typeof messages] || messages.en;
}

export function getDefaultUTMParams(source: string, medium: string): UTMParams {
  return {
    utm_source: source,
    utm_medium: medium,
    utm_campaign: 'landing'
  };
}