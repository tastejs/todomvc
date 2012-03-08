/*

[MIT licensed](http://en.wikipedia.org/wiki/MIT_License)
(c) [You](http://addyosmani.github.com/todomvc/)

*/

// Hack of taking out html elements from DOM so that agility's view can use it.
var drawHtml = function(selector) {
	// we need 'outerhtml' also, as agilityjs will append DOM so removing it.
	var html = $(selector).remove().wrap('<div>').parent().html();
	if (!html) {
		console.log("failed extracting: " + selector);
	}
	return html;
};

(function() {
	var input = $$({}, drawHtml('header'));
	var todoitem = $$({done: false}, drawHtml('#todo-list li'), {
		'change:done': function() {
			this.model.set({mode: (this.model.get("done") ? "done" : "")});
			app.updateCounter();
		},
		'click label': function() {this.view.$('input.toggle').click();},
		'dblclick label': function() {this.model.set({mode: "editing"})},
		'click a': function() {this.destroy();},
	});
	var todolist = $$({}, drawHtml('#todo-list'), {
		'append': function() {app.updateCounter()},
		'remove': function() {app.updateCounter()},
	});
	var main = $$({toggleAll: false}, drawHtml('#main'), {
		'change:toggleAll': function() {
			var checked = this.model.get('toggleAll');
			todolist.each(function(id,item) { item.model.set({done: checked}); });
		},
	}).append(todolist);
	var footer = $$({}, drawHtml('footer'), {
		'click #clear-completed': function() {
			console.log('cccc');
			todolist.each(function(id,item) {
				if (item.model.get('done')) item.destroy();
			});
		},
		'change:count': function() {
			if (this.model.get('count') > 0) {
				this.view.$('').show();
			} else {
				this.view.$('').hide();
			}
		},
	});
	// The main application object handles the cross-object binding.
	var app = $$({
		model: {},
		view: {format: drawHtml('#todoapp')},
		controller: {
			'change #new-todo': function() {
				var newtodo_name = input.model.get("name");
				console.log("new-todo: " + input.model.get("name"));
				var newitem = $$(todoitem, {name: newtodo_name});
				todolist.append(newitem);
			}
		},
		updateCounter: function() {
			var totalCount = todolist.size();
			var doneCount = 0;
			todolist.each(function(id,item) {
				if (item.model.get('done')) doneCount++;
			});
			console.log([totalCount, doneCount]);
			//
			footer.model.set({count: totalCount});
			if (0 < totalCount) {
				$('#main').show();
			} else {
				$('#main').hide();
			}
			if (0 < doneCount) {
				$('#clear-completed').show();
			} else {
				$('#clear-completed').hide();
			}
		},
	}).append(input).append(main).append(footer);
	$$.document.prepend(app);
})();
