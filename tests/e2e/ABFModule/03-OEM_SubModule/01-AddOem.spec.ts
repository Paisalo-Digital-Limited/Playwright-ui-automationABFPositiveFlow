//tests/e2e/ABFModule/03-OEM_SubModule/01-AddOem.spec.ts
import { test, expect } from '@playwright/test';
import { AddOemPage } from '../../../../pages/ABFModule/OEM_SubModule/AddOem.page';
import { logRoute } from '../../../utils/routeLogger';
import { randomInt } from 'node:crypto';
import { executeCleanupQueries } from '../../../utils/sqlUtils';

test.use({
    storageState: 'tests/storageState/storageState.json',
});

// test.beforeEach(async ({ page }) => {
//     let addOemPage: AddOemPage;
//         page.on('framenavigated', (frame) => {
//             logRoute(frame.url());
//         });

//         addOemPage = new AddOemPage(page);

//         await page.goto(`${process.env.ERP_URL}abfmaster/oem`);
//         await page.waitForLoadState('networkidle');
//     });

test('Run PostgreSQL cleanup only', async () => {
    try {
        console.log('Executing database cleanup...');
        await executeCleanupQueries();
        console.log('Cleanup completed');
    } catch (error) {
        console.error('Cleanup failed:', error);
        throw error;
    }
});

