'use strict';

var drool = require('drool');
var exceptions = require('./memory-exceptions.json');
var frameworkPathLookup = require('./framework-path-lookup');
var argv = require('optimist').default('laxMode', false).default('browser', 'chrome').argv;
var driverConfig = {
	chromeOptions: 'no-sandbox'
};

if (typeof process.env.CHROME_PATH !== 'undefined') {
	driverConfig.chromeBinaryPath = process.env.CHROME_PATH;
}

var driver = drool.start(driverConfig);
var list = frameworkPathLookup(argv.framework);

function idApp() {
	return driver.findElement(drool.webdriver.By.css('#todoapp'))
	.then(function () { return true; })
	.thenCatch(function () { return false; });
}

function newTodoSelector() {
	return idApp().then(function (isId) {
		if (isId) {
			return '#new-todo';
		}

		return '.new-todo';
	});
}

function listSelector() {
	return idApp().then(function (isId) {
		if (isId) {
			return '#todo-list li';
		}

		return '.todo-list li';
	});
}

list.forEach(function (framework) {
	drool.flow({
		repeatCount: 5,
		setup: function () {
			driver.get('http://localhost:8000/' + framework.path + '/index.html');
		},
		action: function (name) {
			driver.wait(function () {
				driver.sleep(500);
				return driver.findElement(drool.webdriver.By.css(newTodoSelector(name)))
					.sendKeys('find magical goats', drool.webdriver.Key.ENTER)
					.thenCatch(function () {
						return false;
					})
				.then(function () {
					return driver.findElement(drool.webdriver.By.css(listSelector(name))).isDisplayed()
						.then(function () {
							return true;
						});
				});
			}, 10000);

			driver.wait(function () {
				return driver.findElement(drool.webdriver.By.css(listSelector(name))).click()
					.thenCatch(function () {
						return false;
					})
				.then(function () {
					return true;
				});
			});

			driver.findElement(drool.webdriver.By.css('.destroy')).click();
		}.bind(null, framework.name),
		assert: function (after, initial) {
			var nodeIncrease = (after.nodes - initial.nodes);
			var listenerIncrease = (after.jsEventListeners - initial.jsEventListeners);
			var memoryExceptions = exceptions[framework.name] || {};

			console.log(this + ', ' +  nodeIncrease + ', ' +
				(after.jsHeapSizeUsed - initial.jsHeapSizeUsed) + ', ' + listenerIncrease);

			//https://code.google.com/p/chromium/issues/detail?id=516153
			if (nodeIncrease > memoryExceptions.nodes || 0) {
				throw new Error('Node Count leak detected!');
			}

			if (listenerIncrease > memoryExceptions.listeners || 0) {
				throw new Error('Event Listener leak detected!');
			}

		}.bind(framework.name)
	}, driver);
});

driver.quit();

