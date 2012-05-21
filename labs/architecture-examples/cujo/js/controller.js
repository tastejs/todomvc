(function(define) {
define(function (require) {
	"use strict";

	return {
		/**
		 * @injected
		 * @param form
		 */
		parseForm: function(form) {},

		/**
		 * @injected
		 * @param todo
		 */
		validate: function(todo) { return { valid: true }; },

		handleSubmit: function(e) {
			// TODO: Sure would be nice not to have to deal with a form
			// in any way here.  Or better yet, have this controller go
			// away entirely in favor of just being able to compose it
			// in the wire spec.
			var form, todo, validation;

			form = e.selectorTarget || e.target;
			todo = this.parseForm(form);
			validation = this.validate(todo);
			if(validation.valid) {
				this.createTodo(todo);
			}
			form.reset();
		}
	}

});

})(
	typeof define == 'function' && define.amd
		? define
		: function (factory) { module.exports = factory(require); }
);
