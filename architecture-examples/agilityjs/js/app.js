/*

[MIT licensed](http://en.wikipedia.org/wiki/MIT_License)
(c) [Toshihide Shimayama](http://github.com/tshm/todomvc/)

*/
(function($, $$, console) {  "use strict";
	// Hack of taking out html elements from DOM so that agility's view can use it.
	var drawHtml = function(selector) {
		// we need 'outerhtml' also, as agilityjs will append DOM, so removing it.
		var html = $(selector).remove().wrap('<div>').parent().html();
		if (!html) {
			console.log("failed extracting: " + selector);
		}
		return html;
	};

	// Simple Two layer composition:
	// individual 'todoitem' and 'app'lication which holds multiple todoitems.
	$(function() {
		// remove example item already given in the template
		var $sampleTodo = $('#todo-list li.complete').remove();

		// todo item
		var todoitem = $$({
			model: {complete: false},
			view: {format: drawHtml('#todo-list li'), style: '.hidden {display: none;}'},
			controller: {
				'change:complete': function(e,o) {
					var complete = this.model.get("complete");
					this.setStatus(complete ? "complete" : "");
					console.info('status changed: complete = ', complete);
					app.updateCounter();
				},
				'dblclick label': function() {
					this.setStatus("editing");
					this.view.$('input').select();
				},
				'click .destroy': function() { this.destroy(); },
				'change .edit': function() { this.setStatus(""); }
			},
			// utility functions
			setStatus: function(status) { this.model.set({status: status}); }
		});

		// The main application which holds todo items.
		var app = $$({
			model: {completeCount:"0", todoCount:"0",
				toggleAll:false, mainStyle:"", clearBtnStyle:""},
			view: {format: drawHtml('#todoapp'), style: ".hidden {display: none;}"},
			controller: {
				'remove': function() { app.updateCounter(); },
				'keyup #new-todo': function(e) {
					if (13 !== e.which) { return; }
					this.addTodoItem({title: this.model.get("newtitle")});
					$(e.target).val("");  // clear input field
				},
				'change:toggleAll': function() {
					var ischecked = this.model.get('toggleAll');
					console.log('toggleAll clicked: ', ischecked);
					this.each(function(id,item) { item.model.set({complete: ischecked}); });
				},
				'click #clear-completed': function() {
					console.log('clear completed called');
					this.each(function(id,item) {
						if (item.model.get('complete')) { item.destroy(); }
						app.updateCounter();
					});
				}
			},
			// utility functions
			addTodoItem: function(data) {
				console.info('new item added: ', data);
				this.append($$(todoitem, data), '#todo-list');
				this.updateCounter();
			},
			updateCounter: function() {
				var count = this.size();
				var completeCount = 0;
				this.each(function(id,item) {
					if (item.model.get('complete')) { completeCount++; }
				});
				console.log('#[total, complete] = ', [count, completeCount]);
				this.model.set({
					completeCount: String(completeCount),
					todoCount: String(count - completeCount),
					mainStyle: (0 < count ? "" : "hidden"),
					clearBtnStyle: (0 < completeCount ? "" : "hidden")
				});
			},
			// filter handler
			filters: {
				"#/":          function(item) { return true; },
				"#/active":    function(item) { return !item.model.get('complete'); },
				"#/completed": function(item) { return item.model.get('complete'); }
			},
			applyFilter: function(hash) {
				var filter = this.filters[hash];
				this.each(function(id,item) {
					if (filter(item)) {
						item.setStatus(item.model.get('complete') ? 'complete' : '');
					} else {
						item.setStatus('hidden');
					}
				});
			}
		});
		$$.document.prepend(app);

		// re-add sample todo item as a agility object.
		var title = $sampleTodo.find('label').text();
		app.addTodoItem({title: title, complete: true});

		// manual routing  (not supported by agilityjs)
		$(window).on('hashchange', function() {
			var hash = location.hash;
			app.applyFilter(hash);
			$('#filters a').each(function() {
				if (hash === $(this).attr('href')) {
					$(this).addClass('selected');
				} else {
					$(this).removeClass('selected');
				}
			});
		});
		if (location.hash) { $(window).trigger('hashchange'); }
	});
})(window.jQuery, window.agility, window.console);
