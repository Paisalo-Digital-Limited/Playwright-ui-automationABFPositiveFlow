//pages/ABFModule/Masters_SubModule/modelMaster.page.ts
import { Page, Locator, expect } from '@playwright/test';
export class ModelMasterPage {
    readonly page: Page;
    readonly brandNamedropdown: Locator;
    // readonly vehicleNamedropdown: Locator;
    // readonly fuelTypeDropdown: Locator;
    readonly modelName: Locator;
    readonly description: Locator;
    readonly creatreButton: Locator;
    readonly resultTable: Locator;
    readonly tableRows: Locator;
    readonly brandNameCells: Locator;
    readonly vehicleNameCells: Locator;
    readonly fuelTypeCells: Locator;
    readonly modelNameCells: Locator;
    readonly searchInput: Locator;
    constructor(page: Page) {
        this.page = page;
        this.brandNamedropdown = page.locator('select').filter({
            has: page.locator('option', { hasText: 'Select Brand' })
        });

        // Model Name
        this.modelName = page.locator('input[maxlength="50"]');

        // Description
        this.description = page.locator('input[maxlength="200"]');

        // Create button
        this.creatreButton = page.getByRole('button', { name: /CREATE/i });
        // this.brandNamedropdown = page.locator('[inputid="mm-select-vechicle-brand"]');
        // this.modelName = page.getByTestId('vm-input-model-name');
        // this.description = page.getByTestId('vm-input-description');
        // this.creatreButton = page.getByTestId('vm-button-submit');
        this.searchInput = page.getByTestId('vm-input-search');
        this.resultTable = page.locator('div[role="table"]');
        this.tableRows = page.locator('div[role="rowgroup"] div[role="row"]');
        this.brandNameCells = page.locator('div[role="row"] div[data-column-id="2"]');
        this.vehicleNameCells = page.locator('div[role="row"] div[data-column-id="3"]');
        this.fuelTypeCells = page.locator('div[role="row"] div[data-column-id="4"]');
        this.modelNameCells = page.locator('div[role="row"] div[data-column-id="5"]');
    }

    // ---------- HANDLE NO RECORD ----------
    async handleNoRecordPopup() {
    const popup = this.page.locator('text=No records found');
    await expect(popup).toBeVisible({ timeout: 1000 });
    await this.page.getByRole('button', { name: 'OK' }).click();
  }

  //   // ---------- SELECTORS ----------
    async selectBrand(brandName: string) {
    await this.brandNamedropdown.click();
    await this.brandNamedropdown.selectOption({ label: brandName });
    await this.page.waitForTimeout(1000);
  }
  //   async selectVehicle(vehicleName: string) {
  //   await this.vehicleNamedropdown.click();
  //   await this.vehicleNamedropdown.fill(vehicleName);
  //   await this.page.waitForTimeout(500);
  //   await this.vehicleNamedropdown.press('Enter');
  // }
  //   async selectFuelType(fuelType: string) {
  //   await this.fuelTypeDropdown.click();
  //   await this.fuelTypeDropdown.fill(fuelType);
  //   await this.page.waitForTimeout(500);
  //   await this.fuelTypeDropdown.press('Enter');
  // }
}