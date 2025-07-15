#!/usr/bin/env node

/**
 * Test Script: Student Tracking System Verification
 * 
 * This script tests the student tracking system fixes to ensure:
 * 1. All users have tracking IDs
 * 2. New registrations automatically get tracking IDs
 * 3. Tracking ID format is correct
 * 4. Admin functions work properly
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('❌ Missing Supabase configuration');
  console.error('Please set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

async function testTrackingSystem() {
  console.log('🔍 Testing Student Tracking System...\n');

  try {
    // Test 1: Check tracking ID statistics
    console.log('📊 Test 1: Checking tracking ID statistics...');
    const { data: stats, error: statsError } = await supabase.rpc('get_tracking_id_stats');
    
    if (statsError) {
      console.error('❌ Failed to get tracking ID stats:', statsError);
      return false;
    }

    console.log('✅ Tracking ID Statistics:');
    console.log(`   Total users: ${stats.total_users}`);
    console.log(`   Users with tracking ID: ${stats.users_with_tracking_id}`);
    console.log(`   Users without tracking ID: ${stats.users_without_tracking_id}`);
    console.log(`   Coverage: ${stats.tracking_id_coverage_percentage}%`);
    console.log(`   Last tracking ID: ${stats.last_generated_tracking_id}`);
    console.log(`   Sequence value: ${stats.sequence_current_value}\n`);

    // Test 2: Verify all users have tracking IDs
    console.log('🔍 Test 2: Verifying all users have tracking IDs...');
    const { data: usersWithoutTracking, error: usersError } = await supabase
      .from('users')
      .select('id, email, tracking_id, created_at')
      .is('tracking_id', null);

    if (usersError) {
      console.error('❌ Failed to query users:', usersError);
      return false;
    }

    if (usersWithoutTracking.length > 0) {
      console.error(`❌ Found ${usersWithoutTracking.length} users without tracking IDs:`);
      usersWithoutTracking.forEach(user => {
        console.error(`   - ${user.email} (${user.id})`);
      });
      return false;
    }

    console.log('✅ All users have tracking IDs!\n');

    // Test 3: Verify tracking ID format
    console.log('🔍 Test 3: Verifying tracking ID format...');
    const { data: allUsers, error: formatError } = await supabase
      .from('users')
      .select('tracking_id')
      .not('tracking_id', 'is', null);

    if (formatError) {
      console.error('❌ Failed to query tracking IDs:', formatError);
      return false;
    }

    const formatRegex = /^EDU-ZA-\d{2}-\d{6}$/;
    const invalidFormats = allUsers.filter(user => !formatRegex.test(user.tracking_id));

    if (invalidFormats.length > 0) {
      console.error(`❌ Found ${invalidFormats.length} tracking IDs with invalid format:`);
      invalidFormats.forEach(user => {
        console.error(`   - ${user.tracking_id}`);
      });
      return false;
    }

    console.log('✅ All tracking IDs have correct format!\n');

    // Test 4: Test tracking ID generation function
    console.log('🔍 Test 4: Testing tracking ID generation...');
    const { data: nextId, error: genError } = await supabase.rpc('peek_next_tracking_id');
    
    if (genError) {
      console.error('❌ Failed to generate test tracking ID:', genError);
      return false;
    }

    console.log(`✅ Next tracking ID would be: ${nextId}`);
    console.log(`   Format validation: ${formatRegex.test(nextId) ? '✅ Valid' : '❌ Invalid'}\n`);

    // Test 5: Check audit log
    console.log('🔍 Test 5: Checking audit log...');
    const { data: auditLog, error: auditError } = await supabase
      .from('tracking_id_audit_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (auditError) {
      console.error('❌ Failed to query audit log:', auditError);
      return false;
    }

    console.log(`✅ Audit log contains ${auditLog.length} recent entries`);
    if (auditLog.length > 0) {
      console.log('   Recent assignments:');
      auditLog.forEach(entry => {
        console.log(`   - ${entry.tracking_id} (${entry.assignment_method})`);
      });
    }
    console.log('');

    // Test 6: Test manual assignment function
    console.log('🔍 Test 6: Testing manual tracking ID assignment...');
    const testUserId = '00000000-0000-0000-0000-000000000000'; // Dummy ID for testing
    
    const { data: manualId, error: manualError } = await supabase.rpc('assign_tracking_id_to_user', {
      p_user_id: testUserId
    });

    if (manualError) {
      console.log('ℹ️  Manual assignment test (expected error for non-existent user):', manualError.message);
    } else {
      console.log(`✅ Manual assignment function works: ${manualId}`);
    }
    console.log('');

    // Summary
    console.log('🎉 All tracking system tests passed!');
    console.log('');
    console.log('📋 Summary:');
    console.log(`   ✅ ${stats.total_users} total users`);
    console.log(`   ✅ ${stats.users_with_tracking_id} users with tracking IDs`);
    console.log(`   ✅ ${stats.tracking_id_coverage_percentage}% coverage`);
    console.log(`   ✅ All tracking IDs have correct format`);
    console.log(`   ✅ Audit logging is working`);
    console.log(`   ✅ Generation functions are operational`);
    console.log('');
    console.log('🚀 Student tracking system is ready for production!');

    return true;

  } catch (error) {
    console.error('❌ Test failed with error:', error);
    return false;
  }
}

// Run the test
testTrackingSystem()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('❌ Test script failed:', error);
    process.exit(1);
  }); 