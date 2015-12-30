/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['./Matcher'], function (fnMatcher) {

	/**
	 * PropertyStrictEquals - checks if a property has the exact same value
	 * The settings supported by PropertyStrictEquals are:
	 * <ul>
	 *	<li>Properties
	 *		<ul>
	 *			<li>{@link #getName name} : string</li>
	 *			<li>{@link #getValue value} : any</li>
	 *		</ul>
	 *	</li>
	 * </ul>
	 *
	 * @class PropertyStrictEquals - checks if a property has the exact same value
	 * @extends sap.ui.test.matchers.Matcher
	 * @param {object} [mSettings] optional map/JSON-object with initial settings for the new PropertyStrictEquals
	 * @public
	 * @name sap.ui.test.matchers.PropertyStrictEquals
	 * @author SAP SE
	 * @since 1.23
	 */
	return fnMatcher.extend("sap.ui.test.matchers.PropertyStrictEquals", {

		metadata : {
			publicMethods : [ "isMatching" ],
			properties : {
				name : {
					type : "string"
				},
				value : {
					type : "any"
				}
			}
		},

		/**
		 * Getter for property <code>name</code>.
		 * 
		 * The Name of the property that is used for matching.
		 *
		 * @return {string} the value of property <code>name</code>
		 * @public
		 * @name sap.ui.test.matchers.PropertyStrictEquals#getName
		 * @function
		 */

		/**
		 * Setter for property <code>name</code>.
		 * 
		 * @param {string} sValue the value for the property <code>name</code>
		 * @return {sap.ui.test.matchers.PropertyStrictEquals} <code>this</code> to allow method chaining
		 * @public
		 * @name sap.ui.test.matchers.PropertyStrictEquals#setName
		 * @function
		 */

		/**
		 * Getter for property <code>value</code>.
		 * 
		 * The value of the property that is used for matching.
		 *
		 * @return {string} the value of property <code>value</code>
		 * @public
		 * @name sap.ui.test.matchers.PropertyStrictEquals#getValue
		 * @function
		 */

		/**
		 * Setter for property <code>value</code>.
		 * 
		 * @param {string} sValue the value for the property <code>value</code>
		 * @return {sap.ui.test.matchers.PropertyStrictEquals} <code>this</code> to allow method chaining
		 * @public
		 * @name sap.ui.test.matchers.PropertyStrictEquals#setValue
		 * @function
		 */

		/**
		 * Checks if the control has a property that matches the value
		 * 
		 * @param {sap.ui.core.Control} oControl the control that is checked by the matcher
		 * @return {boolean} true if the property has a strictly matching value.
		 * @public
		 * @name sap.ui.test.matchers.PropertyStrictEquals#isMatching
		 * @function
		 */
		isMatching : function (oControl) {
			var sPropertyName = this.getName(),
				fnProperty = oControl["get" + jQuery.sap.charToUpperCase(sPropertyName, 0)];

			if (!fnProperty) {
				jQuery.sap.log.error("Control " + oControl.sId + " does not have a property called: " + sPropertyName);
				return false;
			}

			return fnProperty.call(oControl) === this.getValue();

		}
	});

}, /* bExport= */ true);