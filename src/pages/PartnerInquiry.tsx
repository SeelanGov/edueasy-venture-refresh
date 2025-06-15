
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Building2, CheckCircle, Users, BarChart3, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Typography } from '@/components/ui/typography';
import { usePartnerInquiry } from '@/hooks/usePartnerInquiry';

const PartnerInquiry = () => {
  const navigate = useNavigate();
  const { submitInquiry, isSubmitting, isSubmitted } = usePartnerInquiry();
  const [formData, setFormData] = useState({
    institutionName: '',
    institutionType: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    website: '',
    studentCount: '',
    interestedTier: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitInquiry(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const benefits = [
    {
      icon: <Users className="h-5 w-5" />,
      title: "Streamlined Admissions",
      description: "AI-powered application processing reduces manual work by 80%"
    },
    {
      icon: <BarChart3 className="h-5 w-5" />,
      title: "Real-time Analytics",
      description: "Track application trends, student demographics, and conversion rates"
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: "Secure & Compliant",
      description: "POPIA compliant with enterprise-grade security measures"
    }
  ];

  const tiers = [
    {
      name: "Basic",
      price: "R2,500",
      features: ["Up to 100 applications/month", "Basic analytics", "Email support", "Document verification"]
    },
    {
      name: "Standard",
      price: "R5,000",
      features: ["Up to 500 applications/month", "Advanced analytics", "Priority support", "API access", "Custom branding"],
      popular: true
    },
    {
      name: "Premium",
      price: "R10,000",
      features: ["Unlimited applications", "Custom analytics", "24/7 support", "Full API access", "Custom integrations", "Dedicated account manager"]
    }
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle>Thank You!</CardTitle>
            <CardDescription>
              We've received your partnership inquiry and will be in touch within 24 hours.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              className="w-full bg-cap-teal hover:bg-cap-teal/90"
              onClick={() => navigate('/institutions')}
            >
              Back to Institutions
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/')}
            >
              Go to Homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-cap-teal rounded-lg flex items-center justify-center mx-auto mb-4">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <Typography variant="h1" className="text-2xl md:text-3xl mb-2">
              Partner with EduEasy
            </Typography>
            <Typography variant="lead" className="text-gray-600">
              Transform your admissions process with AI-powered student matching
            </Typography>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Benefits Section */}
          <div className="space-y-8">
            <div>
              <Typography variant="h2" className="text-xl font-semibold mb-4">
                Why Choose EduEasy?
              </Typography>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-cap-teal/10 rounded-lg flex items-center justify-center text-cap-teal">
                          {benefit.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">{benefit.title}</h3>
                          <p className="text-sm text-gray-600">{benefit.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Pricing Tiers */}
            <div>
              <Typography variant="h2" className="text-xl font-semibold mb-4">
                Partnership Tiers
              </Typography>
              <div className="space-y-4">
                {tiers.map((tier, index) => (
                  <Card key={index} className={tier.popular ? 'border-cap-teal shadow-md' : ''}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{tier.name}</h3>
                            {tier.popular && (
                              <Badge className="bg-cap-teal text-white">Most Popular</Badge>
                            )}
                          </div>
                          <div className="text-2xl font-bold text-cap-teal">{tier.price}/month</div>
                        </div>
                      </div>
                      <ul className="space-y-1">
                        {tier.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Get Partnership Information</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll be in touch within 24 hours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Institution Name *</label>
                      <Input
                        name="institutionName"
                        value={formData.institutionName}
                        onChange={handleChange}
                        placeholder="University of Example"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Institution Type *</label>
                      <select
                        name="institutionType"
                        value={formData.institutionType}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        required
                      >
                        <option value="">Select type</option>
                        <option value="university">University</option>
                        <option value="tvet">TVET College</option>
                        <option value="private_college">Private College</option>
                        <option value="school">School</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Contact Name *</label>
                      <Input
                        name="contactName"
                        value={formData.contactName}
                        onChange={handleChange}
                        placeholder="John Smith"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Contact Email *</label>
                      <Input
                        type="email"
                        name="contactEmail"
                        value={formData.contactEmail}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Contact Phone</label>
                      <Input
                        name="contactPhone"
                        value={formData.contactPhone}
                        onChange={handleChange}
                        placeholder="+27 123 456 789"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Website</label>
                      <Input
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        placeholder="https://example.edu"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Student Count</label>
                      <select
                        name="studentCount"
                        value={formData.studentCount}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                      >
                        <option value="">Select range</option>
                        <option value="<1000">Less than 1,000</option>
                        <option value="1000-5000">1,000 - 5,000</option>
                        <option value="5000-10000">5,000 - 10,000</option>
                        <option value="10000+">10,000+</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Interested Tier</label>
                      <select
                        name="interestedTier"
                        value={formData.interestedTier}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                      >
                        <option value="">Select tier</option>
                        <option value="basic">Basic - R2,500/month</option>
                        <option value="standard">Standard - R5,000/month</option>
                        <option value="premium">Premium - R10,000/month</option>
                        <option value="custom">Custom Solution</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Message</label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us more about your needs and requirements..."
                      rows={4}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-cap-teal hover:bg-cap-teal/90"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Partnership Inquiry'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerInquiry;
