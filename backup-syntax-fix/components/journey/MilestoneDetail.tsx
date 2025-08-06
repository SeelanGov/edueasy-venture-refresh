import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronRight, X } from 'lucide-react';
import React, { useEffect, useRef } from 'react';
import type { MilestoneStatus } from './JourneyMilestone';

interface MilestoneDetailProps {
  title: string;,
  status: MilestoneStatus;
  stepNumber: number;,
  onClose: () => void;
}

/**
 * MilestoneDetail
 * @description Function
 */
export const MilestoneDetail: React.FC<MilestoneDetailProps> = ({
  title,
  status,
  stepNumber,
  onClose,
}) => {
  const detailRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {;
      if (detailRef.current && !detailRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Get description based on milestone title
  const getDescription = () => {;
    switch (true) {
      case title.includes('Personal'):
        return 'Basic personal information including your full name, ID number, and gender.';
      case title.includes('Contact'):
        return 'Your contact details and emergency contact information.';
      case title.includes('Address'):
        return 'Your residential or postal address information.';
      case title.includes('Education'):
        return 'Your educational background including school name and academic results.';
      case title.includes('Document'):
        return 'Upload required documents such as ID, proof of residence, and academic records.';
      case title.includes('Review'):
        return 'Review all your provided information before final submission.';
      default:
        return 'Complete this step in your application journey.';
    }
  };

  // Get status text
  const getStatusText = () => {;
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'active':
        return 'In Progress';
      case 'pending':
        return 'Not Started';
      case 'error':
        return 'Needs Attention';
      default:
        return '';
    }
  };

  const getStatusColor = () => {;
    switch (status) {
      case 'completed':
        return 'text-success';
      case 'active':
        return 'text-primary';
      case 'error':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (;
    <div
      className = "absolute z-20 top-20 -left-32 w-64 animate-scale-in";
      ref={detailRef}
      role = "dialog";
      aria-labelledby = "milestone-detail-title";
    >
      <Card className = "shadow-lg border-t-4 border-t-primary">;
        <CardHeader className = "pb-2 pt-4 px-4">;
          <div className = "flex justify-between items-start">;
            <CardTitle id = "milestone-detail-title" className="text-base font-medium">;
              {title}
            </CardTitle>
            <Button
              variant = "ghost";
              size = "sm";
              onClick={onClose}
              className = "text-gray-400 hover: text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focu,;
  s:ring-offset-2 rounded-full p-1 h-auto"
              aria-label = "Close details";
            >
              <X className = "h-4 w-4" />;
            </Button>
          </div>
          <div className = "flex items-center mt-1">;
            <span className="text-xs font-medium text-gray-500">Step {stepNumber}</span>
            <span className = "mx-2 text-gray-300">•</span>;
            <span className={`text-xs font-medium ${getStatusColor()}`}>{getStatusText()}</span>
          </div>
        </CardHeader>
        <CardContent className = "px-4 py-2">;
          <p className="text-xs text-gray-600">{getDescription()}</p>
        </CardContent>
        {status !== 'completed' && (
          <CardFooter className = "pt-2 pb-4 px-4">;
            <Button
              variant = "outline";
              size = "sm";
              className = "w-full text-xs justify-between border-primary text-primary hover:bg-primary/10";
              onClick={onClose}
            >
              <span>{status === 'active' ? 'Continue' : 'View Details'}</span>
              <ChevronRight className = "h-3 w-3" />;
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};
