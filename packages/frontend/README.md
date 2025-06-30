This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Project Structure

```
packages/frontend/
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # Shared/common components
│   │   ├── ui/          # Base UI components
│   │   └── widgets/     # Complex reusable components
│   ├── features/        # Feature-based modules
│   │   ├── bill/        # Bill feature
│   │   ├── dashboard/   # Dashboard feature
│   │   ├── kios/        # Kios feature
│   │   └── user/        # User management feature
│   ├── lib/             # Utility libraries
│   └── utils/          # Helper functions
```

## Features

### 1. Bill Feature

**Location**: `src/features/bill/`

- Main component for handling bill generation and display
- Uses JetBrains Mono font for better readability
- Implements printing functionality
- Handles VAT information and detailed pricing

Key Components:

- `Bill`: Main component for bill display
- Features:
  - Booking details display
  - Price calculations
  - VAT information handling
  - Print functionality

### 2. Dashboard Feature

**Location**: `src/features/dashboard/`

- Administrative dashboard interface
- Entry point for admin functionalities

### 3. User Management Feature

**Location**: `src/features/user/`

- User management functionality
- Includes user creation form

### 4. Kios Feature

**Location**: `src/features/kios/`

- Kiosk management system
- Form-based interface for kiosk operations

## Development Guidelines

### Coding Standards

1. Use TypeScript for type safety
2. Follow React best practices and hooks patterns
3. Implement accessibility features
4. Use TailwindCSS for styling
5. Follow component-based architecture
6. Implement proper error handling
7. Use proper naming conventions (e.g., handleEvent for event handlers)

### Component Structure

- Use functional components with TypeScript
- Implement proper prop typing
- Use React.forwardRef when needed
- Follow the feature-based architecture pattern

### State Management

- Use React hooks for local state
- Implement proper state management patterns
- Handle side effects with useEffect

### Accessibility

- Implement ARIA labels
- Ensure keyboard navigation
- Follow accessibility best practices
