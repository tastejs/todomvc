/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/commons/library','sap/ui/core/CustomStyleClassSupport','sap/ui/core/Element'],function(q,l,C,E){"use strict";var M=E.extend("sap.ui.commons.layout.MatrixLayoutRow",{metadata:{library:"sap.ui.commons",aggregatingType:"MatrixLayout",properties:{height:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null}},defaultAggregation:"cells",aggregations:{cells:{type:"sap.ui.commons.layout.MatrixLayoutCell",multiple:true,singularName:"cell"}}}});C.apply(M.prototype);return M;},true);
