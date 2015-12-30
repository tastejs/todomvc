/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.ux3.DataSetSimpleView.
sap.ui.define(['jquery.sap.global', 'sap/ui/core/Control', 'sap/ui/core/ResizeHandler', './library', 'jquery.sap.script'],
	function(jQuery, Control, ResizeHandler, library/* , jQuerySap */) {
	"use strict";


	
	/**
	 * Constructor for a new DataSetSimpleView.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * DataSetSimpleView provides a simple view example for DataSet usage.
	 * @extends sap.ui.core.Control
	 * @implements sap.ui.ux3.DataSetView
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.ux3.DataSetSimpleView
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var DataSetSimpleView = Control.extend("sap.ui.ux3.DataSetSimpleView", /** @lends sap.ui.ux3.DataSetSimpleView.prototype */ { metadata : {
	
		interfaces : [
			"sap.ui.ux3.DataSetView"
		],
		library : "sap.ui.ux3",
		properties : {
	
			/**
			 * When true the DatSet items are floating containers. When set to false The Items are rendered in a 1 column Layout.
			 */
			floating : {type : "boolean", group : "Misc", defaultValue : true},
	
			/**
			 * Name of the View
			 */
			name : {type : "string", group : "Misc", defaultValue : "Name of this View"},
	
			/**
			 * Icon source for this view
			 */
			icon : {type : "sap.ui.core.URI", group : "Misc", defaultValue : null},
	
			/**
			 * icon: hovered state
			 */
			iconHovered : {type : "sap.ui.core.URI", group : "Misc", defaultValue : null},
	
			/**
			 * icon: selected state
			 */
			iconSelected : {type : "sap.ui.core.URI", group : "Misc", defaultValue : null},
	
			/**
			 * When true and the property floating is true the DatSet items are floating containers filling the whole space of a row.
			 * @since 1.9.2
			 */
			responsive : {type : "boolean", group : "Misc", defaultValue : false},
	
			/**
			 * When itemMinWidth>0 and the property floating is true the given minimum width in pixels is set to DatSet items. A minimum width must be given when the property responsive is set.
			 * @since 1.9.2
			 */
			itemMinWidth : {type : "int", group : "Misc", defaultValue : 0},
	
			/**
			 * If this value is greater zero only this amount of items is loaded in the first place. New items are loaded automatically when the user scrolls down. The number of items which are reloaded can be defined with the property "reloadItemCount"
			 * @since 1.13.0
			 */
			initialItemCount : {type : "int", group : "Appearance", defaultValue : 0},
	
			/**
			 * This number defines the item count which is reloaded on scroll if initialItemCount is enabled.
			 * @since 1.13.0
			 */
			reloadItemCount : {type : "int", group : "Appearance", defaultValue : 0},
	
			/**
			 * ID of the DOM Element or jQuery reference to the dom which holds the scrollbar for the dataset
			 * @since 1.13.0
			 */
			scrollArea : {type : "any", group : "Appearance", defaultValue : null},
	
			/**
			 * If the pagination feature is used without specifying a scroll area, a height for the dataset must be defined.
			 * @since 1.13.0
			 */
			height : {type : "sap.ui.core.CSSSize", group : "Appearance", defaultValue : null}
		},
		aggregations : {
	
			/**
			 * template
			 */
			template : {type : "sap.ui.core.Control", multiple : false}
		}
	}});
	
	
	///**
	// * This file defines behavior for the control,
	// */
	
	/**
	 * Initialization of DataSetSimpleView
	 *
	 * @private
	*/
	DataSetSimpleView.prototype.init = function(){
		this._oDataSet = this.getParent();
		this.items = [];
		this._bRendered = false;
		if (this.getInitialItemCount() > 0 && this.getReloadItemCount() <= 0) {
			this.setReloadItemCount(this.getInitialItemCount());
		}
		this._bUsePagination = false;
	};
	
	DataSetSimpleView.prototype.exit = function() {
		// Cleanup resize event registration on exit
		if (this.sResizeListenerId) {
			ResizeHandler.deregister(this.sResizeListenerId);
			this.sResizeListenerId = null;
		}
	};
	
	/**
	 * Eventhandler for the selection of an Item
	 *
	 * @param {event} oEvent SelectionChanged event
	 * @protected
	 */
	DataSetSimpleView.prototype.handleSelection = function(oEvent) {
		var oDataSet = this.getParent();
		var aItems = oDataSet.getItems(),
			aSelectedItems = oDataSet.getSelectedIndices();
			if (aSelectedItems.length > 1) {
				this._clearTextSelection();
			}
			jQuery.each(aItems, function(index, item){
				if (oDataSet.isSelectedIndex(index)) {
					item.$().addClass("sapUiUx3DSSVSelected");
				} else {
					item.$().removeClass("sapUiUx3DSSVSelected");
				}
			});
	};
	
	
	/**
	 * clears the text selection on the document (disabled for Dnd)
	 * @private
	 */
	DataSetSimpleView.prototype._clearTextSelection = function () {
		if (window.getSelection) {
			if (window.getSelection().empty) {  // Chrome
				window.getSelection().empty();
			} else if (window.getSelection().removeAllRanges) {  // Firefox
				window.getSelection().removeAllRanges();
			}
		} else if (document.selection && document.selection.empty) {  // IE?
			try {
				document.selection.empty();
			} catch (ex) {
				// ignore error to as a workaround for bug in IE8
			}
		}
	};
	
	/**
	 * Check if Item <code>oItem</code> is selected
	 *
	 * @param {sap.ui.ux3.DataSetItem} oItem DataSetItem instance
	 * @protected
	 */
	DataSetSimpleView.prototype.isItemSelected = function(oItem) {
		var iIndex = jQuery.inArray(oItem,this.items);
		if (iIndex == -1) {
			return false;
		}
		return this.getParent().isSelectedIndex(iIndex);
	};
	
	//*** Interface methods ***
	
	/**
	 * View Initialization: Called when selecting the view
	 *
	 * @param {array} aItems Array of DataSetItems added to the parent DataSet
	 * @protected
	 */
	DataSetSimpleView.prototype.initView = function(aItems) {
		this.getParent().attachSelectionChanged(this.handleSelection, this);
		this.items = this.items.concat(aItems);
		for (var i = 0; i < aItems.length; i++) {
			var template = this.getTemplate().clone();
			aItems[i].setAggregation('_template', template, true);
		}
	};
	
	/**
	 * View update: Called when pagination adds items
	 *
	 * @param {sap.ui.ux3.DataSetItem[]} aDiff Array of DataSetItems added to the parent DataSet
	 * @protected
	 */
	DataSetSimpleView.prototype.updateView = function(aDiff) {
		//if view is not rendered no Dom update is necessary
		if (!this.getDomRef()) {
			return;
		}
		var rm = sap.ui.getCore().createRenderManager(),
			iLastLength = this.items.length;
			
		for (var i = 0; i < aDiff.length; i++) {
			var oItem = aDiff[i].item;
			var iIndex = aDiff[i].index;
			
			if (aDiff[i].type === "insert") {
				var template = this.getTemplate().clone();
				oItem.setAggregation('_template', template, true);
				if (i == aDiff.length - 1 && iLastLength == 0) {
					//render all initial items first. The delegate loads all missing to fill the scrollarea
					var oDelegate = {
						/*eslint-disable no-loop-func */
						onAfterRendering: function() {
							this.calculateItemCounts();
							this.getParent().updateItems(sap.ui.model.ChangeReason.Change);
							template.removeDelegate(oDelegate);
						}
						/*eslint-enable no-loop-func */
					};
					template.addDelegate(oDelegate, false, this);
				}
				this.getRenderer().renderItem(rm, this, oItem);
				rm.flush(this.$()[0], false, iIndex);
				this.items.splice(iIndex, 0, oItem);
			} else {
				this.items.splice(iIndex, 1);
				oItem.$().remove();
				oItem.destroy();
			}
		}
		if (aDiff.length > 0 && this.getFloating() && this.getResponsive()) {
			this._computeWidths(true);
		}
		rm.destroy();
	};
	
	/**
	 * View finalization: Called when leaving the view
	 *
	 * @param {sap.ui.ux3.DataSetItem[]} aItems
	 * @protected
	 */
	DataSetSimpleView.prototype.exitView = function(aItems) {
		this.getParent().detachSelectionChanged(this.handleSelection, this);
		for (var i = 0; i < aItems.length; i++) {
			aItems[i].destroyAggregation("_template",true);
		}
		this.items = [];
	};
	
	/**
	 * Set scroll area based on selected view
	 * @private
	 */
	DataSetSimpleView.prototype.initScrollArea = function() {
		var $scrollArea = this.getScrollArea(),
			that = this;
		
		var fnScroll = function(oEvent) {
			that.getParent().updateItems(sap.ui.model.ChangeReason.Change);
		};
		if (typeof $scrollArea === 'string') {
			$scrollArea = jQuery.sap.byId($scrollArea);
		}
		if (!$scrollArea) {
			$scrollArea = this.$();
		} else if ($scrollArea.is('html')) {
			//if scrollarea is 'html' then we use the browser scrollarea
			$scrollArea = jQuery(document);
		}
		
		if (!this._bUsePagination) {
			$scrollArea.off('scroll', fnScroll);
		} else {
			$scrollArea.on('scroll', fnScroll);
		}
	};
	
	DataSetSimpleView.prototype.checkScrollItems = function() {
		if (!this._bRendered) {
			return;
		}
		
		var oBindingInfo = this.getParent().mBindingInfos["items"],
			$scrollArea = this.getScrollArea(),
			oBinding = oBindingInfo.binding,
			oParent = this.getParent(),
			iAppendItems = 0,
			iFillupSpace,
			scrollArea,
			iClientHeight,
			iScrollHeight;
			
		
		if (oParent.getItems().length === oBinding.getLength()) {
			return iAppendItems;
		}
		if (typeof $scrollArea === 'string') {
			$scrollArea = jQuery.sap.byId($scrollArea);
		}
		if (!$scrollArea) {
			$scrollArea = this.$();
		}
		if (!$scrollArea || $scrollArea.length == 0) {
			return iAppendItems;
		}
	
		scrollArea = $scrollArea[0];
		iClientHeight = scrollArea.clientHeight;
		iScrollHeight = scrollArea.scrollHeight;
	
		if ($scrollArea.is('html')) {
			//if scrollarea is 'html' then we use the browser scrollarea
			$scrollArea = jQuery(document);
		}
	
		if (iClientHeight == iScrollHeight) {
			iFillupSpace = iClientHeight + this._iScrollTrigger;
		} else {
			iFillupSpace = iClientHeight + this._iScrollTrigger + $scrollArea.scrollTop();
		}
		
		if (iFillupSpace > 0) {
			var iNewItemCount = Math.floor(iFillupSpace / this._iRowHeight) * this._iItemsPerRow;
			var iCurrentItemCount = oParent.getItems().length;
			iNewItemCount = Math.ceil(iNewItemCount / this._iItemsPerRow) * this._iItemsPerRow;
			iAppendItems = iNewItemCount - iCurrentItemCount;
		}
		
		return iAppendItems;
	};
	
	DataSetSimpleView.prototype.getItemCount = function() {
		if (this._bUsePagination) {
			var iLength = this.getParent().getItems().length,
			iAppendItems = this.checkScrollItems();
			if (iLength == 0) {
				iLength += this.getInitialItemCount();
			} else {
				iLength += iAppendItems;
			}
			//this._iLastLength = iLength;
			return iLength;
		} else {
			return null;
		}
	};
	
	DataSetSimpleView.prototype.setInitialItemCount = function(iValue) {
		this.setProperty("initialItemCount", iValue);
		this._bUsePagination = (iValue != 0);
	};
	
	/**
	 * Called after the control is rendered
	 */
	DataSetSimpleView.prototype.onBeforeRendering = function(){
		// Cleanup resize event registration before re-rendering
		if (this.sResizeListenerId) {
			ResizeHandler.deregister(this.sResizeListenerId);
			this.sResizeListenerId = null;
		}
	};
	
	/**
	 * Called after the control is rendered
	 */
	DataSetSimpleView.prototype.onAfterRendering = function(){
		this._bRendered = true;
		this.initScrollArea();
		if ((this.getFloating() && this.getResponsive()) || this._bUsePagination) {
			this._height = -1;
			this._itemsPerRow = -1;
			this.onresize();
			this.sResizeListenerId = ResizeHandler.register(this.getDomRef(), jQuery.proxy(this.onresize, this));
		}
	};
	
	/**
	 * Called after the control is rendered
	 */
	DataSetSimpleView.prototype.onThemeChanged = function(){
		if (this._bRendered) {
			this.calculateItemCounts();
			this.getParent().updateItems(sap.ui.model.ChangeReason.Change);
		}
	};
	
	/**
	 * Function is called when window is resized
	 *
	 * @param {jQuery.Event} oEvent
	 * @private
	 */
	DataSetSimpleView.prototype.onresize = function() {
	
		if (!this.getDomRef()) {
			// slider is not rendered, maybe deleted from DOM -> deregister resize handler and do nothing
			// Cleanup resize event registration on exit
			if (this.sResizeListenerId) {
				ResizeHandler.deregister(this.sResizeListenerId);
				this.sResizeListenerId = null;
			}
			return;
		}
	
		if (this.getFloating() && this.getResponsive()) {
			this._computeWidths();
		}
		if (this._bUsePagination && this.items.length > 0) {
			this.calculateItemCounts();
			this.getParent().updateItems(sap.ui.model.ChangeReason.Change);
		}
	};
	
	DataSetSimpleView.prototype.setTemplate = function(oTemplate) {
		this.setAggregation("template", oTemplate, true);
		//Here we need to rerender all items because of a new layout
		if (this.getParent()) {
			this.getParent().updateItems();
		}
	};
	
	/**
	 * Calculate Item count
	 * @private
	 */
	DataSetSimpleView.prototype.calculateItemCounts = function(){
		if (this.getDomRef()) {
			var $itemArea = this.$(),
				$firstItem = $itemArea.children().first();
			
			this._iItemsPerRow = Math.floor($itemArea.outerWidth(true) / $firstItem.outerWidth(true));
			this._iNewRows = Math.ceil(this.getReloadItemCount() / this._iItemsPerRow);
			this._iNewItems = this._iItemsPerRow * this._iNewRows;
			this._iRowHeight = $firstItem.outerHeight(true);
			this._iScrollTrigger = this._iNewRows * this._iRowHeight;
		}
	};
	
	DataSetSimpleView.prototype._computeWidths = function(bInitial){
		var $This = this.$();
		var iItemsPerRow = Math.floor($This.width() / this.getItemMinWidth());
		var width = Math.floor(100 / iItemsPerRow);
		if ($This.width() * width / 100 < this.getItemMinWidth()) {
			iItemsPerRow--;
			width = Math.floor(100 / iItemsPerRow);
		}
		
		if (bInitial || this._height != $This.height() || this._itemsPerRow != iItemsPerRow) {
			var count = -1;
			var aItems = this.getParent().getItems();
			var diff, w;
			
			for (var j = 0; j < aItems.length; j++) {
				if (count == -1 || count + 1 > iItemsPerRow) {
					count = 0;
					diff = 100 - (iItemsPerRow * width);
				}
				
				var w = width;
				if (diff > 0) {
					w++;
					diff--;
				}
				aItems[j].$().css("width", w + "%");
				count++;
			}
			
			this._height = $This.height();
			this._itemsPerRow = iItemsPerRow;
		}
	};
	
	/**
	 * @param {any[]} aScrollArea
	 * @param {boolean} bSupress
	 * @public
	 */
	DataSetSimpleView.prototype.setScrollArea = function(aScrollArea, bSupress) {
		if (typeof aScrollArea !== 'string' && !(aScrollArea instanceof jQuery)) {
			jQuery.sap.log.error('You can only pass a string (ID of scroll area DOM) or an jQuery object as scrollarea');
		}
		this.setProperty('scrollArea', aScrollArea, bSupress);
	};
	

	return DataSetSimpleView;

}, /* bExport= */ true);
