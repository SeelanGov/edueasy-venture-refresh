
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.1';

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
  
  try {
    const { documentId, userId, documentType, imageUrl } = await req.json();
    
    if (!documentId || !userId || !documentType || !imageUrl) {
      throw new Error('Missing required parameters');
    }

    console.log(`Processing ${documentType} document (ID: ${documentId}) for user ${userId}`);
    
    // Create Supabase client with service role key for admin access
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // Log verification attempt
    const { error: logError } = await supabase
      .from('document_verification_logs')
      .insert({
        document_id: documentId,
        user_id: userId,
        document_type: documentType,
        status: 'processing',
        verification_method: 'huggingface-ocr'
      });
    
    if (logError) {
      console.error('Error logging verification attempt:', logError);
    }
    
    // Fetch and process the image
    let imageData;
    try {
      // Convert signed URL to blob
      const imageResponse = await fetch(imageUrl);
      const imageBlob = await imageResponse.blob();
      
      // Convert to base64 for OCR processing
      const arrayBuffer = await imageBlob.arrayBuffer();
      const base64 = btoa(
        new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
      );
      imageData = `data:${imageBlob.type};base64,${base64}`;
    } catch (error) {
      console.error('Error processing image:', error);
      throw new Error('Failed to process document image');
    }
    
    // Perform OCR using simplified approach (mock for development)
    let extractedText = '';
    let validationResults = {};
    let verificationStatus = 'pending';
    let confidenceScore = 0;
    let failureReason = null;
    
    try {
      console.log('Initializing OCR processing...');
      
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
      
      console.log('OCR processing completed with status:', verificationStatus);
      
    } catch (error) {
      console.error('Error in OCR processing:', error);
      verificationStatus = 'request_resubmission';
      failureReason = 'Error processing document';
      confidenceScore = 0;
    }
    
    // Update document verification status and extracted data
    const { error: updateError } = await supabase
      .from('documents')
      .update({
        verification_status: verificationStatus,
        extracted_text: extractedText,
        verification_confidence: confidenceScore,
        rejection_reason: failureReason,
        verification_details: validationResults,
        verified_at: new Date().toISOString()
      })
      .eq('id', documentId);
    
    if (updateError) {
      console.error('Error updating document status:', updateError);
      throw updateError;
    }
    
    // Update the verification log
    const { error: logUpdateError } = await supabase
      .from('document_verification_logs')
      .update({
        status: verificationStatus,
        confidence_score: confidenceScore,
        verification_details: validationResults,
        failure_reason: failureReason,
        completed_at: new Date().toISOString()
      })
      .eq('document_id', documentId)
      .eq('status', 'processing');
    
    if (logUpdateError) {
      console.error('Error updating verification log:', logUpdateError);
    }
    
    // If document was rejected or needs resubmission, create a notification
    if (verificationStatus === 'rejected' || verificationStatus === 'request_resubmission') {
      const notificationType = verificationStatus === 'rejected' ? 'document_rejected' : 'document_resubmit';
      const notificationTitle = verificationStatus === 'rejected' ? 'Document Rejected' : 'Document Resubmission Required';
      const notificationMessage = failureReason || 'Please check your document and try again.';
      
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
        console.error('Error creating notification:', notificationError);
      }
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        documentId,
        status: verificationStatus,
        confidence: confidenceScore,
        validationResults,
        failureReason
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error in document verification:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
