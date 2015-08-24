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

	// Helper functions:
	function submitForm(fxn) {
		var todoForm = element(by.id('todo-form'));
		todoForm.submit().then(fxn);
	}

	function changeView(name, fxn) {
		var linkToUse = element(By.linkText(name));
		linkToUse.click().then(fxn);
	}

	function unCheckItem(box, fxn) {
		box.click().then(fxn);
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

	it ('should verify the TODO list is correct', function() {
		for (var x = 0; x < 5; x++) {
			todoField.sendKeys(todoList[x]);
			submitForm();
		}
		browser.waitForAngular();
		expect(actualTodoList.getText()).toEqual(todoList);
	});

	it ('should verify that a user can change views', function() {
		todoField.sendKeys(todoList[0]);
		submitForm(function() {
			changeView('All', function() {
				changeView('Active', function() {
					changeView('Completed', function() {
						changeView('All', function() {
							expect(true);
						});
					});
				});
			});
		});
	});

	it ('should verify that an item is marked as Completed', function() {
		todoField.sendKeys(todoList[1]);
		submitForm(function() {
			var targetBox = element.all(by.exactRepeater('todo in todos').row(0)).then(function(target) {
				var targetBox = target[0].element(by.model('todo.completed'));
				unCheckItem(targetBox, function() {
					expect(targetBox.isSelected()).toBe(true);
				});
			});
		});
	});

	iit ('should verify that an item has been deleted', function() {
		for (var x = 0; x < 5; x++) {
			todoField.sendKeys(todoList[x]);
			submitForm();
		}
		var targetBox = element.all(by.exactRepeater('todo in todos').row(4)).then(function(target) {
			var targetBox = target[0].element(by.model('todo.completed'));
			unCheckItem(targetBox, function() {
				element(by.id('clear-completed')).click().then(function() {
					expect(actualTodoList.count()).toEqual(4);
				});
			});
		});
	});

	it ('should verify that the list of Completed items has been cleared', function() {
	});

	it ('should verify that an item, once checked, can be unchecked', function() {
		todoField.sendKeys(todoList[3]);
		submitForm(function() {
			var targetBox = element.all(by.exactRepeater('todo in todos').row(0)).then(function(target) {
				var targetBox = target[0].element(by.model('todo.completed'));
				unCheckItem(targetBox);
				browser.waitForAngular();
				unCheckItem(targetBox, function() {
					expect(targetBox.isSelected()).toBe(false);
				});
			});
		});
	});

	it ('should verify that the user has cookies enabled on his/her browser', function() {
	});
});
