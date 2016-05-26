'use strict';

/* global document */

var test = require('tape'),
    _ = require('underscore');

var walk = require('../');

function getSimpleTestTree() {
  return {
    val: 0,
    l: { val: 1, l: { val: 2 }, r: { val: 3 } },
    r: { val: 4, l: { val: 5 }, r: { val: 6 } }
  };
}

function getMixedTestTree() {
  return {
    current:
      { city: 'Munich', aliases: ['Muenchen'], population: 1378000 },
    previous: [
      { city: 'San Francisco', aliases: ['SF', 'San Fran'], population: 812826 },
      { city: 'Toronto', aliases: ['TO', 'T-dot'], population: 2615000 }
    ]
  };
}

function getVal(node) {
  return node.val;
}

test('basic', function(t) {
  // Updates the value of `node` to be the sum of the values of its subtrees.
  // Ignores leaf nodes.
  var visitor = function(node) {
    if (node.l && node.r)
      node.val = node.l.val + node.r.val;
  };

  var tree = getSimpleTestTree();
  walk.postorder(tree, visitor);
  t.equal(tree.val, 16, 'should visit subtrees first');

  tree = getSimpleTestTree();
  walk.preorder(tree, visitor);
  t.equal(tree.val, 5, 'should visit subtrees after the node itself');

  var f = function(x, y) {};
  var visited = walk.map(f, walk.preorder, _.identity);
  t.deepEquals(visited, [f], 'function w/ no properties is treated as a leaf');

  f.foo = 3;
  visited = walk.map(f, walk.preorder, _.identity);
  t.deepEqual(visited, [f, 3], 'own property of function is be visited');

  (function(x) {
    visited = walk.map(arguments, walk.preorder, _.identity);
  })('x', 99);
  t.equal(visited.length, 3);
  t.deepEqual(visited.slice(1), ['x', 99], 'arguments is treated like an array');

  t.end();
});

test('circularRefs', function(t) {
  var tree = getSimpleTestTree();
  tree.l.l.r = tree;
  t.throws(function() { walk.preorder(tree, _.identity); }, /cycle/, 'preorder t.throws an exception');
  t.throws(function() { walk.postorder(tree, _.identity); }, /cycle/, 'postorder t.throws an exception');

  tree = getSimpleTestTree();
  tree.r.l = tree.r;
  t.throws(function() { walk.preorder(tree, _.identity); }, /cycle/, 'exception for a self-referencing node');

  tree = getSimpleTestTree();
  tree.l.l = tree.l.r = {};
  t.ok(walk.reduce(tree, function() { return true; }), "same object can be in diff't branches");

  tree.l.l = tree.l.r = 'hai';
  t.ok(walk.reduce(tree, function() { return true; }), "same string can be in diff't branches");

  // Create a custom walker that reuses the same object as the walk target.
  // This should not be considered a cycle.
  var wrapper = [];
  var walker = walk(function(node, key) {
    if (node && node.hasOwnProperty('val')) {
      wrapper[0] = node.l;
      wrapper[1] = node.r;
      return wrapper;
    }
    return node;
  });
  t.ok(walker.reduce(tree, function() { return true; }), 'target object can be the same');

  t.end();
});

test('simpleMap', function(t) {
  var visitor = function(node, key) {
    if (_.has(node, 'val')) return node.val;
    if (key !== 'val') throw new Error('Leaf node with incorrect key');
    return this && this.leafChar || '-';
  };
  var visited = walk.map(getSimpleTestTree(), walk.preorder, visitor).join('');
  t.equal(visited, '0-1-2-3-4-5-6-', 'pre-order map');

  visited = walk.map(getSimpleTestTree(), walk.postorder, visitor).join('');
  t.equal(visited, '---2-31--5-640', 'post-order map');

  var context = { leafChar: '*' };
  visited = walk.map(getSimpleTestTree(), walk.preorder, visitor, context).join('');
  t.equal(visited, '0*1*2*3*4*5*6*', 'pre-order with context');

  visited = walk.map(getSimpleTestTree(), walk.postorder, visitor, context).join('');
  t.equal(visited, '***2*31**5*640', 'post-order with context');

  if (typeof document !== 'undefined') {
    var root = document.querySelector('#map-test');
    var ids = walk.map(root, walk.preorder, function(el) { return el.id; });
    t.deepEqual(ids, ['map-test', 'id1', 'id2'], 'preorder map with DOM elements');

    ids = walk.map(root, walk.postorder, function(el) { return el.id; });
    t.deepEqual(ids, ['id1', 'id2', 'map-test'], 'postorder map with DOM elements');
  }

  t.end();
});

