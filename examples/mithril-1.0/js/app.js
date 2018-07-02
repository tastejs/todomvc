'use strict';
/*global m */
var app = app || {};

app.ENTER_KEY = 13;
app.ESC_KEY = 27;

app.oninit = function(vnode) {
	vnode.state.ctrl = new app.controller();
}

//m.route.prefix("?");
m.route(document.getElementById('todoapp'), '/', {
	'/': app,
	'/:filter': app
});
