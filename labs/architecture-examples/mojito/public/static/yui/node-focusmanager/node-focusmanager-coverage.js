/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["build/node-focusmanager/node-focusmanager.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/node-focusmanager/node-focusmanager.js",
    code: []
};
_yuitest_coverage["build/node-focusmanager/node-focusmanager.js"].code=["YUI.add('node-focusmanager', function (Y, NAME) {","","/**","* <p>The Focus Manager Node Plugin makes it easy to manage focus among","* a Node's descendants.  Primarily intended to help with widget development,","* the Focus Manager Node Plugin can be used to improve the keyboard","* accessibility of widgets.</p>","*","* <p>","* When designing widgets that manage a set of descendant controls (i.e. buttons","* in a toolbar, tabs in a tablist, menuitems in a menu, etc.) it is important to","* limit the number of descendants in the browser's default tab flow.  The fewer","* number of descendants in the default tab flow, the easier it is for keyboard","* users to navigate between widgets by pressing the tab key.  When a widget has","* focus it should provide a set of shortcut keys (typically the arrow keys)","* to move focus among its descendants.","* </p>","*","* <p>","* To this end, the Focus Manager Node Plugin makes it easy to define a Node's","* focusable descendants, define which descendant should be in the default tab","* flow, and define the keys that move focus among each descendant.","* Additionally, as the CSS","* <a href=\"http://www.w3.org/TR/CSS21/selector.html#x38\"><code>:focus</code></a>","* pseudo class is not supported on all elements in all","* <a href=\"http://developer.yahoo.com/yui/articles/gbs/\">A-Grade browsers</a>,","* the Focus Manager Node Plugin provides an easy, cross-browser means of","* styling focus.","* </p>","*","* @module node-focusmanager","*/","","	//	Frequently used strings","","var ACTIVE_DESCENDANT = \"activeDescendant\",","	ID = \"id\",","	DISABLED = \"disabled\",","	TAB_INDEX = \"tabIndex\",","	FOCUSED = \"focused\",","	FOCUS_CLASS = \"focusClass\",","	CIRCULAR = \"circular\",","	UI = \"UI\",","	KEY = \"key\",","	ACTIVE_DESCENDANT_CHANGE = ACTIVE_DESCENDANT + \"Change\",","	HOST = \"host\",","","	//	Collection of keys that, when pressed, cause the browser viewport","	//	to scroll.","	scrollKeys = {","		37: true,","		38: true,","		39: true,","		40: true","	},","","	clickableElements = {","		\"a\": true,","		\"button\": true,","		\"input\": true,","		\"object\": true","	},","","	//	Library shortcuts","","	Lang = Y.Lang,"," 	UA = Y.UA,","","	/**","	* The NodeFocusManager class is a plugin for a Node instance.  The class is used","	* via the <a href=\"Node.html#method_plug\"><code>plug</code></a> method of Node","	* and should not be instantiated directly.","	* @namespace plugin","	* @class NodeFocusManager","	*/","	NodeFocusManager = function () {","","		NodeFocusManager.superclass.constructor.apply(this, arguments);","","	};","","","NodeFocusManager.ATTRS = {","","	/**","	* Boolean indicating that one of the descendants is focused.","	*","	* @attribute focused","	* @readOnly","	* @default false","	* @type boolean","	*/","	focused: {","","		value: false,","		readOnly: true","","	},","","","	/**","	* String representing the CSS selector used to define the descendant Nodes","	* whose focus should be managed.","	*","	* @attribute descendants","	* @type Y.NodeList","	*/","	descendants: {","","		getter: function (value) {","","			return this.get(HOST).all(value);","","		}","","	},","","","	/**","	* <p>Node, or index of the Node, representing the descendant that is either","	* focused or is focusable (<code>tabIndex</code> attribute is set to 0).","	* The value cannot represent a disabled descendant Node.  Use a value of -1","	* to remove all descendant Nodes from the default tab flow.","	* If no value is specified, the active descendant will be inferred using","	* the following criteria:</p>","	* <ol>","	* <li>Examining the <code>tabIndex</code> attribute of each descendant and","	* using the first descendant whose <code>tabIndex</code> attribute is set","	* to 0</li>","	* <li>If no default can be inferred then the value is set to either 0 or","	* the index of the first enabled descendant.</li>","	* </ol>","	*","	* @attribute activeDescendant","	* @type Number","	*/","	activeDescendant: {","","		setter: function (value) {","","			var isNumber = Lang.isNumber,","				INVALID_VALUE = Y.Attribute.INVALID_VALUE,","				descendantsMap = this._descendantsMap,","				descendants = this._descendants,","				nodeIndex,","				returnValue,","				oNode;","","","			if (isNumber(value)) {","				nodeIndex = value;","				returnValue = nodeIndex;","			}","			else if ((value instanceof Y.Node) && descendantsMap) {","","				nodeIndex = descendantsMap[value.get(ID)];","","				if (isNumber(nodeIndex)) {","					returnValue = nodeIndex;","				}","				else {","","					//	The user passed a reference to a Node that wasn't one","					//	of the descendants.","					returnValue = INVALID_VALUE;","","				}","","			}","			else {","				returnValue = INVALID_VALUE;","			}","","","			if (descendants) {","","				oNode = descendants.item(nodeIndex);","","				if (oNode && oNode.get(\"disabled\")) {","","					//	Setting the \"activeDescendant\" attribute to the index","					//	of a disabled descendant is invalid.","					returnValue = INVALID_VALUE;","","				}","","			}","","			return returnValue;","","		}","","	},","","","	/**","	* Object literal representing the keys to be used to navigate between the","	* next/previous descendant.  The format for the attribute's value is","	* <code>{ next: \"down:40\", previous: \"down:38\" }</code>.  The value for the","	* \"next\" and \"previous\" properties are used to attach","	* <a href=\"event/#keylistener\"><code>key</code></a> event listeners. See","	* the <a href=\"event/#keylistener\">Using the key Event</a> section of","	* the Event documentation for more information on \"key\" event listeners.","	*","	* @attribute keys","	* @type Object","	*/","	keys: {","","		value: {","","			next: null,","			previous: null","","		}","","","	},","","","	/**","	* String representing the name of class applied to the focused active","	* descendant Node.  Can also be an object literal used to define both the","	* class name, and the Node to which the class should be applied.  If using","	* an object literal, the format is:","	* <code>{ className: \"focus\", fn: myFunction }</code>.  The function","	* referenced by the <code>fn</code> property in the object literal will be","	* passed a reference to the currently focused active descendant Node.","	*","	* @attribute focusClass","	* @type String|Object","	*/","	focusClass: { },","","","	/**","	* Boolean indicating if focus should be set to the first/last descendant","	* when the end or beginning of the descendants has been reached.","	*","	* @attribute circular","	* @type Boolean","	* @default true","	*/","	circular: {","		value: true","	}","","};","","Y.extend(NodeFocusManager, Y.Plugin.Base, {","","	//	Protected properties","","	//	Boolean indicating if the NodeFocusManager is active.","	_stopped: true,","","	//	NodeList representing the descendants selected via the","	//	\"descendants\" attribute.","	_descendants: null,","","	//	Object literal mapping the IDs of each descendant to its index in the","	//	\"_descendants\" NodeList.","	_descendantsMap: null,","","	//	Reference to the Node instance to which the focused class (defined","	//	by the \"focusClass\" attribute) is currently applied.","	_focusedNode: null,","","	//	Number representing the index of the last descendant Node.","	_lastNodeIndex: 0,","","	//	Array of handles for event handlers used for a NodeFocusManager instance.","	_eventHandlers: null,","","","","	//	Protected methods","","	/**","	* @method _initDescendants","	* @description Sets the <code>tabIndex</code> attribute of all of the","	* descendants to -1, except the active descendant, whose","	* <code>tabIndex</code> attribute is set to 0.","	* @protected","	*/","	_initDescendants: function () {","","		var descendants = this.get(\"descendants\"),","			descendantsMap = {},","			nFirstEnabled = -1,","			nDescendants,","			nActiveDescendant = this.get(ACTIVE_DESCENDANT),","			oNode,","			sID,","			i = 0;","","","","		if (Lang.isUndefined(nActiveDescendant)) {","			nActiveDescendant = -1;","		}","","","		if (descendants) {","","			nDescendants = descendants.size();","","","            for (i = 0; i < nDescendants; i++) {","","                oNode = descendants.item(i);","","                if (nFirstEnabled === -1 && !oNode.get(DISABLED)) {","                    nFirstEnabled = i;","                }","","","                //	If the user didn't specify a value for the","                //	\"activeDescendant\" attribute try to infer it from","                //	the markup.","","                //	Need to pass \"2\" when using \"getAttribute\" for IE to get","                //	the attribute value as it is set in the markup.","                //	Need to use \"parseInt\" because IE always returns the","                //	value as a number, whereas all other browsers return","                //	the attribute as a string when accessed","                //	via \"getAttribute\".","","                if (nActiveDescendant < 0 &&","                        parseInt(oNode.getAttribute(TAB_INDEX, 2), 10) === 0) {","","                    nActiveDescendant = i;","","                }","","                if (oNode) {","                    oNode.set(TAB_INDEX, -1);","                }","","                sID = oNode.get(ID);","","                if (!sID) {","                    sID = Y.guid();","                    oNode.set(ID, sID);","                }","","                descendantsMap[sID] = i;","","            }","","","            //	If the user didn't specify a value for the","            //	\"activeDescendant\" attribute and no default value could be","            //	determined from the markup, then default to 0.","","            if (nActiveDescendant < 0) {","                nActiveDescendant = 0;","            }","","","            oNode = descendants.item(nActiveDescendant);","","            //	Check to make sure the active descendant isn't disabled,","            //	and fall back to the first enabled descendant if it is.","","            if (!oNode || oNode.get(DISABLED)) {","                oNode = descendants.item(nFirstEnabled);","                nActiveDescendant = nFirstEnabled;","            }","","            this._lastNodeIndex = nDescendants - 1;","            this._descendants = descendants;","            this._descendantsMap = descendantsMap;","","            this.set(ACTIVE_DESCENDANT, nActiveDescendant);","","            //	Need to set the \"tabIndex\" attribute here, since the","            //	\"activeDescendantChange\" event handler used to manage","            //	the setting of the \"tabIndex\" attribute isn't wired up yet.","","            if (oNode) {","                oNode.set(TAB_INDEX, 0);","            }","","		}","","	},","","","	/**","	* @method _isDescendant","	* @description Determines if the specified Node instance is a descendant","	* managed by the Focus Manager.","	* @param node {Node} Node instance to be checked.","	* @return {Boolean} Boolean indicating if the specified Node instance is a","	* descendant managed by the Focus Manager.","	* @protected","	*/","	_isDescendant: function (node) {","","		return (node.get(ID) in this._descendantsMap);","","	},","","","	/**","	* @method _removeFocusClass","	* @description Removes the class name representing focus (as specified by","	* the \"focusClass\" attribute) from the Node instance to which it is","	* currently applied.","	* @protected","	*/","	_removeFocusClass: function () {","","		var oFocusedNode = this._focusedNode,","			focusClass = this.get(FOCUS_CLASS),","			sClassName;","","		if (focusClass) {","			sClassName = Lang.isString(focusClass) ?","				focusClass : focusClass.className;","		}","","		if (oFocusedNode && sClassName) {","			oFocusedNode.removeClass(sClassName);","		}","","	},","","","	/**","	* @method _detachKeyHandler","	* @description Detaches the \"key\" event handlers used to support the \"keys\"","	* attribute.","	* @protected","	*/","	_detachKeyHandler: function () {","","		var prevKeyHandler = this._prevKeyHandler,","			nextKeyHandler = this._nextKeyHandler;","","		if (prevKeyHandler) {","			prevKeyHandler.detach();","		}","","		if (nextKeyHandler) {","			nextKeyHandler.detach();","		}","","	},","","","	/**","	* @method _preventScroll","	* @description Prevents the viewport from scolling when the user presses","	* the up, down, left, or right key.","	* @protected","	*/","	_preventScroll: function (event) {","","		if (scrollKeys[event.keyCode] && this._isDescendant(event.target)) {","			event.preventDefault();","		}","","	},","","","	/**","	* @method _fireClick","	* @description Fires the click event if the enter key is pressed while","	* focused on an HTML element that is not natively clickable.","	* @protected","	*/","	_fireClick: function (event) {","","		var oTarget = event.target,","			sNodeName = oTarget.get(\"nodeName\").toLowerCase();","","		if (event.keyCode === 13 && (!clickableElements[sNodeName] ||","				(sNodeName === \"a\" && !oTarget.getAttribute(\"href\")))) {","","","			oTarget.simulate(\"click\");","","		}","","	},","","","	/**","	* @method _attachKeyHandler","	* @description Attaches the \"key\" event handlers used to support the \"keys\"","	* attribute.","	* @protected","	*/","	_attachKeyHandler: function () {","","		this._detachKeyHandler();","","		var sNextKey = this.get(\"keys.next\"),","			sPrevKey = this.get(\"keys.previous\"),","			oNode = this.get(HOST),","			aHandlers = this._eventHandlers;","","		if (sPrevKey) {"," 			this._prevKeyHandler =","				Y.on(KEY, Y.bind(this._focusPrevious, this), oNode, sPrevKey);","		}","","		if (sNextKey) {"," 			this._nextKeyHandler =","				Y.on(KEY, Y.bind(this._focusNext, this), oNode, sNextKey);","		}","","","		//	In Opera it is necessary to call the \"preventDefault\" method in","		//	response to the user pressing the arrow keys in order to prevent","		//	the viewport from scrolling when the user is moving focus among","		//	the focusable descendants.","","		if (UA.opera) {","			aHandlers.push(oNode.on(\"keypress\", this._preventScroll, this));","		}","","","		//	For all browsers except Opera: HTML elements that are not natively","		//	focusable but made focusable via the tabIndex attribute don't","		//	fire a click event when the user presses the enter key.  It is","		//	possible to work around this problem by simplying dispatching a","		//	click event in response to the user pressing the enter key.","","		if (!UA.opera) {","			aHandlers.push(oNode.on(\"keypress\", this._fireClick, this));","		}","","	},","","","	/**","	* @method _detachEventHandlers","	* @description Detaches all event handlers used by the Focus Manager.","	* @protected","	*/","	_detachEventHandlers: function () {","","		this._detachKeyHandler();","","		var aHandlers = this._eventHandlers;","","		if (aHandlers) {","","			Y.Array.each(aHandlers, function (handle) {","				handle.detach();","			});","","			this._eventHandlers = null;","","		}","","	},","","","	/**","	* @method _detachEventHandlers","	* @description Attaches all event handlers used by the Focus Manager.","	* @protected","	*/","	_attachEventHandlers: function () {","","		var descendants = this._descendants,","			aHandlers,","			oDocument,","			handle;","","		if (descendants && descendants.size()) {","","			aHandlers = this._eventHandlers || [];","			oDocument = this.get(HOST).get(\"ownerDocument\");","","","			if (aHandlers.length === 0) {","","","				aHandlers.push(oDocument.on(\"focus\", this._onDocFocus, this));","","				aHandlers.push(oDocument.on(\"mousedown\",","					this._onDocMouseDown, this));","","				aHandlers.push(","						this.after(\"keysChange\", this._attachKeyHandler));","","				aHandlers.push(","						this.after(\"descendantsChange\", this._initDescendants));","","				aHandlers.push(","						this.after(ACTIVE_DESCENDANT_CHANGE,","								this._afterActiveDescendantChange));","","","				//	For performance: defer attaching all key-related event","				//	handlers until the first time one of the specified","				//	descendants receives focus.","","				handle = this.after(\"focusedChange\", Y.bind(function (event) {","","					if (event.newVal) {","","","						this._attachKeyHandler();","","						//	Detach this \"focusedChange\" handler so that the","						//	key-related handlers only get attached once.","","						handle.detach();","","					}","","				}, this));","","				aHandlers.push(handle);","","			}","","","			this._eventHandlers = aHandlers;","","		}","","	},","","","	//	Protected event handlers","","	/**","	* @method _onDocMouseDown","	* @description \"mousedown\" event handler for the owner document of the","	* Focus Manager's Node.","	* @protected","	* @param event {Object} Object representing the DOM event.","	*/","	_onDocMouseDown: function (event) {","","		var oHost = this.get(HOST),","			oTarget = event.target,","			bChildNode = oHost.contains(oTarget),","			node,","","			getFocusable = function (node) {","","				var returnVal = false;","","				if (!node.compareTo(oHost)) {","","					returnVal = this._isDescendant(node) ? node :","									getFocusable.call(this, node.get(\"parentNode\"));","","				}","","				return returnVal;","","			};","","","		if (bChildNode) {","","			//	Check to make sure that the target isn't a child node of one","			//	of the focusable descendants.","","			node = getFocusable.call(this, oTarget);","","			if (node) {","				oTarget = node;","			}","			else if (!node && this.get(FOCUSED)) {","","				//	The target was a non-focusable descendant of the root","				//	node, so the \"focused\" attribute should be set to false.","","	 			this._set(FOCUSED, false);","	 			this._onDocFocus(event);","","			}","","		}","","","		if (bChildNode && this._isDescendant(oTarget)) {","","			//	Fix general problem in Webkit: mousing down on a button or an","			//	anchor element doesn't focus it.","","			//	For all browsers: makes sure that the descendant that","			//	was the target of the mousedown event is now considered the","			//	active descendant.","","			this.focus(oTarget);","		}","		else if (UA.webkit && this.get(FOCUSED) &&","			(!bChildNode || (bChildNode && !this._isDescendant(oTarget)))) {","","			//	Fix for Webkit:","","			//	Document doesn't receive focus in Webkit when the user mouses","			//	down on it, so the \"focused\" attribute won't get set to the","			//	correct value.","","			//	The goal is to force a blur if the user moused down on","			//	either: 1) A descendant node, but not one that managed by","			//	the FocusManager, or 2) an element outside of the","			//	FocusManager",""," 			this._set(FOCUSED, false);"," 			this._onDocFocus(event);","","		}","","	},","","","	/**","	* @method _onDocFocus","	* @description \"focus\" event handler for the owner document of the","	* Focus Manager's Node.","	* @protected","	* @param event {Object} Object representing the DOM event.","	*/","	_onDocFocus: function (event) {","","		var oTarget = this._focusTarget || event.target,","			bFocused = this.get(FOCUSED),","			focusClass = this.get(FOCUS_CLASS),","			oFocusedNode = this._focusedNode,","			bInCollection;","","		if (this._focusTarget) {","			this._focusTarget = null;","		}","","","		if (this.get(HOST).contains(oTarget)) {","","			//	The target is a descendant of the root Node.","","			bInCollection = this._isDescendant(oTarget);","","			if (!bFocused && bInCollection) {","","				//	The user has focused a focusable descendant.","","				bFocused = true;","","			}","			else if (bFocused && !bInCollection) {","","				//	The user has focused a child of the root Node that is","				//	not one of the descendants managed by this Focus Manager","				//	so clear the currently focused descendant.","","				bFocused = false;","","			}","","		}","		else {","","			// The target is some other node in the document.","","			bFocused = false;","","		}","","","		if (focusClass) {","","			if (oFocusedNode && (!oFocusedNode.compareTo(oTarget) || !bFocused)) {","				this._removeFocusClass();","			}","","			if (bInCollection && bFocused) {","","				if (focusClass.fn) {","					oTarget = focusClass.fn(oTarget);","					oTarget.addClass(focusClass.className);","				}","				else {","					oTarget.addClass(focusClass);","				}","","				this._focusedNode = oTarget;","","			}","","		}","","","		this._set(FOCUSED, bFocused);","","	},","","","	/**","	* @method _focusNext","	* @description Keydown event handler that moves focus to the next","	* enabled descendant.","	* @protected","	* @param event {Object} Object representing the DOM event.","	* @param activeDescendant {Number} Number representing the index of the","	* next descendant to be focused","	*/","	_focusNext: function (event, activeDescendant) {","","		var nActiveDescendant = activeDescendant || this.get(ACTIVE_DESCENDANT),","			oNode;","","","		if (this._isDescendant(event.target) &&","			(nActiveDescendant <= this._lastNodeIndex)) {","","			nActiveDescendant = nActiveDescendant + 1;","","			if (nActiveDescendant === (this._lastNodeIndex + 1) &&","				this.get(CIRCULAR)) {","","				nActiveDescendant = 0;","","			}","","			oNode = this._descendants.item(nActiveDescendant);","","            if (oNode) {","","                if (oNode.get(\"disabled\")) {","                    this._focusNext(event, nActiveDescendant);","                }","                else {","                    this.focus(nActiveDescendant);","                }","","            }","","		}","","		this._preventScroll(event);","","	},","","","	/**","	* @method _focusPrevious","	* @description Keydown event handler that moves focus to the previous","	* enabled descendant.","	* @protected","	* @param event {Object} Object representing the DOM event.","	* @param activeDescendant {Number} Number representing the index of the","	* next descendant to be focused.","	*/","	_focusPrevious: function (event, activeDescendant) {","","		var nActiveDescendant = activeDescendant || this.get(ACTIVE_DESCENDANT),","			oNode;","","		if (this._isDescendant(event.target) && nActiveDescendant >= 0) {","","			nActiveDescendant = nActiveDescendant - 1;","","			if (nActiveDescendant === -1 && this.get(CIRCULAR)) {","				nActiveDescendant = this._lastNodeIndex;","			}","","            oNode = this._descendants.item(nActiveDescendant);","","            if (oNode) {","","                if (oNode.get(\"disabled\")) {","                    this._focusPrevious(event, nActiveDescendant);","                }","                else {","                    this.focus(nActiveDescendant);","                }","","            }","","		}","","		this._preventScroll(event);","","	},","","","	/**","	* @method _afterActiveDescendantChange","	* @description afterChange event handler for the","	* \"activeDescendant\" attribute.","	* @protected","	* @param event {Object} Object representing the change event.","	*/","	_afterActiveDescendantChange: function (event) {","","		var oNode = this._descendants.item(event.prevVal);","","		if (oNode) {","			oNode.set(TAB_INDEX, -1);","		}","","		oNode = this._descendants.item(event.newVal);","","		if (oNode) {","			oNode.set(TAB_INDEX, 0);","		}","","	},","","","","	//	Public methods","","    initializer: function (config) {","","		this.start();","","    },","","	destructor: function () {","","		this.stop();","		this.get(HOST).focusManager = null;","","    },","","","	/**","	* @method focus","	* @description Focuses the active descendant and sets the","	* <code>focused</code> attribute to true.","	* @param index {Number} Optional. Number representing the index of the","	* descendant to be set as the active descendant.","	* @param index {Node} Optional. Node instance representing the","	* descendant to be set as the active descendant.","	*/","	focus: function (index) {","","		if (Lang.isUndefined(index)) {","			index = this.get(ACTIVE_DESCENDANT);","		}","","		this.set(ACTIVE_DESCENDANT, index, { src: UI });","","		var oNode = this._descendants.item(this.get(ACTIVE_DESCENDANT));","","		if (oNode) {","","			oNode.focus();","","			//	In Opera focusing a <BUTTON> element programmatically","			//	will result in the document-level focus event handler","			//	\"_onDocFocus\" being called, resulting in the handler","			//	incorrectly setting the \"focused\" Attribute to false.  To fix","			//	this, set a flag (\"_focusTarget\") that the \"_onDocFocus\" method","			//	can look for to properly handle this edge case.","","			if (UA.opera && oNode.get(\"nodeName\").toLowerCase() === \"button\") {","				this._focusTarget = oNode;","			}","","		}","","	},","","","	/**","	* @method blur","	* @description Blurs the current active descendant and sets the","	* <code>focused</code> attribute to false.","	*/","	blur: function () {","","		var oNode;","","		if (this.get(FOCUSED)) {","","			oNode = this._descendants.item(this.get(ACTIVE_DESCENDANT));","","			if (oNode) {","","				oNode.blur();","","				//	For Opera and Webkit:  Blurring an element in either browser","				//	doesn't result in another element (such as the document)","				//	being focused.  Therefore, the \"_onDocFocus\" method","				//	responsible for managing the application and removal of the","				//	focus indicator class name is never called.","","				this._removeFocusClass();","","			}","","			this._set(FOCUSED, false, { src: UI });","		}","","	},","","","	/**","	* @method start","	* @description Enables the Focus Manager.","	*/","	start: function () {","","		if (this._stopped) {","","			this._initDescendants();","			this._attachEventHandlers();","","			this._stopped = false;","","		}","","	},","","","	/**","	* @method stop","	* @description Disables the Focus Manager by detaching all event handlers.","	*/","	stop: function () {","","		if (!this._stopped) {","","			this._detachEventHandlers();","","			this._descendants = null;","			this._focusedNode = null;","			this._lastNodeIndex = 0;","			this._stopped = true;","","		}","","	},","","","	/**","	* @method refresh","	* @description Refreshes the Focus Manager's descendants by re-executing the","	* CSS selector query specified by the <code>descendants</code> attribute.","	*/","	refresh: function () {","","		this._initDescendants();","","		if (!this._eventHandlers) {","			this._attachEventHandlers();","		}","","	}","","});","","","NodeFocusManager.NAME = \"nodeFocusManager\";","NodeFocusManager.NS = \"focusManager\";","","Y.namespace(\"Plugin\");","Y.Plugin.NodeFocusManager = NodeFocusManager;","","","}, '3.7.3', {\"requires\": [\"attribute\", \"node\", \"plugin\", \"node-event-simulate\", \"event-key\", \"event-focus\"]});"];
_yuitest_coverage["build/node-focusmanager/node-focusmanager.js"].lines = {"1":0,"36":0,"78":0,"83":0,"112":0,"141":0,"150":0,"151":0,"152":0,"154":0,"156":0,"158":0,"159":0,"165":0,"171":0,"175":0,"177":0,"179":0,"183":0,"189":0,"250":0,"288":0,"299":0,"300":0,"304":0,"306":0,"309":0,"311":0,"313":0,"314":0,"329":0,"332":0,"336":0,"337":0,"340":0,"342":0,"343":0,"344":0,"347":0,"356":0,"357":0,"361":0,"366":0,"367":0,"368":0,"371":0,"372":0,"373":0,"375":0,"381":0,"382":0,"401":0,"415":0,"419":0,"420":0,"424":0,"425":0,"439":0,"442":0,"443":0,"446":0,"447":0,"461":0,"462":0,"476":0,"479":0,"483":0,"498":0,"500":0,"505":0,"506":0,"510":0,"511":0,"521":0,"522":0,"532":0,"533":0,"546":0,"548":0,"550":0,"552":0,"553":0,"556":0,"570":0,"575":0,"577":0,"578":0,"581":0,"584":0,"586":0,"589":0,"592":0,"595":0,"604":0,"606":0,"609":0,"614":0,"620":0,"625":0,"643":0,"650":0,"652":0,"654":0,"659":0,"664":0,"669":0,"671":0,"672":0,"674":0,"679":0,"680":0,"687":0,"696":0,"698":0,"712":0,"713":0,"729":0,"735":0,"736":0,"740":0,"744":0,"746":0,"750":0,"753":0,"759":0,"768":0,"773":0,"775":0,"776":0,"779":0,"781":0,"782":0,"783":0,"786":0,"789":0,"796":0,"812":0,"816":0,"819":0,"821":0,"824":0,"828":0,"830":0,"832":0,"833":0,"836":0,"843":0,"859":0,"862":0,"864":0,"866":0,"867":0,"870":0,"872":0,"874":0,"875":0,"878":0,"885":0,"899":0,"901":0,"902":0,"905":0,"907":0,"908":0,"919":0,"925":0,"926":0,"942":0,"943":0,"946":0,"948":0,"950":0,"952":0,"961":0,"962":0,"977":0,"979":0,"981":0,"983":0,"985":0,"993":0,"997":0,"1009":0,"1011":0,"1012":0,"1014":0,"1027":0,"1029":0,"1031":0,"1032":0,"1033":0,"1034":0,"1048":0,"1050":0,"1051":0,"1059":0,"1060":0,"1062":0,"1063":0};
_yuitest_coverage["build/node-focusmanager/node-focusmanager.js"].functions = {"NodeFocusManager:76":0,"getter:110":0,"setter:139":0,"_initDescendants:286":0,"_isDescendant:399":0,"_removeFocusClass:413":0,"_detachKeyHandler:437":0,"_preventScroll:459":0,"_fireClick:474":0,"_attachKeyHandler:496":0,"(anonymous 2):552":0,"_detachEventHandlers:544":0,"(anonymous 3):604":0,"_attachEventHandlers:568":0,"getFocusable:648":0,"_onDocMouseDown:641":0,"_onDocFocus:727":0,"_focusNext:810":0,"_focusPrevious:857":0,"_afterActiveDescendantChange:897":0,"initializer:917":0,"destructor:923":0,"focus:940":0,"blur:975":0,"start:1007":0,"stop:1025":0,"refresh:1046":0,"(anonymous 1):1":0};
_yuitest_coverage["build/node-focusmanager/node-focusmanager.js"].coveredLines = 199;
_yuitest_coverage["build/node-focusmanager/node-focusmanager.js"].coveredFunctions = 28;
_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 1);
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

