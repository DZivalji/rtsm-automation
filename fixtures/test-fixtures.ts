import { test as base, expect, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DbHelper } from '../utils/db-helper';

type Fixtures = {
  loggedInPage: Page;
};

export const test = base.extend<Fixtures>({
  loggedInPage: async ({ page }, use) => {
    const dbHelper = new DbHelper();
    const loginData = await dbHelper.getLoginData();

    const loginPage = new LoginPage(page);

    await loginPage.goto(loginData.url);
    await loginPage.login(loginData.username, loginData.password);
    await loginPage.expectLoginSuccessful();

    await use(page);
  },
});

export { expect };