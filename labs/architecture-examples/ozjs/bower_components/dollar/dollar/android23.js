/**
 * DollarJS polyfills for android 2.x
 * A jQuery-compatible and non-All-in-One library which is more "Zepto" than Zepto.js
 * Focus on DOM operations and mobile platform, wrap native API wherever possible.
 *
 * using AMD (Asynchronous Module Definition) API with OzJS
 * see http://ozjs.org for details
 *
 * Copyright (C) 2010-2012, Dexter.Yy, MIT License
 * vim: et:ts=4:sw=4:sts=4
 */
define("dollar/android23", [
    "mo/lang/es5",
    "mo/lang/mix",
    "mo/lang/type",
    "dollar/origin"
], function(es5, _, detect, $){

    var css_method = $.camelize;

    _.mix($.fn, {

        data: $._kvAccess(function(node, name, value){
            node.setAttribute('data-' + prop2data(name), value);
        }, function(node, name){
            if (name) {
                return node.getAttribute('data-' + prop2data(name));
            } else {
                var data = {};
                node.outerHTML
                    .replace(node.innerHTML, '')
                    .split(/\s+/)
                    .forEach(function(html){ 
                        var attr = (/^data-([\w\-]+)/.exec(html) || []); 
                        if (data[0]) {
                            this[css_method(attr[1])] = node.getAttribute(attr[0]);
                        }
                    }, data);
                return data;
            }
        }),

        removeData: function(name){
            this.forEach(function(node){
                node.removeAttribute('data-' + prop2data(this));
            }, name);
            return this;
        },

        hasClass: function(cname){
            for (var i = 0, l = this.length; i < l; i++) {
                if (class_list(this[i]).indexOf(cname) !== -1) {
                    return true;
                }
            }
            return false;
        },

        addClass: function(cname){
            return $._eachNode(this, cname, 'className', function(node, cname){
                var list = class_list(node);
                if (list.indexOf(cname) === -1) {
                    list.push(cname);
                    node.className = list.join(' ');
                }
            });
        },

        removeClass: function(cname){
            return $._eachNode(this, cname, 'className', function(node, cname){
                var list = class_list(node),
                    n = list.indexOf(cname);
                if (n !== -1) {
                    list.splice(n, 1);
                    node.className = list.join(' ');
                }
            });
        },

        toggleClass: function(cname, force){
            return $._eachNode(this, cname, 'className', function(node, cname){
                var list = class_list(node),
                    n = list.indexOf(cname),
                    is_add = force;
                if (is_add === undefined) {
                    is_add = n === -1;
                }
                if (is_add) {
                    if (n === -1) {
                        list.push(cname);
                    }
                } else {
                    if (n !== -1) {
                        list.splice(n, 1);
                    }
                }
                node.className = list.join(' ');
            });
        }
    
    });

    function prop2data(name){
        return name.replace(/([A-Z])/g, function($0, $1){ 
            return '-' + $1.toLowerCase(); 
        });
    }

    function class_list(elm){
        return elm.className.split(/\s+/);
    }

    return $;

});
