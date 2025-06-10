
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Partner } from '@/types/PartnerTypes';
import { Users, Mail, MapPin, ExternalLink } from 'lucide-react';

interface SponsorCardProps {
  sponsor: Partner;
  totalStudents?: number;
  activeStudents?: number;
}

export const SponsorCard: React.FC<SponsorCardProps> = ({ 
  sponsor, 
  totalStudents = 0, 
  activeStudents = 0 
}) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{sponsor.name}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{sponsor.email}</p>
          </div>
          <div className="flex gap-2">
            <Badge variant={sponsor.status === 'active' ? 'default' : 'secondary'}>
              {sponsor.status}
            </Badge>
            <Badge variant="outline">{sponsor.tier}</Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Contact Information */}
        <div className="space-y-2">
          {sponsor.contact_person && (
            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span>{sponsor.contact_person}</span>
            </div>
          )}
          {sponsor.city && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span>{sponsor.city}, {sponsor.province}</span>
            </div>
          )}
        </div>

        {/* Student Statistics */}
        <div className="flex justify-between items-center pt-2 border-t">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">
              {activeStudents}/{totalStudents} Students
            </span>
          </div>
          <div className="text-sm font-medium">
            R{sponsor.annual_investment?.toLocaleString() || '0'}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button asChild variant="outline" size="sm" className="flex-1">
            <Link to={`/admin/sponsors/${sponsor.id}`}>
              <ExternalLink className="w-4 h-4 mr-2" />
              View Profile
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
