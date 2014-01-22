function assertMatch(text, expression) {
    var msg = '"' + text + '" do not contain "' + expression + '"';
    assert(RegExp(expression).test(text), msg);
}
