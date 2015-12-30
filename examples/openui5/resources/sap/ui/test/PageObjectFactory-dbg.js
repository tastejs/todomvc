/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['./Opa',
               'sap/ui/base/Object'],
	function(Opa, Ui5Object) {
		"use strict";
		
		/**
		 * @class Page Object Factory
		 * @extends sap.ui.base.Object
		 * @protected
		 * @alias sap.ui.test.PageObjectFactory
		 * @author SAP SE
		 * @since 1.26
		 */
		var fnPageObjectFactory = Ui5Object.extend("sap.ui.test.PageObjectFactory");
		
		/**
		 * Create a page object configured as arrangement, action and assertion to the Opa.config.
		 * Use it to structure your arrangement, action and assertion based on parts of the screen to avoid name clashes and help structuring your tests.
		 * @see sap.ui.test.Opa5#createPageObjects
		 * @protected
		 * @function
		 * @static
		 */
		fnPageObjectFactory.create = function(mPageObjects, Opa5) {
			var oPageObject = {};
			for (var sPageObjectName in mPageObjects) {
				if (!mPageObjects.hasOwnProperty(sPageObjectName)) {
					continue;
				}

				var fnBaseClass =  mPageObjects[sPageObjectName].baseClass || Opa5;
				var sNamespace = mPageObjects[sPageObjectName].namespace || "sap.ui.test.opa.pageObject";

				var mPageObjectActions = mPageObjects[sPageObjectName].actions;
				_registerOperationObject(mPageObjectActions, "actions", sPageObjectName, fnBaseClass, oPageObject, sNamespace);

				var mPageObjectAssertions = mPageObjects[sPageObjectName].assertions;
				_registerOperationObject(mPageObjectAssertions, "assertions", sPageObjectName, fnBaseClass, oPageObject, sNamespace);
			}
			return oPageObject;
		};
		
		/*
		 * Privates
		 */
		
		function _registerOperationObject (mPageObjectOperation, sOperationType, sPageObjectName, fnBaseClass, oPageObject, sNamespace) {
			if (mPageObjectOperation){

				var sClassName = _createClassName(sNamespace, sPageObjectName, sOperationType);

				var oOperationsPageObject = _createPageObject(mPageObjectOperation, sClassName, fnBaseClass);

				_registerPageObject(oOperationsPageObject, sOperationType, sPageObjectName, oPageObject);
			}
		}

		function _createClassName(sNamespace, sPageObjectName, sOperationType) {
			var sClassName = sNamespace + "." + sPageObjectName + "." + sOperationType;
			var oObj = jQuery.sap.getObject(sClassName,NaN);
			if (oObj){
				jQuery.sap.log.error("Opa5 Page Object namespace clash: You have loaded multiple page objects with the same name. To prevent overriding themself, specify the namespace parameter.");
			}
			return sClassName;
		}

		function _createPageObject (mPageObjectOperation, sClassName, fnBaseClass){
			
			var fnOperationsPageObject = fnBaseClass.extend(sClassName);
			
			for (var sOperation in mPageObjectOperation) {
				if (mPageObjectOperation.hasOwnProperty(sOperation)) {
					fnOperationsPageObject.prototype[sOperation] = mPageObjectOperation[sOperation];
				}
			}
			
			return new fnOperationsPageObject();
		}
		
		function _registerPageObject (oOperationsPageObject, sOperationType, sPageObjectName, oPageObject){
			if (sOperationType === "actions"){
				Opa.config.arrangements[sPageObjectName] = oOperationsPageObject;
				Opa.config.actions[sPageObjectName] = oOperationsPageObject;

			}else if (sOperationType === "assertions"){
				Opa.config.assertions[sPageObjectName] = oOperationsPageObject;
			}
			
			oPageObject[sPageObjectName] = oPageObject[sPageObjectName] || {};
			oPageObject[sPageObjectName][sOperationType] = oOperationsPageObject;
		}
		
		
		
		return fnPageObjectFactory;
});
