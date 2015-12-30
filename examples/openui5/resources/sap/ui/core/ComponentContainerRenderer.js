/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(function(){"use strict";var C={};C.render=function(r,c){var R=r;var o=c.getComponentInstance();var w=c.getWidth();var h=c.getHeight();R.write("<div");R.writeControlData(c);if(w){R.addStyle("width",w);}if(h){R.addStyle("height",h);}R.writeStyles();R.addClass("sapUiComponentContainer");R.writeClasses();R.write(">");R.write("<div id=\""+c.getId()+"-uiarea\"");if(w&&w!=="auto"){R.addStyle("width","100%");}if(h&&h!=="auto"){R.addStyle("height","100%");}R.writeStyles();R.write(">");if(o){o.render(R);}R.write("</div></div>");};return C;},true);
