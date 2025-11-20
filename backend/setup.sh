#!/bin/bash

# Database setup script for W.C.R.E.A.M.S.
echo "Setting up W.C.R.E.A.M.S. database..."

# Create database
creatdb wife_conflict_db
if [ $? -ne 0 ]; then
    echo "Error: Failed to create database. Make sure PostgreSQL is installed and running."
    exit 1
fi

# Run SQL script
psql -d wife_conflict_db -f "$(dirname "$0")/database.sql"
if [ $? -ne 0 ]; then
    echo "Error: Failed to run database script."
    exit 1
fi

echo "✅ Database setup completed successfully!"