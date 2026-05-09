import { test, expect } from '@playwright/test';

test('Availability page renders correctly', async ({ page }) => {
  await page.goto('/room/mock-room/calendar');
  
  // Verify Header
  await expect(page.getByText('Availability')).toBeVisible();

  // Verify Tabs
  await expect(page.getByText('Group View')).toBeVisible();
  await expect(page.getByText('My Schedule')).toBeVisible();

  // Take a screenshot for visual proof (stored in E:\ms-playwright-results)
  await page.screenshot({ path: 'E:/ms-playwright-results/availability-vibe-check.png' });

  // Verify Legend
  await expect(page.getByText('Free')).toBeVisible();
  await expect(page.getByText('Busy')).toBeVisible();
});
