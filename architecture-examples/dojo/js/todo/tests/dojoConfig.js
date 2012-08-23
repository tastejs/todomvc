(function(require){
	require.baseUrl = "../../dojo";
	require.packages = (require.packages || []).concat([{
		name: "todo",
		location: "../todomvc/architecture-examples/dojo/js/todo"
	}]);
})(require);
