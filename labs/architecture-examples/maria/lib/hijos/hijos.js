/*
Hijos version 0 - JavaScript classes for building tree structures and the composite design pattern
Copyright (c) 2012, Peter Michaux
All rights reserved.
Licensed under the Simplified BSD License.
https://github.com/petermichaux/hijos/blob/master/LICENSE
*/var hijos = hijos || {};
/**

@property hijos.Leaf

@description

A constructor function for creating Leaf objects to be used as part
of the composite design pattern.

Leaf objects have three read-only properties describing the Leaf object's
relationships to other Leaf and Node objects participating in
the composite pattern.

    1. parentNode
    2. previousSibling
    3. nextSibling

These properties will be null when the Leaf is not a child
of a Node object. To attach a Leaf to a Node, use the Node's child
manipulation methods: appendChild, insertBefore, replaceChild.
To remove a Leaf from a Node use the Node's removeChild method.

var leaf = new hijos.Leaf();

*/
hijos.Leaf = function() {
    this.parentNode = null;
    this.previousSibling = null;
    this.nextSibling = null;
};

/**

@property hijos.Leaf.prototype.destroy

@description

Call before your application code looses its last reference to the object.
Generally this will be called for you by the destroy method of the containing
Node object unless this Leaf object is not contained by a Node.

*/
hijos.Leaf.prototype.destroy = function() {
    // Loosing references to relations may help garbage collection.
    this.parentNode = null;
    this.previousSibling = null;
    this.nextSibling = null;
};

// insure prototype object is initialized properly
hijos.Leaf.call(hijos.Leaf.prototype);

/**

@property hijos.Leaf.mixin

@parameter obj {object} The object to become a Leaf.

@description

Mixes in the Leaf methods into any object. Be sure to call the hijos.Leaf
constructor to initialize the Leaf's properties.

app.MyView = function() {
    hijos.Leaf.call(this);
};
hijos.Leaf.mixin(app.MyView.prototype);

*/
hijos.Leaf.mixin = function(obj) {
    obj.destroy = hijos.Leaf.prototype.destroy;
    hijos.Leaf.call(obj);
};
/**

@property hijos.Node

@description

A constructor function for creating Node objects with ordered children
to be used as part of the composite design pattern.

Node objects have six read-only properties describing the Node's
relationships to other Leaf and Node objects participating in
the composite pattern.

    1. childNodes
    2. firstChild
    3. lastChild
    4. parentNode
    5. previousSibling
    6. nextSibling

The firstChild and lastChild properties will be null when the Node has
no children. Do not mutate the elements of the childNodes array directly.
Instead use the appendChild, insertBefore, replaceChild, and removeChild
methods to manage the children.

The parentNode, previousSibling, and nextSibling properties will be null
when the Node object is not a child of another Node object.

var node = new hijos.Node();

*/
hijos.Node = function() {
    hijos.Leaf.call(this);
    this.childNodes = [];
    this.firstChild = null;
    this.lastChild = null;
};

hijos.Leaf.mixin(hijos.Node.prototype);

/**

@property hijos.Node.prototype.destroy

@description

Call before your application code looses its last reference to the object.
Generally this will be called for you by the destroy method of the containing
Node object unless this object is not contained by another Node.

*/
hijos.Node.prototype.destroy = function() {
    // copy in case one of the destroy methods modifies this.childNodes
    var children = this.childNodes.slice(0);
    for (var i = 0, ilen = children.length; i < ilen; i++) {
        children[i].destroy();
    }
    hijos.Leaf.prototype.destroy.call(this);
    // Loosing references to relations may help garbage collection.
    this.childNodes = null;
    this.firstChild = null;
    this.lastChild = null;
};

/**

@property hijos.Node.prototype.hasChildNodes

@description

Returns true if this Node has children. Otherwise returns false.

*/
hijos.Node.prototype.hasChildNodes = function() {
    return this.childNodes.length > 0;
};

