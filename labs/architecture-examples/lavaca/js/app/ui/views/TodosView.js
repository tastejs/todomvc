(function(ns, $, View) {

var _ENTER_KEY = 13;

/**
 * @class app.ui.TodoView
 * @super app.ui.BaseView
 * A view that can be touch-scrolled
 */
ns.TodosView = View.extend(function() {
	View.apply(this, arguments);
	// A Map of events delegated to this.el onRenderSuccess
	this.mapEvent({
		'#new-todo': {
			keypress: $.proxy(this.onKeypress, this)
		},
		'#toggle-all': {
			tap: $.proxy(this.onTapToggleAll, this)
		},
		'#todo-list li': {
			dblclick: $.proxy(this.onToggleEdit, this),
			swipe: $.proxy(this.onToggleEdit, this)
		},
		'#todo-list li input[type=checkbox]': {
			tap: $.proxy(this.toggleCompleted, this)
		},
		'.edit': {
			keypress: $.proxy(this.onKeypress, this),
			blur: $.proxy(this.onBlurEdit, this)
		},
		'.destroy': {
			tap: $.proxy(this.onTapDestroy, this)
		},
		'#clear-completed': {
			tap: $.proxy(this.onTapClearCompleted, this)
		}
	});
	// Model events
	this.model
		.on('addItem', $.proxy(this.onAddItem, this))
		.on('removeItem', $.proxy(this.onRemoveItem, this))
		.on('changeItem', $.proxy(this.onChangeItem, this))
		.on('change', 'filter', $.proxy(this.onChangeFilter, this))
		.on('markAll', $.proxy(this.onMarkAll, this));
		// Handler attached to app.state model lang attribute
	app.state
		.on('change', 'lang', $.proxy(this.onChangeLang, this));
}, {
	/**
	* @field {String} template
	* @default 'todos'
	* The name of the template used by the view
	*/
	template: 'todos',
	/**
	* @field {String} className
	* @default 'todos'
	* A class name added to the view container
	*/
	className: 'todos',
	/**
	* @method toggleCompleted
	* Toggles the todo completed
	* @param {Object} e  The click event
	*/
	toggleCompleted: function(e) {
		var checkbox = $(e.currentTarget),
			li = checkbox.parents('li').first(),
			cid = li.attr('data-cid'),
			completed = li.hasClass('completed');
		// Executes a route with the id of the todo to mark with a completed status
		app.router.exec('/todo/mark/' + cid, null, {completed: !completed});
	},
	/**
	* @method toggleAllCompleted
	* Toggles the All Completed checkbox
	* @param {boolean} value  Determines state of toogle all button
	*/
	toggleAllCompleted: function(value) {
		this.el.find('#toggle-all').prop('checked', value);
	},
	/**
	* @method onToggleEdit
	* Toggles the edit mode
	* @param {Object} e  The click event
	*/
	onToggleEdit: function(e) {
		var elem = $(e.currentTarget);
			li = elem.is('li') ? elem : elem.parents('li').first(),
		input = li.find('.edit');  
		li.toggleClass('editing');
		if (li.hasClass('editing')) {
			input.focus();
		}
	},
	/**
	* @method onAddItem
	* Redraws the template when a new todo is added
	* @param {Object} e  The click event
	*/
	onAddItem: function(e) {
		this.redraw();
		this.el.find('#new-todo').focus();
	},
	/**
	* @method onRemoveItem
	* Removes a todo from the list and updates the footer 
	* @param {Object} e  The click event
	*/
	onRemoveItem: function(e) {
		// If the last todo was removed, redraw the whole template
		if (!this.model.get('filteredItems').length) {
			this.redraw();
			return;
		}
		this.el.find('#todo-list li[data-cid="' + e.model.get('id') +'"]').remove();
		this.redraw('#footer');
	},
	/**
	* @method onChangeItem
	* Updates the template with the changed model 
	* @param {Object} e  The model event
	*/
	onChangeItem: function(e) {
		var selector = '#todo-list li[data-cid="' + e.model.get('id') +'"]',
			value = false;
		this.redraw(false)
			.then(function(html) {
				var oldLi = this.el.find(selector),
					oldFooter = this.el.find('#footer'),
					li = $(html).find(selector),
					footer = $(html).filter('#footer');
				oldLi.replaceWith(li);
				oldFooter.replaceWith(footer);
			});
		// Updates all completed toggle
		if (this.model.isAllCompleted()) {
		  value = true;
		}
		this.toggleAllCompleted(value);
	},
	/**
	* @method onBlurEdit
	* Executes a route to update an existing todo 
	* @param {Object} e  The blur event
	*/
	onBlurEdit: function(e) {
		var self = this,
			input = $(e.currentTarget),
			li = input.parents('li').first(),
			cid = li.attr('data-cid'),
			title = input.val();
		app.router.exec('/todo/edit/' + cid, null, {title: title})
			.then(function() {
				self.onToggleEdit(e);
			});
	},
	/**
	* @method onKeypress
	* Adds or updates a todo to the collections
	* @param {Object} e  The keypress event
	*/
	onKeypress: function(e) {
		if (e.keyCode == _ENTER_KEY) {
			var input = $(e.currentTarget),
				isEditInput = input.hasClass('edit'),
				action = 'add',
				title = input.val(),
				cid;
			if (isEditInput) {
				input.blur();
			} else {
				app.router.exec('/todo/add', null, {title: title})
				.then(function() {
					input.val('');
				});
			}
		}
	},
	/**
	* @method onTapToggleAll
	* Executes a route to mark all todos
	* @param {Object} e  The tap event
	*/
	onTapToggleAll: function(e) {
		var isChecked = $(e.currentTarget).attr('checked');
		app.router.exec('/todo/mark-all', null, {completed: !!isChecked});
	},
	/**
	* @method onTapDestroy
	* Executes a route to remove a todo
	* @param {Object} e  The tap event
	*/
	onTapDestroy: function(e) {
		var li = $(e.currentTarget).parents('li').first(),
			cid = li.attr('data-cid');
		app.router.exec('/todo/remove/' + cid);
	},
	/**
	* @method onTapClearCompleted
	* Executes a route to clear all completed todos
	* @param {Object} e  The tap event
	*/
	onTapClearCompleted: function(e) {
		app.router.exec('/todo/clear-completed');
	},
	/**
	* @method onChangeFilter
	* Redraws the template on filter change
	* @param {Object} e  The model event
	*/
	onChangeFilter: function(e) {
		this.redraw();
	},
	/**
	* @method onChangeLang
	* Redraws the template on language change
	* @param {Object} e  The model event
	*/
	onChangeLang: function(e) {
		this.redraw();
	},
	/**
	* @method onMarkAll
	* Redraws the todo list and footer on mark all
	* @param {Object} e  The tap event
	*/
	onMarkAll: function(e) {
		this.redraw('#todo-list, #footer');
	}
});

})(Lavaca.resolve('app.ui.views', true), Lavaca.$, Lavaca.mvc.View);