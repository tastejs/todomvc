// Written 23 August 2015 by Josh "Nodoka" Johnson, Nodoka00 [at] gmail {dot} com.
describe('Nodoka00\'s coding challenge', function() {
	// Variables, to make life easier:
	var todoList = [
		'Write some hearty code.',
		'Test said code until satisfied.',
		'Make commits and push.',
		'Submit pull request.',
		'Watch some anime.'
	];
	var site = 'http://localhost:8080/todomvc-poc/examples/angularjs/index.html#/';
	var viewList = ['All', 'Active', 'Completed'];
	var clearButton = element(by.id('clear-completed'));
	var todoField = element(by.id('new-todo'));
	var actualTodoList = element.all(by.repeater('todo in todos'));

	function submitForm(fxn) {
		var todoForm = element(by.id('todo-form'));
		todoForm.submit().then(fxn);
	}

	// Prelude:
	beforeEach(function() {
		browser.get(site);
	});

	// Pending tests:
	it ('should verify the correct URL', function() {
		expect(browser.getCurrentUrl()).toEqual(site);
	});

	it ('should verify the title', function() {
		expect(browser.getTitle()).toEqual('AngularJS • TodoMVC');
	});

	it ('should allow the user to add a TODO item', function() {
		todoField.sendKeys(todoList[4]);
		submitForm(function() {
			expect(true);
		});
	});

	iit ('should verify the TODO list is correct', function() {
		for (var x = 0; x < 5; x++) {
			todoField.sendKeys(todoList[x]);
			submitForm();
		}
		browser.waitForAngular();
		expect(actualTodoList.getText()).toEqual(todoList);
	});

	it ('should verify that a user can change views', function() {
	});

	it ('should verify that an item is marked as Completed', function() {
	});

	it ('should verify that an item has been deleted', function() {
	});

	it ('should verify that the list of Completed items has been cleared', function() {
	});

	it ('should verify that an item, once checked, can be unchecked', function() {
	});

	it ('should verify that the user has cookies enabled on his/her browser', function() {
	});
});
