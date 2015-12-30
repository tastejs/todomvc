/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides class sap.ui.core.util.ExportTypeCSV
sap.ui.define(['./ExportType'],
	function(ExportType) {
	'use strict';

	/**
	 * Constructor for a new ExportTypeCSV.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * CSV export type. Can be used for {@link sap.ui.core.util.Export Export}.<br>
	 * <br>
	 * Please note that there could issues with the separator char depending on the user's system language in some programs such as Microsoft Excel.<br>
	 * To prevent those issues use the data-import functionality which enables the possibility to explicitly set the separator char that should be used.<br>
	 * This way the content will be displayed correctly.
	 *
	 * @extends sap.ui.core.util.ExportType
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 * @since 1.22.0
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.core.util.ExportTypeCSV
	 */
	var CSV = ExportType.extend('sap.ui.core.util.ExportTypeCSV', {

		metadata: {
			library: "sap.ui.core",
			properties: {
				
				/**
				 * Separator char.
				 * 
				 * Value needs to be exactly one character or empty for default.
				 */
				separatorChar: {
					type: 'string',
					defaultValue: ','
				}
			}

		}

	});

	/**
	 * Setter for property <code>separatorChar</code>.
	 *
	 * Value needs to be exactly one character or empty for default. Default value is ','.
	 *
	 * @param {string} sSeparatorChar  new value for property <code>separatorChar</code>
	 * @return {sap.ui.core.util.ExportTypeCSV} <code>this</code> to allow method chaining
	 * @public
	 */
	CSV.prototype.setSeparatorChar = function(sSeparatorChar) {
		var sSeparatorChar = this.validateProperty('separatorChar', sSeparatorChar);
		if (sSeparatorChar.length > 1) {
			throw new Error("Value of property \"separatorChar\" needs to be exactly one character or empty. " +
				"\"" + sSeparatorChar + "\" is " + sSeparatorChar.length + " characters long.");
		}
		return this.setProperty('separatorChar', sSeparatorChar);
	};

	/**
	 * @private
	 */
	CSV.prototype.init = function() {
		// Set default values
		this.setProperty('fileExtension', 'csv', true);
		this.setProperty('mimeType', 'text/csv', true);
		this.setProperty('charset', 'utf-8', true);
	};

	/**
	 * Escapes the value if needed to prevent issues with separator-char and new-line.
	 *
	 * @private
	 */
	CSV.prototype.escapeContent = function(sVal) {
		if (sVal && (sVal.indexOf(this.getSeparatorChar()) > -1 || sVal.indexOf('\r\n') > -1)) {
			sVal = sVal.replace(/"/g, '""');
			sVal = '"' + sVal + '"';
		}
		return sVal;
	};

	/**
	 * Generates the file content.
	 *
	 * @return {string} content
	 * @protected
	 */
	CSV.prototype.generate = function() {
		var aBuffer = [];

		this.generateColumns(aBuffer);
		this.generateRows(aBuffer);

		return aBuffer.join('\r\n');
	};

	/**
	 * Generates the columns.
	 *
	 * @param {string[]} aBuffer export buffer array
	 *
	 * @private
	 */
	CSV.prototype.generateColumns = function(aBuffer) {
		var aColumnBuffer = [],
			oColumns = this.columnGenerator(),
			oColumn;

		while (!(oColumn = oColumns.next()).done) {
			aColumnBuffer.push(this.escapeContent(oColumn.value.name));
		}

		aBuffer.push(aColumnBuffer.join(this.getSeparatorChar()));
	};

	/**
	 * Generates the row content.
	 *
	 * @param {string[]} aBuffer export buffer array
	 *
	 * @private
	 */
	CSV.prototype.generateRows = function(aBuffer) {
		var oRows = this.rowGenerator(),
			oRow;

		while (!(oRow = oRows.next()).done) {
			var aRowBuffer = [];

			var oCells = oRow.value.cells,
				oCell;

			while (!(oCell = oCells.next()).done) {
				aRowBuffer.push(this.escapeContent(oCell.value.content));
			}

			aBuffer.push(aRowBuffer.join(this.getSeparatorChar()));
		}
	};

	return CSV;

}
);
