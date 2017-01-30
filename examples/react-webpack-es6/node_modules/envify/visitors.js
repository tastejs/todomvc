var Syntax = require('jstransform').Syntax
var utils = require('jstransform/src/utils')

function create(envs) {
  var args  = [].concat(envs[0]._ || []).concat(envs[1]._ || [])
  var purge = args.indexOf('purge') !== -1

  function visitProcessEnv(traverse, node, path, state) {
    var key = node.property.name || node.property.value

    for (var i = 0; i < envs.length; i++) {
      var value = envs[i][key]
      if (value !== undefined) {
        replaceEnv(node, state, value)
        return false
      }
    }

    if (purge) {
      replaceEnv(node, state, undefined)
    }

    return false
  }

  function replaceEnv(node, state, value) {
    utils.catchup(node.range[0], state)
    utils.append(JSON.stringify(value), state)
    utils.move(node.range[1], state)
  }

  visitProcessEnv.test = function(node, path, state) {
    return (
      node.type === Syntax.MemberExpression
      && !(path[0].type === Syntax.AssignmentExpression && path[0].left === node)
      && node.property.type === (node.computed ? Syntax.Literal : Syntax.Identifier)
      && node.object.computed === false
      && node.object.type === Syntax.MemberExpression
      && node.object.object.type === Syntax.Identifier
      && node.object.object.name === 'process'
      && node.object.property.type === Syntax.Identifier
      && node.object.property.name === 'env'
    )
  }

  return [visitProcessEnv]
}

module.exports = create
