/*
Copyright 2013, KISSY v1.40dev
MIT Licensed
build time: Sep 17 22:59
*/
/*
 Combined processedModules by KISSY Module Compiler: 

 dom/ie/attr
 dom/ie/create
 dom/ie/insertion
 dom/ie/style
 dom/ie/traversal
 dom/ie/transform
 dom/ie/input-selection
 dom/ie
*/

/**
 * @ignore
 * attr ie hack
 * @author yiminghe@gmail.com
 */
KISSY.add('dom/ie/attr', function (S, Dom) {
    var attrHooks = Dom._attrHooks,
        attrNodeHook = Dom._attrNodeHook,
        NodeType = Dom.NodeType,
        valHooks = Dom._valHooks,
        propFix = Dom._propFix,
        HREF = 'href',
        hrefFix,
        IE_VERSION = S.UA.ie;


    if (IE_VERSION < 8) {

        attrHooks['style'].set = function (el, val) {
            el.style.cssText = val;
        };

        // get attribute value from attribute node for ie
        S.mix(attrNodeHook, {
            get: function (elem, name) {
                var ret = elem.getAttributeNode(name);
                // Return undefined if attribute node specified by user
                return ret && (
                    // fix #100
                    ret.specified
                        || ret.nodeValue) ?
                    ret.nodeValue :
                    undefined;
            },
            set: function (elem, value, name) {
                // Check form objects in IE (multiple bugs related)
                // Only use nodeValue if the attribute node exists on the form
                var ret = elem.getAttributeNode(name), attr;
                if (ret) {
                    ret.nodeValue = value;
                } else {
                    try {
                        attr = elem.ownerDocument.createAttribute(name);
                        attr.value = value;
                        elem.setAttributeNode(attr);
                    }
                    catch (e) {
                        // It's a real failure only if setAttribute also fails.
                        // http://msdn.microsoft.com/en-us/library/ms536739(v=vs.85).aspx
                        // 0 : Match sAttrName regardless of case.
                        return elem.setAttribute(name, value, 0);
                    }
                }
            }
        });

        // ie6,7 不区分 attribute 与 property
        S.mix(Dom._attrFix, propFix);

        // http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
        attrHooks.tabIndex = attrHooks.tabindex;

        // 不光是 href, src, 还有 rowspan 等非 mapping 属性，也需要用第 2 个参数来获取原始值
        // 注意 colSpan rowSpan 已经由 propFix 转为大写
        S.each([ HREF, 'src', 'width', 'height', 'colSpan', 'rowSpan' ], function (name) {
            attrHooks[ name ] = {
                get: function (elem) {
                    var ret = elem.getAttribute(name, 2);
                    return ret === null ? undefined : ret;
                }
            };
        });

        // button 元素的 value 属性和其内容冲突
        // <button value='xx'>zzz</button>
        valHooks.button = attrHooks.value = attrNodeHook;

        attrHooks.placeholder = {
            get: function (elem, name) {
                return elem[name] || attrNodeHook.get(elem, name);
            }
        };

        // 当没有设定 value 时，标准浏览器 option.value === option.text
        // ie7- 下，没有设定 value 时，option.value === '',
        // 需要用 el.attributes.value 来判断是否有设定 value
        valHooks['option'] = {
            get: function (elem) {
                var val = elem.attributes.value;
                return !val || val.specified ? elem.value : elem.text;
            }
        };

    }

    // https://github.com/kissyteam/kissy/issues/198
    // http://social.msdn.microsoft.com/Forums/en-US/iewebdevelopment/thread/aa6bf9a5-0c0b-4a02-a115-c5b85783ca8c
    // http://gabriel.nagmay.com/2008/11/javascript-href-bug-in-ie/
    // https://groups.google.com/group/jquery-dev/browse_thread/thread/22029e221fe635c6?pli=1
    hrefFix = attrHooks[HREF] = attrHooks[HREF] || {};
    hrefFix.set = function (el, val, name) {
        var childNodes = el.childNodes,
            b,
            len = childNodes.length,
            allText = len > 0;
        for (len = len - 1; len >= 0; len--) {
            if (childNodes[len].nodeType != NodeType.TEXT_NODE) {
                allText = 0;
            }
        }
        if (allText) {
            b = el.ownerDocument.createElement('b');
            b.style.display = 'none';
            el.appendChild(b);
        }
        el.setAttribute(name, '' + val);
        if (b) {
            el.removeChild(b);
        }
    };


    function getText(el) {
        var ret = "",
            nodeType = el.nodeType;

        if (nodeType === Dom.NodeType.ELEMENT_NODE) {
            for (el = el.firstChild; el; el = el.nextSibling) {
                ret += getText(el);
            }
        } else if (nodeType == NodeType.TEXT_NODE || nodeType == NodeType.CDATA_SECTION_NODE) {
            ret += el.nodeValue;
        }
        return ret;
    }

    Dom._getText = getText;

    return Dom;
}, {
    requires: ['dom/base']
});
/**
 * @ignore
 * 2012-11-27 yiminghe@gmail.com note:
 *  no need for feature detection for old-ie!
 */
