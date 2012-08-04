goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('mvc.Collection');
goog.require('mvc.Router');
goog.require('todomvc.listcontrol');
goog.require('todomvc.listmodel');


var todolist = new todomvc.listmodel();

// Create the control for the collection.
var todolistControl = new todomvc.listcontrol( todolist );
todolistControl.decorate( goog.dom.getElement('todoapp') );

// Setup router
var router = new mvc.Router();


/**
 * toggles selected class on filters list
 *
 * @param {string} chosenFilter selected filter by name.
 */
var toggleFilters = function( chosenFilter ) {
	var filters = goog.dom.getElementsByTagNameAndClass( 'A', undefined,
		goog.dom.getElement('filters') );

	goog.array.forEach( filters, function( filter ) {
		goog.dom.classes.enable( filter, 'selected',
				goog.dom.getTextContent( filter ) === chosenFilter );
	});
};

router.route( '/', function() {
	todolistControl.setFilter( todomvc.listcontrol.Filter.ALL );
	toggleFilters('All');
});

router.route( '/active', function() {
	todolistControl.setFilter( todomvc.listcontrol.Filter.ACTIVE );
	toggleFilters('Active');
});

router.route( '/completed', function() {
	todolistControl.setFilter( todomvc.listcontrol.Filter.COMPLETED );
	toggleFilters('Completed');
});
