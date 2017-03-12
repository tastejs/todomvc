'use strict';
/*global m */

const mainView = new MainView();

//m.route.prefix("?");
m.route(document.getElementById('todoapp'), '/', {
	'/': mainView,
	'/:filter': mainView
});
