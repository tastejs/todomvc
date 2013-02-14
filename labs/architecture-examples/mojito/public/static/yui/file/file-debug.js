/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('file', function (Y, NAME) {

    /**
     * The File class provides a wrapper for a file pointer, either through an HTML5 
     * implementation or as a reference to a file pointer stored in Flash. The File wrapper 
     * also implements the mechanics for uploading a file and tracking its progress.
     * @module file
     * @main file
     * @since 3.5.0
     */     

    /**
     * `Y.File` serves as an alias for either <a href="FileFlash.html">`Y.FileFlash`</a>
     * or <a href="FileHTML5.html">`Y.FileHTML5`</a>, depending on the feature set available
     * in a specific browser.
     *
     * @class File
     */

 var Win = Y.config.win;

 if (Win && Win.File && Win.FormData && Win.XMLHttpRequest) {
    Y.File = Y.FileHTML5;
 }

 else {
    Y.File = Y.FileFlash;
 }

}, '3.7.3', {"requires": ["file-flash", "file-html5"]});
