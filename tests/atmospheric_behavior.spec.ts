import { test, expect } from '@playwright/test';

test.describe('Atmospheric Behavior Verification', () => {
  test('Login and Navigation flow', async ({ page }) => {
    // Relaxed timeouts for sandbox environment
    test.setTimeout(90000);

    await page.goto('http://localhost:3000');

    // Wait for the terminal boot sequence to finish and show the input
    const userInput = page.locator('input[placeholder="ENTER ID"]');
    await expect(userInput).toBeVisible({ timeout: 60000 });

    await userInput.fill('admin');
    await page.fill('input[placeholder="ENTER PASSKEY"]', 'admin');
    await page.check('#privacy-consent');
    await page.click('button:has-text("Authorize Session")');

    // Verify successful login by checking for the navigation or pulse indicator
    await expect(page).toHaveURL(/.*weather/, { timeout: 30000 });
  });
});
