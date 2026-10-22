//tests/e2e/ABFModule/02-Masters_SubModule/04-subModelMaster.spec.ts
import { test, expect } from '@playwright/test';
import { SubModelMasterPage } from '../../../../pages/ABFModule/Masters_SubModule/subModelMaster.page';
import { logRoute } from '../../../utils/routeLogger';

test.use({
    storageState: 'tests/storageState/storageState.json',
});

test.describe('Sub Model Master Page Automation', () => {
    let subModelMasterPage: SubModelMasterPage;

    test.beforeEach(async ({ page }) => {
        page.on('framenavigated', (frame) => {
            logRoute(frame.url());
        });

        subModelMasterPage = new SubModelMasterPage(page);

        await page.goto(`${process.env.ERP_URL}abf/submodelmaster`);
        await page.waitForLoadState('networkidle');
    });

    //------------------------------- Positive Scenarios ----------------------------------//
    // ✅ Add Sub Model
    test('Add Sub Model', async () => {
        const name = `Jupiter${Date.now()}`;

        await subModelMasterPage.brandNameSelect.fill('TVS');
        await subModelMasterPage.page.getByRole('option', { name: 'TVS', exact: true }).click();
        await subModelMasterPage.brandNameSelect.press('Enter');

        await subModelMasterPage.page.waitForTimeout(2000);
        await subModelMasterPage.modelNameSelect.fill('Jupiter 125');
        await subModelMasterPage.page.getByRole('option', { name: 'Jupiter 125', exact: true }).click();

        await subModelMasterPage.fuelTypeSelect.fill('PETROL');
        await subModelMasterPage.page.getByRole('option', { name: 'PETROL', exact: true }).click();

        await subModelMasterPage.subModelName.fill(name);
        await subModelMasterPage.description.fill('Test Description');

        await subModelMasterPage.creatreButton.click();

        // ✅ Better success handling
        await expect(
            subModelMasterPage.page.getByText(/created successfully/i)
        ).toBeVisible();

        await subModelMasterPage.page.getByRole('button', { name: 'OK' }).click();

        // 🔍 Search & Verify
        await subModelMasterPage.searchBySubModel.fill(name);

        await subModelMasterPage.searchBySubModel.fill(name);

        await expect(
            subModelMasterPage.page.getByRole('row', { name: name })
        ).toBeVisible();
    });

    test('Duplicate Sub Model Validation', async () => {
        const name = 'Jupiter 125';

        await subModelMasterPage.brandNameSelect.click();
        await subModelMasterPage.brandNameSelect.fill('TVS');
        await subModelMasterPage.page.getByRole('option', { name: 'TVS', exact: true }).click();
        await subModelMasterPage.brandNameSelect.press('Enter');

        await subModelMasterPage.page.waitForTimeout(2000);
        await subModelMasterPage.modelNameSelect.fill('Jupiter 125');
        await subModelMasterPage.page.getByRole('option', { name: 'Jupiter 125', exact: true }).click();

        await subModelMasterPage.fuelTypeSelect.click();
        await subModelMasterPage.fuelTypeSelect.fill('PETROL');
        await subModelMasterPage.page
        .getByRole('option', { name: 'PETROL', exact: true })
        .click();
        await subModelMasterPage.fuelTypeSelect.press('Enter');
        await subModelMasterPage.subModelName.fill(name);
        await subModelMasterPage.description.fill('Duplicate Test');

        await subModelMasterPage.creatreButton.click();

        const dialog = subModelMasterPage.page.getByRole('dialog', {
            name: /^(WARNING|Error)$/i
        });

        const errorMessage = dialog.getByText(
            /A deactivate record exists with this name! Please activate and use it\.|This record already exists in Database!|A model with the same name, brand, model, and fuel type already exists\./i
        );

        await expect(dialog).toBeVisible();
        await expect(errorMessage).toBeVisible();

        await dialog.getByRole('button', { name: 'OK' }).click();

    });

    test('Search Sub Model', async () => {
        const name = 'Jupiter 125';

        await subModelMasterPage.searchBySubModel.fill(name);
        await expect(
            subModelMasterPage.page.getByRole('row', { name: name }).first()
        ).toBeVisible();
    });

    test('Edit Sub Model', async () => {
        const name = 'Jupiter 125';
        const updatedDesc = 'Updated Description';

        await subModelMasterPage.searchBySubModel.fill(name);

        await subModelMasterPage.searchBySubModel.fill(name);

        const row = subModelMasterPage.page.getByRole('row', { name: name }).first();
        await expect(row).toBeVisible();

        await row.getByRole('button', { name: /edit/i }).click();

        await subModelMasterPage.description.fill(updatedDesc);

        await subModelMasterPage.creatreButton.click();

        await expect(
            subModelMasterPage.page.getByText(/updated successfully/i)
        ).toBeVisible();

        await subModelMasterPage.page.getByRole('button', { name: 'OK' }).click();
    });

    test('Toggle Active/Inactive', async () => {
        const name = 'Jupiter 125';

        await subModelMasterPage.searchBySubModel.fill(name);

        await subModelMasterPage.getsubModelRow(name);

        const row = subModelMasterPage.page.getByRole('row').filter({ hasText: name }).first();

        await expect(row).toBeVisible();
        await row.locator('.react-switch-bg').click();

        await subModelMasterPage.page.getByRole('button', { name: 'Yes' }).click();

        await expect(
            subModelMasterPage.page.getByText(/successfully/i)
        ).toBeVisible();

        await subModelMasterPage.page.getByRole('button', { name: 'OK' }).click();
    });

    test('Table Load', async () => {
        await expect(subModelMasterPage.resultTable).toBeVisible();

        await expect(subModelMasterPage.tableRows.first()).toBeVisible();

        const count = await subModelMasterPage.tableRows.count();

        console.log('Rows Found:', count);

        expect(count).toBeGreaterThan(0);
    });
});