/**
 * @ignore
 * ie create hack
 * @author yiminghe@gmail.com
 */
KISSY.add('dom/ie/create', function (S, Dom) {

    // wierd ie cloneNode fix from jq
    Dom._fixCloneAttributes = function (src, dest) {

        // clearAttributes removes the attributes, which we don't want,
        // but also removes the attachEvent events, which we *do* want
        if (dest.clearAttributes) {
            dest.clearAttributes();
        }

        // mergeAttributes, in contrast, only merges back on the
        // original attributes, not the events
        if (dest.mergeAttributes) {
            dest.mergeAttributes(src);
        }

        var nodeName = dest.nodeName.toLowerCase(),
            srcChildren = src.childNodes;

        // IE6-8 fail to clone children inside object elements that use
        // the proprietary classid attribute value (rather than the type
        // attribute) to identify the type of content to display
        if (nodeName === 'object' && !dest.childNodes.length) {
            for (var i = 0; i < srcChildren.length; i++) {
                dest.appendChild(srcChildren[i].cloneNode(true));
            }
            // dest.outerHTML = src.outerHTML;
        } else if (nodeName === 'input' && (src.type === 'checkbox' || src.type === 'radio')) {
            // IE6-8 fails to persist the checked state of a cloned checkbox
            // or radio button. Worse, IE6-7 fail to give the cloned element
            // a checked appearance if the defaultChecked value isn't also set
            if (src.checked) {
                dest['defaultChecked'] = dest.checked = src.checked;
            }

            // IE6-7 get confused and end up setting the value of a cloned
            // checkbox/radio button to an empty string instead of 'on'
            if (dest.value !== src.value) {
                dest.value = src.value;
            }

            // IE6-8 fails to return the selected option to the default selected
            // state when cloning options
        } else if (nodeName === 'option') {
            dest.selected = src.defaultSelected;
            // IE6-8 fails to set the defaultValue to the correct value when
            // cloning other types of input fields
        } else if (nodeName === 'input' || nodeName === 'textarea') {
            dest.defaultValue = src.defaultValue;
            // textarea will not keep value if not deep clone
            dest.value = src.value;
        }

        // Event data gets referenced instead of copied if the expando
        // gets copied too
        // 自定义 data 根据参数特殊处理，expando 只是个用于引用的属性
        dest.removeAttribute(Dom.__EXPANDO);
    };

    var creators = Dom._creators,
        defaultCreator = Dom._defaultCreator,
        R_TBODY = /<tbody/i;

    // IE7- adds TBODY when creating thead/tfoot/caption/col/colgroup elements
    if (S.UA.ie < 8) {
        // fix #88
        // https://github.com/kissyteam/kissy/issues/88 : spurious tbody in ie<8
        creators.table = function (html, ownerDoc) {
            var frag = defaultCreator(html, ownerDoc),
                hasTBody = R_TBODY.test(html);
            if (hasTBody) {
                return frag;
            }
            var table = frag.firstChild,
                tableChildren = S.makeArray(table.childNodes);
            S.each(tableChildren, function (c) {
                if (Dom.nodeName(c) == 'tbody' && !c.childNodes.length) {
                    table.removeChild(c);
                }
            });
            return frag;
        };
    }
}, {
    requires: ['dom/base']
});
/**
 * @ignore
 * ie create hack
 * @author yiminghe@gmail.com
 */
