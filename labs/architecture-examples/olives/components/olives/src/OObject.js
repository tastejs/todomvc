/**
 * Olives http://flams.github.com/olives
 * The MIT License (MIT)
 * Copyright (c) 2012-2013 Olivier Scherrer <pode.fr@gmail.com> - Olivier Wietrich <olivier.wietrich@gmail.com>
 */

define(["StateMachine", "Store", "Plugins", "DomUtils", "Tools"],
/**
* @class
* OObject is a container for dom elements. It will also bind
* the dom to additional plugins like Data binding
* @requires StateMachine
*/
function OObject(StateMachine, Store, Plugins, DomUtils, Tools) {

	return function OObjectConstructor(otherStore) {

		/**
		 * This function creates the dom of the UI from its template
		 * It then queries the dom for data- attributes
		 * It can't be executed if the template is not set
		 * @private
		 */
		var render = function render(UI) {

			// The place where the template will be created
			// is either the currentPlace where the node is placed
			// or a temporary div
			var baseNode = _currentPlace || document.createElement("div");

			// If the template is set
			if (UI.template) {
				// In this function, the thisObject is the UI's prototype
				// UI is the UI that has OObject as prototype
				if (typeof UI.template == "string") {
					// Let the browser do the parsing, can't be faster & easier.
					baseNode.innerHTML = UI.template.trim();
				} else if (DomUtils.isAcceptedType(UI.template)) {
					// If it's already an HTML element
					baseNode.appendChild(UI.template);
				}

				// The UI must be placed in a unique dom node
				// If not, there can't be multiple UIs placed in the same parentNode
				// as it wouldn't be possible to know which node would belong to which UI
				// This is probably a DOM limitation.
				if (baseNode.childNodes.length > 1) {
					throw Error("UI.template should have only one parent node");
				} else {
					UI.dom = baseNode.childNodes[0];
				}

				UI.plugins.apply(UI.dom);

			} else {
				// An explicit message I hope
				throw Error("UI.template must be set prior to render");
			}
		},

		/**
		 * This function appends the dom tree to the given dom node.
		 * This dom node should be somewhere in the dom of the application
		 * @private
		 */
		place = function place(UI, place, beforeNode) {
			if (place) {
				// IE (until 9) apparently fails to appendChild when insertBefore's second argument is null, hence this.
				beforeNode ? place.insertBefore(UI.dom, beforeNode) : place.appendChild(UI.dom);
				// Also save the new place, so next renderings
				// will be made inside it
				_currentPlace = place;
			}
		},

		/**
		 * Does rendering & placing in one function
		 * @private
		 */
		renderNPlace = function renderNPlace(UI, dom) {
			render(UI);
			place.apply(null, Tools.toArray(arguments));
		},

		/**
		 * This stores the current place
		 * If this is set, this is the place where new templates
		 * will be appended
		 * @private
		 */
		_currentPlace = null,

		/**
		 * The UI's stateMachine.
		 * Much better than if(stuff) do(stuff) else if (!stuff and stuff but not stouff) do (otherstuff)
		 * Please open an issue if you want to propose a better one
		 * @private
		 */
		_stateMachine = new StateMachine("Init", {
			"Init": [["render", render, this, "Rendered"],
			         ["place", renderNPlace, this, "Rendered"]],
			"Rendered": [["place", place, this],
			             ["render", render, this]]
		});

		/**
		 * The UI's Store
		 * It has set/get/del/has/watch/unwatch methods
		 * @see Emily's doc for more info on how it works.
		 */
		this.model = otherStore instanceof Store ? otherStore : new Store;

		/**
		 * The module that will manage the plugins for this UI
		 * @see Olives/Plugins' doc for more info on how it works.
		 */
		this.plugins = new Plugins();

		/**
		 * Describes the template, can either be like "&lt;p&gt;&lt;/p&gt;" or HTMLElements
		 * @type string or HTMLElement|SVGElement
		 */
		this.template = null;

		/**
		 * This will hold the dom nodes built from the template.
		 */
		this.dom = null;

		/**
		 * Place the UI in a given dom node
		 * @param  node the node on which to append the UI
		 * @param  beforeNode the dom before which to append the UI
		 */
		this.place = function place(node, beforeNode) {
			_stateMachine.event("place", this, node, beforeNode);
		};

		/**
		 * Renders the template to dom nodes and applies the plugins on it
		 * It requires the template to be set first
		 */
		this.render = function render() {
			_stateMachine.event("render", this);
		};

		/**
		 * Set the UI's template from a DOM element
		 * @param {HTMLElement|SVGElement} dom the dom element that'll become the template of the UI
		 * @returns true if dom is an HTMLElement|SVGElement
		 */
		this.setTemplateFromDom = function setTemplateFromDom(dom) {
			if (DomUtils.isAcceptedType(dom)) {
				this.template = dom;
				return true;
			} else {
				return false;
			}
		};

		/**
		 * Transforms dom nodes into a UI.
		 * It basically does a setTemplateFromDOM, then a place
		 * It's a helper function
		 * @param {HTMLElement|SVGElement} node the dom to transform to a UI
		 * @returns true if dom is an HTMLElement|SVGElement
		 */
		this.alive = function alive(dom) {
			if (DomUtils.isAcceptedType(dom)) {
				this.setTemplateFromDom(dom);
				this.place(dom.parentNode, dom.nextElementSibling);
				return true;
			} else {
				return false;
			}

		};

		/**
		 * Get the current dom node where the UI is placed.
		 * for debugging purpose
		 * @private
		 * @return {HTMLElement} node the dom where the UI is placed.
		 */
		this.getCurrentPlace = function(){
			return _currentPlace;
		};

	};

});
