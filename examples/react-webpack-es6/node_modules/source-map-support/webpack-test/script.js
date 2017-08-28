require('../').install();

function foo() {
  throw new Error('foo');
}

try {
  foo();
} catch (e) {
  if (/\bscript\.js\b/.test(e.stack)) {
    document.body.appendChild(document.createTextNode('Test passed'));
  } else {
    document.body.appendChild(document.createTextNode('Test failed'));
    console.log(e.stack);
  }
}
