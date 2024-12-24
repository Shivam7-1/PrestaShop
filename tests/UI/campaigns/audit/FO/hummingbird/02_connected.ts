import {expect} from 'chai';
import {disableHummingbird, enableHummingbird} from '@commonTests/BO/design/hummingbird';
import foHummingbirdAddressesPage from '@pages/FO/hummingbird/myAccount/addresses';
import foHummingbirdAddressesCreatePage from '@pages/FO/hummingbird/myAccount/addAddress';
import foHummingbirdAccountIdentityPage from '@pages/FO/hummingbird/myAccount/identity';
import foHummingbirdOrderHistoryPage from '@pages/FO/hummingbird/myAccount/orderHistory';
import foHummingbirdOrderDetailsPage from '@pages/FO/hummingbird/myAccount/orderDetails';
import foHummingbirdCreditSlipsPage from '@pages/FO/hummingbird/myAccount/creditSlips';
import foHummingbirdGdprPersonalDataPage from '@pages/FO/hummingbird/myAccount/gdprPersonalData';
import testContext from '@utils/testContext';

import {
  type BrowserContext,
  dataCustomers,
  foHummingbirdHomePage,
  foHummingbirdLoginPage,
  foHummingbirdMyAccountPage,
  foHummingbirdMyWishlistsPage,
  foHummingbirdMyWishlistsViewPage,
  type Page,
  utilsPlaywright,
} from '@prestashop-core/ui-testing';

const baseContext: string = 'audit_FO_hummingbird_connected';

