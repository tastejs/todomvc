'use strict';

var webdriver = require('selenium-webdriver');
var idSelectors = true;

module.exports = function Page(browser) {

	// ----------------- utility methods

	this.tryFindByXpath = function (xpath) {
		return browser.findElements(webdriver.By.xpath(xpath));
	};

	this.findByXpath = function (xpath) {
		return browser.findElement(webdriver.By.xpath(xpath));
	};

	this.getTodoListXpath = function () {
		return idSelectors ? '//ul[@id="todo-list"]' : '//ul[contains(@class, "todo-list")]';
	};

	this.getMainSectionXpath = function () {
		return idSelectors ? '//section[@id="main"]' : '//section[contains(@class, "main")]';
	};

	this.getFooterSectionXpath = function () {
		return idSelectors ? '//footer[@id="footer"]' : '//footer[contains(@class, "footer")]';
	};

	this.getCompletedButtonXpath = function () {
		return idSelectors ? '//button[@id="clear-completed"]' : '//button[contains(@class, "clear-completed")]';
	};

	this.getNewInputXpath = function () {
		return idSelectors ? '//input[@id="new-todo"]' : '//input[contains(@class,"new-todo")]';
	};

	this.getToggleAllXpath = function () {
		return idSelectors ? '//input[@id="toggle-all"]' : '//input[contains(@class,"toggle-all")]';
	};

	this.getCountXpath = function () {
		return idSelectors ? '//span[@id="todo-count"]' : '//span[contains(@class, "todo-count")]';
	};

	this.getFiltersElementXpath = function () {
		return idSelectors ? '//*[@id="filters"]' : '//*[contains(@class, "filters")]';
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
	this.getActiveElement = function () {
		return browser.switchTo().activeElement();
	};

	this.getFocussedTagName = function () {
		return this.getActiveElement().getTagName();
	};

	this.getFocussedElementIdOrClass = function () {
		return this.getActiveElement()
			.getAttribute(idSelectors ? 'id' : 'class');
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
		return this.getVisibileLabelIndicies()
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

	this.waitForVisibleElement = function (getElementFn, timeout) {
		var foundVisibleElement;
		timeout = timeout || 500;

		return browser.wait(function () {
			foundVisibleElement = getElementFn();
			return foundVisibleElement.isDisplayed();
		}, timeout)
		.then(function () {
			return foundVisibleElement;
		})
		.thenCatch(function (err) {
			return false;
		});
	}

	this.getVisibileLabelIndicies = function () {
		var self = this;
		return this.getItemLabels()
		.then(function (elms) {
			return elms.map(function (elm, i) {
				return i;
			});
		})
		.then(function (elms) {
			return webdriver.promise.filter(elms, function (elmIndex) {
				return self.waitForVisibleElement(function () {
					return self.tryGetItemLabelAtIndex(elmIndex);
				});
			});
		});
	};

	// ----------------- page actions
	this.ensureAppIsVisible = function () {
		var self = this;
		return browser.wait(function () {
			// try to find main element by ID
			return browser.isElementPresent(webdriver.By.css('.new-todo'))
				.then(function (foundByClass) {
					if (foundByClass) {
						idSelectors = false;
						return true;
					}

					// try to find main element by CSS class
					return browser.isElementPresent(webdriver.By.css('#new-todo'));
				});
		}, 5000)
		.then(function (hasFoundNewTodoElement) {
			if (!hasFoundNewTodoElement) {
				throw new Error('Unable to find application, did you start your local server?');
			}
		});
	};

	this.clickMarkAllCompletedCheckBox = function () {
		return this.getMarkAllCompletedCheckBox().then(function (checkbox) {
			return checkbox.click();
		});
	};

	this.clickClearCompleteButton = function () {
		var self = this;

		return self.waitForVisibleElement(function () {
			return self.tryGetClearCompleteButton();
		})
		.then(function (clearCompleteButton) {
			return clearCompleteButton.click();
		});
	};

	this.enterItem = function (itemText) {
		var self = this;

		return browser.wait(function () {
			var textField;

			return self.getItemInputField().then(function (itemInputField) {
				textField = itemInputField;
				return textField.sendKeys(itemText, webdriver.Key.ENTER);
			})
			.then(function () { return self.getVisibleLabelText(); })
			.then(function (labels) {
				if (labels.indexOf(itemText.trim()) >= 0) {
					return true;
				}

				return textField.clear().then(function () {
					return false;
				});
			});
		}, 5000);
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
