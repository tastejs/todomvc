/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.m.OverflowToolbarLayoutData.
sap.ui.define(['sap/m/ToolbarLayoutData', 'sap/m/OverflowToolbarPriority'],
	function(ToolbarLayoutData, OverflowToolbarPriority) {
	"use strict";

	/**
	 * Constructor for a new OverflowToolbarLayoutData.
	 *
	 * @param {string} [sId] id for the new element, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Holds layout data for the OverflowToolbar items.
	 * @extends sap.m.ToolbarLayoutData
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @since 1.28
	 * @alias sap.m.OverflowToolbarLayoutData
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var OverflowToolbarLayoutData = ToolbarLayoutData.extend("sap.m.OverflowToolbarLayoutData", /** @lends sap.m.OverflowToolbarLayoutData.prototype */ { metadata : {

		properties : {

			/**
			 * The OverflowToolbar item can or cannot move to the overflow area
			 *
			 * @deprecated Since version 1.32
			 */
			moveToOverflow : {type: "boolean", defaultValue: true, deprecated: true},

			/**
			 * The OverflowToolbar item can or cannot stay in the overflow area
			 *
			 * @deprecated Since version 1.32
			 */
			stayInOverflow : {type: "boolean", defaultValue: false, deprecated: true},

			/**
			 * Defines OverflowToolbar items priority, Available priorities ate NeverOverflow, High, Low, Disappear and AlwaysOverflow
			 *
			 * @public
			 * @since 1.32
			 */
			priority: {type: "sap.m.OverflowToolbarPriority", group: "Behavior", defaultValue: sap.m.OverflowToolbarPriority.High},

			/**
			 * Defines OverflowToolbar items group number.
			 * Default value is 0, which means that the control does not belong to any group.
			 * Elements that belong to a group overflow together. The overall priority of the group is defined by the element with highest priority.
			 * Elements that belong to a group are not allowed to have AlwaysOverflow or NeverOverflow priority.
			 * @public
			 * @since 1.32
			 */
			group: {type: "int", group: "Behavior", defaultValue: 0}
		}
	}});

	/**
	 * Called when the OverflowToolbarLayoutData is invalidated.
	 * @override
	 */
	OverflowToolbarLayoutData.prototype.invalidate = function () {
		var sControlPriority = this.getPriority(),
			bInvalidPriority = sControlPriority === OverflowToolbarPriority.AlwaysOverflow ||
				sControlPriority === OverflowToolbarPriority.NeverOverflow;

		// Validate layoutData priority and group properties
		if (this.getGroup() && bInvalidPriority) {
			jQuery.sap.log.error("It is not allowed to set AlwaysOverflow or NeverOverflow to a group items.");
		}

		return ToolbarLayoutData.prototype.invalidate.call(this);
	};

	return OverflowToolbarLayoutData;

}, /* bExport= */ true);
