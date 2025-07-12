import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageLayout } from '@/components/layout/PageLayout';
import { HelpCircle, MessageSquare, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

const faqs = [
  {
    q: 'How do I reset my password?',
    a: "Go to your profile settings and click 'Reset Password'. You'll receive an email with instructions to create a new password.",
    category: 'Account',
  },
  {
    q: 'How do I contact support?',
    a: 'Click the Help button at the bottom right of any page, or email us directly at info@edueasy.co. We typically respond within 24 hours.',
    category: 'Support',
  },
  {
    q: 'What documents do I need for applications?',
    a: 'You typically need your ID document, academic transcripts, and any certificates. Specific requirements vary by institution and program.',
    category: 'Applications',
  },
  {
    q: 'How does Thandi AI assistant work?',
    a: 'Thandi uses advanced AI to help you with application guidance, document preparation, and career advice. Simply ask questions in natural language.',
    category: 'AI Assistant',
  },
  {
    q: 'Can I upgrade my plan anytime?',
    a: 'Yes, you can upgrade your plan at any time. Changes take effect immediately and you only pay the difference.',
    category: 'Billing',
  },
  {
    q: 'Is my personal information secure?',
    a: 'Absolutely. We use industry-standard encryption and security measures to protect your data. We never share your information without consent.',
    category: 'Privacy',
  },
];

const categories = [
  'All',
  'Account',
  'Support',
  'Applications',
  'AI Assistant',
  'Billing',
  'Privacy',
];

export const FAQPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = React.useState('All');

  const filteredFaqs =
    selectedCategory === 'All' ? faqs : faqs.filter((faq) => faq.category === selectedCategory);

  return (
    <PageLayout
      title="Frequently Asked Questions"
      subtitle="Find answers to common questions about EduEasy and our services"
      gradient={true}
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Category Filter */}
        <Card className="bg-white shadow-sm border border-gray-100">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={
                    selectedCategory === category
                      ? 'bg-cap-teal hover:bg-cap-teal/90 text-white'
                      : 'border-gray-200 text-gray-600 hover:border-cap-teal hover:text-cap-teal'
                  }
                >
                  {category}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFaqs.map((faq, idx) => (
            <Card
              key={idx}
              className="bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-start gap-3 text-lg font-semibold text-gray-800">
                  <HelpCircle className="h-5 w-5 text-cap-teal mt-0.5 flex-shrink-0" />
                  <span>{faq.q}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="ml-8">
                  <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                  <div className="mt-3">
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded">
                      {faq.category}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Support Card */}
        <Card className="bg-gradient-to-r from-cap-teal to-blue-600 text-white shadow-lg">
          <CardContent className="p-8 text-center">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-90" />
            <h3 className="text-xl font-bold mb-2">Still need help?</h3>
            <p className="mb-6 opacity-90">
              Can't find the answer you're looking for? Our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" className="bg-white text-cap-teal hover:bg-gray-50">
                <Mail className="h-4 w-4 mr-2" />
                Email Support
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/10">
                <Phone className="h-4 w-4 mr-2" />
                Contact Us
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default FAQPage;
