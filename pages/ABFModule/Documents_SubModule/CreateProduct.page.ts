//pages/ABFModule/Documents_SubModule/CreateProduct.page.ts
import { Page, Locator, expect } from '@playwright/test';

export class CreateProductPage {
  readonly page: Page;

  // Basic fields
  readonly productName: Locator;
  readonly productType: Locator;
  readonly submitButton: Locator;
  readonly resultTable: Locator;
  readonly tableRows: Locator;
  readonly productNameCells: Locator;

  // Section headers
  readonly oemSection: Locator;
  readonly dealerSection: Locator;

  constructor(page: Page) {
    this.page = page;

    // Product
    this.productName = page.getByTestId('product-name-input');
    this.productType = page.getByTestId('product-ddl-input');
    this.submitButton = page.getByTestId('Product-save-button');

    // Table
    this.resultTable = page.locator('div[role="table"]');
  this.tableRows = page.locator('div[role="rowgroup"] div[role="row"]');
  this.productNameCells = page.locator(
    'div[role="row"] div[data-column-id="2"]'
  );

    // Sections
    this.oemSection = page.locator('h2:has-text("OEM Documents")');
    this.dealerSection = page.locator('h2:has-text("Dealer Documents")');
  }

  // ---------- GENERIC RADIO SELECTOR ----------
  getRadioByDocumentName(
  docName: string,
  option: 'Mandatory' | 'Optional' | 'Any One'
) {
  return this.page
    .getByRole('heading', { name: docName, level: 3 })
    .locator('xpath=following::input[@type="radio"]')
    .nth(
      option === 'Mandatory'
        ? 0
        : option === 'Optional'
        ? 1
        : 2
    );
}

  // ---------- OEM ACTION ----------
  async selectOEMDocument(docName: string, option: 'Mandatory' | 'Optional' | 'Any One') {
    const radio = this.getRadioByDocumentName(docName, option);
    await radio.check({ force: true });
  }

  // ---------- DEALER ACTION ----------
  async selectDealerDocument(docName: string, option: 'Mandatory' | 'Optional' | 'Any One') {
    const radio = this.getRadioByDocumentName(docName, option);
    await radio.check();
  }

  // ---------- HANDLE NO RECORD ----------
  async handleNoRecordPopup() {
    const popup = this.page.locator('text=No records found');
    await expect(popup).toBeVisible({ timeout: 1000 });
    await this.page.getByRole('button', { name: 'OK' }).click();
  }
}

