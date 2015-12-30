/*
 * ! UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.m.P13nDialog.
sap.ui.define([
	'jquery.sap.global', './Dialog', './IconTabBar', './IconTabFilter', './P13nDialogRenderer', './library', 'sap/ui/core/EnabledPropagator', 'jquery.sap.xml', 'sap/m/ButtonType'
], function(jQuery, Dialog, IconTabBar, IconTabFilter, P13nDialogRenderer, library, EnabledPropagator, ButtonType) {
	"use strict";

	/**
	 * Constructor for a new P13nDialog.
	 * 
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] initial settings for the new control
	 * @class The P13nDialog control provides a dialog that contains one or more panels. On each of the panels, one or more changes with regards to a
	 *        table can be processed. For example, a panel to set a column to invisible, change the order of the columns or a panel to sort or filter
	 *        tables.
	 * @extends sap.m.Dialog
	 * @author SAP SE
	 * @version 1.32.9
	 * @constructor
	 * @public
	 * @since 1.26.0
	 * @alias sap.m.P13nDialog
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var P13nDialog = Dialog.extend("sap.m.P13nDialog", /** @lends sap.m.P13nDialog.prototype */
	{
		metadata: {

			library: "sap.m",
			properties: {
				/**
				 * This property determines which panel is initially shown when dialog is opened. Due to extensibility reason the type should be
				 * <code>string</code>. So it is feasible to add a custom panel without expanding the type.
				 * 
				 * @since 1.26.0
				 */
				initialVisiblePanelType: {
					type: "string",
					group: "Misc",
					defaultValue: null
				},

				/**
				 * This property determines whether the 'Reset' button is shown inside the dialog. If this property is set to true, clicking the
				 * 'Reset' button will trigger the <code>reset</code> event sending a notification that model data must be reset.
				 * 
				 * @since 1.26.0
				 */
				showReset: {
					type: "boolean",
					group: "Appearance",
					defaultValue: false
				},
				/**
				 * Calls the validation listener once all panel-relevant validation checks have been done. This callback function is called in order
				 * to perform cross-model validation checks.
				 */
				validationExecutor: {
					type: "object",
					group: "Misc",
					defaultValue: null
				}
			},
			aggregations: {

				/**
				 * The dialog panels displayed in the dialog.
				 * 
				 * @since 1.26.0
				 */
				panels: {
					type: "sap.m.P13nPanel",
					multiple: true,
					singularName: "panel",
					bindable: "bindable"
				}
			},
			events: {

				/**
				 * Event fired if the 'ok' button in P13nDialog is clicked.
				 * 
				 * @since 1.26.0
				 */
				ok: {},
				/**
				 * Event fired if the 'cancel' button in P13nDialog is clicked.
				 * 
				 * @since 1.26.0
				 */
				cancel: {},
				/**
				 * Event fired if the 'reset' button in P13nDialog is clicked.
				 * 
				 * @since 1.26.0
				 */
				reset: {}
			}
		}
	});

	EnabledPropagator.apply(P13nDialog.prototype, [
		true
	]);

	P13nDialog.prototype.init = function(oEvent) {
		this.addStyleClass("sapMP13nDialog");
		Dialog.prototype.init.apply(this, arguments);
		this._oResourceBundle = sap.ui.getCore().getLibraryResourceBundle("sap.m");
		this._oResetButton = null;
		this._mValidationListener = {};
		this._createDialog();
	};

	P13nDialog.prototype.setShowReset = function(bShow) {
		if (this.getButtons() && this.getButtons()[2]) {
			this.getButtons()[2].setVisible(bShow);
		}
	};

	P13nDialog.prototype.addPanel = function(oPanel) {
		this.addAggregation("panels", oPanel);

		var oNavigationItem = this._mapPanelToNavigationItem(oPanel);
		oPanel.data(P13nDialogRenderer.CSS_CLASS + "NavigationItem", oNavigationItem);
		var oNavigationControl = this._getNavigationControl();
		if (oNavigationControl) {
			sap.ui.Device.system.phone ? oNavigationControl.addItem(oNavigationItem) : oNavigationControl.addButton(oNavigationItem);
		}

		// TODO: workaround because SegmentedButton does not raise event when we set the "selectedButton"
		this._setVisibilityOfPanel(oPanel);

		this._setDialogTitleFor(oPanel);

		return this;
	};

	P13nDialog.prototype.insertPanel = function(oPanel, iIndex) {
		this.insertAggregation("panels", oPanel, iIndex);

		var oNavigationItem = this._mapPanelToNavigationItem(oPanel);
		oPanel.data(P13nDialogRenderer.CSS_CLASS + "NavigationItem", oNavigationItem);
		var oNavigationControl = this._getNavigationControl();
		if (oNavigationControl) {
			sap.ui.Device.system.phone ? oNavigationControl.insertItem(oNavigationItem) : oNavigationControl.insertButton(oNavigationItem);
		}

		// TODO: workaround because SegmentedButton does not raise event when we set the "selectedButton"
		this._setVisibilityOfPanel(oPanel);

		this._setDialogTitleFor(oPanel);

		return this;
	};

	P13nDialog.prototype.removePanel = function(vPanel) {
		vPanel = this.removeAggregation("panels", vPanel);

		var oNavigationControl = this._getNavigationControl();
		if (oNavigationControl) {
			sap.ui.Device.system.phone ? oNavigationControl.removeItem(vPanel && this._getNavigationItemByPanel(vPanel)) : oNavigationControl.removeButton(vPanel && this._getNavigationItemByPanel(vPanel));
		}

		return vPanel;
	};

	P13nDialog.prototype.removeAllPanels = function() {
		var aPanels = this.removeAllAggregation("panels");
		var oNavigationControl = this._getNavigationControl();
		if (oNavigationControl) {
			sap.ui.Device.system.phone ? oNavigationControl.removeAllItems() : oNavigationControl.removeAllButtons();
		}

		return aPanels;
	};

	P13nDialog.prototype.destroyPanels = function() {
		this.destroyAggregation("panels");

		var oNavigationControl = this._getNavigationControl();
		if (oNavigationControl) {
			sap.ui.Device.system.phone ? oNavigationControl.destroyItems() : oNavigationControl.destroyButtons();
		}

		return this;
	};

	/**
	 * Create dialog depending on the device.
	 * 
	 * @private
	 */
	P13nDialog.prototype._createDialog = function() {
		if (sap.ui.Device.system.phone) {
			var that = this;
			this.setVerticalScrolling(false);
			this.setHorizontalScrolling(false);
			this.setCustomHeader(new sap.m.Bar({
				contentLeft: new sap.m.Button({
					visible: false,
					type: ButtonType.Back,
					press: function(oEvent) {
						that._backToList();
					}
				}),
				contentMiddle: new sap.m.Title({
					text: this._oResourceBundle.getText("P13NDIALOG_VIEW_SETTINGS"),
					level: "H1"
				})
			}));
			this.setBeginButton(this._createOKButton());
			this.setEndButton(this._createCancelButton());
		} else {
			this.setHorizontalScrolling(false);
			// according to consistency we adjust the content width of P13nDialog to the content width of value help dialog
			this.setContentWidth("65rem");
			this.setContentHeight("40rem");
			this.setDraggable(true);
			this.setTitle(this._oResourceBundle.getText("P13NDIALOG_VIEW_SETTINGS"));
			this.addButton(this._createOKButton());
			this.addButton(this._createCancelButton());
			this.addButton(this._createResetButton());
		}
	};

	/**
	 * Creates and returns navigation control depending on device.
	 * 
	 * @returns {sap.m.List | sap.m.SegmentedButton | null}
	 * @private
	 */
	P13nDialog.prototype._getNavigationControl = function() {
		if (this.getPanels().length < 2) {
			return null;
		}

		var that = this;
		if (sap.ui.Device.system.phone) {
			if (!this.getContent().length) {
				this.addContent(new sap.m.List({
					mode: sap.m.ListMode.None,
					itemPress: function(oEvent) {
						if (oEvent) {
							that._switchPanel(oEvent.getParameter("listItem"));
						}
					}
				}));
				// Add ListItem of first panel first
				this.getContent()[0].addItem(this._getNavigationItemByPanel(this.getPanels()[0]));
			}
			return this.getContent()[0];
		} else {
			if (!this.getSubHeader() || !this.getSubHeader().getContentLeft().length) {
				this.setSubHeader(new sap.m.Bar({
					contentLeft: [
						new sap.m.SegmentedButton({
							select: function(oEvent) {
								that._switchPanel(oEvent.getParameter("button"));
							},
							width: '100%'
						})
					]
				}));
				// Add button of first panel first
				this.getSubHeader().getContentLeft()[0].addButton(this._getNavigationItemByPanel(this.getPanels()[0]));
			}
			return this.getSubHeader().getContentLeft()[0];
		}
	};

	/**
	 * Show validation dialog
	 * 
	 * @private
	 */
	P13nDialog.prototype.showValidationDialog = function(fCallbackOK, aFailedPanelTypes, aValidationResult) {
		var sMessageText = "";
		aFailedPanelTypes.forEach(function(sPanelType) {
			switch (sPanelType) {
				case sap.m.P13nPanelType.filter:
					sMessageText = "• " + sap.ui.getCore().getLibraryResourceBundle("sap.m").getText("P13NDIALOG_VALIDATION_MESSAGE") + "\n" + sMessageText;
					break;
				case sap.m.P13nPanelType.columns:
					sMessageText = "• " + sap.ui.getCore().getLibraryResourceBundle("sap.m").getText("P13NDIALOG_VISIBLE_ITEMS_THRESHOLD_MESSAGE") + "\n" + sMessageText;
					break;
			}
		});
		for ( var sType in aValidationResult) {
			var oMessage = aValidationResult[sType];
			sMessageText = "• " + oMessage.messageText + "\n" + sMessageText;
		}
		jQuery.sap.require("sap.m.MessageBox");
		sap.m.MessageBox.show(sMessageText, {
			icon: sap.m.MessageBox.Icon.WARNING,
			title: sap.ui.getCore().getLibraryResourceBundle("sap.m").getText("P13NDIALOG_VALIDATION_TITLE"),
			actions: [
				sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL
			],
			onClose: function(oAction) {
				// CANCLE: Stay on the current panel. There is incorrect entry and user decided to correct this.
				// OK: Go to the chosen panel. Though the current panel has incorrect entry the user decided to
				// leave the current panel. Delete incorrect condition set.
				if (oAction === sap.m.MessageBox.Action.OK) {
					fCallbackOK();
				}
			},
			styleClass: !!this.$().closest(".sapUiSizeCompact").length ? "sapUiSizeCompact" : ""
		});
	};

	/**
	 * Map an item of type sap.m.P13nPanel to an item of type sap.m.IconTabBarFilter
	 * 
	 * @param {sap.m.P13nPanel} oItem
	 * @returns {sap.m.Button | sap.m.StandardListItem | null}
	 * @private
	 * @name P13nDialog#_mapPanelToNavigationItem
	 * @function
	 */
	P13nDialog.prototype._mapPanelToNavigationItem = function(oPanel) {
		if (!oPanel) {
			return null;
		}
		var oNavigationItem = null;
		if (sap.ui.Device.system.phone) {
			oNavigationItem = new sap.m.StandardListItem({
				type: sap.m.ListType.Navigation,
				title: oPanel.getBindingPath("title") ? jQuery.extend(true, {}, oPanel.getBindingInfo("title")) : oPanel.getTitle()
			});
		} else {
			oNavigationItem = new sap.m.Button({
				type: ButtonType.Default,
				text: oPanel.getBindingPath("title") ? jQuery.extend(true, {}, oPanel.getBindingInfo("title")) : oPanel.getTitle()
			});
			// oNavigationItem.addDelegate({
			// ontap: function(oEvent) {
			// var oButtonClicked = oEvent.srcControl;
			// var oPanelVisible = this.getVisiblePanel();
			//
			// if (oPanelVisible && oPanelVisible.onBeforeNavigationFrom && !oPanelVisible.onBeforeNavigationFrom()) {
			// oEvent.stopImmediatePropagation(true);
			// var that = this;
			// var fCallbackOK = function() {
			//
			// oPanelVisible.onAfterNavigationFrom();
			// if (that._getSegmentedButton()) {
			// that._getSegmentedButton().setSelectedButton(oButtonClicked);
			// }
			// that._switchPanel(oButtonClicked);
			// };
			// this._showValidationDialog(fCallbackOK, [
			// oPanelVisible.getType()
			// ]);
			// }
			// }
			// }, true, this);
		}
		oPanel.setValidationExecutor(jQuery.proxy(this._callValidationExecutor, this));
		oPanel.setValidationListener(jQuery.proxy(this._registerValidationListener, this));
		oNavigationItem.setModel(oPanel.getModel());
		return oNavigationItem;
	};

	/**
	 * Switch panel.
	 * 
	 * @private
	 */
	P13nDialog.prototype._switchPanel = function(oNavigationItem) {
		var oPanel = this._getPanelByNavigationItem(oNavigationItem);
		if (sap.ui.Device.system.phone) {
			var oNavigationControl = this._getNavigationControl();
			if (oNavigationControl) {
				oNavigationControl.setVisible(false);
				oPanel.beforeNavigationTo();
				oPanel.setVisible(true);
				this.getCustomHeader().getContentMiddle()[0].setText(oPanel.getTitle());
				this.getCustomHeader().getContentLeft()[0].setVisible(true);
			}
		} else {
			this.setVerticalScrolling(oPanel.getVerticalScrolling());
			this.getPanels().forEach(function(oPanel_) {
				if (oPanel_ === oPanel) {
					oPanel_.beforeNavigationTo();
					oPanel_.setVisible(true);
				} else {
					oPanel_.setVisible(false);
				}
			}, this);
		}
		this.invalidate();
		this.rerender();
	};

	/**
	 * Switch back to the list.
	 * 
	 * @private
	 */
	P13nDialog.prototype._backToList = function() {
		var oNavigationControl = this._getNavigationControl();
		if (oNavigationControl) {
			oNavigationControl.setVisible(true);
			var oPanel = this.getVisiblePanel();
			oPanel.setVisible(false);
			this._setDialogTitleFor(oPanel);
			this.getCustomHeader().getContentLeft()[0].setVisible(false);
		}
	};

	/**
	 * Returns visible panel.
	 * 
	 * @returns {sap.m.P13nPanel | null}
	 * @public
	 * @since 1.26.0
	 */
	P13nDialog.prototype.getVisiblePanel = function() {
		var oPanel = null;
		this.getPanels().some(function(oPanel_) {
			if (oPanel_.getVisible()) {
				oPanel = oPanel_;
				return true;
			}
		});
		return oPanel;
	};

	/**
	 * Returns panel.
	 * 
	 * @private
	 */
	P13nDialog.prototype._getPanelByNavigationItem = function(oNavigationItem) {
		for (var i = 0, aPanels = this.getPanels(), iPanelsLength = aPanels.length; i < iPanelsLength; i++) {
			if (aPanels[i].data(P13nDialogRenderer.CSS_CLASS + "NavigationItem") === oNavigationItem) {
				return aPanels[i];
			}
		}
		return null;
	};

	/**
	 * Returns NavigationItem.
	 * 
	 * @private
	 */
	P13nDialog.prototype._getNavigationItemByPanel = function(oPanel) {
		if (!oPanel) {
			return null;
		}
		return oPanel.data(P13nDialogRenderer.CSS_CLASS + "NavigationItem");
	};

	/**
	 * Set all panels to bVisible except of oPanel
	 * 
	 * @private
	 */
	P13nDialog.prototype._setVisibilityOfOtherPanels = function(oPanel, bVisible) {
		for (var i = 0, aPanels = this.getPanels(), iPanelsLength = aPanels.length; i < iPanelsLength; i++) {
			if (aPanels[i] === oPanel) {
				continue;
			}
			aPanels[i].setVisible(bVisible);
		}
	};

	/**
	 * Sets property 'visible' for oPanel regarding the 'initialVisiblePanelType' property and number of content objects.
	 * 
	 * @private
	 */
	P13nDialog.prototype._setVisibilityOfPanel = function(oPanel) {
		var bVisible;
		if (sap.ui.Device.system.phone) {
			bVisible = this.getPanels().length === 1;
			if (bVisible) {
				oPanel.beforeNavigationTo();
				if (!this.getModel()) {
					this.setModel(oPanel.getModel());
				}
			}
			oPanel.setVisible(bVisible);
			this._setVisibilityOfOtherPanels(oPanel, false);

		} else {
			bVisible = this.getInitialVisiblePanelType() === oPanel.getType() || this.getPanels().length === 1;
			if (bVisible) {
				oPanel.beforeNavigationTo();
				if (!this.getModel()) {
					this.setModel(oPanel.getModel());
				}
			}
			oPanel.setVisible(bVisible);
			if (bVisible) {
				this._setVisibilityOfOtherPanels(oPanel, false);
				this.setVerticalScrolling(oPanel.getVerticalScrolling());
				var oButton = this._getNavigationItemByPanel(oPanel);
				var oNavigationControl = this._getNavigationControl();
				if (oNavigationControl) {
					oNavigationControl.setSelectedButton(oButton);
				}
			}
		}
	};

	P13nDialog.prototype.onAfterRendering = function() {
		Dialog.prototype.onAfterRendering.apply(this, arguments);
		var oContent = jQuery(this.getFocusDomRef()).find(".sapMDialogScrollCont");
		var sId = this._getVisiblePanelID();
		if (sId && oContent) {
			// move panel div into dialog content div.
			var oPanel = jQuery.find("#" + sId);
			jQuery(oPanel).appendTo(jQuery(oContent));
		}
	};

	/**
	 * Determine panel id.
	 * 
	 * @private
	 */
	P13nDialog.prototype._getVisiblePanelID = function() {
		var oPanel = this.getVisiblePanel();
		if (oPanel) {
			return this.getId() + "-panel_" + oPanel.getId();
		}
		return null;
	};

	/**
	 * Sets title of dialog in regard to oPanel.
	 * 
	 * @private
	 */
	P13nDialog.prototype._setDialogTitleFor = function(oPanel) {
		var sTitle;
		if (this.getPanels().length > 1) {
			sTitle = this._oResourceBundle.getText("P13NDIALOG_VIEW_SETTINGS");
		} else {
			switch (oPanel.getType()) {
				case sap.m.P13nPanelType.filter:
					sTitle = this._oResourceBundle.getText("P13NDIALOG_TITLE_FILTER");
					break;
				case sap.m.P13nPanelType.sort:
					sTitle = this._oResourceBundle.getText("P13NDIALOG_TITLE_SORT");
					break;
				case sap.m.P13nPanelType.group:
					sTitle = this._oResourceBundle.getText("P13NDIALOG_TITLE_GROUP");
					break;
				case sap.m.P13nPanelType.columns:
					sTitle = this._oResourceBundle.getText("P13NDIALOG_TITLE_COLUMNS");
					break;
				default:
					sTitle = oPanel.getTitleLarge() || this._oResourceBundle.getText("P13NDIALOG_VIEW_SETTINGS");
			}
		}
		if (sap.ui.Device.system.phone) {
			this.getCustomHeader().getContentMiddle()[0].setText(sTitle);
		} else {
			this.setTitle(sTitle);
		}
	};

	/**
	 * Registers a listener in order to be notified about the validation result.
	 * 
	 * @param {sap.m.P13nPanel} oPanel - listener panel
	 * @param {object} fCallback - callback method
	 * @private
	 */
	P13nDialog.prototype._registerValidationListener = function(oPanel, fCallback) {
		if (this.getPanels().indexOf(oPanel) && fCallback && this._mValidationListener[oPanel.getType()] === undefined) {
			this._mValidationListener[oPanel.getType()] = fCallback;
		}
	};

	/**
	 * Calls the controller validation. Notifies the validation result to all registered panel listeners.
	 * 
	 * @private
	 */
	P13nDialog.prototype._callValidationExecutor = function() {
		var fValidate = this.getValidationExecutor();
		if (fValidate && !jQuery.isEmptyObject(this._mValidationListener)) {
			var oResultRaw = fValidate(this._getPayloadOfPanels());
			var oResult = this._distributeValidationResult(oResultRaw);
			// Publish the result to registered listeners
			for ( var sType in this._mValidationListener) {
				var fCallback = this._mValidationListener[sType];
				fCallback(oResult[sType] || []);
			}
		}
	};

	/**
	 * In case that validation has detected an issue belonging to some panels this issue is duplicated for them.
	 * 
	 * @param {object} aResult
	 */
	P13nDialog.prototype._distributeValidationResult = function(aResult) {
		var oDuplicateResult = {};
		aResult.forEach(function(oResult) {
			oResult.panelTypes.forEach(function(sType) {
				if (oDuplicateResult[sType] === undefined) {
					oDuplicateResult[sType] = [];
				}
				oDuplicateResult[sType].push({
					columnKey: oResult.columnKey,
					messageType: oResult.messageType,
					messageText: oResult.messageText
				});
			});
		});
		return oDuplicateResult;
	};

	/**
	 * Creates and returns OK Button
	 * 
	 * @returns {sap.m.Button}
	 * @private
	 */
	P13nDialog.prototype._createOKButton = function() {
		var that = this;
		return new sap.m.Button({
			text: this._oResourceBundle.getText("P13NDIALOG_OK"),
			press: function() {
				var oPayload = that._getPayloadOfPanels();
				var fFireOK = function() {
					that.fireOk({
						payload: oPayload
					});
				};
				var fCallbackOK = function() {
					that.getPanels().forEach(function(oPanel) {
						if (aFailedPanelTypes.indexOf(oPanel.getType()) > -1) {
							oPanel.onAfterNavigationFrom();
						}
					});
					fFireOK();
				};
				var aFailedPanelTypes = [];
				var aValidationResult = [];
				// Execute validation of controller
				var fValidate = that.getValidationExecutor();
				if (fValidate) {
					aValidationResult = fValidate(oPayload);
				}
				// Execute validation of panels
				that.getPanels().forEach(function(oPanel) {
					if (!oPanel.onBeforeNavigationFrom()) {
						aFailedPanelTypes.push(oPanel.getType());
					}
				});
				// In case of invalid panels show the dialog
				if (aFailedPanelTypes.length || aValidationResult.length) {
					that.showValidationDialog(fCallbackOK, aFailedPanelTypes, aValidationResult);
				} else {
					fFireOK();
				}
			}
		});
	};

	/**
	 * Creates and returns CANCEL Button
	 * 
	 * @returns {sap.m.Button}
	 * @private
	 */
	P13nDialog.prototype._createCancelButton = function() {
		var that = this;
		return new sap.m.Button({
			text: this._oResourceBundle.getText("P13NDIALOG_CANCEL"),
			press: function() {
				that.fireCancel();
			}
		});
	};

	/**
	 * Creates and returns RESET Button
	 * 
	 * @returns {sap.m.Button}
	 * @private
	 */
	P13nDialog.prototype._createResetButton = function() {
		var that = this;
		return new sap.m.Button({
			text: this._oResourceBundle.getText("P13NDIALOG_RESET"),
			visible: this.getShowReset(),
			press: function() {
				var oPayload = {};
				that.getPanels().forEach(function(oPanel) {
					oPayload[oPanel.getType()] = oPanel.getResetPayload();
				});
				that.fireReset({
					payload: oPayload
				});
			}
		});
	};

	P13nDialog.prototype._getPayloadOfPanels = function() {
		var oPayload = {};
		this.getPanels().forEach(function(oPanel) {
			oPayload[oPanel.getType()] = oPanel.getOkPayload();
		});
		return oPayload;
	};

	P13nDialog.prototype.exit = function() {
		Dialog.prototype.exit.apply(this, arguments);
	};

	return P13nDialog;
}, /* bExport= */true);
