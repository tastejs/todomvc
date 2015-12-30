/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

(function() {

	// If running in top window redirect to testrunner
	if (!parent.jsUnitTestSuite) {
		
		//extract base URL from script to attach the qunit-redirect script
		var aScripts = document.getElementsByTagName("script"),
				sBaseUrl = null,
				sOrigin = window.location.origin ? window.location.origin : (window.location.protocol + "//" + window.location.host),
				sTestUrl = window.location.href.substr(sOrigin.length);

		for (var i = 0; i < aScripts.length; i++) {
			var sSrc = aScripts[i].getAttribute("src");
			if (sSrc) {
				var aBaseUrl = sSrc.match(/(.*)resources\/sap\/ui\/qunit\/qunit-redirect\.js$/i);
				if (aBaseUrl && aBaseUrl.length > 1) {
					sBaseUrl = aBaseUrl[1];
					break;
				}
			}
		}

		if (sBaseUrl === null) {
			throw new Error("qunit-redirect.js: The script tag seems to be malformed!");
		}
		
		// forward the testpage to the testrunner
		window.location = sBaseUrl + "test-resources/sap/ui/qunit/testrunner.html?testpage=" + encodeURIComponent(sTestUrl) + "&autostart=true";

	}
	
})();