test('mixedMap', function(t) {
  var visitor = function(node) {
    return _.isString(node) ? node.toLowerCase() : null;
  };

  var tree = getMixedTestTree();
  var preorderResult = walk.map(tree, walk.preorder, visitor);
  t.equal(preorderResult.length, 19, 'all nodes are visited');
  t.deepEqual(_.reject(preorderResult, _.isNull),
      ['munich', 'muenchen', 'san francisco', 'sf', 'san fran', 'toronto', 'to', 't-dot'],
      'pre-order map on a mixed tree');

  var postorderResult = walk.map(tree, walk.postorder, visitor);
  t.deepEqual(preorderResult.sort(), postorderResult.sort(), 'post-order map on a mixed tree');

  tree = [['foo'], tree];
  var result = walk.map(tree, walk.postorder, visitor);
  t.deepEqual(_.difference(result, postorderResult), ['foo'], 'map on list of trees');

  t.end();
});

test('pluck', function(t) {
  var tree = getSimpleTestTree();
  tree.val = { val: 'z' };

  var plucked = walk.pluckRec(tree, 'val');
  t.equal(plucked.shift(), tree.val);
  t.equal(plucked.join(''), 'z123456', 'pluckRec is recursive');

  plucked = walk.pluck(tree, 'val');
  t.equal(plucked.shift(), tree.val);
  t.equal(plucked.join(''), '123456', 'regular pluck is not recursive');

  tree.l.r.foo = 42;
  t.equal(walk.pluck(tree, 'foo').shift(), 42, 'pluck a value from deep in the tree');

  tree = getMixedTestTree();
  t.deepEqual(walk.pluck(tree, 'city'), ['Munich', 'San Francisco', 'Toronto'], 'pluck from a mixed tree');
  tree = [tree, { city: 'Loserville', population: 'you' }];
  t.deepEqual(walk.pluck(tree, 'population'), [1378000, 812826, 2615000, 'you'], 'pluck from a list of trees');

  t.end();
});

test('reduce', function(t) {
  var add = function(a, b) { return a + b; };
  var leafMemo = [];
  var sum = function(memo, node) {
    if (_.isObject(node))
      return _.reduce(memo, add, 0);

    t.strictEqual(memo, leafMemo);
    return node;
  };
  var tree = getSimpleTestTree();
  t.equal(walk.reduce(tree, sum, leafMemo), 21);

  // A more useful example: transforming a tree.

  // Returns a new node where the left and right subtrees are swapped.
  var mirror = function(memo, node) {
    if (!_.has(node, 'r')) return node;
    return _.extend(_.clone(node), { l: memo.r, r: memo.l });
  };
  // Returns the '-' for internal nodes, and the value itself for leaves.
  var toString = function(node) { return _.has(node, 'val') ? '-' : node; };

  tree = walk.reduce(getSimpleTestTree(), mirror);
  t.equal(walk.reduce(tree, sum, leafMemo), 21);
  t.equal(walk.map(tree, walk.preorder, toString).join(''), '-0-4-6-5-1-3-2', 'pre-order map');

  t.end();
});

test('find', function(t) {
  var tree = getSimpleTestTree();

  // Returns a visitor function that will succeed when a node with the given
  // value is found, and then raise an exception the next time it's called.
  var findValue = function(value) {
    var found = false;
    return function(node) {
      if (found) throw new Error('already found!');
      found = (node.val === value);
      return found;
    };
  };

  t.equal(walk.find(tree, findValue(0)).val, 0);
  t.equal(walk.find(tree, findValue(6)).val, 6);
  t.deepEqual(walk.find(tree, findValue(99)), undefined);

  t.end();
});

test('filter', function(t) {
  var tree = getSimpleTestTree();
  tree.r.val = '.oOo.';  // Remove one of the numbers.
  var isEvenNumber = function(x) {
    return _.isNumber(x) && x % 2 === 0;
  };

  t.equal(walk.filter(tree, walk.preorder, _.isObject).length, 7, 'filter objects');
  t.equal(walk.filter(tree, walk.preorder, _.isNumber).length, 6, 'filter numbers');
  t.equal(walk.filter(tree, walk.postorder, _.isNumber).length, 6, 'postorder filter numbers');
  t.equal(walk.filter(tree, walk.preorder, isEvenNumber).length, 3, 'filter even numbers');

  // With the identity function, only the value '0' should be omitted.
  t.equal(walk.filter(tree, walk.preorder, _.identity).length, 13, 'filter on identity function');

  t.end();
});

