var attrToProp = require('../')
var h = attrToProp(require('virtual-dom/h'))
var test = require('tape')

test('class -> className', function (t) {
  var vnode = h('div', { class: 'value' })
  t.equal(vnode.properties.className, 'value')
  t.end()
})

test('for -> htmlFor', function (t) {
  var vnode = h('div', { for: 'value' })
  t.equal(vnode.properties.htmlFor, 'value')
  t.end()
})

test('http-equiv -> httpEquiv', function (t) {
  var vnode = h('div', { 'http-equiv': 'value' })
  t.equal(vnode.properties.httpEquiv, 'value')
  t.end()
})
