// ***********************************************
// All of these tests are written to implement
// the official TodoMVC tests written for Selenium.
//
// The Cypress tests cover the exact same functionality,
// and match the same test names as TodoMVC.
// Please read our getting started guide
// https://on.cypress.io/introduction-to-cypress
//
// You can find the original TodoMVC tests here:
// https://github.com/tastejs/todomvc/blob/master/tests/test.js
// ***********************************************

import createTodoCommands from '../support'
import knownIssues from '../../tests/knownIssues'

/* global cy, Cypress */
const framework = Cypress.env('framework')
if (!framework) {
  throw new Error(
    `
    Please specify the framework name to test.
    See folder names in the /examples.

      cypress open --env framework=react

    Or pass framework name through environment variable

      CYPRESS_framework=angular-dart/web cypress open
  `
  )
}

const frameworkFolders = {
  ampersand: 'ampersand/',
  'angular-dart': 'angular-dart/web',
  'chaplin-brunch': 'chaplin-brunch/public',
  duel: 'duel/www',
}
const getExampleFolder = framework => frameworkFolders[framework] || framework

const noLocalStorageCheck = {
  backbone: true,
  backbone_marionette: true,
  backbone_require: true,
  knockback: true,
  flight: true,
  serenadejs: true,
  js_of_ocaml: true,
  reagent: true,
  rappidjs: true,
  exoskeleton: true,
  puremvc: true,
  'typescript-backbone': true,
  enyo_backbone: true,
  foam: true
}

const noLocalStorageSpyCheck = {
  canjs: true,
  canjs_require: true
}

const noAppStartCheck = {
  mithril: true
}

// usually when an app makes localStorage.setItem call we think
// it is ready to work. But some apps are so slow, that the DOM
// is well behind the data model. For these apps, do not consider
// intercepted localStorage.setItem a signal
const storageSetDoesNotMeanAppStarted = {
  flight: true,
  olives: true
}

// some apps serialize data in such a bad way that we cannot
// check localStorage for keywords like "complete" or "isComplete"
const badLocalStorageFormat = {
  js_of_ocaml: true
}

// some frameworks really rely on "blur" event
// to know when typing has finished
const blurAfterType = {
  ampersand: true,
  dijon: true,
  duel: true,
  jquery: true,
  vanillajs: true,
  'vanilla-es6': true
}

// add after typing if `...{enter}` is not enough for some frameworks
// cy.type('{enter}').then(safeBlur)
const safeBlur = $el => {
  if (blurAfterType[framework]) {
    const event = new Event('blur', {force: true})
    $el.get(0).dispatchEvent(event)
  }
}

// Some frameworks need to avoid runtime determination of selector type.
const usesIDSelectors = {
  polymer: false
}

const title = `TodoMVC - ${framework}`

function skipTestsWithKnownIssues () {
  // TODO find how to REALLY skip tests - currently does not
  // take suite chain into account, thus just hides the
  // tests with known issues
  const removeCommas = s => s.replace(/,/g, '')
  const issueNames = knownIssues
    .map(Cypress._.toLower)
    .filter(name => name.includes(framework))
    .map(removeCommas)
  console.log('framework %s has %d issue(s)', framework, issueNames.length)

  const realIt = window.it
  window.it = function (name, cb) {
    if (typeof name === 'function') {
      // using it(cb) form without title
      cb = name
      name = cb.name
    }
    if (!cb) {
      // nothing to do - skipped test, just title
      return
    }
    name = name.toLowerCase()
    const issue = issueNames.find(issueName => issueName.endsWith(name))
    if (issue) {
      console.log('test "%s" has a known issue', name)
      return realIt.skip(name, cb)
    } else {
      return realIt.apply(null, arguments)
    }
  }
  window.it.skip = realIt.skip
  window.it.only = realIt.only
}
skipTestsWithKnownIssues()

// checks that local storage has an item with given text
const checkTodosInLocalStorage = (presentText, force) => {
  if (noLocalStorageCheck[framework]) {
    if (!force) {
      return
    }
  }

  cy.log(`Looking for "${presentText}" in localStorage`)

  return cy.window().its('localStorage').then(storage => {
    return new Cypress.Promise((resolve, reject) => {
      const checkItems = () => {
        if (storage.length < 1) {
          return setTimeout(checkItems, 0)
        }
        if (
          Object.keys(storage).some(key => {
            return storage.getItem(key).includes(presentText)
          })
        ) {
          return resolve()
        }
        setTimeout(checkItems, 0)
      }
      checkItems()
    })
  })
}

