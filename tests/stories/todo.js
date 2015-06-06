describe('protractorTesting', function () {

	testFunction(function () {
		browser.get('http://localhost:8080/examples/angularjs/#/');
	});

	//Here are the things we want to test.
	// 1. The URL is correct.
	it('The URL is correct');

	// 2. The page title is correct.
	it('The page title is correct');

	// 3. A user can add a to-do item.
	it('A user can add a to-do item');

	// 4. The list of current to-do items is correct.
	it('The list of current to-do items is correct');

	// 5. A user can change views("All", "Active", "Completed")
	it('A user can change views');

	// 6. A user can mark an item as completed
	it('A user can mark an item as completed');

	// 7. A user can delete an item
	it('A user can delete an item');
	
	// 8. A user can clear the completed items
	it('A user can clear the completed items');

	//Come up with two additional tests.  Briefly explain why you added each test in a code comment above the test.
	//9. clike todo radio button and make clear completed visible

	it('clike todo radio button and make clear completed visible');

	//10. click clear completed and change the left number
	it('click clear completed and change the left number')

});