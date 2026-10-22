//tests/e2e/ABFModule/SOD_SubModule/01-StartEndOfDayABF.spec.ts
import { test, expect } from '@playwright/test';
import { StartEndOfDayABFPage } from '../../../../pages/ABFModule/SOD_SubModule/StartEndOfDayABF.page';
import { logRoute } from '../../../utils/routeLogger';

test.use({
    storageState: 'auth/storageState.json',
});

test.describe('Start and End of Day ABF Module', () => {
    // test('should allow user to submit start and end of day', async ({ page }) => {
    //     const startEndOfDayABFPage = new StartEndOfDayABFPage(page);
    //     page.on('framenavigated', (frame) => {
    //         logRoute(frame.url());
    //     });
    //     await page.goto(`${process.env.ERP_URL}abf/StartEndOfDayABF`);
    //     await page.waitForLoadState('networkidle');
    //     await startEndOfDayABFPage.startDate.fill('2023-01-01');
    //     await startEndOfDayABFPage.endDate.fill('2023-01-31');
    //     await startEndOfDayABFPage.submitButton.click();
    //     await startEndOfDayABFPage.startEndOfDayTable.isVisible();
    // });
});