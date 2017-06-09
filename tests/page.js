'use strict';

var webdriver = require('selenium-webdriver');
var until = require('selenium-webdriver/lib/until');

var idSelectors = true;
var classOrId = idSelectors ? '#' : '.';

var DEFAULT_TIMEOUT = 3000;
var REMOVED_TIMEOUT = 100;

var REMOVE_TEXT_KEY_SEQ = Array(51).join(webdriver.Key.BACK_SPACE + webdriver.Key.DELETE);

// Unique symbols
var ELEMENT_MISSING = Object.freeze({});
var ITEM_HIDDEN_OR_REMOVED = Object.freeze({});

module.exports = function Page(browser) {
	// CSS ELEMENT SELECTORS

	this.getMainSectionCss = function () { return classOrId + 'main'; };

	this.getFooterSectionCss = function () { return 'footer' + classOrId + 'footer'; };

	this.getClearCompletedButtonCss = function () { return 'button' + classOrId + 'clear-completed'; };

	this.getNewInputCss = function () { return 'input' + classOrId + 'new-todo'; };

	this.getToggleAllCss = function () { return 'input' + classOrId + 'toggle-all'; };

	this.getItemCountCss = function () { return 'span' + classOrId + 'todo-count'; };

	this.getFilterCss = function (index) {
		return classOrId + 'filters li:nth-of-type(' + (index + 1) + ') a, ' +
			classOrId + 'filters a:nth-of-type(' + (index + 1) + ')';
	};

	this.getSelectedFilterCss = function (index) { return this.getFilterCss(index) + '.selected'; };

	this.getFilterAllCss = function () { return this.getFilterCss(0); };

	this.getFilterActiveCss = function () { return this.getFilterCss(1); };

	this.getFilterCompletedCss = function () { return this.getFilterCss(2); };

	this.getListCss = function (suffixCss) { return 'ul' + classOrId + 'todo-list' + (suffixCss || ''); };

	this.getListItemCss = function (index, suffixCss, excludeParentSelector) {
		suffixCss = (index === undefined ? '' : ':nth-of-type(' + (index + 1) + ')') + (suffixCss || '');
		return excludeParentSelector ? 'li' + suffixCss : this.getListCss(' li' + suffixCss);
	};

	this.getListItemToggleCss = function (index) { return this.getListItemCss(index, ' input.toggle'); };

	this.getListItemLabelCss = function (index) { return this.getListItemCss(index, ' label'); };

	this.getLastListItemLabelCss = function (index) { return this.getListItemCss(index, ':last-of-type label'); };

	this.getListItemInputCss = function (index) { return this.getListItemCss(index, ' input.edit'); };

	this.getEditingListItemInputCss = function () { return this.getListItemCss(undefined, '.editing input.edit'); };

	// This CSS selector returns the _last_ element of a list that exactly matches the provided list of completed states
	// It is used as a boolean test of the item states
	this.getListItemsWithCompletedStatesCss = function (completedStates) {
		var suffixCss = ' ' + completedStates.map(function (completed, i) {
			return this.getListItemCss(i, completed ? '.completed' : ':not(.completed)', true);
		}, this).join(' + ');
		return this.getListCss(suffixCss);
	};

	// PUBLIC SYMBOLS

	this.ITEM_HIDDEN_OR_REMOVED = ITEM_HIDDEN_OR_REMOVED;

	// NAVIGATION

	this.back = function () {
		return browser.navigate().back();
	};

	// ELEMENT RETREIVAL
	// wait* methods guarantees to return an element, or throw an exception
	// get* methods may return nothing at all, or in the case of element lists, an older version of the list

	this.getElements = function (css) {
		return browser.findElements(webdriver.By.css(css));
	};

	this.waitForElement = function (css, failMsg, timeout) {
		return browser.wait(until.elementLocated(webdriver.By.css(css)), timeout || DEFAULT_TIMEOUT, failMsg);
	};

	this.waitForFocusedElement = function (css, failMsg) {
		return this.waitForElement(css + ':focus', failMsg);
	};

	this.waitForBlurredElement = function (css, failMsg) {
		return this.waitForElement(css + ':not(:focus)', failMsg);
	};

	this.waitForListItemCount = function (count) {
		var self = this;
		return browser.wait(function () {
			return self.waitForElement(self.getListCss())
				.then(function (listElement) {
					return listElement.findElements(webdriver.By.css(self.getListItemCss(undefined, undefined, true)));
				})
				.then(function (listItems) {
					return listItems.length === count;
				});
		}, DEFAULT_TIMEOUT, 'Expected item list to contain ' + count + ' item' + (count === 1 ? '' : 's'));
	};

	this.waitForClearCompleteButton = function () {
		return this.waitForElement(this.getClearCompletedButtonCss());
	};

	this.waitForToggleForItem = function (index) {
		return this.waitForElement(this.getListItemToggleCss(index));
	};

	this.waitForItemLabel = function (index) {
		return this.waitForElement(this.getListItemLabelCss(index));
	};

	this.waitForNewItemInputField = function () {
		return this.waitForElement(this.getNewInputCss());
	};

	this.waitForMarkAllCompletedCheckBox = function () {
		return this.waitForElement(this.getToggleAllCss());
	};

	this.getListItems = function () {
		return this.getElements(this.getListItemCss());
	};

	this.waitForVisibility = function (shouldBeVisible, css, failMsg) {
		if (shouldBeVisible) {
			return this.waitForElement(css, failMsg)
				.then(function (element) {
					return browser.wait(until.elementIsVisible(element), DEFAULT_TIMEOUT, failMsg);
				});
		} else {
			return this.waitForElement(css, undefined, REMOVED_TIMEOUT)
				.catch(function () { return ELEMENT_MISSING; })
				.then(function (elementOrError) {
					return elementOrError === ELEMENT_MISSING ?
							ELEMENT_MISSING : // Returning a value will resolve the promise
							browser.wait(until.elementIsNotVisible(elementOrError), DEFAULT_TIMEOUT, failMsg);
				});
		}
	};

	this.waitForMainSectionRemovedOrEmpty = function () {
		return this.waitForElement(this.getMainSectionCss(), undefined, REMOVED_TIMEOUT)
			.catch(function () { return ELEMENT_MISSING; })
			.then(function (elementOrError) {
				return elementOrError === ELEMENT_MISSING ? ELEMENT_MISSING : this.waitForListItemCount(0);
			}.bind(this));
	};

	this.waitForCheckedStatus = function (shouldBeChecked, failMsg, element) {
		var condition = shouldBeChecked ? 'elementIsSelected' : 'elementIsNotSelected';
		return browser.wait(until[condition](element), DEFAULT_TIMEOUT, failMsg);
	};

	this.waitForTextContent = function (text, failMsg, element) {
		return browser.wait(until.elementTextIs(element, text), DEFAULT_TIMEOUT, failMsg);
	};

	// PAGE ACTIONS

	this.ensureAppIsVisibleAndLoaded = function () {
		return this.waitForVisibility(false, this.getFooterSectionCss(), 'Footer is not hidden')
			.then(this.waitForElement.bind(
				this, '.new-todo, #new-todo', 'Could not find new todo input field', undefined))
			.then(function (newTodoElement) {
				return newTodoElement.getAttribute('id');
			})
			.then(function (newTodoElementId) {
				if (newTodoElementId === 'new-todo') { return; }
				idSelectors = false;
				classOrId = idSelectors ? '#' : '.';
			});
	};

	this.clickMarkAllCompletedCheckBox = function () {
		return this.waitForMarkAllCompletedCheckBox().click();
	};

	this.clickClearCompleteButton = function () {
		return this.waitForVisibility(true, this.getClearCompletedButtonCss(),
			'Expected clear completed items button to be visible')
			.then(function (clearCompleteButton) {
				clearCompleteButton.click();
			});
	};

	this.enterItem = function (itemText) {
		var self = this;
		var nItems;
		return self.getListItems()
			.then(function (items) {
				nItems = items.length;
			})
			.then(this.waitForNewItemInputField.bind(this))
			.then(function (newItemInput) {
				return newItemInput.sendKeys(itemText).then(function () { return newItemInput; });
			})
			.then(function (newItemInput) {
				return browser.wait(function () {
					// Hit Enter repeatedly until the text goes away
					return newItemInput.sendKeys(webdriver.Key.ENTER)
						.then(newItemInput.getAttribute.bind(newItemInput, 'value'))
						.then(function (newItemInputValue) {
							return newItemInputValue.length === 0;
						});
				}, DEFAULT_TIMEOUT);
			})
			.then(function () {
				return self.waitForElement(self.getLastListItemLabelCss(nItems));
			})
			.then(this.waitForTextContent.bind(this, itemText.trim(),
				'Expected new item label to read ' + itemText.trim()));
	};

	this.toggleItemAtIndex = function (index) {
		return this.waitForToggleForItem(index).click();
	};

	this.editItemAtIndex = function (index, itemText) {
		return this.waitForElement(this.getListItemInputCss(index))
			.then(function (itemEditField) {
				return itemEditField.sendKeys(REMOVE_TEXT_KEY_SEQ, itemText);
			});
	};

	this.doubleClickItemAtIndex = function (index) {
		return this.waitForItemLabel(index).then(function (itemLabel) {
			// double click is not 'natively' supported, so we need to send the event direct to the element, see:
			// jscs:disable
			// http://stackoverflow.com/questions/3982442/selenium-2-webdriver-how-to-double-click-a-table-row-which-opens-a-new-window
			// jscs:enable
			return browser.executeScript('var evt = document.createEvent("MouseEvents");' +
				'evt.initMouseEvent("dblclick",true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0,null);' +
				'arguments[0].dispatchEvent(evt);', itemLabel);
		});
	};

	this.filterBy = function (filterCss) {
		return this.waitForElement(filterCss)
			.click()
			.then(this.waitForElement.bind(this, filterCss + '.selected', undefined, undefined));
	};

	this.filterByActiveItems = function () {
		return this.filterBy(this.getFilterActiveCss());
	};

	this.filterByCompletedItems = function () {
		return this.filterBy(this.getFilterCompletedCss());
	};

	this.filterByAllItems = function () {
		return this.filterBy(this.getFilterAllCss());
	};
};
