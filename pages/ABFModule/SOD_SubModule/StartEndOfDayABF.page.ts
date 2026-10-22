// pages/ABFModule/SOD_SubModule/StartEndOfDayABF.page.ts
import { Page, Locator, expect } from '@playwright/test';

export class StartEndOfDayABFPage {
    readonly page: Page;
    readonly startDate: Locator;
    readonly endDate: Locator;
    readonly submitButton: Locator;
    readonly resetButton: Locator;
    readonly startEndOfDayTable: Locator;

    constructor(page: Page) {
        this.page = page;
        this.startDate = page.getByTestId('start-date');
        this.endDate = page.getByTestId('end-date');
        this.submitButton = page.getByRole('button', { name: 'Submit' });
        this.resetButton = page.getByRole('button', { name: 'Reset' });
        this.startEndOfDayTable = page.locator('.start-end-of-day-table');
    }
}