//pages/ABFModule/OEM_SubModule/AddOem.page.ts
import { Page, Locator, expect } from '@playwright/test';
export class AddOemPage {
  readonly page: Page;
  readonly oemListRadio: Locator;
  readonly createOemRadio: Locator;
  readonly backToOemListButton: Locator;
  readonly addOemTab: Locator;
  readonly addOwnerPartnerTab: Locator;
  readonly oemBrandTab: Locator;
  readonly documentationTab: Locator;
  readonly approvalsTab: Locator;
  readonly product: Locator;
  readonly brand: Locator;
  readonly firmType: Locator;
  readonly firmName: Locator;
  readonly officeAddress: Locator;
  readonly officePincode: Locator;
  readonly city: Locator;
  //readonly district: Locator;
  //readonly state: Locator;
  readonly mobileNumber: Locator;
  readonly emailId: Locator;
  readonly panNumber: Locator;
  readonly gstNumber: Locator;
  readonly cinNumber: Locator;
  readonly category: Locator;
  readonly upFrontAmount: Locator;
  readonly perTransactionAmount: Locator;
  readonly totalAmount: Locator;
  readonly oemTypeEmpanelled: Locator;
  readonly oemTypeNonEmpanelled: Locator;
  readonly saveButton: Locator;

  //---------------- ADD Owner/Partner Tab Locators ----------------//
  readonly ownerPartnerName: Locator;
  readonly ownerPartnerEmailId: Locator;
  readonly ownerPartnerPhoneNumber: Locator;
  readonly ownerPartnerAadharNumber: Locator;
  readonly ownerPartnerPanNumber: Locator;
  readonly ownerPartnerAddress: Locator;
  readonly ownerPartnerPincode: Locator;
  readonly ownerPartnerCity: Locator;
  readonly ownerPartnerDistrict: Locator;
  //readonly ownerPartnerState: Locator;
  readonly addOwnerPartnerButton: Locator;
  readonly ownerPartnerSaveButton: Locator;
  readonly removeOwnerPartnerCardButton: Locator;

  readonly ownerPartnerName1: Locator;
  readonly ownerPartnerEmailId1: Locator;
  readonly ownerPartnerPhoneNumber1: Locator;
  readonly ownerPartnerAadharNumber1: Locator;
  readonly ownerPartnerPanNumber1: Locator;
  readonly ownerPartnerAddress1: Locator;
  readonly ownerPartnerPincode1: Locator;
  readonly ownerPartnerCity1: Locator;
  readonly ownerPartnerDistrict1: Locator;
  //readonly ownerPartnerState1: Locator;
  readonly removeOwnerPartnerCardButton1: Locator;
  readonly removeOwnerPartnerCardButton2: Locator;

  //---------------------- Oem Brand Tab Locators ---------------------//
  readonly brandName: Locator;
  readonly brandModelName: Locator;
  readonly brandFuelType: Locator;
  readonly brandSubModelName: Locator;
  readonly brandModelDescription: Locator;
  readonly brandState: Locator;
  readonly brandExShowroomPrice: Locator;
  readonly brandRTO: Locator;
  readonly brandInsurance: Locator;
  readonly brandCreateSubModelButton: Locator;
  readonly brandSubmitButton: Locator;

  //---------------------- Oem Sub Model PopUp Locators ---------------------//
  readonly subModelName: Locator;
  readonly subModelDescription: Locator;
  readonly subModelSaveButton: Locator;

  //---------------------- Document Upload Locators ---------------------//
  readonly approveDocumentButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.oemListRadio = page.getByTestId('view-oem-radio');
    this.createOemRadio = page.getByTestId('create-oem-radio');
    //this.createOemRadio = page.getByTestId('Oem-create-mode');
    this.backToOemListButton = page.getByTestId('back-to-add-oem');
    this.addOemTab = page.getByTestId('tab-add-oem');
    this.addOwnerPartnerTab = page.getByTestId('tab-add-owner-partner');
    this.oemBrandTab = page.getByTestId('tab-oem-brand');
    this.documentationTab = page.getByTestId('tab-documentation');
    this.approvalsTab = page.getByTestId('tab-approval');
    this.product = page.locator('#oem-addoem-select-product-ddl');
    this.brand = page.locator('#oem-addoem-select-brand-ddl');
    this.firmType = page.locator('#oem-addoem-select-firmtype-ddl');

    this.firmName = page.getByTestId('oem-addoem-input-firmname-data');
    this.officeAddress = page.getByTestId('oem-addoem-input-oaddress-data');
    this.officePincode = page.getByTestId('oem-addoem-input-opincode');
    this.city = page.locator('#oem-addoem-select-city-ddl');
    //this.district = page.getByTestId('Oem-district');
    //this.state = page.getByTestId('Oem-state');
    this.mobileNumber = page.getByTestId('oem-addoem-input-phoneno');
    this.emailId = page.getByTestId('oem-addoem-input-emailid');
    this.panNumber = page.getByTestId('oem-addoem-input-panno');
    this.gstNumber = page.getByTestId('oem-addoem-input-gstno');
    this.cinNumber = page.getByTestId('oem-addoem-input-sinno');

