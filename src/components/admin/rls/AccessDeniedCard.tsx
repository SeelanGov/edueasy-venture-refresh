import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

/**
 * AccessDeniedCard
 * @description Function
 */
export const AccessDeniedCard = (): void => {
  return (
    <Card className="border-destructive">
      <CardHeader>
        <CardTitle className="text-destructive flex items-center gap-2">
          <AlertCircle size={18} />
          Access Denied
        </CardTitle>
        <CardDescription>You need admin privileges to access this tool.</CardDescription>
      </CardHeader>
    </Card>
  );
};
