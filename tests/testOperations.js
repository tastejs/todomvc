'use strict';

function TestOperations(page) {

	this.assertItemInputFocused = function () {
		return page.waitForFocusedElement(page.getEditingListItemInputCss(), 'Expected the item input to be focused');
	};

	this.assertNewInputFocused = function () {
		return page.waitForFocusedElement(page.getNewInputCss());
	};

	this.assertNewInputBlurred = function () {
		return page.waitForBlurredElement(page.getNewInputCss());
	};

	this.assertItemCount = function (itemCount) {
		return itemCount === 0 ?
			page.waitForMainSectionRemovedOrEmpty() :
			page.waitForListItemCount(itemCount);
	};

	this.assertClearCompleteButtonText = function (buttonText) {
		return page.waitForClearCompleteButton()
			.then(page.waitForTextContent.bind(page, buttonText, 'Expected clear button text to be ' + buttonText));
	};

	this.assertClearCompleteButtonVisibility = function (shouldBeVisible) {
		var failMsg = 'Expected the clear completed items button to be ' + (shouldBeVisible ? 'visible' : 'hidden');
		return page.waitForVisibility(shouldBeVisible, page.getClearCompletedButtonCss(), failMsg);
	};

	this.assertMainSectionVisibility = function (shouldBeVisible) {
		var failMsg = 'Expected main section to be ' + (shouldBeVisible ? 'visible' : 'hidden');
		return page.waitForVisibility(shouldBeVisible, page.getMainSectionCss(), failMsg);
	};

	this.assertFooterVisibility = function (shouldBeVisible) {
		var failMsg = 'Expected footer to be ' + (shouldBeVisible ? 'visible' : 'hidden');
		return page.waitForVisibility(shouldBeVisible, page.getFooterSectionCss(), failMsg);
	};

	this.assertItemToggleIsHidden = function (index) {
		return page.waitForVisibility(false, page.getListItemToggleCss(index),
			'Expected the item toggle button to be hidden');
	};

	this.assertItemLabelIsHidden = function (index) {
		return page.waitForVisibility(false, page.getListItemLabelCss(index), 'Expected the item label to be hidden');
	};

	this.assertNewItemInputFieldText = function (text) {
		return page.waitForNewItemInputField()
			.then(page.waitForTextContent.bind(page, text,
				'Expected the new item input text field contents to be ' + text));
	};

	this.assertItemText = function (itemIndex, text) {
		return page.waitForItemLabel(itemIndex)
			.then(page.waitForTextContent.bind(page, text, 'Expected the item label to be ' + text));
	};

	this.assertItems = function (textArray) {
		return page.getListItems().then(function (items) {
			if (items.length < textArray.length) {
				// This means that the framework removes rather than hides list items
				textArray = textArray.filter(function (item) { return item !== page.ITEM_HIDDEN_OR_REMOVED; });
			}
			var ret;
			textArray.forEach(function (text, i) {
				if (text === page.ITEM_HIDDEN_OR_REMOVED) { return; }
				var promise = page.waitForTextContent(text, 'Expected item text to be ' + text, items[i]);
				ret = ret ? ret.then(promise) : promise;
			});
			return ret;
		});
	};

	this.assertItemCountText = function (text) {
		return page.waitForElement(page.getItemCountCss())
			.then(page.waitForTextContent.bind(page, text, 'Expected item count text to be ' + text));
	};

	this.assertItemCompletedStates = function (completedStates) {
		return page.waitForElement(
			page.getListItemsWithCompletedStatesCss(completedStates),
			'Item completed states were incorrect');
	};

	this.assertFilterAtIndexIsSelected = function (selectedIndex) {
		return page.waitForElement(
			page.getSelectedFilterCss(selectedIndex),
			'Expexted the filter / route at index ' + selectedIndex + ' to be selected');
	};

	this.assertCompleteAllCheckedStatus = function (shouldBeChecked) {
		var failMsg = 'Expected the mark-all-completed checkbox to be ' + shouldBeChecked ? 'checked' : 'unchecked';
		return page.waitForMarkAllCompletedCheckBox()
			.then(page.waitForCheckedStatus.bind(page, shouldBeChecked, failMsg));
	};
}

module.exports = TestOperations;
