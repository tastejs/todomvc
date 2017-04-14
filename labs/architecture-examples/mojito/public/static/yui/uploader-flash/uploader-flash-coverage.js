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
_yuitest_coverage["build/uploader-flash/uploader-flash.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/uploader-flash/uploader-flash.js",
    code: []
};
_yuitest_coverage["build/uploader-flash/uploader-flash.js"].code=["YUI.add('uploader-flash', function (Y, NAME) {","","","    /**","     * This module provides a UI for file selection and multiple file upload capability using","     * Flash as a transport engine.","     * The supported features include: automatic upload queue management, upload progress","     * tracking, file filtering, server response retrieval and error reporting.","     *","     * @module uploader-flash","     */     ","","// Shorthands for external modules","var  substitute            = Y.substitute,","     UploaderQueue         = Y.Uploader.Queue,","     getCN                 = Y.ClassNameManager.getClassName,","     UPLOADER              = 'uploader',","     SELECT_FILES          = getCN(UPLOADER, 'selectfiles-button');","","","    /**","     * This module provides a UI for file selection and multiple file upload capability","     * using Flash as a transport engine.","     * @class UploaderFlash","     * @extends Widget","     * @constructor","     * @param {Object} config Configuration object.","     */","","function UploaderFlash(config) {","  UploaderFlash.superclass.constructor.apply ( this, arguments );","}","","","","Y.UploaderFlash = Y.extend(UploaderFlash, Y.Widget, {","","  /**","   * Stored value of the current button state (based on ","   * mouse events dispatched by the Flash player)","   * @property _buttonState","   * @type {String}","   * @protected","   */","  _buttonState: \"up\",","","  /**","   * Stored value of the current button focus state (based ","   * on keyboard and mouse events).","   * @property _buttonFocus","   * @type {Boolean}","   * @protected","   */","  _buttonFocus: false,","","  /**","   * Stored value of the unique id for the container that holds the ","   * Flash uploader.","   *","   * @property _swfContainerId","   * @type {String}","   * @protected","   */","  _swfContainerId: null,","","  /**","   * Stored reference to the instance of SWF used to host the","   * Flash uploader.","   *","   * @property _swfReference","   * @type {SWF}","   * @protected","   */","  _swfReference: null,","","  /**","   * Stored reference to the instance of Uploader.Queue used to manage","   * the upload process. This is a read-only property that only exists","   * during an active upload process. Only one queue can be active at","   * a time; if an upload start is attempted while a queue is active,","   * it will be ignored.","   *","   * @property queue","   * @type {Y.Uploader.Queue}","   */","   queue: null,","","  /**","   * Stored event bindings for keyboard navigation to and from the uploader.","   *","   * @property _tabElementBindings","   * @type {Object}","   * @protected","   */","  _tabElementBindings: null,","","","/**"," * Construction logic executed during UploaderFlash instantiation."," *"," * @method initializer"," * @protected"," */","  initializer : function () {","","    // Assign protected variable values","    this._swfContainerId = Y.guid(\"uploader\");","    this._swfReference = null;","    this.queue = null;","    this._buttonState = \"up\";","    this._buttonFocus = null;","    this._tabElementBindings = null;","    this._fileList = [];","","    // Publish available events","","   /**","    * Signals that files have been selected. ","    *","    * @event fileselect","    * @param event {Event} The event object for the `fileselect` with the","    *                      following payload:","    *  <dl>","    *      <dt>fileList</dt>","    *          <dd>An `Array` of files selected by the user, encapsulated","    *              in Y.FileFlash objects.</dd>","    *  </dl>","    */","    this.publish(\"fileselect\");","","   /**","    * Signals that an upload of multiple files has been started. ","    *","    * @event uploadstart","    * @param event {Event} The event object for the `uploadstart`.","    */","    this.publish(\"uploadstart\");","","   /**","    * Signals that an upload of a specific file has started. ","    *","    * @event fileuploadstart","    * @param event {Event} The event object for the `fileuploadstart` with the","    *                      following payload:","    *  <dl>","    *      <dt>file</dt>","    *          <dd>A reference to the Y.File that dispatched the event.</dd>","    *      <dt>originEvent</dt>","    *          <dd>The original event dispatched by Y.File.</dd>","    *  </dl>","    */","    this.publish(\"fileuploadstart\");","","   /**","    * Reports on upload progress of a specific file. ","    *","    * @event uploadprogress","    * @param event {Event} The event object for the `uploadprogress` with the","    *                      following payload:","    *  <dl>","    *      <dt>bytesLoaded</dt>","    *          <dd>The number of bytes of the file that has been uploaded</dd>","    *      <dt>bytesTotal</dt>","    *          <dd>The total number of bytes in the file</dd>","    *      <dt>percentLoaded</dt>","    *          <dd>The fraction of the file that has been uploaded, out of 100</dd>","    *      <dt>originEvent</dt>","    *          <dd>The original event dispatched by the SWF uploader</dd>","    *  </dl>","    */","    this.publish(\"uploadprogress\");","","   /**","    * Reports on the total upload progress of the file list. ","    *","    * @event totaluploadprogress","    * @param event {Event} The event object for the `totaluploadprogress` with the","    *                      following payload:","    *  <dl>","    *      <dt>bytesLoaded</dt>","    *          <dd>The number of bytes of the file list that has been uploaded</dd>","    *      <dt>bytesTotal</dt>","    *          <dd>The total number of bytes in the file list</dd>","    *      <dt>percentLoaded</dt>","    *          <dd>The fraction of the file list that has been uploaded, out of 100</dd>","    *  </dl>","    */","    this.publish(\"totaluploadprogress\");","","   /**","    * Signals that a single file upload has been completed. ","    *","    * @event uploadcomplete","    * @param event {Event} The event object for the `uploadcomplete` with the","    *                      following payload:","    *  <dl>","    *      <dt>file</dt>","    *          <dd>The pointer to the instance of `Y.File` whose upload has been completed.</dd>","    *      <dt>originEvent</dt>","    *          <dd>The original event fired by the SWF Uploader</dd>","    *      <dt>data</dt>","    *          <dd>Data returned by the server.</dd>","    *  </dl>","    */","    this.publish(\"uploadcomplete\");","","   /**","    * Signals that the upload process of the entire file list has been completed. ","    *","    * @event alluploadscomplete","    * @param event {Event} The event object for the `alluploadscomplete`.","    */","    this.publish(\"alluploadscomplete\");","","   /**","    * Signals that a error has occurred in a specific file's upload process. ","    *","    * @event uploaderror","    * @param event {Event} The event object for the `uploaderror` with the","    *                      following payload:","    *  <dl>","    *      <dt>originEvent</dt>","    *          <dd>The original error event fired by the SWF Uploader. </dd>","    *      <dt>file</dt>","    *          <dd>The pointer at the instance of Y.FileFlash that returned the error.</dd>","    *      <dt>source</dt>","    *          <dd>The source of the upload error, either \"io\" or \"http\"</dd>       ","    *      <dt>message</dt>","    *          <dd>The message that accompanied the error. Corresponds to the text of","    *              the error in cases where source is \"io\", and to the HTTP status for","                   cases where source is \"http\".</dd>     ","    *  </dl>","    */","    this.publish(\"uploaderror\");","","   /**","    * Signals that a mouse has begun hovering over the `Select Files` button. ","    *","    * @event mouseenter","    * @param event {Event} The event object for the `mouseenter` event.","    */","    this.publish(\"mouseenter\");","","   /**","    * Signals that a mouse has stopped hovering over the `Select Files` button. ","    *","    * @event mouseleave","    * @param event {Event} The event object for the `mouseleave` event.","    */","    this.publish(\"mouseleave\");","","   /**","    * Signals that a mouse button has been pressed over the `Select Files` button. ","    *","    * @event mousedown","    * @param event {Event} The event object for the `mousedown` event.","    */","    this.publish(\"mousedown\");","","   /**","    * Signals that a mouse button has been released over the `Select Files` button. ","    *","    * @event mouseup","    * @param event {Event} The event object for the `mouseup` event.","    */","    this.publish(\"mouseup\");","","   /**","    * Signals that a mouse has been clicked over the `Select Files` button. ","    *","    * @event click","    * @param event {Event} The event object for the `click` event.","    */","    this.publish(\"click\");","  },","","  /**","   * Creates the DOM structure for the UploaderFlash.","   * UploaderFlash's DOM structure consists of two layers: the base \"Select Files\"","   * button that can be replaced by the developer's widget of choice; and a transparent","   * Flash overlay positoned above the button that captures all input events.","   * The `position` style attribute of the `boundingBox` of the `Uploader` widget","   * is forced to be `relative`, in order to accommodate the Flash player overlay","   * (which is `position`ed `absolute`ly).","   *","   * @method renderUI","   * @protected","   */","  renderUI : function () {","     var boundingBox = this.get(\"boundingBox\"),","         contentBox = this.get('contentBox'),","         selFilesButton = this.get(\"selectFilesButton\");"," ","     boundingBox.setStyle(\"position\", \"relative\");","     selFilesButton.setStyles({width: \"100%\", height: \"100%\"});","     contentBox.append(selFilesButton);","     contentBox.append(Y.Node.create(substitute(UploaderFlash.FLASH_CONTAINER, ","                                              {swfContainerId: this._swfContainerId})));","     var flashContainer = Y.one(\"#\" + this._swfContainerId);","     var params = {version: \"10.0.45\",","                     fixedAttributes: {wmode: \"transparent\", ","                                       allowScriptAccess:\"always\", ","                                       allowNetworking:\"all\", ","                                       scale: \"noscale\"","                                      }","                    };","     this._swfReference = new Y.SWF(flashContainer, this.get(\"swfURL\"), params);","  },","","  /**","   * Binds handlers to the UploaderFlash UI events and propagates attribute","   * values to the Flash player.","   * The propagation of initial values is set to occur once the Flash player ","   * instance is ready (as indicated by the `swfReady` event.)","   *","   * @method bindUI","   * @protected","   */","  bindUI : function () {","","    this._swfReference.on(\"swfReady\", function () {","      this._setMultipleFiles();","      this._setFileFilters();","      this._triggerEnabled();","      this._attachTabElements();","      this.after(\"multipleFilesChange\", this._setMultipleFiles, this);","      this.after(\"fileFiltersChange\", this._setFileFilters, this);","      this.after(\"enabledChange\", this._triggerEnabled, this);","      this.after(\"tabElementsChange\", this._attachTabElements);","    }, this);","        ","    this._swfReference.on(\"fileselect\", this._updateFileList, this);","","","","        // this._swfReference.on(\"trace\", function (ev) {console.log(ev.message);});","","        this._swfReference.on(\"mouseenter\", function () {","            this.fire(\"mouseenter\");","            this._setButtonClass(\"hover\", true);","            if (this._buttonState == \"down\") {","                this._setButtonClass(\"active\", true);","            }","        }, this);","        this._swfReference.on(\"mouseleave\", function () {","            this.fire(\"mouseleave\");","            this._setButtonClass(\"hover\", false);","            this._setButtonClass(\"active\", false);","            ","        }, this);","        this._swfReference.on(\"mousedown\", function () {","            this.fire(\"mousedown\");","            this._buttonState = \"down\";","            this._setButtonClass(\"active\", true);","        }, this);","        this._swfReference.on(\"mouseup\", function () {","            this.fire(\"mouseup\");","            this._buttonState = \"up\";","            this._setButtonClass(\"active\", false);","        }, this);","        this._swfReference.on(\"click\", function () {","            this.fire(\"click\");","            this._buttonFocus = true;","            this._setButtonClass(\"focus\", true);","            Y.one(\"body\").focus();","            this._swfReference._swf.focus();","        }, this);","  },","","  /**","   * Attaches keyboard bindings to enabling tabbing to and from the instance of the Flash","   * player in the Uploader widget. If the previous and next elements are specified, the","   * keyboard bindings enable the user to tab from the `tabElements[\"from\"]` node to the ","   * Flash-powered \"Select Files\" button, and to the `tabElements[\"to\"]` node. ","   *","   * @method _attachTabElements","   * @protected","   * @param ev {Event} Optional event payload if called as a `tabElementsChange` handler.","   */","  _attachTabElements : function (ev) {","      if (this.get(\"tabElements\") !== null && this.get(\"tabElements\").from !== null && this.get(\"tabElements\").to !== null) {","","        if (this._tabElementBindings !== null) {","          this._tabElementBindings.from.detach();","          this._tabElementBindings.to.detach();","          this._tabElementBindings.tabback.detach();","          this._tabElementBindings.tabforward.detach();","          this._tabElementBindings.focus.detach();","          this._tabElementBindings.blur.detach();","        }","        else {","          this._tabElementBindings = {};","        }","","          var fromElement = Y.one(this.get(\"tabElements\").from);","          var toElement = Y.one(this.get(\"tabElements\").to);","","","          this._tabElementBindings.from = fromElement.on(\"keydown\", function (ev) { ","                                                    if (ev.keyCode == 9 && !ev.shiftKey) {","                                                        ev.preventDefault();","                                                        this._swfReference._swf.setAttribute(\"tabindex\", 0); ","                                                        this._swfReference._swf.setAttribute(\"role\", \"button\");","                                                        this._swfReference._swf.setAttribute(\"aria-label\", this.get(\"selectButtonLabel\"));","                                                        this._swfReference._swf.focus();","                                                    }","                                                  }, this);","          this._tabElementBindings.to = toElement.on(\"keydown\", function (ev) { ","                                                    if (ev.keyCode == 9 && ev.shiftKey) {","                                                        ev.preventDefault();","                                                        this._swfReference._swf.setAttribute(\"tabindex\", 0); ","                                                        this._swfReference._swf.setAttribute(\"role\", \"button\");","                                                        this._swfReference._swf.setAttribute(\"aria-label\", this.get(\"selectButtonLabel\"));","                                                        this._swfReference._swf.focus();","                                                    }","                                                  }, this);","          this._tabElementBindings.tabback = this._swfReference.on(\"tabback\", function (ev) {this._swfReference._swf.blur(); setTimeout(function () {fromElement.focus();}, 30);}, this);","          this._tabElementBindings.tabforward = this._swfReference.on(\"tabforward\", function (ev) {this._swfReference._swf.blur(); setTimeout(function () {toElement.focus();}, 30);}, this);","","          this._tabElementBindings.focus = this._swfReference._swf.on(\"focus\", function (ev) {this._buttonFocus = true; this._setButtonClass(\"focus\", true);}, this);","          this._tabElementBindings.blur = this._swfReference._swf.on(\"blur\", function (ev) {this._buttonFocus = false; this._setButtonClass(\"focus\", false);}, this);","      }","      else if (this._tabElementBindings !== null) {","          this._tabElementBindings.from.detach();","          this._tabElementBindings.to.detach();","          this._tabElementBindings.tabback.detach();","          this._tabElementBindings.tabforward.detach();","          this._tabElementBindings.focus.detach();","          this._tabElementBindings.blur.detach();","      }","  },","","","  /**","   * Adds or removes a specified state CSS class to the underlying uploader button. ","   *","   * @method _setButtonClass","   * @protected","   * @param state {String} The name of the state enumerated in `buttonClassNames` attribute","   * from which to derive the needed class name.","   * @param add {Boolean} A Boolean indicating whether to add or remove the class.","   */","  _setButtonClass : function (state, add) {","      if (add) {","          this.get(\"selectFilesButton\").addClass(this.get(\"buttonClassNames\")[state]);","      }","      else {","          this.get(\"selectFilesButton\").removeClass(this.get(\"buttonClassNames\")[state]);","      }","  },","","","  /**","   * Syncs the state of the `fileFilters` attribute between the instance of UploaderFlash","   * and the Flash player.","   * ","   * @method _setFileFilters","   * @private","   */","  _setFileFilters : function () {","          if (this._swfReference && this.get(\"fileFilters\").length > 0) {","            this._swfReference.callSWF(\"setFileFilters\", [this.get(\"fileFilters\")]);","          } ","","  },","","","","  /**","   * Syncs the state of the `multipleFiles` attribute between this class","   * and the Flash uploader.","   * ","   * @method _setMultipleFiles","   * @private","   */","  _setMultipleFiles : function () {","        if (this._swfReference) {","      this._swfReference.callSWF(\"setAllowMultipleFiles\", [this.get(\"multipleFiles\")]);","    }","  },","","  /**","   * Syncs the state of the `enabled` attribute between this class","   * and the Flash uploader.","   * ","   * @method _triggerEnabled","   * @private","   */","  _triggerEnabled : function () {","      if (this.get(\"enabled\")) {","        this._swfReference.callSWF(\"enable\");","        this._swfReference._swf.setAttribute(\"aria-disabled\", \"false\");","        this._setButtonClass(\"disabled\", false);","      }","      else {","        this._swfReference.callSWF(\"disable\");","        this._swfReference._swf.setAttribute(\"aria-disabled\", \"true\");","        this._setButtonClass(\"disabled\", true);","      }","  },","","  /**","   * Getter for the `fileList` attribute","   * ","   * @method _getFileList","   * @private","   */","    _getFileList : function (arr) {","        return this._fileList.concat();","    },","","  /**","   * Setter for the `fileList` attribute","   * ","   * @method _setFileList","   * @private","   */","    _setFileList : function (val) {","        this._fileList = val.concat();","        return this._fileList.concat();","    },","","  /**","   * Adjusts the content of the `fileList` based on the results of file selection","   * and the `appendNewFiles` attribute. If the `appendNewFiles` attribute is true,","   * then selected files are appended to the existing list; otherwise, the list is","   * cleared and populated with the newly selected files.","   * ","   * @method _updateFileList","   * @param ev {Event} The file selection event received from the uploader.","   * @private","   */","  _updateFileList : function (ev) {","     ","     Y.one(\"body\").focus();","     this._swfReference._swf.focus();","","","     var newfiles = ev.fileList,","         fileConfObjects = [],","         parsedFiles = [],","         swfRef = this._swfReference,","         filterFunc = this.get(\"fileFilterFunction\");"," ","     Y.each(newfiles, function (value) {","       var newFileConf = {};","       newFileConf.id = value.fileId;","       newFileConf.name = value.fileReference.name;","       newFileConf.size = value.fileReference.size;","       newFileConf.type = value.fileReference.type;","       newFileConf.dateCreated = value.fileReference.creationDate;","       newFileConf.dateModified = value.fileReference.modificationDate;","       newFileConf.uploader = swfRef;","","       fileConfObjects.push(newFileConf);","     });","","       if (filterFunc) {","          Y.each(fileConfObjects, function (value) {","            var newfile = new Y.FileFlash(value);","            if (filterFunc(newfile)) {","                parsedFiles.push(newfile);","            }","          });","       }","       else {","          Y.each(fileConfObjects, function (value) {","            parsedFiles.push(new Y.FileFlash(value));","          });","       }","","     if (parsedFiles.length > 0) {","        var oldfiles = this.get(\"fileList\");","","        this.set(\"fileList\", ","                 this.get(\"appendNewFiles\") ? oldfiles.concat(parsedFiles) : parsedFiles );","","        this.fire(\"fileselect\", {fileList: parsedFiles});","     }","","  },","","","","  /**","   * Handles and retransmits events fired by `Y.FileFlash` and `Y.Uploader.Queue`.","   * ","   * @method _uploadEventHandler","   * @param event The event dispatched during the upload process.","   * @private","   */","  _uploadEventHandler : function (event) {","  ","    switch (event.type) {","                case \"file:uploadstart\":","                   this.fire(\"fileuploadstart\", event);","                break;","                case \"file:uploadprogress\":","                   this.fire(\"uploadprogress\", event);","                break;","                case \"uploaderqueue:totaluploadprogress\":","                   this.fire(\"totaluploadprogress\", event);","                break;","                case \"file:uploadcomplete\":","                   this.fire(\"uploadcomplete\", event);","                break;","                case \"uploaderqueue:alluploadscomplete\":","                   this.queue = null;","                   this.fire(\"alluploadscomplete\", event);","                break;","                case \"file:uploaderror\":","                case \"uploaderqueue:uploaderror\":","                   this.fire(\"uploaderror\", event);","                break;","                case \"file:uploadcancel\":","                case \"uploaderqueue:uploadcancel\":","                   this.fire(\"uploadcancel\", event);","                break;","    }   ","","  },","","","","  /**","   * Starts the upload of a specific file.","   *","   * @method upload","   * @param file {Y.FileFlash} Reference to the instance of the file to be uploaded.","   * @param url {String} The URL to upload the file to.","   * @param postVars {Object} (optional) A set of key-value pairs to send as variables along with the file upload HTTP request.","   *                          If not specified, the values from the attribute `postVarsPerFile` are used instead. ","   */","","  upload : function (file, url, postvars) {","        ","        var uploadURL = url || this.get(\"uploadURL\"),","            postVars = postvars || this.get(\"postVarsPerFile\"),","            fileId = file.get(\"id\");","","            postVars = postVars.hasOwnProperty(fileId) ? postVars[fileId] : postVars;","","        if (file instanceof Y.FileFlash) {","           ","            file.on(\"uploadstart\", this._uploadEventHandler, this);","            file.on(\"uploadprogress\", this._uploadEventHandler, this);","            file.on(\"uploadcomplete\", this._uploadEventHandler, this);","            file.on(\"uploaderror\", this._uploadEventHandler, this);","            file.on(\"uploadcancel\", this._uploadEventHandler, this);","","            file.startUpload(uploadURL, postVars, this.get(\"fileFieldName\"));","        }","  },","","  /**","   * Starts the upload of all files on the file list, using an automated queue.","   *","   * @method uploadAll","   * @param url {String} The URL to upload the files to.","   * @param postVars {Object} (optional) A set of key-value pairs to send as variables along with the file upload HTTP request.","   *                          If not specified, the values from the attribute `postVarsPerFile` are used instead. ","   */","  uploadAll : function (url, postvars) {","        this.uploadThese(this.get(\"fileList\"), url, postvars);","  },","","  /**","   * Starts the upload of the files specified in the first argument, using an automated queue.","   *","   * @method uploadThese","   * @param files {Array} The list of files to upload.","   * @param url {String} The URL to upload the files to.","   * @param postVars {Object} (optional) A set of key-value pairs to send as variables along with the file upload HTTP request.","   *                          If not specified, the values from the attribute `postVarsPerFile` are used instead. ","   */","  uploadThese : function (files, url, postvars) {","    if (!this.queue) {","        var uploadURL = url || this.get(\"uploadURL\"),","            postVars = postvars || this.get(\"postVarsPerFile\");","","           this.queue = new UploaderQueue({simUploads: this.get(\"simLimit\"), ","                                           errorAction: this.get(\"errorAction\"),","                                           fileFieldName: this.get(\"fileFieldName\"),","                                           fileList: files,","                                           uploadURL: uploadURL,","                                           perFileParameters: postVars,","                                           retryCount: this.get(\"retryCount\")","                                               });","           this.queue.on(\"uploadstart\", this._uploadEventHandler, this);","           this.queue.on(\"uploadprogress\", this._uploadEventHandler, this);","           this.queue.on(\"totaluploadprogress\", this._uploadEventHandler, this);","           this.queue.on(\"uploadcomplete\", this._uploadEventHandler, this);","           this.queue.on(\"alluploadscomplete\", this._uploadEventHandler, this);","           this.queue.on(\"alluploadscancelled\", function (ev) {this.queue = null;}, this);","           this.queue.on(\"uploaderror\", this._uploadEventHandler, this);","           this.queue.startUpload();  ","           ","           this.fire(\"uploadstart\"); ","    }","  }","},","","{","  /**","   * The template for the Flash player container. Since the Flash player container needs","   * to completely overlay the &lquot;Select Files&rqot; control, it's positioned absolutely,","   * with width and height set to 100% of the parent.","   *","   * @property FLASH_CONTAINER","   * @type {String}","   * @static","   * @default \"<div id='{swfContainerId}' style='position:absolute; top:0px; left: 0px; margin: 0; padding: 0; border: 0; width:100%; height:100%'></div>\"","   */","  FLASH_CONTAINER: \"<div id='{swfContainerId}' style='position:absolute; top:0px; left: 0px; margin: 0; padding: 0; border: 0; width:100%; height:100%'></div>\",","","  /**","   * The template for the \"Select Files\" button.","   *","   * @property SELECT_FILES_BUTTON","   * @type {String}","   * @static","   * @default \"<button type='button' class='yui3-button' tabindex='-1'>{selectButtonLabel}</button>\"","   */","  SELECT_FILES_BUTTON: \"<button type='button' class='yui3-button' tabindex='-1'>{selectButtonLabel}</button>\",","","   /**","   * The static property reflecting the type of uploader that `Y.Uploader`","   * aliases. The UploaderFlash value is `\"flash\"`.","   * ","   * @property TYPE","   * @type {String}","   * @static","   */","  TYPE: \"flash\",","","  /**","   * The identity of the widget.","   *","   * @property NAME","   * @type String","   * @default 'uploader'","   * @readOnly","   * @protected","   * @static","   */","  NAME: \"uploader\",","","  /**","   * Static property used to define the default attribute configuration of","   * the Widget.","   *","   * @property ATTRS","   * @type {Object}","   * @protected","   * @static","   */","  ATTRS: {","","        /**","         * A Boolean indicating whether newly selected files should be appended ","         * to the existing file list, or whether they should replace it.","         *","         * @attribute appendNewFiles","         * @type {Boolean}","         * @default true","         */","         appendNewFiles : {","            value: true","         },","","        /**","         * The names of CSS classes that correspond to different button states","         * of the \"Select Files\" control. These classes are assigned to the ","         * \"Select Files\" control based on the mouse states reported by the","         * Flash player. The keys for the class names are:","         * <ul>","         *   <li> <strong>`hover`</strong>: the class corresponding to mouse hovering over","         *      the \"Select Files\" button.</li>","         *   <li> <strong>`active`</strong>: the class corresponding to mouse down state of","         *      the \"Select Files\" button.</li>","         *   <li> <strong>`disabled`</strong>: the class corresponding to the disabled state","         *      of the \"Select Files\" button.</li>","         *   <li> <strong>`focus`</strong>: the class corresponding to the focused state of","         *      the \"Select Files\" button.</li>","         * </ul>","         * @attribute buttonClassNames","         * @type {Object}","         * @default { hover: \"yui3-button-hover\",","         *            active: \"yui3-button-active\",","         *            disabled: \"yui3-button-disabled\",","         *            focus: \"yui3-button-selected\"","         *          }","         */","        buttonClassNames: {","            value: {","                \"hover\": \"yui3-button-hover\",","                \"active\": \"yui3-button-active\",","                \"disabled\": \"yui3-button-disabled\",","                \"focus\": \"yui3-button-selected\"","            }","        },","","        /**","         * A Boolean indicating whether the uploader is enabled or disabled for user input.","         *","         * @attribute enabled","         * @type {Boolean}","         * @default true","         */","        enabled : {","            value: true","        },","","        /**","         * The action  performed when an upload error occurs for a specific file being uploaded.","         * The possible values are: ","         * <ul>","         *   <li> <strong>`UploaderQueue.CONTINUE`</strong>: the error is ignored and the upload process is continued.</li>","         *   <li> <strong>`UploaderQueue.STOP`</strong>: the upload process is stopped as soon as any other parallel file","         *     uploads are finished.</li>","         *   <li> <strong>`UploaderQueue.RESTART_ASAP`</strong>: the file is added back to the front of the queue.</li>","         *   <li> <strong>`UploaderQueue.RESTART_AFTER`</strong>: the file is added to the back of the queue.</li>","         * </ul>","         * @attribute errorAction","         * @type {String}","         * @default UploaderQueue.CONTINUE","         */","        errorAction: {","            value: \"continue\",","            validator: function (val, name) {","                 return (val === UploaderQueue.CONTINUE || val === UploaderQueue.STOP || val === UploaderQueue.RESTART_ASAP || val === UploaderQueue.RESTART_AFTER);           ","             }","        },","","        /**","         * An array indicating what fileFilters should be applied to the file","         * selection dialog. Each element in the array should be an object with","         * the following key-value pairs:","         * {","         *   description : String           ","             extensions: String of the form &lquot;*.ext1;*.ext2;*.ext3;...&rquot;","         * }","         * @attribute fileFilters","         * @type {Array}","         * @default []","         */","        fileFilters: {","          value: []","        },","","        /**","         * A filtering function that is applied to every file selected by the user.","         * The function receives the `Y.File` object and must return a Boolean value.","         * If a `false` value is returned, the file in question is not added to the","         * list of files to be uploaded.","         * Use this function to put limits on file sizes or check the file names for","         * correct extension, but make sure that a server-side check is also performed,","         * since any client-side restrictions are only advisory and can be circumvented.","         *","         * @attribute fileFilterFunction","         * @type {Function}","         * @default null","         */","        fileFilterFunction: {","          value: null","        },","         ","        /**","         * A String specifying what should be the POST field name for the file","         * content in the upload request.","         *","         * @attribute fileFieldName","         * @type {String}","         * @default Filedata","         */","        fileFieldName: {","          value: \"Filedata\"","        },","","        /**","         * The array of files to be uploaded. All elements in the array","       * must be instances of `Y.FileFlash` and be instantiated with a `fileId`","       * retrieved from an instance of the uploader.","         *","         * @attribute fileList","         * @type {Array}","         * @default []","         */","        fileList: {","          value: [],","          getter: \"_getFileList\",","          setter: \"_setFileList\"","        },","","        /**","         * A Boolean indicating whether multiple file selection is enabled.","         *","         * @attribute multipleFiles","         * @type {Boolean}","         * @default false","         */","        multipleFiles: {","          value: false","        },","","        /**","         * An object, keyed by `fileId`, containing sets of key-value pairs","         * that should be passed as POST variables along with each corresponding","         * file. This attribute is only used if no POST variables are specifed","         * in the upload method call.","         *","         * @attribute postVarsPerFile","         * @type {Object}","         * @default {}","         */","        postVarsPerFile: {","          value: {}","        },","","        /**","         * The label for the \"Select Files\" widget. This is the value that replaces the","         * `{selectButtonLabel}` token in the `SELECT_FILES_BUTTON` template.","         * ","         * @attribute selectButtonLabel","         * @type {String}","         * @default \"Select Files\"","         */","        selectButtonLabel: {","            value: \"Select Files\"","        },","","        /**","         * The widget that serves as the \"Select Files\" control for the file uploader","         * ","         *","         * @attribute selectFilesButton","         * @type {Node | Widget}","         * @default A standard HTML button with YUI CSS Button skin.","         */","        selectFilesButton : {","           valueFn: function () {","                     return Y.Node.create(substitute(Y.UploaderFlash.SELECT_FILES_BUTTON, {selectButtonLabel: this.get(\"selectButtonLabel\")}));","                 }","         },","     ","        /**","         * The number of files that can be uploaded","         * simultaneously if the automatic queue management","         * is used. This value can be in the range between 2","         * and 5.","         *","         * @attribute simLimit","         * @type {Number}","         * @default 2","         */","        simLimit: {","                value: 2,","                validator: function (val, name) {","                    return (val >= 2 && val <= 5);","                }","            },","","        /**","         * The URL to the SWF file of the flash uploader. A copy local to","         * the server that hosts the page on which the uploader appears is","         * recommended.","         *","         * @attribute swfURL","         * @type {String}","         * @default \"CDN Prefix + uploader/assets/flashuploader.swf\" with a ","         * random GET parameter for IE (to prevent buggy behavior when the SWF ","         * is cached).","         */","        swfURL: {","          valueFn: function () {","            var prefix = Y.Env.cdn + \"uploader/assets/flashuploader.swf\";","","            if (Y.UA.ie > 0) {","              return (prefix + \"?t=\" + Y.guid(\"uploader\"));","            }","            return prefix;","          }","        },","","        /**","         * The id's or `Node` references of the DOM elements that precede","         * and follow the `Select Files` button in the tab order. Specifying","         * these allows keyboard navigation to and from the Flash player","         * layer of the uploader.","         * The two keys corresponding to the DOM elements are:","           <ul>","         *   <li> `from`: the id or the `Node` reference corresponding to the","         *     DOM element that precedes the `Select Files` button in the tab order.</li>","         *   <li> `to`: the id or the `Node` reference corresponding to the","         *     DOM element that follows the `Select Files` button in the tab order.</li>","         * </ul>","         * @attribute tabElements","         * @type {Object}","         * @default null","         */","        tabElements: {","            value: null","        },","","        /**","         * The URL to which file upload requested are POSTed. Only used if a different url is not passed to the upload method call.","         *","         * @attribute uploadURL","         * @type {String}","         * @default \"\"","         */","        uploadURL: {","          value: \"\"","        },","","        /**","         * The number of times to try re-uploading a file that failed to upload before","         * cancelling its upload.","         *","         * @attribute retryCount","         * @type {Number}","         * @default 3","         */ ","         retryCount: {","           value: 3","         }","  }","});","","Y.UploaderFlash.Queue = UploaderQueue;","","","","","}, '3.7.3', {\"requires\": [\"swf\", \"widget\", \"substitute\", \"base\", \"cssbutton\", \"node\", \"event-custom\", \"file-flash\", \"uploader-queue\"]});"];
_yuitest_coverage["build/uploader-flash/uploader-flash.js"].lines = {"1":0,"14":0,"30":0,"31":0,"36":0,"107":0,"108":0,"109":0,"110":0,"111":0,"112":0,"113":0,"129":0,"137":0,"152":0,"171":0,"188":0,"205":0,"213":0,"234":0,"242":0,"250":0,"258":0,"266":0,"274":0,"290":0,"294":0,"295":0,"296":0,"297":0,"299":0,"300":0,"307":0,"321":0,"322":0,"323":0,"324":0,"325":0,"326":0,"327":0,"328":0,"329":0,"332":0,"338":0,"339":0,"340":0,"341":0,"342":0,"345":0,"346":0,"347":0,"348":0,"351":0,"352":0,"353":0,"354":0,"356":0,"357":0,"358":0,"359":0,"361":0,"362":0,"363":0,"364":0,"365":0,"366":0,"381":0,"383":0,"384":0,"385":0,"386":0,"387":0,"388":0,"389":0,"392":0,"395":0,"396":0,"399":0,"400":0,"401":0,"402":0,"403":0,"404":0,"405":0,"408":0,"409":0,"410":0,"411":0,"412":0,"413":0,"414":0,"417":0,"418":0,"420":0,"421":0,"423":0,"424":0,"425":0,"426":0,"427":0,"428":0,"429":0,"444":0,"445":0,"448":0,"461":0,"462":0,"477":0,"478":0,"490":0,"491":0,"492":0,"493":0,"496":0,"497":0,"498":0,"509":0,"519":0,"520":0,"535":0,"536":0,"539":0,"545":0,"546":0,"547":0,"548":0,"549":0,"550":0,"551":0,"552":0,"553":0,"555":0,"558":0,"559":0,"560":0,"561":0,"562":0,"567":0,"568":0,"572":0,"573":0,"575":0,"578":0,"594":0,"596":0,"597":0,"599":0,"600":0,"602":0,"603":0,"605":0,"606":0,"608":0,"609":0,"610":0,"613":0,"614":0,"617":0,"618":0,"637":0,"641":0,"643":0,"645":0,"646":0,"647":0,"648":0,"649":0,"651":0,"664":0,"677":0,"678":0,"681":0,"689":0,"690":0,"691":0,"692":0,"693":0,"694":0,"695":0,"696":0,"698":0,"831":0,"942":0,"959":0,"976":0,"978":0,"979":0,"981":0,"1030":0};
_yuitest_coverage["build/uploader-flash/uploader-flash.js"].functions = {"UploaderFlash:30":0,"initializer:104":0,"renderUI:289":0,"(anonymous 2):321":0,"(anonymous 3):338":0,"(anonymous 4):345":0,"(anonymous 5):351":0,"(anonymous 6):356":0,"(anonymous 7):361":0,"bindUI:319":0,"(anonymous 8):399":0,"(anonymous 9):408":0,"(anonymous 11):417":0,"(anonymous 10):417":0,"(anonymous 13):418":0,"(anonymous 12):418":0,"(anonymous 14):420":0,"(anonymous 15):421":0,"_attachTabElements:380":0,"_setButtonClass:443":0,"_setFileFilters:460":0,"_setMultipleFiles:476":0,"_triggerEnabled:489":0,"_getFileList:508":0,"_setFileList:518":0,"(anonymous 16):545":0,"(anonymous 17):559":0,"(anonymous 18):567":0,"_updateFileList:533":0,"_uploadEventHandler:592":0,"upload:635":0,"uploadAll:663":0,"(anonymous 19):694":0,"uploadThese:676":0,"validator:830":0,"valueFn:941":0,"validator:958":0,"valueFn:975":0,"(anonymous 1):1":0};
_yuitest_coverage["build/uploader-flash/uploader-flash.js"].coveredLines = 189;
_yuitest_coverage["build/uploader-flash/uploader-flash.js"].coveredFunctions = 39;
_yuitest_coverline("build/uploader-flash/uploader-flash.js", 1);
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
_yuitest_coverfunc("build/uploader-flash/uploader-flash.js", "(anonymous 1)", 1);
_yuitest_coverline("build/uploader-flash/uploader-flash.js", 14);
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

