import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ConsultationBooking,
  ConsultationStatus
} from '@/types/RevenueTypes';
import { toast } from '@/components/ui/use-toast';

export function useConsultations() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<ConsultationBooking[]>([]);
  const [currentBooking, setCurrentBooking] = useState<ConsultationBooking | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Helper function to handle errors
  const handleError = (error: any, message: string) => {
    console.error(message, error);
    setError(message);
    toast({
      title: "Error",
      description: message,
      variant: "destructive",
    });
  };

  // Fetch user's consultation bookings
  const fetchBookings = async () => {
    if (!user?.id) {
      setBookings([]);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('consultation_bookings')
        .select(`
          *,
          payment:payment_id(*)
        `)
        .eq('user_id', user.id)
        .order('booking_date', { ascending: false });
      
      if (error) throw error;
      
      setBookings(data || []);
    } catch (error) {
      handleError(error, 'Failed to fetch consultation bookings');
    } finally {
      setLoading(false);
    }
  };

  // Fetch a specific booking
  const fetchBooking = async (bookingId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('consultation_bookings')
        .select(`
          *,
          payment:payment_id(*)
        `)
        .eq('id', bookingId)
        .single();
      
      if (error) throw error;
      
      setCurrentBooking(data);
    } catch (error) {
      handleError(error, 'Failed to fetch booking details');
    } finally {
      setLoading(false);
    }
  };

  // Create a new consultation booking
  const createBooking = async (
    bookingDate: Date,
    durationMinutes: number,
    notes?: string,
    paymentId?: string
  ) => {
    if (!user?.id) {
      handleError(new Error('User not authenticated'), 'Authentication required');
      return null;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('consultation_bookings')
        .insert({
          user_id: user.id,
          booking_date: bookingDate.toISOString(),
          duration_minutes: durationMinutes,
          status: ConsultationStatus.PENDING,
          notes: notes || null,
          payment_id: paymentId || null
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Update the bookings list
      await fetchBookings();
      
      toast({
        title: "Booking Created",
        description: "Your consultation has been booked successfully.",
        variant: "default",
      });
      
      return data;
    } catch (error) {
      handleError(error, 'Failed to create booking');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing booking
  const updateBooking = async (
    bookingId: string,
    updates: Partial<ConsultationBooking>
  ) => {
    if (!user?.id) {
      handleError(new Error('User not authenticated'), 'Authentication required');
      return null;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('consultation_bookings')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId)
        .eq('user_id', user.id) // Ensure the user owns this booking
        .select()
        .single();
      
      if (error) throw error;
      
      // Update the bookings list and current booking
      await fetchBookings();
      setCurrentBooking(data);
      
      toast({
        title: "Booking Updated",
        description: "Your consultation booking has been updated successfully.",
        variant: "default",
      });
      
      return data;
    } catch (error) {
      handleError(error, 'Failed to update booking');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Cancel a booking
  const cancelBooking = async (bookingId: string, reason?: string) => {
    if (!user?.id) {
      handleError(new Error('User not authenticated'), 'Authentication required');
      return false;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('consultation_bookings')
        .update({
          status: ConsultationStatus.CANCELLED,
          notes: reason ? `Cancelled: ${reason}` : 'Cancelled by user',
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId)
        .eq('user_id', user.id) // Ensure the user owns this booking
        .select()
        .single();
      
      if (error) throw error;
      
      // Update the bookings list and current booking
      await fetchBookings();
      setCurrentBooking(data);
      
      toast({
        title: "Booking Cancelled",
        description: "Your consultation booking has been cancelled.",
        variant: "default",
      });
      
      return true;
    } catch (error) {
      handleError(error, 'Failed to cancel booking');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Reschedule a booking
  const rescheduleBooking = async (
    bookingId: string,
    newBookingDate: Date
  ) => {
    if (!user?.id) {
      handleError(new Error('User not authenticated'), 'Authentication required');
      return null;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('consultation_bookings')
        .update({
          booking_date: newBookingDate.toISOString(),
          status: ConsultationStatus.RESCHEDULED,
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId)
        .eq('user_id', user.id) // Ensure the user owns this booking
        .select()
        .single();
      
      if (error) throw error;
      
      // Update the bookings list and current booking
      await fetchBookings();
      setCurrentBooking(data);
      
      toast({
        title: "Booking Rescheduled",
        description: "Your consultation has been rescheduled successfully.",
        variant: "default",
      });
      
      return data;
    } catch (error) {
      handleError(error, 'Failed to reschedule booking');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Load data when user changes
  useEffect(() => {
    if (user?.id) {
      fetchBookings();
    }
  }, [user]);

  return {
    loading,
    error,
    bookings,
    currentBooking,
    fetchBookings,
    fetchBooking,
    createBooking,
    updateBooking,
    cancelBooking,
    rescheduleBooking
  };
}