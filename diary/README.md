# AI-Powered Diary Application

A full-stack journaling application with AI-powered suggestions, mood tracking, and theme customization.

## Features

- **User Authentication**: Secure signup and login with JWT-based authentication
- **Diary Entries**: Create and view journal entries with title and content
- **Mood Tracking**: Select multiple moods for each entry to track emotional patterns
- **AI Suggestions**: Get personalized suggestions based on your entry content
- **Theme Customization**: Choose from multiple themes to personalize your experience
- **Entry History**: Browse and view all your previous journal entries
- **Secure Storage**: All data encrypted and securely stored in SQLite database

## Tech Stack

- **Frontend**: React 19, React Router
- **Backend**: Express.js
- **Database**: SQLite (better-sqlite3)
- **Authentication**: JWT with bcrypt password hashing
- **Testing**: Jest, React Testing Library
- **Containerization**: Docker & Docker Compose

## Project Structure

```
src/
├── App.js                    # Main application component
├── AuthContext.js            # Authentication context provider
├── DiaryPage.js             # Create diary entry page
├── EntryPage.js             # View entries page
├── MoodSelector.js          # Mood selection component
├── SuggestionsPopup.js      # AI suggestions popup
├── DiaryStorage.js          # API client for diary operations
├── backend/                 # Express.js backend
│   ├── index.js            # Server entry point
│   ├── controllers/        # Request handlers
│   ├── services/           # Business logic
│   ├── repositories/       # Data access layer
│   ├── models/             # Data models
│   ├── routes/             # API routes
│   └── database/           # Database setup & migrations
└── tests/                  # Test suite (unit & integration)
```

## Getting Started

### Prerequisites
- Node.js 16+ (for local development)
- Docker & Docker Compose (for containerized setup)

### Local Development

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Setup database**
   ```bash
   npm run db:create
   ```

3. **Start backend server** (in one terminal)
   ```bash
   npm run start:backend
   ```

4. **Start React frontend** (in another terminal)
   ```bash
   npm start
   ```

   The app will open at [http://localhost:3000](http://localhost:3000)

### Docker Setup

For complete setup instructions using Docker, see [DOCKER_SETUP.md](DOCKER_SETUP.md).

```bash
docker-compose up --build
```

Access the application at [http://localhost:5000](http://localhost:5000)

## Available Scripts

### Frontend
- `npm start` - Start development server (React)
- `npm build` - Create production build
- `npm test` - Run frontend tests in watch mode

### Backend
- `npm run start:backend` - Start Express server
- `npm run db:create` - Initialize database
- `npm run test:backend` - Run backend tests
- `npm run test:backend:coverage` - Run tests with coverage report

## API Endpoints

- **Auth**: `POST /auth/signup`, `POST /auth/login`, `POST /auth/logout`
- **Entries**: `GET /entries`, `POST /entries`, `GET /entries/:id`, `PUT /entries/:id`, `DELETE /entries/:id`
- **Moods**: `GET /moods`
- **Suggestions**: `GET /suggestions/:entryId`

## Environment Variables

- `NODE_ENV` - Application environment (development/production)
- `PORT` - Backend server port (default: 5000)
- `JWT_SECRET` - Secret key for JWT signing
- `JWT_EXPIRY` - Token expiration time (default: 7d)
- `CORS_ORIGIN` - CORS origin for cross-origin requests

## Testing

Run the complete test suite:
```bash
npm run test:backend:coverage
```

The project includes comprehensive unit and integration tests for all components.
