//pages/ABFModule/Masters_SubModule/subModelMaster.page.ts
import { Locator, Page } from '@playwright/test';

export class SubModelMasterPage {
    readonly page: Page;
    readonly brandNameSelect: Locator;
    readonly modelNameSelect: Locator;
    readonly fuelTypeSelect: Locator;
    readonly subModelName: Locator;
    readonly description: Locator;
    readonly creatreButton: Locator;
    readonly searchBySubModel: Locator;
    readonly resultTable: Locator;
    readonly tableRows: Locator;
    readonly tableColumns: Locator;
    readonly editButton: Locator;
    readonly activeAndDeactiveButton: Locator;
    readonly deletePopupYesButton: Locator;
    readonly deletePopupNoButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.brandNameSelect = page.locator('#mm-select-brand');
        this.modelNameSelect = page.locator('#mm-select-vehicle');
        this.fuelTypeSelect = page.locator('#mm-select-fuel');
        this.subModelName = page.getByTestId('mm-input-name');
        this.description = page.getByTestId('mm-input-description');
        this.creatreButton = page.getByTestId('mm-btn-submit');
        this.searchBySubModel = page.getByTestId('mm-search-input');
        this.resultTable = page.locator('[role="table"]');
        this.tableRows = page.locator('.rdt_TableBody [role="row"]');
        this.tableColumns = page.locator('table th');
        this.editButton = page.locator('button:has-text("Edit")');
        this.activeAndDeactiveButton = page.locator('button:has-text("Active/Deactive")');
        this.deletePopupYesButton = page.locator('button:has-text("Yes")');
        this.deletePopupNoButton = page.locator('button:has-text("No")');
    }

        getsubModelRow(fuelTypeName: string) {
        return this.page.locator(`table tbody tr:has(td:text("${fuelTypeName}"))`);
        }
        // ---------- HANDLE NO RECORD ----------
        async handleNoRecordPopup() {
            await this.page.locator('button:has-text("OK")').click();
        }
}