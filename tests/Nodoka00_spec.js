// Written 23 August 2015 by Josh "Nodoka" Johnson.
describe('Nodoka00\'s coding challenge', function() {
	// Variables, to make life easier:
	var testList = [
		'Write some hearty code.',
		'Test said code until satisfied.',
		'Make commits and push.',
		'Submit pull request.',
		'Watch some anime.'
	];
	var site = 'http://localhost:8080/todomvc-poc/examples/angularjs/index.html#/';
	var viewList = ['All', 'Active', 'Completed'];
	var clearButton = element(by.id('clear-completed'));

	// Prelude:
	beforeEach(function() {
		browser.get(site);
	});

	// Pending tests:
	it ('should verify the correct URL', function() {
	});

	it ('should verify the title', function() {
	});

	it ('should allow the user to add a TODO item', function() {
	});

	it ('should verify the TODO list is correct', function() {
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
	// Postlude:
});
