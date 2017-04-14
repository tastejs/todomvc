/*
Copyright 2013, KISSY v1.40dev
MIT Licensed
build time: Sep 18 00:20
*/
/*
 Combined processedModules by KISSY Module Compiler: 

 event/dom/focusin
*/

/**
 * @ignore
 * event-focusin
 * @author yiminghe@gmail.com
 */
KISSY.add('event/dom/focusin', function (S, DomEvent) {

    var Special = DomEvent.Special;

    // 让非 IE 浏览器支持 focusin/focusout
    S.each([
        { name: 'focusin', fix: 'focus' },
        { name: 'focusout', fix: 'blur' }
    ], function (o) {
        var key = S.guid('attaches_' + S.now() + '_');
        Special[o.name] = {
            // 统一在 document 上 capture focus/blur 事件，然后模拟冒泡 fire 出来
            // 达到和 focusin 一样的效果 focusin -> focus
            // refer: http://yiminghe.iteye.com/blog/813255
            setup: function () {
                // this maybe document
                var doc = this.ownerDocument || this;
                if (!(key in doc)) {
                    doc[key] = 0;
                }
                doc[key] += 1;
                if (doc[key] === 1) {
                    doc.addEventListener(o.fix, handler, true);
                }
            },

            tearDown: function () {
                var doc = this.ownerDocument || this;
                doc[key] -= 1;
                if (doc[key] === 0) {
                    doc.removeEventListener(o.fix, handler, true);
                }
            }
        };

        function handler(event) {
            var target = event.target;
            return DomEvent.fire(target, o.name);
        }

    });

    return DomEvent;
}, {
    requires: ['event/dom/base']
});

/*
 yiminghe@gmail.com: 2013-06-06
  - focusin blur 顺序注意 <input1 /><div2><input2 /></div2>, focus from input1 to input2
  - ie: div2 focusin input1 blur
  - others: input1 blur div2 focusin

 yiminghe@gmail.com: 2011-06-07
  - 更加合理的模拟冒泡顺序，子元素先出触发，父元素后触发
 */

