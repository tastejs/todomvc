module.exports = isVirtualText

var types = require('./types');

function isVirtualText(x) {
  return x && x.t === types.VirtualTree;
}
