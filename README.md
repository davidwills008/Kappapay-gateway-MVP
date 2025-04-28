# Payment Gateway MVP

A Node.js + TypeScript payment gateway implementation using Express, Prisma ORM, and PostgreSQL.

## Features

- Payment processing (initiate, authorize, capture, cancel)
- User authentication and authorization
- Transaction management
- Refund handling
- Rate limiting and security middleware

## Tech Stack

- Node.js
- TypeScript
- Express.js
- Prisma ORM
- PostgreSQL
- JWT Authentication

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL
- Prisma CLI

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/payment-gateway-mvp.git
cd payment-gateway-mvp
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Set up the database:
```bash
npx prisma generate
npx prisma migrate dev
```

## Development

Start the development server:
```bash
npm run dev
```

## API Endpoints

- POST `/payments` - Create a new payment
- POST `/payments/:id/authorize` - Authorize a payment
- POST `/payments/:id/capture` - Capture a payment
- POST `/payments/:id/cancel` - Cancel a payment
- GET `/payments/:id` - Get payment details
- GET `/payments` - Get all payments

## Project Structure

```
src/
  /models       → Entity classes
  /services     → Business logic
  /controllers  → Route handlers
  /middlewares  → Express middleware
  /routes       → API routes
  /utils        → Helpers
  /config       → Configuration
```

## License

MIT 