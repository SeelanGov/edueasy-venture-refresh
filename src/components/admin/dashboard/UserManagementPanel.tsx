
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
};

export function UserManagementPanel({ users, trackingIdSearch, setTrackingIdSearch }: Props) {
  const filteredUsers = users.filter((userRec) =>
    trackingIdSearch
      ? (userRec.tracking_id || '').toLowerCase().includes(trackingIdSearch.toLowerCase())
      : true
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <CardDescription>View and manage registered users (search by tracking ID)</CardDescription>
        <div className="mt-4">
          <input
            type="text"
            placeholder="Search Tracking ID..."
            value={trackingIdSearch}
            onChange={e => setTrackingIdSearch(e.target.value)}
            className="input input-bordered px-3 py-2 border rounded w-72"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredUsers.map((userData) => (
            <div key={userData.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <p className="font-medium">Tracking ID: <span className="text-blue-700 font-mono">{userData.tracking_id || "N/A"}</span></p>
                <p className="text-sm text-gray-600">{userData.full_name || 'No name provided'}</p>
                <p className="text-sm text-gray-600">{userData.email || userData.contact_email}</p>
                <p className="text-xs text-gray-400">User UUID: {userData.id}</p>
                <p className="text-sm text-gray-600">
                  Registered: {new Date(userData.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <Badge variant={userData.profile_status === 'complete' ? 'default' : 'secondary'}>
                  {userData.profile_status || 'incomplete'}
                </Badge>
                <Badge variant={userData.id_verified ? 'default' : 'secondary'} className={userData.id_verified ? 'bg-green-200 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                  {userData.id_verified ? 'Verified' : 'Unverified'}
                </Badge>
              </div>
            </div>
          ))}
          {filteredUsers.length === 0 && (
            <div className="py-6 text-center text-gray-500">No users found for this tracking ID.</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
