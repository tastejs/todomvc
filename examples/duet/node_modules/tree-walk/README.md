tree-walk
=========

tree-walk is a JavaScript library providing useful functions for traversing,
inspecting, and transforming arbitrary tree structures. It's based on the
`walk` module that I wrote for [Underscore-contrib](http://documentcloud.github.io/underscore-contrib/).

[![NPM](https://nodei.co/npm/tree-walk.png?compact=true)](https://nodei.co/npm/tree-walk/)

Usage
-----

The most basic operation on a tree is to iterate through all its nodes, which
is provided by `preorder` and `postorder`. They can be used in much the same
way as [Underscore's 'each' function][each]. For example, take a simple tree:

[each]: http://underscorejs.org/#each

    var tree = {
      'name': { 'first': 'Bucky', 'last': 'Fuller' },
      'occupations': ['designer', 'inventor']
    };

We can do a preorder traversal of the tree:

    var walk = require('tree-walk');

    walk.preorder(tree, function(value, key, parent) {
      console.log(key + ': ' + value);
    });

which produces the following output:

    undefined: [object Object]
    name: [object Object]
    first: Bucky
    last: Fuller
    occupations: designer,inventor
    0: designer
    1: inventor

A preorder traversal visits the nodes in the tree in a top-down fashion: first
the root node is visited, then all of its child nodes are recursively visited.
`postorder` does the opposite, calling the visitor function for a node
only after visiting all of its child nodes.

Collection Functions
--------------------

This module provides versions of most of the
[Underscore collection functions](http://underscorejs.org/#collections), with
some small differences that make them better suited for operating on trees. For
example, you can use `filter` to get a list of all the strings in a tree:

    var walk = require('tree-walk');
    walk.filter(walk.preorder, _.isString);

Like many other functions in this module, the argument to `filter` is a function
indicating in what order the nodes should be visited. Currently, only
`preorder` and `postorder` are supported.

Custom Walkers
--------------

Sometimes, you have a tree structure that can't be naïvely traversed. A good
example of this is a DOM tree: because each element has a reference to its
parent, a naïve walk would encounter circular references. To handle such cases,
you can create a custom walker by invoking `walk` as a function, and passing
it a function which returns the descendants of a given node. E.g.:

    var walk = require('tree-walk');
    var domWalker = walk(function(el) {
      return el.children;
    });

The resulting object has the same functions as `walk`, but parameterized
to use the custom walking behavior:

    var buttons = domWalker.filter(walk.preorder, function(el) {
      return el.tagName === 'BUTTON';
    });

However, it's not actually necessary to create custom walkers for DOM nodes --
walk handles DOM nodes specially by default.

Parse Trees
-----------

A _parse tree_ is tree that represents the syntactic structure of a formal
language. For example, the arithmetic expression `1 + (4 + 2) * 7` might have the
following parse tree:

    var tree = {
      'type': 'Addition',
      'left': { 'type': 'Value', 'value': 1 },
      'right': {
        'type': 'Multiplication',
        'left': {
  	      'type': 'Addition',
  	      'left': { 'type': 'Value', 'value': 4 },
  	      'right': { 'type': 'Value', 'value': 2 }
        },
        'right': { 'type': 'Value', 'value': 7 }
      }
    };

We can create a custom walker for this parse tree:

    var walk = require('tree-walk');
    var parseTreeWalker = walk(function(node) {
      return _.pick(node, 'left', 'right');
    });

Using the `find` function, we could find the first occurrence of the addition
operator. It uses a pre-order traversal of the tree, so the following code
will produce the root node (`tree`):

    parseTreeWalker.find(tree, function(node) {
      return node.type === 'Addition';
    });

We could use the `reduce` function to evaluate the arithmetic expression
represented by the tree. The following code will produce `43`:

    parseTreeWalker.reduce(tree, function(memo, node) {
      if (node.type === 'Value') return node.value;
      if (node.type === 'Addition') return memo.left + memo.right;
      if (node.type === 'Multiplication') return memo.left * memo.right;
    });

When the visitor function is called on a node, the `memo` argument contains
the results of calling `reduce` on each of the node's subtrees. To evaluate a
node, we just need to add or multiply the results of the left and right
subtrees of the node.
