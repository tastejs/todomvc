requirejs(["rAppid"], function (rAppid) {

    rAppid.defineClass("js.core.Binding", ["js.core.Bindable", "js.core.EventDispatcher", "js/core/BindingParser"], function (Bindable, EventDispatcher, Parser) {
        var contextToString = function(context){
            var str = "", el;
            for (var i = 0; i < context.length; i++) {
                el = context[i];
                str += el instanceof Object ? el.toString() : el;
            }
            return str;
        };

        /**
         * Returns false if path includes function
         * @param path
         */
        var pathToString = function(path){
            var str = [];
            for (var i = 0; i < path.length; i++) {
                var el = path[i];
                if(el.type == "var"){
                    str.push(el.name);
                }else{
                    return false;
                }
            }
            return str.join(".");
        };

        var Binding = Bindable.inherit(
            /** @lends Binding */
            {
                defaults:{
                    event:'change',
                    path:null,
                    twoWay:false,
                    transform:function (val) {
                        return val;
                    },
                    transformBack:function (val) {
                        return val;
                    }
                },

                ctor:function () {
                    this.callBase();

                    this.initialize();
                },
                initialize:function () {
                    this._checkAttributes();
                    this.$parameters = [];
                    this.$subBinding = null;

                    if (!this.$.rootScope) {
                        this.$.rootScope = this;
                    }
                    var scope = this.$.scope;
                    // split up first key
                    this.$.key = this.$.path[0];

                    if (this.$.key.type == "fnc") {
                        var fncName = this.$.key.name;
                        this.$parameters = this.$.key.parameter;

                        if (rAppid._.isFunction(scope[fncName])) {
                            var fnc = scope[fncName];
                            var events = [];
                            if (fnc._events) {
                                events = fnc._events;
                            } else {
                                events = ['change'];
                            }

                            for (var i = 0; i < events.length; i++) {
                                var event = events[i];
                                scope.bind(event, this._callback, this);
                            }
                            var self = this;
                            var cb = function () {
                                self.trigger();
                            };

                            var para;
                            for (var j = 0; j < this.$parameters.length; j++) {
                                para = this.$parameters[j];
                                if (rAppid._.isObject(para)) {
                                    this.$parameters[j] = Binding.create(para, this.$.target, cb);
                                }

                            }
                            this.$.fnc = fnc;
                        }

                    } else {
                        this.$.event = "change:" + this.$.key.name;

                        // on change of this key
                        scope.bind(this.$.event, this._callback, this);

                        if (this.$.twoWay === true) {
                            this.$.targetEvent = 'change:' + this.$.targetKey;
                            this.$.target.bind(this.$.targetEvent, this._revCallback, this);
                        }
                    }
                    this._createSubBinding();
                },
                _checkAttributes:function () {
                    // check infrastructur
                    if (!this.$.path) {
                        throw "No path defined!";
                    }

                    if (!this.$.scope) {
                        throw "No scope defined!"
                    }

                    if (this.$.twoWay) {
                        if (!this.$.target) {
                            throw "TwoWay binding, but no target defined!";
                        }
                        if (!this.$.target instanceof Bindable) {
                            throw "Target is not a Bindable!";
                        }

                        if (!this.$.targetKey) {
                            throw "TwoWay binding, but no target key defined!";
                        }

                    }
                },
                _createSubBinding:function () {
                    if (this.$.path.length > 1) {
                        var nScope;
                        if (this.$.fnc) {
                            nScope = this.getValue();
                        } else {
                            nScope = this.$.scope.$[this.$.key.name];
                        }
                        // if keys are left and has value && is bindable
                        // get value for first child
                        if (nScope && (nScope instanceof EventDispatcher)) {
                            // init new binding, which triggers this binding
                            this.$subBinding = new Binding({scope:nScope, path:this.$.path.slice(1), target:this.$.target, targetKey:this.$.targetKey, rootScope:this.$.rootScope, callback:this.$.callback, context: this.$.context});
                        }
                    }
                },
                _revCallback:function (e) {
                    this.$.scope.set(pathToString(this.$.path), this.$.transformBack(e.$, this.$.target));
                },
                _callback:function () {
                    // remove subBindings!
                    if (this.$subBinding) {
                        this.$subBinding.destroy();
                        this.$subBinding = null;
                    }

                    // try to create subBinding
                    this._createSubBinding();

                    this.trigger();
                },
                destroy:function () {
                    this.$.scope.unbind(this.$.event, this._callback);
                    if (this.$.twoWay === true) {
                        this.$.target.unbind(this.$.targetEvent, this._revCallback);
                    }
                    if (this.$subBinding) {
                        this.$subBinding.destroy();
                    }

                    // destroy parameter bindings
                    for (var i = 0; i < this.$parameters.length; i++) {
                        var par = this.$parameters[i];
                        if (par instanceof Binding) {
                            par.destroy();
                        }
                    }
                },
                getValue:function () {
                    if (this.$subBinding) {
                        return this.$subBinding.getValue();
                    } else {
                        if (this.$.fnc) {
                            var parameters = [];
                            for (var i = 0; i < this.$parameters.length; i++) {
                                var para = this.$parameters[i];
                                if (para instanceof Binding) {
                                    para = para.getValue();
                                }
                                parameters.push(para);
                            }
                            return this.$.fnc.apply(this.$.scope, parameters);
                        } else if (this.$.path.length == 1) {
                            return this.$.scope.get(this.$.key.name);
                        } else {
                            return null;
                        }
                    }
                },
                getContextValue: function(){
                    if(this.$.context && this.$.context.length > 1){
                        return contextToString(this.$.context);
                    }else{
                        return this.getValue();
                    }
                },
                // trigger
                trigger:function () {
                    // get value
                    var val = this.getContextValue();
                    if (this.$.targetKey) {
                        this.$.target.set(this.$.targetKey, this.$.transform(val, this.$.rootScope));
                    } else if (this.$.callback) {
                        this.$.callback.call(this.$.target, this.$.transform(val, this.$.rootScope));
                    }

                },
                toString:function () {
                    return this.getValue();
                }
            });

        Binding.create = function (bindingDef, targetScope, attrKey, context) {
            var path = bindingDef.path;
            var pathElement = path[0];

            var scope;
            var searchScope = targetScope;
            if (attrKey == pathElement.name) {
                searchScope = searchScope.$parentScope;
            }

            if (pathElement.type == "fnc") {
                scope = searchScope.getScopeForFncName(pathElement.name);
            } else {
                scope = searchScope.getScopeForKey(pathElement.name);
            }

            if (bindingDef.type == "static") {
                var nScope = scope;
                while (nScope && path.length > 0) {
                    pathElement = path.shift();
                    if (pathElement.type == "fnc") {
                        var fnc = scope[pathElement.name];
                        var parameters = pathElement.parameters;
                        for (var i = 0; i < parameters.length; i++) {
                            var param = parameters[i];
                            if (rAppid._.isObject(param)) {
                                param.type = "static";
                                var binding = Binding.create(param,scope,"", context);
                                if (binding instanceof Binding) {
                                    parameters[i] = binding.getValue();
                                } else {
                                    parameters[i] = binding;
                                }

                            }
                        }
                        nScope = fnc.apply(this, parameters);
                    } else if (pathElement.type = "var") {
                        nScope = nScope.get(pathElement.name);
                    }
                }
                return nScope;
            } else {

                var cb;
                if (rAppid._.isFunction(attrKey)) {
                    cb = attrKey;
                }


                if (scope) {
                    var twoWay = (bindingDef.type == "twoWay");
                    var options = {scope:scope, path:path, target:targetScope, twoWay:twoWay, context: context};
                    if (cb) {
                        options['callback'] = cb;
                    } else {
                        options['targetKey'] = attrKey;
                    }
                    return new Binding(options);
                }

            }
        };

        Binding.evaluateText = function (text, scope, attrKey) {
            if (!rAppid._.isString(text)) return text;
            var bindingDefs = Parser.parse(text, "text");
            var binding;
            var bindings = [];
            for (var i = 0; i < bindingDefs.length; i++) {
                var bindingDef = bindingDefs[i];
                if(bindingDef.length){
                    bindingDefs[i] = bindingDef;
                }else{
                    binding = Binding.create(bindingDef, scope, attrKey, bindingDefs);
                    if (binding instanceof Binding) {
                        bindings.push(binding);
                    }
                    bindingDefs[i] = binding;
                }

            }

            if (bindings.length > 0) {
                return bindings[0].getContextValue();
            } else if (bindingDefs.length > 0){
                return contextToString(bindingDefs);
            } else {
                return text;
            }
        };

        return Binding;
    });
});