const checkCompletedKeywordInLocalStorage = () => {
  if (badLocalStorageFormat[framework]) {
    return
  }

  cy.log(`Looking for any completed items in localStorage`)

  const variants = ['complete', 'isComplete']

  return cy.window().its('localStorage').then(storage => {
    return new Cypress.Promise((resolve, reject) => {
      const checkItems = () => {
        if (storage.length < 1) {
          return setTimeout(checkItems, 0)
        }
        if (
          Object.keys(storage).some(key => {
            const text = storage.getItem(key)
            return variants.some(variant =>
              text.includes(variant)
            )
          })
        ) {
          return resolve()
        }
        setTimeout(checkItems, 0)
      }
      checkItems()
    })
  })
}

const checkNumberOfTodosInLocalStorage = n => {
  if (noLocalStorageCheck[framework]) {
    return
  }

  cy.log(`localStorage should have ${n} todo items`)

  return cy.window().its('localStorage').then(storage => {
    return new Cypress.Promise((resolve, reject) => {
      const checkItems = () => {
        if (storage.length < 1) {
          return setTimeout(checkItems, 0)
        }
        if (
          Object.keys(storage).some(key => {
            const text = storage.getItem(key)
            // assuming it is an array
            try {
              const items = JSON.parse(text)
              return items.length === n
            } catch (e) {
              // ignore
              return
            }
          })
        ) {
          return resolve()
        }
        setTimeout(checkItems, 0)
      }
      checkItems()
    })
  })
}

const checkNumberOfCompletedTodosInLocalStorage = n => {
  if (noLocalStorageCheck[framework]) {
    return
  }

  cy.log(`Looking for "${n}" completed items in localStorage`)

  return cy.window().its('localStorage').then(storage => {
    return new Cypress.Promise((resolve, reject) => {
      const checkItems = () => {
        if (storage.length < 1) {
          return setTimeout(checkItems, 0)
        }
        if (
          Object.keys(storage).some(key => {
            const text = storage.getItem(key)
            // assuming it is an array
            try {
              const items = JSON.parse(text)
              if (items.length < n) {
                return
              }
              // MOST apps use "completed" property to mark task
              // canjs uses "complete" property, 😡
              const completed = Cypress._.filter(items, { completed: true }).
                concat(Cypress._.filter(items, { complete: true }))
              return completed.length === n
            } catch (e) {
              return
            }
          })
        ) {
          return resolve()
        }
        setTimeout(checkItems, 0)
      }
      checkItems()
    })
  })
}

// to find flaky tests we are running the entire suite N times
const N = parseFloat(Cypress.env('times') || '1')
console.log('Running tests %d time(s)', N)
let counter = 0
if (!Cypress._.isFinite(N)) {
  throw new Error(`Invalid number of tests ${N} from env "${Cypress.env('times')}"`)
}

