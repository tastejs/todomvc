steal('jquery/event').then(function( $ ) {
	/**
	 * @add jQuery.event.special
	 */
	var resizers = $(),
		resizeCount = 0,
		// bind on the window window resizes to happen
		win = $(window),
		windowWidth = 0,
		windowHeight = 0,
		timer;

	$(function() {
		windowWidth = win.width();
		windowHeight = win.height();
	})

	/**
	 * @attribute resize
	 * @parent specialevents
	 * 
	 * The resize event is useful for updating elements dimensions when a parent element
	 * has been resized.  It allows you to only resize elements that need to be resized 
	 * in the 'right order'.
	 * 
	 * By listening to a resize event, you will be alerted whenever a parent 
	 * element has a <code>resize</code> event triggered on it.  For example:
	 * 
	 *     $('#foo').bind('resize', function(){
	 *        // adjust #foo's dimensions
	 *     })
	 *     
	 *     $(document.body).trigger("resize");
	 * 
	 * ## The 'Right Order'
	 * 
	 * When a control changes size, typically, you want only internal controls to have to adjust their
	 * dimensions.  Furthermore, you want to adjust controls from the 'outside-in', meaning
	 * that the outermost control adjusts its dimensions before child controls adjust theirs.
	 * 
	 * Resize calls resize events in exactly this manner.  
	 * 
	 * When you trigger a resize event, it will propagate up the DOM until it reaches
	 * an element with the first resize event 
	 * handler.  There it will move the event in the opposite direction, calling the element's
	 * children's resize event handlers.
	 *
	 * If your intent is to call resize without bubbling and only trigger child element's handlers,
	 * use the following:
	 *
	 *     $("#foo").trigger("resize", false);
	 * 
	 * ## Stopping Children Updates
	 * 
	 * If your element doesn't need to change it's dimensions as a result of the parent element, it should
	 * call ev.stopPropagation().  This will only stop resize from being sent to child elements of the current element.
	 * 
	 * 
	 */
	$.event.special.resize = {
		setup: function( handleObj ) {
			// add and sort the resizers array
			// don't add window because it can't be compared easily
			if ( this !== window ) {
				resizers.push(this);
				$.unique(resizers);
			}
			// returns false if the window
			return this !== window;
		},
		teardown: function() {
			// we shouldn't have to sort
			resizers = resizers.not(this);

			// returns false if the window
			return this !== window;
		},
		add: function( handleObj ) {
			// increment the number of resizer elements
			//$.data(this, "jquery.dom.resizers", ++$.data(this, "jquery.dom.resizers") );
			var origHandler = handleObj.handler;
			handleObj.origHandler = origHandler;

			handleObj.handler = function( ev, data ) {
				var isWindow = this === window;

				// if we are the window and a real resize has happened
				// then we check if the dimensions actually changed
				// if they did, we will wait a brief timeout and 
				// trigger resize on the window
				// this is for IE, to prevent window resize 'infinate' loop issues
				if ( isWindow && ev.originalEvent ) {
					var width = win.width(),
						height = win.height();


					if ((width != windowWidth || height != windowHeight)) {
						//update the new dimensions
						windowWidth = width;
						windowHeight = height;
						clearTimeout(timer)
						timer = setTimeout(function() {
							win.trigger("resize");
						}, 1);

					}
					return;
				}

				// if this is the first handler for this event ...
				if ( resizeCount === 0 ) {
					// prevent others from doing what we are about to do
					resizeCount++;
					var where = data === false ? ev.target : this

					//trigger all this element's handlers
					$.event.handle.call(where, ev);
					if ( ev.isPropagationStopped() ) {
						resizeCount--;
						return;
					}

					// get all other elements within this element that listen to resize
					// and trigger their resize events
					var index = resizers.index(this),
						length = resizers.length,
						child, sub;

					// if index == -1 it's the window
					while (++index < length && (child = resizers[index]) && (isWindow || $.contains(where, child)) ) {

						// call the event
						$.event.handle.call(child, ev);

						if ( ev.isPropagationStopped() ) {
							// move index until the item is not in the current child
							while (++index < length && (sub = resizers[index]) ) {
								if (!$.contains(child, sub) ) {
									// set index back one
									index--;
									break
								}
							}
						}
					}

					// prevent others from responding
					ev.stopImmediatePropagation();
					resizeCount--;
				} else {
					handleObj.origHandler.call(this, ev, data);
				}
			}
		}
	};

	// automatically bind on these
	$([document, window]).bind('resize', function() {})
})