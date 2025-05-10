
import { ErrorCategory, VerificationError } from './errorHandler.ts';

export interface VerificationResult {
  status: 'approved' | 'rejected' | 'request_resubmission' | 'pending';
  confidence: number;
  validationResults: Record<string, any>;
  failureReason: string | null;
  extractedText?: string;
  extractedFields?: Record<string, string>;
  processingTimeMs?: number;
}

interface OCRSpaceResponse {
  ParsedResults: Array<{
    ParsedText: string;
    ErrorMessage?: string;
    ErrorDetails?: string;
  }>;
  OCRExitCode: number;
  IsErroredOnProcessing: boolean;
  ProcessingTimeInMilliseconds: string;
  ErrorMessage?: string;
  ErrorDetails?: string;
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
  let extractedFields = {};
  let processingTimeMs = 0;
  
  try {
    // Get API key from environment variable
    const apiKey = Deno.env.get('OCRSPACE_API_KEY');
    
    if (!apiKey) {
      throw new Error('OCR.space API key not configured');
    }
    
    // Remove data URI prefix if present and get only base64 content
    const base64Image = imageData.includes('base64,') 
      ? imageData.split('base64,')[1] 
      : imageData;
    
    // Prepare the form data for OCR.space API
    const formData = new FormData();
    formData.append('apikey', apiKey);
    formData.append('base64Image', base64Image);
    formData.append('language', 'eng');
    formData.append('isCreateSearchablePdf', 'false');
    formData.append('isOverlayRequired', 'false');
    formData.append('scale', 'true');
    formData.append('detectOrientation', 'true');
    
    console.log('Sending image to OCR.space API...', {
      timestamp: new Date().toISOString()
    });
    
    // Make API request to OCR.space
    const ocrResponse = await fetch('https://api.ocr.space/parse/image', {
      method: 'POST',
      body: formData,
    });
    
    if (!ocrResponse.ok) {
      throw new Error(`OCR API error: ${ocrResponse.status} ${ocrResponse.statusText}`);
    }
    
    const ocrResult: OCRSpaceResponse = await ocrResponse.json();
    
    console.log('OCR API response received', {
      exitCode: ocrResult.OCRExitCode,
      hasError: ocrResult.IsErroredOnProcessing,
      timestamp: new Date().toISOString()
    });
    
    // Check for OCR processing errors
    if (ocrResult.IsErroredOnProcessing || ocrResult.OCRExitCode !== 1) {
      const errorMessage = ocrResult.ErrorMessage || 'Unknown OCR processing error';
      throw new Error(`OCR processing failed: ${errorMessage}`);
    }
    
    // Extract the text from OCR results
    if (ocrResult.ParsedResults && ocrResult.ParsedResults.length > 0) {
      extractedText = ocrResult.ParsedResults[0].ParsedText;
      processingTimeMs = parseInt(ocrResult.ProcessingTimeInMilliseconds);
      
      console.log('Text extracted successfully', {
        textLength: extractedText.length,
        processingTimeMs,
        timestamp: new Date().toISOString()
      });
      
      // Extract fields based on document type
      extractedFields = extractDocumentFields(extractedText, documentType);
      
      // Validate the document based on extracted text and fields
      if (documentType === 'idDocument') {
        validationResults = validateIdDocument(extractedText, extractedFields);
        verificationStatus = validationResults.isValid ? 'approved' : 'rejected';
        failureReason = validationResults.isValid ? null : validationResults.failureReason;
        confidenceScore = calculateConfidenceScore(validationResults);
      } 
      else if (documentType === 'proofOfResidence') {
        validationResults = validateProofOfResidence(extractedText, extractedFields);
        verificationStatus = validationResults.isValid ? 'approved' : 'rejected';
        failureReason = validationResults.isValid ? null : validationResults.failureReason;
        confidenceScore = calculateConfidenceScore(validationResults);
      }
      else if (documentType === 'grade11Results' || documentType === 'grade12Results') {
        validationResults = validateGradeResults(extractedText, documentType);
        verificationStatus = validationResults.isValid ? 'approved' : 'rejected';
        failureReason = validationResults.isValid ? null : validationResults.failureReason;
        confidenceScore = calculateConfidenceScore(validationResults);
      } 
      else {
        // For other document types
        verificationStatus = 'request_resubmission';
        failureReason = 'Unable to verify this document type';
        confidenceScore = 0.5;
      }
    } else {
      // No parsed results
      verificationStatus = 'request_resubmission';
      failureReason = 'No text could be extracted from the document';
      confidenceScore = 0;
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
    failureReason = `Error processing document: ${error.message}`;
    confidenceScore = 0;
    validationResults = { error: 'Processing failed' };
  }
  
  return {
    status: verificationStatus as 'approved' | 'rejected' | 'request_resubmission' | 'pending',
    confidence: confidenceScore,
    validationResults,
    failureReason,
    extractedText,
    extractedFields,
    processingTimeMs
  };
}

/**
 * Extract relevant fields from document text based on document type
 */
function extractDocumentFields(text: string, documentType: string): Record<string, string> {
  const fields: Record<string, string> = {};
  const textUppercase = text.toUpperCase();
  
  if (documentType === 'idDocument') {
    // Extract ID number
    const idNumberMatch = textUppercase.match(/ID(?:\s+NUMBER)?[:\s]+([0-9]{13})/i);
    if (idNumberMatch) {
      fields.idNumber = idNumberMatch[1];
    }
    
    // Extract name
    const nameMatch = textUppercase.match(/(?:NAME[S]?|GIVEN\s+NAME[S]?)(?:\s*[:]\s*)([A-Z\s]+?)(?:\s+SURNAME|\s+ID|\s+IDENTITY|\s+SEX|\s+GENDER|\s+DOB|$)/);
    if (nameMatch) {
      fields.name = nameMatch[1].trim();
    }
    
    // Extract surname
    const surnameMatch = textUppercase.match(/SURNAME(?:\s*[:]\s*)([A-Z\s]+?)(?:\s+NAME|\s+ID|\s+IDENTITY|\s+SEX|\s+GENDER|\s+DOB|$)/);
    if (surnameMatch) {
      fields.surname = surnameMatch[1].trim();
    }
    
    // Extract date of birth
    const dobMatch = textUppercase.match(/(?:BIRTH|DOB|DATE\s+OF\s+BIRTH)[:\s]+([0-9]{1,2}[-\s\.\/][0-9]{1,2}[-\s\.\/][0-9]{2,4}|[0-9]{1,2}\s+[A-Z]{3,9}\s+[0-9]{2,4})/i);
    if (dobMatch) {
      fields.dateOfBirth = dobMatch[1];
    }
    
    // Extract gender/sex
    const genderMatch = textUppercase.match(/(?:SEX|GENDER)[:\s]+([MF]|MALE|FEMALE)/i);
    if (genderMatch) {
      fields.gender = genderMatch[1];
    }
    
    // Extract nationality
    const nationalityMatch = textUppercase.match(/(?:NATIONALITY|CITIZEN)[:\s]+([A-Z\s]+?)(?:\s+|$)/i);
    if (nationalityMatch) {
      fields.nationality = nationalityMatch[1].trim();
    }
  } 
  else if (documentType === 'proofOfResidence') {
    // Extract address
    const addressLines = [];
    const lines = textUppercase.split('\n');
    
    // Look for address marker
    let addressStartIndex = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('ADDRESS') || lines[i].includes('RESIDENTIAL') || lines[i].includes('BILLING ADDRESS')) {
        addressStartIndex = i;
        break;
      }
    }
    
