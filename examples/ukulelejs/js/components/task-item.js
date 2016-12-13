/*jshint unused:false */
(function () {
	'use strict';
	return function (uku) {
		var cancelEdit = false;
		var ENTER_KEY = 13;
		var ESC_KEY = 27;
		var self = this;
		this.task = {};
		this.editing = false;
		this.getTaskClassName = function () {
			if (this.editing) {
				return ['editing'];
			} else if (this.task && this.task.completed) {
				return ['completed'];
			} else {
				return '';
			}
		};
		this.editBegin = function () {
			this.editing = true;
			cancelEdit = false;
			this.titleBackup = this.task.title;
			setTimeout(function () {
				var element = document.getElementById(self.task.id);
				element.focus();
			}, 0);
		};

		this.onKeyUp = function (event) {
			var code = event.keyCode;
			if (code === ENTER_KEY) {
				this.editEnd();
			} else if (code === ESC_KEY) {
				cancelEdit = true;
				this.editing = false;
			}
		};

		this.editEnd = function () {
			if (!cancelEdit) {
				if (this.titleBackup && this.titleBackup.trim() !== '') {
					this.task.title = this.titleBackup;
				} else {
					this.removeTask();
				}

				this.editing = false;
			}
		};

		this.toggleTaskStatus = function () {
			this.fire('toggletaskstatus', null, true);
		};

		this.removeTask = function () {
			this.fire('removetask', {
				message: this.task
			}, true);
		};

		Object.defineProperty(this, 'item', {
			set: function (value) {
				if (value) {
					this.task = value;
				}
			}
		});
	};
})();
