/*
Copyright 2013, KISSY v1.40
MIT Licensed
build time: Sep 17 23:09
*/
/*
 Combined processedModules by KISSY Module Compiler: 

 node/base
 node/attach
 node/override
 node/anim
 node
*/

/**
 * @ignore
 * definition for node and nodelist
 * @author yiminghe@gmail.com, lifesinger@gmail.com
 */
KISSY.add('node/base', function (S, Dom, Event, undefined) {
    var AP = Array.prototype,
        slice = AP.slice,
        NodeType = Dom.NodeType,
        push = AP.push,
        makeArray = S.makeArray,
        isNodeList = Dom.isDomNodeList;

    /**
     * The NodeList class provides a {@link KISSY.DOM} wrapper for manipulating Dom Node.
     * use KISSY.all/one to retrieve NodeList instances.
     *
     *
     *      @example
     *      KISSY.all('a').attr('href','http://docs.kissyui.com');
     *
     * @class KISSY.NodeList
     */
    function NodeList(html, props, ownerDocument) {
        var self = this,
            domNode;

        if (!(self instanceof NodeList)) {
            return new NodeList(html, props, ownerDocument);
        }

        // handle NodeList(''), NodeList(null), or NodeList(undefined)
        if (!html) {
            return self;
        }

        else if (typeof html == 'string') {
            // create from html
            domNode = Dom.create(html, props, ownerDocument);
            // ('<p>1</p><p>2</p>') 转换为 NodeList
            if (domNode.nodeType === NodeType.DOCUMENT_FRAGMENT_NODE) { // fragment
                push.apply(this, makeArray(domNode.childNodes));
                return self;
            }
        }

        else if (S.isArray(html) || isNodeList(html)) {
            push.apply(self, makeArray(html));
            return self;
        }

        else {
            // node, document, window
            domNode = html;
        }

        self[0] = domNode;
        self.length = 1;
        return self;
    }

    NodeList.prototype = {
        constructor: NodeList,

        isNodeList: true,

        /**
         * length of nodelist
         * @type {Number}
         */
        length: 0,


        /**
         * Get one node at index
         * @param {Number} index Index position.
         * @return {KISSY.NodeList}
         */
        item: function (index) {
            var self = this;
            if (typeof index==='number') {
                if (index >= self.length) {
                    return null;
                } else {
                    return new NodeList(self[index]);
                }
            } else {
                return new NodeList(index);
            }
        },

        /**
         * return a new NodeList object which consists of current node list and parameter node list.
         * @param {KISSY.NodeList} selector Selector string or html string or common dom node.
         * @param {KISSY.NodeList|Number} [context] Search context for selector
         * @param {Number} [index] Insert position.
         * @return {KISSY.NodeList} a new nodelist
         */
        add: function (selector, context, index) {
            if (typeof context==='number') {
                index = context;
                context = undefined;
            }
            var list = NodeList.all(selector, context).getDOMNodes(),
                ret = new NodeList(this);
            if (index === undefined) {
                push.apply(ret, list);
            } else {
                var args = [index, 0];
                args.push.apply(args, list);
                AP.splice.apply(ret, args);
            }
            return ret;
        },

        /**
         * Get part of node list.
         * @param {Number} start Start position.
         * @param {number} end End position.
         * @return {KISSY.NodeList}
         */
        slice: function (start, end) {
            // ie<9 : [1,2].slice(-2,undefined) => []
            // ie<9 : [1,2].slice(-2) => [1,2]
            // fix #85
            return new NodeList(slice.apply(this, arguments));
        },

        /**
         * Retrieves the DOMNodes.
         */
        getDOMNodes: function () {
            return slice.call(this);
        },

        /**
         * Applies the given function to each Node in the NodeList.
         * @param {Function} fn The function to apply. It receives 3 arguments:
         * the current node instance, the node's index,
         * and the NodeList instance
         * @param [context] An optional context to
         * apply the function with Default context is the current NodeList instance
         * @return {KISSY.NodeList}
         */
        each: function (fn, context) {
            var self = this;

            S.each(self, function (n, i) {
                n = new NodeList(n);
                return fn.call(context || n, n, i, self);
            });

            return self;
        },
        /**
         * Retrieves the DOMNode.
         * @return {HTMLElement}
         */
        getDOMNode: function () {
            return this[0];
        },

        /**
         * return last stack node list.
         * @return {KISSY.NodeList}
         */
        end: function () {
            var self = this;
            return self.__parent || self;
        },

        /**
         * return new NodeList which contains only nodes which passes filter
         * @param {String|Function} filter
         * @return {KISSY.NodeList}
         */
        filter: function (filter) {
            return new NodeList(Dom.filter(this, filter));
        },

        /**
         * Get node list which are descendants of current node list.
         * @param {String} selector Selector string
         * @return {KISSY.NodeList}
         */
        all: function (selector) {
            var ret,
                self = this;
            if (self.length > 0) {
                ret = NodeList.all(selector, self);
            } else {
                ret = new NodeList();
            }
            ret.__parent = self;
            return ret;
        },

        /**
         * Get node list which match selector under current node list sub tree.
         * @param {String} selector
         * @return {KISSY.NodeList}
         */
        one: function (selector) {
            var self = this,
                all = self.all(selector),
                ret = all.length ? all.slice(0, 1) : null;
            if (ret) {
                ret.__parent = self;
            }
            return ret;
        }
    };

    S.mix(NodeList, {
        /**
         * Get node list from selector or construct new node list from html string.
         * Can also called from KISSY.all
         * @param {String|KISSY.NodeList} selector Selector string or html string or common dom node.
         * @param {String|KISSY.NodeList} [context] Search context for selector
         * @return {KISSY.NodeList}
         * @member KISSY.NodeList
         * @static
         */
        all: function (selector, context) {
            // are we dealing with html string ?
            // TextNode 仍需要自己 new Node
            if (typeof selector == 'string' &&
                (selector = S.trim(selector)) &&
                selector.length >= 3 &&
                S.startsWith(selector, '<') &&
                S.endsWith(selector, '>')) {
                if (context) {
                    if (context['getDOMNode']) {
                        context = context[0];
                    }
                    context = context['ownerDocument'] || context;
                }
                return new NodeList(selector, undefined, context);
            }
            return new NodeList(Dom.query(selector, context));
        },

        /**
         * Get node list with length of one
         * from selector or construct new node list from html string.
         * @param {String|KISSY.NodeList} selector Selector string or html string or common dom node.
         * @param {String|KISSY.NodeList} [context] Search context for selector
         * @return {KISSY.NodeList}
         * @member KISSY.NodeList
         * @static
         */
        one: function (selector, context) {
            var all = NodeList.all(selector, context);
            return all.length ? all.slice(0, 1) : null;
        }
    });

    /**
     * Same with {@link KISSY.DOM.NodeType}
     * @member KISSY.NodeList
     * @property NodeType
     * @static
     */
    NodeList.NodeType = NodeType;

    NodeList.KeyCode = Event.KeyCode;

    NodeList.Gesture = Event.Gesture;

    NodeList.REPLACE_HISTORY = Event.REPLACE_HISTORY;

    return NodeList;
}, {
    requires: ['dom', 'event/dom']
});


