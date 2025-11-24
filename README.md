# Products Microservice

Products management microservice for SOAT Tech Challenge - Phase 4

## Overview

This microservice is responsible for managing products and categories in the system. It follows Clean Architecture principles and is built with NestJS, TypeScript, and PostgreSQL.

## Tech Stack

- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Testing**: Jest (Unit Tests) + Cucumber (BDD Tests)
- **Code Quality**: SonarQube, ESLint
- **Container**: Docker
- **CI/CD**: GitHub Actions
- **Cloud**: AWS (ECS, RDS, ECR)

## Architecture

This project follows Clean Architecture principles with the following layers:

```
src/
├── core/                          # Business logic layer
│   ├── domain/                    # Domain entities and interfaces
│   │   ├── entities/              # Business entities
│   │   └── repositories/          # Repository interfaces
│   └── application/               # Application use cases
│       ├── dtos/                  # Data Transfer Objects
│       └── use-cases/             # Business use cases
└── external/                      # External layer
    ├── api/                       # API controllers
    │   └── controllers/           # REST controllers
    └── infrastructure/            # Infrastructure implementations
        ├── database/              # Database entities and config
        │   ├── entities/          # TypeORM entities
        │   └── migrations/        # Database migrations
        └── repositories/          # Repository implementations
```

## Features

- ✅ Create, Read, Update, Delete products
- ✅ Category management
- ✅ Filter products by category
- ✅ Product availability control
- ✅ RESTful API with Swagger documentation
- ✅ Database migrations
- ✅ Input validation
- ✅ Error handling
- ✅ Unit tests (80%+ coverage)
- ✅ BDD tests with Cucumber
- ✅ Docker support
- ✅ CI/CD pipeline

## Prerequisites

- Node.js 20.x or higher
- npm 9.x or higher
- Docker and Docker Compose (for local development)
- PostgreSQL 15 (if not using Docker)

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd products
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration.

### 4. Run with Docker Compose (Recommended)

```bash
docker-compose up -d
```

This will start:
- PostgreSQL database on port 5432
- Products API on port 3000

### 5. Run migrations

```bash
npm run migration:run
```

### 6. Access the application

- API: http://localhost:3000
- Swagger Documentation: http://localhost:3000/api/docs

## Development

### Running locally without Docker

1. Start PostgreSQL:
```bash
# Using your local PostgreSQL installation
# Make sure it's running on port 5432
```

2. Run migrations:
```bash
npm run migration:run
```

3. Start the application in development mode:
```bash
npm run start:dev
```

### Available Scripts

- `npm run build` - Build the application
- `npm run start` - Start the application
- `npm run start:dev` - Start in development mode with hot reload
- `npm run start:debug` - Start in debug mode
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:cov` - Run tests with coverage
- `npm run test:bdd` - Run BDD tests with Cucumber
- `npm run migration:generate` - Generate a new migration
- `npm run migration:run` - Run pending migrations
- `npm run migration:revert` - Revert last migration

## API Endpoints

### Products

- `POST /products` - Create a new product
- `GET /products` - List all products (optional: `?categoryId=xxx`)
- `GET /products/:id` - Get product by ID
- `PUT /products/:id` - Update a product
- `DELETE /products/:id` - Delete a product

### Categories

- `POST /categories` - Create a new category
- `GET /categories` - List all categories

For detailed API documentation, visit the Swagger UI at `/api/docs` when the application is running.

## Testing

### Unit Tests

```bash
npm test
```

### Test Coverage

```bash
npm run test:cov
```

Current coverage: **80%+** (meets project requirements)

### BDD Tests

```bash
npm run test:bdd
```

BDD tests are written in Gherkin syntax and located in the `features/` directory.

## Database Migrations

### Create a new migration

```bash
npm run migration:generate -- src/external/infrastructure/database/migrations/MigrationName
```

### Run migrations

```bash
npm run migration:run
```

### Revert last migration

```bash
npm run migration:revert
```

## Code Quality

### SonarQube

The project is configured with SonarQube for code quality analysis. The CI pipeline automatically runs SonarQube analysis on every pull request.

Requirements:
- Code coverage: 80%+
- Quality gate: Must pass

### ESLint

```bash
npm run lint
npm run lint:fix
```

## CI/CD

### GitHub Actions Workflows

#### CI Workflow (`.github/workflows/ci.yml`)

Runs on every pull request to `main`:
1. Runs ESLint
2. Runs unit tests with coverage
3. Runs BDD tests
4. Performs SonarQube analysis
5. Checks quality gate
6. Uploads coverage reports

#### CD Workflow (`.github/workflows/deploy.yml`)

Runs on every push to `main`:
1. Retrieves database configuration from AWS Parameter Store
2. Builds Docker image
3. Pushes image to Amazon ECR
4. Runs database migrations
5. Deploys to AWS ECS
6. Verifies deployment

### Required GitHub Secrets

#### AWS Credentials
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_SESSION_TOKEN`
- `AWS_REGION`

#### Database Configuration
- `DB_PORT` (default: 5432)
- `DB_NAME` (database name)

#### ECS Configuration
- `ECS_CLUSTER_NAME` (ECS cluster name)

#### SonarQube
- `SONAR_TOKEN`
- `SONAR_HOST_URL`

### AWS Parameter Store

The following parameters must be configured in AWS Systems Manager Parameter Store:

- `/products/rds_endpoint` - Database host/endpoint
- `/products/db_username` - Database username
- `/products/db_password` - Database password (encrypted)

## Deployment

### AWS Infrastructure

The microservice is deployed to AWS with the following resources:

- **ECS**: Container orchestration
- **ECR**: Container registry
- **RDS PostgreSQL**: Database
- **Parameter Store**: Configuration management
- **VPC**: Network isolation

### Manual Deployment

1. Build the Docker image:
```bash
docker build -t products-microservice .
```

2. Tag and push to ECR:
```bash
aws ecr get-login-password --region <region> | docker login --username AWS --password-stdin <account-id>.dkr.ecr.<region>.amazonaws.com
docker tag products-microservice:latest <account-id>.dkr.ecr.<region>.amazonaws.com/products-microservice:latest
docker push <account-id>.dkr.ecr.<region>.amazonaws.com/products-microservice:latest
```

3. Update ECS service:
```bash
aws ecs update-service --cluster <cluster-name> --service products-microservice --force-new-deployment
```

## Contributing

### Branch Protection Rules

The `main` branch is protected with the following rules:
- Direct pushes are not allowed
- Pull requests require approval
- CI checks must pass before merging
- SonarQube quality gate must pass

### Development Workflow

1. Create a feature branch from `main`
2. Make your changes
3. Write tests (maintain 80%+ coverage)
4. Run tests and linting locally
5. Create a pull request
6. Wait for CI checks to pass
7. Request code review
8. Merge after approval

## License

MIT

## Support

For questions or issues, please open an issue in the repository.
