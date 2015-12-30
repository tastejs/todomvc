/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// A bridge between the jQuery.sap plugin and the SAPUI5 Core
sap.ui.define(['jquery.sap.global', 'sap/ui/Global' /* cyclic: , 'sap/ui/core/Core'*/],
	function(jQuery/*, Global*/) {
	"use strict";

	function fUIAreaFilter(idx){
		return sap.ui.getCore().getUIArea(this.id) != null;
	}
	function fgetUIArea(idx, odomref){
		return sap.ui.getCore().getUIArea(this.id);
	}
	function fgetUIAreaOfCtrl(oCtrl, idx){
		return oCtrl.getUIArea().getInterface();
	}

	/**
	 * @param {object} oRootControl
	 * @name jQuery#root
	 * @function
	 * @public
	 */
	jQuery.fn.root = function(oRootControl) {
		// handle 'setRoot'
		if (oRootControl) {
			sap.ui.getCore().setRoot(this.get(0), oRootControl);
			return this;
		}
		// and 'getRoot' behavior.
		var aControls = this.control();
		if (aControls.length > 0) {
			return jQuery.map(aControls, fgetUIAreaOfCtrl);
		}

		var aUIAreas = this.uiarea();

		if (aUIAreas.length > 0) {
			// we have UIAreas
			return aUIAreas;
		}

		// create UIAreas
		this.each(function(idx){
			sap.ui.getCore().createUIArea(this);
		});
		return this;
	};

	/**
	 * @param {int} iIdx
	 * @name jQuery#uiarea
	 * @function
	 * @public
	 */
	jQuery.fn.uiarea = function(iIdx) {
		// UIAreas need to have IDs... so reduce to those elements first
		var aUIAreas = this.slice("[id]").filter(fUIAreaFilter).map(fgetUIArea).get();
		return typeof (iIdx) === "number" ? aUIAreas[iIdx] : aUIAreas;
	};

	/**
	 * Function identifying the closest SAPUI5 Control in the given jQuery context (provided via jQuery.map method).
	 * @private
	 */
	function fgetControl() {
		// as with jQuery 1.4.3 and 1.4.4 there is a big problem here, we increase checks here
		if (!this || !this.nodeType || this.nodeType === 9) {
			return null;
		} // in this case, we are on the HTML Document and cannot do anything
		// in IE8 'closest' might fail (e.g. when the element is not in the current document tree)
		// The following line would probably also work for the 'try-catch' below but induce performance penalty in EVERY call of this method.
		// if(jQuery(document.documentElement).has(this)) {
		try {
			var sId = jQuery(this).closest("[data-sap-ui]").attr("id");
			return sId ? sap.ui.getCore().byId(sId) : null;
		} catch (e) {
			// probably IE8 case where element is not in current document tree... ==> there is no current control
			return null;
		}
	}

	/**
	 * Extension function to the jQuery.fn which identifies SAPUI5 controls in the given jQuery context.
	 *
	 * @param {int} [idx] optional parameter to return the control instance at the given idx's position in the array.
	 * @returns {sap.ui.core.Control[] | sap.ui.core.Control | null} depending on the given context and idx parameter an array of controls, an instance or null.
	 * @name jQuery#control
	 * @function
	 * @public
	 */
	jQuery.fn.control = function(idx) {
		var aControls = this.map(fgetControl);
		if (idx === undefined || isNaN(idx)) {
			return aControls.get();
		} else {
			return aControls.get(idx);
		}
	};


	/**
	 * EXPERIMENTAL!!
	 * Creates a new control of the given type and places it into the first DOM object of the jQuery collection.
	 * The type string is case sensitive.
	 *
	 * @param {string} sControlType the control type (fully qualified, like "sap.ui.dev.GoogleMap"; if no package is given, the package "sap.ui.commons" is assumed)
	 * @param {string} [sId] optional id for the new control; generated automatically if no non-empty id is given
	 * @param {object} [oConfiguration] optional map/JSON-object with initial values for the new control
	 * @returns {jQuery} the given jQuery object
	 * @private
	 */
	jQuery.fn.sapui = function(sControlType, sId, oConfiguration) {

		return this.each(function() { // TODO: hack for Steffen; (point is not clear, as this adds identical controls to many DOM elements...); remove soon

			var oControl = null;
			if (this) {
				// allow omitting the package prefix because this looks less Java-like...  sap.ui.commons is the default package
				if (sControlType.indexOf(".") == -1)  {
					sControlType = "sap.ui.commons." + sControlType;
				}

				// instantiate the control
				var fnClass = jQuery.sap.getObject(sControlType);
				if (fnClass) {

					// TODO: hack for Steffen; remove later
					if (typeof oConfiguration == 'object' && typeof oConfiguration.press == 'function') {
						oConfiguration.press = jQuery.proxy(oConfiguration.press,this);
					}

					oControl = new (fnClass)(sId, oConfiguration); // sId might actually contain oConfiguration, the Element constructor will take care of this

					// placeAt first DomRef in collection
					oControl.placeAt(this);
					// TODO: avoid the direct call to applyChanges() in favor of a delayed version that potentially bundles several changes
					//sap.ui.getCore().applyChanges();
				}
			}

		});
	};

	return jQuery;

});
