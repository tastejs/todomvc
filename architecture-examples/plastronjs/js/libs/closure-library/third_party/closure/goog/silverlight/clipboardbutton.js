// Copyright 2010 The Closure Library Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview A button that can access the native clipboard. Calls
 * out to silverlight when it's possible to do so.
 *
 * If the current browser does not support native clipboard access,
 * throw an error.
 *
 * @author nicksantos@google.com (Nick Santos)
 */

goog.provide('goog.silverlight.ClipboardButton');
goog.provide('goog.silverlight.ClipboardButtonType');
goog.provide('goog.silverlight.ClipboardEvent');
goog.provide('goog.silverlight.CopyButton');
goog.provide('goog.silverlight.PasteButton');
goog.provide('goog.silverlight.PasteButtonEvent');

goog.require('goog.asserts');
goog.require('goog.events.Event');
goog.require('goog.math.Size');
goog.require('goog.silverlight');
goog.require('goog.ui.Component');


/**
 * A button that can access the native clipboard, via Silverlight.
 *
 * If this is not a browser that supports native clipboard access,
 * throw an error.
 *
 * Clients should not instantiate this directly. Instead, use CopyButton
 * or PasteButton.
 *
 * @param {goog.silverlight.ClipboardButtonType} type Copy or Paste.
 * @param {Function} callback The callback function for copy or paste.
 * @param {goog.Uri} slResource The URI of ClosureClipboardButton.xap (The
 *     silverlight resource included in this package.)
 * @param {string} caption Text caption to display as the button's caption.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
 *     document interaction.
 * @constructor
 * @extends {goog.ui.Component}
 */
goog.silverlight.ClipboardButton =
    function(type, callback, slResource, caption, opt_domHelper) {
  // In an ideal world, we'd use some sort of transparent overlay over
  // an HTML-based button. Silverlight doesn't appear to allow this.
  // Silverlight only allows copy and paste in response to a
  // silverlight-managed click on a silverlight-rendered button,
  // and this button cannot be transparent.
  goog.asserts.assert(
      goog.silverlight.ClipboardButton.hasClipboardAccess(),
      'no clipboard access');

  goog.base(this, opt_domHelper);

  /**
   * The ID of the handler to pass to silverlight.
   * @type {string}
   * @private
   */
  this.callbackId_ = goog.asserts.assertString(
      goog.silverlight.getHandlerName(callback));

  /**
   * The button caption.
   * @type {string}
   * @private
   */
  this.caption_ = caption;

  /**
   * The compiled silverlight bundle.
   * @type {goog.Uri}
   * @private
   */
  this.slResource_ = slResource;

  /**
   * @type {goog.silverlight.ClipboardButtonType}
   * @private
   */
  this.type_ = type;

  /**
   * @type {goog.math.Size}
   * @private
   */
  this.size_ = goog.silverlight.ClipboardButton.DEFAULT_SIZE_;
};
goog.inherits(goog.silverlight.ClipboardButton, goog.ui.Component);


/**
 * The default size of the button.
 * @type {goog.math.Size}
 * @private
 */
goog.silverlight.ClipboardButton.DEFAULT_SIZE_ = new goog.math.Size(100, 30);


/**
 * Silverlight components need absolute sizing. Should be set before the
 * component is rendered.
 * @param {goog.math.Size} size The size of the component.
 */
goog.silverlight.ClipboardButton.prototype.setSize = function(size) {
  this.size_ = size;
};


/**
 * Creates the button's DOM.
 * @override
 */
goog.silverlight.ClipboardButton.prototype.createDom = function() {
  var dom = this.getDomHelper();
  var element = dom.createDom('div', goog.getCssName('goog-inline-block'));
  this.setElementInternal(element);

  var source = this.slResource_.toString();
  goog.silverlight.createObject(
      source, element, null,
      {version: '4.0',
       width: this.size_.width, height: this.size_.height}, null,
      ['buttonType=' + this.type_,
       'callbackName=' + this.callbackId_,
       'Content=' + this.caption_].join(','));
};


/** @return {boolean} If clipboard access is supported. */
goog.silverlight.ClipboardButton.hasClipboardAccess = function() {
  // TODO(nicksantos): Use IE execCommand if available.
  return goog.silverlight.isInstalled('4.0');
};


