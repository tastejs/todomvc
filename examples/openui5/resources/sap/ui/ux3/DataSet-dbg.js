/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.ux3.DataSet.
sap.ui.define(['jquery.sap.global', 'sap/ui/core/Control', 'sap/ui/core/ResizeHandler', './library'],
	function(jQuery, Control, ResizeHandler, library) {
	"use strict";



	/**
	 * Constructor for a new DataSet.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * DataSet
	 * @extends sap.ui.core.Control
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.ux3.DataSet
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var DataSet = Control.extend("sap.ui.ux3.DataSet", /** @lends sap.ui.ux3.DataSet.prototype */ { metadata : {

		library : "sap.ui.ux3",
		properties : {

			/**
			 * show Toolbar
			 */
			showToolbar : {type : "boolean", group : "Misc", defaultValue : true},

			/**
			 * show filter
			 */
			showFilter : {type : "boolean", group : "Misc", defaultValue : true},

			/**
			 * Show/hide SearchField in Toolbar
			 */
			showSearchField : {type : "boolean", group : "Misc", defaultValue : true},

			/**
			 * Selection mode of the DataSet
			 */
			multiSelect : {type : "boolean", group : "Behavior", defaultValue : false}
		},
		aggregations : {

			/**
			 * Aggregation of DataSetItems
			 */
			items : {type : "sap.ui.ux3.DataSetItem", multiple : true, singularName : "item", bindable : "bindable"},

			/**
			 * views
			 */
			views : {type : "sap.ui.ux3.DataSetView", multiple : true, singularName : "view"},

			/**
			 * Filter control (e.g. a FacetFilter) for the DataSet
			 */
			filter : {type : "sap.ui.core.Control", multiple : true, singularName : "filter"},

			/**
			 * Internally managed by Dataset
			 */
			_viewSwitches : {type : "sap.ui.core.Control", multiple : true, singularName : "_viewSwitch", visibility : "hidden"},

			/**
			 * A Toolbar, internally managed by Dataset
			 */
			_toolbar : {type : "sap.ui.commons.Toolbar", multiple : false, visibility : "hidden"}
		},
		associations : {

			/**
			 * Selected view of the Dataset
			 */
			selectedView : {type : "sap.ui.ux3.DataSetView", multiple : false}
		},
		events : {

			/**
			 * selection Changed
			 */
			selectionChanged : {
				parameters : {

					/**
					 * Old lead selected index
					 */
					oldLeadSelectedIndex : {type : "int"},

					/**
					 * New lead selected index
					 */
					newLeadSelectedIndex : {type : "int"}
				}
			},

			/**
			 * Event which is fired when the user triggers a search
			 */
			search : {
				parameters : {

					/**
					 * The search query
					 */
					query : {type : "string"}
				}
			}
		}
	}});


	DataSet.prototype.init = function() {
		var that = this, oToolbar;
		//each DS needs a selectionModel for its items
		jQuery.sap.require("sap.ui.model.SelectionModel");
		this.selectionModel = new sap.ui.model.SelectionModel(sap.ui.model.SelectionModel.SINGLE_SELECTION);
		// init toolbar
		this._oSegBut = new sap.ui.commons.SegmentedButton();
		this._oSegBut.attachSelect(function(oEvent){that.press(oEvent);}, that);
		this._oSegBut.show = false;
		this._oSearchField = new sap.ui.commons.SearchField(this.getId() + "-searchValue");
		this._oSearchField.setShowListExpander(false);
		this._oSearchField.setEnableListSuggest(false);
		this._oSearchField.setEnableFilterMode(true);
		this._oSearchField.setEnableClear(true);
		this._oSearchField.show = false;
		that = this;
		this._oSearchField.attachSearch(function(oEvent) {
			that.fireSearch(oEvent.getParameters());
		});
		this.selectionModel.attachSelectionChanged(function(oEvent){
			var oldSelectedIndex, newSelectedIndex;
			var mParameters = oEvent.getParameters();
			if (mParameters) {
				newSelectedIndex = mParameters.leadIndex;
				oldSelectedIndex = mParameters.oldIndex;
			}
			that.fireSelectionChanged({
				oldLeadSelectedIndex: oldSelectedIndex,
				newLeadSelectedIndex: newSelectedIndex
			});
			jQuery.sap.log.debug("Selection Change fired");
		});
		oToolbar = new sap.ui.commons.Toolbar();
		this._setToolbar(oToolbar);
		this._iShiftStart = null;
	};

	DataSet.prototype.exit = function() {
		this._oSegBut.destroy();
		this._oSearchField.destroy();
		this.destroyAggregation("_toolbar");
	};

	DataSet.prototype._prepareToolbar = function() {
		var iViewCount = this.getViews().length,
			oToolbar = this._getToolbar();

		if (iViewCount > 1 && this._oSegBut.show == false) {
			oToolbar.insertItem(this._oSegBut,0);
				this._oSegBut.show = true;
		} else if (iViewCount <= 1 && this._oSegBut.show) {
			oToolbar.removeItem(this._oSegBut);
			this._oSegBut.show = false;
		}
		if (this.getShowSearchField() && this._oSearchField.show == false) {
			oToolbar.insertRightItem(this._oSearchField,oToolbar.getRightItems().length);
			this._oSearchField.show = true;
		} else if (!this.getShowSearchField() && this._oSearchField.show == true) {
			oToolbar.removeRightItem(this._oSearchField);
			this._oSearchField.show = false;
		}
	};

	/**
	 * Press handler for the view selection buttons
	 *
	 * @param {sap.ui.base.Event} oEvent Press event
	 * @private
	*/
	DataSet.prototype.press = function(oEvent,iSelectedViewIndex) {
		var oButtonID = oEvent.getParameters().selectedButtonId,
			viewId = oButtonID.substring(oButtonID.lastIndexOf('-') + 1),
			oldView = sap.ui.getCore().byId(this.getSelectedView());
		oldView.exitView(this.getItems());
		this.setSelectedView(viewId);
	};

	/**
	 * Fire filter event
	 *
	 * @private
	*/
	DataSet.prototype.filter = function() {
		this.fireFilter({
						filterValue : this.getFilterValue()
					});
	};
	/**
	 * Fire sort event
	 *
	 * @private
	*/
	DataSet.prototype.sort = function() {
		this.fireSort();
	};

	/**
	 * adds selection interval to array of selected items.
	 *
	 * @private
	 */
	DataSet.prototype.addSelectionInterval = function(iIndexFrom, iIndexTo) {
		this.selectionModel.addSelectionInterval(iIndexFrom, iIndexTo);
		return this;
	};

	/**
	 * sets selection interval to array of selected items.
	 *
	 * @private
	 */
	DataSet.prototype.setSelectionInterval = function(iIndexFrom, iIndexTo) {
		this.selectionModel.setSelectionInterval(iIndexFrom, iIndexTo);
		return this;
	};
	/**
	 * removes selection interval from array of selected items
	 *
	 * @private
	 */
	DataSet.prototype.removeSelectionInterval = function(iIndexFrom, iIndexTo) {
		this.selectionModel.removeSelectionInterval(iIndexFrom, iIndexTo);
		return this;
	};

	/** use this function to retrieve the lead selected index
	 *
	 * @public
	 */
	DataSet.prototype.getSelectedIndex = function() {
			return this.selectionModel.getLeadSelectedIndex();
	};

	/** use this function to retrieve all selected indices if multiple select is enabled
	 *
	 * @public
	 */
	DataSet.prototype.getSelectedIndices = function(){
		return this.selectionModel.getSelectedIndices() || [];
	};

	/** clears dataset from all previous selections
	 *
	 * @public
	 */
	DataSet.prototype.clearSelection = function() {
		this.selectionModel.clearSelection();
		return this;
	};

	/**
	 * Selection handler for the DataSetItem selection event.
	 *
	 * @param {string} sItemId Id of the selected DataSetItem
	 * @private
	*/
	DataSet.prototype.selectItem = function(oEvent) {
		var oParams = oEvent.getParameters(),
			sItemId = oEvent.getParameters().itemId,
			oItem = sap.ui.getCore().byId(sItemId),
			aItems = this.getItems(),
			iIndex = jQuery.inArray(oItem,aItems),
			oldSelectedIndex = this.getLeadSelection();

		if (!this.getMultiSelect()) {
			if (oldSelectedIndex == iIndex && !oParams.shift) {
				this.setLeadSelection( -1);
			} else {
				this.setLeadSelection(iIndex);
			}
			this._iShiftStart = null;
		} else {
			if (oParams.ctrl) {
				if (!this.isSelectedIndex(iIndex)) {
					this.addSelectionInterval(iIndex, iIndex);
				} else {
					this.removeSelectionInterval(iIndex, iIndex);
				}
				if (this._iShiftStart >= 0) {
					this._iShiftStart = iIndex;
				}
			}

			if (oParams.shift) {
				if (!this._iShiftStart && this._iShiftStart !== 0) {
					this._iShiftStart = oldSelectedIndex;
				}
				if (this._iShiftStart >= 0 && oParams.ctrl) {
					this.addSelectionInterval(this._iShiftStart, iIndex);
				} else if (this._iShiftStart >= 0 & !oParams.ctrl) {
					this.setSelectionInterval(this._iShiftStart, iIndex);
				} else {
					this.setLeadSelection(iIndex);
					this._iShiftStart = iIndex;
				}
			}

			if (!oParams.shift && !oParams.ctrl) {
				if (oldSelectedIndex == iIndex && iIndex != this._iShiftStart) {
					this.setLeadSelection( -1);
				} else {
					this.setLeadSelection(iIndex);
				}
				this._iShiftStart = null;
			}
		}
	};

	/**
	 * Prepare rendering: Calls init end exit hooks on the selected view instance. Necessary to keep the view
	 * consistent to the DataSet state.
	 *
	 * @param {string} sItemId Id of the selected DataSetItem
	 * @private
	*/
	DataSet.prototype.prepareRendering = function() {
		var oView, iViewCount = this.getViews().length;
		if (iViewCount == 0) {
			return;
		}
		this._prepareToolbar();
		if (this._bDirty) {
			oView = sap.ui.getCore().byId(this.getSelectedView());
			if (oView.exitView) {
				oView.exitView(this.getItems());
			}
			if (oView.initView) {
				oView.initView(this.getItems());
			}
			this._bDirty = false;
		}
	};

	//*** Selection Model methods ***

	/**
	 * Returns the LeadSelection index
	 *
	 * @param {string} sItemId Id of the selected DataSetItem
	 * @return {int} selected index
	 * @protected
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	DataSet.prototype.getLeadSelection = function() {
		return this.selectionModel.getLeadSelectedIndex();
	};

	/**
	 * Set the LeadSelection index
	 *
	 * @param {int} iIIndex set LeadSelection index
	 * @type void
	 * @protected
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	DataSet.prototype.setLeadSelection = function(iIndex) {
		this.selectionModel.setLeadSelectedIndex(iIndex);
	};

	/**
	 * Returns true if iIndex is selected
	 *
	 * @param {int} iIndex index of selection
	 * @return {boolean} index selected true/false
	 * @protected
	*/
	DataSet.prototype.isSelectedIndex = function(iIndex) {
		return (this.selectionModel.isSelectedIndex(iIndex));
	};

	/**
	 * Returns id of selected Item from given index
	 *
	 * @param {int} iIndex index of selection
	 * @return {string} id of selected item
	 * @protected
	*/
	DataSet.prototype.getSelectedItemId = function(iIndex) {
		 return this.getItems()[iIndex].getId();
	};

	/**
	 * Creates a view switch button
	 *
	 * @param {object} oView View
	 * @param {int} iIndex Index of view
	 * @return {object} viewSwitch instance
	 * @protected
	*/
	DataSet.prototype.createViewSwitch = function(oView, iIndex) {
		 var oViewSwitch;

		 if (oView.getIcon()) {
			 oViewSwitch = new sap.ui.commons.Button({
				 id : this.getId() + "-view-" + oView.getId(),
				 lite: true,
				 icon:oView.getIcon(),
				 iconHovered: oView.getIconHovered(),
				 iconSelected: oView.getIconSelected()
			 });
		 } else if (oView.getName()) {
			 oViewSwitch = new sap.ui.commons.Button({
				 id : this.getId() + "-view-" + oView.getId(),
				 text : oView.getName(),
				 lite: true
			 });
		 } else {
			 oViewSwitch = new sap.ui.commons.Button({
				 id : this.getId() + "-view-" + oView.getId(),
				 text : oView.getId(),
				 lite: true
			 });
		 }
		 oViewSwitch._viewIndex = iIndex;
		 //oViewSwitch.attachPress(function(oEvent){that.press(oEvent,iIndex);}, that);
		 return oViewSwitch;
	};

	/**
	 * Rerendering of the Toolbar
	 *
	 * @protected
	*/
	DataSet.prototype._rerenderToolbar = function() {
		var $content = this.$("toolbar");
		this._prepareToolbar();
		if ($content.length > 0) {
			var rm = sap.ui.getCore().createRenderManager();
			sap.ui.ux3.DataSetRenderer.renderToolbar(rm, this);
			rm.flush($content[0]);
			rm.destroy();
		}
	};
	/**
	 * Rerendering of the FilterArea
	 *
	 * @protected
	*/
	DataSet.prototype._rerenderFilter = function() {
		var $content = this.$("filter");
		if ($content.length > 0) {
			var rm = sap.ui.getCore().createRenderManager();
			sap.ui.ux3.DataSetRenderer.renderFilterArea(rm, this);
			rm.flush($content[0]);
			if (this.getShowFilter()) {
				$content.removeClass("noPadding");
			} else {
				$content.addClass("noPadding");
			}
			rm.destroy();
		}
	};

	//*** override API methods ***

	/**
	 * setter for multi selection mode
	 * @param {boolean}
	 *            bMode true for multi mode, false for single mode
	 * @public
	 */
	DataSet.prototype.setMultiSelect = function(bMode) {
		this.clearSelection();
		if (!bMode) {
			this.setProperty("multiSelect", false);
			if (!!this.selectionModel) {
				this.selectionModel.setSelectionMode(sap.ui.model.SelectionModel.SINGLE_SELECTION);
			}
		} else {
			this.setProperty("multiSelect", true);
			if (!!this.selectionModel) {
				this.selectionModel.setSelectionMode(sap.ui.model.SelectionModel.MULTI_SELECTION);
			}
		}
		return this;
	};

	DataSet.prototype.removeItem = function(oItem) {
		var result = this.removeAggregation("items", oItem, true);
		if (result) {
			result.detachSelected(this.selectItem,this);
			result.destroyAggregation("_template",true);
			this._bDirty = true;
		}
		return result;
	};

	DataSet.prototype.removeAllItems = function() {
		var aItems = this.getItems(), result;
		jQuery.each(aItems,function(i,oItem) {
			oItem.destroyAggregation("_template",true);
			oItem.detachSelected(this.selectItem,this);
		});
		result = this.removeAllAggregation("items");
		this._bDirty = true;
		return result;
	};

	DataSet.prototype.destroyItems = function() {
		var result = this.destroyAggregation("items");
		this._bDirty = true;
		return result;
	};

	DataSet.prototype.addItem = function(oItem) {
		this.addAggregation("items", oItem, true);
		oItem.attachSelected(this.selectItem,this);
		this._bDirty = true;
		return this;
	};

	DataSet.prototype.insertItem = function(oItem, iIndex) {
		this.insertAggregation("items", oItem, iIndex, true);
		oItem.attachSelected(this.selectItem,this);
		this._bDirty = true;
		return this;
	};

	DataSet.prototype.setFilterValue = function(sFilterValue) {
		this.setProperty("filterValue",sFilterValue, true);
		return this;
	};

	DataSet.prototype.getFilterValue = function() {
		return this.getProperty("filterValue");
	};

	DataSet.prototype.insertView = function(oView, iIndex) {
		var oViewSwitch = this.createViewSwitch(oView,iIndex,true);
		if (!this.getSelectedView()) {
			this.setSelectedView(oView);
		}
		this.insertAggregation("views", oView, iIndex);
		this._oSegBut.insertButton(oViewSwitch,iIndex);
		this._rerenderToolbar();
		return this;
	};

	DataSet.prototype.addView = function(oView) {
		var iIndex = this.getViews().length,
			oViewSwitch = this.createViewSwitch(oView,iIndex);
		if (!this.getSelectedView()) {
			this.setSelectedView(oView);
		}
		this.addAggregation("views", oView, true);
		this._oSegBut.addButton(oViewSwitch);
		this._rerenderToolbar();
		return this;
	};

	DataSet.prototype.removeView = function(oView) {
		var result = this.removeAggregation("views", oView, true);

		if (result) {
			if (this.getSelectedView() == result.getId()) {
				this.setSelectedView(this.getViews()[0]);
				this._bDirty = true;
				result.invalidate();
			} else {
				this._rerenderToolbar();
			}

			this._oSegBut.removeButton(this.getId() + "-view-" + result.getId()).destroy();
		}
		return result;
	};

	DataSet.prototype.destroyViews = function() {
		this._oSegBut.destroyButtons();
		this.destroyAggregation("views");
		return this;
	};

	DataSet.prototype.removeAllViews = function() {
		var result = this.removeAllAggregation("views");
		this._oSegBut.destroyButtons();
		return result;
	};

	DataSet.prototype.setEnableSorting = function(bEnableSorting) {
		//suppress rerendering ofDataSet. Rerender only the toolbar.
		this.setProperty("enableSorting", bEnableSorting, true);
		this._rerenderToolbar();
		return this;
	};

	DataSet.prototype.setEnableFiltering = function(bEnableFiltering) {
		//suppress rerendering ofDataSet. Rerender only the toolbar.
		this.setProperty("enableFiltering", bEnableFiltering, true);
		this._rerenderToolbar();
		return this;
	};

	DataSet.prototype.setSelectedView = function(vView) {
		var oldSelectedView = this.getSelectedView();

		this.setAssociation("selectedView", vView);
		if (oldSelectedView != this.getSelectedView()) {
			this._bDirty = true;
		}
		if (this.getId() + "-view-" + this.getSelectedView() !== this._oSegBut.getSelectedButton()) {
			this._oSegBut.setSelectedButton(this.getId() + "-view-" + this.getSelectedView());
		}
		return this;
	};


	/**
	 * add a toolbarItem to the toolbar
	 *
	 * @param {sap.ui.commons.ToolbarItem} oOToolbarItem
	 *         ToolbarItem
	 * @type void
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	DataSet.prototype.addToolbarItem = function(oToolbarItem) {
		this._getToolbar().addItem(oToolbarItem);
		this._rerenderToolbar();
	};


	/**
	 * remove a toolbarItem to the toolbar
	 *
	 * @param {sap.ui.commons.ToolbarItem} oOToolbarItem
	 * @type void
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	DataSet.prototype.removeToolbarItem = function(oToolbarItem) {
		this._getToolbar().removeItem(oToolbarItem);
		this._rerenderToolbar();
	};

	DataSet.prototype.setShowToolbar = function(bShow) {
		this.setProperty("showToolbar",bShow, true);
		this._rerenderToolbar();
	};

	DataSet.prototype.setShowFilter = function(bShow) {
		this.setProperty("showFilter",bShow, true);
		this._rerenderFilter();
	};

	DataSet.prototype.setShowSearchField = function(bShow) {
		this.setProperty("showSearchField",bShow, true);
		this._rerenderToolbar();
	};
	/**
	* @private
	*/
	DataSet.prototype._setToolbar = function(oToolbar) {
		this.setAggregation("_toolbar",oToolbar,true);
		this._rerenderToolbar();
	};
	/**
	* @private
	*/
	DataSet.prototype._getToolbar = function() {
		return this.getAggregation("_toolbar");
	};

	DataSet.prototype.refreshItems = function() {
		var	oBinding = this.getBinding("items"),
			oSelectedView = sap.ui.getCore().byId(this.getSelectedView());

		oBinding.bUseExtendedChangeDetection = true;

		if (oSelectedView && oSelectedView.getItemCount && oSelectedView.getItemCount()) {
			var iItemCount = Math.max(oSelectedView.getItemCount(),this.getItems().length);
			if (iItemCount) {
				oBinding.getContexts(0, iItemCount);
			} else {
				oBinding.getContexts();
			}
		} else {
			oBinding.getContexts();
		}
	};

	DataSet.prototype.updateItems = function(sChangeReason) {
		var oBindingInfo = this.mBindingInfos["items"],
			oAggregationInfo = this.getMetadata().getAggregation("items"),
			oSelectedView = sap.ui.getCore().byId(this.getSelectedView()),
			oBinding = oBindingInfo.binding,
			fnFactory = oBindingInfo.factory,
			oClone,
			aItems,
			oItem,
			iIndex,
			that = this,
			aContexts = [];

		oBinding.bUseExtendedChangeDetection = true;

		if (oSelectedView && oSelectedView.getItemCount && oSelectedView.getItemCount()) {
			var iItemCount = Math.max(oSelectedView.getItemCount(),this.getItems().length);
			if (iItemCount) {
				aContexts = oBinding.getContexts(0, iItemCount);
			} else {
				aContexts = oBinding.getContexts();
			}
		} else {
			aContexts = oBinding.getContexts();
		}

		if (aContexts.diff && sChangeReason) {
			var aDiff = aContexts.diff;
			for (var i = 0; i < aDiff.length; i++) {
				aItems = this.getItems();
				iIndex = aDiff[i].index;
				if (aDiff[i].type === "delete") {
					oItem = aItems[iIndex];
					aDiff[i].item = oItem;
					this.removeItem(oItem);
				} else if (aContexts.diff[i].type === "insert") {
					oItem = fnFactory("", aContexts[iIndex]);
					oItem.setBindingContext(aContexts[iIndex], oBindingInfo.model);
					aDiff[i].item = oItem;
					this.insertItem(oItem, iIndex);
				}
			}
			if (oSelectedView && oSelectedView.updateView) {
				oSelectedView.updateView(aDiff);
			}
		} else {
			this[oAggregationInfo._sDestructor]();
			jQuery.each(aContexts, function(iIndex, oContext) {
				var sId = that.getId() + "-" + iIndex;
				oClone = fnFactory(sId, oContext);
				oClone.setBindingContext(oContext, oBindingInfo.model);
				that[oAggregationInfo._sMutator](oClone);
			});
		}
		
		// update context on all items after applying diff
		aItems = this.getItems();
		for (var i = 0, l = aContexts.length; i < l; i++) {
			aItems[i].setBindingContext(aContexts[i], oBindingInfo.model);
		}
	};

	return DataSet;

}, /* bExport= */ true);
