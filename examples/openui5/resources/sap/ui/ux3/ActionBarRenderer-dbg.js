/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['jquery.sap.global'],
	function(jQuery) {
	"use strict";


	/**
	 * Static initializer. Creates and empty ActionBarRenderer instance.
	 *
	 * @class ActionBar renderer.
	 * @static
	 */
	var ActionBarRenderer = {
	};



	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRenderManager the RenderManager that can be used for writing to the Render-Output-Buffer
	 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
	 */
	ActionBarRenderer.render = function(oRenderManager, oControl){
		// convenience variable
		var rm = oRenderManager;

		// render ActionBar
		// result: <div id="<id>" data-sap-ui="<id>" class="sapUiUx3ActionBar" role="toolbar">
		rm.write("<div");
		rm.writeControlData(oControl);
		rm.addClass("sapUiUx3ActionBar");
		rm.writeClasses();
		if ( sap.ui.getCore().getConfiguration().getAccessibility()) {
			rm.writeAttribute('role', 'toolbar');
		}
		rm.write(">");

		// render list for social actions
		rm.write("<ul");
		rm.writeAttribute('id', oControl.getId() + "-socialActions");
		rm.addClass("sapUiUx3ActionBarSocialActions");
		rm.writeClasses();

		rm.addStyle("min-width", oControl._getSocialActionListMinWidth() + "px");
		rm.writeStyles();

		rm.write(">");
		this.renderSocialActions(rm, oControl);
		rm.write("</ul>");

		// render list for business actions
		rm.write("<ul  id='" + oControl.getId() + "-businessActions' class='sapUiUx3ActionBarBusinessActions'>");
		this.renderBusinessActionButtons(rm, oControl);
		rm.write("</ul>");

		// closing tag for toolbar
		rm.write("</div>");

	};

	/**
	 * Renders the HTML for toolbar buttons of business actions
	 *
	 * @param {sap.ui.core.RenderManager}
	 *			rm the RenderManager that can be used for writing to
	 *			the Render-Output-Buffer
	 * @param {sap.ui.core.Control}
	 *			oControl an object representation of the control that should be
	 *			rendered
	 */
	ActionBarRenderer.renderBusinessActionButtons = function(rm, oControl) {

		var actionButtons = oControl._getBusinessActionButtons();
		var oMoreMenuButton = oControl._getMoreMenuButton();

		if (actionButtons && actionButtons.length > 0) {
			//Render list for business action buttons
			//Do not write attribue tabindex in list element because this is
			//already contained in the buttons control. If you write it twice,
			//both arrow and tab will work, which is wrong
			for ( var i = 0; i < actionButtons.length; i++) {
				var oButton = actionButtons[i];
				rm.write("<li");
				rm.addClass("sapUiUx3ActionBarItemRight");
				rm.writeClasses();
				rm.write(">");
				rm.renderControl(oButton);
				rm.write("</li>");
			}
			this._renderMoreMenuButton(rm, oMoreMenuButton);
		} else if (oMoreMenuButton) {
			//There may be business actions which have to be displayed in the "More Menu"
			this._renderMoreMenuButton(rm, oMoreMenuButton);
		}
	}

	/**
	 * Renders "More" menu button if present
	 *
	 * @param {sap.ui.core.RenderManager}
	 *			rm the RenderManager that can be used for writing to
	 *			the Render-Output-Buffer
	 * @param {sap.ui.commons.MenuButton}
	 *			oMoreMenuButton menu button to be rendered, may be null
	 * @private
	 */;
	ActionBarRenderer._renderMoreMenuButton = function (rm, oMoreMenuButton) {

		if (oMoreMenuButton) {
			rm.write("<li");
			rm.addClass("sapUiUx3ActionBarItemRight");
			rm.addClass("sapUiUx3ActionBarMoreButton");
			rm.writeClasses();
			rm.write(">");
			rm.renderControl(oMoreMenuButton);
			rm.write("</li>");
		}
	};



	/**
	 * Renders the HTML for sap.ui.ux3.Actionbar: social actions in a specified order:
	 * 1. Update (Feed)
	 * 2. Follow
	 * 3. Flag
	 * 4. Favorite
	 * 5. Open
	 *
	 * They are rendered only if they are present in action bar's 'mActionMap' though.
	 *
	 * @param {sap.ui.core.RenderManager}
	 *			rm the RenderManager that can be used for writing to
	 *			the Render-Output-Buffer
	 * @param {sap.ui.core.Control}
	 *			oControl an object representation of the control that should be
	 *			rendered
	 */
	 ActionBarRenderer.renderSocialActions = function(rm, oControl) {

		var mMap = oControl.mActionMap;
		var mKeys = oControl.mActionKeys;


		if (mMap[mKeys.Update]) {
			this._renderSocialActionListItem(rm, oControl, mMap[mKeys.Update]);
		}
		if (mMap[mKeys.Follow]) {
			this._renderSocialActionListItem(rm, oControl, mMap[mKeys.Follow]);
		}
		if (mMap[mKeys.Flag]) {
			this._renderSocialActionListItem(rm, oControl, mMap[mKeys.Flag]);
		}
		if (mMap[mKeys.Favorite]) {
			this._renderSocialActionListItem(rm, oControl, mMap[mKeys.Favorite]);
		}
		if (mMap[mKeys.Open]) {
			this._renderSocialActionListItem(rm, oControl, mMap[mKeys.Open]);
		}
		//Render social actions, which might have been added by an application
		//developer to aggregation 'socialActions' manually and which are not contained
		//in the predefined list of social actions Update, Follow, Flag, Favorite, Open
		for (var sKey in  mMap) {
			if (!(sKey in sap.ui.ux3.ActionBarSocialActions)) {
				this._renderSocialActionListItem(rm, oControl, mMap[sKey]);
			}
		}
	 };

	 /**
	  * Renders the HTML for sap.ui.ux3.Actionbar: single social action list item
	  *
	  * @param {sap.ui.core.RenderManager}
	  *			rm the RenderManager that can be used for writing to
	  *			the Render-Output-Buffer
	  * @param {sap.ui.core.Control}
	  *			oControl an object representation of the control that should be
	  *			rendered
	  * @param {sap.ui.ux3.ThingAction}
	  *			action an object representation of the control that should be
	  *			rendered
	  *  @private
	  */
	  ActionBarRenderer._renderSocialActionListItem = function(rm, oControl, action) {
		if (action && !action.hide) {
			rm.write("<li");
			rm.addClass("sapUiUx3ActionBarItem");
			rm.writeClasses();
			rm.write(">");
			this._renderSocialAction(rm, oControl, action);
			rm.write("</li>");
		}
	  };


	 /**
	 * Renders the HTML for sap.ui.ux3.Actionbar: single social action
	 *
	 * @param {sap.ui.core.RenderManager}
	 *			rm the RenderManager that can be used for writing to
	 *			the Render-Output-Buffer
	 * @param {sap.ui.core.Control}
	 *			oControl an object representation of the control that should be
	 *			rendered
	 * @param {sap.ui.ux3.ThingAction}
	 *			action an object representation of the control that should be
	 *			rendered
	 *  @private
	 */
	 ActionBarRenderer._renderSocialAction = function(rm, oControl, action) {
		if (action.isMenu && action.isMenu(oControl)) {
			rm.write("<a role=\"button\" aria-disabled=\"false\" aria-haspopup=\"true\"");
		} else {
			rm.write("<a  role=\"button\" aria-disabled=\"false\" aria-haspopup=\"false\"");
		}
		if (action.name == oControl.mActionKeys.Flag || action.name == oControl.mActionKeys.Favorite) {
			rm.writeAttribute("aria-pressed", action.fnCalculateState(oControl) == "Selected" ? "true" : "false");
		}
		rm.writeAttribute("tabindex", "0");
		rm.writeElementData(action);
		rm.addClass(action.cssClass);
		if (action.fnCalculateState) {
			rm.addClass(action.fnCalculateState(oControl));
		}
		rm.addClass("sapUiUx3ActionBarAction");
		rm.writeClasses();

		if (action.getTooltip()) {
			rm.writeAttributeEscaped("title", action.getTooltip());
		}
		if (action.text) {
			rm.writeAttributeEscaped("text", oControl.getLocalizedText(action.getText()));
		}
		rm.write("></a>");
	 };






	return ActionBarRenderer;

}, /* bExport= */ true);
