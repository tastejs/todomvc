/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
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
    var Lang = Y.Lang,
        Bind = Y.bind,
        Win = Y.config.win;

    var FileHTML5 = function(o) {
        
        var file = null;

        if (FileHTML5.isValidFile(o)) {
            file = o;
        }
        else if (FileHTML5.isValidFile(o.file)) {
            file = o.file;
        }
        else {
            file = false;
        }

        FileHTML5.superclass.constructor.apply(this, arguments);      
        
        if (file && FileHTML5.canUpload()) {
           if (!this.get("file")) {
               this._set("file", file);
           }

           if (!this.get("name")) {
           this._set("name", file.name || file.fileName);
           }

           if (this.get("size") != (file.size || file.fileSize)) {
           this._set("size", file.size || file.fileSize);
           }

           if (!this.get("type")) {
           this._set("type", file.type);
           }

           if (file.hasOwnProperty("lastModifiedDate") && !this.get("dateModified")) {
               this._set("dateModified", file.lastModifiedDate);
           }
        }
    };


    Y.extend(FileHTML5, Y.Base, {

       /**
        * Construction logic executed during FileHTML5 instantiation.
        *
        * @method initializer
        * @protected
        */
        initializer : function (cfg) {
            if (!this.get("id")) {
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
            var xhr = this.get("xhr");

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
                   this.fire("uploadprogress", {originEvent: event,
                                               bytesLoaded: event.loaded, 
                                               bytesTotal: this.get("size"), 
                                               percentLoaded: Math.min(100, Math.round(10000*event.loaded/this.get("size"))/100)
                                               });
                   this._set("bytesUploaded", event.loaded);
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

                   if (xhr.status >= 200 && xhr.status <= 299) {
                        this.fire("uploadcomplete", {originEvent: event,
                                                     data: event.target.responseText});
                        var xhrupload = xhr.upload,
                            boundEventHandler = this.get("boundEventHandler");
    
                        xhrupload.removeEventListener ("progress", boundEventHandler);
                        xhrupload.removeEventListener ("error", boundEventHandler);
                        xhrupload.removeEventListener ("abort", boundEventHandler);
                        xhr.removeEventListener ("load", boundEventHandler); 
                        xhr.removeEventListener ("error", boundEventHandler);
                        xhr.removeEventListener ("readystatechange", boundEventHandler);
                        
                        this._set("xhr", null);
                   }
                   else {
                        this.fire("uploaderror", {originEvent: event,
                                                  status: xhr.status,
                                                  statusText: xhr.statusText,
                                                  source: "http"});
                   }                   
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
                   this.fire("uploaderror", {originEvent: event,
                                                  status: xhr.status,
                                                  statusText: xhr.statusText,
                                                  source: "io"});
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
                   this.fire("uploadcancel", {originEvent: event});
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
                   this.fire("readystatechange", {readyState: event.target.readyState,
                                                  originEvent: event});
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
         
            this._set("bytesUploaded", 0);
            
            this._set("xhr", new XMLHttpRequest());
            this._set("boundEventHandler", Bind(this._uploadEventHandler, this));
                         
            var uploadData = new FormData(),
                fileField = fileFieldName || "Filedata",
                xhr = this.get("xhr"),
                xhrupload = this.get("xhr").upload,
                boundEventHandler = this.get("boundEventHandler");

            Y.each(parameters, function (value, key) {uploadData.append(key, value);});
            uploadData.append(fileField, this.get("file"));




            xhr.addEventListener ("loadstart", boundEventHandler, false);
            xhrupload.addEventListener ("progress", boundEventHandler, false);
            xhr.addEventListener ("load", boundEventHandler, false);
            xhr.addEventListener ("error", boundEventHandler, false);
            xhrupload.addEventListener ("error", boundEventHandler, false);
            xhrupload.addEventListener ("abort", boundEventHandler, false);
            xhr.addEventListener ("abort", boundEventHandler, false);
            xhr.addEventListener ("loadend", boundEventHandler, false); 
            xhr.addEventListener ("readystatechange", boundEventHandler, false);

            xhr.open("POST", url, true);

            xhr.withCredentials = this.get("xhrWithCredentials");

            Y.each(this.get("xhrHeaders"), function (value, key) {
                 xhr.setRequestHeader(key, value);
            });

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
             this.fire("uploadstart", {xhr: xhr});

        },

       /**
        * Cancels the upload of a specific file, if currently in progress.
        *
        * @method cancelUpload
        */    
        cancelUpload: function () {
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
            return (Win && Win.FormData && Win.XMLHttpRequest);
        }
    });

    Y.FileHTML5 = FileHTML5;

}, '3.7.3', {"requires": ["base"]});