KISSY.add('dom/ie/insertion', function (S, Dom) {

    var UA = S.UA;

    if (UA.ie < 8) {

        /*
         ie 6,7 lose checked status when append to dom
         var c=S.all('<input />');
         c.attr('type','radio');
         c.attr('checked',true);
         S.all('#t').append(c);
         alert(c[0].checked);
         */
        Dom._fixInsertionChecked = function fixChecked(ret) {
            for (var i = 0; i < ret.length; i++) {
                var el = ret[i];
                if (el.nodeType == Dom.NodeType.DOCUMENT_FRAGMENT_NODE) {
                    fixChecked(el.childNodes);
                } else if (Dom.nodeName(el) == 'input') {
                    fixCheckedInternal(el);
                } else if (el.nodeType == Dom.NodeType.ELEMENT_NODE) {
                    var cs = el.getElementsByTagName('input');
                    for (var j = 0; j < cs.length; j++) {
                        fixChecked(cs[j]);
                    }
                }
            }
        };

        function fixCheckedInternal(el) {
            if (el.type === 'checkbox' || el.type === 'radio') {
                // after insert, in ie6/7 checked is decided by defaultChecked !
                el.defaultChecked = el.checked;
            }
        }

    }


}, {
    requires: ['dom/base']
});
/**
 * @ignore
 * style hack for ie
 * @author yiminghe@gmail.com
 */
