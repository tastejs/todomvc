'use strict';

var archy = require('archy');
var log = require('gulplog');

var sortBy = require('array-sort');
var isObject = require('isobject');

var ansi = require('../ansi');
var copyTree = require('./copy-tree');

function logTasks(tree, opts, getTask) {
  if (opts.sortTasks) {
    tree.nodes = sortBy(tree.nodes, 'label');
  }

  var lineInfos = [];
  var entryObserver = getLineInfoCollector(lineInfos);
  var nodeFactory = getNodeFactory(getTask, entryObserver);

  tree = copyTree(tree, opts, nodeFactory);
  var spacer = getSpacerForLineIndents(tree, lineInfos);
  var lines = getLinesContainingOnlyBranches(tree);

  log.info(tree.label);
  printTreeList(lines, spacer, lineInfos);
}

function getLineInfoCollector(lineInfos) {
  return {
    topTask: function(node) {
      lineInfos.push({
        name: node.label,
        desc: node.desc,
        type: 'top',
      });
    },
    option: function(opt) {
      lineInfos.push({
        name: opt.label,
        desc: opt.desc,
        type: 'option',
      });
    },
    childTask: function(node) {
      lineInfos.push({
        name: node.label,
        type: 'child',
      });
    },
  };
}

function getNodeFactory(getTask, entryObserver) {
  return {
    topNode: function(node) {
      return {
        label: node.label,
      };
    },

    taskNode: function(node) {
      /* istanbul ignore next */
      var task = getTask(node.label) || {};

      var newNode = {
        label: node.label,
        desc: typeof task.description === 'string' ? task.description : '',
        opts: [],
      };
      entryObserver.topTask(newNode);

      if (isObject(task.flags)) {
        Object.keys(task.flags).sort().forEach(function(flag) {
          if (flag.length === 0) {
            return;
          }
          /* istanbul ignore next */
          var opt = {
            label: flag,
            desc: typeof task.flags[flag] === 'string' ? task.flags[flag] : '',
          };
          entryObserver.option(opt);
          newNode.opts.push(opt);
          newNode.label += '\n' + opt.label; // The way of archy for options.
        });
      }

      return newNode;
    },

    childNode: function(node) {
      var newChild = {
        label: node.label,
      };
      entryObserver.childTask(newChild);
      newChild.label = ''; // Because don't use child tasks to calc indents.

      return newChild;
    },
  };
}

function getSpacerForLineIndents(tree, lineInfos) {
  var maxSize = 0;
  var sizes = [];

  archy(tree)
    .split('\n')
    .slice(1, -1)
    .forEach(function(line, index) {
      var info = lineInfos[index];
      if (info.type === 'top' || info.type === 'option') {
        maxSize = Math.max(maxSize, line.length);
        sizes.push(line.length);
      } else {
        sizes.push(0);
      }
    });

  maxSize += 3;

  return function(index) {
    return Array(maxSize - sizes[index]).join(' ');
  };
}

function getLinesContainingOnlyBranches(tree) {
  tree.nodes.forEach(function(node) {
    node.label = '';
    node.opts.forEach(function() {
      node.label += '\n';
    });
  });

  return archy(tree)
    .split('\n')
    .slice(1, -1);
}

function printTreeList(lines, spacer, lineInfos) {
  lines.forEach(function(branch, index) {
    var info = lineInfos[index];

    var line = ansi.white(branch);

    if (info.type === 'top') {
      line += ansi.cyan(info.name);
      if (info.desc.length > 0) {
        line += spacer(index) + ansi.white(info.desc);
      }
    } else if (info.type === 'option') {
      line += ansi.magenta(info.name);
      if (info.desc.length > 0) {
        line += spacer(index) + ansi.white('…' + info.desc);
      }
    } else { // If (info.type === 'child') {
      line += ansi.white(info.name);
    }

    log.info(line);
  });
}

module.exports = logTasks;

