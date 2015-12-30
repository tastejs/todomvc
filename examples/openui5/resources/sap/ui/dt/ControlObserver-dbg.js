/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides class sap.ui.dt.ControlObserver.
sap.ui.define([
	'jquery.sap.global',
	'sap/ui/dt/ManagedObjectObserver'
],
function(jQuery, ManagedObjectObserver) {
	"use strict";


	/**
	 * Constructor for a new ControlObserver.
	 *
	 * @param {string} [sId] id for the new object, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new object
	 *
	 * @class
	 * The ControlObserver observs changes of a control and propagates them via events.
	 * @extends sap.ui.dt.ManagedObjectObserver
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @private
	 * @since 1.30
	 * @alias sap.ui.dt.ControlObserver
	 * @experimental Since 1.30. This class is experimental and provides only limited functionality. Also the API might be changed in future.
	 */
	var ControlObserver = ManagedObjectObserver.extend("sap.ui.dt.ControlObserver", /** @lends sap.ui.dt.ControlObserver.prototype */ {
		metadata : {

			// ---- object ----

			// ---- control specific ----
			library : "sap.ui.dt",
			properties : {
				
			},
			associations : {
				/**
				 * target Control to observe
				 */
				"target" : {
					"type" : "sap.ui.core.Control"
				}
			},
			/**
			 * Fired when the DOM of the observed control is changed
			 */
			events : {
				"domChanged" : {}
			}
		}
	});

	/**
	 * @protected
	 */
	ControlObserver.prototype.init = function() {
		ManagedObjectObserver.prototype.init.apply(this, arguments);
		this._fnFireDomChanged = this.fireDomChanged.bind(this);
		this._oControlDelegate = {
			onAfterRendering : this._onAfterRendering,
			onBeforeRendering : this._onBeforeRendering
		};
	};

	/**
	 * Starts observing the target control.
	 * @param {sap.ui.core.Control} oControl The target to observe	
	 * @override
	 */
	ControlObserver.prototype.observe = function(oControl) {
		ManagedObjectObserver.prototype.observe.apply(this, arguments);
		jQuery(window).on("resize", this._fnFireDomChanged);
		this._startMutationObserver();
		oControl.addEventDelegate(this._oControlDelegate, this);	
	};

	/**
	 * Stops observing the target control.
	 * @param {sap.ui.core.Control} oControl The target to unobserve	
	 * @override
	 */
	ControlObserver.prototype.unobserve = function(oControl) {
		ManagedObjectObserver.prototype.unobserve.apply(this, arguments);
		this._stopMutationObserver();
		jQuery(window).off("resize", this._fnFireDomChanged);
		oControl.removeDelegate(this._oControlDelegate, this);
	};

	/**
	 * @private
	 */
	ControlObserver.prototype._startMutationObserver = function() {
		var that = this;
		var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
		var oDomRef = this.getTargetInstance().getDomRef();
		if (MutationObserver && oDomRef) {
			this.oMutationObserver = new MutationObserver(function(aMutations) {
				that.fireDomChanged();
			});
			this.oMutationObserver.observe(oDomRef, {
				childList : true,
				subtree : true,
				attributes : true
			});
		}
	};

	/**
	 * @private
	 */
	ControlObserver.prototype._stopMutationObserver = function() {
		if (this.oMutationObserver) {
			this.oMutationObserver.disconnect();
			this.oMutationObserver = null;
		}
	};

	/**
	 * @private
	 */
	ControlObserver.prototype._onBeforeRendering = function() {
		this._stopMutationObserver();
	};
	
	/**
	 * @private
	 */
	ControlObserver.prototype._onAfterRendering = function() {
		this._startMutationObserver();
		this.fireDomChanged();
	};

	return ControlObserver;
}, /* bExport= */ true);