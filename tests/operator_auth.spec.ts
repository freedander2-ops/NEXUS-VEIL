import { test, expect } from '@playwright/test';

test('Operator authentication and persistence', async ({ page }) => {
  // Go to the home page
  await page.goto('http://localhost:3015');

  // Wait for boot sequence to finish
  await page.waitForSelector('label:has-text("Identifier")', { timeout: 15000 });

  // Fill in login credentials
  await page.fill('input[placeholder="ENTER ID"]', 'admin');
  await page.fill('input[placeholder="ENTER PASSKEY"]', 'admin');

  // Click authorize
  await page.click('button:has-text("Authorize Session")');

  // Verify we are logged in (Sidebar logo visible)
  await page.waitForSelector('span:has-text("Nexus Veil")', { timeout: 15000 });

  // Now try to go to /operator
  await page.goto('http://localhost:3015/operator');

  // Verify we are on the operator page
  await expect(page.locator('h1')).toContainText('Operator // Workspace');

  // Reload the page to test persistence
  await page.reload();

  // Verify we are still on the operator page
  await expect(page.locator('h1')).toContainText('Operator // Workspace');

  // Go back to home
  await page.goto('http://localhost:3015');

  // Should still be logged in
  await expect(page.locator('span:has-text("Nexus Veil")')).toBeVisible();
});
