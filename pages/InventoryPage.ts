import { expect, Locator, Page } from '@playwright/test';
import fs from 'fs';
import path from 'path';

export class InventoryPage {
  private readonly page: Page;
  private readonly adminMenu: Locator;
  private readonly inventoryLink: Locator;
  private readonly pageTitle: Locator;

  constructor(page: Page) {
    this.page = page;

    this.adminMenu = page.locator('a.navbar_navMenu_1', { hasText: 'Admin' });
    this.inventoryLink = page.locator('a.child-menuitem[href="Admin/Inventory.aspx"]', {
      hasText: 'Inventory',
    });
    this.pageTitle = page.locator('#lblTitle');
  }

  async navigateToInventory(): Promise<void> {
    await expect(this.adminMenu).toBeVisible();

    await this.adminMenu.hover();

    await expect(this.inventoryLink).toBeVisible({
      timeout: 10000,
    });

    await this.inventoryLink.click();

    await expect(this.pageTitle).toHaveText(/inventory/i, {
      timeout: 15000,
    });
  }

  async captureInventoryScreenshot(): Promise<string> {
    const screenshotsDir = path.resolve('screenshots');

    fs.mkdirSync(screenshotsDir, { recursive: true });

    const screenshotPath = path.join(screenshotsDir, 'inventory-page.png');

    await this.page.screenshot({
      path: screenshotPath,
      fullPage: true,
    });

    return screenshotPath;
  }
}