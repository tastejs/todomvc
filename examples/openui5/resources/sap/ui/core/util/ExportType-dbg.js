/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides class sap.ui.core.util.ExportType
sap.ui.define(['jquery.sap.global', 'sap/ui/base/ManagedObject'],
	function(jQuery, ManagedObject) {
	'use strict';

	/**
	 * Constructor for a new ExportType.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Base export type. Subclasses can be used for {@link sap.ui.core.util.Export Export}.
	 * @extends sap.ui.base.ManagedObject
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 * @since 1.22.0
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.core.util.ExportType
	 */
	var ExportType = ManagedObject.extend('sap.ui.core.util.ExportType', {

		metadata: {
			library: "sap.ui.core",
			properties: {
				/**
				 *  File extension.
				 */
				fileExtension: 'string',
				
				/**
				 * MIME type.
				 */
				mimeType: 'string',
				
				/**
				 * Charset.
				 */
				charset: 'string'
			}
		}

	});

	/**
	 * @private
	 */
	ExportType.prototype.init = function() {
		this._oExport = null;
	};

	/**
	 * Handles the generation process of the file.<br>
	 *
	 * @param {sap.ui.core.util.Export} oExport export instance
	 * @return {string} content
	 *
	 * @protected
	 */
	ExportType.prototype._generate = function(oExport) {
		this._oExport = oExport;
		var sContent = this.generate();
		this._oExport = null;
		return sContent;
	};

	/**
	 * Generates the file content.<br>
	 * Should be implemented by the individual types!
	 *
	 * @return {string} content
	 *
	 * @protected
	 */
	ExportType.prototype.generate = function() {
		return '';
	};

	/**
	 * Returns the number of columns.
	 *
	 * @return {int} count
	 *
	 * @protected
	 */
	ExportType.prototype.getColumnCount = function() {
		if (this._oExport) {
			return this._oExport.getColumns().length;
		}
		return 0;
	};

	/**
	 * Returns the number of rows.
	 *
	 * @return {int} count
	 *
	 * @protected
	 */
	ExportType.prototype.getRowCount = function() {
		if (this._oExport && this._oExport.getBinding("rows")) {
			return this._oExport.getBinding("rows").getLength();
		}
		return 0;
	};

	/**
	 * Creates a column "generator" (inspired by ES6 Generators)
	 *
	 * @return {Generator} generator
	 * @protected
	 */
	ExportType.prototype.columnGenerator = function() {
		/*
		// Implementation using ES6 Generator
		function* cellGenerator() {
			var aColumns = this._oExport.getColumns(),
				iColumns = aColumns.length;

			for (var i = 0; i < iColumns; i++) {
				yield {
					index: i,
					name: aColumns[i].getName()
				};
			}
		}
		*/

		var i = 0,
			aColumns = this._oExport.getColumns(),
			iColumns = aColumns.length;

		return {
			next: function() {
				if (i < iColumns) {
					var iIndex = i;
					i++;
					return {
						value: {
							index: iIndex,
							name: aColumns[iIndex].getName()
						},
						done: false
					};
				} else {
					return {
						value: undefined,
						done: true
					};
				}
			}
		};
	};

	/**
	 * Creates a cell "generator" (inspired by ES6 Generators)
	 *
	 * @return {Generator} generator
	 * @protected
	 */
	ExportType.prototype.cellGenerator = function() {
		/*
		// Implementation using ES6 Generator
		function* cellGenerator() {
			var oRowTemplate = this._oExport.getAggregation('_template'),
				aCells = oRowTemplate.getCells(),
				iCells = aCells.length;

			for (var i = 0; i < iCells; i++) {
				yield {
					index: i,
					content: aCells[i].getContent()
				};
			}
		}
		*/

		var i = 0,
			oRowTemplate = this._oExport.getAggregation('_template'),
			aCells = oRowTemplate.getCells(),
			iCells = aCells.length;

		return {
			next: function() {
				if (i < iCells) {
					var iIndex = i;
					i++;

					// convert customData object array to key-value map
					var mCustomData = {};
					jQuery.each(aCells[iIndex].getCustomData(), function() {
						mCustomData[this.getKey()] = this.getValue();
					});

					return {
						value: {
							index: iIndex,
							content: aCells[iIndex].getContent(),
							customData: mCustomData
						},
						done: false
					};
				} else {
					return {
						value: undefined,
						done: true
					};
				}
			}
		};
	};

	/**
	 * Creates a row "generator" (inspired by ES6 Generators)
	 *
	 * @return {Generator} generator
	 * @protected
	 */
	ExportType.prototype.rowGenerator = function() {
		/*
		// Implementation using ES6 Generator
		function* rowGenerator() {
			var oExport = this._oExport,
				oBinding = oExport.getBinding("rows"),
				mBindingInfos = oExport.getBindingInfo("rows"),
				aContexts = oBinding.getContexts(0, oBinding.getLength()),
				iContexts = aContexts.length,
				oRowTemplate = oExport.getAggregation('_template');

			for (var i = 0; i < iCells; i++) {
				oRowTemplate.setBindingContext(aContexts[i], mBindingInfos.model);
				yield {
					index: i,
					cells: this.cellGenerator()
				};
			}
		}
		*/

		var that = this,
			i = 0,
			oExport = this._oExport,
			oBinding = oExport.getBinding("rows"),
			mBindingInfos = oExport.getBindingInfo("rows"),
			aContexts = oBinding.getContexts(0, oBinding.getLength()),
			iContexts = aContexts.length,
			oRowTemplate = oExport.getAggregation('_template');

		return {
			next: function() {
				if (i < iContexts) {
					var iIndex = i;
					i++;

					oRowTemplate.setBindingContext(aContexts[iIndex], mBindingInfos.model);
					return {
						value: {
							index: iIndex,
							cells: that.cellGenerator()
						},
						done: false
					};
				} else {
					return {
						value: undefined,
						done: true
					};
				}
			}
		};
	};

	return ExportType;

});
