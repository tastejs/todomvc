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
//		parseForm: function(form) {},

		add: function() {},
		update: function() {},
		remove: function() {},

		removeCompleted: function() {
			var self = this;

			this._forEachTodo(function(todo) {
				if(todo.complete) self.remove(todo);
			});
		},

		toggleAll: function(e) {
			var checked, self;

			checked = (e.selectorTarget || e.target).checked;
			self = this;

			var checkboxes = toArray(this.getCheckboxes());
			checked = checkboxes.forEach(function(cb) {
				cb.checked = true;
				self.update(cb);
			});
		},

		updateCount: function() {
			var checkboxes, checked, countNodes;

			checkboxes = toArray(this.getCheckboxes());
			checked = checkboxes.filter(function(cb) {
				return cb.checked;
			}).length;

			this.masterCheckbox.checked = checkboxes.length > 0 && checked === checkboxes.length;

			countNodes = toArray(this.countNodes);
			countNodes.forEach(function(n) {
				n.innerHTML = checked;
			});

			return checked;
		},

		/**
		 * @injected
		 * @param todo
		 */
		validate: function(todo) { return { valid: /\S+/.test(todo.text) }; },

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