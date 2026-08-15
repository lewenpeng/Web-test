# Repository Guidelines

## Project Structure & Module Organization

This repository is an end-to-end browser-test project. Playwright tests live in `tests/e2e/` and use the `.spec.ts` suffix. `playwright.config.ts` defines browser projects, timeouts, reporters, and artifact locations. HTML reports are written to `playwright-report/`; traces, screenshots, videos, and JUnit output go under `test-results/`. Keep generated output out of commits. The `specs/` directory is currently unused.

## Build, Test, and Development Commands

There is no application build and `package.json` currently has no scripts. From the repository root:

```powershell
npm install
npx playwright install
npx playwright test
npx playwright test tests/e2e/example.spec.ts
npx playwright show-report playwright-report
```

`npm install` installs locked dependencies; install browsers once per environment. The default command runs Chromium, Firefox, WebKit, and the mobile project. Set `BASE_URL` for a local app, for example `$env:BASE_URL='http://127.0.0.1:3000'`. CI enables retries, limits workers, and rejects `test.only`.

## Coding Style & Naming Conventions

Use TypeScript with two-space indentation, semicolons, and single-quoted strings, matching the existing files. Name test files `*.spec.ts`, group related scenarios with descriptive `test.describe` blocks, and name tests by observable behavior (for example, `submits a valid login form`). Prefer accessible locators such as `getByRole` and stable user-facing labels over CSS selectors or implementation details.

## Testing Guidelines

Tests use `@playwright/test` and should be deterministic, isolated, and runnable against `BASE_URL`. Run the full matrix before submitting; target a single spec during iteration. Investigate failures with retained artifacts in `test-results/` and the HTML report. Cover the expected flow plus meaningful error or boundary states.

## Commit & Pull Request Guidelines

The repository has no commits yet, so no established message convention can be inferred. Use short, imperative subjects (for example, `Add checkout smoke test`) and keep each commit focused. Pull requests should explain the behavior covered or changed, identify the test command and browser scope run, link the relevant issue or requirement, and include report screenshots or failure artifacts when a UI behavior or visual regression is involved. Do not commit secrets, `.env` files, authentication state, or generated reports.

## Security & Configuration Tips

Keep credentials and tokens in environment variables or local `.env` files (which are ignored), never in specs. Use test accounts with minimal privileges, and review any external URLs before adding them to tests.
