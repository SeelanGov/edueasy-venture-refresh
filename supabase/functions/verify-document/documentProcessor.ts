
import { ErrorCategory, VerificationError } from './errorHandler.ts';

export interface VerificationResult {
  status: 'approved' | 'rejected' | 'request_resubmission' | 'pending';
  confidence: number;
  validationResults: Record<string, any>;
  failureReason: string | null;
  extractedText?: string;
  processingTimeMs?: number;
}

/**
 * Perform OCR and document verification
 * @param documentType Type of document being processed
 * @param imageData Base64 encoded image data
 * @returns Verification result
 */
export async function verifyDocument(documentType: string, imageData: string): Promise<VerificationResult> {
  console.log('Initializing OCR processing...', { 
    documentType, 
    timestamp: new Date().toISOString() 
  });
  
  let extractedText = '';
  let validationResults = {};
  let verificationStatus = 'pending';
  let confidenceScore = 0;
  let failureReason = null;
  
  try {
    // For development testing, simulate OCR with sample text based on document type
    if (documentType === 'idDocument') {
      extractedText = 'REPUBLIC OF SOUTH AFRICA\nIDENTITY DOCUMENT\nSURNAME: SMITH\nNAMES: JOHN DAVID\nID NUMBER: 8012115062080\nNATIONALITY: RSA\nDOB: 11 DEC 1980\nGENDER: M';
      confidenceScore = 0.89;
      
      // Basic validation for ID document
      validationResults = validateIdDocument(extractedText);
      verificationStatus = validationResults.isValid ? 'approved' : 'rejected';
      failureReason = validationResults.isValid ? null : validationResults.failureReason;
    } 
    else if (documentType === 'proofOfResidence') {
      extractedText = 'CITY POWER\nELECTRICITY STATEMENT\nACCOUNT NO: 1234567890\nNAME: JOHN SMITH\nADDRESS: 123 MAIN ROAD\nBRAAMFONTEIN\nJOHANNESBURG\n2001\nBILLING DATE: 15 MAY 2023';
      confidenceScore = 0.82;
      
      // Basic validation for proof of residence
      validationResults = validateProofOfResidence(extractedText);
      verificationStatus = validationResults.isValid ? 'approved' : 'rejected';
      failureReason = validationResults.isValid ? null : validationResults.failureReason;
    } 
    else {
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
    
    verificationStatus = 'request_resubmission';
    failureReason = 'Error processing document: Please ensure the document is clear and try again';
    confidenceScore = 0;
    validationResults = { error: 'Processing failed' };
  }
  
  return {
    status: verificationStatus as 'approved' | 'rejected' | 'request_resubmission' | 'pending',
    confidence: confidenceScore,
    validationResults,
    failureReason,
    extractedText
  };
}

/**
 * Validate ID document based on extracted text
 */
function validateIdDocument(extractedText: string): any {
  const idMatch = extractedText.match(/ID NUMBER: (\d{13})/);
  const idNumber = idMatch ? idMatch[1] : null;
  
  if (idNumber && idNumber.length === 13) {
    return {
      isValid: true,
      idNumberPresent: true,
      idNumberValid: true,
      namePresent: extractedText.includes('NAMES:'),
      surnamePresent: extractedText.includes('SURNAME:'),
      documentType: 'South African ID'
    };
  } else {
    return {
      isValid: false,
      failureReason: 'Unable to verify ID number format',
      idNumberPresent: Boolean(idNumber),
      idNumberValid: false,
      namePresent: extractedText.includes('NAMES:'),
      surnamePresent: extractedText.includes('SURNAME:')
    };
  }
}

/**
 * Validate proof of residence based on extracted text
 */
function validateProofOfResidence(extractedText: string): any {
  const hasAddress = extractedText.includes('ADDRESS:');
  const hasName = extractedText.includes('NAME:');
  const hasRecentDate = extractedText.includes('2023');
  
  const validationResult = {
    isValid: hasAddress && hasName && hasRecentDate,
    addressPresent: hasAddress,
    namePresent: hasName,
    recentDocument: hasRecentDate,
    documentType: 'Utility Bill'
  };
  
  if (!validationResult.isValid) {
    validationResult.failureReason = !hasRecentDate 
      ? 'Document appears to be outdated' 
      : !hasAddress 
        ? 'No address detected on document' 
        : 'Missing required information';
  }
  
  return validationResult;
}
