/**

@property maria.Model

@description

A constructor function to create new model objects.

    var model = new maria.Model();

The most interesting feature of model objects is that they are event
targets and so can be observed by any event listeners. Other model
objects, view objects, or any other interested objects can observe by
being added as event listeners.

For example, the following view object's "update" method will be called
when a "change" event is dispatched on the model objects.

    var view = {
        update: function(evt) {
            alert('The model changed!');
        }
    };
    maria.addEventListener(model, 'change', view, 'update');

The model can dispatch a "change" event on itself when the model
changes.

    model.setContent = function(content) {
        this._content = content;
        model.dispatchEvent({type: 'change'});
    };

If desired, a model can push additional data to its observers by
including that data on the event object.

    model.setContent = function(content) {
        var previousContent = this._content;
        this._content = content;
        model.dispatchEvent({
            type: 'change',
            previousContent: previousContent,
            content: content
        });
    };

An event listener can be removed from a model object.

    maria.removeEventListener(model, 'change', view, 'update');

A particularly useful pattern is using maria.Model as the "superclass"
of your application's model. The following example shows how this
can be done at a low level for a to-do application.
See maria.Model.subclass for a more compact way to accomplish the same.

    checkit.TodoModel = function() {
        maria.Model.apply(this, arguments);
    };
    checkit.TodoModel.prototype = new maria.Model();
    checkit.TodoModel.prototype.constructor = checkit.TodoModel;
    checkit.TodoModel.prototype._content = '';
    checkit.TodoModel.prototype._isDone = false;
    checkit.TodoModel.prototype.getContent = function() {
        return this._content;
    };
    checkit.TodoModel.prototype.setContent = function(content) {
        content = ('' + content).replace(/^\s+|\s+$/g, '');
        if (this._content !== content) {
            this._content = content;
            this.dispatchEvent({type: 'change'});
        }
    };
    checkit.TodoModel.prototype.isDone = function() {
        return this._isDone;
    };
    checkit.TodoModel.prototype.setDone = function(isDone) {
        isDone = !!isDone;
        if (this._isDone !== isDone) {
            this._isDone = isDone;
            this.dispatchEvent({type: 'change'});
        }
    };
    checkit.TodoModel.prototype.toggleDone = function() {
        this.setDone(!this.isDone());
    };

The above TodoModel example does not have an "initialize" method;
however, if some special initialization is requried, maria.Model will
automatically call your "initialize" method.

    checkit.TodoModel.prototype.initialize = function() {
        alert('Another to-do has been created. You better get busy.');
    };

When a model's "destroy" method is called, a "destroy" event is
dispatched and all event listeners who've been added for this event
type will be notified.

(See evento.EventTarget for advanced information about event bubbling
using "addParentEventTarget" and "removeParentEventTarget".)

*/
maria.Model = function() {
    maria.EventTarget.call(this);
    this.initialize();
};

maria.EventTarget.mixin(maria.Model.prototype);

maria.Model.prototype.initialize = function() {};

maria.Model.prototype.destroy = function() {
    this.dispatchEvent({type: 'destroy'});
};
