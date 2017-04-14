'use strict';

$.my.cache({
	
	id: 'todoMVC.App',
	
	params: {strict: true},
	
	data: { 
		filter: 'All', 
		newtext: '', 
		list: [], 
		done: 0, 
		all: '' 
	},
	
	init: function ($form, form) {
		
		var d = form.data, 
			ls = localStorage;
		
		d.list = JSON.parse(ls.getItem('todos-jquerymy')) || d.list;
		
		$form.then(function () {
			Router({
				'/': _filter.fill('all'),
				'/:filter': _filter
			}).init('/');
		});
		
		$form.on('change', function () {
			ls.setItem('todos-jquerymy', JSON.stringify(d.list));
		}.debounce(50));
		
		function _filter (f) {
			d.filter = f.capitalize();
			$form.find('#filters a:contains("'+d.filter+'")')
			.trigger('click');
		}
	},
	
	ui:{
		'#filters': {
			bind: function (d, v, $o) {
				if (null != v) {
					$o.my('find', '#todo-list')
					.removeClass('Active Completed')
					.addClass(d.filter);
				}
			},
			events: 'click.my',
			init: function ($o, form){
				$o.on('click', function (e) {
					
					var c = 'selected', 
						t = e.target;
						
					if ($(t).is('a')) {
						$o.find('.' + c).removeClass(c);
						$(t).addClass(c);
						form.data.filter = t.text;
					}
				});
			}	
		},
		
		'#main,#footer': {
			css:{ 
				'hidden': function (d) { return !d.list.length; } 
			},
			watch: '#todo-list'	
		},
		
		'#new-todo': {
			bind: 'newtext',
			init: function( $o ){
				$o.keydown(function (e) {
					if (e.keyCode == 13 && $o.val().trim()) {
						$o.my('find', '#todo-list')
						.trigger('insert', { 
							what:{ 
								title: $o.val().trim(),
								id: Date.now()
							}, 
							where: 1e6 
						});
						$o.val('');
					}
				});
			}	
		},
		
		'#todo-count': {
			bind: function (d) {
				var n = d.list.count(function (e) { return !e.completed; });
				d.done = d.list.length - n;
				d.all = n?[]:['done'];
				return '<strong>' + n + '</strong> item' + (n!=1?'s':'') + ' left';
				
			},
			watch: '#todo-list'	
		},
		
		'#clear-completed': {
			bind: function (d, v) {
				if (null != v) d.list.remove(function (e) { return e.completed; });
				return 'Clear completed (' + d.done + ')';
			},
			watch: '#todo-count',
			recalcDepth: 3,
			recalc: '#todo-list',
			css: { 
				'hidden': function (d) { return !d.done; } 
			}
		},
		
		'#toggle-all': {
			bind: function (d, v) {
				if (null != v) {
					d.list.forEach(function (e, i, a) {
						a[i] = {
							completed: !!v[0], 
							title: e.title, 
							id: e.id
						};
					});
					d.all=v;
				}
				return d.all;
			},
			watch:  '#todo-count',
			recalc: '#todo-list',
			events: 'click.my'
		},
		
		'#todo-list': {
			bind: 'list',
			manifest: 'Row',
			list: '>li'
		}
	},
	
	style:{
		' .Active .completed':	'display: none;',
		' input,button': 		'outline: none!important;',
		' .edit': 				'padding: 12px 16px!important;',
		' .Completed': {
			' li': 				'display: none;',
			' li.completed': 	'display: block;'
		},
		' label': 				'padding-right: 50px!important;'
	}
});
