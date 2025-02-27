// Import utils
import testContext from '@utils/testContext';

// Import commonTests
import loginCommon from '@commonTests/BO/loginBO';

// Import pages
// Import BO pages
import orderSettingsPage from '@pages/BO/shopParameters/orderSettings';
// Import FO pages
import {cartPage} from '@pages/FO/classic/cart';

import {expect} from 'chai';
import type {BrowserContext, Page} from 'playwright';
import {
  boDashboardPage,
  foClassicHomePage,
  foClassicProductPage,
  utilsPlaywright,
} from '@prestashop-core/ui-testing';

const baseContext: string = 'functional_BO_shopParameters_orderSettings_orderSettings_general_minimumPurchaseTotalRequired';

/*
Update minimum purchase total value
Go to FO and check the alert message
 */
describe('BO - Shop Parameters - Order Settings : Test minimum purchase total required in order to validate the'
  + ' order', async () => {
  let browserContext: BrowserContext;
  let page: Page;

  const newPurchaseTotalRequired: number = 100;
  const defaultPurchaseTotalRequired: number = 0;
  const alertMessage: string = `A minimum shopping cart total of €${newPurchaseTotalRequired}.00 (tax excl.) is required`
    + ' to validate your order.';

  // before and after functions
  before(async function () {
    browserContext = await utilsPlaywright.createBrowserContext(this.browser);
    page = await utilsPlaywright.newTab(browserContext);
  });

  after(async () => {
    await utilsPlaywright.closeBrowserContext(browserContext);
  });

  it('should login in BO', async function () {
    await loginCommon.loginBO(this, page);
  });

  it('should go to \'Shop Parameters > Order Settings\' page', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'goToOrderSettingsPage', baseContext);

    await boDashboardPage.goToSubMenu(
      page,
      boDashboardPage.shopParametersParentLink,
      boDashboardPage.orderSettingsLink,
    );
    await orderSettingsPage.closeSfToolBar(page);

    const pageTitle = await orderSettingsPage.getPageTitle(page);
    expect(pageTitle).to.contains(orderSettingsPage.pageTitle);
  });

  const tests = [
    {args: {value: newPurchaseTotalRequired, disable: true, alertMessage: true}},
    {args: {value: defaultPurchaseTotalRequired, disable: false, alertMessage: false}},
  ];

  tests.forEach((test, index: number) => {
    it('should update Minimum purchase total required in order to validate the order value', async function () {
      await testContext.addContextItem(this, 'testIdentifier', `updateMinimumPurchaseTotal_${index}`, baseContext);

      const result = await orderSettingsPage.setMinimumPurchaseRequiredTotal(page, test.args.value);
      expect(result).to.contains(orderSettingsPage.successfulUpdateMessage);
    });

    it('should view my shop', async function () {
      await testContext.addContextItem(this, 'testIdentifier', `viewMyShop${index}`, baseContext);

      // Click on view my shop
      page = await orderSettingsPage.viewMyShop(page);

      // Change Fo language
      await foClassicHomePage.changeLanguage(page, 'en');

      const isHomePage = await foClassicHomePage.isHomePage(page);
      expect(isHomePage, 'Home page is not displayed').to.eq(true);
    });

    it('should add product to cart', async function () {
      await testContext.addContextItem(this, 'testIdentifier', `addProductToCart_${index}`, baseContext);

      // Go to the first product page
      await foClassicHomePage.goToProductPage(page, 1);

      // Add the created product to the cart
      await foClassicProductPage.addProductToTheCart(page);

      const notificationsNumber = await cartPage.getCartNotificationsNumber(page);
      expect(notificationsNumber).to.be.equal(index + 1);
    });

    it('should verify the minimum purchase total value', async function () {
      await testContext.addContextItem(this, 'testIdentifier', `checkMinimumPurchaseTotal_${index}`, baseContext);

      // Check proceed to checkout button enable/disable
      const isDisabled = await cartPage.isProceedToCheckoutButtonDisabled(page);
      expect(isDisabled).to.equal(test.args.disable);

      // Check alert message
      const isAlertVisible = await cartPage.isAlertWarningForMinimumPurchaseVisible(page);
      expect(isAlertVisible).to.equal(test.args.alertMessage);

      if (isAlertVisible) {
        const alertText = await cartPage.getAlertWarning(page);
        expect(alertText).to.contains(alertMessage);
      }
    });

    it('should go back to BO', async function () {
      await testContext.addContextItem(this, 'testIdentifier', `BackToBO${index}`, baseContext);

      page = await cartPage.closePage(browserContext, page, 0);

      const pageTitle = await orderSettingsPage.getPageTitle(page);
      expect(pageTitle).to.contains(orderSettingsPage.pageTitle);
    });
  });
});
