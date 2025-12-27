#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

# Log function for better debugging
log() {
    echo "[$(date +'%Y-%m-%dT%H:%M:%S%z')] $*" >&2
}

# Log environment variables for debugging
log "Environment variables:"
env | grep -E 'DB_|POSTGRES_' | sort

# Ensure required environment variables are set
: "${DB_ROOT_USER:?DB_ROOT_USER environment variable is required}"
: "${DB_ROOT_PASSWORD:?DB_ROOT_PASSWORD environment variable is required}"
: "${DB_APP_USER:?DB_APP_USER environment variable is required}"
: "${DB_APP_PASSWORD:?DB_APP_PASSWORD environment variable is required}"
: "${POSTGRES_DB:?POSTGRES_DB environment variable is required}"
: "${POSTGRES_USER:?POSTGRES_USER environment variable is required}"

log "Starting database initialization for ${POSTGRES_DB}"

# Function to execute SQL commands with retries
execute_sql() {
    local sql="$1"
    local max_attempts=10
    local attempt=0
    local wait_seconds=2

    while [ $attempt -lt $max_attempts ]; do
        if psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" -c "$sql"; then
            return 0
        fi
        attempt=$((attempt + 1))
        log "Attempt $attempt failed, retrying in $wait_seconds seconds..."
        sleep $wait_seconds
    done
    
    log "Failed to execute SQL after $max_attempts attempts"
    return 1
}

# Wait for PostgreSQL to be ready
log "Waiting for PostgreSQL to be ready..."
for i in {1..30}; do
    if pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_DB" &>/dev/null; then
        break
    fi
    if [ $i -eq 30 ]; then
        log "PostgreSQL is not ready after 30 seconds, giving up"
        exit 1
    fi
    sleep 1
done

log "Creating root user and database..."

# Create a temporary SQL file
TEMP_SQL_FILE="/tmp/init_$(date +%s).sql"

# Write SQL commands to the temporary file
cat > "$TEMP_SQL_FILE" <<-EOSQL
-- Create root user if it doesn't exist
DO \$\$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = '${DB_ROOT_USER}') THEN
        CREATE ROLE "${DB_ROOT_USER}" WITH
            LOGIN
            SUPERUSER
            CREATEDB
            CREATEROLE
            INHERIT
            REPLICATION
            BYPASSRLS
            PASSWORD '${DB_ROOT_PASSWORD}';
        RAISE NOTICE 'Created root user %', '${DB_ROOT_USER}';
    ELSE
        -- Update password in case it changed in .env
        EXECUTE format('ALTER ROLE %I WITH PASSWORD %L', '${DB_ROOT_USER}', '${DB_ROOT_PASSWORD}');
        RAISE NOTICE 'Updated password for root user %', '${DB_ROOT_USER}';
    END IF;
END \$\$;

-- Create application database if it doesn't exist
SELECT 'CREATE DATABASE "${POSTGRES_DB}"'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '${POSTGRES_DB}')\\gexec

-- Grant all privileges on the database to the root user
GRANT ALL PRIVILEGES ON DATABASE "${POSTGRES_DB}" TO "${DB_ROOT_USER}";

-- Connect to the database
\\c "${POSTGRES_DB}";

-- Create application user with password
DO \$\$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = '${DB_APP_USER}') THEN
        CREATE ROLE "${DB_APP_USER}" WITH
            LOGIN
            NOSUPERUSER
            CREATEDB
            NOCREATEROLE
            INHERIT
            NOREPLICATION
            PASSWORD '${DB_APP_PASSWORD}';
        RAISE NOTICE 'Created application user %', '${DB_APP_USER}';
    ELSE
        -- Update password in case it changed in .env
        EXECUTE format('ALTER ROLE %I WITH LOGIN CREATEDB PASSWORD %L', '${DB_APP_USER}', '${DB_APP_PASSWORD}');
        RAISE NOTICE 'Updated password and permissions for application user %', '${DB_APP_USER}';
    END IF;
END \$\$;

-- Grant necessary privileges to the application user
GRANT CONNECT, TEMPORARY ON DATABASE "${POSTGRES_DB}" TO "${DB_APP_USER}";

-- We need to ensure the app user has permissions on the public schema 
-- for both the main database and any shadow database it might create.
-- Since the shadow database is created at runtime by Prisma, we grant
-- permissions on the current database and set default privileges.

GRANT ALL ON SCHEMA public TO "${DB_APP_USER}";
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO "${DB_APP_USER}";
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO "${DB_APP_USER}";

-- This ensures that when the user creates new objects in the public schema, they have access.
-- However, for the shadow database, it's a completely new database. 
-- The CREATEDB permission allows the user to create the database.
-- In PostgreSQL, by default, a new database has a public schema where ALL users have CREATE and USAGE.
-- But in newer PostgreSQL versions (15+), this has changed.
-- To fix the shadow database issue specifically for Prisma, we can use a template database
-- or ensure the global defaults are correct.
-- For local dev, another approach is to grant the app user the same role as the creator.

-- Let's also grant the app user to the root user and vice versa for local dev simplicity
-- Use DO block to avoid error if already granted
-- PostgreSQL role membership can be tricky, so we just try and ignore errors if needed
-- but here we try to be precise.
DO \$\$
BEGIN
    BEGIN
        GRANT "${DB_APP_USER}" TO "${POSTGRES_USER}";
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Could not grant % to %: %', '${DB_APP_USER}', '${POSTGRES_USER}', SQLERRM;
    END;

    BEGIN
        GRANT "${POSTGRES_USER}" TO "${DB_APP_USER}";
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Could not grant % to %: %', '${POSTGRES_USER}', '${DB_APP_USER}', SQLERRM;
    END;
END \$\$;

-- Set default privileges for future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA public
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO "${DB_APP_USER}";
ALTER DEFAULT PRIVILEGES IN SCHEMA public
    GRANT USAGE, SELECT ON SEQUENCES TO "${DB_APP_USER}";
ALTER DEFAULT PRIVILEGES IN SCHEMA public
    GRANT EXECUTE ON FUNCTIONS TO "${DB_APP_USER}";

-- Revoke public schema access from public
REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON DATABASE "${POSTGRES_DB}" FROM PUBLIC;
EOSQL

# Execute the SQL file
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" -f "$TEMP_SQL_FILE"

# Clean up the temporary file
rm -f "$TEMP_SQL_FILE"

log "Database initialization completed successfully"