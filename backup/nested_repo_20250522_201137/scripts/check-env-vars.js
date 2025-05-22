// Check required Supabase environment variables
const requiredVars = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY'
];

const missing = requiredVars.filter((v) => !process.env[v]);

if (missing.length > 0) {
  console.error(`\nERROR: Missing required environment variables: ${missing.join(', ')}`);
  process.exit(1);
} else {
  console.log('✓ All required Supabase environment variables are set.');
}
