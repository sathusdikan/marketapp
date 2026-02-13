-- ========================================
-- CREDIT-BASED MARKETPLACE APP - SUPABASE SCHEMA
-- ========================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- ENUMS
-- ========================================

-- User roles
CREATE TYPE user_role AS ENUM ('admin', 'shop', 'customer');

-- Verification statuses
CREATE TYPE verification_status AS ENUM ('pending', 'approved', 'rejected');

-- Transaction statuses
CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed', 'refunded');

-- Payment statuses
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'overdue', 'partial');

-- Settlement statuses
CREATE TYPE settlement_status AS ENUM ('pending', 'processing', 'completed', 'failed');

-- ========================================
-- CORE TABLES
-- ========================================

-- Users table (extends auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    role user_role NOT NULL,
    verification_status verification_status DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Customers table
CREATE TABLE public.customers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    employee_id TEXT UNIQUE NOT NULL,
    department TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    salary DECIMAL(12,2) NOT NULL,
    credit_limit DECIMAL(12,2) NOT NULL DEFAULT 0,
    credit_used DECIMAL(12,2) NOT NULL DEFAULT 0,
    credit_available DECIMAL(12,2) GENERATED ALWAYS AS (credit_limit - credit_used) STORED,
    job_card_url TEXT,
    verification_remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    CONSTRAINT positive_credit_limit CHECK (credit_limit >= 0),
    CONSTRAINT positive_credit_used CHECK (credit_used >= 0),
    CONSTRAINT valid_credit_available CHECK (credit_available >= 0)
);

-- Shops table
CREATE TABLE public.shops (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    shop_name TEXT NOT NULL,
    owner_name TEXT NOT NULL,
    license_number TEXT UNIQUE NOT NULL,
    gst_number TEXT,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    pending_balance DECIMAL(12,2) NOT NULL DEFAULT 0,
    verification_document_url TEXT,
    verification_remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    CONSTRAINT non_negative_balance CHECK (pending_balance >= 0)
);

-- Products table
CREATE TABLE public.products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    shop_id UUID REFERENCES public.shops(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    category TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    CONSTRAINT positive_price CHECK (price > 0),
    CONSTRAINT non_negative_stock CHECK (stock_quantity >= 0)
);

-- Transactions table
CREATE TABLE public.transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    transaction_number TEXT UNIQUE NOT NULL,
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE NOT NULL,
    shop_id UUID REFERENCES public.shops(id) ON DELETE CASCADE NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    status transaction_status DEFAULT 'pending',
    month INTEGER NOT NULL, -- 1-12
    year INTEGER NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    CONSTRAINT positive_amount CHECK (total_amount > 0),
    CONSTRAINT valid_month CHECK (month BETWEEN 1 AND 12),
    CONSTRAINT valid_year CHECK (year >= EXTRACT(YEAR FROM NOW()))
);

-- Transaction items table
CREATE TABLE public.transaction_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    transaction_id UUID REFERENCES public.transactions(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE RESTRICT NOT NULL,
    product_name TEXT NOT NULL, -- Denormalized for historical accuracy
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    CONSTRAINT positive_quantity CHECK (quantity > 0),
    CONSTRAINT positive_unit_price CHECK (unit_price > 0),
    CONSTRAINT positive_total_price CHECK (total_price > 0),
    CONSTRAINT price_matches_quantity CHECK (total_price = quantity * unit_price)
);

-- Monthly statements table
CREATE TABLE public.monthly_statements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE NOT NULL,
    month INTEGER NOT NULL,
    year INTEGER NOT NULL,
    total_transactions DECIMAL(12,2) NOT NULL DEFAULT 0,
    total_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    amount_paid DECIMAL(12,2) NOT NULL DEFAULT 0,
    balance_due DECIMAL(12,2) GENERATED ALWAYS AS (total_amount - amount_paid) STORED,
    status payment_status DEFAULT 'pending',
    due_date DATE NOT NULL,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    CONSTRAINT non_negative_amounts CHECK (total_transactions >= 0 AND total_amount >= 0 AND amount_paid >= 0),
    CONSTRAINT valid_balance CHECK (balance_due >= 0),
    CONSTRAINT valid_month CHECK (month BETWEEN 1 AND 12),
    CONSTRAINT unique_customer_month_year UNIQUE(customer_id, month, year)
);

