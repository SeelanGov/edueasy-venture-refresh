import React, { useState, useEffect } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { UserCheck, UserPlus } from 'lucide-react';
import { SecurityBadge } from '@/components/ui/SecurityBadge';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { SecurityInfoPanel } from '@/components/ui/SecurityInfoPanel';
import { logError } from '@/utils/logging';
import { parseError } from '@/utils/errorHandler';

// Mock data interfaces
interface Post {
  id: number;
  title: string;
  preview: string;
  date: string;
}

interface UserProfile {
  id: string;
  name: string;
  bio: string;
  avatar: string;
  followers: number;
  following: number;
  posts: Post[];
  verified?: boolean; // Add verified property
}

/**
 * UserProfileCard
 * @description Function
 */
export const UserProfileCard = (): void => {
  const [isFollowing, toggleFollowing] = useState(false);
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const mockUserData: UserProfile = {
          id: 'user123',
          name: 'Alex Johnson',
          bio: 'Software engineer passionate about React and TypeScript. Love building user interfaces and solving complex problems.',
          avatar: '/images/user-photos/alex-johnson.webp',
          followers: 1245,
          following: 867,
          posts: [
            {
              id: 1,
              title: 'Understanding React Hooks',
              preview: 'A deep dive into useState, useEffect, and custom hooks...',
              date: '2024-06-01',
            },
            {
              id: 2,
              title: 'TypeScript Tips',
              preview: 'How to write safer, cleaner code with TypeScript.',
              date: '2024-05-28',
            },
          ],
          verified: true,
        };
        setProfileData(mockUserData);
        setLoading(false);
      } catch (err) {
        const parsed = parseError(err);
        logError(parsed);
        setError(parsed.message);
        setLoading(false);
      }
    };
    fetchProfileData();
  }, []);

  const handleFollowToggle = (): void => {
    toggleFollowing((prev) => !prev);
  };

  return (
    <Card className="max-w-md mx-auto shadow-lg mt-5 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
      <SecurityInfoPanel badgeType="privacy" />
      {loading && <div className="p-8 text-center">Loading profile...</div>}
      {error && (
        <div className="text-red-500 p-4 text-center" role="alert" aria-live="assertive">
          {error}
        </div>
      )}
      {profileData && !loading && (
        <>
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar
              className="h-16 w-16 ring-2 ring-primary ring-offset-2"
              aria-label={`Profile picture of ${profileData.name}`}
            >
              <AvatarImage src={profileData.avatar} alt={profileData.name} />
              <AvatarFallback>{profileData.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <span data-testid="profile-name">{profileData.name}</span>
                {profileData.verified ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span tabIndex={0} aria-label="Privacy badge" className="outline-none">
                        <SecurityBadge type="privacy" size="sm" showLabel={false} />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>Privacy Verified</TooltipContent>
                  </Tooltip>
                ) : null}
              </h2>
              <div className="flex items-center gap-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
                <span>
                  <strong>{profileData.followers}</strong> Followers
                </span>
                <span>
                  <strong>{profileData.following}</strong> Following
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex items-start gap-2">
              <p className="text-gray-600 dark:text-gray-300 flex-1" id="user-bio">
                {profileData.bio}
              </p>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span tabIndex={0} aria-label="Data protection badge" className="outline-none">
                    <SecurityBadge type="data-protection" size="sm" showLabel={false} />
                  </span>
                </TooltipTrigger>
                <TooltipContent>Data Protection Enabled</TooltipContent>
              </Tooltip>
            </div>
            <div className="text-xs text-gray-400 dark:text-gray-500 mb-2" aria-live="polite">
              {profileData.bio ? profileData.bio.length : 0}/160 characters
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                Recent Posts
                {profileData.verified ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span tabIndex={0} aria-label="Verification badge" className="outline-none">
                        <SecurityBadge type="verification" size="sm" showLabel={false} />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>Account Verified</TooltipContent>
                  </Tooltip>
                ) : null}
              </h3>
              <div className="space-y-3">
                {profileData.posts.map((post) => (
                  <div key={post.id} className="bg-gray-50 dark:bg-zinc-800 p-3 rounded-md">
                    <div className="flex justify-between">
                      <h4 className="font-medium text-zinc-900 dark:text-zinc-100">{post.title}</h4>
                      <span className="text-xs text-gray-400">{post.date}</span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{post.preview}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="w-full"
                  onClick={handleFollowToggle}
                  variant={isFollowing ? 'outline' : 'default'}
                  aria-pressed={isFollowing}
                  aria-label={isFollowing ? 'Unfollow user' : 'Follow user'}
                >
                  {isFollowing ? (
                    <>
                      <UserCheck className="mr-2 h-4 w-4" />
                      Following
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Follow
                    </>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isFollowing ? 'Unfollow this user' : 'Follow this user to see updates'}
              </TooltipContent>
            </Tooltip>
          </CardFooter>
        </>
      )}
    </Card>
  );
};
