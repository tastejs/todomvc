/*
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides class sap.ui.core.util.MockServer for mocking a server
sap.ui
	.define(
				['jquery.sap.global', 'sap/ui/Device', 'sap/ui/base/ManagedObject', 'sap/ui/thirdparty/sinon'],
		function(jQuery, Device, ManagedObject, sinon) {
			"use strict";

			if (!!Device.browser.internet_explorer) {
				jQuery.sap.require("sap.ui.thirdparty.sinon-ie");
				// sinon internally checks the transported data to be an instance
				// of FormData and this fails in case of IE9! - therefore we
				// add a dummy function to enable instanceof check
				if (!window.FormData) {
					window.FormData = function() {};
				}
			}

			/**
			 * Creates a mocked server. This helps to mock all or some backend calls, e.g. for OData/JSON Models or simple XHR calls, without
			 * changing the application code. This class can also be used for qunit tests.
			 *
			 * @param {string} [sId] id for the new server object; generated automatically if no non-empty id is given
			 *      Note: this can be omitted, no matter whether <code>mSettings</code> will be given or not!
			 * @param {object} [mSettings] optional map/JSON-object with initial property values, aggregated objects etc. for the new object
			 * @param {object} [oScope] scope object for resolving string based type and formatter references in bindings
			 *
			 * @class Class to mock http requests made to a remote server
			 * @extends sap.ui.base.ManagedObject
			 * @abstract
			 * @author SAP SE
			 * @version 1.32.9
			 * @public
			 * @alias sap.ui.core.util.MockServer
			 */
			var MockServer = ManagedObject.extend("sap.ui.core.util.MockServer", /** @lends sap.ui.core.util.MockServer.prototype */ {
				constructor: function(sId, mSettings, oScope) {
					ManagedObject.apply(this, arguments);
					MockServer._aServers.push(this);
				},

				metadata: {
					properties: {

						/**
						 * Setter for property <code>rootUri</code>. All request path URI are prefixed with this root URI if set.
						 *
						 * Default value is empty/<code>undefined</code>
						 * @param {string} rootUri new value for property <code>rootUri</code>
						 * @public
						 * @name sap.ui.core.util.MockServer#setRootUri
						 * @function
						 */

						/**
						 * Getter for property <code>rootUri</code>.
						 *
						 * Default value is empty/<code>undefined</code>
						 *
						 * @return {string} the value of property <code>rootUri</code>
						 * @public
						 * @name sap.ui.core.util.MockServer#getRootUri
						 * @function
						 */
						rootUri: "string",

						/**
						 * Setter for property <code>requests</code>.
						 *
						 * Default value is is <code>[]</code>
						 *
						 * Each array entry should consist of an array with the following properties / values:
						 *
						 * <ul>
						 * <li><b>method <string>: "GET"|"POST"|"DELETE|"PUT"</b>
						 * <br>
						 * (any HTTP verb)
						 * </li>
						 * <li><b>path <string>: "/path/to/resource"</b>
						 * <br>
						 * The path is converted to a regular expression, so it can contain normal regular expression syntax.
						 * All regular expression groups are forwarded as arguments to the <code>response</code> function.
						 * In addition to this, parameters can be written in this notation: <code>:param</code>. These placeholder will be replaced by regular expression groups.
						 * </li>
						 * <li><b>response <function>: function(xhr, param1, param2, ...) { }</b>
						 * <br>
						 * The xhr object can be used to respond on the request. Supported methods are:
						 * <br>
						 * <code>xhr.respond(iStatusCode, mHeaders, sBody)</code>
						 * <br>
						 * <code>xhr.respondJSON(iStatusCode, mHeaders, oJsonObjectOrString)</code>. By default a JSON header is set for response header
						 * <br>
						 * <code>xhr.respondXML(iStatusCode, mHeaders, sXmlString)</code>. By default a XML header is set for response header
						 * <br>
						 * <code>xhr.respondFile(iStatusCode, mHeaders, sFileUrl)</code>. By default the mime type of the file is set for response header
						 * </li>
						 * </ul>
						 *
						 * @param {object[]} requests new value for property <code>requests</code>
						 * @public
						 * @name sap.ui.core.util.MockServer#setRequests
						 * @function
						 */

						/**
						 * Getter for property <code>requests</code>.
						 *
						 * Default value is <code>[]</code>
						 *
						 * @return {object[]} the value of property <code>rootUri</code>
						 * @public
						 * @name sap.ui.core.util.MockServer#getRequests
						 * @function
						 */
						requests: {
							type: "object[]",
							defaultValue: []
						}
					}
				},

				_oServer: null,
				_aFilter: null,
				_oMockdata: null,
				_oMetadata: null,
				_sMetadataUrl: null,
				_sMockdataBaseUrl: null,
				_mEntitySets: null,
				_oErrorMessages: {
					INVALID_SYSTEM_QUERY_OPTION_VALUE: "Invalid system query options value",
					IS_NOT_A_VALID_SYSTEM_QUERY_OPTION: "## is not a valid system query option",
					URI_VIOLATING_CONSTRUCTION_RULES: "The URI is violating the construction rules defined in the Data Services specification",
					UNSUPPORTED_FORMAT_VALUE: "Unsupported format value. Only json format is supported",
					MALFORMED_SYNTAX: "The Data Services Request could not be understood due to malformed syntax",
					RESOURCE_NOT_FOUND: "Resource not found",
					INVALID_SORTORDER_DETECTED: "Invalid sortorder ## detected",
					PROPERTY_NOT_FOUND: "Property ## not found",
					INVALID_FILTER_QUERY_STATEMENT: "Invalid filter query statement",
					INVALID_FILTER_OPERATOR: "Invalid $filter operator ##",
					RESOURCE_NOT_FOUND_FOR_SEGMENT: "Resource not found for the segment ##",
					MALFORMED_URI_LITERAL_SYNTAX_IN_KEY: "Malformed URI literal syntax in key ##",
					INVALID_KEY_NAME: "Invalid key name in key predicate. Expected name is ##",
					INVALID_KEY_PREDICATE_QUANTITY: "Invalid key predicate. The quantity of provided keys does not match the expected value"
				}

			});

			/**
			 * Starts the server.
			 * @public
			 */
			MockServer.prototype.start = function() {
				this._oServer = MockServer._getInstance();
				this._aFilters = [];
				var aRequests = this.getRequests();
				var iLength = aRequests.length;
				for (var i = 0; i < iLength; i++) {
					var oRequest = aRequests[i];
					this._addRequestHandler(oRequest.method, oRequest.path, oRequest.response);
				}
			};

			/**
			 * Stops the server.
			 * @public
			 */
			MockServer.prototype.stop = function() {
				if (this.isStarted()) {
					this._removeAllRequestHandlers();
					this._removeAllFilters();
					this._oServer = null;
				}
			};

			/**
			 * callback function for attachBefore
			 * @param {string} event type according to HTTP Method
			 * @param {function} fnCallback - the name of the function that will be called at this exit
			 * @param {string} sEntitySet - (optional) the name of the entity set
			 * @public
			 */
			MockServer.prototype.attachBefore = function(sHttpMethod, fnCallback, sEntitySet) {
				sEntitySet = sEntitySet ? sEntitySet : "";
				this.attachEvent(sHttpMethod + sEntitySet + ":before", fnCallback);
			};

			/**
			 * callback function for attachBefore
			 * @param {string} event type according to HTTP Method
			 * @param {function} fnCallback - the name of the function that will be called at this exit
			 * @param {string} sEntitySet - (optional) the name of the entity set
			 * @public
			 */
			MockServer.prototype.attachAfter = function(sHttpMethod, fnCallback, sEntitySet) {
				sEntitySet = sEntitySet ? sEntitySet : "";
				this.attachEvent(sHttpMethod + sEntitySet + ":after", fnCallback);
			};

			/**
			 * callback function for detachBefore
			 * @param {string} event type according to HTTP Method
			 * @param {function} fnCallback - the name of the function that will be called at this exit
			 * @param {string} sEntitySet - (optional) the name of the entity set
			 * @public
			 */
			MockServer.prototype.detachBefore = function(sHttpMethod, fnCallback, sEntitySet) {
				sEntitySet = sEntitySet ? sEntitySet : "";
				this.detachEvent(sHttpMethod + sEntitySet + ":before", fnCallback);
			};

			/**
			 * callback function for detachAfter
			 * @param {string} event type according to HTTP Method
			 * @param {function} fnCallback - the name of the function that will be called at this exit
			 * @param {string} sEntitySet - (optional) the name of the entity set
			 * @public
			 */
			MockServer.prototype.detachAfter = function(sHttpMethod, fnCallback, sEntitySet) {
				sEntitySet = sEntitySet ? sEntitySet : "";
				this.detachEvent(sHttpMethod + sEntitySet + ":after", fnCallback);
			};

			/**
			 * Returns whether the server is started or not.
			 *
			 * @return {boolean} whether the server is started or not.
			 * @public
			 */
			MockServer.prototype.isStarted = function() {
				return !!this._oServer;
			};

			/**
			 * Returns the data model of the given EntitySet name.
			 *
			 * @param sEntitySetName EntitySet name
			 * @return {array} data model of the given EntitySet
			 * @public
			 */
			MockServer.prototype.getEntitySetData = function(sEntitySetName) {
				var that = this;
				var aCopiedMockdata;
				if (this._oMockdata && this._oMockdata.hasOwnProperty(sEntitySetName)) {
					aCopiedMockdata = jQuery.extend(true, [], that._oMockdata[sEntitySetName]);
				} else {
					jQuery.sap.log.error("Unrecognized EntitySet name: " + sEntitySetName);
				}
				return aCopiedMockdata;
			};

			/**
			 * Sets the data of the given EntitySet name with the given array.
			 * @param sEntitySetName EntitySet name
			 * @param aData
			 * @public
			 */
			MockServer.prototype.setEntitySetData = function(sEntitySetName, aData) {
				if (this._oMockdata && this._oMockdata.hasOwnProperty(sEntitySetName)) {
					this._oMockdata[sEntitySetName] = aData;
				} else {
					jQuery.sap.log.error("Unrecognized EntitySet name: " + sEntitySetName);
				}
			};

			/**
			 * Applies the OData system query option string on the given array
			 * @param {object} oFilteredData
			 * @param {string} sQuery string in the form {query}={value}
			 * @param {string} sEntitySetName the name of the entitySet the oFilteredData belongs to
			 * @private
			 */
			MockServer.prototype._applyQueryOnCollection = function(oFilteredData, sQuery, sEntitySetName) {
				var aQuery = sQuery.split('=');
				var sODataQueryValue = aQuery[1];
				if (sODataQueryValue === "") {
					return;
				}
				if (sODataQueryValue.lastIndexOf(',') === sODataQueryValue.length - 1) {
					this._logAndThrowMockServerCustomError(400, this._oErrorMessages.URI_VIOLATING_CONSTRUCTION_RULES);
				}
				switch (aQuery[0]) {
					case "$top":
						if (!(new RegExp(/^\d+$/).test(sODataQueryValue))) {
							this._logAndThrowMockServerCustomError(400, this._oErrorMessages.INVALID_SYSTEM_QUERY_OPTION_VALUE);
						}
						oFilteredData.results = oFilteredData.results.slice(0, sODataQueryValue);
						break;
					case "$skip":
						if (!(new RegExp(/^\d+$/).test(sODataQueryValue))) {
							this._logAndThrowMockServerCustomError(400, this._oErrorMessages.INVALID_SYSTEM_QUERY_OPTION_VALUE);
						}
						oFilteredData.results = oFilteredData.results.slice(sODataQueryValue, oFilteredData.results.length);
						break;
					case "$orderby":
						oFilteredData.results = this._getOdataQueryOrderby(oFilteredData.results, sODataQueryValue);
						break;
					case "$filter":
						oFilteredData.results = this._recursiveOdataQueryFilter(oFilteredData.results, sODataQueryValue);
						break;
					case "$select":
						oFilteredData.results = this._getOdataQuerySelect(oFilteredData.results, sODataQueryValue);
						break;
					case "$inlinecount":
						var iCount = this._getOdataInlineCount(oFilteredData.results, sODataQueryValue);
						if (iCount) {
							oFilteredData.__count = iCount;
						}
						break;
					case "$expand":
						oFilteredData.results = this._getOdataQueryExpand(oFilteredData.results, sODataQueryValue, sEntitySetName);
						break;
					case "$format":
						oFilteredData.results = this._getOdataQueryFormat(oFilteredData.results, sODataQueryValue);
						break;
					default:
						this._logAndThrowMockServerCustomError(400, this._oErrorMessages.IS_NOT_A_VALID_SYSTEM_QUERY_OPTION, aQuery[0]);
				}
			};

			/**
			 * Applies the OData system query option string on the given entry
			 * @param {object} oEntry
			 * @param {string} sQuery string of the form {query}={value}
			 * @param {string} sEntitySetName the name of the entitySet the oEntry belongs to
			 * @private
			 */
			MockServer.prototype._applyQueryOnEntry = function(oEntry, sQuery, sEntitySetName) {
				var aQuery = sQuery.split('=');
				var sODataQueryValue = aQuery[1];
				if (sODataQueryValue === "") {
					return;
				}
				if (sODataQueryValue.lastIndexOf(',') === sODataQueryValue.length - 1) {
					this._logAndThrowMockServerCustomError(400, this._oErrorMessages.URI_VIOLATING_CONSTRUCTION_RULES);
				}
				switch (aQuery[0]) {
					case "$filter":
						return this._recursiveOdataQueryFilter([oEntry], sODataQueryValue)[0];
					case "$select":
						return this._getOdataQuerySelect([oEntry], sODataQueryValue)[0];
					case "$expand":
						return this._getOdataQueryExpand([oEntry], sODataQueryValue, sEntitySetName)[0];
					case "$format":
						return this._getOdataQueryFormat([oEntry], sODataQueryValue);
					default:
						this._logAndThrowMockServerCustomError(400, this._oErrorMessages.IS_NOT_A_VALID_SYSTEM_QUERY_OPTION, aQuery[0]);
				}
			};

			/**
			 * Applies the Orderby OData system query option string on the given array
			 * @param {object} aDataSet
			 * @param {string} sODataQueryValue a comma separated list of property navigation paths to sort by, where each property navigation path terminates on a primitive property
			 * @private
			 */
			MockServer.prototype._getOdataQueryOrderby = function(aDataSet, sODataQueryValue) {
				// sort properties lookup
				var aProperties = sODataQueryValue.split(',');
				var that = this;
				//trim all properties
				jQuery.each(aProperties, function(i, sPropertyName) {
					aProperties[i] = that._trim(sPropertyName);
				});

				var fnComparator = function compare(a, b) {

					for (var i = 0; i < aProperties.length; i++) {
						// sort order lookup asc / desc
						var aSort = aProperties[i].split(' ');
						// by default the sort is in asc order
						var iSorter = 1;
						if (aSort.length > 1) {
							switch (aSort[1]) {
								case 'asc':
									iSorter = 1;
									break;
								case 'desc':
									iSorter = -1;
									break;
								default:
									that._logAndThrowMockServerCustomError(400, that._oErrorMessages.INVALID_SORTORDER_DETECTED, aSort[1]);
							}
						}
						// support for 1 level complex type property
						var sPropName, sComplexType;
						var iComplexType = aSort[0].indexOf("/");
						if (iComplexType !== -1) {
							sPropName = aSort[0].substring(iComplexType + 1);
							sComplexType = aSort[0].substring(0, iComplexType);
							if (!a[sComplexType].hasOwnProperty(sPropName)) {
								that._logAndThrowMockServerCustomError(400, that._oErrorMessages.PROPERTY_NOT_FOUND, sPropName);
							}
							if (a[sComplexType][sPropName] < b[sComplexType][sPropName]) {
								return -1 * iSorter;
							}
							if (a[sComplexType][sPropName] > b[sComplexType][sPropName]) {
								return 1 * iSorter;
							}
						} else {
							sPropName = aSort[0];
							if (!a.hasOwnProperty(sPropName)) {
								that._logAndThrowMockServerCustomError(400, that._oErrorMessages.PROPERTY_NOT_FOUND, sPropName);
							}
							if (a[sPropName] < b[sPropName]) {
								return -1 * iSorter;
							}
							if (a[sPropName] > b[sPropName]) {
								return 1 * iSorter;
							}
						}
					}
					return 0;
				};
				return aDataSet.sort(fnComparator);
			};

			/**
			 * Removes duplicate entries from the given array
			 * @param {object} aDataSet
			 * @private
			 */
			MockServer.prototype._arrayUnique = function(array) {
				var a = array.concat();
				for (var i = 0; i < a.length; ++i) {
					for (var j = i + 1; j < a.length; ++j) {
						if (a[i] === a[j]) {
							a.splice(j--, 1);
						}
					}
				}
				return a;
			};

			/**
			 * Returns the indices of the first brackets appearance, excluding brackets of $filter reserved functions
			 * @param {string} sString
			 * @private
			 */
			MockServer.prototype._getBracketIndices = function(sString) {
				var aStack = [];
				var bReserved = false;
				var iStartIndex, iEndIndex = 0;
				for (var character = 0; character < sString.length; character++) {
					if (sString[character] === '(') {
						if (/[substringof|endswith|startswith]$/.test(sString.substring(0, character))) {
							bReserved = true;
						} else {
							aStack.push(sString[character]);
							if (iStartIndex === undefined) {
								iStartIndex = character;
							}
						}
					} else if (sString[character] === ')') {
						if (!bReserved) {
							aStack.pop();
							iEndIndex = character;
							if (aStack.length === 0) {
								return {
									start: iStartIndex,
									end: iEndIndex
								};
							}
						} else {
							bReserved = false;
						}
					}
				}
				return {
					start: iStartIndex,
					end: iEndIndex
				};
			};

			/**
			 * Applies the $filter OData system query option string on the given array.
			 * This function is called recursively on expressions in brackets.
			 * @param {string} sString
			 * @private
			 */
			MockServer.prototype._recursiveOdataQueryFilter = function(aDataSet, sODataQueryValue) {

				// check for wrapping brackets, e.g. (A), (A op B), (A op (B)), (((A)))
				var oIndices = this._getBracketIndices(sODataQueryValue);
				if (oIndices.start === 0 && oIndices.end === sODataQueryValue.length - 1) {
					sODataQueryValue = this._trim(sODataQueryValue.substring(oIndices.start + 1, oIndices.end));
					return this._recursiveOdataQueryFilter(aDataSet, sODataQueryValue);
				}

				// find brackets that are not related to the reserved words
				var rExp = /([^substringof|endswith|startswith]|^)\((.*)\)/,
					aSet2,
					aParts;

				var sOperator;
				if (rExp.test(sODataQueryValue)) {
					var sBracketed = sODataQueryValue.substring(oIndices.start, oIndices.end + 1);
					var rExp1 = new RegExp("(.*) +(or|and) +(" + this._trim(this._escapeStringForRegExp(sBracketed)) + ".*)");
					if (oIndices.start === 0) {
						rExp1 = new RegExp("(" + this._trim(this._escapeStringForRegExp(sBracketed)) + ") +(or|and) +(.*)");
					}

					var aExp1Parts = rExp1.exec(sODataQueryValue);
					// remove brackets around values
					if (aExp1Parts === null) {
						sODataQueryValue = sODataQueryValue.replace(/[\(\)]/g, "");
						return this._getOdataQueryFilter(aDataSet, this._trim(sODataQueryValue));
					}
					var sExpression = aExp1Parts[1];
					sOperator = aExp1Parts[2];
					var sExpression2 = aExp1Parts[3];

					var aSet1 = this._recursiveOdataQueryFilter(aDataSet, sExpression);
					if (sOperator === "or") {
						aSet2 = this._recursiveOdataQueryFilter(aDataSet, sExpression2);
						return this._arrayUnique(aSet1.concat(aSet2));
					}
					if (sOperator === "and") {
						return this._recursiveOdataQueryFilter(aSet1, sExpression2);
					}
				} else {
					//there are only brackets with the reserved words
					// e.g. A or B and C or D
					aParts = sODataQueryValue.split(/ +and | or +/);

					// base case
					if (aParts.length === 1) {
						// IE8 handling
						if (sODataQueryValue.match(/ +and | or +/)) {
							throw new Error("400");
						}

						return this._getOdataQueryFilter(aDataSet, this._trim(sODataQueryValue));
					}

					var aResult = this._recursiveOdataQueryFilter(aDataSet, aParts[0]);
					var rRegExp;
					for (var i = 1; i < aParts.length; i++) {
						rRegExp = new RegExp(this._trim(this._escapeStringForRegExp(aParts[i - 1])) + " +(and|or) +" + this._trim(this._escapeStringForRegExp(
							aParts[i])));
						sOperator = rRegExp.exec(sODataQueryValue)[1];

						if (sOperator === "or") {
							aSet2 = this._recursiveOdataQueryFilter(aDataSet, aParts[i]);
							aResult = this._arrayUnique(aResult.concat(aSet2));
						}
						if (sOperator === "and") {
							aResult = this._recursiveOdataQueryFilter(aResult, aParts[i]);
						}
					}
					return aResult;
				}
			};

			/**
			 * Applies the Filter OData system query option string on the given array
			 * @param {object} aDataSet
			 * @param {string} sODataQueryValue a boolean expression
			 * @private
			 */
			MockServer.prototype._getOdataQueryFilter = function(aDataSet, sODataQueryValue) {
				if (aDataSet.length === 0) {
					return aDataSet;
				}
				var rExp = new RegExp("(.*) (eq|ne|gt|lt|le|ge) (.*)");
				var rExp2 = new RegExp("(endswith|startswith|substringof)\\((.*)");
				var sODataFilterMethod = null;
				var aODataFilterValues = rExp.exec(sODataQueryValue);
				if (aODataFilterValues) {
					sODataFilterMethod = aODataFilterValues[2];
				} else {
					aODataFilterValues = rExp2.exec(sODataQueryValue);
					if (aODataFilterValues) {
						sODataFilterMethod = aODataFilterValues[1];
					} else {
						this._logAndThrowMockServerCustomError(400, this._oErrorMessages.INVALID_FILTER_QUERY_STATEMENT);
					}
				}
				var that = this;
				var fnGetFilteredData = function(bValue, iValueIndex, iPathIndex, fnSelectFilteredData) {
					var aODataFilterValues, sValue, sPath;
					if (!bValue) { //e.g eq, ne, gt, lt, le, ge
						aODataFilterValues = rExp.exec(sODataQueryValue);
						sValue = that._trim(aODataFilterValues[iValueIndex + 1]);
						sPath = that._trim(aODataFilterValues[iPathIndex + 1]);
					} else { //e.g.substringof, startswith, endswith
						var rStringFilterExpr = new RegExp("(substringof|startswith|endswith)\\(([^,\\)]*),(.*)\\)");
						aODataFilterValues = rStringFilterExpr.exec(sODataQueryValue);
						sValue = that._trim(aODataFilterValues[iValueIndex + 2]);
						sPath = that._trim(aODataFilterValues[iPathIndex + 2]);
					}
					//TODO do the check using the property type and not value
					// remove number suffixes from EDM types decimal, Int64, Single
					var sTypecheck = sValue[sValue.length - 1];
					if (sTypecheck === "M" || sTypecheck === "L" || sTypecheck === "f") {
						sValue = sValue.substring(0, sValue.length - 1);
					}
					//fix for filtering on date time properties
					if (sValue.indexOf("datetime") === 0) {
						sValue = that._getJsonDate(sValue);
					} else if (sValue.indexOf("guid") === 0) {
						// strip the "guid'" (5) from the front and the "'" (-1) from the back 
						sValue = sValue.substring(5, sValue.length - 1);
					} else if (sValue === "true") { // fix for filtering on boolean properties
						sValue = true;
					} else if (sValue === "false") {
						sValue = false;
					} else if (that._isValidNumber(sValue)) { //fix for filtering on properties of type number
						sValue = parseFloat(sValue);
					} else if ((sValue.charAt(0) === "'") && (sValue.charAt(sValue.length - 1) === "'")) {
						//fix for filtering on properties of type string
						sValue = sValue.substr(1, sValue.length - 2);
					}
					// support for 1 level complex type property
					var iComplexType = sPath.indexOf("/");
					if (iComplexType !== -1) {
						var sPropName = sPath.substring(iComplexType + 1);
						var sComplexType = sPath.substring(0, iComplexType);
						if (aDataSet[0][sComplexType]) {
							if (!aDataSet[0][sComplexType].hasOwnProperty(sPropName)) {
								var sErrorMessage = that._oErrorMessages.PROPERTY_NOT_FOUND.replace("##", "'" + sPropName + "'");
								jQuery.sap.log.error("MockServer: navigation property '" + sComplexType + "' was not expanded, so " + sErrorMessage);
								return aDataSet;
							}
						} else {
							that._logAndThrowMockServerCustomError(400, that._oErrorMessages.PROPERTY_NOT_FOUND, sPath);
						}
						return fnSelectFilteredData(sPath, sValue, sComplexType, sPropName);
					} else {
						//check if sPath exists as property of the entityset
						if (!aDataSet[0].hasOwnProperty(sPath)) {
							that._logAndThrowMockServerCustomError(400, that._oErrorMessages.PROPERTY_NOT_FOUND, sPath);
						}
						return fnSelectFilteredData(sPath, sValue);
					}

				};

				switch (sODataFilterMethod) {
					case "substringof":
						return fnGetFilteredData(true, 0, 1, function(sPath, sValue, sComplexType, sPropName) {
							return jQuery.grep(aDataSet, function(oMockData) {
								if (sComplexType && sPropName) {
									return (oMockData[sComplexType][sPropName].indexOf(sValue) !== -1);
								}
								return (oMockData[sPath].indexOf(sValue) !== -1);
							});
						});
					case "startswith":
						return fnGetFilteredData(true, 1, 0, function(sPath, sValue, sComplexType, sPropName) {
							return jQuery.grep(aDataSet, function(oMockData) {
								if (sComplexType && sPropName) {
									return (oMockData[sComplexType][sPropName].indexOf(sValue) === 0);
								}
								return (oMockData[sPath].indexOf(sValue) === 0);
							});
						});
					case "endswith":
						return fnGetFilteredData(true, 1, 0, function(sPath, sValue, sComplexType, sPropName) {
							return jQuery.grep(aDataSet, function(oMockData) {
								if (sComplexType && sPropName) {
									return (oMockData[sComplexType][sPropName].indexOf(sValue) === (oMockData[sComplexType][sPropName].length - sValue.length));
								}
								return (oMockData[sPath].indexOf(sValue) === (oMockData[sPath].length - sValue.length));
							});
						});
					case "eq":
						return fnGetFilteredData(false, 2, 0, function(sPath, sValue, sComplexType, sPropName) {
							return jQuery.grep(aDataSet, function(oMockData) {
								if (sComplexType && sPropName) {
									return (oMockData[sComplexType][sPropName] === sValue);
								}
								return (oMockData[sPath] === sValue);
							});
						});
					case "ne":
						return fnGetFilteredData(false, 2, 0, function(sPath, sValue, sComplexType, sPropName) {
							return jQuery.grep(aDataSet, function(oMockData) {
								if (sComplexType && sPropName) {
									return (oMockData[sComplexType][sPropName] !== sValue);
								}
								return (oMockData[sPath] !== sValue);
							});
						});
					case "gt":
						return fnGetFilteredData(false, 2, 0, function(sPath, sValue, sComplexType, sPropName) {
							return jQuery.grep(aDataSet, function(oMockData) {
								if (sComplexType && sPropName) {
									return (oMockData[sComplexType][sPropName] > sValue);
								}
								return (oMockData[sPath] > sValue);
							});
						});
					case "lt":
						return fnGetFilteredData(false, 2, 0, function(sPath, sValue, sComplexType, sPropName) {
							return jQuery.grep(aDataSet, function(oMockData) {
								if (sComplexType && sPropName) {
									return (oMockData[sComplexType][sPropName] < sValue);
								}
								return (oMockData[sPath] < sValue);
							});
						});
					case "ge":
						return fnGetFilteredData(false, 2, 0, function(sPath, sValue, sComplexType, sPropName) {
							return jQuery.grep(aDataSet, function(oMockData) {
								if (sComplexType && sPropName) {
									return (oMockData[sComplexType][sPropName] >= sValue);
								}
								return (oMockData[sPath] >= sValue);
							});
						});
					case "le":
						return fnGetFilteredData(false, 2, 0, function(sPath, sValue, sComplexType, sPropName) {
							return jQuery.grep(aDataSet, function(oMockData) {
								if (sComplexType && sPropName) {
									return (oMockData[sComplexType][sPropName] <= sValue);
								}
								return (oMockData[sPath] <= sValue);
							});
						});
					default:
						this._logAndThrowMockServerCustomError(400, that._oErrorMessages.INVALID_FILTER_OPERATOR, sODataFilterMethod);
				}
			};

			/**
			 * Applies the Select OData system query option string on the given array
			 * @param {object} aDataSet
			 * @param {string} sODataQueryValue a comma separated list of property paths, qualified action names, qualified function names, or the star operator (*)
			 * @private
			 */
			MockServer.prototype._getOdataQuerySelect = function(aDataSet, sODataQueryValue) {
				var that = this;
				var sPropName, sComplexType;
				var aProperties = sODataQueryValue.split(',');
				var aSelectedDataSet = [];
				var oPushedObject;
				var fnCreatePushedEntry = function(aProperties, oData, oPushedObject) {
					if (oData["__metadata"]) {
						oPushedObject["__metadata"] = oData["__metadata"];
					}
					jQuery.each(aProperties, function(i, sPropertyName) {
						var iComplexType = sPropertyName.indexOf("/");
						// this is a complex type property
						if (iComplexType !== -1) {
							sPropName = sPropertyName.substring(iComplexType + 1);
							sComplexType = sPropertyName.substring(0, iComplexType);
							if (!oPushedObject[sComplexType]) {
								oPushedObject[sComplexType] = {};
							}
							oPushedObject[sComplexType] = fnCreatePushedEntry([sPropName], oData[sComplexType], oPushedObject[sComplexType]);
							// this is a simple property
						} else {
							if (oData && !oData.hasOwnProperty(sPropertyName)) {
								that._logAndThrowMockServerCustomError(404, that._oErrorMessages.RESOURCE_NOT_FOUND_FOR_SEGMENT, sPropertyName);
							}
							oPushedObject[sPropertyName] = oData[sPropertyName];
						}
					});
					return oPushedObject;
				};

				// in case of $select=* return the data as is
				if (jQuery.inArray("*", aProperties) !== -1) {
					return aDataSet;
				}

				// trim all properties
				jQuery.each(aProperties, function(i, sPropertyName) {
					aProperties[i] = that._trim(sPropertyName);
				});

				// for each entry in the dataset create a new object that contains only the properties in $select clause
				jQuery.each(aDataSet, function(iIndex, oData) {
					oPushedObject = {};
					aSelectedDataSet.push(fnCreatePushedEntry(aProperties, oData, oPushedObject));
				});

				return aSelectedDataSet;
			};

			/**
			 * Applies the InlineCount OData system query option string on the given array
			 * @param {object} aDataSet
			 * @param {string} sODataQueryValue a value of allpages, or a value of none
			 * @private
			 */
			MockServer.prototype._getOdataInlineCount = function(aDataSet, sODataQueryValue) {
				var aProperties = sODataQueryValue.split(',');

				if (aProperties.length !== 1 || (aProperties[0] !== 'none' && aProperties[0] !== 'allpages')) {
					this._logAndThrowMockServerCustomError(400, this._oErrorMessages.INVALID_SYSTEM_QUERY_OPTION_VALUE);
				}
				if (aProperties[0] === 'none') {
					return;
				}
				return aDataSet.length;
			};

			/**
			 * Applies the Format OData system query option
			 * @param {string} sODataQueryValue
			 * @private
			 */
			MockServer.prototype._getOdataQueryFormat = function(aDataSet, sODataQueryValue) {
				if (sODataQueryValue !== 'json') {
					this._logAndThrowMockServerCustomError(400, this._oErrorMessages.UNSUPPORTED_FORMAT_VALUE);
				}
				return aDataSet;
			};

			/**
			 * Applies the Expand OData system query option string on the given array
			 * @param {object} aDataSet
			 * @param {string} sODataQueryValue a comma separated list of navigation property paths
			 * @param {string} sEntitySetName the name of the entitySet the aDataSet belongs to
			 * @private
			 */
			MockServer.prototype._getOdataQueryExpand = function(aDataSet, sODataQueryValue, sEntitySetName) {
				var that = this;
				var aNavProperties = sODataQueryValue.split(',');
				//trim all nav properties
				jQuery.each(aNavProperties, function(i, sPropertyName) {
					aNavProperties[i] = that._trim(sPropertyName);
				});
				var oEntitySetNavProps = that._mEntitySets[sEntitySetName].navprops;
				jQuery.each(aDataSet, function(iIndex, oRecord) {
					jQuery.each(aNavProperties, function(iIndex, sNavPropFull) {
						var aNavProps = sNavPropFull.split("/");
						var sNavProp = aNavProps[0];

						if (!oRecord[sNavProp]) {
							that._logAndThrowMockServerCustomError(404, that._oErrorMessages.RESOURCE_NOT_FOUND_FOR_SEGMENT, sNavProp);
						}

						//check if an expanded operation was already executed. for 1:* check results . otherwise, check if there is __deferred for clean start.
						var aNavEntry = oRecord[sNavProp].results || oRecord[sNavProp];
						if (!aNavEntry || !!aNavEntry.__deferred) {
							aNavEntry = jQuery.extend(true, [], that._resolveNavigation(sEntitySetName, oRecord, sNavProp));
						} else if (!jQuery.isArray(aNavEntry)) {
							aNavEntry = [aNavEntry];
						}

						if (!!aNavEntry && aNavProps.length > 1) {
							var sRestNavProps = aNavProps.splice(1, aNavProps.length).join("/");
							aNavEntry = that._getOdataQueryExpand(aNavEntry, sRestNavProps,
								oEntitySetNavProps[sNavProp].to.entitySet);
						}

						if (oEntitySetNavProps[sNavProp].to.multiplicity === "*") {
							oRecord[sNavProp] = {
								results: aNavEntry
							};
						} else {
							oRecord[sNavProp] = aNavEntry[0] ? aNavEntry[0] : {};
						}
					});
				});
				return aDataSet;
			};

			/**
			 * Refreshes the service metadata document and the mockdata
			 *
			 * @private
			 */
			MockServer.prototype._refreshData = function() {

				// load the metadata
				this._loadMetadata(this._sMetadataUrl);

				// here we need to analyse the EDMX and identify the entity sets
				this._mEntitySets = this._findEntitySets(this._oMetadata);

				if (!this._sMockdataBaseUrl) {
					// load the mockdata
					this._generateMockdata(this._mEntitySets, this._oMetadata);
				} else {
					// check the mockdata base URL to end with a slash
					if (!jQuery.sap.endsWith(this._sMockdataBaseUrl, "/") && !jQuery.sap.endsWith(this._sMockdataBaseUrl, ".json")) {
						this._sMockdataBaseUrl += "/";
					}
					// load the mockdata
					this._loadMockdata(this._mEntitySets, this._sMockdataBaseUrl);
				}
			};

			/**
			 * Returns the root URI without query or hash parameters
			 * @return {string} the root URI without query or hash parameters
			 */
			MockServer.prototype._getRootUri = function() {
				var sUri = this.getRootUri();
				sUri = sUri && /([^?#]*)([?#].*)?/.exec(sUri)[1]; // remove URL parameters or anchors
				return sUri;
			};

			/**
			 * Loads the service metadata for the given url
			 * @param {string} sMetadataUrl url to the service metadata document
			 * @return {XMLDocument} the xml document object
			 * @private
			 */
			MockServer.prototype._loadMetadata = function(sMetadataUrl) {

				// load the metadata
				var oMetadata = jQuery.sap.sjax({
					url: sMetadataUrl,
					dataType: "xml"
				}).data;
				jQuery.sap.assert(oMetadata !== undefined, "The metadata for url \"" + sMetadataUrl + "\" could not be found!");
				this._oMetadata = oMetadata;

				return oMetadata;

			};

			/**
			 * find the entity sets in the metadata XML document
			 * @param {XMLDocument} oMetadata the metadata XML document
			 * @return {map} map of entity sets
			 * @private
			 */
			MockServer.prototype._findEntitySets = function(oMetadata) {

				// here we need to analyse the EDMX and identify the entity sets
				var mEntitySets = {};
				var oPrincipals = jQuery(oMetadata).find("Principal");
				var oDependents = jQuery(oMetadata).find("Dependent");

				jQuery(oMetadata).find("EntitySet").each(function(iIndex, oEntitySet) {
					var $EntitySet = jQuery(oEntitySet);
					// split the namespace and the name of the entity type (namespace could have dots inside)
					var aEntityTypeParts = /((.*)\.)?(.*)/.exec($EntitySet.attr("EntityType"));
					mEntitySets[$EntitySet.attr("Name")] = {
						"name": $EntitySet.attr("Name"),
						"schema": aEntityTypeParts[2],
						"type": aEntityTypeParts[3],
						"keys": [],
						"keysType": {},
						"navprops": {}
					};
				});

				// helper function to find the entity set and property reference
				// for the given role name
				var fnResolveNavProp = function(sRole, aAssociation, aAssociationSet, bFrom) {
					var sEntitySet = jQuery(aAssociationSet).find("End[Role=" + sRole + "]").attr("EntitySet");
					var sMultiplicity = jQuery(aAssociation).find("End[Role=" + sRole + "]").attr("Multiplicity");
					
					var aPropRef = [];
					var aConstraint = jQuery(aAssociation).find("ReferentialConstraint > [Role=" + sRole + "]");
					if (aConstraint && aConstraint.length > 0) {
						jQuery(aConstraint[0]).children("PropertyRef").each(function(iIndex, oPropRef) {
							aPropRef.push(jQuery(oPropRef).attr("Name"));
						});
					} else {
						var oPrinDeps = (bFrom) ? oPrincipals : oDependents;
						jQuery(oPrinDeps).each(function(iIndex, oPrinDep) {
							if (sRole === (jQuery(oPrinDep).attr("Role"))) {
								jQuery(oPrinDep).children("PropertyRef").each(function(iIndex, oPropRef) {
									aPropRef.push(jQuery(oPropRef).attr("Name"));
								});
								return false;
							}
						});
					}
					
					return {
						"role": sRole,
						"entitySet": sEntitySet,
						"propRef": aPropRef,
						"multiplicity": sMultiplicity
					};
				};

				// find the keys and the navigation properties of the entity types
				jQuery.each(mEntitySets, function(sEntitySetName, oEntitySet) {
					// find the keys
					var $EntityType = jQuery(oMetadata).find("EntityType[Name='" + oEntitySet.type + "']");
					var aKeys = jQuery($EntityType).find("PropertyRef");
					jQuery.each(aKeys, function(iIndex, oPropRef) {
						var sKeyName = jQuery(oPropRef).attr("Name");
						oEntitySet.keys.push(sKeyName);
						oEntitySet.keysType[sKeyName] = jQuery($EntityType).find("Property[Name='" + sKeyName + "']").attr("Type");
					});
					// resolve the navigation properties
					var aNavProps = jQuery(oMetadata).find("EntityType[Name='" + oEntitySet.type + "'] NavigationProperty");
					jQuery.each(aNavProps, function(iIndex, oNavProp) {
						var $NavProp = jQuery(oNavProp);
						var aRelationship  = $NavProp.attr("Relationship").split(".");
						var aAssociationSet = jQuery(oMetadata).find("AssociationSet[Association = '" + aRelationship.join(".") + "']" );
						var sName = aRelationship.pop();
						var aAssociation = jQuery(oMetadata).find("Association[Name = '" + sName + "']" );
						oEntitySet.navprops[$NavProp.attr("Name")] = {
							"name": $NavProp.attr("Name"),
							"from": fnResolveNavProp($NavProp.attr("FromRole"), aAssociation,aAssociationSet, true),
							"to": fnResolveNavProp($NavProp.attr("ToRole"),aAssociation, aAssociationSet, false)
						};
					});
				});

				// return the entity sets
				return mEntitySets;

			};

			/**
			 * find the entity types in the metadata XML document
			 * @param {XMLDocument} oMetadata the metadata XML document
			 * @return {map} map of entity types
			 * @private
			 */
			MockServer.prototype._findEntityTypes = function(oMetadata) {
				var mEntityTypes = {};
				jQuery(oMetadata).find("EntityType").each(function(iIndex, oEntityType) {
					var $EntityType = jQuery(oEntityType);
					mEntityTypes[$EntityType.attr("Name")] = {
						"name": $EntityType.attr("Name"),
						"properties": [],
						"keys": []
					};
					$EntityType.find("Property").each(function(iIndex, oProperty) {
						var $Property = jQuery(oProperty);
						var type = $Property.attr("Type");
						mEntityTypes[$EntityType.attr("Name")].properties.push({
							"schema": type.substring(0, type.lastIndexOf(".")),
							"type": type.substring(type.lastIndexOf(".") + 1),
							"name": $Property.attr("Name"),
							"precision": $Property.attr("Precision"),
							"scale": $Property.attr("Scale")
						});
					});
					$EntityType.find("PropertyRef").each(function(iIndex, oKey) {
						var $Key = jQuery(oKey);
						var sPropertyName = $Key.attr("Name");
						mEntityTypes[$EntityType.attr("Name")].keys.push(sPropertyName);
					});
				});
				return mEntityTypes;
			};

			/**
			 * find the complex types in the metadata XML document
			 * @param {XMLDocument} oMetadata the metadata XML document
			 * @return {map} map of complex types
			 * @private
			 */
			MockServer.prototype._findComplexTypes = function(oMetadata) {
				var mComplexTypes = {};
				jQuery(oMetadata).find("ComplexType").each(function(iIndex, oComplexType) {
					var $ComplexType = jQuery(oComplexType);
					mComplexTypes[$ComplexType.attr("Name")] = {
						"name": $ComplexType.attr("Name"),
						"properties": []
					};
					$ComplexType.find("Property").each(function(iIndex, oProperty) {
						var $Property = jQuery(oProperty);
						var type = $Property.attr("Type");
						mComplexTypes[$ComplexType.attr("Name")].properties.push({
							"schema": type.substring(0, type.lastIndexOf(".")),
							"type": type.substring(type.lastIndexOf(".") + 1),
							"name": $Property.attr("Name"),
							"precision": $Property.attr("Precision"),
							"scale": $Property.attr("Scale")
						});
					});
				});
				return mComplexTypes;
			};

			/**
			 * creates a key string for the given keys and entry
			 * @param {object} oEntitySet the entity set info
			 * @param {object} oEntry entity set entry which contains the keys as properties
			 * @return {string} the keys string
			 * @private
			 */
			MockServer.prototype._createKeysString = function(oEntitySet, oEntry) {
				// creates the key string for an entity
				var that = this;
				var sKeys = "";
				if (oEntry) {
					jQuery.each(oEntitySet.keys, function(iIndex, sKey) {
						if (sKeys) {
							sKeys += ",";
						}
						var oKeyValue = oEntry[sKey];
						if (oEntitySet.keysType[sKey] === "Edm.String") {
							oKeyValue = "'" + oKeyValue + "'";
						} else if (oEntitySet.keysType[sKey] === "Edm.DateTime") {
							oKeyValue = that._getDateTime(oKeyValue);
						} else if (oEntitySet.keysType[sKey] === "Edm.Guid") {
							oKeyValue = "guid'" + oKeyValue + "'";
						}

						if (oEntitySet.keys.length === 1) {
							sKeys += oKeyValue;
							return sKeys;
						}
						sKeys += sKey + "=" + oKeyValue;
					});
				}
				return sKeys;
			};

			/**
			 * loads the mock data for the given entity sets and tries
			 * to load them from the files inside the given base url.
			 * The name of the JSON files containing the mock data
			 * should be either the name of the entity set or the name
			 * of the underlying entity type. As an alternative you
			 * could also specify the url to a single JSON file
			 * containing the mock data for all entity types.
			 *
			 * @param {map}
			 *                mEntitySets map of entity sets
			 * @param {string}
			 *                sBaseUrl the base url which contains the
			 *                mock data in JSON files or if the url is
			 *                pointing to a JSON file containing all
			 *                entity types
			 * @return {array} the mockdata arary containing the data
			 *         for the entity sets
			 * @private
			 */
			MockServer.prototype._loadMockdata = function(mEntitySets, sBaseUrl) {
				var that = this,
					mData = {};
				this._oMockdata = {};
				var fnLoadMockData = function(sUrl, oEntitySet) {
					var oResponse = jQuery.sap.sjax({
						url: sUrl,
						dataType: "json"
					});
					if (oResponse.success) {
						if (!!oResponse.data.d) {
							if (!!oResponse.data.d.results) {
								mData[oEntitySet.name] = oResponse.data.d.results;
							} else {
								jQuery.sap.log.error("The mockdata format for entity set \"" + oEntitySet.name + "\" invalid");
							}
						} else {
							mData[oEntitySet.name] = oResponse.data;
						}
						return true;
					} else {
						if (oResponse.status === "parsererror") {
							jQuery.sap.log.error("The mockdata for entity set \"" + oEntitySet.name + "\" could not be loaded due to a parsing error!");
						}
						return false;
					}
				};

				// load all the mock data in one single file
				if (jQuery.sap.endsWith(sBaseUrl, ".json")) {
					var oResponse = jQuery.sap.sjax({
						url: sBaseUrl,
						dataType: "json"
					});
					if (oResponse.success) {
						mData = oResponse.data;
					} else {
						jQuery.sap.log.warning("The mockdata for all the entity types could not be found at \"" + sBaseUrl + "\"!");
					}
				} else {
					// load the mock data individually
					jQuery.each(mEntitySets, function(sEntitySetName, oEntitySet) {
						if (!mData[oEntitySet.type] || !mData[oEntitySet.name]) {
							// first look for a file by
							// the entity set name
							var sEntitySetUrl = sBaseUrl + oEntitySet.name + ".json";
							if (!fnLoadMockData(sEntitySetUrl, oEntitySet)) {
								jQuery.sap.log.warning("The mockdata for entity set \"" + oEntitySet.name + "\" could not be found at \"" + sBaseUrl + "\"!");
								var sEntityTypeUrl = sBaseUrl + oEntitySet.type + ".json";
								if (!fnLoadMockData(sEntityTypeUrl, oEntitySet)) {
									jQuery.sap.log.warning("The mockdata for entity type \"" + oEntitySet.type + "\" could not be found at \"" + sBaseUrl + "\"!");
									// generate random
									// mock data
									if (!!that._bGenerateMissingMockData) {
										var mEntitySet = {};
										mEntitySet[oEntitySet.name] = oEntitySet;
										mData[oEntitySet.type] = that._generateODataMockdataForEntitySet(mEntitySet, that._oMetadata)[oEntitySet.name];
									}
								}
							}
						}
					});
				}
				// create the mock data for the entity sets and enhance
				// the mock data with metadata
				jQuery.each(mEntitySets, function(sEntitySetName, oEntitySet) {
					// we clone because of unique metadata for
					// individual entity sets otherwise the data of the
					// entity types would be a
					// reference and thus it overrides the metadata from
					// the other entity type.
					// this happens especially then when we have two
					// entity sets for the same
					// entity type => maybe we move the metdata
					// generation to the response creation!
					that._oMockdata[sEntitySetName] = [];
					if (mData[oEntitySet.name]) {
						jQuery.each(mData[oEntitySet.name], function(iIndex, oEntity) {
							that._oMockdata[sEntitySetName].push(jQuery.extend(true, {}, oEntity));
						});
					} else if (mData[oEntitySet.type]) {
						jQuery.each(mData[oEntitySet.type], function(iIndex, oEntity) {
							that._oMockdata[sEntitySetName].push(jQuery.extend(true, {}, oEntity));
						});
					}

					// enhance with OData metadata if exists
					if (that._oMockdata[sEntitySetName].length > 0) {
						that._enhanceWithMetadata(oEntitySet, that._oMockdata[sEntitySetName]);
					}
				});
				// return the new mockdata
				return this._oMockdata;
			};

			/**
			 * enhances the mock data for the given entity set with the necessary metadata.
			 * Important is at least to have a metadata entry incl. uri for the entry and
			 * for the navigation property it is required to have a deferred infor in case
			 * of not expanding it.
			 * @param {object} oEntitySet the entity set info
			 * @param {object} oMockData mock data for the entity set
			 * @private
			 */
			MockServer.prototype._enhanceWithMetadata = function(oEntitySet, oMockData) {
				if (oMockData) {
					var that = this,
						sRootUri = this._getRootUri(),
						sEntitySetName = oEntitySet && oEntitySet.name;
					jQuery.each(oMockData, function(iIndex, oEntry) {
						// add the metadata for the entry (type is pointing to the EntityType which is required by datajs to resolve properties)
						oEntry.__metadata = {
							id: sRootUri + sEntitySetName + "(" + that._createKeysString(oEntitySet, oEntry) + ")",
							type: oEntitySet.schema + "." + oEntitySet.type,
							uri: sRootUri + sEntitySetName + "(" + that._createKeysString(oEntitySet, oEntry) + ")"
						};
						// add the navigation properties
						jQuery.each(oEntitySet.navprops, function(sKey, oNavProp) {
							if (oEntry[sKey] && !jQuery.isEmptyObject(oEntry[sKey]) && !oEntry[sKey]["__deferred"]) {
								that._oMockdata[oNavProp.to.entitySet] = that._oMockdata[oNavProp.to.entitySet]
									.concat([oEntry[sKey]]);
							}
							oEntry[sKey] = {
								__deferred: {
									uri: sRootUri + sEntitySetName + "(" + that._createKeysString(oEntitySet, oEntry) + ")/" + sKey
								}
							};
						});
					});
				}
			};

			/**
			 * verify entitytype keys type ((e.g. Int, String, SByte, Time, DateTimeOffset, Decimal, Double, Single, Boolean, DateTime)
			 * @param {oEntitySet} the entity set for verification
			 * @param {aRequestedKeys} aRequestedKeys the requested Keys
			 * @return boolean
			 * @private
			 */
			MockServer.prototype._isRequestedKeysValid = function(oEntitySet, aRequestedKeys) {

				// If the Entry has a single key Property the predicate may include only the value of the key Property
				if (aRequestedKeys.length === 1) {
					var aSplitEq = aRequestedKeys[0].split('=');
					if (this._trim(aSplitEq[0]) !== oEntitySet.keys[0]) {
						aRequestedKeys = [oEntitySet.keys[0] + "=" + aRequestedKeys[0]];
					}
				}

				for (var i = 0; i < aRequestedKeys.length; i++) {
					var sKey = this._trim(aRequestedKeys[i].substring(0, aRequestedKeys[i].indexOf('=')));
					var sRequestValue = this._trim(aRequestedKeys[i].substring(aRequestedKeys[i].indexOf('=') + 1));
					var sFirstChar = sRequestValue.charAt(0);
					var sLastChar = sRequestValue.charAt(sRequestValue.length - 1);

					if (oEntitySet.keysType[sKey] === "Edm.String") {
						if (sFirstChar !== "'" || sLastChar !== "'") {
							this._logAndThrowMockServerCustomError(400, this._oErrorMessages.MALFORMED_URI_LITERAL_SYNTAX_IN_KEY, sKey);
						}
					} else if (oEntitySet.keysType[sKey] === "Edm.DateTime") {
						if (sFirstChar === "'" || sLastChar !== "'") {
							this._logAndThrowMockServerCustomError(400, this._oErrorMessages.MALFORMED_URI_LITERAL_SYNTAX_IN_KEY, sKey);
						}
					} else if (oEntitySet.keysType[sKey] === "Edm.Guid") {
						if (sFirstChar === "'" || sLastChar !== "'") {
							this._logAndThrowMockServerCustomError(400, this._oErrorMessages.MALFORMED_URI_LITERAL_SYNTAX_IN_KEY, sKey);
						}
					} else {
						if ((sFirstChar === "'" && sLastChar !== "'") || (sLastChar === "'" && sFirstChar !== "'")) {
							this._logAndThrowMockServerCustomError(400, this._oErrorMessages.MALFORMED_URI_LITERAL_SYNTAX_IN_KEY, sKey);
						}
					}

					var sKeys = oEntitySet.keys.join(",");
					if (oEntitySet.keys.indexOf(sKey) === -1) {
						this._logAndThrowMockServerCustomError(400, this._oErrorMessages.INVALID_KEY_NAME, sKeys);
					}
				}
			};

			/**
			 * Takes a string '<poperty1>=<value1>, <poperty2>=<value2>,...' and creates an
			 * object (hash map) out of it.
			 *
			 * @param {sKeys}
			 *            the string of porperty/value pairs
			 * @param {object}
			 *            object consisting of the parsed properties
			 */
			MockServer.prototype._parseKeys = function(sKeys, oEntitySet) {
				var oResult = {}; // default is an empty hash map
				var aProps = sKeys.split(",");
				var sKeyName, sKeyValue, aPair;
				for (var i = 0; i < aProps.length; i++) {
					aPair = aProps[i].split("=");
					if (aPair.length === 1 && oEntitySet.keys.length === 1) {
						sKeyName = oEntitySet.keys[0];
						sKeyValue = aPair[0];
					} else {
						if (aPair.length === 2) {
							sKeyName = aPair[0];
							sKeyValue = aPair[1];
						}
					}
					if (sKeyValue.indexOf('\'') === 0) {
						oResult[sKeyName] = sKeyValue.slice(1, sKeyValue.length - 1);
					} else {
						oResult[sKeyName] = sKeyValue;
					}
				}
				return oResult;
			};

			/**
			 * Generate mock value for a specific property type. String value will be
			 * based on the property name and an index Integer / Decimal value will be
			 * generated randomly Date / Time / DateTime value will also be generated
			 * randomly
			 *
			 * @param {string}
			 *            sKey the property name
			 * @param {string}
			 *            sType the property type without the Edm prefix
			 * @param {map}
			 *            mComplexTypes map of the complex types
			 * @return {object} the mocked value
			 * @private
			 */
			MockServer.prototype._generatePropertyValue = function(sKey, sType, mComplexTypes, iIndexParameter) {
				var iIndex = iIndexParameter;
				if (!iIndex) {
					iIndex = Math.floor(Math.random() * 10000) + 101;
				}
				switch (sType) {
					case "String":
						return sKey + " " + iIndex;
					case "DateTime":
						var date = new Date();
						date.setFullYear(2000 + Math.floor(Math.random() * 20));
						date.setDate(Math.floor(Math.random() * 30));
						date.setMonth(Math.floor(Math.random() * 12));
						date.setMilliseconds(0);
						return "/Date(" + date.getTime() + ")/";
					case "Int16":
					case "Int32":
					case "Int64":
						return Math.floor(Math.random() * 10000);
					case "Decimal":
						return Math.floor(Math.random() * 1000000) / 100;
					case "Boolean":
						return Math.random() < 0.5;
					case "Byte":
						return Math.floor(Math.random() * 10);
					case "Double":
						return Math.random() * 10;
					case "Single":
						return Math.random() * 1000000000;
					case "SByte":
						return Math.floor(Math.random() * 10);
					case "Time":
						return Math.floor(Math.random() * 23) + ":" + Math.floor(Math.random() * 59) + ":" + Math.floor(Math.random() * 59);
					case "Guid":
						return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
							var r = Math.random() * 16 | 0,
								v = c === 'x' ? r : (r & 0x3 | 0x8);
							return v.toString(16);
						});
					case "Binary":
						var nMask = Math.floor(-2147483648 + Math.random() * 4294967295),
							sMask = "";
						/*eslint-disable */
						for (var nFlag = 0, nShifted = nMask; nFlag < 32; nFlag++, sMask += String(nShifted >>> 31), nShifted <<= 1)
						;
						/*eslint-enable */
						return sMask;
					case "DateTimeOffset":
						var date = new Date();
						date.setFullYear(2000 + Math.floor(Math.random() * 20));
						date.setDate(Math.floor(Math.random() * 30));
						date.setMonth(Math.floor(Math.random() * 12));
						date.setMilliseconds(0);
						return "/Date(" + date.getTime() + "+0000)/";
					default:
						return this._generateDataFromEntity(mComplexTypes[sType], iIndex, mComplexTypes);
				}
			};

			/**
			 * This method returns true if the value is a falsey value
			 * (Falsey: Something which evaluates to FALSE.)
			 * @param {vKeyValue}
			 *            vKeyValue the key value
			 * @param {sKey}
			 *            sKey is the key name
			 * @param {sKeyType}
			 *            sKeyType the edm type of the property
			 */
			MockServer.prototype._isFalseyValue = function(vKeyValue, sKey, sKeyType) {
				switch (sKeyType) {
					case "Edm.String":
						return vKeyValue === "";
					case "Edm.Boolean":
						return vKeyValue === false;
					case "Edm.Int16":
					case "Edm.Int32":
					case "Edm.Int64":
					case "Edm.Decimal":
					case "Edm.Byte":
					case "Edm.Double":
					case "Edm.Single":
					case "Edm.SByte":
						return vKeyValue === 0 || isNaN(vKeyValue);
					default:
						return false;
				}
			};

			/**
			 * This method takes over the already existing key values from oKeys and
			 * adds values for all remaining keys specified by oEntitySet.
			 * The result is merged into oEntity.
			 *
			 * @param {object}
			 *            oEntitySet description of the entity set, conatins the full list of key fields
			 * @param {oKeys}
			 *            oKeys contains already defined key values
			 * @param {oEntity}
			 *            oEntity the result object, where the key property/value pairs merged into
			 */
			MockServer.prototype._completeKey = function(oEntitySet, oKeys, oEntity) {
				if (oEntity) {
					for (var i = 0; i < oEntitySet.keys.length; i++) {
						var sKey = oEntitySet.keys[i];
						// if the key has value, just use it
						if (oKeys[sKey] || this._isFalseyValue(oKeys[sKey], sKey, oEntitySet.keysType[sKey])) {
							if (!oEntity[sKey]) {
								// take over the specified key value
								switch (oEntitySet.keysType[sKey]) {
									case "Edm.DateTime":
										oEntity[sKey] = this._getJsonDate(oKeys[sKey]);
										break;
									case "Edm.Guid":
										oEntity[sKey] = oKeys[sKey].substring(5, oKeys[sKey].length - 1);
										break;
									default:
										oEntity[sKey] = oKeys[sKey];
								}
							}
						} else {
							//the key has no value, generate value
							if (!oEntity[sKey]) {
								// take over the specified key value
								oEntity[sKey] = this._generatePropertyValue(sKey, oEntitySet.keysType[sKey]
									.substring(oEntitySet.keysType[sKey].lastIndexOf('.') + 1));
							}
						}
					}
				}
			};

			/**
			 * Generate some mock data for a specific entityType. String value will be
			 * based on the property name and an index Integer / Decimal value will be
			 * generated randomly Date / Time / DateTime value will also be generated
			 * randomly
			 *
			 * @param {object}
			 *            oEntityType the entity type used to generate the data
			 * @param {int}
			 *            iIndex index of this particular object in the parent
			 *            collection
			 * @param {map}
			 *            mComplexTypes map of the complex types
			 * @return {object} the mocked entity
			 * @private
			 */
			MockServer.prototype._generateDataFromEntity = function(oEntityType, iIndex, mComplexTypes) {
				var oEntity = {};
				if (!oEntityType) {
					return oEntity;
				}
				for (var i = 0; i < oEntityType.properties.length; i++) {
					var oProperty = oEntityType.properties[i];
					oEntity[oProperty.name] = this._generatePropertyValue(oProperty.name, oProperty.type, mComplexTypes, iIndex);
				}
				return oEntity;
			};

			/**
			 * Generate some mock data for a specific entityset.
			 * @param {object} oEntitySet the entity set for which we want to generate the data
			 * @param {map} mEntityTypes map of the entity types
			 * @param {map} mComplexTypes map of the complex types
			 * @return {array} the array of mocked data
			 * @private
			 */
			MockServer.prototype._generateDataFromEntitySet = function(oEntitySet, mEntityTypes, mComplexTypes) {
				var oEntityType = mEntityTypes[oEntitySet.type];
				var aMockedEntries = [];
				for (var i = 0; i < 100; i++) {
					aMockedEntries.push(this._generateDataFromEntity(oEntityType, i + 1, mComplexTypes));
				}
				return aMockedEntries;
			};

			/**
			 * Generate some mock data based on the metadata specified for the odata service.
			 * @param {map} mEntitySets map of the entity sets
			 * @param {object} oMetadata the complete metadata for the service
			 * @private
			 */
			MockServer.prototype._generateMockdata = function(mEntitySets, oMetadata) {
				var that = this;
				var oMockData = {};
				jQuery.each(mEntitySets, function(sEntitySetName, oEntitySet) {
					var mEntitySet = {};
					mEntitySet[oEntitySet.name] = oEntitySet;
					oMockData[sEntitySetName] = that._generateODataMockdataForEntitySet(mEntitySet, oMetadata)[sEntitySetName];
				});

				this._oMockdata = oMockData;
			};

			/**
			 * Generate some mock data based on the metadata specified for the odata service.
			 * @param {map} mEntitySets map of the entity sets
			 * @param {object} oMetadata the complete metadata for the service
			 * @private
			 */
			MockServer.prototype._generateODataMockdataForEntitySet = function(mEntitySets, oMetadata) {
				// load the entity sets (map the entity type data to the entity set)
				var that = this,
					sRootUri = this._getRootUri(),
					oMockData = {};

				// here we need to analyse the EDMX and identify the entity types and complex types
				var mEntityTypes = this._findEntityTypes(oMetadata);
				var mComplexTypes = this._findComplexTypes(oMetadata);

				jQuery.each(mEntitySets, function(sEntitySetName, oEntitySet) {
					oMockData[sEntitySetName] = that._generateDataFromEntitySet(oEntitySet, mEntityTypes, mComplexTypes);
					jQuery.each(oMockData[sEntitySetName], function(iIndex, oEntry) {
						// add the metadata for the entry
						oEntry.__metadata = {
							uri: sRootUri + sEntitySetName + "(" + that._createKeysString(oEntitySet, oEntry) + ")",
							type: oEntitySet.schema + "." + oEntitySet.type
						};
						// add the navigation properties
						jQuery.each(oEntitySet.navprops, function(sKey, oNavProp) {
							oEntry[sKey] = {
								__deferred: {
									uri: sRootUri + sEntitySetName + "(" + that._createKeysString(oEntitySet, oEntry) + ")/" + sKey
								}
							};
						});
					});
				});
				return oMockData;
			};

			// helper function to resolve a navigation and return the matching entities
			MockServer.prototype._resolveNavigation = function(sEntitySetName, oFromRecord, sNavProp) {
				var oEntitySet = this._mEntitySets[sEntitySetName];
				var oNavProp = oEntitySet.navprops[sNavProp];
				if (!oNavProp) {
					this._logAndThrowMockServerCustomError(404, this._oErrorMessages.RESOURCE_NOT_FOUND);
				}

				var aEntries = [];
				var iPropRefLength = oNavProp.from.propRef.length;
				//if there is no ref.constraint, the data is return according to the multiplicity
				if (iPropRefLength === 0) {
					if (oNavProp.to.multiplicity === "*") {
						return this._oMockdata[oNavProp.to.entitySet];
					} else {
						aEntries.push(this._oMockdata[oNavProp.to.entitySet][0]);
						return aEntries;
					}
				}
				// maybe we can do symbolic links with a function to handle the navigation properties
				// instead of copying the data into the nested structures
				jQuery.each(this._oMockdata[oNavProp.to.entitySet], function(iIndex, oToRecord) {

					// check for property ref being identical
					var bEquals = true;
					for (var i = 0; i < iPropRefLength; i++) {
						if (oFromRecord[oNavProp.from.propRef[i]] !== oToRecord[oNavProp.to.propRef[i]]) {
							bEquals = false;
							break;
						}
					}
					// if identical we add the to record
					if (bEquals) {
						aEntries.push(oToRecord);
					}

				});
				return aEntries;
			};

			/**
			 * Simulates an existing OData service by sepcifiying the metadata URL and the base URL for the mockdata. The server
			 * configures the request handlers depending on the service metadata. The mockdata needs to be stored individually for
			 * each entity type in a separate JSON file. The name of the JSON file needs to match the name of the entity type. If
			 * no base url for the mockdata is specified then the mockdata are generated from the metadata
			 *
			 * @param {string} sMetadataUrl url to the service metadata document
			 * @param {string|object} [vMockdataSettings] (optional) base url which contains the path to the mockdata, or an object which contains the following properties: sMockdataBaseUrl, bGenerateMissingMockData. See below for descriptions of these parameters. Ommit this parameter to produce random mock data based on the service metadata.
			 * @param {string} [vMockdataSettings.sMockdataBaseUrl] base url which contains the mockdata as single .json files or the .json file containing the complete mock data
			 * @param {boolean} [vMockdataSettings.bGenerateMissingMockData] true for the MockServer to generate mock data for missing .json files that are not found in sMockdataBaseUrl. Default value is false.
			 *
			 * @since 1.13.2
			 * @public
			 */
			MockServer.prototype.simulate = function(sMetadataUrl, vMockdataSettings) {
				var that = this;
				this._sMetadataUrl = sMetadataUrl;
				if (!vMockdataSettings || typeof vMockdataSettings === "string") {
					this._sMockdataBaseUrl = vMockdataSettings;
				} else {
					this._sMockdataBaseUrl = vMockdataSettings.sMockdataBaseUrl;
					this._bGenerateMissingMockData = vMockdataSettings.bGenerateMissingMockData;
				}

				this._refreshData();

				// helper to handle xsrf token
				var fnHandleXsrfTokenHeader = function(oXhr, mHeaders) {
					if (oXhr.requestHeaders["x-csrf-token"] === "Fetch") {
						mHeaders["X-CSRF-Token"] = "42424242424242424242424242424242";
					}
				};

				// helper to find the entity set entry for a given entity set name and the keys of the entry
				var fnGetEntitySetEntry = function(sEntitySetName, sKeys) {
					sKeys = decodeURIComponent(sKeys);
					var oFoundEntry;
					var oEntitySet = that._mEntitySets[sEntitySetName];
					var aKeys = oEntitySet.keys;
					// split keys
					var aRequestedKeys = sKeys.split(',');

					// check number of keys to be equal to the entity keys and validates keys type for quotations
					if (aRequestedKeys.length !== aKeys.length) {
						that._logAndThrowMockServerCustomError(400, that._oErrorMessages.INVALID_KEY_PREDICATE_QUANTITY);
					}
					that._isRequestedKeysValid(oEntitySet, aRequestedKeys);
					if (aRequestedKeys.length === 1 && !aRequestedKeys[0].split('=')[1]) {
						aRequestedKeys = [aKeys[0] + "=" + aRequestedKeys[0]];
					}
					jQuery.each(that._oMockdata[sEntitySetName], function(iIndex, oEntry) {
						// check each key for existence and value
						for (var i = 0; i < aRequestedKeys.length; i++) {
							var aKeyVal = aRequestedKeys[i].split('=');
							var sKey = that._trim(aKeyVal[0]);
							//key doesn't match, continue to next entry
							if (jQuery.inArray(sKey, aKeys) === -1) {
								return true; // = continue
							}

							var sNewValue = that._trim(aKeyVal[1]);
							var sOrigiValue = oEntry[sKey];

							switch (oEntitySet.keysType[sKey]) {
								case "Edm.String":
									sNewValue = sNewValue.replace(/^\'|\'$/g, '');
									break;
								case "Edm.Time":
								case "Edm.DateTime":
									sOrigiValue = that._getDateTime(sOrigiValue);
									break;
								case "Edm.Int16":
								case "Edm.Int32":
								//case "Edm.Int64": In ODataModel this type is represented as a string. (https://openui5.hana.ondemand.com/docs/api/symbols/sap.ui.model.odata.type.Int64.html)
								case "Edm.Decimal":
								case "Edm.Byte":
								case "Edm.Double":
								case "Edm.Single":
								case "Edm.SByte":
									if (!that._isValidNumber(sNewValue)) {
										//TODO check better handling
										return false; // = break
									}
									sNewValue = parseFloat(sNewValue);
									break;
								case "Edm.Guid":
									sNewValue = sNewValue.replace(/^guid\'|\'$/g, '');
									break;
								case "Edm.Boolean":
								case "Edm.Binary":
								case "Edm.DateTimeOffset":
								default:
									sNewValue = sNewValue;
							}

							//value doesn't match, continue to next entry
							if (sOrigiValue !== sNewValue) {
								return true; // = continue
							}
						}
						oFoundEntry = {
							index: iIndex,
							entry: oEntry
						};
						return false; // = break
					});
					return oFoundEntry;
				};

				// helper to resolve an entity set for insert/delete/update operations
				var fnResolveTargetEntityName = function(oEntitySet, sKeys, sUrlParams) {
					// Set the default entity name
					var sSetName = oEntitySet.name;
					// If there are sUrlParams try to find a navigation property
					var navProp;
					if (sUrlParams) {
						navProp = oEntitySet.navprops[sUrlParams];
					}
					if (navProp) {
						// instead of the default entity name use the endpoints entity
						// name
						sSetName = navProp.to.entitySet;
					}
					return sSetName;
				};

				//helper to handle url param value with '&'
				var fnHandleAmpersandUrlParam = function(aUrlParams) {

					var aUrlParamsNormalized = [];

					var fnStartsWith = function(sValue) {
						var apostLocation = sValue.indexOf("'");
						var doubleQuotesLocation = sValue.indexOf("\"");
						if (apostLocation === -1 && doubleQuotesLocation === -1) {
							return null;
						} else {
							if (apostLocation > -1 && doubleQuotesLocation === -1) {
								return "appost";
							}
							if (doubleQuotesLocation > -1 && apostLocation === -1) {
								return "doublequotes";
							}
							if (apostLocation > -1 && doubleQuotesLocation > -1 && apostLocation < doubleQuotesLocation) {
								return "appost";
							}
							if (apostLocation > -1 && doubleQuotesLocation > -1 && doubleQuotesLocation < apostLocation) {
								return "doublequotes";
							}
						}

					};

					var fnAmpersandHandler = function(aParams, aParamsNorm, index, apostType) {
						var stringAmpersand = aParams[index];
						var j = index + 1;
						while (j < aParams.length && aParams[j].indexOf(apostType) === -1) {
							stringAmpersand = stringAmpersand + "&" + aParams[j];
							j++;
						}

						stringAmpersand = stringAmpersand + "&" + aParams[j];

						aParamsNorm.push(stringAmpersand);
						index = j;
						return index;
					};

					for (var i = 0; i < aUrlParams.length; i++) {
					    // there is no ' and no " in param values
						if (!fnStartsWith(aUrlParams[i])) {
							aUrlParamsNormalized.push(aUrlParams[i]);
						}
						// there is ' in param value
						if (fnStartsWith(aUrlParams[i]) === "appost") {
							var firstLocation = aUrlParams[i].indexOf("'");
							if (aUrlParams[i].indexOf("'", firstLocation + 1) === -1) {
								i = fnAmpersandHandler(aUrlParams, aUrlParamsNormalized, i, "'");
							} else {
								aUrlParamsNormalized.push(aUrlParams[i]);
							}
						}
						// there is " in param value
						if (fnStartsWith(aUrlParams[i]) === "doublequotes") {
							var firstQuotesLocation = aUrlParams[i].indexOf("\"");
							if (aUrlParams[i].indexOf("\"", firstQuotesLocation + 1) === -1) {
								i = fnAmpersandHandler(aUrlParams, aUrlParamsNormalized, i, "\"");
							} else {
								aUrlParamsNormalized.push(aUrlParams[i]);
							}
						}
					}

					return aUrlParamsNormalized;
				};

				var initNewEntity = function(oXhr, sTargetEntityName, sKeys, sUrlParams) {
					var oEntity = JSON.parse(oXhr.requestBody);
					if (oEntity) {
						var oKeys = {};
						if (sKeys) {
							oKeys = that._parseKeys(sKeys, that._mEntitySets[sTargetEntityName]);
						}
						that._completeKey(that._mEntitySets[sTargetEntityName], oKeys, oEntity);
						that._enhanceWithMetadata(that._mEntitySets[sTargetEntityName], [oEntity]);
						return oEntity;
					}
					return null;
				};

				// create the request handlers
				var aRequests = [];

				// add the $metadata request
				aRequests.push({
					method: "GET",
					path: new RegExp("\\$metadata([?#].*)?"),
					response: function(oXhr) {
						jQuery.sap.require("jquery.sap.xml");
						jQuery.sap.log.debug("MockServer: incoming request for url: " + oXhr.url);
						var mHeaders = {
							"Content-Type": "application/xml;charset=utf-8"
						};
						fnHandleXsrfTokenHeader(oXhr, mHeaders);

						oXhr.respond(200, mHeaders, jQuery.sap.serializeXML(that._oMetadata));
						jQuery.sap.log.debug("MockServer: response sent with: 200, " + jQuery.sap.serializeXML(that._oMetadata));
						return true;
					}
				});
				
				// add the service request (HEAD request for CSRF Token)
				aRequests.push({
					method: "HEAD",
					path: new RegExp("$"),
					response: function(oXhr) {
						jQuery.sap.log.debug("MockServer: incoming request for url: " + oXhr.url);
						var mHeaders = {
							"Content-Type": "application/json;charset=utf-8"
						};
						fnHandleXsrfTokenHeader(oXhr, mHeaders);
						oXhr.respond(200, mHeaders);
						jQuery.sap.log.debug("MockServer: response sent with: 200");
						return true;
					}
				});

				// add the service request
				aRequests.push({
					method: "GET",
					path: new RegExp("$"),
					response: function(oXhr) {
						jQuery.sap.log.debug("MockServer: incoming request for url: " + oXhr.url);
						var mHeaders = {
							"Content-Type": "application/json;charset=utf-8"
						};
						fnHandleXsrfTokenHeader(oXhr, mHeaders);
						var aEntitysets = [];
						jQuery.each(that._mEntitySets, function(sEntitySetName, oEntitySet) {
							aEntitysets.push(sEntitySetName);
						});
						var oResponse = {
							EntitySets: aEntitysets
						};
						oXhr.respond(200, mHeaders, JSON.stringify({
							d: oResponse
						}));
						jQuery.sap.log.debug("MockServer: response sent with: 200, " + JSON.stringify({
							d: oResponse
						}));
						return true;
					}
				});

				// batch processing
				aRequests
					.push({
						method: "POST",
						path: new RegExp("\\$batch([?#].*)?"),
						response: function(oXhr) {
							jQuery.sap.log.debug("MockServer: incoming request for url: " + oXhr.url);
							var fnResovleStatus = function(iStatusCode) {
								switch (iStatusCode) {
									case 200:
										return "200 OK";
									case 204:
										return "204 No Content";
									case 201:
										return "201 Created";
									case 400:
										return "400 Bad Request";
									case 403:
										return "403 Forbidden";
									case 404:
										return "404 Not Found";
									default:
										return iStatusCode;
								}
							};
							var fnBuildResponseString = function(oResponse, sContentType) {
								var sResponseData = JSON.stringify(oResponse.data) || "";
								if (!oResponse.success) {
									sResponseData = oResponse.errorResponse;
								}
								if (sContentType) {
									return "HTTP/1.1 " + fnResovleStatus(oResponse.statusCode) + "\r\nContent-Type: " + sContentType + "\r\nContent-Length: " +
										sResponseData.length + "\r\ndataserviceversion: 2.0\r\n\r\n" + sResponseData + "\r\n";
								}
								return "HTTP/1.1 " + fnResovleStatus(oResponse.statusCode) + "\r\nContent-Type: application/json\r\nContent-Length: " +
									sResponseData.length + "\r\ndataserviceversion: 2.0\r\n\r\n" + sResponseData + "\r\n";
							};
							// START BATCH HANDLING
							var sRequestBody = oXhr.requestBody;
							var oBoundaryRegex = new RegExp("--batch_[a-z0-9-]*");
							var sBoundary = oBoundaryRegex.exec(sRequestBody)[0];
							// boundary is defined in request header
							if (!!sBoundary) {
								var aBatchBodyResponse = [];
								//split requests by boundary
								var aBatchRequests = sRequestBody.split(sBoundary);
								var sServiceURL = oXhr.url.split("$")[0];

								var rPut = new RegExp("PUT (.*) HTTP");
								var rMerge = new RegExp("MERGE (.*) HTTP"); //TODO temporary solution to handle merge as put
								var rPost = new RegExp("POST (.*) HTTP");
								var rDelete = new RegExp("DELETE (.*) HTTP");
								var rGet = new RegExp("GET (.*) HTTP");

								for (var i = 1; i < aBatchRequests.length - 1; i++) {
									var sBatchRequest = aBatchRequests[i];
									//GET Handling
									if (rGet.test(sBatchRequest) && sBatchRequest.indexOf("multipart/mixed") === -1) {
										//In case of POST, PUT or DELETE not in ChangeSet
										if (rPut.test(sBatchRequest) || rPost.test(sBatchRequest) || rDelete.test(sBatchRequest)) {
											oXhr
												.respond(400, null,
													"The Data Services Request could not be understood due to malformed syntax");
											jQuery.sap.log.debug("MockServer: response sent with: 400");
											return true;
										}
										var oResponse = jQuery.sap.sjax({
											url: sServiceURL + rGet.exec(sBatchRequest)[1],
											dataType: "json"
										});
										var sResponseString;
										if (rGet.exec(sBatchRequest)[1].indexOf('$count') !== -1) {
											sResponseString = fnBuildResponseString(oResponse, "text/plain");
										} else {
											sResponseString = fnBuildResponseString(oResponse);
										}
										aBatchBodyResponse.push("\r\nContent-Type: application/http\r\n" + "Content-Length: " + sResponseString.length + "\r\n" +
											"content-transfer-encoding: binary\r\n\r\n" + sResponseString);
									} else {
										//CUD handling within changesets
										// copying the mock data to support rollback
										var oCopiedMockdata = jQuery.extend(true, {}, that._oMockdata);
										var aChangesetResponses = [];

										/*eslint-disable no-loop-func */
										var fnCUDRequest = function(rCUD, sData, sType) {
											var oResponse = jQuery.sap.sjax({
												type: sType,
												url: sServiceURL + rCUD.exec(sChangesetRequest)[1],
												dataType: "json",
												data: sData
											});

											if (oResponse.statusCode === 400 || oResponse.statusCode === 404) {
												var sError = "\r\nHTTP/1.1 " + fnResovleStatus(oResponse.statusCode) +
													"\r\nContent-Type: application/json\r\nContent-Length: 0\r\n\r\n";
												throw new Error(sError);
											}
											aChangesetResponses.push(fnBuildResponseString(oResponse));
										};
										/*eslint-enable no-loop-func */
										// extract changeset
										var sChangesetBoundary = sBatchRequest.substring(
											sBatchRequest.indexOf("boundary=") + 9, sBatchRequest.indexOf("\r\n\r\n"));
										var aChangesetRequests = sBatchRequest.split("--" + sChangesetBoundary);

										try {
											for (var j = 1; j < aChangesetRequests.length - 1; j++) {
												var sChangesetRequest = aChangesetRequests[j];
												//Check if GET exists in ChangeSet - Return 400
												var sData;
												if (rGet.test(sChangesetRequest)) {
													// rollback
													that._oMockdata = oCopiedMockdata;
													oXhr
														.respond(400, null,
															"The Data Services Request could not be understood due to malformed syntax");
													jQuery.sap.log.debug("MockServer: response sent with: 400");
													return;
												} else if (rPut.test(sChangesetRequest)) {
													// PUT
													sData = sChangesetRequest.substring(sChangesetRequest.indexOf("{"),
														sChangesetRequest.lastIndexOf("}") + 1);
													fnCUDRequest(rPut, sData, 'PUT');
												} else if (rMerge.test(sChangesetRequest)) {
													// MERGE
													sData = sChangesetRequest.substring(sChangesetRequest.indexOf("{"),
														sChangesetRequest.lastIndexOf("}") + 1);
													fnCUDRequest(rMerge, sData, 'MERGE');
												} else if (rPost.test(sChangesetRequest)) {
													// POST
													sData = sChangesetRequest.substring(sChangesetRequest.indexOf("{"),
														sChangesetRequest.lastIndexOf("}") + 1);
													fnCUDRequest(rPost, sData, 'POST');
												} else if (rDelete.test(sChangesetRequest)) {
													// DELETE
													fnCUDRequest(rDelete, null, 'DELETE');
												}
											} //END ChangeSets FOR
											var sChangesetRespondData = "\r\nContent-Type: multipart/mixed; boundary=ejjeeffe1\r\n\r\n--ejjeeffe1";
											for (var k = 0; k < aChangesetResponses.length; k++) {
												sChangesetRespondData += "\r\nContent-Type: application/http\r\n" + "Content-Length: " + aChangesetResponses[k].length +
													"\r\n" + "content-transfer-encoding: binary\r\n\r\n" + aChangesetResponses[k] + "--ejjeeffe1";
											}
											sChangesetRespondData += "--\r\n";
											aBatchBodyResponse.push(sChangesetRespondData);
										} catch (oError) {
											that._oMockdata = oCopiedMockdata;
											var sError = "\r\nContent-Type: application/http\r\n" + "Content-Length: " + oError.message.length + "\r\n" +
												"content-transfer-encoding: binary\r\n\r\n" + oError.message;
											aBatchBodyResponse.push(sError);
										}
									} //END ChangeSets handling
								} //END Main FOR
								//CREATE BATCH RESPONSE
								var sRespondData = "--ejjeeffe0";
								for (var m = 0; m < aBatchBodyResponse.length; m++) {
									sRespondData += aBatchBodyResponse[m] + "--ejjeeffe0";
								}
								sRespondData += "--";
								var mHeaders = {
									'Content-Type': "multipart/mixed; boundary=ejjeeffe0"
								};
								fnHandleXsrfTokenHeader(oXhr, mHeaders);
								oXhr.respond(202, mHeaders, sRespondData);
								jQuery.sap.log.debug("MockServer: response sent with: 202, " + sRespondData);
								//no boundary is defined
							} else {
								oXhr.respond(202);
							}
							return true;
						}
					});

				// add entity sets
				jQuery
					.each(
						this._mEntitySets,
						function(sEntitySetName, oEntitySet) {
							// support $count requests on entity set
							aRequests.push({
								method: "GET",
								path: new RegExp("(" + sEntitySetName + ")/\\$count/?(.*)?"),
								response: function(oXhr, sEntitySetName, sUrlParams) {
									jQuery.sap.log.debug("MockServer: incoming request for url: " + oXhr.url);
									//trigger the before callback funtion
									that.fireEvent(sap.ui.core.util.MockServer.HTTPMETHOD.GET + sEntitySetName + ":before", {
										oXhr: oXhr,
										sUrlParams: sUrlParams
									});
									that.fireEvent(sap.ui.core.util.MockServer.HTTPMETHOD.GET + ":before", {
										oXhr: oXhr,
										sUrlParams: sUrlParams
									});
									var mHeaders = {
										"Content-Type": "text/plain;charset=utf-8"
									};
									fnHandleXsrfTokenHeader(oXhr, mHeaders);
									try {
										var aData = that._oMockdata[sEntitySetName];
										if (aData) {
											// using extend to copy the data to a new array
											var oFilteredData = {
												results: jQuery.extend(true, [], aData)
											};
											if (sUrlParams) {
												// sUrlParams should not contains ?, but only & in its stead
												var aUrlParams = decodeURIComponent(sUrlParams).replace("?", "&").split("&");
												aUrlParams = fnHandleAmpersandUrlParam(aUrlParams);
												if (aUrlParams.length > 1) {
													aUrlParams = that._orderQueryOptions(aUrlParams);
												}
												jQuery.each(aUrlParams, function(iIndex, sQuery) {
													that._applyQueryOnCollection(oFilteredData, sQuery,
														sEntitySetName);
												});
											}

											//trigger the after callback funtion
											that.fireEvent(sap.ui.core.util.MockServer.HTTPMETHOD.GET + sEntitySetName + ":after", {
												oXhr: oXhr,
												oFilteredData: oFilteredData
											});
											that.fireEvent(sap.ui.core.util.MockServer.HTTPMETHOD.GET + ":after", {
												oXhr: oXhr,
												oFilteredData: oFilteredData
											});

											oXhr.respond(200, mHeaders, "" + oFilteredData.results.length);

											jQuery.sap.log.debug("MockServer: response sent with: 200, " +
												oFilteredData.results.length);

										} else {
											that._logAndThrowMockServerCustomError(404, that._oErrorMessages.RESOURCE_NOT_FOUND);
										}

									} catch (e) {
										if (e.error) {
											oXhr.respond(e.error.code, mHeaders, JSON.stringify(e));
										} else {
											jQuery.sap.log.error("MockServer: request failed due to invalid system query options value!");
											oXhr.respond(parseInt(e.message || e.number, 10));
										}
									}
									return true;
								}
							});

							// support entity set with and without OData system query options
							aRequests
								.push({
									method: "GET",
									path: new RegExp(
										"(" + sEntitySetName + ")/?(\\?(.*))?"),
									response: function(oXhr, sEntitySetName, sUrlParams) {
										jQuery.sap.log.debug("MockServer: incoming request for url: " + oXhr.url);

										//trigger the before callback funtion
										that.fireEvent(sap.ui.core.util.MockServer.HTTPMETHOD.GET + sEntitySetName + ":before", {
											oXhr: oXhr,
											sUrlParams: sUrlParams
										});
										that.fireEvent(sap.ui.core.util.MockServer.HTTPMETHOD.GET + ":before", {
											oXhr: oXhr,
											sUrlParams: sUrlParams
										});

										var mHeaders = {
											"Content-Type": "application/json;charset=utf-8"
										};
										fnHandleXsrfTokenHeader(oXhr, mHeaders);
										try {
											var aData = that._oMockdata[sEntitySetName];
											if (aData) {
												// using extend to copy the data to a new array
												var oFilteredData = {
													results: jQuery.extend(true, [], aData)
												};
												if (sUrlParams) {
													// sUrlParams should not contains ?, but only & in its stead
													var aUrlParams = decodeURIComponent(sUrlParams).replace("?", "&").split("&");
													aUrlParams = fnHandleAmpersandUrlParam(aUrlParams);
													if (aUrlParams.length > 1) {
														aUrlParams = that._orderQueryOptions(aUrlParams);
													}
													jQuery.each(aUrlParams, function(iIndex, sQuery) {
														that._applyQueryOnCollection(oFilteredData, sQuery,
															sEntitySetName);
													});
												}

												//trigger the after callback funtion
												that.fireEvent(sap.ui.core.util.MockServer.HTTPMETHOD.GET + sEntitySetName + ":after", {
													oXhr: oXhr,
													oFilteredData: oFilteredData
												});
												that.fireEvent(sap.ui.core.util.MockServer.HTTPMETHOD.GET + ":after", {
													oXhr: oXhr,
													oFilteredData: oFilteredData
												});
												oXhr.respond(200, mHeaders, JSON.stringify({
													d: oFilteredData
												}));
												jQuery.sap.log.debug("MockServer: response sent with: 200, " + JSON.stringify({
													d: oFilteredData
												}));
											} else {
												that._logAndThrowMockServerCustomError(404, that._oErrorMessages.RESOURCE_NOT_FOUND);
											}
										} catch (e) {
											if (e.error) {
												oXhr.respond(e.error.code, mHeaders, JSON.stringify(e));
											} else {
												jQuery.sap.log.debug("MockServer: response sent with: " + parseInt(e.message || e.number, 10));
												oXhr.respond(parseInt(e.message || e.number, 10));
											}
										}
										return true;
									}
								});

							// support access of a single entry of an entity set with and without OData system query options
							aRequests
								.push({
									method: "GET",
									path: new RegExp(
										"(" + sEntitySetName + ")\\(([^/\\?#]+)\\)/?(\\?(.*))?"),
									response: function(oXhr, sEntitySetName, sKeys, sUrlParams) {
										jQuery.sap.log.debug("MockServer: incoming request for url: " + oXhr.url);

										//trigger the before callback funtion
										that.fireEvent(sap.ui.core.util.MockServer.HTTPMETHOD.GET + sEntitySetName + ":before", {
											oXhr: oXhr,
											sKeys: sKeys,
											sUrlParams: sUrlParams
										});
										that.fireEvent(sap.ui.core.util.MockServer.HTTPMETHOD.GET + ":before", {
											oXhr: oXhr,
											sKeys: sKeys,
											sUrlParams: sUrlParams
										});
										var mHeaders = {
											"Content-Type": "application/json;charset=utf-8"
										};
										try {
											var oEntry = jQuery
												.extend(true, {}, fnGetEntitySetEntry(sEntitySetName, sKeys));
											if (!jQuery.isEmptyObject(oEntry)) {
												if (sUrlParams) {
													// sUrlParams should not contains ?, but only & in its stead
													var aUrlParams = decodeURIComponent(sUrlParams).replace("?", "&").split("&");
													aUrlParams = fnHandleAmpersandUrlParam(aUrlParams);

													if (aUrlParams.length > 1) {
														aUrlParams = that._orderQueryOptions(aUrlParams);
													}

													jQuery.each(aUrlParams, function(iIndex, sQuery) {
														oEntry.entry = that._applyQueryOnEntry(oEntry.entry, sQuery,
															sEntitySetName);
													});
												}

												//trigger the after callback funtion
												that.fireEvent(sap.ui.core.util.MockServer.HTTPMETHOD.GET + sEntitySetName + ":after", {
													oXhr: oXhr,
													oEntry: oEntry.entry
												});
												that.fireEvent(sap.ui.core.util.MockServer.HTTPMETHOD.GET + ":after", {
													oXhr: oXhr,
													oEntry: oEntry.entry
												});
												oXhr.respond(200, mHeaders, JSON.stringify({
													d: oEntry.entry
												}));
												jQuery.sap.log.debug("MockServer: response sent with: 200, " + JSON.stringify({
													d: oEntry.entry
												}));
											} else {
												that._logAndThrowMockServerCustomError(404, that._oErrorMessages.RESOURCE_NOT_FOUND);
											}
										} catch (e) {
											if (e.error) {
												oXhr.respond(e.error.code, mHeaders, JSON.stringify(e));
											} else {
												jQuery.sap.log.debug("MockServer: response sent with: " + parseInt(e.message || e.number, 10));
												oXhr.respond(parseInt(e.message || e.number, 10));
											}
										}
										return true;
									}
								});

							// support navigation property
							jQuery
								.each(
									oEntitySet.navprops,
									function(sNavName, oNavProp) {
										// support $count requests on navigation properties
										aRequests.push({
											method: "GET",
											path: new RegExp("(" + sEntitySetName + ")\\(([^/\\?#]+)\\)/(" + sNavName + ")/\\$count/?(.*)?"),
											response: function(oXhr, sEntitySetName, sKeys, sNavProp, sUrlParams) {
												jQuery.sap.log.debug("MockServer: incoming request for url: " + oXhr.url);

												//trigger the before callback funtion
												that.fireEvent(sap.ui.core.util.MockServer.HTTPMETHOD.GET + sEntitySetName + ":before", {
													oXhr: oXhr,
													sKeys: sKeys,
													sNavProp: sNavProp,
													sUrlParams: sUrlParams
												});
												that.fireEvent(sap.ui.core.util.MockServer.HTTPMETHOD.GET + ":before", {
													oXhr: oXhr,
													sKeys: sKeys,
													sNavProp: sNavProp,
													sUrlParams: sUrlParams
												});

												var mHeaders = {
													"Content-Type": "text/plain;charset=utf-8"
												};
												fnHandleXsrfTokenHeader(oXhr, mHeaders);

												try {
													var oEntry = fnGetEntitySetEntry(sEntitySetName, sKeys);
													if (oEntry) {
														var aEntries, oFilteredData = {};

														aEntries = that._resolveNavigation(sEntitySetName,
															oEntry.entry, sNavProp);
														var sMultiplicity = that._mEntitySets[sEntitySetName].navprops[sNavProp].to.multiplicity;
														if (sMultiplicity === "*") {
															oFilteredData = {
																results: jQuery.extend(true, [],
																	aEntries)
															};
														} else {
															oFilteredData = jQuery.extend(true, {},
																aEntries[0]);
														}
														if (aEntries && aEntries.length !== 0) {
															if (sUrlParams) {
																// sUrlParams should not contains ?, but only & in its stead
																var aUrlParams = decodeURIComponent(
																	sUrlParams).replace("?", "&").split("&");
																aUrlParams = fnHandleAmpersandUrlParam(aUrlParams);

																if (aUrlParams.length > 1) {
																	aUrlParams = that
																		._orderQueryOptions(aUrlParams);
																}

																if (sMultiplicity === "*") {
																	jQuery
																		.each(
																			aUrlParams,
																			function(iIndex, sQuery) {
																				that
																					._applyQueryOnCollection(
																						oFilteredData,
																						sQuery,
																						that._mEntitySets[sEntitySetName].navprops[sNavProp].to.entitySet);
																			});
																} else {
																	jQuery
																		.each(
																			aUrlParams,
																			function(iIndex, sQuery) {
																				oFilteredData = that
																					._applyQueryOnEntry(
																						oFilteredData,
																						sQuery,
																						that._mEntitySets[sEntitySetName].navprops[sNavProp].to.entitySet);
																			});
																}
															}
														}

														//trigger the after callback funtion
														that.fireEvent(sap.ui.core.util.MockServer.HTTPMETHOD.GET + sEntitySetName + ":after", {
															oXhr: oXhr,
															oFilteredData: oFilteredData
														});
														that.fireEvent(sap.ui.core.util.MockServer.HTTPMETHOD.GET + ":after", {
															oXhr: oXhr,
															oFilteredData: oFilteredData
														});

														oXhr
															.respond(
																200,
																mHeaders, "" + oFilteredData.results.length);

														jQuery.sap.log
															.debug("MockServer: response sent with: 200, " + oFilteredData.results.length);

													} else {
														that._logAndThrowMockServerCustomError(404, that._oErrorMessages.RESOURCE_NOT_FOUND);
													}
												} catch (e) {
													if (e.error) {
														oXhr.respond(e.error.code, mHeaders, JSON.stringify(e));
													} else {
														jQuery.sap.log.debug("MockServer: response sent with: " + parseInt(e.message || e.number, 10));
														oXhr.respond(parseInt(e.message || e.number, 10));
													}
												}
												return true;
											}
										});

										// support access of navigation property with and without OData system query options
										aRequests
											.push({
												method: "GET",
												path: new RegExp(
													"(" + sEntitySetName + ")\\(([^/\\?#]+)\\)/(" + sNavName + ")/?(\\?(.*))?"),
												response: function(oXhr, sEntitySetName, sKeys, sNavProp, sUrlParams) {
													jQuery.sap.log
														.debug("MockServer: incoming request for url: " + oXhr.url);

													//trigger the before callback funtion
													that.fireEvent(sap.ui.core.util.MockServer.HTTPMETHOD.GET + sEntitySetName + ":before", {
														oXhr: oXhr,
														sKeys: sKeys,
														sNavProp: sNavProp,
														sUrlParams: sUrlParams
													});
													that.fireEvent(sap.ui.core.util.MockServer.HTTPMETHOD.GET + ":before", {
														oXhr: oXhr,
														sKeys: sKeys,
														sNavProp: sNavProp,
														sUrlParams: sUrlParams
													});
													var mHeaders = {
														"Content-Type": "application/json;charset=utf-8"
													};
													fnHandleXsrfTokenHeader(oXhr, mHeaders);
													try {
														var oEntry = fnGetEntitySetEntry(sEntitySetName, sKeys);
														if (oEntry) {
															var aEntries, oFilteredData = {};

															aEntries = that._resolveNavigation(sEntitySetName,
																oEntry.entry, sNavProp);
															var sMultiplicity = that._mEntitySets[sEntitySetName].navprops[sNavProp].to.multiplicity;
															if (sMultiplicity === "*") {
																oFilteredData = {
																	results: jQuery.extend(true, [],
																		aEntries)
																};
															} else {
																oFilteredData = jQuery.extend(true, {},
																	aEntries[0]);
															}
															if (aEntries && aEntries.length !== 0) {
																if (sUrlParams) {
																	// sUrlParams should not contains ?, but only & in its stead
																	var aUrlParams = decodeURIComponent(
																		sUrlParams).replace("?", "&").split("&");
																	aUrlParams = fnHandleAmpersandUrlParam(aUrlParams);

																	if (aUrlParams.length > 1) {
																		aUrlParams = that
																			._orderQueryOptions(aUrlParams);
																	}

																	if (sMultiplicity === "*") {
																		jQuery
																			.each(
																				aUrlParams,
																				function(iIndex, sQuery) {
																					that
																						._applyQueryOnCollection(
																							oFilteredData,
																							sQuery,
																							that._mEntitySets[sEntitySetName].navprops[sNavProp].to.entitySet);
																				});
																	} else {
																		jQuery
																			.each(
																				aUrlParams,
																				function(iIndex, sQuery) {
																					oFilteredData = that
																						._applyQueryOnEntry(
																							oFilteredData,
																							sQuery,
																							that._mEntitySets[sEntitySetName].navprops[sNavProp].to.entitySet);
																				});
																	}
																}
															}

															//trigger the after callback funtion
															that.fireEvent(sap.ui.core.util.MockServer.HTTPMETHOD.GET + sEntitySetName + ":after", {
																oXhr: oXhr,
																oFilteredData: oFilteredData
															});
															that.fireEvent(sap.ui.core.util.MockServer.HTTPMETHOD.GET + ":after", {
																oXhr: oXhr,
																oFilteredData: oFilteredData
															});

															oXhr
																.respond(
																	200,
																	mHeaders, JSON.stringify({
																		d: oFilteredData
																	}));

															jQuery.sap.log
																.debug("MockServer: response sent with: 200, " + JSON.stringify({
																	d: oFilteredData
																}));
														} else {
															that._logAndThrowMockServerCustomError(404, that._oErrorMessages.RESOURCE_NOT_FOUND);
														}
													} catch (e) {
														if (e.error) {
															oXhr.respond(e.error.code, mHeaders, JSON.stringify(e));
														} else {
															oXhr.respond(parseInt(e.message || e.number, 10));
															jQuery.sap.log
																.debug("MockServer: response sent with: " + parseInt(e.message || e.number,
																	10));
														}
													}
													return true;
												}
											});

									});

							// support creation of an entity of a specific type
							aRequests.push({
								method: "POST",
								path: new RegExp("(" + sEntitySetName + ")(\\(([^/\\?#]+)\\)/?(.*)?)?"),
								response: function(oXhr, sEntitySetName, group2, sKeys, sNavName) {
									var bMerge = false;
									// check for method tunneling
									if (oXhr.requestHeaders["x-http-method"] === "MERGE") {
										bMerge = true;
									}
									jQuery.sap.log.debug("MockServer: incoming create request for url: " + oXhr.url);
									//trigger the before callback funtion
									that.fireEvent(sap.ui.core.util.MockServer.HTTPMETHOD.POST + sEntitySetName + ":before", {
										oXhr: oXhr,
										sKeys: sKeys,
										sNavName: sNavName
									});
									that.fireEvent(sap.ui.core.util.MockServer.HTTPMETHOD.POST + ":before", {
										oXhr: oXhr,
										sKeys: sKeys,
										sNavName: sNavName
									});
									var sRespondData = null;
									var sRespondContentType = null;
									var iResult = 405; // default: method not allowed
									try {
										var sTargetEntityName = fnResolveTargetEntityName(oEntitySet,
											decodeURIComponent(sKeys), sNavName);
										if (sTargetEntityName) {
											var oEntity = initNewEntity(oXhr, sTargetEntityName, sKeys, sNavName);
											if (oEntity) {
												sRespondContentType = {
													"Content-Type": "application/json;charset=utf-8"
												};

												//trigger the after callback funtion
												that.fireEvent(sap.ui.core.util.MockServer.HTTPMETHOD.POST + sEntitySetName + ":after", {
													oXhr: oXhr,
													oEntity: oEntity
												});
												that.fireEvent(sap.ui.core.util.MockServer.HTTPMETHOD.POST + ":after", {
													oXhr: oXhr,
													oEntity: oEntity
												});

												if (bMerge) {
													var oExistingEntry = fnGetEntitySetEntry(sEntitySetName, sKeys);
													if (oExistingEntry) {
														jQuery.extend(that._oMockdata[sEntitySetName][oExistingEntry.index], oEntity);
													}
													iResult = 204;
												} else {
													var sUri = that._getRootUri() + sTargetEntityName + "(" + that._createKeysString(that._mEntitySets[sTargetEntityName],
														oEntity) + ")";
													sRespondData = JSON.stringify({
														d: oEntity,
														uri: sUri
													});
													that._oMockdata[sTargetEntityName] = that._oMockdata[sTargetEntityName]
														.concat([oEntity]);
													iResult = 201;
												}
											}
										}

										oXhr.respond(iResult, sRespondContentType, sRespondData);
										jQuery.sap.log
											.debug("MockServer: response sent with: " + iResult + ", " + sRespondData);

									} catch (e) {
										if (e.error) {
											var mHeaders = {
												"Content-Type": "text/plain;charset=utf-8"
											};
											oXhr.respond(e.error.code, mHeaders, JSON.stringify(e));
										} else {
											oXhr.respond(parseInt(e.message || e.number, 10));
											jQuery.sap.log
												.debug("MockServer: response sent with: " + parseInt(e.message || e.number,
													10));
										}

									}
									return true;
								}
							});

							// support update of an entity of a specific type
							aRequests.push({
								method: "PUT",
								path: new RegExp("(" + sEntitySetName + ")\\(([^/\\?#]+)\\)/?(.*)?"),
								response: function(oXhr, sEntitySetName, sKeys, sNavName) {
									jQuery.sap.log.debug("MockServer: incoming update request for url: " + oXhr.url);

									//trigger the before callback funtion
									that.fireEvent(sap.ui.core.util.MockServer.HTTPMETHOD.PUT + sEntitySetName + ":before", {
										oXhr: oXhr,
										sKeys: sKeys,
										sNavName: sNavName
									});
									that.fireEvent(sap.ui.core.util.MockServer.HTTPMETHOD.PUT + ":before", {
										oXhr: oXhr,
										sKeys: sKeys,
										sNavName: sNavName
									});
									var iResult = 405; // default: method not allowed
									var sRespondData = null;
									var sRespondContentType = null;
									try {
										var sTargetEntityName = fnResolveTargetEntityName(oEntitySet,
											decodeURIComponent(sKeys), sNavName);
										if (sTargetEntityName) {
											var oEntity = initNewEntity(oXhr, sTargetEntityName, sKeys, sNavName);
											if (oEntity) {
												sRespondContentType = {
													"Content-Type": "application/json;charset=utf-8"
												};
												//trigger the after callback funtion
												that.fireEvent(sap.ui.core.util.MockServer.HTTPMETHOD.PUT + sEntitySetName + ":after", {
													oXhr: oXhr,
													oEntity: oEntity
												});
												that.fireEvent(sap.ui.core.util.MockServer.HTTPMETHOD.PUT + ":after", {
													oXhr: oXhr,
													oEntity: oEntity
												});
												var oExistingEntry = fnGetEntitySetEntry(sEntitySetName, sKeys);
												if (oExistingEntry) { // Overwrite existing
													that._oMockdata[sEntitySetName][oExistingEntry.index] = oEntity;
												}
												iResult = 204;
											}
										}

										oXhr.respond(iResult, sRespondContentType, sRespondData);
										jQuery.sap.log
											.debug("MockServer: response sent with: " + iResult + ", " + sRespondData);
									} catch (e) {
										if (e.error) {
											var mHeaders = {
												"Content-Type": "text/plain;charset=utf-8"
											};
											oXhr.respond(e.error.code, mHeaders, JSON.stringify(e));
										} else {
											oXhr.respond(parseInt(e.message || e.number, 10));
											jQuery.sap.log
												.debug("MockServer: response sent with: " + parseInt(e.message || e.number,
													10));
										}
									}
									return true;
								}
							});

							// support partial update of an entity of a specific type
							aRequests.push({
								method: "MERGE",
								path: new RegExp("(" + sEntitySetName + ")\\(([^/\\?#]+)\\)/?(.*)?"),
								response: function(oXhr, sEntitySetName, sKeys, sNavName) {
									jQuery.sap.log.debug("MockServer: incoming merge update request for url: " + oXhr.url);
									//trigger the before callback funtion
									that.fireEvent(sap.ui.core.util.MockServer.HTTPMETHOD.MERGE + sEntitySetName + ":before", {
										oXhr: oXhr,
										sKeys: sKeys,
										sNavName: sNavName
									});
									that.fireEvent(sap.ui.core.util.MockServer.HTTPMETHOD.MERGE + ":before", {
										oXhr: oXhr,
										sKeys: sKeys,
										sNavName: sNavName
									});
									var iResult = 405; // default: method not allowed
									var sRespondData = null;
									var sRespondContentType = null;
									try {
										var sTargetEntityName = fnResolveTargetEntityName(oEntitySet,
											decodeURIComponent(sKeys), sNavName);
										if (sTargetEntityName) {
											var oEntity = initNewEntity(oXhr, sTargetEntityName, sKeys, sNavName);
											if (oEntity) {
												sRespondContentType = {
													"Content-Type": "application/json;charset=utf-8"
												};
												//trigger the after callback funtion
												that.fireEvent(sap.ui.core.util.MockServer.HTTPMETHOD.MERGE + sEntitySetName + ":after", {
													oXhr: oXhr,
													oEntity: oEntity
												});
												that.fireEvent(sap.ui.core.util.MockServer.HTTPMETHOD.MERGE + ":after", {
													oXhr: oXhr,
													oEntity: oEntity
												});
												var oExistingEntry = fnGetEntitySetEntry(sEntitySetName, sKeys);
												if (oExistingEntry) {
													jQuery.extend(that._oMockdata[sEntitySetName][oExistingEntry.index], oEntity);
												}
												iResult = 204;
											}
										}

										oXhr.respond(iResult, sRespondContentType, sRespondData);
										jQuery.sap.log
											.debug("MockServer: response sent with: " + iResult + ", " + sRespondData);
									} catch (e) {
										if (e.error) {
											var mHeaders = {
												"Content-Type": "text/plain;charset=utf-8"
											};
											oXhr.respond(e.error.code, mHeaders, JSON.stringify(e));
										} else {
											oXhr.respond(parseInt(e.message || e.number, 10));
											jQuery.sap.log.debug("MockServer: response sent with: " + parseInt(e.message || e.number, 10));
										}
									}
									return true;
								}
							});

							// support partial update of an entity of a specific type
							aRequests.push({
								method: "PATCH",
								path: new RegExp("(" + sEntitySetName + ")\\(([^/\\?#]+)\\)/?(.*)?"),
								response: function(oXhr, sEntitySetName, sKeys, sNavName) {
									jQuery.sap.log.debug("MockServer: incoming patch update request for url: " + oXhr.url);
									//trigger the before callback funtion
									that.fireEvent(sap.ui.core.util.MockServer.HTTPMETHOD.PATCH + sEntitySetName + ":before", {
										oXhr: oXhr,
										sKeys: sKeys,
										sNavName: sNavName
									});
									that.fireEvent(sap.ui.core.util.MockServer.HTTPMETHOD.PATCH + ":before", {
										oXhr: oXhr,
										sKeys: sKeys,
										sNavName: sNavName
									});
									var iResult = 405; // default: method not allowed
									var sRespondData = null;
									var sRespondContentType = null;
									try {
										var sTargetEntityName = fnResolveTargetEntityName(oEntitySet,
											decodeURIComponent(sKeys), sNavName);
										if (sTargetEntityName) {
											var oEntity = initNewEntity(oXhr, sTargetEntityName, sKeys, sNavName);
											if (oEntity) {
												sRespondContentType = {
													"Content-Type": "application/json;charset=utf-8"
												};
												//trigger the after callback funtion
												that.fireEvent(sap.ui.core.util.MockServer.HTTPMETHOD.PATCH + sEntitySetName + ":after", {
													oXhr: oXhr,
													oEntity: oEntity
												});
												that.fireEvent(sap.ui.core.util.MockServer.HTTPMETHOD.PATCH + ":after", {
													oXhr: oXhr,
													oEntity: oEntity
												});
												var oExistingEntry = fnGetEntitySetEntry(sEntitySetName, sKeys);
												if (oExistingEntry) {
													jQuery.extend(that._oMockdata[sEntitySetName][oExistingEntry.index], oEntity);
												}
												iResult = 204;
											}
										}

										oXhr.respond(iResult, sRespondContentType, sRespondData);
										jQuery.sap.log
											.debug("MockServer: response sent with: " + iResult + ", " + sRespondData);

									} catch (e) {
										if (e.error) {
											var mHeaders = {
												"Content-Type": "text/plain;charset=utf-8"
											};
											oXhr.respond(e.error.code, mHeaders, JSON.stringify(e));
										} else {
											oXhr.respond(parseInt(e.message || e.number, 10));
											jQuery.sap.log
												.debug("MockServer: response sent with: " + parseInt(e.message || e.number, 10));
										}
									}
									return true;
								}
							});

							// support deletion of an entity of a specific type
							aRequests.push({
								method: "DELETE",
								path: new RegExp("(" + sEntitySetName + ")\\(([^/\\?#]+)\\)/?(.*)?"),
								response: function(oXhr, sEntitySetName, sKeys, sUrlParams) {
									jQuery.sap.log.debug("MockServer: incoming delete request for url: " + oXhr.url);
									//trigger the before callback funtion
									that.fireEvent(sap.ui.core.util.MockServer.HTTPMETHOD.DELETE + sEntitySetName + ":before", {
										oXhr: oXhr
									});
									that.fireEvent(sap.ui.core.util.MockServer.HTTPMETHOD.DELETE + ":before", {
										oXhr: oXhr
									});
									var iResult = 204;
									try {
										var oEntry = fnGetEntitySetEntry(sEntitySetName, sKeys);
										if (oEntry) {
											that._oMockdata[sEntitySetName].splice(oEntry.index, 1);
										} else {
											iResult = 400;
										}

										//trigger the after callback funtion
										that.fireEvent(sap.ui.core.util.MockServer.HTTPMETHOD.DELETE + sEntitySetName + ":after", {
											oXhr: oXhr
										});
										that.fireEvent(sap.ui.core.util.MockServer.HTTPMETHOD.DELETE + ":after", {
											oXhr: oXhr
										});
										oXhr.respond(iResult, null, null);
										jQuery.sap.log.debug("MockServer: response sent with: " + iResult);
									} catch (e) {
										if (e.error) {
											var mHeaders = {
												"Content-Type": "text/plain;charset=utf-8"
											};

											oXhr.respond(e.error.code, mHeaders, JSON.stringify(e));
										} else {
											oXhr.respond(parseInt(e.message || e.number, 10));
											jQuery.sap.log.debug("MockServer: response sent with: " + parseInt(e.message || e.number, 10));
										}
									}
									return true;
								}
							});
						});

				// apply the request handlers
				this.setRequests(aRequests);

			};

			/**
			 * Organize query options according to thier execution order
			 *
			 * @private
			 */
			MockServer.prototype._orderQueryOptions = function(aUrlParams) {
				var iFilterIndex, iInlinecountIndex, iSkipIndex, iTopIndex, iOrderbyIndex, iSelectindex, iExpandIndex, iFormatIndex, aOrderedUrlParams = [];
				var that = this;
				jQuery.each(aUrlParams, function(iIndex, sQuery) {
					switch (sQuery.split('=')[0]) {
						case "$top":
							iTopIndex = jQuery.inArray(sQuery, aUrlParams);
							break;
						case "$skip":
							iSkipIndex = jQuery.inArray(sQuery, aUrlParams);
							break;
						case "$orderby":
							iOrderbyIndex = jQuery.inArray(sQuery, aUrlParams);
							break;
						case "$expand":
							iExpandIndex = jQuery.inArray(sQuery, aUrlParams);
							break;
						case "$filter":
							iFilterIndex = jQuery.inArray(sQuery, aUrlParams);
							break;
						case "$select":
							iSelectindex = jQuery.inArray(sQuery, aUrlParams);
							break;
						case "$inlinecount":
							iInlinecountIndex = jQuery.inArray(sQuery, aUrlParams);
							break;
						case "$format":
							iFormatIndex = jQuery.inArray(sQuery, aUrlParams);
							break;
						default:
							if (sQuery.split('=')[0].indexOf('$') === 0) {
								that._logAndThrowMockServerCustomError(400, that._oErrorMessages.IS_NOT_A_VALID_SYSTEM_QUERY_OPTION, sQuery.split('=')[0]);
							}
					}
				});
				if (iExpandIndex >= 0) {
					aOrderedUrlParams.push(aUrlParams[iExpandIndex]);
				}
				if (iFilterIndex >= 0) {
					aOrderedUrlParams.push(aUrlParams[iFilterIndex]);
				}
				if (iInlinecountIndex >= 0) {
					aOrderedUrlParams.push(aUrlParams[iInlinecountIndex]);
				}
				if (iOrderbyIndex >= 0) {
					aOrderedUrlParams.push(aUrlParams[iOrderbyIndex]);
				}
				if (iSkipIndex >= 0) {
					aOrderedUrlParams.push(aUrlParams[iSkipIndex]);
				}
				if (iTopIndex >= 0) {
					aOrderedUrlParams.push(aUrlParams[iTopIndex]);
				}
				if (iSelectindex >= 0) {
					aOrderedUrlParams.push(aUrlParams[iSelectindex]);
				}
				if (iFormatIndex >= 0) {
					aOrderedUrlParams.push(aUrlParams[iFormatIndex]);
				}
				return aOrderedUrlParams;
			};

			/**
			 * Removes all request handlers.
			 *
			 * @private
			 */
			MockServer.prototype._removeAllRequestHandlers = function() {
				var aRequests = this.getRequests();
				var iLength = aRequests.length;
				for (var i = 0; i < iLength; i++) {
					MockServer._removeResponse(aRequests[i].response);
				}
			};

			/**
			 * Removes all filters.
			 *
			 * @private
			 */
			MockServer.prototype._removeAllFilters = function() {
				for (var i = 0; i < this._aFilters.length; i++) {
					MockServer._removeFilter(this._aFilters[i]);
				}
				this._aFilters = null;
			};

			/**
			 * Adds a request handler to the server, based on the given configuration.
			 *
			 * @param {string}
			 *          sMethod HTTP verb to use for this method (e.g. GET, POST, PUT, DELETE...)
			 * @param {string|regexp}
			 *          sPath the path of the URI (will be concatenated with the rootUri)
			 * @param {function}
			 *          fnResponse the response function to call when the request occurs
			 *
			 * @private
			 */
			MockServer.prototype._addRequestHandler = function(sMethod, sPath, fnResponse) {
				sMethod = sMethod ? sMethod.toUpperCase() : sMethod;
				if (typeof sMethod !== "string") {
					throw new Error("Error in request configuration: value of 'method' has to be a string");
				}
				if (!(typeof sPath === "string" || sPath instanceof RegExp)) {
					throw new Error("Error in request configuration: value of 'path' has to be a string or a regular expression");
				}
				if (typeof fnResponse !== "function") {
					throw new Error("Error in request configuration: value of 'response' has to be a function");
				}

				var sUri = this._getRootUri();

				// create the URI regexp (will be escaped)
				sUri = sUri && new RegExp(this._escapeStringForRegExp(sUri));

				// create the path regexp (will have the special regexp encoding)
				if (sPath && !(sPath instanceof RegExp)) {
					sPath = new RegExp(this._createRegExpPattern(sPath));
				}

				// create the regexp for the request handler (concat root uri and path)
				var oRegExp = this._createRegExp(sUri ? sUri.source + sPath.source : sPath.source);

				this._addFilter(this._createFilter(sMethod, oRegExp));
				this._oServer.respondWith(sMethod, oRegExp, fnResponse);

				// some debug logging to see what is registered and how the regex look like
				jQuery.sap.log.debug("MockServer: adding " + sMethod + " request handler for pattern " + oRegExp);

			};

			/**
			 * Creates a regular expression based on a given pattern.
			 *
			 * @param {string} sPattern the pattern to use for the regular expression.
			 * @return {RegExp} the created regular expression.
			 *
			 * @private
			 */
			MockServer.prototype._createRegExp = function(sPattern) {
				return new RegExp("^" + sPattern + "$");
			};

			/**
			 * Creates a regular expression pattern. All <code>:param</code> are replaced
			 * by regular expression groups.
			 *
			 * @return {string} the created regular expression pattern.
			 *
			 * @private
			 */
			MockServer.prototype._createRegExpPattern = function(sPattern) {
				return sPattern.replace(/:([\w\d]+)/g, "([^\/]+)");
			};

			/**
			 * Converts a string into a regular expression. Escapes all regexp critical
			 * characters.
			 *
			 * @return {string} the created regular expression pattern.
			 *
			 * @private
			 */
			MockServer.prototype._escapeStringForRegExp = function(sString) {
				return sString.replace(/[\\\/\[\]\{\}\(\)\-\*\+\?\.\^\$\|]/g, "\\$&");
			};
			//

			/**
			 * Creates a trim string
			 *
			 * @return {string} the trimmed string.
			 *
			 * @private
			 */
			MockServer.prototype._trim = function(sString) {
				return sString && sString.replace(/^\s+|\s+$/g, "");
			};

			/**
			 * Checks is the string is a valid number
			 *
			 * @return {boolean} true if the string can be converted to a valid number
			 *
			 * @private
			 */
			MockServer.prototype._isValidNumber = function(sString) {
				return !isNaN(parseFloat(sString)) && isFinite(sString);
			};

			/**
			 * Converts a JSON format date string into a datetime format string.
			 *
			 * @return {string} the date.
			 *
			 * @private
			 */
			MockServer.prototype._getDateTime = function(sString) {
				if (!sString) {
					return;
				}
				return "datetime'" + new Date(Number(sString.replace("/Date(", '').replace(")/", ''))).toJSON().substring(0, 19) + "'";

			};

			/**
			 * Converts a datetime format date string into a JSON date format string.
			 *
			 * @return {string} the date.
			 *
			 * @private
			 */
			MockServer.prototype._getJsonDate = function(sString) {
				if (!sString) {
					return;
				}
				var fnNoOffset = function(s) {
					var day = jQuery.map(s.slice(0, -5).split(/\D/), function(itm) {
						return parseInt(itm, 10) || 0;
					});
					day[1] -= 1;
					day = new Date(Date.UTC.apply(Date, day));
					var offsetString = s.slice(-5);
					var offset = parseInt(offsetString, 10) / 100;
					if (offsetString.slice(0, 1) === "+") {
						offset *= -1;
					}
					day.setHours(day.getHours() + offset);
					return day.getTime();
				};
				return "/Date(" + fnNoOffset(sString.substring("datetime'".length, sString.length - 1)) + ")/";
			};

			/**
			 * Adds a filter function. The filter determines whether to fake a response or not. When the filter function
			 * returns true, the request will be faked.
			 *
			 * @param {function} fnFilter the filter function to add
			 * @private
			 */
			MockServer.prototype._addFilter = function(fnFilter) {
				this._aFilters.push(fnFilter);
				MockServer._addFilter(fnFilter);
			};

			/**
			 * Creates and returns a filter filter function.
			 *
			 * @param {string} sRequestMethod HTTP verb to use for this method (e.g. GET, POST, PUT, DELETE...)
			 * @param {RegExp} oRegExp the regular expression to use for this filter
			 *
			 * @private
			 */
			MockServer.prototype._createFilter = function(sRequestMethod, oRegExp) {
				return function(sMethod, sUri, bAsync, sUsername, sPassword) {
					return sRequestMethod === sMethod && oRegExp.test(sUri);
				};
			};

			/**
			 * Logs and throws an error
			 *
			 * @param {int} iErrorStatus HTTP status code
			 * @param {string} sErrorMessage the error message
			 * @param {string} sParam dynamic parameter of the error message
			 *
			 * @private
			 */
			MockServer.prototype._logAndThrowMockServerCustomError = function(iErrorStatus, sErrorMessage, sParam) {
				if (sErrorMessage.indexOf('##') > -1 && sParam) {
					sErrorMessage = sErrorMessage.replace("##", "'" + sParam + "'");
				}
				jQuery.sap.log.error("MockServer: " + sErrorMessage);
				throw {
					error: {
						code: iErrorStatus,
						message: {
							lang: "en",
							value: sErrorMessage
						}
					}
				};
			};

			/**
			 * Cleans up the resources associated with this object and all its aggregated children.
			 *
			 * After an object has been destroyed, it can no longer be used in!
			 *
			 * Applications should call this method if they don't need the object any longer.
			 *
			 * @see sap.ui.base.ManagedObject#destroy
			 * @param {boolean}
			 *            [bSuppressInvalidate] if true, this ManagedObject is not marked as changed
			 * @public
			 */
			MockServer.prototype.destroy = function(bSuppressInvalidate) {
				ManagedObject.prototype.destroy.apply(this, arguments);
				this.stop();
				var aServers = MockServer._aServers;
				var iIndex = jQuery.inArray(this, aServers);
				aServers.splice(iIndex, 1);
			};

			// =======
			// STATICS
			// =======

			MockServer._aFilters = [];
			MockServer._oServer = null;
			MockServer._aServers = [];

			/**
			 * Returns the instance of the sinon fake server.
			 *
			 * @return {object} the server instance
			 * @private
			 */
			MockServer._getInstance = function() {
				// We can not create many fake servers, see bug https://github.com/cjohansen/Sinon.JS/issues/211
				// This is why we reuse the server and patch it manually
				if (!this._oServer) {
					this._oServer = window.sinon.fakeServer.create();
					this._oServer.autoRespond = true;
				}
				return this._oServer;
			};

			/**
			 * Global configuration of all mock servers.
			 *
			 * @param {object} mConfig the configuration object.
			 * @param {boolean} [mConfig.autoRespond=true] If set true, all mock servers will respond automatically. If set false you have to call {@link sap.ui.core.util.MockServer#respond} method for response.
			 * @param {int} [mConfig.autoRespondAfter=0] the time in ms after all mock servers should send their response.
			 * @param {boolean} [mConfig.fakeHTTPMethods=false] If set to true, all mock server will find <code>_method</code> parameter in the POST body and use this to override the the actual method.
			 */
			MockServer.config = function(mConfig) {
				var oServer = this._getInstance();

				oServer.autoRespond = mConfig.autoRespond === false ? false : true;
				oServer.autoRespondAfter = mConfig.autoRespondAfter || 0;
				oServer.fakeHTTPMethods = mConfig.fakeHTTPMethods || false;
			};

			/**
			 * Respond to a request, when the servers are configured not to automatically respond.
			 */
			MockServer.respond = function() {
				this._getInstance().respond();
			};

			/**
			 * Starts all registered servers.
			 */
			MockServer.startAll = function() {
				for (var i = 0; i < this._aServers.length; i++) {
					this._aServers[i].start();
				}
			};

			/**
			 * Stops all registered servers.
			 */
			MockServer.stopAll = function() {
				for (var i = 0; i < this._aServers.length; i++) {
					this._aServers[i].stop();
				}
				this._getInstance().restore();
				this._oServer = null;
			};

			/**
			 * Stops and calls destroy on all registered servers. Use this method for cleaning up.
			 */
			MockServer.destroyAll = function() {
				this.stopAll();
				for (var i = 0; i < this._aServers.length; i++) {
					this._aServers[i].destroy();
				}
			};

			/**
			 * Enum for the method.
			 * @public
			 */
			MockServer.HTTPMETHOD = {
				GET: "GET",
				POST: "POST",
				DELETE: "DELETE",
				PUT: "PUT",
				MERGE: "MERGE",
				PATCH: "PATCH"
			};

			/**
			 * Adds a filter function. The filter determines whether to fake a response or not. When the filter function
			 * returns true, the request will be faked.
			 *
			 * @param {function} fnFilter the filter function to add
			 * @private
			 */
			MockServer._addFilter = function(fnFilter) {
				this._aFilters.push(fnFilter);
			};

			/**
			 * Removes a filter function.
			 *
			 * @param {function} fnFilter the filter function to remove
			 * @return {boolean} whether the filter was removed or not
			 * @private
			 */
			MockServer._removeFilter = function(fnFilter) {
				var iIndex = jQuery.inArray(fnFilter, this._aFilters);
				if (iIndex !== -1) {
					this._aFilters.splice(iIndex, 1);
				}
				return iIndex !== -1;
			};

			/**
			 * Removes a response from the real sinon fake server object
			 *
			 * @param {function} fnResponse the response function to remove
			 * @return {boolean} whether the response was removed or not
			 * @private
			 */
			MockServer._removeResponse = function(fnResponse) {
				var aResponses = this._oServer.responses;
				var iLength = aResponses.length;
				for (var i = 0; i < iLength; i++) {
					if (aResponses[i].response === fnResponse) {
						aResponses.splice(i, 1);
						return true;
					}
				}
				return false;
			};

			// ================================
			// SINON CONFIGURATON AND EXTENSION
			// ================================

			window.sinon.FakeXMLHttpRequest.useFilters = true;

			// In case of <=IE9 UI5 enables the CORS support in jQuery to allow the usage 
			// of jQuery.ajax function / sinon also needs to be synchronized with this
			// adoption by applying the CORS support flag from jQuery to sinon!
			window.sinon.xhr.supportsCORS = jQuery.support.cors;

			window.sinon.FakeXMLHttpRequest.addFilter(function(sMethod, sUri, bAsync, sUsername, sPassword) {
				var aFilters = MockServer._aFilters;
				for (var i = 0; i < aFilters.length; i++) {
					var fnFilter = aFilters[i];
					if (fnFilter(sMethod, sUri, bAsync, sUsername, sPassword)) {
						return false;
					}
				}
				return true;
			});

			var getMimeType = function(sFileName) {
				if (/.*\.json$/i.test(sFileName)) {
					return "JSON";
				}
				if (/.*\.xml$/i.test(sFileName)) {
					return "XML";
				}
				if (/.*metadata$/i.test(sFileName)) {
					// This is needed in case the metadata comes from a
					// local file otherwise it's interpreted as octetstream
					return "XML";
				}
				return null;
			};

			/**
			 * @param {int} iStatus
			 * @param {object} mHeaders
			 * @param {string} sFileUrl
			 * @public
			 */
			window.sinon.FakeXMLHttpRequest.prototype.respondFile = function(iStatus, mHeaders, sFileUrl) {
				var oResponse = jQuery.sap.sjax({
					url: sFileUrl,
					dataType: "text"
				});
				if (!oResponse.success) {
					throw new Error("Could not load file from: " + sFileUrl);
				}

				var oData = oResponse.data;
				var sMimeType = getMimeType(sFileUrl);

				if (this["respond" + sMimeType]) {
					this["respond" + sMimeType](iStatus, mHeaders, oData);
				} else {
					this.respond(iStatus, mHeaders, oData);
				}
			};

			/**
			 * @param {int} iStatus
			 * @param {object} mHeaders
			 * @param {object} oJSONData
			 * @public
			 */
			window.sinon.FakeXMLHttpRequest.prototype.respondJSON = function(iStatus, mHeaders, oJSONData) {
				mHeaders = mHeaders || {};
				mHeaders["Content-Type"] = mHeaders["Content-Type"] || "application/json";
				this.respond(iStatus, mHeaders, typeof oJSONData === "string" ? oJSONData : JSON.stringify(oJSONData));
			};

			/**
			 * @param {int} iStatus
			 * @param {object} mHeaders
			 * @param {string} sXmlData
			 * @public
			 */
			window.sinon.FakeXMLHttpRequest.prototype.respondXML = function(iStatus, mHeaders, sXmlData) {
				mHeaders = mHeaders || {};
				mHeaders["Content-Type"] = mHeaders["Content-Type"] || "application/xml";
				this.respond(iStatus, mHeaders, sXmlData);
			};

			return MockServer;
		});