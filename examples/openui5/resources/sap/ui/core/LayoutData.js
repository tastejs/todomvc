/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./Element','./library'],function(q,E,l){"use strict";var L=E.extend("sap.ui.core.LayoutData",{metadata:{"abstract":true,library:"sap.ui.core"}});L.prototype.invalidate=function(){var p=this.getParent();if(p&&p.getMetadata().getName()=="sap.ui.core.VariantLayoutData"){p=p.getParent();}if(p){var o=p.getParent();if(o){var e=q.Event("LayoutDataChange");e.srcControl=p;o._handleEvent(e);}}};L.prototype.setLayoutData=function(o){return this;};return L;});
