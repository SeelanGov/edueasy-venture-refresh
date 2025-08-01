import * as React from 'react';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faq = [
  {
    q: 'Who can apply for sponsorship?',
    a: 'Any student using EduEasy who needs financial support with their application fees.',
  },
  {
    q: 'Who can become a sponsor?',
    a: 'Individuals, companies, NGOs, and government organizations can all register as sponsors.',
  },
  {
    q: 'How do I track my application or sponsorship?',
    a: 'Use your personal dashboard after applying or registering to view real-time status updates.',
  },
];

/**
 * FAQCollapsible
 * @description Function
 */
export function FAQCollapsible(): JSX.Element {
  const [openIdx, setOpenIdx] = React.useState<number | null>(null);

  return (
    <div className="max-w-2xl mx-auto space-y-3">
      {faq.map((f, i) => (
        <Collapsible
          key={i}
          open={openIdx === i}
          onOpenChange={() => setOpenIdx(openIdx === i ? null : i)}
        >
          <CollapsibleTrigger className="w-full flex justify-between items-center p-4 bg-cap-teal/10 rounded-md text-cap-teal font-medium cursor-pointer">
            <span>{f.q}</span>
            {openIdx === i ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="p-4 text-gray-700 bg-white border-t">{f.a}</div>
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  );
}
