-- Create the application user if it doesn't exist
DO
\
$
\$
BEGIN
    IF
NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'libra_app') THEN
CREATE ROLE libra_app WITH
    LOGIN
    NOSUPERUSER
    NOCREATEDB
    NOCREATEROLE
    NOINHERIT
    NOREPLICATION
    PASSWORD '';
RAISE
NOTICE 'Created application user %', 'libra_app';
ELSE
        ALTER
ROLE libra_app WITH PASSWORD '';
        RAISE
NOTICE 'Updated password for application user %', 'libra_app';
END IF;
END
\$
\
$;

-- Grant necessary privileges to the application user
GRANT CONNECT, TEMPORARY
ON DATABASE librakeeper TO libra_app;

-- Connect to the database and set permissions
\c
librakeeper;

-- Grant schema and table privileges
GRANT USAGE ON SCHEMA
public TO libra_app;
GRANT
SELECT,
INSERT
,
UPDATE,
DELETE
ON ALL TABLES IN SCHEMA public TO libra_app;
GRANT
USAGE,
SELECT
ON ALL SEQUENCES IN SCHEMA public TO libra_app;

-- Set default privileges for future objects
ALTER
DEFAULT PRIVILEGES IN SCHEMA public
    GRANT
SELECT,
INSERT
,
UPDATE,
DELETE
ON TABLES TO libra_app;
ALTER
DEFAULT PRIVILEGES IN SCHEMA public
    GRANT USAGE,
SELECT
ON SEQUENCES TO libra_app;
ALTER
DEFAULT PRIVILEGES IN SCHEMA public
    GRANT EXECUTE ON FUNCTIONS TO libra_app;

-- Revoke public schema access from public
REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON DATABASE librakeeper FROM PUBLIC;
