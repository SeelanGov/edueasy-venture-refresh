import React, { useState } from 'react';
import {
  CheckIcon,
  CircleDashed,
  FileText,
  BookOpen,
  User,
  Phone,
  MapPin,
  Award,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { MilestoneDetail } from './MilestoneDetail';

export type MilestoneStatus = 'pending' | 'active' | 'completed' | 'error';

interface JourneyMilestoneProps {
  title: string;
  stepNumber: number;
  status: MilestoneStatus;
  onClick?: () => void;
}

/**
 * JourneyMilestone
 * @description Function
 */
export const JourneyMilestone: React.FC<JourneyMilestoneProps> = ({
  title,
  stepNumber,
  status,
  onClick,
}) => {
  const [showDetail, setShowDetail] = useState(false);

  // Get icon based on milestone title
  const getMilestoneIcon = () => {
    if (title.includes('Personal')) return User;
    if (title.includes('Contact')) return Phone;
    if (title.includes('Address')) return MapPin;
    if (title.includes('Education')) return BookOpen;
    if (title.includes('Document')) return FileText;
    if (title.includes('Review')) return Award;
    return CircleDashed;
  };

  const Icon = getMilestoneIcon();

  const handleMilestoneClick = (): void => {
    setShowDetail(!showDetail);
    onClick?.();
  };

  // Define inline color styles to avoid CSS variable issues
  const getStatusColors = () => {
    switch (status) {
      case 'active':
        return {
          bg: 'bg-primary',
          border: 'border-primary',
          text: 'text-white',
          animation: 'animate-pulse',
        };
      case 'completed':
        return {
          bg: 'bg-green-500',
          border: 'border-green-500',
          text: 'text-white',
          animation: '',
        };
      case 'error':
        return {
          bg: 'bg-red-50',
          border: 'border-red-500',
          text: 'text-red-500',
          animation: '',
        };
      default: // pending
        return {
          bg: 'bg-gray-100',
          border: 'border-gray-300',
          text: 'text-gray-400',
          animation: '',
        };
    }
  };

  const statusColors = getStatusColors();

  return (
    <div className="relative flex flex-col items-center">
      {/* Milestone icon */}
      <div
        onClick={handleMilestoneClick}
        className={cn(
          'w-14 h-14 rounded-full flex items-center justify-center z-10 cursor-pointer transition-all duration-300 border-2',
          statusColors.bg,
          statusColors.border,
          statusColors.text,
          statusColors.animation,
        )}
        aria-label={`${title} - ${status}`}
        tabIndex={0}
        role="button"
        onKeyDown={(e) => e.key === 'Enter' && handleMilestoneClick()}
      >
        {status === 'completed' ? <CheckIcon className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
      </div>

      {/* Milestone label */}
      <span
        className={cn(
          'mt-2 text-xs font-medium whitespace-nowrap max-w-28 text-center',
          status === 'active' && 'text-primary',
          status === 'completed' && 'text-green-600',
          status === 'pending' && 'text-gray-500',
          status === 'error' && 'text-red-500',
        )}
      >
        {title}
      </span>

      {/* Milestone number badge */}
      {status !== 'completed' && (
        <span
          className={cn(
            'absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs',
            status === 'active' && 'bg-primary text-white',
            status === 'pending' && 'bg-gray-200 text-gray-600',
            status === 'error' && 'bg-red-100 text-red-600',
          )}
        >
          {stepNumber}
        </span>
      )}

      {/* Milestone details popup */}
      {showDetail && (
        <MilestoneDetail
          title={title}
          status={status}
          onClose={() => setShowDetail(false)}
          stepNumber={stepNumber}
        />
      )}
    </div>
  );
};
