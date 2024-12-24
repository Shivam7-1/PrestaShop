import {expect} from 'chai';
import {addressesPage as foClassicAddressesPage} from '@pages/FO/classic/myAccount/addresses';
import {addAddressPage as foClassicAddressesCreatePage} from '@pages/FO/classic/myAccount/addAddress';
import {accountIdentityPage as foClassicAccountIdentityPage} from '@pages/FO/classic/myAccount/identity';
import {orderHistoryPage as foClassicOrderHistoryPage} from '@pages/FO/classic/myAccount/orderHistory';
import {orderDetailsPage as foClassicOrderDetailsPage} from '@pages/FO/classic/myAccount/orderDetails';
import {creditSlipPage as foClassicCreditSlipsPage} from '@pages/FO/classic/myAccount/creditSlips';
import {gdprPersonalDataPage as foClassicGdprPersonalDataPage} from '@pages/FO/classic/myAccount/gdprPersonalData';
import testContext from '@utils/testContext';

import {
  type BrowserContext,
  dataCustomers,
  foClassicHomePage,
  foClassicLoginPage,
  foClassicMyAccountPage,
  foClassicMyWishlistsPage,
  foClassicMyWishlistsViewPage,
  type Page,
  utilsPlaywright,
} from '@prestashop-core/ui-testing';

const baseContext: string = 'audit_FO_classic_connected';

