
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PremiumFeature } from '@/components/subscription/PremiumFeature';
import { SubscriptionTierName } from '@/types/SubscriptionTypes';
import { Calendar, Clock, Video, Users, Star } from 'lucide-react';

const ConsultationsPage = () => {
  const [selectedSession, setSelectedSession] = useState<string | null>(null);

  const sessionTypes = [
    {
      id: 'career-guidance',
      title: 'Career Guidance Session',
      duration: '45 minutes',
      price: 'R600',
      description: 'One-on-one career counseling with our experts',
      features: [
        'Personalized career assessment',
        'University program recommendations',
        'Study path planning',
        'Career roadmap creation'
      ]
    },
    {
      id: 'application-review',
      title: 'Application Review',
      duration: '30 minutes',
      price: 'R400',
      description: 'Get your applications reviewed by admission experts',
      features: [
        'Document review and feedback',
        'Application strategy optimization',
        'Interview preparation tips',
        'Deadline management guidance'
      ]
    },
    {
      id: 'interview-prep',
      title: 'Interview Preparation',
      duration: '60 minutes',
      price: 'R750',
      description: 'Practice interviews with experienced professionals',
      features: [
        'Mock interview sessions',
        'Question and answer practice',
        'Communication skills training',
        'Confidence building techniques'
      ]
    }
  ];

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Expert Consultations</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Book one-on-one sessions with our education and career experts
        </p>
      </div>

      <PremiumFeature
        title="Expert Consultations"
        description="Available for Essential and Pro + AI subscribers"
        requiredTier={SubscriptionTierName.ESSENTIAL}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessionTypes.map((session) => (
            <Card key={session.id} className="relative">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{session.title}</CardTitle>
                  <Badge variant="secondary">{session.price}</Badge>
                </div>
                <CardDescription className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {session.duration}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {session.description}
                </p>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">What's included:</h4>
                  <ul className="space-y-1">
                    {session.features.map((feature, index) => (
                      <li key={index} className="text-xs text-muted-foreground flex items-center gap-2">
                        <Star className="h-3 w-3" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <Button 
                  className="w-full"
                  onClick={() => setSelectedSession(session.id)}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Session
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </PremiumFeature>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Our Experts
            </CardTitle>
            <CardDescription>
              Meet our team of education and career professionals
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-medium">Dr. Sarah Johannesburg</h4>
                <p className="text-sm text-muted-foreground">Career Counselor, 15+ years experience</p>
                <div className="flex items-center gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-3 w-3 fill-current text-yellow-500" />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-medium">Prof. Michael Cape Town</h4>
                <p className="text-sm text-muted-foreground">Admissions Expert, Former University Dean</p>
                <div className="flex items-center gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-3 w-3 fill-current text-yellow-500" />
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              How It Works
            </CardTitle>
            <CardDescription>
              Simple steps to book and attend your consultation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                1
              </div>
              <div>
                <h4 className="font-medium">Choose Your Session</h4>
                <p className="text-sm text-muted-foreground">
                  Select the type of consultation that best fits your needs
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                2
              </div>
              <div>
                <h4 className="font-medium">Book Your Time</h4>
                <p className="text-sm text-muted-foreground">
                  Pick a convenient time slot and complete your booking
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                3
              </div>
              <div>
                <h4 className="font-medium">Attend Your Session</h4>
                <p className="text-sm text-muted-foreground">
                  Join via video call and get personalized guidance
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {selectedSession && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle>Booking Confirmation</CardTitle>
            <CardDescription>
              You selected: {sessionTypes.find(s => s.id === selectedSession)?.title}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              This feature will be available soon. You can contact us directly to book your session.
            </p>
            <div className="flex gap-2">
              <Button onClick={() => setSelectedSession(null)}>
                Back to Sessions
              </Button>
              <Button variant="outline">
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ConsultationsPage;
