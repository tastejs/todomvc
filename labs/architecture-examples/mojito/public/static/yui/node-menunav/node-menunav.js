/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
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


var getPreviousSibling = function (node) {

	var oPrevious = node.previous(),
		oChildren;

	if (!oPrevious) {
		oChildren = node.get(PARENT_NODE).get(CHILDREN);
		oPrevious = oChildren.item(oChildren.size() - 1);
	}
	
	return oPrevious;

};


var getNextSibling = function (node) {

	var oNext = node.next();

	if (!oNext) {
		oNext = node.get(PARENT_NODE).get(CHILDREN).item(0);		
	}
	
	return oNext;

};


var isAnchor = function (node) {
	
	var bReturnVal = false;
	
	if (node) {
		bReturnVal = node.get("nodeName").toLowerCase() === LOWERCASE_A;
	}
	
	return bReturnVal;
	
};


var isMenuItem = function (node) {

	return node.hasClass(CSS_MENUITEM);

};


var isMenuLabel = function (node) {

	return node.hasClass(CSS_MENU_LABEL);

};


var isHorizontalMenu = function (menu) {

	return menu.hasClass(CSS_MENU_HORIZONTAL);

};


var hasVisibleSubmenu = function (menuLabel) {

	return menuLabel.hasClass(CSS_MENU_LABEL_MENUVISIBLE);

};


var getItemAnchor = function (node) {

	return isAnchor(node) ? node : node.one(LOWERCASE_A);

};


var getNodeWithClass = function (node, className, searchAncestors) {

	var oItem;
	
	if (node) {
		
		if (node.hasClass(className)) {
			oItem = node;
		}
		
		if (!oItem && searchAncestors) {
			oItem = node.ancestor((PERIOD + className));
		}
	
	}
	
	return oItem;

};


var getParentMenu = function (node) {

	return node.ancestor(MENU_SELECTOR);
	
};


var getMenu = function (node, searchAncestors) {

	return getNodeWithClass(node, CSS_MENU, searchAncestors);

};


var getMenuItem = function (node, searchAncestors) {

	var oItem;
	
	if (node) {
		oItem = getNodeWithClass(node, CSS_MENUITEM, searchAncestors);
	}
	
	return oItem;

};


var getMenuLabel = function (node, searchAncestors) {

	var oItem;
	
	if (node) {
	
		if (searchAncestors) {
			oItem = getNodeWithClass(node, CSS_MENU_LABEL, searchAncestors);
		}
		else {
			oItem = getNodeWithClass(node, CSS_MENU_LABEL) || 
				node.one((PERIOD + CSS_MENU_LABEL));
		}
		
	}
	
	return oItem;

};


var getItem = function (node, searchAncestors) {

	var oItem;
	
	if (node) {
		oItem = getMenuItem(node, searchAncestors) || 
			getMenuLabel(node, searchAncestors);
	}
	
	return oItem;	

};


var getFirstItem = function (menu) {
	
	return getItem(menu.one("li"));

};


var getActiveClass = function (node) {

	return isMenuItem(node) ? CSS_MENUITEM_ACTIVE : CSS_MENU_LABEL_ACTIVE;

};


var handleMouseOverForNode = function (node, target) {

	return node && !node[HANDLED_MOUSEOVER] && 
		(node.compareTo(target) || node.contains(target));

};


