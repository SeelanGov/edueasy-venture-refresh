
import React from "react";
import { UserProfileCard } from "@/components/profile/UserProfileCard";

const ProfileDemo = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-center mb-8">User Profile Demo</h1>
        <UserProfileCard />
      </div>
    </div>
  );
};

export default ProfileDemo;
