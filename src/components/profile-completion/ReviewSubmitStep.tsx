
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProfileCompletionStore } from '@/hooks/useProfileCompletionStore';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { parseError } from '@/utils/errorHandler';
import { logError } from '@/utils/logging';

export const ReviewSubmitStep = ({ onBack }: { onBack: () => void }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    personalInfo,
    contactInfo,
    addressInfo,
    educationInfo,
    documents,
    isDataSaved,
    setDataSaved,
  } = useProfileCompletionStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!user) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // Update user profile in Supabase
      const { error: userError } = await supabase
        .from('users')
        .update({
          full_name: personalInfo.fullName,
          id_number: personalInfo.idNumber,
          phone_number: contactInfo.phoneNumber,
          contact_email: contactInfo.contactEmail || contactInfo.email,
          emergency_contact_name: contactInfo.emergencyContactName,
          emergency_contact_phone: contactInfo.emergencyContactPhone,
        })
        .eq('id', user.id);

      if (userError) throw userError;

      // Handle document uploads
      if (documents && Array.isArray(documents) && documents.length > 0) {
        for (const doc of documents) {
          if (doc.file) {
            const filePath = `users/${user.id}/documents/${doc.file.name}`;
            const { error: uploadError } = await supabase.storage
              .from('user_documents')
              .upload(filePath, doc.file, { upsert: true });

            if (uploadError) throw uploadError;
          }
        }
      }

      // Clear saved data and redirect
      setDataSaved(false);
      toast({
        title: 'Profile Complete',
        description: 'Your profile has been successfully completed!',
      });
      navigate('/dashboard');
    } catch (err) {
      const parsed = parseError(err);
      logError(parsed);
      setError(parsed.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Review and Submit</h2>
      {error && (
        <div className="text-red-500 p-2 mb-2 text-center" role="alert" aria-live="assertive">
          {error}
        </div>
      )}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Review your personal details.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Full Name:</strong> {personalInfo.fullName}
          </p>
          <p>
            <strong>ID Number:</strong> {personalInfo.idNumber}
          </p>
          <p>
            <strong>Gender:</strong> {personalInfo.gender}
          </p>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>Verify your contact details.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Phone Number:</strong> {contactInfo.phoneNumber}
          </p>
          <p>
            <strong>Email:</strong> {contactInfo.contactEmail || contactInfo.email}
          </p>
          {contactInfo.emergencyContactName && (
            <div className="mt-2">
              <p className="font-semibold">Emergency Contact</p>
              <p><strong>Name:</strong> {contactInfo.emergencyContactName}</p>
              <p><strong>Phone:</strong> {contactInfo.emergencyContactPhone}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Address Information</CardTitle>
          <CardDescription>Confirm your address is correct.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Street Address:</strong> {addressInfo.streetAddress}
          </p>
          {addressInfo.suburb && (
            <p>
              <strong>Suburb:</strong> {addressInfo.suburb}
            </p>
          )}
          <p>
            <strong>City:</strong> {addressInfo.city}
          </p>
          <p>
            <strong>Province:</strong> {addressInfo.province}
          </p>
          <p>
            <strong>Postal Code:</strong> {addressInfo.postalCode}
          </p>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Education History</CardTitle>
          <CardDescription>Check your education history.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            <strong>School Name:</strong> {educationInfo.schoolName}
          </p>
          <p>
            <strong>Province:</strong> {educationInfo.province}
          </p>
          <p>
            <strong>Completion Year:</strong> {educationInfo.completionYear}
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Uploaded Documents</CardTitle>
          <CardDescription>Ensure all documents are correct.</CardDescription>
        </CardHeader>
        <CardContent>
          {documents && Array.isArray(documents) && documents.length > 0 ? (
            <ul>
              {documents.map((doc, index) => (
                <li key={index}>
                  {doc.type}: {doc.file ? doc.file.name : 'No file selected'}
                </li>
              ))}
            </ul>
          ) : (
            <p>No documents uploaded.</p>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </>
          ) : (
            'Submit'
          )}
        </Button>
      </div>
    </div>
  );
};
