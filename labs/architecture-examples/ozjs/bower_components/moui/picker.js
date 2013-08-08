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
define('moui/picker', [
    'mo/lang',
    'dollar',
    'eventmaster',
    'moui/control'
], function(_, $, event, control){

    var OID = '_moPickerOid',

        default_config = {
            field: 'input[type="hidden"]',
            options: '.option',
            ignoreRepeat: false,
            ignoreStatus: false,
            multiselect: false
        };

    function Picker(elm, opt){
        this.init(elm, opt);
        this.set(this._config);
    }

    Picker.prototype = {

        _defaults: default_config,

        init: function(elm, opt){
            this._uoid = 0;
            this.event = event();
            this._node = $(elm);
            this._options = [];
            opt = _.mix({}, this.data(), opt);
            this._config = _.config({}, opt, this._defaults);
            return this;
        },

        set: function(opt){
            if (!opt) {
                return this;
            }
            _.mix(this._config, opt);

            if (opt.multiselect !== undefined) {
                if (!opt.multiselect) {
                    this._allSelected = null;
                    this._lastSelected = null;
                } else if (!this._allSelected) {
                    this._allSelected = [];
                }
            }

            if (opt.field !== undefined) {
                if (opt.field) {
                    this._field = $(opt.field, 
                        typeof opt.field === 'string' && this._node).eq(0);
                } else {
                    this._field = [];
                }
            }

            if (opt.options) {
                this._options.forEach(this.removeOption, this);
                $(opt.options, this._node).forEach(this.addOption, this);
            }

            return this;
        },

        _watchEnable: function(controller){
            controller._pickerEnableWatcher = when_enable.bind(this);
            controller.event.bind('enable', controller._pickerEnableWatcher);
        },

        _watchDisable: function(controller){
            controller._pickerDisableWatcher = when_disable.bind(this);
            controller.event.bind('disable', controller._pickerDisableWatcher);
        },

        _unwatchEnable: function(controller){
            controller.event.unbind('enable', controller._pickerEnableWatcher);
        },

        _unwatchDisable: function(controller){
            controller.event.unbind('disable', controller._pickerDisableWatcher);
        },

        addOption: function(elm){
            elm = $(elm)[0];
            if (elm[OID]) {
                return;
            }
            elm[OID] = ++this._uoid;
            var controller = control(elm, {
                enableVal: elm.value,
                label: false
            });
            this._watchEnable(controller);
            this._options.push(controller);
            if (controller.isEnabled) {
                change.call(this, 'enable', controller);
            }
            return this;
        },

        removeOption: function(elm){
            var controller;
            if (elm.constructor === control.Control) {
                controller = elm;
                elm = elm._node[0];
            } else {
                controller = this.getOption(elm);
            }
            this.unselect(elm);
            if (controller) {
                this._options.splice(
                    this._options.indexOf(controller), 1);
            }
            return this;
        },

        getOption: function(elm){
            if (typeof elm === 'number') {
                elm = this._options[elm];
            } else if (typeof elm === 'string') {
                elm = this._options.filter(function(controller){
                    return controller.val() === elm;
                })[0];
            } else {
                var oid = $(elm)[0][OID];
                if (!oid) {
                    return null;
                }
                elm = this._options.filter(function(controller){
                    return controller._node[0][OID] === oid;
                })[0];
            }
            return elm;
        },

        getOptions: function() {
            return this._options;
        },

        getSelected: function() {
            if (this._config.multiselect) {
                return this._allSelected || [];
            } else {
                return this._lastSelected
                    ? [this._lastSelected] : [];
            }
        },

        val: function(){
            if (!this._config) {
                return;
            }
            if (this._config.multiselect) {
                return this._allSelected.map(function(controller){
                    return controller.val();
                });
            } else {
                if (this._lastSelected) {
                    return this._lastSelected.val();
                }
            }
        },

        data: function(){
            return this._node.data();
        },

        showLoading: function(){
            this._node.addClass('loading');
            return this;
        },

        hideLoading: function(){
            this._node.removeClass('loading');
            return this;
        },

        undo: function(){
            if (this._lastActionTarget) {
                this._lastActionTarget.toggle();
            }
            return this;
        },

        selectAll: function(){
            if (this._config.multiselect) {
                this._options.forEach(function(controller){
                    if (!controller.isEnabled) {
                        this._unwatchEnable(controller);
                        controller.enable();
                        change.call(this, 'enable', controller);
                    }
                }, this);
                this.event.fire('change', [this]);
            }
            this._lastActionTarget = null;
            return this;
        },

        unselectAll: function(){
            if (this._config.multiselect) {
                this._options.forEach(function(controller){
                    if (controller.isEnabled) {
                        this._unwatchDisable(controller);
                        controller.disable();
                        change.call(this, 'disable', controller);
                    }
                }, this);
                this._lastActionTarget = null;
                this.event.fire('change', [this]);
            } else {
                this.undo();
            }
            return this;
        },

        selectInvert: function(){
            if (this._config.multiselect) {
                this._options.forEach(function(controller){
                    if (controller.isEnabled) {
                        this._unwatchDisable(controller);
                        controller.toggle();
                        change.call(this, 'disable', controller);
                    } else {
                        this._unwatchEnable(controller);
                        controller.toggle();
                        change.call(this, 'enable', controller);
                    }
                }, this);
                this.event.fire('change', [this]);
            }
            this._lastActionTarget = null;
            return this;
        },

        select: function(i){
            var controller = this.getOption(i);
            if (controller) {
                if (!this._config.multiselect && this._config.ignoreStatus) {
                    change.call(this, 'enable', controller);
                    this.event.fire('change', [this, controller]);
                } else {
                    if (this._config.multiselect 
                            && this._allSelected.indexOf(controller) !== -1
                            || !this._config.multiselect
                            && this._lastSelected === controller) {
                        if (!this._config.ignoreRepeat) {
                            return this.unselect(i);
                        }
                    }
                    this._lastActionTarget = controller.enable();
                }
            }
            return this;
        },

        unselect: function(i){
            if (!i) {
                this.unselectAll();
            } else {
                var controller = this.getOption(i);
                if (controller) {
                    this._lastActionTarget = controller.disable();
                }
            }
            return this;
        }

    };

    function when_enable(controller){
        change.call(this, 'enable', controller);
        this.event.fire('change', [this, controller]);
    }

    function when_disable(controller){
        change.call(this, 'disable', controller);
        this.event.fire('change', [this, controller]);
    }

    function change(subject, controller){
        if (subject === 'enable') {
            if (!this._config.ignoreStatus) {
                this._unwatchEnable(controller);
                this._watchDisable(controller);
            }
            if (this._config.multiselect) {
                this._allSelected.push(controller);
            } else {
                var last = this._lastSelected;
                this._lastSelected = controller;
                if (last) {
                    this._unwatchDisable(last);
                    last.disable();
                    this._watchEnable(last);
                }
            }
        } else {
            if (!this._config.ignoreStatus) {
                this._unwatchDisable(controller);
                this._watchEnable(controller);
            }
            if (this._config.multiselect) {
                var i = this._allSelected.indexOf(controller);
                if (i !== -1) {
                    this._allSelected.splice(i, 1);
                }
            } else {
                if (controller 
                        && this._lastSelected !== controller) {
                    return;
                }
                this._lastSelected = null;
            }
        }
        if (this._field[0]) {
            this._field.val(this.val());
        }
    }

    function exports(elm, opt){
        return new exports.Picker(elm, opt);
    }

    exports.Picker = Picker;

    return exports;

});

