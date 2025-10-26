# PaxForm - Dynamic Form Builder

A full-stack form builder application with React frontend and Laravel backend.

## Development Setup

### Prerequisites
- Node.js 18+
- PHP 8.2+
- Composer 2.0+
- Docker & Docker Compose
- MySQL 8.0+

### Backend Setup

1. Navigate to the project root:
   ```bash
   cd paxform
   ```

2. Copy the environment file and generate application key:
   ```bash
   copy .env.example .env
   php artisan key:generate
   ```

3. Install PHP dependencies:
   ```bash
   composer install
   ```

4. Start the database container:
   ```bash
   docker-compose up -d db
   ```

5. Run database migrations:
   ```bash
   php artisan migrate
   ```

6. Start the Laravel development server:
   ```bash
   php artisan serve
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

## Running in Production

1. Build and start all services:
   ```bash
   docker-compose up -d --build
   ```

2. Run database migrations:
   ```bash
   docker-compose exec php php artisan migrate --force
   ```

3. The application will be available at:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000

## Project Structure

- `frontend/` - React application
- `backend/` - Laravel API
- `docker/` - Docker configuration files
- `docs/` - Project documentation

## Development Workflow

- Frontend: Uses Vite dev server with hot module replacement
- Backend: Uses Laravel's built-in development server
- Database: Runs in a Docker container for consistency

## License

This project is proprietary and confidential.
