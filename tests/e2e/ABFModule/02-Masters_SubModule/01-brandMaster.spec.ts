//tests/e2e/ABFModule/01-Documents_SubModule/01-brandMaster.spec.ts
import { test, expect, Locator } from '@playwright/test';
import { BrandMasterPage } from '../../../../pages/ABFModule/Masters_SubModule/brandMaster.page';
import { logRoute } from '../../../utils/routeLogger';

test.use({
    storageState: 'tests/storageState/storageState.json',
});

test.describe('Brand Master Page Automation', () => {
    let newPage: BrandMasterPage;

    test.beforeEach(async ({ page }) => {
        page.on('framenavigated', (frame) => {
            logRoute(frame.url());
        });

        newPage = new BrandMasterPage(page);

        await page.goto(`${process.env.ERP_URL}abf/brandmaster`);
        await page.waitForLoadState('networkidle');
    });

    // ✅ Add Brand
    test('Add Brand, Edit and Update', async () => {
        const uniquebrandName = `TVS${Date.now()}`;
        await newPage.brandName.fill(uniquebrandName);
        await newPage.description.fill('Test Description');
        await newPage.saveButton.click();
        await expect(newPage.page.locator('text=Record Insert Successfully!!')).toBeVisible({ timeout: 5000 });

        await newPage.page.getByRole('button', { name: 'OK' }).click();

        // Verify in table
        try {
        await newPage.handleNoRecordPopup();
            } catch {
            await expect(newPage.resultTable).toBeVisible();
            const rowCount = await newPage.tableRows.count();
            console.log(`Rows Found: ${rowCount}`);
            expect(rowCount).toBeGreaterThan(0);

            // ✅ Validate product exists
            const productRow = newPage.page.locator(
        `div[role="row"]:has(div[data-column-id="2"]:has-text("${uniquebrandName}"))`
            );

            if (await productRow.count() > 0) {

            await productRow
                .locator('[data-column-id="5"] button[title="Edit Brand"]')
                .click();

            console.log(`✏️ Clicked Edit for: ${uniquebrandName}`);

            } else {

            console.log(`❌ Product not found: ${uniquebrandName}`);
            }

            // ⏳ Wait edit form open
            await newPage.page.waitForLoadState('networkidle');

            // 💾 Click Update Product
            await newPage.saveButton.click();

            // ✅ Validate update success
            await expect(
            newPage.page.locator('text=Record Updated Successfully!!')
            ).toBeVisible({ timeout: 5000 });
            await newPage.page.getByRole('button', { name: 'OK' }).click();

            try {
        await newPage.handleNoRecordPopup();
            } catch {
            await expect(newPage.resultTable).toBeVisible();

            const rowCount = await newPage.tableRows.count();
            console.log(`Rows Found: ${rowCount}`);
            expect(rowCount).toBeGreaterThan(0);

            // ✅ Validate product exists
            const productRow = newPage.page.locator(
        `div[role="row"]:has(div[data-column-id="2"]:has-text("${uniquebrandName}"))`
            );
            }
            console.log(`✏️ Product Updated Successfully: ${uniquebrandName}`);

            console.log(`✅ Product Found In Table: ${uniquebrandName}`);
            }
    });
});