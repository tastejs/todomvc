'use strict';

var webdriver = require('selenium-webdriver');
var Page = require('./page');

module.exports = function PageLaxMode(browser) {
	Page.apply(this, [browser]);


	this.tryGetMainSectionElement = function () {
		return this.tryFindByXpath('//section//section');
	};

	this.tryGetFooterElement = function () {
		return this.tryFindByXpath('//section//footer');
	};

	this.getTodoListXpath = function () {
		return '(//section/ul | //section/div/ul | //ul[@id="todo-list"])';
	};

	this.getMarkAllCompletedCheckBox = function () {
		var xpath = '(//section/input[@type="checkbox"] | //section/*/input[@type="checkbox"] | //input[@id="toggle-all"])';
		return browser.findElement(webdriver.By.xpath(xpath));
	};

	this.tryGetClearCompleteButton = function () {
		var xpath = '(//footer/button | //footer/*/button | //button[@id="clear-completed"])';
		return browser.findElements(webdriver.By.xpath(xpath));
	};

	this.getItemsCountElement = function () {
		var xpath = '(//footer/span | //footer/*/span)';
		return browser.findElement(webdriver.By.xpath(xpath));
	};

	this.getFilterElements = function () {
		return browser.findElements(webdriver.By.xpath('//footer//ul//a'));
	};


	this.getItemInputField = function () {
		// allow a more generic method for locating the text getItemInputField
		var xpath = '(//header/input | //header/*/input | //input[@id="new-todo"])';
		return browser.findElement(webdriver.By.xpath(xpath));
	};

	this.tryGetToggleForItemAtIndex = function (index) {
		// the specification dictates that the checkbox should have the 'toggle' CSS class. Some implementations deviate from
		// this, hence in lax mode we simply look for any checkboxes within the specified 'li'.
		var xpath = this.xPathForItemAtIndex(index) + '//input[@type="checkbox"]';
		return browser.findElements(webdriver.By.xpath(xpath));
	};

	this.getEditInputForItemAtIndex = function (index) {
		// the specification dictates that the input element that allows the user to edit a todo item should have a CSS
		// class of 'edit'. In lax mode, we also look for an input of type 'text'.
		var xpath = '(' + this.xPathForItemAtIndex(index) + '//input[@type="text"]' + '|' +
			this.xPathForItemAtIndex(index) + '//input[contains(@class,"edit")]' + ')';
		return browser.findElement(webdriver.By.xpath(xpath));
	};
};
