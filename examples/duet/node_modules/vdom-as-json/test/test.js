'use strict';

var h = require('virtual-dom/h');
var diff = require('virtual-dom/diff');
var toJson = require('../lib/toJson');
var fromJson = require('../lib/fromJson');
var VirtualNode = require('virtual-dom/vnode/vnode');
var chai = require('chai');
chai.should();

describe('vdom-to-json test suite', function () {

  function renderCount(count) {
    return h('div', {
      style: {
        textAlign: 'center',
        lineHeight: (100 + count) + 'px',
        border: '1px solid red',
        width: (100 + count) + 'px',
        height: (100 + count) + 'px'
      }
    }, [String(count)]);
  }

  it('should preserve a node', function () {
    var node1 = renderCount(0);
    var json1 = toJson(node1);
    var node2 = fromJson(json1);
    var json2 = toJson(node2);
    node1.should.deep.equal(node2);
    json1.should.deep.equal(json2);
  });

  it('should preserve a patch', function () {
    var nodeA = renderCount(0);
    var nodeB = renderCount(1);
    var patch1 = diff(nodeA, nodeB);
    var json1 = toJson(patch1);
    var patch2 = fromJson(json1);
    var json2 = toJson(patch2);
    patch1.should.deep.equal(patch2);
    json1.should.deep.equal(json2);
  });

  it('should preserve key/namespace', function () {
    var node1 = new VirtualNode('a', {}, [], 'bar', 'baz');
    var json1 = toJson(node1);
    var node2 = fromJson(json1);
    var json2 = toJson(node2);
    node1.should.deep.equal(node2);
    json1.should.deep.equal(json2);
  });

  var structures = [
    h("div", "hello"),
    h("div", [h("span", "goodbye")]),
    h("div", "goodbye"),
    h("div", [h("span", "hello"), h("span", "again")]),
    h("div", h("div")),
    h("div", "text"),
    h("p", "more text"),
    h("div", [
      h("span", "text"),
      h("div.widgetContainer", [
        h("div", [
          h("span", "text"),
          h("div.widgetContainer", []),
          h("p", "more text")
        ]),
      ]),
      h("p", "more text")
    ]),
    h('div.foo#some-id', [
      h('span', 'some text'),
      h('input', {type: 'text', value: 'foo'})
    ]),
    h('h1', 'hello!'),
    h('a', {href: 'https://npm.im/hyperscript'}, 'hyperscript'),
    h('h1.fun', {style: {'font-family': 'Comic Sans MS'}}, 'Happy Birthday!'),
    h('input', {type: 'number'}, 1),
    h('input', {type: 'number', value: 1}),
    h('div', {attributes: {
      'data-something': 1,
      'data-something-else': true,
      'data-another-thing': null
    }})
  ];

  structures.forEach(function (structure, i) {
    var testName = 'test node: ' + i;
    it(testName, function () {
      var node1 = structure;
      var json1 = toJson(node1);
      var node2 = fromJson(json1);
      var json2 = toJson(node2);
      json1.should.deep.equal(json2, 'json is equal');
      node1.should.deep.equal(node2, 'nodes are equal');
    });
  });

  structures.forEach(function (structure1, i) {

    function testAgainst(structure2) {
      return function () {
        var nodeA = structure1;
        var nodeB = structure2;
        var patch1 = diff(nodeA, nodeB);
        var json1 = toJson(patch1);
        var patch2 = fromJson(json1);
        var json2 = toJson(patch2);
        json1.should.deep.equal(json2, 'test json');
        patch1.should.deep.equal(patch2, 'test patch');
      };
    }

    for (var j = i + 1; j < structures.length; j++) {
      var structure2 = structures[j];
      var testName = 'test diff: ' + i + 'vs' + j;

      it(testName, testAgainst(structure2));
    }
  });

});