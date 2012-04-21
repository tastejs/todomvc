var requirejs = (typeof requirejs === "undefined" ? require("requirejs") : requirejs);

requirejs(["rAppid"], function (rAppid) {
    rAppid.defineClass("js.html.DomElement",
        ["js.core.Component", "js.core.Content", "js.core.Binding"], function (Component, Content, Binding) {

            var rspace = /\s+/;
            var domEvents = ['click','dblclick','keyup', 'keydown' , 'change'];

            var DomElementFunctions = {
                defaults:{
                    selected:false,
                    selectable:false
                },
                $behavesAsDomElement:true,
                ctor:function (attributes, descriptor, applicationDomain, parentScope, rootScope) {
                    this.$renderMap = {};
                    this.$childViews = [];
                    this.$contentChildren = [];
                    this.callBase();

                    if (descriptor) {
                        if (!this.$tagName) {
                            this.$tagName = descriptor.tagName;
                        }
                        if (!this.$namespace) {
                            this.$namespace = descriptor.namespaceURI;
                        }
                    }
                },
                _initializeAttributes:function (attributes) {
                    this.callBase();

                    if (attributes.tagName) {
                        this.$tagName = attributes.tagName;
                        delete(attributes.tagName);
                    }
                },
                addChild:function (child) {
                    this.callBase();
                    if (child instanceof DomElement || child.render) {
                        this.$childViews.push(child);
                        if(this.isRendered()){
                            this._renderChild(child);
                        }
                    }else if(child instanceof Content){
                        this.$contentChildren.push(child);
                    }
                },
                getPlaceHolder:function (name) {
                    for (var i = 0; i < this.$children.length; i++) {
                        if (this.$children[i].$.name === name) {
                            return this.$children[i];
                        }
                    }
                    var placeholder;
                    for (i = 0; i < this.$children.length; i++) {
                        if (this.$children[i].getPlaceHolder) {
                            placeholder = this.$children[i].getPlaceHolder(name);
                            if (placeholder) {
                                return placeholder;
                            }
                        }

                    }
                    return null;
                },
                render:function () {

                    if (!this.$initialized) {
                        this._initialize(this.$creationPolicy);
                    }
                    // check if it is already rendered
                    if (this.isRendered()) {
                        return this.$el;
                    }

                    this.$renderedChildren = [];

                    this.$el = document.createElement(this.$tagName);
                    this.$el.owner = this;

                    // TODO: read layout and create renderMAP
                    /**
                     * <js:Template name="layout"><placeholder cid="icon"/><placeholder cid="label"/></js:Template>
                     */

                    this._renderChildren(this.$childViews);
                    this._renderContentChildren(this.$contentChildren);
                    this._renderAttributes(this.$);
                    this._bindDomEvents(this.$el);

                    return this.$el;
                },
                _bindDomEvents:function (el) {
                    var self = this, domEvent;
                    function bindDomEvent(eventName,scope,fncName){
                        self.bind(eventName,scope[fncName],scope);
                        domEvent = eventName.substr(2);
                        self.addEventListener(domEvent, function (e) {
                            self.trigger(eventName, e, self);
                        });
                    }
                    var eventDef;
                    for(var i = 0 ; i < this.$eventDefinitions.length; i++){
                        eventDef = this.$eventDefinitions[i];
                        if(!this._isComponentEvent(eventDef.name.substr(2))){
                            bindDomEvent(eventDef.name, eventDef.scope, eventDef.fncName);
                        }

                    }
                },
                _renderChildren:function (children) {
                    // for all children
                    var child;
                    for (var i = 0; i < children.length; i++) {
                        child = children[i];
                        this._renderChild(child);
                    }
                },
                _renderContentChildren: function(children){
                    var child;
                    for(var i = 0; i < children.length; i++){
                        child = children[i];
                        var ref = child.get('ref');
                        var placeHolder = this.getPlaceHolder(ref);
                        if (placeHolder) {
                            placeHolder.set({content:child});
                        }
                    }
                },
                _renderChild:function (child) {
                    if (rAppid._.isFunction(child.render)) {
                        var el = child.render();
                        this.$renderedChildren.push(child);
                        if (el) {
                            this.$el.appendChild(el);
                        }
                    }
                },
                _getIndexOfPlaceHolder:function (placeHolder) {
                    if (this.$layoutTpl) {
                        var child;
                        for (var i = 0; i < this.$layoutTpl.$children.length; i++) {
                            child = this.$layoutTpl.$children[i];
                            if (placeHolderId == child.$cid) {
                                return i;
                            }
                        }
                    }
                    return -1;
                },
                isRendered:function () {
                    return typeof (this.$el) !== "undefined";
                },
                _renderAttributes:function (attributes) {
                    var attr;
                    for (var key in attributes) {
                        if (attributes.hasOwnProperty(key) && key.indexOf("$") !== 0 && key.indexOf("data") !== 0) {
                            attr = attributes[key];
                            this._renderAttribute(key, attr);
                        }
                    }
                },
                _renderAttribute:function (key, attr) {
                    var method = this.$renderMap[key];
                    var prev = this.$previousAttributes[key];

                    if (rAppid._.isUndefined(method)) {
                        // generic call of render functions
                        var k = key[0].toUpperCase() + key.substr(1);
                        var methodName = "_render" + k;
                        method = this[methodName];

                        if (!rAppid._.isFunction(method)) {
                            method = false;
                        }

                        this.$renderMap[key] = method;
                    }
                    if (method !== false) {
                        method.call(this, attr, prev);
                    } else if (this.$behavesAsDomElement) {
                        this.$el.setAttribute(key, attr);
                    }
                },

                _renderVisible:function (visible) {
                    if (visible === true) {
                        this.removeClass('hidden');
                    } else if (visible === false) {
                        this.addClass('hidden');
                    }
                },
                _renderHidden:function (hidden) {
                    if (typeof(hidden) !== "undefined") {
                        this.set({visible:!hidden});
                    }
                },
                _renderSelected:function (selected) {
                    if (selected === true) {
                        this.addClass('active');
                    } else if (selected === false) {
                        this.removeClass('active');
                    }
                },
                _renderSelectable:function (selectable) {
                    if (selectable === true) {
                        var self = this;
                        this.addEventListener('click', function (e) {
                            // e.preventDefault();
                            self.set({selected:!self.$.selected});
                        });
                    } else {
                        this.set({selected:false});
                    }
                },
                _renderWidth:function (width) {
                    if (width) {
                        if (typeof(width) !== "string") {
                            width += "px";
                        }
                        this.$el.style.width = width;
                    }
                },
                _renderHeight:function (height) {
                    if (height) {
                        if (typeof(height) !== "string") {
                            height += "px";
                        }
                        this.$el.style.height = height;
                    }
                },
                _commitChangedAttributes:function (attributes) {
                    if (this.isRendered()) {
                        this._renderAttributes(attributes);
                    }
                },

                dom:function (element) {
                    return new DomManipulation(element || this);
                }

            };

            var DomManipulationFunctions = {
                hasClass:function (value) {
                    // var classes = this.$el.className.split(" "+value+" ");

                },
                addClass:function (value) {
                    var classNames = value.split(rspace);

                    if (!this.$el.className && classNames.length === 1) {
                        this.$el.className = value;
                    } else {
                        var setClasses = this.$el.className.split(rspace);

                        for (var i = 0; i < classNames.length; i++) {
                            if (setClasses.indexOf(classNames[i]) == -1) {
                                setClasses.push(classNames[i]);
                            }
                        }

                        this.$el.className = setClasses.join(" ");

                    }
                },
                removeClass:function (value) {
                    if (this.$el.className.length === 0) {
                        return;
                    }
                    var removeClasses = value.split(rspace);

                    var classes = this.$el.className.split(rspace);

                    for (var i = 0; i < removeClasses.length; i++) {
                        var index = classes.indexOf(removeClasses[i]);
                        if (index != -1) {
                            classes.splice(index, 1);
                        }
                    }

                    if (classes.length === 0) {
                        this.$el.removeAttribute('class');
                    } else {
                        this.$el.className = classes.join(" ");
                    }
                },
                addEventListener:function (type, eventHandle) {
                    if (this.$el.addEventListener) {
                        this.$el.addEventListener(type, eventHandle, false);

                    } else if (this.$el.attachEvent) {
                        this.$el.attachEvent("on" + type, eventHandle);
                    }
                },
                removeEvent:document.removeEventListener ?
                    function (type, handle) {
                        if (this.$el.removeEventListener) {
                            this.$el.removeEventListener(type, handle, false);
                        }
                    } :
                    function (type, handle) {
                        if (this.$el.detachEvent) {
                            this.$el.detachEvent("on" + type, handle);
                        }
                    }
            };

            var DomManipulation = inherit.Base.inherit(rAppid._.extend({
                ctor:function (elm) {
                    this.$el = elm;
                }
            }, DomManipulationFunctions));
            var DomElement = Component.inherit(rAppid._.extend(DomElementFunctions, DomManipulationFunctions));
            return DomElement;
        }
    );
});