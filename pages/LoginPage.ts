import { expect, Locator, Page } from '@playwright/test';

export class LoginPage {
  private readonly page: Page;
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly pageHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('#txtLogin');
    this.passwordInput = page.locator('#txtPassword');
    this.loginButton = page.locator('#btnLogin');
    this.pageHeading = page.locator('#lblHeading');
  }

  async goto(url: string): Promise<void> {
    await this.page.goto(url);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async login(username: string, password: string): Promise<void> {
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);

    await expect(this.passwordInput).toBeVisible();
    await this.passwordInput.fill(password);

    await expect(this.loginButton).toBeVisible();
    await this.loginButton.click();
  }

  async expectLoginSuccessful(): Promise<void> {
    await expect(this.pageHeading).toHaveText(/subjects/i, {
      timeout: 15000,
    });
  }
}