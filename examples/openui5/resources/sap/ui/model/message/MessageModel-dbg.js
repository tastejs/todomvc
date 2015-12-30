/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

/**
 * Message DataBinding
 *
 * @namespace
 * @name sap.ui.model.message
 * @public
 */

// Provides the Message based model implementation
sap.ui.define(['jquery.sap.global', 'sap/ui/model/BindingMode', 'sap/ui/model/ClientModel', 'sap/ui/model/Context', './MessageListBinding', './MessagePropertyBinding'],
	function(jQuery, BindingMode, ClientModel, Context, MessageListBinding, MessagePropertyBinding) {
	"use strict";


	/**
	 * Constructor for a new JSONModel.
	 *
	 * @class
	 * Model implementation for Messages 
	 * 	 *
	 * @extends sap.ui.model.Model
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @param {sap.ui.core.message.MessageManager} oMessageManager The MessageManager instance
	 * @constructor
	 * @public
	 * @alias sap.ui.model.message.MessageModel
	 */
	var MessageModel = ClientModel.extend("sap.ui.model.message.MessageModel", /** @lends sap.ui.model.message.MessageModel.prototype */ {
		
		constructor : function(oMessageManager) {
			ClientModel.apply(this, arguments);
			
			this.sDefaultBindingMode = BindingMode.OneWay;
			this.mSupportedBindingModes = {
				"OneWay" : true,
				"TwoWay" : false,
				"OneTime" : false
			};
			
			this.oMessageManager = oMessageManager;
		}
	});
	
	/**
	 * Sets the message data to the model.
	 *
	 * @param {object} oData the data to set on the model
	 *
	 * @public
	 */
	MessageModel.prototype.setData = function(oData){
		this.oData = oData;
		this.checkUpdate();
	};
	
	MessageModel.prototype.fireMessageChange = function(mArguments) {
		this.fireEvent("messageChange", mArguments);
		return this;
	};
	
	/**
	 * @see sap.ui.model.Model.prototype.bindProperty
	 *
	 */
	MessageModel.prototype.bindProperty = function(sPath, oContext, mParameters) {
		var oBinding = new MessagePropertyBinding(this, sPath, oContext, mParameters);
		return oBinding;
	};
	
	/**
	 * @see sap.ui.model.Model.prototype.bindList
	 *
	 */
	MessageModel.prototype.bindList = function(sPath, oContext, aSorters, aFilters, mParameters) {
		var oBinding = new MessageListBinding(this, sPath, oContext, aSorters, aFilters, mParameters);
		return oBinding;
	};
	
	/**
	 * Sets a new value for the given property <code>sPropertyName</code> in the model.
	 * If the model value changed all interested parties are informed.
	 *
	 * @param {string}  sPath path of the property to set
	 * @param {any}     oValue value to set the property to
	 * @param {object} [oContext=null] the context which will be used to set the property
	 * @public
	 */
	MessageModel.prototype.setProperty = function(sPath, oValue, oContext) {
		//not implemented: Only 'OneWay' binding mode supported
		jQuery.sap.log.error(this + "not implemented: Only 'OneWay' binding mode supported");
	};
	
	/**
	* Returns the value for the property with the given <code>sPropertyName</code>
	*
	* @param {string} sPath the path to the property
	* @param {object} [oContext=null] the context which will be used to retrieve the property
	* @type any
	* @return the value of the property
	* @public
	*/
	MessageModel.prototype.getProperty = function(sPath, oContext) {
		return this._getObject(sPath, oContext);
	
	};
	
	/**
	 * @param {string} sPath
	 * @param {object} [oContext]
	 * @returns {any} the node of the specified path/context
	 */
	MessageModel.prototype._getObject = function (sPath, oContext) {
		var oNode;
		
		if (oContext instanceof Context) {
			oNode = this._getObject(oContext.getPath());
		} else if (oContext) {
			oNode = oContext;
		}
		
		if (!sPath) {
			return oNode;
		}
		var aParts = sPath.split("/"),
			iIndex = 0;
		if (!aParts[0]) {
			// absolute path starting with slash
			oNode = this.oData;
			iIndex++;
		}
		while (oNode && aParts[iIndex]) {
			oNode = oNode[aParts[iIndex]];
			iIndex++;
		}
		return oNode;
	};
	
	return MessageModel;

});
