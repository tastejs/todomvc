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
define('moui/overlay', [
    'mo/lang',
    'dollar',
    'eventmaster',
    'mo/template/string'
], function(_, $, event, tpl) {

    var body = $('body'),

        NS = 'mouiOverlay',
        TPL_VIEW =
           '<div id="{{id}}" class="{{cname}}">\
                <header><h2></h2></header>\
                <article></article>\
            </div>',
        LOADING_DOTS = '<span class="loading"><i>.</i><i>.</i><i>.</i></span>',
        LOADING_DEFAULT = '加载中',

        _mid = 0,

        default_config = {
            title: '',
            content: '',
            className: 'moui-overlay',
            parent: body,
            openDelay: 50,
            closeDelay: 0,
            event: {}
        };

    function Overlay(opt) {
        this.init(opt);
        this.set(this._config);
    }

    Overlay.prototype = {

        _ns: NS,
        _template: TPL_VIEW,
        _defaults: default_config,

        init: function(opt){
            this.id = this._ns + (++_mid);
            this.event = event();
            this._config = _.config({}, opt, this._defaults);
            body.append(tpl.format(this._template, { 
                id: this.id,
                cname: this._config.className
            }));
            this._node = $('#' + this.id);
            this._header = this._node.find('header').eq(0);
            this._title = this._header.find('h1');
            this._content = this._node.find('article').eq(0);
            return this;
        },

        set: function(opt) {
            if (!opt) {
                return this;
            }
            _.config(this._config, opt, this._defaults);

            if (typeof opt.title === 'string') {
                this.setTitle(opt.title);
            }

            if (opt.content !== undefined) {
                this.setContent(opt.content);
            }

            if (opt.className !== undefined) {
                this._node[0].className = opt.className;
            }

            return this;
        },

        setTitle: function(text){
            this._title.html(text);
            return this;
        },

        setContent: function(html){
            this._content.html(html);
            return this;
        },

        insertNode: function(parent){
            this._node.appendTo(parent || this._config.parent);
        },

        showLoading: function(text) {
            this._node.addClass('loading');
            this._title.html((text || LOADING_DEFAULT) + LOADING_DOTS);
            return this;
        },

        hideLoading: function(){
            this._node.removeClass('loading');
            this._title.html(this._config.title);
            return this;
        },

        open: function(){
            clearTimeout(this._actimer);
            if (this.isOpened) {
                this.cancelClose();
                return this;
            }
            var self = this,
                args = arguments;
            this.prepareOpen.apply(self, args);
            this._actimer = setTimeout(function(){
                self.applyOpen.apply(self, args);
            }, this._config.openDelay);
            return this;
        },

        close: function(){
            clearTimeout(this._actimer);
            if (!this.isOpened) {
                this.cancelOpen();
                return this;
            }
            var self = this,
                args = arguments;
            this.prepareClose.apply(self, args);
            this._actimer = setTimeout(function(){
                self.applyClose.apply(self, args);
            }, this._config.closeDelay);
            return this;
        },

        prepareOpen: function(){
            this.insertNode();
            this._node.addClass('rendered');
            this.event.fire('prepareOpen', [this]);
        },

        prepareClose: function(){
            this.event.fire('prepareClose', [this]);
            this._node.removeClass('active');
        },

        cancelOpen: function(){
            this._node.removeClass('rendered');
            this.event.fire('cancelOpen', [this]);
        },

        cancelClose: function(){
            this._node.addClass('active');
            this.event.fire('cancelClose', [this]);
        },

        applyOpen: function() {
            this.isOpened = true;
            this._node.addClass('active');
            this.event.fire('open', [this]);
        },

        applyClose: function() {
            this.isOpened = false;
            this._content.empty();
            this._node.removeClass('rendered');
            this.event.fire('close', [this]);
        },

        destroy: function() {
            this._node.remove();
            this.event.fire('destroy', [this]);
            return this;
        }

    };

    function exports(opt) {
        return new exports.Overlay(opt);
    }

    exports.Overlay = Overlay;

    return exports;

});
