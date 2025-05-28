import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Spinner } from '@/components/Spinner';
import { DashboardLayoutWithThandi } from '@/components/DashboardLayoutWithThandi';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { ProfileForm } from '@/components/profile/ProfileForm';

const UserProfile = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    email: '',
    fullName: '',
    idNumber: '',
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase.from('users').select('*').eq('id', user.id).single();

        if (error) {
          throw error;
        }

        if (data) {
          setProfileData({
            email: user.email || '',
            fullName: data.full_name || '',
            idNumber: data.id_number || '',
          });
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        toast({
          title: 'Error fetching profile',
          description: 'Failed to load your profile data.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  return (
    <DashboardLayoutWithThandi>
      <div className="container mx-auto max-w-3xl py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <ProfileForm user={user} initialData={profileData} />
          </div>
        )}
      </div>
    </DashboardLayoutWithThandi>
  );
};

export default UserProfile;
