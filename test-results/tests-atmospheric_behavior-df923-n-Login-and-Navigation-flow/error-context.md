# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/atmospheric_behavior.spec.ts >> Atmospheric Behavior Verification >> Login and Navigation flow
- Location: tests/atmospheric_behavior.spec.ts:4:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('input[placeholder="ENTER ID"]')
Expected: visible
Timeout: 60000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 60000ms
  - waiting for locator('input[placeholder="ENTER ID"]')

```

```yaml
- text: Internal Server Error
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  |
  3  | test.describe('Atmospheric Behavior Verification', () => {
  4  |   test('Login and Navigation flow', async ({ page }) => {
  5  |     // Relaxed timeouts for sandbox environment
  6  |     test.setTimeout(90000);
  7  |
  8  |     await page.goto('http://localhost:3000');
  9  |
  10 |     // Wait for the terminal boot sequence to finish and show the input
  11 |     const userInput = page.locator('input[placeholder="ENTER ID"]');
> 12 |     await expect(userInput).toBeVisible({ timeout: 60000 });
     |                             ^ Error: expect(locator).toBeVisible() failed
  13 |
  14 |     await userInput.fill('admin');
  15 |     await page.fill('input[placeholder="ENTER PASSKEY"]', 'admin');
  16 |     await page.check('#privacy-consent');
  17 |     await page.click('button:has-text("Authorize Session")');
  18 |
  19 |     // Verify successful login by checking for the navigation or pulse indicator
  20 |     await expect(page).toHaveURL(/.*weather/, { timeout: 30000 });
  21 |   });
  22 | });
  23 |
```