describe('SOLD.com Take Home Assessment: General', () => {
	beforeEach(() => {
		cy.visit('')
	})

	// Test case 1:
	it('Initial page display, assert the main and footer sections should be hidden', () => {
		cy.get('.main')
			.should('not.exist');

		cy.get('.footer')
			.should('not.exist');
	})

	// Test case 2:
	it('When page is initially opened, it should focus on the todo input field', () => {
		cy.focused()
		.should('have.class', 'new-todo')
	})

	// Test case 3:
	it('Add todo, should clear text input field when an item is added, assert field is blank' , () => {
		cy.get('input.new-todo')
			.type('testing')
			.type('{enter}')
			.should('have.value', '');
	})

	// Test case 4:
	it('Add todo, assert the main and footer section should not be hidden', () => {
		cy.get('.new-todo')
			.type('testing')
			.type('{enter}');

		cy.get('.main')
			.should('exist');

		cy.get('.footer')
			.should('exist');
	})

	// Test case 5:
	it('Add new todo item and assert that it exists', () => {
		cy.get('.new-todo')
			.type('testing')
			.type('{enter}');

		cy.get('.todo-list > li')
			.should('exist');
	})

	// Test case 6:
	it('Add three todos and make sure all exist, and assert there are three li items', () => {
		for( let i = 0; i < 3; i++ ) {
			cy.get('.new-todo')
				.type('testing')
				.type('{enter}');
		}

		cy.get('.todo-list')
			.should('exist')
			.children()
			.should('have.length', 3)
	})

	// Test case 7:
	it('Add todo item which had leading and trailing spaces, when created should trim', () => {
		cy.get('.new-todo')
			.type('    testing     ')
			.type('{enter}')

		cy.get('.todo-list > li')
			.should('contain', 'testing')
	})
})
