// Import utils
import testContext from '@utils/testContext';

// Import commonTests
import loginCommon from '@commonTests/BO/loginBO';

// Import pages
import customerSettingsPage from '@pages/BO/shopParameters/customerSettings';

import {
  boCustomerGroupsPage,
  boCustomerGroupsCreatePage,
  boDashboardPage,
  dataGroups,
  FakerGroup,
  utilsCore,
  utilsPlaywright,
} from '@prestashop-core/ui-testing';

import {expect} from 'chai';
import type {BrowserContext, Page} from 'playwright';

const baseContext: string = 'functional_BO_shopParameters_customerSettings_groups_filterSortAndPaginationGroups';

describe('BO - Shop Parameters - Customer Settings : Filter, sort and pagination groups', async () => {
  let browserContext: BrowserContext;
  let page: Page;
  let numberOfGroups: number = 0;

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

  it('should go to \'Shop Parameters > Customer Settings\' page', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'goToCustomerSettingsPage', baseContext);

    await boDashboardPage.goToSubMenu(
      page,
      boDashboardPage.shopParametersParentLink,
      boDashboardPage.customerSettingsLink,
    );

    await customerSettingsPage.closeSfToolBar(page);

    const pageTitle = await customerSettingsPage.getPageTitle(page);
    expect(pageTitle).to.contains(customerSettingsPage.pageTitle);
  });

  it('should go to \'Groups\' page', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'goToGroupsPage', baseContext);

    await customerSettingsPage.goToGroupsPage(page);

    const pageTitle = await boCustomerGroupsPage.getPageTitle(page);
    expect(pageTitle).to.contains(boCustomerGroupsPage.pageTitle);
  });

  it('should reset all filters and get number of groups in BO', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'resetFilterFirst', baseContext);

    numberOfGroups = await boCustomerGroupsPage.resetAndGetNumberOfLines(page);
    expect(numberOfGroups).to.be.above(0);
  });

  // 1 - Filter
  describe('Filter groups', async () => {
    const tests = [
      {
        args:
          {
            testIdentifier: 'filterId',
            filterType: 'input',
            filterBy: 'id_group',
            filterValue: dataGroups.visitor.id,
          },
      },
      {
        args:
          {
            testIdentifier: 'filterName',
            filterType: 'input',
            filterBy: 'b!name',
            filterValue: dataGroups.visitor.name,
          },
      },
      {
        args:
          {
            testIdentifier: 'filterDiscount',
            filterType: 'input',
            filterBy: 'reduction',
            filterValue: dataGroups.visitor.discount,
          },
      },
      {
        args:
          {
            testIdentifier: 'filterMembers',
            filterType: 'input',
            filterBy: 'nb',
            filterValue: '1',
          },
      },
      {
        args:
          {
            testIdentifier: 'filterShopPrices',
            filterType: 'select',
            filterBy: 'show_prices',
            filterValue: dataGroups.visitor.shownPrices ? '1' : '0',
          },
        expected: 'Yes',
      },
    ];

    tests.forEach((test) => {
      it(`should filter by ${test.args.filterBy} '${test.args.filterValue}'`, async function () {
        await testContext.addContextItem(this, 'testIdentifier', test.args.testIdentifier, baseContext);

        await boCustomerGroupsPage.filterTable(
          page,
          test.args.filterType,
          test.args.filterBy,
          test.args.filterValue,
        );

        const numberOfGroupsAfterFilter = await boCustomerGroupsPage.getNumberOfElementInGrid(page);
        expect(numberOfGroupsAfterFilter).to.be.at.most(numberOfGroups);

        for (let row = 1; row <= numberOfGroupsAfterFilter; row++) {
          const textColumn = await boCustomerGroupsPage.getTextColumn(page, row, test.args.filterBy);

          if (test.expected !== undefined) {
            expect(textColumn).to.contains(test.expected);
          } else {
            expect(textColumn).to.contains(test.args.filterValue);
          }
        }
      });

      it('should reset all filters', async function () {
        await testContext.addContextItem(this, 'testIdentifier', `${test.args.testIdentifier}Reset`, baseContext);

        const numberOfGroupsAfterReset = await boCustomerGroupsPage.resetAndGetNumberOfLines(page);
        expect(numberOfGroupsAfterReset).to.equal(numberOfGroups);
      });
    });
  });

  // 2 - Sort
  describe('Sort groups', async () => {
    [
      {
        args:
          {
            testIdentifier: 'sortByIdDesc', sortBy: 'id_group', sortDirection: 'desc', isFloat: true,
          },
      },
      {
        args:
          {
            testIdentifier: 'sortByGroupNameAsc', sortBy: 'name', sortDirection: 'asc',
          },
      },
      {
        args:
          {
            testIdentifier: 'sortByGroupNameDesc', sortBy: 'name', sortDirection: 'desc',
          },
      },
      {
        args:
          {
            testIdentifier: 'sortByDiscountAsc', sortBy: 'reduction', sortDirection: 'asc',
          },
      },
      {
        args:
          {
            testIdentifier: 'sortByDiscountDesc', sortBy: 'reduction', sortDirection: 'desc',
          },
      },
      {
        args:
          {
            testIdentifier: 'sortByMembersAsc', sortBy: 'nb', sortDirection: 'asc', isFloat: true,
          },
      },
      {
        args:
          {
            testIdentifier: 'sortByMembersDesc', sortBy: 'nb', sortDirection: 'desc', isFloat: true,
          },
      },
      {
        args:
          {
            testIdentifier: 'sortByCreationDateAsc', sortBy: 'date_add', sortDirection: 'asc', isDate: true,
          },
      },
      {
        args:
          {
            testIdentifier: 'sortByCreationDateDesc', sortBy: 'date_add', sortDirection: 'desc', isDate: true,
          },
      },
      {
        args:
          {
            testIdentifier: 'sortByIdAsc', sortBy: 'id_group', sortDirection: 'asc', isFloat: true,
          },
      },
    ].forEach((test: {
      args: { testIdentifier: string, sortBy: string, sortDirection: string, isFloat?: boolean, isDate?: boolean }
    }) => {
      it(`should sort by '${test.args.sortBy}' '${test.args.sortDirection}' and check result`, async function () {
        await testContext.addContextItem(this, 'testIdentifier', test.args.testIdentifier, baseContext);

        const nonSortedTable = await boCustomerGroupsPage.getAllRowsColumnContent(page, test.args.sortBy);
        await boCustomerGroupsPage.sortTable(page, test.args.sortBy, test.args.sortDirection);

        const sortedTable = await boCustomerGroupsPage.getAllRowsColumnContent(page, test.args.sortBy);

        if (test.args.isFloat) {
          const nonSortedTableFloat = nonSortedTable.map((text: string): number => parseFloat(text));
          const sortedTableFloat = sortedTable.map((text: string): number => parseFloat(text));

          const expectedResult = await utilsCore.sortArrayNumber(nonSortedTableFloat);

          if (test.args.sortDirection === 'asc') {
            expect(sortedTableFloat).to.deep.equal(expectedResult);
          } else {
            expect(sortedTableFloat).to.deep.equal(expectedResult.reverse());
          }
        } else if (test.args.isDate) {
          const expectedResult = await utilsCore.sortArrayDate(nonSortedTable);

          if (test.args.sortDirection === 'asc') {
            expect(sortedTable).to.deep.equal(expectedResult);
          } else {
            expect(sortedTable).to.deep.equal(expectedResult.reverse());
          }
        } else {
          const expectedResult = await utilsCore.sortArray(nonSortedTable);

          if (test.args.sortDirection === 'asc') {
            expect(sortedTable).to.deep.equal(expectedResult);
          } else {
            expect(sortedTable).to.deep.equal(expectedResult.reverse());
          }
        }
      });
    });
  });

  // 3 - Create 19 groups
  describe('Create 18 groups', async () => {
    const creationTests: number[] = new Array(18).fill(0, 0, 18);
    creationTests.forEach((value: number, index: number) => {
      const groupToCreate: FakerGroup = new FakerGroup({name: `toSortAndPaginate${index}`});

      it('should go to add new group page', async function () {
        await testContext.addContextItem(this, 'testIdentifier', `goToNewGroupPage${index}`, baseContext);

        await boCustomerGroupsPage.goToNewGroupPage(page);

        const pageTitle = await boCustomerGroupsCreatePage.getPageTitle(page);
        expect(pageTitle).to.contains(boCustomerGroupsCreatePage.pageTitleCreate);
      });

      it(`should create group n°${index + 1} and check result`, async function () {
        await testContext.addContextItem(this, 'testIdentifier', `createGroup${index}`, baseContext);

        const textResult = await boCustomerGroupsCreatePage.createEditGroup(page, groupToCreate);
        expect(textResult).to.contains(boCustomerGroupsPage.successfulCreationMessage);

        const numberOfGroupsAfterCreation = await boCustomerGroupsPage.getNumberOfElementInGrid(page);
        expect(numberOfGroupsAfterCreation).to.be.equal(numberOfGroups + index + 1);
      });
    });
  });

  // 4 - Pagination
  describe('Pagination groups', async () => {
    it('should change the items number to 20 per page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'changeItemNumberTo10', baseContext);

      const paginationNumber = await boCustomerGroupsPage.selectPaginationLimit(page, 20);
      expect(paginationNumber).to.equal('1');
    });

    it('should click on next', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'clickOnNext', baseContext);

      const paginationNumber = await boCustomerGroupsPage.paginationNext(page);
      expect(paginationNumber).to.equal('2');
    });

    it('should click on previous', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'clickOnPrevious', baseContext);

      const paginationNumber = await boCustomerGroupsPage.paginationPrevious(page);
      expect(paginationNumber).to.equal('1');
    });

    it('should change the items number to 50 per page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'changeItemNumberTo50', baseContext);

      const paginationNumber = await boCustomerGroupsPage.selectPaginationLimit(page, 50);
      expect(paginationNumber).to.equal('1');
    });
  });

  // 5 - Bulk delete
  describe('Bulk delete groups', async () => {
    it('should filter list by name', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'filterForBulkDelete', baseContext);

      await boCustomerGroupsPage.filterTable(page, 'input', 'b!name', 'toSortAndPaginate');

      const numberOfGroupsAfterFilter = await boCustomerGroupsPage.getNumberOfElementInGrid(page);
      expect(numberOfGroupsAfterFilter).to.eq(18);

      for (let i = 1; i <= numberOfGroupsAfterFilter; i++) {
        const textColumn = await boCustomerGroupsPage.getTextColumn(page, i, 'name');
        expect(textColumn).to.contains('toSortAndPaginate');
      }
    });

    it('should delete groups with Bulk Actions and check result', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'bulkDeleteGroups', baseContext);

      const deleteTextResult = await boCustomerGroupsPage.bulkDeleteGroups(page);
      expect(deleteTextResult).to.be.contains(boCustomerGroupsPage.successfulMultiDeleteMessage);
    });

    it('should reset all filters', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'resetFilterAfterDelete', baseContext);

      const numberOfGroupsAfterReset = await boCustomerGroupsPage.resetAndGetNumberOfLines(page);
      expect(numberOfGroupsAfterReset).to.be.equal(numberOfGroups);
    });
  });
});
