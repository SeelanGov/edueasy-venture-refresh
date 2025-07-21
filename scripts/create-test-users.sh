#!/bin/bash

# EduEasy Test User Creation Script
# This script creates test users for all roles in the system

set -e

echo "🚀 Creating EduEasy Test Users..."
echo "=================================="

# Supabase project configuration
SUPABASE_URL="https://pensvamtfjtpsaoeflbx.supabase.co"
SUPABASE_KEY="${SUPABASE_SERVICE_ROLE_KEY}"

# Check if service role key is provided
if [ -z "$SUPABASE_KEY" ]; then
    echo "❌ Error: SUPABASE_SERVICE_ROLE_KEY environment variable is required"
    echo "Please set it with: export SUPABASE_SERVICE_ROLE_KEY='your-service-role-key'"
    echo ""
    echo "To get your service role key:"
    echo "1. Go to https://supabase.com/dashboard/project/pensvamtfjtpsaoeflbx/settings/api"
    echo "2. Copy the 'service_role' key (not the anon key)"
    exit 1
fi

# Function to create a user
create_user() {
    local email=$1
    local role=$2
    local display_name=$3
    
    echo "📧 Creating $display_name: $email"
    
    # Create user via Supabase Auth API
    response=$(curl -s -X POST "${SUPABASE_URL}/auth/v1/admin/users" \
        -H "Authorization: Bearer ${SUPABASE_KEY}" \
        -H "Content-Type: application/json" \
        -d '{
            "email": "'"$email"'",
            "password": "Test1234!",
            "email_confirm": true,
            "user_metadata": {
                "role": "'"$role"'",
                "display_name": "'"$display_name"'"
            }
        }')
    
    # Check if user was created successfully
    if echo "$response" | grep -q '"id"'; then
        echo "✅ $display_name created successfully"
        echo "   Email: $email"
        echo "   Password: Test1234!"
        echo "   Role: $role"
    else
        echo "❌ Failed to create $display_name"
        echo "   Response: $response"
    fi
    
    echo ""
}

# Create test users for all roles
echo "👥 Creating test users for all roles..."
echo ""

create_user "admin@edueasy.co" "admin" "System Administrator"
create_user "student@edueasy.co" "student" "Test Student"
create_user "sponsor@edueasy.co" "sponsor" "Test Sponsor"
create_user "institution@edueasy.co" "institution" "Test Institution"
create_user "counselor@edueasy.co" "counselor" "Test Counselor"
create_user "nsfas@edueasy.co" "nsfas" "Test NSFAS"

echo "🎉 Test user creation completed!"
echo ""
echo "📋 Login Credentials Summary:"
echo "=============================="
echo "All users use password: Test1234!"
echo ""
echo "👨‍💼 Admin: admin@edueasy.co"
echo "👨‍🎓 Student: student@edueasy.co"
echo "💰 Sponsor: sponsor@edueasy.co"
echo "🏫 Institution: institution@edueasy.co"
echo "👨‍🏫 Counselor: counselor@edueasy.co"
echo "🏛️ NSFAS: nsfas@edueasy.co"
echo ""
echo "🔗 Login URL: http://localhost:3000/login"
echo ""
echo "⚠️  Important Notes:"
echo "- These are test users only"
echo "- Change passwords in production"
echo "- Users are created with email confirmation bypassed"
echo "- Check Supabase Auth logs to verify creation" 