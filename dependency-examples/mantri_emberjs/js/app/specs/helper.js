goog.provide('Todos.helper');

goog.require('Todos.todoMVCspec');


/**
 * Initialize the tests and run them.
 */
Todos.helper = function() {

  Todos.todoMVCspec();

  var jasmineEnv = jasmine.getEnv();
  var htmlReporter = new jasmine.HtmlReporter();
  jasmineEnv.addReporter( htmlReporter );
  jasmineEnv.execute();
};

