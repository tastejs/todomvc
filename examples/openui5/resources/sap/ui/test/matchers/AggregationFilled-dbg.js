/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['./Matcher'], function (fnMatcher) {

	/**
	 * AggregationFilled - checks if an aggregation contains at least one entry
	 *
	 * 	 * The settings supported by AggregationFilled are:
	 * <ul>
	 *	<li>Properties
	 * 		<ul>
	 *			<li>{@link #getName name} : string</li>
	 * 		</ul>
	 * </li>
	 * </ul>
	 *
	 * @class AggregationFilled - checks if an aggregation contains at least one entry
	 * @param {object} [mSettings] optional map/JSON-object with initial settings for the new AggregationFilledMatcher
	 * @extends sap.ui.test.matchers.Matcher
	 * @public
	 * @name sap.ui.test.matchers.AggregationFilled
	 * @author SAP SE
	 * @since 1.23
	 */
	return fnMatcher.extend("sap.ui.test.matchers.AggregationFilled", {

		metadata : {
			publicMethods : [ "isMatching" ],
			properties : {
				name : {
					type : "string"
				}
			}
		},

		/**
		 * Getter for property <code>name</code>.
		 * 
		 * The name of the aggregation that is used for matching
		 *
		 * @return {string} the name of the aggregation <code>name</code>
		 * @public
		 * @name sap.ui.test.matchers.AggregationFilled#getName
		 * @function
		 */

		/**
		 * Setter for property <code>name</code>.
		 * 
		 * @param {string} sName the name of the aggregation <code>name</code>
		 * @return {sap.ui.test.matchers.AggregationFilled} <code>this</code> to allow method chaining
		 * @public
		 * @name sap.ui.test.matchers.AggregationFilled#setName
		 * @function
		 */

		/**
		 * Checks if the control has a filled aggregation
		 * 
		 * @param {sap.ui.core.Control} oControl the control that is checked by the matcher
		 * @return {boolean} true if the Aggregation set in the property aggregationName is filled, false if it is not.
		 * @public
		 * @name sap.ui.test.matchers.AggregationFilled#isMatching
		 * @function
		 */
		isMatching : function (oControl) {
			var sAggregationName = this.getName(),
				fnAggregation = oControl["get" + jQuery.sap.charToUpperCase(sAggregationName, 0)];

			if (!fnAggregation) {
				jQuery.sap.log.error("Control " + oControl.sId + " does not have an aggregation called: " + sAggregationName);
				return false;
			}

			return !!fnAggregation.call(oControl).length;
		}

	});

}, /* bExport= */ true);