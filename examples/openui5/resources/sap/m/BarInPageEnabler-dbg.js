/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides helper sap.m.BarInPageEnabler
sap.ui.define(['sap/ui/base/Object'],
	function(Object) {
	"use strict";

	var mContexts = {
		footer : {
			contextClass : "sapMFooter-CTX",
			tag : "Footer",
			ariaLabel: "BAR_ARIA_DESCRIPTION_FOOTER"
		},
		header : {
			contextClass : "sapMHeader-CTX",
			tag : "Header",
			ariaLabel: "BAR_ARIA_DESCRIPTION_HEADER"
		},
		subheader : {
			contextClass : "sapMSubHeader-CTX",
			tag : "Header",
			ariaLabel: "BAR_ARIA_DESCRIPTION_SUBHEADER"
		}
	};

	var IBAR_CSS_CLASS = "sapMIBar";

	/**
	 * @class Helper Class for implementing the IBar interface. Should be created once per IBar instance.
	 * @version 1.22
	 * @protected
	 * @alias sap.m.IBarInPageEnabler
	 */
	var BarInPageEnabler = Object.extend("sap.m.BarInPageEnabler", /** @lends sap.m.BarInPageEnabler.prototype */ {
		/**
		 * Determines whether the bar is sensitive to the container context.
		 *
		 * Implementation of the IBar interface.
		 * @returns {boolean} isContextSensitive
		 * @protected
		 */
		isContextSensitive : function() {
			return this.getDesign && this.getDesign() === "Auto";
		},

		/**
		 * Sets the HTML tag of the root element.
		 * @param {string} sTag
		 * @returns {sap.m.IBar} this for chaining
		 * @protected
		 */
		setHTMLTag : function (sNewTag) {
			if (sNewTag === this.sTag) {
				return this;
			}

			this.sTag = sNewTag;

			return this;
		},

		/**
		 * Gets the HTML tag of the root domref.
		 * @returns {string} the HTML-tag
		 * @protected
		 */
		getHTMLTag : function () {
			if (!this.hasOwnProperty("sTag")) {
				//Div is the default
				this.sTag = sap.m.IBarHTMLTag.Div;
			}

			return this.sTag;
		},

		/**
		 * Sets classes and tag according to the context in the page.
		 *
		 * Possible contexts are header, footer, subheader.
		 * @param {string} sContext allowed values are header, footer, subheader.
		 * @returns {sap.m.IBar} this for chaining
		 * @protected
		 */
		applyTagAndContextClassFor : function (sContext) {
			var oOptions = mContexts[sContext];

			if (!oOptions) {
				jQuery.sap.log.error("The context " + sContext + " is not known", this);
				return this;
			}

			this._sAriaLabel = oOptions.ariaLabel;

			if (!this.isContextSensitive || !this.setHTMLTag) {
				jQuery.sap.log.error("The bar control you are using does not implement all the members of the IBar interface", this);
				return this;
			}

			//If this class does not gets added by the renderer, add it here
			if (!this.getRenderer().shouldAddIBarContext()) {
				this.addStyleClass(IBAR_CSS_CLASS + "-CTX");
			}

			this.setHTMLTag(oOptions.tag);

			if (this.isContextSensitive()) {
				this.addStyleClass(oOptions.contextClass);
			}

			return this;
		},


		//Rendering
		/**
		 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
		 * @protected
		 * @param {sap.ui.core.RenderManager} oRM the RenderManager that can be used for writing to the render output buffer.
		 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered.
		 */
		render : function(oRM, oControl) {
			var sTag = oControl.getHTMLTag().toLowerCase(),
				sLabelID = oControl.getId() + "-ariaLabel";

			oRM.write("<" + sTag);
			oRM.addClass(IBAR_CSS_CLASS);

			//ARIA
			if (oControl._sAriaLabel) {
				oRM.writeAttribute("aria-labelledby", sLabelID);
			}

			if (this.shouldAddIBarContext(oControl)) {
				oRM.addClass(IBAR_CSS_CLASS + "-CTX");
			}

			oRM.writeControlData(oControl);

			// call the hooks
			BarInPageEnabler.renderTooltip(oRM, oControl);
			this.decorateRootElement(oRM, oControl);

			oRM.writeClasses();
			oRM.writeStyles();
			oRM.write(">");

			//ARIA
			if (oControl._sAriaLabel) {
				var oMessageBundle = sap.ui.getCore().getLibraryResourceBundle("sap.m");
				oRM.write("<label id='" + sLabelID + "' style='display:none;' aria-hidden='true'>" + oMessageBundle.getText(oControl._sAriaLabel) + "</label>");
			}

			this.renderBarContent(oRM, oControl);

			oRM.write("</" + sTag + ">");
		}

	});

	/**
	 * Renders the tooltip for the given control
	 * @protected
	 * @param {sap.ui.core.RenderManager} oRM the RenderManager that can be used for writing to the render output buffer.
	 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered.
	 */
	BarInPageEnabler.renderTooltip = function(oRM, oControl) {
		var sTooltip = oControl.getTooltip_AsString();
		if (sTooltip) {
			oRM.writeAttributeEscaped("title", sTooltip);
		}
	};


	/**
	 * Adds the sapMBarChildClass to a control.
	 * @param {sap.ui.core.Control} oControl
	 * @protected
	 * @static
	 */
	BarInPageEnabler.addChildClassTo = function (oControl) {
		oControl.addStyleClass("sapMBarChild");
	};

	return BarInPageEnabler;

}, /* bExport= */ true);
