/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add("attribute-base",function(e,t){var n=function(){this._ATTR_E_FACADE=null,this._yuievt=null,e.AttributeCore.apply(this,arguments),e.AttributeEvents.apply(this,arguments),e.AttributeExtras.apply(this,arguments)};e.mix(n,e.AttributeCore,!1,null,1),e.mix(n,e.AttributeExtras,!1,null,1),e.mix(n,e.AttributeEvents,!0,null,1),n.INVALID_VALUE=e.AttributeCore.INVALID_VALUE,n._ATTR_CFG=e.AttributeCore._ATTR_CFG.concat(e.AttributeEvents._ATTR_CFG),e.Attribute=n},"3.7.3",{requires:["attribute-core","attribute-events","attribute-extras"]});
