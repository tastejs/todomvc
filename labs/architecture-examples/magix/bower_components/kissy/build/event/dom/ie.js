/*
Copyright 2013, KISSY v1.40dev
MIT Licensed
build time: Sep 18 00:20
*/
/*
 Combined processedModules by KISSY Module Compiler: 

 event/dom/ie/change
 event/dom/ie/submit
 event/dom/ie
*/

/**
 * @ignore
 *  change bubble and checkbox/radio fix patch for ie<9
 * @author yiminghe@gmail.com
 */
KISSY.add('event/dom/ie/change', function (S, DomEvent, Dom) {
    var Special = DomEvent.Special,
        R_FORM_EL = /^(?:textarea|input|select)$/i;

    function isFormElement(n) {
        return R_FORM_EL.test(n.nodeName);
    }

    function isCheckBoxOrRadio(el) {
        var type = el.type;
        return type == 'checkbox' || type == 'radio';
    }

    Special['change'] = {
        setup: function () {
            var el = this;
            if (isFormElement(el)) {
                // checkbox/radio only fires change when blur in ie<9
                // so use another technique from jquery
                if (isCheckBoxOrRadio(el)) {
                    // change in ie<9
                    // change = propertychange -> click
                    DomEvent.on(el, 'propertychange', propertyChange);
                    // click may not cause change! (eg: radio)
                    DomEvent.on(el, 'click', onClick);
                } else {
                    // other form elements use native , do not bubble
                    return false;
                }
            } else {
                // if bind on parentNode ,lazy bind change event to its form elements
                // note event order : beforeactivate -> change
                // note 2: checkbox/radio is exceptional
                DomEvent.on(el, 'beforeactivate', beforeActivate);
            }
        },
        tearDown: function () {
            var el = this;
            if (isFormElement(el)) {
                if (isCheckBoxOrRadio(el)) {
                    DomEvent.remove(el, 'propertychange', propertyChange);
                    DomEvent.remove(el, 'click', onClick);
                } else {
                    return false;
                }
            } else {
                DomEvent.remove(el, 'beforeactivate', beforeActivate);
                S.each(Dom.query('textarea,input,select', el), function (fel) {
                    if (fel.__changeHandler) {
                        fel.__changeHandler = 0;
                        DomEvent.remove(fel, 'change', {fn: changeHandler, last: 1});
                    }
                });
            }
        }
    };

    function propertyChange(e) {
        // if only checked property 's value is changed
        if (e.originalEvent.propertyName == 'checked') {
            this.__changed = 1;
        }
    }

    function onClick(e) {
        // only fire change after click and checked is changed
        // (only fire change after click on previous unchecked radio)
        if (this.__changed) {
            this.__changed = 0;
            // fire from itself
            DomEvent.fire(this, 'change', e);
        }
    }

    function beforeActivate(e) {
        var t = e.target;
        if (isFormElement(t) && !t.__changeHandler) {
            t.__changeHandler = 1;
            // lazy bind change , always as last handler among user's handlers
            DomEvent.on(t, 'change', {fn: changeHandler, last: 1});
        }
    }

    function changeHandler(e) {
        var fel = this;

        if (
        // in case stopped by user's callback,same with submit
        // http://bugs.jquery.com/ticket/11049
        // see : test/change/bubble.html
            e.isPropagationStopped() ||
                // checkbox/radio already bubble using another technique
                isCheckBoxOrRadio(fel)) {
            return;
        }
        var p;
        if (p = fel.parentNode) {
            // fire from parent , itself is handled natively
            DomEvent.fire(p, 'change', e);
        }
    }
}, {
    requires: ['event/dom/base', 'dom']
});
/**
 * @ignore
 * patch for ie<9 submit: does not bubble !
 * @author yiminghe@gmail.com
 */
KISSY.add('event/dom/ie/submit', function (S, DomEvent, Dom) {

    var Special = DomEvent.Special,
        getNodeName = Dom.nodeName;

    Special['submit'] = {
        setup: function () {
            var el = this;
            // form use native
            if (getNodeName(el) == 'form') {
                return false;
            }
            // lazy add submit for inside forms
            // note event order : click/keypress -> submit
            // key point : find the forms
            DomEvent.on(el, 'click keypress', detector);
        },
        tearDown: function () {
            var el = this;
            // form use native
            if (getNodeName(el) == 'form') {
                return false;
            }
            DomEvent.remove(el, 'click keypress', detector);
            S.each(Dom.query('form', el), function (form) {
                if (form.__submit__fix) {
                    form.__submit__fix = 0;
                    DomEvent.remove(form, 'submit', {
                        fn: submitBubble,
                        last: 1
                    });
                }
            });
        }
    };


    function detector(e) {
        var t = e.target,
            nodeName = getNodeName(t),
            form = (nodeName == 'input' || nodeName == 'button') ? t.form : null;

        if (form && !form.__submit__fix) {
            form.__submit__fix = 1;
            DomEvent.on(form, 'submit', {
                fn: submitBubble,
                last: 1
            });
        }
    }

    function submitBubble(e) {
        var form = this;
        if (form.parentNode &&
            // it is stopped by user callback
            !e.isPropagationStopped() &&
            // it is not fired manually
            !e.synthetic) {
            // simulated bubble for submit
            // fire from parentNode. if form.on('submit') , this logic is never run!
            DomEvent.fire(form.parentNode, 'submit', e);
        }
    }

}, {
    requires: ['event/dom/base', 'dom']
});
/*
 modified from jq, fix submit in ie<9
 - http://bugs.jquery.com/ticket/11049
 */
/**
 * @ignore
 * patch collection for ie<9
 * @author yiminghe@gmail.com
 */
KISSY.add('event/dom/ie', function () {

}, {
    requires: ['./ie/change', './ie/submit']
});

