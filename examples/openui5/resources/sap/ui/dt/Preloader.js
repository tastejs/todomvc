/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Element"],function(E){"use strict";var P={aLoadedClasses:[]};P.load=function(e){var t=this;var q=[];e.forEach(function(v){var o=v;if(typeof o==="string"){o=jQuery.sap.getObject(o);}if(o&&o.getMetadata){var m=o.getMetadata();var c=m.getName?m.getName():null;var i=c&&t.aLoadedClasses.indexOf(c)!==-1;if(!i&&m.loadDesignTime){t.aLoadedClasses.push(c);q.push(m.loadDesignTime());}}});return Promise.all(q);};P.loadLibraries=function(l){var c=[];l.forEach(function(L){var m=jQuery.sap.getObject(L);for(var C in m){if(m.hasOwnProperty(C)){c.push(L+"."+C);}}});return this.load(c);};P.loadAllLibraries=function(){var l=[];var L=sap.ui.getCore().getLoadedLibraries();for(var s in L){if(L.hasOwnProperty(s)){l.push(s);}}return this.loadLibraries(l);};return P;},true);
