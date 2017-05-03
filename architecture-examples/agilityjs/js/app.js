/*

[MIT licensed](http://en.wikipedia.org/wiki/MIT_License)
(c) [Toshihide Shimayama](http://github.com/tshm/todomvc/)

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

// two layer composition:
// individual todoitem and application which holds multiple todoitems.
(function() {
	// todo item
	var todoitem = $$({
		model: {done: false}, 
		view: {format: drawHtml('#todo-list li')},
		controller: {
			'change:done': function() {
				this.model.set({mode: (this.model.get("done") ? "done" : "")});
				app.updateCounter();
			},
			'click label': function() {this.view.$('input.toggle').click();},
			'dblclick label': function() {
				this.model.set({mode: "editing"});
				this.view.$('input').select();
			},
			'click a': function() { this.destroy(); },
			'change input.edit': function() {this.model.set({mode: ""})}
		}
	});

	// The main application which holds todo items.
	var app = $$({
		model: {count:0, doneCount:0, toggleAll:false, mainStyle:"", clearControlStyle:""},
		view: {format: drawHtml('#todoapp')},
		controller: {
			'remove': function() { app.updateCounter(); },
			'keyup #new-todo': function(e) {
				if (13 != e.which) return;
				this.append($$(todoitem, {title: this.model.get("newtitle")}), 'ul');
				this.updateCounter();
				$(e.target).val("");
			},
			'change:toggleAll': function() {
				var checked = this.model.get('toggleAll');
				this.each(function(id,item) { item.model.set({done: checked}); });
			},
			'click #clear-completed': function() {
				this.each(function(id,item) {
					if (item.model.get('done')) item.destroy();
					app.updateCounter();
				});
			},
		},
		updateCounter: function() {
			var count = this.size();
			var doneCount = 0;
			this.each(function(id,item) {
				if (item.model.get('done')) doneCount++;
			});
			this.model.set({
				count: count,
				doneCount: doneCount,
				mainStyle: (0 < count ? "display:block" : "display:none"),
				clearControlStyle: (0 < doneCount ? "display:block" : "display:none")
			});
		},
	});
	$$.document.prepend(app);
})();
