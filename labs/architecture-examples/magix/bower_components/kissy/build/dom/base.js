/*
Copyright 2013, KISSY v1.40dev
MIT Licensed
build time: Sep 17 22:59
*/
/*
 Combined processedModules by KISSY Module Compiler: 

 dom/base/api
 dom/base/attr
 dom/base/class
 dom/base/create
 dom/base/data
 dom/base/insertion
 dom/base/offset
 dom/base/style
 dom/base/selector
 dom/base/traversal
 dom/base
*/

/**
 * @ignore
 * dom
 * @author yiminghe@gmail.com, lifesinger@gmail.com
 */
KISSY.add('dom/base/api', function (S) {
    var WINDOW = S.Env.host || {},
        DOCUMENT = WINDOW.document,
        UA = S.UA,
        RE_NUM = /[\-+]?(?:\d*\.|)\d+(?:[eE][\-+]?\d+|)/.source,
        /**
         * Dom Element node type.
         * @enum {Number} KISSY.DOM.NodeType
         */
            NodeType = {
            /**
             * element type
             */
            ELEMENT_NODE: 1,
            /**
             * attribute node type
             */
            'ATTRIBUTE_NODE': 2,
            /**
             * text node type
             */
            TEXT_NODE: 3,
            /**
             * cdata node type
             */
            'CDATA_SECTION_NODE': 4,
            /**
             * entity reference node type
             */
            'ENTITY_REFERENCE_NODE': 5,
            /**
             * entity node type
             */
            'ENTITY_NODE': 6,
            /**
             * processing instruction node type
             */
            'PROCESSING_INSTRUCTION_NODE': 7,
            /**
             * comment node type
             */
            COMMENT_NODE: 8,
            /**
             * document node type
             */
            DOCUMENT_NODE: 9,
            /**
             * document type
             */
            'DOCUMENT_TYPE_NODE': 10,
            /**
             * document fragment type
             */
            DOCUMENT_FRAGMENT_NODE: 11,
            /**
             * notation type
             */
            'NOTATION_NODE': 12
        },
        /**
         * KISSY Dom Utils.
         * Provides Dom helper methods.
         * @class KISSY.DOM
         * @singleton
         */
            Dom = {

            /**
             * Whether has been set a custom domain.
             * Note not perfect: localhost:8888, domain='localhost'
             * @param {Window} [win] Test window. Default current window.
             * @return {Boolean}
             */
            isCustomDomain: function (win) {
                win = win || WINDOW;
                win = Dom.get(win);
                var domain = win.document.domain,
                    hostname = win.location.hostname;
                return domain != hostname &&
                    domain != ( '[' + hostname + ']' );	// IPv6 IP support
            },

            /**
             * Get appropriate src for new empty iframe.
             * Consider custom domain.
             * @param {Window} [win] Window new iframe will be inserted into.
             * @return {String} Src for iframe.
             */
            getEmptyIframeSrc: function (win) {
                win = win || WINDOW;
                win = Dom.get(win);
                if (UA['ie'] && Dom.isCustomDomain(win)) {
                    return  'javascript:void(function(){' + encodeURIComponent(
                        'document.open();' +
                            "document.domain='" +
                            win.document.domain
                            + "';" +
                            'document.close();') + '}())';
                }
                return '';
            },

            NodeType: NodeType,

            /**
             * Return corresponding window if elem is document or window.
             * Return global window if elem is undefined
             * Else return false.
             * @param {undefined|Window|HTMLDocument} [elem]
             * @return {Window|Boolean}
             */
            getWindow: function (elem) {
                if (!elem) {
                    return WINDOW;
                }

                elem = Dom.get(elem);

                if (S.isWindow(elem)) {
                    return elem;
                }

                var doc = elem;

                if (doc.nodeType !== NodeType.DOCUMENT_NODE) {
                    doc = elem.ownerDocument;
                }

                return doc.defaultView || doc.parentWindow;
            },


            /**
             * Return corresponding document of this element.
             * @param {HTMLElement|Window|HTMLDocument} [elem]
             * @return {HTMLDocument}
             */
            getDocument: function (elem) {
                if (!elem) {
                    return DOCUMENT;
                }
                elem = Dom.get(elem);
                return S.isWindow(elem) ?
                    elem['document'] :
                    (elem.nodeType == NodeType.DOCUMENT_NODE ?
                        elem :
                        elem.ownerDocument);
            },

            isDomNodeList: function (o) {
                // 注1：ie 下，有 window.item, typeof node.item 在 ie 不同版本下，返回值不同
                // 注2：select 等元素也有 item, 要用 !node.nodeType 排除掉
                // 注3：通过 namedItem 来判断不可靠
                // 注4：getElementsByTagName 和 querySelectorAll 返回的集合不同
                // 注5: 考虑 iframe.contentWindow
                return o && !o.nodeType && o.item && !o.setTimeout;
            },

            /**
             * Get node 's nodeName in lowercase.
             * @param {HTMLElement[]|String|HTMLElement} selector Matched elements.
             * @return {String} el 's nodeName in lowercase
             */
            nodeName: function (selector) {
                var el = Dom.get(selector),
                    nodeName = el.nodeName.toLowerCase();
                // http://msdn.microsoft.com/en-us/library/ms534388(VS.85).aspx
                if (UA['ie']) {
                    var scopeName = el['scopeName'];
                    if (scopeName && scopeName != 'HTML') {
                        nodeName = scopeName.toLowerCase() + ':' + nodeName;
                    }
                }
                return nodeName;
            },

            _RE_NUM_NO_PX: new RegExp("^(" + RE_NUM + ")(?!px)[a-z%]+$", "i")
        };

    S.mix(Dom, NodeType);

    return Dom;

});

/*
 2011-08
 - 添加节点类型枚举值，方便依赖程序清晰
 */
/**
 * @ignore
 * dom-attr
 * @author yiminghe@gmail.com, lifesinger@gmail.com
 */
KISSY.add('dom/base/attr', function (S, Dom, undefined) {

    var doc = S.Env.host.document,
        NodeType = Dom.NodeType,
        docElement = doc && doc.documentElement,
        EMPTY = '',
        nodeName = Dom.nodeName,
        R_BOOLEAN = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
        R_FOCUSABLE = /^(?:button|input|object|select|textarea)$/i,
        R_CLICKABLE = /^a(?:rea)?$/i,
        R_INVALID_CHAR = /:|^on/,
        R_RETURN = /\r/g,

        attrFix = {
        },

        attrFn = {
            val: 1,
            css: 1,
            html: 1,
            text: 1,
            data: 1,
            width: 1,
            height: 1,
            offset: 1,
            scrollTop: 1,
            scrollLeft: 1
        },

        attrHooks = {
            // http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
            tabindex: {
                get: function (el) {
                    // elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
                    var attributeNode = el.getAttributeNode('tabindex');
                    return attributeNode && attributeNode.specified ?
                        parseInt(attributeNode.value, 10) :
                        R_FOCUSABLE.test(el.nodeName) ||
                            R_CLICKABLE.test(el.nodeName) && el.href ?
                            0 :
                            undefined;
                }
            }
        },

        propFix = {
            'hidefocus': 'hideFocus',
            tabindex: 'tabIndex',
            readonly: 'readOnly',
            'for': 'htmlFor',
            'class': 'className',
            maxlength: 'maxLength',
            'cellspacing': 'cellSpacing',
            'cellpadding': 'cellPadding',
            rowspan: 'rowSpan',
            colspan: 'colSpan',
            usemap: 'useMap',
            'frameborder': 'frameBorder',
            'contenteditable': 'contentEditable'
        },

    // Hook for boolean attributes
    // if bool is false
    // - standard browser returns null
    // - ie<8 return false
    // - norm to undefined
        boolHook = {
            get: function (elem, name) {
                // 转发到 prop 方法
                return Dom.prop(elem, name) ?
                    // 根据 w3c attribute , true 时返回属性名字符串
                    name.toLowerCase() :
                    undefined;
            },
            set: function (elem, value, name) {
                var propName;
                if (value === false) {
                    // Remove boolean attributes when set to false
                    Dom.removeAttr(elem, name);
                } else {
                    // 直接设置 true,因为这是 bool 类属性
                    propName = propFix[ name ] || name;
                    if (propName in elem) {
                        // Only set the IDL specifically if it already exists on the element
                        elem[ propName ] = true;
                    }
                    elem.setAttribute(name, name.toLowerCase());
                }
                return name;
            }
        },

        propHooks = {
        },

    // get attribute value from attribute node, only for ie
        attrNodeHook = {
        },

        valHooks = {

            select: {
                // fix for multiple select
                get: function (elem) {
                    var index = elem.selectedIndex,
                        options = elem.options,
                        ret,
                        i,
                        len,
                        one = (String(elem.type) === 'select-one');

                    // Nothing was selected
                    if (index < 0) {
                        return null;
                    } else if (one) {
                        return Dom.val(options[index]);
                    }

                    // Loop through all the selected options
                    ret = [];
                    i = 0;
                    len = options.length;
                    for (; i < len; ++i) {
                        if (options[i].selected) {
                            ret.push(Dom.val(options[i]));
                        }
                    }
                    // Multi-Selects return an array
                    return ret;
                },

                set: function (elem, value) {
                    var values = S.makeArray(value),
                        opts = elem.options;
                    S.each(opts, function (opt) {
                        opt.selected = S.inArray(Dom.val(opt), values);
                    });

                    if (!values.length) {
                        elem.selectedIndex = -1;
                    }
                    return values;
                }
            }

        };

    // Radios and checkboxes getter/setter
    S.each(['radio', 'checkbox'], function (r) {
        valHooks[r] = {
            get: function (elem) {
                // Handle the case where in Webkit '' is returned instead of 'on'
                // if a value isn't specified
                return elem.getAttribute('value') === null ? 'on' : elem.value;
            },
            set: function (elem, value) {
                if (S.isArray(value)) {
                    return elem.checked = S.inArray(Dom.val(elem), value);
                }
                return undefined;
            }
        };
    });

    // IE7- 下，需要用 cssText 来获取
    // 所有浏览器统一下, attr('style') 标准浏览器也不是 undefined
    attrHooks['style'] = {
        get: function (el) {
            return el.style.cssText;
        }
    };

    function getProp(elem, name) {
        name = propFix[name] || name;
        var hook = propHooks[name];
        if (hook && hook.get) {
            return hook.get(elem, name);
        } else {
            return elem[name];
        }
    }

    S.mix(Dom,
        /**
         * @override KISSY.DOM
         * @class
         * @singleton
         */
        {

            _valHooks: valHooks,

            _propFix: propFix,

            _attrHooks: attrHooks,

            _propHooks: propHooks,

            _attrNodeHook: attrNodeHook,

            _attrFix: attrFix,

            /**
             * Get the value of a property for the first element in the set of matched elements.
             * or
             * Set one or more properties for the set of matched elements.
             * @param {HTMLElement[]|String|HTMLElement} selector matched elements
             * @param {String|Object} name
             * The name of the property to set.
             * or
             * A map of property-value pairs to set.
             * @param [value] A value to set for the property.
             * @return {String|undefined|Boolean}
             */
            prop: function (selector, name, value) {
                var elems = Dom.query(selector),
                    i,
                    elem,
                    hook;

                // supports hash
                if (S.isPlainObject(name)) {
                    S.each(name, function (v, k) {
                        Dom.prop(elems, k, v);
                    });
                    return undefined;
                }

                // Try to normalize/fix the name
                name = propFix[ name ] || name;
                hook = propHooks[ name ];
                if (value !== undefined) {
                    for (i = elems.length - 1; i >= 0; i--) {
                        elem = elems[i];
                        if (hook && hook.set) {
                            hook.set(elem, value, name);
                        } else {
                            elem[ name ] = value;
                        }
                    }
                } else {
                    if (elems.length) {
                        return getProp(elems[0], name);
                    }
                }
                return undefined;
            },

            /**
             * Whether one of the matched elements has specified property name
             * @param {HTMLElement[]|String|HTMLElement} selector 元素
             * @param {String} name The name of property to test
             * @return {Boolean}
             */
            hasProp: function (selector, name) {
                var elems = Dom.query(selector),
                    i,
                    len = elems.length,
                    el;
                for (i = 0; i < len; i++) {
                    el = elems[i];
                    if (getProp(el, name) !== undefined) {
                        return true;
                    }
                }
                return false;
            },

            /**
             * Remove a property for the set of matched elements.
             * @param {HTMLElement[]|String|HTMLElement} selector matched elements
             * @param {String} name The name of the property to remove.
             */
            removeProp: function (selector, name) {
                name = propFix[ name ] || name;
                var elems = Dom.query(selector),
                    i,
                    el;
                for (i = elems.length - 1; i >= 0; i--) {
                    el = elems[i];
                    try {
                        el[ name ] = undefined;
                        delete el[ name ];
                    } catch (e) {
                    }
                }
            },

            /**
             * Get the value of an attribute for the first element in the set of matched elements.
             * or
             * Set one or more attributes for the set of matched elements.
             * @param {HTMLElement[]|HTMLElement|String} selector matched elements
             * @param {String|Object} name The name of the attribute to set. or A map of attribute-value pairs to set.
             * @param [val] A value to set for the attribute.
             * @param [pass] internal use by anim
             * @return {String|undefined}
             */
            attr: function (selector, name, val, /*internal use by anim/fx*/pass) {
                /*
                 Hazards From Caja Note:

                 - In IE[67], el.setAttribute doesn't work for attributes like
                 'class' or 'for'.  IE[67] expects you to set 'className' or
                 'htmlFor'.  Caja use setAttributeNode solves this problem.

                 - In IE[67], <input> elements can shadow attributes.  If el is a
                 form that contains an <input> named x, then el.setAttribute(x, y)
                 will set x's value rather than setting el's attribute.  Using
                 setAttributeNode solves this problem.

                 - In IE[67], the style attribute can only be modified by setting
                 el.style.cssText.  Neither setAttribute nor setAttributeNode will
                 work.  el.style.cssText isn't bullet-proof, since it can be
                 shadowed by <input> elements.

                 - In IE[67], you can never change the type of an <button> element.
                 setAttribute('type') silently fails, but setAttributeNode
                 throws an exception.  caja : the silent failure. KISSY throws error.

                 - In IE[67], you can never change the type of an <input> element.
                 setAttribute('type') throws an exception.  We want the exception.

                 - In IE[67], setAttribute is case-sensitive, unless you pass 0 as a
                 3rd argument.  setAttributeNode is case-insensitive.

                 - Trying to set an invalid name like ':' is supposed to throw an
                 error.  In IE[678] and Opera 10, it fails without an error.
                 */

                var els = Dom.query(selector),
                    attrNormalizer,
                    i,
                    el = els[0],
                    ret;

                // supports hash
                if (S.isPlainObject(name)) {
                    pass = val;
                    for (var k in name) {
                        Dom.attr(els, k, name[k], pass);
                    }
                    return undefined;
                }

                // attr functions
                if (pass && attrFn[name]) {
                    return Dom[name](selector, val);
                }

                // scrollLeft
                name = name.toLowerCase();

                if (pass && attrFn[name]) {
                    return Dom[name](selector, val);
                }

                // custom attrs
                name = attrFix[name] || name;

                if (R_BOOLEAN.test(name)) {
                    attrNormalizer = boolHook;
                }
                // only old ie?
                else if (R_INVALID_CHAR.test(name)) {
                    attrNormalizer = attrNodeHook;
                } else {
                    attrNormalizer = attrHooks[name];
                }

                if (val === undefined) {
                    if (el && el.nodeType === NodeType.ELEMENT_NODE) {
                        // browsers index elements by id/name on forms, give priority to attributes.
                        if (nodeName(el) == 'form') {
                            attrNormalizer = attrNodeHook;
                        }
                        if (attrNormalizer && attrNormalizer.get) {
                            return attrNormalizer.get(el, name);
                        }

                        ret = el.getAttribute(name);

                        if (ret === "") {
                            var attrNode = el.getAttributeNode(name);
                            if (!attrNode || !attrNode.specified) {
                                return undefined;
                            }
                        }

                        // standard browser non-existing attribute return null
                        // ie<8 will return undefined , because it return property
                        // so norm to undefined
                        return ret === null ? undefined : ret;
                    }
                } else {
                    for (i = els.length - 1; i >= 0; i--) {
                        el = els[i];
                        if (el && el.nodeType === NodeType.ELEMENT_NODE) {
                            if (nodeName(el) == 'form') {
                                attrNormalizer = attrNodeHook;
                            }
                            if (attrNormalizer && attrNormalizer.set) {
                                attrNormalizer.set(el, val, name);
                            } else {
                                // convert the value to a string (all browsers do this but IE)
                                el.setAttribute(name, EMPTY + val);
                            }
                        }
                    }
                }
                return undefined;
            },

            /**
             * Remove an attribute from each element in the set of matched elements.
             * @param {HTMLElement[]|String} selector matched elements
             * @param {String} name An attribute to remove
             */
            removeAttr: function (selector, name) {
                name = name.toLowerCase();
                name = attrFix[name] || name;
                var els = Dom.query(selector),
                    propName,
                    el, i;
                for (i = els.length - 1; i >= 0; i--) {
                    el = els[i];
                    if (el.nodeType == NodeType.ELEMENT_NODE) {
                        el.removeAttribute(name);
                        // Set corresponding property to false for boolean attributes
                        if (R_BOOLEAN.test(name) && (propName = propFix[ name ] || name) in el) {
                            el[ propName ] = false;
                        }
                    }
                }
            },

            /**
             * Whether one of the matched elements has specified attribute
             * @method
             * @param {HTMLElement[]|String} selector matched elements
             * @param {String} name The attribute to be tested
             * @return {Boolean}
             */
            hasAttr: docElement && !docElement.hasAttribute ?
                function (selector, name) {
                    name = name.toLowerCase();
                    var elems = Dom.query(selector),
                        i, el,
                        attrNode;
                    // from ppk :http://www.quirksmode.org/dom/w3c_core.html
                    // IE5-7 doesn't return the value of a style attribute.
                    // var $attr = el.attributes[name];
                    for (i = 0; i < elems.length; i++) {
                        el = elems[i];
                        attrNode = el.getAttributeNode(name);
                        if (attrNode && attrNode.specified) {
                            return true;
                        }
                    }
                    return false;
                } :
                function (selector, name) {
                    var elems = Dom.query(selector), i,
                        len = elems.length;
                    for (i = 0; i < len; i++) {
                        //使用原生实现
                        if (elems[i].hasAttribute(name)) {
                            return true;
                        }
                    }
                    return false;
                },

            /**
             * Get the current value of the first element in the set of matched elements.
             * or
             * Set the value of each element in the set of matched elements.
             * @param {HTMLElement[]|String} selector matched elements
             * @param {String|String[]} [value] A string of text or an array of strings corresponding to the value of each matched element to set as selected/checked.
             * @return {undefined|String|String[]|Number}
             */
            val: function (selector, value) {
                var hook, ret, elem, els, i, val;

                //getter
                if (value === undefined) {

                    elem = Dom.get(selector);

                    if (elem) {
                        hook = valHooks[ nodeName(elem) ] || valHooks[ elem.type ];

                        if (hook && 'get' in hook &&
                            (ret = hook.get(elem, 'value')) !== undefined) {
                            return ret;
                        }

                        ret = elem.value;

                        return typeof ret === 'string' ?
                            // handle most common string cases
                            ret.replace(R_RETURN, '') :
                            // handle cases where value is null/undefined or number
                            ret == null ? '' : ret;
                    }

                    return undefined;
                }

                els = Dom.query(selector);
                for (i = els.length - 1; i >= 0; i--) {
                    elem = els[i];
                    if (elem.nodeType !== 1) {
                        return undefined;
                    }

                    val = value;

                    // Treat null/undefined as ''; convert numbers to string
                    if (val == null) {
                        val = '';
                    } else if (typeof val === 'number') {
                        val += '';
                    } else if (S.isArray(val)) {
                        val = S.map(val, function (value) {
                            return value == null ? '' : value + '';
                        });
                    }

                    hook = valHooks[ nodeName(elem)] || valHooks[ elem.type ];

                    // If set returns undefined, fall back to normal setting
                    if (!hook || !('set' in hook) || hook.set(elem, val, 'value') === undefined) {
                        elem.value = val;
                    }
                }
                return undefined;
            },

            /**
             * Get the combined text contents of each element in the set of matched elements, including their descendants.
             * or
             * Set the content of each element in the set of matched elements to the specified text.
             * @param {HTMLElement[]|HTMLElement|String} selector matched elements
             * @param {String} [val] A string of text to set as the content of each matched element.
             * @return {String|undefined}
             */
            text: function (selector, val) {
                var el, els, i, nodeType;
                // getter
                if (val === undefined) {
                    // supports css selector/Node/NodeList
                    el = Dom.get(selector);
                    return Dom._getText(el);
                } else {
                    els = Dom.query(selector);
                    for (i = els.length - 1; i >= 0; i--) {
                        el = els[i];
                        nodeType = el.nodeType;
                        if (nodeType == NodeType.ELEMENT_NODE) {
                            Dom.empty(el);
                            el.appendChild(el.ownerDocument.createTextNode(val));
                        }
                        else if (nodeType == NodeType.TEXT_NODE || nodeType == NodeType.CDATA_SECTION_NODE) {
                            el.nodeValue = val;
                        }
                    }
                }
                return undefined;
            },

            _getText: function (el) {
                return el.textContent;
            }
        });

    return Dom;
}, {
    requires: ['./api']
});
/*
 NOTES:
 yiminghe@gmail.com: 2013-03-19
 - boolean property 和 attribute ie 和其他浏览器不一致，统一为类似 ie8：
 - attr('checked',string) == .checked=true setAttribute('checked','checked') // ie8 相同 setAttribute()
 - attr('checked',false) == removeAttr('check') // ie8 不同, setAttribute ie8 相当于 .checked=true setAttribute('checked','checked')
 - removeAttr('checked') == .checked=false removeAttribute('checked') // ie8 removeAttribute 相同

 yiminghe@gmail.com: 2012-11-27
 - 拆分 ie attr，条件加载

 yiminghe@gmail.com：2011-06-03
 - 借鉴 jquery 1.6,理清 attribute 与 property

 yiminghe@gmail.com：2011-01-28
 - 处理 tabindex，顺便重构

 2010.03
 - 在 jquery/support.js 中，special attrs 里还有 maxlength, cellspacing,
 rowspan, colspan, usemap, frameborder, 但测试发现，在 Grade-A 级浏览器中
 并无兼容性问题。
 - 当 colspan/rowspan 属性值设置有误时，ie7- 会自动纠正，和 href 一样，需要传递
 第 2 个参数来解决。jQuery 未考虑，存在兼容性 bug.
 - jQuery 考虑了未显式设定 tabindex 时引发的兼容问题，kissy 里忽略（太不常用了）
 - jquery/attributes.js: Safari mis-reports the default selected
 property of an option 在 Safari 4 中已修复。

 */
