# TaskFlow - Task Management Application

## Overview
A full-stack task management application built with React and Express.js featuring complete CRUD operations, user authentication, and PostgreSQL database integration. Users can create accounts, log in, and manage their personal tasks with features like priority settings, due dates, and task filtering.

## Tech Stack
- **Frontend**: React with TypeScript, Tailwind CSS, shadcn/ui components
- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Session-based authentication with bcrypt password hashing
- **State Management**: TanStack Query for server state
- **Routing**: Wouter for client-side routing

## Recent Changes
- **2025-01-26**: Added complete user authentication system
  - Implemented user registration and login pages
  - Added session-based authentication with PostgreSQL session store
  - Protected all task routes with authentication middleware
  - Updated task schema to include userId foreign key
  - Added user profile display with logout functionality

## Project Architecture

### Database Schema
- **users**: id, username, email, password (hashed), firstName, lastName, createdAt, updatedAt
- **tasks**: id, title, description, priority, dueDate, completed, userId (FK), createdAt, updatedAt
- **session**: PostgreSQL session store for user authentication

### Authentication Flow
1. Users can register with username, email, password, and optional name fields
2. Login creates a server-side session stored in PostgreSQL
3. All task endpoints require authentication via session middleware
4. Tasks are user-scoped - users only see their own tasks

### Key Features
- User registration and login with form validation
- Password security with bcrypt hashing
- Session-based authentication with PostgreSQL storage
- Personal task management with CRUD operations
- Task statistics dashboard (total, completed, pending, overdue)
- Task filtering and sorting capabilities
- Responsive design with mobile support

## User Preferences
- Clean, modern UI with blue color scheme
- Professional task management interface
- Secure authentication implementation
- Real-time updates with optimistic UI patterns