package steps;

import pages.HomePage;

public class PageInitializers {
	public static HomePage homePage;
	public static void initializePageObjects(){
		homePage=new HomePage();
	}
}

