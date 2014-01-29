var webdriver = require('selenium-webdriver');

function Page(browser, laxMode) {

    // ----------------- utility methods

    this.xPathForItemAtIndex = function(index) {
        // why is XPath the only language silly enough to be 1-indexed?
        return "//ul[@id='todo-list']/li[" + (index + 1) + "]";
    }

    // ----------------- try / get methods

    // unfortunately webdriver does not have a decent API for determining if an 
    // element exists. The standard approach is to obtain an array of elements
    // and test that the length is zero. These methods are used to obtain 
    // elements which *might* be present in the DOM, hence the try/get name.

    this.tryGetMainSectionElement = function() {
        return browser.findElements(webdriver.By.xpath("//section[@id='main']"));
    }

    this.tryGetFooterElement = function() {
        return browser.findElements(webdriver.By.xpath("//footer[@id='footer']"));
    }

    this.tryGetClearCompleteButton = function() {
        return browser.findElements(webdriver.By.xpath("//button[@id='clear-completed']"));
    }

    this.tryGetToggleForItemAtIndex = function(index) {
        var xpath = this.xPathForItemAtIndex(index) + "//input[contains(@class,'toggle')]";
        return browser.findElements(webdriver.By.xpath(xpath));
    }

    this.tryGetItemLabelAtIndex = function(index) {
        return browser.findElements(webdriver.By.xpath(this.xPathForItemAtIndex(index) + "//label"));
    }

    // ----------------- DOM element access methods

    this.getEditInputForItemAtIndex = function(index) {
        var xpath = this.xPathForItemAtIndex(index) + "//input[contains(@class,'edit')]";
        return browser.findElement(webdriver.By.xpath(xpath));
    }

    this.getItemInputField = function() {
        return browser.findElement(webdriver.By.xpath("//input[@id='new-todo']"));
    }

    this.getMarkAllCompletedCheckBox = function() {
        return browser.findElement(webdriver.By.xpath("//input[@id='toggle-all']"));
    }

    this.getItemElements = function() {
        return browser.findElements(webdriver.By.xpath("//ul[@id='todo-list']/li"));
    }

    this.getNonCompletedItemElements = function() {
        return browser.findElements(webdriver.By.xpath("//ul[@id='todo-list']/li[not(contains(@class,'completed'))]"));
    }

    this.getItemsCountElement = function() {
        return browser.findElement(webdriver.By.id("todo-count"));
    }

    this.getItemLabelAtIndex = function(index) {
        return browser.findElement(webdriver.By.xpath(this.xPathForItemAtIndex(index) + "//label"));
    }

    this.getFilterElements = function() {
        return browser.findElements(webdriver.By.xpath("//ul[@id='filters']//a"));
    }

    // ----------------- page actions

    this.clickMarkAllCompletedCheckBox = function() {
        return this.getMarkAllCompletedCheckBox().then(function(checkbox){
            checkbox.click();
        });
    }

    this.clickClearCompleteButton = function() {
        return this.tryGetClearCompleteButton().then(function(elements) {
            var button = elements[0];
            button.click();
        });
    }

    this.enterItem = function(itemText) {
        var textField = this.getItemInputField();
        textField.sendKeys(itemText);
        textField.sendKeys(webdriver.Key.ENTER);
    };

    this.toggleItemAtIndex = function(index) {
        return this.tryGetToggleForItemAtIndex(index).then(function(elements) {
            var toggleElement = elements[0];
            toggleElement.click();
        });
    }

    this.editItemAtIndex = function(index, itemText) {
        return this.getEditInputForItemAtIndex(index)
            .then(function(itemEditField) {

                // send 50 delete keypresses, just to be sure the item text is deleted
                var deleteKeyPresses = "";
                for (var i=0;i<50;i++) {
                    deleteKeyPresses += webdriver.Key.BACK_SPACE
                }
                itemEditField.sendKeys(deleteKeyPresses);

                // update the item with the new text.
                itemEditField.sendKeys(itemText);
            });
    };

    this.doubleClickItemAtIndex = function(index) {
        return this.getItemLabelAtIndex(index).then(function(itemLabel) {
            // double click is not 'natively' supported, so we need to send the event direct to the element
            // see: http://stackoverflow.com/questions/3982442/selenium-2-webdriver-how-to-double-click-a-table-row-which-opens-a-new-window
            browser.executeScript("var evt = document.createEvent('MouseEvents');" +
                "evt.initMouseEvent('dblclick',true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0,null);" +
                "arguments[0].dispatchEvent(evt);", itemLabel);

        });
    }

    this.filterByActiveItems = function(index) {
        return this.getFilterElements().then(function(filters) {
            filters[1].click();
        });
    }

    this.filterByCompletedItems = function(index) {
        return this.getFilterElements().then(function(filters) {
            filters[2].click();
        });
    }

    this.filterByAllItems = function(index) {
        return this.getFilterElements().then(function(filters) {
            filters[0].click();
        });
    }
}

module.exports = Page;