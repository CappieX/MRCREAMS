# MR.CREAMS Technical Documentation

## System Architecture

MR.CREAMS is built using a modern microservices architecture with the following components:

- **Frontend**: React.js with Material UI
- **Backend**: Node.js with Express
- **Database**: PostgreSQL
- **Caching**: Redis
- **Monitoring**: Prometheus and Grafana
- **Containerization**: Docker and Docker Compose
- **CI/CD**: GitHub Actions

## Development Environment Setup

### Prerequisites

- Node.js 16+
- Docker and Docker Compose
- Git

### Local Development

1. Clone the repository
```bash
git clone https://github.com/your-org/mrcreams.git
cd mrcreams
```

2. Install dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. Start development servers
```bash
# Backend
cd backend
npm run dev

# Frontend
cd ../frontend
npm start
```

## API Documentation

The backend exposes RESTful APIs with the following main endpoints:

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `POST /api/auth/professional-login` - Professional login
- `POST /api/auth/verify-token` - Verify JWT token
- `POST /api/auth/logout` - Logout user

### Users

- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (admin only)

### Support Tickets

- `GET /api/tickets` - Get all tickets
- `GET /api/tickets/:id` - Get ticket by ID
- `POST /api/tickets` - Create new ticket
- `PUT /api/tickets/:id` - Update ticket
- `DELETE /api/tickets/:id` - Delete ticket

## Database Schema

The application uses PostgreSQL with the following main tables:

- `users` - User accounts
- `organizations` - Organization information
- `tickets` - Support tickets
- `ticket_activities` - Ticket activity logs
- `sessions` - Therapy sessions
- `conflicts` - Relationship conflicts
- `recommendations` - AI-generated recommendations

## Frontend Architecture

The frontend is built with React and follows a component-based architecture:

- **Pages**: Main views of the application
- **Components**: Reusable UI elements
- **Context**: Global state management
- **Utils**: Utility functions
- **Services**: API service layer
- **Hooks**: Custom React hooks

### Key Features

- **PWA Support**: Service worker for offline capabilities
- **Responsive Design**: Mobile-first approach
- **Performance Optimizations**: Code splitting, lazy loading
- **Accessibility**: WCAG 2.1 AA compliant

## Testing

### Backend Testing

- **Unit Tests**: Jest for testing individual functions
- **Integration Tests**: Supertest for API endpoint testing
- **Security Tests**: Tests for authentication and authorization

### Frontend Testing

- **Component Tests**: React Testing Library for component testing
- **E2E Tests**: Cypress for end-to-end testing
- **Accessibility Tests**: Axe for accessibility testing

## Deployment

The application is deployed using Docker containers orchestrated with Docker Compose:

- **Backend Container**: Node.js application
- **Frontend Container**: Nginx serving React static files
- **Database Container**: PostgreSQL
- **Redis Container**: For caching
- **Monitoring Containers**: Prometheus, Grafana, Node Exporter, cAdvisor

## CI/CD Pipeline

GitHub Actions workflows automate the following:

### Backend Pipeline

1. Install dependencies
2. Run linting
3. Run tests
4. Build Docker image
5. Push to Docker Hub
6. Deploy to production

### Frontend Pipeline

1. Install dependencies
2. Run linting
3. Run tests
4. Build production assets
5. Build Docker image
6. Push to Docker Hub
7. Deploy to production

## Security Measures

- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Different access levels based on user roles
- **Input Validation**: Server-side validation of all inputs
- **HTTPS**: All communications encrypted
- **Content Security Policy**: Prevents XSS attacks
- **Rate Limiting**: Prevents brute force attacks
- **Secure Headers**: X-Frame-Options, X-XSS-Protection, etc.

## Monitoring and Logging

- **Prometheus**: Metrics collection
- **Grafana**: Visualization dashboards
- **Node Exporter**: Host metrics
- **cAdvisor**: Container metrics

## Performance Optimizations

- **Redis Caching**: Frequently accessed data cached in Redis
- **Database Indexing**: Optimized queries with proper indexes
- **Code Splitting**: Lazy loading of React components
- **Image Optimization**: WebP format and lazy loading
- **Gzip Compression**: Reduces payload size

## Maintenance Procedures

### Database Backups

Automated daily backups to secure cloud storage.

### System Updates

1. Pull latest code from repository
2. Run database migrations
3. Rebuild and restart containers

### Troubleshooting

Common issues and their solutions:

- **API Connection Issues**: Check network settings and firewall rules
- **Database Connection Failures**: Verify credentials and network access
- **Performance Degradation**: Check monitoring dashboards for bottlenecks

## Support and Contact

For technical support, contact the development team at:
- Email: dev@mrcreams.example.com
- Internal Ticket System: https://support.mrcreams.example.com