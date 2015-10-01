Router.route('/', {
	name: 'all',
	controller: 'AllController',
	where: 'client'
});

Router.route('/active', {
	name: 'active',
	controller: 'ActiveController',
	where: 'client'
});

Router.route('/completed', {
	name: 'completed',
	controller: 'CompletedController',
	where: 'client'
});