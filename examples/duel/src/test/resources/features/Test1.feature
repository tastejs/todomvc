@test
Feature: Testing ToDo Lists delete items from list

  @smoke
  Scenario: Verifying delete item from any position on the todo list
    Given user navigates to https://todomvc.com/examples/angularjs/#/
    When user adds items to a list
	And user deletes item from any position on the list
	Then item will be deleted