_yuitest_coverline("build/uploader-flash/uploader-flash.js", 30);
function UploaderFlash(config) {
  _yuitest_coverfunc("build/uploader-flash/uploader-flash.js", "UploaderFlash", 30);
_yuitest_coverline("build/uploader-flash/uploader-flash.js", 31);
UploaderFlash.superclass.constructor.apply ( this, arguments );
}



_yuitest_coverline("build/uploader-flash/uploader-flash.js", 36);
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
    _yuitest_coverfunc("build/uploader-flash/uploader-flash.js", "initializer", 104);
_yuitest_coverline("build/uploader-flash/uploader-flash.js", 107);
this._swfContainerId = Y.guid("uploader");
    _yuitest_coverline("build/uploader-flash/uploader-flash.js", 108);
this._swfReference = null;
    _yuitest_coverline("build/uploader-flash/uploader-flash.js", 109);
this.queue = null;
    _yuitest_coverline("build/uploader-flash/uploader-flash.js", 110);
this._buttonState = "up";
    _yuitest_coverline("build/uploader-flash/uploader-flash.js", 111);
this._buttonFocus = null;
    _yuitest_coverline("build/uploader-flash/uploader-flash.js", 112);
this._tabElementBindings = null;
    _yuitest_coverline("build/uploader-flash/uploader-flash.js", 113);
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
    _yuitest_coverline("build/uploader-flash/uploader-flash.js", 129);
