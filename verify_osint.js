const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Set viewport for desktop-first experience
  await page.setViewportSize({ width: 1280, height: 720 });

  console.log('Navigating to Nexus Veil...');
  await page.goto('http://localhost:3015');

  // Wait for boot sequence
  console.log('Waiting for boot sequence...');
  await page.waitForSelector('input[placeholder="ENTER ID"]', { timeout: 10000 });

  // Login
  console.log('Logging in...');
  await page.fill('input[placeholder="ENTER ID"]', 'guest');
  await page.fill('input[placeholder="ENTER PASSKEY"]', 'guest');
  await page.click('button:has-text("Authorize Session")');

  // Wait for main interface
  console.log('Waiting for main interface...');
  await page.waitForSelector('nav', { timeout: 10000 });

  // Navigate to OSINT section
  console.log('Navigating to OSINT section...');
  const osintButton = await page.locator('button:has-text("OSINT Layer")');
  await osintButton.click();

  // Wait for OSINT content
  console.log('Waiting for OSINT content...');
  await page.waitForSelector('h2:has-text("Investigation // Deep Scan")', { timeout: 10000 });

  // Wait a bit for 3D elements to settle
  await page.waitForTimeout(2000);

  console.log('Taking screenshot...');
  await page.screenshot({ path: 'osint_section_elevation.png' });

  await browser.close();
  console.log('Verification complete.');
})();
