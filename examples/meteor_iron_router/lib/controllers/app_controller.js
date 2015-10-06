AppController = RouteController.extend({
	layoutTemplate: 'AppLayout',

	subscriptions: function () {
		this.subscribe('tasks');
	},

	action: function () {
		var locals = this.data();

		this.render('Header', {to: 'header'});
		this.render('Main', {to: 'main', data: locals.query});
		this.render('Footer', {to: 'footer', data: locals.filter});
		this.render('Info', {to: 'info'});
	}
});

AllController = AppController.extend({
	data: function () {
		return {
			filter: {filter: 'all'},
			query: {
				q: {}
			}
		};
	}
});

ActiveController = AppController.extend({
	data: function () {
		return {
			filter: {filter: 'active'},
			query: {
				q: {completed: false}
			}
		};
	}
});

CompletedController = AppController.extend({
	data: function () {
		return {
			filter: {filter: 'completed'},
			query: {
				q: {completed: true}
			}
		};
	}
});
