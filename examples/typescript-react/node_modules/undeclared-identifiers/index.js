var xtend = require('xtend')
var acorn = require('acorn-node')
var walk = require('acorn-node/walk')
var getAssignedIdentifiers = require('get-assigned-identifiers')

function visitFunction (node, state, ancestors) {
  if (node.params.length > 0) {
    var idents = []
    for (var i = 0; i < node.params.length; i++) {
      var sub = getAssignedIdentifiers(node.params[i])
      for (var j = 0; j < sub.length; j++) idents.push(sub[j])
    }
    declareNames(node, idents)
  }
  if (node.type === 'FunctionDeclaration') {
    var parent = getScopeNode(ancestors, 'const')
    declareNames(parent, [node.id])
  } else if (node.type === 'FunctionExpression' && node.id) {
    declareNames(node, [node.id])
  }
}

var scopeVisitor = {
  VariableDeclaration: function (node, state, ancestors) {
    var parent = getScopeNode(ancestors, node.kind)
    for (var i = 0; i < node.declarations.length; i++) {
      declareNames(parent, getAssignedIdentifiers(node.declarations[i].id))
    }
  },
  FunctionExpression: visitFunction,
  FunctionDeclaration: visitFunction,
  ArrowFunctionExpression: visitFunction,
  ImportDeclaration: function (node, state, ancestors) {
    declareNames(ancestors[0] /* root */, getAssignedIdentifiers(node))
  },
  CatchClause: function (node) {
    if (node.param) declareNames(node, [node.param])
  }
}

var bindingVisitor = {
  Identifier: function (node, state, ancestors) {
    if (!state.identifiers) return
    var parent = ancestors[ancestors.length - 2]
    if (parent.type === 'MemberExpression' && parent.property === node) return
    if (!has(state.undeclared, node.name)) {
      for (var i = ancestors.length - 1; i >= 0; i--) {
        if (ancestors[i]._names !== undefined && ancestors[i]._names.indexOf(node.name) !== -1) {
          return
        }
      }

      state.undeclared[node.name] = true
    }

    if (state.wildcard &&
        !(parent.type === 'MemberExpression' && parent.object === node) &&
        !(parent.type === 'VariableDeclarator' && parent.id === node) &&
        !(parent.type === 'AssignmentExpression' && parent.left === node)) {
      state.undeclaredProps[node.name + '.*'] = true
    }
  },
  MemberExpression: function (node, state, ancestors) {
    if (!state.properties) return
    if (node.object.type === 'Identifier' && has(state.undeclared, node.object.name)) {
      var prop = !node.computed && node.property.type === 'Identifier'
        ? node.property.name
        : node.computed && node.property.type === 'Literal'
          ? node.property.value
          : null
      if (prop) state.undeclaredProps[node.object.name + '.' + prop] = true
    }
  }
}

module.exports = function findUndeclared (src, opts) {
  opts = xtend({
    identifiers: true,
    properties: true,
    wildcard: false
  }, opts)

  var state = {
    undeclared: {},
    undeclaredProps: {},
    identifiers: opts.identifiers,
    properties: opts.properties,
    wildcard: opts.wildcard
  }

  // Parse if `src` is not already an AST.
  var ast = typeof src === 'object' && src !== null && typeof src.type === 'string'
    ? src
    : acorn.parse(src)

  walk.ancestor(ast, scopeVisitor)
  walk.ancestor(ast, bindingVisitor, walk.base, state)

  return {
    identifiers: Object.keys(state.undeclared),
    properties: Object.keys(state.undeclaredProps)
  }
}

function getScopeNode (parents, kind) {
  for (var i = parents.length - 2; i >= 0; i--) {
    if (parents[i].type === 'FunctionDeclaration' || parents[i].type === 'FunctionExpression' ||
        parents[i].type === 'ArrowFunctionExpression' || parents[i].type === 'Program') {
      return parents[i]
    }
    if (kind !== 'var' && parents[i].type === 'BlockStatement') {
      return parents[i]
    }
  }
}

function declareNames (node, names) {
  if (node._names === undefined) {
    node._names = names.map(function (id) { return id.name })
    return
  }
  for (var i = 0; i < names.length; i++) {
    node._names.push(names[i].name)
  }
}

function has (obj, name) { return Object.prototype.hasOwnProperty.call(obj, name) }
