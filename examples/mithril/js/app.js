'use strict';
/*global m */
var app = app || {};

app.ENTER_KEY = 13;
app.ESC_KEY = 27;

m.route.mode = 'hash';
m.route(document.getElementById('todoapp'), '/', {
	'/': app,
	'/:filter': app
});
