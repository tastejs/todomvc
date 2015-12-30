/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.m.ObjectListItem.
sap.ui.define(['jquery.sap.global', './ListItemBase', './library', 'sap/ui/core/IconPool'],
	function(jQuery, ListItemBase, library, IconPool) {
	"use strict";


	
	/**
	 * Constructor for a new ObjectListItem.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * ObjectListItem is a display control that provides summary information about an object as an item in a list. The object list item title is the key identifier of the object. Additional text and icons can be used to further distinguish it from other objects. Attributes and statuses can be used to provide additional meaning about the object to the user.
	 * @extends sap.m.ListItemBase
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @since 1.12
	 * @alias sap.m.ObjectListItem
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var ObjectListItem = ListItemBase.extend("sap.m.ObjectListItem", /** @lends sap.m.ObjectListItem.prototype */ { metadata : {
	
		library : "sap.m",
		properties : {
	
			/**
			 * Object list item title
			 */
			title : {type : "string", group : "Misc", defaultValue : null},
	
			/**
			 * Object list item number
			 */
			number : {type : "string", group : "Misc", defaultValue : null},
	
			/**
			 * The number units qualifier of the object list item
			 */
			numberUnit : {type : "string", group : "Misc", defaultValue : null},
	
			/**
			 * Introductory text for the object list item.
			 */
			intro : {type : "string", group : "Misc", defaultValue : null},
	
			/**
			 * Object list item icon displayed to the left of the title.
			 */
			icon : {type : "sap.ui.core.URI", group : "Misc", defaultValue : null},
	
			/**
			 * Icon displayed when the object list item is active.
			 */
			activeIcon : {type : "sap.ui.core.URI", group : "Misc", defaultValue : null},
	
			/**
			 * By default, this is set to true but then one or more requests are sent trying to get the density perfect version of image if this version of image doesn't exist on the server.
			 * 
			 * If bandwidth is the key for the application, set this value to false.
			 */
			iconDensityAware : {type : "boolean", group : "Misc", defaultValue : true},
	
			/**
			 * Set the favorite state for the object list item
			 * @since 1.16.0
			 */
			markFavorite : {type : "boolean", group : "Misc", defaultValue : null},
	
			/**
			 * Set the flagged state for the object list item
			 * @since 1.16.0
			 */
			markFlagged : {type : "boolean", group : "Misc", defaultValue : null},
	
			/**
			 * Set to true if the object list item can be marked with icons such as favorite and flag.
			 * @since 1.16.0
			 */
			showMarkers : {type : "boolean", group : "Misc", defaultValue : null},
	
			/**
			 * Object list item number and numberUnit value state.
			 * @since 1.16.0
			 */
			numberState : {type : "sap.ui.core.ValueState", group : "Misc", defaultValue : sap.ui.core.ValueState.None},

			/**
			 * Determines the text direction of the item title.
			 * Available options for the title direction are LTR (left-to-right) and RTL (right-to-left).
			 * By default the item title inherits the text direction from its parent.
			 */
			titleTextDirection: {type : "sap.ui.core.TextDirection", group : "Appearance", defaultValue : sap.ui.core.TextDirection.Inherit},

			/**
			 * Determines the text direction of the item intro.
			 * Available options for the intro direction are LTR (left-to-right) and RTL (right-to-left).
			 * By default the item intro inherits the text direction from its parent.
			 */
			introTextDirection: {type : "sap.ui.core.TextDirection", group : "Appearance", defaultValue : sap.ui.core.TextDirection.Inherit},

			/**
			 * Determines the text direction of the item number.
			 * Available options for the number direction are LTR (left-to-right) and RTL (right-to-left).
			 * By default the item number inherits the text direction from its parent.
			 */
			numberTextDirection: {type : "sap.ui.core.TextDirection", group : "Appearance", defaultValue : sap.ui.core.TextDirection.Inherit},

			/**
			 * Set the locked state of the object list item.
			 * @since 1.28
			 */
			markLocked : {type : "boolean", group : "Misc", defaultValue : false}			
		},
		defaultAggregation : "attributes",
		aggregations : {
	
			/**
			 * List of attributes displayed below the title to the left of the status fields.
			 */
			attributes : {type : "sap.m.ObjectAttribute", multiple : true, singularName : "attribute"}, 
	
			/**
			 * First status text field shown on the right side of the attributes.
			 */
			firstStatus : {type : "sap.m.ObjectStatus", multiple : false}, 
	
			/**
			 * Second status text field shown on the right side of the attributes.
			 */
			secondStatus : {type : "sap.m.ObjectStatus", multiple : false}
		}
	}});
	
	///**
	// * This file defines behavior for the control,
	// */
	
	// get resource translation bundle;
	var oLibraryResourceBundle = sap.ui.getCore().getLibraryResourceBundle("sap.m");
	
	/**
	 * @private
	 */
	ObjectListItem.prototype.exit = function(oEvent) {
		// image or icon if initialized
		if (this._oImageControl) {
			this._oImageControl.destroy();
		}
		
		if (this._oPlaceholderIcon) {
			this._oPlaceholderIcon.destroy();
			this._oPlaceholderIcon = undefined;
		}
	
		if (this._oFavIcon) {
			this._oFavIcon.destroy();
			this._oFavIcon = undefined;
		}
		
		if (this._oFlagIcon) {
			this._oFlagIcon.destroy();
			this._oFlagIcon = undefined;
		}

		if (this._oLockIcon) {
			this._oLockIcon.destroy();
			this._oLockIcon = undefined;
		}
		
		if (this._oTitleText) {
			this._oTitleText.destroy();
			this._oTitleText = undefined;
		}
		
		ListItemBase.prototype.exit.apply(this);
	};
	
	/**
	 * @private
	 * @returns {boolean}
	 */
	ObjectListItem.prototype._hasAttributes = function() {
		var attributes = this.getAttributes();
		if (attributes.length > 0) {
			for (var i = 0; i < attributes.length; i++) {
				if (!attributes[i]._isEmpty()) {
					return true;
				}
			}
		}
		return false;
	};
	
	/**
	 * @private
	 * @returns {boolean}
	 */
	ObjectListItem.prototype._hasStatus = function() {
		return ((this.getFirstStatus() && !this.getFirstStatus()._isEmpty())
				|| (this.getSecondStatus() && !this.getSecondStatus()._isEmpty() ));
	};
	
	/**
	 * @private
	 * @returns {boolean}
	 */
	ObjectListItem.prototype._hasBottomContent = function() {
		
		return (this._hasAttributes() || this._hasStatus() || this.getShowMarkers() || this.getMarkLocked());
	};
	
	/**
	 * @private
	 * @returns {Array}
	 */
	ObjectListItem.prototype._getVisibleAttributes = function() {
	
		var aAllAttributes = this.getAttributes();
		var aVisibleAttributes = [];
	
		for (var i = 0; i < aAllAttributes.length; i++) {
			if (aAllAttributes[i].getVisible()) {
				aVisibleAttributes.push(aAllAttributes[i]);
			}
		}
	
		return aVisibleAttributes;
	};

	/**
	 * Lazy load list item's image.
	 *
	 * @private
	 */
	ObjectListItem.prototype._getImageControl = function() {
	
		var sImgId = this.getId() + '-img';
		var sSize = "2.5rem";
		var mProperties = {
			src : this.getIcon(),
			height : sSize,
			width : sSize,
			size: sSize,
			useIconTooltip : false,
			densityAware : this.getIconDensityAware()
		};
		var aCssClasses = ['sapMObjLIcon'];
		
		this._oImageControl = sap.m.ImageHelper.getImageControl(sImgId, this._oImageControl, this, mProperties, aCssClasses);
		
		return this._oImageControl;
	};
	
	/**
	 * Overwrite base method to hook into list item's active handling
	 * 
	 * @private
	 */
	ObjectListItem.prototype._activeHandlingInheritor = function() {
		var sActiveSrc = this.getActiveIcon();
		
		if (!!this._oImageControl  && !!sActiveSrc) {
			this._oImageControl.setSrc(sActiveSrc);
		}
	};
	
	/**
	 * Overwrite base method to hook into list item's inactive handling
	 * 
	 * @private
	 */
	ObjectListItem.prototype._inactiveHandlingInheritor = function() {
		var sSrc = this.getIcon();
		if (!!this._oImageControl) {
			this._oImageControl.setSrc(sSrc);
		}
	};
	
	/**
	 * @private
	 * @returns Flag icon control
	 */
	//TODO Remove placeholder when Safari iconFont issue is addressed.
	ObjectListItem.prototype._getPlaceholderIcon = function() {
		
		if (!this._oPlaceholderIcon) {
	
			var oPlaceholderIconUri = IconPool.getIconURI("fridge");
			this._oPlaceholderIcon = IconPool.createControlByURI({
				id: this.getId() + "-placeholder",
				useIconTooltip : false,
				src: oPlaceholderIconUri
			});
			
			this._oPlaceholderIcon.addStyleClass("sapMObjStatusMarkerInvisible");
		}
		return this._oPlaceholderIcon;
	};
	
	/**
	 * @private
	 * @returns Flag icon control
	 */
	ObjectListItem.prototype._getFlagIcon = function() {
		
		if (!this._oFlagIcon) {
	
			var oFlagIconUri = IconPool.getIconURI("flag");
			this._oFlagIcon = IconPool.createControlByURI({
				id: this.getId() + "-flag",
				tooltip: oLibraryResourceBundle.getText("TOOLTIP_OLI_FLAG_MARK_VALUE"),
				src: oFlagIconUri
			});
		}
		return this._oFlagIcon;
	};

	/**
	 * @private
	 * @returns Lock icon control
	 */
	ObjectListItem.prototype._getLockIcon = function() {

		if (!this._oLockIcon) {
			var oLockIconUri = IconPool.getIconURI("locked");
			this._oLockIcon = IconPool.createControlByURI({
				id: this.getId() + "-lock",
				tooltip: oLibraryResourceBundle.getText("TOOLTIP_OLI_LOCK_MARK_VALUE"),
				src: oLockIconUri
			}).addStyleClass("sapMObjStatusMarkerLocked");
		}
		return this._oLockIcon;
	};

	/**
	 * @private
	 * @returns Favorite icon control
	 */
	ObjectListItem.prototype._getFavoriteIcon = function() {

		if (!this._oFavIcon) {

			var oFavIconUri = IconPool.getIconURI("favorite");
			this._oFavIcon = IconPool.createControlByURI({
				id: this.getId() + "-favorite",
				tooltip: oLibraryResourceBundle.getText("TOOLTIP_OLI_FAVORITE_MARK_VALUE"),
				src: oFavIconUri
			});
		}
		return this._oFavIcon;
	};

	/**
	 * @private
	 * @returns title text control
	 */
	ObjectListItem.prototype._getTitleText = function() {

		if (!this._oTitleText) {
			this._oTitleText = new sap.m.Text(this.getId() + "-titleText", {
				maxLines: 2
			});

			this._oTitleText.setParent(this, null, true);
		}
		return this._oTitleText;
	};

	return ObjectListItem;

}, /* bExport= */ true);
