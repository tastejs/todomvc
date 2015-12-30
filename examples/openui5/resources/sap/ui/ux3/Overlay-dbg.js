/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.ux3.Overlay.
sap.ui.define(['jquery.sap.global', 'sap/ui/core/Control', 'sap/ui/core/Popup', './library'],
	function(jQuery, Control, Popup, library) {
	"use strict";

	/**
	 * Constructor for a new Overlay.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * Overlay Control
	 * @extends sap.ui.core.Control
	 * @implements sap.ui.core.PopupInterface
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.ux3.Overlay
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var Overlay = Control.extend("sap.ui.ux3.Overlay", /** @lends sap.ui.ux3.Overlay.prototype */ { metadata : {

		interfaces : [
			"sap.ui.core.PopupInterface"
		],
		library : "sap.ui.ux3",
		properties : {

			/**
			 * Defines whether the 'Open' button shall be visible.
			 */
			openButtonVisible : {type : "boolean", group : "Misc", defaultValue : true},

			/**
			 * Defines whether the 'Close' button shall be visible.
			 */
			closeButtonVisible : {type : "boolean", group : "Misc", defaultValue : true}
		},
		events : {

			/**
			 * Event is fired when the Overlay starts closing.
			 */
			close : {allowPreventDefault : true,
				parameters : {

					/**
					 * The ID of the Overlay instance.
					 */
					id : {type : "string"}
				}
			},

			/**
			 * Event is fired when the Overlay is closed.
			 */
			closed : {allowPreventDefault : true,
				parameters : {

					/**
					 * The ID of the Overlay instance.
					 */
					id : {type : "string"}
				}
			},

			/**
			 * Event is fired when the 'Open' button of the Overlay is clicked.
			 */
			openNew : {
				parameters : {

					/**
					 * The ID of the Overlay instance.
					 */
					id : {type : "string"}
				}
			},

			/**
			 * Event is fired when the Overlay is opened.
			 */
			open : {
				parameters : {

					/**
					 * The ID of the Overlay instance
					 */
					id : {type : "string"}
				}
			}
		}
	}});

	Overlay.prototype.init = function() {
		var that = this;
		this._oPopup = new Popup(this, false, true);
		this._oPopup.attachOpened(function(oEvent){
			var domRef = jQuery.sap.byId(that._initialFocusId)[0];
			if (!domRef && that._getShell() && that.getOpenButtonVisible()) {
				domRef = jQuery.sap.domById(that._getOpenButtonId());
			} else if (!domRef && that._getShell() && that.getCloseButtonVisible()) {
				domRef = jQuery.sap.domById(that._getCloseButtonId());
			} else if (!domRef) {
				domRef = that.$("content").firstFocusableDomRef();
			}
			if (!domRef) {
				domRef = that.$().firstFocusableDomRef();
			}
			if (domRef) {
				jQuery.sap.focus(domRef);
			}
		});
		this._oPopup.attachClosed(function(oEvent){
			that.fireClosed({id : that.getId()});
		});
		this._overridePopupEventing();
	};

	/**
	 * Override Popup Events. Don't put Overlay to the front on mousedown.
	 * ToolPopups should always be in front of the Overlay.
	 *
	 * @private
	 */
	Overlay.prototype._overridePopupEventing = function() {
		this._oPopup.onmousedown = function(oEvent) {
			return;
		};
	};

	/**
	 * Returns the Shell (if both Overlay and Shell are rendered).
	 *
	 * @private
	 */
	Overlay.prototype._getShell = function() {
		var oShell = jQuery(".sapUiUx3Shell").control();

		if (oShell.length > 0 && !this._oShell) {
			this._oShell = oShell.length ? oShell[0] : null;
		}
		return this._oShell;
	};


	/**
	 * Returns the ID of the close button element.
	 *
	 * @return {string} The close button ID.
	 * @private
	 */
	Overlay.prototype._getCloseButtonId = function() {
		return this.getId() + "-close";
	};


	/**
	 * Returns the ID of the open button element.
	 *
	 * @return {string} The open button ID.
	 * @private
	 */
	Overlay.prototype._getOpenButtonId = function() {
		return this.getId() + "-openNew";
	};

	/**
	 *
	 * @param fFocusFirst
	 * @param fFocusLast
	 * @param fApplyChanges
	 * @private
	 */
	Overlay.prototype._initDom = function(fFocusFirst, fFocusLast, fApplyChanges) {
		//Override the popup theming and init the focus handling
		var oShell = jQuery(".sapUiUx3Shell").control();
		this._oShell = oShell.length ? oShell[0] : null;
		oShell = this._oShell;
		this.$().css("position", "fixed");
		if (oShell) {
			this._bFocusEventsRegistered = true;
			oShell.syncWithCanvasSize(this.getId(), true, fFocusFirst, fFocusLast, fApplyChanges);
			this.$("firstFocusDummyPaneFw").attr("tabindex", "0").focusin(jQuery.proxy(oShell.focusFirstHdr,oShell));
			this.$("firstFocusDummyPaneBw").attr("tabindex", "0").focusin(jQuery.proxy(oShell.focusLastTool,oShell));
			this.$("LastFocusDummyPane").attr("tabindex", "0").focusin(jQuery.proxy(oShell.focusPaneStart,oShell));
		} else {
			this.$().css("bottom", "0").css("top", "0").css("left", "0").css("right", "0");
		}
	};

	/**
	 *
	 * @private
	 */
	Overlay.prototype._cleanupDom = function() {
		if (this._oShell) {
			this._oShell.syncWithCanvasSize(this.getId(), false);
		}
		if (this._bFocusEventsRegistered) {
			this._bFocusEventsRegistered = false;
			this.$("firstFocusDummyPaneFw").removeAttr("tabindex").unbind("focusin");
			this.$("firstFocusDummyPaneBw").removeAttr("tabindex").unbind("focusin");
			this.$("LastFocusDummyPane").removeAttr("tabindex").unbind("focusin");
		}
	};

	/**
	 * Set size after rendering: If running in Shell && Popup is open/opening we sync with the shell canvas
	 * The size will then be set by the shell.
	 */
	Overlay.prototype.onAfterRendering = function() {
	    var oPopupState = this._oPopup.getOpenState();
	    if (oPopupState === sap.ui.core.OpenState.OPEN || oPopupState === sap.ui.core.OpenState.OPENING) {
	          this._initDom(jQuery.proxy(this._setFocusFirst, this), jQuery.proxy(this._setFocusLast, this), jQuery.proxy(this._applyChanges, this));
	    }
	};

	Overlay.prototype.onBeforeRendering = function() {
	};

	/**
	 * Destroys this instance of Overlay. It's called by Element destroy().
	 *
	 * @private
	 */
	Overlay.prototype.exit = function() {
		this.close();
		this._oPopup.destroy();
		this._oPopup = null;
		this._oShell = null;
	};

	/**
	 * Opens the Overlay.
	 *
	 * @param {string} initialFocusId ID of the control that gets focused when the overlay is openend
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	Overlay.prototype.open = function(initialFocusId) {
		this._initialFocusId = initialFocusId;
		if (this._oPopup.isOpen()) {
			return;
		}
		if (initialFocusId) {
			this._oPopup.setInitialFocusId(initialFocusId);
		}

		this._oPreviousFocus = Popup.getCurrentFocusInfo();

		this._oPopup.open(400);

		this._initDom(jQuery.proxy(this._setFocusFirst, this), jQuery.proxy(this._setFocusLast, this), jQuery.proxy(this._applyChanges, this));

		//fire open event
		this.fireOpen({
			id : this.getId()
		});
	};

	/**
	 * Closes the Overlay.
	 *
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	Overlay.prototype.close = function() {
		if (!this._oPopup.isOpen()) {
			return;
		}
		this._oPopup.close(400);
		jQuery.sap.delayedCall(400, this, 'restorePreviousFocus');
		this._cleanupDom();
	};

	/**
	 * Handle the click event happening on the Overlay.
	 *
	 * @param {jQuery.EventObject} oEvent
	 * @private
	 */
	Overlay.prototype.onclick = function(oEvent) {
		this._handleButtonEvent(oEvent);
	};

	/**
	 * Handle the sapselect pseudo event happening on the Overlay.
	 *
	 * @param {jQuery.EventObject} oEvent
	 * @private
	 */
	Overlay.prototype.onsapselect = function(oEvent) {
		this._handleButtonEvent(oEvent);
	};

	/**
	 * Event handling for Overlay Buttons.
	 *
	 * @param {jQuery.EventObject} oEvent
	 * @private
	 */
	Overlay.prototype._handleButtonEvent = function(oEvent) {
		var elementId = oEvent.target.id;
		if (elementId === this._getCloseButtonId()) {
			if (this.fireClose({id : this.getId()})) {
				this.close();
			}
		} else if (elementId === this._getOpenButtonId()) {
			this.fireOpenNew({
				id : this.getId()
			});
		}
	};

	/**
	 * Load language dependent texts.
	 *
	 * @param {string} sKey
	 * @param aArgs
	 * @returns {string}
	 * @private
	 */
	Overlay.prototype._getText = function(sKey, aArgs) {
		var rb = sap.ui.getCore().getLibraryResourceBundle("sap.ui.ux3");
		var sText;
		if (rb) {
			sText = rb.getText(sKey);
		}
		if (sText && aArgs) {
			for (var index = 0; index < aArgs.length; index++) {
				sText = sText.replace("{" + index + "}", aArgs[index]);
			}
		}
		return sText ? sText : sKey;
	};

	/**
	 * Returns the first focusable DOM element which is contained in this Overlay.
	 * This function is used for the Shell integration for a proper keyboard handling (tab chain).
	 *
	 * This function must be overridden in sub classes appropriately.
	 *
	 * @private
	 */
	Overlay.prototype._setFocusFirst = function() {
		jQuery.sap.focus(jQuery.sap.domById(this._getOpenButtonId()));
	};

	/**
	 * Returns the last focusable DOM element which is contained in this Overlay.
	 * This function is used for the Shell integration for a proper keyboard handling (tab chain).
	 *
	 * This function must be overridden in sub classes appropriately.
	 *
	 * @private
	 */
	Overlay.prototype._setFocusLast = function() {
		jQuery.sap.focus(jQuery.sap.domById(this._getCloseButtonId()));
	};

	/**
	 * Called from the Shell when properties (e.g. the HeaderType) are changing.
	 *
	 * This function must be overridden in sub classes appropriately.
	 * @param {Object} oChanges
	 * @private
	 */
	Overlay.prototype._applyChanges = function(oChanges) {
		return this;
	};

	/* Redefinition of generated API methods */
	// Implementation of API method isOpen

	/**
	 * Checks whether Overlay is open.
	 *
	 * @type boolean
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	Overlay.prototype.isOpen = function() {
		return this._oPopup.isOpen();
	};

	/* restore previous focus when closing */
	Overlay.prototype.restorePreviousFocus = function() {
		Popup.applyFocusInfo(this._oPreviousFocus);
	};

	return Overlay;
}, /* bExport= */ true);
