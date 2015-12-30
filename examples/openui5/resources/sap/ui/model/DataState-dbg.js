/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([ 'jquery.sap.global', '../base/Object' ], function(jQuery, BaseObject) {
	"use strict";

	/**
	 * @class 
	 * Provides and update the status data of a binding. 
	 * Depending on the models state and controls state changes, the data state is used to propagated changes to a control.
	 * The control can react on these changes by implementing the <code>refreshDataState</code> method for the control. 
	 * Here the the data state object is passed as a parameter.
	 * 
	 * Using the {@link #getChanges getChanges} method the control can determine the changed properties and their old and new value.
	 * <pre>
	 *     //sample implementation to handle message changes
	 *     myControl.prototype.refreshDataState = function(oDataState) {
	 *        var aMessages = oDataState.getChanges().messages;
	 *        if (aMessages) {
	 *            for (var i=0;i<aMessages.length;i++) {
	 *                console.log(aMessages.message);
	 *            }
	 *        }
	 *        
	 *     }
	 *     
	 *     //sample implementation to handle laundering state
	 *     myControl.prototype.refreshDataState = function(oDataState) {
	 *        var bLaundering = oDataState.getChanges().laundering || false;
	 *        this.setBusy(bLaundering);
	 *     }
	 *     
	 *     //sample implementation to handle dirty state
	 *     myControl.prototype.refreshDataState = function(oDataState) {
	 *        if (oDataState.isDirty()) console.log("Control " + this.getId() + " is now dirty");
	 *     }
	 * </pre>
	 * 
	 * Using the {@link #getProperty getProperty} method the control can read the properties of the data state. The properties are
	 * <ul>
	 *     <li><code>value</code> The value formatted by the formatter of the binding
	 *     <li><code>originalValue</code> The original value of the model formatted by the formatter of the binding
	 *     <li><code>invalidValue</code> The control value that was tried to be applied to the model but was rejected by a type validation
	 *     <li><code>modelMessages</code> The messages that were applied to the binding by the <code>sap.ui.model.MessageModel</code>
	 *     <li><code>controlMessages</code> The messages that were applied due to type validation errors
	 *     <li><code>messages</code> All messages of the data state
	 *      <li><code>dirty</code> true if the value was not yet confirmed by the server
	 * </ul>
	 * 
	 * @extends sap.ui.base.Object
	 * 
	 * @author SAP SE
	 * @version 1.32.9
	 * 
	 * @constructor
	 * @public
	 * @alias sap.ui.model.DataState
	 */
	var DataState = BaseObject.extend("sap.ui.model.DataState", /** @lends sap.ui.model.DataState.prototype */ {
		metadata : {},
		constructor : function() {
			this.mProperties = {
				modelMessages : null,
				controlMessages: null,
				laundering: false,
				originalValue : null,
				originalInternalValue: null,
				value : null,
				invalidValue: null
			};
			this._bChanged = true;
			//the resolved path of the binding to check for binding context changes
			this.mChangedProperties = {};
		}
	});
	
	/**
	 * Updates the given property variable
	 * 
	 * @param {string} sProperty the member variable
	 * @param {any} vValue the new value;
	 * @private
	 */
	DataState.prototype._updateProperty = function(sProperty,vValue) {
		if (this._bChanged === false) {
			//clear the changed properties as changed was reset;
			this.mChangedProperties = {};
		}
		if (!jQuery.sap.equal(this.mProperties[sProperty],vValue)) {
			var bDirty = this.isDirty();
			if (!(sProperty in this.mChangedProperties)) {
				this.mChangedProperties[sProperty] = {
					oldValue : jQuery.isArray(this.mProperties[sProperty]) ? this.mProperties[sProperty].slice(0) : this.mProperties[sProperty]
				};
				if (sProperty === "modelMessages" || sProperty === "controlMessages") {
					if (this.getMessages()) {
						this.mChangedProperties["messages"] = {
							oldValue : this.getMessages().slice(0)
						};
					} else {
						this.mChangedProperties["messages"] = {
							oldValue : null
						};
					}
					if (jQuery.isArray(vValue)) {
						vValue = vValue.slice(0);
					} else {
						vValue = null;
					}
				}
			}
			this.mProperties[sProperty] = vValue;

			if ((!("dirty" in this.mChangedProperties)) && bDirty !== this.isDirty()) {
				this.mChangedProperties.dirty = {
					oldValue : bDirty
				};
			}

			this._bChanged = true;
		}
		return this;
	};

	/**
	 * Returns the current value of the property
	 * 
	 * @param {string} the name of the property
	 * @returns {any} the vaue of the property
	 * @private
	 */
	DataState.prototype.getProperty = function(sProperty) {
		if (sProperty === "messages") {
			return this.getMessages(); //combine all messages
		}
		if (sProperty === "dirty") {
			return this.isDirty(); // dirty state
		}
		return this.mProperties[sProperty];
	};

	/**
	 * Returns the array of all state messages or null.
	 * This combines the model and control messages.
	 * 
	 * @returns {sap.ui.core.Message[]} the array of all messages or null if no {link:sap.ui.core.messages.ModelManager ModelManager} is used.
	 * @public
	 */
	DataState.prototype.getMessages = function() {
		var aMessages = null,
			aControlMessages = this.getControlMessages(),
			aModelMessages = this.getModelMessages();
		if (aModelMessages || aControlMessages) {
			aMessages = [].concat(aModelMessages ? aModelMessages : [], aControlMessages ? aControlMessages : []);
		}
		return aMessages;
	};

	/**
	 * Sets an array of model state messages.
	 * 
	 * @param {array} the model messages for this data state.
	 * @returns {sap.ui.model.DataState} <code>this</code> to allow method chaining
	 * @public
	 */
	DataState.prototype.setModelMessages = function(aMessages) {
		return this._updateProperty("modelMessages",aMessages || null);
	};

	/**
	 * Returns the array of state messages of the model or undefined
	 * 
	 * @returns {sap.ui.core.Message[]} the array of messages of the model or null if no {link:sap.ui.core.messages.ModelManager ModelManager} is used.
	 * @public
	 */
	DataState.prototype.getModelMessages = function() {
		return this.getProperty("modelMessages");
	};

	/**
	 * Sets an array of control state messages.
	 * 
	 * @param {sap.ui.core.Message[]} the control messages
	 * @return {sap.ui.model.DataState} <code>this</code> to allow method chaining
	 * @protected
	 */
	DataState.prototype.setControlMessages = function(aMessages) {
		return this._updateProperty("controlMessages",aMessages || null);
	};

	/**
	 * Returns the array of state messages of the control or undefined.
	 * 
	 * @return {sap.ui.core.Message[]} the array of messages of the control or null if no {link:sap.ui.core.messages.ModelManager ModelManager} is used.
	 * @public
	 */
	DataState.prototype.getControlMessages = function() {
		return this.getProperty("controlMessages");
	};

	/**
	 * Returns whether the data state is dirty.
	 * A data state is dirty if the value was changed 
	 * but is not yet confirmed by a server or the entered value did not yet pass the type validation.
	 * 
	 * @returns {boolean} true if the data state is dirty
	 * @public
	 */
	DataState.prototype.isDirty = function() {
		return this.isControlDirty() || !jQuery.sap.equal(this.mProperties.value,this.mProperties.originalValue);
	};

	/**
	 * Returns whether the data state is dirty in the UI control. 
	 * A data state is dirty in the UI control if the entered value did not yet pass the type validation.
	 * 
	 * @returns {boolean} true if the data state is dirty 
	 * @public
	 */
	DataState.prototype.isControlDirty = function() {
		return this.mProperties.invalidValue !== null && 
			(!jQuery.sap.equal(this.mProperties.invalidValue,this.mProperties.value) || !jQuery.sap.equal(this.mProperties.invalidValue,this.mProperties.originalValue));
	};

	/**
	 * Returns whether the data state is in laundering.
	 * If data is send to the server the data state becomes laundering until the 
	 * data was accepted or rejected.
	 * 
	 * @returns {boolean} true if the data is laundering
	 * @public
	 */
	 DataState.prototype.isLaundering = function() {
		return this.getProperty("laundering");
	};

	/**
	 * Sets the laundering state of the data state.
	 * 
	 * @param {boolean} bLaundering true if the state is laundering
	 * @returns {sap.ui.model.DataState} <code>this</code> to allow method chaining
	 * @protected
	 */
	DataState.prototype.setLaundering = function(bLaundering) {
		return this._updateProperty("laundering",bLaundering);
	};

	/**
	 * Returns the formatted value of the data state.
	 * 
	 * @returns {any} The value of the data.
	 * @public
	 */
	DataState.prototype.getValue = function(vValue) {
		return this.getProperty("value");
	};

	/**
	 * Sets the formatted value of the data state, 
	 * 
	 * @param {any} vValue the value
	 * @returns {sap.ui.model.DataState} <code>this</code> to allow method chaining
	 * @protected
	 */
	DataState.prototype.setValue = function(vValue) {
		return this._updateProperty("value",vValue);
	};

	/**
	 * Returns the value of the data state .
	 * The internal value is not formatted
	 * in the corresponding <code>PropertyBinding</code>.
	 * 
	 * @returns {any} The internal value of the data.
	 * @private
	 */
	DataState.prototype.getInternalValue = function(vValue) {
		return this.getProperty("internalValue");
	};

	/**
	 * Sets the internal value.
	 * 
	 * @param {any} vInternalValue the value
	 * @returns {sap.ui.model.DataState} <code>this</code> to allow method chaining
	 * @protected
	 */
	DataState.prototype.setInternalValue = function(vInternalValue) {
		return this._updateProperty("internalValue",vInternalValue);
	};

	/**
	 * Returns the dirty value of a binding that was rejected by a type validation.
	 * This value was of an incorrect type and could not be applied to the model. If the
	 * value was not rejected it will return null. In this case the current
	 * model value can be accessed using the <code>getValue</code> method. 
	 * 
	 * @returns {any} the value that was rejected or null
	 * @public
	 */
	DataState.prototype.getInvalidValue = function() {
		return this.getProperty("invalidValue");
	};
	
	/**
	 * Sets the dirty value that was rejected by the type validation.
	 * 
	 * @param {any} vInvalidValue the value that was rejected by the type validation or null if the value was valid
	 * @returns {sap.ui.model.DataState} <code>this</code> to allow method chaining
	 * @protected
	 */
	DataState.prototype.setInvalidValue = function(vInvalidValue) {
		return this._updateProperty("invalidValue",vInvalidValue);
	};
	
	/**
	 * Returns the formatted original value of the data. 
	 * The original value is the last confirmed value.
	 * 
	 * @returns {any} the original confirmed value of the server
	 * @public
	 */
	DataState.prototype.getOriginalValue = function() {
		return this.getProperty("originalValue");
	};
	
	/**
	 * Sets the formatted original value of the data.
	 * 
	 * @param {boolean} vOriginalValue the original value
	 * @returns {sap.ui.model.DataState} <code>this</code> to allow method chaining
	 * @protected
	 */
	DataState.prototype.setOriginalValue = function(vOriginalValue) {
		return this._updateProperty("originalValue",vOriginalValue);
	};
	
	/**
	 * Returns the original internal value of the data state. 
	 * The original internal value is the last confirmed data.
	 * 
	 * @returns {any} the original confirmed value of the server
	 * @private
	 */
	DataState.prototype.getOriginalInternalValue = function() {
		return this.getProperty("originalInternalValue");
	};
	
	/**
	 * Returns the original internal value of the data state. 
	 * The original internal value is the last confirmed data.
	 * 
	 * @param {boolean} vOriginalInternalValue the original value
	 * @returns {sap.ui.model.DataState} <code>this</code> to allow method chaining
	 * @protected
	 */
	DataState.prototype.setOriginalInternalValue = function(vOriginalInternalValue) {
		return this._updateProperty("originalInternalValue",vOriginalInternalValue);
	};
	
	/**
	 * Returns or sets whether the data state is changed.
	 * As long as changed was not set to false the data state is dirty 
	 * and the corresponding binding will fire data state change events.
	 * 
	 * @param {boolean} [bNewState] the optional new state
	 * @returns {boolean} whether the data state was changed.
	 * @protected
	 */
	DataState.prototype.changed = function(bNewState) {
		if (typeof bNewState === "boolean") {
			this._bChanged = bNewState;
			return;
		}
		return this._bChanged;
	};

	/**
	 * Returns the changes of the data state in a map that the control can use in the 
	 * <code>refreshDataState</code> method.
	 * The changed property's name is the key in the map. Each element in the map contains an object of below structure.
	 * <pre>
	 *    { 
	 *        oldValue : The old value of the property,
	 *        value    : The new value of the property
	 *    }
	 * </pre>
	 * The map only contains the changed properties.
	 * 
	 * @returns {map} the changed of the data state
	 * @public
	 */
	DataState.prototype.getChanges = function() {
		for (var n in this.mChangedProperties) {
			var vValue = this.getProperty(n);
			if (this.mChangedProperties[n].oldValue === vValue) {
				delete this.mChangedProperties[n];
			} else {
				this.mChangedProperties[n].value = jQuery.isArray(vValue) ? vValue.slice(0) : vValue;
			}
		}
		return this.mChangedProperties;
	};

	return DataState;
});