/*
 Notes:
 2011-05-25
 - yiminghe@gmail.com：参考 jquery，只有一个 NodeList 对象，Node 就是 NodeList 的别名

 2010.04
 - each 方法传给 fn 的 this, 在 jQuery 里指向原生对象，这样可以避免性能问题。
 但从用户角度讲，this 的第一直觉是 $(this), kissy 和 yui3 保持一致，牺牲
 性能，以易用为首。
 - 有了 each 方法，似乎不再需要 import 所有 dom 方法，意义不大。
 - dom 是低级 api, node 是中级 api, 这是分层的一个原因。还有一个原因是，如果
 直接在 node 里实现 dom 方法，则不大好将 dom 的方法耦合到 nodelist 里。可
 以说，技术成本会制约 api 设计。
 */
/**
 * @ignore
 * import methods from Dom to NodeList.prototype
 * @author yiminghe@gmail.com
 */
KISSY.add('node/attach', function (S, Dom, Event, NodeList, undefined) {
    var NLP = NodeList.prototype,
        makeArray = S.makeArray,
    // Dom 添加到 NP 上的方法
    // if Dom methods return undefined , Node methods need to transform result to itself
        DOM_INCLUDES_NORM = [
            'nodeName',
            'isCustomDomain',
            'getEmptyIframeSrc',
            'equals',
            'contains',
            'index',
            'scrollTop',
            'scrollLeft',
            'height',
            'width',
            'innerHeight',
            'innerWidth',
            'outerHeight',
            'outerWidth',
            'addStyleSheet',
            // 'append' will be overridden
            'appendTo',
            // 'prepend' will be overridden
            'prependTo',
            'insertBefore',
            'before',
            'after',
            'insertAfter',
            'test',
            'hasClass',
            'addClass',
            'removeClass',
            'replaceClass',
            'toggleClass',
            'removeAttr',
            'hasAttr',
            'hasProp',
            // anim override
//            'show',
//            'hide',
//            'toggle',
            'scrollIntoView',
            'remove',
            'empty',
            'removeData',
            'hasData',
            'unselectable',
            'wrap',
            'wrapAll',
            'replaceWith',
            'wrapInner',
            'unwrap'
        ],
    // if return array ,need transform to nodelist
        DOM_INCLUDES_NORM_NODE_LIST = [
            'getWindow',
            'getDocument',
            'filter',
            'first',
            'last',
            'parent',
            'closest',
            'next',
            'prev',
            'clone',
            'siblings',
            'contents',
            'children'
        ],
    // if set return this else if get return true value ,no nodelist transform
        DOM_INCLUDES_NORM_IF = {
            // dom method : set parameter index
            'attr': 1,
            'text': 0,
            'css': 1,
            'style': 1,
            'val': 0,
            'prop': 1,
            'offset': 0,
            'html': 0,
            'outerHTML': 0,
            'outerHtml': 0,
            'data': 1
        },
    // Event 添加到 NP 上的方法
        EVENT_INCLUDES_SELF = [
            'on',
            'detach',
            'delegate',
            'undelegate'
        ],
        EVENT_INCLUDES_RET = [
            'fire',
            'fireHandler'
        ];

    NodeList.KeyCode = Event.KeyCode;

    function accessNorm(fn, self, args) {
        args.unshift(self);
        var ret = Dom[fn].apply(Dom, args);
        if (ret === undefined) {
            return self;
        }
        return ret;
    }

    function accessNormList(fn, self, args) {
        args.unshift(self);
        var ret = Dom[fn].apply(Dom, args);
        if (ret === undefined) {
            return self;
        }
        else if (ret === null) {
            return null;
        }
        return new NodeList(ret);
    }

    function accessNormIf(fn, self, index, args) {
        // get
        if (args[index] === undefined
            // 并且第一个参数不是对象，否则可能是批量设置写
            && !S.isObject(args[0])) {
            args.unshift(self);
            return Dom[fn].apply(Dom, args);
        }
        // set
        return accessNorm(fn, self, args);
    }

    S.each(DOM_INCLUDES_NORM, function (k) {
        NLP[k] = function () {
            var args = makeArray(arguments);
            return accessNorm(k, this, args);
        };
    });

    S.each(DOM_INCLUDES_NORM_NODE_LIST, function (k) {
        NLP[k] = function () {
            var args = makeArray(arguments);
            return accessNormList(k, this, args);
        };
    });

    S.each(DOM_INCLUDES_NORM_IF, function (index, k) {
        NLP[k] = function () {
            var args = makeArray(arguments);
            return accessNormIf(k, this, index, args);
        };
    });

    S.each(EVENT_INCLUDES_SELF, function (k) {
        NLP[k] = function () {
            var self = this,
                args = makeArray(arguments);
            args.unshift(self);
            Event[k].apply(Event, args);
            return self;
        }
    });

    S.each(EVENT_INCLUDES_RET, function (k) {
        NLP[k] = function () {
            var self = this,
                args = makeArray(arguments);
            args.unshift(self);
            return Event[k].apply(Event, args);
        }
    });
}, {
    requires: ['dom', 'event/dom', './base']
});

