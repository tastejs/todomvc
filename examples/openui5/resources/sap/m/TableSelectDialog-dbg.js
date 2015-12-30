/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.m.TableSelectDialog.
sap.ui.define(['jquery.sap.global', './Button', './Dialog', './SearchField', './Table', './library', 'sap/ui/core/Control'],
	function(jQuery, Button, Dialog, SearchField, Table, library, Control) {
	"use strict";



	/**
	 * Constructor for a new TableSelectDialog.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * TableSelectDialog provides you with an easier way to create a dialog that contains a list with grouping and search functionalities.
	 * The Table used in a SelectDialog is a Table with Columns. After selecting an item, the dialog is closed and a callback function returns the item being selected.
	 * @extends sap.ui.core.Control
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @since 1.16
	 * @alias sap.m.TableSelectDialog
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var TableSelectDialog = Control.extend("sap.m.TableSelectDialog", /** @lends sap.m.TableSelectDialog.prototype */ { metadata : {

		library : "sap.m",
		properties : {

			/**
			 * Specifies the title text in the dialog header.
			 */
			title : {type : "string", group : "Appearance", defaultValue : null},

			/**
			 * Specifies the text displayed when the table has no data.
			 */
			noDataText : {type : "string", group : "Appearance", defaultValue : null},

			/**
			 * Enables the user to select several options from the table.
			 */
			multiSelect : {type : "boolean", group : "Dimension", defaultValue : false},

			/**
			 * Determines the number of items initially displayed in the table.
			 */
			growingThreshold : {type : "int", group : "Misc", defaultValue : null},

			/**
			 * Determines the content width of the inner dialog. For more information, see the Dialog documentation.
			 * @since 1.18
			 */
			contentWidth : {type : "sap.ui.core.CSSSize", group : "Dimension", defaultValue : null},

			/**
			 * Controls whether the dialog clears the selection or not. When the dialog is opened multiple times in the same context to allow for corrections of previous user inputs, set this flag to "true". When the dialog should reset the selection to allow for a new selection each time set it to "false"
			 * Note: This property must be set before the Dialog is opened to have an effect.
			 * @since 1.18
			 */
			rememberSelections : {type : "boolean", group : "Behavior", defaultValue : false},

			/**
			 * Specifies the content height of the inner dialog. For more information, see the Dialog documentation.
			 */
			contentHeight : {type : "sap.ui.core.CSSSize", group : "Dimension", defaultValue : null}
		},
		defaultAggregation : "items",
		aggregations : {

			/**
			 * The items of the table.
			 */
			items : {type : "sap.m.ColumnListItem", multiple : true, singularName : "item", bindable : "bindable"},

			/**
			 * The internal dialog that is displayed when method open is called.
			 */
			_dialog : {type : "sap.ui.core.Control", multiple : false, visibility : "hidden"},

			/**
			 * The columns bindings.
			 */
			columns : {type : "sap.m.Column", multiple : true, singularName : "column", bindable : "bindable"}
		},
		events : {

			/**
			 * Fires when the dialog is confirmed by selecting an item in single-selection mode or by pressing the confirmation button in multi-selection mode. The items being selected are returned as event parameters.
			 */
			confirm : {
				parameters : {

					/**
					 * Returns the selected list item. When no item is selected, "null" is returned. When multi-selection is enabled and multiple items are selected, only the first selected item is returned.
					 */
					selectedItem : {type : "sap.m.StandardListItem"},

					/**
					 * Returns an array containing the visible selected list items. If no items are selected, an empty array is returned.
					 */
					selectedItems : {type : "sap.m.StandardListItem[]"},

					/**
					 * Returns the binding contexts of the selected items including the non-visible items.
					 * Note: In contrast to the parameter "selectedItems", this parameter includes the selected but NOT visible items (due to list filtering). An empty array is set for this parameter if no Databinding is used.
					 */
					selectedContexts : {type : "string"}
				}
			},

			/**
			 * Fires when the search button has been clicked on dialog.
			 */
			search : {
				parameters : {

					/**
					 * Specifies the value entered in the search field.
					 */
					value : {type : "string"},

					/**
					 * Determines the Items binding of the Table Select Dialog. Only available if the items aggregation is bound to a model.
					 */
					itemsBinding : {type : "any"}
				}
			},

			/**
			 * Fires when the value of the search field is changed by a user (for example at each key press).
			 */
			liveChange : {
				parameters : {

					/**
					 * Specifies the value entered in the search field.
					 */
					value : {type : "string"},

					/**
					 * The Items binding of the Table Select Dialog.
					 * Only available if the items aggregation is bound to a model.
					 */
					itemsBinding : {type : "any"}
				}
			},

			/**
			 * Fires when the Cancel button is clicked.
			 */
			cancel : {}
		}
	}});


	/* =========================================================== */
	/*           begin: API methods                                */
	/* =========================================================== */

	/**
	 * Initializes the control.
	 * @private
	 */
	TableSelectDialog.prototype.init = function () {
		var that = this,
			iLiveChangeTimer = 0,
			fnResetAfterClose = null;

		fnResetAfterClose = function () {
			that._oSelectedItem = that._oTable.getSelectedItem();
			that._aSelectedItems = that._oTable.getSelectedItems();

			that._oDialog.detachAfterClose(fnResetAfterClose);
			that._fireConfirmAndUpdateSelection();
		};

		this._bAppendedToUIArea = false;
		this._bInitBusy = false;
		this._bFirstRender = true;
		this._oRb = sap.ui.getCore().getLibraryResourceBundle("sap.m");

		// store a reference to the table for binding management
		this._oTable = new Table(this.getId() + "-table", {
			growing: true,
			growingScrollToLoad: true,
			mode: sap.m.ListMode.SingleSelectMaster,
			infoToolbar: new sap.m.Toolbar({
				visible: false,
				active: false,
				content: [
					new sap.m.Label({
						text: this._oRb.getText("TABLESELECTDIALOG_SELECTEDITEMS", [0])
					})
				]
			}),
			selectionChange: function (oEvent) {
				if (that._oDialog) {
					if (!that.getMultiSelect()) {
						// attach the reset function to afterClose to hide the dialog changes from the end user
						that._oDialog.attachAfterClose(fnResetAfterClose);
						that._oDialog.close();
					} else {
						// update the selection label
						that._updateSelectionIndicator();
					}
				}
			}
		});
		this._table = this._oTable; // for downward compatibility

		// store a reference to the busyIndicator to display when data is currently loaded by a service
		this._oBusyIndicator = new sap.m.BusyIndicator(this.getId() + "-busyIndicator").addStyleClass("sapMTableSelectDialogBusyIndicator", true);

		// store a reference to the searchField for filtering
		this._oSearchField = new SearchField(this.getId() + "-searchField", {
			width: "100%",
			liveChange: function (oEvent) {
				var sValue = oEvent.getSource().getValue(),
				iDelay = (sValue ? 300 : 0); // no delay if value is empty

				// execute search after user stopped typing for 300ms
				clearTimeout(iLiveChangeTimer);
				if (iDelay) {
					iLiveChangeTimer = setTimeout(function () {
						that._executeSearch(sValue, "liveChange");
					}, iDelay);
				} else {
					that._executeSearch(sValue, "liveChange");
				}
			},
			search: function (oEvent) {
				that._executeSearch(oEvent.getSource().getValue(), "search");
			}
		});
		this._searchField = this._oSearchField; // for downward compatibility

		// store a reference to the subheader for hiding it when data loads
		this._oSubHeader = new sap.m.Bar(this.getId() + "-subHeader", {
			contentMiddle: [
				this._searchField
			]
		});

		// store a reference to the internal dialog
		this._oDialog = new Dialog(this.getId() + "-dialog", {
			stretch: sap.ui.Device.system.phone,
			contentHeight: "2000px",
			subHeader: this._oSubHeader,
			content: [this._oBusyIndicator, this._oTable],
			leftButton: this._getCancelButton(),
			initialFocus: ((sap.ui.Device.system.desktop && this._oSearchField) ? this._oSearchField : null)
		});
		this._dialog = this._oDialog; // for downward compatibility
		this.setAggregation("_dialog", this._oDialog);

		//CSN# 3863876/2013: ESC key should also cancel dialog, not only close it
		var fnDialogEscape = this._oDialog.onsapescape;
		this._oDialog.onsapescape = function(oEvent) {
			// call original escape function of the dialog
			if (fnDialogEscape) {
				fnDialogEscape.call(that._oDialog, oEvent);
			}
			// execute cancel action
			that._onCancel();
		};

		// internally set top and bottom margin of the dialog to 8rem respectively
		// CSN# 333642/2014: in base theme the parameter sapUiFontSize is "medium", implement a fallback
		this._oDialog._iVMargin = 8 * (parseInt(sap.ui.core.theming.Parameters.get("sapUiFontSize"), 10) || 16); //128

		// helper variables for search update behaviour
		this._sSearchFieldValue = "";

		// flags to control the busy indicator behaviour because the growing table will always show the no data text when updating
		this._bFirstRequest = true; // to only show the busy indicator for the first request when the dialog has been openend
		this._iTableUpdateRequested = 0; // to only show the busy indicator when we initiated the change
	};

	/**
	 * Destroys the control
	 * @private
	 */
	TableSelectDialog.prototype.exit = function () {
		// internal variables
		this._oTable = null;
		this._oSearchField = null;
		this._oSubHeader = null;
		this._oBusyIndicator = null;
		this._sSearchFieldValue = null;
		this._iTableUpdateRequested = null;
		this._bFirstRequest = false;
		this._bInitBusy = false;
		this._bFirstRender = false;

		// sap.ui.core.Popup removes its content on close()/destroy() automatically from the static UIArea,
		// but only if it added it there itself. As we did that, we have to remove it also on our own
		if ( this._bAppendedToUIArea ) {
			var oStatic = sap.ui.getCore().getStaticAreaRef();
			oStatic = sap.ui.getCore().getUIArea(oStatic);
			oStatic.removeContent(this, true);
		}

		if (this._oDialog) {
			this._oDialog.destroy();
			this._oDialog = null;
		}

		if (this._oOkButton) {
			this._oOkButton.destroy();
			this._oOkButton = null;
		}

		// selections
		this._oSelectedItem = null;
		this._aSelectedItems = null;
		this._aInitiallySelectedItems = null;

		// compatibility
		this._table = null;
		this._searchField = null;
		this._dialog = null;
	};

	/**
	* Shows the busy state and is called after the renderer is finished.
	* @overwrite
	* @protected
	* @returns {sap.m.TableSelectDialog} this pointer for chaining
	*/
	TableSelectDialog.prototype.onAfterRendering = function () {
		if (this._bInitBusy && this._bFirstRender) {
			this._setBusy(true);
			this._bInitBusy = false;
			this._bFirstRender = false;
		}

		return this;
	};

	/**
	* Invalidates the dialog instead of this control, as there is no renderer.
	* @overwrite
	* @protected
	* @returns {sap.m.TableSelectDialog} this pointer for chaining
	*/
	TableSelectDialog.prototype.invalidate = function () {
		// CSN #80686/2014: only invalidate inner dialog if call does not come from inside
		if (this._oDialog && (!arguments[0] || arguments[0] && arguments[0].getId() !== this.getId() + "-dialog")) {
			this._oDialog.invalidate(arguments);
		} else {
			Control.prototype.invalidate.apply(this, arguments);
		}

		return this;
	};

	/**
	 * Opens the internal dialog with a searchfield and a table.
	 * @public
	 * @param {string} sSearchValue
	 *         Value for the search. The table will be automatically trigger the search event if this parameter is set.
	 * @returns {sap.m.TableSelectDialog} <code>this</code> to allow method chaining
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	TableSelectDialog.prototype.open = function (sSearchValue) {
		if (!this.getParent() && !this._bAppendedToUIArea) {
			var oStatic = sap.ui.getCore().getStaticAreaRef();
			oStatic = sap.ui.getCore().getUIArea(oStatic);
			oStatic.addContent(this, true);
			this._bAppendedToUIArea = true;
		}

		// reset internal variables
		this._bFirstRequest = true;

		// set search field value
		this._oSearchField.setValue(sSearchValue);


		// open the dialog
		this._oDialog.open();


		// open dialog with busy state if a list update is still in progress
		if (this._bInitBusy) {
			this._setBusy(true);
		}

		// store the current selection for the cancel event
		this._aInitiallySelectedItems = this._oTable.getSelectedItems();

		// refresh the selection indicator to be in sync with the model
		this._updateSelectionIndicator();

		//now return the control for chaining
		return this;
	};

	/**
	* Sets the growing threshold to the internal table
	* @public
	* @param {int} iValue Value for the table's growing threshold.
	* @returns {sap.m.TableSelectDialog} this pointer for chaining
	*/
	TableSelectDialog.prototype.setGrowingThreshold = function (iValue) {
		this._oTable.setGrowingThreshold(iValue);
		this.setProperty("growingThreshold", iValue, true);

		return this;
	};

	/**
	 * Enables/Disables multi selection mode.
	 * @overwrite
	 * @public
	 * @param {boolean} bMulti flag for multi selection mode
	 * @returns {sap.m.TableSelectDialog} this pointer for chaining
	 */
	TableSelectDialog.prototype.setMultiSelect = function (bMulti) {
		this.setProperty("multiSelect", bMulti, true);
		if (bMulti) {
			this._oTable.setMode(sap.m.ListMode.MultiSelect);
			this._oTable.setIncludeItemInSelection(true);
			this._oDialog.setRightButton(this._getCancelButton());
			this._oDialog.setLeftButton(this._getOkButton());
		} else {
			this._oTable.setMode(sap.m.ListMode.SingleSelectMaster);
			this._oDialog.setLeftButton(this._getCancelButton());
		}

		return this;
	};

	/**
	 * Sets the title of the internal dialog
	 * @overwrite
	 * @public
	 * @param {string} sTitle the title text for the dialog
	 * @returns {sap.m.TableSelectDialog} this pointer for chaining
	 */
	TableSelectDialog.prototype.setTitle = function (sTitle) {
		this.setProperty("title", sTitle, true);
		this._oDialog.setTitle(sTitle);

		return this;
	};

	/**
	 * Sets the no data text of the internal table
	 * @overwrite
	 * @public
	 * @param {string} sNoDataText the no data text for the table
	 */
	TableSelectDialog.prototype.setNoDataText = function (sNoDataText) {
		this._oTable.setNoDataText(sNoDataText);

		return this;
	};

	/**
	 * Retrieves the internal List's no data text property
	 * @overwrite
	 * @public
	 * @returns {string} the current no data text
	 */
	TableSelectDialog.prototype.getNoDataText = function () {
		return this._oTable.getNoDataText();
	};

	/**
	 * Retrieves content width of the select dialog {@link sap.m.Dialog}
	 * @overwrite
	 * @public
	 * @returns {sap.ui.core.CSSSize} sWidth the content width of the internal dialog
	 */
	TableSelectDialog.prototype.getContentWidth = function () {
		return this._oDialog.getContentWidth();
	};

	/**
	 * Sets content width of the select dialog {@link sap.m.Dialog}
	 * @param {sap.ui.core.CSSSize} sWidth the new content width value for the dialog
	 * @public
	 * @overwrite
	 * @returns {sap.m.TableSelectDialog} this pointer for chaining
	 */
	TableSelectDialog.prototype.setContentWidth = function (sWidth) {
		this._oDialog.setContentWidth(sWidth);

		return this;
	};

	/**
	 * Retrieves content height of the select dialog {@link sap.m.Dialog}
	 * @overwrite
	 * @public
	 * @returns {sap.ui.core.CSSSize} sHeight the content height of the internal dialog
	 */
	TableSelectDialog.prototype.getContentHeight = function () {
		return this._oDialog.getContentHeight();
	};

	/**
	 * Sets content height of the select dialog {@link sap.m.Dialog}
	 * @param {sap.ui.core.CSSSize} sHeight the new content height value for the dialog
	 * @public
	 * @overwrite
	 * @returns {sap.m.TableSelectDialog} this pointer for chaining
	 */
	TableSelectDialog.prototype.setContentHeight = function (sHeight) {
		this._oDialog.setContentHeight(sHeight);

		return this;
	};

	/**
	 * Transfers method to the inner dialog: addStyleClass
	 * @public
	 * @override
	 * @returns {sap.m.TableSelectDialog} this pointer for chaining
	 */
	TableSelectDialog.prototype.addStyleClass = function () {
		this._oDialog.addStyleClass.apply(this._oDialog, arguments);
		return this;
	};

	/**
	 * Transfers method to the inner dialog: removeStyleClass
	 * @public
	 * @override
	 * @returns {sap.m.TableSelectDialog} this pointer for chaining
	 */
	TableSelectDialog.prototype.removeStyleClass = function () {
		this._oDialog.removeStyleClass.apply(this._oDialog, arguments);
		return this;
	};

	/**
	 * Transfers method to the inner dialog: toggleStyleClass
	 * @public
	 * @override
	 * @returns {sap.m.TableSelectDialog} this pointer for chaining
	 */
	TableSelectDialog.prototype.toggleStyleClass = function () {
		this._oDialog.toggleStyleClass.apply(this._oDialog, arguments);
		return this;
	};

	/**
	 * Transfers method to the inner dialog: hasStyleClass
	 * @public
	 * @override
	 * @returns {boolean} true if the class is set, false otherwise
	 */
	TableSelectDialog.prototype.hasStyleClass = function () {
		return this._oDialog.hasStyleClass.apply(this._oDialog, arguments);
	};

	/**
	 * Transfers method to the inner dialog: getDomRef
	 * @public
	 * @override
	 * @return {Element} The Element's DOM Element sub DOM Element or null
	 */
	TableSelectDialog.prototype.getDomRef = function () {
		if (this._oDialog) {
			return this._oDialog.getDomRef.apply(this._oDialog, arguments);
		} else {
			return null;
		}
	};

	/* =========================================================== */
	/*           begin: forward aggregation  methods to table      */
	/* =========================================================== */

	/**
	 * Sets the model for the internal table and the current control, so that both controls can be used with data binding.
	 * @overwrite
	 * @public
	 * @param {sap.ui.Model} oModel The model that holds the data for the table
	 * @param {string} sName The optional model name
	 * @returns {sap.m.TableSelectDialog} This pointer for chaining
	 */
	TableSelectDialog.prototype._setModel = TableSelectDialog.prototype.setModel;
	TableSelectDialog.prototype.setModel = function (oModel, sModelName) {
		var aArgs = Array.prototype.slice.call(arguments);

		// reset busy mode if model was changed
		this._setBusy(false);
		this._bInitBusy = false;

		// we made a request in this control, so we update the counter
		this._iTableUpdateRequested += 1;

		// attach events to listen to model updates and show/hide a busy indicator
		this._oTable.attachUpdateStarted(this._updateStarted, this);
		this._oTable.attachUpdateFinished(this._updateFinished, this);

		// pass the model to the table and also to the local control to allow binding of own properties
		this._oTable.setModel(oModel, sModelName);
		TableSelectDialog.prototype._setModel.apply(this, aArgs);

		// reset the selection label when setting the model
		this._updateSelectionIndicator();

		return this;
	};

	/**
	 * Forwards a function call to a managed object based on the aggregation name.
	 * If the name is items, it will be forwarded to the table, otherwise called locally
	 * @private
	 * @param {string} sFunctionName The name of the function to be called
	 * @param {string} sAggregationName The name of the aggregation associated
	 * @returns {mixed} The return type of the called function
	 */
	TableSelectDialog.prototype._callMethodInManagedObject = function (sFunctionName, sAggregationName) {
		var aArgs = Array.prototype.slice.call(arguments);

		if (sAggregationName === "items") {
			// apply to the internal table
			return this._oTable[sFunctionName].apply(this._oTable, aArgs.slice(1));
		} else if (sAggregationName === "columns") {
			// apply to the internal table
			return this._oTable[sFunctionName].apply(this._oTable, aArgs.slice(1));
		} else {
			// apply to this control
			return sap.ui.base.ManagedObject.prototype[sFunctionName].apply(this, aArgs.slice(1));
		}
	};

	/**
	 * Forwards aggregations with the name of items or columns to the internal table.
	 * @overwrite
	 * @protected
	 * @param {string} sAggregationName The name for the binding
	 * @param {object} oBindingInfo The configuration parameters for the binding
	 * @returns {sap.m.TableSelectDialog} this pointer for chaining
	 */
	TableSelectDialog.prototype.bindAggregation = function () {
		var args = Array.prototype.slice.call(arguments);

		// propagate the bind aggregation function to list
		this._callMethodInManagedObject.apply(this, ["bindAggregation"].concat(args));
		return this;
	};

	TableSelectDialog.prototype.validateAggregation = function (sAggregationName, oObject, bMultiple) {
		return this._callMethodInManagedObject("validateAggregation", sAggregationName, oObject, bMultiple);
	};

	TableSelectDialog.prototype.setAggregation = function (sAggregationName, oObject, bSuppressInvalidate) {
		this._callMethodInManagedObject("setAggregation", sAggregationName, oObject, bSuppressInvalidate);
		return this;
	};

	TableSelectDialog.prototype.getAggregation = function (sAggregationName, oDefaultForCreation) {
		return this._callMethodInManagedObject("getAggregation", sAggregationName, oDefaultForCreation);
	};

	TableSelectDialog.prototype.indexOfAggregation = function (sAggregationName, oObject) {
		return this._callMethodInManagedObject("indexOfAggregation", sAggregationName, oObject);
	};

	TableSelectDialog.prototype.insertAggregation = function (sAggregationName, oObject, iIndex, bSuppressInvalidate) {
		this._callMethodInManagedObject("insertAggregation", sAggregationName, oObject, iIndex, bSuppressInvalidate);
		return this;
	};

	TableSelectDialog.prototype.addAggregation = function (sAggregationName, oObject, bSuppressInvalidate) {
		this._callMethodInManagedObject("addAggregation", sAggregationName, oObject, bSuppressInvalidate);
		return this;
	};

	TableSelectDialog.prototype.removeAggregation = function (sAggregationName, oObject, bSuppressInvalidate) {
		this._callMethodInManagedObject("removeAggregation", sAggregationName, oObject, bSuppressInvalidate);
		return this;
	};

	TableSelectDialog.prototype.removeAllAggregation = function (sAggregationName, bSuppressInvalidate) {
		return this._callMethodInManagedObject("removeAllAggregation", sAggregationName, bSuppressInvalidate);
	};

	TableSelectDialog.prototype.destroyAggregation = function (sAggregationName, bSuppressInvalidate) {
		this._callMethodInManagedObject("destroyAggregation", sAggregationName, bSuppressInvalidate);
		return this;
	};

	TableSelectDialog.prototype.getBinding = function (sAggregationName) {
		return this._callMethodInManagedObject("getBinding", sAggregationName);
	};

	TableSelectDialog.prototype.getBindingInfo = function (sAggregationName) {
		return this._callMethodInManagedObject("getBindingInfo", sAggregationName);
	};

	TableSelectDialog.prototype.getBindingPath = function (sAggregationName) {
		return this._callMethodInManagedObject("getBindingPath", sAggregationName);
	};

	TableSelectDialog.prototype.getBindingContext = function (sModelName) {
		return this._oTable.getBindingContext(sModelName);
	};

	/**
	 * Sets the binding context for the internal table AND the current control so that both controls can be used with the context.
	 * @overwrite
	 * @public
	 * @param {sap.ui.model.Context} oContext the new context
	 * @param {string} sModelName The optional model name
	 * @returns {sap.m.TableSelectDialog} this pointer for chaining
	 */
	TableSelectDialog.prototype._setBindingContext = TableSelectDialog.prototype.setBindingContext;
	TableSelectDialog.prototype.setBindingContext = function (oContext, sModelName) {
		var args = Array.prototype.slice.call(arguments);

		// pass the model to the list and also to the local control to allow binding of own properties
		this._oTable.setBindingContext(oContext, sModelName);
		TableSelectDialog.prototype._setBindingContext.apply(this, args);

		return this;
	};

	/* =========================================================== */
	/*           end: forward aggregation  methods to table       */
	/* =========================================================== */

	/* =========================================================== */
	/*           begin: internal methods and properties            */
	/* =========================================================== */

	/**
	 * Fires the search event on the internal when dialog is opened.
	 * This function is also called whenever a search event on the "search field" is triggered
	 * @private
	 * @param {string} sValue The new Search value or undefined if called by management functions
	 * @param {string} sEventType The search field event type that has been called (liveChange / search)
	 * @returns {sap.m.TableSelectDialog} this pointer for chaining
	 */
	TableSelectDialog.prototype._executeSearch = function (sValue, sEventType) {
		var oTable = this._oTable,
			oBinding = (oTable ? oTable.getBinding("items") : undefined),
			bSearchValueDifferent = (this._sSearchFieldValue !== sValue); // to prevent unwanted duplicate requests

		// fire either the Search event or the liveChange event when dialog is opened.
		// 1) when the clear icon is called then both liveChange and search events are fired but we only want to process the first one
		// 2) when a livechange has been triggered by typing we don't want the next search event to be processed (typing + enter or typing + search button)
		if (this._oDialog.isOpen() && ((bSearchValueDifferent && sEventType === "liveChange") || sEventType === "search")) {
			// set the internal value to the passed value to check if the same value has already been filtered (happens when clear is called, it fires liveChange and change events)
			this._sSearchFieldValue = sValue;

			// only set when the binding has already been executed
			// only set when the binding has already been executed
			if (oBinding) {
				// we made another request in this control, so we update the counter
				this._iTableUpdateRequested += 1;
				if (sEventType === "search") {
					// fire the search so the data can be updated externally
					this.fireSearch({value: sValue, itemsBinding: oBinding});
				} else if (sEventType === "liveChange") {
					// fire the liveChange so the data can be updated externally
					this.fireLiveChange({value: sValue, itemsBinding: oBinding});
				}
			} else {
				// no binding, just fire the event for manual filtering
				if (sEventType === "search") {
					// fire the search so the data can be updated externally
					this.fireSearch({value: sValue});
				} else if (sEventType === "liveChange") {
					// fire the liveChange so the data can be updated externally
					this.fireLiveChange({value: sValue});
				}
			}
		}

		return this;
	};

	/**
	 * Shows/hides a local busy indicator and hides/shows the list based on the parameter flag. For the first request, the search field is also hidden.
	 * @private
	 * @param {boolean} bBusy flag (true = show, false = hide)
	 */
	TableSelectDialog.prototype._setBusy = function (bBusy) {
		if (this._iTableUpdateRequested) { // check if the event was caused by our control
			if (bBusy) {
				if (this._bFirstRequest) { // also hide the header bar for the first request
					this._oSubHeader.$().css('display', 'none');
				}
				this._oTable.addStyleClass('sapMSelectDialogListHide');
				this._oBusyIndicator.$().css('display', 'inline-block');
			} else {
				if (this._bFirstRequest) { // also show the header bar again for the first request
					this._oSubHeader.$().css('display', 'block');
				}
				this._oTable.removeStyleClass('sapMSelectDialogListHide');
				this._oBusyIndicator.$().css('display', 'none');
			}
		}
	};

	/**
	 * Shows a busy indicator and hides searchField and list in the dialog.
	 * Event function that is called when the model sends a request to update the data.
	 * @private
	 * @param {jQuery.EventObject} oEvent The event object
	 */
	TableSelectDialog.prototype._updateStarted = function (oEvent) {
		if (this.getModel() && this.getModel() instanceof sap.ui.model.odata.ODataModel) {
			if (this._oDialog.isOpen() && this._iTableUpdateRequested) {
				// only set busy mode when we have an oData model
				this._setBusy(true);
			} else {
				this._bInitBusy = true;
			}
		}
	};

	/**
	 * Hides the busy indicator and shows searchField and list in the dialog.
	 * Event function that is called when the model request is finished.
	 * @private
	 * @param {jQuery.EventObject} oEvent The event object
	 */
	TableSelectDialog.prototype._updateFinished = function (oEvent) {
		this._updateSelectionIndicator();
		// only reset busy mode when we have an oData model
		if (this.getModel() && this.getModel() instanceof sap.ui.model.odata.ODataModel) {
			this._setBusy(false);
			this._bInitBusy = false;
		}

		if (sap.ui.Device.system.desktop) {

			if (this._oTable.getItems()[0]) {
				this._oDialog.setInitialFocus(this._oTable.getItems()[0]);
			} else {
				this._oDialog.setInitialFocus(this._oSearchField);
			}

			// set initial focus manually after all items are visible
			if (this._bFirstRequest) {
				var oFocusControl = this._oTable.getItems()[0];
				if (!oFocusControl) {
				oFocusControl = this._oSearchField;
				}

				if (oFocusControl.getFocusDomRef()) {
					oFocusControl.getFocusDomRef().focus();
				}
			}
		}

	this._bFirstRequest = false;

	// we received a request (from this or from another control) so set the counter to 0
	this._iTableUpdateRequested = 0;
	};

	/**
	 * Lazy load the OK button if needed for MultiSelect mode.
	 * @private
	 * @return {sap.m.Button} The button
	 */
	TableSelectDialog.prototype._getOkButton = function () {
		var that = this,
			fnOKAfterClose = null;

		fnOKAfterClose = function () {
				that._oSelectedItem = that._oTable.getSelectedItem();
				that._aSelectedItems = that._oTable.getSelectedItems();

				that._oDialog.detachAfterClose(fnOKAfterClose);
				that._fireConfirmAndUpdateSelection();
			};

		if (!this._oOkButton) {
			this._oOkButton = new Button(this.getId() + "-ok", {
				text: this._oRb.getText("MSGBOX_OK"),
				press: function () {
					// attach the reset function to afterClose to hide the dialog changes from the end user
					that._oDialog.attachAfterClose(fnOKAfterClose);
					that._oDialog.close();
				}
			});
		}
		return this._oOkButton;
	};

	/**
	 * Lazy load the Cancel button
	 * @private
	 * @return {sap.m.Button} The button
	 */
	TableSelectDialog.prototype._getCancelButton = function () {
		var that = this;

		if (!this._oCancelButton) {
			this._oCancelButton = new Button(this.getId() + "-cancel", {
				text: this._oRb.getText("MSGBOX_CANCEL"),
				press: function () {
					that._onCancel();
				}
			});
		}
		return this._oCancelButton;
	};

	/**
	 * Internal event handler for the Cancel button and ESC key
	 * @private
	 */
	TableSelectDialog.prototype._onCancel = function (oEvent) {
		var that = this,
			fnAfterClose = null;

		fnAfterClose = function () {
			// reset internal selection values
			that._oSelectedItem = null;
			that._aSelectedItems = [];
			that._sSearchFieldValue = null;

			// detach this function
			that._oDialog.detachAfterClose(fnAfterClose);

			// fire cancel event
			that.fireCancel();

			// reset selection
			that._resetSelection();
		};

		// attach the reset function to afterClose to hide the dialog changes from the end user
		this._oDialog.attachAfterClose(fnAfterClose);
		this._oDialog.close();
	};

	/**
	 * Updates the selection indicator bar
	 * @private
	 */
	TableSelectDialog.prototype._updateSelectionIndicator = function () {
		var iSelectedContexts = this._oTable.getSelectedContexts(true).length,
			oInfoBar = this._oTable.getInfoToolbar();

		// update the selection label
		oInfoBar.setVisible(!!iSelectedContexts);
		oInfoBar.getContent()[0].setText(this._oRb.getText("TABLESELECTDIALOG_SELECTEDITEMS", [iSelectedContexts]));
	};

	/**
	 * Fires the confirm event and updates the selection of the table.
	 * The function is called on pressing OK and on Close in single select mode
	 * @private
	 */
	TableSelectDialog.prototype._fireConfirmAndUpdateSelection = function () {
		// fire confirm event with current selection
		this.fireConfirm({
			selectedItem: this._oSelectedItem,
			selectedItems: this._aSelectedItems,
			selectedContexts: this._oTable.getSelectedContexts(true)
		});
		this._updateSelection();
	};

	/**
	 * Removes/keeps the table selection based on property "rememberSelection"
	 * @private
	 */
	TableSelectDialog.prototype._updateSelection = function () {
		// cleanup old selection on Close to allow reuse of dialog
		// due to the delayed call (dialog onAfterClose) the control could be already destroyed
		if (!this.getRememberSelections() && !this.bIsDestroyed) {
			this._oTable.removeSelections(true);
			delete this._oSelectedItem;
			delete this._aSelectedItems;
		}
	};

	/**
	 * Resets the selection to the items that were selected when the dialog was opened
	 * @private
	 */
	TableSelectDialog.prototype._resetSelection = function () {
		var i = 0;

		// due to the delayed call (dialog onAfterClose) the control could be already destroyed
		if (!this.bIsDestroyed) {
			this._oTable.removeSelections();
			for (; i < this._aInitiallySelectedItems.length; i++) {
				this._oTable.setSelectedItem(this._aInitiallySelectedItems[i]);
			}
		}
	};

	/* =========================================================== */
	/*           end: internal methods                             */
	/* =========================================================== */


	return TableSelectDialog;

}, /* bExport= */ true);
