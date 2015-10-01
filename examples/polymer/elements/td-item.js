(function () {
	'use strict';

	Polymer({
		is: 'td-item',
		extends: 'li',
		properties: {
			editing: {
				type: Boolean,
				value: false
			},
			item: {
				type: Object,
				value: function () {
					return {};
				}
			}
		},
		observers: ['setRootClass(item.completed, editing)'],
		setRootClass: function (completed, editing) {
			this.classList.toggle('completed', completed);
			this.classList.toggle('editing', editing);
		},
		onBlur: function () {
			this.commitAction();
			this.editing = false;
		},
		editAction: function () {
			this.editing = true;
			this.async(function () {
				var elm = this.querySelector('#edit');
				// It looks like polymer is trying to be smart here and not updating the
				// title attribute on the input when it is changed. To work around this, we manually have
				// to set the value again when we go into edit mode.
				elm.value = this.item.title;
				elm.focus();
			});
		},
		commitAction: function () {
			if (this.editing) {
				this.editing = false;
				this.set('item.title', this.querySelector('#edit').value.trim());
				if (this.item.title === '') {
					this.destroyAction();
				}
				this.fire('td-item-changed');
			}
		},
		cancelAction: function () {
			this.editing = false;
		},
		itemChangeAction: function (e, details) {
			this.set('item.completed', e.target.checked);
			this.fire('td-item-changed');
		},
		destroyAction: function () {
			this.fire('td-destroy-item', this.item);
		}
	});
})();

