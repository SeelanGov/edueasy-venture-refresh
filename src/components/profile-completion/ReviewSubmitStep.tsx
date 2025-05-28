import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/Spinner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useProfileCompletionStore } from '@/hooks/useProfileCompletionStore';
import { toast } from '@/components/ui/use-toast';
import { CheckCircle, AlertCircle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { parseError } from '@/utils/errorHandler';
import { logError } from '@/utils/logging';

interface ReviewSubmitStepProps {
  onBack: () => void;
}

export const ReviewSubmitStep = ({ onBack }: ReviewSubmitStepProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { personalInfo, contactInfo, addressInfo, educationInfo, documents, resetFormData } =
    useProfileCompletionStore();

  const handleSubmit = async () => {
    if (!user) return;
    setIsSubmitting(true);
    setError(null);
    try {
      // Update user profile status
      const { error: statusError } = await supabase
        .from('users')
        .update({
          profile_status: 'complete',
        })
        .eq('id', user.id);
      if (statusError) throw statusError;
      // Success
      toast({
        title: 'Profile completed',
        description: 'Your profile has been submitted successfully!',
      });
      // Reset form data
      resetFormData();
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      const parsed = parseError(err);
      logError(parsed);
      setError(parsed.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderPersonalInfo = () => {
    return (
      <div>
        <p>
          <strong>Full Name:</strong> {personalInfo.fullName}
        </p>
        <p>
          <strong>ID Number:</strong> {personalInfo.idNumber}
        </p>
        <p>
          <strong>Gender:</strong> {personalInfo.gender}
        </p>
      </div>
    );
  };

  const renderContactInfo = () => {
    return (
      <div className="space-y-2">
        <p>
          <strong>Phone Number:</strong> {contactInfo.phoneNumber}
        </p>
        <p>
          <strong>Email:</strong> {contactInfo.contactEmail}
        </p>
        <div className="pt-2">
          <p className="font-semibold">Emergency Contact</p>
          <p>
            <strong>Name:</strong> {contactInfo.emergencyContactName}
          </p>
          <p>
            <strong>Phone:</strong> {contactInfo.emergencyContactPhone}
          </p>
        </div>
      </div>
    );
  };

  const renderAddressInfo = () => {
    return (
      <div className="space-y-2">
        <p>
          <strong>Address Type:</strong>{' '}
          {addressInfo.addressType === 'residential' ? 'Residential' : 'Postal'}
        </p>
        <p>
          <strong>Street Address:</strong> {addressInfo.streetAddress}
        </p>
        <p>
          <strong>Suburb:</strong> {addressInfo.suburb}
        </p>
        <p>
          <strong>City:</strong> {addressInfo.city}
        </p>
        <p>
          <strong>Province:</strong> {addressInfo.province}
        </p>
        <p>
          <strong>Postal Code:</strong> {addressInfo.postalCode}
        </p>
      </div>
    );
  };

  const renderEducationInfo = () => {
    return (
      <div className="space-y-4">
        <div>
          <p>
            <strong>School Name:</strong> {educationInfo.schoolName}
          </p>
          <p>
            <strong>Province:</strong> {educationInfo.province}
          </p>
          <p>
            <strong>Year of Completion:</strong> {educationInfo.completionYear}
          </p>
        </div>

        <div>
          <p className="font-semibold mb-2">Grade 11 Subjects</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left pb-2">Subject</th>
                <th className="text-right pb-2">Mark (%)</th>
              </tr>
            </thead>
            <tbody>
              {educationInfo.grade11Subjects?.map((subject, index) => (
                <tr key={index} className="border-b last:border-0">
                  <td className="py-1">{subject.subject}</td>
                  <td className="text-right py-1">{subject.mark}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <p className="font-semibold mb-2">Grade 12 Subjects</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left pb-2">Subject</th>
                <th className="text-right pb-2">Mark (%)</th>
              </tr>
            </thead>
            <tbody>
              {educationInfo.grade12Subjects?.map((subject, index) => (
                <tr key={index} className="border-b last:border-0">
                  <td className="py-1">{subject.subject}</td>
                  <td className="text-right py-1">{subject.mark}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderDocuments = () => {
    return (
      <div className="space-y-2">
        <div className="flex items-center">
          <CheckCircle className="text-green-500 mr-2 h-5 w-5" />
          <span>ID Document</span>
        </div>
        <div className="flex items-center">
          <CheckCircle className="text-green-500 mr-2 h-5 w-5" />
          <span>Proof of Residence</span>
        </div>
        <div className="flex items-center">
          <CheckCircle className="text-green-500 mr-2 h-5 w-5" />
          <span>Grade 11 Results</span>
        </div>
        <div className="flex items-center">
          <CheckCircle className="text-green-500 mr-2 h-5 w-5" />
          <span>Grade 12 Results</span>
        </div>
      </div>
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Review & Submit</h2>
      <p className="text-gray-600 mb-6">
        Please review your information before submitting. You can go back to any section to make
        changes if needed.
      </p>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="mb-6">
        <CardContent className="pt-6">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="personal" className="border-b">
              <AccordionTrigger>Personal Information</AccordionTrigger>
              <AccordionContent>{renderPersonalInfo()}</AccordionContent>
            </AccordionItem>

            <AccordionItem value="contact" className="border-b">
              <AccordionTrigger>Contact Information</AccordionTrigger>
              <AccordionContent>{renderContactInfo()}</AccordionContent>
            </AccordionItem>

            <AccordionItem value="address" className="border-b">
              <AccordionTrigger>Address Information</AccordionTrigger>
              <AccordionContent>{renderAddressInfo()}</AccordionContent>
            </AccordionItem>

            <AccordionItem value="education" className="border-b">
              <AccordionTrigger>Education History</AccordionTrigger>
              <AccordionContent>{renderEducationInfo()}</AccordionContent>
            </AccordionItem>

            <AccordionItem value="documents">
              <AccordionTrigger>Documents</AccordionTrigger>
              <AccordionContent>{renderDocuments()}</AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            <AlertCircle className="h-5 w-5 text-amber-500" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium">Important Information</h3>
            <div className="mt-2 text-sm text-gray-600">
              <p>By submitting this profile, you confirm that:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>All information provided is accurate and complete</li>
                <li>You authorize EduEasy to verify your information</li>
                <li>You understand that false information may result in disqualification</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="border-cap-teal text-cap-teal hover:bg-cap-teal/10"
        >
          Back
        </Button>

        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-cap-coral hover:bg-cap-coral/90"
        >
          {isSubmitting ? <Spinner size="sm" className="mr-2" /> : null}
          {isSubmitting ? 'Submitting...' : 'Submit Profile'}
        </Button>
      </div>
    </div>
  );
};
