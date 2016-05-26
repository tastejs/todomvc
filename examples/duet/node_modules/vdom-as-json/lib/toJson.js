'use strict';

var types = require('./types');

var SoftSetHook =
  require('virtual-dom/virtual-hyperscript/hooks/soft-set-hook');

function arrayToJson(arr) {
  var len = arr.length;
  var i = -1;
  var res = new Array(len);
  while (++i < len) {
    res[i] = toJson(arr[i]);
  }
  return res;
}

function plainObjectToJson(obj) {
  var res = {};
  /* jshint -W089 */
  /* this is fine; these objects are always plain */
  for (var key in obj) {
    var val = obj[key];
    res[key] = typeof val !== 'undefined' ? toJson(val) : val;
  }
  return res;
}

function virtualNodeToJson(obj) {
  var res = {
    // type
    t: types.VirtualNode,
    tn: obj.tagName
  };
  if (Object.keys(obj.properties).length) {
    res.p = plainObjectToJson(obj.properties);
  }
  if (obj.children.length) {
    res.c = arrayToJson(obj.children);
  }
  if (obj.key) {
    res.k = obj.key;
  }
  if (obj.namespace) {
    res.n = obj.namespace;
  }
  return res;
}

function virtualTextToJson(obj) {
  return {
    // type
    t: types.VirtualTree,
    // text
    x: obj.text
  };
}

function virtualPatchToJson(obj) {
  var res = {
    // type
    t: types.VirtualPatch,
    // patch type
    pt: obj.type
  };

  if (obj.vNode) {
    res.v = toJson(obj.vNode);
  }

  if (obj.patch) {
    res.p = toJson(obj.patch);
  }

  return res;
}

function softSetHookToJson(obj) {
  return {
    // type
    t: types.SoftSetHook,
    value: obj.value
  };
}

function objectToJson(obj) {
  if ('patch' in obj && typeof obj.type === 'number') {
    return virtualPatchToJson(obj);
  }
  if (obj.type === 'VirtualNode') {
    return virtualNodeToJson(obj);
  }
  if (obj.type === 'VirtualText') {
    return virtualTextToJson(obj);
  }
  if (obj instanceof SoftSetHook) {
    return softSetHookToJson(obj);
  }

  // plain object
  return plainObjectToJson(obj);
}

function toJson(obj) {

  var type = typeof obj;

  switch (type) {
    case 'string':
    case 'boolean':
    case 'number':
      return obj;
  }

  // type === 'object'
  if (Array.isArray(obj)) {
    return arrayToJson(obj);
  }

  if (!obj) { // null
    return null;
  }

  return objectToJson(obj);
}

module.exports = toJson;