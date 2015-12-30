/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([],function(){return function(p){return function(c){var i=true;jQuery.each(p,function(P,o){var f=c["get"+jQuery.sap.charToUpperCase(P,0)];if(!f){i=false;jQuery.sap.log.error("Control "+c.sId+" does not have a property called: "+P);return false;}var C=f.call(c);if(o instanceof RegExp){i=o.test(C);}else{i=C===o;}if(!i){return false;}});return i;};};},true);
