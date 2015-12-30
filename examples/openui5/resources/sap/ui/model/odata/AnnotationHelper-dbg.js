/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides object sap.ui.model.odata.AnnotationHelper
sap.ui.define([
	"jquery.sap.global",
	"sap/ui/base/BindingParser",
	"./_AnnotationHelperBasics",
	"./_AnnotationHelperExpression"
], function(jQuery, BindingParser, Basics, Expression) {
		'use strict';

		var AnnotationHelper;

		/**
		 * Returns a function representing the composition <code>fnAfter</code> after
		 * <code>fnBefore</code>.
		 *
		 * @param {function} fnAfter
		 *   the second function, taking a single argument
		 * @param {function} [fnBefore]
		 *   the optional first function, taking multiple arguments
		 * @returns {function}
		 *   the composition <code>fnAfter</code> after <code>fnBefore</code>
		 */
		function chain(fnAfter, fnBefore) {
			if (!fnBefore) {
				return fnAfter;
			}

			function formatter() {
				return fnAfter.call(this, fnBefore.apply(this, arguments));
			}
			return formatter;
		}

		/**
		 * @classdesc
		 * A collection of methods which help to consume
		 * <a href="http://docs.oasis-open.org/odata/odata/v4.0/odata-v4.0-part3-csdl.html">
		 * OData v4 annotations</a> in XML template views.
		 *
		 * Formatter functions like {@link #.format format} and {@link #.simplePath simplePath} can
		 * be used in complex bindings to turn OData v4 annotations into texts or data bindings,
		 * e.g. <code>&lt;sfi:SmartField value="{path: 'meta>Value', formatter:
		 * 'sap.ui.model.odata.AnnotationHelper.simplePath'}"/></code>.
		 *
		 * Helper functions like {@link #.resolvePath resolvePath} can be used by template
		 * instructions in XML template views, e.g. <code>&lt;template:with path="meta>Value"
		 * helper="sap.ui.model.odata.AnnotationHelper.resolvePath" var="target"></code>.
		 *
		 * Since 1.31.0, you DO NOT need to {@link jQuery.sap.require} this module before use.
		 *
		 * @public
		 * @since 1.27.0
		 * @namespace sap.ui.model.odata.AnnotationHelper
		 */
		AnnotationHelper = /** @lends sap.ui.model.odata.AnnotationHelper */ {
			/**
			 * Creates a property setting (which is either a constant value or a binding info
			 * object) from the given parts and from the optional root formatter function.
			 * Each part can have one of the following types:
			 * <ul>
			 *   <li><code>boolean</code>, <code>number</code>, <code>undefined</code>: The part is
			 *   a constant value.
			 *
			 *   <li><code>string</code>: The part is a data binding expression with complex
			 *   binding syntax (for example, as created by {@link #.format format}) and is parsed
			 *   accordingly to create either a constant value or a binding info object. Proper
			 *   backslash escaping must be used for constant values with curly braces.
			 *
			 *   <li><code>object</code>: The part is a binding info object if it has a "path" or
			 *   "parts" property, otherwise it is a constant value.
			 * </ul>
			 * If a binding info object is not the only part and has a "parts" property itself,
			 * then it must have no other properties except "formatter"; this is the case for
			 * expression bindings and data binding expressions created by {@link #.format format}.
			 *
			 * If all parts are constant values, the resulting property setting is also a constant
			 * value computed by applying the root formatter function to the constant parts once.
			 * If at least one part is a binding info object, the resulting property setting is
			 * also a binding info object and the root formatter function will be applied again and
			 * again to the current values of all parts, no matter whether constant or variable.
			 *
			 * Note: The root formatter function should not rely on its <code>this</code> value
			 * because it depends on how the function is called.
			 *
			 * Note: A single data binding expression can be given directly to
			 * {@link sap.ui.base.ManagedObject#applySettings applySettings}, no need to call this
			 * function first.
			 *
			 * Example:
			 * <pre>
			 * function myRootFormatter(oValue1, oValue2, sFullName, sGreeting, iAnswer) {
			 *     return ...; //TODO compute something useful from the given values
			 * }
			 *
			 * oSupplierContext = oMetaModel.getMetaContext("/ProductSet('HT-1021')/ToSupplier");
			 * oValueContext = oMetaModel.createBindingContext("com.sap.vocabularies.UI.v1.DataPoint/Value", oSupplierContext);
			 *
			 * vPropertySetting =  sap.ui.model.odata.AnnotationHelper.createPropertySetting([
			 *     sap.ui.model.odata.AnnotationHelper.format(oValueContext),
			 *     "{path: 'meta>Value', formatter: 'sap.ui.model.odata.AnnotationHelper.simplePath'}",
			 *     "{:= 'Mr. ' + ${/FirstName} + ' ' + ${/LastName}}",
			 *     "hello, world!",
			 *     42
			 * ], myRootFormatter);
			 *
			 * oControl.applySettings({"someProperty" : vPropertySetting});
			 * </pre>
			 *
			 * @param {any[]} vParts
			 *   array of parts
			 * @param {function} [fnRootFormatter]
			 *   root formatter function; default: <code>Array.prototype.join(., " ")</code>
			 *   in case of multiple parts, just like
			 *   {@link sap.ui.model.CompositeBinding#getExternalValue getExternalValue}
			 * @returns {any|object}
			 *   constant value or binding info object for a property as expected by
			 *   {@link sap.ui.base.ManagedObject#applySettings applySettings}
			 * @throws {Error}
			 *   if some part has an unsupported type or refers to a function name which is not
			 *   found
			 * @public
			 * @since 1.31.0
			 */
			createPropertySetting : function (vParts, fnRootFormatter) {
				var bMergeNeeded = false,
					vPropertySetting;

				vParts = vParts.slice(); // shallow copy to avoid changes visible to caller
				vParts.forEach(function (vPart, i) {
					switch (typeof vPart) {
					case "boolean":
					case "number":
					case "undefined":
						bMergeNeeded = true;
						break;

					case "string":
						vPropertySetting = BindingParser.complexParser(vPart, null, true, true);
						if (vPropertySetting !== undefined) {
							if (vPropertySetting.functionsNotFound) {
								throw new Error("Function name(s) "
									+ vPropertySetting.functionsNotFound.join(", ")
									+  " not found");
							}
							vParts[i] = vPart = vPropertySetting;
						}
						// falls through
					case "object":
						// merge is needed if some parts are constants or again have parts
						// Note: a binding info object has either "path" or "parts"
						if (!vPart || typeof vPart !== "object" || !("path" in vPart)) {
							bMergeNeeded = true;
						}
						break;

					default:
						throw new Error("Unsupported part: " + vPart);
					}
				});

				vPropertySetting = {
					formatter : fnRootFormatter,
					parts : vParts
				};
				if (bMergeNeeded) {
					BindingParser.mergeParts(vPropertySetting);
				}

				if (vPropertySetting.parts.length === 0) {
					// special case: all parts are constant values, call formatter once
					vPropertySetting = vPropertySetting.formatter && vPropertySetting.formatter();
					if (typeof vPropertySetting === "string") {
						vPropertySetting = BindingParser.complexParser.escape(vPropertySetting);
					}
				} else if (vPropertySetting.parts.length === 1) {
					// special case: a single property setting only
					// Note: sap.ui.base.ManagedObject#_bindProperty cannot handle the single-part
					//       case with two formatters, unless the root formatter is marked with
					//       "textFragments". We unpack here and chain the formatters ourselves.
					fnRootFormatter = vPropertySetting.formatter;
					vPropertySetting = vPropertySetting.parts[0];
					if (fnRootFormatter) {
						vPropertySetting.formatter
							= chain(fnRootFormatter, vPropertySetting.formatter);
					}
				}

				return vPropertySetting;
			},

			/**
			 * A formatter function to be used in a complex binding inside an XML template view
			 * in order to interpret OData v4 annotations. It knows about
			 * <ul>
			 *   <li> the "14.4 Constant Expressions" for "edm:Bool", "edm:Date",
			 *   "edm:DateTimeOffset", "edm:Decimal", "edm:Float", "edm:Guid", "edm:Int",
			 *   "edm:TimeOfDay".
			 *   <li> the constant "14.4.11 Expression edm:String": This is turned into a fixed
			 *   text (e.g. <code>"Width"</code>) or into a data binding expression (e.g. <code>
			 *   "{/##/dataServices/schema/0/entityType/1/com.sap.vocabularies.UI.v1.FieldGroup#Dimensions/Data/0/Label/String}"
			 *   </code>). Data binding expressions are used in case XML template processing has
			 *   been started with the setting <code>bindTexts : true</code>. The purpose is to
			 *   reference translatable texts from OData v4 annotations, especially for XML
			 *   template processing at design time. Since 1.31.0, string constants that contain a
			 *   simple binding <code>"{@i18n>...}"</code> to the hard-coded model name "@i18n"
			 *   with arbitrary path are not turned into a fixed text, but kept as a data binding
			 *   expression; this allows local annotation files to refer to a resource bundle for
			 *   internationalization.
			 *   <li> the dynamic "14.5.1 Comparison and Logical Operators": These are turned into
			 *   expression bindings to perform the operations at run-time.
			 *   <li> the dynamic "14.5.3 Expression edm:Apply":
			 *   <ul>
			 *     <li> "14.5.3.1.1 Function odata.concat": This is turned into a data binding
			 *     expression relative to an entity.
			 *     <li> "14.5.3.1.2 Function odata.fillUriTemplate": This is turned into an
			 *     expression binding to fill the template at run-time.
			 *     <li> "14.5.3.1.3 Function odata.uriEncode": This is turned into an expression
			 *     binding to encode the parameter at run-time.
			 *     <li> Apply functions may be nested arbitrarily.
			 *   </ul>
			 *   <li> the dynamic "14.5.6 Expression edm:If": This is turned into an expression
			 *   binding to be evaluated at run-time. The expression is a conditional expression
			 *   like <code>"{=condition ? expression1 : expression2}"</code>.
			 *   <li> the dynamic "14.5.10 Expression edm:Null": This is turned into a
			 *   <code>null</code> value. In <code>odata.concat</code> it is ignored.
			 *   <li> the dynamic "14.5.12 Expression edm:Path" and "14.5.13 Expression
			 *   edm:PropertyPath": This is turned into a data binding relative to an entity,
			 *   including type information and constraints as available from meta data,
			 *   e.g. <code>"{path : 'Name', type : 'sap.ui.model.odata.type.String',
			 *   constraints : {'maxLength':'255'}}"</code>.
			 * </ul>
			 * Unsupported or incorrect values are turned into a string nevertheless, but indicated
			 * as such. Proper escaping is used to make sure that data binding syntax is not
			 * corrupted. An error describing the problem is logged to the console in such a case.
			 *
			 * Example:
			 * <pre>
			 * &lt;Text text="{path: 'meta>Value', formatter: 'sap.ui.model.odata.AnnotationHelper.format'}" />
			 * </pre>
			 *
			 * @param {sap.ui.core.util.XMLPreprocessor.IContext|sap.ui.model.Context} oInterface
			 *   the callback interface related to the current formatter call
			 * @param {any} [vRawValue]
			 *   the raw value from the meta model, which is embedded within an entity set or
			 *   entity type:
			 *   <ul>
			 *   <li>if this function is used as formatter the value
			 *   is provided by the framework</li>
			 *   <li>if this function is called directly, provide the parameter only if it is
			 *   already calculated</li>
			 *   <li>if the parameter is omitted, it is calculated automatically through
			 *   <code>oInterface.getObject("")</code></li>
			 *   </ul>
			 * @returns {string}
			 *   the resulting string value to write into the processed XML
			 * @public
			 */
			format : function (oInterface, vRawValue) {
				if (arguments.length === 1) {
					vRawValue = oInterface.getObject("");
				}
				return Expression.getExpression(oInterface, vRawValue, true);
			},

			/**
			 * A formatter function to be used in a complex binding inside an XML template view
			 * in order to interpret OData v4 annotations. It knows about the following dynamic
			 * expressions:
			 * <ul>
			 * <li>"14.5.2 Expression edm:AnnotationPath"</li>
			 * <li>"14.5.11 Expression edm:NavigationPropertyPath"</li>
			 * <li>"14.5.12 Expression edm:Path"</li>
			 * <li>"14.5.13 Expression edm:PropertyPath"</li>
			 * </ul>
			 * It returns a binding expression for a navigation path in an OData model, starting at
			 * an entity.
			 * Currently supports navigation properties. Term casts and annotations of
			 * navigation properties terminate the navigation path.
			 *
			 * Examples:
			 * <pre>
			 * &lt;template:if test="{path: 'facet>Target', formatter: 'sap.ui.model.odata.AnnotationHelper.getNavigationPath'}">
			 *     &lt;form:SimpleForm binding="{path: 'facet>Target', formatter: 'sap.ui.model.odata.AnnotationHelper.getNavigationPath'}" />
			 * &lt;/template:if>
			 * </pre>
			 *
			 * @param {sap.ui.core.util.XMLPreprocessor.IContext|sap.ui.model.Context} oInterface
			 *   the callback interface related to the current formatter call
			 * @param {any} [vRawValue]
			 *   the raw value from the meta model, e.g. <code>{AnnotationPath :
			 *   "ToSupplier/@com.sap.vocabularies.Communication.v1.Address"}</code> or <code>
			 *   {AnnotationPath : "@com.sap.vocabularies.UI.v1.FieldGroup#Dimensions"}</code>;
			 *   embedded within an entity set or entity type;
			 *   <ul>
			 *   <li>if this function is used as formatter the value
			 *   is provided by the framework</li>
			 *   <li>if this function is called directly, provide the parameter only if it is
			 *   already calculated</li>
			 *   <li>if the parameter is omitted, it is calculated automatically through
			 *   <code>oInterface.getObject("")</code></li>
			 *   </ul>
			 * @returns {string}
			 *   the resulting string value to write into the processed XML, e.g. "{ToSupplier}"
			 *   or "{}" (in case no navigation is needed); returns "" in case the navigation path
			 *   cannot be determined (this is treated as falsy in <code>template:if</code>
			 *   statements!)
			 * @public
			 */
			getNavigationPath : function (oInterface, vRawValue) {
				if (arguments.length === 1) {
					vRawValue = oInterface.getObject("");
				}
				var oResult = Basics.followPath(oInterface, vRawValue);

				return oResult
					? "{" + oResult.navigationProperties.join("/") + "}"
					: "";
			},

			/**
			 * Helper function for a <code>template:with</code> instruction that depending on how
			 * it is called goes to the entity set with the given name or to the one determined
			 * by the last navigation property. Supports the following dynamic expressions:
			 * <ul>
			 * <li>"14.5.2 Expression edm:AnnotationPath"</li>
			 * <li>"14.5.11 Expression edm:NavigationPropertyPath"</li>
			 * <li>"14.5.12 Expression edm:Path"</li>
			 * <li>"14.5.13 Expression edm:PropertyPath"</li>
			 * </ul>
			 *
			 * Example:
			 * <pre>
			 *   &lt;template:with path="facet>Target" helper="sap.ui.model.odata.AnnotationHelper.gotoEntitySet" var="entitySet"/>
			 *   &lt;template:with path="associationSetEnd>entitySet" helper="sap.ui.model.odata.AnnotationHelper.gotoEntitySet" var="entitySet"/>
			 * </pre>
			 *
			 * @param {sap.ui.model.Context} oContext
			 *   a context which must point to a simple string or to an annotation (or annotation
			 *   property) of type <code>Edm.AnnotationPath</code>,
			 *   <code>Edm.NaviagtionPropertyPath</code>, <code>Edm.Path</code>, or
			 *   <code>Edm.PropertyPath</code> embedded within an entity set or entity type;
			 *   the context's model must be an {@link sap.ui.model.odata.ODataMetaModel}
			 * @returns {string}
			 *   the path to the entity set, or <code>undefined</code> if no such set is found
			 * @public
			 */
			gotoEntitySet : function (oContext) {
				var sEntitySet,
					vRawValue = oContext.getObject(),
					oResult;

				if (typeof vRawValue === "string") {
					sEntitySet = vRawValue;
				} else {
					oResult = Basics.followPath(oContext, vRawValue);
					sEntitySet = oResult
						&& oResult.associationSetEnd
						&& oResult.associationSetEnd.entitySet;
				}

				return sEntitySet
					? oContext.getModel().getODataEntitySet(sEntitySet, true)
					: undefined;
			},

			/**
			 * Helper function for a <code>template:with</code> instruction that goes to the
			 * entity type with the qualified name which <code>oContext</code> points at.
			 *
			 * Example: Assume that "entitySet" refers to an entity set within an OData meta model;
			 * the helper function is then called on the "entityType" property of that entity set
			 * (which holds the qualified name of the entity type) and in turn the path of that
			 * entity type is assigned to the variable "entityType".
			 * <pre>
			 *   &lt;template:with path="entitySet>entityType" helper="sap.ui.model.odata.AnnotationHelper.gotoEntityType" var="entityType">
			 * </pre>
			 *
			 * @param {sap.ui.model.Context} oContext
			 *   a context which must point to the qualified name of an entity type;
			 *   the context's model must be an {@link sap.ui.model.odata.ODataMetaModel}
			 * @returns {string}
			 *   the path to the entity type with the given qualified name,
			 *   or <code>undefined</code> if no such type is found
			 * @public
			 */
			gotoEntityType : function (oContext) {
				return oContext.getModel().getODataEntityType(oContext.getProperty(""), true);
			},

			/**
			 * Helper function for a <code>template:with</code> instruction that goes to the
			 * function import with the name which <code>oContext</code> points at.
			 *
			 * Example: Assume that "dataField" refers to a DataFieldForAction within an
			 * OData meta model;
			 * the helper function is then called on the "Action" property of that data field
			 * (which holds an object with the qualified name of the function import in the
			 * <code>String</code> property) and in turn the path of that function import
			 * is assigned to the variable "function".
			 * <pre>
			 *   &lt;template:with path="dataField>Action"
			 *   helper="sap.ui.model.odata.AnnotationHelper.gotoFunctionImport" var="function">
			 * </pre>
			 * @param {sap.ui.model.Context} oContext
			 *   a context which must point to an object with a <code>String</code> property, which
			 *   holds the qualified name of the function import;
			 *   the context's model must be an {@link sap.ui.model.odata.ODataMetaModel}
			 * @returns {string}
			 *   the path to the function import with the given qualified name,
			 *   or <code>undefined</code> if no function import is found
			 * @since 1.29.1
			 * @public
			 */
			gotoFunctionImport : function (oContext) {
				return oContext.getModel().getODataFunctionImport(oContext.getProperty("String"),
					true);
			},

			/**
			 * A formatter function to be used in a complex binding inside an XML template view
			 * in order to interpret OData v4 annotations. It knows about the following dynamic
			 * expressions:
			 * <ul>
			 * <li>"14.5.2 Expression edm:AnnotationPath"</li>
			 * <li>"14.5.11 Expression edm:NavigationPropertyPath"</li>
			 * <li>"14.5.12 Expression edm:Path"</li>
			 * <li>"14.5.13 Expression edm:PropertyPath"</li>
			 * </ul>
			 * It returns the information whether the navigation path ends with an association end
			 * with multiplicity "*". It throws an error if the navigation path has an association
			 * end with multiplicity "*" which is not the last one.
			 * Currently supports navigation properties. Term casts and annotations of
			 * navigation properties terminate the navigation path.
			 *
			 * Examples:
			 * <pre>
			 * &lt;template:if test="{path: 'facet>Target', formatter: 'sap.ui.model.odata.AnnotationHelper.isMultiple'}">
			 * </pre>
			 *
			 * @param {sap.ui.core.util.XMLPreprocessor.IContext|sap.ui.model.Context} oInterface
			 *   the callback interface related to the current formatter call
			 * @param {any} [vRawValue]
			 *   the raw value from the meta model, e.g. <code>{AnnotationPath :
			 *   "ToSupplier/@com.sap.vocabularies.Communication.v1.Address"}</code> or <code>
			 *   {AnnotationPath : "@com.sap.vocabularies.UI.v1.FieldGroup#Dimensions"}</code>;
			 *   embedded within an entity set or entity type;
			 *   <ul>
			 *   <li>if this function is used as formatter the value
			 *   is provided by the framework</li>
			 *   <li>if this function is called directly, provide the parameter only if it is
			 *   already calculated</li>
			 *   <li>if the parameter is omitted, it is calculated automatically through
			 *   <code>oInterface.getObject("")</code></li>
			 *   </ul>
			 * @returns {string}
			 *    <code>"true"</code> if the navigation path ends with an association end with
			 *    multiplicity "*", <code>""</code> in case the navigation path cannot be
			 *    determined, <code>"false"</code> otherwise (the latter are both treated as falsy
			 *    in <code>template:if</code> statements!)
			 * @throws {Error}
			 *   if the navigation path has an association end with multiplicity "*" which is not
			 *   the last one
			 * @public
			 */
			isMultiple : function (oInterface, vRawValue) {
				if (arguments.length === 1) {
					vRawValue = oInterface.getObject("");
				}
				var oResult = Basics.followPath(oInterface, vRawValue);

				if (oResult) {
					if (oResult.navigationAfterMultiple) {
						throw new Error(
							'Association end with multiplicity "*" is not the last one: '
							+ vRawValue.AnnotationPath);
					}
					return String(oResult.isMultiple);
				}
				return "";
			},

			/**
			 * Helper function for a <code>template:with</code> instruction that resolves a dynamic
			 * "14.5.2 Expression edm:AnnotationPath",
			 * "14.5.11 Expression edm:NavigationPropertyPath", "14.5.12 Expression edm:Path" or
			 * "14.5.13 Expression edm:PropertyPath".
			 * Currently supports navigation properties and term casts.
			 *
			 * Example:
			 * <pre>
			 *   &lt;template:with path="meta>Value" helper="sap.ui.model.odata.AnnotationHelper.resolvePath" var="target">
			 * </pre>
			 *
			 * @param {sap.ui.model.Context} oContext
			 *   a context which must point to an annotation or annotation property of type
			 *   <code>Edm.AnnotationPath</code>, <code>Edm.NavigationPropertyPath</code>,
			 *   <code>Edm.Path</code> or <code>Edm.PropertyPath</code>, embedded within an entity
			 *   set or entity type;
			 *   the context's model must be an {@link sap.ui.model.odata.ODataMetaModel}
			 * @returns {string}
			 *   the path to the target, or <code>undefined</code> in case the path cannot be
			 *   resolved
			 * @public
			 */
			resolvePath : function (oContext) {
				var oResult = Basics.followPath(oContext, oContext.getObject());

				return oResult
					? oResult.resolvedPath
					: undefined;
			},

			/**
			 * Formatter function that is used in a complex binding inside an XML template view.
			 * The function is used to interpret OData v4 annotations, supporting the same
			 * annotations as {@link #.format format} but with a simplified output aimed at
			 * design-time templating with smart controls.
			 *
			 * In contrast to <code>format</code>, "14.5.12 Expression edm:Path" or
			 * "14.5.13 Expression edm:PropertyPath" is turned into a simple binding path without
			 * type or constraint information. In certain cases, a complex binding is required to
			 * allow for proper escaping of the path.
			 *
			 * Example:
			 * <pre>
			 *   &lt;sfi:SmartField value="{path: 'meta>Value', formatter: 'sap.ui.model.odata.AnnotationHelper.simplePath'}"/>
			 * </pre>
			 *
			 * @param {sap.ui.core.util.XMLPreprocessor.IContext|sap.ui.model.Context} oInterface
			 *   the callback interface related to the current formatter call
			 * @param {any} [vRawValue]
			 *   the raw value from the meta model, which is embedded within an entity set or
			 *   entity type:
			 *   <ul>
			 *   <li>if this function is used as formatter the value
			 *   is provided by the framework</li>
			 *   <li>if this function is called directly, provide the parameter only if it is
			 *   already calculated</li>
			 *   <li>if the parameter is omitted, it is calculated automatically through
			 *   <code>oInterface.getObject("")</code></li>
			 *   </ul>
			 * @returns {string}
			 *   the resulting string value to write into the processed XML
			 * @public
			 */
			simplePath : function (oInterface, vRawValue) {
				if (arguments.length === 1) {
					vRawValue = oInterface.getObject("");
				}
				return Expression.getExpression(oInterface, vRawValue, false);
			}
		};

		// BEWARE: keep this in sync with sap/ui/core/library.js!
		AnnotationHelper.format.requiresIContext = true;
		AnnotationHelper.getNavigationPath.requiresIContext = true;
		AnnotationHelper.isMultiple.requiresIContext = true;
		AnnotationHelper.simplePath.requiresIContext = true;

		return AnnotationHelper;
	}, /* bExport= */ true);
