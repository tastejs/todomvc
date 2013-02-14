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
_yuitest_coverage["build/file-flash/file-flash.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/file-flash/file-flash.js",
    code: []
};
_yuitest_coverage["build/file-flash/file-flash.js"].code=["YUI.add('file-flash', function (Y, NAME) {","","    /**","     * The FileFlash class provides a wrapper for a file pointer stored in Flash. The File wrapper ","     * also implements the mechanics for uploading a file and tracking its progress.","     * @module file-flash","     */     ","    /**","     * The class provides a wrapper for a file pointer in Flash.","     * @class FileFlash","     * @extends Base","     * @constructor","     * @param {Object} config Configuration object.","     */","","    var FileFlash = function(o) {","        FileFlash.superclass.constructor.apply(this, arguments);   ","    };","","    Y.extend(FileFlash, Y.Base, {","","       /**","        * Construction logic executed during FileFlash instantiation.","        *","        * @method initializer","        * @protected","        */","        initializer : function (cfg) {","            if (!this.get(\"id\")) {","                this._set(\"id\", Y.guid(\"file\"));","            }","        },","","       /**","        * Handler of events dispatched by the Flash player.","        *","        * @method _swfEventHandler","        * @param {Event} event The event object received from the Flash player.","        * @protected","        */      ","        _swfEventHandler: function (event) {","          if (event.id === this.get(\"id\")) {","          switch (event.type) {","            /**","             * Signals that this file's upload has started. ","             *","             * @event uploadstart","             * @param event {Event} The event object for the `uploadstart` with the","             *                      following payload:","             *  <dl>","             *      <dt>uploader</dt>","             *          <dd>The Y.SWF instance of Flash uploader that's handling the upload.</dd>","             *  </dl>","             */","            case \"uploadstart\":","                 this.fire(\"uploadstart\", {uploader: this.get(\"uploader\")});","                 break;","            case \"uploadprogress\":","","                  /**","                   * Signals that progress has been made on the upload of this file. ","                   *","                   * @event uploadprogress","                   * @param event {Event} The event object for the `uploadprogress` with the","                   *                      following payload:","                   *  <dl>","                   *      <dt>originEvent</dt>","                   *          <dd>The original event fired by the Flash uploader instance.</dd>","                   *      <dt>bytesLoaded</dt>","                   *          <dd>The number of bytes of the file that has been uploaded.</dd>","                   *      <dt>bytesTotal</dt>","                   *          <dd>The total number of bytes in the file (the file size)</dd>","                   *      <dt>percentLoaded</dt>","                   *          <dd>The fraction of the file that has been uploaded, out of 100.</dd>","                   *  </dl>","                   */","                 this.fire(\"uploadprogress\", {originEvent: event,","                                              bytesLoaded: event.bytesLoaded, ","                                              bytesTotal: event.bytesTotal, ","                                              percentLoaded: Math.min(100, Math.round(10000*event.bytesLoaded/event.bytesTotal)/100)","                                             });","                 this._set(\"bytesUploaded\", event.bytesLoaded);","                 break;","            case \"uploadcomplete\":","","                  /**","                   * Signals that this file's upload has completed, but data has not yet been received from the server. ","                   *","                   * @event uploadfinished","                   * @param event {Event} The event object for the `uploadfinished` with the","                   *                      following payload:","                   *  <dl>","                   *      <dt>originEvent</dt>","                   *          <dd>The original event fired by the Flash player instance.</dd>","                   *  </dl>","                   */","                 this.fire(\"uploadfinished\", {originEvent: event});","                 break;","            case \"uploadcompletedata\":","                /**","                 * Signals that this file's upload has completed and data has been received from the server.","                 *","                 * @event uploadcomplete","                 * @param event {Event} The event object for the `uploadcomplete` with the","                 *                      following payload:","                 *  <dl>","                 *      <dt>originEvent</dt>","                 *          <dd>The original event fired by the Flash player instance.</dd>","                 *      <dt>data</dt>","                 *          <dd>The data returned by the server.</dd>","                 *  </dl>","                 */","                 this.fire(\"uploadcomplete\", {originEvent: event,","                                              data: event.data});  ","                 break;","            case \"uploadcancel\":","","                /**","                 * Signals that this file's upload has been cancelled. ","                 *","                 * @event uploadcancel","                 * @param event {Event} The event object for the `uploadcancel` with the","                 *                      following payload:","                 *  <dl>","                 *      <dt>originEvent</dt>","                 *          <dd>The original event fired by the Flash player instance.</dd>","                 *  </dl>","                 */","                 this.fire(\"uploadcancel\", {originEvent: event});","                 break;","            case \"uploaderror\":","","                /**","                 * Signals that this file's upload has encountered an error. ","                 *","                 * @event uploaderror","                 * @param event {Event} The event object for the `uploaderror` with the","                 *                      following payload:","                 *  <dl>","                 *      <dt>originEvent</dt>","                 *          <dd>The original event fired by the Flash player instance.</dd>","                 *      <dt>status</dt>","                 *          <dd>The status code reported by the Flash Player. If it's an HTTP error,","                 *                then this corresponds to the HTTP status code received by the uploader.</dd>","                 *      <dt>statusText</dt>","                 *          <dd>The text of the error event reported by the Flash Player.</dd>","                 *      <dt>source</dt>","                 *          <dd>Either \"http\" (if it's an HTTP error), or \"io\" (if it's a network transmission ","                 *              error.)</dd>","                 *  </dl>","                 */","                 this.fire(\"uploaderror\", {originEvent: event, status: event.status, statusText: event.message, source: event.source});         ","","          }","        }","        },","","       /**","        * Starts the upload of a specific file.","        *","        * @method startUpload","        * @param url {String} The URL to upload the file to.","        * @param parameters {Object} (optional) A set of key-value pairs to send as variables along with the file upload HTTP request.","        * @param fileFieldName {String} (optional) The name of the POST variable that should contain the uploaded file ('Filedata' by default)","        */","        startUpload: function(url, parameters, fileFieldName) {","         ","        if (this.get(\"uploader\")) {","","            var myUploader = this.get(\"uploader\"),","                fileField = fileFieldName || \"Filedata\",","                id = this.get(\"id\"),","                params = parameters || null;","","            this._set(\"bytesUploaded\", 0);","            ","            myUploader.on(\"uploadstart\", this._swfEventHandler, this);","            myUploader.on(\"uploadprogress\", this._swfEventHandler, this);","            myUploader.on(\"uploadcomplete\", this._swfEventHandler, this);","            myUploader.on(\"uploadcompletedata\", this._swfEventHandler, this);","            myUploader.on(\"uploaderror\", this._swfEventHandler, this);","","            myUploader.callSWF(\"upload\", [id, url, params, fileField]);","         }","","        },","","       /**","        * Cancels the upload of a specific file, if currently in progress.","        *","        * @method cancelUpload","        */  ","        cancelUpload: function () {","         if (this.get(\"uploader\")) {","           this.get(\"uploader\").callSWF(\"cancel\", [this.get(\"id\")]);","           this.fire(\"uploadcancel\");","         }","        }","","    }, {","","       /**","        * The identity of the class.","        *","        * @property NAME","        * @type String","        * @default 'file'","        * @readOnly","        * @protected","        * @static","        */","        NAME: 'file',","","       /**","        * The type of transport.","        *","        * @property TYPE","        * @type String","        * @default 'flash'","        * @readOnly","        * @protected","        * @static","        */","        TYPE: \"flash\",","","       /**","        * Static property used to define the default attribute configuration of","        * the File.","        *","        * @property ATTRS","        * @type {Object}","        * @protected","        * @static","        */","        ATTRS: {","","       /**","        * A String containing the unique id of the file wrapped by the FileFlash instance.","        * The id is supplied by the Flash player uploader.","        *","        * @attribute id","        * @type {String}","        * @initOnly","        */","        id: {","            writeOnce: \"initOnly\",","            value: null","        },","","       /**","        * The size of the file wrapped by FileFlash. This value is supplied by the Flash player uploader.","        *","        * @attribute size","        * @type {Number}","        * @initOnly","        */","        size: {","            writeOnce: \"initOnly\",","            value: 0","        },","","       /**","        * The name of the file wrapped by FileFlash. This value is supplied by the Flash player uploader.","        *","        * @attribute name","        * @type {String}","        * @initOnly","        */","        name: {","            writeOnce: \"initOnly\",","            value: null","        },","","       /**","        * The date that the file wrapped by FileFlash was created on. This value is supplied by the Flash player uploader.","        *","        * @attribute dateCreated","        * @type {Date}","        * @initOnly","        */","        dateCreated: {","            writeOnce: \"initOnly\",","            value: null","        },","","       /**","        * The date that the file wrapped by FileFlash was last modified on. This value is supplied by the Flash player uploader.","        *","        * @attribute dateModified","        * @type {Date}","        * @initOnly","        */","        dateModified: {","            writeOnce: \"initOnly\",","            value: null","        },","","       /**","        * The number of bytes of the file that has been uploaded to the server. This value is","        * non-zero only while a file is being uploaded.","        *","        * @attribute bytesUploaded","        * @type {Date}","        * @readOnly","        */","        bytesUploaded: {","            readOnly: true,","            value: 0","        },","","       /**","        * The type of the file wrapped by FileFlash. This value is provided by the Flash player","        * uploader.","        *","        * @attribute type","        * @type {String}","        * @initOnly","        */","        type: {","            writeOnce: \"initOnly\",","            value: null","        },","","       /**","        * The instance of Y.SWF wrapping the Flash player uploader associated with this file.","        *","        * @attribute uploder","        * @type {SWF}","        * @initOnly","        */","        uploader: {","            writeOnce: \"initOnly\",","            value: null","        }","        }","    });","","    Y.FileFlash = FileFlash;","","}, '3.7.3', {\"requires\": [\"base\"]});"];
_yuitest_coverage["build/file-flash/file-flash.js"].lines = {"1":0,"16":0,"17":0,"20":0,"29":0,"30":0,"42":0,"43":0,"56":0,"57":0,"77":0,"82":0,"83":0,"97":0,"98":0,"113":0,"115":0,"129":0,"130":0,"152":0,"168":0,"170":0,"175":0,"177":0,"178":0,"179":0,"180":0,"181":0,"183":0,"194":0,"195":0,"196":0,"338":0};
_yuitest_coverage["build/file-flash/file-flash.js"].functions = {"FileFlash:16":0,"initializer:28":0,"_swfEventHandler:41":0,"startUpload:166":0,"cancelUpload:193":0,"(anonymous 1):1":0};
_yuitest_coverage["build/file-flash/file-flash.js"].coveredLines = 33;
_yuitest_coverage["build/file-flash/file-flash.js"].coveredFunctions = 6;
_yuitest_coverline("build/file-flash/file-flash.js", 1);
YUI.add('file-flash', function (Y, NAME) {

    /**
     * The FileFlash class provides a wrapper for a file pointer stored in Flash. The File wrapper 
     * also implements the mechanics for uploading a file and tracking its progress.
     * @module file-flash
     */     
    /**
     * The class provides a wrapper for a file pointer in Flash.
     * @class FileFlash
     * @extends Base
     * @constructor
     * @param {Object} config Configuration object.
     */

    _yuitest_coverfunc("build/file-flash/file-flash.js", "(anonymous 1)", 1);
_yuitest_coverline("build/file-flash/file-flash.js", 16);
var FileFlash = function(o) {
        _yuitest_coverfunc("build/file-flash/file-flash.js", "FileFlash", 16);
_yuitest_coverline("build/file-flash/file-flash.js", 17);
FileFlash.superclass.constructor.apply(this, arguments);   
    };

    _yuitest_coverline("build/file-flash/file-flash.js", 20);
Y.extend(FileFlash, Y.Base, {

       /**
        * Construction logic executed during FileFlash instantiation.
        *
        * @method initializer
        * @protected
        */
        initializer : function (cfg) {
            _yuitest_coverfunc("build/file-flash/file-flash.js", "initializer", 28);
_yuitest_coverline("build/file-flash/file-flash.js", 29);
if (!this.get("id")) {
                _yuitest_coverline("build/file-flash/file-flash.js", 30);
this._set("id", Y.guid("file"));
            }
        },

       /**
        * Handler of events dispatched by the Flash player.
        *
        * @method _swfEventHandler
        * @param {Event} event The event object received from the Flash player.
        * @protected
        */      
        _swfEventHandler: function (event) {
          _yuitest_coverfunc("build/file-flash/file-flash.js", "_swfEventHandler", 41);
_yuitest_coverline("build/file-flash/file-flash.js", 42);
if (event.id === this.get("id")) {
          _yuitest_coverline("build/file-flash/file-flash.js", 43);
switch (event.type) {
            /**
             * Signals that this file's upload has started. 
             *
             * @event uploadstart
             * @param event {Event} The event object for the `uploadstart` with the
             *                      following payload:
             *  <dl>
             *      <dt>uploader</dt>
             *          <dd>The Y.SWF instance of Flash uploader that's handling the upload.</dd>
             *  </dl>
             */
            case "uploadstart":
                 _yuitest_coverline("build/file-flash/file-flash.js", 56);
this.fire("uploadstart", {uploader: this.get("uploader")});
                 _yuitest_coverline("build/file-flash/file-flash.js", 57);
break;
            case "uploadprogress":

                  /**
                   * Signals that progress has been made on the upload of this file. 
                   *
                   * @event uploadprogress
                   * @param event {Event} The event object for the `uploadprogress` with the
                   *                      following payload:
                   *  <dl>
                   *      <dt>originEvent</dt>
                   *          <dd>The original event fired by the Flash uploader instance.</dd>
                   *      <dt>bytesLoaded</dt>
                   *          <dd>The number of bytes of the file that has been uploaded.</dd>
                   *      <dt>bytesTotal</dt>
                   *          <dd>The total number of bytes in the file (the file size)</dd>
                   *      <dt>percentLoaded</dt>
                   *          <dd>The fraction of the file that has been uploaded, out of 100.</dd>
                   *  </dl>
                   */
                 _yuitest_coverline("build/file-flash/file-flash.js", 77);
this.fire("uploadprogress", {originEvent: event,
                                              bytesLoaded: event.bytesLoaded, 
                                              bytesTotal: event.bytesTotal, 
                                              percentLoaded: Math.min(100, Math.round(10000*event.bytesLoaded/event.bytesTotal)/100)
                                             });
                 _yuitest_coverline("build/file-flash/file-flash.js", 82);
this._set("bytesUploaded", event.bytesLoaded);
                 _yuitest_coverline("build/file-flash/file-flash.js", 83);
break;
            case "uploadcomplete":

                  /**
                   * Signals that this file's upload has completed, but data has not yet been received from the server. 
                   *
                   * @event uploadfinished
                   * @param event {Event} The event object for the `uploadfinished` with the
                   *                      following payload:
                   *  <dl>
                   *      <dt>originEvent</dt>
                   *          <dd>The original event fired by the Flash player instance.</dd>
                   *  </dl>
                   */
                 _yuitest_coverline("build/file-flash/file-flash.js", 97);
this.fire("uploadfinished", {originEvent: event});
                 _yuitest_coverline("build/file-flash/file-flash.js", 98);
break;
            case "uploadcompletedata":
                /**
                 * Signals that this file's upload has completed and data has been received from the server.
                 *
                 * @event uploadcomplete
                 * @param event {Event} The event object for the `uploadcomplete` with the
                 *                      following payload:
                 *  <dl>
                 *      <dt>originEvent</dt>
                 *          <dd>The original event fired by the Flash player instance.</dd>
                 *      <dt>data</dt>
                 *          <dd>The data returned by the server.</dd>
                 *  </dl>
                 */
                 _yuitest_coverline("build/file-flash/file-flash.js", 113);
this.fire("uploadcomplete", {originEvent: event,
                                              data: event.data});  
                 _yuitest_coverline("build/file-flash/file-flash.js", 115);
break;
            case "uploadcancel":

                /**
                 * Signals that this file's upload has been cancelled. 
                 *
                 * @event uploadcancel
                 * @param event {Event} The event object for the `uploadcancel` with the
                 *                      following payload:
                 *  <dl>
                 *      <dt>originEvent</dt>
                 *          <dd>The original event fired by the Flash player instance.</dd>
                 *  </dl>
                 */
                 _yuitest_coverline("build/file-flash/file-flash.js", 129);
this.fire("uploadcancel", {originEvent: event});
                 _yuitest_coverline("build/file-flash/file-flash.js", 130);
break;
            case "uploaderror":

                /**
                 * Signals that this file's upload has encountered an error. 
                 *
                 * @event uploaderror
                 * @param event {Event} The event object for the `uploaderror` with the
                 *                      following payload:
                 *  <dl>
                 *      <dt>originEvent</dt>
                 *          <dd>The original event fired by the Flash player instance.</dd>
                 *      <dt>status</dt>
                 *          <dd>The status code reported by the Flash Player. If it's an HTTP error,
                 *                then this corresponds to the HTTP status code received by the uploader.</dd>
                 *      <dt>statusText</dt>
                 *          <dd>The text of the error event reported by the Flash Player.</dd>
                 *      <dt>source</dt>
                 *          <dd>Either "http" (if it's an HTTP error), or "io" (if it's a network transmission 
                 *              error.)</dd>
                 *  </dl>
                 */
                 _yuitest_coverline("build/file-flash/file-flash.js", 152);
this.fire("uploaderror", {originEvent: event, status: event.status, statusText: event.message, source: event.source});         

          }
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
         
        _yuitest_coverfunc("build/file-flash/file-flash.js", "startUpload", 166);
_yuitest_coverline("build/file-flash/file-flash.js", 168);
if (this.get("uploader")) {

            _yuitest_coverline("build/file-flash/file-flash.js", 170);
var myUploader = this.get("uploader"),
                fileField = fileFieldName || "Filedata",
                id = this.get("id"),
                params = parameters || null;

            _yuitest_coverline("build/file-flash/file-flash.js", 175);
this._set("bytesUploaded", 0);
            
            _yuitest_coverline("build/file-flash/file-flash.js", 177);
myUploader.on("uploadstart", this._swfEventHandler, this);
            _yuitest_coverline("build/file-flash/file-flash.js", 178);
myUploader.on("uploadprogress", this._swfEventHandler, this);
            _yuitest_coverline("build/file-flash/file-flash.js", 179);
myUploader.on("uploadcomplete", this._swfEventHandler, this);
            _yuitest_coverline("build/file-flash/file-flash.js", 180);
myUploader.on("uploadcompletedata", this._swfEventHandler, this);
            _yuitest_coverline("build/file-flash/file-flash.js", 181);
myUploader.on("uploaderror", this._swfEventHandler, this);

            _yuitest_coverline("build/file-flash/file-flash.js", 183);
myUploader.callSWF("upload", [id, url, params, fileField]);
         }

        },

       /**
        * Cancels the upload of a specific file, if currently in progress.
        *
        * @method cancelUpload
        */  
        cancelUpload: function () {
         _yuitest_coverfunc("build/file-flash/file-flash.js", "cancelUpload", 193);
_yuitest_coverline("build/file-flash/file-flash.js", 194);
if (this.get("uploader")) {
           _yuitest_coverline("build/file-flash/file-flash.js", 195);
this.get("uploader").callSWF("cancel", [this.get("id")]);
           _yuitest_coverline("build/file-flash/file-flash.js", 196);
this.fire("uploadcancel");
         }
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
        * @default 'flash'
        * @readOnly
        * @protected
        * @static
        */
        TYPE: "flash",

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
        * The size of the file wrapped by FileFlash. This value is supplied by the Flash player uploader.
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
        * The name of the file wrapped by FileFlash. This value is supplied by the Flash player uploader.
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
        * The date that the file wrapped by FileFlash was created on. This value is supplied by the Flash player uploader.
        *
        * @attribute dateCreated
        * @type {Date}
        * @initOnly
        */
        dateCreated: {
            writeOnce: "initOnly",
            value: null
        },

       /**
        * The date that the file wrapped by FileFlash was last modified on. This value is supplied by the Flash player uploader.
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
        * The type of the file wrapped by FileFlash. This value is provided by the Flash player
        * uploader.
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
        * The instance of Y.SWF wrapping the Flash player uploader associated with this file.
        *
        * @attribute uploder
        * @type {SWF}
        * @initOnly
        */
        uploader: {
            writeOnce: "initOnly",
            value: null
        }
        }
    });

    _yuitest_coverline("build/file-flash/file-flash.js", 338);
Y.FileFlash = FileFlash;

}, '3.7.3', {"requires": ["base"]});
