/*!
* CanJS - 1.1.5 (2013-03-27)
* http://canjs.us/
* Copyright (c) 2013 Bitovi
* Licensed MIT
*/
define(['can/util/library', 'can/observe', 'can/observe/compute'], function (can) {
    can.extend(can.Observe.List.prototype, {
        filter: function (callback) {
            // The filtered list
            var filtered = new this.constructor();
            var self = this;
            // Creates the binder for a single element at a given index
            var generator = function (element, index) {
                // The event handler that updates the filtered list
                var binder = function (ev, val) {
                    var index = filtered.indexOf(element);
                    // Remove it from the list if it exists but the new value is false
                    if (!val && index !== -1) {
                        filtered.splice(index, 1);
                    }

                    // Add it to the list if it isn't in there and the new value is true
                    if (val && index === -1) {
                        filtered.push(element);
                    }
                };

                // a can.compute that executes the callback
                var compute = can.compute(function () {
                    return callback(element, self.indexOf(element), self);
                });

                // Update the filtered list on any compute change
                compute.bind('change', binder);
                // Call binder explicitly for the initial list
                binder(null, compute());
            };

            // We also want to know when something gets added to our original list
            this.bind('add', function (ev, data, index) {
                can.each(data, function (element, i) {
                    // Call the generator for each newly added element
                    // The index is the start index + the loop index
                    generator(element, index + i);
                });
            });

            // Removed items should be removed from both lists
            this.bind('remove', function (ev, data, index) {
                can.each(data, function (element, i) {
                    var index = filtered.indexOf(element);
                    if (index !== -1) {
                        filtered.splice(index, 1);
                    }
                });
            });

            // Run the generator for each list element
            this.forEach(generator);

            return filtered;
        },

        map: function (callback) {
            var mapped = new can.Observe.List();
            var self = this;
            // Again, lets run a generator function
            var generator = function (element, index) {
                // The can.compute for the mapping
                var compute = can.compute(function () {
                    return callback(element, index, self);
                });

                compute.bind('change', function (ev, val) {
                    // On change, replace the current value with the new one
                    mapped.splice(index, 1, val);
                });

                mapped.splice(index, 0, compute());
            }

            this.forEach(generator);

            // We also want to know when something gets added to our original list
            this.bind('add', function (ev, data, index) {
                can.each(data, function (element, i) {
                    // Call the generator for each newly added element
                    // The index is the start index + the loop index
                    generator(element, index + i);
                });
            });

            this.bind('remove', function (ev, data, index) {
                // The indices in the mapped list are the same so lets just splice it out
                mapped.splice(index, data.length);
            })

            return mapped;
        }


    });

    return can.Observe.List;
});