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
_yuitest_coverage["build/node-menunav/node-menunav.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/node-menunav/node-menunav.js",
    code: []
};
_yuitest_coverage["build/node-menunav/node-menunav.js"].code=["YUI.add('node-menunav', function (Y, NAME) {","","/**","* <p>The MenuNav Node Plugin makes it easy to transform existing list-based ","* markup into traditional, drop down navigational menus that are both accessible ","* and easy to customize, and only require a small set of dependencies.</p>","* ","* ","* <p>To use the MenuNav Node Plugin, simply pass a reference to the plugin to a ","* Node instance's <code>plug</code> method.</p>","* ","* <p>","* <code>","* &#60;script type=\"text/javascript\"&#62; <br>","* <br>","* 		//	Call the \"use\" method, passing in \"node-menunav\".  This will <br>","* 		//	load the script and CSS for the MenuNav Node Plugin and all of <br>","* 		//	the required dependencies. <br>","* <br>","* 		YUI().use(\"node-menunav\", function(Y) { <br>","* <br>","* 			//	Use the \"contentready\" event to initialize the menu when <br>","* 			//	the subtree of element representing the root menu <br>","* 			//	(&#60;div id=\"menu-1\"&#62;) is ready to be scripted. <br>","* <br>","* 			Y.on(\"contentready\", function () { <br>","* <br>","* 				//	The scope of the callback will be a Node instance <br>","* 				//	representing the root menu (&#60;div id=\"menu-1\"&#62;). <br>","* 				//	Therefore, since \"this\" represents a Node instance, it <br>","* 				//	is possible to just call \"this.plug\" passing in a <br>","*				//	reference to the MenuNav Node Plugin. <br>","* <br>","* 				this.plug(Y.Plugin.NodeMenuNav); <br>","* <br>","* 			}, \"#menu-1\"); <br>","* <br>		","* 		}); <br>","* <br>	","* 	&#60;/script&#62; <br>","* </code>","* </p>","*","* <p>The MenuNav Node Plugin has several configuration properties that can be ","* set via an object literal that is passed as a second argument to a Node ","* instance's <code>plug</code> method.","* </p>","*","* <p>","* <code>","* &#60;script type=\"text/javascript\"&#62; <br>","* <br>","* 		//	Call the \"use\" method, passing in \"node-menunav\".  This will <br>","* 		//	load the script and CSS for the MenuNav Node Plugin and all of <br>","* 		//	the required dependencies. <br>","* <br>","* 		YUI().use(\"node-menunav\", function(Y) { <br>","* <br>","* 			//	Use the \"contentready\" event to initialize the menu when <br>","* 			//	the subtree of element representing the root menu <br>","* 			//	(&#60;div id=\"menu-1\"&#62;) is ready to be scripted. <br>","* <br>","* 			Y.on(\"contentready\", function () { <br>","* <br>","* 				//	The scope of the callback will be a Node instance <br>","* 				//	representing the root menu (&#60;div id=\"menu-1\"&#62;). <br>","* 				//	Therefore, since \"this\" represents a Node instance, it <br>","* 				//	is possible to just call \"this.plug\" passing in a <br>","*				//	reference to the MenuNav Node Plugin. <br>","* <br>","* 				this.plug(Y.Plugin.NodeMenuNav, { mouseOutHideDelay: 1000 });","* <br><br>","* 			}, \"#menu-1\"); <br>","* <br>		","* 		}); <br>","* <br>	","* 	&#60;/script&#62; <br>","* </code>","* </p>","* ","* @module node-menunav","*/","","","	//	Util shortcuts","","var UA = Y.UA,","	later = Y.later,","	getClassName = Y.ClassNameManager.getClassName,","","","","	//	Frequently used strings","","	MENU = \"menu\",","	MENUITEM = \"menuitem\",","	HIDDEN = \"hidden\",","	PARENT_NODE = \"parentNode\",","	CHILDREN = \"children\",","	OFFSET_HEIGHT = \"offsetHeight\",","	OFFSET_WIDTH = \"offsetWidth\",","	PX = \"px\",","	ID = \"id\",","	PERIOD = \".\",","	HANDLED_MOUSEOUT = \"handledMouseOut\",","	HANDLED_MOUSEOVER = \"handledMouseOver\",","	ACTIVE = \"active\",","	LABEL = \"label\",","	LOWERCASE_A = \"a\",","	MOUSEDOWN = \"mousedown\",","	KEYDOWN = \"keydown\",","	CLICK = \"click\",","	EMPTY_STRING = \"\",","	FIRST_OF_TYPE = \"first-of-type\",","	ROLE = \"role\",","	PRESENTATION = \"presentation\",","	DESCENDANTS = \"descendants\",","	UI = \"UI\",","	ACTIVE_DESCENDANT = \"activeDescendant\",","	USE_ARIA = \"useARIA\",","	ARIA_HIDDEN = \"aria-hidden\",","	CONTENT = \"content\",","	HOST = \"host\",","	ACTIVE_DESCENDANT_CHANGE = ACTIVE_DESCENDANT + \"Change\",","","","	//	Attribute keys","	","	AUTO_SUBMENU_DISPLAY = \"autoSubmenuDisplay\",","	MOUSEOUT_HIDE_DELAY = \"mouseOutHideDelay\",","","","	//	CSS class names","","	CSS_MENU = getClassName(MENU),","	CSS_MENU_HIDDEN = getClassName(MENU, HIDDEN),","	CSS_MENU_HORIZONTAL = getClassName(MENU, \"horizontal\"),","	CSS_MENU_LABEL = getClassName(MENU, LABEL),","	CSS_MENU_LABEL_ACTIVE = getClassName(MENU, LABEL, ACTIVE),","	CSS_MENU_LABEL_MENUVISIBLE = getClassName(MENU, LABEL, (MENU + \"visible\")),","	CSS_MENUITEM = getClassName(MENUITEM),","	CSS_MENUITEM_ACTIVE = getClassName(MENUITEM, ACTIVE),","","","	//	CSS selectors","	","	MENU_SELECTOR = PERIOD + CSS_MENU,","	MENU_TOGGLE_SELECTOR = (PERIOD + getClassName(MENU, \"toggle\")),","    MENU_CONTENT_SELECTOR = PERIOD + getClassName(MENU, CONTENT),","    MENU_LABEL_SELECTOR = PERIOD + CSS_MENU_LABEL,","","	STANDARD_QUERY = \">\" + MENU_CONTENT_SELECTOR + \">ul>li>a\",","	EXTENDED_QUERY = \">\" + MENU_CONTENT_SELECTOR + \">ul>li>\" + MENU_LABEL_SELECTOR + \">a:first-child\";","","//	Utility functions","","","var getPreviousSibling = function (node) {","","	var oPrevious = node.previous(),","		oChildren;","","	if (!oPrevious) {","		oChildren = node.get(PARENT_NODE).get(CHILDREN);","		oPrevious = oChildren.item(oChildren.size() - 1);","	}","	","	return oPrevious;","","};","","","var getNextSibling = function (node) {","","	var oNext = node.next();","","	if (!oNext) {","		oNext = node.get(PARENT_NODE).get(CHILDREN).item(0);		","	}","	","	return oNext;","","};","","","var isAnchor = function (node) {","	","	var bReturnVal = false;","	","	if (node) {","		bReturnVal = node.get(\"nodeName\").toLowerCase() === LOWERCASE_A;","	}","	","	return bReturnVal;","	","};","","","var isMenuItem = function (node) {","","	return node.hasClass(CSS_MENUITEM);","","};","","","var isMenuLabel = function (node) {","","	return node.hasClass(CSS_MENU_LABEL);","","};","","","var isHorizontalMenu = function (menu) {","","	return menu.hasClass(CSS_MENU_HORIZONTAL);","","};","","","var hasVisibleSubmenu = function (menuLabel) {","","	return menuLabel.hasClass(CSS_MENU_LABEL_MENUVISIBLE);","","};","","","var getItemAnchor = function (node) {","","	return isAnchor(node) ? node : node.one(LOWERCASE_A);","","};","","","var getNodeWithClass = function (node, className, searchAncestors) {","","	var oItem;","	","	if (node) {","		","		if (node.hasClass(className)) {","			oItem = node;","		}","		","		if (!oItem && searchAncestors) {","			oItem = node.ancestor((PERIOD + className));","		}","	","	}","	","	return oItem;","","};","","","var getParentMenu = function (node) {","","	return node.ancestor(MENU_SELECTOR);","	","};","","","var getMenu = function (node, searchAncestors) {","","	return getNodeWithClass(node, CSS_MENU, searchAncestors);","","};","","","var getMenuItem = function (node, searchAncestors) {","","	var oItem;","	","	if (node) {","		oItem = getNodeWithClass(node, CSS_MENUITEM, searchAncestors);","	}","	","	return oItem;","","};","","","var getMenuLabel = function (node, searchAncestors) {","","	var oItem;","	","	if (node) {","	","		if (searchAncestors) {","			oItem = getNodeWithClass(node, CSS_MENU_LABEL, searchAncestors);","		}","		else {","			oItem = getNodeWithClass(node, CSS_MENU_LABEL) || ","				node.one((PERIOD + CSS_MENU_LABEL));","		}","		","	}","	","	return oItem;","","};","","","var getItem = function (node, searchAncestors) {","","	var oItem;","	","	if (node) {","		oItem = getMenuItem(node, searchAncestors) || ","			getMenuLabel(node, searchAncestors);","	}","	","	return oItem;	","","};","","","var getFirstItem = function (menu) {","	","	return getItem(menu.one(\"li\"));","","};","","","var getActiveClass = function (node) {","","	return isMenuItem(node) ? CSS_MENUITEM_ACTIVE : CSS_MENU_LABEL_ACTIVE;","","};","","","var handleMouseOverForNode = function (node, target) {","","	return node && !node[HANDLED_MOUSEOVER] && ","		(node.compareTo(target) || node.contains(target));","","};","","","var handleMouseOutForNode = function (node, relatedTarget) {","","	return node && !node[HANDLED_MOUSEOUT] && ","		(!node.compareTo(relatedTarget) && !node.contains(relatedTarget));","","};","","/**","* The NodeMenuNav class is a plugin for a Node instance.  The class is used via  ","* the <a href=\"Node.html#method_plug\"><code>plug</code></a> method of Node and ","* should not be instantiated directly.","* @namespace plugin","* @class NodeMenuNav","*/","var NodeMenuNav = function () {","","	NodeMenuNav.superclass.constructor.apply(this, arguments);","","};","","NodeMenuNav.NAME = \"nodeMenuNav\";","NodeMenuNav.NS = \"menuNav\";","","","/** ","* @property SHIM_TEMPLATE_TITLE","* @description String representing the value for the <code>title</code> ","* attribute for the shim used to prevent <code>&#60;select&#62;</code> elements ","* from poking through menus in IE 6.","* @default \"Menu Stacking Shim\"","* @type String","*/","NodeMenuNav.SHIM_TEMPLATE_TITLE = \"Menu Stacking Shim\";","","","/** ","* @property SHIM_TEMPLATE","* @description String representing the HTML used to create the ","* <code>&#60;iframe&#62;</code> shim used to prevent ","* <code>&#60;select&#62;</code> elements from poking through menus in IE 6.","* @default &#34;&#60;iframe frameborder=&#34;0&#34; tabindex=&#34;-1&#34; ","* class=&#34;yui-shim&#34; title=&#34;Menu Stacking Shim&#34; ","* src=&#34;javascript:false;&#34;&#62;&#60;/iframe&#62;&#34;","* @type String","*/","","//	<iframe> shim notes:","//","//	1) Need to set the \"frameBorder\" property to 0 to suppress the default ","//	<iframe> border in IE.  (Setting the CSS \"border\" property alone doesn't  ","//	suppress it.) ","//","//	2) The \"src\" attribute of the <iframe> is set to \"javascript:false;\" so ","//	that it won't load a page inside it, preventing the secure/nonsecure ","//	warning in IE when using HTTPS.","//","//	3) Since the role of the <iframe> shim is completely presentational, its ","//	\"tabindex\" attribute is set to \"-1\" and its title attribute is set to ","//	\"Menu Stacking Shim\".  Both strategies help users of screen readers to ","//	avoid mistakenly interacting with the <iframe> shim.","","NodeMenuNav.SHIM_TEMPLATE = '<iframe frameborder=\"0\" tabindex=\"-1\" class=\"' + ","							getClassName(\"shim\") + ","							'\" title=\"' + NodeMenuNav.SHIM_TEMPLATE_TITLE + ","							'\" src=\"javascript:false;\"></iframe>';","","","NodeMenuNav.ATTRS = {","","	/**","	* Boolean indicating if use of the WAI-ARIA Roles and States should be ","	* enabled for the menu.","	*","	* @attribute useARIA","	* @readOnly","	* @writeOnce	","	* @default true","	* @type boolean","	*/","	useARIA: {","		","		value: true,","		writeOnce: true,","		lazyAdd: false,","		setter: function (value) {","","			var oMenu = this.get(HOST),","				oMenuLabel,","				oMenuToggle,","				oSubmenu,","				sID;","","			if (value) {","","				oMenu.set(ROLE, MENU);","","				oMenu.all(\"ul,li,\" + MENU_CONTENT_SELECTOR).set(ROLE, PRESENTATION);","","				oMenu.all((PERIOD + getClassName(MENUITEM, CONTENT))).set(ROLE, MENUITEM);","","				oMenu.all((PERIOD + CSS_MENU_LABEL)).each(function (node) {","","					oMenuLabel = node;","					oMenuToggle = node.one(MENU_TOGGLE_SELECTOR);","","					if (oMenuToggle) {","						oMenuToggle.set(ROLE, PRESENTATION);","						oMenuLabel = oMenuToggle.previous();","					}","","					oMenuLabel.set(ROLE, MENUITEM);","					oMenuLabel.set(\"aria-haspopup\", true);","","					oSubmenu = node.next();","","					if (oSubmenu) {","","						oSubmenu.set(ROLE, MENU);","","						oMenuLabel = oSubmenu.previous();","						oMenuToggle = oMenuLabel.one(MENU_TOGGLE_SELECTOR);","","						if (oMenuToggle) {","							oMenuLabel = oMenuToggle;","						}","","						sID = Y.stamp(oMenuLabel);","","						if (!oMenuLabel.get(ID)) {","							oMenuLabel.set(ID, sID);","						}","","						oSubmenu.set(\"aria-labelledby\", sID);","						oSubmenu.set(ARIA_HIDDEN, true);","						","					}","","				});","				","			}","","		}","		","	},","","","	/**","	* Boolean indicating if submenus are automatically made visible when the ","	* user mouses over the menu's items.","	*","	* @attribute autoSubmenuDisplay","	* @readOnly","	* @writeOnce	","	* @default true","	* @type boolean","	*/	","	autoSubmenuDisplay: {","		","		value: true,","		writeOnce: true","		","	},","","","	/**","	* Number indicating the time (in milliseconds) that should expire before a ","	* submenu is made visible when the user mouses over the menu's label.","	*","	* @attribute submenuShowDelay","	* @readOnly","	* @writeOnce	","	* @default 250","	* @type Number","	*/","	submenuShowDelay: {","		","		value: 250,","		writeOnce: true","		","	},","","","	/**","	* Number indicating the time (in milliseconds) that should expire before a ","	* submenu is hidden when the user mouses out of a menu label heading in the ","	* direction of a submenu.  ","	*","	* @attribute submenuHideDelay","	* @readOnly","	* @writeOnce	","	* @default 250","	* @type Number","	*/","	submenuHideDelay: {","		","		value: 250,","		writeOnce: true","		","	},","","","	/**","	* Number indicating the time (in milliseconds) that should expire before a ","	* submenu is hidden when the user mouses out of it.","	* ","	* @attribute mouseOutHideDelay","	* @readOnly","	* @writeOnce	","	* @default 750","	* @type Number","	*/	","	mouseOutHideDelay: {","		","		value: 750,","		writeOnce: true","		","	}","","};","","","Y.extend(NodeMenuNav, Y.Plugin.Base, {","","	//	Protected properties","","	/** ","	* @property _rootMenu","	* @description Node instance representing the root menu in the menu.","	* @default null","	* @protected","	* @type Node","	*/","	_rootMenu: null,	","","","	/** ","	* @property _activeItem","	* @description Node instance representing the menu's active descendent: ","	* the menuitem or menu label the user is currently interacting with.","	* @default null","	* @protected","	* @type Node","	*/","	_activeItem: null, ","","","	/** ","	* @property _activeMenu","	* @description Node instance representing the menu that is the parent of ","	* the menu's active descendent.","	* @default null","	* @protected","	* @type Node","	*/","	_activeMenu: null,","","","	/** ","	* @property _hasFocus","	* @description Boolean indicating if the menu has focus.","	* @default false","	* @protected","	* @type Boolean","	*/","	_hasFocus: false,","","","	//	In gecko-based browsers a mouseover and mouseout event will fire even ","	//	if a DOM element moves out from under the mouse without the user ","	//	actually moving the mouse.  This bug affects NodeMenuNav because the  ","	//	user can hit the Esc key to hide a menu, and if the mouse is over the  ","	//	menu when the user presses Esc, the _onMenuMouseOut handler will be ","	//	called.  To fix this bug the following flag (_blockMouseEvent) is used ","	// to block the code in the _onMenuMouseOut handler from executing.","","	/** ","	* @property _blockMouseEvent","	* @description Boolean indicating whether or not to handle the ","	* \"mouseover\" event.","	* @default false","	* @protected","	* @type Boolean","	*/","	_blockMouseEvent: false,","","","	/** ","	* @property _currentMouseX","	* @description Number representing the current x coordinate of the mouse ","	* inside the menu.","	* @default 0","	* @protected","	* @type Number","	*/","	_currentMouseX: 0,","","","	/** ","	* @property _movingToSubmenu","	* @description Boolean indicating if the mouse is moving from a menu ","	* label to its corresponding submenu.","	* @default false","	* @protected","	* @type Boolean","	*/","	_movingToSubmenu: false,","","","	/** ","	* @property _showSubmenuTimer","	* @description Timer used to show a submenu.","	* @default null","	* @protected","	* @type Object","	*/","	_showSubmenuTimer: null,","","","	/** ","	* @property _hideSubmenuTimer","	* @description Timer used to hide a submenu.","	* @default null","	* @protected","	* @type Object","	*/","	_hideSubmenuTimer: null,","","","	/** ","	* @property _hideAllSubmenusTimer","	* @description Timer used to hide a all submenus.","	* @default null","	* @protected","	* @type Object","	*/","	_hideAllSubmenusTimer: null,","","","	/** ","	* @property _firstItem","	* @description Node instance representing the first item (menuitem or menu ","	* label) in the root menu of a menu.","	* @default null","	* @protected","	* @type Node","	*/","	_firstItem: null,","","","	//	Public methods","","","    initializer: function (config) {","","		var menuNav = this,","			oRootMenu = this.get(HOST),","			aHandlers = [],","			oDoc;","","","		if (oRootMenu) {","","			menuNav._rootMenu = oRootMenu;","","			oRootMenu.all(\"ul:first-child\").addClass(FIRST_OF_TYPE);","","			//	Hide all visible submenus","","			oRootMenu.all(MENU_SELECTOR).addClass(CSS_MENU_HIDDEN);","","","			//	Wire up all event handlers","","			aHandlers.push(oRootMenu.on(\"mouseover\", menuNav._onMouseOver, menuNav));","			aHandlers.push(oRootMenu.on(\"mouseout\", menuNav._onMouseOut, menuNav));","			aHandlers.push(oRootMenu.on(\"mousemove\", menuNav._onMouseMove, menuNav));","			aHandlers.push(oRootMenu.on(MOUSEDOWN, menuNav._toggleSubmenuDisplay, menuNav));","			aHandlers.push(Y.on(\"key\", menuNav._toggleSubmenuDisplay, oRootMenu, \"down:13\", menuNav));","			aHandlers.push(oRootMenu.on(CLICK, menuNav._toggleSubmenuDisplay, menuNav));","			aHandlers.push(oRootMenu.on(\"keypress\", menuNav._onKeyPress, menuNav));","			aHandlers.push(oRootMenu.on(KEYDOWN, menuNav._onKeyDown, menuNav));","","			oDoc = oRootMenu.get(\"ownerDocument\");","","		    aHandlers.push(oDoc.on(MOUSEDOWN, menuNav._onDocMouseDown, menuNav));","			aHandlers.push(oDoc.on(\"focus\", menuNav._onDocFocus, menuNav));","","			this._eventHandlers = aHandlers;","","			menuNav._initFocusManager();","","		}","		","","    },","","	destructor: function () {","","		var aHandlers = this._eventHandlers;","","		if (aHandlers) {","","			Y.Array.each(aHandlers, function (handle) {","				handle.detach();","			});","","			this._eventHandlers = null;","","		}","		","		this.get(HOST).unplug(\"focusManager\");","		","    },","","","","	//	Protected methods","","	/**","	* @method _isRoot","	* @description Returns a boolean indicating if the specified menu is the ","	* root menu in the menu.","	* @protected","	* @param {Node} menu Node instance representing a menu.","	* @return {Boolean} Boolean indicating if the specified menu is the root ","	* menu in the menu.","	*/","	_isRoot: function (menu) {","","		return this._rootMenu.compareTo(menu);","","	},","","","	/**","	* @method _getTopmostSubmenu","	* @description Returns the topmost submenu of a submenu hierarchy.","	* @protected","	* @param {Node} menu Node instance representing a menu.","	* @return {Node} Node instance representing a menu.","	*/","	_getTopmostSubmenu: function (menu) {","	","		var menuNav = this,","			oMenu = getParentMenu(menu),","			returnVal;","","","		if (!oMenu) {","			returnVal = menu;","		}","		else if (menuNav._isRoot(oMenu)) {","			returnVal = menu;","		}","		else {","			returnVal = menuNav._getTopmostSubmenu(oMenu);","		}","	","		return returnVal;","	","	},","","","	/**","	* @method _clearActiveItem","	* @description Clears the menu's active descendent.","	* @protected","	*/","	_clearActiveItem: function () {","","		var menuNav = this,","			oActiveItem = menuNav._activeItem;","		","		if (oActiveItem) {","			oActiveItem.removeClass(getActiveClass(oActiveItem));","		}","","		menuNav._activeItem = null;","	","	},","","","	/**","	* @method _setActiveItem","	* @description Sets the specified menuitem or menu label as the menu's ","	* active descendent.","	* @protected","	* @param {Node} item Node instance representing a menuitem or menu label.","	*/","	_setActiveItem: function (item) {","","		var menuNav = this;","	","		if (item) {","			","			menuNav._clearActiveItem();","	","			item.addClass(getActiveClass(item));","			","			menuNav._activeItem = item;","		","		}","	","	},","","","	/**","	* @method _focusItem","	* @description Focuses the specified menuitem or menu label.","	* @protected","	* @param {Node} item Node instance representing a menuitem or menu label.","	*/","	_focusItem: function (item) {","	","		var menuNav = this,","			oMenu,","			oItem;","	","		if (item && menuNav._hasFocus) {","","			oMenu = getParentMenu(item);","			oItem = getItemAnchor(item);","","			if (oMenu && !oMenu.compareTo(menuNav._activeMenu)) {","				menuNav._activeMenu = oMenu;","				menuNav._initFocusManager();","			}","		","			menuNav._focusManager.focus(oItem);","","		}","	","	},","","","	/**","	* @method _showMenu","	* @description Shows the specified menu.","	* @protected","	* @param {Node} menu Node instance representing a menu.","	*/","	_showMenu: function (menu) {","","		var oParentMenu = getParentMenu(menu),","			oLI = menu.get(PARENT_NODE),","			aXY = oLI.getXY();","","","		if (this.get(USE_ARIA)) {","			menu.set(ARIA_HIDDEN, false);","		}","","","		if (isHorizontalMenu(oParentMenu)) {","			aXY[1] = aXY[1] + oLI.get(OFFSET_HEIGHT);","		}","		else {","			aXY[0] = aXY[0] + oLI.get(OFFSET_WIDTH);","		}","		","		menu.setXY(aXY);","","		if (UA.ie < 8) {","","			if (UA.ie === 6 && !menu.hasIFrameShim) {","	","				menu.appendChild(Y.Node.create(NodeMenuNav.SHIM_TEMPLATE));","				menu.hasIFrameShim = true;","","			}","","			//	Clear previous values for height and width","","			menu.setStyles({ height: EMPTY_STRING, width: EMPTY_STRING });","","			//	Set the width and height of the menu's bounding box - this is ","			//	necessary for IE 6 so that the CSS for the <iframe> shim can ","			//	simply set the <iframe>'s width and height to 100% to ensure ","			//	that dimensions of an <iframe> shim are always sync'd to the ","			//	that of its parent menu.  Specifying a width and height also ","			//	helps when positioning decorator elements (for creating effects ","			//	like rounded corners) inside a menu's bounding box in IE 7.","			","			menu.setStyles({ ","				height: (menu.get(OFFSET_HEIGHT) + PX), ","				width: (menu.get(OFFSET_WIDTH) + PX) });","","		}","","		menu.previous().addClass(CSS_MENU_LABEL_MENUVISIBLE);","		menu.removeClass(CSS_MENU_HIDDEN);","","	},","	","","	/**","	* @method _hideMenu ","	* @description Hides the specified menu.","	* @protected","	* @param {Node} menu Node instance representing a menu.","	* @param {Boolean} activateAndFocusLabel Boolean indicating if the label ","	* for the specified ","	* menu should be focused and set as active.","	*/","	_hideMenu: function (menu, activateAndFocusLabel) {","","		var menuNav = this,","			oLabel = menu.previous(),","			oActiveItem;","","		oLabel.removeClass(CSS_MENU_LABEL_MENUVISIBLE);","","","		if (activateAndFocusLabel) {","			menuNav._focusItem(oLabel);","			menuNav._setActiveItem(oLabel);			","		}","","		oActiveItem = menu.one((PERIOD + CSS_MENUITEM_ACTIVE));","","		if (oActiveItem) {","			oActiveItem.removeClass(CSS_MENUITEM_ACTIVE);","		}","","		//	Clear the values for top and left that were set by the call to ","		//	\"setXY\" when the menu was shown so that the hidden position ","		//	specified in the core CSS file will take affect.","","		menu.setStyles({ left: EMPTY_STRING, top: EMPTY_STRING });","		","		menu.addClass(CSS_MENU_HIDDEN);","","		if (menuNav.get(USE_ARIA)) {","			menu.set(ARIA_HIDDEN, true);","		}	","		","	},","","","	/**","	* @method _hideAllSubmenus","	* @description Hides all submenus of the specified menu.","	* @protected","	* @param {Node} menu Node instance representing a menu.","	*/","	_hideAllSubmenus: function (menu) {","","		var menuNav = this;","","		menu.all(MENU_SELECTOR).each(Y.bind(function (submenuNode) {","		","			menuNav._hideMenu(submenuNode);","		","		}, menuNav));","	","	},","","","	/**","	* @method _cancelShowSubmenuTimer","	* @description Cancels the timer used to show a submenu.","	* @protected","	*/","	_cancelShowSubmenuTimer: function () {","","		var menuNav = this,","			oShowSubmenuTimer = menuNav._showSubmenuTimer;","","		if (oShowSubmenuTimer) {","			oShowSubmenuTimer.cancel();","			menuNav._showSubmenuTimer = null;","		}","	","	},","","","	/**","	* @method _cancelHideSubmenuTimer","	* @description Cancels the timer used to hide a submenu.","	* @protected","	*/","	_cancelHideSubmenuTimer: function () {","","		var menuNav = this,","			oHideSubmenuTimer = menuNav._hideSubmenuTimer;","","","		if (oHideSubmenuTimer) {","			oHideSubmenuTimer.cancel();","			menuNav._hideSubmenuTimer = null;","		}","	","	},","","","	/**","	* @method _initFocusManager","	* @description Initializes and updates the Focus Manager so that is is ","	* always managing descendants of the active menu.","	* @protected","	*/","	_initFocusManager: function () {","","		var menuNav = this,","			oRootMenu = menuNav._rootMenu,","			oMenu = menuNav._activeMenu || oRootMenu,","			sSelectorBase = ","				menuNav._isRoot(oMenu) ? EMPTY_STRING : (\"#\" + oMenu.get(\"id\")),","			oFocusManager = menuNav._focusManager,","			sKeysVal,","			sDescendantSelector,","			sQuery;","","		if (isHorizontalMenu(oMenu)) {","","			sDescendantSelector = sSelectorBase + STANDARD_QUERY + \",\" + ","				sSelectorBase + EXTENDED_QUERY;","			","			sKeysVal = { next: \"down:39\", previous: \"down:37\" };","			","		}","		else {","","			sDescendantSelector = sSelectorBase + STANDARD_QUERY;","			sKeysVal = { next: \"down:40\", previous: \"down:38\" };","","		}","","","		if (!oFocusManager) {","","			oRootMenu.plug(Y.Plugin.NodeFocusManager, { ","				descendants: sDescendantSelector,","				keys: sKeysVal,","				circular: true","			});","","			oFocusManager = oRootMenu.focusManager;","","			sQuery = \"#\" + oRootMenu.get(\"id\") + MENU_SELECTOR + \" a,\" + ","							MENU_TOGGLE_SELECTOR;","","			oRootMenu.all(sQuery).set(\"tabIndex\", -1);","","			oFocusManager.on(ACTIVE_DESCENDANT_CHANGE, ","				this._onActiveDescendantChange, oFocusManager, this);","","			oFocusManager.after(ACTIVE_DESCENDANT_CHANGE, ","				this._afterActiveDescendantChange, oFocusManager, this);","			","			menuNav._focusManager = oFocusManager;","			","		}","		else {","","			oFocusManager.set(ACTIVE_DESCENDANT, -1);","			oFocusManager.set(DESCENDANTS, sDescendantSelector);","			oFocusManager.set(\"keys\", sKeysVal);","			","		}","","	},","","","	//	Event handlers for discrete pieces of pieces of the menu","","","	/**","	* @method _onActiveDescendantChange","	* @description \"activeDescendantChange\" event handler for menu's ","	* Focus Manager.","	* @protected","	* @param {Object} event Object representing the Attribute change event.","	* @param {NodeMenuNav} menuNav Object representing the NodeMenuNav instance.","	*/","	_onActiveDescendantChange: function (event, menuNav) {","","		if (event.src === UI && menuNav._activeMenu && ","				!menuNav._movingToSubmenu) {","","			menuNav._hideAllSubmenus(menuNav._activeMenu);","","		}","		","	},","","","	/**","	* @method _afterActiveDescendantChange","	* @description \"activeDescendantChange\" event handler for menu's ","	* Focus Manager.","	* @protected","	* @param {Object} event Object representing the Attribute change event.","	* @param {NodeMenuNav} menuNav Object representing the NodeMenuNav instance.","	*/","	_afterActiveDescendantChange: function (event, menuNav) {","","		var oItem;","","		if (event.src === UI) {","			oItem = getItem(this.get(DESCENDANTS).item(event.newVal), true);","			menuNav._setActiveItem(oItem);","		}","	","	},","","","	/**","	* @method _onDocFocus","	* @description \"focus\" event handler for the owner document of the MenuNav.","	* @protected","	* @param {Object} event Object representing the DOM event.","	*/","	_onDocFocus: function (event) {","	","		var menuNav = this,","			oActiveItem = menuNav._activeItem,","			oTarget = event.target,","			oMenu;","	","","		if (menuNav._rootMenu.contains(oTarget)) {	//	The menu has focus","","			if (menuNav._hasFocus) {	","","				oMenu = getParentMenu(oTarget);","","				//	If the element that was focused is a descendant of the ","				//	root menu, but is in a submenu not currently being ","				//	managed by the Focus Manager, update the Focus Manager so ","				//	that it is now managing the submenu that is the parent of  ","				//	the element that was focused.","				","				if (!menuNav._activeMenu.compareTo(oMenu)) {","","					menuNav._activeMenu = oMenu;","					menuNav._initFocusManager();","					menuNav._focusManager.set(ACTIVE_DESCENDANT, oTarget);","					menuNav._setActiveItem(getItem(oTarget, true));","					","				}","			","			}","			else { //	Initial focus","","				//	First time the menu has been focused, need to setup focused ","				//	state and established active active descendant","	","				menuNav._hasFocus = true;","	","				oActiveItem = getItem(oTarget, true);","	","				if (oActiveItem) {	","					menuNav._setActiveItem(oActiveItem);","				}","				","			}","		","		}","		else {	//	The menu has lost focus","","			menuNav._clearActiveItem();","","			menuNav._cancelShowSubmenuTimer();","			menuNav._hideAllSubmenus(menuNav._rootMenu);","","			menuNav._activeMenu = menuNav._rootMenu;","			menuNav._initFocusManager();","			","			menuNav._focusManager.set(ACTIVE_DESCENDANT, 0);","			","			menuNav._hasFocus = false;","","		}","	","	},","","","	/**","	* @method _onMenuMouseOver","	* @description \"mouseover\" event handler for a menu.","	* @protected","	* @param {Node} menu Node instance representing a menu.","	* @param {Object} event Object representing the DOM event.","	*/","	_onMenuMouseOver: function (menu, event) {","","		var menuNav = this,","			oHideAllSubmenusTimer = menuNav._hideAllSubmenusTimer;","","		if (oHideAllSubmenusTimer) {","			oHideAllSubmenusTimer.cancel();","			menuNav._hideAllSubmenusTimer = null;","		}","","		menuNav._cancelHideSubmenuTimer();","","		//	Need to update the FocusManager in advance of focus a new ","		//	Menu in order to avoid the FocusManager thinking that ","		//	it has lost focus","		","		if (menu && !menu.compareTo(menuNav._activeMenu)) {","			menuNav._activeMenu = menu;","","			if (menuNav._hasFocus) {","				menuNav._initFocusManager();","			}","","		}","","		if (menuNav._movingToSubmenu && isHorizontalMenu(menu)) {","			menuNav._movingToSubmenu = false;","		}","","	},","","","	/**","	* @method _hideAndFocusLabel","	* @description Hides all of the submenus of the root menu and focuses the ","	* label of the topmost submenu","	* @protected","	*/","	_hideAndFocusLabel: function () {","","		var	menuNav = this,","			oActiveMenu = menuNav._activeMenu,","			oSubmenu;","	","		menuNav._hideAllSubmenus(menuNav._rootMenu);","","		if (oActiveMenu) {","","			//	Focus the label element for the topmost submenu","			oSubmenu = menuNav._getTopmostSubmenu(oActiveMenu);","			menuNav._focusItem(oSubmenu.previous());","","		}","	","	},","","","	/**","	* @method _onMenuMouseOut","	* @description \"mouseout\" event handler for a menu.","	* @protected","	* @param {Node} menu Node instance representing a menu.","	* @param {Object} event Object representing the DOM event.","	*/","	_onMenuMouseOut: function (menu, event) {","","		var menuNav = this,","			oActiveMenu = menuNav._activeMenu,","			oRelatedTarget = event.relatedTarget,","			oActiveItem = menuNav._activeItem,","			oParentMenu,","			oMenu;","","","		if (oActiveMenu && !oActiveMenu.contains(oRelatedTarget)) {","		","			oParentMenu = getParentMenu(oActiveMenu);","			","","			if (oParentMenu && !oParentMenu.contains(oRelatedTarget)) {","","				if (menuNav.get(MOUSEOUT_HIDE_DELAY) > 0) {","","					menuNav._cancelShowSubmenuTimer();","","					menuNav._hideAllSubmenusTimer = ","","						later(menuNav.get(MOUSEOUT_HIDE_DELAY), ","							menuNav, menuNav._hideAndFocusLabel);","						","				}","			","			}","			else {","			","				if (oActiveItem) {","				","					oMenu = getParentMenu(oActiveItem);","","					if (!menuNav._isRoot(oMenu)) { ","						menuNav._focusItem(oMenu.previous());","					}","				","				}","			","			}","","		}","","	},","","","	/**","	* @method _onMenuLabelMouseOver","	* @description \"mouseover\" event handler for a menu label.","	* @protected","	* @param {Node} menuLabel Node instance representing a menu label.","	* @param {Object} event Object representing the DOM event.","	*/","	_onMenuLabelMouseOver: function (menuLabel, event) {","","		var menuNav = this,","			oActiveMenu = menuNav._activeMenu,","			bIsRoot = menuNav._isRoot(oActiveMenu),","			bUseAutoSubmenuDisplay = ","				(menuNav.get(AUTO_SUBMENU_DISPLAY) && bIsRoot || !bIsRoot),","            submenuShowDelay = menuNav.get(\"submenuShowDelay\"),	","			oSubmenu;","				","","        var showSubmenu = function (delay) {","","			menuNav._cancelHideSubmenuTimer();","			menuNav._cancelShowSubmenuTimer();","","			if (!hasVisibleSubmenu(menuLabel)) {","","				oSubmenu = menuLabel.next();","","				if (oSubmenu) {","					menuNav._hideAllSubmenus(oActiveMenu);","					menuNav._showSubmenuTimer = later(delay, menuNav, menuNav._showMenu, oSubmenu);","				}","","			}","            ","        };","","","		menuNav._focusItem(menuLabel);","		menuNav._setActiveItem(menuLabel);","","","		if (bUseAutoSubmenuDisplay) {","	","	        if (menuNav._movingToSubmenu) {","	            ","	            //  If the user is moving diagonally from a submenu to ","	            //  another submenu and they then stop and pause on a","	            //  menu label for an amount of time equal to the amount of ","	            //  time defined for the display of a submenu then show the ","	            //  submenu immediately.","	            //  http://yuilibrary.com/projects/yui3/ticket/2528316","	            ","	            //Y.message(\"Pause path\");","	            ","	            menuNav._hoverTimer = later(submenuShowDelay, menuNav, function () {","                    showSubmenu(0);","	            });","	            ","	        }","	        else {","                showSubmenu(submenuShowDelay);","	        }","		","		}","","	},","","","	/**","	* @method _onMenuLabelMouseOut","	* @description \"mouseout\" event handler for a menu label.","	* @protected","	* @param {Node} menuLabel Node instance representing a menu label.","	* @param {Object} event Object representing the DOM event.","	*/","	_onMenuLabelMouseOut: function (menuLabel, event) {","","		var menuNav = this,","			bIsRoot = menuNav._isRoot(menuNav._activeMenu),","			bUseAutoSubmenuDisplay = ","				(menuNav.get(AUTO_SUBMENU_DISPLAY) && bIsRoot || !bIsRoot),","","			oRelatedTarget = event.relatedTarget,","			oSubmenu = menuLabel.next(),","			hoverTimer = menuNav._hoverTimer;","","        if (hoverTimer) {","            hoverTimer.cancel();","        }","","		menuNav._clearActiveItem();","","		if (bUseAutoSubmenuDisplay) {","","			if (menuNav._movingToSubmenu && ","					!menuNav._showSubmenuTimer && oSubmenu) {","","				//	If the mouse is moving diagonally toward the submenu and ","				//	another submenu isn't in the process of being displayed ","				//	(via a timer), then hide the submenu via a timer to give","				//	the user some time to reach the submenu.","			","				menuNav._hideSubmenuTimer = ","					later(menuNav.get(\"submenuHideDelay\"), menuNav, ","						menuNav._hideMenu, oSubmenu);","			","			}","			else if (!menuNav._movingToSubmenu && oSubmenu && (!oRelatedTarget || ","			        (oRelatedTarget && ","			            !oSubmenu.contains(oRelatedTarget) && ","			            !oRelatedTarget.compareTo(oSubmenu)))) {","","				//	If the mouse is not moving toward the submenu, cancel any ","				//	submenus that might be in the process of being displayed ","				//	(via a timer) and hide this submenu immediately.","","				menuNav._cancelShowSubmenuTimer();","","				menuNav._hideMenu(oSubmenu);","","			}","","		}","","	},","	","","	/**","	* @method _onMenuItemMouseOver","	* @description \"mouseover\" event handler for a menuitem.","	* @protected","	* @param {Node} menuItem Node instance representing a menuitem.","	* @param {Object} event Object representing the DOM event.","	*/","	_onMenuItemMouseOver: function (menuItem, event) {","","		var menuNav = this,","			oActiveMenu = menuNav._activeMenu,","			bIsRoot = menuNav._isRoot(oActiveMenu),","			bUseAutoSubmenuDisplay = ","				(menuNav.get(AUTO_SUBMENU_DISPLAY) && bIsRoot || !bIsRoot);","","","		menuNav._focusItem(menuItem);","		menuNav._setActiveItem(menuItem);","","","		if (bUseAutoSubmenuDisplay && !menuNav._movingToSubmenu) {","","			menuNav._hideAllSubmenus(oActiveMenu);","","		}","","	},","	","","	/**","	* @method _onMenuItemMouseOut","	* @description \"mouseout\" event handler for a menuitem.","	* @protected","	* @param {Node} menuItem Node instance representing a menuitem.","	* @param {Object} event Object representing the DOM event.","	*/","	_onMenuItemMouseOut: function (menuItem, event) {","","		this._clearActiveItem();","","	},","","","	/**","	* @method _onVerticalMenuKeyDown","	* @description \"keydown\" event handler for vertical menus.","	* @protected","	* @param {Object} event Object representing the DOM event.","	*/","	_onVerticalMenuKeyDown: function (event) {","","		var menuNav = this,","			oActiveMenu = menuNav._activeMenu,","			oRootMenu = menuNav._rootMenu,","			oTarget = event.target,","			bPreventDefault = false,","			nKeyCode = event.keyCode,","			oSubmenu,","			oParentMenu,","			oLI,","			oItem;","","","		switch (nKeyCode) {","","			case 37:	//	left arrow","","				oParentMenu = getParentMenu(oActiveMenu);","","				if (oParentMenu && isHorizontalMenu(oParentMenu)) {","				","					menuNav._hideMenu(oActiveMenu);","					oLI = getPreviousSibling(oActiveMenu.get(PARENT_NODE));","					oItem = getItem(oLI);","					","					if (oItem) {","","						if (isMenuLabel(oItem)) {	//	Menu label","						","							oSubmenu = oItem.next();","						","","							if (oSubmenu) {","","								menuNav._showMenu(oSubmenu);","								menuNav._focusItem(getFirstItem(oSubmenu));","								menuNav._setActiveItem(getFirstItem(oSubmenu));","","							}","							else {","	","								menuNav._focusItem(oItem);","								menuNav._setActiveItem(oItem);","	","							}","						","						}","						else {	//	MenuItem","","							menuNav._focusItem(oItem);","							menuNav._setActiveItem(oItem);","","						}","					","					}","","				}","				else if (!menuNav._isRoot(oActiveMenu)) {","					menuNav._hideMenu(oActiveMenu, true);","				}","","","				bPreventDefault = true;","","			break;","","			case 39:	//	right arrow","","				if (isMenuLabel(oTarget)) {","					","					oSubmenu = oTarget.next();","","					if (oSubmenu) {","","						menuNav._showMenu(oSubmenu);","						menuNav._focusItem(getFirstItem(oSubmenu));","						menuNav._setActiveItem(getFirstItem(oSubmenu));","","					}","				","				}","				else if (isHorizontalMenu(oRootMenu)) {","","					oSubmenu = menuNav._getTopmostSubmenu(oActiveMenu);","					oLI = getNextSibling(oSubmenu.get(PARENT_NODE));","					oItem = getItem(oLI);","","					menuNav._hideAllSubmenus(oRootMenu);","","					if (oItem) {","","						if (isMenuLabel(oItem)) {	//	Menu label","","							oSubmenu = oItem.next();","","							if (oSubmenu) {","","								menuNav._showMenu(oSubmenu);","								menuNav._focusItem(getFirstItem(oSubmenu));","								menuNav._setActiveItem(getFirstItem(oSubmenu));","","							}","							else {","","								menuNav._focusItem(oItem);","								menuNav._setActiveItem(oItem);	","","							}","						","						}","						else {	//	MenuItem","","							menuNav._focusItem(oItem);","							menuNav._setActiveItem(oItem);","","						}							","","					}","				","				}","","				bPreventDefault = true;","","			break;","","		}	","","","		if (bPreventDefault) {","","			//	Prevent the browser from scrolling the window","","			event.preventDefault();			","","		}","	","	},","	","","	/**","	* @method _onHorizontalMenuKeyDown","	* @description \"keydown\" event handler for horizontal menus.","	* @protected","	* @param {Object} event Object representing the DOM event.","	*/","	_onHorizontalMenuKeyDown: function (event) {","","		var menuNav = this,","			oActiveMenu = menuNav._activeMenu,","			oTarget = event.target,","			oFocusedItem = getItem(oTarget, true),","			bPreventDefault = false,","			nKeyCode = event.keyCode,","			oSubmenu;","","","		if (nKeyCode === 40) {","","			menuNav._hideAllSubmenus(oActiveMenu);","","			if (isMenuLabel(oFocusedItem)) {","			","				oSubmenu = oFocusedItem.next();","","				if (oSubmenu) {","","					menuNav._showMenu(oSubmenu);","					menuNav._focusItem(getFirstItem(oSubmenu));","					menuNav._setActiveItem(getFirstItem(oSubmenu));","","				}","","				bPreventDefault = true;","			","			}","","		}		","","","		if (bPreventDefault) {","","			//	Prevent the browser from scrolling the window","","			event.preventDefault();			","","		}","	","	},","","","	//	Generic DOM Event handlers","","","	/**","	* @method _onMouseMove","	* @description \"mousemove\" event handler for the menu.","	* @protected","	* @param {Object} event Object representing the DOM event.","	*/","	_onMouseMove: function (event) {","","		var menuNav = this;","","		//	Using a timer to set the value of the \"_currentMouseX\" property ","		//	helps improve the reliability of the calculation used to set the ","		//	value of the \"_movingToSubmenu\" property - especially in Opera.","","		later(10, menuNav, function () {","","			menuNav._currentMouseX = event.pageX;","		","		});","	","	},","","","	/**","	* @method _onMouseOver","	* @description \"mouseover\" event handler for the menu.","	* @protected","	* @param {Object} event Object representing the DOM event.","	*/","	_onMouseOver: function (event) {","","		var menuNav = this,","			oTarget,","			oMenu,","			oMenuLabel,","			oParentMenu,","			oMenuItem;","","","		if (menuNav._blockMouseEvent) {","			menuNav._blockMouseEvent = false;","		}","		else {","","			oTarget = event.target;","			oMenu = getMenu(oTarget, true);","			oMenuLabel = getMenuLabel(oTarget, true);","			oMenuItem = getMenuItem(oTarget, true);","","","			if (handleMouseOverForNode(oMenu, oTarget)) {","","				menuNav._onMenuMouseOver(oMenu, event);","","				oMenu[HANDLED_MOUSEOVER] = true;","				oMenu[HANDLED_MOUSEOUT] = false;","","				oParentMenu = getParentMenu(oMenu);","","				if (oParentMenu) {","","					oParentMenu[HANDLED_MOUSEOUT] = true;","					oParentMenu[HANDLED_MOUSEOVER] = false;","		","				}","			","			}","","			if (handleMouseOverForNode(oMenuLabel, oTarget)) {","","				menuNav._onMenuLabelMouseOver(oMenuLabel, event);","","				oMenuLabel[HANDLED_MOUSEOVER] = true;","				oMenuLabel[HANDLED_MOUSEOUT] = false;","	","			}","","			if (handleMouseOverForNode(oMenuItem, oTarget)) {","	","				menuNav._onMenuItemMouseOver(oMenuItem, event);","","				oMenuItem[HANDLED_MOUSEOVER] = true;","				oMenuItem[HANDLED_MOUSEOUT] = false;","				","			}","","		}","","	},","","","	/**","	* @method _onMouseOut","	* @description \"mouseout\" event handler for the menu.","	* @protected","	* @param {Object} event Object representing the DOM event.","	*/","	_onMouseOut: function (event) {","			","		var menuNav = this,","			oActiveMenu = menuNav._activeMenu,","			bMovingToSubmenu = false,","			oTarget,","			oRelatedTarget,","			oMenu,","			oMenuLabel,","			oSubmenu,","			oMenuItem;","","","		menuNav._movingToSubmenu = ","					(oActiveMenu && !isHorizontalMenu(oActiveMenu) && ","						((event.pageX - 5) > menuNav._currentMouseX));","		","		oTarget = event.target;","		oRelatedTarget = event.relatedTarget;","		oMenu = getMenu(oTarget, true);","		oMenuLabel = getMenuLabel(oTarget, true);","		oMenuItem = getMenuItem(oTarget, true);","","","		if (handleMouseOutForNode(oMenuLabel, oRelatedTarget)) {","","			menuNav._onMenuLabelMouseOut(oMenuLabel, event);","","			oMenuLabel[HANDLED_MOUSEOUT] = true;","			oMenuLabel[HANDLED_MOUSEOVER] = false;","","		}","","		if (handleMouseOutForNode(oMenuItem, oRelatedTarget)) {","","			menuNav._onMenuItemMouseOut(oMenuItem, event);","","			oMenuItem[HANDLED_MOUSEOUT] = true;","			oMenuItem[HANDLED_MOUSEOVER] = false;","			","		}","","","		if (oMenuLabel) {","","			oSubmenu = oMenuLabel.next();","","			if (oSubmenu && oRelatedTarget && ","				(oRelatedTarget.compareTo(oSubmenu) || ","					oSubmenu.contains(oRelatedTarget))) {","","				bMovingToSubmenu = true;","","			}","		","		}","		","","		if (handleMouseOutForNode(oMenu, oRelatedTarget) || bMovingToSubmenu) {","","			menuNav._onMenuMouseOut(oMenu, event);				","","			oMenu[HANDLED_MOUSEOUT] = true;","			oMenu[HANDLED_MOUSEOVER] = false;","		","		}","	","	},","","","	/**","	* @method _toggleSubmenuDisplay","	* @description \"mousedown,\" \"keydown,\" and \"click\" event handler for the ","	* menu used to toggle the display of a submenu.","	* @protected","	* @param {Object} event Object representing the DOM event.","	*/","	_toggleSubmenuDisplay: function (event) {","","		var menuNav = this,","			oTarget = event.target,","			oMenuLabel = getMenuLabel(oTarget, true),","			sType = event.type,","			oAnchor,","			oSubmenu,","			sHref,","			nHashPos,","			nLen,","			sId;","","","		if (oMenuLabel) {","","			oAnchor = isAnchor(oTarget) ? oTarget : oTarget.ancestor(isAnchor);","			","","			if (oAnchor) {","","				//	Need to pass \"2\" as a second argument to \"getAttribute\" for ","				//	IE otherwise IE will return a fully qualified URL for the ","				//	value of the \"href\" attribute.","				//	http://msdn.microsoft.com/en-us/library/ms536429(VS.85).aspx","","				sHref = oAnchor.getAttribute(\"href\", 2);","				nHashPos = sHref.indexOf(\"#\");","				nLen = sHref.length;","","				if (nHashPos === 0 && nLen > 1) {","","					sId = sHref.substr(1, nLen);","					oSubmenu = oMenuLabel.next();","","					if (oSubmenu && (oSubmenu.get(ID) === sId)) {","","						if (sType === MOUSEDOWN || sType === KEYDOWN) {","							","							if ((UA.opera || UA.gecko || UA.ie) && sType === KEYDOWN && !menuNav._preventClickHandle) {","","								//	Prevent the browser from following the URL of ","								//	the anchor element","","								menuNav._preventClickHandle = menuNav._rootMenu.on(\"click\", function (event) {","","									event.preventDefault();","","									menuNav._preventClickHandle.detach();","									menuNav._preventClickHandle = null;","","								});","","							}","							","							if (sType == MOUSEDOWN) {","","								//	Prevent the target from getting focused by ","								//	default, since the element to be focused will","								//	be determined by weather or not the submenu","								//	is visible.","								event.preventDefault();","","								//	FocusManager will attempt to focus any ","								//	descendant that is the target of the mousedown","								//	event.  Since we want to explicitly control ","	 							//	where focus is going, we need to call ","								//	\"stopImmediatePropagation\" to stop the ","								//	FocusManager from doing its thing.","								event.stopImmediatePropagation();	","","								//	The \"_focusItem\" method relies on the ","								//	\"_hasFocus\" property being set to true.  The","								//	\"_hasFocus\" property is normally set via a ","								//	\"focus\" event listener, but since we've ","								//	blocked focus from happening, we need to set ","								//	this property manually.","								menuNav._hasFocus = true;","","							}","","								","							if (menuNav._isRoot(getParentMenu(oTarget))) {	//	Event target is a submenu label in the root menu","							","								//	Menu label toggle functionality","							","								if (hasVisibleSubmenu(oMenuLabel)) {","							","									menuNav._hideMenu(oSubmenu);","									menuNav._focusItem(oMenuLabel);	","									menuNav._setActiveItem(oMenuLabel);","									","								}","								else {","							","									menuNav._hideAllSubmenus(menuNav._rootMenu);","									menuNav._showMenu(oSubmenu);","","									menuNav._focusItem(getFirstItem(oSubmenu));","									menuNav._setActiveItem(getFirstItem(oSubmenu));","									","								}","							","							}","							else {	//	Event target is a submenu label within a submenu","							","								if (menuNav._activeItem == oMenuLabel) {","							","									menuNav._showMenu(oSubmenu);","									menuNav._focusItem(getFirstItem(oSubmenu));","									menuNav._setActiveItem(getFirstItem(oSubmenu));										","							","								}","								else {","							","									if (!oMenuLabel._clickHandle) {","","										oMenuLabel._clickHandle = oMenuLabel.on(\"click\", function () {","","											menuNav._hideAllSubmenus(menuNav._rootMenu);","","											menuNav._hasFocus = false;","											menuNav._clearActiveItem();","","","											oMenuLabel._clickHandle.detach();","											","											oMenuLabel._clickHandle = null;","","										});","										","									}","									","								}","								","							}","","						}","","","						if (sType === CLICK) {","						","							//	Prevent the browser from following the URL of ","							//	the anchor element","							","							event.preventDefault();","						","						}","					","					}","				","				}				","","","			}","		","		}","	","	},","	","","	/**","	* @method _onKeyPress","	* @description \"keypress\" event handler for the menu.","	* @protected","	* @param {Object} event Object representing the DOM event.","	*/","	_onKeyPress: function (event) {","	","		switch (event.keyCode) {","","			case 37:	//	left arrow","			case 38:	//	up arrow","			case 39:	//	right arrow","			case 40:	//	down arrow","","				//	Prevent the browser from scrolling the window","","				event.preventDefault();","","			break;","","		}						","","	},	","","","	/**","	* @method _onKeyDown","	* @description \"keydown\" event handler for the menu.","	* @protected","	* @param {Object} event Object representing the DOM event.","	*/","	_onKeyDown: function (event) {","","		var menuNav = this,","			oActiveItem = menuNav._activeItem,","			oTarget = event.target,","			oActiveMenu = getParentMenu(oTarget),","			oSubmenu;","","		if (oActiveMenu) {","","			menuNav._activeMenu = oActiveMenu;","","			if (isHorizontalMenu(oActiveMenu)) {","				menuNav._onHorizontalMenuKeyDown(event);","			}","			else {","				menuNav._onVerticalMenuKeyDown(event);","			}","","","			if (event.keyCode === 27) {","","				if (!menuNav._isRoot(oActiveMenu)) {","","					if (UA.opera) {","						later(0, menuNav, function () {","							menuNav._hideMenu(oActiveMenu, true);","						});						","					}","					else {","						menuNav._hideMenu(oActiveMenu, true);						","					}","","					event.stopPropagation();","					menuNav._blockMouseEvent = UA.gecko ? true : false;","","				}","				else if (oActiveItem) {","","					if (isMenuLabel(oActiveItem) && ","							hasVisibleSubmenu(oActiveItem)) {","					","						oSubmenu = oActiveItem.next();","","						if (oSubmenu) {","							menuNav._hideMenu(oSubmenu);","						}","","					}","					else {","","						menuNav._focusManager.blur();","","						//	This is necessary for Webkit since blurring the ","						//	active menuitem won't result in the document ","						//	gaining focus, meaning the that _onDocFocus ","						//	listener won't clear the active menuitem.","","						menuNav._clearActiveItem();	","						","						menuNav._hasFocus = false;","","					}","","				}","			","			}","		","		}","	","	},","	","	/**","	* @method _onDocMouseDown","	* @description \"mousedown\" event handler for the owner document of ","	* the menu.","	* @protected","	* @param {Object} event Object representing the DOM event.","	*/","	_onDocMouseDown: function (event) {","","		var menuNav = this,","			oRoot = menuNav._rootMenu,","			oTarget = event.target;","","","		if (!(oRoot.compareTo(oTarget) || oRoot.contains(oTarget))) {","","			menuNav._hideAllSubmenus(oRoot);","","			//	Document doesn't receive focus in Webkit when the user mouses ","			//	down on it, so the \"_hasFocus\" property won't get set to the ","			//	correct value.  The following line corrects the problem.","","			if (UA.webkit) {","				menuNav._hasFocus = false;","				menuNav._clearActiveItem();","			}","","		}","","	}","	","});","","","Y.namespace('Plugin');","","Y.Plugin.NodeMenuNav = NodeMenuNav;","","","}, '3.7.3', {\"requires\": [\"node\", \"classnamemanager\", \"plugin\", \"node-focusmanager\"], \"skinnable\": true});"];
_yuitest_coverage["build/node-menunav/node-menunav.js"].lines = {"1":0,"87":0,"158":0,"160":0,"163":0,"164":0,"165":0,"168":0,"173":0,"175":0,"177":0,"178":0,"181":0,"186":0,"188":0,"190":0,"191":0,"194":0,"199":0,"201":0,"206":0,"208":0,"213":0,"215":0,"220":0,"222":0,"227":0,"229":0,"234":0,"236":0,"238":0,"240":0,"241":0,"244":0,"245":0,"250":0,"255":0,"257":0,"262":0,"264":0,"269":0,"271":0,"273":0,"274":0,"277":0,"282":0,"284":0,"286":0,"288":0,"289":0,"292":0,"298":0,"303":0,"305":0,"307":0,"308":0,"312":0,"317":0,"319":0,"324":0,"326":0,"331":0,"333":0,"339":0,"341":0,"353":0,"355":0,"359":0,"360":0,"371":0,"400":0,"406":0,"425":0,"431":0,"433":0,"435":0,"437":0,"439":0,"441":0,"442":0,"444":0,"445":0,"446":0,"449":0,"450":0,"452":0,"454":0,"456":0,"458":0,"459":0,"461":0,"462":0,"465":0,"467":0,"468":0,"471":0,"472":0,"560":0,"693":0,"699":0,"701":0,"703":0,"707":0,"712":0,"713":0,"714":0,"715":0,"716":0,"717":0,"718":0,"719":0,"721":0,"723":0,"724":0,"726":0,"728":0,"737":0,"739":0,"741":0,"742":0,"745":0,"749":0,"768":0,"782":0,"787":0,"788":0,"790":0,"791":0,"794":0,"797":0,"809":0,"812":0,"813":0,"816":0,"830":0,"832":0,"834":0,"836":0,"838":0,"853":0,"857":0,"859":0,"860":0,"862":0,"863":0,"864":0,"867":0,"882":0,"887":0,"888":0,"892":0,"893":0,"896":0,"899":0,"901":0,"903":0,"905":0,"906":0,"912":0,"922":0,"928":0,"929":0,"945":0,"949":0,"952":0,"953":0,"954":0,"957":0,"959":0,"960":0,"967":0,"969":0,"971":0,"972":0,"986":0,"988":0,"990":0,"1004":0,"1007":0,"1008":0,"1009":0,"1022":0,"1026":0,"1027":0,"1028":0,"1042":0,"1052":0,"1054":0,"1057":0,"1062":0,"1063":0,"1068":0,"1070":0,"1076":0,"1078":0,"1081":0,"1083":0,"1086":0,"1089":0,"1094":0,"1095":0,"1096":0,"1116":0,"1119":0,"1136":0,"1138":0,"1139":0,"1140":0,"1154":0,"1160":0,"1162":0,"1164":0,"1172":0,"1174":0,"1175":0,"1176":0,"1177":0,"1187":0,"1189":0,"1191":0,"1192":0,"1200":0,"1202":0,"1203":0,"1205":0,"1206":0,"1208":0,"1210":0,"1226":0,"1229":0,"1230":0,"1231":0,"1234":0,"1240":0,"1241":0,"1243":0,"1244":0,"1249":0,"1250":0,"1264":0,"1268":0,"1270":0,"1273":0,"1274":0,"1290":0,"1298":0,"1300":0,"1303":0,"1305":0,"1307":0,"1309":0,"1319":0,"1321":0,"1323":0,"1324":0,"1345":0,"1354":0,"1356":0,"1357":0,"1359":0,"1361":0,"1363":0,"1364":0,"1365":0,"1373":0,"1374":0,"1377":0,"1379":0,"1390":0,"1391":0,"1396":0,"1413":0,"1422":0,"1423":0,"1426":0,"1428":0,"1430":0,"1438":0,"1443":0,"1452":0,"1454":0,"1472":0,"1479":0,"1480":0,"1483":0,"1485":0,"1501":0,"1514":0,"1526":0,"1530":0,"1532":0,"1534":0,"1535":0,"1536":0,"1538":0,"1540":0,"1542":0,"1545":0,"1547":0,"1548":0,"1549":0,"1554":0,"1555":0,"1562":0,"1563":0,"1570":0,"1571":0,"1575":0,"1577":0,"1581":0,"1583":0,"1585":0,"1587":0,"1588":0,"1589":0,"1594":0,"1596":0,"1597":0,"1598":0,"1600":0,"1602":0,"1604":0,"1606":0,"1608":0,"1610":0,"1611":0,"1612":0,"1617":0,"1618":0,"1625":0,"1626":0,"1634":0,"1636":0,"1641":0,"1645":0,"1660":0,"1669":0,"1671":0,"1673":0,"1675":0,"1677":0,"1679":0,"1680":0,"1681":0,"1685":0,"1692":0,"1696":0,"1714":0,"1720":0,"1722":0,"1737":0,"1745":0,"1746":0,"1750":0,"1751":0,"1752":0,"1753":0,"1756":0,"1758":0,"1760":0,"1761":0,"1763":0,"1765":0,"1767":0,"1768":0,"1774":0,"1776":0,"1778":0,"1779":0,"1783":0,"1785":0,"1787":0,"1788":0,"1805":0,"1816":0,"1820":0,"1821":0,"1822":0,"1823":0,"1824":0,"1827":0,"1829":0,"1831":0,"1832":0,"1836":0,"1838":0,"1840":0,"1841":0,"1846":0,"1848":0,"1850":0,"1854":0,"1861":0,"1863":0,"1865":0,"1866":0,"1882":0,"1894":0,"1896":0,"1899":0,"1906":0,"1907":0,"1908":0,"1910":0,"1912":0,"1913":0,"1915":0,"1917":0,"1919":0,"1924":0,"1926":0,"1928":0,"1929":0,"1935":0,"1941":0,"1949":0,"1957":0,"1962":0,"1966":0,"1968":0,"1969":0,"1970":0,"1975":0,"1976":0,"1978":0,"1979":0,"1986":0,"1988":0,"1989":0,"1990":0,"1995":0,"1997":0,"1999":0,"2001":0,"2002":0,"2005":0,"2007":0,"2020":0,"2025":0,"2049":0,"2058":0,"2060":0,"2075":0,"2081":0,"2083":0,"2085":0,"2086":0,"2089":0,"2093":0,"2095":0,"2097":0,"2098":0,"2099":0,"2103":0,"2106":0,"2107":0,"2110":0,"2112":0,"2115":0,"2117":0,"2118":0,"2124":0,"2131":0,"2133":0,"2154":0,"2159":0,"2161":0,"2167":0,"2168":0,"2169":0,"2179":0,"2181":0};
_yuitest_coverage["build/node-menunav/node-menunav.js"].functions = {"getPreviousSibling:158":0,"getNextSibling:173":0,"isAnchor:186":0,"isMenuItem:199":0,"isMenuLabel:206":0,"isHorizontalMenu:213":0,"hasVisibleSubmenu:220":0,"getItemAnchor:227":0,"getNodeWithClass:234":0,"getParentMenu:255":0,"getMenu:262":0,"getMenuItem:269":0,"getMenuLabel:282":0,"getItem:303":0,"getFirstItem:317":0,"getActiveClass:324":0,"handleMouseOverForNode:331":0,"handleMouseOutForNode:339":0,"NodeMenuNav:353":0,"(anonymous 2):439":0,"setter:423":0,"initializer:691":0,"(anonymous 3):741":0,"destructor:735":0,"_isRoot:766":0,"_getTopmostSubmenu:780":0,"_clearActiveItem:807":0,"_setActiveItem:828":0,"_focusItem:851":0,"_showMenu:880":0,"_hideMenu:943":0,"(anonymous 4):988":0,"_hideAllSubmenus:984":0,"_cancelShowSubmenuTimer:1002":0,"_cancelHideSubmenuTimer:1020":0,"_initFocusManager:1040":0,"_onActiveDescendantChange:1114":0,"_afterActiveDescendantChange:1134":0,"_onDocFocus:1152":0,"_onMenuMouseOver:1224":0,"_hideAndFocusLabel:1262":0,"_onMenuMouseOut:1288":0,"showSubmenu:1354":0,"(anonymous 5):1390":0,"_onMenuLabelMouseOver:1343":0,"_onMenuLabelMouseOut:1411":0,"_onMenuItemMouseOver:1470":0,"_onMenuItemMouseOut:1499":0,"_onVerticalMenuKeyDown:1512":0,"_onHorizontalMenuKeyDown:1658":0,"(anonymous 6):1720":0,"_onMouseMove:1712":0,"_onMouseOver:1735":0,"_onMouseOut:1803":0,"(anonymous 7):1924":0,"(anonymous 8):1997":0,"_toggleSubmenuDisplay:1880":0,"_onKeyPress:2047":0,"(anonymous 9):2098":0,"_onKeyDown:2073":0,"_onDocMouseDown:2152":0,"(anonymous 1):1":0};
_yuitest_coverage["build/node-menunav/node-menunav.js"].coveredLines = 472;
_yuitest_coverage["build/node-menunav/node-menunav.js"].coveredFunctions = 62;
_yuitest_coverline("build/node-menunav/node-menunav.js", 1);
YUI.add('node-menunav', function (Y, NAME) {

/**
* <p>The MenuNav Node Plugin makes it easy to transform existing list-based 
* markup into traditional, drop down navigational menus that are both accessible 
* and easy to customize, and only require a small set of dependencies.</p>
* 
* 
* <p>To use the MenuNav Node Plugin, simply pass a reference to the plugin to a 
* Node instance's <code>plug</code> method.</p>
* 
* <p>
* <code>
* &#60;script type="text/javascript"&#62; <br>
* <br>
* 		//	Call the "use" method, passing in "node-menunav".  This will <br>
* 		//	load the script and CSS for the MenuNav Node Plugin and all of <br>
* 		//	the required dependencies. <br>
* <br>
* 		YUI().use("node-menunav", function(Y) { <br>
* <br>
* 			//	Use the "contentready" event to initialize the menu when <br>
* 			//	the subtree of element representing the root menu <br>
* 			//	(&#60;div id="menu-1"&#62;) is ready to be scripted. <br>
* <br>
* 			Y.on("contentready", function () { <br>
* <br>
* 				//	The scope of the callback will be a Node instance <br>
* 				//	representing the root menu (&#60;div id="menu-1"&#62;). <br>
* 				//	Therefore, since "this" represents a Node instance, it <br>
* 				//	is possible to just call "this.plug" passing in a <br>
*				//	reference to the MenuNav Node Plugin. <br>
* <br>
* 				this.plug(Y.Plugin.NodeMenuNav); <br>
* <br>
* 			}, "#menu-1"); <br>
* <br>		
* 		}); <br>
* <br>	
* 	&#60;/script&#62; <br>
* </code>
* </p>
*
* <p>The MenuNav Node Plugin has several configuration properties that can be 
* set via an object literal that is passed as a second argument to a Node 
* instance's <code>plug</code> method.
* </p>
*
* <p>
* <code>
* &#60;script type="text/javascript"&#62; <br>
* <br>
* 		//	Call the "use" method, passing in "node-menunav".  This will <br>
* 		//	load the script and CSS for the MenuNav Node Plugin and all of <br>
* 		//	the required dependencies. <br>
* <br>
* 		YUI().use("node-menunav", function(Y) { <br>
* <br>
* 			//	Use the "contentready" event to initialize the menu when <br>
* 			//	the subtree of element representing the root menu <br>
* 			//	(&#60;div id="menu-1"&#62;) is ready to be scripted. <br>
* <br>
* 			Y.on("contentready", function () { <br>
* <br>
* 				//	The scope of the callback will be a Node instance <br>
* 				//	representing the root menu (&#60;div id="menu-1"&#62;). <br>
* 				//	Therefore, since "this" represents a Node instance, it <br>
* 				//	is possible to just call "this.plug" passing in a <br>
*				//	reference to the MenuNav Node Plugin. <br>
* <br>
* 				this.plug(Y.Plugin.NodeMenuNav, { mouseOutHideDelay: 1000 });
* <br><br>
* 			}, "#menu-1"); <br>
* <br>		
* 		}); <br>
* <br>	
* 	&#60;/script&#62; <br>
* </code>
* </p>
* 
* @module node-menunav
*/


	//	Util shortcuts

_yuitest_coverfunc("build/node-menunav/node-menunav.js", "(anonymous 1)", 1);
_yuitest_coverline("build/node-menunav/node-menunav.js", 87);
var UA = Y.UA,
	later = Y.later,
	getClassName = Y.ClassNameManager.getClassName,



	//	Frequently used strings

	MENU = "menu",
	MENUITEM = "menuitem",
	HIDDEN = "hidden",
	PARENT_NODE = "parentNode",
	CHILDREN = "children",
	OFFSET_HEIGHT = "offsetHeight",
	OFFSET_WIDTH = "offsetWidth",
	PX = "px",
	ID = "id",
	PERIOD = ".",
	HANDLED_MOUSEOUT = "handledMouseOut",
	HANDLED_MOUSEOVER = "handledMouseOver",
	ACTIVE = "active",
	LABEL = "label",
	LOWERCASE_A = "a",
	MOUSEDOWN = "mousedown",
	KEYDOWN = "keydown",
	CLICK = "click",
	EMPTY_STRING = "",
	FIRST_OF_TYPE = "first-of-type",
	ROLE = "role",
	PRESENTATION = "presentation",
	DESCENDANTS = "descendants",
	UI = "UI",
	ACTIVE_DESCENDANT = "activeDescendant",
	USE_ARIA = "useARIA",
	ARIA_HIDDEN = "aria-hidden",
	CONTENT = "content",
	HOST = "host",
	ACTIVE_DESCENDANT_CHANGE = ACTIVE_DESCENDANT + "Change",


	//	Attribute keys
	
	AUTO_SUBMENU_DISPLAY = "autoSubmenuDisplay",
	MOUSEOUT_HIDE_DELAY = "mouseOutHideDelay",


	//	CSS class names

	CSS_MENU = getClassName(MENU),
	CSS_MENU_HIDDEN = getClassName(MENU, HIDDEN),
	CSS_MENU_HORIZONTAL = getClassName(MENU, "horizontal"),
	CSS_MENU_LABEL = getClassName(MENU, LABEL),
	CSS_MENU_LABEL_ACTIVE = getClassName(MENU, LABEL, ACTIVE),
	CSS_MENU_LABEL_MENUVISIBLE = getClassName(MENU, LABEL, (MENU + "visible")),
	CSS_MENUITEM = getClassName(MENUITEM),
	CSS_MENUITEM_ACTIVE = getClassName(MENUITEM, ACTIVE),


	//	CSS selectors
	
	MENU_SELECTOR = PERIOD + CSS_MENU,
	MENU_TOGGLE_SELECTOR = (PERIOD + getClassName(MENU, "toggle")),
    MENU_CONTENT_SELECTOR = PERIOD + getClassName(MENU, CONTENT),
    MENU_LABEL_SELECTOR = PERIOD + CSS_MENU_LABEL,

	STANDARD_QUERY = ">" + MENU_CONTENT_SELECTOR + ">ul>li>a",
	EXTENDED_QUERY = ">" + MENU_CONTENT_SELECTOR + ">ul>li>" + MENU_LABEL_SELECTOR + ">a:first-child";

//	Utility functions


_yuitest_coverline("build/node-menunav/node-menunav.js", 158);
var getPreviousSibling = function (node) {

	_yuitest_coverfunc("build/node-menunav/node-menunav.js", "getPreviousSibling", 158);
_yuitest_coverline("build/node-menunav/node-menunav.js", 160);
var oPrevious = node.previous(),
		oChildren;

	_yuitest_coverline("build/node-menunav/node-menunav.js", 163);
if (!oPrevious) {
		_yuitest_coverline("build/node-menunav/node-menunav.js", 164);
oChildren = node.get(PARENT_NODE).get(CHILDREN);
		_yuitest_coverline("build/node-menunav/node-menunav.js", 165);
oPrevious = oChildren.item(oChildren.size() - 1);
	}
	
	_yuitest_coverline("build/node-menunav/node-menunav.js", 168);
return oPrevious;

};


_yuitest_coverline("build/node-menunav/node-menunav.js", 173);
var getNextSibling = function (node) {

	_yuitest_coverfunc("build/node-menunav/node-menunav.js", "getNextSibling", 173);
_yuitest_coverline("build/node-menunav/node-menunav.js", 175);
var oNext = node.next();

	_yuitest_coverline("build/node-menunav/node-menunav.js", 177);
if (!oNext) {
		_yuitest_coverline("build/node-menunav/node-menunav.js", 178);
oNext = node.get(PARENT_NODE).get(CHILDREN).item(0);		
	}
	
	_yuitest_coverline("build/node-menunav/node-menunav.js", 181);
return oNext;

};


_yuitest_coverline("build/node-menunav/node-menunav.js", 186);
var isAnchor = function (node) {
	
	_yuitest_coverfunc("build/node-menunav/node-menunav.js", "isAnchor", 186);
_yuitest_coverline("build/node-menunav/node-menunav.js", 188);
var bReturnVal = false;
	
	_yuitest_coverline("build/node-menunav/node-menunav.js", 190);
if (node) {
		_yuitest_coverline("build/node-menunav/node-menunav.js", 191);
bReturnVal = node.get("nodeName").toLowerCase() === LOWERCASE_A;
	}
	
	_yuitest_coverline("build/node-menunav/node-menunav.js", 194);
return bReturnVal;
	
};


_yuitest_coverline("build/node-menunav/node-menunav.js", 199);
var isMenuItem = function (node) {

	_yuitest_coverfunc("build/node-menunav/node-menunav.js", "isMenuItem", 199);
_yuitest_coverline("build/node-menunav/node-menunav.js", 201);
return node.hasClass(CSS_MENUITEM);

};


_yuitest_coverline("build/node-menunav/node-menunav.js", 206);
var isMenuLabel = function (node) {

	_yuitest_coverfunc("build/node-menunav/node-menunav.js", "isMenuLabel", 206);
_yuitest_coverline("build/node-menunav/node-menunav.js", 208);
return node.hasClass(CSS_MENU_LABEL);

};


_yuitest_coverline("build/node-menunav/node-menunav.js", 213);
var isHorizontalMenu = function (menu) {

	_yuitest_coverfunc("build/node-menunav/node-menunav.js", "isHorizontalMenu", 213);
_yuitest_coverline("build/node-menunav/node-menunav.js", 215);
return menu.hasClass(CSS_MENU_HORIZONTAL);

};


_yuitest_coverline("build/node-menunav/node-menunav.js", 220);
var hasVisibleSubmenu = function (menuLabel) {

	_yuitest_coverfunc("build/node-menunav/node-menunav.js", "hasVisibleSubmenu", 220);
_yuitest_coverline("build/node-menunav/node-menunav.js", 222);
return menuLabel.hasClass(CSS_MENU_LABEL_MENUVISIBLE);

};


_yuitest_coverline("build/node-menunav/node-menunav.js", 227);
var getItemAnchor = function (node) {

	_yuitest_coverfunc("build/node-menunav/node-menunav.js", "getItemAnchor", 227);
_yuitest_coverline("build/node-menunav/node-menunav.js", 229);
return isAnchor(node) ? node : node.one(LOWERCASE_A);

};


_yuitest_coverline("build/node-menunav/node-menunav.js", 234);
var getNodeWithClass = function (node, className, searchAncestors) {

	_yuitest_coverfunc("build/node-menunav/node-menunav.js", "getNodeWithClass", 234);
_yuitest_coverline("build/node-menunav/node-menunav.js", 236);
var oItem;
	
	_yuitest_coverline("build/node-menunav/node-menunav.js", 238);
if (node) {
		
		_yuitest_coverline("build/node-menunav/node-menunav.js", 240);
if (node.hasClass(className)) {
			_yuitest_coverline("build/node-menunav/node-menunav.js", 241);
oItem = node;
		}
		
		_yuitest_coverline("build/node-menunav/node-menunav.js", 244);
if (!oItem && searchAncestors) {
			_yuitest_coverline("build/node-menunav/node-menunav.js", 245);
oItem = node.ancestor((PERIOD + className));
		}
	
	}
	
	_yuitest_coverline("build/node-menunav/node-menunav.js", 250);
return oItem;

};


_yuitest_coverline("build/node-menunav/node-menunav.js", 255);
var getParentMenu = function (node) {

	_yuitest_coverfunc("build/node-menunav/node-menunav.js", "getParentMenu", 255);
_yuitest_coverline("build/node-menunav/node-menunav.js", 257);
return node.ancestor(MENU_SELECTOR);
	
};


_yuitest_coverline("build/node-menunav/node-menunav.js", 262);
var getMenu = function (node, searchAncestors) {

	_yuitest_coverfunc("build/node-menunav/node-menunav.js", "getMenu", 262);
_yuitest_coverline("build/node-menunav/node-menunav.js", 264);
return getNodeWithClass(node, CSS_MENU, searchAncestors);

};


_yuitest_coverline("build/node-menunav/node-menunav.js", 269);
var getMenuItem = function (node, searchAncestors) {

	_yuitest_coverfunc("build/node-menunav/node-menunav.js", "getMenuItem", 269);
_yuitest_coverline("build/node-menunav/node-menunav.js", 271);
var oItem;
	
	_yuitest_coverline("build/node-menunav/node-menunav.js", 273);
if (node) {
		_yuitest_coverline("build/node-menunav/node-menunav.js", 274);
oItem = getNodeWithClass(node, CSS_MENUITEM, searchAncestors);
	}
	
	_yuitest_coverline("build/node-menunav/node-menunav.js", 277);
return oItem;

};


_yuitest_coverline("build/node-menunav/node-menunav.js", 282);
var getMenuLabel = function (node, searchAncestors) {

	_yuitest_coverfunc("build/node-menunav/node-menunav.js", "getMenuLabel", 282);
_yuitest_coverline("build/node-menunav/node-menunav.js", 284);
var oItem;
	
	_yuitest_coverline("build/node-menunav/node-menunav.js", 286);
if (node) {
	
		_yuitest_coverline("build/node-menunav/node-menunav.js", 288);
if (searchAncestors) {
			_yuitest_coverline("build/node-menunav/node-menunav.js", 289);
oItem = getNodeWithClass(node, CSS_MENU_LABEL, searchAncestors);
		}
		else {
			_yuitest_coverline("build/node-menunav/node-menunav.js", 292);
oItem = getNodeWithClass(node, CSS_MENU_LABEL) || 
				node.one((PERIOD + CSS_MENU_LABEL));
		}
		
	}
	
	_yuitest_coverline("build/node-menunav/node-menunav.js", 298);
return oItem;

};


_yuitest_coverline("build/node-menunav/node-menunav.js", 303);
var getItem = function (node, searchAncestors) {

	_yuitest_coverfunc("build/node-menunav/node-menunav.js", "getItem", 303);
_yuitest_coverline("build/node-menunav/node-menunav.js", 305);
var oItem;
	
	_yuitest_coverline("build/node-menunav/node-menunav.js", 307);
if (node) {
		_yuitest_coverline("build/node-menunav/node-menunav.js", 308);
oItem = getMenuItem(node, searchAncestors) || 
			getMenuLabel(node, searchAncestors);
	}
	
	_yuitest_coverline("build/node-menunav/node-menunav.js", 312);
return oItem;	

};


_yuitest_coverline("build/node-menunav/node-menunav.js", 317);
var getFirstItem = function (menu) {
	
	_yuitest_coverfunc("build/node-menunav/node-menunav.js", "getFirstItem", 317);
_yuitest_coverline("build/node-menunav/node-menunav.js", 319);
return getItem(menu.one("li"));

};


_yuitest_coverline("build/node-menunav/node-menunav.js", 324);
var getActiveClass = function (node) {

	_yuitest_coverfunc("build/node-menunav/node-menunav.js", "getActiveClass", 324);
_yuitest_coverline("build/node-menunav/node-menunav.js", 326);
return isMenuItem(node) ? CSS_MENUITEM_ACTIVE : CSS_MENU_LABEL_ACTIVE;

};


_yuitest_coverline("build/node-menunav/node-menunav.js", 331);
var handleMouseOverForNode = function (node, target) {

	_yuitest_coverfunc("build/node-menunav/node-menunav.js", "handleMouseOverForNode", 331);
_yuitest_coverline("build/node-menunav/node-menunav.js", 333);
return node && !node[HANDLED_MOUSEOVER] && 
		(node.compareTo(target) || node.contains(target));

};


_yuitest_coverline("build/node-menunav/node-menunav.js", 339);
var handleMouseOutForNode = function (node, relatedTarget) {

	_yuitest_coverfunc("build/node-menunav/node-menunav.js", "handleMouseOutForNode", 339);
_yuitest_coverline("build/node-menunav/node-menunav.js", 341);
return node && !node[HANDLED_MOUSEOUT] && 
		(!node.compareTo(relatedTarget) && !node.contains(relatedTarget));

};

/**
* The NodeMenuNav class is a plugin for a Node instance.  The class is used via  
* the <a href="Node.html#method_plug"><code>plug</code></a> method of Node and 
* should not be instantiated directly.
* @namespace plugin
* @class NodeMenuNav
*/
_yuitest_coverline("build/node-menunav/node-menunav.js", 353);
var NodeMenuNav = function () {

	_yuitest_coverfunc("build/node-menunav/node-menunav.js", "NodeMenuNav", 353);
_yuitest_coverline("build/node-menunav/node-menunav.js", 355);
NodeMenuNav.superclass.constructor.apply(this, arguments);

};

_yuitest_coverline("build/node-menunav/node-menunav.js", 359);
NodeMenuNav.NAME = "nodeMenuNav";
_yuitest_coverline("build/node-menunav/node-menunav.js", 360);
NodeMenuNav.NS = "menuNav";


/** 
* @property SHIM_TEMPLATE_TITLE
* @description String representing the value for the <code>title</code> 
* attribute for the shim used to prevent <code>&#60;select&#62;</code> elements 
* from poking through menus in IE 6.
* @default "Menu Stacking Shim"
* @type String
*/
_yuitest_coverline("build/node-menunav/node-menunav.js", 371);
NodeMenuNav.SHIM_TEMPLATE_TITLE = "Menu Stacking Shim";


/** 
* @property SHIM_TEMPLATE
* @description String representing the HTML used to create the 
* <code>&#60;iframe&#62;</code> shim used to prevent 
* <code>&#60;select&#62;</code> elements from poking through menus in IE 6.
* @default &#34;&#60;iframe frameborder=&#34;0&#34; tabindex=&#34;-1&#34; 
* class=&#34;yui-shim&#34; title=&#34;Menu Stacking Shim&#34; 
* src=&#34;javascript:false;&#34;&#62;&#60;/iframe&#62;&#34;
* @type String
*/

//	<iframe> shim notes:
//
//	1) Need to set the "frameBorder" property to 0 to suppress the default 
//	<iframe> border in IE.  (Setting the CSS "border" property alone doesn't  
//	suppress it.) 
//
//	2) The "src" attribute of the <iframe> is set to "javascript:false;" so 
//	that it won't load a page inside it, preventing the secure/nonsecure 
//	warning in IE when using HTTPS.
//
//	3) Since the role of the <iframe> shim is completely presentational, its 
//	"tabindex" attribute is set to "-1" and its title attribute is set to 
//	"Menu Stacking Shim".  Both strategies help users of screen readers to 
//	avoid mistakenly interacting with the <iframe> shim.

_yuitest_coverline("build/node-menunav/node-menunav.js", 400);
NodeMenuNav.SHIM_TEMPLATE = '<iframe frameborder="0" tabindex="-1" class="' + 
							getClassName("shim") + 
							'" title="' + NodeMenuNav.SHIM_TEMPLATE_TITLE + 
							'" src="javascript:false;"></iframe>';


_yuitest_coverline("build/node-menunav/node-menunav.js", 406);
NodeMenuNav.ATTRS = {

	/**
	* Boolean indicating if use of the WAI-ARIA Roles and States should be 
	* enabled for the menu.
	*
	* @attribute useARIA
	* @readOnly
	* @writeOnce	
	* @default true
	* @type boolean
	*/
	useARIA: {
		
		value: true,
		writeOnce: true,
		lazyAdd: false,
		setter: function (value) {

			_yuitest_coverfunc("build/node-menunav/node-menunav.js", "setter", 423);
_yuitest_coverline("build/node-menunav/node-menunav.js", 425);
var oMenu = this.get(HOST),
				oMenuLabel,
				oMenuToggle,
				oSubmenu,
				sID;

			_yuitest_coverline("build/node-menunav/node-menunav.js", 431);
if (value) {

				_yuitest_coverline("build/node-menunav/node-menunav.js", 433);
oMenu.set(ROLE, MENU);

				_yuitest_coverline("build/node-menunav/node-menunav.js", 435);
oMenu.all("ul,li," + MENU_CONTENT_SELECTOR).set(ROLE, PRESENTATION);

				_yuitest_coverline("build/node-menunav/node-menunav.js", 437);
oMenu.all((PERIOD + getClassName(MENUITEM, CONTENT))).set(ROLE, MENUITEM);

				_yuitest_coverline("build/node-menunav/node-menunav.js", 439);
oMenu.all((PERIOD + CSS_MENU_LABEL)).each(function (node) {

					_yuitest_coverfunc("build/node-menunav/node-menunav.js", "(anonymous 2)", 439);
_yuitest_coverline("build/node-menunav/node-menunav.js", 441);
oMenuLabel = node;
					_yuitest_coverline("build/node-menunav/node-menunav.js", 442);
oMenuToggle = node.one(MENU_TOGGLE_SELECTOR);

					_yuitest_coverline("build/node-menunav/node-menunav.js", 444);
if (oMenuToggle) {
						_yuitest_coverline("build/node-menunav/node-menunav.js", 445);
oMenuToggle.set(ROLE, PRESENTATION);
						_yuitest_coverline("build/node-menunav/node-menunav.js", 446);
oMenuLabel = oMenuToggle.previous();
					}

					_yuitest_coverline("build/node-menunav/node-menunav.js", 449);
oMenuLabel.set(ROLE, MENUITEM);
					_yuitest_coverline("build/node-menunav/node-menunav.js", 450);
oMenuLabel.set("aria-haspopup", true);

					_yuitest_coverline("build/node-menunav/node-menunav.js", 452);
oSubmenu = node.next();

					_yuitest_coverline("build/node-menunav/node-menunav.js", 454);
if (oSubmenu) {

						_yuitest_coverline("build/node-menunav/node-menunav.js", 456);
oSubmenu.set(ROLE, MENU);

						_yuitest_coverline("build/node-menunav/node-menunav.js", 458);
oMenuLabel = oSubmenu.previous();
						_yuitest_coverline("build/node-menunav/node-menunav.js", 459);
oMenuToggle = oMenuLabel.one(MENU_TOGGLE_SELECTOR);

						_yuitest_coverline("build/node-menunav/node-menunav.js", 461);
if (oMenuToggle) {
							_yuitest_coverline("build/node-menunav/node-menunav.js", 462);
oMenuLabel = oMenuToggle;
						}

						_yuitest_coverline("build/node-menunav/node-menunav.js", 465);
sID = Y.stamp(oMenuLabel);

						_yuitest_coverline("build/node-menunav/node-menunav.js", 467);
if (!oMenuLabel.get(ID)) {
							_yuitest_coverline("build/node-menunav/node-menunav.js", 468);
oMenuLabel.set(ID, sID);
						}

						_yuitest_coverline("build/node-menunav/node-menunav.js", 471);
oSubmenu.set("aria-labelledby", sID);
						_yuitest_coverline("build/node-menunav/node-menunav.js", 472);
oSubmenu.set(ARIA_HIDDEN, true);
						
					}

				});
				
			}

		}
		
	},


	/**
	* Boolean indicating if submenus are automatically made visible when the 
	* user mouses over the menu's items.
	*
	* @attribute autoSubmenuDisplay
	* @readOnly
	* @writeOnce	
	* @default true
	* @type boolean
	*/	
	autoSubmenuDisplay: {
		
		value: true,
		writeOnce: true
		
	},


	/**
	* Number indicating the time (in milliseconds) that should expire before a 
	* submenu is made visible when the user mouses over the menu's label.
	*
	* @attribute submenuShowDelay
	* @readOnly
	* @writeOnce	
	* @default 250
	* @type Number
	*/
	submenuShowDelay: {
		
		value: 250,
		writeOnce: true
		
	},


	/**
	* Number indicating the time (in milliseconds) that should expire before a 
	* submenu is hidden when the user mouses out of a menu label heading in the 
	* direction of a submenu.  
	*
	* @attribute submenuHideDelay
	* @readOnly
	* @writeOnce	
	* @default 250
	* @type Number
	*/
	submenuHideDelay: {
		
		value: 250,
		writeOnce: true
		
	},


	/**
	* Number indicating the time (in milliseconds) that should expire before a 
	* submenu is hidden when the user mouses out of it.
	* 
	* @attribute mouseOutHideDelay
	* @readOnly
	* @writeOnce	
	* @default 750
	* @type Number
	*/	
	mouseOutHideDelay: {
		
		value: 750,
		writeOnce: true
		
	}

};


_yuitest_coverline("build/node-menunav/node-menunav.js", 560);
Y.extend(NodeMenuNav, Y.Plugin.Base, {

	//	Protected properties

	/** 
	* @property _rootMenu
	* @description Node instance representing the root menu in the menu.
	* @default null
	* @protected
	* @type Node
	*/
	_rootMenu: null,	


	/** 
	* @property _activeItem
	* @description Node instance representing the menu's active descendent: 
	* the menuitem or menu label the user is currently interacting with.
	* @default null
	* @protected
	* @type Node
	*/
	_activeItem: null, 


	/** 
	* @property _activeMenu
	* @description Node instance representing the menu that is the parent of 
	* the menu's active descendent.
	* @default null
	* @protected
	* @type Node
	*/
	_activeMenu: null,


	/** 
	* @property _hasFocus
	* @description Boolean indicating if the menu has focus.
	* @default false
	* @protected
	* @type Boolean
	*/
	_hasFocus: false,


	//	In gecko-based browsers a mouseover and mouseout event will fire even 
	//	if a DOM element moves out from under the mouse without the user 
	//	actually moving the mouse.  This bug affects NodeMenuNav because the  
	//	user can hit the Esc key to hide a menu, and if the mouse is over the  
	//	menu when the user presses Esc, the _onMenuMouseOut handler will be 
	//	called.  To fix this bug the following flag (_blockMouseEvent) is used 
	// to block the code in the _onMenuMouseOut handler from executing.

	/** 
	* @property _blockMouseEvent
	* @description Boolean indicating whether or not to handle the 
	* "mouseover" event.
	* @default false
	* @protected
	* @type Boolean
	*/
	_blockMouseEvent: false,


	/** 
	* @property _currentMouseX
	* @description Number representing the current x coordinate of the mouse 
	* inside the menu.
	* @default 0
	* @protected
	* @type Number
	*/
	_currentMouseX: 0,


	/** 
	* @property _movingToSubmenu
	* @description Boolean indicating if the mouse is moving from a menu 
	* label to its corresponding submenu.
	* @default false
	* @protected
	* @type Boolean
	*/
	_movingToSubmenu: false,


	/** 
	* @property _showSubmenuTimer
	* @description Timer used to show a submenu.
	* @default null
	* @protected
	* @type Object
	*/
	_showSubmenuTimer: null,


	/** 
	* @property _hideSubmenuTimer
	* @description Timer used to hide a submenu.
	* @default null
	* @protected
	* @type Object
	*/
	_hideSubmenuTimer: null,


	/** 
	* @property _hideAllSubmenusTimer
	* @description Timer used to hide a all submenus.
	* @default null
	* @protected
	* @type Object
	*/
	_hideAllSubmenusTimer: null,


	/** 
	* @property _firstItem
	* @description Node instance representing the first item (menuitem or menu 
	* label) in the root menu of a menu.
	* @default null
	* @protected
	* @type Node
	*/
	_firstItem: null,


	//	Public methods


    initializer: function (config) {

		_yuitest_coverfunc("build/node-menunav/node-menunav.js", "initializer", 691);
_yuitest_coverline("build/node-menunav/node-menunav.js", 693);
var menuNav = this,
			oRootMenu = this.get(HOST),
			aHandlers = [],
			oDoc;


		_yuitest_coverline("build/node-menunav/node-menunav.js", 699);
if (oRootMenu) {

			_yuitest_coverline("build/node-menunav/node-menunav.js", 701);
menuNav._rootMenu = oRootMenu;

			_yuitest_coverline("build/node-menunav/node-menunav.js", 703);
oRootMenu.all("ul:first-child").addClass(FIRST_OF_TYPE);

			//	Hide all visible submenus

			_yuitest_coverline("build/node-menunav/node-menunav.js", 707);
oRootMenu.all(MENU_SELECTOR).addClass(CSS_MENU_HIDDEN);


			//	Wire up all event handlers

			_yuitest_coverline("build/node-menunav/node-menunav.js", 712);
aHandlers.push(oRootMenu.on("mouseover", menuNav._onMouseOver, menuNav));
			_yuitest_coverline("build/node-menunav/node-menunav.js", 713);
aHandlers.push(oRootMenu.on("mouseout", menuNav._onMouseOut, menuNav));
			_yuitest_coverline("build/node-menunav/node-menunav.js", 714);
aHandlers.push(oRootMenu.on("mousemove", menuNav._onMouseMove, menuNav));
			_yuitest_coverline("build/node-menunav/node-menunav.js", 715);
aHandlers.push(oRootMenu.on(MOUSEDOWN, menuNav._toggleSubmenuDisplay, menuNav));
			_yuitest_coverline("build/node-menunav/node-menunav.js", 716);
aHandlers.push(Y.on("key", menuNav._toggleSubmenuDisplay, oRootMenu, "down:13", menuNav));
			_yuitest_coverline("build/node-menunav/node-menunav.js", 717);
aHandlers.push(oRootMenu.on(CLICK, menuNav._toggleSubmenuDisplay, menuNav));
			_yuitest_coverline("build/node-menunav/node-menunav.js", 718);
aHandlers.push(oRootMenu.on("keypress", menuNav._onKeyPress, menuNav));
			_yuitest_coverline("build/node-menunav/node-menunav.js", 719);
aHandlers.push(oRootMenu.on(KEYDOWN, menuNav._onKeyDown, menuNav));

			_yuitest_coverline("build/node-menunav/node-menunav.js", 721);
oDoc = oRootMenu.get("ownerDocument");

		    _yuitest_coverline("build/node-menunav/node-menunav.js", 723);
aHandlers.push(oDoc.on(MOUSEDOWN, menuNav._onDocMouseDown, menuNav));
			_yuitest_coverline("build/node-menunav/node-menunav.js", 724);
aHandlers.push(oDoc.on("focus", menuNav._onDocFocus, menuNav));

			_yuitest_coverline("build/node-menunav/node-menunav.js", 726);
this._eventHandlers = aHandlers;

			_yuitest_coverline("build/node-menunav/node-menunav.js", 728);
menuNav._initFocusManager();

		}
		

    },

	destructor: function () {

		_yuitest_coverfunc("build/node-menunav/node-menunav.js", "destructor", 735);
_yuitest_coverline("build/node-menunav/node-menunav.js", 737);
var aHandlers = this._eventHandlers;

		_yuitest_coverline("build/node-menunav/node-menunav.js", 739);
if (aHandlers) {

			_yuitest_coverline("build/node-menunav/node-menunav.js", 741);
Y.Array.each(aHandlers, function (handle) {
				_yuitest_coverfunc("build/node-menunav/node-menunav.js", "(anonymous 3)", 741);
_yuitest_coverline("build/node-menunav/node-menunav.js", 742);
handle.detach();
			});

			_yuitest_coverline("build/node-menunav/node-menunav.js", 745);
this._eventHandlers = null;

		}
		
		_yuitest_coverline("build/node-menunav/node-menunav.js", 749);
this.get(HOST).unplug("focusManager");
		
    },



	//	Protected methods

	/**
	* @method _isRoot
	* @description Returns a boolean indicating if the specified menu is the 
	* root menu in the menu.
	* @protected
	* @param {Node} menu Node instance representing a menu.
	* @return {Boolean} Boolean indicating if the specified menu is the root 
	* menu in the menu.
	*/
	_isRoot: function (menu) {

		_yuitest_coverfunc("build/node-menunav/node-menunav.js", "_isRoot", 766);
_yuitest_coverline("build/node-menunav/node-menunav.js", 768);
return this._rootMenu.compareTo(menu);

	},


	/**
	* @method _getTopmostSubmenu
	* @description Returns the topmost submenu of a submenu hierarchy.
	* @protected
	* @param {Node} menu Node instance representing a menu.
	* @return {Node} Node instance representing a menu.
	*/
	_getTopmostSubmenu: function (menu) {
	
		_yuitest_coverfunc("build/node-menunav/node-menunav.js", "_getTopmostSubmenu", 780);
_yuitest_coverline("build/node-menunav/node-menunav.js", 782);
var menuNav = this,
			oMenu = getParentMenu(menu),
			returnVal;


		_yuitest_coverline("build/node-menunav/node-menunav.js", 787);
if (!oMenu) {
			_yuitest_coverline("build/node-menunav/node-menunav.js", 788);
returnVal = menu;
		}
		else {_yuitest_coverline("build/node-menunav/node-menunav.js", 790);
if (menuNav._isRoot(oMenu)) {
			_yuitest_coverline("build/node-menunav/node-menunav.js", 791);
returnVal = menu;
		}
		else {
			_yuitest_coverline("build/node-menunav/node-menunav.js", 794);
returnVal = menuNav._getTopmostSubmenu(oMenu);
		}}
	
		_yuitest_coverline("build/node-menunav/node-menunav.js", 797);
return returnVal;
	
	},


	/**
	* @method _clearActiveItem
	* @description Clears the menu's active descendent.
	* @protected
	*/
	_clearActiveItem: function () {

		_yuitest_coverfunc("build/node-menunav/node-menunav.js", "_clearActiveItem", 807);
_yuitest_coverline("build/node-menunav/node-menunav.js", 809);
var menuNav = this,
			oActiveItem = menuNav._activeItem;
		
		_yuitest_coverline("build/node-menunav/node-menunav.js", 812);
if (oActiveItem) {
			_yuitest_coverline("build/node-menunav/node-menunav.js", 813);
oActiveItem.removeClass(getActiveClass(oActiveItem));
		}

		_yuitest_coverline("build/node-menunav/node-menunav.js", 816);
menuNav._activeItem = null;
	
	},


	/**
	* @method _setActiveItem
	* @description Sets the specified menuitem or menu label as the menu's 
	* active descendent.
	* @protected
	* @param {Node} item Node instance representing a menuitem or menu label.
	*/
	_setActiveItem: function (item) {

		_yuitest_coverfunc("build/node-menunav/node-menunav.js", "_setActiveItem", 828);
_yuitest_coverline("build/node-menunav/node-menunav.js", 830);
var menuNav = this;
	
		_yuitest_coverline("build/node-menunav/node-menunav.js", 832);
if (item) {
			
			_yuitest_coverline("build/node-menunav/node-menunav.js", 834);
menuNav._clearActiveItem();
	
			_yuitest_coverline("build/node-menunav/node-menunav.js", 836);
item.addClass(getActiveClass(item));
			
			_yuitest_coverline("build/node-menunav/node-menunav.js", 838);
menuNav._activeItem = item;
		
		}
	
	},


	/**
	* @method _focusItem
	* @description Focuses the specified menuitem or menu label.
	* @protected
	* @param {Node} item Node instance representing a menuitem or menu label.
	*/
	_focusItem: function (item) {
	
		_yuitest_coverfunc("build/node-menunav/node-menunav.js", "_focusItem", 851);
_yuitest_coverline("build/node-menunav/node-menunav.js", 853);
var menuNav = this,
			oMenu,
			oItem;
	
		_yuitest_coverline("build/node-menunav/node-menunav.js", 857);
if (item && menuNav._hasFocus) {

			_yuitest_coverline("build/node-menunav/node-menunav.js", 859);
oMenu = getParentMenu(item);
			_yuitest_coverline("build/node-menunav/node-menunav.js", 860);
oItem = getItemAnchor(item);

			_yuitest_coverline("build/node-menunav/node-menunav.js", 862);
if (oMenu && !oMenu.compareTo(menuNav._activeMenu)) {
				_yuitest_coverline("build/node-menunav/node-menunav.js", 863);
menuNav._activeMenu = oMenu;
				_yuitest_coverline("build/node-menunav/node-menunav.js", 864);
menuNav._initFocusManager();
			}
		
			_yuitest_coverline("build/node-menunav/node-menunav.js", 867);
menuNav._focusManager.focus(oItem);

		}
	
	},


	/**
	* @method _showMenu
	* @description Shows the specified menu.
	* @protected
	* @param {Node} menu Node instance representing a menu.
	*/
	_showMenu: function (menu) {

		_yuitest_coverfunc("build/node-menunav/node-menunav.js", "_showMenu", 880);
_yuitest_coverline("build/node-menunav/node-menunav.js", 882);
var oParentMenu = getParentMenu(menu),
			oLI = menu.get(PARENT_NODE),
			aXY = oLI.getXY();


		_yuitest_coverline("build/node-menunav/node-menunav.js", 887);
if (this.get(USE_ARIA)) {
			_yuitest_coverline("build/node-menunav/node-menunav.js", 888);
menu.set(ARIA_HIDDEN, false);
		}


		_yuitest_coverline("build/node-menunav/node-menunav.js", 892);
if (isHorizontalMenu(oParentMenu)) {
			_yuitest_coverline("build/node-menunav/node-menunav.js", 893);
aXY[1] = aXY[1] + oLI.get(OFFSET_HEIGHT);
		}
		else {
			_yuitest_coverline("build/node-menunav/node-menunav.js", 896);
aXY[0] = aXY[0] + oLI.get(OFFSET_WIDTH);
		}
		
		_yuitest_coverline("build/node-menunav/node-menunav.js", 899);
menu.setXY(aXY);

		_yuitest_coverline("build/node-menunav/node-menunav.js", 901);
if (UA.ie < 8) {

			_yuitest_coverline("build/node-menunav/node-menunav.js", 903);
if (UA.ie === 6 && !menu.hasIFrameShim) {
	
				_yuitest_coverline("build/node-menunav/node-menunav.js", 905);
menu.appendChild(Y.Node.create(NodeMenuNav.SHIM_TEMPLATE));
				_yuitest_coverline("build/node-menunav/node-menunav.js", 906);
menu.hasIFrameShim = true;

			}

			//	Clear previous values for height and width

			_yuitest_coverline("build/node-menunav/node-menunav.js", 912);
menu.setStyles({ height: EMPTY_STRING, width: EMPTY_STRING });

			//	Set the width and height of the menu's bounding box - this is 
			//	necessary for IE 6 so that the CSS for the <iframe> shim can 
			//	simply set the <iframe>'s width and height to 100% to ensure 
			//	that dimensions of an <iframe> shim are always sync'd to the 
			//	that of its parent menu.  Specifying a width and height also 
			//	helps when positioning decorator elements (for creating effects 
			//	like rounded corners) inside a menu's bounding box in IE 7.
			
			_yuitest_coverline("build/node-menunav/node-menunav.js", 922);
menu.setStyles({ 
				height: (menu.get(OFFSET_HEIGHT) + PX), 
				width: (menu.get(OFFSET_WIDTH) + PX) });

		}

		_yuitest_coverline("build/node-menunav/node-menunav.js", 928);
menu.previous().addClass(CSS_MENU_LABEL_MENUVISIBLE);
		_yuitest_coverline("build/node-menunav/node-menunav.js", 929);
menu.removeClass(CSS_MENU_HIDDEN);

	},
	

	/**
	* @method _hideMenu 
	* @description Hides the specified menu.
	* @protected
	* @param {Node} menu Node instance representing a menu.
	* @param {Boolean} activateAndFocusLabel Boolean indicating if the label 
	* for the specified 
	* menu should be focused and set as active.
	*/
	_hideMenu: function (menu, activateAndFocusLabel) {

		_yuitest_coverfunc("build/node-menunav/node-menunav.js", "_hideMenu", 943);
_yuitest_coverline("build/node-menunav/node-menunav.js", 945);
var menuNav = this,
			oLabel = menu.previous(),
			oActiveItem;

		_yuitest_coverline("build/node-menunav/node-menunav.js", 949);
oLabel.removeClass(CSS_MENU_LABEL_MENUVISIBLE);


		_yuitest_coverline("build/node-menunav/node-menunav.js", 952);
if (activateAndFocusLabel) {
			_yuitest_coverline("build/node-menunav/node-menunav.js", 953);
menuNav._focusItem(oLabel);
			_yuitest_coverline("build/node-menunav/node-menunav.js", 954);
menuNav._setActiveItem(oLabel);			
		}

		_yuitest_coverline("build/node-menunav/node-menunav.js", 957);
oActiveItem = menu.one((PERIOD + CSS_MENUITEM_ACTIVE));

		_yuitest_coverline("build/node-menunav/node-menunav.js", 959);
if (oActiveItem) {
			_yuitest_coverline("build/node-menunav/node-menunav.js", 960);
oActiveItem.removeClass(CSS_MENUITEM_ACTIVE);
		}

		//	Clear the values for top and left that were set by the call to 
		//	"setXY" when the menu was shown so that the hidden position 
		//	specified in the core CSS file will take affect.

		_yuitest_coverline("build/node-menunav/node-menunav.js", 967);
menu.setStyles({ left: EMPTY_STRING, top: EMPTY_STRING });
		
		_yuitest_coverline("build/node-menunav/node-menunav.js", 969);
menu.addClass(CSS_MENU_HIDDEN);

		_yuitest_coverline("build/node-menunav/node-menunav.js", 971);
if (menuNav.get(USE_ARIA)) {
			_yuitest_coverline("build/node-menunav/node-menunav.js", 972);
menu.set(ARIA_HIDDEN, true);
		}	
		
	},


	/**
	* @method _hideAllSubmenus
	* @description Hides all submenus of the specified menu.
	* @protected
	* @param {Node} menu Node instance representing a menu.
	*/
	_hideAllSubmenus: function (menu) {

		_yuitest_coverfunc("build/node-menunav/node-menunav.js", "_hideAllSubmenus", 984);
_yuitest_coverline("build/node-menunav/node-menunav.js", 986);
var menuNav = this;

		_yuitest_coverline("build/node-menunav/node-menunav.js", 988);
menu.all(MENU_SELECTOR).each(Y.bind(function (submenuNode) {
		
			_yuitest_coverfunc("build/node-menunav/node-menunav.js", "(anonymous 4)", 988);
_yuitest_coverline("build/node-menunav/node-menunav.js", 990);
menuNav._hideMenu(submenuNode);
		
		}, menuNav));
	
	},


	/**
	* @method _cancelShowSubmenuTimer
	* @description Cancels the timer used to show a submenu.
	* @protected
	*/
	_cancelShowSubmenuTimer: function () {

		_yuitest_coverfunc("build/node-menunav/node-menunav.js", "_cancelShowSubmenuTimer", 1002);
_yuitest_coverline("build/node-menunav/node-menunav.js", 1004);
var menuNav = this,
			oShowSubmenuTimer = menuNav._showSubmenuTimer;

		_yuitest_coverline("build/node-menunav/node-menunav.js", 1007);
if (oShowSubmenuTimer) {
			_yuitest_coverline("build/node-menunav/node-menunav.js", 1008);
oShowSubmenuTimer.cancel();
			_yuitest_coverline("build/node-menunav/node-menunav.js", 1009);
menuNav._showSubmenuTimer = null;
		}
	
	},


	/**
	* @method _cancelHideSubmenuTimer
	* @description Cancels the timer used to hide a submenu.
	* @protected
	*/
	_cancelHideSubmenuTimer: function () {

		_yuitest_coverfunc("build/node-menunav/node-menunav.js", "_cancelHideSubmenuTimer", 1020);
_yuitest_coverline("build/node-menunav/node-menunav.js", 1022);
var menuNav = this,
			oHideSubmenuTimer = menuNav._hideSubmenuTimer;


		_yuitest_coverline("build/node-menunav/node-menunav.js", 1026);
if (oHideSubmenuTimer) {
			_yuitest_coverline("build/node-menunav/node-menunav.js", 1027);
oHideSubmenuTimer.cancel();
			_yuitest_coverline("build/node-menunav/node-menunav.js", 1028);
menuNav._hideSubmenuTimer = null;
		}
	
	},


	/**
	* @method _initFocusManager
	* @description Initializes and updates the Focus Manager so that is is 
	* always managing descendants of the active menu.
	* @protected
	*/
	_initFocusManager: function () {

		_yuitest_coverfunc("build/node-menunav/node-menunav.js", "_initFocusManager", 1040);
_yuitest_coverline("build/node-menunav/node-menunav.js", 1042);
var menuNav = this,
			oRootMenu = menuNav._rootMenu,
			oMenu = menuNav._activeMenu || oRootMenu,
			sSelectorBase = 
				menuNav._isRoot(oMenu) ? EMPTY_STRING : ("#" + oMenu.get("id")),
			oFocusManager = menuNav._focusManager,
			sKeysVal,
			sDescendantSelector,
			sQuery;

		_yuitest_coverline("build/node-menunav/node-menunav.js", 1052);
if (isHorizontalMenu(oMenu)) {

			_yuitest_coverline("build/node-menunav/node-menunav.js", 1054);
sDescendantSelector = sSelectorBase + STANDARD_QUERY + "," + 
				sSelectorBase + EXTENDED_QUERY;
			
			_yuitest_coverline("build/node-menunav/node-menunav.js", 1057);
sKeysVal = { next: "down:39", previous: "down:37" };
			
		}
		else {

			_yuitest_coverline("build/node-menunav/node-menunav.js", 1062);
sDescendantSelector = sSelectorBase + STANDARD_QUERY;
			_yuitest_coverline("build/node-menunav/node-menunav.js", 1063);
sKeysVal = { next: "down:40", previous: "down:38" };

		}


		_yuitest_coverline("build/node-menunav/node-menunav.js", 1068);
if (!oFocusManager) {

			_yuitest_coverline("build/node-menunav/node-menunav.js", 1070);
oRootMenu.plug(Y.Plugin.NodeFocusManager, { 
				descendants: sDescendantSelector,
				keys: sKeysVal,
				circular: true
			});

			_yuitest_coverline("build/node-menunav/node-menunav.js", 1076);
oFocusManager = oRootMenu.focusManager;

			_yuitest_coverline("build/node-menunav/node-menunav.js", 1078);
sQuery = "#" + oRootMenu.get("id") + MENU_SELECTOR + " a," + 
							MENU_TOGGLE_SELECTOR;

			_yuitest_coverline("build/node-menunav/node-menunav.js", 1081);
oRootMenu.all(sQuery).set("tabIndex", -1);

			_yuitest_coverline("build/node-menunav/node-menunav.js", 1083);
oFocusManager.on(ACTIVE_DESCENDANT_CHANGE, 
				this._onActiveDescendantChange, oFocusManager, this);

			_yuitest_coverline("build/node-menunav/node-menunav.js", 1086);
oFocusManager.after(ACTIVE_DESCENDANT_CHANGE, 
				this._afterActiveDescendantChange, oFocusManager, this);
			
			_yuitest_coverline("build/node-menunav/node-menunav.js", 1089);
menuNav._focusManager = oFocusManager;
			
		}
		else {

			_yuitest_coverline("build/node-menunav/node-menunav.js", 1094);
oFocusManager.set(ACTIVE_DESCENDANT, -1);
			_yuitest_coverline("build/node-menunav/node-menunav.js", 1095);
oFocusManager.set(DESCENDANTS, sDescendantSelector);
			_yuitest_coverline("build/node-menunav/node-menunav.js", 1096);
oFocusManager.set("keys", sKeysVal);
			
		}

	},


	//	Event handlers for discrete pieces of pieces of the menu


	/**
	* @method _onActiveDescendantChange
	* @description "activeDescendantChange" event handler for menu's 
	* Focus Manager.
	* @protected
	* @param {Object} event Object representing the Attribute change event.
	* @param {NodeMenuNav} menuNav Object representing the NodeMenuNav instance.
	*/
	_onActiveDescendantChange: function (event, menuNav) {

		_yuitest_coverfunc("build/node-menunav/node-menunav.js", "_onActiveDescendantChange", 1114);
_yuitest_coverline("build/node-menunav/node-menunav.js", 1116);
if (event.src === UI && menuNav._activeMenu && 
				!menuNav._movingToSubmenu) {

			_yuitest_coverline("build/node-menunav/node-menunav.js", 1119);
menuNav._hideAllSubmenus(menuNav._activeMenu);

		}
		
	},


	/**
	* @method _afterActiveDescendantChange
	* @description "activeDescendantChange" event handler for menu's 
	* Focus Manager.
	* @protected
	* @param {Object} event Object representing the Attribute change event.
	* @param {NodeMenuNav} menuNav Object representing the NodeMenuNav instance.
	*/
	_afterActiveDescendantChange: function (event, menuNav) {

		_yuitest_coverfunc("build/node-menunav/node-menunav.js", "_afterActiveDescendantChange", 1134);
_yuitest_coverline("build/node-menunav/node-menunav.js", 1136);
var oItem;

		_yuitest_coverline("build/node-menunav/node-menunav.js", 1138);
if (event.src === UI) {
			_yuitest_coverline("build/node-menunav/node-menunav.js", 1139);
oItem = getItem(this.get(DESCENDANTS).item(event.newVal), true);
			_yuitest_coverline("build/node-menunav/node-menunav.js", 1140);
menuNav._setActiveItem(oItem);
		}
	
	},


	/**
	* @method _onDocFocus
	* @description "focus" event handler for the owner document of the MenuNav.
	* @protected
	* @param {Object} event Object representing the DOM event.
	*/
	_onDocFocus: function (event) {
	
		_yuitest_coverfunc("build/node-menunav/node-menunav.js", "_onDocFocus", 1152);
_yuitest_coverline("build/node-menunav/node-menunav.js", 1154);
var menuNav = this,
			oActiveItem = menuNav._activeItem,
			oTarget = event.target,
			oMenu;
	

		_yuitest_coverline("build/node-menunav/node-menunav.js", 1160);
if (menuNav._rootMenu.contains(oTarget)) {	//	The menu has focus

			_yuitest_coverline("build/node-menunav/node-menunav.js", 1162);
if (menuNav._hasFocus) {	

				_yuitest_coverline("build/node-menunav/node-menunav.js", 1164);
oMenu = getParentMenu(oTarget);

				//	If the element that was focused is a descendant of the 
				//	root menu, but is in a submenu not currently being 
				//	managed by the Focus Manager, update the Focus Manager so 
				//	that it is now managing the submenu that is the parent of  
				//	the element that was focused.
				
				_yuitest_coverline("build/node-menunav/node-menunav.js", 1172);
if (!menuNav._activeMenu.compareTo(oMenu)) {

					_yuitest_coverline("build/node-menunav/node-menunav.js", 1174);
menuNav._activeMenu = oMenu;
					_yuitest_coverline("build/node-menunav/node-menunav.js", 1175);
menuNav._initFocusManager();
					_yuitest_coverline("build/node-menunav/node-menunav.js", 1176);
menuNav._focusManager.set(ACTIVE_DESCENDANT, oTarget);
					_yuitest_coverline("build/node-menunav/node-menunav.js", 1177);
menuNav._setActiveItem(getItem(oTarget, true));
					
				}
			
			}
			else { //	Initial focus

				//	First time the menu has been focused, need to setup focused 
				//	state and established active active descendant
	
				_yuitest_coverline("build/node-menunav/node-menunav.js", 1187);
menuNav._hasFocus = true;
	
				_yuitest_coverline("build/node-menunav/node-menunav.js", 1189);
oActiveItem = getItem(oTarget, true);
	
				_yuitest_coverline("build/node-menunav/node-menunav.js", 1191);
if (oActiveItem) {	
					_yuitest_coverline("build/node-menunav/node-menunav.js", 1192);
menuNav._setActiveItem(oActiveItem);
				}
				
			}
		
		}
		else {	//	The menu has lost focus

			_yuitest_coverline("build/node-menunav/node-menunav.js", 1200);
menuNav._clearActiveItem();

			_yuitest_coverline("build/node-menunav/node-menunav.js", 1202);
menuNav._cancelShowSubmenuTimer();
			_yuitest_coverline("build/node-menunav/node-menunav.js", 1203);
menuNav._hideAllSubmenus(menuNav._rootMenu);

			_yuitest_coverline("build/node-menunav/node-menunav.js", 1205);
menuNav._activeMenu = menuNav._rootMenu;
			_yuitest_coverline("build/node-menunav/node-menunav.js", 1206);
menuNav._initFocusManager();
			
			_yuitest_coverline("build/node-menunav/node-menunav.js", 1208);
menuNav._focusManager.set(ACTIVE_DESCENDANT, 0);
			
			_yuitest_coverline("build/node-menunav/node-menunav.js", 1210);
menuNav._hasFocus = false;

		}
	
	},


	/**
	* @method _onMenuMouseOver
	* @description "mouseover" event handler for a menu.
	* @protected
	* @param {Node} menu Node instance representing a menu.
	* @param {Object} event Object representing the DOM event.
	*/
	_onMenuMouseOver: function (menu, event) {

		_yuitest_coverfunc("build/node-menunav/node-menunav.js", "_onMenuMouseOver", 1224);
_yuitest_coverline("build/node-menunav/node-menunav.js", 1226);
var menuNav = this,
			oHideAllSubmenusTimer = menuNav._hideAllSubmenusTimer;

		_yuitest_coverline("build/node-menunav/node-menunav.js", 1229);
if (oHideAllSubmenusTimer) {
			_yuitest_coverline("build/node-menunav/node-menunav.js", 1230);
oHideAllSubmenusTimer.cancel();
			_yuitest_coverline("build/node-menunav/node-menunav.js", 1231);
menuNav._hideAllSubmenusTimer = null;
		}

		_yuitest_coverline("build/node-menunav/node-menunav.js", 1234);
menuNav._cancelHideSubmenuTimer();

		//	Need to update the FocusManager in advance of focus a new 
		//	Menu in order to avoid the FocusManager thinking that 
		//	it has lost focus
		
		_yuitest_coverline("build/node-menunav/node-menunav.js", 1240);
if (menu && !menu.compareTo(menuNav._activeMenu)) {
			_yuitest_coverline("build/node-menunav/node-menunav.js", 1241);
menuNav._activeMenu = menu;

			_yuitest_coverline("build/node-menunav/node-menunav.js", 1243);
if (menuNav._hasFocus) {
				_yuitest_coverline("build/node-menunav/node-menunav.js", 1244);
menuNav._initFocusManager();
			}

		}

		_yuitest_coverline("build/node-menunav/node-menunav.js", 1249);
if (menuNav._movingToSubmenu && isHorizontalMenu(menu)) {
			_yuitest_coverline("build/node-menunav/node-menunav.js", 1250);
menuNav._movingToSubmenu = false;
		}

	},


	/**
	* @method _hideAndFocusLabel
	* @description Hides all of the submenus of the root menu and focuses the 
	* label of the topmost submenu
	* @protected
	*/
	_hideAndFocusLabel: function () {

		_yuitest_coverfunc("build/node-menunav/node-menunav.js", "_hideAndFocusLabel", 1262);
_yuitest_coverline("build/node-menunav/node-menunav.js", 1264);
var	menuNav = this,
			oActiveMenu = menuNav._activeMenu,
			oSubmenu;
	
		_yuitest_coverline("build/node-menunav/node-menunav.js", 1268);
menuNav._hideAllSubmenus(menuNav._rootMenu);

		_yuitest_coverline("build/node-menunav/node-menunav.js", 1270);
if (oActiveMenu) {

			//	Focus the label element for the topmost submenu
			_yuitest_coverline("build/node-menunav/node-menunav.js", 1273);
oSubmenu = menuNav._getTopmostSubmenu(oActiveMenu);
			_yuitest_coverline("build/node-menunav/node-menunav.js", 1274);
menuNav._focusItem(oSubmenu.previous());

		}
	
	},


	/**
	* @method _onMenuMouseOut
	* @description "mouseout" event handler for a menu.
	* @protected
	* @param {Node} menu Node instance representing a menu.
	* @param {Object} event Object representing the DOM event.
	*/
	_onMenuMouseOut: function (menu, event) {

		_yuitest_coverfunc("build/node-menunav/node-menunav.js", "_onMenuMouseOut", 1288);
_yuitest_coverline("build/node-menunav/node-menunav.js", 1290);
var menuNav = this,
			oActiveMenu = menuNav._activeMenu,
			oRelatedTarget = event.relatedTarget,
			oActiveItem = menuNav._activeItem,
			oParentMenu,
			oMenu;


		_yuitest_coverline("build/node-menunav/node-menunav.js", 1298);
if (oActiveMenu && !oActiveMenu.contains(oRelatedTarget)) {
		
			_yuitest_coverline("build/node-menunav/node-menunav.js", 1300);
oParentMenu = getParentMenu(oActiveMenu);
			

			_yuitest_coverline("build/node-menunav/node-menunav.js", 1303);
if (oParentMenu && !oParentMenu.contains(oRelatedTarget)) {

				_yuitest_coverline("build/node-menunav/node-menunav.js", 1305);
if (menuNav.get(MOUSEOUT_HIDE_DELAY) > 0) {

					_yuitest_coverline("build/node-menunav/node-menunav.js", 1307);
menuNav._cancelShowSubmenuTimer();

					_yuitest_coverline("build/node-menunav/node-menunav.js", 1309);
menuNav._hideAllSubmenusTimer = 

						later(menuNav.get(MOUSEOUT_HIDE_DELAY), 
							menuNav, menuNav._hideAndFocusLabel);
						
				}
			
			}
			else {
			
				_yuitest_coverline("build/node-menunav/node-menunav.js", 1319);
if (oActiveItem) {
				
					_yuitest_coverline("build/node-menunav/node-menunav.js", 1321);
oMenu = getParentMenu(oActiveItem);

					_yuitest_coverline("build/node-menunav/node-menunav.js", 1323);
if (!menuNav._isRoot(oMenu)) { 
						_yuitest_coverline("build/node-menunav/node-menunav.js", 1324);
menuNav._focusItem(oMenu.previous());
					}
				
				}
			
			}

		}

	},


	/**
	* @method _onMenuLabelMouseOver
	* @description "mouseover" event handler for a menu label.
	* @protected
	* @param {Node} menuLabel Node instance representing a menu label.
	* @param {Object} event Object representing the DOM event.
	*/
	_onMenuLabelMouseOver: function (menuLabel, event) {

		_yuitest_coverfunc("build/node-menunav/node-menunav.js", "_onMenuLabelMouseOver", 1343);
_yuitest_coverline("build/node-menunav/node-menunav.js", 1345);
var menuNav = this,
			oActiveMenu = menuNav._activeMenu,
			bIsRoot = menuNav._isRoot(oActiveMenu),
			bUseAutoSubmenuDisplay = 
				(menuNav.get(AUTO_SUBMENU_DISPLAY) && bIsRoot || !bIsRoot),
            submenuShowDelay = menuNav.get("submenuShowDelay"),	
			oSubmenu;
				

        _yuitest_coverline("build/node-menunav/node-menunav.js", 1354);
var showSubmenu = function (delay) {

			_yuitest_coverfunc("build/node-menunav/node-menunav.js", "showSubmenu", 1354);
_yuitest_coverline("build/node-menunav/node-menunav.js", 1356);
menuNav._cancelHideSubmenuTimer();
			_yuitest_coverline("build/node-menunav/node-menunav.js", 1357);
menuNav._cancelShowSubmenuTimer();

			_yuitest_coverline("build/node-menunav/node-menunav.js", 1359);
if (!hasVisibleSubmenu(menuLabel)) {

				_yuitest_coverline("build/node-menunav/node-menunav.js", 1361);
oSubmenu = menuLabel.next();

				_yuitest_coverline("build/node-menunav/node-menunav.js", 1363);
if (oSubmenu) {
					_yuitest_coverline("build/node-menunav/node-menunav.js", 1364);
menuNav._hideAllSubmenus(oActiveMenu);
					_yuitest_coverline("build/node-menunav/node-menunav.js", 1365);
menuNav._showSubmenuTimer = later(delay, menuNav, menuNav._showMenu, oSubmenu);
				}

			}
            
        };


		_yuitest_coverline("build/node-menunav/node-menunav.js", 1373);
menuNav._focusItem(menuLabel);
		_yuitest_coverline("build/node-menunav/node-menunav.js", 1374);
menuNav._setActiveItem(menuLabel);


		_yuitest_coverline("build/node-menunav/node-menunav.js", 1377);
if (bUseAutoSubmenuDisplay) {
	
	        _yuitest_coverline("build/node-menunav/node-menunav.js", 1379);
if (menuNav._movingToSubmenu) {
	            
	            //  If the user is moving diagonally from a submenu to 
	            //  another submenu and they then stop and pause on a
	            //  menu label for an amount of time equal to the amount of 
	            //  time defined for the display of a submenu then show the 
	            //  submenu immediately.
	            //  http://yuilibrary.com/projects/yui3/ticket/2528316
	            
	            //Y.message("Pause path");
	            
	            _yuitest_coverline("build/node-menunav/node-menunav.js", 1390);
menuNav._hoverTimer = later(submenuShowDelay, menuNav, function () {
                    _yuitest_coverfunc("build/node-menunav/node-menunav.js", "(anonymous 5)", 1390);
_yuitest_coverline("build/node-menunav/node-menunav.js", 1391);
showSubmenu(0);
	            });
	            
	        }
	        else {
                _yuitest_coverline("build/node-menunav/node-menunav.js", 1396);
showSubmenu(submenuShowDelay);
	        }
		
		}

	},


	/**
	* @method _onMenuLabelMouseOut
	* @description "mouseout" event handler for a menu label.
	* @protected
	* @param {Node} menuLabel Node instance representing a menu label.
	* @param {Object} event Object representing the DOM event.
	*/
	_onMenuLabelMouseOut: function (menuLabel, event) {

		_yuitest_coverfunc("build/node-menunav/node-menunav.js", "_onMenuLabelMouseOut", 1411);
_yuitest_coverline("build/node-menunav/node-menunav.js", 1413);
var menuNav = this,
			bIsRoot = menuNav._isRoot(menuNav._activeMenu),
			bUseAutoSubmenuDisplay = 
				(menuNav.get(AUTO_SUBMENU_DISPLAY) && bIsRoot || !bIsRoot),

			oRelatedTarget = event.relatedTarget,
			oSubmenu = menuLabel.next(),
			hoverTimer = menuNav._hoverTimer;

        _yuitest_coverline("build/node-menunav/node-menunav.js", 1422);
if (hoverTimer) {
            _yuitest_coverline("build/node-menunav/node-menunav.js", 1423);
hoverTimer.cancel();
        }

		_yuitest_coverline("build/node-menunav/node-menunav.js", 1426);
menuNav._clearActiveItem();

		_yuitest_coverline("build/node-menunav/node-menunav.js", 1428);
if (bUseAutoSubmenuDisplay) {

			_yuitest_coverline("build/node-menunav/node-menunav.js", 1430);
if (menuNav._movingToSubmenu && 
					!menuNav._showSubmenuTimer && oSubmenu) {

				//	If the mouse is moving diagonally toward the submenu and 
				//	another submenu isn't in the process of being displayed 
				//	(via a timer), then hide the submenu via a timer to give
				//	the user some time to reach the submenu.
			
				_yuitest_coverline("build/node-menunav/node-menunav.js", 1438);
menuNav._hideSubmenuTimer = 
					later(menuNav.get("submenuHideDelay"), menuNav, 
						menuNav._hideMenu, oSubmenu);
			
			}
			else {_yuitest_coverline("build/node-menunav/node-menunav.js", 1443);
if (!menuNav._movingToSubmenu && oSubmenu && (!oRelatedTarget || 
			        (oRelatedTarget && 
			            !oSubmenu.contains(oRelatedTarget) && 
			            !oRelatedTarget.compareTo(oSubmenu)))) {

				//	If the mouse is not moving toward the submenu, cancel any 
				//	submenus that might be in the process of being displayed 
				//	(via a timer) and hide this submenu immediately.

				_yuitest_coverline("build/node-menunav/node-menunav.js", 1452);
menuNav._cancelShowSubmenuTimer();

				_yuitest_coverline("build/node-menunav/node-menunav.js", 1454);
menuNav._hideMenu(oSubmenu);

			}}

		}

	},
	

	/**
	* @method _onMenuItemMouseOver
	* @description "mouseover" event handler for a menuitem.
	* @protected
	* @param {Node} menuItem Node instance representing a menuitem.
	* @param {Object} event Object representing the DOM event.
	*/
	_onMenuItemMouseOver: function (menuItem, event) {

		_yuitest_coverfunc("build/node-menunav/node-menunav.js", "_onMenuItemMouseOver", 1470);
_yuitest_coverline("build/node-menunav/node-menunav.js", 1472);
var menuNav = this,
			oActiveMenu = menuNav._activeMenu,
			bIsRoot = menuNav._isRoot(oActiveMenu),
			bUseAutoSubmenuDisplay = 
				(menuNav.get(AUTO_SUBMENU_DISPLAY) && bIsRoot || !bIsRoot);


		_yuitest_coverline("build/node-menunav/node-menunav.js", 1479);
menuNav._focusItem(menuItem);
		_yuitest_coverline("build/node-menunav/node-menunav.js", 1480);
menuNav._setActiveItem(menuItem);


		_yuitest_coverline("build/node-menunav/node-menunav.js", 1483);
if (bUseAutoSubmenuDisplay && !menuNav._movingToSubmenu) {

			_yuitest_coverline("build/node-menunav/node-menunav.js", 1485);
menuNav._hideAllSubmenus(oActiveMenu);

		}

	},
	

	/**
	* @method _onMenuItemMouseOut
	* @description "mouseout" event handler for a menuitem.
	* @protected
	* @param {Node} menuItem Node instance representing a menuitem.
	* @param {Object} event Object representing the DOM event.
	*/
	_onMenuItemMouseOut: function (menuItem, event) {

		_yuitest_coverfunc("build/node-menunav/node-menunav.js", "_onMenuItemMouseOut", 1499);
_yuitest_coverline("build/node-menunav/node-menunav.js", 1501);
this._clearActiveItem();

	},


	/**
	* @method _onVerticalMenuKeyDown
	* @description "keydown" event handler for vertical menus.
	* @protected
	* @param {Object} event Object representing the DOM event.
	*/
	_onVerticalMenuKeyDown: function (event) {

		_yuitest_coverfunc("build/node-menunav/node-menunav.js", "_onVerticalMenuKeyDown", 1512);
_yuitest_coverline("build/node-menunav/node-menunav.js", 1514);
var menuNav = this,
			oActiveMenu = menuNav._activeMenu,
			oRootMenu = menuNav._rootMenu,
			oTarget = event.target,
			bPreventDefault = false,
			nKeyCode = event.keyCode,
			oSubmenu,
			oParentMenu,
			oLI,
			oItem;


		_yuitest_coverline("build/node-menunav/node-menunav.js", 1526);
switch (nKeyCode) {

			case 37:	//	left arrow

				_yuitest_coverline("build/node-menunav/node-menunav.js", 1530);
oParentMenu = getParentMenu(oActiveMenu);

				_yuitest_coverline("build/node-menunav/node-menunav.js", 1532);
if (oParentMenu && isHorizontalMenu(oParentMenu)) {
				
					_yuitest_coverline("build/node-menunav/node-menunav.js", 1534);
menuNav._hideMenu(oActiveMenu);
					_yuitest_coverline("build/node-menunav/node-menunav.js", 1535);
oLI = getPreviousSibling(oActiveMenu.get(PARENT_NODE));
					_yuitest_coverline("build/node-menunav/node-menunav.js", 1536);
oItem = getItem(oLI);
					
					_yuitest_coverline("build/node-menunav/node-menunav.js", 1538);
if (oItem) {

						_yuitest_coverline("build/node-menunav/node-menunav.js", 1540);
if (isMenuLabel(oItem)) {	//	Menu label
						
							_yuitest_coverline("build/node-menunav/node-menunav.js", 1542);
oSubmenu = oItem.next();
						

							_yuitest_coverline("build/node-menunav/node-menunav.js", 1545);
if (oSubmenu) {

								_yuitest_coverline("build/node-menunav/node-menunav.js", 1547);
menuNav._showMenu(oSubmenu);
								_yuitest_coverline("build/node-menunav/node-menunav.js", 1548);
menuNav._focusItem(getFirstItem(oSubmenu));
								_yuitest_coverline("build/node-menunav/node-menunav.js", 1549);
menuNav._setActiveItem(getFirstItem(oSubmenu));

							}
							else {
	
								_yuitest_coverline("build/node-menunav/node-menunav.js", 1554);
menuNav._focusItem(oItem);
								_yuitest_coverline("build/node-menunav/node-menunav.js", 1555);
menuNav._setActiveItem(oItem);
	
							}
						
						}
						else {	//	MenuItem

							_yuitest_coverline("build/node-menunav/node-menunav.js", 1562);
menuNav._focusItem(oItem);
							_yuitest_coverline("build/node-menunav/node-menunav.js", 1563);
menuNav._setActiveItem(oItem);

						}
					
					}

				}
				else {_yuitest_coverline("build/node-menunav/node-menunav.js", 1570);
if (!menuNav._isRoot(oActiveMenu)) {
					_yuitest_coverline("build/node-menunav/node-menunav.js", 1571);
menuNav._hideMenu(oActiveMenu, true);
				}}


				_yuitest_coverline("build/node-menunav/node-menunav.js", 1575);
bPreventDefault = true;

			_yuitest_coverline("build/node-menunav/node-menunav.js", 1577);
break;

			case 39:	//	right arrow

				_yuitest_coverline("build/node-menunav/node-menunav.js", 1581);
if (isMenuLabel(oTarget)) {
					
					_yuitest_coverline("build/node-menunav/node-menunav.js", 1583);
oSubmenu = oTarget.next();

					_yuitest_coverline("build/node-menunav/node-menunav.js", 1585);
if (oSubmenu) {

						_yuitest_coverline("build/node-menunav/node-menunav.js", 1587);
menuNav._showMenu(oSubmenu);
						_yuitest_coverline("build/node-menunav/node-menunav.js", 1588);
menuNav._focusItem(getFirstItem(oSubmenu));
						_yuitest_coverline("build/node-menunav/node-menunav.js", 1589);
menuNav._setActiveItem(getFirstItem(oSubmenu));

					}
				
				}
				else {_yuitest_coverline("build/node-menunav/node-menunav.js", 1594);
if (isHorizontalMenu(oRootMenu)) {

					_yuitest_coverline("build/node-menunav/node-menunav.js", 1596);
oSubmenu = menuNav._getTopmostSubmenu(oActiveMenu);
					_yuitest_coverline("build/node-menunav/node-menunav.js", 1597);
oLI = getNextSibling(oSubmenu.get(PARENT_NODE));
					_yuitest_coverline("build/node-menunav/node-menunav.js", 1598);
oItem = getItem(oLI);

					_yuitest_coverline("build/node-menunav/node-menunav.js", 1600);
menuNav._hideAllSubmenus(oRootMenu);

					_yuitest_coverline("build/node-menunav/node-menunav.js", 1602);
if (oItem) {

						_yuitest_coverline("build/node-menunav/node-menunav.js", 1604);
if (isMenuLabel(oItem)) {	//	Menu label

							_yuitest_coverline("build/node-menunav/node-menunav.js", 1606);
oSubmenu = oItem.next();

							_yuitest_coverline("build/node-menunav/node-menunav.js", 1608);
if (oSubmenu) {

								_yuitest_coverline("build/node-menunav/node-menunav.js", 1610);
menuNav._showMenu(oSubmenu);
								_yuitest_coverline("build/node-menunav/node-menunav.js", 1611);
menuNav._focusItem(getFirstItem(oSubmenu));
								_yuitest_coverline("build/node-menunav/node-menunav.js", 1612);
menuNav._setActiveItem(getFirstItem(oSubmenu));

							}
							else {

								_yuitest_coverline("build/node-menunav/node-menunav.js", 1617);
menuNav._focusItem(oItem);
								_yuitest_coverline("build/node-menunav/node-menunav.js", 1618);
menuNav._setActiveItem(oItem);	

							}
						
						}
						else {	//	MenuItem

							_yuitest_coverline("build/node-menunav/node-menunav.js", 1625);
menuNav._focusItem(oItem);
							_yuitest_coverline("build/node-menunav/node-menunav.js", 1626);
menuNav._setActiveItem(oItem);

						}							

					}
				
				}}

				_yuitest_coverline("build/node-menunav/node-menunav.js", 1634);
bPreventDefault = true;

			_yuitest_coverline("build/node-menunav/node-menunav.js", 1636);
break;

		}	


		_yuitest_coverline("build/node-menunav/node-menunav.js", 1641);
if (bPreventDefault) {

			//	Prevent the browser from scrolling the window

			_yuitest_coverline("build/node-menunav/node-menunav.js", 1645);
event.preventDefault();			

		}
	
	},
	

	/**
	* @method _onHorizontalMenuKeyDown
	* @description "keydown" event handler for horizontal menus.
	* @protected
	* @param {Object} event Object representing the DOM event.
	*/
	_onHorizontalMenuKeyDown: function (event) {

		_yuitest_coverfunc("build/node-menunav/node-menunav.js", "_onHorizontalMenuKeyDown", 1658);
_yuitest_coverline("build/node-menunav/node-menunav.js", 1660);
var menuNav = this,
			oActiveMenu = menuNav._activeMenu,
			oTarget = event.target,
			oFocusedItem = getItem(oTarget, true),
			bPreventDefault = false,
			nKeyCode = event.keyCode,
			oSubmenu;


		_yuitest_coverline("build/node-menunav/node-menunav.js", 1669);
if (nKeyCode === 40) {

			_yuitest_coverline("build/node-menunav/node-menunav.js", 1671);
menuNav._hideAllSubmenus(oActiveMenu);

			_yuitest_coverline("build/node-menunav/node-menunav.js", 1673);
if (isMenuLabel(oFocusedItem)) {
			
				_yuitest_coverline("build/node-menunav/node-menunav.js", 1675);
oSubmenu = oFocusedItem.next();

				_yuitest_coverline("build/node-menunav/node-menunav.js", 1677);
if (oSubmenu) {

					_yuitest_coverline("build/node-menunav/node-menunav.js", 1679);
menuNav._showMenu(oSubmenu);
					_yuitest_coverline("build/node-menunav/node-menunav.js", 1680);
menuNav._focusItem(getFirstItem(oSubmenu));
					_yuitest_coverline("build/node-menunav/node-menunav.js", 1681);
menuNav._setActiveItem(getFirstItem(oSubmenu));

				}

				_yuitest_coverline("build/node-menunav/node-menunav.js", 1685);
bPreventDefault = true;
			
			}

		}		


		_yuitest_coverline("build/node-menunav/node-menunav.js", 1692);
if (bPreventDefault) {

			//	Prevent the browser from scrolling the window

			_yuitest_coverline("build/node-menunav/node-menunav.js", 1696);
event.preventDefault();			

		}
	
	},


	//	Generic DOM Event handlers


	/**
	* @method _onMouseMove
	* @description "mousemove" event handler for the menu.
	* @protected
	* @param {Object} event Object representing the DOM event.
	*/
	_onMouseMove: function (event) {

		_yuitest_coverfunc("build/node-menunav/node-menunav.js", "_onMouseMove", 1712);
_yuitest_coverline("build/node-menunav/node-menunav.js", 1714);
var menuNav = this;

		//	Using a timer to set the value of the "_currentMouseX" property 
		//	helps improve the reliability of the calculation used to set the 
		//	value of the "_movingToSubmenu" property - especially in Opera.

		_yuitest_coverline("build/node-menunav/node-menunav.js", 1720);
later(10, menuNav, function () {

			_yuitest_coverfunc("build/node-menunav/node-menunav.js", "(anonymous 6)", 1720);
_yuitest_coverline("build/node-menunav/node-menunav.js", 1722);
menuNav._currentMouseX = event.pageX;
		
		});
	
	},


	/**
	* @method _onMouseOver
	* @description "mouseover" event handler for the menu.
	* @protected
	* @param {Object} event Object representing the DOM event.
	*/
	_onMouseOver: function (event) {

		_yuitest_coverfunc("build/node-menunav/node-menunav.js", "_onMouseOver", 1735);
_yuitest_coverline("build/node-menunav/node-menunav.js", 1737);
var menuNav = this,
			oTarget,
			oMenu,
			oMenuLabel,
			oParentMenu,
			oMenuItem;


		_yuitest_coverline("build/node-menunav/node-menunav.js", 1745);
if (menuNav._blockMouseEvent) {
			_yuitest_coverline("build/node-menunav/node-menunav.js", 1746);
menuNav._blockMouseEvent = false;
		}
		else {

			_yuitest_coverline("build/node-menunav/node-menunav.js", 1750);
oTarget = event.target;
			_yuitest_coverline("build/node-menunav/node-menunav.js", 1751);
oMenu = getMenu(oTarget, true);
			_yuitest_coverline("build/node-menunav/node-menunav.js", 1752);
oMenuLabel = getMenuLabel(oTarget, true);
			_yuitest_coverline("build/node-menunav/node-menunav.js", 1753);
oMenuItem = getMenuItem(oTarget, true);


			_yuitest_coverline("build/node-menunav/node-menunav.js", 1756);
if (handleMouseOverForNode(oMenu, oTarget)) {

				_yuitest_coverline("build/node-menunav/node-menunav.js", 1758);
menuNav._onMenuMouseOver(oMenu, event);

				_yuitest_coverline("build/node-menunav/node-menunav.js", 1760);
oMenu[HANDLED_MOUSEOVER] = true;
				_yuitest_coverline("build/node-menunav/node-menunav.js", 1761);
oMenu[HANDLED_MOUSEOUT] = false;

				_yuitest_coverline("build/node-menunav/node-menunav.js", 1763);
oParentMenu = getParentMenu(oMenu);

				_yuitest_coverline("build/node-menunav/node-menunav.js", 1765);
if (oParentMenu) {

					_yuitest_coverline("build/node-menunav/node-menunav.js", 1767);
oParentMenu[HANDLED_MOUSEOUT] = true;
					_yuitest_coverline("build/node-menunav/node-menunav.js", 1768);
oParentMenu[HANDLED_MOUSEOVER] = false;
		
				}
			
			}

			_yuitest_coverline("build/node-menunav/node-menunav.js", 1774);
if (handleMouseOverForNode(oMenuLabel, oTarget)) {

				_yuitest_coverline("build/node-menunav/node-menunav.js", 1776);
menuNav._onMenuLabelMouseOver(oMenuLabel, event);

				_yuitest_coverline("build/node-menunav/node-menunav.js", 1778);
oMenuLabel[HANDLED_MOUSEOVER] = true;
				_yuitest_coverline("build/node-menunav/node-menunav.js", 1779);
oMenuLabel[HANDLED_MOUSEOUT] = false;
	
			}

			_yuitest_coverline("build/node-menunav/node-menunav.js", 1783);
if (handleMouseOverForNode(oMenuItem, oTarget)) {
	
				_yuitest_coverline("build/node-menunav/node-menunav.js", 1785);
menuNav._onMenuItemMouseOver(oMenuItem, event);

				_yuitest_coverline("build/node-menunav/node-menunav.js", 1787);
oMenuItem[HANDLED_MOUSEOVER] = true;
				_yuitest_coverline("build/node-menunav/node-menunav.js", 1788);
oMenuItem[HANDLED_MOUSEOUT] = false;
				
			}

		}

	},


	/**
	* @method _onMouseOut
	* @description "mouseout" event handler for the menu.
	* @protected
	* @param {Object} event Object representing the DOM event.
	*/
	_onMouseOut: function (event) {
			
		_yuitest_coverfunc("build/node-menunav/node-menunav.js", "_onMouseOut", 1803);
_yuitest_coverline("build/node-menunav/node-menunav.js", 1805);
var menuNav = this,
			oActiveMenu = menuNav._activeMenu,
			bMovingToSubmenu = false,
			oTarget,
			oRelatedTarget,
			oMenu,
			oMenuLabel,
			oSubmenu,
			oMenuItem;


		_yuitest_coverline("build/node-menunav/node-menunav.js", 1816);
menuNav._movingToSubmenu = 
					(oActiveMenu && !isHorizontalMenu(oActiveMenu) && 
						((event.pageX - 5) > menuNav._currentMouseX));
		
		_yuitest_coverline("build/node-menunav/node-menunav.js", 1820);
oTarget = event.target;
		_yuitest_coverline("build/node-menunav/node-menunav.js", 1821);
oRelatedTarget = event.relatedTarget;
		_yuitest_coverline("build/node-menunav/node-menunav.js", 1822);
oMenu = getMenu(oTarget, true);
		_yuitest_coverline("build/node-menunav/node-menunav.js", 1823);
oMenuLabel = getMenuLabel(oTarget, true);
		_yuitest_coverline("build/node-menunav/node-menunav.js", 1824);
oMenuItem = getMenuItem(oTarget, true);


		_yuitest_coverline("build/node-menunav/node-menunav.js", 1827);
if (handleMouseOutForNode(oMenuLabel, oRelatedTarget)) {

			_yuitest_coverline("build/node-menunav/node-menunav.js", 1829);
menuNav._onMenuLabelMouseOut(oMenuLabel, event);

			_yuitest_coverline("build/node-menunav/node-menunav.js", 1831);
oMenuLabel[HANDLED_MOUSEOUT] = true;
			_yuitest_coverline("build/node-menunav/node-menunav.js", 1832);
oMenuLabel[HANDLED_MOUSEOVER] = false;

		}

		_yuitest_coverline("build/node-menunav/node-menunav.js", 1836);
if (handleMouseOutForNode(oMenuItem, oRelatedTarget)) {

			_yuitest_coverline("build/node-menunav/node-menunav.js", 1838);
menuNav._onMenuItemMouseOut(oMenuItem, event);

			_yuitest_coverline("build/node-menunav/node-menunav.js", 1840);
oMenuItem[HANDLED_MOUSEOUT] = true;
			_yuitest_coverline("build/node-menunav/node-menunav.js", 1841);
oMenuItem[HANDLED_MOUSEOVER] = false;
			
		}


		_yuitest_coverline("build/node-menunav/node-menunav.js", 1846);
if (oMenuLabel) {

			_yuitest_coverline("build/node-menunav/node-menunav.js", 1848);
oSubmenu = oMenuLabel.next();

			_yuitest_coverline("build/node-menunav/node-menunav.js", 1850);
if (oSubmenu && oRelatedTarget && 
				(oRelatedTarget.compareTo(oSubmenu) || 
					oSubmenu.contains(oRelatedTarget))) {

				_yuitest_coverline("build/node-menunav/node-menunav.js", 1854);
bMovingToSubmenu = true;

			}
		
		}
		

		_yuitest_coverline("build/node-menunav/node-menunav.js", 1861);
if (handleMouseOutForNode(oMenu, oRelatedTarget) || bMovingToSubmenu) {

			_yuitest_coverline("build/node-menunav/node-menunav.js", 1863);
menuNav._onMenuMouseOut(oMenu, event);				

			_yuitest_coverline("build/node-menunav/node-menunav.js", 1865);
oMenu[HANDLED_MOUSEOUT] = true;
			_yuitest_coverline("build/node-menunav/node-menunav.js", 1866);
oMenu[HANDLED_MOUSEOVER] = false;
		
		}
	
	},


	/**
	* @method _toggleSubmenuDisplay
	* @description "mousedown," "keydown," and "click" event handler for the 
	* menu used to toggle the display of a submenu.
	* @protected
	* @param {Object} event Object representing the DOM event.
	*/
	_toggleSubmenuDisplay: function (event) {

		_yuitest_coverfunc("build/node-menunav/node-menunav.js", "_toggleSubmenuDisplay", 1880);
_yuitest_coverline("build/node-menunav/node-menunav.js", 1882);
var menuNav = this,
			oTarget = event.target,
			oMenuLabel = getMenuLabel(oTarget, true),
			sType = event.type,
			oAnchor,
			oSubmenu,
			sHref,
			nHashPos,
			nLen,
			sId;


		_yuitest_coverline("build/node-menunav/node-menunav.js", 1894);
if (oMenuLabel) {

			_yuitest_coverline("build/node-menunav/node-menunav.js", 1896);
oAnchor = isAnchor(oTarget) ? oTarget : oTarget.ancestor(isAnchor);
			

			_yuitest_coverline("build/node-menunav/node-menunav.js", 1899);
if (oAnchor) {

				//	Need to pass "2" as a second argument to "getAttribute" for 
				//	IE otherwise IE will return a fully qualified URL for the 
				//	value of the "href" attribute.
				//	http://msdn.microsoft.com/en-us/library/ms536429(VS.85).aspx

				_yuitest_coverline("build/node-menunav/node-menunav.js", 1906);
sHref = oAnchor.getAttribute("href", 2);
				_yuitest_coverline("build/node-menunav/node-menunav.js", 1907);
nHashPos = sHref.indexOf("#");
				_yuitest_coverline("build/node-menunav/node-menunav.js", 1908);
nLen = sHref.length;

				_yuitest_coverline("build/node-menunav/node-menunav.js", 1910);
if (nHashPos === 0 && nLen > 1) {

					_yuitest_coverline("build/node-menunav/node-menunav.js", 1912);
sId = sHref.substr(1, nLen);
					_yuitest_coverline("build/node-menunav/node-menunav.js", 1913);
oSubmenu = oMenuLabel.next();

					_yuitest_coverline("build/node-menunav/node-menunav.js", 1915);
if (oSubmenu && (oSubmenu.get(ID) === sId)) {

						_yuitest_coverline("build/node-menunav/node-menunav.js", 1917);
if (sType === MOUSEDOWN || sType === KEYDOWN) {
							
							_yuitest_coverline("build/node-menunav/node-menunav.js", 1919);
if ((UA.opera || UA.gecko || UA.ie) && sType === KEYDOWN && !menuNav._preventClickHandle) {

								//	Prevent the browser from following the URL of 
								//	the anchor element

								_yuitest_coverline("build/node-menunav/node-menunav.js", 1924);
menuNav._preventClickHandle = menuNav._rootMenu.on("click", function (event) {

									_yuitest_coverfunc("build/node-menunav/node-menunav.js", "(anonymous 7)", 1924);
_yuitest_coverline("build/node-menunav/node-menunav.js", 1926);
event.preventDefault();

									_yuitest_coverline("build/node-menunav/node-menunav.js", 1928);
menuNav._preventClickHandle.detach();
									_yuitest_coverline("build/node-menunav/node-menunav.js", 1929);
menuNav._preventClickHandle = null;

								});

							}
							
							_yuitest_coverline("build/node-menunav/node-menunav.js", 1935);
if (sType == MOUSEDOWN) {

								//	Prevent the target from getting focused by 
								//	default, since the element to be focused will
								//	be determined by weather or not the submenu
								//	is visible.
								_yuitest_coverline("build/node-menunav/node-menunav.js", 1941);
event.preventDefault();

								//	FocusManager will attempt to focus any 
								//	descendant that is the target of the mousedown
								//	event.  Since we want to explicitly control 
	 							//	where focus is going, we need to call 
								//	"stopImmediatePropagation" to stop the 
								//	FocusManager from doing its thing.
								_yuitest_coverline("build/node-menunav/node-menunav.js", 1949);
event.stopImmediatePropagation();	

								//	The "_focusItem" method relies on the 
								//	"_hasFocus" property being set to true.  The
								//	"_hasFocus" property is normally set via a 
								//	"focus" event listener, but since we've 
								//	blocked focus from happening, we need to set 
								//	this property manually.
								_yuitest_coverline("build/node-menunav/node-menunav.js", 1957);
menuNav._hasFocus = true;

							}

								
							_yuitest_coverline("build/node-menunav/node-menunav.js", 1962);
if (menuNav._isRoot(getParentMenu(oTarget))) {	//	Event target is a submenu label in the root menu
							
								//	Menu label toggle functionality
							
								_yuitest_coverline("build/node-menunav/node-menunav.js", 1966);
if (hasVisibleSubmenu(oMenuLabel)) {
							
									_yuitest_coverline("build/node-menunav/node-menunav.js", 1968);
menuNav._hideMenu(oSubmenu);
									_yuitest_coverline("build/node-menunav/node-menunav.js", 1969);
menuNav._focusItem(oMenuLabel);	
									_yuitest_coverline("build/node-menunav/node-menunav.js", 1970);
menuNav._setActiveItem(oMenuLabel);
									
								}
								else {
							
									_yuitest_coverline("build/node-menunav/node-menunav.js", 1975);
menuNav._hideAllSubmenus(menuNav._rootMenu);
									_yuitest_coverline("build/node-menunav/node-menunav.js", 1976);
menuNav._showMenu(oSubmenu);

									_yuitest_coverline("build/node-menunav/node-menunav.js", 1978);
menuNav._focusItem(getFirstItem(oSubmenu));
									_yuitest_coverline("build/node-menunav/node-menunav.js", 1979);
menuNav._setActiveItem(getFirstItem(oSubmenu));
									
								}
							
							}
							else {	//	Event target is a submenu label within a submenu
							
								_yuitest_coverline("build/node-menunav/node-menunav.js", 1986);
if (menuNav._activeItem == oMenuLabel) {
							
									_yuitest_coverline("build/node-menunav/node-menunav.js", 1988);
menuNav._showMenu(oSubmenu);
									_yuitest_coverline("build/node-menunav/node-menunav.js", 1989);
menuNav._focusItem(getFirstItem(oSubmenu));
									_yuitest_coverline("build/node-menunav/node-menunav.js", 1990);
menuNav._setActiveItem(getFirstItem(oSubmenu));										
							
								}
								else {
							
									_yuitest_coverline("build/node-menunav/node-menunav.js", 1995);
if (!oMenuLabel._clickHandle) {

										_yuitest_coverline("build/node-menunav/node-menunav.js", 1997);
oMenuLabel._clickHandle = oMenuLabel.on("click", function () {

											_yuitest_coverfunc("build/node-menunav/node-menunav.js", "(anonymous 8)", 1997);
_yuitest_coverline("build/node-menunav/node-menunav.js", 1999);
menuNav._hideAllSubmenus(menuNav._rootMenu);

											_yuitest_coverline("build/node-menunav/node-menunav.js", 2001);
menuNav._hasFocus = false;
											_yuitest_coverline("build/node-menunav/node-menunav.js", 2002);
menuNav._clearActiveItem();


											_yuitest_coverline("build/node-menunav/node-menunav.js", 2005);
oMenuLabel._clickHandle.detach();
											
											_yuitest_coverline("build/node-menunav/node-menunav.js", 2007);
oMenuLabel._clickHandle = null;

										});
										
									}
									
								}
								
							}

						}


						_yuitest_coverline("build/node-menunav/node-menunav.js", 2020);
if (sType === CLICK) {
						
							//	Prevent the browser from following the URL of 
							//	the anchor element
							
							_yuitest_coverline("build/node-menunav/node-menunav.js", 2025);
event.preventDefault();
						
						}
					
					}
				
				}				


			}
		
		}
	
	},
	

	/**
	* @method _onKeyPress
	* @description "keypress" event handler for the menu.
	* @protected
	* @param {Object} event Object representing the DOM event.
	*/
	_onKeyPress: function (event) {
	
		_yuitest_coverfunc("build/node-menunav/node-menunav.js", "_onKeyPress", 2047);
_yuitest_coverline("build/node-menunav/node-menunav.js", 2049);
switch (event.keyCode) {

			case 37:	//	left arrow
			case 38:	//	up arrow
			case 39:	//	right arrow
			case 40:	//	down arrow

				//	Prevent the browser from scrolling the window

				_yuitest_coverline("build/node-menunav/node-menunav.js", 2058);
event.preventDefault();

			_yuitest_coverline("build/node-menunav/node-menunav.js", 2060);
break;

		}						

	},	


	/**
	* @method _onKeyDown
	* @description "keydown" event handler for the menu.
	* @protected
	* @param {Object} event Object representing the DOM event.
	*/
	_onKeyDown: function (event) {

		_yuitest_coverfunc("build/node-menunav/node-menunav.js", "_onKeyDown", 2073);
_yuitest_coverline("build/node-menunav/node-menunav.js", 2075);
var menuNav = this,
			oActiveItem = menuNav._activeItem,
			oTarget = event.target,
			oActiveMenu = getParentMenu(oTarget),
			oSubmenu;

		_yuitest_coverline("build/node-menunav/node-menunav.js", 2081);
if (oActiveMenu) {

			_yuitest_coverline("build/node-menunav/node-menunav.js", 2083);
menuNav._activeMenu = oActiveMenu;

			_yuitest_coverline("build/node-menunav/node-menunav.js", 2085);
if (isHorizontalMenu(oActiveMenu)) {
				_yuitest_coverline("build/node-menunav/node-menunav.js", 2086);
menuNav._onHorizontalMenuKeyDown(event);
			}
			else {
				_yuitest_coverline("build/node-menunav/node-menunav.js", 2089);
menuNav._onVerticalMenuKeyDown(event);
			}


			_yuitest_coverline("build/node-menunav/node-menunav.js", 2093);
if (event.keyCode === 27) {

				_yuitest_coverline("build/node-menunav/node-menunav.js", 2095);
if (!menuNav._isRoot(oActiveMenu)) {

					_yuitest_coverline("build/node-menunav/node-menunav.js", 2097);
if (UA.opera) {
						_yuitest_coverline("build/node-menunav/node-menunav.js", 2098);
later(0, menuNav, function () {
							_yuitest_coverfunc("build/node-menunav/node-menunav.js", "(anonymous 9)", 2098);
_yuitest_coverline("build/node-menunav/node-menunav.js", 2099);
menuNav._hideMenu(oActiveMenu, true);
						});						
					}
					else {
						_yuitest_coverline("build/node-menunav/node-menunav.js", 2103);
menuNav._hideMenu(oActiveMenu, true);						
					}

					_yuitest_coverline("build/node-menunav/node-menunav.js", 2106);
event.stopPropagation();
					_yuitest_coverline("build/node-menunav/node-menunav.js", 2107);
menuNav._blockMouseEvent = UA.gecko ? true : false;

				}
				else {_yuitest_coverline("build/node-menunav/node-menunav.js", 2110);
if (oActiveItem) {

					_yuitest_coverline("build/node-menunav/node-menunav.js", 2112);
if (isMenuLabel(oActiveItem) && 
							hasVisibleSubmenu(oActiveItem)) {
					
						_yuitest_coverline("build/node-menunav/node-menunav.js", 2115);
oSubmenu = oActiveItem.next();

						_yuitest_coverline("build/node-menunav/node-menunav.js", 2117);
if (oSubmenu) {
							_yuitest_coverline("build/node-menunav/node-menunav.js", 2118);
menuNav._hideMenu(oSubmenu);
						}

					}
					else {

						_yuitest_coverline("build/node-menunav/node-menunav.js", 2124);
menuNav._focusManager.blur();

						//	This is necessary for Webkit since blurring the 
						//	active menuitem won't result in the document 
						//	gaining focus, meaning the that _onDocFocus 
						//	listener won't clear the active menuitem.

						_yuitest_coverline("build/node-menunav/node-menunav.js", 2131);
menuNav._clearActiveItem();	
						
						_yuitest_coverline("build/node-menunav/node-menunav.js", 2133);
menuNav._hasFocus = false;

					}

				}}
			
			}
		
		}
	
	},
	
	/**
	* @method _onDocMouseDown
	* @description "mousedown" event handler for the owner document of 
	* the menu.
	* @protected
	* @param {Object} event Object representing the DOM event.
	*/
	_onDocMouseDown: function (event) {

		_yuitest_coverfunc("build/node-menunav/node-menunav.js", "_onDocMouseDown", 2152);
_yuitest_coverline("build/node-menunav/node-menunav.js", 2154);
var menuNav = this,
			oRoot = menuNav._rootMenu,
			oTarget = event.target;


		_yuitest_coverline("build/node-menunav/node-menunav.js", 2159);
if (!(oRoot.compareTo(oTarget) || oRoot.contains(oTarget))) {

			_yuitest_coverline("build/node-menunav/node-menunav.js", 2161);
menuNav._hideAllSubmenus(oRoot);

			//	Document doesn't receive focus in Webkit when the user mouses 
			//	down on it, so the "_hasFocus" property won't get set to the 
			//	correct value.  The following line corrects the problem.

			_yuitest_coverline("build/node-menunav/node-menunav.js", 2167);
if (UA.webkit) {
				_yuitest_coverline("build/node-menunav/node-menunav.js", 2168);
menuNav._hasFocus = false;
				_yuitest_coverline("build/node-menunav/node-menunav.js", 2169);
menuNav._clearActiveItem();
			}

		}

	}
	
});


_yuitest_coverline("build/node-menunav/node-menunav.js", 2179);
Y.namespace('Plugin');

_yuitest_coverline("build/node-menunav/node-menunav.js", 2181);
Y.Plugin.NodeMenuNav = NodeMenuNav;


}, '3.7.3', {"requires": ["node", "classnamemanager", "plugin", "node-focusmanager"], "skinnable": true});
