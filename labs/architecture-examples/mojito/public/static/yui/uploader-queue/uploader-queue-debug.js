/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('uploader-queue', function (Y, NAME) {


    /**
     * The class manages a queue of files that should be uploaded to the server.
     * It initializes the required number of uploads, tracks them as they progress,
     * and automatically advances to the next upload when a preceding one has completed.
     * @module uploader-queue
     */     

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
    var UploaderQueue = function(o) {
        this.queuedFiles = [];
        this.uploadRetries = {};
        this.numberOfUploads = 0;
        this.currentUploadedByteValues = {};
        this.currentFiles = {};
        this.totalBytesUploaded = 0;
        this.totalBytes = 0;      
  
        UploaderQueue.superclass.constructor.apply(this, arguments);
    };


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
           var updatedEvent = event;
           updatedEvent.file = event.target;
           updatedEvent.originEvent = event;
           
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
           var errorAction = this.get("errorAction");
           var updatedEvent = event;
           updatedEvent.file = event.target;
           updatedEvent.originEvent = event;

           this.numberOfUploads-=1;
           delete this.currentFiles[event.target.get("id")];
           this._detachFileEvents(event.target);

           event.target.cancelUpload();

           if (errorAction === UploaderQueue.STOP) {
             this.pauseUpload();
           }

           else if (errorAction === UploaderQueue.RESTART_ASAP) {
            var fileid = event.target.get("id"),
                retries = this.uploadRetries[fileid] || 0;
            if (retries < this.get("retryCount")) {
               this.uploadRetries[fileid] = retries + 1;
               this.addToQueueTop(event.target);
            }
               this._startNextFile();
           }
           else if (errorAction === UploaderQueue.RESTART_AFTER) {
            var fileid = event.target.get("id"),
                retries = this.uploadRetries[fileid] || 0;
            if (retries < this.get("retryCount")) {
               this.uploadRetries[fileid] = retries + 1;
               this.addToQueueBottom(event.target);
            }
              this._startNextFile();
           }

           this.fire("uploaderror", updatedEvent);  
        },

       /**
        * Launches the upload of the next file in the queue.
        * 
        * @method _startNextFile
        * @private
        */
        _startNextFile : function () {
          if (this.queuedFiles.length > 0) {
            var currentFile = this.queuedFiles.shift(),
               fileId = currentFile.get("id"),
               parameters = this.get("perFileParameters"),
               fileParameters = parameters.hasOwnProperty(fileId) ? parameters[fileId] : parameters;

               this.currentUploadedByteValues[fileId] = 0;

               currentFile.on("uploadstart", this._uploadStartHandler, this);
               currentFile.on("uploadprogress", this._uploadProgressHandler, this);
               currentFile.on("uploadcomplete", this._uploadCompleteHandler, this);
               currentFile.on("uploaderror", this._uploadErrorHandler, this);
               currentFile.on("uploadcancel", this._uploadCancelHandler, this);

               currentFile.set("xhrHeaders", this.get("uploadHeaders"));
               currentFile.set("xhrWithCredentials", this.get("withCredentials"));

               currentFile.startUpload(this.get("uploadURL"), fileParameters, this.get("fileFieldName"));

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
          this.numberOfUploads += 1;
          this.currentFiles[file.get("id")] = file;
        },

       /**
        * Unregisters a new upload process.
        * 
        * @method _unregisterUpload
        * @private
        */
        _unregisterUpload : function (file) {
          if (this.numberOfUploads > 0) {
            this.numberOfUploads -=1;
          }
          delete this.currentFiles[file.get("id")];
          delete this.uploadRetries[file.get("id")];

          this._detachFileEvents(file);
        },

        _detachFileEvents : function (file) {
          file.detach("uploadstart", this._uploadStartHandler);
          file.detach("uploadprogress", this._uploadProgressHandler);
          file.detach("uploadcomplete", this._uploadCompleteHandler);
          file.detach("uploaderror", this._uploadErrorHandler);
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

           this._unregisterUpload(event.target);

           this.totalBytesUploaded += event.target.get("size");
           delete this.currentUploadedByteValues[event.target.get("id")];


           if (this.queuedFiles.length > 0 && this._currentState === UploaderQueue.UPLOADING) {
               this._startNextFile();
           }
           
           var updatedEvent = event;
           updatedEvent.file = event.target;
           updatedEvent.originEvent = event;

           var uploadedTotal = this.totalBytesUploaded;

           Y.each(this.currentUploadedByteValues, function (value) {
              uploadedTotal += value; 
           });
           
           var percentLoaded = Math.min(100, Math.round(10000*uploadedTotal/this.totalBytes) / 100); 
           
           this.fire("totaluploadprogress", {bytesLoaded: uploadedTotal, 
                                             bytesTotal: this.totalBytes,
                                             percentLoaded: percentLoaded});

           this.fire("uploadcomplete", updatedEvent);

           if (this.queuedFiles.length === 0 && this.numberOfUploads <= 0) {
               this.fire("alluploadscomplete");
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
          
          var updatedEvent = event;
          updatedEvent.originEvent = event;
          updatedEvent.file = event.target;

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
          
          this.currentUploadedByteValues[event.target.get("id")] = event.bytesLoaded;
          
          var updatedEvent = event;
          updatedEvent.originEvent = event;
          updatedEvent.file = event.target;

          this.fire("uploadprogress", updatedEvent);
          
          var uploadedTotal = this.totalBytesUploaded;

          Y.each(this.currentUploadedByteValues, function (value) {
             uploadedTotal += value; 
          });
          
          var percentLoaded = Math.min(100, Math.round(10000*uploadedTotal/this.totalBytes) / 100);

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
           
           this.queuedFiles = this.get("fileList").slice(0);
           this.numberOfUploads = 0;
           this.currentUploadedByteValues = {};
           this.currentFiles = {};
           this.totalBytesUploaded = 0;
           
           this._currentState = UploaderQueue.UPLOADING;

           while (this.numberOfUploads < this.get("simUploads") && this.queuedFiles.length > 0) {
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
            this._currentState = UploaderQueue.STOPPED;
        },

       /**
        * Restarts a paused upload process.
        * 
        * @method restartUpload
        */
        restartUpload: function () {
            this._currentState = UploaderQueue.UPLOADING;
            while (this.numberOfUploads < this.get("simUploads")) {
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
            var id = file.get("id");
            if (this.currentFiles.hasOwnProperty(id)) {
              file.cancelUpload();
              this._unregisterUpload(file);
              this.addToQueueTop(file);
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

          if (file) {
            var id = file.get("id");
            if (this.currentFiles[id]) {
              this.currentFiles[id].cancelUpload();
              this._unregisterUpload(this.currentFiles[id]);
              if (this._currentState === UploaderQueue.UPLOADING) {
                this._startNextFile();
              }
            }
            else {
              for (var i = 0, len = this.queuedFiles.length; i < len; i++) {
                if (this.queuedFiles[i].get("id") === id) {
                  this.queuedFiles.splice(i, 1);
                  break;
                }
              }
            }
          }
          else {
            for (var fid in this.currentFiles) {
              this.currentFiles[fid].cancelUpload();
              this._unregisterUpload(this.currentFiles[fid]);
            }

            this.currentUploadedByteValues = {};
            this.currentFiles = {};
            this.totalBytesUploaded = 0;
            this.fire("alluploadscancelled");
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
                   var newValue = val;
                   Y.Array.each(newValue, function (value) {
                       this.totalBytes += value.get("size");
                   }, this);
    
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


    Y.namespace('Uploader');
    Y.Uploader.Queue = UploaderQueue;

}, '3.7.3', {"requires": ["base"]});