/**
 * batch class operation
 * @ignore
 * @author yiminghe@gmail.com
 */
KISSY.add('dom/base/class', function (S, Dom) {

    var slice = [].slice,
        NodeType = Dom.NodeType,
        RE_SPLIT = /[\.\s]\s*\.?/;

    function strToArray(str) {
        str = S.trim(str || '');
        var arr = str.split(RE_SPLIT),
            newArr = [], v,
            l = arr.length,
            i = 0;
        for (; i < l; i++) {
            if (v = arr[i]) {
                newArr.push(v);
            }
        }
        return newArr;
    }

    function batchClassList(method) {
        return function (elem, classNames) {
            var i, l,
                className,
                classList = elem.classList,
                extraArgs = slice.call(arguments, 2);
            for (i = 0, l = classNames.length; i < l; i++) {
                if (className = classNames[i]) {
                    classList[method].apply(classList, [className].concat(extraArgs));
                }
            }
        }
    }

    function batchEls(method) {
        return function (selector, className) {
            var classNames = strToArray(className),
                extraArgs = slice.call(arguments, 2);
            Dom.query(selector).each(function (elem) {
                if (elem.nodeType == NodeType.ELEMENT_NODE) {
                    Dom[method].apply(Dom, [elem, classNames].concat(extraArgs));
                }
            });
        }
    }

    S.mix(Dom,
        /**
         * @override KISSY.DOM
         * @class
         * @singleton
         */
        {
            _hasClass: function (elem, classNames) {
                var i, l, className, classList = elem.classList;
                if (classList.length) {
                    for (i = 0, l = classNames.length; i < l; i++) {
                        className = classNames[i];
                        if (className && !classList.contains(className)) {
                            return false;
                        }
                    }
                    return true;
                }
                return false;
            },

            _addClass: batchClassList('add'),

            _removeClass: batchClassList('remove'),

            _toggleClass: batchClassList('toggle'),

            /**
             * Determine whether any of the matched elements are assigned the given classes.
             * @param {HTMLElement|String|HTMLElement[]} selector matched elements
             * @method
             * @param {String} className One or more class names to search for.
             * multiple class names is separated by space
             * @return {Boolean}
             */
            hasClass: function (selector, className) {
                var elem = Dom.get(selector);
                return elem && elem.nodeType == NodeType.ELEMENT_NODE && Dom._hasClass(elem, strToArray(className));
            },

            /**
             * Replace a class with another class for matched elements.
             * If no oldClassName is present, the newClassName is simply added.
             * @param {HTMLElement|String|HTMLElement[]} selector matched elements
             * @method
             * @param {String} oldClassName One or more class names to be removed from the class attribute of each matched element.
             * multiple class names is separated by space
             * @param {String} newClassName One or more class names to be added to the class attribute of each matched element.
             * multiple class names is separated by space
             */
            replaceClass: function (selector, oldClassName, newClassName) {
                Dom.removeClass(selector, oldClassName);
                Dom.addClass(selector, newClassName);
            },

            /**
             * Adds the specified class(es) to each of the set of matched elements.
             * @method
             * @param {HTMLElement|String|HTMLElement[]} selector matched elements
             * @param {String} className One or more class names to be added to the class attribute of each matched element.
             * multiple class names is separated by space
             */
            addClass: batchEls('_addClass'),

            /**
             * Remove a single class, multiple classes, or all classes from each element in the set of matched elements.
             * @param {HTMLElement|String|HTMLElement[]} selector matched elements
             * @method
             * @param {String} className One or more class names to be removed from the class attribute of each matched element.
             * multiple class names is separated by space
             */
            removeClass: batchEls('_removeClass'),

            /**
             * Add or remove one or more classes from each element in the set of
             * matched elements, depending on either the class's presence or the
             * value of the switch argument.
             * @param {HTMLElement|String|HTMLElement[]} selector matched elements
             * @param {String} className One or more class names to be added to the class attribute of each matched element.
             * multiple class names is separated by space
             * @method
             */
            toggleClass: batchEls('_toggleClass')
            // @param [state] {Boolean} optional boolean to indicate whether class
            // should be added or removed regardless of current state.
            // latest firefox/ie10 does not support
        });

    return Dom;

}, {
    requires: ['./api']
});

/*
 http://jsperf.com/kissy-classlist-vs-classname 17157:14741
 http://jsperf.com/kissy-1-3-vs-jquery-on-dom-class 15721:15223

 NOTES:
 - hasClass/addClass/removeClass 的逻辑和 jQuery 保持一致
 - toggleClass 不支持 value 为 undefined 的情形（jQuery 支持）
 */
/**
 * @ignore
 * dom-create
 * @author lifesinger@gmail.com, yiminghe@gmail.com
 */
