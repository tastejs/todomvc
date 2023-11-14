/*global $ */
/*jshint unused:false */
var app = app || {};
var ENTER_KEY = 13;
var ESC_KEY = 27;

var priorityMapping = {
    0: 'L',
    1: 'M',
    2: 'H'
};

var LOW = 'low-pri';
var MED = 'med-pri';
var HIGH = 'high-pri';

$(function () {
	'use strict';

	// kick things off by creating the `App`
	new app.AppView();
});
