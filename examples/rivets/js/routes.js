(function (Router, TodoMVCView) {
    'use strict';
    
    var routes = {
		'/': function () {
			TodoMVCView.setStatusFilter('');
		},
		'/active': function () {
			TodoMVCView.setStatusFilter('active');
		},
		'/completed': function () {
			TodoMVCView.setStatusFilter('completed');
		}
	};

	var router = new Router(routes).configure({ 
		notfound: function() { TodoMVCView.setStatusFilter(''); } 
	});
	router.init();
    
})(Router, TodoMVCView);