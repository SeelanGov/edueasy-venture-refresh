import 'https://deno.land/x/xhr@0.1.0/mod.ts';
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.1';
import type { VerificationError } from './errorHandler.ts';
import { handleError, ErrorCategory, getUserFriendlyErrorMessage } from './errorHandler.ts';
import { withTimeout } from './networkUtils.ts';
import { processDocument, verifyDocument } from './documentProcessor.ts';
import {
  updateVerificationStatus,
  logVerificationAttempt,
  createVerificationNotification,
} from './databaseUtils.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') as string;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Create Supabase client for logging throughout the function
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const startTime = new Date();
  let logId: string | undefined;

  try {
    console.log('Starting document verification process', { timestamp: startTime.toISOString() });

    // Parse and validate request body
    let requestBody;
    try {
      requestBody = await req.json();
      console.log('Request received:', {
        body: { ...requestBody, imageUrl: '[REDACTED]' },
        timestamp: new Date().toISOString(),
      });
    } catch (error: unknown) {
      const verificationError: VerificationError = {
        category: ErrorCategory.VALIDATION,
        message: 'Invalid JSON in request body',
        details:
          typeof error === 'object' && error && 'message' in error
            ? (error as { message: string }).message
            : String(error),
        timestamp: new Date().toISOString(),
      };

      handleError(verificationError, supabase);
      throw new Error('Invalid request format: Could not parse JSON body');
    }

    const { documentId, userId, documentType, imageUrl } = requestBody;

    // Validate required parameters
    if (!documentId || !userId || !documentType || !imageUrl) {
      const missingParams = [];
      if (!documentId) missingParams.push('documentId');
      if (!userId) missingParams.push('userId');
      if (!documentType) missingParams.push('documentType');
      if (!imageUrl) missingParams.push('imageUrl');

      const error: VerificationError = {
        category: ErrorCategory.VALIDATION,
        message: `Missing required parameters: ${missingParams.join(', ')}`,
        details: { missingParams },
        timestamp: new Date().toISOString(),
      };

      handleError(error, supabase);
      throw new Error(error.message);
    }

    console.log(`Processing ${documentType} document (ID: ${documentId}) for user ${userId}`, {
      timestamp: new Date().toISOString(),
      documentType,
      documentId,
      userId,
    });

    // Log verification attempt in database
    try {
      logId = await logVerificationAttempt(supabase, {
        documentId,
        userId,
        documentType,
      });
    } catch (error: unknown) {
      console.error(
        'Unexpected error creating log entry:',
        typeof error === 'object' && error && 'message' in error
          ? (error as { message: string }).message
          : String(error),
        {
          timestamp: new Date().toISOString(),
        },
      );
      // Continue processing even if logging fails
    }

    // Process the document image with timeout
    let imageData;
    try {
      imageData = await withTimeout(
        processDocument(imageUrl),
        30000,
        'Document processing timed out',
      );
    } catch (error: unknown) {
      const verificationError: VerificationError = {
        category: ErrorCategory.NETWORK,
        message: 'Failed to process document image',
        details: {
          originalError:
            typeof error === 'object' && error && 'message' in error
              ? (error as { message: string }).message
              : String(error),
          documentId,
          documentType,
        },
        timestamp: new Date().toISOString(),
      };

      handleError(verificationError, supabase, logId, documentId);
      await updateVerificationStatus(
        supabase,
        'request_resubmission',
        documentId,
        'Failed to process document: Network or download error',
        0,
        {},
        logId,
        userId,
      );

      await createVerificationNotification(
        supabase,
        userId,
        documentId,
        documentType,
        'request_resubmission',
        'Failed to process document: Network or download error',
      );

      throw new Error(
        'Failed to process document image: ' +
          (typeof error === 'object' && error && 'message' in error
            ? (error as { message: string }).message
            : String(error)),
      );
    }

    // Verify the document with timeout
    const verificationResult = await withTimeout(
      verifyDocument(documentType, imageData),
      60000,
      'Document verification timed out',
    );

    // Update document verification status and extracted data
    try {
      await updateVerificationStatus(
        supabase,
        verificationResult.status,
        documentId,
        verificationResult.failureReason,
        verificationResult.confidence,
        verificationResult.validationResults,
        logId,
        userId,
        verificationResult.extractedText,
        verificationResult.extractedFields,
      );

      // Create notification for the user
      await createVerificationNotification(
        supabase,
        userId,
        documentId,
        documentType,
        verificationResult.status,
        verificationResult.failureReason,
      );
    } catch (error: unknown) {
      const verificationError: VerificationError = {
        category: ErrorCategory.DATABASE,
        message: 'Failed to update document status',
        details: {
          originalError:
            typeof error === 'object' && error && 'message' in error
              ? (error as { message: string }).message
              : String(error),
          documentId,
          documentType,
          verificationStatus: verificationResult.status,
        },
        timestamp: new Date().toISOString(),
      };

      handleError(verificationError, supabase, logId, documentId);
      throw error;
    }

    // Calculate processing duration
    const endTime = new Date();
    const processingTime = endTime.getTime() - startTime.getTime();

    console.log('Document verification completed successfully', {
      documentId,
      status: verificationResult.status,
      processingTimeMs: processingTime,
      timestamp: endTime.toISOString(),
    });

    return new Response(
      JSON.stringify({
        success: true,
        documentId,
        status: verificationResult.status,
        confidence: verificationResult.confidence,
        validationResults: verificationResult.validationResults,
        failureReason: verificationResult.failureReason,
        extractedFields: verificationResult.extractedFields,
        processingTimeMs: processingTime,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (error: unknown) {
    const endTime = new Date();
    const processingTime = endTime.getTime() - startTime.getTime();

    console.error(
      'Error in document verification:',
      typeof error === 'object' && error && 'message' in error
        ? (error as { message: string }).message
        : String(error),
      {
        timestamp: endTime.toISOString(),
        processingTimeMs: processingTime,
      },
    );

    // Determine appropriate status code
    let statusCode = 500;
    if (
      typeof error === 'object' &&
      error &&
      'message' in error &&
      (error as { message: string }).message.includes('Missing required parameters')
    ) {
      statusCode = 400;
    } else if (
      typeof error === 'object' &&
      error &&
      'message' in error &&
      (error as { message: string }).message.includes('Failed to fetch image')
    ) {
      statusCode = 422;
    }

    // Get user-friendly error message if available
    const errorCategory =
      typeof error === 'object' && error && 'category' in error
        ? (error as { category: ErrorCategory }).category
        : ErrorCategory.UNKNOWN;
    const userMessage = getUserFriendlyErrorMessage(errorCategory);

    // Return error response
    return new Response(
      JSON.stringify({
        success: false,
        error:
          typeof error === 'object' && error && 'message' in error
            ? (error as { message: string }).message
            : String(error),
        userMessage,
        errorDetails:
          typeof error === 'object' && error && 'category' in error
            ? {
                category: (error as { category: ErrorCategory }).category,
                timestamp: (error as { timestamp: string }).timestamp,
              }
            : undefined,
        processingTimeMs: processingTime,
      }),
      {
        status: statusCode,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});
