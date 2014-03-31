/*global MooVeeStar */
/*jshint browser:true, mootools:true */
(function (window) {

	'use strict';

	// MooTools needs to support hashchange for our simple 'window:hashchange' routing event
	Element.NativeEvents.hashchange = 2;

	window.views = window.views || {};

	window.views.AppView = new Class({

		Extends: MooVeeStar.View,
		template: $('todoapp'),

		options: {
			autoattach: false,  // We'll manually call attach in our initialize
			autorender: false   // We'll manually call render
		},

		events: {
			'window:hashchange': 'setFilterFromHash',
			'model:change': 'render',
			'elements.input:keydown': 'onInputKeydown',
			'collection:change': 'onCollectionChange',
			'collection:model:change': 'onCollectionModelChange',
			'click:relay([data-action])': 'onActionClick'
		},

		initialize: function () {
			// Call the MVS.View#initialize with our AppViewModel. This will be set to our `model` property.
			// Additionally, our template element will be set to our `element` property and our `elements` property
			// will be a map ready. `render()` and `attach()` normally get called in here, but we've deferred them 
			// in our options map above.
			this.parent(new window.models.AppViewModel());

			// Set our todos collection
			this.collection = new window.collections.Todos(null, { id: 'todos-collection'});

			// We cache these elements into our elements map for easier use. This is why we wait to render and
			// attach because these are used in `render()` and our `events` map but need to be defined after
			// we call `parent`
			this.elements.input = this.element.getElement('#header > input');
			this.elements.toggleAll = this.element.getElement('#toggle-all');
			this.elements.main = this.element.getFirst('#main');
			this.elements.footer = this.element.getFirst('#footer');
			this.elements.list = this.element.getElement('#todo-list');
			this.elements.filters = this.element.getElement('#filters');

			// Manually set the filter (since a `hashchange` doesn't fire on page load)
			this.setFilterFromHash();

			// Finally, call render and attach
			this.render().attach();

			// Check localStorage and add any items
			this.storage = new MooVeeStar.Storage();
			this.collection.add(this.storage.retrieve(this.collection.getId()) || []);
		},


		// The main render method. By default, render will simply call our model.toJSON(), but we've overloaded it
		// to toggle classnames and build our list as well.
		render: function () {
			var items, frag;

			// Classname & attribute changes based on current state
			this.elements.toggleAll.set('checked', this.model.get('total') > 0 && this.model.get('active') === 0);
			this.elements.main.toggleClass('hidden', this.model.get('total') === 0);
			this.elements.footer.toggleClass('hidden', this.model.get('total') === 0);
			this.elements.list.removeClass('-filter-completed').removeClass('-filter-active').addClass('-filter-' + this.model.get('filter'));
			this.elements.filters.getElements('.selected').removeClass('selected');
			this.elements.filters.getElement('a[href*="' + this.model.get('filter') + '"], a[href="#/"]').addClass('selected');

			// Render the list
			if (this.model.get('filter') === 'completed' || this.model.get('filter') === 'active') {
				items = this.collection.find(this.model.get('filter') === 'completed', 'completed');
			} else {
				items = this.collection.getAll();
			}
			frag = document.createDocumentFragment();
			this.empty(this.elements.list);
			(items || []).forEach(function (model) {
				frag.appendChild($(new window.views.TodoView(model)));
			});
			this.elements.list.appendChild(frag);

			return this.parent();
		},

		// When the hash changes, this gets called (also, manually on load)
		// This is, in essence, our router -- but using a simple model property
		// to determine what filter to display in `render()`
		setFilterFromHash: function () {
			this.model.set('filter', window.location.hash.replace('#/', '') || 'all');
		},

		// When our collection changes, save it to storage and update
		// our view-model's total and complete numbers. This will handle adds and removes
		onCollectionChange: function (e) {
			this.storage.store(this.collection);
			this.model.set({
				total: this.collection.getLength(),
				completed: this.collection.find(true, 'completed').length
			});
		},


		// When a model in our collection changes, save it to storage and update
		// our view-model's complete numbers. This handles when a user checks a todo off
		onCollectionModelChange: function (e) {
			this.storage.store(this.collection);
			this.model.set('completed', this.collection.find(true, 'completed').length);
		},

		// When we click a [data-action]	element, see what action we want to take.
		onActionClick: function (e, target) {
			var action = target.get('data-action');
			if (action === 'toggle-all') {
				this.collection.applyToModels('set', ['completed', e.target.get('checked')]);
			} else if (action === 'clear-completed') {
				this.collection.applyToModels('destroy', [], true, 'completed');
			}
		},

		// If we hit enter in our input and we have a title, let's create a new todo
		onInputKeydown: function (e) {
			var title;
			if (e.key === 'enter') {
				title = this.elements.input.get('value').trim();
				if (title) {
					this.collection.add({ id: String.uniqueID(), title: title, completed: this.model.get('filter') === 'completed' });
					this.elements.input.set('value', '');
				}
			}
		}

	});


})(window);