/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.m.Shell.
sap.ui.define(['jquery.sap.global', './library', 'sap/ui/core/Control'],
	function(jQuery, library, Control) {
	"use strict";


	
	/**
	 * Constructor for a new Shell.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * The Shell control can be used as root element of applications, it can contain an App or SplitApp control.
	 * The Shell provides some overarching functionality for the overall application and takes care of visual adaptation, like a frame around the App, on desktop browser platforms.
	 * @extends sap.ui.core.Control
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @since 1.12
	 * @alias sap.m.Shell
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var Shell = Control.extend("sap.m.Shell", /** @lends sap.m.Shell.prototype */ { metadata : {
	
		library : "sap.m",
		properties : {
	
			/**
			 * The application title which may or may not be displayed outside the actual application, depending on the available screen size.
			 */
			title : {type : "string", group : "Misc", defaultValue : null},
	
			/**
			 * A logo to be displayed next to the app when the screen is sufficiently large.
			 */
			logo : {type : "sap.ui.core.URI", group : "Appearance", defaultValue : null},
	
			/**
			 * Whether the Logout button should be displayed. This currently only happens on very tall screens (1568px height), otherwise it is always hidden.
			 */
			showLogout : {type : "boolean", group : "Behavior", defaultValue : true},
	
			/**
			 * A text, like the name of the logged-in user, which should be displayed on the right side of the header (if there is enough space to display the header at all - this only happens on very tall screens (1568px height), otherwise it is always hidden.).
			 */
			headerRightText : {type : "string", group : "Data", defaultValue : null},
	
			/**
			 * Whether the width of the content (the aggregated app) should be limited or extend to the full screen width.
			 */
			appWidthLimited : {type : "boolean", group : "Appearance", defaultValue : true},
	
			/**
			 * Background color of the Shell. If set, this color will override the default background defined by the theme. So this should only be set when really required.
			 * Any configured background image will be placed above this colored background.
			 * Use the "backgroundRepeat" property to define whether this image should be stretched to cover the complete Shell or whether it should be tiled.
			 * @since 1.11.2
			 */
			backgroundColor : {type : "sap.ui.core.CSSColor", group : "Appearance", defaultValue : null},
	
			/**
			 * Background image of the Shell. If set, this image will override the default background defined by the theme. So this should only be set when really required.
			 * This background image will be placed above any color set for the background.
			 * Use the "backgroundRepeat" property to define whether this image should be stretched to cover the complete Shell or whether it should be tiled.
			 * @since 1.11.2
			 */
			backgroundImage : {type : "sap.ui.core.URI", group : "Appearance", defaultValue : null},
	
			/**
			 * Whether the background image (if configured) should be proportionally stretched to cover the whole Shell (false, default) or whether it should be tiled (true).
			 * @since 1.11.2
			 */
			backgroundRepeat : {type : "boolean", group : "Appearance", defaultValue : false},
	
			/**
			 * Opacity of the background image. The opacity can be set between 0 (fully transparent) and 1 fully opaque).
			 * This can be used to improve readability of the shell content by making the background image partly transparent.
			 * @since 1.11.2
			 */
			backgroundOpacity : {type : "float", group : "Appearance", defaultValue : 1},
	
			/**
			 * Sets the icon used for the mobile device home screen and the icon to be used for bookmarks by desktop browsers.
			 * 
			 * This property should be only set once and as early as possible. Subsequent calls replace the previous icon settings and may lead to different behavior depending on the browser.
			 * 
			 * Different image sizes for device home screen need to be given as PNG images, an ICO file needs to be given as desktop browser bookmark icon (other file formats may not work in all browsers).
			 * The "precomposed" flag defines whether there is already a glow effect contained in the home screen images (or whether iOS should add such an effect). The given structure could look like this:
			 * {
			 * 'phone':'phone-icon_57x57.png',
			 * 'phone@2':'phone-retina_114x114.png',
			 * 'tablet':'tablet-icon_72x72.png',
			 * 'tablet@2':'tablet-retina_144x144.png',
			 * 'precomposed':true,
			 * 'favicon':'favicon.ico'
			 * }
			 * 
			 * See jQuery.sap.setIcons() for full documentation.
			 * 
			 */
			homeIcon : {type : "object", group : "Misc", defaultValue : null}
		},
		defaultAggregation : "app",
		aggregations : {
	
			/**
			 * A Shell contains an App or a SplitApp (they may be wrapped in a View). Other control types are not allowed.
			 */
			app : {type : "sap.ui.core.Control", multiple : false}
		},
		events : {
	
			/**
			 * Fired when the user presses the logout button/link.
			 */
			logout : {}
		}
	}});
	
	
	Shell.prototype.init = function() {
		// theme change might change the logo
		sap.ui.getCore().attachThemeChanged(jQuery.proxy(function(){
			var $hdr = this.$("hdr");
			if ($hdr.length) {
				$hdr.find(".sapMShellLogo").remove(); // remove old logo, if present
				var html = sap.m.ShellRenderer.getLogoImageHtml(this);
				$hdr.prepend(jQuery(html)); // insert new logo
			}
		}, this));
		
	
		jQuery.sap.initMobile({
			statusBar: "default",
			hideBrowser: true
		});
	};
	
	Shell.prototype.onAfterRendering = function () {
		var ref = this.getDomRef().parentNode,
			$ref;
		// set all parent elements to 100% height this *should* be done by the application in CSS, but people tend to forget it...
		if (ref && !ref._sapui5_heightFixed) {
			ref._sapui5_heightFixed = true;
			while (ref && ref !== document.documentElement) {
				$ref = jQuery(ref);
				if ($ref.attr("data-sap-ui-root-content")) { // some parents (e.g. Unified Shell) do this already
					break;
				}
				if (!ref.style.height) {
					ref.style.height = "100%";
				}
				ref = ref.parentNode;
			}
		}
		this.$("content").css("height", "");
	};
	
	Shell.prototype.ontap = function(oEvent) {
		if (oEvent.target.className
				&& oEvent.target.className.indexOf /* not available for SVG elements */
				&& oEvent.target.className.indexOf("sapMShellHeaderLogout") > -1) { // logout button clicked
			this.fireLogout();
		}
	};
	
	
	// API methods
	
	Shell.prototype.setTitle = function(sTitle) {
		this.$("hdrTxt").text(sTitle);
		this.setProperty("title", sTitle, true); // no rerendering
		return this;
	};
	
	Shell.prototype.setHeaderRightText = function(sText) {
		this.setProperty("headerRightText", sText, true); // no rerendering
		if (!sText) {
			sText = "";
		}
		this.$("hdrRightTxt").text(sText).css("display", (!!sText ? "inline" : "none"));
		return this;
	};
	
	Shell.prototype.setAppWidthLimited = function(bLimit) {
		this.$().toggleClass("sapMShellAppWidthLimited", bLimit);
		this.setProperty("appWidthLimited", bLimit, true); // no rerendering 
		return this;
	};
	
	Shell.prototype.setBackgroundOpacity = function(fOpacity) {
		if (fOpacity > 1 || fOpacity < 0) {
			jQuery.sap.log.warning("Invalid value " + fOpacity + " for Shell.setBackgroundOpacity() ignored. Valid values are: floats between 0 and 1.");
			return this;
		}
		this.$("BG").css("opacity", fOpacity);
		return this.setProperty("backgroundOpacity", fOpacity, true); // no rerendering - live opacity change looks cooler
	};
	
	Shell.prototype.setHomeIcon = function(oIcons) {
		this.setProperty("homeIcon", oIcons, true); // no rerendering
		jQuery.sap.setIcons(oIcons);
	};

	return Shell;

}, /* bExport= */ true);