var handleMouseOutForNode = function (node, relatedTarget) {

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
var NodeMenuNav = function () {

	NodeMenuNav.superclass.constructor.apply(this, arguments);

};

NodeMenuNav.NAME = "nodeMenuNav";
NodeMenuNav.NS = "menuNav";


/** 
* @property SHIM_TEMPLATE_TITLE
* @description String representing the value for the <code>title</code> 
* attribute for the shim used to prevent <code>&#60;select&#62;</code> elements 
* from poking through menus in IE 6.
* @default "Menu Stacking Shim"
* @type String
*/
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

NodeMenuNav.SHIM_TEMPLATE = '<iframe frameborder="0" tabindex="-1" class="' + 
							getClassName("shim") + 
							'" title="' + NodeMenuNav.SHIM_TEMPLATE_TITLE + 
							'" src="javascript:false;"></iframe>';


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

			var oMenu = this.get(HOST),
				oMenuLabel,
				oMenuToggle,
				oSubmenu,
				sID;

			if (value) {

				oMenu.set(ROLE, MENU);

				oMenu.all("ul,li," + MENU_CONTENT_SELECTOR).set(ROLE, PRESENTATION);

				oMenu.all((PERIOD + getClassName(MENUITEM, CONTENT))).set(ROLE, MENUITEM);

				oMenu.all((PERIOD + CSS_MENU_LABEL)).each(function (node) {

					oMenuLabel = node;
					oMenuToggle = node.one(MENU_TOGGLE_SELECTOR);

					if (oMenuToggle) {
						oMenuToggle.set(ROLE, PRESENTATION);
						oMenuLabel = oMenuToggle.previous();
					}

					oMenuLabel.set(ROLE, MENUITEM);
					oMenuLabel.set("aria-haspopup", true);

					oSubmenu = node.next();

					if (oSubmenu) {

						oSubmenu.set(ROLE, MENU);

						oMenuLabel = oSubmenu.previous();
						oMenuToggle = oMenuLabel.one(MENU_TOGGLE_SELECTOR);

						if (oMenuToggle) {
							oMenuLabel = oMenuToggle;
						}

						sID = Y.stamp(oMenuLabel);

						if (!oMenuLabel.get(ID)) {
							oMenuLabel.set(ID, sID);
						}

						oSubmenu.set("aria-labelledby", sID);
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

		var menuNav = this,
			oRootMenu = this.get(HOST),
			aHandlers = [],
			oDoc;


		if (oRootMenu) {

			menuNav._rootMenu = oRootMenu;

			oRootMenu.all("ul:first-child").addClass(FIRST_OF_TYPE);

			//	Hide all visible submenus

			oRootMenu.all(MENU_SELECTOR).addClass(CSS_MENU_HIDDEN);


			//	Wire up all event handlers

			aHandlers.push(oRootMenu.on("mouseover", menuNav._onMouseOver, menuNav));
			aHandlers.push(oRootMenu.on("mouseout", menuNav._onMouseOut, menuNav));
			aHandlers.push(oRootMenu.on("mousemove", menuNav._onMouseMove, menuNav));
			aHandlers.push(oRootMenu.on(MOUSEDOWN, menuNav._toggleSubmenuDisplay, menuNav));
			aHandlers.push(Y.on("key", menuNav._toggleSubmenuDisplay, oRootMenu, "down:13", menuNav));
			aHandlers.push(oRootMenu.on(CLICK, menuNav._toggleSubmenuDisplay, menuNav));
			aHandlers.push(oRootMenu.on("keypress", menuNav._onKeyPress, menuNav));
			aHandlers.push(oRootMenu.on(KEYDOWN, menuNav._onKeyDown, menuNav));

			oDoc = oRootMenu.get("ownerDocument");

		    aHandlers.push(oDoc.on(MOUSEDOWN, menuNav._onDocMouseDown, menuNav));
			aHandlers.push(oDoc.on("focus", menuNav._onDocFocus, menuNav));

			this._eventHandlers = aHandlers;

			menuNav._initFocusManager();

		}
		

    },

	destructor: function () {

		var aHandlers = this._eventHandlers;

		if (aHandlers) {

			Y.Array.each(aHandlers, function (handle) {
				handle.detach();
			});

			this._eventHandlers = null;

		}
		
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
	
		var menuNav = this,
			oMenu = getParentMenu(menu),
			returnVal;


		if (!oMenu) {
			returnVal = menu;
		}
		else if (menuNav._isRoot(oMenu)) {
			returnVal = menu;
		}
		else {
			returnVal = menuNav._getTopmostSubmenu(oMenu);
		}
	
		return returnVal;
	
	},


	/**
	* @method _clearActiveItem
	* @description Clears the menu's active descendent.
	* @protected
	*/
	_clearActiveItem: function () {

		var menuNav = this,
			oActiveItem = menuNav._activeItem;
		
		if (oActiveItem) {
			oActiveItem.removeClass(getActiveClass(oActiveItem));
		}

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

		var menuNav = this;
	
		if (item) {
			
			menuNav._clearActiveItem();
	
			item.addClass(getActiveClass(item));
			
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
	
		var menuNav = this,
			oMenu,
			oItem;
	
		if (item && menuNav._hasFocus) {

			oMenu = getParentMenu(item);
			oItem = getItemAnchor(item);

			if (oMenu && !oMenu.compareTo(menuNav._activeMenu)) {
				menuNav._activeMenu = oMenu;
				menuNav._initFocusManager();
			}
		
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

		var oParentMenu = getParentMenu(menu),
			oLI = menu.get(PARENT_NODE),
			aXY = oLI.getXY();


		if (this.get(USE_ARIA)) {
			menu.set(ARIA_HIDDEN, false);
		}


		if (isHorizontalMenu(oParentMenu)) {
			aXY[1] = aXY[1] + oLI.get(OFFSET_HEIGHT);
		}
		else {
			aXY[0] = aXY[0] + oLI.get(OFFSET_WIDTH);
		}
		
		menu.setXY(aXY);

		if (UA.ie < 8) {

			if (UA.ie === 6 && !menu.hasIFrameShim) {
	
				menu.appendChild(Y.Node.create(NodeMenuNav.SHIM_TEMPLATE));
				menu.hasIFrameShim = true;

			}

			//	Clear previous values for height and width

			menu.setStyles({ height: EMPTY_STRING, width: EMPTY_STRING });

			//	Set the width and height of the menu's bounding box - this is 
			//	necessary for IE 6 so that the CSS for the <iframe> shim can 
			//	simply set the <iframe>'s width and height to 100% to ensure 
			//	that dimensions of an <iframe> shim are always sync'd to the 
			//	that of its parent menu.  Specifying a width and height also 
			//	helps when positioning decorator elements (for creating effects 
			//	like rounded corners) inside a menu's bounding box in IE 7.
			
			menu.setStyles({ 
				height: (menu.get(OFFSET_HEIGHT) + PX), 
				width: (menu.get(OFFSET_WIDTH) + PX) });

		}

		menu.previous().addClass(CSS_MENU_LABEL_MENUVISIBLE);
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

		var menuNav = this,
			oLabel = menu.previous(),
			oActiveItem;

		oLabel.removeClass(CSS_MENU_LABEL_MENUVISIBLE);


		if (activateAndFocusLabel) {
			menuNav._focusItem(oLabel);
			menuNav._setActiveItem(oLabel);			
		}

		oActiveItem = menu.one((PERIOD + CSS_MENUITEM_ACTIVE));

		if (oActiveItem) {
			oActiveItem.removeClass(CSS_MENUITEM_ACTIVE);
		}

		//	Clear the values for top and left that were set by the call to 
		//	"setXY" when the menu was shown so that the hidden position 
		//	specified in the core CSS file will take affect.

		menu.setStyles({ left: EMPTY_STRING, top: EMPTY_STRING });
		
		menu.addClass(CSS_MENU_HIDDEN);

		if (menuNav.get(USE_ARIA)) {
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

		var menuNav = this;

		menu.all(MENU_SELECTOR).each(Y.bind(function (submenuNode) {
		
			menuNav._hideMenu(submenuNode);
		
		}, menuNav));
	
	},


	/**
	* @method _cancelShowSubmenuTimer
	* @description Cancels the timer used to show a submenu.
	* @protected
	*/
	_cancelShowSubmenuTimer: function () {

		var menuNav = this,
			oShowSubmenuTimer = menuNav._showSubmenuTimer;

		if (oShowSubmenuTimer) {
			oShowSubmenuTimer.cancel();
			menuNav._showSubmenuTimer = null;
		}
	
	},


	/**
	* @method _cancelHideSubmenuTimer
	* @description Cancels the timer used to hide a submenu.
	* @protected
	*/
	_cancelHideSubmenuTimer: function () {

		var menuNav = this,
			oHideSubmenuTimer = menuNav._hideSubmenuTimer;


		if (oHideSubmenuTimer) {
			oHideSubmenuTimer.cancel();
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

		var menuNav = this,
			oRootMenu = menuNav._rootMenu,
			oMenu = menuNav._activeMenu || oRootMenu,
			sSelectorBase = 
				menuNav._isRoot(oMenu) ? EMPTY_STRING : ("#" + oMenu.get("id")),
			oFocusManager = menuNav._focusManager,
			sKeysVal,
			sDescendantSelector,
			sQuery;

		if (isHorizontalMenu(oMenu)) {

			sDescendantSelector = sSelectorBase + STANDARD_QUERY + "," + 
				sSelectorBase + EXTENDED_QUERY;
			
			sKeysVal = { next: "down:39", previous: "down:37" };
			
		}
		else {

			sDescendantSelector = sSelectorBase + STANDARD_QUERY;
			sKeysVal = { next: "down:40", previous: "down:38" };

		}


		if (!oFocusManager) {

			oRootMenu.plug(Y.Plugin.NodeFocusManager, { 
				descendants: sDescendantSelector,
				keys: sKeysVal,
				circular: true
			});

			oFocusManager = oRootMenu.focusManager;

			sQuery = "#" + oRootMenu.get("id") + MENU_SELECTOR + " a," + 
							MENU_TOGGLE_SELECTOR;

			oRootMenu.all(sQuery).set("tabIndex", -1);

			oFocusManager.on(ACTIVE_DESCENDANT_CHANGE, 
				this._onActiveDescendantChange, oFocusManager, this);

			oFocusManager.after(ACTIVE_DESCENDANT_CHANGE, 
				this._afterActiveDescendantChange, oFocusManager, this);
			
			menuNav._focusManager = oFocusManager;
			
		}
		else {

			oFocusManager.set(ACTIVE_DESCENDANT, -1);
			oFocusManager.set(DESCENDANTS, sDescendantSelector);
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

		if (event.src === UI && menuNav._activeMenu && 
				!menuNav._movingToSubmenu) {

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

		var oItem;

		if (event.src === UI) {
			oItem = getItem(this.get(DESCENDANTS).item(event.newVal), true);
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
	
		var menuNav = this,
			oActiveItem = menuNav._activeItem,
			oTarget = event.target,
			oMenu;
	

		if (menuNav._rootMenu.contains(oTarget)) {	//	The menu has focus

			if (menuNav._hasFocus) {	

				oMenu = getParentMenu(oTarget);

				//	If the element that was focused is a descendant of the 
				//	root menu, but is in a submenu not currently being 
				//	managed by the Focus Manager, update the Focus Manager so 
				//	that it is now managing the submenu that is the parent of  
				//	the element that was focused.
				
				if (!menuNav._activeMenu.compareTo(oMenu)) {

					menuNav._activeMenu = oMenu;
					menuNav._initFocusManager();
					menuNav._focusManager.set(ACTIVE_DESCENDANT, oTarget);
					menuNav._setActiveItem(getItem(oTarget, true));
					
				}
			
			}
			else { //	Initial focus

				//	First time the menu has been focused, need to setup focused 
				//	state and established active active descendant
	
				menuNav._hasFocus = true;
	
				oActiveItem = getItem(oTarget, true);
	
				if (oActiveItem) {	
					menuNav._setActiveItem(oActiveItem);
				}
				
			}
		
		}
		else {	//	The menu has lost focus

			menuNav._clearActiveItem();

			menuNav._cancelShowSubmenuTimer();
			menuNav._hideAllSubmenus(menuNav._rootMenu);

			menuNav._activeMenu = menuNav._rootMenu;
			menuNav._initFocusManager();
			
			menuNav._focusManager.set(ACTIVE_DESCENDANT, 0);
			
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

		var menuNav = this,
			oHideAllSubmenusTimer = menuNav._hideAllSubmenusTimer;

		if (oHideAllSubmenusTimer) {
			oHideAllSubmenusTimer.cancel();
			menuNav._hideAllSubmenusTimer = null;
		}

		menuNav._cancelHideSubmenuTimer();

		//	Need to update the FocusManager in advance of focus a new 
		//	Menu in order to avoid the FocusManager thinking that 
		//	it has lost focus
		
		if (menu && !menu.compareTo(menuNav._activeMenu)) {
			menuNav._activeMenu = menu;

			if (menuNav._hasFocus) {
				menuNav._initFocusManager();
			}

		}

		if (menuNav._movingToSubmenu && isHorizontalMenu(menu)) {
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

		var	menuNav = this,
			oActiveMenu = menuNav._activeMenu,
			oSubmenu;
	
		menuNav._hideAllSubmenus(menuNav._rootMenu);

		if (oActiveMenu) {

			//	Focus the label element for the topmost submenu
			oSubmenu = menuNav._getTopmostSubmenu(oActiveMenu);
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

		var menuNav = this,
			oActiveMenu = menuNav._activeMenu,
			oRelatedTarget = event.relatedTarget,
			oActiveItem = menuNav._activeItem,
			oParentMenu,
			oMenu;


		if (oActiveMenu && !oActiveMenu.contains(oRelatedTarget)) {
		
			oParentMenu = getParentMenu(oActiveMenu);
			

			if (oParentMenu && !oParentMenu.contains(oRelatedTarget)) {

				if (menuNav.get(MOUSEOUT_HIDE_DELAY) > 0) {

					menuNav._cancelShowSubmenuTimer();

					menuNav._hideAllSubmenusTimer = 

						later(menuNav.get(MOUSEOUT_HIDE_DELAY), 
							menuNav, menuNav._hideAndFocusLabel);
						
				}
			
			}
			else {
			
				if (oActiveItem) {
				
					oMenu = getParentMenu(oActiveItem);

					if (!menuNav._isRoot(oMenu)) { 
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

		var menuNav = this,
			oActiveMenu = menuNav._activeMenu,
			bIsRoot = menuNav._isRoot(oActiveMenu),
			bUseAutoSubmenuDisplay = 
				(menuNav.get(AUTO_SUBMENU_DISPLAY) && bIsRoot || !bIsRoot),
            submenuShowDelay = menuNav.get("submenuShowDelay"),	
			oSubmenu;
				

        var showSubmenu = function (delay) {

			menuNav._cancelHideSubmenuTimer();
			menuNav._cancelShowSubmenuTimer();

			if (!hasVisibleSubmenu(menuLabel)) {

				oSubmenu = menuLabel.next();

				if (oSubmenu) {
					menuNav._hideAllSubmenus(oActiveMenu);
					menuNav._showSubmenuTimer = later(delay, menuNav, menuNav._showMenu, oSubmenu);
				}

			}
            
        };


		menuNav._focusItem(menuLabel);
		menuNav._setActiveItem(menuLabel);


		if (bUseAutoSubmenuDisplay) {
	
	        if (menuNav._movingToSubmenu) {
	            
	            //  If the user is moving diagonally from a submenu to 
	            //  another submenu and they then stop and pause on a
	            //  menu label for an amount of time equal to the amount of 
	            //  time defined for the display of a submenu then show the 
	            //  submenu immediately.
	            //  http://yuilibrary.com/projects/yui3/ticket/2528316
	            
	            //Y.message("Pause path");
	            
	            menuNav._hoverTimer = later(submenuShowDelay, menuNav, function () {
                    showSubmenu(0);
	            });
	            
	        }
	        else {
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

		var menuNav = this,
			bIsRoot = menuNav._isRoot(menuNav._activeMenu),
			bUseAutoSubmenuDisplay = 
				(menuNav.get(AUTO_SUBMENU_DISPLAY) && bIsRoot || !bIsRoot),

			oRelatedTarget = event.relatedTarget,
			oSubmenu = menuLabel.next(),
			hoverTimer = menuNav._hoverTimer;

        if (hoverTimer) {
            hoverTimer.cancel();
        }

		menuNav._clearActiveItem();

		if (bUseAutoSubmenuDisplay) {

			if (menuNav._movingToSubmenu && 
					!menuNav._showSubmenuTimer && oSubmenu) {

				//	If the mouse is moving diagonally toward the submenu and 
				//	another submenu isn't in the process of being displayed 
				//	(via a timer), then hide the submenu via a timer to give
				//	the user some time to reach the submenu.
			
				menuNav._hideSubmenuTimer = 
					later(menuNav.get("submenuHideDelay"), menuNav, 
						menuNav._hideMenu, oSubmenu);
			
			}
			else if (!menuNav._movingToSubmenu && oSubmenu && (!oRelatedTarget || 
			        (oRelatedTarget && 
			            !oSubmenu.contains(oRelatedTarget) && 
			            !oRelatedTarget.compareTo(oSubmenu)))) {

				//	If the mouse is not moving toward the submenu, cancel any 
				//	submenus that might be in the process of being displayed 
				//	(via a timer) and hide this submenu immediately.

				menuNav._cancelShowSubmenuTimer();

				menuNav._hideMenu(oSubmenu);

			}

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

		var menuNav = this,
			oActiveMenu = menuNav._activeMenu,
			bIsRoot = menuNav._isRoot(oActiveMenu),
			bUseAutoSubmenuDisplay = 
				(menuNav.get(AUTO_SUBMENU_DISPLAY) && bIsRoot || !bIsRoot);


		menuNav._focusItem(menuItem);
		menuNav._setActiveItem(menuItem);


		if (bUseAutoSubmenuDisplay && !menuNav._movingToSubmenu) {

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

		this._clearActiveItem();

	},


	/**
	* @method _onVerticalMenuKeyDown
	* @description "keydown" event handler for vertical menus.
	* @protected
	* @param {Object} event Object representing the DOM event.
	*/
	_onVerticalMenuKeyDown: function (event) {

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


		switch (nKeyCode) {

			case 37:	//	left arrow

				oParentMenu = getParentMenu(oActiveMenu);

				if (oParentMenu && isHorizontalMenu(oParentMenu)) {
				
					menuNav._hideMenu(oActiveMenu);
					oLI = getPreviousSibling(oActiveMenu.get(PARENT_NODE));
					oItem = getItem(oLI);
					
					if (oItem) {

						if (isMenuLabel(oItem)) {	//	Menu label
						
							oSubmenu = oItem.next();
						

							if (oSubmenu) {

								menuNav._showMenu(oSubmenu);
								menuNav._focusItem(getFirstItem(oSubmenu));
								menuNav._setActiveItem(getFirstItem(oSubmenu));

							}
							else {
	
								menuNav._focusItem(oItem);
								menuNav._setActiveItem(oItem);
	
							}
						
						}
						else {	//	MenuItem

							menuNav._focusItem(oItem);
							menuNav._setActiveItem(oItem);

						}
					
					}

				}
				else if (!menuNav._isRoot(oActiveMenu)) {
					menuNav._hideMenu(oActiveMenu, true);
				}


				bPreventDefault = true;

			break;

			case 39:	//	right arrow

				if (isMenuLabel(oTarget)) {
					
					oSubmenu = oTarget.next();

					if (oSubmenu) {

						menuNav._showMenu(oSubmenu);
						menuNav._focusItem(getFirstItem(oSubmenu));
						menuNav._setActiveItem(getFirstItem(oSubmenu));

					}
				
				}
				else if (isHorizontalMenu(oRootMenu)) {

					oSubmenu = menuNav._getTopmostSubmenu(oActiveMenu);
					oLI = getNextSibling(oSubmenu.get(PARENT_NODE));
					oItem = getItem(oLI);

					menuNav._hideAllSubmenus(oRootMenu);

					if (oItem) {

						if (isMenuLabel(oItem)) {	//	Menu label

							oSubmenu = oItem.next();

							if (oSubmenu) {

								menuNav._showMenu(oSubmenu);
								menuNav._focusItem(getFirstItem(oSubmenu));
								menuNav._setActiveItem(getFirstItem(oSubmenu));

							}
							else {

								menuNav._focusItem(oItem);
								menuNav._setActiveItem(oItem);	

							}
						
						}
						else {	//	MenuItem

							menuNav._focusItem(oItem);
							menuNav._setActiveItem(oItem);

						}							

					}
				
				}

				bPreventDefault = true;

			break;

		}	


		if (bPreventDefault) {

			//	Prevent the browser from scrolling the window

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

		var menuNav = this,
			oActiveMenu = menuNav._activeMenu,
			oTarget = event.target,
			oFocusedItem = getItem(oTarget, true),
			bPreventDefault = false,
			nKeyCode = event.keyCode,
			oSubmenu;


		if (nKeyCode === 40) {

			menuNav._hideAllSubmenus(oActiveMenu);

			if (isMenuLabel(oFocusedItem)) {
			
				oSubmenu = oFocusedItem.next();

				if (oSubmenu) {

					menuNav._showMenu(oSubmenu);
					menuNav._focusItem(getFirstItem(oSubmenu));
					menuNav._setActiveItem(getFirstItem(oSubmenu));

				}

				bPreventDefault = true;
			
			}

		}		


		if (bPreventDefault) {

			//	Prevent the browser from scrolling the window

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

		var menuNav = this;

		//	Using a timer to set the value of the "_currentMouseX" property 
		//	helps improve the reliability of the calculation used to set the 
		//	value of the "_movingToSubmenu" property - especially in Opera.

		later(10, menuNav, function () {

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

		var menuNav = this,
			oTarget,
			oMenu,
			oMenuLabel,
			oParentMenu,
			oMenuItem;


		if (menuNav._blockMouseEvent) {
			menuNav._blockMouseEvent = false;
		}
		else {

			oTarget = event.target;
			oMenu = getMenu(oTarget, true);
			oMenuLabel = getMenuLabel(oTarget, true);
			oMenuItem = getMenuItem(oTarget, true);


			if (handleMouseOverForNode(oMenu, oTarget)) {

				menuNav._onMenuMouseOver(oMenu, event);

				oMenu[HANDLED_MOUSEOVER] = true;
				oMenu[HANDLED_MOUSEOUT] = false;

				oParentMenu = getParentMenu(oMenu);

				if (oParentMenu) {

					oParentMenu[HANDLED_MOUSEOUT] = true;
					oParentMenu[HANDLED_MOUSEOVER] = false;
		
				}
			
			}

			if (handleMouseOverForNode(oMenuLabel, oTarget)) {

				menuNav._onMenuLabelMouseOver(oMenuLabel, event);

				oMenuLabel[HANDLED_MOUSEOVER] = true;
				oMenuLabel[HANDLED_MOUSEOUT] = false;
	
			}

			if (handleMouseOverForNode(oMenuItem, oTarget)) {
	
				menuNav._onMenuItemMouseOver(oMenuItem, event);

				oMenuItem[HANDLED_MOUSEOVER] = true;
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
			
		var menuNav = this,
			oActiveMenu = menuNav._activeMenu,
			bMovingToSubmenu = false,
			oTarget,
			oRelatedTarget,
			oMenu,
			oMenuLabel,
			oSubmenu,
			oMenuItem;


		menuNav._movingToSubmenu = 
					(oActiveMenu && !isHorizontalMenu(oActiveMenu) && 
						((event.pageX - 5) > menuNav._currentMouseX));
		
		oTarget = event.target;
		oRelatedTarget = event.relatedTarget;
		oMenu = getMenu(oTarget, true);
		oMenuLabel = getMenuLabel(oTarget, true);
		oMenuItem = getMenuItem(oTarget, true);


		if (handleMouseOutForNode(oMenuLabel, oRelatedTarget)) {

			menuNav._onMenuLabelMouseOut(oMenuLabel, event);

			oMenuLabel[HANDLED_MOUSEOUT] = true;
			oMenuLabel[HANDLED_MOUSEOVER] = false;

		}

		if (handleMouseOutForNode(oMenuItem, oRelatedTarget)) {

			menuNav._onMenuItemMouseOut(oMenuItem, event);

			oMenuItem[HANDLED_MOUSEOUT] = true;
			oMenuItem[HANDLED_MOUSEOVER] = false;
			
		}


		if (oMenuLabel) {

			oSubmenu = oMenuLabel.next();

			if (oSubmenu && oRelatedTarget && 
				(oRelatedTarget.compareTo(oSubmenu) || 
					oSubmenu.contains(oRelatedTarget))) {

				bMovingToSubmenu = true;

			}
		
		}
		

		if (handleMouseOutForNode(oMenu, oRelatedTarget) || bMovingToSubmenu) {

			menuNav._onMenuMouseOut(oMenu, event);				

			oMenu[HANDLED_MOUSEOUT] = true;
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


		if (oMenuLabel) {

			oAnchor = isAnchor(oTarget) ? oTarget : oTarget.ancestor(isAnchor);
			

			if (oAnchor) {

				//	Need to pass "2" as a second argument to "getAttribute" for 
				//	IE otherwise IE will return a fully qualified URL for the 
				//	value of the "href" attribute.
				//	http://msdn.microsoft.com/en-us/library/ms536429(VS.85).aspx

				sHref = oAnchor.getAttribute("href", 2);
				nHashPos = sHref.indexOf("#");
				nLen = sHref.length;

				if (nHashPos === 0 && nLen > 1) {

					sId = sHref.substr(1, nLen);
					oSubmenu = oMenuLabel.next();

					if (oSubmenu && (oSubmenu.get(ID) === sId)) {

						if (sType === MOUSEDOWN || sType === KEYDOWN) {
							
							if ((UA.opera || UA.gecko || UA.ie) && sType === KEYDOWN && !menuNav._preventClickHandle) {

								//	Prevent the browser from following the URL of 
								//	the anchor element

								menuNav._preventClickHandle = menuNav._rootMenu.on("click", function (event) {

									event.preventDefault();

									menuNav._preventClickHandle.detach();
									menuNav._preventClickHandle = null;

								});

							}
							
							if (sType == MOUSEDOWN) {

								//	Prevent the target from getting focused by 
								//	default, since the element to be focused will
								//	be determined by weather or not the submenu
								//	is visible.
								event.preventDefault();

								//	FocusManager will attempt to focus any 
								//	descendant that is the target of the mousedown
								//	event.  Since we want to explicitly control 
	 							//	where focus is going, we need to call 
								//	"stopImmediatePropagation" to stop the 
								//	FocusManager from doing its thing.
								event.stopImmediatePropagation();	

								//	The "_focusItem" method relies on the 
								//	"_hasFocus" property being set to true.  The
								//	"_hasFocus" property is normally set via a 
								//	"focus" event listener, but since we've 
								//	blocked focus from happening, we need to set 
								//	this property manually.
								menuNav._hasFocus = true;

							}

								
							if (menuNav._isRoot(getParentMenu(oTarget))) {	//	Event target is a submenu label in the root menu
							
								//	Menu label toggle functionality
							
								if (hasVisibleSubmenu(oMenuLabel)) {
							
									menuNav._hideMenu(oSubmenu);
									menuNav._focusItem(oMenuLabel);	
									menuNav._setActiveItem(oMenuLabel);
									
								}
								else {
							
									menuNav._hideAllSubmenus(menuNav._rootMenu);
									menuNav._showMenu(oSubmenu);

									menuNav._focusItem(getFirstItem(oSubmenu));
									menuNav._setActiveItem(getFirstItem(oSubmenu));
									
								}
							
							}
							else {	//	Event target is a submenu label within a submenu
							
								if (menuNav._activeItem == oMenuLabel) {
							
									menuNav._showMenu(oSubmenu);
									menuNav._focusItem(getFirstItem(oSubmenu));
									menuNav._setActiveItem(getFirstItem(oSubmenu));										
							
								}
								else {
							
									if (!oMenuLabel._clickHandle) {

										oMenuLabel._clickHandle = oMenuLabel.on("click", function () {

											menuNav._hideAllSubmenus(menuNav._rootMenu);

											menuNav._hasFocus = false;
											menuNav._clearActiveItem();


											oMenuLabel._clickHandle.detach();
											
											oMenuLabel._clickHandle = null;

										});
										
									}
									
								}
								
							}

						}


						if (sType === CLICK) {
						
							//	Prevent the browser from following the URL of 
							//	the anchor element
							
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
	
		switch (event.keyCode) {

			case 37:	//	left arrow
			case 38:	//	up arrow
			case 39:	//	right arrow
			case 40:	//	down arrow

				//	Prevent the browser from scrolling the window

				event.preventDefault();

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

		var menuNav = this,
			oActiveItem = menuNav._activeItem,
			oTarget = event.target,
			oActiveMenu = getParentMenu(oTarget),
			oSubmenu;

		if (oActiveMenu) {

			menuNav._activeMenu = oActiveMenu;

			if (isHorizontalMenu(oActiveMenu)) {
				menuNav._onHorizontalMenuKeyDown(event);
			}
			else {
				menuNav._onVerticalMenuKeyDown(event);
			}


			if (event.keyCode === 27) {

				if (!menuNav._isRoot(oActiveMenu)) {

					if (UA.opera) {
						later(0, menuNav, function () {
							menuNav._hideMenu(oActiveMenu, true);
						});						
					}
					else {
						menuNav._hideMenu(oActiveMenu, true);						
					}

					event.stopPropagation();
					menuNav._blockMouseEvent = UA.gecko ? true : false;

				}
				else if (oActiveItem) {

					if (isMenuLabel(oActiveItem) && 
							hasVisibleSubmenu(oActiveItem)) {
					
						oSubmenu = oActiveItem.next();

						if (oSubmenu) {
							menuNav._hideMenu(oSubmenu);
						}

					}
					else {

						menuNav._focusManager.blur();

						//	This is necessary for Webkit since blurring the 
						//	active menuitem won't result in the document 
						//	gaining focus, meaning the that _onDocFocus 
						//	listener won't clear the active menuitem.

						menuNav._clearActiveItem();	
						
						menuNav._hasFocus = false;

					}

				}
			
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

		var menuNav = this,
			oRoot = menuNav._rootMenu,
			oTarget = event.target;


		if (!(oRoot.compareTo(oTarget) || oRoot.contains(oTarget))) {

			menuNav._hideAllSubmenus(oRoot);

			//	Document doesn't receive focus in Webkit when the user mouses 
			//	down on it, so the "_hasFocus" property won't get set to the 
			//	correct value.  The following line corrects the problem.

			if (UA.webkit) {
				menuNav._hasFocus = false;
				menuNav._clearActiveItem();
			}

		}

	}
	
});


Y.namespace('Plugin');

Y.Plugin.NodeMenuNav = NodeMenuNav;


}, '3.7.3', {"requires": ["node", "classnamemanager", "plugin", "node-focusmanager"], "skinnable": true});
