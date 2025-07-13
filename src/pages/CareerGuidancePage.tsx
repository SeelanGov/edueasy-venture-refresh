import { PageLayout } from '@/components/layout/PageLayout';
import { PremiumFeature } from '@/components/subscription/PremiumFeature';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SubscriptionTierName } from '@/types/SubscriptionTypes';
import { BookOpen, Bot, TrendingUp, Users } from 'lucide-react';
import { useState } from 'react';

const CareerGuidancePage = () => {
  const [_activeTab, _setActiveTab] = useState('assessment');

  return (
    <PageLayout
      title="Career Guidance with Thandi"
      subtitle="Discover your career path with AI-powered assessments and personalized recommendations"
      gradient={true}
    >
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <Bot className="h-5 w-5 text-cap-teal" />
                Basic Guidance
              </CardTitle>
              <CardDescription className="text-gray-600">
                Available with Starter plan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Get basic career information and general guidance about different fields of study.
              </p>
              <Button variant="primary" className="w-full">
                Chat with Thandi
              </Button>
            </CardContent>
          </Card>

          <PremiumFeature
            title="Enhanced Career Assessment"
            description="Detailed career assessments with personalized recommendations"
            requiredTier={SubscriptionTierName.ESSENTIAL}
          >
            <Card className="shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <TrendingUp className="h-5 w-5 text-cap-teal" />
                  Career Assessment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Take comprehensive assessments to discover your ideal career path.
                </p>
                <Button variant="secondary" className="w-full">
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
            <Card className="shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <Users className="h-5 w-5 text-cap-teal" />
                  Expert Counseling
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Book sessions with career counselors for personalized guidance.
                </p>
                <Button variant="secondary" className="w-full">
                  Book Session
                </Button>
              </CardContent>
            </Card>
          </PremiumFeature>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="shadow-sm border border-gray-100">
            <CardHeader>
              <CardTitle className="text-gray-800">Career Resources</CardTitle>
              <CardDescription className="text-gray-600">
                Explore different career paths and requirements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-4 border border-gray-100 rounded-lg bg-gray-50">
                <BookOpen className="h-5 w-5 text-cap-teal" />
                <div>
                  <h4 className="font-medium text-gray-800">Study Guides</h4>
                  <p className="text-sm text-gray-600">Learn about different fields of study</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 border border-gray-100 rounded-lg bg-gray-50">
                <TrendingUp className="h-5 w-5 text-cap-teal" />
                <div>
                  <h4 className="font-medium text-gray-800">Career Trends</h4>
                  <p className="text-sm text-gray-600">Stay updated with industry trends</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border border-gray-100">
            <CardHeader>
              <CardTitle className="text-gray-800">Success Stories</CardTitle>
              <CardDescription className="text-gray-600">
                Learn from students who found their path
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border border-gray-100 rounded-lg bg-gray-50">
                  <p className="text-sm italic mb-2 text-gray-700">
                    "Thandi helped me discover my passion for engineering. The career assessment was
                    spot on!"
                  </p>
                  <p className="text-xs text-gray-600">- Sarah, UCT Engineering Student</p>
                </div>
                <div className="p-4 border border-gray-100 rounded-lg bg-gray-50">
                  <p className="text-sm italic mb-2 text-gray-700">
                    "The personalized recommendations helped me choose the right university and
                    program."
                  </p>
                  <p className="text-xs text-gray-600">- Michael, Wits Business Student</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default CareerGuidancePage;
