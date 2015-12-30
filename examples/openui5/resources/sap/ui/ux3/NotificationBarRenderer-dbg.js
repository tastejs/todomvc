/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global', 'sap/ui/core/theming/Parameters'],
	function(jQuery, Parameters) {
	"use strict";


	/**
	 * NotificationBar renderer.
	 * @namespace
	 */
	var NotificationBarRenderer = {};
	
	/*
	 * Set all methods into a close to prevent any abuse of helping methods
	 */
	(function() {
		/**
		 * Renders the HTML for the given control, using the provided
		 * {@link sap.ui.core.RenderManager}.
		 * 
		 * @param {sap.ui.core.RenderManager}
		 *            oRm the RenderManager that can be used for writing to the
		 *            render output buffer
		 * @param {sap.ui.core.Control}
		 *            oControl an object representation of the control that should
		 *            be rendered
		 */
		NotificationBarRenderer.render = function(oRm, oControl) {
			fnWriteHeader(oRm, oControl);
			fnWriteItems(oRm, oControl);
			fnWriteFooter(oRm, oControl);
		};
	
		/**
		 * @private
		 */
		var fnWriteHeader = function(oRm, oControl) {
	
			oRm.write("<div");
			oRm.writeControlData(oControl);
	
			if (oControl.getVisibleStatus() === sap.ui.ux3.NotificationBarStatus.None) {
				if (oControl.$().length > 0) {
					// if NotiBar is already rendered
					if (oControl._resizeFrom) {
						oControl.$().stop().animate({
							height : 0
						}, "fast", function() {
							oControl.$().css("display", "none");
	
							oRm.addStyle("display", "none");
							oRm.writeAttribute("aria-hidden", "true");
						});
					} else {
						oRm.addStyle("display", "none");
						oRm.writeAttribute("aria-hidden", "true");
					}
				} else {
					/*
					 * setting the display attribute prevents the bar from
					 * flickering when the bar is initially loaded
					 */
					oRm.addStyle("display", "none");
					oRm.writeAttribute("aria-hidden", "true");
				}
			} else {
				oRm.writeAttribute("aria-hidden", "false");
				oRm.addStyle("display", "block");
			}
			oRm.writeStyles();
	
			oRm.addClass("sapUiNotificationBar");
			/*
			 * This ensures the maximize and minimize animation
			 */
			if (oControl._resizeTo) {
				if (oControl._resizeFrom == sap.ui.ux3.NotificationBarStatus.Max) {
					if (oControl._resizeTo == sap.ui.ux3.NotificationBarStatus.Default) {
						// Resizing from maximize back to default (class will be
						// removed in 'afterRendering')
						oRm.addClass("sapUiNotificationBarMaximized");
					}
				}
			}
	
			oRm.writeClasses();
	
			oRm.write(">"); // div element
	
			/*
			 * Rendering the hover element that helps to indicate if the bar is
			 * hovered. It is important that this element is within the root element
			 * of the NotificationBar since outside is strictly forbidden!
			 */
			fnRenderHoverItem(oRm, oControl);
		};
	
		var fnRenderToggler = function(oRm, oControl) {
			var sStatus = oControl.getVisibleStatus();
			if (sStatus !== "None") {
				var sId = oControl.getId() + "-toggler";
	
				oRm.write("<div");
				oRm.writeAttribute("id", sId);
	
				oRm.addClass("sapUiBarToggle");
				if (sStatus !== "Min") {
					oRm.addClass("sapUiBarToggleWide");
				}
	
				oRm.writeClasses();
	
				// check the status of the property. For mobile it should be set to true on init
				if (oControl.getAlwaysShowToggler()) {
					oRm.addStyle("display", "block");
					oRm.writeStyles();
				}
	
				oRm.write(">");
	
				fRenderToggleItem(oRm, oControl, "ArrowUp");
				fRenderToggleItem(oRm, oControl, "ArrowDown");
				fRenderToggleItem(oRm, oControl, "BarUp");
				fRenderToggleItem(oRm, oControl, "BarDown");
	
				oRm.write("</div>"); // div Toggler
			} else {
				// if the NotificationBar is in VisibleStatus:None also hide the toggler
				oRm.addStyle("display", "none");
				oRm.writeStyles();
			}
		};
	
		var fRenderToggleItem = function(oRm, oControl, sItemType) {
			oRm.write("<div");
	
			var sId = oControl.getId() + "-" + sItemType;
			oRm.writeAttribute("id", sId);
	
			var sStatus = oControl.getVisibleStatus();
			var bHide = true;
	
			var sTitle = "";
	
			switch (sItemType) {
			case "ArrowUp":
				if (sStatus === "Default") {
					bHide = false;
				}
				sTitle = oControl._oResBundle.getText("NOTIBAR_TITLE_ENLARGE");
				break;
	
			case "ArrowDown":
				if (sStatus === "Max") {
					bHide = false;
				}
				sTitle = oControl._oResBundle.getText("NOTIBAR_TITLE_MINIMIZE");
				break;
	
			case "BarUp":
				if (sStatus === "Min") {
					bHide = false;
				}
				sTitle = oControl._oResBundle.getText("NOTIBAR_TITLE_BAR_UP");
				break;
	
			case "BarDown":
				if (sStatus === "Max" || sStatus === "Default") {
					bHide = false;
				}
				sTitle = oControl._oResBundle.getText("NOTIBAR_TITLE_BAR_DOWN");
				break;
	
			}
			oRm.writeAttributeEscaped("title", sTitle);
	
			if (bHide) {
				oRm.addClass("sapUiBarToggleHide");
			}
	
			oRm.addClass("sapUiBarToggle" + sItemType);
			oRm.addClass("sapUiBarToggleItem");
	
			oRm.writeClasses();
			oRm.write(">");
	
			oRm.write("</div>");
		};
	
		var fnRenderHoverItem = function(oRm, oControl) {
			oRm.write("<div");
			var sId = oControl.getId() + "-hoverItem";
			oRm.writeAttribute("id", "" + sId);
	
			var sStatus = oControl.getVisibleStatus();
			if (sStatus === "Min") {
				oRm.addStyle("top", "-" + sap.ui.ux3.NotificationBar.HOVER_ITEM_HEIGHT + "px");
				oRm.addStyle("display", "block");
			} else {
				oRm.addStyle("display", "none");
			}
			if (oControl.getDomRef()) {
				var $domRef = jQuery(oControl.getDomRef());
				var sWidth = $domRef.width() + "px";
				oRm.addStyle("width", sWidth);
			}
			oRm.writeStyles();
	
			oRm.addClass("sapUiNotiHover");
			oRm.writeClasses();
			oRm.write(">");
	
			oRm.write("</div>"); // div hover item
		};
	
		/**
		 * Renders all notifiers
		 */
		var fnWriteItems = function(oRm, oControl) {
			if (oControl.getResizeEnabled()) {
				fnRenderToggler(oRm, oControl);
			}
	
			if (oControl.hasItems()) {
				if (oControl.getVisibleStatus() == sap.ui.ux3.NotificationBarStatus.Max) {
					fnWriteItemsMaximized(oRm, oControl);
				} else {
					fnWriteItemsDefault(oRm, oControl);
				}
			}
		};
	
		var fnWriteItemsMaximized = function(oRm, oControl) {
			var aNotifiers = oControl.getNotifiers();
			var oMessageNotifier = oControl.getMessageNotifier();
			var sId = "";
	
			oRm.write("<div");
			oRm.writeAttribute("id", oControl.getId() + "-containers");
	
			oRm.addClass("sapUiNotifierContainers");
			oRm.writeClasses();
			oRm.write(">");
	
			// suppress any invalidate since we are already rendering ;-)
			if (oMessageNotifier && oMessageNotifier.hasItems()) {
				oMessageNotifier.destroyAggregation("views", true);
	
				sId = oMessageNotifier.getId() + "-messageNotifierView";
	
				var oMNView = fnCreateNotifierViewMaximized(sId, oMessageNotifier);
				oMessageNotifier.addAggregation("views", oMNView, true);
	
				oRm.renderControl(oMNView);
			}
	
			if (aNotifiers.length > 0) {
				for ( var i = 0; i < aNotifiers.length; i++) {
					if (aNotifiers[i].hasItems()) {
						aNotifiers[i].destroyAggregation("views", true);
	
						sId = aNotifiers[i].getId() + "-notifierView";
	
						var oView = fnCreateNotifierViewMaximized(sId, aNotifiers[i]);
						aNotifiers[i].addAggregation("views", oView, true);
	
						oRm.renderControl(oView);
					}
				}
			}
	
			oRm.write("</div");
		};
	
		var fnWriteItemsDefault = function(oRm, oControl) {
			var aNotifiers = oControl.getNotifiers();
			var oMN = oControl.getMessageNotifier();
	
			oRm.write("<ul");
			oRm.writeAttribute("id", oControl.getId() + "-notifiers");
			oRm.addClass("sapUiNotifiers");
			oRm.writeClasses();
			oRm.write(">");
	
			/*
			 * Check if there is something wrong in the neighborhood... so call the
			 * Ghostbusters. If there is something to monitor/messages show it.
			 */
			var bMonitoring = false;
			for ( var i = 0; i < aNotifiers.length; i++) {
				if (aNotifiers[i].hasItems()) {
					bMonitoring = true;
					break;
				}
			}
	
			var bMessage = (oMN && oMN.hasItems()) ? true : false;
	
			if (bMonitoring) {
				fnRenderNotifiers(oRm, aNotifiers);
			}
	
			if (bMonitoring && bMessage) {
				/*
				 * Add separator between monitor controls and notification controls.
				 * The separator is only needed if monitoring controls and messages
				 * are available.
				 */
				oRm.write("<li");
				oRm.addClass("sapUiNotifierSeparator");
				oRm.writeClasses();
				oRm.write(">");
				oRm.write("&nbsp;");
				oRm.write("</li>");
			}
	
			if (bMessage) {
				fnRenderMessageNotifier(oRm, oMN, oControl);
			}
	
			oRm.write("</ul>");
		};
	
		var fnWriteFooter = function(oRm, oControl) {
			oRm.write("</div>");
		};
	
		/**
		 * Renders a single notifier
		 */
		var fnRenderNotifier = function(oRm, oNotifier, bMessageNotifier) {
			var sId = oNotifier.getId();
	
			oRm.write("<li");
			oRm.writeElementData(oNotifier);
			oRm.addClass("sapUiNotifier");
			oRm.writeClasses();
	
			// ItemNavigation can only handle focusable items
			oRm.writeAttribute("tabindex", "-1");
			oRm.writeAttribute("aria-describedby", sId + '-description>');
			oRm.write(">"); // li element
	
			fnWriteNotifierIcon(oRm, oNotifier.getIcon(), bMessageNotifier);
	
			// adding an element to enable a
			oRm.write('<div id="' + sId + '-description"');
			oRm.addStyle("display", "none");
			oRm.writeStyles();
			oRm.write(">");
	
			oRm.write("</div>");
	
			var iCount = oNotifier.getMessages().length;
			if (iCount > 0) {
				// opening the div with corresponding classes
				oRm.write('<div id="' + sId + '-counter" role="tooltip"');
				oRm.addClass("sapUiNotifierMessageCount");
				if (bMessageNotifier) {
					oRm.addClass("sapUiMessage");
				}
				oRm.writeClasses();
				oRm.write(">");
	
				// write the div's content
				if (iCount > 99) {
					iCount = ">99";
				}
				oRm.write(iCount);
	
				// closing the div
				oRm.write("</div>");
			}
	
			oRm.write("</li>"); // li element
		};
	
		var fnCreateNotifierViewMaximized = function(sId, oNotifier) {
			var oNotifierView = new sap.ui.ux3.NotificationBar.NotifierView(sId, {
				title : oNotifier.getTitle(),
				renderMode : "maximized"
			});
	
			if (oNotifier._bEnableMessageSelect) {
				oNotifierView.addStyleClass("sapUiNotifierSelectable");
			}
	
			var aMessages = oNotifier.getMessages();
			for ( var i = 0; i < aMessages.length; i++) {
				var oMessage = aMessages[i];
				var oMessageView = new sap.ui.ux3.NotificationBar.MessageView(sId + "-messageView-" + oMessage.getId(), {
					text : oMessage.getText(),
					timestamp : oMessage.getTimestamp()
				});
				oMessageView._message = oMessage;
				oMessageView.setIcon(oMessage.getIcon() || oMessage.getDefaultIcon("32x32"));
	
				oNotifierView.addMessage(oMessageView);
			}
	
			return oNotifierView;
		};
	
		/**
		 * Renders given map of notifiers
		 */
		var fnRenderNotifiers = function(oRm, aNotifiers) {
			for ( var i = 0; i < aNotifiers.length; i++) {
				fnRenderNotifier(oRm, aNotifiers[i], false);
			}
		};
	
		/**
		 * Renders the notifier's icon. If there is no icon set a default icon is
		 * used
		 */
		var fnWriteNotifierIcon = function(oRm, sUri, bMessageNotifier) {
			oRm.write("<img alt=\"\"");
			oRm.addClass("sapUiNotifierIcon");
			oRm.writeClasses();
	
			var iconUrl = "";
	
			if (sUri == null || sUri == "") {
				var sThemeModuleName = "sap.ui.ux3.themes." + sap.ui.getCore().getConfiguration().getTheme();
				if (bMessageNotifier) {
					iconUrl = jQuery.sap.getModulePath(sThemeModuleName, "/img/notification_bar/alert_white_24.png");
				} else {
					iconUrl = jQuery.sap.getModulePath(sThemeModuleName, "/img/notification_bar/notification_24.png");
				}
			} else {
				iconUrl = sUri;
			}
	
			oRm.writeAttributeEscaped("src", iconUrl);
			oRm.write(">");
	
			oRm.write("</img>");
		};
	
		/**
		 * This renders a given message notifier and its message area next to the
		 * notifier icon
		 */
		var fnRenderMessageNotifier = function(oRm, oNotifier, oNotiBar) {
			fnRenderNotifier(oRm, oNotifier, true);
			fnRenderMessageNotifierMessageArea(oRm, oNotifier, oNotiBar);
		};
	
		/**
		 * Renders the message area next to a message notifier
		 */
		var fnRenderMessageNotifierMessageArea = function(oRm, oMessageNotifier, oNotiBar) {
			if (oMessageNotifier.hasItems()) {
				var aMessages = oMessageNotifier.getMessages();
				var lastItem = aMessages[aMessages.length - 1];
	
				var oMA = oMessageNotifier._oMessageArea;
				// this ensures that this message is selectable from the bar
				oMA._message = lastItem;
				var sId = oNotiBar.getId() + "-inplaceMessage-" + oMA._message.getId();
	
				oRm.write("<li");
				oRm.writeAttribute("id", sId);
				oRm.addClass("sapUiInPlaceMessage");
				oRm.writeClasses();
	
				if (oNotiBar._gapMessageArea) {
					var sMargin = oNotiBar._gapMessageArea + "px";
					oRm.addStyle("margin-left", sMargin);
					oRm.writeStyles();
				}
				oRm.write(">");
	
				// oRm.renderControl(oMA);
				if (lastItem.getText() != "") {
					oRm.write("<div");
					oRm.writeControlData(oMA);
					// enable inplace message for item navigation
					oRm.writeAttribute("tabindex", "-1");
					oRm.addClass("sapUiNotifierMessageText");
					oRm.addClass("sapUiInPlaceMessage");
					// if the latest message is read-only don't provide a visual selectable link
					if (oMessageNotifier._bEnableMessageSelect && !oMA._message.getReadOnly()) {
						// if there is an event handler show the inplace message
						// clickable
						oRm.addClass("sapUiInPlaceMessageSelectable");
					}
					oRm.writeClasses();
					oRm.write(">");
					oRm.writeEscaped(lastItem.getText());
					oRm.write("</div>"); // Text
				}
	
				if (lastItem.getTimestamp() != "") {
					oRm.write("<div");
					oRm.addClass("sapUiNotifierMessageTimestamp");
					oRm.addClass("sapUiInPlaceMessage");
					oRm.writeClasses();
					oRm.write(">");
					oRm.writeEscaped(lastItem.getTimestamp());
					oRm.write("</div>"); // Timestamp
				}
	
				oRm.write("</li>");
			}
		};
	}());
	

	return NotificationBarRenderer;

}, /* bExport= */ true);
