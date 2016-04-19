/**
 * @class TodoView
 * @extend Backbone.View
 *
 * @model Todo
 **/
var TodoView = Backbone.View.extend({

	tagName: 'li',

	template: _.template($('#item-template').html()),

	events: {
		'click .toggle': 'onToggleClick',
		'dblclick label': 'onDBLClick',
		'click .destroy': 'clear',
		'keypress .edit': 'updateOnEnter',
		'keydown .edit': 'revertOnEscape',
		'blur .edit': 'close'
	},

	initialize: function () {
		this.listenTo(this.model, 'change:title change:completed', this.render);
		this.listenTo(this.model, 'destroy', this.remove);
		this.listenTo(this.model, 'visible', this.toggleVisible);
	},

	render: function () {
		var title = this.model.get('title');
		var completed = this.model.get('completed');

		this.$el.html(this.template({title: title, completed: completed}));
		this.$el.toggleClass('completed', completed);

		this.$input = this.$('.edit');

		this.toggleVisible();

		return this;
	},

	toggleVisible: function () {
		this.$el.toggleClass('hidden', this.isHidden());
	},

	isHidden: function () {
		var filter = this.model.collection.filterMode;

		return this.model.get('completed')
			? filter === 'active'
			: filter === 'completed';
	},

	onToggleClick: function () {
		this.model.toggle();
	},

	onDBLClick: function () {
		this.$el.addClass('editing');
		this.$input.focus();
	},

	close: function () {
		var value = this.$input.val();
		var trimmedValue = value.trim();

		if (!this.$el.hasClass('editing')) {
			return;
		}

		if (trimmedValue) {
			this.model.savePatch({title: trimmedValue});
		} else {
			this.clear();
		}

		this.$el.removeClass('editing');
	},

	updateOnEnter: function (e) {
		if (e.which === ENTER_KEY) {
			this.close();
		}
	},

	revertOnEscape: function (e) {
		if (e.which === ESC_KEY) {
			this.$el.removeClass('editing');
			this.$input.val(this.model.get('title'));
		}
	},

	clear: function () {
		this.model.destroy();
	}
});
