/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['jquery.sap.global', "sap/m/semantic/SemanticPage", "sap/m/semantic/SemanticConfiguration", "sap/m/semantic/SemanticPageRenderer", "sap/m/semantic/SegmentedContainer", "sap/m/semantic/ShareMenu", "sap/m/ActionSheet", "sap/m/Button"],
		function(jQuery, SemanticPage, SemanticConfiguration, SemanticPageRenderer, SegmentedContainer, ShareMenu, ActionSheet, Button) {
	"use strict";

	/**
	 * Constructor for a new ShareMenuPage
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * A ShareMenuPage is a {@link sap.m.semantic.SemanticPage} with support for "share" menu in the footer.
	 *
	 * @extends sap.m.semantic.SemanticPage
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @since 1.30.0
	 * @alias sap.m.semantic.ShareMenuPage
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */

	var ShareMenuPage = SemanticPage.extend("sap.m.semantic.ShareMenuPage", /** @lends sap.m.semantic.ShareMenuPage.prototype */ {
		metadata: {

			aggregations: {

				/**
				 * Custom share menu buttons
				 */
				customShareMenuContent: {
					type: "sap.m.Button",
					multiple: true,
					singularName: "customShareMenuContent"
				},

				/**
				 * Wrapped instance of {@link sap.m.ActionSheet}
				 */
				_actionSheet: {
					type: "sap.m.ActionSheet",
					multiple: false,
					visibility: "hidden"
				}

			}
		},
		renderer: SemanticPageRenderer.render
	});

	ShareMenuPage.prototype._getSemanticPositionsMap = function (oControl, oConfig) {

		if (!this._oPositionsMap) {
			this._oPositionsMap = SemanticPage.prototype._getSemanticPositionsMap.apply(this, arguments);
			this._oPositionsMap[SemanticConfiguration.prototype._PositionInPage.shareMenu] = {
				oContainer: this._getSegmentedShareMenu().getSection("semantic"),
				sAggregation: "content"
			};
		}

		return this._oPositionsMap;
	};

	ShareMenuPage.prototype.exit = function () {

		SemanticPage.prototype.exit.apply(this, arguments);

		if (this._oSegmentedShareMenu) {
			this._oSegmentedShareMenu.destroy();
			this._oSegmentedShareMenu = null;
		}
	};

	/*

	 SHARE MENU (CUSTOM CONTENT)
	 */

	ShareMenuPage.prototype.getCustomShareMenuContent = function () {
		return this._getSegmentedShareMenu().getSection("custom").getContent();
	};

	ShareMenuPage.prototype.addCustomShareMenuContent = function (oButton, bSuppressInvalidate) {
		this._getSegmentedShareMenu().getSection("custom").addContent(oButton, bSuppressInvalidate);
		return this;
	};

	ShareMenuPage.prototype.indexOfCustomShareMenuContent = function (oButton) {
		return this._getSegmentedShareMenu().getSection("custom").indexOfContent(oButton);
	};

	ShareMenuPage.prototype.insertCustomShareMenuContent = function (oButton, iIndex, bSuppressInvalidate) {
		this._getSegmentedShareMenu().getSection("custom").insertContent(oButton, iIndex, bSuppressInvalidate);
		return this;
	};

	ShareMenuPage.prototype.removeCustomShareMenuContent = function (oButton, bSuppressInvalidate) {
		return this._getSegmentedShareMenu().getSection("custom").removeContent(oButton, bSuppressInvalidate);
	};

	ShareMenuPage.prototype.removeAllCustomShareMenuContent = function (bSuppressInvalidate) {
		return this._getSegmentedShareMenu().getSection("custom").removeAllContent(bSuppressInvalidate);
	};

	ShareMenuPage.prototype.destroyCustomShareMenuContent = function (bSuppressInvalidate) {

		var aChildren = this.getCustomShareMenuContent();

		if (!aChildren) {
			return this;
		}

		// set suppress invalidate flag
		if (bSuppressInvalidate) {
			this.iSuppressInvalidate++;
		}

		this._getSegmentedShareMenu().getSection("custom").destroy();

		if (!this.isInvalidateSuppressed()) {
			this.invalidate();
		}

		// reset suppress invalidate flag
		if (bSuppressInvalidate) {
			this.iSuppressInvalidate--;
		}

		return this;
	};

	/**
	 * Create the internal action sheet of the "share" menu
	 * @returns {sap.m.IBar}
	 * @private
	 */
	ShareMenuPage.prototype._getActionSheet = function () {

		var oActionSheet = this.getAggregation("_actionSheet");
		if (!oActionSheet) {
			this.setAggregation("_actionSheet", new ActionSheet(
					{placement: sap.m.PlacementType.Top}));
			oActionSheet = this.getAggregation("_actionSheet");
		}

		return oActionSheet;
	};

	ShareMenuPage.prototype._getSegmentedShareMenu = function() {
		if (!this._oSegmentedShareMenu) {

			var oShareMenu = new ShareMenu(this._getActionSheet());
			var oShareMenuBtn = oShareMenu.getBaseButton();

			if (oShareMenu && oShareMenuBtn) {
				this._oSegmentedShareMenu = new SegmentedContainer(oShareMenu);
				this._oSegmentedShareMenu.addSection({sTag: "custom"});
				this._oSegmentedShareMenu.addSection({sTag: "semantic"});

				this._getSegmentedFooter().addSection({
					sTag: "shareMenu",
					aContent: [oShareMenuBtn]
				});
			}
		}
		return this._oSegmentedShareMenu;
	};

	return ShareMenuPage;
}, /* bExport= */ false);
