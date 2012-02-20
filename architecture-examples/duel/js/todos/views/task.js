/*global duel */

var todos = todos || {};
todos.views = todos.views || {};

todos.views.task = duel(['',
	/* could have embedded in 'tasks' for-loop, but this allows us to add single tasks */
	' ',
	['li', {
			'class' : function(data) { return ( data.done ? 'done' : '' ); },
			'ondblclick' : function(data) { return ( todos.actions.content_dblclick(data.id) ); }
		},
		' ',
		['div', { 'class' : 'view' },
			' ',
			['input', {
					'class' : 'toggle',
					'type' : 'checkbox',
					'checked' : function(data) { return ( data.done ); },
					'onchange' : function(data) { return ( todos.actions.done_change(data.id) ); }
				}],
			' ',
			['label',
				function(data) { return ( data.name ); }
			],
			' ',
			['a', {
					'class' : 'destroy',
					'onclick' : function(data) { return ( todos.actions.remove_click(data.id) ); }
				}],
			' '
		],
		' ',
		['input', {
				'class' : 'edit',
				'type' : 'text',
				'value' : function(data) { return ( data.name ); },
				'onkeypress' : function(data, index, count, key) { return ( todos.actions.edit_keypress(data.id) ); }
			}]
	]
]);
