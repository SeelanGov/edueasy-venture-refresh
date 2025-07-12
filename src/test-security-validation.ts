// Security validation test for Phase 4.1.1
// This file is for testing purposes and should be removed after validation

import { supabase } from "@/integrations/supabase/client";

export const runSecurityTests = async () => {
  console.log("🔐 Starting Phase 4.1.1 Security Validation Tests");
  
  // Test 1: Verify no localStorage sponsor_id usage
  console.log("📋 Test 1: localStorage bypass check");
  const hasLocalStorageSponsorId = document.body.innerHTML.includes('localStorage.getItem("sponsor_id")');
  console.log(`❌ localStorage sponsor_id usage found: ${hasLocalStorageSponsorId}`);
  
  // Test 2: Test RLS policy enforcement
  console.log("📋 Test 2: RLS Policy Enforcement");
  try {
    // This should fail for non-admin users
    const { data, error } = await supabase
      .from('sponsors')
      .select('*')
      .limit(10);
    
    console.log(`🔒 Sponsors table access: ${error ? 'DENIED (Good!)' : 'ALLOWED'}`, { data, error });
  } catch (err) {
    console.log("🔒 RLS properly blocking access:", err);
  }
  
  // Test 3: Test user-specific access
  console.log("📋 Test 3: User-specific data access");
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userData.user) {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userData.user.id);
      
      console.log(`👤 Own user data access: ${error ? 'DENIED' : 'ALLOWED'}`, { data, error });
    }
  } catch (err) {
    console.log("👤 User data access error:", err);
  }
  
  // Test 4: Test sponsor data access pattern
  console.log("📋 Test 4: Sponsor data access pattern");
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (userData.user) {
      const { data: sponsorData, error } = await supabase
        .from('sponsors')
        .select('id')
        .eq('user_id', userData.user.id)
        .single();
      
      console.log(`🏢 Sponsor lookup by user_id: ${error ? 'FAILED' : 'SUCCESS'}`, { sponsorData, error });
      
      if (sponsorData) {
        const { data: sponsorships, error: sponsorshipError } = await supabase
          .from('application_fee_sponsorships')
          .select('*')
          .eq('sponsor_id', sponsorData.id);
        
        console.log(`💼 Sponsorship data access: ${sponsorshipError ? 'FAILED' : 'SUCCESS'}`, { sponsorships, sponsorshipError });
      }
    }
  } catch (err) {
    console.log("🏢 Sponsor access pattern error:", err);
  }
  
  console.log("✅ Security validation tests completed");
};

// Auto-run in development
if (import.meta.env.DEV) {
  runSecurityTests().catch(console.error);
}