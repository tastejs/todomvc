/*jshint newcap:false */
/*global include, mask, Compo */

/**
 *	Single Todo Item Component
 *		- View
 *		- Edit
 *
 *	Public signals -
 *		taskChanged: Todo's state or title was changed
 *		taskRemoved: Todo was removed
 *			@arguments: Todo Model
 *
 */

include
	.load('todoTask.mask::Template')
	.done(function (response) {
	'use strict';

	var STATE_VIEW = '';
	var STATE_EDIT = 'editing';

	mask.registerHandler(':todoTask', Compo({

		//= Properties

		state: STATE_VIEW,

		//= Component Definition

		template: response.load.Template,
		slots: {
			inputCanceled: '_editEnd',

			taskChanged: function () {
				if (!this.model.title) {

					// [emitIn/emitOut] signal propagation begins from a sender
					this.emitOut('taskRemoved');

					// stop propagation of the `taskChanged` signal
					return false;
				}

				this._editEnd();
			},
			taskRemoved: function () {
				// remove component
				this.remove();

				// add arguments to the signal
				return [this.model];
			},

			edit: function () {

				this.state = STATE_EDIT;
				this.compos.input.focus();

				// stop signal propagation (example purpose)
				return false;
			}

		},
		compos: {
			input: 'compo: todo:input'
		},

		//= Private Methods

		_editEnd: function () {
			this.state = STATE_VIEW;
		},

		_isVisible: function (completed, action) {
			if ('completed' === action && !completed) {
				return false;
			}

			if ('active' === action && completed) {
				return false;
			}

			return true;
		}
	}));
});
