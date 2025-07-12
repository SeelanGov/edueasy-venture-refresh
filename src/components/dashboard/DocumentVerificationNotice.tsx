import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import { useAuth } from '@/hooks/useAuth';
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
        return <CheckCircle className="h-5 w-5 text-success" />;
      case 'rejected':
        return <AlertTriangle className="h-5 w-5 text-error" />;
      default:
        return <Upload className="h-5 w-5 text-warning" />;
    }
  };

  const getStatusBadgeType = (status: string) => {
    switch (status) {
      case 'verified':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'pending';
    }
  };

  const pendingDocs = documents.filter((doc) => doc.status === 'pending' && doc.required);
  const rejectedDocs = documents.filter((doc) => doc.status === 'rejected');

  if (pendingDocs.length === 0 && rejectedDocs.length === 0) {
    return null;
  }

  return (
    <Card className="mb-6 border-warning-light bg-warning-light">
      <CardHeader>
        <CardTitle className="flex items-center text-warning-dark">
          <AlertTriangle className="h-5 w-5 mr-2" />
          Document Verification Required
        </CardTitle>
        <CardDescription className="text-warning-dark">
          Please upload and verify the required documents to continue with your applications.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {pendingDocs.map((doc, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
            >
              <div className="flex items-center">
                {getStatusIcon(doc.status)}
                <span className="ml-3 font-medium text-gray-800">{doc.name}</span>
              </div>
              <StatusBadge status={getStatusBadgeType(doc.status)}>
                {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
              </StatusBadge>
            </div>
          ))}
          {rejectedDocs.map((doc, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-white rounded-lg border border-error-light"
            >
              <div className="flex items-center">
                {getStatusIcon(doc.status)}
                <span className="ml-3 font-medium text-gray-800">{doc.name}</span>
              </div>
              <StatusBadge status={getStatusBadgeType(doc.status)}>
                {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
              </StatusBadge>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <Button size="sm" variant="primary" className="bg-warning hover:bg-warning-dark">
            Upload Documents
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
