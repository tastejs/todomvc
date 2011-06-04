//console.log('running qunit');
steal
  .plugins("funcunit/qunit")
  .css('one','../two','one')
  .then("steal_test")