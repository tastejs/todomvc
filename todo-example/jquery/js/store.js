//
// Copyright (c) 2011 Frank Kohlhepp
// https://github.com/frankkohlhepp/store-js
// License: MIT-license
//
(function () {
    var Store = this.Store = function (name, defaults, watcherSpeed) {
        var that = this;
        this.name = name;
        this.listeners = {};
        
        // Set defaults
        if (defaults) {
            for (var key in defaults) {
                if (defaults.hasOwnProperty(key) && this.get(key) === undefined) {
                    this.set(key, defaults[key]);
                }
            }
        }
        
        // Fake events
        var fireEvent = function (name, value) {
            ([name, "*"]).each(function (selector) {
                if (that.listeners[selector]) {
                    that.listeners[selector].each(function (callback) {
                        callback(value, name, that.name);
                    });
                }
            });
        };
        
        var oldObj = this.toObject();
        var standby = function () { watcher(true); };
        var watcher = function (skipCheck) {
            if (Object.keys(that.listeners).length !== 0) {
                var newObj = that.toObject();
                
                if (!skipCheck) {
                    for (var key in newObj) {
                        if (newObj.hasOwnProperty(key) && newObj[key] !== oldObj[key]) {
                            fireEvent(key, newObj[key]);
                        }
                    }
                    
                    for (var key in oldObj) {
                        if (oldObj.hasOwnProperty(key) && !newObj.hasOwnProperty(key)) {
                            fireEvent(key, newObj[key]);
                        }
                    }
                }
                
                oldObj = newObj;
                setTimeout(watcher, (watcherSpeed || 300));
            } else {
                setTimeout(standby, 1000);
            }
        };
        
        standby();
    };
    
    Store.__proto__ = function Empty() {};
    Store.__proto__.clear = function () {
        localStorage.clear();
    };
    
    Store.prototype.get = function (name) {
        var value = localStorage.getItem("store." + this.name + "." + name);
        if (value === null) { return; }
        try { return JSON.parse(value); } catch (e) { return null; }
    };
    
    Store.prototype.set = function (name, value) {
        if (value === undefined) {
            this.remove(name);
        } else {
            if (typeof value === "function") {
                value = null;
            } else {
                try {
                    value = JSON.stringify(value);
                } catch (e) {
                    value = null;
                }
            }
            
            localStorage.setItem("store." + this.name + "." + name, value);
        }
        
        return this;
    };
    
    Store.prototype.remove = function (name) {
        localStorage.removeItem("store." + this.name + "." + name);
        return this;
    };
    
    Store.prototype.removeAll = function () {
        var name = "store." + this.name + ".";
        for (var i = (localStorage.length - 1); i >= 0; i--) {
            if (localStorage.key(i).substring(0, name.length) === name) {
                localStorage.removeItem(localStorage.key(i));
            }
        }
        
        return this;
    };
    
    Store.prototype.toObject = function () {
        var values = {};
        var name = "store." + this.name + ".";
        for (var i = (localStorage.length - 1); i >= 0; i--) {
            if (localStorage.key(i).substring(0, name.length) === name) {
                var key = localStorage.key(i).substring(name.length);
                var value = this.get(key);
                if (value !== undefined) { values[key] = value; }
            }
        }
        
        return values;
    };
    
    Store.prototype.fromObject = function (values, merge) {
        if (!merge) { this.removeAll(); }
        for (var key in values) {
            if (values.hasOwnProperty(key)) {
                this.set(key, values[key]);
            }
        }
        
        return this;
    };
    
    Store.prototype.addEvent = function (selector, callback) {
        if (!this.listeners[selector]) { this.listeners[selector] = []; }
        this.listeners[selector].push(callback);
        return this;
    };
    
    Store.prototype.removeEvent = function (selector, callback) {
        for (var i = (this.listeners[selector].length - 1); i >= 0; i--) {
            if (this.listeners[selector][i] === callback) { this.listeners[selector].splice(i, 1); }
        }
        
        if (this.listeners[selector].length === 0) { delete this.listeners[selector]; }
        return this;
    };
}());
