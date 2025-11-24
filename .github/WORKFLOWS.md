# GitHub Actions Workflows

## Overview

The CI/CD pipeline is split into two workflows to ensure quality gates are checked before deployment.

## Workflow Structure

```
┌─────────────────────────────────────────┐
│  CI - Test and Quality (ci.yml)        │
│  Trigger: Push to main, Pull Requests  │
├─────────────────────────────────────────┤
│  1. Run Tests and Lint                  │
│     - ESLint                             │
│     - Unit Tests (Jest)                  │
│     - BDD Tests (Cucumber)               │
│     - Coverage Report                    │
├─────────────────────────────────────────┤
│  2. SonarQube Analysis                   │
│     - Code Quality Analysis              │
│     - Security Scanning                  │
│     - Quality Gate Check                 │
└─────────────────────────────────────────┘
                  ↓
        ✅ Quality Gate Pass
                  ↓
┌─────────────────────────────────────────┐
│  CD - Deploy to AWS (deploy.yml)       │
│  Trigger: CI workflow completion        │
├─────────────────────────────────────────┤
│  1. Verify SonarQube Quality Gate       │
├─────────────────────────────────────────┤
│  2. Get Database Configuration          │
│     - AWS SSM Parameter Store            │
├─────────────────────────────────────────┤
│  3. Build and Deploy                     │
│     - Build Docker image                 │
│     - Push to ECR                        │
│     - Run migrations                     │
│     - Deploy to ECS                      │
└─────────────────────────────────────────┘
```

## Workflows

### 1. CI - Test and Quality (`ci.yml`)

**Triggers:**

- Push to `main` branch
- Pull requests to `main` branch

**Jobs:**

#### Job 1: `test`

Runs linting and all tests with PostgreSQL service.

**Steps:**

1. Checkout code with full history (`fetch-depth: 0`)
2. Setup Node.js 20
3. Install dependencies (`npm ci`)
4. Run ESLint
5. Run unit tests
6. Run BDD tests (Cucumber)

**Services:**

- PostgreSQL 15-alpine on port 5433

**Environment Variables:**

```yaml
DB_HOST: localhost
DB_PORT: 5433
DB_NAME: products_test
DB_USER: test_user
DB_PASSWORD: test_password
NODE_ENV: test
```

#### Job 2: `sonarqube`

Runs SonarQube analysis after tests pass.

**Dependencies:** Requires `test` job to complete successfully

**Steps:**

1. Checkout code with full history
2. Setup Node.js 20
3. Install dependencies
4. Run tests with coverage
5. SonarQube Scan
6. Quality Gate check

**Secrets Required:**

- `SONAR_TOKEN`: SonarQube Cloud authentication token

**SonarQube Configuration:**

- Coverage path: `coverage/lcov.info`
- Project key: From `sonar-project.properties`
- Organization: From `sonar-project.properties`

### 2. CD - Deploy to AWS (`deploy.yml`)

**Triggers:**

- Successful completion of CI workflow
- Manual workflow dispatch

**Conditional Execution:**
Only runs if CI workflow completed successfully:

```yaml
if: ${{ github.event.workflow_run.conclusion == 'success' }}
```

**Jobs:**

#### Job 1: `check-quality-gate`

Verifies SonarQube quality gate passed.

#### Job 2: `get-database-config`

Retrieves database credentials from AWS Parameter Store.

**Dependencies:** Requires `check-quality-gate` to complete

**AWS Parameters:**

- `/products/rds_endpoint` → DB_HOST
- `/products/db_username` → DB_USER
- `/products/db_password` → DB_PASSWORD

**Outputs:**

- `db_host`
- `db_user`
- `db_password` (masked)

#### Job 3: `build-and-deploy`

Builds Docker image and deploys to AWS ECS.

**Dependencies:** Requires `get-database-config` to complete

**Steps:**

1. Checkout code
2. Setup Node.js 20
3. Install dependencies
4. Skip tests (already run in CI)
5. Build application
6. Configure AWS credentials
7. Login to Amazon ECR
8. Build and push Docker image
9. Run database migrations
10. Deploy to ECS
11. Verify deployment

