(function($, $$) {
	'use strict';
	var ENTER_KEY = 13;

	// Hack of taking out html elements from DOM so that agility's view can use it.
	var drawHtml = function(selector) {
		// we need 'outerhtml' also, as agilityjs will append DOM, so removing it.
		var html = $(selector).remove().wrap('<div>').parent().html();
		return html;
	};

	// Simple Two layer composition:
	// individual 'todoitem' and 'app'lication which holds multiple todoitems.
	$(function() {
		// todo item
		var todoitem = $$({
			model: {
				complete: false
			},
			view: {
				format: drawHtml('#todo-list li'),
				style: '.hidden { display: none }'
			},
			controller: {
				'change:complete': function() {
					var complete = this.model.get('complete');
					this.setStatus(complete ? 'complete' : '');
					app.updateStatus();
				},
				'dblclick .view': function() {
					this.setStatus('editing');
					this.view.$('.edit').select();
				},
				'click .destroy': function() {
					this.destroy();
				},
				'change .edit': function() {
					this.updateTitle();
				},
				'blur .edit': function() {
					this.updateTitle();
				},
				'change': function() {
					this.save();
				},
				'destroy': function() {
					this.erase();
				}
			},
			// utility functions
			setStatus: function(status) {
				this.model.set({status: status});
			},
			updateTitle: function() {
				this.setStatus('');
				var title = this.model.get('title').trim();
				if ( title ) {
					this.model.set({title: title});
				} else {
					this.destroy();
				}
			}
		}).persist($$.adapter.localStorage, {collection: 'todos-agilityjs'});

		// The main application which holds todo items.
		var app = $$({
			model: {
				todoCount: '0',
				pluralizer: '',
				completeCount: '0',
				newtitle: '',
				toggleAll: false,
				mainStyle: '',
				clearBtnStyle: ''
			},
			view: {
				format: drawHtml('#todoapp'),
				style: '.hidden { display: none }'
			},
			controller: {
				'remove': function() {
					app.updateStatus();
				},
				'keyup #new-todo': function(event) {
					if ( event.which !== ENTER_KEY ) {
						return;
					}
					var title = this.model.get('newtitle').trim();
					if ( !title ) {
						return;
					}
					this.addTodoItem({title: title});
					$(event.target).val('');  // clear input field
				},
				'change:toggleAll': function() {
					var ischecked = this.model.get('toggleAll');
					this.each(function(id, item) {
						item.model.set({complete: ischecked});
					});
				},
				'click #clear-completed': function() {
					this.each(function(id, item) {
						if ( item.model.get('complete') ) {
							item.destroy();
						}
						app.updateStatus();
					});
				}
			},
			// utility functions
			addTodoItem: function(data) {
				this.append($$(todoitem, data).save(), '#todo-list');
				this.updateStatus();
			},
			updateStatus: function() {
				// update counts
				var count = this.size(),
					completeCount = 0;
				this.each(function(id, item) {
					if ( item.model.get('complete') ) {
						completeCount++;
					}
				});
				this.model.set({
					todoCount: count - completeCount + '',
					pluralizer: (count > 1 ? 's' : ''),
					completeCount: completeCount + '',
					mainStyle: (count === 0 ? 'hidden' : ''),
					clearBtnStyle: (completeCount === 0 ? 'hidden' : '')
				});
				// update toggle-all checked status
				$('#toggle-all').prop('checked', completeCount === count);
			},
			// filter handler
			filters: {
				'#/': function(item) {
					return true;
				},
				'#/active': function(item) {
					return !item.model.get('complete');
				},
				'#/completed': function(item) {
					return item.model.get('complete');
				}
			},
			applyFilter: function(hash) {
				var filter = this.filters[hash];
				this.each(function(id, item) {
					if ( filter(item) ) {
						item.setStatus(item.model.get('complete') ? 'complete' : '');
					} else {
						item.setStatus('hidden');
					}
				});
			}
		}).persist();
		$$.document.prepend(app);

		// load from localStorage
		app.gather(todoitem, 'append', '#todo-list').updateStatus();

		// manual routing  (not supported by agilityjs)
		$(window).on('hashchange', function() {
			var hash = location.hash;
			app.applyFilter(hash);
			$('#filters a').each(function() {
				if ( hash === $(this).attr('href') ) {
					$(this).addClass('selected');
				} else {
					$(this).removeClass('selected');
				}
			});
		});
		if ( location.hash ) {
			$(window).trigger('hashchange');
		}
	});

})(window.jQuery, window.agility);