    // Extract address lines
    if (addressStartIndex >= 0) {
      // Collect up to 5 lines after the address marker or until another section starts
      for (let i = addressStartIndex + 1; i < Math.min(addressStartIndex + 6, lines.length); i++) {
        if (lines[i].trim() && 
            !lines[i].includes('PHONE') && 
            !lines[i].includes('EMAIL') && 
            !lines[i].includes('ACCOUNT')) {
          addressLines.push(lines[i].trim());
        } else {
          break;
        }
      }
    } else {
      // If no address marker, look for postal code pattern to identify address lines
      const postalCodeLines = lines.filter(line => /\b\d{4,5}\b/.test(line));
      if (postalCodeLines.length > 0) {
        const postalCodeIndex = lines.indexOf(postalCodeLines[0]);
        // Get a few lines before the postal code line
        for (let i = Math.max(0, postalCodeIndex - 3); i <= postalCodeIndex; i++) {
          if (lines[i].trim()) {
            addressLines.push(lines[i].trim());
          }
        }
      }
    }
    
    if (addressLines.length > 0) {
      fields.address = addressLines.join(', ');
    }
    
    // Extract name
    const nameMatch = textUppercase.match(/(?:NAME|CUSTOMER|CLIENT|ACCOUNT\s+HOLDER)[:\s]+([A-Z\s\.]+?)(?:\s+|$)/i);
    if (nameMatch) {
      fields.name = nameMatch[1].trim();
    }
    
