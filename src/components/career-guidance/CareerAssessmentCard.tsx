import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CareerGuidance, AssessmentType } from '@/types/RevenueTypes';
import { formatDistanceToNow } from 'date-fns';
import { FileText, Star, Calendar } from 'lucide-react';

interface CareerAssessmentCardProps {
  assessment: CareerGuidance;
  onView: (assessmentId: string) => void;
}

export function CareerAssessmentCard({ assessment, onView }: CareerAssessmentCardProps) {
  // Format the assessment date
  const formattedDate = formatDistanceToNow(new Date(assessment.assessment_date), {
    addSuffix: true,
  });

  // Get a human-readable assessment type
  const getAssessmentTypeLabel = (type: string): string => {
    switch (type) {
      case AssessmentType.PERSONALITY:
        return 'Personality Assessment';
      case AssessmentType.SKILLS:
        return 'Skills Assessment';
      case AssessmentType.INTERESTS:
        return 'Interests Assessment';
      case AssessmentType.CAREER_MATCH:
        return 'Career Match Assessment';
      case AssessmentType.COMPREHENSIVE:
        return 'Comprehensive Assessment';
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  // Get the top recommendations (if any)
  const getTopRecommendations = (): string[] => {
    if (!assessment.recommendations) return [];

    try {
      const recommendations =
        assessment.recommendations.careers || assessment.recommendations.paths || [];
      return Array.isArray(recommendations) ? recommendations.slice(0, 3) : [];
    } catch (e) {
      return [];
    }
  };

  const topRecommendations = getTopRecommendations();

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">
            {getAssessmentTypeLabel(assessment.assessment_type)}
          </CardTitle>
          {assessment.is_premium && (
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              Premium
            </Badge>
          )}
        </div>
        <CardDescription className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          {formattedDate}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2">
          {topRecommendations.length > 0 && (
            <div className="space-y-1">
              <p className="text-sm font-medium">Top Recommendations:</p>
              <div className="flex flex-wrap gap-1">
                {topRecommendations.map((rec, index) => (
                  <Badge key={index} variant="outline" className="bg-primary/10">
                    {rec}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <FileText className="h-4 w-4" />
            <span>{Object.keys(assessment.results).length} data points analyzed</span>
          </div>

          {assessment.is_premium && (
            <div className="flex items-center gap-1 text-sm text-amber-600">
              <Star className="h-4 w-4 fill-amber-500" />
              <span>Detailed premium insights available</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={() => onView(assessment.id)}>
          View Results
        </Button>
      </CardFooter>
    </Card>
  );
}
