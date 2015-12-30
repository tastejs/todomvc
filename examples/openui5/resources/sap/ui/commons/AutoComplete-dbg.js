/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.commons.AutoComplete.
sap.ui.define(['jquery.sap.global', './ComboBox', './library', 'jquery.sap.strings'],
	function(jQuery, ComboBox, library/* , jQuerySap */) {
	"use strict";



	/**
	 * Constructor for a new AutoComplete.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 *
	 * Textfield with list based text completion.
	 * @extends sap.ui.commons.ComboBox
	 * @implements sap.ui.commons.ToolbarItem
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @since 1.10.0
	 * @alias sap.ui.commons.AutoComplete
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var AutoComplete = ComboBox.extend("sap.ui.commons.AutoComplete", /** @lends sap.ui.commons.AutoComplete.prototype */ { metadata : {

		interfaces : [
			"sap.ui.commons.ToolbarItem"
		],
		library : "sap.ui.commons",
		properties : {

			/**
			 * Determines whether scrolling should be enabled when the number of items is higher than maxPopupItems.
			 * If set to false only the first n items (n=maxPopupItems) are shown.
			 */
			enableScrolling : {type : "boolean", group : "Misc", defaultValue : true}
		},
		events : {

			/**
			 * Fired when the user has changed the value and a suggestion list update should occur.
			 */
			suggest : {
				parameters : {

					/**
					 * The current value which was typed in.
					 */
					suggestValue : {type : "string"}
				}
			}
		}
	}});


	AutoComplete._DEFAULTFILTER = function(sValue, oItem){
		if (this._skipFilter) { //Easy (currently internal) way to skip auto filtering
			return true;
		}
		return jQuery.sap.startsWithIgnoreCase(oItem.getText(), sValue);
	};

	AutoComplete.prototype.init = function(){
		ComboBox.prototype.init.apply(this, arguments);
		this.mobile = false;
		this._filter = AutoComplete._DEFAULTFILTER;
	};

	AutoComplete.prototype.exit = function() {
		if (this._oListBox) {
			this._oListBox.removeAllItems();
		}
		ComboBox.prototype.exit.apply(this, arguments);
	};

	/**
	 * Sets a custom filter function for items. Default is to check whether the item text begins with the typed value.
	 *
	 * Example:
	 * <code>
	 * function(sValue, oItem){
	 *	  return jQuery.sap.startsWithIgnoreCase(oItem.getText(), sValue);
	 * }
	 * </code>
	 *
	 * @param {function} [fFilter] The filter function. If not set the default filter function will be used.
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	AutoComplete.prototype.setFilterFunction = function(fFilter) {
		if (typeof (fFilter) == "function") {
			this._filter = fFilter;
		} else {
			this._filter = AutoComplete._DEFAULTFILTER;
		}
	};


	AutoComplete.prototype.onkeypress = function(oEvent) {
		var iKC = oEvent.which || oEvent.keyCode;
		if (iKC === jQuery.sap.KeyCodes.ESCAPE) {
			sap.ui.commons.TextField.prototype.onkeypress.apply(this, arguments);
			jQuery(this.getInputDomRef()).removeAttr("aria-posinset");
		}
	};

	AutoComplete.prototype.onfocusin = function(oEvent) {

		if (!this.$().hasClass("sapUiTfFoc")) {
			// if already focused do not execute again. (e.g. while changing suggestion list)
			ComboBox.prototype.onfocusin.apply(this, arguments);
		}

	};

	(function(){

	function getAriaDescribedBy(oAuto, bIncludeInfo){
		var aDescBy = oAuto.getAriaDescribedBy();
		var sDescBy = "";
		for (var i = 0; i < aDescBy.length; i++) {
			sDescBy += aDescBy[i];
			if (i < aDescBy.length - 1) {
				sDescBy += " ";
			}
		}

		if (bIncludeInfo) {
			sDescBy += " " + oAuto.getId() + "-ariaLbl";
		}

		return sDescBy;
	}

	function updateOnClose(oAuto){
		var $input = jQuery(oAuto.getInputDomRef());
		var sDescBy = getAriaDescribedBy(oAuto, false);

		if (sDescBy.length > 0) {
			$input.attr("aria-describedby", sDescBy);
		} else {
			$input.removeAttr("aria-describedby");
		}

		//No posinset and setsize set when popup closed
		$input.removeAttr("aria-posinset");
		$input.removeAttr("aria-setsize");
	}


	AutoComplete.prototype._close = function(){
		updateOnClose(this);
		ComboBox.prototype._close.apply(this, arguments);
	};


	AutoComplete.prototype._handleClosed = function(){
		updateOnClose(this);
		ComboBox.prototype._handleClosed.apply(this, arguments);
	};


	AutoComplete.prototype.onAfterRendering = function(){
		ComboBox.prototype.onAfterRendering.apply(this, arguments);
		jQuery(this.getInputDomRef()).removeAttr("aria-setsize"); // No initial setsize
	};


	AutoComplete.prototype._prepareOpen = function(oListBox) {
		var $input = jQuery(this.getInputDomRef());
		var sDescBy = getAriaDescribedBy(this, true);

		$input.attr("aria-describedby", sDescBy);
		$input.removeAttr("aria-posinset"); //No posinset set when popup opens
	};


	AutoComplete.prototype._fireLiveChange = function(oEvent) {
		var bFireSuggest = false;
		var iKC;
		if (!this.getEnabled() || !this.getEditable()) {
			this._close();
		} else {
			this._sTypedChars = jQuery(this.getInputDomRef()).val();
			switch (oEvent.type) {
				case "keyup":
				case "sapup":
				case "sapdown":
				case "saphome":
				case "sapend":
					if (!ComboBox._isHotKey(oEvent)) {
						bFireSuggest = true;
						// and fall through below
					} else {
						break;
					}
					// falls through
				case "sapescape":
					this._close();
					break;
				case "keypress":
					// in Firefox escape is handled on keypress
					iKC = oEvent.which || oEvent.keyCode;
					if (iKC === jQuery.sap.KeyCodes.ESCAPE) {
						this._close();
						break;
					}
				// falls through
				default:
					refreshListBoxItems(this);
					bFireSuggest = true;
			}
		}

		if (bFireSuggest) {
			this.fireSuggest({suggestValue: this._sTypedChars});
		}

		ComboBox.prototype._fireLiveChange.apply(this, arguments);
	};


	AutoComplete.prototype._doTypeAhead = function(){
		this._sTypeAhead = null;
		this._sWantedSelectedKey = undefined;
		this._sWantedSelectedItemId = undefined;
		this._sTypedChars = jQuery(this.getInputDomRef()).val();

		refreshListBoxItems(this);
	};


	AutoComplete.prototype.refreshItems = function(sReason){
		var oBinding = this.getBinding("items");
		if (sReason == "filter" && oBinding) {
			oBinding.getContexts(); //Avoid update of aggregation when filter not yet applied (filter request triggered by this call)
		} else {
			AutoComplete.prototype.updateItems.apply(this, arguments);
		}
	};

	//see sap.ui.commons.ComboBox.prototype._handleItemsChanged
	AutoComplete.prototype._handleItemsChanged = function(oEvent, bDelayed){

		if (bDelayed) {
			// Items are updated by binding. As items can be "reused" and have same IDSs,
			// only one check at the end of all changes is needed
			// only clear if really from an delayed call
			this._sHandleItemsChanged = null;
			this._bNoItemCheck = undefined;
		}

		if (this._bNoItemCheck) {
			return;
		}

		var aItems = [];
		if (this._getExistingListBox()) {
			aItems = this._getListBox().getItems();
		}

		var oDomRef = this.getDomRef();
		if ( oDomRef) {
			jQuery(this.getInputDomRef()).attr("aria-setsize", aItems.length);
		}
	};


	AutoComplete.prototype.getItems = function(){
		return this.getAggregation("items", []);
	};
	AutoComplete.prototype.insertItem = function(oItem, iIndex){
		this.insertAggregation("items", iIndex, oItem, true);
		refreshListBoxItems(this);
		return this;
	};
	AutoComplete.prototype.addItem = function(oItem){
		this.addAggregation("items", oItem, true);
		refreshListBoxItems(this);
		return this;
	};
	AutoComplete.prototype.removeItem = function(oItem) {
		var res = this.removeAggregation("items", oItem, true);
		refreshListBoxItems(this);
		return res;
	};
	AutoComplete.prototype.removeAllItems = function() {
		var res = this.removeAllAggregation("items");
		refreshListBoxItems(this);
		return res;
	};
	AutoComplete.prototype.indexOfItem = function(oItem){
		return this.indexOfAggregation("items", oItem);
	};
	AutoComplete.prototype.destroyItems = function(){
		this.destroyAggregation("items", true);
		refreshListBoxItems(this);
		return this;
	};

	AutoComplete.prototype.setEnableScrolling = function(bEnableScrolling){
		this.setProperty("enableScrolling", bEnableScrolling, true);
		if (this.oPopup && this.oPopup.isOpen()) {
			refreshListBoxItems(this);
		}
		return this;
	};

	function refreshListBoxItems(oAuto){
		if (!oAuto.getDomRef() || !oAuto.$().hasClass("sapUiTfFoc")) { //Nothing to do if not rendered or the TF does not have the focus
			return false;
		}

		var oItem,
			aItems = oAuto.getItems(),
			bFilter = oAuto._sTypedChars && oAuto._sTypedChars.length > 0,
			oLB = oAuto._getListBox(),
			iMaxPopupItems = oAuto.getMaxPopupItems(),
			bScroll = oAuto.getEnableScrolling(),
			aHitItems = [];

		if (!bFilter) {
			oAuto._close();
			return;
		}

		oLB.removeAllItems();
		oLB.clearSelection();

		for (var i = 0; i < aItems.length; i++) {
			oItem = aItems[i];
			if (!oItem.__CLONE) {
				oItem.__CLONE = oItem.clone(oItem.getId() + "-CLONE", null, {cloneBindings: false});
				oItem.__origexit = oItem.exit;
				/*eslint-disable no-loop-func */
				oItem.exit = function(){
					this.__CLONE.destroy();
					delete this.__CLONE;
					this.exit = this.__origexit;
					delete this.__origexit;
					// apply restored exit if a function
					if ( typeof this.exit === "function" ) {
						this.exit.apply(this, arguments);
					}
				};
				/*eslint-enable no-loop-func */
			}

			if ((!bFilter || oAuto._filter(oAuto._sTypedChars, oItem)) && (bScroll || (!bScroll && aHitItems.length < iMaxPopupItems))) {
				aHitItems.push(oItem.__CLONE);
			}
		}

		var iItemsLength = aHitItems.length;

		if (iItemsLength > 0) {

			if (oAuto._sort) {
				aHitItems.sort(function(oItem1, oItem2){
					if (oItem1.getText() > oItem2.getText()) {
						return 1;
					}
					if (oItem1.getText() < oItem2.getText()) {
						return -1;
					}
					return 0;
				});
			}

			for (var i = 0; i < iItemsLength; i++) {
				oLB.addItem(aHitItems[i]);
			}

			oLB.setVisibleItems(iMaxPopupItems < iItemsLength ? iMaxPopupItems : iItemsLength);

			if (!oAuto.oPopup || !oAuto.oPopup.isOpen()) {
				oAuto._open();
			}
		} else {
			oAuto._close();
		}
	}

	})();


	/**
	 * @deprecated NOT SUPPORTED
	 * @public
	 * @name sap.ui.commons.AutoComplete#getListBox
	 * @function
	 */


	/**
	 * @deprecated NOT SUPPORTED
	 * @public
	 */
	AutoComplete.prototype.setListBox = function(){
		return this;
	};


	/**
	 * @deprecated NOT SUPPORTED
	 * @public
	 * @name sap.ui.commons.AutoComplete#getSelectedKey
	 * @function
	 */


	/**
	 * @deprecated NOT SUPPORTED
	 * @public
	 */
	AutoComplete.prototype.setSelectedKey = function(){
		return this;
	};


	/**
	 * @deprecated NOT SUPPORTED
	 * @public
	 * @name sap.ui.commons.AutoComplete#getSelectedItemId
	 * @function
	 */


	/**
	 * @deprecated NOT SUPPORTED
	 * @public
	 */
	AutoComplete.prototype.setSelectedItemId = function(){
		return this;
	};

	return AutoComplete;

}, /* bExport= */ true);
