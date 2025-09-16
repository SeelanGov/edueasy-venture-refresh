import { 
  FileText, 
  Target, 
  Bot, 
  Shield, 
  Smartphone, 
  Activity 
} from "lucide-react";

interface FeatureGridProps {
  locale?: string;
}

const content = {
  en: {
    title: "Everything you need to succeed",
    subtitle: "Comprehensive tools and guidance for your education journey",
    features: [
      {
        icon: FileText,
        title: "Unified Application",
        description: "Apply to multiple universities and TVET colleges with a single form. Save time and reduce paperwork."
      },
      {
        icon: Target,
        title: "Funding Match", 
        description: "Get matched with relevant NSFAS funding, bursaries, and learnerships based on your profile."
      },
      {
        icon: Bot,
        title: "Thandi AI Guidance",
        description: "Receive personalized advice and support from our AI assistant throughout your journey."
      },
      {
        icon: Shield,
        title: "Document Verification",
        description: "Secure, automated verification of your certificates and ID documents using advanced AI."
      },
      {
        icon: Smartphone,
        title: "Multi-channel Access",
        description: "Access via web, WhatsApp, or USSD. Works on any device with minimal data usage."
      },
      {
        icon: Activity,
        title: "Real-time Tracking", 
        description: "Monitor your application status and receive instant updates via your preferred channel."
      }
    ]
  },
  zu: {
    title: "Konke okudingayo ukuze uphumelele",
    subtitle: "Amathuluzi aphelele nesiqondiso sohambo lwakho lwezemfundo",
    features: [
      {
        icon: FileText,
        title: "Isicelo Esihlanganisiwe",
        description: "Faka isicelo emanyuvesi amaningi nama-TVET colleges ngefomu elilodwa. Khongolose isikhathi futhi unciphise amaphepha."
      },
      {
        icon: Target,
        title: "Ukufaniswa Koxhaso Lwezimali",
        description: "Thola ukufaniswa noxhaso lwe-NSFAS olufanele, ama-bursary nama-learnerships ngokususela kuphrofayela yakho."
      },
      {
        icon: Bot,
        title: "Isiqondiso se-Thandi AI",
        description: "Thola iseluleko somuntu siqu noxhaso ku-AI assistant yethu kuyo yonke imigwaqo yakho."
      },
      {
        icon: Shield,
        title: "Ukuqinisekiswa Kwamadokhumenti", 
        description: "Ukuqinisekiswa okuphephile, okuzenzakalelayo kwezitifiketi zakho namadokhumenti e-ID kusetshenziswa i-AI eythuthukile."
      },
      {
        icon: Smartphone,
        title: "Ukufinyelela Kweziteshi Eziningi",
        description: "Finyelela ngewebhu, i-WhatsApp, noma i-USSD. Isebenza kunoma imuphi umshini nge-data encane."
      },
      {
        icon: Activity,
        title: "Ukulandelela Kwesikhathi Sangempela",
        description: "Gada isimo secelo lakho futhi uthole izibuyekezo ngokushesha ngendlela oyithandayo."
      }
    ]
  },
  xh: {
    title: "Yonke into oyifunayo ukuze uphumelele", 
    subtitle: "Izixhobo ezipheleleyo nesikhokelo sohambo lwakho lwezemfundo",
    features: [
      {
        icon: FileText,
        title: "Isicelo Esimanyeneyo",
        description: "Faka isicelo kwiiyunivesithi ezininzi namakholeji e-TVET ngefomu enye. Gxila ixesha futhi unciphise amaxwebhu."
      },
      {
        icon: Target,
        title: "Ukudibanisa Inkxaso-mali",
        description: "Fumana ukudibaniswa nenkxaso ye-NSFAS efanelekileyo, amabursary neelearnerships ngokweprofayile yakho."
      },
      {
        icon: Bot,
        title: "Isikhokelo se-Thandi AI",
        description: "Fumana ingcebiso eyodwa nenkxaso kwi-AI assistant yethu kulo lonke uhambo lwakho."
      },
      {
        icon: Shield,
        title: "Ukuqinisekiswa Kwamaxwebhu",
        description: "Ukuqinisekiswa okukhuselekileyo, okuzenzekelayo kweziqinisekiso zakho namaxwebhu e-ID kusetyenziswa i-AI ephucukileyo."
      },
      {
        icon: Smartphone,
        title: "Ukufikelela Kweendlela Ezininzi", 
        description: "Fikelela ngewebhu, i-WhatsApp, okanye i-USSD. Isebenza kulo naliphi na isixhobo ngedatha encinci."
      },
      {
        icon: Activity,
        title: "Ukulandelela Ngexesha Lokwenyani",
        description: "Beka esweni imeko yesicelo sakho uze ufumane uhlaziyo olukhawulezayo ngendlela oyithandayo."
      }
    ]
  }
};

export default function FeatureGrid({ locale = 'en' }: FeatureGridProps) {
  const { title, subtitle, features } = content[locale as keyof typeof content] || content.en;

  return (
    <section id="features" className="py-24 sm:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 text-lg leading-8 text-neutral-600">
            {subtitle}
          </p>
        </div>
        
        <div className="mx-auto mt-16 max-w-6xl">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="relative group">
                  <div className="bg-white rounded-2xl shadow-soft p-8 h-full hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-brand-600/10 mb-6 group-hover:bg-brand-600/20 transition-colors">
                      <Icon className="h-6 w-6 text-brand-600" aria-hidden="true" />
                    </div>
                    
                    <h3 className="text-xl font-semibold text-neutral-900 mb-4">
                      {feature.title}
                    </h3>
                    
                    <p className="text-neutral-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}