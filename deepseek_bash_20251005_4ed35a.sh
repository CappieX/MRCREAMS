#!/bin/bash

echo "Installing W.C.R.E.A.M.S..."
echo

echo "Step 1: Installing backend dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "Error installing backend dependencies!"
    exit 1
fi

echo "Step 2: Installing frontend dependencies..."
cd ../frontend
npm install
if [ $? -ne 0 ]; then
    echo "Error installing frontend dependencies!"
    exit 1
fi

echo
echo "✅ Installation completed successfully!"
echo
echo "Next steps:"
echo "1. Set up PostgreSQL database (see README.md)"
echo "2. Configure backend/.env file with your database credentials"
echo "3. Run the backend: cd backend && npm run dev"
echo "4. Run the frontend: cd frontend && npm start"
echo