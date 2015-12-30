/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides class sap.ui.core.ThemeCheck
sap.ui.define(['jquery.sap.global', 'sap/ui/Device', 'sap/ui/base/Object', 'sap/ui/thirdparty/URI', 'jquery.sap.script'],
	function(jQuery, Device, BaseObject, URI/* , jQuerySap */) {
	"use strict";


	sap.ui._maxThemeCheckCycles = 100;

	/**
	 * Creates a new ThemeCheck object.
	 *
	 * @class Helper class used by the UI5 Core to check whether the themes are applied correctly.
	 *
	 * It could happen that e.g. in onAfterRendering not all themes are available. In these cases the
	 * check waits until the CSS is applied and fires an onThemeChanged event.
	 *
	 * @extends sap.ui.base.Object
	 * @since 1.10.0
	 * @author SAP SE
	 * @constructor
	 * @private
	 * @alias sap.ui.core.ThemeCheck
	 */
	var ThemeCheck = BaseObject.extend("sap.ui.core.ThemeCheck", /** @lends sap.ui.core.ThemeCheck.prototype */ {

		constructor : function(oCore) {
			this._oCore = oCore;
			this._iCount = 0; // Prevent endless loop
			this._CUSTOMCSSCHECK = /\.sapUiThemeDesignerCustomCss/i;
			this._CUSTOMID = "sap-ui-core-customcss";
			this._customCSSAdded = false;
			this._themeCheckedForCustom = null;
			this._mAdditionalLibCss = {};
		},

		getInterface : function() {
			return this;
		},

		fireThemeChangedEvent : function(bOnlyOnInitFail, bForceCheck) {
			clear(this);
			var bUseThemeCheck = sap.ui._maxThemeCheckCycles > 0; //Possibility to switch off theme check (except of force mode (for Core.applyTheme))

			if (bUseThemeCheck || bForceCheck) {
				delayedCheckTheme.apply(this, [true]);
			} else {
				ThemeCheck.themeLoaded = true;
			}

			if (!bOnlyOnInitFail && !this._sThemeCheckId) {
				this._oCore.fireThemeChanged({theme: this._oCore.getConfiguration().getTheme()});
			}

		}

	});

	ThemeCheck.themeLoaded = false;

	ThemeCheck.checkStyle = function(oStyle, bLog){
		if (typeof (oStyle) === "string") {
			oStyle = jQuery.sap.domById(oStyle);
		}
		var $Style = jQuery(oStyle);

		try {
			var res = !oStyle || !!((oStyle.sheet && oStyle.sheet.cssRules && oStyle.sheet.cssRules.length > 0) ||
							!!(oStyle.styleSheet && oStyle.styleSheet.cssText && oStyle.styleSheet.cssText.length > 0) ||
							!!(oStyle.innerHTML && oStyle.innerHTML.length > 0));
			var res2 = $Style.attr("data-sap-ui-ready");
			res2 = !!(res2 === "true" || res2 === "false");
			if (bLog) {
				jQuery.sap.log.debug("ThemeCheck: Check styles '" + $Style.attr("id") + "': " + res + "/" + res2 + "/" + !!oStyle);
			}
			return res || res2;
		} catch (e) {
			//escape eslint check for empty block
		}

		if (bLog) {
			jQuery.sap.log.debug("ThemeCheck: Error during check styles '" + $Style.attr("id") + "': false/false/" + !!oStyle);
		}
		return false;
	};

	function clear(oThemeCheck){
		ThemeCheck.themeLoaded = false;
		if (oThemeCheck._sThemeCheckId) {
			jQuery.sap.clearDelayedCall(oThemeCheck._sThemeCheckId);
			oThemeCheck._sThemeCheckId = null;
			oThemeCheck._iCount = 0;
			oThemeCheck._mAdditionalLibCss = {};
		}
	}

	function checkTheme(oThemeCheck) {
		var mLibs = oThemeCheck._oCore.getLoadedLibraries();
		var sThemeName = oThemeCheck._oCore.getConfiguration().getTheme();
		var sPath = oThemeCheck._oCore._getThemePath("sap.ui.core", sThemeName) + "custom.css";
		var res = true;

		if (!!oThemeCheck._customCSSAdded && oThemeCheck._themeCheckedForCustom === sThemeName) {
			// include custom style sheet here because it has already been added using jQuery.sap.includeStyleSheet
			// hence, needs to be checked for successful inclusion, too
			mLibs[oThemeCheck._CUSTOMID] = {};
		}

		function checkLib(lib) {
			res = res && ThemeCheck.checkStyle("sap-ui-theme-" + lib, true);
			if (!!res) {

			// check for css rule count
				if (Device.browser.msie && Device.browser.version <= 9) {
					var oStyle = jQuery.sap.domById("sap-ui-theme-" + lib);
					var iRules = oStyle && oStyle.sheet && oStyle.sheet.rules &&
									oStyle.sheet.rules.length ? oStyle.sheet.rules.length : 0;

					// IE9 and below can only handle up to 4095 rules and therefore additional
					// css files have to be included
					if (iRules === 4095) {
						var iNumber = parseInt(jQuery(oStyle).attr("data-sap-ui-css-count"), 10);
						if (isNaN(iNumber)) {
							iNumber = 1; // first additional stylesheet
						} else {
							iNumber += 1;
						}
						var sAdditionalLibSuffix = "ie9_" + iNumber;
						var sAdditionalLibName = this.name + "-" + sAdditionalLibSuffix;
						var sLinkId = "sap-ui-theme-" + sAdditionalLibName;
						if (!oThemeCheck._mAdditionalLibCss[sAdditionalLibName] && !jQuery.sap.domById(sLinkId)) {
							oThemeCheck._mAdditionalLibCss[sAdditionalLibName] = {
								name: this.name // remember original libName
							};
							var oBaseStyleSheet;
							if (lib !== this.name) {
								// use first stylesheet element of theme
								oBaseStyleSheet = jQuery.sap.domById("sap-ui-theme-" + this.name);
							} else {
								oBaseStyleSheet = oStyle;
							}
							// parse original href
							var oHref = new URI(oBaseStyleSheet.getAttribute("href"));
							var sSuffix = oHref.suffix();
							// get filename without suffix
							var sFileName = oHref.filename();
							if (sSuffix.length > 0) {
								sSuffix = "." + sSuffix;
								sFileName = sFileName.slice(0, -sSuffix.length);
							}
							// change filename only (to keep URI parameters)
							oHref.filename(sFileName + "_" + sAdditionalLibSuffix + sSuffix);
							// build final href
							var sHref = oHref.toString();
							// create the new link element
							var oLink = document.createElement("link");
							oLink.type = "text/css";
							oLink.rel = "stylesheet";
							oLink.href = sHref;
							oLink.id = sLinkId;

							jQuery(oLink)
							.attr("data-sap-ui-css-count", iNumber)
							.load(function() {
								jQuery(oLink).attr("data-sap-ui-ready", "true");
							}).error(function() {
								jQuery(oLink).attr("data-sap-ui-ready", "false");
							});

							oStyle.parentNode.insertBefore(oLink, oStyle.nextSibling);
						}
					}
				}

				/* as soon as css has been loaded, look if there is a flag for custom css inclusion inside, but only
				 * if this has not been checked successfully before for the same theme
				 */
				if (oThemeCheck._themeCheckedForCustom != sThemeName) {
					if (checkCustom(oThemeCheck, lib)) {
							//load custom css available at sap/ui/core/themename/library.css
						jQuery.sap.includeStyleSheet(sPath, oThemeCheck._CUSTOMID);
						oThemeCheck._customCSSAdded = true;
						jQuery.sap.log.warning("ThemeCheck delivered custom CSS needs to be loaded, Theme not yet applied");
						oThemeCheck._themeCheckedForCustom = sThemeName;
						res = false;
						return false;
					}	else {
						// remove stylesheet once the particular class is not available (e.g. after theme switch)
						/*check for custom theme was not successful, so we need to make sure there are no custom style sheets attached*/
						var customCssLink = jQuery("LINK[id='" +  oThemeCheck._CUSTOMID + "']");
						if (customCssLink.length > 0) {
							customCssLink.remove();
							jQuery.sap.log.debug("Custom CSS removed");
						}
						oThemeCheck._customCSSAdded = false;
					}
				}
			}
		}

		jQuery.each(mLibs, checkLib);
		jQuery.each(oThemeCheck._mAdditionalLibCss, checkLib);

		if (!res) {
			jQuery.sap.log.warning("ThemeCheck: Theme not yet applied.");
		} else {
			oThemeCheck._themeCheckedForCustom = sThemeName;
		}
		return res;
	}

	/* checks if a particular class is available at the beginning of the core styles
	 */
	function checkCustom (oThemeCheck, lib){
		var iRulesToCheck = 2,
			bSuccess = false,
			aRules = [];
		if (jQuery.sap.domById("sap-ui-theme-" + lib)) {
			var cssFile = jQuery.sap.domById("sap-ui-theme-" + lib);
			if (cssFile.sheet && cssFile.sheet.cssRules) {
				aRules = cssFile.sheet.cssRules;
			} else if (cssFile.styleSheet && cssFile.styleSheet.rules) {
				// we're in an old IE version
				aRules = cssFile.styleSheet.rules;
			}
		}
		if (aRules.length == 0) {
			jQuery.sap.log.warning("Custom check: Failed retrieving a CSS rule from stylesheet " + lib);
			return false;
		}
		// we should now have some rule name ==> try to match against custom check
		for (var i = 0; (i < iRulesToCheck && i < aRules.length) ; i++) {
			if (oThemeCheck._CUSTOMCSSCHECK.test(aRules[i].selectorText)) {
				bSuccess = true;
			}
		}
		return bSuccess;
	}

	function delayedCheckTheme(bFirst) {
		this._iCount++;

		var bEmergencyExit = this._iCount > sap.ui._maxThemeCheckCycles;

		if (!checkTheme(this) && !bEmergencyExit) {
			this._sThemeCheckId = jQuery.sap.delayedCall(2, this, delayedCheckTheme);
		} else if (!bFirst) {
			clear(this);
			ThemeCheck.themeLoaded = true;
			this._oCore.fireThemeChanged({theme: this._oCore.getConfiguration().getTheme()});
			if (bEmergencyExit) {
				jQuery.sap.log.warning("ThemeCheck: max. check cycles reached.");
			}
		} else {
			ThemeCheck.themeLoaded = true;
		}
	}


	return ThemeCheck;

});
