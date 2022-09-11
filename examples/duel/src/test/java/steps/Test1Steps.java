package steps;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.junit.Assert;
import utils.CommonMethods;

import static utils.CommonMethods.driver;

public class Test1Steps {

	@Given("user navigates to https:\\/\\/todomvc.com\\/examples\\/angularjs\\/#\\/")
	public void user_navigates_to_https_todomvc_com_examples_angularjs(String url) {
		Assert.assertEquals (url, driver.getCurrentUrl());
	}

	@When("user adds items to a list")
	public void user_adds_items_to_a_list() {

		throw new io.cucumber.java.PendingException();
	}
	@When("user deletes item from any position on the list")
	public void user_deletes_item_from_any_position_on_the_list() {
		// Write code here that turns the phrase above into concrete actions
		throw new io.cucumber.java.PendingException();
	}
	@Then("item will be deleted")
	public void item_will_be_deleted() {
		// Write code here that turns the phrase above into concrete actions
		throw new io.cucumber.java.PendingException();
	}
}
