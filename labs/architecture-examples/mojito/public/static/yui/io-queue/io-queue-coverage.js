/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["build/io-queue/io-queue.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/io-queue/io-queue.js",
    code: []
};
_yuitest_coverage["build/io-queue/io-queue.js"].code=["YUI.add('io-queue', function (Y, NAME) {","","/**","Extends IO to implement Queue for synchronous","transaction processing.","@module io","@submodule io-queue","@for IO","**/","var io = Y.io._map['io:0'] || new Y.IO();","","Y.mix(Y.IO.prototype, {","   /**","    * Array of transactions queued for processing","    *","    * @property _q","    * @private","    * @static","    * @type {Object}","    */","    _q: new Y.Queue(),","    _qActiveId: null,","    _qInit: false,","","   /**","    * Property to determine whether the queue is set to","    * 1 (active) or 0 (inactive).  When inactive, transactions","    * will be stored in the queue until the queue is set to active.","    *","    * @property _qState","    * @private","    * @static","    * @type {Number}","    */","    _qState: 1,","","   /**","    * Method Process the first transaction from the","    * queue in FIFO order.","    *","    * @method _qShift","    * @private","    * @static","    */","    _qShift: function() {","        var io = this,","            o = io._q.next();","","        io._qActiveId = o.id;","        io._qState = 0;","        io.send(o.uri, o.cfg, o.id);","    },","","   /**","    * Method for queueing a transaction before the request is sent to the","    * resource, to ensure sequential processing.","    *","    * @method queue","    * @static","    * @return {Object}","    */","    queue: function(uri, c) {","        var io = this,","            o = { uri: uri, cfg:c, id: this._id++ };","","        if(!io._qInit) {","            Y.on('io:complete', function(id, o) { io._qNext(id); }, io);","            io._qInit = true;","        }","","        io._q.add(o);","        if (io._qState === 1) {","            io._qShift();","        }","","        return o;","    },","","    _qNext: function(id) {","        var io = this;","        io._qState = 1;","        if (io._qActiveId === id && io._q.size() > 0) {","            io._qShift();","        }","    },","","   /**","    * Method for promoting a transaction to the top of the queue.","    *","    * @method promote","    * @static","    */","    qPromote: function(o) {","        this._q.promote(o);","    },","","   /**","    * Method for removing a specific, pending transaction from","    * the queue.","    *","    * @method remove","    * @private","    * @static","    */","    qRemove: function(o) {","        this._q.remove(o);","    },","","   /**","    * Method for cancel all pending transaction from","    * the queue.","    *","    * @method empty","    * @static","    * @since 3.7.3","    */","    qEmpty: function() {","        this._q = new Y.Queue();","    },","","    qStart: function() {","        var io = this;","        io._qState = 1;","","        if (io._q.size() > 0) {","            io._qShift();","        }","    },","","   /**","    * Method for setting queue processing to inactive.","    * Transaction requests to YUI.io.queue() will be stored in the queue, but","    * not processed until the queue is reset to \"active\".","    *","    * @method _stop","    * @private","    * @static","    */","    qStop: function() {","        this._qState = 0;","    },","","   /**","    * Method to query the current size of the queue.","    *","    * @method _size","    * @private","    * @static","    * @return {Number}","    */","    qSize: function() {","        return this._q.size();","    }","","}, true);","","function _queue(u, c) {","    return io.queue.apply(io, [u, c]);","}","","_queue.start = function () { io.qStart(); };","_queue.stop = function () { io.qStop(); };","_queue.promote = function (o) { io.qPromote(o); };","_queue.remove = function (o) { io.qRemove(o); };","_queue.size = function () { io.qSize(); };","_queue.empty = function () { io.qEmpty(); };","Y.io.queue = _queue;","","","}, '3.7.3', {\"requires\": [\"io-base\", \"queue-promote\"]});"];
_yuitest_coverage["build/io-queue/io-queue.js"].lines = {"1":0,"10":0,"12":0,"46":0,"49":0,"50":0,"51":0,"63":0,"66":0,"67":0,"68":0,"71":0,"72":0,"73":0,"76":0,"80":0,"81":0,"82":0,"83":0,"94":0,"106":0,"118":0,"122":0,"123":0,"125":0,"126":0,"140":0,"152":0,"157":0,"158":0,"161":0,"162":0,"163":0,"164":0,"165":0,"166":0,"167":0};
_yuitest_coverage["build/io-queue/io-queue.js"].functions = {"_qShift:45":0,"(anonymous 2):67":0,"queue:62":0,"_qNext:79":0,"qPromote:93":0,"qRemove:105":0,"qEmpty:117":0,"qStart:121":0,"qStop:139":0,"qSize:151":0,"_queue:157":0,"start:161":0,"stop:162":0,"promote:163":0,"remove:164":0,"size:165":0,"empty:166":0,"(anonymous 1):1":0};
_yuitest_coverage["build/io-queue/io-queue.js"].coveredLines = 37;
_yuitest_coverage["build/io-queue/io-queue.js"].coveredFunctions = 18;
_yuitest_coverline("build/io-queue/io-queue.js", 1);
YUI.add('io-queue', function (Y, NAME) {

/**
Extends IO to implement Queue for synchronous
transaction processing.
@module io
@submodule io-queue
@for IO
**/
_yuitest_coverfunc("build/io-queue/io-queue.js", "(anonymous 1)", 1);
_yuitest_coverline("build/io-queue/io-queue.js", 10);
var io = Y.io._map['io:0'] || new Y.IO();

_yuitest_coverline("build/io-queue/io-queue.js", 12);
Y.mix(Y.IO.prototype, {
   /**
    * Array of transactions queued for processing
    *
    * @property _q
    * @private
    * @static
    * @type {Object}
    */
    _q: new Y.Queue(),
    _qActiveId: null,
    _qInit: false,

   /**
    * Property to determine whether the queue is set to
    * 1 (active) or 0 (inactive).  When inactive, transactions
    * will be stored in the queue until the queue is set to active.
    *
    * @property _qState
    * @private
    * @static
    * @type {Number}
    */
    _qState: 1,

   /**
    * Method Process the first transaction from the
    * queue in FIFO order.
    *
    * @method _qShift
    * @private
    * @static
    */
    _qShift: function() {
        _yuitest_coverfunc("build/io-queue/io-queue.js", "_qShift", 45);
_yuitest_coverline("build/io-queue/io-queue.js", 46);
var io = this,
            o = io._q.next();

        _yuitest_coverline("build/io-queue/io-queue.js", 49);
io._qActiveId = o.id;
        _yuitest_coverline("build/io-queue/io-queue.js", 50);
io._qState = 0;
        _yuitest_coverline("build/io-queue/io-queue.js", 51);
io.send(o.uri, o.cfg, o.id);
    },

   /**
    * Method for queueing a transaction before the request is sent to the
    * resource, to ensure sequential processing.
    *
    * @method queue
    * @static
    * @return {Object}
    */
    queue: function(uri, c) {
        _yuitest_coverfunc("build/io-queue/io-queue.js", "queue", 62);
_yuitest_coverline("build/io-queue/io-queue.js", 63);
var io = this,
            o = { uri: uri, cfg:c, id: this._id++ };

        _yuitest_coverline("build/io-queue/io-queue.js", 66);
if(!io._qInit) {
            _yuitest_coverline("build/io-queue/io-queue.js", 67);
Y.on('io:complete', function(id, o) { _yuitest_coverfunc("build/io-queue/io-queue.js", "(anonymous 2)", 67);
io._qNext(id); }, io);
            _yuitest_coverline("build/io-queue/io-queue.js", 68);
io._qInit = true;
        }

        _yuitest_coverline("build/io-queue/io-queue.js", 71);
io._q.add(o);
        _yuitest_coverline("build/io-queue/io-queue.js", 72);
if (io._qState === 1) {
            _yuitest_coverline("build/io-queue/io-queue.js", 73);
io._qShift();
        }

        _yuitest_coverline("build/io-queue/io-queue.js", 76);
return o;
    },

    _qNext: function(id) {
        _yuitest_coverfunc("build/io-queue/io-queue.js", "_qNext", 79);
_yuitest_coverline("build/io-queue/io-queue.js", 80);
var io = this;
        _yuitest_coverline("build/io-queue/io-queue.js", 81);
io._qState = 1;
        _yuitest_coverline("build/io-queue/io-queue.js", 82);
if (io._qActiveId === id && io._q.size() > 0) {
            _yuitest_coverline("build/io-queue/io-queue.js", 83);
io._qShift();
        }
    },

   /**
    * Method for promoting a transaction to the top of the queue.
    *
    * @method promote
    * @static
    */
    qPromote: function(o) {
        _yuitest_coverfunc("build/io-queue/io-queue.js", "qPromote", 93);
_yuitest_coverline("build/io-queue/io-queue.js", 94);
this._q.promote(o);
    },

   /**
    * Method for removing a specific, pending transaction from
    * the queue.
    *
    * @method remove
    * @private
    * @static
    */
    qRemove: function(o) {
        _yuitest_coverfunc("build/io-queue/io-queue.js", "qRemove", 105);
_yuitest_coverline("build/io-queue/io-queue.js", 106);
this._q.remove(o);
    },

   /**
    * Method for cancel all pending transaction from
    * the queue.
    *
    * @method empty
    * @static
    * @since 3.7.3
    */
    qEmpty: function() {
        _yuitest_coverfunc("build/io-queue/io-queue.js", "qEmpty", 117);
_yuitest_coverline("build/io-queue/io-queue.js", 118);
this._q = new Y.Queue();
    },

    qStart: function() {
        _yuitest_coverfunc("build/io-queue/io-queue.js", "qStart", 121);
_yuitest_coverline("build/io-queue/io-queue.js", 122);
var io = this;
        _yuitest_coverline("build/io-queue/io-queue.js", 123);
io._qState = 1;

        _yuitest_coverline("build/io-queue/io-queue.js", 125);
if (io._q.size() > 0) {
            _yuitest_coverline("build/io-queue/io-queue.js", 126);
io._qShift();
        }
    },

   /**
    * Method for setting queue processing to inactive.
    * Transaction requests to YUI.io.queue() will be stored in the queue, but
    * not processed until the queue is reset to "active".
    *
    * @method _stop
    * @private
    * @static
    */
    qStop: function() {
        _yuitest_coverfunc("build/io-queue/io-queue.js", "qStop", 139);
_yuitest_coverline("build/io-queue/io-queue.js", 140);
this._qState = 0;
    },

   /**
    * Method to query the current size of the queue.
    *
    * @method _size
    * @private
    * @static
    * @return {Number}
    */
    qSize: function() {
        _yuitest_coverfunc("build/io-queue/io-queue.js", "qSize", 151);
_yuitest_coverline("build/io-queue/io-queue.js", 152);
return this._q.size();
    }

}, true);

_yuitest_coverline("build/io-queue/io-queue.js", 157);
function _queue(u, c) {
    _yuitest_coverfunc("build/io-queue/io-queue.js", "_queue", 157);
_yuitest_coverline("build/io-queue/io-queue.js", 158);
return io.queue.apply(io, [u, c]);
}

_yuitest_coverline("build/io-queue/io-queue.js", 161);
_queue.start = function () { _yuitest_coverfunc("build/io-queue/io-queue.js", "start", 161);
io.qStart(); };
_yuitest_coverline("build/io-queue/io-queue.js", 162);
_queue.stop = function () { _yuitest_coverfunc("build/io-queue/io-queue.js", "stop", 162);
io.qStop(); };
_yuitest_coverline("build/io-queue/io-queue.js", 163);
_queue.promote = function (o) { _yuitest_coverfunc("build/io-queue/io-queue.js", "promote", 163);
io.qPromote(o); };
_yuitest_coverline("build/io-queue/io-queue.js", 164);
_queue.remove = function (o) { _yuitest_coverfunc("build/io-queue/io-queue.js", "remove", 164);
io.qRemove(o); };
_yuitest_coverline("build/io-queue/io-queue.js", 165);
_queue.size = function () { _yuitest_coverfunc("build/io-queue/io-queue.js", "size", 165);
io.qSize(); };
_yuitest_coverline("build/io-queue/io-queue.js", 166);
_queue.empty = function () { _yuitest_coverfunc("build/io-queue/io-queue.js", "empty", 166);
io.qEmpty(); };
_yuitest_coverline("build/io-queue/io-queue.js", 167);
Y.io.queue = _queue;


}, '3.7.3', {"requires": ["io-base", "queue-promote"]});
