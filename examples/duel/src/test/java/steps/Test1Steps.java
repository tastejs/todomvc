package steps;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.junit.Assert;
import org.openqa.selenium.Keys;
import utils.CommonMethods;
import pages.HomePage;



public class Test1Steps extends CommonMethods{



	@When("user deletes item from any position on the list")
	public void user_deletes_item_from_any_position_on_the_list() {


	}
	@Then("item will be deleted")
	public void item_will_be_deleted() {
		// Write code here that turns the phrase above into concrete actions
		throw new io.cucumber.java.PendingException();
	}


	@Given("user navigates to {string}")
	public void userNavigatesTo(String url) {
		Assert.assertEquals (url, driver.getCurrentUrl());

	}


	@When("user adds items {string} to a list")
	public void user_adds_items_to_a_list(String items) {
		HomePage homePage = new HomePage();
		String [] ArrayOfItems =items.split(",");
		for( String item: ArrayOfItems){
			homePage.getToDoTextField().sendKeys(item);
			homePage.getToDoTextField().sendKeys(Keys.RETURN);}
	}
}
