/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add("panel",function(e,t){var n=e.ClassNameManager.getClassName;e.Panel=e.Base.create("panel",e.Widget,[e.WidgetPosition,e.WidgetStdMod,e.WidgetAutohide,e.WidgetButtons,e.WidgetModality,e.WidgetPositionAlign,e.WidgetPositionConstrain,e.WidgetStack],{BUTTONS:{close:{label:"Close",action:"hide",section:"header",template:'<button type="button" />',classNames:n("button","close")}}},{ATTRS:{buttons:{value:["close"]}}})},"3.7.3",{requires:["widget","widget-autohide","widget-buttons","widget-modality","widget-position","widget-position-align","widget-position-constrain","widget-stack","widget-stdmod"],skinnable:!0});
