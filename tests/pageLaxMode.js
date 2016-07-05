'use strict';

var Page = require('./page');

module.exports = function PageLaxMode() {

	Page.apply(this, arguments);

	this.getMainSectionCss = function () {
		return 'section section';
	};

	this.getFooterSectionCss = function () {
		return 'section footer';
	};

	this.getListCss = function (suffixCss) {
		return [
			'section > ul',
			'section > div > ul',
			'ul#todo-list'
		].map(function (listCss) {
			return listCss + (suffixCss || '');
		}).join(', ');
	};

	this.getToggleAllCss = function () {
		return [
			'section > input[type="checkbox"]',
			'section > * > input[type="checkbox"]',
			'input#toggle-all'
		].join(', ');
	};

	this.getClearCompletedButtonCss = function () {
		return [
			'footer > button',
			'footer > * > button',
			'button#clear-completed'
		].join(', ');
	};

	this.getItemCountCss = function () {
		return [
			'footer > span',
			'footer > * > span'
		].join(', ');
	};

	this.getFilterCss = function (index) {
		return 'footer ul li:nth-child(' + (index + 1) + ') a';
	};

	this.getNewInputCss = function () {
		return [
			'header > input',
			'header > * > input',
			'input#new-todo'
		].join(', ');
	};

	this.getListItemToggleCss = function (index) {
		return this.getListItemCss(index, ' input[type="checkbox"]');
	};

	this.getListItemInputCss = function (index) {
		return [
			this.getListItemCss(index, ' input.edit'),
			this.getListItemCss(index, ' input[type="text"]')
		].join(', ');
	};

};
