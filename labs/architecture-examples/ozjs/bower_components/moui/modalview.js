/**
 * Moui
 * OO-based UI behavior modules behind CardKit(mobile webapp framework)'s view components
 * 
 * using AMD (Asynchronous Module Definition) API with OzJS
 * see http://ozjs.org for details
 *
 * Copyright (C) 2010-2013, Dexter.Yy, MIT License
 * vim: et:ts=4:sw=4:sts=4
 */
define('moui/modalview', [
    'dollar',
    'mo/lang',
    'mo/template/string',
    'moui/overlay'
], function($, _, tpl, overlay) {

    var mix = _.mix,

        NS = 'mouiModalView',
        TPL_VIEW =
           '<div id="{{id}}" class="{{cname}}">\
                <div class="shd"></div>\
                <div class="wrapper">\
                    <header>\
                        <button type="button" class="confirm" data-is-default="true"></button>\
                        <button type="button" class="cancel"></button>\
                        <h1></h1>\
                    </header>\
                    <article><div class="content"></div></article>\
                </div>\
            </div>',

        default_config = {
            className: 'moui-modalview',
            iframe: false,
            hideConfirm: false,
            confirmText: '确认',
            cancelText: '取消'
        };


    var ModalView = _.construct(overlay.Overlay);

    mix(ModalView.prototype, {

        _ns: NS,
        _template: TPL_VIEW,
        _defaults: _.merge({}, default_config, ModalView.prototype._defaults),

        init: function(opt) {
            this.superClass.init.call(this, opt);
            this._wrapper = this._node.find('.wrapper').eq(0);
            this._contentWrapper = this._wrapper.find('article').eq(0);
            this._content = this._contentWrapper.find('.content').eq(0);
            this._confirmBtn = this._header.find('.confirm');
            this._cancelBtn = this._header.find('.cancel');
            return this;
        },

        set: function(opt) {
            if (!opt) {
                return this;
            }
            var self = this;
            self.superClass.set.call(self, opt);

            if (opt.content !== undefined) {
                self._config.iframe = null;
            } else if (opt.iframe) {
                self._setIframeContent(opt);
            } 
            
            if (opt.hideConfirm !== undefined) {
                if (opt.hideConfirm) {
                    this._confirmBtn.hide();
                } else {
                    this._confirmBtn.show();
                }
            }

            if (opt.confirmText) {
                this._confirmBtn.html(opt.confirmText);
            }

            if (opt.cancelText) {
                this._cancelBtn.html(opt.cancelText);
            }

            return self;
        },

        setContent: function(html){
            this.superClass.setContent.call(this, html);
            if (html) {
                this.event.fire('contentchange', [this]);
            }
            return this;
        },

        _setIframeContent: function(){
            var self = this;
            this._clearIframeContent();
            self.setContent('');
            self.showLoading();
            self._iframeContent = $('<iframe class="moui-modalview-iframebd" '
                    + 'frameborder="0" scrolling="no" style="visibility:hidden;width:100%;">'
                    + '</iframe>')
                .bind('load', function(){
                    try {
                        if (!this.contentWindow.document.body.innerHTML) {
                            return;
                        }
                        self._iframeWindow = $(this.contentWindow);
                        if (!self._iframeContent
                            && self._iframeWindow[0].location.href !== self._config.iframe) {
                            return;
                        }
                        self._iframeContent[0].style.visibility = '';
                        self.event.resolve("frameOnload", [self]);
                        self.hideLoading();
                    } catch(ex) {}
                }).appendTo(self._content);
        },

        _clearIframeContent: function(){
            if (this._iframeContent) {
                this._iframeContent.remove();
                this._iframeContent = null;
            }
            this.event.reset("frameOnload");
        },

        confirm: function(){
            this.event.fire('confirm', [this]);
            return this;
        },

        cancel: function(){
            this.event.fire('cancel', [this]);
            this.ok();
            return this;
        },

        ok: function(){
            this.close();
            return this.event.promise('close');
        },

        applyOpen: function(){
            this.superClass.applyOpen.apply(this, arguments);
            if (this._config.iframe) {
                this._iframeContent.attr('src', this._config.iframe);
            }
        },

        applyClose: function(){
            this._clearIframeContent();
            this._contentWrapper[0].scrollTop = 0;
            this.superClass.applyClose.apply(this, arguments);
        }

    });

    ModalView.prototype.done = ModalView.prototype.ok;

    function exports(opt) {
        return new exports.ModalView(opt);
    }

    exports.ModalView = ModalView;

    return exports;

});
