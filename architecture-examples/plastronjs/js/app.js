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
    todolistControl.setReturnState(todomvc.listcontrol.ReturnState.DEFAULT);
    todolistControl.refresh();
  });

  router.route('/active', function() {
    todolistControl.setReturnState(todomvc.listcontrol.ReturnState.ACTIVE);
    todolistControl.refresh();
  });

  router.route('/completed', function() {
    todolistControl.setReturnState(todomvc.listcontrol.ReturnState.COMPLETED);
    todolistControl.refresh();
  });

};
goog.exportSymbol('todomvc.main', todomvc.main);