    // Extract date or billing period
    const dateMatch = textUppercase.match(/(?:DATE|STATEMENT\s+DATE|BILL\s+DATE|ISSUED)[:\s]+(.*?)(?:\s+|$)/i);
    if (dateMatch) {
      fields.date = dateMatch[1].trim();
    }

    // Extract account number
    const accountMatch = textUppercase.match(/(?:ACCOUNT|ACC\s+NO|ACCOUNT\s+NUMBER)[:\s]+([A-Z0-9\s\-]+?)(?:\s+|$)/i);
    if (accountMatch) {
      fields.accountNumber = accountMatch[1].trim();
    }
    
    // Try to identify organization (utility provider)
    const firstLines = lines.slice(0, 5).join(' ');
    const orgMatches = [
      'ESKOM', 'CITY POWER', 'JOBURG WATER', 'JOHANNESBURG WATER', 'CITY OF CAPE TOWN',
      'CITY OF TSHWANE', 'EKURHULENI', 'BUFFALO CITY', 'NELSON MANDELA BAY', 'ETHEKWINI',
      'MUNICIPALITY', 'TELKOM', 'VODACOM', 'MTN', 'CELL C', 'NEDBANK', 'ABSA', 'FNB',
      'STANDARD BANK', 'CAPITEC', 'DISCOVERY', 'MOMENTUM', 'LIBERTY', 'OLD MUTUAL'
    ];
    
    for (const org of orgMatches) {
      if (firstLines.includes(org)) {
        fields.organization = org;
        break;
      }
    }
  }
  else if (documentType === 'grade11Results' || documentType === 'grade12Results') {
    // Extract school name
    const schoolMatch = textUppercase.match(/(?:SCHOOL|CENTRE)[:\s]+([A-Z\s\.]+?)(?:\s+|$)/i);
    if (schoolMatch) {
      fields.schoolName = schoolMatch[1].trim();
    }
    
    // Extract candidate name
    const nameMatch = textUppercase.match(/(?:CANDIDATE|LEARNER|STUDENT|NAME)[:\s]+([A-Z\s\.]+?)(?:\s+|$)/i);
    if (nameMatch) {
      fields.candidateName = nameMatch[1].trim();
    }
    
    // Extract examination date/year
    const examDateMatch = textUppercase.match(/(?:EXAMINATION|EXAM|YEAR)[:\s]+([A-Z0-9\s\.]+?)(?:\s+|$)/i);
    if (examDateMatch) {
      fields.examinationDate = examDateMatch[1].trim();
    }
    
    // Look for subject results
    const subjects: {name: string, mark: string}[] = [];
    const lines = textUppercase.split('\n');
    
    // Pattern to identify subject lines: Subject name followed by percentage or mark
    const subjectPattern = /([A-Z\s]+?)(?:\s+|\:)(\d{1,3})\s*(?:%|PERCENT|MARKS?)?/;
    
    for (const line of lines) {
      const match = line.match(subjectPattern);
      if (match && !line.includes('TOTAL') && !line.includes('AVERAGE')) {
        subjects.push({
          name: match[1].trim(),
          mark: match[2]
        });
      }
    }
    
    if (subjects.length > 0) {
      fields.subjects = JSON.stringify(subjects);
    }
  }
  
  return fields;
}

