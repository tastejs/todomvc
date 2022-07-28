describe('SOLD.com Take Home assessment: Bonus', () => {
	beforeEach(() => {
		cy.visit('/')
		cy.get('.new-todo')
		.type('testing')
		.type('{enter}')
	})

	it('Ensuring that todos are persistence', () => {
		cy.get('.todo-list > li')
		.should('have.length', 1)

		cy.get('.new-todo')
			.type('testing')
			.type('{enter}')

		cy.reload()

		cy.get('.todo-list > li')
			.should('have.length', 2)
	})
})
