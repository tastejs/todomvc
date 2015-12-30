/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
/*global Promise */// declare unusual global vars for JSLint/SAPUI5 validation

// Provides class sap.ui.core.util.Export
sap.ui.define(['jquery.sap.global', 'sap/ui/core/Control', './ExportColumn', './ExportRow', './ExportType', './File'],
	function(jQuery, Control, ExportColumn, ExportRow, ExportType, File) {
	'use strict';

	// Utility functions to add jQuery Promise methods to a standard ES6 Promise object for compatibility reasons

	function wrapCallback(fnCallback, oContext) {
		if (fnCallback) {
			return function() {
				return fnCallback.apply(oContext, arguments);
			};
		} else {
			return fnCallback;
		}
	}

	function printJqPromiseDeprecationWarning(sMethodName) {
		jQuery.sap.log.warning("Usage of deprecated jQuery Promise method: '" + sMethodName + "'. " +
			"Please use the standard Promise methods 'then' / 'catch' instead!", "", "sap.ui.core.util.Export");
	}

	// Adds the jQuery Promise methods 'done', 'fail', 'always', 'pipe' and 'state' to the Promise object (and all promise objects created by itself).
	function createJqCompatiblePromise(fnPromise, oContext) {

		var oOriginalPromise = new Promise(fnPromise);

		// if no context is set, use the promise as context
		oContext = oContext || oOriginalPromise;

		// track the promise state (for state method)
		var bResolved = false, bRejected = false;

		oOriginalPromise.then(function(v) {
			bResolved = true;
			return v;
		}, function(e) {
			bRejected = true;
			throw e;
		});

		// save original standard methods
		var mOriginalMethods = {
				then: oOriginalPromise.then,
				"catch": oOriginalPromise["catch"]
		};

		function makePromiseJqCompatible(oPromise) {

			// Wrap standard promise methods

			oPromise.then = function(fnSuccessCallback, fnErrorCallback) {
				// TODO: handle multiple arguments + array of callbacks
				var aArgs = [ wrapCallback(fnSuccessCallback, oContext), wrapCallback(fnErrorCallback, oContext) ];
				return makePromiseJqCompatible(mOriginalMethods.then.apply(oPromise, aArgs), oContext);
			};
			oPromise["catch"] = function(fnCallback) {
				var aArgs = [ wrapCallback(fnCallback, oContext) ];
				return makePromiseJqCompatible(mOriginalMethods["catch"].apply(oPromise, aArgs), oContext);
			};

			// Map jQuery Promise methods to standard methods and add a deprecation warning

			jQuery.each([ {
				jq: "done",
				es6: "then"
			}, {
				jq: "fail",
				es6: "catch"
			}, {
				jq: "always",
				es6: "then"
			}], function(i, mConfig) {
				oPromise[mConfig.jq] = function() {
					printJqPromiseDeprecationWarning(mConfig.jq);
					var oReturnPromise = null;
					jQuery.each(Array.prototype.concat.apply([], arguments), function(i, fnCallback) {
						var fnWrappedCallback = wrapCallback(fnCallback, oContext);
						var fnFinalCallback = function(v) {
							fnWrappedCallback.apply(this, arguments);
							return v;
						};
						var aArgs = [ fnFinalCallback ];
						if (mConfig.jq === "always") {
							// use same callback for success / error handler
							aArgs.push(fnFinalCallback);
						}
						if (!oReturnPromise) {
							oReturnPromise = mOriginalMethods[mConfig.es6].apply(oPromise, aArgs);
						} else {
							oReturnPromise = oReturnPromise[mConfig.es6].apply(oReturnPromise, aArgs);
						}
					});
					return makePromiseJqCompatible(oReturnPromise, oContext);
				};
			});
			oPromise.pipe = function(fnDoneCallback, fnFailCallback) {
				printJqPromiseDeprecationWarning("pipe");
				return oPromise.then(fnDoneCallback, fnFailCallback);
			};
			oPromise.state = function() {
				printJqPromiseDeprecationWarning("state");
				if (bResolved) {
					return "resolved";
				} else if (bRejected) {
					return "rejected";
				} else {
					return "pending";
				}
			};

			return oPromise;
		}

		return makePromiseJqCompatible(oOriginalPromise);

	}

	/**
	 * Constructor for a new Export.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Export provides the possibility to generate a list of data in a specific format / type, e.g. CSV to use it in other programs / applications.
	 * @extends sap.ui.core.Control
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 * @since 1.22.0
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.core.util.Export
	 */
	var Export = Control.extend('sap.ui.core.util.Export', {

		metadata: {

			// ---- object ----
			publicMethods: [
				// methods
				"generate", "saveFile"
			],

			// ---- control specific ----
			library: "sap.ui.core",

			aggregations: {

				/**
				 * Type that generates the content.
				 */
				exportType: {
					type: 'sap.ui.core.util.ExportType',
					multiple: false
				},

				/**
				 * Columns for the Export.
				 */
				columns: {
					type: 'sap.ui.core.util.ExportColumn',
					multiple: true,
					bindable : 'bindable'
				},

				/**
				 * Rows of the Export.
				 */
				rows: {
					type: 'sap.ui.core.util.ExportRow',
					multiple: true,
					bindable: 'bindable'
				},

				/**
				 * Template row used for the export
				 */
				_template: {
					type: 'sap.ui.core.util.ExportRow',
					multiple: false,
					visibility: 'hidden'
				}
			}

		}

	});

	// The aggregation is only to get the data / contexts. no actual rows will be created so no template/factory is needed here
	Export.getMetadata().getAggregation("rows")._doesNotRequireFactory = true;

	/**
	 * @private
	 */
	Export.prototype.init = function() {
		this._oPromise = null;
		this._fnResolvePromise = null;
		this._oRowBindingArgs = null;
	};

	/**
	 * @private
	 */
	Export.prototype.exit = function() {
		delete this._oPromise;
		delete this._fnResolvePromise;
		delete this._oRowBindingArgs;
	};

	/**
	 * Creates the row template using the defined columns
	 *
	 * @return {sap.ui.core.util.ExportRow} row template
	 * @private
	 */
	Export.prototype._createRowTemplate = function() {
		var oTemplate = new ExportRow(this.getId() + "-row"),
			aCols = this.getColumns();

		for (var i = 0, l = aCols.length; i < l; i++) {
			var oColTemplate = aCols[i].getTemplate();
			if (oColTemplate) {
				oTemplate.addCell(oColTemplate.clone("col" + i));
			}
		}
		return oTemplate;
	};

	Export.prototype.bindAggregation = function(sName, oBindingInfo) {
		if (sName === 'rows') {
			// skip binding the aggregation for now.
			// will be bound when generating and unbound afterwards
			this._oRowBindingArgs = arguments;
			return this;
		}
		return Control.prototype.bindAggregation.apply(this, arguments);
	};

	/**
	 * Called when the row aggregation gets updated
	 *
	 * @private
	 */
	Export.prototype.updateRows = function(sReason) {
		if (sReason === 'change' && this._fnResolvePromise) {
			// generate the file
			var sContent = this.getExportType()._generate(this);

			// template and rows aren't needed anymore, cleans up bindings, etc.
			this.destroyAggregation('_template');
			this.unbindAggregation('rows');

			// resolve promise to notify listeners
			this._fnResolvePromise(sContent);

			// clear promise related objects
			this._oPromise = null;
			this._fnResolvePromise = null;
		}
	};

	/**
	 * Generates the file content and returns a Promise
	 * with the instance as context (this).<br>
	 * The promise will be resolved with the generated content
	 * as a string.
	 *
	 * <p><b>Please note: The return value was changed from jQuery Promises to standard ES6 Promises.
	 * jQuery specific Promise methods ('done', 'fail', 'always', 'pipe' and 'state') are still available but should not be used.
	 * Please use only the standard methods 'then' and 'catch'!</b></p>
	 *
	 * @return {Promise} Promise object
	 *
	 * @public
	 */
	Export.prototype.generate = function() {
		var that = this;

		if (!this._oPromise) {
			this._oPromise = createJqCompatiblePromise(function(resolve, reject) {
				that._fnResolvePromise = resolve;

				if (!that.hasModel()) {
					reject("Generate is not possible beause no model was set.");
				} else {
					// setup row-template
					var oTemplate = that._createRowTemplate();
					that.setAggregation('_template', oTemplate, true);

					// bind row aggregation (this.bindAggregation would do nothing)
					Control.prototype.bindAggregation.apply(that, that._oRowBindingArgs);

					// triggers data loading for OData.
					// TODO: find a cleaner solution (when $count is not supported)
					if (that.getBinding("rows")) {
						that.getBinding("rows").getContexts(0, that.getBinding("rows").getLength());
					}
				}
			}, this);
		}

		return this._oPromise;
	};

	/**
	 * Generates the file content, triggers a download / save action and
	 * returns a Promise with the instance as context (this).<br>
	 * The promise will be resolved with the generated content
	 * as a string.
	 * <p><b>For information about browser support, see <code>sap.ui.core.util.File.save</code></b></p>
	 *
	 * <p><b>Please note: The return value was changed from jQuery Promises to standard ES6 Promises.
	 * jQuery specific Promise methods ('done', 'fail', 'always', 'pipe' and 'state') are still available but should not be used.
	 * Please use only the standard methods 'then' and 'catch'!</b></p>
	 *
	 * @param {string} [sFileName] file name, defaults to 'data'
	 * @return {Promise} Promise object
	 *
	 * @public
	 */
	Export.prototype.saveFile = function(sFileName) {
		return this.generate().then(function(sContent) {
			var oExportType = this.getExportType();
			// Trigger the save action
			File.save(sContent, sFileName || "data", oExportType.getFileExtension(), oExportType.getMimeType(), oExportType.getCharset());
		});
	};

	return Export;
});
