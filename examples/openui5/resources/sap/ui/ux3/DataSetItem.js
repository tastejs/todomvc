/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/core/Element','./library'],function(q,E,l){"use strict";var D=E.extend("sap.ui.ux3.DataSetItem",{metadata:{library:"sap.ui.ux3",properties:{iconSrc:{type:"sap.ui.core.URI",group:"Misc",defaultValue:null},title:{type:"string",group:"Misc",defaultValue:'Title'},checkable:{type:"boolean",group:"Misc",defaultValue:true},subtitle:{type:"string",group:"Misc",defaultValue:'Subtitle'}},aggregations:{_template:{type:"sap.ui.core.Control",multiple:false,visibility:"hidden"}},events:{selected:{parameters:{itemId:{type:"string"}}}}}});D.prototype.onclick=function(e){e.stopPropagation();var s=e.shiftKey;var c=!!(e.metaKey||e.ctrlKey);this.fireSelected({itemId:this.getId(),shift:s,ctrl:c});};D.prototype.ondblclick=function(e){this.onclick(e);};return D;},true);