_yuitest_coverfunc("build/node-focusmanager/node-focusmanager.js", "(anonymous 1)", 1);
_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 36);
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

		_yuitest_coverfunc("build/node-focusmanager/node-focusmanager.js", "NodeFocusManager", 76);
_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 78);
NodeFocusManager.superclass.constructor.apply(this, arguments);

	};


_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 83);
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

			_yuitest_coverfunc("build/node-focusmanager/node-focusmanager.js", "getter", 110);
_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 112);
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

			_yuitest_coverfunc("build/node-focusmanager/node-focusmanager.js", "setter", 139);
_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 141);
var isNumber = Lang.isNumber,
				INVALID_VALUE = Y.Attribute.INVALID_VALUE,
				descendantsMap = this._descendantsMap,
				descendants = this._descendants,
				nodeIndex,
				returnValue,
				oNode;


			_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 150);
if (isNumber(value)) {
				_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 151);
nodeIndex = value;
				_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 152);
returnValue = nodeIndex;
			}
			else {_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 154);
if ((value instanceof Y.Node) && descendantsMap) {

				_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 156);
nodeIndex = descendantsMap[value.get(ID)];

				_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 158);
if (isNumber(nodeIndex)) {
					_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 159);
returnValue = nodeIndex;
				}
				else {

					//	The user passed a reference to a Node that wasn't one
					//	of the descendants.
					_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 165);
