import {chromium } from '@playwright/test';
import loginAndSave from './login.setup';
import * as dotenv from 'dotenv';
dotenv.config();

const delay = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));

export default async function globalSetup() {

  const browser = await chromium.launch({
    headless: false,
  });
  
  await loginAndSave(
    browser,
    process.env.ERP_EMAIL1 ?? '',
    process.env.ERP_OTP ?? '',
    process.env.ERP_USER_PASSWORD1 ?? '',
    process.env.ERP_AUTO_MPIN ?? '',
    'tests/storageState/storageState.json',
    'User'
  );

  await delay(3000);  

  await loginAndSave(
    browser,
    process.env.ERP_EMAIL_HOD ?? '',
    process.env.ERP_OTP ?? '',
    process.env.ERP_ADMIN_PASSWORD ?? '',
    process.env.ERP_HOD_MPIN ?? '',
    'tests/storageState/HOD.json',
    'HOD'
  );

  // await delay(3000); 
  
  // await loginAndSave(
  //   browser,
  //   process.env.ERP_EMAIL_HR ?? '',
  //   process.env.ERP_OTP_HR ?? '',
  //   process.env.ERP_PASSWORD_HR ?? '',
  //   process.env.ERP_HR_MPIN ?? '',
  //   'tests/storageState/headhr.json',
  //   'HR'
  // );

  // await delay(3000);
  
  // await loginAndSave(
  //   browser,
  //   process.env.ERP_EMAIL_HIMAN ?? '',
  //   process.env.ERP_OTP ?? '',
  //   process.env.ERP_HIMAN_PASSWORD ?? '',
  //   process.env.ERP_HIMAN_MPIN ?? '',
  //   'tests/storageState/Himanshu.json',
  //   'Audit'
  // );

  await delay(3000);
  
  await loginAndSave(
    browser,
    process.env.ERP_EMAIL_COORDINATOR ?? '',
    process.env.ERP_OTP ?? '',
    process.env.ERP_ADMIN_PASSWORD ?? '',
    process.env.ERP_AUTO_MPIN ?? '',
    'tests/storageState/Coordinator.json',
    'Coordinator'
  );

  await delay(3000);

  await loginAndSave(
    browser,
    process.env.ERP_EMAIL_OemAdmin ?? '',
    process.env.ERP_OTP ?? '',
    process.env.ERP_ADMIN_PASSWORD ?? '',
    process.env.ERP_AUTO_MPIN ?? '',
    'tests/storageState/OemAdmin.json',
    'OemAdmin'
  );

  await browser.close();
}