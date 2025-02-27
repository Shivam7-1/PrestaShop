// Import utils
import testContext from '@utils/testContext';

// Import commonTests
import {deleteCartRuleTest} from '@commonTests/BO/catalog/cartRule';

// Import BO pages
import loginCommon from '@commonTests/BO/loginBO';
import cartRulesPage from '@pages/BO/catalog/discounts';
import addCartRulePage from '@pages/BO/catalog/discounts/add';

// Import FO pages
import {vouchersPage as foVouchersPage} from '@pages/FO/classic/myAccount/vouchers';
import {cartPage} from '@pages/FO/classic/cart';
import {blockCartModal} from '@pages/FO/classic/modal/blockCart';

import {
  boDashboardPage,
  dataCustomers,
  FakerCartRule,
  foClassicHomePage,
  foClassicLoginPage,
  foClassicModalQuickViewPage,
  foClassicMyAccountPage,
  utilsDate,
  utilsPlaywright,
} from '@prestashop-core/ui-testing';

import {expect} from 'chai';
import type {BrowserContext, Page} from 'playwright';

const baseContext: string = 'functional_BO_catalog_discounts_cartRules_CRUDCartRule_conditions_limitToSingleCustomer';

/*
Scenario:
- Create new cart rule with limit to single customer
- Go to FO > Login by default customer
- Go to Vouchers page and check the voucher
- Sign out
- Add product to cart and proceed to checkout
- Check that no discount is applied
Post-condition:
- Delete the created cart rule
 */
describe('BO - Catalog - Cart rules : Limit to single customer', async () => {
  let browserContext: BrowserContext;
  let page: Page;

  // Data to create a date format
  const pastDate: string = utilsDate.getDateFormat('yyyy-mm-dd', 'past');
  const futureDate: string = utilsDate.getDateFormat('yyyy-mm-dd', 'future');
  const expirationDate: string = utilsDate.getDateFormat('mm/dd/yyyy', 'future');
  const newCartRuleData: FakerCartRule = new FakerCartRule({
    name: 'Cart rule limit to single customer',
    customer: dataCustomers.johnDoe,
    discountType: 'Percent',
    discountPercent: 20,
    dateFrom: pastDate,
    dateTo: futureDate,
  });

  // before and after functions
  before(async function () {
    browserContext = await utilsPlaywright.createBrowserContext(this.browser);
    page = await utilsPlaywright.newTab(browserContext);
  });

  after(async () => {
    await utilsPlaywright.closeBrowserContext(browserContext);
  });

  describe('BO : Create new cart rule', async () => {
    it('should login in BO', async function () {
      await loginCommon.loginBO(this, page);
    });

    it('should go to \'Catalog > Discounts\' page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToDiscountsPage', baseContext);

      await boDashboardPage.goToSubMenu(
        page,
        boDashboardPage.catalogParentLink,
        boDashboardPage.discountsLink,
      );

      const pageTitle = await cartRulesPage.getPageTitle(page);
      expect(pageTitle).to.contains(cartRulesPage.pageTitle);
    });

    it('should go to new cart rule page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToNewCartRulePage', baseContext);

      await cartRulesPage.goToAddNewCartRulesPage(page);

      const pageTitle = await addCartRulePage.getPageTitle(page);
      expect(pageTitle).to.contains(addCartRulePage.pageTitle);
    });

    it('should create new cart rule', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'createCartRule', baseContext);

      const validationMessage = await addCartRulePage.createEditCartRules(page, newCartRuleData);
      expect(validationMessage).to.contains(addCartRulePage.successfulCreationMessage);
    });
  });

  describe('FO : View discount', async () => {
    it('should open the shop page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToShopFO', baseContext);

      await foClassicHomePage.goTo(page, global.FO.URL);

      const result = await foClassicHomePage.isHomePage(page);
      expect(result).to.eq(true);
    });

    it('should go to login page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToLoginPageFO', baseContext);

      await foClassicHomePage.goToLoginPage(page);

      const pageTitle = await foClassicLoginPage.getPageTitle(page);
      expect(pageTitle, 'Fail to open FO login page').to.contains(foClassicLoginPage.pageTitle);
    });

    it('should sign in with default customer', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'sighInFO', baseContext);

      await foClassicLoginPage.customerLogin(page, dataCustomers.johnDoe);

      const isCustomerConnected = await foClassicLoginPage.isCustomerConnected(page);
      expect(isCustomerConnected, 'Customer is not connected').to.eq(true);
    });

    it('should go to vouchers page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToFOVouchersPage', baseContext);

      await foClassicHomePage.goToMyAccountPage(page);
      await foClassicMyAccountPage.goToVouchersPage(page);

      const pageHeaderTitle = await foVouchersPage.getPageTitle(page);
      expect(pageHeaderTitle).to.equal(foVouchersPage.pageTitle);
    });

    [
      {args: {column: 'code', value: ''}},
      {args: {column: 'description', value: newCartRuleData.name}},
      {args: {column: 'quantity', value: '1'}},
      {args: {column: 'value', value: '20%'}},
      {args: {column: 'minimum', value: 'None'}},
      {args: {column: 'cumulative', value: 'Yes'}},
      {args: {column: 'expiration_date', value: expirationDate}},
    ].forEach((cartRule, index: number) => {
      it(`should check the voucher ${cartRule.args.column}`, async function () {
        await testContext.addContextItem(this, 'testIdentifier', `checkVoucher${index}`, baseContext);

        const cartRuleTextColumn = await foVouchersPage.getTextColumnFromTableVouchers(page, 1, cartRule.args.column);
        expect(cartRuleTextColumn).to.equal(cartRule.args.value);
      });
    });

    it('should sign out', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'signOut', baseContext);

      await foVouchersPage.logout(page);

      const isCustomerConnected = await foClassicLoginPage.isCustomerConnected(page);
      expect(isCustomerConnected, 'Customer is connected!').to.eq(false);
    });

    it('should quick view the first product', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'quickViewTheFirstProduct', baseContext);

      await foClassicLoginPage.goToHomePage(page);
      await foClassicHomePage.quickViewProduct(page, 1);

      const isQuickViewModalVisible = await foClassicModalQuickViewPage.isQuickViewProductModalVisible(page);
      expect(isQuickViewModalVisible).to.equal(true);
    });

    it('should add the product to cart', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'addFirstProductToCart', baseContext);

      await foClassicModalQuickViewPage.addToCartByQuickView(page);
      await blockCartModal.proceedToCheckout(page);

      const pageTitle = await cartPage.getPageTitle(page);
      expect(pageTitle).to.eq(cartPage.pageTitle);
    });

    it('should check that there is no discount applied', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkNoDiscount', baseContext);

      const isVisible = await cartPage.isCartRuleNameVisible(page);
      expect(isVisible).to.eq(false);
    });

    it('should delete the last product from the cart', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'deleteLastProduct', baseContext);

      await cartPage.deleteProduct(page, 1);

      const notificationNumber = await cartPage.getCartNotificationsNumber(page);
      expect(notificationNumber).to.eq(0);
    });
  });

  // Post-condition: Delete the created cart rule
  deleteCartRuleTest(newCartRuleData.name, `${baseContext}_postTest`);
});
