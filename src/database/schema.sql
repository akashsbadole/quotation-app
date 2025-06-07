-- QuoteManager Database Schema
-- Comprehensive schema for quotation management system with full functionality

-- ============================================================================
-- CORE BUSINESS TABLES
-- ============================================================================

-- Companies/Organizations
CREATE TABLE companies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    website VARCHAR(255),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    zip_code VARCHAR(20),
    country VARCHAR(100),
    tax_id VARCHAR(100),
    logo_url TEXT,
    currency VARCHAR(3) DEFAULT 'USD',
    date_format VARCHAR(20) DEFAULT 'MM/DD/YYYY',
    timezone VARCHAR(100) DEFAULT 'America/Los_Angeles',
    language VARCHAR(10) DEFAULT 'en',
    fiscal_year_start VARCHAR(20) DEFAULT 'January',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users and Authentication
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL, -- 'admin', 'manager', 'sales_rep', 'viewer'
    department VARCHAR(100),
    phone VARCHAR(50),
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    email_verified BOOLEAN DEFAULT FALSE,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id)
);

-- Customers/Clients
CREATE TABLE customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    company_name VARCHAR(255),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    zip_code VARCHAR(20),
    country VARCHAR(100),
    customer_type VARCHAR(50) DEFAULT 'regular', -- 'vip', 'regular', 'prospect'
    credit_limit DECIMAL(15,2) DEFAULT 0,
    payment_terms VARCHAR(50) DEFAULT 'Net 30',
    tax_exempt BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_by INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Product Categories
CREATE TABLE product_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    parent_id INTEGER,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id),
    FOREIGN KEY (parent_id) REFERENCES product_categories(id)
);

-- Products/Services
CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER NOT NULL,
    category_id INTEGER,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    sku VARCHAR(100),
    unit_price DECIMAL(15,2) NOT NULL,
    cost_price DECIMAL(15,2),
    unit_of_measure VARCHAR(50) DEFAULT 'each',
    tax_rate DECIMAL(5,2) DEFAULT 0,
    is_service BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id),
    FOREIGN KEY (category_id) REFERENCES product_categories(id)
);

-- ============================================================================
-- INVENTORY MANAGEMENT TABLES
-- ============================================================================

-- Inventory Locations/Warehouses
CREATE TABLE inventory_locations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    zip_code VARCHAR(20),
    country VARCHAR(100),
    location_type VARCHAR(50) DEFAULT 'warehouse', -- 'warehouse', 'store', 'online'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id)
);

-- Inventory Items
CREATE TABLE inventory_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    location_id INTEGER NOT NULL,
    current_stock INTEGER DEFAULT 0,
    min_stock INTEGER DEFAULT 0,
    max_stock INTEGER DEFAULT 0,
    reorder_point INTEGER DEFAULT 0,
    last_counted_at TIMESTAMP,
    last_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id),
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (location_id) REFERENCES inventory_locations(id),
    UNIQUE(product_id, location_id)
);

-- Inventory Movements/Transactions
CREATE TABLE inventory_movements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER NOT NULL,
    inventory_item_id INTEGER NOT NULL,
    movement_type VARCHAR(50) NOT NULL, -- 'in', 'out', 'adjustment', 'transfer'
    quantity INTEGER NOT NULL,
    reference_type VARCHAR(50), -- 'quotation', 'purchase', 'adjustment', 'transfer'
    reference_id INTEGER,
    notes TEXT,
    created_by INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id),
    FOREIGN KEY (inventory_item_id) REFERENCES inventory_items(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Suppliers
CREATE TABLE suppliers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    zip_code VARCHAR(20),
    country VARCHAR(100),
    payment_terms VARCHAR(50) DEFAULT 'Net 30',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id)
);

-- Product Suppliers (Many-to-Many)
CREATE TABLE product_suppliers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    supplier_id INTEGER NOT NULL,
    supplier_sku VARCHAR(100),
    cost_price DECIMAL(15,2),
    lead_time_days INTEGER DEFAULT 0,
    minimum_order_quantity INTEGER DEFAULT 1,
    is_preferred BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id),
    UNIQUE(product_id, supplier_id)
);

