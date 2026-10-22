import { ChromiumBrowser } from 'playwright';
import { expect } from 'playwright/test';

async function loginAndSave(browser: ChromiumBrowser, email: string, otp: string, password: string, mpin: string, storagePath: string, roleName: string): Promise<void> {
  console.log('==============================================');
  console.log(`Starting login for: ${roleName}`);
  console.log('==============================================');

  // CREATE BROWSER CONTEXT
  const context = await browser.newContext({ ignoreHTTPSErrors: true, permissions: ['geolocation'], geolocation: { latitude: 28.6139, longitude: 77.2090 } });
  const page = await context.newPage();

  try {
    // OPEN LOGIN PAGE
    const erpUrl = process.env.ERP_URL || '';
    if (!erpUrl) { throw new Error('ERP_URL is not configured in environment variables.'); }
    console.log(`Opening ERP URL: ${erpUrl}`);
    await page.goto(erpUrl, { waitUntil: 'domcontentloaded', timeout: 90000 });
    console.log(`Current URL: ${page.url()}`);
    await page.screenshot({ path: 'tests/setup/beforeAllow.png', fullPage: true });

    // HANDLE BROWSER LOCATION / ALLOW BUTTON
    const allowButton = page.getByRole('button', { name: 'Allow', exact: true });
    try {
      await allowButton.waitFor({ state: 'visible', timeout: 10000 });
      console.log('Allow button found.');
      await allowButton.click();
      console.log('Location permission allowed.');
    } catch {
      console.log('Allow button not displayed. Continuing login...');
    }
    await page.waitForTimeout(1000);

    // USERNAME / EMPLOYEE CODE
    const userInput = page.getByTestId('empcode-input-login');
    await expect(userInput).toBeVisible({ timeout: 60000 });
    await userInput.fill(email);
    console.log(`Employee code/email filled for ${roleName}`);
    await userInput.press('Enter');
    console.log(`Login request submitted for ${roleName}`);
    await page.screenshot({ path: 'tests/setup/beforeOtpFill.png', fullPage: true });

    // OPTIONAL TOAST / ALERT
    const toast = page.getByRole('alert');
    try {
      await toast.waitFor({ state: 'visible', timeout: 5000 });
      const toastText = await toast.textContent();
      if (toastText) { console.log(`Toast: ${toastText.trim()}`); }
    } catch {
      console.log('No alert/toast displayed.');
    }

    // OTP
    const otpInput = page.getByTestId('otp-input-login');
    await expect(otpInput).toBeVisible({ timeout: 60000 });
    await otpInput.fill(otp);
    console.log(`OTP filled successfully for ${roleName}`);

    // PASSWORD
    const passwordInput = page.getByTestId('password-login-password');
    await expect(passwordInput).toBeVisible({ timeout: 60000 });
    await passwordInput.fill(password);
    console.log(`Password filled for ${roleName}`);
    await passwordInput.press('Enter');
    console.log(`Password submitted for ${roleName}`);
    await page.waitForTimeout(2000); // give the app time to process login response

    // CREATE MPIN
    const createMpinCard = page.locator('div.bg-white.p-6.rounded-lg.shadow-lg.w-full.max-w-sm.relative').filter({ has: page.locator('h3', { hasText: 'Create MPIN' }) });
    const createMpinVisible = await createMpinCard.isVisible({ timeout: 5000 }).catch(() => false);
    if (createMpinVisible) {
      console.log(`Create MPIN screen found for ${roleName}`);
      const newMpinInput = createMpinCard.getByTestId('setup-mpin-new-input');
      await expect(newMpinInput).toBeVisible({ timeout: 60000 });
      await newMpinInput.fill(mpin);
      const confirmMpinInput = createMpinCard.getByTestId('setup-mpin-confirm-input');
      await expect(confirmMpinInput).toBeVisible({ timeout: 60000 });
      await confirmMpinInput.fill(mpin);
      const saveMpinButton = createMpinCard.getByTestId('save-mpin-button');
      await expect(saveMpinButton).toBeVisible({ timeout: 60000 });
      await expect(saveMpinButton).toBeEnabled();
      await saveMpinButton.click();
      console.log(`MPIN created successfully for ${roleName}`);
      await page.waitForTimeout(1000); // give app time to move to next screen
    } else {
      console.log(`Create MPIN screen not displayed for ${roleName}`);
    }

    // VERIFY MPIN
    const verifyMpinCard = page.locator('div.bg-white.p-6.rounded-lg.shadow-lg.w-full.max-w-sm.relative').filter({ has: page.locator('h3', { hasText: 'Verify MPIN' }) });
    const verifyMpinVisible = await verifyMpinCard.isVisible({ timeout: 5000 }).catch(() => false);
    if (verifyMpinVisible) {
      console.log(`Verify MPIN screen found for ${roleName}`);
      const verifyMpinInput = verifyMpinCard.getByTestId('verify-mpin-input');
      await expect(verifyMpinInput).toBeVisible({ timeout: 60000 });
      await verifyMpinInput.fill(mpin);
      const verifyMpinButton = verifyMpinCard.getByTestId('verify-mpin-submit-button');
      await expect(verifyMpinButton).toBeVisible({ timeout: 60000 });
      await expect(verifyMpinButton).toBeEnabled();
      await verifyMpinButton.click();
      console.log(`MPIN verification submitted for ${roleName}`);
      await page.waitForTimeout(1500);
    } else {
      console.log(`Verify MPIN screen not displayed for ${roleName}`);
    }

    // SCREENSHOT AFTER LOGIN
    await page.screenshot({ path: 'tests/setup/afterEnterPassword.png', fullPage: true });
    console.log(`Waiting for HRMS page for ${roleName}...`);

    // IMPORTANT: DO NOT USE networkidle HERE - ERP app continuously makes background requests, so networkidle can timeout
    await page.waitForURL('**/hrms/**', { timeout: 90000, waitUntil: 'domcontentloaded' });
    console.log(`HRMS page loaded for ${roleName}`);
    console.log(`Dashboard URL: ${page.url()}`);

    // OPTIONAL SHORT WAIT FOR SPA UI
    await page.waitForTimeout(1000);

    // FINAL SCREENSHOT
    await page.screenshot({ path: 'tests/setup/hrmsEmpAttendancePage.png', fullPage: true });

    // SAVE STORAGE STATE
    await context.storageState({ path: storagePath });
    console.log(`Storage state saved for ${roleName}`);
    console.log('==============================================');
    console.log(`LOGIN SUCCESSFUL: ${roleName}`);
    console.log('==============================================');
  } catch (error) {
    // ERROR SCREENSHOT
    try { await page.screenshot({ path: `tests/setup/login-error-${roleName}.png`, fullPage: true }); } catch { /* Ignore screenshot failure */ }
    console.error(`Login failed for ${roleName}`);
    console.error(error);
    throw error;
  } finally {
    const loader = page.locator('loader_overlay');
    if((await loader.count()) > 0){
      await expect(loader).toBeHidden({timeout: 90000});
    }
    //await page.waitForLoadState('networkidle');
    await page.waitForURL('**/hrms/**', { timeout: 90000 });
    console.log(`Login successful for ${roleName}, dashboard loaded:${page.url()}`);
    await page.screenshot({
      path: 'tests/setup/hrmsEmpAttendancePage.png',
      fullPage: true
    });
    await context.storageState({ path: storagePath });
    console.log(`Storage state saved for ${roleName}`);
    await context.close();
    console.log(`Context closed for ${roleName}`);
  }
}

export default loginAndSave;