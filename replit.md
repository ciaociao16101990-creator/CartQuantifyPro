# Package Cart Management System

## Overview

This is a Package Cart Management System designed for tracking flower packages in carts for inventory management. The application enables workers to create carts, add packages with variety and length specifications, track package counts in real-time, and export completed cart data to Excel. It's built as a mobile-first Progressive Web App optimized for warehouse/distribution center use.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool

**UI Component System**: shadcn/ui (Radix UI primitives) with Tailwind CSS following Material Design principles for a data-intensive utility interface

**State Management**: 
- TanStack Query (React Query) for server state management and caching
- Local React state for form inputs and UI interactions
- No global state management library - relies on server-side state as source of truth

**Routing**: Wouter for lightweight client-side routing (single-page application with minimal routes)

**Design System**:
- Typography: Inter font family (Google Fonts)
- Spacing: Tailwind utility units (2, 4, 6, 8, 12)
- Color scheme: Neutral base with HSL color variables for theming
- Mobile-first responsive design with sticky positioning for critical UI elements
- Visual feedback system: Color-coded progress indicators (green < 60 packages, amber 60-71, green = 72)

### Backend Architecture

**Server Framework**: Express.js with TypeScript

**API Design**: RESTful JSON API with the following endpoints:
- `GET /api/carts` - Retrieve all carts with their packages
- `GET /api/carts/:id` - Retrieve single cart with packages
- `POST /api/carts` - Create new cart
- `POST /api/packages` - Add package to cart
- `PUT /api/packages/:id` - Update package details
- `DELETE /api/packages/:id` - Remove package from cart

**Data Layer**: 
- Drizzle ORM for type-safe database operations
- Schema-first approach with Zod validation
- Relations defined between carts and packages (one-to-many)

**Database Schema**:
- `carts` table: Stores cart metadata (cart number, destination, tag, bucket type, package counts, completion status)
- `packages` table: Stores individual packages (variety, length, quantity) with foreign key to cart
- Uses PostgreSQL dialect (Neon serverless connector)

**Development Mode**: Vite middleware integration for HMR and development server

### Data Storage Solutions

**Database**: PostgreSQL (via Neon serverless)
- Connection pooling with WebSocket support
- Environment-based connection string (`DATABASE_URL`)
- Migration system using Drizzle Kit

**Schema Design Decisions**:
- UUIDs for primary keys (generated via `gen_random_uuid()`)
- Timestamps for audit trail (createdAt, completedAt)
- Integer flag for completion status (0/1 instead of boolean for broader SQL compatibility)
- Cascade deletion from carts to packages to maintain referential integrity
- Default values for package limits (72 packages per cart)

**In-Memory Fallback**: MemStorage class provides complete storage interface for development/testing without database

### Authentication and Authorization

**Current State**: No authentication system implemented - designed for internal warehouse use on trusted network

**Future Consideration**: The architecture would support session-based authentication via express-session with PostgreSQL session store (connect-pg-simple dependency present)

## External Dependencies

### Core Production Dependencies

**Database & ORM**:
- `drizzle-orm` - Type-safe ORM with PostgreSQL support
- `@neondatabase/serverless` - Serverless PostgreSQL connector
- `drizzle-zod` - Zod schema generation from Drizzle schemas
- `connect-pg-simple` - PostgreSQL session store (not currently active)

**UI Component Libraries**:
- `@radix-ui/*` (20+ components) - Accessible, unstyled UI primitives
- `tailwindcss` - Utility-first CSS framework
- `class-variance-authority` - Type-safe variant API for components
- `lucide-react` - Icon library

**Form Handling & Validation**:
- `react-hook-form` - Form state management
- `@hookform/resolvers` - Validation resolver library
- `zod` - TypeScript-first schema validation

**Data Export**:
- `xlsx` - Excel file generation for cart data export

**Date Handling**:
- `date-fns` - Date utility library

**State Management**:
- `@tanstack/react-query` - Server state management and caching

**Carousel/Interactive Components**:
- `embla-carousel-react` - Carousel implementation
- `cmdk` - Command menu component

### Development Dependencies

**Build Tools**:
- `vite` - Frontend build tool and dev server
- `esbuild` - JavaScript bundler for production backend
- `tsx` - TypeScript execution for development

**Replit-Specific Plugins**:
- `@replit/vite-plugin-runtime-error-modal` - Error overlay
- `@replit/vite-plugin-cartographer` - Development tooling
- `@replit/vite-plugin-dev-banner` - Development banner

### Third-Party Service Integrations

**Fonts**: Google Fonts (Inter font family via CDN)

**Database Hosting**: Neon serverless PostgreSQL (connection via DATABASE_URL environment variable)

**No External APIs**: Application is self-contained with no external service dependencies for core functionality