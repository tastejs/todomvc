/**
 * @class AppView
 * @extend Backbone.View
 *
 * @collection Todos
 **/
var AppView = Backbone.View.extend({

	el: '.todoapp',

	template: _.template($('#main-app').html()),
	countTemplate: _.template('<strong><%= remaining %></strong> <%= remaining === 1 ? "item" : "items" %> left'),

	events: {
		'keypress .new-todo': 'createOnEnter',
		'click .clear-completed': 'clearCompleted',
		'click .toggle-all': 'toggleAllComplete'
	},

	initialize: function () {
		this.listenTo(this.collection, 'add', this.addOne);
		this.listenTo(this.collection, 'reset', this.onReset);
		this.listenTo(this.collection, 'change:filterMode', this.onFilterModeChange);
		this.listenTo(this.collection, 'add remove reset change:completed', this.updateState);

		//if we created a new one todo before loaded our todos from server we lost the new created item
		//so, need to pass {remove: false}
		this.collection.fetch({remove: false});
	},

	onFilterModeChange: function () {
		this.collection.each(function (model) {
			model.trigger('visible');
		});

		this.$('.filters li a')
			.removeClass('selected')
			.filter('[href="#/' + (this.collection.filterMode || '') + '"]')
			.addClass('selected');
	},

	render: function () {
		this.$el.html(this.template());

		this.allCheckbox = this.$('.toggle-all')[0];
		this.$input = this.$('.new-todo');
		this.$footer = this.$('.footer');
		this.$main = this.$('.main');
		this.$list = this.$('.todo-list');
		this.$countLabel = this.$('.todo-count');
		this.$clearAllButton = this.$('.clear-completed');

		this.updateState();

		return this;
	},

	updateState: function () {
		var completed = this.collection.completed().length;
		var remaining = this.collection.remaining().length;

		if (this.collection.length) {
			this.$countLabel.html(this.countTemplate({remaining: remaining}));
			this.$clearAllButton.toggle(!!completed);

			this.$main.show();
			this.$footer.show();

		} else {
			this.$main.hide();
			this.$footer.hide();
		}

		this.allCheckbox.checked = !remaining;
	},

	addOne: function (todo) {
		this.$list.append(new TodoView({model: todo}).render().el);
	},

	onReset: function () {
		this.$list.empty();

		this.collection.each(this.addOne, this);
	},

	createOnEnter: function (e) {
		var title = this.$input.val().trim();

		if (e.which === ENTER_KEY && title) {
			this.collection.create({title: title}, {async: false});

			this.$input.val('');
		}
	},

	clearCompleted: function () {
		_.invoke(this.collection.completed(), 'destroy');
	},

	toggleAllComplete: function () {
		var completed = this.allCheckbox.checked;

		this.collection.each(function (todo) {
			todo.savePatch({completed: completed});
		});
	}
});
