/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["build/file-html5/file-html5.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/file-html5/file-html5.js",
    code: []
};
_yuitest_coverage["build/file-html5/file-html5.js"].code=["YUI.add('file-html5', function (Y, NAME) {","","    /**","     * The FileHTML5 class provides a wrapper for a file pointer in an HTML5 The File wrapper ","     * also implements the mechanics for uploading a file and tracking its progress.","     * @module file-html5","     */     ","     ","    /**","     * The class provides a wrapper for a file pointer.","     * @class FileHTML5","     * @extends Base","     * @constructor","     * @param {Object} config Configuration object.","     */","    var Lang = Y.Lang,","        Bind = Y.bind,","        Win = Y.config.win;","","    var FileHTML5 = function(o) {","        ","        var file = null;","","        if (FileHTML5.isValidFile(o)) {","            file = o;","        }","        else if (FileHTML5.isValidFile(o.file)) {","            file = o.file;","        }","        else {","            file = false;","        }","","        FileHTML5.superclass.constructor.apply(this, arguments);      ","        ","        if (file && FileHTML5.canUpload()) {","           if (!this.get(\"file\")) {","               this._set(\"file\", file);","           }","","           if (!this.get(\"name\")) {","           this._set(\"name\", file.name || file.fileName);","           }","","           if (this.get(\"size\") != (file.size || file.fileSize)) {","           this._set(\"size\", file.size || file.fileSize);","           }","","           if (!this.get(\"type\")) {","           this._set(\"type\", file.type);","           }","","           if (file.hasOwnProperty(\"lastModifiedDate\") && !this.get(\"dateModified\")) {","               this._set(\"dateModified\", file.lastModifiedDate);","           }","        }","    };","","","    Y.extend(FileHTML5, Y.Base, {","","       /**","        * Construction logic executed during FileHTML5 instantiation.","        *","        * @method initializer","        * @protected","        */","        initializer : function (cfg) {","            if (!this.get(\"id\")) {","                this._set(\"id\", Y.guid(\"file\"));","            }","        },","","       /**","        * Handler of events dispatched by the XMLHTTPRequest.","        *","        * @method _uploadEventHandler","        * @param {Event} event The event object received from the XMLHTTPRequest.","        * @protected","        */      ","        _uploadEventHandler: function (event) {","            var xhr = this.get(\"xhr\");","","            switch (event.type) {","                case \"progress\":","                  /**","                   * Signals that progress has been made on the upload of this file. ","                   *","                   * @event uploadprogress","                   * @param event {Event} The event object for the `uploadprogress` with the","                   *                      following payload:","                   *  <dl>","                   *      <dt>originEvent</dt>","                   *          <dd>The original event fired by the XMLHttpRequest instance.</dd>","                   *      <dt>bytesLoaded</dt>","                   *          <dd>The number of bytes of the file that has been uploaded.</dd>","                   *      <dt>bytesTotal</dt>","                   *          <dd>The total number of bytes in the file (the file size)</dd>","                   *      <dt>percentLoaded</dt>","                   *          <dd>The fraction of the file that has been uploaded, out of 100.</dd>","                   *  </dl>","                   */","                   this.fire(\"uploadprogress\", {originEvent: event,","                                               bytesLoaded: event.loaded, ","                                               bytesTotal: this.get(\"size\"), ","                                               percentLoaded: Math.min(100, Math.round(10000*event.loaded/this.get(\"size\"))/100)","                                               });","                   this._set(\"bytesUploaded\", event.loaded);","                   break;","","                case \"load\":","                  /**","                   * Signals that this file's upload has completed and data has been received from the server.","                   *","                   * @event uploadcomplete","                   * @param event {Event} The event object for the `uploadcomplete` with the","                   *                      following payload:","                   *  <dl>","                   *      <dt>originEvent</dt>","                   *          <dd>The original event fired by the XMLHttpRequest instance.</dd>","                   *      <dt>data</dt>","                   *          <dd>The data returned by the server.</dd>","                   *  </dl>","                   */","","                   if (xhr.status >= 200 && xhr.status <= 299) {","                        this.fire(\"uploadcomplete\", {originEvent: event,","                                                     data: event.target.responseText});","                        var xhrupload = xhr.upload,","                            boundEventHandler = this.get(\"boundEventHandler\");","    ","                        xhrupload.removeEventListener (\"progress\", boundEventHandler);","                        xhrupload.removeEventListener (\"error\", boundEventHandler);","                        xhrupload.removeEventListener (\"abort\", boundEventHandler);","                        xhr.removeEventListener (\"load\", boundEventHandler); ","                        xhr.removeEventListener (\"error\", boundEventHandler);","                        xhr.removeEventListener (\"readystatechange\", boundEventHandler);","                        ","                        this._set(\"xhr\", null);","                   }","                   else {","                        this.fire(\"uploaderror\", {originEvent: event,","                                                  status: xhr.status,","                                                  statusText: xhr.statusText,","                                                  source: \"http\"});","                   }                   ","                   break;","","                case \"error\":","                  /**","                   * Signals that this file's upload has encountered an error. ","                   *","                   * @event uploaderror","                   * @param event {Event} The event object for the `uploaderror` with the","                   *                      following payload:","                   *  <dl>","                   *      <dt>originEvent</dt>","                   *          <dd>The original event fired by the XMLHttpRequest instance.</dd>","                   *      <dt>status</dt>","                   *          <dd>The status code reported by the XMLHttpRequest. If it's an HTTP error,","                                  then this corresponds to the HTTP status code received by the uploader.</dd>","                   *      <dt>statusText</dt>","                   *          <dd>The text of the error event reported by the XMLHttpRequest instance</dd>","                   *      <dt>source</dt>","                   *          <dd>Either \"http\" (if it's an HTTP error), or \"io\" (if it's a network transmission ","                   *              error.)</dd>","                   *","                   *  </dl>","                   */","                   this.fire(\"uploaderror\", {originEvent: event,","                                                  status: xhr.status,","                                                  statusText: xhr.statusText,","                                                  source: \"io\"});","                   break;","","                case \"abort\":","","                  /**","                   * Signals that this file's upload has been cancelled. ","                   *","                   * @event uploadcancel","                   * @param event {Event} The event object for the `uploadcancel` with the","                   *                      following payload:","                   *  <dl>","                   *      <dt>originEvent</dt>","                   *          <dd>The original event fired by the XMLHttpRequest instance.</dd>","                   *  </dl>","                   */","                   this.fire(\"uploadcancel\", {originEvent: event});","                   break;","","                case \"readystatechange\":","","                  /**","                   * Signals that XMLHttpRequest has fired a readystatechange event. ","                   *","                   * @event readystatechange","                   * @param event {Event} The event object for the `readystatechange` with the","                   *                      following payload:","                   *  <dl>","                   *      <dt>readyState</dt>","                   *          <dd>The readyState code reported by the XMLHttpRequest instance.</dd>","                   *      <dt>originEvent</dt>","                   *          <dd>The original event fired by the XMLHttpRequest instance.</dd>","                   *  </dl>","                   */","                   this.fire(\"readystatechange\", {readyState: event.target.readyState,","                                                  originEvent: event});","                   break;","            }","        },","","       /**","        * Starts the upload of a specific file.","        *","        * @method startUpload","        * @param url {String} The URL to upload the file to.","        * @param parameters {Object} (optional) A set of key-value pairs to send as variables along with the file upload HTTP request.","        * @param fileFieldName {String} (optional) The name of the POST variable that should contain the uploaded file ('Filedata' by default)","        */","        startUpload: function(url, parameters, fileFieldName) {","         ","            this._set(\"bytesUploaded\", 0);","            ","            this._set(\"xhr\", new XMLHttpRequest());","            this._set(\"boundEventHandler\", Bind(this._uploadEventHandler, this));","                         ","            var uploadData = new FormData(),","                fileField = fileFieldName || \"Filedata\",","                xhr = this.get(\"xhr\"),","                xhrupload = this.get(\"xhr\").upload,","                boundEventHandler = this.get(\"boundEventHandler\");","","            Y.each(parameters, function (value, key) {uploadData.append(key, value);});","            uploadData.append(fileField, this.get(\"file\"));","","","","","            xhr.addEventListener (\"loadstart\", boundEventHandler, false);","            xhrupload.addEventListener (\"progress\", boundEventHandler, false);","            xhr.addEventListener (\"load\", boundEventHandler, false);","            xhr.addEventListener (\"error\", boundEventHandler, false);","            xhrupload.addEventListener (\"error\", boundEventHandler, false);","            xhrupload.addEventListener (\"abort\", boundEventHandler, false);","            xhr.addEventListener (\"abort\", boundEventHandler, false);","            xhr.addEventListener (\"loadend\", boundEventHandler, false); ","            xhr.addEventListener (\"readystatechange\", boundEventHandler, false);","","            xhr.open(\"POST\", url, true);","","            xhr.withCredentials = this.get(\"xhrWithCredentials\");","","            Y.each(this.get(\"xhrHeaders\"), function (value, key) {","                 xhr.setRequestHeader(key, value);","            });","","            xhr.send(uploadData);","      ","            /**","             * Signals that this file's upload has started. ","             *","             * @event uploadstart","             * @param event {Event} The event object for the `uploadstart` with the","             *                      following payload:","             *  <dl>","             *      <dt>xhr</dt>","             *          <dd>The XMLHttpRequest instance handling the file upload.</dd>","             *  </dl>","             */","             this.fire(\"uploadstart\", {xhr: xhr});","","        },","","       /**","        * Cancels the upload of a specific file, if currently in progress.","        *","        * @method cancelUpload","        */    ","        cancelUpload: function () {","            this.get('xhr').abort();","        }","","","    }, {","","       /**","        * The identity of the class.","        *","        * @property NAME","        * @type String","        * @default 'file'","        * @readOnly","        * @protected","        * @static","        */","        NAME: 'file',","","       /**","        * The type of transport.","        *","        * @property TYPE","        * @type String","        * @default 'html5'","        * @readOnly","        * @protected","        * @static","        */","        TYPE: 'html5',","","       /**","        * Static property used to define the default attribute configuration of","        * the File.","        *","        * @property ATTRS","        * @type {Object}","        * @protected","        * @static","        */","        ATTRS: {","","       /**","        * A String containing the unique id of the file wrapped by the FileFlash instance.","        * The id is supplied by the Flash player uploader.","        *","        * @attribute id","        * @type {String}","        * @initOnly","        */","        id: {","            writeOnce: \"initOnly\",","            value: null","        },","","       /**","        * The size of the file wrapped by FileHTML5. This value is supplied by the instance of File().","        *","        * @attribute size","        * @type {Number}","        * @initOnly","        */","        size: {","            writeOnce: \"initOnly\",","            value: 0","        },","","       /**","        * The name of the file wrapped by FileHTML5. This value is supplied by the instance of File().","        *","        * @attribute name","        * @type {String}","        * @initOnly","        */","        name: {","            writeOnce: \"initOnly\",","            value: null","        },","","       /**","        * The date that the file wrapped by FileHTML5 was created on. This value is supplied by the instance of File().","        *","        * @attribute dateCreated","        * @type {Date}","        * @initOnly","        * @default null","        */","        dateCreated: {","            writeOnce: \"initOnly\",","            value: null","        },","","       /**","        * The date that the file wrapped by FileHTML5 was last modified on. This value is supplied by the instance of File().","        *","        * @attribute dateModified","        * @type {Date}","        * @initOnly","        */","        dateModified: {","            writeOnce: \"initOnly\",","            value: null","        },","","       /**","        * The number of bytes of the file that has been uploaded to the server. This value is","        * non-zero only while a file is being uploaded.","        *","        * @attribute bytesUploaded","        * @type {Date}","        * @readOnly","        */","        bytesUploaded: {","            readOnly: true,","            value: 0","        },","","       /**","        * The type of the file wrapped by FileHTML. This value is provided by the instance of File()","        *","        * @attribute type","        * @type {String}","        * @initOnly","        */","        type: {","            writeOnce: \"initOnly\",","            value: null","        },","","       /**","        * The pointer to the instance of File() wrapped by FileHTML5.","        *","        * @attribute file","        * @type {File}","        * @initOnly","        */","        file: {","            writeOnce: \"initOnly\",","            value: null","        },","","       /**","        * The pointer to the instance of XMLHttpRequest used by FileHTML5 to upload the file.","        *","        * @attribute xhr","        * @type {XMLHttpRequest}","        * @initOnly","        */","        xhr: {","            readOnly: true,","            value: null","        },","","       /**","        * The dictionary of headers that should be set on the XMLHttpRequest object before","        * sending it.","        *","        * @attribute xhrHeaders","        * @type {Object}","        * @initOnly","        */","        xhrHeaders: {","            value: {}","        },","","       /**","        * A Boolean indicating whether the XMLHttpRequest should be sent with user credentials.","        * This does not affect same-site requests. ","        *","        * @attribute xhrWithCredentials","        * @type {Boolean}","        * @initOnly","        */","        xhrWithCredentials: {","            value: true","        },","","       /**","        * The bound event handler used to handle events from XMLHttpRequest.","        *","        * @attribute boundEventHandler","        * @type {Function}","        * @initOnly","        */","        boundEventHandler: {","            readOnly: true,","            value: null","        }","        },","","       /**","        * Checks whether a specific native file instance is valid","        *","        * @method isValidFile","        * @param file {File} A native File() instance.","        * @static","        */","        isValidFile: function (file) {","            return (Win && Win.File && file instanceof File);","        },","","       /**","        * Checks whether the browser has a native upload capability","        * via XMLHttpRequest Level 2.","        *","        * @method canUpload","        * @static","        */","        canUpload: function () {","            return (Win && Win.FormData && Win.XMLHttpRequest);","        }","    });","","    Y.FileHTML5 = FileHTML5;","","}, '3.7.3', {\"requires\": [\"base\"]});"];
_yuitest_coverage["build/file-html5/file-html5.js"].lines = {"1":0,"16":0,"20":0,"22":0,"24":0,"25":0,"27":0,"28":0,"31":0,"34":0,"36":0,"37":0,"38":0,"41":0,"42":0,"45":0,"46":0,"49":0,"50":0,"53":0,"54":0,"60":0,"69":0,"70":0,"82":0,"84":0,"103":0,"108":0,"109":0,"126":0,"127":0,"129":0,"132":0,"133":0,"134":0,"135":0,"136":0,"137":0,"139":0,"142":0,"147":0,"170":0,"174":0,"189":0,"190":0,"207":0,"209":0,"223":0,"225":0,"226":0,"228":0,"234":0,"235":0,"240":0,"241":0,"242":0,"243":0,"244":0,"245":0,"246":0,"247":0,"248":0,"250":0,"252":0,"254":0,"255":0,"258":0,"271":0,"281":0,"478":0,"489":0,"493":0};
_yuitest_coverage["build/file-html5/file-html5.js"].functions = {"FileHTML5:20":0,"initializer:68":0,"_uploadEventHandler:81":0,"(anonymous 2):234":0,"(anonymous 3):254":0,"startUpload:221":0,"cancelUpload:280":0,"isValidFile:477":0,"canUpload:488":0,"(anonymous 1):1":0};
_yuitest_coverage["build/file-html5/file-html5.js"].coveredLines = 72;
_yuitest_coverage["build/file-html5/file-html5.js"].coveredFunctions = 10;
_yuitest_coverline("build/file-html5/file-html5.js", 1);
YUI.add('file-html5', function (Y, NAME) {

    /**
     * The FileHTML5 class provides a wrapper for a file pointer in an HTML5 The File wrapper 
     * also implements the mechanics for uploading a file and tracking its progress.
     * @module file-html5
     */     
     
    /**
     * The class provides a wrapper for a file pointer.
     * @class FileHTML5
     * @extends Base
     * @constructor
     * @param {Object} config Configuration object.
     */
    _yuitest_coverfunc("build/file-html5/file-html5.js", "(anonymous 1)", 1);
_yuitest_coverline("build/file-html5/file-html5.js", 16);
var Lang = Y.Lang,
        Bind = Y.bind,
        Win = Y.config.win;

    _yuitest_coverline("build/file-html5/file-html5.js", 20);
var FileHTML5 = function(o) {
        
        _yuitest_coverfunc("build/file-html5/file-html5.js", "FileHTML5", 20);
_yuitest_coverline("build/file-html5/file-html5.js", 22);
var file = null;

        _yuitest_coverline("build/file-html5/file-html5.js", 24);
if (FileHTML5.isValidFile(o)) {
            _yuitest_coverline("build/file-html5/file-html5.js", 25);
file = o;
        }
        else {_yuitest_coverline("build/file-html5/file-html5.js", 27);
if (FileHTML5.isValidFile(o.file)) {
            _yuitest_coverline("build/file-html5/file-html5.js", 28);
file = o.file;
        }
        else {
            _yuitest_coverline("build/file-html5/file-html5.js", 31);
file = false;
        }}

        _yuitest_coverline("build/file-html5/file-html5.js", 34);
FileHTML5.superclass.constructor.apply(this, arguments);      
        
        _yuitest_coverline("build/file-html5/file-html5.js", 36);
if (file && FileHTML5.canUpload()) {
           _yuitest_coverline("build/file-html5/file-html5.js", 37);
if (!this.get("file")) {
               _yuitest_coverline("build/file-html5/file-html5.js", 38);
this._set("file", file);
           }

           _yuitest_coverline("build/file-html5/file-html5.js", 41);
if (!this.get("name")) {
           _yuitest_coverline("build/file-html5/file-html5.js", 42);
this._set("name", file.name || file.fileName);
           }

           _yuitest_coverline("build/file-html5/file-html5.js", 45);
if (this.get("size") != (file.size || file.fileSize)) {
           _yuitest_coverline("build/file-html5/file-html5.js", 46);
this._set("size", file.size || file.fileSize);
           }

           _yuitest_coverline("build/file-html5/file-html5.js", 49);
if (!this.get("type")) {
           _yuitest_coverline("build/file-html5/file-html5.js", 50);
this._set("type", file.type);
           }

           _yuitest_coverline("build/file-html5/file-html5.js", 53);
if (file.hasOwnProperty("lastModifiedDate") && !this.get("dateModified")) {
               _yuitest_coverline("build/file-html5/file-html5.js", 54);
this._set("dateModified", file.lastModifiedDate);
           }
        }
    };


    _yuitest_coverline("build/file-html5/file-html5.js", 60);
Y.extend(FileHTML5, Y.Base, {

       /**
        * Construction logic executed during FileHTML5 instantiation.
        *
        * @method initializer
        * @protected
        */
        initializer : function (cfg) {
            _yuitest_coverfunc("build/file-html5/file-html5.js", "initializer", 68);
_yuitest_coverline("build/file-html5/file-html5.js", 69);
if (!this.get("id")) {
                _yuitest_coverline("build/file-html5/file-html5.js", 70);
this._set("id", Y.guid("file"));
            }
        },

       /**
        * Handler of events dispatched by the XMLHTTPRequest.
        *
        * @method _uploadEventHandler
        * @param {Event} event The event object received from the XMLHTTPRequest.
        * @protected
        */      
        _uploadEventHandler: function (event) {
            _yuitest_coverfunc("build/file-html5/file-html5.js", "_uploadEventHandler", 81);
_yuitest_coverline("build/file-html5/file-html5.js", 82);
var xhr = this.get("xhr");

            _yuitest_coverline("build/file-html5/file-html5.js", 84);
switch (event.type) {
                case "progress":
                  /**
                   * Signals that progress has been made on the upload of this file. 
                   *
                   * @event uploadprogress
                   * @param event {Event} The event object for the `uploadprogress` with the
                   *                      following payload:
                   *  <dl>
                   *      <dt>originEvent</dt>
                   *          <dd>The original event fired by the XMLHttpRequest instance.</dd>
                   *      <dt>bytesLoaded</dt>
                   *          <dd>The number of bytes of the file that has been uploaded.</dd>
                   *      <dt>bytesTotal</dt>
                   *          <dd>The total number of bytes in the file (the file size)</dd>
                   *      <dt>percentLoaded</dt>
                   *          <dd>The fraction of the file that has been uploaded, out of 100.</dd>
                   *  </dl>
                   */
                   _yuitest_coverline("build/file-html5/file-html5.js", 103);
this.fire("uploadprogress", {originEvent: event,
                                               bytesLoaded: event.loaded, 
                                               bytesTotal: this.get("size"), 
                                               percentLoaded: Math.min(100, Math.round(10000*event.loaded/this.get("size"))/100)
                                               });
                   _yuitest_coverline("build/file-html5/file-html5.js", 108);
this._set("bytesUploaded", event.loaded);
                   _yuitest_coverline("build/file-html5/file-html5.js", 109);
break;

                case "load":
                  /**
                   * Signals that this file's upload has completed and data has been received from the server.
                   *
                   * @event uploadcomplete
                   * @param event {Event} The event object for the `uploadcomplete` with the
                   *                      following payload:
                   *  <dl>
                   *      <dt>originEvent</dt>
                   *          <dd>The original event fired by the XMLHttpRequest instance.</dd>
                   *      <dt>data</dt>
                   *          <dd>The data returned by the server.</dd>
                   *  </dl>
                   */

                   _yuitest_coverline("build/file-html5/file-html5.js", 126);
if (xhr.status >= 200 && xhr.status <= 299) {
                        _yuitest_coverline("build/file-html5/file-html5.js", 127);
this.fire("uploadcomplete", {originEvent: event,
                                                     data: event.target.responseText});
                        _yuitest_coverline("build/file-html5/file-html5.js", 129);
var xhrupload = xhr.upload,
                            boundEventHandler = this.get("boundEventHandler");
    
                        _yuitest_coverline("build/file-html5/file-html5.js", 132);
xhrupload.removeEventListener ("progress", boundEventHandler);
                        _yuitest_coverline("build/file-html5/file-html5.js", 133);
xhrupload.removeEventListener ("error", boundEventHandler);
                        _yuitest_coverline("build/file-html5/file-html5.js", 134);
xhrupload.removeEventListener ("abort", boundEventHandler);
                        _yuitest_coverline("build/file-html5/file-html5.js", 135);
xhr.removeEventListener ("load", boundEventHandler); 
                        _yuitest_coverline("build/file-html5/file-html5.js", 136);
xhr.removeEventListener ("error", boundEventHandler);
                        _yuitest_coverline("build/file-html5/file-html5.js", 137);
xhr.removeEventListener ("readystatechange", boundEventHandler);
                        
                        _yuitest_coverline("build/file-html5/file-html5.js", 139);
this._set("xhr", null);
                   }
                   else {
                        _yuitest_coverline("build/file-html5/file-html5.js", 142);
this.fire("uploaderror", {originEvent: event,
                                                  status: xhr.status,
                                                  statusText: xhr.statusText,
                                                  source: "http"});
                   }                   
                   _yuitest_coverline("build/file-html5/file-html5.js", 147);
break;

                case "error":
                  /**
                   * Signals that this file's upload has encountered an error. 
                   *
                   * @event uploaderror
                   * @param event {Event} The event object for the `uploaderror` with the
                   *                      following payload:
                   *  <dl>
                   *      <dt>originEvent</dt>
                   *          <dd>The original event fired by the XMLHttpRequest instance.</dd>
                   *      <dt>status</dt>
                   *          <dd>The status code reported by the XMLHttpRequest. If it's an HTTP error,
                                  then this corresponds to the HTTP status code received by the uploader.</dd>
                   *      <dt>statusText</dt>
                   *          <dd>The text of the error event reported by the XMLHttpRequest instance</dd>
                   *      <dt>source</dt>
                   *          <dd>Either "http" (if it's an HTTP error), or "io" (if it's a network transmission 
                   *              error.)</dd>
                   *
                   *  </dl>
                   */
                   _yuitest_coverline("build/file-html5/file-html5.js", 170);
this.fire("uploaderror", {originEvent: event,
                                                  status: xhr.status,
                                                  statusText: xhr.statusText,
                                                  source: "io"});
                   _yuitest_coverline("build/file-html5/file-html5.js", 174);
break;

                case "abort":

                  /**
                   * Signals that this file's upload has been cancelled. 
                   *
                   * @event uploadcancel
                   * @param event {Event} The event object for the `uploadcancel` with the
                   *                      following payload:
                   *  <dl>
                   *      <dt>originEvent</dt>
                   *          <dd>The original event fired by the XMLHttpRequest instance.</dd>
                   *  </dl>
                   */
                   _yuitest_coverline("build/file-html5/file-html5.js", 189);
this.fire("uploadcancel", {originEvent: event});
                   _yuitest_coverline("build/file-html5/file-html5.js", 190);
break;

                case "readystatechange":

                  /**
                   * Signals that XMLHttpRequest has fired a readystatechange event. 
                   *
                   * @event readystatechange
                   * @param event {Event} The event object for the `readystatechange` with the
                   *                      following payload:
                   *  <dl>
                   *      <dt>readyState</dt>
                   *          <dd>The readyState code reported by the XMLHttpRequest instance.</dd>
                   *      <dt>originEvent</dt>
                   *          <dd>The original event fired by the XMLHttpRequest instance.</dd>
                   *  </dl>
                   */
                   _yuitest_coverline("build/file-html5/file-html5.js", 207);
this.fire("readystatechange", {readyState: event.target.readyState,
                                                  originEvent: event});
                   _yuitest_coverline("build/file-html5/file-html5.js", 209);
break;
            }
        },

       /**
        * Starts the upload of a specific file.
        *
        * @method startUpload
        * @param url {String} The URL to upload the file to.
        * @param parameters {Object} (optional) A set of key-value pairs to send as variables along with the file upload HTTP request.
        * @param fileFieldName {String} (optional) The name of the POST variable that should contain the uploaded file ('Filedata' by default)
        */
        startUpload: function(url, parameters, fileFieldName) {
         
            _yuitest_coverfunc("build/file-html5/file-html5.js", "startUpload", 221);
_yuitest_coverline("build/file-html5/file-html5.js", 223);
this._set("bytesUploaded", 0);
            
            _yuitest_coverline("build/file-html5/file-html5.js", 225);
this._set("xhr", new XMLHttpRequest());
            _yuitest_coverline("build/file-html5/file-html5.js", 226);
this._set("boundEventHandler", Bind(this._uploadEventHandler, this));
                         
            _yuitest_coverline("build/file-html5/file-html5.js", 228);
var uploadData = new FormData(),
                fileField = fileFieldName || "Filedata",
                xhr = this.get("xhr"),
                xhrupload = this.get("xhr").upload,
                boundEventHandler = this.get("boundEventHandler");

            _yuitest_coverline("build/file-html5/file-html5.js", 234);
Y.each(parameters, function (value, key) {_yuitest_coverfunc("build/file-html5/file-html5.js", "(anonymous 2)", 234);
uploadData.append(key, value);});
            _yuitest_coverline("build/file-html5/file-html5.js", 235);
uploadData.append(fileField, this.get("file"));




            _yuitest_coverline("build/file-html5/file-html5.js", 240);
xhr.addEventListener ("loadstart", boundEventHandler, false);
            _yuitest_coverline("build/file-html5/file-html5.js", 241);
xhrupload.addEventListener ("progress", boundEventHandler, false);
            _yuitest_coverline("build/file-html5/file-html5.js", 242);
xhr.addEventListener ("load", boundEventHandler, false);
            _yuitest_coverline("build/file-html5/file-html5.js", 243);
xhr.addEventListener ("error", boundEventHandler, false);
            _yuitest_coverline("build/file-html5/file-html5.js", 244);
xhrupload.addEventListener ("error", boundEventHandler, false);
            _yuitest_coverline("build/file-html5/file-html5.js", 245);
xhrupload.addEventListener ("abort", boundEventHandler, false);
            _yuitest_coverline("build/file-html5/file-html5.js", 246);
xhr.addEventListener ("abort", boundEventHandler, false);
            _yuitest_coverline("build/file-html5/file-html5.js", 247);
xhr.addEventListener ("loadend", boundEventHandler, false); 
            _yuitest_coverline("build/file-html5/file-html5.js", 248);
xhr.addEventListener ("readystatechange", boundEventHandler, false);

            _yuitest_coverline("build/file-html5/file-html5.js", 250);
xhr.open("POST", url, true);

            _yuitest_coverline("build/file-html5/file-html5.js", 252);
xhr.withCredentials = this.get("xhrWithCredentials");

            _yuitest_coverline("build/file-html5/file-html5.js", 254);
Y.each(this.get("xhrHeaders"), function (value, key) {
                 _yuitest_coverfunc("build/file-html5/file-html5.js", "(anonymous 3)", 254);
_yuitest_coverline("build/file-html5/file-html5.js", 255);
xhr.setRequestHeader(key, value);
            });

            _yuitest_coverline("build/file-html5/file-html5.js", 258);
xhr.send(uploadData);
      
            /**
             * Signals that this file's upload has started. 
             *
             * @event uploadstart
             * @param event {Event} The event object for the `uploadstart` with the
             *                      following payload:
             *  <dl>
             *      <dt>xhr</dt>
             *          <dd>The XMLHttpRequest instance handling the file upload.</dd>
             *  </dl>
             */
             _yuitest_coverline("build/file-html5/file-html5.js", 271);
this.fire("uploadstart", {xhr: xhr});

        },

       /**
        * Cancels the upload of a specific file, if currently in progress.
        *
        * @method cancelUpload
        */    
        cancelUpload: function () {
            _yuitest_coverfunc("build/file-html5/file-html5.js", "cancelUpload", 280);
_yuitest_coverline("build/file-html5/file-html5.js", 281);
this.get('xhr').abort();
        }


    }, {

       /**
        * The identity of the class.
        *
        * @property NAME
        * @type String
        * @default 'file'
        * @readOnly
        * @protected
        * @static
        */
        NAME: 'file',

       /**
        * The type of transport.
        *
        * @property TYPE
        * @type String
        * @default 'html5'
        * @readOnly
        * @protected
        * @static
        */
        TYPE: 'html5',

       /**
        * Static property used to define the default attribute configuration of
        * the File.
        *
        * @property ATTRS
        * @type {Object}
        * @protected
        * @static
        */
        ATTRS: {

       /**
        * A String containing the unique id of the file wrapped by the FileFlash instance.
        * The id is supplied by the Flash player uploader.
        *
        * @attribute id
        * @type {String}
        * @initOnly
        */
        id: {
            writeOnce: "initOnly",
            value: null
        },

       /**
        * The size of the file wrapped by FileHTML5. This value is supplied by the instance of File().
        *
        * @attribute size
        * @type {Number}
        * @initOnly
        */
        size: {
            writeOnce: "initOnly",
            value: 0
        },

       /**
        * The name of the file wrapped by FileHTML5. This value is supplied by the instance of File().
        *
        * @attribute name
        * @type {String}
        * @initOnly
        */
        name: {
            writeOnce: "initOnly",
            value: null
        },

       /**
        * The date that the file wrapped by FileHTML5 was created on. This value is supplied by the instance of File().
        *
        * @attribute dateCreated
        * @type {Date}
        * @initOnly
        * @default null
        */
        dateCreated: {
            writeOnce: "initOnly",
            value: null
        },

       /**
        * The date that the file wrapped by FileHTML5 was last modified on. This value is supplied by the instance of File().
        *
        * @attribute dateModified
        * @type {Date}
        * @initOnly
        */
        dateModified: {
            writeOnce: "initOnly",
            value: null
        },

       /**
        * The number of bytes of the file that has been uploaded to the server. This value is
        * non-zero only while a file is being uploaded.
        *
        * @attribute bytesUploaded
        * @type {Date}
        * @readOnly
        */
        bytesUploaded: {
            readOnly: true,
            value: 0
        },

       /**
        * The type of the file wrapped by FileHTML. This value is provided by the instance of File()
        *
        * @attribute type
        * @type {String}
        * @initOnly
        */
        type: {
            writeOnce: "initOnly",
            value: null
        },

       /**
        * The pointer to the instance of File() wrapped by FileHTML5.
        *
        * @attribute file
        * @type {File}
        * @initOnly
        */
        file: {
            writeOnce: "initOnly",
            value: null
        },

       /**
        * The pointer to the instance of XMLHttpRequest used by FileHTML5 to upload the file.
        *
        * @attribute xhr
        * @type {XMLHttpRequest}
        * @initOnly
        */
        xhr: {
            readOnly: true,
            value: null
        },

       /**
        * The dictionary of headers that should be set on the XMLHttpRequest object before
        * sending it.
        *
        * @attribute xhrHeaders
        * @type {Object}
        * @initOnly
        */
        xhrHeaders: {
            value: {}
        },

       /**
        * A Boolean indicating whether the XMLHttpRequest should be sent with user credentials.
        * This does not affect same-site requests. 
        *
        * @attribute xhrWithCredentials
        * @type {Boolean}
        * @initOnly
        */
        xhrWithCredentials: {
            value: true
        },

       /**
        * The bound event handler used to handle events from XMLHttpRequest.
        *
        * @attribute boundEventHandler
        * @type {Function}
        * @initOnly
        */
        boundEventHandler: {
            readOnly: true,
            value: null
        }
        },

       /**
        * Checks whether a specific native file instance is valid
        *
        * @method isValidFile
        * @param file {File} A native File() instance.
        * @static
        */
        isValidFile: function (file) {
            _yuitest_coverfunc("build/file-html5/file-html5.js", "isValidFile", 477);
_yuitest_coverline("build/file-html5/file-html5.js", 478);
return (Win && Win.File && file instanceof File);
        },

       /**
        * Checks whether the browser has a native upload capability
        * via XMLHttpRequest Level 2.
        *
        * @method canUpload
        * @static
        */
        canUpload: function () {
            _yuitest_coverfunc("build/file-html5/file-html5.js", "canUpload", 488);
_yuitest_coverline("build/file-html5/file-html5.js", 489);
return (Win && Win.FormData && Win.XMLHttpRequest);
        }
    });

    _yuitest_coverline("build/file-html5/file-html5.js", 493);
Y.FileHTML5 = FileHTML5;

}, '3.7.3', {"requires": ["base"]});
