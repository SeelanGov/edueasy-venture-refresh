# Supabase Key Rotation Runbook

## When to Rotate
- Keys exposed in logs, commits, or public channels
- Suspected compromise or unauthorized access
- Regular security maintenance (quarterly)
- Before production launch

## Steps

### 1. Generate New Keys
1. Go to [Supabase Project Settings → API](https://supabase.com/dashboard/project/pensvamtfjtpsaoeflbx/settings/api)
2. Click "Regenerate" for both:
   - **anon (public)** key
   - **service_role** key
3. Copy the new keys immediately

### 2. Update Application Environment
- Update runtime environment loader
- For Lovable: Use project env panel to set new `VITE_SUPABASE_ANON_KEY`
- For production: Update `.env.production` or deployment configs

### 3. Invalidate Old Deployments
- Redeploy application with new keys
- Clear CDN cache if applicable
- Invalidate any preview deployments that baked old keys

### 4. Verify Rotation
Test old key is disabled:
```bash
curl -H "apikey: OLD_ANON_KEY" \
     -H "Authorization: Bearer OLD_ANON_KEY" \
     https://pensvamtfjtpsaoeflbx.supabase.co/rest/v1/users?select=id&limit=1
# Should return 401 Unauthorized
```

Test new key works:
```bash
curl -H "apikey: NEW_ANON_KEY" \
     -H "Authorization: Bearer NEW_ANON_KEY" \
     https://pensvamtfjtpsaoeflbx.supabase.co/rest/v1/users?select=id&limit=1
# Should return data or appropriate auth error
```

### 5. Update Documentation
- Update this runbook with any lessons learned
- Note rotation date in security log
- Inform team of new keys via secure channel

## Emergency Rotation
If keys are actively compromised:
1. Rotate immediately (don't wait for maintenance window)
2. Monitor auth logs for suspicious activity
3. Consider forcing all users to re-authenticate
4. Review audit logs for unauthorized access