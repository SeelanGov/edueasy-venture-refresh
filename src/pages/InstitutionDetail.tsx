import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Building2, Mail, Phone, Globe, Users, GraduationCap, CheckCircle, Star, Loader2 } from 'lucide-react';
import { Typography } from '@/components/ui/typography';
import { supabase } from '@/integrations/supabase/client';
import { Institution } from '@/hooks/useInstitutions';

const InstitutionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [institution, setInstitution] = useState<Institution | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInstitution = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);
        
        const { data, error: fetchError } = await supabase
          .from('institutions')
          .select('*')
          .eq('id', id)
          .eq('active', true)
          .single();

        if (fetchError) throw fetchError;
        
        // Type assertion since we know the structure matches our interface
        setInstitution(data as Institution);
      } catch (err) {
        console.error('Error fetching institution:', err);
        setError('Institution not found');
      } finally {
        setLoading(false);
      }
    };

    fetchInstitution();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-cap-teal" />
          <Typography variant="p">Loading institution details...</Typography>
        </div>
      </div>
    );
  }

  if (error || !institution) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <Typography variant="h3" className="text-red-600 mb-2">
              Institution Not Found
            </Typography>
            <Typography variant="p" className="text-gray-600 mb-4">
              {error || 'The institution you are looking for does not exist.'}
            </Typography>
            <Button onClick={() => navigate('/institutions')}>
              Back to Institutions
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const benefits = [
    "AI-powered student matching",
    "Automated application processing",
    "Real-time analytics dashboard",
    "Student progress tracking",
    "Integrated communication tools",
    "Document verification system"
  ];

  const tiers = [
    {
      name: "Basic",
      price: "R2,500",
      features: ["Up to 100 applications/month", "Basic analytics", "Email support"]
    },
    {
      name: "Standard",
      price: "R5,000",
      features: ["Up to 500 applications/month", "Advanced analytics", "Priority support", "API access"]
    },
    {
      name: "Premium",
      price: "R10,000",
      features: ["Unlimited applications", "Custom analytics", "24/7 support", "Full API access", "Custom integrations"]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" onClick={() => navigate('/institutions')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Institutions
            </Button>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-cap-teal rounded-lg flex items-center justify-center">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <Typography variant="h1" className="text-2xl md:text-3xl">
                  {institution.name}
                </Typography>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline">{institution.type}</Badge>
                  {institution.location && <Badge variant="outline">{institution.location}</Badge>}
                  {institution.partner_id && (
                    <Badge className="bg-green-100 text-green-800">
                      EduEasy Partner
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => navigate('/register')}>
                Apply as Student
              </Button>
              <Button 
                className="bg-cap-teal hover:bg-cap-teal/90"
                onClick={() => navigate('/partner-inquiry')}
              >
                Become a Partner
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Institution Overview */}
            <Card>
              <CardHeader>
                <CardTitle>About {institution.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <Typography variant="p" className="text-gray-600 mb-6">
                  {institution.description || `${institution.name} is a leading educational institution in ${institution.province || 'South Africa'}.`}
                </Typography>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {institution.student_count && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-cap-teal">{institution.student_count}</div>
                      <div className="text-sm text-gray-500">Students</div>
                    </div>
                  )}
                  {institution.established && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-cap-teal">{institution.established}</div>
                      <div className="text-sm text-gray-500">Established</div>
                    </div>
                  )}
                  {institution.ranking && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-cap-teal">{institution.ranking}</div>
                      <div className="text-sm text-gray-500">Ranking</div>
                    </div>
                  )}
                  {institution.partner_id && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-cap-teal">Partner</div>
                      <div className="text-sm text-gray-500">Status</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Programs */}
            {institution.programs && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Popular Programs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Typography variant="p" className="text-gray-600">
                    <strong>Available Programs:</strong> {institution.programs}
                  </Typography>
                </CardContent>
              </Card>
            )}

            {/* EduEasy Partnership Benefits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-cap-teal" />
                  Why Partner with EduEasy?
                </CardTitle>
                <CardDescription>
                  Transform your admissions process with our AI-powered platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Partnership Tiers */}
            <Card>
              <CardHeader>
                <CardTitle>Partnership Tiers</CardTitle>
                <CardDescription>
                  Choose the tier that best fits your institution's needs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {tiers.map((tier, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="text-center mb-4">
                        <h3 className="font-semibold text-lg">{tier.name}</h3>
                        <div className="text-2xl font-bold text-cap-teal">{tier.price}</div>
                        <div className="text-sm text-gray-500">per month</div>
                      </div>
                      <ul className="space-y-2">
                        {tier.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            {(institution.email || institution.phone || institution.website) && (
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {institution.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <a href={`mailto:${institution.email}`} className="text-blue-600 hover:underline">
                        {institution.email}
                      </a>
                    </div>
                  )}
                  {institution.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <a href={`tel:${institution.phone}`} className="text-blue-600 hover:underline">
                        {institution.phone}
                      </a>
                    </div>
                  )}
                  {institution.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-gray-400" />
                      <a href={institution.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        Visit Website
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Partnership CTA */}
            <Card className="bg-gradient-to-br from-cap-teal to-cap-teal/80 text-white">
              <CardHeader>
                <CardTitle className="text-white">Ready to Partner?</CardTitle>
                <CardDescription className="text-white/90">
                  Join other institutions already using EduEasy
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  className="w-full bg-white text-cap-teal hover:bg-gray-100"
                  onClick={() => navigate('/partner-inquiry')}
                >
                  Get Partnership Info
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-white text-white hover:bg-white hover:text-cap-teal"
                  onClick={() => navigate('/consultations')}
                >
                  Schedule a Demo
                </Button>
              </CardContent>
            </Card>

            {/* Student CTA */}
            <Card>
              <CardHeader>
                <CardTitle>Interested Student?</CardTitle>
                <CardDescription>
                  Apply to {institution.name} through EduEasy
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full bg-cap-teal hover:bg-cap-teal/90"
                  onClick={() => navigate('/register')}
                >
                  Start Your Application
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstitutionDetail;
