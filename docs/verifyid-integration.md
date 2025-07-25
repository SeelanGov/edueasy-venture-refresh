# VerifyID Integration with POPIA-Compliant Consent System

## Overview

This document describes the comprehensive VerifyID integration implemented in EduEasy, featuring POPIA-compliant consent tracking, audit trails, and secure data handling.

## Architecture

### Database Schema

#### New Tables Created

1. **`user_consents`** - Stores all user consent records
   - `user_id` - Reference to users table
   - `consent_type` - Type of consent (ID_verification, privacy_policy, etc.)
   - `consent_text` - Exact text shown to user
   - `consent_version` - Version of consent text
   - `accepted` - Whether consent was given
   - `ip_address` - Client IP address
   - `user_agent` - Browser user agent
   - `created_at` - Timestamp

2. **`verifyid_audit_log`** - Audit trail for VerifyID API calls
   - `user_id` - Reference to users table
   - `api_request_id` - VerifyID request ID
   - `verification_status` - Success/failed/error
   - `error_message` - Error details if any
   - `ip_address` - Client IP address
   - `created_at` - Timestamp

3. **`verification_rate_limits`** - Rate limiting for verification attempts
   - `ip_address` - Client IP
   - `user_identifier` - Email or user ID
   - `attempt_count` - Number of attempts
   - `blocked_until` - Block expiration time

#### Updated Tables

- **`users`** - Added VerifyID-specific fields:
  - `verifyid_verified` - Boolean flag
  - `verifyid_verification_date` - Verification timestamp
  - `verifyid_response_data` - Non-sensitive verification data (JSONB)
  - `id_verification_consent_given` - Consent status
  - `id_verification_consent_date` - Consent timestamp

### Edge Functions

#### `verifyid-integration`

**Purpose**: Handles VerifyID API integration with consent validation

**Features**:
- Consent-first validation (no API call without consent)
- Rate limiting (5 attempts per hour per IP/user)
- Comprehensive audit logging
- Error handling and user-friendly messages
- Secure API key handling

**Request Format**:
```json
{
  "user_id": "uuid",
  "national_id": "13-digit-SA-ID",
  "api_key": "verifyid-api-key"
}
```

**Response Format**:
```json
{
  "verified": true,
  "message": "Identity verification successful",
  "verification_date": "2025-01-15T10:30:00Z",
  "request_id": "verifyid-request-id"
}
```

## Frontend Implementation

### Registration Flow

1. **User fills registration form** with standard fields
2. **Consent checkboxes** are presented:
   - Privacy Policy consent
   - Terms of Service consent
   - **ID Verification consent** (new, required)
3. **Form validation** ensures all consents are given
4. **Account creation** happens first
5. **Consents are recorded** in database
6. **VerifyID API call** is made with consent validation
7. **User is redirected** to appropriate next step

### Components Updated

#### `ConsentCheckboxes.tsx`
- Added ID verification consent checkbox
- Updated interface to include new consent type
- Enhanced consent text with POPIA compliance

#### `RegisterForm.tsx`
- Implemented consent-first registration flow
- Added VerifyID integration with proper error handling
- Enhanced user experience with clear error messages

### New Hooks

#### `useVerifyID.ts`
- `verifyId()` - Main verification function
- `useVerificationStatus()` - Check verification status
- `useVerificationAudit()` - Get audit logs

#### `consent-recording.ts`
- `recordUserConsents()` - Record all consents
- `hasValidConsent()` - Check consent validity
- `getUserConsentHistory()` - Get consent history
- `updateUserConsent()` - Update consent preferences
- `withdrawUserConsent()` - Withdraw consent
- `getConsentStatistics()` - Admin statistics

## Security Features

### Data Protection
- **Encrypted storage** of national IDs using `pgcrypto`
- **Non-sensitive data only** stored in verification response
- **IP address logging** for audit trails
- **Rate limiting** to prevent abuse

### Consent Management
- **Explicit consent** required before any processing
- **Versioned consent texts** for legal compliance
- **Audit trails** for all consent changes
- **Withdrawal capability** for user rights

