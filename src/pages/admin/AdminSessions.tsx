
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, Users, Video } from 'lucide-react';

const AdminSessions = () => {
  return (
    <AdminLayout title="Sessions">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>1:1 Session Management</CardTitle>
            <CardDescription>Manage student counseling and guidance sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Session Management Coming Soon</h3>
              <p className="text-gray-500 mb-6">
                This feature will allow you to schedule and manage 1:1 guidance sessions with students.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="text-center p-6 border border-gray-200 rounded-lg">
                  <Clock className="h-8 w-8 mx-auto text-cap-teal mb-3" />
                  <h4 className="font-medium mb-2">Scheduling</h4>
                  <p className="text-sm text-gray-500">
                    Allow students to book available time slots
                  </p>
                </div>
                
                <div className="text-center p-6 border border-gray-200 rounded-lg">
                  <Video className="h-8 w-8 mx-auto text-cap-teal mb-3" />
                  <h4 className="font-medium mb-2">Video Calls</h4>
                  <p className="text-sm text-gray-500">
                    Integrated video conferencing for remote sessions
                  </p>
                </div>
                
                <div className="text-center p-6 border border-gray-200 rounded-lg">
                  <Users className="h-8 w-8 mx-auto text-cap-teal mb-3" />
                  <h4 className="font-medium mb-2">Counselor Management</h4>
                  <p className="text-sm text-gray-500">
                    Assign and manage guidance counselors
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminSessions;
