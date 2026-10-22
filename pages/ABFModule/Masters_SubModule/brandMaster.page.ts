//pages/ABFModule/Masters_SubModule/brandMaster.page.ts
import { Page, Locator, expect } from '@playwright/test';

export class BrandMasterPage {
    readonly page: Page;
    readonly brandName: Locator;
    readonly description: Locator;
    readonly saveButton: Locator;
    readonly searchInput: Locator;
    readonly resultTable: Locator;
    readonly tableRows: Locator;
    readonly brandNameCells: Locator;
    constructor(page: Page) {
        this.page = page;
        this.brandName = page.getByTestId('BM-input-Brandname');
        this.description = page.getByTestId('Bm-input-description');
        this.saveButton = page.getByTestId('bm-btn-submit');
        this.searchInput = page.getByTestId('search-input');
        this.resultTable = page.locator('div[role="table"]');
        this.tableRows = page.locator('div[role="rowgroup"] div[role="row"]');
        this.brandNameCells = page.locator('div[role="row"] div[data-column-id="2"]');
    }

    // ---------- HANDLE NO RECORD ----------
  async handleNoRecordPopup() {
    const popup = this.page.locator('text=No records found');
    await expect(popup).toBeVisible({ timeout: 1000 });
    await this.page.getByRole('button', { name: 'OK' }).click();
  }
}