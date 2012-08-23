goog.provide('todomvc.view.ToDoItemControl');

goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.events.KeyCodes');
goog.require('goog.string');
goog.require('goog.ui.Component.State');
goog.require('goog.ui.Control');

goog.require('todomvc.view.ToDoItemControlRenderer');

/**
 * A control representing each item in the todo list. It makes use of the
 * CHECKED and SELECTED states to represent being done and being in edit mode.
 *
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper,
 * used for document interaction.
 * @constructor
 * @extends {goog.ui.Control}
 */
todomvc.view.ToDoItemControl = function(opt_domHelper) {
    goog.ui.Control.call(this, '', todomvc.view.ToDoItemControlRenderer
            .getInstance(), opt_domHelper);

    // enable CHECKED and SELECTED states
    this.setSupportedState(goog.ui.Component.State.CHECKED, true);
    this.setSupportedState(goog.ui.Component.State.SELECTED, true);

    // disable auto handling of CHECKED and SELECTED states
    this.setAutoStates(goog.ui.Component.State.CHECKED, false);
    this.setAutoStates(goog.ui.Component.State.SELECTED, false);

    // allow text selection
    this.setAllowTextSelection(true);
};
goog.inherits(todomvc.view.ToDoItemControl, goog.ui.Control);

/**
 * The event types this control dispatches.
 */
todomvc.view.ToDoItemControl.EventType = {
    EDIT: 'edit',
    DESTROY: 'destroy'
};


/**
 * Configures the component after its DOM has been rendered, and sets up event
 * handling. Overrides {@link goog.ui.Component#enterDocument}.
 *
 * @override
 */
todomvc.view.ToDoItemControl.prototype.enterDocument = function() {
    todomvc.view.ToDoItemControl.superClass_.enterDocument.call(this);
    // prevent clicking the checkbox (or anything within the root element)
    // from having any default behaviour. This stops the checkbox being set
    // by the browser.
    this.getHandler().listen(this.getElement(), goog.events.EventType.CLICK,
            function(e) {
                e.preventDefault();
            });
    this.getHandler().listen(this.getElement(), goog.events.EventType.DBLCLICK,
            function(e) {
                this.setSelected(true);
    });
    /**
     * @type {Element}
     */
    var inputElement = this.getRenderer().getInputElement(
            this.getElement());
    this.getHandler().listen(inputElement, goog.events.EventType.KEYUP,
            function(e) {
        var be = e.getBrowserEvent();
        if (be.keyCode === goog.events.KeyCodes.ENTER) {
            this.setFocused(false);
        }
    });
};

/**
 * Returns the renderer used by this component to render itself or to decorate
 * an existing element.
 *
 * @return {todomvc.view.ToDoItemControlRenderer} Renderer used by the
 * component.
 */
todomvc.view.ToDoItemControl.prototype.getRenderer = function() {
    return (/**@type {todomvc.view.ToDoItemControlRenderer}*/ this.renderer_);
};

/**
 * Specialised handling of mouse events when clicking on the checkbox, label,
 * textbox or remove link.
 *
 * @param {goog.events.Event} e Mouse event to handle.
 */
todomvc.view.ToDoItemControl.prototype.handleMouseUp = function(e) {
    todomvc.view.ToDoItemControl.superClass_.handleMouseUp.call(this, e);
    if (this.isEnabled()) {
        if (e.target === this.getRenderer().getCheckboxElement(
                this.getElement())) {
            this.setChecked(!this.isChecked());
            this.dispatchEvent(todomvc.view.ToDoItemControl.EventType.EDIT);
        } else if (e.target === this.getRenderer().getDestroyElement(
                this.getElement())) {
            this.dispatchEvent(todomvc.view.ToDoItemControl.EventType.DESTROY);
        }
    }
};

/**
 * Override the behaviour when the control is unfocused.
 * @param {boolean} focused is focused?
 */
todomvc.view.ToDoItemControl.prototype.setFocused = function(focused) {
    todomvc.view.ToDoItemControl.superClass_.setFocused.call(this, focused);
    if (!focused && this.isSelected()) {
        /**
         * @type {Element}
         */
        var inputElement = this.getRenderer().getInputElement(
                this.getElement());
        var value = goog.string.trim(inputElement.value);
        if (value === '') {
            this.dispatchEvent(todomvc.view.ToDoItemControl.EventType.DESTROY);
        } else {
            this.setContent(value);
            this.setSelected(false);
            this.dispatchEvent(todomvc.view.ToDoItemControl.EventType.EDIT);
        }
    }
};

/**
 * Override the behaviour to switch to editing mode when the control is selected
 * @param {boolean} selected is selected?
 */
todomvc.view.ToDoItemControl.prototype.setSelected = function(selected) {
    todomvc.view.ToDoItemControl.superClass_.setSelected.call(this, selected);
    // populate the input box when selected
    if (selected) {
        /**
         * @type {Element}
         */
        var inputElement = this.getRenderer().getInputElement(
                this.getElement());
        inputElement.value = this.getContent();
        inputElement.focus();
    }
};
