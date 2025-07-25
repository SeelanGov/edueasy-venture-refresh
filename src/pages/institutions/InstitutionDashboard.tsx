import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Users, BookOpen, BarChart3 } from 'lucide-react';

const InstitutionDashboard = (): void => {
  return (
    <PageLayout title="Institution Dashboard" showBackButton={false}>
      <div className="space-y-6">
        {/* Welcome Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Welcome to your Institution Dashboard
            </CardTitle>
            <CardDescription>
              Manage your programs, view applications, and track student progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This dashboard is currently under development. Full institution management features
              will be available soon.
            </p>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Programs</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <p className="text-xs text-muted-foreground">Coming soon</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Applications</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <p className="text-xs text-muted-foreground">Coming soon</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Analytics</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <p className="text-xs text-muted-foreground">Coming soon</p>
            </CardContent>
          </Card>
        </div>

        {/* Action Items */}
        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>
              Set up your institution profile and start managing applications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Next Steps:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Complete your institution profile</li>
                <li>Add your academic programs</li>
                <li>Configure application requirements</li>
                <li>Set up admission criteria</li>
              </ul>
            </div>
            <Button disabled>Complete Setup (Coming Soon)</Button>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default InstitutionDashboard;
