/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

//Provides class sap.ui.core.Configuration
sap.ui.define(['jquery.sap.global', '../Device', '../Global', '../base/Object', './Locale', 'sap/ui/thirdparty/URI', 'jquery.sap.script'],
	function(jQuery, Device, Global, BaseObject, Locale, URI /*, jQuerySapScript */ ) {
	"use strict";

	// lazy dependencies. Can't be declared as this would result in cyclic dependencies
	var CalendarType, LocaleData;

	/**
	 * Creates a new Configuration object.
	 *
	 * @class Collects and stores the configuration of the current environment.
	 *
	 * The Configuration is initialized once when the {@link sap.ui.core.Core} is created.
	 * There are different ways to set the environment configuration (in ascending priority):
	 * <ol>
	 * <li>System defined defaults
	 * <li>Server wide defaults, read from /sap-ui-config.json
	 * <li>Properties of the global configuration object window["sap-ui-config"]
	 * <li>A configuration string in the data-sap-ui-config attribute of the bootstrap tag
	 * <li>Individual data-sap-ui-xyz attributes of the bootstrap tag
	 * <li>Using URL parameters
	 * <li>Setters in this Configuration object (only for some parameters)
	 * </ol>
	 *
	 * That is, attributes of the DOM reference override the system defaults, URL parameters
	 * override the DOM attributes (where empty URL parameters set the parameter back to its
	 * system default). Calling setters at runtime will override any previous settings
	 * calculated during object creation.
	 *
	 * The naming convention for parameters is:
	 * <ul>
	 * <li>in the URL : sap-ui-<i>PARAMETER-NAME</i>="value"
	 * <li>in the DOM : data-sap-ui-<i>PARAMETER-NAME</i>="value"
	 * </ul>
	 * where <i>PARAMETER-NAME</i> is the name of the parameter in lower case.
	 *
	 * Values of boolean parameters are case insensitive where "true" and "x" are interpreted as true.
	 *
	 * @extends sap.ui.base.Object
	 * @author Frank Weigel (Martin Schaus)
	 * @constructor
	 * @public
	 * @alias sap.ui.core.Configuration
	 */
	var Configuration = BaseObject.extend("sap.ui.core.Configuration", /** @lends sap.ui.core.Configuration.prototype */ {

		constructor : function(oCore) {

			this._oCore = oCore;

			function detectLanguage() {
				var match;
				if ( Device.os.android ) {
					// on Android, navigator.language is hardcoded to 'en', so check UserAgent string instead
					match = navigator.userAgent.match(/\s([a-z]{2}-[a-z]{2})[;)]/i);
					if ( match ) {
						return match[1];
					}
					// okay, we couldn't find a language setting. It might be better to fallback to 'en' instead of having no language
				}
				return (navigator.languages && navigator.languages[0]) || navigator.language || navigator.userLanguage || navigator.browserLanguage;
			}

			// definition of supported settings
			var M_SETTINGS = {
					"theme"                 : { type : "string",   defaultValue : "base" },
					"language"              : { type : "string",   defaultValue : detectLanguage() },
					"formatLocale"          : { type : "string",   defaultValue : null },
					"calendarType"          : { type : "string",   defaultValue : null },
					// "timezone"              : "UTC",
					"accessibility"         : { type : "boolean",  defaultValue : true },
					"autoAriaBodyRole"      : { type : "boolean",  defaultValue : true,      noUrl:true }, //whether the framework automatically adds automatically the ARIA role 'application' to the html body
					"animation"             : { type : "boolean",  defaultValue : true },
					"rtl"                   : { type : "boolean",  defaultValue : null },
					"debug"                 : { type : "boolean",  defaultValue : false },
					"inspect"               : { type : "boolean",  defaultValue : false },
					"originInfo"            : { type : "boolean",  defaultValue : false },
					"noConflict"            : { type : "boolean",  defaultValue : false,     noUrl:true },
					"noDuplicateIds"        : { type : "boolean",  defaultValue : true },
					"trace"                 : { type : "boolean",  defaultValue : false,     noUrl:true },
					"modules"               : { type : "string[]", defaultValue : [],        noUrl:true },
					"areas"                 : { type : "string[]", defaultValue : null,      noUrl:true },
					// "libs"                  : { type : "string[]", defaultValue : [],        noUrl:true }, deprecated, handled below
					"onInit"                : { type : "code",     defaultValue : undefined, noUrl:true },
					"uidPrefix"             : { type : "string",   defaultValue : "__",      noUrl:true },
					"ignoreUrlParams"       : { type : "boolean",  defaultValue : false,     noUrl:true },
					"weinreServer"          : { type : "string",   defaultValue : "",        noUrl:true },
					"weinreId"              : { type : "string",   defaultValue : "" },
					"preload"               : { type : "string",   defaultValue : "auto" },
					"rootComponent"         : { type : "string",   defaultValue : "",        noUrl:true },
					"preloadLibCss"         : { type : "string[]", defaultValue : [] },
					"application"           : { type : "string",   defaultValue : "" },
					"appCacheBuster"        : { type : "string[]", defaultValue : [] },
					"bindingSyntax"         : { type : "string",   defaultValue : "default", noUrl:true }, // default|simple|complex
					"versionedLibCss"       : { type : "boolean",  defaultValue : false },

					"whitelistService"      : { type : "string",   defaultValue : null,      noUrl: true }, // url/to/service
					"frameOptions"          : { type : "string",   defaultValue : "default", noUrl: true }, // default/allow/deny/trusted (default => allow)
					"frameOptionsConfig"    : { type : "object",   defaultValue : undefined, noUrl:true },  // advanced frame options configuration

					"xx-rootComponentNode"  : { type : "string",   defaultValue : "",        noUrl:true },
					"xx-appCacheBusterMode" : { type : "string",   defaultValue : "sync" },
					"xx-appCacheBusterHooks" : { type : "object",  defaultValue : undefined, noUrl:true }, // e.g.: { handleURL: fn, onIndexLoad: fn, onIndexLoaded: fn }
					"xx-disableCustomizing" : { type : "boolean",  defaultValue : false,     noUrl:true },
					"xx-loadAllMode"        : { type : "boolean",  defaultValue : false,     noUrl:true },
					"xx-test-mobile"        : { type : "boolean",  defaultValue : false },
					"xx-domPatching"        : { type : "boolean",  defaultValue : false },
					"xx-componentPreload"   : { type : "string",   defaultValue : "" },
					"xx-designMode"         : { type : "boolean",  defaultValue : false },
					"xx-supportedLanguages" : { type : "string[]", defaultValue : [] }, // *=any, sapui5 or list of locales
					"xx-bootTask"           : { type : "function", defaultValue : undefined, noUrl:true },
					"xx-suppressDeactivationOfControllerCode" : { type : "boolean",  defaultValue : false }, //temporarily to suppress the deactivation of controller code in design mode
					"xx-lesssupport"        : { type : "boolean",  defaultValue : false },
					"xx-handleValidation"   : { type : "boolean",  defaultValue : false },
					"statistics"            : { type : "boolean",  defaultValue : false }
			};

			var M_COMPAT_FEATURES = {
					"xx-test"               : "1.15", //for testing purposes only
					"flexBoxPolyfill"       : "1.14",
					"sapMeTabContainer"     : "1.14",
					"sapMeProgessIndicator" : "1.14",
					"sapMGrowingList"       : "1.14",
					"sapMListAsTable"       : "1.14",
					"sapMDialogWithPadding" : "1.14",
					"sapCoreBindingSyntax"  : "1.24"
			};

			this.oFormatSettings = new Configuration.FormatSettings(this);

			/* Object that carries the real configuration data */
			/*eslint-disable consistent-this */
			var config = this;
			/*eslint-enable consistent-this */

			function setValue(sName, sValue) {
				if ( typeof sValue === "undefined" || sValue === null ) {
					return;
				}
				switch (M_SETTINGS[sName].type) {
				case "boolean":
					if ( typeof sValue === "string" ) {
						if (M_SETTINGS[sName].defaultValue) {
							config[sName] = sValue.toLowerCase() != "false";
						} else {
							config[sName] = sValue.toLowerCase() === "true" || sValue.toLowerCase() === "x";
						}
					} else {
						// boolean etc.
						config[sName] = !!sValue;
					}
					break;
				case "string":
					config[sName] = "" + sValue; // enforce string
					break;
				case "code":
					config[sName] = typeof sValue === "function" ? sValue : String(sValue);
					break;
				case "function":
					if ( typeof sValue !== "function" ) {
						throw new Error("unsupported value");
					}
					config[sName] = sValue;
					break;
				case "string[]":
					if ( jQuery.isArray(sValue) ) {
						config[sName] = sValue;
					} else if ( typeof sValue === "string" ) {
						config[sName] = jQuery.map(sValue.split(/[ ,;]/), function($) {
							return jQuery.trim($);
						});
					} else {
						throw new Error("unsupported value");
					}
					break;
				case "object":
					if ( typeof sValue !== "object" ) {
						throw new Error("unsupported value");
					}
					config[sName] = sValue;
					break;
				default:
					throw new Error("illegal state");
				}
			}

			function validateThemeRoot(sThemeRoot) {
				var oThemeRoot,
					sPath;

				try {
					oThemeRoot = new URI(sThemeRoot, window.location.href).normalize();
					sPath = oThemeRoot.path();
					return sPath + (sPath.slice(-1) === '/' ? '' : '/') + "UI5/";
				} catch (e) {
					// malformed URL are also not accepted
				}
			}

			// 1. collect the defaults
			for (var n in M_SETTINGS ) {
				config[n] = M_SETTINGS[n].defaultValue;
			}

			// 2. read server wide sapui5 configuration
			/* TODO: RETHINK server wide sapui5 configuration to make it optional
					 currently it is forcing a request which is annoying customers :
					   - Think about an option which enables loading of server wide config!
			var sUrl = "/sap-ui-config.json";
			var oResponse = jQuery.sap.sjax({url:sUrl});
			if (oResponse.success) {
				var oServerCfg = {};
				if (typeof oResponse.data == "string") {
					try {
						oServerCfg = jQuery.parseJSON(oResponse.data);
					} catch(ex) {
						jQuery.sap.log.warning("Error when parsing the JSON configuration content from " + sUrl + " : " + ex);
					}
				} else {
					oServerCfg = oResponse.data;
				}
				for (var n in M_SETTINGS) {
					if (oServerCfg[n]) {
						setValue(n, oServerCfg[n]);
					}
				}
			}
			 */

			// 3.-5. apply settings from global config object (already merged with script tag attributes)
			var oCfg = window["sap-ui-config"] || {};
			oCfg.oninit = oCfg.oninit || oCfg["evt-oninit"];
			for (var n in M_SETTINGS) {
				if ( oCfg.hasOwnProperty(n.toLowerCase()) ) {
					setValue(n, oCfg[n.toLowerCase()]);
				} else if ( !/^xx-/.test(n) && oCfg.hasOwnProperty("xx-" + n.toLowerCase()) ) {
					setValue(n, oCfg["xx-" + n.toLowerCase()]);
				}
			}

			// if libs are configured, convert them to modules and prepend them to the existing modules list
			if ( oCfg.libs ) {
				config.modules = jQuery.map(oCfg.libs.split(","), function($) {
					return jQuery.trim($) + ".library";
				}).concat(config.modules);
			}

			var PARAM_CVERS = "compatversion";
			var DEFAULT_CVERS = oCfg[PARAM_CVERS];
			var BASE_CVERS = jQuery.sap.Version("1.14");
			this._compatversion = {};

			function _getCVers(key){
				var v = !key ? DEFAULT_CVERS || BASE_CVERS.toString()
						: oCfg[PARAM_CVERS + "-" + key.toLowerCase()] || DEFAULT_CVERS || M_COMPAT_FEATURES[key] || BASE_CVERS.toString();
				v = jQuery.sap.Version(v.toLowerCase() === "edge" ? Global.version : v);
				//Only major and minor version are relevant
				return jQuery.sap.Version(v.getMajor(), v.getMinor());
			}

			this._compatversion._default = _getCVers();
			for (var n in M_COMPAT_FEATURES) {
				this._compatversion[n] = _getCVers(n);
			}


			// 6. apply the settings from the url (only if not blocked by app configuration)
			if ( !config.ignoreUrlParams ) {
				var sUrlPrefix = "sap-ui-";
				var oUriParams = jQuery.sap.getUriParameters();

				// map SAP parameters (if later as sap-ui parameter set this wins)
				if (oUriParams.mParams['sap-locale'] || oUriParams.mParams['sap-language']) {
					// map sap-locale or sap-language to sap-ui-language
					// if sap-language is used, handle some legacy language codes
					var sValue = oUriParams.get('sap-locale') || M_ABAP_LANGUAGE_TO_LOCALE[oUriParams.get('sap-language').toUpperCase()] || oUriParams.get('sap-language');
					if (sValue === "") {
						//empty URL parameters set the parameter back to its system default
						config['language'] = M_SETTINGS['language'].defaultValue;
					} else {
						//sets the value (null or empty value ignored)
						setValue('language', sValue);
					}
				}

				if (oUriParams.mParams['sap-rtl']) {
					// "" = false, "X", "x" = true
					var sValue = oUriParams.get('sap-rtl');
					if (sValue === "X" || sValue === "x") {
						setValue('rtl', true);
					} else {
						setValue('rtl', false);
					}
				}

				if (oUriParams.mParams['sap-theme']) {
					var sValue = oUriParams.get('sap-theme');
					if (sValue === "") {
						// empty URL parameters set the parameter back to its system default
						config['theme'] = M_SETTINGS['theme'].defaultValue;
					} else {
						setValue('theme', sValue);
					}
				}

				if (oUriParams.mParams['sap-statistics']) {
					var sValue = oUriParams.get('sap-statistics');
					setValue('statistics', sValue);
				}

				// now analyze sap-ui parameters
				for (var n in M_SETTINGS) {
					if ( M_SETTINGS[n].noUrl ) {
						continue;
					}
					var sValue = oUriParams.get(sUrlPrefix + n);
					if ( sValue == null && !/^xx-/.test(n) ) {
						sValue = oUriParams.get(sUrlPrefix + "xx-" + n);
					}
					if (sValue === "") {
						//empty URL parameters set the parameter back to its system default
						config[n] = M_SETTINGS[n].defaultValue;
					} else {
						//sets the value (null or empty value ignored)
						setValue(n, sValue);
					}
				}
			}

			// calculate RTL mode
			this.derivedRTL = Locale._impliesRTL(config.language);

			// analyze theme parameter
			var sTheme = config.theme;
			var sThemeRoot;
			var iIndex = sTheme.indexOf("@");
			if (iIndex >= 0) {
				sThemeRoot = validateThemeRoot(sTheme.slice(iIndex + 1));
				if ( sThemeRoot ) {
					config.theme = sTheme.slice(0, iIndex);
					config.themeRoot = sThemeRoot;
				} else {
					// fallback to non-URL parameter (if not equal to sTheme)
					config.theme = (oCfg.theme && oCfg.theme !== sTheme) ? oCfg.theme : "base";
					iIndex = -1; // enable theme mapping below
				}
			}

			config.theme = this._normalizeTheme(config.theme, sThemeRoot);

			var aCoreLangs = config['languagesDeliveredWithCore'] = Locale._coreI18nLocales;
			var aLangs = config['xx-supportedLanguages'];
			if ( aLangs.length === 0 || (aLangs.length === 1 && aLangs[0] === '*') ) {
				aLangs = [];
			} else if ( aLangs.length === 1 && aLangs[0] === 'default' ) {
				aLangs = aCoreLangs || [];
			}
			config['xx-supportedLanguages'] = aLangs;

			// determine default for binding syntax
			if ( config["bindingSyntax"] === "default" ) {
				config["bindingSyntax"] = (config.getCompatibilityVersion("sapCoreBindingSyntax").compareTo("1.26") < 0) ? "simple" : "complex";
			}

			// Configure whitelistService / frameOptions via <meta> tag if not already defined via UI5 configuration
			if (!config["whitelistService"]) {
				var oMetaTag = document.querySelector("META[name='sap.whitelistService']");
				if (oMetaTag) {
					config["whitelistService"] = oMetaTag.getAttribute("content");
					// Set default "frameOptions" to "trusted" instead of "allow"
					if (config["frameOptions"] === "default") {
						config["frameOptions"] = "trusted";
					}
				}
			}

			// Verify and set default for "frameOptions" configuration
			if (config["frameOptions"] === "default" ||
				(config["frameOptions"] !== "allow"
				&& config["frameOptions"] !== "deny"
				&& config["frameOptions"] !== "trusted")) {

				// default => allow
				config["frameOptions"] = "allow";
			}

			var aCSSLibs = config['preloadLibCss'];
			if ( aCSSLibs.length > 0 ) {
				// a leading "!" denotes that the application has loaded the file already
				aCSSLibs.appManaged = aCSSLibs[0].slice(0,1) === "!";
				if ( aCSSLibs.appManaged ) {
					aCSSLibs[0] = aCSSLibs[0].slice(1); // also affect same array in "config"!
				}
				if ( aCSSLibs[0] === "*" ) {
					// replace with configured libs
					aCSSLibs.splice(0,1); // remove *
					var pos = 0;
					jQuery.each(config.modules, function(i,mod) {
						var m = mod.match(/^(.*)\.library$/);
						if ( m ) {
							aCSSLibs.splice(pos,0,m[1]);
						}
					});
				}
			}

			// log  all non default value
			for (var n in M_SETTINGS) {
				if ( config[n] !== M_SETTINGS[n].defaultValue ) {
					jQuery.sap.log.info("  " + n + " = " + config[n]);
				}
			}
		},

		/**
		 * Returns the version of the framework.
		 *
		 * Similar to <code>sap.ui.version</code>.
		 *
		 * @return {jQuery.sap.Version} the version
		 * @public
		 */
		getVersion : function () {
			if (this._version) {
				return this._version;
			}

			this._version = new jQuery.sap.Version(Global.version);
			return this._version;
		},

		/**
		 * Returns the used compatibility version for the given feature.
		 *
		 * @param {string} sFeature the key of desired feature
		 * @return {jQuery.sap.Version} the used compatibility version
		 * @public
		 */
		getCompatibilityVersion : function (sFeature) {
			if (typeof (sFeature) === "string" && this._compatversion[sFeature]) {
				return this._compatversion[sFeature];
			}

			return this._compatversion._default;
		},

		/**
		 * Returns the theme name
		 * @return {string} the theme name
		 * @public
		 */
		getTheme : function () {
			return this.theme;
		},

		/**
		 * Allows setting the theme name
		 * @param {string} sTheme the theme name
		 * @return {sap.ui.core.Configuration} <code>this</code> to allow method chaining
		 * @private
		 */
		_setTheme : function (sTheme) {
			this.theme = sTheme;
			return this;
		},

		/**
		 * Normalize the given theme, resolve known aliases
		 * @private
		 */
		_normalizeTheme : function (sTheme, sThemeBaseUrl) {
			if ( sTheme && sThemeBaseUrl == null && sTheme.match(/^sap_corbu$/i) ) {
				return "sap_goldreflection";
			}
			return sTheme;
		},

		/**
		 * Returns the language string with language and country code
		 * @return {string} the language string with language and country code
		 * @public
		 */
		getLanguage : function () {
			return this.language;
		},

		/**
		 * Sets a new language tag to be used from now on for language/region dependent
		 * functionality (e.g. formatting, data types, translated texts, ...).
		 *
		 * When the language has changed, the Core will fire its
		 * {@link sap.ui.core.Core#event:localizationChanged localizationChanged} event.
		 *
		 * The framework <strong>does not</strong> guarantee that already created, language
		 * dependent objects will be updated by this call. It therefore remains best practice
		 * for applications to switch the language early, e.g. before any language dependent
		 * objects are created. Applications that need to support more dynamic changes of
		 * the language should listen to the <code>localizationChanged</code> event and adapt
		 * all language dependent objects that they use (e.g. by rebuilding their UI).
		 *
		 * Currently, the framework notifies the following objects about a change of the
		 * localization settings before it fires the <code>localizationChanged</code> event:
		 *
		 * <ul>
		 * <li>date and number data types that are used in property bindings or composite
		 *     bindings in existing Elements, Controls, UIAreas or Components</li>
		 * <li>ResourceModels currently assigned to the Core, an UIArea, Component,
		 *     Element or Control</li>
		 * <li>Elements or Controls that implement the <code>onLocalizationChanged</code> hook.
		 * </ul>
		 *
		 * It furthermore derives the RTL mode from the new language, if no explicit RTL
		 * mode has been set. If the RTL mode changes, the following additional actions will be taken:
		 *
		 * <ul>
		 * <li>the URLs of already loaded library theme files will be changed</li>
		 * <li>the <code>dir</code> attribute of the page will be changed to reflect the new mode.</li>
		 * <li>all UIAreas will be invalidated (which results in a rendering of the whole UI5 UI)</li>
		 * </ul>
		 *
		 * @param {string} sLanguage the new language as a BCP47 compliant language tag; case doesn't matter
		 *   and underscores can be used instead of a dashes to separate components (compatibility with Java Locale Ids)
		 * @return {sap.ui.core.Configuration} <code>this</code> to allow method chaining
		 *
		 * @experimental Since 1.11.1 - See method documentation for restrictions.
		 * @public
		 */
		setLanguage : function (sLanguage) {
			check(typeof sLanguage === "string" && sLanguage, "sLanguage must be a BCP47 language tag or Java Locale id or null"); // TODO delegate to Locale?
			var bOldRTL = this.getRTL(),
				mChanges;

			if ( sLanguage != this.language ) {
				mChanges = this._collect();
				this.language = mChanges.language = sLanguage;
				this.derivedRTL = Locale._impliesRTL(sLanguage);
				if ( bOldRTL != this.getRTL() ) {
					mChanges.rtl = this.getRTL();
				}
				this._endCollect();
			}
			return this;
		},

		/**
		 * Returns the active locale for the current session.
		 * The locale is derived from the {@link #getLanguage language} property.
		 * @return {sap.ui.core.Locale} the locale
		 * @public
		 */
		getLocale : function () {
			return new Locale(this.language);
		},

		/**
		 * Returns the calendar type which is being used in locale dependent functionalities.
		 *
		 * When it's explicitly set by calling <code>setCalendar</code>, the set calendar type is returned.
		 * Otherwise, the calendar type is determined by checking the format settings and current locale.
		 *
		 * @return {sap.ui.core.CalendarType} the current calendar type
		 * @since 1.28.6
		 */
		getCalendarType :  function() {
			var sName;

			// lazy load of sap.ui.core library and LocaleData to avoid cyclic dependencies
			if ( !CalendarType ) {
				Global.getCore().loadLibrary('sap.ui.core');
				CalendarType = sap.ui.require("sap/ui/core/library").CalendarType;
			}
			if ( !LocaleData ) {
				jQuery.sap.require("sap.ui.core.LocaleData");
				LocaleData = sap.ui.require("sap/ui/core/LocaleData");
			}

			if (this.calendarType) {
				for (sName in CalendarType) {
					if (sName.toLowerCase() === this.calendarType.toLowerCase()) {
						this.calendarType = sName;
						return this.calendarType;
					}
				}
				jQuery.sap.log.warning("Parameter 'calendarType' is set to " + this.calendarType + " which isn't a valid value and therefore ignored. The calendar type is determined from format setting and current locale");
			}

			var sLegacyDateFormat = this.oFormatSettings.getLegacyDateFormat();
			if (sLegacyDateFormat === "A" || sLegacyDateFormat === "B") {
				return CalendarType.Islamic;
			}

			return LocaleData.getInstance(this.getLocale()).getPreferredCalendarType();
		},

		/**
		 * Sets the new calendar type to be used from now on in locale dependent functionalities (for example,
		 * formatting, translation texts, etc.).
		 *
		 * @param {sap.ui.core.CalendarType|null} sCalendarType the new calendar type. Set it with null to clear the calendar type
		 *   and the calendar type is calculated based on the format settings and current locale.
		 * @return {sap.ui.core.Configuration} <code>this</code> to allow method chaining
		 * @since 1.28.6
		 */
		setCalendarType : function(sCalendarType) {
			var mChanges;

			if (this.calendarType !== sCalendarType) {
				mChanges = this._collect();
				this.calendarType = mChanges.calendarType = sCalendarType;
				this._endCollect();
			}
			return this;
		},

		/**
		 * Returns the format locale string with language and region code. Falls back to
		 * language configuration, in case it has not been explicitly defined.
		 *
		 * @return {string} the format locale string with language and country code
		 * @public
		 */
		getFormatLocale : function () {
			return this.formatLocale || this.language;
		},

		/**
		 * Sets a new formatLocale to be used from now on for retrieving locale
		 * specific formatters. Modifying this setting does not have an impact on
		 * the retrieval of translated texts!
		 *
		 * Can either be set to a concrete value (a BCP-47 or Java locale compliant
		 * language tag) or to <code>null</code>. When set to <code>null</code> (default
		 * value) then locale specific formatters are retrieved for the current language.
		 *
		 * After changing the formatLocale, the framework tries  to update localization
		 * specific parts of the UI. See the documentation of {@link #setLanguage} for
		 * details and restrictions.
		 *
		 * @param {string|null} sFormatLocale the new format locale as a BCP47 compliant language tag;
		 *   case doesn't matter and underscores can be used instead of a dashes to separate
		 *   components (compatibility with Java Locale Ids)
		 * @return {sap.ui.core.Configuration} <code>this</code> to allow method chaining
		 *
		 * @experimental Since 1.11.1 - See documentation of {@link #setLanguage} for restrictions.
		 */
		setFormatLocale : function(sFormatLocale) {
			check(sFormatLocale === null || typeof sFormatLocale === "string" && sFormatLocale, "sFormatLocale must be a BCP47 language tag or Java Locale id or null");
			var mChanges;
			if ( sFormatLocale != this.formatLocale ) {
				mChanges = this._collect();
				this.formatLocale = mChanges.formatLocale = sFormatLocale;
				this._endCollect();
			}
			return this;
		},

		/**
		 * List of languages that the SAPUI5 core deliveres.
		 *
		 * Might return undefined if the information is not available.
		 *
		 * @experimental
		 */
		getLanguagesDeliveredWithCore : function() {
			return this["languagesDeliveredWithCore"];
		},

		/**
		 * @experimental
		 */
		getSupportedLanguages : function() {
			return this["xx-supportedLanguages"];
		},

		/**
		 * Returns whether the accessibility mode is used or not
		 * @return {boolean} whether the accessibility mode is used or not
		 * @public
		 */
		getAccessibility : function () {
			return this.accessibility;
		},

		/**
		 * Returns whether the framework automatically adds automatically
		 * the ARIA role 'application' to the html body or not.
		 * @return {boolean}
		 * @since 1.27.0
		 * @public
		 */
		getAutoAriaBodyRole : function () {
			return this.autoAriaBodyRole;
		},

		/**
		 * Returns whether the animations are globally used
		 * @return {boolean} whether the animations are globally used
		 * @public
		 */
		getAnimation : function () {
			return this.animation;
		},

		/**
		 * Returns whether the page uses the RTL text direction.
		 *
		 * If no mode has been explicitly set (neither true nor false),
		 * the mode is derived from the current language setting.
		 *
		 * @return {boolean} whether the page uses the RTL text direction
		 * @public
		 */
		getRTL : function () {
			// if rtl has not been set (still null), return the rtl mode derived from the language
			return this.rtl === null ? this.derivedRTL : this.rtl;
		},

		/**
		 * Sets the character orientation mode to be used from now on.
		 *
		 * Can either be set to a concrete value (true meaning right-to-left,
		 * false meaning left-to-right) or to <code>null</code> which means that
		 * the character orientation mode should be derived from the current
		 * language (incl. region) setting.
		 *
		 * After changing the character orientation mode, the framework tries
		 * to update localization specific parts of the UI. See the documentation of
		 * {@link #setLanguage} for details and restrictions.
		 *
		 * @param {boolean|null} bRTL new character orientation mode or <code>null</code>
		 * @return {sap.ui.core.Configuration} <code>this</code> to allow method chaining
		 *
		 * @experimental Since 1.11.1 - See documentation of {@link #setLanguage} for restrictions.
		 */
		setRTL : function(bRTL) {
			check(bRTL === null || typeof bRTL === "boolean", "bRTL must be null or a boolean");
			var mChanges;
			if ( bRTL != this.rtl ) {
				mChanges = this._collect();
				this.rtl = mChanges.rtl = this.getRTL();
				this._endCollect();
			}
			return this;
		},

		/**
		 * Returns whether the page runs in debug mode
		 * @return {boolean} whether the page runs in debug mode
		 * @public
		 */
		getDebug : function () {
			return this.debug;
		},

		/**
		 * Returns whether the UI5 control inspector is displayed
		 * Has only an effect when the sap-ui-debug module has been loaded
		 * @return {boolean} whether the UI5 control inspector is displayed
		 * @public
		 */
		getInspect : function () {
			return this.inspect;
		},

		/**
		 * Returns whether the text origin information is collected
		 * @return {boolean} whether the text info is collected
		 * @public
		 */
		getOriginInfo : function () {
			return this.originInfo;
		},

		/**
		 * Returns whether there should be an exception on any duplicate element IDs
		 * @return {boolean} whether there should be an exception on any duplicate element IDs
		 * @public
		 */
		getNoDuplicateIds : function () {
			return this.noDuplicateIds;
		},

		/**
		 * Whether a trace view should be shown or not.
		 * Has only an effect when the sap-ui-debug module has been loaded
		 * either by explicitly loading it or by setting the 'debug' option to true.
		 * @return {boolean} whether a trace view should be shown
		 */
		getTrace : function () {
			return this.trace;
		},

		/**
		 * Prefix to be used for automatically generated control IDs.
		 * Default is a double underscore "__".
		 *
		 * @returns {string} the prefix to be used
		 * @public
		 */
		getUIDPrefix : function() {
			return this.uidPrefix;
		},


		/**
		 * Return whether the design mode is active or not.
		 *
		 * @returns {boolean} whether the design mode is active or not.
		 * @since 1.13.2
		 * @experimental Since 1.13.2
		 * @public
		 */
		getDesignMode : function() {
			return this["xx-designMode"];
		},

		/**
		 * Return whether the activation of the controller code is suppressed
		 *
		 * @returns {boolean} whether the activation of the controller code is suppressed or not
		 * @since 1.13.2
		 * @experimental Since 1.13.2
		 * @public
		 */
		getSuppressDeactivationOfControllerCode : function() {
			return this["xx-suppressDeactivationOfControllerCode"];
		},

		/**
		 * Return whether the controller code is deactivated. During design mode the
		 *
		 * @returns {boolean} whether the activation of the controller code is suppressed or not
		 * @since 1.26.4
		 * @experimental Since 1.26.4
		 * @public
		 */
		getControllerCodeDeactivated : function() {
			return this.getDesignMode() && !this.getSuppressDeactivationOfControllerCode();
		},

		/**
		 * WEINRE server URL
		 *
		 * @returns {string} the base URL of the WEINRE server
		 * @public
		 */
		getWeinreServer : function() {
			var sWeinreServer = this.weinreServer;
			if (!sWeinreServer) {
				// if not weinre server is configured - we expect that the weinre server
				// is installed on the same machine with port no of the app + 1
				sWeinreServer = window.location.protocol + "//" + window.location.hostname + ":";
				sWeinreServer += (parseInt(window.location.port, 10) || 8080) + 1;
			}
			return sWeinreServer;
		},

		/**
		 * WEINRE session ID
		 *
		 * @returns {string} the ID to use for the WEINRE server
		 * @public
		 */
		getWeinreId : function() {
			return this.weinreId;
		},

		/**
		 * The name of the application to start or empty
		 *
		 * @returns {string} name of the application
		 * @public
		 * @experimental Since 1.13.2
		 * @deprecated Since 1.15.1. Please use the rootComponent configuration option {@link sap.ui.core.Configuration#getRootComponent}.
		 */
		getApplication : function() {
			return this.application;
		},

		/**
		 * The name of the root component to start or empty
		 *
		 * @returns {string} name of the root component
		 * @public
		 * @experimental Since 1.15.1
		 */
		getRootComponent : function() {
			return this.rootComponent;
		},

		/**
		 * Base URLs to AppCacheBuster Etag-Index files
		 *
		 * @returns {string[]} array of base URLs
		 * @public
		 */
		getAppCacheBuster : function() {
			return this.appCacheBuster;
		},

		/**
		 * The loading mode (sync|async|batch) of the AppCacheBuster (sync is default)
		 *
		 * @returns {string} sync | async
		 * @public
		 * @experimental Since 1.12.5
		 */
		getAppCacheBusterMode : function() {
			return this["xx-appCacheBusterMode"];
		},

		/**
		 * Object defining the callback hooks for the AppCacheBuster like e.g.
		 * <code>handleURL</code>, <code>onIndexLoad</code> or <code>onIndexLoaded</code>.
		 *
		 * @returns {object} object containing the callback functions for the AppCacheBuster
		 * @public
		 * @experimental Since 1.27.0
		 */
		getAppCacheBusterHooks : function() {
			return this["xx-appCacheBusterHooks"];
		},

		/**
		 * Flag, whether the customizing is disabled or not
		 *
		 * @returns {boolean} true if customizing is disabled
		 * @private
		 * @experimental Since 1.15.1
		 */
		getDisableCustomizing : function() {
			return this["xx-disableCustomizing"];
		},

		/**
		 * Determines whether DOM patching is enabled or not.
		 *
		 * @see {jQuery.sap#replaceDOM}
		 * @returns {boolean}
		 * @private
		 */
		getDomPatching : function() {
			return this["xx-domPatching"];
		},

		/**
		 * Currently active preload mode for libraries or falsy value
		 *
		 * @returns {string} preload mode
		 * @private
		 * @since 1.16.3
		 */
		getPreload : function() {
			return this.preload;
		},

		/**
		 * Currently active preload mode for components or falsy value
		 *
		 * @returns {string} component preload mode
		 * @private
		 * @experimental Since 1.16.3, might change completely.
		 */
		getComponentPreload : function() {
			return this['xx-componentPreload'] || this.preload;
		},

		/**
		 * Returns a configuration object that bundles the format settings of UI5.
		 *
		 * @return {sap.ui.core.Configuration.FormatSettings} A FormatSettings object.
		 * @public
		 */
		getFormatSettings : function() {
			return this.oFormatSettings;
		},

		/**
		 * frameOptions mode (allow/deny/trusted).
		 *
		 * @return {string} frameOptions mode
		 * @private
		 */
		getFrameOptions : function() {
			return this.frameOptions;
		},

		/**
		 * URL of the whitelist service.
		 *
		 * @return {string} whitelist service URL
		 * @private
		 */
		getWhitelistService : function() {
			return this.whitelistService;
		},

		_collect : function() {
			var mChanges = this.mChanges || (this.mChanges = { __count : 0});
			mChanges.__count++;
			return mChanges;
		},

		_endCollect : function() {
			var mChanges = this.mChanges;
			if ( mChanges && (--mChanges.__count) === 0 ) {
				delete mChanges.__count;
				this._oCore && this._oCore.fireLocalizationChanged(mChanges);
				delete this.mChanges;
			}
		},

		/**
		 * Flag if statistics are requested
		 *
		 * Flag set by TechnicalInfo Popup will also be checked
		 * So its active if set by ULP parameter or by TechnicalInfo property
		 *
		 * @returns {boolean} statistics flag
		 * @private
		 * @since 1.20.0
		 */
		getStatistics : function() {
			return this.statistics || window.localStorage.getItem("sap-ui-statistics") == "X";
		},

		/**
		 * Return whether native scrolling should be suppressed on touch devices
		 *
		 * @returns {boolean} whether native scrolling is suppressed on touch devices
		 * @since 1.20.0
		 * @deprecated since 1.26.0. Always use native scrolling
		 * @private
		 */
		getNoNativeScroll : function() {
			return false;
		},

		/**
		 * Return whether type validation is handled by core
		 *
		 * @returns {boolean} whether whether type validation is handled by core
		 * @since 1.28.0
		 * @private
		 */
		getHandleValidation : function() {
			return this["xx-handleValidation"];
		}
	});

	var M_ABAP_LANGUAGE_TO_LOCALE = {
		"ZH" : "zh-Hans",
		"ZF" : "zh-Hant",
		"1Q" : "en-US-x-saptrc",
		"2Q" : "en-US-x-sappsd"
	};

	var M_ABAP_DATE_FORMAT_PATTERN = {
		"" : {pattern: null},
		"1": {pattern: "dd.MM.yyyy"},
		"2": {pattern: "MM/dd/yyyy"},
		"3": {pattern: "MM-dd-yyyy"},
		"4": {pattern: "yyyy.MM.dd"},
		"5": {pattern: "yyyy/MM/dd"},
		"6": {pattern: "yyyy-MM-dd"},
		"7": {pattern: "Gyy.MM.dd", ignore:true},
		"8": {pattern: "Gyy/MM/dd", ignore:true},
		"9": {pattern: "Gyy-MM-dd", ignore:true},
		"A": {pattern: "yyyy/MM/dd"},
		"B": {pattern: "yyyy/MM/dd"},
		"C": {pattern: "yyyy/MM/dd", ignore:true}
	};

	var M_ABAP_TIME_FORMAT_PATTERN = {
		"" : {"short": null,      medium:  null,        dayPeriods: null},
		"0": {"short": "HH:mm",   medium: "HH:mm:ss",   dayPeriods: null},
		"1": {"short": "hh:mm a", medium: "hh:mm:ss a", dayPeriods: ["AM", "PM"]},
		"2": {"short": "hh:mm a", medium: "hh:mm:ss a", dayPeriods: ["am", "pm"]},
		"3": {"short": "KK:mm a", medium: "KK:mm:ss a", dayPeriods: ["AM", "PM"]},
		"4": {"short": "KK:mm a", medium: "KK:mm:ss a", dayPeriods: ["am", "pm"]}
	};

	var M_ABAP_NUMBER_FORMAT_SYMBOLS = {
		"" : {groupingSeparator: null, decimalSeparator: null},
		" ": {groupingSeparator: ".", decimalSeparator: ","},
		"X": {groupingSeparator: ",", decimalSeparator: "."},
		"Y": {groupingSeparator: " ", decimalSeparator: ","}
	};

	function check(bCondition, sMessage) {
		if ( !bCondition ) {
			throw new Error(sMessage);
		}
	}

	/**
	 * @class Encapsulates configuration settings that are related to data formatting/parsing.
	 *
	 * <b>Note:</b> When format configuration settings are modified through this class,
	 * UI5 only ensures that formatter objects created after that point in time will honor
	 * the modifications. To be on the safe side, applications should do any modifications
	 * early in their lifecycle or recreate any model/UI that is locale dependent.
	 *
	 * @name sap.ui.core.Configuration.FormatSettings
	 * @extends sap.ui.base.Object
	 * @public
	 */
	BaseObject.extend("sap.ui.core.Configuration.FormatSettings", /** @lends sap.ui.core.Configuration.FormatSettings.prototype */ {
		constructor : function(oConfiguration) {
			this.oConfiguration = oConfiguration;
			this.mSettings = {};
			this.sLegacyDateFormat = undefined;
			this.sLegacyTimeFormat = undefined;
			this.sLegacyNumberFormatSymbolSet = undefined;
		},

		/**
		 * Returns the locale to be used for formatting.
		 *
		 * If no such locale has been defined, this method falls back to the language,
		 * see {@link sap.ui.core.Configuration#getLanguage Configuration.getLanguage()}.
		 *
		 * If any user preferences for date, time or number formatting have been set,
		 * and if no format locale has been specified, then a special private use subtag
		 * is added to the locale, indicating to the framework that these user preferences
		 * should be applied.
		 *
		 * @return {sap.ui.core.Locale} the format locale
		 * @public
		 */
		getFormatLocale : function() {
			function fallback(that) {
				var l = that.oConfiguration.language;
				// if any user settings have been defined, add the private use subtag "sapufmt"
				if ( !jQuery.isEmptyObject(that.mSettings) ) {
					// TODO move to Locale/LocaleData
					if ( l.indexOf("-x-") < 0 ) {
						l = l + "-x-sapufmt";
					} else if ( l.indexOf("-sapufmt") <= l.indexOf("-x-") ) {
						l = l + "-sapufmt";
					}
				}
				return l;
			}
			return new Locale(this.oConfiguration.formatLocale || fallback(this));
		},

		_set : function(sKey, oValue) {
			var oOldValue = this.mSettings[sKey];
			if ( oValue != null ) {
				this.mSettings[sKey] = oValue;
			} else {
				delete this.mSettings[sKey];
			}
			if ( (oOldValue == null != oValue == null) || !jQuery.sap.equal(oOldValue, oValue) ) {
				var mChanges = this.oConfiguration._collect();
				mChanges[sKey] = oValue;
				this.oConfiguration._endCollect();
			}
		},

		/**
		 * Returns the currently set date pattern or undefined if no pattern has been defined.
		 * @public
		 */
		getDatePattern : function(sStyle) {
			jQuery.sap.assert(sStyle == "short" || sStyle == "medium" || sStyle == "long" || sStyle == "full", "sStyle must be short, medium, long or full");
			return this.mSettings["dateFormat-" + sStyle];
		},

		/**
		 * Defines the preferred format pattern for the given date format style.
		 * Calling this method with a null or undefined pattern removes a previously set pattern.
		 *
		 * If a pattern is defined, it will be preferred over patterns derived from the current locale.
		 *
		 * See class {@link sap.ui.core.format.DateFormat} for details about the pattern syntax.
		 *
		 * After changing the date pattern, the framework tries to update localization
		 * specific parts of the UI. See the documentation of {@link sap.ui.core.Configuration#setLanguage}
		 * for details and restrictions.
		 *
		 * @param {string} sStyle must be one of short, medium, long or full.
		 * @param {string} sPattern the format pattern to be used in LDML syntax.
		 * @return {sap.ui.core.Configuration.FormatSettings} Returns <code>this</code> to allow method chaining
		 * @public
		 */
		setDatePattern : function(sStyle, sPattern) {
			check(sStyle == "short" || sStyle == "medium" || sStyle == "long" || sStyle == "full", "sStyle must be short, medium, long or full");
			this._set("dateFormat-" + sStyle, sPattern);
			return this;
		},

		/**
		 * Returns the currently set time pattern or undefined if no pattern has been defined.
		 * @public
		 */
		getTimePattern : function(sStyle) {
			jQuery.sap.assert(sStyle == "short" || sStyle == "medium" || sStyle == "long" || sStyle == "full", "sStyle must be short, medium, long or full");
			return this.mSettings["timeFormat-" + sStyle];
		},

		/**
		 * Defines the preferred format pattern for the given time format style.
		 * Calling this method with a null or undefined pattern removes a previously set pattern.
		 *
		 * If a pattern is defined, it will be preferred over patterns derived from the current locale.
		 *
		 * See class {@link sap.ui.core.format.DateFormat} for details about the pattern syntax.
		 *
		 * After changing the time pattern, the framework tries to update localization
		 * specific parts of the UI. See the documentation of {@link sap.ui.core.Configuration#setLanguage}
		 * for details and restrictions.
		 *
		 * @param {string} sStyle must be one of short, medium, long or full.
		 * @param {string} sPattern the format pattern to be used in LDML syntax.
		 * @return {sap.ui.core.Configuration.FormatSettings} Returns <code>this</code> to allow method chaining
		 * @public
		 */
		setTimePattern : function(sStyle, sPattern) {
			check(sStyle == "short" || sStyle == "medium" || sStyle == "long" || sStyle == "full", "sStyle must be short, medium, long or full");
			this._set("timeFormat-" + sStyle, sPattern);
			return this;
		},

		/**
		 * Returns the currently set number symbol of the given type or undefined if no symbol has been defined.
		 * @public
		 */
		getNumberSymbol : function(sType) {
			jQuery.sap.assert(sType == "decimal" || sType == "group" || sType == "plusSign" || sType == "minusSign", "sType must be decimal, group, plusSign or minusSign");
			return this.mSettings["symbols-latn-" + sType];
		},

		/**
		 * Defines the string to be used for the given number symbol.
		 * Calling this method with a null or undefined symbol removes a previously set symbol string.
		 * Note that an empty string is explicitly allowed.
		 *
		 * If a symbol is defined, it will be preferred over symbols derived from the current locale.
		 *
		 * See class {@link sap.ui.core.format.NumberFormat} for details about the symbols.
		 *
		 * After changing the number symbol, the framework tries to update localization
		 * specific parts of the UI. See the documentation of {@link sap.ui.core.Configuration#setLanguage}
		 * for details and restrictions.
		 *
		 * @param {string} sStyle must be one of decimal, group, plusSign, minusSign.
		 * @param {string} sSymbol will be used to represent the given symbol type
		 * @return {sap.ui.core.Configuration.FormatSettings} Returns <code>this</code> to allow method chaining
		 * @public
		 */
		setNumberSymbol : function(sType, sSymbol) {
			check(sType == "decimal" || sType == "group" || sType == "plusSign" || sType == "minusSign", "sType must be decimal, group, plusSign or minusSign");
			this._set("symbols-latn-" + sType, sSymbol);
			return this;
		},

		/**
		 * Defines the day used as the first day of the week.
		 * The day is set as an integer value between 0 (Sunday) and 6 (Saturday).
		 * Calling this method with a null or undefined symbol removes a previously set value.
		 *
		 * If a value is defined, it will be preferred over values derived from the current locale.
		 *
		 * Usually in the US the week starts on Sunday while in most European countries on Monday.
		 * There are special cases where you want to have the first day of week set independent of the
		 * user locale.
		 *
		 * After changing the first day of week, the framework tries to update localization
		 * specific parts of the UI. See the documentation of {@link sap.ui.core.Configuration#setLanguage}
		 * for details and restrictions.
		 *
		 * @param {number} iValue must be an integer value between 0 and 6
		 * @return {sap.ui.core.Configuration.FormatSettings} Returns <code>this</code> to allow method chaining
		 * @public
		 */
		setFirstDayOfWeek : function(iValue) {
			check(typeof iValue == "number" && iValue >= 0 && iValue <= 6, "iValue must be an integer value between 0 and 6");
			this._set("weekData-firstDay", iValue);
			return this;
		},

		_setDayPeriods : function(sWidth, aTexts) {
			jQuery.sap.assert(sWidth == "narrow" || sWidth == "abbreviated" || sWidth == "wide", "sWidth must be narrow, abbreviated or wide");
			this._set("dayPeriods-format-" + sWidth, aTexts);
			return this;
		},

		/**
		 * Returns the currently set legacy ABAP date format (its id) or undefined if none has been set.
		 *
		 * @public
		 */
		getLegacyDateFormat : function() {
			return this.sLegacyDateFormat || undefined;
		},

		/**
		 * Allows to specify one of the legacy ABAP date formats.
		 *
		 * This method modifies the date patterns for 'short' and 'medium' style with the corresponding ABAP
		 * format. When called with a null or undefined format id, any previously applied format will be removed.
		 *
		 * After changing the legacy date format, the framework tries to update localization
		 * specific parts of the UI. See the documentation of {@link sap.ui.core.Configuration#setLanguage}
		 * for details and restrictions.
		 *
		 * Note: those date formats that are not based on the Gregorian calendar (Japanese date formats '7', '8' and '9',
		 * Islamic date formats 'A' and 'B' and Iranian date format 'C') are not yet supported by UI5. They are accepted
		 * by this method for convenience (user settings from ABAP system can be used without filtering), but they are
		 * ignored. Instead, the formats from the current format locale will be used and a warning will be logged.
		 *
		 * @param {string} sFormatId id of the ABAP data format (one of '1','2','3','4','5','6','7','8','9','A','B','C')
		 * @return {sap.ui.core.Configuration.FormatSettings} Returns <code>this</code> to allow method chaining
		 * @public
		 */
		setLegacyDateFormat : function(sFormatId) {
			sFormatId = sFormatId ? String(sFormatId).toUpperCase() : "";
			check(!sFormatId || M_ABAP_DATE_FORMAT_PATTERN.hasOwnProperty(sFormatId), "sFormatId must be one of ['1','2','3','4','5','6','7','8','9','A','B','C'] or empty");
			if ( M_ABAP_DATE_FORMAT_PATTERN[sFormatId].ignore ) {
				jQuery.sap.log.warning("The ABAP date format '" + sFormatId + "' (" + M_ABAP_DATE_FORMAT_PATTERN[sFormatId].pattern + ") is not supported yet. Falling back to locale specific date formats.");
				sFormatId = "";
			}
			var mChanges = this.oConfiguration._collect();
			this.sLegacyDateFormat = mChanges.legacyDateFormat = sFormatId;
			this.setDatePattern("short", M_ABAP_DATE_FORMAT_PATTERN[sFormatId].pattern);
			this.setDatePattern("medium", M_ABAP_DATE_FORMAT_PATTERN[sFormatId].pattern);
			this.oConfiguration._endCollect();
			return this;
		},

		/**
		 * Returns the currently set legacy ABAP time format (its id) or undefined if none has been set.
		 *
		 * @public
		 */
		getLegacyTimeFormat : function() {
			return this.sLegacyTimeFormat || undefined;
		},

		/**
		 * Allows to specify one of the legacy ABAP time formats.
		 *
		 * This method sets the time patterns for 'short' and 'medium' style to the corresponding ABAP
		 * formats and sets the day period texts to "AM"/"PM" or "am"/"pm" respectively. When called
		 * with a null or undefined format id, any previously applied format will be removed.
		 *
		 * After changing the legacy time format, the framework tries to update localization
		 * specific parts of the UI. See the documentation of {@link sap.ui.core.Configuration#setLanguage}
		 * for details and restrictions.
		 *
		 * @param {string} sFormatId id of the ABAP time format (one of '0','1','2','3','4')
		 * @return {sap.ui.core.Configuration.FormatSettings} Returns <code>this</code> to allow method chaining
		 * @public
		 */
		setLegacyTimeFormat : function(sFormatId) {
			check(!sFormatId || M_ABAP_TIME_FORMAT_PATTERN.hasOwnProperty(sFormatId), "sFormatId must be one of ['0','1','2','3','4'] or empty");
			var mChanges = this.oConfiguration._collect();
			this.sLegacyTimeFormat = mChanges.legacyTimeFormat = sFormatId = sFormatId || "";
			this.setTimePattern("short", M_ABAP_TIME_FORMAT_PATTERN[sFormatId]["short"]);
			this.setTimePattern("medium", M_ABAP_TIME_FORMAT_PATTERN[sFormatId]["medium"]);
			this._setDayPeriods("abbreviated", M_ABAP_TIME_FORMAT_PATTERN[sFormatId].dayPeriods);
			this.oConfiguration._endCollect();
			return this;
		},

		/**
		 * Returns the currently set legacy ABAP number format (its id) or undefined if none has been set.
		 *
		 * @public
		 */
		getLegacyNumberFormat : function() {
			return this.sLegacyNumberFormat || undefined;
		},

		/**
		 * Allows to specify one of the legacy ABAP number format.
		 *
		 * This method will modify the 'group' and 'decimal' symbols. When called with a null
		 * or undefined format id, any previously applied format will be removed.
		 *
		 * After changing the legacy number format, the framework tries to update localization
		 * specific parts of the UI. See the documentation of {@link sap.ui.core.Configuration#setLanguage}
		 * for details and restrictions.
		 *
		 * @param {string} sFormatId id of the ABAP number format set (one of ' ','X','Y')
		 * @return {sap.ui.core.Configuration.FormatSettings} Returns <code>this</code> to allow method chaining
		 * @public
		 */
		setLegacyNumberFormat : function(sFormatId) {
			sFormatId = sFormatId ? sFormatId.toUpperCase() : "";
			check(!sFormatId || M_ABAP_NUMBER_FORMAT_SYMBOLS.hasOwnProperty(sFormatId), "sFormatId must be one of [' ','X','Y'] or empty");
			var mChanges = this.oConfiguration._collect();
			this.sLegacyNumberFormat = mChanges.legacyNumberFormat = sFormatId;
			this.setNumberSymbol("group", M_ABAP_NUMBER_FORMAT_SYMBOLS[sFormatId].groupingSeparator);
			this.setNumberSymbol("decimal", M_ABAP_NUMBER_FORMAT_SYMBOLS[sFormatId].decimalSeparator);
			this.oConfiguration._endCollect();
			return this;
		},

		/**
		 * Allows to specify the customizing data for Islamic calendar support
		 *
		 * @param {object[]} aMappings contains the customizing data for the support of Islamic calendar.
		 * @param {string} aMappings[].dateFormat The date format
		 * @param {string} aMappings[].islamicMonthStart The Islamic date
		 * @param {string} aMappings[].gregDate The corresponding Gregorian date
		 * @return {sap.ui.core.Configuration.FormatSettings} Returns <code>this</code> to allow method chaining
		 * @public
		 */
		setLegacyDateCalendarCustomizing : function(aMappings) {
			check(jQuery.isArray(aMappings), "aMappings must be an Array");

			var mChanges = this.oConfiguration._collect();
			this.aLegacyDateCalendarCustomizing = mChanges.legacyDateCalendarCustomizing = aMappings;
			this.oConfiguration._endCollect();
			return this;
		},

		/**
		 * Returns the currently set customizing data for Islamic calendar support
		 *
		 * @return {object[]} Returns an array contains the customizing data. Each element in the array has properties: dateFormat, islamicMonthStart, gregDate. For details, please see {@link #setLegacyDateCalendarCustomizing}
		 * @public
		 */
		getLegacyDateCalendarCustomizing : function() {
			return this.aLegacyDateCalendarCustomizing;
		},

		/*
		 * Returns a live object with the current settings
		 * TODO this method is part of the facade to be accessible from LocaleData, but it shouldn't be
		 * @private
		 */
		getCustomLocaleData : function() {
			return this.mSettings;
		}
	});

	return Configuration;

});
