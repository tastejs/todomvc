/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/core/Element'],function(q,E){"use strict";var M=E.extend("sap.m.MaskInputRule",{metadata:{library:"sap.m",properties:{maskFormatSymbol:{type:"string",group:"Misc",defaultValue:"*"},regex:{type:"string",group:"Misc",defaultValue:"[a-zA-Z0-9]"}}}});M.prototype.init=function(){};M.prototype.exit=function(){};M.prototype.setMaskFormatSymbol=function(n){var i=v.call(this,n);if(i){this.setProperty("maskFormatSymbol",n);}return this;};M.prototype.setRegex=function(n){var i=a.call(this,n);if(i){this.setProperty("regex",n);}return this;};M.prototype.toString=function(){return this.getMaskFormatSymbol()+":"+this.getRegex();};function v(n){var r=/^.$/i,N=r.test(n);if(!N){q.sap.log.error("The mask format symbol '"+n+"' is not valid");}return N;}function a(r){var b=/.+/i,R=b.test(r);if(!R){q.sap.log.error("The regex value '"+r+"' is not valid");}return R;}return M;},false);
