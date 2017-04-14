/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('app-transitions-native', function (Y, NAME) {

/**
Provides the implementation of view transitions for `Y.App.Transitions` in
browsers which support native CSS3 transitions.

@module app
@submodule app-transitions-native
@since 3.5.0
**/

var AppTransitions = Y.App.Transitions;

/**
Provides the implementation of view transitions for `Y.App.Transitions` in
browsers which support native CSS3 transitions.

When this module is used, `Y.App.TransitionsNative` will automatically mix
itself in to `Y.App`.

@class App.TransitionsNative
@extensionfor App
@since 3.5.0
**/
function AppTransitionsNative() {}

AppTransitionsNative.prototype = {
    // -- Protected Properties -------------------------------------------------

    /**
    Whether this app is currently transitioning its `activeView`.

    @property _transitioning
    @type Boolean
    @default false
    @protected
    @since 3.5.0
    **/

    /**
    A queue that holds pending calls to this app's `_uiTransitionActiveView()`
    method.

    @property _viewTransitionQueue
    @type Array
    @default []
    @protected
    @since 3.5.0
    **/

    // -- Lifecycle Methods ----------------------------------------------------

    initializer: function () {
        this._transitioning       = false;
        this._viewTransitionQueue = [];

        // TODO: Consider the AOP approach that `Plugin.WidgetAnim` uses.
        Y.Do.before(this._queueActiveView, this, '_uiSetActiveView');
    },

    // -- Protected Methods ----------------------------------------------------

    /**
    Dequeues any pending calls to `_uiTransitionActiveView()`.

    **Note:** When there is more than one queued transition, only the most
    recent `activeView` change will be visually transitioned, while the others
    will have their `transition` option overridden to `false`.

    @method _dequeueActiveView
    @protected
    @since 3.5.0
    **/
    _dequeueActiveView: function () {
        var queue      = this._viewTransitionQueue,
            transition = queue.shift(),
            options;

        if (transition) {
            // When items are still left in the queue, override the transition
            // so it does not run.
            if (queue.length) {
                // Overrides `transition` option and splices in the new options.
                options = Y.merge(transition[2], {transition: false});
                transition.splice(2, 1, options);
            }

            this._uiTransitionActiveView.apply(this, transition);
        }
    },

    /**
    Returns an object containing a named fx for both `viewIn` and `viewOut`
    based on the relationship between the specified `newView` and `oldView`.

    @method _getFx
    @param {View} newView The view being transitioned-in.
    @param {View} oldView The view being transitioned-out.
    @param {String} [transition] The preferred transition to use.
    @return {Object} An object containing a named fx for both `viewIn` and
        `viewOut`.
    @protected
    @since 3.5.0
    **/
    _getFx: function (newView, oldView, transition) {
        var fx          = AppTransitions.FX,
            transitions = this.get('transitions');

        if (transition === false || !transitions) {
            return null;
        }

        if (transition) {
            return fx[transition];
        }

        if (this._isChildView(newView, oldView)) {
            return fx[transitions.toChild];
        }

        if (this._isParentView(newView, oldView)) {
            return fx[transitions.toParent];
        }

        return fx[transitions.navigate];
    },

    /**
    Queues calls to `_uiTransitionActiveView()` to make sure a currently running
    transition isn't interrupted.

    **Note:** This method prevents the default `_uiSetActiveView()` method from
    running.

    @method _queueActiveView
    @protected
    @since 3.5.0
    **/
    _queueActiveView: function () {
        var args = Y.Array(arguments, 0, true);

        this._viewTransitionQueue.push(args);

        if (!this._transitioning) {
            this._dequeueActiveView();
        }

        return new Y.Do.Prevent();
    },

    /**
    Performs the actual change of this app's `activeView` by visually
    transitioning between the `newView` and `oldView` using any specified
    `options`.

    The `newView` is attached to the app by rendering it to the `viewContainer`,
    and making this app a bubble target of its events.

    The `oldView` is detached from the app by removing it from the
    `viewContainer`, and removing this app as a bubble target for its events.
    The `oldView` will either be preserved or properly destroyed.

    **Note:** This method overrides `_uiSetActiveView()` and provides all of its
    functionality plus supports visual transitions. Also, the `activeView`
    attribute is read-only and can be changed by calling the `showView()`
    method.

    @method _uiTransitionActiveView
    @param {View} newView The View which is now this app's `activeView`.
    @param {View} [oldView] The View which was this app's `activeView`.
    @param {Object} [options] Optional object containing any of the following
        properties:
      @param {Function} [options.callback] Optional callback function to call
        after new `activeView` is ready to use, the function will be passed:
          @param {View} options.callback.view A reference to the new
            `activeView`.
      @param {Boolean} [options.prepend=false] Whether the `view` should be
        prepended instead of appended to the `viewContainer`.
      @param {Boolean} [options.render] Whether the `view` should be rendered.
        **Note:** If no value is specified, a view instance will only be
        rendered if it's newly created by this method.
      @param {Boolean|String} [options.transition] Optional transition override.
        A transition can be specified which will override the default, or
        `false` for no transition.
      @param {Boolean} [options.update=false] Whether an existing view should
        have its attributes updated by passing the `config` object to its
        `setAttrs()` method. **Note:** This option does not have an effect if
        the `view` instance is created as a result of calling this method.
    @protected
    @since 3.5.0
    **/
    _uiTransitionActiveView: function (newView, oldView, options) {
        options || (options = {});

        var callback = options.callback,
            container, transitioning, isChild, isParent, prepend,
            fx, fxConfig, transitions;

        // Quits early when to new and old views are the same.
        if (newView === oldView) {
            callback && callback.call(this, newView);

            this._transitioning = false;
            return this._dequeueActiveView();
        }

        fx       = this._getFx(newView, oldView, options.transition);
        isChild  = this._isChildView(newView, oldView);
        isParent = !isChild && this._isParentView(newView, oldView);
        prepend  = !!options.prepend || isParent;

        // Preforms simply attach/detach of the new and old view respectively
        // when there's no transition to perform.
        if (!fx) {
            this._attachView(newView, prepend);
            this._detachView(oldView);
            callback && callback.call(this, newView);

            this._transitioning = false;
            return this._dequeueActiveView();
        }

        this._transitioning = true;

        container     = this.get('container');
        transitioning = Y.App.CLASS_NAMES.transitioning;

        container.addClass(transitioning);

        this._attachView(newView, prepend);

        // Called when view transitions completed, if none were added this will
        // run right away.
        function complete() {
            this._detachView(oldView);
            container.removeClass(transitioning);
            callback && callback.call(this, newView);

            this._transitioning = false;
            return this._dequeueActiveView();
        }

        // Setup a new stack to run the view transitions in parallel.
        transitions = new Y.Parallel({context: this});
        fxConfig    = {
            crossView: !!oldView && !!newView,
            prepended: prepend
        };

        // Transition the new view first to prevent a gap when sliding.
        if (newView && fx.viewIn) {
            newView.get('container')
                .transition(fx.viewIn, fxConfig, transitions.add());
        }

        if (oldView && fx.viewOut) {
            oldView.get('container')
                .transition(fx.viewOut, fxConfig, transitions.add());
        }

        transitions.done(complete);
    }
};

// -- Transition fx ------------------------------------------------------------
Y.mix(Y.Transition.fx, {
    'app:fadeIn': {
        opacity : 1,
        duration: 0.3,

        on: {
            start: function (data) {
                var styles = {opacity: 0},
                    config = data.config;

                if (config.crossView && !config.prepended) {
                    styles.transform = 'translateX(-100%)';
                }

                this.setStyles(styles);
            },

            end: function () {
                this.setStyle('transform', 'translateX(0)');
            }
        }
    },

    'app:fadeOut': {
        opacity : 0,
        duration: 0.3,

        on: {
            start: function (data) {
                var styles = {opacity: 1},
                    config = data.config;

                if (config.crossView && config.prepended) {
                    styles.transform = 'translateX(-100%)';
                }

                this.setStyles(styles);
            },

            end: function () {
                this.setStyle('transform', 'translateX(0)');
            }
        }
    },

    'app:slideLeft': {
        duration : 0.3,
        transform: 'translateX(-100%)',

        on: {
            start: function () {
                this.setStyles({
                    opacity  : 1,
                    transform: 'translateX(0%)'
                });
            },

            end: function () {
                this.setStyle('transform', 'translateX(0)');
            }
        }
    },

    'app:slideRight': {
        duration : 0.3,
        transform: 'translateX(0)',

        on: {
            start: function () {
                this.setStyles({
                    opacity  : 1,
                    transform: 'translateX(-100%)'
                });
            },

            end: function () {
                this.setStyle('transform', 'translateX(0)');
            }
        }
    }
});

// -- Namespacae ---------------------------------------------------------------
Y.App.TransitionsNative = AppTransitionsNative;
Y.Base.mix(Y.App, [AppTransitionsNative]);


}, '3.7.3', {"requires": ["app-transitions", "app-transitions-css", "parallel", "transition"]});