-- ============================================================================
-- QUOTATION MANAGEMENT TABLES
-- ============================================================================

-- Quotations
CREATE TABLE quotations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER NOT NULL,
    quotation_number VARCHAR(100) UNIQUE NOT NULL,
    customer_id INTEGER NOT NULL,
    title VARCHAR(255),
    status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'pending', 'approved', 'rejected', 'expired', 'converted'
    subtotal DECIMAL(15,2) DEFAULT 0,
    tax_amount DECIMAL(15,2) DEFAULT 0,
    discount_amount DECIMAL(15,2) DEFAULT 0,
    total_amount DECIMAL(15,2) DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'USD',
    valid_until DATE,
    payment_terms VARCHAR(100),
    notes TEXT,
    terms_conditions TEXT,
    created_by INTEGER NOT NULL,
    assigned_to INTEGER,
    approved_by INTEGER,
    approved_at TIMESTAMP,
    sent_at TIMESTAMP,
    viewed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id),
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (assigned_to) REFERENCES users(id),
    FOREIGN KEY (approved_by) REFERENCES users(id)
);

-- Quotation Items
CREATE TABLE quotation_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    quotation_id INTEGER NOT NULL,
    product_id INTEGER,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    quantity DECIMAL(10,2) NOT NULL,
    unit_price DECIMAL(15,2) NOT NULL,
    discount_percent DECIMAL(5,2) DEFAULT 0,
    tax_rate DECIMAL(5,2) DEFAULT 0,
    line_total DECIMAL(15,2) NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (quotation_id) REFERENCES quotations(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Quotation Templates
CREATE TABLE quotation_templates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    template_data TEXT, -- JSON structure
    is_active BOOLEAN DEFAULT TRUE,
    created_by INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- ============================================================================
-- WORKFLOW AND APPROVAL TABLES
-- ============================================================================

-- Workflow Rules
CREATE TABLE workflow_rules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    trigger_event VARCHAR(100) NOT NULL, -- 'quotation_created', 'quotation_updated', 'scheduled_daily'
    conditions TEXT, -- JSON array of conditions
    actions TEXT, -- JSON array of actions
    priority INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    execution_count INTEGER DEFAULT 0,
    created_by INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Approval Workflows
CREATE TABLE approval_workflows (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    trigger_conditions TEXT, -- JSON conditions that trigger this workflow
    approval_levels TEXT, -- JSON array of approval levels
    is_active BOOLEAN DEFAULT TRUE,
    created_by INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Approval Requests
CREATE TABLE approval_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER NOT NULL,
    workflow_id INTEGER,
    quotation_id INTEGER NOT NULL,
    level INTEGER NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'expired'
    priority VARCHAR(50) DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
    requested_by INTEGER NOT NULL,
    assigned_to INTEGER,
    approved_by INTEGER,
    comments TEXT,
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    responded_at TIMESTAMP,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id),
    FOREIGN KEY (workflow_id) REFERENCES approval_workflows(id),
    FOREIGN KEY (quotation_id) REFERENCES quotations(id),
    FOREIGN KEY (requested_by) REFERENCES users(id),
    FOREIGN KEY (assigned_to) REFERENCES users(id),
    FOREIGN KEY (approved_by) REFERENCES users(id)
);

-- Approval History
CREATE TABLE approval_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER NOT NULL,
    approval_request_id INTEGER NOT NULL,
    quotation_id INTEGER NOT NULL,
    action VARCHAR(50) NOT NULL, -- 'submitted', 'approved', 'rejected', 'escalated', 'expired'
    performed_by INTEGER,
    comments TEXT,
    processing_time_hours DECIMAL(8,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id),
    FOREIGN KEY (approval_request_id) REFERENCES approval_requests(id),
    FOREIGN KEY (quotation_id) REFERENCES quotations(id),
    FOREIGN KEY (performed_by) REFERENCES users(id)
);

