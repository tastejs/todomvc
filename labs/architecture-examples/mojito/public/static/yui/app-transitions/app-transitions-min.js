/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add("app-transitions",function(e,t){function n(){}n.ATTRS={transitions:{setter:"_setTransitions",value:!1}},n.FX={fade:{viewIn:"app:fadeIn",viewOut:"app:fadeOut"},slideLeft:{viewIn:"app:slideLeft",viewOut:"app:slideLeft"},slideRight:{viewIn:"app:slideRight",viewOut:"app:slideRight"}},n.prototype={transitions:{navigate:"fade",toChild:"slideLeft",toParent:"slideRight"},_setTransitions:function(t){var n=this.transitions;return t&&t===!0?e.merge(n):t}},e.App.Transitions=n,e.Base.mix(e.App,[n]),e.mix(e.App.CLASS_NAMES,{transitioning:e.ClassNameManager.getClassName("app","transitioning")})},"3.7.3",{requires:["app-base"]});
