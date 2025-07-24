import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
    CheckCircle,
    Clock,
    DollarSign,
    Download,
    ExternalLink,
    Eye,
    Filter,
    RefreshCw,
    Search,
    XCircle
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface PaymentAuditData {
  id: string;
  user_id: string;
  amount: number;
  tier: string | null;
  payment_method: string;
  status: string;
  merchant_reference: string | null;
  gateway_provider: string | null;
  payment_url?: string | null;
  payfast_payment_id?: string | null;
  payment_expiry?: string | null;
  ipn_verified: boolean | null;
  webhook_data?: any;
  created_at: string | null;
  updated_at: string | null;
  user_email?: string;
  user_name?: string;
}

interface PaymentSummary {
  totalAmount: number;
  totalPayments: number;
  pendingAmount: number;
  pendingCount: number;
  paidAmount: number;
  paidCount: number;
  failedAmount: number;
  failedCount: number;
  verifiedAmount: number;
  verifiedCount: number;
}

export const AdminPaymentAuditView = () => {
  const { toast } = useToast();
  const [payments, setPayments] = useState<PaymentAuditData[]>([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<PaymentSummary>({
    totalAmount: 0,
    totalPayments: 0,
    pendingAmount: 0,
    pendingCount: 0,
    paidAmount: 0,
    paidCount: 0,
    failedAmount: 0,
    failedCount: 0,
    verifiedAmount: 0,
    verifiedCount: 0
  });

  // Filter states
  const [dateRange, setDateRange] = useState('30d');
  const [paymentStatus, setPaymentStatus] = useState('all');
  const [paymentMethod, setPaymentMethod] = useState('all');
  const [gatewayProvider, setGatewayProvider] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [amountRange, setAmountRange] = useState('all');

  const fetchPayments = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply date range filter
      if (dateRange !== 'all') {
        const daysAgo = parseInt(dateRange.replace('d', ''));
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysAgo);
        query = query.gte('created_at', cutoffDate.toISOString());
      }

      const { data, error } = await query;

      if (error) throw error;

      const paymentsWithUserInfo = data?.map(payment => ({
        ...payment,
        user_email: 'N/A',
        user_name: 'N/A',
        tier: payment.tier || 'N/A'
      })) || [];

      setPayments(paymentsWithUserInfo);
      calculateSummary(paymentsWithUserInfo);
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch payment data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateSummary = (paymentData: PaymentAuditData[]) => {
    const summary = paymentData.reduce((acc, payment) => {
      const amount = payment.amount || 0;
      acc.totalAmount += amount;
      acc.totalPayments += 1;
      
      switch (payment.status) {
        case 'pending':
          acc.pendingAmount += amount;
          acc.pendingCount += 1;
          break;
        case 'paid':
          acc.paidAmount += amount;
          acc.paidCount += 1;
          if (payment.ipn_verified) {
            acc.verifiedAmount += amount;
            acc.verifiedCount += 1;
          }
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
      failedCount: 0,
      verifiedAmount: 0,
      verifiedCount: 0
    } as PaymentSummary);
    
    setSummary(summary);
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // Filter payments based on current filters
  const filteredPayments = payments.filter((payment) => {
    // Payment status filter
    if (paymentStatus !== 'all' && payment.status !== paymentStatus) {
      return false;
    }
    
    // Payment method filter
    if (paymentMethod !== 'all' && payment.payment_method !== paymentMethod) {
      return false;
    }
    
    // Gateway provider filter
    if (gatewayProvider !== 'all' && payment.gateway_provider !== gatewayProvider) {
      return false;
    }
    
    // Amount range filter
    if (amountRange !== 'all') {
      const amount = payment.amount || 0;
      switch (amountRange) {
        case '0-100':
          if (amount > 100) return false;
          break;
        case '100-500':
          if (amount < 100 || amount > 500) return false;
          break;
        case '500+':
          if (amount < 500) return false;
          break;
      }
    }
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const merchantRef = payment.merchant_reference?.toLowerCase() || '';
      const userId = payment.user_id?.toLowerCase() || '';
      const userEmail = payment.user_email?.toLowerCase() || '';
      const userName = payment.user_name?.toLowerCase() || '';
      const amount = payment.amount?.toString() || '';
      
      if (!merchantRef.includes(query) && !userId.includes(query) && 
          !userEmail.includes(query) && !userName.includes(query) && 
          !amount.includes(query)) {
        return false;
      }
    }
    
    return true;
  });

  const handleExportCSV = async () => {
    try {
      const csvData = [
        ['Merchant Reference', 'User ID', 'User Email', 'User Name', 'Amount', 'Tier', 'Payment Method', 'Status', 'Gateway', 'IPN Verified', 'Created At', 'Updated At'],
        ...filteredPayments.map(payment => [
          payment.merchant_reference || '',
          payment.user_id || '',
          payment.user_email || '',
          payment.user_name || '',
          payment.amount?.toString() || '',
          payment.tier || '',
          payment.payment_method || '',
          payment.status || '',
          payment.gateway_provider || '',
          payment.ipn_verified ? 'Yes' : 'No',
          payment.created_at ? new Date(payment.created_at).toLocaleString() : 'N/A',
          payment.updated_at ? new Date(payment.updated_at).toLocaleString() : 'N/A'
        ])
      ];
      
      const csvContent = csvData.map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `payment-audit-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      toast({
        title: 'Export Successful',
        description: 'Payment audit data exported to CSV file',
      });
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: 'Failed to export payment audit data',
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

  const handleViewPaymentDetails = (payment: PaymentAuditData) => {
    // Open payment details in a new tab or modal
    if (payment.payment_url) {
      window.open(payment.payment_url, '_blank');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Payment Audit Dashboard</h2>
          <p className="text-gray-600 mt-1">Real-time payment monitoring and audit trail</p>
        </div>
        <Button onClick={fetchPayments} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Payment Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary.totalAmount)}</div>
            <p className="text-xs text-muted-foreground">
              {summary.totalPayments} transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid Amount</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(summary.paidAmount)}</div>
            <p className="text-xs text-muted-foreground">
              {summary.paidCount} successful
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified Amount</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(summary.verifiedAmount)}</div>
            <p className="text-xs text-muted-foreground">
              {summary.verifiedCount} IPN verified
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{formatCurrency(summary.pendingAmount)}</div>
            <p className="text-xs text-muted-foreground">
              {summary.pendingCount} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Amount</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(summary.failedAmount)}</div>
            <p className="text-xs text-muted-foreground">
              {summary.failedCount} failed
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
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
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
              <label className="text-sm font-medium mb-2 block">Status</label>
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
              <label className="text-sm font-medium mb-2 block">Payment Method</label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Methods</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="eft">EFT</SelectItem>
                  <SelectItem value="airtime">Airtime</SelectItem>
                  <SelectItem value="qr">QR Code</SelectItem>
                  <SelectItem value="store">Store</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Amount Range</label>
              <Select value={amountRange} onValueChange={setAmountRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Amounts</SelectItem>
                  <SelectItem value="0-100">R0 - R100</SelectItem>
                  <SelectItem value="100-500">R100 - R500</SelectItem>
                  <SelectItem value="500+">R500+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search payments..."
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

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Transactions</CardTitle>
          <CardDescription>
            Showing {filteredPayments.length} of {payments.length} payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin mr-2" />
              Loading payments...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border rounded">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Merchant Ref
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tier
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Method
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      IPN Verified
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {payment.merchant_reference}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{payment.user_name || 'N/A'}</div>
                          <div className="text-sm text-gray-500">{payment.user_email}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {formatCurrency(payment.amount || 0)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {payment.tier}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {payment.payment_method}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <Badge variant={getStatusBadgeVariant(payment.status)}>
                          {payment.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <Badge variant={payment.ipn_verified ? 'default' : 'secondary'}>
                          {payment.ipn_verified ? 'Yes' : 'No'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {payment.created_at ? new Date(payment.created_at).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewPaymentDetails(payment)}
                            disabled={!payment.payment_url}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {payment.payment_url && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => payment.payment_url && window.open(payment.payment_url, '_blank')}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredPayments.length === 0 && (
                    <tr>
                      <td colSpan={9} className="text-center text-gray-400 py-8">
                        {payments.length === 0 ? 'No payments found.' : 'No payments match your filters.'}
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