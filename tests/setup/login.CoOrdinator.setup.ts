// tests/setup/login.CoOrdinator.setup.ts

import * as dotenv from 'dotenv';
dotenv.config();

import { chromium } from '@playwright/test';
import * as fs from 'fs';
import path from 'path';

(async () => {
  const browser = await chromium.launch({
    headless: true,
  });

  const context = await browser.newContext({
    permissions: ['geolocation'],
    geolocation: {
      latitude: 28.6139,
      longitude: 77.2090,
    },
  });

  const page = await context.newPage();

  try {
    console.log('🚀 Coordinator Setup Started');
    console.log('Working Directory:', process.cwd());

    // Create folder if missing
    const storageDir = path.resolve(
      'tests/storageState'
    );

    if (!fs.existsSync(storageDir)) {
      fs.mkdirSync(storageDir, {
        recursive: true,
      });
    }

    console.log('🔁 Opening Login Page');

    await page.goto(
      process.env.ERP_URL!,
      {
        waitUntil: 'networkidle',
      }
    );

    // Handle Allow popup
    try {
      const allowBtn =
        page.getByRole('button', {
          name: 'Allow',
        });

      await allowBtn.waitFor({
        timeout: 5000,
      });

      await allowBtn.click();

      console.log(
        '✔ Permission popup handled'
      );

    } catch {
      console.log(
        'ℹ No permission popup found'
      );
    }

    const email =
      process.env.ERP_EMAIL_COORDINATOR ?? '';

    const password =
      process.env.ERP_PASSWORD_COORDINATOR ?? '';

    const otp =
      process.env.ERP_OTP_COORDINATOR ?? '';

    console.log(
      '📧 Logging in as:',
      email
    );

    // Email
    await page
      .getByTestId('empcode-input-login')
      .fill(email);

    // OTP button
    await page
      .getByRole('button', {
        name: 'OTP',
      })
      .click();

    // OTP field
    await page
      .getByTestId('otp-input-login')
      .fill(otp);

    // Wait for password field
    const passwordSelector = await page.getByTestId('password-login-password');

    // console.log('🔁 Waiting for password field to be enabled...');
    // await page.waitForFunction((selector) => {
    //   const input = document.querySelector(selector) as HTMLInputElement | null;
    //   return input !== null && input.disabled === false;
    // }, passwordSelector, { timeout: 10000 });


    console.log('🔁 Filling password...');
    await passwordSelector.fill(password);

    // Login
    await page
      .getByRole('button', {
        name: 'Login',
      })
      .click();

    console.log(
      '🔁 Waiting for Dashboard'
    );

    await page.waitForURL(
      '**/hrms/EmpAttendence',
      {
        timeout: 30000,
      }
    );

    console.log(
      '✅ Login Successful'
    );

    console.log(
      'Current URL:',
      page.url()
    );

    // Token
   const localStorageData = await page.evaluate(() => {
  const data: Record<string, string | null> = {};

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      data[key] = localStorage.getItem(key);
    }
  }

    return data;
    });

    console.log(
    'Local Storage Data:',
    JSON.stringify(localStorageData, null, 2)
    );

    // Save token
    const tokenPath =
      path.resolve(
        'tests/storageState/COORDINATOR-local-token.json'
      );

    fs.writeFileSync(
      tokenPath,
      JSON.stringify(
        { localStorageData },
        null,
        2
      )
    );

    console.log(
      '✅ Token JSON Saved'
    );

    // Check state before save
    const state =
      await context.storageState();

    console.log(
      'Cookies:',
      state.cookies.length
    );

    console.log(
      'Origins:',
      state.origins.length
    );

    // Save Playwright state
    const statePath =
      path.resolve(
        'tests/storageState/COORDINATOR.json'
      );

    console.log(
      '💾 Saving Storage State'
    );

    await context.storageState({ path: 'auth/storageState/COORDINATOR.json' });
    await context.storageState({ path: 'tests/storageState/COORDINATOR-local-token.json' });
    await context.storageState({
      path: statePath,
    });

    console.log(
      '📁 Storage State Saved'
    );

    console.log(
      'State Exists:',
      fs.existsSync(statePath)
    );

    console.log(
      'Token Exists:',
      fs.existsSync(tokenPath)
    );

    if (
      fs.existsSync(statePath)
    ) {
      console.log(
        'State File Size:',
        fs.statSync(statePath).size,
        'bytes'
      );
    }

    console.log(
      '🎉 Coordinator Setup Completed'
    );

  } catch (error) {

    console.error(
      '❌ Setup Failed:',
      error
    );

    await page.screenshot({
      path:
        'tests/storageState/coordinator-login-error.png',
      fullPage: true,
    });

  } finally {

    await browser.close();

  }
})();