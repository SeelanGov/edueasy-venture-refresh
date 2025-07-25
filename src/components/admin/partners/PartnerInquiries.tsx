import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Mail, Phone, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface PartnerInquiry {
  id: string;
  institution_name: string;
  institution_type: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string | null;
  website: string | null;
  student_count: string | null;
  interested_tier: string | null;
  message: string | null;
  status: string | null;
  created_at: string;
  updated_at: string;
}


/**
 * PartnerInquiries
 * @description Function
 */
export const PartnerInquiries = (): void => {
  const [inquiries, setInquiries] = useState<PartnerInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const { data, error } = await supabase
        .from('partner_inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching inquiries:', error);
        setInquiries([]);
      } else {
        setInquiries(data || []);
      }
    } catch (error) {
      console.error('Error fetching inquiries:', error);
      setInquiries([]);
    } finally {
      setLoading(false);
    }
  };

  const updateInquiryStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase.from('partner_inquiries').update({ status }).eq('id', id);

      if (error) throw error;

      setInquiries((prev) =>
        prev.map((inquiry) => (inquiry.id === id ? { ...inquiry, status } : inquiry)),
      );
    } catch (error) {
      console.error('Error updating inquiry status:', error);
    }
  };

  const filteredInquiries = inquiries.filter((inquiry) => {
    const matchesSearch =
      inquiry.institution_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.contact_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.contact_email.toLowerCase().includes(searchTerm.toLowerCase());
    const inquiryStatus = inquiry.status || 'pending';
    const matchesStatus = filterStatus === 'all' || inquiryStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string | null): void => {
    const actualStatus = status || 'pending';
    switch (actualStatus) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'contacted':
        return 'bg-blue-100 text-blue-800';
      case 'converted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading inquiries...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Partner Inquiries</h1>
          <p className="text-gray-600">Manage partnership requests and leads</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search inquiries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="contacted">Contacted</option>
              <option value="converted">Converted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6">
        {filteredInquiries.map((inquiry) => (
          <Card key={inquiry.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{inquiry.institution_name}</CardTitle>
                  <CardDescription>
                    {inquiry.institution_type} • Contact: {inquiry.contact_name}
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(inquiry.status)}>
                  {inquiry.status || 'pending'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <a
                      href={`mailto:${inquiry.contact_email}`}
                      className="text-blue-600 hover:underline"
                    >
                      {inquiry.contact_email}
                    </a>
                  </div>
                  {inquiry.contact_phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <a
                        href={`tel:${inquiry.contact_phone}`}
                        className="text-blue-600 hover:underline"
                      >
                        {inquiry.contact_phone}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    {new Date(inquiry.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  {inquiry.student_count && (
                    <p>
                      <strong>Students:</strong> {inquiry.student_count}
                    </p>
                  )}
                  {inquiry.interested_tier && (
                    <p>
                      <strong>Interested Tier:</strong> {inquiry.interested_tier}
                    </p>
                  )}
                  {inquiry.website && (
                    <p>
                      <strong>Website:</strong>
                      <a
                        href={inquiry.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline ml-1"
                      >
                        {inquiry.website}
                      </a>
                    </p>
                  )}
                </div>
              </div>

              {inquiry.message && (
                <div className="mb-4">
                  <h4 className="font-medium text-sm text-gray-700 mb-2">Message:</h4>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    {inquiry.message}
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                {(!inquiry.status || inquiry.status === 'pending') && (
                  <>
                    <Button size="sm" onClick={() => updateInquiryStatus(inquiry.id, 'contacted')}>
                      Mark as Contacted
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateInquiryStatus(inquiry.id, 'rejected')}
                    >
                      Reject
                    </Button>
                  </>
                )}
                {inquiry.status === 'contacted' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateInquiryStatus(inquiry.id, 'converted')}
                  >
                    Mark as Converted
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => window.open(`mailto:${inquiry.contact_email}`, '_blank')}
                >
                  Send Email
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredInquiries.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No inquiries found</h3>
            <p className="text-gray-600">
              {searchTerm || filterStatus !== 'all'
                ? 'Try adjusting your search or filters'
                : 'No partnership inquiries have been submitted yet'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
