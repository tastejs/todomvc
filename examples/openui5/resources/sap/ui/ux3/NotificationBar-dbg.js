/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.ux3.NotificationBar.
sap.ui.define(['jquery.sap.global', 'sap/ui/core/Control', 'sap/ui/core/delegate/ItemNavigation', 'sap/ui/core/theming/Parameters', './library'],
	function(jQuery, Control, ItemNavigation, Parameters, library) {
	"use strict";


	
	/**
	 * Constructor for a new NotificationBar.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * A NotificationBar is a "toolbar" that can be added to a page to show messages and notifications from the application.
	 * Its position, height and width is inherited from the element that the notification bar is added to.
	 * @extends sap.ui.core.Control
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @since 1.7.0
	 * @alias sap.ui.ux3.NotificationBar
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var NotificationBar = Control.extend("sap.ui.ux3.NotificationBar", /** @lends sap.ui.ux3.NotificationBar.prototype */ { metadata : {
	
		library : "sap.ui.ux3",
		properties : {
	
			/**
			 * This property displays the bar corresponding to given status
			 */
			visibleStatus : {type : "sap.ui.ux3.NotificationBarStatus", group : "Misc", defaultValue : sap.ui.ux3.NotificationBarStatus.Default},
	
			/**
			 * This property enables the bar to be resized by the user.
			 */
			resizeEnabled : {type : "boolean", group : "Misc", defaultValue : true},
			
			/**
			 * This property defines if the toggler should be displayed the whole time when the NotificationBar is shown.
			 */
			alwaysShowToggler : {
				type : "boolean",
				defaultValue : false,
				since : "1.24.5"
			}
		},
		aggregations : {
	
			/**
			 * Notifier that shows messages
			 */
			messageNotifier : {type : "sap.ui.core.Element", multiple : false}, 
	
			/**
			 * Notifiers that monitor something within the application and display the corresponding notifications.
			 */
			notifiers : {type : "sap.ui.core.Element", multiple : true, singularName : "notifier"}
		},
		events : {
	
			/**
			 * Event is fired when the bar wants to be displayed depending on given flag. This allows the application to decide what to do.
			 */
			display : {
				parameters : {
	
					/**
					 * Indicates if the bar wants to be shown or hidden
					 */
					show : {type : "boolean"}
				}
			}, 
	
			/**
			 * This event is thrown when the bar was resized (to the different valid states: Min, Max, Default, None). The event itself can be used from SAPUI5-version 1.12.2 since there was a bug in the previous versions firing this event.
			 * @since 1.12.2
			 */
			resize : {
				parameters : {
	
					/**
					 * The corresponding status to which the bar was resized. The corresponding heights can be taken for the bar's CSS file.
					 */
					status : {type : "sap.ui.ux3.NotificationBarStatus"}
				}
			}
		}
	}});
	
	
	/**
	 * This file defines behavior for the control
	 */
	Control.extend("sap.ui.ux3.NotificationBar.NotifierView", {
		renderMessages : function(oRm) {
			oRm.write("<div");
			oRm.writeAttribute("id", this.getId() + "-content");
			oRm.addClass("sapUiNotifierContent");
			oRm.writeClasses();
			oRm.write(">");
	
			/*
			 * By setting the counter before running through loop this ensures that
			 * the most recent added message will be displayed first within rendered
			 * Callout
			 */
			var aMessages = this.getMessages();
			var i = aMessages.length - 1;
			var bFirst = true;
	
			for (; i >= 0; i--) {
				// Since first and last message don't need a
				// separator ->
				// prevent it
				if (!bFirst || (i == 0 && aMessages.length > 1)) {
					// if not the first message is being processed
					// OR
					// if the last available message is being
					// processed but
					// only
					// if there are more than one messages in total
	
					oRm.write("<div");
					oRm.addClass("sapUiNotificationBarCltSep");
					oRm.writeClasses();
					oRm.write(">");
	
					oRm.write("</div>");
				} else {
					// After first message was processed start
					// inserting a
					// separator
					bFirst = false;
				}
	
				var oMessage = aMessages[i];
				if (oMessage._message && oMessage._message.getReadOnly()) {
					oMessage.addStyleClass("sapUiNotifierMessageReadOnly");
				}
				oRm.renderControl(oMessage);
			}
	
			oRm.write("</div>"); // sapUiNotifierContent
		},
	
		metadata : {
			properties : {
				"title" : "string",
				"visibleItems" : "int",
				"renderMode" : {
					type : "string",
					defaultValue : "callout"
				}
			},
	
			aggregations : {
				"messages" : "sap.ui.ux3.NotificationBar.MessageView"
			}
		},
	
		init : function() {
			this._oResBundle = sap.ui.getCore().getLibraryResourceBundle("sap.ui.ux3");
		},
	
		exit : function() {
			if (this._renderedControl) {
				delete this._renderedControl;
			}
	
			delete this._oResBundle;
		},
	
		getTitle : function() {
			var sTitle = this.getProperty("title");
			var iCount = this.getMessages().length;
	
			if (iCount > 0) {
				var sKey = "NOTIBAR_NOTIFIER_VIEW_TITLE";
				sTitle = this._oResBundle.getText(sKey, [ sTitle, iCount ]);
			}
	
			return sTitle;
		},
	
		renderer : function(oRm, oControl) {
			oRm.write("<div");
			oRm.addClass("sapUiNotifierContainer");
			oRm.writeControlData(oControl);
			oRm.writeClasses();
			oRm.write(">");
	
			/*
			 * Render title
			 */
			oRm.write("<div");
			oRm.writeAttribute("id", oControl.getId() + "-title");
			oRm.addClass("sapUiNotifierTitle");
			oRm.writeClasses();
			oRm.write(">");
	
			oRm.writeEscaped(oControl.getTitle());
	
			oRm.write("</div>"); // div sapUiNotifierTitle
	
			/*
			 * Render messages
			 */
			if (oControl.getMessages().length > 0) {
				oControl.renderMessages(oRm);
			}
	
			oRm.write("</div>"); // sapUiNotifierContainer
		},
	
		onAfterRendering : function() {
			/*
			 * After all items are rendered it is needed to get the Callout's
			 * height. Since a single message could contain no, little or much text.
			 * So the messages' heights may vary.
			 */
			var $viewContent = this.$("content");
			var $aChildren = $viewContent.children();
	
			var iTotalHeight = 0, iCount = 0;
			// Used to prevent unneeded method calls within loop
			var iVisibleItems = this.getVisibleItems();
	
			// i=1 since view's title should be skipped for
			// calculation
			for (var i = 1; i < $aChildren.length; i++) {
				var child = jQuery($aChildren[i]);
	
				if (child.hasClass("sapUiNotifierMessage")) {
					iCount++;
				}
	
				var height = child.outerHeight(true);
				iTotalHeight += height;
	
				if (iCount == iVisibleItems) {
					// I don't know why these 2 pixels are needed
					// additionally
					// but
					// it works :-)
					iTotalHeight += 2;
					$viewContent.css("max-height", iTotalHeight);
				}
			}
		}
	});
	
	/**
	 * Internal control that renders a single message for the NotificationBar
	 * corresponding to its needs
	 */
	Control.extend("sap.ui.ux3.NotificationBar.MessageView", {
		metadata : {
			properties : {
				"text" : "string",
				"timestamp" : "string",
				"icon" : "sap.ui.core.URI"
			}
		},
	
		renderer : function(oRm, oControl) {
			var sId = oControl.getId();
	
			oRm.write("<div");
			oRm.writeControlData(oControl);
	
			oRm.addClass("sapUiNotifierMessage");
			oRm.writeClasses();
			oRm.writeAttribute("tabindex", "0");
			oRm.write(">");
	
			if (oControl.getIcon()) {
				oRm.write("<div");
				oRm.writeAttribute("id", sId + "-icon");
				oRm.addClass("sapUiNotifierMessageIcon");
				oRm.writeClasses();
				oRm.write(">");
	
				oRm.write("<img");
				oRm.writeAttributeEscaped("src", oControl.getIcon());
				oRm.write("/>");
	
				oRm.write("</div>");
			}
	
			oRm.write("<div");
			oRm.writeAttribute("id", sId + "-text");
			oRm.addClass("sapUiNotifierMessageText");
			oRm.writeClasses();
			oRm.write(">");
			oRm.writeEscaped(oControl.getText());
			oRm.write("</div>"); // Text
	
			oRm.write("<div");
			oRm.writeAttribute("id", sId + "-timestamp");
			oRm.addClass("sapUiNotifierMessageTimestamp");
			oRm.writeClasses();
			oRm.write(">");
			oRm.writeEscaped(oControl.getTimestamp());
			oRm.write("</div>"); // Timestamp
	
			oRm.write("</div>"); // NotificationItem
		},
	
		onclick : function(oEvent) {
			// only fire selected event if the message can be selected at all
			if (!this._message.getReadOnly()) {
				var oNotifier = this._message.getParent();
	
				oNotifier.fireMessageSelected({
					message : this._message,
					notifier : oNotifier
				});
			}
		},
	
		onsapselect : function(oEvent) {
			this.onclick(oEvent);
		},
	
		exit : function(oEvent) {
			if (this._message) {
				delete this._message;
			}
		}
	});
	
	(function() {
		var fnChangeVisibility = function(that) {
			var bShouldBeVisible = that.hasItems();
			var sStatus = that.getVisibleStatus();
	
			if (bShouldBeVisible && sStatus === "None") {
				return true;
			} else if (!bShouldBeVisible && sStatus !== "None") {
				return true;
			} else if (!bShouldBeVisible && sStatus !== "Min") {
				return true;
			} else {
				return false;
			}
	
		};
		
		var fnSortMessages = function(that, oNotifier) {
			var aSortMessages = oNotifier.getMessages().concat([]);
			if (aSortMessages.length > 0) {
				// sort ascending the messages via their level
				aSortMessages.sort(sap.ui.core.Message.compareByType);

				var iIndex = aSortMessages.length - 1;
				that._sSeverestMessageLevel = aSortMessages[iIndex].getLevel();
			}
		};
	
		/**
		 * This is the eventListener of the NotificationBar. All triggered events
		 * from the bar's notifiers will be caught here.
		 * 
		 * @param {sap.ui.base.Event}
		 *            oEvent the event will all needed stuff. It can contain
		 *            'added', 'removed' or 'openCallout' as a parameter to identify
		 *            the event.
		 */
		var fnChildEventListener = function(oEvent) {
			var oCallout = oEvent.getParameter("callout");
	
			switch (oEvent.getParameter("type")) {
			case "added":
			case "removed":
				var oNotifier = oEvent.getParameter("notifier");
	
				if (this.getMessageNotifier() && this.getMessageNotifier().getId() === oNotifier.getId()) {
					// clone the message array to sort it
					fnSortMessages(this, this.getMessageNotifier());
				}
	
				if (fnChangeVisibility(this)) {
					var bShouldBeVisible = this.hasItems();
					this.fireDisplay({
						show : bShouldBeVisible
					});
				} else {
					/*
					 * Needed if i.e. all messages of a notifier were removed but if
					 * there are still notifications or messages to display
					 */
					this.invalidate();
	
					/*
					 * Needed if the message is directly removed from the Callout
					 * without any request to the user.
					 */
					if (oEvent.getParameter("type") === "removed") {
						/*
						 * Since the Callout has only one content - the NotifierView -
						 * it can be checked this way. If there is no content the
						 * Callout has been closed already.
						 */
						if (oCallout.getContent().length > 0) {
							var oNotiView = oCallout.getContent()[0];
							var oMessage = oEvent.getParameter("message");
	
							var aMessageViews = oNotiView.getMessages();
							var tmpMsgView;
	
							for (var i = 0; i < aMessageViews.length; i++) {
								tmpMsgView = aMessageViews[i];
	
								if (oMessage.getId() === tmpMsgView._message.getId()) {
									tmpMsgView.destroy();
	
									/*
									 * A normal invalidate on the NotifierView
									 * doesn't work here since the invalidate is
									 * delegated to the most upper parent -> the
									 * NotificationBar. If the NotificationBar is
									 * rendered it doesn't know something of the
									 * corresponding Callout. It would be possible
									 * to rerender the NotifierView but since the
									 * height of the Callout is reduced the
									 * Callout's position must be fixed as well.
									 * This happens also when the Callout is
									 * rerendered, so it saves some lines of codes
									 * to rerender the Callout itself.
									 */
									oCallout.rerender();
	
									/*
									 * An open Callout would loose its correct
									 * position due to the re-rendering. The
									 * followOf-functionality of the Popup doesn't
									 * work here, since the opener hasn't moved. See
									 * CSN 1625930 2013
									 */
									oCallout.adjustPosition();
									break;
								}
							}
						}
					}
				}
	
				break;
	
			case "openCallout":
				oCallout.destroyContent();
	
				var oNotifier = oEvent.getParameter("notifier");
				// destroy (renew) views that were previously created in maximized
				// mode
				oNotifier.destroyAggregation("views", true);
				var sId = oNotifier.getId();
	
				var oMessageNotifier = this.getMessageNotifier();
	
				if (oMessageNotifier && sId === oMessageNotifier.getId()) {
					sId += "-messageNotifierView";
				} else {
					sId += "-messageView";
				}
	
				// create control that renders the notifier's messages
				var oNotifierView = new NotificationBar.NotifierView(sId, {
					title : oNotifier.getTitle(),
					visibleItems : this._visibleItems
				});
	
				if (oNotifier._bEnableMessageSelect) {
					oNotifierView.addStyleClass("sapUiNotifierSelectable");
				}
	
				var aMessages = oNotifier.getMessages();
				for (var i = 0; i < aMessages.length; i++) {
					var oView = fnCreateMessageView(aMessages[i], oNotifier, this);
					oNotifierView.addMessage(oView);
				}
	
				// with adding this aggregation the view is destroyed as well if
				// needed
				oNotifier.addAggregation("views", oNotifierView, true);
	
				oCallout.addContent(oNotifierView);
				break;
			}
		};
	
		NotificationBar.HOVER_ITEM_HEIGHT = 16;
	
		NotificationBar.prototype.init = function() {
			this._oItemNavigation = new ItemNavigation();
			this._oItemNavigation.setCycling(true);
			this.addDelegate(this._oItemNavigation);
	
			this._iCalloutWidth = parseInt(250, 10);
			this._iCalloutHeight = parseInt(200, 10);
	
			this._visibleItems = 5;
	
			this._eventListener = jQuery.proxy(fnChildEventListener, this);
	
			// needed within Renderer
			this._oResBundle = sap.ui.getCore().getLibraryResourceBundle("sap.ui.ux3");
	
			this._togglerPosition = "50%";
			this._gapMessageArea = "5";
	
			this._sSeverestMessageLevel = sap.ui.core.MessageType.None;
	
			// TODO maybe the ResizeHandler should be used
			/*
			 * Frank Weigel: I wonder whether the window.resize is sufficient. If
			 * the NotificationBar is not used top level (e.g. in Shell) but in some
			 * smaller portion of the screen (e.g. Panel), then resizing might occur
			 * without a window.resize. Unfortunately, there is no cross browser
			 * Element.resize event available. Instead, one can use our
			 * ResizeHandler, but this might need more discussion about the Pros and
			 * Cons (ResizeHandler does some kind of polling which is nasty...)
			 */
			jQuery(window).bind("resize", jQuery.proxy(fnOnResize, this));
	
			this._proxyEnableMessageSelect = jQuery.proxy(fnEnableMessageSelect, this);
			
			this.data("sap-ui-fastnavgroup", "true", true); // Define group for F6 handling

			// set toggler always to visible if running on a mobile device
			this.setAlwaysShowToggler(false);
		};
	
		NotificationBar.prototype.exit = function() {
			this.removeDelegate(this._oItemNavigation);
			this._oItemNavigation.destroy();
			delete this._oItemNavigation;
	
			delete this._iCalloutWidth;
			delete this._iCalloutHeight;
	
			delete this._visibleItems;
	
			delete this._eventListener;
	
			if (this.getMessageNotifier()) {
				var oMN = this.getMessageNotifier();
				oMN._oMessageArea.destroy();
				delete oMN._oMessageArea;
			}
	
			delete this._resizeFrom;
			delete this._resizeTo;
	
			delete this._oResBundle;
	
			delete this._formerVisibleStatus;
	
			delete this._togglerPosition;
			delete this._gapMessageArea;
	
			delete this._isHovered;
			delete this._togglerClicked;
	
			delete this._sSeverestMessageLevel;
	
			jQuery(window).unbind("resize", fnOnResize);
	
			delete this._proxyEnableMessageSelect;
		};
		/**
		 * This method creates an instance of the internal control
		 * {@link sap.ui.ux3.NotificationBar.MessageView} corresponding to the given
		 * message
		 * 
		 * @param {sap.ui.core.Message}
		 *            oMessage from that should be created a view
		 * @returns {sap.ui.ux3.NotificationBar.MessageView}
		 */
		var fnCreateMessageView = function(oMessage, oNotifier, oNotiBar) {
			var oMessageView = new NotificationBar.MessageView(oNotifier.getId() + "-messageView-" + oMessage.getId(), {
				text : oMessage.getText(),
				timestamp : oMessage.getTimestamp()
			});
			oMessageView._message = oMessage;
	
			if (oNotifier.sParentAggregationName == "messageNotifier") {
				if (oNotiBar.getVisibleStatus() == sap.ui.ux3.NotificationBarStatus.Max) {
					oMessageView.setIcon(oMessage.getIcon() || oMessage.getDefaultIcon("32x32"));
				} else {
					oMessageView.setIcon(oMessage.getIcon() || oMessage.getDefaultIcon());
				}
			} else {
				oMessageView.setIcon(oMessage.getIcon());
			}
	
			return oMessageView;
		};
	
		/**
		 * This attaches the given notifier to all necessary events that a notifier
		 * can trigger. A transformation is needed because 'this' in this method is
		 * the window instance
		 * 
		 * @param {sap.ui.ux3.NotificationBar}
		 *            The bar itself since 'this' is the window's instance
		 * @param {sap.ui.ux3.Notifier}
		 *            oNotifier that should be registered
		 */
		var fnRegisterNotifierToEvents = function(that, oNotifier) {
			oNotifier.attachEvent("_childControlCalling", that._eventListener, that);
		};
	
		/**
		 * This detaches the given notifier to all necessary events that a notifier
		 * can trigger. A transformation is needed because 'this' in this method is
		 * the window instance
		 * 
		 * @param {sap.ui.ux3.NotificationBar}
		 *            The bar itself since 'this' is the window's instance
		 * @param {sap.ui.ux3.Notifier}
		 *            oNotifier that should be detached
		 */
		var fnDeregisterNotifierFromEvents = function(that, oNotifier) {
			oNotifier.detachEvent("_childControlCalling", that._eventListener, that);
		};
	
		/*
		 * Add, insert, remove, removeAll methods for notifiers
		 */
		NotificationBar.prototype.addNotifier = function(oNotifier) {
			if (oNotifier) {
				var bSuppress = (this.getVisibleStatus() == sap.ui.ux3.NotificationBarStatus.None) ? true : false;
				this.addAggregation("notifiers", oNotifier, bSuppress);
				fnRegisterNotifierToEvents(this, oNotifier);
			}
	
			return this;
		};
		NotificationBar.prototype.insertNotifier = function(oNotifier, iIndex) {
			if (oNotifier) {
				this.insertAggregation("notifiers", oNotifier, iIndex);
				fnRegisterNotifierToEvents(this, oNotifier);
			}
	
			return this;
		};
		NotificationBar.prototype.removeNotifier = function(oNotifier) {
			var oRemovedNotifier = this.removeAggregation("notifiers", oNotifier);
			fnDeregisterNotifierFromEvents(this, oRemovedNotifier);
	
			return oRemovedNotifier;
		};
		NotificationBar.prototype.removeAllNotifiers = function() {
			var aChildren = this.removeAllAggregation("notifiers");
	
			for (var i = 0; i < aChildren.length; i++) {
				var oNotifier = aChildren[i];
				fnDeregisterNotifierFromEvents(this, oNotifier);
			}
	
			return aChildren;
		};
		NotificationBar.prototype.destroyNotifiers = function() {
			var aChildren = this.getNotifiers();
	
			for (var i = 0; i < aChildren.length; i++) {
				var oNotifier = aChildren[i];
				fnDeregisterNotifierFromEvents(this, oNotifier);
			}
	
			this.destroyAggregation("notifiers");
			return this;
		};
	
		/**
		 * This function is called when the 'messageSelected' event listener was
		 * attached/detached to the MessageNotifier. If the MessageNotifier is
		 * affected it is invalidated accordingly so the inplace message of the
		 * MessageNotifier is clickable or not and has visual features as if it were
		 * clickable.
		 */
		var fnEnableMessageSelect = function(oEvent) {
			var oMN = this.getMessageNotifier();
	
			if (oMN && oMN.getId() === oEvent.getParameter("notifier").getId()) {
				oMN.invalidate();
			}
		};
	
		/*
		 * Set, remove, destroy methods for message notifier
		 */
		NotificationBar.prototype.setMessageNotifier = function(oMessageNotifier) {
	
			var oMN = this.getMessageNotifier();
			if (oMN) {
				oMN._oMessageArea.destroy();
				delete oMN._oMessageArea;
	
				oMN.detachEvent("_enableMessageSelect", this._proxyEnableMessageSelect);
				fnDeregisterNotifierFromEvents(this, oMN);
			}
	
			this.setAggregation("messageNotifier", oMessageNotifier);
	
			if (oMessageNotifier) {
				oMessageNotifier._oMessageArea = new NotificationBar.MessageView(this.getId() + "-inplaceMessage");
				oMessageNotifier._oMessageArea.setParent(oMessageNotifier);
	
				oMessageNotifier.attachEvent("_enableMessageSelect", this._proxyEnableMessageSelect);
				fnRegisterNotifierToEvents(this, oMessageNotifier);
			}
	
			return this;
		};
		NotificationBar.prototype.destroyMessageNotifier = function(oMsgNotifier) {
	
			var oMN = this.getMessageNotifier();
			if (oMN) {
				oMN._oMessageArea.destroy();
				delete oMN._oMessageArea;
	
				oMN.detachEvent("_enableMessageSelect", this._proxyEnableMessageSelect);
				fnDeregisterNotifierFromEvents(this, oMN);
			}
	
			this.destroyAggregation("messageNotifier");
	
			return this;
		};
	
		var fnSetResizeClasses = function(that, sStatus) {
			var $That = that.$();
	
			switch (sStatus) {
			case sap.ui.ux3.NotificationBarStatus.Min:
				$That.addClass("sapUiNotificationBarMinimized");
				break;
	
			case sap.ui.ux3.NotificationBarStatus.Max:
				var sHeight = that.getHeightOfStatus(that.getVisibleStatus());
	
				$That.addClass("sapUiNotificationBarMaximized");
				$That.css("height", sHeight);
	
				var $containers = that.$("containers");
				$containers.css("max-height", sHeight);
				break;
	
			case sap.ui.ux3.NotificationBarStatus.None:
				if (!that._resizeTo) {
					$That.css("display", "none");
				}
				break;
	
			case sap.ui.ux3.NotificationBarStatus.Default:
			default:
				$That.removeClass("sapUiNotificationBarMaximized");
				$That.removeClass("sapUiNotificationBarMinimized");
	
				break;
			}
		};
	
		var fnResizeStuff = function(oThat) {
			if (fnWasResized(oThat)) {
				var sFromHeight = oThat.getHeightOfStatus(oThat._resizeFrom);
				var $That = oThat.$();
				$That.css("height", sFromHeight);
	
				var sToHeight = oThat.getHeightOfStatus(oThat._resizeTo);
	
				// animate accordingly to the used jQuery version
				$That.stop(true, true).animate({
					height : sToHeight
				}, "fast", function() {
					var sStatus = oThat.getVisibleStatus();
					if (sStatus === "None") {
						$That.css("display", "none");
	
						if (oThat.hasItems()) {
							if (oThat.getMessageNotifier()) {
								var oMN = oThat.getMessageNotifier();
								oMN.$().css("display", "none");
							}
	
							if (oThat.getNotifiers().length > 0) {
								var aNotifiers = oThat.getNotifiers();
								for (var i = 0; i < aNotifiers.length; i++) {
									aNotifiers[i].$().css("display", "none");
								}
							}
						}
					}
	
					fnSetResizeClasses(oThat, sStatus);
					fnResize(oThat, sStatus);
				});
			} else {
				/*
				 * Setting the correct size of the bar is necessary if the bar is
				 * maximized e.g. and a new message was added and triggered a
				 * re-rendering
				 */
				var sStatus = oThat.getVisibleStatus();
				fnSetResizeClasses(oThat, sStatus);
			}
	
			delete oThat._resizeFrom;
			delete oThat._resizeTo;
		};
	
		var fnSettingWidth = function(that) {
			if (that.getMessageNotifier() && that.getMessageNotifier().hasItems()) {
				var $messageArea;
				var sId = that.getId() + "-notifiers";
				var $domRef = jQuery.sap.byId(sId);
				if ($domRef.length > 0) {
					var iTotalWidth = parseInt($domRef.width(), 10);
	
					var $children = $domRef.children();
	
					for (var i = 0; i < $children.length; i++) {
						var $child = jQuery($children[i]);
	
						if ($child.hasClass("sapUiNotifier")) {
							iTotalWidth -= $child.width();
						} else if ($child.hasClass("sapUiNotifierSeparator")) {
							iTotalWidth -= $child.width();
						} else if ($child.hasClass("sapUiInPlaceMessage")) {
							$messageArea = $child;
						}
					}
	
					if ($messageArea) {
						// +2 since otherwise the inplace message has no place to be
						// displayed
						iTotalWidth -= that._gapMessageArea + 2;
						$messageArea.css("width", iTotalWidth + "px");
					}
				}
			}
		};
	
		var fnMouseMoveListener = function(oEvent) {
			var height = jQuery(window).height();
	
			var oNotiBar = oEvent.data.notibar;
			var $hoverDomRef = oNotiBar.$("hoverItem");
	
			var clientY = oEvent.clientY;
			var iClientTop = parseInt(clientY, 10);
	
			/*
			 * Border has to be moved up a little since the IE doesn't react anymore
			 * if the mouse cursor is too close to the boder.
			 */
			var iBorder = height - $hoverDomRef.outerHeight();
			if (oNotiBar._isHovered) {
				if (iClientTop < iBorder) {
					var fnHoverProxy = jQuery.proxy(fnHover, oNotiBar);
					$hoverDomRef.on("mouseleave", fnHoverProxy);
	
					window.setTimeout(function() {
						var oEvt = jQuery.Event("mouseleave", {
							notibar : oNotiBar
						});
						$hoverDomRef.trigger(oEvt);
	
						$hoverDomRef.off("mouseleave", fnHoverProxy);
					}, 100);
	
					delete oNotiBar._isHovered;
				}
			} else {
				if (iClientTop >= iBorder) {
					var fnHoverProxy = jQuery.proxy(fnHover, oNotiBar);
					$hoverDomRef.on("mouseenter", fnHoverProxy);
	
					window.setTimeout(function() {
						var oEvt = jQuery.Event("mouseenter", {
							notibar : oNotiBar
						});
						$hoverDomRef.trigger(oEvt);
	
						$hoverDomRef.off("mouseenter", fnHoverProxy);
					}, 100);
	
					oNotiBar._isHovered = true;
				}
			}
		};
	
		/*
		 * When the NotiBar is minimized the IE doesn't get the mouseenter and
		 * mouseleave events on the bar's parent element. So it's needed to simulate
		 * these events with checking if the mouse cursor is near the bottom of the
		 * window to manually trigger these events.
		 */
		var simulateMouseEventsForIE = function(oNotiBar) {
			var $doc = jQuery(document);
	
			if (oNotiBar.getVisibleStatus() === "Min") {
				$doc.on("mousemove", {
					notibar : oNotiBar
				}, fnMouseMoveListener);
			} else {
				$doc.off("mousemove", fnMouseMoveListener);
			}
		};
	
		/**
		 * @private
		 */
		NotificationBar.prototype.onAfterRendering = function() {
			this._oItemNavigation.setRootDomRef(this.getDomRef());
	
			var aItemDomRefs = [];
			var bIsMaximized = this.getVisibleStatus() === sap.ui.ux3.NotificationBarStatus.Max;
	
			// use different elements for navigation in maximized-mode
			if (bIsMaximized) {
				// add notifiers and messages reverse so the arrow keys can be used
				// properly. Or the whole control of the item navigation is
				// inverted.
				var oMessageNotifier = this.getMessageNotifier();
				if (oMessageNotifier != null) {
					var aMessages = oMessageNotifier.getMessages();
					var sId = oMessageNotifier.getId() + "-messageNotifierView-messageView-";
	
					for (var i = aMessages.length - 1; i >= 0; i--) {
						var oDomRef = jQuery.sap.domById(sId + aMessages[i].getId());
						if (oDomRef) {
							aItemDomRefs.push(oDomRef);
						}
					}
				}
	
				var aNotifiers = this.getNotifiers();
				for (var i = 0; i < aNotifiers.length; i++) {
					var aMessages = aNotifiers[i].getMessages();
					var sId = aNotifiers[i].getId() + "-notifierView-messageView-";
	
					for (var j = aMessages.length - 1; j >= 0; j--) {
						var oDomRef = jQuery.sap.domById(sId + aMessages[j].getId());
						if (oDomRef) {
							aItemDomRefs.push(oDomRef);
						}
					}
				}
	
			} else {
				var aNotifiers = this.getNotifiers();
				for (var i = 0; i < aNotifiers.length; i++) {
					var oDomRef = aNotifiers[i].getDomRef();
					if (oDomRef) {
						aItemDomRefs.push(oDomRef);
					}
				}
	
				var oMessageNotifier = this.getMessageNotifier();
				if (oMessageNotifier != null) {
					var oDomRef = oMessageNotifier.getDomRef();
					if (oDomRef) {
						aItemDomRefs.push(oDomRef);
					}
	
					// add the inplace message to the item navigation as well
					oDomRef = this.getDomRef("inplaceMessage");
					if (oDomRef && jQuery(oDomRef).hasClass("sapUiInPlaceMessageSelectable")) {
						aItemDomRefs.push(oDomRef);
					}
				}
			}
	
			this._oItemNavigation.setItemDomRefs(aItemDomRefs);
	
			/*
			 * Stuff for resizing
			 */
			fnResizeStuff(this);
	
			/*
			 * Calculating of the width to get the correct width for the message
			 * area
			 */
			fnSettingWidth(this);
	
			/*
			 * Set corresponding color for MessageNotifier's counter and description
			 * for the MessageNotifier
			 */
			fnSetSeverityForMessageNotifier(this, this.getMessageNotifier());
	
			// set descriptions for all normal notifiers
			fnSetItemsDescription(this);
	
			if (!!sap.ui.Device.browser.internet_explorer) {
				simulateMouseEventsForIE(this);
			}
	
			// set toggler always to visible if running on a mobile device
			if (sap.ui.Device.browser.mobile) {
				var $toggler = this.$("toggler");
	
				if (this.getVisibleStatus() !== sap.ui.ux3.NotificationBarStatus.None) {
					$toggler.css("display", "block");
				} else {
					$toggler.css("display", "none");
				}
			}
		};
	
		/**
		 * This method sets the corresponding CSS class to the message notifier's
		 * counter to set its corresponding color and sets the corresponding ARIA
		 * information to the notifier's description element
		 * 
		 * @private
		 */
		var fnSetSeverityForMessageNotifier = function(oThis, oMN) {
			if (oMN && oMN.hasItems()) {
				var $messageCount = oMN.$("counter");
	
				// remove all possible classes
				$messageCount.removeClass("sapUiMessageInformation");
				$messageCount.removeClass("sapUiMessageSuccess");
				$messageCount.removeClass("sapUiMessageWarning");
				$messageCount.removeClass("sapUiMessageError");

				// re-sort the messages and re-calc the severity level because they could have been changed 
				// if the NotiBar was invisible
				fnSortMessages(oThis, oMN);
				// add new corresponding class
				var sLvl = oThis._sSeverestMessageLevel;
				$messageCount.addClass("sapUiMessage" + sLvl);
	
				// create key for description text
				var iCount = oMN.getMessages().length;
				var sKey = "NOTIBAR_MESSAGE_NOTIFIER_DESC_LEVEL_" + sLvl.toUpperCase() + (iCount === 1 ? "_SING" : "_PL");
	
				// set description (i.e. "3 messages available: Highest severity
				// "Error")
				fnSetNotifierDescription(oThis, oMN, sKey, iCount);
			}
		};
	
		/**
		 * Sets all description of all notifiers
		 * 
		 * @private
		 */
		var fnSetItemsDescription = function(oThis) {
			var aNotifiers = oThis.getNotifiers();
	
			for (var i = 0; i < aNotifiers.length; i++) {
				var iCount = aNotifiers[i].getMessages().length;
				var sKey = "NOTIBAR_NOTIFIER_COUNT_TEXT_" + (iCount === 1 ? "SING" : "PL");
	
				fnSetNotifierDescription(oThis, aNotifiers[i], sKey, iCount);
			}
		};
	
		var fnSetNotifierDescription = function(oThis, oNotifier, sKey, iCount) {
			var $description = oNotifier.$("description");
	
			var sMessage = oThis._oResBundle.getText(sKey, [ iCount ]);
			$description.html(sMessage);
		};
	
		/*
		 * Event listener for mouseenter/mouseleave for NotificationBar's parent
		 * HTML-element
		 */
		var fnHover = function(oEvent) {
			var $toggler = this.$("toggler");
	
			var bDisplay = ($toggler.css("display") === "block") ? true : false;
			if (bDisplay) {
				// if toggler is being displayed
				if (oEvent.type === "mouseleave") {
					$toggler.css("display", "none");
				}
			} else {
				if (oEvent.type === "mouseenter") {
					$toggler.css("display", "block");
				}
			}
		};
	
		/*
		 * EventListener when bar was resized
		 */
		var fnOnResize = function(oEvent) {
			/*
			 * Calculating of the width to get the correct width for the message
			 * area
			 */
			fnSettingWidth(this);
		};
	
		var fnWasResized = function(that) {
			if (that._resizeFrom && that._resizeTo) {
				if (that._resizeFrom != that._resizeTo) {
					return true;
				}
			}
	
			return false;
		};
	

		/**
		 * This method checks if the NotificationBar has any items (notifications or messages) to show and returns true if there are any items to show. So the application should decide if the bar should be displayed.
		 *
		 * @type boolean
		 * @public
		 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
		 */
		NotificationBar.prototype.hasItems = function() {
			// Checking all notifiers if any has items
			var mNotifiers = this.getNotifiers();
			if (mNotifiers.length > 0) {
				for (var i = 0; i < mNotifiers.length; i++) {
					var oNotifier = mNotifiers[i];
					if (oNotifier.hasItems()) {
						return true;
					}
				}
			}
	
			// Checking MessageNotifier if it has items
			if (this.getMessageNotifier()) {
				if (this.getMessageNotifier().hasItems()) {
					return true;
				}
			}
	
			return false;
		};
	
		var fnResize = function(oNotiBar, toStatus) {
			var display = "none";
			var $NotiBar = oNotiBar.$();
	
			switch (toStatus) {
			/*
			 * These cases are only mentioned to prevent running into default
			 */
			case sap.ui.ux3.NotificationBarStatus.Max:
			case sap.ui.ux3.NotificationBarStatus.None:
				break;
	
			case sap.ui.ux3.NotificationBarStatus.Min:
				/*
				 * Since minimizing doesn't need any re-rendering all necessary
				 * stuff can be done here
				 */
				$NotiBar.stop().animate({
					height : oNotiBar.getHeightOfStatus(toStatus)
				}, {
					duration : "fast",
					queue : true
				});
	
				$NotiBar.addClass("sapUiNotificationBarMinimized");
	
				oNotiBar.$("notifiers").css("display", "none");
	
				display = "block";
				break;
	
			default:
			case sap.ui.ux3.NotificationBarStatus.Default:
				/*
				 * If bar should be resized from maximized to default a re-rendering
				 * is needed. Otherwise a simple animation and CSS exchange is
				 * enough
				 */
				$NotiBar.stop().animate({
					height : oNotiBar.getHeightOfStatus(toStatus)
				}, {
					duration : "fast",
					queue : true
				});
	
				$NotiBar.removeClass("sapUiNotificationBarMaximized");
				$NotiBar.removeClass("sapUiNotificationBarMinimized");
	
				break;
			}
	
			var $hover = oNotiBar.$("hoverItem");
			$hover.css("display", display);
		};
	
		NotificationBar.prototype.onfocusin = function(oEvent) {
			if (this._togglerClicked) {
				delete this._togglerClicked;
	
				/*
				 * if the bar is minimized and a notifiers still has the focus it is
				 * needed to stop this event to prevent webkit browsers from
				 * scrolling down
				 */
				oEvent.stopImmediatePropagation(true);
			}
		};
	
		NotificationBar.prototype.onclick = function(oEvent) {
			/*
			 * if the bar is minimized and a notifiers still has the focus it is
			 * needed to stop this event to prevent webkit browsers from scrolling
			 * down
			 */
			this._togglerClicked = true;
			/*
			 * Prevent that the NotificationBar itselft gets the focus and causes a
			 * (dotted) border around the hover item and/or the bar iteslef
			 */
			this.$().blur();
			var $activeElement = jQuery(document.activeElement);
	
			fnCloseAllCallouts(this);
	
			var sId = oEvent.target.id;
			var aSplit = sId.split("-");
	
			if (aSplit) {
				var sVisibleStatus = this.getVisibleStatus();
				var iIndex = aSplit.length - 1;
	
				switch (aSplit[iIndex]) {
				case "ArrowUp":
					if (sVisibleStatus === "Min") {
						this.setVisibleStatus("Default");
					} else {
						// if current state is default -> maximize bar
						this.setVisibleStatus("Max");
					}
					break;
	
				case "ArrowDown":
					if (sVisibleStatus === "Max") {
						this.setVisibleStatus("Default");
					} else {
						// if current state is default -> minimize bar
						this.setVisibleStatus("Min");
					}
					oEvent.preventDefault();
					break;
	
				case "BarUp":
					if (this._formerVisibleStatus) {
						this.setVisibleStatus(this._formerVisibleStatus);
					} else {
						this.setVisibleStatus("Default");
					}
	
					break;
	
				case "BarDown":
					this._formerVisibleStatus = sVisibleStatus;
					this.setVisibleStatus("Min");
	
					$activeElement.blur();
					break;
	
				default:
					if ($activeElement.hasClass("sapUiNotifier")) {
						$activeElement.focus();
					} else {
						if (this.hasItems()) {
							var aNotifiers = this.getNotifiers();
							if (aNotifiers.length > 0) {
								var $firstNoti = jQuery(aNotifiers[0]);
								$firstNoti.focus();
							} else {
								var messageNoti = this.getMessageNotifier();
								if (messageNoti) {
									jQuery(messageNoti).focus();
								}
							}
						}
					}
					break;
				}
			}
		};
	
		NotificationBar.prototype.onThemeChanged = function(oEvent) {
			if (this.getDomRef()) {
				this.invalidate();
			}
		};
	
		/**
		 * Forces a close of all Callouts of all notifiers of the NotificationBar.
		 */
		var fnCloseAllCallouts = function(that) {
			var mNotifiers = that.getNotifiers();
	
			for (var i = 0; i < mNotifiers.length; i++) {
				var oNotifier = mNotifiers[i];
	
				oNotifier._oCallout.close();
			}
	
			if (that.getMessageNotifier()) {
				that.getMessageNotifier()._oCallout.close();
			}
		};
	
		NotificationBar.prototype.getHeightOfStatus = function(sStatus) {
			var sParam = "";
	
			if (sStatus == sap.ui.ux3.NotificationBarStatus.Min) {
				sParam = "sapUiNotificationBarHeightMinimized";
			} else if (sStatus == sap.ui.ux3.NotificationBarStatus.Default) {
				sParam = "sapUiNotificationBarHeight";
			} else if (sStatus == sap.ui.ux3.NotificationBarStatus.Max) {
				sParam = "sapUiNotificationBarHeightMaximized";
				sParam = Parameters.get(sParam);
	
				var iIndex = sParam.indexOf("%");
				if (iIndex != -1) {
					var iPercentage = sParam.substring(0, iIndex);
					var iHeight = jQuery(window).height();
					iHeight = parseInt(iHeight / 100 * iPercentage, 10);
	
					// Ensure that the MaxHeight is at least 1 px larger than the
					// Default
					// Maybe disabling the resize feature would be the better
					// approach in this case
					var _iHeight = parseInt(this.getHeightOfStatus(sap.ui.ux3.NotificationBarStatus.Default), 10);
					if (iHeight < _iHeight) {
						iHeight = _iHeight + 1;
					}
				} else {
					var sMessage = "No valid percantage value given for maximized size. 400px is used";
					jQuery.sap.log.warning(sMessage);
	
					iHeight = 400;
				}
				return iHeight + "px";
			} else {
				// sStatus == sap.ui.ux3.NotificationBarStatus.None
				return "0px";
			}
	
			sParam = Parameters.get(sParam);
			return sParam;
		};
	
		NotificationBar.prototype.setVisibleStatus = function(toStatus) {
			this._resizeFrom = this.getVisibleStatus();
			this._resizeTo = toStatus;
	
			// skip setting the property if 'toStatus' equals the current status
			if (this._resizeFrom !== this._resizeTo) {
				if (toStatus === sap.ui.ux3.NotificationBarStatus.None) {
					fnCloseAllCallouts(this);
	
					if (this.getDomRef()) {
						fnResize(this, toStatus);
					} else {
						this.$().css({
							"height" : "0px",
							"display" : "none"
						});
					}
				}
	
				this.setProperty("visibleStatus", toStatus);
	
				this.fireResize({
					status : toStatus
				});
			}
		};

		/**
		 * @param [boolean]
		 *            {bAlwaysShow} if the toggler should be visible all the time
		 *            set this parameter to <b>true</b>
		 * @public
		 * @since 1.22.11
		 */
		sap.ui.ux3.NotificationBar.prototype.setAlwaysShowToggler = function(bAlwaysShow) {
			// set toggler always to visible if running on a mobile device
			if (sap.ui.Device.browser.mobile) {
				bAlwaysShow = true;
			}
			
			this.setProperty("alwaysShowToggler", bAlwaysShow, true);
			
			var $toggler = this.$("toggler");
			if (bAlwaysShow) {
				$toggler.css("display", "block");
			} else {
				$toggler.css("display", "none");
			}
		};
	}());

	return NotificationBar;

}, /* bExport= */ true);
