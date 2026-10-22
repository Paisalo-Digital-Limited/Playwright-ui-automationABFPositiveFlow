//setup/login.HOD.setup.ts
import * as dotenv from 'dotenv';
dotenv.config();
import { chromium } from '@playwright/test';
import * as fs from 'fs';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const hodEmail = process.env.ERP_EMAIL_HOD || '';
  const hodPassword = process.env.ERP_PASSWORD_HOD || '';
  const hodOtp = process.env.ERP_OTP_HOD || '';

  await page.goto(`${process.env.ERP_URL}`);
  await page.fill('input[placeholder="example@paisalo.in"]', hodEmail);
  await page.click('button:text("OTP")');
  await page.waitForSelector('input[placeholder="Enter OTP"]');
  await page.fill('input[placeholder="Enter OTP"]', hodOtp);

  const passwordSelector = 'input[type="password"]';
  await page.waitForFunction(selector => {
    const input = document.querySelector<HTMLInputElement>(selector);
    return input && !input.disabled;
  }, passwordSelector);
  await page.fill(passwordSelector, hodPassword);
  await page.click('button:text("Login")');

  // Wait for login and network calls
  await page.waitForLoadState('networkidle');

  // ⬇️ Extract localStorage token
  const token = await page.evaluate(() => {
    return localStorage.getItem('token'); 
  });

  fs.writeFileSync('tests/storageState/HOD-local-token.json', JSON.stringify({ token }));

  // ⬇️ Save cookies/session storage
  await context.storageState({ path: 'tests/storageState/HOD.json' });

  await browser.close();
})();