/*
 2011-05-24
 - yiminghe@gmail.com：
 - 将 Dom 中的方法包装成 NodeList 方法
 - Node 方法调用参数中的 KISSY NodeList 要转换成第一个 HTML Node
 - 要注意链式调用，如果 Dom 方法返回 undefined （无返回值），则 NodeList 对应方法返回 this
 - 实际上可以完全使用 NodeList 来代替 Dom，不和节点关联的方法如：viewportHeight 等，在 window，document 上调用
 - 存在 window/document 虚节点，通过 S.one(window)/new Node(window) ,S.one(document)/new NodeList(document) 获得
 */
/**
 * @ignore
 * overrides methods in NodeList.prototype
 * @author yiminghe@gmail.com
 */
KISSY.add('node/override', function (S, Dom, NodeList) {
    var NLP = NodeList.prototype;

    /**
     * Insert every element in the set of newNodes to the end of every element in the set of current node list.
     * @param {KISSY.NodeList} newNodes Nodes to be inserted
     * @return {KISSY.NodeList} this
     * @method append
     * @member KISSY.NodeList
     */


    /**
     * Insert every element in the set of newNodes to the beginning of every element in the set of current node list.
     * @param {KISSY.NodeList} newNodes Nodes to be inserted
     * @return {KISSY.NodeList} this
     * @method prepend
     * @member KISSY.NodeList
     */


        // append(node ,parent): reverse param order
        // appendTo(parent,node): normal
    S.each(['append', 'prepend', 'before', 'after'], function (insertType) {
        NLP[insertType] = function (html) {
            var newNode = html, self = this;
            // create
            if (typeof newNode == 'string') {
                newNode = Dom.create(newNode);
            }
            if (newNode) {
                Dom[insertType](newNode, self);
            }
            return self;
        };
    });

    S.each(['wrap', 'wrapAll', 'replaceWith', 'wrapInner'], function (fixType) {
        var orig = NLP[fixType];
        NLP[fixType] = function (others) {
            var self = this;
            if (typeof others == 'string') {
                others = NodeList.all(others, self[0].ownerDocument);
            }
            return orig.call(self, others);
        };
    })
}, {
    requires: ['dom', './base', './attach']
});

