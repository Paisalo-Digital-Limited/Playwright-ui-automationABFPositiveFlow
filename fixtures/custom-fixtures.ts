import { test as base, type Page } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

// Define a custom type for the fixture
type MyFixtures = {
  loginPage: LoginPage;
};

export const test = base.extend<MyFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
});
