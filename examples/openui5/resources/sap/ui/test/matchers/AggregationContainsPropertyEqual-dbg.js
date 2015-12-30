/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([
		'./Matcher'
	], function (fnMatcher) {

	/**
	 * 	 * AggregationContainsPropertyEqual - checks if an aggregation contains at least one item that has a Property set to a certain value
	 *
	 * The settings supported by AggregationContainsPropertyEqual are:
	 * <ul>
	 *	<li>Properties
	 *		<ul>
	 *			<li>{@link #getPropertyName propertyName} : string</li>
	 *			<li>{@link #getAggregationName aggregationName} : string</li>
	 *			<li>{@link #getPropertyValue propertyValue} : any</li>
	 *		</ul>
	 *	</li>
	 * </ul>
	 *
	 * @class AggregationContainsPropertyEqual - checks if an aggregation contains at least one item that has a Property set to a certain value
	 * @extends sap.ui.test.matchers.Matcher
	 * @param {object} [mSettings] optional map/JSON-object with initial settings for the new AggregationContainsPropertyEqualMatcher
	 * @public
	 * @name sap.ui.test.matchers.AggregationContainsPropertyEqual
	 * @author SAP SE
	 * @since 1.23
	 */
	return fnMatcher.extend("sap.ui.test.matchers.AggregationContainsPropertyEqual", {

		metadata : {
			publicMethods : [ "isMatching" ],
			properties : {
				aggregationName : {
					type : "string"
				},
				propertyName : {
					type : "string"
				},
				propertyValue : {
					type : "any"
				}
			}
		},

		/**
		 * Getter for property <code>aggregationName</code>.
		 *
		 * The Name of the aggregation that is used for matching
		 *
		 * @return {string} the value of property <code>aggregationName</code>
		 * @public
		 * @name sap.ui.test.matchers.AggregationContainsPropertyEqual#getAggregationName
		 * @function
		 */

		/**
		 * Setter for property <code>aggregationName</code>.
		 *
		 * @param {string} sName the name of the aggregation <code>aggregationName</code>
		 * @return {sap.ui.test.matchers.AggregationContainsPropertyEqual} <code>this</code> to allow method chaining
		 * @public
		 * @name sap.ui.test.matchers.AggregationContainsPropertyEqual#setAggregationName
		 * @function
		 */

		/**
		 * Getter for property <code>propertyName</code>.
		 *
		 * The Name of the property that is used for matching
		 *
		 * @return {string} the value of property <code>propertyName</code>
		 * @public
		 * @name sap.ui.test.matchers.AggregationContainsPropertyEqual#getPropertyName
		 * @function
		 */

		/**
		 * Setter for property <code>propertyName</code>.
		 *
		 * @param {string} sName the value of the property <code>propertyName</code>
		 * @return {sap.ui.test.matchers.AggregationContainsPropertyEqual} <code>this</code> to allow method chaining
		 * @public
		 * @name sap.ui.test.matchers.AggregationContainsPropertyEqual#setPropertyName
		 * @function
		 */

		/**
		 * Getter for property <code>propertyValue</code>.
		 *
		 * The value of the Property that is used for matching
		 *
		 * @return {string} the value of property <code>propertyValue</code>
		 * @public
		 * @name sap.ui.test.matchers.AggregationContainsPropertyEqual#getPropertyValue
		 * @function
		 */

		/**
		 * Setter for property <code>propertyValue</code>.
		 *
		 * @param {string} sPropertyValue the value for the property <code>propertyValue</code>
		 * @return {sap.ui.test.matchers.AggregationContainsPropertyEqual} <code>this</code> to allow method chaining
		 * @public
		 * @name sap.ui.test.matchers.AggregationContainsPropertyEqual#setPropertyValue
		 * @function
		 */

		/**
		 * Checks if the control has a filled aggregation with at least one control that have a property equaling propertyName/Value
		 *
		 * @param {sap.ui.core.Control} oControl the control that is checked by the matcher
		 * @return {boolean} true if the Aggregation set in the property aggregationName is filled, false if it is not.
		 * @public
		 * @name sap.ui.test.matchers.AggregationContainsPropertyEqual#isMatching
		 * @function
		 */
		isMatching : function (oControl) {
			var aAggregation,
				sAggregationName = this.getAggregationName(),
				sPropertyName = this.getPropertyName(),
				vPropertyValue = this.getPropertyValue(),
				fnAggregation = oControl["get" + jQuery.sap.charToUpperCase(sAggregationName, 0)];

			if (!fnAggregation) {
				jQuery.sap.log.error("Control " + oControl.sId + " does not have an aggregation called: " + sAggregationName);
				return false;
			}

			aAggregation = fnAggregation.call(oControl);

			return aAggregation.some(function (vAggregationItem) {
				var fnPropertyGetter = vAggregationItem["get" + jQuery.sap.charToUpperCase(sPropertyName, 0)];

				//aggregation item does not have such a property
				if (!fnPropertyGetter) {
					return false;
				}

				return fnPropertyGetter.call(vAggregationItem) === vPropertyValue;
			});
		}

	});

}, /* bExport= */ true);
