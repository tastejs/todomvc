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
define('moui/bubble', [
    'mo/lang',
    'dollar',
    'moui/util/stick'
], function(_, $, stick){

    var window = this,
        TPL_BUBBLE = '<div class="moui-bubble"><div class="moui-content"></div><div class="moui-arrow"><div></div></div></div>',
        NEGATIVE = [6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6];

    function Bubble(opt){
        this._config = {};
        this._node = $(TPL_BUBBLE);
        this._content = this._node.find('.moui-content');
        this._arrow = this._node.find('.moui-arrow');
        this.set(opt);
        this._node.appendTo(this._config.window.document.body);
    }

    Bubble.prototype = {

        set: function(opt){
            var self = this;
            self._config.window = opt.window || window;
            if (opt.content) {
                self.setContent(opt.content);
            }
            if (opt.target) {
                this._config.target = opt.target;
            }
            if (opt.clock !== undefined) {
                this._config.clock = opt.clock;
            }
            return this;
        },

        setAlign: function(target, clock){
            if (target) {
                this._config.target = target;
            }
            if (clock === undefined) {
                clock = this._config.clock || 7;
            }
            var node = this._node,
                arrow_clock = NEGATIVE[clock],
                quadrant = Math.floor((arrow_clock + 1) / 3),
                align = arrow_clock % 3;
            node[0].className = node[0].className.replace(/(\w+\-arrow|\w+\-align)/, '');
            if (quadrant === 0 || quadrant === 4) {
                node.addClass('top-arrow')
                    .addClass(['center', 'left', 'right'][align] + '-align');
            } else if (quadrant === 1) {
                node.addClass('right-arrow')
                    .addClass(['center', 'top', 'bottom'][align] + '-align');
            } else if (quadrant === 2) {
                node.addClass('bottom-arrow')
                    .addClass(['center', 'right', 'left'][align] + '-align');
            } else if (quadrant === 3) {
                node.addClass('left-arrow')
                    .addClass(['center', 'bottom', 'top'][align] + '-align');
            }
            stick(this._config.target, this._node[0], clock);
            return this;
        },

        setContent: function(text){
            this._content.html(text);
            return this;
        },

        update: function(){
            this.setAlign(this._config.target, this._config.clock);
            return this;
        },

        show: function(){
            if (this.isOpened) {
                return;
            }
            this.isOpened = true;
            this._node.addClass('active');
            this.update();
            return this;
        },

        hide: function(){
            if (!this.isOpened) {
                return;
            }
            this.isOpened = false;
            this._node.removeClass('active');
            return this;
        },

        destroy: function() {
            if (!this.isOpened) {
                return;
            }
            this.isOpened = false;
            this._node.remove();
            return this;
        }

    };

    function exports(text, target, clock){
        return new exports.Bubble(typeof text === 'object' 
            ? text : {
                content: text,
                target: target,
                clock: clock
            });
    }

    exports.Bubble = Bubble;

    return exports;

});
