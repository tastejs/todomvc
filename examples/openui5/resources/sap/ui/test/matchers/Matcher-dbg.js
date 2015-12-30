/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['sap/ui/base/ManagedObject'], function (fnManagedObject) {

	/**
	 * @class Matchers for Opa5 - needs to implement an isMatching function that returns a boolean and will get a control instance as parameter
	 * @abstract
	 * @extends sap.ui.base.ManagedObject
	 * @public
	 * @name sap.ui.test.matchers.Matcher
	 * @author SAP SE
	 * @since 1.23
	 */
	return fnManagedObject.extend("sap.ui.test.matchers.Matcher", {

		metadata : {
			publicMethods : [ "isMatching" ]
		},

		/**
		 * Checks if the matcher is matching - will get an instance of sap.ui.Control as parameter
		 * Should be overwritten by subclasses
		 * 
		 * @param {sap.ui.core.Control} oControl the control that is checked by the matcher
		 * @return {boolean} true if the Control is matching the condition of the matcher 
		 * @protected
		 * @name sap.ui.test.matchers.Matcher#isMatching
		 * @function
		 */
		isMatching : function (oControl) {
			return true;
		}
	});

}, /* bExport= */ true);