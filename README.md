# Monorepo Project Overview

This is a full-stack monorepo project built with SST (Serverless Stack) v3, combining a Next.js frontend and a NestJS backend. The project is structured to facilitate development, testing, and deployment of both frontend and backend components in a unified workflow.

## Project Structure

The project follows a monorepo architecture using npm workspaces:

- **packages/frontend**: Next.js application (v15.2.0)
- **packages/backend**: NestJS application (v11.0.1)
- **packages/core**: Shared code and utilities
- **infra/**: Infrastructure configuration using SST

## Getting Started

### Prerequisites

- Node.js v22.1.0 (see `.nvmrc`)
- pnpm (recommended) or npm

### Installation

1. Clone the repository:

```bash
git clone <REPO_URL> my-project
cd my-project
```

2. Install dependencies:

```bash
pnpm install
# or
npm install
```

### Development

To start the development environment:

```bash
# Start SST development environment
pnpm dev
# or
npm run dev
```

For frontend-only development:

```bash
cd packages/frontend
pnpm dev
# or
npm run dev
```

For backend-only development:

```bash
cd packages/backend
pnpm start:dev
# or
npm run start:dev
```

### Building and Deployment

To build the project:

```bash
pnpm build
# or
npm run build
```

To deploy to AWS:

```bash
pnpm deploy
# or
npm run deploy
```

## Infrastructure

The project uses SST to define and deploy infrastructure:

- **nextjs.ts**: Configures the Next.js frontend deployment
- **nestjs.ts**: Configures the NestJS backend deployment with VPC and load balancer
- **storage.ts**: Defines S3 bucket resources
- **api.ts**: Configures API functions

## Shared Code

The `packages/core` directory contains shared code that can be used across packages. Import shared modules using:

```typescript
import { Example } from "@langfarm-ticket/core/example";

Example.hello(); // Returns "Hello, world!"
```

## Environment Variables

Environment variables are managed through SST and can be accessed in your code. Local development environment variables should be placed in `.env.local` files (which are gitignored).

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Additional Resources

- [SST Documentation](https://sst.dev/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [NestJS Documentation](https://docs.nestjs.com)
