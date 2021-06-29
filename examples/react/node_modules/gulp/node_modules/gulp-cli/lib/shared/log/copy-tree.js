'use strict';

function copyNode(node) {
  var newNode = {};
  Object.keys(node).forEach(function(key) {
    newNode[key] = node[key];
  });
  return newNode;
}

var defaultNodeFactory = {
  topNode: copyNode,
  taskNode: copyNode,
  childNode: copyNode,
};

function copyTree(tree, opts, nodeFactory) {
  opts = opts || {};

  var depth = opts.tasksDepth;
  depth = typeof depth === 'number' ? ((depth < 1) ? 1 : depth) : null;

  nodeFactory = nodeFactory || defaultNodeFactory;

  var newTree = nodeFactory.topNode(tree);
  newTree.nodes = [];

  if (Array.isArray(tree.nodes)) {
    tree.nodes.forEach(visit);
  }

  function visit(node) {
    var newNode = nodeFactory.taskNode(node);
    newNode.nodes = [];
    newTree.nodes.push(newNode);

    if (opts.compactTasks) {
      forEach(node.nodes, copyNotRecursively, newNode);

    } else if (!depth || depth > 1) {
      forEach(node.nodes, copyRecursively, depth, 2, newNode);
    }
  }

  function copyNotRecursively(child, newParent) {
    var newChild = nodeFactory.childNode(child);
    newChild.nodes = [];
    newParent.nodes.push(newChild);

    if (child.branch) {
      forEach(child.nodes, copyNotRecursively, newChild);
    }
  }

  function copyRecursively(child, maxDepth, nowDepth, newParent) {
    var newChild = nodeFactory.childNode(child);
    newChild.nodes = [];
    newParent.nodes.push(newChild);

    if (!maxDepth || maxDepth > nowDepth) {
      forEach(child.nodes, copyRecursively, maxDepth, nowDepth + 1, newChild);
    }
  }

  return newTree;
}

function forEach(nodes, fn) {
  if (!Array.isArray(nodes)) {
    return;
  }

  var args = Array.prototype.slice.call(arguments, 2);

  for (var i = 0, n = nodes.length; i < n; i++) {
    fn.apply(nodes[i], [nodes[i]].concat(args));
  }
}

module.exports = copyTree;

