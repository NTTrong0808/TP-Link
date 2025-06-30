# Langfarm Ticket Backend

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Overview

Langfarm Ticket Backend is a robust server-side application built with NestJS, providing a comprehensive ticketing system with features like user management, booking system, and payment processing.

### Tech Stack
- **Framework**: NestJS v11
- **Language**: TypeScript
- **Databases**: 
  - MongoDB (via Mongoose)
  - PostgreSQL (via TypeORM)
- **Authentication**: AWS Cognito
- **Message Queue**: AWS SQS
- **Email Service**: SparkPost
- **Testing**: Jest
- **Code Quality**: ESLint, Prettier

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- pnpm (v8 or higher)
- MongoDB
- PostgreSQL
- AWS Account (for Cognito and SQS)
- SparkPost Account

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd langfarm-ticket/packages/backend
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.template .env
```
Edit `.env` with your configuration values.

### Development

```bash
# Start development server
pnpm run start:dev

# Build the application
pnpm run build

# Run tests
pnpm run test
pnpm run test:e2e
pnpm run test:cov

# Lint code
pnpm run lint
```

## Project Structure

```
src/
├── main.ts              # Application entry point
├── app.module.ts        # Root application module
├── app.controller.ts    # Root controller
├── app.service.ts       # Root service
├── constants/          # Application constants
├── enums/             # TypeScript enums
├── lib/               # Shared libraries
├── modules/           # Feature modules
├── types/            # TypeScript type definitions
└── utils/            # Utility functions
```

### Key Modules
- **Auth Module**: Handles authentication and authorization
- **Users Module**: User management and profiles
- **Booking Module**: Ticket booking and management
- **Payment Module**: Payment processing and transactions
- **Notification Module**: Email and system notifications

## Development Guidelines

### Code Style
- Follow NestJS best practices
- Use TypeScript strict mode
- Implement proper error handling
- Write unit tests for new features
- Document API endpoints using Swagger

### Git Workflow
1. Create feature branch from `develop`
2. Make changes and commit with meaningful messages
3. Run tests and linting
4. Create pull request to `develop`

### Testing
- Write unit tests for services and controllers
- Include e2e tests for critical flows
- Maintain test coverage above 80%

## Configuration

### Environment Variables
Required environment variables:
```env
# Database
MONGODB_URI=
POSTGRES_HOST=
POSTGRES_PORT=
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=

# AWS
AWS_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
COGNITO_USER_POOL_ID=
COGNITO_CLIENT_ID=
SQS_QUEUE_URL=

# Email
SPARKPOST_API_KEY=
```

### Database Setup
1. MongoDB:
   - Create database
   - Set up indexes
   - Configure connection string

2. PostgreSQL:
   - Create database
   - Run migrations
   - Set up connection

### AWS Services
1. Cognito:
   - Create user pool
   - Configure app client
   - Set up authentication flows

2. SQS:
   - Create queue
   - Configure permissions
   - Set up message handlers

## Deployment

### Build Process
```bash
# Build application
pnpm run build

# Start production server
pnpm run start:prod
```

### Production Considerations
- Enable compression
- Configure CORS
- Set up proper logging
- Enable rate limiting
- Configure security headers

## Support & Resources

### Troubleshooting
Common issues and solutions:
1. Database connection issues
2. AWS service configuration
3. Email delivery problems
4. Performance optimization

### Useful Links
- [NestJS Documentation](https://docs.nestjs.com)
- [TypeORM Documentation](https://typeorm.io)
- [Mongoose Documentation](https://mongoosejs.com)
- [AWS SDK Documentation](https://docs.aws.amazon.com/sdk-for-javascript)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ pnpm install
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ pnpm install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Frequently Asked Questions

[READ HERE](./FAQ.md)

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