returnValue = INVALID_VALUE;

				}

			}
			else {
				_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 171);
returnValue = INVALID_VALUE;
			}}


			_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 175);
if (descendants) {

				_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 177);
oNode = descendants.item(nodeIndex);

				_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 179);
if (oNode && oNode.get("disabled")) {

					//	Setting the "activeDescendant" attribute to the index
					//	of a disabled descendant is invalid.
					_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 183);
returnValue = INVALID_VALUE;

				}

			}

			_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 189);
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

_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 250);
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

		_yuitest_coverfunc("build/node-focusmanager/node-focusmanager.js", "_initDescendants", 286);
_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 288);
var descendants = this.get("descendants"),
			descendantsMap = {},
			nFirstEnabled = -1,
			nDescendants,
			nActiveDescendant = this.get(ACTIVE_DESCENDANT),
			oNode,
			sID,
			i = 0;



		_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 299);
if (Lang.isUndefined(nActiveDescendant)) {
			_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 300);
nActiveDescendant = -1;
		}


		_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 304);
if (descendants) {

			_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 306);
nDescendants = descendants.size();


            _yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 309);
for (i = 0; i < nDescendants; i++) {

                _yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 311);
oNode = descendants.item(i);

                _yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 313);
if (nFirstEnabled === -1 && !oNode.get(DISABLED)) {
                    _yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 314);
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

                _yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 329);
