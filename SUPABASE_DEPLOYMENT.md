# Supabase Deployment Guide

## 🚀 Quick Setup

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Wait for setup to complete

### 2. Run Database Schema
1. Go to SQL Editor in Supabase Dashboard
2. Copy and paste the entire content from `supabase_schema.sql`
3. Run the SQL script

### 3. Set Up Environment Variables
```bash
# Copy the example file
cp .env.example .env

# Fill in your Supabase credentials
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Deploy Edge Functions
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-id

# Deploy edge functions
supabase functions deploy validate-credit
supabase functions deploy process-transaction
supabase functions deploy monthly-settlement
```

## 📋 Edge Functions Overview

### 1. validate-credit
**Purpose**: Validate credit before purchase
**Usage**: Call before creating transactions
**Endpoint**: `/functions/v1/validate-credit`

**Request Body**:
```json
{
  "purchase_amount": 1500.00,
  "shop_id": "uuid",
  "items": [
    {
      "product_id": "uuid",
      "quantity": 2,
      "unit_price": 750.00
    }
  ]
}
```

### 2. process-transaction
**Purpose**: Create and complete transactions
**Usage**: Call after credit validation passes
**Endpoint**: `/functions/v1/process-transaction`

**Request Body**:
```json
{
  "shop_id": "uuid",
  "items": [
    {
      "product_id": "uuid",
      "product_name": "Product Name",
      "quantity": 2,
      "unit_price": 750.00
    }
  ],
  "notes": "Optional notes"
}
```

### 3. monthly-settlement
**Purpose**: Settle payments to shops
**Usage**: Admin only - call when customers pay
**Endpoint**: `/functions/v1/monthly-settlement`

**Request Body**:
```json
{
  "month": 12,
  "year": 2024,
  "customer_id": "uuid" // Optional - for specific customer
}
```

## 🔧 TypeScript Issues Resolution

The TypeScript errors in Edge Functions are expected because:
1. **Deno types**: These run on Deno runtime, not Node.js
2. **External modules**: URLs are resolved at runtime, not in IDE
3. **Edge Functions**: Deploy to Supabase, not run locally

**Solutions**:
- Ignore TypeScript errors for Edge Functions
- Use `// @ts-ignore` for specific lines if needed
- Focus on functionality, not IDE type checking

## 🗄 File Storage Setup

### Storage Buckets
Create these buckets in Supabase Storage:

1. **customers** (for job cards)
   - Path: `customers/{user_id}/jobcard.pdf`
   - Policy: Public read, authenticated write

2. **shops** (for verification docs)
   - Path: `shops/{shop_id}/verification.pdf`
   - Policy: Public read, authenticated write

3. **products** (for product images)
   - Path: `products/{product_id}/image.jpg`
   - Policy: Public read, authenticated write

### Storage Policies
```sql
-- Customers bucket policies
INSERT INTO storage.policies (name, definition, bucket_id)
VALUES 
('Customers can upload own files', 
 '((bucket_id = ''customers''::text) AND (auth.role() = ''authenticated''::text) AND (storage.foldername(name)[1] = auth.uid()::text))',
 'customers');

-- Shops bucket policies  
INSERT INTO storage.policies (name, definition, bucket_id)
VALUES 
('Shops can upload own files',
 '((bucket_id = ''shops''::text) AND (auth.role() = ''authenticated''::text) AND (storage.foldername(name)[1] = auth.uid()::text))',
 'shops');

-- Public read access
INSERT INTO storage.policies (name, definition, bucket_id)
VALUES 
('Public file access',
 'bucket_id IN (''customers'', ''shops'', ''products'')',
 'customers'),
('Public file access',
 'bucket_id IN (''customers'', ''shops'', ''products'')',
 'shops'),
('Public file access',
 'bucket_id IN (''customers'', ''shops'', ''products'')',
 'products');
```

## 🧪 Testing the Setup

### 1. Create Test Admin
```sql
-- First create user in auth.users via Supabase Auth
-- Then add to users table:
INSERT INTO public.users (id, email, role, verification_status)
VALUES ('your-admin-uuid', 'admin@test.com', 'admin', 'approved');
```

### 2. Create Test Customer
```sql
-- Create auth user first
INSERT INTO public.users (id, email, role, verification_status)
VALUES ('customer-uuid', 'customer@test.com', 'customer', 'pending');

INSERT INTO public.customers (user_id, full_name, employee_id, department, phone, address, salary, credit_limit)
VALUES ('customer-uuid', 'John Doe', 'EMP001', 'IT', '+1234567890', '123 Main St', 50000.00, 10000.00);
```

### 3. Create Test Shop
```sql
-- Create auth user first
INSERT INTO public.users (id, email, role, verification_status)
VALUES ('shop-uuid', 'shop@test.com', 'shop', 'pending');

INSERT INTO public.shops (user_id, shop_name, owner_name, license_number, phone, address)
VALUES ('shop-uuid', 'Test Shop', 'Shop Owner', 'LIC001', '+1234567890', '456 Shop St');
```

### 4. Test Products
```sql
INSERT INTO public.products (shop_id, name, price, stock_quantity, category)
VALUES ('shop-uuid', 'Test Product', 100.00, 50, 'Electronics');
```

## 🔐 Security Notes

### 1. Environment Variables
- Never commit `.env` file
- Use different keys for development/production
- Rotate keys regularly

### 2. Row Level Security
- All tables have RLS enabled
- Users can only access their own data
- Admin has full access
- Test RLS policies thoroughly

### 3. Edge Functions Security
- Use service role key for admin operations
- Validate user permissions in functions
- Log all admin actions

## 📊 Monitoring & Analytics

### 1. Database Views
Use the provided views for reporting:
- `customer_credit_summary`
- `shop_performance` 
- `monthly_overview`

### 2. Audit Logs
All critical operations are logged in `audit_logs` table.

### 3. Performance Monitoring
Monitor slow queries and optimize indexes as needed.

## 🚨 Common Issues & Solutions

### 1. "Permission denied" errors
- Check RLS policies
- Verify user role
- Ensure proper authentication

### 2. "Function not found" errors
- Deploy edge functions
- Check function names
- Verify function permissions

### 3. "Storage permission" errors
- Set up storage policies
- Check bucket permissions
- Verify file paths

### 4. Credit validation failures
- Check customer verification status
- Verify credit limits
- Ensure shop is approved

## 🔄 Next Steps

1. **Set up automated testing**
2. **Add error handling in app**
3. **Implement offline support**
4. **Add push notifications**
5. **Set up monitoring alerts**
6. **Create admin dashboard**

## 📞 Support

- Supabase Documentation: https://supabase.com/docs
- Edge Functions Guide: https://supabase.com/docs/guides/functions
- RLS Guide: https://supabase.com/docs/guides/auth/row-level-security
