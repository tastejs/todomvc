goog.provide('todomvc.todomodel');

goog.require('goog.string');
goog.require('mvc.Model');
goog.require('mvc.Model.ValidateError');


/**
 * @constructor
 * @param {Object=} opt_options to be put on the model.
 * @extends {mvc.Model}
 */
todomvc.todomodel = function (opt_options) {
	goog.base(this, opt_options);

	// title must have a length, also format to remove spaces
	this.setter('title', function (title) {
		var updated = goog.string.trim(title);

		if (!updated.length) {
			throw new mvc.Model.ValidateError('null string');
		}

		return updated;
	});

	// when a note title is no longer valid then remove it
	this.errorHandler(function () {
		this.dispose();
	});
};
goog.inherits(todomvc.todomodel, mvc.Model);
