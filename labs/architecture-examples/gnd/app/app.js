define(['gnd', 'models/todo', 'models/todoList', 'ctrls/todoListCtrl'],
function(Gnd, Todo, TodoList, TodoListCtrl){
'use strict';

//
// Create Local and Remote storages
//
var localStorage = new Gnd.Storage.Local();

//
// Configure the synchronization queue.
//
Gnd.use.storageQueue(localStorage);//, remoteStorage);

var app = new Gnd.Base();

//
// Lets get all the todo lists available (should be max one)
// We wait until we get the whole collection since we need to check its count.
//
TodoList.find().then(function(todoLists){
  
  if(todoLists.count == 0){
    //
    // we have no todo lists yet, so lets create the one (the only one).
    //
    todoLists.add(new TodoList());
  }

  //
  // Pick the first element, which will be our todo list
  //
  var todoList = todoLists.first();
  todoList.keepSynced(); // autosync(enable = true)

  function setFilter(all, active, completed) {
    app.set('filterAll', all);
    app.set('filterActive', active);
    app.set('filterCompleted', completed);
  }
  
  setFilter(true, false, false);

  //
  // Bind the App model (only used for keeping the filter links updated)
  // 
  var filtersViewModel = new Gnd.ViewModel(Gnd.$('#filters')[0], {app: app});

  //
  // Get the todos collection
  //
  var todos = todoList.get('todos');
    
  var todoListCtrl = new TodoListCtrl(todos);
   
  // 
  // Listen to available routes. Only used for selecting filters
  //
  Gnd.router.listen(function(req) {
    req.get(function() {
      
      if (req.isLast()) {
        // default when no specifying any filter explicitly
        todoListCtrl.showAll();
        setFilter(true, false, false);
      }
      
      req.get('active', '', function() {
        todoListCtrl.showActive();
        setFilter(false, true, false);
      });
        
      req.get('completed', '', function() {
        todoListCtrl.showCompleted();
        setFilter(false, false, true);
      });
    });
  });
});

}); // define
