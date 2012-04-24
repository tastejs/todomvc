// The whole application is described in this module
// But we can imagine defining parts of it separately and creating a bigger UI
// that would include them. We'd have reusable code.
// A bit overkill here
require(["Olives/LocalStore", "Olives/OObject", "Olives/Model-plugin", "Olives/Event-plugin"],

function (Store, OObject, ModelPlugin, EventPlugin) {
	// The Todo App constructor
	function TodosConstructor() {

		 // A store to save the statistics
		var stats = new Store({
			nbItems: 0,
			uncompleted: 0,
			completed: 0,
			completedWord: "item",
			uncompletedWord: "item",
			allChecked: false
		}),
		
		// Used for toggling a class according to a value's truthiness
		// It will be added to both ModelPlugins
		toggleClass = function (value, className) {
			value ? this.classList.add(className) : this.classList.remove(className);
		};

		// Synchronize the store with localStorage
		stats.sync("olives-todos-stats");

		stats.watchValue("allChecked", function (checked) {
			// I wish I could simply do this.model.alter("map", func) but
			// Emily's Store can't notice a change in a property of an item when using
			// native functions. (map/filter/foreach...)
			// Until I find a solution, I need to explicitly set the new value
			this.model.loop(function (value, idx) {
				value.completed = checked;
				this.model.set(idx, value);
			}, this);
		}, this);
	
		// Add a task
		this.add = function (event, node) {
			if (event.keyCode == 13) {
				this.model.alter("push", {
					name: node.value,
					completed: false,
					edit: false
				});
				node.value = "";
			}
		};

		// Toggle Edit on click in view mode
		this.edit = function (event, node) {
			if (event.type == "dblclick" || event.type == "blur" || event.keyCode == 13) {
				// Don't know atm if model_id should be public API.
				var item = this.model.get(node.dataset["model_id"]);
				item.edit = !item.edit;
				item.edit && node.focus();
				// Thanks to double way binding, this line shouldn't be necessary.
				// Though, keydown "enter" is fired before change, so double way binding doesn't work.
				// Don't know how to fix this yet.
				item.name = node.value || item.name;
				this.model.set(node.dataset["model_id"], item);
			}
		};
		
		this.remove = function (event, node) {
			this.model.del(node.dataset["model_id"]);
		};
		
		// Clear all completed tasks
		this.clear = function () {
			this.model.delAll(this.getCompleted());
		};

		// Updates the statistics store that will also update the view
		this.updateStats = function () {
			var completed = this.getCompleted().length,
				nbItems = this.model.getNbItems(),
				uncompleted = nbItems - completed;
			
			stats.set("nbItems", nbItems);
			
			stats.set("completed", completed)
			stats.set("completedWord", completed > 1 ? "items" : "item");
			
			stats.set("uncompleted", uncompleted);
			stats.set("uncompletedWord", uncompleted > 1 ? "items" : "item");
		};
		
		// Returns the completed tasks
		this.getCompleted = function () {
			var completed = [];
			this.model.loop(function (value, idx) {
				if (value.completed) {
					completed.push(idx);
				}
			});
			return completed;
		};
		
		// Watch for add/del/update to update the statistics
		this.model.watch("added", this.updateStats, this);
		this.model.watch("deleted", this.updateStats, this);
		this.model.watch("updated", this.updateStats, this);
		
		// Synchronize the store with localStorage
		this.model.sync("olives-todos-tasks");
		
		// Add the plugins.
		this.plugins.addAll({
			// ModelPlugin binds dom nodes with the model. The plumbing.
			"stats": new ModelPlugin(stats, {
				toggleClass: toggleClass
			}),
			"model": new ModelPlugin(this.model, {
				// It's need here too
				toggleClass: toggleClass
			}),
			"event": new EventPlugin(this)
		});
	}

	
	// Make the application inherit from OObject
	// The OObject brings up a statemachine, a store, and some UI logic
	TodosConstructor.prototype = new OObject(new Store([]));
	// Apply the plugins to #todoapp
	(new TodosConstructor).alive(document.querySelector("#todoapp"));


});