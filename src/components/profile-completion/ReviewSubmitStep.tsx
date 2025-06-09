import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProfileCompletionStore } from '@/hooks/useProfileCompletionStore';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
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
          date_of_birth: personalInfo.dateOfBirth,
          gender: personalInfo.gender,
          phone_number: contactInfo.phoneNumber,
          email: contactInfo.email,
          address_line_1: addressInfo.addressLine1,
          address_line_2: addressInfo.addressLine2,
          city: addressInfo.city,
          province: addressInfo.province,
          postal_code: addressInfo.postalCode,
        })
        .eq('id', user.id);

      if (userError) throw userError;

      // Handle document uploads
      if (documents && documents.length > 0) {
        for (const doc of documents) {
          if (doc.file) {
            const filePath = `users/${user.id}/documents/${doc.file.name}`;
            const { error: uploadError } = await supabase.storage
              .from('user_documents')
              .upload(filePath, doc.file, { upsert: true });

            if (uploadError) throw uploadError;

            // Save document metadata to the database
            const { error: docError } = await supabase
              .from('documents')
              .insert({
                user_id: user.id,
                file_path: filePath,
                document_type: doc.type,
                verification_status: 'pending',
              });

            if (docError) throw docError;
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
            <strong>Date of Birth:</strong> {personalInfo.dateOfBirth}
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
            <strong>Email:</strong> {contactInfo.email}
          </p>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Address Information</CardTitle>
          <CardDescription>Confirm your address is correct.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Address Line 1:</strong> {addressInfo.addressLine1}
          </p>
          <p>
            <strong>Address Line 2:</strong> {addressInfo.addressLine2}
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
          {documents && documents.length > 0 ? (
            <ul>
              {documents.map((doc) => (
                <li key={doc.type}>
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
