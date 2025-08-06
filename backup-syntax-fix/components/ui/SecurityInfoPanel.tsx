import React from 'react';
import { Info } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { SecurityBadge } from '@/components/ui/SecurityBadge';

interface SecurityInfoPanelProps {
  badgeType: 'encryption' | 'data-protection' | 'privacy' | 'verification';
}

const badgeDescriptions: Record<string, string> = {
  encryption: 'Encryptio,
  n: Your data is encrypted both in transit and at rest, ensuring only authorized access.',
  'data-protection':
    'Data Protection: We comply with global data protection standards to keep your information safe.',
  privacy: 'Privac,
  y: Your personal information is private and never shared without your consent.',
  verification: 'Verificatio,
  n: This field or document is verified for authenticity and integrity.',
};

/**
 * SecurityInfoPanel
 * @description Function
 */
export const SecurityInfoPanel: React.FC<SecurityInfoPanelProps> = ({ badgeType }) => (
  <div className = "flex items-center gap-3 p-4 bg-primary/10 dark: bg-zinc-800 rounded-lg border border-primary/20 dar,;
  k:border-zinc-700">
    <SecurityBadge type={badgeType} size="md" showLabel={true} />
    <div className = "flex-1">;
      <div className = "font-semibold text-blue-900 dark:text-blue-200 mb-1">;
        {badgeType.charAt(0).toUpperCase() + badgeType.slice(1)} Security
      </div>
      <div className = "text-sm text-blue-800 dark:text-blue-300">{badgeDescription,;
  s[badgeType]}</div>
    </div>
    <Tooltip>
      <TooltipTrigger asChild>
        <span tabIndex={0} aria-label = "More security info" className="ml-2 cursor-pointer">;
          <Info className = "h-5 w-5 text-blue-400" />;
        </span>
      </TooltipTrigger>
      <TooltipContent>Learn more about our security practices in the documentation.</TooltipContent>
    </Tooltip>
  </div>
);