KISSY.add('dom/ie/style', function (S, Dom) {
    var cssProps = Dom._cssProps,
        UA = S.UA,
        logger = S.getLogger('s/dom'),
        HUNDRED = 100,
        doc = S.Env.host.document,
        docElem = doc && doc.documentElement,
        OPACITY = 'opacity',
        STYLE = 'style',
        RE_POS = /^(top|right|bottom|left)$/,
        FILTER = 'filter',
        CURRENT_STYLE = 'currentStyle',
        RUNTIME_STYLE = 'runtimeStyle',
        LEFT = 'left',
        PX = 'px',
        cssHooks = Dom._cssHooks,
        backgroundPosition = 'backgroundPosition',
        R_OPACITY = /opacity\s*=\s*([^)]*)/,
        R_ALPHA = /alpha\([^)]*\)/i;

    cssProps['float'] = 'styleFloat';

    // odd backgroundPosition
    cssHooks[backgroundPosition] = {
        get: function (elem, computed) {
            if (computed) {
                return elem[CURRENT_STYLE][backgroundPosition + 'X'] +
                    ' ' +
                    elem[CURRENT_STYLE][backgroundPosition + 'Y'];
            } else {
                return elem[STYLE][backgroundPosition];
            }
        }
    };

    // use alpha filter for IE opacity
    try {
        if (docElem.style[OPACITY] == null) {
            cssHooks[OPACITY] = {
                get: function (elem, computed) {
                    // 没有设置过 opacity 时会报错，这时返回 1 即可
                    // 如果该节点没有添加到 dom ，取不到 filters 结构
                    // val = elem[FILTERS]['DXImageTransform.Microsoft.Alpha'][OPACITY];
                    return R_OPACITY.test((
                        computed && elem[CURRENT_STYLE] ?
                            elem[CURRENT_STYLE][FILTER] :
                            elem[STYLE][FILTER]) || '') ?
                        ( parseFloat(RegExp.$1) / HUNDRED ) + '' :
                        computed ? '1' : '';
                },

                set: function (elem, val) {
                    val = parseFloat(val);

                    var style = elem[STYLE],
                        currentStyle = elem[CURRENT_STYLE],
                        opacity = isNaN(val) ? '' : 'alpha(' + OPACITY + '=' + val * HUNDRED + ')',
                        filter = S.trim(currentStyle && currentStyle[FILTER] || style[FILTER] || '');

                    // ie  has layout
                    style.zoom = 1;

                    // if setting opacity to 1, and no other filters exist - attempt to remove filter attribute
                    // https://github.com/kissyteam/kissy/issues/231
                    if ((val >= 1 || !opacity) && !S.trim(filter.replace(R_ALPHA, ''))) {

                        // Setting style.filter to null, '' & ' ' still leave 'filter:' in the cssText
                        // if 'filter:' is present at all, clearType is disabled, we want to avoid this
                        // style.removeAttribute is IE Only, but so apparently is this code path...
                        style.removeAttribute(FILTER);

                        if (// unset inline opacity
                            !opacity ||
                                // if there is no filter style applied in a css rule, we are done
                                currentStyle && !currentStyle[FILTER]) {
                            return;
                        }
                    }

                    // otherwise, set new filter values
                    // 如果 >=1 就不设，就不能覆盖外部样式表定义的样式，一定要设
                    style.filter = R_ALPHA.test(filter) ?
                        filter.replace(R_ALPHA, opacity) :
                        filter + (filter ? ', ' : '') + opacity;
                }
            };
        }
    } catch (ex) {
        logger.debug('IE filters ActiveX is disabled. ex = ' + ex);
    }

    /*
     border fix
     ie 不设置数值，则 computed style 不返回数值，只返回 thick? medium ...
     (default is 'medium')
     */
    var IE8 = UA['ie'] == 8,
        BORDER_MAP = {
        },
        BORDERS = ['', 'Top', 'Left', 'Right', 'Bottom'];
    BORDER_MAP['thin'] = IE8 ? '1px' : '2px';
    BORDER_MAP['medium'] = IE8 ? '3px' : '4px';
    BORDER_MAP['thick'] = IE8 ? '5px' : '6px';

    S.each(BORDERS, function (b) {
        var name = 'border' + b + 'Width',
            styleName = 'border' + b + 'Style';

        cssHooks[name] = {
            get: function (elem, computed) {
                // 只有需要计算样式的时候才转换，否则取原值
                var currentStyle = computed ? elem[CURRENT_STYLE] : 0,
                    current = currentStyle && String(currentStyle[name]) || undefined;
                // look up keywords if a border exists
                if (current && current.indexOf('px') < 0) {
                    // 边框没有隐藏
                    if (BORDER_MAP[current] && currentStyle[styleName] !== 'none') {
                        current = BORDER_MAP[current];
                    } else {
                        // otherwise no border
                        current = 0;
                    }
                }
                return current;
            }
        };
    });

    Dom._getComputedStyle = function (elem, name) {
        name = cssProps[name] || name;
        // currentStyle maybe null
        // http://msdn.microsoft.com/en-us/library/ms535231.aspx
        var ret = elem[CURRENT_STYLE] && elem[CURRENT_STYLE][name];

        // 当 width/height 设置为百分比时，通过 pixelLeft 方式转换的 width/height 值
        // 一开始就处理了! CUSTOM_STYLE['height'],CUSTOM_STYLE['width'] ,cssHook 解决@2011-08-19
        // 在 ie 下不对，需要直接用 offset 方式
        // borderWidth 等值也有问题，但考虑到 borderWidth 设为百分比的概率很小，这里就不考虑了

        // From the awesome hack by Dean Edwards
        // http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291
        // If we're not dealing with a regular pixel number
        // but a number that has a weird ending, we need to convert it to pixels
        // exclude left right for relativity
        if (Dom._RE_NUM_NO_PX.test(ret) && !RE_POS.test(name)) {
            // Remember the original values
            var style = elem[STYLE],
                left = style[LEFT],
                rsLeft = elem[RUNTIME_STYLE][LEFT];

            // prevent flashing of content
            elem[RUNTIME_STYLE][LEFT] = elem[CURRENT_STYLE][LEFT];

            // Put in the new values to get a computed value out
            style[LEFT] = name === 'fontSize' ? '1em' : (ret || 0);
            ret = style['pixelLeft'] + PX;

            // Revert the changed values
            style[LEFT] = left;

            elem[RUNTIME_STYLE][LEFT] = rsLeft;
        }
        return ret === '' ? 'auto' : ret;
    };
}, {
    requires: ['dom/base']
});

