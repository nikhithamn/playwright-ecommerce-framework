# Enterprise Playwright Automation Framework

A production-quality, enterprise-grade test automation framework built with **Playwright**, **TypeScript**, and **Page Object & Component Object Models**.

Designed as a **standalone, application-agnostic automation platform** supporting UI, API, UI + API Hybrid, and direct Database Validation testing against any web application and REST API service.

---

## 🚀 Key Framework Features

- **UI Automation**: Page Object Model (POM) + Component Object Model (COM) with stable locators (`data-testid`, ARIA, semantic text).
- **API Automation**: Modular API Clients wrapping Playwright `APIRequestContext`, chainable `RequestBuilder`, and fluent schema/status response assertions.
- **Hybrid Automation**: Seamlessly combine API setup (registering users, seeding carts) with UI actions and direct SQL database validations.
- **Database Validation Hooks**: Direct PostgreSQL query pool (`PostgresClient`) and validation helpers (`OrderDbValidator`) for backend database assertions.
- **Reusable Custom Fixtures (`test.extend`)**: Dependency-injected fixtures supplying page objects, API clients, and database hooks with zero boilerplate.
- **Test Data Management**: Dynamic & deterministic payload factories powered by `@faker-js/faker`.
- **Parallel & Isolated Execution**: Full parallel worker execution, strict test isolation, and multi-browser support (Chromium, Firefox, WebKit).
- **Logging & Reporting**: Structured Winston logger, HTML reports, JSON summary artifacts, automatic failure screenshots, video, and trace recordings.
- **CI/CD & Docker**: Pre-configured GitHub Actions workflow and Docker container runner.

---

## 📁 Repository Structure

```text
enterprise-playwright-framework/
├── .github/
│   └── workflows/
│       └── playwright-tests.yml        # CI/CD Pipeline
├── config/
│   ├── env.config.ts                   # Multi-environment configuration loader
│   └── playwright.config.ts            # Enterprise Playwright test runner config
├── src/
│   ├── api/
│   │   ├── assertions/                 # Response assertions (status codes, schemas)
│   │   ├── builders/                   # Fluent RequestBuilder (headers, tokens, params)
│   │   └── clients/                    # Modular API Clients (AuthApi, ProductApi, CartApi, OrderApi)
│   ├── db/
│   │   ├── clients/                    # PostgreSQL pool connection executor
│   │   └── validators/                 # DB validation hooks for SQL assertions
│   ├── ui/
│   │   ├── components/                 # Component Objects (HeaderComponent, PaginationComponent)
│   │   └── pages/                      # Page Objects (LoginPage, CatalogPage, CartPage, CheckoutPage, etc.)
│   ├── fixtures/
│   │   └── base.fixture.ts             # Extended Playwright fixture merging UI, API & DB
│   ├── factories/                      # Test Data Factories (UserFactory, AddressFactory)
│   └── utils/                          # Logger & helpers
├── tests/
│   ├── ui/                             # UI Test Suite (@ui, @smoke, @regression)
│   ├── api/                            # API Test Suite (@api, @smoke, @regression)
│   └── hybrid/                         # Hybrid Test Suite (@hybrid, @db, @e2e)
├── Dockerfile.framework
├── docker-compose.framework.yml
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🛠️ Quick Start Guide

### 1. Install Dependencies

```bash
cd enterprise-playwright-framework
npm install
npx playwright install --with-deps
```

### 2. Environment Configuration

Copy `.env.example` to `.env` and adjust host parameters if needed:

```bash
cp .env.example .env
```

Default configuration points to the SUT running at `http://localhost:3000` (UI) and `http://localhost:5001/api` (API).

---

## 🧪 Executing Tests

### Run All Test Suites
```bash
npm test
```

### Run by Specific Test Tags
```bash
# UI Test Suite
npm run test:ui

# API Test Suite
npm run test:api

# Hybrid UI + API + DB Test Suite
npm run test:hybrid

# Smoke Test Suite
npm run test:smoke

# Regression Test Suite
npm run test:regression
```

### Debug & Interactive Modes
```bash
# Headed browser execution
npm run test:headed

# Playwright Inspector / Debugger
npm run test:debug

# View HTML Test Report
npm run report
```

---

## 🧩 Extended Custom Fixtures (`test.extend`)

Write clean, readable test cases without setup boilerplate. Page objects, API clients, and DB validators are automatically injected:

```ts
import { test, expect } from '../../src/fixtures/base.fixture';

test('Hybrid Checkout & Database Validation', async ({
  authApi,
  cartApi,
  loginPage,
  cartPage,
  checkoutPage,
  confirmationPage,
  dbValidator
}) => {
  // 1. API Setup: Authenticate & prepare cart
  const token = await authApi.loginAndGetToken('customer@test.com', 'Password123!');
  await cartApi.addItem(token, 'robotic-vacuum-cleaner', 1);

  // 2. UI Action: Log in and complete checkout
  await loginPage.goto();
  await loginPage.login('customer@test.com', 'Password123!');
  await cartPage.goto();
  await cartPage.proceedToCheckout();
  await checkoutPage.placeOrder();

  // 3. UI Assertion: Verify order confirmation screen
  const orderNum = await confirmationPage.getOrderNumberText();

  // 4. DB Assertion: Direct SQL verification in PostgreSQL
  const dbOrder = await dbValidator.verifyOrderExists(orderNum);
  expect(dbOrder.total).toBeGreaterThan(0);
});
```

---

## 🐳 Docker Container Execution

Run test suites inside an isolated container environment:

```bash
docker compose -f docker-compose.framework.yml up --build
```
