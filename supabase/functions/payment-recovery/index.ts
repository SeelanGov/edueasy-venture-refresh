import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Constants aligned with existing project patterns
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const PAYMENT_STATUSES = {
  PENDING: 'pending',
  FAILED: 'failed',
  REFUNDED: 'refunded',
  PAID: 'paid'
} as const

const EVENT_TYPES = {
  ADMIN_LINKED_PAYMENT: 'admin_linked_payment',
  ADMIN_RESOLVED_PAYMENT: 'admin_resolved_payment',
  USER_CLAIMED_PAYMENT: 'user_claimed_payment'
} as const

const ORPHANED_PAYMENT_THRESHOLD_HOURS = 1

// Types aligned with existing database schema
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
  message?: string
}

interface AdminContext {
  isAdmin: boolean
  currentUserId: string | null
}

// Utility functions using existing patterns
function createErrorResponse(error: string, status: number = 400): Response {
  return new Response(
    JSON.stringify({ success: false, error }),
    { 
      status, 
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } 
    }
  )
}

function createSuccessResponse(data?: any, message?: string): Response {
  return new Response(
    JSON.stringify({ success: true, data, message }),
    { headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
  )
}

async function validateAdminAccess(supabase: any, authHeader: string | null): Promise<AdminContext> {
  if (!authHeader) {
    return { isAdmin: false, currentUserId: null }
  }

  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )
    
    if (authError || !user) {
      return { isAdmin: false, currentUserId: null }
    }

    // Use existing is_admin RPC function for consistency
    const { data: isAdminResult, error: adminCheckError } = await supabase.rpc('is_admin', {
      user_uuid: user.id
    })

    if (adminCheckError) {
      console.error('Admin check error:', adminCheckError)
      return { isAdmin: false, currentUserId: user.id }
    }

    return { 
      isAdmin: !!isAdminResult, 
      currentUserId: user.id 
    }
  } catch (error) {
    console.error('Error validating admin access:', error)
    return { isAdmin: false, currentUserId: null }
  }
}

async function logPaymentEvent(
  supabase: any, 
  paymentId: string, 
  eventType: string, 
  eventData: Record<string, any>
): Promise<void> {
  try {
    await supabase
      .from('payment_audit_logs')
      .insert({
        payment_id: paymentId,
        event_type: eventType,
        event_data: eventData
      })
  } catch (error) {
    console.error('Failed to log payment event:', error)
    // Don't throw - audit logging failure shouldn't break the main operation
  }
}

function validatePaymentId(paymentId: string): boolean {
  // Basic UUID validation
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  return uuidRegex.test(paymentId)
}

function validateUserId(userId: string): boolean {
  // Basic UUID validation
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  return uuidRegex.test(userId)
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Action handlers
async function handleListOrphaned(supabase: any, adminContext: AdminContext): Promise<Response> {
  if (!adminContext.isAdmin) {
    return createErrorResponse('Admin access required', 403)
  }

  const orphanedThreshold = new Date(Date.now() - ORPHANED_PAYMENT_THRESHOLD_HOURS * 60 * 60 * 1000)

  const { data: orphanedPayments, error } = await supabase
    .from('payments')
    .select(`
      id,
      merchant_reference,
      amount,
      status,
      created_at,
      user_id,
      users!left(email, tracking_id)
    `)
    .or(`status.eq.${PAYMENT_STATUSES.PENDING},status.eq.${PAYMENT_STATUSES.FAILED}`)
    .lt('created_at', orphanedThreshold.toISOString())
    .order('created_at', { ascending: false })
    .limit(100) // Add pagination

  if (error) {
    console.error('Error fetching orphaned payments:', error)
    return createErrorResponse('Failed to fetch orphaned payments', 500)
  }

  return createSuccessResponse(orphanedPayments)
}

async function handleListFailed(supabase: any, adminContext: AdminContext): Promise<Response> {
  if (!adminContext.isAdmin) {
    return createErrorResponse('Admin access required', 403)
  }

  const { data: failedPayments, error } = await supabase
    .from('payments')
    .select(`
      id,
      merchant_reference,
      amount,
      status,
      created_at,
      user_id,
      users!left(email, tracking_id)
    `)
    .eq('status', PAYMENT_STATUSES.FAILED)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching failed payments:', error)
    return createErrorResponse('Failed to fetch failed payments', 500)
  }

  return createSuccessResponse(failedPayments)
}

async function handleLinkPayment(
  supabase: any, 
  adminContext: AdminContext, 
  paymentId: string, 
  userId: string, 
  resolutionNotes?: string
): Promise<Response> {
  if (!adminContext.isAdmin) {
    return createErrorResponse('Admin access required', 403)
  }

  if (!validatePaymentId(paymentId) || !validateUserId(userId)) {
    return createErrorResponse('Invalid payment_id or user_id format')
  }

  const { error: linkError } = await supabase
    .from('payments')
    .update({ 
      user_id: userId,
      updated_at: new Date().toISOString()
    })
    .eq('id', paymentId)

  if (linkError) {
    console.error('Error linking payment:', linkError)
    return createErrorResponse('Failed to link payment', 500)
  }

  await logPaymentEvent(supabase, paymentId, EVENT_TYPES.ADMIN_LINKED_PAYMENT, {
    admin_user_id: adminContext.currentUserId,
    linked_user_id: userId,
    notes: resolutionNotes || 'Payment linked by admin'
  })

  return createSuccessResponse(null, 'Payment linked successfully')
}

