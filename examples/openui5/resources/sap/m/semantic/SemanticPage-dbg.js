/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['jquery.sap.global', 'sap/m/semantic/SegmentedContainer', 'sap/m/semantic/SemanticConfiguration','sap/m/Button', 'sap/m/Title', 'sap/m/ActionSheet', 'sap/m/Page', 'sap/m/OverflowToolbar', 'sap/m/OverflowToolbarButton', 'sap/m/OverflowToolbarLayoutData', 'sap/m/ToolbarSpacer', 'sap/m/Bar', 'sap/ui/core/CustomData', 'sap/ui/base/ManagedObject'],
function (jQuery, SegmentedContainer, SemanticConfiguration, Button, Title, ActionSheet, Page, OverflowToolbar, OverflowToolbarButton, OverflowToolbarLayoutData, ToolbarSpacer, Bar, CustomData, ManagedObject) {
	"use strict";

	/**
	 * Constructor for a new SemanticPage
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * A semantic page is an enhanced {@link sap.m.Page}, that can contain controls with semantic meaning @see sap.m.semantic.SemanticControl.<br>
	 *
	 * Content specified in the {@link sap.m.semantic.SemanticPage#semanticControls} aggregations will be automatically positioned in dedicated sections of the footer or the header of the page, depending on the control's semantics.<br>
	 * For example, a semantic button of type {@link sap.m.semantic.PositiveAction} will be positioned in the right side of the footer, and in logically correct sequence order with respect to any other included semantic controls.<br>
	 *
	 * The full list of what we internally define for semantic content is:
	 *  <ul>
	 *      <li>Visual properties (e.g. AddAction will be styled as an icon button)</li>
	 *      <li>Position in the page (UX guidelines specify that some buttons should be in the header only, while others are in the footer or the "share" menu, so we do the correct positioning)</li>
	 *      <li>Sequence order (UX guidelines define a specific sequence order of semantic controls with respect to each other)</li>
	 *      <li>Default localized tooltip for icon-only buttons</li>
	 *      <li>Overflow behavior (UX quidelines define which buttons are allowed to go to the overflow of the toolbar when the screen gets narrower). For icon buttons, we ensure that the text label of the button appears when the button is in overflow, as specified by UX.</li>
	 *      <li>Screen reader support (invisible text for reading the semantic type)</li>
	 *  </ul>
	 *
	 * In addition to the predefined semantic controls, the SemanticPage can host also custom application-provided controls. It preserves most of the API of {@link sap.m.Page} for specifying page content.<br>
	 *
	 * @extends sap.ui.core.Control
	 * @abstract
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @since 1.30.0
	 * @alias sap.m.semantic.SemanticPage
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var SemanticPage = sap.ui.core.Control.extend("sap.m.semantic.SemanticPage", /** @lends sap.m.semantic.SemanticPage.prototype */ {
		metadata: {

			properties: {

				/**
				 * See {@link sap.m.Page#title}
				 */
				title: {
					type: "string",
					group: "Misc",
					defaultValue: null
				},

				/**
				 * See {@link sap.m.Page#titleLevel}
				 */
				titleLevel: {
					type: "sap.ui.core.TitleLevel",
					group: "Appearance",
					defaultValue: sap.ui.core.TitleLevel.Auto
				},

				/**
				 * See {@link sap.m.Page#showNavButton}
				 */
				showNavButton: {
					type: "boolean",
					group: "Appearance",
					defaultValue: false
				},

				/**
				 * See {@link sap.m.Page#showSubHeader}
				 */
				showSubHeader: {
					type: "boolean",
					group: "Appearance",
					defaultValue: true
				},

				/**
				 * See {@link sap.m.Page#enableScrolling}
				 */
				enableScrolling: {
					type: "boolean",
					group: "Behavior",
					defaultValue: true
				},

				/**
				 * Hides or shows the page footer
				 */
				showFooter: {
					type: "boolean",
					group: "Appearance",
					defaultValue: true
				}
			},
			defaultAggregation: "content",
			aggregations: {
				/**
				 * See {@link sap.m.Page#subHeader}
				 */
				subHeader: {
					type: "sap.m.IBar",
					multiple: false
				},

				/**
				 * See {@link sap.m.Page#content}
				 */
				content: {
					type: "sap.ui.core.Control",
					multiple: true,
					singularName: "content"
				},

				/**
				 * Custom header buttons
				 */
				customHeaderContent: {
					type: "sap.m.Button",
					multiple: true,
					singularName: "customHeaderContent"
				},

				/**
				 * Custom footer buttons
				 */
				customFooterContent: {
					type: "sap.m.Button",
					multiple: true,
					singularName: "customFooterContent"
				},

				/**
				 * Wrapped instance of {@link sap.m.Page}
				 */
				_page: {
					type: "sap.m.Page",
					multiple: false,
					visibility: "hidden"
				}

			},
			events: {

				/**
				 * See {@link sap.m.Page#navButtonPress}
				 */
				navButtonPress: {}
			}
		}
	});

	SemanticPage.prototype.init = function () {

		this._currentMode = SemanticConfiguration._PageMode.display;
		this._getPage().setCustomHeader(this._getInternalHeader());
		this._getPage().setFooter(new OverflowToolbar(this.getId() + "-footer"));
	};

	/**
	 * Function is called when exiting the control.
	 *
	 * @private
	 */
	SemanticPage.prototype.exit = function () {

		if (this._oInternalHeader) {
			this._oInternalHeader.destroy();
			this._oInternalHeader = null;
		}

		if (this._oWrappedFooter) {
			this._oWrappedFooter.destroy();
			this._oWrappedFooter = null;
		}

		this._oPositionsMap = null;
	};

	SemanticPage.prototype.setSubHeader = function (oSubHeader, bSuppressInvalidate) {
		this._getPage().setSubHeader(oSubHeader, bSuppressInvalidate);
		return this;
	};

	SemanticPage.prototype.getSubHeader = function () {
		return this._getPage().getSubHeader();
	};

	SemanticPage.prototype.destroySubHeader = function (bSuppressInvalidate) {
		this._getPage().destroySubHeader(bSuppressInvalidate);
		return this;
	};

	SemanticPage.prototype.getShowSubHeader = function () {
		return this._getPage().getShowSubHeader();
	};

	SemanticPage.prototype.setShowSubHeader = function (bShowSubHeader, bSuppressInvalidate) {
		this._getPage().setShowSubHeader(bShowSubHeader, bSuppressInvalidate);
		this.setProperty("showSubHeader", bShowSubHeader, true);
		return this;
	};

	SemanticPage.prototype.getShowFooter = function () {
		return this._getPage().getShowFooter();
	};

	SemanticPage.prototype.setShowFooter = function (bShowFooter, bSuppressInvalidate) {
		this._getPage().setShowFooter(bShowFooter, bSuppressInvalidate);
		this.setProperty("showFooter", bShowFooter, true);
		return this;
	};

	/*

	 INNER CONTENT
	 */

	SemanticPage.prototype.getContent = function () {
		return this._getPage().getContent();
	};

	SemanticPage.prototype.addContent = function (oControl, bSuppressInvalidate) {
		this._getPage().addContent(oControl, bSuppressInvalidate);
		return this;
	};

	SemanticPage.prototype.indexOfContent = function (oControl) {
		return this._getPage().indexOfContent(oControl);
	};

	SemanticPage.prototype.insertContent = function (oControl, iIndex, bSuppressInvalidate) {
		this._getPage().insertContent(oControl, iIndex, bSuppressInvalidate);
		return this;
	};

	SemanticPage.prototype.removeContent = function (oControl, bSuppressInvalidate) {
		return this._getPage().removeContent(oControl, bSuppressInvalidate);
	};

	SemanticPage.prototype.removeAllContent = function (bSuppressInvalidate) {
		return this._getPage().removeAllContent(bSuppressInvalidate);
	};

	SemanticPage.prototype.destroyContent = function (bSuppressInvalidate) {
		this._getPage().destroyContent(bSuppressInvalidate);
		return this;
	};

	SemanticPage.prototype.setTitle = function (sTitle) {
		var oTitle = this._getTitle();

		if (oTitle) {
			oTitle.setText(sTitle);
			if (!oTitle.getParent()) {
				this._getInternalHeader().addContentMiddle(oTitle);
			}
		}

		this.setProperty("title", sTitle, true);
		return this;
	};

	SemanticPage.prototype.setTitleLevel = function (sTitleLevel) {
		this.setProperty("titleLevel", sTitleLevel, true);
		this._getTitle().setLevel(sTitleLevel);
		return this;
	};

	SemanticPage.prototype.setShowNavButton = function (bShow) {
		var oButton = this._getNavButton();
		if (oButton) {
			oButton.setVisible(bShow);

			if (!oButton.getParent()) {
				this._getInternalHeader().addContentLeft(oButton);
			}
		}

		this.setProperty("showNavButton", bShow, true);
		return this;
	};

	SemanticPage.prototype.setEnableScrolling = function (bEnable) {
		this._getPage().setEnableScrolling(bEnable);
		this.setProperty("enableScrolling", bEnable, true);
		return this;
	};

	/*

	 FOOTER RIGHT (CUSTOM CONTENT)
	 */

	SemanticPage.prototype.getCustomFooterContent = function () {
		return this._getSegmentedFooter().getSection("customRight").getContent();
	};

	SemanticPage.prototype.addCustomFooterContent = function (oControl, bSuppressInvalidate) {
		this._getSegmentedFooter().getSection("customRight").addContent(oControl, bSuppressInvalidate);
		return this;
	};

	SemanticPage.prototype.indexOfCustomFooterContent = function (oControl) {
		return this._getSegmentedFooter().getSection("customRight").indexOfContent(oControl);
	};

	SemanticPage.prototype.insertCustomFooterContent = function (oControl, iIndex, bSuppressInvalidate) {
		this._getSegmentedFooter().getSection("customRight").insertContent(oControl, iIndex, bSuppressInvalidate);
		return this;
	};

	SemanticPage.prototype.removeCustomFooterContent = function (oControl, bSuppressInvalidate) {
		return this._getSegmentedFooter().getSection("customRight").removeContent(oControl, bSuppressInvalidate);
	};

	SemanticPage.prototype.removeAllCustomFooterContent = function (bSuppressInvalidate) {
		return this._getSegmentedFooter().getSection("customRight").removeAllContent(bSuppressInvalidate);
	};

	SemanticPage.prototype.destroyCustomFooterContent = function (bSuppressInvalidate) {

		var aChildren = this.getCustomFooterContent();

		if (!aChildren) {
			return this;
		}

		// set suppress invalidate flag
		if (bSuppressInvalidate) {
			this.iSuppressInvalidate++;
		}

		this._getSegmentedFooter().getSection("customRight").destroy(bSuppressInvalidate);

		if (!this.isInvalidateSuppressed()) {
			this.invalidate();
		}

		// reset suppress invalidate flag
		if (bSuppressInvalidate) {
			this.iSuppressInvalidate--;
		}

		return this;
	};

	/*

	 HEADER RIGHT (CUSTOM CONTENT)
	 */

	SemanticPage.prototype.getCustomHeaderContent = function () {
		return this._getSegmentedHeader().getSection("customRight").getContent();
	};

	SemanticPage.prototype.addCustomHeaderContent = function (oControl, bSuppressInvalidate) {
		this._getSegmentedHeader().getSection("customRight").addContent(oControl, bSuppressInvalidate);
		return this;
	};

	SemanticPage.prototype.indexOfCustomHeaderContent = function (oControl) {
		return this._getSegmentedHeader().getSection("customRight").indexOfContent(oControl);
	};

	SemanticPage.prototype.insertCustomHeaderContent = function (oControl, iIndex, bSuppressInvalidate) {
		this._getSegmentedHeader().getSection("customRight").insertContent(oControl, iIndex, bSuppressInvalidate);
		return this;
	};

	SemanticPage.prototype.removeCustomHeaderContent = function (oControl, bSuppressInvalidate) {
		return this._getSegmentedHeader().getSection("customRight").removeContent(oControl, bSuppressInvalidate);
	};

	SemanticPage.prototype.removeAllCustomHeaderContent = function (bSuppressInvalidate) {
		return this._getSegmentedHeader().getSection("customRight").removeAllContent(bSuppressInvalidate);
	};

	SemanticPage.prototype.destroyCustomHeaderContent = function (bSuppressInvalidate) {

		var aChildren = this.getCustomHeaderContent();

		if (!aChildren) {
			return this;
		}

		// set suppress invalidate flag
		if (bSuppressInvalidate) {
			this.iSuppressInvalidate++;
		}

		this._getSegmentedHeader().getSection("customRight").destroy(bSuppressInvalidate);

		if (!this.isInvalidateSuppressed()) {
			this.invalidate();
		}

		// reset suppress invalidate flag
		if (bSuppressInvalidate) {
			this.iSuppressInvalidate--;
		}

		return this;
	};

	SemanticPage.prototype.setAggregation = function(sAggregationName, oObject, bSuppressInvalidate) {

		var oAggregationInfo = this.getMetadata().getAggregations()[sAggregationName];
		if (oAggregationInfo && SemanticConfiguration.isKnownSemanticType(oAggregationInfo.type)) {

			if (oObject) {
				this._initMonitor(oObject);
				this._addToInnerAggregation(oObject._getControl(),
						SemanticConfiguration.getPositionInPage(oAggregationInfo.type),
						SemanticConfiguration.getSequenceOrderIndex(oAggregationInfo.type),
						bSuppressInvalidate);
			} else { //removing object
				var oObjectToRemove = ManagedObject.prototype.getAggregation.call(this, sAggregationName);
				if (oObjectToRemove) {
					this._stopMonitor(oObjectToRemove);
					this._removeFromInnerAggregation(oObjectToRemove._getControl(), SemanticConfiguration.getPositionInPage(oAggregationInfo.type), bSuppressInvalidate);
				}
			}
		}

		ManagedObject.prototype.setAggregation.call(this, sAggregationName, oObject, bSuppressInvalidate);
	};

	SemanticPage.prototype.destroyAggregation = function(sAggregationName, bSuppressInvalidate) {

		var oAggregationInfo = this.getMetadata().getAggregations()[sAggregationName];
		if (oAggregationInfo && SemanticConfiguration.isKnownSemanticType(oAggregationInfo.type)) {

			var oObject = ManagedObject.prototype.getAggregation.call(this, sAggregationName);
			if (oObject) {
				this._stopMonitor(oObject);
				if (!oObject._getControl().bIsDestroyed) {
					this._removeFromInnerAggregation(oObject._getControl(), SemanticConfiguration.getPositionInPage(oAggregationInfo.type), bSuppressInvalidate);
				}
			}
		}

		ManagedObject.prototype.destroyAggregation.call(this, sAggregationName, oObject, bSuppressInvalidate);
	};

	SemanticPage.prototype._getTitle = function () {
		if (!this._oTitle) {
			this._oTitle = new Title(this.getId() + "-title", {text: this.getTitle()});
		}
		return this._oTitle;
	};

	SemanticPage.prototype._getNavButton = function () {
		if (!this._oNavButton) {
			this._oNavButton = new Button(this.getId() + "-navButton", {
				type: sap.m.ButtonType.Up,
				tooltip: sap.ui.getCore().getLibraryResourceBundle("sap.m").getText("PAGE_NAVBUTTON_TEXT"),
				press: jQuery.proxy(this.fireNavButtonPress, this)
			});
		}
		return this._oNavButton;
	};

	SemanticPage.prototype._initMonitor = function (oSemanticControl) {

		var oConfig = oSemanticControl._getConfiguration();

		if (oConfig.triggers) { // control is defined to trigger a PageMode upon press
			oSemanticControl.attachEvent("press", this._updateCurrentMode, this);
		}

		var oStates = oConfig.states,
				that = this;
		if (oStates) {
			jQuery.each(SemanticConfiguration._PageMode, function (key, value) {
				if (oStates[key]) {
					that.attachEvent(key, oSemanticControl._onPageStateChanged, oSemanticControl);
				}
			});
		}
	};

	SemanticPage.prototype._stopMonitor = function (oSemanticControl) {

		oSemanticControl.detachEvent("press", this._updateCurrentMode, this);

		var oConfig = oSemanticControl._getConfiguration();
		var oStates = oConfig.states,
				that = this;
		if (oStates) {
			jQuery.each(SemanticConfiguration._PageMode, function (key, value) {
				if (oStates[key]) {
					that.detachEvent(key, oSemanticControl._onPageStateChanged, oSemanticControl);
				}
			});
		}
	};

	SemanticPage.prototype._updateCurrentMode = function (oEvent) {

		var oConfig = oEvent.oSource._getConfiguration();
		// update global state
		if (typeof oConfig.triggers === 'string') {
			this._currentMode = oConfig.triggers;
		} else {
			var iLength = oConfig.triggers.length; // control triggers more than one global state,
			// depending on current state (e.g. if toggle button)
			if (iLength && iLength > 0) {
				for (var iIndex = 0; iIndex < iLength; iIndex++) {

					var oTriggerConfig = oConfig.triggers[iIndex];
					if (oTriggerConfig && (oTriggerConfig.inState === this._currentMode)) {
						this._currentMode = oTriggerConfig.triggers;
						break;
					}
				}
			}
		}

		this.fireEvent(this._currentMode);
	};

	SemanticPage.prototype._removeFromInnerAggregation = function (oControl, sPosition, bSuppressInvalidate) {

		var oPositionInPage = this._getSemanticPositionsMap()[sPosition];
		if (oPositionInPage && oPositionInPage.oContainer && oPositionInPage.sAggregation) {
			oPositionInPage.oContainer["remove" + fnCapitalize(oPositionInPage.sAggregation)](oControl, bSuppressInvalidate);
		}
	};

	SemanticPage.prototype._addToInnerAggregation = function (oControl, sPosition, iOrder, bSuppressInvalidate) {

		if (!oControl || !sPosition) {
			return;
		}

		var oPositionInPage = this._getSemanticPositionsMap()[sPosition];

		if (!oPositionInPage || !oPositionInPage.oContainer || !oPositionInPage.sAggregation) {
			return;
		}

		if (typeof iOrder !== 'undefined') {
			oControl.addCustomData(new CustomData({key: "sortIndex", value: iOrder}));
		}

		return oPositionInPage.oContainer["add" + fnCapitalize(oPositionInPage.sAggregation)](oControl, bSuppressInvalidate);
	};

	SemanticPage.prototype._getSemanticPositionsMap = function (oControl, oConfig) {

		if (!this._oPositionsMap) {

			this._oPositionsMap = {};

			this._oPositionsMap[SemanticConfiguration.prototype._PositionInPage.headerLeft] = {
				oContainer: this._getInternalHeader(),
				sAggregation: "contentLeft"
			};

			this._oPositionsMap[SemanticConfiguration.prototype._PositionInPage.headerRight] = {
				oContainer: this._getSegmentedHeader().getSection("semanticRight"),
				sAggregation: "content"
			};

			this._oPositionsMap[SemanticConfiguration.prototype._PositionInPage.headerMiddle] = {
				oContainer: this._getInternalHeader(),
				sAggregation: "contentMiddle"
			};

			this._oPositionsMap[SemanticConfiguration.prototype._PositionInPage.footerLeft] = {
				oContainer: this._getSegmentedFooter().getSection("semanticLeft"),
				sAggregation: "content"
			};

			this._oPositionsMap[SemanticConfiguration.prototype._PositionInPage.footerRight_IconOnly] = {
				oContainer: this._getSegmentedFooter().getSection("semanticRight_IconOnly"),
				sAggregation: "content"
			};

			this._oPositionsMap[SemanticConfiguration.prototype._PositionInPage.footerRight_TextOnly] = {
				oContainer: this._getSegmentedFooter().getSection("semanticRight_TextOnly"),
				sAggregation: "content"
			};
		}

		return this._oPositionsMap;
	};


	/**
	 * Create internal page
	 * @returns {sap.m.Page}
	 * @private
	 */
	SemanticPage.prototype._getPage = function () {

		var oPage = this.getAggregation("_page");
		if (!oPage) {
			this.setAggregation("_page", new Page(this.getId() + "-page"));
			oPage = this.getAggregation("_page");
		}

		return oPage;
	};

	/**
	 * Create internal header
	 * @returns {sap.m.IBar}
	 * @private
	 */
	SemanticPage.prototype._getInternalHeader = function () {

		if (!this._oInternalHeader) {
			this._oInternalHeader = new Bar(this.getId() + "-intHeader");
		}

		return this._oInternalHeader;
	};

	/**
	 * Returns the custom or internal header
	 * @private
	 * @returns {sap.m.IBar}
	 */
	SemanticPage.prototype._getAnyHeader = function () {
		return this._getInternalHeader();
	};


	/**
	 * Returns the internal footer
	 * @private
	 * @returns {sap.m.semantic.SegmentedContainer}
	 */
	SemanticPage.prototype._getSegmentedHeader = function() {

		if (!this._oWrappedHeader) {

			var oHeader = this._getInternalHeader();
			if (!oHeader) {
				jQuery.sap.log.error("missing page header", this);
				return null;
			}

			this._oWrappedHeader = new SegmentedContainer(oHeader, "contentRight");

			this._oWrappedHeader.addSection({sTag: "customRight"});
			this._oWrappedHeader.addSection({sTag: "semanticRight"});

		}

		return this._oWrappedHeader;

	};

	/**
	 * Returns the internal footer
	 * @private
	 * @returns {sap.m.semantic.SegmentedContainer}
	 */
	SemanticPage.prototype._getSegmentedFooter = function() {

		if (!this._oWrappedFooter) {

			var oFooter = this._getPage().getFooter();
			if (!oFooter) {
				jQuery.sap.log.error("missing page footer", this);
				return null;
			}

			this._oWrappedFooter = new SegmentedContainer(oFooter);

			//add section for SEMANTIC content that should go on the left
			this._oWrappedFooter.addSection({sTag: "semanticLeft"});

			//add spacer to separate left from right
			this._oWrappedFooter.addSection({
				sTag: "spacer",
				aContent: [new ToolbarSpacer()]
			});

			//add section for SEMANTIC content that should go on the right;
			// REQUIREMENT: only TEXT-BUTTONS allowed in this section
			this._oWrappedFooter.addSection({
				sTag: "semanticRight_TextOnly",
				fnSortFunction: fnSortSemanticContent
			});

			//add section for CUSTOM content that should go on the right;
			this._oWrappedFooter.addSection({sTag: "customRight"});

			//add section for SEMANTIC content that should go on the right;
			// REQUIREMENT: only ICON-BUTTONS/ICON-SELECT allowed in this section
			this._oWrappedFooter.addSection({
				sTag: "semanticRight_IconOnly",
				fnSortFunction: fnSortSemanticContent
			});
		}

		return this._oWrappedFooter;

	};

	/*
	 helper functions
	 */
	function fnCapitalize(sName) {
		return sName.substring(0, 1).toUpperCase() + sName.substring(1);
	}

	function fnSortSemanticContent(oControl1, oControl2) {

		var iSortIndex1 = oControl1.data("sortIndex");
		var iSortIndex2 = oControl2.data("sortIndex");

		if ((typeof iSortIndex1 === 'undefined') ||
				(typeof iSortIndex2 === 'undefined')) {
			jQuery.sap.log.warning("sortIndex missing", this);
			return null;
		}

		return (iSortIndex1 - iSortIndex2);
	}

	return SemanticPage;
}, /* bExport= */ false);
