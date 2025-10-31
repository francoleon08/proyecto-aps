-- =====================================================
-- COMPLETE DATABASE SCHEMA FOR APS PROJECT
-- =====================================================
-- This file contains everything needed for a fresh Supabase project
-- Execute this in the Supabase SQL Editor

-- =====================================================
-- 1. CREATE ENUM TYPES
-- =====================================================

-- User types enum
CREATE TYPE user_type_enum AS ENUM ('client', 'employee', 'admin');

-- User status enum
CREATE TYPE user_status_enum AS ENUM ('active', 'inactive');

-- Session actions enum
CREATE TYPE session_action_enum AS ENUM (
    'login', 
    'logout', 
    'login_failed', 
    'password_reset', 
    'account_created', 
    'account_deactivated', 
    'account_activated'
);

-- =====================================================
-- 2. CREATE TABLES
-- =====================================================

-- Users table
CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone TEXT,
    address TEXT,
    user_type user_type_enum DEFAULT 'client' NOT NULL,
    status user_status_enum DEFAULT 'active' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sessions table for activity logging
CREATE TABLE sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    action session_action_enum NOT NULL,
    ip_address INET,
    user_agent TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB
);

-- =====================================================
-- 3. CREATE INDEXES
-- =====================================================

-- Users table indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_user_type ON users(user_type);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Sessions table indexes
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_action ON sessions(action);
CREATE INDEX idx_sessions_timestamp ON sessions(timestamp);

-- =====================================================
-- 4. CREATE FUNCTIONS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to register a new user
CREATE OR REPLACE FUNCTION register_user(
    p_name VARCHAR(255),
    p_email VARCHAR(255),
    p_password VARCHAR(255),
    p_user_type user_type_enum DEFAULT 'client'
)
RETURNS JSON AS $$
DECLARE
    user_id UUID;
BEGIN
    -- Check if email already exists
    IF EXISTS (SELECT 1 FROM users WHERE email = p_email) THEN
        RETURN json_build_object(
            'success', false,
            'error', 'El email ya está registrado'
        );
    END IF;
    
    -- Insert new user
    INSERT INTO users (name, email, password, user_type)
    VALUES (p_name, p_email, p_password, p_user_type)
    RETURNING id INTO user_id;
    
    -- Log account creation
    INSERT INTO sessions (user_id, action, metadata)
    VALUES (user_id, 'account_created', json_build_object('user_type', p_user_type));
    
    -- Return success
    RETURN json_build_object(
        'success', true,
        'user_id', user_id,
        'message', 'Usuario registrado exitosamente'
    );
END;
$$ LANGUAGE plpgsql;

-- Function to get user by ID
CREATE OR REPLACE FUNCTION get_user_by_id(p_user_id UUID)
RETURNS JSON AS $$
DECLARE
    user_record users%ROWTYPE;
BEGIN
    SELECT * INTO user_record
    FROM users
    WHERE id = p_user_id;
    
    IF NOT FOUND THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Usuario no encontrado'
        );
    END IF;
    
    RETURN json_build_object(
        'success', true,
        'user', json_build_object(
            'id', user_record.id,
            'name', user_record.name,
            'email', user_record.email,
            'phone', user_record.phone,
            'address', user_record.address,
            'user_type', user_record.user_type,
            'status', user_record.status,
            'created_at', user_record.created_at,
            'updated_at', user_record.updated_at
        )
    );
END;
$$ LANGUAGE plpgsql;

-- Function to get dashboard metrics
CREATE OR REPLACE FUNCTION get_dashboard_metrics()
RETURNS JSON AS $$
DECLARE
    active_users INTEGER;
    active_employees INTEGER;
    active_admins INTEGER;
BEGIN
    -- Get active user counts
    SELECT COUNT(*) INTO active_users FROM users WHERE status = 'active';
    SELECT COUNT(*) INTO active_employees FROM users WHERE user_type = 'employee' AND status = 'active';
    SELECT COUNT(*) INTO active_admins FROM users WHERE user_type = 'admin' AND status = 'active';
    
    RETURN json_build_object(
        'success', true,
        'metrics', json_build_object(
            'total_active_users', active_users,
            'total_active_employees', active_employees,
            'total_active_administrators', active_admins
        )
    );
END;
$$ LANGUAGE plpgsql;

-- Function to get recent sessions
CREATE OR REPLACE FUNCTION get_recent_sessions(p_limit INTEGER DEFAULT 20)
RETURNS JSON AS $$
DECLARE
    sessions_result JSON;