/** @inheritDoc */
goog.silverlight.ClipboardButton.prototype.disposeInternal = function() {
  goog.silverlight.disposeHandlerName(this.callbackId_);
  goog.base(this, 'disposeInternal');
};


/**
 * Whether the button should trigger a copy or a paste.
 * @enum
 * @private
 */
goog.silverlight.ClipboardButtonType = {
  COPY: 1,
  PASTE: 2
};


/**
 * A clipboard button event. By design, replicates IE's clipboard API.
 * @param {string} type The event type.
 * @param {string=} opt_data The data pasted, if this is a paste event.
 * @constructor
 * @extends {goog.events.Event}
 */
goog.silverlight.ClipboardEvent = function(type, opt_data) {
  goog.base(this, type);

  /**
   * @type {?string}
   * @private
   */
  this.data_ = opt_data || null;
};
goog.inherits(goog.silverlight.ClipboardEvent, goog.events.Event);


/** @return {?string} Data pasted from the clipboard. */
goog.silverlight.ClipboardEvent.prototype.getData = function() {
  return this.data_;
};


/** @param {string} data Data to put on the clipboard. */
goog.silverlight.ClipboardEvent.prototype.setData = function(data) {
  this.data_ = data;
};


/** @enum {string} */
goog.silverlight.ClipboardEventType = {
  COPY: 'copy',
  PASTE: 'paste'
};


/**
 * A button that can retrieve contents from the native clipboard.
 *
 * @param {goog.Uri} slResource The URI of ClosureClipboardButton.xap (the
 *     silverlight resource included in this package.
 * @param {string=} opt_caption Text caption to display as the button's caption.
 *     Defaults to 'Paste'.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
 *     document interaction.
 * @constructor
 * @extends {goog.silverlight.ClipboardButton}
 */
goog.silverlight.PasteButton =
    function(slResource, opt_caption, opt_domHelper) {
  /** @desc Label for the paste button */
  var MSG_DEFAULT_PASTE_BUTTON_CAPTION = goog.getMsg('Paste');
  var caption = opt_caption || MSG_DEFAULT_PASTE_BUTTON_CAPTION;

  goog.base(this,
            goog.silverlight.ClipboardButtonType.PASTE,
            goog.bind(this.handlePaste_, this),
            slResource,
            caption,
            opt_domHelper);
};
goog.inherits(goog.silverlight.PasteButton, goog.silverlight.ClipboardButton);


/** @param {string} content The native content that was pasted. */
goog.silverlight.PasteButton.prototype.handlePaste_ = function(content) {
  this.dispatchEvent(
      new goog.silverlight.ClipboardEvent(
          goog.silverlight.ClipboardEventType.PASTE,
          content));
};


/**
 * A button that can copy contents.
 *
 * @param {goog.Uri} slResource The URI of ClosureClipboardButton.xap (the
 *     silverlight resource included in this package.
 * @param {string=} opt_caption Text caption to display as the button's caption.
 *     Defaults to 'Copy'.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
 *     document interaction.
 * @constructor
 * @extends {goog.silverlight.ClipboardButton}
 */
goog.silverlight.CopyButton =
    function(slResource, opt_caption, opt_domHelper) {
  /** @desc Label for the copy button */
  var MSG_DEFAULT_COPY_BUTTON_CAPTION = goog.getMsg('Copy');
  var caption = opt_caption || MSG_DEFAULT_COPY_BUTTON_CAPTION;

  goog.base(this,
            goog.silverlight.ClipboardButtonType.COPY,
            goog.bind(this.handleCopy_, this),
            slResource,
            caption,
            opt_domHelper);
};
goog.inherits(goog.silverlight.CopyButton, goog.silverlight.ClipboardButton);


/** @return {string} The content to be copied to the clipboard. */
goog.silverlight.CopyButton.prototype.handleCopy_ = function() {
  var event = new goog.silverlight.ClipboardEvent(
      goog.silverlight.ClipboardEventType.COPY);
  this.dispatchEvent(event);
  return event.getData() || '';
};