/*
 2011-04-05 yiminghe@gmail.com
 - 增加 wrap/wrapAll/replaceWith/wrapInner/unwrap/contents

 2011-05-24
 - yiminghe@gmail.com：
 - 重写 NodeList 的某些方法
 - 添加 one ,all ，从当前 NodeList 往下开始选择节点
 - 处理 append ,prepend 和 Dom 的参数实际上是反过来的
 - append/prepend 参数是节点时，如果当前 NodeList 数量 > 1 需要经过 clone，因为同一节点不可能被添加到多个节点中去（NodeList）
 */
/**
 * @ignore
 * anim-node-plugin
 * @author yiminghe@gmail.com,
 *         lifesinger@gmail.com,
 *         qiaohua@taobao.com,
 *
 */
KISSY.add('node/anim', function (S, Dom, Anim, Node, undefined) {
    var FX = [
        // height animations
        [ 'height', 'margin-top', 'margin-bottom', 'padding-top', 'padding-bottom' ],
        // width animations
        [ 'width', 'margin-left', 'margin-right', 'padding-left', 'padding-right' ],
        // opacity animations
        [ 'opacity' ]
    ];

    function getFxs(type, num, from) {
        var ret = [],
            obj = {};
        for (var i = from || 0; i < num; i++) {
            ret.push.apply(ret, FX[i]);
        }
        for (i = 0; i < ret.length; i++) {
            obj[ret[i]] = type;
        }
        return obj;
    }

    S.augment(Node, {
        /**
         * animate for current node list.
         * @param var_args see {@link KISSY.Anim}
         * @chainable
         * @member KISSY.NodeList
         */
        animate: function (var_args) {
            var self = this,
                originArgs = S.makeArray(arguments);
            S.each(self, function (elem) {
                var args = S.clone(originArgs),
                    arg0 = args[0];
                if (arg0.to) {
                    arg0.node = elem;
                    Anim(arg0).run();
                } else {
                    Anim.apply(undefined, [elem].concat(args)).run();
                }
            });
            return self;
        },
        /**
         * stop anim of current node list.
         * @param {Boolean} [end] see {@link KISSY.Anim#static-method-stop}
         * @param [clearQueue]
         * @param [queue]
         * @chainable
         * @member KISSY.NodeList
         */
        stop: function (end, clearQueue, queue) {
            var self = this;
            S.each(self, function (elem) {
                Anim.stop(elem, end, clearQueue, queue);
            });
            return self;
        },
        /**
         * pause anim of current node list.
         * @param {Boolean} end see {@link KISSY.Anim#static-method-pause}
         * @param queue
         * @chainable
         * @member KISSY.NodeList
         */
        pause: function (end, queue) {
            var self = this;
            S.each(self, function (elem) {
                Anim.pause(elem, queue);
            });
            return self;
        },
        /**
         * resume anim of current node list.
         * @param {Boolean} end see {@link KISSY.Anim#static-method-resume}
         * @param queue
         * @chainable
         * @member KISSY.NodeList
         */
        resume: function (end, queue) {
            var self = this;
            S.each(self, function (elem) {
                Anim.resume(elem, queue);
            });
            return self;
        },
        /**
         * whether one of current node list is animating.
         * @return {Boolean}
         * @member KISSY.NodeList
         */
        isRunning: function () {
            var self = this;
            for (var i = 0; i < self.length; i++) {
                if (Anim.isRunning(self[i])) {
                    return true;
                }
            }
            return false;
        },
        /**
         * whether one of current node list 's animation is paused.
         * @return {Boolean}
         * @member KISSY.NodeList
         */
        isPaused: function () {
            var self = this;
            for (var i = 0; i < self.length; i++) {
                if (Anim.isPaused(self[i])) {
                    return true;
                }
            }
            return false;
        }
    });


    /**
     * animate show effect for current node list.
     * @param {Number} duration duration of effect
     * @param {Function} [complete] callback function on anim complete.
     * @param {String|Function} [easing] easing type or custom function.
     * @chainable
     * @member KISSY.NodeList
     * @method show
     */


    /**
     * animate hide effect for current node list.
     * @param {Number} duration duration of effect
     * @param {Function} [complete] callback function on anim complete.
     * @param {String|Function} [easing] easing type or custom function.
     * @chainable
     * @member KISSY.NodeList
     * @method hide
     */


    /**
     * toggle show and hide effect for current node list.
     * @param {Number} duration duration of effect
     * @param {Function} [complete] callback function on anim complete.
     * @param {String|Function} [easing] easing type or custom function.
     * @chainable
     * @member KISSY.NodeList
     * @method toggle
     */


    /**
     * animate fadeIn effect for current node list.
     * @param {Number} duration duration of effect
     * @param {Function} [complete] callback function on anim complete.
     * @param {String|Function} [easing] easing type or custom function.
     * @chainable
     * @member KISSY.NodeList
     * @method fadeIn
     */


    /**
     * animate fadeOut effect for current node list.
     * @param {Number} duration duration of effect
     * @param {Function} [complete] callback function on anim complete.
     * @param {String|Function} [easing] easing type or custom function.
     * @chainable
     * @member KISSY.NodeList
     * @method fadeOut
     */


    /**
     * toggle fadeIn and fadeOut effect for current node list.
     * @param {Number} duration duration of effect
     * @param {Function} [complete] callback function on anim complete.
     * @param {String|Function} [easing] easing type or custom function.
     * @chainable
     * @member KISSY.NodeList
     * @method fadeToggle
     */


    /**
     * animate slideUp effect for current node list.
     * @param {Number} duration duration of effect
     * @param {Function} [complete] callback function on anim complete.
     * @param {String|Function} [easing] easing type or custom function.
     * @chainable
     * @member KISSY.NodeList
     * @method slideUp
     */


    /**
     * animate slideDown effect for current node list.
     * @param {Number} duration duration of effect
     * @param {Function} [complete] callback function on anim complete.
     * @param {String|Function} [easing] easing type or custom function.
     * @chainable
     * @member KISSY.NodeList
     * @method slideDown
     */


    /**
     * toggle slideUp and slideDown effect for current node list.
     * @param {Number} duration duration of effect
     * @param {Function} [complete] callback function on anim complete.
     * @param {String|Function} [easing] easing type or custom function.
     * @chainable
     * @member KISSY.NodeList
     * @method slideToggle
     */


    S.each({
            show: getFxs('show', 3),
            hide: getFxs('hide', 3),
            toggle: getFxs('toggle', 3),
            fadeIn: getFxs('show', 3, 2),
            fadeOut: getFxs('hide', 3, 2),
            fadeToggle: getFxs('toggle', 3, 2),
            slideDown: getFxs('show', 1),
            slideUp: getFxs('hide', 1),
            slideToggle: getFxs('toggle', 1)
        },
        function (v, k) {
            Node.prototype[k] = function (duration, complete, easing) {
                var self = this;
                // 没有参数时，调用 Dom 中的对应方法
                if (Dom[k] && !duration) {
                    Dom[k](self);
                } else {
                    S.each(self, function (elem) {
                        Anim(elem, v, duration, easing, complete).run();
                    });
                }
                return self;
            };
        });
}, {
    requires: ['dom', 'anim', './base']
});
/*
 2011-11-10
 - 重写，逻辑放到 Anim 模块，这边只进行转发

 2011-05-17
 - yiminghe@gmail.com：添加 stop ，随时停止动画
 */
/**
 * @ignore
 * node
 * @author yiminghe@gmail.com
 */
KISSY.add('node', function (S, Node) {
    S.mix(S, {
        Node: Node,
        NodeList: Node,
        one: Node.one,
        all: Node.all
    });
    return Node;
}, {
    requires: [
        'node/base',
        'node/attach',
        'node/override',
        'node/anim'
    ]
});

