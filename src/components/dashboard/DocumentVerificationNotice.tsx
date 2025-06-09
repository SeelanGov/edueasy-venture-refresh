
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertTriangle, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const DocumentVerificationNotice = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState([
    { name: 'ID Document', status: 'pending', required: true },
    { name: 'Proof of Residence', status: 'verified', required: true },
    { name: 'Academic Transcripts', status: 'rejected', required: true },
    { name: 'CV/Resume', status: 'pending', required: false },
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Upload className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'verified':
        return 'Verified';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Pending';
    }
  };

  const pendingDocs = documents.filter(doc => doc.status === 'pending' && doc.required);
  const rejectedDocs = documents.filter(doc => doc.status === 'rejected');

  if (pendingDocs.length === 0 && rejectedDocs.length === 0) {
    return null;
  }

  return (
    <Card className="mb-6 border-yellow-200 bg-yellow-50">
      <CardHeader>
        <CardTitle className="flex items-center text-yellow-800">
          <AlertTriangle className="h-5 w-5 mr-2" />
          Document Verification Required
        </CardTitle>
        <CardDescription className="text-yellow-700">
          Please upload and verify the required documents to continue with your applications.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {pendingDocs.map((doc, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border">
              <div className="flex items-center">
                {getStatusIcon(doc.status)}
                <span className="ml-3 font-medium">{doc.name}</span>
              </div>
              <span className="text-sm text-yellow-600">{getStatusText(doc.status)}</span>
            </div>
          ))}
          {rejectedDocs.map((doc, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-200">
              <div className="flex items-center">
                {getStatusIcon(doc.status)}
                <span className="ml-3 font-medium">{doc.name}</span>
              </div>
              <span className="text-sm text-red-600">{getStatusText(doc.status)}</span>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">
            Upload Documents
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
