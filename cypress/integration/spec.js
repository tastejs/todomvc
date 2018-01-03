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

describe(`TodoMVC - ${framework}`, function () {
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
    count: '#todo-count',
    main: '#main',
    footer: '#footer',
    toggleAll: '#toggle-all',
    clearCompleted: '#clear-completed',
    filters: '#filters'
  }
  const classSelectors = {
    newTodo: '.new-todo',
    todoList: '.todo-list',
    todoItems: '.todo-list li',
    count: '.todo-count',
    main: '.main',
    footer: '.footer',
    toggleAll: '.toggle-all',
    clearCompleted: '.clear-completed',
    filters: '.filters'
  }
  const setSelectors = ids => {
    useIds = ids
    selectors = useIds ? idSelectors : classSelectors
  }

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
    cy.visit('/' + framework)

    // how to determine if we need to use ids or classes?
    // it is painful to have both types of elements in the
    // same tests - because our assertions often use `.should('have.class', ...)`
    cy.contains('h1', 'todos').should('be.visible')
    cy.document().then(doc => {
      if (doc.querySelector('input#new-todo')) {
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
      cy.get(selectors.newTodo).type(TODO_ITEM_ONE).type('{enter}')

      // make sure the 1st label contains the 1st todo text
      cy
        .get(selectors.todoItems)
        .eq(0)
        .find('label')
        .should('contain', TODO_ITEM_ONE)

      // create 2nd todo
      cy.get(selectors.newTodo).type(TODO_ITEM_TWO).type('{enter}')

      // make sure the 2nd label contains the 2nd todo text
      cy
        .get(selectors.todoItems)
        .eq(1)
        .find('label')
        .should('contain', TODO_ITEM_TWO)
    })

    it('should clear text input field when an item is added', function () {
      cy.get(selectors.newTodo).type(TODO_ITEM_ONE).type('{enter}')
      cy.get(selectors.newTodo).should('have.text', '')
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
      cy.get(selectors.count).contains('3 items left')

      cy.get('@todos').eq(0).find('label').should('contain', TODO_ITEM_ONE)
      cy.get('@todos').eq(1).find('label').should('contain', TODO_ITEM_TWO)
      cy.get('@todos').eq(2).find('label').should('contain', TODO_ITEM_THREE)
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
      cy.get(selectors.todoItems).eq(0).should('have.text', TODO_ITEM_ONE)
    })

    it('should show #main and #footer when items added', function () {
      cy.createTodo(TODO_ITEM_ONE)
      cy.get(selectors.main).should('be.visible')
      cy.get(selectors.footer).should('be.visible')
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
    })

    it('should allow me to mark all items as completed', function () {
      // complete all todos
      // we use 'check' instead of 'click'
      // because that indicates our intention much clearer
      cy.get(selectors.toggleAll).check()

      // get each todo li and ensure its class is 'completed'
      cy.get('@todos').eq(0).should('have.class', 'completed')
      cy.get('@todos').eq(1).should('have.class', 'completed')
      cy.get('@todos').eq(2).should('have.class', 'completed')
    })

    it('should allow me to clear the complete state of all items', function () {
      // check and then immediately uncheck
      cy.get(selectors.toggleAll).check().uncheck()

      cy.get('@todos').eq(0).should('not.have.class', 'completed')
      cy.get('@todos').eq(1).should('not.have.class', 'completed')
      cy.get('@todos').eq(2).should('not.have.class', 'completed')
    })

    it('complete all checkbox should update state when items are completed / cleared', function () {
      // alias the .toggle-all for reuse later
      cy
        .get(selectors.toggleAll)
        .as('toggleAll')
        .check()
        // this assertion is silly here IMO but
        // it is what TodoMVC does
        .should('be.checked')

      // alias the first todo and then click it
      cy
        .get(selectors.todoItems)
        .eq(0)
        .as('firstTodo')
        .find('.toggle')
        .uncheck()

      // reference the .toggle-all element again
      // and make sure its not checked
      cy.get('@toggleAll').should('not.be.checked')

      // reference the first todo again and now toggle it
      cy.get('@firstTodo').find('.toggle').check()

      // assert the toggle all is checked again
      cy.get('@toggleAll').should('be.checked')
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
    })

    it('should allow me to un-mark items as complete', function () {
      cy.createTodo(TODO_ITEM_ONE).as('firstTodo')
      cy.createTodo(TODO_ITEM_TWO).as('secondTodo')

      cy.get('@firstTodo').find('.toggle').check()
      cy.get('@firstTodo').should('have.class', 'completed')
      cy.get('@secondTodo').should('not.have.class', 'completed')

      cy.get('@firstTodo').find('.toggle').uncheck()
      cy.get('@firstTodo').should('not.have.class', 'completed')
      cy.get('@secondTodo').should('not.have.class', 'completed')
    })

    it('should allow me to edit an item', function () {
      cy.createDefaultTodos().as('todos')

      cy
        .get('@todos')
        .eq(1)
        .as('secondTodo')
        // TODO: fix this, dblclick should
        // have been issued to label
        .find('label')
        .dblclick()

      // clear out the inputs current value
      // and type a new value
      cy
        .get('@secondTodo')
        .find('.edit')
        .clear()
        .type('buy some sausages')
        .type('{enter}')

      // explicitly assert about the text value
      cy.get('@todos').eq(0).should('contain', TODO_ITEM_ONE)
      cy.get('@secondTodo').should('contain', 'buy some sausages')
      cy.get('@todos').eq(2).should('contain', TODO_ITEM_THREE)
    })
  })

  context('Editing', function () {
    // New commands used here:
    // - cy.blur    https://on.cypress.io/api/blur

    beforeEach(function () {
      cy.createDefaultTodos().as('todos')
    })

    it('should hide other controls when editing', function () {
      cy.get('@todos').eq(1).as('secondTodo').find('label').dblclick()

      cy.get('@secondTodo').find('.toggle').should('not.be.visible')
      cy.get('@secondTodo').find('label').should('not.be.visible')
    })

    it('should save edits on blur', function () {
      cy.get('@todos').eq(1).as('secondTodo').find('label').dblclick()

      cy
        .get('@secondTodo')
        .find('.edit')
        .clear()
        .type('buy some sausages')
        // we can just send the blur event directly
        // to the input instead of having to click
        // on another button on the page. though you
        // could do that its just more mental work
        .blur()

      cy.get('@todos').eq(0).should('contain', TODO_ITEM_ONE)
      cy.get('@secondTodo').should('contain', 'buy some sausages')
      cy.get('@todos').eq(2).should('contain', TODO_ITEM_THREE)
    })

    it('should trim entered text', function () {
      cy.get('@todos').eq(1).as('secondTodo').find('label').dblclick()

      cy
        .get('@secondTodo')
        .find('.edit')
        .clear()
        .type('    buy some sausages    ')
        .type('{enter}')

      cy.get('@todos').eq(0).should('contain', TODO_ITEM_ONE)
      cy.get('@secondTodo').should('contain', 'buy some sausages')
      cy.get('@todos').eq(2).should('contain', TODO_ITEM_THREE)
    })

    it('should remove the item if an empty text string was entered', function () {
      cy.get('@todos').eq(1).as('secondTodo').find('label').dblclick()

      cy.get('@secondTodo').find('.edit').clear().type('{enter}')

      cy.get('@todos').should('have.length', 2)
    })

    it('should cancel edits on escape', function () {
      cy.get('@todos').eq(1).as('secondTodo').find('label').dblclick()

      cy.get('@secondTodo').find('.edit').clear().type('foo{esc}')

      cy.get('@todos').eq(0).should('contain', TODO_ITEM_ONE)
      cy.get('@todos').eq(1).should('contain', TODO_ITEM_TWO)
      cy.get('@todos').eq(2).should('contain', TODO_ITEM_THREE)
    })
  })

  context('Counter', function () {
    it('should display the current number of todo items', function () {
      cy.createTodo(TODO_ITEM_ONE)
      cy.get(selectors.count).contains('1 item left')
      cy.createTodo(TODO_ITEM_TWO)
      cy.get(selectors.count).contains('2 items left')
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
      cy
        .get('@firstTodo')
        .find('.toggle')
        .check()
        .then(testState)
        .reload()
        .then(testState)
    })
  })

  context('Routing', function () {
    beforeEach(function () {
      cy.createDefaultTodos().as('todos')
    })

    it('should allow me to display active items', function () {
      cy.get('@todos').eq(1).find('.toggle').check()
      cy.get(selectors.filters).contains('Active').click()
      cy.get('@todos').eq(0).should('contain', TODO_ITEM_ONE)
      cy.get('@todos').eq(1).should('contain', TODO_ITEM_THREE)
    })

    it('should respect the back button', function () {
      cy.get('@todos').eq(1).find('.toggle').check()
      cy.get(selectors.filters).contains('Active').click()
      cy.get(selectors.filters).contains('Completed').click()
      cy.get('@todos').should('have.length', 1)
      cy.go('back')
      cy.get('@todos').should('have.length', 2)
      cy.go('back')
      cy.get('@todos').should('have.length', 3)
    })

    it('should allow me to display completed items', function () {
      cy.get('@todos').eq(1).find('.toggle').check()
      cy.get(selectors.filters).contains('Completed').click()
      cy.get('@todos').should('have.length', 1)
    })

    it('should allow me to display all items', function () {
      cy.get('@todos').eq(1).find('.toggle').check()
      cy.get(selectors.filters).contains('Active').click()
      cy.get(selectors.filters).contains('Completed').click()
      cy.get(selectors.filters).contains('All').click()
      cy.get('@todos').should('have.length', 3)
    })

    it('should highlight the currently applied filter', function () {
      // using a within here which will automatically scope
      // nested 'cy' queries to our parent element <ul.filters>
      cy.get(selectors.filters).within(function () {
        cy.contains('All').should('have.class', 'selected')
        cy.contains('Active').click().should('have.class', 'selected')
        cy.contains('Completed').click().should('have.class', 'selected')
      })
    })
  })
})
