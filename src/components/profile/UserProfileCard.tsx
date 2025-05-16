import React, { useState, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { UserCheck, UserPlus } from "lucide-react";
import { SecurityBadge } from "@/components/ui/SecurityBadge";

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

export const UserProfileCard = () => {
  const [isFollowing, toggleFollowing] = useState(false);
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setTimeout(() => {
          const mockUserData: UserProfile = {
            id: "user123",
            name: "Alex Johnson",
            bio: "Software engineer passionate about React and TypeScript. Love building user interfaces and solving complex problems.",
            avatar: "https://i.pravatar.cc/150?img=3",
            followers: 1245,
            following: 867,
            posts: [
              {
                id: 1,
                title: "Understanding React Hooks",
                preview: "A deep dive into useState, useEffect, and custom hooks...",
                date: "2025-04-28"
              },
              {
                id: 2,
                title: "TypeScript Best Practices",
                preview: "Tips and tricks for writing maintainable TypeScript code...",
                date: "2025-04-22"
              },
              {
                id: 3,
                title: "Building Accessible UIs",
                preview: "Making your React applications accessible to everyone...",
                date: "2025-04-15"
              }
            ],
            verified: true, // Set to true for demo; toggle as needed
          };

          setProfileData(mockUserData);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError("Failed to load profile data");
        setLoading(false);
      }
    };

    fetchProfileData();

    const handleResize = () => {};
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleFollowToggle = () => {
    toggleFollowing((prev) => !prev);
  };

  return (
    <Card className="max-w-md mx-auto shadow-lg mt-5">
      {loading && <div className="p-8 text-center">Loading profile...</div>}
      {error && <div className="text-red-500 p-4 text-center">{error}</div>}
      {profileData && !loading && (
        <>
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={profileData.avatar} alt={profileData.name} />
              <AvatarFallback>{profileData.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                {profileData.name}
                {/* Show privacy badge only if verified */}
                {profileData.verified ? (
                  <SecurityBadge type="privacy" size="sm" showLabel={false} />
                ) : null}
              </h2>
              <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                <span><strong>{profileData.followers}</strong> Followers</span>
                <span><strong>{profileData.following}</strong> Following</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4 flex items-center gap-2">
              {profileData.bio}
              <SecurityBadge type="data-protection" size="sm" showLabel={false} />
            </p>
            <div>
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                Recent Posts
                {/* Show verification badge only if verified */}
                {profileData.verified ? (
                  <SecurityBadge type="verification" size="sm" showLabel={false} />
                ) : null}
              </h3>
              <div className="space-y-3">
                {profileData.posts.map(post => (
                  <div key={post.id} className="bg-gray-50 p-3 rounded-md">
                    <div className="flex justify-between">
                      <h4 className="font-medium">{post.title}</h4>
                      <span className="text-xs text-gray-400">{post.date}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{post.preview}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              onClick={handleFollowToggle}
              variant={isFollowing ? "outline" : "default"}
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
          </CardFooter>
        </>
      )}
    </Card>
  );
};
