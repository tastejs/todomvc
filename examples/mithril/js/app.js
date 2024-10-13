'use strict';
/*global m */
var app = app || {};
var ctrl = new app.Controller();

app.ENTER_KEY = 13;
app.ESC_KEY = 27;

m.route.prefix = '#!';
m.route(document.querySelector('.todoapp'), '/', {
	'/': {
		render: function () {
			return m(app.MainView, {ctrl: ctrl});
		}
	},
	'/:filter': {
		render: function () {
			return m(app.MainView, {ctrl: ctrl});
		}
	}
});