/*
 NOTES:

 yiminghe@gmail.com: 2012-11-27
 - 单独抽取出 ie 动态加载

 yiminghe@gmail.com: 2011.12.21 backgroundPosition in ie
 - currentStyle['backgroundPosition'] undefined
 - currentStyle['backgroundPositionX'] ok
 - currentStyle['backgroundPositionY'] ok


 yiminghe@gmail.com： 2011.05.19 opacity in ie
 - 如果节点是动态创建，设置opacity，没有加到 dom 前，取不到 opacity 值
 - 兼容：border-width 值，ie 下有可能返回 medium/thin/thick 等值，其它浏览器返回 px 值
 - opacity 的实现，参考自 jquery
 */
/**
 * @ignore
 * traversal ie hack
 * @author yiminghe@gmail.com
 */
KISSY.add('dom/ie/traversal', function (S, Dom) {
    Dom._contains = function (a, b) {
        if (a.nodeType == Dom.NodeType.DOCUMENT_NODE) {
            a = a.documentElement;
        }
        // !a.contains => a===document || text
        // 注意原生 contains 判断时 a===b 也返回 true
        b = b.parentNode;

        if (a == b) {
            return true;
        }

        // when b is document, a.contains(b) 不支持的接口 in ie
        if (b && b.nodeType == Dom.NodeType.ELEMENT_NODE) {
            return a.contains && a.contains(b);
        } else {
            return false;
        }
    };

    var div = document.createElement("div");
    div.appendChild(document.createComment(""));

    var getElementsByTagName;

    if (div.getElementsByTagName("*").length) {
        getElementsByTagName = function (name, context) {
            var nodes = context.getElementsByTagName(name),
                needsFilter = name == '*';
            // <input id='length'>
            if (needsFilter || typeof nodes.length != 'number') {
                var ret = [],
                    i = 0,
                    el;
                while (el = nodes[i++]) {
                    if (!needsFilter || el.nodeType === 1) {
                        ret.push(el);
                    }
                }
                return ret;
            } else {
                return nodes;
            }
        };
    } else {
        getElementsByTagName = function (name, context) {
            return context.getElementsByTagName(name);
        };
    }

    Dom._getElementsByTagName = getElementsByTagName;

    var getAttr = Dom._getSimpleAttr;
    Dom._getElementById = function (id, doc) {
        var el = doc.getElementById(id);
        if (el && getAttr(el, 'id') !== id) {
            var children = getElementsByTagName('*', doc);
            for (var i = 0, l = children.length; i < l; i++) {
                if (getAttr(children[i], 'id') == id) {
                    return children[i];
                }
            }
        }
        return el;
    };
}, {
    requires: ['dom/base']
});
/**
 * @ignore
 * transform hack for ie
 * @author yiminghe@gmail.com
 */
