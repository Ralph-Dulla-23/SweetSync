import { chromium } from '@playwright/test';

async function checkConsole(url: string) {
  // Tell Playwright where the browsers are located on E:
  process.env.PLAYWRIGHT_BROWSERS_PATH = 'E:\\ms-playwright';
  
  const browser = await chromium.launch();
  const page = await browser.newPage();

  page.on('console', msg => {
  });

  page.on('pageerror', err => {
  });

  try {
    await page.goto(url, { waitUntil: 'networkidle' });
    // Wait a bit for async simulation logic to run
    await page.waitForTimeout(2000);
  } catch (e: any) {
    console.error(`Failed to load page: ${e.message}`);
  } finally {
    await browser.close();
  }
}

const targetUrl = process.argv[2] || 'http://localhost:8081';
checkConsole(targetUrl);
