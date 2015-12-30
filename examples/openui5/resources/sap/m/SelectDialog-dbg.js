/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.m.SelectDialog.
sap.ui.define(['jquery.sap.global', './Button', './Dialog', './List', './SearchField', './library', 'sap/ui/core/Control'],
	function(jQuery, Button, Dialog, List, SearchField, library, Control) {
	"use strict";



	/**
	 * Constructor for a new SelectDialog.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * A SelectDialog is a dialog containing a list, search functionality to filter it and a confirmation/cancel button. The control can be used when the user should select one or multiple items out of many.
	 *
	 * The list used in the SelectDialog is a growing list and can be filled with a any kind of list item. The search field triggers the events "search" and "liveChange" where a filter function can be applied to the list binding.
	 *
	 * After selecting an item in single selection mode or after confirming in multi selection mode, the dialog will be closed and the event "confirm" is fired with the items that have been selected. By default, the selection will also be reset to allow for a new selection when opening the dialog again.
	 *
	 * When cancelling the selection, the event "change" will be fired and the selection is restored to the state when the dialog was opened.
	 *
	 * NOTE: The growing functionality of the list does not support two-way Binding, so if you use this control with a JSON model make sure the binding mode is set to "OneWay" and that you update the selection model manually with the items passed in the "confirm" event.
	 * @extends sap.ui.core.Control
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.m.SelectDialog
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var SelectDialog = Control.extend("sap.m.SelectDialog", /** @lends sap.m.SelectDialog.prototype */ { metadata : {

		library : "sap.m",
		properties : {

			/**
			 * Determines the title text that appears in the dialog header
			 */
			title : {type : "string", group : "Appearance", defaultValue : null},

			/**
			 * Determines the text shown when the list has no data
			 */
			noDataText : {type : "string", group : "Appearance", defaultValue : null},

			/**
			 * Determines if the user can select several options from the list
			 */
			multiSelect : {type : "boolean", group : "Dimension", defaultValue : false},

			/**
			 * Determines the number of items initially displayed in the list. Also defines the number of items to be requested from the model for each grow.
			 */
			growingThreshold : {type : "int", group : "Misc", defaultValue : null},

			/**
			 * Determines the content width of the inner dialog. For more information, see the dialog documentation.
			 * @since 1.18
			 */
			contentWidth : {type : "sap.ui.core.CSSSize", group : "Dimension", defaultValue : null},

			/**
			 * This flag controls whether the dialog clears the selection after the confirm event has been fired. If the dialog needs to be opened multiple times in the same context to allow for corrections of previous user inputs, set this flag to "true".
			 * @since 1.18
			 */
			rememberSelections : {type : "boolean", group : "Behavior", defaultValue : false},

			/**
			 * Determines the content height of the inner dialog. For more information, see the dialog documentation.
			 */
			contentHeight : {type : "sap.ui.core.CSSSize", group : "Dimension", defaultValue : null}
		},
		defaultAggregation : "items",
		aggregations : {

			/**
			 * The items of the list shown in the search dialog. It is recommended to use a StandardListItem for the dialog but other combinations are also possible.
			 */
			items : {type : "sap.m.ListItemBase", multiple : true, singularName : "item"},

			/**
			 * The internal dialog that will be shown when method open is called
			 */
			_dialog : {type : "sap.ui.core.Control", multiple : false, visibility : "hidden"}
		},
		events : {

			/**
			 * This event will be fired when the dialog is confirmed by selecting an item in single selection mode or by pressing the confirmation button in multi selection mode . The items being selected are returned as event parameters.
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
					 * NOTE: In contrast to the parameter "selectedItems", this parameter will also include the selected but NOT visible items (e.g. due to list filtering). An empty array will be set for this parameter if no data binding is used.
					 * NOTE: When the list binding is pre-filtered and there are items in the selection that are not visible upon opening the dialog, these contexts are not loaded. Therefore, these items will not be included in the selectedContexts array unless they are displayed at least once.
					 */
					selectedContexts : {type : "string"}
				}
			},

			/**
			 * This event will be fired when the search button has been clicked on the searchfield on the visual control
			 */
			search : {
				parameters : {

					/**
					 * The value entered in the search
					 */
					value : {type : "string"},

					/**
					 * The Items binding of the Select Dialog for search purposes. It will only be available if the items aggregation is bound to a model.
					 */
					itemsBinding : {type : "any"}
				}
			},

			/**
			 * This event will be fired when the value of the search field is changed by a user - e.g. at each key press
			 */
			liveChange : {
				parameters : {

					/**
					 * The value to search for, which can change at any keypress
					 */
					value : {type : "string"},

					/**
					 * The Items binding of the Select Dialog. It will only be available if the items aggregation is bound to a model.
					 */
					itemsBinding : {type : "any"}
				}
			},

			/**
			 * This event will be fired when the cancel button is clicked
			 */
			cancel : {}
		}
	}});


	/* =========================================================== */
	/*           begin: API methods                                */
	/* =========================================================== */

	/**
	 * Initializes the control
	 * @private
	 */
	SelectDialog.prototype.init = function () {
		var that = this,
			iLiveChangeTimer = 0,
			fnResetAfterClose = null,
			fnDialogEscape = null;

		fnResetAfterClose = function () {
			that._oSelectedItem = that._oList.getSelectedItem();
			that._aSelectedItems = that._oList.getSelectedItems();

			that._oDialog.detachAfterClose(fnResetAfterClose);
			that._fireConfirmAndUpdateSelection();
		};

		this._bAppendedToUIArea = false;
		this._bInitBusy = false;
		this._bFirstRender = true;
		this._oRb = sap.ui.getCore().getLibraryResourceBundle("sap.m");

		// store a reference to the list for binding management
		this._oList = new List(this.getId() + "-list", {
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
						that._updateSelectionIndicator();
					}
				}
			}
		});

		this._oList.getInfoToolbar().addEventDelegate({
			onAfterRendering: function () {
				that._oList.getInfoToolbar().$().attr('aria-live', 'polite');
			}
		});

		this._list = this._oList; // for downward compatibility

		// attach events to listen to model updates and show/hide a busy indicator
		this._oList.attachUpdateStarted(this._updateStarted, this);
		this._oList.attachUpdateFinished(this._updateFinished, this);

		// store a reference to the busyIndicator to display when data is currently loaded by a service
		this._oBusyIndicator = new sap.m.BusyIndicator(this.getId() + "-busyIndicator").addStyleClass("sapMSelectDialogBusyIndicator", true);

		// store a reference to the searchField for filtering
		this._oSearchField = new SearchField(this.getId() + "-searchField", {
			width: "100%",
			liveChange: function (oEvent) {
				var sValue = oEvent.getSource().getValue(),
					iDelay = (sValue ? 300 : 0); // no delay if value is empty

				// execute search after user stops typing for 300ms
				clearTimeout(iLiveChangeTimer);
				if (iDelay) {
					iLiveChangeTimer = setTimeout(function () {
						that._executeSearch(sValue, "liveChange");
					}, iDelay);
				} else {
					that._executeSearch(sValue, "liveChange");
				}
			},
			// execute the standard search
			search: function (oEvent) {
				that._executeSearch(oEvent.getSource().getValue(), "search");
			}
		});
		this._searchField = this._oSearchField; // for downward compatibility

		// store a reference to the subheader for hiding it when data loads
		this._oSubHeader = new sap.m.Bar(this.getId() + "-subHeader", {
			contentMiddle: [
				this._oSearchField
			]
		});

		// store a reference to the internal dialog
		this._oDialog = new Dialog(this.getId() + "-dialog", {
			title: this.getTitle(),
			stretch: sap.ui.Device.system.phone,
			contentHeight: "2000px",
			subHeader: this._oSubHeader,
			content: [this._oBusyIndicator, this._oList],
			leftButton: this._getCancelButton(),
			initialFocus: (sap.ui.Device.system.desktop ? this._oSearchField : null)
		}).addStyleClass("sapMSelectDialog", true);
		// for downward compatibility reasons
		this._dialog = this._oDialog;
		this.setAggregation("_dialog", this._oDialog);

		//CSN# 3863876/2013: ESC key should also cancel dialog, not only close it
		fnDialogEscape = this._oDialog.onsapescape;
		this._oDialog.onsapescape = function (oEvent) {
			// call original escape function of the dialog
			if (fnDialogEscape) {
				fnDialogEscape.call(that._oDialog, oEvent);
			}
			// execute cancel action
			that._onCancel();
		};

		// internally set top and bottom margin of the dialog to 4rem respectively
		// CSN# 333642/2014: in base theme the parameter sapUiFontSize is "medium", implement a fallback
		this._oDialog._iVMargin = 8 * (parseInt(sap.ui.core.theming.Parameters.get("sapUiFontSize"), 10) || 16); // 128

		// helper variables for search update behaviour
		this._sSearchFieldValue = "";

		// flags to control the busy indicator behaviour because the growing list will always show the no data text when updating
		this._bFirstRequest = true; // to only show the busy indicator for the first request when the dialog has been openend
		this._bLiveChange = false; // to check if the triggered event is LiveChange
		this._iListUpdateRequested = 0; // to only show the busy indicator when we initiated the change
	};

	/**
	 * Destroys the control
	 * @private
	 */
	SelectDialog.prototype.exit = function () {
		// internal variables
		this._oList = null;
		this._oSearchField = null;
		this._oSubHeader = null;
		this._oBusyIndicator = null;
		this._sSearchFieldValue = null;
		this._iListUpdateRequested = 0;
		this._bFirstRequest = false;
		this._bInitBusy = false;
		this._bFirstRender = false;
		this._bFirstRequest = false;

		// sap.ui.core.Popup removes its content on close()/destroy() automatically from the static UIArea,
		// but only if it added it there itself. As we did that, we have to remove it also on our own
		if ( this._bAppendedToUIArea ) {
			var oStatic = sap.ui.getCore().getStaticAreaRef();
			oStatic = sap.ui.getCore().getUIArea(oStatic);
			oStatic.removeContent(this, true);
		}

		// controls not managed in aggregations
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

		// compatibility
		this._list = null;
		this._searchField = null;
		this._dialog = null;
	};

	/*
	* Is called after renderer is finished to show the busy state
	* @override
	* @protected
	* @returns {sap.m.SelectDialog} this pointer for chaining
	*/
	SelectDialog.prototype.onAfterRendering = function () {
		if (this._bInitBusy && this._bFirstRender) {
			this._setBusy(true);
			this._bInitBusy = false;
		}

		return this;
	};

	/*
	* Invalidates the dialog instead of this control (we don't have a renderer)
	* @override
	* @protected
	* @returns {sap.m.SelectDialog} this pointer for chaining
	*/
	SelectDialog.prototype.invalidate = function () {
		// CSN #80686/2014: only invalidate inner dialog if call does not come from inside
		if (this._oDialog && (!arguments[0] || arguments[0] && arguments[0].getId() !== this.getId() + "-dialog")) {
			this._oDialog.invalidate(arguments);
		} else {
			Control.prototype.invalidate.apply(this, arguments);
		}

		return this;
	};

	/**
	 * Opens the internal dialog with a searchfield and a list.
	 *
	 * @name sap.m.SelectDialog#open
	 * @function
	 * @param {string} sSearchValue
	 *         A value for the search can be passed to match with the filter applied to the list binding.
	 * @type sap.m.SelectDialog
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	SelectDialog.prototype.open = function (sSearchValue) {
		// CSN #80686/2014: only invalidate inner dialog if call does not come from inside
		// Important: do not rely on the ui area fix, it will be removed with a later version of UI5
		// use fragments instead or take care of proper parent-child dependencies
		if ((!this.getParent() || !this.getUIArea()) && !this._bAppendedToUIArea) {
			var oStatic = sap.ui.getCore().getStaticAreaRef();
			oStatic = sap.ui.getCore().getUIArea(oStatic);
			oStatic.addContent(this, true);
			this._bAppendedToUIArea = true;
		}

		// reset internal variables
		this._bFirstRequest = true;

		// set the search value
		this._oSearchField.setValue(sSearchValue);

		// open the dialog
		this._oDialog.open();

		// open dialog with busy state if a list update is still in progress
		if (this._bInitBusy) {
			this._setBusy(true);
		}

		// refresh the selection indicator to be in sync with the model
		this._updateSelectionIndicator();

		// store the current selection for the cancel event
		this._aInitiallySelectedContextPaths = this._oList.getSelectedContextPaths();

		// return Dialog for chaining purposes
		return this;
	};

	/**
	* Sets the growing threshold to the internal list
	* @public
	* @param {int} iValue Value for the list's growing threshold.
	* @returns {sap.m.SelectDialog} this pointer for chaining
	*/
	SelectDialog.prototype.setGrowingThreshold = function (iValue) {
		this._oList.setGrowingThreshold(iValue);
		this.setProperty("growingThreshold", iValue, true);

		return this;
	};

	/**
	 * Enable/Disable multi selection mode.
	 * @override
	 * @public
	 * @param {boolean} bMulti Flag for multi selection mode
	 * @returns {sap.m.SelectDialog} this pointer for chaining
	 */
	SelectDialog.prototype.setMultiSelect = function (bMulti) {
		this.setProperty("multiSelect", bMulti, true);
		if (bMulti) {
			this._oList.setMode(sap.m.ListMode.MultiSelect);
			this._oList.setIncludeItemInSelection(true);
			this._oDialog.setEndButton(this._getCancelButton());
			this._oDialog.setBeginButton(this._getOkButton());
		} else {
			this._oList.setMode(sap.m.ListMode.SingleSelectMaster);
			this._oDialog.setBeginButton(this._getCancelButton());
		}

		return this;
	};

	/**
	 * Set the title of the internal dialog
	 * @override
	 * @public
	 * @param {string} sTitle The title text for the dialog
	 * @returns {sap.m.SelectDialog} this pointer for chaining
	 */
	SelectDialog.prototype.setTitle = function (sTitle) {
		this._oDialog.setTitle(sTitle);
		this.setProperty("title", sTitle, true);

		return this;
	};

	/**
	 * Set the internal List's no data text property
	 * @override
	 * @public
	 * @param {string} sNoDataText The no data text for the list
	 * @returns {sap.m.SelectDialog} this pointer for chaining
	 */
	SelectDialog.prototype.setNoDataText = function (sNoDataText) {
		this._oList.setNoDataText(sNoDataText);

		return this;
	};

	/**
	 * Get the internal List's no data text property
	 * @override
	 * @public
	 * @returns {string} the current no data text
	 */
	SelectDialog.prototype.getNoDataText = function () {
		return this._oList.getNoDataText();
	};

	/**
	 * Get the internal Dialog's contentWidth property {@link sap.m.Dialog}
	 * @override
	 * @public
	 * @returns {sap.ui.core.CSSSize} sWidth The content width of the internal dialog
	 */
	SelectDialog.prototype.getContentWidth = function () {
		return this._oDialog.getContentWidth();
	};

	/**
	 * Set the internal Dialog's contentWidth property {@link sap.m.Dialog}
	 * @param {sap.ui.core.CSSSize} sWidth The new content width value for the dialog
	 * @public
	 * @override
	 * @returns {sap.m.SelectDialog} this pointer for chaining
	 */
	SelectDialog.prototype.setContentWidth = function (sWidth) {
		this._oDialog.setContentWidth(sWidth);

		return this;
	};

	/**
	 * Get the internal Dialog's contentHeight property {@link sap.m.Dialog}
	 * @override
	 * @public
	 * @returns {sap.ui.core.CSSSize} sHeight The content width of the internal dialog
	 */
	SelectDialog.prototype.getContentHeight = function () {
		return this._oDialog.getContentHeight();
	};

	/**
	 * Set the internal Dialog's contentHeight property {@link sap.m.Dialog}
	 * @param {sap.ui.core.CSSSize} sHeight The new content width value for the dialog
	 * @public
	 * @override
	 * @returns {sap.m.SelectDialog} this pointer for chaining
	 */
	SelectDialog.prototype.setContentHeight = function (sHeight) {
		this._oDialog.setContentHeight(sHeight);

		return this;
	};


	/**
	 * Forward method to the inner dialog: addStyleClass
	 * @public
	 * @override
	 * @returns {sap.m.SelectDialog} this pointer for chaining
	 */
	SelectDialog.prototype.addStyleClass = function () {
		this._oDialog.addStyleClass.apply(this._oDialog, arguments);
		return this;
	};

	/**
	 * Forward method to the inner dialog: removeStyleClass
	 * @public
	 * @override
	 * @returns {sap.m.SelectDialog} this pointer for chaining
	 */
	SelectDialog.prototype.removeStyleClass = function () {
		this._oDialog.removeStyleClass.apply(this._oDialog, arguments);
		return this;
	};

	/**
	 * Forward method to the inner dialog: toggleStyleClass
	 * @public
	 * @override
	 * @returns {sap.m.SelectDialog} this pointer for chaining
	 */
	SelectDialog.prototype.toggleStyleClass = function () {
		this._oDialog.toggleStyleClass.apply(this._oDialog, arguments);
		return this;
	};

	/**
	 * Forward method to the inner dialog: hasStyleClass
	 * @public
	 * @override
	 * @returns {boolean} true if the class is set, false otherwise
	 */
	SelectDialog.prototype.hasStyleClass = function () {
		return this._oDialog.hasStyleClass.apply(this._oDialog, arguments);
	};

	/**
	 * Forward method to the inner dialog: getDomRef
	 * @public
	 * @override
	 * @return {Element} The Element's DOM Element sub DOM Element or null
	 */
	SelectDialog.prototype.getDomRef = function () {
		if (this._oDialog) {
			return this._oDialog.getDomRef.apply(this._oDialog, arguments);
		} else {
			return null;
		}
	};

	/* =========================================================== */
	/*           begin: forward aggregation  methods to List       */
	/* =========================================================== */

	/*
	 * Set the model for the internal list AND the current control so that
	 * both controls can be used with data binding
	 * @override
	 * @public
	 * @param {sap.ui.Model} oModel the model that holds the data for the list
	 * @param {string} sModelName the optional model name
	 * @returns {sap.m.SelectDialog} this pointer for chaining
	 */
	SelectDialog.prototype._setModel = SelectDialog.prototype.setModel;
	SelectDialog.prototype.setModel = function (oModel, sModelName) {
		var aArgs = Array.prototype.slice.call(arguments);

		// reset busy mode if model was changed
		this._setBusy(false);
		this._bInitBusy = false;

		// we made a request in this control, so we update the counter
		this._iListUpdateRequested += 1;

		// pass the model to the list and also to the local control to allow binding of own properties
		this._oList.setModel(oModel, sModelName);
		SelectDialog.prototype._setModel.apply(this, aArgs);

		// reset the selection label when setting the model
		this._updateSelectionIndicator();

		return this;
	};

	/*
	 * Forwards a function call to a managed object based on the aggregation name.
	 * If the name is items, it will be forwarded to the list, otherwise called locally
	 * @private
	 * @param {string} sFunctionName The name of the function to be called
	 * @param {string} sAggregationName The name of the aggregation asociated
	 * @returns {mixed} The return type of the called function
	 */
	SelectDialog.prototype._callMethodInManagedObject = function (sFunctionName, sAggregationName) {
		var aArgs = Array.prototype.slice.call(arguments);

		if (sAggregationName === "items") {
			// apply to the internal list
			return this._oList[sFunctionName].apply(this._oList, aArgs.slice(1));
		} else {
			// apply to this control
			return sap.ui.base.ManagedObject.prototype[sFunctionName].apply(this, aArgs.slice(1));
		}
	};

	/**
	 * Forwards aggregations with the name of items to the internal list.
	 * @override
	 * @protected
	 * @param {string} sAggregationName The name for the binding
	 * @param {object} oBindingInfo The configuration parameters for the binding
	 * @returns {sap.m.SelectDialog} this pointer for chaining
	 */
	SelectDialog.prototype.bindAggregation = function () {
		var args = Array.prototype.slice.call(arguments);

		// propagate the bind aggregation function to list
		this._callMethodInManagedObject.apply(this, ["bindAggregation"].concat(args));
		return this;
	};

	SelectDialog.prototype.validateAggregation = function (sAggregationName, oObject, bMultiple) {
		return this._callMethodInManagedObject("validateAggregation", sAggregationName, oObject, bMultiple);
	};

	SelectDialog.prototype.setAggregation = function (sAggregationName, oObject, bSuppressInvalidate) {
		this._callMethodInManagedObject("setAggregation", sAggregationName, oObject, bSuppressInvalidate);
		return this;
	};

	SelectDialog.prototype.getAggregation = function (sAggregationName, oDefaultForCreation) {
		return this._callMethodInManagedObject("getAggregation", sAggregationName, oDefaultForCreation);
	};

	SelectDialog.prototype.indexOfAggregation = function (sAggregationName, oObject) {
		return this._callMethodInManagedObject("indexOfAggregation", sAggregationName, oObject);
	};

	SelectDialog.prototype.insertAggregation = function (sAggregationName, oObject, iIndex, bSuppressInvalidate) {
		this._callMethodInManagedObject("insertAggregation", sAggregationName, oObject, iIndex, bSuppressInvalidate);
		return this;
	};

	SelectDialog.prototype.addAggregation = function (sAggregationName, oObject, bSuppressInvalidate) {
		this._callMethodInManagedObject("addAggregation", sAggregationName, oObject, bSuppressInvalidate);
		return this;
	};

	SelectDialog.prototype.removeAggregation = function (sAggregationName, oObject, bSuppressInvalidate) {
		return this._callMethodInManagedObject("removeAggregation", sAggregationName, oObject, bSuppressInvalidate);
	};

	SelectDialog.prototype.removeAllAggregation = function (sAggregationName, bSuppressInvalidate) {
		return this._callMethodInManagedObject("removeAllAggregation", sAggregationName, bSuppressInvalidate);
	};

	SelectDialog.prototype.destroyAggregation = function (sAggregationName, bSuppressInvalidate) {
		this._callMethodInManagedObject("destroyAggregation", sAggregationName, bSuppressInvalidate);
		return this;
	};

	SelectDialog.prototype.getBinding = function (sAggregationName) {
		return this._callMethodInManagedObject("getBinding", sAggregationName);
	};


	SelectDialog.prototype.getBindingInfo = function (sAggregationName) {
		return this._callMethodInManagedObject("getBindingInfo", sAggregationName);
	};

	SelectDialog.prototype.getBindingPath = function (sAggregationName) {
		return this._callMethodInManagedObject("getBindingPath", sAggregationName);
	};

	SelectDialog.prototype.getBindingContext = function (sModelName) {
		return this._oList.getBindingContext(sModelName);
	};

	/*
	 * Set the binding context for the internal list AND the current control so that
	 * both controls can be used with the context
	 * @override
	 * @public
	 * @param {sap.ui.model.Context} oContext The new context
	 * @param {string} sModelName The optional model name
	 * @returns {sap.m.SelectDialog} this pointer for chaining
	 */

	SelectDialog.prototype._setBindingContext = SelectDialog.prototype.setBindingContext;
	SelectDialog.prototype.setBindingContext = function (oContext, sModelName) {
		var args = Array.prototype.slice.call(arguments);

		// pass the model to the list and also to the local control to allow binding of own properties
		this._oList.setBindingContext(oContext, sModelName);
		SelectDialog.prototype._setBindingContext.apply(this, args);

		return this;
	};

	/* =========================================================== */
	/*           end: forward aggregation  methods to List       */
	/* =========================================================== */

	/* =========================================================== */
	/*           begin: internal methods and properties            */
	/* =========================================================== */

	/*
	 * Fires the search event. This function is called whenever a search related parameter or the value in the search field is changed
	 * @private
	 * @param {string} sValue The new filter value or undefined if called by management functions
	 * @param {string} sEventType The search field event type that has been called (liveChange / search)
	 * @returns {sap.m.SelectDialog} this pointer for chaining
	 */
	SelectDialog.prototype._executeSearch = function (sValue, sEventType) {

		var oList = this._oList,
			oBinding = (oList ? oList.getBinding("items") : undefined),
			bSearchValueDifferent = (this._sSearchFieldValue !== sValue); // to prevent unwanted duplicate requests

		// BCP #1472004019/2015: focus after liveChange event is not changed
		if (sEventType === "liveChange") {
			this._bLiveChange = true;
		}

		// fire either the Search event or the liveChange event when dialog is opened.
		// 1) when the clear icon is called then both liveChange and search events are fired but we only want to process the first one
		// 2) when a livechange has been triggered by typing we don't want the next search event to be processed (typing + enter or typing + search button)
		if (this._oDialog.isOpen() && ((bSearchValueDifferent && sEventType === "liveChange") || sEventType === "search")) {
			// set the internal value to the passed value to check if the same value has already been filtered (happens when clear is called, it fires liveChange and change events)
			this._sSearchFieldValue = sValue;

			// only set when the binding has already been executed
			if (oBinding) {
				// we made another request in this control, so we update the counter
				this._iListUpdateRequested += 1;
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

	/*
	 * Internal function that shows/hides a local busy indicator and hides/shows the list
	 * based on the parameter flag. For the first request, the search field is also hidden.
	 * @private
	 * @param {boolean} bBusy flag (true = show, false = hide)
	 */
	SelectDialog.prototype._setBusy = function (bBusy) {
		if (this._iListUpdateRequested) { // check if the event was caused by our control
			if (bBusy) {
				if (this._bFirstRequest) { // also disable the search field for the first request
					this._oSearchField.setEnabled(false);
				}
				this._oList.addStyleClass('sapMSelectDialogListHide');
				this._oBusyIndicator.$().css('display', 'inline-block');
			} else {
				if (this._bFirstRequest) { // also enable the search field again for the first request
					this._oSearchField.setEnabled(true);
				}
				this._oList.removeStyleClass('sapMSelectDialogListHide');
				this._oBusyIndicator.$().css('display', 'none');
			}
		}
	};

	/*
	 * Event function that is called when the model sent a request to update the data.
	 * It shows a busy indicator and hides searchField and list in the dialog.
	 * @private
	 * @param {jQuery.EventObject} oEvent The event object
	 */
	SelectDialog.prototype._updateStarted = function (oEvent) {
		if (this.getModel() && this.getModel() instanceof sap.ui.model.odata.ODataModel) {
			if (this._oDialog.isOpen() && this._iListUpdateRequested) {
				// only set busy mode when we have an oData model
				this._setBusy(true);
			} else {
				this._bInitBusy = true;
			}
		}
	};

	/*
	 * Event function that is called when the model request is finished.
	 * It hides the busy indicator and shows searchField and list in the dialog.
	 * @private
	 * @param {jQuery.EventObject} oEvent The event object
	 */
	SelectDialog.prototype._updateFinished = function (oEvent) {
	// only reset busy mode when we have an oData model
	this._updateSelectionIndicator();
	if (this.getModel() && this.getModel() instanceof sap.ui.model.odata.ODataModel) {
		this._setBusy(false);
		this._bInitBusy = false;
	}
	if (sap.ui.Device.system.desktop) {

		if (this._oList.getItems()[0]) {
			this._oDialog.setInitialFocus(this._oList.getItems()[0]);
		} else {
			this._oDialog.setInitialFocus(this._oSearchField);
		}

		// set initial focus manually after all items are visible
		if (this._bFirstRequest && !this._bLiveChange) {
			var oFocusControl = this._oList.getItems()[0];
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
	this._iListUpdateRequested = 0;
	};

	/*
	 * Lazy load the ok button if needed for MultiSelect mode
	 * @private
	 * @returns {sap.m.Button} the button
	 */
	SelectDialog.prototype._getOkButton = function () {
		var that = this,
			fnOKAfterClose = null;

		fnOKAfterClose = function () {
			that._oSelectedItem = that._oList.getSelectedItem();
			that._aSelectedItems = that._oList.getSelectedItems();

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

	/*
	 * Lazy load the cancel button
	 * @private
	 * @returns {sap.m.Button} the button
	 */
	SelectDialog.prototype._getCancelButton = function () {
		var that = this;

		if (!this._oCancelButton) {
			this._oCancelButton = new Button(this.getId() + "-cancel", {
				text: this._oRb.getText("MSGBOX_CANCEL"),
				press: function (oEvent) {
					that._onCancel();
				}
			});
		}
		return this._oCancelButton;
	};

	/*
	 * Internal event handler for the cancel button and ESC key
	 * @private
	 */
	SelectDialog.prototype._onCancel = function (oEvent) {
		var that = this,
			fnAfterClose = null;

		fnAfterClose = function () {
				// reset internal selection values
				that._oSelectedItem = null;
				that._aSelectedItems = [];
				that._sSearchFieldValue = null;

				// detach this function
				that._oDialog.detachAfterClose(fnAfterClose);

				// reset selection to the previous selection
				// CSN# 1166619/2014: selections need to be restored before the cancel event is fired because the filter is usually reset in the cancel event
				that._resetSelection();

				// fire cancel event
				that.fireCancel();
			};

		// attach the reset function to afterClose to hide the dialog changes from the end user
		this._oDialog.attachAfterClose(fnAfterClose);
		this._oDialog.close();
	};

	/*
	 * Internal function to update the selection indicator bar
	 * @private
	 */
	SelectDialog.prototype._updateSelectionIndicator = function () {
		var iSelectedContexts = this._oList.getSelectedContexts(true).length,
			oInfoBar = this._oList.getInfoToolbar();

		// update the selection label
		oInfoBar.setVisible(!!iSelectedContexts);
		oInfoBar.getContent()[0].setText(this._oRb.getText("TABLESELECTDIALOG_SELECTEDITEMS", [iSelectedContexts]));
	};

	/*
	 * Internal function to fire the confirm event and to update the selection of the list.
	 * The function is called on pressing ok and on close in single select mode
	 * @private
	 */
	SelectDialog.prototype._fireConfirmAndUpdateSelection = function () {
		// fire confirm event with current selection
		this.fireConfirm({
			selectedItem: this._oSelectedItem,
			selectedItems: this._aSelectedItems,
			selectedContexts: this._oList.getSelectedContexts(true)
		});
		this._updateSelection();
	};

	/*
	 * Internal function to remove/keep the list selection based on property "rememberSelection"
	 * @private
	 */
	SelectDialog.prototype._updateSelection = function () {
		// cleanup old selection on close to allow reuse of dialog
		// due to the delayed call (dialog onAfterClose) the control could be already destroyed
		if (!this.getRememberSelections() && !this.bIsDestroyed) {
			this._oList.removeSelections(true);
			delete this._oSelectedItem;
			delete this._aSelectedItems;
		}
	};

	/*
	 * Internal function to reset the selection to the items that were selected when the dialog was opened
	 * @private
	 */
	SelectDialog.prototype._resetSelection = function () {
		// due to the delayed call (dialog onAfterClose) the control could be already destroyed
		if (!this.bIsDestroyed) {
			// force-remove the current selection from the list
			this._oList.removeSelections(true);
			// reset the selection to the selected context paths stored in the open method
			this._oList.setSelectedContextPaths(this._aInitiallySelectedContextPaths);
			// reset the selection on the list manually
			this._oList.getItems().forEach(function (oItem) {
				var sPath = oItem.getBindingContextPath();
				if (sPath && this._aInitiallySelectedContextPaths.indexOf(sPath) > -1) {
					oItem.setSelected(true);
				}
			}, this);
		}
	};


	/* =========================================================== */
	/*           end: internal methods                             */
	/* =========================================================== */

	return SelectDialog;

}, /* bExport= */ true);
