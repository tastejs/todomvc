/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides helper sap.ui.core.EnabledPropagator
sap.ui.define(['./Control'],
	function(Control) {
	"use strict";


	/**
	 * @class Helper Class for enhancement of a Control with propagation of enabled property.
	 *
	 * <b>This constructor should be applied to the prototype of a control</b>
	 *
	 * Example:
	 * <code>
	 * sap.ui.core.EnabledPropagator.call(<i>Some-Control</i>.prototype, <i>Default-value, ...</i>);
	 * </code>
	 * e.g.
	 * <code>
	 * sap.ui.core.EnabledPropagator.call(sap.ui.commons.Button.prototype);
	 * </code>
	 *
	 * @author Daniel Brinkmann
	 * @version 1.32.9
	 * @param {boolean} [bDefault=true] the value that should be used as default value for the enhancement of the control.
	 * @param {boolean} [bLegacy=false] whether the introduced property should use the old name 'Enabled' 
	 * @public
	 * @alias sap.ui.core.EnabledPropagator
	 */
	var EnabledPropagator = function(bDefault, bLegacy) {
		// Ensure only Controls are enhanced
		if (!(this instanceof Control)) {
			throw new Error("EnabledPropagator only supports subclasses of Control"); // TODO clarify why. Daniel has added this check, but it is not obvious why?
		}
	
		// default for the default
		if ( bDefault === undefined ) {
			bDefault = true;
		}
	
		// helper to find a parent that has a getEnabled() method 
		function findParentWithEnabled(/**sap.ui.core.Control*/oControl) {
			var oParent = oControl.getParent();
			while (oParent && !oParent.getEnabled && oParent.getParent) {
				oParent = oParent.getParent();
			}
			return oParent;
		}
		
		// Ensure not to overwrite existing implementations.
		if (this.getEnabled === undefined) {
			// set some default
			this.getEnabled = function() {
				var oParent = findParentWithEnabled(this);
				return (oParent && oParent.getEnabled && !oParent.getEnabled()) ? false : this.getProperty("enabled");
			};
	
			if ( bLegacy ) {
				// add Enabled with old spelling for compatibility reasons. Shares the getter and setter with new spelling. 
				this.getMetadata().addProperty("Enabled", {type : "boolean", group : "Behavior", defaultValue :  !!bDefault});
			}
			this.getMetadata().addProperty("enabled", {type : "boolean", group : "Behavior", defaultValue :  !!bDefault});
			this.getMetadata().addPublicMethods('getEnabled');
	
		} else {
			// 
			var fnOld = this.getEnabled;
			this.getEnabled = function() {
				var oParent = findParentWithEnabled(this);
				return (oParent && oParent.getEnabled && !oParent.getEnabled()) ? false : fnOld.apply(this);
			};
		}
	
		if (this.setEnabled === undefined) {
			this.setEnabled = function(bEnabled) {
				this.setProperty("enabled", bEnabled);
			};
	
			this.getMetadata().addPublicMethods('setEnabled');
		}
	};
	

	return EnabledPropagator;

}, /* bExport= */ true);