if (nActiveDescendant < 0 &&
                        parseInt(oNode.getAttribute(TAB_INDEX, 2), 10) === 0) {

                    _yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 332);
nActiveDescendant = i;

                }

                _yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 336);
if (oNode) {
                    _yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 337);
oNode.set(TAB_INDEX, -1);
                }

                _yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 340);
sID = oNode.get(ID);

                _yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 342);
if (!sID) {
                    _yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 343);
sID = Y.guid();
                    _yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 344);
oNode.set(ID, sID);
                }

                _yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 347);
descendantsMap[sID] = i;

            }


            //	If the user didn't specify a value for the
            //	"activeDescendant" attribute and no default value could be
            //	determined from the markup, then default to 0.

            _yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 356);
if (nActiveDescendant < 0) {
                _yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 357);
nActiveDescendant = 0;
            }


            _yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 361);
oNode = descendants.item(nActiveDescendant);

            //	Check to make sure the active descendant isn't disabled,
            //	and fall back to the first enabled descendant if it is.

            _yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 366);
if (!oNode || oNode.get(DISABLED)) {
                _yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 367);
oNode = descendants.item(nFirstEnabled);
                _yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 368);
nActiveDescendant = nFirstEnabled;
            }

            _yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 371);
this._lastNodeIndex = nDescendants - 1;
            _yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 372);