KISSY.add('dom/base/create', function (S, Dom, undefined) {
    var doc = S.Env.host.document,
        NodeType = Dom.NodeType,
        UA = S.UA,
        logger = S.getLogger('s/dom'),
        ie = document.documentMode || UA['ie'],
        DIV = 'div',
        PARENT_NODE = 'parentNode',
        DEFAULT_DIV = doc && doc.createElement(DIV),
        R_XHTML_TAG = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
        RE_TAG = /<([\w:]+)/,
        R_LEADING_WHITESPACE = /^\s+/,
        R_TAIL_WHITESPACE = /\s+$/,
        oldIE = !!(ie && ie < 9),
        lostLeadingTailWhitespace = oldIE,
        R_HTML = /<|&#?\w+;/,
        supportOuterHTML = doc && 'outerHTML' in doc.documentElement,
        RE_SIMPLE_TAG = /^<(\w+)\s*\/?>(?:<\/\1>)?$/;

    // help compression
    function getElementsByTagName(el, tag) {
        return el.getElementsByTagName(tag);
    }

    function cleanData(els) {
        var DOMEvent = S.require('event/dom');
        if (DOMEvent) {
            DOMEvent.detach(els);
        }
        Dom.removeData(els);
    }

    function getHolderDiv(ownerDoc) {
        var holder = ownerDoc && ownerDoc != doc ?
            ownerDoc.createElement(DIV) :
            DEFAULT_DIV;
        if (holder === DEFAULT_DIV) {
            holder.innerHTML = '';
        }
        return holder;
    }

    function defaultCreator(html, ownerDoc) {
        var frag = getHolderDiv(ownerDoc);
        // html 为 <style></style> 时不行，必须有其他元素？
        frag.innerHTML = 'm<div>' + html + '<' + '/div>';
        return frag.lastChild;
    }

    function _empty(node) {
        try {
            // fast path
            node.innerHTML = "";
            return;
        } catch (e) {
            // innerHTML is readOnly (e.g. TABLE (sub)elements in quirks mode)
            // Fall through (saves bytes)
        }
        // SVG/strict elements don't support innerHTML/canHaveChildren, and OBJECT/APPLET elements in quirks node have canHaveChildren=false
        for (var c; c = node.lastChild;) { // intentional assignment
            _destroy(c, node); // destroy is better than removeChild so TABLE subelements are removed in proper order
        }
    }

    function _destroy(node, parent) {
        if (parent) {
            // removeNode(false) doesn't leak in IE 6+, but removeChild() and removeNode(true) are known to leak under IE 8- while 9+ is TBD.
            // In IE quirks mode, PARAM nodes as children of OBJECT/APPLET nodes have a removeNode method that does nothing and
            // the parent node has canHaveChildren=false even though removeChild correctly removes the PARAM children.
            // In IE, SVG/strict nodes don't have a removeNode method nor a canHaveChildren boolean.
            if (oldIE && parent.canHaveChildren && "removeNode" in node) {
                // in IE quirks, node.canHaveChildren can be false but firstChild can be non-null (OBJECT/APPLET)
                if (node.firstChild) {
                    _empty(node);
                }
                node.removeNode(false)
            } else {
                parent.removeChild(node);
            }
        }
    }

    S.mix(Dom,
        /**
         * @override KISSY.DOM
         * @class
         * @singleton
         */
        {

            /**
             * Creates Dom elements on the fly from the provided string of raw HTML.
             * @param {String} html A string of HTML to create on the fly. Note that this parses HTML, not XML.
             * @param {Object} [props] An map of attributes on the newly-created element.
             * @param {HTMLDocument} [ownerDoc] A document in which the new elements will be created
             * @param {Boolean} [_trim]
             * @return {DocumentFragment|HTMLElement}
             */
            create: function (html, props, ownerDoc, _trim/*internal*/) {
                var ret = null;

                if (!html) {
                    return ret;
                }

                if (html.nodeType) {
                    return Dom.clone(html);
                }


                if (typeof html != 'string') {
                    return ret;
                }

                if (_trim === undefined) {
                    _trim = true;
                }

                if (_trim) {
                    html = S.trim(html);
                }

                var creators = Dom._creators,
                    holder,
                    whitespaceMatch,
                    context = ownerDoc || doc,
                    m,
                    tag = DIV,
                    k,
                    nodes;

                if (!R_HTML.test(html)) {
                    ret = context.createTextNode(html);
                }
                // 简单 tag, 比如 Dom.create('<p>')
                else if ((m = RE_SIMPLE_TAG.exec(html))) {
                    ret = context.createElement(m[1]);
                }
                // 复杂情况，比如 Dom.create('<img src='sprite.png' />')
                else {
                    // Fix 'XHTML'-style tags in all browsers
                    html = html.replace(R_XHTML_TAG, '<$1><' + '/$2>');

                    if ((m = RE_TAG.exec(html)) && (k = m[1])) {
                        tag = k.toLowerCase();
                    }

                    holder = (creators[tag] || defaultCreator)(html, context);
                    // ie 把前缀空白吃掉了
                    if (lostLeadingTailWhitespace &&
                        (whitespaceMatch = html.match(R_LEADING_WHITESPACE))) {
                        holder.insertBefore(context.createTextNode(whitespaceMatch[0]),
                            holder.firstChild);
                    }
                    if (lostLeadingTailWhitespace && /\S/.test(html) &&
                        (whitespaceMatch = html.match(R_TAIL_WHITESPACE))) {
                        holder.appendChild(context.createTextNode(whitespaceMatch[0]));
                    }

                    nodes = holder.childNodes;

                    if (nodes.length === 1) {
                        // return single node, breaking parentNode ref from 'fragment'
                        ret = nodes[0][PARENT_NODE].removeChild(nodes[0]);
                    } else if (nodes.length) {
                        // return multiple nodes as a fragment
                        ret = nodeListToFragment(nodes);
                    } else {
                        S.error(html + ' : create node error');
                    }
                }

                return attachProps(ret, props);
            },

            _fixCloneAttributes: function (src, dest) {
                // value of textarea can not be clone in chrome/firefox??
                if (Dom.nodeName(src) === 'textarea') {
                    dest.defaultValue = src.defaultValue;
                    dest.value = src.value;
                }
            },

            _creators: {
                div: defaultCreator
            },

            _defaultCreator: defaultCreator,

            /**
             * Get the HTML contents of the first element in the set of matched elements.
             * or
             * Set the HTML contents of each element in the set of matched elements.
             * @param {HTMLElement|String|HTMLElement[]} selector matched elements
             * @param {String} [htmlString]  A string of HTML to set as the content of each matched element.
             * @param {Boolean} [loadScripts=false] True to look for and process scripts
             */
            html: function (selector, htmlString, loadScripts) {
                // supports css selector/Node/NodeList
                var els = Dom.query(selector),
                    el = els[0],
                    success = false,
                    valNode,
                    i, elem;
                if (!el) {
                    return null;
                }
                // getter
                if (htmlString === undefined) {
                    // only gets value on the first of element nodes
                    if (el.nodeType == NodeType.ELEMENT_NODE) {
                        return el.innerHTML;
                    } else if (el.nodeType == NodeType.DOCUMENT_FRAGMENT_NODE) {
                        var holder = getHolderDiv(el.ownerDocument);
                        holder.appendChild(el);
                        return holder.innerHTML;
                    } else {
                        return null;
                    }
                }
                // setter
                else {
                    htmlString += '';

                    // faster
                    // fix #103,some html element can not be set through innerHTML
                    if (!htmlString.match(/<(?:script|style|link)/i) &&
                        (!lostLeadingTailWhitespace || !htmlString.match(R_LEADING_WHITESPACE)) && !creatorsMap[ (htmlString.match(RE_TAG) || ['', ''])[1].toLowerCase() ]) {

                        try {
                            for (i = els.length - 1; i >= 0; i--) {
                                elem = els[i];
                                if (elem.nodeType == NodeType.ELEMENT_NODE) {
                                    cleanData(getElementsByTagName(elem, '*'));
                                    elem.innerHTML = htmlString;
                                }
                            }
                            success = true;
                        } catch (e) {
                            // a <= '<a>'
                            // a.innerHTML='<p>1</p>';
                        }

                    }

                    if (!success) {
                        valNode = Dom.create(htmlString, 0, el.ownerDocument, 0);
                        Dom.empty(els);
                        Dom.append(valNode, els, loadScripts);
                    }
                }
                return undefined;
            },

            /**
             * Get the outerHTML of the first element in the set of matched elements.
             * or
             * Set the outerHTML of each element in the set of matched elements.
             * @param {HTMLElement|String|HTMLElement[]} selector matched elements
             * @param {String} [htmlString]  A string of HTML to set as outerHTML of each matched element.
             * @param {Boolean} [loadScripts=false] True to look for and process scripts
             */
            outerHtml: function (selector, htmlString, loadScripts) {
                var els = Dom.query(selector),
                    holder,
                    i,
                    valNode,
                    length = els.length,
                    el = els[0];
                if (!el) {
                    return null;
                }
                // getter
                if (htmlString === undefined) {
                    if (supportOuterHTML && el.nodeType != Dom.DOCUMENT_FRAGMENT_NODE) {
                        return el.outerHTML
                    } else {
                        holder = getHolderDiv(el.ownerDocument);
                        holder.appendChild(Dom.clone(el, true));
                        return holder.innerHTML;
                    }
                } else {
                    htmlString += '';
                    if (!htmlString.match(/<(?:script|style|link)/i) && supportOuterHTML) {
                        for (i = length - 1; i >= 0; i--) {
                            el = els[i];
                            if (el.nodeType == NodeType.ELEMENT_NODE) {
                                cleanData(el);
                                cleanData(getElementsByTagName(el, '*'));
                                el.outerHTML = htmlString;
                            }
                        }
                    } else {
                        valNode = Dom.create(htmlString, 0, el.ownerDocument, 0);
                        Dom.insertBefore(valNode, els, loadScripts);
                        Dom.remove(els);
                    }
                }
                return undefined;
            },

            /**
             * Remove the set of matched elements from the Dom.
             * @param {HTMLElement|String|HTMLElement[]} selector matched elements
             * @param {Boolean} [keepData=false] whether keep bound events and jQuery data associated with the elements from removed.
             */
            remove: function (selector, keepData) {
                var el,
                    els = Dom.query(selector),
                    all,
                    DOMEvent = S.require('event/dom'),
                    i;
                for (i = els.length - 1; i >= 0; i--) {
                    el = els[i];
                    if (!keepData && el.nodeType == NodeType.ELEMENT_NODE) {
                        all = S.makeArray(getElementsByTagName(el, '*'));
                        all.push(el);
                        Dom.removeData(all);
                        if (DOMEvent) {
                            DOMEvent.detach(all);
                        }
                    }
                    // https://github.com/kissyteam/kissy/issues/463
                    // removeNode(false) doesn't leak in IE 6+, but removeChild() and removeNode(true) are known to leak under IE 8- while 9+ is TBD.
                    // In IE quirks mode, PARAM nodes as children of OBJECT/APPLET nodes have a removeNode method that does nothing and
                    // the parent node has canHaveChildren=false even though removeChild correctly removes the PARAM children.
                    // In IE, SVG/strict nodes don't have a removeNode method nor a canHaveChildren boolean.
                    _destroy(el, el.parentNode);
                }
            },

            /**
             * Create a deep copy of the first of matched elements.
             * @param {HTMLElement|String|HTMLElement[]} selector matched elements
             * @param {Boolean|Object} [deep=false] whether perform deep copy or copy config.
             * @param {Boolean} [deep.deep] whether perform deep copy
             * @param {Boolean} [deep.withDataAndEvent=false] A Boolean indicating
             * whether event handlers and data should be copied along with the elements.
             * @param {Boolean} [deep.deepWithDataAndEvent=false]
             * A Boolean indicating whether event handlers and data for all children of the cloned element should be copied.
             * if set true then deep argument must be set true as well.
             * @param {Boolean} [withDataAndEvent=false] A Boolean indicating
             * whether event handlers and data should be copied along with the elements.
             * @param {Boolean} [deepWithDataAndEvent=false]
             * A Boolean indicating whether event handlers and data for all children of the cloned element should be copied.
             * if set true then deep argument must be set true as well.
             * refer: https://developer.mozilla.org/En/Dom/Node.cloneNode
             * @return {HTMLElement}
             * @member KISSY.DOM
             */
            clone: function (selector, deep, withDataAndEvent, deepWithDataAndEvent) {
                if (typeof deep === 'object') {
                    deepWithDataAndEvent = deep['deepWithDataAndEvent'];
                    withDataAndEvent = deep['withDataAndEvent'];
                    deep = deep['deep'];
                }

                var elem = Dom.get(selector),
                    clone,
                    _fixCloneAttributes = Dom._fixCloneAttributes,
                    elemNodeType;

                if (!elem) {
                    return null;
                }

                elemNodeType = elem.nodeType;

                // TODO
                // ie bug :
                // 1. ie<9 <script>xx</script> => <script></script>
                // 2. ie will execute external script
                clone = /**
                 @type HTMLElement
                 @ignore*/elem.cloneNode(deep);

                if (elemNodeType == NodeType.ELEMENT_NODE ||
                    elemNodeType == NodeType.DOCUMENT_FRAGMENT_NODE) {
                    // IE copies events bound via attachEvent when using cloneNode.
                    // Calling detachEvent on the clone will also remove the events
                    // from the original. In order to get around this, we use some
                    // proprietary methods to clear the events. Thanks to MooTools
                    // guys for this hotness.
                    if (_fixCloneAttributes && elemNodeType == NodeType.ELEMENT_NODE) {
                        _fixCloneAttributes(elem, clone);
                    }

                    if (deep && _fixCloneAttributes) {
                        processAll(_fixCloneAttributes, elem, clone);
                    }
                }
                // runtime 获得事件模块
                if (withDataAndEvent) {
                    cloneWithDataAndEvent(elem, clone);
                    if (deep && deepWithDataAndEvent) {
                        processAll(cloneWithDataAndEvent, elem, clone);
                    }
                }
                return clone;
            },

            /**
             * Remove(include data and event handlers) all child nodes of the set of matched elements from the Dom.
             * @param {HTMLElement|String|HTMLElement[]} selector matched elements
             */
            empty: function (selector) {
                var els = Dom.query(selector),
                    el, i;
                for (i = els.length - 1; i >= 0; i--) {
                    el = els[i];
                    Dom.remove(el.childNodes);
                }
            },

            _nodeListToFragment: nodeListToFragment
        });

    // compatibility
    Dom.outerHTML = Dom.outerHtml;

    function processAll(fn, elem, clone) {
        var elemNodeType = elem.nodeType;
        if (elemNodeType == NodeType.DOCUMENT_FRAGMENT_NODE) {
            var eCs = elem.childNodes,
                cloneCs = clone.childNodes,
                fIndex = 0;
            while (eCs[fIndex]) {
                if (cloneCs[fIndex]) {
                    processAll(fn, eCs[fIndex], cloneCs[fIndex]);
                }
                fIndex++;
            }
        } else if (elemNodeType == NodeType.ELEMENT_NODE) {
            var elemChildren = getElementsByTagName(elem, '*'),
                cloneChildren = getElementsByTagName(clone, '*'),
                cIndex = 0;
            while (elemChildren[cIndex]) {
                if (cloneChildren[cIndex]) {
                    fn(elemChildren[cIndex], cloneChildren[cIndex]);
                }
                cIndex++;
            }
        }
    }

    // 克隆除了事件的 data
    function cloneWithDataAndEvent(src, dest) {
        var DOMEvent = S.require('event/dom'),
            srcData,
            d;

        if (dest.nodeType == NodeType.ELEMENT_NODE && !Dom.hasData(src)) {
            return;
        }

        srcData = Dom.data(src);

        // 浅克隆，data 也放在克隆节点上
        for (d in srcData) {
            Dom.data(dest, d, srcData[d]);
        }

        // 事件要特殊点
        if (DOMEvent) {
            // attach src 's event data and dom attached listener to dest
            DOMEvent.clone(src, dest);
        }
    }

    // 添加成员到元素中
    function attachProps(elem, props) {
        if (S.isPlainObject(props)) {
            if (elem.nodeType == NodeType.ELEMENT_NODE) {
                Dom.attr(elem, props, true);
            }
            // document fragment
            else if (elem.nodeType == NodeType.DOCUMENT_FRAGMENT_NODE) {
                Dom.attr(elem.childNodes, props, true);
            }
        }
        return elem;
    }

    // 将 nodeList 转换为 fragment
    function nodeListToFragment(nodes) {
        var ret = null,
            i,
            ownerDoc,
            len;
        if (nodes && (nodes.push || nodes.item) && nodes[0]) {
            ownerDoc = nodes[0].ownerDocument;
            ret = ownerDoc.createDocumentFragment();
            nodes = S.makeArray(nodes);
            for (i = 0, len = nodes.length; i < len; i++) {
                ret.appendChild(nodes[i]);
            }
        } else {
            logger.error('Unable to convert ' + nodes + ' to fragment.');
        }
        return ret;
    }

    // 残缺元素处理
    var creators = Dom._creators,
        create = Dom.create,
        creatorsMap = {
            area: 'map',
            thead: 'table',
            td: 'tr',
            th: 'tr',
            tr: 'tbody',
            tbody: 'table',
            tfoot: 'table',
            caption: 'table',
            colgroup: 'table',
            col: 'colgroup',
            legend: 'fieldset'
        }, p;

    for (p in creatorsMap) {
        (function (tag) {
            creators[p] = function (html, ownerDoc) {
                return create('<' + tag + '>' +
                    html + '<' + '/' + tag + '>',
                    undefined, ownerDoc);
            };
        })(creatorsMap[p]);
    }

    // https://github.com/kissyteam/kissy/issues/422
    creatorsMap['option'] = creatorsMap['optgroup'] = function (html, ownerDoc) {
        return create('<select multiple="multiple">' + html + '</select>', undefined, ownerDoc);
    };

    return Dom;
}, {
    requires: ['./api']
});

/*
 2012-01-31
 remove spurious tbody

 2011-10-13
 empty , html refactor

 2011-08-22
 clone 实现，参考 jq

 2011-08
 remove 需要对子孙节点以及自身清除事件以及自定义 data
 create 修改，支持 <style></style> ie 下直接创建
 */