describe('Check FO connected pages', async () => {
  let browserContext: BrowserContext;
  let page: Page;

  // Pre-condition : Enable Hummingbird
  enableHummingbird(`${baseContext}_preTest_0`);

  describe('Check FO connected pages', async () => {
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

      await foHummingbirdHomePage.goTo(page, global.FO.URL);

      const result = await foHummingbirdHomePage.isHomePage(page);
      expect(result).to.eq(true);

      const jsErrors = utilsPlaywright.getJsErrors();
      expect(jsErrors.length).to.equals(0);
    });

    it('should go to login page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToLoginFO', baseContext);

      await foHummingbirdHomePage.goToLoginPage(page);

      const pageTitle = await foHummingbirdLoginPage.getPageTitle(page);
      expect(pageTitle).to.contains(foHummingbirdLoginPage.pageTitle);

      const jsErrors = utilsPlaywright.getJsErrors();
      expect(jsErrors.length).to.equals(0);
    });

    it('should sign in with default customer', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'customerLogin', baseContext);

      await foHummingbirdLoginPage.customerLogin(page, dataCustomers.johnDoe);

      const isCustomerConnected = await foHummingbirdLoginPage.isCustomerConnected(page);
      expect(isCustomerConnected).to.eq(true);

      const jsErrors = utilsPlaywright.getJsErrors();
      expect(jsErrors.length).to.equals(0);
    });

    it('should go to account page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToAccountPage', baseContext);

      await foHummingbirdHomePage.goToMyAccountPage(page);

      const pageTitle = await foHummingbirdMyAccountPage.getPageTitle(page);
      expect(pageTitle).to.contains(foHummingbirdMyAccountPage.pageTitle);

      const jsErrors = utilsPlaywright.getJsErrors();
      expect(jsErrors.length).to.equals(0);
    });

    it('should go to the "Your personal information" page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToInformationPage', baseContext);

      await foHummingbirdMyAccountPage.goToInformationPage(page);

      const pageTitle = await foHummingbirdAccountIdentityPage.getPageTitle(page);
      expect(pageTitle).to.equal(foHummingbirdAccountIdentityPage.pageTitle);

      const jsErrors = utilsPlaywright.getJsErrors();
      expect(jsErrors.length).to.equals(0);
    });

    it('should go to the "Your addresses" page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToAddressesPage', baseContext);

      await foHummingbirdAccountIdentityPage.goToMyAccountPage(page);
      await foHummingbirdMyAccountPage.goToAddressesPage(page);

      const pageHeaderTitle = await foHummingbirdAddressesPage.getPageTitle(page);
      expect(pageHeaderTitle).to.equal(foHummingbirdAddressesPage.pageTitle);

      const jsErrors = utilsPlaywright.getJsErrors();
      expect(jsErrors.length).to.equals(0);
    });

    it('should go to the "New address" page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToNewAddressPage', baseContext);

      await foHummingbirdAddressesPage.openNewAddressForm(page);

      const pageHeaderTitle = await foHummingbirdAddressesCreatePage.getHeaderTitle(page);
      expect(pageHeaderTitle).to.equal(foHummingbirdAddressesCreatePage.creationFormTitle);

      const jsErrors = utilsPlaywright.getJsErrors();
      expect(jsErrors.length).to.equals(0);
    });

    it('should go to the "Order history" page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToHistoryAndDetailsPage', baseContext);

      await foHummingbirdAccountIdentityPage.goToMyAccountPage(page);
      await foHummingbirdMyAccountPage.goToHistoryAndDetailsPage(page);

      const pageTitle = await foHummingbirdOrderHistoryPage.getPageTitle(page);
      expect(pageTitle).to.contains(foHummingbirdOrderHistoryPage.pageTitle);

      const jsErrors = utilsPlaywright.getJsErrors();
      expect(jsErrors.length).to.equals(0);
    });

    it('should go to the "Order details" page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToDetailsPage', baseContext);

      await foHummingbirdOrderHistoryPage.goToDetailsPage(page, 1);

      const pageTitle = await foHummingbirdOrderDetailsPage.getPageTitle(page);
      expect(pageTitle).to.equal(foHummingbirdOrderDetailsPage.pageTitle);

      const jsErrors = utilsPlaywright.getJsErrors();
      expect(jsErrors.length).to.equals(0);
    });

    it('should go to the "Credit slips" page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToCreditSlipsPage', baseContext);

      await foHummingbirdAccountIdentityPage.goToMyAccountPage(page);
      await foHummingbirdMyAccountPage.goToCreditSlipsPage(page);

      const pageTitle = await foHummingbirdCreditSlipsPage.getPageTitle(page);
      expect(pageTitle).to.equal(foHummingbirdCreditSlipsPage.pageTitle);

      const jsErrors = utilsPlaywright.getJsErrors();
      expect(jsErrors.length).to.equals(0);
    });

    it('should go to the "My wishlists" page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToMyWishlistsPage', baseContext);

      await foHummingbirdAccountIdentityPage.goToMyAccountPage(page);
      await foHummingbirdMyAccountPage.goToMyWishlistsPage(page);

      const pageTitle = await foHummingbirdMyWishlistsPage.getPageTitle(page);
      expect(pageTitle).to.contains(foHummingbirdMyWishlistsPage.pageTitle);

      const jsErrors = utilsPlaywright.getJsErrors();
      expect(jsErrors.length).to.equals(0);
    });

    it('should go to the "My wishlist" page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToWishlistPage', baseContext);

      await foHummingbirdMyWishlistsPage.goToWishlistPage(page, 1);

      const pageTitle = await foHummingbirdMyWishlistsViewPage.getPageTitle(page);
      expect(pageTitle).to.contains('My wishlist');

      const jsErrors = utilsPlaywright.getJsErrors();
      expect(jsErrors.length).to.equals(0);
    });

    it('should go to the "GDPR - Personal data" page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToMyGDPRPersonalDataPage', baseContext);

      await foHummingbirdAccountIdentityPage.goToMyAccountPage(page);
      await foHummingbirdMyAccountPage.goToMyGDPRPersonalDataPage(page);

      const pageTitle = await foHummingbirdGdprPersonalDataPage.getPageTitle(page);
      expect(pageTitle).to.equal(foHummingbirdGdprPersonalDataPage.pageTitle);

      const jsErrors = utilsPlaywright.getJsErrors();
      expect(jsErrors.length).to.equals(0);
    });

    it('should logout', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'logout', baseContext);

      await foHummingbirdGdprPersonalDataPage.logout(page);

      const result = await foHummingbirdHomePage.isHomePage(page);
      expect(result).to.eq(true);

      const jsErrors = utilsPlaywright.getJsErrors();
      expect(jsErrors.length).to.equals(0);
    });
  });

  // Post-condition : Disable Hummingbird
  disableHummingbird(`${baseContext}_postTest_0`);
});
