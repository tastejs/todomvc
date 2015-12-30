/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['jquery.sap.global', 'sap/ui/core/IconPool', 'sap/ui/core/theming/Parameters'],
	function(jQuery, IconPool, Parameters) {
	"use strict";


	/**
	 * ListitemBase renderer.
	 *
	 * @namespace
	 */
	var ListItemBaseRenderer = {};
	
	// create ARIA announcements 
	var mAriaAnnouncements = {};
	
	ListItemBaseRenderer.renderInvisible = function(rm, oLI) {
		this.openItemTag(rm, oLI);
		rm.writeInvisiblePlaceholderData(oLI);
		rm.write(">");
		this.closeItemTag(rm, oLI);
	};
	
	ListItemBaseRenderer.isModeMatched = function(sMode, iOrder) {
		var mOrderConfig = (sap.m.ListBaseRenderer || {}).ModeOrder || {};
		return (mOrderConfig[sMode] == iOrder);
	};

	/**
	 * Renders the mode when item mode is in correct order
	 * 
	 * @param {sap.ui.core.RenderManager} rm The RenderManager that can be used for writing to the Render-Output-Buffer.
	 * @param {sap.ui.core.Control} oLI an object representation of the control that should be rendered.
	 * @param {int} [iOrder] expected order for the rendering
	 * @protected
	 */
	ListItemBaseRenderer.renderMode = function(rm, oLI, iOrder) {
		var sMode = oLI.getMode();
		if (!this.isModeMatched(sMode, iOrder)) {
			return;
		}
		
		var oModeControl = oLI.getModeControl(true);
		if (oModeControl) {
			this.renderModeContent(rm, oLI, oModeControl);
		}
	};

	ListItemBaseRenderer.renderModeContent = function(rm, oLI, oModeControl) {
		var sMode = oLI.getMode(),
			mModeConfig = {
				Delete : "D",
				MultiSelect : "M",
				SingleSelect : "S",
				SingleSelectLeft : "SL"
			};

		rm.write("<div");
		rm.writeAttribute("id", oLI.getId() + "-mode");
		rm.addClass("sapMLIBSelect" + mModeConfig[sMode]);
		this.decorateMode(rm, oLI);
		rm.writeClasses();
		rm.writeStyles();
		rm.write(">");
		rm.renderControl(oModeControl);
		rm.write("</div>");
	};

	ListItemBaseRenderer.decorateMode = function(rm, oLI) {
		// determine whether animation is necessary or not
		if (!sap.ui.getCore().getConfiguration().getAnimation() ||
			!oLI.getListProperty("modeAnimationOn")) {
			return;
		}

		var sMode = oLI.getMode(),
			sLastListMode = oLI.getListProperty("lastMode");
		
		// determine whether list mode is changed or not
		if (!sLastListMode || sLastListMode == sMode) {
			return;
		}

		if (sMode == sap.m.ListMode.None) {
			rm.addClass("sapMLIBUnselectAnimation");
		} else {
			rm.addClass("sapMLIBSelectAnimation");
		}
	};

	/**
	 * Renders counter if it is not empty
	 * 
	 * @param {sap.ui.core.RenderManager} rm The RenderManager that can be used for writing to the Render-Output-Buffer.
	 * @param {sap.ui.core.Control} oLI an object representation of the control that should be rendered.
	 * @protected
	 */
	ListItemBaseRenderer.renderCounter = function(rm, oLI) {
		var iCounter = oLI.getCounter();
		if (iCounter) {
			this.renderCounterContent(rm, oLI, iCounter);
		}
	};

	ListItemBaseRenderer.renderCounterContent = function(rm, oLI, iCounter) {
		rm.write("<div");
		rm.writeAttribute("id", oLI.getId() + "-counter");
		var sAriaLabel = sap.ui.getCore().getLibraryResourceBundle("sap.m").getText("LIST_ITEM_COUNTER", iCounter);
		rm.writeAttribute("aria-label", sAriaLabel);
		rm.addClass("sapMLIBCounter");
		rm.writeClasses();
		rm.write(">");
		rm.write(iCounter);
		rm.write("</div>");
	};

	/**
	 * Renders type for the list item
	 * 
	 * @param {sap.ui.core.RenderManager} rm The RenderManager that can be used for writing to the Render-Output-Buffer.
	 * @param {sap.ui.core.Control} oLI an object representation of the control that should be rendered.
	 * @protected
	 */
	ListItemBaseRenderer.renderType = function(rm, oLI) {
		var oTypeControl = oLI.getTypeControl();
		if (oTypeControl) {
			rm.renderControl(oTypeControl);
		}
	};

	/**
	 * Renders list item HTML starting tag
	 * 
	 * @param {sap.ui.core.RenderManager} rm The RenderManager that can be used for writing to the Render-Output-Buffer.
	 * @param {sap.ui.core.Control} oLI an object representation of the control that should be rendered.
	 * @protected
	 */
	ListItemBaseRenderer.openItemTag = function(rm, oLI) {
		rm.write("<li");
	};

	/**
	 * Renders list item HTML closing tag
	 * 
	 * @param {sap.ui.core.RenderManager} rm The RenderManager that can be used for writing to the Render-Output-Buffer.
	 * @param {sap.ui.core.Control} oLI an object representation of the control that should be rendered.
	 * @protected
	 */
	ListItemBaseRenderer.closeItemTag = function(rm, oLI) {
		rm.write("</li>");
	};

	/**
	 * Determines whether flex box wrapper is necessary or not.
	 * 
	 * @param {sap.ui.core.RenderManager} rm The RenderManager that can be used for writing to the Render-Output-Buffer.
	 * @param {sap.ui.core.Control} oLI an object representation of the control that should be rendered.
	 * @protected
	 */
	ListItemBaseRenderer.handleNoFlex = function(rm, oLI) {
		return !jQuery.support.hasFlexBoxSupport;
	};

	ListItemBaseRenderer.renderTabIndex = function(rm, oLI) {
		rm.writeAttribute("tabindex", "-1");
	};

	ListItemBaseRenderer.renderTooltip = function(rm, oLI) {
		var sTooltip = oLI.getTooltip_AsString();
		if (sTooltip) {
			rm.writeAttributeEscaped("title", sTooltip);
		}
	};

	/**
	 * Adds the classes needed to recognize the element as focusable.
	 *
	 * @param {sap.ui.core.RenderManager} rm The RenderManager that can be used for writing to the Render-Output-Buffer
	 * @param {sap.ui.core.Control} oLI an object representation of the control that should be rendered
	 * @protected
	 */
	ListItemBaseRenderer.addFocusableClasses = function(rm, oLI) {
		if (sap.ui.Device.system.desktop) {
			rm.addClass("sapMLIBFocusable");
			this.addLegacyOutlineClass(rm, oLI);
		}
	};

	/**
	 * Adds the classes for legacy browsers, which do not support normal outlines.
	 *
	 * @param {sap.ui.core.RenderManager} rm The RenderManager that can be used for writing to the Render-Output-Buffer
	 * @param {sap.ui.core.Control} oLI an object representation of the control that should be rendered
	 * @protected
	 */
	ListItemBaseRenderer.addLegacyOutlineClass = function(rm, oLI) {
		if (sap.ui.Device.browser.msie) {
			rm.addClass("sapMLIBLegacyOutline");
		}
	};

	/**
	 * Creates an invisible aria node for the given message bundle text  
	 * in the static UIArea and returns its id for ARIA announcements
	 * 
	 * This method should be used when text is reached frequently.
	 * 
	 * @param {String} sKey key of the announcement
	 * @param {String} [sBundleText] key of the announcement
	 * @returns {String} id of the generated invisible aria node
	 * @protected
	 */
	ListItemBaseRenderer.getAriaAnnouncement = function(sKey, sBundleText) {
		if (mAriaAnnouncements[sKey]) {
			return mAriaAnnouncements[sKey];
		}
		
		sBundleText = sBundleText || "LIST_ITEM_" + sKey.toUpperCase();
		mAriaAnnouncements[sKey] = new sap.ui.core.InvisibleText({
			text : sap.ui.getCore().getLibraryResourceBundle("sap.m").getText(sBundleText)
		}).toStatic().getId();
		
		return mAriaAnnouncements[sKey];
	};

	
	/**
	 * Returns aria accessibility role
	 *
	 * @param {sap.ui.core.Control} oLI an object representation of the control
	 * @returns {String}
	 * @protected
	 */
	ListItemBaseRenderer.getAriaRole = function(oLI) {
		return "option";
	};
	
	/**
	 * Returns the inner aria labelledby ids for the accessibility
	 *
	 * @param {sap.ui.core.Control} oLI an object representation of the control 
	 * @returns {String|undefined}
	 * @protected
	 */
	ListItemBaseRenderer.getAriaLabelledBy = function(oLI) {
		if (oLI.getAriaLabelledBy().length) {
			return oLI.getId();
		}
	};
	
	/**
	 * Returns the inner aria describedby ids for the accessibility
	 *
	 * @param {sap.ui.core.Control} oLI an object representation of the control
	 * @returns {String|undefined} 
	 * @protected
	 */
	ListItemBaseRenderer.getAriaDescribedBy = function(oLI) {
		var aDescribedBy = [],
			sType = oLI.getType(),
			mType = sap.m.ListType;
		
		if (oLI.getListProperty("showUnread") && oLI.getUnread()) {
			aDescribedBy.push(this.getAriaAnnouncement("unread"));
		}
		
		if (oLI.getMode() == sap.m.ListMode.Delete) {
			aDescribedBy.push(this.getAriaAnnouncement("deletable"));
		}
		
		if (sType == mType.Navigation) {
			aDescribedBy.push(this.getAriaAnnouncement("navigation"));
		} else if (sType == mType.Detail || sType == mType.DetailAndActive) {
			aDescribedBy.push(this.getAriaAnnouncement("detail"));
		}
		
		return aDescribedBy.join(" ");
	};
	
	/**
	 * Returns the accessibility state of the control
	 *
	 * @param {sap.ui.core.Control} oLI an object representation of the control
	 * @protected
	 */
	ListItemBaseRenderer.getAccessibilityState = function(oLI) {
		var sAriaLabelledBy = this.getAriaLabelledBy(oLI),
			sAriaDescribedBy = this.getAriaDescribedBy(oLI),
			mAccessibilityState = {
				role: this.getAriaRole(oLI)
			};

		if (oLI.isSelectable()) {
			mAccessibilityState.selected = oLI.getProperty("selected");
		}

		if (sAriaLabelledBy) {
			mAccessibilityState.labelledby = {
				value: sAriaLabelledBy.trim(),
				append: true
			};
		}

		if (sAriaDescribedBy) {
			mAccessibilityState.describedby = {
				value: sAriaDescribedBy.trim(),
				append: true
			};
		}

		return mAccessibilityState;
	};
	
	/**
	 * Hook for rendering list item contents
	 * 
	 * @param {sap.ui.core.RenderManager} rm The RenderManager that can be used for writing to the Render-Output-Buffer.
	 * @param {sap.ui.core.Control} oLI an object representation of the control that should be rendered.
	 * @protected
	 */
	ListItemBaseRenderer.renderLIContent = function(rm, oLI) {
	};
	
	/**
	 * Hook for changing list item attributes
	 * 
	 * @param {sap.ui.core.RenderManager} rm The RenderManager that can be used for writing to the Render-Output-Buffer.
	 * @param {sap.ui.core.Control} oLI an object representation of the control that should be rendered.
	 * @protected
	 */
	ListItemBaseRenderer.renderLIAttributes = function(rm, oLI) {
	};

	
	ListItemBaseRenderer.renderLIContentWrapper = function(rm, oLI) {
		rm.write('<div class="sapMLIBContent"');
		rm.writeAttribute("id", oLI.getId() + "-content");
		rm.write(">");
		
		// additional content with class for no-flex case
		if (this.handleNoFlex()) {
			rm.write('<div class="sapMLIBContentNF">');
		}

		this.renderLIContent(rm, oLI);

		if (this.handleNoFlex()) {
			rm.write('</div>');
		}

		rm.write('</div>');
	};


	/**
	 * Renders the HTML for the given control, using the provided.
	 *
	 * {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} rm The RenderManager that can be used for writing to the Render-Output-Buffer.
	 * @param {sap.ui.core.Control} oLI an object representation of the control that should be rendered.
	 * @public
	 */
	ListItemBaseRenderer.render = function(rm, oLI) {

		// render invisible placeholder
		if (!oLI.getVisible()) {
			this.renderInvisible(rm, oLI);
			return false;
		}

		// start
		this.openItemTag(rm, oLI);
		rm.writeControlData(oLI);

		// classes
		rm.addClass("sapMLIB");
		rm.addClass("sapMLIB-CTX");
		rm.addClass("sapMLIBShowSeparator");
		rm.addClass("sapMLIBType" + oLI.getType());

		if (sap.ui.Device.system.desktop && oLI.isActionable()) {
			rm.addClass("sapMLIBActionable");
			rm.addClass("sapMLIBHoverable");
		}

		if (oLI.getSelected()) {
			rm.addClass("sapMLIBSelected");
		}

		if (this.handleNoFlex()) {
			rm.addClass("sapMLIBNoFlex");
		}

		if (oLI.getListProperty("showUnread") && oLI.getUnread()) {
			rm.addClass("sapMLIBUnread");
		}

		this.addFocusableClasses(rm, oLI);

		// attributes
		this.renderTooltip(rm, oLI);
		this.renderTabIndex(rm, oLI);
		
		// handle accessibility states
		if (sap.ui.getCore().getConfiguration().getAccessibility()) {
			rm.writeAccessibilityState(oLI, this.getAccessibilityState(oLI));
		}

		// item attributes hook
		this.renderLIAttributes(rm, oLI);

		rm.writeClasses();
		rm.writeStyles();
		rm.write(">");

		// mode for left hand side of the content
		this.renderMode(rm, oLI, -1);
		
		this.renderLIContentWrapper(rm, oLI);
		this.renderCounter(rm, oLI);
		this.renderType(rm, oLI);

		// mode for right hand side of the content
		this.renderMode(rm, oLI, 1);

		this.closeItemTag(rm, oLI);
	};

	return ListItemBaseRenderer;

}, /* bExport= */ true);
