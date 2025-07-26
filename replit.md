# MuseMood - AI-Powered Aesthetic Generator

## Overview

MuseMood is a full-stack web application that transforms user emotions into complete aesthetic experiences. Users can select or describe their mood, write a journal entry, and receive AI-generated content including outfits, moodboards, poems, and playlists. The application features a modern, girly aesthetic with a purple/pink gradient design and smooth animations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **UI Framework**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: React useState for local state, TanStack Query for server state
- **Build Tool**: Vite with TypeScript support

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API**: RESTful endpoints for mood generation
- **Development**: TSX for TypeScript execution in development

### Data Storage Solutions
- **Database**: PostgreSQL (configured via Drizzle)
- **ORM**: Drizzle ORM with type-safe schema definitions
- **Session Storage**: PostgreSQL-backed session storage via connect-pg-simple
- **Database Provider**: Neon serverless PostgreSQL
- **Authentication**: Google OAuth 2.0 with Passport.js

## Key Components

### Frontend Components
1. **Pages**:
   - Landing page with animated hero section
   - Mood selector with emoji-based mood selection
   - Journal entry form for user input
   - Results page displaying generated content
   - User profile page with session history
   - Session sharing and viewing functionality

2. **UI Components**:
   - Authentication button with Google login/logout
   - Outfit card with AI-generated fashion descriptions and images
   - Moodboard card with aesthetic elements and color schemes
   - Poem card with generated poetry
   - Playlist card with curated music recommendations
   - Floating navigation for seamless user experience

3. **Styling Features**:
   - Enhanced glassmorphism effects with improved visibility
   - Dark purple to lavender gradient background
   - High-contrast text for accessibility
   - Animated sparkle particles background
   - Gradient hover effects and pulse animations
   - Responsive design with mobile-first approach

### Backend Services
1. **OpenAI Integration**:
   - GPT-4o for text generation (outfits, poems, playlists)
   - DALL-E integration for outfit image generation
   - Structured JSON responses for consistent data formats

2. **API Endpoints**:
   - `/api/generate-aesthetic` - Main generation endpoint
   - Parallel processing of multiple AI requests for performance

3. **Data Models**:
   - User schema with authentication fields
   - Mood session schema storing complete aesthetic generations
   - JSON fields for storing complex generated content

## Data Flow

1. **User Journey**:
   - User selects mood from predefined options or enters custom mood
   - User writes journal entry describing their feelings
   - Frontend sends mood data to backend generation endpoint
   - Backend processes request through multiple AI services in parallel
   - Generated content is returned and displayed in organized cards

2. **AI Generation Pipeline**:
   - Outfit generation with style name, description, color palette, and image prompt
   - Moodboard creation with themes, elements, and aesthetic tags
   - Poem generation with mood-appropriate content
   - Playlist curation with artist, song, and duration information
   - Image generation for outfit visualization

3. **State Management**:
   - App-level state for user selections and generated content
   - Query caching for API responses
   - Local storage for session persistence

## External Dependencies

### AI Services
- **OpenAI API**: Core AI generation service for text and image content
- API key required via environment variables
- GPT-4o model for text generation
- DALL-E for image generation

### UI Libraries
- **Radix UI**: Accessible component primitives
- **Lucide React**: Icon library
- **React Icons**: Additional icons (Spotify, etc.)
- **TailwindCSS**: Utility-first CSS framework

### Development Tools
- **Vite**: Fast build tool with HMR
- **TypeScript**: Type safety across the stack
- **ESBuild**: Fast bundling for production
- **Replit Integration**: Development environment optimization

## Deployment Strategy

### Build Process
- Frontend builds to `dist/public` directory
- Backend builds to `dist` directory with ESBuild
- Static asset serving through Express in production

### Environment Configuration
- Development: TSX with Vite dev server
- Production: Compiled JavaScript with static file serving
- Database URL configuration via environment variables
- OpenAI API key configuration required

### Performance Optimizations
- Parallel AI request processing
- Query caching with TanStack Query
- Static asset optimization
- Responsive image loading
- Lazy loading for non-critical components

The application follows a modern full-stack architecture with clear separation of concerns, type safety throughout, and optimized user experience with smooth animations and responsive design.