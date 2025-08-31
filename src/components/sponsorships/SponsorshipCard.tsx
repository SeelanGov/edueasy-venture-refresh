import { Badge, badgeVariants } from '@/components/ui/badge';
import { type VariantProps } from 'class-variance-authority';
import { Button } from '@/components/ui/button';
import { SponsorshipLevel, formatSponsorshipLevel, type Sponsorship } from '@/types/RevenueTypes';
import { formatCurrency } from '@/types/SubscriptionTypes';
import { Building, Calendar, ExternalLink } from 'lucide-react';


import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';




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
}: any): JSX.Element {
  // Format dates
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get sponsorship level variant for Badge
  const getLevelVariant = (level: SponsorshipLevel): VariantProps<typeof badgeVariants>['variant'] => {
    switch (level) {
      case SponsorshipLevel.PLATINUM:
        return 'destructive'; // Purple-like for premium
      case SponsorshipLevel.GOLD:
        return 'warning';     // Gold/amber
      case SponsorshipLevel.SILVER:
        return 'muted';       // Gray for silver
      case SponsorshipLevel.BRONZE:
        return 'secondary';   // Bronze-like
      default:
        return 'info';        // Blue for default
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
          <Badge variant={getLevelVariant(sponsorship.sponsorship_level)}>
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
                className="max-h-full max-w-full object-contain" />
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
