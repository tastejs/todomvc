package utils;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import static steps.PageInitializers.initializePageObjects;

public class CommonMethods {
	public static WebDriver driver;

	public void launchBrowser() {
		driver = BrowserFactory.get();
		initializePageObjects();
	}
	public static String getText(WebElement element){return element.getText();}
}
