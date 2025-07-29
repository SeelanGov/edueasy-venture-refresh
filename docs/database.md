# Database Schema Documentation

## Overview

This document describes the current Supabase database schema, including tables, relationships,
indexes, and RLS (Row-Level Security) policies.

## Tables & Relationships

- **Users**: Stores user profile and authentication data.
- **Applications**: Tracks user applications and statuses.
- **Documents**: Stores uploaded documents and metadata.
- **System Error Logs**: Captures audit/error logs for admin review.
- **Other Tables**: (List any additional tables as needed)

## Indexes

- Indexes are created on user IDs, application IDs, and timestamps for performance.

## RLS Policies

- RLS is enabled on all sensitive tables.
- Each policy is documented in `docs/security.md` with logic, protected columns, and intended user
  roles.

## ER Diagram

- (Attach or link to an ER diagram generated from Supabase Studio or dbdiagram.io)

---

# RLS Policy Reference

See `docs/security.md` for detailed policy explanations.
