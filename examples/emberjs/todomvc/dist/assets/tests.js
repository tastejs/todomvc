'use strict';

define('todomvc/tests/lint/app.lint-test', [], function () {
  'use strict';

  QUnit.module('ESLint | app');

  QUnit.test('app.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'app.js should pass ESLint\n\n');
  });

  QUnit.test('components/todo-item.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/todo-item.js should pass ESLint\n\n');
  });

  QUnit.test('components/todo-list.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/todo-list.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/active.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/active.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/application.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/application.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/completed.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/completed.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/gt.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/gt.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/pluralize.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/pluralize.js should pass ESLint\n\n');
  });

  QUnit.test('resolver.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'resolver.js should pass ESLint\n\n');
  });

  QUnit.test('router.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'router.js should pass ESLint\n\n');
  });

  QUnit.test('routes/application.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/application.js should pass ESLint\n\n');
  });

  QUnit.test('services/repo.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'services/repo.js should pass ESLint\n\n');
  });
});
define('todomvc/tests/lint/templates.template.lint-test', [], function () {
  'use strict';

  QUnit.module('TemplateLint');

  QUnit.test('todomvc/templates/active.hbs', function (assert) {
    assert.expect(1);
    assert.ok(true, 'todomvc/templates/active.hbs should pass TemplateLint.\n\n');
  });

  QUnit.test('todomvc/templates/application.hbs', function (assert) {
    assert.expect(1);
    assert.ok(true, 'todomvc/templates/application.hbs should pass TemplateLint.\n\n');
  });

  QUnit.test('todomvc/templates/completed.hbs', function (assert) {
    assert.expect(1);
    assert.ok(true, 'todomvc/templates/completed.hbs should pass TemplateLint.\n\n');
  });

  QUnit.test('todomvc/templates/components/todo-item.hbs', function (assert) {
    assert.expect(1);
    assert.ok(true, 'todomvc/templates/components/todo-item.hbs should pass TemplateLint.\n\n');
  });

  QUnit.test('todomvc/templates/components/todo-list.hbs', function (assert) {
    assert.expect(1);
    assert.ok(true, 'todomvc/templates/components/todo-list.hbs should pass TemplateLint.\n\n');
  });

  QUnit.test('todomvc/templates/index.hbs', function (assert) {
    assert.expect(1);
    assert.ok(true, 'todomvc/templates/index.hbs should pass TemplateLint.\n\n');
  });
});
define('todomvc/tests/lint/tests.lint-test', [], function () {
  'use strict';

  QUnit.module('ESLint | tests');

  QUnit.test('test-helper.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'test-helper.js should pass ESLint\n\n');
  });
});
define('todomvc/tests/test-helper', ['todomvc/app', 'todomvc/config/environment', '@ember/test-helpers', 'ember-qunit'], function (_app, _environment, _testHelpers, _emberQunit) {
  'use strict';

  (0, _testHelpers.setApplication)(_app.default.create(_environment.default.APP));

  (0, _emberQunit.start)();
});
define('todomvc/config/environment', [], function() {
  var prefix = 'todomvc';
try {
  var metaName = prefix + '/config/environment';
  var rawConfig = document.querySelector('meta[name="' + metaName + '"]').getAttribute('content');
  var config = JSON.parse(unescape(rawConfig));

  var exports = { 'default': config };

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

});

require('todomvc/tests/test-helper');
EmberENV.TESTS_FILE_LOADED = true;
//# sourceMappingURL=tests.map
