describe('SOLD.com Take home Accessment: Tasks Management', () => {
	beforeEach(() => {
		cy.visit('/')
		for (let i  = 0; i < 2; i++) {
			cy.get('.new-todo')
				.type(`testing ${i}`)
				.type('{enter}')
		}
	})

	// Test case 1
	it(`Using setup method, then mark all as completed. After marked complete, assert all items have "completed" class`, () => {
		cy.get('.toggle')
			.check()

		cy.get('.todo-list > li')
			.each((li) =>{
				expect(li).to.have.class('completed')
			})
	})


	// Test case 2
	it(`Using setup method, then mark all as completed. After marked complete, toggle completed flag and assert the "completed" class has been removed`, () => {
		cy.get('.toggle')
			.check()

		cy.get('.todo-list > li')
			.each((li) => {
				expect(li).to.have.class('completed')
			})

		cy.get('.toggle')
			.uncheck()

		cy.get('.todo-list > li')
			.each((li) => {
				expect(li).not.to.have.class('completed')
			})
	})

	// Test case 3
	it(`Using setup method, then assert the ".todo-count" has text "2 items left"`, () => {
		cy.get('.todo-count')
			.should('includes.text', '2 items left')
	})

	//Test case 4
	it(`Using setup method, mark one of the todos as completed, then assert “Clear Completed” is available` , () => {
		cy.get('.toggle')
			.first()
			.check()

		cy.get('.clear-completed')
			.should('exist')
	})

	// Test case 5
	it(` Using setup method, mark one of the todos as completed, click Clear Completed button, assert that marked item no longer exists`, () => {
		cy.get('.toggle')
			.first()
			.check()

		cy.get('.clear-completed')
			.click()

		cy.get('.todo-list')
			.children()
			.should('have.length', 1)
	})

	// Test case 6
	it('Using setup method, should hide other controls when editing', () => {
		cy.get('.todo-list > li')
			.first()
			.dblclick()
			.closest('.toggle')
			.should('not.be.visible')

		cy.get('.todo-list > li')
			.first()
			.closest('.destroy')
			.should('not.be.visible')
	})

	// Test case 7
	it('Using setup method, should highlight the currently applied filter', () => {
		const filter = ['Active', 'All', 'Completed']
		for (let i = 0; i < filter.length; i++) {
			cy.contains(filter[i])
				.click()
				.should('have.class', 'selected')
		}
	})
})
