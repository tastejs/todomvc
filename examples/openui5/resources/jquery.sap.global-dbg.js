/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

/*global URI, Promise, ES6Promise, alert, confirm, console, XMLHttpRequest*/

/**
 * @class Provides base functionality of the SAP jQuery plugin as extension of the jQuery framework.<br/>
 * See also <a href="http://api.jquery.com/jQuery/">jQuery</a> for details.<br/>
 * Although these functions appear as static ones, they are meant to be used on jQuery instances.<br/>
 * If not stated differently, the functions follow the fluent interface paradigm and return the jQuery instance for chaining of statements.
 *
 * Example for usage of an instance method:
 * <pre>
 *   var oRect = jQuery("#myDiv").rect();
 *   alert("Top Position: " + oRect.top);
 * </pre>
 *
 * @name jQuery
 * @static
 * @public
 */

(function() {

	if (!window.jQuery ) {
		throw new Error("SAPUI5 requires jQuery as a prerequisite (>= version 1.7)");
	}

	// ensure not to initialize twice
	if (jQuery.sap) {
		return;
	}

	// Enable promise polyfill if native promise is not available
	if (!window.Promise) {
		ES6Promise.polyfill();
	}

	/**
	 * Window that the sap plugin has been initialized for.
	 * @private
	 */
	var _window = window;

	// early logging support
	var _earlyLogs = [];
	function _earlyLog(sLevel, sMessage) {
		_earlyLogs.push({
			level: sLevel,
			message: sMessage
		});
	}

	var _sBootstrapUrl;

	// -------------------------- VERSION -------------------------------------

	var rVersion = /^[0-9]+(?:\.([0-9]+)(?:\.([0-9]+))?)?(.*)$/;

	/**
	 * Returns a Version instance created from the given parameters.
	 *
	 * This function can either be called as a constructor (using <code>new</code>) or as a normal function.
	 * It always returns an immutable Version instance.
	 *
	 * The parts of the version number (major, minor, patch, suffix) can be provided in several ways:
	 * <ul>
	 * <li>Version("1.2.3-SNAPSHOT") - as a dot-separated string. Any non-numerical char or a dot followed by a non-numerical char starts the suffix portion.
	 * Any missing major, minor or patch versions will be set to 0.</li>
	 * <li>Version(1,2,3,"-SNAPSHOT") - as individual parameters. Major, minor and patch must be integer numbers or empty, suffix must be a string not starting with digits.</li>
	 * <li>Version([1,2,3,"-SNAPSHOT"]) - as an array with the individual parts. The same type restrictions apply as before.</li>
	 * <li>Version(otherVersion) - as a Version instance (cast operation). Returns the given instance instead of creating a new one.</li>
	 * </ul>
	 *
	 * To keep the code size small, this implementation mainly validates the single string variant.
	 * All other variants are only validated to some degree. It is the responsibility of the caller to
	 * provide proper parts.
	 *
	 * @param {int|string|any[]|jQuery.sap.Version} vMajor the major part of the version (int) or any of the single parameter variants explained above.
	 * @param {int} iMinor the minor part of the version number
	 * @param {int} iPatch the patch part of the version number
	 * @param {string} sSuffix the suffix part of the version number
	 * @return {jQuery.sap.Version} the version object as determined from the parameters
	 *
	 * @class Represents a version consisting of major, minor, patch version and suffix, e.g. '1.2.7-SNAPSHOT'.
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 * @constructor
	 * @public
	 * @since 1.15.0
	 * @name jQuery.sap.Version
	 */
	function Version(vMajor, iMinor, iPatch, sSuffix) {
		if ( vMajor instanceof Version ) {
			// note: even a constructor may return a value different from 'this'
			return vMajor;
		}
		if ( !(this instanceof Version) ) {
			// act as a cast operator when called as function (not as a constructor)
			return new Version(vMajor, iMinor, iPatch, sSuffix);
		}

		var m;
		if (typeof vMajor === "string") {
			m = rVersion.exec(vMajor);
		} else if (jQuery.isArray(vMajor)) {
			m = vMajor;
		} else {
			m = arguments;
		}
		m = m || [];

		function norm(v) {
			v = parseInt(v,10);
			return isNaN(v) ? 0 : v;
		}
		vMajor = norm(m[0]);
		iMinor = norm(m[1]);
		iPatch = norm(m[2]);
		sSuffix = String(m[3] || "");

		/**
		 * Returns a string representation of this version.
		 *
		 * @return {string} a string representation of this version.
		 * @name jQuery.sap.Version#toString
		 * @public
		 * @since 1.15.0
		 * @function
		 */
		this.toString = function() {
			return vMajor + "." + iMinor + "." + iPatch + sSuffix;
		};

		/**
		 * Returns the major version part of this version.
		 *
		 * @return {int} the major version part of this version
		 * @name jQuery.sap.Version#getMajor
		 * @public
		 * @since 1.15.0
		 * @function
		 */
		this.getMajor = function() {
			return vMajor;
		};

		/**
		 * Returns the minor version part of this version.
		 *
		 * @return {int} the minor version part of this version
		 * @name jQuery.sap.Version#getMinor
		 * @public
		 * @since 1.15.0
		 * @function
		 */
		this.getMinor = function() {
			return iMinor;
		};

		/**
		 * Returns the patch (or micro) version part of this version.
		 *
		 * @return {int} the patch version part of this version
		 * @name jQuery.sap.Version#getPatch
		 * @public
		 * @since 1.15.0
		 * @function
		 */
		this.getPatch = function() {
			return iPatch;
		};

		/**
		 * Returns the version suffix of this version.
		 *
		 * @return {string} the version suffix of this version
		 * @name jQuery.sap.Version#getSuffix
		 * @public
		 * @since 1.15.0
		 * @function
		 */
		this.getSuffix = function() {
			return sSuffix;
		};

		/**
		 * Compares this version with a given one.
		 *
		 * The version with which this version should be compared can be given as
		 * <code>jQuery.sap.Version</code> instance, as a string (e.g. <code>v.compareto("1.4.5")</code>)
		 * or major, minor, patch and suffix cab be given as separate parameters (e.g. <code>v.compareTo(1, 4, 5)</code>)
		 * or in an array (e.g. <code>v.compareTo([1, 4, 5])</code>).
		 *
		 * @return {int} 0, if the given version is equal to this version, a negative value if the given version is greater and a positive value otherwise
		 * @name jQuery.sap.Version#compareTo
		 * @public
		 * @since 1.15.0
		 * @function
		 */
		this.compareTo = function() {
			var vOther = Version.apply(window, arguments);
			/*eslint-disable no-nested-ternary */
			return vMajor - vOther.getMajor() ||
					iMinor - vOther.getMinor() ||
					iPatch - vOther.getPatch() ||
					((sSuffix < vOther.getSuffix()) ? -1 : (sSuffix === vOther.getSuffix()) ? 0 : 1);
			/*eslint-enable no-nested-ternary */
		};

	}

	/**
	 * Checks whether this version is in the range of the given versions (start included, end excluded).
	 *
	 * The boundaries against which this version should be checked can be given as
	 * <code>jQuery.sap.Version</code> instances (e.g. <code>v.inRange(v1, v2)</code>), as strings (e.g. <code>v.inRange("1.4", "2.7")</code>)
	 * or as arrays (e.g. <code>v.inRange([1,4], [2,7])</code>).
	 *
	 * @param {string|any[]|jQuery.sap.Version} vMin the start of the range (inclusive)
	 * @param {string|any[]|jQuery.sap.Version} vMax the end of the range (exclusive)
	 * @return {boolean} <code>true</code> if this version is greater or equal to <code>vMin</code> and smaller than <code>vMax</code>, <code>false</code> otherwise.
	 * @name jQuery.sap.Version#inRange
	 * @public
	 * @since 1.15.0
	 * @function
	 */
	Version.prototype.inRange = function(vMin, vMax) {
		return this.compareTo(vMin) >= 0 && this.compareTo(vMax) < 0;
	};

	// -----------------------------------------------------------------------

	var oJQVersion = Version(jQuery.fn.jquery);
	if ( !oJQVersion.inRange("1.7.0", "2.2.0") ) {
		_earlyLog("error", "SAPUI5 requires a jQuery version of 1.7 or higher, but lower than 2.2; current version is " + jQuery.fn.jquery);
	}

	// TODO move to a separate module? Only adds 385 bytes (compressed), but...
	if ( !jQuery.browser ) {
		// re-introduce the jQuery.browser support if missing (jQuery-1.9ff)
		jQuery.browser = (function( ua ) {

			var rwebkit = /(webkit)[ \/]([\w.]+)/,
				ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/,
				rmsie = /(msie) ([\w.]+)/,
				rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/,
				ua = ua.toLowerCase(),
				match = rwebkit.exec( ua ) ||
					ropera.exec( ua ) ||
					rmsie.exec( ua ) ||
					ua.indexOf("compatible") < 0 && rmozilla.exec( ua ) ||
					[],
				browser = {};

			if ( match[1] ) {
				browser[ match[1] ] = true;
				browser.version = match[2] || "0";
				if ( browser.webkit ) {
					browser.safari = true;
				}
			}

			return browser;

		}(window.navigator.userAgent));
	}

	// XHR overrides for IE
	if (!!sap.ui.Device.browser.internet_explorer) {

		// Fixes the CORS issue (introduced by jQuery 1.7) when loading resources
		// (e.g. SAPUI5 script) from other domains for IE browsers.
		// The CORS check in jQuery filters out such browsers who do not have the
		// property "withCredentials" which is the IE and Opera and prevents those
		// browsers to request data from other domains with jQuery.ajax. The CORS
		// requests are simply forbidden nevertheless if it works. In our case we
		// simply load our script resources from another domain when using the CDN
		// variant of SAPUI5. The following fix is also recommended by jQuery:
		jQuery.support = jQuery.support || {};
		jQuery.support.cors = true;

		// Fixes XHR factory issue (introduced by jQuery 1.11). In case of IE
		// it uses by mistake the ActiveXObject XHR. In the list of XHR supported
		// HTTP methods PATCH and MERGE are missing which are required for OData.
		// The related ticket is: #2068 (no downported to jQuery 1.x planned)
		var oJQV = Version(jQuery.fn.jquery);
		// the fix will only be applied to jQuery >= 1.11.0 (only for jQuery 1.x)
		if (window.ActiveXObject !== undefined && oJQV.getMajor() == 1 && oJQV.getMinor() >= 11) {
			var fnCreateStandardXHR = function() {
				try {
					return new window.XMLHttpRequest();
				} catch (e) { /* ignore */ }
			};
			var fnCreateActiveXHR = function() {
				try {
					return new window.ActiveXObject("Microsoft.XMLHTTP");
				} catch (e) { /* ignore */ }
			};
			jQuery.ajaxSettings = jQuery.ajaxSettings || {};
			jQuery.ajaxSettings.xhr = function() {
				return !this.isLocal ? fnCreateStandardXHR() : fnCreateActiveXHR();
			};
		}

	}

	/**
	 * Find the script URL where the SAPUI5 is loaded from and return an object which
	 * contains the identified script-tag and resource root
	 */
	var _oBootstrap = (function() {
		var oTag, sUrl, sResourceRoot,
			reConfigurator = /^(.*\/)?download\/configurator[\/\?]/,
			reBootScripts = /^(.*\/)?(sap-ui-(core|custom|boot|merged)(-.*)?)\.js([?#]|$)/,
			reResources = /^(.*\/)?resources\//;

		// check all script tags that have a src attribute
		jQuery("script[src]").each(function() {
			var src = this.getAttribute("src"),
				m;
			if ( (m = src.match(reConfigurator)) !== null ) {
				// guess 1: script tag src contains "/download/configurator[/?]" (for dynamically created bootstrap files)
				oTag = this;
				sUrl = src;
				sResourceRoot = (m[1] || "") + "resources/";
				return false;
			} else if ( (m = src.match(reBootScripts)) !== null ) {
				// guess 2: src contains one of the well known boot script names
				oTag = this;
				sUrl = src;
				sResourceRoot = m[1] || "";
				return false;
			} else if ( this.id == 'sap-ui-bootstrap' && (m = src.match(reResources)) ) {
				// guess 2: script tag has well known id and src contains "resources/"
				oTag = this;
				sUrl = src;
				sResourceRoot = m[0];
				return false;
			}
		});
		return {
			tag: oTag,
			url: sUrl,
			resourceRoot: sResourceRoot
		};
	})();

	/**
	 * Determine whether sap-bootstrap-debug is set, run debugger statement and allow
	 * to restart the core from a new URL
	 */
	(function() {
		if (/sap-bootstrap-debug=(true|x|X)/.test(location.search)) {
			// Dear developer, the way to reload UI5 from a different location has changed: it can now be directly configured in the support popup (Ctrl-Alt-Shift-P),
			// without stepping into the debugger.
			// However, for convenience or cases where this popup is disabled, or for other usages of an early breakpoint, the "sap-bootstrap-debug" URL parameter option is still available.
			// To reboot an alternative core just step down a few lines and set sRebootUrl
			/*eslint-disable no-debugger */
			debugger;
		}

		// Check local storage for booting a different core
		var sRebootUrl;
		try { // Necessary for FF when Cookies are disabled
			sRebootUrl = window.localStorage.getItem("sap-ui-reboot-URL");
			window.localStorage.removeItem("sap-ui-reboot-URL"); // only reboot once from there (to avoid a deadlock when the alternative core is broken)
		} catch (e) { /* no warning, as this will happen on every startup, depending on browser settings */ }

		if (sRebootUrl && sRebootUrl !== "undefined") { // sic! It can be a string.
			/*eslint-disable no-alert*/
			var bUserConfirmed = confirm("WARNING!\n\nUI5 will be booted from the URL below.\nPress 'Cancel' unless you have configured this.\n\n" + sRebootUrl);
			/*eslint-enable no-alert*/

			if (bUserConfirmed) {
				// replace the bootstrap tag with a newly created script tag to enable restarting the core from a different server
				var oScript = _oBootstrap.tag,
					sScript = "<script src=\"" + sRebootUrl + "\"";
				jQuery.each(oScript.attributes, function(i, oAttr) {
					if (oAttr.nodeName.indexOf("data-sap-ui-") == 0) {
						sScript += " " + oAttr.nodeName + "=\"" + oAttr.nodeValue.replace(/"/g, "&quot;") + "\"";
					}
				});
				sScript += "></script>";
				oScript.parentNode.removeChild(oScript);

				// clean up cachebuster stuff
				jQuery("#sap-ui-bootstrap-cachebusted").remove();
				window["sap-ui-config"] && window["sap-ui-config"].resourceRoots && (window["sap-ui-config"].resourceRoots[""] = undefined);

				document.write(sScript);

				// now this core commits suicide to enable clean loading of the other core
				var oRestart = new Error("This is not a real error. Aborting UI5 bootstrap and rebooting from: " + sRebootUrl);
				oRestart.name = "Restart";
				throw oRestart;
			}
		}
	})();

	/**
	 * Determine whether to use debug sources depending on URL parameter and local storage
	 * and load debug library if necessary
	 */
	(function() {
		//Check URI param
		var bDebugSources = /sap-ui-debug=(true|x|X)/.test(location.search),
			bIsOptimized = window["sap-ui-optimized"];

		//Check local storage
		try {
			bDebugSources = bDebugSources || (window.localStorage.getItem("sap-ui-debug") == "X");
		} catch (e) {
			//Happens in FF when Cookies are deactivated
		}

		window["sap-ui-debug"] = bDebugSources;

		// if bootstap URL already contains -dbg URL, just set sap-ui-loaddbg
		if (/-dbg\.js([?#]|$)/.test(_oBootstrap.url)) {
			window["sap-ui-loaddbg"] = true;
			window["sap-ui-debug"] = true;
		}

		// if current sources are optimized and debug sources are wanted, restart with debug URL
		if (bIsOptimized && bDebugSources) {
			var sDebugUrl = _oBootstrap.url.replace(/\/(?:sap-ui-cachebuster\/)?([^\/]+)\.js/, "/$1-dbg.js");
			window["sap-ui-optimized"] = false;
			window["sap-ui-loaddbg"] = true;
			document.write("<script type=\"text/javascript\" src=\"" + sDebugUrl + "\"></script>");
			var oRestart = new Error("Aborting UI5 bootstrap and restarting from: " + sDebugUrl);
			oRestart.name = "Restart";
			throw oRestart;
		}
	})();

	/*
	 * Merged, raw (un-interpreted) configuration data from the following sources
	 * (last one wins)
	 * <ol>
	 * <li>global configuration object <code>window["sap-ui-config"]</code> (could be either a string/url or a configuration object)</li>
	 * <li><code>data-sap-ui-config</code> attribute of the bootstrap script tag</li>
	 * <li>other <code>data-sap-ui-<i>xyz</i></code> attributes of the bootstrap tag</li>
	 * </ol>
	 */
	var oCfgData = _window["sap-ui-config"] = (function() {

		function normalize(o) {
			jQuery.each(o, function(i, v) {
				var il = i.toLowerCase();
				if ( !o.hasOwnProperty(il) ) {
					o[il] = v;
					delete o[i];
				}
			});
			return o;
		}

		var oScriptTag = _oBootstrap.tag,
			oCfg = _window["sap-ui-config"],
			sCfgFile = "sap-ui-config.json";

		// load the configuration from an external JSON file
		if (typeof oCfg === "string") {
			_earlyLog("warning", "Loading external bootstrap configuration from \"" + oCfg + "\". This is a design time feature and not for productive usage!");
			if (oCfg !== sCfgFile) {
				_earlyLog("warning", "The external bootstrap configuration file should be named \"" + sCfgFile + "\"!");
			}
			jQuery.ajax({
				url : oCfg,
				dataType : 'json',
				async : false,
				success : function(oData, sTextStatus, jqXHR) {
					oCfg = oData;
				},
				error : function(jqXHR, sTextStatus, oError) {
					_earlyLog("error", "Loading externalized bootstrap configuration from \"" + oCfg + "\" failed! Reason: " + oError + "!");
					oCfg = undefined;
				}
			});
		}

		oCfg = normalize(oCfg || {});
		oCfg.resourceroots = oCfg.resourceroots || {};
		oCfg.themeroots = oCfg.themeroots || {};
		oCfg.resourceroots[''] = oCfg.resourceroots[''] || _oBootstrap.resourceRoot;

		oCfg['xx-loadallmode'] = /(^|\/)(sap-?ui5|[^\/]+-all).js([?#]|$)/.test(_oBootstrap.url);

		// if a script tag has been identified, collect its configuration info
		if ( oScriptTag ) {
			// evaluate the config attribute first - if present
			var sConfig = oScriptTag.getAttribute("data-sap-ui-config");
			if ( sConfig ) {
				try {
					/*eslint-disable no-new-func */
					jQuery.extend(oCfg, normalize((new Function("return {" + sConfig + "};"))())); // TODO jQuery.parseJSON would be better but imposes unwanted restrictions on valid syntax
					/*eslint-enable no-new-func */
				} catch (e) {
					// no log yet, how to report this error?
					_earlyLog("error", "failed to parse data-sap-ui-config attribute: " + (e.message || e));
				}
			}

			// merge with any existing "data-sap-ui-" attributes
			jQuery.each(oScriptTag.attributes, function(i, attr) {
				var m = attr.name.match(/^data-sap-ui-(.*)$/);
				if ( m ) {
					// the following (deactivated) conversion would implement multi-word names like "resource-roots"
					m = m[1].toLowerCase(); // .replace(/\-([a-z])/g, function(s,w) { return w.toUpperCase(); })
					if ( m === 'resourceroots' ) {
						// merge map entries instead of overwriting map
						jQuery.extend(oCfg[m], jQuery.parseJSON(attr.value));
					} else if ( m === 'theme-roots' ) {
						// merge map entries, but rename to camelCase
						jQuery.extend(oCfg.themeroots, jQuery.parseJSON(attr.value));
					} else if ( m !== 'config' ) {
						oCfg[m] = attr.value;
					}
				}
			});
		}

		return oCfg;
	}());

	// check whether noConflict must be used...
	if ( oCfgData.noconflict === true || oCfgData.noconflict === "true"  || oCfgData.noconflict === "x" ) {
		jQuery.noConflict();
	}

	/**
	 * Root Namespace for the jQuery plug-in provided by SAP SE.
	 *
	 * @version 1.32.9
	 * @namespace
	 * @public
	 * @static
	 */
	jQuery.sap = {};

	// -------------------------- VERSION -------------------------------------

	jQuery.sap.Version = Version;

	// -------------------------- PERFORMANCE NOW -------------------------------------
	/**
	 * Returns a high resolution timestamp for measurements.
	 * The timestamp is based on 01/01/1970 00:00:00 as float with microsecond precision or
	 * with millisecond precision, if high resolution timestamps are not available.
	 * The fractional part of the timestamp represents microseconds.
	 * Converting to a <code>Date</code> is possible using <code>new Date(jQuery.sap.now())</code>
	 *
	 * @public
	 * @returns {float} high resolution timestamp for measurements
	 */
	jQuery.sap.now = !(window.performance && window.performance.now && window.performance.timing) ? Date.now : function() {
		return window.performance.timing.navigationStart + window.performance.now();
	};

	// -------------------------- DEBUG LOCAL STORAGE -------------------------------------
	jQuery.sap.debug = function(bEnable) {
		if (!window.localStorage) {
			return null;
		}

		function reloadHint(bUsesDbgSrc){
			/*eslint-disable no-alert */
			alert("Usage of debug sources is " + (bUsesDbgSrc ? "on" : "off") + " now.\nFor the change to take effect, you need to reload the page.");
			/*eslint-enable no-alert */
		}

		if (bEnable === true) {
			window.localStorage.setItem("sap-ui-debug", "X");
			reloadHint(true);
		} else if (bEnable === false) {
			window.localStorage.removeItem("sap-ui-debug");
			reloadHint(false);
		}

		return window.localStorage.getItem("sap-ui-debug") == "X";
	};

	/**
	 * Sets the URL to reboot this app from, the next time it is started. Only works with localStorage API available
	 * (and depending on the browser, if cookies are enabled, even though cookies are not used).
	 *
	 * @param sRebootUrl the URL to sap-ui-core.js, from which the application should load UI5 on next restart; undefined clears the restart URL
	 * @returns the current reboot URL or undefined in case of an error or when the reboot URL has been cleared
	 *
	 * @private
	 */
	jQuery.sap.setReboot = function(sRebootUrl) { // null-ish clears the reboot request
		var sUrl;
		if (!window.localStorage) {
			return null;
		}

		try {
			if (sRebootUrl) {
				window.localStorage.setItem("sap-ui-reboot-URL", sRebootUrl); // remember URL to reboot from

				/*eslint-disable no-alert */
				alert("Next time this app is launched (only once), it will load UI5 from:\n" + sRebootUrl + ".\nPlease reload the application page now.");
				/*eslint-enable no-alert */

			} else {
				window.localStorage.removeItem("sap-ui-reboot-URL"); // clear reboot URL, so app will start normally
			}

			sUrl =  window.localStorage.getItem("sap-ui-reboot-URL");
		} catch (e) {
			jQuery.sap.log.warning("Could not access localStorage while setting reboot URL '" + sRebootUrl + "' (are cookies disabled?): " + e.message);
		}

		return sUrl;
	};

	// -------------------------- STATISTICS LOCAL STORAGE -------------------------------------

	jQuery.sap.statistics = function(bEnable) {
		if (!window.localStorage) {
			return null;
		}

		function gatewayStatsHint(bUsesDbgSrc){
			/*eslint-disable no-alert */
			alert("Usage of Gateway statistics " + (bUsesDbgSrc ? "on" : "off") + " now.\nFor the change to take effect, you need to reload the page.");
			/*eslint-enable no-alert */
		}

		if (bEnable === true) {
			window.localStorage.setItem("sap-ui-statistics", "X");
			gatewayStatsHint(true);
		} else if (bEnable === false) {
			window.localStorage.removeItem("sap-ui-statistics");
			gatewayStatsHint(false);
		}

		return window.localStorage.getItem("sap-ui-statistics") == "X";
	};

	// -------------------------- Logging -------------------------------------

	(function() {

		var FATAL = 0, ERROR = 1, WARNING = 2, INFO = 3, DEBUG = 4, TRACE = 5,

		/**
		 * Unique prefix for this instance of the core in a multi-frame environment.
		 */
			sWindowName = (window.top == window) ? "" : "[" + window.location.pathname.split('/').slice(-1)[0] + "] ",
		// Note: comparison must use type coercion (==, not ===), otherwise test fails in IE

		/**
		 * The array that holds the log entries that have been recorded so far
		 */
			aLog = [],

		/**
		 * Maximum log level to be recorded (per component).
		 */
			mMaxLevel = { '' : ERROR },

		/**
		 * Registered listener to be informed about new log entries.
		 */
			oListener = null;

		function pad0(i,w) {
			return ("000" + String(i)).slice(-w);
		}

		function level(sComponent) {
			return (!sComponent || isNaN(mMaxLevel[sComponent])) ? mMaxLevel[''] : mMaxLevel[sComponent];
		}

		function listener(){
			if (!oListener) {
				oListener = {
					listeners: [],
					onLogEntry: function(oLogEntry){
						for (var i = 0; i < oListener.listeners.length; i++) {
							if (oListener.listeners[i].onLogEntry) {
								oListener.listeners[i].onLogEntry(oLogEntry);
							}
						}
					},
					attach: function(oLogger, oLstnr){
						if (oLstnr) {
							oListener.listeners.push(oLstnr);
							if (oLstnr.onAttachToLog) {
								oLstnr.onAttachToLog(oLogger);
							}
						}
					},
					detach: function(oLogger, oLstnr){
						for (var i = 0; i < oListener.listeners.length; i++) {
							if (oListener.listeners[i] === oLstnr) {
								if (oLstnr.onDetachFromLog) {
									oLstnr.onDetachFromLog(oLogger);
								}
								oListener.listeners.splice(i,1);
								return;
							}
						}
					}
				};
			}
			return oListener;
		}

		/**
		 * Creates a new log entry depending on its level and component.
		 *
		 * If the given level is higher than the max level for the given component
		 * (or higher than the global level, if no component is given),
		 * then no entry is created.
		 */
		function log(iLevel, sMessage, sDetails, sComponent) {
			if (iLevel <= level(sComponent) ) {
				var fNow =  jQuery.sap.now(),
					oNow = new Date(fNow),
					iMicroSeconds = Math.floor((fNow - Math.floor(fNow)) * 1000),
					oLogEntry = {
						time     : pad0(oNow.getHours(),2) + ":" + pad0(oNow.getMinutes(),2) + ":" + pad0(oNow.getSeconds(),2) + "." + pad0(oNow.getMilliseconds(),3) + pad0(iMicroSeconds,3),
						date     : pad0(oNow.getFullYear(),4) + "-" + pad0(oNow.getMonth() + 1,2) + "-" + pad0(oNow.getDate(),2),
						timestamp: fNow,
						level    : iLevel,
						message  : String(sMessage || ""),
						details  : String(sDetails || ""),
						component: String(sComponent || "")
					};
				aLog.push( oLogEntry );
				if (oListener) {
					oListener.onLogEntry(oLogEntry);
				}

				/*
				 * Console Log, also tries to log to the window.console, if available.
				 *
				 * Unfortunately, the support for window.console is quite different between the UI5 browsers. The most important differences are:
				 * - in IE (checked until IE9), the console object does not exist in a window, until the developer tools are opened for that window.
				 *   After opening the dev tools, the console remains available even when the tools are closed again. Only using a new window (or tab)
				 *   restores the old state without console.
				 *   When the console is available, it provides most standard methods, but not debug and trace
				 * - in FF3.6 the console is not available, until FireBug is opened. It disappears again, when fire bug is closed.
				 *   But when the settings for a web site are stored (convenience), the console remains open
				 *   When the console is available, it supports all relevant methods
				 * - in FF9.0, the console is always available, but method assert is only available when firebug is open
				 * - in Webkit browsers, the console object is always available and has all required methods
				 *   - Exception: in the iOS Simulator, console.info() does not exist
				 */
				/*eslint-disable no-console */
				if (window.console) { // in IE and FF, console might not exist; in FF it might even disappear
					var logText = oLogEntry.date + " " + oLogEntry.time + " " + sWindowName + oLogEntry.message + " - " + oLogEntry.details + " " + oLogEntry.component;
					switch (iLevel) {
					case FATAL:
					case ERROR: console.error(logText); break;
					case WARNING: console.warn(logText); break;
					case INFO: console.info ? console.info(logText) : console.log(logText); break;    // info not available in iOS simulator
					case DEBUG: console.debug ? console.debug(logText) : console.log(logText); break; // debug not available in IE, fallback to log
					case TRACE: console.trace ? console.trace(logText) : console.log(logText); break; // trace not available in IE, fallback to log (no trace)
					}
				}
				/*eslint-enable no-console */
				return oLogEntry;
			}
		}

		/**
		 * Creates a new Logger instance which will use the given component string
		 * for all logged messages without a specific component.
		 *
		 * @param {string} sDefaultComponent
		 *
		 * @class A Logger class
		 * @name jQuery.sap.log.Logger
		 * @since 1.1.2
		 * @public
		 */
		function Logger(sDefaultComponent) {

			/**
			 * Creates a new fatal-level entry in the log with the given message, details and calling component.
			 *
			 * @param {string} sMessage Message text to display
			 * @param {string} [sDetails=''] Details about the message, might be omitted
			 * @param {string} [sComponent=''] Name of the component that produced the log entry
			 * @return {jQuery.sap.log.Logger} The log instance for method chaining
			 * @name jQuery.sap.log.Logger#fatal
			 * @function
			 * @public
			 * @SecSink {0 1 2|SECRET} Could expose secret data in logs
			 */
			this.fatal = function (sMessage, sDetails, sComponent) {
				log(FATAL, sMessage, sDetails, sComponent || sDefaultComponent);
				return this;
			};

			/**
			 * Creates a new error-level entry in the log with the given message, details and calling component.
			 *
			 * @param {string} sMessage Message text to display
			 * @param {string} [sDetails=''] Details about the message, might be omitted
			 * @param {string} [sComponent=''] Name of the component that produced the log entry
			 * @return {jQuery.sap.log.Logger} The log instance
			 * @name jQuery.sap.log.Logger#error
			 * @function
			 * @public
			 * @SecSink {0 1 2|SECRET} Could expose secret data in logs
			 */
			this.error = function error(sMessage, sDetails, sComponent) {
				log(ERROR, sMessage, sDetails, sComponent || sDefaultComponent);
				return this;
			};

			/**
			 * Creates a new warning-level entry in the log with the given message, details and calling component.
			 *
			 * @param {string} sMessage Message text to display
			 * @param {string} [sDetails=''] Details about the message, might be omitted
			 * @param {string} [sComponent=''] Name of the component that produced the log entry
			 * @return {jQuery.sap.log.Logger} The log instance
			 * @name jQuery.sap.log.Logger#warning
			 * @function
			 * @public
			 * @SecSink {0 1 2|SECRET} Could expose secret data in logs
			 */
			this.warning = function warning(sMessage, sDetails, sComponent) {
				log(WARNING, sMessage, sDetails, sComponent || sDefaultComponent);
				return this;
			};
			/**
			 * Creates a new info-level entry in the log with the given message, details and calling component.
			 *
			 * @param {string} sMessage Message text to display
			 * @param {string} [sDetails=''] Details about the message, might be omitted
			 * @param {string} [sComponent=''] Name of the component that produced the log entry
			 * @return {jQuery.sap.log.Logger} The log instance
			 * @name jQuery.sap.log.Logger#info
			 * @function
			 * @public
			 * @SecSink {0 1 2|SECRET} Could expose secret data in logs
			 */
			this.info = function info(sMessage, sDetails, sComponent) {
				log(INFO, sMessage, sDetails, sComponent || sDefaultComponent);
				return this;
			};
			/**
			 * Creates a new debug-level entry in the log with the given message, details and calling component.
			 *
			 * @param {string} sMessage Message text to display
			 * @param {string} [sDetails=''] Details about the message, might be omitted
			 * @param {string} [sComponent=''] Name of the component that produced the log entry
			 * @return {jQuery.sap.log.Logger} The log instance
			 * @name jQuery.sap.log.Logger#debug
			 * @function
			 * @public
			 * @SecSink {0 1 2|SECRET} Could expose secret data in logs
			 */
			this.debug = function debug(sMessage, sDetails, sComponent) {
				log(DEBUG, sMessage, sDetails, sComponent || sDefaultComponent);
				return this;
			};
			/**
			 * Creates a new trace-level entry in the log with the given message, details and calling component.
			 *
			 * @param {string} sMessage Message text to display
			 * @param {string} [sDetails=''] Details about the message, might be omitted
			 * @param {string} [sComponent=''] Name of the component that produced the log entry
			 * @return {jQuery.sap.log.Logger} The log-instance
			 * @name jQuery.sap.log.Logger#trace
			 * @function
			 * @public
			 * @SecSink {0 1 2|SECRET} Could expose secret data in logs
			 */
			this.trace = function trace(sMessage, sDetails, sComponent) {
				log(TRACE, sMessage, sDetails, sComponent || sDefaultComponent);
				return this;
			};

			/**
			 * Defines the maximum jQuery.sap.log.Level of log entries that will be recorded.
			 * Log entries with a higher (less important) log level will be omitted from the log.
			 * When a component name is given, the log level will be configured for that component
			 * only, otherwise the log level for the default component of this logger is set.
			 * For the global logger, the global default level is set.
			 *
			 * <b>Note</b>: Setting a global default log level has no impact on already defined
			 * component log levels. They always override the global default log level.
			 *
			 * @param {jQuery.sap.log.Level} iLogLevel
			 * @param {string} [sComponent] The log component to set the log level for.
			 * @return {jQuery.sap.log} The global logger to allow method chaining
			 * @name jQuery.sap.log.Logger#setLevel
			 * @function
			 * @public
			 */
			this.setLevel = function setLevel(iLogLevel, sComponent) {
				sComponent = sComponent || sDefaultComponent || '';
				mMaxLevel[sComponent] = iLogLevel;
				var mBackMapping = [];
				jQuery.each(jQuery.sap.log.LogLevel, function(idx, v){
					mBackMapping[v] = idx;
				});
				log(INFO, "Changing log level " + (sComponent ? "for '" + sComponent + "' " : "") + "to " + mBackMapping[iLogLevel], "", "jQuery.sap.log");
				return this;
			};

			/**
			 * Returns the log level currently effective for the given component.
			 * If no component is given or when no level has been configured for a
			 * given component, the log level for the default component of this logger is returned.
			 *
			 * @param {string} [sComponent] Name of the component to retrieve the log level for
			 * @return {int} The log level for the given component or the default log level
			 * @name jQuery.sap.log.Logger#getLevel
			 * @function
			 * @public
			 * @since 1.1.2
			 */
			this.getLevel = function getLevel(sComponent) {
				return level(sComponent || sDefaultComponent);
			};

			/**
			 * Checks whether logging is enabled for the given log level,
			 * depending on the currently effective log level for the given component.
			 *
			 * If no component is given, the default component of this logger will be taken into account.
			 *
			 * @param {int} [iLevel=Level.DEBUG] the log level in question
			 * @param {string} [sComponent] Name of the component to check the log level for
			 * @return {boolean} Whether logging is enabled or not
			 * @name jQuery.sap.log.Logger#isLoggable
			 * @function
			 * @public
			 * @since 1.13.2
			 */
			this.isLoggable = function (iLevel, sComponent) {
				return (iLevel == null ? DEBUG : iLevel) <= level(sComponent || sDefaultComponent);
			};
		}

		/**
		 * A Logging API for JavaScript.
		 *
		 * Provides methods to manage a client-side log and to create entries in it. Each of the logging methods
		 * {@link jQuery.sap.log.#debug}, {@link jQuery.sap.log.#info}, {@link jQuery.sap.log.#warning},
		 * {@link jQuery.sap.log.#error} and {@link jQuery.sap.log.#fatal} creates and records a log entry,
		 * containing a timestamp, a log level, a message with details and a component info.
		 * The log level will be one of {@link jQuery.sap.log.Level} and equals the name of the concrete logging method.
		 *
		 * By using the {@link jQuery.sap.log#setLevel} method, consumers can determine the least important
		 * log level which should be recorded. Less important entries will be filtered out. (Note that higher numeric
		 * values represent less important levels). The initially set level depends on the mode that UI5 is running in.
		 * When the optimized sources are executed, the default level will be {@link jQuery.sap.log.Level.ERROR}.
		 * For normal (debug sources), the default level is {@link jQuery.sap.log.Level.DEBUG}.
		 *
		 * All logging methods allow to specify a <b>component</b>. These components are simple strings and
		 * don't have a special meaning to the UI5 framework. However they can be used to semantically group
		 * log entries that belong to the same software component (or feature). There are two APIs that help
		 * to manage logging for such a component. With <code>{@link jQuery.sap.log.getLogger}(sComponent)</code>,
		 * one can retrieve a logger that automatically adds the given <code>sComponent</code> as component
		 * parameter to each log entry, if no other component is specified. Typically, JavaScript code will
		 * retrieve such a logger once during startup and reuse it for the rest of its lifecycle.
		 * Second, the {@link jQuery.sap.log.Logger#setLevel}(iLevel, sComponent) method allows to set the log level
		 * for a specific component only. This allows a more fine granular control about the created logging entries.
		 * {@link jQuery.sap.log.Logger.getLevel} allows to retrieve the currently effective log level for a given
		 * component.
		 *
		 * {@link jQuery.sap.log#getLog} returns an array of the currently collected log entries.
		 *
		 * Furthermore, a listener can be registered to the log. It will be notified whenever a new entry
		 * is added to the log. The listener can be used for displaying log entries in a separate page area,
		 * or for sending it to some external target (server).
		 *
		 * @author SAP SE
		 * @since 0.9.0
		 * @namespace
		 * @public
		 * @borrows jQuery.sap.log.Logger#fatal as fatal
		 * @borrows jQuery.sap.log.Logger#error as error
		 * @borrows jQuery.sap.log.Logger#warning as warning
		 * @borrows jQuery.sap.log.Logger#info as info
		 * @borrows jQuery.sap.log.Logger#debug as debug
		 * @borrows jQuery.sap.log.Logger#trace as trace
		 * @borrows jQuery.sap.log.Logger#getLevel as getLevel
		 * @borrows jQuery.sap.log.Logger#setLevel as setLevel
		 * @borrows jQuery.sap.log.Logger#isLoggable as isLoggable
		 */
		jQuery.sap.log = jQuery.extend(new Logger(), /** @lends jQuery.sap.log */ {

			/**
			 * Enumeration of the configurable log levels that a Logger should persist to the log.
			 *
			 * Only if the current LogLevel is higher than the level {@link jQuery.sap.log.Level} of the currently added log entry,
			 * then this very entry is permanently added to the log. Otherwise it is ignored.
			 * @see jQuery.sap.log.Logger#setLevel
			 * @namespace
			 * @public
			 */
			Level : {

				/**
				 * Do not log anything
				 * @public
				 */
				NONE : FATAL - 1,

				/**
				 * Fatal level. Use this for logging unrecoverable situations
				 * @public
				 */
				FATAL : FATAL,

				/**
				 * Error level. Use this for logging of erroneous but still recoverable situations
				 * @public
				 */
				ERROR : ERROR,

				/**
				 * Warning level. Use this for logging unwanted but foreseen situations
				 * @public
				 */
				WARNING : WARNING,

				/**
				 * Info level. Use this for logging information of purely informative nature
				 * @public
				 */
				INFO : INFO,

				/**
				 * Debug level. Use this for logging information necessary for debugging
				 * @public
				 */
				DEBUG : DEBUG,

				/**
				 * Trace level. Use this for tracing the program flow.
				 * @public
				 */
				TRACE : TRACE, /* TODO Think about changing to 10 and thus to pull out of logging... -> Make tracing explicit */

				/**
				 * Trace level to log everything.
				 */
				ALL : (TRACE + 1) /* TODO if TRACE is changed to make sure this is 6 again. There would then be some special TRACE handling. */
			},

			/**
			 * Returns a {@link jQuery.sap.log.Logger} for the given component.
			 *
			 * The method might or might not return the same logger object across multiple calls.
			 * While loggers are assumed to be light weight objects, consumers should try to
			 * avoid redundant calls and instead keep references to already retrieved loggers.
			 *
			 * The optional second parameter <code>iDefaultLogLevel</code> allows to specify
			 * a default log level for the component. It is only applied when no log level has been
			 * defined so far for that component (ignoring inherited log levels). If this method is
			 * called multiple times for the same component but with different log levels,
			 * only the first call one might be taken into account.
			 *
			 * @param {string} sComponent Component to create the logger for
			 * @param {int} [iDefaultLogLevel] a default log level to be used for the component,
			 *   if no log level has been defined for it so far.
			 * @return {jQuery.sap.log.Logger} A logger for the component.
			 * @public
			 * @static
			 * @since 1.1.2
			 */
			getLogger : function(sComponent, iDefaultLogLevel) {
				if ( !isNaN(iDefaultLogLevel) && mMaxLevel[sComponent] == null ) {
					mMaxLevel[sComponent] = iDefaultLogLevel;
				}
				return new Logger(sComponent);
			},

			/**
			 * Returns the logged entries recorded so far as an array.
			 *
			 * Log entries are plain JavaScript objects with the following properties
			 * <ul>
			 * <li>timestamp {number} point in time when the entry was created
			 * <li>level {int} LogLevel level of the entry
			 * <li>message {string} message text of the entry
			 * </ul>
			 *
			 * @return {object[]} an array containing the recorded log entries
			 * @public
			 * @static
			 * @since 1.1.2
			 */
			getLogEntries : function () {
				return aLog.slice();
			},

			/**
			 * Allows to add a new LogListener that will be notified for new log entries.
			 * The given object must provide method <code>onLogEntry</code> and can also be informed
			 * about <code>onDetachFromLog</code> and <code>onAttachToLog</code>
			 * @param {object} oListener The new listener object that should be informed
			 * @return {jQuery.sap.log} The global logger
			 * @public
			 * @static
			 */
			addLogListener : function(oListener) {
				listener().attach(this, oListener);
				return this;
			},

			/**
			 * Allows to remove a registered LogListener.
			 * @param {object} oListener The new listener object that should be removed
			 * @return {jQuery.sap.log} The global logger
			 * @public
			 * @static
			 */
			removeLogListener : function(oListener) {
				listener().detach(this, oListener);
				return this;
			}

		});

		/**
		 * Enumeration of levels that can be used in a call to {@link jQuery.sap.log.Logger#setLevel}(iLevel, sComponent).
		 *
		 * @deprecated Since 1.1.2. To streamline the Logging API a bit, the separation between Level and LogLevel has been given up.
		 * Use the (enriched) enumeration {@link jQuery.sap.log.Level} instead.
		 * @namespace
		 * @public
		 */
		jQuery.sap.log.LogLevel = jQuery.sap.log.Level;

		/**
		 * Retrieves the currently recorded log entries.
		 * @deprecated Since 1.1.2. To avoid confusion with getLogger, this method has been renamed to {@link jQuery.sap.log.getLogEntries}.
		 * @function
		 * @public
		 * @static
		 */
		jQuery.sap.log.getLog = jQuery.sap.log.getLogEntries;

		// *** Performance measure ***
		function PerfMeasurement(){

			function Measurement( sId, sInfo, iStart, iEnd, aCategories){
				this.id = sId;
				this.info = sInfo;
				this.start = iStart;
				this.end = iEnd;
				this.pause = 0;
				this.resume = 0;
				this.duration = 0; // used time
				this.time = 0; // time from start to end
				this.categories = aCategories;
				this.average = false; //average duration enabled
				this.count = 0; //average count
				this.completeDuration = 0; //complete duration
			}

			function matchCategories(aCategories) {
				if (!aRestrictedCategories) {
					return true;
				}
				if (!aCategories) {
					return aRestrictedCategories === null;
				}
				//check whether active categories and current categories match
				for (var i = 0; i < aRestrictedCategories.length; i++) {
					if (aCategories.indexOf(aRestrictedCategories[i]) > -1) {
						return true;
					}
				}
				return false;
			}

			function checkCategories(aCategories) {
				if (!aCategories) {
					aCategories = ["javascript"];
				}
				aCategories = typeof aCategories === "string" ? aCategories.split(",") : aCategories;
				if (!matchCategories(aCategories)) {
					return null;
				}
				return aCategories;
			}

			var bActive = false,
				fnAjax = jQuery.ajax,
				aRestrictedCategories = null,
				aAverageMethods = [],
				aOriginalMethods = [],
				aMethods = ["start", "end", "pause", "resume", "add", "remove", "clear", "average"];

			/**
			 * Gets the current state of the perfomance measurement functionality
			 *
			 * @return {boolean} current state of the perfomance measurement functionality
			 * @name jQuery.sap.measure#getActive
			 * @function
			 * @public
			 */
			this.getActive = function(){
				return bActive;
			};

			/**
			 * Activates or deactivates the performance measure functionality
			 * Optionally a category or list of categories can be passed to restrict measurements to certain categories
			 * like "javascript", "require", "xmlhttprequest", "render"
			 * @param {boolean} bOn state of the perfomance measurement functionality to set
			 * @param {string | string[]}  An optional list of categories that should be measured
			 *
			 * @return {boolean} current state of the perfomance measurement functionality
			 * @name jQuery.sap.measure#setActive
			 * @function
			 * @public
			 */
			this.setActive = function(bOn, aCategories){
				//set restricted categories
				if (!aCategories) {
					aCategories = null;
				} else if (typeof aCategories === "string") {
					aCategories = aCategories.split(",");
				}
				aRestrictedCategories = aCategories;

				if (bActive === bOn) {
					return;
				}
				bActive = bOn;
				if (bActive) {

					//activate method implementations once
					for (var i = 0; i < aMethods.length; i++) {
						this[aMethods[i]] = this["_" + aMethods[i]];

					}
					aMethods = [];
					// wrap and instrument jQuery.ajax
					jQuery.ajax = function(url, options) {

						if ( typeof url === 'object' ) {
							options = url;
							url = undefined;
						}
						options = options || {};

						var sMeasureId = new URI(url || options.url).absoluteTo(document.location.origin + document.location.pathname).href();
						jQuery.sap.measure.start(sMeasureId, "Request for " + sMeasureId, "xmlhttprequest");
						var fnComplete = options.complete;
						options.complete = function() {
							jQuery.sap.measure.end(sMeasureId);
							if (fnComplete) {
								fnComplete.call(this, arguments);
							}
						};

						// strict mode: we potentially modified 'options', so we must not use 'arguments'
						return fnAjax.call(this, url, options);
					};
				} else if (fnAjax) {
					jQuery.ajax = fnAjax;
				}

				return bActive;
			};

			this.mMeasurements = {};


			/**
			 * Starts a performance measure.
			 * Optionally a category or list of categories can be passed to allow filtering of measurements.
			 *
			 * @param {string} sId ID of the measurement
			 * @param {string} sInfo Info for the measurement
			 * @param {string | string[]} [aCategories = "javascript"] An optional list of categories for the measure
			 *
			 * @return {object} current measurement containing id, info and start-timestamp (false if error)
			 * @name jQuery.sap.measure#start
			 * @function
			 * @public
			 */
			this._start = function( sId, sInfo, aCategories){
				if (!bActive) {
					return;
				}

				aCategories = checkCategories(aCategories);
				if (!aCategories) {
					return;
				}

				var iTime = jQuery.sap.now(),
					oMeasurement = new Measurement( sId, sInfo, iTime, 0, aCategories);

				// create timeline entries if available
				/*eslint-disable no-console */
				if (console.time) {
					console.time(sInfo + " - " + sId);
				}
				/*eslint-enable no-console */
	//			jQuery.sap.log.info("Performance measurement start: "+ sId + " on "+ iTime);

				if (oMeasurement) {
					this.mMeasurements[sId] = oMeasurement;
					return this.getMeasurement(oMeasurement.id);
				} else {
					return false;
				}
			};

			/**
			 * Pauses a performance measure
			 *
			 * @param {string} sId ID of the measurement
			 * @return {object} current measurement containing id, info and start-timestamp, pause-timestamp (false if error)
			 * @name jQuery.sap.measure#pause
			 * @function
			 * @public
			 */
			this._pause = function( sId ){
				if (!bActive) {
					return;
				}

				var iTime = jQuery.sap.now();
				var oMeasurement = this.mMeasurements[sId];
				if (oMeasurement && oMeasurement.end > 0) {
					// already ended -> no pause possible
					return false;
				}

				if (oMeasurement && oMeasurement.pause == 0) {
					// not already paused
					oMeasurement.pause = iTime;
					if (oMeasurement.pause >= oMeasurement.resume && oMeasurement.resume > 0) {
						oMeasurement.duration = oMeasurement.duration + oMeasurement.pause - oMeasurement.resume;
						oMeasurement.resume = 0;
					} else if (oMeasurement.pause >= oMeasurement.start) {
						oMeasurement.duration = oMeasurement.pause - oMeasurement.start;
					}
				}
	//			jQuery.sap.log.info("Performance measurement pause: "+ sId + " on "+ iTime + " duration: "+ oMeasurement.duration);

				if (oMeasurement) {
					return this.getMeasurement(oMeasurement.id);
				} else {
					return false;
				}
			};

			/**
			 * Resumes a performance measure
			 *
			 * @param {string} sId ID of the measurement
			 * @return {object} current measurement containing id, info and start-timestamp, resume-timestamp (false if error)
			 * @name jQuery.sap.measure#resume
			 * @function
			 * @public
			 */
			this._resume = function( sId ){
				if (!bActive) {
					return;
				}

				var iTime = jQuery.sap.now();
				var oMeasurement = this.mMeasurements[sId];
	//			jQuery.sap.log.info("Performance measurement resume: "+ sId + " on "+ iTime + " duration: "+ oMeasurement.duration);

				if (oMeasurement && oMeasurement.pause > 0) {
					// already paused
					oMeasurement.pause = 0;
					oMeasurement.resume = iTime;
				}

				if (oMeasurement) {
					return this.getMeasurement(oMeasurement.id);
				} else {
					return false;
				}
			};

			/**
			 * Ends a performance measure
			 *
			 * @param {string} sId ID of the measurement
			 * @return {object} current measurement containing id, info and start-timestamp, end-timestamp, time, duration (false if error)
			 * @name jQuery.sap.measure#end
			 * @function
			 * @public
			 */
			this._end = function( sId ){
				if (!bActive) {
					return;
				}

				var iTime = jQuery.sap.now();

				var oMeasurement = this.mMeasurements[sId];
	//			jQuery.sap.log.info("Performance measurement end: "+ sId + " on "+ iTime);

				if (oMeasurement && !oMeasurement.end) {
					oMeasurement.end = iTime;
					if (oMeasurement.end >= oMeasurement.resume && oMeasurement.resume > 0) {
						oMeasurement.duration = oMeasurement.duration + oMeasurement.end - oMeasurement.resume;
						oMeasurement.resume = 0;
					} else if (oMeasurement.pause > 0) {
						// duration already calculated
						oMeasurement.pause = 0;
					} else if (oMeasurement.end >= oMeasurement.start) {
						if (oMeasurement.average) {
							oMeasurement.completeDuration += (oMeasurement.end - oMeasurement.start);
							oMeasurement.count++;
							oMeasurement.duration = oMeasurement.completeDuration / oMeasurement.count;
							oMeasurement.start = iTime;
						} else {
							oMeasurement.duration = oMeasurement.end - oMeasurement.start;
						}
					}
					if (oMeasurement.end >= oMeasurement.start) {
						oMeasurement.time = oMeasurement.end - oMeasurement.start;
					}
				}

				if (oMeasurement) {
					// end timeline entry
					/*eslint-disable no-console */
					if (console.time && oMeasurement) {
						console.timeEnd(oMeasurement.info + " - " + sId);
					}
					/*eslint-enable no-console */
					return this.getMeasurement(sId);
				} else {
					return false;
				}
			};

			/**
			 * Clears all performance measurements
			 *
			 * @name jQuery.sap.measure#clear
			 * @function
			 * @public
			 */
			this._clear = function( ){
				this.mMeasurements = {};
			};

			/**
			 * Removes a performance measure
			 *
			 * @param {string} sId ID of the measurement
			 * @name jQuery.sap.measure#remove
			 * @function
			 * @public
			 */
			this._remove = function( sId ){
				delete this.mMeasurements[sId];
			};
			/**
			 * Adds a performance measurement with all data
			 * This is usefull to add external measurements (e.g. from a backend) to the common measurement UI
			 *
			 * @param {string} sId ID of the measurement
			 * @param {string} sInfo Info for the measurement
			 * @param {int} iStart start timestamp
			 * @param {int} iEnd end timestamp
			 * @param {int} iTime time in milliseconds
			 * @param {int} iDuration effective time in milliseconds
			 * @param {string | string[]} [aCategories = "javascript"] An optional list of categories for the measure
			 * @return {object} [] current measurement containing id, info and start-timestamp, end-timestamp, time, duration, categories (false if error)
			 * @name jQuery.sap.measure#add
			 * @function
			 * @public
			 */
			this._add = function( sId, sInfo, iStart, iEnd, iTime, iDuration, aCategories ){
				if (!bActive) {
					return;
				}
				aCategories = checkCategories(aCategories);
				if (!aCategories) {
					return false;
				}
				var oMeasurement = new Measurement( sId, sInfo, iStart, iEnd, aCategories);
				oMeasurement.time = iTime;
				oMeasurement.duration = iDuration;

				if (oMeasurement) {
					this.mMeasurements[sId] = oMeasurement;
					return this.getMeasurement(oMeasurement.id);
				} else {
					return false;
				}
			};

			/**
			 * Starts an average performance measure.
			 * The duration of this measure is an avarage of durations measured for each call.
			 * Optionally a category or list of categories can be passed to allow filtering of measurements.
			 *
			 * @param {string} sId ID of the measurement
			 * @param {string} sInfo Info for the measurement
			 * @param {string | string[]} [aCategories = "javascript"] An optional list of categories for the measure
			 * @return {object} current measurement containing id, info and start-timestamp (false if error)
			 * @name jQuery.sap.measure#average
			 * @function
			 * @public
			 */
			this._average = function( sId, sInfo, aCategories){
				if (!bActive) {
					return;
				}
				aCategories = checkCategories(aCategories);
				if (!aCategories) {
					return;
				}

				var oMeasurement = this.mMeasurements[sId],
					iTime = jQuery.sap.now();
				if (!oMeasurement || !oMeasurement.average) {
					this.start(sId, sInfo, aCategories);
					oMeasurement = this.mMeasurements[sId];
					oMeasurement.average = true;
				} else {
					if (!oMeasurement.end) {
						oMeasurement.completeDuration += (iTime - oMeasurement.start);
						oMeasurement.count++;
					}
					oMeasurement.start = iTime;
					oMeasurement.end = 0;
				}
				return this.getMeasurement(oMeasurement.id);
			};

			/**
			 * Gets a performance measure
			 *
			 * @param {string} sId ID of the measurement
			 * @return {object} current measurement containing id, info and start-timestamp, end-timestamp, time, duration (false if error)
			 * @name jQuery.sap.measure#getMeasurement
			 * @function
			 * @public
			 */
			this.getMeasurement = function( sId ){

				var oMeasurement = this.mMeasurements[sId];

				if (oMeasurement) {
					return {id: oMeasurement.id,
							info: oMeasurement.info,
							start: oMeasurement.start,
							end: oMeasurement.end,
							pause: oMeasurement.pause,
							resume: oMeasurement.resume,
							time: oMeasurement.time,
							duration: oMeasurement.duration,
							completeDuration: oMeasurement.completeDuration,
							count: oMeasurement.count,
							average: oMeasurement.average,
							categories: oMeasurement.categories};
				} else {
					return false;
				}
			};

			/**
			 * Gets all performance measurements
			 *
			 * @param {boolean} [bCompleted] Whether only completed measurements should be returned, if explicitly set to false only incomplete measurements are returned
			 * @return {object} [] current measurement containing id, info and start-timestamp, end-timestamp, time, duration, categories
			 * @name jQuery.sap.measure#getAllMeasurements
			 * @function
			 * @public
			 */
			this.getAllMeasurements = function(bCompleted){
				return this.filterMeasurements(function(oMeasurement) {
					return oMeasurement;
				}, bCompleted);
			};

			/**
			 * Gets all performance measurements where a provided filter function returns true.
			 * The filter function is called for every measurement and should return the measurement to be added.
			 * If no filter function is provided an empty array is returned.
			 * To filter for certain categories of measurements a fnFilter can be implemented like this
			 * <code>
			 * function(oMeasurement) {
			 *     return oMeasurement.categories.indexOf("rendering") > -1 ? oMeasurement : null
			 * }</code>
			 *
			 * @param {function} fnFilter a filter function that returns true if the passed measurement should be added to the result
			 * @param {boolean} [bCompleted] Whether only completed measurements should be returned, if explicitly set to false only incomplete measurements are returned
			 *
			 * @return {object} [] current measurements containing id, info and start-timestamp, end-timestamp, time, duration, categories (false if error)
			 * @name jQuery.sap.measure#filterMeasurements
			 * @function
			 * @public
			 * @since 1.34.0
		 	 */
			this.filterMeasurements = function(fnFilter, bCompleted) {
				var aMeasurements = [],
					that = this;
				jQuery.each(this.mMeasurements, function(sId){
					var oMeasurement = that.getMeasurement(sId);
					if (fnFilter) {
						var oResult = fnFilter(oMeasurement);
						if (oResult && ((bCompleted === false && oResult.end === 0) || (bCompleted !== false && (!bCompleted || oResult.end)))) {
							aMeasurements.push(oResult);
						}
					}
				});
				return aMeasurements;
			};

			/**
			 * Registers an average measurement for a given objects method
			 *
			 * @param {string} sId the id of the measurement
			 * @param {object} oObject the object of the method
			 * @param {string} sMethod the name of the method
			 * @param {string[]} [aCategories = ["javascript"]] An optional categories list for the measurement
			 *
			 * @returns {boolean} true if the registration was successful
			 * @name jQuery.sap.measure#registerMethod
			 * @function
			 * @public
			 * @since 1.34.0
			 */
			this.registerMethod = function(sId, oObject, sMethod, aCategories) {
				var fnMethod = oObject[sMethod];
				if (fnMethod && typeof fnMethod === "function") {
					var bFound = aAverageMethods.indexOf(fnMethod) > -1;
					if (!bFound) {
						aOriginalMethods.push({func : fnMethod, obj: oObject, method: sMethod, id: sId});
						oObject[sMethod] = function() {
							jQuery.sap.measure.average(sId, sId + " method average", aCategories);
							var result = fnMethod.apply(this, arguments);
							jQuery.sap.measure.end(sId);
							return result;
						};
						aAverageMethods.push(oObject[sMethod]);
						return true;
					}
				} else {
					jQuery.sap.log.debug(sMethod + " in not a function. jQuery.sap.measure.register failed");
				}
				return false;
			};

			/**
			 * Unregisters an average measurement for a given objects method
			 *
			 * @param {string} sId the id of the measurement
			 * @param {object} oObject the object of the method
			 * @param {string} sMethod the name of the method
			 *
			 * @returns {boolean} true if the unregistration was successful
			 * @name jQuery.sap.measure#unregisterMethod
			 * @function
			 * @public
			 * @since 1.34.0
			 */
			this.unregisterMethod = function(sId, oObject, sMethod) {
				var fnFunction = oObject[sMethod],
					iIndex = aAverageMethods.indexOf(fnFunction);
				if (fnFunction && iIndex > -1) {
					oObject[sMethod] = aOriginalMethods[iIndex].func;
					aAverageMethods.splice(iIndex, 1);
					aOriginalMethods.splice(iIndex, 1);
					return true;
				}
				return false;
			};

			/**
			 * Unregisters all average measurements
			 * @name jQuery.sap.measure#unregisterAllMethods
			 * @function
			 * @public
			 * @since 1.34.0
			 */
			this.unregisterAllMethods = function() {
				while (aOriginalMethods.length > 0) {
					var oOrig = aOriginalMethods[0];
					this.unregisterMethod(oOrig.id, oOrig.obj, oOrig.method);
				}
			};

			// ** Interaction measure **
			var aInteractions = [];
			var oPendingInteraction;

			/**
			 * Gets all interaction measurements
			 * @return {object[]} all interaction measurements
			 * @name jQuery.sap.measure#getAllInteractionMeasurements
			 * @function
			 * @public
			 * @since 1.34.0
			 */
			this.getAllInteractionMeasurements = function() {
				return aInteractions;
			};

			/**
			 * Gets the incomplete pending interaction
			 * @return {object} interaction measurement
			 * @name jQuery.sap.measure#getInteractionMeasurement
			 * @function
			 * @private
			 * @since 1.34.0
			 */
			this.getPendingInteractionMeasurement = function() {
				return oPendingInteraction;
			};

			/**
			 * Clears all interaction measurements
			 * @name jQuery.sap.measure#getLastInteractionMeasurement
			 * @function
			 * @public
			 * @since 1.34.0
			 */
			this.clearInteractionMeasurements = function() {
				aInteractions = [];
			};

			function finalizeInteraction(iTime) {
				if (oPendingInteraction) {
					oPendingInteraction.end = iTime;
					oPendingInteraction.duration = oPendingInteraction.processing;
					oPendingInteraction.requests = jQuery.sap.measure.getRequestTimings();
					oPendingInteraction.measurements = jQuery.sap.measure.filterMeasurements(function(oMeasurement) {
						return (oMeasurement.start > oPendingInteraction.start && oMeasurement.end < oPendingInteraction.end) ? oMeasurement : null;
					}, true);
					if (oPendingInteraction.requests.length > 0) {
						// determine Performance API timestamp for latestly completed request
						var iEnd = oPendingInteraction.requests[0].startTime,
							iNavLo = oPendingInteraction.requests[0].startTime,
							iNavHi = oPendingInteraction.requests[0].requestStart,
							iRtLo = oPendingInteraction.requests[0].requestStart,
							iRtHi = oPendingInteraction.requests[0].responseEnd;
						oPendingInteraction.requests.forEach(function(oRequest) {
							iEnd = oRequest.responseEnd > iEnd ? oRequest.responseEnd : iEnd;
							oPendingInteraction.requestTime += (oRequest.responseEnd - oRequest.startTime);
							// summarize navigation and roundtrip with respect to requests overlapping and times w/o requests
							if (iRtHi < oRequest.startTime) {
								oPendingInteraction.navigation += (iNavHi - iNavLo);
								oPendingInteraction.roundtrip += (iRtHi - iRtLo);
								iNavLo =  oRequest.startTime;
								iRtLo =  oRequest.requestStart;
							}
							if (oRequest.responseEnd > iRtHi) {
								iNavHi = oRequest.requestStart;
								iRtHi = oRequest.responseEnd;
							}
						});
						oPendingInteraction.navigation += iNavHi - iNavLo;
						oPendingInteraction.roundtrip += iRtHi - iRtLo;
						// calculate average network time per request
						oPendingInteraction.networkTime = oPendingInteraction.networkTime ? ((oPendingInteraction.requestTime - oPendingInteraction.networkTime) / oPendingInteraction.requests.length) : 0;
						// in case processing is not determined, which means no re-rendering occured, take start to iEnd
						if (oPendingInteraction.duration === 0) {
							oPendingInteraction.duration = oPendingInteraction.navigation + oPendingInteraction.roundtrip;
						}
					}
					// calculate real processing time if any processing took place, cannot be negative as then requests took longer than processing
					if (oPendingInteraction.processing !== 0) {
						var iProcessing = oPendingInteraction.processing - oPendingInteraction.navigation - oPendingInteraction.roundtrip;
						oPendingInteraction.processing = iProcessing > 0 ? iProcessing : 0;
					}
					aInteractions.push(oPendingInteraction);
					jQuery.sap.log.info("Interaction step finished: trigger: " + oPendingInteraction.trigger + "; duration: " + oPendingInteraction.duration + "; requests: " + oPendingInteraction.requests.length);
					oPendingInteraction = null;
				}
			}

			/**
			 * Start an interaction measurements
			 *
			 * @param {string} sType type of the event which triggered the interaction
			 * @param {object} oSrcControl the control on which the interaction was triggered
			 *
			 * @name jQuery.sap.measure#startInteraction
			 * @function
			 * @public
			 * @since 1.34.0
			 */
			this.startInteraction = function(sType, oSrcControl) {
				// component determination - heuristic
				function identifyOwnerComponent(oSrcControl) {
					if (oSrcControl) {
						var Component, oComponent;
						Component = sap.ui.require("sap/ui/core/Component");
						while (Component && oSrcControl && oSrcControl.getParent) {
							oComponent = Component.getOwnerComponentFor(oSrcControl);
							if (oComponent || oSrcControl instanceof Component) {
								oComponent = oComponent || oSrcControl;
								var oApp = oComponent.getMetadata().getManifestEntry("sap.app");
								// get app id or module name for FESR
								return oApp && oApp.id || oComponent.getMetadata().getName();
							}
							oSrcControl = oSrcControl.getParent();
						}
					}
					return "undetermined";
				}

				var iTime = jQuery.sap.now();

				if (oPendingInteraction) {
					finalizeInteraction(iTime);
				}

				// clear request timings for new interaction
				this.clearRequestTimings();

				// setup new pending interaction
				oPendingInteraction = {
					event: sType, // event which triggered interaction
					trigger: oSrcControl && oSrcControl.getId ? oSrcControl.getId() : "undetermined", // control which triggered interaction
					component: identifyOwnerComponent(oSrcControl), // component or app identifier
					start : iTime, // interaction start
					end: 0, // interaction end
					navigation: 0, // sum over all navigation times
					roundtrip: 0, // time from first request sent to last received response end
					processing: 0, // client processing time
					duration: 0, // interaction duration
					requests: [], // Performance API requests during interaction
					measurements: [], // jQuery.sap.measure Measurements
					sapStatistics: [], // SAP Statistics for OData, added by jQuery.sap.trace
					requestTime: 0, // summ over all requests in the interaction (oPendingInteraction.requests[0].responseEnd-oPendingInteraction.requests[0].requestStart)
					networkTime: 0, // request time minus server time from the header, added by jQuery.sap.trace
					bytesSent: 0, // sum over all requests bytes, added by jQuery.sap.trace
					bytesReceived: 0, // sum over all response bytes, added by jQuery.sap.trace
					requestCompression: undefined // true if all responses have been sent gzipped
				};
				jQuery.sap.log.info("Interaction step started: trigger: " + oPendingInteraction.trigger + "; type: " + oPendingInteraction.event);
			};

			/**
			 * End an interaction measurements
			 *
			 * @param {boolean} bForce forces end of interaction now and ignores further re-renderings
			 *
			 * @name jQuery.sap.measure#endInteraction
			 * @function
			 * @public
			 * @since 1.34.0
			 */
			this.endInteraction = function(bForce) {
				if (oPendingInteraction) {
					// set provisionary processing time from start to end and calculate later
					if (!bForce) {
						oPendingInteraction.processing = jQuery.sap.now() - oPendingInteraction.start;
					} else {
						finalizeInteraction(jQuery.sap.now());
					}
				}
			};

			/**
			 * Sets the request buffer size for the interaction measurement
			 *
			 * @param {integer} iSize size of the buffer
			 *
			 * @name jQuery.sap.measure#setRequestBufferSize
			 * @function
			 * @public
			 * @since 1.34.0
			 */
			this.setRequestBufferSize = function(iSize) {
				if (!window.performance) {
					return;
				}
				if (window.performance.setResourceTimingBufferSize){
					window.performance.setResourceTimingBufferSize(iSize);
				} else if (window.performance.webkitSetResourceTimingBufferSize) {
					window.performance.webkitSetResourceTimingBufferSize(iSize);
				}
			};

			/**
			 * Gets the request timings for the interaction measurement
			 *
			 * @return {object[]} iSize size of the buffer
			 * @name jQuery.sap.measure#getRequestTimings
			 * @function
			 * @public
			 * @since 1.34.0
			 */
			this.getRequestTimings = function() {
				if (window.performance && window.performance.getEntriesByType) {
					return jQuery.extend(window.performance.getEntriesByType("resource"),{});
				}
				return [];
			};

			 /**
 			 * Clears all request timings
 			 *
 			 * @name jQuery.sap.measure#clearRequestTimings
 			 * @function
 			 * @public
 			 * @since 1.34.0
 			 */
			this.clearRequestTimings = function() {
				if (!window.performance) {
					return;
				}
				if (window.performance.webkitClearResourceTimings) {
					window.performance.webkitClearResourceTimings();
				} else if (window.performance.clearResourceTimings){
					window.performance.clearResourceTimings();
				}
			};

			this.setRequestBufferSize(1000);

			var aMatch = location.search.match(/sap-ui-measure=([^\&]*)/);
			if (aMatch && aMatch[1]) {
				if (aMatch[1] === "true" || aMatch[1] === "x" || aMatch[1] === "X") {
					this.setActive(true);
				} else {
					this.setActive(true, aMatch[1]);
				}
			} else {
				var fnInactive = function() {
					//measure not active
					return null;
				};
				//deactivate methods implementations
				for (var i = 0; i < aMethods.length; i++) {
					this[aMethods[i]] = fnInactive;
				}
			}
		}

		/**
		 * Namespace for the jQuery performance measurement plug-in provided by SAP SE.
		 *
		 * @namespace
		 * @name jQuery.sap.measure
		 * @public
		 * @static
		 */
		jQuery.sap.measure = new PerfMeasurement();

		/**
		 * A simple assertion mechanism that logs a message when a given condition is not met.
		 *
		 * <b>Note:</b> Calls to this method might be removed when the JavaScript code
		 *              is optimized during build. Therefore, callers should not rely on any side effects
		 *              of this method.
		 *
		 * @param {boolean} bResult result of the checked assertion
		 * @param {string|function} vMessage message that will be raised when the result is <code>false</code>. In case this is a function, the return value of the function will be displayed. This can be used to execute complex code only if the assertion fails.
		 *
		 * @public
		 * @static
		 * @SecSink {1|SECRET} Could expose secret data in logs
		 */
		jQuery.sap.assert = function(bResult, vMessage) {
			if ( !bResult ) {
				var sMessage = typeof vMessage === "function" ? vMessage() : vMessage;
				/*eslint-disable no-console */
				if ( window.console && console.assert ) {
					console.assert(bResult, sWindowName + sMessage);
				} else {
					// console is not always available (IE, FF) and IE doesn't support console.assert
					jQuery.sap.log.debug("[Assertions] " + sMessage);
				}
				/*eslint-enable no-console */
			}
		};

		// against all our rules: use side effect of assert to differentiate between optimized and productive code
		jQuery.sap.assert( !!(mMaxLevel[''] = DEBUG), "will be removed in optimized version");
		// evaluate configuration
		oCfgData.loglevel = (function() {
			var m = /(?:\?|&)sap-ui-log(?:L|-l)evel=([^&]*)/.exec(window.location.search);
			return m && m[1];
		}()) || oCfgData.loglevel;
		if ( oCfgData.loglevel ) {
			jQuery.sap.log.setLevel(jQuery.sap.log.Level[oCfgData.loglevel.toUpperCase()] || parseInt(oCfgData.loglevel,10));
		}

		jQuery.sap.log.info("SAP Logger started.");
		// log early logs
		jQuery.each(_earlyLogs, function(i,e) {
			jQuery.sap.log[e.level](e.message);
		});
		_earlyLogs = null;


	}());

	// ---------------------------------------------------------------------------------------------------

	/**
	 * Returns a new constructor function that creates objects with
	 * the given prototype.
	 *
	 * @param {object} oPrototype
	 * @return {function} the newly created constructor function
	 * @public
	 * @static
	 */
	jQuery.sap.factory = function factory(oPrototype) {
		function Factory() {}
		Factory.prototype = oPrototype;
		return Factory;
	};

	/**
	 * Returns a new object which has the given oPrototype as its prototype.
	 *
	 * If several objects with the same prototype are to be created,
	 * {@link jQuery.sap.factory} should be used instead.
	 *
	 * @param {object} oPrototype
	 * @return {object} new object
	 * @public
	 * @static
	 */
	jQuery.sap.newObject = function newObject(oPrototype) {
		return new (jQuery.sap.factory(oPrototype))();
	};

	/**
	 * Returns a new function that returns the given <code>oValue</code> (using its closure).
	 *
	 * Avoids the need for a dedicated member for the value.
	 *
	 * As closures don't come for free, this function should only be used when polluting
	 * the enclosing object is an absolute "must-not" (as it is the case in public base classes).
	 *
	 * @param {object} oValue
	 *
	 * @public
	 * @static
	 */
	jQuery.sap.getter = function getter(oValue) {
		return function() {
			return oValue;
		};
	};

	/**
	 * Returns a JavaScript object which is identified by a sequence of names.
	 *
	 * A call to <code>getObject("a.b.C")</code> has essentially the same effect
	 * as accessing <code>window.a.b.C</code> but with the difference that missing
	 * intermediate objects (a or b in the example above) don't lead to an exception.
	 *
	 * When the addressed object exists, it is simply returned. If it doesn't exists,
	 * the behavior depends on the value of the second, optional parameter
	 * <code>iNoCreates</code> (assuming 'n' to be the number of names in the name sequence):
	 * <ul>
	 * <li>NaN: if iNoCreates is not a number and the addressed object doesn't exist,
	 *          then <code>getObject()</code> returns <code>undefined</code>.
	 * <li>0 &lt; iNoCreates &lt; n: any non-existing intermediate object is created, except
	 *          the <i>last</i> <code>iNoCreates</code> ones.
	 * </ul>
	 *
	 * Example:
	 * <pre>
	 *   getObject()            -- returns the context object (either param or window)
	 *   getObject("a.b.C")     -- will only try to get a.b.C and return undefined if not found.
	 *   getObject("a.b.C", 0)  -- will create a, b, and C in that order if they don't exists
	 *   getObject("a.b.c", 1)  -- will create a and b, but not C.
	 * </pre>
	 *
	 * When a <code>oContext</code> is given, the search starts in that object.
	 * Otherwise it starts in the <code>window</code> object that this plugin
	 * has been created in.
	 *
	 * Note: Although this method internally uses <code>object["key"]</code> to address object
	 *       properties, it does not support all possible characters in a name.
	 *       Especially the dot ('.') is not supported in the individual name segments,
	 *       as it is always interpreted as a name separator.
	 *
	 * @param {string} sName  a dot separated sequence of names that identify the required object
	 * @param {int}    [iNoCreates=NaN] number of objects (from the right) that should not be created
	 * @param {object} [oContext=window] the context to execute the search in
	 *
	 * @public
	 * @static
	 */
	jQuery.sap.getObject = function getObject(sName, iNoCreates, oContext) {
		var oObject = oContext || _window,
			aNames = (sName || "").split("."),
			l = aNames.length,
			iEndCreate = isNaN(iNoCreates) ? 0 : l - iNoCreates,
			i;

		for (i = 0; oObject && i < l; i++) {
			if (!oObject[aNames[i]] && i < iEndCreate ) {
				oObject[aNames[i]] = {};
			}
			oObject = oObject[aNames[i]];
		}
		return oObject;

	};

	/**
	 * Sets an object property to a given value, where the property is
	 * identified by a sequence of names (path).
	 *
	 * When a <code>oContext</code> is given, the path starts in that object.
	 * Otherwise it starts in the <code>window</code> object that this plugin
	 * has been created for.
	 *
	 * Note: Although this method internally uses <code>object["key"]</code> to address object
	 *       properties, it does not support all possible characters in a name.
	 *       Especially the dot ('.') is not supported in the individual name segments,
	 *       as it is always interpreted as a name separator.
	 *
	 * @param {string} sName  a dot separated sequence of names that identify the property
	 * @param {any}    vValue value to be set, can have any type
	 * @param {object} [oContext=window] the context to execute the search in
	 * @public
	 * @static
	 */
	jQuery.sap.setObject = function (sName, vValue, oContext) {
		var oObject = oContext || _window,
			aNames = (sName || "").split("."),
			l = aNames.length, i;

		if ( l > 0 ) {
			for (i = 0; oObject && i < l - 1; i++) {
				if (!oObject[aNames[i]] ) {
					oObject[aNames[i]] = {};
				}
				oObject = oObject[aNames[i]];
			}
			oObject[aNames[l - 1]] = vValue;
		}
	};

	// ---------------------- sync point -------------------------------------------------------------

	/*
	 * Internal class that can help to synchronize a set of asynchronous tasks.
	 * Each task must be registered in the sync point by calling startTask with
	 * an (purely informative) title. The returned value must be used in a later
	 * call to finishTask.
	 * When finishTask has been called for all tasks that have been started,
	 * the fnCallback will be fired.
	 * When a timeout is given and reached, the callback is called at that
	 * time, no matter whether all tasks have been finished or not.
	 */
	function SyncPoint(sName, fnCallback, iTimeout) {
		var aTasks = [],
			iOpenTasks = 0,
			iFailures = 0,
			sTimer;

		this.startTask = function(sTitle) {
			var iId = aTasks.length;
			aTasks[iId] = { name : sTitle, finished : false };
			iOpenTasks++;
			return iId;
		};

		this.finishTask = function(iId, bSuccess) {
			if ( !aTasks[iId] || aTasks[iId].finished ) {
				throw new Error("trying to finish non existing or already finished task");
			}
			aTasks[iId].finished = true;
			iOpenTasks--;
			if ( bSuccess === false ) {
				iFailures++;
			}
			if ( iOpenTasks === 0 ) {
				jQuery.sap.log.info("Sync point '" + sName + "' finished (tasks:" + aTasks.length + ", open:" + iOpenTasks + ", failures:" + iFailures + ")");
				if ( sTimer ) {
					clearTimeout(sTimer);
					sTimer = null;
				}
				finish();
			}
		};

		function finish() {
			fnCallback && fnCallback(iOpenTasks, iFailures);
			fnCallback = null;
		}

		if ( !isNaN(iTimeout) ) {
			sTimer = setTimeout(function() {
				jQuery.sap.log.info("Sync point '" + sName + "' timed out (tasks:" + aTasks.length + ", open:" + iOpenTasks + ", failures:" + iFailures + ")");
				finish();
			}, iTimeout);
		}

		jQuery.sap.log.info("Sync point '" + sName + "' created" + (iTimeout ? "(timeout after " + iTimeout + " ms)" : ""));

	}

	/**
	 * Internal function to create a sync point.
	 * @private
	 */
	jQuery.sap.syncPoint = function(sName, fnCallback, iTimeout) {
		return new SyncPoint(sName, fnCallback, iTimeout);
	};

	// ---------------------- require/declare --------------------------------------------------------

	var getModuleSystemInfo = (function() {

		/**
		 * Local logger, by default only logging errors. Can be configured to DEBUG via config parameter.
		 * @private
		 */
		var log = jQuery.sap.log.getLogger("sap.ui.ModuleSystem",
				(/sap-ui-xx-debug(M|-m)odule(L|-l)oading=(true|x|X)/.test(location.search) || oCfgData["xx-debugModuleLoading"]) ? jQuery.sap.log.Level.DEBUG : jQuery.sap.log.Level.INFO
			),

		/**
		 * A map of URL prefixes keyed by the corresponding module name prefix.
		 * URL prefix can either be given as string or as object with properties url and final.
		 * When final is set to true, module name prefix cannot be overwritten.
		 * @see jQuery.sap.registerModulePath
		 *
		 * Note that the empty prefix ('') will always match and thus serves as a fallback.
		 * @private
		 */
			mUrlPrefixes = { '' : { 'url' : 'resources/' } },

		/**
		 * Module neither has been required nor preloaded not declared, but someone asked for it.
		 */
			INITIAL = 0,

		/**
		 * Module has been preloaded, but not required or declared
		 */
			PRELOADED = -1,

		/**
		 * Module has been declared.
		 */
			LOADING = 1,

		/**
		 * Module has been loaded, but not yet executed.
		 */
			LOADED = 2,

		/**
		 * Module is currently being executed
		 */
			EXECUTING = 3,

		/**
		 * Module has been loaded and executed without errors.
		 */
			READY = 4,

		/**
		 * Module either could not be loaded or execution threw an error
		 */
			FAILED = 5,

		/**
		 * Set of modules that have been loaded (required) so far.
		 *
		 * Each module is an object that can have the following members
		 * <ul>
		 * <li>{int} state one of the module states defined in this function
		 * <li>{string} url URL where the module has been loaded from
		 * <li>{any} data temp. raw content of the module (between loaded and ready)
		 * <li>{string} error an error description for state <code>FAILED</code>
		 * <li>{any} content the content of the module as exported via define()
		 * </ul>
		 * @private
		 */
			mModules = {
				// predefine already loaded modules to avoid redundant loading
				// "sap/ui/thirdparty/jquery/jquery-1.7.1.js" : { state : READY, url : _sBootstrapUrl, content : jQuery },
				"sap/ui/thirdparty/URI.js" : { state : READY, url : _sBootstrapUrl, content : URI },
				"sap/ui/Device.js" : { state : READY, url : _sBootstrapUrl, content : sap.ui.Device },
				"jquery.sap.global.js" : { state : READY, url : _sBootstrapUrl, content : jQuery }
			},

			mPreloadModules = {},

		/* for future use
		/**
		 * Mapping from default AMD names to UI5 AMD names.
		 *
		 * For simpler usage in requireModule, the names are already converted to
		 * normalized resource names.
		 *
		 * /
			mAMDAliases = {
				'blanket.js': 'sap/ui/thirdparty/blanket.js',
				'crossroads.js': 'sap/ui/thirdparty/crossroads.js',
				'd3.js': 'sap/ui/thirdparty/d3.js',
				'handlebars.js': 'sap/ui/thirdparty/handlebars.js',
				'hasher.js': 'sap/ui/thirdparty/hasher.js',
				'IPv6.js': 'sap/ui/thirdparty/IPv6.js',
				'jquery.js': 'sap/ui/thirdparty/jquery.js',
				'jszip.js': 'sap/ui/thirdparty/jszip.js',
				'less.js': 'sap/ui/thirdparty/less.js',
				'OData.js': 'sap/ui/thirdparty/datajs.js',
				'punycode.js': 'sap/ui/thirdparty/punycode.js',
				'SecondLevelDomains.js': 'sap/ui/thirdparty/SecondLevelDomains.js',
				'sinon.js': 'sap/ui/thirdparty/sinon.js',
				'signals.js': 'sap/ui/thirdparty/signals.js',
				'URI.js': 'sap/ui/thirdparty/URI.js',
				'URITemplate.js': 'sap/ui/thirdparty/URITemplate.js',
				'esprima.js': 'sap/ui/demokit/js/esprima.js'
			},
		*/

		/**
		 * Information about third party modules that are delivered with the sap.ui.core library.
		 *
		 * The information maps the name of the module (including extension '.js') to an info object with the
		 * following properties:
		 *
		 * <ul>
		 * <li>amd:boolean : whether the module uses an AMD loader if present. UI5 will disable the AMD loader while loading
		 *              such modules to force the modules to expose their content via global names.</li>
		 * <li>exports:string[]|string : global name (or names) that are exported by the module. If one ore multiple names are defined,
		 *              the first one will be read from the global object and will be used as value of the module.</li>
		 * <li>deps:string[] : list of modules that the module depends on. The modules will be loaded first before loading the module itself.</li>
		 * </ul>
		 * to be able to work with jQuery.sap.require no matter whether an AMD loader is present or not.
		 *
		 * Note: this is a map for future extension
		 * Note: should be maintained together with raw-module info in .library files
		 * @private
		 */
			mAMDShim = {
				'sap/ui/thirdparty/blanket.js': {
					amd: true,
					exports: 'blanket' // '_blanket', 'esprima', 'falafel', 'inBrowser', 'parseAndModify'
				},
				'sap/ui/thirdparty/caja-html-sanitizer.js': {
					amd: false,
					exports: 'html' // 'html_sanitizer', 'html4'
				},
				'sap/ui/thirdparty/crossroads.js': {
					amd: true,
					exports: 'crossroads',
					deps: ['sap/ui/thirdparty/signals.js']
				},
				'sap/ui/thirdparty/d3.js': {
					amd: true,
					exports: 'd3'
				},
				'sap/ui/thirdparty/datajs.js': {
					amd: true,
					exports: 'OData' // 'datajs'
				},
				'sap/ui/thirdparty/es6-promise.js' : {
					amd: true,
					exports: 'ES6Promise'
				},
				'sap/ui/thirdparty/flexie.js': {
					exports: 'Flexie'
				},
				'sap/ui/thirdparty/handlebars.js': {
					amd: true,
					exports: 'Handlebars'
				},
				'sap/ui/thirdparty/hasher.js': {
					amd: true,
					exports: 'hasher',
					deps: ['sap/ui/thirdparty/signals.js']
				},
				'sap/ui/thirdparty/IPv6.js': {
					amd: true,
					exports: 'IPv6'
				},
				'sap/ui/thirdparty/iscroll-lite.js': {
					exports: 'iScroll'
				},
				'sap/ui/thirdparty/iscroll.js': {
					exports: 'iScroll'
				},
				'sap/ui/thirdparty/jquery.js': {
					amd: true
				},
				'sap/ui/thirdparty/jquery/jquery-1.11.1.js': {
					amd: true
				},
				'sap/ui/thirdparty/jquery/jquery-1.10.2.js': {
					amd: true
				},
				'sap/ui/thirdparty/jquery/jquery-1.10.1.js': {
					amd: true
				},
				'sap/ui/thirdparty/jquery/jquery.1.7.1.js': {
					amd: true
				},
				'sap/ui/thirdparty/jquery/jquery.1.8.1.js': {
					amd: true
				},
				'sap/ui/thirdparty/jquery-mobile-custom.js': {
					amd: true,
					exports: 'jQuery.mobile'
				},
				'sap/ui/thirdparty/jszip.js': {
					amd: true,
					exports: 'JSZip'
				},
				'sap/ui/thirdparty/less.js': {
					amd: true,
					exports: 'less'
				},
				'sap/ui/thirdparty/mobify-carousel.js': {
					exports: 'Mobify' // or Mobify.UI.Carousel?
				},
				'sap/ui/thirdparty/punycode.js': {
					amd: true,
					exports: 'punycode'
				},
				'sap/ui/thirdparty/require.js': {
					exports: 'define' // 'require', 'requirejs'
				},
				'sap/ui/thirdparty/SecondLevelDomains.js': {
					amd: true,
					exports: 'SecondLevelDomains'
				},
				'sap/ui/thirdparty/signals.js': {
					amd: true,
					exports: 'signals'
				},
				'sap/ui/thirdparty/sinon.js': {
					amd: true,
					exports: 'sinon'
				},
				'sap/ui/thirdparty/sinon-server.js': {
					amd: true,
					exports: 'sinon' // really sinon! sinon-server is a subset of server and uses the same global for export
				},
				'sap/ui/thirdparty/unorm.js': {
					exports: 'UNorm'
				},
				'sap/ui/thirdparty/unormdata.js': {
					exports: 'UNorm', // really 'UNorm'! module extends UNorm
					deps: ['sap/ui/thirdparty/unorm.js']
				},
				'sap/ui/thirdparty/URI.js' : {
					amd: true,
					exports: 'URI'
				},
				'sap/ui/thirdparty/URITemplate.js' : {
					amd: true,
					exports: 'URITemplate',
					deps: ['sap/ui/thirdparty/URI.js']
				},
				'sap/ui/thirdparty/vkbeautify.js' : {
					exports: 'vkbeautify'
				},
				'sap/ui/thirdparty/zyngascroll.js' : {
					exports: 'Scroller' // 'requestAnimationFrame', 'cancelRequestAnimationFrame', 'core'
				},
				'sap/ui/demokit/js/esprima.js' : {
					amd: true,
					exports: 'esprima'
				}
			},

		/**
		 * Stack of modules that are currently executed.
		 *
		 * Allows to identify the containing module in case of multi module files (e.g. sap-ui-core)
		 * @private
		 */
			_execStack = [ ],

		/**
		 * A prefix that will be added to module loading log statements and which reflects the nesting of module executions.
		 * @private
		 */
			sLogPrefix = "",

		// max size a script should have when executing it with execScript (IE). Otherwise fallback to eval
			MAX_EXEC_SCRIPT_LENGTH = 512 * 1024,

			sDocumentLocation = document.location.href.replace(/\?.*|#.*/g, ""),

			FRAGMENT = "fragment",
			VIEW = "view",
			mKnownSubtypes = {
				js :  [VIEW, FRAGMENT, "controller", "designtime"],
				xml:  [VIEW, FRAGMENT],
				json: [VIEW, FRAGMENT],
				html: [VIEW, FRAGMENT]
			},

			rJSSubtypes = new RegExp("(\\.(?:" + mKnownSubtypes.js.join("|") + "))?\\.js$"),
			rTypes,
			rSubTypes;

		(function() {
			var s = "",
				sSub = "";

			jQuery.each(mKnownSubtypes, function(sType, aSubtypes) {
				s = (s ? s + "|" : "") + sType;
				sSub = (sSub ? sSub + "|" : "") + "(?:(?:" + aSubtypes.join("\\.|") + "\\.)?" + sType + ")";
			});
			s = "\\.(" + s + ")$";
			sSub = "\\.(?:" + sSub + "|[^./]+)$";
			log.debug("constructed regexp for file types :" + s);
			log.debug("constructed regexp for file sub-types :" + sSub);
			rTypes = new RegExp(s);
			rSubTypes = new RegExp(sSub);
		}());

		/**
		 * Name conversion function that converts a name in UI5 module name syntax to a name in requireJS module name syntax.
		 * @private
		 */
		function ui5ToRJS(sName) {
			if ( /^sap\.ui\.thirdparty\.jquery\.jquery-/.test(sName) ) {
				return "sap/ui/thirdparty/jquery/jquery-" + sName.slice("sap.ui.thirdparty.jquery.jquery-".length);
			} else if ( /^jquery\.sap\./.test(sName) ) {
				return sName;
			}
			return sName.replace(/\./g, "/");
		}

		/**
		 * Name conversion function that converts a name in unified resource name syntax to a name in UI5 module name syntax.
		 * If the name cannot be converted (e.g. doesn't end with '.js'), then <code>undefined</code> is returned.
		 *
		 * @private
		 */
		function urnToUI5(sName) {
			// UI5 module name syntax is only defined for JS resources
			if ( !/\.js$/.test(sName) ) {
				return;
			}

			sName = sName.slice(0, -3);
			if ( /^sap\/ui\/thirdparty\/jquery\/jquery-/.test(sName) ) {
				return "sap.ui.thirdparty.jquery.jquery-" + sName.slice("sap/ui/thirdparty/jquery/jquery-".length);
			} else if ( /^jquery\.sap\./.test(sName) ) {
				return sName; // do nothing
			}
			return sName.replace(/\//g, ".");
		}

		// find longest matching prefix for resource name
		function getResourcePath(sResourceName, sSuffix) {

			// split name into segments
			var aSegments = sResourceName.split(/\//),
				l, sNamePrefix, sResult, m;

			// if no suffix was given and if the name is not empty, try to guess the suffix from the last segment
			if ( arguments.length === 1  &&  aSegments.length > 0 ) {
				// only known types (and their known subtypes) are accepted
				m = rSubTypes.exec(aSegments[aSegments.length - 1]);
				if ( m ) {
					sSuffix = m[0];
					aSegments[aSegments.length - 1] = aSegments[aSegments.length - 1].slice(0, m.index);
				} else {
					sSuffix = "";
				}
			}

			// search for a defined name prefix, starting with the full name and successively removing one segment
			for (l = aSegments.length; l >= 0; l--) {
				sNamePrefix = aSegments.slice(0, l).join('/');
				if ( mUrlPrefixes[sNamePrefix] ) {
					sResult = mUrlPrefixes[sNamePrefix].url;
					if ( l < aSegments.length ) {
						sResult += aSegments.slice(l).join('/');
					}
					if ( sResult.slice(-1) === '/' ) {
						sResult = sResult.slice(0, -1);
					}
					return sResult + (sSuffix || '');
				}
			}

			jQuery.sap.assert(false, "should never happen");
		}

		function guessResourceName(sURL) {
			var sNamePrefix,
				sUrlPrefix,
				sResourceName;

			for (sNamePrefix in mUrlPrefixes) {
				if ( mUrlPrefixes.hasOwnProperty(sNamePrefix) ) {

					// Note: configured URL prefixes are guaranteed to end with a '/'
					// But to support the legacy scenario promoted by the application tools ( "registerModulePath('Application','Application')" )
					// the prefix check here has to be done without the slash
					sUrlPrefix = mUrlPrefixes[sNamePrefix].url.slice(0, -1);

					if ( sURL.indexOf(sUrlPrefix) === 0 ) {

						// calc resource name
						sResourceName = sNamePrefix + sURL.slice(sUrlPrefix.length);
						// remove a leading '/' (occurs if name prefix is empty and if match was a full segment match
						if ( sResourceName.charAt(0) === '/' ) {
							sResourceName = sResourceName.slice(1);
						}

						if ( mModules[sResourceName] && mModules[sResourceName].data ) {
							return sResourceName;
						}
					}
				}
			}

			// return undefined;
		}

		var rDotsAnywhere = /(?:^|\/)\.+/;
		var rDotSegment = /^\.*$/;

		/**
		 * Resolves relative module names that contain <code>./</code> or <code>../</code> segments to absolute names.
		 * E.g.: A name <code>../common/validation.js</code> defined in <code>sap/myapp/controller/mycontroller.controller.js</code>
		 * may resolve to <code>sap/myapp/common/validation.js</code>.
		 *
		 * When sBaseName is <code>null</code>, relative names are not allowed (e.g. for a <code>sap.ui.require</code> call)
		 * and their usage results in an error being thrown.
		 *
		 * @param {string|null} sBaseName name of a reference module
		 * @param {string} sModuleName the name to resolve
		 * @returns {string} resolved name
		 * @private
		 */
		function resolveModuleName(sBaseName, sModuleName) {

			var m = rDotsAnywhere.exec(sModuleName),
				aSegments,
				sSegment,
				i,j,l;

			// check whether the name needs to be resolved at all - if not, just return the sModuleName as it is.
			if ( !m ) {
				return sModuleName;
			}

			// if the name starts with a relative segments then there must be a base name (a global sap.ui.require doesn't support relative names)
			if ( m.index === 0 && sBaseName == null ) {
				throw new Error("relative name not supported ('" + sModuleName + "'");
			}

			// if relative name starts with a dot segment, then prefix it with the base path
			aSegments = (m.index === 0 ? sBaseName + sModuleName : sModuleName).split('/');

			// process path segments
			for (i = 0, j = 0, l = aSegments.length; i < l; i++) {

				var sSegment = aSegments[i];

				if ( rDotSegment.test(sSegment) ) {
					if (sSegment === '.' || sSegment === '') {
						// ignore '.' as it's just a pointer to current package. ignore '' as it results from double slashes (ignored by browsers as well)
						continue;
					} else if (sSegment === '..') {
						// move to parent directory
						if ( j === 0 ) {
							throw new Error("Can't navigate to parent of root (base='" + sBaseName + "', name='" + sModuleName + "'");//  sBaseNamegetPackagePath(), relativePath));
						}
						j--;
					} else {
						throw new Error("illegal path segment '" + sSegment + "'");
					}
				} else {

					aSegments[j++] = sSegment;

				}

			}

			aSegments.length = j;

			return aSegments.join('/');
		}

		function declareModule(sModuleName) {
			var oModule;

			// sModuleName must be a unified resource name of type .js
			jQuery.sap.assert(/\.js$/.test(sModuleName), "must be a Javascript module");

			oModule = mModules[sModuleName] || (mModules[sModuleName] = { state : INITIAL });

			if ( oModule.state > INITIAL ) {
				return oModule;
			}

			if ( log.isLoggable() ) {
				log.debug(sLogPrefix + "declare module '" + sModuleName + "'");
			}

			// avoid cycles
			oModule.state = READY;

			// the first call to declareModule is assumed to identify the bootstrap module
			// Note: this is only a guess and fails e.g. when multiple modules are loaded via a script tag
			// to make it safe, we could convert 'declare' calls to e.g. 'subdeclare' calls at build time.
			if ( _execStack.length === 0 ) {
				_execStack.push(sModuleName);
				oModule.url = oModule.url || _sBootstrapUrl;
			}

			return oModule;
		}

		function requireModule(sModuleName) {

			// TODO enable when preload has been adapted:
			// sModuleName = mAMDAliases[sModuleName] || sModuleName;

			var m = rJSSubtypes.exec(sModuleName),
				oShim = mAMDShim[sModuleName],
				sBaseName, sType, oModule, aExtensions, i;

			// only for robustness, should not be possible by design (all callers append '.js')
			if ( !m ) {
				log.error("can only require Javascript module, not " + sModuleName);
				return;
			}

			if ( oShim && oShim.deps ) {
				if ( log.isLoggable() ) {
					log.debug("require dependencies of raw module " + sModuleName);
				}
				for (i = 0; i < oShim.deps.length; i++) {
					if ( log.isLoggable() ) {
						log.debug("  require " + oShim.deps[i]);
					}
					requireModule(oShim.deps[i]);
				}
			}

			// in case of having a type specified ignore the type for the module path creation and add it as file extension
			sBaseName = sModuleName.slice(0, m.index);
			sType = m[0]; // must be a normalized resource name of type .js sType can be empty or one of view|controller|fragment

			oModule = mModules[sModuleName] || (mModules[sModuleName] = { state : INITIAL });

			if ( log.isLoggable() ) {
				log.debug(sLogPrefix + "require '" + sModuleName + "' of type '" + sType + "'");
			}

			// check if module has been loaded already
			if ( oModule.state !== INITIAL ) {
				if ( oModule.state === PRELOADED ) {
					oModule.state = LOADED;
					execModule(sModuleName);
				}

				if ( oModule.state === READY ) {
					if ( log.isLoggable() ) {
						log.debug(sLogPrefix + "module '" + sModuleName + "' has already been loaded (skipped).");
					}
					return this;
				} else if ( oModule.state === FAILED ) {
					throw new Error("found in negative cache: '" + sModuleName +  "' from " + oModule.url + ": " + oModule.error);
				} else {
					// currently loading
					return this;
				}
			}

			// set marker for loading modules (to break cycles)
			oModule.state = LOADING;

			// if debug is enabled, try to load debug module first
			aExtensions = window["sap-ui-loaddbg"] ? ["-dbg", ""] : [""];
			for (i = 0; i < aExtensions.length && oModule.state !== LOADED; i++) {
				// create module URL for the current extension
				oModule.url = getResourcePath(sBaseName, aExtensions[i] + sType);
				if ( log.isLoggable() ) {
					log.debug(sLogPrefix + "loading " + (aExtensions[i] ? aExtensions[i] + " version of " : "") + "'" + sModuleName + "' from '" + oModule.url + "'");
				}
				/*eslint-disable no-loop-func */
				jQuery.ajax({
					url : oModule.url,
					dataType : 'text',
					async : false,
					success : function(response, textStatus, xhr) {
						oModule.state = LOADED;
						oModule.data = response;
					},
					error : function(xhr, textStatus, error) {
						oModule.state = FAILED;
						oModule.error = xhr ? xhr.status + " - " + xhr.statusText : textStatus;
					}
				});
				/*eslint-enable no-loop-func */
			}

			// execute module __after__ loading it, this reduces the required stack space!
			if ( oModule.state === LOADED ) {
				execModule(sModuleName);
			}

			if ( oModule.state !== READY ) {
				throw new Error("failed to load '" + sModuleName +  "' from " + oModule.url + ": " + oModule.error);
			}

		}

		// sModuleName must be a normalized resource name of type .js
		function execModule(sModuleName) {

			var oModule = mModules[sModuleName],
				oShim = mAMDShim[sModuleName],
				sOldPrefix, sScript, vAMD;

			if ( oModule && oModule.state === LOADED && typeof oModule.data !== "undefined" ) {

				// check whether the module is known to use an existing AMD loader, remember the AMD flag
				vAMD = (oShim === true || (oShim && oShim.amd)) && typeof window.define === "function" && window.define.amd;

				try {

					if ( vAMD ) {
						// temp. remove the AMD Flag from the loader
						delete window.define.amd;
					}

					if ( log.isLoggable() ) {
						log.debug(sLogPrefix + "executing '" + sModuleName + "'");
						sOldPrefix = sLogPrefix;
						sLogPrefix = sLogPrefix + ": ";
					}

					// execute the script in the window context
					oModule.state = EXECUTING;
					_execStack.push(sModuleName);
					if ( typeof oModule.data === "function" ) {
						oModule.data.call(window);
					} else if ( jQuery.isArray(oModule.data) ) {
						sap.ui.define.apply(sap.ui, oModule.data);
					} else {

						sScript = oModule.data;

						// sourceURL: Firebug, Chrome, Safari and IE11 debugging help, appending the string seems to cost ZERO performance
						// Note: IE11 supports sourceURL even when running in IE9 or IE10 mode
						// Note: make URL absolute so Chrome displays the file tree correctly
						// Note: do not append if there is already a sourceURL / sourceMappingURL
						if (sScript && !sScript.match(/\/\/[#@] source(Mapping)?URL=.*$/)) {
							sScript += "\n//# sourceURL=" + URI(oModule.url).absoluteTo(sDocumentLocation);
						}

						// framework internal hook to intercept the loaded script and modify
						// it before executing the script - e.g. useful for client side coverage
						if (typeof jQuery.sap.require._hook === "function") {
							sScript = jQuery.sap.require._hook(sScript, sModuleName);
						}

						if (_window.execScript && (!oModule.data || oModule.data.length < MAX_EXEC_SCRIPT_LENGTH) ) {
							try {
								oModule.data && _window.execScript(sScript); // execScript fails if data is empty
							} catch (e) {
								_execStack.pop();
								// eval again with different approach - should fail with a more informative exception
								jQuery.sap.globalEval(oModule.data);
								throw e; // rethrow err in case globalEval succeeded unexpectedly
							}
						} else {
							_window.eval(sScript);
						}
					}
					_execStack.pop();
					oModule.state = READY;
					oModule.data = undefined;
					// best guess for raw and legacy modules that don't use sap.ui.define
					oModule.content = oModule.content || jQuery.sap.getObject((oShim && oShim.exports) || urnToUI5(sModuleName));

					if ( log.isLoggable() ) {
						sLogPrefix = sOldPrefix;
						log.debug(sLogPrefix + "finished executing '" + sModuleName + "'");
					}

				} catch (err) {
					oModule.state = FAILED;
					oModule.error = ((err.toString && err.toString()) || err.message) + (err.line ? "(line " + err.line + ")" : "" );
					oModule.data = undefined;
					if ( window["sap-ui-debug"] && (/sap-ui-xx-show(L|-l)oad(E|-e)rrors=(true|x|X)/.test(location.search) || oCfgData["xx-showloaderrors"]) ) {
						log.error("error while evaluating " + sModuleName + ", embedding again via script tag to enforce a stack trace (see below)");
						jQuery.sap.includeScript(oModule.url);
						return;
					}

				} finally {

					// restore AMD flag
					if ( vAMD ) {
						window.define.amd = vAMD;
					}
				}
			}
		}

		function requireAll(sBaseName, aDependencies, fnCallback) {

			var aModules = [],
				i, sDepModName;

			for (i = 0; i < aDependencies.length; i++) {
				sDepModName = resolveModuleName(sBaseName, aDependencies[i]);
				log.debug(sLogPrefix + "require '" + sDepModName + "'");
				requireModule(sDepModName + ".js");
				// best guess for legacy modules that don't use sap.ui.define
				// TODO implement fallback for raw modules
				aModules[i] = mModules[sDepModName + ".js"].content || jQuery.sap.getObject(urnToUI5(sDepModName + ".js"));
				log.debug(sLogPrefix + "require '" + sDepModName + "': done.");
			}

			fnCallback(aModules);
		}

		/**
		 * Constructs an URL to load the module with the given name and file type (suffix).
		 *
		 * Searches the longest prefix of the given module name for which a registration
		 * exists (see {@link jQuery.sap.registerModulePath}) and replaces that prefix
		 * by the registered URL prefix.
		 *
		 * The remainder of the module name is appended to the URL, replacing any dot with a slash.
		 *
		 * Finally, the given suffix (typically a file name extension) is added (unconverted).
		 *
		 * The returned name (without the suffix) doesn't end with a slash.
		 *
		 * @param {string} sModuleName module name to detemrine the path for
		 * @param {string} sSuffix suffix to be added to the resulting path
		 * @return {string} calculated path (URL) to the given module
		 *
		 * @public
		 * @static
		 */
		jQuery.sap.getModulePath = function(sModuleName, sSuffix) {
			return getResourcePath(ui5ToRJS(sModuleName), sSuffix);
		};

		/**
		 * Determines the URL for a resource given its unified resource name.
		 *
		 * Searches the longest prefix of the given resource name for which a registration
		 * exists (see {@link jQuery.sap.registerResourcePath}) and replaces that prefix
		 * by the registered URL prefix.
		 *
		 * The remainder of the resource name is appended to the URL.
		 *
		 * <b>Unified Resource Names</b>
		 * Several UI5 APIs use <i>Unified Resource Names (URNs)</i> as naming scheme for resources that
		 * they deal with (e.h. Javascript, CSS, JSON, XML, ...). URNs are similar to the path
		 * component of an URL:
		 * <ul>
		 * <li>they consist of a non-empty sequence of name segments</li>
		 * <li>segments are separated by a forward slash '/'</li>
		 * <li>name segments consist of URL path segment characters only. It is recommened to use only ASCII
		 * letters (upper or lower case), digits and the special characters '$', '_', '-', '.')</li>
		 * <li>the empty name segment is not supported</li>
		 * <li>names consisting of dots only, are reserved and must not be used for resources</li>
		 * <li>names are case sensitive although the underlying server might be case-insensitive</li>
		 * <li>the behavior with regard to URL encoded characters is not specified, %ddd notation should be avoided</li>
		 * <li>the meaning of a leading slash is undefined, but might be defined in future. It therefore should be avoided</li>
		 * </ul>
		 *
		 * UI5 APIs that only deal with Javascript resources, use a slight variation of this scheme,
		 * where the extension '.js' is always omitted (see {@link sap.ui.define}, {@link sap.ui.require}).
		 *
		 *
		 * <b>Relationship to old Module Name Syntax</b>
		 *
		 * Older UI5 APIs that deal with resources (like {@link jQuery.sap.registerModulePath},
		 * {@link jQuery.sap.require} and {@link jQuery.sap.declare}) used a dot-separated naming scheme
		 * (called 'module names') which was motivated by object names in the global namespace in
		 * Javascript.
		 *
		 * The new URN scheme better matches the names of the corresponding resources (files) as stored
		 * in a server and the dot ('.') is no longer a forbidden character in a resource name. This finally
		 * allows to handle resources with different types (extensions) with the same API, not only JS files.
		 *
		 * Last but not least does the URN scheme better match the naming conventions used by AMD loaders
		 * (like <code>requireJS</code>).
		 *
		 * @param {string} sResourceName unified resource name of the resource
		 * @returns {string} URL to load the resource from
		 * @public
		 * @experimental Since 1.27.0
		 * @function
		 */
		jQuery.sap.getResourcePath = getResourcePath;

		/**
		 * Registers an URL prefix for a module name prefix.
		 *
		 * Before a module is loaded, the longest registered prefix of its module name
		 * is searched for and the associated URL prefix is used as a prefix for the request URL.
		 * The remainder of the module name is attached to the request URL by replacing
		 * dots ('.') with slashes ('/').
		 *
		 * The registration and search operates on full name segments only. So when a prefix
		 *
		 *    'sap.com'  ->  'http://www.sap.com/ui5/resources/'
		 *
		 * is registered, then it will match the name
		 *
		 *    'sap.com.Button'
		 *
		 * but not
		 *
		 *    'sap.commons.Button'
		 *
		 * Note that the empty prefix ('') will always match and thus serves as a fallback for
		 * any search.
		 *
		 * The prefix can either be given as string or as object which contains the url and a 'final' property.
		 * If 'final' is set to true, overwriting a module prefix is not possible anymore.
		 *
		 * @param {string} sModuleName module name to register a path for
		 * @param {string | object} vUrlPrefix path prefix to register, either a string literal or an object (e.g. {url : 'url/to/res', 'final': true})
		 * @param {string} [vUrlPrefix.url] path prefix to register
		 * @param {boolean} [vUrlPrefix.final] flag to avoid overwriting the url path prefix for the given module name at a later point of time
		 *
		 * @public
		 * @static
		 * @SecSink {1|PATH} Parameter is used for future HTTP requests
		 */
		jQuery.sap.registerModulePath = function registerModulePath(sModuleName, vUrlPrefix) {
			jQuery.sap.assert(!/\//.test(sModuleName), "module path must not contain a slash.");
			sModuleName = sModuleName.replace(/\./g, "/");
			// URL must not be empty
			vUrlPrefix = vUrlPrefix || '.';
			jQuery.sap.registerResourcePath(sModuleName, vUrlPrefix);
		};

		/**
		 * Registers an URL prefix for a resource name prefix.
		 *
		 * Before a resource is loaded, the longest registered prefix of its unified resource name
		 * is searched for and the associated URL prefix is used as a prefix for the request URL.
		 * The remainder of the resource name is attached to the request URL 1:1.
		 *
		 * The registration and search operates on full name segments only. So when a prefix
		 *
		 *    'sap/com'  ->  'http://www.sap.com/ui5/resources/'
		 *
		 * is registered, then it will match the name
		 *
		 *    'sap/com/Button'
		 *
		 * but not
		 *
		 *    'sap/commons/Button'
		 *
		 * Note that the empty prefix ('') will always match and thus serves as a fallback for
		 * any search.
		 *
		 * The url prefix can either be given as string or as object which contains the url and a final flag.
		 * If final is set to true, overwriting a resource name prefix is not possible anymore.
		 *
		 * @param {string} sResourceNamePrefix in unified resource name syntax
		 * @param {string | object} vUrlPrefix prefix to use instead of the sResourceNamePrefix, either a string literal or an object (e.g. {url : 'url/to/res', 'final': true})
		 * @param {string} [vUrlPrefix.url] path prefix to register
		 * @param {boolean} [vUrlPrefix.final] flag to avoid overwriting the url path prefix for the given module name at a later point of time
		 *
		 * @public
		 * @static
		 * @SecSink {1|PATH} Parameter is used for future HTTP requests
		 */
		jQuery.sap.registerResourcePath = function registerResourcePath(sResourceNamePrefix, vUrlPrefix) {

			sResourceNamePrefix = String(sResourceNamePrefix || "");

			if (mUrlPrefixes[sResourceNamePrefix] && mUrlPrefixes[sResourceNamePrefix]["final"] == true) {
				log.warning( "registerResourcePath with prefix " + sResourceNamePrefix + " already set as final to '" + mUrlPrefixes[sResourceNamePrefix].url + "'. This call is ignored." );
				return;
			}

			if ( typeof vUrlPrefix === 'string' || vUrlPrefix instanceof String ) {
				vUrlPrefix = { 'url' : vUrlPrefix };
			}

			if ( !vUrlPrefix || vUrlPrefix.url == null ) {
				delete mUrlPrefixes[sResourceNamePrefix];
				log.info("registerResourcePath ('" + sResourceNamePrefix + "') (registration removed)");
			} else {
				vUrlPrefix.url = String(vUrlPrefix.url);

				// remove query parameters
				var iQueryIndex = vUrlPrefix.url.indexOf("?");
				if (iQueryIndex !== -1) {
					vUrlPrefix.url = vUrlPrefix.url.substr(0, iQueryIndex);
				}

				// remove hash
				var iHashIndex = vUrlPrefix.url.indexOf("#");
				if (iHashIndex !== -1) {
					vUrlPrefix.url = vUrlPrefix.url.substr(0, iHashIndex);
				}

				// ensure that the prefix ends with a '/'
				if ( vUrlPrefix.url.slice(-1) != '/' ) {
					vUrlPrefix.url += '/';
				}
				mUrlPrefixes[sResourceNamePrefix] = vUrlPrefix;
				log.info("registerResourcePath ('" + sResourceNamePrefix + "', '" + vUrlPrefix.url + "')" + ((vUrlPrefix['final']) ? " (final)" : ""));
			}
		};

		/**
		 * Check whether a given module has been loaded / declared already.
		 *
		 * Returns true as soon as a module has been required the first time, even when
		 * loading/executing it has not finished yet. So the main assertion of a
		 * return value of <code>true</code> is that the necessary actions have been taken
		 * to make the module available in the near future. It does not mean, that
		 * the content of the module is already available!
		 *
		 * This fuzzy behavior is necessary to avoid multiple requests for the same module.
		 * As a consequence of the assertion above, a <i>preloaded</i> module does not
		 * count as <i>declared</i>. For preloaded modules, an explicit call to
		 * <code>jQuery.sap.require</code> is necessary to make them available.
		 *
		 * If a caller wants to know whether a module needs to be loaded from the server,
		 * it can set <code>bIncludePreloaded</code> to true. Then, preloaded modules will
		 * be reported as 'declared' as well by this method.
		 *
		 * @param {string} sModuleName name of the module to be checked
		 * @param {boolean} [bIncludePreloaded=false] whether preloaded modules should be reported as declared.
		 * @return {boolean} whether the module has been declared already
		 * @public
		 * @static
		 */
		jQuery.sap.isDeclared = function isDeclared(sModuleName, bIncludePreloaded) {
			sModuleName = ui5ToRJS(sModuleName) + ".js";
			return mModules[sModuleName] && (bIncludePreloaded || mModules[sModuleName].state !== PRELOADED);
		};

		/**
		 * Returns the names of all declared modules.
		 * @return {string[]} the names of all declared modules
		 * @see jQuery.sap.isDeclared
		 * @public
		 * @static
		 */
		jQuery.sap.getAllDeclaredModules = function() {
			var aModules = [];
			jQuery.each(mModules, function(sURN, oModule) {
				// filter out preloaded modules
				if ( oModule && oModule.state !== PRELOADED ) {
					var sModuleName = urnToUI5(sURN);
					if ( sModuleName ) {
						aModules.push(sModuleName);
					}
				}
			});
			return aModules;
		};

		// take resource roots from configuration
		if ( oCfgData.resourceroots ) {
			jQuery.each(oCfgData.resourceroots, jQuery.sap.registerModulePath);
		}

		// dump the URL prefixes
		log.info("URL prefixes set to:");
		for (var n in mUrlPrefixes) {
			log.info("  " + (n ? "'" + n + "'" : "(default)") + " : " + mUrlPrefixes[n].url + ((mUrlPrefixes[n]['final']) ? " (final)" : "") );
		}

		/**
		 * Declares a module as existing.
		 *
		 * By default, this function assumes that the module will create a JavaScript object
		 * with the same name as the module. As a convenience it ensures that the parent
		 * namespace for that object exists (by calling jQuery.sap.getObject).
		 * If such an object creation is not desired, <code>bCreateNamespace</code> must be set to false.
		 *
		 * @param {string | object}  sModuleName name of the module to be declared
		 *                           or in case of an object {modName: "...", type: "..."}
		 *                           where modName is the name of the module and the type
		 *                           could be a specific dot separated extension e.g.
		 *                           <code>{modName: "sap.ui.core.Dev", type: "view"}</code>
		 *                           loads <code>sap/ui/core/Dev.view.js</code> and
		 *                           registers as <code>sap.ui.core.Dev.view</code>
		 * @param {boolean} [bCreateNamespace=true] whether to create the parent namespace
		 *
		 * @public
		 * @static
		 */
		jQuery.sap.declare = function(sModuleName, bCreateNamespace) {

			var sNamespaceObj = sModuleName;

			// check for an object as parameter for sModuleName
			// in case of this the object contains the module name and the type
			// which could be {modName: "sap.ui.core.Dev", type: "view"}
			if (typeof (sModuleName) === "object") {
				sNamespaceObj = sModuleName.modName;
				sModuleName = ui5ToRJS(sModuleName.modName) + (sModuleName.type ? "." + sModuleName.type : "") + ".js";
			} else {
				sModuleName = ui5ToRJS(sModuleName) + ".js";
			}

			declareModule(sModuleName);

			// ensure parent namespace even if module was declared already
			// (as declare might have been called by require)
			if (bCreateNamespace !== false) {
				// ensure parent namespace
				jQuery.sap.getObject(sNamespaceObj, 1);
			}

			return this;
		};

		/**
		 * Ensures that the given module is loaded and executed before execution of the
		 * current script continues.
		 *
		 * By issuing a call to this method, the caller declares a dependency to the listed modules.
		 *
		 * Any required and not yet loaded script will be loaded and execute synchronously.
		 * Already loaded modules will be skipped.
		 *
		 * @param {...string | object}  vModuleName one or more names of modules to be loaded
		 *                              or in case of an object {modName: "...", type: "..."}
		 *                              where modName is the name of the module and the type
		 *                              could be a specific dot separated extension e.g.
		 *                              <code>{modName: "sap.ui.core.Dev", type: "view"}</code>
		 *                              loads <code>sap/ui/core/Dev.view.js</code> and
		 *                              registers as <code>sap.ui.core.Dev.view</code>
		 *
		 * @public
		 * @static
		 * @function
		 * @SecSink {0|PATH} Parameter is used for future HTTP requests
		 */
		jQuery.sap.require = function(vModuleName, fnCallback) {

			if ( arguments.length > 1 ) {
				// legacy mode with multiple arguments, each representing a dependency
				for (var i = 0; i < arguments.length; i++) {
					jQuery.sap.require(arguments[i]);
				}
				return this;
			}

			// check for an object as parameter for sModuleName
			// in case of this the object contains the module name and the type
			// which could be {modName: "sap.ui.core.Dev", type: "view"}
			if (typeof (vModuleName) === "object") {
				jQuery.sap.assert(!vModuleName.type || jQuery.inArray(vModuleName.type, mKnownSubtypes.js) >= 0, "type must be empty or one of " + mKnownSubtypes.js.join(", "));
				vModuleName = ui5ToRJS(vModuleName.modName) + (vModuleName.type ? "." + vModuleName.type : "") + ".js";
			} else {
				vModuleName = ui5ToRJS(vModuleName) + ".js";
			}

			jQuery.sap.measure.start(vModuleName,"Require module " + vModuleName, ["require"]);
			requireModule(vModuleName);
			jQuery.sap.measure.end(vModuleName);

			return this; // TODO
		};

		/**
		 * UI5 internal method that loads the given module, specified in requireJS notation (URL like, without extension).
		 *
		 * Applications MUST NOT USE THIS METHOD as it will be removed in one of the future versions.
		 * It is only intended for sap.ui.component.
		 *
		 * @param {string} sModuleName Module name in requireJS syntax
		 * @private
		 */
		jQuery.sap._requirePath = function(sModuleName) {
			requireModule(sModuleName + ".js");
		};

		window.sap = window.sap || {};
		sap.ui = sap.ui || {};

		/**
		 * Defines a Javascript module with its name, its dependencies and a module value or factory.
		 *
		 * The typical and only suggested usage of this method is to have one single, top level call to
		 * <code>sap.ui.define</code> in one Javascript resource (file). When a module is requested by its
		 * name for the first time, the corresponding resource is determined from the name and the current
		 * {@link jQuery.sap.registerResourcePath configuration}. The resource will be loaded and executed
		 * which in turn will execute the top level <code>sap.ui.define</code> call.
		 *
		 * If the module name was omitted from that call, it will be substituted by the name that was used to
		 * request the module. As a preparation step, the dependencies as well as their transitive dependencies,
		 * will be loaded. Then, the module value will be determined: if a static value (object, literal) was
		 * given, that value will be the module value. If a function was given, that function will be called
		 * (providing the module values of the declared dependencies as parameters to the function) and its
		 * return value will be used as module value. The framework internally associates the resulting value
		 * with the module name and provides it to the original requestor of the module. Whenever the module
		 * is requested again, the same value will be returned (modules are executed only once).
		 *
		 * <i>Example:</i><br>
		 * The following example defines a module "SomeClass", but doesn't hard code the module name.
		 * If stored in a file 'sap/mylib/SomeClass.js', it can be requested as 'sap/mylib/SomeClass'.
		 * <pre>
		 *   sap.ui.define(['./Helper', 'sap/m/Bar'], function(Helper,Bar) {
		 *
		 *     // create a new class
		 *     var SomeClass = function();
		 *
		 *     // add methods to its prototype
		 *     SomeClass.prototype.foo = function() {
		 *
		 *         // use a function from the dependency 'Helper' in the same package (e.g. 'sap/mylib/Helper' )
		 *         var mSettings = Helper.foo();
		 *
		 *         // create and return a sap.m.Bar (using its local name 'Bar')
		 *         return new Bar(mSettings);
		 *
		 *     }
		 *
		 *     // return the class as module value
		 *     return SomeClass;
		 *
		 *   });
		 * </pre>
		 *
		 * In another module or in an application HTML page, the {@link sap.ui.require} API can be used
		 * to load the Something module and to work with it:
		 *
		 * <pre>
		 * sap.ui.require(['sap/mylib/Something'], function(Something) {
		 *
		 *   // instantiate a Something and call foo() on it
		 *   new Something().foo();
		 *
		 * });
		 * </pre>
		 *
		 * <b>Module Name Syntax</b><br>
		 * <code>sap.ui.define</code> uses a simplified variant of the {@link jQuery.sap.getResourcePath
		 * unified resource name} syntax for the module's own name as well as for its dependencies.
		 * The only difference to that syntax is, that for <code>sap.ui.define</code> and
		 * <code>sap.ui.require</code>, the extension (which always would be '.js') has to be omitted.
		 * Both methods always add this extension internally.
		 *
		 * As a convenience, the name of a dependency can start with the segment './' which will be
		 * replaced by the name of the package that contains the currently defined module (relative name).
		 *
		 * It is best practice to omit the name of the defined module (first parameter) and to use
		 * relative names for the dependencies whenever possible. This reduces the necessary configuration,
		 * simplifies renaming of packages and allows to map them to a different namespace.
		 *
		 *
		 * <b>Dependency to Modules</b><br>
		 * If a dependencies array is given, each entry represents the name of another module that
		 * the currently defined module depends on. All dependency modules are loaded before the value
		 * of the currently defined module is determined. The module value of each dependency module
		 * will be provided as a parameter to a factory function, the order of the parameters will match
		 * the order of the modules in the dependencies array.
		 *
		 * <b>Note:</b> the order in which the dependency modules are <i>executed</i> is <b>not</b>
		 * defined by the order in the dependencies array! The execution order is affected by dependencies
		 * <i>between</i> the dependency modules as well as by their current state (whether a module
		 * already has been loaded or not). Neither module implementations nor dependants that require
		 * a module set must make any assumption about the execution order (other than expressed by
		 * their dependencies). There is, however, one exception with regard to third party libraries,
		 * see the list of limitations further down below.
		 *
		 * <b>Note:</b>a static module value (a literal provided to <code>sap.ui.define</code>) cannot
		 * depend on the module values of the depency modules. Instead, modules can use a factory function,
		 * calculate the static value in that function, potentially based on the dependencies, and return
		 * the result as module value. The same approach must be taken when the module value is supposed
		 * to be a function.
		 *
		 *
		 * <b>Asynchronous Contract</b><br>
		 * <code>sap.ui.define</code> is designed to support real Asynchronous Module Definitions (AMD)
		 * in future, although it internally still uses the the old synchronous module loading of UI5.
		 * Callers of <code>sap.ui.define</code> therefore must not rely on any synchronous behavior
		 * that they might observe with the current implementation.
		 *
		 * For example, callers of <code>sap.ui.define</code> must not use the module value immediately
		 * after invoking <code>sap.ui.define</code>:
		 *
		 * <pre>
		 *   // COUNTER EXAMPLE HOW __NOT__ TO DO IT
		 *
		 *   // define a class Something as AMD module
		 *   sap.ui.define('Something', [], function() {
		 *     var Something = function();
		 *     return Something;
		 *   });
		 *
		 *   // DON'T DO THAT!
		 *   // accessing the class _synchronously_ after sap.ui.define was called
		 *   new Something();
		 * </pre>
		 *
		 * Applications that need to ensure synchronous module definition or synchronous loading of dependencies
		 * <b>MUST</b> use the old {@link jQuery.sap.declare} and {@link jQuery.sap.require} APIs.
		 *
		 *
		 * <b>(No) Global References</b><br>
		 * To be in line with AMD best practices, modules defined with <code>sap.ui.define</code>
		 * should not make any use of global variables if those variables are also available as module
		 * values. Instead, they should add dependencies to those modules and use the corresponding parameter
		 * of the factory function to access the module value.
		 *
		 * As the current programming model and the documentation of UI5 heavily rely on global names,
		 * there will be a transition phase where UI5 enables AMD modules and local references to module
		 * values in parallel to the old global names. The fourth parameter of <code>sap.ui.define</code>
		 * has been added to support that transition phase. When this parameter is set to true, the framework
		 * provides two additional functionalities
		 *
		 * <ol>
		 * <li>before the factory function is called, the existence of the global parent namespace for
		 *     the current module is ensured</li>
		 * <li>the module value will be automatically exported under a global name which is derived from
		 *     the name of the module</li>
		 * </ol>
		 *
		 * The parameter lets the framework know whether any of those two operations is needed or not.
		 * In future versions of UI5, a central configuration option is planned to suppress those 'exports'.
		 *
		 *
		 * <b>Third Party Modules</b><br>
		 * Although third party modules don't use UI5 APIs, they still can be listed as dependencies in
		 * a <code>sap.ui.define</code> call. They will be requested and executed like UI5 modules, but their
		 * module value will be <code>undefined</code>.
		 *
		 * If the currently defined module needs to access the module value of such a third party module,
		 * it can access the value via its global name (if the module supports such a usage).
		 *
		 * Note that UI5 temporarily deactivates an existing AMD loader while it executes third party modules
		 * known to support AMD. This sounds contradictarily at a first glance as UI5 wants to support AMD,
		 * but for now it is necessary to fully support UI5 apps that rely on global names for such modules.
		 *
		 * Example:
		 * <pre>
		 *   // module 'Something' wants to use third party library 'URI.js'
		 *   // It is packaged by UI5 as non-UI5-module 'sap/ui/thirdparty/URI'
		 *
		 *   sap.ui.define('Something', ['sap/ui/thirdparty/URI'], function(URIModuleValue) {
		 *
		 *     new URIModuleValue(); // fails as module value is undefined
		 *
		 *     //global URI // (optional) declare usage of global name so that static code checks don't complain
		 *     new URI(); // access to global name 'URI' works
		 *
		 *     ...
		 *   });
		 * </pre>
		 *
		 *
		 * <b>Differences to requireJS</b><br>
		 * The current implementation of <code>sap.ui.define</code> differs from <code>requireJS</code>
		 * or other AMD loaders in several aspects:
		 * <ul>
		 * <li>the name <code>sap.ui.define</code> is different from the plain <code>define</code>.
		 * This has two reasons: first, it avoids the impression that <code>sap.ui.define</code> is
		 * an exact implementation of an AMD loader. And second, it allows the coexistence of an AMD
		 * loader (requireJS) and <code>sap.ui.define</code> in one application as long as UI5 or
		 * apps using UI5 are not fully prepared to run with an AMD loader</li>
		 * <li><code>sap.ui.define</code> currently loads modules with synchronous XHR calls. This is
		 * basically a tribute to the synchronous history of UI5.
		 * <b>BUT:</b> synchronous dependency loading and factory execution explicitly it not part of
		 * contract of <code>sap.ui.define</code>. To the contrary, it is already clear and planned
		 * that asynchronous loading will be implemented, at least as an alternative if not as the only
		 * implementation. Also check section <b>Asynchronous Contract</b> above.<br>
		 * Applications that need to ensure synchronous loading of dependencies <b>MUST</b> use the old
		 * {@link jQuery.sap.require} API.</li>
		 * <li><code>sap.ui.define</code> does not support plugins to use other file types, formats or
		 * protocols. It is not planned to support this in future</li>
		 * <li><code>sap.ui.define</code> does <b>not</b> support the 'sugar' of requireJS where CommonJS
		 * style dependency declarations using <code>sap.ui.require("something")</code> are automagically
		 * converted into <code>sap.ui.define</code> dependencies before executing the factory function.</li>
		 * </ul>
		 *
		 *
		 * <b>Limitations, Design Considerations</b><br>
		 * <ul>
		 * <li><b>Limitation</b>: as dependency management is not supported for Non-UI5 modules, the only way
		 *     to ensure proper execution order for such modules currently is to rely on the order in the
		 *     dependency array. Obviously, this only works as long as <code>sap.ui.define</code> uses
		 *     synchronous loading. It will be enhanced when asynchronous loading is implemented.</li>
		 * <li>it was discussed to enfore asynchronous execution of the module factory function (e.g. with a
		 *     timeout of 0). But this would have invalidated the current migration scenario where a
		 *     sync <code>jQuery.sap.require</code> call can load a <code>sap.ui.define</code>'ed module.
		 *     If the module definition would not execute synchronously, the synchronous contract of the
		 *     require call would be broken (default behavior in existing UI5 apps)</li>
		 * <li>a single file must not contain multiple calls to <code>sap.ui.define</code>. Multiple calls
		 *     currently are only supported in the so called 'preload' files that the UI5 merge tooling produces.
		 *     The exact details of how this works might be changed in future implementations and are not
		 *     yet part of the API contract</li>
		 * </ul>
		 * @param {string} [sModuleName] name of the module in simplified resource name syntax.
		 *        When omitted, the loader determines the name from the request.
		 * @param {string[]} [aDependencies] list of dependencies of the module
		 * @param {function|any} vFactory the module value or a function that calculates the value
		 * @param {boolean} [bExport] whether an export to global names is required - should be used by SAP-owned code only
		 * @since 1.27.0
		 * @public
		 * @experimental Since 1.27.0 - not all aspects of sap.ui.define are settled yet. If the documented
		 *        constraints and limitations are obeyed, SAP-owned code might use it. If the fourth parameter
		 *        is not used and if the asynchronous contract is respected, even Non-SAP code might use it.
		 */
		sap.ui.define = function(sModuleName, aDependencies, vFactory, bExport) {
			var sResourceName, sBaseName;

			// optional id
			if ( typeof sModuleName === 'string' ) {
				sResourceName = sModuleName + '.js';
			} else {
				// shift parameters
				bExport = vFactory;
				vFactory = aDependencies;
				aDependencies = sModuleName;
				sResourceName = _execStack[_execStack.length - 1];
			}

			// convert module name to UI5 module name syntax (might fail!)
			sModuleName = urnToUI5(sResourceName);

			// calculate the base name for relative module names
			sBaseName = sResourceName.slice(0, sResourceName.lastIndexOf('/') + 1);

			// optional array of dependencies
			if ( !jQuery.isArray(aDependencies) ) {
				// shift parameters
				bExport = vFactory;
				vFactory = aDependencies;
				aDependencies = [];
			}

			if ( log.isLoggable() ) {
				log.debug("define(" + sResourceName + ", " + "['" + aDependencies.join("','") + "']" + ")");
			}

			var oModule = declareModule(sResourceName);

			// Note: dependencies will be resolved and converted from RJS to URN inside requireAll
			requireAll(sBaseName, aDependencies, function(aModules) {

				// factory
				if ( log.isLoggable() ) {
					log.debug("define(" + sResourceName + "): calling factory " + typeof vFactory);
				}

				if ( bExport ) {
					// ensure parent namespace
					var sPackage = sResourceName.split('/').slice(0,-1).join('.');
					if ( sPackage ) {
						jQuery.sap.getObject(sPackage, 0);
					}
				}

				if ( typeof vFactory === 'function' ) {
					oModule.content = vFactory.apply(window, aModules);
				} else {
					oModule.content = vFactory;
				}

				// HACK: global export
				if ( bExport ) {
					if ( oModule.content == null ) {
						log.error("module '" + sResourceName + "' returned no content, but should be exported");
					} else {
						if ( log.isLoggable() ) {
							log.debug("exporting content of '" + sResourceName + "': as global object");
						}
						jQuery.sap.setObject(sModuleName, oModule.content);
					}
				}

			});

		};

		/**
		 * @private
		 */
		sap.ui.predefine = function(sModuleName, aDependencies, vFactory, bExport) {

			if ( typeof sModuleName !== 'string' ) {
				throw new Error("sap.ui.predefine requires a module name");
			}

			var sResourceName = sModuleName + '.js';
			var oModule = mModules[sResourceName];
			if ( !oModule ) {
				mModules[sResourceName] = { state : PRELOADED, url : "TODO???/" + sModuleName, data : [sModuleName, aDependencies, vFactory, bExport], group: null };
			}

			// when a library file is preloaded, also mark its preload file as loaded
			// for normal library preload, this is redundant, but for non-default merged entities
			// like sap/fiori/core.js it avoids redundant loading of library preload files
			if ( sResourceName.match(/\/library\.js$/) ) {
				mPreloadModules[urnToUI5(sResourceName) + "-preload"] = true;
			}

		};

		/**
		 * Resolves one or more module dependencies.
		 *
		 * <b>Synchronous Retrieval of a Single Module Value</b>
		 *
		 * When called with a single string, that string is assumed to be the name of an already loaded
		 * module and the value of that module is returned. If the module has not been loaded yet,
		 * or if it is a Non-UI5 module (e.g. third party module), <code>undefined</code> is returned.
		 * This signature variant allows synchronous access to module values without initiating module loading.
		 *
		 * Sample:
		 * <pre>
		 *   var JSONModel = sap.ui.require("sap/ui/model/json/JSONModel");
 		 * </pre>
 		 *
 		 * For modules that are known to be UI5 modules, this signature variant can be used to check whether
 		 * the module has been loaded.
 		 *
		 * <b>Asynchronous Loading of Multiple Modules</b>
		 *
		 * If an array of strings is given and (optionally) a callback function, then the strings
		 * are interpreted as module names and the corresponding modules (and their transitive
		 * dependencies) are loaded. Then the callback function will be called asynchronously.
		 * The module values of the specified modules will be provided as parameters to the callback
		 * function in the same order in which they appeared in the dependencies array.
		 *
		 * The return value for the asynchronous use case is <code>undefined</code>.
		 *
		 * <pre>
		 *   sap.ui.require(['sap/ui/model/json/JSONModel', 'sap/ui/core/UIComponent'], function(JSONModel,UIComponent) {
		 *
		 *     var MyComponent = UIComponent.extend('MyComponent', {
		 *       ...
		 *     });
		 *     ...
		 *
		 *   });
 		 * </pre>
 		 *
		 * This method uses the same variation of the {@link jQuery.sap.getResourcePath unified resource name}
		 * syntax that {@link sap.ui.define} uses: module names are specified without the implicit extension '.js'.
		 * Relative module names are not supported.
		 *
		 * @param {string|string[]} vDependencies dependency (dependencies) to resolve
		 * @param {function} [fnCallback] callback function to execute after resolving an array of dependencies
		 * @returns {any|undefined} a single module value or undefined
		 * @public
		 * @experimental Since 1.27.0 - not all aspects of sap.ui.require are settled yet. E.g. the return value
		 * of the asynchronous use case might change (currently it is undefined).
		 */
		sap.ui.require = function(vDependencies, fnCallback) {
			jQuery.sap.assert(typeof vDependencies === 'string' || jQuery.isArray(vDependencies), "dependency param either must be a single string or an array of strings");
			jQuery.sap.assert(fnCallback == null || typeof fnCallback === 'function', "callback must be a function or null/undefined");

			if ( typeof vDependencies === 'string' ) {

				var sModuleName = vDependencies + '.js',
					oModule = mModules[sModuleName];

				return oModule ? (oModule.content || jQuery.sap.getObject(urnToUI5(sModuleName))) : undefined;

			}

			requireAll(null, vDependencies, function(aModules) {

				if ( typeof fnCallback === 'function' ) {
					// enforce asynchronous execution of callback
					setTimeout(function() {
						fnCallback.apply(window, aModules);
					},0);
				}

			});

			// return undefined;
		};

		jQuery.sap.preloadModules = function(sPreloadModule, bAsync, oSyncPoint) {

			var sURL, iTask;

			jQuery.sap.assert(!bAsync || oSyncPoint, "if mode is async, a syncpoint object must be given");

			if ( mPreloadModules[sPreloadModule] ) {
				return;
			}

			mPreloadModules[sPreloadModule] = true;

			sURL = jQuery.sap.getModulePath(sPreloadModule, ".json");

			log.debug("preload file " + sPreloadModule);
			iTask = oSyncPoint && oSyncPoint.startTask("load " + sPreloadModule);
			jQuery.ajax({
				dataType : "json",
				async : bAsync,
				url : sURL,
				success : function(data) {
					if ( data ) {
						data.url = sURL;
					}
					jQuery.sap.registerPreloadedModules(data, bAsync, oSyncPoint);
					oSyncPoint && oSyncPoint.finishTask(iTask);
				},
				error : function(xhr, textStatus, error) {
					log.error("failed to preload '" + sPreloadModule + "': " + (error || textStatus));
					oSyncPoint && oSyncPoint.finishTask(iTask, false);
				}
			});

		};

		jQuery.sap.registerPreloadedModules = function(oData, bAsync, oSyncPoint) {

			var bOldSyntax = Version(oData.version || "1.0").compareTo("2.0") < 0;

			if ( log.isLoggable() ) {
				log.debug(sLogPrefix + "adding preloaded modules from '" + oData.url + "'");
			}

			if ( oData.name ) {
				mPreloadModules[oData.name] = true;
			}

			jQuery.each(oData.modules, function(sName,sContent) {
				sName = bOldSyntax ? ui5ToRJS(sName) + ".js" : sName;
				if ( !mModules[sName] ) {
					mModules[sName] = { state : PRELOADED, url : oData.url + "/" + sName, data : sContent, group: oData.name };
				}
				// when a library file is preloaded, also mark its preload file as loaded
				// for normal library preload, this is redundant, but for non-default merged entities
				// like sap/fiori/core.js it avoids redundant loading of library preload files
				if ( sName.match(/\/library\.js$/) ) {
					mPreloadModules[urnToUI5(sName) + "-preload"] = true;
				}
			});

			if ( oData.dependencies ) {
				jQuery.each(oData.dependencies, function(idx,sModuleName) {
					jQuery.sap.preloadModules(sModuleName, bAsync, oSyncPoint);
				});
			}
		};

		/**
		 * Removes a set of resources from the resource cache.
		 *
		 * @param {string} sName unified resource name of a resource or the name of a preload group to be removed
		 * @param {boolean} [bPreloadGroup=true] whether the name specifies a preload group, defaults to true
		 * @param {boolean} [bUnloadAll] Whether all matching resources should be unloaded, even if they have been executed already.
		 * @param {boolean} [bDeleteExports] Whether exportss (global variables) should be destroyed as well. Will be done for UI5 module names only.
		 * @experimental Since 1.16.3 API might change completely, apps must not develop against it.
		 * @private
		 */
		jQuery.sap.unloadResources = function(sName, bPreloadGroup, bUnloadAll, bDeleteExports) {
			var aModules = [];

			if ( bPreloadGroup == null ) {
				bPreloadGroup = true;
			}

			if ( bPreloadGroup ) {
				// collect modules that belong to the given group
				jQuery.each(mModules, function(sURN, oModule) {
					if ( oModule && oModule.group === sName ) {
						aModules.push(sURN);
					}
				});
				// also remove a preload entry
				delete mPreloadModules[sName];

			} else {
				// single module
				if ( mModules[sName] ) {
					aModules.push(sName);
				}
			}

			jQuery.each(aModules, function(i, sURN) {
				var oModule = mModules[sURN];
				if ( oModule && bDeleteExports && sURN.match(/\.js$/) ) {
					jQuery.sap.setObject(urnToUI5(sURN), undefined); // TODO really delete property
				}
				if ( oModule && (bUnloadAll || oModule.state === PRELOADED) ) {
				  delete mModules[sURN];
				}
			});

		};

		/**
		 * Converts a UI5 module name to a unified resource name.
		 *
		 * Used by View and Fragment APIs to convert a given module name into an URN.
		 *
		 * @experimental Since 1.16.0, not for public usage yet.
		 * @private
		 */
		jQuery.sap.getResourceName = function(sModuleName, sSuffix) {
			return ui5ToRJS(sModuleName) + (sSuffix || ".js");
		};

		/**
		 * Retrieves the resource with the given name, either from the preload cache or from
		 * the server. The expected data type of the resource can either be specified in the
		 * options (<code>dataType</code>) or it will be derived from the suffix of the <code>sResourceName</code>.
		 * The only supported data types so far are xml, html, json and text. If the resource name extension
		 * doesn't match any of these extensions, the data type must be specified in the options.
		 *
		 * If the resource is found in the preload cache, it will be converted from text format
		 * to the requested <code>dataType</code> using a converter from <code>jQuery.ajaxSettings.converters</code>.
		 *
		 * If it is not found, the resource name will be converted to a resource URL (using {@link #getResourcePath})
		 * and the resulting URL will be requested from the server with a synchronous jQuery.ajax call.
		 *
		 * If the resource was found in the local preload cache and any necessary conversion succeeded
		 * or when the resource was retrieved from the backend successfully, the content of the resource will
		 * be returned. In any other case, an exception will be thrown, or if option failOnError is set to true,
		 * <code>null</code> will be returned.
		 *
		 * Future implementations of this API might add more options. Generic implementations that accept an
		 * <code>mOptions</code> object and propagate it to this function should limit the options to the currently
		 * defined set of options or they might fail for unknown options.
		 *
		 * For asynchronous calls the return value of this method is an ECMA Script 6 Promise object which callbacks are triggered
		 * when the resource is ready:
		 * If <code>failOnError</code> is <code>false</code> the catch callback of the promise is not called. The argument given to the fullfilled
		 * callback is null in error case.
		 * If <code>failOnError</code> is <code>true</code> the catch callback will be triggered. The argument is an Error object in this case.
		 *
		 * @param {string} [sResourceName] resourceName in unified resource name syntax
		 * @param {object} [mOptions] options
		 * @param {object} [mOptions.dataType] one of "xml", "html", "json" or "text". If not specified it will be derived from the resource name (extension)
		 * @param {string} [mOptions.name] unified resource name of the resource to load (alternative syntax)
		 * @param {string} [mOptions.url] url of a resource to load (alternative syntax, name will only be a guess)
		 * @param {string} [mOptions.headers] Http headers for an eventual XHR request
		 * @param {string} [mOptions.failOnError=true] whether to propagate load errors or not
		 * @param {string} [mOptions.async=false] whether the loading should be performed asynchronously.
		 * @return {string|Document|object|Promise} content of the resource. A string for text or html, an Object for JSON, a Document for XML. For asynchronous calls an ECMA Script 6 Promise object will be returned.
		 * @throws Error if loading the resource failed
		 * @private
		 * @experimental API is not yet fully mature and may change in future.
		 * @since 1.15.1
		 */
		jQuery.sap.loadResource = function(sResourceName, mOptions) {

			var sType,
				oData,
				sUrl,
				oError,
				oDeferred;

			if ( typeof sResourceName === "string" ) {
				mOptions = mOptions || {};
			} else {
				mOptions = sResourceName || {};
				sResourceName = mOptions.name;
				if ( !sResourceName && mOptions.url) {
					sResourceName = guessResourceName(mOptions.url);
				}
			}
			// defaulting
			mOptions = jQuery.extend({ failOnError: true, async: false }, mOptions);

			sType = mOptions.dataType;
			if ( sType == null && sResourceName ) {
				sType = (sType = rTypes.exec(sResourceName)) && sType[1];
			}

			jQuery.sap.assert(/^(xml|html|json|text)$/.test(sType), "type must be one of xml, html, json or text");

			oDeferred = mOptions.async ? new jQuery.Deferred() : null;

			function handleData(d, e) {
				if ( d == null && mOptions.failOnError ) {
					oError = e || new Error("no data returned for " + sResourceName);
					if (mOptions.async) {
						oDeferred.reject(oError);
						jQuery.sap.log.error(oError);
					}
					return null;
				}

				if (mOptions.async) {
					oDeferred.resolve(d);
				}

				return d;
			}

			function convertData(d) {
				var vConverter = jQuery.ajaxSettings.converters["text " + sType];
				if ( typeof vConverter === "function" ) {
					d = vConverter(d);
				}
				return handleData(d);
			}

			if ( sResourceName && mModules[sResourceName] ) {
				oData = mModules[sResourceName].data;
				mModules[sResourceName].state = LOADED;
			}

			if ( oData != null ) {

				if (mOptions.async) {
					//Use timeout to simulate async behavior for this sync case for easier usage
					setTimeout(function(){
						convertData(oData);
					}, 0);
				} else {
					oData = convertData(oData);
				}

			} else {

				jQuery.ajax({
					url : sUrl = mOptions.url || getResourcePath(sResourceName),
					async : mOptions.async,
					dataType : sType,
					headers: mOptions.headers,
					success : function(data, textStatus, xhr) {
						oData = handleData(data);
					},
					error : function(xhr, textStatus, error) {
						oError = new Error("resource " + sResourceName + " could not be loaded from " + sUrl + ". Check for 'file not found' or parse errors. Reason: " + error);
						oError.status = textStatus;
						oError.error = error;
						oError.statusCode = xhr.status;
						oData = handleData(null, oError);
					}
				});

			}

			if ( mOptions.async ) {
				return Promise.resolve(oDeferred);
			}

			if ( oError != null && mOptions.failOnError ) {
				throw oError;
			}

			return oData;
		};

		/*
		 * register a global event handler to detect script execution errors.
		 * Only works for browsers that support document.currentScript.
		 * /
		window.addEventListener("error", function(e) {
			if ( document.currentScript && document.currentScript.dataset.sapUiModule ) {
				var error = {
					message: e.message,
					filename: e.filename,
					lineno: e.lineno,
					colno: e.colno
				};
				document.currentScript.dataset.sapUiModuleError = JSON.stringify(error);
			}
		});
		*/

		/**
		 * Loads the given Javascript resource (URN) asynchronously via as script tag.
		 * Returns a promise that will be resolved when the load event is fired or reject
		 * when the error event is fired.
		 *
		 * Note: execution errors of the script are not reported as 'error'.
		 *
		 * This method is not a full implementation of require. It is intended only for
		 * loading "preload" files that do not define an own module / module value.
		 *
		 * Functionality might be removed/renamed in future, so no code outside the
		 * sap.ui.core library must use it.
		 *
		 * @experimental
		 * @private
		 */
		jQuery.sap._loadJSResourceAsync = function(sResource, bIgnoreErrors) {

			return new Promise(function(resolve,reject) {

				var oModule = mModules[sResource] || (mModules[sResource] = { state : INITIAL });
				var sUrl = oModule.url = getResourcePath(sResource);
				oModule.state = LOADING;

				var oScript = window.document.createElement('SCRIPT');
				oScript.src = sUrl;
				oScript.setAttribute("data-sap-ui-module", sResource); // IE9/10 don't support dataset :-(
				// oScript.setAttribute("data-sap-ui-module-error", '');
				oScript.addEventListener('load', function(e) {
					jQuery.sap.log.info("Javascript resource loaded: " + sResource);
// TODO either find a cross-browser solution to detect and assign execution errros or document behavior
//					var error = e.target.dataset.sapUiModuleError;
//					if ( error ) {
//						oModule.state = FAILED;
//						oModule.error = JSON.parse(error);
//						jQuery.sap.log.error("failed to load Javascript resource: " + sResource + ":" + error);
//						reject(oModule.error);
//					}
					oModule.state = READY;
					// TODO oModule.data = ?
					resolve();
				});
				oScript.addEventListener('error', function(e) {
					jQuery.sap.log.error("failed to load Javascript resource: " + sResource);
					oModule.state = FAILED;
					// TODO oModule.error = xhr ? xhr.status + " - " + xhr.statusText : textStatus;
					if ( bIgnoreErrors ) {
						resolve();
					} else {
						reject();
					}
				});
				appendHead(oScript);
			});

		};

		return function() {

			//remove final information in mUrlPrefixes
			var mFlatUrlPrefixes = {};
				jQuery.each(mUrlPrefixes, function(sKey,oUrlPrefix) {
				mFlatUrlPrefixes[sKey] = oUrlPrefix.url;
			});


			return { modules : mModules, prefixes : mFlatUrlPrefixes };
		};

	}());

	// --------------------- script and stylesheet handling --------------------------------------------------

	// appends a link object to the head
	function appendHead(oElement) {
		var head = window.document.getElementsByTagName("head")[0];
		if (head) {
			head.appendChild(oElement);
		}
	}

	/**
	 * Includes the script (via &lt;script&gt;-tag) into the head for the
	 * specified <code>sUrl</code> and optional <code>sId</code>.
	 * <br>
	 * <i>In case of IE8 only the load callback will work ignoring in case of success and error.</i>
	 *
	 * @param {string}
	 *            sUrl the URL of the script to load
	 * @param {string}
	 *            [sId] id that should be used for the script include tag
	 * @param {function}
	 *            [fnLoadCallback] callback function to get notified once the script has been loaded
	 * @param {function}
	 *            [fnErrorCallback] callback function to get notified once the script loading failed (not supported by IE8)
	 *
	 * @public
	 * @static
	 * @SecSink {0|PATH} Parameter is used for future HTTP requests
	 */
	jQuery.sap.includeScript = function includeScript(sUrl, sId, fnLoadCallback, fnErrorCallback){
		var oScript = window.document.createElement("script");
		oScript.src = sUrl;
		oScript.type = "text/javascript";
		if (sId) {
			oScript.id = sId;
		}
		if (!!sap.ui.Device.browser.internet_explorer && sap.ui.Device.browser.version < 9) {
			// in case if IE8 the error callback is not supported!
			// we can only check the loading via the readystatechange event
			if (fnLoadCallback) {
				oScript.onreadystatechange = function() {
					if (oScript.readyState === "loaded" || oScript.readyState === "complete") {
						fnLoadCallback();
						oScript.onreadystatechange = null;
					}
				};
			}
		} else {
			if (fnLoadCallback) {
				jQuery(oScript).load(fnLoadCallback);
			}
			if (fnErrorCallback) {
				jQuery(oScript).error(fnErrorCallback);
			}
		}
		// jQuery("head").append(oScript) doesn't work because they filter for the script
		// and execute them directly instead adding the SCRIPT tag to the head
		var oOld;
		if ((sId && (oOld = jQuery.sap.domById(sId)) && oOld.tagName === "SCRIPT")) {
			jQuery(oOld).remove(); // replacing scripts will not trigger the load event
		}
		appendHead(oScript);
	};

	var oIEStyleSheetNode;
	var mIEStyleSheets = jQuery.sap._mIEStyleSheets = {};

	/**
	 * Includes the specified stylesheet via a &lt;link&gt;-tag in the head of the current document. If there is call to
	 * <code>includeStylesheet</code> providing the sId of an already included stylesheet, the existing element will be
	 * replaced.
	 *
	 * @param {string}
	 *          sUrl the URL of the script to load
	 * @param {string}
	 *          [sId] id that should be used for the script include tag
	 * @param {function}
	 *          [fnLoadCallback] callback function to get notified once the link has been loaded
	 * @param {function}
	 *          [fnErrorCallback] callback function to get notified once the link loading failed.
	 *          In case of usage in IE the error callback will also be executed if an empty stylesheet
	 *          is loaded. This is the only option how to determine in IE if the load was successful
	 *          or not since the native onerror callback for link elements doesn't work in IE. The IE
	 *          always calls the onload callback of the link element.
	 *
	 * @public
	 * @static
	 * @SecSink {0|PATH} Parameter is used for future HTTP requests
	 */
	jQuery.sap.includeStyleSheet = function includeStyleSheet(sUrl, sId, fnLoadCallback, fnErrorCallback) {

		var _createLink = function(sUrl, sId, fnLoadCallback, fnErrorCallback){

			// create the new link element
			var oLink = document.createElement("link");
			oLink.type = "text/css";
			oLink.rel = "stylesheet";
			oLink.href = sUrl;
			if (sId) {
				oLink.id = sId;
			}

			var fnError = function() {
				jQuery(oLink).attr("data-sap-ui-ready", "false");
				if (fnErrorCallback) {
					fnErrorCallback();
				}
			};

			var fnLoad = function() {
				jQuery(oLink).attr("data-sap-ui-ready", "true");
				if (fnLoadCallback) {
					fnLoadCallback();
				}
			};

			// for IE we will check if the stylesheet contains any rule and then
			// either trigger the load callback or the error callback
			if (!!sap.ui.Device.browser.internet_explorer) {
				var fnLoadOrg = fnLoad;
				fnLoad = function(oEvent) {
					var aRules;
					try {
						// in cross-origin scenarios the IE can still access the rules of the stylesheet
						// if the stylesheet has been loaded properly
						aRules = oEvent.target && oEvent.target.sheet && oEvent.target.sheet.rules;
						// in cross-origin scenarios now the catch block will be executed because we
						// cannot access the rules of the stylesheet but for non cross-origin stylesheets
						// we will get an empty rules array and finally we cannot differ between
						// empty stylesheet or loading issue correctly => documented in JSDoc!
					} catch (ex) {
						// exception happens when the stylesheet could not be loaded from the server
						// we now ignore this and know that the stylesheet doesn't exists => trigger error
					}
					// no rules means error
					if (aRules && aRules.length > 0) {
						fnLoadOrg();
					} else {
						fnError();
					}
				};
			}

			jQuery(oLink).load(fnLoad);
			jQuery(oLink).error(fnError);
			return oLink;

		};

		var _appendStyle = function(sUrl, sId, fnLoadCallback, fnErrorCallback){

			if (sap.ui.Device.browser.internet_explorer && sap.ui.Device.browser.version <= 9 && document.styleSheets.length >= 28) {
				// in IE9 only 30 links are alowed, so use stylesheet object insted
				var sRootUrl = URI.parse(document.URL).path;
				var sAbsoluteUrl = new URI(sUrl).absoluteTo(sRootUrl).toString();

				if (sId) {
					var oIEStyleSheet = mIEStyleSheets[sId];
					if (oIEStyleSheet && oIEStyleSheet.href === sAbsoluteUrl) {
						// if stylesheet was already included and href is the same, do nothing
						return;
					}
				}

				jQuery.sap.log.warning("Stylesheet " + (sId ? sId + " " : "") + "not added as LINK because of IE limits", sUrl, "jQuery.sap.includeStyleSheet");

				if (!oIEStyleSheetNode) {
					// create a style sheet to add additional style sheet. But for this the Replace logic will not work any more
					// the callback functions are not used in this case
					// the data-sap-ui-ready attribute will not be set -> maybe problems with ThemeCheck
					oIEStyleSheetNode = document.createStyleSheet();
				}
				// add up to 30 style sheets to every of this style sheets. (result is a tree of style sheets)
				var bAdded = false;
				for ( var i = 0; i < oIEStyleSheetNode.imports.length; i++) {
					var oStyleSheet = oIEStyleSheetNode.imports[i];
					if (oStyleSheet.imports.length < 30) {
						oStyleSheet.addImport(sAbsoluteUrl);
						bAdded = true;
						break;
					}
				}
				if (!bAdded) {
					oIEStyleSheetNode.addImport(sAbsoluteUrl);
				}

				if (sId) {
					// remember id and href URL in internal map as there is no link tag that can be checked
					mIEStyleSheets[sId] = {
						href: sAbsoluteUrl
					};
				}

				// always make sure to re-append the customcss in the end if it exists
				var oCustomCss = document.getElementById('sap-ui-core-customcss');
				if (!jQuery.isEmptyObject(oCustomCss)) {
					appendHead(oCustomCss);
				}
			} else {
				var oLink = _createLink(sUrl, sId, fnLoadCallback, fnErrorCallback);
				if (jQuery('#sap-ui-core-customcss').length > 0) {
					jQuery('#sap-ui-core-customcss').first().before(jQuery(oLink));
				} else {
					appendHead(oLink);
				}
			}

		};

		// check for existence of the link
		var oOld = jQuery.sap.domById(sId);
		if (oOld && oOld.tagName === "LINK" && oOld.rel === "stylesheet") {
			// link exists, so we replace it - but only if a callback has to be attached or if the href will change. Otherwise don't touch it
			if (fnLoadCallback || fnErrorCallback || oOld.href !== URI(String(sUrl), URI().search("") /* returns current URL without search params */ ).toString()) {
				jQuery(oOld).replaceWith(_createLink(sUrl, sId, fnLoadCallback, fnErrorCallback));
			}
		} else {
			_appendStyle(sUrl, sId, fnLoadCallback, fnErrorCallback);
		}

	};

	// TODO should be in core, but then the 'callback' could not be implemented
	if ( !(oCfgData.productive === true || oCfgData.productive === "true"  || oCfgData.productive === "x") ) {
		jQuery(function() {
			jQuery(document.body).keydown(function(e) {
				if ( e.keyCode == 80 && e.shiftKey && e.altKey && e.ctrlKey ) {
					try {
						jQuery.sap.require("sap.ui.debug.TechnicalInfo");
					} catch (err1) {
						// alert("Sorry, failed to activate 'P'-mode!");
						return;
					}
					sap.ui.debug.TechnicalInfo.open(function() {
						var oInfo = getModuleSystemInfo();
						return { modules : oInfo.modules, prefixes : oInfo.prefixes, config: oCfgData };
					});
				}
			});
		});

		jQuery(function() {
			jQuery(document.body).keydown(function(e) {
				if ( e.keyCode == 83 /*S*/ && e.shiftKey && e.altKey && e.ctrlKey ) { //TODO: Is this ok?
					try {
						jQuery.sap.require("sap.ui.core.support.Support");
						var oSupport = sap.ui.core.support.Support.getStub();
						if (oSupport.getType() != sap.ui.core.support.Support.StubType.APPLICATION) {
							return;
						}
						oSupport.openSupportTool();
					} catch (err2) {
						// ignore error
					}
				}
			});
		});
	}

	// *********** feature detection, enriching jQuery.support *************
	// this might go into its own file once there is more stuff added

	/**
	 * Holds information about the browser's capabilities and quirks.
	 * This object is provided and documented by jQuery.
	 * But it is extended by SAPUI5 with detection for features not covered by jQuery. This documentation ONLY covers the detection properties added by UI5.
	 * For the standard detection properties, please refer to the jQuery documentation.
	 *
	 * These properties added by UI5 are only available temporarily until jQuery adds feature detection on their own.
	 *
	 * @name jQuery.support
	 * @namespace
	 * @since 1.12
	 * @public
	 */

	if (!jQuery.support) {
		jQuery.support = {};
	}

	jQuery.extend(jQuery.support, {touch: sap.ui.Device.support.touch}); // this is also defined by jquery-mobile-custom.js, but this information is needed earlier

	var aPrefixes = ["Webkit", "ms", "Moz"];
	var oStyle = document.documentElement.style;

	var preserveOrTestCssPropWithPrefixes = function(detectionName, propName) {
		if (jQuery.support[detectionName] === undefined) {

			if (oStyle[propName] !== undefined) { // without vendor prefix
				jQuery.support[detectionName] = true;
				// If one of the flex layout properties is supported without the prefix, set the flexBoxPrefixed to false
				if (propName === "boxFlex" || propName === "flexOrder" || propName === "flexGrow") {
					// Exception for Chrome up to version 28
					// because some versions implemented the non-prefixed properties without the functionality
					if (!sap.ui.Device.browser.chrome || sap.ui.Device.browser.version > 28) {
						jQuery.support.flexBoxPrefixed = false;
					}
				}
				return;

			} else { // try vendor prefixes
				propName = propName.charAt(0).toUpperCase() + propName.slice(1);
				for (var i in aPrefixes) {
					if (oStyle[aPrefixes[i] + propName] !== undefined) {
						jQuery.support[detectionName] = true;
						return;
					}
				}
			}
			jQuery.support[detectionName] = false;
		}
	};

	/**
	 * Whether the current browser supports (2D) CSS transforms
	 * @type {boolean}
	 * @public
	 * @name jQuery.support.cssTransforms
	 */
	preserveOrTestCssPropWithPrefixes("cssTransforms", "transform");

	/**
	 * Whether the current browser supports 3D CSS transforms
	 * @type {boolean}
	 * @public
	 * @name jQuery.support.cssTransforms3d
	 */
	preserveOrTestCssPropWithPrefixes("cssTransforms3d", "perspective");

	/**
	 * Whether the current browser supports CSS transitions
	 * @type {boolean}
	 * @public
	 * @name jQuery.support.cssTransitions
	 */
	preserveOrTestCssPropWithPrefixes("cssTransitions", "transition");

	/**
	 * Whether the current browser supports (named) CSS animations
	 * @type {boolean}
	 * @public
	 * @name jQuery.support.cssAnimations
	 */
	preserveOrTestCssPropWithPrefixes("cssAnimations", "animationName");

	/**
	 * Whether the current browser supports CSS gradients. Note that ANY support for CSS gradients leads to "true" here, no matter what the syntax is.
	 * @type {boolean}
	 * @public
	 * @name jQuery.support.cssGradients
	 */
	if (jQuery.support.cssGradients === undefined) {
		var oElem = document.createElement('div'),
		oStyle = oElem.style;
		try {
			oStyle.backgroundImage = "linear-gradient(left top, red, white)";
			oStyle.backgroundImage = "-moz-linear-gradient(left top, red, white)";
			oStyle.backgroundImage = "-webkit-linear-gradient(left top, red, white)";
			oStyle.backgroundImage = "-ms-linear-gradient(left top, red, white)";
			oStyle.backgroundImage = "-webkit-gradient(linear, left top, right bottom, from(red), to(white))";
		} catch (e) {/* no support...*/}
		jQuery.support.cssGradients = (oStyle.backgroundImage && oStyle.backgroundImage.indexOf("gradient") > -1);

		oElem = null; // free for garbage collection
	}

	/**
	 * Whether the current browser supports only prefixed flexible layout properties
	 * @type {boolean}
	 * @public
	 * @name jQuery.support.flexBoxPrefixed
	 */
	jQuery.support.flexBoxPrefixed = true;	// Default to prefixed properties

	/**
	 * Whether the current browser supports the OLD CSS3 Flexible Box Layout directly or via vendor prefixes
	 * @type {boolean}
	 * @public
	 * @name jQuery.support.flexBoxLayout
	 */
	preserveOrTestCssPropWithPrefixes("flexBoxLayout", "boxFlex");

	/**
	 * Whether the current browser supports the NEW CSS3 Flexible Box Layout directly or via vendor prefixes
	 * @type {boolean}
	 * @public
	 * @name jQuery.support.newFlexBoxLayout
	 */
	preserveOrTestCssPropWithPrefixes("newFlexBoxLayout", "flexGrow");	// Use a new property that IE10 doesn't support

	/**
	 * Whether the current browser supports the IE10 CSS3 Flexible Box Layout directly or via vendor prefixes
	 * @type {boolean}
	 * @public
	 * @name jQuery.support.ie10FlexBoxLayout
	 * @since 1.12.0
	 */
	// Just using one of the IE10 properties that's not in the new FlexBox spec
	if (!jQuery.support.newFlexBoxLayout && oStyle.msFlexOrder !== undefined) {
		jQuery.support.ie10FlexBoxLayout = true;
	} else {
		jQuery.support.ie10FlexBoxLayout = false;
	}

	/**
	 * Whether the current browser supports any kind of Flexible Box Layout directly or via vendor prefixes
	 * @type {boolean}
	 * @public
	 * @name jQuery.support.hasFlexBoxSupport
	 */
	if (jQuery.support.flexBoxLayout || jQuery.support.newFlexBoxLayout || jQuery.support.ie10FlexBoxLayout) {
		jQuery.support.hasFlexBoxSupport = true;
	} else {
		jQuery.support.hasFlexBoxSupport = false;
	}


	/**
	 * FrameOptions class
	 */
	var FrameOptions = function(mSettings) {
		/* mSettings: mode, callback, whitelist, whitelistService, timeout, blockEvents, showBlockLayer, allowSameOrigin */
		this.mSettings = mSettings || {};
		this.sMode = this.mSettings.mode || FrameOptions.Mode.ALLOW;
		this.fnCallback = this.mSettings.callback;
		this.iTimeout = this.mSettings.timeout || 10000;
		this.bBlockEvents = this.mSettings.blockEvents !== false;
		this.bShowBlockLayer = this.mSettings.showBlockLayer !== false;
		this.bAllowSameOrigin = this.mSettings.allowSameOrigin !== false;
		this.sParentOrigin = '';
		this.bUnlocked = false;
		this.bRunnable = false;
		this.bParentUnlocked = false;
		this.bParentResponded = false;
		this.sStatus = "pending";
		this.aFPChilds = [];

		var that = this;

		this.iTimer = setTimeout(function() {
			that._callback(false);
		}, this.iTimeout);

		var fnHandlePostMessage = function() {
			that._handlePostMessage.apply(that, arguments);
		};

		FrameOptions.__window.addEventListener('message', fnHandlePostMessage);

		if (FrameOptions.__parent === FrameOptions.__self || FrameOptions.__parent == null || this.sMode === FrameOptions.Mode.ALLOW) {
			// unframed page or "allow all" mode
			this._applyState(true, true);
		} else {
			// framed page

			this._lock();

			// "deny" mode blocks embedding page from all origins
			if (this.sMode === FrameOptions.Mode.DENY) {
				this._callback(false);
				return;
			}

			if (this.bAllowSameOrigin) {

				try {
					var oParentWindow = FrameOptions.__parent;
					var bOk = false;
					var bTrue = true;
					do {
						var test = oParentWindow.document.domain;
						if (oParentWindow == FrameOptions.__top) {
							if (test != undefined) {
								bOk = true;
							}
							break;
						}
						oParentWindow = oParentWindow.parent;
					} while (bTrue);
					if (bOk) {
						this._applyState(true, true);
					}
				} catch (e) {
					// access to the top window is not possible
					this._sendRequireMessage();
				}

			} else {
				// same origin not allowed
				this._sendRequireMessage();
			}

		}

	};

	FrameOptions.Mode = {
		// only allow with same origin parent
		TRUSTED: 'trusted',

		// allow all kind of embedding (default)
		ALLOW: 'allow',

		// deny all kinds of embedding
		DENY: 'deny'
	};

	// Allow globals to be mocked in unit test
	FrameOptions.__window = window;
	FrameOptions.__parent = parent;
	FrameOptions.__self = self;
	FrameOptions.__top = top;

	// List of events to block while framing is unconfirmed
	FrameOptions._events = [
		"mousedown", "mouseup", "click", "dblclick", "mouseover", "mouseout",
		"touchstart", "touchend", "touchmove", "touchcancel",
		"keydown", "keypress", "keyup"
	];

	// check if string matches pattern
	FrameOptions.prototype.match = function(sProbe, sPattern) {
		if (!(/\*/i.test(sPattern))) {
			return sProbe == sPattern;
		} else {
			sPattern = sPattern.replace(/\//gi, "\\/"); // replace /   with \/
			sPattern = sPattern.replace(/\./gi, "\\."); // replace .   with \.
			sPattern = sPattern.replace(/\*/gi, ".*");  // replace *   with .*
			sPattern = sPattern.replace(/:\.\*$/gi, ":\\d*"); // replace :.* with :\d* (only at the end)

			if (sPattern.substr(sPattern.length - 1, 1) !== '$') {
				sPattern = sPattern + '$'; // if not already there add $ at the end
			}
			if (sPattern.substr(0, 1) !== '^') {
				sPattern = '^' + sPattern; // if not already there add ^ at the beginning
			}

			// sPattern looks like: ^.*:\/\/.*\.company\.corp:\d*$ or ^.*\.company\.corp$
			var r = new RegExp(sPattern, 'i');
			return r.test(sProbe);
		}
	};

	FrameOptions._lockHandler = function(oEvent) {
		oEvent.stopPropagation();
		oEvent.preventDefault();
	};

	FrameOptions.prototype._createBlockLayer = function() {
		if (document.readyState == "complete") {
			var lockDiv = document.createElement("div");
			lockDiv.style.position = "absolute";
			lockDiv.style.top = "0px";
			lockDiv.style.bottom = "0px";
			lockDiv.style.left = "0px";
			lockDiv.style.right = "0px";
			lockDiv.style.opacity = "0";
			lockDiv.style.backgroundColor = "white";
			lockDiv.style.zIndex = 2147483647; // Max value of signed integer (32bit)
			document.body.appendChild(lockDiv);
			this._lockDiv = lockDiv;
		}
	};

	FrameOptions.prototype._setCursor = function() {
		if (this._lockDiv) {
			this._lockDiv.style.cursor = this.sStatus == "denied" ? "not-allowed" : "wait";
		}
	};

	FrameOptions.prototype._lock = function() {
		var that = this;
		if (this.bBlockEvents) {
			for (var i = 0; i < FrameOptions._events.length; i++) {
				document.addEventListener(FrameOptions._events[i], FrameOptions._lockHandler, true);
			}
		}
		if (this.bShowBlockLayer) {
			this._blockLayer = function() {
				that._createBlockLayer();
				that._setCursor();
			};
			if (document.readyState == "complete") {
				this._blockLayer();
			} else {
				document.addEventListener("readystatechange", this._blockLayer);
			}
		}
	};

	FrameOptions.prototype._unlock = function() {
		if (this.bBlockEvents) {
			for (var i = 0; i < FrameOptions._events.length; i++) {
				document.removeEventListener(FrameOptions._events[i], FrameOptions._lockHandler, true);
			}
		}
		if (this.bShowBlockLayer) {
			document.removeEventListener("readystatechange", this._blockLayer);
			if (this._lockDiv) {
				document.body.removeChild(this._lockDiv);
				delete this._lockDiv;
			}
		}
	};

	FrameOptions.prototype._callback = function(bSuccess) {
		this.sStatus = bSuccess ? "allowed" : "denied";
		this._setCursor();
		clearTimeout(this.iTimer);
		if (typeof this.fnCallback === 'function') {
			this.fnCallback.call(null, bSuccess);
		}
	};

	FrameOptions.prototype._applyState = function(bIsRunnable, bIsParentUnlocked) {
		if (this.bUnlocked) {
			return;
		}
		if (bIsRunnable) {
			this.bRunnable = true;
		}
		if (bIsParentUnlocked) {
			this.bParentUnlocked = true;
		}
		if (!this.bRunnable || !this.bParentUnlocked) {
			return;
		}
		this._unlock();
		this._callback(true);
		this._notifyChildFrames();
		this.bUnlocked = true;
	};

	FrameOptions.prototype._applyTrusted = function(bTrusted) {
		if (bTrusted) {
			this._applyState(true, false);
		} else {
			this._callback(false);
		}
	};

	FrameOptions.prototype._check = function(bParentResponsePending) {
		if (this.bRunnable) {
			return;
		}
		var bTrusted = false;
		if (this.bAllowSameOrigin && this.sParentOrigin && FrameOptions.__window.document.URL.indexOf(this.sParentOrigin) == 0) {
			bTrusted = true;
		} else if (this.mSettings.whitelist && this.mSettings.whitelist.length != 0) {
			var sHostName = this.sParentOrigin.split('//')[1];
			sHostName = sHostName.split(':')[0];
			for (var i = 0; i < this.mSettings.whitelist.length; i++) {
				var match = sHostName.indexOf(this.mSettings.whitelist[i]);
				if (match != -1 && sHostName.substring(match) == this.mSettings.whitelist[i]) {
					bTrusted = true;
					break;
				}
			}
		}
		if (bTrusted) {
			this._applyTrusted(bTrusted);
		} else if (this.mSettings.whitelistService) {
			var that = this;
			var xmlhttp = new XMLHttpRequest();
			var url = this.mSettings.whitelistService + '?parentOrigin=' + encodeURIComponent(this.sParentOrigin);
			xmlhttp.onreadystatechange = function() {
				if (xmlhttp.readyState == 4) {
					that._handleXmlHttpResponse(xmlhttp, bParentResponsePending);
				}
			};
			xmlhttp.open('GET', url, true);
			xmlhttp.setRequestHeader('Accept', 'application/json');
			xmlhttp.send();
		} else {
			this._callback(false);
		}
	};

	FrameOptions.prototype._handleXmlHttpResponse = function(xmlhttp, bParentResponsePending) {
		if (xmlhttp.status === 200) {
			var bTrusted = false;
			var sResponseText = xmlhttp.responseText;
			var oRuleSet = JSON.parse(sResponseText);
			if (oRuleSet.active == false) {
				this._applyState(true, true);
			} else if (bParentResponsePending) {
				return;
			} else {
				if (this.match(this.sParentOrigin, oRuleSet.origin)) {
					bTrusted = oRuleSet.framing;
				}
				this._applyTrusted(bTrusted);
			}
		} else {
			jQuery.sap.log.warning("The configured whitelist service is not available: " + xmlhttp.status);
			this._callback(false);
		}
	};

	FrameOptions.prototype._notifyChildFrames = function() {
		for (var i = 0; i < this.aFPChilds.length; i++) {
			this.aFPChilds[i].postMessage('SAPFrameProtection*parent-unlocked','*');
		}
	};

	FrameOptions.prototype._sendRequireMessage = function() {
		FrameOptions.__parent.postMessage('SAPFrameProtection*require-origin', '*');
		// If not postmessage response was received, send request to whitelist service
		// anyway, to check whether frame protection is enabled
		if (this.mSettings.whitelistService) {
			setTimeout(function() {
				if (!this.bParentResponded) {
					this._check(true);
				}
			}.bind(this), 10);
		}
	};

	FrameOptions.prototype._handlePostMessage = function(oEvent) {
		var oSource = oEvent.source,
			sData = oEvent.data;

		// For compatibility with previous version empty message from parent means parent-unlocked
		// if (oSource === FrameOptions.__parent && sData == "") {
		//	sData = "SAPFrameProtection*parent-unlocked";
		// }

		if (oSource === FrameOptions.__self || oSource == null ||
			typeof sData !== "string" || sData.indexOf("SAPFrameProtection*") === -1) {
			return;
		}
		if (oSource === FrameOptions.__parent) {
			this.bParentResponded = true;
			if (!this.sParentOrigin) {
				this.sParentOrigin = oEvent.origin;
				this._check();
			}
			if (sData == "SAPFrameProtection*parent-unlocked") {
				this._applyState(false, true);
			}
		} else if (oSource.parent === FrameOptions.__self && sData == "SAPFrameProtection*require-origin" && this.bUnlocked) {
			oSource.postMessage("SAPFrameProtection*parent-unlocked", "*");
		} else {
			oSource.postMessage("SAPFrameProtection*parent-origin", "*");
			this.aFPChilds.push(oSource);
		}
	};

	jQuery.sap.FrameOptions = FrameOptions;

}());

/**
 * Executes an 'eval' for its arguments in the global context (without closure variables).
 *
 * This is a synchronous replacement for <code>jQuery.globalEval</code> which in some
 * browsers (e.g. FireFox) behaves asynchronously.
 *
 * @type void
 * @public
 * @static
 * @SecSink {0|XSS} Parameter is evaluated
 */
jQuery.sap.globalEval = function() {
	/*eslint-disable no-eval */
	eval(arguments[0]);
	/*eslint-enable no-eval */
};
