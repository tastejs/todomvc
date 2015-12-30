/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.ux3.Notifier.
sap.ui.define(['jquery.sap.global', 'sap/ui/commons/Callout', 'sap/ui/core/Element', './library'],
	function(jQuery, Callout, Element, library) {
	"use strict";



	/**
	 * Constructor for a new Notifier.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * This element can be docked to a notification bar to show notification items
	 * @extends sap.ui.core.Element
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.ux3.Notifier
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var Notifier = Element.extend("sap.ui.ux3.Notifier", /** @lends sap.ui.ux3.Notifier.prototype */ { metadata : {

		library : "sap.ui.ux3",
		properties : {

			/**
			 * Icon of the control that should be displayed within the corresponding bar
			 */
			icon : {type : "sap.ui.core.URI", group : "Misc", defaultValue : null},

			/**
			 * Defines the title that should be displayed within the opening popup
			 */
			title : {type : "string", group : "Misc", defaultValue : null}
		},
		aggregations : {

			/**
			 * Messages of this notifier.
			 */
			messages : {type : "sap.ui.core.Message", multiple : true, singularName : "message"}, 

			/**
			 * Views aggregated with this Notifier and managed by the parent NotificationBar.
			 */
			views : {type : "sap.ui.core.Control", multiple : true, singularName : "view", visibility : "hidden"}
		},
		events : {

			/**
			 * Event is fired when a message of the notifiers was selected.
			 */
			messageSelected : {
				parameters : {

					/**
					 * The message that was selected
					 */
					message : {type : "sap.ui.core.Message"}, 

					/**
					 * The notifier that contains the selected message
					 */
					notifier : {type : "sap.ui.ux3.Notifier"}
				}
			}
		}
	}});


	


	/**
	 * This file defines behavior for the control,
	 */

	(function() {
		var fBeforeOpen = function() {
			this.fireEvent("_childControlCalling", {
				type : "openCallout",
				callout : this._oCallout,
				notifier : this
			});
		};

		/**
		 * This is to ensure that all content is destroyed when the Callout is
		 * closed. Otherwise the content is destroyed when the Callout should be
		 * opened again. But who knows if the user will really do this :-)?
		 */
		var fCalloutClosed = function(oEvent) {
			if (oEvent.getSource()) {
				oEvent.getSource().destroyContent();
			}
			if (this._oCallout) {
				this._oCallout.$().css("display", "none");
			}
		};


		/**
		 * This method checks if the notifier has any items.
		 *
		 * @type boolean
		 * @public
		 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
		Notifier.prototype.hasItems = function() {
			if (this.getMessages().length > 0) {
				return true;
			}
			return false;
		};

		Notifier.prototype.init = function() {

			/*
			 * Setting a parent isn't needed due to it will be set below when
			 * Callout is set as Tooltip
			 */
			this._oCallout = new Callout(this.getId() + "-callout", {
				beforeOpen : jQuery.proxy(fBeforeOpen, this),
				open : function(oEvent) {
					// to prevent that the Callout moves if the window is scrolled
					this.$().css({
						position : "fixed",
						display : "block"
					});
				},
				close : jQuery.proxy(fCalloutClosed, this),
				collision : "none"
			});
			this._oCallout.addStyleClass("sapUiNotifierCallout");
			if (sap.ui.Device.browser.mobile) {
				// if used on a mobile device the tab-event is transfered into a
				// 'mouseover' to open the Callout. To simulate a real tab-event the
				// open delay of the callout has to be eleminated.
				this._oCallout.setOpenDelay(0);
			}

			/*
			 * Though it seems that these are properties -> they're not. There are
			 * only methods to do this so a method-call is needed.
			 */
			this._oCallout.setMyPosition("begin bottom");
			this._oCallout.setAtPosition("begin top");

			/*
			 * The method needs to be overwritten since the positioning of the
			 * callout's arrow does currently not work for transparent arrows. The
			 * transparent arrow is styled differently than defined within the
			 * callout and therefore the hard-coded position of the arrow has to be
			 * corrected
			 */
			this._oCallout.setTip = function() {
				Callout.prototype.setTip.apply(this, arguments);

				/*
				 * Since the arrow is set with another CSS technique the position
				 * needs to be corrected as well
				 */
				var $arrow = this.$("arrow");
				$arrow.css("bottom", "-24px");

				/*
				 * Since the calculation of the callout's arrow works fine for RTL
				 * and must be corrected for LTR only a manipulation of the arrow's
				 * position is needed if LTR is active
				 */
				var bRtl = sap.ui.getCore().getConfiguration().getRTL();
				if (!bRtl) {
					$arrow.css("left", "6px");
				}
			};

			this.setTooltip(this._oCallout);
			this.setTooltip = function() {
				jQuery.sap.log.warning("Setting toolstips for notifiers deactivated");
			};

			this._proxyEnableMessageSelect = jQuery.proxy(fnEnableMessageSelect, this);
			this.attachEvent(sap.ui.base.EventProvider.M_EVENTS.EventHandlerChange, this._proxyEnableMessageSelect);
		};

		/**
		 * Checks if the 'messageSelected' event was attached to the Notifier. If so
		 * the corresponding event is fired and e.g. the NotificationBar can react
		 * on that.
		 */
		var fnEnableMessageSelect = function(oEvent) {
			var sEventId = oEvent.getParameter("EventId");

			if (sEventId === "messageSelected") {
				if (oEvent.getParameter("type") === "listenerAttached") {
					this._bEnableMessageSelect = true;
				} else if (oEvent.getParameter("type") === "listenerDetached") {
					this._bEnableMessageSelect = false;
				}

				this.fireEvent("_enableMessageSelect", {
					enabled : this._bEnableMessageSelect,
					notifier : this
				});
			}
		};

		Notifier.prototype.exit = function(oEvent) {
			this._oCallout = undefined;

			/*
			 * Instance is created when adding the Notifier as MessageNotifier to
			 * the NotificationBar
			 */
			if (this._oMessageView) {
				this._oMessageView.destroy();
				delete this._oMessageView;
			}

			this.detachEvent(sap.ui.base.EventProvider.M_EVENTS.EventHandlerChange, this._proxyEnableMessageSelect);
			delete this._proxyEnableMessageSelect;
		};

		Notifier.prototype.onclick = function(oEvent) {
			oEvent.preventDefault();

			this.$().trigger("mouseover");
		};

		var fnFireChildControlCalling = function(sType, oMessage, oThat) {
			var sLevel = oMessage ? oMessage.getLevel() : sap.ui.core.MessageType.None;

			oThat.fireEvent("_childControlCalling", {
				type : sType,
				notifier : oThat,
				level : sLevel,
				// these two values are needed if a message was removed
				message : oMessage,
				callout : oThat._oCallout
			});
		};

		Notifier.prototype.addMessage = function(oMessage) {
			this.addAggregation("messages", oMessage);
			fnFireChildControlCalling("added", oMessage, this);

			return this;
		};

		Notifier.prototype.insertMessage = function(oMessage, index) {
			this.insertAggregation("messages", oMessage, index);
			fnFireChildControlCalling("added", oMessage, this);

			return this;
		};

		Notifier.prototype.removeMessage = function(oMessage) {
			var oRemovedMessage = this.removeAggregation("messages", oMessage);
			if (oRemovedMessage) {
				fnFireChildControlCalling("removed", oRemovedMessage, this);
			}

			return oRemovedMessage;
		};

		Notifier.prototype.removeAllMessages = function() {
			var aRemovedMessages = this.removeAllAggregation("messages");
			if (aRemovedMessages.length > 0) {
				// only re-render if there were messages removed
				fnFireChildControlCalling("removed", null, this);
			}

			return aRemovedMessages;
		};
		Notifier.prototype.destroyMessages = function() {
			var iLength = this.getMessages().length;
			this.destroyAggregation("messages");

			if (iLength > 0) {
				// only re-render if there were messages removed
				fnFireChildControlCalling("removed", null, this);
			}

			return this;
		};
	}());

	return Notifier;

}, /* bExport= */ true);
