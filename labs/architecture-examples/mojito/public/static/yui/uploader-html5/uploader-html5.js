/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('uploader-html5', function (Y, NAME) {


    /**
     * This module provides a UI for file selection and multiple file upload capability using
     * HTML5 XMLHTTPRequest Level 2 as a transport engine.
     * The supported features include: automatic upload queue management, upload progress
     * tracking, drag-and-drop support, server response retrieval and error reporting.
     *
     * @module uploader-html5
     */     

// Shorthands for the external modules
var  substitute  = Y.substitute,
     UploaderQueue = Y.Uploader.Queue;

    /**
     * This module provides a UI for file selection and multiple file upload capability using
     * HTML5 XMLHTTPRequest Level 2 as a transport engine.
     * @class UploaderHTML5
     * @extends Widget
     * @constructor
     */

function UploaderHTML5(config) {
  UploaderHTML5.superclass.constructor.apply ( this, arguments );
}



Y.UploaderHTML5 = Y.extend( UploaderHTML5, Y.Widget, {

   /**
    * Stored reference to the instance of the file input field used to 
    * initiate the file selection dialog.
    *
    * @property _fileInputField
    * @type {Node}
    * @protected
    */
    _fileInputField: null,

   /**
    * Stored reference to the click event binding of the `Select Files`
    * button.
    *
    * @property _buttonBinding
    * @type {EventHandle}
    * @protected
    */
    _buttonBinding: null,

   /**
    * Stored reference to the instance of Uploader.Queue used to manage
    * the upload process. This is a read-only property that only exists
    * during an active upload process. Only one queue can be active at
    * a time; if an upload start is attempted while a queue is active,
    * it will be ignored.
    *
    * @property queue
    * @type {Y.Uploader.Queue}
    */
    queue: null,

    // Y.UploaderHTML5 prototype

    /**
     * Construction logic executed during UploaderHTML5 instantiation.
     *
     * @method initializer
     * @protected
     */
    initializer : function () {

    this._fileInputField = null;
    this.queue = null;
    this._buttonBinding = null;
    this._fileList = [];

  // Publish available events

   /**
    * Signals that files have been selected. 
    *
    * @event fileselect
    * @param event {Event} The event object for the `fileselect` with the
    *                      following payload:
    *  <dl>
    *      <dt>fileList</dt>
    *          <dd>An `Array` of files selected by the user, encapsulated
    *              in Y.FileHTML5 objects.</dd>
    *  </dl>
    */
    this.publish("fileselect");

   /**
    * Signals that an upload of multiple files has been started. 
    *
    * @event uploadstart
    * @param event {Event} The event object for the `uploadstart`.
    */
    this.publish("uploadstart");

   /**
    * Signals that an upload of a specific file has started. 
    *
    * @event fileuploadstart
    * @param event {Event} The event object for the `fileuploadstart` with the
    *                      following payload:
    *  <dl>
    *      <dt>file</dt>
    *          <dd>A reference to the Y.File that dispatched the event.</dd>
    *      <dt>originEvent</dt>
    *          <dd>The original event dispatched by Y.File.</dd>
    *  </dl>
    */
    this.publish("fileuploadstart");

   /**
    * Reports on upload progress of a specific file. 
    *
    * @event uploadprogress
    * @param event {Event} The event object for the `uploadprogress` with the
    *                      following payload:
    *  <dl>
    *      <dt>file</dt>
    *          <dd>The pointer to the instance of `Y.File` that dispatched the event.</dd>
    *      <dt>bytesLoaded</dt>
    *          <dd>The number of bytes of the file that has been uploaded</dd>
    *      <dt>bytesTotal</dt>
    *          <dd>The total number of bytes in the file</dd>
    *      <dt>percentLoaded</dt>
    *          <dd>The fraction of the file that has been uploaded, out of 100</dd>
    *      <dt>originEvent</dt>
    *          <dd>The original event dispatched by the HTML5 uploader</dd>
    *  </dl>
    */
    this.publish("uploadprogress");

   /**
    * Reports on the total upload progress of the file list. 
    *
    * @event totaluploadprogress
    * @param event {Event} The event object for the `totaluploadprogress` with the
    *                      following payload:
    *  <dl>
    *      <dt>bytesLoaded</dt>
    *          <dd>The number of bytes of the file list that has been uploaded</dd>
    *      <dt>bytesTotal</dt>
    *          <dd>The total number of bytes in the file list</dd>
    *      <dt>percentLoaded</dt>
    *          <dd>The fraction of the file list that has been uploaded, out of 100</dd>
    *  </dl>
    */
    this.publish("totaluploadprogress");

   /**
    * Signals that a single file upload has been completed. 
    *
    * @event uploadcomplete
    * @param event {Event} The event object for the `uploadcomplete` with the
    *                      following payload:
    *  <dl>
    *      <dt>file</dt>
    *          <dd>The pointer to the instance of `Y.File` whose upload has been completed.</dd>
    *      <dt>originEvent</dt>
    *          <dd>The original event fired by the SWF Uploader</dd>
    *      <dt>data</dt>
    *          <dd>Data returned by the server.</dd>
    *  </dl>
    */
    this.publish("uploadcomplete");

   /**
    * Signals that the upload process of the entire file list has been completed. 
    *
    * @event alluploadscomplete
    * @param event {Event} The event object for the `alluploadscomplete`.
    */
    this.publish("alluploadscomplete");

   /**
    * Signals that a error has occurred in a specific file's upload process. 
    *
    * @event uploaderror
    * @param event {Event} The event object for the `uploaderror` with the
    *                      following payload:
    *  <dl>
    *      <dt>originEvent</dt>
    *          <dd>The original error event fired by the HTML5 Uploader. </dd>
    *      <dt>file</dt>
    *          <dd>The pointer at the instance of Y.File that returned the error.</dd>    
    *      <dt>status</dt>
    *          <dd>The status reported by the XMLHttpRequest object.</dd>
    *      <dt>statusText</dt>
    *          <dd>The statusText reported by the XMLHttpRequest object.</dd>       
    *  </dl>
    */
    this.publish("uploaderror");

   /**
    * Signals that a dragged object has entered into the uploader's associated drag-and-drop area. 
    *
    * @event dragenter
    * @param event {Event} The event object for the `dragenter`.
    */
    this.publish("dragenter");

   /**
    * Signals that an object has been dragged over the uploader's associated drag-and-drop area. 
    *
    * @event dragover
    * @param event {Event} The event object for the `dragover`.
    */
    this.publish("dragover");

   /**
    * Signals that an object has been dragged off of the uploader's associated drag-and-drop area. 
    *
    * @event dragleave
    * @param event {Event} The event object for the `dragleave`.
    */
    this.publish("dragleave");

   /**
    * Signals that an object has been dropped over the uploader's associated drag-and-drop area. 
    *
    * @event drop
    * @param event {Event} The event object for the `drop`.
    */
    this.publish("drop");
                
    },

    /**
     * Create the DOM structure for the UploaderHTML5.
     * UploaderHTML5's DOM structure consists of a "Select Files" button that can 
     * be replaced by the developer's widget of choice; and a hidden file input field
     * that is used to instantiate the File Select dialog.
     *
     * @method renderUI
     * @protected
     */
    renderUI : function () {
       var boundingBox = this.get("boundingBox"),
           contentBox = this.get('contentBox'),
           selButton = this.get("selectFilesButton");

       selButton.setStyles({width:"100%", height:"100%"});
       contentBox.append(selButton);
       this._fileInputField = Y.Node.create(UploaderHTML5.HTML5FILEFIELD_TEMPLATE);
       contentBox.append(this._fileInputField);
    },

    /**
     * Binds to the UploaderHTML5 UI and subscribes to the necessary events.
     *
     * @method bindUI
     * @protected
     */
    bindUI : function () {

        this._bindSelectButton();
        this._setMultipleFiles();
        this._setFileFilters();
        this._bindDropArea();
        this._triggerEnabled();

        this.after("multipleFilesChange", this._setMultipleFiles, this);
        this.after("fileFiltersChange", this._setFileFilters, this);
        this.after("enabledChange", this._triggerEnabled, this);
        this.after("selectFilesButtonChange", this._bindSelectButton, this);
        this.after("dragAndDropAreaChange", this._bindDropArea, this);
        this.after("tabIndexChange", function (ev) {this.get("selectFilesButton").set("tabIndex", this.get("tabIndex"));}, this);
        this._fileInputField.on("change", this._updateFileList, this);

        this.get("selectFilesButton").set("tabIndex", this.get("tabIndex"));
    },


    /**
     * Recreates the file field to null out the previous list of files and
     * thus allow for an identical file list selection.
     * 
     * @method _rebindFileField
     * @protected
     */
    _rebindFileField : function () {
        this._fileInputField.remove(true);
        this._fileInputField = Y.Node.create(UploaderHTML5.HTML5FILEFIELD_TEMPLATE);
        this.get("contentBox").append(this._fileInputField);
        this._fileInputField.on("change", this._updateFileList, this);
        this._setMultipleFiles();
        this._setFileFilters();
    },


    /**
     * Binds the specified drop area's drag and drop events to the
     * uploader's custom handler.
     * 
     * @method _bindDropArea
     * @protected
     */
    _bindDropArea : function (event) {
        var ev = event || {prevVal: null};

        if (ev.prevVal !== null) {
            ev.prevVal.detach('drop', this._ddEventHandler);
            ev.prevVal.detach('dragenter', this._ddEventHandler);
            ev.prevVal.detach('dragover', this._ddEventHandler);
            ev.prevVal.detach('dragleave', this._ddEventHandler);
        }

        var ddArea = this.get("dragAndDropArea");

        if (ddArea !== null) {
            ddArea.on('drop', this._ddEventHandler, this);
            ddArea.on('dragenter', this._ddEventHandler, this);
            ddArea.on('dragover', this._ddEventHandler, this);
            ddArea.on('dragleave', this._ddEventHandler, this);
        }
    },

    /**
     * Binds the instantiation of the file select dialog to the current file select
     * control.
     * 
     * @method _bindSelectButton
     * @protected
     */
    _bindSelectButton : function () {
       this._buttonBinding = this.get("selectFilesButton").on("click", this.openFileSelectDialog, this);
    },

    /**
     * Handles the drag and drop events from the uploader's specified drop
     * area.
     * 
     * @method _ddEventHandler
     * @protected
     */
    _ddEventHandler : function (event) {

       event.stopPropagation();
       event.preventDefault();  
                          
       switch (event.type) {
                case "dragenter":
                  this.fire("dragenter"); 
                break;
                case "dragover":
                  this.fire("dragover");
                break;
                case "dragleave": 
                  this.fire("dragleave");
                break;
                case "drop":

                   var newfiles = event._event.dataTransfer.files,
                       parsedFiles = [],
                       filterFunc = this.get("fileFilterFunction");
              
                   if (filterFunc) {
                        Y.each(newfiles, function (value) {
                          var newfile = new Y.FileHTML5(value);
                          if (filterFunc(newfile)) {
                              parsedFiles.push(newfile);
                          }
                        });
                   }
                   else {
                        Y.each(newfiles, function (value) {
                              parsedFiles.push(new Y.FileHTML5(value));
                        });
                   }

                   if (parsedFiles.length > 0) {
                   var oldfiles = this.get("fileList");
                   this.set("fileList", 
                            this.get("appendNewFiles") ? oldfiles.concat(parsedFiles) : parsedFiles);
                   this.fire("fileselect", {fileList: parsedFiles});
                   }

                   this.fire("drop");
                break;
       }
    },

    /**
     * Adds or removes a specified state CSS class to the underlying uploader button. 
     *
     * @method _setButtonClass
     * @protected
     * @param state {String} The name of the state enumerated in `buttonClassNames` attribute
     * from which to derive the needed class name.
     * @param add {Boolean} A Boolean indicating whether to add or remove the class.
     */
    _setButtonClass : function (state, add) {
        if (add) {
            this.get("selectFilesButton").addClass(this.get("buttonClassNames")[state]);
        }
        else {
            this.get("selectFilesButton").removeClass(this.get("buttonClassNames")[state]);
        }
    },

    /**
     * Syncs the state of the `multipleFiles` attribute between this class
     * and the file input field.
     * 
     * @method _setMultipleFiles
     * @protected
     */
    _setMultipleFiles : function () {
            if (this.get("multipleFiles") === true) {
                this._fileInputField.set("multiple", "multiple");
            }
            else {
                this._fileInputField.set("multiple", "");
            }
    },

    /**
     * Syncs the state of the `fileFilters` attribute between this class
     * and the file input field.
     * 
     * @method _setFileFilters
     * @protected
     */
    _setFileFilters : function () {
            if (this.get("fileFilters").length > 0) {
                this._fileInputField.set("accept", this.get("fileFilters").join(","));
            }
            else {
                this._fileInputField.set("accept", "");
            }
    },


    /**
     * Syncs the state of the `enabled` attribute between this class
     * and the underlying button.
     * 
     * @method _triggerEnabled
     * @private
     */
    _triggerEnabled : function () {
        if (this.get("enabled") && this._buttonBinding === null) {
          this._bindSelectButton();
          this._setButtonClass("disabled", false);
          this.get("selectFilesButton").setAttribute("aria-disabled", "false");
        }
        else if (!this.get("enabled") && this._buttonBinding) {
          this._buttonBinding.detach();
          this._buttonBinding = null;
          this._setButtonClass("disabled", true);
          this.get("selectFilesButton").setAttribute("aria-disabled", "true");
        }
    },

  /**
   * Getter for the `fileList` attribute
   * 
   * @method _getFileList
   * @private
   */
    _getFileList : function (arr) {
        return this._fileList.concat();
    },

  /**
   * Setter for the `fileList` attribute
   * 
   * @method _setFileList
   * @private
   */
    _setFileList : function (val) {
        this._fileList = val.concat();
        return this._fileList.concat();
    },

    /**
     * Adjusts the content of the `fileList` based on the results of file selection
     * and the `appendNewFiles` attribute. If the `appendNewFiles` attribute is true,
     * then selected files are appended to the existing list; otherwise, the list is
     * cleared and populated with the newly selected files.
     * 
     * @method _updateFileList
     * @param ev {Event} The file selection event received from the uploader.
     * @protected
     */
    _updateFileList : function (ev) {
       var newfiles = ev.target.getDOMNode().files,
           parsedFiles = [],
           filterFunc = this.get("fileFilterFunction");

       if (filterFunc) {
          Y.each(newfiles, function (value) {
            var newfile = new Y.FileHTML5(value);
            if (filterFunc(newfile)) {
                parsedFiles.push(newfile);
            }
          });
       }
       else {
          Y.each(newfiles, function (value) {
                parsedFiles.push(new Y.FileHTML5(value));
          });
       }

       if (parsedFiles.length > 0) {
           var oldfiles = this.get("fileList");

           this.set("fileList", 
                    this.get("appendNewFiles") ? oldfiles.concat(parsedFiles) : parsedFiles );

           this.fire("fileselect", {fileList: parsedFiles});
       }

       this._rebindFileField();
    },


    /**
     * Handles and retransmits events fired by `Y.File` and `Y.Uploader.Queue`.
     * 
     * @method _uploadEventHandler
     * @param event The event dispatched during the upload process.
     * @protected
     */
    _uploadEventHandler : function (event) {
    
    switch (event.type) {
                case "file:uploadstart":
                   this.fire("fileuploadstart", event);
                break;
                case "file:uploadprogress":
                   this.fire("uploadprogress", event);
                break;
                case "uploaderqueue:totaluploadprogress":
                   this.fire("totaluploadprogress", event);
                break;
                case "file:uploadcomplete":
                   this.fire("uploadcomplete", event);
                break;
                case "uploaderqueue:alluploadscomplete":
                   this.queue = null;
                   this.fire("alluploadscomplete", event);
                break;
                case "file:uploaderror":
                case "uploaderqueue:uploaderror":
                   this.fire("uploaderror", event);
                break;
                case "file:uploadcancel":
                case "uploaderqueue:uploadcancel":
                   this.fire("uploadcancel", event);
                break;
    }   

    },

    /**
     * Opens the File Selection dialog by simulating a click on the file input field.
     * 
     * @method openFileSelectDialog
     */
    openFileSelectDialog : function () {
      var fileDomNode = this._fileInputField.getDOMNode();
            if (fileDomNode.click) {
                fileDomNode.click();
            }   
    },

   /**
    * Starts the upload of a specific file.
    *
    * @method upload
    * @param file {Y.File} Reference to the instance of the file to be uploaded.
    * @param url {String} The URL to upload the file to.
    * @param postVars {Object} (optional) A set of key-value pairs to send as variables along with the file upload HTTP request.
    *                          If not specified, the values from the attribute `postVarsPerFile` are used instead. 
    */
    upload : function (file, url, postvars) {
        
        var uploadURL = url || this.get("uploadURL"),
            postVars = postvars || this.get("postVarsPerFile"),
            fileId = file.get("id");

            postVars = postVars.hasOwnProperty(fileId) ? postVars[fileId] : postVars;

        if (file instanceof Y.FileHTML5) {
           
            file.on("uploadstart", this._uploadEventHandler, this);
            file.on("uploadprogress", this._uploadEventHandler, this);
            file.on("uploadcomplete", this._uploadEventHandler, this);
            file.on("uploaderror", this._uploadEventHandler, this);
            file.on("uploadcancel", this._uploadEventHandler, this);

            file.startUpload(uploadURL, postVars, this.get("fileFieldName"));
        }
    },

   /**
    * Starts the upload of all files on the file list, using an automated queue.
    *
    * @method uploadAll
    * @param url {String} The URL to upload the files to.
    * @param postVars {Object} (optional) A set of key-value pairs to send as variables along with the file upload HTTP request.
    *                          If not specified, the values from the attribute `postVarsPerFile` are used instead. 
    */
    uploadAll : function (url, postvars) {
        this.uploadThese(this.get("fileList"), url, postvars);
    },

   /**
    * Starts the upload of the files specified in the first argument, using an automated queue.
    *
    * @method uploadThese
    * @param files {Array} The list of files to upload.
    * @param url {String} The URL to upload the files to.
    * @param postVars {Object} (optional) A set of key-value pairs to send as variables along with the file upload HTTP request.
    *                          If not specified, the values from the attribute `postVarsPerFile` are used instead. 
    */
    uploadThese : function (files, url, postvars) {
       if (!this.queue) {
        var uploadURL = url || this.get("uploadURL"),
            postVars = postvars || this.get("postVarsPerFile");

           this.queue = new UploaderQueue({simUploads: this.get("simLimit"), 
                                           errorAction: this.get("errorAction"),
                                           fileFieldName: this.get("fileFieldName"),
                                           fileList: files,
                                           uploadURL: uploadURL,
                                           perFileParameters: postVars,
                                           retryCount: this.get("retryCount"),
                                           uploadHeaders: this.get("uploadHeaders"),
                                           withCredentials: this.get("withCredentials")
                                               });
           this.queue.on("uploadstart", this._uploadEventHandler, this);
           this.queue.on("uploadprogress", this._uploadEventHandler, this);
           this.queue.on("totaluploadprogress", this._uploadEventHandler, this);
           this.queue.on("uploadcomplete", this._uploadEventHandler, this);
           this.queue.on("alluploadscomplete", this._uploadEventHandler, this);
           this.queue.on("uploadcancel", this._uploadEventHandler, this);
           this.queue.on("uploaderror", this._uploadEventHandler, this);
           this.queue.startUpload();  
           
           this.fire("uploadstart"); 
       }
       else if (this.queue._currentState === UploaderQueue.UPLOADING) {
           this.queue.set("perFileParameters", this.get("postVarsPerFile"));
           Y.each(files, function (file) {
             this.queue.addToQueueBottom(file);
           }, this);
       }
    }
},

{
   /**
    * The template for the hidden file input field container. The file input field will only
    * accept clicks if its visibility is set to hidden (and will not if it's `display` value
    * is set to `none`)
    *
    * @property HTML5FILEFIELD_TEMPLATE
    * @type {String}
    * @static
    */
    HTML5FILEFIELD_TEMPLATE: "<input type='file' style='visibility:hidden; width:0px; height: 0px;'>",
  
  /**
   * The template for the "Select Files" button.
   *
   * @property SELECT_FILES_BUTTON
   * @type {String}
   * @static
   * @default "<button type='button' class='yui3-button' role='button' aria-label='{selectButtonLabel}' tabindex='{tabIndex}'>{selectButtonLabel}</button>"
   */  
    SELECT_FILES_BUTTON: "<button type='button' class='yui3-button' role='button' aria-label='{selectButtonLabel}' tabindex='{tabIndex}'>{selectButtonLabel}</button>",

    /**
    * The static property reflecting the type of uploader that `Y.Uploader`
    * aliases. The UploaderHTML5 value is `"html5"`.
    * 
    * @property TYPE
    * @type {String}
    * @static
    */
    TYPE: "html5",

    /**
     * The identity of the widget.
     *
     * @property NAME
     * @type String
     * @default 'uploader'
     * @readOnly
     * @protected
     * @static
     */
    NAME: "uploader",

    /**
     * Static property used to define the default attribute configuration of
     * the Widget.
     *
     * @property ATTRS
     * @type {Object}
     * @protected
     * @static
     */
    ATTRS: {

        /**
         * A Boolean indicating whether newly selected files should be appended 
         * to the existing file list, or whether they should replace it.
         *
         * @attribute appendNewFiles
         * @type {Boolean}
         * @default true
         */
        appendNewFiles : {
            value: true
        },

        /**
         * The names of CSS classes that correspond to different button states
         * of the "Select Files" control. These classes are assigned to the 
         * "Select Files" control based on the configuration of the uploader.
         * Currently, the only class name used is that corresponding to the 
         * `disabled` state of the uploader. Other button states should be managed
         * directly via CSS selectors.
         * <ul>
         *   <li> <strong>`disabled`</strong>: the class corresponding to the disabled state
         *      of the "Select Files" button.</li>
         * </ul>
         * @attribute buttonClassNames
         * @type {Object}
         * @default {
         *            disabled: "yui3-button-disabled"
         *          }
         */
        buttonClassNames: {
            value: {
                "hover": "yui3-button-hover",
                "active": "yui3-button-active",
                "disabled": "yui3-button-disabled",
                "focus": "yui3-button-selected"
            }
        },

        /**
         * The node that serves as the drop target for files.
         *
         * @attribute dragAndDropArea
         * @type {Node}
         * @default null
         */
        dragAndDropArea: {
            value: null,
            setter: function (val) {
                return Y.one(val);
            }
        },

        /**
         * A Boolean indicating whether the uploader is enabled or disabled for user input.
         *
         * @attribute enabled
         * @type {Boolean}
         * @default true
         */
        enabled : {
            value: true
        },

        /**
         * The action  performed when an upload error occurs for a specific file being uploaded.
         * The possible values are: 
         * <ul>
         *   <li> <strong>`UploaderQueue.CONTINUE`</strong>: the error is ignored and the upload process is continued.</li>
         *   <li> <strong>`UploaderQueue.STOP`</strong>: the upload process is stopped as soon as any other parallel file
         *     uploads are finished.</li>
         *   <li> <strong>`UploaderQueue.RESTART_ASAP`</strong>: the file is added back to the front of the queue.</li>
         *   <li> <strong>`UploaderQueue.RESTART_AFTER`</strong>: the file is added to the back of the queue.</li>
         * </ul>
         * @attribute errorAction
         * @type {String}
         * @default UploaderQueue.CONTINUE
         */
        errorAction: {
            value: "continue",
            validator: function (val, name) {
                 return (val === UploaderQueue.CONTINUE || val === UploaderQueue.STOP || val === UploaderQueue.RESTART_ASAP || val === UploaderQueue.RESTART_AFTER);           }
        },

        /**
         * An array indicating what fileFilters should be applied to the file
         * selection dialog. Each element in the array should be a string
         * indicating the Media (MIME) type for the files that should be supported
         * for selection. The Media type strings should be properly formatted
         * or this parameter will be ignored. Examples of valid strings include: 
         * "audio/*", "video/*", "application/pdf", etc. More information
         * on valid Media type strings is available here: 
         * http://www.iana.org/assignments/media-types/index.html
         * @attribute fileFilters
         * @type {Array}
         * @default []
         */
        fileFilters: {
          value: []
        },

        /**
         * A filtering function that is applied to every file selected by the user.
         * The function receives the `Y.File` object and must return a Boolean value.
         * If a `false` value is returned, the file in question is not added to the
         * list of files to be uploaded.
         * Use this function to put limits on file sizes or check the file names for
         * correct extension, but make sure that a server-side check is also performed,
         * since any client-side restrictions are only advisory and can be circumvented.
         *
         * @attribute fileFilterFunction
         * @type {Function}
         * @default null
         */
        fileFilterFunction: {
          value: null
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
         * The array of files to be uploaded. All elements in the array
         * must be instances of `Y.File` and be instantiated with an instance
         * of native JavaScript File() class.
         *
         * @attribute fileList
         * @type {Array}
         * @default []
         */
        fileList: {
            value: [],
            getter: "_getFileList",
            setter: "_setFileList"
        },

        /**
         * A Boolean indicating whether multiple file selection is enabled.
         *
         * @attribute multipleFiles
         * @type {Boolean}
         * @default false
         */
        multipleFiles: {
            value: false
        },

        /**
         * An object, keyed by `fileId`, containing sets of key-value pairs
         * that should be passed as POST variables along with each corresponding
         * file. This attribute is only used if no POST variables are specifed
         * in the upload method call.
         *
         * @attribute postVarsPerFile
         * @type {Object}
         * @default {}
         */
        postVarsPerFile: {
            value: {}
        },

        /**
         * The label for the "Select Files" widget. This is the value that replaces the
         * `{selectButtonLabel}` token in the `SELECT_FILES_BUTTON` template.
         * 
         * @attribute selectButtonLabel
         * @type {String}
         * @default "Select Files"
         */
        selectButtonLabel: {
            value: "Select Files"
        },

        /**
         * The widget that serves as the "Select Files control for the file uploader
         * 
         *
         * @attribute selectFilesButton
         * @type {Node | Widget}
         * @default A standard HTML button with YUI CSS Button skin.
         */
        selectFilesButton : {
            valueFn: function () {
                return Y.Node.create(substitute(Y.UploaderHTML5.SELECT_FILES_BUTTON, {selectButtonLabel: this.get("selectButtonLabel"),
                                                                                      tabIndex: this.get("tabIndex")}));
            }
        },

        /**
         * The number of files that can be uploaded
         * simultaneously if the automatic queue management
         * is used. This value can be in the range between 2
         * and 5.
         *
         * @attribute simLimit
         * @type {Number}
         * @default 2
         */
        simLimit: {
            value: 2,
            validator: function (val, name) {
                return (val >= 1 && val <= 5);
            }
        },

        /**
         * The URL to which file upload requested are POSTed. Only used if a different url is not passed to the upload method call.
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
         * in the upload request.
         *
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
         * domain. 
         *
         * @attribute withCredentials
         * @type {Boolean}
         * @default true
         */  
        withCredentials: {
           value: true
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

Y.UploaderHTML5.Queue = UploaderQueue;



}, '3.7.3', {"requires": ["widget", "node-event-simulate", "substitute", "file-html5", "uploader-queue"]});
