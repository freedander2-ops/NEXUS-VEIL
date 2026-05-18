const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.setViewportSize({ width: 1280, height: 720 });

  console.log('Navigating to Nexus Veil...');
  await page.goto('http://localhost:3015');

  console.log('Waiting for boot sequence...');
  await page.waitForSelector('input', { timeout: 10000 });

  console.log('Logging in...');
  const inputs = await page.$$('input');
  await inputs[0].fill('guest');
  await inputs[1].fill('guest');
  await page.click('button[type="submit"]');

  console.log('Waiting for main interface...');
  await page.waitForSelector('nav', { timeout: 10000 });

  // Verify OSINT
  console.log('Verifying OSINT section...');
  await page.click('button:has-text("Osint Layer")');
  await page.waitForSelector('h2:has-text("Investigation // Deep Scan")', { timeout: 10000 });
  await page.screenshot({ path: 'final_verify_osint.png' });

  // Verify GitHub
  console.log('Verifying GitHub section...');
  await page.click('button:has-text("Github Signals")');
  await page.waitForSelector('h2:has-text("Technical Ecosystem")', { timeout: 10000 });
  await page.screenshot({ path: 'final_verify_github.png' });

  // Verify Cyber
  console.log('Verifying Cybersecurity section...');
  await page.click('button:has-text("Cybersecurity")');
  await page.waitForSelector('h1:has-text("Tactical Threat Space")', { timeout: 10000 });
  await page.screenshot({ path: 'final_verify_cyber.png' });

  // Switch to Russian
  console.log('Switching to Russian...');
  // The toggle button has text EN / RU. We click the RU one.
  const ruButton = await page.waitForSelector('button:has-text("RU")');
  await ruButton.click();

  // Verify Russian Cyber
  console.log('Verifying Russian Cybersecurity section...');
  // Wait for the Russian text to appear
  await page.waitForSelector('h1:has-text("Тактическое пространство угроз")', { timeout: 10000 });
  await page.screenshot({ path: 'final_verify_cyber_ru.png' });

  await browser.close();
  console.log('All sections verified successfully.');
})();
