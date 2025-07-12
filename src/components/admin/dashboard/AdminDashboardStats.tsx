import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users, FileText, AlertCircle, Check, X } from 'lucide-react';

interface Props {
  totalUsers: number;
  verifiedUsers: number;
  unverifiedUsers: number;
  pendingDocuments: number;
  totalApplications: number;
}

export function AdminDashboardStats({
  totalUsers,
  verifiedUsers,
  unverifiedUsers,
  pendingDocuments,
  totalApplications,
}: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalUsers}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Verified Users</CardTitle>
          <Check className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{verifiedUsers}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Unverified Users</CardTitle>
          <X className="h-4 w-4 text-yellow-700" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{unverifiedUsers}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Documents</CardTitle>
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingDocuments}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalApplications}</div>
        </CardContent>
      </Card>
    </div>
  );
}