-- Shop settlements table
CREATE TABLE public.shop_settlements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    shop_id UUID REFERENCES public.shops(id) ON DELETE CASCADE NOT NULL,
    month INTEGER NOT NULL,
    year INTEGER NOT NULL,
    total_sales DECIMAL(12,2) NOT NULL DEFAULT 0,
    amount_settled DECIMAL(12,2) NOT NULL DEFAULT 0,
    balance_due DECIMAL(12,2) GENERATED ALWAYS AS (total_sales - amount_settled) STORED,
    status settlement_status DEFAULT 'pending',
    settled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    CONSTRAINT non_negative_sales CHECK (total_sales >= 0),
    CONSTRAINT non_negative_settled CHECK (amount_settled >= 0),
    CONSTRAINT valid_settlement_balance CHECK (balance_due >= 0),
    CONSTRAINT valid_month CHECK (month BETWEEN 1 AND 12),
    CONSTRAINT unique_shop_month_year UNIQUE(shop_id, month, year)
);

-- Payment records table
CREATE TABLE public.payments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    payment_method TEXT NOT NULL,
    payment_reference TEXT,
    month INTEGER NOT NULL,
    year INTEGER NOT NULL,
    status payment_status DEFAULT 'pending',
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    CONSTRAINT positive_amount CHECK (amount > 0),
    CONSTRAINT valid_month CHECK (month BETWEEN 1 AND 12)
);

-- Audit logs table
CREATE TABLE public.audit_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    table_name TEXT NOT NULL,
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ========================================
-- INDEXES
-- ========================================

-- Users indexes
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_users_verification_status ON public.users(verification_status);

-- Customers indexes
CREATE INDEX idx_customers_user_id ON public.customers(user_id);
CREATE INDEX idx_customers_employee_id ON public.customers(employee_id);
CREATE INDEX idx_customers_verification_status ON public.customers(verification_status);

-- Shops indexes
CREATE INDEX idx_shops_user_id ON public.shops(user_id);
CREATE INDEX idx_shops_license_number ON public.shops(license_number);
CREATE INDEX idx_shops_verification_status ON public.shops(verification_status);

-- Products indexes
CREATE INDEX idx_products_shop_id ON public.products(shop_id);
CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_products_is_active ON public.products(is_active);

-- Transactions indexes
CREATE INDEX idx_transactions_customer_id ON public.transactions(customer_id);
CREATE INDEX idx_transactions_shop_id ON public.transactions(shop_id);
CREATE INDEX idx_transactions_status ON public.transactions(status);
CREATE INDEX idx_transactions_month_year ON public.transactions(month, year);
CREATE INDEX idx_transactions_created_at ON public.transactions(created_at);

-- Transaction items indexes
CREATE INDEX idx_transaction_items_transaction_id ON public.transaction_items(transaction_id);
CREATE INDEX idx_transaction_items_product_id ON public.transaction_items(product_id);

-- Monthly statements indexes
CREATE INDEX idx_monthly_statements_customer_id ON public.monthly_statements(customer_id);
CREATE INDEX idx_monthly_statements_month_year ON public.monthly_statements(month, year);
CREATE INDEX idx_monthly_statements_status ON public.monthly_statements(status);

-- Shop settlements indexes
CREATE INDEX idx_shop_settlements_shop_id ON public.shop_settlements(shop_id);
CREATE INDEX idx_shop_settlements_month_year ON public.shop_settlements(month, year);
CREATE INDEX idx_shop_settlements_status ON public.shop_settlements(status);

-- Payments indexes
CREATE INDEX idx_payments_customer_id ON public.payments(customer_id);
CREATE INDEX idx_payments_month_year ON public.payments(month, year);
CREATE INDEX idx_payments_status ON public.payments(status);

-- Audit logs indexes
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_table_name ON public.audit_logs(table_name);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at);

-- ========================================
-- TRIGGERS AND FUNCTIONS
-- ========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_shops_updated_at BEFORE UPDATE ON public.shops FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON public.transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_monthly_statements_updated_at BEFORE UPDATE ON public.monthly_statements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_shop_settlements_updated_at BEFORE UPDATE ON public.shop_settlements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate transaction number
CREATE OR REPLACE FUNCTION generate_transaction_number()
RETURNS TEXT AS $$
DECLARE
    year_month TEXT;
    sequence_num TEXT;
