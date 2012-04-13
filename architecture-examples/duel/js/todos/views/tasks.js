/*global duel */

var todos = todos || {};
todos.views = todos.views || {};

todos.views.tasks = duel(['',
	/* this section is hidden by default but will be shown when there are todos */
	' ',
	['$if', { 'test' : function(data) { return ( data.tasks.length ); } },
		['section', { 'id' : 'main' },
			' ',
			['input', {
					'id' : 'toggle-all',
					'type' : 'checkbox',
					'checked' : function(data) { return ( !data.stats.left ); },
					'onchange' : function() { return ( todos.actions.toggle_change ); }
				}],
			' ',
			['label', { 'for' : 'toggle-all' },
				'Mark all as complete'
			],
			' ',
			['ul', { 'id' : 'todo-list' },
				['$for', { 'each' : function(data) { return ( data.tasks ); } },
					' ',
					['$call', { 'view' : function() { return (todos.views.task); } }]
				]
			]
		]
	]
]);
