/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/core/Core','sap/ui/core/DeclarativeSupport'],function(q,C,D){"use strict";var a=function(){};a.prototype.startPlugin=function(c,o){q.sap.log.info("Starting DeclarativeSupport plugin.");this.oCore=c;this.oWindow=window;D.compile(document.body);};a.prototype.stopPlugin=function(){q.sap.log.info("Stopping DeclarativeSupport plugin.");this.oCore=null;};(function(){var t=new a();sap.ui.getCore().registerPlugin(t);}());return a;},true);
