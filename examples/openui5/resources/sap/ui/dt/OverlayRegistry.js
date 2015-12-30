/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Element"],function(E){"use strict";var O={};var o={};O.getOverlay=function(e){var i=g(e);return o[i];};O.register=function(e,a){var i=g(e);o[i]=a;};O.deregister=function(e){var i=g(e);delete o[i];};O.hasOverlays=function(){return!jQuery.isEmptyObject(o);};function g(e){return(e instanceof E)?e.getId():e;}return O;},true);
