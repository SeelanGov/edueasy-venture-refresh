
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
        OCREngine: '2'  // Using engine 2 for better accuracy
      })
    }, 3, 1000);  // 3 retries, 1 second backoff
    
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
    // Calculate confidence either from API response or estimate based on text quality
    const confidenceFromAPI = parseFloat(ocrResult.ParsedResults[0].TextOverlay?.Lines?.[0]?.Words?.[0]?.WordText || '0');
    const confidence = confidenceFromAPI > 0 ? confidenceFromAPI : estimateConfidence(extractedText);
    
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
      case 'grade11Results':
        return validateGrade11Results(extractedText, confidence);
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
 * Estimate text extraction confidence based on heuristics
 */
function estimateConfidence(text: string): number {
  if (!text || text.length === 0) return 0;
  
  // Count recognizable patterns
  const wordCount = text.split(/\s+/).length;
  const alphaNumericRatio = (text.match(/[a-zA-Z0-9]/g) || []).length / text.length;
  const noiseRatio = (text.match(/[^a-zA-Z0-9\s.,;:!?()\-'""]/g) || []).length / text.length;
  
  // Basic heuristic for confidence calculation - this can be refined further
  let confidence = 60; // base confidence
  
  if (wordCount > 30) confidence += 10;
  if (alphaNumericRatio > 0.7) confidence += 15;
  if (noiseRatio < 0.1) confidence += 15;
  
  // Cap at 100%
  return Math.min(Math.max(confidence, 0), 100);
}

/**
 * Validate ID document
 */
function validateIdDocument(text: string, confidence: number): ReturnType<typeof verifyDocument> {
  // Enhanced extraction for ID documents
  const idNumberMatch = text.match(/\b\d{13}\b/);
  const nameMatch = text.match(/(?:surname|last\s*name|family\s*name)[\s:]+([A-Za-z\s]+)/i) || 
                    text.match(/(?:name)[\s:]+([A-Za-z\s]+)/i);
  const dobMatch = text.match(/(?:birth|born|dob)[\s:]+(\d{2}[-./]\d{2}[-./]\d{2,4})/i) ||
                  text.match(/(\d{2}[-./]\d{2}[-./]\d{2,4})/);
  const nationalityMatch = text.match(/(?:nationality|citizen)[\s:]+([A-Za-z\s]+)/i);
  
  const extractedFields: Record<string, string> = {};
  
  if (idNumberMatch) {
    extractedFields.idNumber = idNumberMatch[0];
  }
  
  if (nameMatch) {
    extractedFields.surname = nameMatch[1].trim();
  }
  
  if (dobMatch) {
    extractedFields.dateOfBirth = dobMatch[1].trim();
  }
  
  if (nationalityMatch) {
    extractedFields.nationality = nationalityMatch[1].trim();
  }
  
  const validationResults = {
    hasIdNumber: !!idNumberMatch,
    hasName: !!nameMatch,
    hasDateOfBirth: !!dobMatch,
    hasNationality: !!nationalityMatch,
    confidence
  };
  
  // Check if critical fields are present (ID number is minimum requirement)
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
  
  // Lower confidence but has critical fields - approve with warning
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
  // Enhanced extraction for grade results
  const subjectMatches = text.match(/(?:\b[A-Za-z\s]+\b[\s:]+(?:\d{1,3}%|\b[A-F]\b))/g);
  const hasGrade = text.match(/\b(?:grade|matric|nsc)\b/i);
  const studentNameMatch = text.match(/(?:student|learner|candidate|name)[\s:]+([A-Za-z\s]+)/i);
  const studentIdMatch = text.match(/(?:student\s*id|learner\s*id|candidate\s*number)[\s:]+([A-Z0-9\s]+)/i);
  const yearMatch = text.match(/(?:year|session|examination\s*date)[\s:]+(\d{4})/i);
  
  const validationResults = {
    hasSubjects: subjectMatches ? subjectMatches.length > 0 : false,
    subjectsFound: subjectMatches?.length || 0,
    hasGradeIndicator: !!hasGrade,
    hasStudentName: !!studentNameMatch,
    hasStudentId: !!studentIdMatch,
    hasYearInfo: !!yearMatch,
    confidence
  };
  
  const extractedFields: Record<string, string> = {};
  
  if (studentNameMatch) {
    extractedFields.studentName = studentNameMatch[1].trim();
  }
  
  if (studentIdMatch) {
    extractedFields.studentId = studentIdMatch[1].trim();
  }
  
  if (yearMatch) {
    extractedFields.year = yearMatch[1].trim();
  }
  
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
  
  // Check if document appears to be results (need at least two subjects)
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
 * Validate Grade 11 Results document
 */
function validateGrade11Results(text: string, confidence: number): ReturnType<typeof verifyDocument> {
  // Use the same validation logic as Grade 12 but with different grade expectation
  const result = validateGrade12Results(text, confidence);
  
  // Update validation results to check for Grade 11 specifically
  const grade11Indicator = text.match(/\b(?:grade\s*11|grade\s*xi)\b/i);
  if (result.validationResults) {
    result.validationResults.hasGrade11Indicator = !!grade11Indicator;
  }
  
  return result;
}

/**
 * Validate proof of residence document
 */
function validateProofOfResidence(text: string, confidence: number): ReturnType<typeof verifyDocument> {
  // Enhanced extraction for proof of residence
  const hasAddress = text.match(/(?:\b(?:address|street|avenue|road|lane|drive|boulevard|crescent)\b)/i);
  const hasPostalCode = text.match(/\b\d{4,5}\b/); // Standard postal code format
  const hasName = text.match(/(?:\b(?:name|resident|customer|client|account holder)\b[\s:]+)([A-Za-z\s]+)/i);
  const hasDate = text.match(/(?:\b(?:date|issued|statement date)\b[\s:]+)(\d{1,2}[-./]\d{1,2}[-./]\d{2,4})/i);
  const hasUtilityProvider = text.match(/(?:\b(?:municipality|utility|provider|council|company)\b[\s:]+)([A-Za-z\s]+)/i);
  
  const validationResults = {
    hasAddressIndicator: !!hasAddress,
    hasPostalCode: !!hasPostalCode,
    hasName: !!hasName,
    hasDate: !!hasDate,
    hasUtilityProvider: !!hasUtilityProvider,
    confidence
  };
  
  // Extract potential address and other info if available
  const extractedFields: Record<string, string> = {};
  
  if (hasName) {
    extractedFields.name = hasName[1].trim();
  }
  
  if (hasDate) {
    extractedFields.date = hasDate[1].trim();
  }
  
  if (hasUtilityProvider) {
    extractedFields.provider = hasUtilityProvider[1].trim();
  }
  
  if (hasAddress) {
    // Try to extract the full address using common patterns
    const addressMatch = text.match(/(?:\b(?:address|residential|physical|home)[\s:]+)([A-Za-z0-9\s,\.\-\/]+)/i);
    if (addressMatch) {
      extractedFields.address = addressMatch[1].trim();
      
      // Try to extract street, suburb, city from the full address
      const addressParts = addressMatch[1].split(',');
      if (addressParts.length >= 1) extractedFields.street = addressParts[0].trim();
      if (addressParts.length >= 2) extractedFields.suburb = addressParts[1].trim();
      if (addressParts.length >= 3) extractedFields.city = addressParts[2].trim();
    }
  }
  
  if (hasPostalCode) {
    extractedFields.postalCode = hasPostalCode[0];
  }
  
  // Check if document appears to be a proof of residence (must have address)
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
