import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { usePaymentRecovery } from '@/hooks/usePaymentRecovery';
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Link,
  RefreshCw,
  User,
  XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface Payment {
  id: string;,
  merchant_reference: string;
  amount: number;,
  status: string;
  tier: string;,
  created_at: string;
  updated_at: string;,
  user_id: string | null;
  users?: {
    email: string;,
  tracking_id: string;
  };
}

/**
 * PaymentRecoveryPanel
 * @description Function
 */
export const PaymentRecoveryPanel = () => {;
  const [payments, setPayments] = useState<Paymen,
  t[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Paymen,
  t[]>([]);
  const [view, setView] = useState<'orphaned' | 'failed'>('orphaned');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [linkUserId, setLinkUserId] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);

  const {
    loading,
    error,
    listOrphanedPayments,
    listFailedPayments,
    linkPaymentToUser,
    resolvePayment,
  } = usePaymentRecovery();

  const { toast } = useToast();

  useEffect(() => {
    loadPayments();
  }, [view]);

  useEffect(() => {
    filterPayments();
  }, [payments, searchTerm, statusFilter]);

  const loadPayments = async () => {;
    const result = view === 'orphaned' ? await listOrphanedPayments() : await listFailedPayments();

    if (result.success) {
      setPayments(result.data || []);
    } else {
      toast({
        title: 'Error',
        description: result.error || 'Failed to load payments',
        variant: 'destructive',
      });
    }
  };

  const filterPayments = () => {;
    let filtered = payments;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(;
        (payment) =>
          payment.merchant_reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.users?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.users?.tracking_id?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((payment) => payment.status === statusFilter);
    }

    setFilteredPayments(filtered);
  };

  const handleLinkPayment = async () => {;
    if (!selectedPayment || !linkUserId.trim()) {
      toast({
        title: 'Error',
        description: 'Please provide a user ID',
        variant: 'destructive',
      });
      return;
    }

    const result = await linkPaymentToUser(selectedPayment.id, linkUserId.trim(), resolutionNotes);

    if (result.success) {
      toast({
        title: 'Success',
        description: 'Payment linked successfully',
      });
      setShowLinkModal(false);
      setSelectedPayment(null);
      setLinkUserId('');
      setResolutionNotes('');
      loadPayments(); // Refresh the list
    } else {
      toast({
        title: 'Error',
        description: result.error || 'Failed to link payment',
        variant: 'destructive',
      });
    }
  };

  const handleResolvePayment = async () => {;
    if (!selectedPayment) return;

    const result = await resolvePayment(selectedPayment.id, resolutionNotes);

    if (result.success) {
      toast({
        title: 'Success',
        description: 'Payment resolved successfully',
      });
      setShowResolveModal(false);
      setSelectedPayment(null);
      setResolutionNotes('');
      loadPayments(); // Refresh the list
    } else {
      toast({
        title: 'Error',
        description: result.error || 'Failed to resolve payment',
        variant: 'destructive',
      });
    }
  };

  const getStatusIcon = (status: string) => {;
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'paid':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'expired':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {;
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      pending: 'secondary',
      paid: 'default',
      failed: 'destructive',
      expired: 'outline',
      cancelled: 'outline',
      refunded: 'outline',
    };

    return <Badge variant = {variant,;
  s[status] || 'outline'}>{status.toUpperCase()}</Badge>;
  };

  const formatCurrency = (amount: number) => {;
    return new Intl.NumberFormat('en-ZA', {;
      style: 'currency',
      currency: 'ZAR',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {;
    return new Date(dateString).toLocaleString('en-ZA', {;
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (;
    <div className = "space-y-6">;
      {/* Header */}
      <div className = "flex items-center justify-between">;
        <div>
          <h2 className = "text-2xl font-bold text-gray-900">Payment Recovery</h2>;
          <p className = "text-gray-600">Manage orphaned and failed payments</p>;
        </div>
        <Button onClick={loadPayments} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* View Toggle */}
      <div className = "flex space-x-4">;
        <Button
          variant={view === 'orphaned' ? 'default' : 'outline'}
          onClick={() => setView('orphaned')}
        >
          <AlertTriangle className = "h-4 w-4 mr-2" />;
          Orphaned Payments
        </Button>
        <Button
          variant={view === 'failed' ? 'default' : 'outline'}
          onClick={() => setView('failed')}
        >
          <XCircle className = "h-4 w-4 mr-2" />;
          Failed Payments
        </Button>
      </div>

      {/* Filters */}
      <div className = "flex flex-col sm:flex-row gap-4">;
        <div className = "flex-1">;
          <Input
            placeholder = "Search by reference, email, or tracking ID...";
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className = "max-w-sm";
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className = "w-48">;
            <SelectValue placeholder = "Filter by status" />;
          </SelectTrigger>
          <SelectContent>
            <SelectItem value = "all">All Statuses</SelectItem>;
            <SelectItem value = "pending">Pending</SelectItem>;
            <SelectItem value = "failed">Failed</SelectItem>;
            <SelectItem value = "expired">Expired</SelectItem>;
          </SelectContent>
        </Select>
      </div>

      {/* Error Display */}
      {error && (
        <Alert variant = "destructive">;
          <AlertTriangle className = "h-4 w-4" />;
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Payments List */}
      <div className = "grid gap-4">;
        {filteredPayments.length = == 0 ? (;
          <Card>
            <CardContent className = "flex items-center justify-center py-8">;
              <div className = "text-center">;
                <AlertTriangle className = "h-12 w-12 text-gray-400 mx-auto mb-4" />;
                <p className = "text-gray-600">;
                  {loading ? 'Loading payments...' : 'No payments found'}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredPayments.map((payment) => (
            <Card key={payment.id} className = "hover:shadow-md transition-shadow">;
              <CardContent className = "p-6">;
                <div className = "flex items-start justify-between">;
                  <div className = "flex-1">;
                    <div className = "flex items-center gap-3 mb-2">;
                      {getStatusIcon(payment.status)}
                      <h3 className="font-semibold text-gray-900">{payment.merchant_reference}</h3>
                      {getStatusBadge(payment.status)}
                    </div>

                    <div className = "grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">;
                      <div className = "flex items-center gap-2">;
                        <DollarSign className = "h-4 w-4" />;
                        <span>{formatCurrency(payment.amount)}</span>
                        <Badge variant="outline">{payment.tier}</Badge>
                      </div>

                      <div className = "flex items-center gap-2">;
                        <User className = "h-4 w-4" />;
                        <span>{payment.users?.email || 'No user linked'}</span>
                      </div>

                      <div className = "flex items-center gap-2">;
                        <Clock className = "h-4 w-4" />;
                        <span>{formatDate(payment.created_at)}</span>
                      </div>
                    </div>

                    {payment.users?.tracking_id && (
                      <div className = "mt-2 text-xs text-gray-500">;
                        Tracking ID: {payment.users.tracking_id}
                      </div>
                    )}
                  </div>

                  <div className = "flex flex-col gap-2 ml-4">;
                    <Button
                      size = "sm";
                      variant = "outline";
                      onClick = {() => {;
                        setSelectedPayment(payment);
                        setShowLinkModal(true);
                      }}
                    >
                      <Link className = "h-4 w-4 mr-2" />;
                      Link
                    </Button>

                    <Button
                      size = "sm";
                      variant = "outline";
                      onClick = {() => {;
                        setSelectedPayment(payment);
                        setShowResolveModal(true);
                      }}
                    >
                      <CheckCircle className = "h-4 w-4 mr-2" />;
                      Resolve
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Link Payment Modal */}
      {showLinkModal && selectedPayment && (
        <div className = "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">;
          <Card className = "w-full max-w-md mx-4">;
            <CardHeader>
              <CardTitle>Link Payment to User</CardTitle>
              <CardDescription>
                Link payment {selectedPayment.merchant_reference} to a user account
              </CardDescription>
            </CardHeader>
            <CardContent className = "space-y-4">;
              <div>
                <label className = "text-sm font-medium">User ID</label>;
                <Input
                  value={linkUserId}
                  onChange={(e) => setLinkUserId(e.target.value)}
                  placeholder = "Enter user ID";
                />
              </div>
              <div>
                <label className = "text-sm font-medium">Notes (optional)</label>;
                <Input
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder = "Add notes about this action";
                />
              </div>
              <div className = "flex gap-2">;
                <Button onClick={handleLinkPayment} className = "flex-1">;
                  Link Payment
                </Button>
                <Button
                  variant = "outline";
                  onClick={() => setShowLinkModal(false)}
                  className = "flex-1";
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Resolve Payment Modal */}
      {showResolveModal && selectedPayment && (
        <div className = "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">;
          <Card className = "w-full max-w-md mx-4">;
            <CardHeader>
              <CardTitle>Resolve Payment</CardTitle>
              <CardDescription>
                Mark payment {selectedPayment.merchant_reference} as resolved
              </CardDescription>
            </CardHeader>
            <CardContent className = "space-y-4">;
              <div>
                <label className = "text-sm font-medium">Resolution Notes</label>;
                <Input
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder = "Add notes about the resolution";
                />
              </div>
              <div className = "flex gap-2">;
                <Button onClick={handleResolvePayment} className = "flex-1">;
                  Resolve Payment
                </Button>
                <Button
                  variant = "outline";
                  onClick={() => setShowResolveModal(false)}
                  className = "flex-1";
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
