'use strict';

var types = require('./types');
var VirtualNode = require('virtual-dom/vnode/vnode');
var VirtualText = require('virtual-dom/vnode/vtext');
var VirtualPatch = require('virtual-dom/vnode/vpatch');
var SoftSetHook =
  require('virtual-dom/virtual-hyperscript/hooks/soft-set-hook');

function arrayFromJson(json) {
  var len = json.length;
  var i = -1;
  var res = new Array(len);
  while (++i < len) {
    res[i] = fromJson(json[i]);
  }
  return res;
}

function plainObjectFromJson(json) {
  var res = {};
  /* jshint -W089 */
  /* this is fine; these objects are always plain */
  for (var key in json) {
    var val = json[key];
    res[key] = typeof val !== 'undefined' ? fromJson(val) : val;
  }
  return res;
}

function virtualNodeFromJson(json) {
  return new VirtualNode(json.tn,
    json.p ? plainObjectFromJson(json.p) : {}, // patch
    json.c ? arrayFromJson(json.c) : [], // children
    json.k, // key
    json.n); // namespace
}

function virtualTextFromJson(json) {
  return new VirtualText(json.x);
}

function virtualPatchFromJson(json) {
  return new VirtualPatch(
    json.pt, // patchType
    json.v ? fromJson(json.v) : null, // virtualNode
    json.p && fromJson(json.p) // patch
  );
}

function softSetHookFromJson(json) {
  return new SoftSetHook(json.value);
}

function objectFromJson(json) {
  switch (json.t) { // type
    case types.VirtualPatch:
      return virtualPatchFromJson(json);
    case types.VirtualNode:
      return virtualNodeFromJson(json);
    case types.VirtualTree:
      return virtualTextFromJson(json);
    case types.SoftSetHook:
      return softSetHookFromJson(json);
  }
  return plainObjectFromJson(json);
}

function fromJson(json) {
  var type = typeof json;

  switch (type) {
    case 'string':
    case 'boolean':
    case 'number':
      return json;
  }

  // type === 'object'

  if (Array.isArray(json)) {
    return arrayFromJson(json);
  }

  if (!json) { // null
    return null;
  }

  return objectFromJson(json);
}

module.exports = fromJson;