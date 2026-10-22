//tests/ABFModule/04-Dealers_SubModule/01-DealerMaster.spec.ts
import { test, expect, Page } from '@playwright/test';
import { DealerMasterPage } from '../../../../pages/ABFModule/Dealers_SubModule/DealerMaster.page';
import { logRoute } from '../../../utils/routeLogger';
import { executeCleanupQueries } from '../../../utils/sqlUtils';

test.use({
    storageState: 'tests/storageState/storageState.json',
});

test.describe('Dealer Master Test Suite', () => {
    let dealerMasterPage: DealerMasterPage;

    test.beforeEach(async ({ page }) => {
        page.on('framenavigated', (frame) => {
            logRoute(frame.url());
        });

        dealerMasterPage = new DealerMasterPage(page);

        await page.goto(`${process.env.ERP_URL}abf/Dealer`);
        await page.waitForLoadState('networkidle');
    });

    //------------------------------- Delete Already Created Dealers With Same Firm Name ----------------------------------//
   test('Delete already created Dealers with same name', async () => {
        await dealerMasterPage.dealerListRadio.click();
        await dealerMasterPage.page.waitForTimeout(2000);
        const oemRows = dealerMasterPage.page.locator('div[role="rowgroup"]').nth(1).getByRole('row');
        const rowCount = await oemRows.count();

        for (let i = 0; i < rowCount; i++) {
            const row = oemRows.nth(i);

            const dealerName = await row.getByRole('cell').nth(2).innerText();
            const statusText = await row.getByRole('cell').nth(6).innerText();
            console.log(`Dealer Name: ${dealerName}, Status: ${statusText}`);
            if (dealerName.trim() === 'Himanshu' && statusText.includes('Pending'))
            {
                const deleteButton = row.locator('[data-testid="action-sub-btn"]').nth(4);

                await deleteButton.click();
                await dealerMasterPage.page.getByRole('button', { name: 'Yes, delete it!' }).click();

                await dealerMasterPage.page.getByRole('button', { name: 'OK' }).click();
            }
        }
    });

    // //-------------------------- Create New Dealer With Positive Scenario --------------------------
    // test('TC030: ABF - Create New Dealer with Valid Data and IFSC not retieve bank', async () => {
    //     await dealerMasterPage.createDealerRadio.click();
    //     await dealerMasterPage.selectOem.fill('Infocomm LLP');
    //     await dealerMasterPage.selectOem.press('Enter');
    //     await dealerMasterPage.selectCreator.fill('VHAGRA');
    //     await dealerMasterPage.selectCreator.press('Enter');
    //     await dealerMasterPage.firmName.fill('Himanshu');
    //     await dealerMasterPage.firmType.fill('Partnership');
    //     await dealerMasterPage.firmType.press('Enter');
    //     await dealerMasterPage.phoneNumber.fill('9876543210');
    //     await dealerMasterPage.emailId.fill('himanshu@example.com');
    //     await dealerMasterPage.officeAddress.fill('CSC 52 pocket CR Park, Greater Kailash Part 1, New Delhi');
    //     await dealerMasterPage.officePincode.fill('110019');
    //     await dealerMasterPage.city.fill('Chittranjan Park SO');
    //     await dealerMasterPage.city.press('Enter');
    //     await dealerMasterPage.accountNumber.fill('123456789');
    //     await dealerMasterPage.ifscCode.fill('SBIN0000000');

    //     await dealerMasterPage.ifscCode.press('Tab');
    //     await expect(dealerMasterPage.page.locator('text=Failed to verify IFSC code.')).toBeVisible();
    //     await dealerMasterPage.page.getByRole('button', {name: 'Ok'}).click();

    //     await dealerMasterPage.panNumber.fill('BZJPM1625A');
    //     await dealerMasterPage.page.waitForTimeout(1000);
    //     await expect(
    //     dealerMasterPage.page.getByRole('heading', {name: 'PAN Verified & Name Matched with Firm Name',})).toBeVisible();
        
    //     await dealerMasterPage.page.getByTestId('pan-match-confirm-btn').click();
    //     await dealerMasterPage.page.waitForTimeout(1000);
    //     const gstInput = await dealerMasterPage.page.locator('#gst-input');

    //     await expect(gstInput).toBeVisible();
    //     await expect(gstInput).toBeEditable();

    //     await gstInput.click();

    //     await gstInput.type('22BZJPM1625A1Z5');

    //     await expect(gstInput)
    //     .toHaveValue('22BZJPM1625A1Z5');
    //     await dealerMasterPage.cinNumber.fill('U74900DL2015PTC282029');
    //     await dealerMasterPage.underVP.fill('Priya');
    //     await dealerMasterPage.underVP.press('Enter');
    //     await dealerMasterPage.category.fill('Securities');
    //     await dealerMasterPage.category.press('Enter');
    //     await dealerMasterPage.fees.fill('10000');
    //     await dealerMasterPage.refundableDeposit.fill('Yes');
    //     await dealerMasterPage.refundableDeposit.press('Enter');
    //     await dealerMasterPage.typeEmpanelled.click();
    //     await dealerMasterPage.submitButton.click();
    //     await expect(dealerMasterPage.page.locator('text=Bank and Branch Address is not empty')).toBeVisible();
    // });

    test('TC031: ABF - Create New Dealer with Valid Data', async () => {
        await dealerMasterPage.createDealerRadio.click();
        await dealerMasterPage.selectOem.fill('Infocomm LLP');
        await dealerMasterPage.page.getByRole('option', { name: 'InfoComm LLP', exact: true }).click();
        await dealerMasterPage.page.waitForTimeout(1000);
        await dealerMasterPage.selectOem.press('Enter');
        await dealerMasterPage.selectCreator.fill('VHAGRA');
        await dealerMasterPage.page.getByRole('option', { name: 'VHAGRA', exact: true }).click();
        await dealerMasterPage.page.waitForTimeout(1000);
        await dealerMasterPage.selectCreator.press('Enter');
        await dealerMasterPage.firmName.fill('Himanshu');
        await dealerMasterPage.firmType.fill('Partnership');
        await dealerMasterPage.firmType.press('Enter');
        await dealerMasterPage.phoneNumber.fill('9876543210');
        await dealerMasterPage.emailId.fill('himanshu@example.com');
        await dealerMasterPage.officeAddress.fill('Corenthum tower sector 62, Noida, UTTAR PRADESH');
        await dealerMasterPage.officePincode.fill('201301');
        await dealerMasterPage.city.fill('Noida HO');
        await dealerMasterPage.city.press('Enter');
        await dealerMasterPage.accountNumber.fill('123456789');
        await dealerMasterPage.ifscCode.fill('SBIN0001078');
        await dealerMasterPage.panNumber.fill('BZJPM1625A');
        await dealerMasterPage.page.waitForTimeout(1000);
        await expect(
        dealerMasterPage.page.getByRole('heading', {name: 'PAN Verified & Name Matched with Firm Name',})).toBeVisible();
        
        await dealerMasterPage.page.getByTestId('pan-match-confirm-btn').click();
        await dealerMasterPage.page.waitForTimeout(1000);
        const gstInput = await dealerMasterPage.page.locator('#gst-input');

        await expect(gstInput).toBeVisible();
        await expect(gstInput).toBeEditable();

        await gstInput.click();

        await gstInput.type('22BZJPM1625A1Z5');

        await expect(gstInput)
        .toHaveValue('22BZJPM1625A1Z5');
        await dealerMasterPage.cinNumber.fill('U74900DL2015PTC282029');
        await dealerMasterPage.underVP.fill('RAKESH MEENA');
        await dealerMasterPage.page.getByRole('option', { name: 'RAKESH MEENA', exact: true }).click();
        await dealerMasterPage.page.waitForTimeout(1000);
        await dealerMasterPage.underVP.press('Enter');
        await dealerMasterPage.category.fill('Securities');
        await dealerMasterPage.category.press('Enter');
        await dealerMasterPage.fees.fill('10000');
        await dealerMasterPage.refundableDeposit.fill('Yes');
        await dealerMasterPage.refundableDeposit.press('Enter');
        await dealerMasterPage.typeEmpanelled.click();
        await dealerMasterPage.page.waitForTimeout(1000);
        await dealerMasterPage.submitButton.click();
        await expect(dealerMasterPage.page.locator('text=Data created successfully!')).toBeVisible();
    });

    //----------------------------------- Edit Dealer Master -----------------------------------
    test('TC032: ABF - Edit Dealer Master and Validate', async () => {
        await dealerMasterPage.dealerListRadio.click();
        await dealerMasterPage.page.waitForTimeout(1000);
        const searchInput = await dealerMasterPage.page.locator('#dealer-search-input');
        await expect(searchInput).toBeVisible();
        await searchInput.fill('Himanshu');
        await dealerMasterPage.page.waitForTimeout(500);

        const oemRows = dealerMasterPage.page.locator('div[role="rowgroup"]').nth(1).getByRole('row');

            const rowCount = await oemRows.count();
            let targetRow;

            for (let i = 0; i < rowCount; i++) {
                const row = oemRows.nth(i);

                const dealerName = (await row.getByRole('cell').nth(2).innerText()).trim();
                const statusText = await row.getByRole('cell').nth(6).innerText();

                if (dealerName === 'Himanshu' && statusText.includes('Pending')) {
                targetRow = row;

                // Edit OEM
                await row.locator('button[id^="action-edit-btn"]').click();
                await dealerMasterPage.page.getByRole('button', { name: 'Yes, Edit' }).click();

                await expect(
                    dealerMasterPage.page.getByTestId('update-dealer-btn')
                ).toBeVisible();

                await dealerMasterPage.page
                    .getByTestId('update-dealer-btn')
                    .click();

                await expect(
                    dealerMasterPage.page.getByText('Data updated successfully!')
                ).toBeVisible();

                await dealerMasterPage.page.getByRole('button', { name: 'OK' }).click();

                // Back to list
                await dealerMasterPage.dealerListRadio.click();
                await dealerMasterPage.page.waitForTimeout(2000);
                break;
                }
            }

            expect(targetRow).toBeTruthy();

            // Re-fetch rows after page refresh/navigation
            const refreshedRows = dealerMasterPage.page
                .locator('div[role="rowgroup"]')
                .nth(1)
                .getByRole('row');

            for (let i = 0; i < await refreshedRows.count(); i++) {
                const row = refreshedRows.nth(i);

                const dealerName = (await row.getByRole('cell').nth(2).innerText()).trim();
                const statusText = await row.getByRole('cell').nth(6).innerText();

                if (dealerName === 'Himanshu' && statusText.includes('Pending')) {
                const ownerPartnerButton = row.locator('[data-testid="action-sub-btn"]').nth(0);
                console.log('Clicking Owner/Partner button:', await ownerPartnerButton.count());
                ownerPartnerButton.click();
                
                break;
                }
            }

            await dealerMasterPage.page.waitForTimeout(2000);
            await deleteOwnerIfExists(
                dealerMasterPage.page,
                'Himanshu Modanwal'
            );
            

            await deleteOwnerIfExists(
                dealerMasterPage.page,
                'Pawan Kumar'
            );

            await dealerMasterPage.submitOwnerPartnerButton.click();
            await expect(dealerMasterPage.page.locator("text=Please enter the owner's name.")).toBeVisible();
            await dealerMasterPage.ownerPartnerName.fill('Himanshu Modanwal');
            await dealerMasterPage.submitOwnerPartnerButton.click();
            await expect(dealerMasterPage.page.locator("text=Please enter an email address.")).toBeVisible();
            await dealerMasterPage.ownerPartnerEmailId.fill('abc');
            await dealerMasterPage.submitOwnerPartnerButton.click();
            await expect(dealerMasterPage.page.locator("text=Please enter a valid email address (e.g. user@example.com).")).toBeVisible();
            await dealerMasterPage.ownerPartnerEmailId.fill('Kx9Hj@example.com');
            await dealerMasterPage.submitOwnerPartnerButton.click();
            await expect(dealerMasterPage.page.locator("text=Please enter a phone number.")).toBeVisible();
            await dealerMasterPage.ownerPartnerPhoneNumber.fill('11111');
            await dealerMasterPage.submitOwnerPartnerButton.click();
            await expect(dealerMasterPage.page.locator("text=Please enter a valid 10-digit phone number.")).toBeVisible();
            await dealerMasterPage.ownerPartnerPhoneNumber.fill('9876543210');
            await dealerMasterPage.submitOwnerPartnerButton.click();
            await expect(dealerMasterPage.page.locator("text=Please enter an Aadhar number.")).toBeVisible();
            await dealerMasterPage.ownerPartnerAadharNumber.fill('12345');
            await dealerMasterPage.submitOwnerPartnerButton.click();
            await expect(dealerMasterPage.page.locator("text=Aadhar number must be 12 digits.")).toBeVisible();
            await dealerMasterPage.ownerPartnerAadharNumber.fill('123456789012');
            await dealerMasterPage.submitOwnerPartnerButton.click();
            await expect(dealerMasterPage.page.locator("text=Please enter a PAN number.")).toBeVisible();
            await dealerMasterPage.ownerPartnerPanNumber.fill('12345');
            await dealerMasterPage.submitOwnerPartnerButton.click();
            await expect(dealerMasterPage.page.locator("text=PAN number must be valid (5 letters, 4 digits, 1 letter).")).toBeVisible();
            await dealerMasterPage.ownerPartnerPanNumber.fill('BZJPM1625A');
            await expect(dealerMasterPage.page.getByRole('dialog').getByText('PAN verification complete name match confirmed!')).toBeVisible();
            await dealerMasterPage.page.getByRole('button', { name: 'OK' }).click();
            await dealerMasterPage.page.waitForTimeout(500);
            await dealerMasterPage.submitOwnerPartnerButton.click();
            await expect(dealerMasterPage.page.locator("text=Please enter an address.")).toBeVisible();
            await dealerMasterPage.ownerPartnerAddress.click();
            await dealerMasterPage.ownerPartnerAddress.fill('Corenthum tower sector 62, Noida, UTTAR PRADESH');
            await dealerMasterPage.submitOwnerPartnerButton.click();
            await expect(dealerMasterPage.page.locator("text=Pincode must be 6 digits.")).toBeVisible();
            await dealerMasterPage.ownerPartnerPincode.fill('201301');
            // await dealerMasterPage.ownerPartnerCity.click();
            // await dealerMasterPage.ownerPartnerCity.focus();
            // await dealerMasterPage.ownerPartnerCity.press('ArrowUp');
            // await dealerMasterPage.ownerPartnerCity.press('Enter');
            // await dealerMasterPage.submitOwnerPartnerButton.click();
            // await expect(dealerMasterPage.ownerPartnerCity).toBeVisible();
            await dealerMasterPage.ownerPartnerCity.selectOption('Noida HO');
            await dealerMasterPage.page.waitForTimeout(1000);
            await dealerMasterPage.addOwnerPartnerButton.click();

            await dealerMasterPage.page.waitForTimeout(1500);
            await dealerMasterPage.submitOwnerPartnerButton.click();
            await expect(dealerMasterPage.page.locator("text=Please enter the owner's name.")).toBeVisible();
            await dealerMasterPage.ownerPartnerName1.fill('Pawan Kumar');
            await dealerMasterPage.submitOwnerPartnerButton.click();
            await expect(dealerMasterPage.page.locator("text=Please enter an email address.")).toBeVisible();
            await dealerMasterPage.ownerPartnerEmailId1.fill('abc');
            await dealerMasterPage.submitOwnerPartnerButton.click();
            await expect(dealerMasterPage.page.locator("text=Please enter a valid email address (e.g. user@example.com).")).toBeVisible();
            await dealerMasterPage.ownerPartnerEmailId1.fill('Kx9aaHj@example.com');
            await dealerMasterPage.submitOwnerPartnerButton.click();
            await expect(dealerMasterPage.page.locator("text=Please enter a phone number.")).toBeVisible();
            await dealerMasterPage.ownerPartnerPhoneNumber1.fill('11111');
            await dealerMasterPage.submitOwnerPartnerButton.click();
            await expect(dealerMasterPage.page.locator("text=Please enter a valid 10-digit phone number.")).toBeVisible();
            await dealerMasterPage.ownerPartnerPhoneNumber1.fill('9876543000');
            await dealerMasterPage.submitOwnerPartnerButton.click();
            await expect(dealerMasterPage.page.locator("text=Please enter an Aadhar number.")).toBeVisible();
            await dealerMasterPage.ownerPartnerAadharNumber1.fill('12345');
            await dealerMasterPage.submitOwnerPartnerButton.click();
            await expect(dealerMasterPage.page.locator("text=Aadhar number must be 12 digits.")).toBeVisible();
            await dealerMasterPage.ownerPartnerAadharNumber1.fill('123456789000');
            await dealerMasterPage.submitOwnerPartnerButton.click();
            await expect(dealerMasterPage.page.locator("text=Please enter a PAN number.")).toBeVisible();
            await dealerMasterPage.ownerPartnerPanNumber1.fill('12345');
            await dealerMasterPage.submitOwnerPartnerButton.click();
            await expect(dealerMasterPage.page.locator("text=PAN number must be valid (5 letters, 4 digits, 1 letter).")).toBeVisible();
            await dealerMasterPage.ownerPartnerPanNumber1.fill('GQVPK5761D');
            await expect(dealerMasterPage.page.getByRole('dialog').getByText('PAN verification complete name match confirmed!')).toBeVisible();
            await dealerMasterPage.page.getByRole('button', { name: 'OK' }).click();
            await dealerMasterPage.page.waitForTimeout(500);
            await dealerMasterPage.submitOwnerPartnerButton.click();
            await expect(dealerMasterPage.page.locator("text=Please enter an address.")).toBeVisible();
            await dealerMasterPage.ownerPartnerAddress1.click();
            await dealerMasterPage.ownerPartnerAddress1.fill('PaisaLo CSC 52 pocket CR Park, Greater Kailash Part 1, New Delhi');
            await dealerMasterPage.submitOwnerPartnerButton.click();
            await expect(dealerMasterPage.page.locator("text=Pincode must be 6 digits.")).toBeVisible();
            await dealerMasterPage.ownerPartnerPincode1.fill('110019');
            await dealerMasterPage.page.waitForTimeout(500);
            // await dealerMasterPage.ownerPartnerCity1.click();
            // await dealerMasterPage.ownerPartnerCity1.focus();
            // await dealerMasterPage.ownerPartnerCity1.press('ArrowUp');
            // await dealerMasterPage.ownerPartnerCity1.press('Enter');
            // await dealerMasterPage.page.waitForTimeout(1000);
            // await dealerMasterPage.submitOwnerPartnerButton.click();
            // await dealerMasterPage.page.waitForTimeout(1000);
            // await expect(dealerMasterPage.page.locator("text=Please select a city.")).toBeVisible();
            await dealerMasterPage.ownerPartnerCity1.selectOption('Chittranjan Park SO');
            await dealerMasterPage.page.waitForTimeout(1000);
            await dealerMasterPage.addOwnerPartnerButton1.click();
            await dealerMasterPage.page.waitForTimeout(500);
            await dealerMasterPage.removeOwnerPartnerCardButton.click();
            await dealerMasterPage.page.waitForTimeout(1000);
            await dealerMasterPage.submitOwnerPartnerButton.click();
            await dealerMasterPage.page.waitForTimeout(1000);
            await expect(dealerMasterPage.page.getByText('Owner/partner Created Successfully')).toBeVisible();
            await dealerMasterPage.page.getByRole('button', { name: 'OK' }).click();
    });

    //------------------------------------ Documents Upload For Dealer Master ------------------------------------
    test('Delete existing docs and upload again', async ({ page }) => {
        test.setTimeout(60000); // 3 minutes

        dealerMasterPage = new DealerMasterPage(page);

        // await dealerMasterPage.loginAsHim();

        await dealerMasterPage.page.goto(`${process.env.ERP_URL}abf/Dealer`);
        await dealerMasterPage.page.waitForLoadState('networkidle');

        await dealerMasterPage.uploadViewDoc();
        await dealerMasterPage.uploadDoc();
    });

//------------------------------- Verifying OEM Approval By Branch ----------------------------------//
test('Verify documents in approval page', async () => {
    await dealerMasterPage.page.goto(`${process.env.ERP_URL}abf/Dealer`);
    await dealerMasterPage.page.waitForLoadState('networkidle');
    await dealerMasterPage.dealerListRadio.click();

    const rows = dealerMasterPage.page
        .locator('[role="rowgroup"]')
        .nth(1)
        .getByRole('row');

        const rowCount = await rows.count();
        await dealerMasterPage.page.waitForTimeout(2000);
        console.log(`Total rows found: ${rowCount}`);
        const targetRow = rows.filter({
        has: dealerMasterPage.page.getByRole('cell', { name: 'Himanshu' }),
        }).first();

        const status = await targetRow.getByRole('cell').nth(6).innerText();

        if (status?.trim() === 'Pending') {
        const approveBtn = targetRow.locator('button').nth(4);

        await expect(approveBtn).toBeVisible();
        await expect(approveBtn).toBeEnabled();

        await approveBtn.click();
    }

    await dealerMasterPage.page.waitForLoadState('networkidle');

    await expect(
    dealerMasterPage.page.getByText(
        'Firm Name: Himanshu'
    )).toBeVisible();

    // Verify approval card is visible
    const approvalCards = dealerMasterPage.page.getByTestId('approve-btn-branch');

    if (await approvalCards.isVisible()) {

        console.log('Approval card found');

        const approvalStatus = dealerMasterPage.page.getByTestId('approval-status-branch');

        const approveButton =
            dealerMasterPage.page.getByTestId('approve-btn-branch');

        await expect(approvalStatus).toHaveText('Pending');

        await expect(approveButton).toBeVisible();
        await expect(approveButton).toBeEnabled();

        await approveButton.click();

        const yesButton = dealerMasterPage.page.getByRole('button', {
            name: /yes/i
        });

        if (
            await yesButton
                .isVisible({ timeout: 3000 })
                .catch(() => false)
        ) {
            await yesButton.click();
        }

        await expect(
            dealerMasterPage.page.getByText(
                'Initial Approval has been completed successfully'
            )
        ).toBeVisible({ timeout: 10000 });

        await dealerMasterPage.page
            .getByRole('button', { name: 'OK' })
            .click();
    }
    else {
        console.log(
            'Approval card not available. Skipping approval.'
        );
    }
});

//------------------------------- Verifying OEM Approval By Coordinator ----------------------------------//
test.describe('OEM Approval By Coordinator', () => {

    test.use({
        storageState:
            'tests/storageState/COORDINATOR.json',
    });

    test('Verify documents in approval page by Co-Ordinator',
        async ({ page }) => {

        const addOemPage = new DealerMasterPage(page);

        await page.goto(
            `${process.env.ERP_URL}abf/Dealer`
        );

        await page.waitForLoadState('networkidle');

        await addOemPage.dealerListRadio.click();

        const rows = addOemPage.page
        .locator('[role="rowgroup"]')
        .nth(1)
        .getByRole('row');

        const rowCount = await rows.count();
        await addOemPage.page.waitForTimeout(2000);
        console.log(`Total rows found: ${rowCount}`);
        const targetRow = rows.filter({
        has: addOemPage.page.getByRole('cell', { name: 'Himanshu' }),
        }).first();

        const status = await targetRow.getByRole('cell').nth(6).innerText();
        console.log(`Status found: ${status}`);
        if (status?.trim() === 'Pending') {
        const approveBtn = targetRow.locator('button').nth(4);

        await expect(approveBtn).toBeVisible();
        await expect(approveBtn).toBeEnabled();

        await approveBtn.click();
    }

    await addOemPage.page.waitForLoadState('networkidle');

    await expect(addOemPage.page.getByText('Himanshu')).toBeVisible();

    // Verify approval card is visible
    const approvalCards = addOemPage.page.getByTestId('approve-btn-headOffice');
    console.log(`checking approval card visibility : ${approvalCards}`);
    if (await approvalCards.isVisible()) {

        console.log('Approval card found');

        const approvalStatus =
            addOemPage.page.getByTestId('approval-status-headOffice');

        const approveButton =
            addOemPage.page.getByTestId('approve-btn-headOffice');

        await expect(approvalStatus).toHaveText('Pending');

        await expect(approveButton).toBeVisible();
        await expect(approveButton).toBeEnabled();

        await approveButton.click();
        await expect(addOemPage.page.getByText('Are you sure you want to approve this step?')).toBeVisible();
        const yesButton = addOemPage.page.getByRole('button', {
            name: /yes/i
        });

        if (
            await yesButton
                .isVisible({ timeout: 3000 })
                .catch(() => false)
        ) {
            await yesButton.click();
        }

        await expect(
            addOemPage.page.getByText(
                'Coordinator Approval has been completed successfully'
            )
        ).toBeVisible({ timeout: 10000 });

        await addOemPage.page
            .getByRole('button', { name: 'OK' })
            .click();
    }
    else {
        console.log(
            'Approval card not available. Skipping approval.'
        );
    }
    });
});

//-------------------------------- Verifying OEM Approval By OEM Admin ----------------------------------//
test.describe('OEM Approval By OEM Admin', () => {

    test.use({
        storageState:
            'tests/storageState/OemAdmin.json',
    });

    test('Verify documents in approval page by OEM Admin',
        async ({ page }) => {

        const addOemPage = new DealerMasterPage(page);

        await page.goto(
            `${process.env.ERP_URL}abf/Dealer`
        );

        await page.waitForLoadState('networkidle');

        await addOemPage.dealerListRadio.click();

        const rows = addOemPage.page
        .locator('[role="rowgroup"]')
        .nth(1)
        .getByRole('row');

        const rowCount = await rows.count();
        await addOemPage.page.waitForTimeout(2000);
        console.log(`Total rows found: ${rowCount}`);
        const targetRow = rows.filter({
        has: addOemPage.page.getByRole('cell', { name: 'Himanshu' }),
        }).first();

        const status = await targetRow.getByRole('cell').nth(6).innerText();
        console.log(`Status found: ${status}`);
        if (status?.trim() === 'Pending') {
            const approveBtn = targetRow.locator('button').nth(4);

            await expect(approveBtn).toBeVisible();
            await expect(approveBtn).toBeEnabled();

            await approveBtn.click();
        }

        await addOemPage.page.waitForLoadState('networkidle');

        await expect(addOemPage.page.getByText('Himanshu')).toBeVisible();
        await addOemPage.page.waitForTimeout(3000);
        // Verify approval card is visible
        const approvalCards = addOemPage.page.getByTestId('approve-btn-final');

        if (await approvalCards.isVisible()) {

            console.log('Approval card found');

            const approvalStatus =
                addOemPage.page.getByTestId('approval-status-final');

            const approveButton =
                addOemPage.page.getByTestId('approve-btn-final');

            await expect(approvalStatus).toHaveText('Pending');

            await expect(approveButton).toBeVisible();
            await expect(approveButton).toBeEnabled();

            await approveButton.click();
            await expect(addOemPage.page.getByText('Are you sure you want to approve this step?')).toBeVisible();
            const yesButton = addOemPage.page.getByRole('button', {
                name: /yes/i
            });

            if (
                await yesButton
                    .isVisible({ timeout: 3000 })
                    .catch(() => false)
            ) {
                await yesButton.click();
            }

            await expect(
                addOemPage.page.getByText(
                    'Final / Admin Approval has been completed successfully'
                )
            ).toBeVisible({ timeout: 10000 });

            await addOemPage.page
                .getByRole('button', { name: 'OK' })
                .click();

        }
        else {
            console.log(
                'Approval card not available. Skipping approval.'
            );
        }
        });
    });

    async function deleteOwnerIfExists(page: Page, ownerName: string) {
        const rows = page.locator('table tbody tr');

        let rowCount = await rows.count();

        for (let i = rowCount - 1; i >= 0; i--) {
            const row = rows.nth(i);

            const currentOwnerName = (
                await row.locator('td').nth(1).innerText()
            ).trim();
            console.log(`Checking owner: "${currentOwnerName}" against "${ownerName}"`);
            await dealerMasterPage.page.waitForTimeout(2000);
            if (currentOwnerName === ownerName) {

                await row
                    .getByTestId('delete-owner-button')
                    .click();

                // Adjust if your confirmation popup uses different text
                await page
                    .getByRole('button', { name: /yes|delete/i })
                    .click();

                await dealerMasterPage.page.waitForTimeout(1000);
                //await expect(dealerMasterPage.page.getByText('Deleted!')).toBeVisible();
                //await dealerMasterPage.page.getByRole('button', { name: 'OK' }).click();
                // Optional success popup
                const okButton = page.getByRole('button', { name: 'OK' });

                if (await okButton.isVisible().catch(() => false)) {
                    await okButton.click();
                }

                // Wait for row removal
                await expect(
                    page.locator('table tbody tr')
                ).toHaveCount(rowCount - 1);

                rowCount--;
            }
        }
    }

//------------------------------- Post-Execution Database Cleanup -------------------------------//
//     test.afterAll(async () => {
//     try {
//         console.log('Executing database cleanup...');
//         await executeCleanupQueries();
//         console.log('Cleanup completed');
//     } catch (error) {
//         console.error('Cleanup failed:', error);
//     }
// });
});

