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
_yuitest_coverage["build/uploader-queue/uploader-queue.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/uploader-queue/uploader-queue.js",
    code: []
};
_yuitest_coverage["build/uploader-queue/uploader-queue.js"].code=["YUI.add('uploader-queue', function (Y, NAME) {","","","    /**","     * The class manages a queue of files that should be uploaded to the server.","     * It initializes the required number of uploads, tracks them as they progress,","     * and automatically advances to the next upload when a preceding one has completed.","     * @module uploader-queue","     */     ","","    var Lang = Y.Lang,","        Bind = Y.bind,","        Win = Y.config.win,","        queuedFiles,","        numberOfUploads,        ","        currentUploadedByteValues,","        currentFiles,","        totalBytesUploaded,","        totalBytes;","","    /**","     * This class manages a queue of files to be uploaded to the server.","     * @class Uploader.Queue","     * @extends Base","     * @constructor","     * @param {Object} config Configuration object","     */","    var UploaderQueue = function(o) {","        this.queuedFiles = [];","        this.uploadRetries = {};","        this.numberOfUploads = 0;","        this.currentUploadedByteValues = {};","        this.currentFiles = {};","        this.totalBytesUploaded = 0;","        this.totalBytes = 0;      ","  ","        UploaderQueue.superclass.constructor.apply(this, arguments);","    };","","","    Y.extend(UploaderQueue, Y.Base, {","","       /**","        * Stored value of the current queue state","        * @property _currentState","        * @type {String}","        * @protected","        * @default UploaderQueue.STOPPED","        */","        _currentState: UploaderQueue.STOPPED,","","       /**","        * Construction logic executed during UploaderQueue instantiation.","        *","        * @method initializer","        * @protected","        */","        initializer : function (cfg) {","","        },","","       /**","        * Handles and retransmits upload start event.","        * ","        * @method _uploadStartHandler","        * @param event The event dispatched during the upload process.","        * @private","        */","        _uploadStartHandler : function (event) {","           var updatedEvent = event;","           updatedEvent.file = event.target;","           updatedEvent.originEvent = event;","           ","           this.fire(\"uploadstart\", updatedEvent);          ","        },","","       /**","        * Handles and retransmits upload error event.","        * ","        * @method _uploadErrorHandler","        * @param event The event dispatched during the upload process.","        * @private","        */","        _uploadErrorHandler : function (event) {","           var errorAction = this.get(\"errorAction\");","           var updatedEvent = event;","           updatedEvent.file = event.target;","           updatedEvent.originEvent = event;","","           this.numberOfUploads-=1;","           delete this.currentFiles[event.target.get(\"id\")];","           this._detachFileEvents(event.target);","","           event.target.cancelUpload();","","           if (errorAction === UploaderQueue.STOP) {","             this.pauseUpload();","           }","","           else if (errorAction === UploaderQueue.RESTART_ASAP) {","            var fileid = event.target.get(\"id\"),","                retries = this.uploadRetries[fileid] || 0;","            if (retries < this.get(\"retryCount\")) {","               this.uploadRetries[fileid] = retries + 1;","               this.addToQueueTop(event.target);","            }","               this._startNextFile();","           }","           else if (errorAction === UploaderQueue.RESTART_AFTER) {","            var fileid = event.target.get(\"id\"),","                retries = this.uploadRetries[fileid] || 0;","            if (retries < this.get(\"retryCount\")) {","               this.uploadRetries[fileid] = retries + 1;","               this.addToQueueBottom(event.target);","            }","              this._startNextFile();","           }","","           this.fire(\"uploaderror\", updatedEvent);  ","        },","","       /**","        * Launches the upload of the next file in the queue.","        * ","        * @method _startNextFile","        * @private","        */","        _startNextFile : function () {","          if (this.queuedFiles.length > 0) {","            var currentFile = this.queuedFiles.shift(),","               fileId = currentFile.get(\"id\"),","               parameters = this.get(\"perFileParameters\"),","               fileParameters = parameters.hasOwnProperty(fileId) ? parameters[fileId] : parameters;","","               this.currentUploadedByteValues[fileId] = 0;","","               currentFile.on(\"uploadstart\", this._uploadStartHandler, this);","               currentFile.on(\"uploadprogress\", this._uploadProgressHandler, this);","               currentFile.on(\"uploadcomplete\", this._uploadCompleteHandler, this);","               currentFile.on(\"uploaderror\", this._uploadErrorHandler, this);","               currentFile.on(\"uploadcancel\", this._uploadCancelHandler, this);","","               currentFile.set(\"xhrHeaders\", this.get(\"uploadHeaders\"));","               currentFile.set(\"xhrWithCredentials\", this.get(\"withCredentials\"));","","               currentFile.startUpload(this.get(\"uploadURL\"), fileParameters, this.get(\"fileFieldName\"));","","               this._registerUpload(currentFile);","          }","        },","","       /**","        * Register a new upload process.","        * ","        * @method _registerUpload","        * @private","        */","        _registerUpload : function (file) {","          this.numberOfUploads += 1;","          this.currentFiles[file.get(\"id\")] = file;","        },","","       /**","        * Unregisters a new upload process.","        * ","        * @method _unregisterUpload","        * @private","        */","        _unregisterUpload : function (file) {","          if (this.numberOfUploads > 0) {","            this.numberOfUploads -=1;","          }","          delete this.currentFiles[file.get(\"id\")];","          delete this.uploadRetries[file.get(\"id\")];","","          this._detachFileEvents(file);","        },","","        _detachFileEvents : function (file) {","          file.detach(\"uploadstart\", this._uploadStartHandler);","          file.detach(\"uploadprogress\", this._uploadProgressHandler);","          file.detach(\"uploadcomplete\", this._uploadCompleteHandler);","          file.detach(\"uploaderror\", this._uploadErrorHandler);","          file.detach(\"uploadcancel\", this._uploadCancelHandler);","        },","","       /**","        * Handles and retransmits upload complete event.","        * ","        * @method _uploadCompleteHandler","        * @param event The event dispatched during the upload process.","        * @private","        */","        _uploadCompleteHandler : function (event) {","","           this._unregisterUpload(event.target);","","           this.totalBytesUploaded += event.target.get(\"size\");","           delete this.currentUploadedByteValues[event.target.get(\"id\")];","","","           if (this.queuedFiles.length > 0 && this._currentState === UploaderQueue.UPLOADING) {","               this._startNextFile();","           }","           ","           var updatedEvent = event;","           updatedEvent.file = event.target;","           updatedEvent.originEvent = event;","","           var uploadedTotal = this.totalBytesUploaded;","","           Y.each(this.currentUploadedByteValues, function (value) {","              uploadedTotal += value; ","           });","           ","           var percentLoaded = Math.min(100, Math.round(10000*uploadedTotal/this.totalBytes) / 100); ","           ","           this.fire(\"totaluploadprogress\", {bytesLoaded: uploadedTotal, ","                                             bytesTotal: this.totalBytes,","                                             percentLoaded: percentLoaded});","","           this.fire(\"uploadcomplete\", updatedEvent);","","           if (this.queuedFiles.length === 0 && this.numberOfUploads <= 0) {","               this.fire(\"alluploadscomplete\");","               this._currentState = UploaderQueue.STOPPED;","           }","","","        },","","       /**","        * Handles and retransmits upload cancel event.","        * ","        * @method _uploadCancelHandler","        * @param event The event dispatched during the upload process.","        * @private","        */","        _uploadCancelHandler : function (event) {","          ","          var updatedEvent = event;","          updatedEvent.originEvent = event;","          updatedEvent.file = event.target;","","          this.fire(\"uploadcacel\", updatedEvent);","        },","","","","       /**","        * Handles and retransmits upload progress event.","        * ","        * @method _uploadProgressHandler","        * @param event The event dispatched during the upload process.","        * @private","        */","        _uploadProgressHandler : function (event) {","          ","          this.currentUploadedByteValues[event.target.get(\"id\")] = event.bytesLoaded;","          ","          var updatedEvent = event;","          updatedEvent.originEvent = event;","          updatedEvent.file = event.target;","","          this.fire(\"uploadprogress\", updatedEvent);","          ","          var uploadedTotal = this.totalBytesUploaded;","","          Y.each(this.currentUploadedByteValues, function (value) {","             uploadedTotal += value; ","          });","          ","          var percentLoaded = Math.min(100, Math.round(10000*uploadedTotal/this.totalBytes) / 100);","","          this.fire(\"totaluploadprogress\", {bytesLoaded: uploadedTotal, ","                                            bytesTotal: this.totalBytes,","                                            percentLoaded: percentLoaded});","        },","","       /**","        * Starts uploading the queued up file list.","        * ","        * @method startUpload","        */","        startUpload: function() {","           ","           this.queuedFiles = this.get(\"fileList\").slice(0);","           this.numberOfUploads = 0;","           this.currentUploadedByteValues = {};","           this.currentFiles = {};","           this.totalBytesUploaded = 0;","           ","           this._currentState = UploaderQueue.UPLOADING;","","           while (this.numberOfUploads < this.get(\"simUploads\") && this.queuedFiles.length > 0) {","                this._startNextFile();","           }","        },","","       /**","        * Pauses the upload process. The ongoing file uploads","        * will complete after this method is called, but no","        * new ones will be launched.","        * ","        * @method pauseUpload","        */","        pauseUpload: function () {","            this._currentState = UploaderQueue.STOPPED;","        },","","       /**","        * Restarts a paused upload process.","        * ","        * @method restartUpload","        */","        restartUpload: function () {","            this._currentState = UploaderQueue.UPLOADING;","            while (this.numberOfUploads < this.get(\"simUploads\")) {","               this._startNextFile();","            }","        },","","       /**","        * If a particular file is stuck in an ongoing upload without","        * any progress events, this method allows to force its reupload","        * by cancelling its upload and immediately relaunching it.","        * ","        * @method forceReupload","        * @param file {Y.File} The file to force reupload on.","        */","        forceReupload : function (file) {","            var id = file.get(\"id\");","            if (this.currentFiles.hasOwnProperty(id)) {","              file.cancelUpload();","              this._unregisterUpload(file);","              this.addToQueueTop(file);","              this._startNextFile();","            }","        },","","       /**","        * Add a new file to the top of the queue (the upload will be","        * launched as soon as the current number of uploading files","        * drops below the maximum permissible value).","        * ","        * @method addToQueueTop","        * @param file {Y.File} The file to add to the top of the queue.","        */","        addToQueueTop: function (file) {","            this.queuedFiles.unshift(file);","        },","","       /**","        * Add a new file to the bottom of the queue (the upload will be","        * launched after all the other queued files are uploaded.)","        * ","        * @method addToQueueBottom","        * @param file {Y.File} The file to add to the bottom of the queue.","        */","        addToQueueBottom: function (file) {","            this.queuedFiles.push(file);","        },","","       /**","        * Cancels a specific file's upload. If no argument is passed,","        * all ongoing uploads are cancelled and the upload process is","        * stopped.","        * ","        * @method cancelUpload","        * @param file {Y.File} An optional parameter - the file whose upload","        * should be cancelled.","        */","        cancelUpload: function (file) {","","          if (file) {","            var id = file.get(\"id\");","            if (this.currentFiles[id]) {","              this.currentFiles[id].cancelUpload();","              this._unregisterUpload(this.currentFiles[id]);","              if (this._currentState === UploaderQueue.UPLOADING) {","                this._startNextFile();","              }","            }","            else {","              for (var i = 0, len = this.queuedFiles.length; i < len; i++) {","                if (this.queuedFiles[i].get(\"id\") === id) {","                  this.queuedFiles.splice(i, 1);","                  break;","                }","              }","            }","          }","          else {","            for (var fid in this.currentFiles) {","              this.currentFiles[fid].cancelUpload();","              this._unregisterUpload(this.currentFiles[fid]);","            }","","            this.currentUploadedByteValues = {};","            this.currentFiles = {};","            this.totalBytesUploaded = 0;","            this.fire(\"alluploadscancelled\");","            this._currentState = UploaderQueue.STOPPED;","          }","        }","    }, ","","    {","      /** ","       * Static constant for the value of the `errorAction` attribute:","       * prescribes the queue to continue uploading files in case of ","       * an error.","       * @property CONTINUE","       * @readOnly","       * @type {String}","       * @static","       */","        CONTINUE: \"continue\",","","      /** ","       * Static constant for the value of the `errorAction` attribute:","       * prescribes the queue to stop uploading files in case of ","       * an error.","       * @property STOP","       * @readOnly","       * @type {String}","       * @static","       */","        STOP: \"stop\",","","      /** ","       * Static constant for the value of the `errorAction` attribute:","       * prescribes the queue to restart a file upload immediately in case of ","       * an error.","       * @property RESTART_ASAP","       * @readOnly","       * @type {String}","       * @static","       */","        RESTART_ASAP: \"restartasap\",","","      /** ","       * Static constant for the value of the `errorAction` attribute:","       * prescribes the queue to restart an errored out file upload after ","       * other files have finished uploading.","       * @property RESTART_AFTER","       * @readOnly","       * @type {String}","       * @static","       */","        RESTART_AFTER: \"restartafter\",","","      /** ","       * Static constant for the value of the `_currentState` property:","       * implies that the queue is currently not uploading files.","       * @property STOPPED","       * @readOnly","       * @type {String}","       * @static","       */","        STOPPED: \"stopped\",","","      /** ","       * Static constant for the value of the `_currentState` property:","       * implies that the queue is currently uploading files.","       * @property UPLOADING","       * @readOnly","       * @type {String}","       * @static","       */","        UPLOADING: \"uploading\",","","       /**","        * The identity of the class.","        *","        * @property NAME","        * @type String","        * @default 'uploaderqueue'","        * @readOnly","        * @protected","        * @static","        */","        NAME: 'uploaderqueue',","","       /**","        * Static property used to define the default attribute configuration of","        * the class.","        *","        * @property ATTRS","        * @type {Object}","        * @protected","        * @static","        */","        ATTRS: {","       ","          /**","           * Maximum number of simultaneous uploads; must be in the","           * range between 1 and 5. The value of `2` is default. It","           * is recommended that this value does not exceed 3.","           * @property simUploads","           * @type Number","           * @default 2","           */","           simUploads: {","               value: 2,","               validator: function (val, name) {","                   return (val >= 1 && val <= 5);","               }","           },","   ","          /**","           * The action to take in case of error. The valid values for this attribute are: ","           * `Y.Uploader.Queue.CONTINUE` (the upload process should continue on other files, ","           * ignoring the error), `Y.Uploader.Queue.STOP` (the upload process ","           * should stop completely), `Y.Uploader.Queue.RESTART_ASAP` (the upload ","           * should restart immediately on the errored out file and continue as planned), or","           * Y.Uploader.Queue.RESTART_AFTER (the upload of the errored out file should restart","           * after all other files have uploaded)","           * @property errorAction","           * @type String","           * @default Y.Uploader.Queue.CONTINUE","           */","           errorAction: {","               value: \"continue\",","               validator: function (val, name) {","                   return (val === UploaderQueue.CONTINUE || val === UploaderQueue.STOP || val === UploaderQueue.RESTART_ASAP || val === UploaderQueue.RESTART_AFTER);","               }","           },","","          /**","           * The total number of bytes that has been uploaded.","           * @property bytesUploaded","           * @type Number","           */   ","           bytesUploaded: {","               readOnly: true,","               value: 0","           },","   ","          /**","           * The total number of bytes in the queue.","           * @property bytesTotal","           * @type Number","           */ ","           bytesTotal: {","               readOnly: true,","               value: 0","           },","","          /**","           * The queue file list. This file list should only be modified","           * before the upload has been started; modifying it after starting","           * the upload has no effect, and `addToQueueTop` or `addToQueueBottom` methods","           * should be used instead.","           * @property fileList","           * @type Number","           */    ","           fileList: {","               value: [],","               lazyAdd: false,","               setter: function (val) {","                   var newValue = val;","                   Y.Array.each(newValue, function (value) {","                       this.totalBytes += value.get(\"size\");","                   }, this);","    ","                   return val;","               }   ","           },","","          /**","           * A String specifying what should be the POST field name for the file","           * content in the upload request.","           *","           * @attribute fileFieldName","           * @type {String}","           * @default Filedata","           */   ","           fileFieldName: {","              value: \"Filedata\"","           },","","          /**","           * The URL to POST the file upload requests to.","           *","           * @attribute uploadURL","           * @type {String}","           * @default \"\"","           */  ","           uploadURL: {","             value: \"\"","           },","","          /**","           * Additional HTTP headers that should be included","           * in the upload request. Due to Flash Player security","           * restrictions, this attribute is only honored in the","           * HTML5 Uploader.","           *","           * @attribute uploadHeaders","           * @type {Object}","           * @default {}","           */  ","           uploadHeaders: {","             value: {}","           },","","          /**","           * A Boolean that specifies whether the file should be","           * uploaded with the appropriate user credentials for the","           * domain. Due to Flash Player security restrictions, this","           * attribute is only honored in the HTML5 Uploader.","           *","           * @attribute withCredentials","           * @type {Boolean}","           * @default true","           */  ","           withCredentials: {","             value: true","           },","","","          /**","           * An object, keyed by `fileId`, containing sets of key-value pairs","           * that should be passed as POST variables along with each corresponding","           * file.","           *","           * @attribute perFileParameters","           * @type {Object}","           * @default {}","           */   ","           perFileParameters: {","             value: {}","           },","","          /**","           * The number of times to try re-uploading a file that failed to upload before","           * cancelling its upload.","           *","           * @attribute retryCount","           * @type {Number}","           * @default 3","           */ ","           retryCount: {","             value: 3","           }","","        }","    });","","","    Y.namespace('Uploader');","    Y.Uploader.Queue = UploaderQueue;","","}, '3.7.3', {\"requires\": [\"base\"]});"];
_yuitest_coverage["build/uploader-queue/uploader-queue.js"].lines = {"1":0,"11":0,"28":0,"29":0,"30":0,"31":0,"32":0,"33":0,"34":0,"35":0,"37":0,"41":0,"70":0,"71":0,"72":0,"74":0,"85":0,"86":0,"87":0,"88":0,"90":0,"91":0,"92":0,"94":0,"96":0,"97":0,"100":0,"101":0,"103":0,"104":0,"105":0,"107":0,"109":0,"110":0,"112":0,"113":0,"114":0,"116":0,"119":0,"129":0,"130":0,"135":0,"137":0,"138":0,"139":0,"140":0,"141":0,"143":0,"144":0,"146":0,"148":0,"159":0,"160":0,"170":0,"171":0,"173":0,"174":0,"176":0,"180":0,"181":0,"182":0,"183":0,"184":0,"196":0,"198":0,"199":0,"202":0,"203":0,"206":0,"207":0,"208":0,"210":0,"212":0,"213":0,"216":0,"218":0,"222":0,"224":0,"225":0,"226":0,"241":0,"242":0,"243":0,"245":0,"259":0,"261":0,"262":0,"263":0,"265":0,"267":0,"269":0,"270":0,"273":0,"275":0,"287":0,"288":0,"289":0,"290":0,"291":0,"293":0,"295":0,"296":0,"308":0,"317":0,"318":0,"319":0,"332":0,"333":0,"334":0,"335":0,"336":0,"337":0,"350":0,"361":0,"375":0,"376":0,"377":0,"378":0,"379":0,"380":0,"381":0,"385":0,"386":0,"387":0,"388":0,"394":0,"395":0,"396":0,"399":0,"400":0,"401":0,"402":0,"403":0,"507":0,"526":0,"562":0,"563":0,"564":0,"567":0,"652":0,"653":0};
_yuitest_coverage["build/uploader-queue/uploader-queue.js"].functions = {"UploaderQueue:28":0,"_uploadStartHandler:69":0,"_uploadErrorHandler:84":0,"_startNextFile:128":0,"_registerUpload:158":0,"_unregisterUpload:169":0,"_detachFileEvents:179":0,"(anonymous 2):212":0,"_uploadCompleteHandler:194":0,"_uploadCancelHandler:239":0,"(anonymous 3):269":0,"_uploadProgressHandler:257":0,"startUpload:285":0,"pauseUpload:307":0,"restartUpload:316":0,"forceReupload:331":0,"addToQueueTop:349":0,"addToQueueBottom:360":0,"cancelUpload:373":0,"validator:506":0,"validator:525":0,"(anonymous 4):563":0,"setter:561":0,"(anonymous 1):1":0};
_yuitest_coverage["build/uploader-queue/uploader-queue.js"].coveredLines = 141;
_yuitest_coverage["build/uploader-queue/uploader-queue.js"].coveredFunctions = 24;
_yuitest_coverline("build/uploader-queue/uploader-queue.js", 1);
YUI.add('uploader-queue', function (Y, NAME) {


    /**
     * The class manages a queue of files that should be uploaded to the server.
     * It initializes the required number of uploads, tracks them as they progress,
     * and automatically advances to the next upload when a preceding one has completed.
     * @module uploader-queue
     */     

    _yuitest_coverfunc("build/uploader-queue/uploader-queue.js", "(anonymous 1)", 1);
_yuitest_coverline("build/uploader-queue/uploader-queue.js", 11);
var Lang = Y.Lang,
        Bind = Y.bind,
        Win = Y.config.win,
        queuedFiles,
        numberOfUploads,        
        currentUploadedByteValues,
        currentFiles,
        totalBytesUploaded,
        totalBytes;

    /**
     * This class manages a queue of files to be uploaded to the server.
     * @class Uploader.Queue
     * @extends Base
     * @constructor
     * @param {Object} config Configuration object
     */
    _yuitest_coverline("build/uploader-queue/uploader-queue.js", 28);
var UploaderQueue = function(o) {
        _yuitest_coverfunc("build/uploader-queue/uploader-queue.js", "UploaderQueue", 28);
_yuitest_coverline("build/uploader-queue/uploader-queue.js", 29);
this.queuedFiles = [];
        _yuitest_coverline("build/uploader-queue/uploader-queue.js", 30);
this.uploadRetries = {};
        _yuitest_coverline("build/uploader-queue/uploader-queue.js", 31);
this.numberOfUploads = 0;
        _yuitest_coverline("build/uploader-queue/uploader-queue.js", 32);
this.currentUploadedByteValues = {};
        _yuitest_coverline("build/uploader-queue/uploader-queue.js", 33);
this.currentFiles = {};
        _yuitest_coverline("build/uploader-queue/uploader-queue.js", 34);
this.totalBytesUploaded = 0;
        _yuitest_coverline("build/uploader-queue/uploader-queue.js", 35);
this.totalBytes = 0;      
  
        _yuitest_coverline("build/uploader-queue/uploader-queue.js", 37);
UploaderQueue.superclass.constructor.apply(this, arguments);
    };


    _yuitest_coverline("build/uploader-queue/uploader-queue.js", 41);
Y.extend(UploaderQueue, Y.Base, {

       /**
        * Stored value of the current queue state
        * @property _currentState
        * @type {String}
        * @protected
        * @default UploaderQueue.STOPPED
        */
        _currentState: UploaderQueue.STOPPED,

       /**
        * Construction logic executed during UploaderQueue instantiation.
        *
        * @method initializer
        * @protected
        */
        initializer : function (cfg) {

        },

       /**
        * Handles and retransmits upload start event.
        * 
        * @method _uploadStartHandler
        * @param event The event dispatched during the upload process.
        * @private
        */
        _uploadStartHandler : function (event) {
           _yuitest_coverfunc("build/uploader-queue/uploader-queue.js", "_uploadStartHandler", 69);
_yuitest_coverline("build/uploader-queue/uploader-queue.js", 70);
var updatedEvent = event;
           _yuitest_coverline("build/uploader-queue/uploader-queue.js", 71);
updatedEvent.file = event.target;
           _yuitest_coverline("build/uploader-queue/uploader-queue.js", 72);
updatedEvent.originEvent = event;
           
           _yuitest_coverline("build/uploader-queue/uploader-queue.js", 74);
this.fire("uploadstart", updatedEvent);          
        },

       /**
        * Handles and retransmits upload error event.
        * 
        * @method _uploadErrorHandler
        * @param event The event dispatched during the upload process.
        * @private
        */
        _uploadErrorHandler : function (event) {
           _yuitest_coverfunc("build/uploader-queue/uploader-queue.js", "_uploadErrorHandler", 84);
_yuitest_coverline("build/uploader-queue/uploader-queue.js", 85);
var errorAction = this.get("errorAction");
           _yuitest_coverline("build/uploader-queue/uploader-queue.js", 86);
var updatedEvent = event;
           _yuitest_coverline("build/uploader-queue/uploader-queue.js", 87);
updatedEvent.file = event.target;
           _yuitest_coverline("build/uploader-queue/uploader-queue.js", 88);
updatedEvent.originEvent = event;

           _yuitest_coverline("build/uploader-queue/uploader-queue.js", 90);
this.numberOfUploads-=1;
           _yuitest_coverline("build/uploader-queue/uploader-queue.js", 91);
delete this.currentFiles[event.target.get("id")];
           _yuitest_coverline("build/uploader-queue/uploader-queue.js", 92);
this._detachFileEvents(event.target);

           _yuitest_coverline("build/uploader-queue/uploader-queue.js", 94);
event.target.cancelUpload();

           _yuitest_coverline("build/uploader-queue/uploader-queue.js", 96);
if (errorAction === UploaderQueue.STOP) {
             _yuitest_coverline("build/uploader-queue/uploader-queue.js", 97);
this.pauseUpload();
           }

           else {_yuitest_coverline("build/uploader-queue/uploader-queue.js", 100);
if (errorAction === UploaderQueue.RESTART_ASAP) {
            _yuitest_coverline("build/uploader-queue/uploader-queue.js", 101);
var fileid = event.target.get("id"),
                retries = this.uploadRetries[fileid] || 0;
            _yuitest_coverline("build/uploader-queue/uploader-queue.js", 103);
if (retries < this.get("retryCount")) {
               _yuitest_coverline("build/uploader-queue/uploader-queue.js", 104);
this.uploadRetries[fileid] = retries + 1;
               _yuitest_coverline("build/uploader-queue/uploader-queue.js", 105);
this.addToQueueTop(event.target);
            }
               _yuitest_coverline("build/uploader-queue/uploader-queue.js", 107);
this._startNextFile();
           }
           else {_yuitest_coverline("build/uploader-queue/uploader-queue.js", 109);
if (errorAction === UploaderQueue.RESTART_AFTER) {
            _yuitest_coverline("build/uploader-queue/uploader-queue.js", 110);
var fileid = event.target.get("id"),
                retries = this.uploadRetries[fileid] || 0;
            _yuitest_coverline("build/uploader-queue/uploader-queue.js", 112);
if (retries < this.get("retryCount")) {
               _yuitest_coverline("build/uploader-queue/uploader-queue.js", 113);
this.uploadRetries[fileid] = retries + 1;
               _yuitest_coverline("build/uploader-queue/uploader-queue.js", 114);
this.addToQueueBottom(event.target);
            }
              _yuitest_coverline("build/uploader-queue/uploader-queue.js", 116);
this._startNextFile();
           }}}

           _yuitest_coverline("build/uploader-queue/uploader-queue.js", 119);
this.fire("uploaderror", updatedEvent);  
        },

       /**
        * Launches the upload of the next file in the queue.
        * 
        * @method _startNextFile
        * @private
        */
        _startNextFile : function () {
          _yuitest_coverfunc("build/uploader-queue/uploader-queue.js", "_startNextFile", 128);
_yuitest_coverline("build/uploader-queue/uploader-queue.js", 129);
if (this.queuedFiles.length > 0) {
            _yuitest_coverline("build/uploader-queue/uploader-queue.js", 130);
var currentFile = this.queuedFiles.shift(),
               fileId = currentFile.get("id"),
               parameters = this.get("perFileParameters"),
               fileParameters = parameters.hasOwnProperty(fileId) ? parameters[fileId] : parameters;

               _yuitest_coverline("build/uploader-queue/uploader-queue.js", 135);
this.currentUploadedByteValues[fileId] = 0;

               _yuitest_coverline("build/uploader-queue/uploader-queue.js", 137);
currentFile.on("uploadstart", this._uploadStartHandler, this);
               _yuitest_coverline("build/uploader-queue/uploader-queue.js", 138);
currentFile.on("uploadprogress", this._uploadProgressHandler, this);
               _yuitest_coverline("build/uploader-queue/uploader-queue.js", 139);
currentFile.on("uploadcomplete", this._uploadCompleteHandler, this);
               _yuitest_coverline("build/uploader-queue/uploader-queue.js", 140);
currentFile.on("uploaderror", this._uploadErrorHandler, this);
               _yuitest_coverline("build/uploader-queue/uploader-queue.js", 141);
currentFile.on("uploadcancel", this._uploadCancelHandler, this);

               _yuitest_coverline("build/uploader-queue/uploader-queue.js", 143);
currentFile.set("xhrHeaders", this.get("uploadHeaders"));
               _yuitest_coverline("build/uploader-queue/uploader-queue.js", 144);
currentFile.set("xhrWithCredentials", this.get("withCredentials"));

               _yuitest_coverline("build/uploader-queue/uploader-queue.js", 146);
currentFile.startUpload(this.get("uploadURL"), fileParameters, this.get("fileFieldName"));

               _yuitest_coverline("build/uploader-queue/uploader-queue.js", 148);
this._registerUpload(currentFile);
          }
        },

       /**
        * Register a new upload process.
        * 
        * @method _registerUpload
        * @private
        */
        _registerUpload : function (file) {
          _yuitest_coverfunc("build/uploader-queue/uploader-queue.js", "_registerUpload", 158);
_yuitest_coverline("build/uploader-queue/uploader-queue.js", 159);
this.numberOfUploads += 1;
          _yuitest_coverline("build/uploader-queue/uploader-queue.js", 160);
this.currentFiles[file.get("id")] = file;
        },

       /**
        * Unregisters a new upload process.
        * 
        * @method _unregisterUpload
        * @private
        */
        _unregisterUpload : function (file) {
          _yuitest_coverfunc("build/uploader-queue/uploader-queue.js", "_unregisterUpload", 169);
_yuitest_coverline("build/uploader-queue/uploader-queue.js", 170);
if (this.numberOfUploads > 0) {
            _yuitest_coverline("build/uploader-queue/uploader-queue.js", 171);
this.numberOfUploads -=1;
          }
          _yuitest_coverline("build/uploader-queue/uploader-queue.js", 173);
delete this.currentFiles[file.get("id")];
          _yuitest_coverline("build/uploader-queue/uploader-queue.js", 174);
delete this.uploadRetries[file.get("id")];

          _yuitest_coverline("build/uploader-queue/uploader-queue.js", 176);
this._detachFileEvents(file);
        },

        _detachFileEvents : function (file) {
          _yuitest_coverfunc("build/uploader-queue/uploader-queue.js", "_detachFileEvents", 179);
_yuitest_coverline("build/uploader-queue/uploader-queue.js", 180);
file.detach("uploadstart", this._uploadStartHandler);
          _yuitest_coverline("build/uploader-queue/uploader-queue.js", 181);
file.detach("uploadprogress", this._uploadProgressHandler);
          _yuitest_coverline("build/uploader-queue/uploader-queue.js", 182);
file.detach("uploadcomplete", this._uploadCompleteHandler);
          _yuitest_coverline("build/uploader-queue/uploader-queue.js", 183);
file.detach("uploaderror", this._uploadErrorHandler);
          _yuitest_coverline("build/uploader-queue/uploader-queue.js", 184);
file.detach("uploadcancel", this._uploadCancelHandler);
        },

       /**
        * Handles and retransmits upload complete event.
        * 
        * @method _uploadCompleteHandler
        * @param event The event dispatched during the upload process.
        * @private
        */
        _uploadCompleteHandler : function (event) {

           _yuitest_coverfunc("build/uploader-queue/uploader-queue.js", "_uploadCompleteHandler", 194);
_yuitest_coverline("build/uploader-queue/uploader-queue.js", 196);
this._unregisterUpload(event.target);

           _yuitest_coverline("build/uploader-queue/uploader-queue.js", 198);
this.totalBytesUploaded += event.target.get("size");
           _yuitest_coverline("build/uploader-queue/uploader-queue.js", 199);
delete this.currentUploadedByteValues[event.target.get("id")];


           _yuitest_coverline("build/uploader-queue/uploader-queue.js", 202);
if (this.queuedFiles.length > 0 && this._currentState === UploaderQueue.UPLOADING) {
               _yuitest_coverline("build/uploader-queue/uploader-queue.js", 203);
this._startNextFile();
           }
           
           _yuitest_coverline("build/uploader-queue/uploader-queue.js", 206);
var updatedEvent = event;
           _yuitest_coverline("build/uploader-queue/uploader-queue.js", 207);
updatedEvent.file = event.target;
           _yuitest_coverline("build/uploader-queue/uploader-queue.js", 208);
updatedEvent.originEvent = event;

           _yuitest_coverline("build/uploader-queue/uploader-queue.js", 210);
var uploadedTotal = this.totalBytesUploaded;

           _yuitest_coverline("build/uploader-queue/uploader-queue.js", 212);
Y.each(this.currentUploadedByteValues, function (value) {
              _yuitest_coverfunc("build/uploader-queue/uploader-queue.js", "(anonymous 2)", 212);
_yuitest_coverline("build/uploader-queue/uploader-queue.js", 213);
uploadedTotal += value; 
           });
           
           _yuitest_coverline("build/uploader-queue/uploader-queue.js", 216);
var percentLoaded = Math.min(100, Math.round(10000*uploadedTotal/this.totalBytes) / 100); 
           
           _yuitest_coverline("build/uploader-queue/uploader-queue.js", 218);
this.fire("totaluploadprogress", {bytesLoaded: uploadedTotal, 
                                             bytesTotal: this.totalBytes,
                                             percentLoaded: percentLoaded});

           _yuitest_coverline("build/uploader-queue/uploader-queue.js", 222);
this.fire("uploadcomplete", updatedEvent);

           _yuitest_coverline("build/uploader-queue/uploader-queue.js", 224);
if (this.queuedFiles.length === 0 && this.numberOfUploads <= 0) {
               _yuitest_coverline("build/uploader-queue/uploader-queue.js", 225);
this.fire("alluploadscomplete");
               _yuitest_coverline("build/uploader-queue/uploader-queue.js", 226);
this._currentState = UploaderQueue.STOPPED;
           }


        },

       /**
        * Handles and retransmits upload cancel event.
        * 
        * @method _uploadCancelHandler
        * @param event The event dispatched during the upload process.
        * @private
        */
        _uploadCancelHandler : function (event) {
          
          _yuitest_coverfunc("build/uploader-queue/uploader-queue.js", "_uploadCancelHandler", 239);
_yuitest_coverline("build/uploader-queue/uploader-queue.js", 241);
var updatedEvent = event;
          _yuitest_coverline("build/uploader-queue/uploader-queue.js", 242);
updatedEvent.originEvent = event;
          _yuitest_coverline("build/uploader-queue/uploader-queue.js", 243);
updatedEvent.file = event.target;

          _yuitest_coverline("build/uploader-queue/uploader-queue.js", 245);
this.fire("uploadcacel", updatedEvent);
        },



       /**
        * Handles and retransmits upload progress event.
        * 
        * @method _uploadProgressHandler
        * @param event The event dispatched during the upload process.
        * @private
        */
        _uploadProgressHandler : function (event) {
          
          _yuitest_coverfunc("build/uploader-queue/uploader-queue.js", "_uploadProgressHandler", 257);
_yuitest_coverline("build/uploader-queue/uploader-queue.js", 259);
this.currentUploadedByteValues[event.target.get("id")] = event.bytesLoaded;
          
          _yuitest_coverline("build/uploader-queue/uploader-queue.js", 261);
var updatedEvent = event;
          _yuitest_coverline("build/uploader-queue/uploader-queue.js", 262);
updatedEvent.originEvent = event;
          _yuitest_coverline("build/uploader-queue/uploader-queue.js", 263);
updatedEvent.file = event.target;

          _yuitest_coverline("build/uploader-queue/uploader-queue.js", 265);
this.fire("uploadprogress", updatedEvent);
          
          _yuitest_coverline("build/uploader-queue/uploader-queue.js", 267);
var uploadedTotal = this.totalBytesUploaded;

          _yuitest_coverline("build/uploader-queue/uploader-queue.js", 269);
Y.each(this.currentUploadedByteValues, function (value) {
             _yuitest_coverfunc("build/uploader-queue/uploader-queue.js", "(anonymous 3)", 269);
_yuitest_coverline("build/uploader-queue/uploader-queue.js", 270);
uploadedTotal += value; 
          });
          
          _yuitest_coverline("build/uploader-queue/uploader-queue.js", 273);
var percentLoaded = Math.min(100, Math.round(10000*uploadedTotal/this.totalBytes) / 100);

          _yuitest_coverline("build/uploader-queue/uploader-queue.js", 275);
this.fire("totaluploadprogress", {bytesLoaded: uploadedTotal, 
                                            bytesTotal: this.totalBytes,
                                            percentLoaded: percentLoaded});
        },

       /**
        * Starts uploading the queued up file list.
        * 
        * @method startUpload
        */
        startUpload: function() {
           
           _yuitest_coverfunc("build/uploader-queue/uploader-queue.js", "startUpload", 285);
_yuitest_coverline("build/uploader-queue/uploader-queue.js", 287);
this.queuedFiles = this.get("fileList").slice(0);
           _yuitest_coverline("build/uploader-queue/uploader-queue.js", 288);
this.numberOfUploads = 0;
           _yuitest_coverline("build/uploader-queue/uploader-queue.js", 289);
this.currentUploadedByteValues = {};
           _yuitest_coverline("build/uploader-queue/uploader-queue.js", 290);
this.currentFiles = {};
           _yuitest_coverline("build/uploader-queue/uploader-queue.js", 291);
this.totalBytesUploaded = 0;
           
           _yuitest_coverline("build/uploader-queue/uploader-queue.js", 293);
this._currentState = UploaderQueue.UPLOADING;

           _yuitest_coverline("build/uploader-queue/uploader-queue.js", 295);
while (this.numberOfUploads < this.get("simUploads") && this.queuedFiles.length > 0) {
                _yuitest_coverline("build/uploader-queue/uploader-queue.js", 296);
this._startNextFile();
           }
        },

       /**
        * Pauses the upload process. The ongoing file uploads
        * will complete after this method is called, but no
        * new ones will be launched.
        * 
        * @method pauseUpload
        */
        pauseUpload: function () {
            _yuitest_coverfunc("build/uploader-queue/uploader-queue.js", "pauseUpload", 307);
_yuitest_coverline("build/uploader-queue/uploader-queue.js", 308);
this._currentState = UploaderQueue.STOPPED;
        },

       /**
        * Restarts a paused upload process.
        * 
        * @method restartUpload
        */
        restartUpload: function () {
            _yuitest_coverfunc("build/uploader-queue/uploader-queue.js", "restartUpload", 316);
_yuitest_coverline("build/uploader-queue/uploader-queue.js", 317);
this._currentState = UploaderQueue.UPLOADING;
            _yuitest_coverline("build/uploader-queue/uploader-queue.js", 318);
while (this.numberOfUploads < this.get("simUploads")) {
               _yuitest_coverline("build/uploader-queue/uploader-queue.js", 319);
this._startNextFile();
            }
        },

       /**
        * If a particular file is stuck in an ongoing upload without
        * any progress events, this method allows to force its reupload
        * by cancelling its upload and immediately relaunching it.
        * 
        * @method forceReupload
        * @param file {Y.File} The file to force reupload on.
        */
        forceReupload : function (file) {
            _yuitest_coverfunc("build/uploader-queue/uploader-queue.js", "forceReupload", 331);
_yuitest_coverline("build/uploader-queue/uploader-queue.js", 332);
var id = file.get("id");
            _yuitest_coverline("build/uploader-queue/uploader-queue.js", 333);
if (this.currentFiles.hasOwnProperty(id)) {
              _yuitest_coverline("build/uploader-queue/uploader-queue.js", 334);
file.cancelUpload();
              _yuitest_coverline("build/uploader-queue/uploader-queue.js", 335);
this._unregisterUpload(file);
              _yuitest_coverline("build/uploader-queue/uploader-queue.js", 336);
this.addToQueueTop(file);
              _yuitest_coverline("build/uploader-queue/uploader-queue.js", 337);
this._startNextFile();
            }
        },

       /**
        * Add a new file to the top of the queue (the upload will be
        * launched as soon as the current number of uploading files
        * drops below the maximum permissible value).
        * 
        * @method addToQueueTop
        * @param file {Y.File} The file to add to the top of the queue.
        */
        addToQueueTop: function (file) {
            _yuitest_coverfunc("build/uploader-queue/uploader-queue.js", "addToQueueTop", 349);
_yuitest_coverline("build/uploader-queue/uploader-queue.js", 350);
this.queuedFiles.unshift(file);
        },

       /**
        * Add a new file to the bottom of the queue (the upload will be
        * launched after all the other queued files are uploaded.)
        * 
        * @method addToQueueBottom
        * @param file {Y.File} The file to add to the bottom of the queue.
        */
        addToQueueBottom: function (file) {
            _yuitest_coverfunc("build/uploader-queue/uploader-queue.js", "addToQueueBottom", 360);
_yuitest_coverline("build/uploader-queue/uploader-queue.js", 361);
this.queuedFiles.push(file);
        },

       /**
        * Cancels a specific file's upload. If no argument is passed,
        * all ongoing uploads are cancelled and the upload process is
        * stopped.
        * 
        * @method cancelUpload
        * @param file {Y.File} An optional parameter - the file whose upload
        * should be cancelled.
        */
        cancelUpload: function (file) {

          _yuitest_coverfunc("build/uploader-queue/uploader-queue.js", "cancelUpload", 373);
_yuitest_coverline("build/uploader-queue/uploader-queue.js", 375);
if (file) {
            _yuitest_coverline("build/uploader-queue/uploader-queue.js", 376);
var id = file.get("id");
            _yuitest_coverline("build/uploader-queue/uploader-queue.js", 377);
if (this.currentFiles[id]) {
              _yuitest_coverline("build/uploader-queue/uploader-queue.js", 378);
this.currentFiles[id].cancelUpload();
              _yuitest_coverline("build/uploader-queue/uploader-queue.js", 379);
this._unregisterUpload(this.currentFiles[id]);
              _yuitest_coverline("build/uploader-queue/uploader-queue.js", 380);
if (this._currentState === UploaderQueue.UPLOADING) {
                _yuitest_coverline("build/uploader-queue/uploader-queue.js", 381);
this._startNextFile();
              }
            }
            else {
              _yuitest_coverline("build/uploader-queue/uploader-queue.js", 385);
for (var i = 0, len = this.queuedFiles.length; i < len; i++) {
                _yuitest_coverline("build/uploader-queue/uploader-queue.js", 386);
if (this.queuedFiles[i].get("id") === id) {
                  _yuitest_coverline("build/uploader-queue/uploader-queue.js", 387);
this.queuedFiles.splice(i, 1);
                  _yuitest_coverline("build/uploader-queue/uploader-queue.js", 388);
break;
                }
              }
            }
          }
          else {
            _yuitest_coverline("build/uploader-queue/uploader-queue.js", 394);
for (var fid in this.currentFiles) {
              _yuitest_coverline("build/uploader-queue/uploader-queue.js", 395);
this.currentFiles[fid].cancelUpload();
              _yuitest_coverline("build/uploader-queue/uploader-queue.js", 396);
this._unregisterUpload(this.currentFiles[fid]);
            }

            _yuitest_coverline("build/uploader-queue/uploader-queue.js", 399);
this.currentUploadedByteValues = {};
            _yuitest_coverline("build/uploader-queue/uploader-queue.js", 400);
this.currentFiles = {};
            _yuitest_coverline("build/uploader-queue/uploader-queue.js", 401);
this.totalBytesUploaded = 0;
            _yuitest_coverline("build/uploader-queue/uploader-queue.js", 402);
this.fire("alluploadscancelled");
            _yuitest_coverline("build/uploader-queue/uploader-queue.js", 403);
this._currentState = UploaderQueue.STOPPED;
          }
        }
    }, 

    {
      /** 
       * Static constant for the value of the `errorAction` attribute:
       * prescribes the queue to continue uploading files in case of 
       * an error.
       * @property CONTINUE
       * @readOnly
       * @type {String}
       * @static
       */
        CONTINUE: "continue",

      /** 
       * Static constant for the value of the `errorAction` attribute:
       * prescribes the queue to stop uploading files in case of 
       * an error.
       * @property STOP
       * @readOnly
       * @type {String}
       * @static
       */
        STOP: "stop",

      /** 
       * Static constant for the value of the `errorAction` attribute:
       * prescribes the queue to restart a file upload immediately in case of 
       * an error.
       * @property RESTART_ASAP
       * @readOnly
       * @type {String}
       * @static
       */
        RESTART_ASAP: "restartasap",

      /** 
       * Static constant for the value of the `errorAction` attribute:
       * prescribes the queue to restart an errored out file upload after 
       * other files have finished uploading.
       * @property RESTART_AFTER
       * @readOnly
       * @type {String}
       * @static
       */
        RESTART_AFTER: "restartafter",

      /** 
       * Static constant for the value of the `_currentState` property:
       * implies that the queue is currently not uploading files.
       * @property STOPPED
       * @readOnly
       * @type {String}
       * @static
       */
        STOPPED: "stopped",

      /** 
       * Static constant for the value of the `_currentState` property:
       * implies that the queue is currently uploading files.
       * @property UPLOADING
       * @readOnly
       * @type {String}
       * @static
       */
        UPLOADING: "uploading",

       /**
        * The identity of the class.
        *
        * @property NAME
        * @type String
        * @default 'uploaderqueue'
        * @readOnly
        * @protected
        * @static
        */
        NAME: 'uploaderqueue',

       /**
        * Static property used to define the default attribute configuration of
        * the class.
        *
        * @property ATTRS
        * @type {Object}
        * @protected
        * @static
        */
        ATTRS: {
       
          /**
           * Maximum number of simultaneous uploads; must be in the
           * range between 1 and 5. The value of `2` is default. It
           * is recommended that this value does not exceed 3.
           * @property simUploads
           * @type Number
           * @default 2
           */
           simUploads: {
               value: 2,
               validator: function (val, name) {
                   _yuitest_coverfunc("build/uploader-queue/uploader-queue.js", "validator", 506);
_yuitest_coverline("build/uploader-queue/uploader-queue.js", 507);
return (val >= 1 && val <= 5);
               }
           },
   
          /**
           * The action to take in case of error. The valid values for this attribute are: 
           * `Y.Uploader.Queue.CONTINUE` (the upload process should continue on other files, 
           * ignoring the error), `Y.Uploader.Queue.STOP` (the upload process 
           * should stop completely), `Y.Uploader.Queue.RESTART_ASAP` (the upload 
           * should restart immediately on the errored out file and continue as planned), or
           * Y.Uploader.Queue.RESTART_AFTER (the upload of the errored out file should restart
           * after all other files have uploaded)
           * @property errorAction
           * @type String
           * @default Y.Uploader.Queue.CONTINUE
           */
           errorAction: {
               value: "continue",
               validator: function (val, name) {
                   _yuitest_coverfunc("build/uploader-queue/uploader-queue.js", "validator", 525);
_yuitest_coverline("build/uploader-queue/uploader-queue.js", 526);
return (val === UploaderQueue.CONTINUE || val === UploaderQueue.STOP || val === UploaderQueue.RESTART_ASAP || val === UploaderQueue.RESTART_AFTER);
               }
           },

          /**
           * The total number of bytes that has been uploaded.
           * @property bytesUploaded
           * @type Number
           */   
           bytesUploaded: {
               readOnly: true,
               value: 0
           },
   
          /**
           * The total number of bytes in the queue.
           * @property bytesTotal
           * @type Number
           */ 
           bytesTotal: {
               readOnly: true,
               value: 0
           },

          /**
           * The queue file list. This file list should only be modified
           * before the upload has been started; modifying it after starting
           * the upload has no effect, and `addToQueueTop` or `addToQueueBottom` methods
           * should be used instead.
           * @property fileList
           * @type Number
           */    
           fileList: {
               value: [],
               lazyAdd: false,
               setter: function (val) {
                   _yuitest_coverfunc("build/uploader-queue/uploader-queue.js", "setter", 561);
_yuitest_coverline("build/uploader-queue/uploader-queue.js", 562);
var newValue = val;
                   _yuitest_coverline("build/uploader-queue/uploader-queue.js", 563);
Y.Array.each(newValue, function (value) {
                       _yuitest_coverfunc("build/uploader-queue/uploader-queue.js", "(anonymous 4)", 563);
_yuitest_coverline("build/uploader-queue/uploader-queue.js", 564);
this.totalBytes += value.get("size");
                   }, this);
    
                   _yuitest_coverline("build/uploader-queue/uploader-queue.js", 567);
return val;
               }   
           },

          /**
           * A String specifying what should be the POST field name for the file
           * content in the upload request.
           *
           * @attribute fileFieldName
           * @type {String}
           * @default Filedata
           */   
           fileFieldName: {
              value: "Filedata"
           },

          /**
           * The URL to POST the file upload requests to.
           *
           * @attribute uploadURL
           * @type {String}
           * @default ""
           */  
           uploadURL: {
             value: ""
           },

          /**
           * Additional HTTP headers that should be included
           * in the upload request. Due to Flash Player security
           * restrictions, this attribute is only honored in the
           * HTML5 Uploader.
           *
           * @attribute uploadHeaders
           * @type {Object}
           * @default {}
           */  
           uploadHeaders: {
             value: {}
           },

          /**
           * A Boolean that specifies whether the file should be
           * uploaded with the appropriate user credentials for the
           * domain. Due to Flash Player security restrictions, this
           * attribute is only honored in the HTML5 Uploader.
           *
           * @attribute withCredentials
           * @type {Boolean}
           * @default true
           */  
           withCredentials: {
             value: true
           },


          /**
           * An object, keyed by `fileId`, containing sets of key-value pairs
           * that should be passed as POST variables along with each corresponding
           * file.
           *
           * @attribute perFileParameters
           * @type {Object}
           * @default {}
           */   
           perFileParameters: {
             value: {}
           },

          /**
           * The number of times to try re-uploading a file that failed to upload before
           * cancelling its upload.
           *
           * @attribute retryCount
           * @type {Number}
           * @default 3
           */ 
           retryCount: {
             value: 3
           }

        }
    });


    _yuitest_coverline("build/uploader-queue/uploader-queue.js", 652);
Y.namespace('Uploader');
    _yuitest_coverline("build/uploader-queue/uploader-queue.js", 653);
Y.Uploader.Queue = UploaderQueue;

}, '3.7.3', {"requires": ["base"]});