-- ============================================================================
-- ANALYTICS AND FORECASTING TABLES
-- ============================================================================

-- Sales Forecasts
CREATE TABLE sales_forecasts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER NOT NULL,
    period_type VARCHAR(20) NOT NULL, -- 'monthly', 'quarterly', 'yearly'
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    predicted_amount DECIMAL(15,2) NOT NULL,
    actual_amount DECIMAL(15,2),
    confidence_level DECIMAL(5,2), -- 0-100 percentage
    model_used VARCHAR(100), -- 'ai_enhanced', 'linear_regression', 'seasonal_arima'
    trend VARCHAR(20), -- 'up', 'down', 'stable'
    created_by INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Performance Metrics
CREATE TABLE performance_metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER NOT NULL,
    metric_type VARCHAR(100) NOT NULL, -- 'quotation_conversion', 'revenue', 'customer_acquisition'
    metric_name VARCHAR(255) NOT NULL,
    metric_value DECIMAL(15,2) NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id)
);

-- Financial Reports Data
CREATE TABLE financial_reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER NOT NULL,
    report_type VARCHAR(100) NOT NULL, -- 'revenue', 'profit_loss', 'cash_flow'
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    report_data TEXT, -- JSON structure with detailed financial data
    generated_by INTEGER,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id),
    FOREIGN KEY (generated_by) REFERENCES users(id)
);

-- ============================================================================
-- SYSTEM SETTINGS AND CONFIGURATION TABLES
-- ============================================================================

-- System Settings
CREATE TABLE system_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER NOT NULL,
    setting_category VARCHAR(100) NOT NULL, -- 'general', 'email', 'security', 'integrations'
    setting_key VARCHAR(255) NOT NULL,
    setting_value TEXT,
    data_type VARCHAR(50) DEFAULT 'string', -- 'string', 'number', 'boolean', 'json'
    is_encrypted BOOLEAN DEFAULT FALSE,
    updated_by INTEGER,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id),
    FOREIGN KEY (updated_by) REFERENCES users(id),
    UNIQUE(company_id, setting_category, setting_key)
);

-- User Preferences
CREATE TABLE user_preferences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    preference_key VARCHAR(255) NOT NULL,
    preference_value TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(user_id, preference_key)
);

-- Notification Settings
CREATE TABLE notification_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    notification_type VARCHAR(100) NOT NULL, -- 'email_quotations', 'email_approvals', 'sms_alerts'
    is_enabled BOOLEAN DEFAULT TRUE,
    delivery_method VARCHAR(50) DEFAULT 'email', -- 'email', 'sms', 'push', 'in_app'
    frequency VARCHAR(50) DEFAULT 'immediate', -- 'immediate', 'daily', 'weekly'
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(user_id, notification_type)
);

-- ============================================================================
-- INTEGRATION AND API TABLES
-- ============================================================================

-- API Keys and Integrations
CREATE TABLE integrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER NOT NULL,
    integration_type VARCHAR(100) NOT NULL, -- 'salesforce', 'quickbooks', 'stripe'
    integration_name VARCHAR(255) NOT NULL,
    api_key VARCHAR(500),
    api_secret VARCHAR(500),
    endpoint_url VARCHAR(500),
    configuration TEXT, -- JSON configuration
    is_active BOOLEAN DEFAULT TRUE,
    last_sync_at TIMESTAMP,
    created_by INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Integration Sync Logs
CREATE TABLE integration_sync_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    integration_id INTEGER NOT NULL,
    sync_type VARCHAR(100) NOT NULL, -- 'customers', 'products', 'quotations'
    status VARCHAR(50) NOT NULL, -- 'success', 'error', 'partial'
    records_processed INTEGER DEFAULT 0,
    records_success INTEGER DEFAULT 0,
    records_failed INTEGER DEFAULT 0,
    error_message TEXT,
    sync_started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sync_completed_at TIMESTAMP,
    FOREIGN KEY (integration_id) REFERENCES integrations(id)
);

