import fs from 'fs';
import { test, expect } from '../fixtures/test-fixtures';
import { InventoryPage } from '../pages/InventoryPage';

test('Inventory and capture screenshot', async ({ loggedInPage }) => {
  const inventoryPage = new InventoryPage(loggedInPage);

  await inventoryPage.navigateToInventory();

  const screenshotPath = await inventoryPage.captureInventoryScreenshot();

  expect(screenshotPath).toContain('inventory-page.png');
  expect(fs.existsSync(screenshotPath)).toBe(true);

  const screenshotStats = fs.statSync(screenshotPath);
  expect(screenshotStats.size).toBeGreaterThan(0);
});