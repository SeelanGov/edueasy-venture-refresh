
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle } from 'lucide-react';

interface Document {
  id: string;
  user_id: string;
  file_path: string;
  document_type: string | null;
  verification_status: string | null;
  created_at: string;
  rejection_reason: string | null;
}

type Props = {
  documents: Document[];
  updateDocumentStatus: (documentId: string, status: string, rejectionReason?: string) => void;
};

function getStatusBadge(status: string | null) {
  switch (status) {
    case 'approved':
      return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
    case 'rejected':
      return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
    case 'pending':
    default:
      return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
  }
}

export function DocumentVerificationPanel({ documents, updateDocumentStatus }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Document Verification</CardTitle>
        <CardDescription>Review and verify uploaded documents</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {documents.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <p className="font-medium">{doc.document_type || 'Unknown Type'}</p>
                <p className="text-sm text-gray-600">User: {doc.user_id}</p>
                <p className="text-sm text-gray-600">
                  Uploaded: {new Date(doc.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusBadge(doc.verification_status)}
                {doc.verification_status === 'pending' && (
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => updateDocumentStatus(doc.id, 'approved')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => updateDocumentStatus(doc.id, 'rejected', 'Document unclear')}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