/**
 * @ignore
 * dom-data
 * @author lifesinger@gmail.com, yiminghe@gmail.com
 */
KISSY.add('dom/base/data', function (S, Dom, undefined) {

    var win = S.Env.host,
        EXPANDO = '_ks_data_' + S.now(), // 让每一份 kissy 的 expando 都不同
        dataCache = { }, // 存储 node 节点的 data
        winDataCache = { }, // 避免污染全局


    // The following elements throw uncatchable exceptions if you
    // attempt to add expando properties to them.
        noData = {
        };
    noData['applet'] = 1;
    noData['object'] = 1;
    noData['embed'] = 1;

    var commonOps = {
        hasData: function (cache, name) {
            if (cache) {
                if (name !== undefined) {
                    if (name in cache) {
                        return true;
                    }
                } else if (!S.isEmptyObject(cache)) {
                    return true;
                }
            }
            return false;
        }
    };

    var objectOps = {
        hasData: function (ob, name) {
            // 只判断当前窗口，iframe 窗口内数据直接放入全局变量
            if (ob == win) {
                return objectOps.hasData(winDataCache, name);
            }
            // 直接建立在对象内
            var thisCache = ob[EXPANDO];
            return commonOps.hasData(thisCache, name);
        },

        data: function (ob, name, value) {
            if (ob == win) {
                return objectOps.data(winDataCache, name, value);
            }
            var cache = ob[EXPANDO];
            if (value !== undefined) {
                cache = ob[EXPANDO] = ob[EXPANDO] || {};
                cache[name] = value;
            } else {
                if (name !== undefined) {
                    return cache && cache[name];
                } else {
                    cache = ob[EXPANDO] = ob[EXPANDO] || {};
                    return cache;
                }
            }
        },
        removeData: function (ob, name) {
            if (ob == win) {
                return objectOps.removeData(winDataCache, name);
            }
            var cache = ob[EXPANDO];
            if (name !== undefined) {
                delete cache[name];
                if (S.isEmptyObject(cache)) {
                    objectOps.removeData(ob);
                }
            } else {
                try {
                    // ob maybe window in iframe
                    // ie will throw error
                    delete ob[EXPANDO];
                } catch (e) {
                    ob[EXPANDO] = undefined;
                }
            }
        }
    };

    var domOps = {
        hasData: function (elem, name) {
            var key = elem[EXPANDO];
            if (!key) {
                return false;
            }
            var thisCache = dataCache[key];
            return commonOps.hasData(thisCache, name);
        },

        data: function (elem, name, value) {
            if (noData[elem.nodeName.toLowerCase()]) {
                return undefined;
            }
            var key = elem[EXPANDO], cache;
            if (!key) {
                // 根本不用附加属性
                if (name !== undefined &&
                    value === undefined) {
                    return undefined;
                }
                // 节点上关联键值也可以
                key = elem[EXPANDO] = S.guid();
            }
            cache = dataCache[key];
            if (value !== undefined) {
                // 需要新建
                cache = dataCache[key] = dataCache[key] || {};
                cache[name] = value;
            } else {
                if (name !== undefined) {
                    return cache && cache[name];
                } else {
                    // 需要新建
                    cache = dataCache[key] = dataCache[key] || {};
                    return cache;
                }
            }
        },

        removeData: function (elem, name) {
            var key = elem[EXPANDO], cache;
            if (!key) {
                return;
            }
            cache = dataCache[key];
            if (name !== undefined) {
                delete cache[name];
                if (S.isEmptyObject(cache)) {
                    domOps.removeData(elem);
                }
            } else {
                delete dataCache[key];
                try {
                    delete elem[EXPANDO];
                } catch (e) {
                    elem[EXPANDO] = undefined;
                }
                if (elem.removeAttribute) {
                    elem.removeAttribute(EXPANDO);
                }
            }
        }
    };


    S.mix(Dom,
        /**
         * @override KISSY.DOM
         * @class
         * @singleton
         */
        {

            __EXPANDO: EXPANDO,

            /**
             * Determine whether an element has any data or specified data name associated with it.
             * @param {HTMLElement[]|String|HTMLElement} selector Matched elements
             * @param {String} [name] A string naming the piece of data to set.
             * @return {Boolean}
             */
            hasData: function (selector, name) {
                var ret = false,
                    elems = Dom.query(selector);
                for (var i = 0; i < elems.length; i++) {
                    var elem = elems[i];
                    if (elem.nodeType) {
                        ret = domOps.hasData(elem, name);
                    } else {
                        // window
                        ret = objectOps.hasData(elem, name);
                    }
                    if (ret) {
                        return ret;
                    }
                }
                return ret;
            },

            /**
             * If name set and data unset Store arbitrary data associated with the specified element. Returns undefined.
             * or
             * If name set and data unset returns value at named data store for the element
             * or
             * If name unset and data unset returns the full data store for the element.
             * @param {HTMLElement[]|String|HTMLElement} selector Matched elements
             * @param {String} [name] A string naming the piece of data to set.
             * @param [data] The new data value.
             * @return {Object|undefined}
             */
            data: function (selector, name, data) {

                var elems = Dom.query(selector), elem = elems[0];

                // supports hash
                if (S.isPlainObject(name)) {
                    for (var k in name) {
                        Dom.data(elems, k, name[k]);
                    }
                    return undefined;
                }

                // getter
                if (data === undefined) {
                    if (elem) {
                        if (elem.nodeType) {
                            return domOps.data(elem, name);
                        } else {
                            // window
                            return objectOps.data(elem, name);
                        }
                    }
                }
                // setter
                else {
                    for (var i = elems.length - 1; i >= 0; i--) {
                        elem = elems[i];
                        if (elem.nodeType) {
                            domOps.data(elem, name, data);
                        } else {
                            // window
                            objectOps.data(elem, name, data);
                        }
                    }
                }
                return undefined;
            },

            /**
             * Remove a previously-stored piece of data from matched elements.
             * or
             * Remove all data from matched elements if name unset.
             * @param {HTMLElement[]|String|HTMLElement} selector Matched elements
             * @param {String} [name] A string naming the piece of data to delete.
             */
            removeData: function (selector, name) {
                var els = Dom.query(selector), elem, i;
                for (i = els.length - 1; i >= 0; i--) {
                    elem = els[i];
                    if (elem.nodeType) {
                        domOps.removeData(elem, name);
                    } else {
                        // window
                        objectOps.removeData(elem, name);
                    }
                }
            }
        });

    return Dom;

}, {
    requires: ['./api']
});
/*
 yiminghe@gmail.com：2011-05-31
 - 分层，节点和普通对象分开处理
 */
/**
 * @ignore
 * dom-insertion
 * @author yiminghe@gmail.com, lifesinger@gmail.com
 */
KISSY.add('dom/base/insertion', function (S, Dom) {

    var PARENT_NODE = 'parentNode',
        NodeType = Dom.NodeType,
        RE_FORM_EL = /^(?:button|input|object|select|textarea)$/i,
        getNodeName = Dom.nodeName,
        makeArray = S.makeArray,
        splice = [].splice,
        NEXT_SIBLING = 'nextSibling',
        R_SCRIPT_TYPE = /\/(java|ecma)script/i;

    function isJs(el) {
        return !el.type || R_SCRIPT_TYPE.test(el.type);
    }

    // extract script nodes and execute alone later
    function filterScripts(nodes, scripts) {
        var ret = [], i, el, nodeName;
        for (i = 0; nodes[i]; i++) {
            el = nodes[i];
            nodeName = getNodeName(el);
            if (el.nodeType == NodeType.DOCUMENT_FRAGMENT_NODE) {
                ret.push.apply(ret, filterScripts(makeArray(el.childNodes), scripts));
            } else if (nodeName === 'script' && isJs(el)) {
                // remove script to make sure ie9 does not invoke when append
                if (el.parentNode) {
                    el.parentNode.removeChild(el)
                }
                if (scripts) {
                    scripts.push(el);
                }
            } else {
                if (el.nodeType == NodeType.ELEMENT_NODE &&
                    // ie checkbox getElementsByTagName 后造成 checked 丢失
                    !RE_FORM_EL.test(nodeName)) {
                    var tmp = [],
                        s,
                        j,
                        ss = el.getElementsByTagName('script');
                    for (j = 0; j < ss.length; j++) {
                        s = ss[j];
                        if (isJs(s)) {
                            tmp.push(s);
                        }
                    }
                    splice.apply(nodes, [i + 1, 0].concat(tmp));
                }
                ret.push(el);
            }
        }
        return ret;
    }

    // execute script
    function evalScript(el) {
        if (el.src) {
            S.getScript(el.src);
        } else {
            var code = S.trim(el.text || el.textContent || el.innerHTML || '');
            if (code) {
                S.globalEval(code);
            }
        }
    }

    // fragment is easier than nodelist
    function insertion(newNodes, refNodes, fn, scripts) {
        newNodes = Dom.query(newNodes);

        if (scripts) {
            scripts = [];
        }

        // filter script nodes ,process script separately if needed
        newNodes = filterScripts(newNodes, scripts);

        // Resets defaultChecked for any radios and checkboxes
        // about to be appended to the Dom in IE 6/7
        if (Dom._fixInsertionChecked) {
            Dom._fixInsertionChecked(newNodes);
        }

        refNodes = Dom.query(refNodes);

        var newNodesLength = newNodes.length,
            newNode,
            i,
            refNode,
            node,
            clonedNode,
            refNodesLength = refNodes.length;

        if ((!newNodesLength && (!scripts || !scripts.length)) || !refNodesLength) {
            return;
        }

        // fragment 插入速度快点
        // 而且能够一个操作达到批量插入
        // refer: http://www.w3.org/TR/REC-Dom-Level-1/level-one-core.html#ID-B63ED1A3
        newNode = Dom._nodeListToFragment(newNodes);
        //fragment 一旦插入里面就空了，先复制下
        if (refNodesLength > 1) {
            clonedNode = Dom.clone(newNode, true);
            refNodes = S.makeArray(refNodes)
        }

        for (i = 0; i < refNodesLength; i++) {
            refNode = refNodes[i];
            if (newNode) {
                //refNodes 超过一个，clone
                node = i > 0 ? Dom.clone(clonedNode, true) : newNode;
                fn(node, refNode);
            }
            if (scripts && scripts.length) {
                S.each(scripts, evalScript);
            }
        }
    }

    // loadScripts default to false to prevent xss
    S.mix(Dom,
        /**
         * @override KISSY.DOM
         * @class
         * @singleton
         */
        {

            _fixInsertionChecked: null,

            /**
             * Insert every element in the set of newNodes before every element in the set of refNodes.
             * @param {HTMLElement|HTMLElement[]} newNodes Nodes to be inserted
             * @param {HTMLElement|HTMLElement[]|String} refNodes Nodes to be referred
             * @param {Boolean} [loadScripts] whether execute script node
             */
            insertBefore: function (newNodes, refNodes, loadScripts) {
                insertion(newNodes, refNodes, function (newNode, refNode) {
                    if (refNode[PARENT_NODE]) {
                        refNode[PARENT_NODE].insertBefore(newNode, refNode);
                    }
                }, loadScripts);
            },

            /**
             * Insert every element in the set of newNodes after every element in the set of refNodes.
             * @param {HTMLElement|HTMLElement[]} newNodes Nodes to be inserted
             * @param {HTMLElement|HTMLElement[]|String} refNodes Nodes to be referred
             * @param {Boolean} [loadScripts] whether execute script node
             */
            insertAfter: function (newNodes, refNodes, loadScripts) {
                insertion(newNodes, refNodes, function (newNode, refNode) {
                    if (refNode[PARENT_NODE]) {
                        refNode[PARENT_NODE].insertBefore(newNode, refNode[NEXT_SIBLING]);
                    }
                }, loadScripts);
            },

            /**
             * Insert every element in the set of newNodes to the end of every element in the set of parents.
             * @param {HTMLElement|HTMLElement[]} newNodes Nodes to be inserted
             * @param {HTMLElement|HTMLElement[]|String} parents Nodes to be referred as parentNode
             * @param {Boolean} [loadScripts] whether execute script node
             */
            appendTo: function (newNodes, parents, loadScripts) {
                insertion(newNodes, parents, function (newNode, parent) {
                    parent.appendChild(newNode);
                }, loadScripts);
            },

            /**
             * Insert every element in the set of newNodes to the beginning of every element in the set of parents.
             * @param {HTMLElement|HTMLElement[]} newNodes Nodes to be inserted
             * @param {HTMLElement|HTMLElement[]|String} parents Nodes to be referred as parentNode
             * @param {Boolean} [loadScripts] whether execute script node
             */
            prependTo: function (newNodes, parents, loadScripts) {
                insertion(newNodes, parents, function (newNode, parent) {
                    parent.insertBefore(newNode, parent.firstChild);
                }, loadScripts);
            },

            /**
             * Wrap a node around all elements in the set of matched elements
             * @param {HTMLElement|HTMLElement[]|String} wrappedNodes set of matched elements
             * @param {HTMLElement|String} wrapperNode html node or selector to get the node wrapper
             */
            wrapAll: function (wrappedNodes, wrapperNode) {
                // deep clone
                wrapperNode = Dom.clone(Dom.get(wrapperNode), true);
                wrappedNodes = Dom.query(wrappedNodes);
                if (wrappedNodes[0].parentNode) {
                    Dom.insertBefore(wrapperNode, wrappedNodes[0]);
                }
                var c;
                while ((c = wrapperNode.firstChild) && c.nodeType == 1) {
                    wrapperNode = c;
                }
                Dom.appendTo(wrappedNodes, wrapperNode);
            },

            /**
             * Wrap a node around each element in the set of matched elements
             * @param {HTMLElement|HTMLElement[]|String} wrappedNodes set of matched elements
             * @param {HTMLElement|String} wrapperNode html node or selector to get the node wrapper
             */
            wrap: function (wrappedNodes, wrapperNode) {
                wrappedNodes = Dom.query(wrappedNodes);
                wrapperNode = Dom.get(wrapperNode);
                S.each(wrappedNodes, function (w) {
                    Dom.wrapAll(w, wrapperNode);
                });
            },

            /**
             * Wrap a node around the childNodes of each element in the set of matched elements.
             * @param {HTMLElement|HTMLElement[]|String} wrappedNodes set of matched elements
             * @param {HTMLElement|String} wrapperNode html node or selector to get the node wrapper
             */
            wrapInner: function (wrappedNodes, wrapperNode) {
                wrappedNodes = Dom.query(wrappedNodes);
                wrapperNode = Dom.get(wrapperNode);
                S.each(wrappedNodes, function (w) {
                    var contents = w.childNodes;
                    if (contents.length) {
                        Dom.wrapAll(contents, wrapperNode);
                    } else {
                        w.appendChild(wrapperNode);
                    }
                });
            },

            /**
             * Remove the parents of the set of matched elements from the Dom,
             * leaving the matched elements in their place.
             * @param {HTMLElement|HTMLElement[]|String} wrappedNodes set of matched elements
             */
            unwrap: function (wrappedNodes) {
                wrappedNodes = Dom.query(wrappedNodes);
                S.each(wrappedNodes, function (w) {
                    var p = w.parentNode;
                    Dom.replaceWith(p, p.childNodes);
                });
            },

            /**
             * Replace each element in the set of matched elements with the provided newNodes.
             * @param {HTMLElement|HTMLElement[]|String} selector set of matched elements
             * @param {HTMLElement|HTMLElement[]|String} newNodes new nodes to replace the matched elements
             */
            replaceWith: function (selector, newNodes) {
                var nodes = Dom.query(selector);
                newNodes = Dom.query(newNodes);
                Dom.remove(newNodes, true);
                Dom.insertBefore(newNodes, nodes);
                Dom.remove(nodes);
            }
        });
    S.each({
        'prepend': 'prependTo',
        'append': 'appendTo',
        'before': 'insertBefore',
        'after': 'insertAfter'
    }, function (value, key) {
        Dom[key] = Dom[value];
    });
    return Dom;
}, {
    requires: ['./api']
});

