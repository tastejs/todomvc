var testSuite = require('./test.js'),
    fs = require('fs'),
    argv = require('optimist').argv,
    rootUrl = "http://localhost:8000/",
    frameworkNamePattern = /^[a-z-_]+$/;

// collect together the framework names from each of the subfolders
var list = fs.readdirSync("../architecture-examples/")
        .map(function(folderName) { return { name : folderName, path : "architecture-examples/" + folderName} });

/*list = list.concat(fs.readdirSync("../labs/architecture-examples/")
        .map(function(folderName) { return { name : folderName, path: "labs/architecture-examples/" + folderName} }));

list = list.concat(fs.readdirSync("../labs/dependency-examples/")
        .map(function(folderName) { return { name : folderName, path: "labs/dependency-examples/" + folderName} }));

list = list.concat(fs.readdirSync("../dependency-examples/")
        .map(function(folderName) { return { name : folderName, path: "dependency-examples/" + folderName} }));*/


// filter out any folders that are not frameworks (.e.g  hidden files)
list = list.filter(function(framework) { return frameworkNamePattern.test(framework.name); });

// if a specific framework has been named, just run this one
if (argv.framework) {
    list = list.filter(function(framework) { return framework.name === argv.framework});
}

// run the tests for each framework
var testIndex = 1;
list.forEach(function(framework) {
    testSuite.todoMVCTest(framework.name + " (" + testIndex++ + "/" + list.length + ")",
        rootUrl + framework.path + "/index.html", argv.speedMode);
});
