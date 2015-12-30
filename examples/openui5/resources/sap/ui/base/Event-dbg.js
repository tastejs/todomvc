/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides class sap.ui.base.Event
sap.ui.define(['jquery.sap.global', './Object'],
	function(jQuery, BaseObject) {
	"use strict";


	/**
	 * Creates an event with the given <code>sId</code>, linked to the provided <code>oSource</code> and enriched with the <code>mParameters</code>.
	 *
	 * @param {string} sId The id of the event
	 * @param {sap.ui.base.EventProvider} oSource The source of the event
	 * @param {object} mParameters A map of parameters for this event
	 *
	 * @class An Event object consisting of an id, a source and a map of parameters
	 * @extends sap.ui.base.Object
	 * @implements sap.ui.base.Poolable
	 * @author SAP SE
	 * @version 1.32.9
	 * @alias sap.ui.base.Event
	 * @public
	 */
	var Event = BaseObject.extend("sap.ui.base.Event", /** @lends sap.ui.base.Event.prototype */ {
		constructor : function(sId, oSource, mParameters) {
		
			BaseObject.apply(this);
		
			if (arguments.length > 0) {
				this.init(sId, oSource, mParameters);
			}
		
		}
	});
	
	/**
	 * Init this event with its data.
	 *
	 * The <code>init</code> method is called by an object pool when the
	 * object is (re-)activated for a new caller.
	 *
	 * When no <code>mParameters</code> are given, an empty object is used instead.
	 *
	 * @param {string} sId The id of the event
	 * @param {sap.ui.base.EventProvider} oSource The source of the event
	 * @param {object} [mParameters] The event parameters
	 *
	 * @private
	 * 
	 * @see sap.ui.base.Poolable.prototype#init
	 */
	Event.prototype.init = function(sId, oSource, mParameters) {
		jQuery.sap.assert(typeof sId === "string", "Event.init: sId must be a string");
		jQuery.sap.assert(sap.ui.require('sap/ui/base/EventProvider') && oSource instanceof sap.ui.require('sap/ui/base/EventProvider'), "Event.init: oSource must be an EventProvider");
	
		this.sId = sId;
		this.oSource = oSource;
		this.mParameters = mParameters || {};
		this.bCancelBubble = false;
		this.bPreventDefault = false;
	};
	
	/**
	 * Reset event data, needed for pooling.
	 * 
	 * @see sap.ui.base.Poolable.prototype#reset
	 * @private
	 */
	Event.prototype.reset = function() {
		this.sId = "";
		this.oSource = null;
		this.mParameters = null;
		this.bCancelBubble = false;
		this.bPreventDefault = false;
	};
	
	/**
	 * Returns the id of the event.
	 * 
	 * @return {string} The id of the event
	 * @public
	 */
	Event.prototype.getId = function() {
	
		return this.sId;
	
	};
	
	/**
	 * Returns the event provider on which the event was fired.
	 * 
	 * @return {sap.ui.base.EventProvider} The source of the event
	 * @public
	 */
	Event.prototype.getSource = function() {
	
		return this.oSource;
	
	};
	
	/**
	 * Returns all parameter values of the event keyed by their names.
	 * @return {map} All parameters of the event keyed by name
	 * @public
	 */
	Event.prototype.getParameters = function() {
	
		return this.mParameters;
	
	};
	
	/**
	 * Returns the value of the parameter with the given sName.
	 *
	 * @param {string} sName The name of the parameter to return
	 * @return {any} The value for the named parameter
	 * @public
	 */
	Event.prototype.getParameter = function(sName) {
	
		jQuery.sap.assert(typeof sName === "string" && sName, "Event.getParameter: sName must be a non-empty string");
	
		return this.mParameters[sName];
	
	};
	
	/**
	 * Cancel bubbling of the event.
	 * 
	 * <b>Note:</b> This function only has an effect if the bubbling of the event is supported by the event source.
	 * 
	 * @public
	 */
	Event.prototype.cancelBubble = function() {
	
		this.bCancelBubble = true;
	
	};
	
	/**
	 * Prevent the default action of this event.
	 * 
	 * <b>Note:</b> This function only has an effect if preventing the default action of the event is supported by the event source.
	 * 
	 * @public
	 */
	Event.prototype.preventDefault = function() {
	
		this.bPreventDefault = true;
	
	};
	
	

	return Event;

});
