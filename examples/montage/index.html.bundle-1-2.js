montageDefine("af1b182","core/range-controller",{dependencies:["./core","collections/generic-collection","collections/listen/array-changes"],factory:function(require,exports,module){/**
 * @module montage/core/range-controller
 */
var Montage = require("./core").Montage;
var GenericCollection = require("collections/generic-collection");
var observableArrayProperties = require("collections/listen/array-changes").observableArrayProperties;

// The content controller is responsible for determining which content from a
// source collection are visible, their order of appearance, and whether they
// are selected. Multiple repetitions may share a single content controller
// and thus their selection state.

// The controller manages a series of visible iterations. Each iteration has a
// corresponding "object" and whether that iteration is "selected". The
// controller uses a bidirectional binding to ensure that the controller's
// "selections" collection and the "selected" property of each iteration are in
// sync.

// The controller can determine which content to display and the order in which
// to render them in a variety of ways. You can use a "selector" to
// filter and sort the content. The controller binds the content of
// "organizedContent" depending on which strategy you use.

// The content of "organizedContent" is then reflected with corresponding
// incremental changes to "iterations". The "iterations" array will always
// have an "iteration" corresponding to the "object" in "organizedContent" at
// the same position.

/**
 * @const {Array}
 */
var EMPTY_ARRAY = Object.freeze([]);

/**
 * A `_RangeSelection` is a special kind of `Array` that knows about a `RangeController`
 * and maintains invariants about itself relative to the properties of the
 * `RangeController`. A `_RangeSelection` should only be modified using the `splice`
 * method. Changes by directly using other `Array` methods can break the invariants.
 *
 * @class _RangeSelection
 * @private
 */

var _RangeSelection = function(content, rangeController) {
    var self = content;
    //Moved to RangeSelection.prototype for optimization
    //self.makeObservable();
    self.__proto__ = _RangeSelection.prototype;

    self.rangeController = rangeController;
    self.contentEquals = content && content.contentEquals || Object.is;

    //Moved to _RangeSelection.prototype for optimization
    // Object.defineProperty(self, "clone", {
    //     value: function(){
    //         return this.slice();
    //     }
    // });
     // Object.defineProperty(self, "swap", {
     //     configurable: false,
     //     value: _RangeSelection.prototype.swap
     // });
     // Object.defineProperty(self, "push", {
     //     configurable: false,
     //     value: _RangeSelection.prototype.push
     // });
    return self;
};
_RangeSelection.prototype = Object.create(Array.prototype, observableArrayProperties);
Object.defineProperty(_RangeSelection.prototype, "clone", {
    value: function(){
        return this.slice();
    }
});
var oldSwap = self.swap;
Object.defineProperty(_RangeSelection.prototype, "oldSwap", {
    configurable: false,
    value: observableArrayProperties.swap.value
});
Object.defineProperty(_RangeSelection.prototype, "swap", {
    configurable: false,
    value: function(start, howMany, itemsToAdd) {
        return this.swap_or_push(start, howMany, itemsToAdd);
    }
});
_RangeSelection.prototype.oldPush = observableArrayProperties.push.value;
Object.defineProperty(_RangeSelection.prototype, "push", {
    configurable: false,
    value: function() {
          var i = -1,
              l = arguments.length,
              x = Array(l);

          while (++i < l) {
            x[i] = arguments[i];
          }

        this.swap_or_push(this.length, 0, x);
    }
});

/**
 * A custom version of swap to ensure that changes obey the RangeController
 * invariants:
 *  - if rC.multiSelect is false, only allow one item in set.
 *  - if rC.avoidsEmtySelection is true, require at least one item in set.
 *  - only add items that are present in rC.content
 *  - enforce uniqueness of items according to the contentEquals of the content
 *
 * @function swap
 * @param {number} start
 * @param {number} howMany
 * @param {Object} itemsToAdd
 *
 */
Object.defineProperty(_RangeSelection.prototype, "swap_or_push", {
    configurable: false,
    value: function(start, howMany, itemsToAdd) {
        var content = this.rangeController.content;
        this.contentEquals = content && content.contentEquals || Object.is;
        start = start >= 0 ? start : this.length + start;
        var oldLength = this.length;
        var minusLength = Math.min(howMany, oldLength - start);

		if(itemsToAdd) {

            itemsToAdd.contentEquals = this.contentEquals;

            var plus = itemsToAdd.filter(function(item, index){
                // do not add items to the selection if they aren't in content
                if (content && !content.has(item)) {
                    return false;
                }

                // if the same item appears twice in the add list, only add it once
                if (itemsToAdd.findLast(item) > index) {
                    return false;
                }

                // if the item is already in the selection, don't add it
                // unless it's in the part that we're about to delete.
                var indexInSelection = this.find(item);
                return indexInSelection < 0 ||
                        (indexInSelection >= start && indexInSelection < start + minusLength);

            }, this);
		}
		else {
			plus = EMPTY_ARRAY;
		}


        var minus;
        if (minusLength === 0) {
            // minus will be empty
            minus = EMPTY_ARRAY;
        } else {
            minus = Array.prototype.slice.call(this, start, start + minusLength);
        }
        var diff = plus.length - minus.length;
        var newLength = Math.max(this.length + diff, start + plus.length);
        var args;

        if (!this.rangeController.multiSelect && newLength > 1) {
            // use the last-supplied item as the sole element of the set
            var last = plus.length ? plus[plus.length-1] : this.one();
            if(oldLength === 0) {
                this.oldPush(last);
                return EMPTY_ARRAY;
            }
            else {
                return this.oldSwap(0, oldLength, [last]);
            }
        } else if (this.rangeController.avoidsEmptySelection && newLength === 0) {
            // use the first item in the selection, unless it is no longer in the content
            if (content.has(this[0])) {
                if((this.length-1) === 0) {
                    return EMPTY_ARRAY;
                }
                else {
                    return this.oldSwap(1, this.length-1);
                }
            } else {
                if(this.length === 0) {
                    this.oldPush(content.one());
                    return EMPTY_ARRAY;
                }
                else {
                    return this.oldSwap(0, this.length, [content.one()]);
                }
            }
        } else {
            return this.oldSwap(start, howMany, plus);
        }

    }
});


/**
 * A `RangeController` is responsible for managing "ranged content", typically
 * an array, but any collection that implements ranged content change dispatch,
 * `(plus, minus, index)`, would suffice. The controller manages selection and
 * governs the filtering and ordering of the content. `RangeController` is not
 * affiliated with a number range input.
 *
 * A `RangeController` receives a `content` collection, manages what portition
 * of that content is visible and the order of its appearance
 * (`organizedContent`), and projects changes to the the organized content into
 * an array of iteration controllers (`iterations`, containing instances of
 * `Iteration`).
 *
 * The `RangeController` provides a variety of knobs for how to project the
 * content into the organized content, all of which are optional, and the
 * default behavior is to preserve the content and its order.
 * You can use the bindings path expression language (from FRB) to determine
 * the `sortPath` and `filterPath`.
 * There is a `reversed` flag to invert the order of appearance.
 *
 * The `RangeController` is also responsible for managing which content is
 * selected and provides a variety of knobs for that purpose.
 *
 * @class RangeController
 * @classdesc Manages the selection and visible portion of given content,
 * typically an Array for for a [Repetition]{@link Repetition}.
 * @extends Montage
 */
var RangeController = exports.RangeController = Montage.specialize( /** @lends RangeController.prototype # */ {
    /**
     * @constructs RangeController
     */
    constructor: {
        value: function RangeController(content) {
            this.content = null;
            this._selection = new _RangeSelection([], this);

            this.sortPath = null;
            this.filterPath = null;
            this.reversed = false;

            this.selectAddedContent = false;
            this.deselectInvisibleContent = false;
            this.clearSelectionOnOrderChange = false;
            this.avoidsEmptySelection = false;
            this.multiSelect = false;

            // The following establishes a pipeline for projecting the
            // underlying content into organizedContent.
            // The filterPath, sortedPath and reversed are all optional stages
            // in that pipeline and used if non-null and in that order.
            // The _filteredContent and _sortedContent are intermediate variables
            // from which organizedContent is generated.
            this.organizedContent = [];
            // dispatches handleOrganizedContentRangeChange
            this.organizedContent.addRangeChangeListener(this, "organizedContent");
            this.defineBinding("_filteredContent", {
                "<-": "$filterPath.defined() ? content.filter{path($filterPath)} : content"
            });
            this.defineBinding("_sortedContent", {
                "<-": "$sortPath.defined() ? _filteredContent.sorted{path($sortPath)} : _filteredContent"
            });
            this.defineBinding("organizedContent.rangeContent()", {
                "<-": "$reversed ?? 0 ? _sortedContent.reversed() : _sortedContent"
            });

            this.addRangeAtPathChangeListener("content", this, "handleContentRangeChange");
            this.addPathChangeListener("sortPath", this, "handleOrderChange");
            this.addPathChangeListener("reversed", this, "handleOrderChange");
            this.addOwnPropertyChangeListener("multiSelect", this);

            this.iterations = [];

            if (content) {
                this.initWithContent(content);
            }
        }
    },

    /**
     * Initializes a range controller with a backing collection.
     *
     * @function
     * @param {Array|SortedSet} content - Any collection that produces range change events
     * @returns this
     */
    initWithContent: {
        value: function (content) {
            this.content = content;
            return this;
        }
    },

    // Organizing Content
    // ------------------

    /**
     * An FRB expression that determines how to sort the content, like "name"
     * to sort by name.
     * If the `sortPath` is null, the content is not sorted.
     *
     * @property {string} value
     */
    sortPath: {value: null},

    /**
     * Whether to reverse the order of the sorted content.
     *
     * @property {boolean} value
     */
    reversed: {value: null},

    /**
     * An FRB expression that determines how to filter content like
     * "name.startsWith('A')" to see only names starting with 'A'.
     * If the `filterPath` is null, all content is accepted.
     *
     * @property {string} value
     */
    filterPath: {value: null},


    // Managing Selection
    // ------------------

    /**
     * Whether to select new content automatically.
     * @property {boolean}
     * @default false
     *
     * @todo make this work
     */
    selectAddedContent: {value: false},

    /**
     * Whether to automatically deselect content that disappears from the
     * `organizedContent`.
     *
     * @default false
     * @property {boolean}
     */
    deselectInvisibleContent: {value: false},

    /**
     * Whether to automatically clear the selection whenever the
     * `sortPath`, `filterPath`, or `reversed`
     * knobs change.
     *
     * @default false
     * @property {boolean}
     */
    clearSelectionOnOrderChange: {value: false},

    /**
     * Whether to automatically reselect a value if it is the last value
     * removed from the selection.
     *
     * @default false
     * @property {boolean}
     */
    avoidsEmptySelection: {value: false},

    /**
     * Whether to automatically deselect all previously selected content when a
     * new selection is made.
     *
     * @default false
     * @property {boolean}
     */
    multiSelect: {value: false},


    // Properties managed by the controller
    // ------------------------------------

    /**
     * An array incrementally projected from `content` through sort,
     * reversed and filter.
     *
     * @property {Array.<Object>}
     */
    organizedContent: {value: null},

    /**
     * An array of iterations corresponding to each of the values in
     * `organizedContent`, providing an interface for getting or
     * setting whether each is selected.
     *
     * @property {Array.<Iteration>}
     */
    iterations: {value: null},

    _selection: {value: null},

    /**
     * A subset of the `content` that are selected.
     * The user may safely reassign this property and all iterations will react
     * to the change.
     * The selection may be `null`.
     * The selection may be any collection that supports range change events
     * like `Array` or `SortedSet`.
     *
     * @param {Collection} a collection of values to be set as the selection.
     * @returns {?Array|Set|SortedSet}
     *
     * @deprecated: setting the `selection` will not replace it with the provided.
     * collection. Instead, it will empty the selection and then shallow-copy the
     * contents of the argument into the existing selection array. This is done to
     * maintain the complicated invariants about what the selection can be.
     */
    selection: {
        get: function () {
            return this._selection;
        },
        set: function (collection) {
            var args = [0, this._selection.length];
            if (collection && collection.toArray) {
                args = args.concat(collection.toArray());
            }
            this._selection.splice.apply(this._selection, args);
        }
    },

    /**
     * A managed interface for adding values to the selection, accounting for
     * `multiSelect`.
     * You can however directly manipulate the selection, but that will update
     * the selection asynchronously because the controller cannot change the
     * selection while handling a selection change event.
     *
     * @function
     * @param value
     */
    select: {
        value: function (value) {
            if (!this.multiSelect && this.selection.length >= 1) {
                this.selection.clear();
            }
            this.selection.add(value);
        }
    },

    /**
     * A managed interface for removing values from the selection, accounting
     * for `avoidsEmptySelection`.
     * You can however directly manipulate the selection, but that will update
     * the selection asynchronously because the controller cannot change the
     * selection while handling a selection change event.
     *
     * @function
     * @param value
     */
    deselect: {
        value: function (value) {
            if (!this.avoidsEmptySelection || this.selection.length > 1) {
                this.selection["delete"](value);
            }
        }
    },

    /**
     * A managed interface for clearing the selection, accounting for
     * `avoidsEmptySelection`.
     * You can however directly manipulate the selection, but that will update
     * the selection asynchronously because the controller cannot change the
     * selection while handling a selection change event.
     *
     * @function
     */
    clearSelection: {
        value: function () {
            if (!this.avoidsEmptySelection || this.selection.length > 1) {
                this.selection.clear();
            }
        }
    },

    /**
     * Proxies adding content to the underlying collection, accounting for
     * `selectAddedContent`.
     *
     * @function
     * @param value
     * @returns {boolean} whether the value was added
     */
    add: {
        value: function (value) {
            var result;

            if (!this.content) {
                this.content = [];
            }
            result = this.content.add(value);
            if (result) {
                this.handleAdd(value);
            }
            return result;
        }
    },

    /**
     * Proxies pushing content to the underlying collection, accounting for
     * `selectAddedContent`.
     *
     * @function
     * @param ...values
     * @returns {boolean} whether the value was added
     */
    push: {
        value: function () {
            var result = this.content.push.apply(this.content, arguments);
            for (var index = 0; index < arguments.length; index++) {
                this.handleAdd(arguments[index]);
            }
            return result;
        }
    },

    /**
     * Proxies popping content from the underlying collection.
     *
     * @function
     * @returns the popped value
     */
    pop: {
        value: function () {
            return this.content.pop();
        }
    },

    /**
     * Proxies shifting content from the underlying collection.
     *
     * @function
     * @returns the shifted value
     */
    shift: {
        value: function () {
            return this.content.shift();
        }
    },

    /**
     * Proxies unshifting content to the underlying collection, accounting for
     * `selectAddedContent`.
     *
     * @function
     * @param ...values
     * @returns {boolean} whether the value was added
     */
    unshift: {
        value: function () {
            var result = this.content.unshift.apply(this.content, arguments);
            for (var index = 0; index < arguments.length; index++) {
                this.handleAdd(arguments[index]);
            }
            return result;
        }
    },

    /**
     * Proxies splicing values into the underlying collection.
     * Accounts for * `selectAddedContent`.
     *
     * @function
     * @returns the resulting content
     */
    splice: {
        value: function () {
            var result = this.content.splice.apply(this.content, arguments);
            for (var index = 2; index < arguments.length; index++) {
                this.handleAdd(arguments[index]);
            }
            return result;
        }
    },

    /**
     * Proxies swapping values in the underlying collection.
     * Accounts for * `selectAddedContent`
     *
     * @function
     * @param {number} index the position at which to remove values
     * @param {number} minusLength the number of values to remove
     * @param {Array} plus the values to add
     * @returns {Array} `minus`, the removed values from the content
     */
    swap: {
        value: function (index, length, values) {
            var result = this.content.swap.apply(this.content, arguments);
            if (values) {
                for (var index = 2; index < values.length; index++) {
                    this.handleAdd(values[index]);
                }
            }
            return result;
        }
    },

    /**
     * Proxies deleting content from the underlying collection.
     *
     * @function
     * @param value
     * @returns {boolean} whether the value was found and deleted successfully
     */
    "delete": {
        value: function (value) {
            return this.content["delete"](value);
        }
    },

    /**
     * Does the value exist in the content?
     *
     * @function
     * @param {object} value the value to test for
     * @returns {boolean}
     */
    has: {
        value: function (value) {
            if (this.content) {
                return this.content.has(value);
            } else {
                return false;
            }
        }
    },

    /**
     * Proxies adding each value into the underlying collection.
     *
     * @function
     * @param {...object} values
     */
    addEach: {
        value: GenericCollection.prototype.addEach
    },

    /**
     * Proxies deleting each value out from the underlying collection.
     * @function
     * @param {...object} values
     */
    deleteEach: {
        value: GenericCollection.prototype.deleteEach
    },

    /**
     * Proxies clearing the underlying content collection.
     * @function
     */
    clear: {
        value: function () {
            this.content.clear();
        }
    },

    /**
     * Creates content and adds it to the controller and its backing
     * collection.
     * Uses `add` and `contentConstructor`.
     * @function
     * @returns the value constructed and added
     */
    addContent: {
        value: function () {
            var content = new this.contentConstructor();
            this.add(content);
            return content;
        }
    },

    /**
     * @private
     */
    _contentConstructor: {
        value: null
    },

    /**
     * Creates a content value for this range controller.
     * If the backing
     * collection has an intrinsict type, uses its `contentConstructor`.
     * Otherwise, creates and returns simple, empty objects.
     *
     * This property can be set to an alternate content constructor, which will
     * take precedence over either of the above defaults.
     *
     * @type {function}
     */
    contentConstructor: {
        get: function () {
            if (this._contentConstructor) {
                return this._contentConstructor;
            } else if (this.content && this.content.contentConstructor) {
                return this.content.contentConstructor;
            } else {
                return Object;
            }
        },
        set: function (contentConstructor) {
            this._contentConstructor = contentConstructor;
        }
    },

    /**
     * Dispatched by range changes to the controller's content, arranged in
     * constructor.
     * Reacts to content changes to ensure that content that no
     * longer exists is removed from the selection, regardless of whether it is
     * from the user or any other entity modifying the backing collection.
     * @private
     */
    handleContentRangeChange: {
        value: function (plus, minus, index) {
            if (this.selection.length > 0) {
                var equals = this.content && this.content.contentEquals || Object.is;
                // remove all values from the selection that were removed (but
                // not added back)
                minus.deleteEach(plus, equals);
                if (this.selection) {
                    this.selection.deleteEach(minus);
                }
            }
        }
    },

    /**
     * Watches changes to the private reflection of the public selection,
     * enforcing the `multiSelect` and `avoidsEmptySelection` invariants.
     * @private
     */
    handleSelectionRangeChange : {
        value: function (plus, minus, index) {
            if (this.selection) {
                if (this.content) {
                    var notInContent = [];
                    for (var i=0;i<plus.length;i++) {
                        if (!this.content.has(plus[i])) {
                            notInContent.push(plus[i]);
                        }
                    }
                    this._selection.deleteEach(notInContent);
                    if (!this.multiSelect && this._selection.length > 1) {
                        var last = this._selection.pop();
                        this._selection.clear();
                        this._selection.add(last);
                    }
                    if (this.avoidsEmptySelection && this._selection.length == 0) {
                        this._selection.add(minus[0]);
                    }
                } else {
                    this._selection.clear();
                }
            }
        }
    },

    /**
     * Dispatched by a range-at-path change listener arranged in constructor.
     * Synchronizes the `iterations` with changes to `organizedContent`.
     * Also manages the `deselectInvisibleContent` invariant.
     * @private
     */
    handleOrganizedContentRangeChange: {
        value: function (plus, minus, index) {
            if (this.deselectInvisibleContent && this.selection) {
                var diff = minus.clone(1);
                diff.deleteEach(plus);
                this.selection.deleteEach(minus);
            }
        }
    },

    /**
     * Dispatched by changes to sortPath, filterPath, and reversed to maintain
     * the `clearSelectionOnOrderChange` invariant.
     * @private
     */
    handleOrderChange: {
        value: function () {
            if (this.clearSelectionOnOrderChange && this.selection) {
                this.selection.clear();
            }
        }
    },

    /**
     * Dispatched manually by all of the managed methods for adding values to
     * the underlying content, like `add` and `push`, to support `multiSelect`.
     * @private
     */
    handleAdd: {
        value: function (value) {
            if (this.selectAddedContent && this.selection) {
                if (
                    !this.multiSelect &&
                    this.selection.length >= 1
                ) {
                    this.selection.clear();
                }
                this.selection.add(value);
            }
        }
    },

    /**
     * Enforces the `multiSelect` invariant when that property becomes true.
     * @private
     */
    handleMultiSelectChange: {
        value: function () {
            if (this.selection) {
                var length = this.selection.length;
                if (!this.multiSelect && length > 1) {
                    var last = this._selection.pop();
                    this._selection.clear();
                    this._selection.add(last);
                }
            }
        }
    }

}, /** @lends RangeController */ {

    blueprintModuleId:require("./core")._blueprintModuleIdDescriptor,

    blueprint:require("./core")._blueprintDescriptor

});

// TODO @kriskowal scrollIndex, scrollDelegate -> scrollDelegate.scrollBy(offset)

// TODO multiSelectWithModifiers to support ctrl/command/shift selection such
// that individual values and ranges of values.

// TODO @kriskowal decouple such that content controllers can be chained using
// adapter pattern


}})
;
//*/
montageDefine("59d9e99","ui/main.reel/main",{dependencies:["montage/ui/component","montage/core/range-controller","core/todo","montage/core/serialization/serializer/montage-serializer","montage/core/serialization/deserializer/montage-deserializer"],factory:function(require,exports,module){var Component = require('montage/ui/component').Component;
var RangeController = require('montage/core/range-controller').RangeController;
var Todo = require('core/todo').Todo;
var Serializer = require('montage/core/serialization/serializer/montage-serializer').MontageSerializer;
var Deserializer = require('montage/core/serialization/deserializer/montage-deserializer').MontageDeserializer;
var LOCAL_STORAGE_KEY = 'todos-montage';

exports.Main = Component.specialize({

    _newTodoForm: {
        value: null
    },

    _newTodoInput: {
        value: null
    },

    todoListController: {
        value: null
    },

    constructor: {
        value: function Main() {
            this.todoListController = new RangeController();
            this.addPathChangeListener('todos.every{completed}', this, 'handleTodosCompletedChanged');

            this.defineBindings({
                'todos': {'<-': 'todoListController.content'},
                'todosLeft': {'<-': 'todos.filter{!completed}'},
                'todosCompleted': {'<-': 'todos.filter{completed}'}
            });
        }
    },

    _selectedFilter: {
        value: null
    },

    selectedFilter: {
        set: function (selectedFilter) {
            if (this._selectedFilter !== selectedFilter) {
                this._selectedFilter = selectedFilter;

                if (this.todoListController) {
                    var filterPath = null;

                    if (selectedFilter) {
                        filterPath = selectedFilter === "active" ? "!completed" :
                            selectedFilter === "completed" ? "completed" : null;
                    }

                    this.todoListController.filterPath = filterPath;
                }
            }
        },
        get: function () {
            return this._selectedFilter;
        }
    },

    templateDidLoad: {
        value: function () {
            this.load();
        }
    },

    load: {
        value: function () {
            if (localStorage) {
                var todoSerialization = localStorage.getItem(LOCAL_STORAGE_KEY);

                if (todoSerialization) {
                    var deserializer = new Deserializer(),
                        self = this;

                    deserializer.init(todoSerialization, require)
                    .deserializeObject()
                    .then(function (todos) {
                        self.todoListController.content = todos;
                    }).fail(function (error) {
                        console.error('Could not load saved tasks.');
                        console.debug('Could not deserialize', todoSerialization);
                        console.log(error.stack);
                    });
                }
            }
        }
    },

    save: {
        value: function () {
            if (localStorage) {
                var todos = this.todoListController.content,
                    serializer = new Serializer().initWithRequire(require);

                localStorage.setItem(LOCAL_STORAGE_KEY, serializer.serializeObject(todos));
            }
        }
    },

    enterDocument: {
        value: function (firstTime) {
            if (firstTime) {
                this._newTodoForm.identifier = 'newTodoForm';
                this._newTodoForm.addEventListener('submit', this, false);

                if (window.location && window.location.hash) {
                    var selectedFilter = window.location.hash.substring(2);

                    if (selectedFilter === "active" || selectedFilter === "completed") {
                        this._filterController.value = selectedFilter;
                    }
                }

                this.addEventListener('destroyTodo', this, true);

                window.addEventListener('beforeunload', this, true);
            }
        }
    },

    captureDestroyTodo: {
        value: function (evt) {
            this.destroyTodo(evt.detail.todo);
        }
    },

    createTodo: {
        value: function (title) {
            var todo = new Todo().initWithTitle(title);
            this.todoListController.add(todo);
            return todo;
        }
    },

    destroyTodo: {
        value: function (todo) {
            this.todoListController.delete(todo);
            return todo;
        }
    },

    _allCompleted: {
        value: null
    },

    allCompleted: {
        get: function () {
            return this._allCompleted;
        },
        set: function (value) {
            this._allCompleted = value;
            if (this.todoListController && this.todoListController.content) {
                this.todoListController.content.forEach(function (member) {
                    member.completed = value;
                });
            }
        }
    },

    todos: {
        value: null
    },

    todosLeft: {
        value: null
    },

    todosCompleted: {
        value: null
    },

    // Handlers

    handleNewTodoFormSubmit: {
        value: function (evt) {
            evt.preventDefault();

            var title = this._newTodoInput.value.trim();

            if (title === '') {
                return;
            }

            this.createTodo(title);
            this._newTodoInput.value = null;
        }
    },

    handleTodosCompletedChanged: {
        value: function (value) {
            this._allCompleted = value;
            this.dispatchOwnPropertyChange('allCompleted', value);
        }
    },

    handleClearCompletedButtonAction: {
        value: function () {
            var completedTodos = this.todoListController.content.filter(function (todo) {
                return todo.completed;
            });

            if (completedTodos.length > 0) {
                this.todoListController.deleteEach(completedTodos);
            }
        }
    },

    captureBeforeunload: {
        value: function () {
            this.save();
        }
    }
});

}})
;
//*/
montageDefine("af1b182","composer/composer",{dependencies:["../core/target"],factory:function(require,exports,module){/**
 * @module montage/composer/composer
 * @requires montage/core/target
 */
var Target = require("../core/target").Target;

/**
 * The `Composer` helps to keep event normalization and calculation out of
 * specific `Component`s and in a reusable place. For example, the
 * `TranslateComposer` handles listening to different mouse and touch events
 * that represent dragging, and emits common `translate` events with helpful
 * information about the move.
 *
 * Specific composersshould specialize this `Composer` class and implement the
 * `load` and `unload` methods to attach and remove their event listeners.
 * Subclasses can also implement `frame` if they need access to their
 * component's draw cycle.
 *
 * @classdesc Abstracts a pattern of DOM events, emitting more useful,
 * higher-level events.
 * @class Composer
 * @extends Target
 */
exports.Composer = Target.specialize( /** @lends Composer# */ {

    _component: {
        value: null
    },

    /**
     * The Montage `Component` this `Composer` is attached to. Each composer is
     * attached to a single component. By default, most composer will listen to
     * DOM events on this component's element. This is also the component whose
     * draw cycle is affected by `needsFrame` and `frame`.
     * @type {Component}
     * @default null
     */
    component: {
        get: function () {
            return this._component;
        },
        set: function (component) {
            this._component = component;
        }
    },

    _element: {
        value: null
    },

    /**
     * The DOM element where the composer will listen for events. If no element
     * is specified then the composer will use the element associated with its
     * `component` property.
     *
     * Subclasses may want to set their `element` to something other than the
     * component's element during `load` for certain event patterns. One common
     * pattern is to set element to `window` to listen for events anywhere on
     * the page.
     * @type {Element}
     * @default null
     */
    element: {
        get: function () {
            return this._element;
        },
        set: function (element) {
            this._element = element;
        }
    },


    /**
     * This property controls when the component will call this composer's
     * `load` method, which is where the composer adds its event listeners:
     *
     * - If `false`, the component will call `load` during the next draw cycle
     *   after the composer is added to it.
     * - If `true`, the component will call `load` after its
     *   `prepareForActivationEvents`.
     *
     * Delaying the creation of event listeners can improve performance.
     * @default true
     */
    lazyLoad: {
        value: true
    },

    _needsFrame: {
        value: false
    },

    /**
     * This property should be set to 'true' when the composer wants to have
     * its `frame()` method executed during the next draw cycle. Setting this
     * property to 'true' will cause Montage to schedule a new draw cycle if
     * one has not already been scheduled.
     * @type {boolean}
     * @default false
     */
    needsFrame: {
        set: function (value) {
            if (this._needsFrame !== value) {
                this._needsFrame = value;

                if (this._component && value) {
                    this._component.scheduleComposer(this);
                }
            }
        },
        get: function () {
            return this._needsFrame;
        }
    },

    /**
     * This method will be invoked by the framework at the beginning of a draw
     * cycle. This is where a composer may implement its update logic if it
     * needs to respond to draws by its component.
     * @function
     * @param {Date} timestamp The time that the draw cycle started
     */
    frame: {
        value: Function.noop
    },


    /**
     * Invoked by the framework to default the composer's element to the
     * component's element if necessary.
     * @private
     */
    _resolveDefaults: {
        value: function () {
            if (!this.element && this.element == null && this.component != null) {
                this.element = this.component.element;
            }
        }
    },

    _isLoaded: {
        value: false
    },

    isLoaded: {
        get: function () {
            return this._isLoaded;
        }
    },

    /**
     * The component calls `load` on its composers when they should initialize
     * themselves. Exactly when this happens is controlled by the composer's
     * `lazyLoad` property.
     *
     * Subclasses should override `load` with their DOM initialization. Most
     * composers attach DOM event listeners to `this.element` in `load`.
     *
     * @function
     */
    load: {
        value: Function.noop
    },

    /**
     * The `component` will call `unload` when the composer is removed from the
     * component or the component is removed.
     *
     * Subclasses should override `unload` to do any necessary cleanup, such as
     * removing event listeners.
     *
     * @function
     */
    unload: {
        value: Function.noop
    },

    /**
     * Called when a composer is part of a template serialization. It's
     * responsible for calling `addComposer` on the component.
     * @private
     */
    deserializedFromTemplate: {
        value: function () {
            if (this.component) {
                this.component.addComposer(this);
            }
        }
    }

}, {

    isCoordinateOutsideRadius: {
        value: function (x, y, radius) {
            return x * x + y * y > radius * radius;
        }
    }

});

}})
;
//*/
montageDefine("af1b182","core/radio-button-controller",{dependencies:["./core","./range-controller"],factory:function(require,exports,module){
var Montage = require("./core").Montage,
    RangeController = require("./range-controller").RangeController;

/**
 * The radio button controller intermediates between a set of options and their
 * visual representation as radio buttons. The controller maintains the
 * invariant that only one radio button at a time may be selected and provides
 * a value property with the currently-selected option.
 *
 * @class RadioButtonController
 * @classdesc Manages the selection of mutually-exclusive [RadioButton]{@link
 * AbstractRadioButton}s.
 * @extends Montage
 */
exports.RadioButtonController = Montage.specialize(/** @lends RadioButtonController# */ {

    _radioButtons: {
        value: null
    },

    _content: {
        value: null
    },

    /**
     * The list of possible options.
     * @type Array.<Object>
     */
    content: {
        get: function () {
            return this.getPath("contentController.content");
        },
        set: function (content) {
            this.contentController = new RangeController()
                .initWithContent(content);
        }
    },

    contentController: {
        value: null
    },

    /**
     * The radio button component corresponding to the currently-selected option.
     * @type {?Component}
     */
    selectedRadioButton: {
        value: null
    },

    _value: {
        value: null
    },

    /**
     * The currently-selected option.
    */
    value: {
        set: function (value) {
            if (this._value !== value) {
                this._value = value;
                this._updateRadioButtons();
            }
        },
        get: function () {
            return this._value;
        }
    },

    constructor: {
        value: function RadioButtonController() {
            this._radioButtons = [];

            this.addRangeAtPathChangeListener("_radioButtons.map{checked}", this, "handleRadioButtonChange");
            this.defineBinding("value ", {
                "<->": "contentController.selection.0"
            });
        }
    },

    _updateRadioButtons: {
        value: function () {
            var value = this._value;

            for (var i = 0, ii = this._radioButtons.length; i < ii; i++) {
                if (value === this._radioButtons[i].value) {
                    this._radioButtons[i].checked = true;
                    break;
                }
            }
        }
    },

    /**
     * Add a radio button to be managed by this controller.
     * @function
     * @param {RadioButton} radioButton
     * @returns {undefined}
     */
    registerRadioButton: {
        value: function (radioButton) {
            if (this._radioButtons.indexOf(radioButton) === -1) {
                this._radioButtons.push(radioButton);
                this._updateRadioButtons();
            }
        }
    },

    /**
     * Remove a radio button from being managed by this controller.
     * @function
     * @param {RadioButton} radioButton
     * @returns {undefined}
     */
    unregisterRadioButton: {
        value: function (radioButton) {
            var ix = this._radioButtons.indexOf(radioButton);
            if (ix >= 0) {
                this._radioButtons.splice(ix, 1);
                if (radioButton === this.selectedRadioButton) {
                    this.selectedRadioButton = null;
                }
            }
        }
    },

    handleRadioButtonChange: {
        value: function (plus, minus, index) {
            if (plus[0] === true) {
                for (var i = 0, ii = this._radioButtons.length; i < ii; i++) {
                    if (i === index) {
                        this.selectedRadioButton = this._radioButtons[i];
                        this.value = this.selectedRadioButton.value;
                    } else {
                        this._radioButtons[i].checked = false;
                    }
                }
            }
        }
    }

}, /** @lends RadioButtonController. */ {

    blueprintModuleId:require("./core")._blueprintModuleIdDescriptor,

    blueprint:require("./core")._blueprintDescriptor

});


}})
;
//*/
montageDefine("59d9e99","ui/todo-view.reel/todo-view.html",{text:'<!DOCTYPE html><html><head>\n        <meta charset=utf-8>\n        <title>TodoView</title>\n\n        <script type=text/montage-serialization>\n        {\n            "owner": {\n                "properties": {\n                    "element": {"#": "todoView"},\n                    "editInput": {"@": "editInput"}\n                }\n            },\n\n            "todoTitle": {\n                "prototype": "montage/ui/text.reel",\n                "properties": {\n                    "element": {"#": "todoTitle"}\n                },\n                "bindings": {\n                    "value": {"<-": "@owner.todo.title"}\n                }\n            },\n\n            "todoCompletedCheckbox": {\n                "prototype": "native/ui/input-checkbox.reel",\n                "properties": {\n                    "element": {"#": "todoCompletedCheckbox"}\n                },\n                "bindings": {\n                    "checked": {"<->": "@owner.todo.completed"}\n                }\n            },\n\n            "destroyButton": {\n                "prototype": "native/ui/button.reel",\n                "properties": {\n                    "element": {"#": "destroyButton"}\n                },\n                "listeners": [\n                    {\n                        "type": "action",\n                        "listener": {"@": "owner"},\n                        "capture": true\n                    }\n                ]\n            },\n\n            "editInput": {\n                "prototype": "native/ui/input-text.reel",\n                "properties": {\n                    "element": {"#": "edit-input"}\n                },\n                "bindings": {\n                    "value": {"<-": "@owner.todo.title"}\n                }\n            }\n        }\n        </script>\n    </head>\n    <body>\n        <li data-montage-id=todoView>\n            <div class=view>\n                <input data-montage-id=todoCompletedCheckbox class=toggle type=checkbox>\n                <label data-montage-id=todoTitle></label>\n                <button data-montage-id=destroyButton class=destroy></button>\n            </div>\n            <form data-montage-id=edit>\n                <input data-montage-id=edit-input class=edit value="Rule the web">\n            </form>\n        </li>\n    \n\n</body></html>'});
;
//*/
montageDefine("e396087","ui/input-checkbox.reel/input-checkbox",{dependencies:["ui/check-input"],factory:function(require,exports,module){/**
    @module "montage/ui/native/input-checkbox.reel"
    @requires montage/core/core
    @requires montage/ui/check-input
*/
var CheckInput = require("ui/check-input").CheckInput;

/**

    @class module:"montage/ui/native/input-checkbox.reel".InputCheckbox
    @extends module:montage/ui/check-input.CheckInput
*/
var InputCheckbox = exports.InputCheckbox = CheckInput.specialize({

});
InputCheckbox.addAttributes( /** @lends module:"montage/ui/native/input-checkbox.reel".InputCheckbox# */ {

/**
    Specifies if the checkbox control should receive focus when the document loads. Because Montage components are loaded asynchronously after the document has loaded, setting this property has no effect on the element's focus state.
    @type {boolean}
    @default false
*/
    autofocus: {value: false, dataType: 'boolean'},

/**
    Specifies if the checkbox control is disabled.
    @type {boolean}
    @default false
*/
    disabled: {value: false, dataType: 'boolean'},

/**
    Specifies if the checkbox is in it checked state or not.
    @type {boolean}
    @default false
*/
    checked: {value: false, dataType: 'boolean'},

/**
    The value of the id attribute of the form with which to associate the element.
    @type {string}
    @default null
*/
    form: null,

/**
    The name part of the name/value pair associated with this element for the purposes of form submission.
    @type {string}
    @default null
*/
    name: null,

/**
    Specifies if this control is readonly.
    @type {boolean}
    @default false
*/
    readonly: {value: false, dataType: 'boolean'},

/**
    A string the browser displays in a tooltip when the user hovers their mouse over the element.
    @type {string}
    @default null
*/
    title: null,
    /*
    The value associated with the checkbox. Per the WC3 specification, if the element has a <code>value</code> attribute then the value of that attribute's value is returned; otherwise, it returns "on".
    @type {string}
    @default "on"
    */
    value: {value: 'on'}
});

}})
;
//*/
montageDefine("949cf31","package.json",{exports: {"name":"matte","version":"0.2.0","repository":{"type":"git","url":"https://github.com/montagejs/matte.git"},"dependencies":{"montage":"~0.14.0","native":"~0.2.0"},"devDependencies":{"montage-testing":"~0.4.0"},"exclude":["overview.html","overview","run-tests.html","test"],"description":"matte ==============","bugs":{"url":"https://github.com/montagejs/matte/issues"},"_id":"matte@0.2.0","dist":{"shasum":"8b48052c79ac34f297a258743ea32594dc5c0a2c","tarball":"http://registry.npmjs.org/matte/-/matte-0.2.0.tgz"},"_from":"matte@0.2.0","_npmVersion":"1.3.11","_npmUser":{"name":"montage-bot","email":"francoisfrisch@gmail.com"},"maintainers":[{"name":"francoisfrisch","email":"francoisfrisch@gmail.com"},{"name":"montage-bot","email":"francoisfrisch@gmail.com"}],"directories":{},"_shasum":"8b48052c79ac34f297a258743ea32594dc5c0a2c","_resolved":"https://registry.npmjs.org/matte/-/matte-0.2.0.tgz","hash":"949cf31","mappings":{"montage":{"name":"montage","hash":"af1b182","location":"../montage@af1b182/"},"native":{"name":"native","hash":"e396087","location":"../native@e396087/"}},"production":true,"useScriptInjection":true}})
;
//*/
montageDefine("59d9e99","core/radio-button",{dependencies:["montage/ui/base/abstract-radio-button"],factory:function(require,exports,module){var AbstractRadioButton = require("montage/ui/base/abstract-radio-button").AbstractRadioButton;

/**
 * @class RadioButton
 * @extends AbstractRadioButton
 */
exports.RadioButton = AbstractRadioButton.specialize(/** @lends RadioButton# */ {

    hasTemplate: {
        value: false
    }

});

}})
bundleLoaded("index.html.bundle-1-2.js")