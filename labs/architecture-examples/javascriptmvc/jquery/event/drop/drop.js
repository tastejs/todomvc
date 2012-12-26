steal('jquery/event/drag','jquery/dom/within','jquery/dom/compare',function($){
	var event = $.event;
	//somehow need to keep track of elements with selectors on them.  When element is removed, somehow we need to know that
	//
	/**
	 * @add jQuery.event.special
	 */
	var eventNames = [
	/**
	 * @attribute dropover
	 * Called when a drag is first moved over this drop element.
	 * <p>Drop events are covered in more detail in [jQuery.Drop].</p>
	 */
	"dropover",
	/**
	 * @attribute dropon
	 * Called when a drag is dropped on a drop element.
	 * <p>Drop events are covered in more detail in [jQuery.Drop].</p>
	 */
	"dropon",
	/**
	 * @attribute dropout
	 * Called when a drag is moved out of this drop.
	 * <p>Drop events are covered in more detail in [jQuery.Drop].</p>
	 */
	"dropout",
	/**
	 * @attribute dropinit
	 * Called when a drag motion starts and the drop elements are initialized.
	 * <p>Drop events are covered in more detail in [jQuery.Drop].</p>
	 */
	"dropinit",
	/**
	 * @attribute dropmove
	 * Called repeatedly when a drag is moved over a drop.
	 * <p>Drop events are covered in more detail in [jQuery.Drop].</p>
	 */
	"dropmove",
	/**
	 * @attribute dropend
	 * Called when the drag is done for this drop.
	 * <p>Drop events are covered in more detail in [jQuery.Drop].</p>
	 */
	"dropend"];
	
	
	
	/**
	 * @class jQuery.Drop
	 * @parent specialevents
	 * @plugin jquery/event/drop
	 * @download  http://jmvcsite.heroku.com/pluginify?plugins[]=jquery/event/drop/drop.js
	 * @test jquery/event/drag/qunit.html
	 * 
	 * Provides drop events as a special event to jQuery.  
	 * By binding to a drop event, the your callback functions will be 
	 * called during the corresponding phase of drag.
	 * <h2>Drop Events</h2>
	 * All drop events are called with the native event, an instance of drop, and the drag.  Here are the available drop 
	 * events:
	 * <ul>
	 * 	<li><code>dropinit</code> - the drag motion is started, drop positions are calculated.</li>
	 *  <li><code>dropover</code> - a drag moves over a drop element, called once as the drop is dragged over the element.</li>
	 *  <li><code>dropout</code> - a drag moves out of the drop element.</li>
	 *  <li><code>dropmove</code> - a drag is moved over a drop element, called repeatedly as the element is moved.</li>
	 *  <li><code>dropon</code> - a drag is released over a drop element.</li>
	 *  <li><code>dropend</code> - the drag motion has completed.</li>
	 * </ul>
	 * <h2>Examples</h2>
	 * Here's how to listen for when a drag moves over a drop:
	 * @codestart
	 * $('.drop').delegate("dropover", function(ev, drop, drag){
	 *   $(this).addClass("drop-over")
	 * })
	 * @codeend
	 * A bit more complex example:
	 * @demo jquery/event/drop/drop.html 1000
	 * 
	 * 
	 * 
	 * ## How it works
	 * 
	 *   1. When you bind on a drop event, it adds that element to the list of rootElements.
	 *      RootElements might be drop points, or might have delegated drop points in them.
	 * 
	 *   2. When a drag motion is started, each rootElement is queried for the events listening on it.
	 *      These events might be delegated events so we need to query for the drop elements.
	 *   
	 *   3. With each drop element, we add a Drop object with all the callbacks for that element.
	 *      Each element might have multiple event provided by different rootElements.  We merge
	 *      callbacks into the Drop object if there is an existing Drop object.
	 *      
	 *   4. Once Drop objects have been added to all elements, we go through them and call draginit
	 *      if available.
	 *      
	 * 
	 * @constructor
	 * The constructor is never called directly.
	 */
	$.Drop = function(callbacks, element){
		jQuery.extend(this,callbacks);
		this.element = $(element);
	}
	// add the elements ...
	$.each(eventNames, function(){
			event.special[this] = {
				add: function( handleObj ) {
					//add this element to the compiles list
					var el = $(this), current = (el.data("dropEventCount") || 0);
					el.data("dropEventCount",  current+1   )
					if(current==0){
						$.Drop.addElement(this);
					}
				},
				remove: function() {
					var el = $(this), current = (el.data("dropEventCount") || 0);
					el.data("dropEventCount",  current-1   )
					if(current<=1){
						$.Drop.removeElement(this);
					}
				}
			}
	});
	
	$.extend($.Drop,{
		lowerName: "drop",
		_rootElements: [], //elements that are listening for drops
		_elements: $(),    //elements that can be dropped on
		last_active: [],
		endName: "dropon",
		// adds an element as a 'root' element
		// this element might have events that we need to respond to
		addElement: function( el ) {
			//check other elements
			for(var i =0; i < this._rootElements.length ; i++  ){
				if(el ==this._rootElements[i]) return;
			}
			this._rootElements.push(el);
		},
		removeElement: function( el ) {
			 for(var i =0; i < this._rootElements.length ; i++  ){
				if(el == this._rootElements[i]){
					this._rootElements.splice(i,1)
					return;
				}
			}
		},
		/**
		* @hide
		* For a list of affected drops, sorts them by which is deepest in the DOM first.
		*/ 
		sortByDeepestChild: function( a, b ) {
			var compare = a.element.compare(b.element);
			if(compare & 16 || compare & 4) return 1;
			if(compare & 8 || compare & 2) return -1;
			return 0;
		},
		/**
		 * @hide
		 * Tests if a drop is within the point.
		 */
		isAffected: function( point, moveable, responder ) {
			return ((responder.element != moveable.element) && (responder.element.within(point[0], point[1], responder._cache).length == 1));
		},
		/**
		 * @hide
		 * Calls dropout and sets last active to null
		 * @param {Object} drop
		 * @param {Object} drag
		 * @param {Object} event
		 */
		deactivate: function( responder, mover, event ) {
			mover.out(event, responder)
			responder.callHandlers(this.lowerName+'out',responder.element[0], event, mover)
		}, 
		/**
		 * @hide
		 * Calls dropover
		 * @param {Object} drop
		 * @param {Object} drag
		 * @param {Object} event
		 */
		activate: function( responder, mover, event ) { //this is where we should call over
			mover.over(event, responder)
			//this.last_active = responder;
			responder.callHandlers(this.lowerName+'over',responder.element[0], event, mover);
		},
		move: function( responder, mover, event ) {
			responder.callHandlers(this.lowerName+'move',responder.element[0], event, mover)
		},
		/**
		 * Gets all elements that are droppable and adds them to a list.
		 * 
		 * This should be called if and when new drops are added to the page
		 * during the motion of a single drag.
		 * 
		 * This is called by default when a drag motion starts.
		 * 
		 * ## Use
		 * 
		 * After adding an element or drop, call compile.
		 * 
		 * $("#midpoint").bind("dropover",function(){
		 * 		// when a drop hovers over midpoint,
		 *      // make drop a drop.
		 * 		$("#drop").bind("dropover", function(){
		 * 			
		 * 		});
		 * 		$.Drop.compile();
		 * 	});
		 */
		compile: function( event, drag ) {
			// if we called compile w/o a current drag
			if(!this.dragging && !drag){
				return;
			}else if(!this.dragging){
				this.dragging = drag;
				this.last_active = [];
				//this._elements = $();
			}
			var el, 
				drops, 
				selector, 
				dropResponders, 
				newEls = [],
				dragging = this.dragging;
			
			// go to each root element and look for drop elements
			for(var i=0; i < this._rootElements.length; i++){ //for each element
				el = this._rootElements[i]
				
				// gets something like {"": ["dropinit"], ".foo" : ["dropover","dropmove"] }
				var drops = $.event.findBySelector(el, eventNames)

				// get drop elements by selector
				for(selector in drops){ 
					
					
					dropResponders = selector ? jQuery(selector, el) : [el];
					
					// for each drop element
					for(var e= 0; e < dropResponders.length; e++){ 
						
						// add the callbacks to the element's Data
						// there already might be data, so we merge it
						if( this.addCallbacks(dropResponders[e], drops[selector], dragging) ){
							newEls.push(dropResponders[e])
						};
					}
				}
			}
			// once all callbacks are added, call init on everything ...
			// todo ... init could be called more than once?
			this.add(newEls, event, dragging)
		},
		// adds the drag callbacks object to the element or merges other callbacks ...
		// returns true or false if the element is new ...
		// onlyNew lets only new elements add themselves
		addCallbacks : function(el, callbacks, onlyNew){
			
			var origData = $.data(el,"_dropData");
			if(!origData){
				$.data(el,"_dropData", new $.Drop(callbacks, el));
				//this._elements.push(el);
				return true;
			}else if(!onlyNew){
				var origCbs = origData;
				// merge data
				for(var eventName in callbacks){
					origCbs[eventName] = origCbs[eventName] ?
							origCbs[eventName].concat(callbacks[eventName]) :
							callbacks[eventName];
				}
				return false;
			}
		},
		// calls init on each element's drags. 
		// if its cancelled it's removed
		// adds to the current elements ...
		add: function( newEls, event, drag , dragging) {
			var i = 0,
				drop;
			
			while(i < newEls.length){
				drop = $.data(newEls[i],"_dropData");
				drop.callHandlers(this.lowerName+'init', newEls[i], event, drag)
				if(drop._canceled){
					newEls.splice(i,1)
				}else{
					i++;
				}
			}
			this._elements.push.apply(this._elements, newEls)
		},
		show: function( point, moveable, event ) {
			var element = moveable.element;
			if(!this._elements.length) return;
			
			var respondable, 
				affected = [], 
				propagate = true, 
				i = 0, 
				j, 
				la, 
				toBeActivated, 
				aff, 
				oldLastActive = this.last_active,
				responders = [],
				self = this,
				drag;
				
			//what's still affected ... we can also move element out here
			while( i < this._elements.length){
				drag = $.data(this._elements[i],"_dropData");
				
				if (!drag) {
					this._elements.splice(i, 1)
				}
				else {
					i++;
					if (self.isAffected(point, moveable, drag)) {
						affected.push(drag);
					}
				}
			}
			

			
			affected.sort(this.sortByDeepestChild); //we should only trigger on lowest children
			event.stopRespondPropagate = function(){
				propagate = false;
			}
			
			toBeActivated = affected.slice();

			// all these will be active
			this.last_active = affected;
			
			//deactivate everything in last_active that isn't active
			for (j = 0; j < oldLastActive.length; j++) {
				la = oldLastActive[j];
				i = 0;
				while((aff = toBeActivated[i])){
					if(la == aff){
						toBeActivated.splice(i,1);break;
					}else{
						i++;
					}
				}
				if(!aff){
					this.deactivate(la, moveable, event);
				}
				if(!propagate) return;
			}
			for(var i =0; i < toBeActivated.length; i++){
				this.activate(toBeActivated[i], moveable, event);
				if(!propagate) return;
			}
			//activate everything in affected that isn't in last_active
			
			for (i = 0; i < affected.length; i++) {
				this.move(affected[i], moveable, event);
				
				if(!propagate) return;
			}
		},
		end: function( event, moveable ) {
			var responder, la, 
				endName = this.lowerName+'end',
				dropData;
			
			// call dropon
			//go through the actives ... if you are over one, call dropped on it
			for(var i = 0; i < this.last_active.length; i++){
				la = this.last_active[i]
				if( this.isAffected(event.vector(), moveable, la)  && la[this.endName]){
					la.callHandlers(this.endName, null, event, moveable);
				}
			}
			// call dropend
			for(var r =0; r<this._elements.length; r++){
				dropData = $.data(this._elements[r],"_dropData");
				dropData && dropData.callHandlers(endName, null, event, moveable);
			}

			this.clear();
		},
		/**
		 * Called after dragging has stopped.
		 * @hide
		 */
		clear: function() {
		  this._elements.each(function(){
		  	$.removeData(this,"_dropData")
		  })
		  this._elements = $();
		  delete this.dragging;
		  //this._responders = [];
		}
	})
	$.Drag.responder = $.Drop;
	
	$.extend($.Drop.prototype,{
		callHandlers: function( method, el, ev, drag ) {
			var length = this[method] ? this[method].length : 0
			for(var i =0; i < length; i++){
				this[method][i].call(el || this.element[0], ev, this, drag)
			}
		},
		/**
		 * Caches positions of draggable elements.  This should be called in dropinit.  For example:
		 * @codestart
		 * dropinit: function( el, ev, drop ) { drop.cache_position() }
		 * @codeend
		 */
		cache: function( value ) {
			this._cache = value != null ? value : true;
		},
		/**
		 * Prevents this drop from being dropped on.
		 */
		cancel: function() {
			this._canceled = true;
		}
	} )
});