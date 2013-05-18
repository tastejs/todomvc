/*!
* CanJS - 1.1.5 (2013-03-27)
* http://canjs.us/
* Copyright (c) 2013 Bitovi
* Licensed MIT
*/
define(['jquery', 'can/util/library', 'can/control'], function ($, can) {
    //used to determine if a control instance is one of controllers
    //controllers can be strings or classes
    var i, isAControllerOf = function (instance, controllers) {
        for (i = 0; i < controllers.length; i++) {
            if (typeof controllers[i] == 'string' ? instance.constructor._shortName == controllers[i] : instance instanceof controllers[i]) {
                return true;
            }
        }
        return false;
    },
        makeArray = can.makeArray,
        old = can.Control.setup;

    can.Control.setup = function () {
        // if you didn't provide a name, or are control, don't do anything
        if (this !== can.Control) {


            var pluginName = this.pluginName || this._fullName;

            // create jQuery plugin
            if (pluginName !== 'can_control') {
                this.plugin(pluginName);
            }

            old.apply(this, arguments);
        }
    };

    $.fn.extend({


        controls: function () {
            var controllerNames = makeArray(arguments),
                instances = [],
                controls, c, cname;
            //check if arguments
            this.each(function () {

                controls = can.$(this).data("controls");
                if (!controls) {
                    return;
                }
                for (var i = 0; i < controls.length; i++) {
                    c = controls[i];
                    if (!controllerNames.length || isAControllerOf(c, controllerNames)) {
                        instances.push(c);
                    }
                }
            });
            return instances;
        },


        control: function (control) {
            return this.controls.apply(this, arguments)[0];
        }
    });

    can.Control.plugin = function (pluginname) {
        var control = this;

        if (!$.fn[pluginname]) {
            $.fn[pluginname] = function (options) {

                var args = makeArray(arguments),
                    //if the arg is a method on this control
                    isMethod = typeof options == "string" && $.isFunction(control.prototype[options]),
                    meth = args[0],
                    returns;
                this.each(function () {
                    //check if created
                    var plugin = can.$(this).control(control);

                    if (plugin) {
                        if (isMethod) {
                            // call a method on the control with the remaining args
                            returns = plugin[meth].apply(plugin, args.slice(1));
                        }
                        else {
                            // call the plugin's update method
                            plugin.update.apply(plugin, args);
                        }
                    }
                    else {
                        //create a new control instance
                        control.newInstance.apply(control, [this].concat(args));
                    }
                });
                return returns !== undefined ? returns : this;
            };
        }
    }

    can.Control.prototype.update = function (options) {
        can.extend(this.options, options);
        this.on();
    };

    return can;
});