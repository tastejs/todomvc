/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/model/ClientTreeBinding'],function(q,C){"use strict";var J=C.extend("sap.ui.model.json.JSONTreeBinding");J.prototype._saveSubContext=function(n,c,s,N){if(n&&typeof n=="object"){var o=this.oModel.getContext(s+N);if(this.aFilters&&!this.bIsFiltering){if(q.inArray(o,this.filterInfo.aFilteredContexts)!=-1){c.push(o);}}else{c.push(o);}}};return J;});
