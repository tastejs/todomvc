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
_yuitest_coverage["build/app-transitions-native/app-transitions-native.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/app-transitions-native/app-transitions-native.js",
    code: []
};
_yuitest_coverage["build/app-transitions-native/app-transitions-native.js"].code=["YUI.add('app-transitions-native', function (Y, NAME) {","","/**","Provides the implementation of view transitions for `Y.App.Transitions` in","browsers which support native CSS3 transitions.","","@module app","@submodule app-transitions-native","@since 3.5.0","**/","","var AppTransitions = Y.App.Transitions;","","/**","Provides the implementation of view transitions for `Y.App.Transitions` in","browsers which support native CSS3 transitions.","","When this module is used, `Y.App.TransitionsNative` will automatically mix","itself in to `Y.App`.","","@class App.TransitionsNative","@extensionfor App","@since 3.5.0","**/","function AppTransitionsNative() {}","","AppTransitionsNative.prototype = {","    // -- Protected Properties -------------------------------------------------","","    /**","    Whether this app is currently transitioning its `activeView`.","","    @property _transitioning","    @type Boolean","    @default false","    @protected","    @since 3.5.0","    **/","","    /**","    A queue that holds pending calls to this app's `_uiTransitionActiveView()`","    method.","","    @property _viewTransitionQueue","    @type Array","    @default []","    @protected","    @since 3.5.0","    **/","","    // -- Lifecycle Methods ----------------------------------------------------","","    initializer: function () {","        this._transitioning       = false;","        this._viewTransitionQueue = [];","","        // TODO: Consider the AOP approach that `Plugin.WidgetAnim` uses.","        Y.Do.before(this._queueActiveView, this, '_uiSetActiveView');","    },","","    // -- Protected Methods ----------------------------------------------------","","    /**","    Dequeues any pending calls to `_uiTransitionActiveView()`.","","    **Note:** When there is more than one queued transition, only the most","    recent `activeView` change will be visually transitioned, while the others","    will have their `transition` option overridden to `false`.","","    @method _dequeueActiveView","    @protected","    @since 3.5.0","    **/","    _dequeueActiveView: function () {","        var queue      = this._viewTransitionQueue,","            transition = queue.shift(),","            options;","","        if (transition) {","            // When items are still left in the queue, override the transition","            // so it does not run.","            if (queue.length) {","                // Overrides `transition` option and splices in the new options.","                options = Y.merge(transition[2], {transition: false});","                transition.splice(2, 1, options);","            }","","            this._uiTransitionActiveView.apply(this, transition);","        }","    },","","    /**","    Returns an object containing a named fx for both `viewIn` and `viewOut`","    based on the relationship between the specified `newView` and `oldView`.","","    @method _getFx","    @param {View} newView The view being transitioned-in.","    @param {View} oldView The view being transitioned-out.","    @param {String} [transition] The preferred transition to use.","    @return {Object} An object containing a named fx for both `viewIn` and","        `viewOut`.","    @protected","    @since 3.5.0","    **/","    _getFx: function (newView, oldView, transition) {","        var fx          = AppTransitions.FX,","            transitions = this.get('transitions');","","        if (transition === false || !transitions) {","            return null;","        }","","        if (transition) {","            return fx[transition];","        }","","        if (this._isChildView(newView, oldView)) {","            return fx[transitions.toChild];","        }","","        if (this._isParentView(newView, oldView)) {","            return fx[transitions.toParent];","        }","","        return fx[transitions.navigate];","    },","","    /**","    Queues calls to `_uiTransitionActiveView()` to make sure a currently running","    transition isn't interrupted.","","    **Note:** This method prevents the default `_uiSetActiveView()` method from","    running.","","    @method _queueActiveView","    @protected","    @since 3.5.0","    **/","    _queueActiveView: function () {","        var args = Y.Array(arguments, 0, true);","","        this._viewTransitionQueue.push(args);","","        if (!this._transitioning) {","            this._dequeueActiveView();","        }","","        return new Y.Do.Prevent();","    },","","    /**","    Performs the actual change of this app's `activeView` by visually","    transitioning between the `newView` and `oldView` using any specified","    `options`.","","    The `newView` is attached to the app by rendering it to the `viewContainer`,","    and making this app a bubble target of its events.","","    The `oldView` is detached from the app by removing it from the","    `viewContainer`, and removing this app as a bubble target for its events.","    The `oldView` will either be preserved or properly destroyed.","","    **Note:** This method overrides `_uiSetActiveView()` and provides all of its","    functionality plus supports visual transitions. Also, the `activeView`","    attribute is read-only and can be changed by calling the `showView()`","    method.","","    @method _uiTransitionActiveView","    @param {View} newView The View which is now this app's `activeView`.","    @param {View} [oldView] The View which was this app's `activeView`.","    @param {Object} [options] Optional object containing any of the following","        properties:","      @param {Function} [options.callback] Optional callback function to call","        after new `activeView` is ready to use, the function will be passed:","          @param {View} options.callback.view A reference to the new","            `activeView`.","      @param {Boolean} [options.prepend=false] Whether the `view` should be","        prepended instead of appended to the `viewContainer`.","      @param {Boolean} [options.render] Whether the `view` should be rendered.","        **Note:** If no value is specified, a view instance will only be","        rendered if it's newly created by this method.","      @param {Boolean|String} [options.transition] Optional transition override.","        A transition can be specified which will override the default, or","        `false` for no transition.","      @param {Boolean} [options.update=false] Whether an existing view should","        have its attributes updated by passing the `config` object to its","        `setAttrs()` method. **Note:** This option does not have an effect if","        the `view` instance is created as a result of calling this method.","    @protected","    @since 3.5.0","    **/","    _uiTransitionActiveView: function (newView, oldView, options) {","        options || (options = {});","","        var callback = options.callback,","            container, transitioning, isChild, isParent, prepend,","            fx, fxConfig, transitions;","","        // Quits early when to new and old views are the same.","        if (newView === oldView) {","            callback && callback.call(this, newView);","","            this._transitioning = false;","            return this._dequeueActiveView();","        }","","        fx       = this._getFx(newView, oldView, options.transition);","        isChild  = this._isChildView(newView, oldView);","        isParent = !isChild && this._isParentView(newView, oldView);","        prepend  = !!options.prepend || isParent;","","        // Preforms simply attach/detach of the new and old view respectively","        // when there's no transition to perform.","        if (!fx) {","            this._attachView(newView, prepend);","            this._detachView(oldView);","            callback && callback.call(this, newView);","","            this._transitioning = false;","            return this._dequeueActiveView();","        }","","        this._transitioning = true;","","        container     = this.get('container');","        transitioning = Y.App.CLASS_NAMES.transitioning;","","        container.addClass(transitioning);","","        this._attachView(newView, prepend);","","        // Called when view transitions completed, if none were added this will","        // run right away.","        function complete() {","            this._detachView(oldView);","            container.removeClass(transitioning);","            callback && callback.call(this, newView);","","            this._transitioning = false;","            return this._dequeueActiveView();","        }","","        // Setup a new stack to run the view transitions in parallel.","        transitions = new Y.Parallel({context: this});","        fxConfig    = {","            crossView: !!oldView && !!newView,","            prepended: prepend","        };","","        // Transition the new view first to prevent a gap when sliding.","        if (newView && fx.viewIn) {","            newView.get('container')","                .transition(fx.viewIn, fxConfig, transitions.add());","        }","","        if (oldView && fx.viewOut) {","            oldView.get('container')","                .transition(fx.viewOut, fxConfig, transitions.add());","        }","","        transitions.done(complete);","    }","};","","// -- Transition fx ------------------------------------------------------------","Y.mix(Y.Transition.fx, {","    'app:fadeIn': {","        opacity : 1,","        duration: 0.3,","","        on: {","            start: function (data) {","                var styles = {opacity: 0},","                    config = data.config;","","                if (config.crossView && !config.prepended) {","                    styles.transform = 'translateX(-100%)';","                }","","                this.setStyles(styles);","            },","","            end: function () {","                this.setStyle('transform', 'translateX(0)');","            }","        }","    },","","    'app:fadeOut': {","        opacity : 0,","        duration: 0.3,","","        on: {","            start: function (data) {","                var styles = {opacity: 1},","                    config = data.config;","","                if (config.crossView && config.prepended) {","                    styles.transform = 'translateX(-100%)';","                }","","                this.setStyles(styles);","            },","","            end: function () {","                this.setStyle('transform', 'translateX(0)');","            }","        }","    },","","    'app:slideLeft': {","        duration : 0.3,","        transform: 'translateX(-100%)',","","        on: {","            start: function () {","                this.setStyles({","                    opacity  : 1,","                    transform: 'translateX(0%)'","                });","            },","","            end: function () {","                this.setStyle('transform', 'translateX(0)');","            }","        }","    },","","    'app:slideRight': {","        duration : 0.3,","        transform: 'translateX(0)',","","        on: {","            start: function () {","                this.setStyles({","                    opacity  : 1,","                    transform: 'translateX(-100%)'","                });","            },","","            end: function () {","                this.setStyle('transform', 'translateX(0)');","            }","        }","    }","});","","// -- Namespacae ---------------------------------------------------------------","Y.App.TransitionsNative = AppTransitionsNative;","Y.Base.mix(Y.App, [AppTransitionsNative]);","","","}, '3.7.3', {\"requires\": [\"app-transitions\", \"app-transitions-css\", \"parallel\", \"transition\"]});"];
_yuitest_coverage["build/app-transitions-native/app-transitions-native.js"].lines = {"1":0,"12":0,"25":0,"27":0,"54":0,"55":0,"58":0,"75":0,"79":0,"82":0,"84":0,"85":0,"88":0,"106":0,"109":0,"110":0,"113":0,"114":0,"117":0,"118":0,"121":0,"122":0,"125":0,"140":0,"142":0,"144":0,"145":0,"148":0,"193":0,"195":0,"200":0,"201":0,"203":0,"204":0,"207":0,"208":0,"209":0,"210":0,"214":0,"215":0,"216":0,"217":0,"219":0,"220":0,"223":0,"225":0,"226":0,"228":0,"230":0,"234":0,"235":0,"236":0,"237":0,"239":0,"240":0,"244":0,"245":0,"251":0,"252":0,"256":0,"257":0,"261":0,"266":0,"273":0,"276":0,"277":0,"280":0,"284":0,"295":0,"298":0,"299":0,"302":0,"306":0,"317":0,"324":0,"335":0,"342":0,"349":0,"350":0};
_yuitest_coverage["build/app-transitions-native/app-transitions-native.js"].functions = {"AppTransitionsNative:25":0,"initializer:53":0,"_dequeueActiveView:74":0,"_getFx:105":0,"_queueActiveView:139":0,"complete:234":0,"_uiTransitionActiveView:192":0,"start:272":0,"end:283":0,"start:294":0,"end:305":0,"start:316":0,"end:323":0,"start:334":0,"end:341":0,"(anonymous 1):1":0};
_yuitest_coverage["build/app-transitions-native/app-transitions-native.js"].coveredLines = 79;
_yuitest_coverage["build/app-transitions-native/app-transitions-native.js"].coveredFunctions = 16;
_yuitest_coverline("build/app-transitions-native/app-transitions-native.js", 1);
YUI.add('app-transitions-native', function (Y, NAME) {

/**
Provides the implementation of view transitions for `Y.App.Transitions` in
browsers which support native CSS3 transitions.

@module app
@submodule app-transitions-native
@since 3.5.0
**/

_yuitest_coverfunc("build/app-transitions-native/app-transitions-native.js", "(anonymous 1)", 1);
_yuitest_coverline("build/app-transitions-native/app-transitions-native.js", 12);
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
_yuitest_coverline("build/app-transitions-native/app-transitions-native.js", 25);
function AppTransitionsNative() {}

_yuitest_coverline("build/app-transitions-native/app-transitions-native.js", 27);
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
        _yuitest_coverfunc("build/app-transitions-native/app-transitions-native.js", "initializer", 53);
_yuitest_coverline("build/app-transitions-native/app-transitions-native.js", 54);
this._transitioning       = false;
        _yuitest_coverline("build/app-transitions-native/app-transitions-native.js", 55);
this._viewTransitionQueue = [];

        // TODO: Consider the AOP approach that `Plugin.WidgetAnim` uses.
        _yuitest_coverline("build/app-transitions-native/app-transitions-native.js", 58);
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
        _yuitest_coverfunc("build/app-transitions-native/app-transitions-native.js", "_dequeueActiveView", 74);
_yuitest_coverline("build/app-transitions-native/app-transitions-native.js", 75);
var queue      = this._viewTransitionQueue,
            transition = queue.shift(),
            options;

        _yuitest_coverline("build/app-transitions-native/app-transitions-native.js", 79);
if (transition) {
            // When items are still left in the queue, override the transition
            // so it does not run.
            _yuitest_coverline("build/app-transitions-native/app-transitions-native.js", 82);
if (queue.length) {
                // Overrides `transition` option and splices in the new options.
                _yuitest_coverline("build/app-transitions-native/app-transitions-native.js", 84);
options = Y.merge(transition[2], {transition: false});
                _yuitest_coverline("build/app-transitions-native/app-transitions-native.js", 85);
transition.splice(2, 1, options);
            }

            _yuitest_coverline("build/app-transitions-native/app-transitions-native.js", 88);
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
        _yuitest_coverfunc("build/app-transitions-native/app-transitions-native.js", "_getFx", 105);
_yuitest_coverline("build/app-transitions-native/app-transitions-native.js", 106);
var fx          = AppTransitions.FX,
            transitions = this.get('transitions');

        _yuitest_coverline("build/app-transitions-native/app-transitions-native.js", 109);
if (transition === false || !transitions) {
            _yuitest_coverline("build/app-transitions-native/app-transitions-native.js", 110);
return null;
        }

        _yuitest_coverline("build/app-transitions-native/app-transitions-native.js", 113);
if (transition) {
            _yuitest_coverline("build/app-transitions-native/app-transitions-native.js", 114);
return fx[transition];
        }

        _yuitest_coverline("build/app-transitions-native/app-transitions-native.js", 117);
if (this._isChildView(newView, oldView)) {
            _yuitest_coverline("build/app-transitions-native/app-transitions-native.js", 118);
return fx[transitions.toChild];
        }

        _yuitest_coverline("build/app-transitions-native/app-transitions-native.js", 121);
if (this._isParentView(newView, oldView)) {
            _yuitest_coverline("build/app-transitions-native/app-transitions-native.js", 122);
return fx[transitions.toParent];
        }

        _yuitest_coverline("build/app-transitions-native/app-transitions-native.js", 125);
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
        _yuitest_coverfunc("build/app-transitions-native/app-transitions-native.js", "_queueActiveView", 139);
_yuitest_coverline("build/app-transitions-native/app-transitions-native.js", 140);
var args = Y.Array(arguments, 0, true);

        _yuitest_coverline("build/app-transitions-native/app-transitions-native.js", 142);
this._viewTransitionQueue.push(args);

        _yuitest_coverline("build/app-transitions-native/app-transitions-native.js", 144);
if (!this._transitioning) {
            _yuitest_coverline("build/app-transitions-native/app-transitions-native.js", 145);
this._dequeueActiveView();
        }

        _yuitest_coverline("build/app-transitions-native/app-transitions-native.js", 148);
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
        _yuitest_coverfunc("build/app-transitions-native/app-transitions-native.js", "_uiTransitionActiveView", 192);
_yuitest_coverline("build/app-transitions-native/app-transitions-native.js", 193);
options || (options = {});

        _yuitest_coverline("build/app-transitions-native/app-transitions-native.js", 195);
var callback = options.callback,
            container, transitioning, isChild, isParent, prepend,
            fx, fxConfig, transitions;

        // Quits early when to new and old views are the same.
        _yuitest_coverline("build/app-transitions-native/app-transitions-native.js", 200);
if (newView === oldView) {
            _yuitest_coverline("build/app-transitions-native/app-transitions-native.js", 201);
callback && callback.call(this, newView);

            _yuitest_coverline("build/app-transitions-native/app-transitions-native.js", 203);
this._transitioning = false;
            _yuitest_coverline("build/app-transitions-native/app-transitions-native.js", 204);
return this._dequeueActiveView();
        }

        _yuitest_coverline("build/app-transitions-native/app-transitions-native.js", 207);
fx       = this._getFx(newView, oldView, options.transition);
        _yuitest_coverline("build/app-transitions-native/app-transitions-native.js", 208);
isChild  = this._isChildView(newView, oldView);
        _yuitest_coverline("build/app-transitions-native/app-transitions-native.js", 209);
isParent = !isChild && this._isParentView(newView, oldView);
        _yuitest_coverline("build/app-transitions-native/app-transitions-native.js", 210);
prepend  = !!options.prepend || isParent;

        // Preforms simply attach/detach of the new and old view respectively
        // when there's no transition to perform.
        _yuitest_coverline("build/app-transitions-native/app-transitions-native.js", 214);
if (!fx) {
            _yuitest_coverline("build/app-transitions-native/app-transitions-native.js", 215);
this._attachView(newView, prepend);
            _yuitest_coverline("build/app-transitions-native/app-transitions-native.js", 216);
this._detachView(oldView);
            _yuitest_coverline("build/app-transitions-native/app-transitions-native.js", 217);
callback && callback.call(this, newView);

            _yuitest_coverline("build/app-transitions-native/app-transitions-native.js", 219);
this._transitioning = false;
            _yuitest_coverline("build/app-transitions-native/app-transitions-native.js", 220);
return this._dequeueActiveView();
        }

        _yuitest_coverline("build/app-transitions-native/app-transitions-native.js", 223);
this._transitioning = true;

        _yuitest_coverline("build/app-transitions-native/app-transitions-native.js", 225);
container     = this.get('container');
        _yuitest_coverline("build/app-transitions-native/app-transitions-native.js", 226);
transitioning = Y.App.CLASS_NAMES.transitioning;

        _yuitest_coverline("build/app-transitions-native/app-transitions-native.js", 228);
container.addClass(transitioning);

        _yuitest_coverline("build/app-transitions-native/app-transitions-native.js", 230);
this._attachView(newView, prepend);

        // Called when view transitions completed, if none were added this will
        // run right away.
        _yuitest_coverline("build/app-transitions-native/app-transitions-native.js", 234);
function complete() {
            _yuitest_coverfunc("build/app-transitions-native/app-transitions-native.js", "complete", 234);
_yuitest_coverline("build/app-transitions-native/app-transitions-native.js", 235);
this._detachView(oldView);
            _yuitest_coverline("build/app-transitions-native/app-transitions-native.js", 236);
container.removeClass(transitioning);
            _yuitest_coverline("build/app-transitions-native/app-transitions-native.js", 237);
callback && callback.call(this, newView);

            _yuitest_coverline("build/app-transitions-native/app-transitions-native.js", 239);
this._transitioning = false;
            _yuitest_coverline("build/app-transitions-native/app-transitions-native.js", 240);
return this._dequeueActiveView();
        }

        // Setup a new stack to run the view transitions in parallel.
        _yuitest_coverline("build/app-transitions-native/app-transitions-native.js", 244);
transitions = new Y.Parallel({context: this});
        _yuitest_coverline("build/app-transitions-native/app-transitions-native.js", 245);
fxConfig    = {
            crossView: !!oldView && !!newView,
            prepended: prepend
        };

        // Transition the new view first to prevent a gap when sliding.
        _yuitest_coverline("build/app-transitions-native/app-transitions-native.js", 251);
if (newView && fx.viewIn) {
            _yuitest_coverline("build/app-transitions-native/app-transitions-native.js", 252);
newView.get('container')
                .transition(fx.viewIn, fxConfig, transitions.add());
        }

        _yuitest_coverline("build/app-transitions-native/app-transitions-native.js", 256);
if (oldView && fx.viewOut) {
            _yuitest_coverline("build/app-transitions-native/app-transitions-native.js", 257);
oldView.get('container')
                .transition(fx.viewOut, fxConfig, transitions.add());
        }

        _yuitest_coverline("build/app-transitions-native/app-transitions-native.js", 261);
transitions.done(complete);
    }
};

// -- Transition fx ------------------------------------------------------------
_yuitest_coverline("build/app-transitions-native/app-transitions-native.js", 266);
Y.mix(Y.Transition.fx, {
    'app:fadeIn': {
        opacity : 1,
        duration: 0.3,

        on: {
            start: function (data) {
                _yuitest_coverfunc("build/app-transitions-native/app-transitions-native.js", "start", 272);
_yuitest_coverline("build/app-transitions-native/app-transitions-native.js", 273);
var styles = {opacity: 0},
                    config = data.config;

                _yuitest_coverline("build/app-transitions-native/app-transitions-native.js", 276);
if (config.crossView && !config.prepended) {
                    _yuitest_coverline("build/app-transitions-native/app-transitions-native.js", 277);
styles.transform = 'translateX(-100%)';
                }

                _yuitest_coverline("build/app-transitions-native/app-transitions-native.js", 280);
this.setStyles(styles);
            },

            end: function () {
                _yuitest_coverfunc("build/app-transitions-native/app-transitions-native.js", "end", 283);
_yuitest_coverline("build/app-transitions-native/app-transitions-native.js", 284);
this.setStyle('transform', 'translateX(0)');
            }
        }
    },

    'app:fadeOut': {
        opacity : 0,
        duration: 0.3,

        on: {
            start: function (data) {
                _yuitest_coverfunc("build/app-transitions-native/app-transitions-native.js", "start", 294);
_yuitest_coverline("build/app-transitions-native/app-transitions-native.js", 295);
var styles = {opacity: 1},
                    config = data.config;

                _yuitest_coverline("build/app-transitions-native/app-transitions-native.js", 298);
if (config.crossView && config.prepended) {
                    _yuitest_coverline("build/app-transitions-native/app-transitions-native.js", 299);
styles.transform = 'translateX(-100%)';
                }

                _yuitest_coverline("build/app-transitions-native/app-transitions-native.js", 302);
this.setStyles(styles);
            },

            end: function () {
                _yuitest_coverfunc("build/app-transitions-native/app-transitions-native.js", "end", 305);
_yuitest_coverline("build/app-transitions-native/app-transitions-native.js", 306);
this.setStyle('transform', 'translateX(0)');
            }
        }
    },

    'app:slideLeft': {
        duration : 0.3,
        transform: 'translateX(-100%)',

        on: {
            start: function () {
                _yuitest_coverfunc("build/app-transitions-native/app-transitions-native.js", "start", 316);
_yuitest_coverline("build/app-transitions-native/app-transitions-native.js", 317);
this.setStyles({
                    opacity  : 1,
                    transform: 'translateX(0%)'
                });
            },

            end: function () {
                _yuitest_coverfunc("build/app-transitions-native/app-transitions-native.js", "end", 323);
_yuitest_coverline("build/app-transitions-native/app-transitions-native.js", 324);
this.setStyle('transform', 'translateX(0)');
            }
        }
    },

    'app:slideRight': {
        duration : 0.3,
        transform: 'translateX(0)',

        on: {
            start: function () {
                _yuitest_coverfunc("build/app-transitions-native/app-transitions-native.js", "start", 334);
_yuitest_coverline("build/app-transitions-native/app-transitions-native.js", 335);
this.setStyles({
                    opacity  : 1,
                    transform: 'translateX(-100%)'
                });
            },

            end: function () {
                _yuitest_coverfunc("build/app-transitions-native/app-transitions-native.js", "end", 341);
_yuitest_coverline("build/app-transitions-native/app-transitions-native.js", 342);
this.setStyle('transform', 'translateX(0)');
            }
        }
    }
});

// -- Namespacae ---------------------------------------------------------------
_yuitest_coverline("build/app-transitions-native/app-transitions-native.js", 349);
Y.App.TransitionsNative = AppTransitionsNative;
_yuitest_coverline("build/app-transitions-native/app-transitions-native.js", 350);
Y.Base.mix(Y.App, [AppTransitionsNative]);


}, '3.7.3', {"requires": ["app-transitions", "app-transitions-css", "parallel", "transition"]});
