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
define('moui/actionview', [
    'dollar',
    'mo/lang',
    'mo/template/string',
    'moui/overlay',
    'moui/picker'
], function($, _, tpl, overlay, picker) {

    var mix = _.mix,

        NS = 'mouiActionView',
        TPL_VIEW = 
            '<div id="{{id}}" class="{{cname}}">\
                <div class="shd"></div>\
                <div class="wrapper">\
                    <div class="content">\
                        <header><h1></h1></header>\
                        <div class="desc"></div>\
                        <article></article>\
                    </div>\
                </div>\
                <footer>\
                    <span class="cancel"></span>\
                    <span class="confirm" data-is-default="true"></span>\
                </footer>\
            </div>',

        default_config = {
            className: 'moui-actionview',
            closeDelay: 500,
            confirmText: '确认',
            cancelText: '取消',
            options: null,
            multiselect: false
        };

    var ActionView = _.construct(overlay.Overlay);

    mix(ActionView.prototype, {

        _ns: NS,
        _template: TPL_VIEW,
        _defaults: _.merge({}, default_config, ActionView.prototype._defaults),

        init: function(opt) {
            this.superClass.init.call(this, opt);
            this._wrapper = this._node.find('.wrapper').eq(0);
            this._actionsWrapper = this._content;
            this._wrapperContent = this._wrapper.find('.content').eq(0);
            this._content = this._wrapper.find('.desc').eq(0);
            this._footer = this._node.find('footer').eq(-1);
            this._confirmBtn = this._footer.find('.confirm');
            this._cancelBtn = this._footer.find('.cancel');
            return this;
        },

        set: function(opt) {
            if (!opt) {
                return this;
            }
            this.superClass.set.call(this, opt);

            if (opt.options !== undefined) {
                this._actionsWrapper.empty();
                var options = opt.options 
                    ? $(opt.options).clone()
                    : [];
                if (options.length) {
                    this._actionsWrapper.append(options);
                    this._picker = picker(this._actionsWrapper, {
                        options: options,
                        multiselect: this._config.multiselect,
                        ignoreStatus: !this._config.multiselect
                    });
                    this._node.removeClass('confirm-kind');
                } else {
                    this._node.addClass('confirm-kind');
                }
            }

            if (opt.multiselect !== undefined) {
                if (opt.multiselect) {
                    this._footer.addClass('multi');
                } else {
                    this._footer.removeClass('multi');
                }
            }

            if (opt.confirmText) {
                this._confirmBtn.html(opt.confirmText);
            }

            if (opt.cancelText) {
                this._cancelBtn.html(opt.cancelText);
            }

            return this;
        },

        val: function(){
            if (this._picker) {
                return this._picker.val();
            }
        },

        confirm: function(){
            this.event.fire('confirm', [this, this._picker]);
            return this.ok();
        },

        cancel: function(){
            this.event.fire('cancel', [this, this.picker]);
            return this.ok();
        },

        ok: function(){
            this.close();
            return this.event.promise('close');
        },

        applyOpen: function(){
            if (!this._config.multiselect && this._picker) {
                var self = this;
                this._picker.event.once('change', function(){
                    self.confirm();
                });
            }
            this.superClass.applyOpen.apply(this, arguments);
        },

        applyClose: function(){
            if (!this._config.multiselect && this._picker) {
                this._picker.event.reset();
            }
            this.superClass.applyClose.apply(this, arguments);
        }

    });

    ActionView.prototype.done = ActionView.prototype.ok;

    ['select', 'unselect', 'undo',
        'selectAll', 'unselectAll', 'selectInvert'].forEach(function(method){
        this[method] = function(){
            return this._picker[method].apply(this._picker, arguments);
        };
    }, ActionView.prototype);

    function exports(opt) {
        return new exports.ActionView(opt);
    }

    exports.ActionView = ActionView;

    return exports;

});
