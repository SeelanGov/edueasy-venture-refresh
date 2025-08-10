import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Typography } from '@/components/ui/typography';
import { ArrowLeft, Download, ExternalLink } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
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
    { id: 'information-we-collect', title: '2. Information We Collect' },
    { id: 'how-we-use-information', title: '3. How We Use Your Information' },
    { id: 'disclosure-information', title: '4. Disclosure of Your Information' },
    { id: 'cross-border-transfers', title: '5. Cross-Border Transfers' },
    { id: 'data-security', title: '6. Data Security' },
    { id: 'data-retention', title: '7. Data Retention' },
    { id: 'privacy-rights', title: '8. Your Privacy Rights' },
    { id: 'childrens-privacy', title: "9. Children's Privacy" },
    { id: 'cookies-tracking', title: '10. Cookies and Tracking Technologies' },
    { id: 'third-party-websites', title: '11. Third-Party Websites' },
    { id: 'policy-changes', title: '12. Changes to This Privacy Notice' },
    { id: 'contact-us', title: '13. Contact Us' },
    { id: 'complaints', title: '14. Complaints' },
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
                  Privacy Policy
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
                      EduEasy, operated by CAP (South Africa) ("we", "us", "our", or "EduEasy"),
                      respects your privacy and is committed to protecting your personal
                      information. This Privacy Notice explains how we collect, use, disclose, and
                      safeguard your information when you use our platform and services.
                    </p>
                    <p>
                      This Notice applies to all information collected through our website
                      (www.edueasy.co), mobile application, USSD service, SMS service, call center
                      interactions, and any related services, sales, marketing, or events
                      (collectively, the "Services").
                    </p>
                  </div>
                </section>

                <Separator className="my-8" />

                {/* Section 2: Information We Collect */}
                <section
                  id="information-we-collect"
                  data-section="information-we-collect"
                  className="mb-12">
                  <Typography variant="h2" className="text-cap-teal mb-6">
                    2. INFORMATION WE COLLECT
                  </Typography>
                  <div className="prose prose-gray max-w-none space-y-6">
                    <p>
                      We collect personal information that you voluntarily provide to us when you:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Register on our platform.</li>
                      <li>
                        Express interest in obtaining information about us or our products and
                        Services.
                      </li>
                      <li>Participate in activities on our Services.</li>
                      <li>
                        Apply to educational institutions or funding opportunities through our
                        platform.
                      </li>
                    </ul>

                    <Typography variant="h3" className="text-gray-800 mt-8 mb-4">
                      2.1 Personal Information
                    </Typography>
                    <p>Depending on how you interact with our Services, we may collect:</p>

                    <div className="grid md:grid-cols-2 gap-6 mt-6">
                      <Card className="border-l-4 border-l-cap-teal">
                        <CardContent className="p-4">
                          <Typography variant="h4" className="mb-3 text-cap-teal">
                            Identity Information
                          </Typography>
                          <ul className="text-sm space-y-1">
                            <li>• Full name</li>
                            <li>• Date of birth</li>
                            <li>• Identity number/passport number</li>
                            <li>• Gender</li>
                            <li>• Nationality</li>
                            <li>• Photographs</li>
                          </ul>
                        </CardContent>
                      </Card>

                      <Card className="border-l-4 border-l-cap-coral">
                        <CardContent className="p-4">
                          <Typography variant="h4" className="mb-3 text-cap-coral">
                            Contact Information
                          </Typography>
                          <ul className="text-sm space-y-1">
                            <li>• Email address</li>
                            <li>• Telephone number</li>
                            <li>• Physical address</li>
                            <li>• Postal address</li>
                          </ul>
                        </CardContent>
                      </Card>

                      <Card className="border-l-4 border-l-blue-500">
                        <CardContent className="p-4">
                          <Typography variant="h4" className="mb-3 text-blue-600">
                            Education Information
                          </Typography>
                          <ul className="text-sm space-y-1">
                            <li>• Academic records and transcripts</li>
                            <li>• Qualifications</li>
                            <li>• School/institution attendance history</li>
                            <li>• Academic performance data</li>
                            <li>• Standardized test scores</li>
                          </ul>
                        </CardContent>
                      </Card>

                      <Card className="border-l-4 border-l-green-500">
                        <CardContent className="p-4">
                          <Typography variant="h4" className="mb-3 text-green-600">
                            Financial Information
                          </Typography>
                          <ul className="text-sm space-y-1">
                            <li>• Household income information</li>
                            <li>• Banking details (for funding disbursements)</li>
                            <li>• Financial aid eligibility information</li>
                          </ul>
                        </CardContent>
                      </Card>
                    </div>

                    <Typography variant="h3" className="text-gray-800 mt-8 mb-4">
                      2.2 Information Collected Through Automated Technologies
                    </Typography>
                    <p>
                      When you use our Services, we may use cookies, server logs, web beacons, and
                      other similar technologies to collect device and usage information, browser
                      characteristics, operating system details, language preferences, and
                      information about how you interact with our Services.
                    </p>
                  </div>
                </section>

                <Separator className="my-8" />

                {/* Section 3: How We Use Your Information */}
                <section
                  id="how-we-use-information"
                  data-section="how-we-use-information"
                  className="mb-12">
                  <Typography variant="h2" className="text-cap-teal mb-6">
                    3. HOW WE USE YOUR INFORMATION
                  </Typography>
                  <div className="prose prose-gray max-w-none space-y-6">
                    <Typography variant="h3" className="text-gray-800">
                      3.1 Core Service Provision
                    </Typography>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Processing university, TVET, and SETA applications</li>
                      <li>Matching you with appropriate funding opportunities</li>
                      <li>Providing career guidance through our "Thandi" AI Agent</li>
                      <li>Facilitating internship and employment opportunities</li>
                      <li>Managing your account and providing customer support</li>
                    </ul>

                    <Typography variant="h3" className="text-gray-800">
                      3.2 Business Operations
                    </Typography>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Improving our Services</li>
                      <li>Marketing and communicating with you about our Services</li>
                      <li>Protecting our rights and interests</li>
                      <li>Complying with legal obligations</li>
                    </ul>

                    <Typography variant="h3" className="text-gray-800">
                      3.3 Legal Bases for Processing
                    </Typography>
                    <p>We process your information based on:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Your consent</li>
                      <li>Necessity for performance of our contract with you</li>
                      <li>Compliance with legal obligations</li>
                      <li>Legitimate interests which do not override your fundamental rights</li>
                    </ul>
                  </div>
                </section>

                <Separator className="my-8" />

                {/* Section 8: Your Privacy Rights */}
                <section id="privacy-rights" data-section="privacy-rights" className="mb-12">
                  <Typography variant="h2" className="text-cap-teal mb-6">
                    8. YOUR PRIVACY RIGHTS
                  </Typography>
                  <div className="prose prose-gray max-w-none space-y-4">
                    <p>Under POPIA, you have the right to:</p>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <ul className="grid md:grid-cols-2 gap-3 text-sm">
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-cap-teal rounded-full"></span>
                          Be informed about how we process your personal information
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-cap-teal rounded-full"></span>
                          Access your personal information
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-cap-teal rounded-full"></span>
                          Correct inaccurate or incomplete personal information
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-cap-teal rounded-full"></span>
                          Request deletion of your personal information
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-cap-teal rounded-full"></span>
                          Object to processing of your personal information
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-cap-teal rounded-full"></span>
                          Restrict processing of your personal information
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-cap-teal rounded-full"></span>
                          Data portability
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-cap-teal rounded-full"></span>
                          Withdraw consent
                        </li>
                      </ul>
                    </div>
                    <p className="mt-4">
                      To exercise any of these rights, please contact us using the details provided
                      below.
                    </p>
                  </div>
                </section>

                <Separator className="my-8" />

                {/* Section 13: Contact Us */}
                <section id="contact-us" data-section="contact-us" className="mb-12">
                  <Typography variant="h2" className="text-cap-teal mb-6">
                    13. CONTACT US
                  </Typography>
                  <div className="prose prose-gray max-w-none">
                    <p>
                      If you have questions or comments about this Privacy Notice, your personal
                      information, our use and disclosure practices, or your consent choices, please
                      contact us at:
                    </p>
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
                            <strong>Phone:</strong> [Phone number to be updated]
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

                <Separator className="my-8" />

                {/* Section 14: Complaints */}
                <section id="complaints" data-section="complaints" className="mb-12">
                  <Typography variant="h2" className="text-cap-teal mb-6">
                    14. COMPLAINTS
                  </Typography>
                  <div className="prose prose-gray max-w-none">
                    <p>
                      If you have a complaint about how we handle your personal information, please
                      contact our Information Officer. If you are not satisfied with our response,
                      you have the right to lodge a complaint with the Information Regulator:
                    </p>
                    <Card className="mt-6">
                      <CardContent className="p-6">
                        <Typography variant="h4" className="mb-4">
                          The Information Regulator (South Africa)
                        </Typography>
                        <div className="space-y-2 text-sm">
                          <div>
                            <strong>Physical Address:</strong> JD House, 27 Stiemens Street,
                            Braamfontein, Johannesburg, 2001
                          </div>
                          <div>
                            <strong>Postal Address:</strong> P.O. Box 31533, Braamfontein,
                            Johannesburg, 2017
                          </div>
                          <div>
                            <strong>Email:</strong> inforeg@justice.gov.za /
                            complaints.IR@justice.gov.za
                          </div>
                          <div>
                            <strong>Website:</strong>
                            <a
                              href="https://www.justice.gov.za/inforeg"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-cap-teal hover:underline ml-2 inline-flex items-center gap-1">
                              https://www.justice.gov.za/inforeg
                              <ExternalLink className="h-3 w-3" />
                            </a>
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
                      <p>This Privacy Policy is effective as of March 11, 2025</p>
                      <p className="mt-1">
                        © 2024 EduEasy (CAP South Africa). All rights reserved.
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

export default PrivacyPolicy;
