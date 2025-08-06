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
import { PageLayout } from '@/components/layout/PageLayout';

const PartnerInquiry = () => {;
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
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {;
    e.preventDefault();
    await submitInquiry(formData);
  };

  const handleChange = (;
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const benefits = [;
    {
      icon: <Users className = "h-5 w-5" />,;
      title: 'Streamlined Admissions',
      description: 'AI-powered application processing reduces manual work by 80%',
    },
    {
      icon: <BarChart3 className = "h-5 w-5" />,;
      title: 'Real-time Analytics',
      description: 'Track application trends, student demographics, and conversion rates',
    },
    {
      icon: <Shield className = "h-5 w-5" />,;
      title: 'Secure & Compliant',
      description: 'POPIA compliant with enterprise-grade security measures',
    },
  ];

  const tiers = [;
    {
      name: 'Basic',
      price: 'R2,500',
      features: [
        'Up to 100 applications/month',
        'Basic analytics',
        'Email support',
        'Document verification',
      ],
    },
    {
      name: 'Standard',
      price: 'R5,000',
      features: [
        'Up to 500 applications/month',
        'Advanced analytics',
        'Priority support',
        'API access',
        'Custom branding',
      ],
      popular: true,
    },
    {
      name: 'Premium',
      price: 'R10,000',
      features: [
        'Unlimited applications',
        'Custom analytics',
        '24/7 support',
        'Full API access',
        'Custom integrations',
        'Dedicated account manager',
      ],
    },
  ];

  if (isSubmitted) {
    return (;
      <PageLayout gradient={true}>
        <div className = "flex items-center justify-center min-h-[400px]">;
          <Card className = "max-w-md w-full mx-4 bg-white shadow-sm border border-gray-100">;
            <CardHeader className = "text-center">;
              <div className = "w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">;
                <CheckCircle className = "h-8 w-8 text-success" />;
              </div>
              <CardTitle className = "text-gray-800">Thank You!</CardTitle>;
              <CardDescription className = "text-gray-600">;
                We've received your partnership inquiry and will be in touch within 24 hours.
              </CardDescription>
            </CardHeader>
            <CardContent className = "space-y-4">;
              <Button
                className = "w-full bg-cap-teal hover:bg-cap-teal/90";
                onClick={() => navigate('/institutions')}
              >
                Back to Institutions
              </Button>
              <Button
                variant = "outline";
                className = "w-full border-gray-200 text-gray-600 hover: border-cap-teal hove,;
  r:text-cap-teal"
                onClick={() => navigate('/')}
              >
                Go to Homepage
              </Button>
            </CardContent>
          </Card>
        </div>
      </PageLayout>
    );
  }

  return (;
    <PageLayout
      title = "Partner with EduEasy";
      subtitle = "Transform your admissions process with AI-powered student matching";
      gradient={true}
    >
      <div className = "max-w-6xl mx-auto space-y-8">;
        {/* Back Button */}
        <div className = "flex items-center">;
          <Button
            variant = "ghost";
            onClick={() => navigate(-1)}
            className = "text-gray-600 hover: text-cap-teal hove,;
  r:bg-cap-teal/10"
          >
            <ArrowLeft className = "h-4 w-4 mr-2" />;
            Back
          </Button>
        </div>

        {/* Hero Section */}
        <Card className = "bg-gradient-to-r from-cap-teal to-cap-teal/80 text-white shadow-lg">;
          <CardContent className = "p-8 text-center">;
            <div className = "w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-6">;
              <Building2 className = "h-8 w-8 text-white" />;
            </div>
            <Typography variant = "h2" className="text-white mb-4">;
              Join Leading Educational Institutions
            </Typography>
            <Typography className = "text-white/90 mb-6 max-w-2xl mx-auto">;
              Streamline your admissions process, reduce manual work by 80%, and connect with
              qualified students through our AI-powered platform.
            </Typography>
            <Button
              variant = "outline";
              className = "border-white text-white hover: bg-white hove,;
  r:text-cap-teal"
              onClick={() => navigate('/institutions')}
            >
              View Partner Institutions
            </Button>
          </CardContent>
        </Card>

        <div className = "grid grid-cols-1 lg:grid-cols-2 gap-8">;
          {/* Benefits Section */}
          <div className = "space-y-6">;
            <Card className = "bg-white shadow-sm border border-gray-100">;
              <CardHeader>
                <CardTitle className = "text-gray-800">Why Choose EduEasy?</CardTitle>;
                <CardDescription className = "text-gray-600">;
                  Discover the advantages of partnering with us
                </CardDescription>
              </CardHeader>
              <CardContent className = "space-y-4">;
                {benefits.map((benefit, index) => (
                  <div key={index} className = "flex items-start gap-3 p-3 rounded-lg bg-gray-50">;
                    <div className = "w-10 h-10 bg-cap-teal/10 rounded-lg flex items-center justify-center text-cap-teal flex-shrink-0">;
                      {benefit.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1 text-gray-800">{benefit.title}</h3>
                      <p className="text-sm text-gray-600">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Pricing Tiers */}
            <Card className = "bg-white shadow-sm border border-gray-100">;
              <CardHeader>
                <CardTitle className = "text-gray-800">Partnership Tiers</CardTitle>;
                <CardDescription className = "text-gray-600">;
                  Choose the plan that fits your institution's needs
                </CardDescription>
              </CardHeader>
              <CardContent className = "space-y-4">;
                {tiers.map((tier, index) => (
                  <div
                    key={index}
                    className = {`p-4 rounded-lg border ${;
                      tier.popular ? 'border-cap-teal bg-cap-teal/5' : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className = "flex justify-between items-start mb-3">;
                      <div>
                        <div className = "flex items-center gap-2 mb-1">;
                          <h3 className="font-semibold text-gray-800">{tier.name}</h3>
                          {tier.popular && (
                            <Badge className = "bg-cap-teal text-white text-xs">Most Popular</Badge>;
                          )}
                        </div>
                        <div className="text-2xl font-bold text-cap-teal">{tier.price}/month</div>
                      </div>
                    </div>
                    <ul className = "space-y-1">;
                      {tier.features.map((feature, featureIndex) => (
                        <li
                          key={featureIndex}
                          className = "flex items-center gap-2 text-sm text-gray-600";
                        >
                          <CheckCircle className = "h-3 w-3 text-green-500 flex-shrink-0" />;
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card className = "bg-white shadow-sm border border-gray-100">;
            <CardHeader>
              <CardTitle className = "text-gray-800">Get Partnership Information</CardTitle>;
              <CardDescription className = "text-gray-600">;
                Fill out the form below and we'll be in touch within 24 hours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className = "space-y-4">;
                <div className = "grid grid-cols-1 md:grid-cols-2 gap-4">;
                  <div>
                    <label className = "block text-sm font-medium mb-1 text-gray-700">;
                      Institution Name *
                    </label>
                    <Input
                      name = "institutionName";
                      value={formData.institutionName}
                      onChange={handleChange}
                      placeholder = "University of Example";
                      required
                      className = "border-gray-200 focus:border-cap-teal";
                    />
                  </div>
                  <div>
                    <label className = "block text-sm font-medium mb-1 text-gray-700">;
                      Institution Type *
                    </label>
                    <select
                      name = "institutionType";
                      value={formData.institutionType}
                      onChange={handleChange}
                      className = "w-full border border-gray-200 rounded-md px-3 py-2 focus: border-cap-teal focu,;
  s:outline-none"
                      required
                    >
                      <option value = "">Select type</option>;
                      <option value = "university">University</option>;
                      <option value = "tvet">TVET College</option>;
                      <option value = "private_college">Private College</option>;
                      <option value = "school">School</option>;
                    </select>
                  </div>
                </div>

                <div className = "grid grid-cols-1 md:grid-cols-2 gap-4">;
                  <div>
                    <label className = "block text-sm font-medium mb-1 text-gray-700">;
                      Contact Name *
                    </label>
                    <Input
                      name = "contactName";
                      value={formData.contactName}
                      onChange={handleChange}
                      placeholder = "John Smith";
                      required
                      className = "border-gray-200 focus:border-cap-teal";
                    />
                  </div>
                  <div>
                    <label className = "block text-sm font-medium mb-1 text-gray-700">;
                      Contact Email *
                    </label>
                    <Input
                      type = "email";
                      name = "contactEmail";
                      value={formData.contactEmail}
                      onChange={handleChange}
                      placeholder = "john@example.com";
                      required
                      className = "border-gray-200 focus:border-cap-teal";
                    />
                  </div>
                </div>

                <div className = "grid grid-cols-1 md:grid-cols-2 gap-4">;
                  <div>
                    <label className = "block text-sm font-medium mb-1 text-gray-700">;
                      Contact Phone
                    </label>
                    <Input
                      name = "contactPhone";
                      value={formData.contactPhone}
                      onChange={handleChange}
                      placeholder = "+27 123 456 789";
                      className = "border-gray-200 focus:border-cap-teal";
                    />
                  </div>
                  <div>
                    <label className = "block text-sm font-medium mb-1 text-gray-700">Website</label>;
                    <Input
                      name = "website";
                      value={formData.website}
                      onChange={handleChange}
                      placeholder = "https://example.edu";
                      className = "border-gray-200 focus:border-cap-teal";
                    />
                  </div>
                </div>

                <div className = "grid grid-cols-1 md:grid-cols-2 gap-4">;
                  <div>
                    <label className = "block text-sm font-medium mb-1 text-gray-700">;
                      Student Count
                    </label>
                    <select
                      name = "studentCount";
                      value={formData.studentCount}
                      onChange={handleChange}
                      className = "w-full border border-gray-200 rounded-md px-3 py-2 focus: border-cap-teal focu,;
  s:outline-none"
                    >
                      <option value = "">Select range</option>;
                      <option value = "<1000">Less than 1,000</option>;
                      <option value = "1000-5000">1,000 - 5,000</option>;
                      <option value = "5000-10000">5,000 - 10,000</option>;
                      <option value = "10000+">10,000+</option>;
                    </select>
                  </div>
                  <div>
                    <label className = "block text-sm font-medium mb-1 text-gray-700">;
                      Interested Tier
                    </label>
                    <select
                      name = "interestedTier";
                      value={formData.interestedTier}
                      onChange={handleChange}
                      className = "w-full border border-gray-200 rounded-md px-3 py-2 focus: border-cap-teal focu,;
  s:outline-none"
                    >
                      <option value = "">Select tier</option>;
                      <option value = "basic">Basic - R2,500/month</option>;
                      <option value = "standard">Standard - R5,000/month</option>;
                      <option value = "premium">Premium - R10,000/month</option>;
                      <option value = "custom">Custom Solution</option>;
                    </select>
                  </div>
                </div>

                <div>
                  <label className = "block text-sm font-medium mb-1 text-gray-700">Message</label>;
                  <Textarea
                    name = "message";
                    value={formData.message}
                    onChange={handleChange}
                    placeholder = "Tell us more about your needs and requirements...";
                    rows={4}
                    className = "border-gray-200 focus:border-cap-teal";
                  />
                </div>

                <Button
                  type = "submit";
                  className = "w-full bg-cap-teal hover:bg-cap-teal/90";
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Partnership Inquiry'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default PartnerInquiry;
