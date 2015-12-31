//
// TodoMVC - Haxe + Mithril + DCI
//
// Also following the original MVC practices described in
// https://github.com/ciscoheat/mithril-hx/wiki/Rediscovering-MVC
//

// The DCI library
import haxedci.Context;

// The Mithril library
import mithril.M;

// Import the whole HTML namespace for convenience.
import js.html.*;

// The "using" keyword acts like an extension of
// the compatible types. For example, when using
// StringTools, you can then use methods like "trim"
// on a string directly, instead of a static call.
//
// StringTools.trim(s) -> s.trim()
//
using StringTools;

// Lambda expression library: 
// https://github.com/ciscoheat/slambda
using Slambda;

///////////////////////////////////////////////////////////

// Controller+View
class TodoMVC implements Mithril
{
	// Program entrypoint
	static function main() 
		new TodoMVC().start();

	public static var ENTER_KEY = 13;
	public static var ESC_KEY = 27;

	// The responsibilily of the Controller is to create and
	// manage Views, so it will create the following View objects:
	var items : TodoItems;
	var header : Header;
	var todoList : TodoList;
	var footer : Footer;

	public function new() {
		items = new TodoItems();
		header = new Header(items);
		todoList = new TodoList(items);
		footer = new Footer(items);
	}

	// Start the app with Mithril's route method.
	// Also configuring two simple routes here.
	public function start() {
		M.route(js.Browser.document.querySelector(".todoapp"), "/", {
			"/": this,
			"/:filter": this
		});
	}
	
	// The Mithril view function. Returns a representation of the 
	// DOM tree that will be diffed and displayed in the browser.
	//
	// Methods in Haxe can be specified with only a single 
	// expression (without {}), for example here when returning 
	// an array directly.
	//
	// Also, when using the Mithril library, there is no need to
	// add "return" to the view method. This makes the view templates
	// very compact.
	public function view() [
		header,
		items.count() > 0 ? todoList : null,
		items.count() > 0 ? footer : null
	];
}

///////////////////////////////////////////////////////////

// Model+View
// Also a DCI Context
class Header implements Mithril implements Context
{
	// A DCI Role
	@role var items : {
		// The DCI RoleObjectContract, ie. what is required 
		// for the object to play this Role
		function add(title : String) : Void;
		function save() : Void;
	};

	// Another Role, the input field for creating new Todo items.
	@role var inputField : { 
		// A simple Contract, it requires only a string value.
		value: String 
	} = {
		// This is a DCI RoleMethod, representing the Role functionality.
		// It is automatically attached to the object playing this Role 
		// when inside the Context.
		function input(e : KeyboardEvent) {
			var field : InputElement = cast e.target;
			// Use "self" to access the current Role
			self.value = field.value;

			if (e.keyCode == TodoMVC.ENTER_KEY && self.value.trim().length > 0) {
				// Communicating with another Role. We can now see how the objects
				// interact. With DCI, system behavior is a first-class citizen.
				items.add(self.value.trim());
				items.save();
				self.value = "";
			}
		}
	}

	public function new(items) {
		// Binding the objects to the Roles is done through a normal assignment.
		this.items = items;
		this.inputField = {value: ""};
	}

	public function view() {
		HEADER([
			H1("todos"),
			INPUT.new-todo({
				config: function(el, isInit) if (!isInit) el.focus(),
				placeholder: "What needs to be done?",
				onkeyup: inputField.input,
				value: inputField.value
			})
		]);
	}
}

///////////////////////////////////////////////////////////

