/*
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides class sap.ui.app.MockServer for mocking a server
sap.ui.define(['jquery.sap.global', 'sap/ui/core/util/MockServer'],
	function(jQuery, MockServer1) {
	"use strict";


	/**
	 * Creates a mocked server. This helps to mock all or some backend calls, e.g. for OData/JSON Models or simple XHR calls, without
	 * changing the application code. This class can also be used for qunit tests.
	 * 
	 * @param {string} [sId] id for the new server object; generated automatically if no non-empty id is given
	 *      Note: this can be omitted, no matter whether <code>mSettings</code> will be given or not!
	 * @param {object} [mSettings] optional map/JSON-object with initial property values, aggregated objects etc. for the new object
	 * @param {object} [oScope] scope object for resolving string based type and formatter references in bindings
	 * 
	 * @class Class to mock a server
	 * @extends sap.ui.base.ManagedObject
	 * @abstract
	 * @author SAP SE
	 * @version 1.32.9
	 * @public
	 * @name sap.ui.app.MockServer
	 * @experimental Since 1.13.0. The mock server is still under construction, so some implementation details can be changed in future.
	 * @deprecated Since 1.15.1. The mock server code has been moved to sap.ui.core.util - see {@link sap.ui.core.util.MockServer}
	 */
	var MockServer = MockServer1;
	

	return MockServer;

}, /* bExport= */ true);