**Secrets Required:**

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_SESSION_TOKEN`
- `AWS_REGION`
- `DB_PORT`
- `DB_NAME`
- `ECS_CLUSTER_NAME`

**Docker Image:**

- Repository: `products-microservice`
- Tags: `${{ github.sha }}` and `latest`

## Required Secrets

Configure these secrets in GitHub repository settings:

### SonarQube

- `SONAR_TOKEN`: SonarQube Cloud token

### AWS Credentials

- `AWS_ACCESS_KEY_ID`: AWS access key
- `AWS_SECRET_ACCESS_KEY`: AWS secret key
- `AWS_SESSION_TOKEN`: AWS session token (for temporary credentials)
- `AWS_REGION`: AWS region (e.g., us-east-1)

### Database

- `DB_PORT`: Database port (e.g., 5432)
- `DB_NAME`: Database name

### ECS

- `ECS_CLUSTER_NAME`: ECS cluster name

## Quality Gates

### Test Coverage

- Minimum: 80%
- Enforced by: Jest configuration

### SonarQube Quality Gate

- Coverage
- Duplications
- Maintainability
- Reliability
- Security

**Deployment is blocked if quality gate fails.**

## Branch Protection

### Main Branch

- Require pull request reviews
- Require status checks to pass:
  - `test` (CI workflow)
  - `sonarqube` (CI workflow)
- No direct pushes allowed
- Require branches to be up to date

## Workflow Execution Flow

### Pull Request Workflow

```
PR opened → CI workflow triggers
  → Run tests
  → Run SonarQube
  → Quality gate check
  → ✅ PR ready for merge
```

### Main Branch Workflow

```
Push to main → CI workflow triggers
  → Run tests
  → Run SonarQube
  → Quality gate check
  → ✅ Trigger deploy workflow
    → Verify quality gate
    → Get DB config
    → Build & deploy
    → ✅ Deployment complete
```

## Manual Deployment

Deploy workflow can be triggered manually:

1. Go to Actions tab
2. Select "CD - Deploy to AWS"
3. Click "Run workflow"
4. Select branch (main)
5. Click "Run workflow"

**Note:** Manual deployment still requires CI workflow to have completed successfully.

## Monitoring

### CI Workflow Status

- Badge: `![CI](https://github.com/{org}/{repo}/workflows/CI%20-%20Test%20and%20Quality/badge.svg)`
- Check: Repository Actions tab

### Deployment Status

- Badge: `![CD](https://github.com/{org}/{repo}/workflows/CD%20-%20Deploy%20to%20AWS/badge.svg)`
- Check: Repository Actions tab

### SonarQube

- Dashboard: https://sonarcloud.io
- Quality gate status
- Code coverage
- Code smells
- Bugs and vulnerabilities

## Troubleshooting

### CI Workflow Fails

1. Check test output
2. Check ESLint output
3. Check SonarQube quality gate details

### Deploy Workflow Fails

1. Verify AWS credentials are valid
2. Check Parameter Store has required values
3. Verify ECR repository exists
4. Check ECS cluster and service exist
5. Review migration errors

### Quality Gate Fails

1. Check SonarQube dashboard
2. Review failing metrics
3. Fix code issues
4. Push changes
5. Wait for re-analysis

## Best Practices

1. **Never skip quality gates** - They ensure code quality
2. **Use feature branches** - Create PRs for all changes
3. **Review SonarQube feedback** - Address issues before merging
4. **Monitor deployments** - Check logs after deployment
5. **Keep secrets updated** - Rotate AWS credentials regularly
6. **Test locally first** - Run `npm test` and `npm run lint` before pushing

## Future Enhancements

- [ ] Add smoke tests after deployment
- [ ] Add rollback mechanism
- [ ] Add Slack notifications
- [ ] Add performance testing
- [ ] Add blue-green deployment
- [ ] Add canary deployment strategy
