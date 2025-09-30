# Overview

ExamPilot is a modern Computer-Based Testing (CBT) platform designed for educational institutions. The system provides separate portals for administrators and students to manage and take online examinations. Administrators can create and manage questions, courses, and view student performance analytics. Students can register, take tests, and view their results. The platform features a clean, responsive UI built with modern web technologies and includes session-based authentication, real-time test timing, and comprehensive result tracking.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Problem**: Need for a modern, responsive user interface with real-time updates and smooth user experience.

**Solution**: React-based single-page application using Vite as the build tool and development server. The UI is built with Tailwind CSS for styling and shadcn/ui components based on Radix UI primitives for accessible, pre-built components.

**Key decisions**:
- Wouter for lightweight client-side routing instead of React Router
- TanStack Query for server state management and data fetching with automatic caching
- React Hook Form with Zod for type-safe form validation
- Separate component structure for admin and student portals

**Pros**: Fast development, excellent developer experience, type safety, accessible components out of the box.

**Cons**: Increased bundle size due to multiple UI libraries, requires understanding of multiple state management patterns.

## Backend Architecture

**Problem**: Need for a scalable API server with session management and database operations.

**Solution**: Express.js server with TypeScript in ES module format. The server uses session-based authentication with PostgreSQL for session storage and implements RESTful API endpoints.

**Key decisions**:
- ES modules instead of CommonJS for modern JavaScript features
- Session-based authentication using express-session and connect-pg-simple
- Dual authentication system supporting both admin and student users
- Middleware-based route protection for authenticated endpoints

**Pros**: Simple session management, type safety with TypeScript, scalable session storage in database.

**Cons**: Sessions require database queries, potential performance impact at scale.

## Database Design

**Problem**: Need for relational data storage with type safety and easy migrations.

**Solution**: PostgreSQL database accessed through Drizzle ORM with schema-first design approach.

**Schema structure**:
- Admin and student user tables with separate authentication
- Courses table for organizing questions
- Questions table with multiple-choice options (A, B, C, D)
- Test attempts table tracking student tests with scores and timestamps
- Test answers table storing individual question responses
- Sessions table for authentication state

**Key decisions**:
- UUID primary keys for all entities
- Drizzle ORM for type-safe database queries
- Support for both Neon serverless and standard PostgreSQL
- Timestamps for audit trails

**Pros**: Type-safe database operations, easy schema migrations with drizzle-kit, supports multiple database providers.

**Cons**: ORM abstraction layer adds complexity, requires understanding of Drizzle query builder.

## Authentication System

**Problem**: Need to support two separate user types with secure authentication.

**Solution**: Session-based authentication with PostgreSQL storage and bcrypt password hashing.

**Key decisions**:
- Separate login endpoints and sessions for admins and students
- Session data stored in PostgreSQL with 7-day TTL
- Password hashing with bcrypt (10 rounds)
- HttpOnly cookies for session management
- Session validation middleware for protected routes

**Alternatives considered**: JWT tokens were considered but sessions chosen for simplicity and built-in revocation.

**Pros**: Simple to implement, easy session revocation, secure cookie storage.

**Cons**: Requires database queries for each authenticated request, doesn't scale horizontally without session store configuration.

## Test Management

**Problem**: Need to deliver timed tests with automatic grading and result storage.

**Solution**: React-based test interface with client-side timer, API-based answer submission, and automatic grading.

**Key decisions**:
- Client-side countdown timer with automatic submission
- Single question per page navigation
- Immediate grading upon submission
- Storage of both correct answers and student responses
- Score calculation based on correct answer matching

**Pros**: Simple grading logic, complete audit trail of answers, good user experience.

**Cons**: Client-side timer can be manipulated, no question randomization currently implemented.

## Development Setup

**Problem**: Need for efficient development workflow with hot reloading and type checking.

**Solution**: Vite development server for frontend with TypeScript compilation and Express server for backend.

**Key decisions**:
- Concurrent frontend and backend development
- TypeScript with strict mode enabled
- Path aliases for cleaner imports (@/, @shared/)
- Separate build processes for client and server
- Environment-based configuration

**Pros**: Fast HMR, type safety during development, clear separation of concerns.

**Cons**: Requires understanding of build tools, complex configuration for production deployment.

# External Dependencies

## Frontend Dependencies

- **React 18**: Core UI library with concurrent features and modern hooks
- **Vite**: Build tool providing fast HMR and optimized production builds
- **TanStack Query v5**: Server state management with automatic caching and refetching
- **Wouter**: Minimalist routing library (lightweight alternative to React Router)
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **shadcn/ui**: Collection of re-usable components built on Radix UI
- **Radix UI**: Headless UI component primitives for accessibility
- **React Hook Form**: Performant form library with built-in validation
- **Zod**: TypeScript-first schema validation
- **date-fns**: Modern date utility library
- **lucide-react**: Icon library with tree-shaking support

## Backend Dependencies

- **Express.js**: Web application framework for Node.js
- **Drizzle ORM**: TypeScript ORM for SQL databases
- **@neondatabase/serverless**: Neon PostgreSQL serverless driver
- **pg**: PostgreSQL client for Node.js
- **express-session**: Session middleware for Express
- **connect-pg-simple**: PostgreSQL session store adapter
- **bcrypt**: Password hashing library
- **ws**: WebSocket library (required for Neon serverless)
- **tsx**: TypeScript execution engine for development
- **esbuild**: JavaScript bundler for production builds

## Database

- **PostgreSQL**: Primary relational database (via Neon serverless or standard PostgreSQL)
- **Drizzle Kit**: CLI tool for schema migrations and database management

## Build Tools

- **TypeScript**: Static type checking and compilation
- **Vite**: Frontend build tool and dev server
- **esbuild**: Fast JavaScript/TypeScript bundler for backend
- **PostCSS**: CSS transformation with Tailwind CSS plugin
- **Autoprefixer**: Automatic vendor prefix addition for CSS