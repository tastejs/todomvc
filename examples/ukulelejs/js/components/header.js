/*jshint unused:false */
(function () {
	'use strict';
	return function (uku) {
		var ENTER_KEY = 13;
		this.newTask = '';
		this.enterHandler = function (event) {
			if (event.keyCode === ENTER_KEY && this.newTask && this.newTask.trim() !== '') {
				var task = this.newTask.trim();
				this.fire('newtaskinputed', {
					message: task
				});
				this.newTask = '';
				uku.refresh();
			}
		};
	};
})();
