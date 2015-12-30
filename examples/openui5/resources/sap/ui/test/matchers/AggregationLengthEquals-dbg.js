/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['./Matcher'], function (fnMatcher) {

	/**
	 * AggregationLengthEquals - checks if an aggregation contains at least one entry
	 *
	 * 	 * The settings supported by AggregationLengthEquals are:
	 * <ul>
	 *	<li>Properties
	 * 		<ul>
	 *			<li>{@link #getName name} : string</li>
	 * 		</ul>
	 * </li>
	 * </ul>
	 *
	 * @class AggregationLengthEquals - checks if an aggregation contains at least one entry
	 * @param {object} [mSettings] optional map/JSON-object with initial settings for the new AggregationLengthEqualsMatcher
	 * @extends sap.ui.test.matchers.Matcher
	 * @public
	 * @name sap.ui.test.matchers.AggregationLengthEquals
	 * @author SAP SE
	 * @since 1.23
	 */
	return fnMatcher.extend("sap.ui.test.matchers.AggregationLengthEquals", {

		metadata : {
			publicMethods : [ "isMatching" ],
			properties : {
				name : {
					type : "string"
				},
				length : {
					type : "int"
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
		 * @name sap.ui.test.matchers.AggregationLengthEquals#getName
		 * @function
		 */

		/**
		 * Setter for property <code>name</code>.
		 *
		 * @param {string} sName the name of the aggregation <code>name</code>
		 * @return {sap.ui.test.matchers.AggregationLengthEquals} <code>this</code> to allow method chaining
		 * @public
		 * @name sap.ui.test.matchers.AggregationLengthEquals#setName
		 * @function
		 */

		/**
		 * Getter for property <code>length</code>.
		 *
		 * The length that aggregation <code>name</code> should have
		 *
		 * @return {int} the length that aggregation <code>name</code> should have
		 * @public
		 * @name sap.ui.test.matchers.AggregationLengthEquals#getLength
		 * @function
		 */

		/**
		 * Setter for property <code>length</code>.
		 *
		 * @param {int} iLength length that aggregation <code>name</code> should have
		 * @return {sap.ui.test.matchers.AggregationLengthEquals} <code>this</code> to allow method chaining
		 * @public
		 * @name sap.ui.test.matchers.AggregationLengthEquals#setLength
		 * @function
		 */

		/**
		 * Checks if the control's aggregation <code>name</code> has length <code>length</code>
		 *
		 * @param {sap.ui.core.Control} oControl the control that is checked by the matcher
		 * @return {boolean} true if the length of aggregation <code>name</code> is the same as <code>length</code>, false if it is not.
		 * @public
		 * @name sap.ui.test.matchers.AggregationLengthEquals#isMatching
		 * @function
		 */
		isMatching : function (oControl) {
			var sAggregationName = this.getName(),
				fnAggregation = oControl["get" + jQuery.sap.charToUpperCase(sAggregationName, 0)];

			if (!fnAggregation) {
				jQuery.sap.log.error("Control " + oControl.sId + " does not have an aggregation called: " + sAggregationName);
				return false;
			}
			var bIsMatch = fnAggregation.call(oControl).length === this.getLength();
			jQuery.sap.log.info("Control " + oControl.sId + " has an aggregation '"
					+ sAggregationName + "' and its length " + fnAggregation.call(oControl).length + (bIsMatch ? " matches." : " does not match."));
			return bIsMatch;
		}

	});

}, /* bExport= */ true);