Cypress._.times(N, () => {
  counter += 1
  const countedTitle = N > 1 ? `${counter} / ${N} ${title}` : title
  // TODO fix our runner
  // when using same "title" for describe, N suites are added
  // when using "countedTitle" - only the  LAST suite is added to the runner

  describe(title, function () {
    // setup these constants to match what TodoMVC does
    let TODO_ITEM_ONE = 'buy some cheese'
    let TODO_ITEM_TWO = 'feed the cat'
    let TODO_ITEM_THREE = 'book a doctors appointment'

    // different selectors depending on the app - some use ids, some use classes
    let useIds
    let selectors

    const idSelectors = {
      newTodo: '#new-todo',
      todoList: '#todo-list',
      todoItems: '#todo-list li',
      todoItemsVisible: '#todo-list li:visible',
      count: 'span#todo-count',
      main: '#main',
      footer: '#footer',
      toggleAll: '#toggle-all',
      clearCompleted: '#clear-completed',
      filters: '#filters',
      filterItems: '#filters li a'
    }
    const classSelectors = {
      newTodo: '.new-todo',
      todoList: '.todo-list',
      todoItems: '.todo-list li',
      todoItemsVisible: '.todo-list li:visible',
      count: 'span.todo-count',
      main: '.main',
      footer: '.footer',
      toggleAll: '.toggle-all',
      clearCompleted: '.clear-completed',
      filters: '.filters',
      filterItems: '.filters li a'
    }
    const setSelectors = ids => {
      useIds = ids
      selectors = useIds ? idSelectors : classSelectors
    }

    // reliably works in backbone app and other apps by using single selector
    const visibleTodos = () => cy.get(selectors.todoItemsVisible)

    const hasNoItems = () =>
      cy.get(selectors.todoItems).should('have.length', 0)

    const checkItemSaved = () => {
      if (noLocalStorageSpyCheck[framework]) {
        return
      }
      cy.wrap(localStorageSetItem, {log: false})
        .should('have.been.called')
      cy.wrap(localStorageSetItem, {log: false}).invoke('reset')
    }

    let currentTestId
    let localStorageSetItem

    beforeEach(function () {
      // By default Cypress will automatically
      // clear the Local Storage prior to each
      // test which ensures no todos carry over
      // between tests.
      //
      // Go out and visit our local web server
      // before each test, which serves us the
      // TodoMVC App we want to test against
      //
      // We've set our baseUrl to be http://localhost:8888
      // which is automatically prepended to cy.visit
      //
      // https://on.cypress.io/api/visit
      currentTestId = Math.random()
      let appHasStarted = false
      const folder = getExampleFolder(framework)
      cy
        .visit('/' + folder, {
          onBeforeLoad: win => {
            // prevent stray scheduled writes into localStorage
            // from writing old data into new test
            const setItem = win.localStorage.__proto__.setItem
            win.localStorage.__proto__.setItem = function (testId, name, value) {
              if (testId !== currentTestId) {
                console.error('old localStorage.setItem call!', name)
                return
              }
              // if something has made localStorage.setItem call -
              // that means app has started
              if (!storageSetDoesNotMeanAppStarted[framework]) {
                appHasStarted = true
              }

              return setItem.call(win.localStorage, name, value)
            }.bind(null, currentTestId)
            // now we can check from a test when the item has been stored
            // cannot use spy alias - retry seems to be broken right now
            localStorageSetItem = cy.spy(win.localStorage.__proto__, 'setItem')

            // detect when a web application starts by noticing
            // the first "addEventListener" to text input events

            // exceptions:
            // mithril attaches handlers directly to the elements
            // like this
            //   node[attrName] = autoredraw(dataAttr, node)
            // so for now assume framework has started
            if (noAppStartCheck[framework]) {
              appHasStarted = true
              return
            }

            const addListener = win.EventTarget.prototype.addEventListener
            win.EventTarget.prototype.addEventListener = function (name) {
              if (
                ['change', 'keydown', 'keypress', 'keyup', 'input'].includes(
                  name
                )
              ) {
                // web app added an event listener to the input box -
                // that means it is ready
                appHasStarted = true
                win.EventTarget.prototype.addEventListener = addListener
              }
              return addListener.apply(this, arguments)
            }
          }
        })
        .then({ timeout: 10000 }, () => {
          return new Cypress.Promise((resolve, reject) => {
            const isReady = () => {
              if (appHasStarted) {
                return resolve()
              }
              setTimeout(isReady, 0)
              // found raf to be unreliable - does not work at
              // all for troopjs_require for some reason
              // requestAnimationFrame(isReady)
            }
            isReady()
          })
        })

      // how to determine if we need to use ids or classes?
      // it is painful to have both types of elements in the
      // same tests - because our assertions often use `.should('have.class', ...)`
      cy.contains('h1', 'todos').should('be.visible')
      cy.document().then(doc => {
        if (framework in usesIDSelectors) {
          setSelectors(usesIDSelectors[framework])
          createTodoCommands(usesIDSelectors[framework])
        } else if (doc.querySelector('input#new-todo') && doc.querySelector('input.new-todo')) {
          throw new Error(
            'Cannot determine what kind of selectors this app uses. Add it to usesIDSelectors.'
          )
        } else if (doc.querySelector('input#new-todo')) {
          cy.log('app uses ID selectors')
          setSelectors(true)
          createTodoCommands(true)
        } else if (doc.querySelector('input.new-todo')) {
          cy.log('app uses class selectors')
          setSelectors(false)
          createTodoCommands(false)
        } else {
          throw new Error(
            'Cannot determine what kind of selectors this app uses.'
          )
        }
      })
    })

    beforeEach(() => {
      // catch any framework that debounces its localStorage writes
      // and causes items to "appear" in a new test all of the sudden
      hasNoItems()
    })

    afterEach(() => {
      // to detect when a test queued up some operation
      // and it happens AFTER test finishes
      currentTestId = 0
    })

    context('When page is initially opened', function () {
      it('should focus on the todo input field', function () {
        // get the currently focused element and assert
        // that it has class='new-todo'
        //
        // http://on.cypress.io/focused
        if (useIds) {
          cy.focused().should('have.id', 'new-todo')
        } else {
          cy.focused().should('have.class', 'new-todo')
        }
      })
    })

    context('No Todos', function () {
      it('starts with nothing', () => {
        hasNoItems()
      })

      it('should hide #main and #footer', function () {
        cy.get(selectors.todoItems).should('not.exist')
        // some apps remove elements from the DOM
        // but some just hide them
        cy.get(selectors.main).should('not.be.visible')
        cy.get(selectors.footer).should('not.be.visible')
      })
    })

    context('New Todo', function () {
      it('should allow me to add todo items', function () {
        // create 1st todo
        cy.get(selectors.newTodo).type(`${TODO_ITEM_ONE}{enter}`)
        checkItemSaved()

        // make sure the 1st label contains the 1st todo text
        cy
          .get(selectors.todoItems)
          .eq(0)
          .find('label')
          .should('contain', TODO_ITEM_ONE)

        // create 2nd todo
        cy.get(selectors.newTodo).type(`${TODO_ITEM_TWO}{enter}`)
        checkItemSaved()

        // make sure the 2nd label contains the 2nd todo text
        cy
          .get(selectors.todoItems)
          .eq(1)
          .find('label')
          .should('contain', TODO_ITEM_TWO)

        // make sure a framework that debounces its writes into localStorage
        // had a chance to write them
        checkNumberOfTodosInLocalStorage(2)
      })

      it('should clear text input field when an item is added', function () {
        cy.get(selectors.newTodo).type(`${TODO_ITEM_ONE}{enter}`)
        cy.get(selectors.newTodo).should('have.text', '')
        checkNumberOfTodosInLocalStorage(1)
      })

      it('should append new items to the bottom of the list', function () {
        // this is an example of a custom command
        // which is stored in tests/_support/spec_helper.js
        // you should open up the spec_helper and look at
        // the comments!
        cy.createDefaultTodos().as('todos')

        // even though the text content is split across
        // multiple <span> and <strong> elements
        // `cy.contains` can verify this correctly
        cy.get(selectors.count).contains('3')

        cy.get('@todos').eq(0).find('label').should('contain', TODO_ITEM_ONE)
        cy.get('@todos').eq(1).find('label').should('contain', TODO_ITEM_TWO)
        cy.get('@todos').eq(2).find('label').should('contain', TODO_ITEM_THREE)
        checkNumberOfTodosInLocalStorage(3)
      })

      it('should trim text input', function () {
        // this is an example of another custom command
        // since we repeat the todo creation over and over
        // again. It's up to you to decide when to abstract
        // repetitive behavior and roll that up into a custom
        // command vs explicitly writing the code.
        cy.createTodo(`    ${TODO_ITEM_ONE}    `)

        // we use as explicit assertion here about the text instead of
        // using 'contain' so we can specify the exact text of the element
        // does not have any whitespace around it
        cy
          .get(selectors.todoItems)
          .eq(0)
          .find('label')
          .should('have.text', TODO_ITEM_ONE)
        checkNumberOfTodosInLocalStorage(1)
      })

      it('should show #main and #footer when items added', function () {
        cy.createTodo(TODO_ITEM_ONE)
        cy.get(selectors.main).should('be.visible')
        cy.get(selectors.footer).should('be.visible')
        checkNumberOfTodosInLocalStorage(1)
      })
    })

    context('Mark all as completed', function () {
      // New commands used here:
      // - cy.check    https://on.cypress.io/api/check
      // - cy.uncheck  https://on.cypress.io/api/uncheck

      beforeEach(function () {
        // This is an example of aliasing
        // within a hook (beforeEach).
        // Aliases will automatically persist
        // between hooks and are available
        // in your tests below
        cy.createDefaultTodos().as('todos')
        checkNumberOfTodosInLocalStorage(3)
        checkItemSaved()
      })

      afterEach(() => {
        // each test in this block creates 3 todo itesm
        // make sure they are written into the storage
        // before starting a new test
        checkNumberOfTodosInLocalStorage(3)
      })

      it('should allow me to mark all items as completed', function () {
        // complete all todos
        // we use 'check' instead of 'click'
        // because that indicates our intention much clearer
        cy.get(selectors.toggleAll).check({force: true})
        checkItemSaved()

        // get each todo li and ensure its class is 'completed'
        cy.get('@todos').eq(0).should('have.class', 'completed')
        cy.get('@todos').eq(1).should('have.class', 'completed')
        cy.get('@todos').eq(2).should('have.class', 'completed')
        checkNumberOfCompletedTodosInLocalStorage(3)
      })

      it('should allow me to clear the complete state of all items', function () {
        // check and then immediately uncheck
        cy.get(selectors.toggleAll).check({force: true})
        checkItemSaved()
        cy.get(selectors.toggleAll).uncheck({force: true})
        checkItemSaved()

        cy.get('@todos').eq(0).should('not.have.class', 'completed')
        cy.get('@todos').eq(1).should('not.have.class', 'completed')
        cy.get('@todos').eq(2).should('not.have.class', 'completed')
        checkNumberOfCompletedTodosInLocalStorage(0)
      })

      it('complete all checkbox should update state when items are completed / cleared', function () {
        cy
          .get(selectors.toggleAll)
          .check({force: true})
          // this assertion is silly here IMO but
          // it is what TodoMVC does
        checkItemSaved()
        cy
          .get(selectors.toggleAll)
          .should('be.checked')

        // alias the first todo and then click it
        cy
          .get(selectors.todoItems)
          .eq(0)
          .as('firstTodo')
          .find('.toggle')
          .uncheck({force: true})
        checkItemSaved()

        // reference the .toggle-all element again
        // and make sure its not checked
        cy.get(selectors.toggleAll).should('not.be.checked')

        // reference the first todo again and now toggle it
        cy.get('@firstTodo').find('.toggle').check({force: true})
        checkItemSaved()
        checkNumberOfCompletedTodosInLocalStorage(3)

        // assert the toggle all is checked again
        cy.get(selectors.toggleAll).should('be.checked')
      })
    })

    context('Item', function () {
      // New commands used here:
      // - cy.clear    https://on.cypress.io/api/clear

      it('should allow me to mark items as complete', function () {
        // we are aliasing the return value of
        // our custom command 'createTodo'
        //
        // the return value is the <li> in the <ul.todos-list>
        cy.createTodo(TODO_ITEM_ONE).as('firstTodo')
        cy.createTodo(TODO_ITEM_TWO).as('secondTodo')

        cy.get('@firstTodo').find('.toggle').check()
        cy.get('@firstTodo').should('have.class', 'completed')

        cy.get('@secondTodo').should('not.have.class', 'completed')
        cy.get('@secondTodo').find('.toggle').check()

        cy.get('@firstTodo').should('have.class', 'completed')
        cy.get('@secondTodo').should('have.class', 'completed')
        checkNumberOfCompletedTodosInLocalStorage(2)
      })

      it('should allow me to un-mark items as complete', function () {
        cy.createTodo(TODO_ITEM_ONE).as('firstTodo')
        cy.createTodo(TODO_ITEM_TWO).as('secondTodo')

        cy.get('@firstTodo').find('.toggle').check()
        cy.get('@firstTodo').should('have.class', 'completed')
        cy.get('@secondTodo').should('not.have.class', 'completed')
        checkNumberOfCompletedTodosInLocalStorage(1)

        cy.get('@firstTodo').find('.toggle').uncheck()
        cy.get('@firstTodo').should('not.have.class', 'completed')
        cy.get('@secondTodo').should('not.have.class', 'completed')

        checkNumberOfCompletedTodosInLocalStorage(0)
      })

      it('should allow me to edit an item', function () {
        cy.createDefaultTodos()
        checkTodosInLocalStorage(TODO_ITEM_TWO)

        visibleTodos()
          .eq(1)
          // TODO: fix this, dblclick should
          // have been issued to label
          .find('label')
          .dblclick()


        // clear out the inputs current value
        // and type a new value
        visibleTodos()
          .eq(1)
          .find('.edit')
          .should('have.value', TODO_ITEM_TWO)
          // clear + type text + enter key
          .clear()
          .type('buy some sausages{enter}')
          .then(safeBlur)

        // explicitly assert about the text value
        visibleTodos().eq(0).should('contain', TODO_ITEM_ONE)
        visibleTodos().eq(1).should('contain', 'buy some sausages')
        visibleTodos().eq(2).should('contain', TODO_ITEM_THREE)
        checkTodosInLocalStorage('buy some sausages')
      })
    })

    context('Editing', function () {
      // New commands used here:
      // - cy.blur    https://on.cypress.io/api/blur

      beforeEach(function () {
        cy.createDefaultTodos().as('todos')
        checkNumberOfTodosInLocalStorage(3)
      })

      it('should hide other controls when editing', function () {
        cy.get('@todos').eq(1).find('label').dblclick()

        cy.get(selectors.todoItems).eq(1).find('.toggle').should('not.be.visible')
        cy.get(selectors.todoItems).eq(1).find('label').should('not.be.visible')
        checkNumberOfTodosInLocalStorage(3)
      })

      it('should save edits on blur', function () {
        cy.get('@todos').eq(1).find('label').dblclick()

        cy
          .get(selectors.todoItems)
          .eq(1)
          .find('.edit')
          .clear()
          .type('buy some sausages')
          // we can just send the blur event directly
          // to the input instead of having to click
          // on another button on the page. though you
          // could do that its just more mental work
          .blur()

        visibleTodos().eq(0).should('contain', TODO_ITEM_ONE)
        visibleTodos().eq(1).should('contain', 'buy some sausages')
        visibleTodos().eq(2).should('contain', TODO_ITEM_THREE)
        checkTodosInLocalStorage('buy some sausages')
      })

      it('should trim entered text', function () {
        cy.get('@todos').eq(1).find('label').dblclick()
        checkTodosInLocalStorage(TODO_ITEM_TWO)

        cy
          .get(selectors.todoItems)
          .eq(1)
          .find('.edit')
          .type('{selectall}{backspace}    buy some sausages    {enter}')
          .then(safeBlur)

        visibleTodos().eq(0).should('contain', TODO_ITEM_ONE)
        visibleTodos().eq(1).should('contain', 'buy some sausages')
        visibleTodos().eq(2).should('contain', TODO_ITEM_THREE)
        checkTodosInLocalStorage('buy some sausages')
      })

      it('should remove the item if an empty text string was entered', function () {
        cy.get('@todos').eq(1).find('label').dblclick()

        cy
          .get(selectors.todoItems)
          .eq(1)
          .find('.edit')
          .clear().type('{enter}')
          .then(safeBlur)


        visibleTodos().should('have.length', 2)
        checkNumberOfTodosInLocalStorage(2)
      })

      it('should cancel edits on escape', function () {
        visibleTodos().eq(1).find('label').dblclick()

        cy
        .get(selectors.todoItems)
        .eq(1)
        .find('.edit')
        .type('{selectall}{backspace}foo{esc}')

        visibleTodos().eq(0).should('contain', TODO_ITEM_ONE)
        visibleTodos().eq(1).should('contain', TODO_ITEM_TWO)
        visibleTodos().eq(2).should('contain', TODO_ITEM_THREE)
        checkNumberOfTodosInLocalStorage(3)
      })
    })

    context('Counter', function () {
      it('should display the current number of todo items', function () {
        cy.createTodo(TODO_ITEM_ONE)
        cy.get(selectors.count).contains('1')
        cy.createTodo(TODO_ITEM_TWO)
        cy.get(selectors.count).contains('2')
        checkNumberOfTodosInLocalStorage(2)
      })
    })

    context('Clear completed button', function () {
      beforeEach(function () {
        cy.createDefaultTodos().as('todos')
      })

      it('should display the correct text', function () {
        cy.get('@todos').eq(0).find('.toggle').check()
        cy.get(selectors.clearCompleted).contains('Clear completed')
      })

      it('should remove completed items when clicked', function () {
        cy.get('@todos').eq(1).find('.toggle').check()
        cy.get(selectors.clearCompleted).click()
        cy.get('@todos').should('have.length', 2)
        cy.get('@todos').eq(0).should('contain', TODO_ITEM_ONE)
        cy.get('@todos').eq(1).should('contain', TODO_ITEM_THREE)
      })

      it('should be hidden when there are no items that are completed', function () {
        cy.get('@todos').eq(1).find('.toggle').check()
        cy.get(selectors.clearCompleted).should('be.visible').click()
        cy.get(selectors.clearCompleted).should('not.be.visible')
      })
    })

    context('Persistence', function () {
      it('should persist its data', function () {
        // mimicking TodoMVC tests
        // by writing out this function
        function testState () {
          cy
            .get('@firstTodo')
            .should('contain', TODO_ITEM_ONE)
            .and('have.class', 'completed')
          cy
            .get('@secondTodo')
            .should('contain', TODO_ITEM_TWO)
            .and('not.have.class', 'completed')
        }

        cy.createTodo(TODO_ITEM_ONE).as('firstTodo')
        cy.createTodo(TODO_ITEM_TWO).as('secondTodo')
        cy.get('@firstTodo').find('.toggle').check().then(testState)
        // at this point, the app might still not save
        // the items in the local storage, for example KnockoutJS
        // first recomputes the items and still have "[]"
        checkTodosInLocalStorage(TODO_ITEM_ONE, true)
        checkCompletedKeywordInLocalStorage()

        // but there should be 1 completed item
        checkNumberOfCompletedTodosInLocalStorage(1)

        // now can reload
        cy.reload().then(testState)
      })
    })

    context('Routing', function () {
      beforeEach(function () {
        cy.createDefaultTodos().as('todos')
        // make sure the app had a chance to save updated todos in storage
        // before navigating to a new view, otherwise the items can get lost :(
        // in some frameworks like Durandal
        checkTodosInLocalStorage(TODO_ITEM_ONE)
      })

      it('should allow me to display active items', function () {
        cy.get('@todos').eq(1).find('.toggle').check()
        checkNumberOfCompletedTodosInLocalStorage(1)
        cy.contains(selectors.filterItems, 'Active').click()
        visibleTodos()
          .should('have.length', 2)
          .eq(0)
          .should('contain', TODO_ITEM_ONE)
        visibleTodos().eq(1).should('contain', TODO_ITEM_THREE)
      })

      it('should respect the back button', function () {
        cy.get('@todos').eq(1).find('.toggle').check()
        checkNumberOfCompletedTodosInLocalStorage(1)

        cy.log('Showing all items')
        cy.contains(selectors.filterItems, 'All').click()
        visibleTodos().should('have.length', 3)

        cy.log('Showing active items')
        cy.contains(selectors.filterItems, 'Active').click()
        cy.log('Showing completed items')
        cy.contains(selectors.filterItems, 'Completed').click()
        visibleTodos().should('have.length', 1)

        cy.log('Back to active items')
        cy.go('back')
        visibleTodos().should('have.length', 2)

        cy.log('Back to all items')
        cy.go('back')
        visibleTodos().should('have.length', 3)
      })

      it('should allow me to display completed items', function () {
        visibleTodos().eq(1).find('.toggle').check()
        checkNumberOfCompletedTodosInLocalStorage(1)
        cy.get(selectors.filters).contains('Completed').click()
        visibleTodos().should('have.length', 1)
      })

      it('should allow me to display all items', function () {
        visibleTodos().eq(1).find('.toggle').check()
        checkNumberOfCompletedTodosInLocalStorage(1)
        cy.get(selectors.filters).contains('Active').click()
        cy.get(selectors.filters).contains('Completed').click()
        cy.get(selectors.filters).contains('All').click()
        visibleTodos().should('have.length', 3)
      })

      it('should highlight the currently applied filter', function () {
        cy
          .contains(selectors.filterItems, 'All')
          .should('have.class', 'selected')
        cy.contains(selectors.filterItems, 'Active').click()
        // page change - active items
        cy
          .contains(selectors.filterItems, 'Active')
          .should('have.class', 'selected')
        cy.contains(selectors.filterItems, 'Completed').click()
        // page change - completed items
        cy
          .contains(selectors.filterItems, 'Completed')
          .should('have.class', 'selected')
      })
    })
  })
})
