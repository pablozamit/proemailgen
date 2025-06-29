# Email Generator Pro - Project Overview

## Overview

This is a professional email generation application built with modern web technologies. The application allows users to create compelling email content using AI-powered copywriting techniques, with support for different copywriter styles and email types. The app features a React frontend with a Node.js/Express backend, utilizing OpenAI's GPT-4 for content generation.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS with Shadcn/ui component library
- **State Management**: React Query (@tanstack/react-query) for server state
- **Form Handling**: React Hook Form with Zod validation
- **Routing**: Wouter for client-side routing
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints with JSON responses
- **Database**: PostgreSQL with Drizzle ORM
- **AI Integration**: OpenAI GPT-4 for email content generation

### Database Design
- Uses Drizzle ORM with PostgreSQL
- Schema definitions in TypeScript with Zod validation
- Database migrations managed through Drizzle Kit
- Connection via Neon Database serverless adapter

## Key Components

### Frontend Components
1. **EmailGeneratorForm**: Main form for collecting email generation parameters
2. **EmailPreview**: Displays generated email content with copy functionality
3. **UI Components**: Comprehensive Shadcn/ui component library implementation

### Backend Services
1. **OpenAI Service**: Handles AI-powered email generation with copywriter style support
2. **Storage Service**: In-memory storage implementation (ready for database integration)
3. **Route Handlers**: Express endpoints for API functionality

### Shared Schema
- Centralized TypeScript types and Zod schemas
- Email generation request/response validation
- User management schemas (prepared for future auth)

## Data Flow

1. **User Input**: User fills out email generation form with product details, tone, and style preferences
2. **Validation**: Form data validated using Zod schemas on both client and server
3. **AI Processing**: Backend sends structured prompt to OpenAI GPT-4 with copywriter style instructions
4. **Response Processing**: AI-generated content parsed and validated before returning to client
5. **Preview Display**: Generated email displayed with metrics (word count, reading time, conversion score)
6. **Copy Functionality**: Users can copy complete email content to clipboard

## External Dependencies

### Core Dependencies
- **OpenAI**: GPT-4 integration for content generation
- **Neon Database**: Serverless PostgreSQL hosting
- **Radix UI**: Accessible component primitives
- **Drizzle ORM**: Type-safe database operations

### Development Tools
- **Vite**: Fast development server and build tool
- **TypeScript**: Type safety across the stack
- **ESBuild**: Backend bundling for production
- **Tailwind CSS**: Utility-first styling

## Deployment Strategy

### Development Environment
- Vite dev server for frontend with HMR
- TSX for backend development with auto-reload
- Environment variables for API keys and database connections

### Production Build Process
1. Frontend: Vite build generates optimized static assets
2. Backend: ESBuild bundles server code with external dependencies
3. Static files served from Express in production mode

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `GEMINI_API_KEY`: Google Gemini AI API access (primary)
- `OPENAI_API_KEY` or `OPENAI_KEY`: OpenAI API access (optional alternative)
- `NODE_ENV`: Environment specification

## Changelog

```
Changelog:
- June 29, 2025. Initial setup
- June 29, 2025. Migrated from OpenAI to Gemini AI for cost efficiency
- June 29, 2025. Added multi-provider AI support (Gemini + OpenAI)
- June 29, 2025. Implemented PostgreSQL database with Drizzle ORM
- June 29, 2025. Added comprehensive data models for clients, products, and copywriters
- June 29, 2025. Created backend APIs for full CRUD operations
- June 29, 2025. Designed admin panels for client/product/copywriter management
- June 29, 2025. Populated database with 5 professional copywriter profiles
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```