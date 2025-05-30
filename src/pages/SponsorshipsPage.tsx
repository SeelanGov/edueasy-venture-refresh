import { SponsorshipCard } from '@/components/sponsorships/SponsorshipCard';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useSponsorships } from '@/hooks/useSponsorships';
import { AlertCircle, Building } from 'lucide-react';
import React, { useState } from 'react';

export default function SponsorshipsPage() {
  const {
    sponsorships,
    loading,
    isAdmin,
    submitSponsorshipInquiry,
    createSponsorship,
    updateSponsorship,
    deactivateSponsorship,
  } = useSponsorships();

  const [showInquiryDialog, setShowInquiryDialog] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({
    organizationName: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);

  // Handle inquiry form changes
  const handleInquiryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInquiryForm((prev) => ({ ...prev, [name]: value }));
  };

  // Submit sponsorship inquiry
  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();

    setSubmitting(true);
    const result = await submitSponsorshipInquiry(
      inquiryForm.organizationName,
      inquiryForm.contactName,
      inquiryForm.contactEmail,
      inquiryForm.contactPhone,
      inquiryForm.message,
    );

    if (result) {
      setInquiryForm({
        organizationName: '',
        contactName: '',
        contactEmail: '',
        contactPhone: '',
        message: '',
      });
      setShowInquiryDialog(false);
    }

    setSubmitting(false);
  };

  // Handle sponsorship deactivation (admin only)
  const handleDeactivateSponsorship = async (sponsorshipId: string) => {
    const confirmed = window.confirm('Are you sure you want to deactivate this sponsorship?');
    if (confirmed) {
      await deactivateSponsorship(sponsorshipId);
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Corporate Sponsorships</h1>
        <p className="text-muted-foreground">
          Organizations supporting EduEasy's mission to make education accessible
        </p>
      </div>

      <Tabs defaultValue="sponsors" className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="sponsors">Our Sponsors</TabsTrigger>
            <TabsTrigger value="program">Sponsorship Program</TabsTrigger>
          </TabsList>
          <Button onClick={() => setShowInquiryDialog(true)}>Become a Sponsor</Button>
        </div>

        <TabsContent value="sponsors" className="mt-0">
          {sponsorships.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Building className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No sponsors yet</h3>
                  <p className="text-muted-foreground mt-2">
                    Be the first organization to sponsor EduEasy and support our mission.
                  </p>
                  <Button className="mt-4" onClick={() => setShowInquiryDialog(true)}>
                    Become a Sponsor
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sponsorships.map((sponsorship) => (
                <SponsorshipCard
                  key={sponsorship.id}
                  sponsorship={sponsorship}
                  isAdmin={isAdmin}
                  onEdit={() => {
                    return undefined;
                  }} // Would implement edit functionality for admins
                  onDeactivate={handleDeactivateSponsorship}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="program" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>EduEasy Sponsorship Program</CardTitle>
              <CardDescription>
                Partner with us to support education and gain visibility
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="prose max-w-none">
                <p>
                  EduEasy's corporate sponsorship program offers organizations the opportunity to
                  support our mission of making education accessible to all South Africans while
                  gaining visibility and recognition.
                </p>
                <p>
                  By becoming a sponsor, your organization demonstrates its commitment to education,
                  skills development, and economic empowerment in South Africa.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Benefits of Sponsorship</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5" />
                      <span className="text-sm">Brand visibility on the EduEasy platform</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5" />
                      <span className="text-sm">Recognition in our marketing materials</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5" />
                      <span className="text-sm">Access to talent pool of EduEasy users</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5" />
                      <span className="text-sm">Corporate social responsibility impact</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5" />
                      <span className="text-sm">Participation in EduEasy events</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Sponsorship Levels</h3>
                  <div className="space-y-2">
                    <div className="bg-purple-50 p-3 rounded-md">
                      <p className="font-medium">Platinum Sponsor</p>
                      <p className="text-sm text-muted-foreground">R50,000+ per year</p>
                    </div>
                    <div className="bg-amber-50 p-3 rounded-md">
                      <p className="font-medium">Gold Sponsor</p>
                      <p className="text-sm text-muted-foreground">R25,000+ per year</p>
                    </div>
                    <div className="bg-gray-100 p-3 rounded-md">
                      <p className="font-medium">Silver Sponsor</p>
                      <p className="text-sm text-muted-foreground">R10,000+ per year</p>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-md">
                      <p className="font-medium">Bronze Sponsor</p>
                      <p className="text-sm text-muted-foreground">R5,000+ per year</p>
                    </div>
                  </div>
                </div>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Impact of Your Sponsorship</AlertTitle>
                <AlertDescription>
                  Your sponsorship directly supports our efforts to provide educational resources,
                  career guidance, and application assistance to students across South Africa, with
                  a focus on underserved communities.
                </AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => setShowInquiryDialog(true)}>
                Inquire About Sponsorship
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Sponsorship Inquiry Dialog */}
      <Dialog open={showInquiryDialog} onOpenChange={setShowInquiryDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sponsorship Inquiry</DialogTitle>
            <DialogDescription>
              Submit your information to learn more about sponsoring EduEasy
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitInquiry} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="organizationName">Organization Name</Label>
              <Input
                id="organizationName"
                name="organizationName"
                value={inquiryForm.organizationName}
                onChange={handleInquiryChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactName">Contact Person</Label>
              <Input
                id="contactName"
                name="contactName"
                value={inquiryForm.contactName}
                onChange={handleInquiryChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactEmail">Email</Label>
              <Input
                id="contactEmail"
                name="contactEmail"
                type="email"
                value={inquiryForm.contactEmail}
                onChange={handleInquiryChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPhone">Phone</Label>
              <Input
                id="contactPhone"
                name="contactPhone"
                value={inquiryForm.contactPhone}
                onChange={handleInquiryChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                name="message"
                value={inquiryForm.message}
                onChange={handleInquiryChange}
                placeholder="Tell us about your organization and interest in sponsorship"
                className="resize-none"
                rows={4}
                required
              />
            </div>

            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowInquiryDialog(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Inquiry'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
