/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(function(){"use strict";var T={};T.render=function(r,c){var s=c.isInline()||this.hasControlData;if(!s){r.write("<div");r.writeControlData(c);r.writeStyles();r.writeClasses();r.write(">");}var R=this.renderTemplate||c.getTemplateRenderer();if(R){R.apply(this,arguments);}if(!s){r.write("</div>");}};return T;},true);
