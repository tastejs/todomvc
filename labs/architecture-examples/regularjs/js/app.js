(function( window ) {
	'use strict';

	var KEY_ENTER = 13, KEY_ESC = 27;

	// implement our own Component: ToDoApp
	var TodoApp = Regular.extend({
		template: "#template", // id of template container
		init: function() {
			var data = this.data,
				stored = JSON.parse(localStorage.getItem('todos-regularjs'));
			// load data if stored in localstorage
			if(stored && stored.length !== 0) {
				data.items = stored;
			}
			// update localstorage when items change
			this.$watch('items', function() {
				localStorage.setItem('todos-regularjs', JSON.stringify(data.items,['title','completed']));
			});
		},
		// computed attribute, used for two way binding
		computed: {
			allCompleted: {
				get: function() {
					var all = true; // are all todos completed?
					this.data.items.forEach(function(item, index) {
						if(item.completed == false) {
							all = false;
						}
					});
					return all;
				},
				set: function(newVal) {
					// set every item's status to completed
					this.data.items.forEach(function(item, index) {
						item.completed = newVal;
					});
				}
			},
			active: {
				get: function() {
					// number of active todos
					return this.data.items.reduce(function(prev, current) {
						return prev + (current.completed ? 0 : 1);
					}, 0);
				}
			}
		},
		// add new todo
		newTodo: function(title) {
			title = title.trim();
			if(title === '') return;
			this.data.items.push({
				title: title,
				completed: false
			});
			// clear input
			this.data.title = '';
		},
		// double click handler
		dblClick: function(item) {
			// editing state
			item.editing = true;
			// set editing input's value
			item.newVal = item.title;
		},
		destroyTodo: function(index) {
			// just remove the item
			this.data.items.splice(index, 1);
		},
		updateTitle: function(index) {
			var item = this.data.items[index];
			item.editing = false;
			item.newVal = item.newVal.trim();
			// length is zero, destory the todo
			if(item.newVal === '') {
				this.destroyTodo(index);
				return;
			}
			item.title = item.newVal; // set title to the input value
			delete item.newVal; // we don't need the attribute anymore
		},
		keyup: function(item, $event) {
			if($event.which === KEY_ENTER) {
				// just blur
				$event.target.blur();
			}else if($event.which === KEY_ESC) {
				//reset the attribute
				item.newVal = item.title;
				item.editing = false;
			}
		},
		// remove completed item
		clearComplete: function() {
			this.data.items = this.data.items.filter(function(item, index) {
				return item.completed === false;
			});
		}
	});

	// define a new filter
	TodoApp.filter('current', function(items, selected) {
		return items.filter(function(item) {
			if(selected === 'all') {
				return true;
			}
			return selected === 'active' ? !item.completed : item.completed;
		});
	});

	//autofocus when double click
	TodoApp.directive('r-focus', function(elem, value) {
		this.$watch(value, function(newVal) {
			if(newVal) {
				setTimeout(function(){elem.focus();}, 0);
			}
		});
	});

	// initialize the Component
	var app = new TodoApp({
		data: {
			items: [],
			selected: 'all'
		}
	});

	// https://github.com/flatiron/director
	var router = Router({
		'/' : function() {
			app.$update('selected', 'all');
		},
		'/active' : function() {
			app.$update('selected', 'active');
		},
		'/completed' : function() {
			app.$update('selected', 'completed');
		} 
	});
	router.init();
	var hashDelim = '#/';
	if(window.location.href.indexOf(hashDelim) == -1) {
		window.location.href += hashDelim;
	}

	// inject our component to dom node
	app.$inject('#todoapp');
})( window );
