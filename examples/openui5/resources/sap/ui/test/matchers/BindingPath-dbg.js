/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['./Matcher'], function (Matcher) {

	/**
	 * BindingPath - checks if a control has a binding context with the exact same binding path.
	 *
	 * @class BindingPath - checks if a control has a binding context with the exact same binding path
	 * @extends sap.ui.test.matchers.Matcher
	 * @param {object} [mSettings] Map/JSON-object with initial settings for the new BindingPath.
	 * @param {string} [mSettings.path] {@Link #getPath path} The value of the binding path that is used for matching.
	 * The property path is a mandatory parameter and should be set by using a constructor or setter function
	 * otherwise the binding path matcher won't work.
	 * @param {string} [mSettings.modelName] {@Link #getModelName modelName} The name of the binding's model that is used for matching.
	 * @public
	 * @name sap.ui.test.matchers.BindingPath
	 * @author SAP SE
	 * @since 1.32
	 */
	return Matcher.extend("sap.ui.test.matchers.BindingPath", {

		metadata: {
			publicMethods: ["isMatching"],
			properties: {
				path: {
					type: "string"
				},
				modelName: {
					type: "string"
				}
			}
		},

		/**
		 * Getter for property <code>path</code>.
		 *
		 * The value of the binding path that is used for matching.
		 *
		 * @return {string} the value of binding path <code>path</code>
		 * @public
		 * @name sap.ui.test.matchers.BindingPath#getPath
		 * @function
		 */

		/**
		 * Setter for property <code>path</code>.
		 *
		 * @param {string} sPath the value of the binding path <code>path</code>
		 * @return {sap.ui.test.matchers.BindingPath} <code>this</code> to allow method chaining
		 * @public
		 * @name sap.ui.test.matchers.BindingPath#setPath
		 * @function
		 */

		/**
		 * Getter for property <code>modelName</code>.
		 *
		 * The name of the binding model that is used for matching.
		 *
		 * @return {string} the name of binding model <code>modelName</code>
		 * @public
		 * @name sap.ui.test.matchers.BindingPath#getModelName
		 * @function
		 */

		/**
		 * Setter for property <code>modelName</code>.
		 *
		 * @param {string} sModelName the name of binding model <code>modelName</code>
		 * @return {sap.ui.test.matchers.BindingPath} <code>this</code> to allow method chaining
		 * @public
		 * @name sap.ui.test.matchers.BindingPath#setModelName
		 * @function
		 */

		/**
		 * Checks if the control has a binding context that matches the path
		 *
		 * @param {sap.ui.core.Control} oControl the control that is checked by the matcher
		 * @return {boolean} true if the binding path has a strictly matching value.
		 * @public
		 * @function
		 */

		isMatching: function (oControl) {
			var oBindingContext;

			// check if there is a binding path
			if (!this.getPath()) {
				jQuery.sap.log.error(this,"matchers.BindingPath: the path needs to be a not empty string");
				return false;
			}

			// check if there is a model name
			if (this.getModelName()) {
				oBindingContext = oControl.getBindingContext(this.getModelName());
			} else {
				oBindingContext = oControl.getBindingContext();
			}

			// check if there is a binding context
			if (!oBindingContext) {
				return false;
			}

			// check if the binding context is correct
			return this.getPath() === oBindingContext.getPath();
		}

	});

}, /* bExport= */ true);