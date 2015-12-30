/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global'],
	function (jQuery) {
		"use strict";


		/**
		 * Popover renderer.
		 * @namespace
		 */
		var PopoverRenderer = {};


		/**
		 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
		 *
		 * @param {sap.ui.core.RenderManager} oRenderManager the RenderManager that can be used for writing to the Render-Output-Buffer
		 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
		 */
		PopoverRenderer.render = function (rm, oControl) {
			var aClassNames;

			//container
			rm.write("<div");
			rm.writeControlData(oControl);

			aClassNames = this.generateRootClasses(oControl);
			aClassNames.forEach(function (sClassName, index) {
				rm.addClass(sClassName);
			});
			rm.writeClasses();

			var sTooltip = oControl.getTooltip_AsString();
			if (sTooltip) {
				rm.writeAttributeEscaped("title", sTooltip);
			}
			rm.writeAttribute("tabindex", "-1");

			rm.writeAccessibilityState(oControl, {
				role: "dialog"
			});

			if (oControl.getShowHeader() && oControl._getAnyHeader()) {
				rm.writeAccessibilityState(oControl, {
					labelledby: oControl._getAnyHeader().getId()
				});
			}

			rm.write(">");

			this.renderContent(rm, oControl);

			rm.write("</div>");// container
		};

		PopoverRenderer.isButtonFooter = function (footer) {
			if (footer instanceof sap.m.Bar) {
				var aContentLeft = footer.getContentLeft(),
					aContentRight = footer.getContentRight(),
					aContentMiddle = footer.getContentMiddle(),
					bLeftEmpty = (!aContentLeft || aContentLeft.length === 0),
					bRightEmpty = (!aContentRight || aContentRight.length === 0),
					bMiddleTwoButtons = false;

				if (aContentMiddle && aContentMiddle.length === 2) {
					if ((aContentMiddle[0] instanceof sap.m.Button) && (aContentMiddle[1] instanceof sap.m.Button)) {
						bMiddleTwoButtons = true;
					}
				}

				return bLeftEmpty && bRightEmpty && bMiddleTwoButtons;
			} else {
				return false;
			}
		};

		PopoverRenderer.renderContent = function (rm, oControl) {
			var oHeader,
				sId = oControl.getId(),
				i = 0,
				contents = oControl._getAllContent(),
				oFooter = oControl.getFooter(),
				oSubHeader = oControl.getSubHeader(),
				sContentWidth = oControl.getContentWidth(),
				sContentHeight = oControl.getContentHeight(),
				sFooterClass = "sapMPopoverFooter ";

			if (oControl.getShowHeader()) {
				oHeader = oControl._getAnyHeader();
			}

			if (sap.ui.Device.system.desktop) {
				//Invisible element for cycling keyboard navigation
				rm.write("<span class='sapMPopoverHiddenFocusable' id='" + oControl.getId() + "-firstfe' tabindex='0'></span>");
			}

			//header
			if (oHeader) {
				if (oHeader.applyTagAndContextClassFor) {
					oHeader.applyTagAndContextClassFor("header");
				}
				oHeader.addStyleClass("sapMPopoverHeader");
				rm.renderControl(oHeader);
			}//header

			if (oSubHeader) {
				if (oSubHeader.applyTagAndContextClassFor) {
					oSubHeader.applyTagAndContextClassFor("subheader");
				}
				oSubHeader.addStyleClass("sapMPopoverSubHeader");
				rm.renderControl(oSubHeader);
			}

			// content container
			rm.write("<div");
			rm.writeAttribute("id", sId + "-cont");
			if (sContentWidth) {
				rm.addStyle("width", sContentWidth);
			}
			if (sContentHeight) {
				rm.addStyle("height", sContentHeight);
			}
			rm.writeStyles();
			rm.addClass("sapMPopoverCont");
			rm.writeClasses();
			rm.write(">");

			// scroll area
			rm.write('<div class="sapMPopoverScroll"');
			rm.writeAttribute("id", oControl.getId() + "-scroll");

			if (!oControl.getHorizontalScrolling()) {
				rm.addStyle(sap.ui.getCore().getConfiguration().getRTL() ? "margin-left" : "margin-right", jQuery.sap.scrollbarSize().width + "px");
			}

			rm.writeStyles();
			rm.write(">");

			for (i = 0; i < contents.length; i++) {
				rm.renderControl(contents[i]);
			}
			rm.write("</div>");//scrollArea

			rm.write("</div>");//content container

			//footer
			if (oFooter) {
				if (oFooter.applyTagAndContextClassFor) {
					oFooter.applyTagAndContextClassFor("footer");
					//TODO: check if this should also be added to a Bar instance
					oFooter.addStyleClass("sapMTBNoBorders");
				}
				if (this.isButtonFooter(oFooter)) {
					sFooterClass += "sapMPopoverSpecialFooter";
				}
				rm.renderControl(oFooter.addStyleClass(sFooterClass));
			}//footer

			if (oControl.getShowArrow()) {
				//arrow
				rm.write("<span");
				rm.writeAttribute("id", sId + "-arrow");
				rm.addClass("sapMPopoverArr");
				rm.writeClasses();
				rm.write("></span>");//arrow tip
			}

			if (sap.ui.Device.system.desktop) {
				//Invisible element for desktop keyboard navigation
				rm.write("<span class='sapMPopoverHiddenFocusable' id='" + oControl.getId() + "-lastfe' tabindex='0'></span>");
			}
		};

		PopoverRenderer.generateRootClasses = function (oControl) {
			var aClassNames = ["sapMPopover"],
				oSubHeader = oControl.getSubHeader(),
				oFooter = oControl.getFooter(),
				bVerScrollable = oControl.getVerticalScrolling() && !oControl._forceDisableScrolling,
				bHorScrollable = oControl.getHorizontalScrolling() && !oControl._forceDisableScrolling,
				oHeaderControl;

			if (oControl.getShowHeader()) {
				oHeaderControl = oControl._getAnyHeader();
			}

			if (oHeaderControl) {
				aClassNames.push("sapMPopoverWithBar");
			} else {
				aClassNames.push("sapMPopoverWithoutBar");
			}

			if (oSubHeader) {
				aClassNames.push("sapMPopoverWithSubHeader");
			} else {
				aClassNames.push("sapMPopoverWithoutSubHeader");
			}

			if (oControl._hasSingleNavContent()) {
				aClassNames.push("sapMPopoverNav");
			}

			if (oControl._hasSinglePageContent()) {
				aClassNames.push("sapMPopoverPage");
			}
			if (oFooter) {
				aClassNames.push("sapMPopoverWithFooter");
			} else {
				aClassNames.push("sapMPopoverWithoutFooter");
			}

			if (oControl.getPlacement() === sap.m.PlacementType.Top) {
				aClassNames.push("sapMPopoverPlacedTop");
			}
			if (!bVerScrollable) {
				aClassNames.push("sapMPopoverVerScrollDisabled");
			}
			if (!bHorScrollable) {
				aClassNames.push("sapMPopoverHorScrollDisabled");
			}

			aClassNames.push("sapMPopup-CTX");

			// test popover with sap-ui-xx-formfactor=compact
			if (sap.m._bSizeCompact) {
				aClassNames.push("sapUiSizeCompact");
			}

			// add custom classes set by the application as well
			return aClassNames.concat(oControl.aCustomStyleClasses);
		};

		PopoverRenderer.rerenderContentOnly = function (oControl) {
			var $Popover = oControl.$(),
				oPopoverDomRef = oControl.getDomRef(),
				aClassNames, oRm;

			if (!oPopoverDomRef) {
				//popover isn't rendered yet, just return
				return;
			}

			$Popover.removeClass();
			aClassNames = this.generateRootClasses(oControl);
			$Popover.addClass(aClassNames.join(" "));

			oRm = sap.ui.getCore().createRenderManager();
			this.renderContent(oRm, oControl);

			oRm.flush(oPopoverDomRef, true);
			oRm.destroy();

			//recalculate the size and position of popover
			oControl._onOrientationChange();
		};


		return PopoverRenderer;

	}, /* bExport= */ true);
