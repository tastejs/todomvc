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

(function () {
	'use strict';

	var STATE_VIEW = '';
	var STATE_EDIT = 'editing';
	include.exports = {
		scope: {
			state: STATE_VIEW
		},

		slots: {
			taskChanged: function () {
				if (!this.model.title) {

					// [emitIn/emitOut] signal propagation begins from a sender
					this.emitOut('taskRemoved');

					// stop propagation of the `taskChanged` signal
					return false;
				}

				this.scope.state = STATE_VIEW;
			},
			taskRemoved: function () {
				// remove component
				this.remove();

				// add arguments to the signal
				return [this.model];
			},
			cancel: function () {
				this.scope.state = STATE_VIEW;
			},
			submit: function () {
				// do not send the signal to the app
				return false;
			},
			edit: function () {
				this.scope.state = STATE_EDIT;
				this.compos.input.$.focus();
			}
		},
		compos: {
			input: 'compo: TaskEdit'
		},

		//= Private Methods

		_isVisible: function (completed, action) {
			if (action === 'completed' && !completed) {
				return false;
			}
			if (action === 'active' && completed) {
				return false;
			}
			return true;
		}
	};

})();
