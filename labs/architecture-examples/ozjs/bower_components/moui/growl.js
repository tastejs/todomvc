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
define('moui/growl', [
    'dollar',
    'mo/lang',
    'mo/template',
    'moui/overlay'
], function($, _, tpl, overlay) {

    var NS = 'mouiGrowl',
        TPL_VIEW =
           '<div id="{{id}}" class="moui-growl">\
                <header><h2></h2></header>\
                <article></article>\
            </div>',
        CORNER = 'corner-',

        default_config = {
            className: 'moui-growl',
            closeDelay: 300,
            corner: 'center',
            expires: 1400,
            keepalive: false
        };

    var Growl = _.construct(overlay.Overlay);

    _.mix(Growl.prototype, {

        _ns: NS,
        _template: TPL_VIEW,
        _defaults: _.merge({}, default_config, Growl.prototype._defaults),

        set: function(opt) {
            var self = this;
            self.superClass.set.call(self, opt);

            if (opt.corner && opt.corner !== self._currentCorner) {
                if (self._currentCorner) {
                    self._node.removeClass(CORNER + self._currentCorner);
                }
                self._node.addClass(CORNER + opt.corner);
                self._currentCorner = opt.corner;
            }

            if (opt.expires !== undefined) {
                clearTimeout(self._exptimer);
                if (self.isOpened) {
                    set_expires(self);
                }
            }

            return self;
        },

        applyOpen: function(){
            clearTimeout(this._exptimer);
            if (this._config.expires != -1) {
                set_expires(this);
            }
            return this.superClass.applyOpen.apply(this, arguments);
        },

        applyClose: function(){
            this.isOpened = false;
            this._node.removeClass('rendered');
            this.event.fire('close', [this]);
            if (!this._config.keepalive) {
                this.destroy();
            }
        }

    });

    function set_expires(self){
        self._exptimer = setTimeout(function(){
            self.close();
        }, self._config.expires);
    }

    function exports(opt){
        return new exports.Growl(opt);
    }

    exports.Growl = Growl;

    return exports;

});