test.describe('OEM Master Page Automation', () => {
    let addOemPage: AddOemPage;

    test.beforeEach(async ({ page }) => {
        page.on('framenavigated', (frame) => {
            logRoute(frame.url());
        });

        addOemPage = new AddOemPage(page);

        await page.goto(`${process.env.ERP_URL}abfmaster/oem`);
        await page.waitForLoadState('networkidle');
    });

    //------------------------------- Delete Already Created OEMs With Same Firm Name ----------------------------------//
   test('Delete already created OEMs with same firm name', async () => {
        await addOemPage.oemListRadio.click();
        await addOemPage.page.waitForTimeout(2000);
        const oemRows = addOemPage.page.locator('div[role="rowgroup"]').nth(1).getByRole('row');
        const rowCount = await oemRows.count();

        for (let i = 0; i < rowCount; i++) {
            const row = oemRows.nth(i);

            const firmName = await row.getByRole('cell').nth(1).innerText();
            const statusText = await row.getByRole('cell').nth(7).innerText();

            if (firmName.trim() === 'InfoComm LLP' && statusText.includes('Pending'))
            {
                await row.getByRole('button', { name: 'Delete' }).click();
                await addOemPage.page.getByRole('button', { name: 'Yes, delete it!' }).click();

                await addOemPage.page.getByRole('button', { name: 'OK' }).click();
            }
        }
    });

    //------------------------------- Positive Scenario For ADD OEM TAB ----------------------------------//
    // ✅ Add OEM
    test('Add OEM Successfully', async () => {
        await addOemPage.createOemRadio.click();
        //await addOemPage.addOwnerPartnerTab.click();
        const productInput = addOemPage.product.getByRole('combobox');
        
        // 1. Fill and Select properly
        await productInput.fill('2W');
        await addOemPage.page.getByRole('option', { name: '2W' }).click();
        await productInput.press('Tab');

        const brandInput = addOemPage.brand.getByRole('combobox');
        await brandInput.fill('TVS');
        await addOemPage.page.getByText('TVS', { exact: true }).click();
        await brandInput.press('Enter');

        const firmTypeInput = addOemPage.firmType.getByRole('combobox');
        await firmTypeInput.fill('Partnership');
        await firmTypeInput.press('Enter');
        await addOemPage.firmName.fill('InfoComm LLP');
        await addOemPage.officeAddress.press('Tab');
        await addOemPage.officeAddress.fill('Noida Sector 63, Noida, Uttar Pradesh, India');
        await addOemPage.officePincode.fill('201301');
        await addOemPage.page.waitForTimeout(2000); 
        const cityinput = addOemPage.page.locator('.css-w8a010-control');
        await cityinput.click();
        await addOemPage.page.waitForTimeout(1000);
        // Use fill and select the option
        await cityinput.press('ArrowDown');
        await cityinput.press('Enter');

        await cityinput.press('Tab');

        //await addOemPage.district.fill('Mumbai');
        //await addOemPage.state.fill('Maharashtra');
        await addOemPage.mobileNumber.fill('7654323465');
        await addOemPage.emailId.fill('HR@example.com');
        await addOemPage.panNumber.fill('BZJPM1625A');

        const mismatchPopup = addOemPage.page.locator('text=PAN Name Mismatch');
        await expect(mismatchPopup).toBeVisible({ timeout: 2000 });
        await addOemPage.page.getByRole('button', { name: 'Yes, Proceed' }).click();
        await expect(mismatchPopup).toBeHidden();

        await addOemPage.gstNumber.fill('27BZJPM1625A1Z5');
        await addOemPage.cinNumber.fill('G65464GF5565FHF656757');

        const categoryField = addOemPage.page.getByTestId(
            'oem-addoem-field-category'
        );

        // Scroll the category field into view
        await categoryField.scrollIntoViewIfNeeded();

        // Click the visible React Select control, not its dummy input
        await categoryField.locator('[class*="-control"]').click();

        await addOemPage.page.getByRole('option', {
            name: 'Securities',
            exact: true
        }).click();
        await addOemPage.page.waitForTimeout(1000);

        await addOemPage.upFrontAmount.fill('1000');
        await addOemPage.perTransactionAmount.fill('500');
        await addOemPage.oemTypeEmpanelled.click();
        await addOemPage.saveButton.click();
        await expect(addOemPage.page.locator('text=OEM Successfully Added')).toBeVisible({ timeout: 5000 });

        await addOemPage.page.getByRole('button', { name: 'OK' }).click();
        // Verify in table
        try {
        await addOemPage.handleNoRecordPopup();
        } catch {}
    });

    //------------------------------- ADD Owner/Partner Tab Positive/Negative Scenarios ----------------------------------//
       test('Negative - Try to add owner/partner with existing PAN number', async () => {
            await addOemPage.oemListRadio.click();
            await addOemPage.page.waitForTimeout(2000);
            const oemRows = addOemPage.page.locator('div[role="rowgroup"]').nth(1).getByRole('row');

            const rowCount = await oemRows.count();
            let targetRow;

            for (let i = 0; i < rowCount; i++) {
                const row = oemRows.nth(i);

                const firmName = (await row.getByRole('cell').nth(1).innerText()).trim();
                const statusText = await row.getByRole('cell').nth(7).innerText();
                console.log(`Row ${i}: Firm Name = ${firmName}, Status = ${statusText}`);
                if (firmName === 'InfoComm LLP' && statusText.includes('Pending')) {
                targetRow = row;

                // Edit OEM
                await row.locator('button[id^="oem-addoem-btn-edit"]').click();
                await addOemPage.page.waitForTimeout(200);
                await expect(
                    addOemPage.page.getByTestId('oem-addoem-btn-update')
                ).toBeVisible();
                await addOemPage.page.waitForTimeout(200);
                await addOemPage.page
                    .getByTestId('oem-addoem-btn-update')
                    .click();
                await addOemPage.page.waitForTimeout(200);
                await expect(
                    addOemPage.page.getByText('OEM Successfully Added')
                ).toBeVisible();

                await addOemPage.page.getByRole('button', { name: 'OK' }).click();

                // Back to list
                await addOemPage.backToOemListButton.click();
                await addOemPage.oemListRadio.click();
                await addOemPage.page.waitForTimeout(2000);
                break;
                }
            }

            expect(targetRow).toBeTruthy();

            // Re-fetch rows after page refresh/navigation
            const refreshedRows = addOemPage.page
                .locator('div[role="rowgroup"]')
                .nth(1)
                .getByRole('row');

            for (let i = 0; i < await refreshedRows.count(); i++) {
                const row = refreshedRows.nth(i);

                const firmName = (await row.getByRole('cell').nth(1).innerText()).trim();
                const statusText = await row.getByRole('cell').nth(7).innerText();

                if (firmName === 'InfoComm LLP' && statusText.includes('Pending')) {
                await row.getByRole('button', { name: 'Owner/Partner' }).click();

                await expect(
                    addOemPage.page.getByRole('button', { name: 'OK' })
                ).toBeVisible();

                await addOemPage.page.getByRole('button', { name: 'OK' }).click();

                break;
                }
            }

            // Fill owner/partner form
            await addOemPage.ownerPartnerName.fill('Himanshu');
            await addOemPage.ownerPartnerEmailId.fill('n4N5o@example.com');
            await addOemPage.ownerPartnerPhoneNumber.fill('9876543210');
            await addOemPage.ownerPartnerAadharNumber.fill('123456789012');

            // Existing PAN
            await addOemPage.ownerPartnerPanNumber.fill('BZJPM1625A');

            // Verify duplicate PAN validation
            await expect(
                addOemPage.page.getByText('Verification Failed')
            ).toBeVisible();

            await addOemPage.page.getByRole('button', { name: 'OK' }).click();
        });

       //------------------------------- ADD Owner/Partner Tab Positive Scenarios For Next step Use ----------------------------------//
       test('Positive - Submit valid data with validation check in Add Owner/Partner tab', async () => {
        await addOemPage.oemListRadio.click();

        // Locate OEM rows properly
        await addOemPage.page.waitForTimeout(2000);
        const oemRows = addOemPage.page.locator('div[role="rowgroup"]').nth(1).getByRole('row');

        const rowCount = await oemRows.count();
        console.log(`Total OEM rows: ${rowCount}`);
        // Open Owner/Partner modal for matching OEM
        for (let i = 0; i < rowCount; i++) {
            const row = oemRows.nth(i);

            const firmName = (await row.getByRole('cell').nth(1).innerText()).trim();

            const statusText = (
            await row.getByRole('cell').nth(7).innerText()
            ).trim();

            console.log(`Row ${i}: Firm Name = ${firmName}, Status = ${statusText}`);
            if (firmName === 'InfoComm LLP' && statusText === 'Pending') {
            await row.getByRole('button', { name: 'Owner/Partner' }).click();

            await expect(
                addOemPage.page.getByRole('button', { name: 'OK' })
            ).toBeVisible();

            await addOemPage.page.getByRole('button', { name: 'OK' }).click();
            break;
            }
        }

        // ---------- Name ----------
        await addOemPage.page.waitForTimeout(1000);
        await addOemPage.ownerPartnerName.click();
        await addOemPage.ownerPartnerName.press('Tab');
        await addOemPage.page.waitForTimeout(500);
        await addOemPage.ownerPartnerSaveButton.click();
        await expect(
            addOemPage.page.getByText('Name is required')
        ).toBeVisible();

        await addOemPage.ownerPartnerName.fill('Himanshu Modanwal');

        // ---------- Email ----------
        await addOemPage.ownerPartnerEmailId.click();
        await addOemPage.ownerPartnerEmailId.press('Tab');

        await expect(
            addOemPage.page.getByText('Email is required')
        ).toBeVisible();

        await addOemPage.ownerPartnerEmailId.fill('n4N5o@exampl');

        await expect(
            addOemPage.page.getByText('Valid email is required')
        ).toBeVisible();

        await addOemPage.ownerPartnerEmailId.fill('him@gmail.com');

        // ---------- Phone ----------
        await addOemPage.ownerPartnerPhoneNumber.click();
        await addOemPage.ownerPartnerPhoneNumber.press('Tab');

        await expect(
            addOemPage.page.getByText('Phone Number is required')
        ).toBeVisible();

        await addOemPage.ownerPartnerPhoneNumber.fill('123456789');

        await expect(
            addOemPage.page.getByText('Enter valid 10 digit phone number.')
        ).toBeVisible();

        await addOemPage.ownerPartnerPhoneNumber.fill('1234567890');

        await addOemPage.ownerPartnerSaveButton.click();

        await expect(
            addOemPage.page.getByText(
            'Phone Number must be valid (starting with 6,7, 8, or 9 and followed by 9 digits).'
            )
        ).toBeVisible();

        await addOemPage.ownerPartnerPhoneNumber.fill('9876543210');

        // ---------- Aadhar ----------
        await addOemPage.ownerPartnerAadharNumber.click();
        await addOemPage.ownerPartnerAadharNumber.press('Tab');

        await expect(
            addOemPage.page.getByText('Aadhar number is required')
        ).toBeVisible();

        await addOemPage.ownerPartnerAadharNumber.fill('12345678901');

        await expect(
            addOemPage.page.getByText(
            'Aadhar must be 12 digits.'
            )
        ).toBeVisible();

        await addOemPage.ownerPartnerAadharNumber.fill('123456789012');

        // ---------- PAN ----------
        await addOemPage.ownerPartnerPanNumber.click();
        await addOemPage.ownerPartnerPanNumber.press('Tab');

        await expect(
            addOemPage.page.getByText('PAN Number is required.')
        ).toBeVisible();

        await addOemPage.ownerPartnerPanNumber.fill('ABCDE');

        await expect(
            addOemPage.page.getByText('PAN must be like ABCDE1234F')
        ).toBeVisible();

        await addOemPage.ownerPartnerSaveButton.click();

        await expect(
            addOemPage.page.getByText(
            'PAN Number must follow the format: 5 letters, 4 digits, and 1 letter (e.g., ABCDE1234F)'
            )
        ).toBeVisible();

        await addOemPage.ownerPartnerPanNumber.fill('BZJPM1625A');

        await expect(
            addOemPage.page.getByText('PAN Verified & Name Matched')
        ).toBeVisible();

        await addOemPage.page.getByRole('button', { name: 'OK' }).click();

        await expect(
            addOemPage.page.getByText('PAN Verified & Name Matched')
        ).toBeHidden();

        // ---------- Address ----------
        await addOemPage.ownerPartnerAddress.click();
        await addOemPage.ownerPartnerAddress.press('Tab');

        await expect(
            addOemPage.page.getByText('Address is required.')
        ).toBeVisible();

        await addOemPage.ownerPartnerAddress.fill(
            'Noida Sector 63, Noida, Uttar Pradesh, India'
        );

        // ---------- Pincode ----------
        await addOemPage.ownerPartnerPincode.click();
        await addOemPage.ownerPartnerPincode.press('Tab');

        await expect(
            addOemPage.page.getByText('Pincode is required.')
        ).toBeVisible();

        await addOemPage.ownerPartnerPincode.fill('2013');

        await expect(
            addOemPage.page.getByText('Pincode must be 6 digits.')
        ).toBeVisible();

        await addOemPage.ownerPartnerPincode.fill('111111');

        await expect(
            addOemPage.page.getByText(
            'Invalid pincode. Please enter a valid 6-digit pincode.'
            )
        ).toBeVisible();

        await addOemPage.ownerPartnerPincode.fill('201301');

        // ---------- Save Validation ----------
        await addOemPage.ownerPartnerSaveButton.click();

        // await expect(
        //     addOemPage.page.getByText('City is required.')
        // ).toBeVisible();

        // ---------- City ----------
        await addOemPage.ownerPartnerCity.click();
        await addOemPage.page.waitForTimeout(1000);
        await addOemPage.ownerPartnerCity.fill('Noida HO');
        await addOemPage.page.getByRole('option', { name: 'Noida HO', exact: true }).click();
        await addOemPage.ownerPartnerCity.press('Enter');

        // ---------- District ----------
        await addOemPage.ownerPartnerDistrict.click();
        await addOemPage.page.waitForTimeout(3000);
        await addOemPage.ownerPartnerDistrict.fill('Gautam Buddha Nagar');
        await addOemPage.ownerPartnerDistrict.press('Enter');

        // ---------- Add/Remove Card ----------
        await addOemPage.page.waitForTimeout(2000);
        await addOemPage.addOwnerPartnerButton.click();

        await expect(addOemPage.removeOwnerPartnerCardButton1).toBeVisible();

        await addOemPage.removeOwnerPartnerCardButton1.click();
        await addOemPage.page.waitForTimeout(1000);
        // Final Save
        await addOemPage.ownerPartnerSaveButton.click();
        await expect(addOemPage.page.getByText('Owner/Partner details have been submitted successfully!')).toBeVisible();

        await addOemPage.page.getByRole('button', { name: 'OK' }).click();
    });

    test('Negative - Add all duplicate data in owner/partner in two cards', async () => {
        await addOemPage.oemListRadio.click();
        await addOemPage.page.waitForTimeout(2000);
        const oemRows = addOemPage.page.locator('div[role="rowgroup"]').nth(1).getByRole('row');

        const rowCount = await oemRows.count();

        // Open Owner/Partner for matching OEM
        for (let i = 0; i < rowCount; i++) {
            const row = oemRows.nth(i);

            const firmName = (await row.getByRole('cell').nth(1).innerText()).trim();
            const statusText = (await row.getByRole('cell').nth(7).innerText()).trim();
            console.log(`Row ${i}: Firm Name = ${firmName}, Status = ${statusText}`);

            if (firmName === 'InfoComm LLP' && statusText === 'Pending') {
            await row.getByRole('button', { name: 'Owner/Partner' }).click();

            // await expect(
            //     addOemPage.page.getByRole('button', { name: 'OK' })
            // ).toBeVisible();

            // await addOemPage.page.getByRole('button', { name: 'OK' }).click();

            break;
            }
        }

        // ---------- First Card ----------
        await addOemPage.ownerPartnerName.fill('Himanshu Modanwal');
        await addOemPage.ownerPartnerEmailId.fill('hm1@example.com');
        await addOemPage.ownerPartnerPhoneNumber.fill('9876543210');
        await addOemPage.ownerPartnerAadharNumber.fill('123456789012');
        await addOemPage.ownerPartnerPanNumber.fill('BZJPM1625A');

        await expect(
            addOemPage.page.getByText('PAN Verified & Name Matched')
        ).toBeVisible();

        await addOemPage.page.getByRole('button', { name: 'OK' }).click();

        await addOemPage.ownerPartnerAddress.fill(
            'Noida Sector 63, Noida, Uttar Pradesh, India'
        );

        await addOemPage.ownerPartnerPincode.fill('201301');

        await addOemPage.ownerPartnerCity.click();
        await addOemPage.page.waitForTimeout(1000);
        await addOemPage.ownerPartnerCity.fill('Noida HO');
        await addOemPage.page.getByRole('option', { name: 'Noida HO', exact: true }).click();
        await addOemPage.ownerPartnerCity.press('Enter');

        await addOemPage.ownerPartnerDistrict.click();
        await addOemPage.page.waitForTimeout(2000);
        await addOemPage.ownerPartnerDistrict.fill('Gautam Buddha Nagar');
        await addOemPage.ownerPartnerDistrict.press('Enter');

        // ---------- Add Second Card ----------
        await addOemPage.addOwnerPartnerButton.click();

        // ---------- Duplicate Data ----------
        await addOemPage.ownerPartnerName1.fill('Himanshu Modanwal');
        await addOemPage.ownerPartnerEmailId1.fill('hm2@example.com');
        await addOemPage.ownerPartnerPhoneNumber1.fill('9876543210');
        await addOemPage.ownerPartnerAadharNumber1.fill('123456789012');
        await addOemPage.ownerPartnerPanNumber1.fill('BZJPM1625A');

        await expect(
            addOemPage.page.getByText('PAN Verified & Name Matched')
        ).toBeVisible();

        await addOemPage.page.getByRole('button', { name: 'OK' }).click();

        await addOemPage.ownerPartnerAddress1.fill(
            'Noida Sector 63, Noida, Uttar Pradesh, India'
        );

        await addOemPage.ownerPartnerPincode1.fill('201301');

        await addOemPage.ownerPartnerCity1.click();
        await addOemPage.page.waitForTimeout(1000);
        await addOemPage.ownerPartnerCity1.fill('Noida');
        await addOemPage.ownerPartnerCity1.press('Enter');

        await addOemPage.ownerPartnerDistrict1.click();
        await addOemPage.page.waitForTimeout(2000);
        await addOemPage.ownerPartnerDistrict1.fill('Gautam Buddha Nagar');
        await addOemPage.ownerPartnerDistrict1.press('Enter');

        // Save duplicate entries
        await addOemPage.ownerPartnerSaveButton.click();

        // Verify duplicate validation dialog
        const duplicateDialog =
        addOemPage.page.getByRole('dialog');

        await expect(
        duplicateDialog.getByText(
            'Duplicate data cannot be inserted'
        )
        ).toBeVisible();

        await addOemPage.page
        .getByRole('button', { name: 'OK' })
        .click();
        });
    //------------------------------- Verifying Owner/Partner record in table after adding Owner/Partner in Add OEM Tab ----------------------------------//
       test('Verify Owner/Partner record in table', async () => {
        await addOemPage.page.goto(`${process.env.ERP_URL}abfmaster/oem`);

        await addOemPage.page.waitForLoadState('networkidle');

        await addOemPage.oemListRadio.click();

        const oemRows = addOemPage.page
            .locator('div[role="rowgroup"]')
            .nth(1)
            .getByRole('row');

        const rowCount = await oemRows.count();

        // Open Owner/Partner section
        for (let i = 0; i < rowCount; i++) {
            const row = oemRows.nth(i);

            const firmName = (
            await row.getByRole('cell').nth(1).innerText()
            ).trim();

            const statusText = (
            await row.getByRole('cell').nth(7).innerText()
            ).trim();
            console.log(`Row ${i}: Firm Name = ${firmName}, Status = ${statusText}`);

            if (firmName === 'InfoComm LLP' && statusText === 'Pending') {
            await row
                .getByRole('button', { name: 'Owner/Partner' })
                .click();

            break;
            }
        }

        // Verify owner/partner details directly
        await expect(
            addOemPage.page.getByRole('cell', { name: 'Himanshu Modanwal' })
        ).toBeVisible();

        await expect(
            addOemPage.page.getByRole('cell', { name: 'him@gmail.com' })
        ).toBeVisible();

        await expect(
            addOemPage.page.getByRole('cell', { name: '9876543210' })
        ).toBeVisible();

        await expect(   
            addOemPage.page.getByText(
            'Noida Sector 63, Noida, Uttar Pradesh, India'
            )
        ).toBeVisible();

        await expect(
            addOemPage.page.getByRole('cell', { name: '201301' })
        ).toBeVisible();

        await expect(
            addOemPage.page.getByRole('cell', { name: 'Noida HO', exact: true })
        ).toBeVisible();

        await expect(
            addOemPage.page.getByText('GAUTAM BUDDHA NAGAR')
        ).toBeVisible();

        await expect(
            addOemPage.page.getByText('UTTAR PRADESH', { exact: true })
        ).toBeVisible();
    });

    //------------------------------- Oem Brand Positive/Negative Scenarios For Next step Use ----------------------------------//
    test('Validate Firm Name before OEM Brand mapping', async () => {
        await addOemPage.page.goto(`${process.env.ERP_URL}abfmaster/oem`);
        await addOemPage.page.waitForLoadState('networkidle');

        await addOemPage.oemListRadio.click();
        await addOemPage.page.waitForTimeout(2000);
        const oemRows = addOemPage.page
        .locator('[role="rowgroup"]')
        .nth(1)
        .getByRole('row');

        const rowCount = await oemRows.count();

        let mappingOpened = false;

        for (let i = 0; i < rowCount; i++) {

        const row = oemRows.nth(i);

        const firmName = (
            await row.getByRole('cell').nth(1).innerText()
        ).trim();

        const statusText = (
            await row.getByRole('cell').nth(7).innerText()
        ).trim();

        console.log(
            `Row ${i + 1}: Firm Name=${firmName}, Status=${statusText}`
        );

        if (firmName === 'InfoComm LLP' && statusText === 'Pending') 
            {
            await row.getByRole('button', { name: 'Mapping' }).click();
            await expect(addOemPage.page.getByRole('button', { name: 'OK' })).toBeVisible();
            await addOemPage.page.getByRole('button', { name: 'OK' }).click();

            mappingOpened = true;
            break;
        }
        }

        expect(mappingOpened).toBe(true);

        // Firm name validation
        await expect(addOemPage.page.getByText('InfoComm LLP', { exact: true }).first()).toBeVisible();

        // Brand validation
        await expect(addOemPage.page.getByText('TVS', { exact: true })).toBeVisible();

        // Model validation
        await addOemPage.brandSubmitButton.click();

        const modelError = addOemPage.page.getByText('Model is required', { exact: true });
        const modelErrorWithDot = addOemPage.page.getByText('Model is required.', { exact: true });

        await expect(modelError.or(modelErrorWithDot)).toBeVisible();

        await addOemPage.brandModelName.fill('Jupiter 125');

            const option = addOemPage.page.getByRole('option', {
                name: 'Jupiter 125',
                exact: true
            });

            await expect(option).toBeVisible({ timeout: 10000 });
            await option.click();
        
        await addOemPage.brandSubModelName.click();
        await addOemPage.brandSubmitButton.click();
        const submodelError = addOemPage.page.getByText('Sub Model is required', { exact: true });
        const submodelErrorWithDot = addOemPage.page.getByText('Sub Model is required.', { exact: true });

        await expect(submodelError.or(submodelErrorWithDot)).toBeVisible();

        await addOemPage.brandSubModelName.fill('Jupiter 125');
        await addOemPage.page.getByRole('option', { name: /Jupiter 125/i, exact: true }).first().click();
        await addOemPage.brandSubModelName.press('Enter');
        // Fuel Type validation
        await addOemPage.brandFuelType.click();
        await addOemPage.brandSubModelName.click();
        await expect(addOemPage.page.getByText('Fuel is required')).toBeVisible();
        await addOemPage.brandFuelType.click();
        await addOemPage.brandFuelType.fill('Petrol');
        await addOemPage.page.getByRole('option', {name: 'Petrol',exact: true}).click();

    //-------------- Adding Sub Model PopUp --------------//
        // await addOemPage.brandCreateSubModelButton.click();
        // await addOemPage.page.waitForTimeout(1000);
        // await addOemPage.subModelName.fill('110 CC');
        // const submodelDesc = randomSentence();
        // await addOemPage.subModelDescription.fill(submodelDesc);

        // await addOemPage.subModelSaveButton.click();
        // await expect(addOemPage.page.getByText('Model created successfully!')).toBeVisible({ timeout: 5000 });
        // await addOemPage.page.getByRole('button', { name: 'OK' }).click();

    // Sub model validation
    // // Create sub model
//     await addOemPage.brandCreateSubModelButton.click();
//     await addOemPage.brandState.click();

    

//     await expect(
//   addOemPage.page
//     .locator('#oem-modelpopup-select-brand')
//     .locator('xpath=ancestor::div[contains(@class,"react-select__value-container")]')
//     .locator('.react-select__single-value')
// ).toHaveText('TVS');

// await expect(
//   addOemPage.page
//     .locator('#oem-modelpopup-select-vehicle')
//     .locator('xpath=ancestor::div[contains(@class,"react-select__value-container")]')
//     .locator('.react-select__single-value')
// ).toHaveText('Shine');

// await expect(
//   addOemPage.page
//     .locator('#oem-modelpopup-select-fuel')
//     .locator('xpath=ancestor::div[contains(@class,"react-select__value-container")]')
//     .locator('.react-select__single-value')
// ).toHaveText('CNG');

//     const subModelNm = `${randomInt(100000)} 6G`;
//     console.log('Sub Model Name:', subModelNm);
//     await addOemPage.subModelName.fill(subModelNm);

//     await addOemPage.subModelDescription.fill(
//             '6G is the latest model of Activa with enhanced features and improved performance.'
//         );

//     await addOemPage.subModelSaveButton.click();
//     await expect(addOemPage.page.getByText('Model created successfully!')).toBeVisible({ timeout: 5000 });

//     await addOemPage.page.getByRole('button', { name: 'OK' }).click();

    // State validation
    await addOemPage.brandState.click();
    await addOemPage.brandExShowroomPrice.click();

    await expect(addOemPage.page.getByText('State is required')).toBeVisible();

    await addOemPage.brandState.fill('Uttar Pradesh');
    await addOemPage.brandState.press('Enter');
    await addOemPage.brandSubmitButton.click();

    // Price validation
    await addOemPage.brandExShowroomPrice.fill('');
    await addOemPage.brandExShowroomPrice.press('Tab');

    await expect(addOemPage.page.getByText('Ex Showroom Price must be greater than 0', { exact: true })).toBeVisible();

    await addOemPage.brandExShowroomPrice.fill('45000');
    await addOemPage.brandSubmitButton.click();
    await addOemPage.page.waitForTimeout(1000);
    
    await expect(addOemPage.page.getByText('RTO must be greater than zero.').or(addOemPage.page.getByText('RTO must be greater than 0'))).toBeVisible();

    await addOemPage.brandRTO.fill('5000');
    await addOemPage.brandSubmitButton.click();
    await addOemPage.page.waitForTimeout(1000);
    await expect(addOemPage.page.getByText('Insurance must be greater than zero.').or(addOemPage.page.getByText('Insurance must be greater than 0'))).toBeVisible();

    await addOemPage.brandInsurance.fill('2000');
    // Submit
    await addOemPage.brandSubmitButton.click();

    await expect(addOemPage.page.getByText('Record Insert Successfully!!')).toBeVisible({ timeout: 5000 });
    await addOemPage.page.getByRole('button', { name: 'OK' }).click();
});

//------------------------------- Deleting existing docs and uploading again Add OEM ----------------------------------//
test('Delete existing docs and upload again', async () => {

    await addOemPage.page.goto(`${process.env.ERP_URL}abfmaster/oem`);
    await addOemPage.page.waitForLoadState('networkidle');

    await addOemPage.oemListRadio.click();

    const rows = addOemPage.page
        .locator('[role="rowgroup"]')
        .nth(1)
        .getByRole('row');

    const rowCount = await rows.count();
    await addOemPage.page.waitForTimeout(2000);
    console.log(`Total rows found: ${rowCount}`);
    for (let i = 0; i < rowCount; i++) {

        const row = rows.nth(i);

        const firmName = (
            await row.getByRole('cell').nth(1).innerText()
        ).trim();

        const status = (
            await row.getByRole('cell').nth(7).innerText()
        ).trim();

        if (
            firmName === 'InfoComm LLP' &&
            status === 'Pending'
        ) {
            await row.getByRole('button', { name: 'Docs' }).click();
            break;
        }
    }

    await addOemPage.page.waitForLoadState('networkidle');

    const filePath =
        'tests/downloads/UploadFiles/Samplefile.pdf';

    const cards = addOemPage.page.locator(
        '[id^="document-card-"]'
    );
    await addOemPage.page.waitForTimeout(2000);
    const cardCount = await cards.count();
    console.log(`Total document cards found: ${cardCount}`);
    for (let i = 0; i < cardCount; i++) {

        const card = cards.nth(i);

        const cardText = await card.innerText();
        await addOemPage.page.waitForTimeout(100);
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

        await addOemPage.page.waitForTimeout(100);
        // Delete if already uploaded
        const deleteBtn = addOemPage.page.locator(
            `#delete-doc-${docId}`
        );

        if (await deleteBtn.count() > 0) {

            await deleteBtn.click();

            await addOemPage.page
                .getByRole('button', { name: /yes/i })
                .click();

            await expect(
                addOemPage.page.getByText(
                    'Record Delete Successfully!!'
                )
            ).toBeVisible();

            await addOemPage.page
                .getByRole('button', { name: 'OK' })
                .click();

            await addOemPage.page
                .locator(`#upload-input-${docId}`)
                .waitFor({ state: 'attached' });
        }

        // Upload file
        await addOemPage.page
            .locator(`#upload-input-${docId}`)
            .setInputFiles(filePath);

        console.log(`Uploaded document ${docId}`);
    }

    await addOemPage.page.waitForTimeout(1000);

    await addOemPage.approveDocumentButton.click();
    await expect(addOemPage.page.getByText('All Mandatory Documents Uploaded!')).toBeVisible();
    await addOemPage.page.getByRole('button', { name: 'Go to Approval Page' }).click();
});

//------------------------------- Verifying OEM Approval By Branch ----------------------------------//
test('Verify documents in approval page', async () => {
    await addOemPage.page.goto(`${process.env.ERP_URL}abfmaster/oem`);
    await addOemPage.page.waitForLoadState('networkidle');
    await addOemPage.oemListRadio.click();

    const rows = addOemPage.page
        .locator('[role="rowgroup"]')
        .nth(1)
        .getByRole('row');

    const rowCount = await rows.count();
    await addOemPage.page.waitForTimeout(2000);
    console.log(`Total rows found: ${rowCount}`);
    const targetRow = rows.filter({
        has: addOemPage.page.getByRole('cell', { name: 'InfoComm LLP' }),
        }).first();

        await addOemPage.page.waitForTimeout(200);
        const status = await targetRow.getByRole('cell').nth(7).textContent();
        console.log(`Status of InfoComm LLP: ${status?.trim()}`);

        if (status?.trim() === 'Pending') {
        const approveBtn = targetRow.locator('button').nth(4);

        await expect(approveBtn).toBeVisible();
        await expect(approveBtn).toBeEnabled();

        await approveBtn.click();
    }

    await addOemPage.page.waitForLoadState('networkidle');

    await expect(addOemPage.page.getByText('InfoComm LLP')).toBeVisible();

    // Verify approval card is visible
    const approvalCards = addOemPage.page.getByTestId('approve-branch');
    console.log(`Approval card count: ${await approvalCards.count()}`);
    await addOemPage.page.waitForTimeout(500);
    if (await approvalCards.isVisible()) {

        console.log('Approval card found');

        const approvalStatus =
            addOemPage.page.locator('#step-status-branch');

        const approveButton =
            addOemPage.page.locator('#approve-branch');

        await expect(approvalStatus).toHaveText('Pending');

        await expect(approveButton).toBeVisible();
        await expect(approveButton).toBeEnabled();

        await approveButton.click();

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
                'Initial Approval has been completed successfully,'
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

//------------------------------- Verifying OEM Approval By Coordinator ----------------------------------//
test.describe('OEM Approval By Coordinator', () => {

    test.use({
        storageState:
            'tests/storageState/Coordinator.json',
    });

    test('Verify documents in approval page by Co-Ordinator',
        async ({ page }) => {

        const addOemPage = new AddOemPage(page);

        await page.goto(
            `${process.env.ERP_URL}abfmaster/oem`
        );

        await page.waitForLoadState('networkidle');

        await addOemPage.oemListRadio.click();

        const rows = addOemPage.page
        .locator('[role="rowgroup"]')
        .nth(1)
        .getByRole('row');

        const rowCount = await rows.count();
        await addOemPage.page.waitForTimeout(2000);
        console.log(`Total rows found: ${rowCount}`);
        const targetRow = rows.filter({
        has: addOemPage.page.getByRole('cell', { name: 'InfoComm LLP' }),
        }).first();

        await addOemPage.page.waitForTimeout(200);
        const status = await targetRow.getByRole('cell').nth(7).textContent();
        console.log(`Status of InfoComm LLP: ${status?.trim()}`);

        if (status?.trim() === 'Pending') {
        const approveBtn = targetRow.locator('button').nth(4);

        await expect(approveBtn).toBeVisible();
        await expect(approveBtn).toBeEnabled();

        await approveBtn.click();
    }

    await addOemPage.page.waitForLoadState('networkidle');

    await expect(addOemPage.page.getByText('InfoComm LLP')).toBeVisible();

    // Verify approval card is visible
    const approvalCards = addOemPage.page.getByTestId('approve-headOffice');
    console.log(`Approval card count: ${await approvalCards.count()}`);

    await addOemPage.page.waitForTimeout(500);
    if (await approvalCards.isVisible()) {

        console.log('Approval card found');

        const approvalStatus =
            addOemPage.page.getByTestId('step-status-headOffice');

        const approveButton =
            addOemPage.page.getByTestId('approve-headOffice');

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
                'Coordinator Approval has been completed successfully,'
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

        const addOemPage = new AddOemPage(page);

        await page.goto(
            `${process.env.ERP_URL}abfmaster/oem`
        );

        await page.waitForLoadState('networkidle');

        await addOemPage.oemListRadio.click();

        const rows = addOemPage.page
        .locator('[role="rowgroup"]')
        .nth(1)
        .getByRole('row');

        const rowCount = await rows.count();
        await addOemPage.page.waitForTimeout(2000);
        console.log(`Total rows found: ${rowCount}`);
        const targetRow = rows.filter({
        has: addOemPage.page.getByRole('cell', { name: 'InfoComm LLP' }),
        }).first();

        await addOemPage.page.waitForTimeout(200);
        const status = await targetRow.getByRole('cell').nth(7).textContent();
        console.log(`Status of InfoComm LLP: ${status?.trim()}`);

        if (status?.trim() === 'Pending') {
        const approveBtn = targetRow.locator('button').nth(4);

        await expect(approveBtn).toBeVisible();
        await expect(approveBtn).toBeEnabled();

        await approveBtn.click();
    }

    await addOemPage.page.waitForLoadState('networkidle');

    await expect(addOemPage.page.getByText('InfoComm LLP')).toBeVisible();
    await addOemPage.page.waitForTimeout(3000);
    // Verify approval card is visible
    const approvalCards = addOemPage.page.getByTestId('approve-final');
    console.log(`Approval card count: ${await approvalCards.count()}`);

    await addOemPage.page.waitForTimeout(500);
    if (await approvalCards.isVisible()) {

        console.log('Approval card found');

        const approvalStatus =
            addOemPage.page.getByTestId('step-status-final');

        const approveButton =
            addOemPage.page.getByTestId('approve-final');

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
                'Final / Admin Approval has been completed successfully,'
            )
        ).toBeVisible({ timeout: 15000 });

        await addOemPage.page
            .getByRole('button', { name: 'OK' })
            .click();

        await expect(approvalStatus)
            .not.toHaveText('Pending');
    }
    else {
        console.log(
            'Approval card not available. Skipping approval.'
        );
    }
    });
});

function randomSentence(): string {
  const subjects = ['The bike', 'A rider', 'This model', 'Our company', 'The engine'];
  const verbs = ['runs', 'performs', 'travels', 'rides', 'operates'];
  const adjectives = ['smoothly', 'efficiently', 'stylishly', 'reliably', 'powerfully'];
  const objects = ['on the road', 'in the city', 'during the test', 'under heavy load', 'with great comfort'];

  const subject = subjects[Math.floor(Math.random() * subjects.length)];
  const verb = verbs[Math.floor(Math.random() * verbs.length)];
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const object = objects[Math.floor(Math.random() * objects.length)];

  return `${subject} ${verb} ${adjective} ${object}.`;
}
});

