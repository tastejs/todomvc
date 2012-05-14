goog.provide('todomvc.view.ItemCountControlRenderer');

goog.require('goog.dom');
goog.require('goog.ui.Component.State');
goog.require('goog.ui.ControlRenderer');

/**
 * A renderer for the item count control.
 *
 * @constructor
 * @extends {goog.ui.ControlRenderer}
 */
todomvc.view.ItemCountControlRenderer = function() {
    goog.ui.ControlRenderer.call(this);
};
goog.inherits(todomvc.view.ItemCountControlRenderer, goog.ui.ControlRenderer);

// add getInstance method to todomvc.view.ItemCountControlRenderer
goog.addSingletonGetter(todomvc.view.ItemCountControlRenderer);

/**
 * @param {goog.ui.Control} control Control to render.
 * @return {Element} Root element for the control.
 */
todomvc.view.ItemCountControlRenderer.prototype.createDom = function(control) {
    var html = todomvc.view.itemCount({
        number: control.getContent()
    });
    var element = (/**@type {!Element}*/ goog.dom.htmlToDocumentFragment(html));
    this.setAriaStates(control, element);
    return element;
};

/**
 * @param {Element} element Element to decorate.
 * @return {boolean} Whether the renderer can decorate the element.
 */
todomvc.view.ItemCountControlRenderer.prototype.canDecorate =
    function(element) {
    return false;
};

/**
 * @param {Element} element Element to populate.
 * @param {goog.ui.ControlContent} content Text caption or DOM.
 */
todomvc.view.ItemCountControlRenderer.prototype.setContent =
    function(element, content) {
    element.innerHTML = todomvc.view.itemCountInner({
        number: content
    });
};

/**
 * Updates the appearance of the control in response to a state change.
 *
 * @param {goog.ui.Control} control Control instance to update.
 * @param {goog.ui.Component.State} state State to enable or disable.
 * @param {boolean} enable Whether the control is entering or exiting the state.
 */
todomvc.view.ItemCountControlRenderer.prototype.setState =
    function(control, state, enable) {
    var element = control.getElement();
    if (element) {
        this.updateAriaState(element, state, enable);
    }
};
