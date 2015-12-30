/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides the base implementation for all model implementations
sap.ui.define(['./Date', 'sap/ui/core/format/DateFormat'],
	function(Date, DateFormat) {
	"use strict";


	/**
	 * Constructor for a DateTime type.
	 *
	 * @class
	 * This class represents datetime simple types.
	 *
	 * @extends sap.ui.model.type.Date
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @param {object} [oFormatOptions] options used to create a DateFormat for formatting / parsing to/from external values and 
	 *           optionally for a second DateFormat to convert between the data source format (Model) and the internally used JavaScript Date.format. 
	 *           For both DateFormat objects, the same options are supported as for {@link sap.ui.core.format.DateFormat.getDateTimeInstance DateFormat.getDateTimeInstance}.
	 *           Note that this differs from the base type.
	 * @param {object} [oConstraints] value constraints. Supports the same kind of constraints as its base type Date, but note the different format options (Date vs. DateTime) 
	 * @alias sap.ui.model.type.DateTime
	 */
	var DateTime = Date.extend("sap.ui.model.type.DateTime", /** @lends sap.ui.model.type.DateTime.prototype */ {
		
		constructor : function () {
			Date.apply(this, arguments);
			this.sName = "DateTime";
		}
	
	});
	
	/**
	 * Creates formats used by this type
	 * @private
	 */
	DateTime.prototype._createFormats = function() {
		this.oOutputFormat = DateFormat.getDateTimeInstance(this.oFormatOptions);
		if (this.oFormatOptions.source) {
			this.oInputFormat = DateFormat.getDateTimeInstance(this.oFormatOptions.source);
		}
	};


	return DateTime;

});
