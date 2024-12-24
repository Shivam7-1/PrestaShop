import {expect} from 'chai';
import imageSettingsPage from '@pages/BO/design/imageSettings';
import addImageTypePage from '@pages/BO/design/imageSettings/add';
import linkWidgetsPage from '@pages/BO/design/linkWidgets';
import addLinkWidgetPage from '@pages/BO/design/linkWidgets/add';
import pagesPage from '@pages/BO/design/pages';
import addPagePage from '@pages/BO/design/pages/add';
import addPageCategoryPage from '@pages/BO/design/pages/pageCategory/add';
import testContext from '@utils/testContext';

import {
  boDashboardPage,
  boDesignEmailThemesPage,
  boDesignEmailThemesPreviewPage,
  boDesignPositionsHookModulePage,
  boDesignPositionsPage,
  boLoginPage,
  boThemeAdvancedConfigurationPage,
  boThemeAndLogoChooseLayoutsPage,
  boThemeAndLogoImportPage,
  boThemeAndLogoPage,
  boThemePagesConfigurationPage,
  type BrowserContext,
  dataCMSPages,
  dataHooks,
  type Page,
  utilsPlaywright,
} from '@prestashop-core/ui-testing';

const baseContext: string = 'audit_BO_design';

describe('BO - Design', async () => {
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

  it('should login in BO', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'loginBO', baseContext);

    await boLoginPage.goTo(page, global.BO.URL);
    await boLoginPage.successLogin(page, global.BO.EMAIL, global.BO.PASSWD);

    const pageTitle = await boDashboardPage.getPageTitle(page);
    expect(pageTitle).to.contains(boDashboardPage.pageTitle);

    const jsErrors = utilsPlaywright.getJsErrors();
    expect(jsErrors.length).to.equals(0);
  });

  it('should go to \'Design > Theme & Logo\' page', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'goToThemeAndLogoPage', baseContext);

    await boDashboardPage.goToSubMenu(
      page,
      boDashboardPage.designParentLink,
      boDashboardPage.themeAndLogoParentLink,
    );
    await boThemeAndLogoPage.closeSfToolBar(page);

    const pageTitle = await boThemeAndLogoPage.getPageTitle(page);
    expect(pageTitle).to.contains(boThemeAndLogoPage.pageTitle);

    const jsErrors = utilsPlaywright.getJsErrors();
    expect(jsErrors.length).to.equals(0);
  });

  it('should go to \'Design > Theme & Logo > Add new theme\' page', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'goToAddNewThemePage', baseContext);

    await boThemeAndLogoPage.goToNewThemePage(page);

    const pageTitle = await boThemeAndLogoImportPage.getPageTitle(page);
    expect(pageTitle).to.contains(boThemeAndLogoImportPage.pageTitle);

    const jsErrors = utilsPlaywright.getJsErrors();
    expect(jsErrors.length).to.equals(0);
  });

  it('should go to \'Design > Theme & Logo > Choose layouts\' page', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'goToChooseLayoutsPage', baseContext);

    await boThemeAndLogoImportPage.goToPreviousPage(page);
    await boThemeAndLogoPage.goToChooseLayoutsPage(page);

    const pageTitle = await boThemeAndLogoChooseLayoutsPage.getPageTitle(page);
    expect(pageTitle).to.contains(boThemeAndLogoChooseLayoutsPage.pageTitle);

    const jsErrors = utilsPlaywright.getJsErrors();
    expect(jsErrors.length).to.equals(0);
  });

  it('should go to \'Design > Theme & Logo > Pages Configuration\' page', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'goToSubTabPagesConfiguration', baseContext);

    await boThemeAndLogoPage.goToSubTabPagesConfiguration(page);

    const pageTitle = await boThemePagesConfigurationPage.getPageTitle(page);
    expect(pageTitle).to.contains(boThemePagesConfigurationPage.pageTitle);

    const jsErrors = utilsPlaywright.getJsErrors();
    expect(jsErrors.length).to.equals(0);
  });

  it('should go to \'Design > Theme & Logo > Advanced Customization\' page', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'goToSubTabAdvancedCustomization', baseContext);

    await boThemeAndLogoPage.goToSubTabAdvancedCustomization(page);

    const pageTitle = await boThemeAdvancedConfigurationPage.getPageTitle(page);
    expect(pageTitle).to.contains(boThemeAdvancedConfigurationPage.pageTitle);

    const jsErrors = utilsPlaywright.getJsErrors();
    expect(jsErrors.length).to.equals(0);
  });

  it('should go to \'Design > Email Theme\' page', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'goToEmailThemePage', baseContext);

    await boDashboardPage.goToSubMenu(
      page,
      boDashboardPage.designParentLink,
      boDashboardPage.emailThemeLink,
    );
    await boDesignEmailThemesPage.closeSfToolBar(page);

    const pageTitle = await boDesignEmailThemesPage.getPageTitle(page);
    expect(pageTitle).to.contains(boDesignEmailThemesPage.pageTitle);

    const jsErrors = utilsPlaywright.getJsErrors();
    expect(jsErrors.length).to.equals(0);
  });

  it('should go to \'Design > Email Theme > Preview\' page', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'previewEmailTheme', baseContext);

    await boDesignEmailThemesPage.previewEmailTheme(page, 'classic');

    const pageTitle = await boDesignEmailThemesPreviewPage.getPageTitle(page);
    expect(pageTitle).to.contains(`${boDesignEmailThemesPreviewPage.pageTitle} classic`);

    const jsErrors = utilsPlaywright.getJsErrors();
    expect(jsErrors.length).to.equals(0);
  });

  it('should go to \'Design > Pages\' page', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'goToCmsPagesPage', baseContext);

    await boDashboardPage.goToSubMenu(
      page,
      boDashboardPage.designParentLink,
      boDashboardPage.pagesLink,
    );
    await pagesPage.closeSfToolBar(page);

    const pageTitle = await pagesPage.getPageTitle(page);
    expect(pageTitle).to.contains(pagesPage.pageTitle);

    const jsErrors = utilsPlaywright.getJsErrors();
    expect(jsErrors.length).to.equals(0);
  });

  it('should go to \'Design > Pages > Add new page category\' page', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'goToAddCategory', baseContext);

    await pagesPage.goToAddNewPageCategory(page);

    const pageTitle = await addPageCategoryPage.getPageTitle(page);
    expect(pageTitle).to.contains(addPageCategoryPage.pageTitleCreate);

    const jsErrors = utilsPlaywright.getJsErrors();
    expect(jsErrors.length).to.equals(0);
  });

  it('should go to \'Design > Pages > Add new page\' page', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'goToAddPage', baseContext);

    await addPageCategoryPage.goToPreviousPage(page);
    await pagesPage.goToAddNewPage(page);

    const pageTitle = await addPagePage.getPageTitle(page);
    expect(pageTitle).to.contains(addPagePage.pageTitleCreate);

    const jsErrors = utilsPlaywright.getJsErrors();
    expect(jsErrors.length).to.equals(0);
  });

  it('should go to \'Design > Pages > Edit page\' page', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'goToEditPage', baseContext);

    await addPageCategoryPage.goToPreviousPage(page);
    await pagesPage.goToEditPage(page, 1);

    const pageTitle = await addPagePage.getPageTitle(page);
    expect(pageTitle).to.contains(addPagePage.editPageTitle(dataCMSPages.delivery.title));

    const jsErrors = utilsPlaywright.getJsErrors();
    expect(jsErrors.length).to.equals(0);
  });

  it('should go to \'Design > Positions\' page', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'goToPositionsPage', baseContext);

    await boDashboardPage.goToSubMenu(
      page,
      boDashboardPage.designParentLink,
      boDashboardPage.positionsLink,
    );
    await boDesignPositionsPage.closeSfToolBar(page);

    const pageTitle = await boDesignPositionsPage.getPageTitle(page);
    expect(pageTitle).to.contains(boDesignPositionsPage.pageTitle);

    const jsErrors = utilsPlaywright.getJsErrors();
    expect(jsErrors.length).to.equals(0);
  });

  it('should go to \'Design > Positions > Hook a module\' page', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'addNewHook', baseContext);

    await boDesignPositionsPage.clickHeaderHookModule(page);

    const pageTitle = await boDesignPositionsHookModulePage.getPageTitle(page);
    expect(pageTitle).to.be.equal(boDesignPositionsHookModulePage.pageTitle);

    const jsErrors = utilsPlaywright.getJsErrors();
    expect(jsErrors.length).to.equals(0);
  });

  it('should go to \'Design > Image Settings\' page', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'goToImageSettingsPage', baseContext);

    await boDashboardPage.goToSubMenu(
      page,
      boDashboardPage.designParentLink,
      boDashboardPage.imageSettingsLink,
    );
    await imageSettingsPage.closeSfToolBar(page);

    const pageTitle = await imageSettingsPage.getPageTitle(page);
    expect(pageTitle).to.contains(imageSettingsPage.pageTitle);

    const jsErrors = utilsPlaywright.getJsErrors();
    expect(jsErrors.length).to.equals(0);
  });

  it('should go to \'Design > Image Settings > Add new image type\' page', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'goToAddImageTypePage', baseContext);

    await imageSettingsPage.goToNewImageTypePage(page);

    const pageTitle = await addImageTypePage.getPageTitle(page);
    expect(pageTitle).to.equal(addImageTypePage.pageTitleCreate);

    const jsErrors = utilsPlaywright.getJsErrors();
    expect(jsErrors.length).to.equals(0);
  });

  it('should go to \'Design > Image Settings > Edit image type\' page', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'goToEditImageTypePage', baseContext);

    await addImageTypePage.goToPreviousPage(page);
    await imageSettingsPage.gotoEditImageTypePage(page, 1);

    const pageTitle = await addImageTypePage.getPageTitle(page);
    expect(pageTitle).to.equal(addImageTypePage.pageTitleEdit('cart_default'));

    const jsErrors = utilsPlaywright.getJsErrors();
    expect(jsErrors.length).to.equals(0);
  });

  it('should go to \'Design > Link List\' page', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'goToLinkWidgetPage', baseContext);

    await boDashboardPage.goToSubMenu(
      page,
      boDashboardPage.designParentLink,
      boDashboardPage.linkWidgetLink,
    );
    await linkWidgetsPage.closeSfToolBar(page);

    const pageTitle = await linkWidgetsPage.getPageTitle(page);
    expect(pageTitle).to.contains(linkWidgetsPage.pageTitle);

    const jsErrors = utilsPlaywright.getJsErrors();
    expect(jsErrors.length).to.equals(0);
  });

  it('should go to \'Design > Link List > New block\' page', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'goToNewLinkWidgetPage', baseContext);

    await linkWidgetsPage.goToNewLinkWidgetPage(page);

    const pageTitle = await addLinkWidgetPage.getPageTitle(page);
    expect(pageTitle).to.contains(addLinkWidgetPage.pageTitle);

    const jsErrors = utilsPlaywright.getJsErrors();
    expect(jsErrors.length).to.equals(0);
  });

  it('should go to \'Design > Link List > Edit block\' page', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'goToEditLinkWidgetPage', baseContext);

    await addLinkWidgetPage.goToPreviousPage(page);
    await linkWidgetsPage.goToEditLinkWidgetPage(page, dataHooks.displayFooter.name, 1);

    const pageTitle = await addLinkWidgetPage.getPageTitle(page);
    expect(pageTitle).to.contains(addLinkWidgetPage.pageTitle);

    const jsErrors = utilsPlaywright.getJsErrors();
    expect(jsErrors.length).to.equals(0);
  });
});
