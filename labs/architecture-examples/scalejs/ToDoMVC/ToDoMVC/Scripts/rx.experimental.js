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
    
    // Aliases
    var Observable = Rx.Observable,
        observableProto = Observable.prototype,
        AnonymousObservable = Rx.Internals.AnonymousObservable,
        observableConcat = Observable.concat,
        observableDefer = Observable.defer,
        observableEmpty = Observable.empty,
        disposableEmpty = Rx.Disposable.empty,
        BinaryObserver = Rx.Internals.BinaryObserver,
        CompositeDisposable = Rx.CompositeDisposable,
        SerialDisposable = Rx.SerialDisposable,
        SingleAssignmentDisposable = Rx.SingleAssignmentDisposable,
        enumeratorCreate = Rx.Internals.Enumerator.create,
        Enumerable = Rx.Internals.Enumerable,
        enumerableForEach = Enumerable.forEach,
        immediateScheduler = Rx.Scheduler.immediate,
        currentThreadScheduler = Rx.Scheduler.currentThread,
        slice = Array.prototype.slice,
        AsyncSubject = Rx.AsyncSubject,
        Observer = Rx.Observer,
        inherits = Rx.Internals.inherits,
        addProperties = Rx.Internals.addProperties;

    // Utilities
    function nothing () { }
    function argsOrArray(args, idx) {
        return args.length === 1 && Array.isArray(args[idx]) ?
            args[idx] :
            slice.call(args);
    }

   function enumerableWhile(condition, source) {
        return new Enumerable(function () {
            var current;
            return enumeratorCreate(function () {
                if (condition()) {
                    current = source;
                    return true;
                }
                return false;
            }, function () { return current; });
        });
    }

     /**
     *  Returns an observable sequence that is the result of invoking the selector on the source sequence, without sharing subscriptions.
     *  This operator allows for a fluent style of writing queries that use the same sequence multiple times.
     *
     * @param {Function} selector Selector function which can use the source sequence as many times as needed, without sharing subscriptions to the source sequence.
     * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source sequence within a selector function.
     */
    observableProto.letBind = observableProto['let'] = function (func) {
        return func(this);
    };

     /**
     *  Determines whether an observable collection contains values. There is an alias for this method called 'ifThen' for browsers <IE9
     *  
     * @example
     *  1 - res = Rx.Observable.if(condition, obs1);
     *  2 - res = Rx.Observable.if(condition, obs1, obs2);
     *  3 - res = Rx.Observable.if(condition, obs1, scheduler);
     * @param {Function} condition The condition which determines if the thenSource or elseSource will be run.
     * @param {Observable} thenSource The observable sequence that will be run if the condition function returns true.
     * @param {Observable} [elseSource] The observable sequence that will be run if the condition function returns false. If this is not provided, it defaults to Rx.Observabe.Empty with the specified scheduler.  
     * @returns {Observable} An observable sequence which is either the thenSource or elseSource.
     */
    Observable['if'] = Observable.ifThen = function (condition, thenSource, elseSourceOrScheduler) {
        return observableDefer(function () {
            elseSourceOrScheduler || (elseSourceOrScheduler = observableEmpty());
            if (elseSourceOrScheduler.now) {
                var scheduler = elseSourceOrScheduler;
                elseSourceOrScheduler = observableEmpty(scheduler);
            }
            return condition() ? thenSource : elseSourceOrScheduler;
        });
    };

     /**
     *  Concatenates the observable sequences obtained by running the specified result selector for each element in source.
     * There is an alias for this method called 'forIn' for browsers <IE9
     * @param {Array} sources An array of values to turn into an observable sequence.
     * @param {Function} resultSelector A function to apply to each item in the sources array to turn it into an observable sequence.
     * @returns {Observable} An observable sequence from the concatenated observable sequences.  
     */ 
    Observable['for'] = Observable.forIn = function (sources, resultSelector) {
        return enumerableForEach(sources, resultSelector).concat();
    };

     /**
     *  Repeats source as long as condition holds emulating a while loop.
     * There is an alias for this method called 'whileDo' for browsers <IE9
     *
     * @param {Function} condition The condition which determines if the source will be repeated.
     * @param {Observable} source The observable sequence that will be run if the condition function returns true.
     * @returns {Observable} An observable sequence which is repeated as long as the condition holds.  
     */
    var observableWhileDo = Observable['while'] = Observable.whileDo = function (condition, source) {
        return enumerableWhile(condition, source).concat();
    };

     /**
     *  Repeats source as long as condition holds emulating a do while loop.
     *
     * @param {Function} condition The condition which determines if the source will be repeated.
     * @param {Observable} source The observable sequence that will be run if the condition function returns true.
     * @returns {Observable} An observable sequence which is repeated as long as the condition holds. 
     */ 
    observableProto.doWhile = function (condition) {
        return observableConcat([this, observableWhileDo(condition, this)]);
    };

     /**
     *  Uses selector to determine which source in sources to use.
     *  There is an alias 'switchCase' for browsers <IE9.
     *  
     * @example
     *  1 - res = Rx.Observable.case(selector, { '1': obs1, '2': obs2 });
     *  1 - res = Rx.Observable.case(selector, { '1': obs1, '2': obs2 }, obs0);
     *  1 - res = Rx.Observable.case(selector, { '1': obs1, '2': obs2 }, scheduler);
     * 
     * @param {Function} selector The function which extracts the value for to test in a case statement.
     * @param {Array} sources A object which has keys which correspond to the case statement labels.
     * @param {Observable} [elseSource] The observable sequence that will be run if the sources are not matched. If this is not provided, it defaults to Rx.Observabe.Empty with the specified scheduler.
     *       
     * @returns {Observable} An observable sequence which is determined by a case statement.  
     */
    Observable['case'] = Observable.switchCase = function (selector, sources, defaultSourceOrScheduler) {
        return observableDefer(function () {
            defaultSourceOrScheduler || (defaultSourceOrScheduler = observableEmpty());
            if (defaultSourceOrScheduler.now) {
                var scheduler = defaultSourceOrScheduler;
                defaultSourceOrScheduler = observableEmpty(scheduler);
            }
            var result = sources[selector()];
            return result !== undefined ? result : defaultSourceOrScheduler;
        });
    };

     /**
     *  Expands an observable sequence by recursively invoking selector.
     *  
     * @param {Function} selector Selector function to invoke for each produced element, resulting in another sequence to which the selector will be invoked recursively again.
     * @param {Scheduler} [scheduler] Scheduler on which to perform the expansion. If not provided, this defaults to the current thread scheduler.
     * @returns {Observable} An observable sequence containing all the elements produced by the recursive expansion.
     */
    observableProto.expand = function (selector, scheduler) {
        scheduler || (scheduler = immediateScheduler);
        var source = this;
        return new AnonymousObservable(function (observer) {
            var q = [],
                m = new SerialDisposable(),
                d = new CompositeDisposable(m),
                activeCount = 0,
                isAcquired = false;

            var ensureActive = function () {
                var isOwner = false;
                if (q.length > 0) {
                    isOwner = !isAcquired;
                    isAcquired = true;
                }
                if (isOwner) {
                    m.setDisposable(scheduler.scheduleRecursive(function (self) {
                        var work;
                        if (q.length > 0) {
                            work = q.shift();
                        } else {
                            isAcquired = false;
                            return;
                        }
                        var m1 = new SingleAssignmentDisposable();
                        d.add(m1);
                        m1.setDisposable(work.subscribe(function (x) {
                            observer.onNext(x);
                            var result = null;
                            try {
                                result = selector(x);
                            } catch (e) {
                                observer.onError(e);
                            }
                            q.push(result);
                            activeCount++;
                            ensureActive();
                        }, observer.onError.bind(observer), function () {
                            d.remove(m1);
                            activeCount--;
                            if (activeCount === 0) {
                                observer.onCompleted();
                            }
                        }));
                        self();
                    }));
                }
            };

            q.push(source);
            activeCount++;
            ensureActive();
            return d;
        });
    };

     /**
     *  Runs all observable sequences in parallel and collect their last elements.
     *  
     * @example
     *  1 - res = Rx.Observable.forkJoin([obs1, obs2]);
     *  1 - res = Rx.Observable.forkJoin(obs1, obs2, ...);  
     * @returns {Observable} An observable sequence with an array collecting the last elements of all the input sequences.
     */
    Observable.forkJoin = function () {
        var allSources = argsOrArray(arguments, 0);
        return new AnonymousObservable(function (subscriber) {
            var count = allSources.length;
            if (count === 0) {
                subscriber.onCompleted();
                return disposableEmpty;
            }
            var group = new CompositeDisposable(),
                finished = false,
                hasResults = new Array(count),
                hasCompleted = new Array(count),
                results = new Array(count);

            for (var idx = 0; idx < count; idx++) {
                (function (i) {
                    var source = allSources[i];
                    group.add(source.subscribe(function (value) {
                        if (!finished) {
                            hasResults[i] = true;
                            results[i] = value;
                        }
                    }, function (e) {
                        finished = true;
                        subscriber.onError(e);
                        group.dispose();
                    }, function () {
                        if (!finished) {
                            if (!hasResults[i]) {
                                subscriber.onCompleted();
                                return;
                            }
                            hasCompleted[i] = true;
                            for (var ix = 0; ix < count; ix++) {
                                if (!hasCompleted[ix]) {
                                    return;
                                }
                            }
                            finished = true;
                            subscriber.onNext(results);
                            subscriber.onCompleted();
                        }
                    }));
                })(idx);
            }

            return group;
        });
    };

     /**
     *  Runs two observable sequences in parallel and combines their last elemenets.
     *
     * @param {Observable} second Second observable sequence.
     * @param {Function} resultSelector Result selector function to invoke with the last elements of both sequences.
     * @returns {Observable} An observable sequence with the result of calling the selector function with the last elements of both input sequences.
     */
    observableProto.forkJoin = function (second, resultSelector) {
        var first = this;

        return new AnonymousObservable(function (observer) {
            var leftStopped = false, rightStopped = false,
                hasLeft = false, hasRight = false,
                lastLeft, lastRight,
                leftSubscription = new SingleAssignmentDisposable(), rightSubscription = new SingleAssignmentDisposable();
      
            leftSubscription.setDisposable(
                first.subscribe(function (left) {
                    hasLeft = true;
                    lastLeft = left;
                }, function (err) {
                    rightSubscription.dispose();
                    observer.onError(err);
                }, function () {
                    leftStopped = true;
                    if (rightStopped) {
                        if (!hasLeft) {
                            observer.onCompleted();
                        } else if (!hasRight) {
                            observer.onCompleted();
                        } else {
                            var result;
                            try {
                                result = resultSelector(lastLeft, lastRight);
                            } catch (e) {
                                observer.onError(e);
                                return;
                            }
                            observer.onNext(result);
                            observer.onCompleted();
                        }
                    }
                })
            );

            rightSubscription.setDisposable(
                second.subscribe(function (right) {
                    hasRight = true;
                    lastRight = right;
                }, function (err) {
                    leftSubscription.dispose();
                    observer.onError(err);
                }, function () {
                    rightStopped = true;
                    if (leftStopped) {
                        if (!hasLeft) {
                            observer.onCompleted();
                        } else if (!hasRight) {
                            observer.onCompleted();
                        } else {
                            var result;
                            try {
                                result = resultSelector(lastLeft, lastRight);
                            } catch (e) {
                                observer.onError(e);
                                return;
                            }
                            observer.onNext(result);
                            observer.onCompleted();
                        }
                    }
                })
            );

            return new CompositeDisposable(leftSubscription, rightSubscription);
        });
    };

    /**
     * Comonadic bind operator.
     * @param {Function} selector A transform function to apply to each element.
     * @param {Object} scheduler Scheduler used to execute the operation. If not specified, defaults to the ImmediateScheduler.
     * @returns {Observable} An observable sequence which results from the comonadic bind operation.
     */
    observableProto.manySelect = function (selector, scheduler) {
        scheduler || (scheduler = immediateScheduler);
        var source = this;
        return observableDefer(function () {
            var chain;

            return source
                .select(
                    function (x) {
                        var curr = new ChainObservable(x);
                        if (chain) {
                            chain.onNext(x);
                        }
                        chain = curr;

                        return curr;
                    })
                .doAction(
                    nothing,
                    function (e) {
                        if (chain) {
                            chain.onError(e);
                        }
                    },
                    function () {
                        if (chain) {
                            chain.onCompleted();
                        }
                    })
                .observeOn(scheduler)
                .select(function (x, i, o) { return selector(x, i, o); });
        });
    };

    var ChainObservable = (function (_super) {

        function subscribe (observer) {
            var self = this, g = new CompositeDisposable();
            g.add(currentThreadScheduler.schedule(function () {
                observer.onNext(self.head);
                g.add(self.tail.mergeObservable().subscribe(observer));
            }));

            return g;
        }

        inherits(ChainObservable, _super);

        function ChainObservable(head) {
            _super.call(this, subscribe);
            this.head = head;
            this.tail = new AsyncSubject();
        }

        addProperties(ChainObservable.prototype, Observer, {
            onCompleted: function () {
                this.onNext(Observable.empty());
            },
            onError: function (e) {
                this.onNext(Observable.throwException(e));
            },
            onNext: function (v) {
                this.tail.onNext(v);
                this.tail.onCompleted();
            }
        });

        return ChainObservable;

    }(Observable));

    return Rx;
}));