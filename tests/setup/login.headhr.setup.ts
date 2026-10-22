//setup/login.headhr.setup.ts
import * as dotenv from 'dotenv';
dotenv.config();
import { chromium } from '@playwright/test';
import * as fs from 'fs';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const headHrEmail = process.env.ERP_EMAIL_HR || '';
  const headHrPassword = process.env.ERP_PASSWORD_HR || '';
  const headHrOtp = process.env.ERP_OTP_HR || '';

  await page.goto(`${process.env.ERP_URL}`);
  await page.fill('input[placeholder="example@paisalo.in"]', headHrEmail);
  await page.click('button:text("OTP")');
  await page.waitForSelector('input[placeholder="Enter OTP"]');
  await page.fill('input[placeholder="Enter OTP"]', headHrOtp);

  const passwordSelector = 'input[type="password"]';
  await page.waitForFunction(selector => {
    const input = document.querySelector<HTMLInputElement>(selector);
    return input && !input.disabled;
  }, passwordSelector);
  await page.fill(passwordSelector, headHrPassword);
  await page.click('button:text("Login")');

  // Wait for login and network calls
  await page.waitForLoadState('networkidle');

  // ⬇️ Extract localStorage token
  const token = await page.evaluate(() => {
    return localStorage.getItem('token'); 
  });

  fs.writeFileSync('tests/storageState/hr-local-token.json', JSON.stringify({ token }));

  // ⬇️ Save cookies/session storage
  await context.storageState({ path: 'tests/storageState/headhr.json' });

  await browser.close();
})();
