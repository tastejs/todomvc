steal.plugins("jquery").then(function(){
	
var $event = $.event, 
	oldTrigger = $event.trigger;
// a copy of $'s handle function that goes until it finds 
$.event.handle = function( event ) {
	var args = $.makeArray( arguments );
	// Event object or event type
	var type = event.type || event,
		namespaces = [],
		exclusive;

	if ( type.indexOf("!") >= 0 ) {
		// Exclusive events trigger only for the exact event (no namespaces)
		type = type.slice(0, -1);
		exclusive = true;
	}

	if ( type.indexOf(".") >= 0 ) {
		// Namespaced trigger; create a regexp to match event type in handle()
		namespaces = type.split(".");
		type = namespaces.shift();
		namespaces.sort();
	}
	event.type = type;
	event.exclusive = exclusive;
	
	
	event = jQuery.event.fix( event || window.event );
	// Snapshot the handlers list since a called handler may add/remove events.
	var handlers = ((jQuery._data( this, "events" ) || {})[ event.type ] || []).slice(0),
		run_all = !event.exclusive && !event.namespace,
		args = Array.prototype.slice.call( arguments, 0 );

	// Use the fix-ed Event rather than the (read-only) native event
	args[0] = event;
	event.currentTarget = this;

	// JMVC CHANGED
	var oldType = type;
	if (event.type !== "default" && $event.special['default']) {
		$event.special['default'].triggerDefault(event, this);
	}
	event.type = oldType;
	
	for ( var j = 0, l = handlers.length; j < l; j++ ) {
		var handleObj = handlers[ j ];
		if( event.firstPass ){
			event.firstPass = false;
			continue;
		}

		// Triggered event must 1) be non-exclusive and have no namespace, or
		// 2) have namespace(s) a subset or equal to those in the bound event.
		if ( run_all || event.namespace_re.test( handleObj.namespace ) ) {
			// Pass in a reference to the handler function itself
			// So that we can later remove it
			event.handler = handleObj.handler;
			event.data = handleObj.data;
			event.handleObj = handleObj;

			var ret = handleObj.handler.apply( this, args );


			if ( ret !== undefined ) {
				event.result = ret;
				if ( ret === false ) {
					event.preventDefault();
					event.stopPropagation();
				}
			}

			if ( event.isImmediatePropagationStopped() ) {
				break;
			}
		}
	}
	
	// JMVC CHANGED
	if (event.type !== "default" && $event.special['default']) {
		$event.special['default'].checkAndRunDefaults(event, this);
	}
	return event.result;
}
})