BEGIN
    SELECT json_agg(
        json_build_object(
            'id', s.id,
            'user_name', s.name,
            'user_email', s.email,
            'action', s.action,
            'timestamp', s.timestamp,
            'ip_address', s.ip_address,
            'user_agent', s.user_agent,
            'metadata', s.metadata
        )
    ) INTO sessions_result
    FROM (
        SELECT s.id,
               s.user_id,
               s.action,
               s.timestamp,
               s.ip_address,
               s.user_agent,
               s.metadata,
               u.name,
               u.email
        FROM sessions s
        LEFT JOIN users u ON s.user_id = u.id
        ORDER BY s.timestamp DESC
        LIMIT p_limit
    ) s;

    RETURN json_build_object(
        'success', true,
        'sessions', COALESCE(sessions_result, '[]'::json)
    );
END;
$$ LANGUAGE plpgsql;


-- Function to get all users with pagination and filtering
CREATE OR REPLACE FUNCTION get_users(
    p_limit INTEGER DEFAULT 50,
    p_offset INTEGER DEFAULT 0,
    p_search TEXT DEFAULT NULL,
    p_user_type user_type_enum DEFAULT NULL,
    p_status user_status_enum DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
    users_result JSON;
    total_count INTEGER;
BEGIN
    -- Get total count
    SELECT COUNT(*) INTO total_count
    FROM users
    WHERE (p_search IS NULL OR name ILIKE '%' || p_search || '%' OR email ILIKE '%' || p_search || '%')
      AND (p_user_type IS NULL OR user_type = p_user_type)
      AND (p_status IS NULL OR status = p_status);
    
    -- Get users (fixed version with subquery)
    SELECT json_agg(
        json_build_object(
            'id', u.id,
            'name', u.name,
            'email', u.email,
            'phone', u.phone,
            'address', u.address,
            'user_type', u.user_type,
            'status', u.status,
            'created_at', u.created_at,
            'updated_at', u.updated_at
        )
    ) INTO users_result
    FROM (
        SELECT *
        FROM users
        WHERE (p_search IS NULL OR name ILIKE '%' || p_search || '%' OR email ILIKE '%' || p_search || '%')
          AND (p_user_type IS NULL OR user_type = p_user_type)
          AND (p_status IS NULL OR status = p_status)
        ORDER BY created_at DESC
        LIMIT p_limit OFFSET p_offset
    ) u;
    
    RETURN json_build_object(
        'success', true,
        'users', COALESCE(users_result, '[]'::json),
        'total_count', total_count,
        'limit', p_limit,
        'offset', p_offset
    );
END;
$$ LANGUAGE plpgsql;


-- Function to update user status
CREATE OR REPLACE FUNCTION update_user_status(
    p_user_id UUID,
    p_status user_status_enum,
    p_admin_id UUID DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
    user_record users%ROWTYPE;
    action_type session_action_enum;
BEGIN
    -- Get user record
    SELECT * INTO user_record
    FROM users
    WHERE id = p_user_id;
    
    IF NOT FOUND THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Usuario no encontrado'
        );
    END IF;
    
    -- Update user status
    UPDATE users
    SET status = p_status
    WHERE id = p_user_id;
    
    -- Determine action type
    action_type := CASE 
        WHEN p_status = 'active' THEN 'account_activated'
        ELSE 'account_deactivated'
    END;
    
    -- Log status change
    INSERT INTO sessions (user_id, action, metadata)
    VALUES (p_user_id, action_type, json_build_object('admin_id', p_admin_id, 'previous_status', user_record.status));
    
    RETURN json_build_object(
        'success', true,
        'message', 'Estado del usuario actualizado exitosamente'
    );
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 5. CREATE TRIGGERS
-- =====================================================

-- Trigger to automatically update updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 6. ENABLE ROW LEVEL SECURITY
-- =====================================================

-- Enable RLS on tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 7. CREATE RLS POLICIES
-- =====================================================

-- Users table policies
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

-- Sessions table policies (admin only)
CREATE POLICY "Admins can view all sessions" ON sessions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid()::text::uuid 
            AND user_type = 'admin'
        )
    );

-- =====================================================
-- 8. INSERT SAMPLE DATA (OPTIONAL)
-- =====================================================

-- Insert a sample admin user (password: admin123)
-- Note: In production, use proper password hashing
INSERT INTO users (name, email, password, user_type, status) 
VALUES (
    'Administrador', 
    'admin@example.com', 
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 
    'admin', 
    'active'
) ON CONFLICT (email) DO NOTHING;

-- =====================================================
-- 9. GRANT PERMISSIONS
-- =====================================================

-- Grant necessary permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON users TO authenticated;
GRANT ALL ON sessions TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- =====================================================
-- COMPLETE SETUP FINISHED
-- =====================================================

-- This schema includes:
-- ✅ User management with roles (client, employee, admin)
-- ✅ User status management (active, inactive)
-- ✅ Session logging for all user activities
-- ✅ Dashboard metrics functions
-- ✅ User listing and filtering functions
-- ✅ Row Level Security (RLS) policies
-- ✅ Proper indexing for performance
-- ✅ Sample admin user for testing

-- Next steps:
-- 1. Configure your Next.js environment variables
-- 2. Set up Supabase client configuration
-- 3. Deploy your application