/**

@property hijos.Node.prototype.insertBefore

@parameter newChild {object} The Leaf or Node object to insert.

@parameter oldChild {object|null} The child object to insert before.

@description

Inserts newChild before oldChild. If oldChild is null then this is equivalent
to appending newChild. If newChild is a child of another Node then newChild is
removed from that other Node before appending to this Node.

var parent = new hijos.Node();
var child0 = new hijos.Leaf();
parent.insertBefore(child0, null);
var child1 = new hijos.Node();
parent.insertBefore(child1, child0);

*/
hijos.Node.prototype.insertBefore = function(newChild, oldChild) {
    if (arguments.length < 2) {
        throw new Error('hijos.Node.prototype.insertBefore: not enough arguments.');
    }
    // Allow caller to be sloppy and send undefined instead of null.
    if (oldChild === undefined) {
        oldChild = null;
    }
    // Is newChild is already in correct position?
    if ((newChild === oldChild) || // inserting a node before itself
        (oldChild && (oldChild.previousSibling === newChild)) || // inserting newChild where it already is
        ((oldChild === null) && this.lastChild === newChild)) { // inserting child at end when it is already at the end
        return;
    }
    // do not allow the creation of a circular tree structure
    var node = this;
    while (node) {
        if (node === newChild) {
            throw new Error('hijos.Node.prototype.insertBefore: Node cannot be inserted at the specified point in the hierarchy.');
        }
        node = node.parentNode;
    }
    // continue with insertion
    var children = this.childNodes;
    // find index for newChild
    var indexForNewChild;
    if (oldChild === null) {
        // want to append to end of children
        indexForNewChild = children.length;
    }
    else {
        for (var i = 0, ilen = children.length; i < ilen; i++) {
            if (children[i] === oldChild) {
                indexForNewChild = i;
                break;
            }
        }
        if (typeof indexForNewChild !== 'number') {
            throw new Error('hijos.Node.prototype.insertBefore: Node was not found.');
        }
    }
    // remove from previous composite
    var parent = newChild.parentNode;
    if (parent) {
        parent.removeChild(newChild);
    }
    // add to this composite
    children.splice(indexForNewChild, 0, newChild);
    this.firstChild = children[0];
    this.lastChild = children[children.length - 1];
    newChild.parentNode = this;
    var previousSibling = newChild.previousSibling = (children[indexForNewChild - 1] || null);
    if (previousSibling) {
        previousSibling.nextSibling = newChild;
    }
    var nextSibling = newChild.nextSibling = (children[indexForNewChild + 1] || null);
    if (nextSibling) {
        nextSibling.previousSibling = newChild;
    }
};

/**

@property hijos.Node.prototype.appendChild

@parameter newChild {object} The Leaf or Node object to append.

@description

Adds newChild as the last child of this Node. If newChild is a child of
another Node then newChild is removed from that other Node before appending
to this Node.

var parent = new hijos.Node();
var child = new hijos.Leaf();
parent.appendChild(child);
var child = new hijos.Node();
parent.appendChild(child);

*/
hijos.Node.prototype.appendChild = function(newChild) {
    if (arguments.length < 1) {
        throw new Error('hijos.Node.prototype.appendChild: not enough arguments.');
    }
    this.insertBefore(newChild, null);
};

/**

@property hijos.Node.prototype.replaceChild

@parameter newChild {object} The Leaf or Node object to insert.

@parameter oldChild {object} The child object to remove/replace.

@description

Replaces oldChild with newChild. If newChild is a child of another Node
then newChild is removed from that other Node before appending to this Node.

var parent = new hijos.Node();
var child0 = new hijos.Leaf();
parent.appendChild(child0);
var child1 = new hijos.Node();
parent.replaceChild(child1, child0);

*/
hijos.Node.prototype.replaceChild = function(newChild, oldChild) {
    if (arguments.length < 2) {
        throw new Error('hijos.Node.prototype.replaceChild: not enough arguments.');
    }
    if (!oldChild) {
        throw new Error('hijos.Node.prototype.replaceChild: oldChild must not be falsy.');
    }
    // child is already in correct position and
    // do not want removeChild to be called below
    if (newChild === oldChild) {
        return;
    }
    this.insertBefore(newChild, oldChild);
    this.removeChild(oldChild);
};

/**

@property hijos.Node.prototype.removeChild

@parameter oldChild {object} The child object to remove.

@description

Removes oldChild.

var parent = new hijos.Node();
var child = new hijos.Leaf();
parent.appendChild(child);
parent.removeChild(child);

*/
hijos.Node.prototype.removeChild = function(oldChild) {
    if (arguments.length < 1) {
        throw new Error('hijos.Node.prototype.removeChild: not enough arguments.');
    }
    var children = this.childNodes;
    for (var i = 0, ilen = children.length; i < ilen; i++) {
        if (children[i] === oldChild) {
            var previousSibling = children[i - 1];
            if (previousSibling) {
                previousSibling.nextSibling = oldChild.nextSibling;
            }
            var nextSibling = children[i + 1];
            if (nextSibling) {
                nextSibling.previousSibling = oldChild.previousSibling;
            }
            oldChild.parentNode = null;
            oldChild.previousSibling = null;
            oldChild.nextSibling = null;
            children.splice(i, 1);
            this.firstChild = children[0] || null;
            this.lastChild = children[children.length - 1] || null;
            return; // stop looking
        }
    }
    throw new Error('hijos.Node.prototype.removeChild: node not found.');
};

// insure prototype object is initialized correctly
hijos.Node.call(hijos.Node.prototype);

/**

@property hijos.Node.mixin

@parameter obj {object} The object to become a Node.

@description

Mixes in the Node methods into any object.

// Example 1

app.MyView = function() {
    hijos.Node.call(this);
};
hijos.Node.mixin(app.MyView.prototype);

// Example 2

var obj = {};
hijos.Node.mixin(obj);

*/
hijos.Node.mixin = function(obj) {
    for (var p in hijos.Node.prototype) {
        if (Object.prototype.hasOwnProperty.call(hijos.Node.prototype, p) &&
            (typeof hijos.Node.prototype[p] === 'function')) {
            obj[p] = hijos.Node.prototype[p];
        }
    }
    hijos.Node.call(obj);
};
