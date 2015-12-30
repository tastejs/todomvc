/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['jquery.sap.global', './ListItemBaseRenderer', 'sap/ui/core/Renderer'],
	function(jQuery, ListItemBaseRenderer, Renderer) {
	"use strict";


	/**
	 * ObjectListItem renderer.
	 * @namespace
	 */
	var ObjectListItemRenderer = Renderer.extend(ListItemBaseRenderer);

	/**
	 * Renders the HTML for single line of Attribute and Status.
	 *
	 * @param {sap.ui.core.RenderManager}
	 *            rm the RenderManager that can be used for writing to the render output buffer
	 * @param {sap.m.ObjectListItem}
	 *            oLI an object to be rendered
	 * @param {sap.m.ObjectAttribute}
	 *            oAttribute an attribute to be rendered
	 * @param {sap.m.ObjectStatus}
	 *            oStatus a status to be rendered
	 */
	ObjectListItemRenderer.renderAttributeStatus = function(rm, oLI, oAttribute, oStatus) {

		if (!oAttribute && !oStatus || (oAttribute && oAttribute._isEmpty() && oStatus && oStatus._isEmpty())) {
			return; // nothing to render
		}

		rm.write("<div"); // Start attribute row container
		rm.addClass("sapMObjLAttrRow");
		rm.writeClasses();
		rm.write(">");

		if (oAttribute && !oAttribute._isEmpty()) {
			rm.write("<div");
			rm.addClass("sapMObjLAttrDiv");

			// Add padding to push attribute text down since it will be raised up due
			// to markers height
			if (oStatus && (!oStatus._isEmpty())) {
				if (oStatus instanceof Array) {
					rm.addClass("sapMObjAttrWithMarker");
				}
			}

			rm.writeClasses();

			if (!oStatus || oStatus._isEmpty()) {
				rm.addStyle("width", "100%");
				rm.writeStyles();
			}
			rm.write(">");
			rm.renderControl(oAttribute);
			rm.write("</div>");
		}

		if (oStatus && (!oStatus._isEmpty())) {
			rm.write("<div");
			rm.addClass("sapMObjLStatusDiv");

			// Object marker icons (flag, favorite) are passed as an array
			if (oStatus instanceof Array) {
				rm.addClass("sapMObjStatusMarker");
			}
			rm.writeClasses();
			if (!oAttribute || oAttribute._isEmpty()) {
				rm.addStyle("width", "100%");
				rm.writeStyles();
			}
			rm.write(">");
			if (oStatus instanceof Array) {
				while (oStatus.length > 0) {
					rm.renderControl(oStatus.shift());
				}
			} else {
				rm.renderControl(oStatus);
			}
			rm.write("</div>");
		}

		rm.write("</div>"); // Start attribute row container
	};

	/**
	 * Renders the HTML for the given control, using the provided
	 * {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager}
	 *          oRenderManager the RenderManager that can be used for writing to the
	 *          Render-Output-Buffer
	 * @param {sap.ui.core.Control}
	 *          oControl an object representation of the control that should be
	 *          rendered
	 */
	ObjectListItemRenderer.renderLIAttributes = function(rm, oLI) {
		rm.addClass("sapMObjLItem");
		rm.addClass("sapMObjLListModeDiv");
	};

	ObjectListItemRenderer.renderLIContent = function(rm, oLI) {
		var sTitleDir = oLI.getTitleTextDirection(),
			sIntroDir = oLI.getIntroTextDirection(),
			sNumberDir = oLI.getNumberTextDirection();

		// Introductory text at the top of the item, like "On behalf of Julie..."
		if (oLI.getIntro()) {
			rm.write("<div");
			rm.addClass("sapMObjLIntro");
			rm.writeClasses();
			rm.writeAttribute("id", oLI.getId() + "-intro");
			rm.write(">");
			rm.write("<span");
			//sets the dir attribute to "rtl" or "ltr" if a direction
			//for the intro text is provided explicitly
			if (sIntroDir !== sap.ui.core.TextDirection.Inherit) {
				rm.writeAttribute("dir", sIntroDir.toLowerCase());
			}
			rm.write(">");
			rm.writeEscaped(oLI.getIntro());
			rm.write("</span>");
			rm.write("</div>");
		}


		// Container for fields placed on the top half of the item, below the intro. This
		// includes title, number, and number units.
		rm.write("<div");  // Start Top row container
		rm.addClass("sapMObjLTopRow");
		rm.writeClasses();
		rm.write(">");

		if (!!oLI.getIcon()) {
			rm.write("<div");
			rm.addClass("sapMObjLIconDiv");
			rm.writeClasses();
			rm.write(">");
			rm.renderControl(oLI._getImageControl());
			rm.write("</div>");
		}

		// Container for a number and a units qualifier.
		rm.write("<div"); // Start Number/units container
		rm.addClass("sapMObjLNumberDiv");
		rm.writeClasses();
		rm.write(">");

		if (oLI.getNumber()) {
			rm.write("<div");
			rm.writeAttribute("id", oLI.getId() + "-number");
			rm.addClass("sapMObjLNumber");
			rm.addClass("sapMObjLNumberState" + oLI.getNumberState());
			rm.writeClasses();
			//sets the dir attribute to "rtl" or "ltr" if a direction
			//for the number text is provided explicitly
			if (sNumberDir !== sap.ui.core.TextDirection.Inherit) {
				rm.writeAttribute("dir", sNumberDir.toLowerCase());
			}
			rm.write(">");
			rm.writeEscaped(oLI.getNumber());
			rm.write("</div>");

			if (oLI.getNumberUnit()) {
				rm.write("<div");
				rm.writeAttribute("id", oLI.getId() + "-numberUnit");
				rm.addClass("sapMObjLNumberUnit");
				rm.addClass("sapMObjLNumberState" + oLI.getNumberState());
				rm.writeClasses();
				rm.write(">");
				rm.writeEscaped(oLI.getNumberUnit());
				rm.write("</div>");
			}
		}

		rm.write("</div>"); // End Number/units container

		// Title container displayed to the left of the number and number units container.
		rm.write("<div"); // Start Title container
		rm.addStyle("display","-webkit-box");
		rm.addStyle("overflow","hidden");
		rm.writeStyles();
		rm.write(">");
		var oTitleText = oLI._getTitleText();
		if (oTitleText) {
			//sets the text direction of the title,
			//by delegating the RTL support to sap.m.Text
			oTitleText.setTextDirection(sTitleDir);
			oTitleText.setText(oLI.getTitle());
			oTitleText.addStyleClass("sapMObjLTitle");
			rm.renderControl(oTitleText);
		}

		rm.write("</div>"); // End Title container

		rm.write("</div>"); // End Top row container

		if (!(sap.ui.Device.browser.internet_explorer && sap.ui.Device.browser.version < 10)) {
			rm.write("<div style=\"clear: both;\"></div>");
		}

		// Bottom row container.
		if (oLI._hasBottomContent()) {
			rm.write("<div"); // Start Bottom row container
			rm.addClass("sapMObjLBottomRow");
			rm.writeClasses();
			rm.write(">");

			var aAttribs = oLI._getVisibleAttributes();
			var statuses = [];
			var markers = null;

			if (oLI.getShowMarkers() || oLI.getMarkLocked()) {
				var placeholderIcon = oLI._getPlaceholderIcon();
				markers = [placeholderIcon];

				markers._isEmpty = function() {
					return false;
				};

				if (oLI.getMarkLocked()) {
					var lockIcon = oLI._getLockIcon();
					lockIcon.setVisible(oLI.getMarkLocked());
					markers.push(lockIcon);
				}

				if (oLI.getShowMarkers()) {
					var favIcon = oLI._getFavoriteIcon();
					var flagIcon = oLI._getFlagIcon();

					favIcon.setVisible(oLI.getMarkFavorite());
					flagIcon.setVisible(oLI.getMarkFlagged());

					markers.push(favIcon);
					markers.push(flagIcon);
				}

				statuses.push(markers);
			}

			statuses.push(oLI.getFirstStatus());
			statuses.push(oLI.getSecondStatus());

			while (aAttribs.length > 0) {
				this.renderAttributeStatus(rm, oLI, aAttribs.shift(), statuses.shift());
			}

			while (statuses.length > 0) {
				this.renderAttributeStatus(rm, oLI, null, statuses.shift());
			}

			rm.write("</div>"); // End Bottom row container
		}

		// ARIA description node
		this.renderAriaNode(rm, oLI, this.getAriaNodeText(oLI));
	};

	/**
	 * Renders hidden ARIA node, additionally describing the ObjectListItem, if description text is provided
	 * {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager}
	 *			rm the RenderManager that can be used for writing to the
	 *			Render-Output-Buffer
	 * @param {sap.m.ObjectListItem}
	 *			oLI an object to be rendered
	 * @param {String}
	 *			sAriaNodeText the ARIA node description text
	 */
	ObjectListItemRenderer.renderAriaNode = function(rm, oLI, sAriaNodeText) {
		if (sAriaNodeText) {
			rm.write("<div");

			rm.writeAttribute("id", oLI.getId() + "-aria");
			rm.writeAttribute("aria-hidden", "true");
			rm.addClass("sapUiHidden");
			rm.writeClasses();
			rm.write(">");
			rm.writeEscaped(sAriaNodeText);

			rm.write("</div>");
		}
	};

	/**
	 * Returns ARIA node description text for flag, favorite and lock marks
	 *
	 * @param {sap.m.ObjectListItem}
	 *			oLI an object to be rendered
	 * @returns {String}
	 */
	ObjectListItemRenderer.getAriaNodeText = function(oLI) {
		var aAriaNodeText = [];

		var oLibraryResourceBundle = sap.ui.getCore().getLibraryResourceBundle("sap.m");

		if (oLI.getMarkFlagged()) {
			aAriaNodeText.push(oLibraryResourceBundle.getText("ARIA_FLAG_MARK_VALUE"));
		}

		if (oLI.getMarkFavorite()) {
			aAriaNodeText.push(oLibraryResourceBundle.getText("ARIA_FAVORITE_MARK_VALUE"));
		}

		if (oLI.getMarkLocked()) {
			aAriaNodeText.push(oLibraryResourceBundle.getText("OBJECTLISTITEM_ARIA_LOCKED_MARK_VALUE"));
		}

		return aAriaNodeText.join(" ");
	};

	/**
	 * Returns ObjectListItem`s inner nodes ids, later used in aria labelledby attribute
	 *
	 * @param {sap.m.ObjectListItem}
	 *			oLI an object representation of the control
	 * @returns {String}
	 */
	ObjectListItemRenderer.getAriaLabelledBy = function(oLI) {
		var aLabelledByIds = [];

		if (oLI.getIntro()) {
			aLabelledByIds.push(oLI.getId() + "-intro");
		}

		if (oLI.getTitle()) {
			aLabelledByIds.push(oLI.getId() + "-titleText");
		}

		if (oLI.getNumber()) {
			aLabelledByIds.push(oLI.getId() + "-number");
		}

		if (oLI.getNumberUnit()) {
			aLabelledByIds.push(oLI.getId() + "-numberUnit");
		}

		if (oLI.getAttributes()) {
			oLI.getAttributes().forEach(function(attribute) {
				aLabelledByIds.push(attribute.getId());
			});
		}

		if (oLI.getFirstStatus()) {
			aLabelledByIds.push(oLI.getFirstStatus().getId());
		}

		if (oLI.getSecondStatus()) {
			aLabelledByIds.push(oLI.getSecondStatus().getId());
		}

		if (this.getAriaNodeText(oLI)) {
			aLabelledByIds.push(oLI.getId() + "-aria");
		}

		return aLabelledByIds.join(" ");
	};

	return ObjectListItemRenderer;

}, /* bExport= */ true);