this._descendants = descendants;
            _yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 373);
this._descendantsMap = descendantsMap;

            _yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 375);
this.set(ACTIVE_DESCENDANT, nActiveDescendant);

            //	Need to set the "tabIndex" attribute here, since the
            //	"activeDescendantChange" event handler used to manage
            //	the setting of the "tabIndex" attribute isn't wired up yet.

            _yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 381);
if (oNode) {
                _yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 382);
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

		_yuitest_coverfunc("build/node-focusmanager/node-focusmanager.js", "_isDescendant", 399);
_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 401);
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

		_yuitest_coverfunc("build/node-focusmanager/node-focusmanager.js", "_removeFocusClass", 413);
_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 415);
var oFocusedNode = this._focusedNode,
			focusClass = this.get(FOCUS_CLASS),
			sClassName;

		_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 419);
if (focusClass) {
			_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 420);
sClassName = Lang.isString(focusClass) ?
				focusClass : focusClass.className;
		}

		_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 424);
if (oFocusedNode && sClassName) {
			_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 425);
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

		_yuitest_coverfunc("build/node-focusmanager/node-focusmanager.js", "_detachKeyHandler", 437);
_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 439);
var prevKeyHandler = this._prevKeyHandler,
			nextKeyHandler = this._nextKeyHandler;

		_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 442);
