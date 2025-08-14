import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { type Json  } from '@/integrations/supabase/types';








interface TierConfig {
  id: string;
  tier: string;
  name: string;
  annual_fee: number;
  max_applications: number | null;
  api_rate_limit: number | null;
  features: string[];
  support_level: string | null;
  active: boolean | null;
}

/**
 * TiersManager
 * @description Function
 */
export const TiersManager = () => {
  const [tiers, setTiers] = useState<TierConfig[]>([]);
  const [loading, setLoading] = useState(true);

  // eslint-disable-next-line react-hooks/exhaustive-deps
useEffect(() => {
    fetchTiers();
  }, []);

  const fetchTiers = async () => {
    try {
      const { data, error } = await supabase
        .from('partner_tier_config')
        .select('*')
        .order('annual_fee', { ascending: true });

      if (error) throw error;

      // Transform the data to match our interface
      const transformedData = (data || []).map((item) => ({
        ...item,
        features: transformJsonToStringArray(item.features),
        active: item.active ?? true,
        max_applications: item.max_applications ?? null,
        api_rate_limit: item.api_rate_limit ?? null,
      }));

      setTiers(transformedData);
    } catch (error) {
      console.error('Error fetching tiers:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to transform Json array to string array
  const transformJsonToStringArray = (jsonFeatures: Json): string[] => {
    if (Array.isArray(jsonFeatures)) {
      return jsonFeatures.filter((item): item is string => typeof item === 'string').map(String);
    }
    return [];
  };

  const toggleTierStatus = async (tierId: string, currentStatus: boolean | null) => {
    try {
      const newStatus = !currentStatus;
      const { error } = await supabase
        .from('partner_tier_config')
        .update({ active: newStatus })
        .eq('id', tierId);

      if (error) throw error;

      setTiers((prev) =>
        prev.map((tier) => (tier.id === tierId ? { ...tier, active: newStatus } : tier)),
      );
    } catch (error) {
      console.error('Error updating tier status:', error);
    }
  };

  const getTierColor = (tier: string): string => {
    switch (tier) {
      case 'basic':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'standard':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'premium':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">Loading tier configurations...</div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tier Management</h1>
          <p className="text-gray-600">Configure partnership tiers and benefits</p>
        </div>
        <Button>Add New Tier</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tiers.map((tier) => (
          <Card key={tier.id} className={`relative ${tier.active ? '' : 'opacity-60'}`}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Badge className={getTierColor(tier.tier)}>{tier.tier}</Badge>
                    {tier.name}
                  </CardTitle>
                  <CardDescription>{tier.support_level || 'Standard'} Support</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleTierStatus(tier.id, tier.active)}
                >
                  {tier.active ? 'Disable' : 'Enable'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  R{tier.annual_fee.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">per year</div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Max Applications</span>
                  <span className="font-medium">{tier.max_applications || 'Unlimited'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>API Rate Limit</span>
                  <span className="font-medium">{tier.api_rate_limit || 'Unlimited'}/hour</span>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-sm mb-2">Features Included:</h4>
                <div className="space-y-1">
                  {tier.features?.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button variant="outline" size="sm" className="w-full">
                  Edit Tier
                </Button>
              </div>
            </CardContent>

            {!tier.active && (
              <div className="absolute inset-0 bg-gray-500 bg-opacity-10 flex items-center justify-center">
                <Badge variant="outline" className="bg-white">
                  Disabled
                </Badge>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Tier Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle>Tier Comparison</CardTitle>
          <CardDescription>Compare features across all tiers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Feature</th>
                  {tiers.map((tier) => (
                    <th key={tier.id} className="text-center p-2">
                      <Badge className={getTierColor(tier.tier)}>{tier.tier}</Badge>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2 font-medium">Annual Fee</td>
                  {tiers.map((tier) => (
                    <td key={tier.id} className="text-center p-2">
                      R{tier.annual_fee.toLocaleString()}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-medium">Max Applications</td>
                  {tiers.map((tier) => (
                    <td key={tier.id} className="text-center p-2">
                      {tier.max_applications || '∞'}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-medium">API Rate Limit</td>
                  {tiers.map((tier) => (
                    <td key={tier.id} className="text-center p-2">
                      {tier.api_rate_limit || '∞'}/hour
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-2 font-medium">Support Level</td>
                  {tiers.map((tier) => (
                    <td key={tier.id} className="text-center p-2">
                      {tier.support_level || 'Standard'}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