KISSY.add('dom/ie/transform', function (S, Dom) {
    var cssHooks = Dom._cssHooks;
    var rMatrix = /progid:DXImageTransform.Microsoft.Matrix\(([^)]*)\)/;

    cssHooks.transform = {
        get: function (elem, computed) {
            var elemStyle = elem[computed ? 'currentStyle' : 'style'],
                matrix;
            if (elemStyle && rMatrix.test(elemStyle.filter)) {
                matrix = RegExp.$1.split(",");
                var dx = 0 ,
                    dy = 0;
                var dxs = matrix[4] && matrix[4].split("=");
                var dys = matrix[5] && matrix[5].split("=");
                if (dxs && dxs[0].toLowerCase() == 'dx') {
                    dx = parseFloat(dxs[1]);
                }
                if (dys && dys[0].toLowerCase() == 'dy') {
                    dy = parseFloat(dys[1]);
                }
                matrix = [
                    matrix[0].split("=")[1],
                    matrix[2].split("=")[1],
                    matrix[1].split("=")[1],
                    matrix[3].split("=")[1],
                    dx,
                    dy
                ];
            } else {
                return computed ? 'none' : '';
            }
            return 'matrix(' + matrix.join(',') + ')';
        },

        set: function (elem, value) {
            var elemStyle = elem.style,
                currentStyle = elem.currentStyle,
                matrixVal,
                region = {
                    width: elem.clientWidth,
                    height: elem.clientHeight
                },
                center = {
                    x: region.width / 2,
                    y: region.height / 2
                },
            // ie must be set inline
                origin = parseOrigin(elem.style['transformOrigin'], region),
                filter;
            elemStyle.zoom = 1;
            if (value) {
                value = matrix(value);
                var afterCenter = getCenterByOrigin(value, origin, center);
                afterCenter.x = afterCenter[0][0];
                afterCenter.y = afterCenter[1][0];
                matrixVal = [
                    "progid:DXImageTransform.Microsoft.Matrix(" +
                        "M11=" + value[0][0],
                    "M12=" + value[0][1],
                    "M21=" + value[1][0],
                    "M22=" + value[1][1],
                    // no effect in this filter set
                    // but used for get to keep status
                    // Dom.css(t,'transform',Dom.css(t,'transform'))
                    "Dx=" + value[0][2],
                    "Dy=" + value[1][2],
                    'SizingMethod="auto expand"'
                ].join(',') + ')';
            } else {
                matrixVal = '';
            }
            filter = currentStyle && currentStyle.filter || elemStyle.filter || "";

            if (!matrixVal && !S.trim(filter.replace(rMatrix, ''))) {
                // Setting style.filter to null, '' & ' ' still leave 'filter:' in the cssText
                // if 'filter:' is present at all, clearType is disabled, we want to avoid this
                // style.removeAttribute is IE Only, but so apparently is this code path...
                elemStyle.removeAttribute('filter');
                if (// unset inline opacity
                    !matrixVal ||
                        // if there is no filter style applied in a css rule, we are done
                        currentStyle && !currentStyle.filter) {
                    return;
                }
            }

            // otherwise, set new filter values
            // 如果不设，就不能覆盖外部样式表定义的样式，一定要设
            elemStyle.filter = rMatrix.test(filter) ?
                filter.replace(rMatrix, matrixVal) :
                filter + (filter ? ', ' : '') + matrixVal;

            if (matrixVal) {
                var realCenter = {
                    x: elem.offsetWidth / 2,
                    y: elem.offsetHeight / 2
                };
                elemStyle.marginLeft = afterCenter.x - realCenter.x + 'px';
                elemStyle.marginTop = afterCenter.y - realCenter.y + 'px';
            } else {
                elemStyle.marginLeft = elemStyle.marginTop = 0;
            }

        }
    };

    function getCenterByOrigin(m, origin, center) {
        var w = origin[0],
            h = origin[1];
        return multipleMatrix([
            [1, 0, w],
            [0, 1, h],
            [0, 0, 1]
        ], m, [
            [1, 0, -w],
            [0, 1, -h],
            [0, 0, 1]
        ], [
            [center.x],
            [center.y],
            [1]
        ]);
    }

    function parseOrigin(origin, region) {
        origin = origin || '50% 50%';
        origin = origin.split(/\s+/);
        if (origin.length == 1) {
            origin[1] = origin[0];
        }
        for (var i = 0; i < origin.length; i++) {
            var val = parseFloat(origin[i]);
            if (S.endsWith(origin[i], '%')) {
                origin[i] = val * region[i ? 'height' : 'width'] / 100;
            } else {
                origin[i] = val;
            }
        }
        return origin;
    }

    // turn transform string into standard matrix form
    function matrix(transform) {
        transform = transform.split(")");
        var trim = S.trim,
            i = -1,
            l = transform.length - 1,
            split, prop, val,
            ret = cssMatrixToComputableMatrix([1, 0, 0, 1, 0, 0]),
            curr;

        // Loop through the transform properties, parse and multiply them
        while (++i < l) {
            split = transform[i].split("(");
            prop = trim(split[0]);
            val = split[1];
            curr = [1, 0, 0, 1, 0, 0];
            switch (prop) {
                case "translateX":
                    curr[4] = parseInt(val, 10);
                    break;

                case "translateY":
                    curr[5] = parseInt(val, 10);
                    break;

                case 'translate':
                    val = val.split(",");
                    curr[4] = parseInt(val[0], 10);
                    curr[5] = parseInt(val[1] || 0, 10);
                    break;

                case 'rotate':
                    val = toRadian(val);
                    curr[0] = Math.cos(val);
                    curr[1] = Math.sin(val);
                    curr[2] = -Math.sin(val);
                    curr[3] = Math.cos(val);
                    break;

                case 'scaleX':
                    curr[0] = +val;
                    break;

                case 'scaleY':
                    curr[3] = +val;
                    break;

                case 'scale':
                    val = val.split(",");
                    curr[0] = +val[0];
                    curr[3] = val.length > 1 ? +val[1] : +val[0];
                    break;

                case "skewX":
                    curr[2] = Math.tan(toRadian(val));
                    break;

                case "skewY":
                    curr[1] = Math.tan(toRadian(val));
                    break;

                case 'matrix':
                    val = val.split(",");
                    curr[0] = +val[0];
                    curr[1] = +val[1];
                    curr[2] = +val[2];
                    curr[3] = +val[3];
                    curr[4] = parseInt(val[4], 10);
                    curr[5] = parseInt(val[5], 10);
                    break;
            }
            ret = multipleMatrix(ret, cssMatrixToComputableMatrix(curr));
        }

        return ret;
    }

    function cssMatrixToComputableMatrix(matrix) {
        return[
            [matrix[0], matrix[2], matrix[4]],
            [matrix[1], matrix[3], matrix[5]],
            [0, 0, 1]
        ];
    }

    function setMatrix(m, x, y, v) {
        if (!m[x]) {
            m[x] = [];
        }
        m[x][y] = v;
    }

    function multipleMatrix(m1, m2) {

        if (arguments.length > 2) {
            var ret = m1;
            for (var i = 1; i < arguments.length; i++) {
                ret = multipleMatrix(ret, arguments[i]);
            }
            return ret;
        }

        var m = [],
            r1 = m1.length,
            r2 = m2.length,
            c2 = m2[0].length;

        for (i = 0; i < r1; i++) {
            for (var k = 0; k < c2; k++) {
                var sum = 0;
                for (var j = 0; j < r2; j++) {
                    sum += m1[i][j] * m2[j][k];
                }
                setMatrix(m, i, k, sum);
            }
        }

        return m;
    }

    // converts an angle string in any unit to a radian Float
    function toRadian(value) {
        return value.indexOf("deg") > -1 ?
            parseInt(value, 10) * (Math.PI * 2 / 360) :
            parseFloat(value);
    }
}, {
    requires: ['dom/base']
});