async function handleResolvePayment(
  supabase: any, 
  adminContext: AdminContext, 
  paymentId: string, 
  resolutionNotes?: string
): Promise<Response> {
  if (!adminContext.isAdmin) {
    return createErrorResponse('Admin access required', 403)
  }

  if (!validatePaymentId(paymentId)) {
    return createErrorResponse('Invalid payment_id format')
  }

  const { error: resolveError } = await supabase
    .from('payments')
    .update({ 
      status: PAYMENT_STATUSES.REFUNDED,
      updated_at: new Date().toISOString()
    })
    .eq('id', paymentId)

  if (resolveError) {
    console.error('Error resolving payment:', resolveError)
    return createErrorResponse('Failed to resolve payment', 500)
  }

  await logPaymentEvent(supabase, paymentId, EVENT_TYPES.ADMIN_RESOLVED_PAYMENT, {
    admin_user_id: adminContext.currentUserId,
    resolution_notes: resolutionNotes || 'Payment resolved by admin'
  })

  return createSuccessResponse(null, 'Payment resolved successfully')
}

async function handleUserRecoveryCheck(
  supabase: any, 
  userEmail: string
): Promise<Response> {
  if (!validateEmail(userEmail)) {
    return createErrorResponse('Invalid email format')
  }

  const emailPrefix = userEmail.split('@')[0]

  const { data: potentialPayments, error } = await supabase
    .from('payments')
    .select('*')
    .or(`status.eq.${PAYMENT_STATUSES.PENDING},status.eq.${PAYMENT_STATUSES.FAILED}`)
    .like('merchant_reference', `%${emailPrefix}%`)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error checking for recovery payments:', error)
    return createErrorResponse('Failed to check for recovery payments', 500)
  }

  return createSuccessResponse(potentialPayments)
}

async function handleClaimPayment(
  supabase: any, 
  paymentId: string, 
  userId: string
): Promise<Response> {
  if (!validatePaymentId(paymentId) || !validateUserId(userId)) {
    return createErrorResponse('Invalid payment_id or user_id format')
  }

  // Use transaction to prevent race conditions
  const { data: paymentToClaim, error: claimCheckError } = await supabase
    .from('payments')
    .select('*')
    .eq('id', paymentId)
    .single()

  if (claimCheckError || !paymentToClaim) {
    return createErrorResponse('Payment not found', 404)
  }

  if (paymentToClaim.user_id && paymentToClaim.user_id !== userId) {
    return createErrorResponse('Payment already claimed by another user', 403)
  }

  const { error: claimError } = await supabase
    .from('payments')
    .update({ 
      user_id: userId,
      updated_at: new Date().toISOString()
    })
    .eq('id', paymentId)

  if (claimError) {
    console.error('Error claiming payment:', claimError)
    return createErrorResponse('Failed to claim payment', 500)
  }

  await logPaymentEvent(supabase, paymentId, EVENT_TYPES.USER_CLAIMED_PAYMENT, {
    user_id: userId,
    previous_user_id: paymentToClaim.user_id
  })

  return createSuccessResponse(null, 'Payment claimed successfully')
}

// Main handler
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS })
  }

  try {
    const { 
      action, 
      payment_id, 
      user_id, 
      user_email, 
      resolution_notes 
    }: PaymentRecoveryRequest = await req.json()

    if (!action) {
      return createErrorResponse('Missing action parameter')
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Validate admin access
    const authHeader = req.headers.get('authorization')
    const adminContext = await validateAdminAccess(supabase, authHeader)

    // Route to appropriate handler
    switch (action) {
      case 'list_orphaned':
        return await handleListOrphaned(supabase, adminContext)

      case 'list_failed':
        return await handleListFailed(supabase, adminContext)

      case 'link_payment':
        if (!payment_id || !user_id) {
          return createErrorResponse('payment_id and user_id are required')
        }
        return await handleLinkPayment(supabase, adminContext, payment_id, user_id, resolution_notes)

      case 'resolve_payment':
        if (!payment_id) {
          return createErrorResponse('payment_id is required')
        }
        return await handleResolvePayment(supabase, adminContext, payment_id, resolution_notes)

      case 'user_recovery_check':
        if (!user_email) {
          return createErrorResponse('user_email is required')
        }
        return await handleUserRecoveryCheck(supabase, user_email)

      case 'claim_payment':
        if (!payment_id || !user_id) {
          return createErrorResponse('payment_id and user_id are required')
        }
        return await handleClaimPayment(supabase, payment_id, user_id)

      default:
        return createErrorResponse('Invalid action')
    }

  } catch (error) {
    console.error('Payment recovery function error:', error)
    return createErrorResponse('Internal server error', 500)
  }
}) 