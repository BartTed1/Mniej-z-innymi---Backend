# Mniej z Innymi - Backend

EN: The backend API for the "Mniej z Innymi" platform, a service dedicated to helping travelers find companions for shared railway tickets.

PL: Backend API dla platformy „Mniej z Innymi”, serwisu pomagającego podróżnym znaleźć towarzyszy podróży, aby wspólnie korzystać z tańszych biletów kolejowych.

## Features

- **Offers Management**: Core logic for creating and retrieving journey offers.
- **Messaging Service**: Integrated with Firebase Admin for push notifications.
- **Database Integration**: Robust data storage using PostgreSQL and TypeORM.
- **API Documentation**: Interactive Swagger documentation for easy development and testing.

## Tech Stack

- **Framework**: [NestJS](https://nestjs.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [TypeORM](https://typeorm.io/)
- **Messaging**: [Firebase Admin SDK](https://firebase.google.com/docs/admin)
- **Documentation**: [Swagger (OpenAPI)](https://swagger.io/)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL
- Firebase Service Account Key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/BartTed1/Mniej-z-innymi---Backend.git
2. Install dependencies:
    ```bash
    npm install
    ```
3. Environment Setup: Create a .env file with the following variables:
    ```bash
    DB_PORT=5432
    DB_USER=your_user
    DB_PASSWORD=your_password
    DB_NAME=your_database
    PORT=3000
    ```
4. Run the application:
    ```bash
    # development
    npm run start:dev
    
    # production mode
    npm run start:prod
    ```

## API Documentation

Once the server is running, you can access the Swagger UI at: http://localhost:3000/api

## Modules

OffersModule: Handles journey offer creation and discovery.
MessagingModule: Manages communication and notifications via Firebase.
