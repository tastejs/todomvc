var testSuite = require('./test.js'),
    fs = require('fs'),
    argv = require('optimist').default('laxMode', false).argv,
    rootUrl = "http://localhost:8000/",
    frameworkNamePattern = /^[a-z-_]+$/;

// collect together the framework names from each of the subfolders
var list = fs.readdirSync("../architecture-examples/")
        .map(function(folderName) { return { name : folderName, path : "architecture-examples/" + folderName} });

list = list.concat(fs.readdirSync("../labs/architecture-examples/")
        .map(function(folderName) { return { name : folderName, path: "labs/architecture-examples/" + folderName} }));

list = list.concat(fs.readdirSync("../labs/dependency-examples/")
        .map(function(folderName) { return { name : folderName, path: "labs/dependency-examples/" + folderName} }));

list = list.concat(fs.readdirSync("../dependency-examples/")
        .map(function(folderName) { return { name : folderName, path: "dependency-examples/" + folderName} }));

// apps that are not hosted at the root of their folder need to be handled explicitly
var exceptions = [
    { name : "chaplin-brunch", path : "labs/dependency-examples/chaplin-brunch/public" }
];
list = list.map(function(framework) {
    var exception = exceptions.filter(function(exFramework) { return exFramework.name === framework.name});
    return exception.length > 0 ? exception[0] : framework;
});

// filter out any folders that are not frameworks (.e.g  hidden files)
list = list.filter(function(framework) { return frameworkNamePattern.test(framework.name); });

// if a specific framework has been named, just run this one
if (argv.framework) {       
    list = list.filter(function(framework) { return framework.name === argv.framework});
}

// run the tests for each framework
var testIndex = 1;
list.forEach(function(framework) {
    testSuite.todoMVCTest(framework.name,
        rootUrl + framework.path + "/index.html", argv.speedMode, argv.laxMode);
});
