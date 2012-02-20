/*global duel */

var todos = todos || {};
todos.views = todos.views || {};

todos.views.main = duel(['',
	['div', { 'id' : 'todoapp' },
		' ',
		['header', { 'id' : 'create-todo' },
			' ',
			['h1',
				'Todos'
			],
			' ',
			['input', {
					'id' : 'new-todo',
					'type' : 'text',
					'placeholder' : 'What needs to be done?',
					'onkeypress' : function(data, index, count, key) { return ( todos.actions.add_keypress ); }
				}],
			' '
		],
		' ',
		['$call', { 'view' : function() { return (todos.views.tasks); } }],
		' ',
		['$call', {
				'view' : function() { return (todos.views.stats); },
				'data' : function(data) { return (data.stats); }
			}]
	],
	' ',
	['div', { 'id' : 'instructions' },
		' Double-click to edit a todo.'
	],
	' ',
	['div', { 'id' : 'credits' },
		' Created by ',
		['a', { 'href' : 'http://mck.me' },
			'Stephen McKamey'
		],
		'.'
	]
]);
