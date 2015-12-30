/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global'],function(q){"use strict";var I=function(o,m){if(!o){return o;}function c(o,M){return function(){var t=o[M].apply(o,arguments);return(t instanceof sap.ui.base.Object)?t.getInterface():t;};}if(!m){return{};}var M;for(var i=0,a=m.length;i<a;i++){M=m[i];this[M]=c(o,M);}};return I;},true);
