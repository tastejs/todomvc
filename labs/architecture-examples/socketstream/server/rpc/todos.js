// Server-side code

// All the todos are stored in an in-memory array on the server
// This should not be done in production apps
var todos = [];

// Define actions which can be called from the client using
// ss.rpc('demo.ACTIONNAME', param1, param2...)
exports.actions = function(req, res, ss) {
	return {
		getAll: function () {
			res(todos);
		},
		update: function (clientTodos) {
			todos = clientTodos;
			ss.publish.all('updateTodos', todos);
		}
	};
};