this.publish("fileselect");

   /**
    * Signals that an upload of multiple files has been started. 
    *
    * @event uploadstart
    * @param event {Event} The event object for the `uploadstart`.
    */
    _yuitest_coverline("build/uploader-flash/uploader-flash.js", 137);
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
    _yuitest_coverline("build/uploader-flash/uploader-flash.js", 152);
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
    _yuitest_coverline("build/uploader-flash/uploader-flash.js", 171);
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
    _yuitest_coverline("build/uploader-flash/uploader-flash.js", 188);
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
    _yuitest_coverline("build/uploader-flash/uploader-flash.js", 205);
this.publish("uploadcomplete");

   /**
    * Signals that the upload process of the entire file list has been completed. 
    *
    * @event alluploadscomplete
    * @param event {Event} The event object for the `alluploadscomplete`.
    */
    _yuitest_coverline("build/uploader-flash/uploader-flash.js", 213);
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
    _yuitest_coverline("build/uploader-flash/uploader-flash.js", 234);
this.publish("uploaderror");

   /**
    * Signals that a mouse has begun hovering over the `Select Files` button. 
    *
    * @event mouseenter
    * @param event {Event} The event object for the `mouseenter` event.
    */
    _yuitest_coverline("build/uploader-flash/uploader-flash.js", 242);
