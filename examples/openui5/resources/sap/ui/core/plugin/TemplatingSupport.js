/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/core/Core','sap/ui/core/tmpl/Template'],function(q,C,T){"use strict";var a=function(){};a.prototype.startPlugin=function(c,o){q.sap.log.info("Starting TemplatingSupport plugin.");this.oCore=c;sap.ui.template();};a.prototype.stopPlugin=function(){q.sap.log.info("Stopping TemplatingSupport plugin.");this.oCore=null;};(function(){var t=new a();sap.ui.getCore().registerPlugin(t);}());return a;},true);
