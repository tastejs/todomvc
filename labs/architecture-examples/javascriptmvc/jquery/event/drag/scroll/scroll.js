steal.plugins("jquery/event/drop").then(function($){ //needs drop to determine if respondable

/**
 * @add jQuery.Drag.prototype
 */
$.Drag.prototype.
	/**
	 * Will scroll elements with a scroll bar as the drag moves to borders.
	 * @plugin jquery/event/drag/scroll
	 * @download  http://jmvcsite.heroku.com/pluginify?plugins[]=jquery/event/drag/scroll/scroll.js
	 * @param {jQuery} elements to scroll.  The window can be in this array.
	 */
	scrolls = function(elements){
		var elements = $(elements);
		
		for(var i = 0 ; i < elements.length; i++){
			this.constructor.responder._elements.push( elements.eq(i).data("_dropData", new $.Scrollable(elements[i]) )[0] )
		}
	},
	
$.Scrollable = function(element){
	this.element = jQuery(element);
}
$.extend($.Scrollable.prototype,{
	init: function( element ) {
		this.element = jQuery(element);
	},
	callHandlers: function( method, el, ev, drag ) {
		this[method](el || this.element[0], ev, this, drag)
	},
	dropover: function() {
		
	},
	dropon: function() {
		this.clear_timeout();
	}, 
	dropout: function() {
		this.clear_timeout();
	},
	dropinit: function() {
		
	},
	dropend: function() {},
	clear_timeout: function() {
		if(this.interval){
			clearTimeout(this.interval)
			this.interval = null;
		}
	},
	distance: function( diff ) {
		return (30 - diff) / 2;
	},
	dropmove: function( el, ev, drop, drag ) {
		
		//if we were about to call a move, clear it.
		this.clear_timeout();
		
		//position of the mouse
		var mouse = ev.vector(),
		
		//get the object we are going to get the boundries of
			location_object = $(el == document.documentElement ? window : el),
		
		//get the dimension and location of that object
			dimensions = location_object.dimensionsv('outer'),
			position = location_object.offsetv(),
		
		//how close our mouse is to the boundries
			bottom = position.y()+dimensions.y() - mouse.y(),
			top = mouse.y() - position.y(),
			right = position.x()+dimensions.x() - mouse.x(),
			left = mouse.x() - position.x(),
		
		//how far we should scroll
			dx =0, dy =0;

		
		//check if we should scroll
		if(bottom < 30)
			dy = this.distance(bottom);
		else if(top < 30)
			dy = -this.distance(top)
		if(right < 30)
			dx = this.distance(right);
		else if(left < 30)
			dx = -this.distance(left);
		
		//if we should scroll
		if(dx || dy){
			//set a timeout that will create a mousemove on that object
			var self = this;
			this.interval =  setTimeout( function(){
				self.move($(el), drag.movingElement, dx, dy, ev, ev.clientX, ev.clientY, ev.screenX, ev.screenY)
			},15)
		}
	},
	/**
	 * Scrolls an element then calls mouse a mousemove in the same location.
	 * @param {HTMLElement} scroll_element the element to be scrolled
	 * @param {HTMLElement} drag_element
	 * @param {Number} dx how far to scroll
	 * @param {Number} dy how far to scroll
	 * @param {Number} x the mouse position
	 * @param {Number} y the mouse position
	 */
	move: function( scroll_element, drag_element, dx, dy, ev/*, x,y,sx, sy*/ ) {
		scroll_element.scrollTop( scroll_element.scrollTop() + dy);
		scroll_element.scrollLeft(scroll_element.scrollLeft() + dx);
		
		drag_element.trigger(
			$.event.fix({type: "mousemove", 
					 clientX: ev.clientX, 
					 clientY: ev.clientY, 
					 screenX: ev.screenX, 
					 screenY: ev.screenY,
					 pageX:   ev.pageX,
					 pageY:   ev.pageY}))
		//drag_element.synthetic('mousemove',{clientX: x, clientY: y, screenX: sx, screenY: sy})
	}
})

})