// Model+View
class TodoList implements Mithril implements Context
{
	@role var editor : { 
		item: TodoItem, 
		value: String 
	} = {
		function edit(i : TodoItem) {
			self.item = i;
			self.value = i.title;
		}

		function input(e : KeyboardEvent) {
			switch(e.keyCode) {
				case TodoMVC.ENTER_KEY:
					if(self.value.length == 0) 
						self.deleteItem();
					else if(self.value.trim().length > 0) 
						self.saveText();
				case TodoMVC.ESC_KEY:
					self.stopEditing();
				case _: 
					var field : InputElement = cast e.target;
					self.value = field.value;
			}
		}

		function stopEditing()
			self.item = null;

		function deleteItem() {
			items.remove(self.item);
			items.save();
			self.stopEditing();
		}

		function saveText() {
			if (self.item == null) return;
			self.item.title = self.value.trim();
			items.save();
			self.stopEditing();
		}
	}

	@role var items : {
		function save() : Void;
		function remove(item : TodoItem) : Bool;
		function iterator() : Iterator<TodoItem>;
	} = {
		function filtered() : Iterable<TodoItem> {
			return switch(M.routeParam("filter")) {
				case "active": self.filter.fn(!_.completed);
				case "completed": self.filter.fn(_.completed);
				case _: self;
			}
		}

		function isAllCompleted() : Bool
			return !self.exists.fn(!_.completed);

		function destroy(i : TodoItem) {
			self.remove(i);
			self.save();
		}

		function toggle(i : TodoItem) {
			i.completed = !i.completed;
			self.save();
		}

		function toggleFiltered(e) {
			for(item in self.filtered()) {
				item.completed = e.target.checked;
			}
			self.save();
		}
	}

	public function new(items) {
		this.items = items;
		this.editor = {item: null, value: ""};
	}

	public function view() {
		SECTION.main([
			INPUT.toggle-all[type=checkbox]({
				checked: items.isAllCompleted(),
				onclick: items.toggleFiltered
			}),
			LABEL({"for": "toggle-all"}, "Mark all as complete"),
			UL.todo-list(items.filtered().map(function(i) {
				LI({
					key: i.id, 
					'class': (i.completed ? "completed " : "") + 
							 (editor.item == i ? "editing" : "")
					}, [
					DIV.view([
						INPUT.toggle[type=checkbox]({
							checked: i.completed,
							// "bind" is a convenient way of binding 
							// variables to callbacks:
							onclick: items.toggle.bind(i)
						}),
						LABEL({
							ondblclick: editor.edit.bind(i)
						}, i.title),
						BUTTON.destroy({
							onclick: items.destroy.bind(i)
						})
					]),
					INPUT.edit({
						config: function(el) if (editor.item == i) el.focus(),
						value: editor.value,
						onkeyup: editor.input,
						onblur: editor.saveText
					})
				]);
			}))
		]);
	}
}

///////////////////////////////////////////////////////////

// View
class Footer implements Mithril implements Context
{
	@role var items : {
		function save() : Void;
		function remove(item : TodoItem) : Bool;
		function iterator() : Iterator<TodoItem>;
	} = {
		function pluralizeItemWord() : String
			return self.notCompleteCount() == 1 ? "item" : "items";

		function notCompleteCount() : Int
			return self.count.fn(!_.completed);

		function completeCount() : Int
			return self.count.fn(_.completed);

		function clearCompleted() {
			for(item in self.filter.fn(_.completed))
				self.remove(item);
			self.save();
		}
	}

	public function new(items) {
		this.items = items;
	}

	public function view() {
		var filter = M.routeParam("filter");
		FOOTER.footer([
			SPAN.todo-count(
				STRONG(items.notCompleteCount()), 
				' ' + items.pluralizeItemWord() + ' left'
			),
			UL.filters([
				LI(A[href="/"]({
					config: M.route,
					'class': filter == null ? "selected" : ""
				}, "All")),
				LI(A[href="/active"]({
					config: M.route,
					'class': filter == "active" ? "selected" : ""
				}, "Active")),
				LI(A[href="/completed"]({
					config: M.route,
					'class': filter == "completed" ? "selected" : ""
				}, "Completed"))
			]),
			items.completeCount() == 0 ? null : BUTTON.clear-completed({
				onclick: items.clearCompleted
			}, "Clear completed")
		]);
	}
}
