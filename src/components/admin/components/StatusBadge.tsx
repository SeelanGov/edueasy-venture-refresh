
import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: 'pending' | 'paid' | 'failed';
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const styles = {
    pending: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
  };

  return (
    <Badge className={styles[status]}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};
