//js view/compress.js

var compressPage = 'view/view.html';
var outputFolder = 'view';
load("steal/compress/compress.js")
var compress = new Steal.Compress([compressPage, outputFolder]);
compress.init();