/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// This module provides internal functions for dynamic expressions in OData V4 annotations. It is a
// helper module for sap.ui.model.odata.AnnotationHelper.
sap.ui.define([
	'jquery.sap.global', './_AnnotationHelperBasics', 'sap/ui/base/BindingParser',
	'sap/ui/base/ManagedObject', 'sap/ui/core/format/DateFormat', 'sap/ui/model/odata/ODataUtils'
], function(jQuery, Basics, BindingParser, ManagedObject, DateFormat, ODataUtils) {
	'use strict';

	// see http://docs.oasis-open.org/odata/odata/v4.0/errata02/os/complete/abnf/odata-abnf-construction-rules.txt
	var sDateValue = "\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])",
		sDecimalValue = "[-+]?\\d+(?:\\.\\d+)?",
		sMaxSafeInteger = "9007199254740991",
		sMinSafeInteger = "-" + sMaxSafeInteger,
		sTimeOfDayValue = "(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d(\\.\\d{1,12})?)?",
		mEdmType2RegExp = {
			Bool : /^true$|^false$/i,
			// Note: 'NaN' and 'INF' are case sensitive, "e" is not!
			Float : new RegExp("^" + sDecimalValue + "(?:[eE][-+]?\\d+)?$|^NaN$|^-INF$|^INF$"),
			Date : new RegExp("^" + sDateValue + "$"),
			DateTimeOffset: new RegExp("^" + sDateValue + "T" + sTimeOfDayValue
				+ "(?:Z|[-+](?:0\\d|1[0-3]):[0-5]\\d|[-+]14:00)$", "i"),
			Decimal : new RegExp("^" + sDecimalValue + "$"),
			Guid : /^[A-F0-9]{8}-(?:[A-F0-9]{4}-){3}[A-F0-9]{12}$/i,
			Int : /^[-+]?\d{1,19}$/,
			TimeOfDay : new RegExp("^" + sTimeOfDayValue + "$")
		},
		Expression,
		// a simple binding (see sap.ui.base.BindingParser.simpleParser) to "@i18n" model
		// w/o bad chars (see _AnnotationHelperBasics: rBadChars) inside path!
		rI18n = /^\{@i18n>[^\\\{\}:]+\}$/,
		rInteger = /^\d+$/,
		mOData2JSOperators = { // mapping of OData operator to JavaScript operator
			And: "&&",
			Eq: "===",
			Ge: ">=",
			Gt: ">",
			Le: "<=",
			Lt: "<",
			Ne: "!==",
			Not: "!",
			Or: "||"
		},
		rSchemaPath = /^(\/dataServices\/schema\/\d+)(?:\/|$)/,
		mType2Category = { // mapping of EDM type to a type category
			"Edm.Boolean": "boolean",
			"Edm.Byte": "number",
			"Edm.Date": "date",
			"Edm.DateTime": "datetime",
			"Edm.DateTimeOffset": "datetime",
			"Edm.Decimal": "decimal",
			"Edm.Double": "number",
			"Edm.Float": "number",
			"Edm.Guid": "string",
			"Edm.Int16": "number",
			"Edm.Int32": "number",
			"Edm.Int64": "decimal",
			"Edm.SByte": "number",
			"Edm.Single": "number",
			"Edm.String": "string",
			"Edm.Time": "time",
			"Edm.TimeOfDay": "time"
		},
		mType2Type = { // mapping of constant "edm:*" type to dynamic "Edm.*" type
			Bool : "Edm.Boolean",
			Float : "Edm.Double",
			Date : "Edm.Date",
			DateTimeOffset :"Edm.DateTimeOffset",
			Decimal : "Edm.Decimal",
			Guid : "Edm.Guid",
			Int : "Edm.Int64",
			String : "Edm.String",
			TimeOfDay : "Edm.TimeOfDay"
		},
		mTypeCategoryNeedsCompare = {
			"boolean": false,
			"date": true,
			"datetime": true,
			"decimal": true,
			"number": false,
			"string": false,
			"time": true
		};

	/**
	 * This object contains helper functions to process an expression in OData V4 annotations.
	 *
	 * Unless specified otherwise all functions return a result object with the following
	 * properties:
	 * <ul>
	 *  <li><code>result</code>: "binding", "composite", "constant" or "expression"
	 *  <li><code>value</code>: depending on result:
	 *   <ul>
	 *    <li>when "binding": {string} the binding path
	 *    <li>when "composite": {string} the binding string incl. the curly braces
	 *    <li>when "constant": {any} the constant value (not escaped if string)
	 *    <li>when "expression": {string} the expression unwrapped (no "{=" and "}")
	 *   </ul>
	 *  <li><code>type</code>:  the EDM data type (like "Edm.String") if it could be determined
	 *  <li><code>constraints</code>: {object} type constraints if result is "binding"
	 * </ul>
	 */
	Expression = {
		/**
		 * Adjusts the second operand so that both have the same category, if possible.
		 *
		 * @param {object} oOperand1
		 *   the operand 1 (as a result object with category)
		 * @param {object} oOperand2
		 *   the operand 2 (as a result object with category) - may be modified
		 */
		adjustOperands: function (oOperand1, oOperand2) {
			if (oOperand1.result !== "constant" && oOperand1.category === "number"
					&& oOperand2.result === "constant" && oOperand2.type === "Edm.Int64") {
				// adjust an integer constant of type "Edm.Int64" to the number
				oOperand2.category = "number";
			}
			if (oOperand1.result !== "constant" && oOperand1.category === "decimal"
				&& oOperand2.result === "constant" && oOperand2.type === "Edm.Int32") {
				// adjust an integer constant of type "Edm.Int32" to the decimal
				oOperand2.category = "decimal";
				oOperand2.type = oOperand1.type;
			}
			if (oOperand1.result === "constant" && oOperand1.category === "date"
					&& oOperand2.result !== "constant" && oOperand2.category === "datetime") {
				// adjust a datetime parameter to the date constant
				oOperand2.category = "date";
			}
		},

		/**
		 * Handling of "14.5.3 Expression edm:Apply".
		 *
		 * @param {sap.ui.core.util.XMLPreprocessor.IContext|sap.ui.model.Context} oInterface
		 *   the callback interface related to the current formatter call
		 * @param {object} oPathValue
		 *   a path/value pair pointing to the apply
		 * @param {boolean} bExpression
		 *   if <code>true</code> an embedded concat must use expression binding
		 * @returns {object}
		 *   the result object
		 */
		apply: function (oInterface, oPathValue, bExpression) {
			var oName = Basics.descend(oPathValue, "Name", "string"),
				oParameters = Basics.descend(oPathValue, "Parameters");

			switch (oName.value) {
				case "odata.concat": // 14.5.3.1.1 Function odata.concat
					return Expression.concat(oInterface, oParameters, bExpression);
				case "odata.fillUriTemplate": // 14.5.3.1.2 Function odata.fillUriTemplate
					return Expression.fillUriTemplate(oInterface, oParameters);
				case "odata.uriEncode": // 14.5.3.1.3 Function odata.uriEncode
					return Expression.uriEncode(oInterface, oParameters);
				default:
					Basics.error(oName, "unknown function: " + oName.value);
			}
		},

		/**
		 * Handling of "14.5.3.1.1 Function odata.concat".
		 *
		 * @param {sap.ui.core.util.XMLPreprocessor.IContext|sap.ui.model.Context} oInterface
		 *   the callback interface related to the current formatter call
		 * @param {object} oPathValue
		 *   a path/value pair pointing to the parameters array
		 * @param {boolean} bExpression
		 *   if <code>true</code> concat must use expression binding
		 * @returns {object}
		 *   the result object
		 */
		concat: function (oInterface, oPathValue, bExpression) {
			var aParts = [],
				oResult,
				aResults = [];

			// needed so that we can safely call the forEach
			Basics.expectType(oPathValue, "array");
			oPathValue.value.forEach(function (oUnused, i) {
				// an embedded concat must use expression binding
				oResult = Expression.parameter(oInterface, oPathValue, i);
				// if any parameter is type expression, the concat must become expression, too
				bExpression = bExpression || oResult.result === "expression";
				aResults.push(oResult);
			});
			// convert the results to strings after we know whether the result is expression
			aResults.forEach(function (oResult) {
				if (bExpression) {
					// the expression might have a lower operator precedence than '+'
					Expression.wrapExpression(oResult);
				}
				if (oResult.type !== 'edm:Null') {
					// ignore null (otherwise the string 'null' would appear in expressions)
					aParts.push(Basics.resultToString(oResult, bExpression, true));
				}
			});
			oResult = bExpression
				? {result: "expression", value: aParts.join("+")}
				: {result: "composite", value: aParts.join("")};
			oResult.type = "Edm.String";
			return oResult;
		},

		/**
		 * Handling of "14.5.6 Expression edm:If".
		 *
		 * @param {sap.ui.core.util.XMLPreprocessor.IContext|sap.ui.model.Context} oInterface
		 *   the callback interface related to the current formatter call
		 * @param {object} oPathValue
		 *   a path/value pair pointing to the parameters array. The first parameter element is the
		 *   conditional expression and must evaluate to a Edm.Boolean. The second and third child
		 *   elements are the expressions, which are evaluated conditionally.
		 * @returns {object}
		 *   the result object
		 */
		conditional: function (oInterface, oPathValue) {
			var oCondition = Expression.parameter(oInterface, oPathValue, 0, "Edm.Boolean"),
				oThen = Expression.parameter(oInterface, oPathValue, 1),
				oElse = Expression.parameter(oInterface, oPathValue, 2),
				sType = oThen.type;

			if (oThen.type === "edm:Null") {
				sType = oElse.type;
			} else if (oElse.type !== "edm:Null" && oThen.type !== oElse.type) {
				Basics.error(oPathValue,
					"Expected same type for second and third parameter, types are '" + oThen.type
					+ "' and '" + oElse.type + "'");
			}
			return {
				result: "expression",
				type: sType,
				value: Basics.resultToString(Expression.wrapExpression(oCondition), true)
					+ "?" + Basics.resultToString(Expression.wrapExpression(oThen), true)
					+ ":" + Basics.resultToString(Expression.wrapExpression(oElse), true)
			};
		},

		/**
		 * Handling of "14.4 Constant Expressions", i.e.
		 * <ul>
		 *   <li>"14.4.2 Expression edm:Bool",</li>
		 *   <li>"14.4.3 Expression edm:Date",</li>
		 *   <li>"14.4.4 Expression edm:DateTimeOffset",</li>
		 *   <li>"14.4.5 Expression edm:Decimal",</li>
		 *   <li>"14.4.8 Expression edm:Float",</li>
		 *   <li>"14.4.9 Expression edm:Guid",</li>
		 *   <li>"14.4.10 Expression edm:Int",</li>
		 *   <li>"14.4.11 Expression edm:String",</li>
		 *   <li>"14.4.12 Expression edm:TimeOfDay".</li>
		 * </ul>
		 *
		 * @param {sap.ui.core.util.XMLPreprocessor.IContext|sap.ui.model.Context} oInterface
		 *   the callback interface related to the current formatter call
		 * @param {object} oPathValue
		 *   a path/value pair pointing to the constant
		 * @param {string} sEdmType
		 *   the "edm:*" type of the constant, e.g. "Bool" or "Int"
		 * @returns {object}
		 *   the result object
		 */
		constant: function (oInterface, oPathValue, sEdmType) {
			var sValue = oPathValue.value;

			Basics.expectType(oPathValue, "string");

			if (sEdmType === "String") {
				if (rI18n.test(sValue)) { // a simple binding to "@i18n" model
					return {
						ignoreTypeInPath: true,
						result : "binding",
						type: "Edm.String",
						value : sValue.slice(1, -1) // cut off "{" and "}"
					};
				} else if (oInterface.getSetting && oInterface.getSetting("bindTexts")) {
					// We want a model binding to the path in the metamodel (which is
					// oPathValue.path)
					// "/##" is prepended because it leads from model to metamodel
					return {
						result : "binding",
						type: "Edm.String",
						ignoreTypeInPath: true,
						value : "/##" + Expression.replaceIndexes(oInterface.getModel(),
							oPathValue.path)
					};
				}
				sEdmType = "Edm.String";
			} else if (!mEdmType2RegExp[sEdmType].test(sValue)) {
				Basics.error(oPathValue,
					"Expected " + sEdmType + " value but instead saw '" + sValue + "'");
			} else {
				sEdmType = mType2Type[sEdmType];
				if (sEdmType === "Edm.Int64"
						&& ODataUtils.compare(sValue, sMinSafeInteger, true) >= 0
						&& ODataUtils.compare(sValue, sMaxSafeInteger, true) <= 0) {
					sEdmType = "Edm.Int32";
				}
			}

			return {
				result : "constant",
				type : sEdmType,
				value : sValue
			};
		},

		/**
		 * Calculates an expression.
		 *
		 * @param {sap.ui.core.util.XMLPreprocessor.IContext|sap.ui.model.Context} oInterface
		 *   the callback interface related to the current formatter call
		 * @param {object} oPathValue
		 *   a path/value pair pointing to the parameters array
		 * @param {string} oPathValue.path
		 * 	 the metamodel path to start at
		 * @param {any} oPathValue.value
		 *   the value at this path
		 * @param {boolean} bExpression
		 *   if <code>true</code> an embedded concat must use expression binding
		 * @returns {object}
		 *   the result object
		 */
		expression: function (oInterface, oPathValue, bExpression) {
			var oRawValue = oPathValue.value,
				oSubPathValue,
				sType;

			Basics.expectType(oPathValue, "object");

			if (oRawValue.hasOwnProperty("Type")) {
				sType = Basics.property(oPathValue, "Type", "string");
				oSubPathValue = Basics.descend(oPathValue, "Value");
			} else {
				["And", "Apply", "Bool", "Date", "DateTimeOffset", "Decimal", "Float", "Eq", "Ge",
					"Gt", "Guid", "If", "Int", "Le", "Lt", "Ne", "Not", "Null", "Or", "Path",
					"PropertyPath", "String", "TimeOfDay"
				].forEach(function (sProperty) {
					if (oRawValue.hasOwnProperty(sProperty)) {
						sType = sProperty;
						oSubPathValue = Basics.descend(oPathValue, sProperty);
					}
				});
			}

			switch (sType) {
				case "Apply": // 14.5.3 Expression edm:Apply
					return Expression.apply(oInterface, oSubPathValue, bExpression);
				case "If": // 14.5.6 Expression edm:If
					return Expression.conditional(oInterface, oSubPathValue);
				case "Path": // 14.5.12 Expression edm:Path
				case "PropertyPath": // 14.5.13 Expression edm:PropertyPath
					return Expression.path(oInterface, oSubPathValue);
				case "Bool": // 14.4.2 Expression edm:Bool
				case "Date": // 14.4.3 Expression edm:Date
				case "DateTimeOffset": // 14.4.4 Expression edm:DateTimeOffset
				case "Decimal": // 14.4.5 Expression edm:Decimal
				case "Float": // 14.4.8 Expression edm:Float
				case "Guid": // 14.4.9 Expression edm:Guid
				case "Int": // 14.4.10 Expression edm:Int
				case "String": // 14.4.11 Expression edm:String
				case "TimeOfDay": // 14.4.12 Expression edm:TimeOfDay
					return Expression.constant(oInterface, oSubPathValue, sType);
				case "And":
				case "Eq":
				case "Ge":
				case "Gt":
				case "Le":
				case "Lt":
				case "Ne":
				case "Or":
					// 14.5.1 Comparison and Logical Operators
					return Expression.operator(oInterface, oSubPathValue, sType);
				case "Not":
					// 14.5.1 Comparison and Logical Operators
					return Expression.not(oInterface, oSubPathValue);
				case "Null":
					// 14.5.10 Expression edm:Null
					return {
						result: "constant",
						value: "null",
						type: "edm:Null"
					};
				default:
					Basics.error(oPathValue, "Unsupported OData expression");
			}
		},

		/**
		 * Formats the result to be an operand for a logical or comparison operator. Handles
		 * constants accordingly.
		 *
		 * @param {object} oPathValue
		 *   a path/value pair pointing to the parameters array (for a possible error message)
		 * @param {int} iIndex
		 *   the parameter index (for a possible error message)
		 * @param {object} oResult
	 	 *   a result object with category
		 * @param {boolean} bWrapExpression
		 *   if true, wrap an expression in <code>oResult</code> with "()"
		 * @returns {string}
		 *   the formatted result
		 */
		formatOperand: function (oPathValue, iIndex, oResult, bWrapExpression) {
			var oDate;

			if (oResult.result === "constant") {
				switch (oResult.category) {
					case "boolean":
					case "number":
						return oResult.value;
					case "date":
						oDate = Expression.parseDate(oResult.value);
						if (!oDate) {
							Basics.error(Basics.descend(oPathValue, iIndex),
									"Invalid Date " + oResult.value);
						}
						return String(oDate.getTime());
					case "datetime":
						oDate = Expression.parseDateTimeOffset(oResult.value);
						if (!oDate) {
							Basics.error(Basics.descend(oPathValue, iIndex),
									"Invalid DateTime " + oResult.value);
						}
						return String(oDate.getTime());
					case "time":
						return String(Expression.parseTimeOfDay(oResult.value).getTime());
					// no default
				}
			}
			if (bWrapExpression) {
				Expression.wrapExpression(oResult);
			}
			return Basics.resultToString(oResult, true);
		},

		/**
		 * Calculates an expression. Ensures that errors that are thrown via {#error} while
		 * processing are handled accordingly.
		 *
		 * @param {sap.ui.core.util.XMLPreprocessor.IContext|sap.ui.model.Context} oInterface
		 *   the callback interface related to the current formatter call
		 * @param {object} oRawValue
		 *   the raw value from the meta model
		 * @param {boolean} bWithType
		 *   if <code>true</code>, embedded bindings contain type information
		 * @returns {string}
		 *   the expression value or "Unsupported: oRawValue" in case of an error or
		 *   <code>undefined</code> in case the raw value is undefined.
		 */
		getExpression: function (oInterface, oRawValue, bWithType) {
			var oResult;

			if (oRawValue === undefined) {
				return undefined;
			}

			if ( !Expression.simpleParserWarningLogged &&
					ManagedObject.bindingParser === BindingParser.simpleParser) {
				jQuery.sap.log.warning("Complex binding syntax not active", null,
					"sap.ui.model.odata.AnnotationHelper");
				Expression.simpleParserWarningLogged = true;
			}

			try {
				oResult = Expression.expression(oInterface, {
					path: oInterface.getPath(),
					value: oRawValue
				}, /*bExpression*/false);
				return Basics.resultToString(oResult, false, bWithType);
			} catch (e) {
				if (e instanceof SyntaxError) {
					return "Unsupported: "
						+ BindingParser.complexParser.escape(Basics.toErrorString(oRawValue));
				}
				throw e;
			}
		},

		/**
		 * Handling of "14.5.3.1.2 Function odata.fillUriTemplate".
		 *
		 * @param {sap.ui.core.util.XMLPreprocessor.IContext|sap.ui.model.Context} oInterface
		 *   the callback interface related to the current formatter call
		 * @param {object} oPathValue
		 *   a path/value pair pointing to the parameters array
		 * @returns {object}
		 *   the result object
		 */
		fillUriTemplate: function (oInterface, oPathValue) {
			var i,
				sName,
				aParts = [],
				sPrefix = "",
				oParameter,
				aParameters = oPathValue.value,
				oResult,
				oTemplate = Expression.parameter(oInterface, oPathValue, 0, "Edm.String");

			aParts.push('odata.fillUriTemplate(', Basics.resultToString(oTemplate, true), ',{');
			for (i = 1; i < aParameters.length; i += 1) {
				oParameter = Basics.descend(oPathValue, i, "object");
				sName = Basics.property(oParameter, "Name", "string");
				oResult = Expression.expression(oInterface, Basics.descend(oParameter, "Value"),
					/*bExpression*/true);
				aParts.push(sPrefix, Basics.toJSON(sName), ":",
					Basics.resultToString(oResult, true));
				sPrefix = ",";
			}
			aParts.push("})");
			return {
				result: "expression",
				value: aParts.join(""),
				type: "Edm.String"
			};
		},

		/**
		 * Handling of "14.5.1 Comparison and Logical Operators": <code>edm:Not</code>.
		 *
		 * @param {sap.ui.core.util.XMLPreprocessor.IContext|sap.ui.model.Context} oInterface
		 *   the callback interface related to the current formatter call
		 * @param {object} oPathValue
		 *   a path/value pair pointing to the parameter
		 * @returns {object}
		 *   the result object
		 */
		not: function (oInterface, oPathValue) {
			var oParameter = Expression.expression(oInterface, oPathValue, true);

			return {
				result: "expression",
				value: "!" + Basics.resultToString(Expression.wrapExpression(oParameter), true),
				type: "Edm.Boolean"
			};
		},

		/**
		 * Handling of "14.5.1 Comparison and Logical Operators" except <code>edm:Not</code>.
		 *
		 * @param {sap.ui.core.util.XMLPreprocessor.IContext|sap.ui.model.Context} oInterface
		 *   the callback interface related to the current formatter call
		 * @param {object} oPathValue
		 *   a path/value pair pointing to the parameter array
		 * @param {string} sType
		 *   the operator as text (like "And" or "Or")
		 * @returns {object}
		 *   the result object
		 */
		operator: function (oInterface, oPathValue, sType) {
			var sExpectedEdmType = sType === "And" || sType === "Or" ? "Edm.Boolean" : undefined,
				oParameter0 = Expression.parameter(oInterface, oPathValue, 0, sExpectedEdmType),
				oParameter1 = Expression.parameter(oInterface, oPathValue, 1, sExpectedEdmType),
				sTypeInfo,
				bNeedsCompare,
				sValue0,
				sValue1;

			if (oParameter0.type !== "edm:Null" && oParameter1.type !== "edm:Null") {
				oParameter0.category = mType2Category[oParameter0.type];
				oParameter1.category = mType2Category[oParameter1.type];
				Expression.adjustOperands(oParameter0, oParameter1);
				Expression.adjustOperands(oParameter1, oParameter0);

				if (oParameter0.category !== oParameter1.category) {
					Basics.error(oPathValue,
						"Expected two comparable parameters but instead saw " + oParameter0.type
						+ " and " + oParameter1.type);
				}
				sTypeInfo = oParameter0.category === "decimal" ? ",true" : "";
				bNeedsCompare = mTypeCategoryNeedsCompare[oParameter0.category];
			}
			sValue0 = Expression.formatOperand(oPathValue, 0, oParameter0, !bNeedsCompare);
			sValue1 = Expression.formatOperand(oPathValue, 1, oParameter1, !bNeedsCompare);
			return {
				result: "expression",
				value: bNeedsCompare
							? "odata.compare(" + sValue0 + "," + sValue1 + sTypeInfo + ")"
								+ mOData2JSOperators[sType] + "0"
							: sValue0 + mOData2JSOperators[sType] + sValue1,
				type: "Edm.Boolean"
			};
		},

		/**
		 * Evaluates a parameter and ensures that the result is of the given EDM type.
		 *
		 * The function calls <code>expression</code> with <code>bExpression=true</code>. This will
		 * cause any embedded <code>odata.concat</code> to generate an expression binding. This
		 * should be correct in any case because only a standalone <code>concat</code> may generate
		 * a composite binding.
		 *
		 * @param {sap.ui.core.util.XMLPreprocessor.IContext|sap.ui.model.Context} oInterface
		 *   the callback interface related to the current formatter call
		 * @param {object} oPathValue
		 *   a path/value pair pointing to the parameter array
		 * @param {int} iIndex
		 *   the parameter index
		 * @param {string} [sEdmType]
		 *   the expected EDM type or <code>undefined</code> if any type is allowed
		 * @returns {object}
		 *   the result object
		 */
		parameter: function (oInterface, oPathValue, iIndex, sEdmType) {
			var oParameter = Basics.descend(oPathValue, iIndex),
				oResult = Expression.expression(oInterface, oParameter, /*bExpression*/true);

			if (sEdmType && sEdmType !== oResult.type) {
				Basics.error(oParameter,
					"Expected " + sEdmType + " but instead saw " + oResult.type);
			}
			return oResult;
		},

		/**
		 * Parses an Edm.Date value and returns the corresponding JavaScript Date value.
		 *
		 * @param {string} sValue
		 *   the Edm.Date value to parse
		 * @returns {Date}
		 *   the JavaScript Date value or <code>null</code> in case the input could not be parsed
		 */
		parseDate: function (sValue) {
			return DateFormat.getDateInstance({
					pattern: "yyyy-MM-dd",
					strictParsing: true,
					UTC: true
				}).parse(sValue);
		},

		/**
		 * Parses an Edm.DateTimeOffset value and returns the corresponding JavaScript Date value.
		 *
		 * @param {string} sValue
		 *   the Edm.DateTimeOffset value to parse
		 * @returns {Date}
		 *   the JavaScript Date value or <code>null</code> in case the input could not be parsed
		 */
		parseDateTimeOffset: function (sValue) {
			var aMatches = mEdmType2RegExp.DateTimeOffset.exec(sValue);
			if (aMatches && aMatches[1] && aMatches[1].length > 4) {
				// "round" to millis, BEWARE of the dot!
				sValue = sValue.replace(aMatches[1], aMatches[1].slice(0, 4));
			}

			return DateFormat.getDateTimeInstance({
				pattern: "yyyy-MM-dd'T'HH:mm:ss.SSSX",
				strictParsing: true
			}).parse(sValue.toUpperCase());
		},

		/**
		 * Parses an Edm.TimeOfDay value and returns the corresponding JavaScript Date value.
		 *
		 * @param {string} sValue
		 *   the Edm.TimeOfDay value to parse
		 * @returns {Date}
		 *   the JavaScript Date value or <code>null</code> in case the input could not be parsed
		 */
		parseTimeOfDay: function (sValue) {
			if (sValue.length > 12) {
				// "round" to millis: "HH:mm:ss.SSS"
				sValue = sValue.slice(0, 12);
			}

			return DateFormat.getTimeInstance({
				pattern: "HH:mm:ss.SSS",
				strictParsing: true,
				UTC: true
			}).parse(sValue);
		},

		/**
		 * Handling of "14.5.12 Expression edm:Path" and "14.5.13 Expression edm:PropertyPath";
		 * embedded within an entity set or entity type (see {@link Basics.followPath}).
		 *
		 * @param {sap.ui.core.util.XMLPreprocessor.IContext|sap.ui.model.Context} oInterface
		 *   the callback interface related to the current formatter call
		 * @param {object} oPathValue
		 *   a path/value pair pointing to the edm:Path
		 * @returns {object}
		 *   the result object
		 */
		path: function (oInterface, oPathValue) {
			var sBindingPath = oPathValue.value,
				oConstraints = {},
				oModel = oInterface.getModel(),
				oPathValueInterface = {
					getModel : function () { return oModel; },
					getPath : function () { return oPathValue.path; }
				},
				oProperty,
				oResult = {result: "binding", value: sBindingPath},
				oTarget;

			Basics.expectType(oPathValue, "string");

			// Note: "PropertyPath" is treated the same...
			oTarget = Basics.followPath(oPathValueInterface, {"Path" : sBindingPath});

			if (oTarget && oTarget.resolvedPath) {
				oProperty = oModel.getProperty(oTarget.resolvedPath);
				oResult.type = oProperty.type;
				switch (oProperty.type) {
				case "Edm.DateTime":
					oConstraints.displayFormat = oProperty["sap:display-format"];
					break;
				case "Edm.Decimal":
					oConstraints.precision = oProperty.precision;
					oConstraints.scale = oProperty.scale;
					break;
				case "Edm.String":
					oConstraints.maxLength = oProperty.maxLength;
					break;
				// no default
				}
				if (oProperty.nullable === "false") {
					oConstraints.nullable = oProperty.nullable;
				}
				oResult.constraints = oConstraints;
			} else {
				jQuery.sap.log.warning("Could not find property '" + sBindingPath
					+ "' starting from '" + oPathValue.path + "'", null,
					"sap.ui.model.odata.AnnotationHelper");
			}

			return oResult;
		},

		/**
		 * Replaces the indexes in the given path by queries in the form
		 * <code>[${key}==='value']</code> if possible. Expects the path to start with
		 * "/dataServices/schema/<i>/".
		 *
		 * @param {sap.ui.model.Model} oModel
		 *   the model the path belongs to
		 * @param {string} sPath
		 *   the path, where to replace the indexes
		 * @returns {string}
		 *   the replaced path
		 */
		replaceIndexes: function (oModel, sPath) {
			var aMatches,
				aParts = sPath.split('/'),
				sObjectPath,
				sRecordType;

			/**
			 * Processes the property with the given path of the object at <code>sObjectPath</code>.
			 * If it exists and is of type "string", the index at position <code>i</code> in
			 * <code>aParts</code> is replaced by a query "[${propertyPath}==='propertyValue']".
			 *
			 * @param {string} sPropertyPath the property path
			 * @param {number} i the index in aParts
			 * @returns {boolean} true if the index was replaced by a query
			 */
			function processProperty(sPropertyPath, i) {
				var sProperty = oModel.getProperty(sObjectPath + "/" + sPropertyPath);

				if (typeof sProperty === "string") {
					aParts[i] = "[${" + sPropertyPath + "}===" + Basics.toJSON(sProperty) + "]";
					return true;
				}
				return false;
			}

			aMatches = rSchemaPath.exec(sPath);
			if (!aMatches) {
				return sPath;
			}
			sObjectPath = aMatches[1];
			// aParts now contains ["", "dataServices", "schema", "<i>", ...]
			// try to replace the schema index in aParts[3] by a query for the schema's namespace
			if (!processProperty("namespace", 3)) {
				return sPath;
			}
			// continue after the schema index
			for (var i = 4; i < aParts.length; i++) {
				sObjectPath = sObjectPath + "/" + aParts[i];
				// if there is an index, first try a query for "name"
				if (rInteger.test(aParts[i]) && !processProperty("name", i)) {
					// check data fields: since they always extend DataFieldAbstract, the record
					// type must be given
					sRecordType = oModel.getProperty(sObjectPath + "/RecordType");
					if (sRecordType) {
						if (sRecordType === "com.sap.vocabularies.UI.v1.DataFieldForAction") {
							processProperty("Action/String", i);
						} else if (sRecordType ===
								"com.sap.vocabularies.UI.v1.DataFieldForAnnotation") {
							processProperty("Target/AnnotationPath", i);
						} else if (sRecordType.indexOf("com.sap.vocabularies.UI.v1.DataField")
								=== 0) {
							processProperty("Value/Path", i);
						}
					}
				}
			}
			return aParts.join('/');
		},

		/**
		 * Flag indicating that warning for missing complex binding parser has already been logged.
		 *
		 * @type {boolean}
		*/
		simpleParserWarningLogged : false,

		/**
		 * Handling of "14.5.3.1.3 Function odata.uriEncode".
		 *
		 * @param {sap.ui.core.util.XMLPreprocessor.IContext|sap.ui.model.Context} oInterface
		 *   the callback interface related to the current formatter call
		 * @param {object} oPathValue
		 *   a path/value pair pointing to the parameters array
		 * @returns {object}
		 *   the result object
		 */
		uriEncode: function (oInterface, oPathValue) {
			var oResult = Expression.parameter(oInterface, oPathValue, 0);

			if (oResult.result === "constant") {
				// convert v4 to v2 for sap.ui.model.odata.ODataUtils
				if (oResult.type === "Edm.Date") {
					oResult.type = "Edm.DateTime";
					// Note: ODataUtils.formatValue calls Date.parse() indirectly, use UTC to make
					// sure IE9 does not mess with time zone
					oResult.value = oResult.value + "T00:00:00Z";
				} else if (oResult.type === "Edm.TimeOfDay") {
					oResult.type = "Edm.Time";
					oResult.value = "PT"
						+ oResult.value.slice(0, 2) + "H"
						+ oResult.value.slice(3, 5) + "M"
						+ oResult.value.slice(6, 8) + "S";
				}
			}

			return {
				result: "expression",
				value: 'odata.uriEncode(' + Basics.resultToString(oResult, true) + ","
					+ Basics.toJSON(oResult.type) + ")",
				type: "Edm.String"
			};
		},

		/**
		 * Wraps the result's value with "()" in case it is an expression because the result will be
		 * become a parameter of an infix operator and we have to ensure that the operator precedence
		 * remains correct.
		 *
		 * @param {object} oResult
		 *   a result object
		 * @returns {object}
		 *   the given result object (for chaining)
		 */
		wrapExpression: function (oResult) {
			if (oResult.result === "expression") {
				oResult.value = "(" + oResult.value + ")";
			}
			return oResult;
		}
	};

	return Expression;

}, /* bExport= */ false);