-- ============================================================================
-- AUDIT AND LOGGING TABLES
-- ============================================================================

-- Activity Logs
CREATE TABLE activity_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER NOT NULL,
    user_id INTEGER,
    action VARCHAR(100) NOT NULL, -- 'create', 'update', 'delete', 'view', 'export'
    entity_type VARCHAR(100) NOT NULL, -- 'quotation', 'customer', 'product', 'user'
    entity_id INTEGER,
    description TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Error Logs
CREATE TABLE error_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER,
    user_id INTEGER,
    error_type VARCHAR(100) NOT NULL,
    error_message TEXT NOT NULL,
    stack_trace TEXT,
    request_url VARCHAR(500),
    request_method VARCHAR(10),
    request_data TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- ============================================================================
-- FOOTER PAGES AND CONTENT MANAGEMENT
-- ============================================================================

-- Footer Pages Content Management
CREATE TABLE footer_pages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'product', 'company', 'resources', 'legal'
    meta_description TEXT,
    meta_keywords TEXT,
    content TEXT NOT NULL, -- JSON content structure
    status VARCHAR(20) DEFAULT 'published', -- 'draft', 'published', 'archived'
    featured BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contact Form Submissions
CREATE TABLE contact_submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    phone VARCHAR(50),
    subject VARCHAR(500) NOT NULL,
    message TEXT NOT NULL,
    inquiry_type VARCHAR(100) DEFAULT 'general', -- 'sales', 'support', 'partnership', 'general'
    status VARCHAR(50) DEFAULT 'new', -- 'new', 'in_progress', 'resolved', 'closed'
    assigned_to INTEGER,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_to) REFERENCES users(id)
);

-- Help Center Articles
CREATE TABLE help_articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    difficulty VARCHAR(20) DEFAULT 'beginner', -- 'beginner', 'intermediate', 'advanced'
    read_time_minutes INTEGER DEFAULT 5,
    view_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT TRUE,
    tags TEXT, -- JSON array of tags
    created_by INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Case Studies
CREATE TABLE case_studies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(255) NOT NULL,
    client_name VARCHAR(255) NOT NULL,
    industry VARCHAR(100) NOT NULL,
    company_size VARCHAR(50) NOT NULL, -- 'startup', 'small', 'medium', 'enterprise'
    challenge TEXT NOT NULL,
    solution TEXT NOT NULL,
    results TEXT NOT NULL, -- JSON array of results
    metrics TEXT NOT NULL, -- JSON object of key metrics
    testimonial TEXT, -- JSON object with quote, author, position
    implementation_time VARCHAR(100),
    is_featured BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT TRUE,
    logo_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE OPTIMIZATION
-- ============================================================================

-- User indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_company_id ON users(company_id);
CREATE INDEX idx_users_role ON users(role);

-- Customer indexes
CREATE INDEX idx_customers_company_id ON customers(company_id);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_type ON customers(customer_type);

-- Product indexes
CREATE INDEX idx_products_company_id ON products(company_id);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_active ON products(is_active);

-- Inventory indexes
CREATE INDEX idx_inventory_items_product_location ON inventory_items(product_id, location_id);
CREATE INDEX idx_inventory_items_company_id ON inventory_items(company_id);
CREATE INDEX idx_inventory_movements_item_id ON inventory_movements(inventory_item_id);
CREATE INDEX idx_inventory_movements_created_at ON inventory_movements(created_at);

-- Quotation indexes
CREATE INDEX idx_quotations_company_id ON quotations(company_id);
CREATE INDEX idx_quotations_customer_id ON quotations(customer_id);
CREATE INDEX idx_quotations_number ON quotations(quotation_number);
CREATE INDEX idx_quotations_status ON quotations(status);
CREATE INDEX idx_quotations_created_by ON quotations(created_by);
CREATE INDEX idx_quotations_created_at ON quotations(created_at);

