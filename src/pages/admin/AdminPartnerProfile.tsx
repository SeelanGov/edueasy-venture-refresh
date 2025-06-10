
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { usePartner, usePartnerPayments, usePartnerNotes, useUpdatePartner, useCreatePartnerNote } from '@/hooks/usePartnerData';
import { ArrowLeft, Edit, Save, CreditCard, MessageSquare, Building, Globe, Phone, Mail } from 'lucide-react';
import { formatCurrency } from '@/config/subscriptionTiers';
import { StatusBadge } from '@/components/admin/components/StatusBadge';

const AdminPartnerProfile = () => {
  const { partnerId } = useParams();
  const { data: partner } = usePartner(partnerId!);
  const { data: payments } = usePartnerPayments(partnerId);
  const { data: notes } = usePartnerNotes(partnerId!);
  const updatePartner = useUpdatePartner();
  const createNote = useCreatePartnerNote();

  const [isEditing, setIsEditing] = useState(false);
  const [editedPartner, setEditedPartner] = useState(partner);
  const [newNote, setNewNote] = useState('');

  const handleSave = async () => {
    if (editedPartner && partnerId) {
      await updatePartner.mutateAsync({
        id: partnerId,
        ...editedPartner,
      });
      setIsEditing(false);
    }
  };

  const handleAddNote = async () => {
    if (newNote.trim() && partnerId) {
      await createNote.mutateAsync({
        partner_id: partnerId,
        note: newNote,
        note_type: 'general',
      });
      setNewNote('');
    }
  };

  if (!partner) {
    return (
      <AdminLayout title="Partner Profile">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900">Partner not found</h3>
          <Link to="/admin/partners">
            <Button className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Partners
            </Button>
          </Link>
        </div>
      </AdminLayout>
    );
  }

  const getTierBadgeColor = (tier: string) => {
    switch (tier) {
      case 'basic': return 'bg-gray-100 text-gray-800';
      case 'standard': return 'bg-blue-100 text-blue-800';
      case 'premium': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout title={`Partner: ${partner.name}`}>
      <div className="space-y-6">
        {/* Back Button and Actions */}
        <div className="flex justify-between items-center">
          <Link to="/admin/partners">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Partners
            </Button>
          </Link>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={updatePartner.isPending}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </>
            ) : (
              <Button onClick={() => {
                setEditedPartner(partner);
                setIsEditing(true);
              }}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Partner
              </Button>
            )}
          </div>
        </div>

        {/* Partner Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building className="h-5 w-5 mr-2" />
              Partner Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Name</label>
                  {isEditing ? (
                    <Input
                      value={editedPartner?.name || ''}
                      onChange={(e) => setEditedPartner(prev => prev ? {...prev, name: e.target.value} : null)}
                    />
                  ) : (
                    <p className="text-sm font-medium">{partner.name}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  {isEditing ? (
                    <Input
                      value={editedPartner?.email || ''}
                      onChange={(e) => setEditedPartner(prev => prev ? {...prev, email: e.target.value} : null)}
                    />
                  ) : (
                    <p className="text-sm font-medium">{partner.email}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Phone</label>
                  {isEditing ? (
                    <Input
                      value={editedPartner?.phone || ''}
                      onChange={(e) => setEditedPartner(prev => prev ? {...prev, phone: e.target.value} : null)}
                    />
                  ) : (
                    <p className="text-sm font-medium">{partner.phone || 'Not provided'}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Website</label>
                  {isEditing ? (
                    <Input
                      value={editedPartner?.website || ''}
                      onChange={(e) => setEditedPartner(prev => prev ? {...prev, website: e.target.value} : null)}
                    />
                  ) : (
                    <p className="text-sm font-medium">
                      {partner.website ? (
                        <a href={partner.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {partner.website}
                        </a>
                      ) : (
                        'Not provided'
                      )}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Type</label>
                  {isEditing ? (
                    <select
                      value={editedPartner?.type || ''}
                      onChange={(e) => setEditedPartner(prev => prev ? {...prev, type: e.target.value as any} : null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="university">University</option>
                      <option value="tvet">TVET</option>
                      <option value="funder">Funder</option>
                      <option value="seta">SETA</option>
                      <option value="other">Other</option>
                    </select>
                  ) : (
                    <Badge className="capitalize">{partner.type}</Badge>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Tier</label>
                  {isEditing ? (
                    <select
                      value={editedPartner?.tier || ''}
                      onChange={(e) => setEditedPartner(prev => prev ? {...prev, tier: e.target.value as any} : null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="basic">Basic</option>
                      <option value="standard">Standard</option>
                      <option value="premium">Premium</option>
                    </select>
                  ) : (
                    <Badge className={getTierBadgeColor(partner.tier)}>{partner.tier}</Badge>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  {isEditing ? (
                    <select
                      value={editedPartner?.status || ''}
                      onChange={(e) => setEditedPartner(prev => prev ? {...prev, status: e.target.value as any} : null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="pending">Pending</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  ) : (
                    <Badge className={getStatusBadgeColor(partner.status)}>{partner.status}</Badge>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Annual Investment</label>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={editedPartner?.annual_investment || 0}
                      onChange={(e) => setEditedPartner(prev => prev ? {...prev, annual_investment: parseFloat(e.target.value) || 0} : null)}
                    />
                  ) : (
                    <p className="text-sm font-medium">{formatCurrency(partner.annual_investment || 0)}</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Payment History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {payments && payments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Payment Date</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Reference</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {payments.map((payment) => (
                      <tr key={payment.id}>
                        <td className="px-4 py-2 text-sm font-medium">{formatCurrency(payment.amount)}</td>
                        <td className="px-4 py-2 text-sm">{new Date(payment.payment_date).toLocaleDateString()}</td>
                        <td className="px-4 py-2 text-sm capitalize">{payment.payment_method || 'N/A'}</td>
                        <td className="px-4 py-2">
                          <StatusBadge status={payment.status} />
                        </td>
                        <td className="px-4 py-2 text-sm">{payment.reference_number || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No payment history found</p>
            )}
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              Communication Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Textarea
                  placeholder="Add a note about this partner..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleAddNote} disabled={!newNote.trim()}>
                  Add Note
                </Button>
              </div>
              
              {notes && notes.length > 0 ? (
                <div className="space-y-3">
                  {notes.map((note) => (
                    <div key={note.id} className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm">{note.note}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(note.created_at).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No notes yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminPartnerProfile;
