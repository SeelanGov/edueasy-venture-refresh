const https = require('https');

async function verifyPaymentRecovery() {
  const supabaseUrl = 'https://pensvamtfjtpsaoeflbx.supabase.co';
  const supabaseKey =
    process.env.VITE_SUPABASE_ANON_KEY ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlbnN2YW10Zmp0cHNhb2VmbGJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4MzcyOTcsImV4cCI6MjA1OTQxMzI5N30.ZGFT9bcxwFuDVRF7ZYtLTQDPP3LKmt5Yo8BsJAFQyPM';

  console.log('🧪 Testing payment recovery function...');
  console.log(`📍 Function URL: ${supabaseUrl}/functions/v1/payment-recovery`);

  try {
    // Use native Node.js https module for better compatibility
    const postData = JSON.stringify({
      action: 'list_orphaned',
    });

    const options = {
      hostname: 'pensvamtfjtpsaoeflbx.supabase.co',
      port: 443,
      path: '/functions/v1/payment-recovery',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${supabaseKey}`,
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const req = https.request(options, (res) => {
      console.log(`📊 Status Code: ${res.statusCode}`);
      console.log(`📋 Headers:`, res.headers);

      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (res.statusCode === 200) {
            console.log('✅ Function is working correctly!');
            console.log('📄 Response:', JSON.stringify(response, null, 2));
          } else {
            console.log('⚠️ Function responded with non-200 status');
            console.log('📄 Response:', JSON.stringify(response, null, 2));
          }
        } catch (parseError) {
          console.log('📄 Raw response:', data);
          if (res.statusCode === 200) {
            console.log('✅ Function is accessible (response may not be JSON)');
          } else {
            console.log('❌ Function test failed with status:', res.statusCode);
          }
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ Request failed:', error.message);
      console.log('\n🔧 Troubleshooting steps:');
      console.log('1. Verify function is deployed in Supabase dashboard');
      console.log('2. Check function logs for errors');
      console.log('3. Ensure RLS policies allow access');
      console.log('4. Verify JWT verification settings');
    });

    req.write(postData);
    req.end();
  } catch (error) {
    console.error('❌ Test setup failed:', error.message);
  }
}

// Run verification
console.log('🔍 Starting Payment Recovery Function Verification...');
verifyPaymentRecovery();
