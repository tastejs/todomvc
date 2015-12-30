/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./CalloutBaseRenderer','sap/ui/core/Renderer'],function(q,C,R){"use strict";var a=R.extend(C);a.renderContent=function(r,c){var b=r;var d=c.getContent();for(var i=0;i<d.length;i++){b.renderControl(d[i]);}};a.addRootClasses=function(r,c){r.addClass("sapUiClt");};a.addContentClasses=function(r,c){r.addClass("sapUiCltCont");};a.addArrowClasses=function(r,c){r.addClass("sapUiCltArr");};return a;},true);