BEGIN
    year_month := TO_CHAR(NOW(), 'YYYYMM');
    
    -- Create sequence if not exists
    EXECUTE 'CREATE SEQUENCE IF NOT EXISTS transaction_seq_' || year_month;
    
    -- Get next sequence number
    EXECUTE 'SELECT nextval(''transaction_seq_' || year_month || ''')' INTO sequence_num;
    
    RETURN 'TXN' || year_month || LPAD(sequence_num, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- Function to update customer credit after transaction
CREATE OR REPLACE FUNCTION update_customer_credit()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Update customer's used credit
        UPDATE public.customers 
        SET credit_used = credit_used + NEW.total_amount
        WHERE id = NEW.customer_id;
        
        -- Update monthly statement
        INSERT INTO public.monthly_statements 
            (customer_id, month, year, total_transactions, total_amount, due_date)
        VALUES 
            (NEW.customer_id, NEW.month, NEW.year, 1, NEW.total_amount, 
             (DATE_TRUNC('month', MAKE_DATE(NEW.year, NEW.month, 1)) + INTERVAL '1 month' - INTERVAL '1 day')::DATE)
        ON CONFLICT (customer_id, month, year)
        DO UPDATE SET
            total_transactions = monthly_statements.total_transactions + 1,
            total_amount = monthly_statements.total_amount + NEW.total_amount,
            updated_at = NOW();
            
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        -- Handle transaction status changes
        IF OLD.status != NEW.status AND NEW.status = 'failed' THEN
            -- Refund credit if transaction fails
            UPDATE public.customers 
            SET credit_used = credit_used - OLD.total_amount
            WHERE id = NEW.customer_id;
            
            -- Update monthly statement
            UPDATE public.monthly_statements 
            SET total_transactions = total_transactions - 1,
                total_amount = total_amount - OLD.total_amount,
                updated_at = NOW()
            WHERE customer_id = NEW.customer_id AND month = NEW.month AND year = NEW.year;
        END IF;
        
        RETURN NEW;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Apply credit update trigger
CREATE TRIGGER transaction_credit_trigger
    AFTER INSERT OR UPDATE ON public.transactions
    FOR EACH ROW EXECUTE FUNCTION update_customer_credit();

-- Function to create audit log
CREATE OR REPLACE FUNCTION create_audit_log()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.audit_logs (user_id, action, table_name, record_id, old_values, new_values)
    VALUES (
        COALESCE(current_setting('app.current_user_id', true)::UUID, NULL),
        TG_OP,
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE NULL END,
        CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW) ELSE NULL END
    );
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Apply audit triggers (only on critical tables)
CREATE TRIGGER audit_customers_trigger AFTER INSERT OR UPDATE OR DELETE ON public.customers FOR EACH ROW EXECUTE FUNCTION create_audit_log();
CREATE TRIGGER audit_shops_trigger AFTER INSERT OR UPDATE OR DELETE ON public.shops FOR EACH ROW EXECUTE FUNCTION create_audit_log();
CREATE TRIGGER audit_transactions_trigger AFTER INSERT OR UPDATE ON public.transactions FOR EACH ROW EXECUTE FUNCTION create_audit_log();
CREATE TRIGGER audit_payments_trigger AFTER INSERT OR UPDATE ON DELETE ON public.payments FOR EACH ROW EXECUTE FUNCTION create_audit_log();

-- ========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transaction_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monthly_statements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shop_settlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admin can view all users" ON public.users FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- Customers table policies
CREATE POLICY "Customers can view own data" ON public.customers FOR SELECT USING (
    user_id = auth.uid()
);
CREATE POLICY "Admins can view all customers" ON public.customers FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Shops can view customer names in transactions" ON public.customers FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.transactions t
        WHERE t.customer_id = customers.id
        AND EXISTS (
            SELECT 1 FROM public.shops s 
            WHERE s.user_id = auth.uid() 
            AND s.id = t.shop_id
        )
    )
);

-- Shops table policies
CREATE POLICY "Shops can view own data" ON public.shops FOR SELECT USING (
    user_id = auth.uid()
);
CREATE POLICY "Admins can view all shops" ON public.shops FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Customers can view shop names" ON public.shops FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.transactions t
        WHERE t.shop_id = shops.id
        AND t.customer_id IN (
            SELECT id FROM public.customers WHERE user_id = auth.uid()
        )
    )
);

-- Products table policies
CREATE POLICY "Shops can manage own products" ON public.products FOR ALL USING (
    EXISTS (SELECT 1 FROM public.shops WHERE user_id = auth.uid() AND id = shop_id)
);
CREATE POLICY "Admins can view all products" ON public.products FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Customers can view active products" ON public.products FOR SELECT USING (
    is_active = true
);

-- Transactions table policies
CREATE POLICY "Customers can view own transactions" ON public.transactions FOR SELECT USING (
    customer_id IN (SELECT id FROM public.customers WHERE user_id = auth.uid())
);
CREATE POLICY "Shops can view own transactions" ON public.transactions FOR SELECT USING (
    shop_id IN (SELECT id FROM public.shops WHERE user_id = auth.uid())
);
CREATE POLICY "Admins can manage all transactions" ON public.transactions FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- Transaction items policies (inherited from transactions)
CREATE POLICY "Users can view related transaction items" ON public.transaction_items FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.transactions t
        WHERE t.id = transaction_items.transaction_id
        AND (
            (t.customer_id IN (SELECT id FROM public.customers WHERE user_id = auth.uid()))
            OR
            (t.shop_id IN (SELECT id FROM public.shops WHERE user_id = auth.uid()))
            OR
            (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'))
        )
    )
);

-- Monthly statements policies
CREATE POLICY "Customers can view own statements" ON public.monthly_statements FOR SELECT USING (
    customer_id IN (SELECT id FROM public.customers WHERE user_id = auth.uid())
);
CREATE POLICY "Admins can manage all statements" ON public.monthly_statements FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- Shop settlements policies
CREATE POLICY "Shops can view own settlements" ON public.shop_settlements FOR SELECT USING (
    shop_id IN (SELECT id FROM public.shops WHERE user_id = auth.uid())
);
CREATE POLICY "Admins can manage all settlements" ON public.shop_settlements FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- Payments policies
CREATE POLICY "Customers can view own payments" ON public.payments FOR SELECT USING (
    customer_id IN (SELECT id FROM public.customers WHERE user_id = auth.uid())
);
CREATE POLICY "Admins can manage all payments" ON public.payments FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- Audit logs policies (admin only)
CREATE POLICY "Admins can view all audit logs" ON public.audit_logs FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- ========================================
-- VIEWS FOR COMMON QUERIES
-- ========================================

-- Customer credit summary view
CREATE VIEW public.customer_credit_summary AS
SELECT 
    c.id,
    c.full_name,
    c.employee_id,
    c.credit_limit,
    c.credit_used,
    c.credit_available,
    c.verification_status,
    COUNT(t.id) as transaction_count,
    COALESCE(SUM(t.total_amount), 0) as total_spent
FROM public.customers c
LEFT JOIN public.transactions t ON c.id = t.customer_id AND t.status = 'completed'
GROUP BY c.id, c.full_name, c.employee_id, c.credit_limit, c.credit_used, c.credit_available, c.verification_status;

-- Shop performance view
CREATE VIEW public.shop_performance AS
SELECT 
    s.id,
    s.shop_name,
    s.pending_balance,
    COUNT(t.id) as transaction_count,
    COALESCE(SUM(t.total_amount), 0) as total_sales,
    COALESCE(SUM(CASE WHEN t.status = 'completed' THEN t.total_amount ELSE 0 END), 0) as completed_sales
FROM public.shops s
LEFT JOIN public.transactions t ON s.id = t.shop_id
GROUP BY s.id, s.shop_name, s.pending_balance;

-- Monthly overview view (for admin)
CREATE VIEW public.monthly_overview AS
SELECT 
    EXTRACT(YEAR FROM t.created_at) as year,
    EXTRACT(MONTH FROM t.created_at) as month,
    COUNT(DISTINCT t.customer_id) as active_customers,
    COUNT(DISTINCT t.shop_id) as active_shops,
    COUNT(t.id) as total_transactions,
    COALESCE(SUM(t.total_amount), 0) as total_volume,
    COALESCE(SUM(CASE WHEN t.status = 'completed' THEN t.total_amount ELSE 0 END), 0) as completed_volume
FROM public.transactions t
GROUP BY EXTRACT(YEAR FROM t.created_at), EXTRACT(MONTH FROM t.created_at)
ORDER BY year DESC, month DESC;

-- ========================================
-- SAMPLE DATA (FOR TESTING)
-- ========================================

-- Insert admin user (you'll need to create this user in auth.users first)
-- INSERT INTO public.users (id, email, role, verification_status) 
-- VALUES ('your-admin-uuid', 'admin@example.com', 'admin', 'approved');

-- ========================================
-- IMPORTANT NOTES
-- ========================================

/*
1. SECURITY:
   - All tables have RLS enabled
   - Users can only access their own data
   - Admin has full access
   - Audit logging enabled on critical tables

2. CREDIT VALIDATION:
   - Use Edge Functions to validate credit before transactions
   - The database triggers handle credit updates automatically
   - Generated columns ensure data consistency

3. MONTHLY SETTLEMENTS:
   - Monthly statements are auto-generated
   - Settlement logic should be handled via Edge Functions
   - Views provide easy reporting

4. FILE STORAGE:
   - Job cards: storage/v1/customers/{user_id}/jobcard.pdf
   - Shop docs: storage/v1/shops/{shop_id}/verification.pdf
   - Product images: storage/v1/products/{product_id}/image.jpg

5. PERFORMANCE:
   - Indexes on all foreign keys and commonly queried fields
   - Generated columns for computed values
   - Views for complex queries

6. COMPLIANCE:
   - Audit logs for all critical operations
   - Data integrity constraints
   - Proper error handling in application layer
*/
