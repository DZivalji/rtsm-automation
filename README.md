# RTSM Automation

Playwright + TypeScript test automation for the RTSM system. Tests cover login, subject data capture with SQLite validation, and inventory screenshot capture.

## Setup

1. Install dependencies

```
npm install
npx playwright install chromium
```

2. Create a `.env` file in the project root

```
APP_URL=your_url
APP_USERNAME=your_username
APP_PASSWORD=your_password
```

3. Seed the database

```
npm run db:setup
```

## Running Tests

```
npx playwright test
```

To view the HTML report after a run:

```
npx playwright show-report
```

## Project Structure

```
pages/        Page Object Models
tests/        Test specs
fixtures/     Shared login fixture
utils/        Database helper
types/        TypeScript types
database/     SQLite setup script
```

## Tests

- **login.spec.ts** - Logs in using credentials from the database
- **subjects.spec.ts** - Captures first subject data from UI and validates it against the database
- **inventory.spec.ts** - Navigates to the Inventory page and captures a full-page screenshot
