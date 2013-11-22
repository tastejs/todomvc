/*
Copyright 2013, KISSY v1.40dev
MIT Licensed
build time: Sep 18 00:20
*/
/*
 Combined processedModules by KISSY Module Compiler: 

 event/dom/hashchange
*/

/**
 * @ignore
 * hashchange event for non-standard browser
 * @author yiminghe@gmail.com, xiaomacji@gmail.com
 */
KISSY.add('event/dom/hashchange', function (S, DomEvent, Dom) {

    var UA = S.UA,
        Special = DomEvent.Special,
        win = S.Env.host,
        doc = win.document,
        docMode = doc && doc['documentMode'],
        REPLACE_HISTORY = '__replace_history_' + S.now(),
        ie = docMode || UA['ie'],
        HASH_CHANGE = 'hashchange';

    DomEvent.REPLACE_HISTORY = REPLACE_HISTORY;

    // 1. 不支持 hashchange 事件，支持 hash 历史导航(opera??)：定时器监控
    // 2. 不支持 hashchange 事件，不支持 hash 历史导航(ie67) : iframe + 定时器

    function getIframeDoc(iframe) {
        return iframe.contentWindow.document;
    }

    var POLL_INTERVAL = 50,
        IFRAME_TEMPLATE = '<html><head><title>' + (doc && doc.title || '') +
            ' - {hash}</title>{head}</head><body>{hash}</body></html>',

        getHash = function () {
            // 不能 location.hash
            // 1.
            // http://xx.com/#yy?z=1
            // ie6 => location.hash = #yy
            // 其他浏览器 => location.hash = #yy?z=1
            // 2.
            // #!/home/q={%22thedate%22:%2220121010~20121010%22}
            // firefox 15 => #!/home/q={"thedate":"20121010~20121010"}
            // !! :(
            var uri = new S.Uri(location.href);
            return '#' + uri.getFragment();
        },

        timer,

    // 用于定时器检测，上次定时器记录的 hash 值
        lastHash,

        poll = function () {
            var hash = getHash(), replaceHistory;

            if (replaceHistory = S.endsWith(hash, REPLACE_HISTORY)) {
                hash = hash.slice(0, -REPLACE_HISTORY.length);
                // 去除 ie67 hack 标记
                location.hash = hash;
            }
            if (hash !== lastHash) {
                // S.log('poll success :' + hash + ' :' + lastHash);
                // 通知完调用者 hashchange 事件前设置 lastHash
                lastHash = hash;
                // ie<8 同步 : hashChange -> onIframeLoad
                hashChange(hash, replaceHistory);
            }
            timer = setTimeout(poll, POLL_INTERVAL);
        },

        hashChange = ie && ie < 8 ? function (hash, replaceHistory) {
            // S.log('set iframe html :' + hash);
            var html = S.substitute(IFRAME_TEMPLATE, {
                    // 防止 hash 里有代码造成 xss
                    // 后面通过 innerText，相当于 unEscapeHtml
                    hash: S.escapeHtml(hash),
                    // 一定要加哦
                    head: Dom.isCustomDomain() ? ("<script>" +
                        "document." +
                        "domain = '" +
                        doc.domain
                        + "';</script>") : ''
                }),
                iframeDoc = getIframeDoc(iframe);
            try {
                // ie 下不留历史记录！
                if (replaceHistory) {
                    iframeDoc.open("text/html", "replace");
                } else {
                    // 写入历史 hash
                    iframeDoc.open();
                }
                // 取时要用 innerText !!
                // 否则取 innerHTML 会因为 escapeHtml 导置 body.innerHTMl != hash
                iframeDoc.write(html);
                iframeDoc.close();
                // 立刻同步调用 onIframeLoad !!!!
            } catch (e) {
                // S.log('doc write error : ', 'error');
                // S.log(e, 'error');
            }
        } : function () {
            notifyHashChange();
        },

        notifyHashChange = function () {
            // S.log('hash changed : ' + getHash());
            // does not need bubbling
            DomEvent.fireHandler(win, HASH_CHANGE);
        },
        setup = function () {
            if (!timer) {
                poll();
            }
        },
        tearDown = function () {
            timer && clearTimeout(timer);
            timer = 0;
        },
        iframe;

    // ie6, 7, 覆盖一些function
    if (ie && ie < 8) {

        /*
         前进后退 : start -> notifyHashChange
         直接输入 : poll -> hashChange -> start
         iframe 内容和 url 同步
         */
        setup = function () {
            if (!iframe) {
                var iframeSrc = Dom.getEmptyIframeSrc();
                //http://www.paciellogroup.com/blog/?p=604
                iframe = Dom.create('<iframe ' +
                    (iframeSrc ? 'src="' + iframeSrc + '"' : '') +
                    ' style="display: none" ' +
                    'height="0" ' +
                    'width="0" ' +
                    'tabindex="-1" ' +
                    'title="empty"/>');
                // Append the iframe to the documentElement rather than the body.
                // Keeping it outside the body prevents scrolling on the initial
                // page load
                Dom.prepend(iframe, doc.documentElement);

                // init，第一次触发，以后都是 onIframeLoad
                DomEvent.add(iframe, 'load', function () {
                    DomEvent.remove(iframe, 'load');
                    // Update the iframe with the initial location hash, if any. This
                    // will create an initial history entry that the user can return to
                    // after the state has changed.
                    hashChange(getHash());
                    DomEvent.add(iframe, 'load', onIframeLoad);
                    poll();
                });

                // Whenever `document.title` changes, update the Iframe's title to
                // prettify the back/next history menu entries. Since IE sometimes
                // errors with 'Unspecified error' the very first time this is set
                // (yes, very useful) wrap this with a try/catch block.
                doc.onpropertychange = function () {
                    try {
                        if (event.propertyName === 'title') {
                            getIframeDoc(iframe).title =
                                doc.title + ' - ' + getHash();
                        }
                    } catch (e) {
                    }
                };

                /*
                 前进后退 ： onIframeLoad -> 触发
                 直接输入 : timer -> hashChange -> onIframeLoad -> 触发
                 触发统一在 start(load)
                 iframe 内容和 url 同步
                 */
                function onIframeLoad() {
                    // S.log('iframe start load..');

                    // 2011.11.02 note: 不能用 innerHTML 会自动转义！！
                    // #/x?z=1&y=2 => #/x?z=1&amp;y=2
                    var c = S.trim(getIframeDoc(iframe).body.innerText),
                        ch = getHash();

                    // 后退时不等
                    // 定时器调用 hashChange() 修改 iframe 同步调用过来的(手动改变 location)则相等
                    if (c != ch) {
                        // S.log('set loc hash :' + c);
                        location.hash = c;
                        // 使 last hash 为 iframe 历史， 不然重新写iframe，
                        // 会导致最新状态（丢失前进状态）

                        // 后退则立即触发 hashchange，
                        // 并更新定时器记录的上个 hash 值
                        lastHash = c;
                    }
                    notifyHashChange();
                }
            }
        };

        tearDown = function () {
            timer && clearTimeout(timer);
            timer = 0;
            DomEvent.detach(iframe);
            Dom.remove(iframe);
            iframe = 0;
        };
    }

    Special[HASH_CHANGE] = {
        setup: function () {
            if (this !== win) {
                return;
            }
            // 第一次启动 hashchange 时取一下，不能类库载入后立即取
            // 防止类库嵌入后，手动修改过 hash，
            lastHash = getHash();
            // 不用注册 dom 事件
            setup();
        },
        tearDown: function () {
            if (this !== win) {
                return;
            }
            tearDown();
        }
    };
}, {
    requires: ['event/dom/base', 'dom']
});

/*
 已知 bug :
 - ie67 有时后退后取得的 location.hash 不和地址栏一致，导致必须后退两次才能触发 hashchange

 v1 : 2010-12-29
 v1.1: 支持非IE，但不支持onhashchange事件的浏览器(例如低版本的firefox、safari)
 refer : http://yiminghe.javaeye.com/blog/377867
 https://github.com/cowboy/jquery-hashchange
 */

