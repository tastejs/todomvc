/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides an abstraction for model bindings
sap.ui.define(['jquery.sap.global', 'sap/ui/base/EventProvider', './ChangeReason', './DataState'],
	function(jQuery, EventProvider, ChangeReason, DataState) {
	"use strict";


	/**
	 * Constructor for Binding class.
	 *
	 * @class
	 * The Binding is the object, which holds the necessary information for a data binding,
	 * like the binding path and the binding context, and acts like an interface to the
	 * model for the control, so it is the event provider for changes in the data model
	 * and provides getters for accessing properties or lists.
	 *
	 * @param {sap.ui.model.Model} the model
	 * @param {String} sPath the path
	 * @param {sap.ui.model.Context} oContext the context object
	 * @param {object} [mParameters]
	 * @abstract
	 * @public
	 * @alias sap.ui.model.Binding
	 * @extends sap.ui.base.EventProvider
	 */
	var Binding = EventProvider.extend("sap.ui.model.Binding", /** @lends sap.ui.model.Binding.prototype */ {

		constructor : function(oModel, sPath, oContext, mParameters){
			EventProvider.apply(this);

			this.oModel = oModel;
			this.bRelative = !jQuery.sap.startsWith(sPath,'/');
			this.sPath = sPath;
			this.oContext = oContext;
			this.vMessages = undefined;
			this.mParameters = mParameters;
			this.bInitial = false;
			this.bSuspended = false;
			this.oDataState = null;
		},

		metadata : {
			"abstract" : true,
			publicMethods : [
				// methods
				"getPath", "getContext", "getModel", "attachChange", "detachChange", "refresh", "isInitial","attachDataStateChange","detachDataStateChange","attachDataRequested","detachDataRequested","attachDataReceived","detachDataReceived","suspend","resume"]
		}

	});

	// Getter
	/**
	 * Getter for path
	 * @return {String} the binding path
	 */
	Binding.prototype.getPath = function() {
		return this.sPath;
	};

	/**
	 * Getter for context
	 * @return {Object} the context object
	 */
	Binding.prototype.getContext = function() {
		return this.oContext;
	};

	/**
	 * Setter for context
	 * @param {Object} oContext the new context object
	 */
	Binding.prototype.setContext = function(oContext) {
		if (this.oContext != oContext) {
			this.oContext = oContext;
			this.oDataState = null;
			this._fireChange();
		}
	};

	/**
	 * Getter for current active messages
	 * @return {Object} the context object
	 */
	Binding.prototype.getMessages = function() {
		return this.vMessages;
	};
	
	/**
	 * Returns the data state for this binding
	 * @return {sap.ui.model.DataState} the data state
	 */
	Binding.prototype.getDataState = function() {
		if (!this.oDataState) {
			this.oDataState = new DataState();
		}
		return this.oDataState;
	};
	
	/**
	 * Getter for model
	 * @return {sap.ui.core.Model} the model
	 */
	Binding.prototype.getModel = function() {
		return this.oModel;
	};

	// Eventing and related
	/**
	 * Attach event-handler <code>fnFunction</code> to the 'change' event of this <code>sap.ui.model.Model</code>.<br/>
	 * @param {function} fnFunction The function to call, when the event occurs.
	 * @param {object} [oListener] object on which to call the given function.
	 * @public
	 */
	Binding.prototype.attachChange = function(fnFunction, oListener) {
		if (!this.hasListeners("change")) {
			this.oModel.addBinding(this);
		}
		this.attachEvent("change", fnFunction, oListener);
	};

	/**
	 * Detach event-handler <code>fnFunction</code> from the 'change' event of this <code>sap.ui.model.Model</code>.<br/>
	 * @param {function} fnFunction The function to call, when the event occurs.
	 * @param {object} [oListener] object on which to call the given function.
	 * @public
	 */
	Binding.prototype.detachChange = function(fnFunction, oListener) {
		this.detachEvent("change", fnFunction, oListener);
		if (!this.hasListeners("change")) {
			this.oModel.removeBinding(this);
		}
	};
	
	/**
	 * Fire event dataStateChange to attached listeners.

	 * @param {Map}
	 *         mArguments the arguments to pass along with the event.
	 * @private
	 */
	Binding.prototype._fireDataStateChange = function(mArguments) {
		this.fireEvent("DataStateChange", mArguments);
	};

	/**
	* Attach event-handler <code>fnFunction</code> to the 'dataStateChange' event of this <code>sap.ui.model.Binding</code>.<br/>
	* @param {function} fnFunction The function to call, when the event occurs.
	* @param {object} [oListener] object on which to call the given function.
	* @protected
	*/
	Binding.prototype.attachDataStateChange = function(fnFunction, oListener) {
		this.attachEvent("DataStateChange", fnFunction, oListener);
	};

	/**
	* Detach event-handler <code>fnFunction</code> from the 'dataStateChange' event of this <code>sap.ui.model.Binding</code>.<br/>
	* @param {function} fnFunction The function to call, when the event occurs.
	* @param {object} [oListener] object on which to call the given function.
	* @protected
	*/
	Binding.prototype.detachDataStateChange = function(fnFunction, oListener) {
		this.detachEvent("DataStateChange", fnFunction, oListener);
	};

	/**
	* Fire event change to attached listeners.

	* @param {Map}
	*         mArguments the arguments to pass along with the event.
	* @private
	*/
	Binding.prototype._fireChange = function(mArguments) {
		this.fireEvent("change", mArguments);
	};

	/**
	 * Attach event-handler <code>fnFunction</code> to the 'dataRequested' event of this <code>sap.ui.model.Binding</code>.<br/>
	 * @param {function} fnFunction The function to call, when the event occurs.
	 * @param {object} [oListener] object on which to call the given function.
	 * @public
	 */
	Binding.prototype.attachDataRequested = function(fnFunction, oListener) {
		this.attachEvent("dataRequested", fnFunction, oListener);
	};

	/**
	 * Detach event-handler <code>fnFunction</code> from the 'dataRequested' event of this <code>sap.ui.model.Binding</code>.<br/>
	 * @param {function} fnFunction The function to call, when the event occurs.
	 * @param {object} [oListener] object on which to call the given function.
	 * @public
	 */
	Binding.prototype.detachDataRequested = function(fnFunction, oListener) {
		this.detachEvent("dataRequested", fnFunction, oListener);
	};

	/**
	 * Fire event dataRequested to attached listeners.

	 * @param {Map} mArguments the arguments to pass along with the event.
	 * @protected
	 */
	Binding.prototype.fireDataRequested = function(mArguments) {
		this.fireEvent("dataRequested", mArguments);
	};

	/**
	 * Attach event-handler <code>fnFunction</code> to the 'dataReceived' event of this <code>sap.ui.model.Binding</code>.<br/>
	 * @param {function} fnFunction The function to call, when the event occurs.
	 * @param {object} [oListener] object on which to call the given function.
	 * @public
	 */
	Binding.prototype.attachDataReceived = function(fnFunction, oListener) {
		this.attachEvent("dataReceived", fnFunction, oListener);
	};

	/**
	 * Detach event-handler <code>fnFunction</code> from the 'dataReceived' event of this <code>sap.ui.model.Binding</code>.<br/>
	 * @param {function} fnFunction The function to call, when the event occurs.
	 * @param {object} [oListener] object on which to call the given function.
	 * @public
	 */
	Binding.prototype.detachDataReceived = function(fnFunction, oListener) {
		this.detachEvent("dataReceived", fnFunction, oListener);
	};

	/**
	 * Fire event dataReceived to attached listeners. This event may also be fired when an error occured.

	 * @param {Map} mArguments the arguments to pass along with the event.
	 * @param {object} [mArguments.data] the data received. In error cases it will be undefined.
	 * @protected
	 */
	Binding.prototype.fireDataReceived = function(mArguments) {
		this.fireEvent("dataReceived", mArguments);
	};

	/**
	 * Determines if the binding should be updated by comparing the current model against a specified model.
	 * @param {object} oModel The model instance to compare against
	 * @returns {boolean} true if this binding should be updated
	 * @protected
	 */
	Binding.prototype.updateRequired = function(oModel) {
		return oModel && this.getModel() === oModel;
	};

	/**
	 * Checks whether an update of this bindings is required. If this is the case the change event of
	 * the binding is fired.
	 * The default implementation just fires the change event, if the method is called, the bForceUpdate
	 * parameter is ignored. Subclasses should implement this, if possible.
	 *
	 * @param {boolean} bForceUpdate
	 *
	 * @private
	 */
	Binding.prototype.checkUpdate = function(bForceUpdate) {
		if (!this.bSuspended) {
			this._fireChange({reason: ChangeReason.Change});
		}
	};

	/**
	 * Checks whether an update of the data state of this binding is required.
	 *
	 * @private
	 */
	Binding.prototype.checkDataState = function() {
		if (this.hasListeners("DataStateChange")) {
			var oDataState = this._updateDataState();
			if (oDataState && oDataState.changed()) {
				this._fireDataStateChange({dataState: oDataState});
				oDataState.changed(false);
			}
		}
	};
	
	/**
	 * Updates the data state and returns it.
	 * 
	 * @returns {sap.ui.model.DataStata} The data state
	 * @private
	 */
	Binding.prototype._updateDataState = function() {
		var oDataState = this.getDataState();
		if (this.oModel && this.sPath) {
			var sResolvedPath = this.oModel.resolve(this.sPath, this.oContext);
			if (sResolvedPath) {
				oDataState.setModelMessages(this.oModel.getMessagesByPath(sResolvedPath)); 
				oDataState.setLaundering(this.oModel.isLaundering(this.sPath, this.oContext));
			}
		}
		return oDataState;
	};
	
	/**
	 * Refreshes the binding, check whether the model data has been changed and fire change event
	 * if this is the case. For server side models this should refetch the data from the server.
	 * To update a control, even if no data has been changed, e.g. to reset a control after failed
	 * validation, please use the parameter bForceUpdate.
	 *
	 * @param {boolean} bForceUpdate Update the bound control even if no data has been changed
	 *
	 * @public
	 */
	Binding.prototype.refresh = function(bForceUpdate) {
		this.checkUpdate(bForceUpdate);
	};

	/**
	 * Initialize the binding. The message should be called when creating a binding.
	 * The default implementation calls checkUpdate(true).
	 *
	 * @protected
	 */
	Binding.prototype.initialize = function() {
		this.checkUpdate(true);
		return this;
	};

	/**
	 * _refresh for compatibility
	 * @private
	 */
	Binding.prototype._refresh = function() {
		this.refresh();
	};


	/**
	 * Returns whether the binding is initial, which means it did not get an initial value yet
	 * @return {boolean} whether binding is initial
	 * @public
	 */
	Binding.prototype.isInitial = function() {
		return this.bInitial;
	};

	/**
	 * Returns whether the binding is relative, which means it did not start with a /
	 * @return {boolean} whether binding is relative
	 * @public
	 */
	Binding.prototype.isRelative = function() {
		return this.bRelative;
	};

	/**
	 * Attach multiple events.
	 *
	 * @param {object} oEvents
	 * @protected
	 */
	Binding.prototype.attachEvents = function(oEvents) {
		if (!oEvents) {
			return this;
		}
		var that = this;
		jQuery.each(oEvents, function(sEvent, fnHandler) {
			var sMethod = "attach" + sEvent.substring(0,1).toUpperCase() + sEvent.substring(1);
			if (that[sMethod]) {
				that[sMethod](fnHandler);
			} else {
				jQuery.sap.log.warning(that.toString() + " has no handler for event '" + sEvent + "'");
			}
		});
		return this;
	};

	/**
	 * Detach multiple events-
	 *
	 * @param {object} oEvents
	 * @protected
	 */
	Binding.prototype.detachEvents = function(oEvents) {
		if (!oEvents) {
			return this;
		}
		var that = this;
		jQuery.each(oEvents, function(sEvent, fnHandler) {
			var sMethod = "detach" + sEvent.substring(0,1).toUpperCase() + sEvent.substring(1);
			if (that[sMethod]) {
				that[sMethod](fnHandler);
			} else {
				jQuery.sap.log.warning(that.toString() + " has no handler for event '" + sEvent + "'");
			}
		});
		return this;
	};

	/**
	 * Attach event-handler <code>fnFunction</code> to the 'refresh' event of this <code>sap.ui.model.Binding</code>.<br/>
	 * @param {function} fnFunction The function to call, when the event occurs.
	 * @param {object} [oListener] object on which to call the given function.
	 * @protected
	 */
	Binding.prototype.attachRefresh = function(fnFunction, oListener) {
		this.attachEvent("refresh", fnFunction, oListener);
	};

	/**
	 * Detach event-handler <code>fnFunction</code> from the 'refresh' event of this <code>sap.ui.model.Binding</code>.<br/>
	 * @param {function} fnFunction The function to call, when the event occurs.
	 * @param {object} [oListener] object on which to call the given function.
	 * @protected
	 */
	Binding.prototype.detachRefresh = function(fnFunction, oListener) {
		this.detachEvent("refresh", fnFunction, oListener);
	};

	/**
	 * Fire event refresh to attached listeners.
	 * @param {Map} [mArguments] the arguments to pass along with the event.
	 * @private
	 */
	Binding.prototype._fireRefresh = function(mArguments) {
		this.fireEvent("refresh", mArguments);
	};

	/**
	 * Suspends the binding update. No change Events will be fired
	 */
	Binding.prototype.suspend = function() {
		this.bSuspended = true;
	};

	/**
	 * Resumes the binding update. Change events will be fired again.
	 */
	Binding.prototype.resume = function() {
		this.bSuspended = false;
		this.checkUpdate();
	};

	return Binding;

});
