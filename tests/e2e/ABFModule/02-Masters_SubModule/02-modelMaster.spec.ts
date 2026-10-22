//tests/e2e/ABFModule/02-Masters_SubModule/03-modelMaster.spec.ts
import { test, expect } from '@playwright/test';
import { ModelMasterPage } from '../../../../pages/ABFModule/Masters_SubModule/modelMaster.page';
import { logRoute } from '../../../utils/routeLogger';

test.use({
    storageState: 'tests/storageState/storageState.json',
});

test.describe('Model Master Page Automation', () => {
    let modelMasterPage: ModelMasterPage;

    test.beforeEach(async ({ page }) => {
        page.on('framenavigated', (frame) => {
            logRoute(frame.url());
        });

        modelMasterPage = new ModelMasterPage(page);

        await page.goto(`${process.env.ERP_URL}abf/ModelMaster`);
        await page.waitForLoadState('networkidle');
    });

    // ✅ Add Model
    test('Add Model Successfully', async () => {
        const uniquemodelName = `Jupiter ${Date.now()}`;
        await modelMasterPage.selectBrand('TVS');
        // await modelMasterPage.selectVehicle('Hero Splender');
        // await modelMasterPage.selectFuelType('PETROL');
        await modelMasterPage.modelName.fill(uniquemodelName);
        await modelMasterPage.description.fill('A bike for a man choice');
        await modelMasterPage.creatreButton.click();
        await expect(modelMasterPage.page.locator('text=Model created successfully.')).toBeVisible({ timeout: 5000 });

        await modelMasterPage.page.getByRole('button', { name: 'OK' }).click();
        // Verify in table
        try {
        await modelMasterPage.handleNoRecordPopup();
        } catch {
        await expect(modelMasterPage.resultTable).toBeVisible();
        const rowCount = await modelMasterPage.tableRows.count();
        console.log(`Rows Found: ${rowCount}`);
        }
    });
});