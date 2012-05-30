define(function () {
	"use strict";

	var slice = [].slice;

	function toArray(nodeList) {
		return slice.call(nodeList);
	}

	return {
		/**
		 * @injected
		 * @param form
		 */
		parseForm: function(form) {},

		add: function() {},
		update: function() {},
		remove: function() {},

		removeCompleted: function() {
			var self, checkboxes;

			self = this;
			checkboxes = toArray(this.getCheckboxes());

			checkboxes.forEach(function(cb) {
				if(cb.checked) self.remove(cb);
			});
		},

		toggleAll: function(e) {
			var checked, checkboxes, self;

			checked = (e.selectorTarget || e.target).checked;
			checkboxes = toArray(this.getCheckboxes());
			self = this;

			checkboxes.forEach(function(cb) {
				cb.checked = checked;
				self.update(cb);
			});
		},

		updateCount: function() {
			var checkboxes, checked;

			checkboxes = toArray(this.getCheckboxes());
			checked = checkboxes.filter(function(cb) {
				return cb.checked;
			}).length;

			this.masterCheckbox.checked = checkboxes.length > 0 && checked === checkboxes.length;

			this.countNode.innerHTML = checked;
			this.remainingNode.innerHTML = checkboxes.length - checked;

			return checked;
		},

		/**
		 * @injected
		 * @param todo
		 */
		validate: function(todo) {},

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
				this.add(todo);
				form.reset();
			}
		}
	}

});