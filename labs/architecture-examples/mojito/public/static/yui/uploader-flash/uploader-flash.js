/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('uploader-flash', function (Y, NAME) {


    /**
     * This module provides a UI for file selection and multiple file upload capability using
     * Flash as a transport engine.
     * The supported features include: automatic upload queue management, upload progress
     * tracking, file filtering, server response retrieval and error reporting.
     *
     * @module uploader-flash
     */     

// Shorthands for external modules
var  substitute            = Y.substitute,
     UploaderQueue         = Y.Uploader.Queue,
     getCN                 = Y.ClassNameManager.getClassName,
     UPLOADER              = 'uploader',
     SELECT_FILES          = getCN(UPLOADER, 'selectfiles-button');


    /**
     * This module provides a UI for file selection and multiple file upload capability
     * using Flash as a transport engine.
     * @class UploaderFlash
     * @extends Widget
     * @constructor
     * @param {Object} config Configuration object.
     */

function UploaderFlash(config) {
  UploaderFlash.superclass.constructor.apply ( this, arguments );
}



Y.UploaderFlash = Y.extend(UploaderFlash, Y.Widget, {

  /**
   * Stored value of the current button state (based on 
   * mouse events dispatched by the Flash player)
   * @property _buttonState
   * @type {String}
   * @protected
   */
  _buttonState: "up",

  /**
   * Stored value of the current button focus state (based 
   * on keyboard and mouse events).
   * @property _buttonFocus
   * @type {Boolean}
   * @protected
   */
  _buttonFocus: false,

  /**
   * Stored value of the unique id for the container that holds the 
   * Flash uploader.
   *
   * @property _swfContainerId
   * @type {String}
   * @protected
   */
  _swfContainerId: null,

  /**
   * Stored reference to the instance of SWF used to host the
   * Flash uploader.
   *
   * @property _swfReference
   * @type {SWF}
   * @protected
   */
  _swfReference: null,

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

  /**
   * Stored event bindings for keyboard navigation to and from the uploader.
   *
   * @property _tabElementBindings
   * @type {Object}
   * @protected
   */
  _tabElementBindings: null,


/**
 * Construction logic executed during UploaderFlash instantiation.
 *
 * @method initializer
 * @protected
 */
  initializer : function () {

    // Assign protected variable values
    this._swfContainerId = Y.guid("uploader");
    this._swfReference = null;
    this.queue = null;
    this._buttonState = "up";
    this._buttonFocus = null;
    this._tabElementBindings = null;
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
    *              in Y.FileFlash objects.</dd>
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
    *      <dt>bytesLoaded</dt>
    *          <dd>The number of bytes of the file that has been uploaded</dd>
    *      <dt>bytesTotal</dt>
    *          <dd>The total number of bytes in the file</dd>
    *      <dt>percentLoaded</dt>
    *          <dd>The fraction of the file that has been uploaded, out of 100</dd>
    *      <dt>originEvent</dt>
    *          <dd>The original event dispatched by the SWF uploader</dd>
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
    *          <dd>The original error event fired by the SWF Uploader. </dd>
    *      <dt>file</dt>
    *          <dd>The pointer at the instance of Y.FileFlash that returned the error.</dd>
    *      <dt>source</dt>
    *          <dd>The source of the upload error, either "io" or "http"</dd>       
    *      <dt>message</dt>
    *          <dd>The message that accompanied the error. Corresponds to the text of
    *              the error in cases where source is "io", and to the HTTP status for
                   cases where source is "http".</dd>     
    *  </dl>
    */
    this.publish("uploaderror");

   /**
    * Signals that a mouse has begun hovering over the `Select Files` button. 
    *
    * @event mouseenter
    * @param event {Event} The event object for the `mouseenter` event.
    */
    this.publish("mouseenter");

   /**
    * Signals that a mouse has stopped hovering over the `Select Files` button. 
    *
    * @event mouseleave
    * @param event {Event} The event object for the `mouseleave` event.
    */
    this.publish("mouseleave");

   /**
    * Signals that a mouse button has been pressed over the `Select Files` button. 
    *
    * @event mousedown
    * @param event {Event} The event object for the `mousedown` event.
    */
    this.publish("mousedown");

   /**
    * Signals that a mouse button has been released over the `Select Files` button. 
    *
    * @event mouseup
    * @param event {Event} The event object for the `mouseup` event.
    */
    this.publish("mouseup");

   /**
    * Signals that a mouse has been clicked over the `Select Files` button. 
    *
    * @event click
    * @param event {Event} The event object for the `click` event.
    */
    this.publish("click");
  },

  /**
   * Creates the DOM structure for the UploaderFlash.
   * UploaderFlash's DOM structure consists of two layers: the base "Select Files"
   * button that can be replaced by the developer's widget of choice; and a transparent
   * Flash overlay positoned above the button that captures all input events.
   * The `position` style attribute of the `boundingBox` of the `Uploader` widget
   * is forced to be `relative`, in order to accommodate the Flash player overlay
   * (which is `position`ed `absolute`ly).
   *
   * @method renderUI
   * @protected
   */
  renderUI : function () {
     var boundingBox = this.get("boundingBox"),
         contentBox = this.get('contentBox'),
         selFilesButton = this.get("selectFilesButton");
 
     boundingBox.setStyle("position", "relative");
     selFilesButton.setStyles({width: "100%", height: "100%"});
     contentBox.append(selFilesButton);
     contentBox.append(Y.Node.create(substitute(UploaderFlash.FLASH_CONTAINER, 
                                              {swfContainerId: this._swfContainerId})));
     var flashContainer = Y.one("#" + this._swfContainerId);
     var params = {version: "10.0.45",
                     fixedAttributes: {wmode: "transparent", 
                                       allowScriptAccess:"always", 
                                       allowNetworking:"all", 
                                       scale: "noscale"
                                      }
                    };
     this._swfReference = new Y.SWF(flashContainer, this.get("swfURL"), params);
  },

  /**
   * Binds handlers to the UploaderFlash UI events and propagates attribute
   * values to the Flash player.
   * The propagation of initial values is set to occur once the Flash player 
   * instance is ready (as indicated by the `swfReady` event.)
   *
   * @method bindUI
   * @protected
   */
  bindUI : function () {

    this._swfReference.on("swfReady", function () {
      this._setMultipleFiles();
      this._setFileFilters();
      this._triggerEnabled();
      this._attachTabElements();
      this.after("multipleFilesChange", this._setMultipleFiles, this);
      this.after("fileFiltersChange", this._setFileFilters, this);
      this.after("enabledChange", this._triggerEnabled, this);
      this.after("tabElementsChange", this._attachTabElements);
    }, this);
        
    this._swfReference.on("fileselect", this._updateFileList, this);



        // this._swfReference.on("trace", function (ev) {console.log(ev.message);});

        this._swfReference.on("mouseenter", function () {
            this.fire("mouseenter");
            this._setButtonClass("hover", true);
            if (this._buttonState == "down") {
                this._setButtonClass("active", true);
            }
        }, this);
        this._swfReference.on("mouseleave", function () {
            this.fire("mouseleave");
            this._setButtonClass("hover", false);
            this._setButtonClass("active", false);
            
        }, this);
        this._swfReference.on("mousedown", function () {
            this.fire("mousedown");
            this._buttonState = "down";
            this._setButtonClass("active", true);
        }, this);
        this._swfReference.on("mouseup", function () {
            this.fire("mouseup");
            this._buttonState = "up";
            this._setButtonClass("active", false);
        }, this);
        this._swfReference.on("click", function () {
            this.fire("click");
            this._buttonFocus = true;
            this._setButtonClass("focus", true);
            Y.one("body").focus();
            this._swfReference._swf.focus();
        }, this);
  },

  /**
   * Attaches keyboard bindings to enabling tabbing to and from the instance of the Flash
   * player in the Uploader widget. If the previous and next elements are specified, the
   * keyboard bindings enable the user to tab from the `tabElements["from"]` node to the 
   * Flash-powered "Select Files" button, and to the `tabElements["to"]` node. 
   *
   * @method _attachTabElements
   * @protected
   * @param ev {Event} Optional event payload if called as a `tabElementsChange` handler.
   */
  _attachTabElements : function (ev) {
      if (this.get("tabElements") !== null && this.get("tabElements").from !== null && this.get("tabElements").to !== null) {

        if (this._tabElementBindings !== null) {
          this._tabElementBindings.from.detach();
          this._tabElementBindings.to.detach();
          this._tabElementBindings.tabback.detach();
          this._tabElementBindings.tabforward.detach();
          this._tabElementBindings.focus.detach();
          this._tabElementBindings.blur.detach();
        }
        else {
          this._tabElementBindings = {};
        }

          var fromElement = Y.one(this.get("tabElements").from);
          var toElement = Y.one(this.get("tabElements").to);


          this._tabElementBindings.from = fromElement.on("keydown", function (ev) { 
                                                    if (ev.keyCode == 9 && !ev.shiftKey) {
                                                        ev.preventDefault();
                                                        this._swfReference._swf.setAttribute("tabindex", 0); 
                                                        this._swfReference._swf.setAttribute("role", "button");
                                                        this._swfReference._swf.setAttribute("aria-label", this.get("selectButtonLabel"));
                                                        this._swfReference._swf.focus();
                                                    }
                                                  }, this);
          this._tabElementBindings.to = toElement.on("keydown", function (ev) { 
                                                    if (ev.keyCode == 9 && ev.shiftKey) {
                                                        ev.preventDefault();
                                                        this._swfReference._swf.setAttribute("tabindex", 0); 
                                                        this._swfReference._swf.setAttribute("role", "button");
                                                        this._swfReference._swf.setAttribute("aria-label", this.get("selectButtonLabel"));
                                                        this._swfReference._swf.focus();
                                                    }
                                                  }, this);
          this._tabElementBindings.tabback = this._swfReference.on("tabback", function (ev) {this._swfReference._swf.blur(); setTimeout(function () {fromElement.focus();}, 30);}, this);
          this._tabElementBindings.tabforward = this._swfReference.on("tabforward", function (ev) {this._swfReference._swf.blur(); setTimeout(function () {toElement.focus();}, 30);}, this);

          this._tabElementBindings.focus = this._swfReference._swf.on("focus", function (ev) {this._buttonFocus = true; this._setButtonClass("focus", true);}, this);
          this._tabElementBindings.blur = this._swfReference._swf.on("blur", function (ev) {this._buttonFocus = false; this._setButtonClass("focus", false);}, this);
      }
      else if (this._tabElementBindings !== null) {
          this._tabElementBindings.from.detach();
          this._tabElementBindings.to.detach();
          this._tabElementBindings.tabback.detach();
          this._tabElementBindings.tabforward.detach();
          this._tabElementBindings.focus.detach();
          this._tabElementBindings.blur.detach();
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
   * Syncs the state of the `fileFilters` attribute between the instance of UploaderFlash
   * and the Flash player.
   * 
   * @method _setFileFilters
   * @private
   */
  _setFileFilters : function () {
          if (this._swfReference && this.get("fileFilters").length > 0) {
            this._swfReference.callSWF("setFileFilters", [this.get("fileFilters")]);
          } 

  },



  /**
   * Syncs the state of the `multipleFiles` attribute between this class
   * and the Flash uploader.
   * 
   * @method _setMultipleFiles
   * @private
   */
  _setMultipleFiles : function () {
        if (this._swfReference) {
      this._swfReference.callSWF("setAllowMultipleFiles", [this.get("multipleFiles")]);
    }
  },

  /**
   * Syncs the state of the `enabled` attribute between this class
   * and the Flash uploader.
   * 
   * @method _triggerEnabled
   * @private
   */
  _triggerEnabled : function () {
      if (this.get("enabled")) {
        this._swfReference.callSWF("enable");
        this._swfReference._swf.setAttribute("aria-disabled", "false");
        this._setButtonClass("disabled", false);
      }
      else {
        this._swfReference.callSWF("disable");
        this._swfReference._swf.setAttribute("aria-disabled", "true");
        this._setButtonClass("disabled", true);
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
   * @private
   */
  _updateFileList : function (ev) {
     
     Y.one("body").focus();
     this._swfReference._swf.focus();


     var newfiles = ev.fileList,
         fileConfObjects = [],
         parsedFiles = [],
         swfRef = this._swfReference,
         filterFunc = this.get("fileFilterFunction");
 
     Y.each(newfiles, function (value) {
       var newFileConf = {};
       newFileConf.id = value.fileId;
       newFileConf.name = value.fileReference.name;
       newFileConf.size = value.fileReference.size;
       newFileConf.type = value.fileReference.type;
       newFileConf.dateCreated = value.fileReference.creationDate;
       newFileConf.dateModified = value.fileReference.modificationDate;
       newFileConf.uploader = swfRef;

       fileConfObjects.push(newFileConf);
     });

       if (filterFunc) {
          Y.each(fileConfObjects, function (value) {
            var newfile = new Y.FileFlash(value);
            if (filterFunc(newfile)) {
                parsedFiles.push(newfile);
            }
          });
       }
       else {
          Y.each(fileConfObjects, function (value) {
            parsedFiles.push(new Y.FileFlash(value));
          });
       }

     if (parsedFiles.length > 0) {
        var oldfiles = this.get("fileList");

        this.set("fileList", 
                 this.get("appendNewFiles") ? oldfiles.concat(parsedFiles) : parsedFiles );

        this.fire("fileselect", {fileList: parsedFiles});
     }

  },



  /**
   * Handles and retransmits events fired by `Y.FileFlash` and `Y.Uploader.Queue`.
   * 
   * @method _uploadEventHandler
   * @param event The event dispatched during the upload process.
   * @private
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
   * Starts the upload of a specific file.
   *
   * @method upload
   * @param file {Y.FileFlash} Reference to the instance of the file to be uploaded.
   * @param url {String} The URL to upload the file to.
   * @param postVars {Object} (optional) A set of key-value pairs to send as variables along with the file upload HTTP request.
   *                          If not specified, the values from the attribute `postVarsPerFile` are used instead. 
   */

  upload : function (file, url, postvars) {
        
        var uploadURL = url || this.get("uploadURL"),
            postVars = postvars || this.get("postVarsPerFile"),
            fileId = file.get("id");

            postVars = postVars.hasOwnProperty(fileId) ? postVars[fileId] : postVars;

        if (file instanceof Y.FileFlash) {
           
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
                                           retryCount: this.get("retryCount")
                                               });
           this.queue.on("uploadstart", this._uploadEventHandler, this);
           this.queue.on("uploadprogress", this._uploadEventHandler, this);
           this.queue.on("totaluploadprogress", this._uploadEventHandler, this);
           this.queue.on("uploadcomplete", this._uploadEventHandler, this);
           this.queue.on("alluploadscomplete", this._uploadEventHandler, this);
           this.queue.on("alluploadscancelled", function (ev) {this.queue = null;}, this);
           this.queue.on("uploaderror", this._uploadEventHandler, this);
           this.queue.startUpload();  
           
           this.fire("uploadstart"); 
    }
  }
},

{
  /**
   * The template for the Flash player container. Since the Flash player container needs
   * to completely overlay the &lquot;Select Files&rqot; control, it's positioned absolutely,
   * with width and height set to 100% of the parent.
   *
   * @property FLASH_CONTAINER
   * @type {String}
   * @static
   * @default "<div id='{swfContainerId}' style='position:absolute; top:0px; left: 0px; margin: 0; padding: 0; border: 0; width:100%; height:100%'></div>"
   */
  FLASH_CONTAINER: "<div id='{swfContainerId}' style='position:absolute; top:0px; left: 0px; margin: 0; padding: 0; border: 0; width:100%; height:100%'></div>",

  /**
   * The template for the "Select Files" button.
   *
   * @property SELECT_FILES_BUTTON
   * @type {String}
   * @static
   * @default "<button type='button' class='yui3-button' tabindex='-1'>{selectButtonLabel}</button>"
   */
  SELECT_FILES_BUTTON: "<button type='button' class='yui3-button' tabindex='-1'>{selectButtonLabel}</button>",

   /**
   * The static property reflecting the type of uploader that `Y.Uploader`
   * aliases. The UploaderFlash value is `"flash"`.
   * 
   * @property TYPE
   * @type {String}
   * @static
   */
  TYPE: "flash",

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
         * "Select Files" control based on the mouse states reported by the
         * Flash player. The keys for the class names are:
         * <ul>
         *   <li> <strong>`hover`</strong>: the class corresponding to mouse hovering over
         *      the "Select Files" button.</li>
         *   <li> <strong>`active`</strong>: the class corresponding to mouse down state of
         *      the "Select Files" button.</li>
         *   <li> <strong>`disabled`</strong>: the class corresponding to the disabled state
         *      of the "Select Files" button.</li>
         *   <li> <strong>`focus`</strong>: the class corresponding to the focused state of
         *      the "Select Files" button.</li>
         * </ul>
         * @attribute buttonClassNames
         * @type {Object}
         * @default { hover: "yui3-button-hover",
         *            active: "yui3-button-active",
         *            disabled: "yui3-button-disabled",
         *            focus: "yui3-button-selected"
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
                 return (val === UploaderQueue.CONTINUE || val === UploaderQueue.STOP || val === UploaderQueue.RESTART_ASAP || val === UploaderQueue.RESTART_AFTER);           
             }
        },

        /**
         * An array indicating what fileFilters should be applied to the file
         * selection dialog. Each element in the array should be an object with
         * the following key-value pairs:
         * {
         *   description : String           
             extensions: String of the form &lquot;*.ext1;*.ext2;*.ext3;...&rquot;
         * }
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
       * must be instances of `Y.FileFlash` and be instantiated with a `fileId`
       * retrieved from an instance of the uploader.
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
         * The widget that serves as the "Select Files" control for the file uploader
         * 
         *
         * @attribute selectFilesButton
         * @type {Node | Widget}
         * @default A standard HTML button with YUI CSS Button skin.
         */
        selectFilesButton : {
           valueFn: function () {
                     return Y.Node.create(substitute(Y.UploaderFlash.SELECT_FILES_BUTTON, {selectButtonLabel: this.get("selectButtonLabel")}));
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
                    return (val >= 2 && val <= 5);
                }
            },

        /**
         * The URL to the SWF file of the flash uploader. A copy local to
         * the server that hosts the page on which the uploader appears is
         * recommended.
         *
         * @attribute swfURL
         * @type {String}
         * @default "CDN Prefix + uploader/assets/flashuploader.swf" with a 
         * random GET parameter for IE (to prevent buggy behavior when the SWF 
         * is cached).
         */
        swfURL: {
          valueFn: function () {
            var prefix = Y.Env.cdn + "uploader/assets/flashuploader.swf";

            if (Y.UA.ie > 0) {
              return (prefix + "?t=" + Y.guid("uploader"));
            }
            return prefix;
          }
        },

        /**
         * The id's or `Node` references of the DOM elements that precede
         * and follow the `Select Files` button in the tab order. Specifying
         * these allows keyboard navigation to and from the Flash player
         * layer of the uploader.
         * The two keys corresponding to the DOM elements are:
           <ul>
         *   <li> `from`: the id or the `Node` reference corresponding to the
         *     DOM element that precedes the `Select Files` button in the tab order.</li>
         *   <li> `to`: the id or the `Node` reference corresponding to the
         *     DOM element that follows the `Select Files` button in the tab order.</li>
         * </ul>
         * @attribute tabElements
         * @type {Object}
         * @default null
         */
        tabElements: {
            value: null
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

Y.UploaderFlash.Queue = UploaderQueue;




}, '3.7.3', {"requires": ["swf", "widget", "substitute", "base", "cssbutton", "node", "event-custom", "file-flash", "uploader-queue"]});