### Access Control
- **Row Level Security (RLS)** on all tables
- **User-specific access** to own data
- **Admin access** for audit and compliance
- **API key protection** in environment variables

## Compliance Features

### POPIA Compliance
- **Explicit consent** for ID verification
- **Purpose limitation** clearly stated
- **Data minimization** - only necessary data stored
- **Right to withdraw** consent implemented
- **Audit trails** for regulatory review

### Audit Capabilities
- **Complete consent history** with timestamps
- **Verification attempt logs** with outcomes
- **IP address tracking** for security
- **User agent logging** for debugging
- **Export functionality** for compliance reports

## Environment Configuration

### Required Environment Variables

```env
# VerifyID Configuration
VITE_VERIFYID_API_KEY=your_verifyid_api_key_here
VITE_VERIFYID_ENDPOINT=https://api.verifyid.co.za/said_verification

# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
VITE_SUPABASE_PROJECT_ID=your_supabase_project_id_here

# Feature Flags
VITE_ENABLE_VERIFYID=true
VITE_ENABLE_CONSENT_TRACKING=true
VITE_ENABLE_AUDIT_LOGGING=true
```

## Deployment Checklist

### Database Migration
1. Run the migration: `supabase/migrations/20250115_verifyid_integration_consent_system.sql`
2. Verify all tables are created
3. Check RLS policies are active
4. Test database functions

### Edge Function Deployment
1. Deploy `verifyid-integration` function
2. Set environment variables in Supabase
3. Test function with sample data
4. Verify error handling

### Frontend Deployment
1. Update environment variables
2. Deploy updated components
3. Test registration flow end-to-end
4. Verify consent recording

### Testing
1. **Unit tests** for consent validation
2. **Integration tests** for VerifyID API
3. **Security tests** for consent bypass attempts
4. **Compliance tests** for audit trails

## Monitoring and Maintenance

### Regular Audits
- **Monthly consent reviews** - Check consent statistics
- **Quarterly compliance reviews** - Verify POPIA compliance
- **Annual security reviews** - Audit access and data handling

### Monitoring
- **Verification success rates** - Track API performance
- **Consent withdrawal rates** - Monitor user satisfaction
- **Error rates** - Identify and fix issues
- **Rate limiting alerts** - Monitor for abuse

### Maintenance
- **Consent text updates** - Keep current with legal requirements
- **API key rotation** - Regular security updates
- **Database optimization** - Performance monitoring
- **Backup verification** - Ensure data integrity

## Troubleshooting

### Common Issues

1. **Consent Missing Error**
   - Check if user has valid consent record
   - Verify consent type matches expected value
   - Check consent acceptance status

2. **VerifyID API Errors**
   - Verify API key is valid
   - Check network connectivity
   - Review API response for specific errors

3. **Rate Limiting**
   - Check attempt count in rate_limits table
   - Verify IP address and user identifier
   - Wait for block to expire

4. **Database Errors**
   - Check RLS policies
   - Verify user permissions
   - Review database logs

### Debug Tools

- **Admin Panel** - View consent and verification data
- **Audit Logs** - Track all verification attempts
- **Database Queries** - Direct access for troubleshooting
- **Environment Checks** - Verify configuration

## Future Enhancements

### Planned Features
- **Consent preference center** - User self-service
- **Advanced analytics** - Consent trend analysis
- **Automated compliance reports** - Regulatory reporting
- **Multi-language consent** - International support

### Integration Opportunities
- **Additional verification providers** - Backup options
- **Enhanced security** - Two-factor authentication
- **Mobile app support** - Native consent handling
- **API rate limiting** - Advanced protection

## Support and Documentation

### Resources
- **VerifyID API Documentation** - External provider docs
- **POPIA Guidelines** - Legal compliance reference
- **Supabase Documentation** - Database and edge functions
- **React Hook Form** - Form handling library

### Contact
- **Technical Support** - Development team
- **Legal Compliance** - Legal team for consent questions
- **Security Issues** - Security team for vulnerabilities
- **User Support** - Customer service for user issues 