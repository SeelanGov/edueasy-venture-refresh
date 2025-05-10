
// Import the fetch retry utility
import { fetchWithRetry } from './networkUtils.ts';

/**
 * Process a document by downloading its image and preparing it for verification
 */
export async function processDocument(imageUrl: string): Promise<string> {
  console.log('Processing document image', { timestamp: new Date().toISOString() });
  
  try {
    // Download the image
    const response = await fetchWithRetry(imageUrl, {
      method: 'GET',
      headers: {
        'Accept': 'image/*',
      },
    }, 3);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
    }
    
    // Convert the image to base64
    const blob = await response.blob();
    const buffer = await blob.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
    
    console.log('Image processed successfully', {
      sizeKb: Math.round(buffer.byteLength / 1024),
      timestamp: new Date().toISOString()
    });
    
    return base64;
  } catch (error) {
    console.error('Error processing document:', error);
    throw error;
  }
}

/**
 * Verify a document using OCR and validation rules
 */
export async function verifyDocument(
  documentType: string, 
  base64Image: string
): Promise<{
  status: 'approved' | 'rejected' | 'request_resubmission',
  confidence: number,
  validationResults: Record<string, any>,
  failureReason: string | null,
  extractedText: string | null,
  extractedFields: Record<string, string> | null
}> {
  console.log(`Verifying ${documentType} document`, { timestamp: new Date().toISOString() });
  
  // Get API key from environment
  const apiKey = Deno.env.get('OCRSPACE_API_KEY');
  if (!apiKey) {
    throw new Error('OCRSPACE_API_KEY is not configured');
  }
  
  try {
    // Make OCR request to ocr.space API
    const ocrResponse = await fetchWithRetry('https://api.ocr.space/parse/image', {
      method: 'POST',
      headers: {
        'apikey': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        base64Image: `data:image/jpeg;base64,${base64Image}`,
        language: 'eng',
        isCreateSearchablePdf: false,
        isOverlayRequired: true,
        filetype: 'jpg',
        detectOrientation: true,
        scale: true,
        OCREngine: '2'
      })
    }, 2);
    
    if (!ocrResponse.ok) {
      throw new Error(`OCR API error: ${ocrResponse.status} ${ocrResponse.statusText}`);
    }
    
    const ocrResult = await ocrResponse.json();
    
    if (!ocrResult.ParsedResults || ocrResult.ParsedResults.length === 0) {
      return {
        status: 'request_resubmission',
        confidence: 0,
        validationResults: { error: 'No text detected in document' },
        failureReason: 'Could not extract any text from the document. Please upload a clearer image.',
        extractedText: null,
        extractedFields: null
      };
    }
    
    const extractedText = ocrResult.ParsedResults[0].ParsedText;
    const confidence = parseFloat(ocrResult.ParsedResults[0].TextOverlay?.Lines?.[0]?.Words?.[0]?.WordText || '0') || 75;
    
    console.log(`Extracted text with confidence: ${confidence}%`, {
      textLength: extractedText.length,
      timestamp: new Date().toISOString()
    });
    
    // Validate based on document type
    switch (documentType) {
      case 'idDocument':
        return validateIdDocument(extractedText, confidence);
      case 'grade12Results':
        return validateGrade12Results(extractedText, confidence);
      case 'proofOfResidence':
        return validateProofOfResidence(extractedText, confidence);
      default:
        // Generic validation for other document types
        if (confidence < 50 || extractedText.length < 20) {
          return {
            status: 'request_resubmission',
            confidence,
            validationResults: { textQuality: 'poor' },
            failureReason: 'Document quality is too low. Please upload a clearer image.',
            extractedText,
            extractedFields: null
          };
        }
        
        return {
          status: 'approved',
          confidence,
          validationResults: { textQuality: 'acceptable' },
          failureReason: null,
          extractedText,
          extractedFields: { fullText: extractedText }
        };
    }
  } catch (error) {
    console.error('Document verification failed:', error);
    throw error;
  }
}

/**
 * Validate ID document
 */
