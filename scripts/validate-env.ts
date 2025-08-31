#!/usr/bin/env node

/**
 * Environment variable validation script
 * Ensures required environment variables exist and are properly formatted
 */

interface EnvValidation {
  key: string;
  required: boolean;
  description: string;
  validator?: (value: string) => boolean;
  errorMessage?: string;
}

const ENV_VALIDATIONS: EnvValidation[] = [
  {
    key: 'VITE_SUPABASE_URL',
    required: true,
    description: 'Supabase project URL',
    validator: (value) => /^https:\/\/.+\.supabase\.co$/.test(value),
    errorMessage: 'Must be a valid Supabase URL (https://xxx.supabase.co)'
  },
  {
    key: 'VITE_SUPABASE_ANON_KEY', 
    required: true,
    description: 'Supabase anonymous key',
    validator: (value) => value.length > 100 && value.startsWith('eyJ'),
    errorMessage: 'Must be a valid Supabase JWT token'
  },
  {
    key: 'VITE_SUPABASE_PROJECT_ID',
    required: false,
    description: 'Supabase project ID'
  }
];

function validateEnvironment(): boolean {
  console.log('🔍 Validating environment variables...\n');
  
  let hasErrors = false;
  
  for (const validation of ENV_VALIDATIONS) {
    const value = process.env[validation.key];
    
    // Check if required variable exists
    if (validation.required && !value) {
      console.error(`❌ ${validation.key}: Required but not found`);
      console.error(`   ${validation.description}\n`);
      hasErrors = true;
      continue;
    }
    
    // Skip validation if optional and not provided
    if (!validation.required && !value) {
      console.log(`⚠️  ${validation.key}: Optional, not provided`);
      continue;
    }
    
    // Run custom validator if provided
    if (value && validation.validator) {
      if (!validation.validator(value)) {
        console.error(`❌ ${validation.key}: Invalid format`);
        console.error(`   ${validation.errorMessage || 'Invalid value'}\n`);
        hasErrors = true;
        continue;
      }
    }
    
    // Success
    const maskedValue = value ? `${value.substring(0, 8)}...` : 'not set';
    console.log(`✅ ${validation.key}: ${maskedValue}`);
  }
  
  if (hasErrors) {
    console.error('\n💥 Environment validation failed!');
    console.error('Please check your .env file or environment variables.\n');
    return false;
  }
  
  console.log('\n✅ All environment variables valid!\n');
  return true;
}

// Run validation
if (require.main === module) {
  const isValid = validateEnvironment();
  process.exit(isValid ? 0 : 1);
}

export { validateEnvironment };