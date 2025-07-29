const logger = require('../src/utils/logger');
const fs = require('fs');

// Script to verify environment variables are loaded correctly
logger.info('Verifying environment variables...');

// Check if the required Supabase environment variables are set
const requiredVars = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'];

// Log the environment variables (without showing the full values for security)
requiredVars.forEach((varName) => {
  const value = process.env[varName];
  if (value) {
    // Only show the first few characters of the value for security
    const maskedValue = value.substring(0, 8) + '...' + value.substring(value.length - 4);
    logger.success(`✓ ${varName} is set: ${maskedValue}`);
  } else {
    logger.error(`✗ ${varName} is NOT set`);
  }
});

// Check if .env file exists
if (fs.existsSync('.env')) {
  logger.success('✓ .env file exists');

  // Read the .env file to check if it contains the required variables
  const envContent = fs.readFileSync('.env', 'utf8');
  requiredVars.forEach((varName) => {
    if (envContent.includes(varName)) {
      logger.success(`✓ ${varName} is defined in .env file`);
    } else {
      logger.error(`✗ ${varName} is NOT defined in .env file`);
    }
  });
} else {
  logger.error('✗ .env file does NOT exist');
}

// Check if Vite is properly loading the environment variables
logger.info('\nNote: This script only checks if the variables are set in the Node.js environment.');
logger.info('For Vite applications, these variables need to be prefixed with VITE_ and will be');
logger.info('available at runtime through import.meta.env.VITE_VARIABLE_NAME');
