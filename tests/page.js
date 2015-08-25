'use strict';

var webdriver = require('selenium-webdriver');
var idSelectors = false;

module.exports = function Page(browser) {

	// ----------------- utility methods

	this.tryFindByXpath = function (xpath) {
		return browser.findElements(webdriver.By.xpath(xpath));
	};

	this.findByXpath = function (xpath) {
		return browser.findElement(webdriver.By.xpath(xpath));
	};

	this.getTodoListXpath = function () {
		return !idSelectors ? '//ul[@id="todo-list"]' : '//ul[@class="todo-list"]';
	};

	this.getMainSectionXpath = function () {
		return !idSelectors ? '//section[@id="main"]' : '//section[contains(@class, "main")]';
	};

	this.getFooterSectionXpath = function () {
		return !idSelectors ? '//footer[@id="footer"]' : '//footer[contains(@class, "footer")]';
	};

	this.getCompletedButtonXpath = function () {
		return !idSelectors ? '//button[@id="clear-completed"]' : '//button[contains(@class, "clear-completed")]';
	};

	this.getNewInputXpath = function () {
		return !idSelectors ? '//input[@id="new-todo"]' : '//input[contains(@class,"new-todo")]';
	};

	this.getToggleAllXpath = function () {
		return !idSelectors ? '//input[@id="toggle-all"]' : '//input[contains(@class,"toggle-all")]';
	};

	this.getCountXpath = function () {
		return !idSelectors ? '//span[@id="todo-count"]' : '//span[contains(@class, "todo-count")]';
	};

	this.getFiltersElementXpath = function () {
		return !idSelectors ? '//*[@id="filters"]' : '//*[contains(@class, "filters")]';
	};

	this.getFilterXpathByIndex = function (index) {
		return this.getFiltersElementXpath() + '/li[' + index + ']/a';
	};

	this.getSelectedFilterXPathByIndex = function (index) {
		return this.getFilterXpathByIndex(index) + '[contains(@class, "selected")]';
	};

	this.getFilterAllXpath = function () {
		return this.getFilterXpathByIndex(1);
	};

	this.getFilterActiveXpath = function () {
		return this.getFilterXpathByIndex(2);
	};

	this.getFilterCompletedXpath = function () {
		return this.getFilterXpathByIndex(3);
	};

	this.xPathForItemAtIndex = function (index) {
		// why is XPath the only language silly enough to be 1-indexed?
		return this.getTodoListXpath() + '/li[' + (index + 1) + ']';
	};

	// ----------------- navigation methods

	this.back = function () {
		return browser.navigate().back();
	};

	// ----------------- try / get methods

	// unfortunately webdriver does not have a decent API for determining if an
	// element exists. The standard approach is to obtain an array of elements
	// and test that the length is zero. These methods are used to obtain
	// elements which *might* be present in the DOM, hence the try/get name.

	this.tryGetMainSectionElement = function () {
		return this.tryFindByXpath(this.getMainSectionXpath());
	};

	this.tryGetFooterElement = function () {
		return this.tryFindByXpath(this.getFooterSectionXpath());
	};

	this.tryGetClearCompleteButton = function () {
		return this.findByXpath(this.getCompletedButtonXpath());
	};

	this.tryGetToggleForItemAtIndex = function (index) {
		var xpath = this.xPathForItemAtIndex(index) + '//input[contains(@class,"toggle")]';
		return this.findByXpath(xpath);
	};

	this.tryGetItemLabelAtIndex = function (index) {
		return this.findByXpath(this.xPathForItemAtIndex(index) + '//label');
	};

	// ----------------- DOM element access methods

	this.getFocussedElementId = function () {
		return browser.switchTo().activeElement().getAttribute(!idSelectors ? 'id' : 'class');
	};

	this.getEditInputForItemAtIndex = function (index) {
		var xpath = this.xPathForItemAtIndex(index) + '//input[contains(@class,"edit")]';
		return this.findByXpath(xpath);
	};

	this.getItemInputField = function () {
		return this.findByXpath(this.getNewInputXpath());
	};

	this.getMarkAllCompletedCheckBox = function () {
		return this.findByXpath(this.getToggleAllXpath());
	};

	this.getItemElements = function () {
		return this.tryFindByXpath(this.getTodoListXpath() + '/li');
	};

	this.getNonCompletedItemElements = function () {
		return this.tryFindByXpath(this.getTodoListXpath() + '/li[not(contains(@class,"completed"))]');
	};

	this.getItemsCountElement = function () {
		return this.findByXpath(this.getCountXpath());
	};

	this.getItemLabelAtIndex = function (index) {
		return this.findByXpath(this.xPathForItemAtIndex(index) + '//label');
	};

	this.getItemLabels = function () {
		var xpath = this.getTodoListXpath() + '/li//label';
		return this.tryFindByXpath(xpath);
	};

	this.getVisibleLabelText = function () {
		var self = this;
		return this.getVisibleItemLabels()
		.then(function (indicies) {
			return webdriver.promise.map(indicies, function (elmIndex) {
				var ret;
				return browser.wait(function () {
					return self.tryGetItemLabelAtIndex(elmIndex).getText()
					.then(function (v) {
						ret = v;
						return true;
					})
					.thenCatch(function () { return false; });
				}, 5000)
				.then(function () {
					return ret;
				});
			});
		});
	};

	this.getVisibleItemLabels = function () {
		var self = this;
		var ret;
		return this.getItemLabels()
		.then(function (elms) {
			return elms.map(function (elm, i) {
				return i;
			});
		})
		.then(function (elms) {
			return webdriver.promise.filter(elms, function (elmIndex) {
				return browser.wait(function () {
					return self.tryGetItemLabelAtIndex(elmIndex).isDisplayed()
					.then(function (v) {
						ret = v;
						return true;
					})
					.thenCatch(function () {
						return false;
					});
				}, 5000)
				.then(function () {
					return ret;
				});
			});
		});
	};

	// ----------------- page actions
	this.ensureAppIsVisible = function () {
		return browser.findElements(webdriver.By.css('#todoapp'))
		.then(function (elms) {
			if (elms.length > 0) {
				return true;
			} else {
				return browser.findElements(webdriver.By.css('.todoapp'));
			}
		})
		.then(function (elms) {
			if (elms === true) {
				return true;
			}

			if (elms.length) {
				idSelectors = true;
				return true;
			}

			throw new Error('Unable to find application root, did you start your local server?');
		});
	};

	this.clickMarkAllCompletedCheckBox = function () {
		return this.getMarkAllCompletedCheckBox().then(function (checkbox) {
			checkbox.click();
		});
	};

	this.clickClearCompleteButton = function () {
		return this.tryGetClearCompleteButton().click();
	};

	this.enterItem = function (itemText) {
		var textField = this.getItemInputField();
		textField.sendKeys(itemText);
		textField.sendKeys(webdriver.Key.ENTER);
	};

	this.toggleItemAtIndex = function (index) {
		return this.tryGetToggleForItemAtIndex(index).click();
	};

	this.editItemAtIndex = function (index, itemText) {
		return this.getEditInputForItemAtIndex(index)
		.then(function (itemEditField) {
			// send 50 delete keypresses, just to be sure the item text is deleted
			var deleteKeyPresses = '';
			for (var i = 0; i < 50; i++) {
				deleteKeyPresses += webdriver.Key.BACK_SPACE;
				deleteKeyPresses += webdriver.Key.DELETE;
			}

			itemEditField.sendKeys(deleteKeyPresses);

			// update the item with the new text.
			itemEditField.sendKeys(itemText);
		});
	};

	this.doubleClickItemAtIndex = function (index) {
		return this.getItemLabelAtIndex(index).then(function (itemLabel) {
			// double click is not 'natively' supported, so we need to send the
			// event direct to the element see:
			// jscs:disable
			// http://stackoverflow.com/questions/3982442/selenium-2-webdriver-how-to-double-click-a-table-row-which-opens-a-new-window
			// jscs:enable
			browser.executeScript('var evt = document.createEvent("MouseEvents");' +
				'evt.initMouseEvent("dblclick",true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0,null);' +
				'arguments[0].dispatchEvent(evt);', itemLabel);
		});
	};

	this.filterBy = function (selectorFn) {
		var self = this;

		return browser.wait(function () {
			return self.findByXpath(selectorFn()).click()
			.then(function () {
				return self.findByXpath(selectorFn()).getAttribute('class');
			})
			.then(function (klass) {
				return klass.indexOf('selected') !== -1;
			});
		}, 5000);
	};

	this.filterByActiveItems = function () {
		return this.filterBy(this.getFilterActiveXpath.bind(this));
	};

	this.filterByCompletedItems = function () {
		return this.filterBy(this.getFilterCompletedXpath.bind(this));
	};

	this.filterByAllItems = function () {
		return this.filterBy(this.getFilterAllXpath.bind(this));
	};
};
