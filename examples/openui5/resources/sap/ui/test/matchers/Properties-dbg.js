/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([], function () {

	/**
	 * @class Properties - checks if a control's properties have the following values
	 * @param {object} the object with a properties to check { propertyName : propertyValue, ... }, if value is regexp, it evaluates regexp with a control's property value
	 * @public
	 * @alias sap.ui.test.matchers.Properties
	 * @author SAP SE
	 * @since 1.27
	 */
	return function (oProperties) {
		return function(oControl) {
			var bIsMatching = true;
			jQuery.each(oProperties, function(sPropertyName, oPropertyValue) {
				var fnProperty = oControl["get" + jQuery.sap.charToUpperCase(sPropertyName, 0)];

				if (!fnProperty) {
					bIsMatching = false;
					jQuery.sap.log.error("Control " + oControl.sId + " does not have a property called: " + sPropertyName);
					return false;
				}

				var vCurrentPropertyValue = fnProperty.call(oControl);
				if (oPropertyValue instanceof RegExp) {
					bIsMatching = oPropertyValue.test(vCurrentPropertyValue);
				} else {
					bIsMatching = vCurrentPropertyValue === oPropertyValue;
				}

				if (!bIsMatching) {
					return false;
				}
			});

			return bIsMatching;
		};
	};

}, /* bExport= */ true);
