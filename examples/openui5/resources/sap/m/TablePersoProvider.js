/*
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/base/ManagedObject'],function(q,M){"use strict";var T=M.extend("sap.m.TablePersoProvider",{constructor:function(i,s){M.apply(this,arguments);},metadata:{"abstract":true,library:"sap.m"}});T.prototype.init=function(){q.sap.log.warning("This is the abstract base class for a TablePersoProvider. Do not create instances of this class, but use a concrete sub class instead.");q.sap.log.debug("TablePersoProvider init");};T.prototype.getPersData=function(){q.sap.log.debug("TablePersoProvider getPersData");};T.prototype.setPersData=function(b){q.sap.log.debug("TablePersoProvider setPersData");};T.prototype.delPersData=function(){q.sap.log.debug("TablePersoProvider delPersData");};T.prototype.getCaption=function(c){return null;};T.prototype.getGroup=function(c){return null;};T.prototype.resetPersData=function(){q.sap.log.debug("TablePersoProvider resetPersData");};return T;},true);
