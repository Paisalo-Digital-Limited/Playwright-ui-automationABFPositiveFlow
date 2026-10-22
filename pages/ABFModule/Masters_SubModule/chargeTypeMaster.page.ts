//pages/ABFModule/Masters_SubModule/chargeTypeMaster.page.ts
import { Locator, Page } from '@playwright/test';
export class ChargeTypeMasterPage {
    readonly page: Page;
    readonly chargeType: Locator;
    readonly chargeTypeDescription: Locator;
    readonly saveButton: Locator;
    readonly searchInput: Locator;
    readonly resultTable: Locator;
    readonly tableRows: Locator;
    readonly tableColumns: Locator;
    readonly editButton: Locator;
    readonly activeAndDeactiveButton: Locator;
    readonly deletePopupYesButton: Locator;
    readonly deletePopupNoButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.chargeType = page.getByTestId('charge-type-input');
        this.chargeTypeDescription = page.getByTestId('description-input');
        this.saveButton = page.getByTestId('submit-btn');
        this.searchInput = page.getByTestId('search-input');
        this.resultTable = page.locator('[role="table"]');
        this.tableRows = this.resultTable.locator('div[role="row"]');
        this.tableColumns = this.resultTable.locator('table th');
        this.editButton = page.locator('button:has-text("Edit")');
        this.activeAndDeactiveButton = page.locator('button:has-text("Active")');
        this.deletePopupYesButton = page.locator('button:has-text("Yes")');
        this.deletePopupNoButton = page.locator('button:has-text("No")');
    }
}