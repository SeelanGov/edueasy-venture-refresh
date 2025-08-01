import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Sponsorship } from '@/types/RevenueTypes';
import { SponsorshipLevel, formatSponsorshipLevel } from '@/types/RevenueTypes';
import { ExternalLink, Building, Calendar } from 'lucide-react';
import { formatCurrency } from '@/types/SubscriptionTypes';

interface SponsorshipCardProps {
  sponsorship: Sponsorship;
  isAdmin?: boolean;
  onEdit?: (sponsorshipId: string) => void;
  onDeactivate?: (sponsorshipId: string) => void;
}

/**
 * SponsorshipCard
 * @description Function
 */
export function SponsorshipCard({
  sponsorship,
  isAdmin = false,
  onEdit,
  onDeactivate,
}: SponsorshipCardProps): JSX.Element {
  // Format dates
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get sponsorship level color
  const getLevelColor = (level: SponsorshipLevel): string => {
    switch (level) {
      case SponsorshipLevel.PLATINUM:
        return 'bg-purple-100 text-purple-800';
      case SponsorshipLevel.GOLD:
        return 'bg-amber-100 text-amber-800';
      case SponsorshipLevel.SILVER:
        return 'bg-gray-200 text-gray-800';
      case SponsorshipLevel.BRONZE:
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <Card className={`w-full ${!sponsorship.is_active ? 'opacity-70' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{sponsorship.organization_name}</CardTitle>
            <CardDescription className="flex items-center gap-1">
              <Building className="h-4 w-4" />
              {sponsorship.contact_name}
            </CardDescription>
          </div>
          <Badge className={getLevelColor(sponsorship.sponsorship_level)}>
            {formatSponsorshipLevel(sponsorship.sponsorship_level)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-3">
          {sponsorship.logo_url && (
            <div className="h-16 flex items-center">
              <img
                src={sponsorship.logo_url}
                alt={`${sponsorship.organization_name} logo`}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          )}

          {sponsorship.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">{sponsorship.description}</p>
          )}

          <div className="flex flex-wrap gap-4 text-sm">
            <div>
              <p className="font-medium">Amount</p>
              <p>{formatCurrency(sponsorship.amount)}</p>
            </div>

            <div>
              <p className="font-medium">Duration</p>
              <p className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>
                  {formatDate(sponsorship.start_date)} - {formatDate(sponsorship.end_date)}
                </span>
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        {sponsorship.website_url && (
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() =>
              sponsorship.website_url && window.open(sponsorship.website_url, '_blank')
            }
          >
            Visit Website
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        )}

        {isAdmin && (
          <>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => onEdit && onEdit(sponsorship.id)}
            >
              Edit
            </Button>

            {sponsorship.is_active && (
              <Button
                variant="destructive"
                size="sm"
                className="flex-1"
                onClick={() => onDeactivate && onDeactivate(sponsorship.id)}
              >
                Deactivate
              </Button>
            )}
          </>
        )}
      </CardFooter>
    </Card>
  );
}
