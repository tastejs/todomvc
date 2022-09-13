
To Do Testing Framework Created by Maha Nikolic

1. Using instructions in readme.md fork was created using Angular.js version of To Do on 
2. https://github.com/MagiQAL/todomvc.git
3. Pull requests must pass all checks before they can be merged. 
4. CICD pipeline created using node.js 
5. Testing framework organized herein using Cucumber, Selenium, Junit
6. see pom.xml file for testing tool dependencies added to build
7. In order to view testing framework drop down directory src > directory test>.  
8. Test cases begin in the Features file. Using Gherkin language indicate steps to execute case. 
9. Create new test case by using "Scenario" keyword to indicate feature test information

"Given" keyword to indicate assumption of starting point, 
"When" and "And" to show the actions or steps to perform.
 "Then" indicates expected result to pass the test. 
11. Right-click on the new test case to "show context actions" > create "all steps definitions" under class "Test1Steps".
12. WebElements used in Test1Steps are found under HomePage. Add new WebElements to HomePage and initialize each. 
13. Add reusable methods to CommonMethods to call directly from Test1Steps
14. 

