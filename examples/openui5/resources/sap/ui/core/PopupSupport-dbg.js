/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides class sap.ui.core.PopupSupport
sap.ui.define([ 'jquery.sap.global', 'sap/ui/Device', './Element', './Control'], function(jQuery, Device, Element, Control) {
	"use strict";

	/**
	 * This class provides some methods for Popup handling. This class can be
	 * used as a mixin for controls that use a Popup as a local instance.
	 *
	 * @returns {sap.ui.core.PopupSupport}
	 * @constructor
	 * @private
	 * @alias sap.ui.core.PopupSupport
	 */
	var PopupSupport = function() {
		this.getMetadata().addPublicMethods([ "getParentPopup", "isInPopup", "getParentPopupId", "addToPopup", "removeFromPopup" ]);

		/**
		 * Checks if the (optional) given jQuery-object or DOM-node is within a
		 * Popup. If no object is given the instance of the control will be used
		 * to check.
		 *
		 * @param {jQuery |
		 *            Node} [oThis] is the object that should be checked
		 *            (optional)
		 * @returns {boolean} whether this control instance is part of a Popup
		 */
		this.isInPopup = function(oThis) {
			var $ParentPopup = this.getParentPopup(oThis);

			return $ParentPopup && $ParentPopup.length > 0;
		};

		/**
		 * This function returns the parent Popup if available.
		 *
		 * @param {control}
		 *            [oThat] is an optional control instance. If another
		 *            instance than "this" is given the corresponding control
		 *            instance will be used to fetch the Popup.
		 * @returns {jQuery} [ParentPopup]
		 */
		this.getParentPopup = function(oThat) {
			// use either given object (control or DOM-ref) or this instance
			var oThis = oThat ? oThat : this;

			// if oThis is an element use its DOM-ref to look for a Popup. Else
			// 'oThis' is an DOM-ref therefore simply use it
			var $This = jQuery(oThis instanceof sap.ui.core.Element ? oThis.getDomRef() : oThis);

			// look up if there is a Popup above used DOM-ref
			return $This.closest("[data-sap-ui-popup]");
		};

		/**
		 * This returns the corresponding unique ID of the parent Popup.
		 *
		 * @param {control}
		 *            [oThat] is an optional control instance. If another
		 *            instance than "this" is given the corresponding control
		 *            instance will be used to fetch the Popup.
		 * @returns [string] ParentPopupId
		 */
		this.getParentPopupId = function(oThis) {
			var $ParentPopup = this.getParentPopup(oThis);
			return $ParentPopup.attr("data-sap-ui-popup");
		};

		/**
		 * Adds the given child Popup id to the given parent's association.
		 *
		 * @param [string]
		 *            sParentPopupId to which the id will be added
		 * @param [string]
		 *            sChildPopupId that will be added to the perant Popup
		 */
		this.addChildToPopup = function(sParentPopupId, sChildPopupId) {
			var sEventId = "sap.ui.core.Popup.addFocusableContent-" + sParentPopupId;
			sap.ui.getCore().getEventBus().publish("sap.ui", sEventId, {
				id : sChildPopupId
			});
		};

		/**
		 * Removes the child Popup from the parent Popup. If a dedicated Popup id is given
		 * then the control will be removed accordingly from this Popup. Else
		 * the closest Popup will be used as parent.
		 *
		 * @param {string}
		 *        sParentPopupId from which parent Popup the child should be removed
		 * @param {string}
		 *        sChildPopupId which child popup should be removed
		 */
		this.removeChildFromPopup = function(sParentPopupId, sChildPopupId) {
			var sEventId = "sap.ui.core.Popup.removeFocusableContent-" + sParentPopupId;
			sap.ui.getCore().getEventBus().publish("sap.ui", sEventId, {
				id : sChildPopupId
			});
		};

		/**
		 * Closes a specific Popup when the control instance isn't available
		 *
		 * @param [string]
		 *            sPopupId of Popup that should be closed
		 */
		this.closePopup = function(sPopupId) {
			var sEventId = "sap.ui.core.Popup.closePopup-" + sPopupId;
			sap.ui.getCore().getEventBus().publish("sap.ui", sEventId);
		};

		/**
		 * This function calls a popup to increase its z-index
		 *
		 * @param [string]
		 *            sPopupId of Popup that should increase its z-index
		 * @param [boolean]
		 *            bIsParent marks if a parent Popup calls its child Popups
		 *            to increase their z-index
		 */
		this.increaseZIndex = function(sPopupId, bIsParent) {
			var sEventId = "sap.ui.core.Popup.increaseZIndex-" + sPopupId;
			sap.ui.getCore().getEventBus().publish("sap.ui", sEventId, {
				isFromParentPopup : bIsParent ? bIsParent : false
			});
		};

		/**
		 * This function helps Popup controls to enable a tabchaining within its
		 * content. For the commons.Dialog and ux3.ToolPopup there is a fake
		 * element at the beginning and at the end of the DOM-structure. These
		 * elements are used to enable a chaining. If these element are focused
		 * this function determines which element in the content or footer area
		 * has to be focused. Since those control have a content and footer area
		 * with buttons it has to be checked whether a button or content-element
		 * is available that can be focused.
		 *
		 * @param [object]
		 *            mParameters contain all necessary parameters
		 * @param [object.object]
		 *            mParameter.that is the control that calls this function.
		 *            Needed for debug logging info
		 * @param [object.object]
		 *            mParameters.event is the event that is being forwarded
		 *            from the
		 * @param [object.string]
		 *            mParameters.firstFocusable is the first focusable element
		 *            in the control
		 * @param [object.string]
		 *            mParameters.lastFocusable is the last focusable element in
		 *            the control
		 * @param [object.jQuery]
		 *            mParameters.$FocusablesContent are focusable elements in
		 *            the content area of the control
		 * @param [object.jQuery]
		 *            mParameters.$FocusablesFooter are focusable elements in
		 *            the footer area of the control (e.g. buttons)
		 */
		this.focusTabChain = function(mParameters) {
			var oSourceDomRef = mParameters.event.target,
				sName = mParameters.that.getMetadata().getName(),
				oFocusDomRef;

			if ((!mParameters.$FocusablesContent ||  !mParameters.$FocusablesFooter) ||
				 (!mParameters.$FocusablesContent.length && !mParameters.$FocusablesFooter.length)) {
				// if there is neither content nor footer content (yet) simply do nothing
				return;
			}
			/*
			 * It's not needed to check if buttons are set since
			 * jQuery(":focusable", this.$("fhfe")) or
			 * jQuery(":sapFocusable", this.$("fhfe"))
			 * returns an empty array. Therefore these elements won't be found
			 * via 'lastFocusableDomRef()'
			 */
			if (oSourceDomRef.id === mParameters.firstFocusable) {
				// the FocusHandlingFirstElement was focused and thus the focus
				// should move to the last element.
				jQuery.sap.log.debug("First dummy focus element was focused", "", sName);
				if (mParameters.$FocusablesFooter.length > 0) {
					jQuery.sap.log.debug("Last footer element will be focused", "", sName);
					oFocusDomRef = mParameters.$FocusablesFooter[mParameters.$FocusablesFooter.length - 1];
				} else {
					jQuery.sap.log.debug("Last content element will be focused", "", sName);
					oFocusDomRef = mParameters.$FocusablesContent[mParameters.$FocusablesContent.length - 1];
				}
			} else if (oSourceDomRef.id === mParameters.lastFocusable) {
				// the FocusHandlingEndElement was focused and thus the focus
				// should move to the first element.
				jQuery.sap.log.debug("Last dummy focus element was focues", "", sName);
				if (mParameters.$FocusablesContent.length > 0) {
					jQuery.sap.log.debug("First content element will be focused", "", sName);
					oFocusDomRef = mParameters.$FocusablesContent[0];
				} else {
					jQuery.sap.log.debug("First footer element will be focused", "", sName);
					oFocusDomRef = mParameters.$FocusablesFooter[0];
				}
			}

			if (oFocusDomRef) {
				/*
				 * This check especially for IE9 is needed because when IE9 is
				 * used together with JAWS the element that will be focused
				 * isn't read when the focus happens too fast. Therefore a delay
				 * is added to JAWS can read the newly focused element.
				 */
				var iDelay = Device.browser.msie && Device.browser.version === 9 ? 100 : 0;

				jQuery.sap.delayedCall(iDelay, this, function() {
					// if the element is a control the focus should be called
					// via the control
					// especially if the control has an individual focus DOM-ref
					var oControl = sap.ui.getCore().byId(oFocusDomRef.id);
					if (oControl instanceof Control) {
						jQuery.sap.log.debug("Focus will be handled by " + oControl.getMetadata().getName(), "", sName);
					} else {
						jQuery.sap.log.debug("oFocusDomRef will be focused", "", sName);
					}
					jQuery.sap.focus(oControl ? oControl : oFocusDomRef);

					return oControl ? oControl.getId() : oFocusDomRef.id;
				});
			}
		};
	};

	return PopupSupport;

}, /* bExport= */true);