/**
 * Calculate confidence score based on validation results
 */
function calculateConfidenceScore(validationResults: Record<string, any>): number {
  // Count the number of positive validations
  let positiveCount = 0;
  let totalCount = 0;
  
  for (const [key, value] of Object.entries(validationResults)) {
    if (key !== 'isValid' && key !== 'failureReason' && key !== 'documentType') {
      totalCount++;
      if (value === true) {
        positiveCount++;
      }
    }
  }
  
  // Calculate confidence score
  const baseScore = totalCount > 0 ? positiveCount / totalCount : 0.5;
  
  // Apply weighting - if all critical fields are valid, boost confidence
  if (validationResults.isValid) {
    return Math.min(0.95, baseScore + 0.15); // Cap at 0.95
  }
  
  return baseScore;
}

/**
 * Validate ID document based on extracted text and fields
 */
function validateIdDocument(extractedText: string, extractedFields: Record<string, string>): any {
  const idNumber = extractedFields.idNumber;
  const name = extractedFields.name;
  const surname = extractedFields.surname;
  
  // Basic validation results
  const validationResult: Record<string, any> = {
    idNumberPresent: Boolean(idNumber),
    idNumberValid: false,
    namePresent: Boolean(name),
    surnamePresent: Boolean(surname),
    documentType: 'South African ID'
  };
  
  // Check ID number format and validity
  if (idNumber && idNumber.length === 13 && /^\d{13}$/.test(idNumber)) {
    validationResult.idNumberValid = true;
  }
  
  // Check for critical elements on the ID document
  const hasIDText = extractedText.toUpperCase().includes('IDENTITY') || 
                    extractedText.toUpperCase().includes('ID') ||
                    extractedText.toUpperCase().includes('IDENTIFICATION');
                    
  const hasSAReference = extractedText.toUpperCase().includes('SOUTH AFRICA') || 
                        extractedText.toUpperCase().includes('RSA') || 
                        extractedText.toUpperCase().includes('REPUBLIC');
  
  validationResult.hasIDText = hasIDText;
  validationResult.hasSAReference = hasSAReference;
  validationResult.isComplete = validationResult.idNumberPresent && 
                               validationResult.namePresent && 
                               validationResult.surnamePresent;
  
  // Determine if valid overall
  validationResult.isValid = validationResult.idNumberValid && 
                            validationResult.namePresent && 
                            validationResult.surnamePresent &&
                            hasIDText;
  
  // Set failure reason if invalid
  if (!validationResult.isValid) {
    if (!validationResult.idNumberPresent || !validationResult.idNumberValid) {
      validationResult.failureReason = 'Invalid or missing ID number';
    } else if (!validationResult.namePresent) {
      validationResult.failureReason = 'Name not detected on document';
    } else if (!validationResult.surnamePresent) {
      validationResult.failureReason = 'Surname not detected on document';
    } else if (!hasIDText) {
      validationResult.failureReason = 'Document does not appear to be an identity document';
    } else {
      validationResult.failureReason = 'Document verification failed';
    }
  }
  
  return validationResult;
}

/**
 * Validate proof of residence based on extracted text and fields
 */
