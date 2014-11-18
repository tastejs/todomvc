/**
 * Olives http://flams.github.com/olives
 * The MIT License (MIT)
 * Copyright (c) 2012-2013 Olivier Scherrer <pode.fr@gmail.com> - Olivier Wietrich <olivier.wietrich@gmail.com>
 */

define(["DomUtils"],

/**
* @class
* Event plugin adds events listeners to DOM nodes.
* It can also delegate the event handling to a parent dom node
* @requires Utils
*/
function EventPlugin(Utils) {

	/**
	 * The event plugin constructor.
	 * ex: new EventPlugin({method: function(){} ...}, false);
	 * @param {Object} the object that has the event handling methods
	 * @param {Boolean} $isMobile if the event handler has to map with touch events
	 */
	return function EventPluginConstructor($parent, $isMobile) {

		/**
		 * The parent callback
		 * @private
		 */
		var _parent = null,

		/**
		 * The mapping object.
		 * @private
		 */
		_map = {
			"mousedown" : "touchstart",
			"mouseup" : "touchend",
			"mousemove" : "touchmove"
		},

		/**
		 * Is touch device.
		 * @private
		 */
		_isMobile = !!$isMobile;

		/**
		 * Add mapped event listener (for testing purpose).
		 * @private
		 */
		this.addEventListener = function addEventListener(node, event, callback, useCapture) {
			node.addEventListener(this.map(event), callback, !!useCapture);
		};

		/**
		 * Listen to DOM events.
		 * @param {Object} node DOM node
		 * @param {String} name event's name
		 * @param {String} listener callback's name
		 * @param {String} useCapture string
		 */
		this.listen = function listen(node, name, listener, useCapture) {
			this.addEventListener(node, name, function(e){
				_parent[listener].call(_parent, e, node);
			}, !!useCapture);
		};

		/**
		 * Delegate the event handling to a parent DOM element
		 * @param {Object} node DOM node
		 * @param {String} selector CSS3 selector to the element that listens to the event
		 * @param {String} name event's name
		 * @param {String} listener callback's name
		 * @param {String} useCapture string
		 */
		this.delegate = function delegate(node, selector, name, listener, useCapture) {
			this.addEventListener(node, name, function(event){
				if (Utils.matches(node, selector, event.target)) {
					_parent[listener].call(_parent, event, node);
				}
			}, !!useCapture);
		};

		/**
		 * Get the parent object.
		 * @return {Object} the parent object
		 */
		this.getParent = function getParent() {
			return _parent;
		};

		/**
		 * Set the parent object.
		 * The parent object is an object which the functions are called by node listeners.
		 * @param {Object} the parent object
		 * @return true if object has been set
		 */
		this.setParent = function setParent(parent) {
			if (parent instanceof Object){
				_parent = parent;
				return true;
			}
			return false;
		};

		/**
		 * Get event mapping.
		 * @param {String} event's name
		 * @return the mapped event's name
		 */
		this.map = function map(name) {
			return _isMobile ? (_map[name] || name) : name;
		};

		/**
		 * Set event mapping.
		 * @param {String} event's name
		 * @param {String} event's value
		 * @return true if mapped
		 */
		this.setMap = function setMap(name, value) {
			if (typeof name == "string" &&
				typeof value == "string") {
				_map[name] = value;
				return true;
			}
			return false;
		};

		//init
		this.setParent($parent);
	};

});
