'use strict';
var assert = require('assert');
var Q = require('q');

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
		assert.equal(1, elements.length);
		elements[0].isDisplayed().then(function (isDisplayed) {
			assert(isDisplayed, 'the ' + name + ' element should be displayed');
		});
	}

	this.assertFocussedElementId = function(expectedId) {
		page.getFocussedElementId().then(function(id) {
			assert.equal(id, expectedId, 'The focused element did not have the expected id ' + expectedId);
		});
	};

	this.assertClearCompleteButtonIsHidden = function () {
		page.tryGetClearCompleteButton().then(function (element) {
			testIsHidden(element, 'clear completed items button');
		});
	};

	this.assertClearCompleteButtonIsVisible = function () {
		page.tryGetClearCompleteButton().then(function (element) {
			testIsVisible(element, 'clear completed items button');
		});
	};

	this.assertItemCount = function (itemCount) {
		page.getItemElements().then(function (toDoItems) {
			assert.equal(itemCount, toDoItems.length,
				itemCount + ' items expected in the todo list, ' + toDoItems.length + ' items observed');
		});
	};

	this.assertClearCompleteButtonText = function (buttonText) {
		page.tryGetClearCompleteButton().then(function (elements) {
			var button = elements[0];
			button.getText().then(function (text) {
				assert.equal(buttonText, text);
			});
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
			assert.equal(text, inputFieldText);
		});
	};

	this.assertItemText = function (itemIndex, textToAssert) {
		page.getItemLabelAtIndex(itemIndex).getText().then(function (text) {
			assert.equal(textToAssert, text,
				'A todo item with text \'' + textToAssert + '\' was expected at index ' +
				itemIndex + ', the text \'' + text + '\' was observed');
		});
	};

	// tests that the list contains the following items, independant of order
	this.assertItems = function (textArray) {
		page.getItemLabels().then(function (labels) {

			// obtain all the visible items
			var visibleLabels = [];
			var tests = labels.map(function (label) {
					return label.isDisplayed().then(function (isDisplayed) {
						if (isDisplayed) {
							visibleLabels.push(label);
						}
					});
				});

			// check that they match the supplied text
			return Q.all(tests).then(function () {
				assert.equal(textArray.length, visibleLabels.length,
					textArray.length + ' items expected in the todo list, ' + visibleLabels.length + ' items observed');

				// create an array of promises which check the presence of the
				// label text within the 'textArray'
				tests = [];
				for (var i = 0; i < visibleLabels.length; i++) {
					// suppressing JSHint - the loop variable is not being used in the function.
					/* jshint -W083 */
					tests.push(visibleLabels[i].getText().then(function (text) {
						var index = textArray.indexOf(text);
						assert(index !== -1, 'A todo item with text \'' + text + '\' was not expected');
						// remove this item when found
						textArray.splice(index, 1);
					}));
				}

				// execute all the tests
				return Q.all(tests);
			});
		});
	};

	this.assertItemCountText = function (textToAssert) {
		page.getItemsCountElement().getText().then(function (text) {
			assert.equal(textToAssert, text.trim(), 'the item count text was incorrect');
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

	function isSelected(cssClass) {
		return cssClass.indexOf('selected') !== -1;
	}

	this.assertFilterAtIndexIsSelected = function (selectedIndex) {
		page.getFilterElements().then(function (filterElements) {

			// create an array of promises, each one holding a test
			var tests = [];

			// push a test into the array, avoiding the classic JS for loops + closures issue!
			function pushTest(itemIndex) {
				tests.push(filterElements[itemIndex].getAttribute('class').then(function (cssClass) {
					assert(selectedIndex === itemIndex ? isSelected(cssClass) : !isSelected(cssClass),
						'the filter / route at index ' + selectedIndex + ' should have been selected');
				}));
			}

			for (var i = 0; i < 3; i++) {
				pushTest(i);
			}

			// execute all the tests
			return Q.all(tests);
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
