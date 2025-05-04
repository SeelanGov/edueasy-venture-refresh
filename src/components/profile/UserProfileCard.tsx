
import React, { useState, useEffect, useRef } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserCheck, UserPlus } from "lucide-react";

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
  followers: string; // Bug #4: Should be number but using string
  following: number;
  posts: Post[];
}

export const UserProfileCard = () => {
  // Bug #3: Initial state should be false, but we set it inconsistently
  const [isFollowing, toggleFollowing] = useState(false);
  // Bug #2: This state will cause infinite re-renders when updated in useEffect
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Reference for event listener (part of Bug #1)
  const eventListenerRef = useRef<any>(null);
  
  // Bug #1: Memory leak in useEffect - no cleanup function
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // Simulate API call
        setTimeout(() => {
          const mockUserData: UserProfile = {
            id: "user123",
            name: "Alex Johnson",
            bio: "Software engineer passionate about React and TypeScript. Love building user interfaces and solving complex problems.",
            avatar: "https://i.pravatar.cc/150?img=3",
            followers: "1245", // Bug #4: String instead of number
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
            ]
          };
          
          setProfileData(mockUserData);
          setLoading(false);
          
          // Bug #2: This will trigger an infinite re-render
          if (mockUserData) {
            setProfileData({...mockUserData});
          }
        }, 1000);
      } catch (err) {
        // Bug #6: Improper error handling - not setting a specific error message
        setError("Error");
        setLoading(false);
      }
    };
    
    fetchProfileData();
    
    // Bug #1: Adding event listener without cleanup
    eventListenerRef.current = () => console.log("Window resized");
    window.addEventListener("resize", eventListenerRef.current);
    
    // Missing cleanup function that should be:
    // return () => {
    //   window.removeEventListener("resize", eventListenerRef.current);
    // };
  }, [profileData]); // Bug #2: This dependency should not include profileData
  
  const handleFollowToggle = () => {
    // Bug #3: Incorrect state management - not using prev state
    toggleFollowing(!isFollowing);
    toggleFollowing(!isFollowing); // This will cancel out the first toggle
  };
  
  // Bug #8: CSS styling issues - using margin-top instead of mt in Tailwind
  return (
    <Card className="max-w-md mx-auto shadow-lg" style={{ marginTop: "20px" }}>
      {/* Bug #7: Incorrect conditional rendering - should check loading first */}
      {error && <div className="text-red-500 p-4 text-center">{error}</div>}
      {profileData && !loading && (
        <>
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={profileData.avatar} alt={profileData.name} />
              <AvatarFallback>{profileData.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{profileData.name}</h2>
              <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                <span><strong>{profileData.followers}</strong> Followers</span>
                <span><strong>{profileData.following}</strong> Following</span>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <p className="text-gray-600 mb-4">{profileData.bio}</p>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">Recent Posts</h3>
              <div className="space-y-3">
                {/* Bug #5: Missing key prop */}
                {profileData.posts.map(post => (
                  <div className="bg-gray-50 p-3 rounded-md">
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
      {/* Bug #7: Loading state should come first, but we're loading it after content */}
      {loading && <div className="p-8 text-center">Loading profile...</div>}
    </Card>
  );
};
