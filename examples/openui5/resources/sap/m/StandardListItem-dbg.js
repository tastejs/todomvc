/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.m.StandardListItem.
sap.ui.define(['jquery.sap.global', './ListItemBase', './library', 'sap/ui/core/EnabledPropagator', 'sap/ui/core/IconPool'],
	function(jQuery, ListItemBase, library, EnabledPropagator, IconPool) {
	"use strict";


	
	/**
	 * Constructor for a new StandardListItem.
	 *
	 * @param {string} [sId] Id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * <code>sap.m.StandardListItem</code> is a list item providing the most common use cases, e.g. image, title and description.
	 * @extends sap.m.ListItemBase
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.m.StandardListItem
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var StandardListItem = ListItemBase.extend("sap.m.StandardListItem", /** @lends sap.m.StandardListItem.prototype */ { metadata : {
	
		library : "sap.m",
		properties : {
	
			/**
			 * Defines the title of the list item.
			 */
			title : {type : "string", group : "Misc", defaultValue : null},
	
			/**
			 * Defines the additional information for the title.
			 * <b>Note:</b> This is only visible when the <code>title</code> property is not empty.
			 */
			description : {type : "string", group : "Misc", defaultValue : null},
	
			/**
			 * Defines the list item icon.
			 */
			icon : {type : "sap.ui.core.URI", group : "Misc", defaultValue : null},
	
			/**
			 * Defines the indentation of the icon. If set to <code>false</code>, the icon will not be shown as embedded. Instead it will take the full height of the list item.
			 */
			iconInset : {type : "boolean", group : "Appearance", defaultValue : true},
	
			/**
			 * By default, one or more requests are sent to get the density perfect version of the icon if the given version of the icon doesn't exist on the server.
			 * <b>Note:<b> If bandwidth is a key factor for the application, set this value to <code>false</code>.
			 */
			iconDensityAware : {type : "boolean", group : "Misc", defaultValue : true},
	
			/**
			 * Defines the icon that is shown while the list item is pressed.
			 */
			activeIcon : {type : "sap.ui.core.URI", group : "Misc", defaultValue : null},
	
			/**
			 * Defines an additional information text.
			 */
			info : {type : "string", group : "Misc", defaultValue : null},
	
			/**
			 * Defines the state of the information text, e.g. <code>Error</code>, <code>Warning</code>, <code>Success</code>.
			 */
			infoState : {type : "sap.ui.core.ValueState", group : "Misc", defaultValue : sap.ui.core.ValueState.None},
	
			/**
			 * By default, the title size adapts to the available space and gets bigger if the description is empty. If you have list items with and without descriptions, this results in titles with different sizes. In this case, it can be better to switch the size adaption off by setting this property to <code>false</code>.
			 * @since 1.16.3
			 */
			adaptTitleSize : {type : "boolean", group : "Appearance", defaultValue : true},
			
			/**
			 * Defines the <code>title</code> text directionality with enumerated options. By default, the control inherits text direction from the DOM.
			 * @since 1.28.0
			 */
			titleTextDirection : {type : "sap.ui.core.TextDirection", group : "Appearance", defaultValue : sap.ui.core.TextDirection.Inherit},
			
			/**
			 * Defines the <code>info</code> directionality with enumerated options. By default, the control inherits text direction from the DOM.
			 * @since 1.28.0
			 */
			infoTextDirection : {type : "sap.ui.core.TextDirection", group : "Appearance", defaultValue : sap.ui.core.TextDirection.Inherit}
		}
	}});
	
	
	StandardListItem.prototype.exit = function() {
		if (this._image) {
			this._image.destroy();
		}
	
		ListItemBase.prototype.exit.apply(this, arguments);
	};
	
	
	/**
	 * @private
	 */
	StandardListItem.prototype._getImage = function(sImgId, sImgStyle, sSrc, bIconDensityAware) {
		var oImage = this._image;
	
		if (oImage) {
			oImage.setSrc(sSrc);
			if (oImage instanceof sap.m.Image) {
				oImage.setDensityAware(bIconDensityAware);
			}
		} else {
			oImage = IconPool.createControlByURI({
				id: sImgId,
				src : sSrc,
				densityAware : bIconDensityAware,
				useIconTooltip : false
			}, sap.m.Image).setParent(this, null, true);
		}
	
		if (oImage instanceof sap.m.Image) {
			oImage.addStyleClass(sImgStyle, true);
		} else {
			oImage.addStyleClass(sImgStyle + "Icon", true);
		}
	
		this._image = oImage;
		return this._image;
	};
	
	// overwrite base method to hook into the active handling
	StandardListItem.prototype._activeHandlingInheritor = function() {
		var oImage = sap.ui.getCore().byId(this.getId() + "-img");
		if (oImage instanceof sap.ui.core.Icon) {
			oImage.$().toggleClass("sapMSLIIconActive", this._active);
		}
	
		if (oImage && this.getActiveIcon()) {
			oImage.setSrc(this.getActiveIcon());
		}
	};
	
	// overwrite base method to hook into the inactive handling
	StandardListItem.prototype._inactiveHandlingInheritor = function() {
		var oImage = sap.ui.getCore().byId(this.getId() + "-img");
		if (oImage instanceof sap.ui.core.Icon) {
			oImage.$().toggleClass("sapMSLIIconActive", this._active);
		}
	
		if (oImage) {
			oImage.setSrc(this.getIcon());
		}
	};

	return StandardListItem;

}, /* bExport= */ true);
