
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Error categories for better classification
enum ErrorCategory {
  VALIDATION = "validation",
  NETWORK = "network",
  PROCESSING = "processing",
  DATABASE = "database",
  UNKNOWN = "unknown"
}

// Standardized error object
interface VerificationError {
  category: ErrorCategory;
  message: string;
  details?: unknown;
  timestamp: string;
}

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
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      await logError({
        category: ErrorCategory.VALIDATION,
        message: 'Invalid JSON in request body',
        details: error,
        timestamp: new Date().toISOString()
      }, supabase);
      
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
        timestamp: new Date().toISOString()
      };
      
      await logError(error, supabase);
      throw new Error(error.message);
    }

    console.log(`Processing ${documentType} document (ID: ${documentId}) for user ${userId}`, {
      timestamp: new Date().toISOString(),
      documentType,
      documentId,
      userId
    });
    
    // Log verification attempt in database
    try {
      const { data: logData, error: logError } = await supabase
        .from('document_verification_logs')
        .insert({
          document_id: documentId,
          user_id: userId,
          document_type: documentType,
          status: 'processing',
          verification_method: 'ocr-verification',
          started_at: new Date().toISOString()
        })
        .select('id')
        .single();
      
      if (logError) {
        console.error('Error logging verification attempt:', logError, {
          timestamp: new Date().toISOString()
        });
      } else if (logData) {
        logId = logData.id;
        console.log('Created verification log entry:', { logId, timestamp: new Date().toISOString() });
      }
    } catch (error) {
      console.error('Unexpected error creating log entry:', error, {
        timestamp: new Date().toISOString()
      });
      // Continue processing even if logging fails
    }
    
    // Fetch and process the image
    let imageData;
    try {
      console.log('Fetching document image', { timestamp: new Date().toISOString() });
      
      // Convert signed URL to blob with timeout and retry
      const imageResponse = await fetchWithRetry(imageUrl);
      
      if (!imageResponse.ok) {
        throw new Error(`Failed to fetch image: HTTP ${imageResponse.status} - ${imageResponse.statusText}`);
      }
      
      const imageBlob = await imageResponse.blob();
      console.log('Image fetched successfully', { 
        size: imageBlob.size,
        type: imageBlob.type,
        timestamp: new Date().toISOString()
      });
      
      // Convert to base64 for OCR processing
      const arrayBuffer = await imageBlob.arrayBuffer();
      const base64 = btoa(
        new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
      );
      imageData = `data:${imageBlob.type};base64,${base64}`;
      console.log('Image converted to base64', { timestamp: new Date().toISOString() });
    } catch (error: any) {
      const verificationError: VerificationError = {
        category: ErrorCategory.NETWORK,
        message: 'Failed to process document image',
        details: {
          originalError: error.message,
          documentId,
          documentType
        },
        timestamp: new Date().toISOString()
      };
      
      await logError(verificationError, supabase, logId, documentId);
      await updateVerificationStatus(
        'request_resubmission', 
        documentId, 
        'Failed to process document: Network or download error', 
        0,
        {},
        supabase, 
        logId, 
        userId
      );
      
      throw new Error('Failed to process document image: ' + error.message);
    }
    
    // Perform OCR using simplified approach (mock for development)
    let extractedText = '';
    let validationResults = {};
    let verificationStatus = 'pending';
    let confidenceScore = 0;
    let failureReason = null;
    
    try {
      console.log('Initializing OCR processing...', { 
        documentType, 
        timestamp: new Date().toISOString() 
      });
      
      // For development testing, simulate OCR with sample text based on document type
      if (documentType === 'idDocument') {
        extractedText = 'REPUBLIC OF SOUTH AFRICA\nIDENTITY DOCUMENT\nSURNAME: SMITH\nNAMES: JOHN DAVID\nID NUMBER: 8012115062080\nNATIONALITY: RSA\nDOB: 11 DEC 1980\nGENDER: M';
        confidenceScore = 0.89;
        
        // Basic validation for ID document
        const idMatch = extractedText.match(/ID NUMBER: (\d{13})/);
        const idNumber = idMatch ? idMatch[1] : null;
        
        if (idNumber && idNumber.length === 13) {
          validationResults = {
            idNumberPresent: true,
            idNumberValid: true,
            namePresent: extractedText.includes('NAMES:'),
            surnamePresent: extractedText.includes('SURNAME:'),
            documentType: 'South African ID'
          };
          verificationStatus = 'approved';
        } else {
          validationResults = {
            idNumberPresent: Boolean(idNumber),
            idNumberValid: false,
            namePresent: extractedText.includes('NAMES:'),
            surnamePresent: extractedText.includes('SURNAME:')
          };
          verificationStatus = 'rejected';
          failureReason = 'Unable to verify ID number format';
        }
      } else if (documentType === 'proofOfResidence') {
        extractedText = 'CITY POWER\nELECTRICITY STATEMENT\nACCOUNT NO: 1234567890\nNAME: JOHN SMITH\nADDRESS: 123 MAIN ROAD\nBRAAMFONTEIN\nJOHANNESBURG\n2001\nBILLING DATE: 15 MAY 2023';
        confidenceScore = 0.82;
        
        // Basic validation for proof of residence
        const hasAddress = extractedText.includes('ADDRESS:');
        const hasName = extractedText.includes('NAME:');
        const hasRecentDate = extractedText.includes('2023');
        
        validationResults = {
          addressPresent: hasAddress,
          namePresent: hasName,
          recentDocument: hasRecentDate,
          documentType: 'Utility Bill'
        };
        
        if (hasAddress && hasName && hasRecentDate) {
          verificationStatus = 'approved';
        } else {
          verificationStatus = 'rejected';
          failureReason = !hasRecentDate 
            ? 'Document appears to be outdated' 
            : !hasAddress 
              ? 'No address detected on document' 
              : 'Missing required information';
        }
      } else {
        // For other document types
        extractedText = 'DOCUMENT CONTENT EXTRACTED';
        confidenceScore = 0.75;
        verificationStatus = 'request_resubmission';
        failureReason = 'Unable to verify document type';
      }
      
      console.log('OCR processing completed with status:', verificationStatus, {
        confidenceScore,
        documentType,
        failureReason,
        timestamp: new Date().toISOString()
      });
      
    } catch (error: any) {
      console.error('Error in OCR processing:', error, {
        timestamp: new Date().toISOString()
      });
      
      const verificationError: VerificationError = {
        category: ErrorCategory.PROCESSING,
        message: 'Error processing document with OCR',
        details: {
          originalError: error.message,
          documentId,
          documentType
        },
        timestamp: new Date().toISOString()
      };
      
      await logError(verificationError, supabase, logId, documentId);
      
      verificationStatus = 'request_resubmission';
      failureReason = 'Error processing document: Please ensure the document is clear and try again';
      confidenceScore = 0;
      validationResults = { error: 'Processing failed' };
    }
    
    // Update document verification status and extracted data
    try {
      await updateVerificationStatus(
        verificationStatus, 
        documentId, 
        failureReason, 
        confidenceScore,
        validationResults,
        supabase, 
        logId,
        userId,
        extractedText
      );
    } catch (error: any) {
      const verificationError: VerificationError = {
        category: ErrorCategory.DATABASE,
        message: 'Failed to update document status',
        details: {
          originalError: error.message,
          documentId,
          documentType,
          verificationStatus
        },
        timestamp: new Date().toISOString()
      };
      
      await logError(verificationError, supabase, logId, documentId);
      throw error;
    }
    
    // Calculate processing duration
    const endTime = new Date();
    const processingTime = endTime.getTime() - startTime.getTime();
    
    console.log('Document verification completed successfully', {
      documentId,
      status: verificationStatus,
      processingTimeMs: processingTime,
      timestamp: endTime.toISOString()
    });
    
    return new Response(
      JSON.stringify({
        success: true,
        documentId,
        status: verificationStatus,
        confidence: confidenceScore,
        validationResults,
        failureReason,
        processingTimeMs: processingTime
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error: any) {
    const endTime = new Date();
    const processingTime = endTime.getTime() - startTime.getTime();
    
    console.error('Error in document verification:', error, {
      timestamp: endTime.toISOString(),
      processingTimeMs: processingTime
    });
    
    // Determine appropriate status code
    let statusCode = 500;
    if (error.message.includes('Missing required parameters')) {
      statusCode = 400;
    } else if (error.message.includes('Failed to fetch image')) {
      statusCode = 422;
    }
    
    // Return error response
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        errorDetails: error.category ? {
          category: error.category,
          timestamp: error.timestamp
        } : undefined,
        processingTimeMs: processingTime
      }),
      { 
        status: statusCode,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

// Helper functions
async function fetchWithRetry(url: string, retries = 3, timeout = 10000): Promise<Response> {
  let lastError;
  
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      try {
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);
        return response;
      } catch (error) {
        clearTimeout(timeoutId);
        throw error;
      }
    } catch (error) {
      console.warn(`Fetch attempt ${attempt + 1} failed:`, error, {
        timestamp: new Date().toISOString()
      });
      lastError = error;
      
      // Wait before retrying (exponential backoff)
      if (attempt < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
  }
  
  throw lastError || new Error('Failed to fetch after multiple attempts');
}

async function logError(
  error: VerificationError, 
  supabase: any, 
  logId?: string,
  documentId?: string
): Promise<void> {
  console.error(`[${error.category.toUpperCase()}] ${error.message}`, error.details, {
    timestamp: error.timestamp,
    logId,
    documentId
  });
  
  // If we have a log ID, update the existing log entry
  if (logId) {
    try {
      await supabase
        .from('document_verification_logs')
        .update({
          status: 'error',
          failure_reason: error.message,
          verification_details: {
            error_category: error.category,
            error_details: JSON.stringify(error.details)
          },
          completed_at: new Date().toISOString()
        })
        .eq('id', logId);
    } catch (logError) {
      // Just log to console if updating the DB fails
      console.error('Failed to update error log:', logError, {
        originalError: error,
        timestamp: new Date().toISOString()
      });
    }
  }
}

async function updateVerificationStatus(
  status: string,
  documentId: string,
  failureReason: string | null,
  confidenceScore: number,
  validationResults: Record<string, any>,
  supabase: any,
  logId?: string,
  userId?: string,
  extractedText?: string
): Promise<void> {
  // Log this step
  console.log(`Updating document ${documentId} status to ${status}`, {
    documentId,
    status,
    failureReason,
    confidenceScore,
    timestamp: new Date().toISOString()
  });
  
  // Update document verification status
  const { error: updateError } = await supabase
    .from('documents')
    .update({
      verification_status: status,
      extracted_text: extractedText,
      verification_confidence: confidenceScore,
      rejection_reason: failureReason,
      verification_details: validationResults,
      verified_at: new Date().toISOString()
    })
    .eq('id', documentId);
  
  if (updateError) {
    console.error('Error updating document status:', updateError, {
      timestamp: new Date().toISOString()
    });
    throw updateError;
  }
  
  // Update the verification log
  if (logId) {
    const { error: logUpdateError } = await supabase
      .from('document_verification_logs')
      .update({
        status: status,
        confidence_score: confidenceScore,
        verification_details: validationResults,
        failure_reason: failureReason,
        completed_at: new Date().toISOString()
      })
      .eq('id', logId);
    
    if (logUpdateError) {
      console.error('Error updating verification log:', logUpdateError, {
        timestamp: new Date().toISOString()
      });
    }
  }
  
  // If document was rejected or needs resubmission and we have userId, create a notification
  if (userId && (status === 'rejected' || status === 'request_resubmission' || status === 'approved')) {
    const notificationType = status === 'rejected' 
      ? 'document_rejected' 
      : status === 'request_resubmission' 
        ? 'document_resubmit' 
        : 'document_approved';
        
    const notificationTitle = status === 'rejected' 
      ? 'Document Rejected' 
      : status === 'request_resubmission' 
        ? 'Document Resubmission Required' 
        : 'Document Approved';
        
    const notificationMessage = status === 'approved'
      ? 'Your document has been approved and verified.'
      : failureReason || 'Please check your document and try again.';
    
    try {
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          related_document_id: documentId,
          title: notificationTitle,
          message: notificationMessage,
          notification_type: notificationType
        });
      
      if (notificationError) {
        console.error('Error creating notification:', notificationError, {
          timestamp: new Date().toISOString()
        });
      } else {
        console.log(`Created ${notificationType} notification for user ${userId}`, {
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Unexpected error creating notification:', error, {
        timestamp: new Date().toISOString()
      });
    }
  }
}
