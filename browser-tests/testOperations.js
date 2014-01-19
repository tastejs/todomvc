var assert = require("assert");

function TestOperations(page) {

    // unfortunately webdriver does not have a decent API for determining if an 
    // element exists. The standard approach is to obtain an array of elements
    // and test that the length is zero. In this case the item is hidden if
    // it is either not in the DOM, or is in the DOM but not visible.
    function testIsHidden(elements) {
        if (elements.length === 1) {
            elements[0].isDisplayed().then(function(isDisplayed) {
                assert(!isDisplayed);
            })
        }
    }
    function testIsVisible(elements) {
        assert.equal(1, elements.length);
        elements[0].isDisplayed().then(function(isDisplayed) {
            assert(isDisplayed);
        });
    }

    this.assertClearCompleteButtonIsHidden = function() {
        page.tryGetClearCompleteButton().then(function(element) {
            testIsHidden(element);
        });
    }

    this.assertClearCompleteButtonIsVisible = function() {
        page.tryGetClearCompleteButton().then(function(element) {
            testIsVisible(element);
        });
    }

    this.assertItemCount = function(itemCount) {
        page.getItemElements().then(function(toDoItems){
            assert.equal(itemCount, toDoItems.length);
        });
    }

    this.assertClearCompleteButtonText = function(buttonText) {
        page.tryGetClearCompleteButton().then(function(elements) {
            var button = elements[0];
            button.getText().then(function(text) {
                assert.equal(buttonText, text);
            });
        });
    }

    this.assertMainSectionIsHidden = function() {
        page.tryGetMainSectionElement().then(function(mainSection) {
            testIsHidden(mainSection);
        });
    }

    this.assertFooterIsHidden = function() {
        page.tryGetFooterElement().then(function(footer) {
            testIsHidden(footer);
        });
    }

    this.assertMainSectionIsVisible = function() {
        page.tryGetMainSectionElement().then(function(mainSection) {
            testIsVisible(mainSection);
        });
    }

    this.assertItemToggleIsHidden = function() {
        page.tryGetToggleForItemAtIndex().then(function(toggleItem) {
            testIsHidden(toggleItem);
        });
    }

    this.assertItemLabelIsHidden = function() {
        page.tryGetItemLabelAtIndex().then(function(toggleItem) {
            testIsHidden(toggleItem);
        });
    }

    this.assertFooterIsVisible = function() {
        page.tryGetFooterElement().then(function(footer) {
            testIsVisible(footer);
        });
    }

    this.assertItemInputFieldText = function(text) {
        page.getItemInputField().getText().then(function(inputFieldText) {
            assert.equal(text, inputFieldText);
        });
    }

    this.assertItemText = function(itemIndex, textToAssert) {
        page.getItemLabelAtIndex(itemIndex).getText().then(function(text) {
            assert.equal(textToAssert, text.trim());
        });
    }

    this.assertItemCountText = function(textToAssert) {
        page.getItemsCountElement().getText().then(function(text) {
            assert.equal(textToAssert, text.trim());
        });
    }

    // tests for the presence of the 'completed' CSS class for the item at the given index
    this.assertItemAtIndexIsCompleted = function(index) {
        page.getItemElements().then(function(toDoItems) {
            toDoItems[index].getAttribute("class").then(function(cssClass) {
                assert(cssClass.indexOf("completed") !== -1);
            });
        });
    }

    this.assertItemAtIndexIsNotCompleted = function(index) {
        page.getItemElements().then(function(toDoItems) {
            toDoItems[index].getAttribute("class").then(function(cssClass) {
                assert(cssClass.indexOf("completed") === -1);
            });
        });
    }

    function isSelected(cssClass) {
        return cssClass.indexOf("selected") !== -1;
    }

    this.assertFilterAtIndexIsSelected = function(index) {
       page.getFilterElements().then(function(filterElements) {
            filterElements[0].getAttribute("class").then(function(cssClass) {
                assert(index == 0 ? isSelected(cssClass) : !isSelected(cssClass));
            });

            filterElements[1].getAttribute("class").then(function(cssClass) {
                assert(index == 1 ? isSelected(cssClass) : !isSelected(cssClass));
            });

            filterElements[2].getAttribute("class").then(function(cssClass) {
                assert(index == 2 ? isSelected(cssClass) : !isSelected(cssClass));
            });
        });
    }

    this.assertCompleteAllIsClear = function() {
        page.getMarkAllCompletedCheckBox().then(function(markAllCompleted) {
            markAllCompleted.isSelected().then(function(isSelected){
                assert(!isSelected);
            })
        });
    }

    this.assertCompleteAllIsChecked = function() {
        page.getMarkAllCompletedCheckBox().then(function(markAllCompleted) {
            markAllCompleted.isSelected().then(function(isSelected){
                assert(isSelected);
            })
        });
    }
}

module.exports = TestOperations;