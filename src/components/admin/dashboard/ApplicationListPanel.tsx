import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge, mapStatusToBadgeVariant } from '@/components/ui/badge';
import { type UserSummary  } from '@/utils/admin/userLookup';




interface Application {
  id: string;
  user_id: string;
  university: string | null;
  program: string | null;
  status: string | null;
  created_at: string;
  grade12_results: string | null;
}

type Props = {
  applications: Application[];
  userMap?: Record<string, UserSummary>;
};

function getStatusBadge(status: string | null) {
  const badgeStatus = status || 'pending';
  return (
    <Badge variant={mapStatusToBadgeVariant(badgeStatus)}>
      {badgeStatus.charAt(0).toUpperCase() + badgeStatus.slice(1)}
    </Badge>
  );
}

/**
 * ApplicationListPanel
 * @description Function
 */
export function ApplicationListPanel({ applications, userMap }: any): JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Applications</CardTitle>
        <CardDescription>Review submitted applications</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {applications.map((app: any) => {
            const user = (userMap as any)?.[app.user_id];
            return (
              <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{app.university || 'University not specified'}</p>
                  <p className="text-sm text-gray-600">Program: {app.program || 'Not specified'}</p>
                  <p className="text-sm text-gray-600">
                    User Tracking ID:{' '}
                    <span className="text-blue-700 font-mono">
                      {user?.tracking_id || app.user_id}
                    </span>
                  </p>
                  {user?.full_name && (
                    <p className="text-xs text-gray-500 truncate">Name: {user.full_name}</p>
                  )}
                  <p className="text-sm text-gray-600">
                    Submitted: {new Date(app.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">{getStatusBadge(app.status)}</div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
