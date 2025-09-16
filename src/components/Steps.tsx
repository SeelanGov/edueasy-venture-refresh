import { User, Shield, Search, BarChart3 } from "lucide-react";

interface StepsProps {
  locale?: string;
}

const content = {
  en: {
    title: "How it works",
    subtitle: "Get started in 4 simple steps",
    steps: [
      {
        icon: User,
        title: "Create Profile", 
        description: "Sign up with your basic details. Verify your South African ID for enhanced features."
      },
      {
        icon: Shield,
        title: "Verify Documents",
        description: "Upload your matric certificate and ID document. Our AI verifies authenticity instantly."
      },
      {
        icon: Search, 
        title: "Match & Apply",
        description: "Get matched with suitable programs and funding. Apply to multiple institutions at once."
      },
      {
        icon: BarChart3,
        title: "Track Status",
        description: "Monitor your applications in real-time via web, WhatsApp, or SMS updates."
      }
    ]
  },
  zu: {
    title: "Kusebenza kanjani",
    subtitle: "Qala ngezinyathelo ezi-4 ezilula",
    steps: [
      {
        icon: User,
        title: "Dala Iphrofayela",
        description: "Bhalisa ngemininingwane yakho eyisisekelo. Qinisekisa i-ID yakho yaseNingizimu Afrika ukuze uthole izici ezithuthukisiwe."
      },
      {
        icon: Shield,
        title: "Qinisekisa Amadokhumenti", 
        description: "Layisha isitifiketi sakho se-matric nedokhumenti le-ID. I-AI yethu iqinisekisa ubuqotho ngokushesha."
      },
      {
        icon: Search,
        title: "Fanisa futhi Ufake Isicelo",
        description: "Thola ukufaniswa nezinhlelo ezifanele noxhaso lwezimali. Faka izicelo ezikhungweni eziningi ngesikhathi esisodwa."
      },
      {
        icon: BarChart3, 
        title: "Landelela Isimo",
        description: "Gada izicelo zakho ngesikhathi sangempela ngewebhu, i-WhatsApp, noma izibuyekezo ze-SMS."
      }
    ]
  },
  xh: {
    title: "Indlela esebenza ngayo",
    subtitle: "Qala ngamanyathelo a-4 alula",
    steps: [
      {
        icon: User,
        title: "Yenza Iprofayile",
        description: "Bhalisa ngeenkcukacha zakho ezisisiseko. Qinisekisa i-ID yakho yaseMzantsi Afrika ukuze ufumane iimpawu eziphucukileyo."
      },
      {
        icon: Shield,
        title: "Qinisekisa Amaxwebhu",
        description: "Layisha isatifikethi sakho se-matric nexwebu le-ID. I-AI yethu iqinisekisa ubunyaniso ngoko nangoko."
      },
      {
        icon: Search,
        title: "Dibanisa uze uFake isicelo", 
        description: "Fumana ukudibaniswa neenkqubo ezifanelekileyo nenkxaso-mali. Faka izicelo kumaziko amaninzi ngaxeshanye."
      },
      {
        icon: BarChart3,
        title: "Landelelela Imeko",
        description: "Beka esweni izicelo zakho ngexesha lokwenyani ngewebhu, i-WhatsApp, okanye uhlaziyo lwe-SMS."
      }
    ]
  }
};

export default function Steps({ locale = 'en' }: StepsProps) {
  const { title, subtitle, steps } = content[locale as keyof typeof content] || content.en;

  return (
    <section id="steps" className="py-24 sm:py-32 bg-neutral-100">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 text-lg leading-8 text-neutral-600">
            {subtitle}
          </p>
        </div>
        
        <div className="mx-auto mt-16 max-w-5xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative">
                  <div className="bg-white rounded-2xl shadow-soft p-8 h-full hover:shadow-lg transition-shadow">
                    {/* Step number */}
                    <div className="absolute -top-4 left-8">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-sm font-semibold text-white">
                        {index + 1}
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <Icon className="h-8 w-8 text-brand-600" aria-hidden="true" />
                      <h3 className="mt-4 text-xl font-semibold text-neutral-900">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-neutral-600">
                        {step.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Connection line */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-12 -right-4 w-8 h-0.5 bg-brand-600/20" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}