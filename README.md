# MR.CREAMS - Modern Relationship Conflict Resolution & Emotion Analysis Management System

**Smart healing for modern relationships.**

MR.CREAMS is a comprehensive relationship intelligence platform that redefines how relationships heal through smart conflict analysis, emotional insight, and guided harmony. Our mission is to provide couples and individuals with the tools they need to understand, heal, and grow their relationships through data-driven insights and empathetic technology.

## Mission Statement

**"Redefining how relationships heal — through smart conflict analysis, emotional insight, and guided harmony."**

We believe that every relationship deserves intelligent support. MR.CREAMS combines advanced analytics with emotional intelligence to provide personalized healing guidance that helps modern couples build stronger, more resilient relationships.

## Project Structure

```
├── backend/             # Express.js API server
│   ├── database.sql     # PostgreSQL database schema
│   ├── package.json     # Backend dependencies
│   ├── server.js        # API server code
│   ├── setup.bat        # Windows database setup script
│   └── setup.sh         # Unix/Mac database setup script
│
├── frontend/           # React.js frontend application
│   ├── package.json     # Frontend dependencies
│   ├── public/          # Static assets
│   └── src/             # React source code
│       ├── components/  # Reusable UI components
│       ├── pages/       # Page components
│       ├── App.js       # Main application component
│       └── index.js     # Application entry point
│
└── README.md           # Project documentation
```

## Prerequisites

Before you begin, ensure you have installed:

### Required Software
1. **Node.js** (version 16 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **PostgreSQL** (version 12 or higher)
   - Download from: https://www.postgresql.org/download/
   - Verify installation: `psql --version`

3. **Git** (optional, for version control)
   - Download from: https://git-scm.com/

### System Requirements
- Windows 10/11, macOS 10.14+, or Ubuntu 18.04+
- 4GB RAM minimum
- 1GB free disk space
- Modern web browser (Chrome, Firefox, Safari, Edge)

## Installation Guide

### Step 1: Database Setup

#### macOS/Linux:
```bash
cd backend
chmod +x setup.sh
./setup.sh
```

#### Windows:
```cmd
cd backend
setup.bat
```

### Step 2: Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory with the following content (adjust as needed):

```
DB_USER=postgres
DB_HOST=localhost
DB_NAME=mr_creams_db
DB_PASSWORD=Admin@123
DB_PORT=5432
PORT=5001
```

### Step 3: Frontend Setup

```bash
cd frontend
npm install
```

## Running the Application

### Start the Backend Server

```bash
cd backend
npm run dev
```

The API server will start on http://localhost:5001

### Start the Frontend Development Server

```bash
cd frontend
npm start
```

The frontend development server will start on http://localhost:3000

## Features

### Core Relationship Intelligence
- **Emotion Analysis**: Deep insights into emotional patterns and relationship dynamics
- **Smart Conflict Resolution**: Intelligent analysis of relationship experiences
- **Healing Guidance**: Personalized recommendations for relationship growth
- **Emotional Intelligence**: Track and understand emotional triggers and responses

### Advanced Analytics
- **Relationship Insights**: Comprehensive analysis of communication patterns
- **Emotion Tracking**: Monitor emotional intensity and resolution times
- **Pattern Recognition**: Identify common triggers and successful resolution strategies
- **Progress Monitoring**: Track relationship growth and healing progress

### User Experience
- **Responsive Design**: Seamless experience across desktop and mobile devices
- **Empathetic Interface**: Warm, healing-focused design with emotional intelligence colors
- **Smart Navigation**: Intuitive interface designed for relationship healing

### Theme Customization

MR.CREAMS includes an empathetic theme system that allows users to:

- Toggle between light and dark modes for comfort
- Select from healing-focused color palettes (Empathetic Blue, Warm Teal, Gentle Purple, etc.)
- Enjoy a responsive and emotionally supportive UI with dynamic background decorations
- Experience colors designed for emotional well-being and relationship healing

The theme settings can be accessed through the gear icon in the application header.

## Usage

### Dashboard

The dashboard provides an overview of conflict statistics and recent conflicts. From here, you can:

- View total conflicts, average intensity, average duration, and top reason
- Access recent conflicts with quick navigation to details
- Get quick tips for conflict resolution

### Managing Conflicts

1. **View Conflicts**: Navigate to the Conflict List page to see all recorded conflicts
2. **Add New Conflict**: Click the "Add Conflict" button to record a new conflict
3. **Edit Conflict**: Use the edit button in the Actions column to modify existing conflicts

### Analytics

The Analytics page provides visual representations of your conflict data, helping you identify patterns and trends over time.

### Recommendations

The Recommendations page offers personalized suggestions based on your conflict history to improve communication and relationship health.

## Troubleshooting

### Database Connection Issues

If you encounter database connection errors:

1. Verify PostgreSQL is running: `pg_isready`
2. Check your database credentials in the `.env` file
3. Ensure the database has been properly initialized with the setup script

### Port Already in Use

If you see "Something is already running on port 3000" or similar:

1. Find the process: `lsof -i :3000` (macOS/Linux) or `netstat -ano | findstr :3000` (Windows)
2. Terminate the process or change the port in the `.env` file

## License

MIT