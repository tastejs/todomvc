'use strict';
var assert = require('assert');

function TestOperations(page) {
	// unfortunately webdriver does not have a decent API for determining if an
	// element exists. The standard approach is to obtain an array of elements
	// and test that the length is zero. In this case the item is hidden if
	// it is either not in the DOM, or is in the DOM but not visible.
	function testIsHidden(elements, name) {
		if (elements.length === 1) {
			elements[0].isDisplayed().then(function (isDisplayed) {
				assert(!isDisplayed, 'the ' + name + ' element should be hidden');
			});
		}
	}

	function testIsVisible(elements, name) {
		assert.equal(elements.length, 1);
		return elements[0].isDisplayed()
			.then(function (isDisplayed) {
				assert(isDisplayed, 'the ' + name + ' element should be displayed');
			});
	}

	this.assertNewInputNotFocused = function () {
		return page.getFocussedElementIdOrClass()
			.then(function (focussedElementIdOrClass) {
				assert.equal(focussedElementIdOrClass.indexOf('new-todo'), -1);
			});
	};

	this.assertInputFocused = function () {
		return page.getFocussedTagName()
			.then(function (name) {
				assert.equal(name, 'input', 'input does not have focus');
			});
	};

	this.assertFocussedElement = function (expectedIdentifier) {
		return page.getFocussedElementIdOrClass()
			.then(function (focusedElementIdentifier) {
				var failMsg = 'The focused element did not have the expected class or id "' + expectedIdentifier + '"';
				assert.notEqual(focusedElementIdentifier.indexOf(expectedIdentifier), -1, failMsg);
			});
	};

	this.assertClearCompleteButtonIsHidden = function () {
		return page.tryGetClearCompleteButton()
			.then(function (element) {
				return testIsHidden(element, 'clear completed items button');
			}, function (_error) {
				assert(_error.code === 7, 'error accessing clear completed items button, error: ' + _error.message);
			});
	};

	this.assertClearCompleteButtonIsVisible = function () {
		return page.waitForVisibleElement(function () {
				return page.tryGetClearCompleteButton();
			})
			.then(function (clearCompleteButton) {
				assert(clearCompleteButton, 'the clear completed items button element should be displayed');
			});
	};

	this.assertItemCount = function (itemCount) {
		return page.getItemElements()
			.then(function (toDoItems) {
				assert.equal(toDoItems.length, itemCount,
					itemCount + ' items expected in the todo list, ' + toDoItems.length + ' items observed');
			});
	};

	this.assertClearCompleteButtonText = function (buttonText) {
		return page.waitForVisibleElement(function () {
				return page.tryGetClearCompleteButton();
			})
			.then(function (clearCompleteButton) {
				return clearCompleteButton.getText();
			})
			.then(function (text) {
				return assert.equal(text, buttonText);
			});
	};

	this.assertMainSectionIsHidden = function () {
		return page.tryGetMainSectionElement()
			.then(function (mainSection) {
				return testIsHidden(mainSection, 'main');
			});
	};

	this.assertFooterIsHidden = function () {
		return page.tryGetFooterElement()
			.then(function (footer) {
				return testIsHidden(footer, 'footer');
			});
	};

	this.assertMainSectionIsVisible = function () {
		return page.tryGetMainSectionElement()
			.then(function (mainSection) {
				return testIsVisible(mainSection, 'main');
			});
	};

	//TODO: fishy!
	this.assertItemToggleIsHidden = function (index) {
		return page.tryGetToggleForItemAtIndex(index)
			.then(function (toggleItem) {
				return testIsHidden(toggleItem, 'item-toggle');
			});
	};

	this.assertItemLabelIsHidden = function (index) {
		return page.tryGetItemLabelAtIndex(index)
			.then(function (toggleItem) {
				return testIsHidden(toggleItem, 'item-label');
			});
	};

	this.assertFooterIsVisible = function () {
		return page.tryGetFooterElement()
			.then(function (footer) {
				return testIsVisible(footer, 'footer');
			});
	};

	this.assertItemInputFieldText = function (text) {
		return page.getItemInputField().getText()
			.then(function (inputFieldText) {
				assert.equal(inputFieldText, text);
			});
	};

	this.assertItemText = function (itemIndex, textToAssert) {
		return page.getItemLabelAtIndex(itemIndex).getText()
			.then(function (text) {
				assert.equal(text, textToAssert,
					'A todo item with text \'' + textToAssert + '\' was expected at index ' +
					itemIndex + ', the text \'' + text + '\' was observed');
			});
	};

	// tests that the list contains the following items, independant of order
	this.assertItems = function (textArray) {
		return page.getVisibleLabelText()
			.then(function (visibleText) {
				assert.deepEqual(visibleText.sort(), textArray.sort());
			});
	};

	this.assertItemCountText = function (textToAssert) {
		return page.getItemsCountElement().getText()
			.then(function (text) {
				assert.equal(text.trim(), textToAssert, 'the item count text was incorrect');
			});
	};

	// tests for the presence of the 'completed' CSS class for the item at the given index
	this.assertItemAtIndexIsCompleted = function (index) {
		return page.getItemElements()
			.then(function (toDoItems) {
				return toDoItems[index].getAttribute('class');
			})
			.then(function (cssClass) {
				var failMsg = 'the item at index ' + index + ' should have been marked as completed';
				assert(cssClass.indexOf('completed') !== -1, failMsg);
			});
	};

	this.assertItemAtIndexIsNotCompleted = function (index) {
		return page.getItemElements()
			.then(function (toDoItems) {
				return toDoItems[index].getAttribute('class');
			})
			.then(function (cssClass) {
				// the maria implementation uses an 'incompleted' CSS class which is redundant
				// TODO: this should really be moved into the pageLaxMode
				var failMsg = 'the item at index ' + index + ' should not have been marked as completed';
				assert(cssClass.indexOf('completed') === -1 || cssClass.indexOf('incompleted') !== -1, failMsg);
			});
	};

	this.assertFilterAtIndexIsSelected = function (selectedIndex) {
		return page.findByXpath(page.getSelectedFilterXPathByIndex(selectedIndex + 1))
			.then(function (elm) {
				var failMsg = 'the filter / route at index ' + selectedIndex + ' should have been selected';
				assert.notEqual(elm, undefined, failMsg);
			});
	};

	this.assertCompleteAllIsClear = function () {
		return page.getMarkAllCompletedCheckBox()
			.then(function (markAllCompleted) {
				return markAllCompleted.isSelected();
			})
			.then(function (isSelected) {
				assert(!isSelected, 'the mark-all-completed checkbox should be clear');
			});
	};

	this.assertCompleteAllIsChecked = function () {
		return page.getMarkAllCompletedCheckBox()
			.then(function (markAllCompleted) {
				return markAllCompleted.isSelected();
			})
			.then(function (isSelected) {
				assert(isSelected, 'the mark-all-completed checkbox should be checked');
			});
	};
}

module.exports = TestOperations;