function validateProofOfResidence(extractedText: string, extractedFields: Record<string, string>): any {
  const address = extractedFields.address;
  const name = extractedFields.name;
  const date = extractedFields.date;
  
  // Look for date indications in the text to determine recency
  const currentYear = new Date().getFullYear();
  const lastYear = currentYear - 1;
  
  // Check if document is recent (contains current or last year)
  const hasCurrentYear = extractedText.includes(currentYear.toString());
  const hasLastYear = extractedText.includes(lastYear.toString());
  const isRecentDocument = hasCurrentYear || hasLastYear;
  
  const hasAddress = Boolean(address);
  const hasName = Boolean(name);
  
  // Check for utility bill indicators
  const isUtilityBill = extractedText.toUpperCase().includes('BILL') || 
                        extractedText.toUpperCase().includes('ACCOUNT') ||
                        extractedText.toUpperCase().includes('STATEMENT') ||
                        extractedText.toUpperCase().includes('UTILITY');
  
  // Check for bank statement indicators
  const isBankStatement = extractedText.toUpperCase().includes('BANK') && 
                          extractedText.toUpperCase().includes('STATEMENT');
  
  // Validation result
  const validationResult = {
    isValid: hasAddress && (hasName || isUtilityBill || isBankStatement) && isRecentDocument,
    addressPresent: hasAddress,
    namePresent: hasName,
    recentDocument: isRecentDocument,
    hasDate: Boolean(date),
    isUtilityBill: isUtilityBill,
    isBankStatement: isBankStatement,
    documentType: isUtilityBill ? 'Utility Bill' : 
                 isBankStatement ? 'Bank Statement' : 
                 'Proof of Residence'
  };
  
  // Set failure reason if invalid
  if (!validationResult.isValid) {
    if (!validationResult.addressPresent) {
      validationResult.failureReason = 'No address detected on document';
    } else if (!validationResult.namePresent && !isUtilityBill && !isBankStatement) {
      validationResult.failureReason = 'No name detected on document';
    } else if (!validationResult.recentDocument) {
      validationResult.failureReason = 'Document appears to be outdated (must be from current or last year)';
    } else {
      validationResult.failureReason = 'Document does not appear to be a valid proof of residence';
    }
  }
  
  return validationResult;
}

/**
 * Validate grade results based on extracted text and fields
 */
function validateGradeResults(extractedText: string, documentType: string): any {
  const text = extractedText.toUpperCase();
  
  // Check for educational institution indicators
  const hasSchoolIndicator = text.includes('SCHOOL') || 
                            text.includes('COLLEGE') || 
                            text.includes('ACADEMY') ||
                            text.includes('DEPARTMENT OF EDUCATION') ||
                            text.includes('DEPARTMENT OF BASIC EDUCATION');
  
  // Check for results/marks indicators
  const hasResultsIndicator = text.includes('RESULT') || 
                              text.includes('MARK') || 
                              text.includes('GRADE') || 
                              text.includes('SUBJECT') ||
                              text.includes('EXAMINATION');
  
  // Check for specific grade indicators
  const isGrade11 = text.includes('GRADE 11') || 
                    text.includes('GRADE11') || 
                    text.includes('GR 11') ||
                    text.includes('GR11');
  
  const isGrade12 = text.includes('GRADE 12') || 
                    text.includes('GRADE12') || 
                    text.includes('GR 12') ||
                    text.includes('GR12') ||
                    text.includes('MATRIC');
  
  // Check if it's the right document type
  const isCorrectGrade = documentType === 'grade11Results' ? isGrade11 : 
                        documentType === 'grade12Results' ? isGrade12 : 
                        false;
  
  // Check for subject results (look for patterns like "Mathematics: 78%")
  const subjectMatches = text.match(/([A-Z\s]+):\s*(\d{1,3})%?/g);
  const hasSubjects = Boolean(subjectMatches && subjectMatches.length > 0);
  
  // Validation result
  const validationResult = {
    isValid: hasSchoolIndicator && hasResultsIndicator && isCorrectGrade,
    hasSchoolIndicator: hasSchoolIndicator,
    hasResultsIndicator: hasResultsIndicator,
    isCorrectGradeLevel: isCorrectGrade,
    hasSubjects: hasSubjects,
    documentType: documentType === 'grade11Results' ? 'Grade 11 Results' : 'Grade 12 Results'
  };
  
  // Set failure reason if invalid
  if (!validationResult.isValid) {
    if (!validationResult.hasSchoolIndicator) {
      validationResult.failureReason = 'Document does not appear to be from an educational institution';
    } else if (!validationResult.hasResultsIndicator) {
      validationResult.failureReason = 'Document does not appear to contain academic results';
    } else if (!validationResult.isCorrectGradeLevel) {
      validationResult.failureReason = documentType === 'grade11Results' 
        ? 'Document does not appear to be Grade 11 results' 
        : 'Document does not appear to be Grade 12 results';
    } else {
      validationResult.failureReason = 'Document verification failed';
    }
  }
  
  return validationResult;
}
