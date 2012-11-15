goog.require('mvc.Router');
goog.require('todomvc.listcontrol');
goog.require('todomvc.listmodel');


var todolist = new todomvc.listmodel();

// Create the control for the collection.
var todolistControl = new todomvc.listcontrol( todolist );
// HTML already there so use decorate.
todolistControl.decorate( goog.dom.getElement('todoapp') );

// Setup router
var router = new mvc.Router();

router.route( '{/}', function() {
	todolist.set( 'filter', 'none' );
});

router.route( '/active', function() {
	todolist.set( 'filter', 'active' );
});

router.route( '/completed', function() {
	todolist.set( 'filter', 'completed' );
});
