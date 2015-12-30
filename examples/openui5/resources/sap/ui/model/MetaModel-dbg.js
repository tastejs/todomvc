/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['./Model'],
	function(Model) {
	"use strict";

	/**
	 * Constructor for a new MetaModel.
	 *
	 * @class Model implementation for meta models
	 * @abstract
	 * @extends sap.ui.model.Model
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.model.MetaModel
	 */
	var MetaModel = Model.extend("sap.ui.model.MetaModel", {
			constructor : function() {
				Model.apply(this, arguments);
			}
		});

	/**
	 * @param {string} sPath
	 *   the path to create the new context from
	 * @param {object} [oContext=null]
	 *   the context which should be used to create the new binding context
	 * @param {object} [mParameters=null]
	 *   the parameters used to create the new binding context
	 * @param {function} [fnCallBack]
	 *   the function which should be called after the binding context has been created
	 * @param {boolean} [bReload]
	 *   force reload even if data is already available. For server side models this should
	 *   refetch the data from the server
	 * @return {sap.ui.model.Context} the binding context, if it could be created synchronously

	 * @see sap.ui.model.Model.prototype.createBindingContext
	 *
	 */
	MetaModel.prototype.createBindingContext = function(sPath, oContext, mParameters, fnCallBack) {
		//TODO should come from a to be implemented read-only base class for ClientModels
		// optional parameter handling
		if (typeof oContext == "function") {
			fnCallBack = oContext;
			oContext = null;
		}
		if (typeof mParameters == "function") {
			fnCallBack = mParameters;
			mParameters = null;
		}
		// resolve path and create context
		var sContextPath = this.resolve(sPath, oContext),
			oNewContext = (sContextPath == undefined) ? undefined : this.getContext(sContextPath ? sContextPath : "/");
			if (!oNewContext) {
				oNewContext = null;
		}
		if (fnCallBack) {
			fnCallBack(oNewContext);
		}
		return oNewContext;
	};

	MetaModel.prototype.destroy = function () {
		return Model.prototype.destroy.apply(this, arguments);
	};

	/**
	 * @see sap.ui.model.Model.prototype.destroyBindingContext
	 * @param {object}
	 *         oContext to destroy
	 */
	MetaModel.prototype.destroyBindingContext = function(oContext) {
		// TODO: what todo here?
	};

	return MetaModel;

});
