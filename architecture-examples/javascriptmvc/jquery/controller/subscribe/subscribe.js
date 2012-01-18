/*global OpenAjax: true */
steal.plugins('jquery/controller', 'jquery/lang/openajax').then(function() {

	/**
	 * @function jQuery.Controller.static.processors.subscribe
	 * @parent jQuery.Controller.static.processors
	 * @plugin jquery/controller/subscribe
	 * Adds OpenAjax.Hub subscribing to controllers.
	 * 
	 *     $.Controller("Subscriber",{
	 *       "recipe.updated subscribe" : function(called, recipe){
	 *         
	 *       },
	 *       "todo.* subscribe" : function(called, todo){
	 *       
	 *       }
	 *     })
	 * 
	 * You should typically be listening to jQuery triggered events when communicating between
	 * controllers.  Subscribe should be used for listening to model changes.
	 * 
	 * ### API
	 * 
	 * This is the call signiture for the processor, not the controller subscription callbacks.
	 * 
	 * @param {HTMLElement} el the element being bound.  This isn't used.
	 * @param {String} event the event type (subscribe).
	 * @param {String} selector the subscription name
	 * @param {Function} cb the callback function
	 */
	jQuery.Controller.processors.subscribe = function( el, event, selector, cb ) {
		var subscription = OpenAjax.hub.subscribe(selector, cb);
		return function() {
			var sub = subscription;
			OpenAjax.hub.unsubscribe(sub);
		};
	};

	/**
	 * @add jQuery.Controller.prototype
	 */
	//breaker
	/**
	 * @function publish
	 * @hide
	 * Publishes a message to OpenAjax.hub.
	 * @param {String} message Message name, ex: "Something.Happened".
	 * @param {Object} data The data sent.
	 */
	jQuery.Controller.prototype.publish = function() {
		OpenAjax.hub.publish.apply(OpenAjax.hub, arguments);
	};
});