import { supabase } from '@/integrations/supabase/client';

export interface ConsentData {
  privacy: boolean;
  terms: boolean;
  idVerification: boolean;
}

export interface ConsentRecord {
  user_id: string;
  consent_type: string;
  consent_text: string;
  consent_version: string;
  accepted: boolean;
  ip_address?: string;
  user_agent?: string;
}

/**
 * Record user consents in the database for POPIA compliance
 */
export async function recordUserConsents(userId: string, consents: ConsentData): Promise<void> {
  const consentRecords: ConsentRecord[] = [
    {
      user_id: userId,
      consent_type: 'privacy_policy',
      consent_text: 'I agree to the Privacy Policy and consent to the processing of my personal information for identity verification and educational services.',
      consent_version: '1.0',
      accepted: consents.privacy
    },
    {
      user_id: userId,
      consent_type: 'terms_of_service',
      consent_text: 'I agree to the Terms of Service and understand the platform\'s educational application services.',
      consent_version: '1.0',
      accepted: consents.terms
    },
    {
      user_id: userId,
      consent_type: 'ID_verification',
      consent_text: 'I consent to EduEasy collecting, verifying, and processing my South African ID number for identity confirmation, application processing, and to match me with education and funding opportunities. This will include verification with third-party providers (e.g., VerifyID). I understand this information will be processed in line with POPIA and the EduEasy Privacy Policy.',
      consent_version: '1.0',
      accepted: consents.idVerification
    }
  ];

  // Get client IP and user agent if available
  const clientIP = await getClientIP();
  const userAgent = navigator.userAgent;

  // Add IP and user agent to all consent records
  const recordsWithMetadata = consentRecords.map(record => ({
    ...record,
    ip_address: clientIP,
    user_agent: userAgent
  }));

  const { error } = await supabase
    .from('user_consents')
    .insert(recordsWithMetadata);

  if (error) {
    console.error('Failed to record consents:', error);
    throw new Error(`Failed to record consents: ${error.message}`);
  }
}

/**
 * Check if user has valid consent for a specific type
 */
export async function hasValidConsent(userId: string, consentType: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('user_consents')
    .select('accepted')
    .eq('user_id', userId)
    .eq('consent_type', consentType)
    .eq('accepted', true)
    .single();

  if (error || !data) {
    return false;
  }

  return data.accepted;
}

/**
 * Get user's consent history
 */
export async function getUserConsentHistory(userId: string): Promise<ConsentRecord[]> {
  const { data, error } = await supabase
    .from('user_consents')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch consent history:', error);
    throw new Error(`Failed to fetch consent history: ${error.message}`);
  }

  return data || [];
}

/**
 * Update user consent
 */
export async function updateUserConsent(
  userId: string, 
  consentType: string, 
  accepted: boolean,
  consentText?: string,
  consentVersion?: string
): Promise<void> {
  const updateData: Partial<ConsentRecord> = {
    accepted,
    ip_address: await getClientIP(),
    user_agent: navigator.userAgent
  };

  if (consentText) updateData.consent_text = consentText;
  if (consentVersion) updateData.consent_version = consentVersion;

  const { error } = await supabase
    .from('user_consents')
    .upsert({
      user_id: userId,
      consent_type: consentType,
      consent_text: consentText || getDefaultConsentText(consentType),
      consent_version: consentVersion || '1.0',
      accepted,
      ip_address: updateData.ip_address,
      user_agent: updateData.user_agent
    });

  if (error) {
    console.error('Failed to update consent:', error);
    throw new Error(`Failed to update consent: ${error.message}`);
  }
}

/**
 * Get default consent text for a consent type
 */
function getDefaultConsentText(consentType: string): string {
  const consentTexts: Record<string, string> = {
    'privacy_policy': 'I agree to the Privacy Policy and consent to the processing of my personal information for identity verification and educational services.',
    'terms_of_service': 'I agree to the Terms of Service and understand the platform\'s educational application services.',
    'ID_verification': 'I consent to EduEasy collecting, verifying, and processing my South African ID number for identity confirmation, application processing, and to match me with education and funding opportunities. This will include verification with third-party providers (e.g., VerifyID). I understand this information will be processed in line with POPIA and the EduEasy Privacy Policy.',
    'marketing': 'I consent to receive marketing communications about educational opportunities and platform updates.',
    'analytics': 'I consent to the collection of anonymous usage data to improve platform performance and user experience.',
    'third_party': 'I consent to data sharing with trusted third-party services for educational and verification purposes.'
  };

  return consentTexts[consentType] || 'I consent to the processing of my data for the specified purpose.';
}

/**
 * Get client IP address (simplified implementation)
 * In production, this should be passed from the server
 */
async function getClientIP(): Promise<string | undefined> {
  try {
    // This is a simplified approach - in production, the IP should be passed from the server
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.warn('Could not determine client IP:', error);
    return undefined;
  }
}

/**
 * Withdraw user consent
 */
export async function withdrawUserConsent(userId: string, consentType: string): Promise<void> {
  await updateUserConsent(userId, consentType, false);
}

/**
 * Get consent statistics for admin purposes
 */
export async function getConsentStatistics(): Promise<{
  totalUsers: number;
  privacyConsent: number;
  termsConsent: number;
  idVerificationConsent: number;
  marketingConsent: number;
}> {
  const { data, error } = await supabase
    .from('user_consents')
    .select('consent_type, accepted');

  if (error) {
    console.error('Failed to fetch consent statistics:', error);
    throw new Error(`Failed to fetch consent statistics: ${error.message}`);
  }

  const stats = {
    totalUsers: 0,
    privacyConsent: 0,
    termsConsent: 0,
    idVerificationConsent: 0,
    marketingConsent: 0
  };

  const uniqueUsers = new Set<string>();

  data?.forEach(consent => {
    uniqueUsers.add(consent.user_id);
    
    if (consent.accepted) {
      switch (consent.consent_type) {
        case 'privacy_policy':
          stats.privacyConsent++;
          break;
        case 'terms_of_service':
          stats.termsConsent++;
          break;
        case 'ID_verification':
          stats.idVerificationConsent++;
          break;
        case 'marketing':
          stats.marketingConsent++;
          break;
      }
    }
  });

  stats.totalUsers = uniqueUsers.size;

  return stats;
} 