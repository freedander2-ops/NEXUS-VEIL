import { test, expect } from '@playwright/test';

test('dimensional verification', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });

  console.log('Navigating to Nexus Veil...');
  await page.goto('http://localhost:3015');

  console.log('Logging in...');
  await page.waitForSelector('input', { timeout: 10000 });
  const inputs = await page.$$('input');
  await inputs[0].fill('guest');
  await inputs[1].fill('guest');
  await page.click('button[type="submit"]');

  console.log('Waiting for main interface...');
  await page.waitForSelector('nav', { timeout: 10000 });

  // Verify Baseline (Weather)
  console.log('Verifying Weather dimension...');
  await expect(page.locator('h2:has-text("Digital Weather")')).toBeVisible();

  // Verify Cyber Dimension
  console.log('Verifying Cyber dimension...');
  await page.click('button:has-text("Cybersecurity")');
  await expect(page.locator('h1:has-text("Tactical Threat Space")')).toBeVisible();

  // Verify OSINT dimension
  console.log('Verifying OSINT dimension...');
  await page.click('button:has-text("Osint Layer")');
  await expect(page.locator('h2:has-text("Investigation // Deep Scan")')).toBeVisible();

  // Verify Creator Panel existence
  console.log('Verifying Creator Panel...');
  await page.click('button:has(svg.lucide-settings)');
  await expect(page.locator('h3:has-text("Dimension Creator")')).toBeVisible();
});
