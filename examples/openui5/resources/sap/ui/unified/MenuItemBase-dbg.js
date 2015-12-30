/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.unified.MenuItemBase.
sap.ui.define(['jquery.sap.global', 'sap/ui/core/Element', './library'],
	function(jQuery, Element, library) {
	"use strict";


	
	/**
	 * Abstract base class <code>MenuItemBase</code> for menu item elements. Please use concrete subclasses.
	 *
	 * @param {string} [sId] Id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * Abstract base class for menu item which provides common properties and events for all concrete item implementations.
	 * @abstract
	 * @extends sap.ui.core.Element
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 * @since 1.21.0
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.unified.MenuItemBase
	 * @ui5-metamodel This control/element will also be described in the UI5 (legacy) design time meta model
	 */
	var MenuItemBase = Element.extend("sap.ui.unified.MenuItemBase", /** @lends sap.ui.unified.MenuItemBase.prototype */ { metadata : {
	
		library : "sap.ui.unified",
		properties : {
	
			/**
			 * When an item is disabled the item can not be selected by the user.
			 * The enabled property of the item has no effect when the menu of the item is disabled ({@link sap.ui.unified.Menu#getEnabled Menu#getEnabled}).
			 */
			enabled : {type : "boolean", group : "Behavior", defaultValue : true},
	
			/**
			 * Invisible items do not appear in the menu.
			 */
			visible : {type : "boolean", group : "Behavior", defaultValue : true},
	
			/**
			 * Defines whether a visual separator should be rendered before the item.
			 * <b>Note:</b> If an item is invisible also the separator of this item is not shown.
			 */
			startsSection : {type : "boolean", group : "Behavior", defaultValue : false}
		},
		defaultAggregation : "submenu",
		aggregations : {
	
			/**
			 * An optional submenu of the item which is opened when the item is selected by the user.
			 */
			submenu : {type : "sap.ui.unified.Menu", multiple : false}
		},
		events : {
	
			/**
			 * Fired when the item is selected by the user.
			 * <b>Note:</b> The event is also available for items which have a submenu.
			 * In general, applications must not handle event in this case because the user selection opens the sub menu.
			 */
			select : {
				parameters : {
	
					/**
					 * The current item
					 */
					item : {type : "sap.ui.unified.MenuItemBase"}
				}
			}
		}
	}});
	
	MenuItemBase.prototype.init = function(){
	   // do something for initialization...
	};
	
	/**
	 * Produces the HTML of an item and writes it to render-output-buffer during the rendering of the corresponding menu.
	 * 
	 * Subclasses may override this function.
	 * 
	 * @param {sap.ui.core.RenderManager} oRenderManager The <code>RenderManager</code> that can be used for writing to the render-output-buffer
	 * @param {sap.ui.unified.MenuItemBase} oItem The item which should be rendered
	 * @param {sap.ui.unified.Menu} oMenu The menu to which this item belongs
	 * @protected
	 */
	MenuItemBase.prototype.render = function(oRenderManager, oItem, oMenu){
		var rm = oRenderManager;
		rm.write("<li");
		rm.writeElementData(oItem);
		rm.write("><div style=\"white-space:nowrap;display:inline-block;padding:1px;color:black;\" id=\"" + this.getId() + "-txt\">");
		rm.write(oItem.getId());
		if (this.getSubmenu()) {
			rm.write("&nbsp;&nbsp;->");
		}
		rm.write("</div></li>");
	};
	
	/** 
	 * Changes the visual hover state of the menu item.
	 * 
	 * Subclasses may override this function.
	 * 
	 * @param {boolean} bHovered Specifies whether the item is currently hovered or not.
	 * @param {sap.ui.unified.Menu} oMenu The menu to which this item belongs
	 * @protected
	 */
	MenuItemBase.prototype.hover = function(bHovered, oMenu){
		this.$("txt").attr("style", bHovered ? "white-space:nowrap;display:inline-block;padding:1px;color:red;" : "white-space:nowrap;display:inline-block;padding:1px;color:black;");
	};
	
	/** 
	 * Event handler which is called whenever the submenu of the item is opened or closed.
	 * 
	 * Subclasses may override this function.
	 * 
	 * @param {boolean} bOpened Specifies whether the submenu of the item is opened or closed
	 * @protected
	 */
	MenuItemBase.prototype.onSubmenuToggle = function(bOpened){
		// Subclasses may override this: Called when the items submenu is opend or closed
		this.$().toggleClass("sapUiMnuItmSubMnuOpen", bOpened);
	};
	
	/**
	 * Informs the item that the item HTML is now applied to the DOM.
	 * 
	 * Subclasses may override this function.
	 * 
	 * @protected
	 */
	MenuItemBase.prototype.onAfterRendering = function(){
		// Subclasses may override this: Called after the item is rendered
	};
	
	
	
	MenuItemBase.prototype.onmouseover = function(oEvent){
		var oParent = this.getParent();
		if (oParent && oParent instanceof sap.ui.unified.Menu && this.getTooltip() instanceof sap.ui.core.TooltipBase) {
			//TooltipBase stops the event propagation
			oParent.onmouseover(oEvent);
		}
	};

	return MenuItemBase;

}, /* bExport= */ true);
