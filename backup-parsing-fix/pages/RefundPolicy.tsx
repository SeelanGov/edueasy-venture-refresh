import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Typography } from '@/components/ui/typography';
import { ArrowLeft, Download } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RefundPolicy = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('[data-section]');
      let current = '';

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100) {
          current = section.getAttribute('data-section') || '';
        }
      });

      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const sections = [
    { id: 'introduction', title: '1. Introduction' },
    { id: 'scope', title: '2. Scope' },
    { id: 'cooling-off-period', title: '3. Cooling-Off Period' },
    { id: 'cancellation-procedures', title: '4. Cancellation Procedures' },
    { id: 'refund-procedures', title: '5. Refund Procedures' },
    { id: 'non-refundable-items', title: '6. Non-Refundable Items' },
    { id: 'dispute-resolution', title: '7. Dispute Resolution' },
    { id: 'policy-changes', title: '8. Changes to This Policy' },
    { id: 'contact-information', title: '9. Contact Information' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <div>
                <Typography variant="h3" className="text-cap-teal">
                  Refund and Cancellation Policy
                </Typography>
                <p className="text-sm text-gray-600">Last Updated: March 11, 2025</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Table of Contents - Desktop */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <Typography variant="h4" className="mb-4">
                  Table of Contents
                </Typography>
                <nav className="space-y-2">
                  {sections.map((section) => (
                    <Button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`block w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                        activeSection === section.id
                          ? 'bg-cap-teal text-white'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                      variant="ghost"
                      size="sm"
                    >
                      {section.title}
                    </Button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1 max-w-4xl">
            <Card>
              <CardContent className="p-8">
                {/* Section 1: Introduction */}
                <section id="introduction" data-section="introduction" className="mb-12">
                  <Typography variant="h2" className="text-cap-teal mb-6">
                    1. INTRODUCTION
                  </Typography>
                  <div className="prose prose-gray max-w-none space-y-4">
                    <p>
                      This Refund and Cancellation Policy forms part of the Terms and Conditions of
                      EduEasy, operated by CAP (South Africa) (Registration Number: 2025/120934/07)
                      ("we", "us", "our", or "EduEasy"). This policy has been developed in
                      accordance with the Electronic Communications and Transactions Act 25 of 2002
                      (ECTA) and other applicable South African consumer protection laws.
                    </p>
                  </div>
                </section>

                <Separator className="my-8" />

                {/* Section 2: Scope */}
                <section id="scope" data-section="scope" className="mb-12">
                  <Typography variant="h2" className="text-cap-teal mb-6">
                    2. SCOPE
                  </Typography>
                  <div className="prose prose-gray max-w-none space-y-4">
                    <p>
                      This policy applies to all paid services offered by EduEasy, including but not
                      limited to:
                    </p>
                    <div className="grid md:grid-cols-2 gap-4 mt-6">
                      <Card className="border-l-4 border-l-cap-teal">
                        <CardContent className="p-4">
                          <ul className="text-sm space-y-2">
                            <li>• Premium account subscriptions</li>
                            <li>• Application processing fees</li>
                            <li>• Career assessment services</li>
                            <li>• Document verification services</li>
                          </ul>
                        </CardContent>
                      </Card>
                      <Card className="border-l-4 border-l-cap-coral">
                        <CardContent className="p-4">
                          <ul className="text-sm space-y-2">
                            <li>• Consultation booking fees</li>
                            <li>• Priority support services</li>
                            <li>• Educational guidance services</li>
                            <li>• Any other paid services offered through our platform</li>
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </section>

                <Separator className="my-8" />

                {/* Section 3: Cooling-Off Period */}
                <section
                  id="cooling-off-period"
                  data-section="cooling-off-period"
                  className="mb-12"
                >
                  <Typography variant="h2" className="text-cap-teal mb-6">
                    3. COOLING-OFF PERIOD
                  </Typography>
                  <div className="prose prose-gray max-w-none space-y-6">
                    <Typography variant="h3" className="text-gray-800">
                      3.1 Statutory Cooling-Off Period
                    </Typography>
                    <div className="bg-primary/10 border border-primary/20 rounded-lg p-6">
                      <p>
                        In accordance with Section 44 of the Electronic Communications and
                        Transactions Act (ECTA), you have the right to cancel any electronic
                        transaction without reason or penalty within <strong>7 (seven) days</strong>{' '}
                        after the date of receipt of the goods or conclusion of the agreement for
                        services.
                      </p>
                    </div>

                    <Typography variant="h3" className="text-gray-800">
                      3.2 Exceptions to the Cooling-Off Period
                    </Typography>
                    <p>The cooling-off period does not apply to:</p>
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                      <ul className="grid md:grid-cols-2 gap-2 text-sm">
                        <li className="flex items-start gap-2">
                          <span className="w-2 h-2 bg-destructive/100 rounded-full mt-2 flex-shrink-0"></span>
                          Financial services, including banking, insurance, investment services, or
                          financial advice
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-2 h-2 bg-destructive/100 rounded-full mt-2 flex-shrink-0"></span>
                          Goods made to your specifications or clearly personalized
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-2 h-2 bg-destructive/100 rounded-full mt-2 flex-shrink-0"></span>
                          Audio or video recordings or computer software that has been unsealed
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-2 h-2 bg-destructive/100 rounded-full mt-2 flex-shrink-0"></span>
                          Services that have already been fully performed with your express consent
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-2 h-2 bg-destructive/100 rounded-full mt-2 flex-shrink-0"></span>
                          Newspapers, periodicals, magazines, and books
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-2 h-2 bg-destructive/100 rounded-full mt-2 flex-shrink-0"></span>
                          Accommodation, transport, catering, or leisure services scheduled for a
                          specific date or period
                        </li>
                      </ul>
                    </div>
                  </div>
                </section>

                <Separator className="my-8" />

                {/* Section 4: Cancellation Procedures */}
                <section
                  id="cancellation-procedures"
                  data-section="cancellation-procedures"
                  className="mb-12"
                >
                  <Typography variant="h2" className="text-cap-teal mb-6">
                    4. CANCELLATION PROCEDURES
                  </Typography>
                  <div className="prose prose-gray max-w-none space-y-6">
                    <div className="grid md:grid-cols-3 gap-6">
                      <Card className="border-l-4 border-l-cap-teal">
                        <CardContent className="p-6">
                          <Typography variant="h3" className="text-cap-teal mb-4">
                            4.1 Subscription Services
                          </Typography>
                          <ul className="text-sm space-y-2">
                            <li>• Cancel anytime via account settings or customer support</li>
                            <li>• Takes effect at end of current billing cycle</li>
                            <li>• No partial refunds for unused portions unless required by law</li>
                          </ul>
                        </CardContent>
                      </Card>

                      <Card className="border-l-4 border-l-cap-coral">
                        <CardContent className="p-6">
                          <Typography variant="h3" className="text-cap-coral mb-4">
                            4.2 One-Time Services
                          </Typography>
                          <ul className="text-sm space-y-2">
                            <li>• Full refund if service not yet performed</li>
                            <li>• Partial refund if service is in progress</li>
                            <li>• No refund if service completed (unless defective)</li>
                          </ul>
                        </CardContent>
                      </Card>

                      <Card className="border-l-4 border-l-blue-500">
                        <CardContent className="p-6">
                          <Typography variant="h3" className="text-primary mb-4">
                            4.3 Application Processing
                          </Typography>
                          <ul className="text-sm space-y-2">
                            <li>• 100% refund: Before processing begins</li>
                            <li>• 80% refund: After processing, before submission</li>
                            <li>• No refund: After submission to institutions</li>
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </section>

                <Separator className="my-8" />

                {/* Section 5: Refund Procedures */}
                <section id="refund-procedures" data-section="refund-procedures" className="mb-12">
                  <Typography variant="h2" className="text-cap-teal mb-6">
                    5. REFUND PROCEDURES
                  </Typography>
                  <div className="prose prose-gray max-w-none space-y-6">
                    <Typography variant="h3" className="text-gray-800">
                      5.1 Refund Eligibility
                    </Typography>
                    <p>You may be eligible for a refund in the following circumstances:</p>
                    <div className="bg-success/10 border border-success/20 rounded-lg p-4">
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-success/100 rounded-full"></span>
                          Within the statutory cooling-off period as described in Section 3
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-success/100 rounded-full"></span>
                          Services not provided or significantly delayed without reasonable cause
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-success/100 rounded-full"></span>
                          Technical issues that prevent access for an extended period
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-success/100 rounded-full"></span>
                          EduEasy has breached a material term of the Terms and Conditions
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-success/100 rounded-full"></span>
                          As required by South African consumer protection laws
                        </li>
                      </ul>
                    </div>

                    <Typography variant="h3" className="text-gray-800">
                      5.2 Refund Process
                    </Typography>
                    <p>To request a refund:</p>
                    <div className="bg-cap-teal/5 border border-cap-teal/20 rounded-lg p-6">
                      <ol className="space-y-3 text-sm">
                        <li className="flex gap-3">
                          <span className="bg-cap-teal text-white rounded-full w-6 h-6 flex items-center justify-center text-xs flex-shrink-0">
                            1
                          </span>
                          <span>
                            Log in to your EduEasy account and navigate to the "Billing" or
                            "Payments" section.
                          </span>
                        </li>
                        <li className="flex gap-3">
                          <span className="bg-cap-teal text-white rounded-full w-6 h-6 flex items-center justify-center text-xs flex-shrink-0">
                            2
                          </span>
                          <span>Select the transaction for which you are requesting a refund.</span>
                        </li>
                        <li className="flex gap-3">
                          <span className="bg-cap-teal text-white rounded-full w-6 h-6 flex items-center justify-center text-xs flex-shrink-0">
                            3
                          </span>
                          <span>
                            Complete the refund request form with all required information.
                          </span>
                        </li>
                        <li className="flex gap-3">
                          <span className="bg-cap-teal text-white rounded-full w-6 h-6 flex items-center justify-center text-xs flex-shrink-0">
                            4
                          </span>
                          <span>Submit your request.</span>
                        </li>
                      </ol>
                      <p className="mt-4 text-sm">
                        Alternatively, email our customer support at{' '}
                        <a href="mailto:info@edueasy.co" className="text-cap-teal hover:underline">
                          info@edueasy.co
                        </a>{' '}
                        with your refund request, including your account details and the reason for
                        the refund.
                      </p>
                    </div>

                    <Typography variant="h3" className="text-gray-800">
                      5.3 Refund Timeframe
                    </Typography>
                    <p>
                      We aim to process all valid refund requests within{' '}
                      <strong>7-10 business days</strong> of approval. The actual time for the funds
                      to reflect in your account may vary depending on your payment method and
                      financial institution.
                    </p>

                    <Typography variant="h3" className="text-gray-800">
                      5.4 Refund Methods
                    </Typography>
                    <p>
                      Refunds will be issued using the same payment method used for the original
                      transaction whenever possible. If this is not possible, we will contact you to
                      arrange an alternative refund method.
                    </p>
                  </div>
                </section>

                <Separator className="my-8" />

                {/* Section 6: Non-Refundable Items */}
                <section
                  id="non-refundable-items"
                  data-section="non-refundable-items"
                  className="mb-12"
                >
                  <Typography variant="h2" className="text-cap-teal mb-6">
                    6. NON-REFUNDABLE ITEMS
                  </Typography>
                  <div className="prose prose-gray max-w-none space-y-4">
                    <p>The following are generally non-refundable:</p>
                    <div className="bg-warning/10 border border-warning/20 rounded-lg p-6">
                      <ul className="grid md:grid-cols-2 gap-3 text-sm">
                        <li className="flex items-start gap-2">
                          <span className="w-2 h-2 bg-warning/100 rounded-full mt-2 flex-shrink-0"></span>
                          Fees for services that have been fully delivered to your satisfaction
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-2 h-2 bg-warning/100 rounded-full mt-2 flex-shrink-0"></span>
                          Fees for applications that have already been submitted to educational
                          institutions or funding providers
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-2 h-2 bg-warning/100 rounded-full mt-2 flex-shrink-0"></span>
                          Verification fees for documents that have already been verified
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-2 h-2 bg-warning/100 rounded-full mt-2 flex-shrink-0"></span>
                          Any fees where the non-refundable nature was clearly communicated before
                          purchase
                        </li>
                      </ul>
                    </div>
                  </div>
                </section>

                <Separator className="my-8" />

                {/* Section 7: Dispute Resolution */}
                <section
                  id="dispute-resolution"
                  data-section="dispute-resolution"
                  className="mb-12"
                >
                  <Typography variant="h2" className="text-cap-teal mb-6">
                    7. DISPUTE RESOLUTION
                  </Typography>
                  <div className="prose prose-gray max-w-none space-y-4">
                    <p>
                      If you are dissatisfied with our decision regarding your refund or
                      cancellation request:
                    </p>
                    <div className="bg-cap-coral/5 border border-cap-coral/20 rounded-lg p-6">
                      <ol className="space-y-3 text-sm">
                        <li className="flex gap-3">
                          <span className="bg-cap-coral text-white rounded-full w-6 h-6 flex items-center justify-center text-xs flex-shrink-0">
                            1
                          </span>
                          <span>Contact our customer support team to explain your concerns.</span>
                        </li>
                        <li className="flex gap-3">
                          <span className="bg-cap-coral text-white rounded-full w-6 h-6 flex items-center justify-center text-xs flex-shrink-0">
                            2
                          </span>
                          <span>
                            If the issue remains unresolved, escalate the matter to our management
                            team by emailing{' '}
                            <a
                              href="mailto:info@edueasy.co"
                              className="text-cap-coral hover:underline"
                            >
                              info@edueasy.co
                            </a>
                          </span>
                        </li>
                        <li className="flex gap-3">
                          <span className="bg-cap-coral text-white rounded-full w-6 h-6 flex items-center justify-center text-xs flex-shrink-0">
                            3
                          </span>
                          <span>
                            If you remain dissatisfied, you may refer the matter to the relevant
                            South African consumer protection authorities.
                          </span>
                        </li>
                      </ol>
                    </div>
                  </div>
                </section>

                <Separator className="my-8" />

                {/* Section 8: Policy Changes */}
                <section id="policy-changes" data-section="policy-changes" className="mb-12">
                  <Typography variant="h2" className="text-cap-teal mb-6">
                    8. CHANGES TO THIS POLICY
                  </Typography>
                  <div className="prose prose-gray max-w-none space-y-4">
                    <p>
                      We reserve the right to modify this Refund and Cancellation Policy at any
                      time. Any changes will be effective immediately upon posting the updated
                      policy on our website. We encourage you to review this policy regularly to
                      stay informed about our refund and cancellation procedures.
                    </p>
                  </div>
                </section>

                <Separator className="my-8" />

                {/* Section 9: Contact Information */}
                <section
                  id="contact-information"
                  data-section="contact-information"
                  className="mb-12"
                >
                  <Typography variant="h2" className="text-cap-teal mb-6">
                    9. CONTACT INFORMATION
                  </Typography>
                  <div className="prose prose-gray max-w-none">
                    <p>
                      If you have any questions about this Refund and Cancellation Policy, please
                      contact us at:
                    </p>
                    <Card className="bg-cap-teal/5 border-cap-teal/20 mt-6">
                      <CardContent className="p-6">
                        <div className="space-y-3">
                          <div>
                            <strong>Customer Support:</strong>{' '}
                            <a
                              href="mailto:info@edueasy.co"
                              className="text-cap-teal hover:underline"
                            >
                              info@edueasy.co
                            </a>
                          </div>
                          <div>
                            <strong>Refund Queries:</strong>{' '}
                            <a
                              href="mailto:info@edueasy.co"
                              className="text-cap-teal hover:underline"
                            >
                              info@edueasy.co
                            </a>
                          </div>
                          <div>
                            <strong>Phone:</strong> TBC
                          </div>
                          <div>
                            <strong>Address:</strong> 268 Oxford Street, Belgravia, East London,
                            Eastern Cape, 5200
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </section>

                {/* Footer */}
                <div className="border-t pt-8 mt-12">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="text-sm text-gray-600">
                      <p>This Refund and Cancellation Policy is effective as of March 11, 2025</p>
                      <p className="mt-1">
                        © 2024 EduEasy (CAP South Africa). All rights reserved.
                      </p>
                      <p className="mt-2 font-medium">
                        By using our Services, you acknowledge that you have read, understood, and
                        agree to be bound by this Refund and Cancellation Policy.
                      </p>
                    </div>
                    <Button
                      onClick={() => navigate('/')}
                      className="bg-cap-teal hover:bg-cap-teal/90"
                    >
                      Return to EduEasy
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
