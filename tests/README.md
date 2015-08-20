# TodoMVC Browser Tests

The TodoMVC project has a great many implementations of exactly the same app using different MV* frameworks. Each app should be functionally identical. The goal of these tests is to provide a fully automated browser-based test that can be used to ensure that the specification is being followed by each and every TodoMVC app.


## Todo

- [ ] Complete the test implementation (27 out of 28 are now complete). The only test that I am struggling with is to test that the delete button becomes visible on hover.
- [ ] Find a more elegant solution for TodoMVC apps that use RequireJS, currently there is a short 'sleep' statement in order to give the browser time to load dependencies. Yuck!
- [ ] Run JSHint over my code ;-)
- [ ] Make it work with PhantomJS. In practice, Phantom is only a little bit faster, but it should work. Currently there are a few Phantom specific failures.
- [ ] Allow testing of apps that require a server (see: https://github.com/tastejs/todomvc/pull/821/files#r9377070)


## Running the tests

These tests use Selenium 2 (WebDriver), via the JavaScript API (WebdriverJS).  In order to run the tests you will need to install the dependencies.  npm must be version 2.0.0 or greater, so upgrade it first with `npm install -g npm` if `npm --version` outputs anything less than 2.0.0.  Run the following command from within the `tests` folder:

```sh
$ npm install
```

You need to run a local server at the root of the TodoMVC project. Start the server using:

```sh
$ npm run serve
```

To run the tests for all TodoMVC implementations, run the following:

```sh
$ npm run test
```

In order to run tests for a single TodoMVC implementation, supply a framework argument as follows:

```sh
$ npm run test -- --framework=angularjs
```

N.B. Remember the extra -- to separate the script arguments from the npm arguments.

In order to run a specific test, use the mocha 'grep' function. For example:

```
$ npm run test -- --framework=jquery --grep 'should trim entered text'

  TodoMVC - jquery
    Editing
      ✓ should trim entered text (1115ms)


  1 passing (3s)
```

### Specifying the browser

You can also specify the browser that will be used to execute the tests via the `---browser` argument. The tests default to using Chrome. For example, to run against phantomjs, use the following:

```sh
$ npm run test -- --browser=phantomjs
```

You must install phantomjs first of course!

Valid browser names can be found within webdriver via the `webdriver.Browser` enumeration.


## Reporting against known issues

The `knownIssues.js` file details the currently known issues with the TodoMVC implementations. You can run the tests and compare against these issues using the `mocha-known-issues-reporter`:

```sh
$ npm run test -- --reporter=mocha-known-issues-reporter
```

When run via grunt the suite supports exactly the same command line arguments.

An example output with the known issues reporter is shown below:

```
$ npm run test -- --reporter=mocha-known-issues-reporter --framework=jquery
...
Running "simplemocha:files" (simplemocha) task
(1 of 27) pass: TodoMVC - jquery, No Todos, should hide #main and #footer
[...]
(17 of 27) pass: TodoMVC - jquery, Editing, should remove the item if an empty text string was entered
(18 of 27) known issue: TodoMVC - jquery, Editing, should cancel edits on escape -- error: undefined
(19 of 27) pass: TodoMVC - jquery, Counter, should display the current number of todo items
(20 of 27) pass: TodoMVC - jquery, Clear completed button, should display the number of completed items
(21 of 27) pass: TodoMVC - jquery, Clear completed button, should remove completed items when clicked
(22 of 27) pass: TodoMVC - jquery, Clear completed button, should be hidden when there are no items that are completed
(23 of 27) pass: TodoMVC - jquery, Persistence, should persist its data
(24 of 27) known issue: TodoMVC - jquery, Routing, should allow me to display active items -- error: Cannot call method 'click' of undefined
(25 of 27) known issue: TodoMVC - jquery, Routing, should allow me to display completed items -- error: Cannot call method 'click' of undefined
(26 of 27) known issue: TodoMVC - jquery, Routing, should allow me to display all items -- error: Cannot call method 'click' of undefined
(27 of 27) known issue: TodoMVC - jquery, Routing, should highlight the currently applied filter -- error: Cannot call method 'getAttribute' of undefined

passed: 22/27
failed: 5/27
new issues: 0
resolved issues: 0
```

The reporter indicates the number of passes, failed, new and resolved issues. This makes it ideal for regression testing.

### Example output

A test run with the 'spec' reporter looks something like the following:

```
$ npm run test -- --framework=angularjs

  angularjs
    TodoMVC
      No Todos
        ✓ should hide #main and #footer (201ms)
      New Todo
        ✓ should allow me to add todo items (548ms)
        ✓ should clear text input field when an item is added (306ms)
        ✓ should trim text input (569ms)
        ✓ should show #main and #footer when items added (405ms)
      Mark all as completed
        ✓ should allow me to mark all items as completed (1040ms)
        ✓ should allow me to clear the completion state of all items (1014ms)
        ✓ complete all checkbox should update state when items are completed (1413ms)
      Item
        ✓ should allow me to mark items as complete (843ms)
        ✓ should allow me to un-mark items as complete (978ms)
        ✓ should allow me to edit an item (1155ms)
        ✓ should show the remove button on hover
      Editing
        ✓ should hide other controls when editing (718ms)
        ✓ should save edits on enter (1093ms)
        ✓ should save edits on blur (1256ms)
        ✓ should trim entered text (1163ms)
        ✓ should remove the item if an empty text string was entered (1033ms)
        ✓ should cancel edits on escape (1115ms)
      Counter
        ✓ should display the current number of todo items (462ms)
      Clear completed button
        ✓ should display the number of completed items (873ms)
        ✓ should remove completed items when clicked (898ms)
        ✓ should be hidden when there are no items that are completed (893ms)
      Persistence
        ✓ should persist its data (3832ms)
      Routing
        ✓ should allow me to display active items (871ms)
        ✓ should allow me to display completed items (960ms)
        ✓ should allow me to display all items (1192ms)
        ✓ should highlight the currently applied filter (1095ms)


  27 passing (1m)
```


## Speed mode

In order to keep each test case fully isolated, the browser is closed then re-opened in between each test. This does mean that the tests can take quite a long time to run. If you don't mind the risk of side-effects you can run the tests in speed mode by adding the `--speedMode` argument.

```sh
$ npm run test -- --speedMode
```

Before each test all the todo items are checked as completed and the 'clear complete' button pressed. This make the tests run in around half the time, but with the obvious risk that the tear-down code may fail.


## Lax mode

There are certain implementations (e.g. GWT and Dojo) where the constraints of the framework mean that it is not possible to match exactly the HTML specification for TodoMVC. In these cases the tests can be run in a 'lax' mode where the XPath queries used to locate DOM elements are more general. For example, rather than looking for a checkbox `input` element with a class of `toggle`, in lax mode it simply looks for any `input` elements of type `checkbox`. To run the tests in lax mode, simply use the `--laxMode` argument:


```sh
$ npm run test -- --laxMode
```


## Test design

Very briefly, the tests are designed as follows:

- `page.js` - provides an abstraction layer for the HTML template. All the code required to access elements from the DOM is found within this file. The XPaths used to locate elements are based on the TodoMVC specification, using the required element classes / ids.
- `pageLaxMode.js` - extends the above in order to relax the XPath constraints.
- `testOperations.js` - provides common assertions and operations.
- `test.js` - Erm … the tests! These are written to closely match the TodoMVC spec.
- `allTest.js` - A simple file that locates all of the framework examples, and runs the tests for each.

**NOTE:** All of the WebdriverJS methods return promises and are executed asynchronously. However, you do not have to 'chain' them using `then`, they are instead automagically added to a queue, then executed. This means that if you add non-WebdriverJS operations (asserts, log messages) these will not be executed at the point you might expect. This is why `TestOperations.js` uses an explicit `then` each time it asserts.