if (prevKeyHandler) {
			_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 443);
prevKeyHandler.detach();
		}

		_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 446);
if (nextKeyHandler) {
			_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 447);
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

		_yuitest_coverfunc("build/node-focusmanager/node-focusmanager.js", "_preventScroll", 459);
_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 461);
if (scrollKeys[event.keyCode] && this._isDescendant(event.target)) {
			_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 462);
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

		_yuitest_coverfunc("build/node-focusmanager/node-focusmanager.js", "_fireClick", 474);
_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 476);
var oTarget = event.target,
			sNodeName = oTarget.get("nodeName").toLowerCase();

		_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 479);
if (event.keyCode === 13 && (!clickableElements[sNodeName] ||
				(sNodeName === "a" && !oTarget.getAttribute("href")))) {


			_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 483);
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

		_yuitest_coverfunc("build/node-focusmanager/node-focusmanager.js", "_attachKeyHandler", 496);
_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 498);
this._detachKeyHandler();

		_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 500);
var sNextKey = this.get("keys.next"),
			sPrevKey = this.get("keys.previous"),
			oNode = this.get(HOST),
			aHandlers = this._eventHandlers;

		_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 505);
if (sPrevKey) {
 			_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 506);
this._prevKeyHandler =
				Y.on(KEY, Y.bind(this._focusPrevious, this), oNode, sPrevKey);
		}

		_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 510);
if (sNextKey) {
 			_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 511);
this._nextKeyHandler =
				Y.on(KEY, Y.bind(this._focusNext, this), oNode, sNextKey);
		}


		//	In Opera it is necessary to call the "preventDefault" method in
		//	response to the user pressing the arrow keys in order to prevent
		//	the viewport from scrolling when the user is moving focus among
		//	the focusable descendants.

		_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 521);
if (UA.opera) {
			_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 522);
aHandlers.push(oNode.on("keypress", this._preventScroll, this));
		}


		//	For all browsers except Opera: HTML elements that are not natively
		//	focusable but made focusable via the tabIndex attribute don't
		//	fire a click event when the user presses the enter key.  It is
		//	possible to work around this problem by simplying dispatching a
		//	click event in response to the user pressing the enter key.

		_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 532);
if (!UA.opera) {
			_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 533);
aHandlers.push(oNode.on("keypress", this._fireClick, this));
		}

	},


	/**
	* @method _detachEventHandlers
	* @description Detaches all event handlers used by the Focus Manager.
	* @protected
	*/
	_detachEventHandlers: function () {

		_yuitest_coverfunc("build/node-focusmanager/node-focusmanager.js", "_detachEventHandlers", 544);
_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 546);
this._detachKeyHandler();

		_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 548);
