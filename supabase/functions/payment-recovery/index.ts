import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PaymentRecoveryRequest {
  action: 'list_orphaned' | 'list_failed' | 'link_payment' | 'resolve_payment' | 'user_recovery_check' | 'claim_payment'
  payment_id?: string
  user_id?: string
  user_email?: string
  resolution_notes?: string
  admin_action?: boolean
}

interface PaymentRecoveryResponse {
  success: boolean
  data?: any
  error?: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { action, payment_id, user_id, user_email, resolution_notes, admin_action }: PaymentRecoveryRequest = await req.json()

    if (!action) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing action parameter' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get authorization header for admin checks
    const authHeader = req.headers.get('authorization')
    let isAdmin = false
    let currentUserId = null

    if (authHeader) {
      const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''))
      if (!authError && user) {
        currentUserId = user.id
        // Check if user is admin
        const { data: adminCheck } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .single()
        isAdmin = !!adminCheck
      }
    }

    switch (action) {
      case 'list_orphaned':
        if (!isAdmin) {
          return new Response(
            JSON.stringify({ success: false, error: 'Admin access required' }),
            { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Get payments that are pending/failed and older than 1 hour, or have no user_id
        const { data: orphanedPayments, error: orphanedError } = await supabase
          .from('payments')
          .select(`
            *,
            users!inner(email, tracking_id)
          `)
          .or(`status.eq.pending,status.eq.failed`)
          .lt('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString())
          .order('created_at', { ascending: false })

        if (orphanedError) {
          console.error('Error fetching orphaned payments:', orphanedError)
          return new Response(
            JSON.stringify({ success: false, error: 'Failed to fetch orphaned payments' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        return new Response(
          JSON.stringify({ success: true, data: orphanedPayments }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      case 'list_failed':
        if (!isAdmin) {
          return new Response(
            JSON.stringify({ success: false, error: 'Admin access required' }),
            { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Get all failed payments with user info
        const { data: failedPayments, error: failedError } = await supabase
          .from('payments')
          .select(`
            *,
            users!inner(email, tracking_id)
          `)
          .eq('status', 'failed')
          .order('created_at', { ascending: false })

        if (failedError) {
          console.error('Error fetching failed payments:', failedError)
          return new Response(
            JSON.stringify({ success: false, error: 'Failed to fetch failed payments' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        return new Response(
          JSON.stringify({ success: true, data: failedPayments }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      case 'link_payment':
        if (!isAdmin || !payment_id || !user_id) {
          return new Response(
            JSON.stringify({ success: false, error: 'Admin access required and payment_id/user_id must be provided' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Link payment to user
        const { error: linkError } = await supabase
          .from('payments')
          .update({ 
            user_id,
            updated_at: new Date().toISOString()
          })
          .eq('id', payment_id)

        if (linkError) {
          console.error('Error linking payment:', linkError)
          return new Response(
            JSON.stringify({ success: false, error: 'Failed to link payment' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Log admin action
        await supabase
          .from('payment_audit_logs')
          .insert({
            payment_id,
            event_type: 'admin_linked_payment',
            event_data: { 
              admin_user_id: currentUserId,
              linked_user_id: user_id,
              notes: resolution_notes || 'Payment linked by admin'
            }
          })

        return new Response(
          JSON.stringify({ success: true, message: 'Payment linked successfully' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      case 'resolve_payment':
        if (!isAdmin || !payment_id) {
          return new Response(
            JSON.stringify({ success: false, error: 'Admin access required and payment_id must be provided' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Resolve payment (mark as resolved or refunded)
        const { error: resolveError } = await supabase
          .from('payments')
          .update({ 
            status: 'refunded',
            updated_at: new Date().toISOString()
          })
          .eq('id', payment_id)

        if (resolveError) {
          console.error('Error resolving payment:', resolveError)
          return new Response(
            JSON.stringify({ success: false, error: 'Failed to resolve payment' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Log admin action
        await supabase
          .from('payment_audit_logs')
          .insert({
            payment_id,
            event_type: 'admin_resolved_payment',
            event_data: { 
              admin_user_id: currentUserId,
              resolution_notes: resolution_notes || 'Payment resolved by admin'
            }
          })

        return new Response(
          JSON.stringify({ success: true, message: 'Payment resolved successfully' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      case 'user_recovery_check':
        if (!user_email) {
          return new Response(
            JSON.stringify({ success: false, error: 'user_email is required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Check for payments that might belong to this user (by email pattern or metadata)
        const { data: potentialPayments, error: recoveryError } = await supabase
          .from('payments')
          .select('*')
          .or(`status.eq.pending,status.eq.failed`)
          .like('merchant_reference', `%${user_email.split('@')[0]}%`)
          .order('created_at', { ascending: false })

        if (recoveryError) {
          console.error('Error checking for recovery payments:', recoveryError)
          return new Response(
            JSON.stringify({ success: false, error: 'Failed to check for recovery payments' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        return new Response(
          JSON.stringify({ success: true, data: potentialPayments }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      case 'claim_payment':
        if (!payment_id || !user_id) {
          return new Response(
            JSON.stringify({ success: false, error: 'payment_id and user_id are required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Verify user owns this payment or it's unclaimed
        const { data: paymentToClaim, error: claimCheckError } = await supabase
          .from('payments')
          .select('*')
          .eq('id', payment_id)
          .single()

        if (claimCheckError || !paymentToClaim) {
          return new Response(
            JSON.stringify({ success: false, error: 'Payment not found' }),
            { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        if (paymentToClaim.user_id && paymentToClaim.user_id !== user_id) {
          return new Response(
            JSON.stringify({ success: false, error: 'Payment already claimed by another user' }),
            { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Claim the payment
        const { error: claimError } = await supabase
          .from('payments')
          .update({ 
            user_id,
            updated_at: new Date().toISOString()
          })
          .eq('id', payment_id)

        if (claimError) {
          console.error('Error claiming payment:', claimError)
          return new Response(
            JSON.stringify({ success: false, error: 'Failed to claim payment' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Log claim action
        await supabase
          .from('payment_audit_logs')
          .insert({
            payment_id,
            event_type: 'user_claimed_payment',
            event_data: { 
              user_id,
              previous_user_id: paymentToClaim.user_id
            }
          })

        return new Response(
          JSON.stringify({ success: true, message: 'Payment claimed successfully' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      default:
        return new Response(
          JSON.stringify({ success: false, error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }

  } catch (error) {
    console.error('Payment recovery function error:', error)
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}) 