import { test, expect } from '@playwright/test';

test('stress-test dimensional transitions', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });

  console.log('Navigating to Nexus Veil...');
  await page.goto('http://localhost:3015');

  console.log('Logging in...');
  await page.waitForSelector('input', { timeout: 15000 });
  const inputs = await page.$$('input');
  await inputs[0].fill('guest');
  await inputs[1].fill('guest');
  await page.click('button:has-text("Authorize Session")');

  console.log('Waiting for main interface...');
  await page.waitForSelector('nav', { timeout: 15000 });

  const sections = ["Cybersecurity", "Github Signals", "Osint Layer", "Digital Weather"];

  console.log('Starting rapid dimension switching stress test...');
  for (let i = 0; i < 10; i++) {
    const section = sections[i % sections.length];
    console.log(`Switching to ${section} (Iteration ${i + 1})...`);
    await page.click(`button:has-text("${section}")`);
    // Rapid switching - reduced timeout to stress the transitions
    await page.waitForTimeout(300);
  }

  // Final validation after stress
  console.log('Final validation of UI stability...');
  await page.click('button:has-text("Digital Weather")');
  await page.waitForTimeout(1000);
  await expect(page.locator('h2:has-text("Digital Weather")')).toBeVisible({ timeout: 10000 });

  // Verify sidebar is still interactive
  await page.click('button:has(svg.lucide-menu), button:has(svg.lucide-x)');
  console.log('Stress test completed.');
});
