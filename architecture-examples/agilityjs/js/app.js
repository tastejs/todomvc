(function ($, $$) {
	'use strict';

	var ENTER_KEY = 13;

	// hack of taking out html elements from DOM so that agility's view can use it
	// we need 'outerhtml' also, as agilityjs will append DOM, so removing it
	var drawHtml = function (selector) {
		return $(selector).remove().wrap('<div>').parent().html();
	};

	// simple Two layer composition:
	// individual 'todoitem' and 'app' which holds multiple todoitems
	$(function () {
		// todo item
		var todoitem = $$({
			model: {
				title: '',
				completed: false
			},
			view: {
				format: drawHtml('#todo-list li'),
				style: '.hidden { display: none }'
			},
			controller: {
				'change:completed': function () {
					this.view.$().toggleClass('completed', this.model.get('completed'));
					app.updateStatus();
				},
				'dblclick &': function () {
					this.view.$().addClass('editing');
					this.view.$('.edit').focus();
				},
				'click .destroy': function () {
					this.destroy();
				},
				'create': function () {
					this.view.$().toggleClass('completed', this.model.get('completed'));
				},
				'change': function () {
					this.save();
				},
				'destroy': function () {
					this.erase();
				},
				'blur input': function () {
					this.updateTitle();
				},
				'keyup input': function () {
					if (event.which === ENTER_KEY) {
						this.updateTitle();
					}
				}
			},
			updateTitle: function () {
				var title = this.model.get('title').trim();

				this.view.$().removeClass('editing');

				if (title) {
					this.model.set({
						title: title
					});
				} else {
					this.destroy();
				}
			}
		}).persist($$.adapter.localStorage, {
			collection: 'todos-agilityjs'
		});

		// the main application which holds todo items
		var app = $$({
			model: {
				todoCount: '0',
				pluralizer: '',
				completedCount: '0',
				newtitle: '',
				mainStyle: '',
				clearBtnStyle: ''
			},
			view: {
				format: drawHtml('#todoapp'),
				style: '.hidden { display: none }'
			},
			controller: {
				'remove': function () {
					this.updateStatus();
				},
				'append': function () {
					this.updateStatus();
				},
				'keyup #new-todo': function (e) {
					var title = $('#new-todo').val().trim();
					if (e.which === ENTER_KEY && title) {
						var item = $$(todoitem, {
							title: title
						}).save();
						this.append(item, '#todo-list');
						e.target.value = '';  // clear input field
					}
				},
				'click #toggle-all': function () {
					var ischecked = this.view.$('#toggle-all').prop('checked');
					this.each(function (id, item) {
						item.model.set({
							completed: ischecked
						});
					});
				},
				'click #clear-completed': function () {
					this.each(function (id, item) {
						if (item.model.get('completed')) {
							item.destroy();
						}
					});
				}
			},
			// utility functions
			updateStatus: function () {
				// update counts
				var count = this.size();
				var completedCount = 0;

				this.each(function (id, item) {
					if (item.model.get('completed')) {
						completedCount++;
					}
				});

				this.model.set({
					todoCount: count - completedCount + '',
					pluralizer: count - completedCount === 1 ? '' : 's',
					completedCount: completedCount + '',
					mainStyle: count === 0 ? 'hidden' : '',
					clearBtnStyle: completedCount === 0 ? 'hidden' : ''
				});

				// update toggle-all checked status
				$('#toggle-all').prop('checked', completedCount === count);
				// update the view according to the current filter.
				this.applyFilter();
			},
			// filter handler
			filters: {
				'#/': function () {
					return true;
				},
				'#/active': function (item) {
					return !item.model.get('completed');
				},
				'#/completed': function (item) {
					return item.model.get('completed');
				}
			},
			applyFilter: function (hash) {
				var isVisible = this.filters[hash || location.hash];
				if (isVisible) {
					this.each(function (id, item) {
						item.view.$().toggleClass('hidden', !isVisible(item));
					});
				}
			}
		}).persist();

		$$.document.prepend(app);

		// load from localStorage
		app.gather(todoitem, 'append', '#todo-list').updateStatus();

		// manual routing (not supported by agilityjs)
		$(window).on('hashchange', function () {
			var hash = location.hash;
			app.applyFilter(hash);
			$('#filters a').each(function () {
				$(this).toggleClass('selected', hash === $(this).attr('href'));
			});
		});

		if (location.hash) {
			$(window).trigger('hashchange');
		}
	});
})(window.jQuery, window.agility);
