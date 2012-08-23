steal.plugins('jquery/event/livehack').then(function($){
var supportTouch = "ontouchend" in document,
	scrollEvent = "touchmove scroll",
	touchStartEvent = supportTouch ? "touchstart" : "mousedown",
	touchStopEvent = supportTouch ? "touchend" : "mouseup",
	touchMoveEvent = supportTouch ? "touchmove" : "mousemove",
	data = function(event){
		var d = event.originalEvent.touches ?
			event.originalEvent.touches[ 0 ] :
			event;
		return {
			time: (new Date).getTime(),
			coords: [ d.pageX, d.pageY ],
			origin: $( event.target )
		};
	};

/**
 * @class jQuery.event.swipe
 * @parent specialevents
 * @plugin jquery/event/swipe
 * 
 * Swipe provides cross browser swipe events.  On mobile devices, swipe uses touch events.  On desktop browsers,
 * swipe uses mouseevents.
 *
 * A swipe happens when a touch or drag moves 
 */
var swipe = $.event.swipe = {
	/**
	 * @attribute delay
	 * Delay is the upper limit of time the swipe motion can take in milliseconds.  This defaults to 1000.
	 * 
	 * A user must perform the swipe motion in this much time.
	 */
	delay : 500,
	/**
	 * @attribute max
	 * The maximum distance the pointer must travel in pixels.  The default is 75 pixels.
	 */
	max : 75,
	/**
	 * @attribute min
	 * The minimum distance the pointer must travel in pixesl.  The default is 30 pixels.
	 */
	min : 30
};


$.event.setupHelper( [


"swipe",'swipeleft','swiperight','swipeup','swipedown'], touchStartEvent, function(ev){
	//listen to mouseup
	var start = data(ev),
		stop,
		delegate = ev.liveFired || ev.currentTarget,
		selector = ev.handleObj.selector,
		entered = this;
	
	function moveHandler(event){
		if ( !start ) {
			return;
		}
		stop = data(event);

		// prevent scrolling
		if ( Math.abs( start.coords[0] - stop.coords[0] ) > 10 ) {
			event.preventDefault();
		}
	};
	$(document.documentElement).bind(touchMoveEvent,moveHandler )
		.one(touchStopEvent, function(event){
			$(this).unbind( touchMoveEvent, moveHandler );
			if ( start && stop ) {
				var deltaX = Math.abs(start.coords[0] - stop.coords[0]),
					deltaY = Math.abs(start.coords[1] - stop.coords[1]),
					distance = Math.sqrt(deltaX*deltaX+deltaY*deltaY);
				console.log(stop.time - start.time, swipe.delay, distance , swipe.min)
				if ( stop.time - start.time < swipe.delay && distance >= swipe.min ) {
					
					var events = ['swipe']
					if( deltaX >= swipe.min &&  deltaY < swipe.min) {
						events.push( start.coords[0] > stop.coords[0] ? "swipeleft" : "swiperight" );
					}else if(deltaY >= swipe.min && deltaX < swipe.min){
						events.push( start.coords[1] < stop.coords[1] ? "swipedown" : "swipeup" );
					}

					
					
					//trigger swipe events on this guy
					$.each($.event.find(delegate, events, selector), function(){
						this.call(entered, ev, {start : start, end: stop})
					})
				
				}
			}
			start = stop = undefined;
		})
});

});