steal('jquery/event/livehack').then(function($){
var supportTouch = "ontouchend" in document,
	scrollEvent = "touchmove scroll",
	touchStartEvent = supportTouch ? "touchstart" : "mousedown",
	touchStopEvent = supportTouch ? "touchend" : "mouseup",
	touchMoveEvent = supportTouch ? "touchmove" : "mousemove",
	data = function(event){
		var d = event.originalEvent.touches ?
			event.originalEvent.touches[ 0 ] || event.originalEvent.changedTouches[ 0 ] :
			event;
		return {
			time: (new Date).getTime(),
			coords: [ d.pageX, d.pageY ],
			origin: $( event.target )
		};
	};

/**
 * @add jQuery.event.special
 */
$.event.setupHelper( ["tap"], touchStartEvent, function(ev){
	//listen to mouseup
	var start = data(ev),
		stop,
		delegate = ev.delegateTarget || ev.currentTarget,
		selector = ev.handleObj.selector,
		entered = this,
		moved = false,
		touching = true,
		timer;
	
	
	function upHandler(event){
		stop = data(event);
		if ((Math.abs( start.coords[0] - stop.coords[0] ) < 10) ||
		    ( Math.abs( start.coords[1] - stop.coords[1] ) < 10) ){
			$.each($.event.find(delegate, ["tap"], selector), function(){
				this.call(entered, ev, {start : start, end: stop})
			})
		}
	};
	
	timer = setTimeout(function() {
		$(delegate).unbind(touchStopEvent, upHandler);
	}, 500 );
	
	$(delegate).one(touchStopEvent, upHandler);
	
});

});