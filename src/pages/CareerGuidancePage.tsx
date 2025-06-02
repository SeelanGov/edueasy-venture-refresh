import React, { useState } from 'react';
import { useCareerGuidance, AssessmentType } from '@/hooks/useCareerGuidance';
import { useSubscription } from '@/hooks/useSubscription';
import { CareerAssessmentCard } from '@/components/career-guidance/CareerAssessmentCard';
import { PremiumFeature } from '@/components/subscription/PremiumFeature';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { SubscriptionTierName } from '@/types/SubscriptionTypes';
import { Lightbulb, BookOpen, Brain, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CareerGuidancePage() {
  const { assessments, guidance, loading, createAssessment, fetchAssessment } = useCareerGuidance();
  const { userSubscription } = useSubscription();
  const navigate = useNavigate();

  const [selectedGuidanceId, setSelectedGuidanceId] = useState<string | null>(null);
  const [showAssessmentDialog, setShowAssessmentDialog] = useState(false);

  // Handle viewing guidance results
  const handleViewAssessment = async (assessmentId: string) => {
    // Find the guidance record associated with this assessment
    const guidanceRecord = guidance.find(g => g.assessment_id === assessmentId);
    if (guidanceRecord) {
      setSelectedGuidanceId(guidanceRecord.id);
      setShowAssessmentDialog(true);
    }
  };

  // Start a new assessment (this would be a placeholder for now)
  const startNewAssessment = async (assessmentType: AssessmentType) => {
    // In a real implementation, this would start an actual assessment
    // For now, we'll just create a mock assessment with sample data

    const isPremium =
      assessmentType === AssessmentType.COMPREHENSIVE ||
      assessmentType === AssessmentType.CAREER_MATCH;

    // Check if user has premium access for premium assessments
    if (isPremium) {
      const hasPremiumAccess = userSubscription?.tier?.name === SubscriptionTierName.PREMIUM;
      if (!hasPremiumAccess) {
        navigate('/subscription');
        return;
      }
    }

    // Mock assessment results
    const mockResults = {
      scores: {
        analytical: Math.floor(Math.random() * 100),
        creative: Math.floor(Math.random() * 100),
        practical: Math.floor(Math.random() * 100),
        social: Math.floor(Math.random() * 100),
        enterprising: Math.floor(Math.random() * 100),
        conventional: Math.floor(Math.random() * 100),
      },
      strengths: ['Problem Solving', 'Critical Thinking', 'Communication'],
      areas_for_improvement: ['Time Management', 'Public Speaking'],
    };

    // Mock recommendations
    const mockRecommendations = {
      careers: ['Software Developer', 'Data Analyst', 'Project Manager', 'UX Designer'],
      education: ['Computer Science', 'Information Systems', 'Business Analytics'],
      skills: ['Programming', 'Data Analysis', 'Project Management'],
    };

    // Create the assessment and guidance
    const newGuidance = await createAssessment(
      assessmentType,
      mockResults,
      mockRecommendations,
      isPremium
    );

    if (newGuidance) {
      setSelectedGuidanceId(newGuidance.id);
      setShowAssessmentDialog(true);
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Career Guidance</h1>
        <p className="text-muted-foreground">
          Discover your career path with personalized assessments and guidance
        </p>
      </div>

      <Tabs defaultValue="assessments" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="assessments">Your Assessments</TabsTrigger>
          <TabsTrigger value="new">Start New Assessment</TabsTrigger>
        </TabsList>

        <TabsContent value="assessments" className="mt-6">
          {assessments.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No assessments yet</h3>
                  <p className="text-muted-foreground mt-2">
                    Take your first career assessment to get personalized guidance.
                  </p>
                  <Button
                    className="mt-4"
                    onClick={() =>
                      (document.querySelector('[data-value="new"]') as HTMLElement)?.click()
                    }
                  >
                    Start Assessment
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assessments.map((assessment) => (
                <CareerAssessmentCard
                  key={assessment.id}
                  assessment={assessment}
                  onView={handleViewAssessment}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="new" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  Personality Assessment
                </CardTitle>
                <CardDescription>
                  Understand your personality traits and how they align with different careers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  This assessment analyzes your personality traits, preferences, and work style to
                  suggest careers that match your natural tendencies.
                </p>
                <ul className="mt-4 space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>15-20 minutes to complete</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>Personality profile report</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>Career suggestions based on personality</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={() => startNewAssessment(AssessmentType.PERSONALITY)}
                >
                  Start Assessment
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  Skills Assessment
                </CardTitle>
                <CardDescription>
                  Identify your strengths and skills to find suitable career paths
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  This assessment evaluates your skills, abilities, and competencies to identify
                  your strengths and suggest careers where you can excel.
                </p>
                <ul className="mt-4 space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>10-15 minutes to complete</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>Skills profile with strengths and areas for growth</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>Career recommendations based on skills</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={() => startNewAssessment(AssessmentType.SKILLS)}
                >
                  Start Assessment
                </Button>
              </CardFooter>
            </Card>

            <PremiumFeature
              title="Career Match Assessment"
              description="Get matched with specific careers based on your profile"
              requiredTier={SubscriptionTierName.STANDARD}
              showPreview={true}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ArrowRight className="h-5 w-5 text-primary" />
                    Career Match Assessment
                  </CardTitle>
                  <CardDescription>
                    Get matched with specific careers based on your comprehensive profile
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    This premium assessment combines multiple factors to match you with specific
                    careers and provides detailed insights into each option.
                  </p>
                  <ul className="mt-4 space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <span>20-25 minutes to complete</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <span>Detailed career matches with compatibility scores</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <span>Education and training recommendations</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={() => startNewAssessment(AssessmentType.CAREER_MATCH)}
                  >
                    Start Assessment
                  </Button>
                </CardFooter>
              </Card>
            </PremiumFeature>

            <PremiumFeature
              title="Comprehensive Assessment"
              description="Our most detailed assessment for in-depth career guidance"
              requiredTier={SubscriptionTierName.PREMIUM}
              showPreview={true}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Comprehensive Assessment
                  </CardTitle>
                  <CardDescription>
                    Our most detailed assessment for in-depth career guidance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    This premium assessment provides the most comprehensive analysis of your
                    personality, skills, interests, and values for detailed career planning.
                  </p>
                  <ul className="mt-4 space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <span>30-40 minutes to complete</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <span>Comprehensive profile across multiple dimensions</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <span>Personalized career path planning</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <span>Access to career consultant booking</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={() => startNewAssessment(AssessmentType.COMPREHENSIVE)}
                  >
                    Start Assessment
                  </Button>
                </CardFooter>
              </Card>
            </PremiumFeature>
          </div>

          <Alert className="mt-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>About Our Assessments</AlertTitle>
            <AlertDescription>
              These assessments are designed to provide guidance but should not be considered
              definitive. For personalized advice, consider booking a consultation with one of our
              career experts.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>

      {/* Assessment Results Dialog */}
      <Dialog open={showAssessmentDialog} onOpenChange={setShowAssessmentDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Assessment Results</DialogTitle>
            <DialogDescription>
              Your personalized career guidance based on your assessment
            </DialogDescription>
          </DialogHeader>

          {/* This would be replaced with actual assessment results */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Your Strengths</h3>
              <Separator className="my-2" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded-md">
                  <p className="font-medium">Problem Solving</p>
                  <p className="text-sm text-muted-foreground">
                    You excel at analyzing complex problems and finding solutions.
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-md">
                  <p className="font-medium">Critical Thinking</p>
                  <p className="text-sm text-muted-foreground">
                    You have strong analytical skills and logical reasoning.
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-md">
                  <p className="font-medium">Communication</p>
                  <p className="text-sm text-muted-foreground">
                    You communicate ideas clearly and effectively.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium">Recommended Careers</h3>
              <Separator className="my-2" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Software Developer</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Your analytical skills and problem-solving abilities make you well-suited for
                      software development.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Data Analyst</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Your critical thinking and attention to detail align well with data analysis
                      roles.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Project Manager</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Your communication skills and organizational abilities make project management
                      a good fit.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">UX Designer</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Your creativity combined with analytical thinking suits user experience
                      design.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setShowAssessmentDialog(false)}>
                Close
              </Button>
              <Button onClick={() => navigate('/consultations')}>Book a Consultation</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
