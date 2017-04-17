'use strict';
describe('TodoMVC Protractor Testing', function() { 
	
	beforeEach(function() {
		browser.get('http://localhost:8080/todomvc/examples/angularjs/#/');
	});

	/*The URL is correct. */	
	it('should show correct URL.', function() {
		expect(browser.getCurrentUrl()).toEqual('http://localhost:8080/todomvc/examples/angularjs/#/');
	});
	
	/* The page title is correct */
	it('should show correct page title.', function () {
		expect(browser.getTitle()).toEqual('AngularJS • TodoMVC');
	});

	/* A user can add a todo item.*/
	it('should add a todo by user.', function () {
		element(by.model('newTodo')).sendKeys("Angular");
		element(by.id('todo-form')).submit();
		expect(element(by.id('todo-count')).getText()).toEqual('1 item left');
	});

	/* The list of current todo items is correct.*/
	it('should match current todo items', function () {
		element(by.model('newTodo')).sendKeys("AngularJS Optimized");
		element(by.id('todo-form')).submit();
		expect(element.all(by.binding('todo.title')).last().getText()).toEqual('AngularJS Optimized');
	});
	
	/* A user can change views("All", "Active", "Completed") */
	it('should changes views(all, active, completed', function() {
		element.all(by.css('#filters a')).get(0).click();
		expect(browser.getCurrentUrl()).toEqual('http://localhost:8080/todomvc/examples/angularjs/#/');
		element.all(by.css('#filters a')).get(1).click();
		expect(browser.getCurrentUrl()).toEqual('http://localhost:8080/todomvc/examples/angularjs/#/active');
		element.all(by.css('#filters a')).get(2).click();
		expect(browser.getCurrentUrl()).toEqual('http://localhost:8080/todomvc/examples/angularjs/#/completed');
	});

	/* A user can mark an item as completed */
	it('should mark an item as complete', function() {
		element(by.model('newTodo')).sendKeys("Protractor Example");
		element(by.id('todo-form')).submit();
		element(by.model('todo.completed')).click();
		expect(element(by.id('todo-count')).getText()).toEqual('2 items left');
	});

	/*Items is made 0 when user clicks allChecked Input Button */
	it('should clear count when user clicks allChecked input.', function() {
		element(by.id('toggle-all')).click();
		expect(element(by.id('todo-count')).getText()).toEqual('0 items left');
	});

	/* Clears out all inouts when user clicks on clear complete. */
	it('should clear all inputs when user clicks on clear complete.', function() {
		element(by.id('clear-completed')).click();
		expect(element.all(by.css('#filters a')).get(0).isDisplayed()).toBeFalsy();
	});
});
