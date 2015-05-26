/*
 * Client-side collections can be created by passing null to Mongo.Collection()
 * instead of a collection name. These collections are not stored in the db,
 * and are gone when the session ends.
 */
Filters = new Mongo.Collection(null);
Filters.insert({name: 'all', filter: {}});
Filters.insert({name: 'active', filter: {completed: false}});
Filters.insert({name: 'completed', filter: {completed: true}});

Template.todoapp.onCreated(function() {
	/*
	 * Try to avoid using Session variables if you're able, as they pollute the
	 * global namespace. Instead, in the shell, run "meteor add reactive-var" and
	 * use these variables which are reactive like Session, but can be attached
	 * to templates.
	 */
	this.filter = new ReactiveVar('all');

	this.subscribe('todos');
});

// Event map for all items in todoapp template (found in todoapp.html)
Template.todoapp.events({
	'keyup #new-todo': function(event) {
		if (event.which === 13) { //enter key
			/*
			 * In a real production app, you would most likely have a Meteor.call()
			 * to a Meteor method on the server, and also check to make sure that the
			 * insert actually succeeded.
			 */
			Todos.insert({
				title: event.target.value.trim(),
				completed: false,
				createdAt: new Date()
			});

			event.target.value = '';
		} else if (event.which === 27) { //escape key (doesn't work in Firefox?)
			event.target.value = '';
		}
	},

	'click #filters li a': function(event, template) {
		template.filter.set($(event.target).text());
	},

	'click #clear-completed': function() {
		Meteor.call('clearCompleted');
	}
});

/*
 * Defining your own helpers here will allow you to call them in templates via
 * the syntax {{helperName}}. You can also supply arguments, e.g.
 * {{helperName 'hello'}}.
 */

Template.todoapp.helpers({
	todos: function() {
		var filterName = Template.instance().filter.get();
		var filter = Filters.findOne({name: filterName}).filter;

		return Todos.find(filter, {sort: {createdAt: 1}});
	},

	todoCount: function() {
		return Todos.find().count();
	},

	todoCompletedCount: function(completed) {
		return Todos.find({completed: completed}).count();
	},

	filters: function() {
		return Filters.find();
	},

	filterSelected: function(filter) {
		return Template.instance().filter.get() === filter;
	}
});
