import dotenv from 'dotenv';
dotenv.config();
import {defineConfig} from '@playwright/test';

// export default defineConfig({
//   testDir: './tests/e2e/04-Training',
//   fullyParallel: false,
//   retries: process.env.RETRIES_CI ? 0 : 0,
//   workers: 1,
//   reporter: 'html',
//   timeout: 35 * 1000,
//   expect: { timeout: 5000 },
//   use: {    
//     acceptDownloads: true,
//     permissions: ['geolocation'],
//     geolocation: {
//       latitude: 28.6139,
//       longitude: 77.2090,
//     },
//     baseURL: process.env.ERP_URL ?? 'https://testerp.paisalo.in:8825/',
//     headless: true,
//     storageState: 'tests/storageState/storageState.json',
//     video: 'retain-on-failure',
//     screenshot: 'only-on-failure',
//     trace: 'on-first-retry',   
//     browserName: 'chromium',    
//   },
//   globalSetup: 'tests/setup/global-setup.ts',
// });

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  workers: 1,
  reporter: 'html',
  timeout: 120 * 1000,
  expect: {
    timeout: 5000
  },
  use: {
    acceptDownloads: true,
    permissions: ['geolocation'],
    geolocation: {
      latitude: 28.6139,
      longitude: 77.2090,
    },
    baseURL: process.env.ERP_URL ?? 'https://testerp.paisalo.in:8825/',
    headless: true,
    storageState: 'tests/storageState/storageState.json',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    browserName: 'chromium',
  },
  globalSetup: 'tests/setup/global-setup.ts',

//-------- Projects for 1 modules of ERP --------//

  projects: [
    {
      name: 'ABF Module Create Product',
      testDir: './tests/e2e/ABFModule/01-Documents_SubModule',
      timeout: 60 * 1000,
    },

  //   {
  //     name: 'ABF Module All Masters',
  //     testDir: './tests/e2e/ABFModule/02-Masters_SubModule',
  //     timeout: 60 * 1000,
  //   },
    
  ],
  
});