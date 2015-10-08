montageDefine("af1b182","ui/repetition.reel/repetition",{dependencies:["../../core/core","../component","../../core/template","../../core/range-controller","../../core/promise","../../core/browser","../../composer/press-composer","collections/map","collections/set","../../core/deprecate","../../core/logger","frb/observers"],factory:function(require,exports,module){/**
 * @module "montage/ui/repetition.reel"
 */
var Montage = require("../../core/core").Montage;
var Component = require("../component").Component;
var Template = require("../../core/template").Template;
var RangeController = require("../../core/range-controller").RangeController;
var Promise = require("../../core/promise").Promise;
var browser = require("../../core/browser").browser;
var PressComposer = require("../../composer/press-composer").PressComposer;

var Map = require("collections/map");
var Set = require("collections/set");

var deprecationWarning = require("../../core/deprecate").deprecationWarning;
var logger = require("../../core/logger").logger("repetition").color.magenta();

var Observers = require("frb/observers");
var observeProperty = Observers.observeProperty;
var observeKey = Observers.observeKey;

var TIMEOUT_BEFORE_ITERATION_BECOME_ACTIVE = 60;

/**
 * A reusable view-model for each iteration of a repetition.  Each iteration
 * corresponds to a value from the {@link Repetition#contentController}.
 * When an iteration is drawn, it is tied to the corresponding controller-model
 * that carries which object the iteration is coupled to, and whether it is
 * selected.
 *
 * @class Iteration
 * @extends Montage
 */
var Iteration = exports.Iteration = Montage.specialize( /** @lends Iteration.prototype # */ {

    /**
     * The parent repetition component.
     * @private
     */
    repetition: {value: null},

    /**
     * The repetition gets iterations from its `contentController`.  The
     * controller is responsible for tracking which iterations are drawn and
     * which are selected.  The iteration view-model is attached to the
     * controller view-model by this property. The `selected` and `object`
     * properties are bound to the eponymous properties of the iteration
     * controller.
     * @private
     */
    controller: {value: null},

    /**
     * The corresponding content for this iteration.
     * @type {Object}
     */

    _object: {
        value: null
    },

    object: {
        get: function () {
            return this._object;
        },
        set: function (value) {
            var selected;

            if (this._object !== value) {
                this._object = value;
                selected = this.repetition.contentController.selection.indexOf(value) !== -1;
                if (this._selected !== selected) {
                    this.selected = selected;
                }
            }
        }
    },

    /**
     * A `DocumentFragment`, donated by the repetition's `_iterationTemplate`
     * n&eacute;e `innerTemplate` which contains the elements that the
     * iteration owns when they are not on the document between the top and
     * bottom boundaries.
     * @private
     */
    _fragment: {value: null},

    /**
     * @private
     */
    _childComponents: {value: null},

    /**
     * The position of this iteration within the content controller, and within
     * the document immediately after the repetition has drawn.
     * @type {number}
     */
    index: {value: null},

    /**
     * The position of this iteration on the document last time it was drawn,
     * and its position within the `repetition.drawnIterations`.
     * @private
     */
    _drawnIndex: {value: null},

    /**
     * Whether this iteration should be highlighted.  It might be highlighted
     * because the user is touching it, or because it is under some other user
     * cursor as in an autocomplete popdown where the arrow keys manipulate the
     * active iteration.
     * @type {boolean}
     */
    active: {value: null},

    /**
     * A flag that indicates that the "no-transition" CSS class should be added
     * to every element in the iteration in the next draw, and promptly removed
     * the draw thereafter.
     * @private
     */
    _noTransition: {value: null},

    /**
     * The document part created by instantiating the iteration template.
     */
    _templateDocumentPart: {value: null},

    /**
     * Set when the contents of the iteration no longer match their template.
     */
    isDirty: {value: false},

    _selected: {
        value: null
    },

    selected: {
        get: function () {
            return this._selected;
        },
        set: function (value) {
            value = !!value;
            if (this.object && this.repetition && this.repetition.contentController) {
                if (value) {
                    this.repetition.contentController.selection.add(this.object);
                } else {
                    this.repetition.contentController.selection.delete(this.object);
                }
            }
            if (this._selected !== value) {
                this._selected = value;
                this.repetition._addDirtyClassListIteration(this);
                this.repetition.needsDraw = true;
            }
        }
    },

    /**
     * Creates the initial values of all instance state.
     * @private
     */
    constructor: {
        value: function Iteration() {
            this.super();
            if (logger.isDebug) {
                logger.debug("Iteration:%s create iteration %O", Object.hash(this), this);
            }

            this.repetition = null;
            this.controller = null;
            this.object = null;
            // An iteration can be "on" or "off" the document.  When the
            // iteration is added to a document, the "fragment" is depopulated
            // and placed between "topBoundary" and "bottomBoundary" on the
            // DOM.  The repetition manages the boundary markers around each
            // drawn index.
            this._fragment = null;
            // The corresponding "content" is tracked in
            // repetition._contentForIteration instead of on the iteration
            // itself.  The bindings in the iteration template react to changes
            // in that map.
            this._childComponents = null;
            // The position that this iteration occupies in the controller.
            // This is updated synchronously in response to changes to
            // repetition.iterations, which are in turn synchronized with
            // controller.iterations.  The drawnIndex tracks the index by the
            // end of the next Repetition.draw.
            this.index = null;
            // The position that this iteration occupies in the repetition.
            // This is updated whenever views are added or removed before it in
            // the sequence, an operation of linear complexity but which is not
            // onerous since there should be a managable, fixed-maximum number
            // of drawn iterations.
            this._drawnIndex = null;

            // Describes whether a user gesture is touching this iteration.
            this.active = false;
            // Changes to whether a user is touching the iteration are
            // reflected by the "active" CSS class on each element in the
            // iteration.  This gets updated in the draw cycle, in response to
            // operations that handlePropertyChange adds to the repetition draw
            // cycle.
            // Dispatches handlePropertyChange with the "active" key:
            this.defineBinding("active", {"<->": "repetition.activeIterations.has(())"});

            this._noTransition = false;

            // dispatch handlePropertyChange:
            this.addOwnPropertyChangeListener("active", this);
            this.addOwnPropertyChangeListener("_noTransition", this);

            this.addPathChangeListener(
                "index.defined() && _childComponents.defined()",
                this,
                "handleComponentModelChange"
            );

            this.cachedFirstElement = null;

        }
    },

    _timeoutBecomeActiveID: {
        value: null
    },

    _shouldBecomeActive: {
        value: false
    },

    shouldBecomeActive: {
        set: function (bool) {
            if (this._timeoutBecomeActiveID) {
                clearTimeout(this._timeoutBecomeActiveID);
                this._timeoutBecomeActiveID = null;
            }

            if (bool) {
                var self = this;
                this._shouldBecomeActive = true;

                this._timeoutBecomeActiveID = setTimeout(function () {
                    if (self._shouldBecomeActive) {
                        self.active = true;
                    }

                    self._shouldBecomeActive = false;
                }, TIMEOUT_BEFORE_ITERATION_BECOME_ACTIVE);
            } else {
                this._shouldBecomeActive = false;
            }
        },
        get: function () {
            return this._shouldBecomeActive;
        }
    },

    /**
     * Associates the iteration instance with a repetition.
     * @private
     */
    initWithRepetition: {
        value: function (repetition) {
            this.repetition = repetition;
            return this;
        }
    },

    /**
     * Disassociates an iteration with its content and prepares it to be
     * recycled on the repetition's list of free iterations.  This function is
     * called by handleOrganizedContentRangeChange when it recycles an
     * iteration.
     * @private
     */
    recycle: {
        value: function () {
            this.index = null;
            this.object = null;
            // Adding the "no-transition" class ensures that the iteration will
            // stop any transitions applied when the iteration was bound to
            // other content.  It has the side-effect of scheduling a draw, and
            // in that draw scheduling another draw to remove the
            // "no-transition" class.
            this._noTransition = true;
        }
    },

    /**
     * Injects this iteration to the document between its top and bottom
     * boundaries.
     * @param {number} index The drawn index at which to place the iteration.
     * @private
     */
    injectIntoDocument: {
        value: function (index) {
            if (this._drawnIndex !== null) {
                if (logger.isDebug) {
                    logger.debug("Iteration:%s retracting from index %s and injecting at %s",Object.hash(this),this._drawnIndex, index);
                }
                this.retractFromDocument();
            } else {
                if (logger.isDebug) {
                    logger.debug("Iteration:%s injecting at index %s",Object.hash(this),index);
                }
            }

            var self = this;
            var repetition = this.repetition;
            var element = repetition.element;
            var boundaries = repetition._boundaries;

            // Add a new top boundary before the next iteration
            var topBoundary = element.ownerDocument.createTextNode("");
            var bottomBoundary = boundaries[index]; // previous
            boundaries.splice(index, 0, topBoundary);
            element.insertBefore(topBoundary, bottomBoundary);

            // Inject the elements into the document
            element.insertBefore(this._fragment, bottomBoundary);

            repetition._drawnIterations.splice(index, 0, this);
            repetition._updateDrawnIndexes(index);
            repetition._addDirtyClassListIteration(this);

            if (this._elementsWillBeAddedToMap) {
                return;
            }

            // Once the child components have drawn once, and thus created all
            // their elements, we can add them to the _iterationForElement map
            var childComponentsLeftToDraw = this._childComponents.length;

            var firstDraw = function (event) {
                event.target.removeEventListener("firstDraw", firstDraw, false);
                childComponentsLeftToDraw--;
                if (!childComponentsLeftToDraw) {
                    self.forEachElement(function (element) {
                        repetition._iterationForElement.set(element, self);
                    });
                }
            };

            // notify the components to wake up and smell the document
            if (this._childComponents.length > 0) {
                for (var i = 0; i < this._childComponents.length; i++) {
                    var childComponent = this._childComponents[i];
                    childComponent.addEventListener("firstDraw", firstDraw, false);
                    childComponent.needsDraw = true;
                    if(childComponent._completedFirstDraw === true) {
                        console.error("Repetiton:%s child component %O has already drawn.", Object.hash(this), childComponent);
                    }
                }
            } else {
                this.forEachElement(function (element) {
                    repetition._iterationForElement.set(element, self);
                });
            }
            this._elementsWillBeAddedToMap = true;
        }
    },

    _elementsWillBeAddedToMap: {
        value: false
    },

    /**
     * Retracts an iteration from the document, scooping its child nodes into
     * its DOMFragment.
     * @private
     */
    retractFromDocument: {
        value: function () {
            if (logger.isDebug) {
                logger.debug("Iteration:%s retractFromDocument drawnIndex: %s",Object.hash(this), this._drawnIndex);
            }
            var index = this._drawnIndex;
            var repetition = this.repetition;
            var element = repetition.element;
            var topBoundary = repetition._boundaries[index];
            var bottomBoundary = repetition._boundaries[index + 1];

            // Remove the elements between the boundaries.  Also remove the top
            // boundary and adjust the boundaries array accordingly so future
            // injections and retractions can find their corresponding
            // boundaries.
            repetition._boundaries.splice(index, 1);
            var fragment = this._fragment;
            var child = topBoundary.nextSibling;
            while (child != bottomBoundary) {
                var next = child.nextSibling;
                element.removeChild(child);
                fragment.appendChild(child);
                child = next;
            }
            element.removeChild(topBoundary);

            this._drawnIndex = null;
            repetition._drawnIterations.splice(index, 1);
            repetition._updateDrawnIndexes(index);
        }
    },

    /**
     * This is a method that responds to changes (and the initial value of) the
     * FRB expression `index.defined() && _childComponents.defined()`.
     * @private
     */
    handleComponentModelChange: {
        value: function (onComponentModel) {
            if (onComponentModel) {
                this._childComponents.forEach(
                    this.repetition.addChildComponent,
                    this.repetition
                );
            // the second condition protects against removing before adding in
            // the initial state.
            } else if (this._childComponents) {
                this._childComponents.forEach(
                    this.repetition.removeChildComponent,
                    this.repetition
                );
            }
        }
    },

    /**
     * Dispatched by the "active" and "selected" property change listeners to
     * notify the repetition that these iterations need to have their CSS class
     * lists updated.
     * @private
     */
    handlePropertyChange: {
        value: function () {
            if (!this.repetition)
                return;
            this.repetition._addDirtyClassListIteration(this);
            this.repetition.needsDraw = true;
        }
    },

    /**
     * A utility method for applying changes to every element in this iteration
     * if it is on the document.  This may be safely called on a retracted
     * iteration with no effect.
     * @private
     */
    forEachElement: {
        value: function (callback, thisp) {
            var repetition = this.repetition;
            var index = this._drawnIndex;
            // Short-circuit if the iteration is not on the document.
            if (index == null)
                return;
            for (
                var child = repetition._boundaries[index];
                child !== repetition._boundaries[index + 1];
                child = child.nextSibling
            ) {
                if (child.nodeType === 1) { // tags
                    callback.call(thisp, child);
                }
            }
        }
    },

    /**
     * The first tag node inside this iteration.  This is an accessor.  The
     * accessor function searches for the first element every time
     * it is accessed, to protect against changes to the structure within
     * the iteration.
     *
     * The accessor stores its result in `cachedFirstElement`.  If you are
     * certain that the internal structure of the repetition is consistent and
     * have accessed `firstElement` at least once before, you can take
     * advantage of quick access to `cachedFirstElement`.
     * @private
     */
    firstElement: {
        get: function () {
            var repetition = this.repetition;
            var index = this._drawnIndex;
            if (index == null)
                return;
            for (
                var child = repetition._boundaries[index];
                child !== repetition._boundaries[index + 1];
                child = child.nextSibling
            ) {
                if (child.nodeType === 1) { // tags
                    this.cachedFirstElement = child;
                    return child;
                }
            }
        }
    },

    isComponentTreeLoaded: {
        value: function () {
            return this._fragment !== null;
        }
    },

    /**
     * The most recent result of the `firstElement` accessor, useful for speed
     * if you know that the internal structure of the iteration is static.
     * @private
     */
    cachedFirstElement: {
        value: null
    }

});

// Here it is, what we have all been waiting for, the prototype of the hour.
// Give it up for the Repetition...

/**
 * @class Repetition
 * @classdesc A component that repeats its inner template for each value in
 * @desc
 * A component that manages copies of its inner template for each value in its
 * content.  The content is managed by a controller.  The repetition will
 * create a {@link RangeController} for the content if you provide a
 * [content]{@link Repetition#content} property instead of a
 * [contentController]{@link Repetition#contentController}.
 *
 * Ensures that the document contains iterations in the same order as provided
 * by the content controller.
 *
 * The repetition provides the
 * [objectAtCurrentIteration]{@link Repetition#objectAtCurrentIteration} and
 * [currentIteration]{@link Repetition#currentIteration} properties that can be
 * bound to by the contents of the repetition during the instantiation of the
 * iteration.
 *
 * The repetition strives to avoid moving iterations on, off, or around on the
 * document, prefering to inject or retract iterations between ones that remain
 * in their respective order, or even just rebind existing iterations to
 * alternate content instead of injecting and retracting in the same position.
 * some content.
 *
 * @extends Component
 */
var Repetition = exports.Repetition = Component.specialize(/** @lends Repetition.prototype # */{

    // For the creator:
    // ----

    /**
     * Imperatively initializes a repetition with content.  You can alternately
     * bind the `content` property of a repetition without initializing.  You
     * should not use the `contentController` property of the repetition if you
     * are initialized with the `content` property.
     * @private
     */
    initWithContent: {
        value: function (content) {
            this.object = content;
            return this;
        }
    },

    /**
     * Imperatively initializes a repetition with a content controller, like a
     * `RangeController`.  You can alternately bind the `contentController`
     * property of a repetition without initializing.  You should not use the
     * `content` property of a repetition if you are using its
     * `contentController`.
     * @private
     */
    initWithContentController: {
        value: function (contentController) {
            this.contentController = contentController;
            return this;
        }
    },

    /**
     * A getter and setter for the content of a repetition.  If you set the
     * content property of a repetition, it produces a range content controller
     * for you.  If you get the content property, it will reach into the
     * content controller to give you its content.
     *
     * The content represents the entire backing collection.  The content
     * controller may filter, sort, or otherwise manipulate the visible region
     * of the content.  The {@link Iteration#index} of each iteration
     * corresponds to the position within the visible region of the controller.
     * @type {Array.<Object>}
     */

    content: {
        get: function () {
            if (this.contentController) {
                return this.contentController.content;
            }
            return null;
        },
        set: function (value) {
            // TODO if we provide an implicit content controller, it should be
            // excluded from a serialization of the repetition.
            this.contentController = new RangeController().initWithContent(value);
        }
    },

    /**
     * A range controller or instance with the same interface (
     * [iterations]{@link Repetition#iterations} and
     * [selection]{@link Repetition#selection} properties, where each
     * <iteration has `object` and `selected` properties).  The controller is
     * responsible for managing which contents are visible, selected, and the
     * order of their appearance.
     * @type {RangeController}
     */
    contentController: {value: null},

    /**
     * When selection is enabled, each element in an iteration responds to
     * touch and click events such that the iteration is highlighted (with the
     * "active" CSS class) when the user touches or clicks it, and toggles
     * whether the corresponding content is selected.
     *
     * Selection may be enabled and disabled at any time in the life cycle of
     * the repetition.  The repetition watches changes to this property.
     *
     * All repetitions support selection, whether it is used or not.  This
     * property merely dictates whether the repetition handles gestures for
     * selection.
     * @type {boolean}
     */
    isSelectionEnabled: {value: null},

    /**
     * The repetition maintains an array of every visible, selected iteration,
     * in the order of its appearance.  The user should not modify the selected
     * iterations array.
     * @type {Array.<Iteration>}
     */
    selectedIterations: {value: null},

    /**
     * The repetition maintains an array of the indexes of every selected
     * iteration.  The user should not modify the array.
     * @type {Array.<number>}
     */
    selectedIndexes: {value: null},

    /**
     * The user may determine which iterations are active by setting or
     * manipulating the content of the `activeIterations` array.  At present,
     * the repetition does not guarantee any particular order of appearance of
     * the contained iterations.
     * @type {Array.<Iteration>}
     */
    activeIterations: {value: null},

    /**
     * The repetition coordinates this array of repetition iterations.  Each
     * iteration tracks its corresponding content, whether it is selected,
     * whether it is active, and what CSS classes are applied on each of its
     * direct child nodes.  This array appears in the order that the iterations
     * will be drawn.  There is one repetition iteration for each controller
     * iteration.  The repetition iterations have more responsibilities than
     * the corresponding controller, but some of the properties are bound by
     * the same names, like `object` and `selected`.
     * @type {Array.<Iteration>}
     */
    iterations: {value: null},

    /**
     * The user may bind to the `currentIteration` when the repetition
     * instantiates a new iteration.  The template guarantees that child
     * components can safely bind to the containing repetition.
     *
     * At present, you cannot bind to a grandparent repetition's
     * `currentIteration`, so it becomes the responsibility of the parent
     * repetition to bind its parent repetition's `currentIteration` to a
     * property of itself so its children can access their grandparent.
     * @type {Iteration}
     * @deprecated
     */
    currentIteration: {value: null},

    /**
     * The user may bind the the `currentIteration.object` with this shorthand.
     * @type {Object}
     * @deprecated
     */
    objectAtCurrentIteration: {value: null},

    // For the template:
    // ----

    /**
     * Informs the super-type, `Component`, that there is no `repetition.html`.
     * @private
     */
    hasTemplate: {value: false},

    /**
     * A copy of `innerTemplate`, provided by the `Component` layer, that
     * produces the HTML and components for each iteration.  If this property
     * is `null`, it signifies that the template is in transition, either
     * during initialization or due to resetting `innerTemplate`.  In either
     * case, it is a reliable indicator that the repetition is responding to
     * controller iteration range changes, since that requires a functioning
     * template.
     * @private
     */
    _iterationTemplate: {value: null},

    /**
     * Informs Template that it is not safe to reference the initial DOM
     * contents of the repetition.
     * @see Component.clonesChildComponents
     * @private
     */
    clonesChildComponents: {value: true},

    __pressComposer: {value: null},

    _pressComposer: {
        get: function () {
            if (!this.__pressComposer) {
                this.__pressComposer = new PressComposer();
                this.__pressComposer.lazyLoad = true;
                this.addComposerForElement(this.__pressComposer, this.element);
            }

            return this.__pressComposer;
        }
    },


    // Implementation:
    // ----

    _cancelSelectionRangeChangeListener: {
        value: null
    },

    _selection: {
        value: null
    },

    selection: {
        get: function () {
            return this._selection;
        },
        set: function (value) {
            if (this.contentController) {
                if (this.contentController.selection !== value) {
                    this.contentController.selection = value;
                }
                if (this._selection !== this.contentController.selection) {
                    this._selection = this.contentController.selection;
                }
                if (this._cancelSelectionRangeChangeListener) {
                    this._cancelSelectionRangeChangeListener();
                }
                if (value) {
                    this._cancelSelectionRangeChangeListener = (
                        this.contentController.selection.addRangeChangeListener(this, "selection")
                    );
                    this.handleSelectionRangeChange(value, []);
                } else {
                    this._cancelSelectionRangeChangeListener = null;
                }
            } else {
                this._selection = value;
            }
        }
    },

    handleSelectionRangeChange: {
        value: function (add, remove) {
            var iterationsMap,
                length = this.iterations.length,
                objectIterations,
                object,
                iteration,
                i, j;

            if ((add.length <= 1) && (remove.length <= 1)) {
                if (remove.length) {
                    object = remove[0];
                    for (i = 0; i < length; i++) {
                        if (this.iterations[i].object === object) {
                            this.iterations[i].selected = false;
                        }
                    }
                }
                if (add.length) {
                    object = add[0];
                    for (i = 0; i < length; i++) {
                        if (this.iterations[i].object === object) {
                            this.iterations[i].selected = true;
                        }
                    }
                }
            } else {
                iterationsMap = new Map();
                for (i = 0; i < length; i++) {
                    iteration = this.iterations[i];
                    object = iteration.object;
                    if (!(objectIterations = iterationsMap.get(object))) {
                        objectIterations = [];
                        iterationsMap.set(object, objectIterations);
                    }
                    objectIterations.push(iteration);
                }
                for (i = 0; i < remove.length; i++) {
                    if (objectIterations = iterationsMap.get(remove[i])) {
                        for (j = 0; j < objectIterations.length; j++) {
                            objectIterations[j].selected = false;
                        }
                    }
                }
                for (i = 0; i < add.length; i++) {
                    if (objectIterations = iterationsMap.get(add[i])) {
                        for (j = 0; j < objectIterations.length; j++) {
                            objectIterations[j].selected = true;
                        }
                    }
                }
            }
        }
    },

    _visibleIndexes: {
        value: null
    },

    visibleIndexes: {
        get: function () {
            return this._visibleIndexes;
        },
        set: function (value) {
            if (this._visibleIndexes !== value) {
                if (this._visibleIndexes && this._visibleIndexes.removeRangeChangeListener) {
                    this._visibleIndexes.removeRangeChangeListener(this, "visibleIndexes");
                }
                this._visibleIndexes = value;
                if (this._visibleIndexes && this._visibleIndexes.addRangeChangeListener) {
                    this._visibleIndexes.addRangeChangeListener(this, "visibleIndexes");
                }
                this._updateOrganizedContent();
            }
        }
    },

    handleVisibleIndexesRangeChange: {
        value: function (plus, minus, index) {
            var plusContent,
                i;

            if (this.__controllerOrganizedContent) {
                plusContent = [];
                for (i = 0; i < plus.length; i++) {
                    plusContent.push(this.__controllerOrganizedContent[plus[i]]);
                }
                this.organizedContent.swap(index, minus.length, plusContent);
                if (this._isListeningToOrganizedContentChanges) {
                    this.handleOrganizedContentRangeChange(plusContent.length, minus.length, index);
                    this.needsDraw = true;
                }
            }
        }
    },

    __controllerOrganizedContent: {
        value: null
    },

    _controllerOrganizedContent: {
        get: function () {
            return this.__controllerOrganizedContent;
        },
        set: function (value) {
            if (this.__controllerOrganizedContent !== value) {
                if (this.__controllerOrganizedContent && this.__controllerOrganizedContent.removeRangeChangeListener) {
                    this.__controllerOrganizedContent.removeRangeChangeListener(this, "controllerOrganizedContent");
                }
                this.__controllerOrganizedContent = value;
                if (this.__controllerOrganizedContent && this.__controllerOrganizedContent.addRangeChangeListener) {
                    this.__controllerOrganizedContent.addRangeChangeListener(this, "controllerOrganizedContent");
                }
                this._updateOrganizedContent();
            }
        }
    },

    handleControllerOrganizedContentRangeChange: {
        value: function (plus, minus, index) {
            if (!this._visibleIndexes) {
                this.organizedContent.swap(index, minus.length, plus);
                if (this._isListeningToOrganizedContentChanges) {
                    this.handleOrganizedContentRangeChange(plus.length, minus.length, index);
                    this.needsDraw = true;
                }
            } else {
                this._updateOrganizedContent();
            }
        }
    },

    _updateOrganizedContent: {
        value: function () {
            var previousLength,
                i;

            if (this.__controllerOrganizedContent) {
                if (this._visibleIndexes) {
                    if (this.organizedContent.length > this._visibleIndexes.length) {
                        this.organizedContent.length = this._visibleIndexes.length;
                        if (this._isListeningToOrganizedContentChanges) {
                            this.handleOrganizedContentRangeChange(0, this.organizedContent.length - this._visibleIndexes.length, this._visibleIndexes.length);
                        }
                    }
                    previousLength = this.organizedContent.length;
                    for (i = 0; i < this._visibleIndexes.length; i++) {
                        if (this.organizedContent[i] !== this.__controllerOrganizedContent[this._visibleIndexes[i]]) {
                            this.organizedContent[i] = this.__controllerOrganizedContent[this._visibleIndexes[i]];
                            if (this._isListeningToOrganizedContentChanges) {
                                this.handleOrganizedContentRangeChange(1, previousLength > i ? 1 : 0, i);
                            }
                        }
                    }
                    if (this._isListeningToOrganizedContentChanges) {
                        this.needsDraw = true;
                    }
                } else {
                    previousLength = this.organizedContent.length;
                    this.organizedContent.swap(0, previousLength, this.__controllerOrganizedContent);
                    if (this._isListeningToOrganizedContentChanges) {
                        this.handleOrganizedContentRangeChange(this.__controllerOrganizedContent.length, previousLength, 0);
                        this.needsDraw = true;
                    }
                }
            } else {
                previousLength = this.organizedContent.length;
                this.organizedContent = [];
                if (this._isListeningToOrganizedContentChanges) {
                    this.handleOrganizedContentRangeChange(0, previousLength, 0);
                    this.needsDraw = true;
                }
            }
        }
    },

    /**
     * @private
     */
    constructor: {
        value: function Repetition() {
            this.super();

            // XXX Note: Any property added to initialize in constructor must
            // also be accounted for in _teardownIterationTemplate to reset the
            // repetition.

            this.contentController = null;
            this.organizedContent = [];
            this.defineBinding("_controllerOrganizedContent", {
                "<-": "contentController.organizedContent"
            });
            // Determines whether the repetition listens for mouse and touch
            // events to select iterations, which involves "activating" the
            // iteration when the user touches.
            this.isSelectionEnabled = false;
            this.defineBinding("selection", {
                "<-": "contentController.selection"
            });
            this.defineBinding("selectedIterations", {
                "<-": "iterations.filter{selected}"
            });
            this.defineBinding("selectedIndexes", {
                "<-": "selectedIterations.map{index}"
            });


            // The iteration template:
            // ---

            // The template that gets repeated in the DOM
            this._iterationTemplate = null;

            // This triggers the setup of the iteration template
            this.addPathChangeListener(
                this._setupRequirements,
                this,
                "_handleSetupRequirementsChange"
            );

            // This triggers the teardown of an iteration template.
            this.addPathChangeListener(
                "innerTemplate",
                this,
                "_handleInnerTemplateChange"
            );


            // The state of the DOM:
            // ---

            // The "iterations" array tracks "_controllerIterations"
            // synchronously.  Each iteration corresponds to controlled content
            // at its visible position.  An iteration has an instance of the
            // iteration template / inner template.
            this.iterations = [];
            // The "_drawnIterations" array gets synchronized with
            // "iterations" by applying draw operations when "Repetition.draw"
            // occurs.
            this._drawnIterations = [];
            // Iteration content can be reused.  When an iteration is collected
            // (and when it is initially created), it gets put in the
            // _freeIterations list.
            this._freeIterations = []; // push/pop LIFO
            // Whenever an iteration template is instantiated, it may have
            // bindings to the repetition's "contentAtCurrentIteration".  The
            // repetition delegates "contentAtCurrentIteration" to a mapping
            // from iterations to content, which it can dynamically update as
            // the iterations are reused, thereby updating the bindings.
            this._contentForIteration = Map();
            // We track the direct child nodes of every iteration so we can
            // look up which iteration a mouse or touch event occurs on, for
            // the purpose of selection tracking.
            this._iterationForElement = Map();
            // This variable is updated in the context of deserializing the
            // iteration template so bindings to "contentAtCurrentIteration" are
            // attached to the proper "iteration".  The "_contentForIteration"
            // provides the level of indirection that allows iterations to be
            // paired with different content during their lifetime, but the
            // template and components for each iteration will always be tied
            // to the same Iteration instance.
            this.currentIteration = null;
            // A memo key used by Template.createWithComponent to uniquely
            // identify this repetition (and equivalent instances if this is
            // nested in another repetition) so that it can memoize the
            // template instance:
            this._templateId = null;

            // This promise synchronizes the creation of new iterations.
            this._iterationCreationPromise = Promise.resolve();

            // Where we want to be after the next draw:
            // ---

            // The _boundaries array contains comment nodes that serve as the
            // top and bottom boundary of each iteration.  There will always be
            // one more boundary than iteration.
            this._boundaries = [];

            // The plan for the next draw to synchronize _controllerIterations
            // and iterations on the DOM:
            // ---

            this._dirtyClassListIterations = Set();
            // We can draw when we have created all requested iterations.
            this._requestedIterations = 0;
            this._createdIterations = 0;
            this._canDrawInitialContent = false;
            this._initialContentDrawn = false;

            // Selection gestures
            // ------------------

            this.addOwnPropertyChangeListener("isSelectionEnabled", this);
            // Used by selection tracking (last part of Repetition
            // implementation) to track which selection pointer the repetition
            // is monitoring
            this._selectionPointer = null;
            // This is a list of iterations that are active.  It is maintained
            // entirely by a bidirectional binding to each iteration's "active"
            // property, which in turn manages the "active" class on each
            // element in the iteration in the draw cycle.  Iterations are
            // activated by gestures when selection is enabled, and can also be
            // managed manually for a cursor, as in an autocomplete drop-down.
            // TODO Provide some assurance that the activeIterations will
            // always appear in the same order as they appear in the iterations
            // list.
            this.activeIterations = [];

        }
    },

    // Creating an iteration template:
    // ----

    /**
     * This is an FRB expression that becomes true when all of the requirements
     * for setting up an iteration template have been satisfied.
     * -   A component is not able to get its innerTemplate before being
     *     completely deserialized from the template and self means having
     *     access to its ownerDocumentPart.  This will happen when the
     *     repetition is asked to load its component tree during template
     *     instantiation.
     * -   We shouldn't set up the iteration template if the repetition
     *     received new content, we'll wait until contentDidLoad is called.
     *     The problem is that the new components from the new DOM are already
     *     in the component tree but not in the DOM, and since self function
     *     removes the child components from the repetition we lose them
     *     forever.
     * @private
     */
    _setupRequirements: {
        value: "[" +
            "!_iterationTemplate.defined()," +
            "!_newDomContent.defined()," +
            "!_shouldClearDomContentOnNextDraw," +
            "_isComponentExpanded," +
            "_ownerDocumentPart.defined()" +
        "].every{}"
    },

    /**
     * This is the rising-edge trigger for setting up the iteration template.
     * When the `_setupRequirements` expression becomes true, it is time to set
     * up the iteration template based on the inner template.
     * @private
     */
    _handleSetupRequirementsChange: {
        value: function (canSetUp) {
            if (canSetUp) {
                this._setupIterationTemplate();
            }
        }
    },

    /**
     * This is the falling-edge trigger that tears down the iteration template.
     * A new iteration template will be created if or when an inner template
     * is provided and all the requirements are satisfied again.
     * @private
     */
    _handleInnerTemplateChange: {
        value: function (innerTemplate) {
            if (this._iterationTemplate) {
                this._teardownIterationTemplate();
            }
            if (innerTemplate && this.getPath(this._setupRequirements)) {
                this._setupIterationTemplate();
            }
        }
    },

    /**
     * Prepares this component and all its children for garbage collection
     * (permanently) or reuse.
     *
     * @param permanently whether to cancel bindings on this component
     * and all of its descendants in the component tree.
     * @private
     */
    cleanupDeletedComponentTree: {
        value: function (permanently) {
            // Don't set innerTemplate directly because the listener system
            // will get it and that will make the repetition to create it all
            // over again if it happens to be null for some reason.
            var previousIterationTemplate = this._innerTemplate;
            this._innerTemplate = null;
            if (previousIterationTemplate) {
                this._teardownIterationTemplate();
            }
            if (permanently) {
                this.cancelBindings();
            }
        }
    },

    /**
     * Called by Component to build the component tree.
     * @private
     */
    expandComponent: {
        value: function expandComponent() {
            // Setting this property to true *causes* _setupIterationTemplate
            // to be run through the handleSetupRequirementsChange listener,
            // and as it runs synchronously, guarantees that the template will
            // be expanded before the next line.
            this._isComponentExpanded = true;
            // TODO should this ever become false?
            return Promise.resolve();
        }
    },

    _buildIterationTemplate: {
        value: function () {
            var iterationTemplate;
            var serialization;
            var serializationObject;
            var label;

            // We need to clone the innerTemplate because this repetition
            // might be used in different contexts and with different template
            // arguments making it having diferent external objects in its
            // instances.
            iterationTemplate = this.innerTemplate.clone();
            serialization = iterationTemplate.getSerialization();
            serializationObject = serialization.getSerializationObject();
            label = Montage.getInfoForObject(this).label;

            this._iterationLabel = label + ":iteration";
            serializationObject[this._iterationLabel] = {};
            iterationTemplate.setObjects(serializationObject);

            if (this.innerTemplate.hasParameters()) {
                this._expandIterationTemplateParameters(iterationTemplate);
            }

            //jshint -W106
            if (window._montage_le_flag) {
                iterationTemplate.refresher = this;
                this._leTagIterationTemplate(iterationTemplate);
            }
            //jshint +W106

            return iterationTemplate;
        }
    },

    _rebuildIterationTemplate: {
        value: function () {
            var iterationTemplate = this._iterationTemplate,
                newIterationTemplate,
                iterations = this.iterations;

            this._purgeFreeIterations();
            for (var i = 0, iteration; iteration =/*assign*/ iterations[i]; i++) {
                iteration.isDirty = true;
            }

            this._innerTemplate = null;
            newIterationTemplate = this._buildIterationTemplate();
            iterationTemplate.replaceContentsWithTemplate(newIterationTemplate);
        }
    },

    refreshTemplate: {
        value: function () {
            this._rebuildIterationTemplate();
        }
    },

    _isListeningToOrganizedContentChanges: {
        value: false
    },

    /**
     * When `_setupRequirements` have all been met, this method produces an
     * iteration template using the `innerTemplate` that has been given to this
     * repetition.  It also deletes any *initial* child components and starts
     * watching for changes to the organized content.  Watching for organized
     * content changes would cause errors if it were not possible to
     * instantiate iterations.  In symmetry, `_teardownIterationTemplate`
     * pauses watching the organized content.
     * @private
     */
    _setupIterationTemplate: {
        value: function () {
            this._iterationTemplate = this._buildIterationTemplate();
            // Erase the initial child component trees. The initial document
            // children will be purged on first draw.  We use the innerTemplate
            // as the iteration template and replicate it for each iteration
            // instead of using the initial DOM and components.
            var childComponents = this.childComponents;
            var childComponent;
            var index = childComponents.length - 1;
            // pop() each component instead of shift() to avoid bubbling the
            // indexes of each child component on every iteration.
            while ((childComponent = childComponents[index--])) {
                childComponent.detachFromParentComponent();
                childComponent.needsDraw = false;
                childComponent.cleanupDeletedComponentTree(true); // cancel bindings, permanent
            }

            // Begin tracking the controller organizedContent.  We manually
            // dispatch a range change to track all the iterations that have
            // come and gone while we were not watching.
            this.handleOrganizedContentRangeChange(this.organizedContent.length, 0, 0);
            // Dispatches handleOrganizedContentRangeChange:
            this._isListeningToOrganizedContentChanges = true;
            this._canDrawInitialContent = true;
            this.needsDraw = true;

        }
    },

    _leTagIterationTemplate: {
        value: function (template) {
            var body = template.document.body;

            if (body.children.length > 0) {
                //jshint -W106
                var ownerModuleId = this.ownerComponent._montage_metadata.moduleId;
                var label = this._montage_metadata.label;
                //jshint +W106
                this._leTagStarArgument(ownerModuleId, label, body);
            }
        }
    },

    /**
     * This method is used both in `cleanupDeletedComponentTree` and the
     * internal `_handleInnerTemplateChange` functions, to retract all drawn
     * iterations from the document, prepare all allocated iterations for
     * garbage collection, and pause observation of the controller's
     * iterations.
     * @private
     */
    _teardownIterationTemplate: {
        value: function () {

            // stop listenting to controlled content changes until the new
            // iteration template is ready.  (at which point we will manually
            // dispatch handleOrganizedContentRangeChange with the entire
            // content of the array when _setupIterationTemplate has finished)
            this._isListeningToOrganizedContentChanges = false;
            // simulate removal of all iterations from the controller to purge
            // the iterations and _drawnIterations.
            this.handleOrganizedContentRangeChange(0, this.organizedContent.length, 0);

            // prepare all the free iterations and their child component trees
            // for garbage collection
            this._purgeFreeIterations();

            // purge the existing iterations
            this._iterationTemplate = null;
            this._contentForIteration.clear();
            this._iterationForElement.clear();
            this.currentIteration = null;
            this._templateId = null;
            this._requestedIterations = 0;
            this._createdIterations = 0;
            this._canDrawInitialContent = false;
            this._selectionPointer = null;
            this.activeIterations.clear();
            this._dirtyClassListIterations.clear();
        }
    },

    _purgeFreeIterations: {
        value: function () {
            for (var i = 0; i < this._freeIterations.length; i++) {
                var iteration = this._freeIterations[i];
                for (var j = 0; j < iteration._childComponents.length; j++) {
                    var childComponent = iteration._childComponents[j];
                    this.removeChildComponent(childComponent);
                    childComponent.cleanupDeletedComponentTree(true); // true cancels bindings
                }
            }
            this._freeIterations.clear();
        }
    },

    // TODO(@aadsm) doc
    /**
     * @private
     */
    _expandIterationTemplateParameters: {
        value: function (template) {
            var owner = this,
                argumentsTemplate,
                collisionTable,
                externalLabels,
                objects,
                instances,
                expansionResult,
                newLabel,
                labels,
                metadata;

            // Crawl up the template chain while there are parameters to expand
            // in the iteration template.
            while (template.hasParameters()) {
                owner = owner.ownerComponent;
                argumentsTemplate = owner._ownerDocumentPart.template;
                objects = owner._ownerDocumentPart.objects;

                expansionResult = template.expandParameters(owner);

                // Associate the new external objects with the objects in the
                // instantiation of argumentsTemplate.
                externalLabels = template.getSerialization()
                    .getExternalObjectLabels();
                instances = template.getInstances();

                labels = expansionResult.labels;
                collisionTable = expansionResult.labelsCollisions;

                for (var i = 0, label; (label = labels[i]); i++) {
                    if (collisionTable && label in collisionTable) {
                        newLabel = collisionTable[label];
                    } else {
                        newLabel = label;
                    }

                    // Setup external objects and configure the correct require,
                    // label and owner for the objects that came from the
                    // template arguments.
                    if (externalLabels.indexOf(newLabel) >= 0) {
                        instances[newLabel] = objects[label];
                    } else {
                        metadata = argumentsTemplate.getObjectMetadata(label);
                        if (!metadata.owner) {
                            metadata.owner = objects.owner;
                        }
                        template.setObjectMetadata(newLabel, metadata.require,
                            metadata.label, metadata.owner);
                    }
                }
            }
        }
    },

    // Instantiating an iteration template:
    // ----

    _iterationLabel: {
        value: null
    },
    /**
     * We can only create one iteration at a time because it is an asynchronous
     * operation and the "repetition.currentIteration" property may be bound
     * during this process.  If we were to attempt to instantiate multiple
     * iterations asynchronously, currentIteration and contentAtCurrentIteration
     * bindings would get interleaved.  The "_iterationCreationPromise"
     * synchronizes "createIteration", ensuring we only create one at a time,
     * waiting for the previous to either succeed or fail before attempting
     * another.
     * @private
     */
    _iterationCreationPromise: {value: null},

    /**
     * Creates a new iteration and sets up a new instance of the iteration
     * template.  Ensures that only one iteration is being instantiated at a
     * time to guarantee that `currentIteration` can be reliably bound to the
     * particular iteration.
     * @private
     */
    _createIteration: {
        value: function () {
            var self = this,
                iteration = new this.Iteration().initWithRepetition(this);

            this._iterationCreationPromise = this._iterationCreationPromise
            .then(function () {
                var _document = self.element.ownerDocument,
                    instances,
                    promise;

                self.currentIteration = iteration;

                // We need to extend the instances of the template to add the
                // iteration object that is specific to each iteration template
                // instance.
                instances = self._iterationTemplate.getInstances();
                instances = Object.create(instances);
                instances[self._iterationLabel] = iteration;

                promise = self._iterationTemplate.instantiateWithInstances(instances, _document)
                .then(function (part) {
                    part.parentDocumentPart = self._ownerDocumentPart;
                    iteration._templateDocumentPart = part;
                    part.loadComponentTree().then(function () {
                        if (logger.isDebug) {
                            logger.debug("Iteration:%s component tree loaded.", Object.hash(iteration));
                        }
                        iteration._fragment = part.fragment;
                        // It is significant that _childComponents are assigned
                        // *after* the component tree has finished loading
                        // because this signals to the iteration that it should
                        // synchronize the child components with the repetition
                        // based on whether the iteration should be on the DOM
                        // hereafter.
                        iteration._childComponents = part.childComponents;
                        self.constructIteration(iteration);
                    }).done();
                    self.currentIteration = null;
                });

                promise.done(); // radiate an error if necessary
                return promise.then(null, function () {
                    // but regardless of whether this iteration failed, allow
                    // another iteration to be created
                });
            });

            this._requestedIterations++;
            return iteration;
        }
    },

    /**
     * @private
     */
    // This utility method for the completion of _createIteration.
    constructIteration: {
        value: function (iteration) {
            this._createdIterations++;

            if (this._createdIterations >= this._requestedIterations) {
                this.needsDraw = true;
                // TODO: When we change the canDraw() function of a component
                // we need to _canDraw = true whenever we request a draw.
                // This is because if the component gets into a state where it
                // is part of the draw cycle but not able to draw (canDraw()
                // === false) its needsDraw property is not set to false and
                // further needsDraw = true will result in a noop, the only way
                // to make the component draw again is by informing the root
                // component directly that it can draw now, and this is done by
                // _canDraw = true. Another option is to make its parent draw,
                // but we probably don't want that.
                this._canDraw = true;
            }
        }
    },

    /**
     * This ties `contentAtCurrentIteration` to an iteration.
     * `currentIteration` is only current in the stack of instantiating a
     * template, so this method is a hook that the redirects
     * `contentAtCurrentIteration` property change listeners to a map change
     * listener on the `_contentForIteration` map instead.  The binding then
     * reacts to changes to the map as iterations are reused with different
     * content at different positions in the DOM.
     * @private
     */
    observeProperty: {
        value: function (key, emit, scope) {
            if (key === "contentAtCurrentIteration" || key === "objectAtCurrentIteration") {
                if (key === "contentAtCurrentIteration") {
                    deprecationWarning("contentAtCurrentIteration",":iteration.object");
                } else if (key === "objectAtCurrentIteration"){
                    deprecationWarning("objectAtCurrentIteration",":iteration.object");
                }
                // delegate to the mapping from iterations to content for the
                // current iteration
                return observeKey(
                    this._contentForIteration,
                    this.currentIteration,
                    emit,
                    scope
                );
            } else if (key === "currentIteration") {
                deprecationWarning("currentIteration",":iteration");
                // Shortcut since this property is sticky -- won't change in
                // the course of instantiating an iteration and should not
                // dispatch a change notification when we instantiate the next.
                return emit(this.currentIteration);
            } else {
                // fall back to normal property observation
                return observeProperty(this, key, emit, scope);
            }
        }
    },

    /**
     * This makes bindings to `currentIteration` stick regardless of how the
     * repetition manipulates the property, and prevents a getter/setter pair
     * from being attached to the property.  `makePropertyObservable` is called
     * by in the `listen/property-changes` module in the Collections package.
     * @private
     */
    makePropertyObservable: {
        value: function (key) {
            if (key !== "currentIteration") {
                return Montage.makePropertyObservable.call(this, key);
            }
        }
    },

    // Reacting to changes in the controlled visible content:
    // ----

    /**
     * The content controller produces an array of iterations.  The controller
     * may come and go, but each instance of a repetition has its own array to
     * track the corresponding content controller's content, which gets emptied
     * and refilled by a range content binding  when the controller changes.
     * This is to simplify management of the repetition's controller iterations
     * range change listener.
     *
     * The controller iterations themselves instruct the repetition to display
     * an iteration at the corresponding position, and provide a convenient
     * interface for getting and setting whether the corresponding content is
     * selected.
     * @private
     */
    _controllerIterations: {value: null},

    /**
     * The drawn iterations get synchronized with the `iterations` array each
     * time the repetition draws.  The `draw` method simply walks down the
     * iterations and drawn iterations arrays, redacting drawn iterations if
     * they are not at the correct position and injecting the proper iteration
     * from the model in its place.
     * @private
     */
    _drawnIterations: {value: null},

    /**
     * @private
     */
    _freeIterations: {value: null},

    /**
     * @private
     */
    _contentForIteration: {value: null},

    /**
     * Reacts to changes in the controller's organized content by altering the
     * modeled iterations.  This may require additional iterations to be
     * instantiated.  The repetition may redraw when all of the instantiated
     * iterations have finished loading.
     *
     * This method is dispatched in response to changes to the organized
     * content but only while the repetition is prepared to instantiate
     * repetitions.  Any time the repetition needs to change its inner
     * template, or when it is setting up its initial inner template, the
     * repetition silences the organizedContent range change listener and
     * manually calls this method as if organizedContent were cleared out, to
     * cause all of the iterations to be collected and removed from the
     * document.  When the iteration template is ready again, it manually
     * dispatches this method again as if the organizedContent had been
     * repopulated, then resumes listening for changes.
     *
     * Bindings react instantly to the change in the iteration model.  The draw
     * method synchronizes `index` and `_drawnIndex` on each iteration as it
     * rearranges `_drawnIterations` to match the order and content of the
     * `iterations` array.
     *
     * @private
     */
    handleOrganizedContentRangeChange: {
        value: function (plusLength, minusLength, index) {
            var start = index,
                freedIterations,
                freedIteration,
                iterations = this.iterations,
                contentForIteration = this._contentForIteration,
                reusableIterationsCount = Math.min(plusLength, minusLength),
                removeIterationsCount = minusLength - reusableIterationsCount,
                addIterationsCount = plusLength - reusableIterationsCount,
                organizedContent = this.organizedContent,
                i, j;

            if (logger.isDebug) {
                logger.debug("Repetition:%s content changed +%s@%s %O -%s %O ", Object.hash(this), plusLength?plusLength:0, index, minusLength?minusLength:0);
                logger.debug("Repetition:%s +%s -%s iterations", Object.hash(this), addIterationsCount, removeIterationsCount);
            }
            if (this._iterationTemplate.isDirty) {
                this._iterationTemplate.refresh();
            }

            // This is an optimization for a common case with the Flow that
            // avoids shifting around with the iterations and free iterations
            // array.  If the number of added and removed content values are
            // the same, which is what happens if a value is set at an index,
            // it is unnecessary to splice the corresponding index in and out,
            // and unnecessary to even check whether more iterations need to be
            // allocated.

            for (i = 0; i < reusableIterationsCount; i++, index++) {
                iterations[index].object = organizedContent[index];
                contentForIteration.set(iterations[index], organizedContent[index]);
            }

            if (removeIterationsCount > 0) {
                // Subtract iterations
                freedIterations = iterations.splice(index, removeIterationsCount);

                // Notify these iterations that they have been recycled,
                // particularly so they know to disable animations with the
                // "no-transition" CSS class.
                // Add them back to the free list so they can be reused
                for (i = 0; i < removeIterationsCount; i++) {
                    freedIteration = freedIterations[i];
                    freedIteration.recycle();
                    if (!freedIteration.isDirty) {
                        this._freeIterations.push(freedIteration);
                    }
                }
            }

            if (addIterationsCount > 0) {
                // Create more iterations if we will need them
                if (logger.isDebug) {
                    var newIterations = [];
                }
                while (this._freeIterations.length < addIterationsCount) {
                    this._freeIterations.push(this._createIteration());
                    if (logger.isDebug) {
                        newIterations.push(this._freeIterations[this._freeIterations.length-1])
                    }
                }
                // Add iterations
                var plusIterations = new Array(addIterationsCount);
                for (i = reusableIterationsCount, j = 0; i < plusLength; i++, j++) {
                    var iteration = this._freeIterations.pop();
                    if (logger.isDebug) {
                        if(!newIterations.has(iteration)) {
                            logger.debug("Repetition:%s reusing %s", Object.hash(this), Object.hash(iteration));
                        }
                    }
                    var content = organizedContent[start + i];
                    iteration.object = content;
                    // This updates the "repetition.contentAtCurrentIteration"
                    // bindings.
                    contentForIteration.set(iteration, content);
                    plusIterations[j] = iteration;
                }
                iterations.swap(index, 0, plusIterations);
            }

            if (removeIterationsCount > 0 || addIterationsCount > 0) {
                // Update indexes for all subsequent iterations
                this._updateIndexes(index);
            }
        }
    },

    /**
     * Used by handleOrganizedContentRangeChange to update the controller index
     * of every iteration following a change.
     * @private
     */
    _updateIndexes: {
        value: function (index) {
            var iterations = this.iterations;
            for (; index < iterations.length; index++) {
                iterations[index].index = index;
            }
        }
    },

    _addDirtyClassListIteration: {
        value: function (iteration) {
            iteration.forEachElement(function (element) {
                var component;
                if (element && (component = element.component)) {
                    // If the element has a component then use the component's
                    // classList and let it handle drawing...
                    component.classList[iteration.active ? "add" : "remove"]("active");
                    component.classList[iteration.selected ? "add" : "remove"]("selected");
                    component.classList.remove("no-transition");
                } else {
                    // ...otherwise we will handle the drawing of the classes
                    // on plain elements ourselves
                    this._dirtyClassListIterations.add(iteration);
                }
            }, this);
        }
    },

    /**
     * @private
     */
    canDraw: {
        value: function () {
            // block for the usual component-related issues
            var canDraw = this.canDrawGate.value;

            // block until we have created enough (iterations to draw
            canDraw = canDraw && this._requestedIterations <= this._createdIterations;
            // block until we can draw initial content if we have not already
            canDraw = canDraw && (this._initialContentDrawn || this._canDrawInitialContent);

            // TODO: we're going to comment this out for now at least because
            // the repetition can get into a dead lock in the case of a nested
            // repetition (a repetition that has another repetition as direct
            // child component). It's possible to get into a state where the
            // inner repetition will never be able to draw unless the outer
            // repetition draws first. Hopefully the DrawManager will be able
            // to solve this. - @aadsm
            // block until all child components can draw
            //if (canDraw) {
            //    for (var i = 0; i < this.childComponents.length; i++) {
            //        var childComponent = this.childComponents[i];
            //        if (!childComponent.canDraw()) {
            //            canDraw = false;
            //        }
            //    }
            //}

            return canDraw;
        }
    },

    /**
     * An array of comment nodes that mark the boundaries between iterations on
     * the DOM.  When an iteration is retracted, the top boundary gets
     * retracted with it so the iteration at index N will always have boundary
     * N above it and N + 1 below it.  There must always be one more boundary
     * than there are iterations, representing the bottom boundary of the last
     * iteration.  That boundary gets added in first draw.
     * @private
     */
    _boundaries: {value: null},

    /**
     * A Set of iterations that have changed their CSS classes that are managed
     * by the repetition, "active", "selected", and "no-transition".
     * @private
     */
    _dirtyClassListIterations: {value: null},

    /**
     * The cumulative number of iterations that _createIteration has started
     * making.
     * @private
     */
    _requestedIterations: {value: null},

    /**
     * The cumulative number of iterations that _createIteration has finished
     * making.
     * @private
     */
    _createdIterations: {value: null},

    /**
     * In the first draw, the repetition gets rid of its innerHTML, which was
     * captured by the innerTemplate, and replaces it with the bottom boundary
     * marker comment.  This cannot be done until after the iteration template
     * is ready.
     *
     * This cycle may occur again if the innerTemplate is replaced.
     * @private
     */
    _canDrawInitialContent: {value: null},

    /**
     * Indicates that the first draw has come and gone and the repetition is
     * ready for business.
     * @private
     */
    _initialContentDrawn: {value: null},

    /**
     * @private
     */
    draw: {
        value: function () {

            if (!this._initialContentDrawn) {
                this._drawInitialContent();
                this._initialContentDrawn = true;
            }

            // Synchronize iterations and _drawnIterations

            // Retract iterations that should no longer be visible
            for (var index = this._drawnIterations.length - 1; index >= 0; index--) {
                if (this._drawnIterations[index].index === null) {
                    this._drawnIterations[index].retractFromDocument();
                }
            }

            // Inject iterations if they are not already in the right location
            for (
                var index = 0;
                index < this.iterations.length;
                index++
            ) {
                var iteration = this.iterations[index];
                if (iteration._drawnIndex !== iteration.index && iteration.isComponentTreeLoaded()) {
                    iteration.injectIntoDocument(index);
                }
            }

            // Update class lists
            var iterations = this._dirtyClassListIterations.toArray();
            // Note that the iterations list must be cleared first because we
            // remove the "no-transition" class during the update if we find
            // it, which in turn schedules another draw and adds the iteration
            // back to the schedule.
            this._dirtyClassListIterations.clear();
            iterations.forEach(function (iteration) {
                if(iteration.isComponentTreeLoaded()) {
                    iteration.forEachElement(function (element) {
                        // Only update classes that don't have a component, they
                        // are taken care of in _addDirtyClassListIteration
                        if (element.component) {
                            return;
                        }
                        element.classList[iteration.active ? "add" : "remove"]("active");
                        element.classList[iteration.selected ? "add" : "remove"]("selected");

                        // While we're at it, if the "no-transition" class has been
                        // added to this iteration, we will need to remove it in
                        // the next draw to allow the iteration to animate.
                        element.classList.remove("no-transition");
                    }, this);
                }
            }, this);
        }
    },

    /**
     * @private
     */
    _drawInitialContent: {
        value: function () {
            var element = this.element;
            var childNodesCount = element.childNodes.length;
            for (var i = 0; i < childNodesCount; i++) {
                element.removeChild(element.firstChild);
            }
            var bottomBoundary = element.ownerDocument.createTextNode("");
            element.appendChild(bottomBoundary);
            this._boundaries.push(bottomBoundary);
        }
    },

    /**
     * @private
     */
    // Used by the insertion and retraction operations to update the drawn
    // indexes of every iteration following a change.
    _updateDrawnIndexes: {
        value: function (drawnIndex) {
            var drawnIterations = this._drawnIterations;
            for (; drawnIndex < drawnIterations.length; drawnIndex++) {
                drawnIterations[drawnIndex]._drawnIndex = drawnIndex;
            }
        }
    },

    // Selection Tracking
    // ------------------

    /**
     * If `isSelectionEnabled`, the repetition captures the pointer, preventing
     * it from passing to parent components, for example for the purpose of
     * scrolling.
     * @private
     */
    _selectionPointer: {value: null},



    /**
     * Original vertical coordinate of a touchstart/mousedown
     *
     * @type {number}
     * @private
     */
    _startX: { value: 0 },


    /**
     * Original horizontal coordinate of a touchstart/mousedown
     *
     * @type {number}
     * @private
     */
    _startY: { value: 0 },


    /**
     * Pointer to the current active Iteration
     *
     * @type {object}
     * @private
     */
    _currentActiveIteration: { value: null },


    /**
     * @private
     */
    // Called by constructor to monitor changes to isSelectionEnabled and arrange
    // the appropriate event listeners.
    handleIsSelectionEnabledChange: {
        value: function (selectionTracking) {
            if (selectionTracking) {
                this._enableSelectionTracking();
            } else {
                this._disableSelectionTracking();
            }
        }
    },

    /**
     * @private
     */
    // Called by handleIsSelectionEnabledChange in response to
    // isSelectionEnabled becoming true.
    _enableSelectionTracking: {
        value: function () {
            this._pressComposer.addEventListener("pressStart", this, false);
        }
    },

    /**
     * @private
     */
    // Called by handleIsSelectionEnabledChange in response to
    // isSelectionEnabled becoming false.
    _disableSelectionTracking: {
        value: function () {
            this._pressComposer.removeEventListener("pressStart", this, false);
        }
    },

    handlePressStart: {
        value: function (pressEvent) {
            var iteration = this._findIterationContainingElement(pressEvent.targetElement);

            if (iteration) {
                this._startX = pressEvent.clientX;
                this._startY = pressEvent.clientY;

                this.__pressComposer.addEventListener("press", this, false);
                this.__pressComposer.addEventListener("pressCancel", this, false);

                iteration.shouldBecomeActive = true;
                this._currentActiveIteration = iteration;
            }
        }
    },


    /**
     * @private
     */
    _ignoreSelection: {
        value: function () {
            if (this._currentActiveIteration) {
                this._currentActiveIteration.shouldBecomeActive = false;
                this._currentActiveIteration = null;
            }

            this.activeIterations.clear();

            this._startX = 0;
            this._startY = 0;

            this.__pressComposer.removeEventListener("press", this, false);
            this.__pressComposer.removeEventListener("pressCancel", this, false);
        }
    },


    /**
     * @private
     */
    handlePressCancel: {
        value: function () {
            this._ignoreSelection();
        }
    },


    handlePress: {
        value: function (event) {
            var iteration = this._findIterationContainingElement(event.targetElement);

            // And select it, if there is one
            if (iteration && this._currentActiveIteration === iteration) {
                iteration.active = false;

                if (!iteration.selected) {
                    iteration.selected = true;
                }
            }

            this._ignoreSelection();
        }
    },

    // ---

    /**
     * Finds the iteration that contains an element within the repetition.
     * This requires the repetition to maintain an index of all of the
     * <em>shallow</em> child elements of an iteration, _iterationForElement.
     * It does so in the Iteration.injectIntoDocument, but is only
     * approximately accurate since technically the child components of an
     * iteration may add and remove siblings after injection.  For the purpose
     * of selection, we caution the user to wrap any dynamic elements in a
     * static wrapper.
     * @private
     */
    _findIterationContainingElement: {
        value: function (element) {
            // Walk the document upward until we find the repetition and
            // a direct child of the repetition element.  The direct
            // child must be tracked by the repetition.
            var child;
            while (element) {
                if (element === this.element) {
                    return this._iterationForElement.get(child);
                }
                child = element;
                element = element.parentNode;
            }
        }
    },

    // Polymorphic helper types
    // ------------------------

    /**
     * The Iteration type for this repetition.  The repetition calls `new
     * this.Iteration()` to make new instances of iterations, so a child class
     * of `Repetition` may provide an alternate implementation of `Iteration`.
     * @private
     */
    Iteration: { value: Iteration, serializable: false }

});

}})
bundleLoaded("index.html.bundle-1-3.js")