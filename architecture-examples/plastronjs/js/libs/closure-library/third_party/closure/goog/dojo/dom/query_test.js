goog.require('goog.dom');
goog.require('goog.dom.query');
goog.require('goog.testing.asserts');  // assertThrows

goog.setTestOnly('query_test');

function testBasicSelectors() {
  assertQuery(4, 'h3');
  assertQuery(1, 'h1:first-child');
  assertQuery(2, 'h3:first-child');
  assertQuery(1, '#t');
  assertQuery(1, '#bug');
  assertQuery(4, '#t h3');
  assertQuery(1, 'div#t');
  assertQuery(4, 'div#t h3');
  assertQuery(0, 'span#t');
  assertQuery(1, '#t div > h3');
  assertQuery(2, '.foo');
  assertQuery(1, '.foo.bar');
  assertQuery(2, '.baz');
  assertQuery(3, '#t > h3');
}

function testSyntacticEquivalents() {
  // syntactic equivalents
  assertQuery(12, '#t > *');
  assertQuery(12, '#t >');
  assertQuery(3, '.foo > *');
  assertQuery(3, '.foo >');
}

function testWithARootById() {
  // with a root, by ID
  assertQuery(3, '> *', 'container');
  assertQuery(3, '> h3', 't');
}

function testCompoundQueries() {
  // compound queries
  assertQuery(2, '.foo, .bar');
  assertQuery(2, '.foo,.bar');
}

function testMultipleClassAttributes() {
  // multiple class attribute
  assertQuery(1, '.foo.bar');
  assertQuery(2, '.foo');
  assertQuery(2, '.baz');
}

function testCaseSensitivity() {
  // case sensitivity
  assertQuery(1, 'span.baz');
  assertQuery(1, 'sPaN.baz');
  assertQuery(1, 'SPAN.baz');
  assertQuery(1, '[class = \"foo bar\"]');
  assertQuery(2, '[foo~=\"bar\"]');
  assertQuery(2, '[ foo ~= \"bar\" ]');
}

function testAttributes() {
  assertQuery(3, '[foo]');
  assertQuery(1, '[foo$=\"thud\"]');
  assertQuery(1, '[foo$=thud]');
  assertQuery(1, '[foo$=\"thudish\"]');
  assertQuery(1, '#t [foo$=thud]');
  assertQuery(1, '#t [ title $= thud ]');
  assertQuery(0, '#t span[ title $= thud ]');
  assertQuery(2, '[foo|=\"bar\"]');
  assertQuery(1, '[foo|=\"bar-baz\"]');
  assertQuery(0, '[foo|=\"baz\"]');
}

function testDescendantSelectors() {
  assertQuery(3, '>', 'container');
  assertQuery(3, '> *', 'container');
  assertQuery(2, '> [qux]', 'container');
  assertEquals('child1', goog.dom.query('> [qux]', 'container')[0].id);
  assertEquals('child3', goog.dom.query('> [qux]', 'container')[1].id);
  assertQuery(3, '>', 'container');
  assertQuery(3, '> *', 'container');
}

function testSiblingSelectors() {
  assertQuery(1, '+', 'container');
  assertQuery(3, '~', 'container');
  assertQuery(1, '.foo + span');
  assertQuery(4, '.foo ~ span');
  assertQuery(1, '#foo ~ *');
  assertQuery(1, '#foo ~');
}

function testSubSelectors() {
  // sub-selector parsing
  assertQuery(1, '#t span.foo:not(span:first-child)');
  assertQuery(1, '#t span.foo:not(:first-child)');
}

function testNthChild() {
  assertEquals(goog.dom.$('_foo'), goog.dom.query('.foo:nth-child(2)')[0]);
  assertQuery(2, '#t > h3:nth-child(odd)');
  assertQuery(3, '#t h3:nth-child(odd)');
  assertQuery(3, '#t h3:nth-child(2n+1)');
  assertQuery(1, '#t h3:nth-child(even)');
  assertQuery(1, '#t h3:nth-child(2n)');
  assertQuery(1, '#t h3:nth-child(2n+3)');
  assertQuery(2, '#t h3:nth-child(1)');
  assertQuery(1, '#t > h3:nth-child(1)');
  assertQuery(3, '#t :nth-child(3)');
  assertQuery(0, '#t > div:nth-child(1)');
  assertQuery(7, '#t span');
  assertQuery(3, '#t > *:nth-child(n+10)');
  assertQuery(1, '#t > *:nth-child(n+12)');
  assertQuery(10, '#t > *:nth-child(-n+10)');
  assertQuery(5, '#t > *:nth-child(-2n+10)');
  assertQuery(6, '#t > *:nth-child(2n+2)');
  assertQuery(5, '#t > *:nth-child(2n+4)');
  assertQuery(5, '#t > *:nth-child(2n+4)');
  assertQuery(12, '#t > *:nth-child(n-5)');
  assertQuery(6, '#t > *:nth-child(2n-5)');
}

function testEmptyPseudoSelector() {
  assertQuery(4, '#t > span:empty');
  assertQuery(6, '#t span:empty');
  assertQuery(0, 'h3 span:empty');
  assertQuery(1, 'h3 :not(:empty)');
}

function testIdsWithColons(){
  assertQuery(1, "#silly\\:id\\:\\:with\\:colons");
}

function testOrder() {
  var els = goog.dom.query('.myupperclass .myclass input');
  assertEquals('myid1', els[0].id);
  assertEquals('myid2', els[1].id);
}

function testCorrectDocumentInFrame() {
  var frameDocument = window.frames['ifr'].document;
  frameDocument.body.innerHTML =
      document.getElementById('iframe-test').innerHTML;

  var els = goog.dom.query('#if1 .if2 div', document);
  var frameEls = goog.dom.query('#if1 .if2 div', frameDocument);

  assertEquals(els.length, frameEls.length);
  assertEquals(1, frameEls.length);
  assertNotEquals(document.getElementById('if3'),
                  frameDocument.getElementById('if3'));
}

/**
 * @param {number} expectedNumberOfNodes
 * @param {...*} var_args
 */
function assertQuery(expectedNumberOfNodes, var_args) {
  var args = Array.prototype.slice.call(arguments, 1);
  assertEquals(expectedNumberOfNodes,
               goog.dom.query.apply(null, args).length);
}
