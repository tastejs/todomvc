$(function () {
	Backbone.history.start();
	state.fetch();
	todos.fetch();
	main.render();
});

// Domain
var State = Backbone.Model.extend({
	localStorage: new Backbone.LocalStorage('state'),
	defaults: {
		filter: 'all'
	}
});

var state = new State({id: 'todos'});

var Todo = Backbone.Model.extend({
	defaults: {
		status: 'active'
	}
});

var Todos = Backbone.Collection.extend({
	Model: Todo,
	localStorage: new Backbone.LocalStorage('todos')
});

var todos = new Todos();

var Router = Backbone.Router.extend({
	routes: {
		'*filter':'setFilter'
	},
	setFilter: function (filter) {
		if (filter === null) {
			filter = 'all';
		}
		state.save({
			filter: filter
		});
	}
});

new Router();

// UI
var FormView = TemplateView.extend({
	template: '#formView',
	events: {
		submit:'submit'
	},
	submit: function (e) {
		var todo = new Todo({
			status: 'active',
			label: e.target[0].value
		});
		this.collection.add(todo);
		todo.save();
		return false;
	}
});

var ItemView = TemplateView.extend({
	template: '#itemView',
	events: {
		'dblclick label':'edit',
		'keydown input': 'escape',
		'submit .editForm':'submit',
		'blur .edit':'blur',
		'click .toggle':'toggle',
		'click .destroy':'destroy'
	},
	edit: function (e) {
		var $listItem = $(e.target.parentNode.parentNode);
		var $input = $listItem.find('.edit');
		$listItem.addClass('editing');
		// http://stackoverflow.com/a/1056406/4241697
		$input.focus().val($input.val());
	},
	escape: function (e) {
		if (e.which === 27) {
			var $listItem = $(e.target.parentNode.parentNode);
			var $input = $listItem.find('.edit');
			$listItem.removeClass('editing');
			$input.val(this.model.get('label'));
		}
	},
	submit: function (e) {
		this.update(e.target[0].value);
		return false;
	},
	blur: function (e) {
		this.update(e.target.value);
		return false;
	},
	update: function (label) {
		if (label === '') {
			this.model.destroy();
		} else {
			this.model.save({
				label: label
			});
		}
	},
	toggle: function (e) {
		var status = 'active';
		if (e.target.checked) {
			status = 'completed';
		}
		this.model.save({
			status: status
		});
	},
	destroy: function (e) {
		this.model.destroy();
	}
});

var MainView = TemplateView.extend({
	ChildView: ItemView,
	SubViews: [FormView],
	state: state,
	collection: todos,
	template: '#mainView',
	templateContext: function () {
		return {
			allItems: this.collection.length,
			activeItems: this.collection.where({ status: 'active' }).length
		};
	},
	events: {
		'click .toggle-all':'toggleAll',
		'click .clear-completed':'clearCompleted'
	},
	toggleAll: function () {
		var activeItems = this.collection.where({ status: 'active' });
		var status = 'completed';
		if (activeItems.length === 0) {
			status = 'active';
		}
		this.collection.save({ status: status });
	},
	clearCompleted: function () {
		this.collection.destroy({ status: 'completed' });
		return false;
	}
});

var main = new MainView();

// Polyfill type stuff not directly related
if ('ontouchstart' in document.documentElement === false) {
	$('html').addClass('no-touch');
}

Backbone.Collection.prototype.save = function (data, searchData) {
	var models = this.models;
	if (typeof searchData == 'undefined') {
		models = this.where(searchData);
	}
	for (var i = 0; i < models.length; i++) {
		models[i].save(data, {silent: true});
	}
	this.trigger('change');
};

Backbone.Collection.prototype.destroy = function (searchData) {
	var models = this.models;
	if (typeof searchData != 'undefined') {
		models = this.where(searchData);
	}
	// Silent event mode for destroy does not properly sync
	for (var i = 0; i < models.length; i++) {
		models[i].destroy();
	}
};
