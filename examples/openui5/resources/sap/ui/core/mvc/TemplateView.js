/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/core/library','./View'],function(q,l,V){"use strict";var T=V.extend("sap.ui.core.mvc.TemplateView",{metadata:{library:"sap.ui.core"}});(function(){sap.ui.templateview=function(i,v){return sap.ui.view(i,v,sap.ui.core.mvc.ViewType.Template);};T._sType=sap.ui.core.mvc.ViewType.Template;T.prototype.getControllerName=function(){return this._sControllerName;};T._getViewUrl=function(t){return q.sap.getModulePath(t,".view.tmpl");};T.prototype.initViewSettings=function(s){if(!s){throw new Error("mSettings must be given");}if(!s.viewName){throw new Error("No view name is given.");}this._oTemplate=sap.ui.template({id:this.getId(),src:T._getViewUrl(s.viewName)});this._sControllerName=this._oTemplate._sControllerName;this._oTemplate=this._oTemplate.createControl(undefined,undefined,this);this.addContent(this._oTemplate);};}());return T;});
