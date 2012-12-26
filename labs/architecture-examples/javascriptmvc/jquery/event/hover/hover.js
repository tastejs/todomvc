steal('jquery/event','jquery/event/livehack').then(function($){
/**
 * @class jQuery.Hover
 * @plugin jquery/event/hover
 * @download  http://jmvcsite.heroku.com/pluginify?plugins[]=jquery/event/hover/hover.js
 * Provides delegate-able hover events.
 * <p>
 * 	A hover happens when the mouse stops moving 
 * over an element for a period of time.  You can listen
 * and configure hover with the following events:
 * </p>
 * <ul>
 * 	<li><code>[jQuery.event.special.hoverinit hoverinit]</code> - called on mouseenter, use this event to customize 
 *      [jQuery.Hover.prototype.delay] and [jQuery.Hover.prototype.distance]</li>
 *  <li><code>[jQuery.event.special.hoverenter hoverenter]</code> - an element is being hovered</li>
 *  <li><code>[jQuery.event.special.hovermove hovermove]</code> - the mouse moves on an element that has been hovered</li>
 *  <li><code>[jQuery.event.special.hoverleave hoverleave]</code> - the mouse leaves the element that has been hovered</li>
 * </ul>
 * <h3>Quick Example</h3>
 * The following listens for hoverenter and adds a class to style
 * the element, and removes the class on hoverleave.
 * @codestart
 * $('#menu').delegate(".option","hoverenter",function(){
 *   $(this).addClass("hovering");
 * }).delegate(".option","hoverleave",function(){
 *   $(this).removeClass("hovering");
 * })
 * @codeend
 * <h2>Configuring Distance and Delay</h2>
 * <p>An element is hovered when the mouse
 *   moves less than a certain distance in 
 *   specific time over the element.
 * </p>
 * <p>
 *   You can configure that distance and time by
 *   adjusting the <code>distance</code> and 
 *   <code>delay</code> values.  
 * </p>
 * <p>You can set delay and distance globally
 * by adjusting the static properties:</p>
 * </p>
 * @codestart
 * $.Hover.delay = 10
 * $.Hover.distance = 1
 * @codeend
 * <p>Or you can adjust delay and distance for
 * an individual element in hoverenter:</p>
 * @codestart
 * $(".option").delegate("hoverinit", function(ev, hover){
 * //set the distance to 10px
 * hover.distance(10)
 * //set the delay to 200ms
 * hover.delay(10)
 * })
 * @codeend
 * <h2>Demo</h2>
 * @demo jquery/event/hover/hover.html
 * @parent specialevents
 * @constructor Creates a new hover.  This is never
 * called directly.
 */
$.Hover = function(){
	this._delay =  $.Hover.delay;
	this._distance = $.Hover.distance;
	this._leave = $.Hover.leave
};
/**
 * @Static
 */
$.extend($.Hover,{
	/**
	 * @attribute delay
	 * A hover is  activated if it moves less than distance in this time.
	 * Set this value as a global default.
	 */
	delay: 100,
	/**
	 * @attribute distance
	 * A hover is activated if it moves less than this distance in delay time.
	 * Set this value as a global default.
	 */
	distance: 10,
	leave : 0
})

/**
 * @Prototype
 */
$.extend($.Hover.prototype,{
	/**
	 * Sets the delay for this hover.  This method should
	 * only be used in hoverinit.
	 * @param {Number} delay the number of milliseconds used to determine a hover
	 * 
	 */
	delay: function( delay ) {
		this._delay = delay;
		return this;
	},
	/**
	 * Sets the distance for this hover.  This method should
	 * only be used in hoverinit.
	 * @param {Number} distance the max distance in pixels a mouse can move to be considered a hover
	 */
	distance: function( distance ) {
		this._distance = distance;
		return this;
	},
	leave : function(leave){
		this._leave = leave;
		return this;
	}
})
var event = $.event, 
	handle  = event.handle,
	onmouseenter = function(ev){
		//now start checking mousemoves to update location
		var delegate = ev.delegateTarget || ev.currentTarget;
		var selector = ev.handleObj.selector;
		//prevents another mouseenter until current has run its course
		if($.data(delegate,"_hover"+selector)){
			return;
		}
		$.data(delegate,"_hover"+selector, true)
		var loc = {
				pageX : ev.pageX,
				pageY : ev.pageY
			}, 
			dist = 0, 
			timer, 
			enteredEl = this, 
			hovered = false,
			lastEv = ev, 
			hover = new $.Hover(),
			leaveTimer,
			callHoverLeave = function(){
				$.each(event.find(delegate, ["hoverleave"], selector), function(){
					this.call(enteredEl, ev, hover)
				})
				cleanUp();
			},
			mouseenter = function(ev){
				clearTimeout(leaveTimer);
				dist += Math.pow( ev.pageX-loc.pageX, 2 ) + Math.pow( ev.pageY-loc.pageY, 2 ); 
				loc = {
					pageX : ev.pageX,
					pageY : ev.pageY
				}
				lastEv = ev
			},
			mouseleave = function(ev){
				clearTimeout(timer);
				// go right away
				if(hovered){
					if(hover._leave === 0){
						callHoverLeave();
					}else{
						clearTimeout(leaveTimer);
						leaveTimer = setTimeout(function(){
							callHoverLeave();
						}, hover._leave)
					}
				}else{
					cleanUp();
				}
			},
			cleanUp = function(){
				$(enteredEl).unbind("mouseleave",mouseleave)
				$(enteredEl).unbind("mousemove",mouseenter);
				$.removeData(delegate,"_hover"+selector)
			};
		
		$(enteredEl).bind("mousemove",mouseenter).bind("mouseleave", mouseleave);
		$.each(event.find(delegate, ["hoverinit"], selector), function(){
			this.call(enteredEl, ev, hover)
		})
		
		timer = setTimeout(function(){
			//check that we aren't moveing around
			if(dist < hover._distance && $(enteredEl).queue().length == 0){
				$.each(event.find(delegate, ["hoverenter"], selector), function(){
					this.call(enteredEl, lastEv, hover)
				})
				hovered = true;
				return;
			}else{
				dist = 0;
				timer = setTimeout(arguments.callee, hover._delay)
			}
		}, hover._delay)
		
	};
		
/**
 * @add jQuery.event.special
 */
event.setupHelper( [
/**
 * @attribute hoverinit
 * Listen for hoverinit events to configure
 * [jQuery.Hover.prototype.delay] and [jQuery.Hover.prototype.distance]
 * for the current element.  Hoverinit is called on mouseenter.
 * @codestart
 * $(".option").delegate("hoverinit", function(ev, hover){
 *    //set the distance to 10px
 *    hover.distance(10)
 *    //set the delay to 200ms
 *    hover.delay(10)
 * })
 * @codeend
 */
"hoverinit", 
/**
 * @attribute hoverenter
 * Hoverenter events are called when the mouses less 
 * than [jQuery.Hover.prototype.distance] pixels in 
 * [jQuery.Hover.prototype.delay] milliseconds.
 * @codestart
 * $(".option").delegate("hoverenter", function(ev, hover){
 *    $(this).addClass("hovering");
 * })
 * @codeend
 */
"hoverenter",
/**
 * @attribute hoverleave
 * Called when the mouse leaves an element that has been
 * hovered.
 * @codestart
 * $(".option").delegate("hoverleave", function(ev, hover){
 *    $(this).removeClass("hovering");
 * })
 * @codeend
 */
"hoverleave",
/**
 * @attribute hovermove
 * Called when the mouse moves on an element that 
 * has been hovered.
 * @codestart
 * $(".option").delegate("hovermove", function(ev, hover){
 *    //not sure why you would want to listen for this
 *    //but we provide it just in case
 * })
 * @codeend
 */
"hovermove"], "mouseenter", onmouseenter )
		

	
})