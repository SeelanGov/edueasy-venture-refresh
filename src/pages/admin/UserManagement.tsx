import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { useAdminRole } from '@/hooks/useAdminRole';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Building2, Heart, Shield, UserCheck, Users } from 'lucide-react';
import { useEffect } from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface UserWithRole {
  id: string;
  email: string | null;
  full_name: string | null;
  user_type: string | null;
  created_at: string;
  roles: string[];
}

const UserTypeIcons = {
  admin: Shield,
  consultant: UserCheck,
  institution: Building2,
  sponsor: Heart,
  student: Users,
};

const UserTypeBadgeColors = {
  admin: 'destructive',
  consultant: 'secondary',
  institution: 'default',
  sponsor: 'outline',
  student: 'default',
} as const;

export default function UserManagement() {
  const { user } = useAuth();
  const { isAdmin } = useAdminRole();
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdmin) return;
    fetchUsers();
  }, [isAdmin]);

  const fetchUsers = async () => {
    try {
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id, email, full_name, user_type, created_at')
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;

      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      const usersWithRoles = usersData.map((user) => ({
        ...user,
        roles: rolesData.filter((role) => role.user_id === user.id).map((r) => r.role),
      }));

      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch users',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserType = async (userId: string, newUserType: string) => {
    if (userId === user?.id && newUserType !== 'admin') {
      toast({
        title: 'Error',
        description: 'Cannot remove admin privileges from yourself',
        variant: 'destructive',
      });
      return;
    }

    setUpdating(userId);
    try {
      const { error } = await supabase.rpc('assign_user_role', {
        p_user_id: userId,
        p_user_type: newUserType,
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'User role updated successfully',
      });

      fetchUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user role',
        variant: 'destructive',
      });
    } finally {
      setUpdating(null);
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Access denied. Admin privileges required.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground">Manage user roles and permissions</p>
      </div>

      <div className="grid gap-4">
        {users.map((userData) => {
          const IconComponent =
            UserTypeIcons[userData.user_type as keyof typeof UserTypeIcons] || Users;
          const badgeColor =
            UserTypeBadgeColors[userData.user_type as keyof typeof UserTypeBadgeColors] ||
            'default';

          return (
            <Card key={userData.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <IconComponent className="h-5 w-5" />
                    <div>
                      <CardTitle className="text-lg">{userData.full_name || 'No name'}</CardTitle>
                      <p className="text-sm text-muted-foreground">{userData.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={badgeColor}>{userData.user_type || 'student'}</Badge>
                    {userData.roles.map((role) => (
                      <Badge key={role} variant="outline">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Joined: {new Date(userData.created_at).toLocaleDateString()}
                  </p>
                  <div className="flex items-center gap-2">
                    <Select
                      value={userData.user_type || 'student'}
                      onValueChange={(value) => updateUserType(userData.id, value)}
                      disabled={updating === userData.id}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="consultant">Consultant</SelectItem>
                        <SelectItem value="institution">Institution</SelectItem>
                        <SelectItem value="sponsor">Sponsor</SelectItem>
                        <SelectItem value="nsfas">NSFAS</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    {updating === userData.id && (
                      <Button size="sm" disabled>
                        Updating...
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
