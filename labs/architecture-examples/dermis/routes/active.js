/*global define $*/
define(['js/models/Todo', 'js/models/Todos'], function (Todo, Todos) {
	'use strict';

	var app = {
		show: function () {
			Todos.set('mode', 'active');
			$('.selected').removeClass('selected');
			$('a[href$="#/active"]').addClass('selected');
		}
	};
	return app;
});