var aHandlers = this._eventHandlers;

		_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 550);
if (aHandlers) {

			_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 552);
Y.Array.each(aHandlers, function (handle) {
				_yuitest_coverfunc("build/node-focusmanager/node-focusmanager.js", "(anonymous 2)", 552);
_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 553);
handle.detach();
			});

			_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 556);
this._eventHandlers = null;

		}

	},


	/**
	* @method _detachEventHandlers
	* @description Attaches all event handlers used by the Focus Manager.
	* @protected
	*/
	_attachEventHandlers: function () {

		_yuitest_coverfunc("build/node-focusmanager/node-focusmanager.js", "_attachEventHandlers", 568);
_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 570);
var descendants = this._descendants,
			aHandlers,
			oDocument,
			handle;

		_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 575);
if (descendants && descendants.size()) {

			_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 577);
aHandlers = this._eventHandlers || [];
			_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 578);
oDocument = this.get(HOST).get("ownerDocument");


			_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 581);
if (aHandlers.length === 0) {


				_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 584);
aHandlers.push(oDocument.on("focus", this._onDocFocus, this));

				_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 586);
aHandlers.push(oDocument.on("mousedown",
					this._onDocMouseDown, this));

				_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 589);
aHandlers.push(
						this.after("keysChange", this._attachKeyHandler));

				_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 592);
aHandlers.push(
						this.after("descendantsChange", this._initDescendants));

				_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 595);
aHandlers.push(
						this.after(ACTIVE_DESCENDANT_CHANGE,
								this._afterActiveDescendantChange));


				//	For performance: defer attaching all key-related event
				//	handlers until the first time one of the specified
				//	descendants receives focus.

				_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 604);
handle = this.after("focusedChange", Y.bind(function (event) {

					_yuitest_coverfunc("build/node-focusmanager/node-focusmanager.js", "(anonymous 3)", 604);
_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 606);
if (event.newVal) {


						_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 609);
this._attachKeyHandler();

						//	Detach this "focusedChange" handler so that the
						//	key-related handlers only get attached once.

						_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 614);
handle.detach();

					}

				}, this));

				_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 620);
aHandlers.push(handle);

			}


			_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 625);
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

		_yuitest_coverfunc("build/node-focusmanager/node-focusmanager.js", "_onDocMouseDown", 641);
_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 643);
var oHost = this.get(HOST),
			oTarget = event.target,
			bChildNode = oHost.contains(oTarget),
			node,

			getFocusable = function (node) {

				_yuitest_coverfunc("build/node-focusmanager/node-focusmanager.js", "getFocusable", 648);
_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 650);
var returnVal = false;

				_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 652);
if (!node.compareTo(oHost)) {

					_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 654);
returnVal = this._isDescendant(node) ? node :
									getFocusable.call(this, node.get("parentNode"));

				}

				_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 659);
return returnVal;

			};


		_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 664);
if (bChildNode) {

			//	Check to make sure that the target isn't a child node of one
			//	of the focusable descendants.

			_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 669);
node = getFocusable.call(this, oTarget);

			_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 671);
if (node) {
				_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 672);
oTarget = node;
			}
			else {_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 674);
if (!node && this.get(FOCUSED)) {

				//	The target was a non-focusable descendant of the root
				//	node, so the "focused" attribute should be set to false.

	 			_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 679);
this._set(FOCUSED, false);
	 			_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 680);
this._onDocFocus(event);

			}}

		}


		_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 687);
if (bChildNode && this._isDescendant(oTarget)) {

			//	Fix general problem in Webkit: mousing down on a button or an
			//	anchor element doesn't focus it.

			//	For all browsers: makes sure that the descendant that
			//	was the target of the mousedown event is now considered the
			//	active descendant.

			_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 696);
this.focus(oTarget);
		}
		else {_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 698);
if (UA.webkit && this.get(FOCUSED) &&
			(!bChildNode || (bChildNode && !this._isDescendant(oTarget)))) {

			//	Fix for Webkit:

			//	Document doesn't receive focus in Webkit when the user mouses
			//	down on it, so the "focused" attribute won't get set to the
			//	correct value.

			//	The goal is to force a blur if the user moused down on
			//	either: 1) A descendant node, but not one that managed by
			//	the FocusManager, or 2) an element outside of the
			//	FocusManager

 			_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 712);
this._set(FOCUSED, false);
 			_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 713);
this._onDocFocus(event);

		}}

	},


	/**
	* @method _onDocFocus
	* @description "focus" event handler for the owner document of the
	* Focus Manager's Node.
	* @protected
	* @param event {Object} Object representing the DOM event.
	*/
	_onDocFocus: function (event) {

		_yuitest_coverfunc("build/node-focusmanager/node-focusmanager.js", "_onDocFocus", 727);
_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 729);
var oTarget = this._focusTarget || event.target,
			bFocused = this.get(FOCUSED),
			focusClass = this.get(FOCUS_CLASS),
			oFocusedNode = this._focusedNode,
			bInCollection;

		_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 735);
if (this._focusTarget) {
			_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 736);
this._focusTarget = null;
		}


		_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 740);
if (this.get(HOST).contains(oTarget)) {

			//	The target is a descendant of the root Node.

			_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 744);
bInCollection = this._isDescendant(oTarget);

			_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 746);
if (!bFocused && bInCollection) {

				//	The user has focused a focusable descendant.

				_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 750);
bFocused = true;

			}
			else {_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 753);
if (bFocused && !bInCollection) {

				//	The user has focused a child of the root Node that is
				//	not one of the descendants managed by this Focus Manager
				//	so clear the currently focused descendant.

				_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 759);
bFocused = false;

			}}

		}
		else {

			// The target is some other node in the document.

			_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 768);
bFocused = false;

		}


		_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 773);
if (focusClass) {

			_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 775);
if (oFocusedNode && (!oFocusedNode.compareTo(oTarget) || !bFocused)) {
				_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 776);
this._removeFocusClass();
			}

			_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 779);
if (bInCollection && bFocused) {

				_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 781);
if (focusClass.fn) {
					_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 782);
oTarget = focusClass.fn(oTarget);
					_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 783);
oTarget.addClass(focusClass.className);
				}
				else {
					_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 786);
oTarget.addClass(focusClass);
				}

				_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 789);
