define(['ko'], function (ko) {

	var Home = ko.observe({
		controllers: {
			'/': function () {
				this.filter = '';
			},
			'/:filter': function (filter) {
				this.filter = filter;
			}
		},
		filter: '',
		title: 'Knockout SPA • TodoMVC'
	});

	return Home;

});
