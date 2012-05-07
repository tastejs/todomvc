goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('mvc.Collection');
goog.require('mvc.Router');
goog.require('todomvc.listcontrol');
goog.require('todomvc.listmodel');





var todolist = new todomvc.listmodel();

//create the control for the collection.
var todolistControl = new todomvc.listcontrol(todolist);
todolistControl.decorate(goog.dom.getElement('todoapp'));

//setup router
var router = new mvc.Router();


/**
 * @param {number} index of selected filter.
 */
var toggleFilters = function(index) {
  var filters = goog.dom.getElementsByTagNameAndClass('A', undefined,
    goog.dom.getElement('filters'));
  goog.dom.classes.enable(filters[0], 'selected', index == 0);
  goog.dom.classes.enable(filters[1], 'selected', index == 1);
  goog.dom.classes.enable(filters[2], 'selected', index == 2);
};

router.route('/', function() {
  todolistControl.setReturnState(todomvc.listcontrol.ReturnState.DEFAULT);
  toggleFilters(0);
});

router.route('/active', function() {
  todolistControl.setReturnState(todomvc.listcontrol.ReturnState.ACTIVE);
  toggleFilters(1);
});

router.route('/completed', function() {
  todolistControl.setReturnState(todomvc.listcontrol.ReturnState.COMPLETED);
  toggleFilters(2);
});

