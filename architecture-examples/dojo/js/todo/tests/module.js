define([
	"doh",
	"./ctrl/TodoListRefController",
	"./model/SimpleTodoModel"
], function(doh){
	var userArgs = window.location.search.replace(/[\?&](dojoUrl|testUrl|testModule)=[^&]*/g, "").replace(/^&/, "?");
	doh.registerUrl("todo.tests.app18", require.toUrl("todo/tests/app18.html") + userArgs, 999999);
});
