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
		function createStandardItems(done) {
			return page.enterItem(TODO_ITEM_ONE)
				.then(function () { return page.enterItem(TODO_ITEM_TWO); })
				.then(function () { return page.enterItem(TODO_ITEM_THREE); })
				.then(function () {
					if (done instanceof Function) {
						done();
					};
				});
		}

		function launchBrowser(done) {
			var chromeOptions = new chrome.Options();
			chromeOptions.addArguments('no-sandbox');

			if (process.env.CHROME_PATH !== undefined) {
				chromeOptions.setChromeBinaryPath(process.env.CHROME_PATH);
			}

			browser = new webdriver.Builder()
				.withCapabilities({browserName: browserName})
				.setChromeOptions(chromeOptions)
				.build();

			return browser.get(baseUrl)
				.then(function () {
					page = laxMode ? new PageLaxMode(browser) : new Page(browser);
					testOps = new TestOperations(page);
				})
				.then(function () {
					return page.ensureAppIsVisible();
				})
				.then(function () {
					if (done instanceof Function) {
						done();
					};
				});
		}

		function printCapturedLogs() {
			var logs = new webdriver.WebDriver.Logs(browser);

			return logs.get('browser')
				.then(function (entries) {
					if (entries && entries.length) {
						console.log(entries);
					}
				});
		}

		function closeBrowser(done) {
			return browser
				.quit()
				.then(function () {
					if (done instanceof Function) {
						done();
					};
				});
		}

		if (speedMode) {
			test.before(launchBrowser);
			test.after(closeBrowser);
			test.beforeEach(function (done) {
				return page.getItemElements()
					.then(function (items) {
						if (items.length == 0) { return; }

						// find any items that are not complete
						return page.getNonCompletedItemElements()
							.then(function (nonCompleteItems) {
								if (nonCompleteItems.length > 0) {
									return page.clickMarkAllCompletedCheckBox();
								}
							})
							.then(function () {
								return page.clickClearCompleteButton();
							});
					})
					.then(function () { done(); });
			});
		} else {
			test.beforeEach(launchBrowser);
			test.afterEach(function (done) {
				printCapturedLogs()
					.then(function () {
						return closeBrowser(done);
					})
			});
		}

		test.describe('When page is initially opened', function () {
			test.it('should focus on the todo input field', function (done) {
				testOps.assertFocussedElement('new-todo')
					.then(function () { done(); });
			});
		});

		test.describe('No Todos', function () {
			test.it('should hide #main and #footer', function (done) {
				testOps.assertItemCount(0)
					.then(function () { return testOps.assertMainSectionIsHidden(); })
					.then(function () { return testOps.assertFooterIsHidden(); })
					.then(function () { done(); });
			});
		});

		test.describe('New Todo', function () {
			test.it('should allow me to add todo items', function (done) {
				page.enterItem(TODO_ITEM_ONE)
					.then(function () { return testOps.assertItems([TODO_ITEM_ONE]); })
					.then(function () { return page.enterItem(TODO_ITEM_TWO); })
					.then(function () { return testOps.assertItems([TODO_ITEM_ONE, TODO_ITEM_TWO]); })
					.then(function () { done(); });
			});

			test.it('should clear text input field when an item is added', function (done) {
				page.enterItem(TODO_ITEM_ONE)
					.then(function () { return testOps.assertItemInputFieldText(''); })
					.then(function () { done(); });
			});

			test.it('should append new items to the bottom of the list', function (done) {
				createStandardItems()
					.then(function () { return testOps.assertItemCount(3); })
					.then(function () { return testOps.assertItemText(0, TODO_ITEM_ONE); })
					.then(function () { return testOps.assertItemText(1, TODO_ITEM_TWO); })
					.then(function () { return testOps.assertItemText(2, TODO_ITEM_THREE); })
					.then(function () { done(); });
			});

			test.it('should trim text input', function (done) {
				page.enterItem('   ' + TODO_ITEM_ONE + '  ')
					.then(function () { return testOps.assertItemText(0, TODO_ITEM_ONE); })
					.then(function () { done(); });
			});

			test.it('should show #main and #footer when items added', function (done) {
				page.enterItem(TODO_ITEM_ONE)
					.then(function () { return testOps.assertMainSectionIsVisible(); })
					.then(function () { return testOps.assertFooterIsVisible(); })
					.then(function () { done(); });
			});
		});

		test.describe('Mark all as completed', function () {
			test.beforeEach(createStandardItems);

			test.it('should allow me to mark all items as completed', function (done) {
				page.clickMarkAllCompletedCheckBox()
					.then(function () { return testOps.assertItemAtIndexIsCompleted(0); })
					.then(function () { return testOps.assertItemAtIndexIsCompleted(1); })
					.then(function () { return testOps.assertItemAtIndexIsCompleted(2); })
					.then(function () { done(); });
			});

			test.it('should correctly update the complete all checked state', function (done) {
				// manually check all items
				page.toggleItemAtIndex(0)
					.then(function () { return page.toggleItemAtIndex(1); })
					.then(function () { return page.toggleItemAtIndex(2); })
					// ensure checkall is in the correct state
					.then(function () { return testOps.assertCompleteAllIsChecked(); })
					.then(function () { done(); });
			});

			test.it('should allow me to clear the completion state of all items', function (done) {
				page.clickMarkAllCompletedCheckBox()
					.then(function () { return page.clickMarkAllCompletedCheckBox(); })

					.then(function () { return testOps.assertItemAtIndexIsNotCompleted(0); })
					.then(function () { return testOps.assertItemAtIndexIsNotCompleted(1); })
					.then(function () { return testOps.assertItemAtIndexIsNotCompleted(2); })
					.then(function () { done(); });
			});

			test.it('complete all checkbox should update state when items are completed / cleared', function (done) {
				page.clickMarkAllCompletedCheckBox()
					.then(function () { return testOps.assertCompleteAllIsChecked(); })
					// all items are complete, now mark one as not-complete
					.then(function () { return page.toggleItemAtIndex(0); })
					.then(function () { return testOps.assertCompleteAllIsClear(); })
					// now mark as complete, so that once again all items are completed
					.then(function () { return page.toggleItemAtIndex(0); })
					.then(function () { return testOps.assertCompleteAllIsChecked(); })
					.then(function () { done(); });
			});
		});

		test.describe('Item', function () {
			test.it('should allow me to mark items as complete', function (done) {
				page.enterItem(TODO_ITEM_ONE)
					.then(function () { return page.enterItem(TODO_ITEM_TWO); })

					.then(function () { return page.toggleItemAtIndex(0); })
					.then(function () { return testOps.assertItemAtIndexIsCompleted(0); })
					.then(function () { return testOps.assertItemAtIndexIsNotCompleted(1); })

					.then(function () { return page.toggleItemAtIndex(1); })
					.then(function () { return testOps.assertItemAtIndexIsCompleted(0); })
					.then(function () { return testOps.assertItemAtIndexIsCompleted(1); })
					.then(function () { done(); });
			});

			test.it('should allow me to un-mark items as complete', function (done) {
				page.enterItem(TODO_ITEM_ONE)
					.then(function () { return page.enterItem(TODO_ITEM_TWO); })

					.then(function () { return page.toggleItemAtIndex(0); })
					.then(function () { return testOps.assertItemAtIndexIsCompleted(0); })
					.then(function () { return testOps.assertItemAtIndexIsNotCompleted(1); })

					.then(function () { return page.toggleItemAtIndex(0); })
					.then(function () { return testOps.assertItemAtIndexIsNotCompleted(0); })
					.then(function () { return testOps.assertItemAtIndexIsNotCompleted(1); })
					.then(function () { done(); });
			});
		});

		test.describe('Editing', function (done) {
			test.beforeEach(function (done) {
				createStandardItems()
					.then(function () { return page.doubleClickItemAtIndex(1); })
					.then(function () { done(); });
			});

			test.it('should focus the input', function (done) {
				testOps.assertInputFocused()
					.then(function () { return testOps.assertNewInputNotFocused(); })
					.then(function () { done(); });
			});

			test.it('should hide other controls when editing', function (done) {
				testOps.assertItemToggleIsHidden(1)
					.then(function () { return testOps.assertItemLabelIsHidden(1); })
					.then(function () { done(); });
			});

			test.it('should save edits on enter', function (done) {
				page.editItemAtIndex(1, 'buy some sausages' + webdriver.Key.ENTER)
					.then(function () { return testOps.assertItems([TODO_ITEM_ONE, 'buy some sausages', TODO_ITEM_THREE]); })
					.then(function () { done(); });
			});

			test.it('should save edits on blur', function (done) {
				page.editItemAtIndex(1, 'buy some sausages')
					// click a toggle button so that the blur() event is fired
					.then(function () { return page.toggleItemAtIndex(0); })
					.then(function () { return testOps.assertItems([TODO_ITEM_ONE, 'buy some sausages', TODO_ITEM_THREE]); })
					.then(function () { done(); });
			});

			test.it('should trim entered text', function (done) {
				page.editItemAtIndex(1, '    buy some sausages  ' + webdriver.Key.ENTER)
					.then(function () { return testOps.assertItems([TODO_ITEM_ONE, 'buy some sausages', TODO_ITEM_THREE]); })
					.then(function () { done(); });
			});

			test.it('should remove the item if an empty text string was entered', function (done) {
				page.editItemAtIndex(1, webdriver.Key.ENTER)
					.then(function () { return testOps.assertItems([TODO_ITEM_ONE, TODO_ITEM_THREE]); })
					.then(function () { done(); });
			});

			test.it('should cancel edits on escape', function (done) {
				page.editItemAtIndex(1, 'foo' + webdriver.Key.ESCAPE)
					.then(function () { return testOps.assertItems([TODO_ITEM_ONE, TODO_ITEM_TWO, TODO_ITEM_THREE]); })
					.then(function () { done(); });
			});
		});

		test.describe('Counter', function () {
			test.it('should display the current number of todo items', function (done) {
				page.enterItem(TODO_ITEM_ONE)
					.then(function () { return testOps.assertItemCountText('1 item left'); })
					.then(function () { return page.enterItem(TODO_ITEM_TWO); })
					.then(function () { return testOps.assertItemCountText('2 items left'); })
					.then(function () { done(); });
			});
		});

		test.describe('Clear completed button', function () {
			test.beforeEach(createStandardItems);

			test.it('should display the correct text', function (done) {
				page.toggleItemAtIndex(1)
					.then(function () { return testOps.assertClearCompleteButtonText('Clear completed'); })
					.then(function () { done(); });
			});

			test.it('should remove completed items when clicked', function (done) {
				page.toggleItemAtIndex(1)
					.then(function () { return page.clickClearCompleteButton(); })
					.then(function () { return testOps.assertItemCount(2); })
					.then(function () { return testOps.assertItems([TODO_ITEM_ONE, TODO_ITEM_THREE]); })
					.then(function () { done(); });
			});

			test.it('should be hidden when there are no items that are completed', function (done) {
				page.toggleItemAtIndex(1)
					.then(function () { return testOps.assertClearCompleteButtonIsVisible(); })
					.then(function () { return page.clickClearCompleteButton(); })
					.then(function () { return testOps.assertClearCompleteButtonIsHidden(); })
					.then(function () { done(); });
			});
		});

		test.describe('Persistence', function () {
			test.it('should persist its data', function (done) {
				function stateTest() {
					// wait until things are visible
					return browser.wait(function () {
							return page.getVisibleLabelText().then(function (labels) {
								return labels.length > 0;
							});
						}, 5000)
						.then(function () { return testOps.assertItems([TODO_ITEM_ONE, TODO_ITEM_TWO]); })
						.then(function () { return testOps.assertItemAtIndexIsCompleted(1); })
						.then(function () { return testOps.assertItemAtIndexIsNotCompleted(0); });
				}

				// set up state
				page.enterItem(TODO_ITEM_ONE)
					.then(function () { return page.enterItem(TODO_ITEM_TWO); })
					.then(function () { return page.toggleItemAtIndex(1); })
					.then(function () { return stateTest(); })

					// navigate away and back again
					.then(function () { return browser.get('about:blank'); })
					.then(function () { return browser.get(baseUrl); })

					// repeat the state test
					.then(function () { return stateTest(); })
					.then(function () { done(); });
			});
		});

		test.describe('Routing', function () {
			test.beforeEach(createStandardItems);

			test.it('should allow me to display active items', function (done) {
				page.toggleItemAtIndex(1)
					.then(function () { return page.filterByActiveItems(); })
					.then(function () { return testOps.assertItems([TODO_ITEM_ONE, TODO_ITEM_THREE]); })
					.then(function () { return done(); });
			});

			test.it('should respect the back button', function (done) {
				page.toggleItemAtIndex(1)
					.then(function () { return page.filterByActiveItems(); })
					.then(function () { return page.filterByCompletedItems(); })
					.then(function () { return testOps.assertItems([TODO_ITEM_TWO]); }) // should show completed items
					.then(function () { return page.back(); }) // then active items
					.then(function () { return testOps.assertItems([TODO_ITEM_ONE, TODO_ITEM_THREE]); })
					.then(function () { return page.back(); }) // then all items
					.then(function () { return testOps.assertItems([TODO_ITEM_ONE, TODO_ITEM_TWO, TODO_ITEM_THREE]); })
					.then(function () { done(); });
			});

			test.it('should allow me to display completed items', function (done) {
				page.toggleItemAtIndex(1)
					.then(function () { return page.filterByCompletedItems(); })
					.then(function () { return testOps.assertItems([TODO_ITEM_TWO]); })
					.then(function () { return page.filterByAllItems(); }) // TODO: why?
					.then(function () { done(); });
			});

			test.it('should allow me to display all items', function (done) {
				page.toggleItemAtIndex(1)
					// apply the other filters first, before returning to the 'all' state
					.then(function () { return page.filterByActiveItems(); })
					.then(function () { return page.filterByCompletedItems(); })
					.then(function () { return page.filterByAllItems(); })
					.then(function () { return testOps.assertItems([TODO_ITEM_ONE, TODO_ITEM_TWO, TODO_ITEM_THREE]); })
					.then(function () { done(); });
			});

			test.it('should highlight the currently applied filter', function (done) {
				// initially 'all' should be selected
				testOps.assertFilterAtIndexIsSelected(0)
					.then(function () { return page.filterByActiveItems(); })
					.then(function () { return testOps.assertFilterAtIndexIsSelected(1); })
					.then(function () { return page.filterByCompletedItems(); })
					.then(function () { return testOps.assertFilterAtIndexIsSelected(2); })
					.then(function () { done(); });
			});
		});
	});
};