/*
 2012-04-05 yiminghe@gmail.com
 - 增加 replaceWith/wrap/wrapAll/wrapInner/unwrap

 2011-05-25
 - yiminghe@gmail.com：参考 jquery 处理多对多的情形 :http://api.jquery.com/append/
 Dom.append('.multi1','.multi2');

 */
/**
 * @ignore
 * @author  lifesinger@gmail.com
 *          yiminghe@gmail.com
 */
KISSY.add('dom/base/offset', function (S, Dom, undefined) {

    var win = S.Env.host,
        UA = S.UA,
        doc = win.document,
        NodeType = Dom.NodeType,
        docElem = doc && doc.documentElement,
        getWindow = Dom.getWindow,
        CSS1Compat = 'CSS1Compat',
        compatMode = 'compatMode',
        MAX = Math.max,
        POSITION = 'position',
        RELATIVE = 'relative',
        DOCUMENT = 'document',
        BODY = 'body',
        DOC_ELEMENT = 'documentElement',
        VIEWPORT = 'viewport',
        SCROLL = 'scroll',
        CLIENT = 'client',
        LEFT = 'left',
        TOP = 'top',
        SCROLL_LEFT = SCROLL + 'Left',
        SCROLL_TOP = SCROLL + 'Top';

    S.mix(Dom,
        /**
         * @override KISSY.DOM
         * @class
         * @singleton
         */
        {

            /**
             * Get the current coordinates of the first element in the set of matched elements, relative to the document.
             * or
             * Set the current coordinates of every element in the set of matched elements, relative to the document.
             * @param {HTMLElement[]|String|HTMLElement} selector Matched elements
             * @param {Object} [coordinates ] An object containing the properties top and left,
             * which are integers indicating the new top and left coordinates for the elements.
             * @param {Number} [coordinates.left ] the new top and left coordinates for the elements.
             * @param {Number} [coordinates.top ] the new top and top coordinates for the elements.
             * @param {Window} [relativeWin] The window to measure relative to. If relativeWin
             *     is not in the ancestor frame chain of the element, we measure relative to
             *     the top-most window.
             * @return {Object|undefined} if Get, the format of returned value is same with coordinates.
             */
            offset: function (selector, coordinates, relativeWin) {
                // getter
                if (coordinates === undefined) {
                    var elem = Dom.get(selector),
                        ret;
                    if (elem) {
                        ret = getOffset(elem, relativeWin);
                    }
                    return ret;
                }
                // setter
                var els = Dom.query(selector), i;
                for (i = els.length - 1; i >= 0; i--) {
                    elem = els[i];
                    setOffset(elem, coordinates);
                }
                return undefined;
            },

            /**
             * scrolls the first of matched elements into container view
             * @param {HTMLElement[]|String|HTMLElement} selector Matched elements
             * @param {String|HTMLElement|HTMLDocument} [container=window] Container element
             * @param {Boolean|Object} [alignWithTop=true]If true, the scrolled element is aligned with the top of the scroll area.
             * If false, it is aligned with the bottom.
             * @param {Boolean} [alignWithTop.allowHorizontalScroll=true] Whether trigger horizontal scroll.
             * @param {Boolean} [alignWithTop.onlyScrollIfNeeded=false] scrollIntoView when element is out of view
             * and set top to false or true automatically if top is undefined
             * @param {Boolean} [allowHorizontalScroll=true] Whether trigger horizontal scroll.
             * refer: http://www.w3.org/TR/2009/WD-html5-20090423/editing.html#scrollIntoView
             *        http://www.sencha.com/deploy/dev/docs/source/Element.scroll-more.html#scrollIntoView
             *        http://yiminghe.javaeye.com/blog/390732
             */
            scrollIntoView: function (selector, container, alignWithTop, allowHorizontalScroll) {
                var elem,
                    onlyScrollIfNeeded;

                if (!(elem = Dom.get(selector))) {
                    return;
                }

                if (container) {
                    container = Dom.get(container);
                }

                if (!container) {
                    container = elem.ownerDocument;
                }

                // document 归一化到 window
                if (container.nodeType == NodeType.DOCUMENT_NODE) {
                    container = getWindow(container);
                }

                if (S.isPlainObject(alignWithTop)) {
                    allowHorizontalScroll = alignWithTop.allowHorizontalScroll;
                    onlyScrollIfNeeded = alignWithTop.onlyScrollIfNeeded;
                    alignWithTop = alignWithTop.alignWithTop;
                }

                allowHorizontalScroll = allowHorizontalScroll === undefined ? true : allowHorizontalScroll;

                var isWin = S.isWindow(container),
                    elemOffset = Dom.offset(elem),
                    eh = Dom.outerHeight(elem),
                    ew = Dom.outerWidth(elem),
                    containerOffset,
                    ch,
                    cw,
                    containerScroll,
                    diffTop,
                    diffBottom,
                    win,
                    winScroll,
                    ww,
                    wh;

                if (isWin) {
                    win = container;
                    wh = Dom.height(win);
                    ww = Dom.width(win);
                    winScroll = {
                        left: Dom.scrollLeft(win),
                        top: Dom.scrollTop(win)
                    };
                    // elem 相对 container 可视视窗的距离
                    diffTop = {
                        left: elemOffset[LEFT] - winScroll[LEFT],
                        top: elemOffset[TOP] - winScroll[TOP]
                    };
                    diffBottom = {
                        left: elemOffset[LEFT] + ew - (winScroll[LEFT] + ww),
                        top: elemOffset[TOP] + eh - (winScroll[TOP] + wh)
                    };
                    containerScroll = winScroll;
                }
                else {
                    containerOffset = Dom.offset(container);
                    ch = container.clientHeight;
                    cw = container.clientWidth;
                    containerScroll = {
                        left: Dom.scrollLeft(container),
                        top: Dom.scrollTop(container)
                    };
                    // elem 相对 container 可视视窗的距离
                    // 注意边框 , offset 是边框到根节点
                    diffTop = {
                        left: elemOffset[LEFT] - (containerOffset[LEFT] +
                            (parseFloat(Dom.css(container, 'borderLeftWidth')) || 0)),
                        top: elemOffset[TOP] - (containerOffset[TOP] +
                            (parseFloat(Dom.css(container, 'borderTopWidth')) || 0))
                    };
                    diffBottom = {
                        left: elemOffset[LEFT] + ew -
                            (containerOffset[LEFT] + cw +
                                (parseFloat(Dom.css(container, 'borderRightWidth')) || 0)),
                        top: elemOffset[TOP] + eh -
                            (containerOffset[TOP] + ch +
                                (parseFloat(Dom.css(container, 'borderBottomWidth')) || 0))
                    };
                }

                if (onlyScrollIfNeeded) {
                    if (diffTop.top < 0 || diffBottom.top > 0) {
                        // 强制向上
                        if (alignWithTop === true) {
                            Dom.scrollTop(container, containerScroll.top + diffTop.top);
                        } else if (alignWithTop === false) {
                            Dom.scrollTop(container, containerScroll.top + diffBottom.top);
                        } else {
                            // 自动调整
                            if (diffTop.top < 0) {
                                Dom.scrollTop(container, containerScroll.top + diffTop.top);
                            } else {
                                Dom.scrollTop(container, containerScroll.top + diffBottom.top);
                            }
                        }
                    }
                } else {
                    alignWithTop = alignWithTop === undefined ? true : !!alignWithTop;
                    if (alignWithTop) {
                        Dom.scrollTop(container, containerScroll.top + diffTop.top);
                    } else {
                        Dom.scrollTop(container, containerScroll.top + diffBottom.top);
                    }
                }

                if (allowHorizontalScroll) {
                    if (onlyScrollIfNeeded) {
                        if (diffTop.left < 0 || diffBottom.left > 0) {
                            // 强制向上
                            if (alignWithTop === true) {
                                Dom.scrollLeft(container, containerScroll.left + diffTop.left);
                            } else if (alignWithTop === false) {
                                Dom.scrollLeft(container, containerScroll.left + diffBottom.left);
                            } else {
                                // 自动调整
                                if (diffTop.left < 0) {
                                    Dom.scrollLeft(container, containerScroll.left + diffTop.left);
                                } else {
                                    Dom.scrollLeft(container, containerScroll.left + diffBottom.left);
                                }
                            }
                        }
                    } else {
                        alignWithTop = alignWithTop === undefined ? true : !!alignWithTop;
                        if (alignWithTop) {
                            Dom.scrollLeft(container, containerScroll.left + diffTop.left);
                        } else {
                            Dom.scrollLeft(container, containerScroll.left + diffBottom.left);
                        }
                    }
                }
            },

            /**
             * Get the width of document
             * @param {Window} [win=window] Window to be referred.
             * @method
             */
            docWidth: 0,
            /**
             * Get the height of document
             * @param {Window} [win=window] Window to be referred.
             * @method
             */
            docHeight: 0,
            /**
             * Get the height of window
             * @param {Window} [win=window] Window to be referred.
             * @method
             */
            viewportHeight: 0,
            /**
             * Get the width of document
             * @param {Window} [win=window] Window to be referred.
             * @method
             */
            viewportWidth: 0,
            /**
             * Get the current vertical position of the scroll bar for the first element in the set of matched elements.
             * or
             * Set the current vertical position of the scroll bar for each of the set of matched elements.
             * @param {HTMLElement[]|String|HTMLElement|Window} selector matched elements
             * @param {Number} value An integer indicating the new position to set the scroll bar to.
             * @method
             */
            scrollTop: 0,
            /**
             * Get the current horizontal position of the scroll bar for the first element in the set of matched elements.
             * or
             * Set the current horizontal position of the scroll bar for each of the set of matched elements.
             * @param {HTMLElement[]|String|HTMLElement|Window} selector matched elements
             * @param {Number} value An integer indicating the new position to set the scroll bar to.
             * @method
             */
            scrollLeft: 0
        });

// http://old.jr.pl/www.quirksmode.org/viewport/compatibility.html
// http://www.quirksmode.org/dom/w3c_cssom.html
// add ScrollLeft/ScrollTop getter/setter methods
    S.each(['Left', 'Top'], function (name, i) {
        var method = SCROLL + name;

        Dom[method] = function (elem, v) {
            if (typeof elem === 'number') {
                return arguments.callee(win, elem);
            }
            elem = Dom.get(elem);
            var ret,
                left,
                top,
                w,
                d;
            if (elem && elem.nodeType == NodeType.ELEMENT_NODE) {
                if (v !== undefined) {
                    elem[method] = parseFloat(v)
                } else {
                    ret = elem[method];
                }
            } else {
                w = getWindow(elem);
                if (v !== undefined) {
                    v = parseFloat(v);
                    // 注意多 window 情况，不能简单取 win
                    left = name == 'Left' ? v : Dom.scrollLeft(w);
                    top = name == 'Top' ? v : Dom.scrollTop(w);
                    w['scrollTo'](left, top);
                } else {
                    //标准
                    //chrome == body.scrollTop
                    //firefox/ie9 == documentElement.scrollTop
                    ret = w[ 'page' + (i ? 'Y' : 'X') + 'Offset'];
                    if (typeof ret !== 'number') {
                        d = w[DOCUMENT];
                        //ie6,7,8 standard mode
                        ret = d[DOC_ELEMENT][method];
                        if (typeof ret !== 'number') {
                            //quirks mode
                            ret = d[BODY][method];
                        }
                    }
                }
            }
            return ret;
        }
    });

// add docWidth/Height, viewportWidth/Height getter methods
    S.each(['Width', 'Height'], function (name) {
        Dom['doc' + name] = function (refWin) {
            refWin = Dom.get(refWin);
            var d = Dom.getDocument(refWin);
            return MAX(
                //firefox chrome documentElement.scrollHeight< body.scrollHeight
                //ie standard mode : documentElement.scrollHeight> body.scrollHeight
                d[DOC_ELEMENT][SCROLL + name],
                //quirks : documentElement.scrollHeight 最大等于可视窗口多一点？
                d[BODY][SCROLL + name],
                Dom[VIEWPORT + name](d));
        };

        Dom[VIEWPORT + name] = function (refWin) {
            refWin = Dom.get(refWin);
            var win = getWindow(refWin);
            var ret = win['inner' + name];
            // http://www.quirksmode.org/mobile/viewports.html
            if (UA.mobile && ret) {
                return ret;
            }
            // pc browser includes scrollbar in window.innerWidth
            var prop = CLIENT + name,
                doc = win[DOCUMENT],
                body = doc[BODY],
                documentElement = doc[DOC_ELEMENT],
                documentElementProp = documentElement[prop];
            // 标准模式取 documentElement
            // backcompat 取 body
            return doc[compatMode] === CSS1Compat
                && documentElementProp ||
                body && body[ prop ] || documentElementProp;
        };
    });

    function getClientPosition(elem) {
        var box, x , y ,
            doc = elem.ownerDocument,
            body = doc.body;

        if (!elem.getBoundingClientRect) {
            return {
                left: 0,
                top: 0
            };
        }

        // 根据 GBS 最新数据，A-Grade Browsers 都已支持 getBoundingClientRect 方法，不用再考虑传统的实现方式
        box = elem.getBoundingClientRect();

        // 注：jQuery 还考虑减去 docElem.clientLeft/clientTop
        // 但测试发现，这样反而会导致当 html 和 body 有边距/边框样式时，获取的值不正确
        // 此外，ie6 会忽略 html 的 margin 值，幸运地是没有谁会去设置 html 的 margin

        x = box[LEFT];
        y = box[TOP];

        // In IE, most of the time, 2 extra pixels are added to the top and left
        // due to the implicit 2-pixel inset border.  In IE6/7 quirks mode and
        // IE6 standards mode, this border can be overridden by setting the
        // document element's border to zero -- thus, we cannot rely on the
        // offset always being 2 pixels.

        // In quirks mode, the offset can be determined by querying the body's
        // clientLeft/clientTop, but in standards mode, it is found by querying
        // the document element's clientLeft/clientTop.  Since we already called
        // getClientBoundingRect we have already forced a reflow, so it is not
        // too expensive just to query them all.

        // ie 下应该减去窗口的边框吧，毕竟默认 absolute 都是相对窗口定位的
        // 窗口边框标准是设 documentElement ,quirks 时设置 body
        // 最好禁止在 body 和 html 上边框 ，但 ie < 9 html 默认有 2px ，减去
        // 但是非 ie 不可能设置窗口边框，body html 也不是窗口 ,ie 可以通过 html,body 设置
        // 标准 ie 下 docElem.clientTop 就是 border-top
        // ie7 html 即窗口边框改变不了。永远为 2
        // 但标准 firefox/chrome/ie9 下 docElem.clientTop 是窗口边框，即使设了 border-top 也为 0

        x -= docElem.clientLeft || body.clientLeft || 0;
        y -= docElem.clientTop || body.clientTop || 0;

        return { left: x, top: y };
    }


    function getPageOffset(el) {
        var pos = getClientPosition(el),
            w = getWindow(el);
        pos.left += Dom[SCROLL_LEFT](w);
        pos.top += Dom[SCROLL_TOP](w);
        return pos;
    }

// 获取 elem 相对 elem.ownerDocument 的坐标
    function getOffset(el, relativeWin) {
        var position = {left: 0, top: 0},

        // Iterate up the ancestor frame chain, keeping track of the current window
        // and the current element in that window.
            currentWin = getWindow(el),
            offset,
            currentEl = el;
        relativeWin = relativeWin || currentWin;

        do {
            // if we're at the top window, we want to get the page offset.
            // if we're at an inner frame, we only want to get the window position
            // so that we can determine the actual page offset in the context of
            // the outer window.
            offset = currentWin == relativeWin ?
                getPageOffset(currentEl) :
                getClientPosition(currentEl);
            position.left += offset.left;
            position.top += offset.top;
        } while (currentWin &&
            currentWin != relativeWin &&
            (currentEl = currentWin['frameElement']) &&
            (currentWin = currentWin.parent));

        return position;
    }

// 设置 elem 相对 elem.ownerDocument 的坐标
    function setOffset(elem, offset) {
        // set position first, in-case top/left are set even on static elem
        if (Dom.css(elem, POSITION) === 'static') {
            elem.style[POSITION] = RELATIVE;
        }

        var old = getOffset(elem),
            ret = { },
            current, key;

        for (key in offset) {
            current = parseFloat(Dom.css(elem, key)) || 0;
            ret[key] = current + offset[key] - old[key];
        }
        Dom.css(elem, ret);
    }

    return Dom;
}, {
    requires: ['./api']
});

