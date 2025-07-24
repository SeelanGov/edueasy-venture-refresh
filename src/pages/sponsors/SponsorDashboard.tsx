import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useSponsorApplications } from '@/hooks/useSponsorApplications';
import {
    CheckCircle,
    Clock,
    DollarSign,
    Download,
    Filter,
    RefreshCw,
    Search,
    XCircle
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface PaymentSummary {
  totalAmount: number;
  totalPayments: number;
  pendingAmount: number;
  pendingCount: number;
  paidAmount: number;
  paidCount: number;
  failedAmount: number;
  failedCount: number;
}

const SponsorDashboard = () => {
  const { applications, loading, refresh } = useSponsorApplications({ asSponsor: true });
  const { userType } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Filter states
  const [dateRange, setDateRange] = useState('30d');
  const [paymentStatus, setPaymentStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentSummary, setPaymentSummary] = useState<PaymentSummary>({
    totalAmount: 0,
    totalPayments: 0,
    pendingAmount: 0,
    pendingCount: 0,
    paidAmount: 0,
    paidCount: 0,
    failedAmount: 0,
    failedCount: 0
  });

  // Calculate payment summary
  useEffect(() => {
    if (applications.length > 0) {
      const summary = applications.reduce((acc, app) => {
        const amount = parseFloat(app.sponsored_amount) || 0;
        acc.totalAmount += amount;
        acc.totalPayments += 1;
        
        switch (app.payment_status) {
          case 'pending':
            acc.pendingAmount += amount;
            acc.pendingCount += 1;
            break;
          case 'paid':
            acc.paidAmount += amount;
            acc.paidCount += 1;
            break;
          case 'failed':
            acc.failedAmount += amount;
            acc.failedCount += 1;
            break;
        }
        return acc;
      }, {
        totalAmount: 0,
        totalPayments: 0,
        pendingAmount: 0,
        pendingCount: 0,
        paidAmount: 0,
        paidCount: 0,
        failedAmount: 0,
        failedCount: 0
      } as PaymentSummary);
      
      setPaymentSummary(summary);
    }
  }, [applications]);

  // Filter applications based on current filters
  const filteredApplications = applications.filter((app) => {
    // Date range filter
    if (dateRange !== 'all') {
      const appDate = new Date(app.created_at);
      const now = new Date();
      const daysAgo = parseInt(dateRange.replace('d', ''));
      const cutoffDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
      
      if (appDate < cutoffDate) return false;
    }
    
    // Payment status filter
    if (paymentStatus !== 'all' && app.payment_status !== paymentStatus) {
      return false;
    }
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const appId = app.sponsor_application_id?.toLowerCase() || '';
      const studentId = app.sponsor_applications?.student_id?.toLowerCase() || '';
      const amount = app.sponsored_amount?.toString() || '';
      
      if (!appId.includes(query) && !studentId.includes(query) && !amount.includes(query)) {
        return false;
      }
    }
    
    return true;
  });

  const handleExportCSV = async () => {
    try {
      const csvData = [
        ['Application ID', 'Student ID', 'Sponsored Amount', 'Status', 'Paid At', 'Created At'],
        ...filteredApplications.map(app => [
          app.sponsor_application_id || '',
          app.sponsor_applications?.student_id || '',
          app.sponsored_amount || '',
          app.payment_status || '',
          app.paid_at ? new Date(app.paid_at).toLocaleString() : '',
          new Date(app.created_at).toLocaleString()
        ])
      ];
      
      const csvContent = csvData.map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sponsor-payments-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      toast({
        title: 'Export Successful',
        description: 'Payment data exported to CSV file',
      });
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: 'Failed to export payment data',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'paid':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'failed':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR'
    }).format(amount);
  };

  if (userType !== 'sponsor') {
    return (
      <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded-xl shadow">
        <h2 className="text-2xl mb-4">Unauthenticated</h2>
        <p>
          Please{' '}
          <Button className="text-cap-teal underline" variant="link" onClick={() => navigate('/sponsors/login')}>
            Login
          </Button>{' '}
          as sponsor.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto mt-10 p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Sponsor Dashboard</h2>
          <p className="text-gray-600 mt-1">Manage your sponsorship payments and applications</p>
        </div>
        <Button onClick={refresh} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Payment Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sponsored</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(paymentSummary.totalAmount)}</div>
            <p className="text-xs text-muted-foreground">
              {paymentSummary.totalPayments} payments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid Amount</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(paymentSummary.paidAmount)}</div>
            <p className="text-xs text-muted-foreground">
              {paymentSummary.paidCount} successful payments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{formatCurrency(paymentSummary.pendingAmount)}</div>
            <p className="text-xs text-muted-foreground">
              {paymentSummary.pendingCount} pending payments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Amount</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(paymentSummary.failedAmount)}</div>
            <p className="text-xs text-muted-foreground">
              {paymentSummary.failedCount} failed payments
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Date Range</label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                  <SelectItem value="90d">Last 90 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Payment Status</label>
              <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by ID or amount..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex items-end">
              <Button onClick={handleExportCSV} variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applications Table */}
      <Card>
        <CardHeader>
          <CardTitle>Sponsorship Applications</CardTitle>
          <CardDescription>
            Showing {filteredApplications.length} of {applications.length} applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin mr-2" />
              Loading applications...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border rounded">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Application ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sponsored Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Paid At
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created At
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredApplications.map((row: any) => (
                    <tr key={row.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {row.sponsor_application_id}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {row.sponsor_applications?.student_id}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {formatCurrency(parseFloat(row.sponsored_amount) || 0)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <Badge variant={getStatusBadgeVariant(row.payment_status)}>
                          {row.payment_status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {row.paid_at ? new Date(row.paid_at).toLocaleString() : '-'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {new Date(row.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {filteredApplications.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center text-gray-400 py-8">
                        {applications.length === 0 ? 'No sponsorships found.' : 'No applications match your filters.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SponsorDashboard;
