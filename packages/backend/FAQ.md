# Frequently Asked Questions (FAQ)

Welcome to the Backend FAQ! This document contains commonly asked questions and their answers regarding the backend service. It serves as a quick reference guide for developers working with this project.

## Table of Contents

- [Getting Started](#getting-started)
- [Environment Setup](#environment-setup)
- [Common Issues](#common-issues)
- [Best Practices](#best-practices)

---

## Getting Started

### What is this backend service?

This is a NestJS-based backend service that provides a RESTful API for the frontend application.

### How do I set up the development environment?

1. Clone the repository
2. Copy `.env.template` to `.env`
3. Install dependencies with `pnpm install` at the root of the project
4. Start the development server with `pnpm dev`

---

## Environment Setup

### What environment variables do I need?

Please refer to the `.env.template` file for all required environment variables.

---

## Common Issues

<details>
<summary>How do I parse an `object_id` string from `params`, `query`, or `body` to an ObjectId?</summary>

For this issue, you can refer to the [NestJS ObjectId documentation](https://github.com/vlbras/nestjs-object-id).

</details>

<details>
<summary>How can we use the cognito auth in the backend?</summary>

For this issue, we are using this package to control the cognito auth in the backend

- [NPM package](https://www.npmjs.com/package/@nestjs-cognito/auth)
- [Github](https://github.com/Lokicoule/nestjs-cognito)
- [Document](https://lokicoule.github.io/nestjs-cognito/)

</details>

## Best Practices

TBD
