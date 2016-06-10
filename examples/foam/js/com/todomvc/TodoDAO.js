(function () {
	/* global CLASS */
	'use strict';
	CLASS({
		package: 'com.todomvc',
		name: 'TodoDAO',
		extendsModel: 'foam.dao.ProxyDAO',
		methods: [
			function put(issue, s) {
				// If the user tried to put an empty text, remove the entry instead.
				if (!issue.text) {
					this.remove(issue.id, { remove: s && s.put });
				} else {
					this.SUPER(issue, s);
				}
			}
		]
	});
})();
