# Overview

This is a modern Computer-Based Testing (CBT) platform built with React and Express.js. The system provides separate portals for administrators and students to manage and take online examinations. Administrators can create courses, manage questions, and track student performance, while students can take tests and view their results. The platform features authentication, session management, real-time test taking with timers, and comprehensive result tracking.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client is built with React and TypeScript using Vite as the build tool. The UI framework is Tailwind CSS with shadcn/ui components for consistent design. The application uses Wouter for client-side routing and TanStack Query for state management and API communication. The frontend follows a component-based architecture with separate pages for admin and student portals.

## Backend Architecture
The server uses Express.js with TypeScript in ES module format. It implements session-based authentication using express-session with PostgreSQL storage. The API follows RESTful conventions with separate route handlers for admin and student operations. Middleware handles logging, error handling, and authentication requirements.

## Database Design
The system uses PostgreSQL with Drizzle ORM for type-safe database operations. The schema includes tables for admins, students, courses, questions, test attempts, test answers, and session storage. Foreign key relationships maintain data integrity between entities. Password hashing is implemented using bcrypt for security.

## Authentication System
Dual authentication system supports both admin and student users with separate login flows. Session-based authentication uses PostgreSQL for session storage with configurable TTL. Middleware functions protect routes based on user type (admin/student). Frontend components use React Query for authentication state management.

## Test Management
Questions are organized by courses with multiple choice format (A, B, C, D options). Each question has difficulty levels and is linked to specific courses. Test attempts are tracked with timestamps, scores, and individual answer records. Real-time testing interface includes countdown timers and answer validation.

## Development Setup
Development server runs both frontend and backend concurrently. Vite handles hot module replacement for the React frontend. The backend serves the built frontend in production mode. TypeScript compilation and type checking are configured across the entire codebase.

# External Dependencies

## Frontend Dependencies
- **React 18**: Core UI library with hooks and modern features
- **Vite**: Fast build tool and development server
- **TanStack Query**: Server state management and data fetching
- **Wouter**: Lightweight client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Pre-built accessible UI components
- **Radix UI**: Headless UI primitives for complex components
- **React Hook Form**: Form state management with validation
- **Zod**: Schema validation for type safety

## Backend Dependencies
- **Express.js**: Web application framework
- **PostgreSQL**: Primary database via Neon serverless
- **Drizzle ORM**: Type-safe database operations
- **express-session**: Session management middleware
- **connect-pg-simple**: PostgreSQL session store
- **bcrypt**: Password hashing and verification
- **cors**: Cross-origin resource sharing
- **TypeScript**: Static type checking

## Development Tools
- **tsx**: TypeScript execution for Node.js
- **esbuild**: Fast JavaScript bundler for production
- **Replit plugins**: Development environment integration
- **PostCSS**: CSS processing with Tailwind
- **ESLint/Prettier**: Code linting and formatting