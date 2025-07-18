var express = require('express');
var fs = require('fs');
var learnJson = require('./learn.json');

var app = module.exports = express();
var favicon = require('serve-favicon');

// Serve all static files from the current directory
app.use(express.static(__dirname));

// Serve favicon from a specific path
app.use(favicon(__dirname + '/site-assets/favicon.ico'));

// Define a setter for 'learnJson' property on module.exports
Object.defineProperty(module.exports, 'learnJson', {
  set: function (backend) {
    // Update the 'backend' property in the JSON object
    learnJson.backend = backend;

    // Write the updated JSON back to the file asynchronously
    fs.writeFile(require.resolve('./learn.json'), JSON.stringify(learnJson, null, 2), function (err) {
      if (err) {
        throw err; // throw error if write fails
      }
    });
  }
});
