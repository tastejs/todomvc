// Copyright (c) Microsoft Open Technologies, Inc. All rights reserved. See License.txt in the project root for license information.

(function (root, factory) {
    var freeExports = typeof exports == 'object' && exports,
        freeModule = typeof module == 'object' && module && module.exports == freeExports && module,
        freeGlobal = typeof global == 'object' && global;
    if (freeGlobal.global === freeGlobal) {
        window = freeGlobal;
    }

    // Because of build optimizers
    if (typeof define === 'function' && define.amd) {
        define(['rx', 'exports'], function (Rx, exports) {
            root.Rx = factory(root, exports, Rx);
            return root.Rx;
        });
    } else if (typeof module === 'object' && module && module.exports === freeExports) {
        module.exports = factory(root, module.exports, require('./rx'));
    } else {
        root.Rx = factory(root, {}, root.Rx);
    }
}(this, function (global, exp, Rx, undefined) {
    
    // Refernces
    var Observable = Rx.Observable,
        observableProto = Observable.prototype,
        AnonymousObservable = Rx.Internals.AnonymousObservable,
        observableDefer = Observable.defer,
        observableEmpty = Observable.empty,
        observableNever = Observable.never,
        observableThrow = Observable.throwException,
        observableFromArray = Observable.fromArray,
        timeoutScheduler = Rx.Scheduler.timeout,
        SingleAssignmentDisposable = Rx.SingleAssignmentDisposable,
        SerialDisposable = Rx.SerialDisposable,
        CompositeDisposable = Rx.CompositeDisposable,
        RefCountDisposable = Rx.RefCountDisposable,
        Subject = Rx.Subject,
        BinaryObserver = Rx.Internals.BinaryObserver,
        addRef = Rx.Internals.addRef,
        normalizeTime = Rx.Scheduler.normalize;

    function observableTimerDate(dueTime, scheduler) {
        return new AnonymousObservable(function (observer) {
            return scheduler.scheduleWithAbsolute(dueTime, function () {
                observer.onNext(0);
                observer.onCompleted();
            });
        });
    }

    function observableTimerDateAndPeriod(dueTime, period, scheduler) {
        var p = normalizeTime(period);
        return new AnonymousObservable(function (observer) {
            var count = 0, d = dueTime;
            return scheduler.scheduleRecursiveWithAbsolute(d, function (self) {
                var now;
                if (p > 0) {
                    now = scheduler.now();
                    d = d + p;
                    if (d <= now) {
                        d = now + p;
                    }
                }
                observer.onNext(count++);
                self(d);
            });
        });
    }

    function observableTimerTimeSpan(dueTime, scheduler) {
        var d = normalizeTime(dueTime);
        return new AnonymousObservable(function (observer) {
            return scheduler.scheduleWithRelative(d, function () {
                observer.onNext(0);
                observer.onCompleted();
            });
        });
    }

    function observableTimerTimeSpanAndPeriod(dueTime, period, scheduler) {
        if (dueTime === period) {
            return new AnonymousObservable(function (observer) {
                return scheduler.schedulePeriodicWithState(0, period, function (count) {
                    observer.onNext(count);
                    return count + 1;
                });
            });
        }
        return observableDefer(function () {
            return observableTimerDateAndPeriod(scheduler.now() + dueTime, period, scheduler);
        });
    }

    /**
     *  Returns an observable sequence that produces a value after each period.
     *  
     * @example
     *  1 - res = Rx.Observable.interval(1000);
     *  2 - res = Rx.Observable.interval(1000, Rx.Scheduler.timeout);
     *      
     * @param {Number} period Period for producing the values in the resulting sequence (specified as an integer denoting milliseconds).
     * @param {Scheduler} [scheduler] Scheduler to run the timer on. If not specified, Rx.Scheduler.timeout is used.
     * @returns {Observable} An observable sequence that produces a value after each period.
     */
    var observableinterval = Observable.interval = function (period, scheduler) {
        scheduler || (scheduler = timeoutScheduler);
        return observableTimerTimeSpanAndPeriod(period, period, scheduler);
    };

    /**
     *  Returns an observable sequence that produces a value after dueTime has elapsed and then after each period.
     *  
     * @example
     *  1 - res = Rx.Observable.timer(new Date());
     *  2 - res = Rx.Observable.timer(new Date(), 1000);
     *  3 - res = Rx.Observable.timer(new Date(), Rx.Scheduler.timeout);
     *  4 - res = Rx.Observable.timer(new Date(), 1000, Rx.Scheduler.timeout);
     *  
     *  5 - res = Rx.Observable.timer(5000);
     *  6 - res = Rx.Observable.timer(5000, 1000);
     *  7 - res = Rx.Observable.timer(5000, Rx.Scheduler.timeout);
     *  8 - res = Rx.Observable.timer(5000, 1000, Rx.Scheduler.timeout);
     *  
     * @param {Number} dueTime Absolute (specified as a Date object) or relative time (specified as an integer denoting milliseconds) at which to produce the first value.
     * @param {Mixed} [periodOrScheduler]  Period to produce subsequent values (specified as an integer denoting milliseconds), or the scheduler to run the timer on. If not specified, the resulting timer is not recurring.
     * @param {Scheduler} [scheduler]  Scheduler to run the timer on. If not specified, the timeout scheduler is used.
     * @returns {Observable} An observable sequence that produces a value after due time has elapsed and then each period.
     */
    var observableTimer = Observable.timer = function (dueTime, periodOrScheduler, scheduler) {
        var period;
        scheduler || (scheduler = timeoutScheduler);
        if (periodOrScheduler !== undefined && typeof periodOrScheduler === 'number') {
            period = periodOrScheduler;
        } else if (periodOrScheduler !== undefined && typeof periodOrScheduler === 'object') {
            scheduler = periodOrScheduler;
        }
        if (dueTime instanceof Date && period === undefined) {
            return observableTimerDate(dueTime.getTime(), scheduler);
        }
        if (dueTime instanceof Date && period !== undefined) {
            period = periodOrScheduler;
            return observableTimerDateAndPeriod(dueTime.getTime(), period, scheduler);
        }
        if (period === undefined) {
            return observableTimerTimeSpan(dueTime, scheduler);
        }
        return observableTimerTimeSpanAndPeriod(dueTime, period, scheduler);
    };

    function observableDelayTimeSpan(dueTime, scheduler) {
        var source = this;
        return new AnonymousObservable(function (observer) {
            var active = false,
                cancelable = new SerialDisposable(),
                exception = null,
                q = [],
                running = false,
                subscription;
            subscription = source.materialize().timestamp(scheduler).subscribe(function (notification) {
                var d, shouldRun;
                if (notification.value.kind === 'E') {
                    q = [];
                    q.push(notification);
                    exception = notification.value.exception;
                    shouldRun = !running;
                } else {
                    q.push({ value: notification.value, timestamp: notification.timestamp + dueTime });
                    shouldRun = !active;
                    active = true;
                }
                if (shouldRun) {
                    if (exception !== null) {
                        observer.onError(exception);
                    } else {
                        d = new SingleAssignmentDisposable();
                        cancelable.setDisposable(d);
                        d.setDisposable(scheduler.scheduleRecursiveWithRelative(dueTime, function (self) {
                            var e, recurseDueTime, result, shouldRecurse;
                            if (exception !== null) {
                                return;
                            }
                            running = true;
                            do {
                                result = null;
                                if (q.length > 0 && q[0].timestamp - scheduler.now() <= 0) {
                                    result = q.shift().value;
                                }
                                if (result !== null) {
                                    result.accept(observer);
                                }
                            } while (result !== null);
                            shouldRecurse = false;
                            recurseDueTime = 0;
                            if (q.length > 0) {
                                shouldRecurse = true;
                                recurseDueTime = Math.max(0, q[0].timestamp - scheduler.now());
                            } else {
                                active = false;
                            }
                            e = exception;
                            running = false;
                            if (e !== null) {
                                observer.onError(e);
                            } else if (shouldRecurse) {
                                self(recurseDueTime);
                            }
                        }));
                    }
                }
            });
            return new CompositeDisposable(subscription, cancelable);
        });
    }

    function observableDelayDate(dueTime, scheduler) {
        var self = this;
        return observableDefer(function () {
            var timeSpan = dueTime - scheduler.now();
            return observableDelayTimeSpan.call(self, timeSpan, scheduler);
        });
    }

    /**
     *  Time shifts the observable sequence by dueTime. The relative time intervals between the values are preserved.
     *  
     * @example
     *  1 - res = Rx.Observable.delay(new Date());
     *  2 - res = Rx.Observable.delay(new Date(), Rx.Scheduler.timeout);
     *  
     *  3 - res = Rx.Observable.delay(5000);
     *  4 - res = Rx.Observable.delay(5000, 1000, Rx.Scheduler.timeout);
     * @memberOf Observable#
     * @param {Number} dueTime Absolute (specified as a Date object) or relative time (specified as an integer denoting milliseconds) by which to shift the observable sequence.
     * @param {Scheduler} [scheduler] Scheduler to run the delay timers on. If not specified, the timeout scheduler is used.
     * @returns {Observable} Time-shifted sequence.
     */
    observableProto.delay = function (dueTime, scheduler) {
        scheduler || (scheduler = timeoutScheduler);
        return dueTime instanceof Date ?
            observableDelayDate.call(this, dueTime.getTime(), scheduler) :
            observableDelayTimeSpan.call(this, dueTime, scheduler);
    };

    /**
     *  Ignores values from an observable sequence which are followed by another value before dueTime.
     *  
     * @example
     *  1 - res = source.throttle(5000); // 5 seconds
     *  2 - res = source.throttle(5000, scheduler);        
     * 
     * @param {Number} dueTime Duration of the throttle period for each value (specified as an integer denoting milliseconds).
     * @param {Scheduler} [scheduler]  Scheduler to run the throttle timers on. If not specified, the timeout scheduler is used.
     * @returns {Observable} The throttled sequence.
     */
    observableProto.throttle = function (dueTime, scheduler) {
        scheduler || (scheduler = timeoutScheduler);
        var source = this;
        return this.throttleWithSelector(function () { return observableTimer(dueTime, scheduler); })
    };

    /**
     *  Projects each element of an observable sequence into zero or more windows which are produced based on timing information.
     *  
     * @example
     *  1 - res = xs.windowWithTime(1000, scheduler); // non-overlapping segments of 1 second
     *  2 - res = xs.windowWithTime(1000, 500 , scheduler); // segments of 1 second with time shift 0.5 seconds
     *      
     * @param {Number} timeSpan Length of each window (specified as an integer denoting milliseconds).
     * @param {Mixed} [timeShiftOrScheduler]  Interval between creation of consecutive windows (specified as an integer denoting milliseconds), or an optional scheduler parameter. If not specified, the time shift corresponds to the timeSpan parameter, resulting in non-overlapping adjacent windows.
     * @param {Scheduler} [scheduler]  Scheduler to run windowing timers on. If not specified, the timeout scheduler is used.
     * @returns {Observable} An observable sequence of windows.
     */
    observableProto.windowWithTime = function (timeSpan, timeShiftOrScheduler, scheduler) {
        var source = this, timeShift;
        if (timeShiftOrScheduler === undefined) {
            timeShift = timeSpan;
        }
        if (scheduler === undefined) {
            scheduler = timeoutScheduler;
        }
        if (typeof timeShiftOrScheduler === 'number') {
            timeShift = timeShiftOrScheduler;
        } else if (typeof timeShiftOrScheduler === 'object') {
            timeShift = timeSpan;
            scheduler = timeShiftOrScheduler;
        }
        return new AnonymousObservable(function (observer) {
            var groupDisposable,
                nextShift = timeShift,
                nextSpan = timeSpan,
                q = [],
                refCountDisposable,
                timerD = new SerialDisposable(),
                totalTime = 0;
                groupDisposable = new CompositeDisposable(timerD),
                refCountDisposable = new RefCountDisposable(groupDisposable);

             function createTimer () {
                var m = new SingleAssignmentDisposable(),
                    isSpan = false,
                    isShift = false;
                timerD.setDisposable(m);
                if (nextSpan === nextShift) {
                    isSpan = true;
                    isShift = true;
                } else if (nextSpan < nextShift) {
                    isSpan = true;
                } else {
                    isShift = true;
                }
                var newTotalTime = isSpan ? nextSpan : nextShift,
                    ts = newTotalTime - totalTime;
                totalTime = newTotalTime;
                if (isSpan) {
                    nextSpan += timeShift;
                }
                if (isShift) {
                    nextShift += timeShift;
                }
                m.setDisposable(scheduler.scheduleWithRelative(ts, function () {
                    var s;
                    if (isShift) {
                        s = new Subject();
                        q.push(s);
                        observer.onNext(addRef(s, refCountDisposable));
                    }
                    if (isSpan) {
                        s = q.shift();
                        s.onCompleted();
                    }
                    createTimer();
                }));
            };
            q.push(new Subject());
            observer.onNext(addRef(q[0], refCountDisposable));
            createTimer();
            groupDisposable.add(source.subscribe(function (x) {
                var i, s;
                for (i = 0; i < q.length; i++) {
                    s = q[i];
                    s.onNext(x);
                }
            }, function (e) {
                var i, s;
                for (i = 0; i < q.length; i++) {
                    s = q[i];
                    s.onError(e);
                }
                observer.onError(e);
            }, function () {
                var i, s;
                for (i = 0; i < q.length; i++) {
                    s = q[i];
                    s.onCompleted();
                }
                observer.onCompleted();
            }));
            return refCountDisposable;
        });
    };

    /**
     *  Projects each element of an observable sequence into a window that is completed when either it's full or a given amount of time has elapsed.
     *  @example
     *  1 - res = source.windowWithTimeOrCount(5000, 50); // 5s or 50 items
     *  2 - res = source.windowWithTimeOrCount(5000, 50, scheduler); //5s or 50 items
     *      
     * @memberOf Observable#
     * @param {Number} timeSpan Maximum time length of a window.
     * @param {Number} count Maximum element count of a window.
     * @param {Scheduler} [scheduler]  Scheduler to run windowing timers on. If not specified, the timeout scheduler is used.
     * @returns {Observable} An observable sequence of windows.
     */
    observableProto.windowWithTimeOrCount = function (timeSpan, count, scheduler) {
        var source = this;
        scheduler || (scheduler = timeoutScheduler);
        return new AnonymousObservable(function (observer) {
            var createTimer,
                groupDisposable,
                n = 0,
                refCountDisposable,
                s,
                timerD = new SerialDisposable(),
                windowId = 0;
            groupDisposable = new CompositeDisposable(timerD);
            refCountDisposable = new RefCountDisposable(groupDisposable);
            createTimer = function (id) {
                var m = new SingleAssignmentDisposable();
                timerD.setDisposable(m);
                m.setDisposable(scheduler.scheduleWithRelative(timeSpan, function () {
                    var newId;
                    if (id !== windowId) {
                        return;
                    }
                    n = 0;
                    newId = ++windowId;
                    s.onCompleted();
                    s = new Subject();
                    observer.onNext(addRef(s, refCountDisposable));
                    createTimer(newId);
                }));
            };
            s = new Subject();
            observer.onNext(addRef(s, refCountDisposable));
            createTimer(0);
            groupDisposable.add(source.subscribe(function (x) {
                var newId = 0, newWindow = false;
                s.onNext(x);
                n++;
                if (n === count) {
                    newWindow = true;
                    n = 0;
                    newId = ++windowId;
                    s.onCompleted();
                    s = new Subject();
                    observer.onNext(addRef(s, refCountDisposable));
                }
                if (newWindow) {
                    createTimer(newId);
                }
            }, function (e) {
                s.onError(e);
                observer.onError(e);
            }, function () {
                s.onCompleted();
                observer.onCompleted();
            }));
            return refCountDisposable;
        });
    };

    /**
     *  Projects each element of an observable sequence into zero or more buffers which are produced based on timing information.
     *  
     * @example
     *  1 - res = xs.bufferWithTime(1000, scheduler); // non-overlapping segments of 1 second
     *  2 - res = xs.bufferWithTime(1000, 500, scheduler; // segments of 1 second with time shift 0.5 seconds
     *      
     * @param {Number} timeSpan Length of each buffer (specified as an integer denoting milliseconds).
     * @param {Mixed} [timeShiftOrScheduler]  Interval between creation of consecutive buffers (specified as an integer denoting milliseconds), or an optional scheduler parameter. If not specified, the time shift corresponds to the timeSpan parameter, resulting in non-overlapping adjacent buffers.
     * @param {Scheduler} [scheduler]  Scheduler to run buffer timers on. If not specified, the timeout scheduler is used.
     * @returns {Observable} An observable sequence of buffers.
     */
    observableProto.bufferWithTime = function (timeSpan, timeShiftOrScheduler, scheduler) {
        return this.windowWithTime.apply(this, arguments).selectMany(function (x) { return x.toArray(); });
    };

    /**
     *  Projects each element of an observable sequence into a buffer that is completed when either it's full or a given amount of time has elapsed.
     *  
     * @example
     *  1 - res = source.bufferWithTimeOrCount(5000, 50); // 5s or 50 items in an array 
     *  2 - res = source.bufferWithTimeOrCount(5000, 50, scheduler); // 5s or 50 items in an array
     *      
     * @param {Number} timeSpan Maximum time length of a buffer.
     * @param {Number} count Maximum element count of a buffer.
     * @param {Scheduler} [scheduler]  Scheduler to run bufferin timers on. If not specified, the timeout scheduler is used.
     * @returns {Observable} An observable sequence of buffers.
     */
    observableProto.bufferWithTimeOrCount = function (timeSpan, count, scheduler) {
        return this.windowWithTimeOrCount(timeSpan, count, scheduler).selectMany(function (x) {
            return x.toArray();
        });
    };

    /**
     *  Records the time interval between consecutive values in an observable sequence.
     *  
     * @example
     *  1 - res = source.timeInterval();
     *  2 - res = source.timeInterval(Rx.Scheduler.timeout);
     *      
     * @param [scheduler]  Scheduler used to compute time intervals. If not specified, the timeout scheduler is used.
     * @returns {Observable} An observable sequence with time interval information on values.
     */
    observableProto.timeInterval = function (scheduler) {
        var source = this;
        scheduler || (scheduler = timeoutScheduler);
        return observableDefer(function () {
            var last = scheduler.now();
            return source.select(function (x) {
                var now = scheduler.now(), span = now - last;
                last = now;
                return {
                    value: x,
                    interval: span
                };
            });
        });
    };

    /**
     *  Records the timestamp for each value in an observable sequence.
     *  
     * @example
     *  1 - res = source.timestamp(); // produces { value: x, timestamp: ts }
     *  2 - res = source.timestamp(Rx.Scheduler.timeout);
     *      
     * @param {Scheduler} [scheduler]  Scheduler used to compute timestamps. If not specified, the timeout scheduler is used.
     * @returns {Observable} An observable sequence with timestamp information on values.
     */
    observableProto.timestamp = function (scheduler) {
        scheduler || (scheduler = timeoutScheduler);
        return this.select(function (x) {
            return {
                value: x,
                timestamp: scheduler.now()
            };
        });
    };

    function sampleObservable(source, sampler) {
        
        return new AnonymousObservable(function (observer) {
            var atEnd, value, hasValue;

            function sampleSubscribe() {
                if (hasValue) {
                    hasValue = false;
                    observer.onNext(value);
                }
                if (atEnd) {
                    observer.onCompleted();
                }
            }

            return new CompositeDisposable(
                source.subscribe(function (newValue) {
                    hasValue = true;
                    value = newValue;
                }, observer.onError.bind(observer), function () {
                    atEnd = true;
                }),
                sampler.subscribe(sampleSubscribe, observer.onError.bind(observer), sampleSubscribe)
            );
        });
    }

    /**
     *  Samples the observable sequence at each interval.
     *  
     * @example
     *  1 - res = source.sample(sampleObservable); // Sampler tick sequence
     *  2 - res = source.sample(5000); // 5 seconds
     *  2 - res = source.sample(5000, Rx.Scheduler.timeout); // 5 seconds
     *      
     * @param {Mixed} intervalOrSampler Interval at which to sample (specified as an integer denoting milliseconds) or Sampler Observable.
     * @param {Scheduler} [scheduler]  Scheduler to run the sampling timer on. If not specified, the timeout scheduler is used.
     * @returns {Observable} Sampled observable sequence.
     */
    observableProto.sample = function (intervalOrSampler, scheduler) {
        scheduler || (scheduler = timeoutScheduler);
        if (typeof intervalOrSampler === 'number') {
            return sampleObservable(this, observableinterval(intervalOrSampler, scheduler));
        }
        return sampleObservable(this, intervalOrSampler);
    };

    /**
     *  Returns the source observable sequence or the other observable sequence if dueTime elapses.
     *  
     * @example
     *  1 - res = source.timeout(new Date()); // As a date
     *  2 - res = source.timeout(5000); // 5 seconds
     *  3 - res = source.timeout(new Date(), Rx.Observable.returnValue(42)); // As a date and timeout observable
     *  4 - res = source.timeout(5000, Rx.Observable.returnValue(42)); // 5 seconds and timeout observable
     *  5 - res = source.timeout(new Date(), Rx.Observable.returnValue(42), Rx.Scheduler.timeout); // As a date and timeout observable
     *  6 - res = source.timeout(5000, Rx.Observable.returnValue(42), Rx.Scheduler.timeout); // 5 seconds and timeout observable
     *      
     * @param {Number} dueTime Absolute (specified as a Date object) or relative time (specified as an integer denoting milliseconds) when a timeout occurs.
     * @param {Observable} [other]  Sequence to return in case of a timeout. If not specified, a timeout error throwing sequence will be used.
     * @param {Scheduler} [scheduler]  Scheduler to run the timeout timers on. If not specified, the timeout scheduler is used.
     * @returns {Observable} The source sequence switching to the other sequence in case of a timeout.
     */
    observableProto.timeout = function (dueTime, other, scheduler) {
        var schedulerMethod, source = this;
        other || (other = observableThrow(new Error('Timeout')));
        scheduler || (scheduler = timeoutScheduler);
        if (dueTime instanceof Date) {
            schedulerMethod = function (dt, action) {
                scheduler.scheduleWithAbsolute(dt, action);
            };
        } else {
            schedulerMethod = function (dt, action) {
                scheduler.scheduleWithRelative(dt, action);
            };
        }
        return new AnonymousObservable(function (observer) {
            var createTimer,
                id = 0,
                original = new SingleAssignmentDisposable(),
                subscription = new SerialDisposable(),
                switched = false,
                timer = new SerialDisposable();
            subscription.setDisposable(original);
            createTimer = function () {
                var myId = id;
                timer.setDisposable(schedulerMethod(dueTime, function () {
                    switched = id === myId;
                    var timerWins = switched;
                    if (timerWins) {
                        subscription.setDisposable(other.subscribe(observer));
                    }
                }));
            };
            createTimer();
            original.setDisposable(source.subscribe(function (x) {
                var onNextWins = !switched;
                if (onNextWins) {
                    id++;
                    observer.onNext(x);
                    createTimer();
                }
            }, function (e) {
                var onErrorWins = !switched;
                if (onErrorWins) {
                    id++;
                    observer.onError(e);
                }
            }, function () {
                var onCompletedWins = !switched;
                if (onCompletedWins) {
                    id++;
                    observer.onCompleted();
                }
            }));
            return new CompositeDisposable(subscription, timer);
        });
    };

    /**
     *  Generates an observable sequence by iterating a state from an initial state until the condition fails.
     *  
     * @example
     *  res = source.generateWithAbsoluteTime(0, 
     *      function (x) { return return true; }, 
     *      function (x) { return x + 1; }, 
     *      function (x) { return x; }, 
     *      function (x) { return new Date(); }
     *  });
     *      
     * @param {Mixed} initialState Initial state.
     * @param {Function} condition Condition to terminate generation (upon returning false).
     * @param {Function} iterate Iteration step function.
     * @param {Function} resultSelector Selector function for results produced in the sequence.
     * @param {Function} timeSelector Time selector function to control the speed of values being produced each iteration, returning Date values.
     * @param {Scheduler} [scheduler]  Scheduler on which to run the generator loop. If not specified, the timeout scheduler is used.
     * @returns {Observable} The generated sequence.
     */
    Observable.generateWithAbsoluteTime = function (initialState, condition, iterate, resultSelector, timeSelector, scheduler) {
        scheduler || (scheduler = timeoutScheduler);
        return new AnonymousObservable(function (observer) {
            var first = true,
                hasResult = false,
                result,
                state = initialState,
                time;
            return scheduler.scheduleRecursiveWithAbsolute(scheduler.now(), function (self) {
                if (hasResult) {
                    observer.onNext(result);
                }
                try {
                    if (first) {
                        first = false;
                    } else {
                        state = iterate(state);
                    }
                    hasResult = condition(state);
                    if (hasResult) {
                        result = resultSelector(state);
                        time = timeSelector(state);
                    }
                } catch (e) {
                    observer.onError(e);
                    return;
                }
                if (hasResult) {
                    self(time);
                } else {
                    observer.onCompleted();
                }
            });
        });
    };

    /**
     *  Generates an observable sequence by iterating a state from an initial state until the condition fails.
     * 
     * @example 
     *  res = source.generateWithRelativeTime(0, 
     *      function (x) { return return true; }, 
     *      function (x) { return x + 1; }, 
     *      function (x) { return x; }, 
     *      function (x) { return 500; }
     *  );
     *      
     * @param {Mixed} initialState Initial state.
     * @param {Function} condition Condition to terminate generation (upon returning false).
     * @param {Function} iterate Iteration step function.
     * @param {Function} resultSelector Selector function for results produced in the sequence.
     * @param {Function} timeSelector Time selector function to control the speed of values being produced each iteration, returning integer values denoting milliseconds.
     * @param {Scheduler} [scheduler]  Scheduler on which to run the generator loop. If not specified, the timeout scheduler is used.
     * @returns {Observable} The generated sequence.
     */
    Observable.generateWithRelativeTime = function (initialState, condition, iterate, resultSelector, timeSelector, scheduler) {
        scheduler || (scheduler = timeoutScheduler);
        return new AnonymousObservable(function (observer) {
            var first = true,
                hasResult = false,
                result,
                state = initialState,
                time;
            return scheduler.scheduleRecursiveWithRelative(0, function (self) {
                if (hasResult) {
                    observer.onNext(result);
                }
                try {
                    if (first) {
                        first = false;
                    } else {
                        state = iterate(state);
                    }
                    hasResult = condition(state);
                    if (hasResult) {
                        result = resultSelector(state);
                        time = timeSelector(state);
                    }
                } catch (e) {
                    observer.onError(e);
                    return;
                }
                if (hasResult) {
                    self(time);
                } else {
                    observer.onCompleted();
                }
            });
        });
    };

    /**
     *  Time shifts the observable sequence by delaying the subscription.
     *  
     * @example
     *  1 - res = source.delaySubscription(5000); // 5s
     *  2 - res = source.delaySubscription(5000, Rx.Scheduler.timeout); // 5 seconds
     *      
     * @param {Number} dueTime Absolute or relative time to perform the subscription at.
     * @param {Scheduler} [scheduler]  Scheduler to run the subscription delay timer on. If not specified, the timeout scheduler is used.
     * @returns {Observable} Time-shifted sequence.
     */
    observableProto.delaySubscription = function (dueTime, scheduler) {
        scheduler || (scheduler = timeoutScheduler);
        return this.delayWithSelector(observableTimer(dueTime, scheduler), function () { return observableEmpty(); });
    };

    /**
     *  Time shifts the observable sequence based on a subscription delay and a delay selector function for each element.
     *  
     * @example
     *  1 - res = source.delayWithSelector(function (x) { return Rx.Scheduler.timer(5000); }); // with selector only
     *  1 - res = source.delayWithSelector(Rx.Observable.timer(2000), function (x) { return Rx.Observable.timer(x); }); // with delay and selector
     *
     * @param {Observable} [subscriptionDelay]  Sequence indicating the delay for the subscription to the source. 
     * @param {Function} delayDurationSelector Selector function to retrieve a sequence indicating the delay for each given element.
     * @returns {Observable} Time-shifted sequence.
     */
    observableProto.delayWithSelector = function (subscriptionDelay, delayDurationSelector) {
        var source = this, subDelay, selector;
        if (typeof subscriptionDelay === 'function') {
            selector = subscriptionDelay;
        } else {
            subDelay = subscriptionDelay;
            selector = delayDurationSelector;
        }
        return new AnonymousObservable(function (observer) {
            var delays = new CompositeDisposable(), atEnd = false, done = function () {
                if (atEnd && delays.length === 0) {
                    observer.onCompleted();
                }
            }, subscription = new SerialDisposable(), start = function () {
                subscription.setDisposable(source.subscribe(function (x) {
                    var delay;
                    try {
                        delay = selector(x);
                    } catch (error) {
                        observer.onError(error);
                        return;
                    }
                    var d = new SingleAssignmentDisposable();
                    delays.add(d);
                    d.setDisposable(delay.subscribe(function () {
                        observer.onNext(x);
                        delays.remove(d);
                        done();
                    }, observer.onError.bind(observer), function () {
                        observer.onNext(x);
                        delays.remove(d);
                        done();
                    }));
                }, observer.onError.bind(observer), function () {
                    atEnd = true;
                    subscription.dispose();
                    done();
                }));
            };

            if (!subDelay) {
                start();
            } else {
                subscription.setDisposable(subDelay.subscribe(function () {
                    start();
                }, observer.onError.bind(observer), function () { start(); }));
            }

            return new CompositeDisposable(subscription, delays);
        });
    };

    /**
     *  Returns the source observable sequence, switching to the other observable sequence if a timeout is signaled.
     *  
     * @example
     *  1 - res = source.timeoutWithSelector(Rx.Observable.timer(500)); 
     *  2 - res = source.timeoutWithSelector(Rx.Observable.timer(500), function (x) { return Rx.Observable.timer(200); });
     *  3 - res = source.timeoutWithSelector(Rx.Observable.timer(500), function (x) { return Rx.Observable.timer(200); }, Rx.Observable.returnValue(42));
     *      
     * @param {Observable} [firstTimeout]  Observable sequence that represents the timeout for the first element. If not provided, this defaults to Observable.never().
     * @param {Function} [timeoutDurationSelector] Selector to retrieve an observable sequence that represents the timeout between the current element and the next element.
     * @param {Observable} [other]  Sequence to return in case of a timeout. If not provided, this is set to Observable.throwException(). 
     * @returns {Observable} The source sequence switching to the other sequence in case of a timeout.
     */
    observableProto.timeoutWithSelector = function (firstTimeout, timeoutdurationSelector, other) {
        if (arguments.length === 1) {
            timeoutdurationSelector = firstTimeout;
            var firstTimeout = observableNever();
        }
        other || (other = observableThrow(new Error('Timeout')));
        var source = this;
        return new AnonymousObservable(function (observer) {
            var subscription = new SerialDisposable(), timer = new SerialDisposable(), original = new SingleAssignmentDisposable();

            subscription.setDisposable(original);

            var id = 0, switched = false, setTimer = function (timeout) {
                var myId = id, timerWins = function () {
                    return id === myId;
                };
                var d = new SingleAssignmentDisposable();
                timer.setDisposable(d);
                d.setDisposable(timeout.subscribe(function () {
                    if (timerWins()) {
                        subscription.setDisposable(other.subscribe(observer));
                    }
                    d.dispose();
                }, function (e) {
                    if (timerWins()) {
                        observer.onError(e);
                    }
                }, function () {
                    if (timerWins()) {
                        subscription.setDisposable(other.subscribe(observer));
                    }
                }));
            };

            setTimer(firstTimeout);
            var observerWins = function () {
                var res = !switched;
                if (res) {
                    id++;
                }
                return res;
            };

            original.setDisposable(source.subscribe(function (x) {
                if (observerWins()) {
                    observer.onNext(x);
                    var timeout;
                    try {
                        timeout = timeoutdurationSelector(x);
                    } catch (e) {
                        observer.onError(e);
                        return;
                    }
                    setTimer(timeout);
                }
            }, function (e) {
                if (observerWins()) {
                    observer.onError(e);
                }
            }, function () {
                if (observerWins()) {
                    observer.onCompleted();
                }
            }));
            return new CompositeDisposable(subscription, timer);
        });
    };

    /**
     *  Ignores values from an observable sequence which are followed by another value within a computed throttle duration.
     *  
     * @example
     *  1 - res = source.delayWithSelector(function (x) { return Rx.Scheduler.timer(x + x); }); 
     * 
     * @param {Function} throttleDurationSelector Selector function to retrieve a sequence indicating the throttle duration for each given element.
     * @returns {Observable} The throttled sequence.
     */
    observableProto.throttleWithSelector = function (throttleDurationSelector) {
        var source = this;
        return new AnonymousObservable(function (observer) {
            var value, hasValue = false, cancelable = new SerialDisposable(), id = 0, subscription = source.subscribe(function (x) {
                var throttle;
                try {
                    throttle = throttleDurationSelector(x);
                } catch (e) {
                    observer.onError(e);
                    return;
                }
                hasValue = true;
                value = x;
                id++;
                var currentid = id, d = new SingleAssignmentDisposable();
                cancelable.setDisposable(d);
                d.setDisposable(throttle.subscribe(function () {
                    if (hasValue && id === currentid) {
                        observer.onNext(value);
                    }
                    hasValue = false;
                    d.dispose();
                }, observer.onError.bind(observer), function () {
                    if (hasValue && id === currentid) {
                        observer.onNext(value);
                    }
                    hasValue = false;
                    d.dispose();
                }));
            }, function (e) {
                cancelable.dispose();
                observer.onError(e);
                hasValue = false;
                id++;
            }, function () {
                cancelable.dispose();
                if (hasValue) {
                    observer.onNext(value);
                }
                observer.onCompleted();
                hasValue = false;
                id++;
            });
            return new CompositeDisposable(subscription, cancelable);
        });
    };

    /**
     *  Skips elements for the specified duration from the end of the observable source sequence, using the specified scheduler to run timers.
     *  
     *  1 - res = source.skipLastWithTime(5000);     
     *  2 - res = source.skipLastWithTime(5000, scheduler); 
     *      
     * @description
     *  This operator accumulates a queue with a length enough to store elements received during the initial duration window.
     *  As more elements are received, elements older than the specified duration are taken from the queue and produced on the
     *  result sequence. This causes elements to be delayed with duration.          
     * @param {Number} duration Duration for skipping elements from the end of the sequence.
     * @param {Scheduler} [scheduler]  Scheduler to run the timer on. If not specified, defaults to Rx.Scheduler.timeout
     * @returns {Observable} An observable sequence with the elements skipped during the specified duration from the end of the source sequence.
     */
    observableProto.skipLastWithTime = function (duration, scheduler) {
        scheduler || (scheduler = timeoutScheduler);
        var source = this;
        return new AnonymousObservable(function (observer) {
            var q = [];
            return source.subscribe(function (x) {
                var now = scheduler.now();
                q.push({ interval: now, value: x });
                while (q.length > 0 && now - q[0].interval >= duration) {
                    observer.onNext(q.shift().value);
                }
            }, observer.onError.bind(observer), function () {
                var now = scheduler.now();
                while (q.length > 0 && now - q[0].interval >= duration) {
                    observer.onNext(q.shift().value);
                }
                observer.onCompleted();
            });
        });
    };

    /**
     *  Returns elements within the specified duration from the end of the observable source sequence, using the specified schedulers to run timers and to drain the collected elements.
     *  
     * @example
     *  1 - res = source.takeLastWithTime(5000, [optional timer scheduler], [optional loop scheduler]); 
     * @description
     *  This operator accumulates a queue with a length enough to store elements received during the initial duration window.
     *  As more elements are received, elements older than the specified duration are taken from the queue and produced on the
     *  result sequence. This causes elements to be delayed with duration.    
     * @param {Number} duration Duration for taking elements from the end of the sequence.
     * @param {Scheduler} [timerScheduler]  Scheduler to run the timer on. If not specified, defaults to Rx.Scheduler.timeout.
     * @param {Scheduler} [loopScheduler]  Scheduler to drain the collected elements. If not specified, defaults to Rx.Scheduler.immediate.
     * @returns {Observable} An observable sequence with the elements taken during the specified duration from the end of the source sequence.
     */
    observableProto.takeLastWithTime = function (duration, timerScheduler, loopScheduler) {
        return this.takeLastBufferWithTime(duration, timerScheduler).selectMany(function (xs) { return observableFromArray(xs, loopScheduler); });
    };

    /**
     *  Returns an array with the elements within the specified duration from the end of the observable source sequence, using the specified scheduler to run timers.
     *  
     * @example
     *  1 - res = source.takeLastBufferWithTime(5000, [optional scheduler]); 
     * @description
     *  This operator accumulates a queue with a length enough to store elements received during the initial duration window.
     *  As more elements are received, elements older than the specified duration are taken from the queue and produced on the
     *  result sequence. This causes elements to be delayed with duration.   
     * @param {Number} duration Duration for taking elements from the end of the sequence.
     * @param {Scheduler} scheduler Scheduler to run the timer on. If not specified, defaults to Rx.Scheduler.timeout.
     * @returns {Observable} An observable sequence containing a single array with the elements taken during the specified duration from the end of the source sequence.
     */
    observableProto.takeLastBufferWithTime = function (duration, scheduler) {
        var source = this;
        scheduler || (scheduler = timeoutScheduler);
        return new AnonymousObservable(function (observer) {
            var q = [];

            return source.subscribe(function (x) {
                var now = scheduler.now();
                q.push({ interval: now, value: x });
                while (q.length > 0 && now - q[0].interval >= duration) {
                    q.shift();
                }
            }, observer.onError.bind(observer), function () {
                var now = scheduler.now(), res = [];
                while (q.length > 0) {
                    var next = q.shift();
                    if (now - next.interval <= duration) {
                        res.push(next.value);
                    }
                }

                observer.onNext(res);
                observer.onCompleted();
            });
        });
    };

    /**
     *  Takes elements for the specified duration from the start of the observable source sequence, using the specified scheduler to run timers.
     *  
     * @example
     *  1 - res = source.takeWithTime(5000,  [optional scheduler]); 
     * @description
     *  This operator accumulates a queue with a length enough to store elements received during the initial duration window.
     *  As more elements are received, elements older than the specified duration are taken from the queue and produced on the
     *  result sequence. This causes elements to be delayed with duration.    
     * @param {Number} duration Duration for taking elements from the start of the sequence.
     * @param {Scheduler} scheduler Scheduler to run the timer on. If not specified, defaults to Rx.Scheduler.timeout.
     * @returns {Observable} An observable sequence with the elements taken during the specified duration from the start of the source sequence.
     */
    observableProto.takeWithTime = function (duration, scheduler) {
        var source = this;
        scheduler || (scheduler = timeoutScheduler);
        return new AnonymousObservable(function (observer) {
            var t = scheduler.scheduleWithRelative(duration, function () {
                observer.onCompleted();
            });

            return new CompositeDisposable(t, source.subscribe(observer));
        });
    };

    /**
     *  Skips elements for the specified duration from the start of the observable source sequence, using the specified scheduler to run timers.
     *  
     * @example
     *  1 - res = source.skipWithTime(5000, [optional scheduler]); 
     *  
     * @description     
     *  Specifying a zero value for duration doesn't guarantee no elements will be dropped from the start of the source sequence.
     *  This is a side-effect of the asynchrony introduced by the scheduler, where the action that causes callbacks from the source sequence to be forwarded
     *  may not execute immediately, despite the zero due time.
     *  
     *  Errors produced by the source sequence are always forwarded to the result sequence, even if the error occurs before the duration.      
     * @param {Number} duration Duration for skipping elements from the start of the sequence.
     * @param {Scheduler} scheduler Scheduler to run the timer on. If not specified, defaults to Rx.Scheduler.timeout.
     * @returns {Observable} An observable sequence with the elements skipped during the specified duration from the start of the source sequence.
     */
    observableProto.skipWithTime = function (duration, scheduler) {
        var source = this;
        scheduler || (scheduler = timeoutScheduler);
        return new AnonymousObservable(function (observer) {
            var open = false,
                t = scheduler.scheduleWithRelative(duration, function () { open = true; }),
                d = source.subscribe(function (x) {
                    if (open) {
                        observer.onNext(x);
                    }
                }, observer.onError.bind(observer), observer.onCompleted.bind(observer));

            return new CompositeDisposable(t, d);
        });
    };

    /**
     *  Skips elements from the observable source sequence until the specified start time, using the specified scheduler to run timers.
     *  Errors produced by the source sequence are always forwarded to the result sequence, even if the error occurs before the start time>.
     *  
     * @examples
     *  1 - res = source.skipUntilWithTime(new Date(), [optional scheduler]);         
     * @param startTime Time to start taking elements from the source sequence. If this value is less than or equal to Date(), no elements will be skipped.
     * @param scheduler Scheduler to run the timer on. If not specified, defaults to Rx.Scheduler.timeout.
     * @returns {Observable} An observable sequence with the elements skipped until the specified start time. 
     */
    observableProto.skipUntilWithTime = function (startTime, scheduler) {
        scheduler || (scheduler = timeoutScheduler);
        var source = this;
        return new AnonymousObservable(function (observer) {
            var open = false,
                t = scheduler.scheduleWithAbsolute(startTime, function () { open = true; }),
                d = source.subscribe(function (x) {
                    if (open) {
                        observer.onNext(x);
                    }
                }, observer.onError.bind(observer), observer.onCompleted.bind(observer));

            return new CompositeDisposable(t, d);
        });
    };

    /**
     *  Takes elements for the specified duration until the specified end time, using the specified scheduler to run timers.
     *  
     * @example
     *  1 - res = source.takeUntilWithTime(new Date(), [optional scheduler]);   
     * @param {Number} endTime Time to stop taking elements from the source sequence. If this value is less than or equal to new Date(), the result stream will complete immediately.
     * @param {Scheduler} scheduler Scheduler to run the timer on.
     * @returns {Observable} An observable sequence with the elements taken until the specified end time.
     */
    observableProto.takeUntilWithTime = function (endTime, scheduler) {
        scheduler || (scheduler = timeoutScheduler);
        var source = this;
        return new AnonymousObservable(function (observer) {
            return new CompositeDisposable(scheduler.scheduleWithAbsolute(endTime, function () {
                observer.onCompleted();
            }),  source.subscribe(observer));
        });
    };

    return Rx;
}));