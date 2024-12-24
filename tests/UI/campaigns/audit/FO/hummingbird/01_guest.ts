import {expect} from 'chai';
import {disableHummingbird, enableHummingbird} from '@commonTests/BO/design/hummingbird';
import pricesDropPage from '@pages/FO/hummingbird/pricesDrop';
import newProductsPage from '@pages/FO/hummingbird/newProducts';
import bestSalesPage from '@pages/FO/hummingbird/bestSales';
import deliveryPage from '@pages/FO/hummingbird/delivery';
import legalNoticePage from '@pages/FO/hummingbird/legalNotice';
import createAccountPage from '@pages/FO/hummingbird/myAccount/add';
import guestOrderTrackingPage from '@pages/FO/hummingbird/orderTracking/guestOrderTracking';
import termsAndConditionsOfUsePage from '@pages/FO/hummingbird/termsAndConditionsOfUse';
import securePaymentPage from '@pages/FO/hummingbird/securePayment';
import siteMapPage from '@pages/FO/hummingbird/siteMap';
import storesPage from '@pages/FO/hummingbird/stores';
import testContext from '@utils/testContext';

import {
  type BrowserContext,
  dataCategories,
  dataProducts,
  foHummingbirdAboutUsPage,
  foHummingbirdCategoryPage,
  foHummingbirdContactUsPage,
  foHummingbirdHomePage,
  foHummingbirdLoginPage,
  foHummingbirdProductPage,
  foHummingbirdSearchResultsPage,
  type Page,
  utilsPlaywright,
} from '@prestashop-core/ui-testing';

const baseContext: string = 'audit_FO_hummingbird_guest';

describe('Check FO public pages', async () => {
  let browserContext: BrowserContext;
  let page: Page;

  // Pre-condition : Enable Hummingbird
  enableHummingbird(`${baseContext}_preTest_0`);

  describe('Check FO public pages', async () => {
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

    it('should go to a category page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToCategory', baseContext);

      await foHummingbirdHomePage.goToCategory(page, dataCategories.clothes.id);

      const pageTitle = await foHummingbirdCategoryPage.getPageTitle(page);
      expect(pageTitle).to.equal(dataCategories.clothes.name);

      const jsErrors = utilsPlaywright.getJsErrors();
      expect(jsErrors.length).to.equals(0);
    });

    it('should go to a subcategory page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToSubCategory', baseContext);

      await foHummingbirdCategoryPage.goToSubCategory(page, dataCategories.clothes.id, dataCategories.men.id);

      const pageTitle = await foHummingbirdCategoryPage.getPageTitle(page);
      expect(pageTitle).to.equal(dataCategories.men.name);

      const jsErrors = utilsPlaywright.getJsErrors();
      expect(jsErrors.length).to.equals(0);
    });

    it('should go to a product page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToProduct', baseContext);

      await foHummingbirdCategoryPage.goToProductPage(page, 1);

      const pageTitle = await foHummingbirdProductPage.getPageTitle(page);
      expect(pageTitle.toUpperCase()).to.contains(dataProducts.demo_1.name.toUpperCase());

      const jsErrors = utilsPlaywright.getJsErrors();
      expect(jsErrors.length).to.equals(0);
    });

    it('should search a product', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToSearch', baseContext);

      await foHummingbirdProductPage.searchProduct(page, 'shirt');

      const pageTitle = await foHummingbirdSearchResultsPage.getPageTitle(page);
      expect(pageTitle).to.equal(foHummingbirdSearchResultsPage.pageTitle);

      const jsErrors = utilsPlaywright.getJsErrors();
      expect(jsErrors.length).to.equals(0);
    });

    describe('Check \'Products\' footer links', async () => {
      [
        {linkSelector: 'Prices drop', pageTitle: pricesDropPage.pageTitle},
        {linkSelector: 'New products', pageTitle: newProductsPage.pageTitle},
        {linkSelector: 'Best sellers', pageTitle: bestSalesPage.pageTitle},
      ].forEach((args, index: number) => {
        it(`should check '${args.linkSelector}' footer links`, async function () {
          await testContext.addContextItem(this, 'testIdentifier', `checkProductsFooterLinks${index}`, baseContext);

          await foHummingbirdHomePage.goToFooterLink(page, args.linkSelector);

          const pageTitle = await foHummingbirdHomePage.getPageTitle(page);
          expect(pageTitle).to.equal(args.pageTitle);

          const jsErrors = utilsPlaywright.getJsErrors();
          expect(jsErrors.length).to.equals(0);
        });
      });
    });

    describe('Check \'Our Company\' footer links', async () => {
      [
        {linkSelector: 'Delivery', pageTitle: deliveryPage.pageTitle},
        {linkSelector: 'Legal Notice', pageTitle: legalNoticePage.pageTitle},
        {linkSelector: 'Terms and conditions of use', pageTitle: termsAndConditionsOfUsePage.pageTitle},
        {linkSelector: 'About us', pageTitle: foHummingbirdAboutUsPage.pageTitle},
        {linkSelector: 'Secure payment', pageTitle: securePaymentPage.pageTitle},
        {linkSelector: 'Contact us', pageTitle: foHummingbirdContactUsPage.pageTitle},
        {linkSelector: 'Sitemap', pageTitle: siteMapPage.pageTitle},
        {linkSelector: 'Stores', pageTitle: storesPage.pageTitle},
      ].forEach((args, index: number) => {
        it(`should check '${args.linkSelector}' footer links`, async function () {
          await testContext.addContextItem(this, 'testIdentifier', `checkOurCompanyFooterLinks${index}`, baseContext);

          await foHummingbirdHomePage.goToFooterLink(page, args.linkSelector);

          const pageTitle = await foHummingbirdHomePage.getPageTitle(page);
          expect(pageTitle).to.equal(args.pageTitle);

          const jsErrors = utilsPlaywright.getJsErrors();
          expect(jsErrors.length).to.equals(0);
        });
      });
    });

    describe('Check \'Your Account\' footer links', async () => {
      [
        {linkSelector: 'Order tracking', pageTitle: guestOrderTrackingPage.pageTitle},
        {linkSelector: 'Sign in', pageTitle: foHummingbirdLoginPage.pageTitle},
        {linkSelector: 'Create account', pageTitle: createAccountPage.formTitle},
      ].forEach((args, index: number) => {
        it(`should check '${args.linkSelector}' footer links`, async function () {
          await testContext.addContextItem(this, 'testIdentifier', `checkYourAccountFooterLinks${index}`, baseContext);

          await foHummingbirdHomePage.goToFooterLink(page, args.linkSelector);

          let pageTitle: string = '';

          if (args.linkSelector === 'Create account') {
            pageTitle = await createAccountPage.getHeaderTitle(page);
          } else {
            pageTitle = await foHummingbirdHomePage.getPageTitle(page);
          }
          expect(pageTitle).to.equal(args.pageTitle);
        });
      });
    });
  });

  // Post-condition : Disable Hummingbird
  disableHummingbird(`${baseContext}_postTest_0`);
});
