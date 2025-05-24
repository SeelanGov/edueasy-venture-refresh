import React, { useState } from 'react';
import { useConsultations } from '@/hooks/useConsultations';
import { useSubscription } from '@/hooks/useSubscription';
import { ConsultationBookingForm } from '@/components/consultations/ConsultationBookingForm';
import { PremiumFeature } from '@/components/subscription/PremiumFeature';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { SubscriptionTierName } from '@/types/SubscriptionTypes';
import { ConsultationStatus } from '@/types/RevenueTypes';
import { Calendar, Clock, Video, MessageSquare, AlertCircle, Users } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export default function ConsultationsPage() {
  const { bookings, loading, createBooking, cancelBooking, rescheduleBooking } = useConsultations();
  const { userSubscription } = useSubscription();
  
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  
  // Base price for consultations
  const consultationPrice = 150; // R150 per 30 minutes
  
  // Handle booking creation
  const handleCreateBooking = async (date: Date, durationMinutes: number, notes?: string) => {
    const result = await createBooking(date, durationMinutes, notes);
    if (result) {
      setShowBookingDialog(false);
    }
  };
  
  // Handle booking cancellation
  const handleCancelBooking = async (bookingId: string) => {
    const confirmed = window.confirm('Are you sure you want to cancel this consultation?');
    if (confirmed) {
      await cancelBooking(bookingId);
    }
  };
  
  // Handle booking rescheduling
  const handleRescheduleBooking = async (bookingId: string) => {
    setSelectedBookingId(bookingId);
    setShowRescheduleDialog(true);
  };
  
  // Submit rescheduling
  const handleRescheduleSubmit = async (date: Date, durationMinutes: number, notes?: string) => {
    if (selectedBookingId) {
      const result = await rescheduleBooking(selectedBookingId, date);
      if (result) {
        setShowRescheduleDialog(false);
        setSelectedBookingId(null);
      }
    }
  };
  
  // Format date for display
  const formatBookingDate = (dateString: string) => {
    const date = parseISO(dateString);
    return {
      date: format(date, 'EEEE, MMMM d, yyyy'),
      time: format(date, 'h:mm a')
    };
  };
  
  // Get status badge for booking
  const getStatusBadge = (status: ConsultationStatus) => {
    switch (status) {
      case ConsultationStatus.CONFIRMED:
        return <Badge className="bg-green-100 text-green-800">Confirmed</Badge>;
      case ConsultationStatus.PENDING:
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case ConsultationStatus.CANCELLED:
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      case ConsultationStatus.COMPLETED:
        return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>;
      case ConsultationStatus.RESCHEDULED:
        return <Badge className="bg-purple-100 text-purple-800">Rescheduled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Career Consultations</h1>
        <p className="text-muted-foreground">
          Book one-on-one sessions with career experts for personalized guidance
        </p>
      </div>
      
      <PremiumFeature
        title="Premium Career Consultations"
        description="Book personalized sessions with career experts"
        requiredTier={SubscriptionTierName.PREMIUM}
      >
        <Tabs defaultValue="upcoming" className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past Consultations</TabsTrigger>
            </TabsList>
            <Button onClick={() => setShowBookingDialog(true)}>
              Book Consultation
            </Button>
          </div>
          
          <TabsContent value="upcoming" className="mt-0">
            {bookings.filter(b => 
              b.status !== ConsultationStatus.COMPLETED && 
              b.status !== ConsultationStatus.CANCELLED
            ).length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No upcoming consultations</h3>
                    <p className="text-muted-foreground mt-2">
                      Book your first consultation with a career expert for personalized guidance.
                    </p>
                    <Button 
                      className="mt-4"
                      onClick={() => setShowBookingDialog(true)}
                    >
                      Book Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {bookings
                  .filter(b => 
                    b.status !== ConsultationStatus.COMPLETED && 
                    b.status !== ConsultationStatus.CANCELLED
                  )
                  .map((booking) => {
                    const { date, time } = formatBookingDate(booking.booking_date);
                    return (
                      <Card key={booking.id}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle>Career Consultation</CardTitle>
                              <CardDescription>
                                {date} at {time}
                              </CardDescription>
                            </div>
                            {getStatusBadge(booking.status)}
                          </div>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>{booking.duration_minutes} minutes</span>
                            </div>
                            
                            {booking.meeting_link && (
                              <div className="flex items-center gap-2 text-sm">
                                <Video className="h-4 w-4 text-muted-foreground" />
                                <a 
                                  href={booking.meeting_link} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline"
                                >
                                  Join Meeting
                                </a>
                              </div>
                            )}
                            
                            {booking.notes && (
                              <div className="flex items-start gap-2 text-sm">
                                <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
                                <p className="text-muted-foreground">{booking.notes}</p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                        <CardFooter className="flex gap-2">
                          {booking.status !== ConsultationStatus.CANCELLED && (
                            <>
                              <Button 
                                variant="outline" 
                                className="flex-1"
                                onClick={() => handleRescheduleBooking(booking.id)}
                              >
                                Reschedule
                              </Button>
                              <Button 
                                variant="destructive" 
                                className="flex-1"
                                onClick={() => handleCancelBooking(booking.id)}
                              >
                                Cancel
                              </Button>
                            </>
                          )}
                        </CardFooter>
                      </Card>
                    );
                  })}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="past" className="mt-0">
            {bookings.filter(b => 
              b.status === ConsultationStatus.COMPLETED || 
              b.status === ConsultationStatus.CANCELLED
            ).length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No past consultations</h3>
                    <p className="text-muted-foreground mt-2">
                      Your completed and cancelled consultations will appear here.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {bookings
                  .filter(b => 
                    b.status === ConsultationStatus.COMPLETED || 
                    b.status === ConsultationStatus.CANCELLED
                  )
                  .map((booking) => {
                    const { date, time } = formatBookingDate(booking.booking_date);
                    return (
                      <Card key={booking.id} className={booking.status === ConsultationStatus.CANCELLED ? 'opacity-70' : ''}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle>Career Consultation</CardTitle>
                              <CardDescription>
                                {date} at {time}
                              </CardDescription>
                            </div>
                            {getStatusBadge(booking.status)}
                          </div>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>{booking.duration_minutes} minutes</span>
                            </div>
                            
                            {booking.notes && (
                              <div className="flex items-start gap-2 text-sm">
                                <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
                                <p className="text-muted-foreground">{booking.notes}</p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                        {booking.status === ConsultationStatus.COMPLETED && (
                          <CardFooter>
                            <Button 
                              variant="outline" 
                              className="w-full"
                              onClick={() => setShowBookingDialog(true)}
                            >
                              Book Another Consultation
                            </Button>
                          </CardFooter>
                        )}
                      </Card>
                    );
                  })}
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <Alert className="mt-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>About Our Consultations</AlertTitle>
          <AlertDescription>
            Our career experts provide personalized guidance to help you navigate your career journey.
            Consultations are conducted via video call and can be rescheduled up to 24 hours before the appointment.
          </AlertDescription>
        </Alert>
      </PremiumFeature>
      
      {/* Booking Dialog */}
      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Book a Consultation</DialogTitle>
            <DialogDescription>
              Schedule a one-on-one session with a career expert
            </DialogDescription>
          </DialogHeader>
          
          <ConsultationBookingForm
            onSubmit={handleCreateBooking}
            onCancel={() => setShowBookingDialog(false)}
            consultationPrice={consultationPrice}
          />
        </DialogContent>
      </Dialog>
      
      {/* Reschedule Dialog */}
      <Dialog open={showRescheduleDialog} onOpenChange={setShowRescheduleDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reschedule Consultation</DialogTitle>
            <DialogDescription>
              Select a new date and time for your consultation
            </DialogDescription>
          </DialogHeader>
          
          <ConsultationBookingForm
            onSubmit={handleRescheduleSubmit}
            onCancel={() => setShowRescheduleDialog(false)}
            consultationPrice={0} // No charge for rescheduling
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}