describe('Check FO connected pages', async () => {
  let browserContext: BrowserContext;
  let page: Page;

  before(async function () {
    utilsPlaywright.setErrorsCaptured(true);

    browserContext = await utilsPlaywright.createBrowserContext(this.browser);
    page = await utilsPlaywright.newTab(browserContext);
  });

  after(async () => {
    await utilsPlaywright.closeBrowserContext(browserContext);
  });

  it('should go to the home page', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'goToHome', baseContext);

    await foClassicHomePage.goTo(page, global.FO.URL);

    const result = await foClassicHomePage.isHomePage(page);
    expect(result).to.eq(true);

    const jsErrors = utilsPlaywright.getJsErrors();
    expect(jsErrors.length).to.equals(0);
  });

  it('should go to login page', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'goToLoginFO', baseContext);

    await foClassicHomePage.goToLoginPage(page);

    const pageTitle = await foClassicLoginPage.getPageTitle(page);
    expect(pageTitle).to.contains(foClassicLoginPage.pageTitle);

    const jsErrors = utilsPlaywright.getJsErrors();
    expect(jsErrors.length).to.equals(0);
  });

  it('should sign in with default customer', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'customerLogin', baseContext);

    await foClassicLoginPage.customerLogin(page, dataCustomers.johnDoe);

    const isCustomerConnected = await foClassicLoginPage.isCustomerConnected(page);
    expect(isCustomerConnected).to.eq(true);

    const jsErrors = utilsPlaywright.getJsErrors();
    expect(jsErrors.length).to.equals(0);
  });

  it('should go to account page', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'goToAccountPage', baseContext);

    await foClassicHomePage.goToMyAccountPage(page);

    const pageTitle = await foClassicMyAccountPage.getPageTitle(page);
    expect(pageTitle).to.contains(foClassicMyAccountPage.pageTitle);

    const jsErrors = utilsPlaywright.getJsErrors();
    expect(jsErrors.length).to.equals(0);
  });

  it('should go to the "Your personal information" page', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'goToInformationPage', baseContext);

    await foClassicMyAccountPage.goToInformationPage(page);

    const pageTitle = await foClassicAccountIdentityPage.getPageTitle(page);
    expect(pageTitle).to.equal(foClassicAccountIdentityPage.pageTitle);

    const jsErrors = utilsPlaywright.getJsErrors();
    expect(jsErrors.length).to.equals(0);
  });

  it('should go to the "Your addresses" page', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'goToAddressesPage', baseContext);

    await foClassicAccountIdentityPage.goToMyAccountPage(page);
    await foClassicMyAccountPage.goToAddressesPage(page);

    const pageHeaderTitle = await foClassicAddressesPage.getPageTitle(page);
    expect(pageHeaderTitle).to.equal(foClassicAddressesPage.pageTitle);

    const jsErrors = utilsPlaywright.getJsErrors();
    expect(jsErrors.length).to.equals(0);
  });

  it('should go to the "New address" page', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'goToNewAddressPage', baseContext);

    await foClassicAddressesPage.openNewAddressForm(page);

    const pageHeaderTitle = await foClassicAddressesCreatePage.getHeaderTitle(page);
    expect(pageHeaderTitle).to.equal(foClassicAddressesCreatePage.creationFormTitle);

    const jsErrors = utilsPlaywright.getJsErrors();
    expect(jsErrors.length).to.equals(0);
  });

  it('should go to the "Order history" page', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'goToHistoryAndDetailsPage', baseContext);

    await foClassicAccountIdentityPage.goToMyAccountPage(page);
    await foClassicMyAccountPage.goToHistoryAndDetailsPage(page);

    const pageTitle = await foClassicOrderHistoryPage.getPageTitle(page);
    expect(pageTitle).to.contains(foClassicOrderHistoryPage.pageTitle);

    const jsErrors = utilsPlaywright.getJsErrors();
    expect(jsErrors.length).to.equals(0);
  });

  it('should go to the "Order details" page', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'goToDetailsPage', baseContext);

    await foClassicOrderHistoryPage.goToDetailsPage(page, 1);

    const pageTitle = await foClassicOrderDetailsPage.getPageTitle(page);
    expect(pageTitle).to.equal(foClassicOrderDetailsPage.pageTitle);

    const jsErrors = utilsPlaywright.getJsErrors();
    expect(jsErrors.length).to.equals(0);
  });

  it('should go to the "Credit slips" page', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'goToCreditSlipsPage', baseContext);

    await foClassicAccountIdentityPage.goToMyAccountPage(page);
    await foClassicMyAccountPage.goToCreditSlipsPage(page);

    const pageTitle = await foClassicCreditSlipsPage.getPageTitle(page);
    expect(pageTitle).to.equal(foClassicCreditSlipsPage.pageTitle);

    const jsErrors = utilsPlaywright.getJsErrors();
    expect(jsErrors.length).to.equals(0);
  });

  it('should go to the "My wishlists" page', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'goToMyWishlistsPage', baseContext);

    await foClassicAccountIdentityPage.goToMyAccountPage(page);
    await foClassicMyAccountPage.goToMyWishlistsPage(page);

    const pageTitle = await foClassicMyWishlistsPage.getPageTitle(page);
    expect(pageTitle).to.contains(foClassicMyWishlistsPage.pageTitle);

    const jsErrors = utilsPlaywright.getJsErrors();
    expect(jsErrors.length).to.equals(0);
  });

  it('should go to the "My wishlist" page', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'goToWishlistPage', baseContext);

    await foClassicMyWishlistsPage.goToWishlistPage(page, 1);

    const pageTitle = await foClassicMyWishlistsViewPage.getPageTitle(page);
    expect(pageTitle).to.contains('My wishlist');

    const jsErrors = utilsPlaywright.getJsErrors();
    expect(jsErrors.length).to.equals(0);
  });

  it('should go to the "GDPR - Personal data" page', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'goToMyGDPRPersonalDataPage', baseContext);

    await foClassicAccountIdentityPage.goToMyAccountPage(page);
    await foClassicMyAccountPage.goToMyGDPRPersonalDataPage(page);

    const pageTitle = await foClassicGdprPersonalDataPage.getPageTitle(page);
    expect(pageTitle).to.equal(foClassicGdprPersonalDataPage.pageTitle);

    const jsErrors = utilsPlaywright.getJsErrors();
    expect(jsErrors.length).to.equals(0);
  });

  it('should logout', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'logout', baseContext);

    await foClassicGdprPersonalDataPage.logout(page);

    const result = await foClassicHomePage.isHomePage(page);
    expect(result).to.eq(true);

    const jsErrors = utilsPlaywright.getJsErrors();
    expect(jsErrors.length).to.equals(0);
  });
});
