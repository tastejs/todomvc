/*
Copyright 2013, KISSY v1.40dev
MIT Licensed
build time: Sep 17 22:59
*/
/*
 Combined processedModules by KISSY Module Compiler: 

 dom/class-list
*/

/**
 * implement class-list for ie<10
 * @ignore
 * @author lifesinger@gmail.com, yiminghe@gmail.com
 */
KISSY.add('dom/class-list', function (S, Dom) {
    var SPACE = ' ',
        RE_CLASS = /[\n\t\r]/g;

    function norm(elemClass) {
        return (SPACE + elemClass + SPACE).replace(RE_CLASS, SPACE);
    }

    return S.mix(Dom, {

        _hasClass: function (elem, classNames) {
            var elemClass = elem.className,
                className,
                cl,
                j;
            if (elemClass) {
                className = norm(elemClass);
                for (j = 0, cl = classNames.length; j < cl; j++) {
                    if (className.indexOf(SPACE + classNames[j] + SPACE) < 0) {
                        return false
                    }
                }
                return true;
            }
            return false;
        },

        _addClass: function (elem, classNames) {
            var elemClass = elem.className,
                normClassName,
                cl = classNames.length,
                setClass,
                j;
            if (elemClass) {
                normClassName = norm(elemClass);
                setClass = elemClass;
                j = 0;
                for (; j < cl; j++) {
                    if (normClassName.indexOf(SPACE + classNames[j] + SPACE) < 0) {
                        setClass += SPACE + classNames[j];
                    }
                }
                setClass = S.trim(setClass);
            } else {
                setClass = classNames.join(' ');
            }
            elem.className = setClass;
        },

        _removeClass: function (elem, classNames) {
            var elemClass = elem.className,
                className,
                cl = classNames.length,
                j,
                needle;
            if (elemClass && cl) {
                className = norm(elemClass);
                j = 0;
                for (; j < cl; j++) {
                    needle = SPACE + classNames[j] + SPACE;
                    // 一个 cls 有可能多次出现：'link link2 link link3 link'
                    while (className.indexOf(needle) >= 0) {
                        className = className.replace(needle, SPACE);
                    }
                }
                elem.className = S.trim(className);
            }
        },

        '_toggleClass': function (elem, classNames, force) {
            var j, className,
                result,
                method,
                self = this,
                removed = [],
                added = [],
                cl = classNames.length;
            for (j = 0; j < cl; j++) {
                className = classNames[j];
                result = self._hasClass(elem, [className]);
                method = result ? force !== true && "remove" :
                    force !== false && "add";
                if (method == 'remove') {
                    removed.push(className)
                } else if (method == 'add') {
                    added.push(className);
                }
            }
            if (added.length)
                self._addClass(elem, added);
            if (removed.length)
                self._removeClass(elem, removed);
        }

    });

}, {
    requires: ['dom/base']
});

