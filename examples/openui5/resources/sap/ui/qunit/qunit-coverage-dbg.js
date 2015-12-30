/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

/*global QUnit, URI*/// declare unusual global vars for JSLint/SAPUI5 validation
(function() {

	if (typeof QUnit === "undefined") {
		throw new Error("qunit-coverage.js: QUnit is not loaded yet!");
	}

	// set a hook for client-side coverage on window object
	window["sap-ui-qunit-coverage"] = "client";

	// extract base URL from script to attach the qunit-reporter-junit script
	var sDocumentLocation = document.location.href.replace(/\?.*|#.*/g, ""),
			aScripts = document.getElementsByTagName("script"),
			sBaseUrl = null,
			sFullUrl = null;

	for (var i = 0; i < aScripts.length; i++) {
		var sSrc = aScripts[i].getAttribute("src");
		if (sSrc) {
			var aBaseUrl = sSrc.match(/(.*)qunit\/qunit-coverage\.js$/i);
			if (aBaseUrl && aBaseUrl.length > 1) {
				sBaseUrl = aBaseUrl[1];
				break;
			}
		}
	}

	if (sBaseUrl === null) {
		if (jQuery && jQuery.sap &&  jQuery.sap.getModulePath) {
			sFullUrl = jQuery.sap.getModulePath("sap.ui.thirdparty.blanket", ".js");
		} else {
			throw new Error("qunit-coverage.js: The script tag seems to be malformed!");
		}
	} else {
		sFullUrl = sBaseUrl + "thirdparty/blanket.js";
	}

	// check for coverage beeing active or not
	if (QUnit.urlParams.coverage) {

		// load and execute qunit-reporter-junit script synchronously via XHR
		var req = new window.XMLHttpRequest();
		req.open('GET', sFullUrl, false);
		req.onreadystatechange = function(){
			if (req.readyState == 4) {

				// execute the loaded script
				var sScript = req.responseText;
				if (typeof window.URI !== "undefined") {
					sScript += "\n//# sourceURL=" + URI(sFullUrl).absoluteTo(sDocumentLocation);
				}
				window.eval(sScript);

				// reset QUnit config => will be set by QUnitUtils!
				QUnit.config.autostart = true;

				// prevent QUnit.start() call in blanket
				window.blanket.options("existingRequireJS", true);

				if (jQuery && jQuery.sap) {
					jQuery.sap.require._hook = function(sScript, sModuleName) {
						// TODO: manage includes/excludes? (usage of regex)
						// avoid duplicate instrumentation on server and client-side
						if (sScript.indexOf("window['sap-ui-qunit-coverage'] = 'server';") !== 0) {
							window.blanket.instrument({
								inputFile: sScript,
								inputFileName: sModuleName,
								instrumentCache: false
							}, function(sInstrumentedScript) {
								sScript = sInstrumentedScript;
							});
						}
						return sScript;
					};
				} else {
					throw new Error("qunit-coverage.js: jQuery.sap.global is not loaded - require hook cannot be set!");
				}

			}
		};
		req.send(null);

	} else {

		// add a QUnit configuration option in the Toolbar to enable/disable
		// client-side instrumentation via blanket (done manually because in
		// this case blanket will not be loaded and executed)
		QUnit.config.urlConfig.push({
			id: "coverage",
			label: "Enable coverage",
			tooltip: "Enable code coverage."
		});

	}

})();
