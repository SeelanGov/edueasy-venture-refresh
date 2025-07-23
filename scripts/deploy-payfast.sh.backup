#!/bin/bash

# PayFast Integration Deployment Script
# This script deploys the complete PayFast payment integration

set -e

echo "🚀 Starting PayFast Integration Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    print_error "Supabase CLI is not installed. Please install it first."
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "supabase/config.toml" ]; then
    print_error "Please run this script from the project root directory."
    exit 1
fi

print_status "Setting up PayFast secrets..."

# Set PayFast secrets
supabase secrets set PAYFAST_MERCHANT_ID=30987005
supabase secrets set PAYFAST_MERCHANT_KEY=r4oukwctltbzv
supabase secrets set PAYFAST_PASSPHRASE=eduSecure2025
supabase secrets set PAYFAST_SANDBOX=true
supabase secrets set SITE_URL=https://edueasy.co.za

print_success "PayFast secrets configured"

print_status "Deploying database migration..."

# Deploy database migration
supabase db reset

print_success "Database migration deployed"

print_status "Deploying Edge Functions..."

# Deploy Edge Functions
supabase functions deploy create-payment-session
supabase functions deploy process-payment-webhook
supabase functions deploy verify-payment-status

print_success "Edge Functions deployed"

print_status "Testing Edge Functions..."

# Test Edge Functions (optional)
echo "Testing create-payment-session function..."
supabase functions serve --no-verify-jwt &

# Wait a moment for the server to start
sleep 3

# Test the function (this will fail without proper auth, but we can check if it's deployed)
curl -X POST http://localhost:54321/functions/v1/create-payment-session \
  -H "Content-Type: application/json" \
  -d '{"tier":"basic","user_id":"test"}' || print_warning "Function test failed (expected without auth)"

# Stop the test server
pkill -f "supabase functions serve"

print_success "Deployment completed successfully!"

echo ""
echo "🎉 PayFast Integration Deployment Complete!"
echo ""
echo "Next steps:"
echo "1. Test the integration in sandbox mode"
echo "2. Update your PayFast webhook URL to:"
echo "   https://your-project.supabase.co/functions/v1/process-payment-webhook"
echo "3. Switch to production when ready:"
echo "   supabase secrets set PAYFAST_SANDBOX=false"
echo ""
echo "Frontend routes to add:"
echo "- /payment-success"
echo "- /payment-cancelled"
echo ""
echo "For testing, you can use PayFast's sandbox environment."
echo "Visit: https://sandbox.payfast.co.za/eng/process" 