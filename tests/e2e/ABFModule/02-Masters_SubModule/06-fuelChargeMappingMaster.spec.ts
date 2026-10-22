//tests/e2e/ABFModule/02-Masters_SubModule/07-fuelChargeMappingMaster.spec.ts
import { test, expect } from '@playwright/test';
import { logRoute } from '../../../utils/routeLogger';
import { FuelChargeMappingMasterPage } from '../../../../pages/ABFModule/Masters_SubModule/fuelChargeMappingMaster.page';

test.describe('Fuel Charge Mapping Master', () => {
    let fuelChargeMappingMasterPage: FuelChargeMappingMasterPage;

    test.beforeEach(async ({ page }) => {
        page.on('framenavigated', (frame) => {
            logRoute(frame.url());
        });

        fuelChargeMappingMasterPage = new FuelChargeMappingMasterPage(page);

        await page.goto(`${process.env.ERP_URL}abf/FuelChargeMapping`);
        await page.waitForLoadState('networkidle');
    });
        
    //------------------------------- Positive Scenarios ----------------------------------//
    // ✅ Add Fuel Charge Mapping with duplicate check
    test('Add Fuel Charge Mapping', async () => {
        // Select LPG fuel type
        const fuelTypeValue = await fuelChargeMappingMasterPage.fuelType
            .locator('option')
            .filter({ hasText: /^Petrol$/ })
            .first()
            .getAttribute('value');
        await fuelChargeMappingMasterPage.fuelType.selectOption(fuelTypeValue!);

        // Select RTO charge type
        const otherOption = fuelChargeMappingMasterPage.chargeType
                            .locator('option')
                            .filter({ hasText: /^Insurance/ })
                            .first();

        await expect(otherOption).toBeAttached();

        const chargeTypeValue = await otherOption.getAttribute('value');

        await fuelChargeMappingMasterPage.chargeType.selectOption(chargeTypeValue!);

        await fuelChargeMappingMasterPage.page.waitForTimeout(500);
        await fuelChargeMappingMasterPage.stateSelect.selectOption('Maharashtra');
        await fuelChargeMappingMasterPage.page.waitForTimeout(500);
        // Check applicable
        await fuelChargeMappingMasterPage.applicableChkbox.check();

        await fuelChargeMappingMasterPage.calculationTypeSelect.selectOption('Percentage');
        await fuelChargeMappingMasterPage.page.waitForTimeout(500);
        await fuelChargeMappingMasterPage.calculateValueInput.fill('10');

        // Highlight save button for debugging
        await fuelChargeMappingMasterPage.saveButton.evaluate((el) => {
            el.style.border = '3px solid red';
            el.style.boxShadow = '0 0 10px red';
        });

        // 👉 Check if mapping already exists in table
        const existingRow = fuelChargeMappingMasterPage.page
            .locator('table tr')
            .filter({ hasText: 'LPG' })
            .filter({ hasText: 'RTO' });

        if (await existingRow.count() > 0) {
            // Mapping exists – click Save and expect duplicate message
            await fuelChargeMappingMasterPage.saveButton.click();

            const duplicateDialog = fuelChargeMappingMasterPage.page.getByRole('dialog');
            await expect(duplicateDialog).toBeVisible();
            await expect(duplicateDialog).toContainText(
                '!Duplicate MappingThis Fuel Type and Charge Type mapping already exists.'
            );
            await duplicateDialog.getByRole('button', { name: 'OK' }).click();
        } else {
            // Mapping does not exist – click Save and expect success message
            await fuelChargeMappingMasterPage.saveButton.click();

            const successDialog = fuelChargeMappingMasterPage.page.getByRole('dialog');
            await expect(successDialog).toBeVisible();
            await expect(successDialog).toContainText(
                'Fuel charge configuration has been added successfully.'
            );
            await successDialog.getByRole('button', { name: 'OK' }).click();
        }
    });

});