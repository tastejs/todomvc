// spec.js
describe('Protractor TodoMVC App Automation Testing', function () {

	beforeEach(function () {
		browser.get('http://localhost:8080/examples/angularjs/#/');
	});

	// 1.The URL is correct.
	it('Must match the URL');

	// 2. The page title is correct.
	it('Must Match the Title');

	// 3. A user can add a to-do item.
	it('should add a new todo');

	// 4. The list of current to-do items is correct.
	it('should mach the current to-do list');

	// 5. A user can change views("All", "Active", "Completed")
	it('should change views(all, active, completed');

	//// 6. A user can mark an item as completed
	it('should mark an item as complete', function() {
		element(by.model('newTodo')).sendKeys("Adding 1st ToDo");
		element(by.id('todo-form')).submit();

		element(by.model('todo.completed')).click();
		expect(element(by.id('todo-count')).getText()).toEqual('3 items left');
	});

	//7. A user can delete an item
	it('should delete a todo');
	//

	// 8. A user can clear the completed items
	it('should mark one to-do as complete');

	//9. A user can click on todo radio button, then Clear Completed must visible

	it('A user can click on todo radio button, then Clear Completed must visible');

	//10. A user can clear completed, the number of left must be changed.
	it('A user can clear completed, the number of left must be changed.')

});

