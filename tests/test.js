'use strict';

var webdriver = require('selenium-webdriver');
var chrome = require('selenium-webdriver/chrome');
var test = require('selenium-webdriver/testing');
var Page = require('./page');
var PageLaxMode = require('./pageLaxMode');
var TestOperations = require('./testOperations');

module.exports.todoMVCTest = function (frameworkName, baseUrl, speedMode, laxMode, browserName) {
	test.describe('TodoMVC - ' + frameworkName, function () {
		var TODO_ITEM_ONE = 'buy some cheese';
		var TODO_ITEM_TWO = 'feed the cat';
		var TODO_ITEM_THREE = 'book a doctors appointment';
		var browser, testOps, page;

		// a number of tests use this set of ToDo items.
		function createStandardItems() {
			page.enterItem(TODO_ITEM_ONE);
			page.enterItem(TODO_ITEM_TWO);
			page.enterItem(TODO_ITEM_THREE);
		}

		function launchBrowser() {
			var chromeOptions = new chrome.Options();
			chromeOptions.addArguments('no-sandbox');

			if (process.env.CHROME_PATH !== undefined) {
				chromeOptions.setChromeBinaryPath(process.env.CHROME_PATH);
			}

			browser = new webdriver.Builder()
			.withCapabilities({
				browserName: browserName
			})
			.setChromeOptions(chromeOptions)
			.build();

			browser.get(baseUrl);

			page = laxMode ? new PageLaxMode(browser) : new Page(browser);
			testOps = new TestOperations(page);

			// for apps that use require, we have to wait a while for the dependencies to
			// be loaded. There must be a more elegant solution than this!
			browser.sleep(200);
		}

		function closeBrowser() {
			browser.quit();
		}

		if (speedMode) {
			test.before(function () {
				launchBrowser();
			});
			test.after(function () {
				closeBrowser();
			});
			test.beforeEach(function () {
				page.getItemElements().then(function (items) {
					if (items.length > 0) {
						// find any items that are not complete
						page.getNonCompletedItemElements().then(function (nonCompleteItems) {
							if (nonCompleteItems.length > 0) {
								page.clickMarkAllCompletedCheckBox();
							}
							page.clickClearCompleteButton();
						});
					}
				});
			});
		} else {
			test.beforeEach(function () {
				launchBrowser();
				page.ensureAppIsVisible();
			});
			test.afterEach(function () {
				(new webdriver.WebDriver.Logs(browser))
				.get('browser')
				.then(function (v) {
					if (v && v.length) {
						console.log(v);
					}
				});
				closeBrowser();
			});
		}

		test.describe('When page is initially opened', function () {
			test.it('should focus on the todo input field', function () {
				testOps.assertFocussedElementId('new-todo');
			});
		});

		test.describe('No Todos', function () {
			test.it('should hide #main and #footer', function () {
				testOps.assertItemCount(0);
				testOps.assertMainSectionIsHidden();
				testOps.assertFooterIsHidden();
			});
		});

		test.describe('New Todo', function () {
			test.it('should allow me to add todo items', function () {
				page.enterItem(TODO_ITEM_ONE);
				testOps.assertItems([TODO_ITEM_ONE]);

				page.enterItem(TODO_ITEM_TWO);
				testOps.assertItems([TODO_ITEM_ONE, TODO_ITEM_TWO]);
			});

			test.it('should clear text input field when an item is added', function () {
				page.enterItem(TODO_ITEM_ONE);
				testOps.assertItemInputFieldText('');
			});

			test.it('should append new items to the bottom of the list', function () {
				createStandardItems();
				testOps.assertItemCount(3);
				testOps.assertItemText(0, TODO_ITEM_ONE);
				testOps.assertItemText(1, TODO_ITEM_TWO);
				testOps.assertItemText(2, TODO_ITEM_THREE);
			});

			test.it('should trim text input', function () {
				page.enterItem('   ' + TODO_ITEM_ONE + '  ');
				testOps.assertItemText(0, TODO_ITEM_ONE);
			});

			test.it('should show #main and #footer when items added', function () {
				page.enterItem(TODO_ITEM_ONE);
				testOps.assertMainSectionIsVisible();
				testOps.assertFooterIsVisible();
			});
		});

		test.describe('Mark all as completed', function () {
			test.beforeEach(function () {
				createStandardItems();
			});

			test.it('should allow me to mark all items as completed', function () {
				page.clickMarkAllCompletedCheckBox();

				testOps.assertItemAtIndexIsCompleted(0);
				testOps.assertItemAtIndexIsCompleted(1);
				testOps.assertItemAtIndexIsCompleted(2);
			});

			test.it('should allow me to clear the completion state of all items', function () {
				page.clickMarkAllCompletedCheckBox();
				page.clickMarkAllCompletedCheckBox();

				testOps.assertItemAtIndexIsNotCompleted(0);
				testOps.assertItemAtIndexIsNotCompleted(1);
				testOps.assertItemAtIndexIsNotCompleted(2);
			});

			test.it('complete all checkbox should update state when items are completed / cleared', function () {
				page.clickMarkAllCompletedCheckBox();

				testOps.assertCompleteAllIsChecked();

				// all items are complete, now mark one as not-complete
				page.toggleItemAtIndex(0);
				testOps.assertCompleteAllIsClear();

				// now mark as complete, so that once again all items are completed
				page.toggleItemAtIndex(0);
				testOps.assertCompleteAllIsChecked();
			});
		});

		test.describe('Item', function () {
			test.it('should allow me to mark items as complete', function () {
				page.enterItem(TODO_ITEM_ONE);
				page.enterItem(TODO_ITEM_TWO);

				page.toggleItemAtIndex(0);
				testOps.assertItemAtIndexIsCompleted(0);
				testOps.assertItemAtIndexIsNotCompleted(1);

				page.toggleItemAtIndex(1);
				testOps.assertItemAtIndexIsCompleted(0);
				testOps.assertItemAtIndexIsCompleted(1);
			});

			test.it('should allow me to un-mark items as complete', function () {
				page.enterItem(TODO_ITEM_ONE);
				page.enterItem(TODO_ITEM_TWO);

				page.toggleItemAtIndex(0);
				testOps.assertItemAtIndexIsCompleted(0);
				testOps.assertItemAtIndexIsNotCompleted(1);

				page.toggleItemAtIndex(0);
				testOps.assertItemAtIndexIsNotCompleted(0);
				testOps.assertItemAtIndexIsNotCompleted(1);
			});
		});

		test.describe('Editing', function () {
			test.beforeEach(function () {
				createStandardItems();
				page.doubleClickItemAtIndex(1);
			});

			test.it('should hide other controls when editing', function () {
				testOps.assertItemToggleIsHidden(1);
				testOps.assertItemLabelIsHidden(1);
			});

			test.it('should save edits on enter', function () {
				page.editItemAtIndex(1, 'buy some sausages' + webdriver.Key.ENTER);

				testOps.assertItems([TODO_ITEM_ONE, 'buy some sausages', TODO_ITEM_THREE]);
			});

			test.it('should save edits on blur', function () {
				page.editItemAtIndex(1, 'buy some sausages');

				// click a toggle button so that the blur() event is fired
				page.toggleItemAtIndex(0);

				testOps.assertItems([TODO_ITEM_ONE, 'buy some sausages', TODO_ITEM_THREE]);
			});

			test.it('should trim entered text', function () {
				page.editItemAtIndex(1, '    buy some sausages  ' + webdriver.Key.ENTER);

				testOps.assertItems([TODO_ITEM_ONE, 'buy some sausages', TODO_ITEM_THREE]);
			});

			test.it('should remove the item if an empty text string was entered', function () {
				page.editItemAtIndex(1, webdriver.Key.ENTER);

				testOps.assertItems([TODO_ITEM_ONE, TODO_ITEM_THREE]);
			});

			test.it('should cancel edits on escape', function () {
				page.editItemAtIndex(1, 'foo' + webdriver.Key.ESCAPE);

				testOps.assertItems([TODO_ITEM_ONE, TODO_ITEM_TWO, TODO_ITEM_THREE]);
			});
		});

		test.describe('Counter', function () {
			test.it('should display the current number of todo items', function () {
				page.enterItem(TODO_ITEM_ONE);
				testOps.assertItemCountText('1 item left');
				page.enterItem(TODO_ITEM_TWO);
				testOps.assertItemCountText('2 items left');
			});
		});


		test.describe('Clear completed button', function () {
			test.beforeEach(function () {
				createStandardItems();
			});

			test.it('should display the correct text', function () {
				page.toggleItemAtIndex(1);
				testOps.assertClearCompleteButtonText('Clear completed');
			});

			test.it('should remove completed items when clicked', function () {
				page.toggleItemAtIndex(1);
				page.clickClearCompleteButton();
				testOps.assertItemCount(2);
				testOps.assertItems([TODO_ITEM_ONE, TODO_ITEM_THREE]);
			});

			test.it('should be hidden when there are no items that are completed', function () {
				page.toggleItemAtIndex(1);
				testOps.assertClearCompleteButtonIsVisible();
				page.clickClearCompleteButton();
				testOps.assertClearCompleteButtonIsHidden();
			});
		});

		test.describe('Persistence', function () {
			test.it('should persist its data', function () {
				// set up state
				page.enterItem(TODO_ITEM_ONE);
				page.enterItem(TODO_ITEM_TWO);
				page.toggleItemAtIndex(1);

				function stateTest() {
					testOps.assertItems([TODO_ITEM_ONE, TODO_ITEM_TWO]);
					testOps.assertItemAtIndexIsCompleted(1);
					testOps.assertItemAtIndexIsNotCompleted(0);
				}

				// test it
				stateTest();

				// navigate away and back again
				browser.get('about:blank');
				browser.get(baseUrl);

				// repeat the state test
				stateTest();
			});
		});

		test.describe('Routing', function () {
			test.beforeEach(function () {
				createStandardItems();
			});
			test.it('should allow me to display active items', function () {
				page.toggleItemAtIndex(1);
				page.filterByActiveItems();

				testOps.assertItems([TODO_ITEM_ONE, TODO_ITEM_THREE]);
			});

			test.it('should respect the back button', function () {
				page.toggleItemAtIndex(1);

				page.filterByActiveItems();
				page.filterByCompletedItems();

				// should show completed items
				testOps.assertItems([TODO_ITEM_TWO]);

				// then active items
				page.back();
				testOps.assertItems([TODO_ITEM_ONE, TODO_ITEM_THREE]);

				// then all items
				page.back();
				testOps.assertItems([TODO_ITEM_ONE, TODO_ITEM_TWO, TODO_ITEM_THREE]);
			});

			test.it('should allow me to display completed items', function () {
				page.toggleItemAtIndex(1);
				page.filterByCompletedItems();

				testOps.assertItems([TODO_ITEM_TWO]);
			});

			test.it('should allow me to display all items', function () {
				page.toggleItemAtIndex(1);

				// apply the other filters first, before returning to the 'all' state
				page.filterByActiveItems();
				page.filterByCompletedItems();
				page.filterByAllItems();

				testOps.assertItems([TODO_ITEM_ONE, TODO_ITEM_TWO, TODO_ITEM_THREE]);
			});

			test.it('should highlight the currently applied filter', function () {
				// initially 'all' should be selected
				testOps.assertFilterAtIndexIsSelected(0);

				page.filterByActiveItems();
				testOps.assertFilterAtIndexIsSelected(1);

				page.filterByCompletedItems();
				testOps.assertFilterAtIndexIsSelected(2);
			});
		});
	});
};
