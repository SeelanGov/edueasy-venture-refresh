import { AuditTrail } from '@/components/admin/audit/AuditTrail';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useSponsorAllocations } from '@/hooks/admin/useSponsorAllocations';
import { useUserVerificationLogs } from '@/hooks/admin/useUserVerificationLogs';
import { Clock, FileText, ShieldCheck, User, X } from 'lucide-react';
import { React } from 'react';

import {
  Card,
  CardContent,
  CardHeader as CardHead,
  CardTitle as CardHeaderTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface UserModalProps {
  user: {
    id: string;
    full_name: string | null;
    email: string | null;
    phone_number: string | null;
    id_verified?: boolean | null;
    tracking_id?: string | null;
    emergency_contact_name?: string | null;
    emergency_contact_phone?: string | null;
    profile_status?: string | null;
    // Add more fields as needed
  } | null;
  open: boolean;
  onClose: () => void;
}

/**
 * UserProfileModal
 * @description Function
 */
export const UserProfileModal: React.FC<UserModalProps> = ({ user, open, onClose }) => {
  // Fetch verification logs and sponsor allocations for the user
  const verificationData = useUserVerificationLogs(user?.id);
  const allocationData = useSponsorAllocations(user?.id);

  const logs = verificationData?.logs || [];
  const logsLoading = verificationData?.loading || false;
  const allocations = allocationData?.allocations || [];
  const allocationsLoading = allocationData?.loading || false;

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              {user.full_name || 'Unnamed User'}
              {user.id_verified ? (
                <Badge className="bg-green-100 text-green-800 ml-2">
                  <ShieldCheck className="h-4 w-4 mr-1" /> Verified
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 ml-2">
                  <X className="h-4 w-4 mr-1" /> Not verified
                </Badge>
              )}
            </div>
            <div className="text-xs font-mono text-blue-700">
              Tracking ID: {user.tracking_id || 'N/A'}
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left Column */}
          <div className="space-y-4">
            {/* User Info Card */}
            <Card>
              <CardHead>
                <CardHeaderTitle>User Information</CardHeaderTitle>
              </CardHead>
              <CardContent className="space-y-2 !pb-2">
                <div>
                  <span className="font-semibold">Name:</span> {user.full_name || 'N/A'}
                </div>
                <div>
                  <span className="font-semibold">Email:</span> {user.email || 'N/A'}
                </div>
                <div>
                  <span className="font-semibold">Phone:</span> {user.phone_number || 'N/A'}
                </div>
                <div>
                  <span className="font-semibold">Profile Status:</span>{' '}
                  {user.profile_status || 'N/A'}
                </div>
                <div>
                  <span className="font-semibold">Emergency Contact:</span>{' '}
                  {user.emergency_contact_name
                    ? `${user.emergency_contact_name} (${user.emergency_contact_phone || 'N/A'})`
                    : 'N/A'}
                </div>
              </CardContent>
            </Card>

            {/* Verification History Card */}
            <Card>
              <CardHead>
                <CardHeaderTitle>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" /> Verification History
                  </div>
                </CardHeaderTitle>
              </CardHead>
              <CardContent className="pb-2">
                {logsLoading ? (
                  <div className="text-muted-foreground">Loading verification history...</div>
                ) : logs.length === 0 ? (
                  <div className="text-muted-foreground">
                    <Clock className="inline h-4 w-4 mr-1" />
                    No verification history found.
                  </div>
                ) : (
                  <ul className="space-y-1">
                    {logs.map((log: unknown) => (
                      <li key={log.id} className="border-b py-1">
                        <span className="font-semibold">
                          {log.created_at
                            ? new Date(log.created_at).toLocaleDateString()
                            : 'Unknown Date'}
                        </span>
                        <span className="ml-2 text-xs text-gray-500">
                          [{log.verification_method || 'manual'}]
                        </span>
                        <span className="ml-2">
                          Result:{' '}
                          <span
                            className={log.result === 'success' ? 'text-green-700' : 'text-red-700'}
                          >
                            {log.result}
                          </span>
                        </span>
                        {log.national_id_last4 && (
                          <span className="ml-2 text-xs text-gray-400">
                            (ID: ••••{log.national_id_last4})
                          </span>
                        )}
                        {log.error_message && (
                          <span className="block text-xs text-red-500">
                            Error: {log.error_message}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            {/* Sponsor Allocation Status Card */}
            <Card>
              <CardHead>
                <CardHeaderTitle>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" /> Sponsor Allocation Status
                  </div>
                </CardHeaderTitle>
              </CardHead>
              <CardContent className="pb-2">
                {allocationsLoading ? (
                  <div className="text-muted-foreground">Loading sponsor allocation...</div>
                ) : allocations.length === 0 ? (
                  <div className="text-muted-foreground">
                    <ShieldCheck className="inline h-4 w-4 mr-1" />
                    No sponsor allocations recorded.
                  </div>
                ) : (
                  <ul className="space-y-1">
                    {allocations.map((a: unknown) => (
                      <li key={a.id} className="border-b py-1">
                        <span className="font-semibold">{a.plan}</span>
                        <span className="ml-2 text-xs text-gray-500">({a.status})</span>
                        <span className="ml-2">
                          Allocated: {new Date(a.allocated_on).toLocaleDateString()}
                        </span>
                        {a.expires_on && (
                          <span className="ml-2">
                            Expires: {new Date(a.expires_on).toLocaleDateString()}
                          </span>
                        )}
                        {a.notes && (
                          <span className="block text-xs text-gray-500">Notes: {a.notes}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Audit Trail */}
          <div>
            <AuditTrail
              targetId={user.id}
              targetType="user"
              title="Admin Action History"
              limit={50}
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button className="btn btn-sm btn-outline mt-2" onClick={onClose}>
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
