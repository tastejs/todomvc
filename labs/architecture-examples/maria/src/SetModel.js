/**

@property maria.SetModel

@description

A constructor function to create new set model objects. A set model
object is a collection of elements. An element can only be included
once in a set model object.

The constructor takes multiple arguments and populates the set model
with those elements.

    var alpha = new maria.Model();
    alpha.name = 'Alpha';
    var beta = new maria.Model();
    beta.name = 'Beta';

    var setModel = new maria.SetModel(alpha, beta);

You can create an empty set model object.

    var setModel = new maria.SetModel(); 

What makes a set model object interesting in comparison to a set is
that a set model object is a model object that dispatches "change"
events when elements are added or deleted from the the set.

    var view = {
        update: function(evt) {
            alert(setModel.length + ' element(s) in the set.');
        }
    };
    maria.addEventListener(setModel, 'change', view, 'update');

You can add elements to the set. Adding an element
that is already in the set has no effect. The add method returns
true if the element is added to the set.

    setModel.add(alpha); // returns true, alpha was added
    setModel.add(alpha); // returns false, alpha not added again

The add method accepts multiple objects and only dispatches
a single "change" event if any of the arguments are added to
the set model object.

    setModel.add(alpha, beta); // returns true, beta was added

When elements are added to the set model object, all "change" event
listeners are passed an event object with an addedTargets property
which has an array containing all elements added to the set model
object.

You can check if an element is in the set.

    setModel.has(alpha); // returns true, alpha was added above

You can get the number of elements in the set.

    setModel.length; // returns 2

An element can be deleted from the set. Removing it multiple times
has no effect. The delete method returns true if the element is
deleted from the set.

    setModel['delete'](alpha); // returns true, alpha was deleted
    setModel['delete'](alpha); // returns false, alpha wasn't in set

The delete method accepts multiple objects.

    setModel['delete'](alpha, beta); // returns true, beta was removed

When elements are deleted from the set model object, all "change" event
listeners are passed an event object with a deletedTargets property
which is an array containing all elements deleted from the set model
object.

Note that delete is a keyword in JavaScript and to keep old browsers
happy you need to write setModel['delete']. You can write
setModel.delete if old browsers are not supported by your application.

You can empty a set in one call. The method returns true if any
elements are removed from the set model object.

    setModel.empty(); // returns false, alpha and beta removed above.

If the call to empty does delete elements from the set, all "change"
event listeners are passed an event object with deletedTargets just
as for the delete method.

Another interesting feature of a set model object is that it observes
its elements (for all elements that implement the event target
interface) and when an element dispatches a "destroy" event then
the element is automatically removed from the set model object. The
set model object then dispatches a "change" event with a deletedTargets
property just as for the delete method.

A set model object has some other handy methods.

    setModel.add(alpha, beta);

    setModel.toArray(); // returns [alpha, beta] or [beta, alpha]

    setModel.forEach(function(element) {
        alert(element.name);
    });

    setModel.every(function(element) {
        return element.name.length > 4;
    }); // returns false

    setModel.some(function(element) {
        return element.name.length > 4;
    }); // returns true

    setModel.reduce(function(accumulator, element) {
        return accumulator + element.name.length;
    }, 0); // returns 9

    setModel.map(function(element) {
        return element.name.length;
    }); // returns [4, 5] or [5, 4]

    setModel.filter(function(element) {
        return element.name.length > 4;
    }); // returns [alpha]

The order of the elements returned by toArray and the order of
iteration of the other methods is undefined as a set is an unordered
collection. Do not depend on any ordering that the current
implementation uses.

A particularly useful pattern is using maria.SetModel as the
"superclass" of your application's collection model. The following
example shows how this can be done at a low level for a to-do
application. See maria.SetModel.subclass for a more compact way
to accomplish the same.

    checkit.TodosModel = function() {
        maria.SetModel.apply(this, arguments);
    };
    checkit.TodosModel.prototype = new maria.SetModel();
    checkit.TodosModel.prototype.constructor = checkit.TodosModel;
    checkit.TodosModel.prototype.isEmpty = function() {
        return this.length === 0;
    };
    checkit.TodosModel.prototype.getDone = function() {
        return this.filter(function(todo) {
            return todo.isDone();
        });
    };
    checkit.TodosModel.prototype.getUndone = function() {
        return this.filter(function(todo) {
            return !todo.isDone();
        });
    };
    checkit.TodosModel.prototype.isAllDone = function() {
        return this.length > 0 &&
               (this.getDone().length === this.length);
    };
    checkit.TodosModel.prototype.markAllDone = function() {
        this.forEach(function(todo) {
            todo.setDone(true);
        });
    };
    checkit.TodosModel.prototype.markAllUndone = function() {
        this.forEach(function(todo) {
            todo.setDone(false);
        });
    };
    checkit.TodosModel.prototype.deleteDone = function() {
        this['delete'].apply(this, this.getDone());
    };

Another feature of set model objects is that events dispatched on
elements of the set model object bubble up and are dispatched on the
set model object. This makes it possible to observe only the set model
object and still know when elements in the set are changing, for
example. This can complement well the flyweight pattern used in a view.

*/
maria.SetModel = function() {
    maria.ObjectSet.apply(this, arguments);
    maria.Model.call(this);
};

