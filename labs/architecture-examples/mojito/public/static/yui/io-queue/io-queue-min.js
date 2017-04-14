/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add("io-queue",function(e,t){function r(e,t){return n.queue.apply(n,[e,t])}var n=e.io._map["io:0"]||new e.IO;e.mix(e.IO.prototype,{_q:new e.Queue,_qActiveId:null,_qInit:!1,_qState:1,_qShift:function(){var e=this,t=e._q.next();e._qActiveId=t.id,e._qState=0,e.send(t.uri,t.cfg,t.id)},queue:function(t,n){var r=this,i={uri:t,cfg:n,id:this._id++};return r._qInit||(e.on("io:complete",function(e,t){r._qNext(e)},r),r._qInit=!0),r._q.add(i),r._qState===1&&r._qShift(),i},_qNext:function(e){var t=this;t._qState=1,t._qActiveId===e&&t._q.size()>0&&t._qShift()},qPromote:function(e){this._q.promote(e)},qRemove:function(e){this._q.remove(e)},qEmpty:function(){this._q=new e.Queue},qStart:function(){var e=this;e._qState=1,e._q.size()>0&&e._qShift()},qStop:function(){this._qState=0},qSize:function(){return this._q.size()}},!0),r.start=function(){n.qStart()},r.stop=function(){n.qStop()},r.promote=function(e){n.qPromote(e)},r.remove=function(e){n.qRemove(e)},r.size=function(){n.qSize()},r.empty=function(){n.qEmpty()},e.io.queue=r},"3.7.3",{requires:["io-base","queue-promote"]});
