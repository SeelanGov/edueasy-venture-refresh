import { PageLayout } from '@/components/layout/PageLayout';
import { PremiumFeature } from '@/components/subscription/PremiumFeature';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SubscriptionTierName } from '@/types/SubscriptionTypes';
import { Calendar, Clock, Star, Users, Video } from 'lucide-react';
import { useState } from 'react';









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
        'Career roadmap creation',
      ],
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
        'Deadline management guidance',
      ],
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
        'Confidence building techniques',
      ],
    },
  ];

  return (
    <PageLayout
      title="Expert Consultations"
      subtitle="Book one-on-one sessions with our education and career experts"
      gradient={true}
    >
      <div className="max-w-6xl mx-auto space-y-8">
        <PremiumFeature
          title="Expert Consultations"
          description="Available for Essential and Pro + AI subscribers"
          requiredTier={SubscriptionTierName.ESSENTIAL}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessionTypes.map((session) => (
              <Card
                key={session.id}
                className="shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg text-gray-800">{session.title}</CardTitle>
                    <Badge className="bg-cap-teal text-white">{session.price}</Badge>
                  </div>
                  <CardDescription className="flex items-center gap-2 text-gray-600">
                    <Clock className="h-4 w-4" />
                    {session.duration}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">{session.description}</p>

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm text-gray-700">What's included:</h4>
                    <ul className="space-y-1">
                      {session.features.map((feature, index) => (
                        <li key={index} className="text-xs text-gray-600 flex items-center gap-2">
                          <Star className="h-3 w-3 text-cap-teal" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    variant="primary"
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
          <Card className="bg-white shadow-sm border border-gray-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <Users className="h-5 w-5 text-cap-teal" />
                Our Experts
              </CardTitle>
              <CardDescription className="text-gray-600">
                Meet our team of education and career professionals
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 p-4 border border-gray-100 rounded-lg bg-gray-50">
                <div className="w-12 h-12 bg-cap-teal/10 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-cap-teal" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Dr. Sarah Johannesburg</h4>
                  <p className="text-sm text-gray-600">Career Counselor, 15+ years experience</p>
                  <div className="flex items-center gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-3 w-3 fill-current text-yellow-500" />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 border border-gray-100 rounded-lg bg-gray-50">
                <div className="w-12 h-12 bg-cap-teal/10 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-cap-teal" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Prof. Michael Cape Town</h4>
                  <p className="text-sm text-gray-600">Admissions Expert, Former University Dean</p>
                  <div className="flex items-center gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-3 w-3 fill-current text-yellow-500" />
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border border-gray-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <Video className="h-5 w-5 text-cap-teal" />
                How It Works
              </CardTitle>
              <CardDescription className="text-gray-600">
                Simple steps to book and attend your consultation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-cap-teal text-white rounded-full flex items-center justify-center text-sm font-medium">
                  1
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Choose Your Session</h4>
                  <p className="text-sm text-gray-600">
                    Select the type of consultation that best fits your needs
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-cap-teal text-white rounded-full flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Book Your Time</h4>
                  <p className="text-sm text-gray-600">
                    Pick a convenient time slot and complete your booking
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-cap-teal text-white rounded-full flex items-center justify-center text-sm font-medium">
                  3
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Attend Your Session</h4>
                  <p className="text-sm text-gray-600">
                    Join via video call and get personalized guidance
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {selectedSession && (
          <Card className="border-cap-teal shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-800">Booking Confirmation</CardTitle>
              <CardDescription className="text-gray-600">
                You selected: {sessionTypes.find((s) => s.id === selectedSession)?.title}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                This feature will be available soon. You can contact us directly to book your
                session.
              </p>
              <div className="flex gap-2">
                <Button onClick={() => setSelectedSession(null)} variant="secondary">
                  Back to Sessions
                </Button>
                <Button variant="outline">Contact Support</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </PageLayout>
  );
};

export default ConsultationsPage;
