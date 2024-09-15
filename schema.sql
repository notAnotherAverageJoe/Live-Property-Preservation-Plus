-- psql -U your_username -d your_database
--\i /path/to/your/schema.sql


-- First, create the Companies table, as it is referenced by other tables.
CREATE TABLE Companies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Next, create the Users table, which references the Companies table.
CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    company_id INT REFERENCES Companies(id),
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Now create the Roles table, which references Users and Companies.
CREATE TABLE Roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    company_id INT,
    user_id INT,
    access_level INT
);

-- Then create the UserRoles table, which references Users and Roles.
CREATE TABLE UserRoles (
    user_id INT REFERENCES Users(id) ON DELETE CASCADE,
    role_id INT REFERENCES Roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

-- Create the Properties table, which references Companies.
CREATE TABLE Properties (
    id SERIAL PRIMARY KEY,
    company_id INT REFERENCES Companies(id),
    name VARCHAR(255) NOT NULL,
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the Units table, which references Properties.
CREATE TABLE Units (
    id SERIAL PRIMARY KEY,
    property_id INT REFERENCES Properties(id),
    unit_number VARCHAR(255) NOT NULL,
    type VARCHAR(50),  -- e.g., '1B1B', '2B2B'
    rent_amount DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the Tenants table 
CREATE TABLE Tenants (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    property_id INT,
    company_id INT 
);


-- Create the Leases table, which references Units, Tenants, and Companies.
CREATE TABLE Leases (
    id SERIAL PRIMARY KEY,
    unit_id INT REFERENCES Units(id),
    tenant_id INT REFERENCES Tenants(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    rent_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'Active',  -- e.g., 'Active', 'Terminated'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    company_id INT
);

-- Create the MaintenanceRequests table, which references Units.
CREATE TABLE MaintenanceRequests (
    id SERIAL PRIMARY KEY,
    unit_id INT REFERENCES Units(id),
    request_description TEXT NOT NULL,
    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'Pending',  -- e.g., 'Pending', 'Completed'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Finally, create the FinancialTransactions table, which references Properties.
CREATE TABLE FinancialTransactions (
    id SERIAL PRIMARY KEY,
    property_id INT REFERENCES Properties(id),
    type VARCHAR(50),  -- e.g., 'Income', 'Expense'
    amount DECIMAL(10, 2) NOT NULL,
    description TEXT,
    transaction_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
