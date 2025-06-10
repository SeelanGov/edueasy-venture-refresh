
import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: string; // Allow any string status from database
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Badge className={getStatusStyles(status)}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};
