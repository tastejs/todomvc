/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides class sap.ui.core.support.plugins.Breakpoint (Breakpoint support Plugin)
sap.ui.define(['jquery.sap.global', 'sap/ui/Device', 'sap/ui/core/support/Plugin'],
	function(jQuery, Device, Plugin) {
	"use strict";

	/*global alert */


		var $ = jQuery;
		var Breakpoint = Plugin.extend("sap.ui.core.support.plugins.Breakpoint", {

			constructor : function(oSupportStub) {
				Plugin.apply(this, ["sapUiSupportBreakpoint", "", oSupportStub]);

				// app plugin only!
				if (this.isToolPlugin()) {
					throw new Error();
				}

				this._oStub = oSupportStub;

				this._methodType = {
					clazz: 1, proto: 2
				};

				this._mBreakpointData = {
					classes: {},
					instances: {}
				};

				this._idPrefix = "id_";
				this._methodPrefix = "method_";
				this._classPrefix = "class_";

				this._bAlertNoDebugger = false;

				this._aEventIds = [
					this.getId() + "RequestInstanceMethods",
					this.getId() + "ChangeInstanceBreakpoint",
					this.getId() + "RequestClasses",
					this.getId() + "RequestClassMethods",
					this.getId() + "ChangeClassBreakpoint",
					this.getId() + "RemoveAllClassBreakpoints"
				];
			}

		});

		Breakpoint.prototype.init = function(oSupportStub) {
			Plugin.prototype.init.apply(this, arguments);

			window.bp = this;

			this.requestClasses("sapUiSupportDebuggingReceiveClasses");
		};

		Breakpoint.prototype.onsapUiSupportBreakpointRequestInstanceMethods = function(oEvent) {

			var sCallbackEvent = oEvent.getParameter("callback"),
				sControlId = oEvent.getParameter("controlId");

			var aMethods = this.getInstanceMethods(sControlId);

			this._oStub.sendEvent(sCallbackEvent, {
				methods: JSON.stringify(aMethods),
				breakpointCount: JSON.stringify({
					active: $.grep(aMethods, function(oMethod, i) {
						return oMethod.active;
					}).length,
					all: aMethods.length
				}),
				controlId: sControlId
			});
		};

		Breakpoint.prototype.onsapUiSupportBreakpointChangeInstanceBreakpoint = function(oEvent) {

			// get event data
			var data = {
					controlId: oEvent.getParameter("controlId"),
					methodName: oEvent.getParameter("methodName"),
					active: oEvent.getParameter("active")
				},
				sCallbackEvent = oEvent.getParameter("callback");

			// change breakpoint state
			this.changeInstanceBreakpoint(data.controlId, data.methodName, data.active);

			// reload method list
			var mMethods = this.getInstanceMethods(data.controlId);

			data.breakpointCount = JSON.stringify({
				active: $.grep(mMethods, function(oMethod, i) {
					return oMethod.active;
				}).length,
				all: mMethods.length
			});

			data.methods = JSON.stringify(mMethods);

			// send callback event
			this._oStub.sendEvent(sCallbackEvent, data);
		};

		Breakpoint.prototype.requestClasses = function(callback) {
			this._oStub.sendEvent(callback, { classes: JSON.stringify(this.getClasses()) });
		};

		Breakpoint.prototype.onsapUiSupportBreakpointRequestClasses = function(oEvent) {
			this.requestClasses(oEvent.getParameter("callback"));
		};

		Breakpoint.prototype.onsapUiSupportBreakpointRequestClassMethods = function(oEvent) {

			var sCallbackEvent = oEvent.getParameter("callback"),
				sClassName = oEvent.getParameter("className");

			var aMethods = this.getClassMethods(sClassName);

			this._oStub.sendEvent(sCallbackEvent, {
				methods: JSON.stringify(aMethods),
				breakpointCount: JSON.stringify({
					active: $.grep(aMethods, function(oMethod, i) {
						return oMethod.active;
					}).length,
					all: aMethods.length
				}),
				className: sClassName
			});
		};

		Breakpoint.prototype.onsapUiSupportBreakpointChangeClassBreakpoint = function(oEvent) {

			// get event data
			var data = {
					className: oEvent.getParameter("className"),
					methodName: oEvent.getParameter("methodName"),
					active: oEvent.getParameter("active"),
					type: oEvent.getParameter("type")
				},
				sCallbackEvent = oEvent.getParameter("callback");

			// change breakpoint state
			this.changeClassBreakpoint(data.className, data.methodName, data.active, data.type);

			// reload method list
			var mMethods = this.getClassMethods(data.className);

			data.breakpointCount = JSON.stringify({
				active: $.grep(mMethods, function(oMethod, i) {
					return oMethod.active;
				}).length,
				all: mMethods.length
			});

			data.methods = JSON.stringify(mMethods);

			// send callback event
			this._oStub.sendEvent(sCallbackEvent, data);
		};

		Breakpoint.prototype.onsapUiSupportBreakpointRemoveAllClassBreakpoints = function(oEvent) {

			var sClassName = oEvent.getParameter("className");
			var mMethods = this._mBreakpointData.classes[this._classPrefix + sClassName];

			for (var method in mMethods) {
				this.changeClassBreakpoint(sClassName, method.replace(this._methodPrefix, ""), false);
			}
		};

		Breakpoint.prototype.getInstanceMethods = function(sControlId) {

			var oControl = sap.ui.getCore().byId(sControlId), // get control instance
				aMethods = [];

			// check if control was found
			if (!oControl) {
				return aMethods;
			}

			// loop through control object
			for (var oProperty in oControl) {
				if (!$.isFunction(oControl[oProperty])) {
					continue;
				}

				aMethods.push({
					name: oProperty,
					active: this.isInstanceBreakpointActive(oControl, oProperty)
				}); // add all functions to array
			}

			// return sorted array
			return aMethods.sort(function(a, b) {
				if (a.name < b.name) {
					return -1;
				} else if (a.name > b.name) {
					return 1;
				} else {
					return 0;
				}
			});
		};

		Breakpoint.prototype.getClassMethods = function(sClassName) {

			// get class object
			var oObj = jQuery.sap.getObject(sClassName);
			var aMethods = [], sKey;

			if (!oObj) {
				return aMethods;
			}

			// class methods
			for (sKey in oObj) {
				if (!$.isFunction(oObj[sKey])) {
					continue;
				}

				aMethods.push({
					name: sKey,
					type: this._methodType.clazz,
					active: this.isClassBreakpointActive(sClassName, sKey)
				});
			}

			function isNameInArray(sKey) {
				return aMethods.some(function(o) {
					return o.name === sKey;
				});
			}

			// instance methods
			for (sKey in oObj.prototype) {
				if (!$.isFunction(oObj.prototype[sKey])) {
					continue;
				}

				// check if method already exists (happens with getMetadata)
				if (isNameInArray(sKey)) {
					continue;
				}

				aMethods.push({
					name: sKey,
					type: this._methodType.proto,
					active: this.isClassBreakpointActive(sClassName, sKey)
				});
			}

			// sort using method name (ascending)
			return aMethods.sort(function(a, b) {
				if (a.name < b.name) {
					return -1;
				} else if (a.name > b.name) {
					return 1;
				} else {
					return 0;
				}
			});
		};

		Breakpoint.prototype.getClasses = function() {

			function findDeclaredClasses() {

				var aClasses = [];
				var aModules = jQuery.sap.getAllDeclaredModules();

				for (var i = 0; i < aModules.length; i++) {
					if (jQuery.inArray(aModules[i], aClasses) > -1) {
						continue;
					}

					var oObj = jQuery.sap.getObject(aModules[i]);

					if (typeof (oObj) === 'undefined' || oObj === null) {
						continue;
					}

					if (typeof (oObj.getMetadata) === 'function' &&
						oObj.getMetadata() instanceof sap.ui.core.ElementMetadata) {
						aClasses.push(oObj.getMetadata().getName());
					}
				}

				return aClasses;
			}

			return findDeclaredClasses().sort();
		};

		Breakpoint.prototype.changeInstanceBreakpoint = function(sControlId, sMethodName, bActive) {

			// get control instance
			var oControl = sap.ui.getCore().byId(sControlId);

			// check if control was found and a method was specified
			if (!oControl || !sMethodName || !oControl[sMethodName]) {
				return;
			}

			// check if breakpoint is not already activated / deactivated
			if (this.isInstanceBreakpointActive(oControl, sMethodName) === bActive) {
				return;
			}

			if (bActive) {
				// activate the breakpoint
				this.applyInstanceMethodHook(sControlId, oControl, sMethodName);
			} else {
				// deactivate the breakpoint
				this.removeInstanceMethodHook(sControlId, oControl, sMethodName);
			}

		};

		Breakpoint.prototype.changeClassBreakpoint = function(sClassName, sMethodName, bActive, type) {

			var oClass = jQuery.sap.getObject(sClassName);

			// check if control was found and a method was specified
			if (!oClass || !sMethodName) {
				return;
			}

			// check if breakpoint is not already activated / deactivated
			if (this.isClassBreakpointActive(sClassName, sMethodName) === bActive) {
				return;
			}

			if (bActive) {
				// activate the breakpoint
				this.applyClassMethodHook(sClassName, oClass, sMethodName, type);
			} else {
				// deactivate the breakpoint
				this.removeClassMethodHook(sClassName, oClass, sMethodName);
			}

		};

		Breakpoint.prototype.getInstanceBreakpointData = function(oControl, bInit) {

			if (typeof (bInit) === 'undefined') {
				bInit = false;
			}

			var mClass = this._mBreakpointData.instances[this._classPrefix + oControl.getMetadata().getName()];

			if (!mClass) {

				if (bInit) {
					this._mBreakpointData.instances[this._classPrefix + oControl.getMetadata().getName()] = mClass = {};
				} else {
					return null;
				}

			}

			var mInstance = mClass[this._idPrefix + oControl.getId()];

			if (!mInstance) {

				if (bInit) {
					mClass[this._idPrefix + oControl.getId()] = mInstance = {};
				} else {
					return null;
				}

			}

			return mInstance;
		};

		Breakpoint.prototype.getClassBreakpointData = function(sClassName, bInit) {

			if (typeof (bInit) === 'undefined') {
				bInit = false;
			}

			var mClass = this._mBreakpointData.classes[this._classPrefix + sClassName];

			if (!mClass) {

				if (bInit) {
					this._mBreakpointData.classes[this._classPrefix + sClassName] = mClass = {};
				} else {
					return null;
				}

			}

			return mClass;
		};

		Breakpoint.prototype.isInstanceBreakpointActive = function(oControl, sMethodName) {

			// get control map
			var mControl = this.getInstanceBreakpointData(oControl);

			if (!mControl) {
				return false;
			}

			// get method object
			var oMethod = mControl[this._methodPrefix + sMethodName];
			if (!oMethod) {
				return false;
			}

			// check for active flag
			return oMethod.active;
		};

		Breakpoint.prototype.isClassBreakpointActive = function(sClassName, sMethodName) {

			// get class map
			var mClass = this.getClassBreakpointData(sClassName);

			if (!mClass) {
				return false;
			}

			// get method object
			var oMethod = mClass[this._methodPrefix + sMethodName];
			if (!oMethod) {
				return false;
			}

			// check for active flag
			return oMethod.active;
		};

		Breakpoint.prototype.applyInstanceMethodHook = function(sControlId, oControl, sMethodName) {

			// get control map and initialize it if it does not already exists
			var mControl = this.getInstanceBreakpointData(oControl, true),
				oMethod = mControl[this._methodPrefix + sMethodName] || (mControl[this._methodPrefix + sMethodName] = {});

			// save original function
			oMethod.originalMethod = oControl[sMethodName];

			oMethod.active = true;

			// apply hook
			oControl[sMethodName] = this.methodHook(oMethod.originalMethod);
		};

		Breakpoint.prototype.removeInstanceMethodHook = function(sControlId, oControl, sMethodName) {

			var mControl = this.getInstanceBreakpointData(oControl, true),
				oMethod = mControl[this._methodPrefix + sMethodName];

			// overwrite hook function with original function
			oControl[sMethodName] = oMethod.originalMethod;

			delete oMethod.originalMethod;

			oMethod.active = false;
		};

		Breakpoint.prototype.applyClassMethodHook = function(sClassName, oClass, sMethodName, type) {

			// get control map and initialize it if it does not already exists
			var mClass = this.getClassBreakpointData(sClassName, true),
				oMethod = mClass[this._methodPrefix + sMethodName] || (mClass[this._methodPrefix + sMethodName] = {});

			// save original function and apply hook
			if (type === this._methodType.clazz) {
				oMethod.originalMethod = oClass[sMethodName];
				oClass[sMethodName] = this.methodHook(oMethod.originalMethod);
			} else {
				oMethod.originalMethod = oClass.prototype[sMethodName];
				oClass.prototype[sMethodName] = this.methodHook(oMethod.originalMethod);
			}

			oMethod.type = type;
			oMethod.active = true;
		};

		Breakpoint.prototype.removeClassMethodHook = function(sClassName, oClass, sMethodName) {

			var mClass = this.getClassBreakpointData(sClassName, true),
				oMethod = mClass[this._methodPrefix + sMethodName];

			// overwrite hook function with original function
			if (oMethod.type === this._methodType.clazz) {
				oClass[sMethodName] = oMethod.originalMethod;
			} else {
				oClass.prototype[sMethodName] = oMethod.originalMethod;
			}

			delete oMethod.originalMethod;
			oMethod.active = false;
		};

		Breakpoint.prototype.methodHook = function(method) {
			var that = this;

			return function() {

				var time = (new Date()).getTime();

				/*eslint-disable no-debugger */
				debugger;
				/*eslint-enable no-debugger */

				if ((new Date().getTime()) - time < 50) {
					that._alertNoDebugger();
				}

				// Step into the statement below
				return method.apply(this, arguments);
			};
		};

		Breakpoint.prototype._alertNoDebugger = function() {

			if (this._bAlertNoDebugger) {
				return; // show alert only one time
			}

			var text = null;

			if (Device.browser.chrome) {
				text = "Please open your debugger by pressing CTRL + SHIFT + I.";
			}

			if (Device.browser.internet_explorer) {
				text = "Please open your debugger using F12, go to the 'Script' tab and attach it by pressing F5.";
			}

			if (text == null) {
				text = "Please open your debugger.";
			}

			this._bAlertNoDebugger = true;
			/*eslint-disable no-alert */
			alert("There is no debugger attached.\n\n" + text);
			/*eslint-enable no-alert */
		};



	return Breakpoint;

});
