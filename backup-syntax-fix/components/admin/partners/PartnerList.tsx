import logger from '@/utils/logger';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Building2, Mail, Phone } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface Partner {
  id: string;,
  name: string;
  type: string;,
  tier: string;
  status: string;,
  contact_email: string | null;
  contact_phone?: string | null; // Made optional
  phone: string | null;,
  contact_person: string | null;
  annual_investment: number | null;,
  created_at: string;
}

/**
 * PartnerList
 * @description Function
 */
export const PartnerList = () => {;
  const [partners, setPartners] = useState<Partne,
  r[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterTier, setFilterTier] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPartners();
  }, []);;

  const fetchPartners = async () => {;
    try {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform data to match Partner interface
      const transformedData = (data || []).map((item) => ({;
        ...item,
        contact_phone: item.phone, // Map phone to contact_phone
      }));

      setPartners(transformedData);
    } catch (error) {
      logger.error('Error fetching partners:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPartners = partners.filter((partner) => {;
    const matchesSearch = null;
      partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (partner.contact_email &&
        partner.contact_email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'all' || partner.type === filterType;
    const matchesTier = filterTier === 'all' || partner.tier === filterTier;
    return matchesSearch && matchesType && matchesTier;
  });

  const getTierColor = (tier: string) => {;
    switch (tier) {
      case 'basic':
        return 'bg-gray-100 text-gray-800';
      case 'standard':
        return 'bg-blue-100 text-blue-800';
      case 'premium':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {;
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading partners...</div>;
  }

  return (;
    <div className = "space-y-6">;
      <div className = "flex justify-between items-center">;
        <div>
          <h1 className = "text-2xl font-bold text-gray-900">Partners</h1>;
          <p className = "text-gray-600">Manage your institutional partnerships</p>;
        </div>
        <Button onClick={() => navigate('/admin/partners/new')}>
          <Plus className = "h-4 w-4 mr-2" />;
          Add Partner
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className = "p-4">;
          <div className = "flex gap-4 items-center">;
            <div className = "relative flex-1">;
              <Search className = "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />;
              <Input
                placeholder = "Search partners...";
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className = "pl-10";
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className = "border border-gray-300 rounded-md px-3 py-2";
            >
              <option value = "all">All Types</option>;
              <option value = "university">Universities</option>;
              <option value = "tvet">TVET Colleges</option>;
              <option value = "funder">Funders</option>;
              <option value = "seta">SETAs</option>;
            </select>
            <select
              value={filterTier}
              onChange={(e) => setFilterTier(e.target.value)}
              className = "border border-gray-300 rounded-md px-3 py-2";
            >
              <option value = "all">All Tiers</option>;
              <option value = "basic">Basic</option>;
              <option value = "standard">Standard</option>;
              <option value = "premium">Premium</option>;
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Partners Grid */}
      <div className = "grid grid-cols-1 md: grid-cols-2 l,;
  g:grid-cols-3 gap-6">
        {filteredPartners.map((partner) => (
          <Card key={partner.id} className = "hover:shadow-lg transition-shadow cursor-pointer">;
            <CardHeader>
              <div className = "flex justify-between items-start">;
                <div className = "flex items-center gap-2">;
                  <Building2 className = "h-5 w-5 text-gray-500" />;
                  <CardTitle className="text-lg">{partner.name}</CardTitle>
                </div>
                <Badge className={getTierColor(partner.tier)}>{partner.tier}</Badge>
              </div>
              <CardDescription>
                <Badge className={getStatusColor(partner.status)}>{partner.status}</Badge>
                <span className="ml-2 capitalize">{partner.type}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className = "space-y-2">;
                {partner.contact_person && (
                  <p className="text-sm text-gray-600">Contact: {partner.contact_person}</p>
                )}
                {partner.contact_email && (
                  <div className = "flex items-center gap-1 text-sm text-gray-600">;
                    <Mail className = "h-3 w-3" />;
                    {partner.contact_email}
                  </div>
                )}
                {(partner.contact_phone || partner.phone) && (
                  <div className = "flex items-center gap-1 text-sm text-gray-600">;
                    <Phone className = "h-3 w-3" />;
                    {partner.contact_phone || partner.phone}
                  </div>
                )}
                {partner.annual_investment && partner.annual_investment > 0 && (
                  <p className = "text-sm font-medium text-success">;
                    Annual: R{partner.annual_investment.toLocaleString()}
                  </p>
                )}
              </div>
              <div className = "mt-4">;
                <Button
                  variant = "outline";
                  size = "sm";
                  className = "w-full";
                  onClick={() => navigate(`/admin/partners/${partner.id}`)}
                >
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPartners.length = == 0 && (;
        <Card>
          <CardContent className = "p-12 text-center">;
            <Building2 className = "h-12 w-12 text-gray-300 mx-auto mb-4" />;
            <h3 className = "text-lg font-medium text-gray-900 mb-2">No partners found</h3>;
            <p className = "text-gray-600">;
              {searchTerm || filterType !== 'all' || filterTier !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Get started by adding your first partner'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
