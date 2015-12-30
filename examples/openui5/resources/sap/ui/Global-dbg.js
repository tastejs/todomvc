/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

/**
 * @overview Initialization for the SAP UI Library
 *
 * This module creates the main SAP namespaces {@link sap} and automatically
 * registers it to the OpenAjax hub if that exists.
 *
 * This class provides method {@link #namespace} to register namespaces to the
 * SAP UI Library.
 *
 * @sample
 * Ensures a control can be used afterwards but does not load immediately
 * sap.ui.lazyRequire("sap.ui.core.Control");
 * sap.ui.lazyRequire("sap.ui.commons.Button");
 *
 * @version 1.32.9
 * @author  Martin Schaus, Daniel Brinkmann
 * @public
 */

/*global OpenAjax */// declare unusual global vars for JSLint/SAPUI5 validation

// Register to the OpenAjax Hub if it exists
sap.ui.define(['jquery.sap.global', 'jquery.sap.trace', 'jquery.sap.dom'],
	function(jQuery/* , jQuerySap */) {
	"use strict";

	if (window.OpenAjax && window.OpenAjax.hub) {
		OpenAjax.hub.registerLibrary("sap", "http://www.sap.com/", "0.1", {});
	}

	/**
	 * Root namespace for JavaScript functionality provided by SAP SE.
	 *
	 * The <code>sap</code> namespace is automatically registered with the
	 * OpenAjax hub if it exists.
	 *
	 * @version 1.32.9
	 * @namespace
	 * @public
	 * @name sap
	 */
	if ( typeof window.sap !== "object" && typeof window.sap !== "function"  ) {
	  window.sap = {};
	}

	/**
	 * The <code>sap.ui</code> namespace is the central OpenAjax compliant entry
	 * point for UI related JavaScript functionality provided by SAP.
	 *
	 * @version 1.32.9
	 * @namespace
	 * @name sap.ui
	 * @public
	 */
	if ( typeof window.sap.ui !== "object") {
		window.sap.ui = {};
	}
	sap.ui = jQuery.extend(sap.ui, {
			/**
			 * The version of the SAP UI Library
			 * @type string
			 */
			version: "1.32.9",
			buildinfo : { lastchange : "", buildtime : "20151214-0958" }
		});

	/**
	 * Stores the loading Promise for "sap-ui-version.json".
	 * @see sap.ui.getVersionInfo
	 * @private
	 */
	var oVersionInfoPromise = null;

	/**
	 * Loads the version info file (resources/sap-ui-version.json) and returns
	 * it or if a library name is specified then the version info of the individual
	 * library will be returned.
	 *
	 * In case of the version info file is not available an error will occur when
	 * calling this function.
	 *
	 * @param {string|object} [mOptions] name of the library (e.g. "sap.ui.core") or a object map (see below)
	 * @param {boolean} [mOptions.library] name of the library (e.g. "sap.ui.core")
	 * @param {boolean} [mOptions.async=false] whether "sap-ui-version.json" should be loaded asynchronously
	 * @param {boolean} [mOptions.failOnError=true] whether to propagate load errors or not (not relevant for async loading)
	 * @return {object|undefined|Promise} the full version info, the library specific one,
	 *                                    undefined (if library is not listed or there was an error and "failOnError" is set to "false")
	 *                                    or a Promise which resolves with one of them
	 * @public
	 * @static
	 */
	sap.ui.getVersionInfo = function(mOptions) {

		// Check for no parameter / library name as string
		if (typeof mOptions !== "object") {
			mOptions = {
				library: mOptions
			};
		}

		// Cast "async" to boolean (defaults to false)
		mOptions.async = mOptions.async === true;

		// Cast "failOnError" to boolean (defaults to true)
		mOptions.failOnError = mOptions.failOnError !== false;

		if (!sap.ui.versioninfo) {
			// Load and cache the versioninfo

			// When async is enabled and the file is currently being loaded
			// return the promise and make sure the requested options are passed.
			// This is to prevent returning the full object as requested in a
			// first call (which created this promise) to the one requested just a
			// single lib in a second call (which re-uses this same promise) or vice versa.
			if (mOptions.async && oVersionInfoPromise instanceof Promise) {
				return oVersionInfoPromise.then(function() {
					return sap.ui.getVersionInfo(mOptions);
				});
			}

			var fnHandleSuccess = function(oVersionInfo) {
				// Remove the stored Promise as the versioninfo is now cached.
				// This allows reloading the file by clearing "sap.ui.versioninfo"
				// (however this is not documented and therefore not supported).
				oVersionInfoPromise = null;

				// "jQuery.sap.loadResource" returns "null" in case of an error when
				// "failOnError" is set to "false". In this case the won't be persisted
				// and undefined will be returned.
				if (oVersionInfo === null) {
					return undefined;
				}

				// Persist the info object to return it in subsequent calls
				sap.ui.versioninfo = oVersionInfo;


				// Calling the function again with the same arguments will return the
				// cached value from "sap.ui.versioninfo".
				return sap.ui.getVersionInfo(mOptions);
			};
			var fnHandleError = function(oError) {
				// Remove the stored Promise as the versioninfo couldn't be loaded
				// and should be requested again the next time.
				oVersionInfoPromise = null;

				// Re-throw the error to give it to the user
				throw oError;
			};

			var vReturn = jQuery.sap.loadResource("sap-ui-version.json", {
				async: mOptions.async,

				// "failOnError" only applies for sync mode, async should always fail (reject)
				failOnError: mOptions.async || mOptions.failOnError
			});

			if (vReturn instanceof Promise) {
				oVersionInfoPromise = vReturn;
				return vReturn.then(fnHandleSuccess, fnHandleError);
			} else {
				return fnHandleSuccess(vReturn);
			}

		} else {
			// Return the cached versioninfo

			var oResult;
			if (typeof mOptions.library !== "undefined") {
				// Find the version of the individual library
				var aLibs = sap.ui.versioninfo.libraries;
				if (aLibs) {
					for (var i = 0, l = aLibs.length; i < l; i++) {
						if (aLibs[i].name === mOptions.library) {
							oResult = aLibs[i];
							break;
						}
					}
				}
			} else {
				// Return the full version info
				oResult = sap.ui.versioninfo;
			}

			return mOptions.async ? Promise.resolve(oResult) : oResult;
		}
	};

	/**
	 * Ensures that a given a namespace or hierarchy of nested namespaces exists in the
	 * current <code>window</code>.
	 *
	 * @param {string} sNamespace
	 * @return {object} the innermost namespace of the hierarchy
	 * @public
	 * @static
	 * @deprecated Use jQuery.sap.declare or jQuery.sap.getObject(...,0) instead
	 */
	sap.ui.namespace = function(sNamespace){

		jQuery.sap.assert(false, "sap.ui.namespace is long time deprecated and shouldn't be used");

		return jQuery.sap.getObject(sNamespace, 0);
	};

	/**
	 * Creates a lazy loading stub for a given class <code>sClassName</code>.
	 *
	 * If the class has been loaded already, nothing is done. Otherwise a stub object
	 * or constructor and - optionally - a set of stub methods are created.
	 * All created stubs will load the corresponding module on execution
	 * and then delegate to their counterpart in the loaded module.
	 *
	 * When no methods are given or when the list of methods contains the special name
	 * "new" (which is an operator can't be used as method name in JavaScript), then a
	 * stub <b>constructor</b> for class <code>sClassName</code> is created.
	 * Otherwise, a plain object is created.
	 *
	 * <b>Note</b>: Accessing any stub as a plain object without executing it (no matter
	 * whether it is a function or an object) won't load the module and therefore most like
	 * won't work as expected. This is a fundamental restriction of the lazy loader approach.
	 * It could only be fixed with JavaScript 1.5 features that are not available in all
	 * UI5 target browsers (e.g. not in IE8).
	 *
	 * <b>Note</b>: As a side effect of this method, the namespace containing the given
	 * class is created <b>immediately</b>.
	 *
	 * @param {string} sClassName Fully qualified name (dot notation) of the class that should be prepared
	 * @param {string} [sMethods='new'] space separated list of additional (static) methods that should be created as stubs
	 * @param {string} [sModuleName] name of the module to load, defaults to the class name
	 * @public
	 * @static
	 */
	sap.ui.lazyRequire = function(sClassName, sMethods, sModuleName) {

		jQuery.sap.assert(typeof sClassName === "string" && sClassName, "lazyRequire: sClassName must be a non-empty string");
		jQuery.sap.assert(!sMethods || typeof sMethods === "string", "lazyRequire: sMethods must be empty or a string");

		var sFullClass = sClassName.replace(/\//gi,"\."),
			iLastDotPos = sFullClass.lastIndexOf("."),
			sPackage = sFullClass.substr(0, iLastDotPos),
			sClass = sFullClass.substr(iLastDotPos + 1),
			oPackage = jQuery.sap.getObject(sPackage, 0),
			oClass = oPackage[sClass],
			aMethods = (sMethods || "new").split(" "),
			iConstructor = jQuery.inArray("new", aMethods);

		sModuleName = sModuleName || sFullClass;

		if (!oClass) {

			if ( iConstructor >= 0 ) {

				// Create dummy constructor which loads the class on demand
				oClass = function() {
					jQuery.sap.log.debug("lazy stub for '" + sFullClass + "' (constructor) called.");
					jQuery.sap.require(sModuleName);
					var oRealClass = oPackage[sClass];
					jQuery.sap.assert(typeof oRealClass === "function", "lazyRequire: oRealClass must be a function after loading");
					if ( oRealClass._sapUiLazyLoader ) {
						throw new Error("lazyRequire: stub '" + sFullClass + "'has not been replaced by module '" + sModuleName + "'");
					}

					// create a new instance and invoke the constructor
					var oInstance = jQuery.sap.newObject(oRealClass.prototype);
					var oResult = oRealClass.apply(oInstance, arguments);
					if (oResult && (typeof oResult === "function" || typeof oResult === "object")) {
						oInstance = oResult;
					}
					return oInstance;
				};
				// mark the stub as lazy loader
				oClass._sapUiLazyLoader = true;

				aMethods.splice(iConstructor,1);

			} else {

				// Create dummy object
				oClass = {};

			}

			// remember the stub
			oPackage[sClass] = oClass;

		}


		// add stub methods to it
		jQuery.each(aMethods, function (i,sMethod) {
			// check whether method is already available
			if (!oClass[sMethod]) {
				oClass[sMethod] = function() {
					jQuery.sap.log.debug("lazy stub for '" + sFullClass + "." + sMethod + "' called.");
					jQuery.sap.require(sModuleName);
					var oRealClass = oPackage[sClass];
					jQuery.sap.assert(typeof oRealClass === "function" || typeof oRealClass === "object", "lazyRequire: oRealClass must be a function or object after loading");
					jQuery.sap.assert(typeof oRealClass[sMethod] === "function", "lazyRequire: method must be a function");
					if (oRealClass[sMethod]._sapUiLazyLoader ) {
						throw new Error("lazyRequire: stub '" + sFullClass + "." + sMethod + "' has not been replaced by loaded module '" + sModuleName + "'");
					}
					return oRealClass[sMethod].apply(oRealClass, arguments);
				};
				oClass[sMethod]._sapUiLazyLoader = true;
			}
		});

	};

	/**
	 * Returns the URL of a resource that belongs to the given library and has the given relative location within the library.
	 * This is mainly meant for static resources like images that are inside the library.
	 * It is NOT meant for access to JavaScript modules or anything for which a different URL has been registered with jQuery.sap.registerModulePath(). For
	 * these cases use jQuery.sap.getModulePath().
	 * It DOES work, however, when the given sResourcePath starts with "themes/" (= when it is a theme-dependent resource). Even when for this theme a different
	 * location outside the normal library location is configured.
	 *
	 * @param {string} sLibraryName the name of a library, like "sap.ui.commons"
	 * @param {string} sResourcePath the relative path of a resource inside this library, like "img/mypic.png" or "themes/my_theme/img/mypic.png"
	 * @returns {string} the URL of the requested resource
	 *
	 * @static
	 * @public
	 */
	sap.ui.resource = function(sLibraryName, sResourcePath) {
		jQuery.sap.assert(typeof sLibraryName === "string", "sLibraryName must be a string");
		jQuery.sap.assert(typeof sResourcePath === "string", "sResourcePath must be a string");

		// special handling for theme-dependent resources: move theme folder into module name
		var match = sResourcePath.match(/^themes\/([^\/]+)\//);
		if (match) {
			sLibraryName += ".themes." + match[1];
			sResourcePath = sResourcePath.substr(match[0].length);
		}

		return jQuery.sap.getModulePath(sLibraryName, '/') + sResourcePath;
	};

	/**
	 * Redirects access to resources that are part of the given namespace to a location
	 * relative to the assumed <b>application root folder</b>.
	 *
	 * Any UI5 managed resource (view, controller, control, JavaScript module, CSS file, etc.)
	 * whose resource name starts with <code>sNamespace</code>, will be loaded from an
	 * equally named subfolder of the <b>application root folder</b>.
	 * If the resource name consists of multiple segments (separated by a dot), each segment
	 * is assumed to represent an individual folder. In other words: when a resource name is
	 * converted to an URL, any dots ('.') are converted to slashes ('/').
	 *
	 * <b>Limitation:</b> For the time being, the <b>application root folder</b> is assumed to be
	 * the same as the folder where the current page resides in.
	 *
	 * Usage sample:
	 * <pre>
	 *   // Let UI5 know that resources, whose name starts with "com.mycompany.myapp"
	 *   // should be loaded from the URL location "./com/mycompany/myapp"
	 *   sap.ui.localResources("com.mycompany.myapp");
	 *
	 *   // The following call implicitly will use the mapping done by the previous line
	 *   // It will load a view from ./com/mycompany/myapp/views/Main.view.xml
	 *   sap.ui.view({ view : "com.mycompany.myapp.views.Main", type : sap.ui.core.mvc.ViewType.XML});
	 * </pre>
	 *
	 * When applications need a more flexible mapping between resource names and their location,
	 * they can use {@link jQuery.sap.registerModulePath}.
	 *
	 * It is intended to make this configuration obsolete in future releases, but for the time
	 * being, applications must call this method when they want to store resources relative to
	 * the assumed application root folder.
	 *
	 * @param {string} sNamespace Namespace prefix for which to load resources relative to the application root folder
	 * @public
	 * @static
	 * @see jQuery.sap.registerModulePath
	 */
	sap.ui.localResources = function(sNamespace) {
		jQuery.sap.assert(sNamespace, "sNamespace must not be empty");
		jQuery.sap.registerModulePath(sNamespace, "./" + sNamespace.replace(/\./g, "/"));
	};

	return sap.ui;

}, /* bExport= */ true);
