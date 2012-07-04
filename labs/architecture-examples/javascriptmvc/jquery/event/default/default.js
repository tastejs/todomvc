
steal.plugins('jquery/event').then(function($){

$.fn.
/**
 * @function jQuery.fn.triggerAsync
 * @plugin jquery/event/default
 * @parent jquery.event.pause
 * 
 * Triggers an event and calls success when the event has finished propagating through the DOM and
 * preventDefault is not called.
 * 
 *     $('#panel').triggerAsync('show', function(){
 *       $('#panel').show();
 *     })
 * 
 * You can also provide a callback that gets called if preventDefault was called on the event:
 * 
 *     $('#panel').triggerAsync('show', function(){
 *       $('#panel').show();
 *     },function(){
 *       $('#other').addClass('error');
 *     })
 * 
 * triggerAsync is designed to work with the [jquery.event.pause] plugin although it is defined in 
 * <code>jquery/event/default</code>
 * 
 * ## API
 * 
 * 
 * @param {String} type The type of event
 * @param {Object} data The data for the event
 * @param {Function} success(event) a callback function
 * @param {Function} prevented(event) called if preventDefault is called on the 
 */
triggerAsync = function(type, data, success, prevented){
	if(typeof data == 'function'){
		success = data;
		data = undefined;
	}
	
	if ( this[0] ) {
		var event = $.Event( type ),
			old = event.preventDefault;
		
		event.preventDefault = function(){
			old.apply(this, arguments);
			prevented && prevented(this)
		}
		//event._success= success;
		jQuery.event.trigger( {type: type, _success: success}, data, this[0]  );
	} else{
		success.call(this);
	}
	return this;
}
	


/**
 * @add jQuery.event.special
 */
//cache default types for performance
var types = {}, rnamespaces= /\.(.*)$/, $event = $.event;
/**
 * @attribute default
 * @parent specialevents
 * @plugin jquery/event/default
 * @download  http://jmvcsite.heroku.com/pluginify?plugins[]=jquery/event/default/default.js
 * @test jquery/event/default/qunit.html
 * Allows you to perform default actions as a result of an event.
 * 
 * Event based APIs are a powerful way of exposing functionality of your widgets.  It also fits in 
 * quite nicely with how the DOM works.
 * 
 * 
 * Like default events in normal functions (e.g. submitting a form), synthetic default events run after
 * all event handlers have been triggered and no event handler has called
 * preventDefault or returned false.
 * 
 * To listen for a default event, just prefix the event with default.
 * 
 *     $("div").bind("default.show", function(ev){ ... });
 *     $("ul").delegate("li","default.activate", function(ev){ ... });
 * 
 * 
 * ## Example
 * 
 * Lets look at how you could build a simple tabs widget with default events.
 * First with just jQuery:
 * 
 * Default events are useful in cases where you want to provide an event based 
 * API for users of your widgets.  Users can simply listen to your synthetic events and 
 * prevent your default functionality by calling preventDefault.  
 * 
 * In the example below, the tabs widget provides a show event.  Users of the 
 * tabs widget simply listen for show, and if they wish for some reason, call preventDefault 
 * to avoid showing the tab.
 * 
 * In this case, the application developer doesn't want to show the second 
 * tab until the checkbox is checked. 
 * 
 * @demo jquery/event/default/defaultjquery.html
 * 
 * Lets see how we would build this with JavaScriptMVC:
 * 
 * @demo jquery/event/default/default.html
 */
$event.special["default"] = {
	add: function( handleObj ) {
		//save the type
		types[handleObj.namespace.replace(rnamespaces,"")] = true;
		
		//move the handler ...
		var origHandler = handleObj.handler;
		
		handleObj.origHandler = origHandler;
		handleObj.handler = function(ev, data){
			if(!ev._defaultActions) ev._defaultActions = [];
			ev._defaultActions.push({element: this, handler: origHandler, event: ev, data: data, currentTarget: ev.currentTarget})
		}
	},
	setup: function() {return true},
	triggerDefault : function(event, elem){
		
		var defaultGetter = jQuery.Event("default."+event.type);
			
		$.extend(defaultGetter,{
			target: elem,
			_defaultActions: event._defaultActions,
			exclusive : true
		});
		
		defaultGetter.stopPropagation();
	
		//default events only work on elements
		if(elem){
			$event.handle.call(elem, defaultGetter);
		}
	},
	checkAndRunDefaults : function(event, elem){
		//fire if there are default actions to run && 
	    //        we have not prevented default &&
	    //        propagation has been stopped or we are at the document element
	    //        we have reached the document
		if (!event.isDefaultPrevented() &&
		    (!event.isPaused || !event.isPaused()) &&  // no paused function or it's not paused
	         event._defaultActions  &&
	        ( ( event.isPropagationStopped() ) ||
	          ( !elem.parentNode && !elem.ownerDocument ) )
	          
	        ) {			
			
			// put event back
			event.namespace= event.type;
			event.type = "default";
			event.liveFired = null;
			
			// call each event handler
			for(var i = 0 ; i < event._defaultActions.length; i++){
				var a  = event._defaultActions[i],
					oldHandle = event.handled;
				event.currentTarget = a.currentTarget;
				a.handler.call(a.element, event, a.data);
				event.handled = event.handled === null ? oldHandle : true;
	        }
	        
			event._defaultActions = null; //set to null so everyone else on this element ignores it
	        
			if(event._success){
				event._success(event);
			}
	    }
	}
}

// overwrite trigger to allow default types
var oldTrigger = $event.trigger,
	triggerDefault = $event.special['default'].triggerDefault,
	checkAndRunDefaults = $event.special['default'].checkAndRunDefaults,
	oldData = jQuery._data;
	
$._data = function(elem, name, data){
	// always need to supply a function to call for handle
	if(!data && name === "handle"){
		var func = oldData.apply(this, arguments);
		return function(e){
			// Discard the second event of a jQuery.event.trigger() and
			// when an event is called after a page has unloaded
			return typeof jQuery !== "undefined" && (!e || jQuery.event.triggered !== e.type) ?
				jQuery.event.handle.apply( this, arguments ) :
				undefined;
		}
	}
	return oldData.apply(this, arguments)
}

$event.trigger =  function defaultTriggerer( event, data, elem, onlyHandlers){
	// Event object or event type
	var type = event.type || event,
		namespaces = [],

	// Caller can pass in an Event, Object, or just an event type string
	event = typeof event === "object" ?
		// jQuery.Event object
		event[ jQuery.expando ] ? event :
		// Object literal
		new jQuery.Event( type, event ) :
		// Just the event type (string)
		new jQuery.Event( type );
		
    event._defaultActions = []; //set depth for possibly reused events
	
	oldTrigger.call($.event, event, data, elem, onlyHandlers);
};
	
	
	
	
});