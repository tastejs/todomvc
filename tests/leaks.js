'use strict';

var leaky = require('leaky');
var Page = require('./page');

var driver = leaky.start({
	chromeOptions: 'no-sandbox'
});

var page = new Page(driver);
var initialSize = [];

driver.get('http://localhost:8000/examples/react');

page.ensureAppIsVisible();
page.enterItem('wow');
page.clickMarkAllCompletedCheckBox();
page.clickClearCompleteButton();

leaky.getCounts(driver)
.then(initialSize.push.bind(initialSize));

for (var i = 0; i < 10; ++i) {
	page.enterItem('1');
	page.enterItem('2');
	page.enterItem('3');
	page.clickMarkAllCompletedCheckBox();
	page.clickClearCompleteButton();
}

leaky.getCounts(driver)
.then(function (newSize) {
	console.log('initial snapshot: ' + JSON.stringify(initialSize[0]),
							'\nend snapshot:     ' + JSON.stringify(newSize));
});

driver.quit();

