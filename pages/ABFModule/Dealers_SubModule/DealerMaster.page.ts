// pages/ABFModule/Dealers_SubModule/DealerMaster.page.ts
import { Page, Locator, expect } from '@playwright/test';
import path from 'path/win32';
export class DealerMasterPage {
    readonly page: Page;
    readonly dealerListRadio: Locator;
    readonly createDealerRadio: Locator;
    readonly backToDealerListButton: Locator;
    readonly selectOem: Locator;
    readonly selectCreator: Locator;
    readonly firmName: Locator;
    readonly firmType: Locator;
    readonly phoneNumber: Locator;
    readonly emailId: Locator;
    readonly officeAddress: Locator;
    readonly officePincode: Locator;
    readonly city: Locator;
    readonly accountNumber: Locator;
    readonly ifscCode: Locator;
    readonly panNumber: Locator;
    readonly gstNumber: Locator;
    readonly cinNumber: Locator;
    readonly underVP: Locator;
    readonly category: Locator;
    readonly fees: Locator;
    readonly refundableDeposit: Locator;
    readonly typeEmpanelled: Locator;
    readonly typeNonEmpanelled: Locator;
    readonly submitButton: Locator;

    //------------- Add Owner/Partner locators -------------//
    readonly ownerPartnerName: Locator;
    readonly ownerPartnerEmailId: Locator;
    readonly ownerPartnerPhoneNumber: Locator
    readonly ownerPartnerAadharNumber: Locator;
    readonly ownerPartnerPanNumber: Locator;
    readonly ownerPartnerAddress: Locator
    readonly ownerPartnerPincode: Locator;
    readonly ownerPartnerCity: Locator;
    readonly addOwnerPartnerButton: Locator;

    readonly ownerPartnerName1: Locator;
    readonly ownerPartnerEmailId1: Locator;
    readonly ownerPartnerPhoneNumber1: Locator
    readonly ownerPartnerAadharNumber1: Locator
    readonly ownerPartnerPanNumber1: Locator;
    readonly ownerPartnerAddress1: Locator
    readonly ownerPartnerPincode1: Locator;
    readonly ownerPartnerCity1: Locator;

    readonly addOwnerPartnerButton1: Locator;
    readonly removeOwnerPartnerCardButton: Locator;
    readonly submitOwnerPartnerButton: Locator;
    readonly resultTable: Locator;
    readonly tableRows: Locator;
    readonly tableColumns: Locator;
    readonly editButton: Locator;
    readonly deletePopupNoButton: Locator;

    //---------------------- Document Upload Locators ---------------------//
  readonly approveDocumentButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.dealerListRadio = page.getByTestId('view-dealer-radio');
        this.createDealerRadio = page.getByTestId('create-dealer-radio');
        this.backToDealerListButton = page.getByTestId('back-to-list-btn');
        this.selectOem = page.locator('#DealerOemID-input-select');
        this.selectCreator = page.locator('#Creator-input-select');
        this.firmName = page.getByTestId('FirmName');
        this.firmType = page.locator('#FirmType-input-select');
        this.phoneNumber = page.getByTestId('Phone');
        this.emailId = page.getByTestId('Email');
        this.officeAddress = page.getByTestId('O_Address');
        this.officePincode = page.getByTestId('O_Pincode');
        this.city = page.locator('#O_City-input-select');
        this.accountNumber = page.getByTestId('BankAccount');
        this.ifscCode = page.getByTestId('IFSCode');
        this.panNumber = page.getByTestId('pan-verification');
        this.gstNumber = page.getByTestId('gst-input');
        this.cinNumber = page.getByTestId('cin-number');
        this.underVP = page.locator('input#vp-select');
        this.category = page.locator('#Category-input-select');
        this.fees = page.getByTestId('Fees');
        this.refundableDeposit = page.locator('#Refundable-input-select');
        this.typeEmpanelled = page.getByTestId('empanelled-radio');
        this.typeNonEmpanelled = page.getByTestId('non-empanelled-radio');
        this.submitButton = page.getByTestId('submit-dealer-btn');

        //------------- Add Owner/Partner locators -------------//
        this.ownerPartnerName = page.getByTestId('Firm_Name-0');
        this.ownerPartnerEmailId = page.getByTestId('EmailId-0');
        this.ownerPartnerPhoneNumber = page.getByTestId('PhoneNo-0');
        this.ownerPartnerAadharNumber = page.getByTestId('AadharNo-0');
        this.ownerPartnerPanNumber = page.getByTestId('Panno-0');
        this.ownerPartnerAddress = page.getByTestId('Address-0');
        this.ownerPartnerPincode = page.getByTestId('Pincode-0');
        this.ownerPartnerCity = page.getByTestId('owner-city-0');
        this.addOwnerPartnerButton = page.getByTestId('add-owner-button');

