steal('jquery/event/default').then(function($){


var current,
	rnamespaces = /\.(.*)$/,
	returnFalse = function(){return false},
	returnTrue = function(){return true};

/**
 * @function
 * @parent jquery.event.pause
 * Pauses an event (to be resumed later);
 */
//
/**
 * @function
 * @parent jquery.event.pause
 * 
 * Resumes an event
 */
//
/**
 * @page jquery.event.pause Pause-Resume
 * @plugin jquery/event/pause
 * @parent specialevents
 * The jquery/event/pause plugin adds the ability to pause and 
 * resume events. 
 * 
 *     $('#todos').bind('show', function(ev){
 *       ev.pause();
 *       
 *       $(this).load('todos.html', function(){
 *         ev.resume();
 *       });
 *     })
 * 
 * When an event is paused, stops calling other event handlers for the 
 * event (similar to event.stopImmediatePropagation() ).  But when 
 * resume is called on the event, it will begin calling events on event handlers
 * after the 'paused' event handler.
 * 
 * 
 * Pause-able events complement the [jQuery.event.special.default default]
 * events plugin, providing the ability to easy create widgets with 
 * an asynchronous API.  
 * 
 * ## Example
 * 
 * Consider a basic tabs widget that:
 * 
 *   - trigger's a __show__ event on panels when they are to be displayed
 *   - shows the panel after the show event.
 *   
 * The sudo code for this controller might look like:
 * 
 *     $.Controller('Tabs',{
 *       ".button click" : function( el ){
 *         var panel = this.getPanelFromButton( el );
 *         panel.triggerAsync('show', function(){
 *           panel.show();
 *         })
 *       }
 *     })
 *     
 * Someone using this plugin would be able to delay the panel showing until ready:
 * 
 *     $('#todos').bind('show', function(ev){
 *       ev.pause();
 *       
 *       $(this).load('todos.html', function(){
 *         ev.resume();
 *       });
 *     })
 * 
 * Or prevent the panel from showing at all:
 * 
 *     $('#todos').bind('show', function(ev){
 *       if(! isReady()){
 *         ev.preventDefault();
 *       }
 *     })
 *     
 * ## Limitations
 * 
 * The element and event handler that the <code>pause</code> is within can not be removed before 
 * resume is called.
 * 
 * ## Big Example
 * 
 * The following example shows a tabs widget where the user is prompted to save, ignore, or keep editing
 * a tab when a new tab is clicked.
 * 
 * @demo jquery/event/pause/pause.html
 * 
 * It's a long, but great example of how to do some pretty complex state management with JavaScriptMVC.
 * 
 */
$.Event.prototype.isPaused = returnFalse


$.Event.prototype.pause = function(){
	// stop the event from continuing temporarily
	// keep the current state of the event ...
	this.pausedState = {
		isDefaultPrevented : this.isDefaultPrevented() ?
			returnTrue : returnFalse,
		isPropagationStopped : this.isPropagationStopped() ?
			returnTrue : returnFalse
	};
	
	this.stopImmediatePropagation();
	this.preventDefault();
	this.isPaused = returnTrue;
	
	
	
	
};

$.Event.prototype.resume = function(){
	// temporarily remove all event handlers of this type 
	var handleObj = this.handleObj,
		currentTarget = this.currentTarget;
	// temporarily overwrite special handle
	var origType = jQuery.event.special[ handleObj.origType ],
		origHandle = origType && origType.handle;
		
	if(!origType){
		jQuery.event.special[ handleObj.origType ] = {};
	}
	jQuery.event.special[ handleObj.origType ].handle = function(ev){
		// remove this once we have passed the handleObj
		if(ev.handleObj === handleObj && ev.currentTarget === currentTarget){
			if(!origType){
				delete jQuery.event.special[ handleObj.origType ];
			} else {
				jQuery.event.special[ handleObj.origType ].handle = origHandle;
			}
		}
	}
	delete this.pausedState;
	// reset stuff
	this.isPaused = this.isImmediatePropagationStopped = returnFalse;
	
	
	// re-run dispatch
	//$.event.dispatch.call(currentTarget, this)
	
	// with the events removed, dispatch
	
	if(!this.isPropagationStopped()){
		// fire the event again, no events will get fired until
		// same currentTarget / handler
		$.event.trigger(this, [], this.target);
	}
	
};

/*var oldDispatch = $.event.dispatch;
$.event.dispatch = function(){
	
}*/
// we need to finish handling

// and then trigger on next element ...
// can we fake the target ?


});