-- Quotation items indexes
CREATE INDEX idx_quotation_items_quotation_id ON quotation_items(quotation_id);
CREATE INDEX idx_quotation_items_product_id ON quotation_items(product_id);

-- Workflow indexes
CREATE INDEX idx_workflow_rules_company_id ON workflow_rules(company_id);
CREATE INDEX idx_workflow_rules_active ON workflow_rules(is_active);
CREATE INDEX idx_approval_requests_quotation_id ON approval_requests(quotation_id);
CREATE INDEX idx_approval_requests_status ON approval_requests(status);
CREATE INDEX idx_approval_requests_assigned_to ON approval_requests(assigned_to);

-- Analytics indexes
CREATE INDEX idx_sales_forecasts_company_period ON sales_forecasts(company_id, period_start, period_end);
CREATE INDEX idx_performance_metrics_company_type ON performance_metrics(company_id, metric_type);
CREATE INDEX idx_financial_reports_company_type ON financial_reports(company_id, report_type);

-- Activity log indexes
CREATE INDEX idx_activity_logs_company_id ON activity_logs(company_id);
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_entity ON activity_logs(entity_type, entity_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);

-- Footer pages indexes
CREATE INDEX idx_footer_pages_category ON footer_pages(category);
CREATE INDEX idx_footer_pages_status ON footer_pages(status);
CREATE INDEX idx_contact_submissions_status ON contact_submissions(status);
CREATE INDEX idx_help_articles_category ON help_articles(category);
CREATE INDEX idx_case_studies_industry ON case_studies(industry);