/*
 2013-07 A tale if two viewports
 - A tale of two viewports: http://www.quirksmode.org/mobile/viewports.html

 2012-03-30
 - refer: http://www.softcomplex.com/docs/get_window_size_and_scrollbar_position.html
 - http://help.dottoro.com/ljkfqbqj.php
 - http://www.boutell.com/newfaq/creating/sizeofclientarea.html

 2011-05-24 yiminghe@gmail.com
 - 调整 docWidth , docHeight ,
 - viewportHeight , viewportWidth ,scrollLeft,scrollTop 参数，
 便于放置到 Node 中去，可以完全摆脱 Dom，完全使用 Node


 TODO:
 - 考虑是否实现 jQuery 的 position, offsetParent 等功能
 - 更详细的测试用例（比如：测试 position 为 fixed 的情况）
 */
/**
 * @ignore
 * dom/style
 * @author yiminghe@gmail.com, lifesinger@gmail.com
 */
KISSY.add('dom/base/style', function (S, Dom, undefined) {
    var WINDOW = /**
         @ignore
         @type window
         */S.Env.host,
        UA = S.UA,
        logger= S.getLogger('s/dom'),
        Features = S.Features,
        getNodeName = Dom.nodeName,
        doc = WINDOW.document,
        RE_MARGIN = /^margin/,
        WIDTH = 'width',
        HEIGHT = 'height',
        DISPLAY = 'display',
        OLD_DISPLAY = DISPLAY + S.now(),
        NONE = 'none',
        cssNumber = {
            'fillOpacity': 1,
            'fontWeight': 1,
            'lineHeight': 1,
            'opacity': 1,
            'orphans': 1,
            'widows': 1,
            'zIndex': 1,
            'zoom': 1
        },
        rmsPrefix = /^-ms-/,
        EMPTY = '',
        DEFAULT_UNIT = 'px',
        NO_PX_REG = /\d(?!px)[a-z%]+$/i,
        cssHooks = {},
        cssProps = {
            'float': 'cssFloat'
        },
        defaultDisplay = {},
        RE_DASH = /-([a-z])/ig;

    if (Features.isTransformSupported()) {
        var transform;
        transform = cssProps.transform = Features.getTransformProperty();
        cssProps.transformOrigin = transform + 'Origin';
    }

    if (Features.isTransitionSupported()) {
        cssProps.transition = Features.getTransitionProperty();
    }

    function upperCase() {
        return arguments[1].toUpperCase();
    }

    function camelCase(name) {
        // fix #92, ms!
        return name.replace(rmsPrefix, 'ms-').replace(RE_DASH, upperCase);
    }

    function getDefaultDisplay(tagName) {
        var body,
            oldDisplay = defaultDisplay[ tagName ],
            elem;
        if (!defaultDisplay[ tagName ]) {
            body = doc.body || doc.documentElement;
            elem = doc.createElement(tagName);
            // note: do not change default tag display!
            Dom.prepend(elem, body);
            oldDisplay = Dom.css(elem, 'display');
            body.removeChild(elem);
            // Store the correct default display
            defaultDisplay[ tagName ] = oldDisplay;
        }
        return oldDisplay;
    }

    S.mix(Dom,
        /**
         * @override KISSY.DOM
         * @class
         * @singleton
         */
        {
            _camelCase: camelCase,

            _cssHooks: cssHooks,

            _cssProps: cssProps,

            _getComputedStyle: function (elem, name) {
                var val = '',
                    computedStyle,
                    width,
                    minWidth,
                    maxWidth,
                    style,
                    d = elem.ownerDocument;

                name = cssProps[name] || name;

                // https://github.com/kissyteam/kissy/issues/61
                if (computedStyle = d.defaultView.getComputedStyle(elem, null)) {
                    val = computedStyle.getPropertyValue(name) || computedStyle[name];
                }

                // 还没有加入到 document，就取行内
                if (val === '' && !Dom.contains(d, elem)) {
                    val = elem.style[name];
                }

                // Safari 5.1 returns percentage for margin
                if (Dom._RE_NUM_NO_PX.test(val) && RE_MARGIN.test(name)) {
                    style = elem.style;
                    width = style.width;
                    minWidth = style.minWidth;
                    maxWidth = style.maxWidth;

                    style.minWidth = style.maxWidth = style.width = val;
                    val = computedStyle.width;

                    style.width = width;
                    style.minWidth = minWidth;
                    style.maxWidth = maxWidth;
                }

                return val;
            },

            /**
             *  Get inline style property from the first element of matched elements
             *  or
             *  Set one or more CSS properties for the set of matched elements.
             *  @param {HTMLElement[]|String|HTMLElement} selector Matched elements
             *  @param {String|Object} name A CSS property. or A map of property-value pairs to set.
             *  @param [val] A value to set for the property.
             *  @return {undefined|String}
             */
            style: function (selector, name, val) {
                var els = Dom.query(selector),
                    k,
                    ret,
                    elem = els[0], i;
                // supports hash
                if (S.isPlainObject(name)) {
                    for (k in name) {
                        for (i = els.length - 1; i >= 0; i--) {
                            style(els[i], k, name[k]);
                        }
                    }
                    return undefined;
                }
                if (val === undefined) {
                    ret = '';
                    if (elem) {
                        ret = style(elem, name, val);
                    }
                    return ret;
                } else {
                    for (i = els.length - 1; i >= 0; i--) {
                        style(els[i], name, val);
                    }
                }
                return undefined;
            },

            /**
             * Get the computed value of a style property for the first element in the set of matched elements.
             * or
             * Set one or more CSS properties for the set of matched elements.
             * @param {HTMLElement[]|String|HTMLElement} selector 选择器或节点或节点数组
             * @param {String|Object} name A CSS property. or A map of property-value pairs to set.
             * @param [val] A value to set for the property.
             * @return {undefined|String}
             */
            css: function (selector, name, val) {
                var els = Dom.query(selector),
                    elem = els[0],
                    k,
                    hook,
                    ret,
                    i;
                // supports hash
                if (S.isPlainObject(name)) {
                    for (k in name) {
                        for (i = els.length - 1; i >= 0; i--) {
                            style(els[i], k, name[k]);
                        }
                    }
                    return undefined;
                }

                name = camelCase(name);
                hook = cssHooks[name];
                // getter
                if (val === undefined) {
                    // supports css selector/Node/NodeList
                    ret = '';
                    if (elem) {
                        // If a hook was provided get the computed value from there
                        if (hook && 'get' in hook && (ret = hook.get(elem, true)) !== undefined) {
                        } else {
                            ret = Dom._getComputedStyle(elem, name);
                        }
                    }
                    return (typeof ret == 'undefined') ? '' : ret;
                }
                // setter
                else {
                    for (i = els.length - 1; i >= 0; i--) {
                        style(els[i], name, val);
                    }
                }
                return undefined;
            },

            /**
             * Display the matched elements.
             * @param {HTMLElement[]|String|HTMLElement} selector Matched elements.
             */
            show: function (selector) {
                var els = Dom.query(selector),
                    tagName,
                    old,
                    elem, i;
                for (i = els.length - 1; i >= 0; i--) {
                    elem = els[i];
                    elem.style[DISPLAY] = Dom.data(elem, OLD_DISPLAY) || EMPTY;
                    // 可能元素还处于隐藏状态，比如 css 里设置了 display: none
                    if (Dom.css(elem, DISPLAY) === NONE) {
                        tagName = elem.tagName.toLowerCase();
                        old = getDefaultDisplay(tagName);
                        Dom.data(elem, OLD_DISPLAY, old);
                        elem.style[DISPLAY] = old;
                    }
                }
            },

            /**
             * Hide the matched elements.
             * @param {HTMLElement[]|String|HTMLElement} selector Matched elements.
             */
            hide: function (selector) {
                var els = Dom.query(selector),
                    elem, i;
                for (i = els.length - 1; i >= 0; i--) {
                    elem = els[i];
                    var style = elem.style,
                        old = style[DISPLAY];
                    if (old !== NONE) {
                        if (old) {
                            Dom.data(elem, OLD_DISPLAY, old);
                        }
                        style[DISPLAY] = NONE;
                    }
                }
            },

            /**
             * Display or hide the matched elements.
             * @param {HTMLElement[]|String|HTMLElement} selector Matched elements.
             */
            toggle: function (selector) {
                var els = Dom.query(selector),
                    elem, i;
                for (i = els.length - 1; i >= 0; i--) {
                    elem = els[i];
                    if (Dom.css(elem, DISPLAY) === NONE) {
                        Dom.show(elem);
                    } else {
                        Dom.hide(elem);
                    }
                }
            },

            /**
             * Creates a stylesheet from a text blob of rules.
             * These rules will be wrapped in a style tag and appended to the HEAD of the document.
             * if cssText does not contain css hacks, u can just use Dom.create('<style>xx</style>')
             * @param {Window} [refWin=window] Window which will accept this stylesheet
             * @param {String} [cssText] The text containing the css rules
             * @param {String} [id] An id to add to the stylesheet for later removal
             */
            addStyleSheet: function (refWin, cssText, id) {
                if (typeof refWin == 'string') {
                    id = cssText;
                    cssText = /**@type String
                     @ignore*/refWin;
                    refWin = WINDOW;
                }

                var doc = Dom.getDocument(refWin),
                    elem;

                if (id && (id = id.replace('#', EMPTY))) {
                    elem = Dom.get('#' + id, doc);
                }

                // 仅添加一次，不重复添加
                if (elem) {
                    return;
                }

                elem = Dom.create('<style>', { id: id }, doc);

                // 先添加到 Dom 树中，再给 cssText 赋值，否则 css hack 会失效
                Dom.get('head', doc).appendChild(elem);

                if (elem.styleSheet) { // IE
                    elem.styleSheet.cssText = cssText;
                } else { // W3C
                    elem.appendChild(doc.createTextNode(cssText));
                }
            },

            /**
             * Make matched elements unselectable
             * @param {HTMLElement[]|String|HTMLElement} selector  Matched elements.
             */
            unselectable: function (selector) {
                var _els = Dom.query(selector),
                    elem,
                    j,
                    e,
                    i = 0,
                    excludes,
                    style,
                    els;
                for (j = _els.length - 1; j >= 0; j--) {
                    elem = _els[j];
                    style = elem.style;
                    style['UserSelect'] = 'none';
                    if (UA['gecko']) {
                        style['MozUserSelect'] = 'none';
                    } else if (UA['webkit']) {
                        style['WebkitUserSelect'] = 'none';
                    } else if (UA['ie'] || UA['opera']) {
                        els = elem.getElementsByTagName('*');
                        elem.setAttribute('unselectable', 'on');
                        excludes = ['iframe', 'textarea', 'input', 'select'];
                        while (e = els[i++]) {
                            if (!S.inArray(getNodeName(e), excludes)) {
                                e.setAttribute('unselectable', 'on');
                            }
                        }
                    }
                }
            },

            /**
             * Get the current computed width for the first element in the set of matched elements, including padding but not border.
             * @method
             * @param {HTMLElement[]|String|HTMLElement} selector Matched elements
             * @return {Number}
             */
            innerWidth: 0,
            /**
             * Get the current computed height for the first element in the set of matched elements, including padding but not border.
             * @method
             * @param {HTMLElement[]|String|HTMLElement} selector Matched elements
             * @return {Number}
             */
            innerHeight: 0,
            /**
             *  Get the current computed width for the first element in the set of matched elements, including padding and border, and optionally margin.
             * @method
             * @param {HTMLElement[]|String|HTMLElement} selector Matched elements
             * @param {Boolean} [includeMargin] A Boolean indicating whether to include the element's margin in the calculation.
             * @return {Number}
             */
            outerWidth: 0,
            /**
             * Get the current computed height for the first element in the set of matched elements, including padding, border, and optionally margin.
             * @method
             * @param {HTMLElement[]|String|HTMLElement} selector Matched elements
             * @param {Boolean} [includeMargin] A Boolean indicating whether to include the element's margin in the calculation.
             * @return {Number}
             */
            outerHeight: 0,
            /**
             * Get the current computed width for the first element in the set of matched elements.
             * or
             * Set the CSS width of each element in the set of matched elements.
             * @method
             * @param {HTMLElement[]|String|HTMLElement} selector Matched elements
             * @param {String|Number} [value]
             * An integer representing the number of pixels, or an integer along with an optional unit of measure appended (as a string).
             * @return {Number|undefined}
             */
            width: 0,
            /**
             * Get the current computed height for the first element in the set of matched elements.
             * or
             * Set the CSS height of each element in the set of matched elements.
             * @method
             * @param {HTMLElement[]|String|HTMLElement} selector Matched elements
             * @param {String|Number} [value]
             * An integer representing the number of pixels, or an integer along with an optional unit of measure appended (as a string).
             * @return {Number|undefined}
             */
            height: 0
        });

    S.each([WIDTH, HEIGHT], function (name) {
        Dom['inner' + S.ucfirst(name)] = function (selector) {
            var el = Dom.get(selector);
            return el && getWHIgnoreDisplay(el, name, 'padding');
        };

        Dom['outer' + S.ucfirst(name)] = function (selector, includeMargin) {
            var el = Dom.get(selector);
            return el && getWHIgnoreDisplay(el, name, includeMargin ? 'margin' : 'border');
        };

        Dom[name] = function (selector, val) {
            var ret = Dom.css(selector, name, val);
            if (ret) {
                ret = parseFloat(ret);
            }
            return ret;
        };

        /**
         * @ignore
         */
        cssHooks[ name ] = {
            /**
             * @ignore
             */
            get: function (elem, computed) {
                var val;
                if (computed) {
                    val = getWHIgnoreDisplay(elem, name) + 'px';
                }
                return val;
            }
        };
    });

    var cssShow = { position: 'absolute', visibility: 'hidden', display: 'block' };

    S.each(['left', 'top'], function (name) {
        cssHooks[ name ] = {
            get: function (el, computed) {
                var val,
                    isAutoPosition,
                    position;
                if (computed) {
                    position = Dom.css(el, 'position');
                    if (position === "static") {
                        return "auto";
                    }
                    val = Dom._getComputedStyle(el, name);
                    isAutoPosition = val === "auto";
                    if (isAutoPosition && position === "relative") {
                        return "0px";
                    }
                    if (isAutoPosition || NO_PX_REG.test(val)) {
                        val = getPosition(el)[name] + 'px';
                    }
                }
                return val;
            }
        };
    });

    function swap(elem, options, callback) {
        var old = {},
            style = elem.style,
            name;

        // Remember the old values, and insert the new ones
        for (name in options) {
            old[ name ] = style[ name ];
            style[ name ] = options[ name ];
        }

        callback.call(elem);

        // Revert the old values
        for (name in options) {
            style[ name ] = old[ name ];
        }
    }

    function style(elem, name, val) {
        var style,
            ret,
            hook;
        if (elem.nodeType === 3 ||
            elem.nodeType === 8 || !(style = elem.style)) {
            return undefined;
        }
        name = camelCase(name);
        hook = cssHooks[name];
        name = cssProps[name] || name;
        // setter
        if (val !== undefined) {
            // normalize unset
            if (val === null || val === EMPTY) {
                val = EMPTY;
            }
            // number values may need a unit
            else if (!isNaN(Number(val)) && !cssNumber[name]) {
                val += DEFAULT_UNIT;
            }
            if (hook && hook.set) {
                val = hook.set(elem, val);
            }
            if (val !== undefined) {
                // ie 无效值报错
                try {
                    // EMPTY will unset style!
                    style[name] = val;
                } catch (e) {
                    logger.warn('css set error:' + e);
                }
                // #80 fix,font-family
                if (val === EMPTY && style.removeAttribute) {
                    style.removeAttribute(name);
                }
            }
            if (!style.cssText) {
                // weird for chrome, safari is ok?
                // https://github.com/kissyteam/kissy/issues/231
                UA.webkit && (style = elem.outerHTML);
                elem.removeAttribute('style');
            }
            return undefined;
        }
        //getter
        else {
            // If a hook was provided get the non-computed value from there
            if (hook && 'get' in hook && (ret = hook.get(elem, false)) !== undefined) {

            } else {
                // Otherwise just get the value from the style object
                ret = style[ name ];
            }
            return ret === undefined ? '' : ret;
        }
    }

    // fix #119 : https://github.com/kissyteam/kissy/issues/119
    function getWHIgnoreDisplay(elem) {
        var val, args = arguments;
        // in case elem is window
        // elem.offsetWidth === undefined
        if (elem.offsetWidth !== 0) {
            val = getWH.apply(undefined, args);
        } else {
            swap(elem, cssShow, function () {
                val = getWH.apply(undefined, args);
            });
        }
        return val;
    }


    /*
     得到元素的大小信息
     @param elem
     @param name
     @param {String} [extra]  'padding' : (css width) + padding
     'border' : (css width) + padding + border
     'margin' : (css width) + padding + border + margin
     */
    function getWH(elem, name, extra) {
        if (S.isWindow(elem)) {
            return name == WIDTH ? Dom.viewportWidth(elem) : Dom.viewportHeight(elem);
        } else if (elem.nodeType == 9) {
            return name == WIDTH ? Dom.docWidth(elem) : Dom.docHeight(elem);
        }
        var which = name === WIDTH ? ['Left', 'Right'] : ['Top', 'Bottom'],
            val = name === WIDTH ? elem.offsetWidth : elem.offsetHeight;

        if (val > 0) {
            if (extra !== 'border') {
                S.each(which, function (w) {
                    if (!extra) {
                        val -= parseFloat(Dom.css(elem, 'padding' + w)) || 0;
                    }
                    if (extra === 'margin') {
                        val += parseFloat(Dom.css(elem, extra + w)) || 0;
                    } else {
                        val -= parseFloat(Dom.css(elem, 'border' + w + 'Width')) || 0;
                    }
                });
            }

            return val;
        }

        // Fall back to computed then un computed css if necessary
        val = Dom._getComputedStyle(elem, name);
        if (val == null || (Number(val)) < 0) {
            val = elem.style[ name ] || 0;
        }
        // Normalize '', auto, and prepare for extra
        val = parseFloat(val) || 0;

        // Add padding, border, margin
        if (extra) {
            S.each(which, function (w) {
                val += parseFloat(Dom.css(elem, 'padding' + w)) || 0;
                if (extra !== 'padding') {
                    val += parseFloat(Dom.css(elem, 'border' + w + 'Width')) || 0;
                }
                if (extra === 'margin') {
                    val += parseFloat(Dom.css(elem, extra + w)) || 0;
                }
            });
        }

        return val;
    }

    var ROOT_REG = /^(?:body|html)$/i;

    function getPosition(el) {
        var offsetParent ,
            offset ,
            parentOffset = {top: 0, left: 0};

        if (Dom.css(el, 'position') == 'fixed') {
            offset = el.getBoundingClientRect();
        } else {
            // if offsetParent is body and body has margin
            // then all browsers are different
            // make sure set html,body {margin:0;padding:0;border:0;}
            offsetParent = getOffsetParent(el);
            offset = Dom.offset(el);
            parentOffset = Dom.offset(offsetParent);
            parentOffset.top += parseFloat(Dom.css(offsetParent, "borderTopWidth")) || 0;
            parentOffset.left += parseFloat(Dom.css(offsetParent, "borderLeftWidth")) || 0;
        }

        offset.top -= parseFloat(Dom.css(el, "marginTop")) || 0;
        offset.left -= parseFloat(Dom.css(el, "marginLeft")) || 0;

        // known bug: if el is relative && offsetParent is document.body, left %
        // should - document.body.paddingLeft
        return {
            top: offset.top - parentOffset.top,
            left: offset.left - parentOffset.left
        };
    }

    function getOffsetParent(el) {
        var offsetParent = el.offsetParent || ( el.ownerDocument || doc).body;
        while (offsetParent && !ROOT_REG.test(offsetParent.nodeName) &&
            Dom.css(offsetParent, "position") === "static") {
            offsetParent = offsetParent.offsetParent;
        }
        return offsetParent;
    }

    return Dom;
}, {
    requires: ['./api']
});

