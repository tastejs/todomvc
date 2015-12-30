/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./Object'],function(B){"use strict";var O=B.extend("sap.ui.base.ObjectPool",{constructor:function(o){B.call(this);this.oObjectClass=o;this.aFreeObjects=[];}});O.prototype.borrowObject=function(){var o=this.aFreeObjects.length==0?new this.oObjectClass():this.aFreeObjects.pop();o.init.apply(o,arguments);return o;};O.prototype.returnObject=function(o){o.reset();this.aFreeObjects.push(o);};return O;});
