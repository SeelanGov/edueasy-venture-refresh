import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuditLogging } from '@/hooks/admin/useAuditLogging';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { exportToCsv } from '@/utils/exportToCsv';
import { Check, Download, X } from 'lucide-react';
import { useState } from 'react';
import { UserProfileModal } from './UserProfileModal';











interface DatabaseUser {
  id: string;
  created_at: string;
  full_name: string | null;
  id_number: string | null;
  email: string | null;
  phone_number: string | null;
  contact_email: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  profile_status: string | null;
  tracking_id: string | null;
  id_verified?: boolean | null;
}

type Props = {
  users: DatabaseUser[];
  trackingIdSearch: string;
  setTrackingIdSearch: (id: string) => void;
  refreshUsers?: () => void;
};

/**
 * UserManagementPanel
 * @description Function
 */
export function UserManagementPanel({
  users,
  trackingIdSearch,
  setTrackingIdSearch,
  refreshUsers,
}: any): JSX.Element {
  const [showOnlyVerified, setShowOnlyVerified] = useState<null | boolean>(null);
  const [exporting, setExporting] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const [profileUser, setProfileUser] = useState<DatabaseUser | null>(null);
  const { logAdminAction } = useAuditLogging();

  // Apply search, trackingId filter, and verification filter
  const filteredUsers = users.filter((userRec: any) => {
    const matchesTrackingId = trackingIdSearch
      ? (userRec.tracking_id || '').toLowerCase().includes(trackingIdSearch.toLowerCase())
      : true;
    const matchesSearch = searchText
      ? (userRec.full_name || '').toLowerCase().includes(searchText.toLowerCase()) ||
        (userRec.email || '').toLowerCase().includes(searchText.toLowerCase()) ||
        (userRec.contact_email || '').toLowerCase().includes(searchText.toLowerCase())
      : true;
    const matchesVerification =
      showOnlyVerified === null ? true : !!userRec.id_verified === showOnlyVerified;
    return matchesTrackingId && matchesSearch && matchesVerification;
  });

  // Manual verify toggle with audit logging
  async function handleToggleVerified(user: any) {
    const newStatus = !user.id_verified;
    const { error } = await supabase
      .from('users')
      .update({ id_verified: newStatus })
      .eq('id', user.id);

    if (error) {
      toast({
        title: 'Error',
        description: `Failed to update verification: ${error.message}`,
        variant: 'destructive',
      });
      return;
    }

    // Log admin action for audit trail
    try {
      await logAdminAction({
        action: newStatus ? 'USER_VERIFIED' : 'USER_UNVERIFIED',
        target_type: 'user',
        target_id: user.id,
        details: {
          user_name: user.full_name,
          tracking_id: user.tracking_id,
          previous_status: user.id_verified,
          new_status: newStatus,
        },
        reason: `Manual ${newStatus ? 'verification' : 'unverification'} by admin`,
      });
    } catch (auditError) {
      console.error('Failed to log admin action:', auditError);
      // Don't fail the main operation if audit logging fails
    }

    toast({
      title: 'Success',
      description: `User ${user.tracking_id || 'N/A'} marked as ${newStatus ? 'Verified' : 'Unverified'}`,
      variant: 'default',
    });
    if (refreshUsers) {
      refreshUsers();
    }
  }

  function handleExport() {
    setExporting(true);
    const toExport = filteredUsers.map((u: any) => ({
      TrackingID: u.tracking_id || '',
      Name: u.full_name || '',
      Email: u.email || u.contact_email || '',
      ProfileStatus: u.profile_status || '',
      VerificationStatus: u.id_verified ? 'Verified' : 'Unverified',
      Registered: new Date(u.created_at).toLocaleDateString(),
    }));
    exportToCsv(toExport, 'users-export.csv');
    setTimeout(() => setExporting(false), 500);
  }

  function handleOpenProfile(user: any) {
    setProfileUser(user);
    setOpenProfileModal(true);
  }

  function handleCloseProfile() {
    setOpenProfileModal(false);
    setProfileUser(null);
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>
            View, verify, and export users (search by tracking ID, name, or status)
          </CardDescription>
          <div className="mt-4 flex flex-col md:flex-row gap-2 items-start md:items-center">
            <input
              type="text"
              placeholder="Search Tracking ID..."
              value={trackingIdSearch}
              onChange={(e) => setTrackingIdSearch(e.target.value)}
              className="input input-bordered px-3 py-2 border rounded w-52" />
            <input
              type="text"
              placeholder="Search Name/Email..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="input input-bordered px-3 py-2 border rounded w-56" />
            <div className="flex gap-2 mt-2 md:mt-0">
              <Button
                type="button"
                size="sm"
                variant={showOnlyVerified === true ? 'default' : 'secondary'}
                onClick={() => setShowOnlyVerified(showOnlyVerified === true ? null : true)}
              >
                <Check className="h-4 w-4 mr-1" /> Verified
              </Button>
              <Button
                type="button"
                size="sm"
                variant={showOnlyVerified === false ? 'default' : 'secondary'}
                onClick={() => setShowOnlyVerified(showOnlyVerified === false ? null : false)}
              >
                <X className="h-4 w-4 mr-1" /> Unverified
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleExport}
                disabled={exporting}
                className="ml-4">
                <Download className="h-4 w-4 mr-1" /> Export CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((userData: any) => (
              <div
                key={userData.id}
                className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="font-medium flex items-center gap-2">
                    <span className="text-blue-700 font-mono">{userData.tracking_id || 'N/A'}</span>
                    {userData.id_verified ? (
                      <Badge variant="default" className="bg-green-100 text-green-800 px-2">
                        Verified
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 px-2">
                        Unverified
                      </Badge>
                    )}
                  </p>
                  <p className="text-sm text-gray-600 truncate">
                    {userData.full_name || 'No name provided'}
                  </p>
                  <p className="text-sm text-gray-600 truncate">
                    {userData.email || userData.contact_email}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    Profile: {userData.profile_status || 'incomplete'} • Reg:{' '}
                    {new Date(userData.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Button
                    size="sm"
                    variant={userData.id_verified ? 'secondary' : 'default'}
                    onClick={() => handleToggleVerified(userData)}
                    className={userData.id_verified ? 'border-green-300' : 'border-yellow-200'}
                  >
                    {userData.id_verified ? (
                      <X className="h-4 w-4 mr-1" />
                    ) : (
                      <Check className="h-4 w-4 mr-1" />
                    )}
                    {userData.id_verified ? 'Mark Unverified' : 'Mark Verified'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-2"
                    onClick={() => handleOpenProfile(userData)}
                  >
                    View Profile
                  </Button>
                </div>
              </div>
            ))}
            {filteredUsers.length === 0 && (
              <div className="py-6 text-center text-gray-500">
                No users found for the selected filters.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      <UserProfileModal user={profileUser} open={openProfileModal} onClose={handleCloseProfile} />
    </>
  );
}
