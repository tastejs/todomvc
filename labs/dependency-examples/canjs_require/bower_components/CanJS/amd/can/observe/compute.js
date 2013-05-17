/*!
* CanJS - 1.1.5 (2013-03-27)
* http://canjs.us/
* Copyright (c) 2013 Bitovi
* Licensed MIT
*/
define(['can/util/library'], function (can) {

    // returns the
    // - observes and attr methods are called by func
    // - the value returned by func
    // ex: `{value: 100, observed: [{obs: o, attr: "completed"}]}`
    var getValueAndObserved = function (func, self) {

        var oldReading;
        if (can.Observe) {
            // Set a callback on can.Observe to know
            // when an attr is read.
            // Keep a reference to the old reader
            // if there is one.  This is used
            // for nested live binding.
            oldReading = can.Observe.__reading;
            can.Observe.__reading = function (obj, attr) {
                // Add the observe and attr that was read
                // to `observed`
                observed.push({
                    obj: obj,
                    attr: attr
                });
            };
        }

        var observed = [],
            // Call the "wrapping" function to get the value. `observed`
            // will have the observe/attribute pairs that were read.
            value = func.call(self);

        // Set back so we are no longer reading.
        if (can.Observe) {
            can.Observe.__reading = oldReading;
        }
        return {
            value: value,
            observed: observed
        };
    },
        // Calls `callback(newVal, oldVal)` everytime an observed property
        // called within `getterSetter` is changed and creates a new result of `getterSetter`.
        // Also returns an object that can teardown all event handlers.
        computeBinder = function (getterSetter, context, callback, computeState) {
            // track what we are observing
            var observing = {},
                // a flag indicating if this observe/attr pair is already bound
                matched = true,
                // the data to return 
                data = {
                    // we will maintain the value while live-binding is taking place
                    value: undefined,
                    // a teardown method that stops listening
                    teardown: function () {
                        for (var name in observing) {
                            var ob = observing[name];
                            ob.observe.obj.unbind(ob.observe.attr, onchanged);
                            delete observing[name];
                        }
                    }
                },
                batchNum;

            // when a property value is changed
            var onchanged = function (ev) {
                // If the compute is no longer bound (because the same change event led to an unbind)
                // then do not call getValueAndBind, or we will leak bindings.
                if (computeState && !computeState.bound) {
                    return;
                }
                if (ev.batchNum === undefined || ev.batchNum !== batchNum) {
                    // store the old value
                    var oldValue = data.value,
                        // get the new value
                        newvalue = getValueAndBind();
                    // update the value reference (in case someone reads)
                    data.value = newvalue;
                    // if a change happened
                    if (newvalue !== oldValue) {
                        callback(newvalue, oldValue);
                    }
                    batchNum = batchNum = ev.batchNum;
                }


            };

            // gets the value returned by `getterSetter` and also binds to any attributes
            // read by the call
            var getValueAndBind = function () {
                var info = getValueAndObserved(getterSetter, context),
                    newObserveSet = info.observed;

                var value = info.value;
                matched = !matched;

                // go through every attribute read by this observe
                can.each(newObserveSet, function (ob) {
                    // if the observe/attribute pair is being observed
                    if (observing[ob.obj._cid + "|" + ob.attr]) {
                        // mark at as observed
                        observing[ob.obj._cid + "|" + ob.attr].matched = matched;
                    } else {
                        // otherwise, set the observe/attribute on oldObserved, marking it as being observed
                        observing[ob.obj._cid + "|" + ob.attr] = {
                            matched: matched,
                            observe: ob
                        };
                        ob.obj.bind(ob.attr, onchanged);
                    }
                });

                // Iterate through oldObserved, looking for observe/attributes
                // that are no longer being bound and unbind them
                for (var name in observing) {
                    var ob = observing[name];
                    if (ob.matched !== matched) {
                        ob.observe.obj.unbind(ob.observe.attr, onchanged);
                        delete observing[name];
                    }
                }
                return value;
            };
            // set the initial value
            data.value = getValueAndBind();
            data.isListening = !can.isEmptyObject(observing);
            return data;
        }

        // if no one is listening ... we can not calculate every time
        can.compute = function (getterSetter, context) {
            if (getterSetter && getterSetter.isComputed) {
                return getterSetter;
            }
            // get the value right away
            // TODO: eventually we can defer this until a bind or a read
            var computedData, bindings = 0,
                computed, canbind = true;
            if (typeof getterSetter === "function") {
                computed = function (value) {
                    if (value === undefined) {
                        // we are reading
                        if (computedData) {
                            // If another compute is calling this compute for the value,
                            // it needs to bind to this compute's change so it will re-compute
                            // and re-bind when this compute changes.
                            if (bindings && can.Observe.__reading) {
                                can.Observe.__reading(computed, 'change');
                            }
                            return computedData.value;
                        } else {
                            return getterSetter.call(context || this)
                        }
                    } else {
                        return getterSetter.apply(context || this, arguments)
                    }
                }

            } else {
                // we just gave it a value
                computed = function (val) {
                    if (val === undefined) {
                        // If observing, record that the value is being read.
                        if (can.Observe.__reading) {
                            can.Observe.__reading(computed, 'change');
                        }
                        return getterSetter;
                    } else {
                        var old = getterSetter;
                        getterSetter = val;
                        if (old !== val) {
                            can.Observe.triggerBatch(computed, "change", [val, old]);
                        }

                        return val;
                    }

                }
                canbind = false;
            }

            computed.isComputed = true;

            can.cid(computed, "compute")
            var computeState = {
                bound: false
            };

            computed.bind = function (ev, handler) {
                can.addEvent.apply(computed, arguments);
                if (bindings === 0 && canbind) {
                    computeState.bound = true;
                    // setup live-binding
                    computedData = computeBinder(getterSetter, context || this, function (newValue, oldValue) {
                        can.Observe.triggerBatch(computed, "change", [newValue, oldValue])
                    }, computeState);
                }
                bindings++;
            }

            computed.unbind = function (ev, handler) {
                can.removeEvent.apply(computed, arguments);
                bindings--;
                if (bindings === 0 && canbind) {
                    computedData.teardown();
                    computeState.bound = false;
                }

            };
            return computed;
        };
    can.compute.binder = computeBinder;
    return can.compute;
});