/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global'],function(q){"use strict";var A={NONE:null,V1:1,V2:2,getVersion:function(o){var v;var O;if(o&&o.getMetadata){O=o.getMetadata().getName();}switch(O){case"sap.ui.model.odata.ODataModel":v=this.V1;break;case"sap.ui.model.odata.v2.ODataModel":v=this.V2;break;default:v=this.NONE;q.sap.log.info("AnalyticalVersionInfo.getVersion(...) - The given object is no instance of ODataModel V1 or V2!");break;}return v;}};return A;},true);
