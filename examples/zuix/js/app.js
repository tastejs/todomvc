/*
|| TO-DO-mvc ZUIX implementation
|| Framework official site and documentation:
||     http://zuix.it
*/

(function (window) {
	'use strict';

	// 'todosComponent' holds reference to the to-do-mvc component
	var todosComponent;
	window.todosOptions = {
		ready: function (ctx) {
			todosComponent = ctx;
		},
		// disable local css for this component, since todo_mcv already provide its own global css
		css: false
	};

	if ('onhashchange' in window) {
		window.onhashchange = function () {
			todosComponent.filter(window.location.hash.replace('#/', ''));
		};
	}

})(window);

