/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('parallel', function (Y, NAME) {


/**
* A concurrent parallel processor to help in running several async functions.
* @module parallel
* @main parallel
*/

/**
A concurrent parallel processor to help in running several async functions.

    var stack = new Y.Parallel();

    for (var i = 0; i < 15; i++) {
        Y.io('./api/json/' + i, {
            on: {
                success: stack.add(function() {
                    Y.log('Done!');
                })
            }
        });
    }

    stack.done(function() {
        Y.log('All IO requests complete!');
    });

@class Parallel
@param {Object} o A config object
@param {Object} [o.context=Y] The execution context of the callback to done


*/

Y.Parallel = function(o) {
    this.config = o || {};
    this.results = [];
    this.context = this.config.context || Y;
    this.total = 0;
    this.finished = 0;
};

Y.Parallel.prototype = {
    /**
    * An Array of results from all the callbacks in the stack
    * @property results
    * @type Array
    */

    results: null,
    /**
    * The total items in the stack
    * @property total
    * @type Number
    */
    total: null,
    /**
    * The number of stacked callbacks executed
    * @property finished
    * @type Number
    */
    finished: null,
    /**
    * Add a callback to the stack
    * @method add
    * @param {Function} fn The function callback we are waiting for
    */
    add: function (fn) {
        var self = this,
            index = self.total;

        self.total += 1;

        return function () {
            self.finished++;
            self.results[index] = (fn && fn.apply(self.context, arguments)) ||
                (arguments.length === 1 ? arguments[0] : Y.Array(arguments));

            self.test();
        };
    },
    /**
    * Test to see if all registered items in the stack have completed, if so call the callback to `done`
    * @method test
    */
    test: function () {
        var self = this;
        if (self.finished >= self.total && self.callback) {
            self.callback.call(self.context, self.results, self.data);
        }
    },
    /**
    * The method to call when all the items in the stack are complete.
    * @method done
    * @param {Function} callback The callback to execute on complete
    * @param {Mixed} callback.results The results of all the callbacks in the stack
    * @param {Mixed} [callback.data] The data given to the `done` method
    * @param {Mixed} data Mixed data to pass to the success callback
    */
    done: function (callback, data) {
        this.callback = callback;
        this.data = data;
        this.test();
    }
};


}, '3.7.3', {"requires": ["yui-base"]});
