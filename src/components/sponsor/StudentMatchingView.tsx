import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
  GraduationCap,
  RefreshCw,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';

/**
 * StudentMatchingView
 * @description Function
 */
export const StudentMatchingView = (): void => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [_loading, _setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      checkMigrationStatus();
    }
  }, [user]);

  const checkMigrationStatus = (): void => {
    console.log('Database migration required for sponsor matching system');
    toast({
      title: 'Migration Required',
      description: 'The sponsor matching system requires database migration to function properly.',
      variant: 'destructive',
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Sponsor Matches</h2>
          <p className="text-gray-600 mt-1">Find sponsors who match your profile and needs</p>
        </div>
        <Button onClick={checkMigrationStatus} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Check Status
        </Button>
      </div>

      {/* Migration Status Alert */}
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <CardTitle className="text-orange-800">Migration Required</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-orange-700 mb-4">
            The sponsor matching system is currently unavailable as it requires database migration
            to create the necessary tables for matching functionality.
          </p>
          <div className="space-y-2 text-sm text-orange-600">
            <p>• Missing table: sponsor_profiles</p>
            <p>• Missing table: student_profiles</p>
            <p>• Missing table: sponsor_matching_results</p>
          </div>
          <p className="text-orange-700 mt-4">
            Please apply the database migration to enable sponsor matching features.
          </p>
        </CardContent>
      </Card>

      {/* Placeholder Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="opacity-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Matches</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">Available after migration</p>
          </CardContent>
        </Card>

        <Card className="opacity-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--%</div>
            <p className="text-xs text-muted-foreground">Match quality</p>
          </CardContent>
        </Card>

        <Card className="opacity-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Confidence</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">--</div>
            <p className="text-xs text-muted-foreground">Excellent matches</p>
          </CardContent>
        </Card>

        <Card className="opacity-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Medium Confidence</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">--</div>
            <p className="text-xs text-muted-foreground">Good matches</p>
          </CardContent>
        </Card>

        <Card className="opacity-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Confidence</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">--</div>
            <p className="text-xs text-muted-foreground">Basic matches</p>
          </CardContent>
        </Card>
      </div>

      {/* Placeholder Content */}
      <Card className="opacity-50">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Sponsor Matching (Coming Soon)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <GraduationCap className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">Sponsor Matching System</h3>
            <p className="max-w-md mx-auto">
              Once the database migration is applied, you'll be able to discover sponsors that match
              your academic profile, interests, and funding needs.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
