/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./Object'],function(q,B){"use strict";var E=B.extend("sap.ui.base.Event",{constructor:function(i,s,p){B.apply(this);if(arguments.length>0){this.init(i,s,p);}}});E.prototype.init=function(i,s,p){this.sId=i;this.oSource=s;this.mParameters=p||{};this.bCancelBubble=false;this.bPreventDefault=false;};E.prototype.reset=function(){this.sId="";this.oSource=null;this.mParameters=null;this.bCancelBubble=false;this.bPreventDefault=false;};E.prototype.getId=function(){return this.sId;};E.prototype.getSource=function(){return this.oSource;};E.prototype.getParameters=function(){return this.mParameters;};E.prototype.getParameter=function(n){return this.mParameters[n];};E.prototype.cancelBubble=function(){this.bCancelBubble=true;};E.prototype.preventDefault=function(){this.bPreventDefault=true;};return E;});
