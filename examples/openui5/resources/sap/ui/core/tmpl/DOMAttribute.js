/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/core/Element','sap/ui/core/library'],function(E,l){"use strict";var D=E.extend("sap.ui.core.tmpl.DOMAttribute",{metadata:{library:"sap.ui.core",properties:{name:{type:"string",group:"Data",defaultValue:null},value:{type:"string",group:"Data",defaultValue:null}}}});D.prototype.setValue=function(v){this.setProperty("value",v,true);var p=this.getParent(),$=p&&p.$();if($&&$.length>0){$.attr(this.getName(),this.getProperty("value"));}return this;};return D;});