test('reject', function(t) {
  var tree = getSimpleTestTree();
  tree.r.val = '.oOo.';  // Remove one of the numbers.

  t.equal(walk.reject(tree, walk.preorder, _.isObject).length, 7, 'reject objects');
  t.equal(walk.reject(tree, walk.preorder, _.isNumber).length, 8, 'reject numbers');
  t.equal(walk.reject(tree, walk.postorder, _.isNumber).length, 8, 'postorder reject numbers');

  // With the identity function, only the value '0' should be kept.
  t.equal(walk.reject(tree, walk.preorder, _.identity).length, 1, 'reject with identity function');

  t.end();
});

test('custom traversal', function(t) {
  var tree = getSimpleTestTree();

  // Set up a walker that will not traverse the 'val' properties.
  var walker = walk(function(node) {
    return _.omit(node, 'val');
  });
  t.equal(walker.pluck(tree, 'val').length, 7, 'pluck with custom traversal');
  t.equal(walker.pluckRec(tree, 'val').length, 7, 'pluckRec with custom traversal');

  t.equal(walker.map(tree, walk.postorder, _.identity).length, 7, 'traversal strategy is dynamically scoped');

  // Check that the default walker is unaffected.
  t.equal(walk.map(tree, walk.postorder, _.identity).length, 14, 'default map still works');
  t.equal(walk.pluckRec(tree, 'val').join(''), '0123456', 'default pluckRec still works');

  t.end();
});

test('custom traversal shorthand', function(t) {
  var tree = getSimpleTestTree();

  t.deepEqual(walk(['l']).map(tree, walk.preorder, getVal), [0, 1, 2]);
  t.deepEqual(walk(['l', 'r']).map(tree, walk.preorder, getVal), [0, 1, 2, 3, 4, 5, 6]);

  t.deepEqual(walk(['l', 'z']).map(tree, walk.preorder, getVal), [0, 1, 2]);
  t.deepEqual(walk([]).map(tree, walk.preorder, getVal), [0], 'with empty array, just visits root');
  t.deepEqual(walk('z').map(tree, walk.preorder, getVal), [0], 'with unknown keys, just visits root');

  // When just a string is passed as the traversal strategy, the behaviour is
  // subtly different: the traversal target (in this case, the array of child
  // nodes) is not treated as a node.
  tree = { val: 0, children: [{ val: 1, children: [] }, { val: 2 }]};
  t.deepEqual(walk('children').map(tree, walk.preorder, getVal), [0, 1, 2]);
  t.deepEqual(walk(['children']).map(tree, walk.preorder, getVal), [0, undefined]);

  t.deepEqual(walk('z').map(tree, walk.preorder, getVal), [0], 'with unknown key, just visits root');

  t.end();
});

test('reduce with custom traversal', function(t) {
  var tree = { op: '+', operands: [
    { value: 1 },
    { op: '+', operands: [
      { value: 2 },
      { value: 3 }]
    }
  ]};

  var walker = walk(function(node) { return node.operands; });
  var answer = walker.reduce(tree, function(subResults, node) {
    t.ok(_.isObject(node), 'should only visit objects, not primitives');
    if ('value' in node)
      return node.value;
    t.ok(_.isArray(subResults), 'child results should be an array');
    if (node.op === '+')
      return subResults[0] + subResults[1];
  });
  t.equal(answer, 6);

  t.end();
});

test('attributes', function(t) {
  var tree = getSimpleTestTree();

  // Set up a walker that will not traverse the 'val' properties.
  var walker = walk(function(node) {
    return _.omit(node, 'val');
  });

  var count = 0;
  var min = walker.createAttribute(function(subResults, node) {
    count++;
    if (subResults)
      return Math.min(node.val, Math.min(subResults.l, subResults.r));
    return node.val;
  });
  t.equal(min(tree), 0);
  t.equal(count, 7);
  t.equal(min(tree), 0);
  t.equal(min(tree.l), 1);
  t.equal(min(tree.r), 4);
  t.equal(count, 7, 'visitor should be memoized for all nodes');

  var max = walker.createAttribute(function(subResults, node) {
    if (subResults)
      return Math.max(node.val, Math.max(subResults.l, subResults.r));
    return node.val;
  });
  t.equal(max(tree), 6);

  t.end();
});

test('stopping recursion', function(t) {
  var tree = getSimpleTestTree();
  var vals = [];
  walk.preorder(tree, function(node, key) {
    if (key === 'l') {
      return walk.STOP_RECURSION;
    }
    if (_.isObject(node)) {
      vals.push(node.val);
    }
  });
  t.deepEqual(vals, [0, 4, 6]);

  t.end();
});
