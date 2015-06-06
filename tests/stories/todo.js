
describe('protractorTesting', function () {

	testFunction(function () {
		browser.get('http://localhost:8080/examples/angularjs/#/');
	});

	// 1.The URL is correct.
	it('The URL is correct', function () {
		expect(browser.getCurrentUrl()).toEqual('http://localhost:8080/examples/angularjs/#/');
	});

	// 2. The page title is correct.
	it('The page title is correct', function () {
		expect(browser.getTitle()).toEqual('AngularJS • TodoMVC');
	});

	// 3. A user can add a to-do item.
	it('A user can add a to-do item', function () {
		element(by.model('newTodo')).sendKeys("Adding 1st ToDo");
		element(by.id('todo-form')).submit();
		expect(element(by.id('todo-count')).getText()).toEqual('1 item left');
	});

	// 4. The list of current to-do items is correct.
	it('The list of current to-do items is correct', function () {
		element(by.model('newTodo')).sendKeys("Adding 1st ToDo");
		element(by.id('todo-form')).submit();
		expect(element(by.binding('todo.title')).getText()).toEqual("Adding 1st ToDo");
		element(by.model('newTodo')).sendKeys("Adding 2rd ToDo");
		element(by.id('todo-form')).submit();
		var toDoList = element.all(by.binding('todo.title'));
		var secondElement = toDoList.last();
		expect(secondElement.getText()).toEqual('Adding 2rd ToDo');
	});

	// 5. A user can change views("All", "Active", "Completed")
	it('A user can change views', function() {
		var allLink = element.all(by.css('#filters a')).get(0);
		var activeLink = element.all(by.css('#filters a')).get(1);
		var completedLink = element.all(by.css('#filters a')).get(2);
		allLink.click();
		expect(browser.getCurrentUrl()).toEqual('http://localhost:8080/examples/angularjs/#/');
		activeLink.click();
		expect(browser.getCurrentUrl()).toEqual('http://localhost:8080/examples/angularjs/#/active');
		completedLink.click();
		expect(browser.getCurrentUrl()).toEqual('http://localhost:8080/examples/angularjs/#/completed');

	});

	// 6. A user can mark an item as completed
	it('A user can mark an item as completed', function() {
		element(by.model('newTodo')).sendKeys("Adding 1st ToDo");
		element(by.id('todo-form')).submit();
		element(by.model('todo.completed')).click();
		expect(element(by.id('todo-count')).getText()).toEqual('3 items left');
	});

	// 7. A user can delete an item
	it('A user can delete an item', function(){
			//todo
	});

	// 8. A user can clear the completed items
	it('A user can clear the completed items', function() {
		element(by.model('newTodo')).sendKeys("Adding first ToDo");
		element(by.id('todo-form')).submit();
		expect(element(by.id('todo-count')).getText()).toEqual('4 items left');
		element.all(by.model('todo.completed')).first().click();
		expect(element(by.id('todo-count')).getText()).toEqual('3 items left');
	});

	//9. clike todo radio button and make clear completed visible
	it('clike todo radio button and make clear completed visible', function () {
		element.all(by.model('todo.completed')).first().click();
		expect(element(by.id('clear-completed')).getText()).toEqual('Clear completed');
	});

	//10. click clear completed and change the left number
	it('click clear completed and change the left number', function() {
		element(by.id('clear-completed')).click();
		expect(element(by.id('todo-count')).getText()).toEqual('5 items left');

	})

});