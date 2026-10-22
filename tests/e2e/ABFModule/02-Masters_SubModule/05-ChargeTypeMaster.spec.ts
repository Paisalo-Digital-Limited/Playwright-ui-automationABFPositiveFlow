//tests/e2e/ABFModule/02-Masters_SubModule/06-ChargeTypeMaster.spec.ts
import { test, expect } from '@playwright/test';
import { ChargeTypeMasterPage } from '../../../../pages/ABFModule/Masters_SubModule/chargeTypeMaster.page';
import { logRoute } from '../../../utils/routeLogger';

test.use({
    storageState: 'tests/storageState/storageState.json',
});

test.describe('Charge Type Master Page Automation', () => {
    let chargeTypeMasterPage: ChargeTypeMasterPage;

    test.beforeEach(async ({ page }) => {
        page.on('framenavigated', (frame) => {
            logRoute(frame.url());
        });

        chargeTypeMasterPage = new ChargeTypeMasterPage(page);

        await page.goto(`${process.env.ERP_URL}Oem/ChargeTypeMaster`);
        await page.waitForLoadState('networkidle');
    });

    //------------------------------- Positive Scenarios ----------------------------------//
    // ✅ Add Charge Type
    test('Add + Edit + Activate/Deactivate Charge Type', async () => {
        const chargeTypeName = `Other${Date.now()}`;
        const updatedDesc = 'Updated Description';

        // ✅ ADD
        await chargeTypeMasterPage.chargeType.fill(chargeTypeName);
        await chargeTypeMasterPage.chargeTypeDescription.fill('Insurance is a legal contract policy between an individual or business and an insurance company, providing financial protection against unexpected losses, damages, or injuries in exchange for regular premium payments.');
        await chargeTypeMasterPage.saveButton.click();

        const successDialog = chargeTypeMasterPage.page.getByRole('dialog');
        await expect(successDialog.locator('text=Charge Type added successfully')).toBeVisible({ timeout: 5000 });
        await successDialog.getByRole('button', { name: 'OK' }).click();

        // ✅ SEARCH + WAIT
        await chargeTypeMasterPage.searchInput.fill(chargeTypeName);
        await chargeTypeMasterPage.page.waitForTimeout(1000);
        const row = chargeTypeMasterPage.page.getByRole('row', {
            name: new RegExp(chargeTypeName),
            });

        await expect(row).toBeVisible();

        console.log(`✅ Charge Type Found: ${chargeTypeName}`);

        // ✅ EDIT
        await row.locator('[id^="edit-btn"]').click();  // matches any id starting with "edit-btn"
        await chargeTypeMasterPage.chargeTypeDescription.fill(updatedDesc);
        await chargeTypeMasterPage.saveButton.click();


        await expect(
            chargeTypeMasterPage.page.locator('text=Charge Type updated successfully')
        ).toBeVisible();

        await chargeTypeMasterPage.page.getByRole('button', { name: 'OK' }).click();

        // ✅ VERIFY UPDATED DESCRIPTION
        await chargeTypeMasterPage.searchInput.fill(chargeTypeName);
        await chargeTypeMasterPage.page.waitForTimeout(1000);
        const updatedRow = chargeTypeMasterPage.page.getByRole('row', {
            name: new RegExp(chargeTypeName),
            });
        await expect(updatedRow).toBeVisible();
        const updatedDescText = await updatedRow.getByRole('cell', { name: updatedDesc }).textContent();
        expect(updatedDescText).toBe(updatedDesc);
    });
    
});