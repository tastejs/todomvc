// Server-side Code
var todosServer = [];
// Define actions which can be called from the client using ss.rpc('demo.ACTIONNAME', param1, param2...)
exports.actions = function(req, res, ss) {

  // Easily debug incoming requests here
  console.log(req);
  // Example of pre-loading sessions into req.session using internal middleware
  req.use('session');

  // Uncomment line below to use the middleware defined in server/middleware/example
  //req.use('example.authenticated')
  return {

    GetTodos: function() {
      ss.publish.broadcast('sendTodos', req.socketId);
    },

    AnswersOnSendTodos: function(todos, socketId) {
      if(req.socketId !== socketId){
        ss.publish.socketId(socketId, 'updateList', todos);
      }
    },

    BroadcastTodos: function(todos) {
      ss.publish.broadcast('updateList', todos);
    }
  };
};