@echo off
echo Setting up W.C.R.E.A.M.S. database...

:: Create database
psql -U postgres -c "CREATE DATABASE wife_conflict_db;"
if %errorlevel% neq 0 (
    echo Error: Failed to create database. Make sure PostgreSQL is installed and running.
    pause
    exit /b 1
)

:: Run SQL script
psql -U postgres -d wife_conflict_db -f "%~dp0database.sql"
if %errorlevel% neq 0 (
    echo Error: Failed to run database script.
    pause
    exit /b 1
)

echo ✅ Database setup completed successfully!
pause