/*global define*/
define(['plugins/router',
], function (router) {

	'use strict';
	
	return {
		router: router,
		filter: undefined, // this is used as the global cache to figure out the filter in effect.
		activate: function () {
			router.map([
 				{ route: '(:filter)', title:'Welcome', hash: '#/filter', moduleId: 'js/viewmodels/todoapp', nav: true },
            ]).buildNavigationModel();

			router.makeRelative('js/viewmodels');

            return router.activate();

// {
// 				route:'a',
// 				url: '/',
// 				moduleId: 'js/viewmodels/todoapp',
// 				name: 'TodoMVC',
// 				caption: 'Durandal • TodoMVC', nav: true
// 			},
			
// 			{
// 				url: '#/:filter',
// 				moduleId: 'js/viewmodels/todoapp',
// 				name: 'TodoMVC',
// 				hash: '#/filter',
// 				caption: 'Durandal • TodoMVC', nav: true
// 			}

              //router.activate('todoapp');
		}
	};
});