this.publish("mouseenter");

   /**
    * Signals that a mouse has stopped hovering over the `Select Files` button. 
    *
    * @event mouseleave
    * @param event {Event} The event object for the `mouseleave` event.
    */
    _yuitest_coverline("build/uploader-flash/uploader-flash.js", 250);
this.publish("mouseleave");

   /**
    * Signals that a mouse button has been pressed over the `Select Files` button. 
    *
    * @event mousedown
    * @param event {Event} The event object for the `mousedown` event.
    */
    _yuitest_coverline("build/uploader-flash/uploader-flash.js", 258);
this.publish("mousedown");

   /**
    * Signals that a mouse button has been released over the `Select Files` button. 
    *
    * @event mouseup
    * @param event {Event} The event object for the `mouseup` event.
    */
    _yuitest_coverline("build/uploader-flash/uploader-flash.js", 266);
this.publish("mouseup");

   /**
    * Signals that a mouse has been clicked over the `Select Files` button. 
    *
    * @event click
    * @param event {Event} The event object for the `click` event.
    */
    _yuitest_coverline("build/uploader-flash/uploader-flash.js", 274);
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
     _yuitest_coverfunc("build/uploader-flash/uploader-flash.js", "renderUI", 289);
_yuitest_coverline("build/uploader-flash/uploader-flash.js", 290);
var boundingBox = this.get("boundingBox"),
         contentBox = this.get('contentBox'),
         selFilesButton = this.get("selectFilesButton");
 
     _yuitest_coverline("build/uploader-flash/uploader-flash.js", 294);
