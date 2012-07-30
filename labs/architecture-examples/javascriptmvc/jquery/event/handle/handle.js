steal("jquery").then(function(){
	
var $event = $.event, 
	oldTrigger = $event.trigger, 
	isElement = function(o){
		return (
			typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
			typeof o === "object" && o.nodeType === 1 && typeof o.nodeName==="string"
		) || (o === window) || (o === document);
	};
$.event.trigger = function(event, data, elem, onlyHandlers){
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

		if ( (!elem || jQuery.event.customEvent[ type ]) && !jQuery.event.global[ type ] ) {
			// No jQuery handlers for this event type, and it can't have inline handlers
			return;
		}

		// Caller can pass in an Event, Object, or just an event type string
		event = typeof event === "object" ?
			// jQuery.Event object
			event[ jQuery.expando ] ? event :
			// Object literal
			new jQuery.Event( type, event ) :
			// Just the event type (string)
			new jQuery.Event( type );

		event.type = type;
		event.exclusive = exclusive;
		event.namespace = namespaces.join(".");
		event.namespace_re = new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.)?") + "(\\.|$)");
		
		// triggerHandler() and global events don't bubble or run the default action
		if ( onlyHandlers || !elem ) {
			event.preventDefault();
			event.stopPropagation();
		}

		// Handle a global trigger
		if ( !elem ) {
			// TODO: Stop taunting the data cache; remove global events and always attach to document
			jQuery.each( jQuery.cache, function() {
				// internalKey variable is just used to make it easier to find
				// and potentially change this stuff later; currently it just
				// points to jQuery.expando
				var internalKey = jQuery.expando,
					internalCache = this[ internalKey ];
				if ( internalCache && internalCache.events && internalCache.events[ type ] ) {
					jQuery.event.trigger( event, data, internalCache.handle.elem );
				}
			});
			return;
		}

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// Clean up the event in case it is being reused
		event.result = undefined;
		event.target = elem;

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data ? jQuery.makeArray( data ) : [];
		data.unshift( event );

		var cur = elem,
			// IE doesn't like method names with a colon (#3533, #8272)
			ontype = type.indexOf(":") < 0 ? "on" + type : "";

		// Fire event on the current element, then bubble up the DOM tree
		do {
			var handle = jQuery._data( cur, "handle" );

			event.currentTarget = cur;
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Trigger an inline bound script
			if ( ontype && jQuery.acceptData( cur ) && cur[ ontype ] && cur[ ontype ].apply( cur, data ) === false ) {
				event.result = false;
				event.preventDefault();
			}

			// Bubble up to document, then to window
			cur = cur.parentNode || cur.ownerDocument || cur === event.target.ownerDocument && window;
		} while ( cur && !event.isPropagationStopped() );

		// If nobody prevented the default action, do it now
		if ( !event.isDefaultPrevented() ) {
			var old,
				special = jQuery.event.special[ type ] || {};

			if ( (!special._default || special._default.call( elem.ownerDocument, event ) === false) &&
				!(type === "click" && jQuery.nodeName( elem, "a" )) && jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction)() check here because IE6/7 fails that test.
				// IE<9 dies on focus to hidden element (#1486), may want to revisit a try/catch.
				try {
					if ( ontype && elem[ type ] ) {
						// Don't re-trigger an onFOO event when we call its FOO() method
						old = elem[ ontype ];

						if ( old ) {
							elem[ ontype ] = null;
						}

						jQuery.event.triggered = type;
						elem[ type ]();
					}
				} catch ( ieError ) {}

				if ( old ) {
					elem[ ontype ] = old;
				}

				jQuery.event.triggered = undefined;
			}
		}
		
		return event.result;
}
// a copy of $'s handle function that goes until it finds 
$.event.handle = function( event ) {
	
	event = jQuery.event.fix( event || window.event );
	// Snapshot the handlers list since a called handler may add/remove events.
	var handlers = ((jQuery._data( this, "events" ) || {})[ event.type ] || []).slice(0),
		run_all = !event.exclusive && !event.namespace,
		args = Array.prototype.slice.call( arguments, 0 );

	// Use the fix-ed Event rather than the (read-only) native event
	args[0] = event;
	event.currentTarget = this;

	// JMVC CHANGED
	var oldType = event.type, 
		// run if default is included
		runDefault = event.type !== "default" && $event.special['default'] && 
			// and its not an original event
			!event.originalEvent && 
			// and its an element 
			isElement(event.target);
	if (runDefault) {
		$event.special['default'].triggerDefault(event, this, args[1]);
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
	if (runDefault) {
		$event.special['default'].checkAndRunDefaults(event, this);
	}
	return event.result;
}
})
