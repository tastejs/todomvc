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
		elements[0].isDisplayed().then(function (isDisplayed) {
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

	this.assertFocussedElementId = function (expectedId) {
		return page.getFocussedElementIdOrClass().then(function (id) {
			assert.notEqual(id.indexOf(expectedId), -1, 'The focused element did not have the expected id ' + expectedId);
		});
	};

	this.assertClearCompleteButtonIsHidden = function () {
		page.tryGetClearCompleteButton().then(function (element) {
			testIsHidden(element, 'clear completed items button');
		}, function (_error) {
			assert(_error.code === 7, 'error accessing clear completed items button, error: ' + _error.message);
		});
	};

	this.assertClearCompleteButtonIsVisible = function () {
		page.tryGetClearCompleteButton().then(function (element) {
			testIsVisible([element], 'clear completed items button');
		});
	};

	this.assertItemCount = function (itemCount) {
		page.getItemElements().then(function (toDoItems) {
			assert.equal(toDoItems.length, itemCount,
				itemCount + ' items expected in the todo list, ' + toDoItems.length + ' items observed');
		});
	};

	this.assertClearCompleteButtonText = function (buttonText) {
		return page.tryGetClearCompleteButton()
		.getText().then(function (text) {
			assert.equal(text, buttonText);
		});
	};

	this.assertMainSectionIsHidden = function () {
		page.tryGetMainSectionElement().then(function (mainSection) {
			testIsHidden(mainSection, 'main');
		});
	};

	this.assertFooterIsHidden = function () {
		page.tryGetFooterElement().then(function (footer) {
			testIsHidden(footer, 'footer');
		});
	};

	this.assertMainSectionIsVisible = function () {
		page.tryGetMainSectionElement().then(function (mainSection) {
			testIsVisible(mainSection, 'main');
		});
	};

	//TODO: fishy!
	this.assertItemToggleIsHidden = function (index) {
		page.tryGetToggleForItemAtIndex(index).then(function (toggleItem) {
			testIsHidden(toggleItem, 'item-toggle');
		});
	};

	this.assertItemLabelIsHidden = function (index) {
		page.tryGetItemLabelAtIndex(index).then(function (toggleItem) {
			testIsHidden(toggleItem, 'item-label');
		});
	};

	this.assertFooterIsVisible = function () {
		page.tryGetFooterElement().then(function (footer) {
			testIsVisible(footer, 'footer');
		});
	};

	this.assertItemInputFieldText = function (text) {
		page.getItemInputField().getText().then(function (inputFieldText) {
			assert.equal(inputFieldText, text);
		});
	};

	this.assertItemText = function (itemIndex, textToAssert) {
		page.getItemLabelAtIndex(itemIndex).getText().then(function (text) {
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
		page.getItemsCountElement().getText().then(function (text) {
			assert.equal(text.trim(), textToAssert, 'the item count text was incorrect');
		});
	};

	// tests for the presence of the 'completed' CSS class for the item at the given index
	this.assertItemAtIndexIsCompleted = function (index) {
		page.getItemElements().then(function (toDoItems) {
			toDoItems[index].getAttribute('class').then(function (cssClass) {
				assert(cssClass.indexOf('completed') !== -1,
					'the item at index ' + index + ' should have been marked as completed');
			});
		});
	};

	this.assertItemAtIndexIsNotCompleted = function (index) {
		page.getItemElements().then(function (toDoItems) {
			toDoItems[index].getAttribute('class').then(function (cssClass) {
				// the maria implementation uses an 'incompleted' CSS class which is redundant
				// TODO: this should really be moved into the pageLaxMode
				assert(cssClass.indexOf('completed') === -1 || cssClass.indexOf('incompleted') !== -1,
					'the item at index ' + index + ' should not have been marked as completed');
			});
		});
	};

	this.assertFilterAtIndexIsSelected = function (selectedIndex) {
		page.findByXpath(page.getSelectedFilterXPathByIndex(selectedIndex + 1))
		.then(function (elm) {
			assert.notEqual(elm, undefined, 'the filter / route at index ' + selectedIndex + ' should have been selected');
		});
	};

	this.assertCompleteAllIsClear = function () {
		page.getMarkAllCompletedCheckBox().then(function (markAllCompleted) {
			markAllCompleted.isSelected().then(function (isSelected) {
				assert(!isSelected, 'the mark-all-completed checkbox should be clear');
			});
		});
	};

	this.assertCompleteAllIsChecked = function () {
		page.getMarkAllCompletedCheckBox().then(function (markAllCompleted) {
			markAllCompleted.isSelected().then(function (isSelected) {
				assert(isSelected, 'the mark-all-completed checkbox should be checked');
			});
		});
	};
}

module.exports = TestOperations;
