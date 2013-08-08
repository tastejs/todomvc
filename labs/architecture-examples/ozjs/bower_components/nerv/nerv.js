/**
 * NervJS 
 * A tiny, pure, event-based model wrapper for the MVC or MDV (Model-driven Views) pattern.
 * It is far thinner than Backbone. None of View, Controller or Router is involved.
 * Strict data hiding but straightforward way to use.
 * Provides minimal built-in APIs but supports all external and conventional methods to access the model.
 * Model can be nested and supports bubbling events.
 *
 * using AMD (Asynchronous Module Definition) API with OzJS
 * see http://ozjs.org for details
 *
 * Copyright (C) 2010-2012, Dexter.Yy, MIT License
 * vim: et:ts=4:sw=4:sts=4
 */
define('nerv', [
    'mo/lang',
    'eventmaster'
], function(_, event){

    function Model(opt){
        this.init(opt);
        if (opt.data) {
            this.set(opt.data);
        } else {
            this.reset();
        }
        if (opt.init) {
            opt.init.call(this);
        }
    }

    Model.validate = function(v){
        if (v && typeof v === 'object') {
            if (!(v instanceof Model)) {
                throw('New value is an object but not instance of Model');
            }
            v._validate();
        }
    };

    Model.prototype = {

        init: function(opt){
            this._data = this._base();
            this._defaults = opt.defaults || {};
            this._setters = {};
            this.observer = event();
            return this;
        },

        each: function(fn, context){
            var data = this._data;
            for (var k in data) {
                if (fn.call(context, data[k], k) === false) {
                    break;
                }
            }
        },

        get: function(k){
            return this._data[k];
        },

        data: function(k){
            var res;
            if (k !== undefined) {
                res = this.get(k);
                return res instanceof Model ? res.data() : res;
            }
            res = this._base();
            this.each(function(v, k){
                if (v instanceof Model) {
                    res[k] = v.data();
                } else {
                    res[k] = v;
                }
            });
            return res;
        },

        set: function(k, fn, context) {
            if (k === undefined) {
                return this;
            }
            var new_data;
            if (_.isFunction(k) || typeof k === 'object') {
                context = fn;
                fn = k;
                this._unwatchAll();
                if (_.isFunction(fn)) {
                    new_data = fn.call(context, this._data);
                    this._data = _.copy(this._data);
                } else {
                    new_data = fn;
                }
                if (typeof new_data === 'object') {
                    this._setAll(new_data);
                }
                this._watchAll();
                this.observer.fire('change', [{ object: this }]);
                return this;
            }
            var old_data = this.get(k),
                old_value = this.data(k);
            this._unwatch(old_data, k);
            new_data = _.isFunction(fn) 
                ? fn.call(context, old_data) 
                : (fn === undefined ? null : fn);
            if (this._setters[k]) {
                new_data = this._setters[k].call(this._data, k, new_data);
            } else if (new_data !== undefined) {
                this._data[k] = new_data;
            } else if (old_data && typeof old_data === 'object') {
                new_data = old_data;
            }
            var type = new_data !== undefined 
                && (old_data === undefined && 'new' || 'update');
            if (type) {
                this._watch(new_data, k);
                var changes = {
                    object: this,
                    type: type,
                    name: k,
                    oldValue: old_value,
                    newValue: this.data(k)
                };
                this.observer.fire(k + ':' + changes.type, [changes])
                    .fire('change', [changes]);
            }
            return this;
        },

        remove: function(k){
            var old_value = this.data(k);
            this._unwatch(this.get(k), k);
            this._remove(k);
            var changes = {
                object: this,
                type: 'delete',
                name: k,
                oldValue: old_value
            };
            this.observer.fire(k + ':' + changes.type, [changes])
                .fire('change', [changes]);
            return this;
        },

        reset: function(){
            this._unwatchAll();
            this._setAll();
            this._watchAll();
            this.observer.fire('change', [{ object: this }]);
            return this;
        },

        find: function(item){
            var res; 
            this.each(function(v, k){
                if (v === item) {
                    res = k;
                    return false;
                }
            });
            return res;
        },

        setter: function(k, fn) {
            this._setters[k] = fn;
        },

        _watchAll: function(){
            this.each(this._watch, this);
        },

        _unwatchAll: function(){
            this.each(this._unwatch, this);
        },

        _watch: function(v, k){
            if (v && typeof v === 'object') {
                Model.validate(v);
                v.observer.bind('change', this.observer.promise(k + ':update').pipe.fire)
                    .bind('change', this.observer.promise('change').pipe.fire);
            }
        },

        _unwatch: function(v, k){
            if (v && typeof v === 'object') {
                v.observer.unbind('change', this.observer.promise(k + ':update').pipe.fire)
                    .unbind('change', this.observer.promise('change').pipe.fire);
            }
        },

        _validate: function(){
            this.each(Model.validate);
        },

        _base: function(){
            return {};
        },

        _remove: function(k){
            delete this._data[k];
        },

        _setAll: function(data){
            this._data = _.mix(_.copy(this._defaults), data);
        }

    };

    var Collection = _.construct(Model);

    _.mix(Collection.prototype, {

        add: function(v){
            this.set(this._data.length, v);
        },

        size: function(){
            return this._data.length;
        },

        each: function(fn, context){
            var data = this._data;
            for (var i = 0, l = data.length; i < l; i++) {
                if (fn.call(context, data[i], i) === false) {
                    break;
                }
            }
        },

        _base: function(){
            return [];
        },

        _remove: function(k){
            this._data.splice(k, 1);
        },

        _setAll: function(data){
            this._data.length = 0;
            _.mix(this._data, data);
        }

    });

    function exports(data, defaults){
        if (data instanceof exports.Model) {
            return data;
        }
        var opt = {
            data: data,
            defaults: defaults
        };
        return Array.isArray(data) 
            ? new exports.Collection(opt)
            : new exports.Model(opt);
    }

    _.mix(exports, {

        Model: Model,

        Collection: Collection,

    });

    exports.model = factory(exports.Model);

    exports.collection = factory(exports.Collection);

    function factory(ModelClass){
        return function(cfg){
            var Sub = _.construct(ModelClass);
            var opt = {
                init: cfg.init,
                defaults: cfg.defaults
            };
            delete cfg.init;
            delete cfg.defaults;
            _.mix(Sub.prototype, cfg);
            function wrapper(data){
                opt.data = data;
                return new Sub(opt);
            }
            wrapper.Class = Sub;
            return wrapper;
        };
    }

    return exports;

});