this._focusedNode = oTarget;

			}

		}


		_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 796);
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

		_yuitest_coverfunc("build/node-focusmanager/node-focusmanager.js", "_focusNext", 810);
_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 812);
var nActiveDescendant = activeDescendant || this.get(ACTIVE_DESCENDANT),
			oNode;


		_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 816);
if (this._isDescendant(event.target) &&
			(nActiveDescendant <= this._lastNodeIndex)) {

			_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 819);
nActiveDescendant = nActiveDescendant + 1;

			_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 821);
if (nActiveDescendant === (this._lastNodeIndex + 1) &&
				this.get(CIRCULAR)) {

				_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 824);
nActiveDescendant = 0;

			}

			_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 828);
oNode = this._descendants.item(nActiveDescendant);

            _yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 830);
if (oNode) {

                _yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 832);
if (oNode.get("disabled")) {
                    _yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 833);
this._focusNext(event, nActiveDescendant);
                }
                else {
                    _yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 836);
this.focus(nActiveDescendant);
                }

            }

		}

		_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 843);
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

		_yuitest_coverfunc("build/node-focusmanager/node-focusmanager.js", "_focusPrevious", 857);
_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 859);
var nActiveDescendant = activeDescendant || this.get(ACTIVE_DESCENDANT),
			oNode;

		_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 862);
if (this._isDescendant(event.target) && nActiveDescendant >= 0) {

			_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 864);
nActiveDescendant = nActiveDescendant - 1;

			_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 866);
if (nActiveDescendant === -1 && this.get(CIRCULAR)) {
				_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 867);
nActiveDescendant = this._lastNodeIndex;
			}

            _yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 870);
oNode = this._descendants.item(nActiveDescendant);

            _yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 872);
if (oNode) {

                _yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 874);
if (oNode.get("disabled")) {
                    _yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 875);
this._focusPrevious(event, nActiveDescendant);
                }
                else {
                    _yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 878);
this.focus(nActiveDescendant);
                }

            }

		}

		_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 885);
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

		_yuitest_coverfunc("build/node-focusmanager/node-focusmanager.js", "_afterActiveDescendantChange", 897);
_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 899);
var oNode = this._descendants.item(event.prevVal);

		_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 901);
if (oNode) {
			_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 902);
oNode.set(TAB_INDEX, -1);
		}

		_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 905);
oNode = this._descendants.item(event.newVal);

		_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 907);
if (oNode) {
			_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 908);
oNode.set(TAB_INDEX, 0);
		}

	},



	//	Public methods

    initializer: function (config) {

		_yuitest_coverfunc("build/node-focusmanager/node-focusmanager.js", "initializer", 917);
_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 919);
this.start();

    },

	destructor: function () {

		_yuitest_coverfunc("build/node-focusmanager/node-focusmanager.js", "destructor", 923);
_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 925);
this.stop();
		_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 926);
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

		_yuitest_coverfunc("build/node-focusmanager/node-focusmanager.js", "focus", 940);
_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 942);
if (Lang.isUndefined(index)) {
			_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 943);
index = this.get(ACTIVE_DESCENDANT);
		}

		_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 946);
this.set(ACTIVE_DESCENDANT, index, { src: UI });

		_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 948);
var oNode = this._descendants.item(this.get(ACTIVE_DESCENDANT));

		_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 950);
if (oNode) {

			_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 952);
oNode.focus();

			//	In Opera focusing a <BUTTON> element programmatically
			//	will result in the document-level focus event handler
			//	"_onDocFocus" being called, resulting in the handler
			//	incorrectly setting the "focused" Attribute to false.  To fix
			//	this, set a flag ("_focusTarget") that the "_onDocFocus" method
			//	can look for to properly handle this edge case.

			_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 961);
if (UA.opera && oNode.get("nodeName").toLowerCase() === "button") {
				_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 962);
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

		_yuitest_coverfunc("build/node-focusmanager/node-focusmanager.js", "blur", 975);
_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 977);
var oNode;

		_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 979);
if (this.get(FOCUSED)) {

			_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 981);
oNode = this._descendants.item(this.get(ACTIVE_DESCENDANT));

			_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 983);
if (oNode) {

				_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 985);
oNode.blur();

				//	For Opera and Webkit:  Blurring an element in either browser
				//	doesn't result in another element (such as the document)
				//	being focused.  Therefore, the "_onDocFocus" method
				//	responsible for managing the application and removal of the
				//	focus indicator class name is never called.

				_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 993);
this._removeFocusClass();

			}

			_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 997);
this._set(FOCUSED, false, { src: UI });
		}

	},


	/**
	* @method start
	* @description Enables the Focus Manager.
	*/
	start: function () {

		_yuitest_coverfunc("build/node-focusmanager/node-focusmanager.js", "start", 1007);
_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 1009);
if (this._stopped) {

			_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 1011);
this._initDescendants();
			_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 1012);
this._attachEventHandlers();

			_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 1014);
this._stopped = false;

		}

	},


	/**
	* @method stop
	* @description Disables the Focus Manager by detaching all event handlers.
	*/
	stop: function () {

		_yuitest_coverfunc("build/node-focusmanager/node-focusmanager.js", "stop", 1025);
_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 1027);
if (!this._stopped) {

			_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 1029);
this._detachEventHandlers();

			_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 1031);
this._descendants = null;
			_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 1032);
this._focusedNode = null;
			_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 1033);
this._lastNodeIndex = 0;
			_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 1034);
this._stopped = true;

		}

	},


	/**
	* @method refresh
	* @description Refreshes the Focus Manager's descendants by re-executing the
	* CSS selector query specified by the <code>descendants</code> attribute.
	*/
	refresh: function () {

		_yuitest_coverfunc("build/node-focusmanager/node-focusmanager.js", "refresh", 1046);
_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 1048);
this._initDescendants();

		_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 1050);
if (!this._eventHandlers) {
			_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 1051);
this._attachEventHandlers();
		}

	}

});


_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 1059);
NodeFocusManager.NAME = "nodeFocusManager";
_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 1060);
NodeFocusManager.NS = "focusManager";

_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 1062);
Y.namespace("Plugin");
_yuitest_coverline("build/node-focusmanager/node-focusmanager.js", 1063);
Y.Plugin.NodeFocusManager = NodeFocusManager;


}, '3.7.3', {"requires": ["attribute", "node", "plugin", "node-event-simulate", "event-key", "event-focus"]});
