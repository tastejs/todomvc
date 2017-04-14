/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('io-queue', function (Y, NAME) {

/**
Extends IO to implement Queue for synchronous
transaction processing.
@module io
@submodule io-queue
@for IO
**/
var io = Y.io._map['io:0'] || new Y.IO();

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
        var io = this,
            o = io._q.next();

        io._qActiveId = o.id;
        io._qState = 0;
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
        var io = this,
            o = { uri: uri, cfg:c, id: this._id++ };

        if(!io._qInit) {
            Y.on('io:complete', function(id, o) { io._qNext(id); }, io);
            io._qInit = true;
        }

        io._q.add(o);
        if (io._qState === 1) {
            io._qShift();
        }

        Y.log('Object queued.  Transaction id is' + o.id, 'info', 'io');
        return o;
    },

    _qNext: function(id) {
        var io = this;
        io._qState = 1;
        if (io._qActiveId === id && io._q.size() > 0) {
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
        this._q = new Y.Queue();
    },

    qStart: function() {
        var io = this;
        io._qState = 1;

        if (io._q.size() > 0) {
            io._qShift();
        }
        Y.log('Queue started.', 'info', 'io');
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
        this._qState = 0;
        Y.log('Queue stopped.', 'info', 'io');
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
        return this._q.size();
    }

}, true);

function _queue(u, c) {
    return io.queue.apply(io, [u, c]);
}

_queue.start = function () { io.qStart(); };
_queue.stop = function () { io.qStop(); };
_queue.promote = function (o) { io.qPromote(o); };
_queue.remove = function (o) { io.qRemove(o); };
_queue.size = function () { io.qSize(); };
_queue.empty = function () { io.qEmpty(); };
Y.io.queue = _queue;


}, '3.7.3', {"requires": ["io-base", "queue-promote"]});
