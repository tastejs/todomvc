/*global duel */

var todos = todos || {};
todos.views = todos.views || {};

todos.views.stats = duel(['',
	/* this footer needs to be shown when there are todos and hidden when not */
	' ',
	['$if', { 'test' : function(data) { return ( data.total ); } },
		['footer', { 'id' : 'todo-stats' },
			' ',
			['$if', { 'test' : function(data) { return ( data.completed ); } },
				['a', {
						'id' : 'clear-completed',
						'onclick' : function() { return ( todos.actions.clear_click ); }
					},
					' Clear ',
					['span', { 'class' : 'number-done' },
						function(data) { return ( data.completed ); }
					],
					' completed ',
					['span', { 'class' : 'word-done' },
						function(data) { return ( (data.completed === 1) ? 'item' : 'items' ); }
					]
				]
			],
			' ',
			['div', { 'id' : 'todo-count' },
				' ',
				['span', { 'class' : 'number' },
					function(data) { return ( data.left ); }
				],
				' ',
				['span', { 'class' : 'word' },
					function(data) { return ( (data.left === 1) ? 'item' : 'items' ); }
				],
				' left '
			]
		]
	]
]);