boundingBox.setStyle("position", "relative");
     _yuitest_coverline("build/uploader-flash/uploader-flash.js", 295);
selFilesButton.setStyles({width: "100%", height: "100%"});
     _yuitest_coverline("build/uploader-flash/uploader-flash.js", 296);
contentBox.append(selFilesButton);
     _yuitest_coverline("build/uploader-flash/uploader-flash.js", 297);
contentBox.append(Y.Node.create(substitute(UploaderFlash.FLASH_CONTAINER, 
                                              {swfContainerId: this._swfContainerId})));
     _yuitest_coverline("build/uploader-flash/uploader-flash.js", 299);
var flashContainer = Y.one("#" + this._swfContainerId);
     _yuitest_coverline("build/uploader-flash/uploader-flash.js", 300);
var params = {version: "10.0.45",
                     fixedAttributes: {wmode: "transparent", 
                                       allowScriptAccess:"always", 
                                       allowNetworking:"all", 
                                       scale: "noscale"
                                      }
                    };
     _yuitest_coverline("build/uploader-flash/uploader-flash.js", 307);
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

    _yuitest_coverfunc("build/uploader-flash/uploader-flash.js", "bindUI", 319);
_yuitest_coverline("build/uploader-flash/uploader-flash.js", 321);
this._swfReference.on("swfReady", function () {
      _yuitest_coverfunc("build/uploader-flash/uploader-flash.js", "(anonymous 2)", 321);
_yuitest_coverline("build/uploader-flash/uploader-flash.js", 322);
this._setMultipleFiles();
      _yuitest_coverline("build/uploader-flash/uploader-flash.js", 323);
this._setFileFilters();
      _yuitest_coverline("build/uploader-flash/uploader-flash.js", 324);
this._triggerEnabled();
      _yuitest_coverline("build/uploader-flash/uploader-flash.js", 325);
this._attachTabElements();
      _yuitest_coverline("build/uploader-flash/uploader-flash.js", 326);
this.after("multipleFilesChange", this._setMultipleFiles, this);
      _yuitest_coverline("build/uploader-flash/uploader-flash.js", 327);
this.after("fileFiltersChange", this._setFileFilters, this);
      _yuitest_coverline("build/uploader-flash/uploader-flash.js", 328);
this.after("enabledChange", this._triggerEnabled, this);
      _yuitest_coverline("build/uploader-flash/uploader-flash.js", 329);
this.after("tabElementsChange", this._attachTabElements);
    }, this);
        
    _yuitest_coverline("build/uploader-flash/uploader-flash.js", 332);
