var webdriver = require('selenium-webdriver'),
	Page = require("./page");

function PageLaxMode(browser) {
	Page.apply(this, [browser]);

	this.tryGetToggleForItemAtIndex = function(index) {
        // the specification dictates that the checkbox should have the 'toggle' CSS class. Some implementations deviate from
        // this, hence in lax mode we simply look for any checkboxes within the specified 'li'.
        var xpath = this.xPathForItemAtIndex(index) + "//input[@type='checkbox']";
        return browser.findElements(webdriver.By.xpath(xpath));
    }

    this.getEditInputForItemAtIndex = function(index) {
        // the specification dictates that the input element that allows the user to edit a todo item should have a CSS
        // class of 'edit'. In lax mode, we also look for an input of type 'text'.

        var xpath = "(" + this.xPathForItemAtIndex(index) + "//input[@type='text']" + "|" +
        	this.xPathForItemAtIndex(index) + "//input[contains(@class,'edit')]" + ")";
        return browser.findElement(webdriver.By.xpath(xpath));
    }
}

module.exports = PageLaxMode;