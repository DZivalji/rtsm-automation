import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DbHelper } from '../utils/db-helper';

test('login using URL and credentials from database', async ({ page }) => {
  const dbHelper = new DbHelper();
  const loginData = await dbHelper.getLoginData();

  const loginPage = new LoginPage(page);

  await loginPage.goto(loginData.url);
  await loginPage.login(loginData.username, loginData.password);
  await loginPage.expectLoginSuccessful();
});