//pages/ABFModule/Masters_SubModule/fuelTypeMaster.page.ts
import { expect, Locator, Page } from '@playwright/test';

export class FuelTypeMasterPage {
    readonly page: Page;
    readonly fuelType: Locator;
    readonly fuelTypeDescription: Locator;
    readonly searchByfuelType: Locator;
    readonly saveButton: Locator;
    readonly updateButton: Locator;
    readonly searchInput: Locator;
    readonly resultTable: Locator;
    readonly tableRows: Locator;

    constructor(page: Page) {
        this.page = page;
        this.fuelType = page.locator('input[placeholder="Enter Fuel Type"]');
        this.fuelTypeDescription = page.locator('input[placeholder="Enter Description"]');
        this.searchByfuelType = page.locator('input[placeholder="Search by Fuel Type"]');
        this.saveButton = page.locator('button:has-text("Add")');
        this.updateButton = page.locator('button:has-text("Update")');
        this.searchInput = page.locator('input[placeholder="Search by Fuel Type..."]');

        this.resultTable = page.locator('table');
        this.tableRows = page.locator('table tbody tr');
    }

    // ---------- HANDLE NO RECORD ----------
    async handleNoRecordPopup() {
        const popup = this.page.locator('text=No records found');
        await expect(popup).toBeVisible({ timeout: 1000 });
        await this.page.getByRole('button', { name: 'OK' }).click();
    }

    // async verifyFuelTypeInTable(fuelTypeName: string) {
    // await this.searchByfuelType.fill(fuelTypeName);

    // // optional wait if API call happens
    // await this.page.waitForTimeout(1000);

    // const row = this.page.locator(`table tbody tr:has-text("${fuelTypeName}")`);
    // await expect(row).toBeVisible();
    // }

    async verifyFuelTypeExact(fuelTypeName: string) {
    const rows = this.tableRows;

    const count = await rows.count();

    let found = false;

    for (let i = 0; i < count; i++) {
        const fuelTypeCell = rows.nth(i).locator('td').nth(1); // Fuel Type column
        const text = await fuelTypeCell.textContent();

        if (text?.trim() === fuelTypeName) {
            found = true;
            break;
        }
    }

    expect(found).toBeTruthy();
    }

    // getFuelTypeRow(fuelTypeName: string) {
    // return this.page.locator(`table tbody tr:has(td:text("${fuelTypeName}"), { exact: true })`);
    // }

    getFuelTypeRow(fuelTypeName: string) {
    return this.page.locator('tbody tr').filter({
        has: this.page.getByRole('cell', { name: fuelTypeName, exact: true })
    });
}

    getEditButton(fuelTypeName: string) {
    return this.getFuelTypeRow(fuelTypeName).locator('button').first();
    }

    getToggleCheckbox(fuelTypeName: string) {
    return this.getFuelTypeRow(fuelTypeName)
        .locator('input[type="checkbox"]');
    }

    getToggleSwitch(fuelTypeName: string) {
    return this.getFuelTypeRow(fuelTypeName)
        .locator('.react-switch');
    }
    
}