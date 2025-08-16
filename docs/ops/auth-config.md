# Supabase Authentication Configuration

## Required Security Settings

Navigate to [Supabase Auth Settings](https://supabase.com/dashboard/project/pensvamtfjtpsaoeflbx/auth/settings)

### 1. Password Security
- **Leaked password protection**: ✅ **ENABLED** 
  - Prevents users from using passwords found in data breaches
  - Path: Auth → Settings → Password Security

### 2. OTP Configuration  
- **OTP expiry time**: **5-10 minutes**
  - Default is often 24 hours (too long for security)
  - Path: Auth → Settings → OTP Settings
  - Recommended: 10 minutes for production, 5 minutes for high-security

### 3. Redirect URLs
Ensure these URLs are configured under **Auth → URL Configuration**:
- `https://your-lovable-preview.lovable.app` (Lovable preview domain)
- `http://localhost:5173` (local development)
- `https://your-production-domain.com` (production domain)

### 4. Rate Limiting
Configure under **Auth → Settings → Rate Limiting**:
- **Email sending**: 60 per hour per IP
- **SMS sending**: 10 per hour per IP  
- **Password reset**: 10 per hour per email
- **Signup**: 30 per hour per IP

### 5. Email Settings
- **Confirm email**: Can be disabled for faster testing
- **Email change confirmation**: Keep enabled for security
- **Secure email change**: Keep enabled

## Verification Checklist
- [ ] Leaked password protection enabled
- [ ] OTP expiry set to 5-10 minutes
- [ ] All redirect URLs configured
- [ ] Rate limits configured
- [ ] Email settings reviewed

## Security Monitoring
- Monitor auth logs for suspicious patterns
- Review failed login attempts weekly
- Check for unusual signup patterns
- Monitor OTP usage and failures

## Incident Response
If auth security incident occurs:
1. Check auth logs in Supabase dashboard
2. Review user sessions for compromised accounts
3. Consider forcing password reset for affected users
4. Update security settings if needed
5. Document incident and response