function validateIdDocument(text: string, confidence: number): ReturnType<typeof verifyDocument> {
  // Extract ID number (South African ID format is 13 digits)
  const idNumberMatch = text.match(/\b\d{13}\b/);
  const nameMatch = text.match(/(?:surname|last\s*name|family\s*name)[\s:]+([A-Za-z\s]+)/i);
  
  const extractedFields: Record<string, string> = {};
  
  if (idNumberMatch) {
    extractedFields.idNumber = idNumberMatch[0];
  }
  
  if (nameMatch) {
    extractedFields.surname = nameMatch[1].trim();
  }
  
  const validationResults = {
    hasIdNumber: !!idNumberMatch,
    hasName: !!nameMatch,
    confidence
  };
  
  // Check if critical fields are present
  if (!idNumberMatch) {
    return {
      status: 'request_resubmission',
      confidence,
      validationResults,
      failureReason: 'Could not detect a valid ID number on the document. Please upload a clearer image.',
      extractedText: text,
      extractedFields: Object.keys(extractedFields).length > 0 ? extractedFields : null
    };
  }
  
  // Lower confidence but has critical fields
  if (confidence < 70) {
    return {
      status: 'approved',
      confidence,
      validationResults,
      failureReason: null,
      extractedText: text,
      extractedFields
    };
  }
  
  return {
    status: 'approved',
    confidence,
    validationResults,
    failureReason: null,
    extractedText: text,
    extractedFields
  };
}

/**
 * Validate Grade 12 Results document
 */
function validateGrade12Results(text: string, confidence: number): ReturnType<typeof verifyDocument> {
  // Look for subject pattern: subject name followed by percentage or grade
  const subjectMatches = text.match(/(?:\b[A-Za-z\s]+\b[\s:]+(?:\d{1,3}%|\b[A-F]\b))/g);
  const hasGrade = text.match(/\b(?:grade|matric|nsc)\b/i);
  
  const validationResults = {
    hasSubjects: subjectMatches ? subjectMatches.length > 0 : false,
    subjectsFound: subjectMatches?.length || 0,
    hasGradeIndicator: !!hasGrade,
    confidence
  };
  
  const extractedFields: Record<string, string> = {};
  
  // Extract subjects and marks if available
  if (subjectMatches) {
    subjectMatches.forEach((match, index) => {
      const parts = match.split(/[\s:]+/);
      if (parts.length >= 2) {
        const subject = parts.slice(0, -1).join(' ').trim();
        const mark = parts[parts.length - 1];
        extractedFields[`subject_${index + 1}`] = subject;
        extractedFields[`mark_${index + 1}`] = mark;
      }
    });
  }
  
  // Check if document appears to be results
  if (!subjectMatches || subjectMatches.length < 2) {
    return {
      status: 'request_resubmission',
      confidence,
      validationResults,
      failureReason: 'Could not detect subject results on the document. Please ensure this is a grade results document.',
      extractedText: text,
      extractedFields: Object.keys(extractedFields).length > 0 ? extractedFields : null
    };
  }
  
  return {
    status: 'approved',
    confidence,
    validationResults,
    failureReason: null,
    extractedText: text,
    extractedFields
  };
}

/**
 * Validate proof of residence document
 */
function validateProofOfResidence(text: string, confidence: number): ReturnType<typeof verifyDocument> {
  // Look for address indicators
  const hasAddress = text.match(/(?:\b(?:address|street|avenue|road|lane|drive|boulevard|crescent)\b)/i);
  const hasPostalCode = text.match(/\b\d{4,5}\b/); // Standard postal code format
  
  const validationResults = {
    hasAddressIndicator: !!hasAddress,
    hasPostalCode: !!hasPostalCode,
    confidence
  };
  
  // Extract potential address if available
  const extractedFields: Record<string, string> = {};
  
  if (hasAddress) {
    // Try to extract the full address using a common pattern
    const addressMatch = text.match(/(?:\b(?:address|residential|physical|home)[\s:]+)([A-Za-z0-9\s,\.\-\/]+)/i);
    if (addressMatch) {
      extractedFields.address = addressMatch[1].trim();
    }
  }
  
  if (hasPostalCode) {
    extractedFields.postalCode = hasPostalCode[0];
  }
  
  // Check if document appears to be a proof of residence
  if (!hasAddress) {
    return {
      status: 'request_resubmission',
      confidence,
      validationResults,
      failureReason: 'Could not detect address information on the document. Please ensure this is a proof of residence document.',
      extractedText: text,
      extractedFields: Object.keys(extractedFields).length > 0 ? extractedFields : null
    };
  }
  
  return {
    status: 'approved',
    confidence,
    validationResults,
    failureReason: null,
    extractedText: text,
    extractedFields
  };
}
