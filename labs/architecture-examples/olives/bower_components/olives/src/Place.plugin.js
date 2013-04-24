/**
 * Olives http://flams.github.com/olives
 * The MIT License (MIT)
 * Copyright (c) 2012-2013 Olivier Scherrer <pode.fr@gmail.com> - Olivier Wietrich <olivier.wietrich@gmail.com>
 */

define(["OObject", "Tools"],
/**
* @class
* Place plugin places OObject in the DOM.
* @requires OObject, Tools
*/
function PlacePlugin(OObject, Tools) {

	/**
	 * Intilialize a Place.plugin with a list of OObjects
	 * @param {Object} $uis a list of OObjects such as:
	 *   {
	 *		"header": new OObject(),
	 *		"list": new OObject()
	 *	 }
	 * @Constructor
	 */
	return function PlacePluginConstructor($uis) {

		/**
		 * The list of uis currently set in this place plugin
		 * @private
		 */
		var _uis = {};

		/**
		 * Attach an OObject to this DOM element
		 * @param {HTML|SVGElement} node the dom node where to attach the OObject
		 * @param {String} the name of the OObject to attach
		 * @throws {NoSuchOObject} an error if there's no OObject for the given name
		 */
		this.place = function place(node, name) {
			if (_uis[name] instanceof OObject) {
				_uis[name].place(node);
			} else {
				throw new Error(name + " is not an OObject UI in place:"+name);
			}
		};

		/**
		 * Add an OObject that can be attached to a dom element
		 * @param {String} the name of the OObject to add to the list
		 * @param {OObject} ui the OObject to add the list
		 * @returns {Boolean} true if the OObject was added
		 */
		this.set = function set(name, ui) {
			if (typeof name == "string" && ui instanceof OObject) {
				_uis[name] = ui;
				return true;
			} else {
				return false;
			}
		};

		/**
		 * Add multiple dom elements at once
		 * @param {Object} $uis a list of OObjects such as:
		 *   {
		 *		"header": new OObject(),
		 *		"list": new OObject()
		 *	 }
		 */
		this.setAll = function setAll(uis) {
			Tools.loop(uis, function (ui, name) {
				this.set(name, ui);
			}, this);
		};

		/**
		 * Returns an OObject from the list given its name
		 * @param {String} the name of the OObject to get
		 * @returns {OObject} OObject for the given name
		 */
		this.get = function get(name) {
			return _uis[name];
		};

		this.setAll($uis);

	};

});
