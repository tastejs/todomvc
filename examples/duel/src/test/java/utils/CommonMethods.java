package utils;

import org.apache.commons.io.FileUtils;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.time.Duration;
import java.util.Date;

import static steps.PageInitializers.initializePageObjects;

public class CommonMethods {
	public static WebDriver driver;

	public void launchBrowser() {
		driver = BrowserFactory.get();
		initializePageObjects();
	}
	public static WebDriverWait getWait() {
		WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(Constants.EXPLICIT_WAIT));
		return wait;
	}

	public static void waitForClickability(WebElement element){
		getWait().until(ExpectedConditions.elementToBeClickable(element));
	}
	public static void click(WebElement element){
		waitForClickability(element);
		element.click();
	}
	public static String getTimeStamp(String pattern) {
		Date date = new Date();
		SimpleDateFormat sdf = new SimpleDateFormat(pattern);
		return sdf.format(date);
	}

	public static String getText(WebElement element){return element.getText();}
	public static byte[] takeScreenShot(String fileName) {
		File sourceFile = ((TakesScreenshot) driver).getScreenshotAs(OutputType.FILE);
		byte[] picBytes = ((TakesScreenshot) driver).getScreenshotAs(OutputType.BYTES);
		File destFile = new File(Constants.SCREENSHOT_FILEPATH + fileName + getTimeStamp("yyyy-MM-dd-HH-mm-ss") + ".png");
		try {
			FileUtils.copyFile(sourceFile, destFile);
		} catch (IOException e) {
			e.printStackTrace();
		}
		return picBytes;
	}
}