/**
 * @ignore
 * refer:
 * - https://github.com/louisremi/jquery.transform.js
 * - http://hg.mozilla.org/mozilla-central/file/7cb3e9795d04/layout/style/nsStyleAnimation.cpp#l971
 */
/**
 * @ignore
 * handle input selection and cursor position ie hack
 * @author yiminghe@gmail.com
 */
KISSY.add('dom/ie/input-selection', function (S, Dom) {
    var propHooks = Dom._propHooks;
    // note :
    // in ie textarea can not set selectionStart or selectionEnd between '\r' and '\n'
    // else kissy will move start to one step backward and move end to one step forword
    // 1\r^\n2\r^\n3
    // =>
    // 1^\r\n2\r\n^3
    propHooks.selectionStart = {
        set: function (elem, start) {
            var selectionRange = getSelectionRange(elem),
                inputRange = getInputRange(elem);
            if (inputRange.inRange(selectionRange)) {
                var end = getStartEnd(elem, 1)[1],
                    diff = getMovedDistance(elem, start, end);
                selectionRange.collapse(false);
                selectionRange.moveStart('character', -diff);
                if (start > end) {
                    selectionRange.collapse(true);
                }
                selectionRange.select();
            }
        },
        get: function (elem) {
            return getStartEnd(elem)[0];
        }
    };

    propHooks.selectionEnd = {
        set: function (elem, end) {
            var selectionRange = getSelectionRange(elem),
                inputRange = getInputRange(elem);
            if (inputRange.inRange(selectionRange)) {
                var start = getStartEnd(elem)[0],
                    diff = getMovedDistance(elem, start, end);
                selectionRange.collapse(true);
                selectionRange.moveEnd('character', diff);
                if (start > end) {
                    selectionRange.collapse(false);
                }
                selectionRange.select();

            }
        },
        get: function (elem) {
            return getStartEnd(elem, 1)[1];
        }
    };

    function getStartEnd(elem, includeEnd) {
        var start = 0,
            end = 0,
            selectionRange = getSelectionRange(elem),
            inputRange = getInputRange(elem);
        if (inputRange.inRange(selectionRange)) {
            inputRange.setEndPoint('EndToStart', selectionRange);
            start = getRangeText(elem, inputRange).length;
            if (includeEnd) {
                end = start + getRangeText(elem, selectionRange).length;
            }
        }
        return [start, end];
    }

    function getSelectionRange(elem) {
        return  elem.ownerDocument.selection.createRange();
    }

    function getInputRange(elem) {
        // buggy textarea , can not pass inRange test
        if (elem.type == 'textarea') {
            var range = elem.document.body.createTextRange();
            range.moveToElementText(elem);
            return range;
        } else {
            return elem.createTextRange();
        }
    }

    // moveEnd("character",1) will jump "\r\n" at one step
    function getMovedDistance(elem, s, e) {
        var start = Math.min(s, e);
        var end = Math.max(s, e);
        if (start == end) {
            return 0;
        }
        if (elem.type == "textarea") {
            var l = elem.value.substring(start, end).replace(/\r\n/g, '\n').length;
            if (s > e) {
                l = -l;
            }
            return l;
        } else {
            return e - s;
        }
    }

    // range.text will not contain "\r\n" if "\r\n" is at end of this range
    function getRangeText(elem, range) {
        if (elem.type == "textarea") {
            var ret = range.text,
                testRange = range.duplicate();

            // collapsed
            if (testRange.compareEndPoints('StartToEnd', testRange) == 0) {
                return ret;
            }

            testRange.moveEnd('character', -1);

            // consider end \r\n
            if (testRange.text == ret) {
                ret += '\r\n';
            }

            return ret;
        } else {
            return range.text;
        }
    }
}, {
    requires: ['dom/base']
});
/**
 * @ignore
 * dirty hack for ie
 * @author yiminghe@gmail.com
 */
KISSY.add('dom/ie', function (S, Dom) {
    return Dom;
}, {
    requires: [
        './ie/attr',
        './ie/create',
        './ie/insertion',
        './ie/style',
        './ie/traversal',
        './ie/transform',
        './ie/input-selection'
    ]
});

