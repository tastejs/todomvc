/*global define $*/
define(['js/models/Todo', 'js/models/Todos'], function (Todo, Todos) {
	'use strict';

	var app = {
		show: function () {
			Todos.set('mode', 'all');
			$('.selected').removeClass('selected');
			$('a[href$="#/"]').addClass('selected');
		}
	};
	return app;
});
