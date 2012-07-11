// Server-side Code

// Note: In this ultra-simple example we are simply storing the TODO list in memory and
// broadcasting the entire list to all connected clients when a change is made.
//
// Obviously in the real world this would soon cause bandwidth and concurrency problems 
// so some form of atomic editing or Operational Transform should be used instead.


// Store TODO items in memory
var todos = [];

// Define actions which can be called from the client using ss.rpc('demo.ACTIONNAME', param1, param2...)
exports.actions = function(req, res, ss) {

  // Easily debug incoming requests here
  // console.log(req.params);

  return {

    // Return a list of all TODOs
    getAll: function() {
      res(todos);
    },

    // Replace the list of TODOs with a new list
    update: function(newTodos) {
      todos = newTodos;
      ss.publish.all('updateTodos', todos);
      res(true);
    }

  };
};