this._swfReference.on("fileselect", this._updateFileList, this);



        // this._swfReference.on("trace", function (ev) {console.log(ev.message);});

        _yuitest_coverline("build/uploader-flash/uploader-flash.js", 338);
this._swfReference.on("mouseenter", function () {
            _yuitest_coverfunc("build/uploader-flash/uploader-flash.js", "(anonymous 3)", 338);
_yuitest_coverline("build/uploader-flash/uploader-flash.js", 339);
this.fire("mouseenter");
            _yuitest_coverline("build/uploader-flash/uploader-flash.js", 340);
this._setButtonClass("hover", true);
            _yuitest_coverline("build/uploader-flash/uploader-flash.js", 341);
if (this._buttonState == "down") {
                _yuitest_coverline("build/uploader-flash/uploader-flash.js", 342);
this._setButtonClass("active", true);
            }
        }, this);
        _yuitest_coverline("build/uploader-flash/uploader-flash.js", 345);
this._swfReference.on("mouseleave", function () {
            _yuitest_coverfunc("build/uploader-flash/uploader-flash.js", "(anonymous 4)", 345);
_yuitest_coverline("build/uploader-flash/uploader-flash.js", 346);
this.fire("mouseleave");
            _yuitest_coverline("build/uploader-flash/uploader-flash.js", 347);
this._setButtonClass("hover", false);
            _yuitest_coverline("build/uploader-flash/uploader-flash.js", 348);
this._setButtonClass("active", false);
            
        }, this);
        _yuitest_coverline("build/uploader-flash/uploader-flash.js", 351);
this._swfReference.on("mousedown", function () {
            _yuitest_coverfunc("build/uploader-flash/uploader-flash.js", "(anonymous 5)", 351);
_yuitest_coverline("build/uploader-flash/uploader-flash.js", 352);
this.fire("mousedown");
            _yuitest_coverline("build/uploader-flash/uploader-flash.js", 353);
this._buttonState = "down";
            _yuitest_coverline("build/uploader-flash/uploader-flash.js", 354);
this._setButtonClass("active", true);
        }, this);
        _yuitest_coverline("build/uploader-flash/uploader-flash.js", 356);
this._swfReference.on("mouseup", function () {
            _yuitest_coverfunc("build/uploader-flash/uploader-flash.js", "(anonymous 6)", 356);
_yuitest_coverline("build/uploader-flash/uploader-flash.js", 357);
this.fire("mouseup");
            _yuitest_coverline("build/uploader-flash/uploader-flash.js", 358);
this._buttonState = "up";
            _yuitest_coverline("build/uploader-flash/uploader-flash.js", 359);
this._setButtonClass("active", false);
        }, this);
        _yuitest_coverline("build/uploader-flash/uploader-flash.js", 361);
