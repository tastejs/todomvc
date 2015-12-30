/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/core/Renderer','./FormLayoutRenderer'],function(q,R,F){"use strict";var a=R.extend(F);a.getMainClass=function(){return"sapUiFormResGrid";};a.renderContainers=function(r,l,f){var c=f.getFormContainers();var v=[];var L=0;for(var i=0;i<c.length;i++){var C=c[i];if(C.getVisible()){L++;v.push(C);}}if(L>0){if(L>1){r.renderControl(l._mainGrid);}else if(l.mContainers[v[0].getId()][0]){r.renderControl(l.mContainers[v[0].getId()][0]);}else{r.renderControl(l.mContainers[v[0].getId()][1]);}}};return a;},true);
