/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/core/support/Plugin'],function(q,P){"use strict";var L=P.extend("sap.ui.core.support.plugins.LocalStorage",{constructor:function(s){P.apply(this,["sapUiSupportLocalStorage","",s]);if(this.isToolPlugin()){throw Error();}this._oStub=s;this._aEventIds=[this.getId()+"GetItem",this.getId()+"SetItem"];}});L.prototype.onsapUiSupportLocalStorageGetItem=function(E){var i=E.getParameter("id"),p=E.getParameter("passThroughData"),v="";try{v=window.localStorage.getItem(i);if(!v||v==="undefined"){v="";}}catch(e){q.sap.log.error("Could not get item '"+i+"' from localStorage: "+e.message);v="";}this._oStub.sendEvent(E.getParameter("callback"),{value:v,passThroughData:p});};L.prototype.onsapUiSupportLocalStorageSetItem=function(E){var i=E.getParameter("id"),v=E.getParameter("value");try{window.localStorage.setItem(i,v);}catch(e){q.sap.log.error("Could not write to localStorage: '"+i+"' : '"+v+"': "+e.message);}};return L;});
