/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('uploader', function (Y, NAME) {

/**
 * Provides UI for selecting multiple files and functionality for 
 * uploading multiple files to the server with support for either
 * html5 or Flash transport mechanisms, automatic queue management,
 * upload progress monitoring, and error events.
 * @module uploader
 * @main uploader
 * @since 3.5.0
 */

/**
 * `Y.Uploader` serves as an alias for either <a href="UploaderFlash.html">`Y.UploaderFlash`</a>
 * or <a href="UploaderHTML5.html">`Y.UploaderHTML5`</a>, depending on the feature set available
 * in a specific browser. If neither HTML5 nor Flash transport layers are available, `Y.Uploader.TYPE` 
 * static property is set to `"none"`.
 *
 * @class Uploader
 */

 /**
 * The static property reflecting the type of uploader that `Y.Uploader`
 * aliases. The possible values are:
 * <ul>
 * <li><strong>`"html5"`</strong>: Y.Uploader is an alias for <a href="UploaderHTML5.html">Y.UploaderHTML5</a></li>
 * <li><strong>`"flash"`</strong>: Y.Uploader is an alias for <a href="UploaderFlash.html">Y.UploaderFlash</a></li>
 * <li><strong>`"none"`</strong>: Neither Flash not HTML5 are available, and Y.Uploader does
 * not reference an actual implementation.</li>
 * </ul>
 *
 * @property TYPE
 * @type {String}
 * @static
 */

 var Win = Y.config.win;

 if (Win && Win.File && Win.FormData && Win.XMLHttpRequest) {
    Y.Uploader = Y.UploaderHTML5;
 }

 else if (Y.SWFDetect.isFlashVersionAtLeast(10,0,45)) {
    Y.Uploader = Y.UploaderFlash;
 }

 else {
    Y.namespace("Uploader");
    Y.Uploader.TYPE = "none";
 }

}, '3.7.3', {"requires": ["uploader-html5", "uploader-flash"]});
