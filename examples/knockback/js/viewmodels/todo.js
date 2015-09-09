/*global Knockback */
var app = app || {};

(function () {
	'use strict';

	var ENTER_KEY = 13;
	var ESC_KEY = 27;

	// Todo View Model
	// ---------------

	app.TodoViewModel = kb.ViewModel.extend({
		constructor: function (model, options) {
			// Using 'requires' automatically creates two-way observables only for title and completed attributes.
			// Using 'keys' will allow any discovered attributes to be created in addition to title and completed.
			// Using 'excludes' will block observables being created for specific attributes.
			// Using 'internal' will use an underscored name like _title for the observable name.
			kb.ViewModel.prototype.constructor.call(this, model, {requires: ['title', 'completed']}, options);

			// Use editTitle to delay updating model attributes until changes are accepted.
			this.editTitle = ko.observable();
			this.editing = ko.observable(false);

			// Subscribe to changes in completed so that they can be saved automatically
			this.completed.subscribe(function (completed) { this.model().save({completed: completed}); }.bind(this));
		},

		onDestroy: function (self) { self.model().destroy(); },

		// Start editing if not already editing.
		onCheckEditBegin: function (self) {
			if (!self.editing()) {
				self.editTitle(self.title());
				self.editing(true);
				$('.todo-input').focus(); // give the input focus
			}
		},

		// Stop editing if already editing.
		onCheckEditEnd: function (self, event) {
			if (self.editing()) {
				if (event.keyCode === ESC_KEY) {
					self.editing(false);
				}

				if ((event.keyCode === ENTER_KEY) || (event.type === 'blur')) {
					self.editing(false);

					// Save the editTitle in the model's title or delete the model if blank
					var title = self.editTitle();
					$.trim(title) ? self.model().save({title: $.trim(title)}) : self.model().destroy();
				}
			}
		}
	});
})();