    this.category = page.locator('#oem-addoem-select-category-ddl');
    this.upFrontAmount = page.getByTestId('oem-addoem-input-upfrontamt-so-data');
    this.perTransactionAmount = page.getByTestId('oem-addoem-input-pertransaction-so-data');
    this.totalAmount = page.getByTestId('oem-addoem-input-total-data');
    this.oemTypeEmpanelled = page.getByTestId('oem-addoem-checkbox-type-Empanelled');
    this.oemTypeNonEmpanelled = page.getByTestId('oem-addoem-checkbox-type-Non-Empanelled');
    this.saveButton = page.getByTestId('oem-addoem-btn-submit');

    //---------------- ADD Owner/Partner Tab Locators ----------------//
    this.ownerPartnerName = page.getByTestId('input-firm_name-0');
    this.ownerPartnerEmailId = page.getByTestId('input-emailid-0');
    this.ownerPartnerPhoneNumber = page.getByTestId('input-phoneno-0');
    this.ownerPartnerAadharNumber = page.getByTestId('input-aadharno-0');
    this.ownerPartnerPanNumber = page.getByTestId('input-panno-0');
    this.ownerPartnerAddress = page.getByTestId('input-address-0');
    this.ownerPartnerPincode = page.getByTestId('input-pincode-0');
    this.ownerPartnerCity = page.locator('#owner-0-city-input');
    this.ownerPartnerDistrict = page.locator('#owner-0-district-input');
    //this.ownerPartnerState = page.getByTestId('input-state-0');
    this.addOwnerPartnerButton = page.getByTestId('add-owner-button');
    this.ownerPartnerSaveButton = page.getByTestId('submit-owner-form');
    this.removeOwnerPartnerCardButton = page.getByTestId('remove-owner-0');

    this.ownerPartnerName1 = page.getByTestId('input-firm_name-1');
    this.ownerPartnerEmailId1 = page.getByTestId('input-emailid-1');
    this.ownerPartnerPhoneNumber1 = page.getByTestId('input-phoneno-1');
    this.ownerPartnerAadharNumber1 = page.getByTestId('input-aadharno-1');
    this.ownerPartnerPanNumber1 = page.getByTestId('input-panno-1');
    this.ownerPartnerAddress1 = page.getByTestId('input-address-1');
    this.ownerPartnerPincode1 = page.getByTestId('input-pincode-1');
    this.ownerPartnerCity1 = page.locator('#owner-1-city-input');
    this.ownerPartnerDistrict1 = page.locator('#owner-1-district-input');
    //this.ownerPartnerState = page.getByTestId('input-state-0');
    //this.addOwnerPartnerButton = page.getByTestId('add-owner-button');
    //this.ownerPartnerSaveButton = page.getByTestId('submit-owner-form');
    this.removeOwnerPartnerCardButton1 = page.getByTestId('remove-owner-1');
    this.removeOwnerPartnerCardButton2 = page.getByTestId('remove-owner-2');

    //---------------------- Oem Brand Tab Locators ---------------------//
    this.brandName = page.locator('#oem-mapping-select-brand');
    this.brandModelName = page.locator('#oem-mapping-select-vehicle');
    this.brandFuelType = page.locator('#oem-mapping-select-fuel');
    this.brandSubModelName = page.locator('#oem-mapping-select-model');
    this.brandModelDescription = page.getByTestId('model-description-input'); 
    this.brandState = page.locator('#oem-mapping-select-state');
    this.brandExShowroomPrice = page.getByTestId('ex-showroom-input');
    this.brandRTO = page.getByTestId('rto-input');
    this.brandInsurance = page.getByTestId('insurance-input');
    this.brandCreateSubModelButton = page.getByTestId('create-submodel-btn'); 
    this.brandSubmitButton = page.getByTestId('submit-btn'); 

    //---------------------- Oem Sub Model PopUp Locators ---------------------//

    this.subModelName = page.getByTestId('model-name-input'); 
    this.subModelDescription = page.getByTestId('model-description-textarea'); 
    this.subModelSaveButton = page.getByTestId('save-model-popup-btn'); 

    // this.brandTable = page.locator('div[role="table"]');
    // this.brandTableRows = page.locator('div[role="rowgroup"] div[role="row"]');
    // this.brandModelNameCells = page.locator('div[role="row"] div[data-column-id="2"]');

    //---------------------- Document Upload Locators ---------------------//
    this.approveDocumentButton = this.page.getByTestId('proceed-to-approval-btn');
    }

    async handleNoRecordPopup() {
        const popup = this.page.locator('text=No records found');
        await expect(popup).toBeVisible({ timeout: 1000 });
        await this.page.getByRole('button', { name: 'OK' }).click();
    }
}