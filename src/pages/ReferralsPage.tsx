import React from 'react';
import { ReferralDashboard } from '@/components/referrals/ReferralDashboard';

export default function ReferralsPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Referral Program</h1>
        <p className="text-muted-foreground">
          Refer friends to EduEasy and earn rewards
        </p>
      </div>
      
      <ReferralDashboard />
      
      <div className="space-y-4 mt-8">
        <h2 className="text-2xl font-bold">How It Works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="bg-primary/10 rounded-full w-8 h-8 flex items-center justify-center">
              <span className="font-bold">1</span>
            </div>
            <h3 className="font-semibold">Share Your Code</h3>
            <p className="text-muted-foreground">
              Share your unique referral code with friends and family.
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="bg-primary/10 rounded-full w-8 h-8 flex items-center justify-center">
              <span className="font-bold">2</span>
            </div>
            <h3 className="font-semibold">They Sign Up</h3>
            <p className="text-muted-foreground">
              When they register using your code, they'll be linked to your account.
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="bg-primary/10 rounded-full w-8 h-8 flex items-center justify-center">
              <span className="font-bold">3</span>
            </div>
            <h3 className="font-semibold">Earn Rewards</h3>
            <p className="text-muted-foreground">
              Once they subscribe to a paid plan, you'll receive R50 in credit.
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-muted p-6 rounded-lg mt-8">
        <h2 className="text-xl font-bold mb-4">Referral Program Terms</h2>
        <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
          <li>Referral rewards are issued when your referred friend subscribes to a paid plan.</li>
          <li>You can refer an unlimited number of friends.</li>
          <li>Referral credits can be used towards your subscription or other EduEasy services.</li>
          <li>Referral credits expire after 12 months if unused.</li>
          <li>EduEasy reserves the right to modify or terminate the referral program at any time.</li>
          <li>Abuse of the referral program, including self-referrals, may result in disqualification.</li>
        </ul>
      </div>
    </div>
  );
}