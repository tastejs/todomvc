/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.m.Link.
sap.ui.define(['jquery.sap.global', './library', 'sap/ui/core/Control', 'sap/ui/core/EnabledPropagator'],
	function(jQuery, library, Control, EnabledPropagator) {
	"use strict";



	/**
	 * Constructor for a new Link.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * A hyperlink control which can be used to trigger actions or to navigate to other applications or web pages.
	 * @extends sap.ui.core.Control
	 * @implements sap.ui.core.IShrinkable
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @since 1.12
	 * @alias sap.m.Link
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var Link = Control.extend("sap.m.Link", /** @lends sap.m.Link.prototype */ { metadata : {

		interfaces : [
			"sap.ui.core.IShrinkable"
		],
		library : "sap.m",
		properties : {

			/**
			 * Link text to be displayed.
			 */
			text : {type : "string", group : "Data", defaultValue : ''},

			/**
			 * Determines whether the link can be triggered by the user.
			 */
			enabled : {type : "boolean", group : "Behavior", defaultValue : true},

			/**
			 * Options are the standard values for window.open() supported by browsers: _self, _top, _blank, _parent, _search. Alternatively, a frame name can be entered. This property is only used when the href property is set.
			 */
			target : {type : "string", group : "Behavior", defaultValue : null},

			/**
			 * Width of the link (CSS-size such as % or px). When it is set, this is the exact size. When left blank, the text defines the size.
			 */
			width : {type : "sap.ui.core.CSSSize", group : "Dimension", defaultValue : null},

			/**
			 * The link target URI. Supports standard hyperlink behavior. If a JavaScript action should be triggered, this should not be set, but instead an event handler for the "press" event should be registered.
			 */
			href : {type : "sap.ui.core.URI", group : "Data", defaultValue : null},

			/**
			 * Determines whether the link text is allowed to wrap when there is not sufficient space.
			 */
			wrapping : {type : "boolean", group : "Appearance", defaultValue : false},

			/**
			 * Sets the horizontal alignment of the text.
			 * @since 1.28.0
			 */
			textAlign : {type : "sap.ui.core.TextAlign", group : "Appearance", defaultValue : sap.ui.core.TextAlign.Initial},

			/**
			 * This property specifies the element's text directionality with enumerated options. By default, the control inherits text direction from the parent DOM.
			 * @since 1.28.0
			 */
			textDirection : {type : "sap.ui.core.TextDirection", group : "Appearance", defaultValue : sap.ui.core.TextDirection.Inherit},

			/**
			 * Subtle links look more like standard text than like links. They should only be used to help with visual hierarchy between large data lists of important and less important links. Subtle links should not be used in any other use case.
			 * @since 1.22
			 */
			subtle : {type : "boolean", group : "Behavior", defaultValue : false},

			/**
			 * Emphasized links look visually more important than regular links.
			 * @since 1.22
			 */
			emphasized : {type : "boolean", group : "Behavior", defaultValue : false}
		},
		associations : {

			/**
			 * Association to controls / ids which describe this control (see WAI-ARIA attribute aria-describedby).
			 */
			ariaDescribedBy: {type: "sap.ui.core.Control", multiple: true, singularName: "ariaDescribedBy"},

			/**
			 * Association to controls / ids which label this control (see WAI-ARIA attribute aria-labelledby).
			 */
			ariaLabelledBy: {type: "sap.ui.core.Control", multiple: true, singularName: "ariaLabelledBy"}
		},
		events : {

			/**
			 * Event is fired when the user triggers the link control.
			 */
			press : {allowPreventDefault : true}
		}
	}});



	EnabledPropagator.call(Link.prototype); // inherit "disabled" state from parent controls

	/**
	 * Triggers link activation when space key is pressed on the focused control.
	 *
	 * @param {jQuery.Event} oEvent
	 */
	Link.prototype.onsapspace = function(oEvent) {
		this._handlePress(oEvent); // this calls any JS event handlers
		// _handlePress() checks the return value of the event handler and prevents default if required or of the Link is disabled
		if (this.getHref() && !oEvent.isDefaultPrevented()) {
			// Normal browser link, the browser does the job. According to the keyboard spec, Space should do the same as Enter/Click.
			// To make the browser REALLY do the same (history, referrer, frames, target,...), create a new "click" event and let the browser "do the needful".

			// first disarm the Space key event
			oEvent.preventDefault(); // prevent any scrolling which the browser might do because from its perspective the Link does not handle the "space" key
			oEvent.setMarked();

			// then create the click event
			var oClickEvent = document.createEvent('MouseEvents');
			oClickEvent.initEvent('click' /* event type */, false, true); // non-bubbling, cancelable
			this.getDomRef().dispatchEvent(oClickEvent);
		}
	};


	/**
	 * Handler for the "press" event of the link.
	 *
	 * @param {jQuery.Event} oEvent
	 * @private
	 */
	Link.prototype._handlePress = function(oEvent) {
		if (this.getEnabled()) {
			// mark the event for components that needs to know if the event was handled by the link
			oEvent.setMarked();

			if (!this.firePress() || !this.getHref()) { // fire event and check return value whether default action should be prevented
				oEvent.preventDefault();
			}
		} else { // disabled
			oEvent.preventDefault(); // even prevent URLs from being triggered
		}
	};

	if (sap.ui.Device.support.touch) {
		Link.prototype.ontap = Link.prototype._handlePress;
	} else {
		Link.prototype.onclick = Link.prototype._handlePress;
	}

	/**
	 * Handles the touch event on mobile devices.
	 *
	 * @param {jQuery.Event} oEvent
	 */
	Link.prototype.ontouchstart = function(oEvent) {
		if (this.getEnabled()) {
			// for controls which need to know whether they should handle events bubbling from here
			oEvent.setMarked();
		}
	};


	/* override standard setters with direct DOM manipulation */

	Link.prototype.setText = function(sText){
		this.setProperty("text", sText, true);
		sText = this.getProperty("text");
		this.$().text(sText);
		return this;
	};

	Link.prototype.setHref = function(sUri){
		this.setProperty("href", sUri, true);
		if (this.getEnabled()) {
			sUri = this.getProperty("href");
			this.$().attr("href", sUri);
		}
		return this;
	};

	Link.prototype.setSubtle = function(bSubtle){
		this.setProperty("subtle", bSubtle, true);

		var $this = this.$();
		if ($this.length) { // only when actually rendered
			$this.toggleClass("sapMLnkSubtle", bSubtle);
			if (bSubtle) {
				if (!this.getDomRef("linkSubtle")) {
					$this.append("<label id='" + this.getId() + "-linkSubtle" + "' class='sapUiHidden'>" + this._getLinkDescription("LINK_SUBTLE") + "</label>");
				}
			} else {
				this.$("linkSubtle").remove();
			}
		}
		return this;
	};

	Link.prototype.setEmphasized = function(bEmphasized){
		this.setProperty("emphasized", bEmphasized, true);

		var $this = this.$();
		if ($this.length) { // only when actually rendered
			$this.toggleClass("sapMLnkEmphasized", bEmphasized);
			if (bEmphasized) { // strictly spoken this should only be done when accessibility mode is true. But it is true by default, so not sure it is worth checking...
				if (!this.getDomRef("linkEmphasized")) {
					$this.append("<label id='" + this.getId() + "-linkEmphasized" + "' class='sapUiHidden'>" + this._getLinkDescription("LINK_EMPHASIZED") + "</label>");
				}
			} else {
				this.$("linkEmphasized").remove();
			}
		}
		return this;
	};

	Link.prototype.setWrapping = function(bWrapping){
		this.setProperty("wrapping", bWrapping, true);
		this.$().toggleClass("sapMLnkWrapping", bWrapping);
		return this;
	};

	Link.prototype.setEnabled = function(bEnabled){
		if (bEnabled !== this.getProperty("enabled")) { // do nothing when the same value is set again (virtual table scrolling!) - don't use this.getEnabled() because of EnabledPropagator
			this.setProperty("enabled", bEnabled, true);
			var $this = this.$();
			$this.toggleClass("sapMLnkDsbl", !bEnabled);
			if (bEnabled) {
				$this.attr("disabled", false);
				$this.attr("tabindex", "0");
				$this.removeAttr("aria-disabled");
				if (this.getHref()) {
					$this.attr("href", this.getHref());
				}
			} else {
				$this.attr("disabled", true);
				$this.attr("tabindex", "-1");
				$this.attr("aria-disabled", true);
				/*eslint-disable no-script-url */
				$this.attr("href", "javascript:void(0);");
				/*eslint-disable no-script-url */
			}
		}
		return this;
	};

	Link.prototype.setWidth = function(sWidth){
		this.setProperty("width", sWidth, true);
		this.$().toggleClass("sapMLnkMaxWidth", !sWidth);
		this.$().css("width", sWidth);
		return this;
	};

	Link.prototype.setTarget = function(sTarget){
		this.setProperty("target", sTarget, true);
		if (!sTarget) {
			this.$().removeAttr("target");
		} else {
			this.$().attr("target", sTarget);
		}
		return this;
	};

	/**
	 * Translates a text from the resource bundle.
	 *
	 * @param {String} sKey the resource to be translated
	 * @private
	 * @returns {String} the translated text
	 */
	Link.prototype._getLinkDescription = function(sKey) {
		var oRb = sap.ui.getCore().getLibraryResourceBundle("sap.m");
		var sText = oRb.getText(sKey);
		return sText;
	};

	return Link;

}, /* bExport= */ true);
