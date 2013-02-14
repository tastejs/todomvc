/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('node-focusmanager', function (Y, NAME) {

/**
* <p>The Focus Manager Node Plugin makes it easy to manage focus among
* a Node's descendants.  Primarily intended to help with widget development,
* the Focus Manager Node Plugin can be used to improve the keyboard
* accessibility of widgets.</p>
*
* <p>
* When designing widgets that manage a set of descendant controls (i.e. buttons
* in a toolbar, tabs in a tablist, menuitems in a menu, etc.) it is important to
* limit the number of descendants in the browser's default tab flow.  The fewer
* number of descendants in the default tab flow, the easier it is for keyboard
* users to navigate between widgets by pressing the tab key.  When a widget has
* focus it should provide a set of shortcut keys (typically the arrow keys)
* to move focus among its descendants.
* </p>
*
* <p>
* To this end, the Focus Manager Node Plugin makes it easy to define a Node's
* focusable descendants, define which descendant should be in the default tab
* flow, and define the keys that move focus among each descendant.
* Additionally, as the CSS
* <a href="http://www.w3.org/TR/CSS21/selector.html#x38"><code>:focus</code></a>
* pseudo class is not supported on all elements in all
* <a href="http://developer.yahoo.com/yui/articles/gbs/">A-Grade browsers</a>,
* the Focus Manager Node Plugin provides an easy, cross-browser means of
* styling focus.
* </p>
*
* @module node-focusmanager
*/

	//	Frequently used strings

var ACTIVE_DESCENDANT = "activeDescendant",
	ID = "id",
	DISABLED = "disabled",
	TAB_INDEX = "tabIndex",
	FOCUSED = "focused",
	FOCUS_CLASS = "focusClass",
	CIRCULAR = "circular",
	UI = "UI",
	KEY = "key",
	ACTIVE_DESCENDANT_CHANGE = ACTIVE_DESCENDANT + "Change",
	HOST = "host",

	//	Collection of keys that, when pressed, cause the browser viewport
	//	to scroll.
	scrollKeys = {
		37: true,
		38: true,
		39: true,
		40: true
	},

	clickableElements = {
		"a": true,
		"button": true,
		"input": true,
		"object": true
	},

	//	Library shortcuts

	Lang = Y.Lang,
 	UA = Y.UA,

	/**
	* The NodeFocusManager class is a plugin for a Node instance.  The class is used
	* via the <a href="Node.html#method_plug"><code>plug</code></a> method of Node
	* and should not be instantiated directly.
	* @namespace plugin
	* @class NodeFocusManager
	*/
	NodeFocusManager = function () {

		NodeFocusManager.superclass.constructor.apply(this, arguments);

	};


NodeFocusManager.ATTRS = {

	/**
	* Boolean indicating that one of the descendants is focused.
	*
	* @attribute focused
	* @readOnly
	* @default false
	* @type boolean
	*/
	focused: {

		value: false,
		readOnly: true

	},


	/**
	* String representing the CSS selector used to define the descendant Nodes
	* whose focus should be managed.
	*
	* @attribute descendants
	* @type Y.NodeList
	*/
	descendants: {

		getter: function (value) {

			return this.get(HOST).all(value);

		}

	},


	/**
	* <p>Node, or index of the Node, representing the descendant that is either
	* focused or is focusable (<code>tabIndex</code> attribute is set to 0).
	* The value cannot represent a disabled descendant Node.  Use a value of -1
	* to remove all descendant Nodes from the default tab flow.
	* If no value is specified, the active descendant will be inferred using
	* the following criteria:</p>
	* <ol>
	* <li>Examining the <code>tabIndex</code> attribute of each descendant and
	* using the first descendant whose <code>tabIndex</code> attribute is set
	* to 0</li>
	* <li>If no default can be inferred then the value is set to either 0 or
	* the index of the first enabled descendant.</li>
	* </ol>
	*
	* @attribute activeDescendant
	* @type Number
	*/
	activeDescendant: {

		setter: function (value) {

			var isNumber = Lang.isNumber,
				INVALID_VALUE = Y.Attribute.INVALID_VALUE,
				descendantsMap = this._descendantsMap,
				descendants = this._descendants,
				nodeIndex,
				returnValue,
				oNode;


			if (isNumber(value)) {
				nodeIndex = value;
				returnValue = nodeIndex;
			}
			else if ((value instanceof Y.Node) && descendantsMap) {

				nodeIndex = descendantsMap[value.get(ID)];

				if (isNumber(nodeIndex)) {
					returnValue = nodeIndex;
				}
				else {

					//	The user passed a reference to a Node that wasn't one
					//	of the descendants.
					returnValue = INVALID_VALUE;

				}

			}
			else {
				returnValue = INVALID_VALUE;
			}


			if (descendants) {

				oNode = descendants.item(nodeIndex);

				if (oNode && oNode.get("disabled")) {

					//	Setting the "activeDescendant" attribute to the index
					//	of a disabled descendant is invalid.
					returnValue = INVALID_VALUE;

				}

			}

			return returnValue;

		}

	},


	/**
	* Object literal representing the keys to be used to navigate between the
	* next/previous descendant.  The format for the attribute's value is
	* <code>{ next: "down:40", previous: "down:38" }</code>.  The value for the
	* "next" and "previous" properties are used to attach
	* <a href="event/#keylistener"><code>key</code></a> event listeners. See
	* the <a href="event/#keylistener">Using the key Event</a> section of
	* the Event documentation for more information on "key" event listeners.
	*
	* @attribute keys
	* @type Object
	*/
	keys: {

		value: {

			next: null,
			previous: null

		}


	},


	/**
	* String representing the name of class applied to the focused active
	* descendant Node.  Can also be an object literal used to define both the
	* class name, and the Node to which the class should be applied.  If using
	* an object literal, the format is:
	* <code>{ className: "focus", fn: myFunction }</code>.  The function
	* referenced by the <code>fn</code> property in the object literal will be
	* passed a reference to the currently focused active descendant Node.
	*
	* @attribute focusClass
	* @type String|Object
	*/
	focusClass: { },


	/**
	* Boolean indicating if focus should be set to the first/last descendant
	* when the end or beginning of the descendants has been reached.
	*
	* @attribute circular
	* @type Boolean
	* @default true
	*/
	circular: {
		value: true
	}

};

Y.extend(NodeFocusManager, Y.Plugin.Base, {

	//	Protected properties

	//	Boolean indicating if the NodeFocusManager is active.
	_stopped: true,

	//	NodeList representing the descendants selected via the
	//	"descendants" attribute.
	_descendants: null,

	//	Object literal mapping the IDs of each descendant to its index in the
	//	"_descendants" NodeList.
	_descendantsMap: null,

	//	Reference to the Node instance to which the focused class (defined
	//	by the "focusClass" attribute) is currently applied.
	_focusedNode: null,

	//	Number representing the index of the last descendant Node.
	_lastNodeIndex: 0,

	//	Array of handles for event handlers used for a NodeFocusManager instance.
	_eventHandlers: null,



	//	Protected methods

	/**
	* @method _initDescendants
	* @description Sets the <code>tabIndex</code> attribute of all of the
	* descendants to -1, except the active descendant, whose
	* <code>tabIndex</code> attribute is set to 0.
	* @protected
	*/
	_initDescendants: function () {

		var descendants = this.get("descendants"),
			descendantsMap = {},
			nFirstEnabled = -1,
			nDescendants,
			nActiveDescendant = this.get(ACTIVE_DESCENDANT),
			oNode,
			sID,
			i = 0;



		if (Lang.isUndefined(nActiveDescendant)) {
			nActiveDescendant = -1;
		}


		if (descendants) {

			nDescendants = descendants.size();


            for (i = 0; i < nDescendants; i++) {

                oNode = descendants.item(i);

                if (nFirstEnabled === -1 && !oNode.get(DISABLED)) {
                    nFirstEnabled = i;
                }


                //	If the user didn't specify a value for the
                //	"activeDescendant" attribute try to infer it from
                //	the markup.

                //	Need to pass "2" when using "getAttribute" for IE to get
                //	the attribute value as it is set in the markup.
                //	Need to use "parseInt" because IE always returns the
                //	value as a number, whereas all other browsers return
                //	the attribute as a string when accessed
                //	via "getAttribute".

                if (nActiveDescendant < 0 &&
                        parseInt(oNode.getAttribute(TAB_INDEX, 2), 10) === 0) {

                    nActiveDescendant = i;

                }

                if (oNode) {
                    oNode.set(TAB_INDEX, -1);
                }

                sID = oNode.get(ID);

                if (!sID) {
                    sID = Y.guid();
                    oNode.set(ID, sID);
                }

                descendantsMap[sID] = i;

            }


            //	If the user didn't specify a value for the
            //	"activeDescendant" attribute and no default value could be
            //	determined from the markup, then default to 0.

            if (nActiveDescendant < 0) {
                nActiveDescendant = 0;
            }


            oNode = descendants.item(nActiveDescendant);

            //	Check to make sure the active descendant isn't disabled,
            //	and fall back to the first enabled descendant if it is.

            if (!oNode || oNode.get(DISABLED)) {
                oNode = descendants.item(nFirstEnabled);
                nActiveDescendant = nFirstEnabled;
            }

            this._lastNodeIndex = nDescendants - 1;
            this._descendants = descendants;
            this._descendantsMap = descendantsMap;

            this.set(ACTIVE_DESCENDANT, nActiveDescendant);

            //	Need to set the "tabIndex" attribute here, since the
            //	"activeDescendantChange" event handler used to manage
            //	the setting of the "tabIndex" attribute isn't wired up yet.

            if (oNode) {
                oNode.set(TAB_INDEX, 0);
            }

		}

	},


	/**
	* @method _isDescendant
	* @description Determines if the specified Node instance is a descendant
	* managed by the Focus Manager.
	* @param node {Node} Node instance to be checked.
	* @return {Boolean} Boolean indicating if the specified Node instance is a
	* descendant managed by the Focus Manager.
	* @protected
	*/
	_isDescendant: function (node) {

		return (node.get(ID) in this._descendantsMap);

	},


	/**
	* @method _removeFocusClass
	* @description Removes the class name representing focus (as specified by
	* the "focusClass" attribute) from the Node instance to which it is
	* currently applied.
	* @protected
	*/
	_removeFocusClass: function () {

		var oFocusedNode = this._focusedNode,
			focusClass = this.get(FOCUS_CLASS),
			sClassName;

		if (focusClass) {
			sClassName = Lang.isString(focusClass) ?
				focusClass : focusClass.className;
		}

		if (oFocusedNode && sClassName) {
			oFocusedNode.removeClass(sClassName);
		}

	},


	/**
	* @method _detachKeyHandler
	* @description Detaches the "key" event handlers used to support the "keys"
	* attribute.
	* @protected
	*/
	_detachKeyHandler: function () {

		var prevKeyHandler = this._prevKeyHandler,
			nextKeyHandler = this._nextKeyHandler;

		if (prevKeyHandler) {
			prevKeyHandler.detach();
		}

		if (nextKeyHandler) {
			nextKeyHandler.detach();
		}

	},


	/**
	* @method _preventScroll
	* @description Prevents the viewport from scolling when the user presses
	* the up, down, left, or right key.
	* @protected
	*/
	_preventScroll: function (event) {

		if (scrollKeys[event.keyCode] && this._isDescendant(event.target)) {
			event.preventDefault();
		}

	},


	/**
	* @method _fireClick
	* @description Fires the click event if the enter key is pressed while
	* focused on an HTML element that is not natively clickable.
	* @protected
	*/
	_fireClick: function (event) {

		var oTarget = event.target,
			sNodeName = oTarget.get("nodeName").toLowerCase();

		if (event.keyCode === 13 && (!clickableElements[sNodeName] ||
				(sNodeName === "a" && !oTarget.getAttribute("href")))) {


			oTarget.simulate("click");

		}

	},


	/**
	* @method _attachKeyHandler
	* @description Attaches the "key" event handlers used to support the "keys"
	* attribute.
	* @protected
	*/
	_attachKeyHandler: function () {

		this._detachKeyHandler();

		var sNextKey = this.get("keys.next"),
			sPrevKey = this.get("keys.previous"),
			oNode = this.get(HOST),
			aHandlers = this._eventHandlers;

		if (sPrevKey) {
 			this._prevKeyHandler =
				Y.on(KEY, Y.bind(this._focusPrevious, this), oNode, sPrevKey);
		}

		if (sNextKey) {
 			this._nextKeyHandler =
				Y.on(KEY, Y.bind(this._focusNext, this), oNode, sNextKey);
		}


		//	In Opera it is necessary to call the "preventDefault" method in
		//	response to the user pressing the arrow keys in order to prevent
		//	the viewport from scrolling when the user is moving focus among
		//	the focusable descendants.

		if (UA.opera) {
			aHandlers.push(oNode.on("keypress", this._preventScroll, this));
		}


		//	For all browsers except Opera: HTML elements that are not natively
		//	focusable but made focusable via the tabIndex attribute don't
		//	fire a click event when the user presses the enter key.  It is
		//	possible to work around this problem by simplying dispatching a
		//	click event in response to the user pressing the enter key.

		if (!UA.opera) {
			aHandlers.push(oNode.on("keypress", this._fireClick, this));
		}

	},


	/**
	* @method _detachEventHandlers
	* @description Detaches all event handlers used by the Focus Manager.
	* @protected
	*/
	_detachEventHandlers: function () {

		this._detachKeyHandler();

		var aHandlers = this._eventHandlers;

		if (aHandlers) {

			Y.Array.each(aHandlers, function (handle) {
				handle.detach();
			});

			this._eventHandlers = null;

		}

	},


	/**
	* @method _detachEventHandlers
	* @description Attaches all event handlers used by the Focus Manager.
	* @protected
	*/
	_attachEventHandlers: function () {

		var descendants = this._descendants,
			aHandlers,
			oDocument,
			handle;

		if (descendants && descendants.size()) {

			aHandlers = this._eventHandlers || [];
			oDocument = this.get(HOST).get("ownerDocument");


			if (aHandlers.length === 0) {


				aHandlers.push(oDocument.on("focus", this._onDocFocus, this));

				aHandlers.push(oDocument.on("mousedown",
					this._onDocMouseDown, this));

				aHandlers.push(
						this.after("keysChange", this._attachKeyHandler));

				aHandlers.push(
						this.after("descendantsChange", this._initDescendants));

				aHandlers.push(
						this.after(ACTIVE_DESCENDANT_CHANGE,
								this._afterActiveDescendantChange));


				//	For performance: defer attaching all key-related event
				//	handlers until the first time one of the specified
				//	descendants receives focus.

				handle = this.after("focusedChange", Y.bind(function (event) {

					if (event.newVal) {


						this._attachKeyHandler();

						//	Detach this "focusedChange" handler so that the
						//	key-related handlers only get attached once.

						handle.detach();

					}

				}, this));

				aHandlers.push(handle);

			}


			this._eventHandlers = aHandlers;

		}

	},


	//	Protected event handlers

	/**
	* @method _onDocMouseDown
	* @description "mousedown" event handler for the owner document of the
	* Focus Manager's Node.
	* @protected
	* @param event {Object} Object representing the DOM event.
	*/
	_onDocMouseDown: function (event) {

		var oHost = this.get(HOST),
			oTarget = event.target,
			bChildNode = oHost.contains(oTarget),
			node,

			getFocusable = function (node) {

				var returnVal = false;

				if (!node.compareTo(oHost)) {

					returnVal = this._isDescendant(node) ? node :
									getFocusable.call(this, node.get("parentNode"));

				}

				return returnVal;

			};


		if (bChildNode) {

			//	Check to make sure that the target isn't a child node of one
			//	of the focusable descendants.

			node = getFocusable.call(this, oTarget);

			if (node) {
				oTarget = node;
			}
			else if (!node && this.get(FOCUSED)) {

				//	The target was a non-focusable descendant of the root
				//	node, so the "focused" attribute should be set to false.

	 			this._set(FOCUSED, false);
	 			this._onDocFocus(event);

			}

		}


		if (bChildNode && this._isDescendant(oTarget)) {

			//	Fix general problem in Webkit: mousing down on a button or an
			//	anchor element doesn't focus it.

			//	For all browsers: makes sure that the descendant that
			//	was the target of the mousedown event is now considered the
			//	active descendant.

			this.focus(oTarget);
		}
		else if (UA.webkit && this.get(FOCUSED) &&
			(!bChildNode || (bChildNode && !this._isDescendant(oTarget)))) {

			//	Fix for Webkit:

			//	Document doesn't receive focus in Webkit when the user mouses
			//	down on it, so the "focused" attribute won't get set to the
			//	correct value.

			//	The goal is to force a blur if the user moused down on
			//	either: 1) A descendant node, but not one that managed by
			//	the FocusManager, or 2) an element outside of the
			//	FocusManager

 			this._set(FOCUSED, false);
 			this._onDocFocus(event);

		}

	},


	/**
	* @method _onDocFocus
	* @description "focus" event handler for the owner document of the
	* Focus Manager's Node.
	* @protected
	* @param event {Object} Object representing the DOM event.
	*/
	_onDocFocus: function (event) {

		var oTarget = this._focusTarget || event.target,
			bFocused = this.get(FOCUSED),
			focusClass = this.get(FOCUS_CLASS),
			oFocusedNode = this._focusedNode,
			bInCollection;

		if (this._focusTarget) {
			this._focusTarget = null;
		}


		if (this.get(HOST).contains(oTarget)) {

			//	The target is a descendant of the root Node.

			bInCollection = this._isDescendant(oTarget);

			if (!bFocused && bInCollection) {

				//	The user has focused a focusable descendant.

				bFocused = true;

			}
			else if (bFocused && !bInCollection) {

				//	The user has focused a child of the root Node that is
				//	not one of the descendants managed by this Focus Manager
				//	so clear the currently focused descendant.

				bFocused = false;

			}

		}
		else {

			// The target is some other node in the document.

			bFocused = false;

		}


		if (focusClass) {

			if (oFocusedNode && (!oFocusedNode.compareTo(oTarget) || !bFocused)) {
				this._removeFocusClass();
			}

			if (bInCollection && bFocused) {

				if (focusClass.fn) {
					oTarget = focusClass.fn(oTarget);
					oTarget.addClass(focusClass.className);
				}
				else {
					oTarget.addClass(focusClass);
				}

				this._focusedNode = oTarget;

			}

		}


		this._set(FOCUSED, bFocused);

	},


	/**
	* @method _focusNext
	* @description Keydown event handler that moves focus to the next
	* enabled descendant.
	* @protected
	* @param event {Object} Object representing the DOM event.
	* @param activeDescendant {Number} Number representing the index of the
	* next descendant to be focused
	*/
	_focusNext: function (event, activeDescendant) {

		var nActiveDescendant = activeDescendant || this.get(ACTIVE_DESCENDANT),
			oNode;


		if (this._isDescendant(event.target) &&
			(nActiveDescendant <= this._lastNodeIndex)) {

			nActiveDescendant = nActiveDescendant + 1;

			if (nActiveDescendant === (this._lastNodeIndex + 1) &&
				this.get(CIRCULAR)) {

				nActiveDescendant = 0;

			}

			oNode = this._descendants.item(nActiveDescendant);

            if (oNode) {

                if (oNode.get("disabled")) {
                    this._focusNext(event, nActiveDescendant);
                }
                else {
                    this.focus(nActiveDescendant);
                }

            }

		}

		this._preventScroll(event);

	},


	/**
	* @method _focusPrevious
	* @description Keydown event handler that moves focus to the previous
	* enabled descendant.
	* @protected
	* @param event {Object} Object representing the DOM event.
	* @param activeDescendant {Number} Number representing the index of the
	* next descendant to be focused.
	*/
	_focusPrevious: function (event, activeDescendant) {

		var nActiveDescendant = activeDescendant || this.get(ACTIVE_DESCENDANT),
			oNode;

		if (this._isDescendant(event.target) && nActiveDescendant >= 0) {

			nActiveDescendant = nActiveDescendant - 1;

			if (nActiveDescendant === -1 && this.get(CIRCULAR)) {
				nActiveDescendant = this._lastNodeIndex;
			}

            oNode = this._descendants.item(nActiveDescendant);

            if (oNode) {

                if (oNode.get("disabled")) {
                    this._focusPrevious(event, nActiveDescendant);
                }
                else {
                    this.focus(nActiveDescendant);
                }

            }

		}

		this._preventScroll(event);

	},


	/**
	* @method _afterActiveDescendantChange
	* @description afterChange event handler for the
	* "activeDescendant" attribute.
	* @protected
	* @param event {Object} Object representing the change event.
	*/
	_afterActiveDescendantChange: function (event) {

		var oNode = this._descendants.item(event.prevVal);

		if (oNode) {
			oNode.set(TAB_INDEX, -1);
		}

		oNode = this._descendants.item(event.newVal);

		if (oNode) {
			oNode.set(TAB_INDEX, 0);
		}

	},



	//	Public methods

    initializer: function (config) {

		this.start();

    },

	destructor: function () {

		this.stop();
		this.get(HOST).focusManager = null;

    },


	/**
	* @method focus
	* @description Focuses the active descendant and sets the
	* <code>focused</code> attribute to true.
	* @param index {Number} Optional. Number representing the index of the
	* descendant to be set as the active descendant.
	* @param index {Node} Optional. Node instance representing the
	* descendant to be set as the active descendant.
	*/
	focus: function (index) {

		if (Lang.isUndefined(index)) {
			index = this.get(ACTIVE_DESCENDANT);
		}

		this.set(ACTIVE_DESCENDANT, index, { src: UI });

		var oNode = this._descendants.item(this.get(ACTIVE_DESCENDANT));

		if (oNode) {

			oNode.focus();

			//	In Opera focusing a <BUTTON> element programmatically
			//	will result in the document-level focus event handler
			//	"_onDocFocus" being called, resulting in the handler
			//	incorrectly setting the "focused" Attribute to false.  To fix
			//	this, set a flag ("_focusTarget") that the "_onDocFocus" method
			//	can look for to properly handle this edge case.

			if (UA.opera && oNode.get("nodeName").toLowerCase() === "button") {
				this._focusTarget = oNode;
			}

		}

	},


	/**
	* @method blur
	* @description Blurs the current active descendant and sets the
	* <code>focused</code> attribute to false.
	*/
	blur: function () {

		var oNode;

		if (this.get(FOCUSED)) {

			oNode = this._descendants.item(this.get(ACTIVE_DESCENDANT));

			if (oNode) {

				oNode.blur();

				//	For Opera and Webkit:  Blurring an element in either browser
				//	doesn't result in another element (such as the document)
				//	being focused.  Therefore, the "_onDocFocus" method
				//	responsible for managing the application and removal of the
				//	focus indicator class name is never called.

				this._removeFocusClass();

			}

			this._set(FOCUSED, false, { src: UI });
		}

	},


	/**
	* @method start
	* @description Enables the Focus Manager.
	*/
	start: function () {

		if (this._stopped) {

			this._initDescendants();
			this._attachEventHandlers();

			this._stopped = false;

		}

	},


	/**
	* @method stop
	* @description Disables the Focus Manager by detaching all event handlers.
	*/
	stop: function () {

		if (!this._stopped) {

			this._detachEventHandlers();

			this._descendants = null;
			this._focusedNode = null;
			this._lastNodeIndex = 0;
			this._stopped = true;

		}

	},


	/**
	* @method refresh
	* @description Refreshes the Focus Manager's descendants by re-executing the
	* CSS selector query specified by the <code>descendants</code> attribute.
	*/
	refresh: function () {

		this._initDescendants();

		if (!this._eventHandlers) {
			this._attachEventHandlers();
		}

	}

});


NodeFocusManager.NAME = "nodeFocusManager";
NodeFocusManager.NS = "focusManager";

Y.namespace("Plugin");
Y.Plugin.NodeFocusManager = NodeFocusManager;


}, '3.7.3', {"requires": ["attribute", "node", "plugin", "node-event-simulate", "event-key", "event-focus"]});
