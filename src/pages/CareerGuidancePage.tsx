
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PremiumFeature } from '@/components/subscription/PremiumFeature';
import { SubscriptionTierName } from '@/types/SubscriptionTypes';
import { Bot, TrendingUp, Users, BookOpen } from 'lucide-react';

const CareerGuidancePage = () => {
  const [activeTab, setActiveTab] = useState('assessment');

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Career Guidance with Thandi</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover your career path with AI-powered assessments and personalized recommendations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Basic Guidance
            </CardTitle>
            <CardDescription>
              Available with Starter plan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Get basic career information and general guidance about different fields of study.
            </p>
            <Button className="w-full">
              Chat with Thandi
            </Button>
          </CardContent>
        </Card>

        <PremiumFeature
          title="Enhanced Career Assessment"
          description="Detailed career assessments with personalized recommendations"
          requiredTier={SubscriptionTierName.ESSENTIAL}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Career Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Take comprehensive assessments to discover your ideal career path.
              </p>
              <Button className="w-full">
                Start Assessment
              </Button>
            </CardContent>
          </Card>
        </PremiumFeature>

        <PremiumFeature
          title="Advanced Career Counseling"
          description="One-on-one sessions with career experts"
          requiredTier={SubscriptionTierName.PRO_AI}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Expert Counseling
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Book sessions with career counselors for personalized guidance.
              </p>
              <Button className="w-full">
                Book Session
              </Button>
            </CardContent>
          </Card>
        </PremiumFeature>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Career Resources</CardTitle>
            <CardDescription>
              Explore different career paths and requirements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <BookOpen className="h-5 w-5" />
              <div>
                <h4 className="font-medium">Study Guides</h4>
                <p className="text-sm text-muted-foreground">
                  Learn about different fields of study
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <TrendingUp className="h-5 w-5" />
              <div>
                <h4 className="font-medium">Career Trends</h4>
                <p className="text-sm text-muted-foreground">
                  Stay updated with industry trends
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Success Stories</CardTitle>
            <CardDescription>
              Learn from students who found their path
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <p className="text-sm italic mb-2">
                  "Thandi helped me discover my passion for engineering. The career assessment was spot on!"
                </p>
                <p className="text-xs text-muted-foreground">- Sarah, UCT Engineering Student</p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm italic mb-2">
                  "The personalized recommendations helped me choose the right university and program."
                </p>
                <p className="text-xs text-muted-foreground">- Michael, Wits Business Student</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CareerGuidancePage;
