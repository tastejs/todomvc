/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.m.ColumnListItem.
sap.ui.define(['jquery.sap.global', 'sap/ui/core/Element', './ListItemBase', './library'],
	function(jQuery, Element, ListItemBase, library) {
	"use strict";

	/**
	 * Constructor for a new ColumnListItem.
	 *
	 * @param {string} [sId] Id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * <code>sap.m.ColumnListItem</code> can be used with the <code>cells</code> aggregation to create rows for the <code>sap.m.Table</code> control.
	 * The <code>columns</code> aggregation of the <code>sap.m.Table</code> should match with the cells aggregation.
	 *
	 * <b>Note:</b> This control should only be used within the <code>sap.m.Table</code> control.
	 * The inherited <code>counter</code> property of <code>sap.m.ListItemBase</code> is not supported.
	 *
	 * @extends sap.m.ListItemBase
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @since 1.12
	 * @alias sap.m.ColumnListItem
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var ColumnListItem = ListItemBase.extend("sap.m.ColumnListItem", /** @lends sap.m.ColumnListItem.prototype */ { metadata : {

		library : "sap.m",
		properties : {

			/**
			 * Sets the vertical alignment of all the cells within the table row (including selection and navigation).
			 * <b>Note:</b> <code>vAlign</code> property of <code>sap.m.Column</code> overrides the property for cell vertical alignment if both are set.
			 * @since 1.20
			 */
			vAlign : {type : "sap.ui.core.VerticalAlign", group : "Appearance", defaultValue : sap.ui.core.VerticalAlign.Inherit}
		},
		defaultAggregation : "cells",
		aggregations : {

			/**
			 * Every <code>control</code> inside the <code>cells</code> aggregation defines one cell of the row.
			 * <b>Note:</b> The order of the <code>cells</code> aggregation must match the order of the <code>columns</code> aggregation of <code>sap.m.Table</code>.
			 */
			cells : {type : "sap.ui.core.Control", multiple : true, singularName : "cell", bindable : "bindable"}
		}
	}});
	
	/**
	 * TablePopin element that handles own events.
	 */
	var TablePopin = Element.extend("sap.m.TablePopin", {
		onfocusin: function(oEvent) {
			// focus to the main row if there is nothing to focus in the popin
			if (oEvent.srcControl === this || !jQuery(oEvent.target).is(":sapFocusable")) {	
				this.getParent().focus();
			}
		}
	});

	ColumnListItem.prototype.init = function() {
		ListItemBase.prototype.init.call(this);
		this._bNeedsTypeColumn = false;
		this._aClonedHeaders = [];
	};

	ColumnListItem.prototype.onAfterRendering = function() {
		ListItemBase.prototype.onAfterRendering.call(this);
		this._checkTypeColumn();
	};
	
	ColumnListItem.prototype.exit = function() {
		ListItemBase.prototype.exit.call(this);
		this._checkTypeColumn(false);
		this._destroyClonedHeaders();

		if (this._oPopin) {
			this._oPopin.destroy(true);
			this._oPopin = null;
			this.removePopin();
		}
	};
	
	// remove pop-in from DOM when setVisible false is called
	ColumnListItem.prototype.setVisible = function(bVisible) {
		ListItemBase.prototype.setVisible.call(this, bVisible);
		if (!bVisible && this.hasPopin()) {
			this.removePopin();
		}
		
		return this;
	};
	
	// returns responsible table control for the item
	ColumnListItem.prototype.getTable = function() {
		var oParent = this.getParent();
		if (oParent instanceof sap.m.Table) {
			return oParent;
		}
		
		// support old list with columns aggregation
		if (oParent && oParent.getMetadata().getName() == "sap.m.Table") {
			return oParent;
		}
	};
	
	/**
	 * Returns the pop-in element.
	 *
	 * @protected
	 * @since 1.30.9
	 */
	ColumnListItem.prototype.getPopin = function() {
		if (!this._oPopin) {
			this._oPopin = new TablePopin({
				id: this.getId() + "-sub"
			}).addEventDelegate({
				// handle the events of pop-in
				ontouchstart: this.ontouchstart,
				ontouchmove: this.ontouchmove,
				ontap: this.ontap,
				ontouchend: this.ontouchend,
				ontouchcancel: this.ontouchcancel,
				onsaptabnext: this.onsaptabnext,
				onsaptabprevious: this.onsaptabprevious
			}, this).setParent(this, null, true);
		}
		
		return this._oPopin;
	};
	
	/**
	 * Returns pop-in DOMRef as a jQuery Object
	 *
	 * @protected
	 * @since 1.26
	 */
	ColumnListItem.prototype.$Popin = function() {
		return this.$("sub");
	};
	
	/**
	 * Determines whether control has pop-in or not.
	 * @protected
	 */
	ColumnListItem.prototype.hasPopin = function() {
		return !!(this._oPopin && this.getTable().hasPopin());
	};
	
	/**
	 * Pemove pop-in from DOM
	 * @protected
	 */
	ColumnListItem.prototype.removePopin = function() {
		this.$Popin().remove();
	};
	
	/**
	 * Returns the tabbable DOM elements as a jQuery collection
	 * When popin is available this separated dom should also be included
	 *
	 * @returns {jQuery} jQuery object
	 * @protected
	 * @since 1.26
	 */
	ColumnListItem.prototype.getTabbables = function() {
		return this.$().add(this.$Popin()).find(":sapTabbable");
	};
	
	// update the aria-selected for the cells
	ColumnListItem.prototype.updateSelectedDOM = function(bSelected, $This) {
		ListItemBase.prototype.updateSelectedDOM.apply(this, arguments);
		$This.children().attr("aria-selected", bSelected);
		
		// update popin as well
		if (this.hasPopin()) {
			this.$Popin().attr("aria-selected", bSelected);
			this.$("subcell").attr("aria-selected", bSelected);
		}
	};

	// informs the table when item's type column requirement is changed
	ColumnListItem.prototype._checkTypeColumn = function(bNeedsTypeColumn) {
		if (bNeedsTypeColumn == undefined) {
			bNeedsTypeColumn = this._needsTypeColumn();
		}

		if (this._bNeedsTypeColumn != bNeedsTypeColumn) {
			this._bNeedsTypeColumn = bNeedsTypeColumn;
			this.informList("TypeColumnChange", bNeedsTypeColumn);
		}
	};
	
	// determines whether type column for this item is necessary or not
	ColumnListItem.prototype._needsTypeColumn = function() {
		var sType = this.getType(),
			mType = sap.m.ListType;

		return	this.getVisible() && (
					sType == mType.Detail ||
					sType == mType.Navigation ||
					sType == mType.DetailAndActive
				);
	};
	
	// Adds cloned header to the local collection
	sap.m.ColumnListItem.prototype._addClonedHeader = function(oHeader) {
		return this._aClonedHeaders.push(oHeader);
	};

	// Destroys cloned headers that are generated for popin
	sap.m.ColumnListItem.prototype._destroyClonedHeaders = function() {
		this._aClonedHeaders.forEach(function(oClone) {
			oClone.destroy(true);
		});

		this._aClonedHeaders = [];
	};
	
	// active feedback for pop-in
	ColumnListItem.prototype._activeHandlingInheritor = function() {
		this._toggleActiveClass(true);
	};
	
	// inactive feedback for pop-in
	ColumnListItem.prototype._inactiveHandlingInheritor = function() {
		this._toggleActiveClass(false);
	};
	
	// toggles the active class of the pop-in.
	ColumnListItem.prototype._toggleActiveClass = function(bSwitch) {
		if (this.hasPopin()) {
			this.$Popin().toggleClass("sapMLIBActive", bSwitch);
		}
	};

	return ColumnListItem;

}, /* bExport= */ true);
