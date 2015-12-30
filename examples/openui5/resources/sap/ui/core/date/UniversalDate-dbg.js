/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides class sap.ui.core.date.UniversalDate
sap.ui.define(['jquery.sap.global', 'sap/ui/base/Object'],
	function (jQuery, BaseObject) {
		"use strict";

		/**
		 * Creates a date object that can represent dates of a concrete calendar.
		 * The date(calendar) type is determined based on the user's setting for calendar type in the configuration.
		 * The API of the UniversalDate is the same as EcmaScript5.1 Date object: {@link http://www.ecma-international.org/ecma-262/5.1/#sec-15.9}.
		 * @class
		 * @see sap.ui.core.Configuration#getCalendarType
		 *
		 * @author SAP SE
		 * @version 1.32.9
		 *
		 * @constructor
		 * @private
		 * @since 1.28.6
		 * @extends sap.ui.base.Object
		 * @alias sap.ui.core.date.UniversalDate
		 *
		 */
		var UniversalDate = BaseObject.extend("sap.ui.core.date.UniversalDate", /** @lends sap.ui.core.date.UniversalDate.prototype */ {
			constructor: function () {
				var oCalendarInfo = getCalendarInfo();
				this._oInnerImplType = oCalendarInfo.oImplClass;
				this._sCalendarType = oCalendarInfo.sCalendarType;

				if (!this || !(this instanceof UniversalDate)) {
					return new this._oInnerImplType().toString();
				}

				BaseObject.apply(this);

				var iArgsLength = arguments.length;
				switch (iArgsLength) {
					case 0:
						this._oInnerDate = new this._oInnerImplType();
						break;
					case 1:
						this._oInnerDate = new this._oInnerImplType(arguments[0]);
						break;
					case 2:
						this._oInnerDate = new this._oInnerImplType(arguments[0], arguments[1]);
						break;
					case 3:
						this._oInnerDate = new this._oInnerImplType(arguments[0], arguments[1], arguments[2]);
						break;
					case 4:
						this._oInnerDate = new this._oInnerImplType(arguments[0], arguments[1], arguments[2], arguments[3]);
						break;
					case 5:
						this._oInnerDate = new this._oInnerImplType(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
						break;
					case 6:
						this._oInnerDate = new this._oInnerImplType(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
						break;
					default :
						this._oInnerDate = new this._oInnerImplType(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6]);
				}
				generateInstanceMethod.call(this);
			}
		});

		function generateInstanceMethod() {
			if (UniversalDate.prototype.getDate !== undefined) { // if at least one of the methods is defined, skip the whole definition
				return;
			}
			var aGetters = ["getDate", "getMonth", "getFullYear", "getYear", "getDay", "getHours", "getMinutes", "getSeconds", "getMilliseconds",
				"getUTCDate", "getUTCMonth", "getUTCFullYear", "getUTCDay", "getUTCHours", "getUTCMinutes", "getUTCSeconds", "getUTCMilliseconds",
				"getTime", "valueOf", "getTimezoneOffset", "toDateString", "toGMTString", "toISOString", "toJSON", "toLocaleDateString",
				"toLocaleString", "toLocaleTimeString", "toTimeString", "toUTCString", "toString"];

			var aSetters = ["setDate", "setFullYear", "setYear", "setMonth", "setHours", "setMinutes", "setSeconds", "setMilliseconds",
				"setUTCDate", "setUTCFullYear", "setUTCMonth", "setUTCHours", "setUTCMinutes", "setUTCSeconds", "setUTCMilliseconds"
			];
			var aInstanceMethods = aGetters.concat(aSetters);
			var createInstanceProxy = function (sMethodName) {
				return function () {
					return this._oInnerImplType.prototype[sMethodName].apply(this._oInnerDate, arguments);
				};
			};
			for (var i = 0; i < aInstanceMethods.length; i++) {
				var sMethodName = aInstanceMethods[i];
				UniversalDate.prototype[sMethodName] = createInstanceProxy(sMethodName);
			}
		}

		function generateStaticMethods() {
			if (UniversalDate.UTC !== undefined) { // if at least one of the methods is defined, skip the whole definition
				return;
			}
			var aStaticMethods = ["UTC", "now", "parse"];
			var createClassProxy = function (sMethodName) {
				return function () {
					var oStaticType = getCalendarInfo().oImplClass;
					return oStaticType[sMethodName].apply(oStaticType, arguments);
				};
			};
			for (var i = 0; i < aStaticMethods.length; i++) {
				var sMethodName = aStaticMethods[i];
				UniversalDate[sMethodName] = createClassProxy(sMethodName);
			}
		}

		/**
		 * @public
		 * @returns {sap.ui.core.CalendarType} the calendarType this instance works with
		 */
		UniversalDate.prototype.getCalendarType = function () {
			return this._sCalendarType;
		};

		function getCalendarInfo(sCalendarType) {
			var result = {oImplClass: Date},
				oConfiguration = sap.ui.getCore().getConfiguration();

			result.sCalendarType = sCalendarType || oConfiguration.getCalendarType();
			var sClassName = sap.ui.core.CalendarTypeToClassMap[result.sCalendarType];
			if (sClassName) {
				jQuery.sap.require(sClassName);
				result.oImplClass = jQuery.sap.getObject(sClassName);
			}

			return result;
		}

		generateStaticMethods();

		return UniversalDate;
	});
