goog.provide('todomvc.view.ToDoListContainer');

goog.require('goog.ui.Container');

goog.require('todomvc.view.ToDoListContainerRenderer');

/**
 * A container for the ToDoItemControls, overridden to support keyboard focus
 * on child controls.
 *
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
 * document interaction.
 * @constructor
 * @extends {goog.ui.Container}
 */
todomvc.view.ToDoListContainer = function(opt_domHelper) {
    goog.ui.Container
            .call(this, goog.ui.Container.Orientation.VERTICAL,
                    todomvc.view.ToDoListContainerRenderer.getInstance(),
                    opt_domHelper);

    // allow focus on children
    this.setFocusable(false);
    this.setFocusableChildrenAllowed(true);
};
goog.inherits(todomvc.view.ToDoListContainer, goog.ui.Container);

/**
 * Override this method to allow text selection in children.
 *
 * @param {goog.events.BrowserEvent} e Mousedown event to handle.
 */
todomvc.view.ToDoListContainer.prototype.handleMouseDown = function(e) {
    if (this.enabled_) {
        this.setMouseButtonPressed(true);
    }
};
