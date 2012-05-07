goog.provide('todomvc.main');

goog.require('goog.dom');
goog.require('mvc.Collection');
goog.require('mvc.Router');
goog.require('todomvc.listcontrol');
goog.require('todomvc.listmodel');



/**
 * main entry point.
 */
todomvc.main = function() {

  var todolist = new todomvc.listmodel();

  //create the control for the collection.
  var todolistControl = new todomvc.listcontrol(todolist);
  todolistControl.decorate(goog.dom.getElement('todoapp'));

  //setup router
  var router = new mvc.Router();

  router.route('/', function() {
    todolist.setReturnState(todomvc.listmodel.ReturnState.DEFAULT);
    todolistControl.refresh();
  });

  router.route('/active', function() {
    todolist.setReturnState(todomvc.listmodel.ReturnState.ACTIVE);
    todolistControl.refresh();
  });

  router.route('/completed', function() {
    todolist.setReturnState(todomvc.listmodel.ReturnState.COMPLETED);
    todolistControl.refresh();
  });

};
goog.exportSymbol('todomvc.main', todomvc.main);