maria.SetModel.prototype = new maria.Model();
maria.SetModel.prototype.constructor = maria.SetModel;

maria.ObjectSet.mixin(maria.SetModel.prototype);

// Wrap the set mutator methods to dispatch events.

// takes multiple arguments so that only one event will be fired
//
maria.SetModel.prototype.add = function() {
    var added = [];
    for (var i = 0, ilen = arguments.length; i < ilen; i++) {
        var argument = arguments[i];
        if (maria.ObjectSet.prototype.add.call(this, argument)) {
            added.push(argument);
            if ((typeof argument.addEventListener === 'function') &&
                (typeof argument.removeEventListener === 'function')) {
                argument.addEventListener('destroy', this);    
            }
            if ((typeof argument.addParentEventTarget === 'function') &&
                // want to know can remove later
                (typeof argument.removeParentEventTarget === 'function')) {
                argument.addParentEventTarget(this);
            }
        }
    }
    var modified = added.length > 0;
    if (modified) {
        this.dispatchEvent({type: 'change', addedTargets: added, deletedTargets: []});
    }
    return modified;
};

// takes multiple arguments so that only one event will be fired
//
maria.SetModel.prototype['delete'] = function() {
    var deleted = [];
    for (var i = 0, ilen = arguments.length; i < ilen; i++) {
        var argument = arguments[i];
        if (maria.ObjectSet.prototype['delete'].call(this, argument)) {
            deleted.push(argument);
            if (typeof argument.removeEventListener === 'function') {
                argument.removeEventListener('destroy', this);
            }
            if (typeof argument.removeParentEventTarget === 'function') {
                argument.removeParentEventTarget(this);
            }
        }
    }
    var modified = deleted.length > 0;
    if (modified) {
        this.dispatchEvent({type: 'change', addedTargets: [], deletedTargets: deleted});
    }
    return modified;
};

maria.SetModel.prototype.empty = function() {
    var deleted = this.toArray();
    var result = maria.ObjectSet.prototype.empty.call(this);
    if (result) {
        for (var i = 0, ilen = deleted.length; i < ilen; i++) {
            var element = deleted[i];
            if (typeof element.removeEventListener === 'function') {
                element.removeEventListener('destroy', this);
            }
            if (typeof element.removeParentEventTarget === 'function') {
                element.removeParentEventTarget(this);
            }
        }
        this.dispatchEvent({type: 'change', addedTargets: [], deletedTargets: deleted});
    }
    return result;
};

maria.SetModel.prototype.handleEvent = function(ev) {

    // If it is a destroy event being dispatched on the
    // destroyed element then we want to remove it from
    // this set.
    if ((ev.type === 'destroy') &&
        (ev.currentTarget === ev.target)) {
        this['delete'](ev.target);
    }

};
