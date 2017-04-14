/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add("dd-gestures",function(e,t){e.DD.Drag.START_EVENT="gesturemovestart",e.DD.Drag.prototype._prep=function(){this._dragThreshMet=!1;var t=this.get("node"),n=e.DD.DDM;t.addClass(n.CSS_PREFIX+"-draggable"),t.on(e.DD.Drag.START_EVENT,e.bind(this._handleMouseDownEvent,this),{minDistance:this.get("clickPixelThresh"),minTime:this.get("clickTimeThresh")}),t.on("gesturemoveend",e.bind(this._handleMouseUp,this),{standAlone:!0}),t.on("dragstart",e.bind(this._fixDragStart,this))};var n=e.DD.Drag.prototype._unprep;e.DD.Drag.prototype._unprep=function(){var e=this.get("node");n.call(this),e.detachAll("gesturemoveend")},e.DD.DDM._setupListeners=function(){var t=e.DD.DDM;this._createPG(),this._active=!0,e.one(e.config.doc).on("gesturemove",e.throttle(e.bind(t._move,t),t.get("throttleTime")),{standAlone:!0})}},"3.7.3",{requires:["dd-drag","event-synthetic","event-gestures"]});
