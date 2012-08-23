define([
	"doh",
	"dojo/Stateful",
	"../../model/SimpleTodoModel"
], function(doh, Stateful, SimpleTodoModel){
	doh.register("todo.tests.model.SimpleTodoModel", [
		function basic(){
			var model = new SimpleTodoModel({
				id: "todos-dojo",
				todos : [
					{title: "Task0", completed: false},
					{title: "Task1", completed: true},
					{title: "Task2", completed: false}
				],
				incomplete: 2,
				complete: 1
			});

			model.todos.push(new Stateful({title: "Task3", completed: true}), new Stateful({title: "Task4", completed: false}));
			doh.is(2, model.complete, "We should have two complete tasks");
			doh.is(3, model.incomplete, "We should have three incomplete tasks");

			model.todos.push(new Stateful({title: "Task5", completed: false}));
			doh.is(2, model.complete, "We should have two complete tasks");
			doh.is(4, model.incomplete, "We should have four incomplete tasks");

			model.todos[4].set("completed", true);
			doh.is(3, model.complete, "We should have three complete tasks");
			doh.is(3, model.incomplete, "We should have three incomplete tasks");

			model.todos.splice(4, 1);
			doh.is(2, model.complete, "We should have two complete tasks");
			doh.is(3, model.incomplete, "We should have three incomplete tasks");
		}
	]);
});