/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./TextField','./library'],function(q,T,l){"use strict";var P=T.extend("sap.ui.commons.PasswordField",{metadata:{library:"sap.ui.commons"}});P.prototype.onfocusin=function(e){T.prototype.onfocusin.apply(this,arguments);if(!sap.ui.Device.support.input.placeholder&&this.getPlaceholder()){q(this.getInputDomRef()).attr("type","password");}};P.prototype.onsapfocusleave=function(e){if(!sap.ui.Device.support.input.placeholder&&this.getPlaceholder()){var i=q(this.getInputDomRef());if(!i.val()){i.removeAttr("type");}}T.prototype.onsapfocusleave.apply(this,arguments);};return P;},true);
