# Backend Documentation

## Project Overview

This is a NestJS-based backend service for the Langfarm Ticket system. The project uses TypeScript and follows NestJS's modular architecture.

## Tech Stack

- **Framework**: NestJS v11
- **Language**: TypeScript
- **Database**:
  - MongoDB (via Mongoose)
  - PostgreSQL (via TypeORM)
- **Authentication**: AWS Cognito
- **Message Queue**: AWS SQS
- **Email Service**: SparkPost

## Project Structure

```
src/
├── main.ts              # Application entry point
├── app.module.ts        # Root application module
├── app.controller.ts    # Root controller
├── app.service.ts       # Root service
├── config/             # Configuration files and environment variables
│   ├── database.config.ts
│   └── aws.config.ts
├── constants/          # Application constants
│   ├── common.constant.ts
│   └── error.constant.ts
├── decorators/        # Custom decorators
│   └── auth.decorator.ts
├── enums/             # TypeScript enums
│   ├── order.enum.ts
│   └── payment.enum.ts
├── lib/               # Shared libraries
│   ├── aws/          # AWS integrations (Cognito, SQS)
│   └── sparkpost/    # Email service integration
├── modules/           # Feature modules
│   ├── auth/         # Authentication module
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   └── auth.service.ts
│   ├── order/        # Order management
│   │   ├── order.module.ts
│   │   ├── order.controller.ts
│   │   ├── order.service.ts
│   │   └── schemas/
│   ├── payment/      # Payment processing
│   │   ├── payment.module.ts
│   │   ├── payment.controller.ts
│   │   └── payment.service.ts
│   └── user/         # User management
│       ├── user.module.ts
│       ├── user.controller.ts
│       └── user.service.ts
├── types/            # TypeScript type definitions
│   ├── aws.type.ts
│   └── order.type.ts
└── utils/            # Utility functions
    ├── date.util.ts
    └── validation.util.ts
```

## Key Dependencies

- **AWS SDK**:
  - `@aws-sdk/client-cognito-identity-provider`
  - `@aws-sdk/client-sqs`
- **Database ORMs**:
  - `@nestjs/mongoose`
  - `@nestjs/typeorm`
- **Validation & Transformation**:
  - `class-validator`
  - `class-transformer`
- **Date Handling**: `dayjs`
- **Utilities**:
  - `lodash`
  - `uuid`

## Development Setup

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Configure environment variables:

   - Copy `.env.template` to `.env`
   - Fill in required environment variables

3. Development commands:
   - `npm run start:dev` - Start development server
   - `npm run build` - Build the application
   - `npm run test` - Run tests
   - `npm run lint` - Run linting

## API Documentation

- Swagger/OpenAPI documentation is available (via `@nestjs/swagger`)
- API endpoints are documented using Swagger decorators
