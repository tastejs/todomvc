/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./Model'],function(M){"use strict";var a=M.extend("sap.ui.model.MetaModel",{constructor:function(){M.apply(this,arguments);}});a.prototype.createBindingContext=function(p,c,P,C){if(typeof c=="function"){C=c;c=null;}if(typeof P=="function"){C=P;P=null;}var s=this.resolve(p,c),n=(s==undefined)?undefined:this.getContext(s?s:"/");if(!n){n=null;}if(C){C(n);}return n;};a.prototype.destroy=function(){return M.prototype.destroy.apply(this,arguments);};a.prototype.destroyBindingContext=function(c){};return a;});
