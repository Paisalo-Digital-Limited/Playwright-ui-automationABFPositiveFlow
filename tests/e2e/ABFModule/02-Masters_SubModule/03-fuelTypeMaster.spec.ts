//tests/e2e/ABFModule/02-Masters_SubModule/04-fuelTypeMaster.spec.ts
import { test, expect } from '@playwright/test';
import { FuelTypeMasterPage } from '../../../../pages/ABFModule/Masters_SubModule/fuelTypeMaster.page';
import { logRoute } from '../../../utils/routeLogger';

test.use({
    storageState: 'tests/storageState/storageState.json',
});

test.describe('Fuel Type Master Page Automation', () => {
    let fuelTypeMasterPage: FuelTypeMasterPage;

    test.beforeEach(async ({ page }) => {
        page.on('framenavigated', (frame) => {
            logRoute(frame.url());
        });

        fuelTypeMasterPage = new FuelTypeMasterPage(page);

        await page.goto(`${process.env.ERP_URL}abf/FuelTypeMaster`);
        await page.waitForLoadState('networkidle');
    });
    function randomAlpha(length: number = 5) {
        const chars = 'abcdefghijklmnopqrstuvwxyz';
        return Array.from({ length }, () =>
            chars[Math.floor(Math.random() * chars.length)]
        ).join('');
    }

    //------------------------------- Positive Scenarios ----------------------------------//
    // ✅ Add Fuel Type
    test('Add + Edit + Activate/Deactivate Fuel Type', async () => {
        const fuelTypeName = `Petrol${randomAlpha()}`; 
        const updatedDesc = 'Updated Description';

        // 1. ADD
        await fuelTypeMasterPage.fuelType.fill(fuelTypeName);
        await fuelTypeMasterPage.fuelTypeDescription.fill('Initial Desc');
        await fuelTypeMasterPage.saveButton.click();

        await expect(fuelTypeMasterPage.page.getByRole('dialog')).toContainText('Fuel Type added successfully.');
        await fuelTypeMasterPage.page.getByRole('button', { name: 'OK' }).click();

        // 2. SEARCH & VERIFY
        await fuelTypeMasterPage.searchInput.fill(fuelTypeName);
        // Use an assertion instead of waitForTimeout; Playwright will retry until visible
        const row = fuelTypeMasterPage.getFuelTypeRow(fuelTypeName);
        await fuelTypeMasterPage.page.waitForTimeout(1000);
        await expect(row).toBeVisible();

        // 3. EDIT
        await fuelTypeMasterPage.getEditButton(fuelTypeName).click();
        await fuelTypeMasterPage.fuelTypeDescription.fill(updatedDesc);
        await fuelTypeMasterPage.updateButton.click();

        await expect(fuelTypeMasterPage.page.locator('text=Fuel Type updated successfully.')).toBeVisible();
        await fuelTypeMasterPage.page.getByRole('button', { name: 'OK' }).click();

        // 4. TOGGLE STATUS
        // Search again to ensure the table refreshed after edit
        await fuelTypeMasterPage.searchInput.fill(fuelTypeName);
        const updatedRow = fuelTypeMasterPage.getFuelTypeRow(fuelTypeName);
        await expect(updatedRow).toContainText(updatedDesc);

        // Determine current state BEFORE clicking to validate the success message later
        // Note: getToggleCheckbox should point to the hidden input[type="checkbox"]
        const checkbox = fuelTypeMasterPage.getToggleCheckbox(fuelTypeName);
        const isActive = await checkbox.isChecked(); 
        
        console.log(`Current Status: ${isActive ? 'Active' : 'Inactive'}`);

        // Target the clickable part of the React Switch
        const toggle = updatedRow.locator('.react-switch-bg, .react-switch');
        await toggle.click();

        await expect(fuelTypeMasterPage.page.locator('text=Fuel Type Deactivated Successfully')).toBeVisible();
        await toggle.click();

        await expect(fuelTypeMasterPage.page.locator('text=Fuel Type Activated Successfully')).toBeVisible();
        // // Confirm dialog
        // await fuelTypeMasterPage.page.getByRole('button', { name: 'Yes' }).click();

        // // Success validation using the state captured before the click
        // const expectedStatusMsg = isActive ? 'deactivated' : 'activated';
        // await expect(
        //     fuelTypeMasterPage.page.locator(`text=Record ${expectedStatusMsg} successfully.`)
        // ).toBeVisible();

        // await fuelTypeMasterPage.page.getByRole('button', { name: 'OK' }).click();
        // console.log(`🔄 Status Toggled Successfully to ${isActive ? 'Inactive' : 'Active'}`);
    });
});