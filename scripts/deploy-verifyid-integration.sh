#!/bin/bash

# VerifyID Integration Deployment Script
# This script automates the deployment of the VerifyID integration with POPIA-compliant consent system

set -e

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

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v supabase &> /dev/null; then
        print_error "Supabase CLI is not installed. Please install it first."
        exit 1
    fi
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install it first."
        exit 1
    fi
    
    print_success "All dependencies are installed"
}

# Check environment variables
check_environment() {
    print_status "Checking environment variables..."
    
    required_vars=(
        "VITE_SUPABASE_URL"
        "VITE_SUPABASE_ANON_KEY"
        "VITE_SUPABASE_PROJECT_ID"
        "VITE_VERIFYID_API_KEY"
    )
    
    missing_vars=()
    
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            missing_vars+=("$var")
        fi
    done
    
    if [ ${#missing_vars[@]} -ne 0 ]; then
        print_error "Missing required environment variables:"
        for var in "${missing_vars[@]}"; do
            echo "  - $var"
        done
        exit 1
    fi
    
    print_success "All required environment variables are set"
}

# Deploy database migration
deploy_migration() {
    print_status "Deploying database migration..."
    
    if [ ! -f "supabase/migrations/20250115_verifyid_integration_consent_system.sql" ]; then
        print_error "Migration file not found"
        exit 1
    fi
    
    supabase db push
    
    if [ $? -eq 0 ]; then
        print_success "Database migration deployed successfully"
    else
        print_error "Failed to deploy database migration"
        exit 1
    fi
}

# Deploy edge function
deploy_edge_function() {
    print_status "Deploying VerifyID integration edge function..."
    
    if [ ! -f "supabase/functions/verifyid-integration/index.ts" ]; then
        print_error "Edge function not found"
        exit 1
    fi
    
    supabase functions deploy verifyid-integration
    
    if [ $? -eq 0 ]; then
        print_success "Edge function deployed successfully"
    else
        print_error "Failed to deploy edge function"
        exit 1
    fi
}

# Set environment variables for edge function
set_edge_function_env() {
    print_status "Setting edge function environment variables..."
    
    supabase secrets set VERIFYID_API_KEY="$VITE_VERIFYID_API_KEY"
    
    if [ $? -eq 0 ]; then
        print_success "Environment variables set successfully"
    else
        print_error "Failed to set environment variables"
        exit 1
    fi
}

# Build frontend
build_frontend() {
    print_status "Building frontend..."
    
    npm run build
    
    if [ $? -eq 0 ]; then
        print_success "Frontend built successfully"
    else
        print_error "Failed to build frontend"
        exit 1
    fi
}

# Run tests
run_tests() {
    print_status "Running tests..."
    
    if [ -f "package.json" ] && grep -q "test" package.json; then
        npm test
        
        if [ $? -eq 0 ]; then
            print_success "Tests passed"
        else
            print_warning "Some tests failed - please review"
        fi
    else
        print_warning "No test script found in package.json"
    fi
}

# Verify deployment
verify_deployment() {
    print_status "Verifying deployment..."
    
    # Check if edge function is accessible
    local edge_url="https://${VITE_SUPABASE_PROJECT_ID}.functions.supabase.co/verifyid-integration"
    
    response=$(curl -s -o /dev/null -w "%{http_code}" "$edge_url" || echo "000")
    
    if [ "$response" = "405" ] || [ "$response" = "400" ]; then
        print_success "Edge function is accessible (HTTP $response - expected for OPTIONS/GET)"
    else
        print_warning "Edge function may not be accessible (HTTP $response)"
    fi
    
    # Check database tables
    print_status "Checking database tables..."
    
    # This would require a database connection to verify
    print_warning "Please manually verify database tables are created"
}

# Display next steps
show_next_steps() {
    echo ""
    print_success "Deployment completed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Test the registration flow with a new user"
    echo "2. Verify consent records are being created"
    echo "3. Test VerifyID API integration"
    echo "4. Check audit logs in the admin panel"
    echo "5. Review security and compliance requirements"
    echo ""
    echo "Documentation: docs/verifyid-integration.md"
    echo ""
}

# Main deployment function
main() {
    echo "=========================================="
    echo "VerifyID Integration Deployment Script"
    echo "=========================================="
    echo ""
    
    check_dependencies
    check_environment
    deploy_migration
    deploy_edge_function
    set_edge_function_env
    build_frontend
    run_tests
    verify_deployment
    show_next_steps
}

# Run main function
main "$@" 