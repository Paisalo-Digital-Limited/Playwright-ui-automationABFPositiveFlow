//pages/ABFModule/Masters_SubModule/fuelChargeMappingMaster.page.ts
import { expect, Locator, Page } from '@playwright/test';
export class FuelChargeMappingMasterPage {
     readonly page: Page;
    readonly fuelType: Locator;
    readonly chargeType: Locator;
    readonly stateSelect: Locator;
    readonly applicableChkbox: Locator;
    readonly calculationTypeSelect: Locator;
    readonly calculateValueInput: Locator;
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
        this.fuelType = page.getByTestId('fuel-type-select');
        this.chargeType = page.getByTestId('charge-type-select');
        this.stateSelect = page.getByTestId('state-select');
        this.applicableChkbox = page.getByTestId('applicable-checkbox');
        this.calculationTypeSelect = page.getByTestId('calculation-type-select');
        this.calculateValueInput = page.getByTestId('calculation-value-input');
        this.saveButton = page.getByTestId('submit-button');

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