/*
 2011-12-21
 - backgroundPositionX, backgroundPositionY firefox/w3c 不支持
 - w3c 为准，这里不 fix 了


 2011-08-19
 - 调整结构，减少耦合
 - fix css('height') == auto

 NOTES:
 - Opera 下，color 默认返回 #XXYYZZ, 非 rgb(). 目前 jQuery 等类库均忽略此差异，KISSY 也忽略。
 - Safari 低版本，transparent 会返回为 rgba(0, 0, 0, 0), 考虑低版本才有此 bug, 亦忽略。


 - getComputedStyle 在 webkit 下，会舍弃小数部分，ie 下会四舍五入，gecko 下直接输出 float 值。

 - color: blue 继承值，getComputedStyle, 在 ie 下返回 blue, opera 返回 #0000ff, 其它浏览器
 返回 rgb(0, 0, 255)

 - 总之：要使得返回值完全一致是不大可能的，jQuery/ExtJS/KISSY 未“追求完美”。YUI3 做了部分完美处理，但
 依旧存在浏览器差异。
 */
/**
 * @ignore
 * simple selector for dom
 * @author yiminghe@gmail.com, lifesinger@gmail.com
 */
KISSY.add('dom/base/selector', function (S, Dom, undefined) {
    var doc = S.Env.host.document,
        docElem = doc.documentElement,
        matches = docElem.matches ||
            docElem['webkitMatchesSelector'] ||
            docElem['mozMatchesSelector'] ||
            docElem['oMatchesSelector'] ||
            docElem['msMatchesSelector'],
        supportGetElementsByClassName = 'getElementsByClassName' in doc,
        isArray = S.isArray,
        makeArray = S.makeArray,
        isDomNodeList = Dom.isDomNodeList,
        SPACE = ' ',
        push = Array.prototype.push,
        rClassSelector = /^\.([\w-]+)$/,
        rIdSelector = /^#([\w-]+)$/,
        rTagSelector = /^([\w-])+$/,
        rTagIdSelector = /^([\w-]+)#([\w-]+)$/,
        rSimpleSelector = /^(?:#([\w-]+))?\s*([\w-]+|\*)?\.?([\w-]+)?$/,
        trim = S.trim;

    function query_each(f) {
        var els = this,
            l = els.length,
            i;
        for (i = 0; i < l; i++) {
            if (f(els[i], i) === false) {
                break;
            }
        }
    }

    function checkSelectorAndReturn(selector) {
        var name = selector.substr(1);
        if (!name) {
            throw new Error('An invalid or illegal string was specified for selector.')
        }
        return name;
    }

    function makeMatch(selector) {
        var s = selector.charAt(0);
        if (s == '#') {
            return makeIdMatch(checkSelectorAndReturn(selector));
        } else if (s == '.') {
            return makeClassMatch(checkSelectorAndReturn(selector));
        } else {
            return makeTagMatch(selector);
        }
    }

    function makeIdMatch(id) {
        return function (elem) {
            var match = Dom._getElementById(id, doc);
            return match && Dom._contains(elem, match) ? [ match ] : [ ];
        };
    }

    function makeClassMatch(className) {
        return function (elem) {
            return elem.getElementsByClassName(className);
        };
    }

    function makeTagMatch(tagName) {
        return function (elem) {
            return elem.getElementsByTagName(tagName);
        };
    }

    // 只涉及#id,.cls,tag的逐级选择
    function isSimpleSelector(selector) {
        var complexReg = /,|\+|=|~|\[|\]|:|>|\||\$|\^|\*|\(|\)|[\w-]+\.[\w-]+|[\w-]+#[\w-]+/;
        return !selector.match(complexReg);
    }

    function query(selector, context) {
        var ret,
            i,
            el,
            simpleContext,
            isSelectorString = typeof selector == 'string',
            contexts = context !== undefined ? query(context) : (simpleContext = 1) && [doc],
            contextsLen = contexts.length;

        // 常见的空
        if (!selector) {
            ret = [];
        } else if (isSelectorString) {
            selector = trim(selector);

            if (simpleContext) {
                // shortcut
                if (selector == 'body') {
                    ret = [ doc.body ];
                }
                // .cls
                else if (rClassSelector.test(selector) && supportGetElementsByClassName) {
                    ret = doc.getElementsByClassName(RegExp.$1);
                }
                // tag#id
                else if (rTagIdSelector.test(selector)) {
                    el = Dom._getElementById(RegExp.$2, doc);
                    ret = el && el.nodeName.toLowerCase() == RegExp.$1 ? [el] : [];
                }
                // #id
                else if (rIdSelector.test(selector)) {
                    el = Dom._getElementById(selector.substr(1), doc);
                    ret = el ? [el] : [];
                }
                // tag
                else if (rTagSelector.test(selector)) {
                    ret = doc.getElementsByTagName(selector);
                }
                // #id tag, #id .cls...
                else if (isSimpleSelector(selector) && supportGetElementsByClassName) {
                    var parts = selector.split(/\s+/),
                        partsLen,
                        parents = contexts,
                        parentIndex,
                        parentsLen;

                    for (i = 0, partsLen = parts.length; i < partsLen; i++) {
                        parts[i] = makeMatch(parts[i]);
                    }

                    for (i = 0, partsLen = parts.length; i < partsLen; i++) {
                        var part = parts[i],
                            newParents = [ ],
                            matches;

                        for (parentIndex = 0, parentsLen = parents.length;
                             parentIndex < parentsLen;
                             parentIndex++) {
                            matches = part(parents[parentIndex]);
                            newParents.push.apply(newParents, S.makeArray(matches));
                        }

                        parents = newParents;
                        if (!parents.length) {
                            break;
                        }
                    }
                    ret = parents && parents.length > 1 ? Dom.unique(parents) : parents;
                }
            }

            if (!ret) {
                ret = [];
                for (i = 0; i < contextsLen; i++) {
                    push.apply(ret, Dom._selectInternal(selector, contexts[i]));
                }
                // multiple contexts unique
                if (ret.length > 1 && contextsLen > 1) {
                    Dom.unique(ret);
                }
            }
        }
        // 不写 context，就是包装一下
        else {
            // 1.常见的单个元素
            // Dom.query(document.getElementById('xx'))
            if (selector['nodeType'] || selector['setTimeout']) {
                ret = [selector];
            }
            // 2.KISSY NodeList 特殊点直接返回，提高性能
            else if (selector['getDOMNodes']) {
                ret = selector['getDOMNodes']();
            }
            // 3.常见的数组
            // var x=Dom.query('.l');
            // Dom.css(x,'color','red');
            else if (isArray(selector)) {
                ret = selector;
            }
            // 4.selector.item
            // Dom.query(document.getElementsByTagName('a'))
            // note:
            // document.createElement('select').item 已经在 1 处理了
            // S.all().item 已经在 2 处理了
            else if (isDomNodeList(selector)) {
                ret = makeArray(selector);
            } else {
                ret = [ selector ];
            }

            if (!simpleContext) {
                var tmp = ret,
                    ci,
                    len = tmp.length;
                ret = [];
                for (i = 0; i < len; i++) {
                    for (ci = 0; ci < contextsLen; ci++) {
                        if (Dom._contains(contexts[ci], tmp[i])) {
                            ret.push(tmp[i]);
                            break;
                        }
                    }
                }
            }
        }

        // attach each method
        ret.each = query_each;

        return ret;
    }

    function hasSingleClass(el, cls) {
        // consider xml
        var className = el && (el.className || getAttr(el, 'class'));
        return className &&
            (className = className.replace(/[\r\t\n]/g, SPACE)) &&
            (SPACE + className + SPACE).indexOf(SPACE + cls + SPACE) > -1;
    }

    function getAttr(el, name) {
        var ret = el && el.getAttributeNode(name);
        if (ret && ret.specified) {
            return ret.nodeValue;
        }
        return undefined;
    }

    function isTag(el, value) {
        return value == '*' || el.nodeName.toLowerCase() === value.toLowerCase();
    }

    S.mix(Dom,
        /**
         * @override KISSY.DOM
         * @class
         * @singleton
         */
        {
            _compareNodeOrder: function (a, b) {
                if (!a.compareDocumentPosition || !b.compareDocumentPosition) {
                    return a.compareDocumentPosition ? -1 : 1;
                }
                var bit = a.compareDocumentPosition(b) & 4;
                return bit ? -1 : 1;
            },

            _getElementsByTagName: function (name, context) {
                // can not use getElementsByTagName for fragment
                return S.makeArray(context.querySelectorAll(name));
            },

            _getElementById: function (id, doc) {
                return doc.getElementById(id);
            },

            _getSimpleAttr: getAttr,

            _isTag: isTag,

            _hasSingleClass: hasSingleClass,

            _matchesInternal: function (str, seeds) {
                var ret = [],
                    i = 0,
                    n,
                    len = seeds.length;
                for (; i < len; i++) {
                    n = seeds[i];
                    if (matches.call(n, str)) {
                        ret.push(n);
                    }
                }
                return ret;
            },

            _selectInternal: function (str, context) {
                return makeArray(context.querySelectorAll(str));
            },

            /**
             * Accepts a string containing a CSS selector which is then used to match a set of elements.
             * @param {String|HTMLElement[]} selector
             * A string containing a selector expression.
             * or
             * array of HTMLElements.
             * @param {String|HTMLElement[]|HTMLDocument|HTMLElement} [context] context under which to find elements matching selector.
             * @return {HTMLElement[]} The array of found HTMLElements
             * @method
             */
            query: query,

            /**
             * Accepts a string containing a CSS selector which is then used to match a set of elements.
             * @param {String|HTMLElement[]} selector
             * A string containing a selector expression.
             * or
             * array of HTMLElements.
             * @param {String|HTMLElement[]|HTMLDocument|HTMLElement|Window} [context] context under which to find elements matching selector.
             * @return {HTMLElement} The first of found HTMLElements
             */
            get: function (selector, context) {
                return query(selector, context)[0] || null;
            },

            /**
             * Sorts an array of Dom elements, in place, with the duplicates removed.
             * Note that this only works on arrays of Dom elements, not strings or numbers.
             * @param {HTMLElement[]} The Array of Dom elements.
             * @method
             * @return {HTMLElement[]}
             * @member KISSY.DOM
             */
            unique: (function () {
                var hasDuplicate,
                    baseHasDuplicate = true;

                // Here we check if the JavaScript engine is using some sort of
                // optimization where it does not always call our comparison
                // function. If that is the case, discard the hasDuplicate value.
                // Thus far that includes Google Chrome.
                [0, 0].sort(function () {
                    baseHasDuplicate = false;
                    return 0;
                });

                function sortOrder(a, b) {
                    if (a == b) {
                        hasDuplicate = true;
                        return 0;
                    }

                    return Dom._compareNodeOrder(a, b);
                }

                // 排序去重
                return function (elements) {

                    hasDuplicate = baseHasDuplicate;
                    elements.sort(sortOrder);

                    if (hasDuplicate) {
                        var i = 1, len = elements.length;
                        while (i < len) {
                            if (elements[i] === elements[ i - 1 ]) {
                                elements.splice(i, 1);
                                --len;
                            } else {
                                i++;
                            }
                        }
                    }

                    return elements;
                };
            })(),

            /**
             * Reduce the set of matched elements to those that match the selector or pass the function's test.
             * @param {String|HTMLElement[]} selector Matched elements
             * @param {String|Function} filter Selector string or filter function
             * @param {String|HTMLElement[]|HTMLDocument} [context] Context under which to find matched elements
             * @return {HTMLElement[]}
             * @member KISSY.DOM
             */
            filter: function (selector, filter, context) {
                var elems = query(selector, context),
                    id,
                    tag,
                    match,
                    cls,
                    ret = [];

                if (typeof filter == 'string' &&
                    (filter = trim(filter)) &&
                    (match = rSimpleSelector.exec(filter))) {
                    id = match[1];
                    tag = match[2];
                    cls = match[3];
                    if (!id) {
                        filter = function (elem) {
                            var tagRe = true,
                                clsRe = true;

                            // 指定 tag 才进行判断
                            if (tag) {
                                tagRe = isTag(elem, tag);
                            }

                            // 指定 cls 才进行判断
                            if (cls) {
                                clsRe = hasSingleClass(elem, cls);
                            }

                            return clsRe && tagRe;
                        }
                    } else if (id && !tag && !cls) {
                        filter = function (elem) {
                            return getAttr(elem, 'id') == id;
                        };
                    }
                }

                if (typeof filter === 'function') {
                    ret = S.filter(elems, filter);
                } else {
                    ret = Dom._matchesInternal(filter, elems);
                }

                return ret;
            },

            /**
             * Returns true if the matched element(s) pass the filter test
             * @param {String|HTMLElement[]} selector Matched elements
             * @param {String|Function} filter Selector string or filter function
             * @param {String|HTMLElement[]|HTMLDocument} [context] Context under which to find matched elements
             * @member KISSY.DOM
             * @return {Boolean}
             */
            test: function (selector, filter, context) {
                var elements = query(selector, context);
                return elements.length && (Dom.filter(elements, filter, context).length === elements.length);
            }
        });

    return Dom;
}, {
    requires: ['./api']
});
/**
 * @ignore
 * bachi selector optimize - 2013-07-17
 * - http://jsperf.com/queryselctor-vs-getelementbyclassname2
 * yiminghe@gmail.com - 2013-03-26
 * - refactor to use own css3 selector engine
 */

/**
 * @ignore
 * dom-traversal
 * @author lifesinger@gmail.com, yiminghe@gmail.com
 */
KISSY.add('dom/base/traversal', function (S, Dom, undefined) {

    var NodeType = Dom.NodeType,
        CONTAIN_MASK = 16;

    S.mix(Dom,
        /**
         * @override KISSY.DOM
         * @class
         * @singleton
         */
        {

            _contains: function (a, b) {
                return !!(a.compareDocumentPosition(b) & CONTAIN_MASK);
            },

            /**
             * Get the first element that matches the filter,
             * beginning at the first element of matched elements and progressing up through the Dom tree.
             * @param {HTMLElement[]|String|HTMLElement} selector Matched elements
             * @param {String|Function|String[]|Function[]} filter Selector string or filter function or array
             * @param {HTMLElement|String|HTMLDocument|HTMLElement[]} [context] Search bound element
             * @return {HTMLElement|HTMLElement[]}
             *  if filter is array, return all ancestors (include this) which match filter.
             *  else return closest parent (include this) which matches filter.
             */
            closest: function (selector, filter, context, allowTextNode) {
                return nth(selector, filter, 'parentNode', function (elem) {
                    return elem.nodeType != NodeType.DOCUMENT_FRAGMENT_NODE;
                }, context, true, allowTextNode);
            },

            /**
             * Get the parent of the first element in the current set of matched elements, optionally filtered by a selector.
             * @param {HTMLElement[]|String|HTMLElement} selector Matched elements
             * @param {String|Function|String[]|Function[]} [filter] Selector string or filter function or array
             * @param {HTMLElement|String|HTMLDocument|HTMLElement[]} [context] Search bound element
             * @return {HTMLElement|HTMLElement[]}
             *  if filter is array, return all ancestors which match filter.
             *  else return closest parent which matches filter.
             */
            parent: function (selector, filter, context) {
                return nth(selector, filter, 'parentNode', function (elem) {
                    return elem.nodeType != NodeType.DOCUMENT_FRAGMENT_NODE;
                }, context, undefined);
            },

            /**
             * Get the first child of the first element in the set of matched elements.
             * If a filter is provided, it retrieves the next child only if it matches that filter.
             * @param {HTMLElement[]|String|HTMLElement} selector Matched elements
             * @param {String|Function} [filter] Selector string or filter function
             * @return {HTMLElement}
             */
            first: function (selector, filter, allowTextNode) {
                var elem = Dom.get(selector);
                return nth(elem && elem.firstChild, filter, 'nextSibling',
                    undefined, undefined, true, allowTextNode);
            },

            /**
             * Get the last child of the first element in the set of matched elements.
             * If a filter is provided, it retrieves the previous child only if it matches that filter.
             * @param {HTMLElement[]|String|HTMLElement} selector Matched elements
             * @param {String|Function} [filter] Selector string or filter function
             * @return {HTMLElement}
             */
            last: function (selector, filter, allowTextNode) {
                var elem = Dom.get(selector);
                return nth(elem && elem.lastChild, filter, 'previousSibling',
                    undefined, undefined, true, allowTextNode);
            },

            /**
             * Get the immediately following sibling of the first element in the set of matched elements.
             * If a filter is provided, it retrieves the next child only if it matches that filter.
             * @param {HTMLElement[]|String|HTMLElement} selector Matched elements
             * @param {String|Function} [filter] Selector string or filter function
             * @return {HTMLElement}
             */
            next: function (selector, filter, allowTextNode) {
                return nth(selector, filter, 'nextSibling', undefined,
                    undefined, undefined, allowTextNode);
            },

            /**
             * Get the immediately preceding  sibling of the first element in the set of matched elements.
             * If a filter is provided, it retrieves the previous child only if it matches that filter.
             * @param {HTMLElement[]|String|HTMLElement} selector Matched elements
             * @param {String|Function} [filter] Selector string or filter function
             * @return {HTMLElement}
             */
            prev: function (selector, filter, allowTextNode) {
                return nth(selector, filter, 'previousSibling',
                    undefined, undefined, undefined, allowTextNode);
            },

            /**
             * Get the siblings of the first element in the set of matched elements, optionally filtered by a filter.
             * @param {HTMLElement[]|String|HTMLElement} selector Matched elements
             * @param {String|Function} [filter] Selector string or filter function
             * @return {HTMLElement[]}
             */
            siblings: function (selector, filter, allowTextNode) {
                return getSiblings(selector, filter, true, allowTextNode);
            },

            /**
             * Get the children of the first element in the set of matched elements, optionally filtered by a filter.
             * @param {HTMLElement[]|String|HTMLElement} selector Matched elements
             * @param {String|Function} [filter] Selector string or filter function
             * @return {HTMLElement[]}
             */
            children: function (selector, filter) {
                return getSiblings(selector, filter, undefined);
            },

            /**
             * Get the childNodes of the first element in the set of matched elements (includes text and comment nodes),
             * optionally filtered by a filter.
             * @param {HTMLElement[]|String|HTMLElement} selector Matched elements
             * @param {String|Function} [filter] Selector string or filter function
             * @return {HTMLElement[]}
             */
            contents: function (selector, filter) {
                return getSiblings(selector, filter, undefined, 1);
            },

            /**
             * Check to see if a Dom node is within another Dom node.
             * @param {HTMLElement|String} container The Dom element that may contain the other element.
             * @param {HTMLElement|String} contained The Dom element that may be contained by the other element.
             * @return {Boolean}
             */
            contains: function (container, contained) {
                container = Dom.get(container);
                contained = Dom.get(contained);
                if (container && contained) {
                    return Dom._contains(container, contained);
                }
                return false;
            },
            /**
             * search for a given element from among the matched elements.
             * @param {HTMLElement|String} selector elements or selector string to find matched elements.
             * @param {HTMLElement|String} s2 elements or selector string to find matched elements.
             */
            index: function (selector, s2) {
                var els = Dom.query(selector),
                    c,
                    n = 0,
                    p,
                    els2,
                    el = els[0];

                if (!s2) {
                    p = el && el.parentNode;
                    if (!p) {
                        return -1;
                    }
                    c = el;
                    while (c = c.previousSibling) {
                        if (c.nodeType == NodeType.ELEMENT_NODE) {
                            n++;
                        }
                    }
                    return n;
                }

                els2 = Dom.query(s2);

                if (typeof s2 === 'string') {
                    return S.indexOf(el, els2);
                }

                return S.indexOf(els2[0], els);
            },

            /**
             * Check to see if a Dom node is equal with another Dom node.
             * @param {HTMLElement|String} n1
             * @param {HTMLElement|String} n2
             * @return {Boolean}
             * @member KISSY.DOM
             */
            equals: function (n1, n2) {
                n1 = Dom.query(n1);
                n2 = Dom.query(n2);
                if (n1.length != n2.length) {
                    return false;
                }
                for (var i = n1.length; i >= 0; i--) {
                    if (n1[i] != n2[i]) {
                        return false;
                    }
                }
                return true;
            }
        });

    // 获取元素 elem 在 direction 方向上满足 filter 的第一个元素
    // filter 可为 number, selector, fn array ，为数组时返回多个
    // direction 可为 parentNode, nextSibling, previousSibling
    // context : 到某个阶段不再查找直接返回
    function nth(elem, filter, direction, extraFilter, context, includeSef, allowTextNode) {
        if (!(elem = Dom.get(elem))) {
            return null;
        }
        if (filter === 0) {
            return elem;
        }
        if (!includeSef) {
            elem = elem[direction];
        }
        if (!elem) {
            return null;
        }
        context = (context && Dom.get(context)) || null;

        if (filter === undefined) {
            // 默认取 1
            filter = 1;
        }
        var ret = [],
            isArray = S.isArray(filter),
            fi,
            filterLength;

        if (typeof filter==='number') {
            fi = 0;
            filterLength = filter;
            filter = function () {
                return ++fi === filterLength;
            };
        }

        // 概念统一，都是 context 上下文，只过滤子孙节点，自己不管
        while (elem && elem != context) {
            if ((
                elem.nodeType == NodeType.ELEMENT_NODE ||
                    elem.nodeType == NodeType.TEXT_NODE && allowTextNode
                ) &&
                testFilter(elem, filter) &&
                (!extraFilter || extraFilter(elem))) {
                ret.push(elem);
                if (!isArray) {
                    break;
                }
            }
            elem = elem[direction];
        }

        return isArray ? ret : ret[0] || null;
    }

    function testFilter(elem, filter) {
        if (!filter) {
            return true;
        }
        if (S.isArray(filter)) {
            var i, l = filter.length;
            if (!l) {
                return true;
            }
            for (i = 0; i < l; i++) {
                if (Dom.test(elem, filter[i])) {
                    return true;
                }
            }
        } else if (Dom.test(elem, filter)) {
            return true;
        }
        return false;
    }

    // 获取元素 elem 的 siblings, 不包括自身
    function getSiblings(selector, filter, parent, allowText) {
        var ret = [],
            tmp,
            i,
            el,
            elem = Dom.get(selector),
            parentNode = elem;

        if (elem && parent) {
            parentNode = elem.parentNode;
        }

        if (parentNode) {
            tmp = S.makeArray(parentNode.childNodes);
            for (i = 0; i < tmp.length; i++) {
                el = tmp[i];
                if (!allowText && el.nodeType != NodeType.ELEMENT_NODE) {
                    continue;
                }
                if (el == elem) {
                    continue;
                }
                ret.push(el);
            }
            if (filter) {
                ret = Dom.filter(ret, filter);
            }
        }

        return ret;
    }

    return Dom;
}, {
    requires: ['./api']
});

/*
 2012-04-05 yiminghe@gmail.com
 - 增加 contents 方法

 2011-08 yiminghe@gmail.com
 - 添加 closest , first ,last 完全摆脱原生属性

 NOTES:
 - jquery does not return null ,it only returns empty array , but kissy does.

 - api 的设计上，没有跟随 jQuery. 一是为了和其他 api 一致，保持 first-all 原则。二是
 遵循 8/2 原则，用尽可能少的代码满足用户最常用的功能。
 */
/**
 * @ignore
 * dom
 * @author yiminghe@gmail.com
 */
KISSY.add('dom/base', function (S, Dom) {
    S.mix(S, {
        // compatibility
        DOM:Dom,
        get: Dom.get,
        query: Dom.query
    });

    return Dom;
}, {
    requires: [
        './base/api',
        './base/attr',
        './base/class',
        './base/create',
        './base/data',
        './base/insertion',
        './base/offset',
        './base/style',
        './base/selector',
        './base/traversal'
    ]
});