        this.ownerPartnerName1 = page.getByTestId('Firm_Name-1');
        this.ownerPartnerEmailId1 = page.getByTestId('EmailId-1');
        this.ownerPartnerPhoneNumber1 = page.getByTestId('PhoneNo-1');
        this.ownerPartnerAadharNumber1 = page.getByTestId('AadharNo-1');
        this.ownerPartnerPanNumber1 = page.getByTestId('Panno-1');
        this.ownerPartnerAddress1 = page.getByTestId('Address-1');
        this.ownerPartnerPincode1 = page.getByTestId('Pincode-1');
        this.ownerPartnerCity1 = page.getByTestId('owner-city-1');

        this.backToDealerListButton = page.getByTestId('back-to-dealer-list-button');
        this.addOwnerPartnerButton1 = page.getByTestId('add-owner-button');
        this.removeOwnerPartnerCardButton = page.getByTestId('remove-owner-button-2');
        this.submitOwnerPartnerButton = page.getByTestId('submit-owners-button');
        this.resultTable = page.locator('[role="table"]');
        this.tableRows = this.resultTable.locator('div[role="row"]');
        this.tableColumns = this.resultTable.locator('table th');
        this.editButton = page.locator('button:has-text("Edit")');
        this.deletePopupNoButton = page.locator('button:has-text("No")');

        // ---------------------- Document Upload Locators ---------------------//
        this.approveDocumentButton = page.getByTestId('proceed-approval-btn');
    }

    async uploadViewDoc(){
        const uploadViewDoc = this.page.locator('div[id="row-0"]');
        await expect(uploadViewDoc).toBeVisible();
        await uploadViewDoc.getByTestId('action-sub-btn').nth(2).click();
    }

    async uploadDoc(){
        //await this.page.waitForTimeout(2000);
        await this.page.waitForTimeout(1000);
        const deleteBtn = this.page.locator('[data-testid^="delete-doc-btn-"]');        
        if((await deleteBtn.count()) > 0){
            while((await deleteBtn.count()) > 0){
                await deleteBtn.nth(0).click();
                await this.page.waitForTimeout(500);
                const yes = this.page.getByRole('button', {name: 'Yes, delete it!'});
                await expect(yes).toBeVisible();
                await yes.click();
                const ok = this.page.getByRole('button', {name: 'OK'});
                await expect(ok).toBeVisible();
                await ok.click();                
            }
        }
        await this.page.waitForTimeout(1000);
        const filePath =
        'tests/downloads/UploadFiles/Samplefile.pdf';

            const cards = this.page.locator(
                '[id^="document-card-"]'
            );
            await this.page.waitForTimeout(2000);
            const cardCount = await cards.count();
            console.log(`Total document cards found: ${cardCount}`);
            for (let i = 0; i < cardCount; i++) {

                const card = cards.nth(i);

                const cardText = await card.innerText();
                await this.page.waitForTimeout(100);
                const shouldProcess =
                    cardText.includes('*') ||
                    cardText.toLowerCase().includes('(anyone)');

                if (!shouldProcess) {
                    continue;
                }

                const cardId = await card.getAttribute('id');

                if (!cardId) continue;

                const docId = cardId.replace('document-card-', '');

                console.log(`Processing document ${docId}`);

                await this.page.waitForTimeout(100);
                // Delete if already uploaded
                const deleteBtn = this.page.locator(
                    `#delete-doc-${docId}`
                );

                if (await deleteBtn.count() > 0) {

                    await deleteBtn.click();

                    await this.page
                        .getByRole('button', { name: /yes/i })
                        .click();

                    await expect(
                        this.page.getByText(
                            'Record Delete Successfully!!'
                        )
                    ).toBeVisible();

                    await this.page
                        .getByRole('button', { name: 'OK' })
                        .click();

                    await this.page
                        .locator(`#upload-input-${docId}`)
                        .waitFor({ state: 'attached' });
                }

                // Upload file
                await this.page
                    .locator(`#upload-input-${docId}`)
                    .setInputFiles(filePath);

                console.log(`Uploaded document ${docId}`);
            }
        await expect(this.approveDocumentButton).toBeVisible();
        await this.approveDocumentButton.click();
        await expect(this.page.getByText('All Mandatory Documents Uploaded!')).toBeVisible();
        await this.page.getByRole('button', { name: 'Go to Approval Page' }).click();

        await this.page.waitForTimeout(5000);
    }
}
