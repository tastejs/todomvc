/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/base/ManagedObject','./ExportCell'],function(M,E){'use strict';var a=M.extend("sap.ui.core.util.ExportRow",{metadata:{library:"sap.ui.core",aggregations:{cells:{type:"sap.ui.core.util.ExportCell",multiple:true}}}});return a;});
