module.exports = isSoftSetHook

function isSoftSetHook(x) {
  return x && typeof x === 'object' && typeof x.value !== 'undefined';
}