this._swfReference.on("click", function () {
            _yuitest_coverfunc("build/uploader-flash/uploader-flash.js", "(anonymous 7)", 361);
_yuitest_coverline("build/uploader-flash/uploader-flash.js", 362);
this.fire("click");
            _yuitest_coverline("build/uploader-flash/uploader-flash.js", 363);
this._buttonFocus = true;
            _yuitest_coverline("build/uploader-flash/uploader-flash.js", 364);
this._setButtonClass("focus", true);
            _yuitest_coverline("build/uploader-flash/uploader-flash.js", 365);
Y.one("body").focus();
            _yuitest_coverline("build/uploader-flash/uploader-flash.js", 366);
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
      _yuitest_coverfunc("build/uploader-flash/uploader-flash.js", "_attachTabElements", 380);
_yuitest_coverline("build/uploader-flash/uploader-flash.js", 381);
if (this.get("tabElements") !== null && this.get("tabElements").from !== null && this.get("tabElements").to !== null) {

        _yuitest_coverline("build/uploader-flash/uploader-flash.js", 383);
if (this._tabElementBindings !== null) {
          _yuitest_coverline("build/uploader-flash/uploader-flash.js", 384);
this._tabElementBindings.from.detach();
          _yuitest_coverline("build/uploader-flash/uploader-flash.js", 385);
this._tabElementBindings.to.detach();
          _yuitest_coverline("build/uploader-flash/uploader-flash.js", 386);
this._tabElementBindings.tabback.detach();
          _yuitest_coverline("build/uploader-flash/uploader-flash.js", 387);
this._tabElementBindings.tabforward.detach();
          _yuitest_coverline("build/uploader-flash/uploader-flash.js", 388);
this._tabElementBindings.focus.detach();
          _yuitest_coverline("build/uploader-flash/uploader-flash.js", 389);
this._tabElementBindings.blur.detach();
        }
        else {
          _yuitest_coverline("build/uploader-flash/uploader-flash.js", 392);
this._tabElementBindings = {};
        }

          _yuitest_coverline("build/uploader-flash/uploader-flash.js", 395);
var fromElement = Y.one(this.get("tabElements").from);
          _yuitest_coverline("build/uploader-flash/uploader-flash.js", 396);
var toElement = Y.one(this.get("tabElements").to);


          _yuitest_coverline("build/uploader-flash/uploader-flash.js", 399);
this._tabElementBindings.from = fromElement.on("keydown", function (ev) { 
                                                    _yuitest_coverfunc("build/uploader-flash/uploader-flash.js", "(anonymous 8)", 399);
_yuitest_coverline("build/uploader-flash/uploader-flash.js", 400);
if (ev.keyCode == 9 && !ev.shiftKey) {
                                                        _yuitest_coverline("build/uploader-flash/uploader-flash.js", 401);
ev.preventDefault();
                                                        _yuitest_coverline("build/uploader-flash/uploader-flash.js", 402);
this._swfReference._swf.setAttribute("tabindex", 0); 
                                                        _yuitest_coverline("build/uploader-flash/uploader-flash.js", 403);
this._swfReference._swf.setAttribute("role", "button");
                                                        _yuitest_coverline("build/uploader-flash/uploader-flash.js", 404);
this._swfReference._swf.setAttribute("aria-label", this.get("selectButtonLabel"));
                                                        _yuitest_coverline("build/uploader-flash/uploader-flash.js", 405);
this._swfReference._swf.focus();
                                                    }
                                                  }, this);
          _yuitest_coverline("build/uploader-flash/uploader-flash.js", 408);
this._tabElementBindings.to = toElement.on("keydown", function (ev) { 
                                                    _yuitest_coverfunc("build/uploader-flash/uploader-flash.js", "(anonymous 9)", 408);
_yuitest_coverline("build/uploader-flash/uploader-flash.js", 409);
if (ev.keyCode == 9 && ev.shiftKey) {
                                                        _yuitest_coverline("build/uploader-flash/uploader-flash.js", 410);
ev.preventDefault();
                                                        _yuitest_coverline("build/uploader-flash/uploader-flash.js", 411);
this._swfReference._swf.setAttribute("tabindex", 0); 
                                                        _yuitest_coverline("build/uploader-flash/uploader-flash.js", 412);
this._swfReference._swf.setAttribute("role", "button");
                                                        _yuitest_coverline("build/uploader-flash/uploader-flash.js", 413);
this._swfReference._swf.setAttribute("aria-label", this.get("selectButtonLabel"));
                                                        _yuitest_coverline("build/uploader-flash/uploader-flash.js", 414);
this._swfReference._swf.focus();
                                                    }
                                                  }, this);
          _yuitest_coverline("build/uploader-flash/uploader-flash.js", 417);
this._tabElementBindings.tabback = this._swfReference.on("tabback", function (ev) {_yuitest_coverfunc("build/uploader-flash/uploader-flash.js", "(anonymous 10)", 417);
this._swfReference._swf.blur(); setTimeout(function () {_yuitest_coverfunc("build/uploader-flash/uploader-flash.js", "(anonymous 11)", 417);
fromElement.focus();}, 30);}, this);
          _yuitest_coverline("build/uploader-flash/uploader-flash.js", 418);
this._tabElementBindings.tabforward = this._swfReference.on("tabforward", function (ev) {_yuitest_coverfunc("build/uploader-flash/uploader-flash.js", "(anonymous 12)", 418);
this._swfReference._swf.blur(); setTimeout(function () {_yuitest_coverfunc("build/uploader-flash/uploader-flash.js", "(anonymous 13)", 418);
toElement.focus();}, 30);}, this);

          _yuitest_coverline("build/uploader-flash/uploader-flash.js", 420);
this._tabElementBindings.focus = this._swfReference._swf.on("focus", function (ev) {_yuitest_coverfunc("build/uploader-flash/uploader-flash.js", "(anonymous 14)", 420);
this._buttonFocus = true; this._setButtonClass("focus", true);}, this);
          _yuitest_coverline("build/uploader-flash/uploader-flash.js", 421);
this._tabElementBindings.blur = this._swfReference._swf.on("blur", function (ev) {_yuitest_coverfunc("build/uploader-flash/uploader-flash.js", "(anonymous 15)", 421);
this._buttonFocus = false; this._setButtonClass("focus", false);}, this);
      }
      else {_yuitest_coverline("build/uploader-flash/uploader-flash.js", 423);
if (this._tabElementBindings !== null) {
          _yuitest_coverline("build/uploader-flash/uploader-flash.js", 424);
this._tabElementBindings.from.detach();
          _yuitest_coverline("build/uploader-flash/uploader-flash.js", 425);
this._tabElementBindings.to.detach();
          _yuitest_coverline("build/uploader-flash/uploader-flash.js", 426);
this._tabElementBindings.tabback.detach();
          _yuitest_coverline("build/uploader-flash/uploader-flash.js", 427);
this._tabElementBindings.tabforward.detach();
          _yuitest_coverline("build/uploader-flash/uploader-flash.js", 428);
this._tabElementBindings.focus.detach();
          _yuitest_coverline("build/uploader-flash/uploader-flash.js", 429);
this._tabElementBindings.blur.detach();
      }}
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
      _yuitest_coverfunc("build/uploader-flash/uploader-flash.js", "_setButtonClass", 443);
_yuitest_coverline("build/uploader-flash/uploader-flash.js", 444);
if (add) {
          _yuitest_coverline("build/uploader-flash/uploader-flash.js", 445);
this.get("selectFilesButton").addClass(this.get("buttonClassNames")[state]);
      }
      else {
          _yuitest_coverline("build/uploader-flash/uploader-flash.js", 448);
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
          _yuitest_coverfunc("build/uploader-flash/uploader-flash.js", "_setFileFilters", 460);
_yuitest_coverline("build/uploader-flash/uploader-flash.js", 461);
if (this._swfReference && this.get("fileFilters").length > 0) {
            _yuitest_coverline("build/uploader-flash/uploader-flash.js", 462);
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
        _yuitest_coverfunc("build/uploader-flash/uploader-flash.js", "_setMultipleFiles", 476);
_yuitest_coverline("build/uploader-flash/uploader-flash.js", 477);
if (this._swfReference) {
      _yuitest_coverline("build/uploader-flash/uploader-flash.js", 478);
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
      _yuitest_coverfunc("build/uploader-flash/uploader-flash.js", "_triggerEnabled", 489);
_yuitest_coverline("build/uploader-flash/uploader-flash.js", 490);
if (this.get("enabled")) {
        _yuitest_coverline("build/uploader-flash/uploader-flash.js", 491);
this._swfReference.callSWF("enable");
        _yuitest_coverline("build/uploader-flash/uploader-flash.js", 492);
this._swfReference._swf.setAttribute("aria-disabled", "false");
        _yuitest_coverline("build/uploader-flash/uploader-flash.js", 493);
this._setButtonClass("disabled", false);
      }
      else {
        _yuitest_coverline("build/uploader-flash/uploader-flash.js", 496);
this._swfReference.callSWF("disable");
        _yuitest_coverline("build/uploader-flash/uploader-flash.js", 497);
this._swfReference._swf.setAttribute("aria-disabled", "true");
        _yuitest_coverline("build/uploader-flash/uploader-flash.js", 498);
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
        _yuitest_coverfunc("build/uploader-flash/uploader-flash.js", "_getFileList", 508);
_yuitest_coverline("build/uploader-flash/uploader-flash.js", 509);
return this._fileList.concat();
    },

  /**
   * Setter for the `fileList` attribute
   * 
   * @method _setFileList
   * @private
   */
    _setFileList : function (val) {
        _yuitest_coverfunc("build/uploader-flash/uploader-flash.js", "_setFileList", 518);
_yuitest_coverline("build/uploader-flash/uploader-flash.js", 519);
this._fileList = val.concat();
        _yuitest_coverline("build/uploader-flash/uploader-flash.js", 520);
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
     
     _yuitest_coverfunc("build/uploader-flash/uploader-flash.js", "_updateFileList", 533);
_yuitest_coverline("build/uploader-flash/uploader-flash.js", 535);
Y.one("body").focus();
     _yuitest_coverline("build/uploader-flash/uploader-flash.js", 536);
this._swfReference._swf.focus();


     _yuitest_coverline("build/uploader-flash/uploader-flash.js", 539);
var newfiles = ev.fileList,
         fileConfObjects = [],
         parsedFiles = [],
         swfRef = this._swfReference,
         filterFunc = this.get("fileFilterFunction");
 
     _yuitest_coverline("build/uploader-flash/uploader-flash.js", 545);
Y.each(newfiles, function (value) {
       _yuitest_coverfunc("build/uploader-flash/uploader-flash.js", "(anonymous 16)", 545);
_yuitest_coverline("build/uploader-flash/uploader-flash.js", 546);
var newFileConf = {};
       _yuitest_coverline("build/uploader-flash/uploader-flash.js", 547);
newFileConf.id = value.fileId;
       _yuitest_coverline("build/uploader-flash/uploader-flash.js", 548);
newFileConf.name = value.fileReference.name;
       _yuitest_coverline("build/uploader-flash/uploader-flash.js", 549);
newFileConf.size = value.fileReference.size;
       _yuitest_coverline("build/uploader-flash/uploader-flash.js", 550);
newFileConf.type = value.fileReference.type;
       _yuitest_coverline("build/uploader-flash/uploader-flash.js", 551);
newFileConf.dateCreated = value.fileReference.creationDate;
       _yuitest_coverline("build/uploader-flash/uploader-flash.js", 552);
newFileConf.dateModified = value.fileReference.modificationDate;
       _yuitest_coverline("build/uploader-flash/uploader-flash.js", 553);
newFileConf.uploader = swfRef;

       _yuitest_coverline("build/uploader-flash/uploader-flash.js", 555);
fileConfObjects.push(newFileConf);
     });

       _yuitest_coverline("build/uploader-flash/uploader-flash.js", 558);
if (filterFunc) {
          _yuitest_coverline("build/uploader-flash/uploader-flash.js", 559);
Y.each(fileConfObjects, function (value) {
            _yuitest_coverfunc("build/uploader-flash/uploader-flash.js", "(anonymous 17)", 559);
_yuitest_coverline("build/uploader-flash/uploader-flash.js", 560);
var newfile = new Y.FileFlash(value);
            _yuitest_coverline("build/uploader-flash/uploader-flash.js", 561);
if (filterFunc(newfile)) {
                _yuitest_coverline("build/uploader-flash/uploader-flash.js", 562);
parsedFiles.push(newfile);
            }
          });
       }
       else {
          _yuitest_coverline("build/uploader-flash/uploader-flash.js", 567);
Y.each(fileConfObjects, function (value) {
            _yuitest_coverfunc("build/uploader-flash/uploader-flash.js", "(anonymous 18)", 567);
_yuitest_coverline("build/uploader-flash/uploader-flash.js", 568);
parsedFiles.push(new Y.FileFlash(value));
          });
       }

     _yuitest_coverline("build/uploader-flash/uploader-flash.js", 572);
if (parsedFiles.length > 0) {
        _yuitest_coverline("build/uploader-flash/uploader-flash.js", 573);
var oldfiles = this.get("fileList");

        _yuitest_coverline("build/uploader-flash/uploader-flash.js", 575);
this.set("fileList", 
                 this.get("appendNewFiles") ? oldfiles.concat(parsedFiles) : parsedFiles );

        _yuitest_coverline("build/uploader-flash/uploader-flash.js", 578);
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
  
    _yuitest_coverfunc("build/uploader-flash/uploader-flash.js", "_uploadEventHandler", 592);
_yuitest_coverline("build/uploader-flash/uploader-flash.js", 594);
switch (event.type) {
                case "file:uploadstart":
                   _yuitest_coverline("build/uploader-flash/uploader-flash.js", 596);
this.fire("fileuploadstart", event);
                _yuitest_coverline("build/uploader-flash/uploader-flash.js", 597);
break;
                case "file:uploadprogress":
                   _yuitest_coverline("build/uploader-flash/uploader-flash.js", 599);
this.fire("uploadprogress", event);
                _yuitest_coverline("build/uploader-flash/uploader-flash.js", 600);
break;
                case "uploaderqueue:totaluploadprogress":
                   _yuitest_coverline("build/uploader-flash/uploader-flash.js", 602);
this.fire("totaluploadprogress", event);
                _yuitest_coverline("build/uploader-flash/uploader-flash.js", 603);
break;
                case "file:uploadcomplete":
                   _yuitest_coverline("build/uploader-flash/uploader-flash.js", 605);
this.fire("uploadcomplete", event);
                _yuitest_coverline("build/uploader-flash/uploader-flash.js", 606);
break;
                case "uploaderqueue:alluploadscomplete":
                   _yuitest_coverline("build/uploader-flash/uploader-flash.js", 608);
this.queue = null;
                   _yuitest_coverline("build/uploader-flash/uploader-flash.js", 609);
this.fire("alluploadscomplete", event);
                _yuitest_coverline("build/uploader-flash/uploader-flash.js", 610);
break;
                case "file:uploaderror":
                case "uploaderqueue:uploaderror":
                   _yuitest_coverline("build/uploader-flash/uploader-flash.js", 613);
this.fire("uploaderror", event);
                _yuitest_coverline("build/uploader-flash/uploader-flash.js", 614);
break;
                case "file:uploadcancel":
                case "uploaderqueue:uploadcancel":
                   _yuitest_coverline("build/uploader-flash/uploader-flash.js", 617);
this.fire("uploadcancel", event);
                _yuitest_coverline("build/uploader-flash/uploader-flash.js", 618);
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
        
        _yuitest_coverfunc("build/uploader-flash/uploader-flash.js", "upload", 635);
_yuitest_coverline("build/uploader-flash/uploader-flash.js", 637);
var uploadURL = url || this.get("uploadURL"),
            postVars = postvars || this.get("postVarsPerFile"),
            fileId = file.get("id");

            _yuitest_coverline("build/uploader-flash/uploader-flash.js", 641);
postVars = postVars.hasOwnProperty(fileId) ? postVars[fileId] : postVars;

        _yuitest_coverline("build/uploader-flash/uploader-flash.js", 643);
if (file instanceof Y.FileFlash) {
           
            _yuitest_coverline("build/uploader-flash/uploader-flash.js", 645);
file.on("uploadstart", this._uploadEventHandler, this);
            _yuitest_coverline("build/uploader-flash/uploader-flash.js", 646);
file.on("uploadprogress", this._uploadEventHandler, this);
            _yuitest_coverline("build/uploader-flash/uploader-flash.js", 647);
file.on("uploadcomplete", this._uploadEventHandler, this);
            _yuitest_coverline("build/uploader-flash/uploader-flash.js", 648);
file.on("uploaderror", this._uploadEventHandler, this);
            _yuitest_coverline("build/uploader-flash/uploader-flash.js", 649);
file.on("uploadcancel", this._uploadEventHandler, this);

            _yuitest_coverline("build/uploader-flash/uploader-flash.js", 651);
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
        _yuitest_coverfunc("build/uploader-flash/uploader-flash.js", "uploadAll", 663);
_yuitest_coverline("build/uploader-flash/uploader-flash.js", 664);
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
    _yuitest_coverfunc("build/uploader-flash/uploader-flash.js", "uploadThese", 676);
_yuitest_coverline("build/uploader-flash/uploader-flash.js", 677);
if (!this.queue) {
        _yuitest_coverline("build/uploader-flash/uploader-flash.js", 678);
var uploadURL = url || this.get("uploadURL"),
            postVars = postvars || this.get("postVarsPerFile");

           _yuitest_coverline("build/uploader-flash/uploader-flash.js", 681);
this.queue = new UploaderQueue({simUploads: this.get("simLimit"), 
                                           errorAction: this.get("errorAction"),
                                           fileFieldName: this.get("fileFieldName"),
                                           fileList: files,
                                           uploadURL: uploadURL,
                                           perFileParameters: postVars,
                                           retryCount: this.get("retryCount")
                                               });
           _yuitest_coverline("build/uploader-flash/uploader-flash.js", 689);
this.queue.on("uploadstart", this._uploadEventHandler, this);
           _yuitest_coverline("build/uploader-flash/uploader-flash.js", 690);
this.queue.on("uploadprogress", this._uploadEventHandler, this);
           _yuitest_coverline("build/uploader-flash/uploader-flash.js", 691);
this.queue.on("totaluploadprogress", this._uploadEventHandler, this);
           _yuitest_coverline("build/uploader-flash/uploader-flash.js", 692);
this.queue.on("uploadcomplete", this._uploadEventHandler, this);
           _yuitest_coverline("build/uploader-flash/uploader-flash.js", 693);
this.queue.on("alluploadscomplete", this._uploadEventHandler, this);
           _yuitest_coverline("build/uploader-flash/uploader-flash.js", 694);
this.queue.on("alluploadscancelled", function (ev) {_yuitest_coverfunc("build/uploader-flash/uploader-flash.js", "(anonymous 19)", 694);
this.queue = null;}, this);
           _yuitest_coverline("build/uploader-flash/uploader-flash.js", 695);
this.queue.on("uploaderror", this._uploadEventHandler, this);
           _yuitest_coverline("build/uploader-flash/uploader-flash.js", 696);
this.queue.startUpload();  
           
           _yuitest_coverline("build/uploader-flash/uploader-flash.js", 698);
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
                 _yuitest_coverfunc("build/uploader-flash/uploader-flash.js", "validator", 830);
_yuitest_coverline("build/uploader-flash/uploader-flash.js", 831);
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
                     _yuitest_coverfunc("build/uploader-flash/uploader-flash.js", "valueFn", 941);
_yuitest_coverline("build/uploader-flash/uploader-flash.js", 942);
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
                    _yuitest_coverfunc("build/uploader-flash/uploader-flash.js", "validator", 958);
_yuitest_coverline("build/uploader-flash/uploader-flash.js", 959);
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
            _yuitest_coverfunc("build/uploader-flash/uploader-flash.js", "valueFn", 975);
_yuitest_coverline("build/uploader-flash/uploader-flash.js", 976);
var prefix = Y.Env.cdn + "uploader/assets/flashuploader.swf";

            _yuitest_coverline("build/uploader-flash/uploader-flash.js", 978);
if (Y.UA.ie > 0) {
              _yuitest_coverline("build/uploader-flash/uploader-flash.js", 979);
return (prefix + "?t=" + Y.guid("uploader"));
            }
            _yuitest_coverline("build/uploader-flash/uploader-flash.js", 981);
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

_yuitest_coverline("build/uploader-flash/uploader-flash.js", 1030);
Y.UploaderFlash.Queue = UploaderQueue;




}, '3.7.3', {"requires": ["swf", "widget", "substitute", "base", "cssbutton", "node", "event-custom", "file-flash", "uploader-queue"]});
