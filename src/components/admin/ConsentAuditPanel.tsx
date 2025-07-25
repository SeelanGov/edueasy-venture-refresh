import { Spinner } from '@/components/Spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { getConsentStatistics } from '@/utils/consent-recording';
import { CheckCircle, Clock, Download, Eye, FileText, Shield, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ConsentRecord {
  id: string;
  user_id: string;
  consent_type: string;
  consent_text: string;
  consent_version: string;
  accepted: boolean;
  ip_address: string;
  user_agent: string;
  created_at: string;
  user?: {
    email: string;
    full_name: string;
  };
}

interface VerificationLog {
  id: string;
  user_id: string;
  api_request_id: string;
  verification_status: string;
  error_message: string;
  ip_address: string;
  created_at: string;
  user?: {
    email: string;
    full_name: string;
  };
}


/**
 * ConsentAuditPanel
 * @description Function
 */
export const ConsentAuditPanel = (): void => {
  const [consents, setConsents] = useState<ConsentRecord[]>([]);
  const [verificationLogs, setVerificationLogs] = useState<VerificationLog[]>([]);
  const [statistics, setStatistics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'consents' | 'verifications' | 'stats'>('consents');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Load consents with user data
      const { data: consentsData, error: consentsError } = await supabase
        .from('user_consents')
        .select(
          `
          *,
          user:users(email, full_name)
        `,
        )
        .order('created_at', { ascending: false });

      if (consentsError) throw consentsError;

      // Load verification logs with user data
      const { data: verificationData, error: verificationError } = await supabase
        .from('verifyid_audit_log')
        .select(
          `
          *,
          user:users(email, full_name)
        `,
        )
        .order('created_at', { ascending: false });

      if (verificationError) throw verificationError;

      // Load statistics
      const stats = await getConsentStatistics();

      setConsents(consentsData || []);
      setVerificationLogs(verificationData || []);
      setStatistics(stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load audit data');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredConsents = consents.filter((consent) => {
    const matchesType = filterType === 'all' || consent.consent_type === filterType;
    const matchesSearch =
      searchTerm === '' ||
      consent.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consent.user?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesType && matchesSearch;
  });

  const filteredVerifications = verificationLogs.filter((log) => {
    const matchesSearch =
      searchTerm === '' ||
      log.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const exportConsentData = async () => {
    try {
      const csvData = filteredConsents.map((consent) => ({
        'User ID': consent.user_id,
        Email: consent.user?.email || 'N/A',
        'Full Name': consent.user?.full_name || 'N/A',
        'Consent Type': consent.consent_type,
        Accepted: consent.accepted ? 'Yes' : 'No',
        Version: consent.consent_version,
        'IP Address': consent.ip_address || 'N/A',
        Date: new Date(consent.created_at).toLocaleString(),
        'User Agent': consent.user_agent || 'N/A',
      }));

      const csv = convertToCSV(csvData);
      downloadCSV(csv, 'consent-audit-data.csv');
    } catch (err) {
      setError('Failed to export data');
    }
  };

  const convertToCSV = (data: unknown[]): string => {
    if (data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map((row) => headers.map((header) => `"${row[header]}"`).join(',')),
    ];

    return csvRows.join('\n');
  };

  const downloadCSV = (csv: string, filename: string): void => {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: string): void => {
    switch (status) {
      case 'success':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Success
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        );
      case 'consent_missing':
        return (
          <Badge variant="secondary">
            <Shield className="h-3 w-3 mr-1" />
            No Consent
          </Badge>
        );
      case 'rate_limited':
        return (
          <Badge variant="outline">
            <Clock className="h-3 w-3 mr-1" />
            Rate Limited
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert>
        <XCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Consent & Verification Audit</h1>
          <p className="text-gray-600">Monitor user consents and ID verification activities</p>
        </div>
        <Button onClick={exportConsentData} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export Data
        </Button>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.totalUsers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Privacy Consent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{statistics.privacyConsent}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Terms Consent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{statistics.termsConsent}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">ID Verification Consent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {statistics.idVerificationConsent}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search Users</Label>
              <Input
                id="search"
                placeholder="Search by email or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-48">
              <Label htmlFor="filter-type">Consent Type</Label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="privacy_policy">Privacy Policy</SelectItem>
                  <SelectItem value="terms_of_service">Terms of Service</SelectItem>
                  <SelectItem value="ID_verification">ID Verification</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex space-x-1 border-b">
        <Button
          variant={activeTab === 'consents' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('consents')}
          className="flex items-center gap-2"
        >
          <FileText className="h-4 w-4" />
          Consents ({filteredConsents.length})
        </Button>
        <Button
          variant={activeTab === 'verifications' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('verifications')}
          className="flex items-center gap-2"
        >
          <Shield className="h-4 w-4" />
          Verifications ({filteredVerifications.length})
        </Button>
        <Button
          variant={activeTab === 'stats' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('stats')}
          className="flex items-center gap-2"
        >
          <Eye className="h-4 w-4" />
          Statistics
        </Button>
      </div>

      {/* Consents Tab */}
      {activeTab === 'consents' && (
        <Card>
          <CardHeader>
            <CardTitle>Consent Records</CardTitle>
            <CardDescription>All user consent records with timestamps and metadata</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Consent Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Version</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredConsents.map((consent) => (
                  <TableRow key={consent.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{consent.user?.full_name || 'N/A'}</div>
                        <div className="text-sm text-gray-500">{consent.user?.email || 'N/A'}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{consent.consent_type}</Badge>
                    </TableCell>
                    <TableCell>
                      {consent.accepted ? (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Accepted
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          <XCircle className="h-3 w-3 mr-1" />
                          Declined
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{consent.consent_version}</TableCell>
                    <TableCell className="font-mono text-sm">
                      {consent.ip_address || 'N/A'}
                    </TableCell>
                    <TableCell>{new Date(consent.created_at).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Verifications Tab */}
      {activeTab === 'verifications' && (
        <Card>
          <CardHeader>
            <CardTitle>Verification Logs</CardTitle>
            <CardDescription>All VerifyID API call attempts and results</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Request ID</TableHead>
                  <TableHead>Error Message</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVerifications.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{log.user?.full_name || 'N/A'}</div>
                        <div className="text-sm text-gray-500">{log.user?.email || 'N/A'}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(log.verification_status)}</TableCell>
                    <TableCell className="font-mono text-sm">
                      {log.api_request_id || 'N/A'}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {log.error_message || 'N/A'}
                    </TableCell>
                    <TableCell className="font-mono text-sm">{log.ip_address || 'N/A'}</TableCell>
                    <TableCell>{new Date(log.created_at).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Statistics Tab */}
      {activeTab === 'stats' && statistics && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Consent Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Privacy Policy Consent:</span>
                <span className="font-medium">
                  {statistics.privacyConsent} / {statistics.totalUsers}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Terms of Service Consent:</span>
                <span className="font-medium">
                  {statistics.termsConsent} / {statistics.totalUsers}
                </span>
              </div>
              <div className="flex justify-between">
                <span>ID Verification Consent:</span>
                <span className="font-medium">
                  {statistics.idVerificationConsent} / {statistics.totalUsers}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Marketing Consent:</span>
                <span className="font-medium">
                  {statistics.marketingConsent} / {statistics.totalUsers}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Verification Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Total Verification Attempts:</span>
                <span className="font-medium">{verificationLogs.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Successful Verifications:</span>
                <span className="font-medium text-green-600">
                  {verificationLogs.filter((log) => log.verification_status === 'success').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Failed Verifications:</span>
                <span className="font-medium text-red-600">
                  {verificationLogs.filter((log) => log.verification_status === 'failed').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Consent Missing:</span>
                <span className="font-medium text-yellow-600">
                  {
                    verificationLogs.filter((log) => log.verification_status === 'consent_missing')
                      .length
                  }
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
