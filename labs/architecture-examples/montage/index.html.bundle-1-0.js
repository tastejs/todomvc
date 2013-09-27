montageDefine("6364dae","core/range-controller",{dependencies:["montage","core/promise","collections/generic-collection"],factory:function(require,exports,module){var Montage = require("montage").Montage;
var Promise = require("core/promise").Promise;
var GenericCollection = require("collections/generic-collection");

// The content controller is responsible for determining which content from a
// source collection are visible, their order of appearance, and whether they
// are selected.  Multiple repetitions may share a single content controller
// and thus their selection state.

// The controller manages a series of visible iterations.  Each iteration has a
// corresponding "object" and whether that iteration is "selected".  The
// controller uses a bidirectional binding to ensure that the controller's
// "selections" collection and the "selected" property of each iteration are in
// sync.

// The controller can determine which content to display and the order in which
// to render them in a variety of ways.  You can either use a "selector" to
// filter and sort the content or use a "visibleIndexes" array.  The controller
// binds the content of "organizedContent" depending on which strategy you use.
//
// The content of "organizedContent" is then reflected with corresponding
// incremental changes to "iterations".  The "iterations" array will always
// have an "iteration" corresponding to the "object" in "organizedContent" at
// the same position.

/**
 * A <code>RangeController</code> receives a <code>content</code> collection,
 * manages what portition of that content is visible and the order of its
 * appearance (<code>organizedContent</code>), and projects changes to the the
 * organized content into an array of iteration controllers
 * (<code>iterations</code>, containing instances of <code>Iteration</code>).
 *
 * The <code>RangeController</code> provides a variety of knobs for how to
 * project the content into the organized content, all of which are optional,
 * and the default behavior is to preserve the content and its order.  You can
 * use the bindings path expression language (from FRB) to determine the
 * <code>sortPath</code> and <code>filterPath</code>.  There is a
 * <code>reversed</code> flag to invert the order of appearance.  The
 * <code>visibleIndexes</code> property will pluck values from the sorted and
 * filtered content by position, in arbitrary order.  The <code>start</code>
 * and <code>length</code> properties manage a sliding window into the content.
 *
 * The <code>RangeController</code> is also responsible for managing which
 * content is selected and provides a variety of knobs for that purpose.
 */
var RangeController = exports.RangeController = Montage.specialize( {

    /**
     * @private
     */
    constructor: {
        value: function RangeController() {

            this.content = null;
            this._selection = [];
            this.selection = [];
            this.defineBinding("_selection.rangeContent()", {
                "<->": "selection.rangeContent()"
            });

            this.sortPath = null;
            this.filterPath = null;
            this.visibleIndexes = null;
            this.reversed = false;
            this.start = null;
            this.length = null;

            this.selectAddedContent = false;
            this.deselectInvisibleContent = false;
            this.clearSelectionOnOrderChange = false;
            this.avoidsEmptySelection = false;
            this.multiSelect = false;

            // The following establishes a pipeline for projecting the
            // underlying content into organizedContent.  The filterPath,
            // sortedPath, reversed, and visibleIndexes are all optional stages
            // in that pipeline and used if non-null and in that order.
            // The _orderedContent variable is a necessary intermediate stage
            // From which visibleIndexes plucks visible values.
            this.organizedContent = [];
            this.organizedContent.addRangeChangeListener(this, "organizedContent");
            this.defineBinding("_orderedContent", {
                "<-": "content" +
                    ".($filterPath.defined() ? filter{path($filterPath)} : ())" +
                    ".($sortPath.defined() ? sorted{path($sortPath)} : ())" +
                    ".($reversed ?? 0 ? reversed() : ())"
            });
            this.defineBinding("organizedContent.rangeContent()", {
                "<-": "_orderedContent.(" +
                    "$visibleIndexes.defined() ?" +
                    "$visibleIndexes" +
                        ".filter{<$_orderedContent.length}" +
                        ".map{$_orderedContent[()]}" +
                    " : ()" +
                ").(" +
                    "$start.defined() && $length.defined() ?" +
                    "view($start, $length)" +
                    " : ()" +
                ")"
            });

            this._selection.addRangeChangeListener(this, "selection");
            this.addRangeAtPathChangeListener("content", this, "handleContentRangeChange");
            this.addPathChangeListener("sortPath", this, "handleOrderChange");
            this.addPathChangeListener("reversed", this, "handleOrderChange");
            this.addOwnPropertyChangeListener("multiSelect", this);

            this.iterations = [];
        }
    },

    /**
     * Initializes a range controller with a backing collection.
     * @param content Any collection that produces range change events, like an
     * <code>Array</code> or <code>SortedSet</code>.
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
     * to sort by name.  If the <code>sortPath</code> is null, the content
     * is not sorted.
     */
    sortPath: {value: null},

    /**
     * Whether to reverse the order of the sorted content.
     */
    reversed: {value: null},

    /**
     * An FRB expression that determines how to filter content like
     * "name.startsWith('A')" to see only names starting with 'A'.  If the
     * <code>filterPath</code> is null, all content is accepted.
     */
    filterPath: {value: null},

    /**
     * An array of indexes to pluck from the ordered and filtered content.  The
     * output will be an array of the corresponding content.  If the
     * <code>visibleIndexes</code> is null, all content is accepted.
     */
    visibleIndexes: {value: null},

    /**
     * The first index of a sliding window over the content, suitable for
     * binding (indirectly) to the scroll offset of a large list.
     * If <code>start</code> or <code>length</code> is null, all content is
     * accepted.
     */
    start: {value: null},

    /**
     * The length of a sliding window over the content, suitable for binding
     * (indirectly) to the scroll height.
     * If <code>start</code> or <code>length</code> is null, all content is
     * accepted.
     */
    length: {value: null},


    // Managing Selection
    // ------------------

    /**
     * Whether to select new content automatically.
     *
     * Off by default.
     */
    selectAddedContent: {value: false},
    // TODO make this work

    /**
     * Whether to automatically deselect content that disappears from the
     * <code>organizedContent</code>.
     *
     * Off by default.
     */
    deselectInvisibleContent: {value: false},

    /**
     * Whether to automatically clear the selection whenever the
     * <code>sortPath</code>, <code>filterPath</code>, or <code>reversed</code>
     * knobs change.
     *
     * Off by default.
     */
    clearSelectionOnOrderChange: {value: false},

    /**
     * Whether to automatically reselect a value if it is the last value
     * removed from the selection.
     *
     * Off by default.
     */
    avoidsEmptySelection: {value: false},

    /**
     * Whether to automatically deselect all previously selected content when a
     * new selection is made.
     *
     * Off by default.
     */
    multiSelect: {value: false},


    // Properties managed by the controller
    // ------------------------------------

    /**
     * The content after it has been sorted, reversed, and filtered, suitable
     * for plucking visible indexes and/or then the sliding window.
     * @private
     */
    _orderedContent: {value: null},

    /**
     * An array incrementally projected from <code>content</code> through sort,
     * reversed, filter, visibleIndexes, start, and length.
     */
    organizedContent: {value: null},

    /**
     * An array of iterations corresponding to each of the values in
     * <code>organizedContent</code>, providing an interface for getting or
     * setting whether each is selected.
     */
    iterations: {value: null},

    /**
     * A subset of the <code>content</code> that are selected.  The user may
     * safely reassign this property and all iterations will react to the
     * change.  The selection may be <code>null</code>.  The selection may be
     * any collection that supports range change events like <code>Array</code>
     * or <code>SortedSet</code>.
     */
    selection: {value: null},

    /**
     * Because the user can replace the selection object, we use a range
     * content change listener on a hidden selection array that tracks the
     * actual selection.
     * @private
     */
    _selection: {value: null},

    /**
     * A managed interface for adding values to the selection, accounting for
     * <code>multiSelect</code>.
     * You can however directly manipulate the selection, but that will update
     * the selection asynchronously because the controller cannot change the
     * selection while handling a selection change event.
     */
    select: {
        value: function (value) {
            if (!this.multiSelect && this._selection.length >= 1) {
                this._selection.clear();
            }
            this._selection.add(value);
        }
    },

    /*
     * A managed interface for removing values from the selection, accounting
     * for <code>avoidsEmptySelection</code>.
     * You can however directly manipulate the selection, but that will update
     * the selection asynchronously because the controller cannot change the
     * selection while handling a selection change event.
     */
    deselect: {
        value: function (value) {
            if (!this.avoidsEmptySelection || this._selection.length > 1) {
                this._selection["delete"](value);
            }
        }
    },

    /*
     * A managed interface for clearing the selection, accounting for
     * <code>avoidsEmptySelection</code>.
     * You can however directly manipulate the selection, but that will update
     * the selection asynchronously because the controller cannot change the
     * selection while handling a selection change event.
     */
    clearSelection: {
        value: function () {
            if (!this.avoidsEmptySelection || this._selection.length > 1) {
                this._selection.clear();
            }
        }
    },

    /**
     * Proxies adding content to the underlying collection, accounting for
     * <code>selectAddedContent</code>.
     * @param value
     * @returns whether the value was added
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
     * <code>selectAddedContent</code>.
     * @param ...values
     * @returns whether the value was added
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
     * @returns the popped values
     */
    pop: {
        value: function () {
            return this.content.pop();
        }
    },

    /**
     * Proxies shifting content from the underlying collection.
     * @returns the shifted values
     */
    shift: {
        value: function () {
            return this.content.shift();
        }
    },

    /**
     * Proxies unshifting content to the underlying collection, accounting for
     * <code>selectAddedContent</code>.
     * @param ...values
     * @returns whether the value was added
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
     * Proxies splicing values into the underlying collection.  Accounts for
     * <code>selectAddedContent</code>
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
     * Proxies swapping values in the underlying collection.  Accounts for
     * <code>selectAddedContent</code>
     */
    swap: {
        value: function (index, length, values) {
            var result = this.content.splice.apply(this.content, values);
            for (var index = 2; index < values.length; index++) {
                this.handleAdd(values[index]);
            }
            return result;
        }
    },

    /**
     * Proxies deleting content from the underlying collection.
     */
    "delete": {
        value: function (value) {
            return this.content["delete"](value);
        }
    },

    has: {
        value: function(value) {
            if (this.content) {
                return this.content.has(value);
            } else {
                return false;
            }
        }
    },

    /**
     * Proxies adding each value into the underlying collection.
     */
    addEach: {
        value: GenericCollection.prototype.addEach
    },

    /**
     * Proxies deleting each value out from the underlying collection.
     */
    deleteEach: {
        value: GenericCollection.prototype.deleteEach
    },

    /**
     * Proxies clearing the underlying content collection.
     */
    clear: {
        value: function () {
            this.content.clear();
        }
    },

    /**
     * Creates content and adds it to the controller and its backing
     * collection.  Uses `add` and `contentConstructor`.
     */
    addContent: {
        value: function () {
            var content = new this.contentConstructor();
            this.add(content);
            return content;
        }
    },

    _contentConstructor: {
        value: null
    },

    /**
     * Creates a content value for this range controller.  If the backing
     * collection has an intrinsict type, uses its `contentConstructor`.
     * Otherwise, creates and returns simple, empty objects.
     *
     * This property can be set to an alternate content constructor, which will
     * take precedence over either of the above defaults.
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
     * constructor.  Reacts to content changes to ensure that content that no
     * longer exists is removed from the selection, regardless of whether it is
     * from the user or any other entity modifying the backing collection.
     * @private
     */
    handleContentRangeChange: {
        value: function (plus, minus, index) {
            // remove all values from the selection that were removed (but
            // not added back)
            minus.deleteEach(plus);
            this._selection.deleteEach(minus);
        }
    },

    /**
     * Dispatched by a range-at-path change listener on the selection, arragned
     * in constructor.  Reacts to managed (as by the select or deselect methods)
     * or unmanaged changes to the selection by enforcing the
     * <code>avoidsEmptySelection</code> and
     * <code>multiSelect</code> invariants.  However, it must
     * schedule these changes for a separate event because it cannot interfere
     * with the change operation in progress.
     * @private
     */
    handleSelectionRangeChange: {
        value: function (plus, minus, index) {
            var self = this;
            Promise.nextTick(function () {
                var length = self._selection.length;
                // Performing these in next tick avoids interfering with the
                // plan in the dispatcher, highlighting the fact that there is
                // a plan interference hazard inherent to the present
                // implementation of collection event dispatch.
                if (self.avoidsEmptySelection && length === 0) {
                    self.select(minus[minus.length - 1]);
                } else if (!self.multiSelect && length > 1) {
                    self._selection.splice(0, self._selection.length, plus[plus.length - 1]);
                }
            });
        }
    },

    /**
     * Dispatched by a range-at-path change listener arranged in constructor.
     * Synchronizes the <code>iterations</code> with changes to
     * <code>organizedContent</code>.  Also manages the
     * <code>deselectInvisibleContent</code> invariant.
     * @private
     */
    handleOrganizedContentRangeChange: {
        value: function (plus, minus, index) {
            if (this.deselectInvisibleContent) {
                var diff = minus.clone(1);
                diff.deleteEach(plus);
                this._selection.deleteEach(minus);
            }
        }
    },

    /**
     * Dispatched by changes to sortPath, filterPath, and reversed to maintain
     * the <code>clearSelectionOnOrderChange</code> invariant.
     * @private
     */
    handleOrderChange: {
        value: function () {
            if (this.clearSelectionOnOrderChange) {
                this._selection.clear();
            }
        }
    },

    /**
     * Dispatched manually by all of the managed methods for adding values to
     * the underlying content, like <code>add</code> and <code>push</code>, to
     * support <code>multiSelect</code>.
     * @private
     */
    handleAdd: {
        value: function (value) {
            if (this.selectAddedContent) {
                if (
                    !this.multiSelect &&
                    this._selection.length >= 1
                ) {
                    this._selection.clear();
                }
                this._selection.add(value);
            }
        }
    },

    handleMultiSelectChange: {
        value: function() {
            var length = this._selection.length;

            if (!this.multiSelect && length > 1) {
                this._selection.splice(0, length - 1);
            }
        }
    }

}, {

    blueprintModuleId:require("montage")._blueprintModuleIdDescriptor,

    blueprint:require("montage")._blueprintDescriptor

});

// TODO @kriskowal scrollIndex, scrollDelegate -> scrollDelegate.scrollBy(offset)

// TODO multiSelectWithModifiers to support ctrl/command/shift selection such
// that individual values and ranges of values.

// TODO @kriskowal decouple such that content controllers can be chained using
// adapter pattern


}})
;
//*/
montageDefine("262b1a4","ui/dynamic-element.reel/dynamic-element",{dependencies:["montage/ui/component"],factory:function(require,exports,module){/* <copyright>
Copyright (c) 2012, Motorola Mobility LLC.
All Rights Reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice,
  this list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of Motorola Mobility LLC nor the names of its
  contributors may be used to endorse or promote products derived from this
  software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
POSSIBILITY OF SUCH DAMAGE.
</copyright> */
/**
    module:"matte/ui/dynamic-element.reel"
*/
var Component = require("montage/ui/component").Component;


/**
    The DynamicElement is a general purpose component that aims to expose all the properties of the element as a component.
    @class module:"matte/ui/dynamic-element.reel".DynamicElement
    @extends module:montage/ui/component.Component
*/
exports.DynamicElement = Component.specialize(/** @lends module:"matte/ui/dynamic-element.reel".DynamicElement# */ {

    hasTemplate: {
        value: false
    },

    _innerHTML: {
        value: null
    },

    _usingInnerHTML: {
        value: null
    },

    /**
        The innerHTML displayed as the content of the DynamicElement
        @type {Property}
        @default null
    */
    innerHTML: {
        get: function() {
            return this._innerHTML;
        },
        set: function(value) {
            this._usingInnerHTML = true;
            if (this._innerHTML !== value) {
                this._innerHTML = value;
                this.needsDraw = true;
            }
        }
    },

    /**
        The default html displayed if innerHTML is falsy.
        @type {Property}
        @default {String} ""
    */
    defaultHTML: {
        value: ""
    },

    _allowedTagNames: {
        value: null
    },

    /**
        White list of allowed tags in the innerHTML
        @type {Property}
        @default null
    */
    allowedTagNames: {
        get: function() {
            return this._allowedTagNames;
        },
        set: function(value) {
            if (this._allowedTagNames !== value) {
                this._allowedTagNames = value;
                this.needsDraw = true;
            }
        }
    },



    _range: {
        value: null
    },

    enterDocument: {
        value: function(firstTime) {
            if (firstTime) {
                var range = document.createRange(),
                    className = this.element.className;
                range.selectNodeContents(this.element);
                this._range = range;
            }
        }
    },

    _contentNode: {
        value: null
    },

    draw: {
        value: function() {
            // get correct value
            var displayValue = (this.innerHTML || 0 === this.innerHTML ) ? this.innerHTML : this.defaultHTML,
                content, allowedTagNames = this.allowedTagNames, range = this._range, elements;

            //push to DOM
            if(this._usingInnerHTML) {
                if (allowedTagNames !== null) {
                    //cleanup
                    this._contentNode = null;
                    range.deleteContents();
                    //test for tag white list
                    content = range.createContextualFragment( displayValue );
                    if(allowedTagNames.length !== 0) {
                        elements = content.querySelectorAll("*:not(" + allowedTagNames.join("):not(") + ")");
                    } else {
                        elements = content.childNodes;
                    }
                    if (elements.length === 0) {
                        range.insertNode(content);
                        if(range.endOffset === 0) {
                            // according to https://bugzilla.mozilla.org/show_bug.cgi?id=253609 Firefox keeps a collapsed
                            // range collapsed after insertNode
                            range.selectNodeContents(this.element);
                        }

                    } else {
                        console.warn("Some Elements Not Allowed " , elements);
                    }
                } else {
                    content = this._contentNode;
                    if(content === null) {
                        //cleanup
                        range.deleteContents();
                        this._contentNode = content = document.createTextNode(displayValue);
                        range.insertNode(content);
                        if(range.endOffset === 0) {
                            // according to https://bugzilla.mozilla.org/show_bug.cgi?id=253609 Firefox keeps a collapsed
                            // range collapsed after insert
                            range.selectNodeContents(this.element);
                        }

                    } else {
                        content.data = displayValue;
                    }
                }
            }
        }
    }
});

}})
;
//*/
montageDefine("5bf8252","ui/native-control",{dependencies:["montage/ui/component"],factory:function(require,exports,module){/**
    @module montage/ui/native-control
*/

var Component = require("montage/ui/component").Component;

/**
    Base component for all native components, such as RadioButton and Checkbox.
    @class module:montage/ui/native-control.NativeControl
    @extends module:montage/ui/component.Component
 */
var NativeControl = exports.NativeControl = Component.specialize(/** @lends module:montage/ui/native-control.NativeControl# */ {

    hasTemplate: {
        value: false
    },

    willPrepareForDraw: {
        value: function() {
        }
    }
});

//http://www.w3.org/TR/html5/elements.html#global-attributes
NativeControl.addAttributes( /** @lends module:montage/ui/native-control.NativeControl# */ {

/**
    Specifies the shortcut key(s) that gives focuses to or activates the element.
    @see {@link http://www.w3.org/TR/html5/editing.html#the-accesskey-attribute}
    @type {string}
    @default null
*/
    accesskey: null,

/**
    Specifies if the content is editable or not. Valid values are "true", "false", and "inherit".
    @see {@link http://www.w3.org/TR/html5/editing.html#contenteditable}
    @type {string}
    @default null

*/
    contenteditable: null,

/**
    Specifies the ID of a <code>menu</code> element in the DOM to use as the element's context menu.
    @see  {@link http://www.w3.org/TR/html5/interactive-elements.html#attr-contextmenu}
    @type {string}
    @default null
*/
    contextmenu: null,

/**
    Specifies the elements element's text directionality. Valid values are "ltr", "rtl", and "auto".
    @see {@link http://www.w3.org/TR/html5/elements.html#the-dir-attribute}
    @type {string}
    @default null
*/
    dir: null,

/**
    Specifies if the element is draggable. Valid values are "true", "false", and "auto".
    @type {string}
    @default null
    @see {@link http://www.w3.org/TR/html5/dnd.html#the-draggable-attribute}
*/
    draggable: null,

/**
    Specifies the behavior that's taken when an item is dropped on the element. Valid values are "copy", "move", and "link".
    @type {string}
    @see {@link http://www.w3.org/TR/html5/dnd.html#the-dropzone-attribute}
*/
    dropzone: null,

/**
    When specified on an element, it indicates that the element should not be displayed.
    @type {boolean}
    @default false
*/
    hidden: {dataType: 'boolean'},
    //id: null,

/**
    Specifies the primary language for the element's contents and for any of the element's attributes that contain text.
    @type {string}
    @default null
    @see {@link http://www.w3.org/TR/html5/elements.html#attr-lang}
*/
    lang: null,

/**
    Specifies if element should have its spelling and grammar checked by the browser. Valid values are "true", "false".
    @type {string}
    @default null
    @see {@link http://www.w3.org/TR/html5/editing.html#attr-spellcheck}
*/
    spellcheck: null,

/**
    The CSS styling attribute.
    @type {string}
    @default null
    @see {@link http://www.w3.org/TR/html5/elements.html#the-style-attribute}
*/
    style: null,

/**
     Specifies the relative order of the element for the purposes of sequential focus navigation.
     @type {number}
     @default null
     @see {@link http://www.w3.org/TR/html5/editing.html#attr-tabindex}
*/
    tabindex: null,

/**
    Specifies advisory information about the element, used as a tooltip when hovering over the element, and other purposes.
    @type {string}
    @default null
    @see {@link http://www.w3.org/TR/html5/elements.html#the-title-attribute}
*/
    title: null
});

}})
;
//*/
montageDefine("37bb2cd","ui/todo-view.reel/todo-view.html",{text:'<!doctype html>\n<html>\n    <head>\n        <meta charset=utf-8>\n        <title>TodoView</title>\n\n        <script type="text/montage-serialization">\n        {\n            "owner": {\n                "properties": {\n                    "element": {"#": "todoView"},\n                    "editInput": {"@": "editInput"}\n                }\n            },\n\n            "todoTitle": {\n                "prototype": "montage/ui/text.reel",\n                "properties": {\n                    "element": {"#": "todoTitle"}\n                },\n                "bindings": {\n                    "value": {"<-": "@owner.todo.title"}\n                }\n            },\n\n            "todoCompletedCheckbox": {\n                "prototype": "native/ui/input-checkbox.reel",\n                "properties": {\n                    "element": {"#": "todoCompletedCheckbox"}\n                },\n                "bindings": {\n                    "checked": {"<->": "@owner.todo.completed"}\n                }\n            },\n\n            "destroyButton": {\n                "prototype": "native/ui/button.reel",\n                "properties": {\n                    "element": {"#": "destroyButton"}\n                },\n                "listeners": [\n                    {\n                        "type": "action",\n                        "listener": {"@": "owner"},\n                        "capture": true\n                    }\n                ]\n            },\n\n            "editInput": {\n                "prototype": "native/ui/input-text.reel",\n                "properties": {\n                    "element": {"#": "edit-input"}\n                },\n                "bindings": {\n                    "value": {"<-": "@owner.todo.title"}\n                }\n            }\n        }\n        </script>\n    </head>\n    <body>\n        <li data-montage-id=todoView>\n            <div class=view>\n                <input type=checkbox data-montage-id=todoCompletedCheckbox class=toggle>\n                <label data-montage-id=todoTitle></label>\n                <button data-montage-id=destroyButton class=destroy></button>\n            </div>\n            <form data-montage-id=edit>\n                <input data-montage-id=edit-input class=edit value="Rule the web">\n            </form>\n        </li>\n    </body>\n</html>'});
;
//*/
montageDefine("5bf8252","package.json",{exports: {"name":"native","version":"0.1.2","repository":{"type":"git","url":"https://github.com/montagejs/native.git"},"dependencies":{"montage":"~0.13.0"},"devDependencies":{"montage-testing":"~0.2.0"},"exclude":["overview.html","overview","run-tests.html","test"],"readme":"montage-native\n==============\n\nThis is the Montage package template.\n\nNote: Before working on your package you will need to add montage to it.\n\n```\nnpm install .\n```\n\nLayout\n------\n\nThe template contains the following files and directories:\n\n* `ui/` – Directory containing all the UI .reel directories.\n* `package.json` – Describes your app and its dependencies\n* `README.md` – This readme. Replace the current content with a description of your app\n* `overview.html`\n* `overview/` – Directory that contains the files for the overview page. This is a different package so you will need to require the component using montage-native/*.\n  * `main.reel` – The main interface component where you can add the components to show.\n* `node_modules/` – Directory containing all npm packages needed, including Montage. Any packages here must be included as `dependencies` in `package.json` for the Montage require to find them.\n* `test/` – Directory containing tests for your package.\n  * `all.js` – Module that point the test runner to all your jasmine specs.\n* `run-tests.html` – Page to run jasmine tests manually in your browser\n* `testacular.conf.js` – This is the testacular configuration file. You can start testacular by running `node_modules/testacular/bin/testacular start`\n\nCreate the following directories if you need them:\n\n* `locale/` – Directory containing localized content.\n* `scripts/` – Directory containing other JS libraries. If a library doesn’t support the CommonJS \"exports\" object it will need to be loaded through a `<script>` tag.\n\n","readmeFilename":"README.md","description":"montage-native ==============","bugs":{"url":"https://github.com/montagejs/native/issues"},"_id":"native@0.1.2","_from":"native@~0.1.2","directories":{"lib":"./"},"hash":"5bf8252","mappings":{"montage":{"name":"montage","hash":"6364dae","location":"../montage@6364dae/"}},"production":true,"useScriptInjection":true}})
bundleLoaded("index.html.bundle-1-0.js")