-- API Documentation
CREATE TABLE api_documentation (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    endpoint VARCHAR(200) NOT NULL,
    method VARCHAR(10) NOT NULL, -- 'GET', 'POST', 'PUT', 'DELETE'
    category VARCHAR(100) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    request_schema TEXT, -- JSON schema
    response_schema TEXT, -- JSON schema
    example_request TEXT,
    example_response TEXT,
    authentication_required BOOLEAN DEFAULT TRUE,
    rate_limit_per_hour INTEGER DEFAULT 1000,
    version VARCHAR(20) DEFAULT 'v1',
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'deprecated', 'beta'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Company Information
CREATE TABLE company_info (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    section VARCHAR(50) NOT NULL, -- 'about', 'mission', 'values', 'team'
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    image_url VARCHAR(255),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Team Members
CREATE TABLE team_members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    position VARCHAR(100) NOT NULL,
    department VARCHAR(50),
    bio TEXT,
    image_url VARCHAR(255),
    email VARCHAR(100),
    linkedin_url VARCHAR(255),
    twitter_url VARCHAR(255),
    is_leadership BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Job Postings
CREATE TABLE job_postings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(200) NOT NULL,
    department VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL,
    employment_type VARCHAR(50) NOT NULL, -- 'full-time', 'part-time', 'contract', 'remote'
    experience_level VARCHAR(50), -- 'entry', 'mid', 'senior', 'executive'
    description TEXT NOT NULL,
    requirements TEXT NOT NULL,
    benefits TEXT,
    salary_range VARCHAR(100),
    application_deadline DATE,
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'paused', 'closed'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Press Releases
CREATE TABLE press_releases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(200) NOT NULL,
    subtitle VARCHAR(300),
    content TEXT NOT NULL,
    excerpt TEXT,
    featured_image VARCHAR(255),
    author VARCHAR(100),
    publication_date DATE NOT NULL,
    category VARCHAR(50), -- 'product', 'company', 'partnership', 'award'
    tags TEXT, -- JSON array of tags
    status VARCHAR(20) DEFAULT 'published', -- 'draft', 'published', 'archived'
    views_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Partners
CREATE TABLE partners (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'technology', 'integration', 'reseller', 'strategic'
    description TEXT,
    logo_url VARCHAR(255),
    website_url VARCHAR(255),
    contact_email VARCHAR(100),
    partnership_level VARCHAR(50), -- 'bronze', 'silver', 'gold', 'platinum'
    start_date DATE,
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'inactive', 'pending'
    featured BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Help Center Articles
CREATE TABLE help_articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100),
    content TEXT NOT NULL,
    excerpt TEXT,
    difficulty_level VARCHAR(20), -- 'beginner', 'intermediate', 'advanced'
    estimated_read_time INTEGER, -- in minutes
    tags TEXT, -- JSON array
    featured BOOLEAN DEFAULT FALSE,
    helpful_votes INTEGER DEFAULT 0,
    not_helpful_votes INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'published',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Webinars
CREATE TABLE webinars (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    presenter_name VARCHAR(100) NOT NULL,
    presenter_bio TEXT,
    presenter_image VARCHAR(255),
    scheduled_date TIMESTAMP NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    max_attendees INTEGER,
    registration_url VARCHAR(255),
    recording_url VARCHAR(255),
    slides_url VARCHAR(255),
    category VARCHAR(100), -- 'product-demo', 'training', 'best-practices'
    status VARCHAR(20) DEFAULT 'scheduled', -- 'scheduled', 'live', 'completed', 'cancelled'
    registration_count INTEGER DEFAULT 0,
    attendance_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Case Studies
CREATE TABLE case_studies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(200) NOT NULL,
    client_name VARCHAR(100) NOT NULL,
    client_industry VARCHAR(100),
    client_size VARCHAR(50), -- 'startup', 'small', 'medium', 'enterprise'
    challenge TEXT NOT NULL,
    solution TEXT NOT NULL,
    results TEXT NOT NULL,
    metrics TEXT, -- JSON object with key metrics
    featured_image VARCHAR(255),
    client_logo VARCHAR(255),
    testimonial TEXT,
    testimonial_author VARCHAR(100),
    testimonial_position VARCHAR(100),
    implementation_time VARCHAR(50),
    roi_percentage DECIMAL(5,2),
    featured BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'published',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Blog Posts
CREATE TABLE blog_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    featured_image VARCHAR(255),
    category VARCHAR(100) NOT NULL,
    tags TEXT, -- JSON array
    status VARCHAR(20) DEFAULT 'published', -- 'draft', 'published', 'archived'
    featured BOOLEAN DEFAULT FALSE,
    views_count INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    estimated_read_time INTEGER,
    seo_title VARCHAR(200),
    seo_description TEXT,
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Legal Documents
CREATE TABLE legal_documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type VARCHAR(50) NOT NULL, -- 'privacy-policy', 'terms-of-service', 'cookie-policy', etc.
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    version VARCHAR(20) NOT NULL,
    effective_date DATE NOT NULL,
    last_updated DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'archived'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Mobile App Information
CREATE TABLE mobile_apps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    platform VARCHAR(20) NOT NULL, -- 'ios', 'android'
    app_name VARCHAR(100) NOT NULL,
    version VARCHAR(20) NOT NULL,
    build_number VARCHAR(50),
    description TEXT,
    features TEXT, -- JSON array
    download_url VARCHAR(255),
    file_size VARCHAR(20),
    minimum_os_version VARCHAR(20),
    release_notes TEXT,
    screenshots TEXT, -- JSON array of URLs
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'beta', 'deprecated'
    download_count INTEGER DEFAULT 0,
    rating DECIMAL(2,1) DEFAULT 0.0,
    rating_count INTEGER DEFAULT 0,
    released_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contact Form Submissions
CREATE TABLE contact_submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    company VARCHAR(100),
    phone VARCHAR(20),
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    inquiry_type VARCHAR(50), -- 'sales', 'support', 'partnership', 'general'
    status VARCHAR(20) DEFAULT 'new', -- 'new', 'in-progress', 'resolved', 'closed'
    assigned_to INTEGER,
    response_sent BOOLEAN DEFAULT FALSE,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
