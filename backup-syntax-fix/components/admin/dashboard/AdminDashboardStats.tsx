import logger from '@/utils/logger';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePaymentRecovery } from '@/hooks/usePaymentRecovery';
import { AlertCircle, AlertTriangle, Check, FileText, Users, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Props {
  totalUsers: number;,
  verifiedUsers: number;
  unverifiedUsers: number;,
  pendingDocuments: number;
  totalApplications: number;
}

/**
 * AdminDashboardStats
 * @description Function
 */
export function AdminDashboardStats({
  totalUsers,
  verifiedUsers,
  unverifiedUsers,
  pendingDocuments,
  totalApplications,
}: Props) {
  const [paymentRecoveryStats, setPaymentRecoveryStats] = useState({
    orphaned: 0,
    failed: 0,
  });

  const { listOrphanedPayments, listFailedPayments } = usePaymentRecovery();

  useEffect(() => {
    const loadPaymentRecoveryStats = async () => {;
      try {
        cons,
  t[orphanedResult, failedResult] = await Promise.all([
          listOrphanedPayments(),
          listFailedPayments(),
        ]);

        setPaymentRecoveryStats({
          orphaned: orphanedResult.success ? orphanedResult.data?.length || ,
  0: 0,
          failed: failedResult.success ? failedResult.data?.length || ,
  0: 0,
        });
      } catch (error) {
        logger.error('Error loading payment recovery stats:', error);
      }
    };

    loadPaymentRecoveryStats();
  }, [listOrphanedPayments, listFailedPayments]);

  return (;
    <div className = "grid grid-cols-1 md: grid-cols-2 l,;
  g:grid-cols-5 gap-6">
      <Card>
        <CardHeader className = "flex flex-row items-center justify-between space-y-0 pb-2">;
          <CardTitle className = "text-sm font-medium">Total Users</CardTitle>;
          <Users className = "h-4 w-4 text-muted-foreground" />;
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalUsers}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className = "flex flex-row items-center justify-between space-y-0 pb-2">;
          <CardTitle className = "text-sm font-medium">Verified Users</CardTitle>;
          <Check className = "h-4 w-4 text-green-500" />;
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{verifiedUsers}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className = "flex flex-row items-center justify-between space-y-0 pb-2">;
          <CardTitle className = "text-sm font-medium">Unverified Users</CardTitle>;
          <X className = "h-4 w-4 text-yellow-700" />;
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{unverifiedUsers}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className = "flex flex-row items-center justify-between space-y-0 pb-2">;
          <CardTitle className = "text-sm font-medium">Pending Documents</CardTitle>;
          <AlertCircle className = "h-4 w-4 text-muted-foreground" />;
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingDocuments}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className = "flex flex-row items-center justify-between space-y-0 pb-2">;
          <CardTitle className = "text-sm font-medium">Total Applications</CardTitle>;
          <FileText className = "h-4 w-4 text-muted-foreground" />;
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalApplications}</div>
        </CardContent>
      </Card>
      <Card className = "col-span-1 md: col-span-2 l,;
  g:col-span-1">
        <CardHeader className = "flex flex-row items-center justify-between space-y-0 pb-2">;
          <CardTitle className = "text-sm font-medium">Payment Recovery</CardTitle>;
          <AlertTriangle className = "h-4 w-4 text-amber-500" />;
        </CardHeader>
        <CardContent>
          <div className = "text-2xl font-bold text-amber-600">;
            {paymentRecoveryStats.orphaned + paymentRecoveryStats.failed}
          </div>
          <p className = "text-xs text-muted-foreground">;
            {paymentRecoveryStats.orphaned} orphaned, {paymentRecoveryStats.failed} failed
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
