# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/operator_auth.spec.ts >> Operator authentication and persistence
- Location: tests/operator_auth.spec.ts:3:5

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.goto: net::ERR_ABORTED; maybe frame was detached?
Call log:
  - navigating to "http://localhost:3015/operator", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  |
  3  | test('Operator authentication and persistence', async ({ page }) => {
  4  |   // Go to the home page
  5  |   await page.goto('http://localhost:3015');
  6  |
  7  |   // Wait for boot sequence to finish
  8  |   await page.waitForSelector('label:has-text("Identifier")', { timeout: 15000 });
  9  |
  10 |   // Fill in login credentials
  11 |   await page.fill('input[placeholder="ENTER ID"]', 'admin');
  12 |   await page.fill('input[placeholder="ENTER PASSKEY"]', 'admin');
  13 |
  14 |   // Click authorize
  15 |   await page.click('button:has-text("Authorize Session")');
  16 |
  17 |   // Verify we are logged in (Sidebar logo visible)
  18 |   await page.waitForSelector('span:has-text("Nexus Veil")', { timeout: 15000 });
  19 |
  20 |   // Now try to go to /operator
> 21 |   await page.goto('http://localhost:3015/operator');
     |              ^ Error: page.goto: net::ERR_ABORTED; maybe frame was detached?
  22 |
  23 |   // Verify we are on the operator page
  24 |   await expect(page.locator('h1')).toContainText('Operator // Workspace');
  25 |
  26 |   // Reload the page to test persistence
  27 |   await page.reload();
  28 |
  29 |   // Verify we are still on the operator page
  30 |   await expect(page.locator('h1')).toContainText('Operator // Workspace');
  31 |
  32 |   // Go back to home
  33 |   await page.goto('http://localhost:3015');
  34 |
  35 |   // Should still be logged in
  36 |   await expect(page.locator('span:has-text("Nexus Veil")')).toBeVisible();
  37 | });
  38 |
```