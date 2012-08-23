define([
	"doh",
	"dojo/json",
	"dojox/mvc/at",
	"../../ctrl/TodoListRefController",
	"../../ctrl/TodoRefController",
	"../../model/SimpleTodoModel",
	"../../store/LocalStorage"
], function(doh, json, at, TodoListRefController, TodoRefController, SimpleTodoModel, LocalStorage){
	doh.register("todo.tests.ctrl.TodoListRefController", [
		function empty(){
			localStorage.removeItem("todos-dojo");

			var ctrl = new TodoRefController({
				defaultId: "todos-dojo",
				modelClass: SimpleTodoModel,
				store: new LocalStorage()
			}), listCtrl = new TodoListRefController({
				model: at(ctrl, "todos")
			});

			doh.is(0, ctrl.get("complete"), "The current count of completed todo items should be 0");
			doh.is(0, ctrl.get("incomplete"), "The current count of incomplete todo items should be 0");
			doh.is(0, listCtrl.get("length"), "The current length should be 0");

			listCtrl.model.push({title: "Task0", completed: false});
			doh.is(0, ctrl.get("complete"), "The current count of completed todo items should be 0");
			doh.is(1, ctrl.get("incomplete"), "The current count of incomplete todo items should be 1");
			doh.is(1, listCtrl.get("length"), "The current length should be 1");
		},
		function existing(){
			localStorage.setItem("todos-dojo", json.stringify({
				id: "todos-dojo",
				todos : [
					{title: "Task0", completed: false},
					{title: "Task1", completed: true},
					{title: "Task2", completed: false}
				],
				incomplete: 2,
				complete: 1
			}));

			var ctrl = new TodoRefController({
				defaultId: "todos-dojo",
				modelClass: SimpleTodoModel,
				store: new LocalStorage()
			}), listCtrl = new TodoListRefController({
				model: at(ctrl, "todos")
			});

			doh.is(1, ctrl.get("complete"), "The current count of completed todo items should be 1");
			doh.is(2, ctrl.get("incomplete"), "The current count of incomplete todo items should be 2");
			doh.is(3, listCtrl.get("length"), "The current length should be 3");
		}
	]);
});