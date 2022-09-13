package pages;


import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import utils.CommonMethods;

import java.util.List;

public class HomePage extends CommonMethods {

	@FindBy(xpath = "//input[@class= 'new-todo ng-pristine ng-valid ng-touched']")
	private WebElement toDoTextField;

	@FindBy(xpath = "//button[@class = 'destroy']")
	public WebElement deleteButton;



	public WebElement getToDoTextField(){return toDoTextField;}

	public HomePage() {
		PageFactory.initElements(driver, this);
	}
}
