import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Typography } from '@/components/ui/typography';
import { ArrowLeft, Download } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CardContent } from '@/components/ui/card';

const TermsOfService = () => {
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
    { id: 'definitions', title: '2. Definitions' },
    { id: 'eligibility-registration', title: '3. Eligibility and Account Registration' },
    { id: 'services-description', title: '4. Services Description' },
    { id: 'user-conduct', title: '5. User Conduct' },
    { id: 'intellectual-property', title: '6. Intellectual Property Rights' },
    { id: 'user-content', title: '7. User Content' },
    { id: 'privacy-data-protection', title: '8. Privacy and Data Protection' },
    { id: 'third-party-services', title: '9. Third-Party Services and Links' },
    { id: 'payments-fees', title: '10. Payments and Fees' },
    { id: 'limitation-liability', title: '11. Limitation of Liability' },
    { id: 'indemnification', title: '12. Indemnification' },
    { id: 'term-termination', title: '13. Term and Termination' },
    { id: 'changes-terms', title: '14. Changes to Terms' },
    { id: 'general-provisions', title: '15. General Provisions' },
    { id: 'information-rights', title: '16. Information Rights and Access' },
    { id: 'contact-information', title: '17. Contact Information' },
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
                className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <div>
                <Typography variant="h3" className="text-cap-teal">
                  Terms of Service
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
                      size="sm">
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
                      These Terms and Conditions ("Terms") govern your access to and use of the
                      services offered by EduEasy, operated by CAP (South Africa) (Registration
                      Number: 2025/120934/07) ("we", "us", "our", or "EduEasy"), including our
                      website (www.edueasy.co), mobile application, USSD service, SMS service, call
                      center interactions, and any related services (collectively, the "Services").
                    </p>
                    <p>
                      By accessing or using our Services, you agree to be bound by these Terms. If
                      you do not agree to these Terms, please do not use our Services.
                    </p>
                  </div>
                </section>

                <Separator className="my-8" />

                {/* Section 2: Definitions */}
                <section id="definitions" data-section="definitions" className="mb-12">
                  <Typography variant="h2" className="text-cap-teal mb-6">
                    2. DEFINITIONS
                  </Typography>
                  <div className="prose prose-gray max-w-none space-y-4">
                    <p>In these Terms:</p>
                    <ul className="space-y-2 pl-6">
                      <li>
                        <strong>"Account"</strong> means a registered account on our platform.
                      </li>
                      <li>
                        <strong>"Content"</strong> means all information, text, materials, images,
                        data, links, software, or other material accessible through the Services.
                      </li>
                      <li>
                        <strong>"User", "you", or "your"</strong> means any person who accesses or
                        uses the Services.
                      </li>
                      <li>
                        <strong>"Educational Institutions"</strong> means universities, TVET
                        colleges, and other learning institutions accessible through our platform.
                      </li>
                      <li>
                        <strong>"Funding Providers"</strong> means NSFAS, SETAs, bursary providers,
                        and other financial aid entities.
                      </li>
                    </ul>
                  </div>
                </section>

                <Separator className="my-8" />

                {/* Section 3: Eligibility and Account Registration */}
                <section
                  id="eligibility-registration"
                  data-section="eligibility-registration"
                  className="mb-12">
                  <Typography variant="h2" className="text-cap-teal mb-6">
                    3. ELIGIBILITY AND ACCOUNT REGISTRATION
                  </Typography>
                  <div className="prose prose-gray max-w-none space-y-6">
                    <Typography variant="h3" className="text-gray-800">
                      3.1 Eligibility
                    </Typography>
                    <p>To use our Services, you must:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>
                        Be at least 18 years old, or if under 18, have parental/guardian consent.
                      </li>
                      <li>Possess the legal authority to enter into a binding agreement.</li>
                      <li>Not be prohibited from using the Services under applicable laws.</li>
                    </ul>

                    <Typography variant="h3" className="text-gray-800">
                      3.2 Account Registration
                    </Typography>
                    <p>When registering an account, you must:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Provide accurate, current, and complete information.</li>
                      <li>Maintain and update your information as necessary.</li>
                      <li>Keep your password confidential and secure.</li>
                      <li>Notify us immediately of any unauthorized access to your account.</li>
                    </ul>

                    <Typography variant="h3" className="text-gray-800">
                      3.3 Account Responsibilities
                    </Typography>
                    <p>You are responsible for:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>All activities that occur under your account.</li>
                      <li>Ensuring that your use of the Services complies with these Terms.</li>
                      <li>Maintaining the confidentiality of your login credentials.</li>
                    </ul>
                  </div>
                </section>

                <Separator className="my-8" />

                {/* Section 4: Services Description */}
                <section
                  id="services-description"
                  data-section="services-description"
                  className="mb-12">
                  <Typography variant="h2" className="text-cap-teal mb-6">
                    4. SERVICES DESCRIPTION
                  </Typography>
                  <div className="prose prose-gray max-w-none space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <Card className="border-l-4 border-l-cap-teal">
                        <CardContent className="p-6">
                          <Typography variant="h3" className="text-cap-teal mb-4">
                            4.1 Educational Application Services
                          </Typography>
                          <p className="mb-3">EduEasy provides:</p>
                          <ul className="text-sm space-y-2">
                            <li>
                              • A platform for processing university, TVET college, and SETA
                              applications
                            </li>
                            <li>• Information about educational institutions and courses</li>
                            <li>• Application status tracking</li>
                          </ul>
                        </CardContent>
                      </Card>

                      <Card className="border-l-4 border-l-cap-coral">
                        <CardContent className="p-6">
                          <Typography variant="h3" className="text-cap-coral mb-4">
                            4.2 Funding Matching Services
                          </Typography>
                          <p className="mb-3">Our platform offers:</p>
                          <ul className="text-sm space-y-2">
                            <li>• Matching with appropriate funding opportunities</li>
                            <li>• Information about funding eligibility criteria</li>
                            <li>
                              • Application assistance for NSFAS, bursaries, and other financial aid
                            </li>
                          </ul>
                        </CardContent>
                      </Card>

                      <Card className="border-l-4 border-l-blue-500">
                        <CardContent className="p-6">
                          <Typography variant="h3" className="text-blue-600 mb-4">
                            4.3 Career Guidance
                          </Typography>
                          <p className="mb-3">We provide:</p>
                          <ul className="text-sm space-y-2">
                            <li>• Career guidance through our "Thandi" AI Agent</li>
                            <li>• Information about various career paths and opportunities</li>
                            <li>• Skills assessment tools</li>
                          </ul>
                        </CardContent>
                      </Card>

                      <Card className="border-l-4 border-l-green-500">
                        <CardContent className="p-6">
                          <Typography variant="h3" className="text-green-600 mb-4">
                            4.4 Work Opportunities
                          </Typography>
                          <p className="mb-3">Our platform facilitates:</p>
                          <ul className="text-sm space-y-2">
                            <li>• Access to internship opportunities</li>
                            <li>• Employment connections</li>
                            <li>• Work-integrated learning placements</li>
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </section>

                <Separator className="my-8" />

                {/* Section 5: User Conduct */}
                <section id="user-conduct" data-section="user-conduct" className="mb-12">
                  <Typography variant="h2" className="text-cap-teal mb-6">
                    5. USER CONDUCT
                  </Typography>
                  <div className="prose prose-gray max-w-none space-y-6">
                    <Typography variant="h3" className="text-gray-800">
                      5.1 Prohibited Activities
                    </Typography>
                    <p>You agree not to:</p>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <ul className="grid md:grid-cols-2 gap-2 text-sm">
                        <li className="flex items-start gap-2">
                          <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                          Violate any applicable laws or regulations
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                          Infringe upon the rights of others
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                          Submit false, misleading, or fraudulent information
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                          Use the Services for any unauthorized or illegal purpose
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                          Attempt to gain unauthorized access to any part of the Services
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                          Interfere with or disrupt the integrity or performance of the Services
                        </li>
                      </ul>
                    </div>

                    <Typography variant="h3" className="text-gray-800">
                      5.2 Content Guidelines
                    </Typography>
                    <p>All content you submit must:</p>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          Be accurate and not misleading
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          Not infringe on any third party's rights
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          Not contain any offensive, harmful, or inappropriate material
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          Comply with all applicable laws and regulations
                        </li>
                      </ul>
                    </div>
                  </div>
                </section>

                <Separator className="my-8" />

                {/* Section 8: Privacy and Data Protection */}
                <section
                  id="privacy-data-protection"
                  data-section="privacy-data-protection"
                  className="mb-12">
                  <Typography variant="h2" className="text-cap-teal mb-6">
                    8. PRIVACY AND DATA PROTECTION
                  </Typography>
                  <div className="prose prose-gray max-w-none space-y-4">
                    <Typography variant="h3" className="text-gray-800">
                      8.1 Privacy Notice
                    </Typography>
                    <p>
                      Our Privacy Notice, available at{' '}
                      <a href="/privacy-policy" className="text-cap-teal hover:underline">
                        www.edueasy.co/privacy
                      </a>
                      , forms part of these Terms and explains how we collect, use, and protect your
                      personal information.
                    </p>

                    <Typography variant="h3" className="text-gray-800">
                      8.2 Data Processing
                    </Typography>
                    <p>
                      We process your personal information in accordance with the Protection of
                      Personal Information Act 4 of 2013 (POPIA) and other applicable data
                      protection laws.
                    </p>

                    <Typography variant="h3" className="text-gray-800">
                      8.3 Cross-Border Transfers
                    </Typography>
                    <p>
                      We may transfer your personal information to countries outside South Africa
                      for processing or storage, subject to appropriate safeguards as outlined in
                      our Privacy Notice.
                    </p>
                  </div>
                </section>

                <Separator className="my-8" />

                {/* Section 10: Payments and Fees */}
                <section id="payments-fees" data-section="payments-fees" className="mb-12">
                  <Typography variant="h2" className="text-cap-teal mb-6">
                    10. PAYMENTS AND FEES
                  </Typography>
                  <div className="prose prose-gray max-w-none space-y-6">
                    <Typography variant="h3" className="text-gray-800">
                      10.1 Payment Terms
                    </Typography>
                    <p>
                      Payment for Services must be made in advance using the payment methods
                      available on our platform. All fees are quoted in South African Rand (ZAR)
                      unless otherwise specified.
                    </p>

                    <Typography variant="h3" className="text-gray-800">
                      10.2 Subscription Services
                    </Typography>
                    <p>
                      Some Services are offered on a subscription basis with once-off payments.
                      Subscription fees are non-refundable except as outlined in our Refund and
                      Cancellation Policy.
                    </p>

                    <Typography variant="h3" className="text-gray-800">
                      10.3 Price Changes
                    </Typography>
                    <p>
                      We reserve the right to modify our pricing at any time. Price changes will not
                      affect existing subscriptions until renewal.
                    </p>

                    <Typography variant="h3" className="text-gray-800">
                      10.4 Refunds and Cancellations
                    </Typography>
                    <div className="bg-cap-teal/5 border border-cap-teal/20 rounded-lg p-6">
                      <p>
                        Our refund and cancellation procedures are governed by our comprehensive{' '}
                        <Link
                          to="/refund-policy"
                          className="text-cap-teal hover:underline font-medium">
                          Refund and Cancellation Policy
                        </Link>
                        , which forms part of these Terms and Conditions. Please review this policy
                        carefully to understand your rights and our procedures regarding refunds and
                        cancellations.
                      </p>
                    </div>
                  </div>
                </section>

                <Separator className="my-8" />

                {/* Section 11: Limitation of Liability */}
                <section
                  id="limitation-liability"
                  data-section="limitation-liability"
                  className="mb-12">
                  <Typography variant="h2" className="text-cap-teal mb-6">
                    11. LIMITATION OF LIABILITY
                  </Typography>
                  <div className="prose prose-gray max-w-none space-y-6">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                      <Typography variant="h3" className="text-yellow-800 mb-4">
                        11.1 Disclaimer of Warranties
                      </Typography>
                      <p className="text-sm">
                        The Services are provided "as is" and "as available" without warranties of
                        any kind, either express or implied, including but not limited to warranties
                        of merchantability, fitness for a particular purpose, or non-infringement.
                      </p>
                    </div>

                    <Typography variant="h3" className="text-gray-800">
                      11.2 Limitation of Liability
                    </Typography>
                    <p>
                      To the maximum extent permitted by law, EduEasy shall not be liable for any
                      indirect, incidental, special, consequential, or punitive damages, including
                      loss of profits, data, or use, arising out of or in connection with these
                      Terms or the use of the Services.
                    </p>

                    <Typography variant="h3" className="text-gray-800">
                      11.3 Cap on Liability
                    </Typography>
                    <p>
                      Our total liability arising out of or relating to these Terms or the Services
                      shall not exceed the amount you have paid us (if any) for the Services in the
                      six months preceding the event giving rise to the liability.
                    </p>
                  </div>
                </section>

                <Separator className="my-8" />

                {/* Section 15: General Provisions */}
                <section
                  id="general-provisions"
                  data-section="general-provisions"
                  className="mb-12">
                  <Typography variant="h2" className="text-cap-teal mb-6">
                    15. GENERAL PROVISIONS
                  </Typography>
                  <div className="prose prose-gray max-w-none space-y-6">
                    <Typography variant="h3" className="text-gray-800">
                      15.1 Entire Agreement
                    </Typography>
                    <p>
                      These Terms, together with our Privacy Notice and any other legal notices
                      published by us, constitute the entire agreement between you and EduEasy
                      concerning the Services.
                    </p>

                    <Typography variant="h3" className="text-gray-800">
                      15.2 Governing Law
                    </Typography>
                    <p>
                      These Terms shall be governed by and construed in accordance with the laws of
                      the Republic of South Africa, without regard to its conflict of law
                      principles.
                    </p>

                    <Typography variant="h3" className="text-gray-800">
                      15.3 Dispute Resolution
                    </Typography>
                    <p>
                      Any dispute arising out of or relating to these Terms or the Services shall be
                      resolved in the courts of the Republic of South Africa.
                    </p>
                  </div>
                </section>

                <Separator className="my-8" />

                {/* Section 17: Contact Information */}
                <section
                  id="contact-information"
                  data-section="contact-information"
                  className="mb-12">
                  <Typography variant="h2" className="text-cap-teal mb-6">
                    17. CONTACT INFORMATION
                  </Typography>
                  <div className="prose prose-gray max-w-none">
                    <p>If you have any questions about these Terms, please contact us at:</p>
                    <Card className="bg-cap-teal/5 border-cap-teal/20 mt-6">
                      <CardContent className="p-6">
                        <div className="space-y-3">
                          <div>
                            <strong>Information Officer:</strong> Vuyile Mpaka
                          </div>
                          <div>
                            <strong>Email:</strong>{' '}
                            <a
                              href="mailto:info@edueasy.co"
                              className="text-cap-teal hover:underline">
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
                      <p>These Terms and Conditions are effective as of March 11, 2025</p>
                      <p className="mt-1">
                        © 2024 EduEasy (CAP South Africa). All rights reserved.
                      </p>
                      <p className="mt-2 font-medium">
                        By using our Services, you acknowledge that you have read, understood, and
                        agree to be bound by these Terms and Conditions.
                      </p>
                    </div>
                    <Button
                      onClick={() => navigate('/')}
                      className="bg-cap-teal hover:bg-cap-teal/90">
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

export default TermsOfService;
