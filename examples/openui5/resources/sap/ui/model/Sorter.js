/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/base/Object'],function(B){"use strict";var S=B.extend("sap.ui.model.Sorter",{constructor:function(p,d,g){if(typeof p==="object"){var s=p;p=s.path;d=s.descending;g=s.group;}this.sPath=p;var i=this.sPath.indexOf(">");if(i>0){this.sPath=this.sPath.substr(i+1);}this.bDescending=d;this.vGroup=g;if(typeof g=="boolean"&&g){this.fnGroup=function(c){return c.getProperty(this.sPath);};}if(typeof g=="function"){this.fnGroup=g;}},getGroup:function(c){var g=this.fnGroup(c);if(typeof g==="string"||typeof g==="number"||typeof g==="boolean"||g==null){g={key:g};}return g;}});return S;});
