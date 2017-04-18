module.exports = isVirtualNode

var types = require('./types');

function isVirtualNode(x) {
  return x && x.t === types.VirtualNode
}
