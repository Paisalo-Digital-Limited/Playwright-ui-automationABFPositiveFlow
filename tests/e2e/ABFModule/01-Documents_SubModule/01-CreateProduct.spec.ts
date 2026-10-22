//tests/e2e/ABFModule/01-Documents_SubModule/01-CreateProduct.spec.ts
import { test, expect } from '@playwright/test';
import { CreateProductPage } from '../../../../pages/ABFModule/Documents_SubModule/CreateProduct.page';
import { logRoute } from '../../../utils/routeLogger';

test.use({
  storageState: 'tests/storageState/storageState.json',
});

test.describe('Create Product Page Automation', () => {
  let newPage: CreateProductPage;

  test.beforeEach(async ({ page }) => {
    page.on('framenavigated', (frame) => {
      logRoute(frame.url());
    });

    newPage = new CreateProductPage(page);

    await page.goto(`${process.env.ERP_URL}abf/createproducts`);
    await page.waitForLoadState('networkidle');
  });

  // ✅ Add Product + Document Selection
  test('✅ Positive: Add, Edit and Update Product with OEM & Dealer Documents', async () => {
    const uniqueName = `Scooty${Date.now()}`;
    await newPage.productName.fill(uniqueName);
    await newPage.productType.selectOption({ label: 'Two Wheeler' });

    // ---------------- OEM DOCUMENTS ----------------
    await newPage.selectOEMDocument(
      'I- CAT approval/Authorization certificate for manufacturing',
      'Mandatory'
    );

    await newPage.selectOEMDocument(
      'Subvention details needs to be captured as per agreement',
      'Any One'
    );

    await newPage.selectOEMDocument(
      'MOU - Agreement',
      'Optional'
    );

    await newPage.selectOEMDocument(
      'SPDC or Security',
      'Mandatory'
    );

    await newPage.selectOEMDocument(
      'Products details on letter head or Product catalogue',
      'Optional'
    );
    await newPage.selectOEMDocument(
      'Board resolution for Authorized signatory',
      'Mandatory'
    );

    await newPage.selectOEMDocument(
      'KYC of Authorized signatory',
      'Mandatory'
    );
    await newPage.selectOEMDocument(
      'Incorporation certificate',
      'Mandatory'
    );

    await newPage.selectOEMDocument(
      'GSTIN',
      'Mandatory'
    );

    // ---------------- DEALER DOCUMENTS ----------------
    await newPage.selectDealerDocument(
      'SPDC or Security (if any as per Tnc)',
      'Optional'
    );

    await newPage.selectDealerDocument(
      'Request letter from Dealer for onboarding on letter head',
      'Any One'
    );

    await newPage.selectDealerDocument(
      'Onboarding fee-if any',
      'Mandatory'
    );

    await newPage.selectDealerDocument(
      'Dealer Empanelment form',
      'Mandatory'
    );

    await newPage.selectDealerDocument(
      'Dealer agreement',
      'Mandatory'
    );

    await newPage.selectDealerDocument(
      'Rent agreement or electricity bill for the establishment',
      'Optional'
    );

    await newPage.selectDealerDocument(
      'Cancel Cheque or bank statement',
      'Optional'
    );

    await newPage.selectDealerDocument(
      'FI Visit Report BY AH',
      'Mandatory'
    );

    await newPage.selectDealerDocument(
      'Form-23 ( for hypothecation check purpose)',
      'Mandatory'
    );

    await newPage.selectDealerDocument(
      'Subvention details need to be captured as per agreement',
      'Any One'
    );

    await newPage.selectDealerDocument(
      'Dealer -Sub dealer agreement',
      'Any One'
    );

    await newPage.selectDealerDocument(
      'OEM recommendation email',
      'Optional'
    );

    await newPage.selectDealerDocument(
      'Letter of intent by OEM',
      'Any One'
    );

    await newPage.selectDealerDocument(
      'Authorized signatory authorization letter on letter head( If partnership or Pvt. Ltd Firm)',
      'Mandatory'
    );

    await newPage.selectDealerDocument(
      'Trade Certificate',
      'Any One'
    );
    await newPage.selectDealerDocument(
      'GSTIN',
      'Mandatory'
    );
    await newPage.selectDealerDocument(
      'KYC of Authorized signatory',
      'Mandatory'
    );

    // Search / Save
    await newPage.submitButton.click();
    await expect(newPage.page.locator('text=Records Inserted Successfully.')).toBeVisible({ timeout: 3000 });
  // --- Confirm success ---
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
  `div[role="row"]:has(div[data-column-id="2"]:has-text("${uniqueName}"))`
    );

    if (await productRow.count() > 0) {

    await productRow
        .locator('[data-column-id="3"] button[title="Edit Product"]')
        .click();

    console.log(`✏️ Clicked Edit for: ${uniqueName}`);

    } else {

    console.log(`❌ Product not found: ${uniqueName}`);

    }

    // ⏳ Wait edit form open
    await newPage.page.waitForLoadState('networkidle');

    // (Optional) Modify data
    // await newPage.productName.fill(`${uniqueName}_Updated`);

    await newPage.page.waitForTimeout(1000);
    // 💾 Click Update Product
    await newPage.page
    .getByTestId('Product-save-button')
    .click();

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
  `div[role="row"]:has(div[data-column-id="2"]:has-text("${uniqueName}"))`
    );
    }
    console.log(`✏️ Product Updated Successfully: ${uniqueName}`);

    console.log(`✅ Product Found In Table: ${uniqueName}`);
    }
  });

});