var requirejs = (typeof requirejs === "undefined" ? require("requirejs") : requirejs);

requirejs(["rAppid"], function (rAppid) {

    rAppid.defineClass("js.core.Element",
        ["js.core.Bindable"], function (Bindable) {

            var undef;

            function stringToPrimitive(str) {
                // if it's not a string
                if (rAppid._.isString(str)) {

                    var n = parseFloat(str);
                    if (!rAppid._.isNaN(n)) {
                        return n;
                    }

                    if (str === "true") {
                        return true;
                    } else if (str === "false") {
                        return false;
                    }
                }
                return str;
            }

            return Bindable.inherit({
                ctor: function (attributes, descriptor, applicationDomain, parentScope, rootScope) {

                    attributes = attributes || {};

                    if (!descriptor) {
                        // created from node
                        if (!rootScope) {
                            rootScope = this;
                        }
                    }

                    this.$descriptor = descriptor;
                    this.$applicationDomain = applicationDomain;
                    this.$parentScope = parentScope || null;
                    this.$rootScope = rootScope || null;


                    rAppid._.extend(attributes, this._getAttributesFromDescriptor(descriptor), this._getAttributesFromDescriptor(this._$descriptor));

                    this.callBase(attributes);

                    this._initializeAttributes(this.$);

                    // manually constructed
                    if (descriptor === undef || descriptor === null) {
                        this._initialize(this.$creationPolicy);
                    }

                },

                _getAttributesFromDescriptor: function (descriptor) {

                    var attributes = {};

                    if (descriptor && descriptor.attributes) {
                        var node;

                        for (var a = 0; a < descriptor.attributes.length; a++) {
                            node = descriptor.attributes[a];
                            attributes[node.nodeName] = stringToPrimitive(node.value);
                        }
                    }

                    return attributes;
                },

                defaults: {
                    creationPolicy: "auto"
                },

                _initializeAttributes: function (attributes) {
                },

                _initializeDescriptors: function () {
                },

                /**
                 *
                 * @param creationPolicy
                 *          auto - do not overwrite (default),
                 *          all - create all children
                 *          TODO none?
                 */
                _initialize: function (creationPolicy, withBindings) {
                    if (this.$initialized) {
                        return;
                    }

                    this._preinitialize();

                    this.initialize();

                    this._initializeDescriptors();

                    if (this == this.$rootScope || withBindings) {
                        this._initializeBindings();
                    }

                    this._initializationComplete();
                },

                _initializeBindings: function () {
                },

                _initializeDescriptor: function (descriptor) {

                },
                initialize: function () {

                },
                find: function (key) {
                    var scope = this.getScopeForKey(key);
                    if (this == scope) {
                        return this.callBase();
                    } else if (scope != null) {
                        return scope.get(key);
                    } else {
                        return null;
                    }
                },
                getScopeForKey: function (key) {
                    // try to find value for first key
                    var value = this.$[key];

                    // if value was found
                    if (!rAppid._.isUndefined(value)) {
                        return this;
                    } else if (this.$parentScope) {
                        return this.$parentScope.getScopeForKey(key);
                    } else {
                        return null;
                    }
                },
                getScopeForFncName: function(fncName){
                    var fnc = this[fncName];
                    if(!rAppid._.isUndefined(fnc) && rAppid._.isFunction(fnc)){
                        return this;
                    } else if(this.$parentScope){
                        return this.$parentScope.getScopeForFncName(fncName);
                    } else {
                        return null;
                    }
                },
                _preinitialize: function () {

                },
                _initializationComplete: function () {
                    this.$initialized = true;
                },
                _getTextContentFromDescriptor:function (desc) {
                    return desc.textContent ? desc.textContent : desc.text;
                }
            });
        }
    );
});