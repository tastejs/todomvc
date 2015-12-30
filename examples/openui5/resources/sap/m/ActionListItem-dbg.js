/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.m.ActionListItem.
sap.ui.define(['jquery.sap.global', './ListItemBase', './library', 'sap/ui/core/EnabledPropagator'],
	function(jQuery, ListItemBase, library, EnabledPropagator) {
	"use strict";



	/**
	 * Constructor for a new ActionListItem.
	 *
	 * @param {string} [sId] Id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * The <code>sap.m.ActionListItem</code> can be used like a <code>button</code> to fire actions when pressed.
	 * <b>Note:</b> The inherited <code>selected</code> property of the <code>sap.m.ListItemBase</code> is not supported.
	 * @extends sap.m.ListItemBase
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.m.ActionListItem
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var ActionListItem = ListItemBase.extend("sap.m.ActionListItem", /** @lends sap.m.ActionListItem.prototype */ { metadata : {

		library : "sap.m",
		properties : {

			/**
			 * Defines the text that appears in the control.
			 */
			text : {type : "string", group : "Misc", defaultValue : null}
		}
	}});


	/**
	 * Initializes member variables which are needed later on.
	 *
	 * @private
	 */
	ActionListItem.prototype.init = function() {
		this.setType(sap.m.ListType.Active);
		ListItemBase.prototype.init.apply(this, arguments);
	};

	/**
	 * Determines item specific mode
	 *
	 * ActionListItems are not selectable because they are command controls (like Button or Link) so triggering the associated command, rather than selection is 
	 * appropriate to happen upon user action on these items. By overwriting isSelectable (inherited from ListItemBase) we exclude the item from processing
	 * specific to selectable list-items.
	 *
	 * @protected
	 * @overwrite
	 */
	ActionListItem.prototype.getMode = function() {
		return sap.m.ListMode.None;
	};

	/**
	 * Event handler called when the space key is pressed.
	 *
	 * ActionListItems are command controls so keydown [SPACE] should have the same effect as keydown [ENTER] (i.e. triggering the associated command, instead of 
	 * selection)
	 *
	 * @param {jQuery.Event} oEvent
	 * @private
	 */
	ActionListItem.prototype.onsapspace = ActionListItem.prototype.onsapenter;

	return ActionListItem;

}, /* bExport= */ true);
