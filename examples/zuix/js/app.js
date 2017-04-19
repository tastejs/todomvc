/*
|| TO-DO-mvc ZUIX implementation
|| Framework official site and documentation:
||     http://zuix.it
*/

(function (window) {
	'use strict';

	if ('onhashchange' in window) {
		window.onhashchange = function () {
			todosComponent.filter(location.hash.replace('#/', ''));
		};
	}

})(window);

// 'todosComponent' holds reference to the to-do-mvc component
var todosComponent, todos_options = {
	ready: function () {
		todosComponent = this;
	},
	// disable local css for this component, since todo_mcv already provide its own global css
	css: false
};
