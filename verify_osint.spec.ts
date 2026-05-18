import { test, expect } from '@playwright/test';

test('verify osint section elevation', async ({ page }) => {
  await page.goto('http://localhost:3001/main');

  // Wait for sidebar
  await page.waitForSelector('nav');

  // Click OSINT Layer
  await page.click('button:has-text("OSINT Layer")');

  // Wait for the OSINT section content
  await page.waitForSelector('h2:has-text("Investigation // Deep Scan")');

  // Check header
  const header = await page.textContent('header h2');
  expect(header).toContain('OSINT LAYER');

  // Take screenshot
  await page.screenshot({ path: 'verify_osint_real.png', fullPage: true });
});
